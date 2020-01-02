import React, { Component } from 'react';
import {Container, Left, Right, Icon, Title, Body, Button}  from 'native-base';
import {Image, View, Dimensions, Alert, NetInfo, Text, TextInput, TouchableOpacity, ScrollView, AsyncStorage} from 'react-native';
import Images from '../Themes/Images.js';
import Styles from './Styles/ChangeStateStyle';
import { CheckBox } from 'react-native-elements';
import CustomStyle from './Styles/CustomStyle';
import renderIf from 'render-if';
import {callGetApi, callPostApi} from '../Services/webApiHandler.js' // Import 
import STRINGS from '../GlobalString/StringData'  // Import StringData.js class for string localization.
import Picker from 'react-native-picker';
import DatePicker from 'react-native-datepicker'

var GLOBAL = require('../Constants/global');
const  {width, height} = Dimensions.get('window')

export default class ChangeState extends Component{
	constructor() {
        super();
        // this.alertfn = this.alertfn.bind(this);
        this.state = {
            State: 'Select State',
            County: 'Select County',
            ZipCode: ''
        }
    }
    
    componentDidMount() {
        NetInfo.isConnected.addEventListener(
        'connectionChange',
        this._handleConnectivityChange
        );
        this.callGetStatesApi();
        this.callGetCountyApi();
    }
    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener(
        'connectionChange',
        this._handleConnectivityChange
        );
    }
    _handleConnectivityChange(status) {
        console.log('*********_handleConnectivityChange: Network Connectivity status *******: ' + status);
    
    }

    
    callGetStatesApi()
    {
    callGetApi(GLOBAL.BASE_URL + GLOBAL.Get_States)
    .then((response) => {
            // Continue your code here...
            stateArray = result.data

        });
    }


    callGetCountyApi(IDofState)
    {
        callPostApi(GLOBAL.BASE_URL + GLOBAL.Get_County, {
            stateId: IDofState,
        })
        .then((response) => {console.log("county",result);
                // Continue your code here...
                countyArray = result.data
        });
    }

    
    callVerifyZipCodeApi()
    {          
        console.log("State:"+this.state.State,"County:"+this.state.County);
        if (this.state.State == 'Select State' && this.state.County == 'Select County')
        {
            this.callGetCityCountyStateApi()
        }
        else
        {
            callPostApi(GLOBAL.BASE_URL + GLOBAL.Verify_ZipCode, {
                'stateName': this.state.State,
                'countyName': this.state.County,
                'zipCode': this.state.ZipCode,
            })
            .then((response) => {
                    // Continue your code here...
                    if (result.status == 'success')
                    {
                    }
                    else {
                        Alert.alert('Alert!', JSON.stringify(result.message))
                    }

            });
        }

    }

    callGetCityCountyStateApi()
    {
        callPostApi(GLOBAL.BASE_URL + GLOBAL.Get_City_County_State, {
                'zipCode': this.state.ZipCode,
            })
        .then((response) => {console.log(13212,result)
            // Continue your code here...
            if (result.status == 'success')
            {
                let dict = result.data.statecountycity
                this.setState({County: dict.County});
                this.setState({State: dict.stateName});
                stateId = dict.stateId
                countyId = dict.countyId
                countyArray = result.data.countyList
            }
            else {
                Alert.alert('Alert!', JSON.stringify(result.message))
            }

        });
    }

    StatePicker(){
        let dataArray = [];
        for(var i=0;i<stateArray.length;i++){
            let dict = stateArray[i]
            dataArray.push(dict.statename);
        }
         Picker.init({
            pickerData: dataArray,
            onPickerConfirm: (pickedValue) => {
                  let selectedStr = pickedValue[0]
                  this.setState({State: selectedStr});
                  var index = dataArray.indexOf(selectedStr);
                  let dict = stateArray[index]
                  stateId = dict.id
                  this.callGetCountyApi(stateId)
            },
            onPickerCancel: data => {
                console.log(data);
            },
            onPickerSelect: data => {
            }
         });
         Picker.show();
    }

    CountyPicker(){
        if (typeof countyArray == 'undefined' || countyArray.length == 0)
        {
            Alert.alert('County', 'Please Select a State')
        }
        else {
            let dataArray = [];
            for(var i=0;i<countyArray.length;i++){
                let dict = countyArray[i]
                dataArray.push(dict.countyname);
            }
            Picker.init({
            pickerData: dataArray,
            onPickerConfirm: (pickedValue) => {
                    let selectedStr = pickedValue[0]
                    this.setState({County: selectedStr});
                    var index = dataArray.indexOf(selectedStr);
                    let dict = countyArray[index]
                    countyId = dict.id
                    // this.callGetTitleRepApi(stateId, countyId)
            },
            onPickerCancel: data => {
                console.log(data);
            },
            onPickerSelect: data => {
        
            }
            });
            Picker.show();
        }
    }
	
	onBackButtonPress() {
		this.props.navigator.pop()
	}


    render(){
        var stateArray = [];
        var countyArray = [];
        return(
            <View style={Styles.MainContainer}>
                <View style={Styles.iphonexHeader}></View>
                <View style={Styles.HeaderContainer}>
                    <Image style={Styles.HeaderBackground} source={Images.header_background}></Image>
                    <TouchableOpacity style={{width:'20%'}} onPress={this.onBackButtonPress.bind(this)}>
                        <Image style={Styles.back_icon} source={Images.back_icon}/>
                    </TouchableOpacity>
                    <Text style={Styles.header_title}>{STRINGS.t('changestatecounty')}</Text>
                    <TouchableOpacity style={{width:'20%'}} onPress={()=>{}}>
                        <View style={Styles.restoreview}>
                            <Text style={Styles.restoreviewtext}>{STRINGS.t('Save')}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={Styles.BodyContainer}>
                    <View style={Styles.FieldContainer}>
                        <View style={[Styles.field,{marginTop:10}]}>
                            <Text style={Styles.fieldText}>State</Text>
                            <TouchableOpacity style={Styles.dropdownto} onPress={this.StatePicker.bind(this)}>
                                <View style={Styles.dropdownfieldview}>
                                    <Text style={Styles.dropdownfieldviewtext}>{this.state.State}</Text>
                                    <Image style={Styles.dropdownicon} source={Images.dropdown_arrow}/>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={Styles.underline}></View>
                        <View style={Styles.field}>
                            <Text style={Styles.fieldText}>County</Text>
                            <TouchableOpacity style={Styles.dropdownto} onPress={this.CountyPicker.bind(this)}>
                                <View style={Styles.dropdownfieldview}>
                                    <Text style={Styles.dropdownfieldviewtext}>{this.state.County}</Text>
                                    <Image style={Styles.dropdownicon} source={Images.dropdown_arrow}/>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={Styles.underline}></View>
                        <View style={Styles.field}>
                            <Text style={Styles.fieldText}>{STRINGS.t('ZipCode')}</Text>
                            <TouchableOpacity style={Styles.dropdownto}>
                                <TextInput 
                                    keyboardType="numeric" style={Styles.zipcodeinput} 
                                    onChangeText={(zipcodeval)=>this.setState({ZipCode:zipcodeval})} 
                                    onSubmitEditing={()=>{this.callVerifyZipCodeApi()}} 
                                    underlineColorAndroid='transparent'
                                    value={this.state.ZipCode}
                                />
                            </TouchableOpacity>                            
                        </View>
                        <View style={Styles.ZipCodetextbox}>
                            <Text style={Styles.ZipCodetext}>{STRINGS.t('ZipCodetext')}</Text>
                        </View>
                        <TouchableOpacity onPress={() => {Alert.alert(
                            STRINGS.t('resetStateCounty'),
                            STRINGS.t('alerttext'),
                            [
                                {text: STRINGS.t('Cancel'), onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                {text: STRINGS.t('OK'), onPress: () => this.setState({State: 'Select State',
                                County: 'Select County',ZipCode: ''})},
                            ],
                            { cancelable: false }
                        )}}>
                            <View style={Styles.resetbtn}>
                                <Text style={Styles.resetbtntext}>{STRINGS.t('resetStateCounty')}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
          <View style={Styles.iphonexFooter}></View>
            </View>
        )
    }
}