import React, { Component } from 'react';
import {Container, Left, Right, Icon, Title, Body, Button}  from 'native-base';
import {Image, View, Dimensions, Alert, Text, TextInput, TouchableOpacity, TouchableHighlight, ScrollView, AsyncStorage, ListView, Modal, ToolbarAndroid, StyleSheet, BackHandler, Keyboard, Platform, NetInfo} from 'react-native';
import Images from '../Themes/Images.js';
import BuyerStyle from './Styles/BuyerStyle';
import SellerStyle from './Styles/SellerStyle';
import Styles from './Styles/LandscapeStyles';
import CameraStyle from './Styles/CameraStyle';
import { CheckBox } from 'react-native-elements';
import CustomStyle from './Styles/CustomStyle';
import renderIf from 'render-if';
import _ from 'lodash';
import MessageComponent from './MessageComponent';
import {validateEmail} from '../Services/CommonValidation.js';
import {callGetApi, callPostApi} from '../Services/webApiHandler.js' // Import 
import STRINGS from '../GlobalString/StringData';  // Import StringData.js class for string localization.
import Picker from 'react-native-picker';
import { CustomTextInput, install } from 'react-native-custom-keyboard';
import CustomKeyboard from '../customKeyboard/CustomKeyboard';
import DatePicker from 'react-native-datepicker';
import AutoTags from 'react-native-tag-autocomplete';
import {getAmountConventional, getDiscountAmount, getAmountFHA, getAdjustedVA, getAdjustedUSDA,getPreMonthTax, getMonthlyInsurance, getDailyInterest, getFhaMipFinance, getUsdaMipFinance, getVaFundingFinance, getMonthlyRateMMI,sumOfAdjustment,getRealEstateTaxes, getHomeOwnerInsurance, getTotalPrepaidItems, getTotalMonthlyPayment, getTotalInvestment, getOriginationFee, getTotalCostRate, get2ndTd, getBuyerEstimatedTax, getCostTypeTotal, monthlyPaymentChanged, useAnnualTaxforPrepaid} from '../Services/check_calc_with_object.js';
var nativeImageSource = require('nativeImageSource');
var Header = require('./Header');
var GLOBAL = require('../Constants/global');
const  {width, height} = Dimensions.get('window');	
//import AutoComplete from 'react-native-autocomplete-select'
import SelectMultiple from 'react-native-select-multiple';
import ShowActivityIndicator from './ShowActivityIndicator';
import Spinner from 'react-native-loading-spinner-overlay'; 
import ModalDropdown from 'react-native-modal-dropdown';
//import { ThemeProvider, Toolbar, COLOR } from 'react-native-material-ui';
import Device from '../Constants/Device'
import DropdownAlert from 'react-native-dropdownalert'
import { Dropdown } from 'react-native-material-dropdown';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Selectbox from 'react-native-selectbox';
import PopupDialog from 'react-native-popup-dialog';
import PopupDialogEmail from 'react-native-popup-dialog';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import OpenFile from 'react-native-doc-viewer';
import ImagePicker from 'react-native-image-crop-picker';
import Camera from 'react-native-camera';
import {authenticateUser} from '../Services/CommonValidation.js'  // Import CommonValidation class to access common methods for validations.
//import { defaultFormatUtc } from 'moment';
import Voice from 'react-native-voice';
var nlp = require('compromise');
import dashboardStyle from './Styles/DashboardStyle'
var texas_Hexter_Fair_counties_Arr = ['2565','2584','2742','2648','2706','2771','2579'];
var california_counties_Arr = ['95401', '95402', '95403', '95404', '95405', '95406', '95407', '95409', '94952', '94953', '94954', '94955', '94975', '94999'];
import  MultiLineChart  from './LineChartOwnerCarry';

var dataGraph =[ [{
"y": "202",
"x": 2000
}, {
    "y": "215",
    "x": 2001
}, {
    "y": "179",
    "x": 2002
}, {
    "y": "199",
    "x": 2003
}, {
    "y": "134",
    "x": 2003
}, {
    "y": "176",
    "x": 2010
}]
];
//default data is available 
let leftAxisData = [
  134,144,154,164,174,184,194,204,215
]
//default data is available 
let bottomAxisData = [
  0,8,16,24,32,40,48,56,64,72
]
let RentvsBuyColor = ['#3366CC']
let legendColor = ['#00ff00','red']
let legendText = []
let minX= 2000, maxX= 2010
let minY= 134, maxY= 215

//since there are only two lines
var Color = ['#00ff00','red'];

const stylesnew = StyleSheet.create({
  /*
   * Removed for brevity
   */
  separator: {
    flex: 1,
	flexDirection: 'column',
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
  
  rowViewContainer: 
  {
 
    fontSize: 18,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
 
  }
});

const suggestions = [
	{text: 'suggestion1', anotherProperty: 'value'},
	{text: 'suggestion2', anotherProperty: 'value2'}
  ]
  
export default class BuyerCalculator extends Component{
	constructor(props) {
		super(props);
		//register('hello', () => CustomKeyboard);
		//Estimated date
		var now = new Date();
		now.setDate(now.getDate() + 45);
		var date = (now.getMonth() + 1) + '-' + now.getDate() + '-' + now.getFullYear();
		var monthNames = [ "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec" ]; 
		this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
		// For showing list of buyer's calculator in popup onload so that error will not occur
		var ds = new ListView.DataSource({
		   rowHasChanged: (r1, r2) => r1 !== r2
		});
		var calcList = {};
		calcList['calculatorName'] = 'calculatorName';
		
		var amtSchListVar = {};
		amtSchListVar['month'] = 'calculatorName';
		 
		var addrsList = {};
		addrsList['email'] = 'email';
		this.state ={
			orientation: Device.isPortrait() ? 'portrait' : 'landscape',
			devicetype: Device.isTablet() ? 'tablet' : 'phone',
			initialOrientation: '',
			isChecked: true,
			isCheckForFlorida : false,	
			isCheckForNewJersey : false,
			isCheckForFirstLoan : false,
			isCheckForSecondLoan : false,
			secondLoanOwnerCarry : false,
			firstLoanOwnerCarry : false,
			isCheckedUSDA: true,
			isCheckedVA: true,
			openMessagePopup : false,
			tab: 'CONV',
			languageType : 'en', 
			footer_tab:'buyer',
			todaysInterestRate:'0.00',
			termsOfLoansinYears:'0.00',
			isfinanceVAMip : "",
			isFinanceVAMIP : "",
			VA_RoundDownMIP : "",
			termsOfLoansinYears2:'0.00',
			date:date,
			autoCompleteValue : 'type',
			suggestions: "",
			tagsSelected : [],
			tagsSelectedForEmail : [],
			date1:date,
			emailType : '',
			textMsgPdfArray : "",
			connectionInfo : '',
			annualPropertyCheck : false,
			sumWinPropertyTaxStatus : false,
			annualPropertyTaxFieldShowStatus : false,
			ltv: '90.00',
			ltvowner: '0.00',
			ltv2owner: '0.00',
			ltv2: '0.00',
			down_payment: '0.00',
			loan_amt: '0.00',
			loan_amt2: '0.00',
			sale_pr: '0.00',
			data : [{ value: 'SAVE' }, { value :'OPEN' }, { value : 'PRINT' } , { value : 'EMAIL' }, { value : 'LOAN COMPARISON' }, { value : 'MESSAGE' }],
			CityTransferTaxBuyerForIL : "0.00",
			CityTransferTaxBuyerForILStatus : false,
			escrowOnlyBuyerType : false,
			speakToTextStatus : false,
			sale_pr_calc: '0.00',
			count : 0,
			dp_request : '0.00',
			allDueYear : '7',
			allDueYear2: '0.00',
			isFocus : false,
			summerPropertyTax : '0.00',
			winterPropertyTax : '0.00',
			prorationPercent  : '105',
			prorationPercentShowStatus  : false,
			sale_pr_empty : '',
			dropdownType : '',
			taxservicecontract: '0.00',
			underwriting: '0.00',
			processingfee: '0.00',
			appraisalfee: '0.00',
			creditReport: '0.00',
			content : '',
			ownerFee: '0.00',
			escrowQuote : '0.00',
			ownerPolicyType: '',
			escrowFee: '0.00',
			escrowPolicyType: '',
			tagInputValue : '',
			escrowPolicyOnlyBuyerType: 'Buyer',
			lenderFee: '0.00',
			lenderPolicyType: '',
			documentprep: '0.00',
			disc: '0.00',
			discAmt: '0.00',
			label1: '',
			fee1: '',
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
			label10: '',
			fee10: '',
			oc_lender_name: '',
			CDTC_Status : false,
			TRID_Status : false,
			CDTC_TRID_Status : false,
			numberOfDaysPerMonth: '',
			numberOfMonthsInsurancePrepaid: '0',
			monTax: '0.00',
			monIns: '0.00',
			due_in_year1: '7',
			due_in_year2 : '0',
			monTaxFixed: false,
			monInsFixed: false,
			useForPrepaid : 0,
			numberOfDaysPerMonthFixed: false,
			todaysInterestRateFixed: false,
			costOtherFixed: false,
			summerPropertyTaxLabel : "",
			winterPropertyTaxLabel : "",
			invalidEmailStatus : false,
			imageNameEmail: '',
			videoNameEmail: '',
			monName: monthNames[(now.getMonth())],
			monTaxVal: '0',
			escrowType: 'Buyer',
			ownersType: 'Buyer',
			lenderType: 'Buyer',
			adjusted_loan_amt: '0.00',
			base_loan_amt: '0.00',
			prepaidMonthTaxes: '',
			monthInsuranceRes: '',
			daysInterest: '',
			FhaMipFin: '',
			FhaMipFin1: '',
			FhaMipFin2: '',
			FhaMipFin3: '',
			UsdaMipFinance: '',
			UsdaMipFinance1: '',
			UsdaMipFinance2: '',
			UsdaMipFinance3: '',
			taxservicecontractFixed : false,
			underwritingFixed : false,
			processingfeeFixed : false,
			creditReportFixed : false,
			appraisalfeeFixed : false,
			documentprepFixed : false,
			originationFeeFixed : false,
			originationfactorFixed : false,
			originationFactorTypeFixed : false,
			paymentAmount1Fixed : false,
			paymentAmount2Fixed : false,
			fee1Fixed : false,
			fee2Fixed : false,
			fee3Fixed : false,
			fee4Fixed : false,
			fee5Fixed : false,
			fee6Fixed : false,
			fee7Fixed : false,
			fee8Fixed : false,
			fee9Fixed : false,
			fee10Fixed : false,
			VaFfFin: '',
			VaFfFin1: '',
			VaFfFin2: '',
			VaFfFin3: '',
			monthlyRate:'',
			monthPmiVal:'0.00',
			rateValue:'',
			keyword : '',
			principalRate:'',
			realEstateTaxesRes: '',
			homeOwnerInsuranceRes: '',
			buyerFooterTab: true,
			scrollvalue : false,
			visble : false,
			totalClosingCost: '',
			totalPrepaidItems: '0.00',
			totalMonthlyPayment: '0.00',
			totalInvestment: '0.00',
			first_name: '',
			last_name: '',
			mailing_address: '',
			lender_address: '',
			user_state: '',
			postal_code: '',
			user_name: '',
			originationFee: '',
			costOther: '0.00',
			monthlyExpensesOther1: 'Other',
			monthlyExpensesOther2: 'Other',
			todaysInterestRate1: '0.00',
			twoMonthsPmi1: 'Other',
			paymentAmount1: '0.00',
			paymentAmount2: '0.00',
			estimatedTaxProrations: '0.00',
			nullVal: '0.00',
			lendername: 'New Client',
			interestRateCap: '',
			interestRateCap2: '',
			perAdjustment: '',
			perAdjustment2: '',
			costType_1Value: '',
			costTotalFee_2Value: '',
			escrowFeeOrg: '0.00',
			lenderFeeOrg: '0.00',
			ownerFeeOrg: '0.00',
			modalVisible: false,
			modalAddressesVisible: false,
			emailModalVisible: false,
			printModalVisible: false,
			GooglePlaceAutoCompleteShow : false,
			enterAddressBar : false,
			listBuyerCalculation: '',
			dataSource: ds.cloneWithRows(calcList),
			dataSourceOrg: ds.cloneWithRows(calcList),
			dataSourceEmpty: ds.cloneWithRows(calcList),
			emptCheck: false,
			dataSourceAmtSch: ds.cloneWithRows(amtSchListVar),
			dataSourceOrgAmtSch: ds.cloneWithRows(amtSchListVar),
			dataSourceEmptyAmtSch: ds.cloneWithRows(amtSchListVar),
			emptCheckAmtSch: false,
			addrsSource: ds.cloneWithRows(addrsList),
			toolbarActions: [{ value: 'SAVE' }, { value :'OPEN' }, { value : 'PRINT' } , { value : 'EMAIL' }, { value : 'LOAN COMPARISON' }, { value : 'MESSAGE' }],
			camera: {
				aspect: Camera.constants.Aspect.fill,
				captureTarget: Camera.constants.CaptureTarget.cameraRoll,
				captureMode: Camera.constants.CaptureMode.video,
				type: Camera.constants.Type.back,
				orientation: Camera.constants.Orientation.auto,
				flashMode: Camera.constants.FlashMode.auto,
			},
			modalDropDownAtions : ['Split','Buyer','Seller'],
			modalDropDownOnlyBuyerTypeAtions : ['Buyer'],
			
			prorationPercentDropdownVal: [
				{ key: 0, label: '100', value: '100'}, {key: 1, label: '105', value:'105'}, {key: 2, label: '110', value : '110'}, {key: 3, label: '115', value: '115'}, {key: 4, label: '120', value : '120'}
			],
			prorationPercentSelectedDropdownVal: { key: 0, label: '105', value:'105'},
			
			modalDropDownReissueYear : ['1-2','3-5','5+'],
			reissueYearDropdownShow : false,
			reissueYearDropdownVal : 0,
			reissueYearDropdownType : '5+',
			isRecording: false,
			isAddrsChecked: false,
			to_email: '',
			to_email_default : '',
			email_subject: '',
			imageData: '',
			videoData: '',
			videoModalVisible: false,
			modalVisibleForAmtSch: false,
			emailAddrsList: [],
			currencySign: '',
			animating: false,
			originationfactor: '0.0',
			originationFactorType : '',
			pnintrate: '0.00',
			default_address : '',
			Vaff: '0.00',
			annualPropertyTax: '0.00',
			downPaymentFixed: false,
			calculatorId: '',
			keyword: '',
			newLoanServiceFee: '0.00',
			showLoanServiceFee: false,
			downPaymentHidden: '0.00',
			paymentAmount1Fixed: false,
			paymentAmount2Fixed: false,
			deviceName : "",
			speaktoText: false,
			verified_email : '',
			newEmailContactName : '',
			contact_number : '',
			newEmailAddress : '',
			newEmailAddressError : '',
            countyTax: '0.00',
			cityTax: '0.00',
			escrowFeeBuyerOrg: '0.00',
			escrowFeeSellerOrg: '0.00',
			//for scrolling textinput 
			ltvHeight:'0',
			rateHeight:'0',
			termHeight:'0',
			baseLoanAmountHeight:'0',
			adjustedLoanAmountHeight:'0',
			downPaymentHeight:'0',
			annualPropTaxHeight:'0',
			summerPropTaxHeight:'0',
			winterPropTaxHeight:'0',
			escrowFeeHeight:'0',
			ownerFeeHeight:'0',
			lenderFeeHeight:'0',
			newLoanServiceFeeHeight:'0',
			discHeight:'0',
			originationFeeHeight:'0',
			processingfeeHeight:'0',
			taxservicecontractHeight:'0',
			documentprepHeight:'0',
			underwritingHeight:'0',
			appraisalfeeHeight:'0',
			creditReportHeight:'0',
			transferTaxILHeight:'0',
			fee1Height:'0',
			fee2Height:'0',
			fee3Height:'0',
			fee4Height:'0',
			fee5Height:'0',
			fee6Height:'0',
			fee7Height:'0',
			fee8Height:'0',
			fee9Height:'0',
			fee10Height:'0',
			monTaxValHeight:'0',
			numberOfMonthsInsurancePrepaidHeight:'0',
			numberOfDaysPerMonthHeight:'0',
			monthPmiValHeight:'0',
			FhaMipFin1Height:'0',
			VaFfFin1Height:'0',
			UsdaMipFinance1Height:'0',
			costOtherHeight:'0',
			dueInYear1Height: '0',
			focusElementMargin:230,
			keyboardDismissMode:'on-drag',
			emptCheck: false,
			speakToTextVal: false,
			voiceInput:false,
			TextInput: false,
			recognized: '',
			pitch: '',
			error: '',
			end: '',
			started: '',
			fhaMaxLoanAmount : '0.00',
			vAmaxloanamount : '0.00',
			results: [],
			partialResults: [],
			speakTextStatus: 'Please speak & wait for recognization...',
			intr : '0.00',
			dur : '0.00',
			due : '0.00',
			sp : '0.00',
			eventForGraphList: 'list',
			leftAxisData: [134,144,154,164,174,184,194,204,215],
			bottomAxisData: [0,8,16,24,32,40,48,56,64,72],
			dataGraph:[ [{"y": "202","x": 2000}, { "y": "215","x": 2001}, {"y": "179", "x": 2002}, {"y": "199","x": 2003}, { "y": "134","x": 2003}, {"y": "176","x": 2010}]],
			minY: 0,
			maxY: 0,
			minX: 0,
			maxX: 0,
		}
		this.renderRowAmtSch = this.renderRowAmtSch.bind(this);
		this.renderRow = this.renderRow.bind(this);
		this.renderAddrsRow = this.renderAddrsRow.bind(this);
		
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
		
		this.setState({
			  speakTextStatus: 'Recognizing voice....',
		  });
		  /* let b = e.value
		  this.setState({
			  partialResults: e.value,
		  });
		  fieldName = this.state.fieldName;
		  if(e.value != ''){
			  doc = nlp(e.value);
				doc = doc.values().toNumber().out();
				alert(doc);
			this.setState({
				[fieldName]: e.value,
				voiceInput:false,
			});
		  }
		  if(this.state.stoppedRec == true){
			  // this.setState({
			  // 	partialResults: e.value,
			  // });
		  } */
	  
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
		console.log('First change, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);

		if(connectionInfo.type != 'none') {
			this.setState({animating : 'false'}, this.componentDidMount);
		}
	}

	componentWillMount() {
		
		AsyncStorage.getItem('speakToTextVal').then((val)=>{
			console.log('speaktoText11', val)
			
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

		AsyncStorage.getItem('speaktoText').then((val)=>{
			console.log('speaktoText11', val)
			if(val){
				this.setState({speaktoText : val})
			}
		})

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
	
	stopSpeakToText(fieldName){
		if(fieldName == 'lendername'){
			this.setState({TextInput : true});
			this.refs.lendername.focus();
			
		}else{
			this.setState({TextInput : true}) 
		}
		val = !this.state.speakToTextVal;

		this.setState({speakToTextVal: val, speakToTextStatus : false});

		console.log("speak to text " + this.state.speakToTextVal);
		

		if(val){
			//alert(val);
			AsyncStorage.setItem('speakToTextVal',JSON.stringify(val)).then(()=> {
				console.log("Done")
			})
		}else{
			AsyncStorage.setItem('speakToTextVal',JSON.stringify(false)).then(()=> {
				console.log("Done")
			})
		}
	}
	
	onBackHomePress() {
		Keyboard.dismiss()
		if(this.state.footer_tab == 'closing_cost' || this.state.footer_tab == 'prepaid' || this.state.footer_tab == 'payment') {
			// function created inside setstate object is called anonyms function which is called on the fly.
			this.setState({footer_tab: 'buyer'}, function() {
				if(this.state.footer_tab == 'buyer') {
					this.setState({netFirstFooterTab: true});
				} else {
					this.setState({netFirstFooterTab: false});
				}
			});
		} else {
			this.props.navigator.push({name: 'Dashboard', index: 0 });
		}
		//this.props.navigator.pop()
	}
	
	// For showing popup containing list of buyer's calculator
	setModalVisible(visible) {
		this.setState({modalVisible: visible});
		this.getBuyerCalculatorListApi();
	}
	
	// For showing popup containing list of buyer's calculator
	setModalVisibleForAmtSch(visible) {
		if(this.state.sale_pr == '0.00' || this.state.sale_pr == ''){
			this.dropdown.alertWithType('error', 'Error', 'Please enter sales price');
		}else{
			this.setState({modalVisibleForAmtSch: visible});
			this.getAmtSchListApi();
		}
	}
	
	// For showing popup containing list of buyer's calculator
	setEmailModalVisible(visible) {
		// if case added by lovedeep on 04-24-2018 for loan comparison, cdtc, trid
		if(this.state.modalVisible == false) {
			if(this.state.dropdownType == 'loan_comparison') {
				this.setState({
					dropdownType : ""
				});
			}
			if(this.state.dropdownType == 'cdtc') {
				this.setState({
					dropdownType : ""
				});
			}
			if(this.state.dropdownType == 'trid') {
				this.setState({
					dropdownType : ""
				});
			}
		}

		this.setState({emailModalVisible: visible});
		this.getBuyerCalculatorListApi();
	}

	// function added by lovedeep on 05-01-2018
	// For showing popup containing list of buyer's calculator
	setEmailModalQuickDetailVisible(visible) {

		if(this.state.CDTC_TRID_Status == true) {
			this.setEmailModalVisible(visible);
		} else {
			if(this.state.CDTC_Status == false && this.state.TRID_Status  ==  true) {
				Alert.alert( 'CostsFirst', 'Include CDTC data?', [ {text: 'NO', onPress: this.onCallFuncSetEmailModalVisible.bind(this, 'CDTC_Status', false, visible)}, {text: 'YES', onPress: this.onCallFuncSetEmailModalVisible.bind(this, 'CDTC_Status', true, visible)}] );
			} else if (this.state.TRID_Status == false && this.state.CDTC_Status == true) {
				Alert.alert( 'CostsFirst', 'Include TRID data?', [ {text: 'NO', onPress: this.onCallFuncSetEmailModalVisible.bind(this, 'TRID_Status', false, visible)}, {text: 'YES', onPress: this.onCallFuncSetEmailModalVisible.bind(this, 'TRID_Status', true, visible)}] );
			} else if(this.state.TRID_Status == false && this.state.CDTC_Status == false) {
				Alert.alert( 'CostsFirst', 'Include both TRID & CDTC data?', [ {text: 'NO', onPress: this.onCallFuncSetEmailModalVisible.bind(this, 'CDTC_TRID_Status', false, visible)}, {text: 'YES', onPress: this.onCallFuncSetEmailModalVisible.bind(this, 'CDTC_TRID_Status', true, visible)}] );		
			} else {
				this.setEmailModalVisible(visible);
			}
		}
	}

	// function added by lovedeep on 05-01-2018
	// For showing popup containing list of buyer's calculator
	onCallFuncSetEmailModalVisible(statusType, statusVal, visible) {
		//alert('in onCallFuncSetEmailModalVisible');

		if(statusVal != false) {
			this.setState({
				[statusType] : statusVal
			});
		}

		console.log("onCallFuncSetEmailModalVisible cdtc status, trid status, cdtctrid status " + this.state.CDTC_Status + this.state.TRID_Status + this.state.CDTC_TRID_Status);
		// if case added by lovedeep on 04-24-2018 for loan comparison, cdtc, trid
		if(this.state.modalVisible == false) {
			if(this.state.dropdownType == 'loan_comparison') {
				this.setState({
					dropdownType : ""
				});
			}
			if(this.state.dropdownType == 'cdtc') {
				this.setState({
					dropdownType : ""
				});
			}
			if(this.state.dropdownType == 'trid') {
				this.setState({
					dropdownType : ""
				});
			}
		}

		this.setState({emailModalVisible: visible});
		this.getBuyerCalculatorListApi();
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

	// For showing popup containing list of buyer's calculator
	setPrintModalVisible(visible) {
		this.setState({printModalVisible: visible});
		this.getBuyerCalculatorListApi();
	}
	
	// For showing popup containing list of buyer's calculator
	setModalAddressesVisible(visible) {
		if(this.state.emailAddrsList != ''){
			this.setState({modalAddressesVisible: visible});
		}else{
			Alert.alert( 'CostsFirst', 'Address book is empty.', [ {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')}, {text: 'OK', onPress: () => console.log('Cancel Pressed!')}] );
		}
	}
	
	renderRow(rowData) {
		if(rowData != 'calculatorName'){
			if(rowData.address.length > 25){
				var strshortened = rowData.address.substring(0,25);
				rowData.address = strshortened + '..';
			}		
		}
		return (
			<View style={BuyerStyle.scrollable_container_child_center}>
				<View style={BuyerStyle.savecalcvalue}>
					<TouchableOpacity onPress={() => this.editCalculator(rowData.calculatorId)}>
						<Text style={BuyerStyle.text_style}>
							{rowData.calculatorName}{"\n"}$ {rowData.price != 'undefined' ? this.delimitNumbers(rowData.price) : ""}
						</Text>
					</TouchableOpacity>
				</View>
				<View style={BuyerStyle.savecalcvalueSecondCol}>
				<TouchableOpacity onPress={() => this.editCalculator(rowData.calculatorId)}>
					<Text style={[BuyerStyle.alignCenterCalcList,{alignSelf: 'flex-start'}]}>
						{rowData.address}{"\n"}{rowData.createdDate}
					</Text>
				</TouchableOpacity>	
				</View>
				<TouchableOpacity style={BuyerStyle.savecalcvaluesmall} onPress={() => this.onPressConfirmDeleteCalculator(rowData.id)}>
					<Image source={Images.recycle}/>
				</TouchableOpacity>
			</View>
		);
	}
	getBuyerCalculatorListApi()
	{
		
		callPostApi(GLOBAL.BASE_URL + GLOBAL.get_buyer_calculator, {userId: this.state.user_id, type: "Buyers"
		}, this.state.access_token)
		.then((response) => {
			if(result.status == 'success'){
			  	// alert(JSON.stringify(result));	

				calculatorList = result.data;
				calculatorList = calculatorList.sort(function(a, b){
					return b.calculatorId-a.calculatorId
				})
				result.data = calculatorList;
				var ds = new ListView.DataSource({
					rowHasChanged: (r1, r2) => r1 !== r2
				});
				this.setState({dataSourceOrg: ds.cloneWithRows(result.data),dataSource: ds.cloneWithRows(result.data),arrayholder: result.data,emptCheck: false});
			}else{
				this.setState({emptCheck: true});
			}
		});

		console.log("dataSource " + JSON.stringify(this.state.dataSource));

	}
	// Tabs in the footer of the page
	changeFooterTab(footer_tab){
		this.setState({footer_tab: footer_tab});
		if(footer_tab == 'buyer'){
			this.setState({buyerFooterTab: true});
		}else{
			this.setState({buyerFooterTab: false});
		}
	}	
		
	createOwnerLenderEscrowPicker(){
		console.log("alert 9");
		valueOwner = this.state.ownerPolicyType;
		valueLender = this.state.lenderPolicyType;
		valueEscrow = this.state.escrowPolicyType;
		//console.log("escrowPolicyType 6 " + this.state.escrowPolicyType);
		// Calculation of owner fee after user enter sales price
		if(valueOwner == 'Split'){
		/**============== Start Special case added by lovedeep for Hawaii State    **/
		//console.log("onwerfeeorg " + this.state.ownerFeeOrg);
		if(this.state.state_code == 'HI'){ 
			ownerFee = Math.round(this.state.ownerFeeOrg * 40 / 100);

			ownerFee = parseFloat(ownerFee).toFixed(2);

		} else {
			ownerFee   = this.state.ownerFeeOrg/2;
			ownerFee = parseFloat(ownerFee).toFixed(2);
		}	
		
		/**============== End Special case added by lovedeep for Hawaii State    **/
	
		} else if(valueOwner == 'Seller'){
			ownerFee   = '0.00';
		} else if(valueOwner == 'Buyer'){
			ownerFee   = this.state.ownerFeeOrg;
			ownerFee = parseFloat(ownerFee).toFixed(2);
		}
		
		console.log("owner fee 1 " + ownerFee);


		// Calculation of lender fee after user enter sales price
		if(valueLender == 'Split'){
			lenderFee   = this.state.lenderFeeOrg/2;
			lenderFee = parseFloat(lenderFee).toFixed(2);
        } else if(valueLender == 'Seller'){
            lenderFee   = '0.00';
        } else if(valueLender == 'Buyer'){
			lenderFee   = this.state.lenderFeeOrg;
			lenderFee = parseFloat(lenderFee).toFixed(2);
        }
			
	
		/**============== Start Special case added by lovedeep for Minnesota State    **/
		// Calculation of escrow fee after user enter sales price

		if(this.state.state_code == 'MN') {
				escrowFee   = this.state.escrowFeeOrg;

			// added if condition as per discussion with vinod sir for all states
			if (this.state.escrowFeeSellerOrg == '0.00') {
				valueEscrow = 'Buyer';
				//this.selectedEscrowTypeId = 'Buyer';
			} 

		} else {

			console.log("escrowFeeSellerOrg " + this.state.escrowFeeSellerOrg);
			console.log("escrowFeeBuyerOrg " + this.state.escrowFeeBuyerOrg);
			
			if(valueEscrow == 'Split'){
				if(this.state.escrowFeeBuyerOrg == '0.00'){
					escrowFee  = this.state.escrowFeeSellerOrg/2;
					escrowFee = parseFloat(escrowFee).toFixed(2);
				} else if(this.state.escrowFeeSellerOrg == '0.00'){
					escrowFee  = this.state.escrowFeeBuyerOrg/2;
					escrowFee = parseFloat(escrowFee).toFixed(2);
				} else {
					escrowFee  = this.state.escrowFeeBuyerOrg;
					escrowFee = parseFloat(escrowFee).toFixed(2);
				}
			} else if(valueEscrow == 'Seller'){
				escrowFee   = '0.00';
			} else if(valueEscrow == 'Buyer'){
				escrowFee   = this.state.escrowFeeOrg;
				escrowFee = parseFloat(escrowFee).toFixed(2);
			}	
				
			// added if condition as per discussion with vinod sir for all states
			if (this.state.escrowFeeSellerOrg == '0.00') {
				valueEscrow = 'Buyer';
				escrowTotal = (parseFloat(lenderFee) + parseFloat(ownerFee) + parseFloat(escrowFee)).toFixed(2);
				this.setState({
					ownerPolicyType: valueOwner, 
					ownerFee: ownerFee, 
					lenderPolicyType: valueLender, 
					lenderFee: lenderFee, 
					escrowPolicyType: valueEscrow, 
					escrowFee: escrowFee,
					escrowTotal: escrowTotal
				},this.calTotalMonthlyPayment);
			} else {
				callPostApi(GLOBAL.BASE_URL + GLOBAL.title_escrow_type, {
					"companyId": this.state.company_id
					}, this.state.access_token)
					.then((response) => {
			
						console.log("in else part of escrowfeesellerorg " + result.data.escrowType);
			
						if(result.status == 'success'){

							if(result.data.escrowType == 'Split'){
								if(this.state.escrowFeeBuyerOrg == '0.00'){
									escrowFee  = this.state.escrowFeeSellerOrg/2;
									escrowFee = parseFloat(escrowFee).toFixed(2);
								} else if(this.state.escrowFeeSellerOrg == '0.00'){
									escrowFee  = this.state.escrowFeeBuyerOrg/2;
									escrowFee = parseFloat(escrowFee).toFixed(2);
								} else {
									escrowFee  = this.state.escrowFeeBuyerOrg;
									escrowFee = parseFloat(escrowFee).toFixed(2);
								}
							} else if(result.data.escrowType == 'Seller'){
								escrowFee   = '0.00';
							} else if(result.data.escrowType == 'Buyer'){
								escrowFee   = this.state.escrowFeeOrg;
								escrowFee = parseFloat(escrowFee).toFixed(2);
							}	

							escrowTotal = (parseFloat(lenderFee) + parseFloat(ownerFee) + parseFloat(escrowFee)).toFixed(2);
							this.setState({
								ownerPolicyType: valueOwner, 
								ownerFee: ownerFee, 
								lenderPolicyType: valueLender, 
								lenderFee: lenderFee, 
								escrowPolicyType: result.data.escrowType, 
								escrowFee: escrowFee,
								escrowTotal: escrowTotal
							},this.calTotalMonthlyPayment);
						} else {
							escrowTotal = (parseFloat(lenderFee) + parseFloat(ownerFee) + parseFloat(escrowFee)).toFixed(2);
							this.setState({
								ownerPolicyType: valueOwner, 
								ownerFee: ownerFee, 
								lenderPolicyType: valueLender, 
								lenderFee: lenderFee, 
								escrowPolicyType: 'Buyer', 
								escrowFee: escrowFee,
								escrowTotal: escrowTotal
							},this.calTotalMonthlyPayment);
						}
					});
					


			}
		}
		/**============== End Special case added by lovedeep for Minnesota State    **/


 	}	
	
	//This function call when you select value from escrow dropdown (under closing cost section)
	createEscrowPicker(idx, value) {
		if(value == 'Split') {
            if(this.state.escrowFeeBuyerOrg == '0.00'){
                escrowFee  = this.state.escrowFeeSellerOrg/2;
            } else if(this.state.escrowFeeSellerOrg == '0.00'){
                escrowFee  = this.state.escrowFeeBuyerOrg/2;
            } else {
                escrowFee  = this.state.escrowFeeBuyerOrg;
            }
        } else if(value == 'Seller') {
            escrowFee   = '0.00';
        } else if(value == 'Buyer') {
            escrowFee   = this.state.escrowFeeOrg;
			//Alert.alert('Alert!', JSON.stringify(this.state.ownerFeeOrg + "..this.state.ownerFeeOrg" + ownerFee + "..ownerFee"))
		}
		
		escrowTotal = (parseFloat(this.state.lenderFee) + parseFloat(this.state.ownerFee) + parseFloat(escrowFee)).toFixed(2);
		this.setState({escrowPolicyType: value, escrowFee:parseFloat(escrowFee).toFixed(2), escrowTotal:escrowTotal},this.calTotalMonthlyPayment);

		console.log("value " + value);

		console.log("escrowPolicyType 2 " + this.state.escrowPolicyType);
	}
	
	// This function call when you select value from owner dropdown (under closing cost section)	
	createOwnerPicker(idx, value) {
		
		if(value == 'Split'){

			/**============== Start Special case added by lovedeep for Hawaii State    **/

			console.log("ownerFeeOrg 2 " + this.state.ownerFeeOrg);

			if(this.state.state_code == 'HI'){ 
				ownerFee = Math.round(this.state.ownerFeeOrg * 40 / 100);
			} else {
				ownerFee   = this.state.ownerFeeOrg/2;
			}	
			
			/**============== End Special case added by lovedeep for Hawaii State    **/

            
	   
		
		} else if(value == 'Seller'){
            ownerFee   = '0.00';
        } else if(value == 'Buyer'){
            ownerFee   = this.state.ownerFeeOrg;
			//Alert.alert('Alert!', JSON.stringify(this.state.ownerFeeOrg + "..this.state.ownerFeeOrg" + ownerFee + "..ownerFee"))
		}
		
		console.log("owner fee 3 " + ownerFee);

		console.log("escrow fee 3 " + this.state.escrowFee);
		escrowTotal = (parseFloat(this.state.lenderFee) + parseFloat(ownerFee) + parseFloat(this.state.escrowFee)).toFixed(2);
		this.setState({ownerPolicyType: value, ownerFee:parseFloat(ownerFee).toFixed(2), escrowTotal:escrowTotal},this.calTotalMonthlyPayment);
	}	


	
	// This function call when you select value from lender dropdown (under closing cost section)	
	createLenderPicker(idx, value) {
		if(value == 'Split'){
            lenderFee   = this.state.lenderFeeOrg/2;
        } else if(value == 'Seller'){
            lenderFee   = '0.00';
        } else if(value == 'Buyer'){
            lenderFee   = this.state.lenderFeeOrg;
			//Alert.alert('Alert!', JSON.stringify(this.state.ownerFeeOrg + "..this.state.ownerFeeOrg" + ownerFee + "..ownerFee"))
        }

		escrowTotal = (parseFloat(lenderFee) + parseFloat(this.state.ownerFee) + parseFloat(this.state.escrowFee)).toFixed(2);
		this.setState({lenderPolicyType: value, lenderFee:parseFloat(lenderFee).toFixed(2), escrowTotal:escrowTotal},this.calTotalMonthlyPayment);
	}


	//This function call when you select value from reissue year dropdown (under closing cost section)
	createReissueYearPicker(idx, value) {
		
		console.log("createReissueYearPicker val " + value);

		if(value == '1-2') {
			this.setState({
				reissueYearDropdownVal : 2,
				reissueYearDropdownType : '1-2',
			}, this.callOwnerEscrowLenderSettingApi);

		} else if (value == '3-5') {
			this.setState({
				reissueYearDropdownVal : 5,
				reissueYearDropdownType : '3-5',
			}, this.callOwnerEscrowLenderSettingApi);
		} else if (value == '5+') {
			this.setState({
				reissueYearDropdownVal : 6,
				reissueYearDropdownType : '5+',
			}, this.callOwnerEscrowLenderSettingApi);
		}
		
		/*if(value == 'Split'){
			if(this.state.escrowFeeBuyerOrg == '0'){
				escrowFee  = this.state.escrowFeeSellerOrg/2;
			} else if(this.escrowFeeSellerOrg == '0'){
				escrowFee  = this.state.escrowFeeBuyerOrg/2;
			} else {
				escrowFee  = this.state.escrowFeeBuyerOrg;
			}
		} else if(value == 'Seller'){
			escrowFee   = '0.00';
		} else if(value == 'Buyer'){
			escrowFee   = this.state.escrowFeeOrg;
			//Alert.alert('Alert!', JSON.stringify(this.state.ownerFeeOrg + "..this.state.ownerFeeOrg" + ownerFee + "..ownerFee"))
		}
		escrowTotal = (parseFloat(this.state.lenderFee) + parseFloat(this.state.ownerFee) + parseFloat(escrowFee)).toFixed(2);
		this.setState({escrowPolicyType: value, escrowFee:escrowFee, escrowTotal:escrowTotal},this.calTotalMonthlyPayment);*/


	}
	

	handlePressCheckedBox = (checked) => {
        if(this.state.isChecked === false){
			this.setState({ FhaMipFin3: this.state.FhaMipFin2});			
            adjustedAmt        = parseInt(this.state.base_loan_amt) + ( (this.state.base_loan_amt) * (this.state.fhaMIP/100) );        //Formula applied here to calculate the adjusted
			principalRate   = sumOfAdjustment(adjustedAmt, this.state.todaysInterestRate, this.state.termsOfLoansinYears);
			this.setState({ principalRate:principalRate, isChecked: !this.state.isChecked, FhaMipFin3: this.state.FhaMipFin2, adjusted_loan_amt: adjustedAmt},this.calTotalMonthlyPayment);
			
        } else {
            adjustedAmt    = this.state.base_loan_amt;
			principalRate   = sumOfAdjustment(adjustedAmt, this.state.todaysInterestRate, this.state.termsOfLoansinYears);
			this.setState({ principalRate:principalRate, isChecked: !this.state.isChecked, FhaMipFin3: this.state.FhaMipFin, adjusted_loan_amt: adjustedAmt},this.calTotalMonthlyPayment);
        }
	}


	/**=========== Start Function Added By Lovedeep For Annual Property Tax Check Box Case (Florida) =========**/

	handlePressCheckedBoxForFlorida = (checked) =>  {

		if(this.state.isCheckForFlorida == false) {
			this.setState({
				isCheckForFlorida : !this.state.isCheckForFlorida
			}, this.changeMonTaxPriceCheckBox);
		} else {
			this.setState({
				isCheckForFlorida : !this.state.isCheckForFlorida
			}, this.changeMonTaxPriceCheckBox);
		}
	}

	/**=========== End Function Added By Lovedeep For Annual Property Tax Check Box Case (Florida) =========**/


	/**=========== Start Function Added By Lovedeep For New Jersey Check Box below escrow field Case (New Jersey) =========**/

	handlePressCheckedBoxForNewJersey = (checked) =>  {

		if(this.state.isCheckForNewJersey == false) {
			this.setState({
				isCheckForNewJersey : !this.state.isCheckForNewJersey,
				reissueYearDropdownVal : 1,
			}, this.callBuyerConvSettingApi);
		} else {
			this.setState({
				isCheckForNewJersey : !this.state.isCheckForNewJersey,
				reissueYearDropdownVal : 0,
			}, this.callBuyerConvSettingApi);
		}
	}

	/**=========== End Function Added By Lovedeep For New Jersey Check Box below escrow field Case (New Jersey) =========**/
	 

	handlePressAddressCheckedBox(data){
		  this.setState({ [data]: { isAddrsChecked: !this.state[data].isAddrsChecked } })
		
	}
	
	handlePressUSDACheckedBox = (checked) => {
        if(this.state.isCheckedUSDA === false){
            //creating object for sales price and MIP
            request         = {'salePrice': this.state.base_loan_amt,'MIP': this.state.usdaMIP};

            //calling method to calculate the amount for USDA Loan Type
            response         = getAdjustedUSDA(request);                
            adjustedAmt        = response.adjusted;
			principalRate   = sumOfAdjustment(adjustedAmt, this.state.todaysInterestRate, this.state.termsOfLoansinYears);
			this.setState({ principalRate:principalRate, isCheckedUSDA: !this.state.isCheckedUSDA, UsdaMipFinance3: this.state.UsdaMipFinance2, adjusted_loan_amt: adjustedAmt},this.calTotalMonthlyPayment);
        } else {
			adjustedAmt    = this.state.base_loan_amt;
			principalRate   = sumOfAdjustment(adjustedAmt, this.state.todaysInterestRate, this.state.termsOfLoansinYears);
			this.setState({ principalRate:principalRate, isCheckedUSDA: !this.state.isCheckedUSDA, UsdaMipFinance3: this.state.UsdaMipFinance, adjusted_loan_amt: adjustedAmt},this.calTotalMonthlyPayment);
        }
	}
	
	handlePressVACheckedBox = (checked) => {
        if(this.state.isCheckedVA === false){
            //this.amount            = this.salesprice - this.downPayment;
            /*request         = {'salePrice': this.state.base_loan_amt,'FF': this.state.Vaff, 'vAmaxloanamount' : this.state.vAmaxloanamount};
			
			console.log("response ");

			//calling method to calculate the amount for VA Loan Type
			response         = getAdjustedVA(request);*/


			
			/**======= Start Changes added by lovedeep as per discussion with vinod sir on 08-06-2018 ======**/

			request.salePrice       = this.state.base_loan_amt;
			request.FF              = this.state.Vaff;
			request.vAmaxloanamount = this.state.vAmaxloanamount;
			request.amount          = this.state.base_loan_amt; 
			request.VA_RoundDownMIP = this.state.VA_RoundDownMIP;
			request.isfinanceVAMip  = this.state.isFinanceVAMIP;

			//console.log("getVaFundingFinance req " + JSON.stringify(request));

			responsePrepaid = getVaFundingFinance(request);


			//console.log("getVaFundingFinance response " + JSON.stringify(responsePrepaid));

			this.setState({
				VaFfFin  : responsePrepaid.VaFfFin,
				VaFfFin1 : responsePrepaid.VaFfFin1,
				VaFfFin2 : responsePrepaid.VaFfFin2,
				VaFfFin3 : this.state.VaFfFin2,
			});
            //this.amount            = this.salesprice;
			adjustedAmt        = responsePrepaid.adjusted;
					
			/**======= Start Changes added by lovedeep as per discussion with vinod sir on 08-06-2018 ======**/

			principalRate   = sumOfAdjustment(adjustedAmt, this.state.todaysInterestRate, this.state.termsOfLoansinYears);
			this.setState({ principalRate:principalRate, isCheckedVA: !this.state.isCheckedVA, VaFfFin3: this.state.VaFfFin2, adjusted_loan_amt: adjustedAmt},this.calTotalMonthlyPayment);
			
			console.log("principalRate 1 " + principalRate);
			
        } else {
			adjustedAmt    = this.state.base_loan_amt;
			principalRate   = sumOfAdjustment(adjustedAmt, this.state.todaysInterestRate, this.state.termsOfLoansinYears);
			this.setState({principalRate:principalRate, isCheckedVA: !this.state.isCheckedVA, VaFfFin3: this.state.VaFfFin, adjusted_loan_amt: adjustedAmt},this.calTotalMonthlyPayment);
			console.log("principalRate 2 " + principalRate);
		}
	}
	
	async componentDidMount() {

		if (Text.defaultProps == null) Text.defaultProps = {};
		Text.defaultProps.allowFontScaling = false;
		this.setState({
			loadingText : 'Initializing...'
		});
		BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
		response = await authenticateUser();
		if(response == '1'){
			this.props.navigator.push({name: 'Login', index: 0 });
		}else{
			AsyncStorage.getItem("userDetail").then((value) => {

			//	console.log("userdetail " + JSON.stringify(value));

				newstr = value.replace(/\\/g, "");
				var newstr = JSON.parse(newstr);
				newstr.user_name = newstr.first_name + " " + newstr.last_name;
				var subj = 'Closing Costs from '+newstr.user_name+'  at '+newstr.email;
				this.setState({
					email_subject : subj,
					text_message : subj,
					state_code :newstr.state_code  
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

				this.setState(newstr,this.componentApiCalls);
			}).done();
			this.setState({animating:'true'});
			
			AsyncStorage.getItem("initialOrientation").then((value) => {
				this.setState({
					initialOrientation : value 
				});
			}).done();

			AsyncStorage.getItem("Language").then((value) => {
				if(value != 'null' && value != null) {
					newstr = value.replace(/\\/g, "");
					var newstr = JSON.parse(newstr);
					console.log("value in buyer lang " + newstr)
					//console.log("value in buyer lang " + JSON.stringify(value));
					this.setState({
						languageType : newstr 
					});
				}
			}).done();
		}	
	}

	componentWillUnmount() {
		
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
	}

	handleBackButtonClick() {
		//this.props.navigation.goBack(null);
		Keyboard.dismiss;
		if(this.state.footer_tab == 'closing_cost' || this.state.footer_tab == 'prepaid' || this.state.footer_tab == 'payment') {
			// function created inside setstate object is called anonyms function which is called on the fly.
			this.setState({footer_tab: 'buyer'}, function() {
				if(this.state.footer_tab == 'buyer') {
					this.setState({netFirstFooterTab: true});
				} else {
					this.setState({netFirstFooterTab: false});
				}
			});
		} else {
			this.props.navigator.push({name: 'Dashboard', index: 0 });
		}
		//this.props.navigator.push({name: 'Dashboard', index: 0 });
		return true;	
	}
	
	componentApiCalls() {

	/**================== Start Special case for Colorado County added by lovedeep =======================**/
		
		let stateIds = [{id :'3'},{id : '10'},{id : '14'},{id : '32'},{id : '36'},{id : '37'},{id : '38'},{id : '44'},{id : '48'},{id : '50'}];

		for (var i = 0; i < stateIds.length; i++) {
			if(stateIds[i]['id'] == this.state.state) {
				this.setState({
					annualPropertyCheck : true,
				});
			}
		}

	/**================== End Special case for Florida County added by lovedeep =======================**/
	
		/*let findState	= stateIds.find(stateIds => stateIds.id === this.stateId);
		console.log("findstate " + findState);*/
		this.callBuyerSettingApi();
		//this.callBuyerConvSettingApi();
		//this.callbuyerEscrowXmlData();
		this.callGlobalSettingApi();	
		this.getBuyerCalculatorListApi();
		this.getAmtSchListApi();
		this.callUserAddressBook();
		this.callBuyerProrationSettingApi();
		this.callCdtcTridLoanComparisonSettings();
		// County global setting added by lovedeep as per discussion with vinod sir
		this.countyGlobalSetting();

	}

	countyGlobalSetting() {
		callPostApi(GLOBAL.BASE_URL + GLOBAL.county_global_setting, {
				state_id: this.state.state, county_id : this.state.county
			}, this.state.access_token)
        .then((response) => {
			if(result.status == 'success') {
				this.setState({
					fhaMaxLoanAmount : result.data.maxLoanAmount,
					vAmaxloanamount : result.data.vAmaxloanamount,
				});
			}
			console.log("county global setting " + JSON.stringify(result));
		});
	}

	// function added by lovedeep on 01-05-2018 for fetching default value of CDTC and TRID
	callCdtcTridLoanComparisonSettings() {   
		CdtcTridData = {
			'user_id': this.state.user_id,
			'company_id': this.state.company_id,
			'state_id':this.state.state_id
		}		
        callPostApi(GLOBAL.BASE_URL + GLOBAL.TRID_CDTC_Setting, CdtcTridData, this.state.access_token)
        .then((response) => {
			//console.log("resp of cdtctrid setting " + JSON.stringify(result));
			// Continue your code here...

			if (result.status == 'success') {	
				if(result.data.cdtc > 0 && result.data.cfpb == 0) {
					this.setState({
						CDTC_Status : true,
						TRID_Status : false,
					});	

				} else if (result.data.cdtc == 0 && result.data.cfpb > 0) {
					this.setState({
						CDTC_Status : false,
						TRID_Status : true,
					});	
				} else if(result.data.cdtc == 0 && result.data.cfpb == 0) {
					this.setState({
						CDTC_TRID_Status : false
					});
				}
			}
        });
    }
	
	callBuyerProrationSettingApi(){


		console.log("county id " + this.state.county);
		console.log("state id " + this.state.state);
		

		callPostApi(GLOBAL.BASE_URL + GLOBAL.buyer_proration_setting, {
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
				console.log("in if cond callBuyerProrationSettingApi ");
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

			console.log("length of proration " + prorationLength);


			console.log("proration setting " + JSON.stringify(result));


			if(result.status == 'success'){
				this.setState({proration: result});
			}
		});
	}
	
	onChange(text) {
		//newText = text.replace(/[^\d.]/g,'');
		val = text.replace(/[^0-9\.]/g,'');
		if(val.split('.').length>2) {
			val =val.replace(/\.+$/,"");
		}
		newText = val;
		return newText;	
	}
	
	// Calulation for discount price after changing discount percentage
	onChangeDisc(text,flag) {
		text = this.removeCommas(text);
		//discText = text.replace(/[^\d.]/g,'');
		val = text.replace(/[^0-9\.]/g,'');
		if(val.split('.').length>2) {
			val =val.replace(/\.+$/,"");
		}
		discText = val;

		console.log("discText " + discText);

		/*if(this.state.loan_amt2 != ''){
			valdisc = {'discountPerc': discText,'amount': this.state.loan_amt2};
		}else{
			valdisc = {'discountPerc': discText,'amount': this.state.loan_amt};
		}*/

		// changes added by lovedeep on 03-16-2018

		console.log("this.state.loan_amt 1 " + this.state.loan_amt);

		//console.log("this.state.loan_amt2 " + this.state.loan_amt2);


		console.log("loan amt " + this.state.loan_amt);
		console.log("loan amt 2 " + this.state.loan_amt2);
		

		adjustLoanAmt = parseInt(this.state.loan_amt) + parseInt(this.state.loan_amt2);

		valdisc = {'discountPerc': discText,'amount': adjustLoanAmt};

		console.log("valdisc " + JSON.stringify(valdisc));

        //calling method to calculate the discount amount
		amrt               = getDiscountAmount(valdisc);
		
		console.log("discount amnt resp " + JSON.stringify(amrt));

		this.setState({disc: parseFloat(discText).toFixed(2), discAmt: amrt.discount}, this.calTotalClosingCost);
	}
	
	delimitNumbers(str) {
	  return (str + "").replace(/\b(\d+)((\.\d+)*)\b/g, function(a, b, c) {
		return (b.charAt(0) > 0 && !(c || ".").lastIndexOf(".") ? b.replace(/(\d)(?=(\d{3})+$)/g, "$1,") : b) + c;
	  });
	}
	
	onChangeRate(text,flag) {

		console.log("alert 5");
		console.log("onchange rate");

		if(text != "" && text != '0.00'){
			text = this.removeCommas(text);
			if(flag=='sale_pr'){
				this.setState({
					loadingText : 'Calculating...'
				}, this.setState({animating:'true'}));
			} else {
				this.setState({animating:'true'});
			}
		}
		
		callPostApi(GLOBAL.BASE_URL + GLOBAL.get_city_state_for_zip, {
		"zip": this.state.postal_code

		},this.state.access_token)
		.then((response) => {
			zipRes = result;
			if(zipRes.status == 'fail') {
				if(this.state.sale_pr > 0){
					this.dropdown.alertWithType('error', 'Error', zipRes.message);
					this.setState({animating:'false'});
				}
			}else if(zipRes.data.state_name != null || zipRes.data.state_name != 'NULL'){
				this.onChangeRateStep(text,flag);
			}
		});
	}	

	onChangeText = (value) => {

		console.log("value onchange text " + JSON.stringify(value));

		
		//this.selectedSuggestion = false
	}

	onSelect = (suggestion) => {
		console.log(suggestion) // the pressed suggestion
	}
		
	onChangeRateStep(text,flag) {
		console.log("alert 6");
		if(text != "" && text != '0.00') {
			//newText = text.replace(/[^\d.]/g,'');
			val = text.replace(/[^0-9\.]/g,'');
			if(val.split('.').length>2) {
				val =val.replace(/\.+$/,"");
			}
			newText = val;
		} else {
			newText = '0.00';
		}

		console.log("this.state.ltv 1 " + this.state.ltv);
		/* newText = this.delimitNumbers(newText);
		Alert.alert("new", newText); */
		newTextCalc = newText;
		if(flag=='sale_pr') {
			this.setState({sale_pr: newText,sale_pr_calc: newTextCalc});
			request = {'salePrice': newText,'LTV': this.state.ltv, 'LTV2': this.state.ltv2, 'dp_request': this.state.dp_request};
			if(this.state.disc != '' && this.state.disc != 0){
				this.onChangeDisc(this.state.disc);
			}
		} else if(flag=='ltv') {
			newTextCalc = this.state.sale_pr_calc;
			this.setState({
					ltvowner : newText
				});
			
			console.log("this.state.ltv 2 " + newText);

			this.setState({ltv: newText});


			request = {'salePrice': this.state.sale_pr_calc,'LTV': newText, 'LTV2': this.state.ltv2, 'dp_request': this.state.dp_request};
		}
		else if(flag=='ltv2') {
			newTextCalc = this.state.sale_pr_calc;
			
			this.setState({ltv2: parseFloat(newText).toFixed(2),ltv2owner : parseFloat(newText).toFixed(2)});
			request = {'salePrice': this.state.sale_pr_calc,'LTV': this.state.ltv, 'LTV2': newText, 'dp_request': this.state.dp_request};
		}
		if(flag!='sale_pr') {
			if(flag=='ltv2' && newText == 0){
				 flag = 'sale_pr';
			}
			newText = this.state.sale_pr;
		}

			//console.log("newText " + newText + "this.state.ltv " + this.state.ltv);

		if(this.state.tab == 'CONV') {
			if(this.state.termsOfLoansinYears2 != "" && this.state.termsOfLoansinYears2 != '0.00'){
				request1 = {'amount': this.state.loan_amt2,'termsInYear': this.state.termsOfLoansinYears2, 'interestRate': this.state.todaysInterestRate1};
				//console.log("get2ndTd request1 " + JSON.stringify(request1));
				res = get2ndTd(request1);
				//console.log("get2ndTd response " + JSON.stringify(res));
				this.setState({pnintrate: res.pnintrate});
			} else {
				this.setState({pnintrate: '0.00'});
			}

			console.log("loan amount  2 req " + JSON.stringify(request));

			conv_amt = getAmountConventional(request);
			
			console.log("loan amount  2 resp " + JSON.stringify(conv_amt));

			if(this.state.downPaymentFixed == true) {
				conv_amt.downPayment = this.state.down_payment;
			}

			/**============== start chck added by lovedeep ===========**/

			if(this.state.downPaymentFixed == true) {
				if(this.state.loan_amt2 > 0){					
					conv_amt.amount = (parseFloat(this.state.sale_pr_calc) - parseFloat(this.state.down_payment) - parseFloat(this.state.loan_amt2)).toFixed(2);
					conv_amt.amount = parseFloat(conv_amt.amount).toFixed(2);
				} else {
					conv_amt.amount = parseFloat(this.state.sale_pr_calc).toFixed(2) - parseFloat(this.state.down_payment).toFixed(2);
					conv_amt.amount = parseFloat(conv_amt.amount).toFixed(2);
				}
				console.log("conv_amt.amount 1 " + conv_amt.amount);
			}

			/**============== end chck added by lovedeep ===========**/

			if(flag=='ltv2') {
				//console.log("in true status");
				if(this.state.downPaymentFixed == true){
					conv_amt.amount = this.state.sale_pr_calc - this.state.down_payment - conv_amt.amount;
					resaleConventionalLoanLTV    = conv_amt.ltv1;
					this.setState({ltv: resaleConventionalLoanLTV});
					//console.log("conv amt " + conv_amt.amount);
					console.log("conv_amt.amount 2 " + conv_amt.amount);
				}else{
					conv_amt.downPayment    = this.state.down_payment - conv_amt.amount2;
					conv_amt.downPayment = parseFloat(conv_amt.downPayment).toFixed(2);
					console.log("conv_amt.amount 3 " + conv_amt.amount);
				}

				

			}

			/*if(this.state.down_payment != "" && this.state.down_payment != "0.00") {
				if(conv_amt.amount2 > 0) {
					conv_amt.amount = this.state.sale_pr_calc - this.state.down_payment - conv_amt.amount2
				} else {
					conv_amt.amount = this.state.sale_pr_calc - this.state.down_payment;
				}
			}*/
			

			//console.log("down payment 1 " + conv_amt.downPayment);

			if (typeof conv_amt.amount2 !== 'undefined') {	
				this.setState({
						down_payment: conv_amt.downPayment,
						loan_amt: conv_amt.amount,
						loan_amt2: conv_amt.amount2,
						sale_pr: parseFloat(newText).toFixed(2),
						sale_pr_calc: newTextCalc,
				});
				
				//console.log("loan amount 3 " + conv_amt.amount);

				console.log("this.state.loan_amt 2 " + this.state.loan_amt);

				rate_loan_amt = (parseFloat(conv_amt.amount) + parseFloat(conv_amt.amount2)).toFixed(2);
				loan_amt1 = (parseFloat(conv_amt.amount) + parseFloat(conv_amt.amount2)).toFixed(2);
			} else {
				this.setState({
						down_payment: conv_amt.downPayment,
						loan_amt: conv_amt.amount,
						loan_amt2: '0.00',
						sale_pr: parseFloat(newText).toFixed(2),
						sale_pr_calc: newTextCalc,
				});
				rate_loan_amt = conv_amt.amount;
				loan_amt1 = conv_amt.amount;

				console.log("this.state.loan_amt 3 " + this.state.loan_amt);

				//console.log("loan amount 4 " + this.state.loan_amt);

				//console.log("down payment 2 " + conv_amt.downPayment);

			}
			loan_amt = conv_amt.amount;
			if (typeof conv_amt.amount2 !== 'undefined' && this.state.downPaymentFixed != true) {	
				loan_amt = (parseFloat(conv_amt.amount) + parseFloat(conv_amt.amount2)).toFixed(2);
				//console.log("loan amount 5 " + loan_amt);
			}


			console.log("this.state.loan_amt 4 " + this.state.loan_amt);

			//console.log("loan amount 1 " + this.state.loan_amt);

		}else if(this.state.tab == 'Owner_Carry') {
			if(this.state.termsOfLoansinYears2 != "" && this.state.termsOfLoansinYears2 != '0.00'){
				request1 = {'amount': this.state.loan_amt2,'termsInYear': this.state.termsOfLoansinYears2, 'interestRate': this.state.todaysInterestRate1};
				//console.log("get2ndTd request1 " + JSON.stringify(request1));
				res = get2ndTd(request1);
				//console.log("get2ndTd response " + JSON.stringify(res));
				this.setState({pnintrate: res.pnintrate});
			} else {
				this.setState({pnintrate: '0.00'});
			}

			console.log("loan amount  2 req " + JSON.stringify(request));

			conv_amt = getAmountConventional(request);
			
			console.log("loan amount  2 resp " + JSON.stringify(conv_amt));

			if(this.state.downPaymentFixed == true) {
				conv_amt.downPayment = this.state.down_payment;
			}

			/**============== start chck added by lovedeep ===========**/

			if(this.state.downPaymentFixed == true) {
				if(this.state.loan_amt2 > 0){					
					conv_amt.amount = (parseFloat(this.state.sale_pr_calc) - parseFloat(this.state.down_payment) - parseFloat(this.state.loan_amt2)).toFixed(2);
					conv_amt.amount = parseFloat(conv_amt.amount).toFixed(2);
				} else {
					conv_amt.amount = parseFloat(this.state.sale_pr_calc).toFixed(2) - parseFloat(this.state.down_payment).toFixed(2);
					conv_amt.amount = parseFloat(conv_amt.amount).toFixed(2);
				}
				console.log("conv_amt.amount 1 " + conv_amt.amount);
			}

			/**============== end chck added by lovedeep ===========**/

			if(flag=='ltv2') {
				//console.log("in true status");
				if(this.state.downPaymentFixed == true){
					conv_amt.amount = this.state.sale_pr_calc - this.state.down_payment - conv_amt.amount;
					resaleConventionalLoanLTV    = conv_amt.ltv1;
					this.setState({ltv: resaleConventionalLoanLTV});
					//console.log("conv amt " + conv_amt.amount);
					console.log("conv_amt.amount 2 " + conv_amt.amount);
				}else{
					conv_amt.downPayment    = this.state.down_payment - conv_amt.amount2;
					conv_amt.downPayment = parseFloat(conv_amt.downPayment).toFixed(2);
					console.log("conv_amt.amount 3 " + conv_amt.amount);
				}

				

			}

			/*if(this.state.down_payment != "" && this.state.down_payment != "0.00") {
				if(conv_amt.amount2 > 0) {
					conv_amt.amount = this.state.sale_pr_calc - this.state.down_payment - conv_amt.amount2
				} else {
					conv_amt.amount = this.state.sale_pr_calc - this.state.down_payment;
				}
			}*/
			

			//console.log("down payment 1 " + conv_amt.downPayment);

			if (typeof conv_amt.amount2 !== 'undefined') {	
				this.setState({
						down_payment: conv_amt.downPayment,
						loan_amt: conv_amt.amount,
						loan_amt2: conv_amt.amount2,
						sale_pr: parseFloat(newText).toFixed(2),
						sale_pr_calc: newTextCalc,
				});
				
				//console.log("loan amount 3 " + conv_amt.amount);

				console.log("this.state.loan_amt 2 " + this.state.loan_amt);

				rate_loan_amt = (parseFloat(conv_amt.amount) + parseFloat(conv_amt.amount2)).toFixed(2);
				loan_amt1 = (parseFloat(conv_amt.amount) + parseFloat(conv_amt.amount2)).toFixed(2);
			} else {
				this.setState({
						down_payment: conv_amt.downPayment,
						loan_amt: conv_amt.amount,
						loan_amt2: '0.00',
						sale_pr: parseFloat(newText).toFixed(2),
						sale_pr_calc: newTextCalc,
				});
				rate_loan_amt = conv_amt.amount;
				loan_amt1 = conv_amt.amount;

				console.log("this.state.loan_amt 3 " + this.state.loan_amt);

				//console.log("loan amount 4 " + this.state.loan_amt);

				//console.log("down payment 2 " + conv_amt.downPayment);

			}
			loan_amt = conv_amt.amount;
			if (typeof conv_amt.amount2 !== 'undefined' && this.state.downPaymentFixed != true) {	
				loan_amt = (parseFloat(conv_amt.amount) + parseFloat(conv_amt.amount2)).toFixed(2);
				//console.log("loan amount 5 " + loan_amt);
			}


			console.log("this.state.loan_amt 4 " + this.state.loan_amt);

			//console.log("loan amount 1 " + this.state.loan_amt);

		} else {
			this.setState({pnintrate: '0.00'});
		}
		
		// Work on fetching adjusted loan amt, loan amt and down payment on change of sale price
		callGetApi(GLOBAL.BASE_URL + GLOBAL.national_global_setting, {}, this.state.access_token)
			.then((response) => {


			/*===================================================================================**/
			/*===================================	FHA TAB START  ==============================**/
			/*===================================================================================**/

				if(this.state.tab == 'FHA') {
					if(newText <= result.data.nation_setting.FHA_SalePriceUnder){
						ltv = result.data.nation_setting.FHA_SalePriceUnderLTV;
					} else if (newText > result.data.nation_setting.FHA_SalePriceUnder && newText <= result.data.nation_setting.FHA_SalePriceTo){
						ltv = result.data.nation_setting.FHA_SalePriceToLTV;
					} else if (newText > result.data.nation_setting.FHA_SalePriceOver){
						ltv = result.data.nation_setting.FHA_SalePriceOverLTV;
					}
					if(this.state.downPaymentFixed == true) {
						ltv = this.state.ltv;
					}

					console.log("this.state.ltv 3 " + ltv); 
					//setting MIP according to the terms in year check for FHA
					if(this.state.termsOfLoansinYears <= result.data.nation_setting.FHA_YearsTwo) {
						mip = result.data.nation_setting.FHA_PercentTwo;
					} else if(this.state.termsOfLoansinYears > result.data.nation_setting.FHA_YearsTwo && this.state.termsOfLoansinYears <= result.data.nation_setting.FHA_YearsOne) {
						mip = result.data.nation_setting.FHA_PercentOne;
					}
					roundDownMIP = result.data.nation_setting.FHA_RoundDownMIP;
					//creating object for sales price, loan to value and MIP
					data        = {'salePrice': newText,'LTV': ltv, 'MIP': mip, 'fhaMaxLoanAmount' : this.state.fhaMaxLoanAmount, 'roundDownMIP' : roundDownMIP};
					//calling method to calculate the amount and adjusted for FHA Loan Type
					resp        = getAmountFHA(data);
					requestPrepaidData = {'salePrice': resp.amount, 'MIP': mip, 'fhaMaxLoanAmount' : this.state.fhaMaxLoanAmount};        
					responsePrepaid = getFhaMipFinance(requestPrepaidData);
					loan_amt = resp.adjusted;	
					rate_loan_amt = resp.amount;	
					loan_amt1 =  resp.adjusted;	
					
					if(newText <= result.data.nation_setting.mMIAmountUpto){
						rateValue	= result.data.nation_setting.mMI;
					}
					if(newText > result.data.nation_setting.mMIAmountExceed){
						rateValue	= result.data.nation_setting.mMIExceed;
					}

					this.setState({
						fhaMIP:mip,
						loan_amt: resp.amount,
						adjusted_loan_amt: resp.adjusted,
						down_payment: resp.downPayment,
						base_loan_amt: resp.amount,
						sale_pr: parseFloat(newText).toFixed(2),
						sale_pr_calc: newTextCalc,
						FhaMipFin: responsePrepaid.FhaMipFin,
						FhaMipFin1: responsePrepaid.FhaMipFin1,
						FhaMipFin2: responsePrepaid.FhaMipFin2,
						FhaMipFin3: responsePrepaid.FhaMipFin2,
						rateValue: rateValue,
					});	

					console.log("down payment 3 " + resp.downPayment);
				} 
				
			/*=======================================================================================**/
			/*===================================	VA TAB START  ===================================**/
			/*=======================================================================================**/
			
				else if(this.state.tab == 'VA') {
					ff              = result.data.nation_setting.VA_FundingFee;

					/**======== Start Changes added by lovedeep as per discussion with vinod sir =========**/

					va_finance_mip    = result.data.nation_setting.VA_FinanceMIP;
					VA_round_down_mip =  result.data.nation_setting.VA_RoundDownMIP;
					//console.log("va_finance_mip " + va_finance_mip);
					//console.log("VA_round_down_mip " + VA_round_down_mip);
					if(va_finance_mip == 'Y') {
						var isfinanceVAMip = true;
					} else {
						isfinanceVAMip = false;
					}
					this.setState({
						isFinanceVAMIP : isfinanceVAMip,
						VA_RoundDownMIP : VA_round_down_mip
					});
					//console.log("isfinanceVAMip " + isfinanceVAMip);
					
					/**======== End Changes added by lovedeep as per discussion with vinod sir =========**/

					if(this.state.Vaff != '0.00'){
						ff = this.state.Vaff;
					}
					if(this.state.downPaymentFixed == true){
						amt = (parseFloat(newText) - parseFloat(this.state.down_payment)).toFixed(2);
					} else {
						amt = newText;
					}
					//console.log("amt " + JSON.stringify(amt));

					/**======== Start Changes added by lovedeep as per discussion with vinod sir =========**/

					data         = {'salePrice': amt,'FF': ff, 'vAmaxloanamount' : this.state.vAmaxloanamount};
					resp        = getAdjustedVA(data);

					if(this.state.downPaymentFixed == true) {
						data.amount = amt;
					} else {
						data.amount = resp.amount;
					}
					data.VA_RoundDownMIP = VA_round_down_mip;
					data.isfinanceVAMip = isfinanceVAMip;

					/**======== Start Changes added by lovedeep as per discussion with vinod sir =========**/

					//console.log("getVaFundingFinance Request " + JSON.stringify(data));
					responsePrepaid         = getVaFundingFinance(data);
					//console.log("getVaFundingFinance Resp " + JSON.stringify(responsePrepaid));
					loan_amt = responsePrepaid.adjusted;
					rate_loan_amt = responsePrepaid.adjusted;	
					loan_amt1 = responsePrepaid.adjusted;

					rateValue = '0.00';
					if(this.state.downPaymentFixed == true) {
						console.log("if cond of downpayment");
						resp.amount = (parseFloat(newText) - parseFloat(this.state.down_payment)).toFixed(2);
						resp.downPayment = this.state.down_payment;
						base_loan_amt = resp.amount;
					} else {
						// commented by lovedeep as per discussion with vinod sir
						//base_loan_amt = newText;
						// added by lovedeep as per discussion with vinod sir
						base_loan_amt = resp.amount;
					}
					//console.log("amount in VA case " + responsePrepaid.adjusted);
					if (this.state.isFinanceVAMIP == true || this.state.downPaymentFixed == true) {
						this.setState({
							VaFfFin3 : responsePrepaid.VaFfFin2
						});
						//this.state.VaFfFin3 = responsePrepaid.VaFfFin2;
					} else {
						this.setState({
							VaFfFin3 : responsePrepaid.VaFfFin
						});
					}
				    //console.log("adjusted_loan_amt 2 " + responsePrepaid.adjusted);
					this.setState({
						loan_amt: resp.amount,
						adjusted_loan_amt: responsePrepaid.adjusted,
						down_payment: resp.downPayment,
						base_loan_amt: base_loan_amt,
						sale_pr: parseFloat(newText).toFixed(2),
						sale_pr_calc: newTextCalc,
						Vaff: ff,
						VaFfFin: responsePrepaid.VaFfFin,
						VaFfFin1: responsePrepaid.VaFfFin1,
						VaFfFin2: responsePrepaid.VaFfFin2,
						rateValue: rateValue,
					});
					
					console.log("down payment 4 " + resp.downPayment);

				} 
				
			/*=====================================================================================**/
			/*===================================	USDA TAB START  ===============================**/
			/*=====================================================================================**/
				
				else if(this.state.tab == 'USDA') {
					mip = result.data.nation_setting.USDA_MIPFactor;
					USDA_MonthlyMIPFactor        = result.data.nation_setting.USDA_MonthlyMIPFactor;
					rateValue = USDA_MonthlyMIPFactor / 100;
					rateValue = parseFloat(rateValue).toFixed( 5 );
					if(this.state.downPaymentFixed == true) {
						amt = (parseFloat(newText) - parseFloat(this.state.down_payment)).toFixed(2);
					} else {
						amt = newText;
					}
					data         = {'salePrice': amt,'MIP': mip};
					resp         = getAdjustedUSDA(data);
					loan_amt = resp.adjusted;	
					rate_loan_amt = newText;	
					loan_amt1 = resp.adjusted;	
					responsePrepaid         = getUsdaMipFinance(data);
					if(this.state.downPaymentFixed == true) {
						resp.amount = (parseFloat(newText) - parseFloat(this.state.down_payment)).toFixed(2);
						resp.downPayment = this.state.down_payment;
						base_loan_amt = resp.amount;
					} else {
						base_loan_amt = newText;
					}
					//console.log("adjusted_loan_amt 3 " + resp.adjusted);
					this.setState({
						usdaMIP: mip,
						loan_amt: resp.amount,
						adjusted_loan_amt: resp.adjusted,
						down_payment: resp.downPayment,
						base_loan_amt: base_loan_amt,
						sale_pr: parseFloat(newText).toFixed(2),
						sale_pr_calc: newTextCalc,
						UsdaMipFinance: responsePrepaid.UsdaMipFinance,
						UsdaMipFinance1: responsePrepaid.UsdaMipFinance1,
						UsdaMipFinance2: responsePrepaid.UsdaMipFinance2,
						UsdaMipFinance3: responsePrepaid.UsdaMipFinance2,
						rateValue: rateValue,
					});

					console.log("down payment 5 " + resp.downPayment);

				} 
				
			/*=====================================================================================**/
			/*===================================	CASH TAB START  ===============================**/
			/*=====================================================================================**/
				
				else if(this.state.tab == 'CASH') {
					rateValue = '0.00';
					this.setState({
						down_payment: newText,
						sale_pr: parseFloat(newText).toFixed(2),
						sale_pr_calc: newTextCalc,
						adjusted_loan_amt: loan_amt,
						rateValue: rateValue,
					},this.changePrepaidPageFields);
				}
				
	/*=======================================================================================================**/
	/*==================================   END VA, USDA, FHA & CASH CASE  ===================================**/
	/*=======================================================================================================**/	

				if(this.state.termsOfLoansinYears2 != '') {
					year = parseInt(this.state.termsOfLoansinYears) + parseInt(this.state.termsOfLoansinYears2);
				} else {
					year = this.state.termsOfLoansinYears;
				}
				if(this.state.ltv2 > 0) {
					loan = (parseFloat(this.state.ltv) + parseFloat(this.state.ltv2)).toFixed(2);
				} else {
					loan = this.state.ltv;
				}


			/*=====================================================================================**/
			/*===============================   CONVENTIONAL TAB START  ===========================**/
			/*=====================================================================================**/

				if(this.state.tab == 'CONV' || this.state.tab == 'Owner_Carry') {
					rateValue	= '0.00';
					if(year > 15){
						if(loan >= 80.1 && loan <= 85.0){
							rateValue = result.data.nation_cc_setting.renewelRatefor801to850Lons;
						}
						if(loan >= 85.1 && loan <= 90.0){
							rateValue = result.data.nation_cc_setting.renewelRatefor851to900Lons;
						}
						if(loan >= 90.1 && loan <= 95.0){
							rateValue = result.data.nation_cc_setting.renewelRatefor901to950Lons;
						}
						if(loan >= '95.1' && loan <= '97.0'){
							rateValue = result.data.nation_cc_setting.renewelRatefor95to97Lons;
						}
					} else if(year <= 15){
						if(loan >= '80.1' && loan <= '85.0'){
							rateValue = result.data.nation_cc_setting.year15_renewelRatefor801to850Lons;
						}
						if(loan >= '85.1' &&loan <= '90.0'){
							rateValue = result.data.nation_cc_setting.year15_renewelRatefor851to900Lons;
						}
						if(loan >= '90.1' && loan <= '95.0'){
							rateValue = result.data.nation_cc_setting.year15_renewelRatefor901to950Lons;
						}
						if(loan >= '95.1' && loan <= '97.0'){
							rateValue = result.data.nation_cc_setting.year15_renewelRatefor95to97Lons;
						}
					}
					
					/* if(newText != "" && newText != '0.00'){
						callPostApi(GLOBAL.BASE_URL + GLOBAL.conventional_setting, {
							user_id: this.state.user_id,company_id: this.state.company_id
						}, this.state.access_token)
						.then((response) => {
							this.setState({
								taxservicecontract: result.data.taxservicecontract,
								underwriting: result.data.underwriting,
								processingfee: result.data.processingfee,
								appraisalfee: result.data.appraisalfee,
								documentprep: result.data.documentpreparation,
								originationfactor: result.data.originationFactor, 
							});
						});
					} */	
					this.setState({
						sale_pr: parseFloat(newText).toFixed(2),
						adjusted_loan_amt: loan_amt,
						rateValue: rateValue,
					});
				}

				
				/**========================== Start Special case for Texas state ===========================**/

				if (this.state.sale_pr > 0) {
					var countyCheck = this.inArray(this.state.county, texas_Hexter_Fair_counties_Arr);
					//let countyCheck = texas_Hexter_Fair_counties_Arr.indexOf(this.state.county);
					//console.log("county " + this.state.county);					
					//console.log("county check " + countyCheck);
					if(countyCheck != false){
						annualPropertyTax = (this.state.sale_pr * 3) / 100;
						this.setState({
							annualPropertyTax : annualPropertyTax,
							isCheckForFlorida : true
						}, this.changeAnnualTax);
					}
				}

				/**========================== End Special case for Texas state ===========================**/

				//data_mon_tax = {'salePrice': newText,'monthlyTax': this.state.monTax,'months': this.state.monTaxVal, 'annualPropertyTax':this.state.annualPropertyTax,'stateId':this.state.state,'countyId':this.state.county,'AnnualPropertyCheck':this.state.isCheckForFlorida};

				data_mon_tax = {'salePrice': newText,'monthlyTax': this.state.monTax,'months': this.state.monTaxVal, 'annualPropertyTax':this.state.annualPropertyTax,'stateId':this.state.state,'countyId':this.state.county,'AnnualPropertyCheck':this.state.isCheckForFlorida,'summerPropertyTax': this.state.summerPropertyTax, 'winterPropertyTax': this.state.winterPropertyTax,'zip': this.state.postal_code};

				if (this.state.state == "3" || this.state.state == "32" || this.state.state == "44") {
					if (parseFloat(this.state.annualPropertyTax) > 0 && this.state.monTaxVal > 0) {
						//this.state.annualPropertyCheck = true;	
						resp_mon_tax = useAnnualTaxforPrepaid(data_mon_tax);
						//this.state.monTax = response.prepaidMonthRate;
						this.setState({
							isCheckForFlorida : true,
							monTax              : resp_mon_tax.prepaidMonthRate
						});
						//console.log("montax 1 " + resp_mon_tax.prepaidMonthRate);
					} else {
						resp_mon_tax = getPreMonthTax(data_mon_tax);
					}
				} else {
					resp_mon_tax = getPreMonthTax(data_mon_tax);
				}
				prepaidMonthTaxes = resp_mon_tax.prepaidMonthTaxes;
				data_mon_ins         = {'salePrice': newText,'insuranceRate': this.state.monIns,'months': this.state.numberOfMonthsInsurancePrepaid,'loanType': this.state.tab};
				
				resp_mon_ins            = getMonthlyInsurance(data_mon_ins);
				monthInsurance = resp_mon_ins.monthInsurance;
				monthlyRate	= '0.00';
				titleVal	= 'PMI';

				//creating object for amount and rate value
				// changes by lovedeep on 03-07-2018 
				// modify if condition as per discussion with atul and vinod sir
				// value coming 0.88( wrong ) and now it comes 0.875

				if(this.state.tab == 'USDA') {
					requestMMI 		= {'amount': rate_loan_amt, 'rateValue': rateValue * 100};
				} else {
					requestMMI 		= {'amount': rate_loan_amt, 'rateValue': rateValue};
				}

				console.log("requestMMI " + JSON.stringify(requestMMI));

				//Alert.alert("df",JSON.stringify(requestMMI));
				//calling method to calculate the FHa MIP Finance for prepaid
				
				responseMMI 		= getMonthlyRateMMI(requestMMI);

				console.log("responseMMI " + JSON.stringify(responseMMI));

				monthlyRate		= responseMMI.monthlyRateMMI;

				console.log("monthlyRate 1 " + monthlyRate);

				monthPmiVal		= responseMMI.monthPmiVal;

				console.log("monthPmiVal 1 " + monthPmiVal);

				console.log("loan_amt1 " + loan_amt1 + "this.state.todaysInterestRate " + this.state.todaysInterestRate + "this.state.termsOfLoansinYears " + this.state.termsOfLoansinYears);

				principalRate   = sumOfAdjustment(loan_amt1, this.state.todaysInterestRate, this.state.termsOfLoansinYears);

				console.log("principalRate 3 " + principalRate);

				//creating object for prepaid monthly tax
				req = {'months': this.state.monTaxVal, 'prepaidMonthTaxesRes': prepaidMonthTaxes};
				//calling method to calculate the discount amount
				responseRealEstate                   = getRealEstateTaxes(req);
				
				//console.log(this.response.prepaidMonthTaxes);
				realEstateTaxesRes        = responseRealEstate.realEstateTaxes;	
				//creating object for prepaid monthly insurance
				requestHomeOwnerInsData       = {'monthInsuranceRes': monthInsurance,'months': this.state.numberOfMonthsInsurancePrepaid};
				//calling method to calculate the discount amount
				responseHomeOwnerIns = getHomeOwnerInsurance(requestHomeOwnerInsData);
				homeOwnerInsuranceRes        = responseHomeOwnerIns.homeOwnerInsuranceRes;
				if(this.state.tab == 'CASH'){
					principalRate = '0.00';
					realEstateTaxesRes = '0.00';
				}else if(this.state.tab == 'Owner_Carry' && this.state.isCheckForFirstLoan == true){
					realEstateTaxesRes = '0.00';
				}	

				//console.log("adjusted_loan_amt 4 " + loan_amt);
				//alert(monthlyRate);
				//Alert.alert('test',JSON.stringify(req));
				this.setState({
					monthPmiVal: monthPmiVal,
					monthlyRate: monthlyRate,
					principalRate: principalRate,
					realEstateTaxesRes: realEstateTaxesRes,
					homeOwnerInsuranceRes: homeOwnerInsuranceRes,
					animating:'true'
				},this.callSettingApiForTabs);

				console.log("monthPmiVal 2 " + monthPmiVal);

				console.log("this.state.loan_amt 5 " + this.state.loan_amt);

				//console.log("loan amount  1 valueee " + this.state.loan_amt);


			});	
	}

	inArray(searchstr,refarr){

		var count=refarr.length;
		for(var i=0;i<count;i++)
		{
			//console.log("refarr[i] " + refarr[i]);
			//console.log("searchstr " + searchstr);
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

	_onChangeProrationPercent = (item) => {

		console.log("item " + JSON.stringify(item));

		this.setState({
			prorationPercentSelectedDropdownVal : item,
			prorationPercent : item.value
        }, this.changeAnnualTax);
	}	

	

	changeDate(date){

		var monthNames = [ "", "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec" ]; 
		var split = date.split('-');
		//date = this.state.date;
		//var split = date.split('-');
		date = Number(split[0])+'/'+Number(split[1])+'/'+Number(split[2]);
		monthNameForProration = monthNames[Number(split[0])];

		prorationAmt = this.state.proration;
		//this.state.proration[monthNameForProration];
		
		
		/**==================================================================================================== 
		 
			Start Proration changes by lovedeep for multiple states as per discussion with Vinod Sir on 04-06-2018   
		  ==================================================================================================**/


		/** 
		 * Below old Code commented by lovedeep 
		 *   
		request         = {'annualPropertyTax': this.state.annualPropertyTax, 'proration': prorationAmt, 'date': parseInt(split[1]), 'month': parseInt(split[0]), 'state_code': this.state.state_code};
		//Alert.alert("dsf", split[2]);
		data = getBuyerEstimatedTax(request);
		**/



		/**==== New Code added By Lovedeep **/

		// Special case for LUCAS county, OHIO state
		if(this.state.county == '2090') {
			if(this.state.summerPropertyTax > 0 && this.state.winterPropertyTax > 0) {
				Alert.alert('CostsFirst', 'Only one box can be used');
				this.setState({
					winterPropertyTax : '0.00'
				});
			} else {
				request         = {'summerPropertyTax': this.state.summerPropertyTax, 'winterPropertyTax': this.state.winterPropertyTax, 'prorationPercent': this.state.prorationPercent, 'annualPropertyTax': this.state.annualPropertyTax, 'proration': prorationAmt, 'closing_date':  date, 'state_code': this.state.state_code, 'state_id' : this.state.state, 'county_id' : this.state.county, 'city': this.state.city,'type':'buyer'};
				console.log("proration request " + JSON.stringify(request));
				data = getBuyerEstimatedTax(request);
				console.log("proration resp " + JSON.stringify(data));
				//this.setState({estimatedTaxProrations: data.estimatedTax},this.changePrepaidPageFields);
			
				this.setState({date: date, monName: monthNames[Number(split[0])], estimatedTaxProrations: data.estimatedTax},this.callGlobalSettingApiOnDateChange);
			}
		} else {
			request         = {'summerPropertyTax': this.state.summerPropertyTax, 'winterPropertyTax': this.state.winterPropertyTax, 'prorationPercent': this.state.prorationPercent, 'annualPropertyTax': this.state.annualPropertyTax, 'proration': prorationAmt, 'closing_date': date, 'state_code': this.state.state_code, 'state_id' : this.state.state, 'county_id' : this.state.county, 'city': this.state.city,'type':'buyer'};
			console.log("proration request " + JSON.stringify(request));
			data = getBuyerEstimatedTax(request);
			console.log("proration resp " + JSON.stringify(data));
			//this.setState({estimatedTaxProrations: data.estimatedTax},this.changePrepaidPageFields);
			this.setState({date: date, monName: monthNames[Number(split[0])], estimatedTaxProrations: data.estimatedTax},this.callGlobalSettingApiOnDateChange);
		}




		/**==================================================================================================== 
		 
			Start Proration changes by lovedeep for multiple states as per discussion with Vinod Sir on 04-06-2018   
		==================================================================================================**/




	}
	
	changeAnnualTax(){

		console.log("prorationPercent " + this.state.prorationPercent);
		
		console.log("date changeAnnualTax " + this.state.date);
		


		var monthNames = [ "", "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec" ]; 
		date = this.state.date;
		var split = date.split('-');
		//date = this.state.date;
		//var split = date.split('-');
		date = Number(split[0])+'/'+Number(split[1])+'/'+Number(split[2]);
		
		monthNameForProration = monthNames[Number(split[0])];
		prorationAmt = this.state.proration; 

		
		//this.state.proration[monthNameForProration];
		
		//console.log("annuaprp " + this.state.annualPropertyTax + "proration " + prorationAmt + "date " + parseInt(split[1]) + "month " + parseInt(split[0]));
		
		//alert(this.state.user_state);
		


		/**==================================================================================================== 
		 
			Start Proration changes by lovedeep for multiple states as per discussion with Vinod Sir on 04-06-2018   
		==================================================================================================**/


		/** 
		 * Below old Code commented by lovedeep 
		 *   
		request         = {'annualPropertyTax': this.state.annualPropertyTax, 'proration': prorationAmt, 'date': parseInt(split[1]), 'month': parseInt(split[0]), 'state_code': this.state.state_code};
		//Alert.alert("dsf", split[2]);
		data = getBuyerEstimatedTax(request);
		**/


		/**==== New Code added By Lovedeep **/
		// Special case for LUCAS county, OHIO state
		if(this.state.county == '2090') {
			if(this.state.summerPropertyTax > 0 && this.state.winterPropertyTax > 0) {
				Alert.alert('CostsFirst', 'Only one box can be used');
				this.setState({
					winterPropertyTax : '0.00'
				});
			} else {
				request         = {'summerPropertyTax': this.state.summerPropertyTax, 'winterPropertyTax': this.state.winterPropertyTax, 'prorationPercent': this.state.prorationPercent, 'annualPropertyTax': this.state.annualPropertyTax, 'proration': prorationAmt, 'closing_date':  date, 'state_code': this.state.state_code, 'state_id' : this.state.state, 'county_id' : this.state.county, 'city': this.state.city,'type':'buyer'};
				console.log("proration request " + JSON.stringify(request));

				//alert(JSON.stringify(request));

				data = getBuyerEstimatedTax(request);
				console.log("proration resp 1 " + JSON.stringify(data));
				this.setState({estimatedTaxProrations: data.estimatedTax},this.changePrepaidPageFields);
			}
		} else {
			request         = {'summerPropertyTax': this.state.summerPropertyTax, 'winterPropertyTax': this.state.winterPropertyTax, 'prorationPercent': this.state.prorationPercent, 'annualPropertyTax': this.state.annualPropertyTax, 'proration': prorationAmt, 'closing_date':  date, 'state_code': this.state.state_code, 'state_id' : this.state.state, 'county_id' : this.state.county, 'city': this.state.city,'type':'buyer'};
			console.log("proration request " + JSON.stringify(request));
			//alert(JSON.stringify(request));
			data = getBuyerEstimatedTax(request);
			
			console.log("proration resp 2 " + JSON.stringify(data));
			this.setState({estimatedTaxProrations: data.estimatedTax},this.changePrepaidPageFields);
		}



		/**==================================================================================================== 
		 
		End Proration changes by lovedeep for multiple states as per discussion with Vinod Sir on 04-06-2018   
		==================================================================================================**/
		
	}

	handlePressCheckedBoxFirstLoan = (checked) =>  {


		console.log(checked);

		if(this.state.isCheckForFirstLoan == false) {
			this.setState({
				firstLoanOwnerCarry : true,
				isCheckForFirstLoan : !this.state.isCheckForFirstLoan
			});
			
			if(this.state.ltvowner != '0.00'){
				this.setState({
					ltv : this.state.ltvowner
				});
			}else{
				this.setState({
					ltv : '80.00'
				});
			}
			
            adjustedamount = parseFloat(this.state.loan_amt);
            if (this.state.secondLoanOwnerCarry == true) {
                adjustedamount = parseFloat(this.state.loan_amt2);
            }
			
            if (adjustedamount == 0) {
				this.setState({
						escrowFee: '0.00',
						ownerFee : '0.00',
						lenderFee: '0.00',

					},this.callCASHsettinsapi);
            }else{
				this.callCASHsettinsapi();
			}
			
			
		} else {
			if(this.state.isCheckForSecondLoan == true){
				ltvVal=this.state.ltv;
			}else{
				ltvVal='0.00';
			}
			this.setState({
				firstLoanOwnerCarry : false,
				isCheckForFirstLoan : !this.state.isCheckForFirstLoan,
				ltv : ltvVal,
				monTaxVal: this.state.monTaxValReal,
			},this.callsettingapi);
		}
	}
	
	callsettingapi(){
		callPostApi(GLOBAL.BASE_URL + GLOBAL.Buyer_Cost_Setting, {
		user_id: this.state.user_id,company_id: this.state.company_id, zip: this.state.postal_code
		}, this.state.access_token)
		.then((response) => {

			console.log("buyer cost setting " + JSON.stringify(result));


			request = {'salePrice': result.data.userSetting.todaysInterestRate,'LTV': '90', 'LTV2': ''};
			conv_amt = getAmountConventional(request);
			
			var j=1;
			for (resObjMonthExp of result.data.userSettingMonthExp) {
				
					const updateMonthExp = {};
					updateMonthExp['monthlyExpensesOther' + j] = resObjMonthExp.label;
					if('paymentAmount' + j + "Fixed" == true){
						paymentAmt = this.state['paymentAmount' + j];
					}else{
						paymentAmt = resObjMonthExp.fee;
					}
					
					updateMonthExp['paymentAmount' + j] = paymentAmt;
					updateMonthExp['typeMonthExp' + j] = resObjMonthExp.key;
					this.setState(updateMonthExp);
					if(j == 3){
						if(this.state.costOtherFixed == true){
							paymentAmt = this.state['costOtherFixed'];
						}else{
							paymentAmt = resObjMonthExp.fee;
						}
						this.setState({twoMonthsPmi1: resObjMonthExp.label,costOther: resObjMonthExp.fee});
					}
				j++; 
			}
			
			var i=1;
			resultCount = _.size(result.data.userSettingCost);
			
			console.log("resultCount " + resultCount);			
			
			const costRequest = {};
			
			// For setting last fields of closing costs page
			if((this.state.tab == 'CONV' || this.state.tab == 'Owner_Carry') && this.state.loan_amt != ""){
				amt = this.state.loan_amt;
			}else if(this.state.tab == 'CASH'){
				amt = '0.00';
			}else{
				amt = this.state.adjusted_loan_amt;
			}
			//Alert.alert("df",JSON.stringify(result.data.userSettingCost));
			for (let resObj of result.data.userSettingCost) {
				const update = {};
				req         = {'amount': amt,'salePrice': this.state.sale_pr_calc,'type': resObj.type,'rate':resObj.fee};
				
				var data = getCostTypeTotal(req);
				
				feeval = data.totalCostRate;
				
				//	update['fee' + i] = feeval;
				if(i==5){
					update['label' + i] = resObj.label;
					update['fee' + i] = '0.00';
					update['totalfee' + i] = '0.00';
					costRequest['cost' + i] = '0.00';
				}else{
					update['label' + i] = resObj.label;
					update['fee' + i] = feeval;
					update['totalfee' + i] = resObj.fee;
					costRequest['cost' + i] = resObj.fee;
				}
				update['type' + i] = resObj.type;
				
				this.setState(update);
				i++;
			}
			if(i == resultCount + 1){
				let costResponse    = getTotalCostRate(costRequest);
				totalCost      = costResponse.totalCostRate;
				if(this.state.monTaxFixed){
					monTax = this.state.monTax;
				}else{
					monTax = result.data.userSetting.taxRatePerYearPerOfSalePrice;
				}

				console.log("montax 5 " + monTax);

				if(this.state.monInsFixed){
					monIns = this.state.monIns;
				}else{
					monIns = result.data.userSetting.homeownerInsuranceRateYearOfSalePrice;
				}
				if(this.state.numberOfDaysPerMonthFixed){
					numberOfDaysPerMonth = this.state.numberOfDaysPerMonth;
				}else{
					numberOfDaysPerMonth = result.data.userSetting.numberOfDaysPerMonth;
				}
				if(this.state.creditReportFixed){
					creditReport = this.state.creditReport;
				}else{
					creditReport = result.data.userSetting.creditReport;
				}
				this.setState({
					todaysInterestRate: result.data.userSetting.todaysInterestRate,
					termsOfLoansinYears: result.data.userSetting.termsOfLoansinYears,
					numberOfDaysPerMonth: numberOfDaysPerMonth,
					numberOfMonthsInsurancePrepaid: result.data.userSetting.numberOfMonthsInsurancePrepaid,
					monTax: monTax,
					monIns: monIns,
					creditReport: creditReport,
					totalCost: totalCost,
					down_payment: conv_amt.downPayment,
					loan_amt: conv_amt.amount,
				},this.callSalesPr);

				console.log("down payment 6 " + conv_amt.downPayment);


			}	
			//Alert.alert('Alert!', JSON.stringify(result.data.totalCost))
			
		});
			console.log("alert 11");
			//this.settingsApi('Owner_Carry');
			/* this.changeMonInsPrice();
			this.changeDayInterestPrice();
			this.calOriginatinFee(); */
	}
	
	callsettingsApiForOwnerCarry(){
		this.settingsApi('Owner_Carry');
	}
	
	handlePressCheckedBoxForSecondLoan = (checked) =>  {

		if(this.state.isCheckForSecondLoan == false) {
			if(this.state.ltvowner != '0.00'){
				ltvVal=this.state.ltvowner;
			}else{
				ltvVal='80.00';
			}
			
			if(this.state.ltv2owner != '0.00'){
				ltv2Val=this.state.ltv2owner;
			}else{
				ltv2Val='0.00';
			}
			this.setState({
				secondLoanOwnerCarry : true,
				isCheckForSecondLoan : !this.state.isCheckForSecondLoan,
				ltv : ltvVal,
				ltv2 : ltv2Val
			},this.callSalesPr);
		} else {
			if(this.state.isCheckForFirstLoan == false) {
				ltvVal='0.00';
			}else{
				ltvVal=this.state.ltv;
			}
			this.setState({
				secondLoanOwnerCarry : false,
				isCheckForSecondLoan : !this.state.isCheckForSecondLoan,
				ltv : ltvVal,
				ltv2 : '0.00'
			},this.callSalesPr);
		}
	}

	// function changePrepaidPageFields will call when adjusted amount and amount will set
	changePrepaidPageFields(){
			console.log("alert 11");
			this.changeMonTaxPrice();
			/* this.changeMonInsPrice();
			this.changeDayInterestPrice();
			this.calOriginatinFee(); */
	}
	
	calOriginatinFee(){

		console.log("alert 15");
		console.log("prepaidMonthTaxes 6 " + this.state.prepaidMonthTaxes);

			//creating object for origination fee and amount
			if(this.state.tab == "VA" || this.state.tab == "FHA"){
				loan_amt = this.state.base_loan_amt;
			}else{
				loan_amt = this.state.loan_amt;
			}

			console.log("loan amount " + loan_amt);

			if(this.state.tab == 'CONV' || this.state.tab == 'Owner_Carry') {
				request         = {'originationFee': this.state.originationfactor, 'originationFactorType': this.state.originationFactorType, 'amount': loan_amt, 'amount2': this.state.loan_amt2};


				console.log(" if Origination Fee calOriginatinFee 1 " + JSON.stringify(request));

			}else{
				request         = {'originationFee': this.state.originationfactor, 'originationFactorType': this.state.originationFactorType, 'amount': loan_amt, 'amount2': '0.00'};

				console.log(" else Origination Fee calOriginatinFee 2 " + JSON.stringify(request));

			}
		//	Alert.alert('Alert!', JSON.stringify(request))
            //calling method to calculate the discount amount
            response         = getOriginationFee(request);
			if(this.state.originationFeeFixed){
				originationFee = this.state.originationFee;
			}else{
				originationFee = response.originationFee;
			}
			this.setState({originationFee: originationFee},this.calTotalMonthlyPaymentAfterAnnualPriceChange);

			console.log(" else Origination Fee calOriginatinFee 3 " + JSON.stringify(request));


	}
	
	//Total Monthly Payment
    calTotalMonthlyPaymentAfterAnnualPriceChange(){

		console.log("alert 16");
		console.log("prepaidMonthTaxes 5 " + this.state.prepaidMonthTaxes);

		requestTotPreItem         = {'principalRate': this.state.principalRate, 'realEstateTaxesRes': this.state.realEstateTaxesRes, 'homeOwnerInsuranceRes': this.state.homeOwnerInsuranceRes, 'monthlyRate': this.state.monthlyRate, 'pnintrate': this.state.pnintrate, 'paymentAmount1': this.state.paymentAmount1, 'paymentAmount2': this.state.paymentAmount2};
		responseTotPreItem        = getTotalMonthlyPayment(requestTotPreItem);
		this.setState({totalMonthlyPayment: responseTotPreItem.totalMonthlyPayment, totalMonthlyPaymentOld: responseTotPreItem.totalMonthlyPayment},this.calTotalClosingCost);
	}
	
	onChangetotalMonthlyPayment(payment) {
		//alert("payment val " + payment);
		if(payment != '' && payment != '0.00' && payment != '0') {
			payment = this.removeCommas(payment);
			prevMonthPayment  = this.state.totalMonthlyPaymentOld;
			request  = {'prevMonthPayment': prevMonthPayment, 'currMonthPayment': payment, 'salesprice': this.state.sale_pr};
			//calling method to calculate the FHa MIP Finance for prepaid
			response   = monthlyPaymentChanged(request);
			salesprice    = parseFloat(response.new_salesprice).toFixed(2);
			this.onChangeRate(salesprice,"sale_pr")
		} else {
			console.log("do nothing!");
		}
	}
	
	//Function to calculate mon tax value in prepaid tab
	changeMonTaxPrice(){
		console.log("alert 12");
		//data = {'salePrice': this.state.sale_pr_calc,'monthlyTax': this.state.monTax,'months': this.state.monTaxVal, 'annualPropertyTax':this.state.annualPropertyTax,'stateId':this.state.state,'countyId':this.state.county,'AnnualPropertyCheck':this.state.isCheckForFlorida};

		data = {'salePrice': this.state.sale_pr_calc,'monthlyTax': this.state.monTax,'months': this.state.monTaxVal, 'annualPropertyTax':this.state.annualPropertyTax,'stateId':this.state.state,'countyId':this.state.county,'AnnualPropertyCheck':this.state.isCheckForFlorida,'summerPropertyTax': this.state.summerPropertyTax, 'winterPropertyTax': this.state.winterPropertyTax,'zip': this.state.postal_code};

	


		console.log("changeMonTaxPrice req " + JSON.stringify(data));
        //calling method to calculate the discount amount
		

		if (this.state.state == "3" || this.state.state == "32" || this.state.state == "44") {
			if (parseFloat(this.state.annualPropertyTax) > 0 && this.state.monTaxVal > 0) {
				//this.state.annualPropertyCheck = true;	
				resp = useAnnualTaxforPrepaid(data);
				//this.state.monTax = response.prepaidMonthRate;
				this.setState({
					isCheckForFlorida : true,
					monTax              : resp.prepaidMonthRate
				});

				console.log("montax 2 " + resp.prepaidMonthRate);

			} else {
				resp                 = getPreMonthTax(data);
			}
		} else {
			resp                 = getPreMonthTax(data);
		}

		console.log("resp changeMonTaxPrice buyer " + JSON.stringify(resp));

        //console.log(this.response.prepaidMonthTaxes);
		prepaidMonthTaxes = resp.prepaidMonthTaxes;

		req = {'months': this.state.monTaxVal, 'prepaidMonthTaxesRes': prepaidMonthTaxes};


		console.log("req changeMonTaxPrice buyer " + JSON.stringify(req));


		//calling method to calculate the discount amount
		responseRealEstate                   = getRealEstateTaxes(req);

		console.log("responseRealEstate changeMonTaxPrice buyer " + JSON.stringify(responseRealEstate));


		//console.log(this.response.prepaidMonthTaxes);
		realEstateTaxesRes        = responseRealEstate.realEstateTaxes;


		console.log("realEstateTaxesRes changeMonTaxPrice buyer " + JSON.stringify(realEstateTaxesRes));

			
		if(this.state.tab == 'CASH' || (this.state.tab == 'Owner_Carry' && this.state.isCheckForFirstLoan == true)) {
			this.setState({
				prepaidMonthTaxes: resp.prepaidMonthTaxes,
				realEstateTaxesRes:'0.00'
			},this.changeMonInsPrice);
		} else {
			this.setState({
				prepaidMonthTaxes: resp.prepaidMonthTaxes,
				realEstateTaxesRes:realEstateTaxesRes
			},this.changeMonInsPrice);
		}

		console.log("prepaidMonthTaxes 3 " + this.state.prepaidMonthTaxes);

	}


   /**=========== Start Function Added By Lovedeep For Annual Property Tax Check Box Case (Florida) =========**/

   changeMonTaxPriceCheckBox(){
	data = {'salePrice': this.state.sale_pr_calc,'monthlyTax': this.state.monTax,'months': this.state.monTaxVal, 'annualPropertyTax':this.state.annualPropertyTax,'stateId':this.state.state,'countyId':this.state.county,'AnnualPropertyCheck':this.state.isCheckForFlorida,'summerPropertyTax': this.state.summerPropertyTax, 'winterPropertyTax': this.state.winterPropertyTax,'zip': this.state.postal_code};


	console.log("request params " + JSON.stringify(data));

	if (this.state.isCheckForFlorida == true) {
		//calling method to calculate the discount amount
		resp = useAnnualTaxforPrepaid(data);
		console.log("response 1 " + JSON.stringify(response));

		this.setState({
			monTax : resp.prepaidMonthRate
		});

		console.log("montax 3 " + resp.prepaidMonthRate);

		//this.state.monTax = response.prepaidMonthRate;
	} else {
		resp = getPreMonthTax(data);
		console.log("resp 1 " + JSON.stringify(resp));

	}

	console.log("response " + JSON.stringify(response));
	console.log("resp " + JSON.stringify(resp));
	
	//calling method to calculate the discount amount
	//resp                 = getPreMonthTax(data);

	//console.log(this.response.prepaidMonthTaxes);
	prepaidMonthTaxes = resp.prepaidMonthTaxes;
	req = {'months': this.state.monTaxVal, 'prepaidMonthTaxesRes': prepaidMonthTaxes};

	//calling method to calculate the discount amount
	responseRealEstate                   = getRealEstateTaxes(req);
	//console.log(this.response.prepaidMonthTaxes);
	realEstateTaxesRes        = responseRealEstate.realEstateTaxes;
		
	if(this.state.tab == 'CASH' || (this.state.tab == 'Owner_Carry' && this.state.isCheckForFirstLoan == true)) {
		this.setState({
			prepaidMonthTaxes: resp.prepaidMonthTaxes,
			realEstateTaxesRes:'0.00'
		},this.changeMonInsPrice);
	} else {
		this.setState({
			prepaidMonthTaxes: resp.prepaidMonthTaxes,
			realEstateTaxesRes:realEstateTaxesRes
		},this.changeMonInsPrice);
	}


	console.log("prepaidMonthTaxes 1 " + this.state.prepaidMonthTaxes);

}



	/**============= End Function Added By Lovedeep For Annual Property Tax Check Box Case (Florida) =========**/
	
	//Function to calculate mon Ins value in prepaid tab
	changeMonInsPrice(){

		console.log("alert 13");
		console.log("prepaidMonthTaxes 8 " + this.state.prepaidMonthTaxes);

		data         = {'salePrice': this.state.sale_pr_calc,'insuranceRate': this.state.monIns,'months': this.state.numberOfMonthsInsurancePrepaid,'loanType': this.state.tab};

        //calling method to calculate the discount amount
        resp              = getMonthlyInsurance(data);
        //console.log(this.response.prepaidMonthTaxes);
		monthInsurance = parseFloat(resp.monthInsurance).toFixed(2);
		requestHomeOwnerInsData       = {'monthInsuranceRes': monthInsurance,'months': this.state.numberOfMonthsInsurancePrepaid};

		responseHomeOwnerIns = getHomeOwnerInsurance(requestHomeOwnerInsData);
		homeOwnerInsuranceRes        = responseHomeOwnerIns.homeOwnerInsuranceRes;
		
		this.setState({
			monthInsuranceRes: parseFloat(resp.monthInsurance).toFixed(2),
			homeOwnerInsuranceRes: homeOwnerInsuranceRes,
		},this.changeDayInterestPrice);
	}
	
	//Function to calculate day interest value in prepaid tab
	changeDayInterestPrice(){

		console.log("alert 14");
		console.log("prepaidMonthTaxes 7 " + this.state.prepaidMonthTaxes);

		if((this.state.tab == 'CONV') && this.state.loan_amt != ""){
			amt = this.state.loan_amt;
		}else if(this.state.tab == 'CASH' || (this.state.tab=="Owner_Carry" && this.state.isCheckForFirstLoan == true)){
			amt = '0.00';
		}else{
			amt = this.state.adjusted_loan_amt;
		}
		data         = {'adjusted': amt,'interestRate': this.state.todaysInterestRate,'days': this.state.numberOfDaysPerMonth};
		resp                = getDailyInterest(data);
		daysInterest = parseFloat(resp.daysInterest).toFixed(2);

		if((this.state.tab == 'CONV') && this.state.loan_amt2 != "" && this.state.loan_amt2 != '0.00'){
			amt2 = this.state.loan_amt2;
			data2         = {'adjusted': amt2,'interestRate': this.state.todaysInterestRate1,'days': this.state.numberOfDaysPerMonth};
			resp2                = getDailyInterest(data2);
			//Alert.alert("ff",JSON.stringify(daysInterest));
			daysInterest = (parseFloat(daysInterest) + parseFloat(resp2.daysInterest)).toFixed(2);
		} 
	
	//	Alert.alert('Alert!', JSON.stringify(daysInterest))
        //console.log(this.request);
        //calling method to calculate the discount amount
	   
		console.log("daysInterest 1 " + daysInterest);
		
		this.setState({
				daysInterest: daysInterest,
		},this.calOriginatinFee);
	}
	
	callBuyerSettingApi()
	{

		console.log("call buyer setting ");


		/**========= start code added by lovedep for State COLORADO on 05-18-2018 ============*/
	
		if(this.state.state_code == "CO") {
			this.setState({
				reissueYearDropdownShow : true,
				reissueYearDropdownVal : 6

			});
		} else {
			this.setState({
				reissueYearDropdownShow : false,
				reissueYearDropdownVal : 0
			});
		}
		
		/**========= end code added by lovedep for State COLORADO on 05-18-2018 ========*/


		/*========= Start Special Case for ILLINOIS added by lovedeep on 04-06-2018 ====================**/
	
		if(this.state.state_code == "IL") {
			if(this.state.sale_pr > 0) {
				this.setState({
					CityTransferTaxBuyerForILStatus : true,
				});
			} else {
				this.setState({
					CityTransferTaxBuyerForILStatus : false,
				});
			}
			this.setState({
				prorationPercentShowStatus : true
			});
		} else {
			this.setState({
				CityTransferTaxBuyerForILStatus : false,
				prorationPercentShowStatus : false
			});
		}

		/*========= End Special Case for ILLINOIS added by lovedeep on 04-06-2018 ====================**/
	
		/*========= Start Special Case for Minnesota added by lovedeep on 04-06-2018 ====================**/
		
		if(this.state.state_code == 'MN') {
			this.setState({
				escrowOnlyBuyerType : true,
			});
		}

		console.log("escrowOnlyBuyerType "  + this.state.escrowOnlyBuyerType);

		/*========= End Special Case for Minnesota added by lovedeep on 04-06-2018 ====================**/
	

		callPostApi(GLOBAL.BASE_URL + GLOBAL.Buyer_Cost_Setting, {
		user_id: this.state.user_id,company_id: this.state.company_id, zip: this.state.postal_code
		}, this.state.access_token)
		.then((response) => {

			console.log("buyer cost setting " + JSON.stringify(result));


			request = {'salePrice': result.data.userSetting.todaysInterestRate,'LTV': '90', 'LTV2': ''};
			conv_amt = getAmountConventional(request);
			
			var j=1;
			for (resObjMonthExp of result.data.userSettingMonthExp) {
				
					const updateMonthExp = {};
					updateMonthExp['monthlyExpensesOther' + j] = resObjMonthExp.label;
					if('paymentAmount' + j + "Fixed" == true){
						paymentAmt = this.state['paymentAmount' + j];
					}else{
						paymentAmt = resObjMonthExp.fee;
					}
					
					updateMonthExp['paymentAmount' + j] = paymentAmt;
					updateMonthExp['typeMonthExp' + j] = resObjMonthExp.key;
					this.setState(updateMonthExp);
					if(j == 3){
						if(this.state.costOtherFixed == true){
							paymentAmt = this.state['costOtherFixed'];
						}else{
							paymentAmt = resObjMonthExp.fee;
						}
						this.setState({twoMonthsPmi1: resObjMonthExp.label,costOther: resObjMonthExp.fee});
					}
				j++; 
			}
			
			var i=1;
			resultCount = _.size(result.data.userSettingCost);
			
			console.log("resultCount " + resultCount);			
			
			const costRequest = {};
			
			// For setting last fields of closing costs page
			if((this.state.tab == 'CONV' || this.state.tab == 'Owner_Carry') && this.state.loan_amt != ""){
				amt = this.state.loan_amt;
			}else if(this.state.tab == 'CASH'){
				amt = '0.00';
			}else{
				amt = this.state.adjusted_loan_amt;
			}
			//Alert.alert("df",JSON.stringify(result.data.userSettingCost));
			for (let resObj of result.data.userSettingCost) {
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
			}
			if(i == resultCount + 1){
				let costResponse    = getTotalCostRate(costRequest);
				totalCost      = costResponse.totalCostRate;
				if(this.state.monTaxFixed){
					monTax = this.state.monTax;
				}else{
					monTax = result.data.userSetting.taxRatePerYearPerOfSalePrice;
				}

				console.log("montax 5 " + monTax);

				if(this.state.monInsFixed){
					monIns = this.state.monIns;
				}else{
					monIns = result.data.userSetting.homeownerInsuranceRateYearOfSalePrice;
				}
				if(this.state.numberOfDaysPerMonthFixed){
					numberOfDaysPerMonth = this.state.numberOfDaysPerMonth;
				}else{
					numberOfDaysPerMonth = result.data.userSetting.numberOfDaysPerMonth;
				}
				if(this.state.creditReportFixed){
					creditReport = this.state.creditReport;
				}else{
					creditReport = result.data.userSetting.creditReport;
				}
				this.setState({
					todaysInterestRate: result.data.userSetting.todaysInterestRate,
					termsOfLoansinYears: result.data.userSetting.termsOfLoansinYears,
					numberOfDaysPerMonth: numberOfDaysPerMonth,
					numberOfMonthsInsurancePrepaid: result.data.userSetting.numberOfMonthsInsurancePrepaid,
					monTax: monTax,
					monIns: monIns,
					creditReport: creditReport,
					totalCost: totalCost,
					down_payment: conv_amt.downPayment,
					loan_amt: conv_amt.amount,
				},this.callBuyerConvSettingApi);

				console.log("down payment 6 " + conv_amt.downPayment);


			}	
			//Alert.alert('Alert!', JSON.stringify(result.data.totalCost))
			
		});
	}
	
	// Function for fetching and setting value of price based on month on prepaid page
	callGlobalSettingApi()
	{
		callPostApi(GLOBAL.BASE_URL + GLOBAL.state_buyer_proration_global_setting, {
		"state_id": this.state.state

		},this.state.access_token)
		.then((response) => {
			if(result.status == 'success'){
				this.setState({
					monTaxVal: result.data[this.state.monName],
					monTaxValReal: result.data[this.state.monName]
				});
			}
		});
	}
	
	// Function for fetching and setting value of price based on month on prepaid page
	callGlobalSettingApiOnDateChange()
	{
		callPostApi(GLOBAL.BASE_URL + GLOBAL.state_buyer_proration_global_setting, {
		"state_id": this.state.state

		},this.state.access_token)
		.then((response) => {
			if(result.status == 'success'){
				this.setState({
					monTaxVal: result.data[this.state.monName],
					monTaxValReal: result.data[this.state.monName]
				},this.changeMonTaxPrice);
			}else{
				this.changeMonTaxPrice;
			}
		});
	}
	
	callbuyerEscrowXmlData()
	{
		callPostApi(GLOBAL.BASE_URL + GLOBAL.conventional_setting, {
			user_id: this.state.user_id,company_id: this.state.company_id, zip: this.state.postal_code
		}, this.state.access_token)
		.then((response) => {
			if(result.status == 'success'){

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
					originationFactorType: result.data.originationFactorType,
				},this.callBuyerSettingApi);
			}else{
				this.callBuyerSettingApi();
			}
			
		});
	}
	
	callBuyerConvSettingApi()
	{


		console.log("callBuyerConvSettingApi");

		var secondLoanStatus;
		if(this.state.ltv2 != "" && this.state.ltv2 != "0.00") {
			secondLoanStatus = 1;
		} else {
			secondLoanStatus = 0;
		}

		date = this.state.date;
		var split = date.split('-');
		date = Number(split[0])+'/'+Number(split[1])+'/'+Number(split[2]);
		//Alert.alert("df", JSON.stringify(this.state.city + "user_county.." + this.state.user_county + 'sale_pr..' + this.state.sale_pr + "loan_amt.." + this.state.adjusted_loan_amt + "state.." + this.state.state + ".." + this.state.county + ".." + this.state.postal_code));
		

		/*escrow_request = {
			"city": this.state.city,"county_name": this.state.user_county,"salePrice": this.state.sale_pr,"adjusted": this.state.adjusted_loan_amt,"state": this.state.state,"county": this.state.county, "loanType": this.state.tab, zip: this.state.postal_code, "estStlmtDate": date, "userId":this.state.user_id,"device": this.state.deviceName, "2ndloan" : secondLoanStatus, "reissueyr" : this.state.reissueYearDropdownVal 
		};*/

		//console.log("escrow request " + JSON.stringify(escrow_request));

		if(this.state.sale_pr > 0){
	
			callPostApi(GLOBAL.BASE_URL + GLOBAL.buyer_escrow_xml_data, {
			"city": this.state.city,"county_name": this.state.user_county,"salePrice": this.state.sale_pr,"adjusted": this.state.adjusted_loan_amt,"state": this.state.state,"county": this.state.county, "loanType": this.state.tab, zip: this.state.postal_code, "estStlmtDate": date, "userId":this.state.user_id,"device": this.state.deviceName, "2ndloan" : secondLoanStatus, "reissueyr" : this.state.reissueYearDropdownVal 
			}, this.state.access_token)
			.then((response) => {
				
				console.log("escrow_xml callBuyerConvSettingApi " + JSON.stringify(result));

				/**==== Start Special Case for ILLINOIS State Added by lovedeep ====**/

				if(this.state.state_code == 'IL') {
					this.state.CityTransferTaxBuyerForIL = result.data.CityTransferTaxBuyer;
				}

				/**==== End Special Case for ILLINOIS State Added by lovedeep ====**/

				/* if(result.data.escrowFee == null){
					escrowFee = '0.00';
				}else{
					escrowFee = result.data.escrowFee;
				} */
				//Alert.alert("ss",JSON.stringify(escrowFee));

				console.log("escrow fee 4 " + result.data.escrowFee);

				console.log("owner fee 4 " + result.data.ownerFee);

				console.log("ownerFeeOrg 3 " + result.data.ownerFee);

				if(result.status == 'success'){
					this.setState({
						ownerFee: result.data.ownerFee,
						escrowQuote : result.data.Quote,
						escrowFee: result.data.escrowFee,
						lenderFee: result.data.lenderFee,
						ownerFeeOrg: result.data.ownerFee,
						escrowFeeOrg: result.data.escrowFee,
						lenderFeeOrg: result.data.lenderFee,
						cityEscrow: result.data.city,

					},this.calEscrowTypes);
				}else{
					this.calEscrowTypes();
				}
				
			});
		}else{
			this.calEscrowTypes();
		}	
	}
	
	calEscrowTypes()
	{
		console.log("comp id " + this.state.company_id);
		callPostApi(GLOBAL.BASE_URL + GLOBAL.title_escrow_type, {
		"companyId": this.state.company_id
		}, this.state.access_token)
		.then((response) => {

			console.log("resp " + JSON.stringify(result));

		//	alert(JSON.stringify(result));

			console.log("result.data.escrowType " + result.data.escrowType);

			if(result.status == 'success'){
				this.setState({
					ownerPolicyType: result.data.ownerType,
					escrowPolicyType: result.data.escrowType,
					lenderPolicyType: result.data.lenderType,
				},this.calEscrowData);

				console.log("escrowPolicyType 3 " + this.state.escrowPolicyType);

			}else{
				this.calEscrowData();
			}
			//Alert.alert('Alert!', JSON.stringify(result))
		});
	}

	callSettingApiForTabs() {
		if((this.state.tab == 'CONV' || (this.state.tab == 'Owner_Carry' && this.state.isCheckForFirstLoan == false)) && this.state.loan_amt != "") {
			amt = this.state.loan_amt;
		} else if(this.state.tab == 'CASH' || (this.state.tab == 'Owner_Carry' && this.state.isCheckForFirstLoan == true)) {
			amt = '0.00';
		} else {
			amt = this.state.adjusted_loan_amt;
		}
		for (var i = 1; i < 11; i++) {
			const update = {};
			req  = {'amount': amt,'salePrice': this.state.sale_pr_calc,'type': this.state['type' + i],'rate':this.state['totalfee' + i]};
			
			var data = getCostTypeTotal(req);
			feeval = data.totalCostRate;
			update['fee' + i] = feeval;
			this.setState(update);
		}
		
		//if(this.state.sale_pr != '0.00'){
			if(this.state.disc != '' && this.state.disc != 0){
				this.onChangeDisc(this.state.disc);
			}
			if(this.state.tab=="CONV" || (this.state.tab=="Owner_Carry" && this.state.isCheckForFirstLoan == false)){
				callPostApi(GLOBAL.BASE_URL + GLOBAL.conventional_setting, {
					user_id: this.state.user_id,company_id: this.state.company_id, zip: this.state.postal_code
				}, this.state.access_token)
				.then((response) => {
					//Alert.alert("sdf",JSON.stringify(result));
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
						originationFactorType: result.data.originationFactorType,
			
					},this.callOwnerEscrowLenderSettingApi);
					
				});
			}else{
				callPostApi(GLOBAL.BASE_URL + GLOBAL.fha_va_usda_setting_api, {
					user_id: this.state.user_id,company_id: this.state.company_id,loan_type: this.state.tab,calc_type: "Buyer", zip: this.state.postal_code
				}, this.state.access_token)
				.then((response) => {
					if(this.state.tab == 'FHA') {
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
							originationFactorType : result.data.FHA_OriginationFactorType,
						},this.callOwnerEscrowLenderSettingApi);		
					} else if(this.state.tab == 'VA') {
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
							originationFactorType : result.data.VA_OriginationFactorType,
						},this.callOwnerEscrowLenderSettingApi);		
					} else if(this.state.tab == 'USDA') {
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
							originationFactorType: result.data.USDA_OriginationFactorType,
							
						},this.callOwnerEscrowLenderSettingApi);		
					} else if(this.state.tab == 'CASH' || this.state.tab=="Owner_Carry") {

						this.setState({
							taxservicecontract: '0.00',
							underwriting: '0.00',
							processingfee: '0.00',
							appraisalfee: '0.00',
							documentprep: '0.00',
							originationfactor: '0.00',
						},this.callOwnerEscrowLenderSettingApi);		
					} else {

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
							originationFactorType : result.data.FHA_OriginationFactorType,
						},this.callOwnerEscrowLenderSettingApi);	
					}
				});
			}
		/* }else{
			this.callOwnerEscrowLenderSettingApi();
		} */	
	}
	
	callOwnerEscrowLenderSettingApi()
	{
		console.log("alert 8");
		var secondLoanStatus;
		if(this.state.ltv2 != "" && this.state.ltv2 != "0.00") {
			secondLoanStatus = 1;
		} else {
			secondLoanStatus = 0;
		}

		console.log("secondLoanStatus " + secondLoanStatus);


		if(this.state.tab == 'CONV' && this.state.loan_amt2 != "" && this.state.loan_amt2 != '0.00'){
			loan_amt = (parseFloat(this.state.loan_amt) + parseFloat(this.state.loan_amt2)).toFixed(2);
		}else if (this.state.tab == 'Owner_Carry' && this.state.isCheckForFirstLoan == true){
			loan_amt = (parseFloat(this.state.loan_amt)).toFixed(2);
		}else if (this.state.tab == 'Owner_Carry' && this.state.isCheckForSecondLoan == true){
			loan_amt = (parseFloat(this.state.loan_amt2)).toFixed(2);
		}else if (this.state.tab == 'Owner_Carry'){
			loan_amt = (parseFloat(this.state.loan_amt) + parseFloat(this.state.loan_amt2)).toFixed(2);
		}else if(this.state.tab == 'CASH' || (this.state.tab == 'Owner_Carry' && this.state.isCheckForFirstLoan == true)){
			loan_amt = this.state.sale_pr;
		}else{
			loan_amt = this.state.adjusted_loan_amt;
		}
		date = this.state.date;
		var split = date.split('-');
		date = Number(split[0])+'/'+Number(split[1])+'/'+Number(split[2]);


		if(this.state.isCheckForNewJersey == true) {
			this.state.reissueYearDropdownVal = 1;
		} else {
			this.state.reissueYearDropdownVal = 0;			
		}

		//Alert.alert("df", JSON.stringify(this.state.city + "user_county.." + this.state.user_county + 'sale_pr..' + this.state.sale_pr + "loan_amt.." + loan_amt + "state.." + this.state.state + ".." + this.state.county));
		//Alert.alert('Alert!', JSON.stringify(this.state.county))
		if(this.state.sale_pr > 0){
			UserSettingResp = {};
			callPostApi(GLOBAL.BASE_URL + GLOBAL.Buyer_Cost_Setting, {
				user_id: this.state.user_id,company_id: this.state.company_id, zip: this.state.postal_code
				}, this.state.access_token)
				.then((response) => {
					UserSettingResp = result.data.userSettingCost;
				});

				escrowRequest = {
					"city": this.state.city,"county_name": this.state.user_county,"salePrice": this.state.sale_pr,"adjusted": loan_amt,"state": this.state.state,"county": this.state.county, "loanType": this.state.tab,zip: this.state.postal_code,  "estStlmtDate": date, 'userId':this.state.user_id,'device':this.state.deviceName, "2ndloan" : secondLoanStatus, "reissueyr" : this.state.reissueYearDropdownVal
					};

				console.log("escrow_request " + JSON.stringify(escrowRequest));


			callPostApi(GLOBAL.BASE_URL + GLOBAL.buyer_escrow_xml_data, {
			"city": this.state.city,"county_name": this.state.user_county,"salePrice": this.state.sale_pr,"adjusted": loan_amt,"state": this.state.state,"county": this.state.county, "loanType": this.state.tab,zip: this.state.postal_code,  "estStlmtDate": date, 'userId':this.state.user_id,'device':this.state.deviceName, "2ndloan" : secondLoanStatus, "reissueyr" : this.state.reissueYearDropdownVal
			}, this.state.access_token)
			.then((response) => {

				console.log("escrow_xml callOwnerEscrowLenderSettingApi " + JSON.stringify(result));


				/**==== Start Special Case for ILLINOIS State Added by lovedeep ====**/

					if(this.state.state_code == 'IL') {
						this.state.CityTransferTaxBuyerForIL = result.data.CityTransferTaxBuyer;
					}

				/**==== End Special Case for ILLINOIS State Added by lovedeep ====**/

				//console.log("usersetting 8 " + JSON.stringify(UserSettingResp[8]));
				//console.log("usersetting 9 " + JSON.stringify(UserSettingResp[9]));
				console.log("escrow change record " + JSON.stringify(result));

				if(result.status == 'success') {

					/**==== Start Case for some zip code, show loan fee field only when condition satisfy ==**/

					if(this.state.state_code == 'CA') {

						var countyCheck = california_counties_Arr.indexOf(this.state.postal_code);

						if(countyCheck != -1) {
							if(typeof result.data.newLoanFee != "undefined") {
								this.setState({newLoanServiceFee: result.data.newLoanFee,showLoanServiceFee: true});
							}else {
								this.setState({newLoanServiceFee: '0.00'});
							}
						} else {
							//console.log("in else");
							
							// commented for some time as per discussion with vinod sir

							//this.setState({newLoanServiceFee: '0.00',showLoanServiceFee: false, fee5 : result.data.newLoanFee});	
							if(this.state.tab=='Owner_Carry' && this.state.isCheckForSecondLoan == true){
								this.setState({fee5: result.data.newLoanFee, newLoanServiceFee: '0.00',showLoanServiceFee: false});
							}else if(this.state.tab=='Owner_Carry'){
								this.setState({fee5: '0.00', newLoanServiceFee: '0.00',showLoanServiceFee: false});	
							}else{
								this.setState({fee5: result.data.newLoanFee, newLoanServiceFee: '0.00',showLoanServiceFee: false});	
							}
							
							//this.UserSetting_f5 = this.BuyerEscrowData.data.newLoanFee;
						}

						/*if(typeof result.data.newLoanFee != "undefined"){
							this.setState({newLoanServiceFee: result.data.newLoanFee,showLoanServiceFee: true});
						}else{
							this.setState({newLoanServiceFee: '0.00',showLoanServiceFee: false});
						}*/
					} 

					/**==== Start Case for some zip code, show loan fee field only when condition satisfy ==**/

					/* if(result.data.escrowFeeBuyer == null){
						result.data.escrowFeeBuyer = '0.00';
					} */

					//Start Special Case added by lovedeep for Florida

					if(this.state.state == '10' && this.state.user_county != "BROWARD") {
						if(this.state.tab == 'CASH') {
							if(UserSettingResp[8]['applyCash'] == 'Y') {
								this.state.label9			= result.data.MtgDocStampsLabel;
								this.state.fee9			    = result.data.MtgDocStampsAmount;
							} else {
								this.state.label9			= 'None';
								this.state.fee9			    = '0.00';
							}

							if(UserSettingResp[9]['applyCash'] == 'Y') {
								this.state.label10			= result.data.IntangibleTaxLabel;
								this.state.fee10			    = result.data.IntangibleTaxAmount;
							} else {
								this.state.label10			= 'None';
								this.state.fee10			= '0.00';
							}

						} else {
							this.state.label9			= result.data.MtgDocStampsLabel;
							this.state.fee9			    = result.data.MtgDocStampsAmount;
						
							this.state.label10			= result.data.IntangibleTaxLabel;
							this.state.fee10			    = result.data.IntangibleTaxAmount;
						}
					}

					//end Special Case added by lovedeep for Florida

					/**==== Start Special Case for KANSAS added by lovedeep ====== **/

					if (this.state.state_code == 'KS') {
						this.state.fee10 = result.data.cityTax;
					}

					/**======== End Special Case for KANSAS added by lovedeep ======= **/
					
					/**==== Start Special Case for Minnesota added by lovedeep ====== **/

					if (this.state.state_code == 'MN') {
						this.state.fee4			    = result.data.Mortgage_Registration_Tax;
						this.state.fee9			    = result.data.Underwriting;
						//this.UserSetting_f4 = this.BuyerEscrowData.data.Mortgage_Registration_Tax;
						//this.UserSetting_final4 = this.UserSetting_f4;
						//this.UserSetting_f9 = this.BuyerEscrowData.data.Underwriting;
						//this.UserSetting_final9 = this.UserSetting_f9;
					}

					/**==== End Special Case for Minnesota added by lovedeep ====== **/


					/**==== Start Special Case for Missouri added by lovedeep ====== **/

					if (this.state.state_code == 'MO') {
						this.state.fee1			    = result.data.loanServiceFeeBuyer;
						this.state.fee2			    = result.data.ownerServiceFeeBuyer;
						//this.UserSetting_f1 = this.BuyerEscrowData.data.ownerServiceFeeBuyer;
						//this.UserSetting_final1 = this.UserSetting_f1;
						//this.UserSetting_f2 = this.BuyerEscrowData.data.loanServiceFeeBuyer;
						//this.UserSetting_final2 = this.UserSetting_f2;
					}

					/**==== End Special Case for Missouri added by lovedeep ====== **/

					/**==== Start Special Case for New Jersey added by lovedeep ====== **/

					if(this.state == 'NJ'){
						this.state.fee10 = result.data.mansionTax;
						this.state.fee8 = result.data.simultaneousFee;
						
						//this.UserSetting_f10 = this.datareturn.data.mansionTax;
						//this.UserSetting_final10 = this.UserSetting_f10;
					}

					/**==== End Special Case for New Jersey added by lovedeep ====== **/
					
					if(this.state.sale_pr == "" || this.state.sale_pr == '0.00'){
						if(this.state.tab == 'CASH' || (this.state.tab=="Owner_Carry" && this.state.isCheckForFirstLoan == true)){

							// Below code commented by lovedeep as per discussion with vinod sir on 22-06-2018
							/**
								this.setState({
								ownerFeeOrg: '0.00',
								escrowQuote : result.data.Quote,
								escrowFeeOrg: result.data.escrowFee,
								lenderFeeOrg: '0.00',
								escrowFeeBuyerOrg: result.data.escrowFeeBuyer,
								escrowFeeSellerOrg: result.data.escrowFeeSeller,
							},this.createOwnerLenderEscrowPicker);
						    **/
							
							// Below code added by lovedeep as ownerfeeorg need not required default 0.00 value
							this.setState({
								ownerFeeOrg: result.data.ownerFee,
								escrowQuote : result.data.Quote,
								escrowFeeOrg: result.data.escrowFee,
								lenderFeeOrg: '0.00',
								escrowFeeBuyerOrg: result.data.escrowFeeBuyer,
								escrowFeeSellerOrg: result.data.escrowFeeSeller,
							},this.createOwnerLenderEscrowPicker);


							
						} else {
							this.setState({
								ownerFeeOrg: result.data.ownerFee,
								escrowQuote : result.data.Quote,
								escrowFeeOrg: result.data.escrowFee,
								lenderFeeOrg: result.data.lenderFee,
								escrowFeeBuyerOrg: result.data.escrowFeeBuyer,
								escrowFeeSellerOrg: result.data.escrowFeeSeller,
							},this.createOwnerLenderEscrowPicker);	
						}
					} else {
						if(this.state.tab == 'CASH' || (this.state.tab=="Owner_Carry" && this.state.isCheckForFirstLoan == true)) {
							// Below code commented by lovedeep as per discussion with vinod sir on 22-06-2018
							/** 
							this.setState({
								ownerFeeOrg: '0.00',
								escrowFeeOrg: result.data.escrowFee,
								escrowQuote : result.data.Quote,
								lenderFeeOrg: '0.00',
								escrowFeeBuyerOrg: result.data.escrowFeeBuyer,
								escrowFeeSellerOrg: result.data.escrowFeeSeller,
								countyTax: result.data.countyTax,
								cityTax: result.data.cityTax,
								cityEscrow: result.data.city,
							},this.getTransferTax);	
							**/

							// Below code added by lovedeep as ownerfeeorg need not required default 0.00 value		
							
							this.setState({
								ownerFeeOrg: result.data.ownerFee,
								escrowFeeOrg: result.data.escrowFee,
								escrowQuote : result.data.Quote,
								lenderFeeOrg: '0.00',
								escrowFeeBuyerOrg: result.data.escrowFeeBuyer,
								escrowFeeSellerOrg: result.data.escrowFeeSeller,
								countyTax: result.data.countyTax,
								cityTax: result.data.cityTax,
								cityEscrow: result.data.city,
							},this.getTransferTax);	

						} else {
							this.setState({
								ownerFeeOrg: result.data.ownerFee,
								escrowQuote : result.data.Quote,
								escrowFeeOrg: result.data.escrowFee,
								lenderFeeOrg: result.data.lenderFee,
								escrowFeeBuyerOrg: result.data.escrowFeeBuyer,
								escrowFeeSellerOrg: result.data.escrowFeeSeller,
								countyTax: result.data.countyTax,
								cityTax: result.data.cityTax,
								cityEscrow: result.data.city,
							},this.getTransferTax);	
						}
					}

					console.log("escrow fee 5 " + this.state.escrowFeeOrg);

				} else {
					this.createOwnerLenderEscrowPicker();
				}	
				
			});
		} else {
			this.createOwnerLenderEscrowPicker();
		}
	}
	
	getTransferTax(){

		if(this.state.state_code == 'CA') {

		/**============Start Check added by lovedeep on 11-20-2108 as per discussion with vinod sir ============**/
			
			if (this.state.cityTax > 0) {
				costOther = this.state.cityTax;
				if (costOther > 0) {
					twoMonthsPmi1 = 'City Transfer Tax';
				}
				this.setState({costOther: parseFloat(costOther).toFixed(2),twoMonthsPmi1: twoMonthsPmi1},this.createOwnerLenderEscrowPicker);	
			}

		/**============End Check added by lovedeep on 11-20-2108 as per discussion with vinod sir ============**/
			

		/**============Start Check commented by lovedeep on 11-20-2108 as per discussion with vinod sir ============**/

			/*if(this.state.cityTax > 0 || this.state.countyTax > 0){
				
				
				callPostApi(GLOBAL.BASE_URL + GLOBAL.get_transfer_tax, {
				"countyTax": this.state.countyTax,"cityTax": this.state.cityTax,"city": this.state.cityEscrow, "type": "buyer"
				}, this.state.access_token)
				.then((response) => {
					if(result.status == 'success') {
						// commented by lovedeep as per discussion with vinod sir
						//twoMonthsPmi1 = this.state.cityEscrow + " transfer tax";				
						if(this.state.costOtherFixed){
							costOther = this.state.costOther;
						} else {
							costOther = result.data.CityTransferTaxBuyer;
						}

						// check added by lovedeep as per discussion with atul sir
						if(result.data.CityTransferTaxBuyer > 0) {
							twoMonthsPmi1 = 'City Transfer Tax';
						} else {
							twoMonthsPmi1 = this.state.twoMonthsPmi1;
						}
						this.setState({costOther: parseFloat(costOther).toFixed(2),twoMonthsPmi1: twoMonthsPmi1},this.createOwnerLenderEscrowPicker);	

						// commented by lovedeep as per discussion with vinod sir
						//this.setState({costOther: parseFloat(costOther).toFixed(2),twoMonthsPmi1: twoMonthsPmi1},this.createOwnerLenderEscrowPicker);

					} else {
						this.createOwnerLenderEscrowPicker();
					}
				});
			}*/

		/**============End Check commented by lovedeep on 11-20-2108 as per discussion with vinod sir ============**/
						
			else{
				this.createOwnerLenderEscrowPicker();
			}
		} else {
			this.createOwnerLenderEscrowPicker();			
		}	
	}

	calEscrowData(){
		console.log("owner fee 5 " + this.state.ownerFee);
		escrowTotal = (parseFloat(this.state.lenderFee) + parseFloat(this.state.ownerFee) + parseFloat(this.state.escrowFee)).toFixed(2);
		

		console.log("escrowFee 6 " + JSON.stringify(this.state.escrowFee));

		this.setState({escrowTotal: escrowTotal},this.calTotalClosingCostOnload);
	}
	
	updatePhoneNumberFormat(phone_number){
		phone_number = phone_number.replace(/[^\d.]/g,'').replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
	   this.setState({contact_number : phone_number});
   	}
	
	calEscrowDataOnChange(){
        escrowTotal = (parseFloat(this.state.lenderFee) + parseFloat(this.state.ownerFee) + parseFloat(this.state.escrowFee)).toFixed(2);
		this.setState({escrowTotal: escrowTotal},this.calTotalClosingCost);
    }
	
	calTotalClosingCostOnload(){
		if(this.state.originationFee == ''){
			originationFee = '0.00';
		} else {
			originationFee = this.state.originationFee;
		}

		console.log("originationFee 4 " + response.originationFee);
		
	//	Alert.alert('Alert!', JSON.stringify(originationFee + "..originationFee" + this.state.processingfee + "..processingfee" + this.state.taxservicecontract + "..taxservicecontract" + this.state.documentprep + "..documentprep" + this.state.underwriting + "..underwriting" + this.state.appraisalfee + "..appraisalfee" + this.state.creditReport + "..creditReport")
		
		/**============== Start Special Case For ILLINOIS added by lovedeep ========**/

		if(this.state.state_code == "IL") {
			totalCostData = (parseFloat(originationFee) + parseFloat(this.state.processingfee) + parseFloat(this.state.taxservicecontract) + parseFloat(this.state.documentprep) + parseFloat(this.state.underwriting) + parseFloat(this.state.appraisalfee) + parseFloat(this.state.creditReport) + parseFloat(this.state.CityTransferTaxBuyerForIL)).toFixed(2);
		} else {
			totalCostData = (parseFloat(originationFee) + parseFloat(this.state.processingfee) + parseFloat(this.state.taxservicecontract) + parseFloat(this.state.documentprep) + parseFloat(this.state.underwriting) + parseFloat(this.state.appraisalfee) + parseFloat(this.state.creditReport)).toFixed(2);
		}

		/**============== End Special Case For ILLINOIS added by lovedeep ========**/
		
			this.setState({totalCostData: totalCostData});
			if(this.state.discAmt != ''){
				totalClosingCost    = (parseFloat(this.state.totalCost) + parseFloat(totalCostData) + parseFloat(this.state.discAmt)).toFixed(2);
			} else {
				totalClosingCost    = (parseFloat(this.state.totalCost) + parseFloat(totalCostData)).toFixed(2);
			}
			if(this.state.escrowTotal != ''){
				totalClosingCost    = (parseFloat(totalClosingCost) + parseFloat(this.state.escrowTotal)).toFixed(2);
			}


			console.log("totalClosingCost 1 " + totalClosingCost);

			this.setState({totalClosingCost: totalClosingCost},this.callSalesPr);
	}

	calTotalClosingCost(){
		console.log("alert 17");
		if(this.state.originationFee == ''){
			originationFee = '0.00';
		}else{
			originationFee = this.state.originationFee;
		}
		
		console.log("originationFee 5 " + response.originationFee);

		//Alert.alert('Alert!', JSON.stringify(originationFee + "..originationFee" + this.state.processingfee + "..processingfee" + this.state.taxservicecontract + "..taxservicecontract" + this.state.documentprep + "..documentprep" + this.state.underwriting + "..underwriting" + this.state.appraisalfee + "..appraisalfee" + this.state.creditReport + "..creditReport"))

		console.log("prepaidMonthTaxes 4 " + this.state.prepaidMonthTaxes);

		/**============== Start Special Case For ILLINOIS added by lovedeep ========**/

		if(this.state.state_code == "IL") {

			console.log("closing cost IL " + this.state.CityTransferTaxBuyerForIL);

			totalCostData = (parseFloat(originationFee) + parseFloat(this.state.processingfee) + parseFloat(this.state.taxservicecontract) + parseFloat(this.state.documentprep) + parseFloat(this.state.underwriting) + parseFloat(this.state.appraisalfee) + parseFloat(this.state.creditReport) + parseFloat(this.state.CityTransferTaxBuyerForIL)).toFixed(2);


			


		} else {
			totalCostData = (parseFloat(originationFee) + parseFloat(this.state.processingfee) + parseFloat(this.state.taxservicecontract) + parseFloat(this.state.documentprep) + parseFloat(this.state.underwriting) + parseFloat(this.state.appraisalfee) + parseFloat(this.state.creditReport)).toFixed(2);
		}

		costdt = {
		"originationFee"	: parseFloat(originationFee).toFixed(2),
		"processingFee"	    : parseFloat(this.state.processingfee).toFixed(2),
		"taxservicecontract": parseFloat(this.state.taxservicecontract).toFixed(2),
		"documentprep"	: parseFloat(this.state.documentprep).toFixed(2),
		"underwriting"	: parseFloat(this.state.underwriting).toFixed(2),
		"appraisalfee"	: parseFloat(this.state.appraisalfee).toFixed(2),
		"creditReport"	: parseFloat(this.state.creditReport).toFixed(2)
		}

		console.log("costdt reque " + JSON.stringify(costdt));

		/**============== End Special Case For ILLINOIS added by lovedeep ========**/




		costRequest = {};
		for (var i = 1; i < 11; i++) { 
			costRequest['cost' + i] = this.state['fee' + i];
			if(i==10){

				console.log("costRequest " + JSON.stringify(costRequest));

				costResponse    = getTotalCostRate(costRequest);

				console.log("costResponse " + JSON.stringify(costResponse));

				console.log("totalCostData " + JSON.stringify(totalCostData));
				
				totalCost      = costResponse.totalCostRate;
				//Alert.alert('Alert!', totalCostData + ".." + this.state.totalCost + ".." + this.state.escrowTotal)
					this.setState({totalCostData: totalCostData});
					if(this.state.discAmt != ''){
						totalClosingCost    = (parseFloat(totalCost) + parseFloat(totalCostData) + parseFloat(this.state.discAmt)).toFixed(2);
					} else {
						totalClosingCost    = (parseFloat(totalCost) + parseFloat(totalCostData)).toFixed(2);
					}
					if(this.state.escrowTotal != ''){
						totalClosingCost    = (parseFloat(totalClosingCost) + parseFloat(this.state.escrowTotal)).toFixed(2);
					}
					if(this.state.showLoanServiceFee){
						totalClosingCost    = (parseFloat(totalClosingCost) + parseFloat(this.state.newLoanServiceFee)).toFixed(2);
					}

					console.log("totalClosingCost 2 " + totalClosingCost);

					this.setState({totalClosingCost: totalClosingCost},this.calTotalPrepaidItems);
			}
		}	
	
	}	
	
	settingsApi(flag) {
		this.setState({animating:'true'});
		if(flag!="CASH"){
			monTaxVal = this.state.monTaxValReal;
		}else{monTaxVal = '0';}
		if(flag == 'CASH'){
			this.setState({
				loan_amt: '0.00',
				loan_amt2: '0.00',
			});	
		} 
		if(flag == 'FHA' || flag == 'VA' || flag == 'USDA') {
			this.setState({
				loan_amt2: '0.00',
			});	
		}
		if(flag != 'Owner_Carry'){
			var index = -1;
			var val22 = "Email Amortization Sch.";
			toolbarval = this.state.toolbarActions;
			var filteredObj = toolbarval.find(function(item, i){
			  if(item.value == val22){
				var index = i;
				return i;
			  }
			});
			toolbarval.splice(index, 1); 
			this.setState({toolbarActions: toolbarval});
		}else{
			this.state.toolbarActions.push({ value : "Email Amortization Sch." });
		}
		//console.log("flag value " + flag);

		this.setState({sale_pr_calc: this.state.sale_pr, tab: flag, downPaymentFixed: false, monTaxVal: monTaxVal},this.afterSetStateSettingApi);
	}
	
	//Call when state of tab is set
	afterSetStateSettingApi(){
		console.log("alert 1");
		this.setState({
			enterAddressBar : false
		});
		if(this.state.tab=="FHA"){
			this.callFHAsettinsapi();
		}else if(this.state.tab=="VA"){
			this.callVAsettinsapi();
		}else if(this.state.tab=="USDA"){
			this.callUSDAsettinsapi();
		}else if(this.state.tab=="CONV") {
			if(this.state.downPaymentHidden > 0){
				
				// commented by lovedeep
				/*amount = this.state.sale_pr_calc - this.state.downPaymentHidden;
				resaleConventionalLoanLTV    = (amount / this.state.sale_pr_calc *100).toFixed(2);
				this.setState({ltv: resaleConventionalLoanLTV,ltv2: '0.00',todaysInterestRate1: '0.00',termsOfLoansinYears2: '0.00'});*/
				
				console.log("this.state.ltv 4 " + this.state.ltv); 

				// added by lovedeep
				request = {'salePrice': this.state.sale_pr_calc,'LTV': this.state.ltv, 'LTV2': this.state.ltv2, 'dp_request': this.state.dp_request};
				conv_amt = getAmountConventional(request);
				resaleConventionalLoanLTV    = conv_amt.ltv1;
				this.setState({ltv: resaleConventionalLoanLTV,ltv2: '0.00',todaysInterestRate1: '0.00',termsOfLoansinYears2: '0.00'});

			}
			this.callbuyerEscrowXmlData();
		}else if(this.state.tab=="CASH"){
			this.callCASHsettinsapi();
		}else if(this.state.tab=="Owner_Carry"){
			this.setState({
						ltv: '0.00',
						ltv2: '0.00',
					},this.callsettingapi);
			//this.callOWNERCARRYsettinsapi();
			
		} 
		//Alert.alert('Alert!', JSON.stringify(this.state.tab))
		// For national global setting api to calculate down payment,loan amount and adjusted loan amount when tab changes
		/* if(this.state.sale_pr == ''){
			this.onChangeRate('0',"sale_pr");
		}else{
			this.onChangeRate(this.state.sale_pr,"sale_pr");
		} */
	}
	
	callOWNERCARRYsettinsapi(text, flag){
		request = {'salePrice': this.state.sale_pr_calc,'LTV': this.state.ltv, 'LTV2': this.state.ltv2, 'dp_request': this.state.dp_request};
		if(flag == 'loan_amt'){
		ltv = this.state.loan_amt * 100/request.salePrice;
		this.setState({ltv: parseFloat(ltv).toFixed(2)},this.callSalesPr);
		}else if(flag == 'loan_amt2'){
			ltv2 = this.state.loan_amt2 * 100/request.salePrice;
			this.setState({ltv2: parseFloat(ltv2).toFixed(2)},this.callSalesPr);
		}
	}
	
	// Function for fetching and setting values of closing cost tab under FHA page
	callFHAsettinsapi() {
		console.log("alert 2");
		callPostApi(GLOBAL.BASE_URL + GLOBAL.fha_va_usda_setting_api, {
			user_id: this.state.user_id,company_id: this.state.company_id,loan_type: "FHA",calc_type: "Buyer", zip: this.state.postal_code
		}, this.state.access_token)
		.then((response) => {
			//Alert.alert('Alert!', JSON.stringify(this.state.user_id + "this.state.user_id" + this.state.company_id + "this.state.company_id"))
			if(result.status == 'success'){

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

				console.log("processingfee FHA " + processingfee);


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
					originationFactorType : result.data.FHA_OriginationFactorType,
				},this.callClosingCostSettingApi);	
			}else{
				this.callClosingCostSettingApi();
			}
		});
	}
	
	// Function for fetching and setting values of closing cost tab under VA page
	callVAsettinsapi(){
		callPostApi(GLOBAL.BASE_URL + GLOBAL.fha_va_usda_setting_api, {
			user_id: this.state.user_id,company_id: this.state.company_id,loan_type: "VA",calc_type: "Buyer", zip: this.state.postal_code
		}, this.state.access_token)
		.then((response) => {
			if(result.status == 'success'){

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
					originationFactorType : result.data.VA_OriginationFactorType,
				},this.callClosingCostSettingApi);
			}else{
				this.callClosingCostSettingApi();
			}
		});
	}
	
	// Function for fetching and setting values of closing cost tab under USDA page
	callUSDAsettinsapi(){
		callPostApi(GLOBAL.BASE_URL + GLOBAL.fha_va_usda_setting_api, {
			user_id: this.state.user_id,company_id: this.state.company_id,loan_type: "USDA",calc_type: "Buyer", zip: this.state.postal_code
		}, this.state.access_token)
		.then((response) => {
			if(result.status == 'success'){

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

				if(this.state.processingfee == false) {
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
					originationFactorType : result.data.USDA_OriginationFactorType,
				},this.callClosingCostSettingApi);
			}else{
				this.callClosingCostSettingApi();
			}
		});
	}
	
	callClosingCostSettingApi(){
		console.log("alert 3");
		callPostApi(GLOBAL.BASE_URL + GLOBAL.Buyer_Cost_Setting, {
		user_id: this.state.user_id,company_id: this.state.company_id, zip: this.state.postal_code
		}, this.state.access_token)
		.then((response) => {
			

			console.log("result.data.userSettingCost " + JSON.stringify(result.data.userSettingCost));

			// For setting last fields of closing costs page
			resultCount = _.size(result.data.userSettingCost);
			costRequest = {};
			
				var j=1;
				for (resObjMonthExp of result.data.userSettingMonthExp) {
						const updateMonthExp = {};
						if('paymentAmount' + j + "Fixed" == true){
							paymentAmt = this.state['paymentAmount' + j];
						}else{
							paymentAmt = resObjMonthExp.fee;
						}

						updateMonthExp['monthlyExpensesOther' + j] = resObjMonthExp.label;
						updateMonthExp['paymentAmount' + j] = paymentAmt;
						updateMonthExp['typeMonthExp' + j] = resObjMonthExp.key;
						this.setState(updateMonthExp);
						if(j == 3){
							if(this.state.costOtherFixed == true){
								paymentAmt = this.state['costOtherFixed'];
							}else{
								paymentAmt = resObjMonthExp.fee;
							}
							this.setState({twoMonthsPmi1: resObjMonthExp.label,costOther: resObjMonthExp.fee});
						}
					j++;
				}
				if((this.state.tab == 'CONV' || this.state.tab == 'Owner_Carry') && this.state.loan_amt != ""){
					amt = this.state.loan_amt;
				}else if(this.state.tab == 'CASH'){
					amt = '0.00';
				}else{
					amt = this.state.adjusted_loan_amt;
				}
				var i=1;
				for (resObj of result.data.userSettingCost) {
						const update = {};
						req         = {'amount': amt,'salePrice': this.state.sale_pr_calc,'type': resObj.type,'rate':resObj.fee};
				
						var data = getCostTypeTotal(req);
						//Alert.alert("dsf",JSON.stringify(data));
						feeval = data.totalCostRate;
						update['label' + i] = resObj.label;
						update['fee' + i] = feeval;
						update['type' + i] = resObj.type;
						update['totalfee' + i] = resObj.fee;
						costRequest['cost' + i] = resObj.fee;
						this.setState(update);

						console.log("update resp " + JSON.stringify(update));

						if(i == resultCount){
							let costResponse    = getTotalCostRate(costRequest);
							totalCost      = costResponse.totalCostRate;
							if(this.state.monTaxFixed){
								monTax = this.state.monTax;
							}else{
								monTax = result.data.userSetting.taxRatePerYearPerOfSalePrice;
							}


							console.log("montax 6 " + monTax);

							if(this.state.monInsFixed){
								monIns = this.state.monIns;
							}else{
								monIns = result.data.userSetting.homeownerInsuranceRateYearOfSalePrice;
							}
							if(this.state.numberOfDaysPerMonthFixed){
								numberOfDaysPerMonth = this.state.numberOfDaysPerMonth;
							}else{
								numberOfDaysPerMonth = result.data.userSetting.numberOfDaysPerMonth;
							}
							if(this.state.todaysInterestRateFixed){
								todaysInterestRate = this.state.todaysInterestRate;
							}else{
								todaysInterestRate = result.data.userSetting.todaysInterestRate;
							}
							
							if(this.state.creditReportFixed){
								creditReport = this.state.creditReport;
							}else{
								creditReport = result.data.userSetting.creditReport;
							}
							
							this.setState({
								todaysInterestRate: todaysInterestRate,
								termsOfLoansinYears: result.data.userSetting.termsOfLoansinYears,
								numberOfDaysPerMonth: numberOfDaysPerMonth,
								numberOfMonthsInsurancePrepaid: result.data.userSetting.numberOfMonthsInsurancePrepaid,
								monTax: monTax,
								monIns: monIns,
								creditReport: creditReport,
								totalCost: totalCost,
							},this.callSalesPr);
						}
					i++;
				}
			
			
		});
	}
	
	// Function for fetching and setting values of closing cost tab under CASH page
	callCASHsettinsapi(){
		callPostApi(GLOBAL.BASE_URL + GLOBAL.Buyer_Cost_Setting, {
		user_id: this.state.user_id,company_id: this.state.company_id, zip: this.state.postal_code
		}, this.state.access_token)
		.then((response) => {
			
			var j=1;
			for (resObjMonthExp of result.data.userSettingMonthExp) {
					const updateMonthExp = {};
					if('paymentAmount' + j + "Fixed" == true){
						paymentAmt = this.state['paymentAmount' + j];
					}else{
						paymentAmt = resObjMonthExp.fee;
					}
					updateMonthExp['monthlyExpensesOther' + j] = resObjMonthExp.label;
					updateMonthExp['paymentAmount' + j] = paymentAmt;
					updateMonthExp['typeMonthExp' + j] = resObjMonthExp.key;
					this.setState(updateMonthExp);
					if(j == 3){
						if(this.state.costOtherFixed == true){
							paymentAmt = this.state['costOtherFixed'];
						}else{
							paymentAmt = resObjMonthExp.fee;
						}
						this.setState({twoMonthsPmi1: resObjMonthExp.label,costOther: resObjMonthExp.fee});
					}
				j++;
			}
			
			var i=1;
			//Alert.alert('Alert!', JSON.stringify(result.data.userSettingCost))
			// For setting last fields of closing costs page
			resultCount = _.size(result.data.userSettingCost);
			costRequest = {};
			if((this.state.tab == 'CONV' || this.state.tab == 'Owner_Carry') && this.state.loan_amt != ""){
				amt = this.state.loan_amt;
			}else if(this.state.tab == 'CASH'){
				amt = '0.00';
			}else{
				amt = this.state.adjusted_loan_amt;
			}

			console.log("result.data.userSettingCost 2 " + JSON.stringify(result.data.userSettingCost));
			for (resObj of result.data.userSettingCost) {
				const update = {};
				if(resObj.applyCash == 'Y'){
					req = {'amount': amt,'salePrice': this.state.sale_pr_calc,'type': resObj.type,'rate':resObj.fee};
					var data = getCostTypeTotal(req);
					feeval = data.totalCostRate;
					update['label' + i] = resObj.label;
					update['fee' + i] = feeval;
					update['type' + i] = resObj.type;
					update['totalfee' + i] = resObj.fee;
					costRequest['cost' + i] = resObj.fee;
					this.setState(update);
				}else{
					update['label' + i] = 'None';
					update['fee' + i] = '0.00';
					update['type' + i] = 'Flat Fee';
					update['totalfee' + i] = '0.00';
					costRequest['cost' + i] = '0.00';
					this.setState(update);
				}
				if(i == resultCount){
					let costResponse    = getTotalCostRate(costRequest);
					totalCost      = costResponse.totalCostRate;
					if(this.state.monTaxFixed){
						monTax = this.state.monTax;
					}else{
						monTax = result.data.userSetting.taxRatePerYearPerOfSalePrice;
					}

					console.log("montax 7 " + monTax);

					if(this.state.monInsFixed){
						monIns = this.state.monIns;
					}else{
						monIns = result.data.userSetting.homeownerInsuranceRateYearOfSalePrice;
					}
					if(this.state.numberOfDaysPerMonthFixed){
						numberOfDaysPerMonth = this.state.numberOfDaysPerMonth;
					}else{
						numberOfDaysPerMonth = result.data.userSetting.numberOfDaysPerMonth;
					}
					if(this.state.todaysInterestRateFixed){
						todaysInterestRate = this.state.todaysInterestRate;
					}else{
						todaysInterestRate = result.data.userSetting.todaysInterestRate;
					}
					if(this.state.creditReportFixed){
						creditReport = this.state.creditReport;
					}else{
						creditReport = '0.00';
					}
					this.setState({
						todaysInterestRate: todaysInterestRate,
						termsOfLoansinYears: result.data.userSetting.termsOfLoansinYears,
						numberOfDaysPerMonth: result.data.userSetting.numberOfDaysPerMonth,
						monTax: monTax,
						monIns: monIns,
						numberOfMonthsInsurancePrepaid: '12',
						creditReport: creditReport,
						totalCost: totalCost,
						taxservicecontract: '0.00',
						underwriting: '0.00',
						processingfee: '0.00',
						appraisalfee: '0.00',
						documentprep: '0.00',
						originationfactor: '0.00',
						monTaxVal: '0',
						prepaidMonthTaxes: '0.00',
						principalRate: '0.00',
						realEstateTaxesRes: '0.00',
					},this.callSalesPr);
				}
				i++;
			}
			
		});
	}
	
	
	calTotalPrepaidItems(){
		console.log("alert 18");
        if(this.state.tab == 'FHA'){
            financialVal    = this.state.FhaMipFin3;
        } else if(this.state.tab == 'VA'){
            financialVal    = this.state.VaFfFin3;
        } else if(this.state.tab == 'USDA'){	
            financialVal    = this.state.UsdaMipFinance3;
        } else if(this.state.tab == 'CONV' || this.state.tab == 'Owner_Carry') {
            financialVal    = this.state.monthPmiVal;
        } else if(this.state.tab == 'CASH'){
            financialVal    = '0.00';
        }
		

		console.log("prepaidMonthTaxes " + this.state.prepaidMonthTaxes);

        //creating object for loan payment adjustments
        requestTotPreItem         = {'prepaidMonthTaxesRes': this.state.prepaidMonthTaxes, 'monthInsuranceRes': this.state.monthInsuranceRes, 'daysInterestRes': this.state.daysInterest, 'financialVal': financialVal, 'prepaidAmount': this.state.costOther};
		// Alert.alert('Alert!', JSON.stringify(this.state.prepaidMonthTaxes + "prepaidMonthTaxes" + this.state.monthInsuranceRes + "monthInsuranceRes" + this.state.daysInterest + "daysInterest" + financialVal + "financialVal" )); 
		//calling method to calculate the adjustments
		
		console.log("requestTotPreItem prep item " + JSON.stringify(requestTotPreItem));



        responseTotPreItem        = getTotalPrepaidItems(requestTotPreItem);
		
		
		console.log("resp prep item " + JSON.stringify(responseTotPreItem));


		/* if(this.state.costOther != ''){
			responseTotPreItem.totalPrepaidItems = (parseFloat(this.state.costOther) + parseFloat(responseTotPreItem.totalPrepaidItems)).toFixed(2)
		} */
			//Alert.alert('df',JSON.stringify(financialVal + "financialVal" + this.state.VaFfFin1 + "this.state.VaFfFin1" + this.state.UsdaMipFinance1 + "this.state.UsdaMipFinance1" ));
		/* if(this.state.tab == 'FHA' && this.state.isChecked == false){
			responseTotPreItem.totalPrepaidItems = (parseFloat(this.state.FhaMipFin) + parseFloat(responseTotPreItem.totalPrepaidItems)).toFixed(2)
		}else if(this.state.tab == 'VA' && this.state.isCheckedVA == false){
			responseTotPreItem.totalPrepaidItems = (parseFloat(this.state.VaFfFin1) + parseFloat(responseTotPreItem.totalPrepaidItems)).toFixed(2)
		}else if(this.state.tab == 'USDA' && this.state.isCheckedUSDA == false){
			responseTotPreItem.totalPrepaidItems = (parseFloat(this.state.UsdaMipFinance1) + parseFloat(responseTotPreItem.totalPrepaidItems)).toFixed(2)
		} */
	
		this.setState({financialVal: financialVal,totalPrepaidItems: parseFloat(responseTotPreItem.totalPrepaidItems).toFixed(2)},this.calTotalInvestment);
    }
	
	
	//Total Monthly Payment
    calTotalMonthlyPayment(){
		console.log("alert 10");
        //creating object for loan payment adjustments
	   requestTotPreItem         = {'principalRate': this.state.principalRate, 'realEstateTaxesRes': this.state.realEstateTaxesRes, 'homeOwnerInsuranceRes': this.state.homeOwnerInsuranceRes, 'monthlyRate': this.state.monthlyRate, 'pnintrate': this.state.pnintrate, 'paymentAmount1': this.state.paymentAmount1, 'paymentAmount2': this.state.paymentAmount2};
	   
	   console.log("requestTotPreItem buyers " + JSON.stringify(requestTotPreItem));


        //calling method to calculate the adjustments
		responseTotPreItem        = getTotalMonthlyPayment(requestTotPreItem);
		
		console.log("responseTotPreItem buyers " + JSON.stringify(responseTotPreItem));

		/* if(this.state.monthlyExpensesOther1 != ""){
			responseTotPreItem.totalMonthlyPayment = (parseFloat(this.state.paymentAmount1) + parseFloat(responseTotPreItem.totalMonthlyPayment)).toFixed(2)
		}
		if(this.state.monthlyExpensesOther2 != ""){
			responseTotPreItem.totalMonthlyPayment = (parseFloat(this.state.paymentAmount2) + parseFloat(responseTotPreItem.totalMonthlyPayment)).toFixed(2)
		} */
		
		this.setState({totalMonthlyPayment: responseTotPreItem.totalMonthlyPayment, totalMonthlyPaymentOld: responseTotPreItem.totalMonthlyPayment, paymentAmount1Fixed : true, paymentAmount2Fixed : true},this.changePrepaidPageFields);
    }

//Total Investment
    calTotalInvestment(){
	
		console.log("alert 19");
        //creating object for loan payment adjustments
		if(this.state.totalPrepaidItems == '' || this.state.totalPrepaidItems === undefined){
			 requestTotPreItem         = {'downPayment': this.state.down_payment, 'totalClosingCost': this.state.totalClosingCost, 'totalPrepaidItems': 0, 'estimatedTaxProrations': this.state.estimatedTaxProrations};
		}else{
			 requestTotPreItem         = {'downPayment': this.state.down_payment, 'totalClosingCost': this.state.totalClosingCost, 'totalPrepaidItems': this.state.totalPrepaidItems, 'estimatedTaxProrations': this.state.estimatedTaxProrations};
		}


		console.log("getTotalInvestment request params " + JSON.stringify(requestTotPreItem));

		//Alert.alert('Alert!', JSON.stringify(this.state.prepaidMonthTaxes + "prepaidMonthTaxes" + this.state.monthInsuranceRes + "monthInsuranceRes" + this.state.daysInterest + "daysInterest" + financialVal + "financialVal" )); 
        //calling method to calculate the adjustments
		responseTotPreItem        = getTotalInvestment(requestTotPreItem);
		
		console.log("getTotalInvestment response params " + JSON.stringify(responseTotPreItem));

		if(isNaN(responseTotPreItem.totalInvestment)){
			this.setState({totalInvestment: '0.00'});
		} else{
			//totalInvestment = (parseFloat(responseTotPreItem.totalInvestment) + parseFloat(this.state.estimatedTaxProrations)).toFixed(2);
			this.setState({totalInvestment: responseTotPreItem.totalInvestment});
		} 
		this.setState({animating:'false'});

		this.state.textMsgPdfArray = {
			"Prepared_For"         : this.state.lendername,
			"address"              : this.state.lender_address,
			"salesPrice"           : this.state.sale_pr,
			"estClosingDate"       : this.state.date,
			"closingCost"          : this.state.totalClosingCost,
			"estimatedTaxProration": this.state.estimatedTaxProrations,
			"userId"               : this.state.user_id,
			"companyId"            : this.state.company_id,
			"city"                 : this.state.city,
			"state"                : this.state.state_name, 
			"zip"                  : this.state.postal_code,
			"buyerLoanType"        : this.state.tab,
			"downPayment"          : this.state.down_payment,
			"totalPrepaidItems"    : this.state.totalPrepaidItems,
			"totalMonthlyPayment"  : this.state.totalMonthlyPayment,
			"totalInvestment"      : responseTotPreItem.totalInvestment,
  			"caltype" : "buyer"
		}	

    } 
	
	changeMortgageInsVal(){
		//creating object for amount and rate value
		requestMMI 		= {'amount': this.state.loan_amt, 'rateValue': this.state.rateValue};

		//calling method to calculate the FHa MIP Finance for prepaid
		responseMMI 		= getMonthlyRateMMI(requestMMI);

		monthlyRate		= responseMMI.monthlyRateMMI;

		console.log("monthlyRate 2 " + monthlyRate);

		monthPmiVal		= responseMMI.monthPmiVal;
		
		console.log("monthPmiVal 3 " + monthPmiVal);

		this.setState({monthlyRate: monthlyRate, monthPmiVal: monthPmiVal},this.calTotalMonthlyPayment);
	}
	
	callSalesPr(){
		console.log("alert 4");
		this.onChangeRate(this.state.sale_pr_calc, "sale_pr");
	}
	
	saveBuyerCalculatorDetailsApi(){

		if(this.state.isCheckForFlorida == true) {
			this.setState({
				useForPrepaid : 1
			});
		} else {
			this.setState({
				useForPrepaid : 0
			});			
		}

		buyerData 	= 	{
							'company_id'	: this.state.company_id,
							'user_id' : this.state.user_id,
							'preparedBy' : this.state.user_name,
							'preparedFor' : this.state.lendername,
							'address' : this.state.lender_address,
							'city' : this.state.city,
							'state' : this.state.state,
							'zip' : this.state.postal_code,
							'lendername' : this.state.lendername,
							'salePrice' : this.state.sale_pr_calc,
							'buyerLoanType' : this.state.tab,
							'conventionalLoanToValue_1Loan' : this.state.ltv,
							'conventionalInterestRate_2Loan' : this.state.todaysInterestRate1,
							'conventionalTermInYear_2Loan' : this.state.termsOfLoansinYears2,
							'conventionalLoanToValue_2Loan' : this.state.ltv2,
							'interestRate' : this.state.todaysInterestRate,
							'termInYears' : this.state.termsOfLoansinYears,
							'adjustable' : 'N',
							'adjustable2' : 'N',
							'interestRateCap' : this.state.interestRateCap,
							'interestRateCap_2Loan' : this.state.interestRateCap2,
							'perAdjustment' : this.state.perAdjustment,
							'perAdjustment_2Loan' : this.state.perAdjustment2,
							'amount' : this.state.loan_amt,
							'conventionalAmount2' : this.state.loan_amt2,
							'adjusted' : this.state.adjusted_loan_amt,
							'downPayment' : this.state.down_payment,
							'discount1' : this.state.disc,
							'discount2' : this.state.discAmt,
							'originationFee' : this.state.originationFee,
							'processingFee' : this.state.processingfee,
							'taxServiceContract' : this.state.taxservicecontract,
							'documentPreparation' : this.state.documentprep,
							'underwriting' : this.state.underwriting,
							'appraisal' : this.state.appraisalfee,
							'creditReport' : this.state.creditReport,
							'costLabel_1Value' : this.state.label1,
							'costType_1Value' : this.state.type1,
							'costFee_1Value' : this.state.fee1,
							'costTotalFee_1Value' : this.state.fee1,
							'costLabel_2Value' : this.state.label2,
							'costType_2Value' : this.state.type2,
							'costFee_2Value' : this.state.fee2,
							'costTotalFee_2Value' : this.state.fee2,
							'costLabel_3Value' : this.state.label3,
							'costType_3Value' : this.state.type3,
							'costFee_3Value' : this.state.fee3,
							'costTotalFee_3Value' : this.state.fee3,
							'costLabel_4Value' : this.state.label4,
							'costType_4Value' : this.state.type4,
							'costFee_4Value' : this.state.fee4,
							'costTotalFee_4Value' : this.state.fee4,
							'costLabel_5Value' : this.state.label5,
							'costType_5Value' : this.state.type5,
							'costFee_5Value' : this.state.fee5,
							'costTotalFee_5Value' : this.state.fee5,
							'costLabel_6Value' : this.state.label6,
							'costType_6Value' : this.state.type6,
							'costFee_6Value' : this.state.fee6,
							'costTotalFee_6Value' : this.state.fee6,
							'costLabel_7Value' : this.state.label7,
							'costType_7Value' : this.state.type7,
							'costFee_7Value' : this.state.fee7,
							'costTotalFee_7Value' : this.state.fee7,
							'costLabel_8Value' : this.state.label8,
							'costType_8Value' : this.state.type8,
							'costFee_8Value' : this.state.fee8,
							'costTotalFee_8Value' : this.state.fee8,
							'costLabel_9Value' : this.state.label9,
							'costType_9Value' : this.state.type9,
							'costFee_9Value' : this.state.fee9,
							'costTotalFee_9Value' : this.state.fee9,
							'costLabel_10Value' : this.state.label10,
							'costType_10Value' : this.state.type10,
							'costFee_10Value' : this.state.fee10,
							'costTotalFee_10Value' : this.state.fee10,
							'totalClosingCost' : this.state.totalClosingCost,
							'prepaidMonthTaxes1' : this.state.monTaxVal,
							'prepaidMonthTaxes2' : this.state.monTax,
							'prepaidMonthTaxes3' : this.state.prepaidMonthTaxes,
							'prepaidMonthInsurance1' : this.state.numberOfMonthsInsurancePrepaid,
							'prepaidMonthInsurance2' : this.state.monIns,
							'prepaidMonthInsurance3' : this.state.monthInsuranceRes,
							'daysInterest1' : this.state.numberOfDaysPerMonth,
							'daysInterest2' : this.state.daysInterest,
							'payorSelectorEscrow' : this.state.escrowType,
							'escrowOrSettlement' : this.state.escrowFee,
							'payorSelectorOwners' : this.state.ownersType,
							'ownersTitlePolicy' : this.state.ownerFee,
							'payorSelectorLenders' : this.state.lenderType,
							'lendersTitlePolicy' : this.state.lenderFee,
							'escrowFeeHiddenValue' : this.state.escrowFeeOrg,
							'lendersFeeHiddenValue' : this.state.lenderFeeOrg,
							'ownersFeeHiddenValue' : this.state.ownerFeeOrg,
							'principalAndInterest' : this.state.principalRate,
							'realEstateTaxes' : this.state.realEstateTaxesRes,
							'homeownerInsurance' : this.state.homeOwnerInsuranceRes,
							'paymentRate' : this.state.rateValue,
							'paymentMonthlyPmi' : this.state.monthlyRate,
							'twoMonthsPmi' : this.state.monthPmiVal,
							'prepaidCost' : this.state.twoMonthsPmi1,
							'prepaidAmount' : this.state.costOther,
							'totalPrepaidItems' : this.state.totalPrepaidItems,
							'paymentMonthlyExpense1' : this.state.monthlyExpensesOther1,
							'paymentAmount1' : this.state.paymentAmount1,
							'paymentMonthlyExpense2' : this.state.monthlyExpensesOther2,
							'paymentAmount2' : this.state.paymentAmount2,
							'totalMonthlyPayement' : this.state.totalMonthlyPayment,
							'estimatedTaxProrations' : this.state.estimatedTaxProrations,
							'totalInvestment' : this.state.totalInvestment,
							'countyId' : this.state.county,
							'stateId' : this.state.state,
							'noPmi' : this.state.nullVal,
							'financeMip' : this.state.nullVal,
							'financeFundingFee' : this.state.nullVal,
							'showApr' : this.state.nullVal,
							'mipFinanced' : this.state.nullVal,
							'fundingFeeFinanced1' : this.state.nullVal,
							'fundingFeeFinanced2' : this.state.nullVal,
							'estimatedClosingMonth' : this.state.nullVal,
							'annualPropertyTax' :this.state.annualPropertyTax,
							'summerPropertyTax' : this.state.summerPropertyTax,
							'winterPropertyTax' : this.state.winterPropertyTax,
							'titleInsuranceType' : 'N',
							'titleInsuranceShortRate' : this.state.nullVal,
							'newLoanServiceFee' : this.state.newLoanServiceFee,
							'fhaMip' : this.state.nullVal,
							'fundingFee' : this.state.nullVal,
							'pl2ndTD' : this.state.nullVal,
							'minimumCashIvestment' : this.state.nullVal,
							'mipFinancedHiddenValue' : this.state.nullVal,
							'RoundDownMIP' : this.state.nullVal,
							'countyTransferTax' : this.state.nullVal,
							'cityTransferTax' : this.state.nullVal,
							'reissueYearDD' : this.state.nullVal,
							'lowerTitlePolicy' : this.state.nullVal,
							// New params added by lovedeep for special cases
							'prorationPercent': this.state.prorationPercent,
							'useForPrepaid' : this.state.useForPrepaid,
						};

						date = this.state.date;
						var split = date.split('-');
						date = Number(split[0])+'/'+Number(split[1])+'/'+Number(split[2]);
						buyerData.estStlmtDate = date;

						console.log("buyer calc " + JSON.stringify(buyerData));

						if(this.state.calculatorId != "" && this.state.calculatorId != "undefined") {
							buyerData.calculator_id = this.state.calculatorId;
							// alert box added by lovedeep on 04-30-2018
							Alert.alert( 'CostsFirst', 'A Saved File already exits with the same file name, do you want to:', [ {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')}, {text: 'Save As', onPress: this.onSaveAsNew.bind(this, buyerData)}, {text: 'Overwrite', onPress: this.onOverwriteAsExisting.bind(this, buyerData)}] );
							
						} else {
							var temp = JSON.stringify(buyerData);
							temp = temp.replace(/\"\"/g, "\"0.00\"");
							buyerData = JSON.parse(temp);

							// check added by lovedeep on 04-30-2018
							if(buyerData.address == '0.00') {
								buyerData.address = '';
							}

						//	alert(JSON.stringify(buyerData));

							callPostApi(GLOBAL.BASE_URL + GLOBAL.save_buyer_calculator, buyerData,this.state.access_token).then((response) => {
								

								console.log("save calc api result " + JSON.stringify(result));

								//alert("result " + JSON.stringify(result));

								this.setState({monthlyRate: monthlyRate, monthPmiVal: monthPmiVal},this.calTotalPrepaidItems);

								console.log("monthlyRate 3 " + monthlyRate);

								console.log("monthPmiVal 4 " + monthPmiVal);

								if(result.status == 'success'){
									if(this.state.calculatorId != ''){
										this.dropdown.alertWithType('success', 'Success', result.message);
									}else{
										this.dropdown.alertWithType('success', 'Success', result.message);
										this.getBuyerCalculatorListApi();
									}
								}
								//Alert.alert('Alert!', JSON.stringify(result));
							});							
						}
	}

	// function added by lovedeep on 04-30-2018 for user to save existing calc as new 
	onSaveAsNew(buyerdt) {
		// as per discussion with atul sir .. passing calc id empty
		delete buyerdt.calculator_id;
		var temp = JSON.stringify(buyerdt);
		temp = temp.replace(/\"\"/g, "\"0.00\"");
		buyerData = JSON.parse(temp);
		// check added by lovedeep on 04-30-2018
		if(buyerData.address == '0.00') {
			buyerData.address = '';
		}


		console.log("onSaveAsNew buyerdata resuqest " + JSON.stringify(buyerData));

		callPostApi(GLOBAL.BASE_URL + GLOBAL.save_buyer_calculator, buyerData,this.state.access_token).then((response) => {

			console.log("onSaveAsNew buyerdata result " + JSON.stringify(result));
		//	alert(JSON.stringify(result));

			this.setState({monthlyRate: monthlyRate, monthPmiVal: monthPmiVal},this.calTotalPrepaidItems);

			console.log("monthlyRate 4 " + monthlyRate);

			console.log("monthPmiVal 5 " + monthPmiVal);

			if(result.status == 'success'){
				if(this.state.calculatorId != ''){
					this.dropdown.alertWithType('success', 'Success', result.message);
				}else{
					this.dropdown.alertWithType('success', 'Success', result.message);
					this.getBuyerCalculatorListApi();
				}
			}
			//Alert.alert('Alert!', JSON.stringify(result));
		});
	}
	
	// function added by lovedeep on 04-30-2018 for user to over existing calc
	onOverwriteAsExisting(buyerdt) {
		var temp = JSON.stringify(buyerdt);
		temp = temp.replace(/\"\"/g, "\"0.00\"");
		buyerData = JSON.parse(temp);
		// check added by lovedeep on 04-30-2018
		if(buyerData.address == '0.00') {
			buyerData.address = '';
		}
		callPostApi(GLOBAL.BASE_URL + GLOBAL.save_buyer_calculator, buyerData,this.state.access_token).then((response) => {
			this.setState({monthlyRate: monthlyRate, monthPmiVal: monthPmiVal},this.calTotalPrepaidItems);

			console.log("monthlyRate 5 " + monthlyRate);

			console.log("monthPmiVal 6 " + monthPmiVal);

			if(result.status == 'success'){
				if(this.state.calculatorId != ''){
					this.dropdown.alertWithType('success', 'Success', result.message);
				}else{
					this.dropdown.alertWithType('success', 'Success', result.message);
					this.getBuyerCalculatorListApi();
				}
			}
			//Alert.alert('Alert!', JSON.stringify(result));
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

	onPressDeleteCalculator(id) {

		//console.log("calculator id " + id);
		this.setState({animating : 'true', loadingText : 'Please wait..'});
		callPostApi(GLOBAL.BASE_URL + GLOBAL.Delete_Buyer_Calculator, {id: id
		}, this.state.access_token)
		.then((response) => {
			
			//console.log("response for delete after onpress " + JSON.stringify(result));
			
			if (result.status == 'success') {
				this.setState({animating : 'false'});
				Alert.alert('CostsFirst', result.message);
				this.getBuyerCalculatorListApi();
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
	
	getAmtSchListApi()
	{
		if(this.state.isCheckForSecondLoan == true){
			var intr = this.state.todaysInterestRate1;
			var dur = this.state.termsOfLoansinYears2;
			var due = this.state.due_in_year2;
			var sp = this.state.loan_amt2;
		}else if(this.state.isCheckForFirstLoan == true){
			var intr = this.state.todaysInterestRate;
			var dur = this.state.termsOfLoansinYears;
			var due = this.state.due_in_year1;
			var sp = this.state.loan_amt;
		}else{
			var intr = this.state.intr;
			var dur = this.state.dur;
			var due = this.state.due;
			var sp = this.state.sp;

		}
		tick = parseInt(sp / 10);
		ticks = parseInt(due * 12 / 10);
		this.state.minY = parseFloat(tick * 0);
		this.state.maxY = parseFloat(tick * 10);
		this.state.minX = parseFloat(ticks * 0);
		this.state.maxX = parseFloat(ticks * 10);
		this.state.leftAxisData = [parseFloat(tick * 0),parseFloat(tick * 1),parseFloat(tick * 2),parseFloat(tick * 3),parseFloat(tick * 4),parseFloat(tick * 5),parseFloat(tick * 6),parseFloat(tick * 7),parseFloat(tick * 8),parseFloat(tick * 9),parseFloat(tick * 10)];
		this.state.bottomAxisData = [parseFloat(ticks * 0),parseFloat(ticks * 1),parseFloat(ticks * 2),parseFloat(ticks * 3),parseFloat(ticks * 4),parseFloat(ticks * 5),parseFloat(ticks * 6),parseFloat(ticks * 7),parseFloat(ticks * 8),parseFloat(ticks * 9),parseFloat(ticks * 10)];
		this.setState({intr: intr, dur: dur, due: due, sp: sp});
		callPostApi(GLOBAL.BASE_URL + GLOBAL.calcownercarry, {sp: sp, intr: intr, dur: dur, due: due
		}, this.state.access_token)
		.then((response) => {
			if(result.status == 'success'){
				this.state.arraycontainer = [];
				for(let i = 0; i < result.data.length; i++){
					monthval = result.data[i].month;
					balanceval = result.data[i].balance;
					if(monthval != ''){
						this.state.arraycontainer.push({"y" : parseFloat(balanceval).toFixed(2), "x" : monthval});
					}
				}
				this.state.dataGraph = [];
				this.state.dataGraph.push(this.state.arraycontainer);
				var ds = new ListView.DataSource({
					rowHasChanged: (r1, r2) => r1 !== r2
				});
				this.setState({dataSourceOrgAmtSch: ds.cloneWithRows(result.data),dataSourceAmtSch: ds.cloneWithRows(result.data),arrayholder: result.data,emptCheckAmtSch: false});
			}else{
				this.setState({emptCheckAmtSch: true});
			}
		});

		console.log("dataSource " + JSON.stringify(this.state.dataSourceAmtSch));

	}
	
	SearchFilterFunction(text){
		if(text != '' && this.state.arrayholder != ""){
			const newData = this.state.arrayholder.filter(function(item){
				const itemData = item.calculatorName.toUpperCase()
				const itemAddressData = item.address.toUpperCase()
				const itempriceData = item.price.toUpperCase()
				const textData = text.toUpperCase()
				if(itemData.indexOf(textData) > -1 || itemAddressData.indexOf(textData) > -1 || itempriceData.indexOf(textData) > -1){
					return true;
				}
				 
			})

			if (newData.length > 0) {
				this.setState({
					dataSource: this.state.dataSource.cloneWithRows(newData),
					emptCheck: false,
				})
			}else{
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
		
		if(this.state.dataSource._cachedRowCount == 1) {
			this.setState({
				emptCheck: true,
			})
		}
		//console.log("dataSource 2 " + JSON.stringify(this.state.dataSource._cachedRowCount));

		

	}
	
	editCalculator(id){
		callPostApi(GLOBAL.BASE_URL + GLOBAL.buyer_detail_calculator, {calculatorId: id
		}, this.state.access_token)
		.then((response) => {
			if(result.status == 'success'){
				if(result.data.useForPrepaid == 0) {
					this.setState({
						isCheckForFlorida : false
					});	
				} else {
					this.setState({
						isCheckForFlorida : true
					});						
				}

				this.setState(result.data);
				this.setState({sale_pr: result.data.salePrice,sale_pr_calc: result.data.salePrice, lender_address: result.data.address, postal_code: result.data.zip, tab: result.data.buyerLoanType,ltv: result.data.conventionalLoanToValue_1Loan,todaysInterestRate1: result.data.conventionalInterestRate_2Loan,termsOfLoansinYears2: result.data.conventionalTermInYear_2Loan,ltv2: result.data.conventionalLoanToValue_2Loan,todaysInterestRate: result.data.interestRate,termsOfLoansinYears: result.data.termInYears,interestRateCap2: result.data.interestRateCap_2Loan,perAdjustment2: result.data.perAdjustment_2Loan,loan_amt: result.data.amount,loan_amt2: result.data.conventionalAmount2,adjusted_loan_amt: result.data.adjusted,down_payment: result.data.downPayment,disc: result.data.discount1,discAmt: result.data.discount2,taxservicecontract: result.data.taxServiceContract,documentprep: result.data.documentPreparation,appraisalfee: result.data.appraisal,label1: result.data.costLabel_1Value,costType_1Value: result.data.type1,fee1: result.data.costFee_1Value,label2: result.data.costLabel_2Value,type2: result.data.costType_2Value,fee2: result.data.costFee_2Value,label3: result.data.costLabel_3Value,type3: result.data.costType_3Value,fee3: result.data.costFee_3Value,label4: result.data.costLabel_4Value,type4: result.data.costType_4Value,fee4: result.data.costFee_4Value,label5: result.data.costLabel_5Value,type5: result.data.costType_5Value,fee5: result.data.costFee_5Value,label6: result.data.costLabel_6Value,type6: result.data.costType_6Value,fee6: result.data.costFee_6Value,label7: result.data.costLabel_7Value,type7: result.data.costType_7Value,fee7: result.data.costFee_7Value,label8: result.data.costLabel_8Value,type8: result.data.costType_8Value,fee8: result.data.costFee_8Value,label9: result.data.costLabel_9Value,type9: result.data.costType_9Value,fee9: result.data.costFee_9Value,label10: result.data.costLabel_10Value,type10: result.data.costType_10Value,fee10: result.data.costFee_10Value,monTaxVal: result.data.prepaidMonthTaxes1,monTax: result.data.prepaidMonthTaxes2,prepaidMonthTaxes: result.data.prepaidMonthTaxes3,numberOfMonthsInsurancePrepaid: result.data.prepaidMonthInsurance1,monIns: result.data.prepaidMonthInsurance2,monthInsuranceRes: result.data.prepaidMonthInsurance3,numberOfDaysPerMonth: result.data.daysInterest1,daysInterest: result.data.daysInterest2,escrowType: result.data.payorSelectorEscrow,escrowFee: result.data.escrowOrSettlement,ownersType: result.data.payorSelectorOwners,ownerFee: result.data.ownersTitlePolicy,lenderType: result.data.payorSelectorLenders,lenderFee: result.data.lendersTitlePolicy,escrowFeeOrg: result.data.escrowFeeHiddenValue,lenderFeeOrg: result.data.lendersFeeHiddenValue,ownerFeeOrg: result.data.ownersFeeHiddenValue,principalRate: result.data.principalAndInterest,realEstateTaxesRes: result.data.realEstateTaxes,homeOwnerInsuranceRes: result.data.homeownerInsurance,rateValue: result.data.paymentRate,monthlyRate: result.data.paymentMonthlyPmi,twoMonthsPmi: result.data.monthPmiVal,twoMonthsPmi1: result.data.prepaidCost,costOther: result.data.prepaidAmount,monthlyExpensesOther1: result.data.paymentMonthlyExpense1,monthlyExpensesOther2: result.data.paymentMonthlyExpense2,totalMonthlyPayment: result.data.totalMonthlyPayement,county: result.data.countyId,state: result.data.stateId, calculatorId: id, totalMonthlyPayment: result.data.totalMonthlyPayement, summerPropertyTax : result.data.summerPropertyTax, winterPropertyTax : result.data.winterPropertyTax, prorationPercent : result.data.prorationPercent});
				this.setModalVisible(!this.state.modalVisible);
			}
		});
	}
	
	renderAddrsRow(rowData){
		return (
			<View style={BuyerStyle.scrollable_container_child_center}>
				<View style={{width: '100%',justifyContent: 'center'}}>
					<TouchableOpacity>
						<CheckBox checkedColor='#CECECE' checked={this.state[rowData.email].isAddrsChecked} onPress = { () => this.handlePressAddressCheckedBox(rowData.email) } title={rowData.email}/>
							
					</TouchableOpacity>
				</View>
			</View>
		);
	}
	
	commaSeparate(val){
		val = val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		return val;
	}
	
	renderRowAmtSch(rowData) {
		if(rowData.month != ''){
			rowData.payment = this.commaSeparate(rowData.payment);
			rowData.interest = this.commaSeparate(rowData.interest);
			rowData.principal = this.commaSeparate(rowData.principal);
			rowData.balance = this.commaSeparate(rowData.balance);
		return (
		
		<View style={BuyerStyle.scrollable_container_child_center_amtsch}>
				<View style={[BuyerStyle.colForAmtSchList,{width: '10%'}]}>
					<TouchableOpacity>
						<Text style={BuyerStyle.text_style}>
							{rowData.month}
						</Text>
					</TouchableOpacity>
				</View>
				
				<View style={BuyerStyle.verticalLineForSegmentForListingBorder}></View>
				
				<View style={BuyerStyle.colForAmtSchList}>
				<TouchableOpacity>
					<Text style={[BuyerStyle.alignCenterCalcList,{alignSelf: 'flex-start'}]}>
						${rowData.payment}
					</Text>
				</TouchableOpacity>	
				</View>
				
				<View style={BuyerStyle.verticalLineForSegmentForListingBorder}></View>
				
				<View style={BuyerStyle.colForAmtSchList}>
				<TouchableOpacity>
					<Text style={[BuyerStyle.alignCenterCalcList,{alignSelf: 'flex-start'}]}>
						${rowData.interest}
					</Text>
				</TouchableOpacity>	
				</View>
				
				<View style={BuyerStyle.verticalLineForSegmentForListingBorder}></View>
				
				<View style={BuyerStyle.colForAmtSchList}>
				<TouchableOpacity>
					<Text style={[BuyerStyle.alignCenterCalcList,{alignSelf: 'flex-start'}]}>
						${rowData.principal}
					</Text>
				</TouchableOpacity>	
				</View>
				
				<View style={BuyerStyle.verticalLineForSegmentForListingBorder}></View>
				
				<View style={[BuyerStyle.colForAmtSchList,{width: '30%'}]}>
				<TouchableOpacity>
					<Text style={[BuyerStyle.alignCenterCalcList,{alignSelf: 'flex-start'}]}>
						${rowData.balance}
					</Text>
				</TouchableOpacity>	
				</View>
			</View>
		);
		}else{return (<View></View>);}
	}

	onClose(data) {
		if(data.type == 'success' && data.message == 'Email sent successfully') {
			console.log("verify email " + this.state.verified_email);	
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

	onActionSelected(position) {
    //alert(this.state.dropValues);
		if(this.state.dropValues == "OPEN") {
			this.setModalVisible(true);
			this.setState({
				dropValues : ""
			});
		}else if(this.state.dropValues == "Email Amortization Sch.") {
			this.setModalVisibleForAmtSch(true);
			this.setState({
				dropValues : ""
			});
		}else if(this.state.dropValues == "SAVE"){
			this.saveBuyerCalculatorDetailsApi();
			this.setState({
				dropValues : ""
			});	
		}else if(this.state.dropValues == "PRINT"){
			this.setState({popupType: "print"},this.popupShow);
			this.setState({
				dropValues : ""
			});
		}else if (this.state.dropValues == "MESSAGE") {
			if (this.state.sale_pr_calc == "" || this.state.sale_pr_calc == '0.00') {
				this.dropdown.alertWithType('error', 'Error', 'Please enter sales price.');
			} else {
				this.setState({
					openMessagePopup: true
				});
			}
		}else if(this.state.dropValues == "EMAIL"){
			if(this.state.sale_pr_calc == "" || this.state.sale_pr_calc == '0.00'){
				this.dropdown.alertWithType('error', 'Error', 'Please enter sales price.');
			}else{
				this.setState({popupType: "email"},this.popupShow);
			}
			this.setState({
				dropValues : ""
			});
			
		}else if(position == "msg_tab"){
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
	

				 console.log("formdata " + JSON.stringify(formData));

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
					console.log("response " + JSON.stringify(response));
					this.setState({
						imageNameEmail : response.data
					});
					//{"message":"Image Uploaded","status":"success","data":"1523438245.jpg"}
					//alert(JSON.stringify(response));
					//console.log("image uploaded")
				}).catch(err => {
					Alert.alert('', 'Error occured, please try again later.');
					console.log("err " + JSON.stringify(err));
					//alert(JSON.stringify(err));
					//console.log('error message')
				})

			});
			//this.setState({popupType: "msg_tab"},this.popupShow);
		}else if(position == "msg_tab_cam"){
			ImagePicker.openCamera({
			  width: 300,
			  height: 400,
			  cropping: true
			}).then(image => {
				this.popupDialog.dismiss();
                this.popupDialogEmail.dismiss();
				this.setState({imageData: image}, this.imageSuccess);
				//console.log("image data " + JSON.stringify(image));
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
					 console.log("formdata cam " + JSON.stringify(formData));
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
						console.log("response " + JSON.stringify(response));
						this.setState({
							imageNameEmail : response.data
						});
						//alert(JSON.stringify(response));
						//console.log("image uploaded")
					}).catch(err => {
						Alert.alert('', 'Error occured, please try again later.');
						console.log("err " + JSON.stringify(err));
						//alert(JSON.stringify(err));
						//console.log('error message')
					})
			});
		}else if(this.state.dropValues == 'LOAN COMPARISON'){

			this.setState({popupType: "loan_comparison"},this.popupShow);

			/*if(this.state.sale_pr > 0){
				buyerData 	= 	{
				'rate'	: this.state.todaysInterestRate,
				'transactionDt' : this.state.date,
				'companyId' : this.state.company_id,
				'userId'	: this.state.user_id,
				'salesprice'	: this.state.sale_pr,
				'mainCompanyId'	: this.state.main_companyId,
				'zip'	: this.state.postal_code,
				}
				this.setState({animating:'true'});
				callPostApi(GLOBAL.BASE_URL + GLOBAL.loan_comparison_pdf, buyerData,this.state.access_token)
				.then((response) => {
					if(result.status == 'success'){
						OpenFile.openDoc([{
							url:GLOBAL.BASE_URL + result.data.file,
							fileName:"sample",
							fileType:"pdf",
							cache: false,
							}], (error, url) => {
							if (error) {
								console.error(error);
								this.setState({animating:'false'});
							} else {
								this.setState({animating:'false'});
								console.log(url)
							}
						})
					}
				});
			}else{
				this.dropdown.alertWithType('error', 'Error', 'Please enter sales price');
			}*/
		}
	}

	imageSuccess() {
		//this.dropdown.alertWithType('success', 'Success', 'Image attached successfully!');
		//this.dropdown.alertWithType('success', 'Success', 'Image attached successfully!');		
	}
	
	openpopup(type) {
		this.setState({popupAttachmentType: type},this.popupShowEmail);
	}
	popupShow(){
		this.popupDialog.show();
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

	popupShowEmail(){
		this.popupDialogEmail.show();
	}

	popupHideEmail(){
		this.popupDialogEmail.dismiss();
	}

	popupHide() {
		this.popupDialog.dismiss();
	}
	
	confirmlogout(position) {
		
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

	onBlur(text) {
		if(text == 'lendername') {
			if(this.state.lendername == "") {
				this.setState({
					lendername : 'New Client',
				}) 
			}

		}
	}	
	
	printPDF(type){

		if(type == 'owner_carry') {
			pdfURL = GLOBAL.generate_pdf_owner_carry;
			
			ownerCarryData = {
				user_id : this.state.user_id,
				opt 	: 'pdf',
				type 	: 'list', 
				sp 		: this.state.sale_pr,
				intr 	: this.state.todaysInterestRate,
				dur 	: this.state.termsOfLoansinYears,
				due 	: this.state.due_in_year1,
				note 	: this.state.note,
				email 	: this.state.to_email,
				subject : this.state.subject
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
			
		} else if(type == 'cdtc') {
			date = this.state.date;
			var split = date.split('-');
			date = Number(split[0])+'/'+Number(split[1])+'/'+Number(split[2]);
			requestType = {
				"actionType":"download",
				"date":date,
				"loanPurpose":"Purchase"
			}

			callPostApi(GLOBAL.BASE_URL + GLOBAL.buyer_cdtc_pdf, requestType, this.state.access_token)
			.then((response) => {
				if(result.status == 'success'){


					console.log("cdtc resp " + JSON.stringify(result));

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
				}
			});	
		} else if (type == "trid") {
		
			if(this.state.sale_pr > 0) {
				date = this.state.date;
				var split = date.split('-');
				date = Number(split[0])+'/'+Number(split[1])+'/'+Number(split[2]);
				requestType = {
					"quote" : this.state.escrowQuote,
					"ownersfee":this.state.ownerFee,
					"lendersfee":this.state.lenderFee,
					"stateId": this.state.state,
					"actionType" : "download"
				}

				callPostApi(GLOBAL.BASE_URL + GLOBAL.buyer_trid_pdf, requestType, this.state.access_token)
				.then((response) => {
					if(result.status == 'success'){
					//	console.log("trid resp " + JSON.stringify(result));
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
					}
				});
			} else {
				this.dropdown.alertWithType('error', 'Error', 'Please enter sales price.');
			}

		}

		else {
			if(type == "detailed"){
				pdfURL = GLOBAL.generate_pdf + '/' + this.state.languageType;
			}else if(type == "quick"){
				pdfURL = GLOBAL.generate_pdf_quick_buyer + '/' + this.state.languageType;
			}
			buyerData = this.getData();
			date = this.state.date;
			var split = date.split('-');
			date = Number(split[0])+'/'+Number(split[1])+'/'+Number(split[2]);
			buyerData = this.getData();
			buyerData.actionType = 'download';
			buyerData.estStlmtDate = date;
			buyerData.cdtcSetting 			= this.state.CDTC_Status;
			buyerData.tridSetting 			= this.state.TRID_Status;
			buyerData.bothCdtcTridSetting 	= this.state.CDTC_TRID_Status;
			buyerData.quote 				= this.state.escrowQuote;
			buyerData.ownersfee 			= this.state.ownerFee;
			buyerData.lendersfee 			= this.state.lenderFee;

			console.log("pdfURL " + pdfURL);
			console.log("date issue printPDF  " + JSON.stringify(buyerData));

			callPostApi(GLOBAL.BASE_URL + pdfURL, buyerData,this.state.access_token)
			.then((response) => {

				console.log("Detailed print result " + JSON.stringify(result));

				if(result.status == 'success'){
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
				}
			});
		}	
	}

	printQuickDetailPDF(type) {


		if(this.state.CDTC_TRID_Status == true) {
			this.printPDF(type);
		} else {
			if(this.state.CDTC_Status == false && this.state.TRID_Status  == true) {
				Alert.alert( 'CostsFirst', 'Include CDTC data?', [ {text: 'NO', onPress: this.onCallFuncSetPrintPDF.bind(this, 'CDTC_Status', false, type)}, {text: 'YES', onPress: this.onCallFuncSetPrintPDF.bind(this, 'CDTC_Status', true, type)}] );
			} else if (this.state.TRID_Status == false && this.state.CDTC_Status  == true) {
				Alert.alert( 'CostsFirst', 'Include TRID data?', [ {text: 'NO', onPress:this.onCallFuncSetPrintPDF.bind(this, 'TRID_Status', false, type)}, {text: 'YES', onPress: this.onCallFuncSetPrintPDF.bind(this, 'TRID_Status', true, type)}] );
			} else if(this.state.TRID_Status == false && this.state.CDTC_Status == false) {
				Alert.alert( 'CostsFirst', 'Include both TRID & CDTC data?', [ {text: 'NO', onPress:this.onCallFuncSetPrintPDF.bind(this, 'CDTC_TRID_Status', false, type)}, {text: 'YES', onPress: this.onCallFuncSetPrintPDF.bind(this, 'CDTC_TRID_Status', true, type)}] );		
			} else {
				this.printPDF(type);
			}
		}
	}

	onCallFuncSetPrintPDF(statusType, statusVal, type) {
		
		if(statusVal != false) {
			this.setState({
				[statusType] : statusVal
			});
		}

		if(type == "detailed"){
			pdfURL = GLOBAL.generate_pdf + '/' + this.state.languageType;
		}else if(type == "quick"){
			pdfURL = GLOBAL.generate_pdf_quick_buyer + '/' + this.state.languageType;
		}
		buyerData = this.getData();
		date = this.state.date;
		var split = date.split('-');
		date = Number(split[0])+'/'+Number(split[1])+'/'+Number(split[2]);
		buyerData = this.getData();
		buyerData.actionType = 'download';
		buyerData.estStlmtDate = date;
		buyerData.cdtcSetting 			= this.state.CDTC_Status;
		buyerData.tridSetting 			= this.state.TRID_Status;
		buyerData.bothCdtcTridSetting 	= this.state.CDTC_TRID_Status;
		buyerData.quote 				= this.state.escrowQuote;
		buyerData.ownersfee 			= this.state.ownerFee;
		buyerData.lendersfee 			= this.state.lenderFee;
		
		console.log("date issue onCallFuncSetPrintPDF " + JSON.stringify(buyerData));

		callPostApi(GLOBAL.BASE_URL + pdfURL, buyerData,this.state.access_token)
		.then((response) => {
			if(result.status == 'success'){
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
			}
		});
	}



	printLoanComparisonPDF() {
				if(this.state.sale_pr > 0){
					this.popupHide();
					this.setState({
						loadingText : 'Please wait...'
					});
				buyerData 	= 	{
				'rate'	: this.state.todaysInterestRate,
				'transactionDt' : this.state.date,
				'companyId' : this.state.company_id,
				'userId'	: this.state.user_id,
				'salesprice'	: this.state.sale_pr,
				'mainCompanyId'	: this.state.main_companyId,
				'zip'	: this.state.postal_code,
				'actionType' : ''
				}

				console.log("buyer recrd " + JSON.stringify(buyerData));
					

				this.setState({animating:'true'});
				callPostApi(GLOBAL.BASE_URL + GLOBAL.loan_comparison_pdf, buyerData,this.state.access_token)
				.then((response) => {
					console.log("pdf response " + JSON.stringify(result));
					if(result.status == 'success'){
						this.setState({animating:'true'});
						OpenFile.openDoc([{
							url:GLOBAL.BASE_URL + result.data,
							fileName:"sample",
							fileType:"pdf",
							cache: false,
							}], (error, url) => {
							if (error) {
								console.error("err in pdf " + JSON.stringify(error));
								this.setState({animating:'false', loadingText : 'Calculating'});
							} else {
								this.setState({animating:'false', loadingText : 'Calculating'});
								//console.log(url)
								console.error("url in pdf " + JSON.stringify(url));
							}
						})
					}
				});
			}else{
c
			}	
	}

	printLoanComparisonEmail() {
		if(this.state.sale_pr_calc == "" || this.state.sale_pr_calc == '0.00'){
			this.dropdown.alertWithType('error', 'Error', 'Please enter sales price.');
		}else{
			this.setState({popupType: "email", dropdownType: "loan_comparison"},this.setEmailModalVisible(!this.state.emailModalVisible));
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
				   
				  //	response {"message":"Video Uploaded","status":"success","data":"1523438561.mp4"}
				  console.log("response " + JSON.stringify(response));
  
				  this.setState({
					  videoNameEmail : response.data
				  });
					//{"message":"Video Uploaded","status":"success","data":"1523433546.mp4"}
					//alert(JSON.stringify(response));
					//console.log("image uploaded")
				}).catch(err => {
					this.setState({animating : 'false'});
				
					Alert.alert('', 'Error occured, please try again later.');	
					  console.log("err " + JSON.stringify(err));
					//alert(JSON.stringify(err));
					//console.log('error message')
				})
		  
			})
			.catch(err => {
				console.error(err);
				this.setState({animating : 'false'});
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
		  Alert.alert( 'CostsFirst', 'Do you want to attach this video.', [ {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')}, {text: 'OK', onPress: this.hideVideoModals.bind(this)}] );
				
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
  
  // Function for fetching and setting value of price based on month on prepaid page
	callUserAddressBook()
	{
		callPostApi(GLOBAL.BASE_URL + GLOBAL.user_address_book, {
		"user_id": this.state.user_id

		},this.state.access_token)
		.then((response) => {
			if(result.status == 'success'){
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
			}
		});
	}
	
	// function for sending email
	sendEmail(){
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

		if(this.state.invalidEmailStatus == true) {
			this.setState({
				invalidEmailStatus : false
			});
			Alert.alert('', 'Please enter valid email addresses with comma separated!');			
		} else {	
			if(this.state.dropdownType == 'loan_comparison') {
				this.setState({animating : 'true', loadingText : 'Please wait...'});
				buyerLoanComparisonData 	= 	{
					'rate'	: this.state.todaysInterestRate,
					'transactionDt' : this.state.date,
					'companyId' : this.state.company_id,
					'userId'	: this.state.user_id,
					'salesprice'	: this.state.sale_pr,
					'mainCompanyId'	: this.state.main_companyId,
					'zip'	: this.state.postal_code,
					'actionType' : 'email',
					'subject' : this.state.email_subject,
					'note' : this.state.content,
					'email' : this.state.to_email,
				}

				//console.log("loan comariopn recor " + JSON.stringify(buyerLoanComparisonData));
				callPostApi(GLOBAL.BASE_URL + GLOBAL.loan_comparison_pdf, buyerLoanComparisonData, this.state.access_token)
				.then((response) => {
					//console.log("loan comariopn response " + JSON.stringify(result));		
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
						//Alert.alert('', result.message);
						this.dropdown.alertWithType('error', 'Error', result.message);
					} else {
						this.setState({animating : 'false', loadingText : 'Calculating', dropdownType : ""});
						//Alert.alert('', 'Error occured, please try again later.');
						this.dropdown.alertWithType('error', 'Error', result.message);
					}
				});	
				
			} else if (this.state.dropdownType == "cdtc") {
				this.setState({animating : 'true', loadingText : 'Please wait...'});				
				date = this.state.date;
				var split = date.split('-');
				date = Number(split[0])+'/'+Number(split[1])+'/'+Number(split[2]);
				
				buyerCdtcData = {
					'loanPurpose'	: 'Purchase',
					'date' : date,
					'user_id'	: this.state.user_id,
					'actionType' : 'email',
					'subject' : this.state.email_subject,
					'note' : this.state.content,
					'email' : this.state.to_email,
				}

				console.log("cdtc recor request params " + JSON.stringify(buyerCdtcData));

				callPostApi(GLOBAL.BASE_URL + GLOBAL.buyer_cdtc_pdf, buyerCdtcData, this.state.access_token)
				.then((response) => {
					console.log("cdtc response " + JSON.stringify(result));
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
			} else if (this.state.dropdownType == "trid") {
				this.setState({animating : 'true', loadingText : 'Please wait...'});
			
				buyerTridData = {
					'quote'	: this.state.escrowQuote,
					'ownersfee' : this.state.ownerFee,
					'lendersfee' : this.state.lenderFee,
					'stateId'	: this.state.state,
					'user_id'	: this.state.user_id,
					'actionType' : 'email',
					'subject' : this.state.email_subject,
					'note' : this.state.content,
					'email' : this.state.to_email,
				}

				//console.log("trid recor " + JSON.stringify(buyerTridData));
				callPostApi(GLOBAL.BASE_URL + GLOBAL.buyer_trid_pdf, buyerTridData, this.state.access_token)
				.then((response) => {
					//console.log("trid response " + JSON.stringify(result));
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
						//Alert.alert('', 'Error occured, please try again later.');
						this.dropdown.alertWithType('error', 'Error', result.message);
					}
				});	
			} else if (this.state.dropdownType == 'owner_carry') {
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
				this.setState({animating : 'true', loadingText : 'Please wait...'});
				var buyer_email_service;
				date = this.state.date;
				var split = date.split('-');
				date = Number(split[0])+'/'+Number(split[1])+'/'+Number(split[2]);
				buyerData            			= this.getData();
				buyerData.email      			= this.state.to_email;
				buyerData.image      			= this.state.imageNameEmail;
				buyerData.video      			= this.state.videoNameEmail;
				buyerData.subject      			= this.state.email_subject;
				buyerData.estStlmtDate 			= date;
				buyerData.actionType 			= 'email';
				buyerData.note 					= this.state.content;
				buyerData.cdtcSetting 			= this.state.CDTC_Status;
				buyerData.tridSetting 			= this.state.TRID_Status;
				buyerData.bothCdtcTridSetting 	= this.state.CDTC_TRID_Status;
				buyerData.quote 				= this.state.escrowQuote;
				buyerData.ownersfee 			= this.state.ownerFee;
				buyerData.lendersfee 			= this.state.lenderFee;
				


				if(this.state.emailType == 'detailed') {
					buyer_email_service = GLOBAL.generate_pdf + '/' + this.state.languageType;
				} else {
					buyer_email_service = GLOBAL.generate_pdf_quick_buyer + '/' + this.state.languageType;
				}


				console.log("buyerData "  + JSON.stringify(buyerData));


				callPostApi(GLOBAL.BASE_URL + buyer_email_service, buyerData, this.state.access_token)
				.then((response) => {

					this.setState({
						to_email : ""
					});
					this.state.verified_email = result.email;
					this.setState({
						newEmailAddress : result.email
					});
					//console.log("response from server " + JSON.stringify(result));
					AsyncStorage.setItem("pdfFileName", result.data);
					AsyncStorage.setItem("calculator", "buyer");	
					//this.props.navigator.push({name: 'GoogleSigninExample', index: 0 });
					this.popupHideEmail();
					this.popupHide();
					AsyncStorage.removeItem("evernote");
					AsyncStorage.removeItem("dropbox");
					this.setEmailModalVisible(!this.state.emailModalVisible);
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

	getData(){
		buyerData 	= 	{
			'company_id'	: this.state.company_id,
			'user_id' : this.state.user_id,
			'preparedBy' : this.state.user_name,
			'preparedFor' : this.state.lendername,
			'address' : this.state.lender_address,
			'city' : this.state.city,
			'state' : this.state.user_state,
			'zip' : this.state.postal_code,
			'lendername' : this.state.lendername,
			'salePrice' : this.delimitNumbers(this.state.sale_pr_calc),
			'buyerLoanType' : this.state.tab,
			'conventionalLoanToValue_1Loan' : this.delimitNumbers(this.state.ltv),
			'conventionalInterestRate_2Loan' : this.delimitNumbers(this.state.todaysInterestRate1),
			'conventionalTermInYear_2Loan' : this.delimitNumbers(this.state.termsOfLoansinYears2),
			'conventionalLoanToValue_2Loan' : this.delimitNumbers(this.state.ltv2),
			'interestRate' : this.delimitNumbers(this.state.todaysInterestRate),
			'termInYears' : this.delimitNumbers(this.state.termsOfLoansinYears),
			'adjustable' : 'N',
			'adjustable2' : 'N',
			'interestRateCap' : this.delimitNumbers(this.state.interestRateCap),
			'interestRateCap_2Loan' : this.delimitNumbers(this.state.interestRateCap2),
			'perAdjustment' : this.state.perAdjustment,
			'perAdjustment_2Loan' : this.state.perAdjustment2,
			'amount' : this.delimitNumbers(this.state.loan_amt),
			'conventionalAmount2' : this.delimitNumbers(this.state.loan_amt2),
			'adjusted' : this.delimitNumbers(this.state.adjusted_loan_amt),
			'downPayment' : this.delimitNumbers(this.state.down_payment),
			'discount1' : this.delimitNumbers(this.state.disc),
			'discount2' : this.delimitNumbers(this.state.discAmt),
			'originationFee' : this.delimitNumbers(this.state.originationFee),
			'processingFee' : this.delimitNumbers(this.state.processingfee),
			'taxServiceContract' : this.delimitNumbers(this.state.taxservicecontract),
			'documentPreparation' : this.delimitNumbers(this.state.documentprep),
			'underwriting' : this.delimitNumbers(this.state.underwriting),
			'appraisal' : this.delimitNumbers(this.state.appraisalfee),
			'creditReport' : this.delimitNumbers(this.state.creditReport),
			'costLabel_1Value' : this.state.label1,
			'costType_1Value' : this.state.type1,
			'costFee_1Value' : this.delimitNumbers(this.state.fee1),
			'costTotalFee_1Value' : this.delimitNumbers(this.state.fee1),
			'costLabel_2Value' : this.state.label2,
			'costType_2Value' : this.state.type2,
			'costFee_2Value' : this.delimitNumbers(this.state.fee2),
			'costTotalFee_2Value' : this.delimitNumbers(this.state.fee2),
			'costLabel_3Value' : this.state.label3,
			'costType_3Value' : this.state.type3,
			'costFee_3Value' : this.delimitNumbers(this.state.fee3),
			'costTotalFee_3Value' : this.delimitNumbers(this.state.fee3),
			'costLabel_4Value' : this.state.label4,
			'costType_4Value' : this.state.type4,
			'costFee_4Value' : this.delimitNumbers(this.state.fee4),
			'costTotalFee_4Value' : this.delimitNumbers(this.state.fee4),
			'costLabel_5Value' : this.state.label5,
			'costType_5Value' : this.state.type5,
			'costFee_5Value' : this.delimitNumbers(this.state.fee5),
			'costTotalFee_5Value' : this.delimitNumbers(this.state.fee5),
			'costLabel_6Value' : this.state.label6,
			'costType_6Value' : this.state.type6,
			'costFee_6Value' : this.delimitNumbers(this.state.fee6),
			'costTotalFee_6Value' : this.delimitNumbers(this.state.fee6),
			'costLabel_7Value' : this.state.label7,
			'costType_7Value' : this.state.type7,
			'costFee_7Value' : this.delimitNumbers(this.state.fee7),
			'costTotalFee_7Value' : this.delimitNumbers(this.state.fee7),
			'costLabel_8Value' : this.state.label8,
			'costType_8Value' : this.state.type8,
			'costFee_8Value' : this.delimitNumbers(this.state.fee8),
			'costTotalFee_8Value' : this.delimitNumbers(this.state.fee8),
			'costLabel_9Value' : this.state.label9,
			'costType_9Value' : this.state.type9,
			'costFee_9Value' : this.delimitNumbers(this.state.fee9),
			'costTotalFee_9Value' : this.delimitNumbers(this.state.fee9),
			'costLabel_10Value' : this.state.label10,
			'costType_10Value' : this.state.type10,
			'costFee_10Value' : this.delimitNumbers(this.state.fee10),
			'costTotalFee_10Value' : this.delimitNumbers(this.state.fee10),
			'totalClosingCost' : this.delimitNumbers(this.state.totalClosingCost),
			'prepaidMonthTaxes1' : this.delimitNumbers(this.state.monTaxVal),
			'prepaidMonthTaxes2' : this.delimitNumbers(this.state.monTax),
			'prepaidMonthTaxes3' : this.delimitNumbers(this.state.prepaidMonthTaxes),
			'prepaidMonthInsurance1' : this.delimitNumbers(this.state.numberOfMonthsInsurancePrepaid),
			'prepaidMonthInsurance2' : this.delimitNumbers(this.state.monIns),
			'prepaidMonthInsurance3' : this.delimitNumbers(this.state.monthInsuranceRes),
			'daysInterest1' : this.delimitNumbers(this.state.numberOfDaysPerMonth),
			'daysInterest2' : this.delimitNumbers(this.state.daysInterest),
			'payorSelectorEscrow' : this.state.escrowType,
			'escrowOrSettlement' : this.delimitNumbers(this.state.escrowFee),
			'payorSelectorOwners' : this.state.ownersType,
			'ownersTitlePolicy' : this.delimitNumbers(this.state.ownerFee),
			'payorSelectorLenders' : this.state.lenderType,
			'lendersTitlePolicy' : this.delimitNumbers(this.state.lenderFee),
			'escrowFeeHiddenValue' : this.delimitNumbers(this.state.escrowFeeOrg),
			'lendersFeeHiddenValue' : this.delimitNumbers(this.state.lenderFeeOrg),
			'ownersFeeHiddenValue' : this.delimitNumbers(this.state.ownerFeeOrg),
			'principalAndInterest' : this.delimitNumbers(this.state.principalRate),
			'realEstateTaxes' : this.delimitNumbers(this.state.realEstateTaxesRes),
			'homeownerInsurance' : this.delimitNumbers(this.state.homeOwnerInsuranceRes),
			'paymentRate' : this.delimitNumbers(this.state.rateValue),
			'paymentMonthlyPmi' : this.delimitNumbers(this.state.monthlyRate),
			'twoMonthsPmi' : this.delimitNumbers(this.state.monthPmiVal),
			'prepaidCost' : this.delimitNumbers(this.state.twoMonthsPmi1),
			'prepaidAmount' : this.delimitNumbers(this.state.costOther),
			'totalPrepaidItems' : this.delimitNumbers(this.state.totalPrepaidItems),
			'paymentMonthlyExpense1' : this.delimitNumbers(this.state.monthlyExpensesOther1),
			'paymentAmount1' : this.delimitNumbers(this.state.paymentAmount1),
			'paymentMonthlyExpense2' : this.delimitNumbers(this.state.monthlyExpensesOther2),
			'paymentAmount2' : this.delimitNumbers(this.state.paymentAmount2),
			'totalMonthlyPayement' : this.delimitNumbers(this.state.totalMonthlyPayment),
			'estimatedTaxProrations' : this.delimitNumbers(this.state.estimatedTaxProrations),
			'totalInvestment' : this.delimitNumbers(this.state.totalInvestment),
			'countyId' : this.state.county,
			'stateId' : this.state.state,
			'noPmi' : this.state.nullVal,
			'financeMip' : this.state.nullVal,
			'financeFundingFee' : this.state.nullVal,
			'showApr' : this.state.nullVal,
			'mipFinanced' : this.state.nullVal,
			'fundingFeeFinanced1' : this.state.nullVal,
			'fundingFeeFinanced2' : this.state.nullVal,
			'estimatedClosingMonth' : this.state.nullVal,
			'annualPropertyTax' : this.delimitNumbers(this.state.annualPropertyTax),
			'summerPropertyTax' : this.state.nullVal,
			'winterPropertyTax' : this.state.nullVal,
			'titleInsuranceType' : 'N',
			'titleInsuranceShortRate' : this.state.nullVal,
			'newLoanServiceFee' : this.delimitNumbers(this.state.newLoanServiceFee),
			'fhaMip' : this.state.nullVal,
			'fundingFee' : this.state.nullVal,
			'pl2ndTD' : this.state.nullVal,
			'minimumCashIvestment' : this.state.nullVal,
			'mipFinancedHiddenValue' : this.state.nullVal,
			'RoundDownMIP' : this.state.nullVal,
			'countyTransferTax' : this.state.nullVal,
			'cityTransferTax' : this.state.nullVal,
			'reissueYearDD' : this.state.nullVal,
			'lowerTitlePolicy' : this.state.nullVal,
		};
		
		return buyerData;
	}


	// this is for updating empty fields to 0.00 on blur
	updateFormField (fieldVal, fieldName, functionCall, fieldNameFixed) {

		console.log("fieldNameFixed " + fieldNameFixed);

		if(this.state.count == 1) {	
			console.log("coming in if part for second time");
			fieldVal = this.removeCommas(fieldVal);
			if(fieldVal == '') {
				if(fieldName == 'sale_pr') {
					this.setState({
						[fieldName]: "",
					});
				} else if (fieldName == 'monTaxVal' || fieldName == 'numberOfMonthsInsurancePrepaid' || 
				fieldName == 'numberOfDaysPerMonth') {
					this.setState({
						[fieldName]: '0',
					});
				} else {					
					if(fieldNameFixed != 'undefined' || fieldNameFixed != undefined) {
						this.setState({
							[fieldName]: '0.00',
							[fieldNameFixed] : true
						},functionCall);						
					} else {
						this.setState({
							[fieldName]: '0.00',
						},functionCall);
					}
				}
			} else if(fieldVal != '') {
				if(fieldVal=='') {
					if(fieldName == 'sale_pr') {
						processedData = '';
					} else if (fieldName == 'monTaxVal'  || fieldName == 'numberOfMonthsInsurancePrepaid' || 
					fieldName == 'numberOfDaysPerMonth') {
						processedData = '0';
					} else {
						processedData = '0.00';
					}
				} else {
					if(fieldName == 'todaysInterestRate1' ||
					fieldName == 'todaysInterestRate') {
						processedData = parseFloat(fieldVal).toFixed(4);	
					} else if (fieldName == 'monTaxVal'  || fieldName == 'numberOfMonthsInsurancePrepaid' || 
					fieldName == 'numberOfDaysPerMonth') {
						processedData = parseFloat(fieldVal);	
					} else {
						processedData = parseFloat(fieldVal).toFixed(2);
					}
				}
				processedData = processedData.toLocaleString('en');
				if(processedData == "" || processedData == "undefined" || processedData == "0.00" || processedData == undefined) {

					if (fieldName == 'monTaxVal'  || fieldName == 'numberOfMonthsInsurancePrepaid' || 
					fieldName == 'numberOfDaysPerMonth') {
						if(fieldNameFixed != 'undefined' || fieldNameFixed != undefined) {
							this.setState({
								[fieldName]: '0',
								[fieldNameFixed] : true
							},functionCall);						
						} else {
							this.setState({
								[fieldName]: '0',
							},functionCall);
						}
					} else {
						if(fieldNameFixed != 'undefined' || fieldNameFixed != undefined) {
							this.setState({
								[fieldName]: '0.00',
								[fieldNameFixed] : true
							},functionCall);						
						} else {
							this.setState({
								[fieldName]: '0.00',
							},functionCall);
						}
					}	
				} else {
					if(fieldNameFixed != 'undefined' || fieldNameFixed != undefined) {
						this.setState({
							[fieldName]: processedData,
							[fieldNameFixed] : true
						},functionCall)						
					} else {
						this.setState({
							[fieldName]: processedData,
						},functionCall)					
					}
				}
			}
			this.state.count = 0;	
		} else {
			console.log("coming in else part for first time");
			if (fieldName == 'monTaxVal'  || fieldName == 'numberOfMonthsInsurancePrepaid' || 
			fieldName == 'numberOfDaysPerMonth') {
				this.setState({
					[fieldName]: '0',
				});
			} else {
				this.setState({
					[fieldName]: '0.00',
				});
			}
			this.state.count++;
		}	
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
	
	// this is for updating empty fields to 0.00 on blur
	onFocus (fieldName, viewHeight) {
		if((fieldName == 'lendername' || fieldName == 'sale_pr') && this.state.speakToTextVal && !this.state.TextInput) {
			if( this.state.speakToTextVal && !this.state.TextInput){
				
				this.setState({
					speakToTextStatus : true
				});

				if(fieldName == 'lendername'){
					Alert.alert(
						'Speak Value',
						'Would you like to speak value',
						[
							{text: 'Yes', onPress: () => this._startRecognizing(fieldName) , style: 'cancel'},
							{text: 'No', onPress: () => this.stopSpeakToText('lendername')}
						],
						{ cancelable: false }
					)
				}else{
					Alert.alert(
						'Speak Value',
						'Would you like to speak value',
						[
							{text: 'Yes', onPress: () => this._startRecognizing(fieldName) , style: 'cancel'},
							{text: 'No', onPress: () => this.stopSpeakToText('sale_pr')}
						],
						{ cancelable: false }
					)
				}
			} else {
				this.setState({
					speakToTextStatus : false
				});
			}
		}
		
		this.refs.scrollView1.scrollTo({y:viewHeight});
		if(fieldName == 'lendername') {
			this.setState({
				[fieldName]: '',
			}) 
		}

		if(fieldName == 'lender_address') {
			this.setState({
				enterAddressBar : true
			});

			//this.props.navigator.push({name: 'GooglePlaceAutoComplete', index: 0 });
		} else {
			fieldVal = this.state[fieldName];
			if(fieldVal != "") {
				this.setState({
					defaultVal: fieldVal,
				})
			}
			this.setState({
				enterAddressBar : false
			});
			 this.setState({
				[fieldName]: '',
			}) 
		}	
	}	
	
	// this is for updating empty fields to 0.00 on blur
	updatePostalCode (fieldVal, fieldName) {
		this.setState({animating:'true'});
		processedData = fieldVal;
		callPostApi(GLOBAL.BASE_URL + GLOBAL.get_city_state_for_zip, {
		"zip": processedData

		},this.state.access_token)
		.then((response) => {
			zipRes = result;
			if(zipRes.status == 'fail') {
				if(this.state.sale_pr > 0){
					this.dropdown.alertWithType('error', 'Error', zipRes.message);
				}
				this.setState({animating:'false'});
			}else if(zipRes.data.state_name != null || zipRes.data.state_name != 'NULL'){
				callPostApi(GLOBAL.BASE_URL + GLOBAL.title_escrow_type, {
				"companyId": zipRes.data.company_id
				}, this.state.access_token)
				.then((response) => {
					if(this.state.sale_pr == '0.00' || this.state.sale_pr == ''){
						this.setState({
							[fieldName]: processedData,
							city: zipRes.data.city,
							state: zipRes.data.state_id,
							state_name: zipRes.data.state_name,
							user_state: zipRes.data.state_code,
							user_county: zipRes.data.county_name,
							county: zipRes.data.county_id,
							company_id_new_zip: zipRes.data.company_id,
							ownerPolicyType: result.data.ownerType,
							escrowPolicyType: result.data.escrowType,
							lenderPolicyType: result.data.lenderType,
						},this.callClosingCostSettingApi);

						console.log("escrowPolicyType 4 " + this.state.escrowPolicyType);

					}else{
						this.setState({
							[fieldName]: processedData,
							city: zipRes.data.city,
							state: zipRes.data.state_id,
							state_name: zipRes.data.state_name,
							user_state: zipRes.data.state_code,
							user_county: zipRes.data.county_name,
							county: zipRes.data.county_id,
							company_id_new_zip: zipRes.data.company_id,
							ownerPolicyType: result.data.ownerType,
							escrowPolicyType: result.data.escrowType,
							lenderPolicyType: result.data.lenderType,
						},this.callClosingCostSettingApi);

						console.log("escrowPolicyType 5" + this.state.escrowPolicyType);
					}	
				});
			}
		});	
	}

	onSelectionsChange = (selectedAddresses) => {
			var i=1;
			to_email = "";
			for (let resObj of selectedAddresses) {
				if(i==1){
					to_email = resObj.value;
				}else{
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
		//this.setState({to_email: this.state.to_email + ", " + to_email});
		this.setState({ selectedAddresses })
	}
	state = { selectedAddresses: [] }
	
	downPaymentChange(downPayment){
		downPayment = this.removeCommas(downPayment);

		//this.removeCommas(this.state.sale_pr);
		
		if(downPayment == ""){
			downPayment = '0.00';
		}
		if(this.state.loan_amt2 > 0){
			loan = (parseFloat(this.state.sale_pr) - parseFloat(downPayment) - parseFloat(this.state.loan_amt2)).toFixed(2);

			this.state.loan_amt = loan;
			console.log("if this.state.loan_amt downPaymentChange " + this.state.loan_amt);
			//this.amount         = this.salesprice - this.downPayment - this.amount2;
		} else {

			loan = (parseFloat(this.state.sale_pr) - parseFloat(downPayment)).toFixed(2);
			this.state.loan_amt = loan;
			console.log("else this.state.loan_amt downPaymentChange " + this.state.loan_amt);
		}

		// commented by lovedeep 
		/*resaleConventionalLoanLTV  = this.state.loan_amt / this.state.sale_pr *100 ;
		resaleConventionalLoanLTV  = parseFloat(resaleConventionalLoanLTV).toFixed(2);
		this.setState({downPaymentHidden: downPayment,downPaymentFixed: true,ltv: resaleConventionalLoanLTV},this.callSalesPr);*/

		console.log("this.state.ltv 5 " + this.state.ltv);

		// added by lovedeep
		request = {'salePrice': this.state.sale_pr_calc,'LTV': this.state.ltv, 'LTV2': this.state.ltv2, 'dp_request':downPayment};

		console.log("request getAmountConventional " + JSON.stringify(request));	


		conv_amt = getAmountConventional(request);

		console.log("conv_amt response getAmountConventional " + JSON.stringify(conv_amt));	

		resaleConventionalLoanLTV    = conv_amt.ltv1;

		console.log("this.state.ltv 4 " + resaleConventionalLoanLTV);
		this.setState({ltv: resaleConventionalLoanLTV, downPaymentHidden: downPayment, downPaymentFixed: true}, this.callSalesPr);
		//creating object for origination fee and amount
	}
	
	handleEventForGraphList(eventName){
		this.setState({eventForGraphList: eventName});
	}
	
render(){
	
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
		if(this.state.connectionInfo != 'none' && this.state.openMessagePopup == false) {
		showable=<View style={BuyerStyle.TopContainer}>
		<View style={BuyerStyle.iphonexHeader}></View>
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
		<View style={BuyerStyle.outerContainer}>
			<View style={{ flex: 1 }}>
				<Spinner visible={this.state.visble} textContent={this.state.loadingText} textStyle={{color: '#FFF'}} />
			</View>	
			<View style={BuyerStyle.HeaderContainer}>
				<Image style={BuyerStyle.HeaderBackground} source={Images.header_background}></Image>
				<TouchableOpacity style={{width:'20%'}} onPress={this.onBackHomePress.bind(this)}>
					<Image style={BuyerStyle.back_icon} source={Images.back_icon}/>
				</TouchableOpacity>
				<Text style={BuyerStyle.header_title}>{STRINGS.t('Buyer_Closing_Cost')}</Text>
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
							containerStyle={{  height: 120,width:60 }}
							dropdownPosition={1}
							itemColor="rgba(0, 0, 0, .87)"
							pickerStyle={{
							width: 200,
							height: 300,
							left: null,
							right: 0,
							marginRight: 8,
							marginTop: 70
							}}
					  />
				</View>	 
			</View>
			{renderIf(this.state.footer_tab == 'buyer')(
				<View style={{height:'100%',width:'100%'}}>
					<View style={BuyerStyle.headerwrapper} >
						<View style={BuyerStyle.subHeaderNewDesign}>
							<View style={{paddingRight:10,paddingLeft:10,paddingTop:10,flexDirection: 'row'}}>
								<View style={{width:'48%'}}>
									<TextInput style={BuyerStyle.headerTextInputField} selectTextOnFocus={ true } autoCapitalize = 'words' underlineColorAndroid='transparent' onChangeText={(value) => this.setState({lendername: value})} value={this.state.lendername.toString()}
									ref='lendername'
									onFocus={() => this.onFocus('lendername')} onBlur={() => this.onBlur("lendername")}
									/>
								</View>
								<View style={{width:'48%',marginLeft:'4%'}}>
								{this.state.speakToTextVal && !this.state.TextInput ?
									<CustomTextInput customKeyboardType="hello" allowFontScaling={false} selectTextOnFocus={ true } name={this.state.speakToTextStatus} underlineColorAndroid = 'transparent' style={BuyerStyle.headerTextInputField} onKeyPress={() => this.onFocus('sale_pr')} onChangeText={(value) => this.setState({sale_pr: this.onChange(value)})} 
									
									onEndEditing={ (event) => this.updateFormField(this.state.sale_pr,'sale_pr', this.onChangeRate.bind(this,this.state.sale_pr,"sale_pr")) }
									
									
									placeholder='Sale Price'
									ref='sale_pr'
									value={ this.state.sale_pr == '0.00' ? this.state.sale_pr_empty : this.delimitNumbers(this.state.sale_pr) }
									
									/>
									:
									<CustomTextInput customKeyboardType="hello" allowFontScaling={false} selectTextOnFocus={ true } name={this.state.speakToTextStatus} underlineColorAndroid = 'transparent' style={BuyerStyle.headerTextInputField} onKeyPress={() => this.onFocus('sale_pr')} onChangeText={(value) => this.setState({sale_pr: this.onChange(value)})} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'sale_pr', this.onChangeRate.bind(this,event.nativeEvent.text,"sale_pr")) } 
									placeholder='Sale Price'
									ref='sale_pr'
									value={ this.state.sale_pr == '0.00' ? this.state.sale_pr_empty : this.delimitNumbers(this.state.sale_pr) }
									
									/>
								}
								</View>
							</View>
							<View style={[BuyerStyle.scrollable_container_child,{paddingRight:10,paddingLeft:10,paddingTop:5}]}>
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
							
                			<View style={{flexDirection: 'row',zIndex: -1, paddingRight:10,paddingLeft:10,paddingTop:5}}>
								<View style={{width:'48%'}}>
									<TextInput selectTextOnFocus={ true } style={BuyerStyle.headerTextInputField} placeholder='State' underlineColorAndroid='transparent' onChangeText={(value) => this.setState({state_code: this.onChange(value)})} value={this.state.state_code}/>
								</View>
								<View style={{width:'48%',marginLeft:'4%'}}>
									<TextInput selectTextOnFocus={ true } style={BuyerStyle.headerTextInputField} placeholder='Zip Code' underlineColorAndroid='transparent' onChangeText={(value) => this.setState({postal_code: this.onChange(value)})} onEndEditing={ (event) => this.updatePostalCode(event.nativeEvent.text,'postal_code') } value={this.state.postal_code.toString()}/>
								</View>
							</View>
							
                			<View style={[BuyerStyle.segmentViewNewDesign,{paddingRight:10,paddingLeft:10, zIndex :-1}]}>
								<View style={[BuyerStyle.segmentButtonBackgroundView,(this.state.tab == 'FHA') ? {backgroundColor:'#000000'}:{}]}>
									<TouchableOpacity style={BuyerStyle.segmentButtonNewDesign} onPress={() => this.settingsApi("FHA")}>
									<Text style={BuyerStyle.style_btnTextNewDesign}>{STRINGS.t('FHA')}</Text>
									</TouchableOpacity>
								</View>

								<View style={BuyerStyle.verticalLineForSegmentNewDesign}></View>

								<View style={[BuyerStyle.segmentButtonBackgroundView,(this.state.tab == 'VA') ? {backgroundColor:'#000000'}:{}]}>
									<TouchableOpacity style={BuyerStyle.segmentButtonNewDesign} onPress={() => this.settingsApi("VA")}>
									<Text style={BuyerStyle.style_btnTextNewDesign}>{STRINGS.t('VA')}</Text>
									</TouchableOpacity>
								</View>

								<View style={BuyerStyle.verticalLineForSegmentNewDesign}></View>

								<View style={[BuyerStyle.segmentButtonBackgroundView,(this.state.tab == 'USDA') ? {backgroundColor:'#000000'}:{}]}>
									<TouchableOpacity style={BuyerStyle.segmentButtonNewDesign} onPress={() => this.settingsApi("USDA")}>
									<Text style={BuyerStyle.style_btnTextNewDesign}>{STRINGS.t('USDA')}</Text>
									</TouchableOpacity>
								</View>

								<View style={BuyerStyle.verticalLineForSegmentNewDesign}></View>

								<View style={[BuyerStyle.segmentButtonBackgroundView,(this.state.tab == 'CONV') ? {backgroundColor:'#000000'}:{}]}>
									<TouchableOpacity style={BuyerStyle.segmentButtonNewDesign} onPress={() => this.settingsApi("CONV")}>
									<Text style={BuyerStyle.style_btnTextNewDesign}>{STRINGS.t('Conv')}</Text>
									</TouchableOpacity>
								</View>

								<View style={BuyerStyle.verticalLineForSegmentNewDesign}></View>
								<View style={[BuyerStyle.segmentButtonBackgroundView,(this.state.tab == 'CASH') ? {backgroundColor:'#000000'}:{}]}>
									<TouchableOpacity style={BuyerStyle.segmentButtonNewDesign} onPress={() => this.settingsApi("CASH")}>
									<Text style={BuyerStyle.style_btnTextNewDesign}>{STRINGS.t('Cash')}</Text>
									</TouchableOpacity>
								</View>
								<View style={BuyerStyle.verticalLineForSegmentNewDesign}></View>
								<View style={[BuyerStyle.segmentButtonBackgroundView,(this.state.tab == 'Owner_Carry') ? {backgroundColor:'#000000'}:{}]}>
									<TouchableOpacity style={BuyerStyle.segmentButtonNewDesign} onPress={() => this.settingsApi("Owner_Carry")}>
									<Text style={BuyerStyle.style_btnTextNewDesign}>{STRINGS.t('Owner_Carry')}</Text>
									</TouchableOpacity>
								</View>
							</View>
							
                			<View style={[BuyerStyle.segmentContainerNewDesign,{flexDirection:'row',paddingRight:10,paddingLeft:10,marginTop:5, zIndex : -1}]}>
								<View style={[BuyerStyle.subHeaderNewDesignSubPart,{width:'100%',backgroundColor: '#000000',paddingTop:5}]}>
								<View style={{flexDirection: 'row'}}>
									<View style={{width:'55%'}}>
										<Text style={{color:"#0598c9",fontSize: 15,fontWeight: 'bold'}}>
											{STRINGS.t('total_monthly_payment')}
										</Text>
									</View>
									<View>
										<Text style={{color:"#0598c9",fontSize: 15,fontWeight: 'bold', marginLeft : 3}}>
										  /
										</Text>
									</View>
									<View style={{width:'45%',marginLeft:'2%'}}>
										<Text style={{color:"#0598c9",fontSize: 15,fontWeight: 'bold'}}>
											{STRINGS.t('total_investment')}
										</Text>
									</View>
								</View>
								
								<View style={{flexDirection: 'row',marginTop: 5}}>
									<View style={{width:'48%'}}>
										<View style={{flexDirection: 'row'}}>
											<Text style={{color:"#0598c9",margin:4, marginTop : 5, fontSize: 15,fontWeight: 'bold',}}>
												$
											</Text>
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true } keyboardType="numeric" style={[BuyerStyle.subHeaderTotalCalcTextInputField,{width:'90%',color:"#0598c9"}]} onKeyPress={() => this.onFocus('totalMonthlyPayment')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'totalMonthlyPayment', this.onChangetotalMonthlyPayment.bind(this,event.nativeEvent.text)) } onChangeText={(value) => this.setState({totalMonthlyPayment: this.onChange(value)})} value={this.delimitNumbers(this.state.totalMonthlyPayment)}  underlineColorAndroid='transparent'/>
										</View>
									</View>
									<View style={{width:'48%',marginLeft:'2%'}}>
										<View style={{flexDirection: 'row'}}>
											<Text style={{color:"#0598c9",margin:4, marginTop : 5, fontSize: 15,fontWeight: 'bold',}}>
												$
											</Text>
											
											{this.state.totalInvestment < 0 ? 
												<TextInput selectTextOnFocus={ true } keyboardType="numeric" style={[BuyerStyle.subHeaderTotalCalcTextInputField,{width:'90%',color:"#CB2416"}]} editable= {false} value={this.delimitNumbers(this.state.totalInvestment)}  underlineColorAndroid='transparent'/>												
												:
												<TextInput selectTextOnFocus={ true } keyboardType="numeric" style={[BuyerStyle.subHeaderTotalCalcTextInputField,{width:'90%',color:"#0598c9"}]} editable= {false} value={this.delimitNumbers(this.state.totalInvestment)}  underlineColorAndroid='transparent'/>	
												
												}
										</View>
									</View>
								</View>
							</View>
						</View>
						</View>
					</View>
					<View style={(this.state.initialOrientation == 'portrait') ? ((this.state.orientation == 'portrait') ? BuyerStyle.scrollviewheight : BuyerStyle.scrollviewheightlandscape): ((this.state.orientation == 'landscape') ? BuyerStyle.scrollviewheight : BuyerStyle.scrollviewheightlandscape)}>
						<ScrollView
							showsVerticalScrollIndicator={true}
							keyboardShouldPersistTaps="always"
							//keyboardDismissMode='on-drag'
							ref="scrollView1"
							onTouchStart={this._onMomentumScrollEnd}
							style={BuyerStyle.sellerscrollview}
						>    

							{renderIf(this.state.tab == 'Owner_Carry')(
								<View style={[BuyerStyle.loandetailhead,{paddingLeft:10, paddingRight:10}]}>
								<View style={{justifyContent: 'center', width:'30%'}}>
									<Text style={BuyerStyle.text_style}>Name of Lender</Text>
								</View>
								<View style={{width:'70%',justifyContent:'center', marginRight : 7}}>
									<View style={[BuyerStyle.alignrightinput, {borderWidth:1,	borderColor:'#000',  borderRadius: 4}]}>
										<TextInput style={{height: 30, width:'100%', borderWidth: 1, borderRadius: 4, backgroundColor: '#F5FCFF', padding: -5, paddingLeft:3, borderColor:'transparent'}} selectTextOnFocus={ true } autoCapitalize = 'words' underlineColorAndroid='transparent' onChangeText={(value) => this.setState({oc_lender_name: value})} value={this.state.oc_lender_name.toString()}
									ref='oc_lender_name'
									onFocus={() => this.onFocus('oc_lender_name')} onBlur={() => this.onBlur("oc_lender_name")}
									/>
									</View>
								</View>
							</View>  
							)}
													

							{renderIf(this.state.tab != 'CASH')(	
								<View style={BuyerStyle.loanstopaybox}>
									<View style={BuyerStyle.headerloanratio}>
									{renderIf(this.state.tab == 'CONV')(
										<Text style={BuyerStyle.headerloanratiotext}>
											{STRINGS.t('1_loan')}
										</Text>
									)}
									{renderIf(this.state.tab == 'CONV')(
										<Text style={BuyerStyle.headerloanratiotext}>
											{STRINGS.t('2_loan')}
										</Text>
									)}
									</View>
								</View>
							)}
							

							{renderIf(this.state.tab == 'Owner_Carry')(
								<View style={BuyerStyle.loandetailhead} onLayout={(event) => this.measureView(event,'ltvHeight')}>
									<View style={BuyerStyle.existingfirstOwnerCarry}>
										<Text style={{marginLeft:'5%', marginTop : 8, color:"#404040",fontFamily:'roboto-regular',fontSize:16,}}>Owner Carry</Text>
									</View>
									<View style={[BuyerStyle.existingfirstbalanceOwnerCarry]}>
											<CheckBox right={false} uncheckedColor="#3b90c4" containerStyle={{ backgroundColor:'#ffffff', borderWidth:0}} checkedColor='#3b90c4' checked={this.state.isCheckForFirstLoan} 
											onPress={this.handlePressCheckedBoxFirstLoan}
											/>
									</View>
									<View style={[BuyerStyle.existingfirstbalanceOwnerCarryText]}>
										<Text style={BuyerStyle.headerloanratiotextOwnerCarry}>
												{STRINGS.t('1_loan')}
											</Text>
										</View>	
									<View style={[BuyerStyle.existingfirstbalanceOwnerCarry]}>
										<CheckBox right={false} uncheckedColor="#3b90c4" containerStyle={{ backgroundColor:'#ffffff', borderWidth:0}} checkedColor='#3b90c4' checked={this.state.isCheckForSecondLoan} 
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
							
							{renderIf((this.state.tab != 'CASH' && this.state.tab != 'Owner_Carry') || (this.state.tab == 'Owner_Carry' && (this.state.firstLoanOwnerCarry == true || this.state.secondLoanOwnerCarry == true)))(
								<View style={BuyerStyle.loandetailhead} onLayout={(event) => this.measureView(event,'ltvHeight')}>
									<View style={BuyerStyle.existingfirst}>
										<Text style={BuyerStyle.existingheadtext}>{STRINGS.t('ltv')}</Text>
									</View>
									<View style={BuyerStyle.existingfirstbalance}>
										<View style={{width:'100%',flexDirection:'row'}}>
											<Text style={BuyerStyle.existingtext}>%</Text>
											<CustomTextInput customKeyboardType="hello" allowFontScaling={false} ref='ltv' selectTextOnFocus={ true } keyboardType="numeric" returnKeyType ="next" style={[BuyerStyle.width70,{alignSelf:'center'}]} underlineColorAndroid='transparent'  onKeyPress={() => this.onFocus('ltv',this.state.ltvHeight)} onChangeText={(value) => this.setState({ltv: this.onChange(value)})} 
											onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'ltv', this.onChangeRate.bind(this,event.nativeEvent.text,"ltv")) } 
											value={this.delimitNumbers(this.state.ltv)} />
										</View>
										<View style={BuyerStyle.textboxunderline}>
											<View style={[BuyerStyle.fullunderline, ]}></View>
										</View>
									</View>
									<View style={BuyerStyle.existingfirstbalance}>
										<View style={{width:'100%',flexDirection:'row'}}>
											<Text style={BuyerStyle.existingtext}>%</Text>
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true } 
												keyboardType="numeric" 
												returnKeyType ="next" 
												style={[BuyerStyle.width70,{alignSelf:'center'}]} 
												underlineColorAndroid='transparent' 
												ref='ltv2'
												onKeyPress={() => this.onFocus('ltv2',this.state.ltvHeight)}
												onChangeText={(value) => this.setState({ltv2: this.onChange(value)})} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'ltv2', this.onChangeRate.bind(this,event.nativeEvent.text,"ltv2")) }
												value={this.delimitNumbers(this.state.ltv2)} 
											/>
										</View>
										<View style={BuyerStyle.textboxunderline}>
											<View style={[BuyerStyle.fullunderline, ]}></View>
										</View>
									</View>
								</View>
							)}



							{renderIf((this.state.tab != 'CASH' && this.state.tab != 'Owner_Carry') || (this.state.tab == 'Owner_Carry' && (this.state.firstLoanOwnerCarry == true || this.state.secondLoanOwnerCarry == true)))(
								<View style={BuyerStyle.loandetailhead} onLayout={(event) => this.measureView(event,'rateHeight')}>
									<View style={BuyerStyle.existingfirst}>
										<Text style={BuyerStyle.existingheadtext}>{STRINGS.t('rate')}</Text>
									</View>
									<View style={BuyerStyle.existingfirstbalance}>
										<View style={{width:'100%',flexDirection:'row'}}>
										<Text style={BuyerStyle.existingtext}>%</Text>
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true } 
												returnKeyType ="next" style={[BuyerStyle.width70,{alignSelf:'center'}]} 
												underlineColorAndroid='transparent'  
												onKeyPress={() => this.onFocus('todaysInterestRate',this.state.rateHeight)} 
												ref='todaysInterestRate'
												onChangeText={(value) => this.setState({todaysInterestRate: this.onChange(value),todaysInterestRateFixed: true})} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'todaysInterestRate', this.callSalesPr) }
												value={this.delimitNumbers(this.state.todaysInterestRate)} 
											/>
										</View>
										<View style={BuyerStyle.textboxunderline}>
											<View style={[BuyerStyle.fullunderline, ]}></View>
										</View>
									</View>
									{(((this.state.ltv2 > 0 && this.state.tab == 'CONV') || (this.state.tab == 'Owner_Carry' && this.state.secondLoanOwnerCarry == true))) ?
									<View style={BuyerStyle.existingfirstbalance}>
									
										<View style={{width:'100%',flexDirection:'row'}}>
										<Text style={BuyerStyle.existingtext}>%</Text>
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true } 
												editable= {(this.state.ltv2 > 0) ? true : false} 
												returnKeyType ="next" 
												style={[BuyerStyle.width70,{alignSelf:'center'}]} 
												underlineColorAndroid='transparent'
												onKeyPress={() => this.onFocus('todaysInterestRate1',this.state.rateHeight)}
												ref='todaysInterestRate1'
												onChangeText={(value) => this.setState({todaysInterestRate1: this.onChange(value)})} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'todaysInterestRate1', this.callSalesPr) }
												value={this.delimitNumbers(this.state.todaysInterestRate1)} 
											/>
										</View>
										<View style={BuyerStyle.textboxunderline}>
											<View style={[BuyerStyle.fullunderline, ]}></View>
										</View>
										
									</View>
									: false} 	
								</View>
								
							)}	
							{renderIf((this.state.tab != 'CASH' && this.state.tab != 'Owner_Carry') || (this.state.tab == 'Owner_Carry' && (this.state.firstLoanOwnerCarry == true || this.state.secondLoanOwnerCarry == true)))(
								<View style={BuyerStyle.loandetailhead} onLayout={(event) => this.measureView(event,'termHeight')}>
									<View style={BuyerStyle.existingfirst}>
										<Text style={BuyerStyle.existingheadtext}>{STRINGS.t('term')}</Text>
									</View>
									<View style={BuyerStyle.existingfirstbalance}>
										<View style={{width:'100%',flexDirection:'row'}}>
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true } returnKeyType ="next" style={[BuyerStyle.width70,{alignSelf:'center'}]} 
											ref="termsOfLoansinYears"
												underlineColorAndroid='transparent'  
												onKeyPress={() => this.onFocus('termsOfLoansinYears',this.state.termHeight)} 
												onChangeText={(value) => this.setState({termsOfLoansinYears: this.onChange(value)})} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'termsOfLoansinYears', this.callSalesPr) }
												value={this.delimitNumbers(this.state.termsOfLoansinYears)}
											/>
										</View>
										<View style={BuyerStyle.textboxunderline}>
											<View style={[BuyerStyle.fullunderline, ]}></View>
										</View>
									</View>
									{(((this.state.ltv2 > 0 && this.state.tab == 'CONV') || (this.state.tab == 'Owner_Carry' && this.state.secondLoanOwnerCarry == true))) ?
									<View style={BuyerStyle.existingfirstbalance}>
										<View style={{width:'100%',flexDirection:'row'}}>
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true }	returnKeyType ="next" 
											    ref="termsOfLoansinYears2"
												editable= {(this.state.ltv2 > 0) ? true : false} 
												style={[BuyerStyle.width70,{alignSelf:'center'}]} 
												underlineColorAndroid='transparent'  
												onKeyPress={() => this.onFocus('termsOfLoansinYears2',this.state.termHeight)} 
												onChangeText={(value) => this.setState({termsOfLoansinYears2: this.onChange(value)})} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'termsOfLoansinYears2', this.callSalesPr) }
												value={this.delimitNumbers(this.state.termsOfLoansinYears2)}
											/>
										</View>
										<View style={BuyerStyle.textboxunderline}>
											<View style={[BuyerStyle.fullunderline, ]}></View>
										</View>
									</View>
									: false} 	
								</View>
							)}

							{renderIf(this.state.tab == 'Owner_Carry')(
								<View style={BuyerStyle.loandetailhead} onLayout={(event) => this.measureView(event,'dueInYear1Height')}>
								{renderIf(this.state.firstLoanOwnerCarry == true || this.state.secondLoanOwnerCarry == true)(
									<View style={BuyerStyle.existingfirst}>
										<Text style={BuyerStyle.existingheadtext}>All Due Year</Text>
									</View>
								)}
									{renderIf(this.state.firstLoanOwnerCarry == true)(
									<View style={BuyerStyle.existingfirstbalance}>
										<View style={{width:'100%',flexDirection:'row'}}>
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true } returnKeyType ="next" style={[BuyerStyle.width70,{alignSelf:'center'}]} 
											ref="due_in_year1"
												underlineColorAndroid='transparent'  
												onKeyPress={() => this.onFocus('due_in_year1',this.state.termHeight)} 
												onChangeText={(value) => this.setState({due_in_year1: this.onChange(value)})} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'due_in_year1') }
												value={this.delimitNumbers(this.state.due_in_year1)}
											/>
										</View>
										<View style={BuyerStyle.textboxunderline}>
											<View style={[BuyerStyle.fullunderline, ]}></View>
										</View>
									</View>
									)}
									{renderIf(this.state.firstLoanOwnerCarry == false && this.state.secondLoanOwnerCarry == true)(
									<View style={BuyerStyle.existingfirstbalance}></View>
									)}
									{(((this.state.ltv2 > 0 && this.state.tab == 'CONV') || (this.state.tab == 'Owner_Carry' && this.state.secondLoanOwnerCarry == true))) ?
									<View style={BuyerStyle.existingfirstbalance}>
										<View style={{width:'100%',flexDirection:'row'}}>
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true }	returnKeyType ="next" 
											    ref="due_in_year2"
												editable= {(this.state.ltv2 > 0) ? true : false} 
												style={[BuyerStyle.width70,{alignSelf:'center'}]} 
												underlineColorAndroid='transparent'  
												onKeyPress={() => this.onFocus('due_in_year2',this.state.termHeight)} 
												onChangeText={(value) => this.setState({due_in_year2: this.onChange(value)})} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'due_in_year2') }
												value={this.delimitNumbers(this.state.due_in_year2)}
											/>
										</View>
										<View style={BuyerStyle.textboxunderline}>
											<View style={[BuyerStyle.fullunderline, ]}></View>
										</View>
									</View>
									: false} 	
								</View>
							)}





							{renderIf(this.state.tab == 'VA' || this.state.tab == 'FHA' || this.state.tab == 'USDA')(
								<View>
									<View style={[BuyerStyle.textViewContainer, {paddingTop:10}]}>
										<Text style={[BuyerStyle.schollheadtext,{marginLeft:'5%',width:'60%', textAlign:'left'}]}>{STRINGS.t('base_loan_amount')}  </Text>
										<Text style={[BuyerStyle.schollheadtext,{width:'40%'}]} >{'$ ' +this.delimitNumbers(parseFloat(this.state.base_loan_amt).toFixed(2))}  </Text>
										
										{/*
										<TextInput  selectTextOnFocus={ true } style={[BuyerStyle.schollheadtext,{width:'55%'}]} value={'$ '+this.delimitNumbers(parseFloat(this.state.base_loan_amt).toFixed(2))}  underlineColorAndroid='transparent'/>
										*/}	

									</View>
								</View>
							)}	
							{renderIf(this.state.tab == 'CONV')(	
								<View onLayout={(event) => this.measureView(event,'loanAmountHeight')}>
									<View style={[BuyerStyle.fullunderline, {marginTop:10}]}></View>
									<View style={[BuyerStyle.loandetailhead,{marginTop:10}]}>
										<View style={BuyerStyle.existingfirstLoanAmount}>
											<Text style={[BuyerStyle.loanstext,{marginTop:0,marginLeft:10}]}>{STRINGS.t('loan_amount')}</Text>
										</View>
										<View style={BuyerStyle.existingfirstbalanceLoanAmount}>
											<View style={{width:'100%',flexDirection:'row'}}>
												<Text style={BuyerStyle.alignCenter}>$ </Text>
												<Text style={[BuyerStyle.width70,{alignSelf:'center'}]}>{this.delimitNumbers(this.state.loan_amt)}</Text>
											</View>
											<View style={BuyerStyle.textboxunderline}>
												<View style={[BuyerStyle.fullunderline, ]}></View>
											</View>
										</View>
										<View style={BuyerStyle.existingfirstbalanceLoanAmount}>
											<View style={{width:'100%',flexDirection:'row'}}>
											<Text style={BuyerStyle.alignCenter}>$ </Text>
												<Text style={[BuyerStyle.width70,{alignSelf:'center'}]}>{this.delimitNumbers(this.state.loan_amt2)}</Text>
											</View>
											<View style={BuyerStyle.textboxunderline}>
											</View>
										</View>
									</View>
									<View style={[BuyerStyle.fullunderline, {marginTop:10}]}></View>
								</View>
							)}

							{renderIf(this.state.tab == 'Owner_Carry')(	
								<View onLayout={(event) => this.measureView(event,'loanAmountHeight')}>
									<View style={[BuyerStyle.fullunderline, {marginTop:10}]}></View>
									<View style={[BuyerStyle.loandetailhead,{marginTop:10}]}>
										<View style={BuyerStyle.existingfirstLoanAmount}>
											<Text style={[BuyerStyle.loanstext,{marginTop:0,marginLeft:10}]}>{STRINGS.t('loan_amount')}</Text>
										</View>
										<View style={BuyerStyle.existingfirstbalanceLoanAmount}>
											<View style={{width:'100%',flexDirection:'row'}}>
												<Text style={BuyerStyle.alignCenter}>$ </Text>
												
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" 	selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onKeyPress={() => this.onFocus('loan_amt',this.state.loanAmountHeight)}  
													onChangeText={(value) => this.setState({loan_amt: this.onChange(value)})} 										
													onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'loan_amt',this.callOWNERCARRYsettinsapi.bind(this,event.nativeEvent.text,'loan_amt')) }
													value={this.delimitNumbers(this.state.loan_amt)}/>
												
												</View>
											<View style={BuyerStyle.textboxunderline}>
												<View style={[BuyerStyle.fullunderline, ]}></View>
											</View>
										</View>
										<View style={BuyerStyle.existingfirstbalanceLoanAmount}>
											<View style={{width:'100%',flexDirection:'row'}}>
											<Text style={BuyerStyle.alignCenter}>$ </Text>
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" 	selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onKeyPress={() => this.onFocus('loan_amt2',this.state.loanAmountHeight)}  
													onChangeText={(value) => this.setState({loan_amt2: this.onChange(value)})} 										
													onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'loan_amt2',this.callOWNERCARRYsettinsapi.bind(this,event.nativeEvent.text,'loan_amt2')) }
													value={this.delimitNumbers(this.state.loan_amt2)}/>
											</View>
											<View style={BuyerStyle.textboxunderline}>
												<View style={[BuyerStyle.fullunderline, ]}></View>
											</View>
										</View>
									</View>
									<View style={[BuyerStyle.fullunderline, {marginTop:10}]}></View>
								</View>
							)}



							{renderIf(this.state.tab == 'USDA')(
									<View style={[BuyerStyle.fullunderline, {marginTop:10}]}></View>	
							)}	
							{renderIf(this.state.tab == 'USDA' || this.state.tab == 'VA' || this.state.tab == 'FHA')(
								<View onLayout={(event) => this.measureView(event,'adjustedLoanAmountHeight')}>
									<View style={[BuyerStyle.textViewContainer, {paddingTop:10}]}>
										<Text style={[BuyerStyle.schollheadtext,{marginLeft:'5%',width:'60%', textAlign:'left'}]}>{STRINGS.t('adjusted_loan_amount')}  </Text>
										

										<Text style={[BuyerStyle.schollheadtext,{width:'40%'}]} >{'$ '+this.delimitNumbers(parseFloat(this.state.adjusted_loan_amt).toFixed(2))} </Text>
										
										{/* 										
											<TextInput selectTextOnFocus={ true } keyboardType="numeric" style={[BuyerStyle.schollheadtext,{width:'55%'}]} value={'$ '+this.delimitNumbers(parseFloat(this.state.adjusted_loan_amt).toFixed(2))}  underlineColorAndroid='transparent'/>
										*/}
										

									</View>
								</View>	
							)}	

							<View style={[BuyerStyle.loandetailhead,{paddingLeft:10, paddingRight:10}]} onLayout={(event) => this.measureView(event,'downPaymentHeight')}>
								<View style={BuyerStyle.title_justify}>
									<Text style={BuyerStyle.text_style}>{STRINGS.t('down_payment')}</Text>
								</View>
								<View style={{width:'30%',justifyContent:'center', marginRight : 7}}>
									<View style={BuyerStyle.alignrightinput}>
										<Text style={BuyerStyle.alignCenter}>$ </Text>
										<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onKeyPress={() => this.onFocus('down_payment',this.state.downPaymentHeight)}  
										
										onChangeText={(value) => this.setState({down_payment: this.onChange(value)})} 
										
										onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'down_payment',this.downPaymentChange.bind(this,event.nativeEvent.text)) }
										
										value={this.delimitNumbers(this.state.down_payment)}/>
									</View>
									<View style={[BuyerStyle.fullunderline, ]}></View>
								</View>
							</View>    


									{renderIf(this.state.sumWinPropertyTaxStatus == true)(
									<View style={[BuyerStyle.loandetailhead,{paddingLeft:10, paddingRight:10}]} onLayout={(event) => this.measureView(event,'summerPropTaxHeight')}>
									<View style={BuyerStyle.title_justify}>
										<Text style={BuyerStyle.text_style}>{this.state.summerPropertyTaxLabel}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={BuyerStyle.alignrightinput}>
											<Text style={BuyerStyle.alignCenter}>$ </Text>
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} onKeyPress={() => this.onFocus('summerPropertyTax',this.state.summerPropTaxHeight)} onChangeText={(value) => this.setState({summerPropertyTax: this.onChange(value)})} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'summerPropertyTax',this.changeAnnualTax) } value={this.delimitNumbers(this.state.summerPropertyTax)} underlineColorAndroid='transparent'/>
										</View>
										<View style={[BuyerStyle.fullunderline, ]}></View>
									</View>
									</View>

									)}

									{renderIf(this.state.sumWinPropertyTaxStatus == true && this.state.county == '2090')(
										<View style={[BuyerStyle.loandetailhead,{paddingLeft:10, paddingRight:10}]} onLayout={(event) => this.measureView(event,'summerPropTaxHeight')}>
										<View style={BuyerStyle.title_justify}>
											<Text style={{color:"#FD002B",fontFamily:'roboto-regular',fontSize:12}}>only one box can be used </Text>
										</View>
										<View style={{width:'30%',justifyContent:'center'}}>
											<View style={BuyerStyle.alignrightinput}>
												<Text style={BuyerStyle.alignCenter}>OR</Text>
											</View>
										</View>
										</View>
									)}
									{renderIf(this.state.sumWinPropertyTaxStatus == true) (
									<View style={[BuyerStyle.loandetailhead,{paddingLeft:10, paddingRight:10}]} onLayout={(event) => this.measureView(event,'winterPropTaxHeight')}>
									<View style={BuyerStyle.title_justify}>
										<Text style={BuyerStyle.text_style}>{this.state.winterPropertyTaxLabel}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={BuyerStyle.alignrightinput}>
											<Text style={BuyerStyle.alignCenter}>$ </Text>
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} onKeyPress={() => this.onFocus('winterPropertyTax',this.state.winterPropTaxHeight)} onChangeText={(value) => this.setState({winterPropertyTax: this.onChange(value)})} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'winterPropertyTax',this.changeAnnualTax) } value={this.delimitNumbers(this.state.winterPropertyTax)} underlineColorAndroid='transparent'/>
										</View>
										<View style={[BuyerStyle.fullunderline, ]}></View>
									</View>
									</View>
								)}	

							{renderIf(this.state.annualPropertyTaxFieldShowStatus == true)(
								<View style={[BuyerStyle.loandetailhead,{paddingLeft:10, paddingRight:10}]} onLayout={(event) => this.measureView(event,'annualPropTaxHeight')}>
									<View style={BuyerStyle.title_justify}>
										<Text style={BuyerStyle.text_style}>{STRINGS.t('annual_prop_tax')}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={BuyerStyle.alignrightinput}>
											<Text style={BuyerStyle.alignCenter}>$ </Text>
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true } style={BuyerStyle.width100} onKeyPress={() => this.onFocus('annualPropertyTax',this.state.annualPropTaxHeight)} onChangeText={(value) => this.setState({annualPropertyTax: this.onChange(value)})} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'annualPropertyTax',this.changeAnnualTax) } value={this.delimitNumbers(this.state.annualPropertyTax)} underlineColorAndroid='transparent'/>
										</View>
										<View style={[BuyerStyle.fullunderline, ]}></View>
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

							{renderIf(this.state.annualPropertyCheck == true)(
							<View style={[BuyerStyle.loandetailhead,{paddingLeft:10, paddingRight:10}]}>
								<View style={BuyerStyle.title_justify}>
									<Text style={BuyerStyle.text_style}>{STRINGS.t('Use_For_Prepaid')}</Text>
								</View>
								<View style={{width:'30%',justifyContent:'flex-end', marginLeft : 34}}>
									<View style={{width: '100%',justifyContent: 'flex-end',flexDirection: 'row',alignSelf: 'flex-end'}}>
										<CheckBox right={true} uncheckedColor="#3b90c4" containerStyle={{ backgroundColor:'#ffffff', borderWidth:0}} checkedColor='#3b90c4' checked={this.state.isCheckForFlorida} 
										onPress={this.handlePressCheckedBoxForFlorida}
										
										/>
									</View>									
								</View>
							</View>
							)}	

							<View style={[BuyerStyle.loandetailhead,{paddingLeft:10, paddingRight:10}]}>
								<View style={BuyerStyle.title_justify}>
									<Text style={BuyerStyle.text_style}>{STRINGS.t('est_closing')}</Text>
								</View>
								<View style={{width:'33%',justifyContent:'center'}}>
									<View style={BuyerStyle.alignrightinput}>
										<DatePicker style={BuyerStyle.width100date} showIcon={false} date={this.state.date} mode="date" placeholder="select date" format="MM-DD-YYYY" minDate={this.state.date1} confirmBtnText="Confirm" cancelBtnText="Cancel" customStyles={{dateInput: {borderWidth:0}}} onDateChange={(date) => this.changeDate(date)} />
									</View>
									<View style={[BuyerStyle.fullunderline, ]}></View>
								</View>
							</View>
							<View style={[BuyerStyle.loandetailhead,{paddingLeft:10, paddingRight:10, marginBottom:this.state.focusElementMargin}]}>
								<View style={BuyerStyle.title_justify}>
									<Text style={BuyerStyle.text_style}>{STRINGS.t('est_tax')}</Text>
								</View>
								<View style={{width:'30%',justifyContent:'center'}}>
									<View style={BuyerStyle.alignrightinput}>
										<Text style={BuyerStyle.alignCenter}>$ </Text>
										<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} editable = {false} underlineColorAndroid='transparent' onKeyPress={() => this.onFocus('estimatedTaxProrations')}  onChangeText={(value) => this.setState({estimatedTaxProrations: this.onChange(value)})} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'estimatedTaxProrations') } value={this.delimitNumbers(this.state.estimatedTaxProrations)}/>
									</View>
								</View>
							</View>
							{/*
								<View style={[BuyerStyle.loandetailhead,{paddingLeft:10, paddingRight:10, marginBottom:this.state.focusElementMargin}]}>
								<AutoComplete
									onSelect={this.onSelect}
									suggestions={suggestions}
									onChangeText={(value) => this.setState({autoCompleteValue : value})}
									suggestionObjectTextProperty='text'
									value={this.state.autoCompleteValue}
								/>
							</View>
							
							*/}
							

						</ScrollView>
					</View>
				</View>	
			)}
			{renderIf(this.state.footer_tab == 'closing_cost')(
				<View style={{height:'100%',width:'100%'}}>
					<View style={BuyerStyle.smallsegmentContainer}>
						<View style={BuyerStyle.segmentView}>                                        
							<View style={BuyerStyle.textViewContainerbig}>
								<Text style={BuyerStyle.schollheadtext}>{STRINGS.t('Total_Closing_Cost')}: $ {this.delimitNumbers(this.state.totalClosingCost)}  </Text>
							</View>
						</View>
					</View>

					<View style={(this.state.initialOrientation == 'portrait') ? (this.state.orientation == 'portrait') ? BuyerStyle.bigscrollviewheight : BuyerStyle.bigscrollviewheightlandscape : (this.state.orientation == 'landscape') ? BuyerStyle.bigscrollviewheight : BuyerStyle.bigscrollviewheightlandscape}>
						<ScrollView 
							scrollEnabled={true} 
							showsVerticalScrollIndicator={true}  
							keyboardShouldPersistTaps="always" 							
							style={BuyerStyle.sellerscrollview}
							//keyboardDismissMode='on-drag'
							ref="scrollView1"
							onTouchStart={this._onMomentumScrollEnd}
						>

						{this.state.escrowOnlyBuyerType == true ? 
							<View style={[BuyerStyle.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'escrowFeeHeight')}>
							<View style={BuyerStyle.smalltitle_justify}>
								<Text style={BuyerStyle.text_style}>{STRINGS.t('escrow')}</Text>
							</View>
							<View style={{flexDirection: 'row', width:'25%',justifyContent:'center'}}>
									<ModalDropdown options={this.state.modalDropDownOnlyBuyerTypeAtions} defaultValue={this.state.escrowPolicyOnlyBuyerType.toString()}  animated={true} style={{marginRight : 10, width : 40}} dropdownStyle={{ alignItems: 'center',width: 80,height:40, borderWidth: 1,borderRadius: 2,borderColor: '#ddd',borderBottomWidth: 0,shadowColor: '#000', shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.8,shadowRadius: 2}} onSelect={(idx, value) => this.createEscrowPicker(idx, value)}>
									</ModalDropdown>
									<ModalDropdown options={this.state.modalDropDownOnlyBuyerTypeAtions} onSelect={(idx, value) => this.createEscrowPicker(idx, value)} animated={true} style={{marginRight : 10}} dropdownStyle={{height:40, alignItems: 'center', width:80, borderWidth: 1,borderRadius: 2,borderColor: '#ddd',borderBottomWidth: 0,shadowColor: '#000', shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.8,shadowRadius: 2}}>
									<Image style={{width:10,height:9,top:0, marginTop : 3}} source={Images.dropdown_arrow}/>
									</ModalDropdown>
							</View>
							<View style={{width:'30%',justifyContent:'center'}}>
								<View style={BuyerStyle.alignrightinput}>
									<Text style={BuyerStyle.alignCenter}>$ </Text>
									<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} onChangeText={(value) => this.setState({escrowFee: this.onChange(value)})} 
									onKeyPress={() => this.onFocus('escrowFee',this.state.escrowFeeHeight)} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'escrowFee',this.calEscrowDataOnChange) }
									value={this.delimitNumbers(this.state.escrowFee)} underlineColorAndroid='transparent'/>
								</View>
									<View style={[BuyerStyle.fullunderline ]}></View>
							</View>
						</View> 						
						
						:
						
								<View style={[BuyerStyle.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'escrowFeeHeight')}>
								<View style={BuyerStyle.smalltitle_justify}>
									<Text style={BuyerStyle.text_style}>{STRINGS.t('escrow')}</Text>
								</View>
								<View style={{flexDirection: 'row', width:'25%',justifyContent:'center'}}>
										<ModalDropdown options={this.state.modalDropDownAtions} defaultValue={this.state.escrowPolicyType.toString()}  animated={true} style={{marginRight : 10, width : 40}} dropdownStyle={{ alignItems: 'center',width: 80,height:115, borderWidth: 1,borderRadius: 2,borderColor: '#ddd',borderBottomWidth: 0,shadowColor: '#000', shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.8,shadowRadius: 2}} onSelect={(idx, value) => this.createEscrowPicker(idx, value)}>
										</ModalDropdown>
										<ModalDropdown options={this.state.modalDropDownAtions} onSelect={(idx, value) => this.createEscrowPicker(idx, value)} animated={true} style={{marginRight : 10}} dropdownStyle={{height:115, alignItems: 'center', width:80, borderWidth: 1,borderRadius: 2,borderColor: '#ddd',borderBottomWidth: 0,shadowColor: '#000', shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.8,shadowRadius: 2}}>
										<Image style={{width:10,height:9,top:0, marginTop : 3}} source={Images.dropdown_arrow}/>
										</ModalDropdown>
								</View>
								<View style={{width:'30%',justifyContent:'center'}}>
									<View style={BuyerStyle.alignrightinput}>
										<Text style={BuyerStyle.alignCenter}>$ </Text>
										<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} onChangeText={(value) => this.setState({escrowFee: this.onChange(value)})} 
										onKeyPress={() => this.onFocus('escrowFee',this.state.escrowFeeHeight)} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'escrowFee',this.calEscrowDataOnChange) }
										value={this.delimitNumbers(this.state.escrowFee)} underlineColorAndroid='transparent'/>
									</View>
										<View style={[BuyerStyle.fullunderline ]}></View>
								</View>
							</View> 
					
						}

							<View style={[BuyerStyle.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'ownerFeeHeight')}>
								<View style={BuyerStyle.smalltitle_justify}>
									<Text style={BuyerStyle.text_style}>{STRINGS.t('owners')}</Text>
								</View>
								<View style={{flexDirection: 'row', width:'25%',justifyContent:'center'}}>
										<ModalDropdown options={this.state.modalDropDownAtions} defaultValue={this.state.ownerPolicyType.toString()}  animated={true} style={{marginRight : 10, width : 40}} dropdownStyle={{alignItems: 'center',width: 80,height:115, borderWidth: 1,borderRadius: 2,borderColor: '#ddd',borderBottomWidth: 0,shadowColor: '#000', shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.8,shadowRadius: 2}} onSelect={(idx, value) => this.createOwnerPicker(idx, value)}>
										</ModalDropdown>
										<ModalDropdown options={this.state.modalDropDownAtions} onSelect={(idx, value) => this.createOwnerPicker(idx, value)} animated={true} style={{marginRight : 10}} dropdownStyle={{height:115, alignItems: 'center', width:80, borderWidth: 1,borderRadius: 2,borderColor: '#ddd',borderBottomWidth: 0,shadowColor: '#000', shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.8,shadowRadius: 2}}>
										<Image style={{width:10,height:9,top:0, marginTop : 3}} source={Images.dropdown_arrow}/>
										</ModalDropdown>
										</View>
								<View style={{width:'30%',justifyContent:'center'}}>
									<View style={BuyerStyle.alignrightinput}>
										<Text style={BuyerStyle.alignCenter}>$ </Text>
										<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} onKeyPress={() => this.onFocus('ownerFee',this.state.ownerFeeHeight)} onChangeText={(value) => this.setState({ownerFee: this.onChange(value)})} 
										onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'ownerFee',this.calEscrowDataOnChange) }
										value={this.delimitNumbers(this.state.ownerFee)} underlineColorAndroid='transparent'/>
									</View>
										<View style={[BuyerStyle.fullunderline ]}></View>
								</View>
							</View> 

							{renderIf(this.state.state_code == 'NJ')(
								<View style={[BuyerStyle.loandetailhead,{paddingLeft:10, paddingRight:10}]}>
								<View style={BuyerStyle.title_justify}>
									<Text style={BuyerStyle.text_style}>{STRINGS.t('eagle_owners')}</Text>
								</View>
								<View style={{width:'30%',justifyContent:'flex-end', marginLeft : 34}}>
									<View style={{width: '100%',justifyContent: 'flex-end',flexDirection: 'row',alignSelf: 'flex-end'}}>
										<CheckBox right={true} uncheckedColor="#3b90c4" containerStyle={{ backgroundColor:'#ffffff', borderWidth:0}} checkedColor='#3b90c4' checked={this.state.isCheckForNewJersey} 
										onPress={this.handlePressCheckedBoxForNewJersey}
										
										/>
									</View>
									
								</View>
							</View>
							)}	
							<View style={[BuyerStyle.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'lenderFeeHeight')}>
								<View style={BuyerStyle.smalltitle_justify}>
									<Text style={BuyerStyle.text_style}>{STRINGS.t('lender')}</Text>
								</View>
								<View style={{flexDirection: 'row', width:'25%',justifyContent:'center'}}>
										<ModalDropdown options={this.state.modalDropDownAtions} defaultValue={this.state.lenderPolicyType.toString()} animated={true} style={{marginRight : 10, width : 40}} dropdownStyle={{alignItems: 'center',width: 80,height:115, borderWidth: 1,borderRadius: 2,borderColor: '#ddd',borderBottomWidth: 0,shadowColor: '#000', shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.8,shadowRadius: 2}} onSelect={(idx, value) => this.createLenderPicker(idx, value)}>
										</ModalDropdown>
										<ModalDropdown options={this.state.modalDropDownAtions} onSelect={(idx, value) => this.createLenderPicker(idx, value)} animated={true} style={{marginRight : 10}} dropdownStyle={{height:115, alignItems: 'center', width:80, borderWidth: 1,borderRadius: 2,borderColor: '#ddd',borderBottomWidth: 0,shadowColor: '#000', shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.8,shadowRadius: 2}}>
										<Image style={{width:10,height:9,top:0, marginTop : 3}} source={Images.dropdown_arrow}/>
										</ModalDropdown>
								</View>
								<View style={{width:'30%',justifyContent:'center'}}>
									<View style={BuyerStyle.alignrightinput}>
										<Text style={BuyerStyle.alignCenter}>$ </Text>
										<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} onChangeText={(value) => this.setState({lenderFee: this.onChange(value)})} 
										onKeyPress={() => this.onFocus('lenderFee', this.state.lenderFeeHeight)}onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'lenderFee',this.calEscrowDataOnChange) }
										value={this.delimitNumbers(this.state.lenderFee)} underlineColorAndroid='transparent'/>
									</View>
										<View style={[BuyerStyle.fullunderline ]}></View>
								</View>
								
							</View>
							{renderIf(this.state.reissueYearDropdownShow == true)(
							<View style={[BuyerStyle.scrollable_container_child, {marginTop:10}]}>
								<View style={BuyerStyle.smalltitle_justify}>
									<Text style={BuyerStyle.text_style}>Reissue Year</Text>
								</View>
								<View style={{flexDirection: 'row', width:'25%',justifyContent:'center'}}>
										<ModalDropdown options={this.state.modalDropDownReissueYear} defaultValue={this.state.reissueYearDropdownType.toString()} animated={true} style={{marginRight : 10, width : 30}} dropdownStyle={{alignItems: 'center',width: 80,height:115, borderWidth: 1,borderRadius: 2,borderColor: '#ddd',borderBottomWidth: 0,shadowColor: '#000', shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.8,shadowRadius: 2}} onSelect={(idx, value) => this.createReissueYearPicker(idx, value)}>
										</ModalDropdown>
										<ModalDropdown options={this.state.modalDropDownReissueYear} onSelect={(idx, value) => this.createReissueYearPicker(idx, value)} animated={true} style={{marginRight : 10}} dropdownStyle={{height:115, alignItems: 'center', width:80, borderWidth: 1,borderRadius: 2,borderColor: '#ddd',borderBottomWidth: 0,shadowColor: '#000', shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.8,shadowRadius: 2}}>
										<Image style={{width:9,height:9,top:0, marginTop : 3}} source={Images.dropdown_arrow}/>
										</ModalDropdown>
								</View>
								<View style={{width:'30%',justifyContent:'center'}}>
									
								</View>
								
							</View>
							
							)}
							<View style={[BuyerStyle.fullunderline, {marginTop:10}]}></View>
							{renderIf(this.state.showLoanServiceFee == true)(
							<View style={[BuyerStyle.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'newLoanServiceFeeHeight')}>
								<View style={BuyerStyle.title_justify}>
									<Text style={BuyerStyle.text_style}>{'New Loan Service Fee'}</Text>
								</View>
								<View style={{width:'30%',justifyContent:'center'}}>
									<View style={BuyerStyle.alignrightinput}>
										<Text style={BuyerStyle.alignCenter}>$ </Text>
										<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onKeyPress={() => this.onFocus('newLoanServiceFee', this.state.newLoanServiceFeeHeight)} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'newLoanServiceFee',this.calEscrowDataOnChange) } onChangeText={(value) => this.setState({newLoanServiceFee: this.onChange(value)})} value={this.delimitNumbers(this.state.newLoanServiceFee)}/>
									</View>
									<View style={[BuyerStyle.fullunderline, ]}></View>
								</View>
								<View style={[BuyerStyle.fullunderline, {marginTop:10}]}></View>
							</View> 
							
							)}
							{renderIf(this.state.showLoanServiceFee)(
								<View style={[BuyerStyle.fullunderline, {marginTop:10}]}></View>
							)}
							<View style={[BuyerStyle.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'discHeight')}>
								<View style={BuyerStyle.smalltitle_justify}>
									<Text style={BuyerStyle.text_style}>{STRINGS.t('discount')}</Text>
								</View>
								<View style={{width:'25%',justifyContent:'center'}}>                                            
									<View style={[BuyerStyle.alignrightinput,{width:'80%',marginLeft:'10%'}]}>
										<Text style={BuyerStyle.alignCenter}>% </Text>
										<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onKeyPress={() => this.onFocus('disc', this.state.discHeight)} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'disc',this.onChangeDisc.bind(this,event.nativeEvent.text,"disc")) } onChangeText={(value) => this.setState({disc: this.onChange(value)})} value={this.delimitNumbers(this.state.disc)}/>
									</View>
									<View style={[BuyerStyle.fullunderline,{width:'80%',marginLeft:'10%'} ]}></View>
								</View>
								<View style={{width:'30%',justifyContent:'center'}}>
									<View style={BuyerStyle.alignrightinputDownPayment}>
										<Text style={BuyerStyle.alignCenter}>$ </Text>
										<Text style={BuyerStyle.alignCenter}>{this.delimitNumbers(this.state.discAmt)}</Text>
										

										{/* 
											<CustomTextInput customKeyboardType="hello" selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' value={this.delimitNumbers(this.state.discAmt)}/>										
										*/}

									</View>
								</View>
							</View> 						
							<View style={[BuyerStyle.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'originationFeeHeight')}>
								<View style={BuyerStyle.title_justify}>
									<Text style={BuyerStyle.text_style}>{STRINGS.t('originatin_fees')}</Text>
								</View>
								<View style={{width:'30%',justifyContent:'center'}}>
									<View style={BuyerStyle.alignrightinput}>
										<Text style={BuyerStyle.alignCenter}>$ </Text>
										<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onKeyPress={() => this.onFocus('originationFee', this.state.originationFeeHeight)} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'originationFee',this.calTotalClosingCost, 'originationFeeFixed') } onChangeText={(value) => this.setState({originationFee: this.onChange(value)})} value={this.delimitNumbers(this.state.originationFee)}/>
									</View>
									<View style={[BuyerStyle.fullunderline, ]}></View>
								</View>
							</View> 
							<View style={[BuyerStyle.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'processingfeeHeight')}>
								<View style={BuyerStyle.title_justify}>
									<Text style={BuyerStyle.text_style}>{STRINGS.t('processing_fees')}</Text>
								</View>
								<View style={{width:'30%',justifyContent:'center'}}>
									<View style={BuyerStyle.alignrightinput}>
										<Text style={BuyerStyle.alignCenter}>$ </Text>
										<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onKeyPress={() => this.onFocus('processingfee', this.state.processingfeeHeight)} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'processingfee',this.calTotalClosingCost, 'processingfeeFixed') } onChangeText={(value) => this.setState({processingfee: this.onChange(value)})} value={this.delimitNumbers(this.state.processingfee)}/>
									</View>
									<View style={[BuyerStyle.fullunderline, ]}></View>
								</View>
							</View> 
							<View style={[BuyerStyle.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'taxservicecontractHeight')}>
								<View style={BuyerStyle.title_justify}>
									<Text style={BuyerStyle.text_style}>{STRINGS.t('tax_service_contact')}</Text>
								</View>
								<View style={{width:'30%',justifyContent:'center'}}>
									<View style={BuyerStyle.alignrightinput}>
										<Text style={BuyerStyle.alignCenter}>$ </Text>
										<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onKeyPress={() => this.onFocus('taxservicecontract', this.state.taxservicecontractHeight)} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'taxservicecontract',this.calTotalClosingCost, 'taxservicecontractFixed') } onChangeText={(value) => this.setState({taxservicecontract: this.onChange(value)})} value={this.delimitNumbers(this.state.taxservicecontract)}/>
									</View>
									<View style={[BuyerStyle.fullunderline, ]}></View>
								</View>
							</View> 
							<View style={[BuyerStyle.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'documentprepHeight')}>
								<View style={BuyerStyle.title_justify}>
									<Text style={BuyerStyle.text_style}>{STRINGS.t('document_prep')}</Text>
								</View>
								<View style={{width:'30%',justifyContent:'center'}}>
									<View style={BuyerStyle.alignrightinput}>
										<Text style={BuyerStyle.alignCenter}>$ </Text>
										<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onKeyPress={() => this.onFocus('documentprep', this.state.documentprepHeight)} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'documentprep',this.calTotalClosingCost, 'documentprepFixed') } onChangeText={(value) => this.setState({documentprep: this.onChange(value)},this.calTotalClosingCost)} value={this.delimitNumbers(this.state.documentprep)}/>
									</View>
									<View style={[BuyerStyle.fullunderline, ]}></View>
								</View>
							</View> 
							<View style={[BuyerStyle.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'underwritingHeight')}>
								<View style={BuyerStyle.title_justify}>
									<Text style={BuyerStyle.text_style}>{STRINGS.t('underwriting')}</Text>
								</View>
								<View style={{width:'30%',justifyContent:'center'}}>
									<View style={BuyerStyle.alignrightinput}>
										<Text style={BuyerStyle.alignCenter}>$ </Text>
										<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onKeyPress={() => this.onFocus('underwriting', this.state.underwritingHeight)} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'underwriting',this.calTotalClosingCost, 'underwritingFixed') } onChangeText={(value) => this.setState({underwriting: this.onChange(value)},this.calTotalClosingCost)} value={this.delimitNumbers(this.state.underwriting)}/>
									</View>
									<View style={[BuyerStyle.fullunderline, ]}></View>
								</View>
							</View> 
							<View style={[BuyerStyle.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'appraisalfeeHeight')}>
								<View style={BuyerStyle.title_justify}>
									<Text style={BuyerStyle.text_style}>{STRINGS.t('appraisal')}</Text>
								</View>
								<View style={{width:'30%',justifyContent:'center'}}>
									<View style={BuyerStyle.alignrightinput}>
										<Text style={BuyerStyle.alignCenter}>$ </Text>
										<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onKeyPress={() => this.onFocus('appraisalfee', this.state.appraisalfeeHeight)} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'appraisalfee',this.calTotalClosingCost, 'appraisalfeeFixed') } onChangeText={(value) => this.setState({appraisalfee: this.onChange(value)},this.calTotalClosingCost)} value={this.delimitNumbers(this.state.appraisalfee)}/>
									</View>
									<View style={[BuyerStyle.fullunderline, ]}></View>
								</View>
							</View> 


							<View style={[BuyerStyle.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'creditReportHeight')}>
								<View style={BuyerStyle.title_justify}>
									<Text style={BuyerStyle.text_style}>{STRINGS.t('credit_report')}</Text>
								</View>
								<View style={{width:'30%',justifyContent:'center'}}>
									<View style={BuyerStyle.alignrightinput}>
										<Text style={BuyerStyle.alignCenter}>$ </Text>
										<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onKeyPress={() => this.onFocus('creditReport', this.state.creditReportHeight)} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'creditReport',this.calTotalClosingCost,'creditReportFixed') } onChangeText={(value) => this.setState({creditReport: this.onChange(value)},this.calTotalClosingCost)} value={this.delimitNumbers(this.state.creditReport)}/>
									</View>
									<View style={[BuyerStyle.fullunderline, ]}></View>
								</View>
							</View>

							{renderIf(this.state.CityTransferTaxBuyerForILStatus == true)(
								<View style={[BuyerStyle.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'transferTaxILHeight')}>
								<View style={BuyerStyle.title_justify}>
									<Text style={BuyerStyle.text_style}>{STRINGS.t('city_transfer_tax_for_illinois')}</Text>
								</View>
								<View style={{width:'30%',justifyContent:'center'}}>
									<View style={BuyerStyle.alignrightinput}>
										<Text style={BuyerStyle.alignCenter}>$ </Text>
										<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onKeyPress={() => this.onFocus('CityTransferTaxBuyerForIL', this.state.transferTaxILHeight)} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'CityTransferTaxBuyerForIL',this.calTotalClosingCost) } onChangeText={(value) => this.setState({CityTransferTaxBuyerForIL: this.onChange(value)},this.calTotalClosingCost)} value={this.delimitNumbers(this.state.CityTransferTaxBuyerForIL)}/>
									</View>
									<View style={[BuyerStyle.fullunderline, ]}></View>
								</View>
							</View> 
							)}
							
							<View style={[BuyerStyle.fullunderline, {marginTop:10}]}></View>
							<View style={[BuyerStyle.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'fee1Height')}>
								<View style={BuyerStyle.title_justify}>
									<Text style={BuyerStyle.text_style}>{this.state.label1.toString()}</Text>
								</View>
								<View style={{width:'30%',justifyContent:'center'}}>
									<View style={BuyerStyle.alignrightinput}>
										<Text style={BuyerStyle.alignCenter}>$ </Text>
										<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onKeyPress={() => this.onFocus('fee1', this.state.fee1Height)} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'fee1',this.calTotalClosingCost, 'fee1Fixed') } onChangeText={(value) => this.setState({fee1: this.onChange(value)},this.calTotalClosingCost)} value={this.delimitNumbers(this.state.fee1)}/>
									</View>
									<View style={[BuyerStyle.fullunderline, ]}></View>
								</View>
							</View> 
							<View style={[BuyerStyle.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'fee2Height')}>
								<View style={BuyerStyle.title_justify}>
									<Text style={BuyerStyle.text_style}>{this.state.label2.toString()}</Text>
								</View>
								<View style={{width:'30%',justifyContent:'center'}}>
									<View style={BuyerStyle.alignrightinput}>
										<Text style={BuyerStyle.alignCenter}>$ </Text>
										<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onKeyPress={() => this.onFocus('fee2', this.state.fee2Height)} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'fee2',this.calTotalClosingCost, 'fee2Fixed') }  onChangeText={(value) => this.setState({fee2: this.onChange(value)},this.calTotalClosingCost)} value={this.delimitNumbers(this.state.fee2)}/>
									</View>
									<View style={[BuyerStyle.fullunderline, ]}></View>
								</View>
							</View> 
							<View style={[BuyerStyle.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'fee3Height')}>
								<View style={BuyerStyle.title_justify}>
									<Text style={BuyerStyle.text_style}>{this.state.label3.toString()}</Text>
								</View>
								<View style={{width:'30%',justifyContent:'center'}}>
									<View style={BuyerStyle.alignrightinput}>
										<Text style={BuyerStyle.alignCenter}>$ </Text>
										<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onKeyPress={() => this.onFocus('fee3', this.state.fee3Height)} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'fee3',this.calTotalClosingCost, 'fee3Fixed') }  onChangeText={(value) => this.setState({fee3: this.onChange(value)},this.calTotalClosingCost)} value={this.delimitNumbers(this.state.fee3)}/>
									</View>
									<View style={[BuyerStyle.fullunderline, ]}></View>
								</View>
							</View> 
							<View style={[BuyerStyle.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'fee4Height')}>
								<View style={BuyerStyle.title_justify}>
									<Text style={BuyerStyle.text_style}>{this.state.label4.toString()}</Text>
								</View>
								<View style={{width:'30%',justifyContent:'center'}}>
									<View style={BuyerStyle.alignrightinput}>
										<Text style={BuyerStyle.alignCenter}>$ </Text>
										<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onKeyPress={() => this.onFocus('fee4', this.state.fee4Height)} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'fee4',this.calTotalClosingCost, 'fee4Fixed') }  onChangeText={(value) => this.setState({fee4: this.onChange(value)})} value={this.delimitNumbers(this.state.fee4)}/>
									</View>
									<View style={[BuyerStyle.fullunderline, ]}></View>
								</View>
							</View> 
							<View style={[BuyerStyle.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'fee5Height')}>
								<View style={BuyerStyle.title_justify}>
									<Text style={BuyerStyle.text_style}>{this.state.label5.toString()}</Text>
								</View>
								<View style={{width:'30%',justifyContent:'center'}}>
									<View style={BuyerStyle.alignrightinput}>
										<Text style={BuyerStyle.alignCenter}>$ </Text>
										<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onKeyPress={() => this.onFocus('fee5', this.state.fee5Height)} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'fee5',this.calTotalClosingCost, 'fee5Fixed') }  onChangeText={(value) => this.setState({fee5: this.onChange(value)})} value={this.delimitNumbers(this.state.fee5)}/>
									</View>
									<View style={[BuyerStyle.fullunderline, ]}></View>
								</View>
							</View> 
							<View style={[BuyerStyle.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'fee6Height')}>
								<View style={BuyerStyle.title_justify}>
									<Text style={BuyerStyle.text_style}>{this.state.label6.toString()}</Text>
								</View>
								<View style={{width:'30%',justifyContent:'center'}}>
									<View style={BuyerStyle.alignrightinput}>
										<Text style={BuyerStyle.alignCenter}>$ </Text>
										<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onKeyPress={() => this.onFocus('fee6', this.state.fee6Height)} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'fee6',this.calTotalClosingCost, 'fee6Fixed') }  onChangeText={(value) => this.setState({fee6: this.onChange(value)})} value={this.delimitNumbers(this.state.fee6)}/>
									</View>
									<View style={[BuyerStyle.fullunderline, ]}></View>
								</View>
							</View> 
							<View style={[BuyerStyle.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'fee7Height')}>
								<View style={BuyerStyle.title_justify}>
									<Text style={BuyerStyle.text_style}>{this.state.label7.toString()}</Text>
								</View>
								<View style={{width:'30%',justifyContent:'center'}}>
									<View style={BuyerStyle.alignrightinput}>
										<Text style={BuyerStyle.alignCenter}>$ </Text>
										<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onKeyPress={() => this.onFocus('fee7', this.state.fee7Height)} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'fee7',this.calTotalClosingCost, 'fee7Fixed') }  onChangeText={(value) => this.setState({fee7: this.onChange(value)})} value={this.delimitNumbers(this.state.fee7)}/>
									</View>
									<View style={[BuyerStyle.fullunderline, ]}></View>
								</View>
							</View> 
							<View style={[BuyerStyle.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'fee8Height')}>
								<View style={BuyerStyle.title_justify}>
									<Text style={BuyerStyle.text_style}>{this.state.label8.toString()}</Text>
								</View>
								<View style={{width:'30%',justifyContent:'center'}}>
									<View style={BuyerStyle.alignrightinput}>
										<Text style={BuyerStyle.alignCenter}>$ </Text>
										<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onKeyPress={() => this.onFocus('fee8', this.state.fee8Height)} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'fee8',this.calTotalClosingCost, 'fee8Fixed') }  onChangeText={(value) => this.setState({fee8: this.onChange(value)})} value={this.delimitNumbers(this.state.fee8)}/>
									</View>
									<View style={[BuyerStyle.fullunderline, ]}></View>
								</View>
							</View> 				
							<View style={[BuyerStyle.scrollable_container_child, {marginTop:10}]} onLayout={(event) => this.measureView(event,'fee9Height')}>
								<View style={BuyerStyle.title_justify}>
									<Text style={BuyerStyle.text_style}>{this.state.label9.toString()}</Text>
								</View>
								<View style={{width:'30%',justifyContent:'center'}}>
									<View style={BuyerStyle.alignrightinput}>
										<Text style={BuyerStyle.alignCenter}>$ </Text>
										<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onKeyPress={() => this.onFocus('fee9', this.state.fee9Height)} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'fee9',this.calTotalClosingCost, 'fee9Fixed') }  onChangeText={(value) => this.setState({fee9: this.onChange(value)})} value={this.delimitNumbers(this.state.fee9)}/>
									</View>
									<View style={[BuyerStyle.fullunderline, ]}></View>
								</View>
							</View> 				
							<View style={[BuyerStyle.scrollable_container_child, {marginTop:10, marginBottom:this.state.focusElementMargin}]} onLayout={(event) => this.measureView(event,'fee10Height')}>
								<View style={BuyerStyle.title_justify}>
									<Text style={BuyerStyle.text_style}>{this.state.label10.toString()}</Text>
								</View>
								<View style={{width:'30%',justifyContent:'center'}}>
									<View style={BuyerStyle.alignrightinput}>
										<Text style={BuyerStyle.alignCenter}>$ </Text>
										<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onKeyPress={() => this.onFocus('fee10', this.state.fee10Height)} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'fee10',this.calTotalClosingCost, 'fee10Fixed') }  onChangeText={(value) => this.setState({fee10: this.onChange(value)})} value={this.delimitNumbers(this.state.fee10)}/>
									</View>
									<View style={[BuyerStyle.fullunderline, ]}></View>
								</View>
							</View> 							
						</ScrollView>	
					</View>			
				</View>
			)}
			<View style={BuyerStyle.Footer}>
				<View style={BuyerStyle.footer_icon_container}>
					<TouchableOpacity onPress={() => this.changeFooterTab('buyer')}>
						{renderIf(this.state.footer_tab != 'buyer')(
							<Image style={BuyerStyle.footer_icon} source={Images.buyer}/>
						)}
						{renderIf(this.state.footer_tab == 'buyer')(
							<Image style={BuyerStyle.footer_icon} source={Images.buyer_highlight}/>
						)}						
					</TouchableOpacity>
				</View>
				<View style={BuyerStyle.lineView}></View>
				<View style={BuyerStyle.footer_icon_container}>
					<TouchableOpacity onPress={() => this.changeFooterTab('closing_cost')}>
						{renderIf(this.state.footer_tab != 'closing_cost')(
							<Image style={BuyerStyle.footer_icon} source={Images.closing_cost}/>
						)}
						{renderIf(this.state.footer_tab == 'closing_cost')(
							<Image style={BuyerStyle.footer_icon} source={Images.closing_cost_highlight}/>
						)}						
					</TouchableOpacity>
				</View>
				<View style={BuyerStyle.lineView}></View>
				<View style={BuyerStyle.footer_icon_container}>
						{renderIf(this.state.footer_tab != 'prepaid')(
							<TouchableOpacity onPress={() => this.changeFooterTab('prepaid')} >
								<Image style={BuyerStyle.footer_icon} source={Images.prepaid}/>		
							</TouchableOpacity>
						)}
						{renderIf(this.state.footer_tab == 'prepaid')(
						<TouchableOpacity onPress={() => this.changeFooterTab('prepaid')} >
							<Image style={BuyerStyle.footer_icon} source={Images.prepaid_highlight}/>	
							</TouchableOpacity>
						)}					
				</View>
				<View style={BuyerStyle.lineView}></View>
				<View style={BuyerStyle.footer_icon_container}>
						{renderIf(this.state.footer_tab != 'payment')(
							<TouchableOpacity onPress={() => this.changeFooterTab('payment')} >
								<Image style={BuyerStyle.footer_icon} source={Images.payment}/>		
							</TouchableOpacity>
						)}
						{renderIf(this.state.footer_tab == 'payment')(
						<TouchableOpacity onPress={() => this.changeFooterTab('payment')} >
							<Image style={BuyerStyle.footer_icon} source={Images.payment_highlight}/>	
							</TouchableOpacity>
						)}					
				</View>
			</View>
	
		{renderIf(this.state.footer_tab == 'prepaid')(
			<View style={{height:'100%',width:'100%'}}>
				<View style={BuyerStyle.smallsegmentContainer}>
					<View style={BuyerStyle.segmentView}>                                        
						<View style={BuyerStyle.textViewContainerbig}>
							<Text style={BuyerStyle.schollheadtext}>{STRINGS.t('Total_Prepaid_items')}: $ {this.delimitNumbers(this.state.totalPrepaidItems)}  </Text>
						</View>
					</View>
				</View>

				<View style={(this.state.initialOrientation == 'portrait') ? (this.state.orientation == 'portrait') ? BuyerStyle.bigscrollviewheight : BuyerStyle.bigscrollviewheightlandscape : (this.state.orientation == 'landscape') ? BuyerStyle.bigscrollviewheight : BuyerStyle.bigscrollviewheightlandscape}>
					<ScrollView 
						scrollEnabled={true} 
						showsVerticalScrollIndicator={true}  
						keyboardShouldPersistTaps="always" 							
						style={BuyerStyle.sellerscrollview}
						//keyboardDismissMode='on-drag'
						ref="scrollView1"
						onTouchStart={this._onMomentumScrollEnd}
					>

						<View style={BuyerStyle.fieldcontainer} onLayout={(event) => this.measureView(event,'monTaxValHeight')}> 
							<View style={BuyerStyle.fieldcontainersmallfieldLessWidth}>
								<View style={BuyerStyle.alignrightinput}>
									<CustomTextInput allowFontScaling={false} customKeyboardType="hello" editable= {(this.state.tab == "CASH") ? false : true} selectTextOnFocus={ true } keyboardType="numeric" style={[BuyerStyle.width100, {width:'75%'}]} underlineColorAndroid='transparent' onKeyPress={() => this.onFocus('monTaxVal')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'monTaxVal',this.changePrepaidPageFields) }  onChangeText={(value) => this.setState({monTaxVal: this.onChange(value)})} value={this.delimitNumbers(this.state.monTaxVal)}/>
								</View>
								<View style={[BuyerStyle.fullunderline, {width:'78%'}]}></View>
							</View> 
							<View style={BuyerStyle.fieldcontainerlargefield}>
								<Text style={BuyerStyle.fieldcontainerlable}>{STRINGS.t('mon_tax')}</Text>
							</View>
							<View style={BuyerStyle.fieldcontainersmallfield}>
								<View style={BuyerStyle.alignrightinput}>
									<Text style={BuyerStyle.alignCenter}>% </Text>
									<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true } keyboardType="numeric" style={[BuyerStyle.width100, {width:'75%'}]} underlineColorAndroid='transparent' onKeyPress={() => this.onFocus('monTax')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'monTax',this.changePrepaidPageFields) } onChangeText={(value) => this.setState({monTax: this.onChange(value),monTaxFixed: true})} value={this.delimitNumbers(this.state.monTax)}/>
								</View>
								<View style={[BuyerStyle.fullunderline, {width:'78%'}]}></View>
							</View> 
							<View style={BuyerStyle.fieldcontainersmallfield}>
								<View style={BuyerStyle.alignrightinput}>
									<Text style={BuyerStyle.alignCenter}>$ </Text>
									<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true } keyboardType="numeric" style={[BuyerStyle.width100, {width:'75%'}]} underlineColorAndroid='transparent' onKeyPress={() => this.onFocus('prepaidMonthTaxes')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'prepaidMonthTaxes',this.changePrepaidPageFields) } onChangeText={(value) => this.setState({prepaidMonthTaxes: this.onChange(value)})} value={this.delimitNumbers(this.state.prepaidMonthTaxes)}/>
								</View>
								<View style={[BuyerStyle.fullunderline, {width:'78%'}]}></View>
							</View>
						</View>


						
						<View style={BuyerStyle.fieldcontainer} onLayout={(event) => this.measureView(event,'numberOfMonthsInsurancePrepaidHeight')}> 
							<View style={BuyerStyle.fieldcontainersmallfieldLessWidth}>
								<View style={BuyerStyle.alignrightinput}>
									<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true } keyboardType="numeric" style={[BuyerStyle.width100, {width:'75%'}]} underlineColorAndroid='transparent' onKeyPress={() => this.onFocus('numberOfMonthsInsurancePrepaid')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'numberOfMonthsInsurancePrepaid',this.changePrepaidPageFields) } onChangeText={(value) => this.setState({numberOfMonthsInsurancePrepaid: this.onChange(value)})} value={this.delimitNumbers(this.state.numberOfMonthsInsurancePrepaid)}/>
								</View>
								<View style={[BuyerStyle.fullunderline, {width:'78%'}]}></View>
							</View> 
							<View style={BuyerStyle.fieldcontainerlargefield}>
								<Text style={BuyerStyle.fieldcontainerlable}>{STRINGS.t('mon_ins')}</Text>
							</View>
							<View style={BuyerStyle.fieldcontainersmallfield}>
								<View style={BuyerStyle.alignrightinput}>
									<Text style={BuyerStyle.alignCenter}>% </Text>
									<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true } keyboardType="numeric" style={[BuyerStyle.width100, {width:'75%'}]} underlineColorAndroid='transparent' onKeyPress={() => this.onFocus('monIns')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'monIns',this.changePrepaidPageFields) } onChangeText={(value) => this.setState({monIns: this.onChange(value),monInsFixed: true})} value={this.delimitNumbers(this.state.monIns)}/>
								</View>
								<View style={[BuyerStyle.fullunderline, {width:'78%'}]}></View>
							</View> 
							<View style={BuyerStyle.fieldcontainersmallfield}>
								<View style={BuyerStyle.alignrightinput}>
									<Text style={BuyerStyle.alignCenter}>$ </Text>
									<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true } keyboardType="numeric" style={[BuyerStyle.width100, {width:'75%'}]} underlineColorAndroid='transparent' onKeyPress={() => this.onFocus('monthInsuranceRes')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'monthInsuranceRes') } onChangeText={(value) => this.setState({monthInsuranceRes: this.onChange(value)})} value={this.delimitNumbers(this.state.monthInsuranceRes)}/>
								</View>
								<View style={[BuyerStyle.fullunderline, {width:'78%'}]}></View>
							</View>
						</View>
						<View style={BuyerStyle.fieldcontainer} onLayout={(event) => this.measureView(event,'numberOfDaysPerMonthHeight')}> 
							<View style={BuyerStyle.fieldcontainersmallfieldLessWidth}>
								<View style={BuyerStyle.alignrightinput}>
									<CustomTextInput allowFontScaling={false} customKeyboardType="hello" editable= {(this.state.tab == "CASH") ? false : true} selectTextOnFocus={ true } keyboardType="numeric" style={[BuyerStyle.width100, {width:'75%'}]} underlineColorAndroid='transparent' onKeyPress={() => this.onFocus('numberOfDaysPerMonth')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'numberOfDaysPerMonth',this.changeDayInterestPrice) } onChangeText={(value) => this.setState({numberOfDaysPerMonth: this.onChange(value),numberOfDaysPerMonthFixed: true})} value={this.delimitNumbers(this.state.numberOfDaysPerMonth)}/>
								</View>
								<View style={[BuyerStyle.fullunderline, {width:'78%'}]}></View>
							</View> 
							<View style={BuyerStyle.fieldcontainerlargefieldForDaysInterest}>
								<Text style={BuyerStyle.fieldcontainerlable}>{STRINGS.t('days_interest')}</Text>
							</View>
							<View style={BuyerStyle.fieldcontainersmallfieldForDaysInterest}>
							</View> 
							<View style={BuyerStyle.fieldcontainersmallfield}>
								<View style={BuyerStyle.alignrightinput}>
									<Text style={BuyerStyle.alignCenter}>$ </Text>
									<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true } keyboardType="numeric" style={[BuyerStyle.width100, {width:'75%'}]} underlineColorAndroid='transparent' onKeyPress={() => this.onFocus('daysInterest')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'daysInterest') } onChangeText={(value) => this.setState({daysInterest: this.onChange(value)})} value={this.delimitNumbers(this.state.daysInterest)}/>
								</View>
								<View style={[BuyerStyle.fullunderline, {width:'78%'}]}></View>
							</View>
						</View>
						{renderIf(this.state.tab == 'CONV' || this.state.tab == 'Owner_Carry')(
							<View style={BuyerStyle.fieldcontainer} onLayout={(event) => this.measureView(event,'monthPmiValHeight')}>
								<View style={BuyerStyle.fieldcontainerlargefieldPrepaid}>
									<Text style={BuyerStyle.fieldcontainerlable}>{STRINGS.t('2_month_pmi')}</Text>
								</View> 
								<View style={BuyerStyle.fieldcontainersmallfield}></View>
								<View style={BuyerStyle.fieldcontainersmallfield}>
									<View style={BuyerStyle.alignrightinput}>
										<Text style={BuyerStyle.alignCenter}>$ </Text>
										<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true } keyboardType="numeric" style={[BuyerStyle.width100, {width:'75%'}]} underlineColorAndroid='transparent' onKeyPress={() => this.onFocus('monthPmiVal')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'monthPmiVal', this.calTotalPrepaidItems) } onChangeText={(value) => this.setState({monthPmiVal : this.onChange(value)})} value={this.delimitNumbers(this.state.monthPmiVal)}/>
									</View>
									<View style={[BuyerStyle.fullunderline, {width:'78%'}]}></View>
								</View>
							</View>
							
						)}
						{renderIf(this.state.tab == 'FHA')(
							<View style={BuyerStyle.fieldcontainer}> 
								<View style={BuyerStyle.fieldcontainersmallfieldForFHA}>
									<View style={BuyerStyle.alignrightinput}>
										<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true } keyboardType="numeric" style={[BuyerStyle.width100, {width:'75%'}]} underlineColorAndroid='transparent' onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'FhaMipFin1') } onKeyPress={() => this.onFocus('FhaMipFin1')} onChangeText={(value) => this.setState({FhaMipFin1: this.onChange(value)})} 
										value={this.delimitNumbers(this.state.FhaMipFin1)}/>
									</View>
									<View style={[BuyerStyle.fullunderline, {width:'78%'}]}></View>
								</View> 
								<View style={BuyerStyle.fieldcontainersmallfieldForFHA}>
									<Text style={BuyerStyle.fieldcontainerlable}>{STRINGS.t('FHA_Mip')} {STRINGS.t('Fin')} </Text>
								</View>
								<View style={BuyerStyle.fieldcontainersmallfieldFHACheckBox}>
									<CheckBox containerStyle={{backgroundColor:'#ffffff', borderWidth:0}} checkedColor='#CECECE' checked={this.state.isChecked} onPress={this.handlePressCheckedBox}/>
								</View>
								<View style={BuyerStyle.fieldcontainersmallfieldForFHA}>
									<View style={BuyerStyle.alignrightinput}>
										<Text style={BuyerStyle.alignCenter}>$ </Text>
										{this.state.isChecked ? (
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true } keyboardType="numeric" style={[BuyerStyle.width100, {width:'75%'}]} underlineColorAndroid='transparent' onKeyPress={() => this.onFocus('FhaMipFin2')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'FhaMipFin2') } onChangeText={(value) => this.setState({FhaMipFin2: this.onChange(value)})} value={this.delimitNumbers(this.state.FhaMipFin2)}/> ): (
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true } keyboardType="numeric" style={[BuyerStyle.width100, {width:'75%'}]} underlineColorAndroid='transparent' onKeyPress={() => this.onFocus('FhaMipFin')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'FhaMipFin') }  onChangeText={(value) => this.setState({FhaMipFin: this.onChange(value)})} value={this.delimitNumbers(this.state.FhaMipFin)}/>
										)}
									</View>
									<View style={[BuyerStyle.fullunderline, {width:'78%'}]}></View>
								</View>
							</View>	
						)}
							{renderIf(this.state.tab == 'VA')(
								<View style={BuyerStyle.fieldcontainer} onLayout={(event) => this.measureView(event,'VaFfFin1Height')}> 
									<View style={BuyerStyle.fieldcontainersmallfieldVA}>
										<View style={BuyerStyle.alignrightinput}>
											{this.state.isCheckedVA ? (
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true } onKeyPress={() => this.onFocus('VaFfFin1',this.state.VaFfFin1Height)} keyboardType="numeric" style={[BuyerStyle.width100, {width:'75%'}]} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({VaFfFin1: this.onChange(value)})} value={this.delimitNumbers(this.state.VaFfFin1)}/> ) : (
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true } keyboardType="numeric" style={[BuyerStyle.width100, {width:'75%'}]} underlineColorAndroid='transparent' value='0.00'/>	
											)}
										</View>
										<View style={[BuyerStyle.fullunderline, {width:'78%'}]}></View>
									</View> 
									<View style={BuyerStyle.fieldcontainersmallfieldLessWidthVA}>
										<Text style={BuyerStyle.fieldcontainerlable}>{STRINGS.t('VA_FF_Fin')} </Text>
									</View>
									<View style={BuyerStyle.fieldcontainersmallfieldLessWidthVA}>
										<CheckBox containerStyle={{backgroundColor:'#ffffff', borderWidth:0}} center checkedColor='#CECECE' checked={this.state.isCheckedVA} onPress={this.handlePressVACheckedBox}/>
									</View>
									<View style={BuyerStyle.fieldcontainersmallfieldVA}>
										<View style={[BuyerStyle.alignrightinput, {width:'75%', marginRight : 11}]}>
											<Text style={BuyerStyle.alignCenter}>$ </Text>
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true } keyboardType="numeric" onKeyPress={() => this.onFocus('Vaff',this.state.VaFfFin1Height)} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'Vaff',this.callSalesPr) } onChangeText={(value) => this.setState({Vaff: this.onChange(value)})} value={this.delimitNumbers(this.state.Vaff)} style={BuyerStyle.width100} underlineColorAndroid='transparent' />
										</View>
										<View style={[BuyerStyle.fullunderline, {width:'78%'}]}></View>
									</View> 
									{/*
										<View style={BuyerStyle.fieldcontainersmallfieldVA}>
										<View style={BuyerStyle.alignrightinput}>
											<Text style={BuyerStyle.alignCenter}>$ </Text>
											{this.state.isCheckedVA ? (
												<CustomTextInput customKeyboardType="hello" selectTextOnFocus={ true } onKeyPress={() => this.onFocus('VaFfFin2')} keyboardType="numeric" style={[BuyerStyle.width100, {width:'75%'}]} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({VaFfFin2: this.onChange(value)})} value={this.state.VaFfFin2.toString()}/> ): (
												<CustomTextInput customKeyboardType="hello" selectTextOnFocus={ true } onKeyPress={() => this.onFocus('VaFfFin',this.state.VaFfFin1Height)} keyboardType="numeric" style={[BuyerStyle.width100, {width:'75%'}]} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({VaFfFin: this.onChange(value)})} value={this.delimitNumbers(this.state.VaFfFin)}/>
											)}
										</View>
										<View style={[BuyerStyle.fullunderline, {width:'78%'}]}></View>
									</View>
									*/}
									
								</View>	
							)}

						{renderIf(this.state.tab == 'VA')(
							<View style={BuyerStyle.fieldcontainerForVafffin} onLayout={(event) => this.measureView(event,'VaFfFin1Height')}> 
								<View style={BuyerStyle.fieldcontainersmallfieldVaFfFin2}>
									<View style={[BuyerStyle.alignrightinput, {width:'75%', marginRight : 11}]}>
										<Text style={BuyerStyle.alignCenter}>$ </Text>
										{this.state.isCheckedVA ? (
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true } keyboardType="numeric" style={[BuyerStyle.width100, {width:'75%'}]} underlineColorAndroid='transparent' onKeyPress={() => this.onFocus('VaFfFin2')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'VaFfFin2') } onChangeText={(value) => this.setState({VaFfFin2: this.onChange(value)})} value={this.delimitNumbers(this.state.VaFfFin2)}/> ): (
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true } keyboardType="numeric" style={[BuyerStyle.width100, {width:'75%'}]} underlineColorAndroid='transparent' onKeyPress={() => this.onFocus('VaFfFin')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'VaFfFin') } onChangeText={(value) => this.setState({VaFfFin: this.onChange(value)})} value={this.delimitNumbers(this.state.VaFfFin)}/>
										)}
									</View>
									<View style={[BuyerStyle.fullunderline, {width:'78%'}]}></View>
								</View>

							</View>
						)}


						{renderIf(this.state.tab == 'USDA')(


							<View style={BuyerStyle.fieldcontainer} onLayout={(event) => this.measureView(event,'UsdaMipFinance1Height')}> 
								<View style={BuyerStyle.fieldcontainersmallfieldForFHA}>
									<View style={BuyerStyle.alignrightinput}>
										<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true } keyboardType="numeric" style={[BuyerStyle.width100, {width:'75%'}]} underlineColorAndroid='transparent' onKeyPress={() => this.onFocus('UsdaMipFinance1')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'UsdaMipFinance1') } onChangeText={(value) => this.setState({UsdaMipFinance1: this.onChange(value)})} value={this.state.UsdaMipFinance1.toString()}/>
									</View>
									<View style={[BuyerStyle.fullunderline, {width:'78%'}]}></View>
								</View> 
								<View style={BuyerStyle.fieldcontainersmallfieldForFHA}>
									<Text style={BuyerStyle.fieldcontainerlable}>{STRINGS.t('MIP')} {STRINGS.t('Fin')} </Text>
								</View>
								<View style={BuyerStyle.fieldcontainersmallfieldFHACheckBox}>
									<CheckBox containerStyle={{backgroundColor:'#ffffff', borderWidth:0}} checkedColor='#CECECE' checked={this.state.isCheckedUSDA} onPress={this.handlePressUSDACheckedBox}/>
								</View>
								<View style={BuyerStyle.fieldcontainersmallfieldForFHA}>
									<View style={BuyerStyle.alignrightinput}>
										<Text style={BuyerStyle.alignCenter}>$ </Text>
										{this.state.isCheckedUSDA ? (
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true } keyboardType="numeric" style={[BuyerStyle.width100, {width:'75%'}]} underlineColorAndroid='transparent' onKeyPress={() => this.onFocus('UsdaMipFinance2')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'UsdaMipFinance2') } onChangeText={(value) => this.setState({UsdaMipFinance2: this.onChange(value)})} value={this.delimitNumbers(this.state.UsdaMipFinance2)}/> ): (
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true } keyboardType="numeric" style={[BuyerStyle.width100, {width:'75%'}]} underlineColorAndroid='transparent' onKeyPress={() => this.onFocus('UsdaMipFinance')}  onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'UsdaMipFinance') } onChangeText={(value) => this.setState({UsdaMipFinance: this.onChange(value)})} value={this.delimitNumbers(this.state.UsdaMipFinance)}/>
										)}
									</View>
									<View style={[BuyerStyle.fullunderline, {width:'78%'}]}></View>
								</View>
							</View>	


						)}		



						<View style={[BuyerStyle.fullunderline, {marginTop:20}]}></View>
						<View style={[BuyerStyle.fieldcontainer, {marginTop:20, marginBottom:this.state.focusElementMargin}]}>
							<View style={BuyerStyle.costcontainer}>
								<Text style={BuyerStyle.costprepaidamttext}>{STRINGS.t('cost')}</Text>
								<Text style={[BuyerStyle.width100, {width:'90%',marginTop:20}]}>{this.delimitNumbers(this.state.twoMonthsPmi1)}</Text>
							</View>
							<View style={BuyerStyle.amountcontainer} onLayout={(event) => this.measureView(event,'costOtherHeight')}>
								<Text style={BuyerStyle.costamttext}>{STRINGS.t('amount')}</Text>
								<View style={{flexDirection:'row',width:'90%',marginTop:20}}>
									<Text style={BuyerStyle.alignCenter}>$</Text>
									<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true } keyboardType="numeric" style={[BuyerStyle.width100, {width:'90%'}]} underlineColorAndroid='transparent' onKeyPress={() => this.onFocus('costOther',this.state.costOtherHeight)} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'costOther',this.calTotalPrepaidItems) } onChangeText={(value) => this.setState({costOther: this.onChange(value),costOtherFixed: true})} value={this.delimitNumbers(this.state.costOther)}/>
								</View>
								<View style={[BuyerStyle.fullunderline, {width:'90%'}]}></View>
							</View>
						</View>
					</ScrollView>
				</View>
			</View>
		)}


		{renderIf(this.state.footer_tab == 'payment')(
			<View style={{height:'100%',width:'100%'}}>
				<View style={BuyerStyle.smallsegmentContainer}>
					<View style={BuyerStyle.segmentView}>                                        
						<View style={BuyerStyle.textViewContainerbig}>
							<Text style={BuyerStyle.schollheadtext}>{STRINGS.t('total_monthly_payment')}: $ {this.delimitNumbers(this.state.totalMonthlyPayment)}  </Text>
						</View>
					</View>
				</View>

				<View style={(this.state.initialOrientation == 'portrait') ? (this.state.orientation == 'portrait') ? BuyerStyle.bigscrollviewheight : BuyerStyle.bigscrollviewheightlandscape : (this.state.orientation == 'landscape') ? BuyerStyle.bigscrollviewheight : BuyerStyle.bigscrollviewheightlandscape}>
					<ScrollView 
						scrollEnabled={true} 
						showsVerticalScrollIndicator={true}  
						keyboardShouldPersistTaps="always" 							
						style={BuyerStyle.sellerscrollview}
						//keyboardDismissMode='on-drag'
						ref="scrollView1"
						onTouchStart={this._onMomentumScrollEnd}
					>
						<View style={[BuyerStyle.scrollable_container_child, {marginTop:10}]}>
							<View style={BuyerStyle.title_justify}>
								<Text style={BuyerStyle.text_style}>{STRINGS.t('principal_and_interest')}</Text>
							</View>
							<View style={{width:'30%',justifyContent:'center'}}>
								<View style={BuyerStyle.alignrightinput}>
									<Text style={[BuyerStyle.alignCenter, {textAlign:'right'}]}>$ {this.delimitNumbers(this.state.principalRate)}</Text>
								</View>
							</View>
						</View> 
						<View style={[BuyerStyle.scrollable_container_child, {marginTop:20}]}>
							<View style={BuyerStyle.title_justify}>
								<Text style={BuyerStyle.text_style}>{STRINGS.t('real_estate_taxes')}</Text>
							</View>
							<View style={{width:'30%',justifyContent:'center'}}>
								<View style={BuyerStyle.alignrightinput}>
									<Text style={[BuyerStyle.alignCenter, {textAlign:'right'}]}>$ {this.delimitNumbers(this.state.realEstateTaxesRes)}</Text>
								</View>
							</View>
						</View> 
						<View style={[BuyerStyle.scrollable_container_child, {marginTop:20}]}>
							<View style={BuyerStyle.title_justify}>
								<Text style={BuyerStyle.text_style}>{STRINGS.t('home_owners_insurance')}</Text>
							</View>
							<View style={{width:'30%',justifyContent:'center'}}>
								<View style={BuyerStyle.alignrightinput}>
									<Text style={[BuyerStyle.alignCenter, {textAlign:'right'}]}>$ {this.delimitNumbers(this.state.homeOwnerInsuranceRes)}</Text>
								</View>
							</View>
						</View>	

						<View style={[BuyerStyle.fieldcontainer, {marginTop:20}]} onLayout={(event) => this.measureView(event,'rateValueHeight')}> 
							<View style={BuyerStyle.fieldcontainersmallfield}>
								<View style={BuyerStyle.alignrightinput}>
									<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true } keyboardType="numeric" style={[BuyerStyle.width100, {width:'75%'}]} underlineColorAndroid='transparent' onKeyPress={() => this.onFocus('rateValue')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'rateValue',this.changeMortgageInsVal) } onChangeText={(value) => this.setState({rateValue: this.onChange(value)})} value={this.delimitNumbers(this.state.rateValue)}/>
								</View>
								<View style={[BuyerStyle.fullunderline, {width:'78%'}]}></View>
							</View> 
							<View style={BuyerStyle.fieldcontainerlargefield}>
								<Text style={BuyerStyle.fieldcontainerlable}>{STRINGS.t('mortgage_ins')}</Text>
							</View>
							<View style={BuyerStyle.fieldcontainersmallfieldLessWidth}>
							</View> 
							<View style={BuyerStyle.fieldcontainersmallfield}>
								<View style={BuyerStyle.alignrightinput}>
									<Text style={BuyerStyle.alignCenter}>$</Text>
									<CustomTextInput allowFontScaling={false} customKeyboardType="hello" allowFontScaling={false} selectTextOnFocus={ true } editable={ false } keyboardType="numeric" style={[BuyerStyle.width100, {width:'85%'}]} underlineColorAndroid='transparent' onKeyPress={() => this.onFocus('monthlyRate')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'monthlyRate') } onChangeText={(value) => this.setState({monthlyRate: this.onChange(value)})} value={this.delimitNumbers(this.state.monthlyRate)}/>
								</View>
							</View>
						</View>	

						{renderIf(this.state.tab == 'CONV' || this.state.tab == 'Owner_Carry')(
						<View style={BuyerStyle.fieldcontainer}>
								<View style={BuyerStyle.fieldcontainerlargefieldPrepaid}>
									<Text style={BuyerStyle.fieldcontainerlable}>{STRINGS.t('p_and_1_2nd_td')}</Text>
								</View> 
								<View style={BuyerStyle.fieldcontainersmallfield}></View>
								<View style={BuyerStyle.fieldcontainersmallfield}>
									<View style={BuyerStyle.alignrightinput}>
										<Text style={BuyerStyle.alignCenter}>$</Text>
										<CustomTextInput allowFontScaling={false} customKeyboardType="hello" allowFontScaling={false} selectTextOnFocus={ true } keyboardType="numeric" style={[BuyerStyle.width100, {width:'85%'}]} underlineColorAndroid='transparent' editable = {false} value={this.delimitNumbers(this.state.pnintrate)}/>
									</View>
								</View>
							</View>	
						)}		
						<View style={[BuyerStyle.fieldcontainer, {marginTop:20,marginBottom:this.state.focusElementMargin}]} onLayout={(event) => this.measureView(event,'paymentAmount1Height')}>
							<View style={BuyerStyle.costcontainer}>
								<Text style={BuyerStyle.costprepaidamttext}>{STRINGS.t('monthly_expenses')}</Text>
								<Text style={[BuyerStyle.width100, {width:'90%',marginTop:20}]}>{this.state.monthlyExpensesOther1.toString()}</Text>
								<Text style={[BuyerStyle.width100, {width:'90%',marginTop:20}]}>{this.state.monthlyExpensesOther2.toString()}</Text>
								
							</View>
							<View style={BuyerStyle.amountcontainer}>
								<Text style={BuyerStyle.costamttext}>{STRINGS.t('amount')}</Text>
								<View style={{flexDirection:'row',width:'90%',marginTop:20}}>
									<Text style={BuyerStyle.alignCenter}>
										$
									</Text>
									<CustomTextInput allowFontScaling={false} customKeyboardType="hello" allowFontScaling={false} selectTextOnFocus={ true } keyboardType="numeric" style={[BuyerStyle.width100]} underlineColorAndroid='transparent' onKeyPress={() => this.onFocus('paymentAmount1', this.state.paymentAmount1Height)} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'paymentAmount1',this.calTotalMonthlyPayment('paymentAmount1')) } onChangeText={(value) => this.setState({paymentAmount1: this.onChange(value),paymentAmount1Fixed: true})} value={this.delimitNumbers(this.state.paymentAmount1)}/>
								</View>
								<View style={[BuyerStyle.fullunderline, {width:'90%'}]}></View>
								<View style={{flexDirection:'row',width:'90%',marginTop:20}}>
									<Text style={BuyerStyle.alignCenter}>
										$
									</Text>
									<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={ true } keyboardType="numeric" style={[BuyerStyle.width100]} underlineColorAndroid='transparent' onKeyPress={() => this.onFocus('paymentAmount2',this.state.paymentAmount1Height)} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'paymentAmount2',this.calTotalMonthlyPayment('paymentAmount2')) } onChangeText={(value) => this.setState({paymentAmount2: this.onChange(value),paymentAmount2Fixed: true})} value={this.delimitNumbers(this.state.paymentAmount2)}/>
								</View>
								<View style={[BuyerStyle.fullunderline, {width:'90%'}]}></View>
							</View>
						</View> 
					</ScrollView>
				</View>
			</View>
		)}

		<View style={BuyerStyle.lineView}></View>
			<View style={BuyerStyle.header_bg}>
				<View style={CustomStyle.header_view}>
					<TouchableOpacity style={CustomStyle.back_icon_parent} onPress={() => this.changeFooterTab('buyer')}>
						{renderIf(this.state.footer_tab != 'buyer')(
							<Image style={BuyerStyle.footer_icon} source={Images.buyer}/>
						)}
						{renderIf(this.state.footer_tab == 'buyer')(
							<Image style={BuyerStyle.footer_icon} source={Images.buyer_highlight}/>
						)}						
					</TouchableOpacity>
					<View style={BuyerStyle.verticalLineForSegment}></View>
					<TouchableOpacity style={CustomStyle.back_icon_parent} onPress={() => this.changeFooterTab('closing_cost')}>
						{renderIf(this.state.footer_tab != 'closing_cost')(
							<Image style={BuyerStyle.footer_icon} source={Images.closing_cost}/>
						)}
						{renderIf(this.state.footer_tab == 'closing_cost')(
							<Image style={BuyerStyle.footer_icon} source={Images.closing_cost_highlight}/>
						)}						
					</TouchableOpacity>
					<View style={BuyerStyle.verticalLineForSegment}></View>
					<TouchableOpacity style={CustomStyle.back_icon_parent} onPress={() => this.changeFooterTab('prepaid')} >
						{renderIf(this.state.footer_tab != 'prepaid')(
							<Image style={BuyerStyle.footer_icon} source={Images.prepaid}/>
						)}
						{renderIf(this.state.footer_tab == 'prepaid')(
							<Image style={BuyerStyle.footer_icon} source={Images.prepaid_highlight}/>
						)}							
					</TouchableOpacity>
					<View style={BuyerStyle.verticalLineForSegment}></View>
					<TouchableOpacity style={CustomStyle.back_icon_parent}  onPress={() => this.changeFooterTab('payment')}>
						{renderIf(this.state.footer_tab != 'payment')(
							<Image style={BuyerStyle.footer_icon} source={Images.payment}/>
						)}	
						{renderIf(this.state.footer_tab == 'payment')(
							<Image style={BuyerStyle.footer_icon} source={Images.payment_highlight}/>
						)}	
					</TouchableOpacity>
				</View>
			</View>
			
			<View>
				<Modal
				animationType="slide"
				transparent={false}
				visible={this.state.modalVisible}
				onRequestClose={() => {alert("Modal has been closed.")}}
				>
					<View style={BuyerStyle.HeaderContainer}>
						<Image style={BuyerStyle.HeaderBackground} source={Images.header_background}></Image>
						<TouchableOpacity style={{width:'20%', justifyContent:'center'}} onPress={() => {this.setModalVisible(!this.state.modalVisible)}}>
						<Text style={[BuyerStyle.headerbtnText]}>{STRINGS.t('Cancel')}</Text>
						</TouchableOpacity>
						<Text style={BuyerStyle.header_title}>{STRINGS.t('calculator_listing')}</Text>
					</View>
					<View style={{marginTop: 5,marginBottom:80}}>
						<View style={BuyerStyle.listcontainerCal}>
								<View style={{paddingLeft:5,paddingRight:5}}>
									<View style={BuyerStyle.backgroundViewContainerSearch}>
										<TextInput placeholder='Type Keyword....'
											underlineColorAndroid='transparent' 
											style={BuyerStyle.textInputSearch} 
											onChangeText={(value) => this.setState({keyword: value})} 
											value={this.state.keyword}
										/>
										<TouchableOpacity style={CustomStyle.back_icon_parent}  onPress={() => this.SearchFilterFunction(this.state.keyword)}>
										<View style={BuyerStyle.restoreview}>
											<Text style={BuyerStyle.restoreviewtext}>{'Search'}</Text>
										</View>
										</TouchableOpacity>
									</View>
									<View style={[BuyerStyle.underlinebold,{marginBottom:10}]}></View>
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
				visible={this.state.modalVisibleForAmtSch}
				onRequestClose={() => {alert("Modal has been closed.")}}
				>
					<View style={BuyerStyle.HeaderContainer}>
						<Image style={BuyerStyle.HeaderBackground} source={Images.header_background}></Image>
						<TouchableOpacity style={{width:'20%', justifyContent:'center'}} onPress={() => {this.setModalVisibleForAmtSch(!this.state.modalVisibleForAmtSch)}}>
						<Text style={[BuyerStyle.headerbtnText]}>{STRINGS.t('Cancel')}</Text>
						</TouchableOpacity>
						<Text style={BuyerStyle.header_title}>AMORTIZATION SCHEDULE</Text>
					</View>
					<View style={{marginTop: 5,marginBottom:80}}>
						<View style={BuyerStyle.listcontainerCal}>
								<View style={{marginBottom:10,borderWidth: 1,borderColor: "#8E8E8E",marginRight:2,marginLeft:2}}>
									<View style={[BuyerStyle.scrollable_container_child_center_amtsch]}>
										<View style={[BuyerStyle.colForAmtSchList,{width: '60%',paddingLeft:4}]}>
											<Text style={BuyerStyle.text_style}>
												Principal Borrowed
											</Text>
										</View>
										<View style={BuyerStyle.verticalLineForSegmentForListingBorder}></View>
										<View style={[BuyerStyle.colForAmtSchList,{width: '40%',paddingRight:4}]}>
											<Text style={[BuyerStyle.alignCenterCalcList,{alignSelf: 'flex-end'}]}>
												${this.state.sp}
											</Text>
										</View>
									</View>
									<View style={{ height: 1, width:'100%', backgroundColor: '#8E8E8E'}}></View>
									<View style={[BuyerStyle.scrollable_container_child_center_amtsch]}>
										<View style={[BuyerStyle.colForAmtSchList,{width: '60%',paddingLeft:4}]}>
											<Text style={BuyerStyle.text_style}>
												Annual Interest Rate
											</Text>
										</View>
										<View style={BuyerStyle.verticalLineForSegmentForListingBorder}></View>
										<View style={[BuyerStyle.colForAmtSchList,{width: '40%',paddingRight:4}]}>
											<Text style={[BuyerStyle.alignCenterCalcList,{alignSelf: 'flex-end'}]}>
												{this.state.intr}%
											</Text>
										</View>
									</View>
									<View style={{ height: 1, width:'100%', backgroundColor: '#8E8E8E'}}></View>
									<View style={[BuyerStyle.scrollable_container_child_center_amtsch]}>
										<View style={[BuyerStyle.colForAmtSchList,{width: '60%',paddingLeft:4}]}>
											<Text style={BuyerStyle.text_style}>
												Term of Loan in Years
											</Text>
										</View>
										<View style={BuyerStyle.verticalLineForSegmentForListingBorder}></View>
										<View style={[BuyerStyle.colForAmtSchList,{width: '40%',paddingRight:4}]}>
											<Text style={[BuyerStyle.alignCenterCalcList,{alignSelf: 'flex-end'}]}>
												{this.state.dur}
											</Text>
										</View>
									</View>
									<View style={{ height: 1, width:'100%', backgroundColor: '#8E8E8E'}}></View>
									<View style={[BuyerStyle.scrollable_container_child_center_amtsch]}>
										<View style={[BuyerStyle.colForAmtSchList,{width: '60%',paddingLeft:4}]}>
											<Text style={BuyerStyle.text_style}>
												Due Year
											</Text>
										</View>
										<View style={BuyerStyle.verticalLineForSegmentForListingBorder}></View>
										<View style={[BuyerStyle.colForAmtSchList,{width: '40%',paddingRight:4}]}>
											<Text style={[BuyerStyle.alignCenterCalcList,{alignSelf: 'flex-end'}]}>
												{this.state.due}
											</Text>
										</View>
									</View>
									<View style={{ height: 1, width:'100%', backgroundColor: '#8E8E8E'}}></View>
								</View>
								<View style={{marginBottom:10,width: '100%',flexDirection: 'row', justifyContent: 'center'}}>
									<TouchableOpacity style={[BuyerStyle.buttonChart,{backgroundColor: '#4CAF50'}]} onPress={ () => {this.handleEventForGraphList('graph')}}>
										<Text style={BuyerStyle.style_btnLogin}> Graph </Text>
									</TouchableOpacity>
									<TouchableOpacity style={[BuyerStyle.buttonChart,{backgroundColor: '#E447CC'}]} onPress={ () => {this.handleEventForGraphList('list')}}>
										<Text style={BuyerStyle.style_btnLogin}> List</Text>
									</TouchableOpacity>
								
								</View>
								{renderIf(this.state.eventForGraphList == 'graph')(
								<View style={[BuyerStyle.scrollable_container_child_center_amtsch,{backgroundColor: 'rgb(0, 255, 255);'}]}>
									<MultiLineChart ref= 'linechart' data= {this.state.dataGraph} axisLineWidth={1} leftAxisData= {this.state.leftAxisData} bottomAxisData= {this.state.bottomAxisData} legendColor= {legendColor} RentvsBuyColor={RentvsBuyColor} legendText= {legendText}  strokeWidth='3' minX= {this.state.minX} maxX= {this.state.maxX} minY= {this.state.minY} maxY= {this.state.maxY} scatterPlotEnable= {false}   dataPointsVisible= {true} Color= {Color} axisColor='#CCCCCC' axisLabelColor='#000' lineWidth={2} hideAxis={false} dataPointsVisible={true} hideXAxisLabels={false} hideYAxisLabels={false} showLegends={true} tickColorXAxis='#CCCCCC' tickWidthXAxis='1' tickColorYAxis='#CCCCCC' tickWidthYAxis='1' circleRadiusWidth='0' circleRadius={0} showTicks={true} stroke='#CCCCCC' bottomAxisDataToShow={this.state.bottomAxisData} leftAxisDataToShow={this.state.leftAxisData} pointDataToShowOnGraph='' circleLegendType={true} fillArea={false} yAxisGrid={true} xAxisGrid={true} inclindTick={false} />
								</View>
								)}
					
								{renderIf(this.state.eventForGraphList == 'list')(
								<View style={[BuyerStyle.scrollable_container_child_center_amtsch,{backgroundColor: '#DCDCDC'}]}>
									<View style={[BuyerStyle.colForAmtSchList,{width: '10%'}]}>
										<TouchableOpacity>
											<Text style={BuyerStyle.text_style}>
												Month
											</Text>
										</TouchableOpacity>
									</View>
									
									<View style={BuyerStyle.verticalLineForSegmentForListingBorder}></View>
								
									<View style={BuyerStyle.colForAmtSchList}>
									<TouchableOpacity>
										<Text style={[BuyerStyle.alignCenterCalcList,{alignSelf: 'flex-start'}]}>
											Monthly Payment
										</Text>
									</TouchableOpacity>	
									</View>
									
									<View style={BuyerStyle.verticalLineForSegmentForListingBorder}></View>
								
									<View style={BuyerStyle.colForAmtSchList}>
									<TouchableOpacity>
										<Text style={[BuyerStyle.alignCenterCalcList,{alignSelf: 'flex-start'}]}>
											Interest Portion
										</Text>
									</TouchableOpacity>	
									</View>
									
									<View style={BuyerStyle.verticalLineForSegmentForListingBorder}></View>
									
									<View style={BuyerStyle.colForAmtSchList}>
									<TouchableOpacity>
										<Text style={[BuyerStyle.alignCenterCalcList,{alignSelf: 'flex-start'}]}>
											Principal Portion
										</Text>
									</TouchableOpacity>	
									</View>
									
									<View style={BuyerStyle.verticalLineForSegmentForListingBorder}></View>
									
									<View style={[BuyerStyle.colForAmtSchList,{width: '30%'}]}>
									<TouchableOpacity>
										<Text style={[BuyerStyle.alignCenterCalcList,{alignSelf: 'flex-start'}]}>
											Principal Balance
										</Text>
									</TouchableOpacity>	
									</View>
								</View>
								)}
								{renderIf(this.state.eventForGraphList == 'list')(
							<ScrollView style={{borderWidth: 1,borderColor: "#8E8E8E"}}>
							
								{renderIf(this.state.emptCheckAmtSch == false)(
									<ListView enableEmptySections={true} dataSource={this.state.dataSourceAmtSch} renderRow={this.renderRowAmtSch} renderSeparator={(sectionId, rowId) => <View key={rowId} style={stylesnew.separator} />} />
								)}
								{renderIf(this.state.emptCheckAmtSch == true)(
									<Text style={{alignSelf : 'center'}}>No Data Found.</Text>
								)}
							</ScrollView>	
								)}							
						</View>
					</View>
				</Modal>
				
				
				<Modal
				animationType="slide"
				transparent={false}
				visible={this.state.emailModalVisible}
				onRequestClose={() => {alert("Modal has been closed.")}}
				>
					<ScrollView scrollEnabled={true} showsVerticalScrollIndicator={true}  keyboardShouldPersistTaps="always" 
					keyboardDismissMode='on-drag'
					>
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
								<View style={BuyerStyle.scrollable_container_child_center}>
									<View style={{width: '10%',justifyContent: 'center'}}>
										<Text style={BuyerStyle.text_style}>
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
								<View style={BuyerStyle.lineViewEmailModal}></View>

								{/*
								<View style={BuyerStyle.scrollable_container_child_center}>
									<View style={{width: '15%',justifyContent: 'center'}}>
										<Text style={BuyerStyle.text_style}>
											{STRINGS.t('EmailSubject')}:
										</Text>
									</View>
									<View style={{width: '85%',flexDirection: 'row'}}>
										<TextInput selectTextOnFocus={ true } underlineColorAndroid='transparent' style={{width: '100%'}} value={this.state.email_subject.toString()}/>
									</View>
								</View>
								*/}

								<View style={BuyerStyle.lineViewEmailModal}></View>
								<View style={BuyerStyle.scrollable_container_child_center}>
									<View style={{width: '95%',flexDirection: 'row'}}>
										<TextInput placeholder='Note' selectTextOnFocus={ true } underlineColorAndroid='transparent' style={{width: '100%',height:60}} multiline={true} onChangeText={(value) => this.setState({content: value})} />
									</View>
								</View>
								<View style={BuyerStyle.lineViewEmailModal}></View>
							</View>
						</View>
					</ScrollView>
					{renderIf(this.state.dropdownType != 'loan_comparison' && this.state.dropdownType != 'cdtc' && this.state.dropdownType != 'trid')(
					<View style={BuyerStyle.header_bg}>
						<View style={CustomStyle.header_view}>
							<TouchableOpacity style={CustomStyle.back_icon_parent} onPress={() => this.setModalAddressesVisible(!this.state.modalAddressesVisible)}>
									<Image style={BuyerStyle.footer_icon_email_modal} source={Images.message}/>
							</TouchableOpacity>
							<TouchableOpacity style={CustomStyle.back_icon_parent} onPress={() => this.openpopup("image")}>
									<Image style={BuyerStyle.footer_icon_email_modal} source={Images.camera}/>
							</TouchableOpacity>
							<TouchableOpacity style={CustomStyle.back_icon_parent} onPress={() => this.openpopup("video")} >
									<Image style={BuyerStyle.footer_icon_email_modal} source={Images.video_camera}/>
							</TouchableOpacity>
						</View>
					</View>
					)}
			
			<PopupDialogEmail dialogTitle={<View style={BuyerStyle.dialogtitle}><Text style={BuyerStyle.dialogtitletext}>{STRINGS.t('Upload')} {this.state.popupAttachmentType}</Text></View>} dialogStyle={{width:'80%'}} ref={(popupDialogEmail) => { this.popupDialogEmail = popupDialogEmail; }}>
				{renderIf(this.state.popupAttachmentType == 'image')(
					<View>
						<TouchableOpacity onPress={() => this.onActionSelected('msg_tab_cam')}>
							<View style={BuyerStyle.dialogbtn}>
								<Text style={BuyerStyle.dialogbtntext}>
								{STRINGS.t('Upload_From_Camera')}
								</Text>
							</View>
						</TouchableOpacity>	
						<TouchableOpacity onPress={() => this.onActionSelected('msg_tab')} >
							<View style={BuyerStyle.dialogbtn}>
								<Text style={BuyerStyle.dialogbtntext}>
								{STRINGS.t('Upload_From_Gallery')}
								</Text>
							</View>
						</TouchableOpacity>	
						<TouchableOpacity style={BuyerStyle.buttonContainer} onPress={ () => {this.popupDialog.dismiss()}}>
							<Text style={BuyerStyle.style_btnLogin}> {STRINGS.t('Cancel')}</Text>
						</TouchableOpacity>	
					</View>	
				)}	
				{renderIf(this.state.popupAttachmentType == 'video')(
					<View style={{flex: 1, flexDirection: 'column',justifyContent: 'space-between',}}>
						<View>
							<TouchableOpacity onPress={() => {this.setVideoModalVisible(!this.state.videoModalVisible)}}>
								<View style={BuyerStyle.dialogbtn}>
									<Text style={BuyerStyle.dialogbtntext}>
									{STRINGS.t('Record_Video')}
									</Text>
								</View>
							</TouchableOpacity>	
						</View>
						<View>
							<TouchableOpacity style={BuyerStyle.buttonContainerRecordVideo} onPress={ () => {this.popupDialog.dismiss()}}>
								<Text style={BuyerStyle.style_btnLogin}> {STRINGS.t('Cancel')}</Text>
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
			<View style={BuyerStyle.HeaderContainer}>
				<Image style={BuyerStyle.HeaderBackground} source={Images.header_background}></Image>
				<TouchableOpacity style={{width:'20%', justifyContent:'center'}}  onPress={() => {this.setVideoModalVisible(!this.state.videoModalVisible)}}>
				<Text style={[BuyerStyle.headerbtnText]}>{STRINGS.t('Cancel')}</Text>
				</TouchableOpacity>
				<Text style={BuyerStyle.header_title}>{STRINGS.t('Email')}</Text>
				{recordButton}
			</View>
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
			</View>
		</View>
		</Modal>
		
		
		
		<Modal
		  animationType="slide"
		  transparent={false}
		  visible={this.state.modalAddressesVisible}
		  onRequestClose={() => {alert("Modal has been closed.")}}
		>

			<View style={BuyerStyle.HeaderContainer}>
				<Image style={BuyerStyle.HeaderBackground} source={Images.header_background}></Image>
				<TouchableOpacity style={{width:'20%', justifyContent:'center'}}>
				</TouchableOpacity>
				<Text style={BuyerStyle.header_title}>{STRINGS.t('Cost_First')}</Text>
				<TouchableOpacity style={{width:'20%', justifyContent:'center'}} onPress={() => {this.setModalAddressesVisible(!this.state.modalAddressesVisible)}}>
					<Text style={[BuyerStyle.headerbtnText,{alignSelf:'flex-end'}]}>{'Ok'}</Text>
				</TouchableOpacity>
			</View>
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
			</View>
			<PopupDialog dialogTitle={<View style={BuyerStyle.dialogtitle}><Text style={BuyerStyle.dialogtitletext}>Please select option below</Text></View>} 
			dialogStyle={ this.state.popupType == 'print' || this.state.popupType == 'email' ?  {height : '75%', width:'80%'} : { width:'80%'}  }  
			containerStyle={{elevation:10}} ref={(popupDialog) => { this.popupDialog = popupDialog; }}>
			
				{renderIf(this.state.popupType == 'print')(
				<View>
					<TouchableOpacity onPress={() => {this.printQuickDetailPDF("detailed")}}>
						<View style={BuyerStyle.dialogbtn}>
							<Text style={BuyerStyle.dialogbtntext}>
							{STRINGS.t('Print_Detailed_Estimate')}
							</Text>
						</View>
					</TouchableOpacity>	
					<TouchableOpacity onPress={() => {this.printQuickDetailPDF("quick")}}>
						<View style={BuyerStyle.dialogbtn}>
							<Text style={BuyerStyle.dialogbtntext}>
							{STRINGS.t('Print_Quick_Estimate')}
							</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => {this.printPDF("cdtc")}}>
						<View style={BuyerStyle.dialogbtn}>
							<Text style={BuyerStyle.dialogbtntext}>
							{STRINGS.t('Print_Buyer_Cdtc')}
							</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => {this.printPDF("trid")}}>
						<View style={BuyerStyle.dialogbtn}>
							<Text style={BuyerStyle.dialogbtntext}>
							{STRINGS.t('Print_Buyer_Trid')}
							</Text>
						</View>
					</TouchableOpacity>

					{renderIf(this.state.tab == 'Owner_Carry')(
						<TouchableOpacity onPress={() => {this.printPDF("owner_carry")}}>
							<View style={BuyerStyle.dialogbtn}>
								<Text style={BuyerStyle.dialogbtntext}>
								{STRINGS.t('Print_Owner_Carry')}
								</Text>
							</View>
						</TouchableOpacity>
					)}



					<TouchableOpacity style={BuyerStyle.buttonContainer} onPress={ () => {this.popupDialog.dismiss()}}>
					 <Text style={BuyerStyle.style_btnLogin}> {STRINGS.t('Cancel')}</Text>
					 </TouchableOpacity>	
				</View>
				)}
				
				{renderIf(this.state.popupType == 'email')(
				<View>
					<TouchableOpacity onPress={() => {this.setEmailModalQuickDetailVisible(!this.state.emailModalVisible, this.setState({emailType : 'detailed'}), this.popupDialog.dismiss())}}>
						<View style={BuyerStyle.dialogbtn}>
							<Text style={BuyerStyle.dialogbtntext}>
							{STRINGS.t('Email_Detailed_Estimate')}
							</Text>
						</View>
					</TouchableOpacity> 
									
					<TouchableOpacity onPress={() => {this.setEmailModalQuickDetailVisible(!this.state.emailModalVisible,this.setState({emailType : 'quick'}), this.popupDialog.dismiss())}}>
						<View style={BuyerStyle.dialogbtn}>
							<Text style={BuyerStyle.dialogbtntext}>
							{STRINGS.t('Email_Quick_Estimate')}
							</Text>
						</View>
					</TouchableOpacity>

					{renderIf(this.state.tab == 'Owner_Carry')(
						<TouchableOpacity onPress={() => {this.setEmailModalQuickDetailVisible(!this.state.emailModalVisible,this.setState({emailType : 'owner_carry', dropdownType : 'owner_carry'}), this.popupDialog.dismiss())}}>
							<View style={BuyerStyle.dialogbtn}>
								<Text style={BuyerStyle.dialogbtntext}>
								{STRINGS.t('Email_Owner_Carry')}
								</Text>
							</View>
						</TouchableOpacity>
					)}



					<TouchableOpacity onPress={() => {this.setEmailModalVisible(!this.state.emailModalVisible,this.setState({emailType : 'cdtc', dropdownType : 'cdtc'}), this.popupDialog.dismiss())}}>
						<View style={BuyerStyle.dialogbtn}>
							<Text style={BuyerStyle.dialogbtntext}>
							{STRINGS.t('Email_Buyer_Cdtc')}
							</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => {this.setEmailModalVisible(!this.state.emailModalVisible,this.setState({emailType : 'trid', dropdownType : 'trid'}), this.popupDialog.dismiss())}}>
						<View style={BuyerStyle.dialogbtn}>
							<Text style={BuyerStyle.dialogbtntext}>
							{STRINGS.t('Email_Buyer_Trid')}
							</Text>
						</View>
					</TouchableOpacity> 
					<TouchableOpacity style={BuyerStyle.buttonContainer} onPress={ () => {this.popupDialog.dismiss()}}>
					 <Text style={BuyerStyle.style_btnLogin}> {STRINGS.t('Cancel')}</Text>
					 </TouchableOpacity>	
				</View>
				)}

				{renderIf(this.state.popupType == 'loan_comparison')(
				<View>
					<TouchableOpacity onPress={() => {this.printLoanComparisonPDF()}}>
						<View style={BuyerStyle.dialogbtn}>
							<Text style={BuyerStyle.dialogbtntext}>
							{STRINGS.t('Loan_Comparison_Print')}
							</Text>
						</View>
					</TouchableOpacity> 
					<TouchableOpacity onPress={() => {this.printLoanComparisonEmail()}}>
						<View style={BuyerStyle.dialogbtn}>
							<Text style={BuyerStyle.dialogbtntext}>
							{STRINGS.t('Loan_Comparison_Email')}
							</Text>
						</View>
					</TouchableOpacity> 
					<TouchableOpacity style={BuyerStyle.buttonContainer} onPress={ () => {this.popupDialog.dismiss()}}>
					 <Text style={BuyerStyle.style_btnLogin}> {STRINGS.t('Cancel')}</Text>
					 </TouchableOpacity>	
				</View>
				)}
				
				{renderIf(this.state.popupType == 'msg_tab')(
				<View>
					<View style={BuyerStyle.scrollable_container_child_center}>
						<View style={BuyerStyle.two_columns_first_view}>
							<Text style={BuyerStyle.text_style}>
							{STRINGS.t('Upload_Image')}
							</Text>
						</View>
					</View>
					<View style={BuyerStyle.scrollable_container_child_center}>
						<View style={BuyerStyle.two_columns_first_view}>
						<TouchableOpacity onPress={() => {this.setEmailModalVisible(!this.state.emailModalVisible)}}>
							<Text style={BuyerStyle.text_style}>
							{STRINGS.t('Upload_From_Camera')}
							</Text>
						</TouchableOpacity> 
						</View>
					</View>
					<View style={BuyerStyle.scrollable_container_child_center}>
						<View style={BuyerStyle.two_columns_first_view}>
							<Text style={BuyerStyle.text_style}>
							{STRINGS.t('Upload_From_Gallery')}
							</Text>
						</View>
					</View>
					<TouchableOpacity style={BuyerStyle.buttonContainer} onPress={ () => {this.popupDialog.dismiss()}}>
					 <Text style={BuyerStyle.style_btnLogin}> {STRINGS.t('Cancel')}</Text>
					 </TouchableOpacity>	
				</View>
				)}
			
			</PopupDialog>

			<PopupDialog dialogTitle={<View style={BuyerStyle.dialogtitle}><Text style={BuyerStyle.dialogtitletext}>{STRINGS.t('Add_New_Contact_Address')}</Text></View>} dialogStyle={{width:'80%'}}  containerStyle={{elevation:10}} ref={(popupDialogAddEmailAddress) => { this.popupDialogAddEmailAddress = popupDialogAddEmailAddress; }}>			
			<View>
				<View style={BuyerStyle.contactAddressModalInputField}>
					<TextInput selectTextOnFocus={ true } autoCapitalize = 'words' style={BuyerStyle.inputFieldsDesignLayout} placeholder='Name' underlineColorAndroid='transparent' onChangeText={(value) => this.setState({newEmailContactName: value})} value={this.state.newEmailContactName} />
				</View>	   
				<View style={BuyerStyle.contactAddressModalInputField}>
					<TextInput ref="newEmailAddress" selectTextOnFocus={ true }  style={BuyerStyle.inputFieldsDesignLayout} placeholderTextColor={this.state.newEmailAddressError == "" ? "#999999": "red"} placeholder={this.state.newEmailAddressError == "" ? STRINGS.t('email_address') : this.state.newEmailAddressError} underlineColorAndroid='transparent'	onChangeText={(value) => this.setState({newEmailAddress: value})} keyboardType="email-address" value={this.state.newEmailAddress} />
				</View>

				<View style={BuyerStyle.contactAddressModalInputField}>
					<TextInput keyboardType="phone-pad" onChangeText={(value) => this.setState({contact_number: this.onChange(value)})}  onEndEditing={ (event) => this.updatePhoneNumberFormat(event.nativeEvent.text) } value={this.state.contact_number} selectTextOnFocus={ true }  style={BuyerStyle.inputFieldsDesignLayout} placeholder='Contact Number' underlineColorAndroid='transparent'/>
				</View>	
				<View style={BuyerStyle.ContactFormButtonMainView}>
					<TouchableOpacity style={BuyerStyle.ContactFormButtonDesign} onPress={this.onSaveNewContactAddress.bind(this)}>
						<Text style={BuyerStyle.style_btnLogin}> {STRINGS.t('Save')} </Text>
					</TouchableOpacity>
					<TouchableOpacity style={BuyerStyle.ContactFormButtonDesign} onPress={this.popupHideAddEmailAddress.bind(this, 'dont_save')}>
						<Text style={BuyerStyle.style_btnLogin}> {STRINGS.t('Dont_Save')}</Text>
					</TouchableOpacity>						
				</View>		
			</View>
			</PopupDialog>	
	
		</View>
		<DropdownAlert ref={(ref) => this.dropdown = ref} onClose={data => this.onClose(data)} />
					<View style={BuyerStyle.iphonexFooter}></View>
	</View>
		} else if (this.state.openMessagePopup == true) {
			showable=<MessageComponent tagInputValue={this.state.tagInputValue} cancelEmailPopup={this.cancelEmailPopup.bind(this)} textMsgPdfArray={this.state.textMsgPdfArray} emailModalVisible={true} to_email="" to_email_default="" text_message={this.state.text_message} />
		} else {
		showable=<View style={{flex : 1}}>
				<View style={{flex : 2}}>
					<View style={BuyerStyle.HeaderContainer}>	
						<Image style={BuyerStyle.HeaderBackground} source={Images.header_background}></Image>
						<TouchableOpacity style={{width:'20%'}} onPress={this.onBackHomePress.bind(this)}>
							<Image style={BuyerStyle.back_icon} source={Images.back_icon}/>
						</TouchableOpacity>
						<Text style={BuyerStyle.header_title}>{STRINGS.t('Buyer_Closing_Cost')}</Text>
			
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
	// (this.state.orientation == 'portrait') ? ( 

		// ) : (

		// //Landscape View
		// <View style={Styles.landscapetopcontainer}>
		// 	<View style={Styles.landscapeHeader}>
		// 		<Image style={Styles.landscapeHeaderBackground} source={Images.header_background}></Image>
		// 		<TouchableOpacity style={{width:'10%',height:50}} onPress={this.onLogoutPress.bind(this)}>
		// 			<Image style={Styles.landscapeBack_icon} source={Images.back_icon}/>
		// 		</TouchableOpacity>
		// 		<TouchableOpacity style={{width:'20%'}}>
		// 			<View style={[Styles.landscapesubheading, Styles.blueheadlandscape]}>
		// 				<Text style={Styles.landscapesubheadingtext}>{STRINGS.t('Buyers')}</Text>
		// 			</View>
		// 		</TouchableOpacity>
		// 		<TouchableOpacity style={{width:'20%'}}>
		// 			<View style={Styles.landscapesubheading}>
		// 				<Text style={Styles.landscapesubheadingtext}>{STRINGS.t('Sellers')}</Text>
		// 			</View>
		// 		</TouchableOpacity>
		// 		<TouchableOpacity style={{width:'20%'}}>
		// 			<View style={Styles.landscapesubheading}>
		// 				<Text style={Styles.landscapesubheadingtext}>{STRINGS.t('Netfirst')}</Text>
		// 			</View>
		// 		</TouchableOpacity>
		// 		<TouchableOpacity style={{width:'20%'}}>
		// 			<View style={Styles.landscapesubheading}>
		// 				<Text style={Styles.landscapesubheadingtext}>{STRINGS.t('Refinance')}</Text>
		// 			</View>
		// 		</TouchableOpacity>
		// 	</View>
		// 	<View style={Styles.landscapeCalculatorContent}>
		// 		<View style={Styles.landscapescrollview}>
		// 			<ScrollView
		// 				scrollEnabled={true}
		// 				showsVerticalScrollIndicator={true}
		// 				keyboardShouldPersistTaps="always"
		// 				keyboardDismissMode='on-drag'
		// 				style={Styles.landscapescroll}
		// 			>
		// 				<View style={Styles.landscapetitle}>
		// 					<Text style={Styles.landscapetitleText}>{STRINGS.t('buyersClosingCosts')}</Text>
		// 				</View>
		// 				<View style={Styles.landscapedataContent}>
		// 					<View style={Styles.landscapecontentBoxes}>
		// 						<View style={Styles.landscapedataBoxHeading}>
		// 							<Text style={Styles.landscapedataboxheadingtext}>{STRINGS.t('General_Information')}</Text>
		// 						</View>
		// 						<View style={Styles.landscapedataBox}>																						
		// 							<View style={Styles.landscapefieldcontainer}>	
		// 								<Text style={Styles.landscapefieldlabelbold}>{STRINGS.t('Prepared_By')}</Text>	
		// 								<View style={Styles.landscapefieldvaluebox}>
		// 								<TextInput selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
		// 								</View>									
		// 							</View>																						
		// 							<View style={Styles.landscapefieldcontainer}>	
		// 								<Text style={Styles.landscapefieldlabelbold}>{STRINGS.t('Prepared_For')}</Text>	
		// 								<View style={Styles.landscapefieldvaluebox}>
		// 								<TextInput selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
		// 								</View>									
		// 							</View>																						
		// 							<View style={Styles.landscapefieldcontainer}>	
		// 								<Text style={Styles.landscapefieldlabelbold}>{STRINGS.t('Address')}</Text>	
		// 								<View style={Styles.landscapefieldvaluebox}>
		// 								<TextInput selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
		// 								</View>									
		// 							</View>																						
		// 							<View style={Styles.landscapefieldcontainer}>	
		// 								<Text style={Styles.landscapefieldlabelbold}>{STRINGS.t('City')}</Text>	
		// 								<View style={Styles.landscapefieldvaluebox}>
		// 								<TextInput selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
		// 								</View>									
		// 							</View>	
		// 							<View style={Styles.landscapehalfsizefield}>
		// 								<View style={Styles.landscapefieldhalfcontainer}>	
		// 									<Text style={Styles.landscapefieldlabelbold}>{STRINGS.t('State')}</Text>	
		// 									<View style={Styles.landscapefieldvaluebox}>
		// 									<TextInput selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
		// 									</View>									
		// 								</View>	
		// 								<View style={Styles.landscapefieldhalfcontainer}>	
		// 									<Text style={[Styles.landscapefieldlabelbold, {textAlign:'center'}]}>{STRINGS.t('Zip')}</Text>	
		// 									<View style={Styles.landscapefieldvaluebox}>
		// 									<TextInput selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
		// 									</View>									
		// 								</View>		
		// 							</View>									
		// 						</View>
		// 						<View style={Styles.landscapedataBoxHeading}>
		// 							<Text style={Styles.landscapedataboxheadingtext}>{STRINGS.t('Sale_Price_Loan_Info')}</Text>
		// 						</View>
		// 						<View style={Styles.landscapedataBox}>																						
		// 							<View style={Styles.landscapefieldcontainer}>	
		// 								<Text style={Styles.landscapefieldlabelbold}>{STRINGS.t('Sale_Price')}</Text>	
		// 								<View style={Styles.landscapefieldvaluebox}>
		// 								<TextInput selectTextOnFocus={ true } placeholder='0.00' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
		// 								</View>									
		// 							</View>																						
		// 							<View style={Styles.landscapefieldcontainer}>	
		// 								<Text style={Styles.landscapefieldlabel}>{STRINGS.t('Buyer_Loan_Type')}</Text>	
		// 								<View style={Styles.landscapefieldvaluebox}>
		// 								<TextInput selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
		// 								</View>									
		// 							</View>		
		// 							<View style={Styles.landscapefieldcontainer}>
		// 								<View style={Styles.landscapetriplefieldlabel}>
		// 								</View>
		// 								<View style={{width:'5%'}}></View>	
		// 								<Text style={Styles.landscapebalancerate}>{STRINGS.t('1_loan')}</Text>
		// 								<View style={{width:'5%'}}></View>	
		// 								<Text style={Styles.landscapebalancerate}>{STRINGS.t('2_loan')}</Text>	
		// 							</View>
		// 							<View style={Styles.landscapefieldcontainer}>
		// 								<View style={Styles.landscapetriplefieldlabel}>
		// 									<Text style={Styles.landscapenormalfulltext}>{STRINGS.t('loan_to_value')}:</Text>
		// 								</View>	
		// 								<Text style={[Styles.landscapefieldval,{width:'5%'}]}>%</Text>	
		// 								<TextInput selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapetriplefieldval} underlineColorAndroid='transparent'/>
		// 								<Text style={[Styles.landscapefieldval,{width:'5%'}]}>%</Text>	
		// 								<TextInput selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapetriplefieldval} underlineColorAndroid='transparent'/>	
		// 							</View>				
		// 							<View style={Styles.landscapefieldcontainer}>
		// 								<View style={Styles.landscapetriplefieldlabel}>
		// 									<Text style={Styles.landscapenormalfulltext}>{STRINGS.t('rate')}:</Text>
		// 								</View>	
		// 								<Text style={[Styles.landscapefieldval,{width:'5%'}]}>%</Text>	
		// 								<TextInput selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapetriplefieldval} underlineColorAndroid='transparent'/>
		// 								<Text style={[Styles.landscapefieldval,{width:'5%'}]}>%</Text>	
		// 								<Text placeholder='John Ace' keyboardType="numeric" style={Styles.landscapetriplefieldvaltext} underlineColorAndroid='transparent'>0.00</Text>	
		// 							</View>			
		// 							<View style={Styles.landscapefieldcontainer}>
		// 								<View style={Styles.landscapetriplefieldlabel}>
		// 									<Text style={Styles.landscapenormalfulltext}>{STRINGS.t('term')}:</Text>
		// 								</View>	
		// 								<Text style={[Styles.landscapefieldval,{width:'5%'}]}></Text>	
		// 								<TextInput selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapetriplefieldval} underlineColorAndroid='transparent'/>
		// 								<Text style={[Styles.landscapefieldval,{width:'5%'}]}></Text>	
		// 								<Text placeholder='John Ace' keyboardType="numeric" style={[Styles.landscapefieldval,{width:'30%'}]} underlineColorAndroid='transparent'>10</Text>	
		// 							</View>				
		// 							<View style={Styles.landscapefieldcontainer}>
		// 								<View style={Styles.landscapetriplefieldlabel}>
		// 									<Text style={Styles.landscapenormalfulltext}>{STRINGS.t('loan_amount')}:</Text>
		// 								</View>	
		// 								<Text style={[Styles.landscapefieldval,{width:'5%'}]}>$</Text>	
		// 								<Text placeholder='John Ace' keyboardType="numeric" style={[Styles.landscapefieldval,{width:'30%'}]} underlineColorAndroid='transparent'>10</Text>
		// 								<Text style={[Styles.landscapefieldval,{width:'5%'}]}>$</Text>	
		// 								<Text placeholder='John Ace' keyboardType="numeric" style={[Styles.landscapefieldval,{width:'30%'}]} underlineColorAndroid='transparent'>10</Text>	
		// 							</View>																				
		// 							<View style={Styles.landscapefieldcontainer}>	
		// 								<Text style={Styles.landscapefieldlabel}>{STRINGS.t('down_payment')}</Text>
		// 								<Text style={Styles.landscape20percenttext}>$</Text>	
		// 								<View style={Styles.landscapefieldvaluesmallbox}>
		// 								<TextInput selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
		// 								</View>									
		// 							</View>																			
		// 							<View style={Styles.landscapefieldcontainer}>	
		// 								<Text style={Styles.landscapefieldlabel}>{STRINGS.t('Est_Settlement_Date')}</Text>	
		// 								<Text style={Styles.landscape20percenttext}></Text>
		// 								<View style={Styles.landscapefieldvaluesmallbox}>
		// 									<DatePicker style={Styles.landscapefielddateval} showIcon={false} date={this.state.date} mode="date" placeholder="select date" format="YYYY-MM-DD" minDate={this.state.date1} confirmBtnText="Confirm" cancelBtnText="Cancel" customStyles={{dateInput: {borderWidth:0}}} onDateChange={(date) => this.changeDate(date)} />
		// 								</View>									
		// 							</View>																					
		// 							<View style={Styles.landscapefieldcontainer}>	
		// 								<Text style={Styles.landscapefieldlabel}>{STRINGS.t('annual_prop_tax')}</Text>
		// 								<Text style={Styles.landscape20percenttext}>$</Text>	
		// 								<View style={Styles.landscapefieldvaluesmallbox}>
		// 								<TextInput selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
		// 								</View>									
		// 							</View>															
		// 						</View>
		// 					</View>
		// 					<View style={Styles.landscapecontentBoxes}>
		// 						<View style={Styles.landscapedataBoxHeading}>
		// 							<Text style={Styles.landscapedataboxheadingtext}>{STRINGS.t('Total_Closing_Cost')}</Text>
		// 						</View>
		// 						<View style={Styles.landscapedataBox}>																							
		// 							<View style={Styles.landscapefieldcontainer}>	
		// 								<Text style={Styles.landscapefieldlabel}>{STRINGS.t('Escrow_or_Settlement')}</Text>
		// 								<View style={Styles.landscapedropdowncontainer}>
		// 									<Text style={Styles.landscapedropdowntext}>{STRINGS.t('Split')}</Text>
		// 									<Text style={Styles.landscapedropdownnexttext}>$</Text>
		// 								</View>	
		// 								<View style={Styles.landscapefieldvaluesmallbox}>
		// 								<TextInput selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
		// 								</View>									
		// 							</View>																								
		// 							<View style={Styles.landscapefieldcontainer}>	
		// 								<Text style={Styles.landscapefieldlabel}>{STRINGS.t('Owners_Title_Policy')}</Text>
		// 								<View style={Styles.landscapedropdowncontainer}>
		// 									<Text style={Styles.landscapedropdowntext}>{STRINGS.t('Split')}</Text>
		// 									<Text style={Styles.landscapedropdownnexttext}>$</Text>
		// 								</View>	
		// 								<View style={Styles.landscapefieldvaluesmallbox}>
		// 								<TextInput selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
		// 								</View>									
		// 							</View>																													
		// 							<View style={Styles.landscapefieldcontainer}>	
		// 								<Text style={Styles.landscapefieldlabel}>{STRINGS.t('Lenders_Title_Policy')}</Text>
		// 								<View style={Styles.landscapedropdowncontainer}>
		// 									<Text style={Styles.landscapedropdowntext}>{STRINGS.t('Split')}</Text>
		// 									<Text style={Styles.landscapedropdownnexttext}>$</Text>
		// 								</View>	
		// 								<View style={Styles.landscapefieldvaluesmallbox}>
		// 								<TextInput selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
		// 								</View>									
		// 							</View>		
		// 							<View style={Styles.landscapefieldcontainer}>
		// 								<View style={Styles.landscapetriplefieldlabel}>
		// 									<Text style={Styles.landscapenormalfulltext}>{STRINGS.t('Discount')}</Text>
		// 								</View>	
		// 								<Text style={[Styles.landscapefieldval,{width:'5%'}]}>%</Text>	
		// 								<TextInput selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapetriplefieldval} underlineColorAndroid='transparent'/>
		// 								<Text style={[Styles.landscapefieldval,{width:'5%'}]}>$</Text>	
		// 								<TextInput selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapetriplefieldval} underlineColorAndroid='transparent'/>	
		// 							</View>																												
		// 							<View style={Styles.landscapefieldcontainer}>	
		// 								<Text style={Styles.landscapefieldlabel}>{STRINGS.t('Origination_fee')}</Text>
		// 								<Text style={Styles.landscape20percenttext}>$</Text>	
		// 								<View style={Styles.landscapefieldvaluesmallbox}>
		// 								<TextInput selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
		// 								</View>									
		// 							</View>																												
		// 							<View style={Styles.landscapefieldcontainer}>	
		// 								<Text style={Styles.landscapefieldlabel}>{STRINGS.t('processing_fees')}</Text>
		// 								<Text style={Styles.landscape20percenttext}>$</Text>	
		// 								<View style={Styles.landscapefieldvaluesmallbox}>
		// 								<TextInput selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
		// 								</View>									
		// 							</View>																												
		// 							<View style={Styles.landscapefieldcontainer}>	
		// 								<Text style={Styles.landscapefieldlabel}>{STRINGS.t('tax_service_contact')}</Text>
		// 								<Text style={Styles.landscape20percenttext}>$</Text>	
		// 								<View style={Styles.landscapefieldvaluesmallbox}>
		// 								<TextInput selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
		// 								</View>									
		// 							</View>																												
		// 							<View style={Styles.landscapefieldcontainer}>	
		// 								<Text style={Styles.landscapefieldlabel}>{STRINGS.t('Document_Preparation')}</Text>
		// 								<Text style={Styles.landscape20percenttext}>$</Text>	
		// 								<View style={Styles.landscapefieldvaluesmallbox}>
		// 								<TextInput selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
		// 								</View>									
		// 							</View>																												
		// 							<View style={Styles.landscapefieldcontainer}>	
		// 								<Text style={Styles.landscapefieldlabel}>{STRINGS.t('Underwriting')}</Text>
		// 								<Text style={Styles.landscape20percenttext}>$</Text>	
		// 								<View style={Styles.landscapefieldvaluesmallbox}>
		// 								<TextInput selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
		// 								</View>									
		// 							</View>																					
		// 							<View style={Styles.landscapefieldcontainer}>	
		// 								<Text style={Styles.landscapefieldlabel}>{STRINGS.t('appraisal')}</Text>
		// 								<Text style={Styles.landscape20percenttext}>$</Text>	
		// 								<View style={Styles.landscapefieldvaluesmallbox}>
		// 								<TextInput selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
		// 								</View>									
		// 							</View>																					
		// 							<View style={Styles.landscapefieldcontainer}>	
		// 								<Text style={Styles.landscapefieldlabel}>{STRINGS.t('credit_report')}</Text>
		// 								<Text style={Styles.landscape20percenttext}>$</Text>	
		// 								<View style={Styles.landscapefieldvaluesmallbox}>
		// 								<TextInput selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
		// 								</View>									
		// 							</View>																				
		// 							<View style={Styles.landscapefieldcontainer}>	
		// 								<Text style={Styles.landscapefieldlabel}>{STRINGS.t('recording_fee')}</Text>
		// 								<Text style={Styles.landscape20percenttext}>$</Text>	
		// 								<View style={Styles.landscapefieldvaluesmallbox}>
		// 								<TextInput selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
		// 								</View>									
		// 							</View>																				
		// 							<View style={Styles.landscapefieldcontainer}>	
		// 								<Text style={Styles.landscapefieldlabel}>{STRINGS.t('homeWarranty')}</Text>
		// 								<Text style={Styles.landscape20percenttext}>$</Text>	
		// 								<View style={Styles.landscapefieldvaluesmallbox}>
		// 								<TextInput selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
		// 								</View>									
		// 							</View>																						
		// 							<View style={Styles.landscapefieldcontainer}>	
		// 								<Text style={Styles.landscapefieldlabel}>{STRINGS.t('floodcert')}</Text>
		// 								<Text style={Styles.landscape20percenttext}>$</Text>	
		// 								<View style={Styles.landscapefieldvaluesmallbox}>
		// 								<TextInput selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
		// 								</View>									
		// 							</View>																				
		// 							<View style={Styles.landscapefieldcontainer}>	
		// 								<Text style={Styles.landscapefieldlabel}>{STRINGS.t('fed_ex_outside_courier')}</Text>
		// 								<Text style={Styles.landscape20percenttext}>$</Text>	
		// 								<View style={Styles.landscapefieldvaluesmallbox}>
		// 								<TextInput selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
		// 								</View>									
		// 							</View>																				
		// 							<View style={Styles.landscapefieldcontainer}>	
		// 								<Text style={Styles.landscapefieldlabel}>{STRINGS.t('endorsement')}</Text>
		// 								<Text style={Styles.landscape20percenttext}>$</Text>	
		// 								<View style={Styles.landscapefieldvaluesmallbox}>
		// 								<TextInput selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
		// 								</View>									
		// 							</View>																				
		// 							<View style={Styles.landscapefieldcontainer}>	
		// 								<Text style={Styles.landscapefieldlabel}>{STRINGS.t('notarySigningService')}</Text>
		// 								<Text style={Styles.landscape20percenttext}>$</Text>	
		// 								<View style={Styles.landscapefieldvaluesmallbox}>
		// 								<TextInput selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
		// 								</View>									
		// 							</View>																				
		// 							<View style={Styles.landscapefieldcontainer}>	
		// 								<Text style={Styles.landscapefieldlabel}>{STRINGS.t('loanTieInFee')}</Text>
		// 								<Text style={Styles.landscape20percenttext}>$</Text>	
		// 								<View style={Styles.landscapefieldvaluesmallbox}>
		// 								<TextInput selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
		// 								</View>									
		// 							</View>																				
		// 							<View style={Styles.landscapefieldcontainer}>	
		// 								<Text style={Styles.landscapefieldlabel}>{STRINGS.t('sellerPaidCC')}</Text>
		// 								<Text style={Styles.landscape20percenttext}>$</Text>	
		// 								<View style={Styles.landscapefieldvaluesmallbox}>
		// 								<TextInput selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
		// 								</View>									
		// 							</View>																				
		// 							<View style={Styles.landscapefieldcontainer}>	
		// 								<Text style={Styles.landscapefieldlabel}>{STRINGS.t('pad_for_adjustment')}</Text>
		// 								<Text style={Styles.landscape20percenttext}>$</Text>	
		// 								<View style={Styles.landscapefieldvaluesmallbox}>
		// 								<TextInput selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
		// 								</View>									
		// 							</View>		
		// 							<View style={[Styles.fullunderline, {marginTop:10}]}></View>
		// 							<View style={Styles.landscapehalfsizefield}>
		// 								<Text style={[Styles.landscapetexthead, {marginTop:5,width:'70%'}]}>{STRINGS.t('Total_Closing_Cost')}</Text>
		// 								<Text style={[Styles.landscapetexthead, {marginTop:5,textAlign:'right'}]}>$ 0.00</Text>	
		// 							</View>
		// 							<View style={[Styles.fullunderline, {marginTop:5,}]}></View>																													
		// 						</View>
		// 						<View style={{marginTop:40}}></View>
		// 					</View>
		// 					<View style={Styles.landscapecontentBoxes}>
		// 						<View style={Styles.landscapedataBoxHeading}>
		// 							<Text style={Styles.landscapedataboxheadingtext}>{STRINGS.t('prepaid')}</Text>
		// 						</View>
		// 						<View style={Styles.landscapedataBox}>
		// 							<View style={Styles.landscapefieldcontainer}>
		// 								<TextInput selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapetriplefieldvalsmall} underlineColorAndroid='transparent'/>
		// 								<View style={Styles.landscapetriplefieldlabelsmall}>
		// 									<Text style={[Styles.landscapenormalfulltext,{paddingLeft:5}]}>{STRINGS.t('Mo_Taxes')}</Text>
		// 								</View>	
		// 								<Text style={[Styles.landscapefieldval,{width:'10%',paddingLeft:'5%'}]}>%</Text>	
		// 								<TextInput selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapetriplefieldvalsmall} underlineColorAndroid='transparent'/>
		// 								<Text style={[Styles.landscapefieldval,{width:'5%'}]}>$</Text>	
		// 								<TextInput selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapetriplefieldval} underlineColorAndroid='transparent'/>		
		// 							</View>	
		// 							<View style={Styles.landscapefieldcontainer}>
		// 								<TextInput selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapetriplefieldvalsmall} underlineColorAndroid='transparent'/>
		// 								<View style={Styles.landscapetriplefieldlabelsmall}>
		// 									<Text style={[Styles.landscapenormalfulltext,{paddingLeft:5}]}>{STRINGS.t('Mo_Insur')}</Text>
		// 								</View>	
		// 								<Text style={[Styles.landscapefieldval,{width:'10%',paddingLeft:'5%'}]}>%</Text>	
		// 								<TextInput selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapetriplefieldvalsmall} underlineColorAndroid='transparent'/>
		// 								<Text style={[Styles.landscapefieldval,{width:'5%'}]}>$</Text>	
		// 								<TextInput selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapetriplefieldval} underlineColorAndroid='transparent'/>		
		// 							</View>																						
		// 							<View style={Styles.landscapefieldcontainer}>	
		// 								<TextInput selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={[Styles.landscapetriplefieldval,{width:'15%'}]} underlineColorAndroid='transparent'/>
		// 								<Text style={Styles.landscape50percenttext}>  {STRINGS.t('days_interest')}</Text>	
		// 								<Text style={[Styles.landscapefieldval,{width:'5%'}]}>$</Text>	
		// 								<View style={Styles.landscapefieldvaluesmallbox}>
		// 								<Text style={Styles.landscapefieldval}>0.00</Text>
		// 								</View>									
		// 							</View>
		// 							<View style={Styles.landscapefieldcontainer}>
		// 								<View style={[Styles.landscapetriplefieldlabel, {marginLeft:'35%',alignItems:'center'}]}>
		// 									<Text style={Styles.landscapenormalfulltext}>{STRINGS.t('2_Months')}</Text>
		// 								</View>	
		// 								<Text style={[Styles.landscapefieldval,{width:'5%'}]}>$</Text>	
		// 								<TextInput selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapetriplefieldval} underlineColorAndroid='transparent'/>	
		// 							</View>	
		// 							<View style={[Styles.fullunderline,{marginTop:10}]}></View>	
		// 							<View style={Styles.landscapehalfsizefield}>
		// 								<Text style={[Styles.landscapetexthead, {marginTop:5,width:'70%'}]}>{STRINGS.t('cost')}</Text>
		// 								<Text style={[Styles.landscapetexthead, {marginTop:5,textAlign:'right'}]}>{STRINGS.t('amount')}</Text>	
		// 							</View>																			
		// 							<View style={Styles.landscapefieldcontainer}>	
		// 								<Text style={Styles.landscapefieldlabel}>{STRINGS.t('Other')}</Text>
		// 								<Text style={Styles.landscape20percenttext}>$</Text>	
		// 								<View style={Styles.landscapefieldvaluesmallbox}>
		// 								<TextInput selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
		// 								</View>									
		// 							</View>	
		// 							<View style={Styles.landscapehalfsizefield}>
		// 								<Text style={[Styles.landscapetexthead, {marginTop:5,width:'70%'}]}>{STRINGS.t('Total_Prepaid_items')}</Text>
		// 								<Text style={[Styles.landscapetexthead, {marginTop:5,textAlign:'right'}]}>$ 0.00</Text>	
		// 							</View>												
		// 						</View>
		// 						<View style={Styles.landscapedataBoxHeading}>
		// 							<Text style={Styles.landscapedataboxheadingtext}>{STRINGS.t('Payment')}</Text>
		// 						</View>
		// 						<View style={Styles.landscapedataBox}>
		// 							<View style={Styles.landscapehalfsizefield}>
		// 								<Text style={[Styles.landscapetextheaddata, {marginTop:5,width:'70%'}]}>{STRINGS.t('principal_and_interest')}</Text>
		// 								<Text style={[Styles.landscapetextheaddata, {marginTop:5,textAlign:'right',paddingLeft:5}]}>$ 0.00</Text>	
		// 							</View>	
		// 							<View style={[Styles.landscapehalfsizefield, {marginTop:5}]}>
		// 								<Text style={[Styles.landscapetextheaddata, {marginTop:5,width:'70%'}]}>{STRINGS.t('real_estate_taxes')}</Text>
		// 								<Text style={[Styles.landscapetextheaddata, {marginTop:5,textAlign:'right',paddingLeft:5}]}>$ 0.00</Text>	
		// 							</View>	
		// 							<View style={[Styles.landscapehalfsizefield, {marginTop:5}]}>
		// 								<Text style={[Styles.landscapetextheaddata, {marginTop:5,width:'70%'}]}>{STRINGS.t('home_owners_insurance')}</Text>
		// 								<Text style={[Styles.landscapetextheaddata, {marginTop:5,textAlign:'right',paddingLeft:5}]}>$ 0.00</Text>	
		// 							</View>	
		// 							<View style={[Styles.landscapehalfsizefield, {marginTop:5}]}>
		// 								<TextInput selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapetriplefieldvalsmall} underlineColorAndroid='transparent'/>
		// 								<Text style={[Styles.landscapetextheaddata, {marginTop:5,width:'55%',paddingLeft:5}]}>{STRINGS.t('home_owners_insurance')}</Text>
		// 								<Text style={[Styles.landscapetextheaddata, {marginTop:5,textAlign:'right',paddingLeft:5}]}>$ 0.00</Text>	
		// 							</View>	
		// 							<View style={[Styles.fullunderline,{marginTop:10}]}></View>	
		// 							<View style={Styles.landscapehalfsizefield}>
		// 								<Text style={[Styles.landscapetexthead, {marginTop:5,width:'70%'}]}>{STRINGS.t('monthly_expenses')}</Text>
		// 								<Text style={[Styles.landscapetexthead, {marginTop:5,textAlign:'right'}]}>{STRINGS.t('amount')}</Text>	
		// 							</View>																			
		// 							<View style={Styles.landscapefieldcontainer}>	
		// 								<Text style={Styles.landscapefieldlabel}>{STRINGS.t('HOA')}</Text>
		// 								<Text style={Styles.landscape20percenttext}>$</Text>	
		// 								<View style={Styles.landscapefieldvaluesmallbox}>
		// 								<TextInput selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
		// 								</View>									
		// 							</View>																			
		// 							<View style={Styles.landscapefieldcontainer}>	
		// 								<Text style={Styles.landscapefieldlabel}>{STRINGS.t('Other')}</Text>
		// 								<Text style={Styles.landscape20percenttext}>$</Text>	
		// 								<View style={Styles.landscapefieldvaluesmallbox}>
		// 								<TextInput selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
		// 								</View>									
		// 							</View>												
		// 						</View>
		// 						<View style={Styles.landscapedataBoxHeading}>
		// 							<Text style={Styles.landscapedataboxheadingtext}>{STRINGS.t('total')}</Text>
		// 						</View>
		// 						<View style={Styles.landscapedataBox}>
		// 							<View style={Styles.landscapehalfsizefield}>
		// 								<Text style={[Styles.landscapetexthead, {marginTop:5,width:'70%'}]}>{STRINGS.t('Total_Monthly_Payment')}</Text>
		// 								<Text style={[Styles.landscapetexthead, {marginTop:5,textAlign:'right'}]}>$ 0.00</Text>	
		// 							</View>																		
		// 							<View style={Styles.landscapefieldcontainer}>	
		// 								<Text style={Styles.landscapefieldlabel}>{STRINGS.t('est_tax_proration')}</Text>
		// 								<Text style={Styles.landscape20percenttext}></Text>	
		// 								<View style={Styles.landscapefieldvaluesmallbox}>
		// 								<TextInput selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
		// 								</View>									
		// 							</View>
		// 							<View style={Styles.landscapehalfsizefield}>
		// 								<Text style={[Styles.landscapetexthead, {marginTop:5,width:'70%'}]}>{STRINGS.t('total_investment')}</Text>
		// 								<Text style={[Styles.landscapetexthead, {marginTop:5,textAlign:'right'}]}>$ 0.00</Text>	
		// 							</View>											
		// 						</View>
		// 					</View>
		// 				</View>
		// 			</ScrollView>
		// 		</View>
		// 	</View>
		// </View>
		// )	


);
}
}
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
