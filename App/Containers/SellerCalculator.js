import React, { Component } from 'react';
import {Container, Left, Right, Icon, Title, Body, Button}  from 'native-base';
import Images from '../Themes/Images.js';
import Styles from './Styles/SellerStyleDesign';
import { CheckBox } from 'react-native-elements';
import CustomStyle from './Styles/CustomStyle';
import dashboardStyle from './Styles/DashboardStyle'
import SellerStyle from './Styles/SellerStyle';
import BuyerStyle from './Styles/BuyerStyle';
import MessageComponent from './MessageComponent';
import CameraStyle from './Styles/CameraStyle';
import renderIf from 'render-if';
import AutoTags from 'react-native-tag-autocomplete';
import { callGetApi, callPostApi} from '../Services/webApiHandler.js' // Import 
import STRINGS from '../GlobalString/StringData'  // Import StringData.js class for string localization.
import Picker from 'react-native-picker';
import DatePicker from 'react-native-datepicker'
import ShowActivityIndicator from './ShowActivityIndicator'; 
import DropdownAlert from 'react-native-dropdownalert'
import PopupDialog from 'react-native-popup-dialog';
import PopupDialogEmail from 'react-native-popup-dialog';
import OpenFile from 'react-native-doc-viewer';
import SelectMultiple from 'react-native-select-multiple';
import ImagePicker from 'react-native-image-crop-picker';
import Camera from 'react-native-camera';
import Device from '../Constants/Device';
import {validateEmail} from '../Services/CommonValidation.js';
import Spinner from 'react-native-loading-spinner-overlay';
import CustomKeyboard from '../customKeyboard/CustomKeyboard';
import Selectbox from 'react-native-selectbox';
import ModalDropdown from 'react-native-modal-dropdown';
import { Dropdown } from 'react-native-material-dropdown';
//import GoogleSigninExample from './GoogleSignin';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
//import { ThemeProvider, Toolbar, COLOR } from 'react-native-material-ui';
import {getUptoTwoDecimalPoint} from '../Services/app_common_func.js'
import {Image, View, StyleSheet, Modal, Keyboard, ListView, Dimensions, Alert, Text, TextInput, findNodeHandle, TouchableOpacity, KeyboardAvoidingView, ScrollView, AsyncStorage, BackHandler, Platform, NetInfo} from 'react-native';
import {getSellerExistingBalanceCalculation,getSellerListSellAgt, getSellerListSellAgtPer, getSellerListSellAgtValues,getSellerAmountFHA,getSellerDiscountAmount, getSellerEstimatedTax, StrToUpper, StrInArray, getSellerAmountVA, getSellerAmountCONV, getSellerAmountUSDA, getSellerListSellTeired, getTransferTax,getSellerCostTypeTotal, getGrossCommissionsVal} from '../Services/seller_calculator.js'
const  seller = 'Seller';
const  {width, height} = Dimensions.get('window')
var Header = require('./Header');
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
var nativeImageSource = require('nativeImageSource');
var GLOBAL = require('../Constants/global');
import Voice from 'react-native-voice';
import {authenticateUser} from '../Services/CommonValidation.js'  // Import CommonValidation class to access common methods for validations.
//import { text } from '../../../../Users/lovedeep.singh/AppData/Local/Microsoft/TypeScript/2.6/node_modules/@types/d3';
import { insertText, CustomTextInput, install } from 'react-native-custom-keyboard';
var nlp = require('compromise');
var texas_Hexter_Fair_counties_Arr = ['2565','2584','2742','2648','2706','2771','2579'];

export default class SellerCalculator extends Component{
	constructor() {
		super();
		//Estimated date
		//register('hello', () => CustomKeyboard);
		var now = new Date();
		now.setDate(now.getDate() + 30);
		var date = (now.getMonth() + 1) + '-' + now.getDate() + '-' + now.getFullYear();
		var monthNames = [ "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec" ]; 
        this.changeFooterTab = this.changeFooterTab.bind(this);
		this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
		// For showing list of buyer's calculator in popup onload so that error will not occur
		var ds = new ListView.DataSource({
		   rowHasChanged: (r1, r2) => r1 !== r2
		 });
		var calcList = {};
		calcList['calculatorName'] = 'calculatorName';
		
		this.state = {
			orientation: Device.isPortrait() ? 'portrait' : 'landscape',
			devicetype: Device.isTablet() ? 'tablet' : 'phone',
			initialOrientation: '',
			isChecked: true,	
			isCheckedUSDA: true,
			isCheckedVA: true,
			isCheckForNewJersey : false,
			isCheckForOhio : false,
			isCheckForWisconsin : false,
			isCheckForFirstLoan : false,	
			isCheckForSecondLoan : false,
			tab: 'CONV',
			suggestions: "",
			tagsSelected : [],
			tagsSelectedForEmail : [],
			openMessagePopup : false,
			multipleOfferStatus : false,
			opt : 'seller',
			offerCounter : 1,
			percentStatus : false,
			dollarStatus : false,
			doneStatus : false,
			offerId : 0,
			pageNumber : 0,
			note : '',
			editModeStatus : false,
			footer_tab:'seller',
			amount: '0.00',
			adjustedamount : '0.00',
			todaysInterestRate:'',
			textMsgPdfArray : "",
			connectionInfo : '',
			totalAllCost : '0.00',
			termsOfLoansinYears:'',
			termsOfLoansinYears2:'',
			languageType : 'en',
			autoFocusStatus : false,
			reloadStatus:false,
			reissueSalePriceEditableStatus : true,
			reissueSalePrice : '0.00',
			reissueYearDropdownVal : 0,
			date:date,
			ltv: '90',
			keyword : '',
			globalReconveynceFee : '0.00',
			commisionOption : '',
			calculatorId : '',
			summerPropTaxHeight:'0',
			winterPropTaxHeight:'0',			
			first_one_lakh_rate : '0.00' ,
			balance1_to : '0.00',
			balance1_rate : '0.00',
			balance2_from : '0.00',
			balance2_to : '0.00',
			balance2_rate : '0.00',
			buyerName:'',
			ltv2: '',
			down_payment: '',
			loan_amt: '0.00',
			count : 0,
			countFunc : 0,
			countForOther : 0,
			summerPropertyTaxLabel : "",
			winterPropertyTaxLabel : "",
			summerPropertyTax : '0.00',
			winterPropertyTax : '0.00',
			prorationPercent  : '105',
			prorationPercentShowStatus  : false,
			sumWinPropertyTaxStatus : false,
			annualPropertyTaxFieldShowStatus : false,
			
			countForLoan : 0,
			isFocus : false,
			pdfFileName : 'Hello Hi',
			loan_amt2: '0.00',
			invalidEmailStatus : false,
			escrowOnlySellerType : false,
			modalDropDownOnlySellerTypeAtions : ['Seller'],
			escrowPolicyOnlySellerType: 'Seller',
			sale_pr: '0.00',
			sale_pr_calc: '',
			sale_pr_empty : '',
			preparedFor : 'New Client',
			buyers_fee_text : "Buyer's Fees",
			corrective_work_text : "Corrective Work",
			countyTax : "",
			cityTax : "",
			content : '',
			taxservicecontract: '0.00',
			underwriting: '0.00',
			processingfee: '0.00',
			appraisalfee: '0.00',
			creditReport: '',
			correctivework : '0.00',
			buyersfee : '0.00',
			ownerFee: '0.00',
			escrowFee: '0.00',
			lenderFee: '0.00',
			escrowFeeOrg: '0.00',
			sale_pr_comma : '0.00',
			loansToBePaid_1Balance_comma : '',
			lenderFeeOrg: '0.00',
			ownerFeeOrg: '0.00',
			escrowFeeBuyer : '0.00',
			escrowFeeSeller : '0.00',
			documentprep: '0.00',
			disc: '0.00',
			emailType : '',
			taxservicecontractFixed : false,
			underwritingFixed : false,
			processingfeeFixed : false,
			appraisalfeeFixed : false,
			documentprepFixed : false,
			originationfactorFixed : false,
			ownerTypeFixed : false,
			escrowTypeFixed : false,
			lenderTypeFixed : false,
			deviceName : "",
			GooglePlaceAutoCompleteShow : false,
			enterAddressBar : false,
			openMultipleOfferPopup : false,
			discAmt: '',
			estimatedSellerNet : '0.00',
			label1: '',
			fee1: '',
			nullVal: 0.00,
			annualPropertyTax : '0.00', 
			label2: '',
			fee2: '',
			label3: '',
			fee3: '',
			label4: '',
			fee4: '',
			label5: '',
			fee5: '',
			label6: '',
			fee6: '',
			label7: '',
			fee7: '',
			label8: '',
			fee8: '',
			label9: '',
			fee9: '',
			buyerDownPayment : '0.00',
			tagInputValue : '',
			label10: '',
			imageNameEmail: '',
			videoNameEmail: '',
			modalVisible : false,
			emailModalVisible: false,
			modalAddressesVisible: false,
			videoModalVisible: false,
			visble: false,
			imageData: '',
			to_email: '',
			to_email_default : '',
			email_subject: '',
			emailAddrsList: [],
			fee10: '',
			animating   : 'false',
			numberOfDaysPerMonth: '',
			numberOfMonthsInsurancePrepaid: '',
			monTax: '',
			monIns: '',
			monName: monthNames[(now.getMonth())],
			toolbarActions: [{ value: 'SAVE' }, { value :'OPEN' }, { value : 'PRINT' } , { value : 'EMAIL' }, { value : 'MESSAGE' }],
			modalDropDownActions : ['Split','Buyer','Seller'],
			camera: {
				aspect: Camera.constants.Aspect.fill,
				captureTarget: Camera.constants.CaptureTarget.cameraRoll,
				captureMode: Camera.constants.CaptureMode.video,
				type: Camera.constants.Type.back,
				orientation: Camera.constants.Orientation.auto,
				flashMode: Camera.constants.FlashMode.auto,
			},

			prorationPercentDropdownVal: [
				{ key: 0, label: '100', value: '100'}, {key: 1, label: '105', value:'105'}, {key: 2, label: '110', value : '110'}, {key: 3, label: '115', value: '115'}, {key: 4, label: '120', value : '120'}
			],
			prorationPercentSelectedDropdownVal: { key: 0, label: '105', value:'105'},
			owner_amount1 : '0.00',
			owner_amount2 : '0.00',
			owner_carry_loan1 : '80.00',
			owner_carry_loan2 : '0.00',
			owner_carry_loan_amount1 : '0.00',
			owner_carry_loan_amount2 : '0.00',
			interest_rate1 : '4.2500',
			interest_rate2 : '0',
			term_in_year1 : '30',
			term_in_year2 : '0',
			due_in_year1 : '7',
			due_in_year2 : '0',
			monTaxVal: '',
			escrowType: '',
			selectedEscrowTypeId : '',
			ownerType: '',
			selectedOwnerTypeId : '',
			lenderType: '',
			selectedLenderTypeId : '',
			adjusted_loan_amt: '0.00',
			base_loan_amt: '0.00',
			prepaidMonthTaxes: '',
			monthInsuranceRes: '',
			daysInterest: '0.00',
			speakToTextStatus : false,
			FhaMipFin: '',
			FhaMipFin1: '',
			FhaMipFin2: '',
			FhaMipFin3: '',
			UsdaMipFinance: '',
			UsdaMipFinance1: '',
			UsdaMipFinance2: '',
			UsdaMipFinance3: '',
			secondLoanOwnerCarry : false,
			firstLoanOwnerCarry : false,
			VaFfFin: '',
			VaFfFin1: '',
			VaFfFin2: '',
			VaFfFin3: '',
			monthlyRate:'',
			monthPmiVal:'',
			rateValue:'',
			principalRate:'',
			realEstateTaxesRes: '',
			homeOwnerInsuranceRes: '',
			sellerFooterTab: true,	
			totalClosingCost: '0.00',
			totalOtherCost : '0.00',
			totalPrepaidItems: '',
			totalMonthlyPayment: '',
			totalInvestment: '',
			first_name: '',
			last_name: '',
			mailing_address: '',
			lender_address: '',
			user_state: '',
			postal_code: '',
			user_name: '',
			originationFee: '',
			costOther: '',
			monthlyExpensesOther: '',
			monthlyExpensesOther1: '',			
			drawingDeed: '0.00',
			notary: '0.00',
			transferTax: '0.00',
			transferTaxPer : "0.00",
			transfer_tax_text : "Transfer Tax",
			prepaymentPenality : '0.00',
			pestControlReport: '0.00',
			estimatedTaxProrations: '0.00',
			benifDemandStatement: '0.00',
			reconveynceFee: '0.00',
			proration : '',
			loansToBePaid_1Balance: '0.00',
			loansToBePaid_1Rate: '0.00',
			loansToBePaid_2Balance: '0.00',
			loansToBePaid_2Rate: '0.00',
			loansToBePaid_3Balance: '0.00',
			loansToBePaid_3Rate: '0.00',
			default_address : '',
			existingTotal: '0.00',
			days_interest: '',
			listAgt: '0.00',
			sellAgt: '0.00',
			list_agt: '0.00',
			sell_agt: '0.00',
			totalAgt: '0.00',

			// keyboard scroll states
			conventionalLoanHeight: '0',
			existingFirstHeight: '0',
			existingSecondHeight: '0',
			existingThirdHeight: '0',
			annualPropertyTaxHeight: '0',
			estimatedTaxProrationsHeight: '0',
			escrowFeeHeight: '0',
			ownerFeeHeight: '0',
			lenderFeeHeight: '0',
			drawingDeedHeight: '0',
			notaryHeight: '0',
			reissueSalePriceHeight : '0',
			transferTaxHeight: '0',
			prepaymentPenalityHeight: '0',
			reconveynceFeeHeight: '0',
			pestControlReportHeight: '0',
			listAgtHeight: '0',
			sellAgtHeight: '0',
			settlementDateHeight: '0',

			ownerAmount1Height: '0',
			ownerAmount2Height: '0',
			ownerCarryLoan1Height: '0',
			ownerCarryLoan2Height: '0',
			ownerCarryLoanAmount1Height: '0',
			ownerCarryLoanAmount2Height: '0',
			interestRate1Height: '0',
			interestRate2Height: '0',
			termInYear1Height: '0',
			termInYear2Height: '0',
			dueInYear1Height: '0',
			dueInYear2Height: '0',

			fee1Height: '0',
			fee2Height: '0',
			fee3Height: '0',
			fee4Height: '0',
			fee5Height: '0',
			fee6Height: '0',
			fee7Height: '0',
			fee8Height: '0',
			fee9Height: '0',
			fee10Height: '0',
			discHeight: '0',
			documentprepHeight: '0',
			text_message : '',
			conventionalLoan: '80.00',
			otherCostsDiscount2: '0.00',
			settlementDate: now.getDate(),
			settlementMonth: now.getMonth(),
			dataSource: ds.cloneWithRows(calcList),
			dataSourceOrg: ds.cloneWithRows(calcList),
			dataSourceEmpty: ds.cloneWithRows(calcList),
			emptCheck: false,
			speakToTextVal: false,
			voiceInput:false,
			TextInput: false,
			contact_number : '',
			newEmailAddress : '',
			newEmailContactName : '',
			newEmailAddressError : '',
            recognized: '',
			pitch: '',
			error: '',
			end: '',
			started: '',
			results: [],
			partialResults: [],
			speakTextStatus: 'Please speak & wait for recognization...',
			sellerCarriedLoan:'0.00',
			estimatedSellerNetCopy:'0.00',
		}
			this.renderRow = this.renderRow.bind(this);

		Voice.onSpeechStart = this.onSpeechStart.bind(this);
		Voice.onSpeechRecognized = this.onSpeechRecognized.bind(this);
		Voice.onSpeechEnd = this.onSpeechEnd.bind(this);
		Voice.onSpeechError = this.onSpeechError.bind(this);
		Voice.onSpeechResults = this.onSpeechResults.bind(this);
		Voice.onSpeechPartialResults = this.onSpeechPartialResults.bind(this);
		Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged.bind(this);

		Dimensions.addEventListener('change', () => {
			this.setState({
				orientation: Device.isPortrait() ? 'portrait' : 'landscape',
			});
		});

		this.handleFirstConnectivityChange = this.handleFirstConnectivityChange.bind(this);

	}

	handleDelete = index => {
		let tagsSelected = this.state.tagsSelected;
		tagsSelected.splice(index, 1);
		this.setState({ tagsSelected });
	 }
	  
	 handleAddition = suggestion => {

		console.log(suggestion.name);

		this.state.tagsSelectedForEmail.push(suggestion.name);

	
		this.setState({ tagsSelected: this.state.tagsSelected.concat([suggestion]), to_email : this.state.tagsSelectedForEmail.toString()});


	 }
	
	componentWillUnmount() {
	  Voice.destroy().then(Voice.removeAllListeners);
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
		NetInfo.removeEventListener(
			'connectionChange',
			this.handleFirstConnectivityChange
		);
	}
  
	onSpeechStart(e) {
	  this.setState({
		started: '√',
	  });
	}
  
	onSpeechRecognized(e) {
	  this.setState({
		recognized: '√',
	  });
	}
  
	onSpeechEnd(e) {
	  this.setState({
		end: '√',
	  });
	}
  
	onSpeechError(e) {
	  this.setState({
		error: JSON.stringify(e.error),
	  });
	}
  
	onSpeechResults(e) {
		fieldName = this.state.fieldName;
		//alert('onSpeechResults' + e.value);
		if(fieldName == 'sale_pr'){
			val = e.value[0];
			doc = nlp(val);
			val = doc.values().toNumber().out();
		}else{
			val = e.value[0];
		}

		this.setState({
			[fieldName]: val,
			voiceInput:false,
			results: e.value,
		});
		Keyboard.dismiss();
	}
  
	onSpeechPartialResults(e) {
		
		
		console.log(" in onSpeechPartialResults ");

		this.setState({
			  speakTextStatus: 'Recognizing voice....',
		  });
		   let b = e.value
		   
		console.log(" in onSpeechPartialResults b value " + b);

		  this.setState({
			  partialResults: e.value,
		  });
		  fieldName = this.state.fieldName;
		  if(e.value != ''){
			  doc = nlp(e.value);
				doc = doc.values().toNumber().out();
				console.log(" in onSpeechPartialResults doc value " + doc);

				console.log(" in onSpeechPartialResults fieldName " + fieldName);

				//		alert(doc);
			this.setState({
				[fieldName]: doc,
				voiceInput:false,
			});
		  }
		  if(this.state.stoppedRec == true){
			   this.setState({
			   	partialResults: doc.value,
			   });
		  } 
	  
	}
  
	onSpeechVolumeChanged(e) {
	  this.setState({
		pitch: e.value,
	  });
	}
  
	async _startRecognizing(fieldName) {
		this.setState({voiceInput : true})
	  this.setState({
		fieldName: fieldName,  
		recognized: '',
		pitch: '',
		error: '',
		started: '',
		results: [],
		partialResults: [],
		end: ''
	  });
	  try {
		await Voice.start('en-US', Object.assign({
          EXTRA_LANGUAGE_MODEL: "LANGUAGE_MODEL_FREE_FORM",
          EXTRA_MAX_RESULTS: 5,
          EXTRA_PARTIAL_RESULTS: true,
          REQUEST_PERMISSIONS_AUTO: true,
		}));
		
		this.setState({
			speakToTextStatus : false
		});
	  } catch (e) {
		console.error(e);
	  }
	}
  
	async _stopRecognizing(e) {
	  try {
		  await Voice.stop();
		  this.setState({stoppedRec:true})
		  this._cancelRecognizing()
	  } catch (e) {
		console.error(e);
	  }
	}

	
	handleFirstConnectivityChange(connectionInfo) {
		this.setState({
			connectionInfo: connectionInfo.type
		});

		if(connectionInfo.type != 'none') {
			this.setState({animating : 'false'}, this.componentDidMount);
		}
	}

/**
 * componentWillMount function
 * Developer - Lovedeep Singh (CIPL - 891)
 * Higher Order Function -> map function  
 * This function is used to loop through the current routes and return true if got params multipleoffer
 * For more detail you can check onMultipleOfferPress() function in Dashboard file for reference
 * 
 * **/									   

	componentWillMount() {
	
	/**=== Start This code written below is to differentiate between multiple offer tab and seller tab */


	this.props.navigator.getCurrentRoutes().map(a => a['name'] == 'SellerCalculator' ? a['params'] == 'multipleOffer' ? this.setState({multipleOfferStatus : true, opt:'offer'}) : this.setState({multipleOfferStatus : false, opt:'seller'}) : null);

	/**=== End This code written below is to differentiate between multiple offer tab and seller tab */
	
		AsyncStorage.getItem('speakToTextVal').then((val)=>{
			
			if(val == null){
				this.setState({speakToTextVal : false})
			} else {
				if(val == 'true'){
					this.setState({speakToTextVal: true})
				}else if(val == 'false'){
					this.setState({speakToTextVal: false})
				}
			}
		})

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
			NetInfo.getConnectionInfo().then((connectionInfo) => {
					this.setState({
							connectionInfo: connectionInfo.type
					});
			});
		
			NetInfo.addEventListener(
				'connectionChange',
				this.handleFirstConnectivityChange
			);
			AsyncStorage.getItem("session_Multi_offer").then(
				(resultpl) =>{ 
					if(resultpl !== null && resultpl !== '') {
						newstr = resultpl.replace(/\\/g, "");
						newstr = JSON.parse(newstr);
						this.setState({
							preparedBy 				: newstr.preparedBy,
							preparedFor 			: newstr.preparedFor,
							existingTotal 			: newstr.existingTotal,
							default_address 		: newstr.address,
							city				 	: newstr.city,
							state	 				: newstr.state,
							loansToBePaid_1Balance 	: newstr.loansToBePaid_1Balance,
							loansToBePaid_1Rate 	: newstr.loansToBePaid_1Rate,
							loansToBePaid_2Balance	: newstr.loansToBePaid_2Balance,
							loansToBePaid_2Rate 	: newstr.loansToBePaid_2Rate,
							loansToBePaid_3Balance 	: newstr.loansToBePaid_3Balance,
							loansToBePaid_3Rate 	: newstr.loansToBePaid_3Rate,
							summerPropertyTax		: newstr.summerPropertyTax,
							winterPropertyTax		: newstr.winterPropertyTax, 
							prorationPercent		: newstr.prorationPercent,
							annualPropertyTax		: newstr.annualPropertyTax,
							offerId 				: newstr.offerId,
							calculatorId 			: newstr.calculatorId,
							offerCounter			: newstr.offerCounter,
							estimatedTaxProrations	: newstr.estimatedTaxProrations,
							pageNumber 				: newstr.pageNumber,
							editModeStatus			: newstr.editModeStatus					
						});

						console.log("offer id 1 " + newstr.offerId);

						if(newstr.editModeStatus == true) {
							this.editSellerCalculator(newstr.calculatorId, newstr.offerId, "session");	
						}
					} else {
						AsyncStorage.getItem("editModeStatus").then(
							(resultpl) => { 
								if(resultpl != null && resultpl != '') {
									AsyncStorage.getItem("calcOfferDt").then(
										(resultpl) => {
											console.log("calcOfferDt resultpl " + resultpl);
											newstr = resultpl.replace(/\\/g, "");
											newstr = JSON.parse(newstr);
											this.editSellerCalculator(newstr.calculatorId, newstr.offerId, "session");
										});		
								} else {
									callPostApi(GLOBAL.BASE_URL + GLOBAL.getMultipleOffer,this.state.access_token)
									.then((response) => {
										this.setState({
											offerId : result.data.offer_id
										});
									});
								}

								console.log("resulttpl else cond " + resultpl);
							});				
					}
			});

			/*this.setState({
				default_address : fg
			});*/
	}
	
	async componentDidMount() {

		this.setState({
			loadingText : 'Initializing...'
		});
		BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
		AsyncStorage.removeItem("pdfFileName");

		response = await authenticateUser();
		if(response == '1'){
			this.props.navigator.push({name: 'Login', index: 0 });
		}else{
			AsyncStorage.getItem("userDetail").then((value) => {

				console.log("user detail " + JSON.stringify(value));

					newstr = value.replace(/\\/g, "");
					var newstr = JSON.parse(newstr);
					newstr.user_name = newstr.first_name + " " + newstr.last_name;
					this.setState(newstr,this.componentApiCalls);
					this.setState({animating:'true'});
					var subj = 'Closing Costs from '+newstr.user_name+'  at '+newstr.email+'';
					this.setState({
						email_subject : subj,
						text_message : subj,
						state_code : newstr.state_code,
						access_token : newstr.access_token,
						user_id : newstr.user_id
					});

					callPostApi(GLOBAL.BASE_URL + GLOBAL.user_address_book, {
						"user_id": newstr.user_id
						}, newstr.access_token)
						.then((response) => {
			
							console.log("address book list " + JSON.stringify(result));
							var employees = [];
							
							for(var i in result.data) {    
							
								var item = result.data[i];   
							
								employees.push({ 
									"name" : item.email,
								});
							}

							//console.log("empolyees array " + JSON.stringify(employees));

							this.setState({suggestions : employees});



						});
					
			}).done();
			AsyncStorage.getItem("initialOrientation").then((value) => {
				this.setState({
					initialOrientation : value 
				});
			}).done();
		}

		AsyncStorage.getItem("Language").then((value) => {

			if(value != 'null' && value != null) {
				newstr = value.replace(/\\/g, "");
				var newstr = JSON.parse(newstr);
				this.setState({
					languageType : newstr 
				});
			}
		}).done();

	}
	
	handleBackButtonClick() {
		//alert(this.state.footer_tab);
		if(this.state.footer_tab == 'closing_cost' || this.state.footer_tab == 'other_costs') {
			// function created inside setstate object is called anonyms function which is called on the fly.
			this.setState({footer_tab: 'seller'}, function() {
				if(this.state.footer_tab == 'seller') {
					this.setState({sellerFooterTab: true});
				} else {
					this.setState({sellerFooterTab: false});
				}
			});
		} else {
			this.props.navigator.push({name: 'Dashboard', index: 0 });
		}
		//seller, closing_cost, other_costs

		//this.props.navigation.goBack(null);
		//this.props.navigator.pop();
		//this.props.navigator.push({name: 'Dashboard', index: 0 });
		return true;
	}

	componentApiCalls(){

		/**=========================== Start Special case for Ohio State =====================**/
		
		if(this.state.state_code == 'OH') {
			this.callListCommisionSettings();
		}

		/**=========================== End Special case for Ohio State =====================**/
		

		this.callSellerProrationSettingApi();
		this.callGLOBALsettinsapi();
		this.callUserAddressBook();
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

	_onChangeProrationPercent = (item) => {
		this.setState({
			prorationPercentSelectedDropdownVal : item,
			prorationPercent : item.value
        }, this.onCallannualPropertyTax);
	}	

	callSellerProrationSettingApi(){
		callPostApi(GLOBAL.BASE_URL + GLOBAL.seller_proration_setting, {
		state_id: this.state.state, county_id : this.state.county
		}, this.state.access_token)
		.then((response) => {

			/**
			 * 
			 * ================================================================================================
			 * Code Added By Lovedeep For Proration changes for different states as per discussion with vinod sir
			 * If length will be 2 then two property tax fields will be appended after down payment field other 
			 * wise annual property tax field will be appended. Checks will be added below in View
			 * ================================================================================================
			 * 
			 * **/
			// Note not neccesary label names always summer or winter. It will be different label but I have set their name as summer and winter
			
			prorationLength = Object.keys(result.data).length;
			if (prorationLength == 2 && this.state.state != 2) {
				
				this.setState({
					sumWinPropertyTaxStatus : true,
					annualPropertyTaxFieldShowStatus : false,
				});
				
				if (this.state.state == 23) { // Michigan
				 this.state.summerPropertyTaxLabel = "Summer Property Tax"; 
				 this.state.winterPropertyTaxLabel = "Winter Property Tax";
				} else if (this.state.state == 10) { // Florda
					this.state.summerPropertyTaxLabel = "Advalorem Property Tax";
					this.state.winterPropertyTaxLabel = "Non Advalorem Property Tax";
				} else if (this.state.state == 36) { //OHIO 
					this.state.summerPropertyTaxLabel = "Due & Payable Method";
					this.state.winterPropertyTaxLabel = "Lien Method";
				} else if (this.state.state == 39) { // PENNSYLVANIA
					this.state.summerPropertyTaxLabel = "Summer Tax Calculation";
					this.state.winterPropertyTaxLabel = "Spring Tax Calculation";
				}

				//this.summerPropertyTax = parseFloat(this.summerPropertyTax).toFixed(2);
				//this.winterPropertyTax = parseFloat(this.winterPropertyTax).toFixed(2);
			 
			} else {
				this.setState({
					sumWinPropertyTaxStatus : false,
					annualPropertyTaxFieldShowStatus : true,
				});
			}
			if(result.status == 'success'){
				this.setState({proration: result});
			}
		});
	}

	callListCommisionSettings() {
			commisionReq = {user_id: this.state.user_id,company_id: this.state.company_id,'option':'tiered'};
			callPostApi(GLOBAL.BASE_URL + GLOBAL.commission_setting, {user_id: this.state.user_id,company_id: this.state.company_id,'option':'tiered' 
			}, this.state.access_token)
				.then((response) => {
				if(result.status == 'success') {
					if (result.data.option == 'tiered') {
						this.setState({
							first_one_lakh_rate : result.data.first_one_lakh_rate,
							commisionOption : result.data.option,
							balance1_to         : result.data.balance1_to,
							balance1_rate       : result.data.balance1_rate,
							balance2_from       : result.data.balance2_from,
							balance2_to         : result.data.balance2_to,
							balance2_rate       : result.data.balance2_rate,
							listAgt             : result.data.listing_rate,
							sellAgt             : result.data.selling_rate,
						});
					} else {
						this.setState({
							commisionOption : 'traditional',
						});
					}
				} else {
					// this is the case if API returns 'No Record Found' Message
						this.setState({
							commisionOption : 'traditional',
						});
				}
			
				/*else {
					this.setState({
						first_one_lakh_rate : result.data.first_one_lakh_rate,
						balance1_to         : result.data.balance1_to,
						balance1_rate       : result.data.balance1_rate,
						balance2_from       : result.data.balance2_from,
						balance2_to         : result.data.balance2_to,
						balance2_rate       : result.data.balance2_rate,
						listAgt             : result.data.listing_rate,
						sellAgt             : result.data.selling_rate,
					});
				}*/

				/**======== Start Code commented by lovedeep on 26-06-2018 as per discussion with atul sir ===========
			
				if(this.state.sale_pr <= parseFloat('100000')){
					this.state.SCC_Brokage_Fee = this.state.first_one_lakh_rate;
				} else if(this.state.sale_pr > parseFloat('100000') || this.state.sale_pr <= this.state.balance1_to){
					this.state.SCC_Brokage_Fee = this.state.balance1_rate;
				} else if(this.state.sale_pr >= this.state.balance2_from || this.state.state.sale_pr <= this.state.balance2_to){
					this.state.SCC_Brokage_Fee = this.state.balance2_rate;
				}
				**/
			});
	}
	
	// Function for fetching and setting values of closing cost tab under USDA page
	callGLOBALsettinsapi(){
		callGetApi(GLOBAL.BASE_URL + GLOBAL.national_global_setting, {
		}, this.state.access_token)
			.then((response) => {
			this.setState({
				FHA_SalePriceUnder: 	 result.data.nation_setting.FHA_SalePriceUnder,
				FHA_SalePriceUnderLTV:   result.data.nation_setting.FHA_SalePriceUnderLTV,
				FHA_SalePriceTo: 		 result.data.nation_setting.FHA_SalePriceTo,
				FHA_SalePriceToLTV: 	 result.data.nation_setting.FHA_SalePriceToLTV,
				FHA_SalePriceOver: 	 	 result.data.nation_setting.FHA_SalePriceOver,
				FHA_SalePriceOverLTV: 	 result.data.nation_setting.FHA_SalePriceOverLTV,
				VA_FundingFee:           result.data.nation_setting.VA_FundingFee,
				FHA_PercentOne:      result.data.nation_setting.FHA_PercentOne, 
				USDA_MIPFactor:      result.data.nation_setting.USDA_MIPFactor, 				
			},this.callSellerCostSettingApi(0));
		});
	}

	// function call when change zip code

	updatePostalCode (fieldVal, fieldName) {
		if(this.state.defaultVal != fieldVal){
			if(this.state.sale_pr != '' && this.state.sale_pr != '0.00') {
				this.setState({animating:'true'});
				processedData = fieldVal;
				callPostApi(GLOBAL.BASE_URL + GLOBAL.get_city_state_for_zip, {
				"zip": processedData
			  
				},this.state.access_token)
				.then((response) => {
					zipRes = result;
					if(zipRes.status == 'fail') {
						this.dropdown.alertWithType('error', 'Error', zipRes.message);
						this.setState({animating:'false'});
					} else {
						
						let requestAgt        = {
							'brokageFee': this.state.SCC_Brokage_Fee,
							'sellAgt'   : this.state.sellAgt,
							'listAgt'   : this.state.listAgt,
							'salePrice' : this.state.sale_pr,
							'state'     : this.state.state_code,
							'commisionOption' : this.state.commisionOption,
						}

						let responseAgt        = getSellerListSellAgtValues(requestAgt);
												
						// commented by lovedeep as it is not required for now
						/*if(this.state.sale_pr <= this.state.FHA_SalePriceUnder){
							LTV = this.state.FHA_SalePriceUnderLTV;			
						} else if (this.state.sale_pr > this.state.FHA_SalePriceUnder && this.state.sale_pr <= this.state.FHA_SalePriceTo){
							LTV = this.state.FHA_SalePriceToLTV;			
						} else if (this.state.sale_pr > this.state.FHA_SalePriceOver){
							LTV = this.state.FHA_SalePriceOverLTV;
						}*/

						this.setState({list_agt: responseAgt.list_agt,sell_agt: responseAgt.sell_agt,totalAgt: responseAgt.totalAgt});

						if(zipRes.data.state_name != null || zipRes.data.state_name != 'NULL') {
							callPostApi(GLOBAL.BASE_URL + GLOBAL.title_escrow_type, {
							"companyId": zipRes.data.company_id
							}, this.state.access_token)
							.then((response) => {
								let ownerType;
								let escrowType;
								let lenderType;
								
								this.state.user_county = zipRes.data.county_name;
								this.state.county = zipRes.data.county_id;

								if(this.state.ownerTypeFixed == false) {
									ownerType = result.data.ownerType;
								} else {
									ownerType = this.state.ownerType;
								}
								if(this.state.escrowTypeFixed == false) {
									escrowType = result.data.escrowType;	
								} else {
									escrowType = this.state.escrowType;
								}

								if(this.state.lenderTypeFixed == false) {
									lenderType = result.data.lenderType;
								} else {
									lenderType = this.state.lenderType;
								}

								this.setState({
									[fieldName]: processedData,
									city: zipRes.data.city,
									state: zipRes.data.state_id,
									user_state: zipRes.data.state_code,
									user_county: zipRes.data.county_name,
									county: zipRes.data.county_id,
									ownerType: ownerType,
									escrowType: escrowType,
									lenderType: lenderType,

								},this.callSellerCostSettingApi(1));
								// code commented by lovedeep on 09-03-2018 as per discussion with atul sir as trnasfer tax value not matched with live
								/*this.state.transferTax   = this.state.transferTaxPer * this.state.sale_pr / 1000;
								this.state.transferTax   = this.state.transferTax.toFixed(2);*/

								let requestTransferTax          = { 'transferTaxRate' : this.state.transferTaxPer,'salesprice' : this.state.sale_pr, 'state': zipRes.data.state_code, 'countyId': zipRes.data.county_id };


								//	alert(JSON.stringify(requestTransferTax));
	
								let responseTransferTax         = getTransferTax(requestTransferTax);
		
								//alert(JSON.stringify(responseTransferTax));
								this.state.transferTax = responseTransferTax.transferTax;
	

								
							});
						}
					} 
				});
			} 
			/*else {
				this.setState({animating:'false'});
				this.dropdown.alertWithType('error', 'Error', 'Please enter valid sale price');
			}*/	
		}			
	}
	
	callSellerCostSettingApi(flag)
	{
		/*========= Start Special Case for Minnesota added by lovedeep on 04-06-2018 ====================**/

		if(this.state.state_code == 'MN') {
			this.setState({
				escrowOnlySellerType : true,
			});
		}

		/*========= End Special Case for Minnesota added by lovedeep on 04-06-2018 ====================**/
		

		/*========= Start Special Case for ILLINOIS added by lovedeep on 04-06-2018 ====================**/

		if(this.state.state_code == "IL") {
			this.setState({
				prorationPercentShowStatus : true
			});
		} else {
			this.setState({
				prorationPercentShowStatus : false
			});
		}

		/*========= End Special Case for ILLINOIS added by lovedeep on 04-06-2018 ====================**/
	

		//alert(this.state.lender_address);
		if(flag == 0) {
			callfunc = this.callgetEcrowTitleType();
		} else {
			if(this.state.tab=="FHA") {
				callfunc = this.callFHAsettinsapi();
			}else if(this.state.tab=="VA") {
				callfunc = this.callVAsettinsapi();
			}else if(this.state.tab=="USDA") {
				callfunc = this.callUSDAsettinsapi();
			}else if(this.state.tab=="CONV" || this.state.tab=="Owner_Carry") {
				callfunc = this.callConvSettingData();
			}else if(this.state.tab=="CASH") {
				callfunc = this.callCASHsettinsapi();
			}
		}	
		
			callPostApi(GLOBAL.BASE_URL + GLOBAL.Seller_Cost_Setting, {
			user_id: this.state.user_id,company_id: this.state.company_id, zip: this.state.postal_code
			}, this.state.access_token)
			.then((response) => {
				var i=1;
				// For setting last fields of closing costs page
				for (let resObj of result.data.userSettingCost) {
					const update = {};
					req         = {'amount': this.state.amount, 'loanType': this.state.tab, 'adjusted' : this.state.adjustedamount,'salePrice': this.state.sale_pr,'type': resObj.type,'rate':resObj.fee};
					var data = getSellerCostTypeTotal(req);
					feeval = data.totalCostRate;
					update['label' + i] = resObj.label;
					update['fee' + i] = feeval;
					update['type' + i] = resObj.type;
					update['totalfee' + i] = resObj.fee;
					this.setState(update);
					i++;
				}


				/**============ Start Special Case For Ohio ================**/

				if(this.state.state_code != 'OH') {
					SCC_Brokage_Fee                 = result.data.userSetting.brokerageFeeofSalePrice;                
					// requesting agrigate list and sell values
					let requestAgt        = {
						'SCC_Brokage_Fee'        : SCC_Brokage_Fee
					}
		
					let responseAgt        = getSellerListSellAgt(requestAgt);
	
						this.setState({
							totalCost: result.data.totalCost,
							reconveynceFee: result.data.userSetting.reconveynceFee,
							globalReconveynceFee: result.data.userSetting.reconveynceFee,
							drawingDeed: result.data.userSetting.drawingDeed,
							notary: result.data.userSetting.notary,
							transferTaxPer: result.data.userSetting.transferTax,
							pestControlReport: result.data.userSetting.pestControlReport,
							benifDemandStatement: result.data.userSetting.benifDemandStatement,
							brokerageFeeofSalePrice: result.data.userSetting.brokerageFeeofSalePrice,
							listAgt: responseAgt.listAgt,
							sellAgt: responseAgt.sellAgt,
						},callfunc);
				} else {
					this.setState({
						totalCost: result.data.totalCost,
						reconveynceFee: result.data.userSetting.reconveynceFee,
						globalReconveynceFee: result.data.userSetting.reconveynceFee,
						drawingDeed: result.data.userSetting.drawingDeed,
						notary: result.data.userSetting.notary,
						transferTaxPer: result.data.userSetting.transferTax,
						pestControlReport: result.data.userSetting.pestControlReport,
						benifDemandStatement: result.data.userSetting.benifDemandStatement,
						brokerageFeeofSalePrice: result.data.userSetting.brokerageFeeofSalePrice,
					},callfunc);
				}
				/**============ Start Special Case For Ohio ================**/	

			});
	}
	
	
	// this function is used to get default types of escrow, owner and lender (the value which is shown in dropdown under closing cost section)
	callgetEcrowTitleType() {
		callPostApi(GLOBAL.BASE_URL + GLOBAL.seller_escrow_type, {
		"companyId" : this.state.company_id
		}, this.state.access_token)
		.then((response) => {
			if(seller == 'Seller') {
				this.setState({
					escrowType: result.data.escrowType,
					ownerType: result.data.ownerType,
					lenderType : 'Buyer',
				},this.callConvSettingData);
			}
		});	
	}
	
	// this function callConvSettingData is used to fetch other cost setting values which w are using under other costs section.
    callConvSettingData()
	{
		if(this.state.sale_pr != '' && this.state.sale_pr != '0.00') {
			let MIP;
			MIP             = this.state.FHA_PercentOne;			
			request 		= {'salePrice': this.state.sale_pr,'LTV': this.state.conventionalLoan, 'MIP' : MIP};
			response 		= getSellerAmountCONV(request);
			this.setState({amount: response.amount, adjustedamount: '0.00'});
			callPostApi(GLOBAL.BASE_URL + GLOBAL.fha_va_usda_setting_api, {
				user_id: this.state.user_id,company_id: this.state.company_id, loan_type: "CONV",calc_type: "Seller", zip: this.state.postal_code
			}, this.state.access_token)
			.then((response) => {
				let taxservicecontract;
				let underwriting;
				let processingfee;
				let appraisalfee;
				let documentprep;

				if(this.state.taxservicecontractFixed == false) {
					taxservicecontract = result.data.taxservicecontract;
				} else {
					taxservicecontract = this.state.taxservicecontract;
				}
				if(this.state.underwritingFixed == false) {
					underwriting = result.data.underwriting;
				} else {
					underwriting = this.state.underwriting;
				}
				if(this.state.processingfeeFixed == false) {
					processingfee = result.data.processingfee;
				} else {
					processingfee = this.state.processingfee;
				}
				if(this.state.appraisalfeeFixed == false) {
					appraisalfee = result.data.appraisalfee;
				} else {
					appraisalfee = this.state.appraisalfee;
				}
				if(this.state.documentprepFixed == false) {
					documentprep = result.data.documentpreparation;
				} else {
					documentprep = this.state.documentprep;
				}

				this.setState({
					taxservicecontract: taxservicecontract,
					underwriting: underwriting,
					processingfee: processingfee,
					appraisalfee: appraisalfee,
					documentprep: documentprep,
					originationfactor: result.data.originationFactor,
				},this.callSellerEscrowSettingApi);
			});

		} else {
			callPostApi(GLOBAL.BASE_URL + GLOBAL.fha_va_usda_setting_api, {
				user_id: this.state.user_id,company_id: this.state.company_id, loan_type: "CONV",calc_type: "Seller", zip: this.state.postal_code
			}, this.state.access_token)
			.then((response) => {
				let taxservicecontract;
				let underwriting;
				let processingfee;
				let appraisalfee;
				let documentprep;

				if(this.state.taxservicecontractFixed == false) {
					taxservicecontract = result.data.taxservicecontract;
				} else {
					taxservicecontract = this.state.taxservicecontract;
				}
				if(this.state.underwritingFixed == false) {
					underwriting = result.data.underwriting;
				} else {
					underwriting = this.state.underwriting;
				}
				if(this.state.processingfeeFixed == false) {
					processingfee = result.data.processingfee;
				} else {
					processingfee = this.state.processingfee;
				}
				if(this.state.appraisalfeeFixed == false) {
					appraisalfee = result.data.appraisalfee;
				} else {
					appraisalfee = this.state.appraisalfee;
				}
				if(this.state.documentprepFixed == false) {
					documentprep = result.data.documentpreparation;
				} else {
					documentprep = this.state.documentprep;
				}

				this.setState({
					taxservicecontract: taxservicecontract,
					underwriting: underwriting,
					processingfee: processingfee,
					appraisalfee: appraisalfee,
					documentprep: documentprep,
					originationfactor: result.data.originationFactor,
				},this.calTotalClosingCost);
			});	
		}	
	}
	
	// Function for fetching and setting values of closing cost tab under FHA page
	callFHAsettinsapi(){
		if(this.state.sale_pr != "" && this.state.sale_pr != '0.00'){
			let LTV;
			let MIP;
			if(this.state.sale_pr <= this.state.FHA_SalePriceUnder){
				LTV = this.state.FHA_SalePriceUnderLTV;			
			} else if (this.state.sale_pr > this.state.FHA_SalePriceUnder && this.state.sale_pr <= this.state.FHA_SalePriceTo){
				LTV = this.state.FHA_SalePriceToLTV;			
			} else if (this.state.sale_pr > this.state.FHA_SalePriceOver){
				LTV = this.state.FHA_SalePriceOverLTV;
			}

			MIP             = this.state.FHA_PercentOne;			

			request 		= {'salePrice': this.state.sale_pr,'LTV': LTV, 'MIP': MIP};
			response 		= getSellerAmountFHA(request);

			this.setState({amount: response.amount, adjustedamount: response.adjusted});	
			callPostApi(GLOBAL.BASE_URL + GLOBAL.fha_va_usda_setting_api, {
				user_id: this.state.user_id,company_id: this.state.company_id, loan_type: "FHA",calc_type: "Seller", zip: this.state.postal_code
			}, this.state.access_token)
			.then((response) => {

				let taxservicecontract;
				let underwriting;
				let processingfee;
				let appraisalfee;
				let documentprep;

				if(this.state.taxservicecontractFixed == false) {
					taxservicecontract = result.data.FHA_TaxServiceContract;
				} else {
					taxservicecontract = this.state.taxservicecontract;
				}
				if(this.state.underwritingFixed == false) {
					underwriting = result.data.FHA_Underwriting;
				} else {
					underwriting = this.state.underwriting;
				}
				if(this.state.processingfeeFixed == false) {
					processingfee = result.data.FHA_ProcessingFee;
				} else {
					processingfee = this.state.processingfee;
				}
				if(this.state.appraisalfeeFixed == false) {
					appraisalfee = result.data.FHA_AppraisalFee;
				} else {
					appraisalfee = this.state.appraisalfee;
				}
				if(this.state.documentprepFixed == false) {
					documentprep = result.data.FHA_DocumentPreparation;
				} else {
					documentprep = this.state.documentprep;
				}

				this.setState({
					taxservicecontract: taxservicecontract,
					underwriting: underwriting,
					processingfee: processingfee,
					appraisalfee: appraisalfee,
					documentprep: documentprep,
					originationfactor: result.data.FHA_OriginationFactor,
				},this.callSellerEscrowSettingApi);	
			});
		} else {
			callPostApi(GLOBAL.BASE_URL + GLOBAL.fha_va_usda_setting_api, {
				user_id: this.state.user_id,company_id: this.state.company_id,loan_type: "FHA",calc_type: "Seller", zip: this.state.postal_code
			}, this.state.access_token)
			.then((response) => {

				let taxservicecontract;
				let underwriting;
				let processingfee;
				let appraisalfee;
				let documentprep;

				if(this.state.taxservicecontractFixed == false) {
					taxservicecontract = result.data.FHA_TaxServiceContract;
				} else {
					taxservicecontract = this.state.taxservicecontract;
				}
				if(this.state.underwritingFixed == false) {
					underwriting = result.data.FHA_Underwriting;
				} else {
					underwriting = this.state.underwriting;
				}
				if(this.state.processingfeeFixed == false) {
					processingfee = result.data.FHA_ProcessingFee;
				} else {
					processingfee = this.state.processingfee;
				}
				if(this.state.appraisalfeeFixed == false) {
					appraisalfee = result.data.FHA_AppraisalFee;
				} else {
					appraisalfee = this.state.appraisalfee;
				}
				if(this.state.documentprepFixed == false) {
					documentprep = result.data.FHA_DocumentPreparation;
				} else {
					documentprep = this.state.documentprep;
				}

				this.setState({
					taxservicecontract: taxservicecontract,
					underwriting: underwriting,
					processingfee: processingfee,
					appraisalfee: appraisalfee,
					documentprep: documentprep,
					originationfactor: result.data.FHA_OriginationFactor,
				},this.calTotalClosingCost);	
			});
		}	
	}
	
	// Function for fetching and setting values of closing cost tab under VA page
	callVAsettinsapi(){
		if(this.state.sale_pr != "" && this.state.sale_pr != '0.00'){

			request 		= {'salePrice': this.state.sale_pr,'LTV': this.state.VA_FundingFee};
			response 		= getSellerAmountVA(request);

			this.setState({amount: response.amount, adjustedamount: response.adjusted});
			callPostApi(GLOBAL.BASE_URL + GLOBAL.fha_va_usda_setting_api, {
				user_id: this.state.user_id,company_id: this.state.company_id, loan_type: "VA",calc_type: "Seller", zip: this.state.postal_code
			}, this.state.access_token)
			.then((response) => {

				let taxservicecontract;
				let underwriting;
				let processingfee;
				let appraisalfee;
				let documentprep;

				if(this.state.taxservicecontractFixed == false) {
					taxservicecontract = result.data.VA_TaxServiceContract;
				} else {
					taxservicecontract = this.state.taxservicecontract;
				}
				if(this.state.underwritingFixed == false) {
					underwriting = result.data.VA_Underwriting;
				} else {
					underwriting = this.state.underwriting;
				}
				if(this.state.processingfeeFixed == false) {
					processingfee = result.data.VA_ProcessingFee;
				} else {
					processingfee = this.state.processingfee;
				}
				if(this.state.appraisalfeeFixed == false) {
					appraisalfee = result.data.VA_AppraisalFee;
				} else {
					appraisalfee = this.state.appraisalfee;
				}
				if(this.state.documentprepFixed == false) {
					documentprep = result.data.VA_DocumentPreparation;
				} else {
					documentprep = this.state.documentprep;
				}

				this.setState({
					taxservicecontract: taxservicecontract,
					underwriting: underwriting,
					processingfee: processingfee,
					appraisalfee: appraisalfee,
					documentprep: documentprep,
					originationfactor: result.data.VA_OriginationFactor,
				},this.callSellerEscrowSettingApi);
			});
			
		} else {
			callPostApi(GLOBAL.BASE_URL + GLOBAL.fha_va_usda_setting_api, {
				user_id: this.state.user_id,company_id: this.state.company_id,loan_type: "VA",calc_type: "Seller", zip: this.state.postal_code
			}, this.state.access_token)
			.then((response) => {

				let taxservicecontract;
				let underwriting;
				let processingfee;
				let appraisalfee;
				let documentprep;

				if(this.state.taxservicecontractFixed == false) {
					taxservicecontract = result.data.VA_TaxServiceContract;
				} else {
					taxservicecontract = this.state.taxservicecontract;
				}
				if(this.state.underwritingFixed == false) {
					underwriting = result.data.VA_Underwriting;
				} else {
					underwriting = this.state.underwriting;
				}
				if(this.state.processingfeeFixed == false) {
					processingfee = result.data.VA_ProcessingFee;
				} else {
					processingfee = this.state.processingfee;
				}
				if(this.state.appraisalfeeFixed == false) {
					appraisalfee = result.data.VA_AppraisalFee;
				} else {
					appraisalfee = this.state.appraisalfee;
				}
				if(this.state.documentprepFixed == false) {
					documentprep = result.data.VA_DocumentPreparation;
				} else {
					documentprep = this.state.documentprep;
				}

				this.setState({
					taxservicecontract: taxservicecontract,
					underwriting: underwriting,
					processingfee: processingfee,
					appraisalfee: appraisalfee,
					documentprep: documentprep,
					originationfactor: result.data.VA_OriginationFactor,
				},this.calTotalClosingCost);
			});
		}	
	}
	
	// Function for fetching and setting values of closing cost tab under USDA page
	callUSDAsettinsapi(){
		if(this.state.sale_pr != "" && this.state.sale_pr != '0.00'){

			request 		= {'salePrice': this.state.sale_pr,'MIP': this.state.USDA_MIPFactor};
			response 		= getSellerAmountUSDA(request);

			this.setState({amount: '0.00', adjustedamount: response.adjusted});
			
			callPostApi(GLOBAL.BASE_URL + GLOBAL.fha_va_usda_setting_api, {
				user_id: this.state.user_id,company_id: this.state.company_id, loan_type: "USDA",calc_type: "Seller", zip: this.state.postal_code
			}, this.state.access_token)
			.then((response) => {
				let taxservicecontract;
				let underwriting;
				let processingfee;
				let appraisalfee;
				let documentprep;

				if(this.state.taxservicecontractFixed == false) {
					taxservicecontract = result.data.USDA_TaxServiceContract;
				} else {
					taxservicecontract = this.state.taxservicecontract;
				}
				if(this.state.underwritingFixed == false) {
					underwriting = result.data.USDA_Underwriting;
				} else {
					underwriting = this.state.underwriting;
				}
				if(this.state.processingfeeFixed == false) {
					processingfee = result.data.USDA_ProcessingFee;
				} else {
					processingfee = this.state.processingfee;
				}
				if(this.state.appraisalfeeFixed == false) {
					appraisalfee = result.data.USDA_AppraisalFee;
				} else {
					appraisalfee = this.state.appraisalfee;
				}
				if(this.state.documentprepFixed == false) {
					documentprep = result.data.USDA_DocumentPreparation;
				} else {
					documentprep = this.state.documentprep;
				}

				this.setState({
					taxservicecontract: taxservicecontract,
					underwriting: underwriting,
					processingfee: processingfee,
					appraisalfee: appraisalfee,
					documentprep: documentprep,
					originationfactor: result.data.USDA_OriginationFactor,
				},this.callSellerEscrowSettingApi);
			});
			
		} else {
			callPostApi(GLOBAL.BASE_URL + GLOBAL.fha_va_usda_setting_api, {
				user_id: this.state.user_id,company_id: this.state.company_id,loan_type: "USDA",calc_type: "Seller", zip: this.state.postal_code
			}, this.state.access_token)
			.then((response) => {

				let taxservicecontract;
				let underwriting;
				let processingfee;
				let appraisalfee;
				let documentprep;

				if(this.state.taxservicecontractFixed == false) {
					taxservicecontract = result.data.USDA_TaxServiceContract;
				} else {
					taxservicecontract = this.state.taxservicecontract;
				}
				if(this.state.underwritingFixed == false) {
					underwriting = result.data.USDA_Underwriting;
				} else {
					underwriting = this.state.underwriting;
				}
				if(this.state.processingfeeFixed == false) {
					processingfee = result.data.USDA_ProcessingFee;
				} else {
					processingfee = this.state.processingfee;
				}
				if(this.state.appraisalfeeFixed == false) {
					appraisalfee = result.data.USDA_AppraisalFee;
				} else {
					appraisalfee = this.state.appraisalfee;
				}
				if(this.state.documentprepFixed == false) {
					documentprep = result.data.USDA_DocumentPreparation;
				} else {
					documentprep = this.state.documentprep;
				}

				this.setState({
					taxservicecontract: taxservicecontract,
					underwriting: underwriting,
					processingfee: processingfee,
					appraisalfee: appraisalfee,
					documentprep: documentprep,
					originationfactor: result.data.USDA_OriginationFactor,
				},this.calTotalClosingCost);
			});
		}	
	}
	
	// Function for fetching and setting values of closing cost tab under CASH page
    callCASHsettinsapi() {
		if(this.state.sale_pr != "" && this.state.sale_pr != '0.00') {
			this.setState({animating:'true'});
			this.setState({amount: 0.00});
			this.setState({adjustedamount: 0.00});
			let taxservicecontract;
			let underwriting;
			let processingfee;
			let appraisalfee;
			let documentprep;

			if(this.state.taxservicecontractFixed == false) {
				taxservicecontract = '0.00';
			} else {
				taxservicecontract = this.state.taxservicecontract;
			}
			if(this.state.underwritingFixed == false) {
				underwriting = '0.00';
			} else {
				underwriting = this.state.underwriting;
			}
			if(this.state.processingfeeFixed == false) {
				processingfee = '0.00';
			} else {
				processingfee = this.state.processingfee;
			}
			if(this.state.appraisalfeeFixed == false) {
				appraisalfee = '0.00';
			} else {
				appraisalfee = this.state.appraisalfee;
			}
			if(this.state.documentprepFixed == false) {
				documentprep = '0.00';
			} else {
				documentprep = this.state.documentprep;
			}
			this.setState({
				taxservicecontract: taxservicecontract,
				underwriting: underwriting,
				processingfee: processingfee,
				appraisalfee: appraisalfee,
				documentprep: documentprep,
				originationfactor: 0.00,
				},this.callSellerEscrowSettingApi);
		} else {
			this.setState({animating:'true'});		
			let taxservicecontract;
			let underwriting;
			let processingfee;
			let appraisalfee;
			let documentprep;

			if(this.state.taxservicecontractFixed == false) {
				taxservicecontract = '0.00';
			} else {
				taxservicecontract = this.state.taxservicecontract;
			}
			if(this.state.underwritingFixed == false) {
				underwriting = '0.00';
			} else {
				underwriting = this.state.underwriting;
			}
			if(this.state.processingfeeFixed == false) {
				processingfee = '0.00';
			} else {
				processingfee = this.state.processingfee;
			}
			if(this.state.appraisalfeeFixed == false) {
				appraisalfee = '0.00';
			} else {
				appraisalfee = this.state.appraisalfee;
			}
			if(this.state.documentprepFixed == false) {
				documentprep = '0.00';
			} else {
				documentprep = this.state.documentprep;
			}
			this.setState({
				taxservicecontract: taxservicecontract,
				underwriting: underwriting,
				processingfee: processingfee,
				appraisalfee: appraisalfee,
				documentprep: documentprep,
				originationfactor: 0.00,
				},this.calTotalClosingCost);
		}

    }
	
	// this function is called to get default values of onwer, escrow and lender which we are using on right side of each dropdown under closing cost section
	callSellerEscrowSettingApi() {
		for (var i = 1; i < 11; i++) {
			const update = {};
			req  = {'amount': this.state.amount, 'loanType': this.state.tab, 'adjusted' : this.state.adjustedamount, 'salePrice': this.state.sale_pr,'type': this.state['type' + i],'rate':this.state['totalfee' + i]};
			var data = getSellerCostTypeTotal(req);
			feeval = data.totalCostRate;
			update['fee' + i] = feeval;
			this.setState(update);
		}

		date = this.state.date;
		var split = date.split('-');
		date = Number(split[0])+'/'+Number(split[1])+'/'+Number(split[2]);

		// As per discussion with atul on 03-06-2018
		if(this.state.adjustedamount == '0.00') {
			adjustedamount	= this.state.amount;
		} else {
			adjustedamount	= this.state.adjustedamount;
		}
		if(this.state.isCheckForWisconsin == true) {
			this.state.reissueYearDropdownVal = 1;
		} else {
			this.state.reissueYearDropdownVal = 0;
		}	

		if(!isNaN(adjustedamount)) {


				if(this.state.reissueSalePrice != '' || this.state.reissueSalePrice != '0.00') {
						this.setState({
							reissueYearDropdownVal : this.state.reissueSalePrice
						});
				} 
				if(adjustedamount == 0) {
					adjustedamount = '0.00';
				}
				
				//alert("city " + this.state.city + "county_name " + this.state.user_county + "salePrice " + this.state.sale_pr + "adjusted " + adjustedamount + "state " + this.state.state + "county " + this.state.county + 'zip ' + this.state.postal_code + "estStlmtDate " + date);
				if(this.state.isCheckForOhio == true) {
				if(this.state.reissueSalePrice != '0.00' && this.state.reissueSalePrice > 0) {
					
					/*this.setState({
						reissueYearDropdownVal : this.state.reissueSalePrice
					});*/

					this.state.reissueYearDropdownVal = this.state.reissueSalePrice;

				var sellerReissueReq = 	{
					"city": this.state.city,"county_name": this.state.user_county,"salePrice": this.state.sale_pr,"adjusted": adjustedamount,"state": this.state.state,"county": this.state.county, "loanType": this.state.tab, zip: this.state.postal_code, "estStlmtDate": date, 'userId':this.state.user_id,'device':this.state.deviceName, "calc":"seller", "reissueyr" : this.state.reissueYearDropdownVal
				};
				callPostApi(GLOBAL.BASE_URL + GLOBAL.seller_escrow_xml_data, {
				"city": this.state.city,"county_name": this.state.user_county,"salePrice": this.state.sale_pr,"adjusted": adjustedamount,"state": this.state.state,"county": this.state.county, "loanType": this.state.tab, zip: this.state.postal_code, "estStlmtDate": date, 'userId':this.state.user_id,'device':this.state.deviceName, "calc":"seller", "reissueyr" : this.state.reissueYearDropdownVal
				}, this.state.access_token)
				.then((response) => {

					console.log("seller_escrow_xml_data 1 " + JSON.stringify(result));

					if (this.state.state_code == 'FL' && this.state.user_county != "BROWARD") {
						//     this.UserSetting_l8 = this.datareturn.data.MtgDocStampsLabel;
							 this.state.label8 = 'Flat Fee';
							 this.state.fee8 = result.data.transferTax;
							 //this.UserSetting_final8 = this.UserSetting_f8;
					}

					if (this.state.state_code == 'WA') {
						//this.UserSetting_l8 = this.datareturn.data.MtgDocStampsLabel;		
						this.state.label8 = 'Flat Fee';
						this.state.fee8 = result.data.ExciseTax;
						/*this.UserSetting_t8 = 'Flat Fee';
						this.UserSetting_f8 = this.exciseTax;
						this.UserSetting_final8 = this.UserSetting_f8;*/
					}	

					/**========= Start special case for Hawaii & New Jercey State added by lovedeep =======**/
					
					if(this.state.state_code == 'HI') {
						this.state.transferTax = result.data.transferTax; 	
					} else if(this.state.state_code == 'NJ') {
						this.state.transferTax = result.data.transferTax; 	
					}	
								
					/**========= End special case for Hawaii & New Jercey State added by lovedeep =======**/
					
					
					/**========= Start special case for ILLINOIS State added by lovedeep =======**/

					if (this.state.state_code == "IL") {
						this.state.buyers_fee_text = 'City Transfer Tax';
						this.state.buyersfee = result.data.CityTransferTaxSeller;
						this.state.corrective_work_text = 'County Transfer Tax';
						this.state.transfer_tax_text = 'State Transfer Tax';
						this.state.correctivework = result.data.CountyTransferTaxSeller;
					} else {
						this.state.corrective_work_text  = "Corrective Work";
						this.state.correctivework   = "0.00";
						this.state.transfer_tax_text = 'Transfer Tax';
						this.state.buyersfee    = '0.00';
						this.state.buyers_fee_text = "Buyer's Fees";
					}

					/**========= End special case for ILLINOIS State added by lovedeep =======**/
					

					/**========= Start special case for Minnesota State added by lovedeep =======**/
					
						if (this.state.state_code == 'MN') {
							this.state.fee10        = result.data.State_Deed_Tax;
							//this.UserSetting_f4 = this.BuyerEscrowData.data.Mortgage_Registration_Tax;
							//this.UserSetting_final4 = this.UserSetting_f4;
							//this.UserSetting_f9 = this.BuyerEscrowData.data.Underwriting;
							//this.UserSetting_final9 = this.UserSetting_f9;
						}

					/**========= Start special case for Minnesota State added by lovedeep =======**/


					/**========= Start special case for Missouri State added by lovedeep =======**/

					if (this.state.state_code == 'MO') {
						this.state.fee2			    = result.data.CPLSeller;
						//this.UserSetting_f2 = this.datareturn.data.CPLSeller;
						//this.UserSetting_final2 = this.UserSetting_f2;	
					}

					/**========= Start special case for Missouri State added by lovedeep =======**/


					/**====================== Start Special case for New Maxico state ======================**/

					if(this.state.state_code == 'NM') {
						this.setState({
							buyersfee : '25.00',
							buyers_fee_text : 'Flood Cert',
							appraisalfee : '550.00',
							taxservicecontract : '80.00'
						});
					}	

				/**==================== End Special case for New Maxico state ===========================**/
				
				/**=================== Start Special case for New Maxico state   =====================**/

					if(this.state.state_code == 'NM'){
						let request = {
							'totalAgt': this.state.totalAgt,
							'countyId': this.state.county,
							'stateId': this.state.state,
							'zipCode': this.state.postal_code
						}
						let response = getGrossCommissionsVal(request);
						this.setState({
							fee8 : response.commissionsTax
						});
						//this.state.fee8 = response.commissionsTax;
					}
		
				/**=================== End Special case for New Maxico state   =====================**/
										

					this.setState({
						ownerFeeOrg: result.data.ownerFee,
						escrowFeeOrg: result.data.escrowFee,
						lenderFeeOrg: result.data.lenderFee,
						escrowFeeBuyer : result.data.escrowFeeBuyer,
						escrowFeeSeller : result.data.escrowFeeSeller,
					});
					
					this.setState({
						ownerFee: this.state.ownerFeeOrg,
						escrowFee: this.state.escrowFeeOrg,
						lenderFee: this.state.lenderFeeOrg,
						countyTax : result.data.countyTax,
						cityTax : result.data.cityTax
					});

				callGetApi(GLOBAL.BASE_URL + GLOBAL.ca_transfer_tax, {
					}, this.state.access_token)
					.then((response) => {

						//alert(JSON.stringify(result));

						let CA_Transfer_Tax = result;
						if(this.state.user_state == "CA") {
							let countyTax;
							let userCity  = StrToUpper(this.state.city); 
							let rate   = StrInArray(userCity, CA_Transfer_Tax.transferTax);
							if (typeof rate !== "undefined") {
								let payor    = StrInArray(userCity, CA_Transfer_Tax.payor);
								let tax_payor   = payor.split("_");
								let taxPayorCounty  = tax_payor[0]; // County payor
								let taxPayorCity  = tax_payor[1]; // City Payor
						
								let countyTax  = (this.state.sale_pr * 1.10) / 1000;
								let cityTax  = (this.state.sale_pr * parseFloat(rate)) / 1000;  // City T. T.
						
								if(taxPayorCounty == "Split") countyTax = countyTax / 2;
								if(taxPayorCity == "Split") cityTax = cityTax / 2;  
						
								let transfer_Tax   = cityTax.toFixed(2);     
								/*this.state.buyers_fee_text = this.city + ' Transfer Tax';
								this.buyersFees   = transfer_Tax;
								this.calTotalOtherCost();*/

								// commented by lovedeep on 03-26-2018
								// reason :- lets change “City Name” to Generic “City Transfer Tax” by client
								/*this.setState({
									buyers_fee_text : this.state.city + " transfer tax",
									buyersfee : transfer_Tax
								}, this.calEscrowData);*/
								
								this.setState({
									buyers_fee_text : "City Transfer Tax",
									buyersfee : transfer_Tax
								}, this.calEscrowData);

							}	else {
								this.setState({
									buyers_fee_text : "Buyer's Fee",
									buyersfee : '0.00'
								}, this.calEscrowData);	
							}
						}else{this.calEscrowData();}
					});	

					/*callPostApi(GLOBAL.BASE_URL + GLOBAL.get_transfer_tax, {
						"countyTax": result.data.countyTax,"cityTax": result.data.cityTax,"city": this.state.city, "type": "seller"
						}, this.state.access_token)
						.then((response) => {
						this.setState({
							buyers_fee_text : this.state.city + " transfer tax",
							buyersfee : result.data.CityTransferTaxBuyer
						}, this.calEscrowData);	
					});*/

					});
				}
			} else {
				callPostApi(GLOBAL.BASE_URL + GLOBAL.seller_escrow_xml_data, {
					"city": this.state.city,"county_name": this.state.user_county,"salePrice": this.state.sale_pr,"adjusted": adjustedamount,"state": this.state.state,"county": this.state.county, "loanType": this.state.tab, zip: this.state.postal_code, "estStlmtDate": date, 'userId':this.state.user_id,'device':this.state.deviceName, "calc":"seller", "reissueyr" : this.state.reissueYearDropdownVal
					}, this.state.access_token)
					.then((response) => {

						console.log("seller_escrow_xml_data 2 " + JSON.stringify(result));

						if (this.state.state_code == 'FL' && this.state.user_county != "BROWARD") {
							//     this.UserSetting_l8 = this.datareturn.data.MtgDocStampsLabel;
								 this.state.label8 = 'Flat Fee';
								 this.state.fee8 = result.data.transferTax;
								 //this.UserSetting_final8 = this.UserSetting_f8;
						}	
						if (this.state.state_code == 'WA') {
							//this.UserSetting_l8 = this.datareturn.data.MtgDocStampsLabel;		
							this.state.label8 = 'Flat Fee';
							this.state.fee8 = result.data.ExciseTax;
							/*this.UserSetting_t8 = 'Flat Fee';
							this.UserSetting_f8 = this.exciseTax;
							this.UserSetting_final8 = this.UserSetting_f8;*/						
						}	

						/**========= Start special case for Hawaii & New Jercey State added by lovedeep =======**/
						
						if(this.state.state_code == 'HI') {
							this.state.transferTax = result.data.transferTax; 	
						} else if(this.state.state_code == 'NJ') {
							this.state.transferTax = result.data.transferTax; 	
						}	
									
						/**========= End special case for Hawaii & New Jercey State added by lovedeep =======**/
						
						
						/**========= Start special case for ILLINOIS State added by lovedeep =======**/
	
						if (this.state.state_code == "IL") {
							this.state.buyers_fee_text = 'City Transfer Tax';
							this.state.buyersfee = result.data.CityTransferTaxSeller;
							this.state.corrective_work_text = 'County Transfer Tax';
							this.state.transfer_tax_text = 'State Transfer Tax';
							this.state.correctivework = result.data.CountyTransferTaxSeller;
						} else {
							this.state.corrective_work_text  = "Corrective Work";
							this.state.correctivework   = "0.00";
							this.state.transfer_tax_text = 'Transfer Tax';
							this.state.buyersfee    = '0.00';
							this.state.buyers_fee_text = "Buyer's Fees";
						}
	
						/**========= End special case for ILLINOIS State added by lovedeep =======**/
						
	
						/**========= Start special case for Minnesota State added by lovedeep =======**/
						
							if (this.state.state_code == 'MN') {
								this.state.fee10        = result.data.State_Deed_Tax;
								//this.UserSetting_f4 = this.BuyerEscrowData.data.Mortgage_Registration_Tax;
								//this.UserSetting_final4 = this.UserSetting_f4;
								//this.UserSetting_f9 = this.BuyerEscrowData.data.Underwriting;
								//this.UserSetting_final9 = this.UserSetting_f9;
							}
	
						/**========= Start special case for Minnesota State added by lovedeep =======**/
	
	
						/**========= Start special case for Missouri State added by lovedeep =======**/
	
						if (this.state.state_code == 'MO') {
							this.state.fee1			    = result.data.ownerServiceFeeSeller;
							//this.UserSetting_f2 = this.datareturn.data.CPLSeller;
							//this.UserSetting_final2 = this.UserSetting_f2;	
						}
	
						/**========= Start special case for Missouri State added by lovedeep =======**/
	
	
						/**====================== Start Special case for New Maxico state ======================**/
	
						if(this.state.state_code == 'NM') {
							this.setState({
								buyersfee : '25.00',
								buyers_fee_text : 'Flood Cert',
								appraisalfee : '550.00',
								taxservicecontract : '80.00'
							});
						}	
	
					/**==================== End Special case for New Maxico state ===========================**/
					
					/**=================== Start Special case for New Maxico state   =====================**/
	
						if(this.state.state_code == 'NM'){
							let request = {
								'totalAgt': this.state.totalAgt,
								'countyId': this.state.county,
								'stateId': this.state.state,
								'zipCode': this.state.postal_code
							}
							let response = getGrossCommissionsVal(request);
							this.setState({
								fee8 : response.commissionsTax
							});
							//this.state.fee8 = response.commissionsTax;
						}
			
					/**=================== End Special case for New Maxico state   =====================**/
											
	
						this.setState({
							ownerFeeOrg: result.data.ownerFee,
							escrowFeeOrg: result.data.escrowFee,
							lenderFeeOrg: result.data.lenderFee,
							escrowFeeBuyer : result.data.escrowFeeBuyer,
							escrowFeeSeller : result.data.escrowFeeSeller,
						});
						
						this.setState({
							ownerFee: this.state.ownerFeeOrg,
							escrowFee: this.state.escrowFeeOrg,
							lenderFee: this.state.lenderFeeOrg,
							countyTax : result.data.countyTax,
							cityTax : result.data.cityTax
						});
	
					callGetApi(GLOBAL.BASE_URL + GLOBAL.ca_transfer_tax, {
						}, this.state.access_token)
						.then((response) => {
	
							//alert(JSON.stringify(result));
	
							let CA_Transfer_Tax = result;
							if(this.state.user_state == "CA") {
								let countyTax;
								let userCity  = StrToUpper(this.state.city); 
								let rate   = StrInArray(userCity, CA_Transfer_Tax.transferTax);
								if (typeof rate !== "undefined") {
									let payor    = StrInArray(userCity, CA_Transfer_Tax.payor);
									let tax_payor   = payor.split("_");
									let taxPayorCounty  = tax_payor[0]; // County payor
									let taxPayorCity  = tax_payor[1]; // City Payor
							
									let countyTax  = (this.state.sale_pr * 1.10) / 1000;
									let cityTax  = (this.state.sale_pr * parseFloat(rate)) / 1000;  // City T. T.
							
									if(taxPayorCounty == "Split") countyTax = countyTax / 2;
									if(taxPayorCity == "Split") cityTax = cityTax / 2;  
							
									let transfer_Tax   = cityTax.toFixed(2);     
									/*this.state.buyers_fee_text = this.city + ' Transfer Tax';
									this.buyersFees   = transfer_Tax;
									this.calTotalOtherCost();*/
	
									// commented by lovedeep on 03-26-2018
									// reason :- lets change “City Name” to Generic “City Transfer Tax” by client
									/*this.setState({
										buyers_fee_text : this.state.city + " transfer tax",
										buyersfee : transfer_Tax
									}, this.calEscrowData);*/
									
									this.setState({
										buyers_fee_text : "City Transfer Tax",
										buyersfee : transfer_Tax
									}, this.calEscrowData);
	
								}	else {
									this.setState({
										buyers_fee_text : "Buyer's Fee",
										buyersfee : '0.00'
									}, this.calEscrowData);	
								}
							}else{this.calEscrowData();}
						});	
	
						/*callPostApi(GLOBAL.BASE_URL + GLOBAL.get_transfer_tax, {
							"countyTax": result.data.countyTax,"cityTax": result.data.cityTax,"city": this.state.city, "type": "seller"
							}, this.state.access_token)
							.then((response) => {
							this.setState({
								buyers_fee_text : this.state.city + " transfer tax",
								buyersfee : result.data.CityTransferTaxBuyer
							}, this.calEscrowData);	
						});*/
	
						});
			}

			}		
	}
	
	calEscrowData() {
		this.state.escrowTotal = parseFloat(this.state.lenderFee) + parseFloat(this.state.ownerFee) + parseFloat(this.state.escrowFee);

		let request 		= {'discountPerc': this.state.disc,'amount': this.state.amount};
		let response 				= getSellerDiscountAmount(request);
		this.state.otherCostsDiscount2 = response.discount;

		this.setState({disc: this.state.disc,otherCostsDiscount2: response.discount});
		this.setState({escrowTotal: this.state.escrowTotal},this.onOwnerChange("escrow"));
	}
	
	updatePhoneNumberFormat(phone_number){
		phone_number = phone_number.replace(/[^\d.]/g,'').replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
	   this.setState({contact_number : phone_number});
   	}
	
	// this function is called when you change value from dropdown in case of Owners. 
	onOwnerChange(defval) {
	    if(defval == 'escrow') {
		    this.state.selectedOwnerTypeId    = this.state.ownerType;
        } else {
			this.state.selectedOwnerTypeId 	= defval;
			this.state.ownerType			= this.state.selectedOwnerTypeId;
			this.setState({
				ownerTypeFixed : true
			});
			//this.state.ownerTypeFixed = true;
		}
	        
        if(this.state.selectedOwnerTypeId == 'Split') {

			/**============== Start Special case added by lovedeep for Hawaii County    **/

			if(this.state.state_code == 'HI'){ 
				this.state.ownerFee = Math.round(this.state.ownerFeeOrg * 60 / 100);
			} else {
				this.state.ownerFee   = this.state.ownerFeeOrg/2;
			}	
			
			/**============== End Special case added by lovedeep for Hawaii County    **/

			this.onEscrowChange("escrow");
				
        } else if(this.state.selectedOwnerTypeId == 'Buyer'){
            this.state.ownerFee   = '0.00';
			this.onEscrowChange("escrow");
				
        } else if(this.state.selectedOwnerTypeId == 'Seller'){
            this.state.ownerFee   = this.state.ownerFeeOrg;
			this.onEscrowChange("escrow");			
		}
		
		this.state.ownerFee = parseFloat(this.state.ownerFee).toFixed(2);

		/* if (this.state.state_code == 'NM') {
			this.state.label3 = 'Flat Fee';
			this.state.fee3 = parseFloat(this.state.ownerFee) * parseFloat("15") / 100;
		} */
	}
	
	// this function is called when you change value from dropdown in case of Escr. or Settle.	
	onEscrowChange(defval) {

		/**============== Start Special case added by lovedeep for Minnesota State    **/

		if(this.state.state_code == 'MN') {
			this.state.escrowFee  = this.state.escrowFeeOrg;
			this.onLenderChange("escrow");
		} else {
			if(defval == 'escrow'){
				this.state.selectedEscrowTypeId   = this.state.escrowType;
			} else {
				this.state.selectedEscrowTypeId   = defval;
				this.state.escrowType			= this.state.selectedEscrowTypeId;
				this.setState({
					escrowTypeFixed : true
				});
				//this.state.escrowTypeFixed = true;
			}   
			
			if(this.state.selectedEscrowTypeId == 'Split') {
				if(this.state.escrowFeeBuyer == '0.00') {
					this.state.escrowFee  = this.state.escrowFeeSeller/2;
				} else if(this.state.escrowFeeSeller == '0.00') {
					this.state.escrowFee  = this.state.escrowFeeBuyer/2;
				} else {
					this.state.escrowFee  = this.state.escrowFeeSeller;
				}
				this.onLenderChange("escrow");
					
			} else if(this.state.selectedEscrowTypeId == 'Seller') {
				this.state.escrowFee  = this.state.escrowFeeOrg;
				this.onLenderChange("escrow");
					
			} else if(this.state.selectedEscrowTypeId == 'Buyer') {			
				this.state.escrowFee  = '0.00';
				this.onLenderChange("escrow");	
			}
		}

		this.state.escrowFee = parseFloat(this.state.escrowFee).toFixed(2);

		/**============== End Special case added by lovedeep for Minnesota State    **/
	}


	calReissueSalePrice() {


		if (this.state.reissueSalePriceEditableStatus == true) {
			this.setState({
				reissueYearDropdownVal : 1
			}, this.callSellerEscrowSettingApi);
		} else {
			this.setState({
				reissueYearDropdownVal : 0
			}, this.callSellerEscrowSettingApi);
		}
		//this.getFACCData();
	}
	
	
    // this function is called when you change value from dropdown in case of Lender.
	onLenderChange(defval) {   
        if(defval == 'escrow') {
            this.state.selectedLenderTypeId   = this.state.lenderType;
        } else {
            this.state.selectedLenderTypeId     = defval;
			this.state.lenderType			= this.state.selectedLenderTypeId;
			this.setState({
				lenderTypeFixed : true
			});
        }   
        
        if(this.state.selectedLenderTypeId == 'Split'){
            this.state.lenderFee  = this.state.lenderFeeOrg/2;
			this.totalCostDataUpdateFields();	
        } else if(this.state.selectedLenderTypeId == 'Buyer'){
            this.state.lenderFee  = '0.00';
			this.totalCostDataUpdateFields();
        } else if(this.state.selectedLenderTypeId == 'Seller'){
			this.state.lenderFee  = this.state.lenderFeeOrg;
			this.totalCostDataUpdateFields();
		}
		this.state.lenderFee = parseFloat(this.state.lenderFee).toFixed(2);
    }   

	// In this function, we are calculating total closing cost (shown under closing cost section) , total other cost (shown under other cost section), total all cost (shown at bottom under seller section) and Est Seller Net cost (Final Amount).
	
	calTotalClosingCost() {
		if(this.state.originationFee == '') {
			originationFee = 0.00;
		} else {
			originationFee = this.state.originationFee;
		}
	
		totalCostData = parseFloat(this.state.drawingDeed) + parseFloat(this.state.notary) + parseFloat(this.state.transferTax) + parseFloat(this.state.pestControlReport) + parseFloat(this.state.benifDemandStatement) + parseFloat(this.state.reconveynceFee) + parseFloat(this.state.totalAgt) + parseFloat(this.state.daysInterest) + parseFloat(this.state.prepaymentPenality) + parseFloat(this.state.fee1) + parseFloat(this.state.fee2) + parseFloat(this.state.fee3) + parseFloat(this.state.fee4) + parseFloat(this.state.fee5) + parseFloat(this.state.fee6) + parseFloat(this.state.fee7) + parseFloat(this.state.fee8) + parseFloat(this.state.fee9) + parseFloat(this.state.fee10) + parseFloat(this.state.escrowFee) + parseFloat(this.state.ownerFee) + parseFloat(this.state.lenderFee);

		rsp = getUptoTwoDecimalPoint(totalCostData);
		this.setState({totalClosingCost: rsp.val});

		totalOtherCost = parseFloat(this.state.otherCostsDiscount2) + parseFloat(this.state.processingfee) + parseFloat(this.state.taxservicecontract) + parseFloat(this.state.documentprep) + parseFloat(this.state.underwriting) + parseFloat(this.state.appraisalfee) + parseFloat(this.state.correctivework) + parseFloat(this.state.buyersfee);
		
		res = getUptoTwoDecimalPoint(totalOtherCost);
		this.setState({totalOtherCost: res.val});
		
		//this.state.totalOtherCost = res.val;
		this.state.totalAllCost = parseFloat(totalCostData) + parseFloat(totalOtherCost);
		resp = getUptoTwoDecimalPoint(this.state.totalAllCost);
		this.state.totalAllCost = resp.val;
		
		SellerNet = parseFloat(this.state.sale_pr) - parseFloat(this.state.existingTotal) - parseFloat(this.state.totalAllCost) - parseFloat(this.state.estimatedTaxProrations);
		response = getUptoTwoDecimalPoint(SellerNet);
		this.state.estimatedSellerNet = response.val;
		
		if(this.state.firstLoanOwnerCarry == true || this.state.secondLoanOwnerCarry == true){
			
				if(this.state.firstLoanOwnerCarry == true){
					amount = this.state.sale_pr * this.state.owner_carry_loan1/100;
					amount = parseFloat(amount).toFixed(2);
					var owner_carry_loan_amount = parseFloat(amount);
					this.state.owner_carry_loan_amount1 = owner_carry_loan_amount;
				}
				if(this.state.secondLoanOwnerCarry == true){
					amount = this.state.sale_pr * this.state.owner_carry_loan2/100;
					amount = parseFloat(amount).toFixed(2);
					var owner_carry_loan_amount = parseFloat(amount);
					this.state.owner_carry_loan_amount2 = owner_carry_loan_amount;
				}
				var buyer_cash_dp = parseFloat(this.state.sale_pr) - owner_carry_loan_amount;
				
				var amount_left_to_pay_saller = buyer_cash_dp - parseFloat(this.state.existingTotal);
				var estimatedHUDNet =  amount_left_to_pay_saller - parseFloat(this.state.totalAllCost) - parseFloat(this.state.estimatedTaxProrations);
				var seller_carried_loan = (parseFloat(this.state.sale_pr)- buyer_cash_dp);    
				
				this.setState({
					sellerCarriedLoan: seller_carried_loan,
					estimatedSellerNet: parseFloat(estimatedHUDNet).toFixed(2),
					estimatedSellerNetCopy: response.val
				});	
				this.state.estimatedSellerNet = parseFloat(estimatedHUDNet).toFixed(2);
			
		}
		this.setState({animating:'false'});

		if(this.state.sale_pr == '0.00') {
			this.state.textMsgPdfArray = {
				"Prepared_For"         : this.state.preparedFor,
				"address"              : this.state.lender_address,
				"salesPrice"           : this.state.sale_pr,
				"estClosingDate"       : this.state.date,
				"closingCost"          : this.state.totalClosingCost,
				"balanceOfAllLoans"    : this.state.existingTotal,
				"totalOtherCost"       : this.state.totalOtherCost,
				"estimatedTaxProration": this.state.estimatedTaxProrations,
				"totalAllCost"         : this.state.totalAllCost,
				"estimatedSellerNet"   : this.state.estimatedSellerNet,
				"userId"               : this.state.user_id,
				"companyId"            : this.state.company_id,
				"city"                 : this.state.city,
				"state"                : this.state.state_name, 
				"zip"                  : this.state.postal_code,
				"buyerLoanType"        : this.state.tab,
				"caltype" : "seller"
			}
		}
	}
	
	changeFooterTab(footer_tab){
		
		this.setState({footer_tab: footer_tab});
		if(footer_tab == 'seller'){
			this.setState({sellerFooterTab: true});
		}else{
			this.setState({sellerFooterTab: false});
		}
	}	
	

	onBackHomePress() {
		if(this.state.footer_tab == 'closing_cost' || this.state.footer_tab == 'other_costs') {
			// function created inside setstate object is called anonyms function which is called on the fly.
			this.setState({footer_tab: 'seller'}, function() {
				if(this.state.footer_tab == 'seller') {
					this.setState({netFirstFooterTab: true});
				} else {
					this.setState({netFirstFooterTab: false});
				}
			});
		} else {
			this.props.navigator.push({name: 'Dashboard', index: 0 });
		}
		//this.props.navigator.push({name: 'Dashboard', index: 0 });
	 }
	
	//This function call when you select value from escrow dropdown (under closing cost section)
	createEscrowPicker(idx, value) {
		this.setState({escrowType: value}, this.onEscrowChange(value));
	}
	
	// This function call when you select value from owner dropdown (under closing cost section)	
	createOwnerPicker(idx, value) {
		this.setState({ownerType: value}, this.onOwnerChange(value));
	}	
	
	// This function call when you select value from lender dropdown (under closing cost section)	
	createLenderPicker(idx, value) {
		this.setState({lenderType: value}, this.onLenderChange(value));
	}
	
	calSellerAgrigateValue(){
        // requesting agrigate list and sell values
        let requestAgt        = {
			'brokageFee': this.state.SCC_Brokage_Fee,
            'sellAgt'   : this.state.sellAgt,
            'listAgt'   : this.state.listAgt,
			'salePrice' : this.state.sale_pr,
			'state'     : this.state.state_code,
			'countyId' : this.state.county,
			'commisionOption' : this.state.commisionOption,
        }
        let responseAgt        = getSellerListSellAgtValues(requestAgt);
		this.setState({list_agt: responseAgt.list_agt,sell_agt: responseAgt.sell_agt,totalAgt: responseAgt.totalAgt});   
    }
	
	onChange(text) {
		val = text.replace(/[^0-9\.]/g,'');
		if(val.split('.').length>2) {
			val =val.replace(/\.+$/,"");
		}
		newText = val;
		return newText;	
	}

	onChangeBuyerDownPayment(text) {
		val = text.replace(/[^0-9\.]/g,'');
		if(val.split('.').length>2) {
			val =val.replace(/\.+$/,"");
		}
		newText = val;
		if(newText > 100) {
			this.state.percentStatus = false;
			this.state.dollarStatus = true;
		} else {
			this.state.percentStatus = true;
			this.state.dollarStatus = false;
		}
		return newText;			
	}


	delimitNumbers(str) {
		return (str + "").replace(/\b(\d+)((\.\d+)*)\b/g, function(a, b, c) {
		  return (b.charAt(0) > 0 && !(c || ".").lastIndexOf(".") ? b.replace(/(\d)(?=(\d{3})+$)/g, "$1,") : b) + c;
		});
	}

	settingsApi(flag){
		Keyboard.dismiss();
		this.setState({animating:'true'});
		this.setState({tab: flag},this.afterSetStateSettingApi);
	}
	
	//Call when state of tab is set
	afterSetStateSettingApi(){
		this.setState({


			enterAddressBar : false
		});
		if(this.state.tab=="FHA"){
			this.callFHAsettinsapi();
		}else if(this.state.tab=="VA"){
			this.callVAsettinsapi();
		}else if(this.state.tab=="USDA"){
			this.callUSDAsettinsapi();
		}else if(this.state.tab=="CONV" || this.state.tab=="Owner_Carry"){
			this.callConvSettingData();
		}else if(this.state.tab=="CASH"){
			this.callCASHsettinsapi();
		}
	}

	
	// call function when any of the input field of calculator change
	updateFormFieldFunction(fieldVal, fieldName) {
		if(this.state.countFunc == 1) {
				fieldVal = this.removeCommas(fieldVal);
				if(fieldVal == ''){
					this.setState({
						[fieldName]: '0.00',
					});
				}else if(fieldVal != ''){
					if(fieldName == 'annualPropertyTax' || fieldName == 'winterPropertyTax' || fieldName == 'summerPropertyTax') {
						funcCall = this.onCallannualPropertyTax(fieldVal);	
					} else if (fieldName == 'listAgt' || fieldName == 'sellAgt') {
						funcCall = this.onCallCamelAgtFields();
					}  else if (fieldName == 'list_agt' || fieldName == 'sell_agt') {
						funcCall = this.onCallagtFields();
					}  else if (fieldName == 'disc' || fieldName == 'otherCostsDiscount2') {
						funcCall = this.onCallDiscount(fieldVal);
					} else if (fieldName == 'estimatedTaxProrations') {
						funcCall = this.onCallestimatedTaxProrations(fieldVal);
					} 

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
						},funcCall)
					} else {
						this.setState({
							[fieldName]: processedData,
						},funcCall)	
					}
				}	
			} else {
				this.setState({
					[fieldName]: '0.00',
				});
				this.state.countFunc++;
			}		
	}	
	
	// call function when any of the input field of calculator change
	updateFormField (fieldVal, fieldName) {
		if(this.state.count == 1) {
			fieldVal = this.removeCommas(fieldVal);
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
					},this.onChangeClosingCostFields)
				} else {
					this.setState({
						[fieldName]: processedData,
					},this.onChangeClosingCostFields)	
				}
		}  else {
			this.setState({
				[fieldName]: '0.00',
			});
			this.state.count++;

		}	 
	}
	
	// call function when any of the input field of calculator change
	updateFormFieldForOtherCostFields (fieldVal, fieldName, fieldNameFixed) {
		if(this.state.countForOther == 1) {
			fieldVal = this.removeCommas(fieldVal);
				if(fieldVal=='') {
					processedData = '0.00';
				} else {
					var value = parseFloat(fieldVal);
					value = value.toFixed(2);
					processedData = value;		
				}
				if(processedData == "" || processedData == "undefined" || processedData == "0.00" || processedData == undefined) {
					if(fieldNameFixed != 'undefined' || fieldNameFixed != undefined) {
						this.setState({
							[fieldName]: '0.00',
							[fieldNameFixed] : true
						},this.onChangeOtherCostFields)
					} else {
						this.setState({
							[fieldName]: '0.00',
						},this.onChangeOtherCostFields)	
					}	
				} else {
					if(fieldNameFixed != 'undefined' || fieldNameFixed != undefined) {
						this.setState({
							[fieldName]: processedData,
							[fieldNameFixed] : true
						},this.onChangeOtherCostFields)
					} else {
						this.setState({
							[fieldName]: processedData,
						},this.onChangeOtherCostFields)	
					}	
				}
		} else {
			this.setState({
				[fieldName]: '0.00',
			});
			this.state.countForOther++;
		}	
		
		

	}

	// call function when any of the input field of calculator change
	/*updateFormFieldForLoanTobePaid (fieldVal, fieldName) {
		if(this.state.countForLoan == 1) {
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
					},this.onCallLoanToBePaid)
				} else {
					this.setState({
						[fieldName]: processedData,
					},this.onCallLoanToBePaid)	
				}
			}
		} else {

			this.setState({
				[fieldName]: '0.00',
			});
			this.state.countForLoan++;
		}	
	}*/


	// call function when any of the input field of calculator change
	updateFormFieldForLoanTobePaid (fieldVal, fieldName) {
		if(this.state.countForLoan == 1) {
			fieldVal = this.removeCommas(fieldVal);
				if(fieldVal == '') {
					processedData = '0.00';
				} else {
					var value = parseFloat(fieldVal);
					value = value.toFixed(2);
					processedData = value;		
				}
				if(processedData == "" || processedData == "undefined" || processedData == "0.00" || processedData == undefined) {
					this.setState({
						[fieldName]: '0.00',
					},this.onCallLoanToBePaid)
				} else {
					if(fieldName == 'owner_carry_loan1'){
						amount = this.state.sale_pr * fieldVal/100;
						amount = parseFloat(amount).toFixed(2);
						this.setState({
							[fieldName]: processedData,
							owner_carry_loan_amount1: amount,
						},this.changeOwnerCarryLoanPer)	
					}else if(fieldName == 'owner_carry_loan2'){
						amount = this.state.sale_pr * fieldVal/100;
						amount = parseFloat(amount).toFixed(2);
						this.setState({
							[fieldName]: processedData,
							owner_carry_loan_amount2: amount,
						},this.changeOwnerCarryLoanPer)
					}else if(fieldName == 'owner_carry_loan_amount1'){
						//amount = this.state.sale_pr * fieldVal/100;
						owner_carry_loan1 = 100 * fieldVal/this.state.sale_pr;
						owner_carry_loan1 = parseFloat(owner_carry_loan1).toFixed(2);
						this.setState({
							[fieldName]: processedData,
							owner_carry_loan1: owner_carry_loan1,
						},this.changeOwnerCarryLoanPer)
					}else if(fieldName == 'owner_carry_loan_amount2'){
						//amount = this.state.sale_pr * fieldVal/100;
						owner_carry_loan2 = 100 * fieldVal/this.state.sale_pr;
						owner_carry_loan2 = parseFloat(owner_carry_loan2).toFixed(2);
						this.setState({
							[fieldName]: processedData,
							owner_carry_loan2: owner_carry_loan2,
						},this.changeOwnerCarryLoanPer)
					}
					
				}
		} else {
			this.setState({
				[fieldName]: '0.00',
			});
			this.state.countForLoan++;
		}	
	}
					
	changeOwnerCarryLoanPer(){
				if(this.state.firstLoanOwnerCarry == true){
					var owner_carry_loan_amount = parseFloat(this.state.owner_carry_loan_amount1);
				}
				if(this.state.secondLoanOwnerCarry == true){
					var owner_carry_loan_amount = parseFloat(this.state.owner_carry_loan_amount2);
				}
				var buyer_cash_dp = parseFloat(this.state.sale_pr) - owner_carry_loan_amount;
				
				var amount_left_to_pay_saller = buyer_cash_dp - parseFloat(this.state.existingTotal);
				var estimatedHUDNet =  amount_left_to_pay_saller - parseFloat(this.state.totalAllCost) - parseFloat(this.state.estimatedTaxProrations);
				var seller_carried_loan = (parseFloat(this.state.sale_pr)- buyer_cash_dp);    
				
				this.setState({
					sellerCarriedLoan: seller_carried_loan,
					estimatedSellerNet: parseFloat(estimatedHUDNet).toFixed(2)
				},this.onCallLoanToBePaid);	
	}
	
	// call when change value of input field of existingfirst, existingsecond, existingthird for loan amount change
	onCallLoanToBePaid() {	
		//alert("in oncallloantobeparid");
		let request     = {
			'existing_bal1'     : this.state.loansToBePaid_1Balance,
			'existing_rate1'    : this.state.loansToBePaid_1Rate,
			'existing_bal2'     : this.state.loansToBePaid_2Balance,
			'existing_rate2'    : this.state.loansToBePaid_2Rate,
			'existing_bal3'     : this.state.loansToBePaid_3Balance,
			'existing_rate3'    : this.state.loansToBePaid_3Rate,
			'days'              : this.state.settlementDate
		}
		response            = getSellerExistingBalanceCalculation(request);
		
		// change added by lovedeep as per discussion with vinod sir on 11-21-2018
		if(this.state.state_code == 'OR') {

			rec_fee = parseFloat(this.state.globalReconveynceFee);


			if (this.state.loansToBePaid_2Balance > 0) {
				rec_fee = rec_fee + 150;
			}
			if (this.state.loansToBePaid_3Balance > 0) {
				rec_fee = rec_fee + 150;
			}
			this.setState({reconveynceFee : parseFloat(rec_fee).toFixed(2)});
		} 


		this.setState({daysInterest: response.daysInterest,existingTotal: parseFloat(response.existingTotal).toFixed(2)}, this.totalCostDataUpdateFields);
	}
	
	// call when change value of input field of annual property tax
	onCallannualPropertyTax(refVal) {
	
		callPostApi(GLOBAL.BASE_URL + GLOBAL.seller_proration_setting, {
			"state_id": this.state.state
		}, this.state.access_token)
		.then((response) => {


			//alert(JSON.stringify(result));

			monthNames = [ "", "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec" ]; 
			var split = this.state.date.split('-');

			//var split = date.split('-');
			//date = this.state.date;
			//var split = date.split('-');
			date = Number(split[0])+'/'+Number(split[1])+'/'+Number(split[2]);
		//	monthNameForProration = monthNames[Number(split[0])];
	
			prorationAmt = this.state.proration;

			//this.state.settlementMonth = parseInt(split[0]); 
			
			/*if(this.state.settlementMonth == '1'){
				this.setState({
					proration : result.data.jan
				});
			}
			if(this.state.settlementMonth == '2'){
				this.setState({
					proration : result.data.feb
				});
			}
			if(this.state.settlementMonth == '3'){
				this.setState({
					proration : result.data.mar
				});
			}
			if(this.state.settlementMonth == '4'){
					this.setState({
					proration : result.data.apr
				});
			}
			if(this.state.settlementMonth == '5'){
					this.setState({
					proration : result.data.may
				});
			}
			if(this.state.settlementMonth == '6'){
					this.setState({
					proration : result.data.jun
				});
			}
			if(this.state.settlementMonth == '7'){
					this.setState({
					proration : result.data.jul
				});
			}
			if(this.state.settlementMonth == '8'){
					this.setState({
					proration : result.data.aug
				});
			}
			if(this.state.settlementMonth == '9'){
					this.setState({
					proration : result.data.sep
				});
			}
			if(this.state.settlementMonth == '10'){
					this.setState({
					proration : result.data.oct
				});
			}
			if(this.state.settlementMonth == '11'){
					this.setState({
					proration : result.data.nov
				});
			}
			if(this.state.settlementMonth == '12'){
					this.setState({
					proration : result.data.dec
				});
			}*/

		/**==== New Code added By Lovedeep **/
		// Special case for LUCAS county, OHIO state
		if(this.state.county == '2090') {
			if(this.state.summerPropertyTax > 0 && this.state.winterPropertyTax > 0) {
				Alert.alert('CostsFirst', 'Only one box can be used');
				this.setState({
					winterPropertyTax : '0.00'
				});
			} else {
				request         = {'summerPropertyTax': this.state.summerPropertyTax, 'winterPropertyTax': this.state.winterPropertyTax, 'prorationPercent': this.state.prorationPercent, 'annualPropertyTax': this.state.annualPropertyTax, 'proration': prorationAmt, 'closing_date':  date, 'state_code': this.state.state_code, 'state_id' : this.state.state, 'county_id' : this.state.county, 'city': this.state.city};
				//alert(JSON.stringify(request));
				data = getSellerEstimatedTax(request);
				this.setState({estimatedTaxProrations: data.estimatedTax},this.totalCostDataUpdateFields);
			}
		} else {
			let request         = {'summerPropertyTax': this.state.summerPropertyTax, 'winterPropertyTax': this.state.winterPropertyTax, 'prorationPercent': this.state.prorationPercent, 'annualPropertyTax': this.state.annualPropertyTax, 'proration': prorationAmt, 'closing_date':  date, 'state_code': this.state.state_code, 'state_id' : this.state.state, 'county_id' : this.state.county, 'city': this.state.city};
			//let request 		= {'annualPropertyTax': this.state.annualPropertyTax, 'proration': this.state.proration, 'date': this.state.settlementDate, 'month' : this.state.settlementMonth, 'state_code': this.state.state_code};
			let responsePro 				= getSellerEstimatedTax( request );
			//alert(JSON.stringify(responsePro));
			this.setState({
				estimatedTaxProrations : responsePro.estimatedTax
			}, this.totalCostDataUpdateFields);
		}	
		});
	}
	
	onCallestimatedTaxProrations(refVal) {
			this.setState({
				estimatedTaxProrations : refVal
			}, this.totalCostDataUpdateFields);
	}
	
	// change value of input field of discount
	onCallDiscount(fieldVal) {
		discText = fieldVal;
		let request 		= {'discountPerc': discText,'amount': this.state.amount};
		let response 				= getSellerDiscountAmount(request);
		this.setState({disc: discText,otherCostsDiscount2: parseFloat(response.discount).toFixed(2)}, this.onChangeClosingCostFields);

		this.state.totalOtherCost = parseFloat(response.discount) + parseFloat(this.state.processingfee) + parseFloat(this.state.taxservicecontract) + parseFloat(this.state.documentprep) + parseFloat(this.state.underwriting) + parseFloat(this.state.appraisalfee) + parseFloat(this.state.correctivework) + parseFloat(this.state.buyersfee);
		res = getUptoTwoDecimalPoint(this.state.totalOtherCost);
		this.state.totalOtherCost = res.val;
		this.state.totalAllCost = parseFloat(this.state.totalClosingCost) + parseFloat(this.state.totalOtherCost);	
	}

	// call when any of closing fields are change except lender fee, owner fee, escrow fee
	onChangeClosingCostFields() {
			this.totalCostDataUpdateFields();
	}
	
	// call when any of closing fields are change except discount
	onChangeOtherCostFields() {	
			this.totalCostDataUpdateFields();
	}
	
	// call when conventional field change
	onChangeConventionalField(fieldVal, fieldName) {
		fieldVal = this.removeCommas(fieldVal);
		if(this.state.defaultVal != fieldVal){
			this.setState({animating:'true'});
			if(fieldVal=='') {
				processedData = '0.00';
			} else {
				var value = parseFloat(fieldVal);
				value = value.toFixed(2);
				processedData = value;		
			}
			this.setState({
				[fieldName]: processedData,
			}, this.callConvSettingData)
		}	
	}
	
	// call when value of prepared for change
	onCallPreparedForField(fieldVal, fieldName) {
		
	

		if(this.state.defaultVal != fieldVal){

			if(fieldName == 'preparedFor') {
				if(fieldVal == '') {
					processedData = 'New Client';
				} else {
					processedData = fieldVal;
				}
			} else {
				if(fieldVal == '') {
					processedData = '';
				} else {
					processedData = fieldVal;
				}
			}	


			this.setState({
				[fieldName]: processedData,
			})		
		}		
	}

	onCallCamelAgtFields() {
		// requesting agrigate list and sell values
		
		let requestAgt        = {
			'brokageFee': this.state.SCC_Brokage_Fee,
            'sellAgt'   : this.state.sellAgt,
            'listAgt'   : this.state.listAgt,
			'salePrice' : this.state.sale_pr,
			'state'     : this.state.state_code,
			'commisionOption' : this.state.commisionOption,
			'countyId'		: this.state.county	
        }




		let responseAgt        = getSellerListSellAgtValues(requestAgt);


		/**=================== Start Special case for New Maxico County   =====================**/

		if(this.state.state_code == 'NM'){
            let request = {
                'totalAgt': responseAgt.totalAgt,
                'countyId': this.state.county,
                'stateId': this.state.state,
                'zipCode': this.state.postal_code
			}
            let response = getGrossCommissionsVal(request);
			this.setState({
				fee8 : response.commissionsTax
			});
			//this.state.fee8 = response.commissionsTax;
		}
		
		/**=================== End Special case for New Maxico County   =====================**/
		

		this.setState({list_agt: responseAgt.list_agt,sell_agt: responseAgt.sell_agt,totalAgt: responseAgt.totalAgt}, this.totalCostDataUpdateFields);
	}

	onCallagtFields() {	
		// requesting agrigate list and sell values
		let requestAgt = {
			'list_agt': this.state.list_agt,
			'sell_agt': this.state.sell_agt,
			'salePrice': this.state.sale_pr,
			'brokageFee': this.state.SCC_Brokage_Fee,
			'state': this.state.state_code
		}
		let responseAgt        = getSellerListSellAgtPer(requestAgt);


		/**=================== Start Special case for New Maxico County   =====================**/

		if(this.state.state_code == 'NM'){
			let request = {
				'totalAgt': responseAgt.totalAgt,
				'countyId': this.state.county,
				'stateId': this.state.state,
				'zipCode': this.state.postal_code
			}
			let response = getGrossCommissionsVal(request);
			this.setState({
				fee8 : response.commissionsTax
			});
			//this.state.fee8 = response.commissionsTax;
		}
		
		/**=================== End Special case for New Maxico County   =====================**/
	


		this.setState({listAgt : responseAgt.listAgt, sellAgt : responseAgt.sellAgt, totalAgt : responseAgt.totalAgt}, this.totalCostDataUpdateFields);		
	}

	totalCostDataUpdateFields() {
		if(this.state.originationFee == '') {
			originationFee = 0.00;
		} else {
			originationFee = this.state.originationFee;
		}

		totalCostData = parseFloat(this.state.drawingDeed) + parseFloat(this.state.notary) + parseFloat(this.state.transferTax) + parseFloat(this.state.pestControlReport) + parseFloat(this.state.benifDemandStatement) + parseFloat(this.state.reconveynceFee) + parseFloat(this.state.totalAgt) + parseFloat(this.state.daysInterest) + parseFloat(this.state.prepaymentPenality) + parseFloat(this.state.fee1) + parseFloat(this.state.fee2) + parseFloat(this.state.fee3) + parseFloat(this.state.fee4) + parseFloat(this.state.fee5) + parseFloat(this.state.fee6) + parseFloat(this.state.fee7) + parseFloat(this.state.fee8) + parseFloat(this.state.fee9) + parseFloat(this.state.fee10) + parseFloat(this.state.escrowFee) + parseFloat(this.state.ownerFee) + parseFloat(this.state.lenderFee);

		rsp = getUptoTwoDecimalPoint(totalCostData);
		this.setState({totalClosingCost: rsp.val});
		
		totalOtherCost = parseFloat(this.state.otherCostsDiscount2) + parseFloat(this.state.processingfee) + parseFloat(this.state.taxservicecontract) + parseFloat(this.state.documentprep) + parseFloat(this.state.underwriting) + parseFloat(this.state.appraisalfee) + parseFloat(this.state.correctivework) + parseFloat(this.state.buyersfee);
		
		res = getUptoTwoDecimalPoint(totalOtherCost);
		this.setState({totalOtherCost: res.val});		
		
		this.state.totalAllCost = parseFloat(totalCostData) + parseFloat(totalOtherCost);
		resp = getUptoTwoDecimalPoint(this.state.totalAllCost);
		this.state.totalAllCost = resp.val;	
	
		SellerNet = parseFloat(this.state.sale_pr) - parseFloat(this.state.existingTotal) - parseFloat(this.state.totalAllCost) - parseFloat(this.state.estimatedTaxProrations);
		
		response = getUptoTwoDecimalPoint(SellerNet);
		this.state.estimatedSellerNet = response.val;
		
		if(this.state.firstLoanOwnerCarry == true || this.state.secondLoanOwnerCarry == true){
			
				if(this.state.firstLoanOwnerCarry == true){
					amount = this.state.sale_pr * this.state.owner_carry_loan1/100;
					amount = parseFloat(amount).toFixed(2);
					var owner_carry_loan_amount = parseFloat(amount);
					this.state.owner_carry_loan_amount1 = owner_carry_loan_amount;
				}
				if(this.state.secondLoanOwnerCarry == true){
					amount = this.state.sale_pr * this.state.owner_carry_loan2/100;
					amount = parseFloat(amount).toFixed(2);
					var owner_carry_loan_amount = parseFloat(amount);
					this.state.owner_carry_loan_amount2 = owner_carry_loan_amount;
				}
				var buyer_cash_dp = parseFloat(this.state.sale_pr) - owner_carry_loan_amount;
				
				var amount_left_to_pay_saller = buyer_cash_dp - parseFloat(this.state.existingTotal);
				var estimatedHUDNet =  amount_left_to_pay_saller - parseFloat(this.state.totalAllCost) - parseFloat(this.state.estimatedTaxProrations);
				var seller_carried_loan = (parseFloat(this.state.sale_pr)- buyer_cash_dp);    
				
				this.setState({
					sellerCarriedLoan: seller_carried_loan,
					estimatedSellerNet: parseFloat(estimatedHUDNet).toFixed(2),
					estimatedSellerNetCopy: response.val
				});	
				this.state.estimatedSellerNet = parseFloat(estimatedHUDNet).toFixed(2);
			
		}
		
		
		this.setState({animating:'false'});

		this.state.textMsgPdfArray = {
			"Prepared_For"         : this.state.preparedFor,
			"address"              : this.state.lender_address,
			"salesPrice"           : this.state.sale_pr,
			"estClosingDate"       : this.state.date,
			"closingCost"          : rsp.val,
			"balanceOfAllLoans"    : this.state.existingTotal,
			"totalOtherCost"       : this.state.totalOtherCost,
			"estimatedTaxProration": this.state.estimatedTaxProrations,
			"totalAllCost"         : this.state.totalAllCost,
			"estimatedSellerNet"   : this.state.estimatedSellerNet,
			"userId"               : this.state.user_id,
			"companyId"            : this.state.company_id,
			"city"                 : this.state.city,
			"state"                : this.state.state_name, 
			"zip"                  : this.state.postal_code,
			"buyerLoanType"        : this.state.tab,
			"caltype" : "seller"
		}
	}
	
	// onBlur function is used to set value like 100.00 if user entered 100. Also this function is taking care of the scenario in which if user left input field blank, then default value will be set i.e 0.00 . text in this case is a ref value to detect on which field you have clicked on. for example :- salesPrice is a reference to sale price input field. toFixed function is used to convert 100.022222 to 100.02
	
	onBlur(text) {
		/*if(this.state.isFocus == true) {
			this.state.count = 0;
		}*/

		if(text == 'salesPrice' && this.state.defaultVal != this.state.sale_pr) {
			if(this.state.sale_pr == '' || this.state.sale_pr == '0.00') {
				this.setState({
					sale_pr : '0.00'
				});

			} else {

				if(this.state.isCheckForOhio == true) {
					if(this.state.reissueSalePrice != '0.00' && this.state.reissueSalePrice != '') {
					this.setState({
						loadingText : 'Calculating...'
					});

					callPostApi(GLOBAL.BASE_URL + GLOBAL.get_city_state_for_zip, {
						"zip": this.state.postal_code
					
						},this.state.access_token)
						.then((response) => {

							zipRes = result;
							if(zipRes.status == 'fail') {
								this.dropdown.alertWithType('error', 'Error', zipRes.message);
								this.setState({animating:'false'});
							} else {

								if(zipRes.data.state_name != null || zipRes.data.state_name != 'NULL') {
									this.state.user_county = zipRes.data.county_name;
									this.setState({
										city: zipRes.data.city,
										state: zipRes.data.state_id,
										user_state: zipRes.data.state_code,
										user_county: zipRes.data.county_name,
										county: zipRes.data.county_id,
									});		
									
									callPostApi(GLOBAL.BASE_URL + GLOBAL.title_escrow_type, {
										"companyId": zipRes.data.company_id
										}, this.state.access_token)
										.then((response) => {
											this.setState({
												ownerType: result.data.ownerType,
												escrowType: result.data.escrowType,
												lenderType: result.data.lenderType,
			
											});	
										});
									
									this.setState({animating:'true'});
									if(this.state.sale_pr == '') {
										newText = '0.00';
									} else {

										//alert(this.refs.salesPrice._lastNativeText);

										newText = this.state.sale_pr;
										//newText = newText.replace(/\D/g,'');
										val = newText.replace(/[^0-9\.]/g,'');
										if(val.split('.').length>2) {
										val =val.replace(/\.+$/,"");
										}
										newText = val;
									}
									
									// code commented by lovedeep on 09-03-2018 as per discussion with atul sir as trnasfer tax value not matched with live
									/*this.state.transferTax   = this.state.transferTaxPer * newText / 1000;
									this.state.transferTax   = this.state.transferTax.toFixed(2);*/

									let requestTransferTax          = { 'transferTaxRate' : this.state.transferTaxPer,'salesprice' : newText, 'state': this.state.user_state, 'countyId': this.state.county };
									let responseTransferTax         = getTransferTax(requestTransferTax);
									//alert(JSON.stringify(responseTransferTax));
									this.state.transferTax = responseTransferTax.transferTax;
							


									//set LTV after entering the sales price
									if(this.state.tab == 'CONV' || this.state.tab=="Owner_Carry"){
										tab = this.callConvSettingData;
									}else if(this.state.tab == 'FHA'){
										tab = this.callFHAsettinsapi;
									}else if(this.state.tab == 'VA'){
										tab = this.callVAsettinsapi;
									}else if(this.state.tab == 'USDA'){
										tab = this.callUSDAsettinsapi;
									}else if(this.state.tab == 'CASH'){
										tab = this.callCASHsettinsapi();
									}
									
									//commented by lovedeep as it is not required for now
									/*if(newText <= this.state.FHA_SalePriceUnder){
										LTV = this.state.FHA_SalePriceUnderLTV;			
									} else if (newText > this.state.FHA_SalePriceUnder && newText <= this.state.FHA_SalePriceTo){
										LTV = this.state.FHA_SalePriceToLTV;			
									} else if (newText > this.state.FHA_SalePriceOver){
										LTV = this.state.FHA_SalePriceOverLTV;
									}*/
										

				/**========================== Start Special case for Texas state ===========================**/

						if (this.state.sale_pr > 0) {

							var countyCheck = this.inArray(this.state.county, texas_Hexter_Fair_counties_Arr);

							//let countyCheck = texas_Hexter_Fair_counties_Arr.indexOf(this.state.county);
								if(countyCheck != false){
									annualPropertyTax = (this.state.sale_pr * 3) / 100;
									this.setState({
										annualPropertyTax : annualPropertyTax,
										isCheckForFlorida : true
									}, this.onCallannualPropertyTax);
								}
						}

					/**========================== End Special case for Texas state ===========================**/

									if(this.state.state_code == 'OH') {
										if(this.state.commisionOption == 'traditional') {
											callPostApi(GLOBAL.BASE_URL + GLOBAL.Seller_Cost_Setting, {
												user_id: this.state.user_id,company_id: this.state.company_id, zip: this.state.postal_code
												}, this.state.access_token)
												.then((response) => {
													
													/**============ Start Special Case For Ohio ================**/
													SCC_Brokage_Fee                 = result.data.userSetting.brokerageFeeofSalePrice;                
														// requesting agrigate list and sell values
														let requestAgt        = {
															'SCC_Brokage_Fee'        : SCC_Brokage_Fee
														}
														let responseAgt        = getSellerListSellAgt(requestAgt);
															let requestAgtNew        = {
																'brokageFee': SCC_Brokage_Fee,
																'sellAgt'   : responseAgt.sellAgt,
																'listAgt'   : responseAgt.listAgt,
																'salePrice' : this.state.sale_pr,
																'state'     : this.state.state_code,
																'commisionOption' : this.state.commisionOption,
															}

															let respAgt        = getSellerListSellAgtValues(requestAgtNew);
															this.setState({sale_pr: parseFloat(newText).toFixed(2),list_agt: respAgt.list_agt,sell_agt: respAgt.sell_agt,totalAgt: respAgt.totalAgt, sellAgt : responseAgt.sellAgt, listAgt : responseAgt.listAgt},tab);

													/**============ Start Special Case For Ohio ================**/	
									
												});
										} else {
											/**====== Code added by lovedeep as per discussion with atul sir */
											let firstTierCommission = 0.00;
											let secondTierCommission = 0.00;
											let secondBalance=0;
											let thirdTierCommission=0.00
											let firstBalance = 0;
											if(this.state.sale_pr > parseFloat('100000')){
												firstTierCommission = (parseFloat('100000') * this.state.first_one_lakh_rate) / 100; // First Tier Commission
												
												firstBalance = this.state.sale_pr - parseFloat('100000');
												if((this.state.balance1_to - parseFloat('100000.01')) < firstBalance){  // Second Tier Commission
													secondTierCommission = ((this.state.balance1_to - parseFloat('100000.01')) * this.state.balance1_rate) / 100;
													secondBalance = this.state.sale_pr - this.state.balance1_to;
													if(secondBalance > 0){  // Third Tier Commission
														thirdTierCommission = (secondBalance * this.state.balance2_rate) / 100;
													}
												} else {
													secondTierCommission = (firstBalance * this.state.balance1_rate) / 100;
												}		
											} else {
												firstTierCommission = (this.state.sale_pr * this.state.first_one_lakh_rate) / 100; // First Tier Commission		
											}
											this.state.SCC_Brokage_Fee = firstTierCommission + secondTierCommission + thirdTierCommission;
											/**====== Code commented by lovedeep as per discussion with atul sir */
											/*if(this.state.sale_pr <= parseFloat('100000')){
												this.state.SCC_Brokage_Fee = this.state.first_one_lakh_rate;
											} else if(this.state.sale_pr > parseFloat('100000') || this.state.sale_pr <= this.state.balance1_to){
												this.state.SCC_Brokage_Fee = this.state.balance1_rate;
											} else if(this.state.sale_pr >= this.state.balance2_from || this.state.sale_pr <= this.state.balance2_to){
												this.state.SCC_Brokage_Fee = this.state.balance2_rate;
											}*/
											let requestAgt        = {
												'brokageFee': this.state.SCC_Brokage_Fee,
												'sellAgt'   : this.state.sellAgt,
												'listAgt'   : this.state.listAgt,
												'salePrice' : this.state.sale_pr,
												'state'     : this.state.state_code
											}
											let responseAgt        = getSellerListSellTeired(requestAgt);
											var fg = {sale_pr: parseFloat(newText).toFixed(2),list_agt: responseAgt.list_agt,sell_agt: responseAgt.sell_agt,totalAgt: responseAgt.totalAgt};	
											this.setState({sale_pr: parseFloat(newText).toFixed(2),list_agt: responseAgt.list_agt,sell_agt: responseAgt.sell_agt,totalAgt: responseAgt.totalAgt},tab);
										}
									} else {
										let requestAgt        = {
											'brokageFee': this.state.SCC_Brokage_Fee,
											'sellAgt'   : this.state.sellAgt,
											'listAgt'   : this.state.listAgt,
											'salePrice' : this.state.sale_pr,
											'state'     : this.state.state_code,
											'commisionOption' : this.state.commisionOption,
										}
										let responseAgt        = getSellerListSellAgtValues(requestAgt);
										this.setState({sale_pr: parseFloat(newText).toFixed(2),list_agt: responseAgt.list_agt,sell_agt: responseAgt.sell_agt,totalAgt: responseAgt.totalAgt},tab); 
									}
									
									/*for (let resObj of result.data.userSettingCost) {
										const update = {};
										req         = {'amount': amt,'salePrice': this.state.sale_pr_calc,'type': resObj.type,'rate':resObj.fee};
										
										var data = getCostTypeTotal(req);
										feeval = data.totalCostRate;
										update['label' + i] = resObj.label;
										update['fee' + i] = feeval;
										update['type' + i] = resObj.type;
										update['totalfee' + i] = resObj.fee;
										costRequest['cost' + i] = resObj.fee;
										this.setState(update);
										i++;
									}*/
								}
							} 
						});	
					} else {
						this.dropdown.alertWithType('error', 'Error', 'Prior Liability Amount must be entered');
						this.setState({animating:'false'});
					}
				}	
				 else {
					this.setState({
						loadingText : 'Calculating...'
					});

					callPostApi(GLOBAL.BASE_URL + GLOBAL.get_city_state_for_zip, {
						"zip": this.state.postal_code
					
						},this.state.access_token)
						.then((response) => {

							zipRes = result;
							if(zipRes.status == 'fail') {
								this.dropdown.alertWithType('error', 'Error', zipRes.message);
								this.setState({animating:'false'});
							} else {

								if(zipRes.data.state_name != null || zipRes.data.state_name != 'NULL') {
									this.state.user_county = zipRes.data.county_name;
									this.setState({
										city: zipRes.data.city,
										state: zipRes.data.state_id,
										user_state: zipRes.data.state_code,
										user_county: zipRes.data.county_name,
										county: zipRes.data.county_id,
									});		
									
									callPostApi(GLOBAL.BASE_URL + GLOBAL.title_escrow_type, {
										"companyId": zipRes.data.company_id
										}, this.state.access_token)
										.then((response) => {
											
											this.setState({
												ownerType: result.data.ownerType,
												escrowType: result.data.escrowType,
												lenderType: result.data.lenderType,
			
											});	
										});
									
									this.setState({animating:'true'});
									if(this.state.sale_pr == '') {
										newText = '0.00';
									} else {

										//alert(this.refs.salesPrice._lastNativeText);

										newText = this.state.sale_pr;
										//newText = newText.replace(/\D/g,'');
										val = newText.replace(/[^0-9\.]/g,'');
										if(val.split('.').length>2) {
										val =val.replace(/\.+$/,"");
										}
										newText = val;
									}
									
									// code commented by lovedeep on 09-03-2018 as per discussion with atul sir as trnasfer tax value not matched with live
									/*this.state.transferTax   = this.state.transferTaxPer * newText / 1000;
									this.state.transferTax   = this.state.transferTax.toFixed(2);*/

									let requestTransferTax          = { 'transferTaxRate' : this.state.transferTaxPer,'salesprice' : newText, 'state': this.state.user_state, 'countyId': this.state.county };
									let responseTransferTax         = getTransferTax(requestTransferTax);
									//alert(JSON.stringify(responseTransferTax));
									this.state.transferTax = responseTransferTax.transferTax;
							


									//set LTV after entering the sales price
									if(this.state.tab == 'CONV' || this.state.tab=="Owner_Carry"){
										tab = this.callConvSettingData;
									}else if(this.state.tab == 'FHA'){
										tab = this.callFHAsettinsapi;
									}else if(this.state.tab == 'VA'){
										tab = this.callVAsettinsapi;
									}else if(this.state.tab == 'USDA'){
										tab = this.callUSDAsettinsapi;
									}else if(this.state.tab == 'CASH'){
										tab = this.callCASHsettinsapi();
									}
									
									//commented by lovedeep as it is not required for now
									/*if(newText <= this.state.FHA_SalePriceUnder){
										LTV = this.state.FHA_SalePriceUnderLTV;			
									} else if (newText > this.state.FHA_SalePriceUnder && newText <= this.state.FHA_SalePriceTo){
										LTV = this.state.FHA_SalePriceToLTV;			
									} else if (newText > this.state.FHA_SalePriceOver){
										LTV = this.state.FHA_SalePriceOverLTV;
									}*/
										

				/**========================== Start Special case for Texas state ===========================**/

						if (this.state.sale_pr > 0) {

							var countyCheck = this.inArray(this.state.county, texas_Hexter_Fair_counties_Arr);


							//let countyCheck = texas_Hexter_Fair_counties_Arr.indexOf(this.state.county);
			
								if(countyCheck != false){
									annualPropertyTax = (this.state.sale_pr * 3) / 100;
									this.setState({
										annualPropertyTax : annualPropertyTax,
										isCheckForFlorida : true
									}, this.onCallannualPropertyTax);
								}
						}

					/**========================== End Special case for Texas state ===========================**/

									if(this.state.state_code == 'OH') {
										if(this.state.commisionOption == 'traditional') {
											callPostApi(GLOBAL.BASE_URL + GLOBAL.Seller_Cost_Setting, {
												user_id: this.state.user_id,company_id: this.state.company_id, zip: this.state.postal_code
												}, this.state.access_token)
												.then((response) => {
													
													/**============ Start Special Case For Ohio ================**/
													SCC_Brokage_Fee                 = result.data.userSetting.brokerageFeeofSalePrice;                
														// requesting agrigate list and sell values
														let requestAgt        = {
															'SCC_Brokage_Fee'        : SCC_Brokage_Fee
														}
														let responseAgt        = getSellerListSellAgt(requestAgt);
															let requestAgtNew        = {
																'brokageFee': SCC_Brokage_Fee,
																'sellAgt'   : responseAgt.sellAgt,
																'listAgt'   : responseAgt.listAgt,
																'salePrice' : this.state.sale_pr,
																'state'     : this.state.state_code,
																'commisionOption' : this.state.commisionOption,
															}

															let respAgt        = getSellerListSellAgtValues(requestAgtNew);

															this.setState({sale_pr: parseFloat(newText).toFixed(2),list_agt: respAgt.list_agt,sell_agt: respAgt.sell_agt,totalAgt: respAgt.totalAgt, sellAgt : responseAgt.sellAgt, listAgt : responseAgt.listAgt},tab);

													/**============ Start Special Case For Ohio ================**/	
									
												});
										} else {
											/**====== Code added by lovedeep as per discussion with atul sir */

											let firstTierCommission = 0.00;
											let secondTierCommission = 0.00;
											let secondBalance=0;
											let thirdTierCommission=0.00
											let firstBalance = 0;
											if(this.state.sale_pr > parseFloat('100000')){
												firstTierCommission = (parseFloat('100000') * this.state.first_one_lakh_rate) / 100; // First Tier Commission
												
												firstBalance = this.state.sale_pr - parseFloat('100000');
												if((this.state.balance1_to - parseFloat('100000.01')) < firstBalance){  // Second Tier Commission
													secondTierCommission = ((this.state.balance1_to - parseFloat('100000.01')) * this.state.balance1_rate) / 100;
													secondBalance = this.state.sale_pr - this.state.balance1_to;
													if(secondBalance > 0){  // Third Tier Commission
														thirdTierCommission = (secondBalance * this.state.balance2_rate) / 100;
													}
												} else {
													secondTierCommission = (firstBalance * this.state.balance1_rate) / 100;
												}		
											} else {
												firstTierCommission = (this.state.sale_pr * this.state.first_one_lakh_rate) / 100; // First Tier Commission		
											}
											this.state.SCC_Brokage_Fee = firstTierCommission + secondTierCommission + thirdTierCommission;
										
											/**====== Code commented by lovedeep as per discussion with atul sir */
											/*if(this.state.sale_pr <= parseFloat('100000')){
												this.state.SCC_Brokage_Fee = this.state.first_one_lakh_rate;
											} else if(this.state.sale_pr > parseFloat('100000') || this.state.sale_pr <= this.state.balance1_to){
												this.state.SCC_Brokage_Fee = this.state.balance1_rate;
											} else if(this.state.sale_pr >= this.state.balance2_from || this.state.sale_pr <= this.state.balance2_to){
												this.state.SCC_Brokage_Fee = this.state.balance2_rate;
											}*/
											let requestAgt        = {
												'brokageFee': this.state.SCC_Brokage_Fee,
												'sellAgt'   : this.state.sellAgt,
												'listAgt'   : this.state.listAgt,
												'salePrice' : this.state.sale_pr,
												'state'     : this.state.state_code
											}
		
											let responseAgt        = getSellerListSellTeired(requestAgt);
			
											var fg = {sale_pr: parseFloat(newText).toFixed(2),list_agt: responseAgt.list_agt,sell_agt: responseAgt.sell_agt,totalAgt: responseAgt.totalAgt};	

											this.setState({sale_pr: parseFloat(newText).toFixed(2),list_agt: responseAgt.list_agt,sell_agt: responseAgt.sell_agt,totalAgt: responseAgt.totalAgt},tab);
										}
									} else {
										let requestAgt        = {
											'brokageFee': this.state.SCC_Brokage_Fee,
											'sellAgt'   : this.state.sellAgt,
											'listAgt'   : this.state.listAgt,
											'salePrice' : this.state.sale_pr,
											'state'     : this.state.state_code,
											'commisionOption' : this.state.commisionOption,
										}
										let responseAgt        = getSellerListSellAgtValues(requestAgt);
										this.setState({sale_pr: parseFloat(newText).toFixed(2),list_agt: responseAgt.list_agt,sell_agt: responseAgt.sell_agt,totalAgt: responseAgt.totalAgt},tab); 
									}
									
									/*for (let resObj of result.data.userSettingCost) {
										const update = {};
										req         = {'amount': amt,'salePrice': this.state.sale_pr_calc,'type': resObj.type,'rate':resObj.fee};
										
										var data = getCostTypeTotal(req);
										feeval = data.totalCostRate;
										update['label' + i] = resObj.label;
										update['fee' + i] = feeval;
										update['type' + i] = resObj.type;
										update['totalfee' + i] = resObj.fee;
										costRequest['cost' + i] = resObj.fee;
										this.setState(update);
										i++;
									}*/
								}
							} 
						});
				}
					
			}

			/*if(this.state.sale_pr != '') {
				var value = parseFloat(this.state.sale_pr);
				value = value.toFixed(2);
				this.setState({
					sale_pr : value
				});
			}*/	
		} 

	}

	inArray(searchstr,refarr){

		var count=refarr.length;
		for(var i=0;i<count;i++)
		{
			if(refarr[i]==searchstr){
				return true;
			}
		}
		return false;
		/*for (key in refarr) {         
			if (refarr[key].hasOwnProperty(searchstr)){
				return refarr[key][searchstr];
			}     
		}*/
	}
	
	// onDateChangeVal function call when you change date from datepicker. After you select any date value of settlementdate which is shown under Closing Cost section before days interest will be updated
	
	onDateChangeVal(dateval) {
		var days = String(dateval).split('-');
		days = parseInt(days[1]);
		if(days != '') {
			this.setState({
				settlementDate : days 
			});	
		}		
		let request     = {
			'existing_bal1'     : this.state.loansToBePaid_1Balance,
			'existing_rate1'    : this.state.loansToBePaid_1Rate,
			'existing_bal2'     : this.state.loansToBePaid_2Balance,
			'existing_rate2'    : this.state.loansToBePaid_2Rate,
			'existing_bal3'     : this.state.loansToBePaid_3Balance,
			'existing_rate3'    : this.state.loansToBePaid_3Rate,
			'days'              : this.state.settlementDate
		}
		response            = getSellerExistingBalanceCalculation(request);
		this.setState({daysInterest: response.daysInterest,existingTotal: parseFloat(response.existingTotal).toFixed(2)}, this.onCallannualPropertyTax(this.state.annualPropertyTax));
			
	}
	
	// onActionSelected function is called when click on breadcrumb on top right of the seller calculator page
	
	onActionSelected(position) {	
		if(this.state.dropValues == "OPEN") {
			this.setModalVisible(true);
			this.setState({
				dropValues : ""
			});
		}else if(this.state.dropValues == "SAVE") {
			if(this.state.sale_pr == "" || this.state.sale_pr == '0.00'){
				this.dropdown.alertWithType('error', 'Error', 'Please enter sales price');
			}else{
				this.saveSellerCalculatorDetailsApi();
			}
			this.setState({
				dropValues : ""
			});
		} else if(this.state.dropValues == "PRINT") {
			this.setState({popupType: "print"},this.popupShow);
			this.setState({
				dropValues : ""
			});
		} else if (this.state.dropValues == "MESSAGE") {
			if (this.state.sale_pr == "" || this.state.sale_pr == '0.00') {
				this.dropdown.alertWithType('error', 'Error', 'Please enter sales price.');
			} else {
				this.setState({
					openMessagePopup: true
				});
			}
		} else if(this.state.dropValues == "EMAIL") {
			if(this.state.sale_pr == "" || this.state.sale_pr == "0.00"){
				if(this.state.multipleOfferStatus == true) {
					this.setState({popupType: "email"},this.popupShow);
				} else {
					this.dropdown.alertWithType('error', 'Error', 'Please enter sales price');

				}	
			
			}else{
				//this.props.navigator.push({name: 'GoogleSigninExample', index: 0 });
				this.setState({popupType: "email"},this.popupShow);
				//this.onCallFunctionVerifyToken();
			}
			this.setState({
				dropValues : ""
			});
		}/*  else if (position == 'GOOGLE') {
			this.props.navigator.push({name: 'GoogleSigninExample', index: 0 });
		} */
		
		else if(position == "msg_tab") {
			ImagePicker.openPicker({
			  width: 300,
			  height: 400,
			  cropping: true
			}).then(image => {
				this.popupDialog.dismiss();
                this.popupDialogEmail.dismiss();
				imagepath = image.path;
				imagename = imagepath.substring(imagepath.lastIndexOf('/')+1);	
				this.setState({imageData: image}, this.imageSuccess);				
			
				let formData = new FormData();
				formData.append("image", {
					name: imagename,
					uri: imagepath,
					type: image.mime
				 });
				 formData.append("userId", this.state.user_id);
	
				fetch(GLOBAL.BASE_URL + GLOBAL.Upload_Image_Email,{
					method: 'POST',
					headers: {
						'Content-Type': 'multipart/form-data'
					  },
				body: formData
				})
				.then((response) => response.json())
				.then(response => {
					Alert.alert('', 'Image uploaded successfully!');
					this.setState({
						imageNameEmail : response.data
					});
					//{"message":"Image Uploaded","status":"success","data":"1523438245.jpg"}
					//alert(JSON.stringify(response));
				}).catch(err => {
					Alert.alert('', 'Error occured, please try again later.');
				})
				
			});
			
			//this.setState({popupType: "msg_tab"},this.popupShow);
		} else if(position == "msg_tab_cam") {
			ImagePicker.openCamera({
			  width: 300,
			  height: 400,
			  cropping: true
			}).then(image => {

				this.popupDialog.dismiss();
                this.popupDialogEmail.dismiss();
				this.setState({imageData: image}, this.imageSuccess);
					//let photo = { uri: source.uri}
					imagepath = image.path;
					imagename = imagepath.substring(imagepath.lastIndexOf('/')+1);	
					this.setState({imageData: image}, this.imageSuccess);				
				
					let formData = new FormData();
					formData.append("image", {
						name: imagename,
						uri: imagepath,
						type: image.mime
					 });
					 
					 formData.append("userId", this.state.user_id);
		
					fetch(GLOBAL.BASE_URL + GLOBAL.Upload_Image_Email,{
						method: 'POST',
						headers: {
							'Content-Type': 'multipart/form-data'
						  },
					body: formData
					})
					.then((response) => response.json())
					.then(response => {
						Alert.alert('', 'Image uploaded successfully!');
						this.setState({
							imageNameEmail : response.data
						});
					}).catch(err => {
						Alert.alert('', 'Error occured, please try again later.');
					})	
			});
		}
	}

	/*onCallFunctionVerifyToken() {
	}*/
	
	//for showing success message
	
	imageSuccess() {
		//this.dropdown.alertWithType('success', 'Success', 'Image attached successfully!');
		//this.dropdown.alertWithType('success', 'Success', 'Image attached successfully!');		
	}
	
	// For showing popup containing list of seller's calculator
	setModalVisible(visible) {
		this.setState({modalVisible: visible});
		this.getSellerCalculatorListApi();
	}
	
	
	getSellerCalculatorListApi() {
	

		console.log("getSellerCalculatorListApi request " + JSON.stringify({userId: this.state.user_id, type: "Seller", opt : this.state.opt
	}));

		callPostApi(GLOBAL.BASE_URL + GLOBAL.get_seller_calculator, {userId: this.state.user_id, type: "Seller", opt : this.state.opt
		}, this.state.access_token)
		.then((response) => {
			console.log("get seller calculator list response " + JSON.stringify(result));
			if(result.status == 'success') {
				calculatorList = result.data;
				calculatorList = calculatorList.sort(function(a, b) {
					return b.calculatorId-a.calculatorId
				})
				result.data = calculatorList;
				var ds = new ListView.DataSource({
					rowHasChanged: (r1, r2) => r1 !== r2
				});
				this.setState({dataSourceOrg: ds.cloneWithRows(result.data),dataSource: ds.cloneWithRows(result.data),arrayholder: result.data,emptCheck: false});
			} else {
				this.setState({emptCheck: true});
			}
		});
	}
	
	SearchFilterFunction(text){
		if(text != ''){
			const newData = this.state.arrayholder.filter(function(item){
				const itemData = item.calculatorName.toUpperCase()
				const textData = text.toUpperCase()
				return itemData.indexOf(textData) > -1
			})
			if (newData.length > 0) {
				this.setState({
					dataSource: this.state.dataSource.cloneWithRows(newData),
					emptCheck: false,
				})
			} else {
				this.setState({
					dataSource: this.state.dataSourceEmpty,
					emptCheck: true
				})
			}
		}else{
			this.setState({
				dataSource: this.state.dataSourceOrg,
				emptCheck: false,
			})
		}
	}
	
	
	editSellerCalculator(id, offerId, sess = null) {


		console.log("id in edit seller calc " + id);

		var request;

		if(this.state.multipleOfferStatus == true) {
			var editmodestatus = {
				editModeStatus : true
			}
			AsyncStorage.setItem("editModeStatus", JSON.stringify(editmodestatus));
			this.state.pageNumber++;
			request = {
				calculatorId : id, 
				offerId 	 : offerId,
				page 		 : this.state.pageNumber
			}
		} else {
			request = {
				calculatorId : id, 
				offerId 	 : 0,
				page 		 : this.state.pageNumber
			}
		}

		console.log("offer id 3 " + offerId);

		console.log("request on seller detail calc " + JSON.stringify(request));	
		
		callPostApi(GLOBAL.BASE_URL + GLOBAL.seller_detail_calculator, request , this.state.access_token)
		.then((response) => {

			console.log("seller detail calc response " + JSON.stringify(result));
		
			if(result.status == 'success') {
				this.setState(result.data);
				this.setState({sale_pr: result.data.salePrice,lender_address: result.data.address, preparedFor:result.data.preparedFor, postal_code: result.data.zip, tab: result.data.buyerLoanType,conventionalLoan: result.data.conventional,settlementDate: result.data.days, loansToBePaid_1Balance: result.data.loansToBePaidPayoff_1Balance,loansToBePaid_1Rate: result.data.loansToBePaidPayoff_1Rate,loansToBePaid_2Balance: result.data.loansToBePaidPayoff_2Balance,loansToBePaid_2Rate: result.data.loansToBePaidPayoff_2Rate,loansToBePaid_3Balance: result.data.loansToBePaidPayoff_3Balance,loansToBePaid_3Rate: result.data.loansToBePaidPayoff_3Rate, existingTotal:result.data.loansToBePaidPayoff_Total, annualPropertyTax: result.data.annualPropertyTax,escrowType : result.data.payorSelectorEscrow, escrowFee: result.data.escrowOrSettlement,ownerType: result.data.payorSelectorOwners,ownerFee: result.data.ownersTitlePolicy,lenderType: result.data.payorSelectorLenders,lenderFee: result.data.lendersTitlePolicy,escrowFeeOrg: result.data.escrowFeeHiddenValue,lenderFeeOrg: result.data.lendersFeeHiddenValue,ownerFeeOrg: result.data.ownersFeeHiddenValue,disc: result.data.otherCostsDiscount1,city: result.data.city,date: result.data.estimatedSettlementDate,drawingDeed: result.data.drawingDeed,notary:result.data.notary,transferTax:result.data.transferTax,prepaymentPenality:result.data.prepaymentPenalty,reconveynceFee:result.data.reconveyanceFee,pestControlReport:result.data.pestControlReport,benifDemandStatement:result.data.benifDemandStatement,listAgt:result.data.listAgtPercent,list_agt:result.data.listAgt,sellAgt:result.data.sellAgtPercent,sell_agt:result.data.sellAgt,totalAgt:result.data.totalAgt,daysInterest:result.data.allLoans,label1: result.data.costLabel_1Value,fee1: result.data.costFee_1Value,label2: result.data.costLabel_2Value,fee2: result.data.costFee_2Value,label3: result.data.costLabel_3Value,fee3: result.data.costFee_3Value,label4: result.data.costLabel_4Value,fee4: result.data.costFee_4Value,label5: result.data.costLabel_5Value,fee5: result.data.costFee_5Value,label6: result.data.costLabel_6Value,fee6: result.data.costFee_6Value,label7: result.data.costLabel_7Value,fee7: result.data.costFee_7Value,label8: result.data.costLabel_8Value,fee8: result.data.costFee_8Value,label9: result.data.costLabel_9Value,fee9: result.data.costFee_9Value,label10: result.data.costLabel_10Value,fee10: result.data.costFee_10Value,totalClosingCost: result.data.totalClosingCost,otherCostsDiscount2: result.data.otherCostsDiscount2,appraisalfee: result.data.otherCostsAppraisal,documentprep: result.data.otherCostsDocumentPrep,taxservicecontract: result.data.otherCostsTaxServiceContract,underwriting: result.data.otherCostsUnderwriting,processingfee: result.data.otherCostsProcessingFee,correctivework: result.data.otherCostsCorrectiveWork,buyersfee: result.data.otherCostsBuyerFees,totalOtherCost: result.data.totalOtherCosts,totalAllCost: result.data.totalAllCosts,estimatedTaxProrations: result.data.estimatedTaxProrations,estimatedSellerNet: result.data.estimatedSellersNet,county: result.data.countyId,state: result.data.state, summerPropertyTax : result.data.summerPropertyTax, winterPropertyTax : result.data.winterPropertyTax, prorationPercent : result.data.prorationPercent, calculatorId: result.data.id, editModeStatus : true});

				if(sess != 'session') {
					this.setModalVisible(!this.state.modalVisible);
				}
				date = this.state.date;
				var split = date.split('-');
			
				date = Number(split[1])+'-'+Number(split[2])+'-'+Number(split[0]);

				this.setState({
					date : date
				});
			} else {
				this.setState({
					calculatorId : 0
				});
			}

		}, err => {
		});
	}
	

	// saveSellerCalculatorDetailsApi function is used to save all information of the seller calculator after calculation according to our needs. This function called when you click on 'SAVE' button from breadcrumb shown on top right of the seller calculator page.
		
	saveSellerCalculatorDetailsApi(param = null) {
		if(param == 'nextOffer') {
			this.state.reloadStatus = true;	
			this.state.offerCounter++;	
		} else {
			this.state.reloadStatus = false;
		}

		date = this.state.date;
		var split = date.split('-');
		date = Number(split[0])+'/'+Number(split[1])+'/'+Number(split[2]);
		
		sellerData = {
			'company_id'	: this.state.company_id,
			'user_id' : this.state.user_id,
			'preparedBy' : this.state.user_name,
			"preparedFor": this.state.preparedFor,
			"existingTotal": this.state.existingTotal,
			"annualPropertyTax": this.state.annualPropertyTax,
			"selectedEscrowTypeId": this.state.escrowType, 
			"selectedOwnerTypeId": this.state.ownerType,
			"selectedLenderTypeId": this.state.lenderType,
			"discount1": this.state.disc,
			'address' : this.state.lender_address,
			'city' : this.state.city,
			'state' : this.state.state_code,
			'zip' : this.state.postal_code,
			'salePrice' : this.state.sale_pr,
			'buyerLoanType' : this.state.tab,
			"conventionalLoan": this.state.conventionalLoan,
			"model": date,
			"loansToBePaid_1Balance": this.state.loansToBePaid_1Balance,
			"loansToBePaid_1Rate": this.state.loansToBePaid_1Rate,
			"loansToBePaid_2Balance": this.state.loansToBePaid_2Balance,
			"loansToBePaid_2Rate": this.state.loansToBePaid_2Rate,
			"loansToBePaid_3Balance": this.state.loansToBePaid_3Balance,
			"loansToBePaid_3Rate": this.state.loansToBePaid_3Rate,
			"escrowFee": this.state.escrowFee,
			"ownerFee": this.state.ownerFee,
			"lenderFee": this.state.lenderFee,
			"escrowFeeOrg": this.state.escrowFeeOrg,
			"lenderFeeOrg": this.state.lenderFeeOrg,
			"ownerFeeOrg": this.state.ownerFeeOrg,
			"SCC_Drawing_Deed": this.state.drawingDeed,
			"SCC_Notary": this.state.notary,
			"SCC_TransferTax": this.state.transferTax,
			"SCC_Prepayment_Penalty": this.state.prepaymentPenality,
			"SCC_Reconveynce_Fee": this.state.reconveynceFee,
			"SCC_Pest_Control_Report": this.state.pestControlReport,
			"SCC_Demand_Statement": this.state.benifDemandStatement,
			"listAgt": this.state.listAgt,
			"list_agt":this.state.list_agt,
			"sellAgt":this.state.sellAgt,
			"sell_agt":this.state.sell_agt,
			"totalAgt":this.state.totalAgt,
			"days":this.state.settlementDate,
			"daysInterest": this.state.daysInterest,
			"UserSetting_l1": this.state.label1,
			"UserSetting_t1":"Flat Fee",
			"UserSetting_f1": this.state.fee1,
			"UserSetting_final1": this.state.fee1,
			"UserSetting_l2":this.state.label2,
			"UserSetting_t2":"Flat Fee",	
			"UserSetting_f2":this.state.fee2,
			"UserSetting_final2": this.state.fee2,
			"UserSetting_l3":this.state.label3,
			"UserSetting_t3":"Flat Fee",
			"UserSetting_f3": this.state.fee3,
			"UserSetting_final3": this.state.fee3,
			"UserSetting_l4":this.state.label4,
			"UserSetting_t4":"Flat Fee",
			"UserSetting_f4": this.state.fee4,
			"UserSetting_final4": this.state.fee4,
			"UserSetting_l5":this.state.label5,
			"UserSetting_t5":"Flat Fee",
			"UserSetting_f5": this.state.fee5,
			"UserSetting_final5": this.state.fee5,
			"UserSetting_l6":this.state.label6,
			"UserSetting_t6":"Flat Fee",
			"UserSetting_f6": this.state.fee6,
			"UserSetting_final6": this.state.fee6,
			"UserSetting_l7":this.state.label7,
			"UserSetting_t7":"Flat Fee",
			"UserSetting_f7": this.state.fee7,
			"UserSetting_final7": this.state.fee7,
			"UserSetting_l8":this.state.label8,
			"UserSetting_t8":"Flat Fee",
			"UserSetting_f8": this.state.fee8,
			"UserSetting_final8": this.state.fee8,
			"UserSetting_l9":this.state.label9,
			"UserSetting_t9":"Flat Fee",
			"UserSetting_f9": this.state.fee9,
			"UserSetting_final9": this.state.fee9,
			"UserSetting_l10":this.state.label10,
			"UserSetting_t10":"Flat Fee",
			"UserSetting_f10": this.state.fee10,
			"UserSetting_final10": this.state.fee10,
			"totalClosingCost": this.state.totalClosingCost,
			"discount2": this.state.otherCostsDiscount2,
			"appraisal": this.state.appraisalfee,
			"documentPrep": this.state.documentprep,
			"taxServiceContract": this.state.taxservicecontract,
			"underwriting": this.state.underwriting,
			"processingFee": this.state.processingfee,
			"correctiveWork": this.state.correctivework,
			"buyersFees": this.state.buyersfee,
			"totalOtherCost": this.state.totalOtherCost,
			"totalMonthlyPayment": this.state.totalAllCost,
			"estimatedTaxProrations": this.state.estimatedTaxProrations,
			"totalInvestment": this.state.estimatedSellerNet,
			'prorationPercent': this.state.prorationPercent,
			'summerPropertyTax' : this.state.summerPropertyTax,
			'winterPropertyTax' : this.state.winterPropertyTax,
			"state_id":this.state.state,
			"county_id":this.state.county
		};
		

		if(this.state.multipleOfferStatus == true) {
			sellerData.offerId			= this.state.offerId; 
			sellerData.buyerName		= this.state.buyerName;	
			sellerData.buyerDownPayment	= this.state.buyerDownPayment;
		} else {
			sellerData.offerId = 0;
			sellerData.buyerName		= '';	
			sellerData.buyerDownPayment	= '0.00';
		}

		console.log("offer id 4 " + this.state.offerId);

		if(this.state.calculatorId != "" && this.state.editModeStatus == false) {
			sellerData.calculator_id = this.state.calculatorId;	
			// alert box added by lovedeep on 04-30-2018
			Alert.alert( 'CostsFirst', 'A Saved File already exits with the same file name, do you want to:', [ {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')}, {text: 'Save As', onPress: this.onSaveAsNew.bind(this, sellerData)}, {text: 'Overwrite', onPress: this.onOverwriteAsExisting.bind(this, sellerData)}] );
		} else {
			var temp = JSON.stringify(sellerData);
			temp = temp.replace(/\"\"/g, "\"0.00\"");
			sellerData = JSON.parse(temp);
			// check added by lovedeep on 04-30-2018
			
			console.log("this.state.calculatorId in seller save calc " + this.state.calculatorId);

			if(this.state.calculatorId != '' && this.state.editModeStatus == true) {
				sellerData.calculator_id = this.state.calculatorId;
			}
			if(sellerData.address == '0.00') {
				sellerData.address = '';
			}


			callPostApi(GLOBAL.BASE_URL + GLOBAL.save_seller_calculator, sellerData,this.state.access_token).then((response) => {
				this.state.sessionForMulitpleOffer = {
					'preparedBy' 					: 	this.state.user_name,
					'preparedFor'					: 	this.state.preparedFor,
					'address' 						: 	this.state.lender_address,
					'city' 							: 	this.state.city,
					'state'							: 	this.state.state_name,
					'zip' 							: 	this.state.postal_code,	
					'loansToBePaid_1Balance'		:	this.state.loansToBePaid_1Balance,
					'loansToBePaid_1Rate' 			: 	this.state.loansToBePaid_1Rate, 
					'loansToBePaid_2Balance' 		:	this.state.loansToBePaid_2Balance,  
					'loansToBePaid_2Rate' 			:	this.state.loansToBePaid_2Rate,
					'loansToBePaid_3Balance'		: 	this.state.loansToBePaid_3Balance,
					'loansToBePaid_3Rate'			: 	this.state.loansToBePaid_3Rate,
					'summerPropertyTax'				: 	this.state.summerPropertyTax, 
					'winterPropertyTax'				: 	this.state.winterPropertyTax, 
					'prorationPercent'				: 	this.state.prorationPercent, 
					'annualPropertyTax'				: 	this.state.annualPropertyTax,
					'offerId'						: 	this.state.offerId,
					'offerCounter'					: 	this.state.offerCounter,
					'existingTotal'					: 	this.state.existingTotal,
					'estimatedTaxProrations'		: 	this.state.estimatedTaxProrations,
					'pageNumber'					: 	this.state.pageNumber,
					'editModeStatus'				: 	this.state.editModeStatus
				}

				console.log("offer id 5 " + this.state.offerId);

				if(param != 'nextOffer') {
					this.state.sessionForMulitpleOffer.calculatorId = result.data;
				} else {
					this.state.sessionForMulitpleOffer.calculatorId = '';
				}


				AsyncStorage.setItem('session_Multi_offer', JSON.stringify(this.state.sessionForMulitpleOffer));

				AsyncStorage.setItem('session_address', JSON.stringify(this.state.lender_address));

				this.dropdown.alertWithType('success', 'Success', result.message);

				if(param == 'done') {
					this.setState({
						doneStatus : true
					});
				} else {
					this.setState({
						doneStatus : false
					});
				}

				
				
				//this.props.navigator.push({name: 'SellerCalculator', index: 0 });


				//this.setState({monthlyRate: monthlyRate, monthPmiVal: monthPmiVal},this.calTotalPrepaidItems);
			});
		}
	}


	nextOffer() {

		if(this.state.sale_pr != '' && this.state.sale_pr != '0.00') {

			AsyncStorage.getItem("session_Multi_offer").then(
				(resultpl) =>{ 

					console.log("resultpl" + resultpl);

					if(resultpl == null && this.state.editModeStatus == false) {

						/*callPostApi(GLOBAL.BASE_URL + GLOBAL.getMultipleOffer,this.state.access_token)
						.then((response) => {
							this.setState({
								offerId : result.data.offer_id
							});	
							
							console.log("offer id 6 " + result.data.offer_id);

						});*/

						this.saveSellerCalculatorDetailsApi('nextOffer');
					} else {
						if(this.state.sale_pr != '' && this.state.sale_pr != '0.00') {
							this.saveSellerCalculatorDetailsApi('nextOffer');
						} else {
							this.popupDialogMultipleOffer.show();
						}
					}
			});	
		} else {
			this.dropdown.alertWithType('error', 'Error', 'Please enter sales price');
		}
	}

	onSaveAsNew(sellerdt) {

		// as per discussion with atul sir .. passing calc id empty
		delete sellerdt.calculator_id;
		var temp = JSON.stringify(sellerdt);
		temp = temp.replace(/\"\"/g, "\"0.00\"");
		sellerData = JSON.parse(temp);
		// check added by lovedeep on 04-30-2018
		if(sellerData.address == '0.00') {
			sellerData.address = '';
		}

		/*var temp = JSON.stringify(sellerData);
		temp = temp.replace(/\"\"/g, "\"0.00\"");
		sellerData = JSON.parse(temp);*/

		callPostApi(GLOBAL.BASE_URL + GLOBAL.save_seller_calculator, sellerData,this.state.access_token).then((response) => {
			this.dropdown.alertWithType('success', 'Success', result.message);
			//this.setState({monthlyRate: monthlyRate, monthPmiVal: monthPmiVal},this.calTotalPrepaidItems);
		});
	}

	onOverwriteAsExisting(sellerdt) {

		// as per discussion with atul sir .. passing calc id empty
		delete sellerdt.calculator_id;
		var temp = JSON.stringify(sellerdt);
		temp = temp.replace(/\"\"/g, "\"0.00\"");
		sellerData = JSON.parse(temp);
		// check added by lovedeep on 04-30-2018
		if(sellerData.address == '0.00') {
			sellerData.address = '';
		}
		/*var temp = JSON.stringify(sellerData);
		temp = temp.replace(/\"\"/g, "\"0.00\"");
		sellerData = JSON.parse(temp);*/

		callPostApi(GLOBAL.BASE_URL + GLOBAL.save_seller_calculator, sellerData,this.state.access_token).then((response) => {
			this.dropdown.alertWithType('success', 'Success', result.message);
			//this.setState({monthlyRate: monthlyRate, monthPmiVal: monthPmiVal},this.calTotalPrepaidItems);
		});
	}

	onPressMailingAddress() {
		this.setState({
			enterAddressBar : true
		});
	}

	onPressConfirmDeleteCalculator(id) {

		Alert.alert( 'CostsFirst', 'Are you sure you want to delete this file?', [ {text: 'NO', onPress: () => console.log('Cancel Pressed!')}, {text: 'YES', onPress: this.onPressDeleteCalculator.bind(this, id)}] );
	}

	onDeleteSavedOrder() {

		console.log("calculator id " + this.state.calculatorId);

		Alert.alert( 'CostsFirst', 'Are you sure you want to delete this file?', [ {text: 'NO', onPress: () => console.log('Cancel Pressed!')}, {text: 'YES', onPress: this.onPressDeleteCalculatorSaveOrder.bind(this, this.state.calculatorId)}] );
	}


	onPressDeleteCalculatorSaveOrder(id) {

		console.log("calculator id " + id);

		this.setState({animating : 'true', loadingText : 'Please wait..'});
		callPostApi(GLOBAL.BASE_URL + GLOBAL.Delete_Seller_Calculator, {id: id, 'ref':'saveorder'
		}, this.state.access_token)
		.then((response) => {
			if (result.status == 'success') {
				this.setState({animating : 'false'});
				Alert.alert('CostsFirst', result.message);
				var calcOfferDt = {
					calculatorId : id,
					offerId : this.state.offerId
				}
				AsyncStorage.setItem("calcOfferDt",  JSON.stringify(calcOfferDt));
				this.props.navigator.push({name: 'SellerCalculator', params : 'multipleOffer', index: 0 });
				//this.dropdown.alertWithType('success', 'Success', result.message);
			}  else if (result.status == 'fail') {
				this.setState({animating : 'false'});
				Alert.alert('CostsFirst', result.message);
				//this.dropdown.alertWithType('error', 'Error', result.message);
			} else {
				this.setState({animating : 'false'});
				Alert.alert('CostsFirst', 'Error occured, please try again later.');
				//this.dropdown.alertWithType('error', 'Error', result.message);
			}		
		});
	}

	onPressDeleteCalculator(id) {
		this.setState({animating : 'true', loadingText : 'Please wait..'});
		callPostApi(GLOBAL.BASE_URL + GLOBAL.Delete_Seller_Calculator, {id: id, 'ref':'self'
		}, this.state.access_token)
		.then((response) => {
			if (result.status == 'success') {
				this.setState({animating : 'false'});
				Alert.alert('CostsFirst', result.message);
				this.getSellerCalculatorListApi();
				//this.dropdown.alertWithType('success', 'Success', result.message);
			}  else if (result.status == 'fail') {
				this.setState({animating : 'false'});
				Alert.alert('CostsFirst', result.message);
				//this.dropdown.alertWithType('error', 'Error', result.message);
			} else {
				this.setState({animating : 'false'});
				Alert.alert('CostsFirst', 'Error occured, please try again later.');
				//this.dropdown.alertWithType('error', 'Error', result.message);
			}		
		});
	}
	
	renderRow(rowData) {
		if(rowData != 'calculatorName') {
			if(rowData.address.length > 25){
				var strshortened = rowData.address.substring(0,25);
				rowData.address = strshortened + '..';
			}
		}
		return (
			<View style={SellerStyle.scrollable_container_child_center}>
				<View style={SellerStyle.savecalcvalue}>
					<TouchableOpacity onPress={() => this.editSellerCalculator(rowData.calculatorId, rowData.offerId)}>
						<Text style={SellerStyle.text_style}>
							{rowData.calculatorName}{"\n"}
							{this.delimitNumbers(rowData.price) != 'undefined' ? `$` : ""}	 
							{this.delimitNumbers(rowData.price) != 'undefined' ? this.delimitNumbers(rowData.price) : "" }
						</Text>
					</TouchableOpacity>
				</View>
				<View style={SellerStyle.savecalcvalueSecondCol}>
				<TouchableOpacity onPress={() => this.editSellerCalculator(rowData.calculatorId, rowData.offerId)}>
					<Text style={[SellerStyle.alignCenterCalcList,{alignSelf: 'flex-start'}]}>
						{rowData.address}{"\n"}{rowData.createdDate}
					</Text>
					</TouchableOpacity>
				</View>
				<TouchableOpacity style={SellerStyle.savecalcvaluesmall} onPress={() => this.onPressConfirmDeleteCalculator(rowData.id)}>
					<Image source={Images.recycle}/>
				</TouchableOpacity>
			</View>
			
		);
	}
	
	popupShow() {
		this.popupDialog.show();
	}

	popupHide() {
		this.popupDialog.dismiss();
	}
	
	popupShowAddEmailAddress() {
		this.popupDialogAddEmailAddress.show();
	}
	   
	popupHideAddEmailAddress(param) {
		this.popupDialogAddEmailAddress.dismiss();
		if(param == 'dont_save') {
			this.onCallSocialSigninFunc();
		}
	}
	   
	openpopup(type) {
		this.setState({popupAttachmentType: type},this.popupShowEmail);
	}
	
	popupShowEmail(){
		this.popupDialogEmail.show();
	}

	popupHideEmail(){
		this.popupDialogEmail.dismiss();
	}

	popupShowMultipleOffer() {

		AsyncStorage.getItem("session_Multi_offer").then(
			(resultpl) =>{ 
				if(resultpl !== null && resultpl !== '') {
					this.saveSellerCalculatorDetailsApi('done');
				} else {
					if(this.state.sale_pr != '' && this.state.sale_pr != '0.00') {
						this.saveSellerCalculatorDetailsApi('done');
					} else {
						this.popupDialogMultipleOffer.show();
					}
				}
			});			

		/*if(this.state.sale_pr == '' || this.state.sale_pr == '0.00') {
			this.popupDialogMultipleOffer.show();
		} else {
			this.saveSellerCalculatorDetailsApi('done');
		}	*/	
	}

	popupDialogMultipleOffer() {
		this.popupDialogMultipleOffer.dismiss();
	}

	printPDFMultipleOffer() {
		var multipleOfferData = {
			"offerId" 		: this.state.offerId,
			"userId" 		: this.state.user_id,
			"actionType" 	: "pdf"
		}

		console.log("offer id 7 " + this.state.offerId);

		callPostApi(GLOBAL.BASE_URL + GLOBAL.multipleOfferPdf, multipleOfferData, this.state.access_token)
		.then((response) => {
			this.popupHide();
			OpenFile.openDoc([{
				url:GLOBAL.BASE_URL + result.data,
				fileName:"sample",
				fileType:"pdf",
				cache: false,
			}], (error, url) => {
				this.popupDialogMultipleOffer.dismiss();
				if (error) {
					console.error(error);
				} else {
					console.log(url)
				}
			})
		});


	}
	
	printPDF(type) {

			if(type == 'owner_carry') {
				pdfURL = GLOBAL.generate_pdf_owner_carry;
				
				ownerCarryData = {
					user_id : this.state.user_id,
					opt 	: 'pdf',
					type 	: 'list', 
					sp 		: this.state.sale_pr,
					intr 	: this.state.interest_rate1,
					dur 	: this.state.term_in_year1,
					due 	: this.state.due_in_year1,
					note 	: this.state.content,
					email 	: this.state.to_email,
					subject : this.state.email_subject
				}

				console.log("request ownerCarryData " + JSON.stringify(ownerCarryData));

				callPostApi(GLOBAL.BASE_URL + pdfURL, ownerCarryData, this.state.access_token)
				.then((response) => {

					console.log("response ownerCarryData " + JSON.stringify(result));


					this.popupHide();
					OpenFile.openDoc([{
						url:GLOBAL.BASE_URL + result.data,
						fileName:"sample",
						fileType:"pdf",
						cache: false,
					}], (error, url) => {
						if (error) {
							console.error(error);
							console.log("error " + JSON.stringify(error));
							
						} else {
							console.log(url)
						}
					})
				});

			} else {
				if(type == "detailed") {
					pdfURL = GLOBAL.generate_pdf_detail_seller + '/' + this.state.languageType;
				} else if(type == "quick") {
					pdfURL = GLOBAL.generate_pdf_quick_seller + '/' + this.state.languageType;
				} 
	
				sellerData = this.getData();
				date = this.state.date;
				var split = date.split('-');
				date = Number(split[0])+'/'+Number(split[1])+'/'+Number(split[2]);
				sellerData = this.getData();
				sellerData.actionType = 'download';
				sellerData.estStlmtDate = date;
				callPostApi(GLOBAL.BASE_URL + pdfURL, sellerData, this.state.access_token)
				.then((response) => {

					console.log("response other " + JSON.stringify(result));

					this.popupHide();
					OpenFile.openDoc([{
						url:GLOBAL.BASE_URL + result.data,
						fileName:"sample",
						fileType:"pdf",
						cache: false,
					}], (error, url) => {
						if (error) {
							console.error(error);
						} else {
							console.log(url)
						}
					})
				});
			}
	}
	
	// For showing popup containing list of seller's calculator
	setEmailModalVisible(visible) {
		this.setState({emailModalVisible: visible});
		this.getSellerCalculatorListApi();
	}
	
	// For showing popup containing list of seller's calculator
	setModalAddressesVisible(visible) {
		if(this.state.emailAddrsList != ''){
			this.setState({modalAddressesVisible: visible});
		}else{
			Alert.alert( 'CostsFirst', 'Address book is empty.', [ {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')}, {text: 'OK', onPress: () => console.log('Cancel Pressed!')}] );
		}
	}
	
		// For showing popup containing list of buyer's calculator
	setVideoModalVisible(visible) {
		this.setState({videoModalVisible: visible});
	}

	cancelEmailPopup(flag) {
		this.setState({
			openMessagePopup : false
		});

		if(flag == 'success') {
			this.dropdown.alertWithType('success', 'Success', "Message sent successfully");
		}
	}

	// This function is not in use for
	/*formatPhone(tags) {
	
		gdftags = "346347457457";

		var numbers = gdftags.replace(/\D/g, "");
		char = {0:'', 3:' - ', 6:' - '};
		obj = '';
		for (var i = 0; i < numbers.length; i++) {
		 obj += (char[i]||'') + numbers[i];
		}

	
		/*this.setState({
			tagInputValue : obj
		});

		this.state.tagInputValue = obj;

		
		//return obj;
	}*/
	
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
			var i=1;
			//Alert.alert('Alert!', JSON.stringify(result.data.userSettingCost))
			// For setting last fields of closing costs page
			list = this.state.emailAddrsList;
			for (let resObj of result.data) {
				list.push(resObj.email);
				i++;
			}
			this.setState({emailAddrsList: list});
			//this.setState({addrsSource: ds.cloneWithRows(result.data)});
		});
	}
	
	sendEmail() {

		if(this.state.to_email == "") {
			Alert.alert('', 'Please enter email address');
			//this.dropdown.alertWithType('error', 'Error', 'Please enter email address');
		} else {
			var str_array = this.state.to_email.split(',');
			
			console.log("str_array  " + str_array);
			
			
			console.log("str_array length " + str_array.length);

			for(var i = 0; i < str_array.length; i++) {
			// Trim the excess whitespace.
				str_array[i] = str_array[i].trim();
				if(!validateEmail(str_array[i])) {
					//this.dropdown.alertWithType('error', 'Error', 'Please enter valid email address');
					this.state.invalidEmailStatus = true;
				}
				if(i == str_array.length - 1) {
					this.callSendEmailFunc();
				}
			}
		}



	}

	openMultipleOfferPopup() {

	}

	callSendEmailFunc() {

		console.log("callSendEmailFunc ");

		if(this.state.invalidEmailStatus == true) {
			this.setState({
				invalidEmailStatus : false
			});
			Alert.alert('', 'Please enter valid email addresses with comma separated!');			
			//this.dropdown.alertWithType('error', 'Error', 'Please enter valid email addresses with comma separated!');
		} else {

			if (this.state.emailType == 'owner_carry') {
				this.setState({animating : 'true', loadingText : 'Please wait...'});				
				date = this.state.date;
				var split = date.split('-');
				date = Number(split[0])+'/'+Number(split[1])+'/'+Number(split[2]);
				
				ownerCarryData = {

					user_id : this.state.user_id,
					opt 	: 	'email',
					type  	: 	'list',
					sp	 	: this.state.sale_pr, 
					intr 	: this.state.todaysInterestRate,
					dur 	: this.state.termsOfLoansinYears,
					due 	: this.state.due_in_year1,
					note 	: this.state.content,
					email 	: this.state.to_email,
					subject : this.state.email_subject
				}

				console.log("cdtc recor request params " + JSON.stringify(ownerCarryData));

				callPostApi(GLOBAL.BASE_URL + GLOBAL.generate_pdf_owner_carry, ownerCarryData, this.state.access_token)
				.then((response) => {
					console.log("owner carry  response " + JSON.stringify(result));
					if(result.status == 'success') {
						this.setState({
							to_email : ""
						});
						this.state.verified_email = result.email;
						this.setState({
							newEmailAddress : result.email
						});
						//console.log("response from server " + JSON.stringify(result));
						AsyncStorage.setItem("pdfFileName", result.data);
						//AsyncStorage.setItem("calculator", "buyer");	
						//this.props.navigator.push({name: 'GoogleSigninExample', index: 0 });
						this.popupHideEmail();
						this.popupHide();
						//AsyncStorage.removeItem("evernote");
						//AsyncStorage.removeItem("dropbox");
						this.setEmailModalVisible(!this.state.emailModalVisible);
						this.dropdown.alertWithType('success', 'Success', result.message);
						this.setState({animating : 'false', loadingText : 'Calculating', dropdownType : ""});		
					} else if (result.status == 'fail') {
						this.setState({animating : 'false', loadingText : 'Calculating', dropdownType : ""});
						this.dropdown.alertWithType('error', 'Error', result.message);
					} else {
						this.setState({animating : 'false', loadingText : 'Calculating', dropdownType : ""});
						this.dropdown.alertWithType('error', 'Error', result.message);
					}
				});	
			} else {
				if(this.state.emailType == 'multipleOffer') {
					
					sellerData = {
						"offerId" : this.state.offerId,
						"userId" : this.state.user_id,
						"actionType" : "email",
						"note" : this.state.content,
						"email" : this.state.to_email,
						"subject" : this.state.email_subject
					}
	
					console.log("offer id 8 " + this.state.offerId);
	
				} else {
					sellerData = this.getData();
					sellerData.email = this.state.to_email;
					date = this.state.date;
					var split = date.split('-');
					date = Number(split[0])+'/'+Number(split[1])+'/'+Number(split[2]);
					sellerData.image = this.state.imageNameEmail;
					sellerData.video = this.state.videoNameEmail;
					sellerData.subject = this.state.email_subject;
					sellerData.note = this.state.content;
					sellerData.estStlmtDate = date;
					sellerData.actionType = 'email';
				}
				if(this.state.emailType == 'detailed') {
					seller_email_service = GLOBAL.generate_pdf_detail_seller + '/' + this.state.languageType;
				   } else if (this.state.emailType == 'multipleOffer') {
					seller_email_service = GLOBAL.multipleOfferPdf;
				}  else {
				seller_email_service = GLOBAL.generate_pdf_quick_seller + '/' + this.state.languageType;
			   } 
			//	sellerData.image_name = this.state.imageData;


			   console.log("sellerData request " + JSON.stringify(sellerData));
			   this.setState({animating : 'true', loadingText : 'Please wait...'});	
				callPostApi(GLOBAL.BASE_URL + seller_email_service, sellerData, this.state.access_token)
				.then((response) => {
	
					//alert(JSON.stringify(result));
					this.setState({
						to_email : ""
					});
					this.state.verified_email = result.email;
					this.setState({
						newEmailAddress : result.email
					});
	
					//alert(JSON.stringify(result));
	
					AsyncStorage.setItem("pdfFileName", result.data);
					AsyncStorage.setItem("calculator", "seller");
					//this.props.navigator.push({name: 'GoogleSigninExample', index: 0 });
					this.popupHideEmail();
					this.popupHide();
					AsyncStorage.removeItem("evernote");
					AsyncStorage.removeItem("dropbox");
					this.setEmailModalVisible(!this.state.emailModalVisible);
					//this.setEmailModalVisible(!this.state.emailModalVisible);
					this.dropdown.alertWithType('success', 'Success', "Email sent successfully");
					this.setState({
						tagsSelected : [],
						tagsSelectedForEmail : [],
						animating : 'false',
						dropdownType : "",
						loadingText : 'Calculating',
					});
					
				});
			}
		}
	}


	takePicture = () => {
		const options = {};
		//options.location = ...
		this.camera.capture({metadata: options})
		  .then((data) => console.log(data))
		  .catch(err => console.error(err));
	}

	startRecording = () => {
		if (this.camera) {
		  this.camera.capture({mode: Camera.constants.CaptureMode.video})
		  .then((data) => {
			  	this.setState({
			  		videoData : data
				})
				  
				let formData = new FormData();
				formData.append("video", {
				name: 'name.mp4',
				uri: this.state.videoData.path,
				type: 'video/mp4'
				});
				formData.append("userId", this.state.user_id);
		
				fetch(GLOBAL.BASE_URL + GLOBAL.Upload_Video_Email_Mobile,{
					method: 'POST',
					headers: {
						'Content-Type': 'multipart/form-data'
					},
					body: formData
				})
				.then((response) => response.json())
				.then(response => {
					this.setState({animating : 'false'});
					Alert.alert('', 'Video uploaded successfully!');
					this.popupDialog.dismiss();
					this.popupDialogEmail.dismiss();
				this.setState({
					videoNameEmail : response.data
				});
					//{"message":"Video Uploaded","status":"success","data":"1523433546.mp4"}
					//alert(JSON.stringify(response));
				}).catch(err => {
					this.setState({animating : 'false'});
					Alert.alert('', 'Error occured, please try again later.');	
					//alert(JSON.stringify(err));
				})
		  })
		  .catch(err => {
			this.setState({animating : 'false'});
			console.error(err);
		  });

		  this.setState({
			isRecording: true
		  });
		}
	}

	stopRecording = () => {
		if (this.camera) {
		  this.camera.stopCapture();
			this.setState({
			isRecording: false
		  });
		  Alert.alert( 'CostsFirst', 'Do you want to attach this video.', [ {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')}, {text: 'OK', onPress:this.hideVideoModals.bind(this)}] );
		}
	}

	hideVideoModals() {
		this.setState({
			loadingText : 'Please wait..' 
		});
		this.popupHide();
		this.hideVideoModal();
		this.setState({animating : 'true'});
		
		//this.popupDialog.dismiss();
	}

	hideVideoModal() {
		this.setVideoModalVisible(!this.state.videoModalVisible);
	}

	switchType = () => {
		let newType;
		const { back, front } = Camera.constants.Type;

		if (this.state.camera.type === back) {
		  newType = front;
		} else if (this.state.camera.type === front) {
		  newType = back;
		}

		this.setState({
		  camera: {
			...this.state.camera,
			type: newType,
		  },
		});
	}

	onBuyerPress() {
		this.props.navigator.push({name: 'BuyerCalculator', index: 0 });
	}

	onNetFirstPress() {
		this.props.navigator.push({name: 'NetFirstCalculator', index: 0 });
	}

	onRefinancePress() {
		this.props.navigator.push({name: 'Refinance', index: 0 });
	}

	onClose(data) {

		if(this.state.reloadStatus == true) {
			this.props.navigator.push({name: 'SellerCalculator', params : 'multipleOffer', index: 0 });
		}

		if(this.state.doneStatus == true) {
			this.popupDialogMultipleOffer.show();
		}
		
		if(data.type == 'success' && data.message == 'Email sent successfully') {
			if(this.state.verified_email != 'null' && this.state.verified_email != "" && this.state.verified_email != null) {
				this.popupDialogAddEmailAddress.show();	
			} else {
				Alert.alert( 'CostsFirst', 'Do you want to share pdf to social sites?', [ {text: 'NO', onPress: () => console.log('Cancel Pressed!')}, {text: 'YES', onPress: this.onCallSocialSigninFunc.bind(this)}] );
			}	
		} else if (data.type == 'success' && data.message == 'Contact has been added successfully.') {
			Alert.alert( 'CostsFirst', 'Do you want to share pdf to social sites?', [ {text: 'NO', onPress: () => console.log('Cancel Pressed!')}, {text: 'YES', onPress: this.onCallSocialSigninFunc.bind(this)}] );
		}
	}

	onCallSocialSigninFunc() {
		this.props.navigator.push({name: 'GoogleSigninExample', index: 0 });	
	}
	
	onSaveNewContactAddress() {

		if (this.state.newEmailAddress == '') {
			this.setState({newEmailAddressError : STRINGS.t('email_error_message')});
		}else if(this.state.newEmailAddress.length < 2 || this.state.newEmailAddress.length > 100){
			this.refs.newEmailAddress.setNativeProps({text: ''});
			this.setState({newEmailAddressError : STRINGS.t('email_char_error_message')});
			
		} else {
			this.setState({newEmailAddressError : ''});
		}
		if(this.state.newEmailAddress != '') {
			if (!validateEmail(this.state.newEmailAddress)) {
				this.refs.newEmailAddress.setNativeProps({text: ''});
				this.setState({newEmailAddressError : STRINGS.t('validation_email_error_message')});
			 } else {
				this.setState({newEmailAddressError : ''});
			 }
		}
		if(this.state.newEmailAddress != '' && validateEmail(this.state.newEmailAddress)) {
			callPostApi(GLOBAL.BASE_URL + GLOBAL.Save_contact_addressBook, {
				"user_id": this.state.user_id,
				"username": this.state.newEmailContactName,
				"email": this.state.newEmailAddress,
				"phone": this.state.contact_number
			},this.state.access_token)
			.then((response) => {
				if (result.status == 'success') {
					this.popupHideAddEmailAddress();
					this.dropdown.alertWithType('success', 'Success', result.message);
				} else if (result.status == 'fail') {
					this.dropdown.alertWithType('error', 'Error', result.message);
				} else {
					this.popupHideAddEmailAddress();
					this.dropdown.alertWithType('error', 'Error', 'Error occured, please try again later.');
				}
			});
		}
	}

	onSelectionsChange = (selectedAddresses) => {
		var i=1;
		to_email = "";
		for (let resObj of selectedAddresses) {
			if(i==1) {
				to_email = resObj.value;
			}else {
				to_email = to_email + ", " + resObj.value;
			}
			i++;
		}
		// if else check added by lovedeep on 01-05-2018	
		if(this.state.to_email_default != "") {
			this.setState({to_email: this.state.to_email_default + ", " + to_email});
		} else {
			this.setState({to_email: to_email});
		}
		this.setState({ selectedAddresses })
	}
	state = { selectedAddresses: [] }
	
	getData() {
		sellerData 	= 	{
			'company_id'	: this.state.company_id,
			'user_id' : this.state.user_id,
			'preparedBy' : this.state.user_name,
			"preparedFor": this.state.preparedFor,
			"existingTotal": this.delimitNumbers(this.state.existingTotal),
			"annualPropertyTax": this.delimitNumbers(this.state.annualPropertyTax),
			"selectedEscrowTypeId": this.state.escrowType, 
			"selectedOwnerTypeId": this.state.ownerType,
			"selectedLenderTypeId": this.state.lenderType,
			"discount1": this.delimitNumbers(this.state.disc),
			'address' : this.state.lender_address,
			'city' : this.state.city,
			'state' : this.state.user_state,
			'zip' : this.state.postal_code,
			'salePrice' : this.delimitNumbers(this.state.sale_pr),
			'buyerLoanType' : this.state.tab,
			"conventionalLoan": this.delimitNumbers(this.state.conventionalLoan),
			"model": this.state.date,
			"loansToBePaid_1Balance": this.delimitNumbers(this.state.loansToBePaid_1Balance),
			"loansToBePaid_1Rate": this.delimitNumbers(this.state.loansToBePaid_1Rate),
			"loansToBePaid_2Balance": this.delimitNumbers(this.state.loansToBePaid_2Balance),
			"loansToBePaid_2Rate": this.delimitNumbers(this.state.loansToBePaid_2Rate),
			"loansToBePaid_3Balance": this.delimitNumbers(this.state.loansToBePaid_3Balance),
			"loansToBePaid_3Rate": this.delimitNumbers(this.state.loansToBePaid_3Rate),
			"escrowFee": this.delimitNumbers(this.state.escrowFee),
			"ownerFee": this.delimitNumbers(this.state.ownerFee),
			"lenderFee": this.delimitNumbers(this.state.lenderFee),
			"escrowFeeOrg": this.delimitNumbers(this.state.escrowFeeOrg),
			"lenderFeeOrg": this.delimitNumbers(this.state.lenderFeeOrg),
			"ownerFeeOrg": this.delimitNumbers(this.state.ownerFeeOrg),
			"SCC_Drawing_Deed": this.delimitNumbers(this.state.drawingDeed),
			"SCC_Notary": this.delimitNumbers(this.state.notary),
			"SCC_TransferTax": this.delimitNumbers(this.state.transferTax),
			"SCC_Prepayment_Penalty": this.delimitNumbers(this.state.prepaymentPenality),
			"SCC_Reconveynce_Fee": this.delimitNumbers(this.state.reconveynceFee),
			"SCC_Pest_Control_Report": this.delimitNumbers(this.state.pestControlReport),
			"SCC_Demand_Statement": this.delimitNumbers(this.state.benifDemandStatement),
			"listAgt": this.delimitNumbers(this.state.listAgt),
			"list_agt":this.delimitNumbers(this.state.list_agt),
			"sellAgt":this.delimitNumbers(this.state.sellAgt),
			"sell_agt":this.delimitNumbers(this.state.sell_agt),
			"totalAgt":this.delimitNumbers(this.state.totalAgt),
			"days":this.state.settlementDate,
			"daysInterest": this.delimitNumbers(this.state.daysInterest),
			"UserSetting_l1": this.state.label1,
			"UserSetting_t1":"Flat Fee",
			"UserSetting_f1": this.delimitNumbers(this.state.fee1),
			"UserSetting_final1": this.delimitNumbers(this.state.fee1),
			"UserSetting_l2":this.state.label2,
			"UserSetting_t2":"Flat Fee",
			"UserSetting_f2":this.delimitNumbers(this.state.fee2),
			"UserSetting_final2": this.delimitNumbers(this.state.fee2),
			"UserSetting_l3":this.state.label3,
			"UserSetting_t3":"Flat Fee",
			"UserSetting_f3": this.delimitNumbers(this.state.fee3),
			"UserSetting_final3": this.delimitNumbers(this.state.fee3),
			"UserSetting_l4":this.state.label4,
			"UserSetting_t4":"Flat Fee",
			"UserSetting_f4": this.delimitNumbers(this.state.fee4),
			"UserSetting_final4": this.delimitNumbers(this.state.fee4),
			"UserSetting_l5":this.state.label5,
			"UserSetting_t5":"Flat Fee",
			"UserSetting_f5": this.delimitNumbers(this.state.fee5),
			"UserSetting_final5": this.delimitNumbers(this.state.fee5),
			"UserSetting_l6":this.state.label6,
			"UserSetting_t6":"Flat Fee",
			"UserSetting_f6": this.delimitNumbers(this.state.fee6),
			"UserSetting_final6": this.delimitNumbers(this.state.fee6),
			"UserSetting_l7":this.state.label7,
			"UserSetting_t7":"Flat Fee",
			"UserSetting_f7": this.delimitNumbers(this.state.fee7),
			"UserSetting_final7": this.delimitNumbers(this.state.fee7),
			"UserSetting_l8":this.state.label8,
			"UserSetting_t8":"Flat Fee",
			"UserSetting_f8": this.delimitNumbers(this.state.fee8),
			"UserSetting_final8": this.delimitNumbers(this.state.fee8),
			"UserSetting_l9":this.state.label9,
			"UserSetting_t9":"Flat Fee",
			"UserSetting_f9": this.delimitNumbers(this.state.fee9),
			"UserSetting_final9": this.delimitNumbers(this.state.fee9),
			"UserSetting_l10":this.state.label10,
			"UserSetting_t10":"Flat Fee",
			"UserSetting_f10": this.delimitNumbers(this.state.fee10),
			"UserSetting_final10": this.delimitNumbers(this.state.fee10),
			"totalClosingCost": this.delimitNumbers(this.state.totalClosingCost),
			"discount2": this.delimitNumbers(this.state.otherCostsDiscount2),
			"appraisal": this.delimitNumbers(this.state.appraisalfee),
			"documentPrep": this.delimitNumbers(this.state.documentprep),
			"taxServiceContract": this.delimitNumbers(this.state.taxservicecontract),
			"underwriting": this.delimitNumbers(this.state.underwriting),
			"processingFee": this.delimitNumbers(this.state.processingfee),
			"correctiveWork": this.delimitNumbers(this.state.correctivework),
			"buyersFees": this.delimitNumbers(this.state.buyersfee),
			"totalOtherCost": this.delimitNumbers(this.state.totalOtherCost),
			"totalMonthlyPayment": this.delimitNumbers(this.state.totalAllCost),
			"estimatedTaxProrations": this.delimitNumbers(this.state.estimatedTaxProrations),
			"totalInvestment": this.delimitNumbers(this.state.estimatedSellerNet),
			"state_id":this.state.state,
			"county_id":this.state.county
		};
		return sellerData;
	}
	
	stopSpeakToText(fieldName){
		if(fieldName == 'preparedFor'){
			this.setState({TextInput : true});
			this.refs.preparedFor.focus();
			
		}else{
			this.setState({TextInput : true}) 
		}
		val = !this.state.speakToTextVal;

		this.setState({speakToTextVal: val , speakToTextStatus : false})
		

		if(val){
			AsyncStorage.setItem('speakToTextVal',JSON.stringify(val)).then(()=> {
				console.log("Done")
			})
		}else{
			AsyncStorage.setItem('speakToTextVal',JSON.stringify(false)).then(()=> {
				console.log("Done")
			})
		}
	}


		/**=========== Start Function Added By Lovedeep For Ohio Check Box below escrow field Case (Ohio) =========**/

		handlePressCheckedBoxForOhio = (checked) =>  {

			
			if(this.state.isCheckForOhio == false) {
				if(this.state.reissueSalePrice == '0.00' || this.state.reissueSalePrice == '') {
					this.dropdown.alertWithType('error', 'Error', 'Prior Liability Amount must be entered');
				}
				this.setState({
					isCheckForOhio : !this.state.isCheckForOhio,
					reissueYearDropdownVal : 1,
					reissueSalePriceEditableStatus : false,
				}, this.callSellerEscrowSettingApi);
			} else {				
				this.setState({
					isCheckForOhio : !this.state.isCheckForOhio,
					reissueYearDropdownVal : 0,
					reissueSalePrice : '0.00',
					reissueSalePriceEditableStatus : true,
				}, this.callSellerEscrowSettingApi);
			}
		}
	
		/**=========== End Function Added By Lovedeep For Ohio Check Box below escrow field Case (Ohio) =========**/


		/**=========== Start Function Added By Lovedeep For Wisconsin Check Box below escrow field Case (Wisconsin) =========**/

		handlePressCheckedBoxForWisconsin = (checked) =>  {

			if(this.state.isCheckForWisconsin == false) {
				this.setState({
					isCheckForWisconsin : !this.state.isCheckForWisconsin,
					reissueYearDropdownVal : 1,
				}, this.callSellerEscrowSettingApi);
			} else {
				this.setState({
					isCheckForWisconsin : !this.state.isCheckForWisconsin,
					reissueYearDropdownVal : 0,
				}, this.callSellerEscrowSettingApi);
			}
		}
	
		/**=========== End Function Added By Lovedeep For Wisconsin Check Box below escrow field Case (Wisconsin) =========**/
		
		handlePressCheckedBoxFirstLoan = (checked) =>  {


			console.log(checked);


			if(this.state.isCheckForFirstLoan == false) {
				amount = this.state.sale_pr * this.state.owner_carry_loan1/100;
				amount = parseFloat(amount).toFixed(2);
				
				
				
				var owner_carry_loan_amount= 0;
				owner_carry_loan_amount = parseFloat(amount);
				if(this.state.secondLoanOwnerCarry == true){
					owner_carry_loan_amount = parseFloat(this.state.owner_carry_loan_amount2);
				}
				var buyer_cash_dp = parseFloat(this.state.sale_pr) - owner_carry_loan_amount;
				
				var amount_left_to_pay_saller = buyer_cash_dp - parseFloat(this.state.existingTotal);
				var estimatedHUDNet =  amount_left_to_pay_saller - parseFloat(this.state.totalAllCost) - parseFloat(this.state.estimatedTaxProrations);
				var seller_carried_loan = (parseFloat(this.state.sale_pr)- buyer_cash_dp);    
		//Alert.alert("est"+estimatedHUDNet, "est2"+seller_carried_loan);
				if(this.state.isCheckForSecondLoan == false) {
					this.setState({
						estimatedSellerNetCopy: this.state.estimatedSellerNet,
					});
				}
				
				this.setState({
					owner_carry_loan_amount1: amount,
					sellerCarriedLoan: seller_carried_loan,
					estimatedSellerNet: estimatedHUDNet,
				});	
				this.setState({
					firstLoanOwnerCarry : true,
					isCheckForFirstLoan : !this.state.isCheckForFirstLoan
				});
			} else {
				if(this.state.secondLoanOwnerCarry == false){
					this.setState({
						estimatedSellerNet: this.state.estimatedSellerNetCopy,
						sellerCarriedLoan: '0.00',
					});
				}
				this.setState({
					firstLoanOwnerCarry : false,
					isCheckForFirstLoan : !this.state.isCheckForFirstLoan
				});
			}
		}

		handlePressCheckedBoxForSecondLoan = (checked) =>  {
			
			if(this.state.isCheckForSecondLoan == false) {
				amount = this.state.sale_pr * this.state.owner_carry_loan2/100;
				amount = parseFloat(amount).toFixed(2);
				
				
				var owner_carry_loan_amount= 0;
				owner_carry_loan_amount = parseFloat(amount);
				var buyer_cash_dp = parseFloat(this.state.sale_pr) - owner_carry_loan_amount;
				
				var amount_left_to_pay_saller = buyer_cash_dp - parseFloat(this.state.existingTotal);
				var estimatedHUDNet =  amount_left_to_pay_saller - parseFloat(this.state.totalAllCost) - parseFloat(this.state.estimatedTaxProrations);
				var seller_carried_loan = (parseFloat(this.state.sale_pr)- buyer_cash_dp); 
				
				this.setState({
					owner_carry_loan_amount2: amount,
				});	
				
				if(this.state.isCheckForFirstLoan == false) {
					this.setState({
						estimatedSellerNetCopy: this.state.estimatedSellerNet,
					});
				}
				
				this.setState({
					secondLoanOwnerCarry : true,
					isCheckForSecondLoan : !this.state.isCheckForSecondLoan,
					estimatedSellerNet: estimatedHUDNet,
					sellerCarriedLoan: seller_carried_loan,
				});
			} else {
				if(this.state.isCheckForFirstLoan == true) {
						var owner_carry_loan_amount = parseFloat(this.state.owner_carry_loan_amount1);
						var buyer_cash_dp = parseFloat(this.state.sale_pr) - owner_carry_loan_amount;
						
						var amount_left_to_pay_saller = buyer_cash_dp - parseFloat(this.state.existingTotal);
						var estimatedHUDNet =  amount_left_to_pay_saller - parseFloat(this.state.totalAllCost) - parseFloat(this.state.estimatedTaxProrations);
						var seller_carried_loan = (parseFloat(this.state.sale_pr)- buyer_cash_dp);    
						this.setState({
							estimatedSellerNet: estimatedHUDNet,
							sellerCarriedLoan: seller_carried_loan,
						});
				}else{
					this.setState({
							sellerCarriedLoan: '0.00',
							estimatedSellerNet: this.state.estimatedSellerNetCopy,
						});
				}
				this.setState({
					secondLoanOwnerCarry : false,
					isCheckForSecondLoan : !this.state.isCheckForSecondLoan
				});
			}
		}



	// this is for updating empty fields to 0.00 on blur
	 onFocus(fieldName,viewHeight) {
		if((fieldName == 'preparedFor' || fieldName == 'salesPrice') && this.state.speakToTextVal && !this.state.TextInput) {
			this.setState({
				speakToTextStatus : true
			});
			if( this.state.speakToTextVal && !this.state.TextInput){
				if(fieldName == 'preparedFor') {
					Alert.alert(
						'Speak Value',
						'Would you like to speak value',
						[
							{text: 'Yes', onPress: () => this._startRecognizing(fieldName) , style: 'cancel'},
							{text: 'No', onPress: () => this.stopSpeakToText('preparedFor')}
						],
						{ cancelable: false }
					)
				} else {
					
					this.setState({
						speakToTextStatus : false
					});
					Alert.alert(
						'Speak Value',
						'Would you like to speak value',
						[
							{text: 'Yes', onPress: () => this._startRecognizing('sale_pr') , style: 'cancel'},
							{text: 'No', onPress: () => this.stopSpeakToText('sale_pr')}
						],
						{ cancelable: false }
					)
				}
			}
		}
		this.refs.scrollView1.scrollTo({y:viewHeight});
		if(fieldName == 'lender_address') {
			this.setState({
				enterAddressBar : true
			});
			Keyboard.dismiss();
		} else {
			fieldVal = this.state[fieldName];
			this.setState({
				defaultVal: fieldVal,
			})
			this.setState({
				enterAddressBar : false
			});
			this.setState({
				[fieldName]: '',
			}) 
		}	
	}

	measureView(event,fieldname) {
		
		if(event.nativeEvent.layout.x != '0'){
			this.setState({[fieldname]: event.nativeEvent.layout.x})
		}else{
			this.setState({[fieldname]: event.nativeEvent.layout.y})
		}
	}
	
	_onMomentumScrollEnd(){
		Keyboard.dismiss();
	}
	/*onClose(data) {
		this.dropdown.onClose();
	}*/
		
	
	/*scrollToInput() {
		const self = this;
			this.refs.myInput.measure((ox, oy, width, height, px, py) => {
				self.refs.myScrollView.scrollTo({y: oy - 200});
			});
		
		/*const scrollResponder = this.refs.myScrollView.getScrollResponder();
		
		const inputHandle = findNodeHandle(this.refs.myInput);

		scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
			inputHandle, // The TextInput node handle
			110, // The scroll view's bottom "contentInset" (default 0)
			true // Prevent negative scrolling
		);*/
	//}
	
    render() {
		if(this.state.animating == 'true') {
			this.state.scrollvalue = false;
			this.state.visble = true;
		} else {
			this.state.scrollvalue = true;
			this.state.visble = false;
		}
		
		let recordButton;
		if (!this.state.isRecording) {
			recordButton = <TouchableOpacity style={{width:'20%'}} onPress={ () => {this.startRecording()}}><Image source={Images.play} style={BuyerStyle.camera_play_pause}/></TouchableOpacity>
		} else {
			recordButton = <TouchableOpacity style={{width:'20%'}} onPress={ () => {this.stopRecording()}}><Image source={Images.pause} style={BuyerStyle.camera_play_pause}/></TouchableOpacity>
		}

		let typeButton;
		if (this.state.camera.type === Camera.constants.Type.back) {
		  typeButton = <Button
			onPress={this.switchType}
			title="Switch Camera Mode (back)"
			color="#841584">
		  </Button>
		} else {
		  typeButton = <Button
			onPress={this.switchType}
			title="Switch Camera Mode (front)"
			color="#841584">
		  </Button>
		}

		let showable;
		if(this.state.connectionInfo != 'none' && this.state.openMessagePopup == false && this.state.openMultipleOfferPopup == false) {
			showable=	<View style={Styles.TopContainer}>
			<View style={Styles.iphonexHeader}></View>

			<Modal 
				transparent={true}
				visible={this.state.voiceInput}
				onRequestClose={() => null}
			>
				<View style={dashboardStyle.PopupParent}>
					<View	style={[dashboardStyle.BounceView]}>
						<View style={[dashboardStyle.PopupContainer]}>
						<Image style={dashboardStyle.imageStyle} source={Images.micIcon} />
								<Text>
								{this.state.speakTextStatus}
								</Text>
							<View style={dashboardStyle.BottomButtonContainer}>
								<TouchableOpacity style={dashboardStyle.ButtonBorder1} onPress={()=>{this.setState({voiceInput:false})}}>
									<Text style={dashboardStyle.buttonText1}>Cancel</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>	
				</View>
			</Modal>
			<View style={Styles.outerContainer}>

			<View style={{ flex: 1 }}>
				<Spinner visible={this.state.visble} textContent={this.state.loadingText} textStyle={{color: '#FFF'}} />
			</View>

			<View style={
				this.state.multipleOfferStatus == true ? BuyerStyle.HeaderContainerMultipleOffer: BuyerStyle.HeaderContainer}>
				<Image 
				style={
					this.state.multipleOfferStatus == true ? BuyerStyle.HeaderBackgroundMultipleOffer : BuyerStyle.HeaderBackground
				} 
				source={Images.header_background}></Image>
				<TouchableOpacity style={this.state.multipleOfferStatus == true ? {width:'20%', marginTop : -8} : {width:'20%'}} onPress={this.onBackHomePress.bind(this)}>
					<Image style={BuyerStyle.back_icon} source={Images.back_icon}/>
				</TouchableOpacity>
				{this.state.multipleOfferStatus == true ? <Text style={BuyerStyle.header_title}>{STRINGS.t('Seller_Multiple_Offer')}</Text> : <Text style={BuyerStyle.header_title}>{STRINGS.t('Seller_Closing_Cost')}</Text>}
				<View style={this.state.multipleOfferStatus == true ? {alignItems:'flex-start',width:'20%',paddingRight:20, marginTop : -8} : {alignItems:'flex-start',width:'20%',paddingRight:20}}>
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
						height : 220,
						left: null,
						right: 0,
						marginRight: 8,
						marginTop: 70
						}}
				  />
				</View> 
			</View>


				{renderIf(this.state.footer_tab == 'seller')(
					<View style={{height:'100%',width:'100%'}}>


						<View style={Styles.headerwrapper} >
							<View style={Styles.subHeaderNewDesign}>

								{renderIf(this.state.multipleOfferStatus == true)(
									<View style={{paddingRight:10,paddingLeft:10,paddingTop:10,flexDirection: 'row'}}>
										<View style={{width:'100%', flexDirection: 'row'}}>
											<TouchableOpacity style={{width : '20%', height : 30, backgroundColor : '#ff471a', borderWidth:0.8, borderColor:'#ffffff', borderRadius:5}}>
												<Text style={{textAlign : 'center', marginTop:5, alignItems :'center', color : '#ffffff'}}>Offer # {this.state.offerCounter}</Text>
											</TouchableOpacity>

										{this.state.editModeStatus == true ? <TouchableOpacity style={{width : '30%', height : 30, backgroundColor : 'transparent'}}></TouchableOpacity> :<TouchableOpacity style={{width : '40%', height : 30, backgroundColor : 'transparent'}}></TouchableOpacity>}
											<TouchableOpacity style={{width : '23%', height : 30, backgroundColor : '#0c74c5', borderWidth:0.8, borderColor:'#0c74c5', borderRadius:5}}   
											onPress={() => this.nextOffer()}>
												<Text style={{textAlign : 'center', marginTop:5, alignItems :'center', color : '#ffffff'}}>Next Offer</Text>
											</TouchableOpacity>
											<TouchableOpacity style={{width : '2%', height : 30, backgroundColor : 'transparent'}}>
											</TouchableOpacity>
											<TouchableOpacity onPress={() => this.popupShowMultipleOffer()} style={{width : '15%', height : 30, backgroundColor : '#0c74c5', borderWidth:0.8, borderColor:'#0c74c5', borderRadius:5}}>
												<Text style={{textAlign : 'center', marginTop:5, alignItems :'center', color : '#ffffff'}}>Done</Text>
											</TouchableOpacity>
											{this.state.editModeStatus == true ? <TouchableOpacity style={SellerStyle.savecalcvaluesmall} onPress={() => this.onDeleteSavedOrder()}><Image source={Images.recycle}/></TouchableOpacity> : null}
										</View>	
									</View>
								)}

									<View style={{paddingRight:10,paddingLeft:10,paddingTop:10,flexDirection: 'row'}}>
										<View style={{width:'48%'}}>
											
											{this.state.speakToTextVal && !this.state.TextInput ?
											<TextInput onFocus={() => this.onFocus('preparedFor')} selectTextOnFocus={ true } ref="preparedFor" 
											autoCapitalize = 'words'
											onEndEditing={ (event) => this.onCallPreparedForField(this.state.preparedFor,'preparedFor')}

											style={Styles.headerTextInputField} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({preparedFor: value})} value={this.state.preparedFor}/>
											 : 
											<TextInput onFocus={() => this.onFocus('preparedFor')} selectTextOnFocus={ true } ref="preparedFor" 
											autoCapitalize = 'words'
											onEndEditing={ (event) => this.onCallPreparedForField(event.nativeEvent.text,'preparedFor')}
											style={Styles.headerTextInputField} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({preparedFor: value})} value={this.state.preparedFor}/>}
										</View>
										<View style={{width:'48%',marginLeft:'4%'}}>
										{this.state.speakToTextVal && !this.state.TextInput ?
											<CustomTextInput customKeyboardType="hello" 
												selectTextOnFocus={ true } 
												ref="salesPrice"
												allowFontScaling={false}
												onKeyPress={() => this.onFocus('salesPrice')}
												name={this.state.speakToTextStatus}
												//autoFocus={this.state.autoFocusStatus}
												onBlur={() => this.onBlur("salesPrice")} 
												underlineColorAndroid = 'transparent' style={Styles.headerTextInputField} onChangeText={(value) => this.setState({sale_pr:this.onChange(value)})}
												placeholder='Sale Price'
												value={ this.state.sale_pr == '0.00' ? this.state.sale_pr_empty : this.delimitNumbers(this.state.sale_pr) } 
												 />
											:
										<CustomTextInput customKeyboardType="hello" 
												//onFocus={() => this.onFocus('salesPrice')} 
												selectTextOnFocus={ true } 
												ref="salesPrice" 
												allowFontScaling={false}
												name={this.state.speakToTextStatus}
												//autoFocus={true}
												onKeyPress={() => this.onFocus('salesPrice')}
												autoFocus={this.state.autoFocusStatus}
												onBlur={() => this.onBlur("salesPrice")} 
												underlineColorAndroid = 'transparent' style={Styles.headerTextInputField} onChangeText={(value) => this.setState({sale_pr:this.onChange(value)})}
												placeholder='Sale Price'
												value={ this.state.sale_pr == '0.00' ? this.state.sale_pr_empty : this.delimitNumbers(this.state.sale_pr) } 
										/>	}										
										</View>
									</View>
									
									
									<View style={[Styles.scrollable_container_child,{paddingRight:10,paddingLeft:10,paddingTop:5}]}>
										<GooglePlacesAutocomplete
															placeholder='Enter Address'
															minLength={2} 
															autoFocus={false}
															listViewDisplayed='true' 
															fetchDetails={true}
															styles={{
																predefinedPlacesDescription: {
																	color: '#000000',
																	marginTop : 0,
																	height : 0,
																	width : 0,
																},
																listView : {
																	flex: 1,
																	position : 'absolute',
																	width : '100%',
																	zIndex : 1,
																	elevation : 15,
																	backgroundColor : '#fff',
																	top : '100%',
																	maxHeight:'55%',
																	borderWidth: 1,
																	borderRadius: 4,
																	borderColor: '#000',
																	

																},
																textInput: {
																width : '100%',
																height: 30,
																borderWidth: 1,
																borderRadius: 4,
																backgroundColor: '#F5FCFF',
																padding: 0,
																paddingLeft:3,
																borderColor: 'transparent',
																marginTop:0,
																marginLeft:0,
																marginRight:0,
																},

																poweredContainer : {
																	opacity : 0
																},

																textInputContainer : {
																	borderWidth: 1,
																	borderRadius: 4,
																	borderColor: 'transparent',
																	paddingLeft : 0,
																	paddingRight : 0,
																	marginTop : 0,
																	height: 30
																}
															
															
															}}
															renderDescription={row => row.description || row.vicinity} 
															onPress={(data, details = null) => {
																
																
																console.log("selected details " + JSON.stringify(details));

																this.setState({
																	lender_address : data.structured_formatting.main_text,
																	default_address : data.description

																});	
																for (var i = 0; i < details.address_components.length; i++) {
																	var addressStr = '';	
																	if(details.address_components[i].types[0] == 'locality') {
																		this.setState({
																			city : details.address_components[i].long_name
																		});
																	} else if(details.address_components[i].types[0] == 'administrative_area_level_1') {
																		this.setState({
																			user_state : details.address_components[i].short_name
																		});
																	} else if(details.address_components[i].types[0] == 'postal_code') {
																		if(details.address_components[i].long_name == "" || details.address_components[i].long_name == 'null' || details.address_components[i].long_name == 'undefined') {
																			this.setState({
																				postal_code : ''
																			});
																		} else {
																			this.setState({
																				postal_code : details.address_components[i].long_name
																			});
																		}
																	}
																}
											
																this.setState({
																	enterAddressBar : false
																});
															}}
															getDefaultValue={() => this.state.default_address != "" ? this.state.default_address : ""}

															query={{
																key: GLOBAL.GOOGLE_PLACE_API_KEY,
																language: 'en',
																types: 'address',
															}}
							
																currentLocation={false}
															/>			
									</View>
									
									
                    				<View style={{flexDirection: 'row',paddingRight:10,paddingLeft:10,paddingTop:5, zIndex :-1}}>
										<View style={{width:'48%'}}>
											<TextInput onFocus={() => this.onFocus('state_code')} selectTextOnFocus={ true } style={Styles.headerTextInputField} placeholder='State' underlineColorAndroid='transparent' onChangeText={(value) => this.setState({state_code: value})} value={this.state.state_code}/>
										</View>
										<View style={{width:'48%',marginLeft:'4%'}}>
											<TextInput onFocus={() => this.onFocus('postal_code')} selectTextOnFocus={ true } style={Styles.headerTextInputField} placeholder='Zip Code' underlineColorAndroid='transparent' 
											onEndEditing={(event) => this.updatePostalCode(event.nativeEvent.text,'postal_code')}
											onChangeText={(value) => this.setState({postal_code: this.onChange(value)})} value={this.state.postal_code.toString()}/>
										</View>
									</View>
									
									{renderIf(this.state.multipleOfferStatus == true)(
										<View style={{flexDirection: 'row',paddingRight:10,paddingLeft:10,paddingTop:5, zIndex :-1}}>
										<View style={{width:'100%'}}>
											<TextInput onFocus={() => this.onFocus('buyerName')} selectTextOnFocus={ true } style={Styles.headerTextInputField} placeholder='Buyer Name' underlineColorAndroid='transparent' onChangeText={(value) => this.setState({buyerName: value})} value={this.state.buyerName}/>
										</View>
										</View>
									)}
									

									<View style={[Styles.segmentViewNewDesign,{paddingRight:10,paddingLeft:10, zIndex :-1}]}>
								
										<View style={[Styles.segmentButtonBackgroundView,(this.state.tab == 'FHA') ? {backgroundColor:'#000000'}:{}]}>
											<TouchableOpacity style={Styles.segmentButtonNewDesign} onPress={() => this.settingsApi("FHA")}>
											<Text style={Styles.style_btnTextNewDesign}>{STRINGS.t('FHA')}</Text>
											</TouchableOpacity>
										</View>

										<View style={Styles.verticalLineForSegmentNewDesign}></View>

										<View style={[Styles.segmentButtonBackgroundView,(this.state.tab == 'VA') ? {backgroundColor:'#000000'}:{}]}>
											<TouchableOpacity style={Styles.segmentButtonNewDesign} onPress={() => this.settingsApi("VA")}>
											<Text style={Styles.style_btnTextNewDesign}>{STRINGS.t('VA')}</Text>
											</TouchableOpacity>
										</View>

										<View style={Styles.verticalLineForSegmentNewDesign}></View>

										<View style={[Styles.segmentButtonBackgroundView,(this.state.tab == 'USDA') ? {backgroundColor:'#000000'}:{}]}>
											<TouchableOpacity style={Styles.segmentButtonNewDesign} onPress={() => this.settingsApi("USDA")}>
											<Text style={Styles.style_btnTextNewDesign}>{STRINGS.t('USDA')}</Text>
											</TouchableOpacity>
										</View>

										<View style={Styles.verticalLineForSegmentNewDesign}></View>

										<View style={[Styles.segmentButtonBackgroundView,(this.state.tab == 'CONV') ? {backgroundColor:'#000000'}:{}]}>
											<TouchableOpacity style={Styles.segmentButtonNewDesign} onPress={() => this.settingsApi("CONV")}>
											<Text style={Styles.style_btnTextNewDesign}>{STRINGS.t('Conv')}</Text>
											</TouchableOpacity>
										</View>

										<View style={Styles.verticalLineForSegmentNewDesign}></View>
										<View style={[Styles.segmentButtonBackgroundView,(this.state.tab == 'CASH') ? {backgroundColor:'#000000'}:{}]}>
											<TouchableOpacity style={Styles.segmentButtonNewDesign} onPress={() => this.settingsApi("CASH")}>
											<Text style={Styles.style_btnTextNewDesign}>{STRINGS.t('Cash')}</Text>
											</TouchableOpacity>
										</View>
										<View style={BuyerStyle.verticalLineForSegmentNewDesign}></View>
										<View style={[BuyerStyle.segmentButtonBackgroundView,(this.state.tab == 'Owner_Carry') ? {backgroundColor:'#000000'}:{}]}>
											<TouchableOpacity style={BuyerStyle.segmentButtonNewDesign} onPress={() => this.settingsApi("Owner_Carry")}>
											<Text style={BuyerStyle.style_btnTextNewDesign}>{STRINGS.t('Owner_Carry')}</Text>
											</TouchableOpacity>
										</View>
									</View>
									
									
									<View style={[Styles.segmentContainerNewDesign,{flexDirection:'row',marginTop:5, zIndex :-1}]}>
											<View style={[Styles.subHeaderNewDesignSubPart,(this.state.tab == 'Owner_Carry') ? {alignSelf:'center',width:'50%',backgroundColor: '#000000'} : {alignSelf:'center',width:'100%',backgroundColor: '#000000'}]}>
												<View style={{alignSelf:'center',flexDirection: 'row'}}>
													<View>
														<Text style={{color:"#0598c9",fontSize: 18,fontWeight: 'bold'}}>
															{STRINGS.t('Est_Seller_Net')}
														</Text>
													</View>
												</View>
												
												<View style={{alignSelf:'center',flexDirection: 'row',marginTop: 2}}>
													<View>
														<View style={{flexDirection: 'row'}}>

															{this.state.estimatedSellerNet < 0 ? 															<Text style={{color:"#ff2525",fontSize: 22,fontWeight: 'bold',}}>
																$ {this.delimitNumbers(this.state.estimatedSellerNet)}
															</Text>
															:

															<Text style={{color:"#0598c9",fontSize: 22,fontWeight: 'bold',}}>
															$ {this.delimitNumbers(this.state.estimatedSellerNet)}
														</Text>

															}

														</View>
													</View>
												</View>
											</View>
											{renderIf(this.state.tab == 'Owner_Carry')(	
											<View style={[Styles.subHeaderNewDesignSubPart,{alignSelf:'center',width:'50%',backgroundColor: '#000000'}]}>
												<View style={{alignSelf:'center',flexDirection: 'row'}}>
													<View>
														<Text style={{color:"#0598c9",fontSize: 18,fontWeight: 'bold'}}>
															Seller Carried Loan
														</Text>
													</View>
												</View>
												
												<View style={{alignSelf:'center',flexDirection: 'row',marginTop: 2}}>
													<View>
														<View style={{flexDirection: 'row'}}>

															{this.state.sellerCarriedLoan < 0 ? 															<Text style={{color:"#ff2525",fontSize: 22,fontWeight: 'bold',}}>
																$ {this.delimitNumbers(this.state.sellerCarriedLoan)}
															</Text>
															:

															<Text style={{color:"#0598c9",fontSize: 22,fontWeight: 'bold',}}>
															$ {this.delimitNumbers(this.state.sellerCarriedLoan)}
														</Text>

															}

														</View>
													</View>
												</View>
											</View>
											)}
										</View>
									
							
									</View>
						</View>
						<View style={(this.state.initialOrientation == 'portrait') ? (this.state.orientation == 'portrait') ? Styles.scrollviewheight : Styles.scrollviewheightlandscape : (this.state.orientation == 'landscape') ? Styles.scrollviewheight : Styles.scrollviewheightlandscape}>
							<ScrollView
								scrollEnabled={this.state.scrollvalue}
								showsVerticalScrollIndicator={true}
								keyboardShouldPersistTaps="always"
								//keyboardDismissMode='on-drag'
								style={Styles.sellerscrollview}
								ref="scrollView1"
								onTouchStart={this._onMomentumScrollEnd}
								
							>   
								<View style={[Styles.scrollable_container_child, {marginTop:10}]}>
										<View style={Styles.title_justify}>
											<Text style={Styles.text_style}>{STRINGS.t('est_settlement_date')}</Text>
										</View>
										<View style={{width:'30%',justifyContent:'center'}}>
											<View style={Styles.alignrightinput}>
												<DatePicker ref="Date" style={{width:'100%', paddingVertical : 5}} date={this.state.date} showIcon={false} mode="date" placeholder="select date" format="MM-DD-YYYY" confirmBtnText="Confirm" cancelBtnText="Cancel" customStyles={{dateInput: {borderWidth:0}}} onDateChange={(date) => this.setState({date: date}, this.onDateChangeVal(date))}
											/>
											</View>
											<View style={[Styles.fullunderline,]}></View>
										</View>
								</View>
								{renderIf(this.state.tab != 'CASH' && this.state.tab != 'USDA' && this.state.tab != 'VA' && this.state.tab != 'FHA' && this.state.tab != 'Owner_Carry')(	
									<View style={[Styles.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'conventionalLoanHeight')}>
										<View style={Styles.title_justify}>
											<Text style={Styles.text_style}>{STRINGS.t('conventional')}</Text>
										</View>
										<View style={{width:'30%',justifyContent:'center'}}>
											<View style={Styles.alignrightinput}>
												<Text style={Styles.alignCenter}>% </Text>
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('conventionalLoan',this.state.conventionalLoanHeight)} selectTextOnFocus={ true } placeholder='0.00'  
												onEndEditing={ (event) => this.onChangeConventionalField(event.nativeEvent.text,'conventionalLoan')}
												style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({conventionalLoan: this.onChange(value)})} value={this.delimitNumbers(this.state.conventionalLoan)}/>
											</View>
											<View style={[Styles.fullunderline, ]}></View>
										</View>
									</View>
								)}

								{renderIf(this.state.tab == 'Owner_Carry') (
									<View style={BuyerStyle.loandetailhead} onLayout={(event) => this.measureView(event,'ltvHeight')}>
										<View style={[BuyerStyle.existingfirstOwnerCarry]}>
											<Text style={{marginLeft:'5%', marginTop : 12, color:"#404040",fontFamily:'roboto-regular',fontSize:16,}}>Owner Carry</Text>
										</View>
										<View style={[BuyerStyle.existingfirstbalanceOwnerCarry]}>
											<CheckBox right={true} uncheckedColor="#3b90c4" containerStyle={{ backgroundColor:'#ffffff', borderWidth:0}} center checkedColor='#3b90c4' checked={this.state.isCheckForFirstLoan} 
												onPress={this.handlePressCheckedBoxFirstLoan}
											/>

										</View>
										<View style={[BuyerStyle.existingfirstbalanceOwnerCarryText]}>
										<Text style={BuyerStyle.headerloanratiotextOwnerCarry}>
												{STRINGS.t('1_loan')}
											</Text>
										</View>	


										<View style={[BuyerStyle.existingfirstbalanceOwnerCarry]}>
											<CheckBox right={true} uncheckedColor="#3b90c4" containerStyle={{ backgroundColor:'#ffffff', borderWidth:0}} center checkedColor='#3b90c4' checked={this.state.isCheckForSecondLoan} 
												onPress={this.handlePressCheckedBoxForSecondLoan}
											/>
							
										</View>
										<View style={[BuyerStyle.existingfirstbalanceOwnerCarryText]}>
											<Text style={BuyerStyle.headerloanratiotextOwnerCarry}>
												{STRINGS.t('2_loan')}
											</Text>
										</View>		
									</View>
								)}

								{renderIf(this.state.tab == 'Owner_Carry' && this.state.firstLoanOwnerCarry == false && this.state.secondLoanOwnerCarry == false)(
										<View onLayout={(event) => this.measureView(event,'ownerAmount1Height')}>
										<View style={[BuyerStyle.fullunderline, {marginTop:10}]}></View>
										<View style={[BuyerStyle.loandetailhead,{marginTop:10}]}>
											<View style={BuyerStyle.existingfirstLoanAmount}>
												<Text style={[BuyerStyle.loanstext,{marginTop:0,marginLeft:10}]}>Amount</Text>
											</View>
											<View style={BuyerStyle.existingfirstbalanceLoanAmount}>
												<View style={{width:'100%',flexDirection:'row'}}>
													<Text style={BuyerStyle.alignCenter}>$ </Text>
											
													<CustomTextInput allowFontScaling={false} customKeyboardType="hello" 	selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onKeyPress={() => this.onFocus('owner_amount1',this.state.ownerAmount1Height)}  
													onChangeText={(value) => this.setState({owner_amount1: this.onChange(value)})} 										
													onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'owner_amount1',this.downPaymentChange.bind(this,event.nativeEvent.text)) }
													value={this.delimitNumbers(this.state.owner_amount1)}/>


												</View>
												<View style={BuyerStyle.textboxunderline}>
													<View style={[BuyerStyle.fullunderline, ]}></View>
												</View>
											</View>
											<View style={BuyerStyle.existingfirstbalanceLoanAmount}>
												<View style={{width:'100%',flexDirection:'row'}}>
												<Text style={BuyerStyle.alignCenter}>$ </Text>
													<CustomTextInput allowFontScaling={false} customKeyboardType="hello" 	selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onKeyPress={() => this.onFocus('owner_amount2',this.state.ownerAmount1Height)}  
													onChangeText={(value) => this.setState({owner_amount2: this.onChange(value)})} 										
													onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'owner_amount2',this.onChange.bind(this,event.nativeEvent.text)) }
													value={this.delimitNumbers(this.state.owner_amount2)}/>
												</View>
												<View style={BuyerStyle.textboxunderline}>
													<View style={[BuyerStyle.fullunderline, ]}></View>
												</View>
											</View>
										</View>
										<View style={[BuyerStyle.fullunderline, {marginTop:10}]}></View>
									</View>
								)}

								{renderIf(this.state.tab == 'Owner_Carry' && (this.state.firstLoanOwnerCarry == true || this.state.secondLoanOwnerCarry == true))(
									<View style={Styles.loandetailhead} onLayout={(event) => this.measureView(event,'ownerCarryLoan1Height')}>
										<View style={Styles.existingfirst}>
											<Text style={Styles.existingheadtext}>OC Loan </Text>
										</View>
										<View style={Styles.existingfirstbalance}>
												<View style={{width:'100%',flexDirection:'row'}}>
													<Text style={Styles.existingtext}>%</Text>
													<CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('owner_carry_loan1',this.state.ownerCarryLoan1Height)} selectTextOnFocus={ true }
													placeholder='0.00'		
													ref="owner_carry_loan1"
													keyboardType="numeric" 
													//onBlur={() => this.dismissKeyboard("salesPrice")} 
													onEndEditing={ (event) => this.updateFormFieldForLoanTobePaid(event.nativeEvent.text,'owner_carry_loan1')}
													style={[Styles.width70,{alignSelf:'center'}]} underlineColorAndroid='transparent' 
													onChangeText={(value) => this.setState({owner_carry_loan1: this.onChange(value)})} 
													value={this.delimitNumbers(this.state.owner_carry_loan1)}
													
													/>
												</View>
											<View style={Styles.textboxunderline}>
												<View style={[Styles.fullunderline, ]}></View>
											</View>
										</View>

										{renderIf(this.state.tab == 'Owner_Carry' && (this.state.secondLoanOwnerCarry == true || this.state.firstLoanOwnerCarry == true))(
											<View style={Styles.existingfirstbalance}>
											<View style={{width:'100%',flexDirection:'row'}}>
												<Text style={Styles.existingtext}> </Text>
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('owner_carry_loan2',this.state.ownerCarryLoan1Height)} selectTextOnFocus={ true } placeholder='0.00' ref="owner_carry_loan2" keyboardType="numeric" 
												onEndEditing={ (event) => this.updateFormFieldForLoanTobePaid(event.nativeEvent.text,'owner_carry_loan2')}


												style={Styles.width70} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({owner_carry_loan2: this.onChange(value)})} value={this.delimitNumbers(this.state.owner_carry_loan2)}/>

											</View>
											<View style={Styles.textboxunderline}>
												<View style={[Styles.fullunderline, ]}></View>
											</View>
											</View>
										)}
									</View>
								)}

								{renderIf(this.state.tab == 'Owner_Carry' && (this.state.firstLoanOwnerCarry == true || this.state.secondLoanOwnerCarry == true))(
									<View style={Styles.loandetailhead} onLayout={(event) => this.measureView(event,'ownerCarryLoanAmount1Height')}>
										<View style={Styles.existingfirst}>
											<Text style={Styles.existingheadtext}>OC Loan Amount </Text>
										</View>
										<View style={Styles.existingfirstbalance}>
												<View style={{width:'100%',flexDirection:'row'}}>
													<Text style={Styles.existingtext}>$</Text>
													<CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('owner_carry_loan_amount1',this.state.ownerCarryLoanAmount1Height)} selectTextOnFocus={ true }
													placeholder='0.00'		
													ref="owner_carry_loan_amount1"
													keyboardType="numeric" 
													//onBlur={() => this.dismissKeyboard("salesPrice")} 
													onEndEditing={ (event) => this.updateFormFieldForLoanTobePaid(event.nativeEvent.text,'owner_carry_loan_amount1')}
													style={[Styles.width70,{alignSelf:'center'}]} underlineColorAndroid='transparent' 
													onChangeText={(value) => this.setState({owner_carry_loan_amount1: this.onChange(value)})} 
													value={this.delimitNumbers(this.state.owner_carry_loan_amount1)}
													
													/>
												</View>
											<View style={Styles.textboxunderline}>
												<View style={[Styles.fullunderline, ]}></View>
											</View>
										</View>

								{renderIf(this.state.tab == 'Owner_Carry' && (this.state.secondLoanOwnerCarry == true || this.state.firstLoanOwnerCarry == true))(
											<View style={Styles.existingfirstbalance}>
											<View style={{width:'100%',flexDirection:'row'}}>
												<Text style={Styles.existingtext}> </Text>
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('owner_carry_loan_amount2',this.state.ownerCarryLoanAmount1Height)} selectTextOnFocus={ true } placeholder='0.00' ref="owner_carry_loan_amount2" keyboardType="numeric" 
												onEndEditing={ (event) => this.updateFormFieldForLoanTobePaid(event.nativeEvent.text,'owner_carry_loan_amount2')}


												style={Styles.width70} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({owner_carry_loan_amount2: this.onChange(value)})} value={this.delimitNumbers(this.state.owner_carry_loan_amount2)}/>

											</View>
											<View style={Styles.textboxunderline}>
												<View style={[Styles.fullunderline, ]}></View>
											</View>
											</View>
										)}
									</View>
								)}


								{renderIf(this.state.tab == 'Owner_Carry' && (this.state.firstLoanOwnerCarry == true || this.state.secondLoanOwnerCarry == true))(
									<View style={Styles.loandetailhead} onLayout={(event) => this.measureView(event,'interestRate1Height')}>
										<View style={Styles.existingfirst}>
											<Text style={Styles.existingheadtext}>Interest Rate </Text>
										</View>
										<View style={Styles.existingfirstbalance}>
											{renderIf(this.state.tab == 'Owner_Carry' && this.state.firstLoanOwnerCarry == true)(
											<View>
												<View style={{width:'100%',flexDirection:'row'}}>
													<Text style={Styles.existingtext}>%</Text>
													<CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('interest_rate1',this.state.interestRate1Height)} selectTextOnFocus={ true }
													placeholder='0.00'		
													ref="interest_rate1"
													keyboardType="numeric" 
													//onBlur={() => this.dismissKeyboard("salesPrice")} 
													onEndEditing={ (event) => this.updateFormFieldForLoanTobePaid(event.nativeEvent.text,'interest_rate1')}
													style={[Styles.width70,{alignSelf:'center'}]} underlineColorAndroid='transparent' 
													onChangeText={(value) => this.setState({interest_rate1: this.onChange(value)})} 
													value={this.delimitNumbers(this.state.interest_rate1)}
													
													/>
												</View>
												<View style={Styles.textboxunderline}>
													<View style={[Styles.fullunderline, ]}></View>
												</View>
											</View>	
											)}	
										</View>
										
										{renderIf(this.state.tab == 'Owner_Carry' && this.state.secondLoanOwnerCarry == true)(
											<View style={Styles.existingfirstbalance}>
											<View style={{width:'100%',flexDirection:'row'}}>
												<Text style={Styles.existingtext}> </Text>
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('interest_rate2',this.state.interestRate1Height)} selectTextOnFocus={ true } placeholder='0.00' ref="interest_rate2" keyboardType="numeric" 
												onEndEditing={ (event) => this.updateFormFieldForLoanTobePaid(event.nativeEvent.text,'interest_rate2')}


												style={Styles.width70} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({interest_rate2: this.onChange(value)})} value={this.delimitNumbers(this.state.interest_rate2)}/>

											</View>
											<View style={Styles.textboxunderline}>
												<View style={[Styles.fullunderline, ]}></View>
											</View>
											</View>
										)}
									</View>
								)}	

								{renderIf(this.state.tab == 'Owner_Carry' && (this.state.firstLoanOwnerCarry == true || this.state.secondLoanOwnerCarry == true))(
									<View style={Styles.loandetailhead} onLayout={(event) => this.measureView(event,'termInYear1Height')}>
										<View style={Styles.existingfirst}>
											<Text style={Styles.existingheadtext}>Term in Years </Text>
										</View>
										
										<View style={Styles.existingfirstbalance}>
											{renderIf(this.state.tab == 'Owner_Carry' && this.state.firstLoanOwnerCarry == true)(
											<View>
												<View style={{width:'100%',flexDirection:'row'}}>
													<Text style={Styles.existingtext}> </Text>
													<CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('term_in_year1',this.state.termInYear1Height)} selectTextOnFocus={ true }
													placeholder='0.00'		
													ref="term_in_year1"
													keyboardType="numeric" 
													//onBlur={() => this.dismissKeyboard("salesPrice")} 
													onEndEditing={ (event) => this.updateFormFieldForLoanTobePaid(event.nativeEvent.text,'term_in_year1')}
													style={[Styles.width70,{alignSelf:'center'}]} underlineColorAndroid='transparent' 
													onChangeText={(value) => this.setState({term_in_year1: this.onChange(value)})} 
													value={this.delimitNumbers(this.state.term_in_year1)}
													
													/>
												</View>
												<View style={Styles.textboxunderline}>
													<View style={[Styles.fullunderline, ]}></View>
												</View>
											</View>
											)}
										</View>
										
										{renderIf(this.state.tab == 'Owner_Carry' && this.state.secondLoanOwnerCarry == true)(
											<View style={Styles.existingfirstbalance}>
											<View style={{width:'100%',flexDirection:'row'}}>
												<Text style={Styles.existingtext}> </Text>
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('term_in_year2',this.state.termInYear1Height)} selectTextOnFocus={ true } placeholder='0.00' ref="term_in_year2" keyboardType="numeric" 
												onEndEditing={ (event) => this.updateFormFieldForLoanTobePaid(event.nativeEvent.text,'term_in_year2')}


												style={Styles.width70} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({term_in_year2: this.onChange(value)})} value={this.delimitNumbers(this.state.term_in_year2)}/>

											</View>
											<View style={Styles.textboxunderline}>
												<View style={[Styles.fullunderline, ]}></View>
											</View>
											</View>
										)}
									</View>
								)}

								{renderIf(this.state.tab == 'Owner_Carry' && (this.state.firstLoanOwnerCarry == true || this.state.secondLoanOwnerCarry == true))(
									<View style={Styles.loandetailhead} onLayout={(event) => this.measureView(event,'dueInYear1Height')}>
										<View style={Styles.existingfirst}>
											<Text style={Styles.existingheadtext}>All Due Year </Text>
										</View>
										
										<View style={Styles.existingfirstbalance}>
										{renderIf(this.state.tab == 'Owner_Carry' && this.state.firstLoanOwnerCarry == true)(
										<View>
												<View style={{width:'100%',flexDirection:'row'}}>
													<Text style={Styles.existingtext}> </Text>
													<CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('due_in_year1',this.state.dueInYear1Height)} selectTextOnFocus={ true }
													placeholder='0.00'		
													ref="due_in_year1"
													keyboardType="numeric" 
													//onBlur={() => this.dismissKeyboard("salesPrice")} 
													onEndEditing={ (event) => this.updateFormFieldForLoanTobePaid(event.nativeEvent.text,'due_in_year1')}
													style={[Styles.width70,{alignSelf:'center'}]} underlineColorAndroid='transparent' 
													onChangeText={(value) => this.setState({due_in_year1: this.onChange(value)})} 
													value={this.delimitNumbers(this.state.due_in_year1)}
													
													/>
												</View>
											<View style={Styles.textboxunderline}>
												<View style={[Styles.fullunderline, ]}></View>
											</View>
											</View>
											)}
										</View>
										
										{renderIf(this.state.tab == 'Owner_Carry' && this.state.secondLoanOwnerCarry == true)(
											<View style={Styles.existingfirstbalance}>
											<View style={{width:'100%',flexDirection:'row'}}>
												<Text style={Styles.existingtext}> </Text>
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('due_in_year2',this.state.dueInYear1Height)} selectTextOnFocus={ true } placeholder='0.00' ref="due_in_year2" keyboardType="numeric" 
												onEndEditing={ (event) => this.updateFormFieldForLoanTobePaid(event.nativeEvent.text,'due_in_year2')}


												style={Styles.width70} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({due_in_year2: this.onChange(value)})} value={this.delimitNumbers(this.state.due_in_year2)}/>

											</View>
											<View style={Styles.textboxunderline}>
												<View style={[Styles.fullunderline, ]}></View>
											</View>
											</View>
										)}
									</View>
								)}	



								{renderIf(this.state.multipleOfferStatus == true)(
									<View style={[Styles.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'buyerDownPaymentHeight')}>
										<View style={Styles.title_justify}>
											<Text style={Styles.text_style}>{STRINGS.t('Buyer_Down_Payment')}</Text>
										</View>
										<View style={{width:'30%',justifyContent:'center'}}>
											<View style={Styles.alignrightinput}>
											{renderIf(this.state.percentStatus == false && this.state.dollarStatus == false)(
													<Text style={Styles.alignCenter}>$/% </Text>	
											)}
											{renderIf(this.state.percentStatus == true)(
													<Text style={Styles.alignCenter}>% </Text>
											)}
											{renderIf(this.state.dollarStatus == true)(
													<Text style={Styles.alignCenter}>$ </Text>
											)}
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('buyerDownPayment',this.state.buyerDownPaymentHeight)} selectTextOnFocus={ true } placeholder='0.00'  
												onEndEditing={ (event) => this.onChange(event.nativeEvent.text,'buyerDownPayment')}
												style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({buyerDownPayment: this.onChange(value)})} value={this.delimitNumbers(this.state.buyerDownPayment)}/>
											</View>
											<View style={[Styles.fullunderline, ]}></View>
										</View>
									</View>
								)}

								<View style={[Styles.fullunderline, {marginTop:10}]}></View>
									<Text style={[Styles.loanstext,{textAlign:'center'}]}>{STRINGS.t('LoansToBePaid')}</Text>
								<View style={[Styles.fullunderline, {marginTop:10}]}></View>
								<View style={Styles.loanstopaybox}>
									<View style={Styles.headerloanratio}>
										<Text style={Styles.headerloanratiotext}>{STRINGS.t('balance')}</Text>
										<Text style={Styles.headerloanratiotext}>{STRINGS.t('rate')}</Text>
									</View>
								</View>
								<View style={Styles.loandetailhead} onLayout={(event) => this.measureView(event,'existingFirstHeight')}>
									<View style={Styles.existingfirst}>
										<Text style={Styles.existingheadtext}>{STRINGS.t('existingfirst')}</Text>
									</View>
									<View style={Styles.existingfirstbalance}>
											<View style={{width:'100%',flexDirection:'row'}}>
												<Text style={Styles.existingtext}>$</Text>
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('loansToBePaid_1Balance',this.state.existingFirstHeight)} selectTextOnFocus={ true }
												placeholder='0.00'		
												ref="loansToBePaid_1Balance"
												keyboardType="numeric" 
												//onBlur={() => this.dismissKeyboard("salesPrice")} 
												onEndEditing={ (event) => this.updateFormFieldForLoanTobePaid(event.nativeEvent.text,'loansToBePaid_1Balance')}
												style={[Styles.width70,{alignSelf:'center'}]} underlineColorAndroid='transparent' 
												onChangeText={(value) => this.setState({loansToBePaid_1Balance: this.onChange(value)})} 
												value={this.delimitNumbers(this.state.loansToBePaid_1Balance)}
												
												/>
											</View>
										<View style={Styles.textboxunderline}>
											<View style={[Styles.fullunderline, ]}></View>
										</View>
									</View>
									<View style={Styles.existingfirstbalance}>
										<View style={{width:'100%',flexDirection:'row'}}>
											<Text style={Styles.existingtext}>%</Text>
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('loansToBePaid_1Rate',this.state.existingFirstHeight)} selectTextOnFocus={ true } placeholder='0.00' ref="loansToBePaid_1Rate" keyboardType="numeric" 
											onEndEditing={ (event) => this.updateFormFieldForLoanTobePaid(event.nativeEvent.text,'loansToBePaid_1Rate')}


											style={Styles.width70} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({loansToBePaid_1Rate: this.onChange(value)})} value={this.delimitNumbers(this.state.loansToBePaid_1Rate)}/>
										
										</View>
										<View style={Styles.textboxunderline}>
											<View style={[Styles.fullunderline, ]}></View>
										</View>
									</View>
								</View>
								<View style={Styles.loandetailhead} onLayout={(event) => this.measureView(event,'existingSecondHeight')}>
									<View style={Styles.existingfirst}>
										<Text style={Styles.existingheadtext}>{STRINGS.t('existingsecond')}</Text>
									</View>
									<View style={Styles.existingfirstbalance}>
										<View style={{width:'100%',flexDirection:'row'}}>
											<Text style={Styles.existingtext}>$</Text>
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('loansToBePaid_2Balance',this.state.existingSecondHeight)} selectTextOnFocus={ true } placeholder='0.00' ref="loansToBePaid_2Balance" keyboardType="numeric" 
											onEndEditing={ (event) => this.updateFormFieldForLoanTobePaid(event.nativeEvent.text,'loansToBePaid_2Balance')}
											
											style={[Styles.width70,{alignSelf:'center'}]} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({loansToBePaid_2Balance: this.onChange(value)})} value={this.delimitNumbers(this.state.loansToBePaid_2Balance)}/>
											
										</View>
										<View style={Styles.textboxunderline}>
											<View style={[Styles.fullunderline, ]}></View>
										</View>
									</View>
									<View style={Styles.existingfirstbalance}>
										<View style={{width:'100%',flexDirection:'row'}}>
											<Text style={Styles.existingtext}>%</Text>
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('loansToBePaid_2Rate',this.state.existingSecondHeight)} selectTextOnFocus={ true } placeholder='0.00' ref="loansToBePaid_2Rate" keyboardType="numeric" 
												onEndEditing={ (event) => this.updateFormFieldForLoanTobePaid(event.nativeEvent.text,'loansToBePaid_2Rate')}

											
											style={Styles.width70} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({loansToBePaid_2Rate: this.onChange(value)})} value={this.delimitNumbers(this.state.loansToBePaid_2Rate)}/>
											
										</View>
										<View style={Styles.textboxunderline}>
											<View style={[Styles.fullunderline, ]}></View>
										</View>
									</View>
								</View>
								<View style={Styles.loandetailhead} onLayout={(event) => this.measureView(event,'existingThirdHeight')}>
									<View style={Styles.existingfirst}>
										<Text style={Styles.existingheadtext}>{STRINGS.t('existingthird')}</Text>
									</View>
									<View style={Styles.existingfirstbalance}>
										<View style={{width:'100%',flexDirection:'row'}}>
											<Text style={Styles.existingtext}>$</Text>
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('loansToBePaid_3Balance',this.state.existingThirdHeight)} selectTextOnFocus={ true } placeholder='0.00' ref="loansToBePaid_3Balance" keyboardType="numeric" 
												onEndEditing={ (event) => this.updateFormFieldForLoanTobePaid(event.nativeEvent.text,'loansToBePaid_3Balance')}


											style={[Styles.width70,{alignSelf:'center'}]} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({loansToBePaid_3Balance: this.onChange(value)})} value={this.delimitNumbers(this.state.loansToBePaid_3Balance)}/>
										
										</View>
										<View style={Styles.textboxunderline}>
											<View style={[Styles.fullunderline, ]}></View>
										</View>
									</View>
									<View style={Styles.existingfirstbalance}>
										<View style={{width:'100%',flexDirection:'row'}}>
											<Text style={Styles.existingtext}>%</Text>
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('loansToBePaid_3Rate',this.state.existingThirdHeight)} selectTextOnFocus={ true } placeholder='0.00' keyboardType="numeric" 
											onEndEditing={ (event) => this.updateFormFieldForLoanTobePaid(event.nativeEvent.text,'loansToBePaid_3Rate')}
											ref="loansToBePaid_3Rate"
											style={Styles.width70} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({loansToBePaid_3Rate: this.onChange(value)})} value={this.delimitNumbers(this.state.loansToBePaid_3Rate)}/>
										
										</View>
										<View style={Styles.textboxunderline}>
											<View style={[Styles.fullunderline, ]}></View>
										</View>
									</View>
								</View>
								<View style={[Styles.fullunderline, {marginTop:10}]}></View>
								<Text style={[Styles.loanstext,{textAlign:'center'}]}>{STRINGS.t('total')}  <Text>$ {this.delimitNumbers(this.state.existingTotal)}</Text></Text>
								<View style={[Styles.fullunderline, {marginTop:10}]}></View>


								{renderIf(this.state.sumWinPropertyTaxStatus == true)(		
									<View style={[Styles.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'summerPropTaxHeight')}>
										<View style={Styles.title_justify}>
											<Text style={Styles.text_style}>{this.state.summerPropertyTaxLabel}</Text>
										</View>
										<View style={{width:'30%',justifyContent:'center'}}>
											<View style={Styles.alignrightinput}>
												<Text style={Styles.alignCenter}>$ </Text>
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('summerPropertyTax',this.state.summerPropTaxHeight)} selectTextOnFocus={ true } placeholder='0.00' ref="summerPropertyTax"  
												onEndEditing={ (event) => this.updateFormFieldFunction(event.nativeEvent.text,'summerPropertyTax')}

												style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({summerPropertyTax: this.onChange(value)})} value={this.delimitNumbers(this.state.summerPropertyTax)}/>
												
											</View>
											<View style={[Styles.fullunderline, ]}></View>
										</View>
									</View>
								)}

								{renderIf(this.state.sumWinPropertyTaxStatus == true && this.state.county == '2090')(
									<View style={[Styles.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'summerPropTaxHeight')}>
										<View style={Styles.title_justify}>
											<Text style={[Styles.text_style, {color : '#FD002B'}]}>only one box can be used</Text>
										</View>
										<View style={{width:'30%',justifyContent:'center'}}>
											<View style={Styles.alignrightinput}>
												<Text style={Styles.alignCenter}>OR</Text>
											</View>
										</View>
									</View>	
								)}

								{renderIf(this.state.sumWinPropertyTaxStatus == true) (
									<View style={[Styles.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'winterPropTaxHeight')}>
									<View style={Styles.title_justify}>
										<Text style={Styles.text_style}>{this.state.winterPropertyTaxLabel}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('winterPropertyTax',this.state.winterPropTaxHeight)} selectTextOnFocus={ true } placeholder='0.00' ref="winterPropertyTax"  
											onEndEditing={ (event) => this.updateFormFieldFunction(event.nativeEvent.text,'winterPropertyTax')}

											style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({winterPropertyTax: this.onChange(value)})} value={this.delimitNumbers(this.state.winterPropertyTax)}/>
											
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View>	
							)}	


							{renderIf(this.state.annualPropertyTaxFieldShowStatus == true)(
								<View style={[Styles.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'annualPropertyTaxHeight')}>
									<View style={Styles.title_justify}>
										<Text style={Styles.text_style}>{STRINGS.t('annual_prop_tax')}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('annualPropertyTax',this.state.annualPropertyTaxHeight)} selectTextOnFocus={ true } placeholder='0.00' ref="annualPropertyTax"  
											onEndEditing={ (event) => this.updateFormFieldFunction(event.nativeEvent.text,'annualPropertyTax')}

											style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({annualPropertyTax: this.onChange(value)})} value={this.delimitNumbers(this.state.annualPropertyTax)}/>
											
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View>    
							)}



							{renderIf(this.state.prorationPercentShowStatus == true)(
								<View style={[BuyerStyle.loandetailhead,{paddingLeft:10, paddingRight:10}]}>
									<View style={BuyerStyle.title_justify}>
										<Text style={BuyerStyle.text_style}>{STRINGS.t('Proration_Percent')}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'flex-end', borderColor : '#000000', borderWidth : 1, borderRadius : 5}}>
										<Selectbox
										style={{ width : '90%', alignSelf : 'flex-end'}} 
										selectLabelStyle={{fontSize : 16}}
										selectedItem={this.state.prorationPercentSelectedDropdownVal}
										onChange={this._onChangeProrationPercent}
										items={this.state.prorationPercentDropdownVal} />
									</View>	
								</View>	
							)}	

								<View style={[Styles.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'estimatedTaxProrationsHeight')}>
									<View style={Styles.title_justify}>
										<Text style={Styles.text_style}>{STRINGS.t('est_tax_proration')}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('estimatedTaxProrations',this.state.estimatedTaxProrationsHeight)} selectTextOnFocus={ true } placeholder='0.00'  
												onEndEditing={ (event) => this.updateFormFieldFunction(event.nativeEvent.text,'estimatedTaxProrations')}
												ref="estimatedTaxProrations"
												style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({estimatedTaxProrations: this.onChange(value)})} value={this.delimitNumbers(this.state.estimatedTaxProrations)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View> 
								<View style={[Styles.fullunderline, {marginTop:10}]}></View>
								<Text style={[Styles.loanstext,{textAlign:'center', marginBottom : 240}]}>{STRINGS.t('totalallcosts')}  <Text>$ {this.delimitNumbers(this.state.totalAllCost)}</Text></Text>
						</ScrollView>
						</View>
					</View>
				)}
				{renderIf(this.state.footer_tab == 'closing_cost')(
					<View style={{height:'100%',width:'100%'}}>
						<View style={Styles.smallsegmentContainer}>
							<View style={Styles.segmentView}>                                        
								<View style={Styles.textViewContainer}>
									<Text style={Styles.schollheadtext}>{STRINGS.t('Total_Closing_Cost')}  </Text>
									<Text style={Styles.schollheadtext}>$ {this.delimitNumbers(this.state.totalClosingCost)}</Text></View>
							</View>
						</View>
						<View style={(this.state.initialOrientation == 'portrait') ? (this.state.orientation == 'portrait') ? Styles.bigscrollviewheight : Styles.bigscrollviewheightlandscape : (this.state.orientation == 'landscape') ? Styles.bigscrollviewheight : Styles.bigscrollviewheightlandscape}>
							<ScrollView
								scrollEnabled={true}
								showsVerticalScrollIndicator={true}
								keyboardShouldPersistTaps="always"
								//keyboardDismissMode='on-drag'
								style={Styles.sellerscrollview}
								ref="scrollView1"
								onTouchStart={this._onMomentumScrollEnd}
							>        


							{this.state.escrowOnlySellerType == true ?                          
								<View style={[Styles.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'escrowFeeHeight')}>
									<View style={Styles.smalltitle_justify}>
										<Text style={Styles.text_style}>{STRINGS.t('Escr_or_Settle')}</Text>
									</View>
									<View style={{flexDirection: 'row', width:'25%',justifyContent:'center'}}>
									<ModalDropdown options={this.state.modalDropDownOnlySellerTypeAtions} defaultValue={this.state.escrowPolicyOnlySellerType.toString()} animated={true} style={{marginRight : 10, width : 30}} dropdownStyle={{height:40, alignItems: 'center', width:80, borderWidth: 1,borderRadius: 2,borderColor: '#ddd',borderBottomWidth: 0,shadowColor: '#000', shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.8,shadowRadius: 2}} onSelect={(idx, value) => this.createEscrowPicker(idx, value)}>
									</ModalDropdown>
									<ModalDropdown options={this.state.modalDropDownOnlySellerTypeAtions} onSelect={(idx, value) => this.createEscrowPicker(idx, value)} animated={true} style={{marginRight : 10}} dropdownStyle={{height:40, alignItems: 'center', width:80, borderWidth: 1,borderRadius: 2,borderColor: '#ddd',borderBottomWidth: 0,shadowColor: '#000', shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.8,shadowRadius: 2}}>
									<Image style={{width:9,height:9,top:0, marginTop : 3}} source={Images.dropdown_arrow}/>
									</ModalDropdown>
								</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('escrowFee',this.state.escrowFeeHeight)} selectTextOnFocus={ true } placeholder='0.00' ref="escrowFee"  
											onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'escrowFee', this.onChangeClosingCostFields(event.nativeEvent.text))}

												
												style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({escrowFee: this.onChange(value)})} value={this.delimitNumbers(this.state.escrowFee)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View> 
							: 

									<View style={[Styles.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'escrowFeeHeight')}>
									<View style={Styles.smalltitle_justify}>
										<Text style={Styles.text_style}>{STRINGS.t('Escr_or_Settle')}</Text>
									</View>
									<View style={{flexDirection: 'row', width:'25%',justifyContent:'center'}}>
									<ModalDropdown options={this.state.modalDropDownActions} defaultValue={this.state.escrowType.toString()} animated={true} style={{marginRight : 10, width : 30}} dropdownStyle={{height:115, alignItems: 'center', width:80, borderWidth: 1,borderRadius: 2,borderColor: '#ddd',borderBottomWidth: 0,shadowColor: '#000', shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.8,shadowRadius: 2}} onSelect={(idx, value) => this.createEscrowPicker(idx, value)}>
									</ModalDropdown>
									<ModalDropdown options={this.state.modalDropDownActions} onSelect={(idx, value) => this.createEscrowPicker(idx, value)} animated={true} style={{marginRight : 10}} dropdownStyle={{height:115, alignItems: 'center', width:80, borderWidth: 1,borderRadius: 2,borderColor: '#ddd',borderBottomWidth: 0,shadowColor: '#000', shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.8,shadowRadius: 2}}>
									<Image style={{width:9,height:9,top:0, marginTop : 3}} source={Images.dropdown_arrow}/>
									</ModalDropdown>
								</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('escrowFee',this.state.escrowFeeHeight)} selectTextOnFocus={ true } placeholder='0.00' ref="escrowFee"  
											onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'escrowFee', this.onChangeClosingCostFields(event.nativeEvent.text))}
												style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({escrowFee: this.onChange(value)})} value={this.delimitNumbers(this.state.escrowFee)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View> 
							}
								<View style={[Styles.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'ownerFeeHeight')}>
									<View style={Styles.smalltitle_justify}>
										<Text style={Styles.text_style}>{STRINGS.t('owners')}</Text>
									</View>
									<View style={{flexDirection: 'row', width:'25%',justifyContent:'center'}}>
										<ModalDropdown options={this.state.modalDropDownActions} defaultValue={this.state.ownerType.toString()} animated={true} style={{marginRight : 10, width : 30}} dropdownStyle={{height:115, alignItems: 'center', width:80, borderWidth: 1,borderRadius: 2,borderColor: '#ddd',borderBottomWidth: 0,shadowColor: '#000', shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.8,shadowRadius: 2}} onSelect={(idx, value) => this.createOwnerPicker(idx, value)}>
										</ModalDropdown>
										<ModalDropdown options={this.state.modalDropDownActions} onSelect={(idx, value) => this.createOwnerPicker(idx, value)} animated={true} style={{marginRight : 10}} dropdownStyle={{height:115, alignItems: 'center', width:80, borderWidth: 1,borderRadius: 2,borderColor: '#ddd',borderBottomWidth: 0,shadowColor: '#000', shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.8,shadowRadius: 2}}>
									<Image style={{width:9,height:9,top:0, marginTop : 3}} source={Images.dropdown_arrow}/>
									</ModalDropdown>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
										   <CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('ownerFee',this.state.ownerFeeHeight)} selectTextOnFocus={ true } placeholder='0.00' ref="ownerFee" keyboardType="numeric" 
										 onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'ownerFee', this.onChangeClosingCostFields(event.nativeEvent.text))}
										 
										 style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({ownerFee: this.onChange(value)})} value={this.delimitNumbers(this.state.ownerFee)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View> 


							{renderIf(this.state.state_code == 'WI')(
								<View style={[Styles.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'reissueSalePriceHeight')}>
									<View style={{ justifyContent: 'center', width:'33%'}}>
										<Text style={Styles.text_style}>{STRINGS.t('Reissue_Rate')}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center', marginLeft : 34}}>
										<View style={{width: '100%',justifyContent: 'center',flexDirection: 'row',alignSelf: 'center'}}>
											<CheckBox right={true} uncheckedColor="#3b90c4" containerStyle={{ backgroundColor:'#ffffff', borderWidth:0}} center checkedColor='#3b90c4' checked={this.state.isCheckForWisconsin} 
											onPress={this.handlePressCheckedBoxForWisconsin}
											
											/>
										</View>
									</View>
								</View> 
							)}
		
							{renderIf(this.state.state_code == 'OH')(
								<View style={[Styles.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'reissueSalePriceHeight')}>
									<View style={Styles.smalltitle_justify}>
										<Text style={Styles.text_style}>{STRINGS.t('Reissue_Less_Than_Ten')}</Text>
									</View>
									<View style={{flexDirection: 'row', width:'25%',justifyContent:'center'}}>
										<CheckBox right={true} uncheckedColor="#3b90c4" containerStyle={{ backgroundColor:'#ffffff', borderWidth:0}} center checkedColor='#3b90c4' checked={this.state.isCheckForOhio}	onPress={this.handlePressCheckedBoxForOhio}/>
									</View>
									<View style={{width:'30%',justifyContent:'center',alignItems:'flex-start'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											{(this.state.reissueSalePriceEditableStatus == true ? 
												<Text style={Styles.width100ReIssueYr}>{this.delimitNumbers(this.state.reissueSalePrice)} </Text>
												:   
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('reissueSalePrice',this.state.reissueSalePriceHeight)} selectTextOnFocus={ true } placeholder='0.00' ref="reissueSalePrice" keyboardType="numeric" 
												onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'reissueSalePrice', this.calReissueSalePrice(event.nativeEvent.text))}
												editable={true}
												style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({reissueSalePrice: this.onChange(value)})} value={this.delimitNumbers(this.state.reissueSalePrice)}/>
											)}	
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View> 
							)}

								<View style={[Styles.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'lenderFeeHeight')}>
									<View style={Styles.smalltitle_justify}>
										<Text style={Styles.text_style}>{STRINGS.t('lender')}</Text>
									</View>
									<View style={{flexDirection: 'row', width:'25%',justifyContent:'center'}}>
									<ModalDropdown options={this.state.modalDropDownActions} defaultValue={this.state.lenderType.toString()} animated={true} style={{marginRight : 10, width : 30}} dropdownStyle={{height:115, alignItems: 'center', width:80, borderWidth: 1,borderRadius: 2,borderColor: '#ddd',borderBottomWidth: 0,shadowColor: '#000', shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.8,shadowRadius: 2}} onSelect={(idx, value) => this.createLenderPicker(idx, value)}>
									</ModalDropdown>
									<ModalDropdown options={this.state.modalDropDownActions} onSelect={(idx, value) => this.createLenderPicker(idx, value)} animated={true} style={{marginRight : 10}} dropdownStyle={{height:115, alignItems: 'center', width:80, borderWidth: 1,borderRadius: 2,borderColor: '#ddd',borderBottomWidth: 0,shadowColor: '#000', shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.8,shadowRadius: 2}}>
									<Image style={{width:9,height:9,top:0, marginTop : 3}} source={Images.dropdown_arrow}/>
									</ModalDropdown>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('lenderFee',this.state.lenderFeeHeight)} selectTextOnFocus={ true } placeholder='0.00' ref="lenderFee" keyboardType="numeric" 
											onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'lenderFee', this.onChangeClosingCostFields(event.nativeEvent.text))}


											 style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({lenderFee: this.onChange(value)})} value={this.delimitNumbers(this.state.lenderFee)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View> 
								<View style={[Styles.fullunderline, {marginTop:10}]}></View>   
								<View style={[Styles.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'drawingDeedHeight')}>
									<View style={Styles.title_justify}>
										<Text style={Styles.text_style}>{STRINGS.t('drawing_deed')}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('drawingDeed',this.state.drawingDeedHeight)} selectTextOnFocus={ true } placeholder='0.00' ref="drawingDeed" 
											onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'drawingDeed', this.onChangeClosingCostFields(event.nativeEvent.text))}
											keyboardType="numeric" 
											 style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({drawingDeed: this.onChange(value)})} value={this.delimitNumbers(this.state.drawingDeed)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View>   
								<View style={[Styles.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'notaryHeight')}>
									<View style={Styles.title_justify}>
										<Text style={Styles.text_style}>{STRINGS.t('notary')}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('notary',this.state.notaryHeight)} selectTextOnFocus={ true } placeholder='0.00' ref="notary" 
												onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'notary', this.onChangeClosingCostFields(event.nativeEvent.text))} keyboardType="numeric" style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({notary: this.onChange(value)})} value={this.delimitNumbers(this.state.notary)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View>  
								<View style={[Styles.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'transferTaxHeight')}>
									<View style={Styles.title_justify}>
										<Text style={Styles.text_style}>{this.state.transfer_tax_text}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('transferTax',this.state.transferTaxHeight)} selectTextOnFocus={ true } placeholder='0.00' ref="transferTax" 
										onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'transferTax', this.onChangeClosingCostFields(event.nativeEvent.text))}
										keyboardType="numeric" style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({transferTax: this.onChange(value)})} value={this.delimitNumbers(this.state.transferTax)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View>  
								<View style={[Styles.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'prepaymentPenalityHeight')}>
									<View style={Styles.title_justify}>
										<Text style={Styles.text_style}>{STRINGS.t('prepayment_penalty')}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('prepaymentPenality',this.state.prepaymentPenalityHeight)} selectTextOnFocus={ true } placeholder='0.00' ref="prepaymentPenality" 
										onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'prepaymentPenality', this.onChangeClosingCostFields(event.nativeEvent.text))}
										keyboardType="numeric" style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({prepaymentPenality: this.onChange(value)})} value={this.delimitNumbers(this.state.prepaymentPenality)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View>  
								<View style={[Styles.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'reconveynceFeeHeight')}>
									<View style={Styles.title_justify}>
										<Text style={Styles.text_style}>{STRINGS.t('reconveynce_fees')}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('reconveynceFee',this.state.reconveynceFeeHeight)} selectTextOnFocus={ true } placeholder='0.00' ref="reconveynceFee" 
										onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'reconveynceFee', this.onChangeClosingCostFields(event.nativeEvent.text))}
										keyboardType="numeric" style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({reconveynceFee: this.onChange(value)})} value={this.delimitNumbers(this.state.reconveynceFee)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View>    
								<View style={[Styles.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'pestControlReportHeight')}>
									<View style={Styles.title_justify}>
										<Text style={Styles.text_style}>{STRINGS.t('pest_control_report')}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('pestControlReport',this.state.pestControlReportHeight)} selectTextOnFocus={ true } placeholder='0.00' ref="pestControlReport" 
											onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'pestControlReport', this.onChangeClosingCostFields(event.nativeEvent.text))}
											keyboardType="numeric" style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({pestControlReport: this.onChange(value)})} value={this.delimitNumbers(this.state.pestControlReport)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View>   
								<View style={[Styles.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'benifDemandStatementHeight')}>
									<View style={Styles.title_justify}>
										<Text style={Styles.text_style}>{STRINGS.t('demand_statement')}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('benifDemandStatement',this.state.benifDemandStatementHeight)} selectTextOnFocus={ true } placeholder='0.00' ref="benifDemandStatement" 
										onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'benifDemandStatement', this.onChangeClosingCostFields(event.nativeEvent.text))} keyboardType="numeric" style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({benifDemandStatement: this.onChange(value)})} value={this.delimitNumbers(this.state.benifDemandStatement)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View> 
								<View style={[Styles.fullunderline, {marginTop:10}]}></View>
								<View style={[Styles.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'listAgtHeight')}>
									<View style={Styles.smalltitle_justify}>
										<Text style={Styles.text_style}>{STRINGS.t('list_agt')}</Text>
									</View>
									<View style={{width:'25%',justifyContent:'center'}}>                                            
										<View style={[Styles.alignrightinput,{width:'80%',marginLeft:'10%'}]}>
											<Text style={Styles.alignCenter}>% </Text>
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('listAgt',this.state.listAgtHeight)} selectTextOnFocus={ true } placeholder='0.00' ref="listAgt" 
											onEndEditing={ (event) => this.updateFormFieldFunction(event.nativeEvent.text,'listAgt')}


											keyboardType="numeric" style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({listAgt: this.onChange(value)})} value={this.delimitNumbers(this.state.listAgt)}/>
										</View>
										<View style={[Styles.fullunderline,{width:'80%',marginLeft:'10%'} ]}></View>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('list_agt',this.state.listAgtHeight)} selectTextOnFocus={ true } placeholder='0.00' ref="list_agt" 
												onEndEditing={ (event) => this.updateFormFieldFunction(event.nativeEvent.text,'list_agt')}


											keyboardType="numeric" style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({list_agt: this.onChange(value)})} value={this.delimitNumbers(this.state.list_agt)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View> 
								<View style={[Styles.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'sellAgtHeight')}>
									<View style={Styles.smalltitle_justify}>
										<Text style={Styles.text_style}>{STRINGS.t('sell_agt')}</Text>
									</View>
									<View style={{width:'25%',justifyContent:'center'}}>                                            
										<View style={[Styles.alignrightinput,{width:'80%',marginLeft:'10%'}]}>
											<Text style={Styles.alignCenter}>% </Text>
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('sellAgt',this.state.sellAgtHeight)} selectTextOnFocus={ true } placeholder='0.00' ref="sellAgt" 
											onEndEditing={ (event) => this.updateFormFieldFunction(event.nativeEvent.text,'sellAgt')}

											 keyboardType="numeric" style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({sellAgt: this.onChange(value)})} value={this.delimitNumbers(this.state.sellAgt)}/>
										</View>
										<View style={[Styles.fullunderline,{width:'80%',marginLeft:'10%'} ]}></View>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('sell_agt',this.state.sellAgtHeight)} selectTextOnFocus={ true } placeholder='0.00' ref="sell_agt" 
												onEndEditing={ (event) => this.updateFormFieldFunction(event.nativeEvent.text,'sell_agt')}
											keyboardType="numeric" style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({sell_agt: this.onChange(value)})} value={this.delimitNumbers(this.state.sell_agt)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View> 
								
								<View style={[Styles.scrollable_container_child, {marginTop:10}]}>
									<View style={{width:'70%'}}>
										<Text style={Styles.text_style}>{STRINGS.t('total_agt')}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text editable = {true} style={[Styles.alignCenter, {marginTop : 5}]}>$ </Text>
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true } placeholder='0.00' ref="totalAgt" keyboardType="numeric" style={[Styles.width100,{paddingBottom:0}]} underlineColorAndroid='transparent' value={this.delimitNumbers(this.state.totalAgt)}/>
										</View>
									</View>
								</View> 
								<View style={[Styles.fullunderline, {marginTop:10}]}></View> 
								
								<View style={[Styles.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'settlementDateHeight')}>
									<View style={{width:'10%', justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}> </Text>
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('settlementDate',this.state.settlementDateHeight)} selectTextOnFocus={ true } placeholder='0.00' ref="settlementDate" 
											onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'settlementDate', this.onCallLoanToBePaid(event.nativeEvent.text))}
											
											keyboardType="numeric" style={Styles.width100} underlineColorAndroid='transparent'  
											onChangeText={(value) => this.setState({settlementDate: this.onChange(value)},this.calLoanToBePaid)} 
											value={this.delimitNumbers(this.state.settlementDate)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>                                            
									</View>
									<View style={{width:'60%', alignItems:'center'}}> 
										<Text style={Styles.text_style}>{STRINGS.t('days_interest')}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={[Styles.alignrightinput,{marginTop:10, marginRight : 5}]}>
											<Text style={Styles.width100}>$ {this.delimitNumbers(this.state.daysInterest)}</Text>
										</View>
									</View>
								</View>
								<View style={[Styles.fullunderline, {marginTop:10}]}></View> 
								<View style={[Styles.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'fee1Height')}>
									<View style={Styles.title_justify}>
										<Text style={Styles.text_style}>{this.state.label1.toString()}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('fee1',this.state.fee1Height)} selectTextOnFocus={ true } placeholder='0.00' ref="fee1" 
											onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'fee1', this.onChangeClosingCostFields(event.nativeEvent.text))}
											 keyboardType="numeric" style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({fee1: this.onChange(value)})} value={this.delimitNumbers(this.state.fee1)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View> 

								<View style={[Styles.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'fee2Height')}>
									<View style={Styles.title_justify}>
										<Text style={Styles.text_style}>{this.state.label2.toString()}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('fee2',this.state.fee2Height)} selectTextOnFocus={ true } placeholder='0.00' ref="fee2" 
											onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'fee2', this.onChangeClosingCostFields(event.nativeEvent.text))}
											keyboardType="numeric" style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({fee2: this.onChange(value)})} value={this.delimitNumbers(this.state.fee2)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View> 

								<View style={[Styles.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'fee3Height')}>
									<View style={Styles.title_justify}>
										<Text style={Styles.text_style}>{this.state.label3.toString()}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('fee3',this.state.fee3Height)} selectTextOnFocus={ true } placeholder='0.00' ref="fee3" 
											onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'fee3', this.onChangeClosingCostFields(event.nativeEvent.text))}
											keyboardType="numeric" style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({fee3: this.onChange(value)})} value={this.delimitNumbers(this.state.fee3)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View> 

								<View style={[Styles.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'fee4Height')}>
									<View style={Styles.title_justify}>
										<Text style={Styles.text_style}>{this.state.label4.toString()}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('fee4',this.state.fee4Height)} selectTextOnFocus={ true } placeholder='0.00' ref="fee4" 
											onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'fee4', this.onChangeClosingCostFields(event.nativeEvent.text))}
											
											keyboardType="numeric" style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({fee4: this.onChange(value)})} value={this.delimitNumbers(this.state.fee4)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View> 

								<View style={[Styles.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'fee5Height')}>
									<View style={Styles.title_justify}>
										<Text style={Styles.text_style}>{this.state.label5.toString()}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('fee5',this.state.fee5Height)} selectTextOnFocus={ true } placeholder='0.00' ref="fee5" 
											onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'fee5', this.onChangeClosingCostFields(event.nativeEvent.text))}
											keyboardType="numeric" style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({fee5: this.onChange(value)})} value={this.delimitNumbers(this.state.fee5)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View> 

								<View style={[Styles.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'fee6Height')}>
									<View style={Styles.title_justify}>
										<Text style={Styles.text_style}>{this.state.label6.toString()}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('fee6',this.state.fee6Height)} selectTextOnFocus={ true } placeholder='0.00' ref="fee6" 
											onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'fee6', this.onChangeClosingCostFields(event.nativeEvent.text))}
											keyboardType="numeric" style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({fee6: this.onChange(value)})} value={this.delimitNumbers(this.state.fee6)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View> 

								<View style={[Styles.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'fee7Height')}>
									<View style={Styles.title_justify}>
										<Text style={Styles.text_style}>{this.state.label7.toString()}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('fee7',this.state.fee7Height)} selectTextOnFocus={ true } placeholder='0.00' ref="fee7" 
											onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'fee7', this.onChangeClosingCostFields(event.nativeEvent.text))}
											
											keyboardType="numeric" style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({fee7: this.onChange(value)})} value={this.delimitNumbers(this.state.fee7)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View> 

								<View style={[Styles.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'fee8Height')}> 
									<View style={Styles.title_justify}>
										<Text style={Styles.text_style}>{this.state.label8.toString()}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('fee8',this.state.fee8Height)} selectTextOnFocus={ true } placeholder='0.00' ref="fee8" 
											onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'fee8', this.onChangeClosingCostFields(event.nativeEvent.text))}
										
											keyboardType="numeric" style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({fee8: this.onChange(value)})} value={this.delimitNumbers(this.state.fee8)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View> 

								<View style={[Styles.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'fee9Height')}>
									<View style={Styles.title_justify}>
										<Text style={Styles.text_style}>{this.delimitNumbers(this.state.label9)}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('fee9',this.state.fee9Height)} selectTextOnFocus={ true } placeholder='0.00' ref="fee9"
											 onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'fee9', this.onChangeClosingCostFields(event.nativeEvent.text))}
											 keyboardType="numeric" style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({fee9: this.onChange(value)})} value={this.delimitNumbers(this.state.fee9)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View> 

								<View style={[Styles.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'fee10Height')}>
									<View style={Styles.title_justify}>
										<Text style={Styles.text_style}>{this.state.label10.toString()}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('fee10',this.state.fee10Height)} selectTextOnFocus={ true } placeholder='0.00' ref="fee10" 
												onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'fee10', this.onChangeClosingCostFields(event.nativeEvent.text))}
												 keyboardType="numeric" style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({fee10: this.onChange(value)})} value={this.delimitNumbers(this.state.fee10)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View> 
								<View style={[Styles.fullunderline, {marginTop:10,marginBottom:240}]}></View>                             
							</ScrollView>
						</View>
					</View>
				)}
				{renderIf(this.state.footer_tab == 'other_costs')(
					<View style={{height:'100%',width:'100%'}}>
						<View style={Styles.smallsegmentContainer}>
							<View style={Styles.segmentView}>                                        
								<View style={Styles.textViewContainer}>
									<Text style={Styles.schollheadtext}>{STRINGS.t('Total_Other_Cost')}  </Text>
									<Text style={Styles.schollheadtext}>$ {this.delimitNumbers(this.state.totalOtherCost)}</Text></View>
							</View>
						</View>
						<View style={(this.state.initialOrientation == 'portrait') ? (this.state.orientation == 'portrait') ? Styles.bigscrollviewheight : Styles.bigscrollviewheightlandscape : (this.state.orientation == 'landscape') ? Styles.bigscrollviewheight : Styles.bigscrollviewheightlandscape}>
							<ScrollView
								scrollEnabled={true}
								showsVerticalScrollIndicator={true}
								keyboardShouldPersistTaps="always"
								//keyboardDismissMode='on-drag'
								style={Styles.sellerscrollview}
								ref="scrollView1"
								onTouchStart={this._onMomentumScrollEnd}
							>                                 
								<View style={[Styles.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'discHeight')}>
									<View style={Styles.smalltitle_justify}>
										<Text style={Styles.text_style}>{STRINGS.t('discount')}</Text>
									</View>
									<View style={{width:'25%',justifyContent:'center'}}>                                            
										<View style={[Styles.alignrightinput,{width:'80%',marginLeft:'10%'}]}>
											<Text style={Styles.alignCenter}>% </Text>
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('disc',this.state.discHeight)} selectTextOnFocus={ true } placeholder='0.00' ref="disc" 
											onEndEditing={ (event) => this.updateFormFieldFunction(event.nativeEvent.text,'disc')}
											
											keyboardType="numeric" style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({disc:this.onChange(value)})} value={this.delimitNumbers(this.state.disc)}/>
										</View>
										<View style={[Styles.fullunderline,{width:'80%',marginLeft:'10%'} ]}></View>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('otherCostsDiscount2',this.state.discHeight)} selectTextOnFocus={ true } placeholder='0.00' ref="otherCostsDiscount2" 
												onEndEditing={ (event) => this.updateFormFieldFunction(event.nativeEvent.text,'otherCostsDiscount2')}
											
											 keyboardType="numeric" style={Styles.width100} underlineColorAndroid='transparent' value={this.delimitNumbers(this.state.otherCostsDiscount2)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View> 
								<View style={[Styles.fullunderline, {marginTop:10}]}></View> 
								<View style={[Styles.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'appraisalfeeHeight')}>
									<View style={Styles.title_justify}>
										<Text style={Styles.text_style}>{STRINGS.t('Appraisal')}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('appraisalfee',this.state.appraisalfeeHeight)} selectTextOnFocus={ true } placeholder='0.00' ref="appraisalfee" 
												onEndEditing={ (event) => this.updateFormFieldForOtherCostFields(event.nativeEvent.text,'appraisalfee', 'appraisalfeeFixed')}
											keyboardType="numeric" style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({appraisalfee: this.onChange(value)})} value={this.delimitNumbers(this.state.appraisalfee)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View> 
								<View style={[Styles.fullunderline, {marginTop:10}]}></View> 
								<View style={[Styles.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'documentprepHeight')}>
									<View style={Styles.title_justify}>
										<Text style={Styles.text_style}>{STRINGS.t('Document_Prep')}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('documentprep',this.state.documentprepHeight)} selectTextOnFocus={ true } placeholder='0.00' ref="documentprep" 
										onEndEditing={ (event) => this.updateFormFieldForOtherCostFields(event.nativeEvent.text,'documentprep', 'documentprepFixed')} keyboardType="numeric" style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({documentprep: this.onChange(value)})} value={this.delimitNumbers(this.state.documentprep)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View> 
								<View style={[Styles.fullunderline, {marginTop:10}]}></View> 
								<View style={[Styles.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'taxservicecontractHeight')}>
									<View style={Styles.title_justify}>
										<Text style={Styles.text_style}>{STRINGS.t('Tax_Service_Contract')}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('taxservicecontract',this.state.taxservicecontractHeight)} selectTextOnFocus={ true } placeholder='0.00' ref="taxservicecontract" 
											onEndEditing={ (event) => this.updateFormFieldForOtherCostFields(event.nativeEvent.text,'taxservicecontract', 'taxservicecontractFixed')}
										
											keyboardType="numeric" style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({taxservicecontract: this.onChange(value)})} value={this.delimitNumbers(this.state.taxservicecontract)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View> 
								<View style={[Styles.fullunderline, {marginTop:10}]}></View> 
								<View style={[Styles.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'underwritingHeight')}>
									<View style={Styles.title_justify}>
										<Text style={Styles.text_style}>{STRINGS.t('Underwriting')}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('underwriting',this.state.underwritingHeight)} selectTextOnFocus={ true } placeholder='0.00' ref="underwriting" 
											onEndEditing={ (event) => this.updateFormFieldForOtherCostFields(event.nativeEvent.text,'underwriting', 'underwritingFixed')}
										
											keyboardType="numeric" style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({underwriting: this.onChange(value)})} value={this.delimitNumbers(this.state.underwriting)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View> 
								<View style={[Styles.fullunderline, {marginTop:10}]}></View> 
								<View style={[Styles.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'processingfeeHeight')}>
									<View style={Styles.title_justify}>
										<Text style={Styles.text_style}>{STRINGS.t('Processing_Fee')}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('processingfee',this.state.processingfeeHeight)} selectTextOnFocus={ true } placeholder='0.00' ref="processingfee"
											 onEndEditing={ (event) => this.updateFormFieldForOtherCostFields(event.nativeEvent.text,'processingfee', 'processingfeeFixed')}
											 keyboardType="numeric" style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({processingfee: this.onChange(value)})} value={this.delimitNumbers(this.state.processingfee)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View> 
								<View style={[Styles.fullunderline, {marginTop:10}]}></View> 
								<View style={[Styles.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'correctiveworkHeight')}>
									<View style={Styles.title_justify}>
										<Text style={Styles.text_style}>{this.state.corrective_work_text}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('correctivework',this.state.correctiveworkHeight)} selectTextOnFocus={ true } placeholder='0.00' ref="correctivework"
											 onEndEditing={ (event) => this.updateFormFieldForOtherCostFields(event.nativeEvent.text,'correctivework', '')}
											 keyboardType="numeric" onChangeText={(value) => this.setState({correctivework: this.onChange(value)})} value={this.delimitNumbers(this.state.correctivework)} style={Styles.width100} underlineColorAndroid='transparent'/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View> 
								<View style={[Styles.fullunderline, {marginTop:10}]}></View> 
								<View style={[Styles.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'buyersfeeHeight')}>
									<View style={Styles.title_justify}>
										<Text style={Styles.text_style}>{this.state.buyers_fee_text}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('buyersfee',this.state.buyersfeeHeight)} selectTextOnFocus={ true } placeholder='0.00' ref="buyersfee" 
											onEndEditing={ (event) => this.updateFormFieldForOtherCostFields(event.nativeEvent.text,'buyersfee', '')}
											 style={Styles.width100} onChangeText={(value) => this.setState({buyersfee: this.onChange(value)})} value={this.delimitNumbers(this.state.buyersfee)} underlineColorAndroid='transparent'/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View> 
								<View style={[Styles.fullunderline, {marginTop:10, marginBottom : 240}]}></View>
								<View style={[{marginTop:20}]}></View>
							</ScrollView>
						</View>
					</View>
				)}
				<View style={Styles.Footer}>
					<View style={Styles.footer_icon_container}>
						<TouchableOpacity style={CustomStyle.footer_icon_parent} onPress={() => this.changeFooterTab('seller')}>
							{renderIf(this.state.footer_tab != 'seller')(
								<Image style={Styles.footer_icon} source={Images.seller_unselected}/>
							)}
							{renderIf(this.state.footer_tab == 'seller')(
								<Image style={Styles.footer_icon} source={Images.seller_selected}/>
							)}						
						</TouchableOpacity>
					</View>
					<View style={Styles.lineView}></View>
					<View style={Styles.footer_icon_container}>
						<TouchableOpacity style={CustomStyle.footer_icon_parent} onPress={() => this.changeFooterTab('closing_cost')}>
							{renderIf(this.state.footer_tab != 'closing_cost')(
								<Image style={Styles.footer_icon} source={Images.closing_cost}/>
							)}
							{renderIf(this.state.footer_tab == 'closing_cost')(
								<Image style={Styles.footer_icon} source={Images.closing_cost_highlight}/>
							)}						
						</TouchableOpacity>
					</View>
					<View style={Styles.lineView}></View>
					<View style={Styles.footer_icon_container}>
							{renderIf(this.state.footer_tab != 'other_costs')(
								<TouchableOpacity style={CustomStyle.footer_icon_parent} onPress={() => this.changeFooterTab('other_costs')} >
									<Image style={Styles.footer_icon} source={Images.other_costs_unselected}/>		
								</TouchableOpacity>
							)}
							{renderIf(this.state.footer_tab == 'other_costs')(
							<TouchableOpacity style={CustomStyle.footer_icon_parent} onPress={() => this.changeFooterTab('other_costs')} >
								<Image style={Styles.footer_icon} source={Images.other_costs_selected}/>	
								</TouchableOpacity>
							)}					
					</View>
				</View>

			</View>
			<Modal
				animationType="slide"
				transparent={false}
				visible={this.state.modalVisible}
				onRequestClose={() => {alert("Modal has been closed.")}}
			>
				<View style={SellerStyle.HeaderContainer}>
					<Image style={SellerStyle.HeaderBackground} source={Images.header_background}></Image>
					<TouchableOpacity style={{width:'20%', justifyContent:'center'}} onPress={() => {this.setModalVisible(!this.state.modalVisible)}}>
					<Text style={[SellerStyle.headerbtnText]}>{STRINGS.t('Cancel')}</Text>
					</TouchableOpacity>
					<Text style={SellerStyle.header_title}>{STRINGS.t('Seller_Closing_Cost')}</Text>
				</View>
				<View style={{marginTop: 5,marginBottom:80}}>
					<View style={SellerStyle.listcontainer}>
					<View  style={{paddingLeft:5,paddingRight:5}}>
									<View style={SellerStyle.backgroundViewContainerSearch}>
										<TextInput placeholder='Type Keyword....'
											underlineColorAndroid='transparent' 
											style={SellerStyle.textInputSearch} 
											onChangeText={(value) => this.setState({keyword: value})} 
											value={this.state.keyword}
										/>
										<TouchableOpacity style={CustomStyle.back_icon_parent}  onPress={() => this.SearchFilterFunction(this.state.keyword)}>
										<View style={SellerStyle.restoreview}>
											<Text style={SellerStyle.restoreviewtext}>{'Search'}</Text>
										</View>
										</TouchableOpacity>
									</View>
									<View style={[SellerStyle.underlinebold,{marginBottom:10}]}></View>
						</View>
						<ScrollView>
							{renderIf(this.state.emptCheck == false)(
								<ListView enableEmptySections={true} dataSource={this.state.dataSource} renderRow={this.renderRow} />
							)}
							{renderIf(this.state.emptCheck == true)(
								<Text style={{alignSelf : 'center'}}>No Data Found.</Text>
							)}
						</ScrollView>
					</View>
				</View>
			</Modal>
			
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
								<AutoTags
									suggestions={this.state.suggestions}
									tagsSelected={this.state.tagsSelected}
									handleAddition={this.handleAddition}
									handleDelete={this.handleDelete}
									placeholder="Add email.." 
								/>
								</View>
							</View>
							<View style={SellerStyle.lineView}></View>
							
							{/*
							<View style={SellerStyle.scrollable_container_child_center}>
								<View style={{width: '15%',justifyContent: 'center'}}>
									<Text style={SellerStyle.text_style}>
									{STRINGS.t('EmailSubject')}:
									</Text>
								</View>
								<View style={{width: '85%',flexDirection: 'row'}}>
									<TextInput selectTextOnFocus={ true } underlineColorAndroid='transparent' style={{width: '100%'}} value={this.state.email_subject.toString()}/>
								</View>
							</View>
							*/}


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
				<View style={SellerStyle.header_bg}>
					<View style={CustomStyle.header_view}>
						<TouchableOpacity style={CustomStyle.back_icon_parent} onPress={() => this.setModalAddressesVisible(!this.state.modalAddressesVisible)}>
								<Image style={SellerStyle.footer_icon} source={Images.message}/>
						</TouchableOpacity>
						<TouchableOpacity style={CustomStyle.back_icon_parent} onPress={() => this.openpopup("image")}>
								<Image style={SellerStyle.footer_icon} source={Images.camera}/>
						</TouchableOpacity>
						<TouchableOpacity style={CustomStyle.back_icon_parent} onPress={() => this.openpopup("video")} >
								<Image style={SellerStyle.footer_icon} source={Images.video_camera}/>
						</TouchableOpacity>
					</View>
				</View>
			
				<PopupDialogEmail dialogTitle={<View style={SellerStyle.dialogtitle}><Text style={SellerStyle.dialogtitletext}>{STRINGS.t('Upload')} {this.state.popupAttachmentType}</Text></View>} dialogStyle={{width:'80%'}} ref={(popupDialogEmail) => { this.popupDialogEmail = popupDialogEmail; }}>
					{renderIf(this.state.popupAttachmentType == 'image')(
						<View>
							<TouchableOpacity onPress={() => this.onActionSelected('msg_tab_cam')}>
								<View style={SellerStyle.dialogbtn}>
									<Text style={SellerStyle.dialogbtntext}>
									{STRINGS.t('Upload_From_Camera')}
									</Text>
								</View>
							</TouchableOpacity>	
							<TouchableOpacity onPress={() => this.onActionSelected('msg_tab')} >
								<View style={SellerStyle.dialogbtn}>
									<Text style={SellerStyle.dialogbtntext}>
									{STRINGS.t('Upload_From_Gallery')}
									</Text>
								</View>
							</TouchableOpacity>	
							<TouchableOpacity style={SellerStyle.buttonContainer} onPress={ () => {this.popupDialog.dismiss()}}>
								<Text style={SellerStyle.style_btnLogin}> {STRINGS.t('Cancel')}</Text>
							</TouchableOpacity>	
						</View>	
					)}	
					{renderIf(this.state.popupAttachmentType == 'video')(
						<View style={{flex: 1, flexDirection: 'column',justifyContent: 'space-between',}}>
								<View>
									<TouchableOpacity onPress={() => {this.setVideoModalVisible(!this.state.videoModalVisible)}}>
										<View style={SellerStyle.dialogbtn}>
											<Text style={SellerStyle.dialogbtntext}>
											{STRINGS.t('Record_Video')}
											</Text>
										</View>
									</TouchableOpacity>	
								</View>
								<View>
									<TouchableOpacity style={SellerStyle.buttonContainerRecordVideo} onPress={ () => {this.popupDialog.dismiss()}}>
										<Text style={SellerStyle.style_btnLogin}> {STRINGS.t('Cancel')}</Text>
									</TouchableOpacity>	
								</View>
						</View>	 	
					)}					
				</PopupDialogEmail>
			</Modal>
			<Modal
	  animationType="slide"
	  transparent={false}
	  visible={this.state.videoModalVisible}
	  onRequestClose={() => {alert("Modal has been closed.")}}
	  style={{elevation:11}}
	><View style={{elevation:11,height:'100%', width:'100%'}}>
		<Image style={CustomStyle.header_bg} source={Images.header_background}>
				<View style={BuyerStyle.HeaderContainer}>
					<Image style={BuyerStyle.HeaderBackground} source={Images.header_background}></Image>
					<TouchableOpacity style={{width:'20%', justifyContent:'center'}}  onPress={() => {this.setVideoModalVisible(!this.state.videoModalVisible)}}>
						<Text style={[BuyerStyle.headerbtnText]}>{STRINGS.t('Cancel')}</Text>
					</TouchableOpacity>
					<Text style={BuyerStyle.header_title}>{STRINGS.t('Email')}</Text>
					{recordButton}
				</View>
		</Image>
		<View style={CameraStyle.container}>
			<Camera
			  ref={(cam) => {
				this.camera = cam;
			  }}
			  style={CameraStyle.preview}
			  aspect={this.state.camera.aspect}
			  captureTarget={this.state.camera.captureTarget}
			  captureAudio={true}
			  type={this.state.camera.type}
			  captureMode={this.state.camera.captureMode}
			  flashMode={this.state.camera.flashMode}
			  mirrorImage={false}
			/>
		</View></View>
	</Modal>
			<Modal
				animationType="slide"
				transparent={false}
				visible={this.state.modalAddressesVisible}
				onRequestClose={() => {alert("Modal has been closed.")}}
			>
				<Image style={CustomStyle.header_bg} source={Images.header_background}>
					<View style={BuyerStyle.HeaderContainer}>
						<Image style={BuyerStyle.HeaderBackground} source={Images.header_background}></Image>
						<TouchableOpacity style={{width:'20%', justifyContent:'center'}}>
						</TouchableOpacity>
						<Text style={BuyerStyle.header_title}>{STRINGS.t('Cost_First')}</Text>
						<TouchableOpacity style={{width:'20%', justifyContent:'center'}} onPress={() => {this.setModalAddressesVisible(!this.state.modalAddressesVisible)}}>
							<Text style={[BuyerStyle.headerbtnText,{alignSelf:'flex-end'}]}>{'Ok'}</Text>
						</TouchableOpacity>
					</View>
				</Image>
				<View>
					<View>
						<SelectMultiple
							items={this.state.emailAddrsList}
							selectedItems={this.state.selectedAddresses}
							onSelectionsChange={this.onSelectionsChange} 
						/>
					</View>
				</View>
			</Modal>
		
			<PopupDialog dialogTitle={<View style={SellerStyle.dialogtitle}><Text style={SellerStyle.dialogtitletext}>Please select print format</Text></View>} dialogStyle={{width:'80%', height : 350}}  containerStyle={{elevation:10}} ref={(popupDialog) => { this.popupDialog = popupDialog; }}>	
			{renderIf(this.state.popupType == 'print')(
				<View>
					<TouchableOpacity onPress={() => {this.printPDF("detailed")}}>
						<View style={SellerStyle.dialogbtn}>
							<Text style={SellerStyle.text_style}>
								{STRINGS.t('Print_Detailed_Estimate')}
							</Text>
						</View>	
					</TouchableOpacity>    
					<TouchableOpacity onPress={() => {this.printPDF("quick")}}>
						<View style={SellerStyle.dialogbtn}>
							<Text style={SellerStyle.text_style}>
								{STRINGS.t('Print_Quick_Estimate')}
							</Text>
						</View>	
					</TouchableOpacity>
					
					{renderIf(this.state.tab == 'Owner_Carry')(
						<TouchableOpacity onPress={() => {this.printPDF("owner_carry")}}>
							<View style={SellerStyle.dialogbtn}>
								<Text style={SellerStyle.text_style}>
									{STRINGS.t('Print_Owner_Carry')}
								</Text>
							</View>	
						</TouchableOpacity>
					)}

					{renderIf(this.state.multipleOfferStatus == true)(
						<TouchableOpacity onPress={() => {this.printPDFMultipleOffer()}}>
							<View style={SellerStyle.dialogbtn}>
								<Text style={SellerStyle.text_style}>
									{STRINGS.t('Print_Multiple_Offer')}
								</Text>
							</View>	
						</TouchableOpacity>
					)}




					<TouchableOpacity style={SellerStyle.buttonContainer} onPress={ () => {this.popupDialog.dismiss()}}>
						<Text style={SellerStyle.style_btnLogin}> {STRINGS.t('Cancel')}</Text>
					</TouchableOpacity>	
				</View>
			)}
			
			{renderIf(this.state.popupType == 'email')(
				<View>
					<TouchableOpacity onPress={() => {this.setEmailModalVisible(!this.state.emailModalVisible, this.setState({emailType : 'detailed'}), this.popupDialog.dismiss())}}>
						<View style={SellerStyle.dialogbtn}>
							<Text style={SellerStyle.dialogbtntext}>
								{STRINGS.t('Email_Detailed_Estimate')}
							</Text>
						</View>
					</TouchableOpacity> 
					
					
					
					<TouchableOpacity onPress={() => {this.setEmailModalVisible(!this.state.emailModalVisible,this.setState({emailType : 'quick'}), this.popupDialog.dismiss())}}>
						<View style={SellerStyle.dialogbtn}>
							<Text style={SellerStyle.dialogbtntext}>
								{STRINGS.t('Email_Quick_Estimate')}
							</Text>
						</View>
					</TouchableOpacity>

					{renderIf(this.state.tab == 'Owner_Carry')(
						<TouchableOpacity onPress={() => {this.setEmailModalVisible(!this.state.emailModalVisible,this.setState({emailType : 'owner_carry'}), this.popupDialog.dismiss())}}>
						<View style={SellerStyle.dialogbtn}>
							<Text style={SellerStyle.dialogbtntext}>
								{STRINGS.t('Email_Owner_Carry')}
							</Text>
						</View>
						</TouchableOpacity>
					)}

					{renderIf(this.state.multipleOfferStatus == true) (
						<TouchableOpacity onPress={() => {this.setEmailModalVisible(!this.state.emailModalVisible,this.setState({emailType : 'multipleOffer'}), this.popupDialog.dismiss())}}>
						<View style={SellerStyle.dialogbtn}>
							<Text style={SellerStyle.dialogbtntext}>
								{STRINGS.t('Email_Multiple_Offer')}
							</Text>
						</View>
						</TouchableOpacity>
					)}

					<TouchableOpacity style={SellerStyle.buttonContainer} onPress={ () => {this.popupDialog.dismiss()}}>
						<Text style={SellerStyle.style_btnLogin}> {STRINGS.t('Cancel')}</Text>
					</TouchableOpacity>	
				</View>
			)}
			
			{renderIf(this.state.popupType == 'msg_tab')(
				<View>
					<View style={SellerStyle.scrollable_container_child_center}>
						<View style={SellerStyle.two_columns_first_view}>
							<Text style={SellerStyle.text_style}>
							{STRINGS.t('Upload_Image')}
							</Text>
						</View>
					</View>
					<View style={SellerStyle.scrollable_container_child_center}>
						<View style={SellerStyle.two_columns_first_view}>
						<TouchableOpacity onPress={() => {this.setEmailModalVisible(!this.state.emailModalVisible)}}>
							<Text style={SellerStyle.text_style}>
							{STRINGS.t('Upload_From_Camera')}
							</Text>
						</TouchableOpacity> 
						</View>
					</View>
					<View style={SellerStyle.scrollable_container_child_center}>
						<View style={SellerStyle.two_columns_first_view}>
							<Text style={SellerStyle.text_style}>
							{STRINGS.t('Upload_From_Gallery')}
							</Text>
						</View>
					</View>
					<TouchableOpacity style={SellerStyle.buttonContainer} onPress={ () => {this.popupDialog.dismiss()}}>
						<Text style={SellerStyle.style_btnLogin}> {STRINGS.t('Cancel')}</Text>
					</TouchableOpacity>	
				</View>
			)}
			
		</PopupDialog>


		<PopupDialog dialogTitle={<View style={SellerStyle.dialogtitle}><Text style={SellerStyle.dialogtitletext}>Print and Email Seller Multiple Offer</Text></View>} dialogStyle={{width:'80%', height : 350}}  containerStyle={{elevation:10}} ref={(popupDialogMultipleOffer) => { this.popupDialogMultipleOffer = popupDialogMultipleOffer; }}>

			{renderIf(this.state.sale_pr != '' && this.state.sale_pr != '0.00') (
				<View>
				<TouchableOpacity onPress={() => {this.printPDFMultipleOffer()}}>
					<View style={SellerStyle.dialogbtn}>
						<Text style={SellerStyle.text_style}>
							Print
						</Text>
					</View>	
				</TouchableOpacity>    
				<TouchableOpacity onPress={() => {this.setEmailModalVisible(!this.state.emailModalVisible,this.setState({emailType : 'multipleOffer'}), this.popupDialog.dismiss())}}>
					<View style={SellerStyle.dialogbtn}>
						<Text style={SellerStyle.text_style}>
							Email
						</Text>
					</View>	
				</TouchableOpacity>
		
				<TouchableOpacity style={SellerStyle.buttonContainer} onPress={ () => {this.popupDialogMultipleOffer.dismiss()}}>
					<Text style={SellerStyle.style_btnLogin}> {STRINGS.t('Cancel')}</Text>
				</TouchableOpacity>	
			</View>
			)}
			{renderIf(this.state.sale_pr == '' || this.state.sale_pr == '0.00') (
				<View style={{flex : 1, flexDirection : 'column'}}>

					<View style={{flex : 5, alignItems : 'center', justifyContent: 'center'}}>
						<Text style={{textAlign : 'center'}}> No Record Found </Text>
					</View>
					
					<View style={{flex : 5, justifyContent : 'center'}}>
						<TouchableOpacity style={SellerStyle.buttonContainer} onPress={ () => {this.popupDialogMultipleOffer.dismiss()}}>
						<Text style={SellerStyle.style_btnLogin}> {STRINGS.t('Cancel')}</Text>
						</TouchableOpacity>		
					</View>	

				</View>	
			)}
		</PopupDialog>

		<PopupDialog dialogTitle={<View style={SellerStyle.dialogtitle}><Text style={SellerStyle.dialogtitletext}>{STRINGS.t('Add_New_Contact_Address')}</Text></View>} dialogStyle={{width:'80%'}}  containerStyle={{elevation:10}} ref={(popupDialogAddEmailAddress) => { this.popupDialogAddEmailAddress = popupDialogAddEmailAddress; }}>			
			<View>
				<View style={SellerStyle.contactAddressModalInputField}>
					<TextInput selectTextOnFocus={ true } autoCapitalize = 'words' style={SellerStyle.inputFieldsDesignLayout} placeholder='Name' underlineColorAndroid='transparent' onChangeText={(value) => this.setState({newEmailContactName: value})} value={this.state.newEmailContactName} />
				</View>	   
				<View style={SellerStyle.contactAddressModalInputField}>
					<TextInput ref="newEmailAddress" selectTextOnFocus={ true }  style={SellerStyle.inputFieldsDesignLayout} 			placeholderTextColor={this.state.newEmailAddressError == "" ? "#999999": "red"} placeholder={this.state.newEmailAddressError == "" ? STRINGS.t('email_address') : this.state.newEmailAddressError} underlineColorAndroid='transparent'	onChangeText={(value) => this.setState({newEmailAddress: value})} keyboardType="email-address" value={this.state.newEmailAddress} />

				</View>

				<View style={SellerStyle.contactAddressModalInputField}>
					<TextInput keyboardType="phone-pad" onChangeText={(value) => this.setState({contact_number: this.onChange(value)})}  onEndEditing={ (event) => this.updatePhoneNumberFormat(event.nativeEvent.text) } value={this.state.contact_number} selectTextOnFocus={ true }  style={SellerStyle.inputFieldsDesignLayout} placeholder='Contact Number' underlineColorAndroid='transparent'/>
				</View>	
				<View style={SellerStyle.ContactFormButtonMainView}>
					<TouchableOpacity style={SellerStyle.ContactFormButtonDesign} onPress={this.onSaveNewContactAddress.bind(this)}>
						<Text style={SellerStyle.style_btnLogin}> {STRINGS.t('Save')} </Text>
					</TouchableOpacity>
					<TouchableOpacity style={SellerStyle.ContactFormButtonDesign} onPress={this.popupHideAddEmailAddress.bind(this, 'dont_save')}>
						<Text style={SellerStyle.style_btnLogin}> {STRINGS.t('Dont_Save')}</Text>
					</TouchableOpacity>						
				</View>		
			</View>
			</PopupDialog>	
			<DropdownAlert
				ref={(ref) => this.dropdown = ref}
				onClose={data => this.onClose(data)}
			/>
			<View style={Styles.iphonexFooter}></View>
		  </View>
		} else if (this.state.openMessagePopup == true) {
			showable=<MessageComponent tagInputValue={this.state.tagInputValue} cancelEmailPopup={this.cancelEmailPopup.bind(this)} textMsgPdfArray={this.state.textMsgPdfArray} emailModalVisible={true} to_email="" to_email_default="" text_message={this.state.text_message} />
		} else {
			showable=
			<View style={{flex : 1}}>
				<View style={{flex : 2}}>
					<View style={BuyerStyle.HeaderContainer}>	
						<Image style={BuyerStyle.HeaderBackground} source={Images.header_background}></Image>
						<TouchableOpacity style={{width:'20%'}} onPress={this.onBackHomePress.bind(this)}>
							<Image style={BuyerStyle.back_icon} source={Images.back_icon}/>
						</TouchableOpacity>
						<Text style={BuyerStyle.header_title}>{STRINGS.t('Seller_Closing_Cost')}</Text>
			
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
			<View style={{flex:1}}>
				{showable}
			</View>	
			//(this.state.orientation == 'portrait') ? ( 
			
				  
			// 	) : (

			// 		//Landscape View
			// 	<View style={Styles.landscapetopcontainer}>
			// 		<View style={Styles.landscapeHeader}>
			// 			<Image style={Styles.landscapeHeaderBackground} source={Images.header_background}></Image>
			// 			<TouchableOpacity style={{width:'10%',height:50}} onPress={this.onBackHomePress.bind(this)}>
			// 				<Image style={Styles.landscapeBack_icon} source={Images.back_icon}/>
			// 			</TouchableOpacity>
			// 			<TouchableOpacity style={{width:'20%'}} onPress={this.onBuyerPress.bind(this)}>
			// 				<View style={Styles.landscapesubheading}>
			// 					<Text style={Styles.landscapesubheadingtext}>{STRINGS.t('Buyers')}</Text>
			// 				</View>
			// 			</TouchableOpacity>
			// 			<TouchableOpacity style={{width:'20%'}}>
			// 				<View style={[Styles.landscapesubheading, Styles.blueheadlandscape]}>
			// 					<Text style={Styles.landscapesubheadingtext}>{STRINGS.t('Sellers')}</Text>
			// 				</View>
			// 			</TouchableOpacity>
			// 			<TouchableOpacity style={{width:'20%'}} onPress={this.onNetFirstPress.bind(this)}>
			// 				<View style={Styles.landscapesubheading}>
			// 					<Text style={Styles.landscapesubheadingtext}>{STRINGS.t('Netfirst')}</Text>
			// 				</View>
			// 			</TouchableOpacity>
			// 			<TouchableOpacity style={{width:'20%'}} onPress={this.onRefinancePress.bind(this)}>
			// 				<View style={Styles.landscapesubheading}>
			// 					<Text style={Styles.landscapesubheadingtext}>{STRINGS.t('Refinance')}</Text>
			// 				</View>
			// 			</TouchableOpacity>
			// 		</View>
			// 		<View style={Styles.landscapeCalculatorContent}>
			// 			<View style={Styles.landscapescrollview}>
			// 				<ScrollView
			// 					scrollEnabled={true}
			// 					showsVerticalScrollIndicator={true}
			// 					keyboardShouldPersistTaps="always"
			// 					keyboardDismissMode='on-drag'
			// 					style={Styles.landscapescroll}
			// 				>
			// 					<View style={Styles.landscapetitle}>
			// 						<Text style={Styles.landscapetitleText}>{STRINGS.t('Seller_Closing_Cost')}</Text>
			// 					</View>
			// 					<View style={Styles.landscapedataContent}>
			// 						<View style={Styles.landscapecontentBoxes}>
			// 							<View style={Styles.landscapedataBoxHeading}>
			// 								<Text style={Styles.landscapedataboxheadingtext}>{STRINGS.t('General_Information')}</Text>
			// 							</View>
			// 							<View style={Styles.landscapedataBox}>																						
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabelbold}>{STRINGS.t('Prepared_By')}</Text>	
			// 									<View style={Styles.landscapefieldvaluebox}>
			// 									<TextInput onFocus={() => this.onFocus('postal_code')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>																						
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabelbold}>{STRINGS.t('Prepared_For')}</Text>	
			// 									<View style={Styles.landscapefieldvaluebox}>
			// 									<TextInput onFocus={() => this.onFocus('postal_code')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>																						
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabelbold}>{STRINGS.t('Address')}</Text>	
			// 									<View style={Styles.landscapefieldvaluebox}>
			// 									<TextInput onFocus={() => this.onFocus('postal_code')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>																						
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabelbold}>{STRINGS.t('City')}</Text>	
			// 									<View style={Styles.landscapefieldvaluebox}>
			// 									<TextInput onFocus={() => this.onFocus('postal_code')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>	
			// 								<View style={Styles.landscapehalfsizefield}>
			// 									<View style={Styles.landscapefieldhalfcontainer}>	
			// 										<Text style={Styles.landscapefieldlabelbold}>{STRINGS.t('State')}</Text>	
			// 										<View style={Styles.landscapefieldvaluebox}>
			// 										<TextInput onFocus={() => this.onFocus('postal_code')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 										</View>									
			// 									</View>	
			// 									<View style={Styles.landscapefieldhalfcontainer}>	
			// 										<Text style={[Styles.landscapefieldlabelbold, {textAlign:'center'}]}>{STRINGS.t('Zip')}</Text>	
			// 										<View style={Styles.landscapefieldvaluebox}>
			// 										<TextInput onFocus={() => this.onFocus('postal_code')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 										</View>									
			// 									</View>		
			// 								</View>									
			// 							</View>
			// 							<View style={Styles.landscapedataBoxHeading}>
			// 								<Text style={Styles.landscapedataboxheadingtext}>{STRINGS.t('Sale_Price_Loan_Info')}</Text>
			// 							</View>
			// 							<View style={Styles.landscapedataBox}>																						
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabelbold}>{STRINGS.t('Sale_Price')}</Text>	
			// 									<View style={Styles.landscapefieldvaluebox}>
			// 									<TextInput onFocus={() => this.onFocus('postal_code')} selectTextOnFocus={ true } placeholder='0.00' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>																						
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('Buyer_Loan_Type')}</Text>	
			// 									<View style={Styles.landscapefieldvaluebox}>
			// 									<TextInput onFocus={() => this.onFocus('postal_code')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>																						
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('conventional')}</Text>
			// 									<Text style={Styles.landscape20percenttext}>%</Text>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<TextInput onFocus={() => this.onFocus('postal_code')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>																						
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('est_settlement_date')}</Text>	
			// 									<Text style={Styles.landscape20percenttext}></Text>
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 										<DatePicker style={Styles.landscapefielddateval} showIcon={false} date={this.state.date} mode="date" placeholder="select date" format="YYYY-MM-DD" minDate={this.state.date} confirmBtnText="Confirm" cancelBtnText="Cancel" customStyles={{dateInput: {borderWidth:0, fontSize: 12}}} onDateChange={(date) => this.changeDate(date)} />
			// 									</View>									
			// 								</View>	
			// 								<View style={[Styles.fullunderline, {marginTop:10}]}></View>
			// 								<Text style={[Styles.landscapetexthead, {marginTop:5}]}>{STRINGS.t('LoansToBePaid')}</Text>	
			// 								<View style={[Styles.fullunderline, {marginTop:5}]}></View>	
			// 								<View style={Styles.landscapefieldcontainer}>
			// 									<View style={Styles.landscapetriplefieldlabel}>
			// 									</View>
			// 									<View style={{width:'5%'}}></View>	
			// 									<Text style={Styles.landscapebalancerate}>{STRINGS.t('balance')}</Text>
			// 									<View style={{width:'5%'}}></View>	
			// 									<Text style={Styles.landscapebalancerate}>{STRINGS.t('rate')}</Text>	
			// 								</View>
			// 								<View style={Styles.landscapefieldcontainer}>
			// 									<View style={Styles.landscapetriplefieldlabel}>
			// 										<Text style={Styles.landscapenormalfulltext}>{STRINGS.t('existing_first')}:</Text>
			// 									</View>	
			// 									<Text style={[Styles.landscapefieldval,{width:'5%'}]}>$</Text>	
			// 									<TextInput onFocus={() => this.onFocus('postal_code')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapetriplefieldval} underlineColorAndroid='transparent'/>
			// 									<Text style={[Styles.landscapefieldval,{width:'5%'}]}>%</Text>	
			// 									<TextInput onFocus={() => this.onFocus('postal_code')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapetriplefieldval} underlineColorAndroid='transparent'/>	
			// 								</View>	
			// 								<View style={Styles.landscapefieldcontainer}>
			// 									<View style={Styles.landscapetriplefieldlabel}>
			// 										<Text style={Styles.landscapenormalfulltext}>{STRINGS.t('existing_second')}:</Text>
			// 									</View>	
			// 									<Text style={[Styles.landscapefieldval,{width:'5%'}]}>$</Text>	
			// 									<TextInput onFocus={() => this.onFocus('postal_code')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapetriplefieldval} underlineColorAndroid='transparent'/>
			// 									<Text style={[Styles.landscapefieldval,{width:'5%'}]}>%</Text>	
			// 									<TextInput onFocus={() => this.onFocus('postal_code')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapetriplefieldval} underlineColorAndroid='transparent'/>	
			// 								</View>	
			// 								<View style={Styles.landscapefieldcontainer}>
			// 									<View style={Styles.landscapetriplefieldlabel}>
			// 										<Text style={Styles.landscapenormalfulltext}>{STRINGS.t('other')}:</Text>
			// 									</View>	
			// 									<Text style={[Styles.landscapefieldval,{width:'5%'}]}>$</Text>	
			// 									<TextInput onFocus={() => this.onFocus('postal_code')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapetriplefieldval} underlineColorAndroid='transparent'/>
			// 									<Text style={[Styles.landscapefieldval,{width:'5%'}]}>%</Text>	
			// 									<TextInput onFocus={() => this.onFocus('postal_code')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapetriplefieldval} underlineColorAndroid='transparent'/>	
			// 								</View>	
			// 								<View style={[Styles.fullunderline, {marginTop:10}]}></View>
			// 								<View style={Styles.landscapehalfsizefield}>
			// 									<Text style={[Styles.landscapetexthead, {marginTop:5,width:'70%'}]}>{STRINGS.t('total')}</Text>
			// 									<Text style={[Styles.landscapetexthead, {marginTop:5}]}>0.00</Text>	
			// 								</View>
			// 								<View style={[Styles.fullunderline, {marginTop:5}]}></View>																					
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('annual_prop_tax')}</Text>
			// 									<Text style={Styles.landscape20percenttext}></Text>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<TextInput onFocus={() => this.onFocus('postal_code')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>								
			// 							</View>
			// 						</View>
			// 						<View style={Styles.landscapecontentBoxes}>
			// 							<View style={Styles.landscapedataBoxHeading}>
			// 								<Text style={Styles.landscapedataboxheadingtext}>{STRINGS.t('Total_Closing_Cost')}</Text>
			// 							</View>
			// 							<View style={Styles.landscapedataBox}>																						
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('Escrow_or_Settlement')}</Text>
			// 									<View style={Styles.landscapedropdowncontainer}>
			// 										<Text style={Styles.landscapedropdowntext}>{STRINGS.t('Split')}</Text>
			// 										<Text style={Styles.landscapedropdownnexttext}>$</Text>
			// 									</View>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<TextInput onFocus={() => this.onFocus('postal_code')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>																								
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('Owners_Title_Policy')}</Text>
			// 									<View style={Styles.landscapedropdowncontainer}>
			// 										<Text style={Styles.landscapedropdowntext}>{STRINGS.t('Split')}</Text>
			// 										<Text style={Styles.landscapedropdownnexttext}>$</Text>
			// 									</View>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<TextInput onFocus={() => this.onFocus('postal_code')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>																													
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('Lenders_Title_Policy')}</Text>
			// 									<View style={Styles.landscapedropdowncontainer}>
			// 										<Text style={Styles.landscapedropdowntext}>{STRINGS.t('Split')}</Text>
			// 										<Text style={Styles.landscapedropdownnexttext}>$</Text>
			// 									</View>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<TextInput onFocus={() => this.onFocus('postal_code')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>																					
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('drawing_deed')}</Text>
			// 									<Text style={Styles.landscape20percenttext}></Text>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<TextInput onFocus={() => this.onFocus('postal_code')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>																												
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('notary')}</Text>
			// 									<Text style={Styles.landscape20percenttext}></Text>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<TextInput onFocus={() => this.onFocus('postal_code')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>																												
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('transfer_tax')}</Text>
			// 									<Text style={Styles.landscape20percenttext}></Text>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<TextInput onFocus={() => this.onFocus('postal_code')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>																												
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('prepayment_penality')}</Text>
			// 									<Text style={Styles.landscape20percenttext}></Text>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<TextInput onFocus={() => this.onFocus('postal_code')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>																												
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('reconveynce_fees')}</Text>
			// 									<Text style={Styles.landscape20percenttext}></Text>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<TextInput onFocus={() => this.onFocus('postal_code')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>																												
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('pest_control_report')}</Text>
			// 									<Text style={Styles.landscape20percenttext}></Text>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<TextInput onFocus={() => this.onFocus('postal_code')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>																					
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('Benift_Demand_Statement')}</Text>
			// 									<Text style={Styles.landscape20percenttext}></Text>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<TextInput onFocus={() => this.onFocus('postal_code')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>	
			// 								<View style={Styles.landscapefieldcontainer}>
			// 									<View style={Styles.landscapetriplefieldlabel}>
			// 										<Text style={Styles.landscapenormalfulltext}>{STRINGS.t('list_agt')}:</Text>
			// 									</View>	
			// 									<Text style={[Styles.landscapefieldval,{width:'5%'}]}>%</Text>	
			// 									<TextInput onFocus={() => this.onFocus('postal_code')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapetriplefieldval} underlineColorAndroid='transparent'/>
			// 									<Text style={[Styles.landscapefieldval,{width:'5%'}]}>$</Text>	
			// 									<TextInput onFocus={() => this.onFocus('postal_code')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapetriplefieldval} underlineColorAndroid='transparent'/>	
			// 								</View>	
			// 								<View style={Styles.landscapefieldcontainer}>
			// 									<View style={Styles.landscapetriplefieldlabel}>
			// 										<Text style={Styles.landscapenormalfulltext}>{STRINGS.t('sell_agt')}:</Text>
			// 									</View>	
			// 									<Text style={[Styles.landscapefieldval,{width:'5%'}]}>%</Text>	
			// 									<TextInput onFocus={() => this.onFocus('postal_code')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapetriplefieldval} underlineColorAndroid='transparent'/>
			// 									<Text style={[Styles.landscapefieldval,{width:'5%'}]}>$</Text>	
			// 									<TextInput onFocus={() => this.onFocus('postal_code')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapetriplefieldval} underlineColorAndroid='transparent'/>	
			// 								</View>	
			// 								<View style={Styles.landscapefieldcontainer}>
			// 									<View style={Styles.landscapetriplefieldlabel}>
			// 									</View>	
			// 									<Text style={[Styles.landscapefieldval,{width:'5%'}]}></Text>	
			// 									<Text style={Styles.landscapetriplefieldlablesmall}>{STRINGS.t('total_agt')}</Text>
			// 									<Text style={[Styles.landscapefieldval,{width:'5%'}]}>$</Text>	
			// 									<TextInput onFocus={() => this.onFocus('postal_code')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapetriplefieldval} underlineColorAndroid='transparent'/>	
			// 								</View>																					
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={[Styles.landscapefieldval,{width:'5%'}]}>%</Text>
			// 									<TextInput onFocus={() => this.onFocus('postal_code')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={[Styles.landscapetriplefieldval,{width:'20%'}]} underlineColorAndroid='transparent'/>
			// 									<Text style={Styles.landscape40percenttext}>  {STRINGS.t('days_interest')}</Text>	
			// 									<Text style={[Styles.landscapefieldval,{width:'5%'}]}>$</Text>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<Text style={Styles.landscapefieldval}>0.00</Text>
			// 									</View>									
			// 								</View>																					
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('recordingfee')}</Text>
			// 									<Text style={Styles.landscape20percenttext}></Text>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<TextInput onFocus={() => this.onFocus('postal_code')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>																				
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('homeWarranty')}</Text>
			// 									<Text style={Styles.landscape20percenttext}></Text>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<TextInput onFocus={() => this.onFocus('postal_code')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>																				
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('processServiceFee')}</Text>
			// 									<Text style={Styles.landscape20percenttext}></Text>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<TextInput onFocus={() => this.onFocus('postal_code')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>																				
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('sellerContribution')}</Text>
			// 									<Text style={Styles.landscape20percenttext}></Text>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<TextInput onFocus={() => this.onFocus('postal_code')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>																				
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('taxesDue')}</Text>
			// 									<Text style={Styles.landscape20percenttext}></Text>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<TextInput onFocus={() => this.onFocus('postal_code')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>																				
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('other')}</Text>
			// 									<Text style={Styles.landscape20percenttext}></Text>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<TextInput onFocus={() => this.onFocus('postal_code')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>																				
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('other')}</Text>
			// 									<Text style={Styles.landscape20percenttext}></Text>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<TextInput onFocus={() => this.onFocus('postal_code')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>																				
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('other')}</Text>
			// 									<Text style={Styles.landscape20percenttext}></Text>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<TextInput onFocus={() => this.onFocus('postal_code')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>																				
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('other')}</Text>
			// 									<Text style={Styles.landscape20percenttext}></Text>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<TextInput onFocus={() => this.onFocus('postal_code')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>																				
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('other')}</Text>
			// 									<Text style={Styles.landscape20percenttext}></Text>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<TextInput onFocus={() => this.onFocus('postal_code')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>	
			// 								<View style={[Styles.fullunderline, {marginTop:10}]}></View>
			// 								<View style={Styles.landscapehalfsizefield}>
			// 									<Text style={[Styles.landscapetexthead, {marginTop:5,width:'70%'}]}>{STRINGS.t('Total_Closing_Cost')}</Text>
			// 									<Text style={[Styles.landscapetexthead, {marginTop:5,textAlign:'right'}]}>$ 0.00</Text>	
			// 								</View>
			// 								<View style={[Styles.fullunderline, {marginTop:5}]}></View>																													
			// 							</View>
			// 						</View>
			// 						<View style={Styles.landscapecontentBoxes}>
			// 							<View style={Styles.landscapedataBoxHeading}>
			// 								<Text style={Styles.landscapedataboxheadingtext}>{STRINGS.t('prepaid')}</Text>
			// 							</View>
			// 							<View style={Styles.landscapedataBox}>
			// 								<View style={Styles.landscapefieldcontainer}>
			// 									<View style={Styles.landscapetriplefieldlabel}>
			// 										<Text style={Styles.landscapenormalfulltext}>{STRINGS.t('Discount')}</Text>
			// 									</View>	
			// 									<Text style={[Styles.landscapefieldval,{width:'5%'}]}>%</Text>	
			// 									<TextInput onFocus={() => this.onFocus('postal_code')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapetriplefieldval} underlineColorAndroid='transparent'/>
			// 									<Text style={[Styles.landscapefieldval,{width:'5%'}]}>$</Text>	
			// 									<TextInput onFocus={() => this.onFocus('postal_code')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapetriplefieldval} underlineColorAndroid='transparent'/>	
			// 								</View>																				
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('Appraisal')}</Text>
			// 									<Text style={Styles.landscape20percenttext}></Text>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<TextInput onFocus={() => this.onFocus('postal_code')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>																				
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('Document_Preparation')}</Text>
			// 									<Text style={Styles.landscape20percenttext}></Text>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<TextInput onFocus={() => this.onFocus('postal_code')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>																				
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('Tax_Service_Contract')}</Text>
			// 									<Text style={Styles.landscape20percenttext}></Text>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<TextInput onFocus={() => this.onFocus('postal_code')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>																				
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('Underwriting')}</Text>
			// 									<Text style={Styles.landscape20percenttext}></Text>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<TextInput onFocus={() => this.onFocus('postal_code')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>																				
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('Processing_Fee')}</Text>
			// 									<Text style={Styles.landscape20percenttext}></Text>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<TextInput onFocus={() => this.onFocus('postal_code')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>																				
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('Corrective_Work')}</Text>
			// 									<Text style={Styles.landscape20percenttext}></Text>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<TextInput onFocus={() => this.onFocus('postal_code')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>																				
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('Buyersfees')}</Text>
			// 									<Text style={Styles.landscape20percenttext}></Text>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<TextInput onFocus={() => this.onFocus('postal_code')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>
			// 								<View style={Styles.landscapehalfsizefield}>
			// 									<Text style={[Styles.landscapetexthead, {marginTop:5,width:'70%'}]}>{STRINGS.t('Total_Other_Cost')}</Text>
			// 									<Text style={[Styles.landscapetexthead, {marginTop:5,textAlign:'right'}]}>$ 0.00</Text>	
			// 								</View>												
			// 							</View>
			// 							<View style={Styles.landscapedataBoxHeading}>
			// 								<Text style={Styles.landscapedataboxheadingtext}>{STRINGS.t('total')}</Text>
			// 							</View>
			// 							<View style={Styles.landscapedataBox}>
			// 								<View style={Styles.landscapehalfsizefield}>
			// 									<Text style={[Styles.landscapetexthead, {marginTop:5,width:'70%'}]}>{STRINGS.t('totalallcosts')}</Text>
			// 									<Text style={[Styles.landscapetexthead, {marginTop:5,textAlign:'right'}]}>$ 0.00</Text>	
			// 								</View>																		
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('est_tax_proration')}</Text>
			// 									<Text style={Styles.landscape20percenttext}></Text>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<TextInput onFocus={() => this.onFocus('postal_code')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>
			// 								<View style={Styles.landscapehalfsizefield}>
			// 									<Text style={[Styles.landscapetexthead, {marginTop:5,width:'70%'}]}>{STRINGS.t('Est_Seller_Net')}</Text>
			// 									<Text style={[Styles.landscapetexthead, {marginTop:5,textAlign:'right'}]}>$ 0.00</Text>	
			// 								</View>											
			// 							</View>
			// 						</View>
			// 					</View>
			// 				</ScrollView>
			// 			</View>
			// 		</View>
			// 	</View>
			// )
        );
    }
}

// you can set your style right here, it'll be propagated to application
const uiTheme = {
    toolbar: {
        container: {
            backgroundColor: 'transparent',
        },
    },
};

const styles = StyleSheet.create({
	container: {
	  flex: 1,
	  backgroundColor: '#fff',
	  alignItems: 'center',
	  justifyContent: 'center',
	  padding:10
	},
	preview: {
	  justifyContent: 'flex-end',
	  alignItems: 'center',
	  width: "100%",
	  height: "90%"
	},
	capture: {
	  flex: 0,
	  backgroundColor: '#fff',
	  borderRadius: 5,
	  color: '#000',
	  padding: 10,
	  margin: 40
	}
  });
