import React, { Component } from 'react';
import {Container, Left, Right, Title, Body, Button}  from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import {Image, View, Dimensions, Alert, Text, TextInput, TouchableOpacity, TouchableHighlight, ScrollView, AsyncStorage, ListView, Modal, ToolbarAndroid, StyleSheet, Linking, BackHandler, NetInfo} from 'react-native';
import Images from '../Themes/Images.js';
import Styles from './Styles/AddressBookStyles';
import CustomStyle from './Styles/CustomStyle';
import BuyerStyle from './Styles/BuyerStyle';

import renderIf from 'render-if';
import {callGetApi, callPostApi} from '../Services/webApiHandler.js' // Import 
import STRINGS from '../GlobalString/StringData'
import Toast from 'react-native-simple-toast';
var nativeImageSource = require('nativeImageSource');
var Header = require('./Header');
var GLOBAL = require('../Constants/global');
const  {width, height} = Dimensions.get('window')

import PopupDialog from 'react-native-popup-dialog';
import PopupDialogEmail from 'react-native-popup-dialog';
import Spinner from 'react-native-loading-spinner-overlay'; 
import {authenticateUser} from '../Services/CommonValidation.js'  // Import CommonValidation class to access common methods for validations.
import { Dropdown } from 'react-native-material-dropdown';
import DropdownAlert from 'react-native-dropdownalert'
import {validateEmail} from '../Services/CommonValidation.js'

export default class AddressBook extends Component{
	constructor(props){
		super(props);
		this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
		 // For showing list of buyer's calculator in popup onload so that error will not occur
		var ds = new ListView.DataSource({
		   rowHasChanged: (r1, r2) => r1 !== r2
		 });
		var addrsList = {};
		addrsList['email'] = 'email';
		this.state ={
			addrsSource: ds.cloneWithRows(addrsList),
			addrsSourceOrg: ds.cloneWithRows(addrsList),
			addrsSourceEmpty: ds.cloneWithRows(addrsList),
			emptCheck: false,
			modalAddAddressesVisible: false,
			contact_number: '',
			name:'',
			email: '',
			edit:false,
			animating: false,
			scrollvalue : false,
			visble : false,
			connectionInfo : '',
			emailAddress: '',
			emailError: '',
			nameError: '',
			phoneNumberError : '',
			showListing: false,
			keyword: '',
		}
		this.renderRow = this.renderRow.bind(this);
		this.handleFirstConnectivityChange = this.handleFirstConnectivityChange.bind(this);

	}
	
		
	onBackButtonPress() {
		this.props.navigator.push({name: 'Dashboard', index: 0 });
		//this.props.navigator.pop()
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
					this.setState(newstr,this.callUserAddressBook);
			}).done();
			this.setState({animating:'true'});
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
	
	// Function for fetching and setting value of price based on month on prepaid page
	callUserAddressBook()
	{
		callPostApi(GLOBAL.BASE_URL + GLOBAL.user_address_book, {
		"user_id": this.state.user_id

		},this.state.access_token)
		.then((response) => {
			var ds = new ListView.DataSource({
				rowHasChanged: (r1, r2) => r1 !== r2
			});
			if(_.size(result.data) > 0){
				this.setState({showListing:true,addrsSourceOrg: ds.cloneWithRows(result.data),addrsSource: ds.cloneWithRows(result.data),arrayholder: result.data,emptCheck: false},this.SearchFilterFunction.bind(this,this.state.keyword));
			}else{
				this.setState({showListing: false});
			}
			this.setState({animating:false});
		});
	}
	
	SearchFilterFunction(text){
		if(text != ''){
			const newData = this.state.arrayholder.filter(function(item){
				const itemDataEmail = item.email.toUpperCase();
				const textData = text.toUpperCase();
				if(item.user_name != null) {
					const itemData = item.user_name.toUpperCase();
					if(itemData.indexOf(textData) > -1 || itemDataEmail.indexOf(textData) > -1){
						return true;
					}
				} else {
					if(itemDataEmail.indexOf(textData) > -1){
						return true;
					}	
				}

				if(item.phone_number != null){
					const itemDataPhone = item.phone_number.toUpperCase();
					if(itemDataEmail.indexOf(textData) > -1 || itemDataPhone.indexOf(textData) > -1){
						return true;
					}
				}else{
					if(itemDataEmail.indexOf(textData) > -1){
						return true;
					}
				}
			})
			if (newData.length > 0) {
				this.setState({
					addrsSource: this.state.addrsSource.cloneWithRows(newData),
					showListing: true,
				})
			}else{
				this.setState({
					addrsSource: this.state.addrsSourceEmpty,
					showListing: false
				})

			}
		}else{
			if (_.size(this.state.arrayholder) > 0) {
				this.setState({
					addrsSource: this.state.addrsSource.cloneWithRows(this.state.arrayholder),
					showListing: true,
				})
			}else{
				this.setState({
					addrsSource: this.state.addrsSourceEmpty,
					showListing: false
				})

			}
		}
	}
	
	// Function for adding new contact
	callAddtoUserAddressBook()
	{
		contact_number = this.state.contact_number.replace(/[^\d.]/g,'');
		let callAPiobj = {}
		callAPiobj["user_id"]= this.state.user_id
		callAPiobj["username"]= this.state.name
		callAPiobj["email"]=this.state.emailAddress
		callAPiobj["phone"]= contact_number
			var errMsgFlag = '0';
		if(this.state.name == ''){
			this.setState({nameError : STRINGS.t('full_name_error')});
			var errMsgFlag = '1';
		}else if(this.state.name.length < 2 || this.state.name.length > 100){
			this.setState({emailError : STRINGS.t('full_name_char_error')});
			var errMsgFlag = '1';
		}
		if (this.state.emailAddress == '')
		{
			this.setState({emailError : STRINGS.t('email_error_message')});
			var errMsgFlag = '1';
		}else if (!validateEmail(this.state.emailAddress)) {
			this.setState({emailError : STRINGS.t('validation_email_error_message')});
			var errMsgFlag = '1';
		}else if(this.state.emailAddress.length < 2 || this.state.emailAddress.length > 100){
			this.setState({emailError : STRINGS.t('email_char_error_message')});
			var errMsgFlag = '1';
		}
		/* if(phone_number == '')
		{
			this.setState({phoneNumberError : STRINGS.t('phone_number_error')});
			var errMsgFlag = '1';
		}else if(phone_number != '' && phone_number.length != 10){
			this.setState({phoneNumberError : STRINGS.t('phone_number_char_error')});
			var errMsgFlag = '1';
		} */
		if(errMsgFlag == '0'){
			if(this.state.edit == true){
				this.setState({animating : 'true'});
				callAPiobj["id"]= this.state.item_id
				callPostApi(GLOBAL.BASE_URL + GLOBAL.Update_contact_addressBook, callAPiobj,this.state.access_token)
				.then((response) => {

					console.log("updated cont " + JSON.stringify(result));

					if (result.status == 'success')
					{   

						this.setState({animating : 'false'});
						//this.props.navigator.pop()
						//this.props.navigator.push({name: 'AddressBook', index: 0 });
						this.dropdownAdd.alertWithType('success', 'Success', result.message);
						//Toast.show(result.message)
					}
					else {
						this.setState({animating : 'false'});
						this.dropdownAdd.alertWithType('error', 'Error', result.message);
						//Toast.show(result.message)
					}
				});
			}else{
				this.setState({animating : 'true'});
				callPostApi(GLOBAL.BASE_URL + GLOBAL.Save_contact_addressBook, callAPiobj,this.state.access_token)
				.then((response) => {
					if (result.status == 'success')
					{   
						this.setState({animating : 'false'});
						//this.props.navigator.pop()
						//this.props.navigator.push({name: 'AddressBook', index: 0 });
						//this.dropdown.alertWithType('success', 'Success', result.message);
						//Toast.show(result.message)
						this.dropdownAdd.alertWithType('success', 'Success', result.message);
						//Toast.show(result.message)
					}
					else {
						this.setState({animating : 'false'});
						this.dropdownAdd.alertWithType('error', 'Error', result.message);
						//Toast.show(result.message)
					}
				});
			}
		}	
	}

	editentry(entry){
		this.setState({nameError:'',emailError:'',item_id: entry.id,edit:true, name:entry.user_name, emailAddress:entry.email, contact_number:entry.phone_number,modalAddAddressesVisible: true});
	}

	deleteItemConfirmation(entry){
		Alert.alert( 'CostsFirst', 'Are you sure you want to delete this address book?', [ {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')}, {text: 'OK', onPress:this.deleteItem.bind(this,entry)}] );
	}
	
	deleteItem(entry){
		let callAPiobj = {}
		callAPiobj["user_id"]= this.state.user_id
		callAPiobj["id"]= entry.id
		callPostApi(GLOBAL.BASE_URL + GLOBAL.Delete_contact_addressBook, callAPiobj,this.state.access_token)
		.then((response) => {
			if (result.status == 'success')
			{   
				this.callUserAddressBook();
				//this.props.navigator.pop()
				this.dropdown.alertWithType('success', 'Success', result.message);
				//Toast.show(result.message)
			}
			else {
				Toast.show(result.message)
			}
		});
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
	
	renderRow(rowData) {
		return (
			<View>
				<View style={Styles.listItemContainer}>
					<View style={{width: '80%',justifyContent: 'center'}}>
						<TouchableOpacity onPress={()=>this.editentry(rowData)}>
							<Text style={Styles.listText}>
								{rowData.user_name}
							</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={()=>this.openmailortel("mailto:"+rowData.email)}>
							<Text style={Styles.listTextSmall}>
								{rowData.email}
							</Text>
						</TouchableOpacity>	
						<TouchableOpacity onPress={()=>this.openmailortel("tel:"+rowData.phone_number)}>
							<Text style={Styles.listTextSmall}>
								{rowData.phone_number}
							</Text>
						</TouchableOpacity>	
					</View>
					<View style={{width:'20%',alignItems:'flex-end'}}>
						
						<TouchableOpacity onPress={() => this.deleteItemConfirmation(rowData)}>
							<Image source={Images.recycle}/>
						</TouchableOpacity>
					</View>
				</View>
				<View style={[Styles.underline,{marginTop:20,marginBottom:20}]}></View>
			</View>			
		);
	}
	// For showing popup containing list of buyer's calculator
	setModalAddressesVisible(visible) {
		this.setState({name:'',emailAddress:'',contact_number:'', edit : false});
		this.setState({modalAddAddressesVisible: visible});
	}
	

	onChange(fieldVal, fieldName) {
		if (fieldVal == '') {
			this.setState({[fieldName] : STRINGS.t('email_error_message')});
		}else if (!validateEmail(fieldVal)) {
			this.setState({[fieldName] : STRINGS.t('validation_email_error_message')});
		}else if(fieldVal.length < 2 || fieldVal.length > 100){
			this.setState({[fieldName]  : STRINGS.t('email_char_error_message')});		
		} else {
			this.setState({
				[fieldName] : ""
			});	
		}
	}	

	/*onChange(text) {
		newText = text.replace(/[^\d.]/g,'');
		return newText;	
	}*/

	onChangePhone(fieldVal, fieldName) {
		fieldVal = fieldVal.replace(/[^\d.]/g,'');
		/*if(fieldVal == "") {
			this.setState({
				[fieldName] : STRINGS.t('phone_number_error')
			});
		} else*/
		 if (fieldVal.length != 10) {
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
	
	updatePhoneNumberFormat(phone_number){
		 phone_number = phone_number.replace(/[^\d.]/g,'').replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
		this.setState({contact_number : phone_number});
	}
	
	onIconClick(msg){
		this.dropdownAdd.alertWithType('error', 'Error', msg);
	}

	onClose(data) {
		if(data.type == 'success') {
			this.setState({name:'',emailAddress:'',contact_number:''});
			this.callUserAddressBook();
			this.setModalAddressesVisible(!this.state.modalAddAddressesVisible)
		}	
		//alert(JSON.stringify(data));

	}

	render() {
		let showable;
		if(this.state.animating == 'true') {
			this.state.scrollvalue = false;
			this.state.visble = true;
		} else {
			this.state.scrollvalue = true;
			this.state.visble = false;
		}

		if(this.state.connectionInfo != 'none') {
			showable=	<View style={Styles.MainContainer}>
			<View style={Styles.iphonexHeader}></View>
				<View>
					<Spinner visible={this.state.visble} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
				</View>	
			<View style={Styles.HeaderContainer}>
				<Image style={Styles.HeaderBackground} source={Images.header_background}></Image>
				<TouchableOpacity style={{width:'15%'}} onPress={this.onBackButtonPress.bind(this)}>
					<Image style={Styles.back_icon} source={Images.back_icon}/>
				</TouchableOpacity>
				<Text style={Styles.header_title}>Manage Address Book</Text>
				<TouchableOpacity style={{width:'15%', justifyContent:'center'}} onPress={() => {this.setModalAddressesVisible(!this.state.modalAddAddressesVisible)}}>
					<Text style={[Styles.headerbtnText,{alignSelf:'flex-end'}]}>{'Add'}</Text>
				</TouchableOpacity>
			</View>
			<Modal
				animationType="slide"
				transparent={false}
				visible={this.state.modalAddAddressesVisible}
				onRequestClose={() => {}}
			>
				<View style={Styles.MainContainer}>
			<View style={Styles.iphonexHeader}></View>
					<View style={Styles.HeaderContainer}>
						<Image style={Styles.HeaderBackground} source={Images.header_background}></Image>
						<TouchableOpacity style={{width:'20%'}} onPress={()=> this.setState({edit:false,modalAddAddressesVisible:false},this.callUserAddressBook)}>
							<Image style={Styles.back_icon} source={Images.back_icon}/>
						</TouchableOpacity>
						{renderIf(this.state.edit == true)(
						<Text style={Styles.header_title}>Edit Address</Text>
						)}
						{renderIf(this.state.edit == false)(
						<Text style={Styles.header_title}>Add Address</Text>
						)}
						<TouchableOpacity style={{width:'20%', justifyContent:'center'}} onPress={() => {this.callAddtoUserAddressBook()}}>
							<Text style={[Styles.headerbtnText,{alignSelf:'flex-end'}]}>{(this.state.edit == true)? 'Update' : 'Save'}</Text>
						</TouchableOpacity>
					</View>
				<ScrollView style={{padding:0}}>	
				<View style={Styles.Fieldscontainer}>
					<View style={Styles.FieldscontainerBorder}>
						<View>
							<View>
								<Text style={Styles.text_style}>
									Full Name
								</Text>
							</View>
							<View style={Styles.backgroundViewContainer}>
								<TextInput placeholderTextColor={this.state.nameError == "" ? "#999999": "red"} placeholder={this.state.nameError == "" ? '' : this.state.nameError} 
									underlineColorAndroid='transparent' 
									style={Styles.textInput} 
									onChangeText={(value) => this.setState({nameError: '',name: value})} 
									value={this.state.name}
								/>
								{ this.state.nameError != '' ? <Icon onPress={() => this.onIconClick(this.state.nameError)} name='alert-circle' style={{color:'red'}}/> : null }
							</View>
							<View style={[Styles.underlinebold,{marginBottom:10}]}></View>
						</View>
						<View style={[{marginTop:5,marginBottom:5}]}></View>
						<View>
							<View>
								<Text style={Styles.text_style}>
									Email Address
								</Text>
							</View>
							<View style={Styles.backgroundViewContainer}>
								<TextInput placeholderTextColor={this.state.emailError == "" ? "#999999": "red"} placeholder={this.state.emailError == "" ? '' : this.state.emailError} 
									underlineColorAndroid='transparent' 
									style={Styles.textInput} 
									
									
									//onChangeText={(value) => this.setState({emailError: '',emailAddress: value})}
									
	
									onChangeText={(value) => this.setState({emailAddress: value}, this.onChange(value, 'emailError'))}
									
									keyboardType="email-address"
									value={this.state.emailAddress}
								/>
								{ this.state.emailError != '' ? <Icon onPress={() => this.onIconClick(this.state.emailError)} name='ios-alert' style={{color:'red'}}/> : null }
								
							</View>
							<View style={[Styles.underlinebold,{marginBottom:10}]}></View>
						</View>
						<View style={[{marginTop:5,marginBottom:5}]}></View>
						<View>
							<View>
								<Text style={Styles.text_style}>
									Contact Number
								</Text>
							</View>
							<View style={Styles.backgroundViewContainer}>
								<TextInput 
									placeholderTextColor={this.state.phoneNumberError == "" ? "#999999": "red"}		placeholder={this.state.phoneNumberError == "" ? "Optional" : this.state.phoneNumberError} 
									underlineColorAndroid = 'transparent' 
									secureTextEntry={false} 
									style={Styles.textInput}  
									returnKeyType ="next" 
									keyboardType="numeric"
									
									onChangeText={(value) => this.setState({contact_number: value}, this.onChangePhone(value, 'phoneNumberError'))}								
									onEndEditing={ (event) => this.updatePhoneNumberFormat(event.nativeEvent.text) } value={this.state.contact_number} />
									{ this.state.phoneNumberError != '' ? <Icon onPress={() => this.onIconClick(this.state.phoneNumberError)} name='ios-alert' style={{color:'red'}}/> : null } 
							</View>
							<View style={[Styles.underlinebold,{marginBottom:10}]}></View>
						</View>
					</View>
				</View>
				</ScrollView>	
				<DropdownAlert ref={(ref) => this.dropdownAdd = ref}
					onClose={data => this.onClose(data)}
				/>
			</View>
			</Modal>
			<View style={Styles.listcontainer}>
				<ScrollView style={{padding:20}}>
						<View style={{marginBottom: 15}}>
							<View style={Styles.backgroundViewContainerSearch}>
								<TextInput placeholder='Search name, email, phone no.'
									underlineColorAndroid='transparent' 
									style={Styles.textInputSearch} 
									onChangeText={(value) => this.setState({keyword: value})} 
									value={this.state.keyword}
								/>
								<TouchableOpacity style={CustomStyle.back_icon_parent}  onPress={() => this.SearchFilterFunction(this.state.keyword)}>
								<View style={Styles.restoreviewSearch}>
									<Text style={Styles.restoreviewtextSearch}>{'Search'}</Text>
								</View>
								</TouchableOpacity>
							</View>
							<View style={[Styles.underlinebold,{marginBottom:10}]}></View>
						</View>
					{renderIf(this.state.showListing)(	
						<ListView style={{paddingBottom:40}} dataSource={this.state.addrsSource} renderRow={this.renderRow} />
					)}
					{renderIf(this.state.showListing == false)(	
						<Text>No Data Found.</Text>
					)}
				</ScrollView>
			</View>
			<View style={Styles.iphonexHeader}></View>
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
						<Text style={BuyerStyle.header_title}>Manage Address Book</Text>
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
