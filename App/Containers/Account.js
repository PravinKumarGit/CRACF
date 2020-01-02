import React, { Component } from 'react';
import {Container, Left, Right, Icon, Title, Body, Button}  from 'native-base';
import {Image, View, Dimensions, Text, Alert, TextInput, TouchableOpacity, ScrollView, AsyncStorage, BackHandler, NetInfo} from 'react-native';
import Images from '../Themes/Images.js';
import CustomStyle from './Styles/CustomStyle';
import AccountStyle from './Styles/AccountStyle';
import BuyerStyle from './Styles/BuyerStyle';

import STRINGS from '../GlobalString/StringData'  // Import StringData.js class for string localization.
import KeyboardSpacer from 'react-native-keyboard-spacer';
var GLOBAL = require('../Constants/global');
const  {width, height} = Dimensions.get('window')
var Header = require('./Header');
import {callGetApi, callPostApi} from '../Services/webApiHandler.js' // Import 
import Picker from 'react-native-picker';
import {validateEmail} from '../Services/CommonValidation.js';
import ShowActivityIndicator from './ShowActivityIndicator'; 
import Spinner from 'react-native-loading-spinner-overlay'; 
import signUpStyles from './Styles/SignUpStyle'    // Import SignUpStyle.js class from Styles Folder to maintain UI.
import DropdownAlert from 'react-native-dropdownalert'
import {authenticateUser} from '../Services/CommonValidation.js'  // Import CommonValidation class to access common methods for validations.
import ModalSelector from 'react-native-modal-selector';
import Toast from 'react-native-simple-toast';

export default class Account extends Component{
	constructor(props){
		super(props);
		this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
		this.state ={
			animating: false,
			scrollvalue : false,
			visble : false,
			firstNameError: '',
			lastNameError: '',
			emailError: '',
			usernameError: '',
			mailingAddressError: '',
			cityError: '',
			stateError: '',
			countyError: '',
			phoneNumberError: '',
			officeNameError: '',
			connectionInfo : '',
			titleRepError: '',
			srvItems : [],
			user_state:'',
			countItems: [],
			user_county: '',
			titleRepItems:[],
			zipCodeError:'',
			title_rep_name:''
		}

		this.handleFirstConnectivityChange = this.handleFirstConnectivityChange.bind(this);

	}
	async componentDidMount() {
		BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
		response = await authenticateUser();
		if(response == '1'){
			this.props.navigator.push({name: 'Login', index: 0 });
		}else{
		   AsyncStorage.getItem("userDetail").then((value) => {
					  newstr = value.replace(/\\/g, "");
					  var newstr = JSON.parse(newstr);
					  newstr.user_name = newstr.first_name + " " + newstr.last_name;
					  newstr.county = "";
					this.setState(newstr,this.componentApiCalls);
					this.setState({usernameOrg: this.state.username});
					
					this.setState({animating:'true'});
			}).done();
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

	componentApiCalls(){
		this.callAccountDetailsApi();
		
	}
	callAccountDetailsApi()
	{
	   callPostApi(GLOBAL.BASE_URL + GLOBAL.User_Detail, {
		userId: this.state.user_id,
	   })
	   .then((response) => {
		    if(result.data.phone != ''){
				result.data.phone = result.data.phone.replace(/[^\d.]/g,'').replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
			}
			this.setState({
				first_name: result.data.first_name,
				last_name: result.data.last_name,
				username: result.data.username,
				username_already_exist: result.data.username,
				email: result.data.email,
				city: result.data.city,
				mailing_address: result.data.mailing_address,
				office_name: result.data.office_name,
				state: result.data.state,
				phone_number: result.data.phone,
				titleRep: result.data.titleRep,
				stateId: result.data.state,
				countyId: result.data.county,
				zip_code: result.data.postal_code,
			},this.callGetStatesApi);
			stateId = result.data.state;
			countyId = result.data.county;
			titleRep = result.data.titleRep;
		 });

	}
	
	
	// call state values for drop down
	 callGetStatesApi() {
		callGetApi(GLOBAL.BASE_URL + GLOBAL.Get_States)
		.then((response) => {

			// Continue your code here...
			this.setState({
				stateArray : result.data,
			});

          for (let i = 0; i < this.state.stateArray.length; i++) {
				state_name = this.state.stateArray[i].statename;
				state_id = this.state.stateArray[i].id;
				if(this.state.stateId == state_id) {
					this.setState({
						user_state : state_name
					});
				}
				this.state.srvItems.push({
					'key': state_id,
					'label':  state_name
				});
          }
		});
		this.callGetCountyApi(this.state.stateId);
	}
	
	onChangeState(option) {
		this.setState({
			user_state : option.label,
			stateField : option.label,
			stateId : option.key,
			countyId: '',
			titleRep: '',
			zip_code: '',
		}, this.callGetCountyApi(option.key));
	  }
	  
	// call county values for drop down
	callGetCountyApi(IDofState) {
		if(this.state.countItems != "") {
			this.state.countItems = [];
		}
		callPostApi(GLOBAL.BASE_URL + GLOBAL.Get_County, {stateId: IDofState,})
			.then((response) => {
			this.setState({
				countryArray : result.data
			});
			
			for (let i = 0; i < this.state.countryArray.length; i++) {
				county_name = this.state.countryArray[i].countyname;
				county_id = this.state.countryArray[i].id;
				
				if(this.state.countyId == county_id) {
					this.setState({
						county : county_id,
						user_county : county_name,
						country : county_name
					}, this.callGetTitleRepApi(this.state.stateId, county_id));		
				}else if(this.state.countyId == '' && i == 0){
					this.setState({
						county : '',
						user_county : 'Select county',
						country : 'Select county',
						titleRep: '',
					}, this.callGetTitleRepApi(this.state.stateId, ''));
					this.state.countItems.push({
						'key' : '',
						'label' : 'Select county'
					});
				}
				
				this.state.countItems.push({
					'key' : county_id,
					'label' : county_name
				});
			}

			this.setState({animating:'false'});	   
		});
	}
	
	onChangeCounty(option) {
		countyId = option.key;
		if(countyId != ''){
			this.setState({countyError:''})
		}
		this.setState({
			user_county : option.label,
			country : option.label,
			county: countyId,
			countyId: countyId,
			titleRep: '',
			zip_code: '',
		}, this.callGetTitleRepApi(this.state.stateId,option.key));
	  }
	
	callGetTitleRepApi(IDofState,IDofCounty)
	{	
		if(IDofCounty != ''){
			 callPostApi(GLOBAL.BASE_URL + GLOBAL.Get_Title_Rep, {
				   stateId: IDofState,
				   countyId: IDofCounty,
		   
			   })
		  .then((response) => {
					

				this.setState({
					 titleRepArray : result.data
				});
				
				for (let i = 0; i < this.state.titleRepArray.length; i++) {
				
					title_rep_name = this.state.titleRepArray[i].name;
					title_rep_id = this.state.titleRepArray[i].id;
					if(this.state.titleRep == title_rep_id) {
						
						this.setState({
							title_rep_name : title_rep_name,
							title_rep_id : title_rep_id
						});
					}else if(this.state.titleRep == '' && i == 0){
						this.setState({
							title_rep_name : 'Select title rep',
							title_rep_id : ''
						});
						/* this.state.titleRepItems = [],
						this.state.titleRepItems.push({
							'key' : '',
							'label' : 'Select title rep'
						}); */
					}
					
					this.state.titleRepItems.push({
						'key' : title_rep_id,
						'label' : title_rep_name
					});
				}
				
			});
		}else{
			this.state.titleRepItems = [],
			this.setState({
						title_rep_name : 'Select title rep',
						title_rep_id : ''
			});
			this.state.titleRepItems.push({
					'key' : '',
					'label' : 'Select title rep'
			});
		}
	}
	onTitleRepChange(option) {
		titleRepId = option.key;
		if(titleRepId != ''){
			this.setState({titleRepError:''})
		}
		this.setState({
			title_rep_name : option.label,
			title_rep_id: titleRepId,
			titleRep: titleRepId,
		});
	}
	
	callCheckUsernameApi()
	 {
	   callPostApi(GLOBAL.BASE_URL + GLOBAL.Check_Username, {
		  username: this.state.username,
	   })
	   .then((response) => {
			   // Continue your code here...
			   if (result.status == 'success')
			   {
				   this.setState({usernameOrg: this.state.usernameOrg});
			   }
			   else {
					if(this.state.usernameOrg != this.state.username){
						this.setState({usernameError : result.message});
						var errMsgFlag = '1';  
					}
			   }

		 });
	 }
	 
	 onIconClick(msg){
		 this.dropdown.alertWithType('error', 'Error', msg);
	 }
	 
	onChange(fieldVal, fieldName) {
		//newText = text.replace(/[^\d.]/g,'');
		//return newText;	
		
		if(fieldName == 'firstNameError') {
			if(fieldVal == '') {
				this.setState({
					[fieldName] : STRINGS.t('first_name_error_message')
				});
			} else if(fieldVal.length < 2 || fieldVal.length > 50) {
				this.setState({
					[fieldName] : STRINGS.t('first_name_char_error_message')
				});
			} else {
				this.setState({
					[fieldName] : ""
				});
			}
		}

		if(fieldName == 'lastNameError') {
			if(fieldVal == '') {
				this.setState({
					[fieldName] : STRINGS.t('last_name_error_message')
				});
			} else if (fieldVal.length < 2 || fieldVal.length > 50) {
				this.setState({
					[fieldName] : STRINGS.t('last_name_char_error_message')
				});
			} else {
				this.setState({
					[fieldName] : ""
				});
			}
		}
		if(fieldName == 'emailError') {
			if(fieldVal == '') {
				this.setState({
					[fieldName] : STRINGS.t('email_error_message')
				});
			} else if (!validateEmail(fieldVal)) {
				this.setState({
					[fieldName] : STRINGS.t('validation_email_error_message'),
					email : '',
				});
			} else if(fieldVal.length < 2 || fieldVal.length > 100) {
				this.setState({
					[fieldName] : STRINGS.t('email_char_error_message'),
					email : '',
				});
			} else {
				this.setState({
					[fieldName] : ""
				});
			}

		}
		if(fieldName == 'usernameError') {
			if(fieldVal == '') {
				this.setState({
					[fieldName] : STRINGS.t('username_error_message')
				});
			} else if (fieldVal.length < 2 || fieldVal.length > 20) {
				this.setState({
					[fieldName] : STRINGS.t('username_char_error_message')
				});
			} else {
				this.setState({
					[fieldName] : ""
				});
			}
		}
		if(fieldName == 'mailingAddressError') {
			if(fieldVal == '') {
				this.setState({
					[fieldName] : STRINGS.t('mailing_address_error')
				});
			} else if (fieldVal.length < 2 || fieldVal > 120) {
				this.setState({
					[fieldName] : STRINGS.t('mailing_address_char_error')
				});
			} else {
				this.setState({
					[fieldName] : ""
				});
			}
 		}
		if(fieldName == 'cityError') {
			if(fieldVal == '') {
				this.setState({
					[fieldName] : STRINGS.t('city_error')
				});
			} else if (fieldVal.length < 2 || fieldVal.length > 120) {
				this.setState({
					[fieldName] : STRINGS.t('city_char_error')
				});	
			} else {
				this.setState({
					[fieldName] : ""
				});
			}
		}
		/*if(fieldName == 'phoneNumberError') {
			if(fieldVal == '') {
				this.setState({
					[fieldName] : STRINGS.t('phone_number_error')
				});	
			} else if (fieldVal.length != 10) {
				this.setState({
					[fieldName] : STRINGS.t('phone_number_char_error')
				});
			} else {
				this.setState({
					[fieldName] : ""
				});
			}
		}*/
		if(fieldName == 'officeNameError') {
			if(fieldVal == '') {
				this.setState({
					[fieldName] : STRINGS.t('office_name_error')
				});
			} else if (fieldVal.length < 2 || fieldVal.length > 60) {
				this.setState({
					[fieldName] : STRINGS.t('office_name_char_error')
				});
			} else {
				this.setState({
					[fieldName] : ""
				});
			}
		}
		if(fieldName == 'zipCodeError') {
			if(fieldVal == '') {
				this.setState({
					[fieldName] : STRINGS.t('zip_code_error')
				});
			} else {
				this.setState({
					[fieldName] : ""
				});
			}
		}
	}
	

	onChangePhone(fieldVal, fieldName) {
		fieldVal = fieldVal.replace(/[^\d.]/g,'');
		if(fieldVal == "") {
			this.setState({
				[fieldName] : STRINGS.t('phone_number_error')
			});
		} else if (fieldVal.length != 10) {
			this.setState({
				[fieldName] : STRINGS.t('phone_number_char_error')
			});
			var errMsgFlag = '1';
		} else if (fieldVal != '') {
			this.setState({
				[fieldName] : ""
				});
		}
	}

	submit()
	{
		
		callPostApi(GLOBAL.BASE_URL + GLOBAL.Check_Username, {
		  username: this.state.username,
		})
		.then((response) => {
			   // Continue your code here...
			if (result.status == 'success' || this.state.username_already_exist == this.state.username){
				phone_number = this.state.phone_number.replace(/[^\d.]/g,'');
				var errMsgFlag = '0';
				if (this.state.first_name == '')
				{
					this.setState({firstNameError : STRINGS.t('first_name_error_message')});
					var errMsgFlag = '1';
				}else if(this.state.first_name.length < 2 || this.state.first_name.length > 50){
					this.setState({firstNameError : STRINGS.t('first_name_char_error_message')});
					var errMsgFlag = '1';
				}
				if (this.state.last_name == '')
				{
					this.setState({lastNameError : STRINGS.t('last_name_error_message')});
					var errMsgFlag = '1';
				}else if(this.state.last_name.length < 2 || this.state.last_name.length > 50){
					this.setState({lastNameError : STRINGS.t('last_name_char_error_message')});
					var errMsgFlag = '1';
				}
				if (this.state.email == '')
				{
					this.setState({emailError : STRINGS.t('email_error_message')});
					var errMsgFlag = '1';
				}else if (!validateEmail(this.state.email)) {
					this.setState({email:'',emailError : STRINGS.t('validation_email_error_message')});
					var errMsgFlag = '1';
				}else if(this.state.email.length < 2 || this.state.email.length > 100){
					this.setState({emailError : STRINGS.t('email_char_error_message')});
					var errMsgFlag = '1';
				}
				if (this.state.username == '')
				{
					this.setState({usernameError : STRINGS.t('username_error_message')});
					var errMsgFlag = '1';
				}else if(this.state.username.length < 2 || this.state.username.length > 20){
					this.setState({usernameError : STRINGS.t('username_char_error_message')});
					var errMsgFlag = '1';
				}
				if(this.state.mailing_address == ''){
					this.setState({mailingAddressError : STRINGS.t('mailing_address_error')});
					var errMsgFlag = '1';
				}else if(this.state.mailing_address.length < 2 || this.state.mailing_address.length > 120){
					this.setState({mailingAddressError : STRINGS.t('mailing_address_char_error')});
					var errMsgFlag = '1';
				}
				if(this.state.city == '')
				{
					this.setState({cityError : STRINGS.t('city_error')});
					var errMsgFlag = '1';
				}else if(this.state.city.length < 2 || this.state.city.length > 120){
					this.setState({cityError : STRINGS.t('city_char_error')});
					var errMsgFlag = '1';
				}
				
				if(this.state.stateId == '')
				{
					this.setState({stateError : STRINGS.t('state_error')});
					var errMsgFlag = '1';
				}
				if(this.state.countyId == '')
				{
					this.setState({countyError : STRINGS.t('country_error')});
					var errMsgFlag = '1';
				}
				if(phone_number == '')
				{
					this.setState({phoneNumberError : STRINGS.t('phone_number_error')});
					var errMsgFlag = '1';
				}else if(phone_number.length != 10){
					this.setState({phoneNumberError : STRINGS.t('phone_number_char_error')});
					var errMsgFlag = '1';
				}
				if(this.state.office_name == '')
				{
					this.setState({officeNameError : STRINGS.t('office_name_error')});
					var errMsgFlag = '1';
				}else if(this.state.office_name.length < 2 || this.state.office_name.length > 60){
					this.setState({officeNameError : STRINGS.t('office_name_char_error')});
					var errMsgFlag = '1';
				}
				if(this.state.zip_code == '')
				{
					this.setState({zipCodeError : STRINGS.t('zip_code_error')});
					var errMsgFlag = '1';
					
				}
				
				if(this.state.title_rep_id == '')
				{
					this.setState({titleRepError : STRINGS.t('title_rep_error')});
					var errMsgFlag = '1';
				}
				if(errMsgFlag == '0' && this.state.zipCodeError == '')
				{
				var data = {
								   fname: this.state.first_name,
								   lname: this.state.last_name,
								   email: this.state.email,
								   username: this.state.username,
								   mailing_address: this.state.mailing_address,
								   city: this.state.city,
								   state: this.state.stateId,
								   county: this.state.countyId,
								   phone: phone_number,
								   office_name: this.state.office_name,
								   zipcode: this.state.zip_code,
								   titleRep: this.state.titleRep,
								   drenmls: "",
								   corporatenmls: "",// empty as discussed with Atul on 29-01-2018
								   user_id: this.state.user_id
								 };
				 callPostApi(GLOBAL.BASE_URL + GLOBAL.Update_User,data).then((response) => {

						company_id = result.data.company_id;
						AsyncStorage.getItem("userDetail", (err, result) => {
							//alert("userdetail section " + JSON.stringify(result));
							newstr = result.replace(/\\/g, "");
							newstr = JSON.parse(newstr);	
							newstr.postal_code = data.zipcode
							newstr.mailing_address = data.mailing_address
							newstr.username = data.username
							newstr.first_name = data.fname
							newstr.last_name = data.lname
							newstr.titleRep = data.titleRep
							newstr.phone = data.phone
							newstr.county = data.county
							newstr.state = data.state
							newstr.email = data.email
							newstr.city = data.city
							newstr.user_county = this.state.user_county
							newstr.user_state = this.state.user_state,
							newstr.company_id = company_id,
							
							
							AsyncStorage.setItem("userDetail", JSON.stringify(newstr)); 
						});
						  // Continue your code here...
						this.dropdown.alertWithType('success', 'Success', result.message);
							if(result.status == "success"){
								this.setState({username_already_exist: this.state.username});
							} 
						});
				}
			}
			else {
				if (this.state.username == '')
				{
					this.setState({usernameError : STRINGS.t('username_error_message')});
					var errMsgFlag = '1';
				}else{
					this.setState({usernameError : result.message});
					var errMsgFlag = '1';
				}	
			}

		 });
		
	}
	
	callVerifyZipCodeApi() {
		if (this.state.stateId != '' && this.state.countyId != '')
		{
			callPostApi(GLOBAL.BASE_URL + GLOBAL.Verify_ZipCode, {
				'stateName': this.state.user_state,
				'countyName': this.state.user_county,
				'zipCode': this.state.zip_code,
			})
			.then((response) => {
				if (result.status == 'fail')
				{
					this.setState({zipCodeError : result.message});
					//Alert.alert('Alert!', JSON.stringify(result.message));
				}
			});
		}
 	}
	
	onBackButtonPress() {
		Picker.hide();
		this.props.navigator.push({name: 'Dashboard', index: 0 });
	}
	
	changePassword() {
		   this.props.navigator.push({name: 'ChangePassword', index: 0 });
	}
	updatePhoneNumberFormat(phone_number){
		 phone_number = phone_number.replace(/[^\d.]/g,'').replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
		this.setState({phone_number : phone_number});
	}
	 
	 
 
	state = {
    mailing_address: '',
    country: '',
    city: '',
    stateField: '',
    zip_code: '',
    phone_number: '',
    office_address: '',
    title_rep_name: '',
    stateArray: [],
    countryArray: [],
    titleRepArray: [],
    stateId: '',
    countyId: '',
    title_rep_id: '',

     // previous Declaration
     first_name: '',
     lname: '',
     email: '',
     username: '',
     newpass: '',
	 animating: false,
  };
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
			showable=			<View style={AccountStyle.MainContainer}>
			<View style={AccountStyle.iphonexHeader}></View>
				<View>
					<Spinner visible={this.state.visble} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
				</View>	
                <View style={AccountStyle.HeaderContainer}>
                    <Image style={AccountStyle.HeaderBackground} source={Images.header_background}></Image>
                    <TouchableOpacity style={{width:'20%'}} onPress={this.onBackButtonPress.bind(this)}>
                        <Image style={AccountStyle.back_icon} source={Images.back_icon}/>
                    </TouchableOpacity>
                    <Text style={AccountStyle.header_title}>My Accounts</Text>
					<TouchableOpacity  style={AccountStyle.savebtn} onPress={this.submit.bind(this)}>
						<Text style={AccountStyle.save_btnText}>Save</Text>
					</TouchableOpacity>
                </View>
				<ScrollView
					scrollEnabled={true}
					showsVerticalScrollIndicator={false}
					keyboardShouldPersistTaps="always"
					keyboardDismissMode='on-drag'
				>
					<View style={AccountStyle.view_parent}>
						<View style={AccountStyle.view_title}>
							<Text>First Name</Text>
						</View>
						<View style={AccountStyle.view_textInput}>
							<View style={{flexDirection: 'row'}}>
								<TextInput placeholderTextColor={this.state.firstNameError == "" ? "#999999": "red"} placeholder={this.state.firstNameError == "" ? STRINGS.t('first_name') : this.state.firstNameError} underlineColorAndroid = 'transparent' secureTextEntry={false} style={AccountStyle.textInput} returnKeyType ="next" keyboardType="email-address" multiline={true} 
								
								//onChangeText={(value) => this.setState({first_name: value})} 
								
								onChangeText={(value) => this.setState({first_name: value}, this.onChange(value, 'firstNameError'))}


								value={this.state.first_name} />
								{ this.state.firstNameError != '' ? <Icon onPress={() => this.onIconClick(this.state.firstNameError)} name='ios-alert' style={{color:'red'}}/> : null }
							</View>
						</View>
					</View>
					<View style={AccountStyle.lineView}></View>
					
					<View style={AccountStyle.view_parent}>
						<View style={AccountStyle.view_title}>
							<Text>Last Name</Text>
						</View>
						<View style={AccountStyle.view_textInput}>
							<View style={{flexDirection: 'row'}}>
								<TextInput placeholderTextColor={this.state.lastNameError == "" ? "#999999": "red"} placeholder={this.state.lastNameError == "" ? STRINGS.t('last_name') : this.state.lastNameError} underlineColorAndroid = 'transparent' secureTextEntry={false} style={AccountStyle.textInput} returnKeyType ="next" keyboardType="email-address" multiline={true} 
								
								//onChangeText={(value) => this.setState({last_name: value})} 
								
								onChangeText={(value) => this.setState({last_name: value}, this.onChange(value, 'lastNameError'))}
								
								value={this.state.last_name} />
								{ this.state.lastNameError != '' ? <Icon onPress={() => this.onIconClick(this.state.lastNameError)} name='ios-alert' style={{color:'red'}}/> : null }
							</View>
						</View>
					</View>
					<View style={AccountStyle.lineView}></View>
					
					<View style={AccountStyle.view_parent}>
						<View style={AccountStyle.view_title}>
							<Text>Email Address</Text>
						</View>
						<View style={AccountStyle.view_textInput}>
							<View style={{flexDirection: 'row'}}>
								<TextInput placeholderTextColor={this.state.emailError == "" ? "#999999": "red"} placeholder={this.state.emailError == "" ? STRINGS.t('email_address') : this.state.emailError} underlineColorAndroid = 'transparent' secureTextEntry={false} style={[AccountStyle.textInput,{height:60}]} returnKeyType ="next" keyboardType="email-address" multiline={true} 
								
								//onChangeText={(value) => this.setState({email: value})} 
								
								onChangeText={(value) => this.setState({email: value}, this.onChange(value, 'emailError'))}

								value={this.state.email} />
								{ this.state.emailError != '' ? <Icon onPress={() => this.onIconClick(this.state.emailError)} name='ios-alert' style={{color:'red'}}/> : null }
							</View>
						</View>
					</View>
					<View style={AccountStyle.lineView}></View>
					
					<View style={AccountStyle.view_parent}>
						<View style={AccountStyle.view_title}>
							<Text>Username</Text>
						</View>
						<View style={AccountStyle.view_textInput}>
							<View style={{flexDirection: 'row'}}>
								<TextInput placeholderTextColor={this.state.usernameError == "" ? "#999999": "red"} placeholder={this.state.usernameError == "" ? STRINGS.t('Username') : this.state.usernameError} underlineColorAndroid = 'transparent' secureTextEntry={false} style={AccountStyle.textInput} returnKeyType ="next" keyboardType="email-address" multiline={true} 
								
								//onChangeText={(value) => this.setState({username: value})} 
								
								onChangeText={(value) => this.setState({username: value}, this.onChange(value, 'usernameError'))}

								value={this.state.username} onEndEditing={this.callCheckUsernameApi.bind(this)} />
								{ this.state.usernameError != '' ? <Icon onPress={() => this.onIconClick(this.state.usernameError)} name='ios-alert' style={{color:'red'}}/> : null }
							</View>
						</View>
					</View>
					<View style={AccountStyle.lineView}></View>
					
					<View style={AccountStyle.view_parent}>
						<View style={AccountStyle.view_title}>
							<Text>Mailing Address</Text>
						</View>
						<View style={AccountStyle.view_textInput}>
							<View style={{flexDirection: 'row'}}>
								<TextInput placeholderTextColor={this.state.mailingAddressError == "" ? "#999999": "red"} placeholder={this.state.mailingAddressError == "" ? STRINGS.t('Mailing_Address') : this.state.mailingAddressError} underlineColorAndroid = 'transparent' secureTextEntry={false} style={[AccountStyle.textInput]} returnKeyType ="next" keyboardType="email-address" multiline={true} 
								
								//onChangeText={(value) => this.setState({mailing_address: value})} 
								
								onChangeText={(value) => this.setState({mailing_address: value}, this.onChange(value, 'mailingAddressError'))}

								value={this.state.mailing_address} />
								{ this.state.mailingAddressError != '' ? <Icon onPress={() => this.onIconClick(this.state.mailingAddressError)} name='ios-alert' style={{color:'red'}}/> : null }
							</View>
						</View>
					</View>
					<View style={AccountStyle.lineView}></View>
					
					<View style={AccountStyle.view_parent}>
						<View style={AccountStyle.view_title}>
							<Text>City</Text>
						</View>
						<View style={AccountStyle.view_textInput}>
							<View style={{flexDirection: 'row'}}>
								<TextInput placeholderTextColor={this.state.cityError == "" ? "#999999": "red"} placeholder={this.state.cityError == "" ? STRINGS.t('City') : this.state.cityError} underlineColorAndroid = 'transparent' secureTextEntry={false} style={AccountStyle.textInput} returnKeyType ="next" keyboardType="email-address" multiline={true} 
								
								//onChangeText={(value) => this.setState({city: value})} 
								
								onChangeText={(value) => this.setState({city: value}, this.onChange(value, 'cityError'))}

								value={this.state.city} />
								{ this.state.cityError != '' ? <Icon onPress={() => this.onIconClick(this.state.cityError)} name='ios-alert' style={{color:'red'}}/> : null }
							</View>
						</View>
					</View>
					<View style={AccountStyle.lineView}></View>
					<View style={AccountStyle.view_parent}>
						<View style={AccountStyle.view_title}>
							<Text>State</Text>
						</View>
						<View style={AccountStyle.view_textInput}>
							<View style={{flexDirection: 'row'}}>
								<ModalSelector
									data={this.state.srvItems}
									initValue={this.state.user_state}
									style={{width:'100%',marginTop:2}}
									selectTextStyle={{fontSize:12}}
									onChange={(option) => this.onChangeState(option)} 
								>
								</ModalSelector>
							</View>
						</View>
					</View>
					<View style={AccountStyle.lineView}></View>
					<View style={AccountStyle.view_parent}>
						<View style={AccountStyle.view_title}>
							<Text>County</Text>
						</View>
						<View style={AccountStyle.view_textInput}>
							<View style={{flexDirection: 'row'}}>
								{ this.state.countyError != '' ?
								<ModalSelector
									data={this.state.countItems}
									initValue={this.state.user_county}
									selectTextStyle={{fontSize:12, color : '#ff0000'}}
									style={{width:'100%', borderRadius: 4, borderWidth: 0.5, borderColor: '#ff0000',marginRight:2}}
									onChange={(option) => this.onChangeCounty(option)} 
								></ModalSelector>
								:
								<ModalSelector
									data={this.state.countItems}
									initValue={this.state.user_county}
									selectTextStyle={{fontSize:12}}
									style={{width:'100%',marginTop:2}}
									onChange={(option) => this.onChangeCounty(option)}>
								</ModalSelector>
								} 
								{ this.state.countyError != '' ? <Icon onPress={() => this.onIconClick(this.state.countyError)} name='ios-alert' style={{color:'red'}}/> : null }
								
							</View>
						</View>
					</View>
					<View style={AccountStyle.lineView}></View>
					
					<View style={AccountStyle.view_parent}>
						<View style={AccountStyle.view_title}>
							<Text>Phone Number</Text>
						</View>
						<View style={AccountStyle.view_textInput}>
							<View style={{flexDirection: 'row'}}>
								<TextInput placeholderTextColor={this.state.phoneNumberError == "" ? "#999999": "red"} placeholder={this.state.phoneNumberError == "" ? STRINGS.t('Phone_Number') : this.state.phoneNumberError} underlineColorAndroid = 'transparent' secureTextEntry={false} style={AccountStyle.textInput} returnKeyType ="next" keyboardType="phone-pad" multiline={true} 
								
								//onChangeText={(value) => this.setState({phone_number: value.replace(/[^\d.]/g,'')})}
								
								onChangeText={(value) => this.setState({phone_number: value.replace(/[^\d.]/g,'')}, this.onChangePhone(value, 'phoneNumberError'))}



								value={this.state.phone_number}  onEndEditing={ (event) => this.updatePhoneNumberFormat(event.nativeEvent.text) } />
								{ this.state.phoneNumberError != '' ? <Icon onPress={() => this.onIconClick(this.state.phoneNumberError)} name='ios-alert' style={{color:'red'}}/> : null }
							</View>
						</View>
					</View>
					<View style={AccountStyle.lineView}></View>
					
					<View style={AccountStyle.view_parent}>
						<View style={AccountStyle.view_title}>
							<Text>Office Name</Text>
						</View>
						<View style={AccountStyle.view_textInput}>
							<View style={{flexDirection: 'row'}}>
								<TextInput placeholderTextColor={this.state.officeNameError == "" ? "#999999": "red"} placeholder={this.state.officeNameError == "" ? STRINGS.t('Office_Name') : this.state.officeNameError} underlineColorAndroid = 'transparent' secureTextEntry={false} style={AccountStyle.textInput} returnKeyType ="next" keyboardType="email-address" multiline={true} 
								
								//onChangeText={(value) => this.setState({office_name: value})}
								
								onChangeText={(value) => this.setState({office_name: value}, this.onChange(value, 'officeNameError'))}
								
								
								value={this.state.office_name} />
								{ this.state.officeNameError != '' ? <Icon onPress={() => this.onIconClick(this.state.officeNameError)} name='ios-alert' style={{color:'red'}}/> : null }
							</View>
						</View>
					</View>
					<View style={AccountStyle.lineView}></View>
					
					<View style={AccountStyle.view_parent}>
						<View style={AccountStyle.view_title}>
							<Text>{STRINGS.t('Zip_Code')}</Text>
						</View>
						<View style={[AccountStyle.view_textInput, {marginBottom : 20}]}>
							<View style={{flexDirection: 'row'}}>
								<TextInput placeholderTextColor={this.state.zipCodeError == "" ? "#999999": "red"}  maxLength = {5} placeholder={this.state.zipCodeError == "" ? STRINGS.t('Zip_Code') : this.state.zipCodeError} underlineColorAndroid = 'transparent' secureTextEntry={false} style={AccountStyle.textInput} returnKeyType ="next" multiline={true} keyboardType="numeric"  
								
								
								//onChangeText={(val) => this.setState({zip_code: this.onChange(val),zipCodeError:''})}
								
								onChangeText={(value) => this.setState({zip_code: value}, this.onChange(value, 'zipCodeError'))}

								
								value={this.state.zip_code} onEndEditing={this.callVerifyZipCodeApi.bind(this)} />
								{ this.state.zipCodeError != '' ? <Icon onPress={() => this.onIconClick(this.state.zipCodeError)} name='ios-alert' style={{color:'red'}}/> : null }
							</View>
						</View>
					</View>
					<View style={AccountStyle.lineView}></View>
					
					<View style={AccountStyle.view_parent}>
						<View style={AccountStyle.view_title}>
							<Text>Title Rep Name</Text>
						</View>
						<View style={AccountStyle.view_textInput}>
							<View style={{flexDirection: 'row'}}>
								{ this.state.titleRepError != '' ?
									<ModalSelector
										style={{width:'100%', borderRadius: 4, borderWidth: 0.5, borderColor: '#ff0000'}}
										data={this.state.titleRepItems}
										initValue={this.state.title_rep_name}
										selectTextStyle={{fontSize:12, color : '#ff0000',marginRight:2}}
										onChange={(option) => this.onTitleRepChange(option)} >
									</ModalSelector>
								:	
									<ModalSelector
										style={{width:'100%',marginTop:2}}
										selectTextStyle={{fontSize:12}}
										data={this.state.titleRepItems}
										initValue={this.state.title_rep_name}
										onChange={(option) => this.onTitleRepChange(option)} >
									</ModalSelector>
								}	
								{ this.state.titleRepError != '' ? <Icon onPress={() => this.onIconClick(this.state.titleRepError)} name='ios-alert' style={{color:'red'}}/> : null }
							</View>
						</View>
					</View>
					<View style={[AccountStyle.lineView, {marginBottom:240}]}></View>
				
					<View style={AccountStyle.changePasswordParent}>
						<TouchableOpacity activeOpacity={.5} onPress={this.changePassword.bind(this)} >
							<View style={AccountStyle.btn_view}>	
								<Text style={AccountStyle.btn_margin}>Change Password</Text>
							</View>	
						</TouchableOpacity>
					</View>
				</ScrollView>	
                <View style={AccountStyle.iphonexFooter}></View>
				<DropdownAlert ref={(ref) => this.dropdown = ref}/>
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
						<Text style={BuyerStyle.header_title}>My Accounts</Text>
			
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
		);
	}
}
