import React, { Component } from 'react';
import {Container, Left, Right, Icon, Title, Body, Button}  from 'native-base';
import {Image, View, Dimensions, Alert, Text, TextInput, TouchableOpacity, ScrollView, AsyncStorage, Linking, BackHandler, NetInfo} from 'react-native';
import Images from '../Themes/Images.js';
import Styles from './Styles/MyTitleRepStyle';
import BuyerStyle from './Styles/BuyerStyle';

import { CheckBox } from 'react-native-elements';
import CustomStyle from './Styles/CustomStyle';
import renderIf from 'render-if';
import {callGetApi, callPostApi} from '../Services/webApiHandler.js' // Import 
import STRINGS from '../GlobalString/StringData'  // Import StringData.js class for string localization.
import Picker from 'react-native-picker';
import DatePicker from 'react-native-datepicker'
import Spinner from 'react-native-loading-spinner-overlay'; 

var GLOBAL = require('../Constants/global');
const  {width, height} = Dimensions.get('window')
import {authenticateUser} from '../Services/CommonValidation.js'  // Import CommonValidation class to access common methods for validations.

export default class MyTitleRep extends Component{
	constructor() {
        super();
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.state = {
            UserData:{},
			custom1: '',
			visble : false,
            animating: false,
            connectionInfo : '',
        }

        this.handleFirstConnectivityChange = this.handleFirstConnectivityChange.bind(this);

    }

    async componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
		this.setState({animating:'true'});
		response = await authenticateUser();
		if(response == '1'){
			this.setState({animating:'false'});
			this.props.navigator.push({name: 'Login', index: 0 });
		}else{
			this.getAccessToken();
		}
    }

    handleFirstConnectivityChange(connectionInfo) {
		this.setState({
			connectionInfo: connectionInfo.type
		});
		console.log('First change, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);

		if(connectionInfo.type != 'none') {
			this.setState({animating : 'false'}, this.componentDidMount);
		}
    }

	componentWillMount() {
        NetInfo.getConnectionInfo().then((connectionInfo) => {
			this.setState({
					connectionInfo: connectionInfo.type
			});
				console.log('Initial, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);
		});

		NetInfo.addEventListener(
			'connectionChange',
			this.handleFirstConnectivityChange
		);
    }

    componentWillUnmount() {
		
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
        NetInfo.removeEventListener(
			'connectionChange',
			this.handleFirstConnectivityChange
		);

	}

	handleBackButtonClick() {
		//this.props.navigation.goBack(null);
		this.props.navigator.push({name: 'Dashboard', index: 0 });
		return true;
	}

    openmailortel(url){
        Linking.canOpenURL(url).then(supported => {
            if (!supported) {
              console.log('Can\'t handle url: '+url)
            } else {
              return Linking.openURL(url)
      
            }
          }).catch(err => console.error('An error occurred', err))
    }
	
	openLinkForCustomType(){
		if(this.state.UserData.custom1_enable == '1'){
			if(this.state.UserData.custom1Type == "P") {
				url = "tel:"+this.state.custom1Title;
			}
			else if(this.state.UserData.custom1Type == "W") {
				url = this.state.UserData.siteurl;
			}
			else if(this.state.UserData.custom1Type == "E"){
				url = "mailto:"+this.state.UserData.custom1Title;
			}
			else if(this.state.UserData.custom1Type == "S"){
				url = "mailto:"+this.state.UserData.custom1Title;
			}
		}else
		{
			Toast.makeText(getApplicationContext(), "There is no information available for Home Warranty", Toast.LENGTH_SHORT).show();
		}
		Linking.canOpenURL(url).then(supported => {
            if (!supported) {
              console.log('Can\'t handle url: '+url)
            } else {
              return Linking.openURL(url)
      
            }
          }).catch(err => console.error('An error occurred', err))
    }

    getAccessToken(){
        AsyncStorage.getItem("userDetail").then((value) => {
            value = JSON.parse(value);
            let user_id = value.user_id;
            let apiCallObjtemp = {
                "userId":user_id,
            };
            this.getUserData(apiCallObjtemp);
        }).done();
    }

    getUserData(apiCallObjtemp){
        callPostApi(GLOBAL.BASE_URL+GLOBAL.User_Detail, apiCallObjtemp, "")
        .then((response) => {
            // Continue your code here...
            if (result.status == 'success')
            {   
                let UserDatatemp = result.data;
                // callPostApi("http://www.firstphoneapps.com/webservice/titlerepdetails/repid/"+UserDatatemp.titleRep, {}, "")
                callPostApi(GLOBAL.title_rep_details + result.data.titleRep, {}, "")
                .then((response) => { 
                    if (result[0].id){
						this.setState({animating:'false'});
                        this.setState({UserData : result[0]})
                    }
                });
            }
            else {
				this.setState({animating:'false'});
                Alert.alert('Alert!', JSON.stringify(result.message))
            }

        });
    }

	onBackButtonPress() {
		this.props.navigator.pop()
	}


    render(){
        
        let showable;
        if(this.state.animating == 'true') {
			this.state.scrollvalue = false;
			this.state.visble = true;
		} else {
			this.state.scrollvalue = true;
			this.state.visble = false;
        }
        
        if(this.state.connectionInfo != 'none') {
            showable=            <View style={Styles.MainContainer}>
            <View style={Styles.iphonexHeader}></View>
            <View>
                <Spinner visible={this.state.visble} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
            </View>	
            <View style={Styles.HeaderContainer}>
                <Image style={Styles.HeaderBackground} source={Images.header_background}></Image>
                <TouchableOpacity style={{width:'20%'}} onPress={this.onBackButtonPress.bind(this)}>
                    <Image style={Styles.back_icon} source={Images.back_icon}/>
                </TouchableOpacity>
                <Text style={Styles.header_title}>{STRINGS.t('myTitleRep')}</Text>
            </View>
            <View style={Styles.BodyContainer}>     
                <View style={Styles.IconContainer}>
                    <View style={{width:'66%'}}>
                        <Text style={[Styles.headingtext,{width:'100%',textAlign:'center'}]}>{this.state.UserData.name}</Text>
                        <Text style={[Styles.headingtext,{width:'100%',textAlign:'center'}]}>{this.state.UserData.title}</Text>
                        <View style={Styles.IconContainer}>
                            <TouchableOpacity style={{width:'33.33%'}} onPress={()=>{this.openmailortel("tel:"+this.state.UserData.phone)}}>
                                <Image style={Styles.iconssmall} source={Images.phone_number_icon}/>
                                <Text style={Styles.imagetext}>Phone</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{width:'33.33%'}} onPress={()=>{this.openmailortel("sms:"+this.state.UserData.phone)}}>
                                <Image style={Styles.iconssmall} source={Images.text_icon}/>
                                <Text style={Styles.imagetext}>Text</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{width:'33.33%'}} onPress={()=>{this.openmailortel("mailto:"+this.state.UserData.email)}}>
                                <Image style={Styles.iconssmall} source={Images.mailing_address_icon}/>
                                <Text style={Styles.imagetext}>Email</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{width:'34%',height:'100%'}}>
                        <Image style={Styles.iconslarge} source={(this.state.UserData.image) ? this.state.UserData.image : Images.eagle}/>
                    </View>
                </View>   
                <View style={Styles.underline}></View>
                <TouchableOpacity style={{paddingBottom:10}} onPress={()=>{this.openmailortel(this.state.UserData.siteurl)}}>             
                    <Text style={Styles.headingtext}>{STRINGS.t('Website')}</Text>
                </TouchableOpacity>
                <View style={Styles.underline}></View>
                <TouchableOpacity style={{paddingBottom:10}} onPress={()=>{this.openmailortel("tel:"+this.state.UserData.customer_service)}}>             
                    <Text style={Styles.headingtext}>{STRINGS.t('CustomerService')}</Text>
                </TouchableOpacity>
                <View style={Styles.underline}></View>
                <TouchableOpacity style={{paddingBottom:10}} onPress={()=>{this.openLinkForCustomType()}}>             
                    <Text style={Styles.headingtext}>{this.state.UserData.custom1}</Text>
                </TouchableOpacity>
                <View style={Styles.underline}></View>
            </View>
            <View style={Styles.iphonexFooter}></View>
        </View>
        } else {
            showable=
			<View style={{flex : 1}}>
				<View style={{flex : 2}}>
					<View style={BuyerStyle.HeaderContainer}>	
						<Image style={BuyerStyle.HeaderBackground} source={Images.header_background}></Image>
						<TouchableOpacity style={{width:'20%'}} onPress={this.onBackButtonPress.bind(this)}>
							<Image style={BuyerStyle.back_icon} source={Images.back_icon}/>
						</TouchableOpacity>
						<Text style={BuyerStyle.header_title}>{STRINGS.t('myTitleRep')}</Text>
			
						<View style={{alignItems:'flex-start',width:'20%',paddingRight:20}}>
							
						</View> 
					</View>
				</View>
				<View style={{flex : 6, justifyContent: 'center', alignItems: 'center'}}>
					<Image style={{width :'60%', height : 160, justifyContent: 'center', alignItems: 'center'}} source={Images.internetConnectionOffIcon}/>
					<View style={{flexDirection : 'column', marginTop : 10}}>
						<Text style={{justifyContent: 'center', alignItems: 'center'}}>Please check your internet connection.</Text>
					</View>
				</View>
				<View style={{flex : 2, justifyContent: 'center', alignItems: 'center'}}>
				</View>
			</View>
        }

        
        return(
            <View style={{flex : 1}}>
                {showable}
            </View>
        )
    }
}