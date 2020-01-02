import React, { Component } from 'react';
import {Container, Left, Right, Icon, Item, Title, Body, Button, Input}  from 'native-base';
import CustomStyle from './Styles/CustomStyle';
import BuyerStyle from './Styles/BuyerStyle';
import SellerStyle from './Styles/SellerStyle';
import QuickQuotesStyle from './Styles/QuickQuotesStyle'; 
import Images from '../Themes/Images.js'; // to fetch images
import {callGetApi, callPostApi} from '../Services/webApiHandler.js' // Common function of get and post request 
import Spinner from 'react-native-loading-spinner-overlay'; // used to show loader on page
import Device from '../Constants/Device';
import { Dropdown } from 'react-native-material-dropdown';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import renderIf from 'render-if';
import MessageComponent from './MessageComponent';
import ModalSelector from 'react-native-modal-selector';
import { CheckBox } from 'react-native-elements';
import {validateEmail} from '../Services/CommonValidation.js';
import STRINGS from '../GlobalString/StringData'  // Import StringData.js class for string localization.
import { View, Text, ToolbarAndroid, Picker, StyleSheet, Image, TextInput, Alert, ScrollView, TouchableOpacity, Dimensions, NetInfo, AsyncStorage, Modal, BackHandler, Platform, Keyboard} from 'react-native';
var GLOBAL = require('../Constants/global'); // used to fetch api's
var nativeImageSource = require('nativeImageSource');
import ModalDropdown from 'react-native-modal-dropdown';
import DropdownAlert from 'react-native-dropdownalert';
import {authenticateUser} from '../Services/CommonValidation.js'  // Import CommonValidation class to access common methods for validations.
import CustomKeyboard from '../customKeyboard/CustomKeyboard';
import { insertText, CustomTextInput, install } from 'react-native-custom-keyboard';
export default class QuickQuotes extends Component {
	constructor() {
		super();
		this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
	  	// Variable Declaration
	  	this.state = {
			orientation: Device.isPortrait() ? 'portrait' : 'landscape',
			devicetype: Device.isTablet() ? 'tablet' : 'phone',
			titleInsurance : '0.00',
			selected1: 'key1',
			selected2: 'key2',
			selected3: 'key3',
			selected4: 'key4',
			stateArray: [],
			countryArray: [],
			srvItems : [],
			countItems : [],
			refinStatus : false,
			joplinCityNJChk : false,
			caseCash : false,
			saleStatus : true,
			calculateStatus : false,
			isCheckForNewJersey : false,
			isCheckForHARPTA : false,
			isCheckForJoplinCity : false,
			showNewJerseyCheckBox : false,
			stateId : "",
			text_message : '',
			visble : false,
			openMessagePopup : false,
			city : "",
			connectionInfo : '',
			calcType : '',
			tagInputValue : '',
			textMsgPdfArray : '',
			user_county : "",
			company_id : "",
			count : 0,
			user_id : "",
			county_name_drop_down : "",
			reissueYearCheckBoxVal : 0,
			state_name_drop_down : "",
			deviceName : "",
			user_state : "",
			county : "",
			to_email : "",
			email_subject : "",
			content : "",
			access_token : "",
			salePrice: '0.00',
			loanAmount: '0.00',
			animating 		: 'false',
			ownerFee 		: "0.00",
			lenderFee 		: "0.00",
			refinEscrowFee 	: "0.00",
			zip 			: "",
			emailModalVisible: false,
			modalAddressesVisible: false,
			invalidEmailStatus : false,
			toolbarActions: [{ value : 'EMAIL' }, { value : 'MESSAGE' }],
			refinEscrowPolicyType : "",
			refineLoanAmount : "0.00",
			ownerPolicyType : "",
			lenderPolicyType : "",
			escrowPolicyType : "",
			countryError : false,
			titleInsuranceName : "",
			escrowFeeBuyer : "0.00",
			escrowFeeSeller : "0.00",
			OwnerServCharge : '0.00',
			OwnerServChargeTitle : '',
			LenderServCharge : '0.00',
			LenderServChargeTitle : '',
			ClosingProtectionLetterBuyer : '0.00',
			ClosingProtectionLetterSeller : '0.00',
			showHawaiFields: false,
			showJasperFields: false,
			transferTax: '0.00',
			attorneyFee: '0.00',
			harptaFee: '0.00',
			ownerFeeHARPTABuyer: '0.00',
			ownerFeeHARPTASeller: '0.00',
			isCheckForEagleOwners: false,
			ownerServiceFeeJasper: '',
			ownerServiceTypeJasper: '',
			loanServiceFeeJasper: '',
			loanServiceTypeJasper: '',
			CPLBuyerJasper: '',
			CPLSellerJasper: '',
		}

		Dimensions.addEventListener('change', () => {
			this.setState({
				orientation: Device.isPortrait() ? 'portrait' : 'landscape',
			});
		});

		this.handleFirstConnectivityChange = this.handleFirstConnectivityChange.bind(this);

	}
	
	async componentDidMount() {

		if(this.state.devicetype == 'tablet') {
			if(Platform.OS == 'android') {	
				this.setState({
					deviceName : 'android'
				});
			} else {
				this.setState({
					deviceName : 'ipad'
				});
			}
		} else {
			if(Platform.OS == 'android') {
				this.setState({
					deviceName : 'android'
				});
			} else {
				this.setState({
					deviceName : 'iphone'
				});
			}
		}
		this.setState({
			loadingText : 'Initializing...'
		});	
		BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
		response = await authenticateUser();
		if(response == '1') {
			this.props.navigator.push({name: 'Login', index: 0 });
		} else {
			var newstr = "";
			AsyncStorage.getItem("userDetail").then((value) => {

				console.log("user details in quick quotes " + JSON.stringify(value));

				newstr = value.replace(/\\/g, "");
					newstr = JSON.parse(newstr);
					newstr.user_name = newstr.first_name + " " + newstr.last_name;
					var subj = 'Quick Quotes from '+newstr.user_name+'  at '+newstr.email+'';
						this.setState({
							stateId : newstr.state,
							county : newstr.county,
							city : newstr.city,
							access_token : newstr.access_token,
							company_id : newstr.company_id,
							user_id : newstr.user_id,
							email_subject : subj,
							state_code : newstr.state_code 
						});
						if(newstr.state_code == 'NJ') {
							this.setState({
								showNewJerseyCheckBox : true
							});
						}

						if (newstr.state == '26' && newstr.county == '1531') {  // Missouri Joplin city
							this.setState({
								joplinCityNJChk : true
							});
						}	


			}).done();	   
			
			this.setState({animating:'true'}, this.callGetStatesApi);	   
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
	
  // call state values for drop down
  callGetStatesApi() {

    callGetApi(GLOBAL.BASE_URL + GLOBAL.Get_States)
    .then((response) => {
         // Continue your code here...
         this.setState({
              stateArray : result.data
         });
          
          for (let i = 0; i < this.state.stateArray.length; i++) {
            state_name = this.state.stateArray[i].statename;
			state_id = this.state.stateArray[i].id;
			if(this.state.stateId == state_id) {
				this.setState({
					user_state : state_name,
					state_name_drop_down : state_name,
				}, this.callGetCountyApi(state_id));
			}
            /*if(i == 0) {
                this.setState({
					 stateId : state_id,
					 state_name_drop_down : this.state.user_state
                });
            }*/
			  this.state.srvItems.push({
				"key": state_id,
				"label":  state_name
			});	
          }
          this.setState({animating:'false'});
     });
      
      
  }

	removeCommas(aNum) {
		if( typeof aNum == 'undefined' ) {
	}
	aNum = aNum.replace(/,/g, "");
	if( typeof aNum == 'undefined' ) {
	}

		aNum = aNum.replace(/\s/g, "");
	if( typeof aNum == 'undefined' ) {
	}
	
		return aNum;
	}

  	delimitNumbers(str) {
		return (str + "").replace(/\b(\d+)((\.\d+)*)\b/g, function(a, b, c) {
		return (b.charAt(0) > 0 && !(c || ".").lastIndexOf(".") ? b.replace(/(\d)(?=(\d{3})+$)/g, "$1,") : b) + c;
		});
	}

	onFocus (fieldName) {
		fieldVal = this.state[fieldName];
			this.setState({
				defaultVal: fieldVal,
			})
			 this.setState({
				[fieldName]: '',
			})
	}
  
  // call county values for drop down
  callGetCountyApi(IDofState) {
	
	console.log("state id callGetCountyApi " + IDofState);

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
			  
			  if(this.state.county == county_id) {
					this.setState({
						user_county : county_name,
						county_name_drop_down : county_name,
					});
			 } else if(this.state.county == '' && i == 0) {
				this.setState({
					county : '',
					user_county : 'Select county',
					county_name_drop_down : 'Select county',
				});
				this.state.countItems.push({
					'key' : '',
					'label' : 'Select county'
				});
			}

			this.state.countItems.push({
				"key" : county_id,
				"label" : county_name
		   });

			if(i + 1 == this.state.countryArray.length && this.state.stateId == '2') {
				this.state.countItems.push({'key'  : '3153', 'label' : 'HOMER'},
				{ 'key' : '3152', 'label' : 'SEWARD' });
			}

           
          }
          this.setState({animating:'false'});
        });
  }

  	cancelEmailPopup(flag) {
		this.setState({
			openMessagePopup : false
		});

		if(flag == 'success') {
			this.dropdown.alertWithType('success', 'Success', "Message sent successfully");
		}
	}
	
	// call function when any of the input field of calculator change
	updateFormField (fieldVal, fieldName) {

		if(this.state.count == 1) {
			fieldVal = this.removeCommas(fieldVal);
			if(this.state.defaultVal != fieldVal){
					if(fieldVal=='') {
						processedData = '0.00';
					} else {
						var value = parseFloat(fieldVal);
						value = value.toFixed(2);
						processedData = value;        		
					}

					if(processedData == "" || processedData == "undefined" || processedData == "0.00" || processedData == undefined) {
						this.setState({
							[fieldName]: '0.00',
						});
					} else {
						this.setState({
							[fieldName]: processedData,
						});
					}
			}
		} else {
			this.setState({
				[fieldName]: '0.00',
			});
			this.state.count++;
		}	
		
		
	}  

		// onActionSelected function is called when click on breadcrumb on top right of the seller calculator page
	
		onActionSelected(position) {	
			 if (this.state.dropValues == "MESSAGE") {
				if (this.state.sale_pr == "" || this.state.sale_pr == '0.00') {
					this.dropdown.alertWithType('error', 'Error', 'Please enter sales price.');
				} else {
					this.setState({
						openMessagePopup: true
					});
				}
			} else if(this.state.dropValues == "EMAIL") {
				if(this.state.sale_pr == "" || this.state.sale_pr == "0.00"){
					this.dropdown.alertWithType('error', 'Error', 'Please enter sales price');
				}else{
					//this.props.navigator.push({name: 'GoogleSigninExample', index: 0 });
					this.onPressEmailIcon();
					//this.onCallFunctionVerifyToken();
				}
				this.setState({
					dropValues : ""
				});
			}
		}
	
	

	getSaleData() {
		quickQuotesSaleData = {
			"company_id":this.state.company_id,
			"user_id":this.state.user_id,
			"salePrice":this.state.salePrice,
			"loanamount":this.state.loanAmount,
			"county_name":this.state.user_county,
			"state_name":this.state.user_state,
			"ownerFee":this.state.ownerFee,
			"ownerPolicyType":this.state.ownerPolicyType,
			"lenderPolicyType": this.state.lenderPolicyType,
			"lenderFee":this.state.lenderFee,
			"escrowPolicyType":this.state.escrowPolicyType,
			"escrowFeeBuyer":this.state.escrowFeeBuyer,
			"escrowFeeSeller":this.state.escrowFeeSeller,
			// New fields for Missouri state added by lovedeep
			'OwnerServCharge'					: this.state.OwnerServCharge,
			'OwnerServChargeTitle'				: this.state.OwnerServChargeTitle,
			'LenderServCharge'					: this.state.LenderServCharge,
			'LenderServChargeTitle'				: this.state.LenderServChargeTitle,
			'ClosingProtectionLetterBuyer'		: this.state.ClosingProtectionLetterBuyer,
			'ClosingProtectionLetterSeller'		: this.state.ClosingProtectionLetterSeller,
			"actionType":"email",
			"calcType":"Sale",
		};
		this.setState({calcType : 'Sale'});
		return quickQuotesSaleData;
	}

	getRefinData() {
		quickQuotesRefinData = {
			"company_id":this.state.company_id,
			"user_id":this.state.user_id,
			"loanamountrefi":this.state.refineLoanAmount,
			"county_name":this.state.user_county,
			"state_name":this.state.user_state,
			"titleIns":this.state.titleInsurance,
			"titleInsName":this.state.titleInsuranceName,
			"escrowFeeRefi":this.state.refinEscrowFee,
			"escrowPolicyTypeRefi":this.state.refinEscrowPolicyType,
			"actionType":"email",
			"calcType":"Refi"	
		};
		this.setState({calcType : 'Refi'});
	
		return quickQuotesRefinData;
	}


	maxLength(str) {
		let strshortened = str.slice(0,5);		
		return strshortened +'..';
		//alert(strshortened); //=> '12345678'
	}

	sendEmail() {
		
		if(this.state.to_email == "") {
			Alert.alert('', 'Please enter email address.');
			//this.dropdown.alertWithType('error', 'Error', 'Please enter email address');
		} else {
			var str_array = this.state.to_email.split(',');
			console.log("email length " + JSON.stringify(str_array.length));			
			for(var i = 0; i < str_array.length; i++) {
			// Trim the excess whitespace.
			
				console.log(i);
				str_array[i] = str_array[i].trim();
				if(!validateEmail(str_array[i])) {
					//this.dropdown.alertWithType('error', 'Error', 'Please enter valid email address');
					console.log('in not valid email address');
				
					this.state.invalidEmailStatus = true;
				}
				if(i == str_array.length - 1) {
					this.callSendEmailFunc();
				}
			}
		}
	}


	callSendEmailFunc() {
		console.log("flag " + this.state.invalidEmailStatus);
		if(this.state.invalidEmailStatus == true) {
			this.setState({
				invalidEmailStatus : false
			});
			Alert.alert('', 'Please enter valid email addresses with comma separated!');			
			//this.dropdown.alertWithType('error', 'Error', 'Please enter valid email addresses with comma separated!');
		} else {
			if(this.state.saleStatus == true) {
				quickQuotesData = this.getSaleData();	
			} else {
				quickQuotesData = this.getRefinData();
			}

			quickQuotesData.subject = this.state.email_subject;
			quickQuotesData.note = this.state.content;
			quickQuotesData.email = this.state.to_email;
			
			this.setState({animating : 'true', loadingText : 'Please wait...'});
			console.log("date issue " + JSON.stringify(quickQuotesData));
			//	sellerData.image_name = this.state.imageData;
			callPostApi(GLOBAL.BASE_URL + GLOBAL.Get_Quick_Qoute_Pdf, quickQuotesData, this.state.access_token)
			.then((response) => {

			//	alert(JSON.stringify(result));

				this.setState({
					to_email : ""
				});
				console.log("resp " + JSON.stringify(result));
				this.setState({animating : 'false', loadingText : 'Calculating', dropdownType : ""});
				AsyncStorage.setItem("pdfFileName", result.data);
				AsyncStorage.setItem("calculator", "quick_quotes");
        		//this.props.navigator.push({name: 'GoogleSigninExample', index: 0 });
				AsyncStorage.removeItem("evernote");
				AsyncStorage.removeItem("dropbox");
				this.setEmailModalVisible(!this.state.emailModalVisible);
				//this.setEmailModalVisible(!this.state.emailModalVisible);
				this.dropdown.alertWithType('success', 'Success', "Email sent successfully.");
				
			});
		}
	}

	// function call when you type sale price and loan amount from Sale Tab
	onCallSaleSection() {
		if(this.state.stateId == 12){
			this.setState({
				showHawaiFields : true
			});
		}else if(this.state.stateId == 23){
			if(this.state.isCheckForEagleOwners == false) {
				this.state.reissueYearCheckBoxVal = 0;
			}else{
				this.state.reissueYearCheckBoxVal = 1;
			}
		}else if(this.state.stateId == 31){
			if(this.state.isCheckForNewJersey == false) {
				this.state.reissueYearCheckBoxVal = 0;
			}else{
				this.state.reissueYearCheckBoxVal = 1;
			}
		}else if(this.state.stateId == 26 && this.state.county == 1531){
			this.state.showJasperFields = true;
			if(this.state.isCheckForJoplinCity == false) {
				this.state.reissueYearCheckBoxVal = 0;
			}else{
				this.state.reissueYearCheckBoxVal = 1;
			}
		}
		
		if(this.state.stateId != 12){
			this.setState({
				showHawaiFields : false
			});
		}
		
		if(this.state.county != 1531){
			this.setState({
				showJasperFields : false
			});
		}
		if(this.state.salePrice == "" || this.state.salePrice == "0.00") {
			this.dropdown.alertWithType('error', 'Error', "Please enter sale price.");
		} else if(this.state.user_county == "" || this.state.user_county == "Select county") {
			this.setState({
				countryError : true
			});
		}
	
		else {
			this.setState({
				calculateStatus : true
			});


			if(this.state.state_code == 'NJ') {
				if(this.state.loanAmount == "" || this.state.loanAmount == "0.00") {
					this.setState({
						caseCash : true,
						showNewJerseyCheckBox : false
					});
				} else {
					this.setState({
						caseCash : false,
						showNewJerseyCheckBox : true
					});	
				}
			} else {
				if(this.state.loanAmount == "" || this.state.loanAmount == "0.00") {
					this.setState({
						caseCash : true,
					});
				} else {
					this.setState({
						caseCash : false,
					});
				}
			}

			this.setState({
				loadingText : 'Calculating...'
			});
			this.setState({animating:'true'});	
			callPostApi(GLOBAL.BASE_URL + GLOBAL.quick_quotes_get_sale_data, {
			"county_name": this.state.user_county, "state_name" : this.state.user_state, "salePrice": this.state.salePrice,"adjusted": this.state.loanAmount, 'userId':this.state.user_id,'device':this.state.deviceName, "reissueyr" : this.state.reissueYearCheckBoxVal, "zipcode" : this.state.zip
			}, this.state.access_token)
			.then((response) => {
				//Alert.alert("sale resp ", JSON.stringify(result));
				if(result.status == 'success') {


					console.log("sale resp result in quick quotes " + JSON.stringify(result));

					/**========= Start New Fields For State Missouri added by lovedeep  **/

					if(this.state.state_code == 'MO') {
						this.setState({
							OwnerServCharge		          : result.data.ownerServiceFeeBuyer,
							OwnerServChargeTitle	      : result.data.ownerServiceType,
							LenderServCharge	          : result.data.loanServiceFeeBuyer,
							LenderServChargeTitle	      : result.data.loanServiceType,
							ClosingProtectionLetterBuyer  : result.data.CPLBuyer,
							ClosingProtectionLetterSeller : result.data.CPLSeller,
						});							
					}

					/**========= Start New Fields For State Missouri added by lovedeep  **/

					this.setState({
						ownerFee                      : result.data.ownerFee,
						lenderFee                     : result.data.lenderFee,
						ownerPolicyType               : result.data.ownerPolicyType,
						lenderPolicyType              : result.data.lenderPolicyType,
						escrowPolicyType              : result.data.escrowPolicyType,
						escrowFeeBuyer                : result.data.escrowFeeBuyer,
						escrowFeeSeller               : result.data.escrowFeeSeller,
					});
					if(this.state.stateId == 12){
						
						ownerFeeHARPTABuyer = result.data.ownerFee * 60 / 100;
						ownerFeeHARPTASeller = result.data.ownerFee * 40 / 100;
						harptaFee = this.state.salePrice * 7.25 / 100;
						if(this.state.isCheckForHARPTA == true) {
							this.setState({
								harptaFee: parseFloat(harptaFee).toFixed(2),
							});
						}else{
							this.setState({
								harptaFee: '0.00',
							});
						}
						this.setState({
							ownerFeeHARPTABuyer: ownerFeeHARPTABuyer,
							ownerFeeHARPTASeller: ownerFeeHARPTASeller,
							transferTax: result.data.transferTax,
							attorneyFee: result.data.attorneyFee,
						});
					}
					
					if(this.state.stateId == 26 && this.state.county == 1531){
						this.setState({
							ownerServiceFeeJasper: result.data.ownerServiceFee,
							ownerServiceTypeJasper: result.data.ownerServiceType,
							loanServiceFeeJasper: result.data.loanServiceFee,
							loanServiceTypeJasper: result.data.loanServiceType,
							CPLBuyerJasper: result.data.CPLBuyer,
							CPLSellerJasper: result.data.CPLSeller,
						});
					}

					if(this.state.state_code == 'MO') {
						lenderServiceFee 	= 	result.data.loanServiceFeeBuyer;                
						ownerServiceFee  	= 	result.data.ownerServiceFeeBuyer;                
						lenderServiceType	= 	result.data.loanServiceType;                  
						ownerServiceType	= 	result.data.ownerServiceType;                  
						cplBuyerFee			= 	result.data.CPLBuyer;                          
						cplSellerFee		= 	result.data.CPLSeller;
					} else {
						lenderServiceFee 	= 	this.state.LenderServCharge;                
						ownerServiceFee  	= 	this.state.OwnerServCharge;                
						lenderServiceType	= 	this.state.LenderServChargeTitle;                  
						ownerServiceType	= 	this.state.OwnerServChargeTitle;                  
						cplBuyerFee			= 	this.state.ClosingProtectionLetterBuyer;                          
						cplSellerFee		= 	this.state.ClosingProtectionLetterSeller;
						
					}
					this.state.textMsgPdfArray = {
						"userId" : this.state.user_id,
						"companyId"  		: this.state.company_id,
						"caltype" 			: "quotes",
						"salesPrice" 		: this.state.salePrice,
						"loanType"			: this.state.calcType,                         
						"loanamount"		: this.state.loanAmount,                           
						"states"			: this.state.user_state,                     
						"county"			: this.state.user_county,                             
						"ownersPolicy"		: result.data.ownerFee,                         
						"lendersPolicy"		: result.data.lenderFee,                         
						"escrowBuyerFee"	: result.data.escrowFeeBuyer,                  
						"escrowSellerFee"	: result.data.escrowFeeSeller,                  
						"escrowPolicyType"	: result.data.escrowPolicyType,                    
						"ownersPolicyType"	: result.data.ownerPolicyType,                    
						"lendersPolicyType"	: result.data.lenderPolicyType, 
						"lenderServiceFee"	: lenderServiceFee,                
						"ownerServiceFee"	: ownerServiceFee,                
						"lenderServiceType"	: lenderServiceType,                   
						"ownerServiceType"	: ownerServiceType,                  
						"cplBuyerFee"		: cplBuyerFee,                           
						"cplSellerFee"		: cplSellerFee
					}	
									
					this.setState({animating:'false'});	
				} else {
					this.setState({animating:'false'});
				}
			});	
		}

	}



	onCallSaleSectionForTabChange() {
		if(this.state.state_code == 'NJ') {
			this.setState({
				showNewJerseyCheckBox : false
			});				
		}
		/**========= Start New Fields For State Missouri added by lovedeep  **/

		if(this.state.state_code == 'MO') {
			this.setState({
				salePrice                     : '0.00',
				loanAmount                    : '0.00',
				OwnerServCharge		          : '0.00',
				OwnerServChargeTitle	      : '',
				LenderServCharge	          : '0.00',
				LenderServChargeTitle	      : '',
				ClosingProtectionLetterBuyer  : '0.00',
				ClosingProtectionLetterSeller : '0.00',
			});							
		} else {
			this.setState({
				salePrice                     : '0.00',
				loanAmount                    : '0.00',
				ownerFee                      : '0.00',
				lenderFee                     : '0.00',
				ownerPolicyType               : '',
				lenderPolicyType              : '',
				escrowPolicyType              : '',
				escrowFeeBuyer                : '0.00',
				escrowFeeSeller               : '0.00',
			});

		}

			/**========= Start New Fields For State Missouri added by lovedeep  **/
	
	}

	// function call when you type loan amount from Refin Tab
	onCallRefinanceSection() {
		this.setState({
			showHawaiFields : false
		});
		if(this.state.refineLoanAmount == "" || this.state.refineLoanAmount == "0.00") {
			this.dropdown.alertWithType('error', 'Error', "Please enter loan amount.");
		} else if(this.state.user_county == "" || this.state.user_county == "Select county") {
			this.setState({
				countryError : true
			});
		} else {
			this.setState({
				calculateStatus : true
			});
			this.setState({animating:'true'});
			callPostApi(GLOBAL.BASE_URL + GLOBAL.quick_quotes_get_refi_data, {
			"county_name": this.state.user_county, "state_name" : this.state.user_state, "adjusted": this.state.refineLoanAmount,'userId':this.state.user_id,'device':this.state.deviceName, 'zipcode': this.state.zip, 'reissueyr': '0'
			}, this.state.access_token)
			.then((response) => {
//Alert.alert('result',this.state.user_county + '--' + this.state.user_state + '--' + this.state.refineLoanAmount + '--' + this.state.user_id + '--' + this.state.deviceName + '--');
//Alert.alert('result',JSON.stringify(result.data));
				if(result.status == 'success') {
					this.setState({
						titleInsurance: result.data.titleIns,
						titleInsuranceName: result.data.titleInsName,
						refinEscrowFee : result.data.escrowFee,
						refinEscrowPolicyType : result.data.escrowPolicyType,
					});
					this.setState({animating:'false'});	
				} else {
					this.setState({animating:'false'});
				}
				this.state.textMsgPdfArray = {
					"userId" 			: this.state.user_id,
					"companyId"  		: this.state.company_id,
					"caltype" 			: "quotes",
					"salesPrice" 		: this.state.salePrice,
					"loanType"			: this.state.calcType,                         
					"loanamount"		: this.state.refineLoanAmount,                           
					"states"			: this.state.user_state,                     
					"county"			: this.state.user_county,                             
					"ownersPolicy"		: this.state.ownerFee,                         
					"lendersPolicy"		: this.state.lenderFee,                         
					"escrowBuyerFee"	: result.data.escrowFee,                  
					"escrowSellerFee"	: this.state.escrowFeeSeller,                  
					"escrowPolicyType"	: result.data.escrowPolicyType,                    
					"ownersPolicyType"	: this.state.ownerPolicyType,                    
					"lendersPolicyType"	: this.state.lenderPolicyType,
					"lenderServiceFee"	: this.state.LenderServCharge,                
					"ownerServiceFee"	: this.state.OwnerServCharge,                
					"lenderServiceType"	: this.state.LenderServChargeTitle,                   
					"ownerServiceType"	: this.state.OwnerServChargeTitle,                  
					"cplBuyerFee"		: this.state.ClosingProtectionLetterBuyer,                           
					"cplSellerFee"		: this.state.ClosingProtectionLetterSeller
				}
			});
		}	
	}

	/**=========== Start Function Added By Lovedeep For Annual Property Tax Check Box Case (New Jersey) =========**/


	onCallRefinanceSectionForTabChange() {
			
		this.setState({
			refineLoanAmount : '0.00',
			titleInsurance: '0.00',
			titleInsuranceName: '',
			refinEscrowFee : '0.00',
			refinEscrowPolicyType : '',
		});

			/*this.setState({animating:'true'});
			callPostApi(GLOBAL.BASE_URL + GLOBAL.quick_quotes_get_refi_data, {
			"county_name": this.state.user_county, "state_name" : this.state.user_state, "adjusted": this.state.refineLoanAmount,'userId':this.state.user_id,'device':this.state.deviceName
			}, this.state.access_token)
			.then((response) => {

				if(result.status == 'success') {
					this.setState({
						titleInsurance: result.data.titleIns,
						titleInsuranceName: result.data.titleInsName,
						refinEscrowFee : result.data.escrowFee,
						refinEscrowPolicyType : result.data.escrowPolicyType,
					});
					this.setState({animating:'false'});	
				} else {
					this.setState({animating:'false'});
				}
			});*/
			
	}

	handlePressCheckedBoxForNewJersey = (checked) =>  {

		if(this.state.isCheckForNewJersey == false) {
			this.setState({
				isCheckForNewJersey : !this.state.isCheckForNewJersey,
				reissueYearCheckBoxVal : 1,
			});
		} else {
			this.setState({
				isCheckForNewJersey : !this.state.isCheckForNewJersey,
				reissueYearCheckBoxVal : 0,
			});
		}
	}
	
	handlePressCheckedBoxForHARPTA = (checked) =>  {

		if(this.state.isCheckForHARPTA == false) {
			this.setState({
				isCheckForHARPTA : !this.state.isCheckForHARPTA,
			});
		} else {
			this.setState({
				isCheckForHARPTA : !this.state.isCheckForHARPTA,
			});
		}
	}
	
	handlePressCheckedBoxForEagleOwners = (checked) =>  {

		if(this.state.isCheckForEagleOwners == false) {
			this.setState({
				isCheckForEagleOwners : !this.state.isCheckForEagleOwners,
				reissueYearCheckBoxVal : 1,
			});
		} else {
			this.setState({
				isCheckForEagleOwners : !this.state.isCheckForEagleOwners,
				reissueYearCheckBoxVal : 0,
			});
		}
	}

	handlePressCheckedBoxForjoplinCityNJChng = (checked) =>  {

		if(this.state.isCheckForJoplinCity == false) {
			this.setState({
				isCheckForJoplinCity : !this.state.isCheckForJoplinCity,
				reissueYearCheckBoxVal : 1,
			});
		} else {
			this.setState({
				isCheckForJoplinCity : !this.state.isCheckForJoplinCity,
				reissueYearCheckBoxVal : 0,
			});
		}
	}

	/**=========== End Function Added By Lovedeep For Annual Property Tax Check Box Case (New Jersey) =========**/

	
	onChange(text) {
		newText = text.replace(/[^\d.]/g,'');
		return newText;	
	}

	onClose(data) {
		if(data.type == 'success' && data.message == 'Email sent successfully.') {
				Alert.alert( 'CostsFirst', 'Do you want to share pdf to social sites?', [ {text: 'NO', onPress: () => console.log('Cancel Pressed!')}, {text: 'YES', onPress: this.onCallSocialSigninFunc.bind(this)}] );
				
		} 
	}

	onCallSocialSigninFunc() {
		this.props.navigator.push({name: 'GoogleSigninExample', index: 0 });	
	}


	onPressEmailIcon() {
		Keyboard.dismiss();
		if(this.state.salePrice != "" && this.state.salePrice != "0.00" && this.state.saleStatus == true && this.state.calculateStatus == true) {
			this.setEmailModalVisible(!this.state.emailModalVisible);
		} else if (this.state.refineLoanAmount !== "" && this.state.refineLoanAmount !== "0.00" && this.state.saleStatus == false && this.state.calculateStatus == true) {
			this.setEmailModalVisible(!this.state.emailModalVisible);
		} else {
			this.dropdown.alertWithType('error', 'Error', "Please complete calculation first...");		
		}
	}

	// For showing popup containing list of seller's calculator
	setEmailModalVisible(visible) {
		this.setState({emailModalVisible: visible});
	//	this.getSellerCalculatorListApi();
	}

	render() {		
		if(this.state.animating == 'true') {
            this.state.visble = true;
        } else {
            this.state.visble = false;
        }

		let showable;
		let buttons;	

		
		if(this.state.connectionInfo != 'none' && this.state.openMessagePopup == false) {
			showable=			<View style={{flex:1}}>
			<View style={QuickQuotesStyle.iphonexHeader}></View>
			<View>
				<Spinner visible={this.state.visble} textContent={this.state.loadingText} textStyle={{color: '#FFF'}} />
			</View>
			<View style={QuickQuotesStyle.HeaderContainer}>
				<Image style={QuickQuotesStyle.HeaderBackground} source={Images.header_background}></Image>
				<TouchableOpacity style={{width:'20%'}} onPress={this.goHomePage.bind(this)}>
					<Image style={QuickQuotesStyle.back_icon} source={Images.back_icon}/>
				</TouchableOpacity>
				<Text style={QuickQuotesStyle.header_title}>{STRINGS.t('Quick_Quotes')}</Text>
				<View style={{alignItems:'flex-start',width:'20%',paddingRight:20}}>
					<Dropdown
						data={this.state.toolbarActions}
						renderBase={() => (
						<MaterialIcons
							name="more-vert"
							color="#fff"
							size={40}
							style={{marginTop : 10, marginLeft : 15}}
						/>
						)}
						onChangeText={(value) => this.setState({dropValues : value})}
            			onBlur={this.onActionSelected.bind(this)}
						rippleInsets={{ top: 0, bottom: 0, left: 0, right: 0 }}
						containerStyle={{  height: 60 }}
						dropdownPosition={1}
						itemColor="rgba(0, 0, 0, .87)"
						pickerStyle={{
						width: 128,
						left: null,
						right: 0,
						marginRight: 8,
						marginTop: 70
						}}
				  />
				</View>				
			</View>
			<View style={QuickQuotesStyle.BodyContainer}>
				<ScrollView
					scrollEnabled={true}
					showsVerticalScrollIndicator={true}
					keyboardShouldPersistTaps="always"
					keyboardDismissMode='on-drag'
					style={QuickQuotesStyle.scrollviewstyle}
				>
					{(this.state.saleStatus == true) ? (
						<View style={QuickQuotesStyle.ConditionalContainer}>
							<View>
								<View style={QuickQuotesStyle.ButtonViewStyle}>
									<Button onPress={this.sales.bind(this)} style={QuickQuotesStyle.ButtonStyle}>
										<Text style={QuickQuotesStyle.ButtonWhiteTextStyle}>{STRINGS.t('QuickQuotesSale')}</Text>
									</Button>
									<Button onPress={this.refinance.bind(this)} style={QuickQuotesStyle.ButtonWhiteStyle}>
										<Text style={QuickQuotesStyle.ButtonBlueTextStyle}>{STRINGS.t('QuickQuotesRefin')}</Text>
									</Button>
								</View>
								{this.state.caseCash == true ?	
								<View style={{flex :1, alignSelf : 'center', marginTop : 10}}>
									<Text style={{fontSize : 16, fontWeight : 'bold', color : 'red'}}>CASH</Text>
								</View>
								: 
								<View style={{flex :1, alignSelf : 'center', marginTop : 10}}>
								</View>
								}
							</View>
							<View>
								<View style={QuickQuotesStyle.TabsMainContainer}>
									<View style={QuickQuotesStyle.IndivTabContainer}> 	   
										<Text style={[QuickQuotesStyle.IndivTabSpTextStyle]}>{STRINGS.t('Quick_Quote_Sale_Price')}</Text>	
										<View style={QuickQuotesStyle.IndivTabTextInputViewStyle}>
											<Text style={{width : '6%',alignSelf: 'center',fontFamily: 'roboto-regular', fontSize:14}}> $</Text>	
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" ref="salePrice" selectTextOnFocus={ true} 
											onKeyPress={() => this.onFocus('salePrice')}
											onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'salePrice')} placeholder={this.state.salePrice} underlineColorAndroid={'transparent'} onChangeText={(value) => this.setState({salePrice:this.onChange(value)})} value={this.delimitNumbers(this.state.salePrice)} style={{width : '94%',marginTop:6,height: 36,fontFamily: 'roboto-regular', fontSize:14}} />
										</View>
									</View>
									<View style={QuickQuotesStyle.IndivTabContainer}> 	   
										<Text style={QuickQuotesStyle.IndivTabLaTextStyle}>{STRINGS.t('loan_amount')}</Text>	
										<View style={QuickQuotesStyle.IndivTabTextInputViewStyle}>
											<Text style={{width : '6%',alignSelf: 'center',fontFamily: 'roboto-regular', fontSize:14}}> $</Text>	
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello"
											selectTextOnFocus={ true }
											onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'loanAmount')}
											onKeyPress={() => this.onFocus('loanAmount')}
												placeholder={this.state.loanAmount}
												underlineColorAndroid={'transparent'}
												onChangeText={(value) => this.setState({loanAmount: this.onChange(value)})} 
												value={this.delimitNumbers(this.state.loanAmount)}
												style={{width : '94%',marginTop:6,height: 36,fontFamily: 'roboto-regular', fontSize:14}}
											/>
										</View>
									</View>
									<View style={[QuickQuotesStyle.IndivTabContainer,{marginTop:20}]}> 	   
										<Text style={QuickQuotesStyle.drpDownLabel}>{STRINGS.t('Quick_Quotes_State_County')}</Text>	
										<View style={QuickQuotesStyle.dropdwnContainer1}>
											<ModalSelector
											data={this.state.srvItems}
											initValue={this.maxLength(this.state.state_name_drop_down)}
											onChange={(option) => this.onChangeState(option)} >
											</ModalSelector>
										</View>	
										<View style={QuickQuotesStyle.dropdwnContainer2}>							
										{this.state.countryError == false ? 										<ModalSelector
											data={this.state.countItems}
											initValue={this.maxLength(this.state.county_name_drop_down)}
								
											onChange={(option) => this.onChangeCounty(option)} >
											</ModalSelector> : 												<ModalSelector
											data={this.state.countItems}
											initValue={this.maxLength(this.state.county_name_drop_down)}
											selectTextStyle={{color : '#ff0000'}}
											style={{borderRadius: 4, borderWidth: 0.5, borderColor: '#ff0000'}}
											onChange={(option) => this.onChangeCounty(option)} >
											</ModalSelector> }				
										</View>												
									</View>		



									<View style={QuickQuotesStyle.IndivTabContainer}> 	   
										<Text style={[QuickQuotesStyle.IndivTabSpTextStyle]}>{STRINGS.t('Zip')}</Text>	
										<View style={[QuickQuotesStyle.IndivTabTextInputViewStyle,this.state.stateId == 12 || this.state.stateId == 23 || this.state.showNewJerseyCheckBox == true || this.state.joplinCityNJChk == true ? {width:'30%'} : {width:'60%'} ]}>
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" ref="zip" selectTextOnFocus={ true} 
											onKeyPress={() => this.onFocus('zip')}
											onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'zip')} placeholder="Zip Code (Optional)" underlineColorAndroid={'transparent'} onChangeText={(value) => this.setState({zip:this.onChange(value)})} value={this.delimitNumbers(this.state.zip)} style={{width : '94%',marginTop:2,height: 36, fontFamily: 'roboto-regular', fontSize:14}} />
										</View>
										{renderIf(this.state.stateId == 12)(
										<View>
											<View style={QuickQuotesStyle.IndivTabCheckBoxViewStyleqq}>
												<CheckBox title='HARPTA' right={true} uncheckedColor="#3b90c4" containerStyle={{ backgroundColor:'#ffffff', borderWidth:0}} center checkedColor='#3b90c4' checked={this.state.isCheckForHARPTA} onPress={this.handlePressCheckedBoxForHARPTA}/>
											</View>
										</View>
										)}
										{renderIf(this.state.stateId == 23)(
										<View>
											<View style={QuickQuotesStyle.IndivTabCheckBoxViewStyleqq}>
												<CheckBox title='Eagle Owners' right={true} uncheckedColor="#3b90c4" containerStyle={{ backgroundColor:'#ffffff', borderWidth:0}} center checkedColor='#3b90c4' checked={this.state.isCheckForEagleOwners} onPress={this.handlePressCheckedBoxForEagleOwners}/>
											</View>
										</View>
										)}
										{renderIf(this.state.showNewJerseyCheckBox == true)(
										<View>
											<View style={QuickQuotesStyle.IndivTabCheckBoxViewStyleqq}>
												<CheckBox title='Eagle Owners' right={true} uncheckedColor="#3b90c4" containerStyle={{ backgroundColor:'#ffffff', borderWidth:0}} center checkedColor='#3b90c4' checked={this.state.isCheckForNewJersey} onPress={this.handlePressCheckedBoxForNewJersey}/>
											</View>
										</View>
										)}
										{renderIf(this.state.joplinCityNJChk == true)(
										<View>
											<View style={QuickQuotesStyle.IndivTabCheckBoxViewStyleqq}>
												<CheckBox title={STRINGS.t('Joplin_City')} right={true} uncheckedColor="#3b90c4" containerStyle={{ backgroundColor:'#ffffff', borderWidth:0}} center checkedColor='#3b90c4' checked={this.state.isCheckForJoplinCity} onPress={this.handlePressCheckedBoxForjoplinCityNJChng}/>
											</View>
										</View>
										)}
									</View>
								</View>
								<View>
									<TouchableOpacity activeOpacity={.5} 
									style={[QuickQuotesStyle.CalculateButtonStyle,{backgroundColor:'red'}]} onPress={() => this.onCallSaleSection()}>
										<View>	
											<Text style={QuickQuotesStyle.CalculateTextStyle}>{STRINGS.t('Quick_Quotes_Calculate')}</Text>
										</View>	
									</TouchableOpacity>	
								</View>
								{(this.state.orientation == 'portrait') ? ( 
									<View style={QuickQuotesStyle.ResultMainContainerStyle}>
										<View style={QuickQuotesStyle.ContainerStyle}>
											<Text style={{fontFamily: 'roboto-regular', width:'90%'}}>{STRINGS.t('Quick_Quotes_Owners_Policy')}</Text>
										</View>
										{renderIf(this.state.showHawaiFields == false)(
										<View style={QuickQuotesStyle.ContainerStyle}>
											<Text style={[QuickQuotesStyle.TextStyle,{width:'30%'}]}>$ {this.delimitNumbers(this.state.ownerFee)}</Text>
											<Text style={{fontFamily: 'roboto-regular', width:'60%'}}>{this.state.ownerPolicyType}</Text>
										</View>
										)}
										{renderIf(this.state.showHawaiFields == true)(
										<View style={QuickQuotesStyle.ContainerStyle}>
											<View style={[QuickQuotesStyle.IndivTabContainer,{width:'50%'}]}>		
												<View style={QuickQuotesStyle.flexrow}>
													<Text style={QuickQuotesStyle.TextStyle}>$ {this.delimitNumbers(this.state.ownerFeeHARPTABuyer)}</Text>
													<Text style={{color:'#404040', marginLeft : 5,fontFamily: 'roboto-regular'}}>{STRINGS.t('buyer')}</Text>
												</View>
												
												<View style={QuickQuotesStyle.flexrow}>
													<Text style={{color:'#1683c0', marginLeft : 5,fontFamily: 'roboto-regular'}}>$ {this.delimitNumbers(this.state.ownerFeeHARPTASeller)}</Text>
													<Text style={{color:'#404040', marginLeft : 5,fontFamily: 'roboto-regular'}}>{STRINGS.t('seller')}</Text>
												</View>
											</View>
											<Text style={{fontFamily: 'roboto-regular', width:'40%', paddingLeft : 35}}>{this.state.ownerPolicyType}</Text>
										</View>
										)}
										
										<View style={QuickQuotesStyle.ContainerStyle}>
											<Text style={{fontFamily: 'roboto-regular', width:'90%'}}>{STRINGS.t('Quick_Quotes_Lender_Policy')}</Text>
										</View>											
										<View style={QuickQuotesStyle.ContainerStyle}>
											<Text style={[QuickQuotesStyle.TextStyle,{width:'30%'}]}>$ {this.delimitNumbers(this.state.lenderFee)}</Text>
											<Text style={{fontFamily: 'roboto-regular', width:'60%'}}>{this.state.lenderPolicyType}</Text>			
										</View>	
										<View style={QuickQuotesStyle.ContainerStyle}>
											<Text style={{fontFamily: 'roboto-regular', width:'90%'}}>{STRINGS.t('Quick_Quotes_Total_Escrow_Fee')}</Text>
										</View>	
									
										<View style={QuickQuotesStyle.ContainerStyle}>	
											<View style={[QuickQuotesStyle.IndivTabContainer,{width:'50%'}]}>		
												<View style={QuickQuotesStyle.flexrow}>
													<Text style={QuickQuotesStyle.TextStyle}>$ {this.delimitNumbers(this.state.escrowFeeBuyer)}</Text>
													<Text style={{color:'#404040', marginLeft : 5,fontFamily: 'roboto-regular'}}>{STRINGS.t('buyer')}</Text>
												</View>
												
												<View style={QuickQuotesStyle.flexrow}>
													<Text style={{color:'#1683c0', marginLeft : 5,fontFamily: 'roboto-regular'}}>$ {this.delimitNumbers(this.state.escrowFeeSeller)}</Text>
													<Text style={{color:'#404040', marginLeft : 5,fontFamily: 'roboto-regular'}}>{STRINGS.t('seller')}</Text>
												</View>
											</View>
											<Text style={{fontFamily: 'roboto-regular', width:'40%', paddingLeft : 35}}>{this.state.escrowPolicyType}</Text>
										</View>	
										{renderIf(this.state.showHawaiFields == true)(
										<View>
											<View style={QuickQuotesStyle.ContainerStyle}>
												<Text style={{fontFamily: 'roboto-regular', width:'90%'}}>{STRINGS.t('Quick_Quotes_Transfer_Tax')}</Text>
											</View>											
											<View style={QuickQuotesStyle.ContainerStyle}>
												<Text style={[QuickQuotesStyle.TextStyle,{width:'30%'}]}>$ {this.delimitNumbers(this.state.transferTax)}</Text>		
											</View>	
											<View style={QuickQuotesStyle.ContainerStyle}>
												<Text style={{fontFamily: 'roboto-regular', width:'90%'}}>{STRINGS.t('Quick_Quotes_HARPTA')}</Text>
											</View>											
											<View style={QuickQuotesStyle.ContainerStyle}>
												<Text style={[QuickQuotesStyle.TextStyle,{width:'30%'}]}>$ {this.delimitNumbers(this.state.harptaFee)}</Text>			
											</View>	
											<View style={QuickQuotesStyle.ContainerStyle}>
												<Text style={{fontFamily: 'roboto-regular', width:'90%'}}>{STRINGS.t('Quick_Quotes_Attorney_Fee')}</Text>
											</View>											
											<View style={QuickQuotesStyle.ContainerStyle}>
												<Text style={[QuickQuotesStyle.TextStyle,{width:'30%'}]}>$ {this.delimitNumbers(this.state.attorneyFee)}</Text>			
											</View>	
										</View>
										)}
										
										{renderIf(this.state.showJasperFields == true)(
										<View>
											<View style={QuickQuotesStyle.ContainerStyle}>
												<Text style={{fontFamily: 'roboto-regular', width:'90%'}}>{STRINGS.t('Owner_Title_Serv_Charge')}</Text>
											</View>											
											<View style={QuickQuotesStyle.ContainerStyle}>
												<Text style={[QuickQuotesStyle.TextStyle,{width:'30%'}]}>$ {this.delimitNumbers(this.state.ownerServiceFeeJasper)}</Text>
												<Text style={{fontFamily: 'roboto-regular', width:'60%'}}>{this.state.ownerServiceTypeJasper}</Text>
											</View>	
											<View style={QuickQuotesStyle.ContainerStyle}>
												<Text style={{fontFamily: 'roboto-regular', width:'90%'}}>{STRINGS.t('Lender_Title_Serv_Charge')}</Text>
											</View>											
											<View style={QuickQuotesStyle.ContainerStyle}>
												<Text style={[QuickQuotesStyle.TextStyle,{width:'30%'}]}>$ {this.delimitNumbers(this.state.loanServiceFeeJasper)}</Text>
												<Text style={{fontFamily: 'roboto-regular', width:'60%'}}>{this.state.loanServiceTypeJasper}</Text>
											</View>	
											<View style={QuickQuotesStyle.ContainerStyle}>
												<Text style={{fontFamily: 'roboto-regular', width:'90%'}}>{STRINGS.t('Closing_Protection_Letter')}</Text>
											</View>	
											<View style={[QuickQuotesStyle.IndivTabContainer,{width:'50%'}]}>		
												<View style={QuickQuotesStyle.flexrow}>
													<Text style={QuickQuotesStyle.TextStyle}>$ {this.delimitNumbers(this.state.CPLBuyerJasper)}</Text>
													<Text style={{color:'#404040', marginLeft : 5,fontFamily: 'roboto-regular'}}>{STRINGS.t('buyer')}</Text>
												</View>
												
												<View style={QuickQuotesStyle.flexrow}>
													<Text style={{color:'#1683c0', marginLeft : 5,fontFamily: 'roboto-regular'}}>$ {this.delimitNumbers(this.state.CPLSellerJasper)}</Text>
													<Text style={{color:'#404040', marginLeft : 5,fontFamily: 'roboto-regular'}}>{STRINGS.t('seller')}</Text>
												</View>
											</View>
										</View>
										)}

										{renderIf(this.state.state_code == 'MO')(
										<View>
										<View style={QuickQuotesStyle.ContainerStyle}>
											<Text style={{fontFamily: 'roboto-regular', width:'90%'}}>{STRINGS.t('Owner_Title_Serv_Charge')}</Text>
										</View>
										<View style={QuickQuotesStyle.ContainerStyle}>
											<Text style={[QuickQuotesStyle.TextStyle,{width:'30%'}]}>$ {this.delimitNumbers(this.state.OwnerServCharge)}</Text>
											<Text style={{fontFamily: 'roboto-regular', width:'60%'}}>{this.state.OwnerServChargeTitle}</Text>
										</View>
										<View style={QuickQuotesStyle.ContainerStyle}>
											<Text style={{fontFamily: 'roboto-regular', width:'90%'}}>{STRINGS.t('Lender_Title_Serv_Charge')}</Text>
										</View>											
										<View style={QuickQuotesStyle.ContainerStyle}>
											<Text style={[QuickQuotesStyle.TextStyle,{width:'30%'}]}>$ {this.delimitNumbers(this.state.LenderServCharge)}</Text>
											<Text style={{fontFamily: 'roboto-regular', width:'60%'}}>{this.state.LenderServChargeTitle}</Text>			
										</View>	
										<View style={QuickQuotesStyle.ContainerStyle}>
											<Text style={{fontFamily: 'roboto-regular', width:'90%'}}>{STRINGS.t('Closing_Protection_Letter')}</Text>
										</View>	
									
										<View style={QuickQuotesStyle.ContainerStyle}>	
											<View style={[QuickQuotesStyle.IndivTabContainer,{width:'50%'}]}>		
												<View style={QuickQuotesStyle.flexrow}>
													<Text style={QuickQuotesStyle.TextStyle}>$ {this.delimitNumbers(this.state.ClosingProtectionLetterBuyer)}</Text>
													<Text style={{color:'#404040', marginLeft : 5,fontFamily: 'roboto-regular'}}>{STRINGS.t('buyer')}</Text>
												</View>
												
												<View style={QuickQuotesStyle.flexrow}>
													<Text style={{color:'#1683c0', marginLeft : 5,fontFamily: 'roboto-regular'}}>$ {this.delimitNumbers(this.state.ClosingProtectionLetterSeller)}</Text>
													<Text style={{color:'#404040', marginLeft : 5,fontFamily: 'roboto-regular'}}>{STRINGS.t('seller')}</Text>
												</View>
											</View>
										
										</View>
										</View>
										)}

									</View>) :(
									<View style={QuickQuotesStyle.ResultMainContainerStyle}>
										<View style={QuickQuotesStyle.ContainerStyle}>
											<Text style={{fontFamily: 'roboto-regular', width:'30%'}}>{STRINGS.t('Quick_Quotes_Owners_Policy')}</Text>
											<Text style={[QuickQuotesStyle.TextStyle,{width:'30%'}]}>$ {this.delimitNumbers(this.state.ownerFee)}</Text>
											<Text style={{fontFamily: 'roboto-regular', width:'30%'}}>{this.state.ownerPolicyType}</Text>
										</View>											
										<View style={QuickQuotesStyle.ContainerStyle}>
											<Text style={{fontFamily: 'roboto-regular', width:'30%'}}>{STRINGS.t('Quick_Quotes_Lender_Policy')}</Text>
											<Text style={[QuickQuotesStyle.TextStyle,{width:'30%'}]}>$ {this.delimitNumbers(this.state.lenderFee)}</Text>	
											<Text style={{fontFamily: 'roboto-regular', width:'30%'}}>{this.state.lenderPolicyType}</Text>		
										</View>	
									
										<View style={QuickQuotesStyle.ContainerStyle}>	
											<Text style={{fontFamily: 'roboto-regular', width:'30%'}}>{STRINGS.t('Quick_Quotes_Total_Escrow_Fee')}</Text>
											<View style={[QuickQuotesStyle.IndivTabContainer,{width:'30%'}]}>		
												<View style={QuickQuotesStyle.flexrow}>
													<Text style={QuickQuotesStyle.TextStyle}>$ {this.delimitNumbers(this.state.escrowFeeBuyer)}</Text>
													<Text style={{color:'#404040', marginLeft : 10,fontFamily: 'roboto-regular'}}>{STRINGS.t('buyer')}</Text>
												</View>
												
												<View style={QuickQuotesStyle.flexrow}>
													<Text style={{color:'#1683c0', marginLeft : 10,fontFamily: 'roboto-regular'}}>
													$ {this.delimitNumbers(this.state.escrowFeeSeller)}</Text>
													<Text style={{color:'#404040', marginLeft : 10,fontFamily: 'roboto-regular'}}>{STRINGS.t('seller')}</Text>
												</View>
											
											</View>
											<Text style={{fontFamily: 'roboto-regular', width:'30%'}}>{this.state.escrowPolicyType}</Text>
										</View>			
									</View>)}
							</View>	
						</View>) : (
						<View>
							<View>
								<View style={{flexDirection : 'row', justifyContent: 'center', marginTop:12 ,alignItems:'center'}}>
									<Button onPress={this.sales.bind(this)} style={{borderRadius: 4, borderWidth: 2, borderColor: '#1683c0', backgroundColor : '#fff', marginRight : 10}}>
										<Text style={{color : '#1683c0', paddingHorizontal : 20, fontFamily: 'roboto-regular'}}>{STRINGS.t('QuickQuotesSale')}</Text>
									</Button>
									<Button onPress={this.refinance.bind(this)} style={{borderRadius: 4, borderWidth: 2, borderColor: '#37779F',backgroundColor : '#1683c0'}}>
										<Text style={{color : '#fff', paddingHorizontal : 20, fontFamily: 'roboto-regular'}}>{STRINGS.t('QuickQuotesRefin')}</Text>
									</Button>
								</View>
							</View>
							<View style={{flexDirection : 'column'}}>
								<View style={{flexDirection : 'row',marginTop : 55}}> 
								</View>
								<View style={{flexDirection : 'row'}}> 	   
										<Text style={{paddingLeft : 5, width : '30%', marginTop : 32, fontFamily: 'roboto-regular'}}>{STRINGS.t('loan_amount')}</Text>	
										<View style={QuickQuotesStyle.IndivTabTextInputViewStyle}>
											<Text style={{width : '6%',alignSelf: 'center',fontFamily: 'roboto-regular'}}> $</Text>	
										<CustomTextInput allowFontScaling={false} customKeyboardType="hello"
											selectTextOnFocus={ true }
											onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'refineLoanAmount')}
												placeholder={this.state.refineLoanAmount}
												onKeyPress={() => this.onFocus('refineLoanAmount')}
												underlineColorAndroid={'transparent'}
												onChangeText={(value) => this.setState({refineLoanAmount:this.onChange(value)})} 
												value={this.delimitNumbers(this.state.refineLoanAmount)}
												style={{width : '94%',marginTop:6,height: 36,fontFamily: 'roboto-regular'}}
											/>
										</View>
								</View>
								
								<View style={{flexDirection : 'row', marginTop : 20}}> 	   
									<Text style={{paddingLeft : 5, width : '30%', marginTop : 10, fontFamily: 'roboto-regular'}}>{STRINGS.t('Quick_Quotes_State_County')}</Text>	
									<View style={QuickQuotesStyle.dropdwnContainer1}>
										<ModalSelector
										data={this.state.srvItems}
										initValue={this.maxLength(this.state.state_name_drop_down)}
									
										onChange={(option) => this.onChangeState(option)} >
										</ModalSelector>
									</View>
										
									<View style={QuickQuotesStyle.dropdwnContainer2}>
										{this.state.countryError == false ? 										<ModalSelector
											data={this.state.countItems}
											initValue={this.maxLength(this.state.county_name_drop_down)}
								
											onChange={(option) => this.onChangeCounty(option)} >
											</ModalSelector> : 												<ModalSelector
											data={this.state.countItems}
											initValue={this.maxLength(this.state.county_name_drop_down)}
											selectTextStyle={{color : '#ff0000'}}
											style={{borderRadius: 4, borderWidth: 0.5, borderColor: '#ff0000'}}
											onChange={(option) => this.onChangeCounty(option)} >
											</ModalSelector> }
									</View>
								</View>	

									<View style={QuickQuotesStyle.IndivTabContainer}> 	   
										<Text style={[QuickQuotesStyle.IndivTabSpTextStyle]}>{STRINGS.t('Zip')}</Text>	
										<View style={QuickQuotesStyle.IndivTabTextInputViewStyle}>
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" ref="zip" selectTextOnFocus={ true} 
											onKeyPress={() => this.onFocus('zip')}
											onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'zip')} placeholder="Zip Code (Optional)" underlineColorAndroid={'transparent'} onChangeText={(value) => this.setState({zip:this.onChange(value)})} value={this.delimitNumbers(this.state.zip)} style={{width : '94%',marginTop:2,height: 36, fontFamily: 'roboto-regular', fontSize:14}} />
										</View>
									</View>
								
								
							</View>
							<View>
								<TouchableOpacity activeOpacity={.5} style={{marginTop: 15,width:'60%', marginLeft:'30%',borderWidth: 1,borderColor : '#1683c0',backgroundColor : '#1683c0',paddingVertical : 10, paddingHorizontal : 4, backgroundColor:'red'}} onPress={() => this.onCallRefinanceSection()}>
									<View>	
										<Text style={{color : '#ffffff', textAlign:'center', fontFamily: 'roboto-regular'}}>{STRINGS.t('Quick_Quotes_Calculate')}</Text>
									</View>	
								</TouchableOpacity>	
							</View>
							{(this.state.orientation == 'portrait') ? (
								<View style={{marginLeft : 5, marginTop : 25}}>
									<View style={{marginTop:10, flexDirection:'row'}}>
										<Text style={{fontFamily: 'roboto-regular', width:'90%'}}>{STRINGS.t('Title_Insurance')}</Text>
									</View>
									<View style={{marginTop:10, flexDirection:'row'}}>
										<Text style={{color:'#1683c0', fontFamily: 'roboto-regular', width:'30%'}}>$ {this.delimitNumbers(this.state.titleInsurance)}</Text>
										<Text style={{fontFamily: 'roboto-regular', width:'60%'}}>{this.state.titleInsuranceName}</Text>
									</View>
									<View style={{marginTop:10, flexDirection:'row'}}>
										<Text style={{fontFamily: 'roboto-regular', width:'90%'}}>{STRINGS.t('Quick_Quotes_Total_Escrow_Fee')}</Text>
									</View>
									<View style={{marginTop:10, flexDirection:'row'}}>
										<Text style={{color:'#1683c0', fontFamily: 'roboto-regular', width:'30%'}}>$ {this.delimitNumbers(this.state.refinEscrowFee)}</Text>
										<Text style={{fontFamily: 'roboto-regular', width:'60%'}}>{this.state.refinEscrowPolicyType}</Text>
									</View>		
								</View>
							):(<View style={{marginLeft : 5, marginTop : 25}}>
								<View style={{marginTop:10, flexDirection:'row'}}>
									<Text style={{fontFamily: 'roboto-regular', width:'30%'}}>{STRINGS.t('Title_Insurance')}</Text>
									<Text style={{color:'#1683c0', fontFamily: 'roboto-regular', width:'30%'}}>$ {this.delimitNumbers(this.state.titleInsurance)}</Text>
									<Text style={{fontFamily: 'roboto-regular', width:'30%'}}>{this.state.titleInsuranceName}</Text>
								</View>
								<View style={{marginTop:10, flexDirection:'row'}}>
								<Text style={{fontFamily: 'roboto-regular', width:'90%'}}>{STRINGS.t('Quick_Quotes_Total_Escrow_Fee')}</Text>
							</View>
							<View style={{marginTop:10, flexDirection:'row'}}>
								<Text style={{color:'#1683c0', fontFamily: 'roboto-regular', width:'30%'}}>$ {this.delimitNumbers(this.state.refinEscrowFee)}</Text>
								<Text style={{fontFamily: 'roboto-regular', width:'60%'}}>{this.state.refinEscrowPolicyType}</Text>
							</View>			
							</View>)}
						</View>
					)}
					<View style={{marginTop:100}}></View>
				</ScrollView>
			</View>	
			<Modal
					animationType="slide"
					transparent={false}
					visible={this.state.emailModalVisible}
					onRequestClose={() => {alert("Modal has been closed.")}}
					>
					<ScrollView scrollEnabled={true} showsVerticalScrollIndicator={true}  keyboardShouldPersistTaps="always" keyboardDismissMode='on-drag'>
						<View style={BuyerStyle.HeaderContainer}>
								<Image style={BuyerStyle.HeaderBackground} source={Images.header_background}></Image>
								<TouchableOpacity style={{width:'20%', justifyContent:'center'}} onPress={() => {this.setEmailModalVisible(!this.state.emailModalVisible)}}>
								<Text style={[BuyerStyle.headerbtnText]}>{STRINGS.t('Cancel')}</Text>
								</TouchableOpacity>
								<Text style={BuyerStyle.header_title}>{STRINGS.t('Email')}</Text>
								<TouchableOpacity style={{width:'20%', justifyContent:'center'}} onPress={() => {this.sendEmail()}}>
									<Text style={[BuyerStyle.headerbtnText,{alignSelf:'flex-end'}]}>{STRINGS.t('EmailSend')}</Text>
								</TouchableOpacity>
							</View>	
							<View>
							<View style={{flexDirection : 'column'}}>
								<View style={SellerStyle.scrollable_container_child_center}>
									<View style={{width: '10%',justifyContent: 'center'}}>
										<Text style={SellerStyle.text_style}>
										{STRINGS.t('EmailTo')}:
										</Text>
									</View>
									<View style={{width: '90%',flexDirection: 'row'}}>
										<TextInput selectTextOnFocus={ true } underlineColorAndroid='transparent' keyboardType="email-address" style={{width: '100%'}} onChangeText={(value) => this.setState({to_email: value})} value={this.state.to_email.toString()}/>
									</View>
								</View>
								<View style={SellerStyle.lineView}></View>
								<View style={SellerStyle.scrollable_container_child_center}>
									<View style={{width: '95%',flexDirection: 'row'}}>
										<TextInput placeholder='Note' selectTextOnFocus={ true } underlineColorAndroid='transparent' style={{width: '100%',height:60}}
										multiline={true} onChangeText={(value) => this.setState({content: value})}
										/>
									</View>
								</View>
								<View style={SellerStyle.lineView}></View>
							</View>
						</View>
					</ScrollView>					
				</Modal>
				<DropdownAlert ref={(ref) => this.dropdown = ref}
					onClose={data => this.onClose(data)}
				/>
					<View style={QuickQuotesStyle.iphonexFooter}></View>			
		</View>
		} else if (this.state.openMessagePopup == true) {
			showable=<MessageComponent tagInputValue={this.state.tagInputValue} cancelEmailPopup={this.cancelEmailPopup.bind(this)} textMsgPdfArray={this.state.textMsgPdfArray} emailModalVisible={true} to_email="" to_email_default="" text_message={this.state.text_message} />
		} else {
			showable=
			<View style={{flex : 1}}>
				<View style={{flex : 2}}>
					<View style={BuyerStyle.HeaderContainer}>	
						<Image style={BuyerStyle.HeaderBackground} source={Images.header_background}></Image>
						<TouchableOpacity style={{width:'20%'}} onPress={this.goHomePage.bind(this)}>
							<Image style={BuyerStyle.back_icon} source={Images.back_icon}/>
						</TouchableOpacity>
						<Text style={BuyerStyle.header_title}>{STRINGS.t('Quick_Quotes')}</Text>
			
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
		
		return (
			<View style={{flex : 1}}>
				{showable}
			</View>


		)
	}
	
	goHomePage() {
		Keyboard.dismiss();
		this.props.navigator.push({name: 'Dashboard', index: 0 });
	}
	
	refinance() {
		Keyboard.dismiss();
		this.setState({
			saleStatus : false	
		}, this.onCallRefinanceSectionForTabChange);	
	}
	sales() {
		Keyboard.dismiss();
		this.setState({
			saleStatus : true	
		}, this.onCallSaleSectionForTabChange);	
	}
	
	onChangeState(option) {
		Keyboard.dismiss();
		this.setState({
			user_state : option.label
		});
		this.setState({
			state_name_drop_down : option.label
		});

		//alert(option.label);
		if(option.label == 'NEW JERSEY') {
			this.setState({showNewJerseyCheckBox : true});
		} else {
			this.setState({showNewJerseyCheckBox : false});
		}
		this.setState({
			stateId : option.key,
			county: '',
		}, this.callGetCountyApi(option.key));


		/*this.setState({
			state_name_drop_down : option.label
		});
		this.setState({
			 stateId : option.key
		}, this.callGetCountyApi(option.key));*/
	}
	  
   onChangeCounty(option) {
		Keyboard.dismiss();
		this.setState({
			user_county : option.label,
			county_name_drop_down : option.label,
			county: option.key,
			countryError : false
		});

		if(this.state.stateId == '26' && option.key == '1531') {
			this.setState({
				joplinCityNJChk : true
			});
		}

		/*this.setState({
			county_name_drop_down : option.label
		});
	   countyId = option.key;
	   this.state.county = countyId;*/
   }

}









 	
