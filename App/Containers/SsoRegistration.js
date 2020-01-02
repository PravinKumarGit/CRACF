import React, { Component, } from 'react'
import {View, Text, StyleSheet, Image, TextInput, Alert, ScrollView, TouchableOpacity, NetInfo, AsyncStorage, Navigator} from 'react-native';
import signUpStyles from './Styles/SignUpStyle'    // Import SignUpStyle.js class from Styles Folder to maintain UI.
import loginStyles from './Styles/LoginScreenStyle'     // Import LoginScreenStyle.js class from Styles Folder to maintain UI.
import Images from '../Themes/Images.js'          // Import Images.js class from Image Folder for images.
import STRINGS from '../GlobalString/StringData'  // Import StringData.js class for string localization.
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {validateEmail} from '../Services/CommonValidation.js';
import Styles from './Styles/SellerStyleDesign';
import ModalSelector from 'react-native-modal-selector';
import {callGetApi, callPostApi} from '../Services/webApiHandler.js' // Import webApiHandler.js class for calling api.
var GLOBAL = require('../Constants/global');
import { Container, Content, InputGroup, Input, Icon } from 'native-base';
import DropdownAlert from 'react-native-dropdownalert'
var Header = require('./HomeHeader');
class SsoRegistration extends Component {
	state = {
		first_name: '',
		last_name: '',
		firstNameError : '',
		lastNameError : '',
		emailAddressError : '',
		confirmEmailAddressError : '',
		email_address: '',
		confirm_email_address: '',
		mailing_address: '',
		mailingAddressError : '',
		country: 'Select County',
		user_county : "Select County",
		countryError : '',
		city: '',
		cityError : '',
		stateField: 'Select State',
		salesEmail : 0,
		stateError : '',
		mfaInternalID : '',
		zip_code: '',
		zipCodeError : '',
		phone_number: '',
		phoneNumberError : '',
		office_address: '',
		officeAddressError : '',
		countyDisable : true,
		titleRepDisable : true,
		title_rep_name: 'Select Title Rep',
		titleRepError : '',
		titleRepArray: [],
		srvItems : [],
		countItems : [],
		titleRepItems : [],
		stateArray: [],
		countryArray: [],
		stateId: '',
		countyId: '',
		title_rep_id: '',
		// previous Declaration
		fname: '',
		lname: '',
		email: '',
		state_id :'',
		county_id : '',
		username: '',
		newpass: '',
		animating   : 'false',
		visble: false,
	};


	componentDidMount() {

		AsyncStorage.getItem("SsoUserDetail").then((value) => {
			
			var val = JSON.parse(value);


			console.log("SsoUserDetail " + JSON.stringify(val));
			
			this.setState({
				salesEmail : val.salesEmail,
				first_name : val.fname,
				last_name : val.lname,
				email_address : val.email,
				mailing_address : val.mailing_address,
				city : val.city,
				zip_code : val.postalcode,
				phone_number : val.phone,
				office_address : val.office_name,
				stateId : val.state,
				countyId : val.county,
				title_rep_name : val.titleRep,
				mfaInternalID : val.mfaInternalID,
			}, this.callGetStatesApi)
			  
			console.log("salesEmail " + val.salesEmail + " first_name " + val.fname + " last_name " + val.lname + " email_address " + val.email + " mailing_address " + val.mailing_address + " city " + val.city + " zip_code " + val.postalcode + " phone_number " + val.phone + " office_address " + val.office_name + " stateId " + val.state + " countyId " + val.county + " mfaInternalID " + val.mfaInternalID);
		

		});	

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
			console.log("state_id " + state_id);
			console.log("stateId " + this.state.stateId);
			
			if(this.state.stateId == state_id) {
				console.log("in if cond ");
				
				this.setState({
					user_state : state_name,
					stateField : state_name,
					state_name_drop_down : state_name,
					id_for_select_county : state_id,
					stateId : state_id
				}, this.callGetCountyApi(state_id));
				console.log("user_state " + state_name);
			} 
			/*else {
				if(i == 0) {
				this.setState({
					stateId : state_id,
					id_for_select_county : state_id,
					user_state : state_name,
				});
					this.state.srvItems.push({
						'key': '',
						'label':  'Select State'
					});
	
					this.state.srvItems.push({
						'key': state_id,
						'label': state_name
					});
	
				}
			}*/
		
			this.state.srvItems.push({
				'key': state_id,
					'label':  state_name
				});
			}
		});
	}
	  
		// call county values for drop down
	callGetCountyApi(IDofState) {
		if(this.state.countItems != "") {
			this.state.countItems = [];
		}

		callPostApi(GLOBAL.BASE_URL + GLOBAL.Get_County, {
			stateId: IDofState,
			})
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
						user_county : 'Select County',
						country : 'Select County',
						titleRep: '',
					}, this.callGetTitleRepApi(this.state.stateId, ''));
					this.state.countItems.push({
						'key' : '',
						'label' : 'Select County'
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
	
	callVerifyZipCodeApi() {
		if (this.state.stateField == 'Select State' && this.state.country == 'Select County'){
			stateField = '';
			country = '';
		} else {
			stateField = this.state.stateField;
			country = this.state.country;
		}
		if(this.state.zip_code != "") {
			callPostApi(GLOBAL.BASE_URL + GLOBAL.Verify_ZipCode, {
				'stateName': stateField,
				'countyName': country,
				'zipCode': this.state.zip_code,
			})
			.then((response) => {
				// Continue your code here...
				if (result.status == 'Success')
				{
					if (this.state.stateField == 'Select State' && this.state.country == 'Select County')
					{
						if(result.hasOwnProperty('data')){
							this.setState({stateField:result.data.state_name,country:result.data.county_name,user_county:result.data.county_name,stateId:result.data.state_id,county:result.data.county_id,company_id:result.data.company_id,city:result.data.city,state_code:result.data.state_code});
						}
					}
					
				}
				else {
					this.setState({zipCodeError : result.message});
					//Alert.alert('Alert!', JSON.stringify(result));
				}

			});	
		}
	}
	
	callGetCityCountyStateApi() {
		callPostApi(GLOBAL.BASE_URL + GLOBAL.Get_City_County_State, {
				zipCode: this.state.zip_code,
		}).then((response) => {
				// Continue your code here...
			if (result.status == 'success') {
				let dict = result.data.statecountycity
				this.setState({country: dict.County});
				this.setState({stateField: dict.stateName});
				this.setState({city: dict.City});
				stateId = dict.stateId
				countyId = dict.countyId
				countryArray = result.data.countyList			
			} else {
				Alert.alert('Alert!', JSON.stringify(result.message))
			}
		});
	}
	
	callGetTitleRepApi(IDofState,IDofCounty)
	{

		console.log("IDofState " + IDofState);
		console.log("IDofCounty " + IDofCounty);
		

		if(IDofCounty != ''){
			callPostApi(GLOBAL.BASE_URL + GLOBAL.Get_Title_Rep, {
				stateId: IDofState,
				countyId: IDofCounty,
		
			})
			.then((response) => {

				console.log("response of title rep " + JSON.stringify(result));

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
						title_rep_name : 'Select Title Rep',
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
						title_rep_name : 'Select Title Rep',
						title_rep_id : ''
			});
			this.state.titleRepItems.push({
					'key' : '',
					'label' : 'Select Title Rep'
			});
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

	onChangeState(option) {
		if(option.label == 'Select State') {
			this.setState({
				user_state : option.label,
				countyDisable : true,
				titleRepDisable : true,
			});
		} else {
			this.setState({
				user_state : option.label,
				countyDisable : false,
			});
		}

		this.setState({
			stateField : option.label
		});

		if(option.label == 'Select State') {
			this.setState({
				stateId : option.key,
				countyId: '',
				titleRep: '',
				stateError:'',
				zip_code: '',
			}, this.callGetCountyApi(this.state.id_for_select_county));
			
		} else {
			this.setState({
				stateId : option.key,
				countyId: '',
				titleRep: '',
				stateError:'',
				zip_code: '',
			}, this.callGetCountyApi(option.key));
		}
	}
	  
	onChangeCounty(option) {
		if(option.label == 'Select County') {
			this.setState({
				titleRepDisable : true,
			});
		} else {
			this.setState({
				titleRepDisable : false,
			});	  
		}
		countyId = option.key;
		this.setState({
			user_county : option.label,
			country : option.label,
			county: countyId,
			countyId: countyId,
			titleRep: '',
			countryError: '',
			zip_code: '',
		}, this.callGetTitleRepApi(this.state.stateId,option.key));
	}
	  
	onTitleRepChange(option) {
		titleRepId = option.key;
		this.setState({
			title_rep_name : option.label,
			titleRepError:'',
		});
		this.state.title_rep_id = titleRepId;
	}
	

	 // Method to move on signUp screen.
	moveToSignIn() {
		this.props.navigator.pop()
	}

	updatePhoneNumberFormat(phone_number){
		phone_number = phone_number.replace(/[^\d.]/g,'').replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
	   this.setState({phone_number : phone_number});
   }
	
	// after click on move forward arrow to submit first form of signup
	moveToNextSignUp() {


		if (this.state.first_name == '') {
			this.setState({firstNameError : STRINGS.t('first_name_error_message')});
		}else if(this.state.first_name.length < 2 || this.state.first_name.length > 50){
			this.setState({firstNameError : STRINGS.t('first_name_char_error_message')});
			var errMsgFlag = '1';
		} else {
			this.setState({firstNameError : ''});
		}
		if (this.state.last_name == '') {
			this.setState({lastNameError : STRINGS.t('last_name_error_message')});
		}else if(this.state.last_name.length < 2 || this.state.last_name.length > 50){
			this.setState({lastNameError : STRINGS.t('last_name_char_error_message')});
			var errMsgFlag = '1';
		} else {
			this.setState({lastNameError : ''});
		}
		if (this.state.email_address == '') {
			this.setState({emailAddressError : STRINGS.t('email_error_message')});
		}else if(this.state.email_address.length < 2 || this.state.email_address.length > 100){
			this.setState({emailAddressError : STRINGS.t('email_char_error_message')});
			var errMsgFlag = '1';
		} else {
			this.setState({emailAddressError : ''});
		}
		if(this.state.email_address != '') {
			if (!validateEmail(this.state.email_address)) {
				this.setState({emailAddressError : STRINGS.t('validation_email_error_message')});
			 } else {
				this.setState({emailAddressError : ''});
			 }
		}	 
		if (this.state.confirm_email_address == '') {
			this.setState({confirmEmailAddressError : STRINGS.t('confirm_email_error_message')});
		} else {
			 if (this.state.email_address != this.state.confirm_email_address) {
				this.setState({confirmEmailAddressError : STRINGS.t('confirm_email')});
			} else {
				this.setState({confirmEmailAddressError : ''});
			}
		}

		phone_number = this.state.phone_number.replace(/[^\d.]/g,'');
		if(this.state.mailing_address == ''){
		   this.setState({mailingAddressError : STRINGS.t('mailing_address_error')});
		}else if(this.state.mailing_address.length < 2 || this.state.mailing_address.length > 120){
			this.setState({mailingAddressError : STRINGS.t('mailing_address_char_error')});
			var errMsgFlag = '1';
		}
		if(this.state.city == '') {
		   this.setState({cityError : STRINGS.t('city_error')});   
		}else if(this.state.city.length < 2 || this.state.city.length > 120){
			this.setState({cityError : STRINGS.t('city_char_error')});
			var errMsgFlag = '1';
		}
	   	if(this.state.stateField == 'Select State')
	   	{
		   this.setState({stateError : STRINGS.t('state_error')});
		  // this.dropdown.alertWithType('error', 'Error', STRINGS.t('state_error'));
		   
	  	}
	   	if(this.state.countyId == '')
	   	{
		   this.setState({countryError : STRINGS.t('country_error')});
		   //this.dropdown.alertWithType('error', 'Error', STRINGS.t('country_error'));
		   
	   	}
		if(this.state.zip_code == '')
		{
			this.setState({zipCodeError : STRINGS.t('zip_code_error')});
		}
		if(phone_number == '')
		{
			this.setState({phoneNumberError : STRINGS.t('phone_number_error')});
			
		}else if(phone_number.length != 10){
			this.setState({phoneNumberError : STRINGS.t('phone_number_char_error')});
			var errMsgFlag = '1';
		}
		if(this.state.office_address == '')
		{
			this.setState({officeAddressError : STRINGS.t('office_address_error')});
			
		}else if(this.state.office_address.length < 2 || this.state.office_address.length > 20){
			this.setState({officeAddressError : STRINGS.t('office_address_char_error')});
			var errMsgFlag = '1';
		}
		if(this.state.title_rep_id == '')
		{
			this.setState({titleRepError : STRINGS.t('title_rep_error')});
			//this.dropdown.alertWithType('error', 'Error', STRINGS.t('title_rep_error'));
		}
		/*if(this.state.mailing_address != '' && this.state.city != '' && this.state.stateField != '' && this.state.country != '' && this.state.zip_code != '' && this.state.phone_number != '' && this.state.phone_number.length >=10 && this.state.office_address != '' && this.state.title_rep_name != '' && this.state.title_rep_id != '' && this.state.zipCodeError == '')
		{
			this.callSaveUserApi()
		}*/

   
		if(this.state.first_name != '' && this.state.last_name != '' && this.state.email_address != '' && validateEmail(this.state.email_address) && this.state.mailing_address != '' && this.state.city != '' && this.state.stateField != '' && this.state.country != '' && this.state.zip_code != '' && this.state.phone_number != '' && this.state.phone_number.length >=10 && this.state.office_address != '' && this.state.title_rep_name != '' && this.state.title_rep_id != '' && this.state.zipCodeError == '') {
			
			console.log("in if cond");

			this.callSaveUserApi()
	
		//var dict =  {fname: this.state.first_name, lname: this.state.last_name, email: this.state.email_address}
		  // AsyncStorage.setItem("UserInfoForReg", JSON.stringify(dict));
		  // this.props.navigator.push({name: 'SignUp1', index: 0});
		}
	}

	callSaveUserApi()
	{
		singleSignOnRequest = {
			fname:this.state.first_name,
			lname:this.state.last_name,
			email:this.state.email_address,
			state:this.state.stateId,
			county:this.state.countyId,
			city:this.state.city,
			zipcode:this.state.zip_code,
			mailing_address:this.state.mailing_address,
			office_name:this.state.office_address,
			phone:this.state.phone_number,
			titlerep:this.state.title_rep_id,
			mfaInternalID:this.state.mfaInternalID,
			salesEmail:this.state.salesEmail,
		};


		console.log("singleSignOnRequest " + JSON.stringify(singleSignOnRequest));

		callPostApi(GLOBAL.BASE_URL + GLOBAL.registerSingleSignOn, singleSignOnRequest
		).then((response) => {
			//alert(JSON.stringify(result));
			
			console.log("registerSingleSignOn resp " + JSON.stringify(result));

			if(result.message == 'success') {
				AsyncStorage.setItem("userDetail", JSON.stringify(result.data));
				this.props.navigator.push({name: 'Dashboard', index: 0 });
			} else if (result.message != 'success') {
				this.dropdown.alertWithType('error', 'Error', 'Error occured. Please try again!');
	
			}
			// Continue your code here...
			/*if(result.status == "success"){
				this.dropdown.alertWithType('success', 'Success', result.message);
			}*/

		});
	}


	onChange(fieldVal, fieldName) {
		if(fieldName == 'firstNameError') {
			if(fieldVal != '') {
				this.setState({
					[fieldName] : ""
				});
			} else {
				this.setState({
					[fieldName] : STRINGS.t('first_name_error_message')
				});
			}
		}

		if(fieldName == 'lastNameError') {
			if(fieldVal != '') {
				this.setState({
					[fieldName] : ""
				});
			} else {
				this.setState({
					[fieldName] : STRINGS.t('last_name_error_message')
				});
			}
		}

		if(fieldName == 'emailAddressError') {
			if(fieldVal != '') {
				if (!validateEmail(fieldVal)) {
					this.setState({
						[fieldName] : STRINGS.t('validation_email_error_message')
					});
				 } else {
					this.setState({
						[fieldName] : ""
					});
				 }
			} else {
				if(fieldVal == '') {
					this.setState({
						[fieldName] : STRINGS.t('email_error_message')
					});
				} else if (fieldVal.length < 2 || fieldVal.length > 100) {
					this.setState({
						[fieldName] : STRINGS.t('email_char_error_message')
					});
					var errMsgFlag = '1';
				} else {
					this.setState({
						[fieldName] : ""
					});
				}
			}
			if(fieldName == 'mailingAddressError') {
				if(fieldVal != '') {
					this.setState({
					[fieldName] : ""
					});
				} else {
					this.setState({
					[fieldName] : STRINGS.t('mailing_address_error')
					});
				}
			}
		
			if(fieldName == 'cityError') {
				if(fieldVal != '') {
					this.setState({
					[fieldName] : ""
					});
				} else {
					this.setState({
					[fieldName] : STRINGS.t('city_error')
					});
				}
			}

			if(fieldName == 'zipCodeError') {
				if(fieldVal != '') {
					this.setState({
					[fieldName] : ""
					});
				} else {
					this.setState({
					[fieldName] : STRINGS.t('zip_code_error')
					});
				}
			}
		
			if(fieldName == 'officeAddressError') {
				if(fieldVal != '') {
					this.setState({
					[fieldName] : ""
					});
				} else {
					this.setState({
					[fieldName] : STRINGS.t('office_address_error')
					});
				}
			}

		}

		if(fieldName == 'confirmEmailAddressError') {
			if(fieldVal != '') {	
				if (this.state.email_address != fieldVal) {
					this.setState({
						[fieldName] : STRINGS.t('confirm_email')
					});
				} else {
					this.setState({
						[fieldName] : ""
					});
				}
			} else {
				this.setState({
					[fieldName] : STRINGS.t('confirm_email_error_message')
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
				<TouchableOpacity  style={Styles.back_icon_parent} onPress={this.moveToSignIn.bind(this)}>
					<Image style={Styles.back_icon} source={Images.back_icon}/>
				</TouchableOpacity> 
				<Text style={Styles.header_title}>{STRINGS.t('User_Details')}</Text>					
			</View>
			</Image>

          <View style={signUpStyles.backgroundViewContainerSsoRegistration}>
			<Text style={signUpStyles.generalInfoStyleSsoRegistration}> {STRINGS.t('Sso_Title')}</Text>
			<Text style={signUpStyles.generalInfoStyleSsoRegistrationDes}> {STRINGS.t('Sso_Desciption')}</Text>
		  </View>

          <ScrollView style={signUpStyles.keyboardContainerSsoRegistration}>

          <View style={signUpStyles.viewContainer}>

            <View style={signUpStyles.textInputBackgroundViewContainer}>
            <Image style = {signUpStyles.logoImage} source={Images.username} />
            <TextInput
			placeholderTextColor={this.state.firstNameError == "" ? "#999999": "red"}
			placeholder={this.state.firstNameError == "" ? STRINGS.t('first_name') : this.state.firstNameError} underlineColorAndroid = 'transparent' secureTextEntry={false} style={signUpStyles.textInput}  returnKeyType ="next" keyboardType="email-address"  onChangeText={(val) => this.setState({first_name: val}, this.onChange(val,'firstNameError'))} value={this.state.first_name} />
			{ this.state.firstNameError != '' ? <Icon onPress={() => this.onIconClick(this.state.firstNameError)} name='ios-alert' style={{color:'red'}}/> : null }
            </View>
            { this.state.firstNameError != '' ? <View style={signUpStyles.lineErrorView}></View> : <View style={signUpStyles.lineView}></View> }
            

            <View style={signUpStyles.textInputBackgroundViewContainer}>
            <Image style = {signUpStyles.logoImage} source={Images.username} />
			<TextInput 
			placeholderTextColor={this.state.lastNameError == "" ? "#999999": "red"}
			placeholder={this.state.lastNameError == "" ? STRINGS.t('last_name') : this.state.lastNameError} underlineColorAndroid = 'transparent' secureTextEntry={false} style={signUpStyles.textInput}  returnKeyType ="next" keyboardType="email-address"  onChangeText={(val) => this.setState({last_name: val},  this.onChange(val, 'lastNameError'))} value={this.state.last_name} />
            { this.state.lastNameError != '' ? <Icon onPress={() => this.onIconClick(this.state.lastNameError)} name='ios-alert' style={{color:'red'}}/> : null }
            </View>
            { this.state.lastNameError != '' ? <View style={signUpStyles.lineErrorView}></View> : <View style={signUpStyles.lineView}></View> }
            <View style={signUpStyles.textInputBackgroundViewContainer}>
            <Image style = {signUpStyles.logoImage} source={Images.emailid} />
            <TextInput 
			ref="emailAddress"
			placeholderTextColor={this.state.emailAddressError == "" ? "#999999": "red"}
			placeholder={this.state.emailAddressError == "" ? STRINGS.t('email_address') : this.state.emailAddressError} underlineColorAndroid = 'transparent' secureTextEntry={false} style={signUpStyles.textInput}  returnKeyType ="next" keyboardType="email-address"  onChangeText={(val) => this.setState({email_address : val}, this.onChange(val, 'emailAddressError'))} value={this.state.email_address} />
			{ this.state.emailAddressError != '' ? <Icon onPress={() => this.onIconClick(this.state.emailAddressError)} name='ios-alert' style={{color:'red'}}/> : null }
            </View>
			{ this.state.emailAddressError != '' ? <View style={signUpStyles.lineErrorView}></View> : <View style={signUpStyles.lineView}></View> }

			<View style={signUpStyles.textInputBackgroundViewContainer}>
				<Image style = {signUpStyles.logoImage} source={Images.mailing_address_icon}/>
				<TextInput 
					
					placeholderTextColor={this.state.mailingAddressError == "" ? "#999999": "red"}			
					placeholder={this.state.mailingAddressError == "" ? STRINGS.t('Mailing_Address') : this.state.mailingAddressError} underlineColorAndroid = 'transparent' secureTextEntry={false} style={signUpStyles.textInput}  returnKeyType ="next" keyboardType="email-address" value={this.state.mailing_address}  onChangeText={(val) => this.setState({mailing_address: val}, this.onChange(val, 'mailingAddressError'))} 
				/>
				{ this.state.mailingAddressError != '' ? <Icon onPress={() => this.onIconClick(this.state.mailingAddressError)} name='ios-alert' style={{color:'red'}}/> : null }           
			</View>
				{ this.state.mailingAddressError != '' ? <View style={signUpStyles.lineErrorView}></View> : <View style={signUpStyles.lineView}></View> }

				<View style={signUpStyles.textInputBackgroundViewContainer}>
					<Image style = {signUpStyles.logoImage} source={Images.location_icon}/>
						<TextInput
							placeholderTextColor={this.state.cityError == "" ? "#999999": "red"}			
							placeholder={this.state.cityError == "" ? STRINGS.t('City') : this.state.cityError} underlineColorAndroid = 'transparent' secureTextEntry={false} style={signUpStyles.textInput}  returnKeyType ="next" keyboardType="email-address"  onChangeText={(value) => this.setState({city: value}, this.onChange(value, 'cityError'))} value={this.state.city} />
					{ this.state.cityError != '' ? <Icon onPress={() => this.onIconClick(this.state.cityError)} name='ios-alert' style={{color:'red'}}/> : null }           
				</View>		  
					{ this.state.cityError != '' ? <View style={signUpStyles.lineErrorView}></View> : <View style={signUpStyles.lineView}></View> }
			
				<View style={{width:'100%', flexDirection:'row', marginTop : 10}}>
					<Text style={signUpStyles.drpdwnlabel}>State</Text>  
					{ this.state.stateError != '' ?
					<ModalSelector
						data={this.state.srvItems}
						initValue={this.state.stateField}
						selectTextStyle={{fontSize:12, color : '#ff0000'}}
						style={{width:'50%',marginTop:2, borderRadius: 4, borderWidth: 0.5, borderColor: '#ff0000'}}
						onChange={(option) => this.onChangeState(option)} 
					>
					</ModalSelector>
					:
					<ModalSelector
						data={this.state.srvItems}
						initValue={this.state.stateField}
						selectTextStyle={{fontSize:12}}
						style={{ width:'50%',marginTop:2}}
						onChange={(option) => this.onChangeState(option)} 
					>
					</ModalSelector>
					}  
					<Image style={signUpStyles.drpdwnIconsmall} source={Images.dropdown_arrow}/>
				</View>  

					{ this.state.stateError != '' ? <View style={[signUpStyles.lineErrorView, {marginTop:10}]}></View> : <View style={[signUpStyles.lineView, {marginTop:10}]}></View> }
					
					<View style={{width:'100%', flexDirection:'row', marginTop : 10}}>
						<Text style={signUpStyles.drpdwnlabel}>County</Text>  

						{this.state.countryError != '' ? 
						<ModalSelector
							data={this.state.countItems}
							initValue={this.state.user_county}
							disabled={false}
							selectTextStyle={{fontSize:12, color : '#ff0000'}}
							style={{width:'50%',marginTop:2, borderRadius: 4, borderWidth: 0.5, borderColor: '#ff0000'}}
							onChange={(option) => this.onChangeCounty(option)} 
						>
						</ModalSelector>
						: 
						<ModalSelector
							data={this.state.countItems}
							initValue={this.state.user_county}
							disabled={false}
							selectTextStyle={{fontSize:12}}
							style={{width:'50%',marginTop:2}}
							onChange={(option) => this.onChangeCounty(option)} 
						>
						</ModalSelector>
						}

						<Image style={signUpStyles.drpdwnIconsmall} source={Images.dropdown_arrow}/>
					</View>   
						{ this.state.countryError != '' ? <View style={[signUpStyles.lineErrorView, {marginTop:10}]}></View> : <View style={[signUpStyles.lineView, {marginTop:10}]}></View> }

					<View style={signUpStyles.textInputBackgroundViewContainer}>
						<Image style = {signUpStyles.logoImage} source={Images.zip_code_icon}/>
						<TextInput 
							ref="ZipCode"
							placeholderTextColor={this.state.zipCodeError == "" ? "#999999": "red"}	 maxLength = {5}		
							placeholder={this.state.zipCodeError == "" ? STRINGS.t('Zip_Code') : this.state.zipCodeError} underlineColorAndroid = 'transparent' secureTextEntry={false} style={signUpStyles.textInput}  returnKeyType ="next" keyboardType="numeric"  onChangeText={(val) => this.setState({zip_code: val.replace(/[^\d.]/g,'')}, this.onChange(val, 'zipCodeError'))} value={this.state.zip_code} onEndEditing={this.callVerifyZipCodeApi.bind(this)}/>
							{ this.state.zipCodeError != '' ? <Icon onPress={() => this.onIconClick(this.state.zipCodeError)} name='ios-alert' style={{color:'red'}}/> : null }                 
					</View>
					{ this.state.zipCodeError != '' ? <View style={signUpStyles.lineErrorView}></View> : <View style={signUpStyles.lineView}></View> }		

					<View style={signUpStyles.textInputBackgroundViewContainer}>
						<Image style = {signUpStyles.logoImage} source={Images.phone_number_icon}/>
							<TextInput 
							
							placeholderTextColor={this.state.phoneNumberError == "" ? "#999999": "red"}			
							placeholder={this.state.phoneNumberError == "" ? STRINGS.t('Phone_Number') : this.state.phoneNumberError} underlineColorAndroid = 'transparent' secureTextEntry={false} style={signUpStyles.textInput}  returnKeyType ="next" keyboardType="numeric" 
							
							onChangeText={(value) => this.setState({phone_number: value}, this.onChangePhone(value, 'phoneNumberError'))}								
							onEndEditing={ (event) => this.updatePhoneNumberFormat(event.nativeEvent.text) } value={this.state.phone_number} />
							{ this.state.phoneNumberError != '' ? <Icon onPress={() => this.onIconClick(this.state.phoneNumberError)} name='ios-alert' style={{color:'red'}}/> : null }                 		 
					</View>
						{ this.state.phoneNumberError != '' ? <View style={signUpStyles.lineErrorView}></View> : <View style={signUpStyles.lineView}></View> }

					<View style={signUpStyles.textInputBackgroundViewContainer}>
						<Image style = {signUpStyles.logoImage} source={Images.location_icon}/>
							<TextInput 
								placeholderTextColor={this.state.officeAddressError == "" ? "#999999": "red"}			
								placeholder={this.state.officeAddressError == "" ? STRINGS.t('Office_Address') : this.state.officeAddressError} underlineColorAndroid = 'transparent' secureTextEntry={false} style={signUpStyles.textInput}  returnKeyType ="next" keyboardType="email-address"  onChangeText={(val) => this.setState({office_address: val}, this.onChange(val, 'officeAddressError'))} />
								{ this.state.officeAddressError != '' ? <Icon onPress={() => this.onIconClick(this.state.officeAddressError)} name='ios-alert' style={{color:'red'}}/> : null }
					 </View>
						 { this.state.officeAddressError != '' ? <View style={signUpStyles.lineErrorView}></View> : <View style={signUpStyles.lineView}></View> }

					<View style={{width:'100%', flexDirection:'row', marginTop : 10}}> 
						<Text style={signUpStyles.drpdwnlabelbig}>{STRINGS.t('Title_Rep_Name')}</Text> 

						{this.state.titleRepError != '' ?	

						<ModalSelector
							style={{width:'50%',marginTop:2, borderRadius: 4, borderWidth: 0.5, borderColor: '#ff0000'}}
							data={this.state.titleRepItems}
							disabled={false}
							initValue={this.state.title_rep_name}
							selectTextStyle={{fontSize:12, color : '#ff0000'}}
							onChange={(option) => this.onTitleRepChange(option)} >
						</ModalSelector>
						:	
						<ModalSelector
							style={{width:'50%',marginTop:2}}
							disabled={false}
							selectTextStyle={{fontSize:12}}
							data={this.state.titleRepItems}
							initValue={this.state.title_rep_name}
							onChange={(option) => this.onTitleRepChange(option)} >
						</ModalSelector>
						}
						<Image style={signUpStyles.drpdwnIcon} source={Images.dropdown_arrow}/>
					</View> 
					{ this.state.titleRepError != '' ? <View style={signUpStyles.lineErrorView}></View> : <View style={[signUpStyles.lineView,{marginTop:10}]}></View> }



				
            <TouchableOpacity style={signUpStyles.rightContainer} onPress={this.moveToNextSignUp.bind(this)}>
            <Image source={Images.nextarrow} />
            </TouchableOpacity>

          <KeyboardSpacer/>
          </View>
          </ScrollView>
			{/*
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
			*/
			}			
			<DropdownAlert ref={(ref) => this.dropdown = ref}/>
        </View>
  )}
}

export default SsoRegistration
