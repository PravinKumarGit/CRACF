import React, {Component,} from 'react'
import {View, Text, StyleSheet, Image, TextInput, Alert, ScrollView, TouchableOpacity, Dimensions, NetInfo} from 'react-native';
import signUpStyles from './Styles/SignUpStyle'    // Import SignUpStyle.js class from Styles Folder to maintain UI.
import loginStyles from './Styles/LoginScreenStyle'     // Import LoginScreenStyle.js class from Styles Folder to maintain UI.
import Images from '../Themes/Images.js'          // Import Images.js class from Image Folder for images.
import STRINGS from '../GlobalString/StringData'  // Import StringData.js class for string localization.
import forgotStyles from './Styles/ForgotStyle'     // Import LoginScreenStyle.js class from Styles Folder to maintain UI.
import {validateEmail} from '../Services/CommonValidation.js'  // Import CommonValidation class to access common methods for validations.
import {callPostApi} from '../Services/webApiHandler.js' // Import webApiHandler.js class for calling api.
var GLOBAL = require('../Constants/global');
import { Icon } from 'native-base';
var Header = require('./HomeHeader');
import DropdownAlert from 'react-native-dropdownalert'
import Spinner from 'react-native-loading-spinner-overlay'; 

class ForgotPassword extends Component {

  constructor() {
    super()
    // Variable Declaration
    this.state = {
		emailTextField: '',
		usernameTextField: '',
		usernameError: '',
		emailError: '',
		animating: false,
		visble : false,
      }
  }
	// Method to move on signUp screen.
	moveToSignIn()
	{
		this.props.navigator.pop()
	}
	sendPressed()
	{
		this.setState({animating:true},this.callForgotPasswordApi);
	}
  
	callForgotPasswordApi(){
	  
		if(this.state.emailTextField == ''){
			this.setState({emailError : STRINGS.t('email_error_message')});
		}
		else if (!validateEmail(this.state.emailTextField)) {
			this.setState({emailError : STRINGS.t('validation_email_error_message')});
		}else{
			this.setState({emailError : ''});
		}
		
		if (this.state.usernameTextField == '') {
			this.setState({usernameError : STRINGS.t('username_error_message')});
		}else{
			this.setState({usernameError : ''});
		}
		if(this.state.emailTextField != '' && validateEmail(this.state.emailTextField) && this.state.usernameTextField != ''){
			
			callPostApi(GLOBAL.BASE_URL + GLOBAL.Forgot_Password, {
			 email: this.state.emailTextField,
			 username: this.state.usernameTextField,
			})
			.then((response) => {
					//Alert.alert('Alert!', JSON.stringify(result));
				   // Continue your code here...
					if(result.status == "success"){
						this.setState({animating:false,emailTextField:'',usernameTextField:''});
						this.dropdown.alertWithType('success', 'Success', result.message);
						//this.props.navigator.push({name: 'Login', index: 0 });
					}else{
						this.setState({animating:false});
						this.dropdown.alertWithType('error', 'Error', STRINGS.t('valid_detail_error_message'));
					}

			});
		}else{
			this.setState({animating:false});
		}
	}
  
	onBackButtonPress() {
		this.props.navigator.pop()
    }
	
	onIconClick(msg){
		this.dropdown.alertWithType('error', 'Error', msg);
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
	  
		if(fieldName == 'emailError') {
		  if(fieldVal != '') {
			if(!validateEmail(this.state.emailTextField)) {
				this.setState({
					[fieldName] : STRINGS.t('validation_email_error_message')
				  });	
			} else {
				this.setState({
					[fieldName] : ""
				  });	
			}
		  } else {
			this.setState({
			  [fieldName] : STRINGS.t('email_error_message')
			});
		  }
		}

	  }
	
  render() {
      return (

         <View style={loginStyles.backgroundImage}>
          <View style={loginStyles.iphonexHeader}></View>
				<View>
					<Spinner visible={this.state.animating} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
				</View>	
         <View style={loginStyles.HeaderContainer}>
				<Image style={loginStyles.HeaderBackground} source={Images.header_background}></Image>
				<TouchableOpacity style={{width:'20%'}} onPress={this.onBackButtonPress.bind(this)}>
					<Image style={loginStyles.back_icon} source={Images.back_icon}/>
				</TouchableOpacity>
				<Text style={loginStyles.header_title}>Forgot Password</Text>
				<TouchableOpacity style={{width:'20%', justifyContent:'center'}} onPress={this.sendPressed.bind(this)}>
					<Text style={[loginStyles.headerbtnText,{alignSelf:'flex-end'}]}>{STRINGS.t('Send')}</Text>
				</TouchableOpacity>
			</View>

          <ScrollView style={loginStyles.scroll_container}>
          <View style={loginStyles.viewContainer}>



          <View style={signUpStyles.textInputBackgroundViewContainer}>
          <Image style = {signUpStyles.logoImage} source={Images.username}/>
		  <TextInput placeholderTextColor={this.state.usernameError == "" ? "#999999": "red"} placeholder={this.state.usernameError == "" ? STRINGS.t('Username') : this.state.usernameError} underlineColorAndroid = 'transparent' secureTextEntry={false} style={signUpStyles.textInput}  returnKeyType ="next" keyboardType="email-address" returnKeyType='done' 
		  onChangeText={(val) => this.setState({usernameTextField: val}, this.onChange(val,'usernameError'))}
		 
		 value={this.state.usernameTextField}/>
		  { this.state.usernameError != '' ? <Icon onPress={() => this.onIconClick(this.state.usernameError)} name='ios-alert' style={{color:'red'}}/> : null }
            { this.state.usernameError != '' ? <View style={signUpStyles.lineErrorView}></View> : <View></View> }
          </View>
          <View style={forgotStyles.lineView}>
          </View>

          <View style={forgotStyles.textInputBackgroundViewContainer}>
          <Image style = {signUpStyles.logoImage} source={Images.emailid}/>
		  <TextInput placeholderTextColor={this.state.emailError == "" ? "#999999": "red"} placeholder={this.state.emailError == "" ? STRINGS.t('email_address') : this.state.emailError} underlineColorAndroid = 'transparent' secureTextEntry={false} style={signUpStyles.textInput}  returnKeyType ="next"  keyboardType="email-address" 
		  onChangeText={(val) => this.setState({emailTextField: val}, this.onChange(val,'emailError'))}
		 value={this.state.emailTextField}/>
		  { this.state.emailError != '' ? <Icon onPress={() => this.onIconClick(this.state.emailError)} name='ios-alert' style={{color:'red'}}/> : null }
            { this.state.emailError != '' ? <View style={signUpStyles.lineErrorView}></View> : <View></View> }
          </View>
          <View style={forgotStyles.lineView}>
          </View>


          </View>
          </ScrollView>

          <View style={loginStyles.footerParent}>
            <View style={loginStyles.footerlineView}>
            </View>
            <View style={loginStyles.footerContainer}>
            <Text style={loginStyles.memberStyles}> {STRINGS.t('Remember_Credentials')} </Text>
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
export default ForgotPassword
