import React, { Component } from 'react';
import {Container, Left, Right, Icon, Title, Body, Button}  from 'native-base';
import STRINGS from '../GlobalString/StringData'  // Import StringData.js class for string localization.
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Images from '../Themes/Images.js';
import CustomStyle from './Styles/CustomStyle';
import Styles from './Styles/ChangePasswordStyle';
import {callGetApi, callPostApi} from '../Services/webApiHandler.js' // Import 
import DropdownAlert from 'react-native-dropdownalert';
import {Image, View, Dimensions, Text, TextInput,AsyncStorage, TouchableOpacity, ScrollView, NetInfo} from 'react-native';
var GLOBAL = require('../Constants/global');
var Header = require('./Header');
import Spinner from 'react-native-loading-spinner-overlay';
const  {width, height} = Dimensions.get('window')

export default class ChangePassword extends Component{

	constructor() {
		super()
	  	// Variable Declaration
	  	this.state = {
			old_password: '',
			confirm_password: '',
			new_password: '',
			oldPasswordError : '',
			newPasswordError : '',
			ConfirmPasswordError : '',
			userId : '',
			user_email : '',
      animating : false,
	  	}
	}
	
	componentDidMount() {
	   	NetInfo.isConnected.addEventListener(
		 	'connectionChange',
			 this._handleConnectivityChange
	   	);
	  
	   	AsyncStorage.getItem("userDetail").then((value) => {
		  	newstr = value.replace(/\\/g, "");
		  	newstr = JSON.parse(newstr);
		  	this.setState({
				userId : newstr.user_id,
				user_email : newstr.email
		  	});
		}).done();		   
	}		
			
			
	goSaveChangePassword() {
		if(this.state.old_password == '') {
			this.setState({oldPasswordError : STRINGS.t('blank_password_acc_error_message')});
		} else {
			this.setState({oldPasswordError : ''});
		 }

		 if(this.state.old_password != "") {
			if(this.state.old_password.length < 6){
				this.setState({oldPasswordError : STRINGS.t('password_error_message')});
			} else {
				this.setState({oldPasswordError : ''});
			}
		}	 

		if(this.state.new_password == '') {
			this.setState({newPasswordError : STRINGS.t('blank_password_acc_error_message')});
			this.setState({new_password : ''});
		} else {
			this.setState({newPasswordError : ''});
		}
		if(this.state.new_password != "") {
			if(this.state.new_password.length < 6){
				this.setState({newPasswordError : STRINGS.t('password_error_message')});
			} else {
				this.setState({newPasswordError : ''});
			}
		}	
		if(this.state.confirm_password == '') {
			this.setState({ConfirmPasswordError : STRINGS.t('confirm_password_acc_error_message')});
		} else {
			if(this.state.new_password != this.state.confirm_password) {
				this.setState({ConfirmPasswordError : STRINGS.t('confirm_password')});
			} else {
				this.setState({ConfirmPasswordError : ''});
			}
		}	
		if(this.state.old_password != "" && this.state.new_password != '' && this.state.confirm_password != '' && 		this.state.new_password == this.state.confirm_password && this.state.confirm_password.length > 5 && this.state.new_password.length > 5 && this.state.old_password.length > 5) {
			this.callSaveChangePasswordApi();	
		}		
	}

	callSaveChangePasswordApi() {
		this.setState({animating: true});	
		callPostApi(GLOBAL.BASE_URL + GLOBAL.Change_Password, {
			email : this.state.user_email,
			password: this.state.old_password,
			user_id : this.state.userId,
			new_password1 : this.state.new_password,
			new_password2 : this.state.confirm_password,
		})	
		.then((response) => {
			// Continue your code here...
			if (result.status == 'success') {
				this.dropdown.alertWithType('success', 'Success', result.message);
			} else if (result.status == 'fail') {
				this.dropdown.alertWithType('error', 'Error', result.message);
			}
		})
	}


	onClose(data) {
		if(data.type == 'success') {
		this.setState({animating:false});
		this.props.navigator.push({name: 'Account', index: 0 });
		} else {
		this.setState({animating:false});
		}
	}

	onChange(fieldVal, fieldName) {
		if(fieldName == 'oldPasswordError') {
		  if(fieldVal != '') {
			this.setState({
			  [fieldName] : ""
			});
		  } else {
			this.setState({
			  [fieldName] : STRINGS.t('blank_password_acc_error_message')
			});
		  }
		}
	
		if(fieldName == 'newPasswordError') {
		  if(fieldVal != '') {
			this.setState({
			  [fieldName] : ""
			});
		  } else {
			this.setState({
			  [fieldName] : STRINGS.t('blank_password_acc_error_message')
			});
		  }
		}
	
		if(fieldName == 'ConfirmPasswordError') {
		  if(fieldVal != '') {
			this.setState({
			  [fieldName] : ""
			});
		  } else {
			this.setState({
			  [fieldName] : STRINGS.t('confirm_password_acc_error_message')
			});
		  }
		}
	  }

  
	goHomePage() {
		//this.props.navigator.pop()
		this.props.navigator.push({name: 'Account', index: 0 });
	}
	
	onIconClick(msg){
		this.dropdown.alertWithType('error', 'Error', msg);
	}
	
	render(){
		return(		
			<View>
           <View>
           <Spinner visible={this.state.animating} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
           </View>
			<View style={Styles.iphonexHeader}></View>
				<View style={Styles.HeaderContainer}>
					<Image style={Styles.HeaderBackground} source={Images.header_background}></Image>
					<TouchableOpacity style={{width:'20%'}} onPress={this.goHomePage.bind(this)}>
						<Image style={Styles.back_icon} source={Images.back_icon}/>
					</TouchableOpacity>
					<Text style={Styles.header_title}>Change Password</Text>
					<TouchableOpacity style={{width:'20%', justifyContent:'center'}} onPress={this.goSaveChangePassword.bind(this)}>
						<Text style={[Styles.headerbtnText,{alignSelf:'flex-end'}]}>{STRINGS.t('Save')}</Text>
					</TouchableOpacity>
				</View>
					<ScrollView style={{padding:20}}>
						<View style={Styles.Fieldscontainer}>
				<View style={Styles.FieldscontainerBorder}>
					<View>
						<View>
							<Text style={Styles.text_style}>
								{STRINGS.t('Old_Password')}
							</Text>
						</View>
						<View style={Styles.backgroundViewContainer}>
							<TextInput ref="OldPassword" placeholderTextColor={this.state.oldPasswordError == "" ? "#999999": "red"}
								placeholder={this.state.oldPasswordError == "" ? '' : this.state.oldPasswordError} secureTextEntry={true}  
								multiline = {true}
								underlineColorAndroid='transparent' 
								style={Styles.textInput} 
								returnKeyType ="next" keyboardType="default" onChangeText={(value) => this.setState({old_password: value}, this.onChange(value,'oldPasswordError'))}
							/>
							{ this.state.oldPasswordError != '' ? <Icon onPress={() => this.onIconClick(this.state.oldPasswordError)} name='ios-alert' style={{color:'red'}}/> : null }
						</View>
						<View style={[Styles.underlinebold,{marginBottom:10}]}></View>
					</View>
					<View style={[Styles.underline,{marginTop:20,marginBottom:20}]}></View>
					<View>
						<View>
							<Text style={Styles.text_style}>
								{STRINGS.t('New_Password')}
							</Text>
						</View>
						<View style={Styles.backgroundViewContainer}>
							<TextInput ref="NewPassword" placeholderTextColor={this.state.newPasswordError == "" ? "#999999": "red"}
								placeholder={this.state.newPasswordError == "" ? '' : this.state.newPasswordError} secureTextEntry={true} 
								multiline = {true} 
								underlineColorAndroid='transparent' 
								style={Styles.textInput} 
								returnKeyType ="next" keyboardType="default" onChangeText={(value) => this.setState({new_password: value}, this.onChange(value,'newPasswordError'))}
							/>
							{ this.state.newPasswordError != '' ? <Icon onPress={() => this.onIconClick(this.state.newPasswordError)} name='ios-alert' style={{color:'red'}}/> : null }
							
						</View>
						<View style={[Styles.underlinebold,{marginBottom:10}]}></View>
					</View>
					<View style={[Styles.underline,{marginTop:20,marginBottom:20}]}></View>
					<View>
						<View>
							<Text style={Styles.text_style}>
								{STRINGS.t('Confirm_Password')}
							</Text>
						</View>
						<View style={Styles.backgroundViewContainer}>
							<TextInput 
								ref="passNotmatched"
								keyboardType="numeric" 
								placeholderTextColor={this.state.ConfirmPasswordError == "" ? "#999999": "red"}
								placeholder={this.state.ConfirmPasswordError == "" ? '' : this.state.ConfirmPasswordError} 
								secureTextEntry={true} 
								multiline = {true} 
								underlineColorAndroid='transparent' 
								style={Styles.textInput} 
								returnKeyType ="next" keyboardType="default" onChangeText={(value) => this.setState({confirm_password: value}, this.onChange(value,'ConfirmPasswordError'))}
							/>
							{ this.state.ConfirmPasswordError != '' ? <Icon onPress={() => this.onIconClick(this.state.ConfirmPasswordError)} name='ios-alert' style={{color:'red'}}/> : null }
						</View>
						<View style={[Styles.underlinebold,{marginBottom:10}]}></View>
					</View>
				</View>
			</View>
					</ScrollView>	
					 <DropdownAlert
						ref={(ref) => this.dropdown = ref}
            onClose={data => this.onClose(data)}
           />
						</View>
		);
	}	
}	
