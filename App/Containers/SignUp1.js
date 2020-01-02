import React, { Component, } from 'react'
import { View, Text, StyleSheet, Image, TextInput, Alert, ScrollView, TouchableOpacity, NetInfo, AsyncStorage} from 'react-native';
import signUpStyles from './Styles/SignUpStyle'    // Import SignUpStyle.js class from Styles Folder to maintain UI.
import loginStyles from './Styles/LoginScreenStyle'     // Import LoginScreenStyle.js class from Styles Folder to maintain UI.
import Images from '../Themes/Images.js'          // Import Images.js class from Image Folder for images.
import STRINGS from '../GlobalString/StringData'  // Import StringData.js class for string localization.
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Styles from './Styles/SellerStyleDesign';
var GLOBAL = require('../Constants/global');
import {callPostApi} from '../Services/webApiHandler.js' // Import webApiHandler.js class for calling api.
import { Container, Content, InputGroup, Input, Icon } from 'native-base';
import DropdownAlert from 'react-native-dropdownalert';
var Header = require('./HomeHeader');
class SignUp1 extends Component {
  state = {
    usernameField: '',
	usernameError : '',
	passwordError : '',
	confirmPasswordError : '',
    password: '',
    confirm_password: '',
 };
 // Method to move on signIn screen.
 moveToSignIn()
 {
   this.props.navigator.popToTop()
 }
 moveToPrevious()
 {
   this.props.navigator.pop()
 }
 moveToNext()
 {

    if(this.state.usernameField == '') {
		this.setState({usernameError : STRINGS.t('username_error_message')});
    }else if(this.state.usernameField.length < 2 || this.state.usernameField.length > 20){
		this.setState({usernameError : STRINGS.t('username_char_error_message')});
		var errMsgFlag = '1';
	}
    if(this.state.password == '') {
		this.setState({passwordError : STRINGS.t('blank_password_error_message')});
    }
	
	if(this.state.password != "") {
		if(this.state.password.length < 6){
			this.setState({passwordError : STRINGS.t('password_error_message')});
		}
	}	
	
    if(this.state.confirm_password == '') {
		this.setState({confirmPasswordError : STRINGS.t('confirm_password_error_message')});
    } else {
      if(this.state.password != this.state.confirm_password) {
        this.setState({confirmPasswordError : STRINGS.t('confirm_password')});
      }
	  }

    if(this.state.usernameField != '' && this.state.password != '' && this.state.password.length >=6 && this.state.confirm_password != '' && this.state.password == this.state.confirm_password && this.state.usernameError == '')
    {
				 AsyncStorage.getItem("UserInfoForReg").then((value) => {
					 var dict = JSON.parse(value)
					 let dict1 = {fname: dict.fname, lname: dict.lname, email: dict.email, username:this.state.usernameField, newpass: this.state.password}
					 AsyncStorage.setItem("UserInfoForReg1", JSON.stringify(dict1));

				  }).done();

				  this.props.navigator.push({name: 'SignUp2', index: 0 });
				}  
 }

 componentDidMount() {
   NetInfo.isConnected.addEventListener(
     'connectionChange',
     this._handleConnectivityChange
   );
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
 callCheckUsernameApi()
 {
   if(this.state.usernameField != '') {
      callPostApi(GLOBAL.BASE_URL + GLOBAL.Check_Username, {
          username: this.state.usernameField,
      })
      .then((response) => {
           // Continue your code here...
           if (result.status == 'success')
           {
           }
           else {
            this.setState({usernameError : result.message});
           }

     });
    } 
 }

 onChangeUsername(text) {
  if(text != '') {
    this.setState({
      usernameError : ""
    });
  } else {
    this.setState({
      usernameError : STRINGS.t('username_error_message')
    });
  }
  newText = text.replace(/[^\w\s]/gi, '');
  return newText;	
 }


  onChange(fieldVal, fieldName) {
    if(fieldName == 'usernameError') {
      if(fieldVal != '') {
        this.setState({
          [fieldName] : ""
        });
      } else {
        this.setState({
          [fieldName] : STRINGS.t('username_error_message')
        });
      }
    }
  
    if(fieldName == 'passwordError') {
      if(fieldVal != '') {
        if(fieldVal.length < 6) {
          this.setState({
            [fieldName] : STRINGS.t('password_error_message')
          });
        } else {
          this.setState({
            [fieldName] : ""
          });
        }

      } else {
        this.setState({
          [fieldName] : STRINGS.t('blank_password_error_message')
        });
      }
    }

    if(fieldName == 'confirmPasswordError') {
      if(fieldVal != '') {
        if(this.state.password != fieldVal) {
          this.setState({
            [fieldName] : STRINGS.t('confirm_password')
          });
        } else {
          this.setState({
            [fieldName] : ""
          });
        }
      } else {
        this.setState({
          [fieldName] : STRINGS.t('confirm_password_error_message')
        });
      }
    }
  }

	onIconClick(msg){
		this.dropdown.alertWithType('error', 'Error', msg);
	}

  render() {
      return (
        <View style={loginStyles.backgroundImage}>
        <View style={loginStyles.iphonexHeader}></View>
          <Image style={Styles.header_bg} source={Images.header_background}>
        <View style={Styles.header_view}>
          <TouchableOpacity  style={Styles.back_icon_parent} onPress={this.moveToPrevious.bind(this)}>
            <Image style={Styles.back_icon} source={Images.back_icon}/>
          </TouchableOpacity> 
          <Text style={Styles.header_title}>{STRINGS.t('SIGNUP')}</Text>					
        </View>
        </Image>
          <View style={signUpStyles.backgroundViewContainer}>
          <Text style={signUpStyles.generalInfoStyle}> {STRINGS.t('Account_Information')}</Text>
          </View>

          <ScrollView style={signUpStyles.keyboardContainer}>

          <View style={signUpStyles.viewContainer}>

            <View style={signUpStyles.textInputBackgroundViewContainer}>
            <Image style = {signUpStyles.logoImage} source={Images.username}/>
            <TextInput 
              ref="Username"
              placeholderTextColor={this.state.usernameError == "" ? "#999999": "red"}
              placeholder={this.state.usernameError == "" ? STRINGS.t('Username') : this.state.usernameError} underlineColorAndroid = 'transparent' secureTextEntry={false} style={signUpStyles.textInput}  returnKeyType ="next" keyboardType="default" onChangeText={(value) => this.setState({usernameField: this.onChangeUsername(value)})} onEndEditing={this.callCheckUsernameApi.bind(this)} value={this.state.usernameField.toString()}/>
                { this.state.usernameError != '' ? <Icon onPress={() => this.onIconClick(this.state.usernameError)} name='ios-alert' style={{color:'red'}}/> : null }
                    </View>
              { this.state.usernameError != '' ? <View style={signUpStyles.lineErrorView}></View> : <View style={signUpStyles.lineView}></View> }

            <View style={signUpStyles.textInputBackgroundViewContainer}>
            <Image style = {signUpStyles.logoImage} source={Images.password} />
            <TextInput 
              ref="Password"
              
              password={true}		
              secureTextEntry={true}
              placeholderTextColor={this.state.passwordError == "" ? "#999999": "red"}
              placeholder={this.state.passwordError == "" ? STRINGS.t('Password') : this.state.passwordError} underlineColorAndroid = 'transparent' secureTextEntry={true} style={signUpStyles.textInput}  returnKeyType ="next" keyboardType="default"  onChangeText={(val) => this.setState({password: val}, this.onChange(val,'passwordError'))} />
            { this.state.passwordError != '' ? <Icon onPress={() => this.onIconClick(this.state.passwordError)} name='ios-alert' style={{color:'red'}}/> : null }
            </View>
			{ this.state.passwordError != '' ? <View style={signUpStyles.lineErrorView}></View> : <View style={signUpStyles.lineView}></View> }

            <View style={signUpStyles.textInputBackgroundViewContainer}>
            <Image style = {signUpStyles.logoImage} source={Images.password} />
            <TextInput
              ref="passNotmatched"
              password={true}		
              secureTextEntry={true}
              placeholderTextColor={this.state.confirmPasswordError == "" ? "#999999": "red"}
              placeholder={this.state.confirmPasswordError == "" ? STRINGS.t('Confirm_Password') : this.state.confirmPasswordError} underlineColorAndroid = 'transparent' secureTextEntry={true} style={signUpStyles.textInput}  returnKeyType ="next" keyboardType="default"  onChangeText={(val) => this.setState({confirm_password: val}, this.onChange(val, 'confirmPasswordError'))} />
            { this.state.confirmPasswordError != '' ? <Icon onPress={() => this.onIconClick(this.state.confirmPasswordError)} name='ios-alert' style={{color:'red'}}/> : null }
            </View>
			{ this.state.confirmPasswordError != '' ? <View style={signUpStyles.lineErrorView}></View> : <View style={signUpStyles.lineView}></View> }
			 <TouchableOpacity style={signUpStyles.leftbuttonContainer} onPress={this.moveToPrevious.bind(this)}></TouchableOpacity>
            <TouchableOpacity style={signUpStyles.rightbuttonContainer} onPress={this.moveToNext.bind(this)}>
            <Image source={Images.nextarrow} />
            </TouchableOpacity>
          <KeyboardSpacer/>
          </View>
          </ScrollView>

            <View style={loginStyles.footerParent}>
              <View style={loginStyles.footerlineView}>
              </View>
              <View style={loginStyles.footerContainer}>
              <Text style={loginStyles.memberStyles}> {STRINGS.t('Already_Registered')} </Text>
              <TouchableOpacity onPress={this.moveToSignIn.bind(this)}>
              <Text style={loginStyles.usernameAndPasswordStyles}> {STRINGS.t('SIGNIN')}</Text>
              </TouchableOpacity>
              </View>
              <View style={loginStyles.iphonexFooter}></View>
            </View>
			<DropdownAlert ref={(ref) => this.dropdown = ref}/>
        </View>
      )}
  }
export default SignUp1
