import React, {Component} from 'react';
import {Container, Left, Right, Icon, Title, Body, Button} from 'native-base';
import {
  Image,
  View,
  Dimensions,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  AsyncStorage,
  BackHandler,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';

import Images from '../Themes/Images.js';
import Styles from './Styles/LanguageStyle';
import {CheckBox} from 'react-native-elements';
import CustomStyle from './Styles/CustomStyle';
import loginStyles from './Styles/LoginScreenStyle';; // Import LoginScreenStyle.js class from Styles Folder to maintain UI.
import BuyerStyle from './Styles/BuyerStyle';

import DropdownAlert from 'react-native-dropdownalert';
import renderIf from 'render-if';
import {callGetApi, callPostApi} from '../Services/webApiHandler.js';; // Import
import STRINGS from '../GlobalString/StringData';; // Import StringData.js class for string localization.
import Picker from 'react-native-picker';
import DatePicker from 'react-native-datepicker';;
import Selectbox from 'react-native-selectbox';
var GLOBAL = require('../Constants/global');
const {width, height} = Dimensions.get('window');;
import {authenticateUser} from '../Services/CommonValidation.js';; // Import CommonValidation class to access common methods for validations.
const tabarray = [
  {key: 0, label: 'English', value: 'en'},
  {key: 1, label: 'Spanish', value: 'es'},
  {key: 2, label: 'Vietnamese', value: 'vi'},
  {key: 3, label: 'Chinese', value: 'zh'},
  {key: 4, label: 'Japanese', value: 'ja'},
  {key: 5, label: 'Korean', value: 'ko'},
  {key: 6, label: 'Polish', value: 'pl'},
];

export default class Language extends Component {
  constructor() {
    super();
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      Language: 'English',
      dropdownval: {key: 0, label: 'English', value: 'en'},
      connectionInfo: '',
    };;
    this.handleFirstConnectivityChange = this.handleFirstConnectivityChange.bind(
      this,
    );
  }

  async componentDidMount() {
    AsyncStorage.getItem('DropdownVal')
      .then(value => {
        if  (value != 'null' && value != null) {
          newstr = value.replace(/\\/g, '');
          var newstr = JSON.parse(newstr);
          console.log(
            'value in language section DropdownVal ' + JSON.stringify(newstr),
          );
          this.setState({
            dropdownval: newstr,
          });
        }
        //console.log("value in buyer lang " + JSON.stringify(value));

      .done();

    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
    response = await authenticateUser();
    if  (response == '1') {
      this.props.navigator.push({name: 'Login', index: 0});
    }
  }

  handleFirstConnectivityChange(connectionInfo) {
    this.setState({
      connectionInfo: connectionInfo.type,,
    });
    console.log(
      'First change, type: ' +
        connectionInfo.type +
        ', effectiveType: ' +
        connectionInfo.effectiveType,
    );

    if  (connectionInfo.type != 'none') {
      this.setState({animating: 'false'}, this.componentDidMount);
    }
  }

  componentWillMount() {
    NetInfo.getConnectionInfo().then(connectionInfo => {
      this.setState({
        connectionInfo: connectionInfo.type,,
      });
      console.log(
        'Initial, type: ' +
          connectionInfo.type +
          ', effectiveType: ' +
          connectionInfo.effectiveType,
      );
    });

    NetInfo.addEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange,
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
    NetInfo.removeEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange,
    );
  }

  handleBackButtonClick() {
    //this.props.navigation.goBack(null);
    this.props.navigator.push({name: 'Dashboard', index: 0});
    return true;
  }

  onBackButtonPress() {
    this.props.navigator.pop();;
  }

  _onChange = item => {
    console.log('language item ' + JSON.stringify(item));

    AsyncStorage.setItem('DropdownVal', JSON.stringify(item)).then(() => {
      console.log('Done');;
    });

    this.setState({
      dropdownval: item,,
    });
    // the full item as defined in the list of items is passed to the onChange handler to give full
    // flexibility on what to do...
  };

  /*LanguagePicker(){
        let dataArray = ['Language'];
        Picker.init({
           pickerData: dataArray,
           pickerTitleText: 'Select',
           selectedValue: [this.state.escrowType],
           onPickerConfirm: (pickedValue) => {
                let selectedStr = pickedValue[0];
                console.log(JSON.stringify(selectedStr));
                Alert.alert(
                    " ",
                    STRINGS.t('alertlanguagetext'),
                    [
                        {text: STRINGS.t('OK'), onPress: () => console.log('OK Pressed')},
                    ],
                    { cancelable: false }
                )
           },
           onPickerCancel: data => {
               console.log(data);
           },
           onPickerSelect: data => {
           }
        });
        Picker.show();
    }*/

  updateLanguage() {
    var languageType;
    AsyncStorage.setItem(
      'Language',
      JSON.stringify(this.state.dropdownval.value),
    ).then(() => {
      console.log('Done');;
    });
    //Alert.alert
    if  (this.state.dropdownval.value == 'en') {
      languageType = 'English';
    } else if  (this.state.dropdownval.value == 'es') {
      languageType = 'Spanish';
    } else if  (this.state.dropdownval.value == 'vi') {
      languageType = 'Vietnamese';
    } else if  (this.state.dropdownval.value == 'zh') {
      languageType = 'Chinese';
    } else if  (this.state.dropdownval.value == 'ja') {
      languageType = 'Japanese';
    } else if  (this.state.dropdownval.value == 'ko') {
      languageType = 'Korean';
    } else if  (this.state.dropdownval.value == 'pl') {
      languageType = 'Polish';
    }
    message =
      'The Language displayed for your print outs has been temporarily changed to ' +
      languageType +
      ' for all prints and emailed prints. You can change it back to the default English on this page or it will automatically change back upon your next login.';
    Alert.alert('CostsFirst', message);
  }
  render() {
    let showable;
    if  (this.state.connectionInfo != 'none') {
      showable = (
        <View style={Styles.MainContainer}>
          <View style={Styles.HeaderContainer}>
            <Image
              style={Styles.HeaderBackground}
              source={Images.header_background}
            />
            <TouchableOpacity
              style={{width: '20%'}}
              onPress={this.onBackButtonPress.bind(this)}>
              <Image style={Styles.back_icon} source={Images.back_icon} />
            </TouchableOpacity>
            <Text style={Styles.header_title}>
              {STRINGS.t('languageheadtop')}
            </Text>
          </View>
          <View style={Styles.BodyContainer}>
            <Text style={Styles.headingtext}>
              {STRINGS.t('languagesubhead')}
            </Text>
            <Selectbox
              style={Styles.dropdownto}
              selectLabelStyle={{fontSize: 14}}
              selectedItem={this.state.dropdownval}
              onChange={this._onChange}
              items={tabarray}
            />

            {/*
                    <TouchableOpacity style={Styles.dropdownto} onPress={this.LanguagePicker.bind(this)}>
                        <View style={Styles.dropdownfieldview}>
                            <Text style={Styles.dropdownfieldviewtext}>{this.state.Language}</Text>
                            <Image style={Styles.dropdownicon} source={Images.dropdown_arrow}/>
                        </View>
                    </TouchableOpacity>
                */}
            <View style={Styles.underline} />
            <TouchableOpacity
              style={loginStyles.buttonContainer}
              onPress={this.updateLanguage.bind(this)}>
              <Text style={loginStyles.style_btnLogin}> SAVE</Text>
            </TouchableOpacity>
          </View>
          <DropdownAlert ref={ref => (this.dropdown = ref)} />
        </View>;
      );
    } else {
      showable = (
        <View style={{flex: 1}}>
          <View style={{flex: 2}}>
            <View style={BuyerStyle.HeaderContainer}>
              <Image
                style={BuyerStyle.HeaderBackground}
                source={Images.header_background}
              />
              <TouchableOpacity
                style={{width: '20%'}}
                onPress={this.onBackButtonPress.bind(this)}>
                <Image style={BuyerStyle.back_icon} source={Images.back_icon} />
              </TouchableOpacity>
              <Text style={BuyerStyle.header_title}>
                {STRINGS.t('languageheadtop')}
  </Text>

              <View
                style={{
                  alignItems: 'flex-start',
                  width: '20%',
                  paddingRight: 20,
                }}
              />
            </View>
          </View>
          <View
            style={{flex: 6, justifyContent: 'center', alignItems: 'center'}}>
            <Image
              style={{
                width: '60%',
                height: 160,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              source={Images.internetConnectionOffIcon}
            />
            <View style={{flexDirection: 'column', marginTop: 10}}>
              <Text style={{justifyContent: 'center', alignItems: 'center'}}>
                Please check your internet connection.
              </Text>
            </View>
          </View>
          <View
            style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}
          />
        </View>;
      );
    }
    return <View style={{flex: 1}}>{showable}</View>;
  };
}

