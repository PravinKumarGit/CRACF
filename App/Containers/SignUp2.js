import React, { Component, } from 'react'

import signUpStyles from './Styles/SignUpStyle'    // Import SignUpStyle.js class from Styles Folder to maintain UI.
import loginStyles from './Styles/LoginScreenStyle'     // Import LoginScreenStyle.js class from Styles Folder to maintain UI.
import Images from '../Themes/Images.js'          // Import Images.js class from Image Folder for images.
import STRINGS from '../GlobalString/StringData'  // Import StringData.js class for string localization.
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Spinner from 'react-native-loading-spinner-overlay';
import ModalDropdown from 'react-native-modal-dropdown';
import Picker from 'react-native-picker';
import Styles from './Styles/SellerStyleDesign';
import ModalSelector from 'react-native-modal-selector';
import DropdownAlert from 'react-native-dropdownalert';
import { Container, Content, InputGroup, Input, Icon } from 'native-base';
import {callGetApi, callPostApi} from '../Services/webApiHandler.js' // Import webApiHandler.js class for calling api.
import {View, Text, StyleSheet, Image, TextInput, Alert, ScrollView, TouchableOpacity, NetInfo, AsyncStorage, Navigator} from 'react-native';
var GLOBAL = require('../Constants/global');
var Header = require('./HomeHeader');

class SignUp2 extends Component {
	state = {
		mailing_address: '',
		mailingAddressError : '',
		country: 'Select County',
		user_county : "Select County",
		countryError : '',
		city: '',
		cityError : '',
		stateField: 'Select State',
		stateError : '',
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
		username: '',
		newpass: '',
		animating   : 'false',
		visble: false,
	};
	moveToPrevious() {
		this.props.navigator.pop()
	}
	
	moveToLoginScreen() {
		this.props.navigator.popToTop()
	}
	
	updatePhoneNumberFormat(phone_number){
		 phone_number = phone_number.replace(/[^\d.]/g,'').replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
		this.setState({phone_number : phone_number});
	}
 
	submit() {
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
		if(this.state.mailing_address != '' && this.state.city != '' && this.state.stateField != '' && this.state.country != '' && this.state.zip_code != '' && this.state.phone_number != '' && this.state.phone_number.length >=10 && this.state.office_address != '' && this.state.title_rep_name != '' && this.state.title_rep_id != '' && this.state.zipCodeError == '')
		{
			this.callSaveUserApi()
		}
 	}
 	componentDidMount() {
   		NetInfo.isConnected.addEventListener(
     		'connectionChange',
    		 this._handleConnectivityChange
  		);
   		this.callGetStatesApi();
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

			//alert(JSON.stringify(result));

			// Continue your code here...
			this.setState({
				stateArray : result.data,
			});

          for (let i = 0; i < this.state.stateArray.length; i++) {
				state_name = this.state.stateArray[i].statename;
				state_id = this.state.stateArray[i].id;
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
			}else{
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

	callGetCityCountyStateApi()
	{

	callPostApi(GLOBAL.BASE_URL + GLOBAL.Get_City_County_State, {
			zipCode: this.state.zip_code,
		})
	.then((response) => {
			// Continue your code here...
			if (result.status == 'success')
			{
				let dict = result.data.statecountycity
				this.setState({country: dict.County});
				this.setState({stateField: dict.stateName});
				this.setState({city: dict.City});
				stateId = dict.stateId
				countyId = dict.countyId
				countryArray = result.data.countyList			
			}
			else {
				Alert.alert('Alert!', JSON.stringify(result.message))
			}

		});
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


	callSaveUserApi()
	{
		// get values from Saved preferences
		AsyncStorage.getItem("UserInfoForReg1").then((value) => {
			var dict = JSON.parse(value)
			this.setState({animating:'true'});	
				//Call Api for user saving

				callPostApi(GLOBAL.BASE_URL + GLOBAL.Save_User, {
						fname: dict.fname,
						lname: dict.lname,
						email: dict.email,
						username: dict.username,
						newpass: dict.newpass,
						mailing_address: this.state.mailing_address,
						city: this.state.city,
						state: this.state.stateId,
						county: this.state.county,
						zipcode: this.state.zip_code,
						phone: this.state.phone_number,
						office_name: this.state.office_address,
						titlerep: this.state.title_rep_id,
						drenmls: "",
						corporatenmls: "",
				})
				.then((response) => {
					//alert(JSON.stringify(result));
					// Continue your code here...
					if(result.status == "success"){
						this.dropdown.alertWithType('success', 'Success', result.message);
						
						
					}
				});
			}).done();

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

	  	onClose(data) {
			if(data.type == 'success') {
				this.setState({animating:'false'});	
				this.props.navigator.push({name: 'Login', index: 0 });
			}
	  	}

	 	onChange(fieldVal, fieldName) {
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

		onIconClick(msg){
			this.dropdown.alertWithType('error', 'Error', msg);
		}	



 render() {
	if(this.state.animating == 'true') {
		this.state.visble = true;
	} else {
		this.state.visble = false;
	}

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
				<Text style={signUpStyles.generalInfoStyle}> {STRINGS.t('Contact_Information')}</Text>
			</View>
			<ScrollView style={signUpStyles.keyboardContainer}>
				<View style={signUpStyles.viewContainer}>
				<View style={{ flex: 1 }}>
					<Spinner visible={this.state.visble} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
				</View>
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
								disabled={this.state.countyDisable}
								selectTextStyle={{fontSize:12, color : '#ff0000'}}
								style={{width:'50%',marginTop:2, borderRadius: 4, borderWidth: 0.5, borderColor: '#ff0000'}}
								onChange={(option) => this.onChangeCounty(option)} 
							>
							</ModalSelector>
							: 
							<ModalSelector
								data={this.state.countItems}
								initValue={this.state.user_county}
								disabled={this.state.countyDisable}
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
								disabled={this.state.titleRepDisable}
								initValue={this.state.title_rep_name}
								selectTextStyle={{fontSize:12, color : '#ff0000'}}
								onChange={(option) => this.onTitleRepChange(option)} >
							</ModalSelector>
							:	
							<ModalSelector
								style={{width:'50%',marginTop:2}}
								disabled={this.state.titleRepDisable}
								selectTextStyle={{fontSize:12}}
								data={this.state.titleRepItems}
								initValue={this.state.title_rep_name}
								onChange={(option) => this.onTitleRepChange(option)} >
							</ModalSelector>
							}
							<Image style={signUpStyles.drpdwnIcon} source={Images.dropdown_arrow}/>
					</View> 
					{ this.state.titleRepError != '' ? <View style={signUpStyles.lineErrorView}></View> : <View style={[signUpStyles.lineView,{marginTop:10}]}></View> }

					
					<TouchableOpacity style={signUpStyles.buttonContainerSignupSubmit} onPress={this.submit.bind(this)}>
						<Text style={signUpStyles.style_btnLogin}> {STRINGS.t('Submit')}</Text>
					</TouchableOpacity>

					<KeyboardSpacer/>
				</View>
         </ScrollView>
		 <View style={loginStyles.footerParent}>
			<View style={loginStyles.footerlineView}>
			</View>
			<View style={loginStyles.footerContainer}>
			<Text style={loginStyles.memberStyles}> {STRINGS.t('Already_Registered')} </Text>
			<TouchableOpacity onPress={this.moveToLoginScreen.bind(this)}>
			<Text style={loginStyles.usernameAndPasswordStyles}> {STRINGS.t('SIGNIN')}</Text>
			</TouchableOpacity>
			</View>
			<View style={loginStyles.iphonexFooter}></View>
		</View>
		<DropdownAlert
					ref={(ref) => this.dropdown = ref}
					onClose={data => this.onClose(data)}
				/>						
     </View>
     )}
}
export default SignUp2
