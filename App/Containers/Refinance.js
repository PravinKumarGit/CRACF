import React, { Component } from 'react';
import { Container, Left, Right, Icon, Title, Body, Button } from 'native-base';
import { Image, View, Dimensions, Alert, Text, TextInput, TouchableOpacity, TouchableHighlight, ScrollView, AsyncStorage, ListView, Modal, ToolbarAndroid, StyleSheet, BackHandler, Keyboard, Platform, NetInfo } from 'react-native';
import Images from '../Themes/Images.js';
import BuyerStyle from './Styles/BuyerStyle';
import { CheckBox } from 'react-native-elements';
import CustomStyle from './Styles/CustomStyle';
import Styles from './Styles/SellerStyleDesign';
import CameraStyle from './Styles/CameraStyle';
import renderIf from 'render-if';
import MessageComponent from './MessageComponent';
import { callGetApi, callPostApi } from '../Services/webApiHandler.js'; // Import 
import STRINGS from '../GlobalString/StringData';  // Import StringData.js class for string localization.
import Picker from 'react-native-picker';
import DatePicker from 'react-native-datepicker';
import Spinner from 'react-native-loading-spinner-overlay';
import ModalDropdown from 'react-native-modal-dropdown';
import AutoTags from 'react-native-tag-autocomplete';

//import { ThemeProvider, Toolbar, COLOR } from 'react-native-material-ui';
import { Dropdown } from 'react-native-material-dropdown';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { validateEmail } from '../Services/CommonValidation.js';
import { getRefAmountConventional, getRefDiscountAmount, getRefAmountFHA, getRefAdjustedVA, getRefAdjustedUSDA, getRefPreMonthTax, getRefMonthlyInsurance, getRefDailyInterest, getRefFhaMipFinance, getRefUsdaMipFinance, getRefVaFundingFinance, getRefMonthlyRateMMI, getRefSumOfAdjustment, getRefRealEstateTaxes, getRefHomeOwnerInsurance, getRefTotalPrepaidItems, getRefTotalMonthlyPayment, getRefTotalInvestment, getRefOriginationFee, get2ndTd, getRefExistingBalanceCalculation, getRefTotalCostRate, getActualAnnualTax, getActualAnnualIns, getRefCostTypeTotal, getDiscountYearChng } from '../Services/refinance_calculator.js'
import SelectMultiple from 'react-native-select-multiple'
import { getUptoTwoDecimalPoint } from '../Services/app_common_func.js'
import Device from '../Constants/Device'
import Selectbox from 'react-native-selectbox';
import DropdownAlert from 'react-native-dropdownalert'
import CustomKeyboard from '../customKeyboard/CustomKeyboard';
//import { defaultFormatUtc } from 'moment';
import Voice from 'react-native-voice';
var nlp = require('compromise');
import dashboardStyle from './Styles/DashboardStyle'
var nativeImageSource = require('nativeImageSource');
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

var Header = require('./Header');
var GLOBAL = require('../Constants/global');
const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
	preview: {
		justifyContent: 'flex-end',
		alignItems: 'center',
		width: "100%",
		height: "100%"
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

// you can set your style right here, it'll be propagated to application
const uiTheme = {
	toolbar: {
		container: {
			backgroundColor: 'transparent',
		},
	},
};

import PopupDialog from 'react-native-popup-dialog';
import PopupDialogEmail from 'react-native-popup-dialog';
import OpenFile from 'react-native-doc-viewer';
import ImagePicker from 'react-native-image-crop-picker';
import Camera from 'react-native-camera';
import { authenticateUser } from '../Services/CommonValidation.js'  // Import CommonValidation class to access common methods for validations.
import { insertText, CustomTextInput, install } from 'react-native-custom-keyboard';

export default class Refinance extends Component {
	constructor(props) {
		super(props);
		//Estimated date
		//register('hello', () => CustomKeyboard);
		var now = new Date();
		now.setDate(now.getDate() + 45);
		var date = (now.getMonth() + 1) + '-' + now.getDate() + '-' + now.getFullYear();
		var monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
		this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
		// For showing list of buyer's calculator in popup onload so that error will not occur
		var ds = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2
		});
		var calcList = {};
		calcList['calculatorName'] = 'calculatorName';

		var addrsList = {};
		addrsList['email'] = 'email';
		this.state = {
			orientation: Device.isPortrait() ? 'portrait' : 'landscape',
			devicetype: Device.isTablet() ? 'tablet' : 'phone',
			initialOrientation: '',
			isChecked: true,
			isCheckedUSDA: true,
			isCheckedVA: true,
			disablefhamipcheckbox: false,
			openMessagePopup: false,
			tab: 'CONV',
			footer_tab: 'refinance',
			todaysInterestRate: '',
			termsOfLoansinYears: '0.00',
			termsOfLoansinYears2: '0.00',
			languageType: 'en',
			date: date,
			ltv: '80.00',
			ltv2: '0.00',
			suggestions: "",
			tagsSelected : [],
			tagsSelectedForEmail : [],
			reissueSalePriceEditableStatus: true,
			isCheckForOhio: false,
			reissueSalePrice: '0.00',
			reissueYearDropdownVal: 0,
			connectionInfo: '',
			downPaymentFixed: false,
			escrowQuote: '0.00',
			titleInsOrg: '0.00',
			fhaMaxLoanAmount: '0.00',
			vAmaxloanamount: '0.00',
			down_payment: '',
			loan_amt: '',
			loan_amt2: '',
			count: 0,
			isFocus: false,
			discountYearSelectedDropdownVal: { key: 0, label: 'Year', value: '0' },
			discountYearDropdownVal: [
				{ key: 0, label: 'Year', value: '0' }, { key: 1, label: '2', value: '40' }, { key: 2, label: '3', value: '35' }, { key: 3, label: '4', value: '30' }, { key: 4, label: '5', value: '25' }, { key: 5, label: '6', value: '20' }, { key: 6, label: '7', value: '15' }
			],
			sale_pr: '0.00',
			sale_pr_calc: '0.00',
			sale_pr_empty: '',
			creditReport: '',
			ownerFee: '',
			ownerPolicyType: '',
			escrowFee: '0.00',
			escrowPolicyType: '',
			lenderFee: '',
			lenderPolicyType: '',
			payoff: 0,
			payoffval: '0.00',
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
			fee11: '',
			label11: '',
			imageNameEmail: '',
			videoNameEmail: '',
			numberOfDaysPerMonth: '',
			numberOfMonthsInsurancePrepaid: '0',
			monTax: '',
			monIns: '',
			monTaxFixed: false,
			monInsFixed: false,
			numberOfDaysPerMonthFixed: false,
			costOtherFixed: false,
			CDTC_Status: false,
			TRID_Status: false,
			CDTC_TRID_Status: false,
			emailType: '',
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
			VaFfFin: '',
			VaFfFin1: '',
			VaFfFin2: '',
			VaFfFin3: '',
			monthlyRate: '',
			monthPmiVal: '0.00',
			rateValue: '',
			principalRate: '',
			realEstateTaxesRes: '',
			homeOwnerInsuranceRes: '',
			buyerFooterTab: true,
			totalClosingCost: '0.00',
			totalPrepaidItems: '0.00',
			totalMonthlyPayment: '0.00',
			totalInvestment: '0.00',
			first_name: '',
			last_name: '',
			mailing_address: '',
			lender_address: '',
			user_state: '',
			postal_code: '',
			content: '',
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
			cashBorrowerText: 'Cash To Borrower',
			interestRateCap: '',
			interestRateCap2: '',
			perAdjustment: '',
			perAdjustment2: '',
			costType_1Value: '',
			costTotalFee_2Value: '',
			escrowFeeOrg: '',
			lenderFeeOrg: '',
			ownerFeeOrg: '',
			modalVisible: false,
			modalAddressesVisible: false,
			emailModalVisible: false,
			printModalVisible: false,
			GooglePlaceAutoCompleteShow: false,
			enterAddressBar: false,
			taxservicecontractFixed: false,
			underwritingFixed: false,
			processingfeeFixed: false,
			appraisalfeeFixed: false,
			documentprepFixed: false,
			originationfactorFixed: false,
			originationFactorTypeFixed: false,
			listBuyerCalculation: '',
			dataSource: ds.cloneWithRows(calcList),
			dataSourceOrg: ds.cloneWithRows(calcList),
			dataSourceEmpty: ds.cloneWithRows(calcList),
			emptCheck: false,
			addrsSource: ds.cloneWithRows(addrsList),
			toolbarActions: [{ value: 'SAVE' }, { value: 'OPEN' }, { value: 'PRINT' }, { value: 'EMAIL' }, { value : 'MESSAGE' }],
			camera: {
				aspect: Camera.constants.Aspect.fill,
				captureTarget: Camera.constants.CaptureTarget.cameraRoll,
				captureMode: Camera.constants.CaptureMode.video,
				type: Camera.constants.Type.back,
				orientation: Camera.constants.Orientation.auto,
				flashMode: Camera.constants.FlashMode.auto,
			},
			isRecording: false,
			isAddrsChecked: false,
			to_email: '',
			to_email_default: '',
			email_subject: '',
			imageData: '',
			videoData: '',
			videoModalVisible: false,
			emailAddrsList: [],
			currencySign: '',
			loansToBePaid_1Balance: '0.00',
			loansToBePaid_1Rate: '0.00',
			loansToBePaid_2Balance: '0.00',
			loansToBePaid_2Rate: '0.00',
			loansToBePaid_3Balance: '0.00',
			loansToBePaid_3Rate: '0.00',
			existingTotal: '0.00',
			originationfactor: '0.00',
			originationFactorType: '',
			taxservicecontract: '0.00',
			default_address: '',
			underwriting: '0.00',
			keyword: '',
			pnintrate: '0.00',
			Vaff: '0.00',
			processingfee: '0.00',
			appraisalfee: '0.00',
			prepaymentpenaltyfee: '0.00',
			documentprep: '0.00',
			daysInterestRef: '0.00',
			act_annual_tax: '0.00',
			act_annual_ins: '0.00',
			titleInsuranceShortRate: '0.00',
			paymentAmount1Fixed: false,
			paymentAmount2Fixed: false,
			invalidEmailStatus: false,
			deviceName: "",
			contact_number: '',
			newEmailAddress: '',
			newEmailContactName: '',
			newEmailAddressError: '',
			verified_email: '',
			numberOfDaysPerMonthBuyer: '',
			escrowTotal: '0.00',
			speakTextStatus: 'Please speak & wait for recognization...',
			speakToTextVal: false,
			voiceInput: false,
			TextInput: false,
			recognized: '',
			pitch: '',
			error: '',
			end: '',
			started: '',
			tagInputValue: '',
			textMsgPdfArray: "",
			speaktoText: false,
			speakToTextStatus: false,
			actAnnualTaxHeight: '0',
			actAnnualInsHeight: '0',
			ltvHeight: '0',
			todaysInterestRateHeight: '0',
			termsOfLoansinYearsHeight: '0',
			loanAmtHeight: '0',
			existingfirstHeight: '0',
			existingsecondHeight: '0',
			existingthirdHeight: '0',
			numberOfDaysPerMonthBuyerHeight: '0',
			escrowFeeHeight: '0',
			titleInsuranceShortRateHeight: '0',
			discHeight: '0',
			originationFeeHeight: '0',
			processingfeeHeight: '0',
			taxservicecontractHeight: '0',
			documentprepHeight: '0',
			underwritingHeight: '0',
			appraisalHeight: '0',
			prepaymentpenaltyfeeHeight: '0',
			creditReportHeight: '0',
			reissueSalePriceHeight: '0',
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
			fee11Height: '0',
			monTaxHeight: '0',
			numberOfMonthsInsurancePrepaidHeight: '0',
			numberOfDaysPerMonthHeight: '0',
			monthPmiValHeight: '0',
			FhaMipFin1Height: '0',
			VaFfFin1Height: '0',
			UsdaMipFinance1Height: '0',
			costOtherHeight: '0',
			rateValueHeight: '0',
			paymentAmount1Height: '0',
			paymentAmount2Height: '0',
			focusElementMargin: 230,
		}
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

	handleFirstConnectivityChange(connectionInfo) {
		this.setState({
			connectionInfo: connectionInfo.type
		});
		console.log('First change, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);

		if (connectionInfo.type != 'none') {
			this.setState({ animating: 'false' }, this.componentDidMount);
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
		if (fieldName == 'sale_pr') {
			val = e.value[0];
			doc = nlp(val);
			val = doc.values().toNumber().out();
		} else {
			val = e.value[0];
		}

		this.setState({
			[fieldName]: val,
			voiceInput: false,
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
		this.setState({ voiceInput: true })
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
				speakToTextStatus: false
			});
		} catch (e) {
			console.error(e);
		}
	}

	async _stopRecognizing(e) {
		try {
			await Voice.stop();
			this.setState({ stoppedRec: true })
			this._cancelRecognizing()
		} catch (e) {
			console.error(e);
		}
	}

	onBackHomePress() {
		Keyboard.dismiss()
		if (this.state.footer_tab == 'closing_cost' || this.state.footer_tab == 'prepaid' || this.state.footer_tab == 'payment') {
			// function created inside setstate object is called anonyms function which is called on the fly.
			this.setState({ footer_tab: 'refinance' }, function () {
				if (this.state.footer_tab == 'refinance') {
					this.setState({ netFirstFooterTab: true });
				} else {
					this.setState({ netFirstFooterTab: false });
				}
			});
		} else {
			this.props.navigator.push({ name: 'Dashboard', index: 0 });
		}
		//	this.props.navigator.pop()
	}

	// For showing popup containing list of buyer's calculator
	setModalVisible(visible) {
		this.setState({ modalVisible: visible });
		this.getBuyerCalculatorListApi();
	}

	// For showing popup containing list of buyer's calculator
	setEmailModalVisible(visible) {

		if (this.state.modalVisible == false) {
			if (this.state.dropdownType == 'trid') {
				this.setState({
					dropdownType: ""
				});
			}
		}

		this.setState({ emailModalVisible: visible });
		this.getBuyerCalculatorListApi();
	}

	// For showing popup containing list of buyer's calculator
	setVideoModalVisible(visible) {
		this.setState({ videoModalVisible: visible });
	}

	cancelEmailPopup(flag) {
		this.setState({
			openMessagePopup: false
		});

		if (flag == 'success') {
			this.dropdown.alertWithType('success', 'Success', "Message sent successfully");
		}
	}

	// For showing popup containing list of buyer's calculator
	setPrintModalVisible(visible) {
		this.setState({ printModalVisible: visible });
		this.getBuyerCalculatorListApi();
	}

	// function added by lovedeep on 05-01-2018
	// For showing popup containing list of buyer's calculator
	setEmailModalQuickDetailVisible(visible) {

		if (this.state.CDTC_TRID_Status == true) {
			this.setEmailModalVisible(visible);
		} else {
			if (this.state.CDTC_Status == false && this.state.TRID_Status == true) {
				Alert.alert('CostsFirst', 'Include CDTC data?', [{ text: 'NO', onPress: this.onCallFuncSetEmailModalVisible.bind(this, 'CDTC_Status', false, visible) }, { text: 'YES', onPress: this.onCallFuncSetEmailModalVisible.bind(this, 'CDTC_Status', true, visible) }]);
			} else if (this.state.TRID_Status == false && this.state.CDTC_Status == true) {
				Alert.alert('CostsFirst', 'Include TRID data?', [{ text: 'NO', onPress: this.onCallFuncSetEmailModalVisible.bind(this, 'TRID_Status', false, visible) }, { text: 'YES', onPress: this.onCallFuncSetEmailModalVisible.bind(this, 'TRID_Status', true, visible) }]);
			} else if (this.state.TRID_Status == false && this.state.CDTC_Status == false) {
				Alert.alert('CostsFirst', 'Include both TRID & CDTC data?', [{ text: 'NO', onPress: this.onCallFuncSetEmailModalVisible.bind(this, 'CDTC_TRID_Status', false, visible) }, { text: 'YES', onPress: this.onCallFuncSetEmailModalVisible.bind(this, 'CDTC_TRID_Status', true, visible) }]);
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
		if (this.state.modalVisible == false) {

			if (this.state.dropdownType == 'cdtc') {
				this.setState({
					dropdownType: ""
				});
			}
			if (this.state.dropdownType == 'trid') {
				this.setState({
					dropdownType: ""
				});
			}
		}

		this.setState({ emailModalVisible: visible });
		this.getBuyerCalculatorListApi();
	}

	// For showing popup containing list of buyer's calculator
	setModalAddressesVisible(visible) {
		if (this.state.emailAddrsList != '') {
			this.setState({ modalAddressesVisible: visible });
		} else {
			Alert.alert('CostsFirst', 'Address book is empty.', [{ text: 'Cancel', onPress: () => console.log('Cancel Pressed!') }, { text: 'OK', onPress: () => console.log('Cancel Pressed!') }]);
		}
	}

	// Tabs in the footer of the page
	changeFooterTab(footer_tab) {
		this.setState({ footer_tab: footer_tab });
		/* if(footer_tab == 'buyer'){
			this.setState({buyerFooterTab: true});
		}else{
			this.setState({buyerFooterTab: false});
		} */
	}

	createEscrowPicker() {
		let dataArray = ['Split', 'Buyer', 'Seller'];
		Picker.init({
			pickerData: dataArray,
			selectedValue: [this.state.escrowType],
			onPickerConfirm: (pickedValue) => {
				let selectedStr = pickedValue[0]
				this.setState({ escrowType: selectedStr });
			},
			onPickerCancel: data => {
				console.log(data);
			},
			onPickerSelect: data => {
			}
		});
		Picker.show();
	}

	createOwnersPicker() {
		let dataArray = ['Split', 'Buyer', 'Seller'];
		Picker.init({
			pickerData: dataArray,
			selectedValue: [this.state.ownersType],
			onPickerConfirm: (pickedValue) => {
				let selectedStr = pickedValue[0]
				this.setState({ ownersType: selectedStr });
			},
			onPickerCancel: data => {
				console.log(data);
			},
			onPickerSelect: data => {
			}
		});
		Picker.show();
	}

	createLenderPicker() {
		let dataArray = ['Split', 'Buyer', 'Seller'];
		Picker.init({
			pickerData: dataArray,
			selectedValue: [this.state.lenderType],
			onPickerConfirm: (pickedValue) => {
				let selectedStr = pickedValue[0]
				this.setState({ lenderType: selectedStr });
			},
			onPickerCancel: data => {
				console.log(data);
			},
			onPickerSelect: data => {
			}
		});
		Picker.show();
	}


	handlePressCheckedBox = (checked) => {
		if (this.state.isChecked === false) {
			this.setState({ FhaMipFin3: this.state.FhaMipFin2 });
			adjustedAmt = parseInt(this.state.base_loan_amt) + ((this.state.base_loan_amt) * (this.state.fhaMIP / 100));        //Formula applied here to calculate the adjusted
			principalRate = getRefSumOfAdjustment(adjustedAmt, this.state.todaysInterestRate, this.state.termsOfLoansinYears);

			//Alert.alert("f", JSON.stringify(adjustedAmt + " adjustedAmt" + this.state.todaysInterestRate + " this.state.todaysInterestRate" + this.state.termsOfLoansinYears + " this.state.termsOfLoansinYears"));
			this.setState({ principalRate: principalRate, isChecked: !this.state.isChecked, FhaMipFin3: this.state.FhaMipFin2, adjusted_loan_amt: adjustedAmt }, this.calTotalMonthlyPayment);


			console.log("adjusted_loan_amt 1 " + adjustedAmt);

		} else {
			adjustedAmt = this.state.base_loan_amt;
			principalRate = getRefSumOfAdjustment(adjustedAmt, this.state.todaysInterestRate, this.state.termsOfLoansinYears);
			//Alert.alert("f", JSON.stringify(adjustedAmt + " adjustedAmt" + this.state.todaysInterestRate + " this.state.todaysInterestRate" + this.state.termsOfLoansinYears + " this.state.termsOfLoansinYears"));
			this.setState({ principalRate: principalRate, isChecked: !this.state.isChecked, FhaMipFin3: this.state.FhaMipFin, adjusted_loan_amt: adjustedAmt }, this.calTotalMonthlyPayment);

			console.log("adjusted_loan_amt 2 " + adjustedAmt);

		}
	}

	handlePressAddressCheckedBox(data) {
		this.setState({ [data]: { isAddrsChecked: !this.state[data].isAddrsChecked } })

	}

	// Commented by lovedeep on 10-7-2018
	/*handlePressUSDACheckedBox = (checked) => {
		this.setState({
		  isCheckedUSDA: !this.state.isCheckedUSDA
		});
	}*/


	handlePressUSDACheckedBox = (checked) => {
		if (this.state.isCheckedUSDA === false) {
			//creating object for sales price and MIP
			request = { 'salePrice': this.state.base_loan_amt, 'MIP': this.state.usdaMIP };

			//calling method to calculate the amount for USDA Loan Type
			response = getRefAdjustedUSDA(request);
			adjustedAmt = response.adjusted;
			principalRate = getRefSumOfAdjustment(adjustedAmt, this.state.todaysInterestRate, this.state.termsOfLoansinYears);
			this.setState({ principalRate: principalRate, isCheckedUSDA: !this.state.isCheckedUSDA, UsdaMipFinance3: this.state.UsdaMipFinance2, adjusted_loan_amt: adjustedAmt }, this.calTotalMonthlyPayment);
		} else {
			adjustedAmt = this.state.base_loan_amt;
			principalRate = getRefSumOfAdjustment(adjustedAmt, this.state.todaysInterestRate, this.state.termsOfLoansinYears);
			this.setState({ principalRate: principalRate, isCheckedUSDA: !this.state.isCheckedUSDA, UsdaMipFinance3: this.state.UsdaMipFinance, adjusted_loan_amt: adjustedAmt }, this.calTotalMonthlyPayment);
		}
	}

	/*handlePressVACheckedBox = (checked) => {
		if(this.state.isCheckedVA === false){
            //this.amount            = this.salesprice - this.downPayment;
            request         = {'salePrice': this.state.base_loan_amt,'FF': this.state.Vaff};
            //calling method to calculate the amount for VA Loan Type
            response         = getRefAdjustedVA(request);
            //this.amount            = this.salesprice;
            adjustedAmt        = response.adjusted;
			principalRate   = getRefSumOfAdjustment(adjustedAmt, this.state.todaysInterestRate, this.state.termsOfLoansinYears);
			this.setState({ principalRate:principalRate, isCheckedVA: !this.state.isCheckedVA, VaFfFin3: this.state.VaFfFin2, adjusted_loan_amt: adjustedAmt},this.calTotalMonthlyPayment);
            
        } else {
			adjustedAmt    = this.state.base_loan_amt;
			principalRate   = getRefSumOfAdjustment(adjustedAmt, this.state.todaysInterestRate, this.state.termsOfLoansinYears);
			this.setState({principalRate:principalRate, isCheckedVA: !this.state.isCheckedVA, VaFfFin3: this.state.VaFfFin, adjusted_loan_amt: adjustedAmt},this.calTotalMonthlyPayment);
        }
	}*/

	handlePressVACheckedBox = (checked) => {
		if (this.state.isCheckedVA === false) {
			//this.amount            = this.salesprice - this.downPayment;			
			/**======= Start Changes added by lovedeep as per discussion with vinod sir on 08-06-2018 ======**/

			request.salePrice = this.state.base_loan_amt;
			request.FF = this.state.Vaff;
			request.vAmaxloanamount = this.state.vAmaxloanamount;
			request.amount = this.state.base_loan_amt;
			request.VA_RoundDownMIP = this.state.VA_RoundDownMIP;
			request.isfinanceVAMip = this.state.isFinanceVAMIP;

			responsePrepaid = getRefVaFundingFinance(request);

			this.setState({
				VaFfFin: responsePrepaid.VaFfFin,
				VaFfFin1: responsePrepaid.VaFfFin1,
				VaFfFin2: responsePrepaid.VaFfFin2,
				VaFfFin3: this.state.VaFfFin2,
			});
			adjustedAmt = responsePrepaid.adjusted;

			/**======= Start Changes added by lovedeep as per discussion with vinod sir on 08-06-2018 ======**/

			principalRate = getRefSumOfAdjustment(adjustedAmt, this.state.todaysInterestRate, this.state.termsOfLoansinYears);
			this.setState({ principalRate: principalRate, isCheckedVA: !this.state.isCheckedVA, VaFfFin3: this.state.VaFfFin2, adjusted_loan_amt: adjustedAmt }, this.calTotalMonthlyPayment);

			console.log("adjusted_loan_amt 3 " + adjustedAmt);

		} else {
			adjustedAmt = this.state.base_loan_amt;
			principalRate = getRefSumOfAdjustment(adjustedAmt, this.state.todaysInterestRate, this.state.termsOfLoansinYears);
			this.setState({ principalRate: principalRate, isCheckedVA: !this.state.isCheckedVA, VaFfFin3: this.state.VaFfFin, adjusted_loan_amt: adjustedAmt }, this.calTotalMonthlyPayment);

			console.log("adjusted_loan_amt 4 " + adjustedAmt);

		}
	}




	async componentDidMount() {

		AsyncStorage.getItem('speakToTextVal').then((val) => {
			console.log('speaktoText11', val)

			if (val == null) {
				this.setState({ speakToTextVal: false })
			} else {
				if (val == 'true') {
					this.setState({ speakToTextVal: true })
				} else if (val == 'false') {
					this.setState({ speakToTextVal: false })
				}
			}
		})

		if (this.state.devicetype == 'tablet') {
			if (Platform.OS == 'android') {
				this.setState({
					deviceName: 'android'
				});
			} else {
				this.setState({
					deviceName: 'ipad'
				});
			}
		} else {
			if (Platform.OS == 'android') {
				this.setState({
					deviceName: 'android'
				});
			} else {
				this.setState({
					deviceName: 'iphone'
				});
			}
		}

		AsyncStorage.getItem('speaktoText').then((val) => {
			console.log('speaktoText11', val)
			if (val) {
				this.setState({ speaktoText: val })
			}
		})

		this.setState({
			loadingText: 'Initializing...'
		});
		BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
		response = await authenticateUser();
		if (response == '1') {
			this.props.navigator.push({ name: 'Login', index: 0 });
		} else {
			AsyncStorage.getItem("userDetail").then((value) => {
				newstr = value.replace(/\\/g, "");
				var newstr = JSON.parse(newstr);
				newstr.user_name = newstr.first_name + " " + newstr.last_name;
				var subj = 'Closing Costs from ' + newstr.user_name + '  at ' + newstr.email;
				this.setState({
					email_subject: subj,
					state_code: newstr.state_code
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

				this.setState(newstr, this.componentApiCalls);
			}).done();
			this.setState({ animating: 'true' });
			AsyncStorage.getItem("initialOrientation").then((value) => {
				this.setState({
					initialOrientation: value
				});
			}).done();
		}

		AsyncStorage.getItem("Language").then((value) => {

			if (value != 'null' && value != null) {
				newstr = value.replace(/\\/g, "");
				var newstr = JSON.parse(newstr);

				console.log("value in buyer lang " + newstr)
				//console.log("value in buyer lang " + JSON.stringify(value));
				this.setState({
					languageType: newstr
				});
			}
		}).done();
	}

	stopSpeakToText(fieldName) {
		if (fieldName == 'lendername') {
			this.setState({ TextInput: true });
			this.refs.lendername.focus();

		} else {
			this.setState({ TextInput: true })
		}
		val = !this.state.speakToTextVal;

		this.setState({ speakToTextVal: val, speakToTextStatus: false });

		console.log("speak to text " + this.state.speakToTextVal);


		if (val) {
			//alert(val);
			AsyncStorage.setItem('speakToTextVal', JSON.stringify(val)).then(() => {
				console.log("Done")
			})
		} else {
			AsyncStorage.setItem('speakToTextVal', JSON.stringify(false)).then(() => {
				console.log("Done")
			})
		}
	}

	componentWillUnmount() {

		BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
	}

	handleBackButtonClick() {
		//this.props.navigation.goBack(null);		
		if (this.state.footer_tab == 'closing_cost' || this.state.footer_tab == 'prepaid' || this.state.footer_tab == 'payment') {
			// function created inside setstate object is called anonyms function which is called on the fly.
			this.setState({ footer_tab: 'refinance' }, function () {
				if (this.state.footer_tab == 'refinance') {
					this.setState({ netFirstFooterTab: true });
				} else {
					this.setState({ netFirstFooterTab: false });
				}
			});
		} else {
			this.props.navigator.push({ name: 'Dashboard', index: 0 });
		}
		//this.props.navigator.push({name: 'Dashboard', index: 0 });
		return true;
	}

	componentApiCalls() {
		this.callBuyerSettingApi();
		//this.callBuyerConvSettingApi();
		//this.callbuyerEscrowXmlData();
		this.callGlobalSettingApi();
		this.getBuyerCalculatorListApi();
		this.callUserAddressBook();
		this.callCdtcTridLoanComparisonSettings();
		this.countyGlobalSetting();
	}

	countyGlobalSetting() {
		callPostApi(GLOBAL.BASE_URL + GLOBAL.county_global_setting, {
			state_id: this.state.state, county_id: this.state.county
		}, this.state.access_token)
			.then((response) => {
				if (result.status == 'success') {
					this.setState({
						fhaMaxLoanAmount: result.data.maxLoanAmount,
						vAmaxloanamount: result.data.vAmaxloanamount,
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
			'state_id': this.state.state_id
		}
		callPostApi(GLOBAL.BASE_URL + GLOBAL.TRID_CDTC_Setting, CdtcTridData, this.state.access_token)
			.then((response) => {
				//console.log("resp of cdtctrid setting " + JSON.stringify(result));
				// Continue your code here...

				if (result.status == 'success') {
					if (result.data.cdtc > 0 && result.data.cfpb == 0) {
						this.setState({
							CDTC_Status: true,
							TRID_Status: false,
						});

					} else if (result.data.cdtc == 0 && result.data.cfpb > 0) {
						this.setState({
							CDTC_Status: false,
							TRID_Status: true,
						});
					} else if (result.data.cdtc == 0 && result.data.cfpb == 0) {
						this.setState({
							CDTC_TRID_Status: false
						});
					}
				}
			});
	}

	onChange(text) {
		val = text.replace(/[^0-9\.]/g, '');
		if (val.split('.').length > 2) {
			val = val.replace(/\.+$/, "");
		}
		//newText = text.replace(/\D/g,'');
		newText = val;
		return newText;
	}

	// Calulation for discount price after changing discount percentage
	onChangeDisc(text, flag) {
		text = this.removeCommas(text);
		//creating object for origination fee and amount
		//creating object for origination fee and amount


		/*loan_amt = this.state.loan_amt;

		if(this.state.loan_amt2 != '' && this.state.loan_amt2 != '0.00'){
			valdisc = {'discountPerc': discText,'amount': this.state.loan_amt2};
		}else{
			valdisc = {'discountPerc': discText,'amount': loan_amt};
		}*/

		console.log("loan amt refi " + this.state.loan_amt);
		console.log("loan amt refi 2 " + this.state.loan_amt2);

		// changes added by lovedeep on 03-16-2018
		if (this.state.tab == 'FHA' || this.state.tab == 'VA') {
			adjustLoanAmt = parseInt(this.state.loan_amt);
		} else {
			adjustLoanAmt = parseInt(this.state.loan_amt) + parseInt(this.state.loan_amt2);
		}
		//adjustLoanAmt = parseInt(this.state.loan_amt) + parseInt(this.state.loan_amt2);

		valdisc = { 'discountPerc': text, 'amount': adjustLoanAmt };

		//calling method to calculate the discount amount

		console.log("discount request " + JSON.stringify(valdisc));

		amrt = getRefDiscountAmount(valdisc);

		console.log("discount response " + JSON.stringify(amrt));

		this.setState({ discAmt: amrt.discount }, this.calTotalClosingCost);
	}

	delimitNumbers(str) {
		return (str + "").replace(/\b(\d+)((\.\d+)*)\b/g, function (a, b, c) {
			return (b.charAt(0) > 0 && !(c || ".").lastIndexOf(".") ? b.replace(/(\d)(?=(\d{3})+$)/g, "$1,") : b) + c;
		});
	}

	onChangeRate(text, flag) {
		if (text != "" && text != '0.00') {
			text = this.removeCommas(text);
			if (flag == 'sale_pr') {
				this.setState({
					loadingText: 'Calculating...'
				}, this.setState({ animating: 'true' }));
			} else {
				this.setState({ animating: 'true' });
			}
		}

		callPostApi(GLOBAL.BASE_URL + GLOBAL.get_city_state_for_zip, {
			"zip": this.state.postal_code
		}, this.state.access_token)
			.then((response) => {
				zipRes = result;
				if (zipRes.status == 'fail') {
					if (this.state.sale_pr > 0) {
						this.dropdown.alertWithType('error', 'Error', zipRes.message);
						this.setState({ animating: 'false' });
					}
				} else if (zipRes.data.state_name != null || zipRes.data.state_name != 'NULL') {
					if (this.state.isCheckForOhio == true) {
						if (this.state.reissueSalePrice == '0.00' || this.state.reissueSalePrice == '') {
							this.dropdown.alertWithType('error', 'Error', 'Prior Liability Amount must be entered');
							this.setState({ animating: 'false' });
						} else {
							this.onChangeRateStep(text, flag);
						}
					} else {
						this.onChangeRateStep(text, flag);
					}

				}
			});
	}

	onChangeRateStep(text, flag) {
		console.log("onChangeRateStep");
		if (text != "" && text != '0.00') {
			val = text.replace(/[^0-9\.]/g, '');
			if (val.split('.').length > 2) {
				val = val.replace(/\.+$/, "");
			}
			newText = val;
		} else {
			newText = '0.00';
		}
		newTextCalc = newText;
		if (flag == 'sale_pr') {
			this.setState({ sale_pr: parseFloat(newText).toFixed(2), sale_pr_calc: newTextCalc });
			request = { 'salePrice': newText, 'LTV': this.state.ltv, 'LTV2': this.state.ltv2 };
		} else if (flag == 'ltv') {
			newTextCalc = this.state.sale_pr_calc;
			this.setState({ ltv: newText });
			request = { 'salePrice': this.state.sale_pr_calc, 'LTV': newText, 'LTV2': this.state.ltv2 };
		}
		else if (flag == 'ltv2') {
			newTextCalc = this.state.sale_pr_calc;
			this.setState({ ltv2: parseFloat(newText).toFixed(2) });
			request = { 'salePrice': this.state.sale_pr_calc, 'LTV': this.state.ltv, 'LTV2': newText };
		}
		if (flag != 'sale_pr') {
			if (flag == 'ltv2' && newText == 0) {
				flag = 'sale_pr';
			}
			newText = this.state.sale_pr;
		}

		if (this.state.tab == 'CONV') {
			if (this.state.termsOfLoansinYears2 != "" && this.state.termsOfLoansinYears2 != '0.00') {
				request1 = { 'amount': this.state.loan_amt2, 'termsInYear': this.state.termsOfLoansinYears2, 'interestRate': this.state.todaysInterestRate1 };
				res = get2ndTd(request1);
				this.setState({ pnintrate: res.pnintrate });
			} else {
				this.setState({ pnintrate: '0.00' });
			}
			conv_amt = getRefAmountConventional(request);
			if (typeof conv_amt.amount2 !== 'undefined') {
				this.setState({
					down_payment: conv_amt.downPayment,
					loan_amt: conv_amt.amount,
					loan_amt2: conv_amt.amount2,
					sale_pr: parseFloat(newText).toFixed(2),
					sale_pr_calc: newTextCalc,
				});
			} else {
				this.setState({
					down_payment: conv_amt.downPayment,
					loan_amt: conv_amt.amount,
					loan_amt2: '',
					sale_pr: parseFloat(newText).toFixed(2),
					sale_pr_calc: newTextCalc,
				});
			}
			loan_amt = conv_amt.amount;
			loan_amt1 = conv_amt.amount;
		} else {
			this.setState({ pnintrate: '0.00' });
		}

		// Work on fetching adjusted loan amt, loan amt and down payment on change of sale price
		//if(flag=='sale_pr'){
		callGetApi(GLOBAL.BASE_URL + GLOBAL.national_global_setting, {}, this.state.access_token)
			.then((response) => {
				if (this.state.tab == 'FHA') {

					console.log("fha national settings " + JSON.stringify(result));

					ltv = result.data.nation_setting.FHA_conventionalLTV;
					roundDownMIP = result.data.nation_setting.FHA_RoundDownMIP;
					financeMipCheck = result.data.nation_setting.FHA_FinanceMIP;

					if (financeMipCheck == 'Y') {
						financeMipCheck = true;
						this.setState({ disablefhamipcheckbox: true });
					} else {
						financeMipCheck = false;
						this.setState({ disablefhamipcheckbox: false });
					}


					//setting MIP according to the terms in year check for FHA
					if (this.state.termsOfLoansinYears <= result.data.nation_setting.FHA_YearsTwo) {
						mip = result.data.nation_setting.FHA_PercentTwo;
					} else if (this.state.termsOfLoansinYears > result.data.nation_setting.FHA_YearsTwo && this.state.termsOfLoansinYears <= result.data.nation_setting.FHA_YearsOne) {
						mip = result.data.nation_setting.FHA_PercentOne;
					}

					//creating object for sales price, loan to value and MIP
					//data        = {'salePrice': newText,'LTV': ltv, 'MIP': mip, 'roundDownMIP' : roundDownMIP};

					data = { 'salePrice': newText, 'LTV': ltv, 'MIP': mip, 'fhaMaxLoanAmount': this.state.fhaMaxLoanAmount, 'roundDownMIP': roundDownMIP, 'fhaMIPCheck': financeMipCheck };

					console.log("getRefAmountFHA rquest " + JSON.stringify(data));

					//calling method to calculate the amount and adjusted for FHA Loan Type
					resp = getRefAmountFHA(data);

					console.log("getRefAmountFHA resp " + JSON.stringify(resp));

					// Commented by lovedeep on 23-07-2018 as per discussion with vinod sir for FHA case
					/**
					requestPrepaidData = {'amount': resp.amount, 'MIP': mip, 'fhaMaxLoanAmount' : this.state.fhaMaxLoanAmount};      
					responsePrepaid = getRefFhaMipFinance(requestPrepaidData);
					console.log("getRefFhaMipFinance responsePrepaid " + JSON.stringify(responsePrepaid));			 **/

					loan_amt = resp.adjusted;
					loan_amt1 = resp.adjusted;

					console.log("adjusted_loan_amt 5" + resp.adjusted);

					this.setState({
						fhaMIP: mip,
						adjusted_loan_amt: resp.adjusted,
						down_payment: resp.downPayment,
						loan_amt: resp.amount,
						sale_pr: parseFloat(newText).toFixed(2),
						sale_pr_calc: newTextCalc,
						FhaMipFin: resp.FhaMipFin,
						FhaMipFin1: resp.FhaMipFin1,
						FhaMipFin2: resp.FhaMipFin2,
						FhaMipFin3: resp.FhaMipFin2,
						base_loan_amt: resp.amount,
					});




					if (newText <= result.data.nation_setting.mMIAmountUpto) {
						rateValue = result.data.nation_setting.mMI;
					}
					if (newText > result.data.nation_setting.mMIAmountExceed) {
						rateValue = result.data.nation_setting.mMIExceed;
					}

					console.log("rateValue " + rateValue);


				} else if (this.state.tab == 'VA') {
					ff = result.data.nation_setting.VA_FundingFee;

					/**======== Start Changes added by lovedeep as per discussion with vinod sir =========**/


					console.log("national setting " + JSON.stringify(result));

					va_finance_mip = result.data.nation_setting.VA_FinanceMIP;
					VA_round_down_mip = result.data.nation_setting.VA_RoundDownMIP;

					console.log("va_finance_mip " + va_finance_mip);
					console.log("VA_round_down_mip " + VA_round_down_mip);

					if (va_finance_mip == 'Y') {
						var isfinanceVAMip = true;
					} else {
						isfinanceVAMip = false;
					}

					this.setState({
						isFinanceVAMIP: isfinanceVAMip,
						VA_RoundDownMIP: VA_round_down_mip
					});

					console.log("isfinanceVAMip " + isfinanceVAMip);


					/**======== End Changes added by lovedeep as per discussion with vinod sir =========**/


					data = { 'salePrice': newText, 'FF': ff, 'vAmaxloanamount': this.state.vAmaxloanamount };

					//data         = {'salePrice': newText,'FF': ff};
					resp = getRefAdjustedVA(data);

					if (this.state.downPaymentFixed == true) {
						data.amount = amt;
					} else {
						data.amount = resp.amount;
					}

					data.VA_RoundDownMIP = VA_round_down_mip;
					data.isfinanceVAMip = isfinanceVAMip;

					console.log("getRefAdjustedVA resp " + JSON.stringify(resp));



					responsePrepaid = getRefVaFundingFinance(data);

					console.log("getRefVaFundingFinance resp " + JSON.stringify(responsePrepaid));


					//loan_amt = resp.adjusted;	
					//loan_amt1 = resp.adjusted;

					loan_amt = responsePrepaid.adjusted;
					loan_amt1 = responsePrepaid.adjusted;

					rateValue = '0.00';

					if (this.state.downPaymentFixed == true) {
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


					console.log("amount in VA case " + responsePrepaid.adjusted);


					if (this.state.isFinanceVAMIP == true || this.state.downPaymentFixed == true) {
						this.setState({
							VaFfFin3: responsePrepaid.VaFfFin2
						});
						//	this.state.VaFfFin3 = responsePrepaid.VaFfFin2;
					} else {
						this.setState({
							VaFfFin3: responsePrepaid.VaFfFin
						});
					}

					console.log("adjusted_loan_amt 6 " + responsePrepaid.adjusted);


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
					});


					/*this.setState({
						loan_amt: resp.amount,
						adjusted_loan_amt: resp.adjusted,
						down_payment: resp.downPayment,
						base_loan_amt: newText,
						sale_pr: parseFloat(newText).toFixed(2),
						sale_pr_calc: newTextCalc,
						Vaff: ff,
						VaFfFin: responsePrepaid.VaFfFin,
						VaFfFin1: responsePrepaid.VaFfFin1,
						VaFfFin2: responsePrepaid.VaFfFin2,
						VaFfFin3: responsePrepaid.VaFfFin2,
					});*/

				}

				if (this.state.termsOfLoansinYears2 != '') {
					year = parseInt(this.state.termsOfLoansinYears) + parseInt(this.state.termsOfLoansinYears2);
				} else {
					year = this.state.termsOfLoansinYears;
				}
				if (this.state.ltv2 > 0) {
					loan = (parseFloat(this.state.ltv) + parseFloat(this.state.ltv2)).toFixed(2);
				} else {
					loan = this.state.ltv;
				}
				if (this.state.tab == 'CONV') {
					rateValue = '0.00';
					if (year > 15) {
						if (loan >= 80.1 && loan <= 85.0) {
							rateValue = result.data.nation_cc_setting.renewelRatefor801to850Lons;
						}
						if (loan >= 85.1 && loan <= 90.0) {
							rateValue = result.data.nation_cc_setting.renewelRatefor851to900Lons;
						}
						if (loan >= 90.1 && loan <= 95.0) {
							rateValue = result.data.nation_cc_setting.renewelRatefor901to950Lons;
						}
						if (loan >= '95.1' && loan <= '97.0') {
							rateValue = result.data.nation_cc_setting.renewelRatefor95to97Lons;
						}
					} else if (year <= 15) {
						if (loan >= '80.1' && loan <= '85.0') {
							rateValue = result.data.nation_cc_setting.year15_renewelRatefor801to850Lons;
						}
						if (loan >= '85.1' && loan <= '90.0') {
							rateValue = result.data.nation_cc_setting.year15_renewelRatefor851to900Lons;
						}
						if (loan >= '90.1' && loan <= '95.0') {
							rateValue = result.data.nation_cc_setting.year15_renewelRatefor901to950Lons;
						}
						if (loan >= '95.1' && loan <= '97.0') {
							rateValue = result.data.nation_cc_setting.year15_renewelRatefor95to97Lons;
						}
					}
				}


				data_mon_tax = { 'salePrice': newText, 'monthlyTax': this.state.monTax, 'months': this.state.monTaxVal };
				resp_mon_tax = getRefPreMonthTax(data_mon_tax);
				prepaidMonthTaxes = resp_mon_tax.prepaidMonthTaxes;

				data_mon_ins = { 'salePrice': newText, 'insuranceRate': this.state.monIns, 'months': this.state.numberOfMonthsInsurancePrepaid };

				resp_mon_ins = getRefMonthlyInsurance(data_mon_ins);
				monthInsurance = resp_mon_ins.monthInsurance;

				monthlyRate = '0.00';

				titleVal = 'PMI';
				//creating object for amount and rate value
				requestMMI = { 'amount': this.state.loan_amt, 'rateValue': rateValue };

				//calling method to calculate the FHa MIP Finance for prepaid
				responseMMI = getRefMonthlyRateMMI(requestMMI);

				monthlyRate = responseMMI.monthlyRateMMI;
				monthPmiVal = responseMMI.monthPmiVal;

				//	console.log("request " + JSON.stringify(requestMMI));

				//	console.log("monthlyRate " + monthlyRate);

				principalRate = getRefSumOfAdjustment(loan_amt1, this.state.todaysInterestRate, this.state.termsOfLoansinYears);
				//Alert.alert('Alert!', JSON.stringify(loan_amt1 + "..loan_amt1 " + this.state.todaysInterestRate + "..this.state.todaysInterestRate " + this.state.termsOfLoansinYears + "..this.state.termsOfLoansinYears " + principalRate + "..principalRate"))
				//creating object for prepaid monthly tax
				req = { 'months': this.state.monTaxVal, 'prepaidMonthTaxesRes': prepaidMonthTaxes };

				//calling method to calculate the discount amount
				responseRealEstate = getRefRealEstateTaxes(req);
				//console.log(this.response.prepaidMonthTaxes);
				//creating object for prepaid monthly insurance
				requestHomeOwnerInsData = { 'monthInsuranceRes': monthInsurance, 'months': this.state.numberOfMonthsInsurancePrepaid };
				//calling method to calculate the discount amount
				responseHomeOwnerIns = getRefHomeOwnerInsurance(requestHomeOwnerInsData);

				if (this.state.monTax > 0) {
					realEstateTaxesRes = responseRealEstate.realEstateTaxes;
					realEstateTaxesResOrg = realEstateTaxesRes;
				} else {
					realEstateTaxesRes = this.state.realEstateTaxesRes;
					realEstateTaxesResOrg = this.state.realEstateTaxesResOrg;
				}

				if (this.state.monIns > 0) {
					homeOwnerInsuranceRes = responseHomeOwnerIns.homeOwnerInsuranceRes;
					homeOwnerInsuranceResOrg = homeOwnerInsuranceRes;
				} else {
					homeOwnerInsuranceRes = this.state.homeOwnerInsuranceRes;
					homeOwnerInsuranceResOrg = this.state.homeOwnerInsuranceResOrg;
				}


				console.log("adjusted_loan_amt 7 " + loan_amt);


				this.setState({
					animating: 'true',
					sale_pr: parseFloat(newText).toFixed(2),
					adjusted_loan_amt: loan_amt,
					nationalData: loan_amt,
					monthPmiVal: monthPmiVal,
					monthlyRate: monthlyRate,
					rateValue: rateValue,
					principalRate: principalRate,
					realEstateTaxesRes: realEstateTaxesRes,
					realEstateTaxesResOrg: realEstateTaxesResOrg,
					homeOwnerInsuranceRes: homeOwnerInsuranceRes,
					homeOwnerInsuranceResOrg: homeOwnerInsuranceResOrg,
				}, this.callSettingApiForTabs);

			});
		//}

	}
	changeDate(date) {
		var monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
		var split = date.split('-');
		//Alert.alert('Alert!', JSON.stringify(monthNames[1]))
		//comment by lovedeep
		//this.setState({date: date, monName: monthNames[Number(split[0])]},this.callGlobalSettingApiOnDateChange);
		if (this.state.monTax > 0) {
			this.setState({ date: date, monName: monthNames[Number(split[0])], monTaxVal: Number(split[0]) }, this.changeMonTaxOnDateChange);
		} else {
			this.setState({ date: date, monName: monthNames[Number(split[0])], monTaxVal: Number(split[0]) }, this.changeMonTaxOnDateChange);
		}

	}
	// function changePrepaidPageFields will call when adjusted amount and amount will set
	changePrepaidPageFields() {
		this.changeMonTaxPrice();
		/* this.changeMonInsPrice();
		this.changeDayInterestPrice();
		this.calOriginatinFee(); */
	}



	calOriginatinFee() {
		//creating object for origination fee and amount
		//creating object for origination fee and amount
		if (this.state.tab == "VA") {
			loan_amt = this.state.base_loan_amt;
		} else {
			loan_amt = this.state.loan_amt;
		}

		if (this.state.tab == 'CONV') {
			request = { 'originationFee': this.state.originationfactor, 'originationFactorType': this.state.originationFactorType, 'amount': loan_amt, 'amount2': this.state.loan_amt2 };

		} else {
			request = { 'originationFee': this.state.originationfactor, 'originationFactorType': this.state.originationFactorType, 'amount': loan_amt, 'amount2': '0.00' };
		}

		console.log('calOriginatinFee request ' + JSON.stringify(request));

		//	alert(JSON.stringify(request))
		//calling method to calculate the discount amount
		response = getRefOriginationFee(request);

		console.log('calOriginatinFee response ' + JSON.stringify(response));

		this.setState({ originationFee: response.originationFee }, this.calTotalClosingCost);
	}

	//Function to calculate mon tax value in prepaid tab
	changeMonTaxPrice() {
		if (this.state.monTax > 0) {
			data = { 'salePrice': this.state.sale_pr_calc, 'monthlyTax': this.state.monTax, 'months': this.state.monTaxVal };
			//console.log(this.request);
			//calling method to calculate the discount amount
			resp = getRefPreMonthTax(data);
			//console.log(this.response.prepaidMonthTaxes);
			prepaidMonthTaxesRes = parseFloat(resp.prepaidMonthTaxes).toFixed(2);
			if (prepaidMonthTaxesRes > 0) {
				data_mon_tax = { 'salePrice': this.state.sale_pr_calc, 'monthlyTax': this.state.monTax, 'months': this.state.monTaxVal };
				resp_mon_tax = getRefPreMonthTax(data_mon_tax);
				prepaidMonthTaxes = resp_mon_tax.prepaidMonthTaxes;

				console.log("monTaxVal " + this.state.monTaxVal);
				this.state.monTaxVal = this.state.monTaxVal;
				req = { 'months': this.state.monTaxVal, 'prepaidMonthTaxesRes': prepaidMonthTaxes };
				responseRealEstate = getRefRealEstateTaxes(req);
				realEstateTaxesRes = responseRealEstate.realEstateTaxes;
			}

			this.setState({
				realEstateTaxesRes: realEstateTaxesRes,
				prepaidMonthTaxes: parseFloat(resp.prepaidMonthTaxes).toFixed(2),
				prepaidMonthTaxesOrg: resp.prepaidMonthTaxes,
			}, this.changeMonInsPrice);

		} else {
			// commented by lovedeep
			//this.changeMonInsPrice();
			//added by lovedeep on 03-16-2018 because if monTax value is zero, then call actual annaul tax function
			this.calMonTax(this.state.act_annual_tax, 'act_annual_tax');
		}
	}

	//Function to calculate mon tax value in prepaid tab
	onChangeMonTax() {
		if (this.state.monTax > 0) {
			prepaidMonthTaxesRes = parseFloat(this.state.prepaidMonthTaxes).toFixed(2);
			req = { 'months': this.state.monTaxVal, 'prepaidMonthTaxesRes': prepaidMonthTaxesRes };
			responseRealEstate = getRefRealEstateTaxes(req);
			realEstateTaxesRes = responseRealEstate.realEstateTaxes;
			this.setState({
				realEstateTaxesRes: realEstateTaxesRes,
				prepaidMonthTaxes: prepaidMonthTaxesRes,
				prepaidMonthTaxesOrg: prepaidMonthTaxesRes,
			}, this.changeMonInsPrice);
		} else {
			this.changeMonInsPrice();
		}
	}

	calReissueSalePrice() {
		if (this.state.reissueSalePriceEditableStatus == true) {
			this.setState({
				reissueYearDropdownVal: 1
			}, this.callSellerEscrowSettingApi);
		} else {
			this.setState({
				reissueYearDropdownVal: 0
			}, this.callSellerEscrowSettingApi);
		}
		//this.getFACCData();
	}

	//Function to calculate mon tax value in prepaid tab
	changeMonTaxOnDateChange() {
		data = { 'salePrice': this.state.sale_pr_calc, 'monthlyTax': this.state.monTax, 'months': this.state.monTaxVal };
		//calling method to calculate the discount amount
		resp = getRefPreMonthTax(data);
		//console.log(this.response.prepaidMonthTaxes);
		prepaidMonthTaxesRes = parseFloat(resp.prepaidMonthTaxes).toFixed(2);
		if (prepaidMonthTaxesRes > 0) {
			data_mon_tax = { 'salePrice': this.state.sale_pr_calc, 'monthlyTax': this.state.monTax, 'months': this.state.monTaxVal };
			resp_mon_tax = getRefPreMonthTax(data_mon_tax);
			prepaidMonthTaxes = resp_mon_tax.prepaidMonthTaxes;
			req = { 'months': this.state.monTaxVal, 'prepaidMonthTaxesRes': prepaidMonthTaxes };
			responseRealEstate = getRefRealEstateTaxes(req);
			realEstateTaxesRes = responseRealEstate.realEstateTaxes;
		}

		this.setState({
			realEstateTaxesRes: realEstateTaxesRes,
			prepaidMonthTaxes: parseFloat(resp.prepaidMonthTaxes).toFixed(2),
			prepaidMonthTaxesOrg: resp.prepaidMonthTaxes,
		}, this.changeMonInsPrice);
	}

	//Function to calculate mon Ins value in prepaid tab
	changeMonInsPrice() {
		if (this.state.monIns > 0) {
			data = { 'salePrice': this.state.sale_pr_calc, 'insuranceRate': this.state.monIns, 'months': this.state.numberOfMonthsInsurancePrepaid };

			//calling method to calculate the discount amount
			resp = getRefMonthlyInsurance(data);

			//console.log(this.response.prepaidMonthTaxes);
			monthInsuranceRes = parseFloat(resp.monthInsurance).toFixed(2);
			if (monthInsuranceRes > 0) {
				data_mon_ins = { 'salePrice': this.state.sale_pr_calc, 'insuranceRate': this.state.monIns, 'months': this.state.numberOfMonthsInsurancePrepaid };
				resp_mon_ins = getRefMonthlyInsurance(data_mon_ins);
				monthInsurance = resp_mon_ins.monthInsurance;
				this.state.numberOfMonthsInsurancePrepaid = parseFloat(this.state.numberOfMonthsInsurancePrepaid).toFixed(0);
				requestHomeOwnerInsData = { 'monthInsuranceRes': monthInsurance, 'months': this.state.numberOfMonthsInsurancePrepaid };
				responseHomeOwnerIns = getRefHomeOwnerInsurance(requestHomeOwnerInsData);
				homeOwnerInsuranceRes = responseHomeOwnerIns.homeOwnerInsuranceRes;
				this.setState({
					homeOwnerInsuranceRes: homeOwnerInsuranceRes,
					monthInsuranceRes: parseFloat(resp.monthInsurance).toFixed(2),
					monthInsuranceResOrg: resp.monthInsurance,
				}, this.changeDayInterestPrice);
			} else {
				this.setState({
					monthInsuranceRes: parseFloat(resp.monthInsurance).toFixed(2),
					monthInsuranceResOrg: resp.monthInsurance,
				}, this.changeDayInterestPrice);
			}

		} else {

			this.calMonInsuranceWithZeroVal(this.state.act_annual_ins, 'act_annual_ins');
			//this.calMonTax(this.state.act_annual_tax, 'act_annual_tax');
			//this.changeDayInterestPrice();
		}
	}

	calMonInsuranceWithZeroVal(fieldVal, fieldName) {
		fieldVal = this.removeCommas(fieldVal);
		if (fieldVal != '' && fieldVal != '0.00' && fieldVal != 0) {
			request = { 'annualPropertyIns': fieldVal, 'prepaidMonthInsurance': this.state.numberOfMonthsInsurancePrepaid };
			annualInsData = getActualAnnualIns(request);
			//creating object for prepaid monthly insurance
			requestHomeOwnerInsData = { 'monthInsuranceRes': annualInsData.monthlyInsRes, 'months': this.state.numberOfMonthsInsurancePrepaid };
			//calling method to calculate the discount amount
			responseHomeOwnerIns = getRefHomeOwnerInsurance(requestHomeOwnerInsData);
			homeOwnerInsuranceRes = responseHomeOwnerIns.homeOwnerInsuranceRes;
			//Alert.alert("df",JSON.stringify(homeOwnerInsuranceRes));
			this.setState({ monthInsuranceRes: annualInsData.monthlyInsRes, monIns: '0.00', homeOwnerInsuranceRes: homeOwnerInsuranceRes }, this.calTotalMonthlyPaymentAfterZeroMonIns);
		} else {
			if (this.state.monInsOrg > 0) {
				data = { 'salePrice': this.state.sale_pr_calc, 'insuranceRate': this.state.monInsOrg, 'months': this.state.numberOfMonthsInsurancePrepaid };

				//calling method to calculate the discount amount
				resp = getRefMonthlyInsurance(data);

				//console.log(this.response.prepaidMonthTaxes);
				monthInsuranceRes = parseFloat(resp.monthInsurance).toFixed(2);
				if (monthInsuranceRes > 0) {
					data_mon_ins = { 'salePrice': this.state.sale_pr_calc, 'insuranceRate': this.state.monInsOrg, 'months': this.state.numberOfMonthsInsurancePrepaid };
					resp_mon_ins = getRefMonthlyInsurance(data_mon_ins);
					monthInsurance = resp_mon_ins.monthInsurance;
					requestHomeOwnerInsData = { 'monthInsuranceRes': monthInsurance, 'months': this.state.numberOfMonthsInsurancePrepaid };
					responseHomeOwnerIns = getRefHomeOwnerInsurance(requestHomeOwnerInsData);
					homeOwnerInsuranceRes = responseHomeOwnerIns.homeOwnerInsuranceRes;
					this.setState({
						homeOwnerInsuranceRes: homeOwnerInsuranceRes,
						monthInsuranceRes: parseFloat(resp.monthInsurance).toFixed(2),
						monthInsuranceResOrg: resp.monthInsurance,
					}, this.changeDayInterestPrice);
				} else {
					this.setState({
						monthInsuranceRes: parseFloat(resp.monthInsurance).toFixed(2),
						monthInsuranceResOrg: resp.monthInsurance,
						monthInsuranceRes: resp.monthInsurance,
						monIns: this.state.monInsOrg,
					}, this.calTotalMonthlyPaymentAfterZeroMonIns);
				}

			} else { this.calTotalMonthlyPaymentAfterZeroMonIns(); }
		}
	}

	//Total Monthly Payment
	calTotalMonthlyPaymentAfterZeroMonIns() {
		requestTotPreItem = { 'principalRate': this.state.principalRate, 'realEstateTaxesRes': this.state.realEstateTaxesRes, 'homeOwnerInsuranceRes': this.state.homeOwnerInsuranceRes, 'monthlyRate': this.state.monthlyRate, 'paymentAmount1': this.state.paymentAmount1, 'pnintrate': this.state.pnintrate, 'paymentAmount2': this.state.paymentAmount2 };

		responseTotPreItem = getRefTotalMonthlyPayment(requestTotPreItem);

		this.setState({ totalMonthlyPayment: responseTotPreItem.totalMonthlyPayment }, this.changeDayInterestPrice);
	}

	//Function to calculate mon Ins value in prepaid tab
	onChangeMonIns() {
		if (this.state.monIns > 0) {
			//console.log(this.response.prepaidMonthTaxes);
			requestHomeOwnerInsData = { 'monthInsuranceRes': monthInsuranceRes, 'months': this.state.numberOfMonthsInsurancePrepaid };
			responseHomeOwnerIns = getRefHomeOwnerInsurance(requestHomeOwnerInsData);
			homeOwnerInsuranceRes = responseHomeOwnerIns.homeOwnerInsuranceRes;
			this.setState({
				homeOwnerInsuranceRes: homeOwnerInsuranceRes,
				monthInsuranceRes: parseFloat(monthInsuranceRes).toFixed(2),
				monthInsuranceResOrg: monthInsuranceRes,
			}, this.changeDayInterestPrice);
		} else {
			this.changeDayInterestPrice();
		}
	}

	//Function to calculate day interest value in prepaid tab
	changeDayInterestPrice() {
		if (this.state.tab == 'CONV' && this.state.loan_amt != "") {
			amt = this.state.loan_amt;
		} else if (this.state.tab == 'CASH') {
			amt = '0.00';
		} else {
			amt = this.state.adjusted_loan_amt;
		}
		data = { 'adjusted': amt, 'interestRate': this.state.todaysInterestRate, 'days': this.state.numberOfDaysPerMonth };

		resp = getRefDailyInterest(data);
		daysInterest = resp.daysInterest;
		if (this.state.tab == 'CONV' && this.state.loan_amt2 != "" && this.state.loan_amt2 != '0.00') {
			amt2 = this.state.loan_amt2;
			data2 = { 'adjusted': amt2, 'interestRate': this.state.todaysInterestRate1, 'days': this.state.numberOfDaysPerMonth };
			//Alert.alert("fds",JSON.stringify(data2))
			resp2 = getRefDailyInterest(data2);
			daysInterest = (parseFloat(daysInterest) + parseFloat(resp2.daysInterest)).toFixed(2);
		}

		//Alert.alert('Alert!', JSON.stringify(data))
		//console.log(this.request);
		//calling method to calculate the discount amount

		this.setState({
			daysInterest: daysInterest,
		}, this.calOriginatinFee);
	}

	callBuyerSettingApi() {
		if ((this.state.tab == 'CONV' || this.state.tab == 'FHA') && (this.state.loan_amt != "")) {
			amt = this.state.loan_amt;
		} else if (this.state.tab == 'CASH') {
			amt = '0.00';
		} else {
			amt = this.state.adjusted_loan_amt;
		}
		callPostApi(GLOBAL.BASE_URL + GLOBAL.Refinance_Cost_Setting, {
			user_id: this.state.user_id, company_id: this.state.company_id, zip: this.state.postal_code
		}, this.state.access_token)
			.then((response) => {

				console.log("refinance costs setting " + JSON.stringify(result));

				var i = 1;
				const costRequest = {};
				const requestForTotalCost = {};

				// For setting last fields of closing costs page
				for (let resObj of result.data.closingCostSetting) {
					const update = {};
					req = { 'amount': amt, 'salePrice': this.state.sale_pr_calc, 'type': resObj.type, 'rate': resObj.fee };


					console.log("req params " + JSON.stringify(req));

					var data = getRefCostTypeTotal(req);

					console.log("response params 1 " + JSON.stringify(data));

					feeval = data.totalCostRate;

					update['label' + i] = resObj.label;
					update['fee' + i] = feeval;
					update['type' + i] = resObj.type;
					update['totalfee' + i] = resObj.fee;
					costRequest['cost' + i] = resObj.fee;
					// Start new line added by lovedeep on 22-06-2018
					requestForTotalCost['cost' + i] = data.totalCostRate;
					// End new line added by lovedeep on 22-06-2018
					this.setState(update);
					i++;
				}




				console.log("update " + JSON.stringify(requestForTotalCost));

				let costResponse = getRefTotalCostRate(requestForTotalCost);
				totalCost = costResponse.totalCostRate;
				this.setState({ totalCost: totalCost });

				console.log("totalcost 1 " + totalCost);

			});

		callPostApi(GLOBAL.BASE_URL + GLOBAL.Buyer_Cost_Setting, {
			user_id: this.state.user_id, company_id: this.state.company_id, zip: this.state.postal_code
		}, this.state.access_token)
			.then((response) => {

				console.log("buyer cost setting " + JSON.stringify(result.data.userSettingMonthExp));

				var j = 1;
				for (resObjMonthExp of result.data.userSettingMonthExp) {

					console.log("j value and label value " + j + ", " + resObjMonthExp.label + ", " + resObjMonthExp.fee);

					if (j == 3) {
						const updateOtherCost = {};
						updateOtherCost['twoMonthsPmi1' + j] = resObjMonthExp.label;
						updateOtherCost['costOther' + j] = resObjMonthExp.fee;
						this.setState(updateOtherCost);
						this.setState({ twoMonthsPmi1: resObjMonthExp.label, costOther: resObjMonthExp.fee });



					} else {
						const updateMonthExp = {};
						if ('paymentAmount' + j + "Fixed") {
							paymentAmt = this.state['paymentAmount' + j];
						} else {
							paymentAmt = resObjMonthExp.fee;
						}

						// changes done by lovedeep
						if (j == 1 || j == 2) {
							updateMonthExp['monthlyExpensesOther' + j] = 'Other';
						}

						updateMonthExp['paymentAmount' + j] = paymentAmt;
						updateMonthExp['typeMonthExp' + j] = resObjMonthExp.key;
						this.setState(updateMonthExp);
					}
					j++;
				}

				request = { 'salePrice': result.data.userSetting.todaysInterestRate, 'LTV': '90', 'LTV2': '' };
				conv_amt = getRefAmountConventional(request);
				if (this.state.monTaxFixed) {
					monTax = this.state.monTax;
				} else {
					monTax = result.data.userSetting.taxRatePerYearPerOfSalePrice;
				}
				if (this.state.monInsFixed) {
					monIns = this.state.monIns;
				} else {
					monIns = result.data.userSetting.homeownerInsuranceRateYearOfSalePrice;
				}
				if (this.state.numberOfDaysPerMonthFixed) {
					numberOfDaysPerMonth = this.state.numberOfDaysPerMonth;
				} else {
					numberOfDaysPerMonth = result.data.userSetting.numberOfDaysPerMonth;
				}
				this.setState({
					numberOfMonthsInsurancePrepaid: result.data.userSetting.numberOfMonthsInsurancePrepaid,
					numberOfMonthsInsurancePrepaidOrg: result.data.userSetting.numberOfMonthsInsurancePrepaid,
					monTax: monTax,
					monIns: monIns,
					monTaxOrg: result.data.userSetting.taxRatePerYearPerOfSalePrice,
					monInsOrg: result.data.userSetting.homeownerInsuranceRateYearOfSalePrice,
					creditReport: result.data.userSetting.creditReport,
					numberOfDaysPerMonth: numberOfDaysPerMonth,
					numberOfDaysPerMonthBuyer: numberOfDaysPerMonth,
					termsOfLoansinYears: result.data.userSetting.termsOfLoansinYears,
					todaysInterestRate: result.data.userSetting.todaysInterestRate,
					down_payment: conv_amt.downPayment,
					loan_amt: conv_amt.amount,
				}, this.callBuyerConvSettingApi);
			});
	}

	// Function for fetching and setting value of price based on month on prepaid page
	callGlobalSettingApi() {
		callPostApi(GLOBAL.BASE_URL + GLOBAL.state_buyer_proration_global_setting, {
			"state_id": this.state.state

		}, this.state.access_token)
			.then((response) => {
				this.setState({
					monTaxVal: result.data[this.state.monName],
					monTaxValOrg: result.data[this.state.monName]
				});
			});
	}

	// Function for fetching and setting value of price based on month on prepaid page
	callGlobalSettingApiOnDateChange() {
		callPostApi(GLOBAL.BASE_URL + GLOBAL.state_buyer_proration_global_setting, {
			"state_id": this.state.state

		}, this.state.access_token)
			.then((response) => {
				this.setState({
					monTaxVal: result.data[this.state.monName]
				}, this.changeMonTaxPrice);
			});
	}

	callbuyerEscrowXmlData() {
		callPostApi(GLOBAL.BASE_URL + GLOBAL.Refinance_Cost_Setting, {
			user_id: this.state.user_id, company_id: this.state.company_id, zip: this.state.postal_code
		}, this.state.access_token)
			.then((response) => {

				console.log("Refinance_Cost_Setting callbuyerEscrowXmlData " + JSON.stringify(result));

				if (this.state.taxservicecontractFixed == false) {
					taxservicecontract = result.data.userSetting.taxservicecontract;
				} else {
					taxservicecontract = this.state.taxservicecontract;
				}

				if (this.state.underwritingFixed == false) {
					underwriting = result.data.userSetting.underwriting;
				} else {
					underwriting = this.state.underwriting;
				}

				if (this.state.processingfeeFixed == false) {
					processingfee = result.data.userSetting.processingfee;
				} else {
					processingfee = this.state.processingfee;
				}

				if (this.state.appraisalfeeFixed == false) {
					appraisalfee = result.data.userSetting.appraisalfee;
				} else {
					appraisalfee = this.state.appraisalfee;
				}

				if (this.state.documentprepFixed == false) {
					documentprep = result.data.userSetting.documentpreparation;
				} else {
					documentprep = this.state.documentprep;
				}

				this.setState({
					taxservicecontract: taxservicecontract,
					underwriting: underwriting,
					processingfee: processingfee,
					appraisalfee: appraisalfee,
					documentprep: documentprep,
					originationfactor: result.data.userSetting.originationFactor,
					originationFactorType: result.data.userSetting.originationFactorType,


				}, this.callBuyerConvSettingApi);

			});
	}

	callBuyerConvSettingApi() {

		console.log("in call callBuyerConvSettingApi");
		//alert("in call callBuyerConvSettingApi");

		var secondLoanStatus;
		if (this.state.ltv2 != "" && this.state.ltv2 != "0.00") {
			secondLoanStatus = 1;
		} else {
			secondLoanStatus = 0;
		}

		//alert("state " + this.state.state + "user_county " + this.state.user_county + "county " + this.state.county);
		date = this.state.date;
		var split = date.split('-');
		date = Number(split[0]) + '/' + Number(split[1]) + '/' + Number(split[2]);



		/**=========================== Special case for Texas State ======================================**/

		if (this.state.state_code == 'TX') {
			this.setState({
				payoff: this.state.loansToBePaid_1Balance
			});
		} else {
			this.setState({
				payoff: 0
			});
		}

		/**=========================== Special case for Texas State ======================================**/

		if (this.state.reissueSalePrice != '' || this.state.reissueSalePrice != '0.00') {
			this.setState({
				reissueYearDropdownVal: this.state.reissueSalePrice
			});
		}

		escrow_xml_request = {
			"city": this.state.city,
			"county_name": this.state.user_county,
			"salePrice": this.state.sale_pr,
			"adjusted": this.state.adjusted_loan_amt,
			"state": this.state.state,
			"county": this.state.county,
			zip: this.state.postal_code,
			"estStlmtDate": date,
			'userId': this.state.user_id,
			'device': this.state.deviceName,
			"2ndloan": secondLoanStatus,
			"reissueyr": 0,
			"payoff": this.state.payoff
		};

		console.log("escrow request " + JSON.stringify(escrow_xml_request));

		if (this.state.sale_pr > 0) {
			if (this.state.isCheckForOhio == true) {
				if (this.state.reissueSalePrice != '0.00' && this.state.reissueSalePrice > 0) {
					callPostApi(GLOBAL.BASE_URL + GLOBAL.refinance_escrow_xml_data, {
						"city": this.state.city, "county_name": this.state.user_county, "salePrice": this.state.sale_pr, "adjusted": this.state.adjusted_loan_amt, "state": this.state.state, "county": this.state.county, zip: this.state.postal_code, "estStlmtDate": date, 'userId': this.state.user_id, 'device': this.state.deviceName, "2ndloan": secondLoanStatus, "reissueyr": 0, "payoff": this.state.payoff
					}, this.state.access_token)
						.then((response) => {

							console.log("callBuyerConvSettingApi escrow " + JSON.stringify(data));


							/*if(this.state.state_code == 'TX'){
	
								discount = this.statediscountYearSelectedDropdownVal.value;
						
									request = {'payoffval': result.data.payoffval,'titleInsOrg': result.data.titleIns,'discount': discount};
									
									//calling method to calculate the adjustments
									response = getDiscountYearChng(request);
									this.setState({
										titleInsuranceShortRate : response.titleIns
									});
								
							}*/

							//Alert.alert("DF",JSON.stringify(result))
							this.setState({
								titleInsOrg: result.data.titleIns,
								payoffval: result.data.payoffval,
								escrowFee: result.data.escrowFee,
								escrowQuote: result.data.Quote,
								escrowPolicyType: result.data.escrowPolicyType,
								titleInsuranceShortRate: result.data.titleIns,
								titleInsName: result.data.titleInsName,
							}, this.calEscrowData);

							console.log(" title ins short rate titleInsuranceShortRate 1 " + result.data.titleIns);

						});
				}
			} else {
				callPostApi(GLOBAL.BASE_URL + GLOBAL.refinance_escrow_xml_data, {
					"city": this.state.city, "county_name": this.state.user_county, "salePrice": this.state.sale_pr, "adjusted": this.state.adjusted_loan_amt, "state": this.state.state, "county": this.state.county, zip: this.state.postal_code, "estStlmtDate": date, 'userId': this.state.user_id, 'device': this.state.deviceName, "2ndloan": secondLoanStatus, "reissueyr": 0, "payoff": this.state.payoff
				}, this.state.access_token)
					.then((response) => {

						console.log("callBuyerConvSettingApi escrow " + JSON.stringify(data));


						/*if(this.state.state_code == 'TX'){
	
							discount = this.statediscountYearSelectedDropdownVal.value;
					
								request = {'payoffval': result.data.payoffval,'titleInsOrg': result.data.titleIns,'discount': discount};
								
								//calling method to calculate the adjustments
								response = getDiscountYearChng(request);
								this.setState({
									titleInsuranceShortRate : response.titleIns
								});
							
						}*/

						//Alert.alert("DF",JSON.stringify(result))
						this.setState({
							titleInsOrg: result.data.titleIns,
							payoffval: result.data.payoffval,
							escrowFee: result.data.escrowFee,
							escrowQuote: result.data.Quote,
							escrowPolicyType: result.data.escrowPolicyType,
							titleInsuranceShortRate: result.data.titleIns,
							titleInsName: result.data.titleInsName,
						}, this.calEscrowData);

						console.log(" title ins short rate titleInsuranceShortRate 2 " + result.data.titleIns);

					});
			}
		}
		else {
			this.calEscrowData();
		}
	}

	callSettingApiForTabs() {

		if ((this.state.tab == 'CONV' || this.state.tab == 'FHA') && (this.state.loan_amt != "")) {
			amt = this.state.loan_amt;
		} else if (this.state.tab == 'CASH') {
			amt = '0.00';
		} else {
			amt = this.state.adjusted_loan_amt;
		}
		const requestForTotalCost = {};
		for (var i = 1; i < 12; i++) {
			const update = {};

			req = { 'amount': amt, 'salePrice': this.state.sale_pr_calc, 'type': this.state['type' + i], 'rate': this.state['totalfee' + i] };

			console.log("req params 2 " + JSON.stringify(req));

			var data = getRefCostTypeTotal(req);

			console.log("response params 2 " + JSON.stringify(data));

			feeval = data.totalCostRate;
			update['fee' + i] = feeval;
			requestForTotalCost['cost' + i] = data.totalCostRate;
			this.setState(update);
		}

		if (this.state.sale_pr != '0.00') {

			// Start New code added by lovedeep on 22-06-2018
			console.log("update " + JSON.stringify(requestForTotalCost));

			let costResponse = getRefTotalCostRate(requestForTotalCost);
			totalCost = costResponse.totalCostRate;
			this.setState({ totalCost: totalCost });

			console.log("totalcost 1 " + totalCost);

			// End New code added by lovedeep on 22-06-2018


			if (this.state.disc != '') {
				this.onChangeDisc(this.state.disc);
			}
			if (this.state.tab == "CONV") {
				callPostApi(GLOBAL.BASE_URL + GLOBAL.Refinance_Cost_Setting, {
					user_id: this.state.user_id, company_id: this.state.company_id, zip: this.state.postal_code
				}, this.state.access_token)
					.then((response) => {

						console.log("Refinance_Cost_Setting " + JSON.stringify(result));

						if (this.state.taxservicecontractFixed == false) {
							taxservicecontract = result.data.userSetting.taxservicecontract;
						} else {
							taxservicecontract = this.state.taxservicecontract;
						}

						if (this.state.underwritingFixed == false) {
							underwriting = result.data.userSetting.underwriting;
						} else {
							underwriting = this.state.underwriting;
						}

						if (this.state.processingfeeFixed == false) {
							processingfee = result.data.userSetting.processingfee;
						} else {
							processingfee = this.state.processingfee;
						}

						if (this.state.appraisalfeeFixed == false) {
							appraisalfee = result.data.userSetting.appraisalfee;
						} else {
							appraisalfee = this.state.appraisalfee;
						}

						if (this.state.documentprepFixed == false) {
							documentprep = result.data.userSetting.documentpreparation;
						} else {
							documentprep = this.state.documentprep;
						}

						this.setState({
							taxservicecontract: taxservicecontract,
							underwriting: underwriting,
							processingfee: processingfee,
							appraisalfee: appraisalfee,
							documentprep: documentprep,
							originationfactor: result.data.userSetting.originationFactor,
							originationFactorType: result.data.userSetting.originationFactorType,
						}, this.callOwnerEscrowLenderSettingApi);

					});
			} else {
				callPostApi(GLOBAL.BASE_URL + GLOBAL.fha_va_usda_setting_api, {
					user_id: this.state.user_id, company_id: this.state.company_id, loan_type: this.state.tab, calc_type: "Buyer", zip: this.state.postal_code
				}, this.state.access_token)
					.then((response) => {


						console.log("fha_va_usda_setting_api " + JSON.stringify(result));

						if (this.state.taxservicecontractFixed == false) {
							taxservicecontract = result.data.VA_TaxServiceContract;
						} else {
							taxservicecontract = this.state.taxservicecontract;
						}

						if (this.state.underwritingFixed == false) {
							underwriting = result.data.VA_Underwriting;
						} else {
							underwriting = this.state.underwriting;
						}

						if (this.state.processingfeeFixed == false) {
							processingfee = result.data.VA_ProcessingFee;
						} else {
							processingfee = this.state.processingfee;
						}

						if (this.state.appraisalfeeFixed == false) {
							appraisalfee = result.data.VA_AppraisalFee;
						} else {
							appraisalfee = this.state.appraisalfee;
						}

						if (this.state.documentprepFixed == false) {
							documentprep = result.data.VA_DocumentPreparation;
						} else {
							documentprep = this.state.documentprep;
						}

						if (this.state.tab == 'VA') {
							this.setState({
								taxservicecontract: taxservicecontract,
								underwriting: underwriting,
								processingfee: processingfee,
								appraisalfee: appraisalfee,
								documentprep: documentprep,
								originationfactor: result.data.VA_OriginationFactor,
								originationFactorType: result.data.VA_OriginationFactorType,
							}, this.callOwnerEscrowLenderSettingApi);
						} else {

							if (this.state.taxservicecontractFixed == false) {
								taxservicecontract = result.data.FHA_TaxServiceContract;
							} else {
								taxservicecontract = this.state.taxservicecontract;
							}

							if (this.state.underwritingFixed == false) {
								underwriting = result.data.FHA_Underwriting;
							} else {
								underwriting = this.state.underwriting;
							}

							if (this.state.processingfeeFixed == false) {
								processingfee = result.data.FHA_ProcessingFee;
							} else {
								processingfee = this.state.processingfee;
							}

							if (this.state.appraisalfeeFixed == false) {
								appraisalfee = result.data.FHA_AppraisalFee;
							} else {
								appraisalfee = this.state.appraisalfee;
							}

							if (this.state.documentprepFixed == false) {
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
								originationFactorType: result.data.FHA_OriginationFactorType,
							}, this.callOwnerEscrowLenderSettingApi);
						}
					});
			}
		} else {
			this.callOwnerEscrowLenderSettingApi();
		}
	}

	calMonTax(fieldVal, fieldName) {
		//fieldVal = this.removeCommas(fieldVal);
		//	console.log("monthly tax " + fieldVal);
		this.setState({ animating: 'true' });

		if (fieldVal != '' && fieldVal != '0.00' && fieldVal != 0) {
			request = { 'annualPropertyTax': fieldVal, 'prepaidMonthTaxes1': this.state.monTaxVal };
			annualTaxData = getActualAnnualTax(request);
			req = { 'months': this.state.monTaxVal, 'prepaidMonthTaxesRes': annualTaxData.monthlyTaxRes };
			//calling method to calculate the discount amount
			responseRealEstate = getRefRealEstateTaxes(req);

			realEstateTaxesRes = responseRealEstate.realEstateTaxes;

			//Alert.alert("df", JSON.stringify(realEstateTaxesRes));

			this.setState({ prepaidMonthTaxes: annualTaxData.monthlyTaxRes, monTax: '0.00', realEstateTaxesRes: realEstateTaxesRes }, this.calTotalMonthlyPaymentAfterActualTaxAndIns);
		} else {


			// if condition added by lovedeep on 03-16-2018

			if (this.state.monTaxOrg > 0) {
				data = { 'salePrice': this.state.sale_pr_calc, 'monthlyTax': this.state.monTaxOrg, 'months': this.state.monTaxVal };
				//console.log(this.request);
				//calling method to calculate the discount amount
				resp = getRefPreMonthTax(data);
				//console.log(this.response.prepaidMonthTaxes);
				prepaidMonthTaxesRes = parseFloat(resp.prepaidMonthTaxes).toFixed(2);
				if (prepaidMonthTaxesRes > 0) {
					data_mon_tax = { 'salePrice': this.state.sale_pr_calc, 'monthlyTax': this.state.monTaxOrg, 'months': this.state.monTaxVal };
					resp_mon_tax = getRefPreMonthTax(data_mon_tax);
					prepaidMonthTaxes = resp_mon_tax.prepaidMonthTaxes;
					req = { 'months': this.state.monTaxVal, 'prepaidMonthTaxesRes': prepaidMonthTaxes };
					responseRealEstate = getRefRealEstateTaxes(req);
					realEstateTaxesRes = responseRealEstate.realEstateTaxes;
				}

				this.setState({
					realEstateTaxesRes: realEstateTaxesRes,
					prepaidMonthTaxes: parseFloat(resp.prepaidMonthTaxes).toFixed(2),
					prepaidMonthTaxesOrg: resp.prepaidMonthTaxes,
					monTax: this.state.monTaxOrg,
				}, this.calTotalMonthlyPaymentAfterActualTaxAndIns);

			}

			//this.setState({prepaidMonthTaxes: this.state.prepaidMonthTaxesOrg,monTax: this.state.monTaxOrg,realEstateTaxesRes:this.state.realEstateTaxesResOrg},this.calTotalMonthlyPaymentAfterActualTaxAndIns);
		}
	}

	calMonIns(fieldVal, fieldName) {
		fieldVal = this.removeCommas(fieldVal);
		if (fieldVal != '' && fieldVal != '0.00' && fieldVal != 0) {
			request = { 'annualPropertyIns': fieldVal, 'prepaidMonthInsurance': this.state.numberOfMonthsInsurancePrepaid };
			annualInsData = getActualAnnualIns(request);



			//creating object for prepaid monthly insurance
			requestHomeOwnerInsData = { 'monthInsuranceRes': annualInsData.monthlyInsRes, 'months': this.state.numberOfMonthsInsurancePrepaid };
			//calling method to calculate the discount amount
			responseHomeOwnerIns = getRefHomeOwnerInsurance(requestHomeOwnerInsData);
			homeOwnerInsuranceRes = responseHomeOwnerIns.homeOwnerInsuranceRes;
			//Alert.alert("df",JSON.stringify(homeOwnerInsuranceRes));
			this.setState({ monthInsuranceRes: annualInsData.monthlyInsRes, monIns: '0.00', homeOwnerInsuranceRes: homeOwnerInsuranceRes }, this.calTotalMonthlyPaymentAfterActualTaxAndIns);
		} else {

			if (this.state.monInsOrg > 0) {
				data = { 'salePrice': this.state.sale_pr_calc, 'insuranceRate': this.state.monInsOrg, 'months': this.state.numberOfMonthsInsurancePrepaid };

				//calling method to calculate the discount amount
				resp = getRefMonthlyInsurance(data);

				//console.log(this.response.prepaidMonthTaxes);
				monthInsuranceRes = parseFloat(resp.monthInsurance).toFixed(2);
				if (monthInsuranceRes > 0) {
					data_mon_ins = { 'salePrice': this.state.sale_pr_calc, 'insuranceRate': this.state.monInsOrg, 'months': this.state.numberOfMonthsInsurancePrepaid };
					resp_mon_ins = getRefMonthlyInsurance(data_mon_ins);
					monthInsurance = resp_mon_ins.monthInsurance;
					requestHomeOwnerInsData = { 'monthInsuranceRes': monthInsurance, 'months': this.state.numberOfMonthsInsurancePrepaid };
					responseHomeOwnerIns = getRefHomeOwnerInsurance(requestHomeOwnerInsData);
					homeOwnerInsuranceRes = responseHomeOwnerIns.homeOwnerInsuranceRes;
					this.setState({
						homeOwnerInsuranceRes: homeOwnerInsuranceRes,
						monthInsuranceRes: parseFloat(resp.monthInsurance).toFixed(2),
						monthInsuranceResOrg: resp.monthInsurance,
					}, this.changeDayInterestPrice);
				} else {
					this.setState({
						monthInsuranceRes: parseFloat(resp.monthInsurance).toFixed(2),
						monthInsuranceResOrg: resp.monthInsurance,
						monthInsuranceRes: resp.monthInsurance,
						monIns: this.state.monInsOrg,
					}, this.calTotalMonthlyPaymentAfterActualTaxAndIns);
				}

			}

			//this.setState({monthInsuranceRes: this.state.monthInsuranceResOrg,monIns: this.state.monInsOrg,homeOwnerInsuranceRes:this.state.homeOwnerInsuranceResOrg},this.calTotalMonthlyPaymentAfterActualTaxAndIns);
		}
	}

	callOwnerEscrowLenderSettingApi() {

		console.log("in call callOwnerEscrowLenderSettingApi");
		//alert("in call callOwnerEscrowLenderSettingApi");

		var secondLoanStatus;
		if (this.state.ltv2 != "" && this.state.ltv2 != "0.00") {
			secondLoanStatus = 1;
		} else {
			secondLoanStatus = 0;
		}
		if (this.state.tab == 'CONV' && this.state.loan_amt2 != "" && this.state.loan_amt2 != '0.00') {
			loan_amt = (parseFloat(this.state.loan_amt) + parseFloat(this.state.loan_amt2)).toFixed(2);
		} else {
			loan_amt = this.state.adjusted_loan_amt;
		}

		//In Escrow method

		/**=========================== Special case for Texas State ======================================**/

		if (this.state.state_code == 'TX') {
			this.setState({
				payoff: this.state.loansToBePaid_1Balance
			});
		} else {
			this.setState({
				payoff: 0
			});
		}

		/**=========================== Special case for Texas State ======================================**/

		date = this.state.date;
		var split = date.split('-');
		date = Number(split[0]) + '/' + Number(split[1]) + '/' + Number(split[2]);
		if (this.state.sale_pr > 0) {
			if (this.state.isCheckForOhio == true) {
				if (this.state.reissueSalePrice != '0.00' && this.state.reissueSalePrice > 0) {

					callPostApi(GLOBAL.BASE_URL + GLOBAL.refinance_escrow_xml_data, {
						"city": this.state.city, "county_name": this.state.user_county, "salePrice": this.state.sale_pr, "adjusted": loan_amt, "state": this.state.state, "county": this.state.county, zip: this.state.postal_code, "estStlmtDate": date, 'userId': this.state.user_id, 'device': this.state.deviceName, "2ndloan": secondLoanStatus, "reissueyr": 0, "payoff": this.state.payoff
					}, this.state.access_token)
						.then((response) => {

							console.log("callOwnerEscrowLenderSettingApi escrow " + JSON.stringify(result));


							console.log("this.state.discountYearSelectedDropdownVal " + JSON.stringify(this.state.discountYearSelectedDropdownVal));

							if (this.state.discountYearSelectedDropdownVal.label != 'Year' && this.state.payoffval != undefined && this.state.payoffval != '0.00') {

								discount = this.state.discountYearSelectedDropdownVal.value;

								request = { 'payoffval': result.data.payoffval, 'titleInsOrg': result.data.titleIns, 'discount': discount };

								//calling method to calculate the adjustments
								response = getDiscountYearChng(request);
								this.setState({
									titleInsuranceShortRate: response.titleIns
								});

							} else {

								this.setState({
									titleInsuranceShortRate: result.data.titleIns
								});
								//titleInsuranceShortRate : result.data.titleIns,
							}

							console.log(" title ins short rate titleInsuranceShortRate 3 " + result.data.titleIns);

							//alert(JSON.stringify(result));


							/**==== Start Special Case for Minnesota added by lovedeep ====== **/

							if (this.state.state_code == 'MN') {
								this.state.fee4 = result.data.Mortgage_Registration_Tax;
								this.state.fee7 = result.data.Underwriting;
							}

							/**==== End Special Case for Minnesota added by lovedeep ====== **/


							escrowTotal = (parseFloat(result.data.escrowFee) + parseFloat(result.data.titleIns)).toFixed(2);
							this.setState({
								titleInsOrg: result.data.titleIns,
								payoffval: result.data.payoffval,
								escrowFee: result.data.escrowFee,
								escrowQuote: result.data.Quote,
								escrowPolicyType: result.data.escrowPolicyType,
								titleInsName: result.data.titleInsName,
								escrowTotal: escrowTotal
							}, this.calTotalMonthlyPayment);



							//this.titleInsOrg			= this.BuyerEscrowData.data.titleIns;
							//this.titleIns				= this.BuyerEscrowData.data.titleIns;
							//this.payoffval				= this.BuyerEscrowData.data.payoffval;


							//this.afterSetStateSettingApi();
							//Alert.alert('Alert!', JSON.stringify(this.state.city + "..this.state.city" + this.state.user_county + "..this.state.user_county" + this.state.sale_pr + "..this.state.sale_pr" + this.state.adjusted_loan_amt + "..this.state.adjusted_loan_amt" + this.state.state + "..this.state.state" + this.state.county + "..this.state.county" + this.state.date + "..this.state.date"))
						});
				}
			} else {
				callPostApi(GLOBAL.BASE_URL + GLOBAL.refinance_escrow_xml_data, {
					"city": this.state.city, "county_name": this.state.user_county, "salePrice": this.state.sale_pr, "adjusted": loan_amt, "state": this.state.state, "county": this.state.county, zip: this.state.postal_code, "estStlmtDate": date, 'userId': this.state.user_id, 'device': this.state.deviceName, "2ndloan": secondLoanStatus, "reissueyr": 0, "payoff": this.state.payoff
				}, this.state.access_token)
					.then((response) => {

						console.log("callOwnerEscrowLenderSettingApi escrow " + JSON.stringify(result));


						console.log("this.state.discountYearSelectedDropdownVal " + JSON.stringify(this.state.discountYearSelectedDropdownVal));

						if (this.state.discountYearSelectedDropdownVal.label != 'Year' && this.state.payoffval != undefined && this.state.payoffval != '0.00') {

							discount = this.state.discountYearSelectedDropdownVal.value;

							request = { 'payoffval': result.data.payoffval, 'titleInsOrg': result.data.titleIns, 'discount': discount };

							//calling method to calculate the adjustments
							response = getDiscountYearChng(request);
							this.setState({
								titleInsuranceShortRate: response.titleIns
							});

						} else {

							this.setState({
								titleInsuranceShortRate: result.data.titleIns
							});
							//titleInsuranceShortRate : result.data.titleIns,
						}

						console.log(" title ins short rate titleInsuranceShortRate 4 " + result.data.titleIns);

						//alert(JSON.stringify(result));


						/**==== Start Special Case for Minnesota added by lovedeep ====== **/

						if (this.state.state_code == 'MN') {
							this.state.fee4 = result.data.Mortgage_Registration_Tax;
							this.state.fee7 = result.data.Underwriting;
						}

						/**==== End Special Case for Minnesota added by lovedeep ====== **/


						escrowTotal = (parseFloat(result.data.escrowFee) + parseFloat(result.data.titleIns)).toFixed(2);
						this.setState({
							titleInsOrg: result.data.titleIns,
							payoffval: result.data.payoffval,
							escrowFee: result.data.escrowFee,
							escrowQuote: result.data.Quote,
							escrowPolicyType: result.data.escrowPolicyType,
							titleInsName: result.data.titleInsName,
							escrowTotal: escrowTotal
						}, this.calTotalMonthlyPayment);



						//this.titleInsOrg			= this.BuyerEscrowData.data.titleIns;
						//this.titleIns				= this.BuyerEscrowData.data.titleIns;
						//this.payoffval				= this.BuyerEscrowData.data.payoffval;


						//this.afterSetStateSettingApi();
						//Alert.alert('Alert!', JSON.stringify(this.state.city + "..this.state.city" + this.state.user_county + "..this.state.user_county" + this.state.sale_pr + "..this.state.sale_pr" + this.state.adjusted_loan_amt + "..this.state.adjusted_loan_amt" + this.state.state + "..this.state.state" + this.state.county + "..this.state.county" + this.state.date + "..this.state.date"))
					});
			}

		} else { this.calTotalMonthlyPayment() }
	}

	_onChangeDiscountYear = (item) => {
		let discount, request, response;
		//console.log("item " + JSON.stringify(item));
		//{"key":1,"label":"2","value":"40"}
		discount = item.value;

		console.log("payoffval _onChangeDiscountYear " + this.state.payoffval);


		if (this.state.payoffval == undefined || this.state.payoffval == '0.00') {
			this.state.payoffval = '0.00';
		}

		request = { 'payoffval': this.state.payoffval, 'titleInsOrg': this.state.titleInsOrg, 'discount': discount };

		//calling method to calculate the adjustments
		response = getDiscountYearChng(request);

		console.log(JSON.stringify(response));

		this.setState({
			discountYearSelectedDropdownVal: item,
			titleInsuranceShortRate: response.titleIns
		}, this.calTotalInvestment);

		console.log(" title ins short rate titleInsuranceShortRate 5 " + response.titleIns);
	}


	calEscrowData() {
		escrowTotal = (parseFloat(this.state.lenderFee) + parseFloat(this.state.ownerFee) + parseFloat(this.state.escrowFee)).toFixed(2);
		this.setState({ escrowTotal: escrowTotal }, this.calTotalClosingCostOnload);
	}

	updatePhoneNumberFormat(phone_number) {
		phone_number = phone_number.replace(/[^\d.]/g, '').replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
		this.setState({ contact_number: phone_number });
	}

	calTotalClosingCostOnload() {
		if (this.state.originationFee == '') {
			originationFee = '0.00';
		} else {
			originationFee = this.state.originationFee;
		}

		/* Alert.alert('Alert!', JSON.stringify(originationFee + "..originationFee" + this.state.processingfee + "..processingfee" + this.state.taxservicecontract + "..taxservicecontract" + this.state.documentprep + "..documentprep" + this.state.underwriting + "..underwriting" + this.state.appraisalfee + "..appraisalfee" + this.state.creditReport + "..creditReport")) */
		totalCostData = (parseFloat(originationFee) + parseFloat(this.state.processingfee) + parseFloat(this.state.taxservicecontract) + parseFloat(this.state.documentprep) + parseFloat(this.state.underwriting) + parseFloat(this.state.appraisalfee) + parseFloat(this.state.prepaymentpenaltyfee) + parseFloat(this.state.creditReport)).toFixed(2);

		//Alert.alert('dd', JSON.stringify(totalCostData));
		this.setState({ totalCostData: totalCostData });
		if (this.state.discAmt > 0) {
			totalClosingCost = (parseFloat(this.state.totalCost) + parseFloat(totalCostData) + parseFloat(this.state.discAmt)).toFixed(2);
		} else {
			totalClosingCost = (parseFloat(this.state.totalCost) + parseFloat(totalCostData)).toFixed(2);
		}
		if (this.state.escrowTotal > 0) {
			totalClosingCost = (parseFloat(totalClosingCost) + parseFloat(this.state.escrowTotal)).toFixed(2);
		}

		console.log("totalcost 2 " + this.state.totalCost);
		this.setState({ totalClosingCost: totalClosingCost }, this.callSalesPr);
	}

	calTotalClosingCost() {
		if (this.state.originationFee == '') {
			originationFee = '0.00';
		} else {
			originationFee = this.state.originationFee;
		}

		//	Alert.alert('Alert!', JSON.stringify(originationFee + "..originationFee" + this.state.processingfee + "..processingfee" + this.state.taxservicecontract + "..taxservicecontract" + this.state.documentprep + "..documentprep" + this.state.underwriting + "..underwriting" + this.state.appraisalfee + "..appraisalfee" + this.state.creditReport + "..creditReport")
		totalCostData = (parseFloat(originationFee) + parseFloat(this.state.processingfee) + parseFloat(this.state.taxservicecontract) + parseFloat(this.state.documentprep) + parseFloat(this.state.underwriting) + parseFloat(this.state.appraisalfee) + parseFloat(this.state.prepaymentpenaltyfee) + parseFloat(this.state.creditReport)).toFixed(2);

		this.setState({ totalCostData: totalCostData });
		if (this.state.discAmt != '') {
			totalClosingCost = (parseFloat(this.state.totalCost) + parseFloat(totalCostData) + parseFloat(this.state.discAmt)).toFixed(2);
		} else {
			totalClosingCost = (parseFloat(this.state.totalCost) + parseFloat(totalCostData)).toFixed(2);
		}
		if (this.state.escrowTotal > 0) {
			totalClosingCost = (parseFloat(totalClosingCost) + parseFloat(this.state.escrowTotal)).toFixed(2);
		}

		this.setState({ totalClosingCost: totalClosingCost }, this.calTotalPrepaidItems);
	}

	settingsApi(flag) {
		this.setState({ sale_pr_calc: this.state.sale_pr, tab: flag, animating: 'true', monTaxVal: this.state.monTaxValOrg, numberOfMonthsInsurancePrepaid: this.state.numberOfMonthsInsurancePrepaidOrg }, this.afterSetStateSettingApi);
	}
	//Call when state of tab is set
	afterSetStateSettingApi() {
		this.setState({
			enterAddressBar: false
		});
		if (this.state.tab == "FHA") {
			this.setState({ ltv2: '0.00', todaysInterestRate1: '0.00', termsOfLoansinYears2: '0.00' });
			this.callFHAsettinsapi();
		} else if (this.state.tab == "VA") {
			this.setState({ ltv2: '0.00', todaysInterestRate1: '0.00', termsOfLoansinYears2: '0.00' });
			this.callVAsettinsapi();
		} else if (this.state.tab == "USDA") {
			this.callUSDAsettinsapi();
		} else if (this.state.tab == "CONV") {
			this.callbuyerEscrowXmlData();
		} else if (this.state.tab == "CASH") {
			this.callCASHsettinsapi();
		}
		//Alert.alert('Alert!', JSON.stringify(this.state.tab))
		// For national global setting api to calculate down payment,loan amount and adjusted loan amount when tab changes
		/* if(this.state.sale_pr == ''){
			this.onChangeRate('0',"sale_pr");
		}else{
			this.onChangeRate(this.state.sale_pr,"sale_pr");
		} */
	}

	// Function for fetching and setting values of closing cost tab under FHA page
	callFHAsettinsapi() {
		callPostApi(GLOBAL.BASE_URL + GLOBAL.fha_va_usda_setting_api, {
			user_id: this.state.user_id, company_id: this.state.company_id, loan_type: "FHA", calc_type: "Buyer", zip: this.state.postal_code
		}, this.state.access_token)
			.then((response) => {

				console.log("fha_va_usda_setting_api callFHAsettinsapi " + JSON.stringify(result));

				if (this.state.taxservicecontractFixed == false) {
					taxservicecontract = result.data.FHA_TaxServiceContract;
				} else {
					taxservicecontract = this.state.taxservicecontract;
				}

				if (this.state.underwritingFixed == false) {
					underwriting = result.data.FHA_Underwriting;
				} else {
					underwriting = this.state.underwriting;
				}

				if (this.state.processingfeeFixed == false) {
					processingfee = result.data.FHA_ProcessingFee;
				} else {
					processingfee = this.state.processingfee;
				}

				if (this.state.appraisalfeeFixed == false) {
					appraisalfee = result.data.FHA_AppraisalFee;
				} else {
					appraisalfee = this.state.appraisalfee;
				}

				if (this.state.documentprepFixed == false) {
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
					originationFactorType: result.data.FHA_OriginationFactorType,
				}, this.callSalesPr);
			});
	}

	// Function for fetching and setting values of closing cost tab under VA page
	callVAsettinsapi() {
		callPostApi(GLOBAL.BASE_URL + GLOBAL.fha_va_usda_setting_api, {
			user_id: this.state.user_id, company_id: this.state.company_id, loan_type: "VA", calc_type: "Buyer", zip: this.state.postal_code
		}, this.state.access_token)
			.then((response) => {

				console.log("fha_va_usda_setting_api callVAsettinsapi " + JSON.stringify(result));

				if (this.state.taxservicecontractFixed == false) {
					taxservicecontract = result.data.VA_TaxServiceContract;
				} else {
					taxservicecontract = this.state.taxservicecontract;
				}

				if (this.state.underwritingFixed == false) {
					underwriting = result.data.VA_Underwriting;
				} else {
					underwriting = this.state.underwriting;
				}

				if (this.state.processingfeeFixed == false) {
					processingfee = result.data.VA_ProcessingFee;
				} else {
					processingfee = this.state.processingfee;
				}

				if (this.state.appraisalfeeFixed == false) {
					appraisalfee = result.data.VA_AppraisalFee;
				} else {
					appraisalfee = this.state.appraisalfee;
				}

				if (this.state.documentprepFixed == false) {
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
					originationFactorType: result.data.VA_OriginationFactorType,
				}, this.callSalesPr);
			});
	}

	// Function for fetching and setting values of closing cost tab under USDA page
	callUSDAsettinsapi() {
		callPostApi(GLOBAL.BASE_URL + GLOBAL.fha_va_usda_setting_api, {
			user_id: this.state.user_id, company_id: this.state.company_id, loan_type: "USDA", calc_type: "Buyer", zip: this.state.postal_code
		}, this.state.access_token)
			.then((response) => {

				console.log("fha_va_usda_setting_api callUSDAsettinsapi " + JSON.stringify(result));

				if (this.state.taxservicecontractFixed == false) {
					taxservicecontract = result.data.USDA_TaxServiceContract;
				} else {
					taxservicecontract = this.state.taxservicecontract;
				}

				if (this.state.underwritingFixed == false) {
					underwriting = result.data.USDA_Underwriting;
				} else {
					underwriting = this.state.underwriting;
				}

				if (this.state.processingfeeFixed == false) {
					processingfee = result.data.USDA_ProcessingFee;
				} else {
					processingfee = this.state.processingfee;
				}

				if (this.state.appraisalfeeFixed == false) {
					appraisalfee = result.data.USDA_AppraisalFee;
				} else {
					appraisalfee = this.state.appraisalfee;
				}

				if (this.state.documentprepFixed == false) {
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
					//originationFactorType : result.data.userSetting.originationFactorType,
				}, this.callSalesPr);
			});
	}

	// Function for fetching and setting values of closing cost tab under CASH page
	callCASHsettinsapi() {
		this.setState({
			taxservicecontract: '0.00',
			underwriting: '0.00',
			processingfee: '0.00',
			appraisalfee: '0.00',
			documentprep: '0.00',
			originationfactor: '0.00',

		}, this.callSalesPr);
	}


	calTotalPrepaidItems() {
		if (this.state.tab == 'FHA') {
			financialVal = this.state.FhaMipFin3;
		} else if (this.state.tab == 'VA') {
			financialVal = this.state.VaFfFin3;
		} else if (this.state.tab == 'USDA') {
			financialVal = this.state.UsdaMipFinance3;
		} else if (this.state.tab == 'CONV') {
			financialVal = this.state.monthPmiVal;
		}

		//creating object for loan payment adjustments
		requestTotPreItem = { 'prepaidMonthTaxesRes': this.state.prepaidMonthTaxes, 'monthInsuranceRes': this.state.monthInsuranceRes, 'daysInterestRes': this.state.daysInterest, 'financialVal': financialVal, 'prepaidAmount': this.state.costOther };
		// Alert.alert('Alert!', JSON.stringify(this.state.prepaidMonthTaxes + "prepaidMonthTaxes" + this.state.monthInsuranceRes + "monthInsuranceRes" + this.state.daysInterest + "daysInterest" + financialVal + "financialVal" )); 
		//calling method to calculate the adjustments

		//	console.log("requestTotPreItem for totalPrepaidItems " + JSON.stringify(requestTotPreItem));

		responseTotPreItem = getRefTotalPrepaidItems(requestTotPreItem);

		//	console.log("responseTotPreItem for totalPrepaidItems " + JSON.stringify(responseTotPreItem));

		/* if(this.state.costOther != ''){
			responseTotPreItem.totalPrepaidItems = (parseFloat(this.state.costOther) + parseFloat(responseTotPreItem.totalPrepaidItems)).toFixed(2)
		} */
		this.setState({ financialVal: financialVal, totalPrepaidItems: responseTotPreItem.totalPrepaidItems }, this.calTotalInvestment);
	}


	//Total Monthly Payment
	calTotalMonthlyPayment() {
		//creating object for loan payment adjustments
		requestTotPreItem = { 'principalRate': this.state.principalRate, 'realEstateTaxesRes': this.state.realEstateTaxesRes, 'homeOwnerInsuranceRes': this.state.homeOwnerInsuranceRes, 'monthlyRate': this.state.monthlyRate, 'pnintrate': this.state.pnintrate, 'paymentAmount1': this.state.paymentAmount1, 'paymentAmount2': this.state.paymentAmount2 };


		//   console.log("requestTotPreItem for total monthly payment " + JSON.stringify(requestTotPreItem));

		//calling method to calculate the adjustments
		responseTotPreItem = getRefTotalMonthlyPayment(requestTotPreItem);

		//	console.log("responseTotPreItem for total monthly payment " + JSON.stringify(responseTotPreItem));



		//Alert.alert("dd",JSON.stringify(responseTotPreItem));
		/* if(this.state.monthlyExpensesOther1 != "Other"){
			responseTotPreItem.totalMonthlyPayment = (parseFloat(this.state.paymentAmount1) + parseFloat(responseTotPreItem.totalMonthlyPayment)).toFixed(2);
		}
		if(this.state.monthlyExpensesOther2 != "Other"){
			responseTotPreItem.totalMonthlyPayment = (parseFloat(this.state.paymentAmount2) + parseFloat(responseTotPreItem.totalMonthlyPayment)).toFixed(2)
		} */


		this.setState({ totalMonthlyPayment: responseTotPreItem.totalMonthlyPayment }, this.changePrepaidPageFields);
	}

	//Total Monthly Payment
	calTotalMonthlyPaymentAfterActualTaxAndIns() {
		//creating object for loan payment adjustments
		requestTotPreItem = { 'principalRate': this.state.principalRate, 'realEstateTaxesRes': this.state.realEstateTaxesRes, 'homeOwnerInsuranceRes': this.state.homeOwnerInsuranceRes, 'monthlyRate': this.state.monthlyRate, 'paymentAmount1': this.state.paymentAmount1, 'pnintrate': this.state.pnintrate, 'paymentAmount2': this.state.paymentAmount2 };

		//   console.log("requestTotPreItem " + JSON.stringify(requestTotPreItem));

		//calling method to calculate the adjustments
		responseTotPreItem = getRefTotalMonthlyPayment(requestTotPreItem);
		/* if(this.state.monthlyExpensesOther1 != "Other"){
			responseTotPreItem.totalMonthlyPayment = (parseFloat(this.state.paymentAmount1) + parseFloat(responseTotPreItem.totalMonthlyPayment)).toFixed(2)
		}
		if(this.state.monthlyExpensesOther2 != "Other"){
			responseTotPreItem.totalMonthlyPayment = (parseFloat(this.state.paymentAmount2) + parseFloat(responseTotPreItem.totalMonthlyPayment)).toFixed(2)
		} */

		//Alert.alert('Alert!', JSON.stringify(requestTotPreItem)); 


		//	console.log("responseTotPreItem " + JSON.stringify(responseTotPreItem));

		this.setState({ totalMonthlyPayment: responseTotPreItem.totalMonthlyPayment }, this.changeMonInsPrice);
	}

	//Total Investment
	calTotalInvestment() {
		if (this.state.tab == "VA") {
			loan_amt = this.state.adjusted_loan_amt;
		} else {
			loan_amt = this.state.loan_amt;
		}

		if (this.state.tab == 'FHA') {
			allTotal = parseFloat(this.state.prepaidMonthTaxes) + parseFloat(this.state.monthInsuranceRes) + parseFloat(this.state.daysInterest) + parseFloat(this.state.totalClosingCost) + parseFloat(this.state.existingTotal);

			//	console.log("all total " + allTotal);

			payPartOfMIP = parseFloat(this.state.adjusted_loan_amt) - parseFloat(allTotal);

			//	console.log("payPartOfMIP " + payPartOfMIP);

			if (payPartOfMIP > 0) {

				totalInvestment = parseFloat(payPartOfMIP) - parseFloat(this.state.FhaMipFin1);
				totalInvestment = parseFloat(totalInvestment).toFixed(2);
				console.log("total investment cash to borrower if " + totalInvestment);

				this.setState({ totalInvestment: totalInvestment });


				//	 console.log("payPartOfMIP " + payPartOfMIP);


			} else {

				totalInvestment = parseFloat(payPartOfMIP) - parseFloat(this.state.FhaMipFin3);

				console.log("total investment cash to borrower " + totalInvestment);

				this.setState({ totalInvestment: totalInvestment });
			}


			this.setState({ animating: 'false' });
		} else {
			//creating object for loan payment adjustments
			if (this.state.totalPrepaidItems == '' || this.state.totalPrepaidItems === undefined) {
				requestTotPreItem = { 'amount': loan_amt, 'totalClosingCost': this.state.totalClosingCost, 'totalPrepaidItems': 0, existingTotal: this.state.existingTotal };
			} else {
				requestTotPreItem = { 'amount': loan_amt, 'totalClosingCost': this.state.totalClosingCost, 'totalPrepaidItems': this.state.totalPrepaidItems, existingTotal: this.state.existingTotal };
			}
			//Alert.alert('Alert!', JSON.stringify(this.state.prepaidMonthTaxes + "prepaidMonthTaxes" + this.state.monthInsuranceRes + "monthInsuranceRes" + this.state.daysInterest + "daysInterest" + financialVal + "financialVal" )); 
			//calling method to calculate the adjustments		
			//	console.log("requestTotPreItem params for total inves " + JSON.stringify(requestTotPreItem));
			responseTotPreItem = getRefTotalInvestment(requestTotPreItem);
			//	console.log("responseTotPreItem params for total inves " + JSON.stringify(responseTotPreItem));
			if (isNaN(responseTotPreItem.totalInvestment)) {
				this.setState({ totalInvestment: '0.00' });
			} else {
				this.setState({ totalInvestment: responseTotPreItem.totalInvestment });
			}

			console.log("total investment cash to borrower 2 " + this.state.totalInvestment);


			if (this.state.totalInvestment > 0) {
				this.setState({
					cashBorrowerText: 'Cash To Borrower'
				});
			} else {
				this.setState({
					cashBorrowerText: 'Cash From Borrower'
				});
			}

			this.setState({ animating: 'false' });
		}

		this.state.textMsgPdfArray = {
			"userId"                 		: this.state.user_id,
			"companyId"             	 	: this.state.company_id,
			"caltype"                		: "refinance",
			"Prepared_For"            		: this.state.lendername,
			"address"                		: this.state.lender_address,
			"city"                   		: this.state.city,
			"state"                  		: this.state.state_name,
			"zip"                    		: this.state.postal_code,
			"buyerLoanType"          		: this.state.tab,
			"closingCost"      		        : this.state.totalClosingCost,
			"salesPrice"             		: this.state.sale_pr,
			"estClosingDate"   		        : this.state.date,
			"estimatedTaxProration" 		: this.state.estimatedTaxProrations,
			"amount"                 		: this.state.loan_amt,
			"conventionalAmount"     		: this.state.loan_amt2,
			"interestRate1"                	: this.state.todaysInterestRate,
			"interestRate2"                	: this.state.todaysInterestRate1,
			"termInYears1"                 	: this.state.termsOfLoansinYears,
			"termInYears2"                 	: this.state.termsOfLoansinYears2,
			"loansToBePaidPayoff_1Balance" 	: this.state.loansToBePaid_1Balance,
			"loansToBePaidPayoff_2Balance"	: this.state.loansToBePaid_2Balance,
			"loansToBePaidPayoff_1Rate"		: this.state.loansToBePaid_1Rate,
			"loansToBePaidPayoff_2Rate"		: this.state.loansToBePaid_2Rate,
			"totalPrepaidItems"				: this.state.totalPrepaidItems,
			"totalMonthlyPayment"			: this.state.totalMonthlyPayment,
			"borrowerlbl"					: this.state.cashBorrowerText,
			"totalInvestment"				: responseTotPreItem.totalInvestment
		}
	}

	changeMortgageInsVal() {
		if (this.state.tab == "VA") {
			loan_amt = this.state.adjusted_loan_amt;
		} else if (this.state.tab == "FHA") {
			loan_amt = this.state.sale_pr_calc;
		} else {
			loan_amt = this.state.loan_amt;
		}
		//creating object for amount and rate value
		requestMMI = { 'amount': loan_amt, 'rateValue': this.state.rateValue };

		//calling method to calculate the FHa MIP Finance for prepaid
		responseMMI = getRefMonthlyRateMMI(requestMMI);

		monthlyRate = responseMMI.monthlyRateMMI;
		monthPmiVal = responseMMI.monthPmiVal;
		this.setState({ monthlyRate: monthlyRate, monthPmiVal: monthPmiVal }, this.calTotalPrepaidItems);
	}

	callSalesPr() {
		this.onChangeRate(this.state.sale_pr_calc, "sale_pr");
	}

	saveBuyerCalculatorDetailsApi() {
		refinanceData = {
			'company_id': this.state.company_id,
			'user_id': this.state.user_id,
			'preparedBy': this.state.user_name,
			'preparedFor': this.state.lendername,
			'address': this.state.lender_address,
			'city': this.state.city,
			'state': this.state.state,
			'zip': this.state.postal_code,
			'lendername': this.state.lendername,
			'salePrice': this.state.sale_pr_calc,
			'buyerLoanType': this.state.tab,
			'conventionalLoanToValue_1Loan': this.state.ltv,
			'conventionalInterestRate_2Loan': this.state.todaysInterestRate1,
			'conventionalTermInYear_2Loan': this.state.termsOfLoansinYears2,
			'conventionalLoanToValue_2Loan': this.state.ltv2,
			'interestRate': this.state.todaysInterestRate,
			'termInYears': this.state.termsOfLoansinYears,
			'adjustable': 'N',
			'adjustable2': 'N',
			'interestRateCap': this.state.interestRateCap,
			'interestRateCap_2Loan': this.state.interestRateCap2,
			'perAdjustment': this.state.perAdjustment,
			'perAdjustment_2Loan': this.state.perAdjustment2,
			'amount': this.state.loan_amt,
			'conventionalAmount2': this.state.loan_amt2,
			'adjusted': this.state.adjusted_loan_amt,
			'downPayment': this.state.down_payment,
			'discount1': this.state.disc,
			'discount2': this.state.discAmt,
			'originationFee': this.state.originationFee,
			'processingFee': this.state.processingfee,
			'taxServiceContract': this.state.taxservicecontract,
			'documentPreparation': this.state.documentprep,
			'underwriting': this.state.underwriting,
			'appraisal': this.state.appraisalfee,
			'creditReport': this.state.creditReport,
			'costLabel_1Value': this.state.label1,
			'costType_1Value': this.state.type1,
			'costFee_1Value': this.state.fee1,
			'costTotalFee_1Value': this.state.fee1,
			'costLabel_2Value': this.state.label2,
			'costType_2Value': this.state.type2,
			'costFee_2Value': this.state.fee2,
			'costTotalFee_2Value': this.state.fee2,
			'costLabel_3Value': this.state.label3,
			'costType_3Value': this.state.type3,
			'costFee_3Value': this.state.fee3,
			'costTotalFee_3Value': this.state.fee3,
			'costLabel_4Value': this.state.label4,
			'costType_4Value': this.state.type4,
			'costFee_4Value': this.state.fee4,
			'costTotalFee_4Value': this.state.fee4,
			'costLabel_5Value': this.state.label5,
			'costType_5Value': this.state.type5,
			'costFee_5Value': this.state.fee5,
			'costTotalFee_5Value': this.state.fee5,
			'costLabel_6Value': this.state.label6,
			'costType_6Value': this.state.type6,
			'costFee_6Value': this.state.fee6,
			'costTotalFee_6Value': this.state.fee6,
			'costLabel_7Value': this.state.label7,
			'costType_7Value': this.state.type7,
			'costFee_7Value': this.state.fee7,
			'costTotalFee_7Value': this.state.fee7,
			'costLabel_8Value': this.state.label8,
			'costType_8Value': this.state.type8,
			'costFee_8Value': this.state.fee8,
			'costTotalFee_8Value': this.state.fee8,
			'costLabel_9Value': this.state.label9,
			'costType_9Value': this.state.type9,
			'costFee_9Value': this.state.fee9,
			'costTotalFee_9Value': this.state.fee9,
			'costLabel_10Value': this.state.label10,
			'costType_10Value': this.state.type10,
			'costFee_10Value': this.state.fee10,
			'costTotalFee_10Value': this.state.fee10,
			"costLabel_11Value": "Other",
			"costType_11Value": "Flat Fee",
			"costFee_11Value": this.state.fee11,
			"costTotalFee_11Value": this.state.fee11,

			'totalClosingCost': this.state.totalClosingCost,
			'prepaidMonthTaxes1': this.state.monTaxVal,
			'prepaidMonthTaxes2': this.state.monTax,
			'prepaidMonthTaxes3': this.state.prepaidMonthTaxes,
			'prepaidMonthInsurance1': this.state.numberOfMonthsInsurancePrepaid,
			'prepaidMonthInsurance2': this.state.monIns,
			'prepaidMonthInsurance3': this.state.monthInsuranceRes,
			'daysInterest1': this.state.numberOfDaysPerMonth,
			'daysInterest2': this.state.daysInterest,
			'payorSelectorEscrow': this.state.escrowType,
			'escrowOrSettlement': this.state.escrowFee,
			'payorSelectorOwners': this.state.ownersType,
			'ownersTitlePolicy': this.state.ownerFee,
			'payorSelectorLenders': this.state.lenderType,
			'lendersTitlePolicy': this.state.lenderFee,
			'escrowFeeHiddenValue': this.state.escrowFeeOrg,
			'lendersFeeHiddenValue': this.state.lenderFeeOrg,
			'ownersFeeHiddenValue': this.state.ownerFeeOrg,
			'principalAndInterest': this.state.principalRate,
			'realEstateTaxes': this.state.realEstateTaxesRes,
			'homeownerInsurance': this.state.homeOwnerInsuranceRes,
			'paymentRate': this.state.rateValue,
			'paymentMonthlyPmi': this.state.monthlyRate,
			'twoMonthsPmi': this.state.monthPmiVal,
			'prepaidCost': this.state.twoMonthsPmi1,
			'prepaidAmount': this.state.costOther,
			'totalPrepaidItems': this.state.totalPrepaidItems,
			'paymentMonthlyExpense1': this.state.monthlyExpensesOther1,
			'paymentAmount1': this.state.paymentAmount1,
			'paymentMonthlyExpense2': this.state.monthlyExpensesOther2,
			'paymentAmount2': this.state.paymentAmount2,
			'totalMonthlyPayement': this.state.totalMonthlyPayment,
			'estimatedTaxProrations': this.state.estimatedTaxProrations,
			'totalInvestment': this.state.totalInvestment,
			'countyId': this.state.county,
			'stateId': this.state.state,
			'noPmi': this.state.nullVal,
			'financeMip': this.state.nullVal,
			'financeFundingFee': this.state.nullVal,
			'showApr': this.state.nullVal,
			'mipFinanced': this.state.nullVal,
			'fundingFeeFinanced1': this.state.nullVal,
			'fundingFeeFinanced2': this.state.nullVal,
			'estimatedClosingMonth': this.state.nullVal,
			'annualPropertyTax': this.state.nullVal,
			'summerPropertyTax': this.state.nullVal,
			'winterPropertyTax': this.state.nullVal,
			'titleInsuranceType': 'N',
			'titleInsuranceShortRate': this.state.nullVal,
			'newLoanServiceFee': this.state.nullVal,
			'fhaMip': this.state.nullVal,
			'fundingFee': this.state.nullVal,
			'pl2ndTD': this.state.nullVal,
			'minimumCashIvestment': this.state.nullVal,
			'mipFinancedHiddenValue': this.state.nullVal,
			'RoundDownMIP': this.state.nullVal,
			'countyTransferTax': this.state.nullVal,
			'cityTransferTax': this.state.nullVal,
			'reissueYearDD': this.state.nullVal,
			'lowerTitlePolicy': this.state.nullVal,
			"lessthanLTV": "0.00",
			"yearDiscount": "0.00",
			"nationalData": "0.00",
			"actualannualtax": this.state.act_annual_tax,
			"actualannualins": this.state.act_annual_ins,
			"priorLiabilityAmt": "0.00",
			"prepaymentPenalty": this.state.prepaymentpenaltyfee,

			"loansToBePaidPayoff_1Balance": this.state.loansToBePaid_1Balance,
			"loansToBePaidPayoff_1Rate": this.state.loansToBePaid_1Rate,
			"loansToBePaidPayoff_2Balance": this.state.loansToBePaid_2Balance,
			"loansToBePaidPayoff_2Rate": this.state.loansToBePaid_2Rate,
			"loansToBePaidPayoff_3Balance": this.state.loansToBePaid_3Balance,
			"loansToBePaidPayoff_3Rate": this.state.loansToBePaid_3Rate,
			"days": this.state.numberOfDaysPerMonth,
			"allLoans": '0.00',
			"loansToBePaidPayoff_Total": this.state.existingTotal,
		};
		if (this.state.calculatorId != "" && this.state.calculatorId != "undefined") {
			refinanceData.calculator_id = this.state.calculatorId;
			// alert box added by lovedeep on 04-30-2018
			Alert.alert('CostsFirst', 'A Saved File already exits with the same file name, do you want to:', [{ text: 'Cancel', onPress: () => console.log('Cancel Pressed!') }, { text: 'Save As', onPress: this.onSaveAsNew.bind(this, refinanceData) }, { text: 'Overwrite', onPress: this.onOverwriteAsExisting.bind(this, refinanceData) }]);

		} else {
			var temp = JSON.stringify(refinanceData);
			temp = temp.replace(/\"\"/g, "\"0.00\"");
			refinanceData = JSON.parse(temp);
			// check added by lovedeep on 04-30-2018
			if (refinanceData.address == '0.00') {
				refinanceData.address = '';
			}
			callPostApi(GLOBAL.BASE_URL + GLOBAL.save_refinance_calculator, refinanceData, this.state.access_token).then((response) => {
				if (result.status == 'success') {
					if (this.state.calculatorId != '') {
						this.dropdown.alertWithType('success', 'Success', result.message);
					} else {
						this.dropdown.alertWithType('success', 'Success', result.message);
					}
				}
			});
		}
	}

	// function added by lovedeep on 04-30-2018 for user to save existing calc as new 
	onSaveAsNew(refinancedt) {
		// as per discussion with atul sir .. passing calc id empty
		delete refinancedt.calculator_id;
		var temp = JSON.stringify(refinancedt);
		temp = temp.replace(/\"\"/g, "\"0.00\"");
		refinanceData = JSON.parse(temp);
		// check added by lovedeep on 04-30-2018
		if (refinanceData.address == '0.00') {
			refinanceData.address = '';
		}
		callPostApi(GLOBAL.BASE_URL + GLOBAL.save_refinance_calculator, refinanceData, this.state.access_token).then((response) => {
			if (result.status == 'success') {
				if (this.state.calculatorId != '') {
					this.dropdown.alertWithType('success', 'Success', result.message);
				} else {
					this.dropdown.alertWithType('success', 'Success', result.message);
				}
			}
		});
	}

	// function added by lovedeep on 04-30-2018 for user to over existing calc
	onOverwriteAsExisting(refinancedt) {
		var temp = JSON.stringify(refinancedt);
		temp = temp.replace(/\"\"/g, "\"0.00\"");
		refinanceData = JSON.parse(temp);
		// check added by lovedeep on 04-30-2018
		if (refinanceData.address == '0.00') {
			refinanceData.address = '';
		}
		callPostApi(GLOBAL.BASE_URL + GLOBAL.save_refinance_calculator, refinanceData, this.state.access_token).then((response) => {
			if (result.status == 'success') {
				if (this.state.calculatorId != '') {
					this.dropdown.alertWithType('success', 'Success', result.message);
				} else {
					this.dropdown.alertWithType('success', 'Success', result.message);
				}
			}
		});
	}



	onPressMailingAddress() {
		this.setState({
			enterAddressBar: true
		});
	}

	onPressConfirmDeleteCalculator(id) {

		Alert.alert('CostsFirst', 'Are you sure you want to delete this file?', [{ text: 'NO', onPress: () => console.log('Cancel Pressed!') }, { text: 'YES', onPress: this.onPressDeleteCalculator.bind(this, id) }]);
	}

	onPressDeleteCalculator(id) {

		//console.log("calculator id " + id);
		this.setState({ animating: 'true', loadingText: 'Please wait..' });
		callPostApi(GLOBAL.BASE_URL + GLOBAL.Delete_Refinance_Calculator, {
			id: id
		}, this.state.access_token)
			.then((response) => {

				//console.log("response for delete after onpress " + JSON.stringify(result));

				if (result.status == 'success') {
					this.setState({ animating: 'false' });
					Alert.alert('CostsFirst', result.message);
					this.getBuyerCalculatorListApi();
					//this.dropdown.alertWithType('success', 'Success', result.message);
				} else if (result.status == 'fail') {
					this.setState({ animating: 'false' });
					Alert.alert('CostsFirst', result.message);
					//this.dropdown.alertWithType('error', 'Error', result.message);
				} else {
					this.setState({ animating: 'false' });
					Alert.alert('CostsFirst', 'Error occured, please try again later.');
					//this.dropdown.alertWithType('error', 'Error', result.message);
				}
			});
	}

	// get list of calculators
	getBuyerCalculatorListApi() {
		callPostApi(GLOBAL.BASE_URL + GLOBAL.Get_Refinance_Calculator, {
			userId: this.state.user_id, type: "Refinance"
		}, this.state.access_token)
			.then((response) => {


				console.log("result of list api " + JSON.stringify(result));

				if (result.status == 'success' && result.data != "") {
					calculatorList = result.data;
					calculatorList = calculatorList.sort(function (a, b) {
						return b.calculatorId - a.calculatorId
					})
					result.data = calculatorList;
					//Alert.alert('Alert!', JSON.stringify(result));
					var ds = new ListView.DataSource({
						rowHasChanged: (r1, r2) => r1 !== r2
					});
					this.setState({ dataSourceOrg: ds.cloneWithRows(result.data), dataSource: ds.cloneWithRows(result.data), arrayholder: result.data, emptCheck: false });
				} else {
					this.setState({ emptCheck: true });
				}
			});
	}

	SearchFilterFunction(text) {
		if (text != '') {
			const newData = this.state.arrayholder.filter(function (item) {
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
		} else {
			this.setState({
				dataSource: this.state.dataSourceOrg,
				emptCheck: false,
			})
		}
	}

	editCalculator(id) {
		callPostApi(GLOBAL.BASE_URL + GLOBAL.detail_refinance_calculator, {
			calculatorId: id
		}, this.state.access_token)
			.then((response) => {
				if (result.data.buyerLoanType == "Conventional") {
					tab = 'CONV';
				} else {
					tab = result.data.buyerLoanType;
				}
				//this.setState(result.data);
				this.setState({
					sale_pr: result.data.salePrice, sale_pr_calc: result.data.salePrice, lender_address: result.data.address, postal_code: result.data.zip, tab: tab, ltv: result.data.conventionalLoanToValue_1Loan, todaysInterestRate1: result.data.conventionalInterestRate_2Loan, termsOfLoansinYears2: result.data.conventionalTermInYear_2Loan, ltv2: result.data.conventionalLoanToValue_2Loan, todaysInterestRate: result.data.interestRate, termsOfLoansinYears: result.data.termInYears, interestRateCap2: result.data.interestRateCap_2Loan, perAdjustment2: result.data.perAdjustment_2Loan, loan_amt: result.data.amount, loan_amt2: result.data.conventionalAmount2, adjusted_loan_amt: result.data.adjusted, down_payment: result.data.downPayment, disc: result.data.discount1, discAmt: result.data.discount2, taxservicecontract: result.data.taxServiceContract, documentprep: result.data.documentPreparation, appraisalfee: result.data.appraisal, label1: result.data.costLabel_1Value, costType_1Value: result.data.type1, fee1: result.data.costFee_1Value, label2: result.data.costLabel_2Value, type2: result.data.costType_2Value, fee2: result.data.costFee_2Value, label3: result.data.costLabel_3Value, type3: result.data.costType_3Value, fee3: result.data.costFee_3Value, label4: result.data.costLabel_4Value, type4: result.data.costType_4Value, fee4: result.data.costFee_4Value, label5: result.data.costLabel_5Value, type5: result.data.costType_5Value, fee5: result.data.costFee_5Value, label6: result.data.costLabel_6Value, type6: result.data.costType_6Value, fee6: result.data.costFee_6Value, label7: result.data.costLabel_7Value, type7: result.data.costType_7Value, fee7: result.data.costFee_7Value, label8: result.data.costLabel_8Value, type8: result.data.costType_8Value, fee8: result.data.costFee_8Value, label9: result.data.costLabel_9Value, type9: result.data.costType_9Value, fee9: result.data.costFee_9Value, label10: result.data.costLabel_10Value, type10: result.data.costType_10Value, fee10: result.data.costFee_10Value, label11: result.data.costLabel_11Value, type11: result.data.costType_11Value, fee11: result.data.costFee_11Value, monTaxVal: result.data.prepaidMonthTaxes1, monTax: result.data.prepaidMonthTaxes2, monTaxOrg: result.data.prepaidMonthTaxes2, prepaidMonthTaxes: result.data.prepaidMonthTaxes3, prepaidMonthTaxesOrg: result.data.prepaidMonthTaxes3, numberOfMonthsInsurancePrepaid: result.data.prepaidMonthInsurance1, monIns: result.data.prepaidMonthInsurance2, monInsOrg: result.data.prepaidMonthInsurance2, monthInsuranceRes: result.data.prepaidMonthInsurance3, monthInsuranceResOrg: result.data.prepaidMonthInsurance3, numberOfDaysPerMonth: result.data.daysInterest1, daysInterest: result.data.daysInterest2, escrowType: result.data.payorSelectorEscrow, escrowFee: result.data.escrowOrSettlement, ownersType: result.data.payorSelectorOwners, ownerFee: result.data.ownersTitlePolicy, lenderType: result.data.payorSelectorLenders, lenderFee: result.data.lendersTitlePolicy, escrowFeeOrg: result.data.escrowFeeHiddenValue, lenderFeeOrg: result.data.lendersFeeHiddenValue, ownerFeeOrg: result.data.ownersFeeHiddenValue, principalRate: result.data.principalAndInterest, realEstateTaxesRes: result.data.realEstateTaxes, homeOwnerInsuranceRes: result.data.homeownerInsurance, realEstateTaxesResOrg: result.data.realEstateTaxes, homeOwnerInsuranceResOrg: result.data.homeownerInsurance, rateValue: result.data.paymentRate, monthlyRate: result.data.paymentMonthlyPmi, twoMonthsPmi: result.data.monthPmiVal, twoMonthsPmi1: result.data.prepaidCost, costOther: result.data.prepaidAmount, monthlyExpensesOther1: result.data.paymentMonthlyExpense1, monthlyExpensesOther2: result.data.paymentMonthlyExpense2, totalMonthlyPayment: result.data.totalMonthlyPayement, county: result.data.countyId, state: result.data.stateId, titleInsuranceShortRate: result.data.titleInsuranceShortRate, lessthanLTV: result.data.lessthanLTV, yearDiscount: result.data.yearDiscount, nationalData: result.data.nationalData, act_annual_tax: result.data.actualannualtax, act_annual_ins: result.data.actualannualins, priorLiabilityAmt: result.data.priorLiabilityAmt, prepaymentpenaltyfee: result.data.prepaymentPenalty, loansToBePaid_1Balance: result.data.loansToBePaidPayoff_1Balance, loansToBePaid_1Rate: result.data.
						loansToBePaidPayoff_1Rate, loansToBePaid_2Balance: result.data.loansToBePaidPayoff_2Balance, loansToBePaidPayoff_2Rate: result.data.loansToBePaid_2Rate, loansToBePaidPayoff_3Balance: result.data.loansToBePaid_3Balance, loansToBePaid_3Rate: result.data.loansToBePaidPayoff_3Rate, processingfee: result.data.processingFee, allLoans: result.data.allLoans, existingTotal: result.data.loansToBePaidPayoff_Total, calculatorId: id
				});
				//Alert.alert('Alert!', JSON.stringify(result))
				this.setModalVisible(!this.state.modalVisible);
			});
	}

	onClose(data) {
		if (data.type == 'success' && data.message == 'Email sent successfully') {
			console.log("verify email " + this.state.verified_email);
			if (this.state.verified_email != 'null' && this.state.verified_email != "" && this.state.verified_email != null) {
				this.popupDialogAddEmailAddress.show();
			} else {
				Alert.alert('CostsFirst', 'Do you want to share pdf to social sites?', [{ text: 'NO', onPress: () => console.log('Cancel Pressed!') }, { text: 'YES', onPress: this.onCallSocialSigninFunc.bind(this) }]);
			}
		} else if (data.type == 'success' && data.message == 'Contact has been added successfully.') {
			Alert.alert('CostsFirst', 'Do you want to share pdf to social sites?', [{ text: 'NO', onPress: () => console.log('Cancel Pressed!') }, { text: 'YES', onPress: this.onCallSocialSigninFunc.bind(this) }]);
		}
	}

	onCallSocialSigninFunc() {
		this.props.navigator.push({ name: 'GoogleSigninExample', index: 0 });
	}

	onSaveNewContactAddress() {

		if (this.state.newEmailAddress == '') {
			this.setState({ newEmailAddressError: STRINGS.t('email_error_message') });
		} else if (this.state.newEmailAddress.length < 2 || this.state.newEmailAddress.length > 100) {
			this.refs.newEmailAddress.setNativeProps({ text: '' });
			this.setState({ newEmailAddressError: STRINGS.t('email_char_error_message') });

		} else {
			this.setState({ newEmailAddressError: '' });
		}
		if (this.state.newEmailAddress != '') {
			if (!validateEmail(this.state.newEmailAddress)) {
				this.refs.newEmailAddress.setNativeProps({ text: '' });
				this.setState({ newEmailAddressError: STRINGS.t('validation_email_error_message') });
			} else {
				this.setState({ newEmailAddressError: '' });
			}
		}
		if (this.state.newEmailAddress != '' && validateEmail(this.state.newEmailAddress)) {
			callPostApi(GLOBAL.BASE_URL + GLOBAL.Save_contact_addressBook, {
				"user_id": this.state.user_id,
				"username": this.state.newEmailContactName,
				"email": this.state.newEmailAddress,
				"phone": this.state.contact_number
			}, this.state.access_token)
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

	// listing of address book
	renderAddrsRow(rowData) {
		return (
			<View style={BuyerStyle.scrollable_container_child_center}>
				<View style={{ width: '100%', justifyContent: 'center' }}>
					<TouchableOpacity>
						<CheckBox checkedColor='#CECECE' checked={this.state[rowData.email].isAddrsChecked} onPress={() => this.handlePressAddressCheckedBox(rowData.email)} title={rowData.email} />

					</TouchableOpacity>
				</View>
			</View>
		);
	}

	// listing of calculators
	renderRow(rowData) {
		if (rowData != 'calculatorName') {
			if (rowData.address.length > 25) {
				var strshortened = rowData.address.substring(0, 25);
				rowData.address = strshortened + '..';
			}
		}
		return (
			<View style={BuyerStyle.scrollable_container_child_center}>
				<View style={BuyerStyle.savecalcvalue}>
					<TouchableOpacity onPress={() => this.editCalculator(rowData.calculatorId)}>
						<Text style={BuyerStyle.text_style}>
							{rowData.calculatorName}{"\n"}$ {rowData.price}
						</Text>
					</TouchableOpacity>
				</View>
				<View style={BuyerStyle.savecalcvalueSecondCol}>
					<TouchableOpacity onPress={() => this.editCalculator(rowData.calculatorId)}>
						<Text style={[BuyerStyle.alignCenterCalcList, { alignSelf: 'flex-start' }]}>
							{rowData.address}{"\n"}{rowData.createdDate}
						</Text>
					</TouchableOpacity>
				</View>
				<TouchableOpacity style={BuyerStyle.savecalcvaluesmall} onPress={() => this.onPressConfirmDeleteCalculator(rowData.id)}>
					<Image source={Images.recycle} />
				</TouchableOpacity>
			</View>
		);
	}

	/**=========== Start Function Added By Lovedeep For Ohio Check Box below escrow field Case (Ohio) =========**/

	handlePressCheckedBoxForOhio = (checked) => {
		if (this.state.isCheckForOhio == false) {
			if (this.state.reissueSalePrice == '0.00' || this.state.reissueSalePrice == '') {
				this.dropdown.alertWithType('error', 'Error', 'Prior Liability Amount must be entered');
			}
			this.setState({
				isCheckForOhio: !this.state.isCheckForOhio,
				reissueYearDropdownVal: 1,
				reissueSalePriceEditableStatus: false,
			}, this.callBuyerConvSettingApi);


		} else {
			this.setState({
				isCheckForOhio: !this.state.isCheckForOhio,
				reissueYearDropdownVal: 0,
				reissueSalePrice: '0.00',
				reissueSalePriceEditableStatus: true,
			}, this.callBuyerConvSettingApi);
		}
	}

	/**=========== End Function Added By Lovedeep For Ohio Check Box below escrow field Case (Ohio) =========**/


	// function to show modal from breadcrumb menu's
	onActionSelected(position) {
		if (this.state.dropValues == "OPEN") {
			this.setModalVisible(true);
			this.setState({
				dropValues: ""
			});
		} else if (this.state.dropValues == "SAVE") {
			this.saveBuyerCalculatorDetailsApi();
			this.setState({
				dropValues: ""
			});
		} else if (this.state.dropValues == "PRINT") {
			this.setState({ popupType: "print" }, this.popupShow);
			this.setState({
				dropValues: ""
			});

		} else if (this.state.dropValues == "MESSAGE") {
			if (this.state.sale_pr_calc == "" || this.state.sale_pr_calc == '0.00') {
				this.dropdown.alertWithType('error', 'Error', 'Please enter sales price.');
			} else {
				this.setState({
					openMessagePopup: true
				});
			}

		} else if (this.state.dropValues == "EMAIL") {
			if (this.state.sale_pr_calc == "" || this.state.sale_pr_calc == '0.00') {
				this.dropdown.alertWithType('error', 'Error', 'Please enter sales price.');
			} else {
				this.setState({ popupType: "email" }, this.popupShow);
			}
			this.setState({
				dropValues: ""
			});

		} else if (position == "msg_tab") {
			ImagePicker.openPicker({
				width: 300,
				height: 400,
				cropping: true
			}).then(image => {
				this.popupDialog.dismiss();
				this.popupDialogEmail.dismiss();
				imagepath = image.path;
				imagename = imagepath.substring(imagepath.lastIndexOf('/') + 1);
				this.setState({ imageData: image }, this.imageSuccess);

				let formData = new FormData();
				formData.append("image", {
					name: imagename,
					uri: imagepath,
					type: image.mime
				});
				formData.append("userId", this.state.user_id);

				fetch(GLOBAL.BASE_URL + GLOBAL.Upload_Image_Email, {
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
							imageNameEmail: response.data
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
				//this.setState({imageData: image});
			});
			//this.setState({popupType: "msg_tab"},this.popupShow);
		} else if (position == "msg_tab_cam") {
			ImagePicker.openCamera({
				width: 300,
				height: 400,
				cropping: true
			}).then(image => {
				this.popupDialog.dismiss();
				this.popupDialogEmail.dismiss();
				imagepath = image.path;
				imagename = imagepath.substring(imagepath.lastIndexOf('/') + 1);
				this.setState({ imageData: image }, this.imageSuccess);

				let formData = new FormData();
				formData.append("image", {
					name: imagename,
					uri: imagepath,
					type: image.mime
				});

				formData.append("userId", this.state.user_id);

				fetch(GLOBAL.BASE_URL + GLOBAL.Upload_Image_Email, {
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
							imageNameEmail: response.data
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
				//this.setState({imageData: image});
			});
		}
	}
	openpopup(type) {
		this.setState({ popupAttachmentType: type }, this.popupShowEmail);
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
		if (param == 'dont_save') {
			this.onCallSocialSigninFunc();
		}
	}

	popupShowEmail() {
		this.popupDialogEmail.show();
	}

	popupHideEmail() {
		this.popupDialogEmail.dismiss();
	}

	confirmlogout(position) {

	}

	imageSuccess() {
		//this.dropdown.alertWithType('success', 'Success', 'Image attached successfully!');
		//this.dropdown.alertWithType('success', 'Success', 'Image attached successfully!');		
	}

	printPDF(type) {


		if (type == 'cdtc') {
			date = this.state.date;
			var split = date.split('-');
			date = Number(split[0]) + '/' + Number(split[1]) + '/' + Number(split[2]);
			requestType = {
				"actionType": "download",
				"date": date,
				"loanPurpose": "Purchase"
			}

			callPostApi(GLOBAL.BASE_URL + GLOBAL.refinance_cdtc_pdf, requestType, this.state.access_token)
				.then((response) => {
					if (result.status == 'success') {


						console.log("cdtc resp " + JSON.stringify(result));

						this.popupHide();
						OpenFile.openDoc([{
							url: GLOBAL.BASE_URL + result.data,
							fileName: "sample",
							fileType: "pdf",
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

			if (this.state.sale_pr > 0) {
				date = this.state.date;
				var split = date.split('-');
				date = Number(split[0]) + '/' + Number(split[1]) + '/' + Number(split[2]);
				requestType = {
					"quote": this.state.escrowQuote,
					"ownersfee": this.state.ownerFee,
					"lendersfee": this.state.lenderFee,
					"stateId": this.state.state,
					"actionType": "download"
				}

				callPostApi(GLOBAL.BASE_URL + GLOBAL.refinance_trid_pdf, requestType, this.state.access_token)
					.then((response) => {
						if (result.status == 'success') {
							//	console.log("trid resp " + JSON.stringify(result));
							this.popupHide();
							OpenFile.openDoc([{
								url: GLOBAL.BASE_URL + result.data,
								fileName: "sample",
								fileType: "pdf",
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

		} else {

			pdfURL = GLOBAL.refinance_detail_pdf + '/' + this.state.languageType;
			buyerData = this.getData();


			date = this.state.date;
			var split = date.split('-');
			date = Number(split[0]) + '/' + Number(split[1]) + '/' + Number(split[2]);
			buyerData = this.getData();
			buyerData.actionType = 'download';
			buyerData.estStlmtDate = date;

			callPostApi(GLOBAL.BASE_URL + pdfURL, buyerData, this.state.access_token)
				.then((response) => {
					this.popupHide();
					OpenFile.openDoc([{
						url: GLOBAL.BASE_URL + result.data,
						fileName: "sample",
						fileType: "pdf",
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

	printQuickDetailPDF(type) {
		if (this.state.CDTC_TRID_Status == true) {
			this.printPDF(type);
		} else {
			if (this.state.CDTC_Status == false && this.state.TRID_Status == true) {
				Alert.alert('CostsFirst', 'Include CDTC data?', [{ text: 'NO', onPress: this.onCallFuncSetPrintPDF.bind(this, 'CDTC_Status', false, type) }, { text: 'YES', onPress: this.onCallFuncSetPrintPDF.bind(this, 'CDTC_Status', true, type) }]);
			} else if (this.state.TRID_Status == false && this.state.CDTC_Status == true) {
				Alert.alert('CostsFirst', 'Include TRID data?', [{ text: 'NO', onPress: this.onCallFuncSetPrintPDF.bind(this, 'TRID_Status', false, type) }, { text: 'YES', onPress: this.onCallFuncSetPrintPDF.bind(this, 'TRID_Status', true, type) }]);
			} else if (this.state.TRID_Status == false && this.state.CDTC_Status == false) {
				Alert.alert('CostsFirst', 'Include both TRID & CDTC data?', [{ text: 'NO', onPress: this.onCallFuncSetPrintPDF.bind(this, 'CDTC_TRID_Status', false, type) }, { text: 'YES', onPress: this.onCallFuncSetPrintPDF.bind(this, 'CDTC_TRID_Status', true, type) }]);
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

		if (type == "detailed") {
			pdfURL = GLOBAL.generate_pdf + '/' + this.state.languageType;
		} else if (type == "quick") {
			pdfURL = GLOBAL.generate_pdf_quick_buyer + '/' + this.state.languageType;
		}
		buyerData = this.getData();
		date = this.state.date;
		var split = date.split('-');
		date = Number(split[0]) + '/' + Number(split[1]) + '/' + Number(split[2]);
		buyerData = this.getData();
		buyerData.actionType = 'download';
		buyerData.estStlmtDate = date;
		buyerData.cdtcSetting = this.state.CDTC_Status;
		buyerData.tridSetting = this.state.TRID_Status;
		buyerData.bothCdtcTridSetting = this.state.CDTC_TRID_Status;
		buyerData.quote = this.state.escrowQuote;
		buyerData.ownersfee = this.state.ownerFee;
		buyerData.lendersfee = this.state.lenderFee;

		console.log("date issue " + JSON.stringify(buyerData));

		callPostApi(GLOBAL.BASE_URL + pdfURL, buyerData, this.state.access_token)
			.then((response) => {
				if (result.status == 'success') {
					this.popupHide();
					OpenFile.openDoc([{
						url: GLOBAL.BASE_URL + result.data,
						fileName: "sample",
						fileType: "pdf",
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

	// image capture
	takePicture = () => {
		const options = {};
		//options.location = ...
		this.camera.capture({ metadata: options })
			.then((data) => console.log(data))
			.catch(err => console.error(err));
	}

	// start video recording
	startRecording = () => {
		if (this.camera) {
			this.camera.capture({ mode: Camera.constants.CaptureMode.video })
				.then((data) => {
					this.setState({
						videoData: data
					})

					let formData = new FormData();
					formData.append("video", {
						name: 'name.mp4',
						uri: this.state.videoData.path,
						type: 'video/mp4'
					});

					formData.append("userId", this.state.user_id);

					fetch(GLOBAL.BASE_URL + GLOBAL.Upload_Video_Email_Mobile, {
						method: 'POST',
						headers: {
							'Content-Type': 'multipart/form-data'
						},
						body: formData
					})
						.then((response) => response.json())
						.then(response => {
							this.setState({ animating: 'false' });
							Alert.alert('', 'Video uploaded successfully!');
							this.popupDialog.dismiss();
							this.popupDialogEmail.dismiss();
							//	response {"message":"Video Uploaded","status":"success","data":"1523438561.mp4"}
							console.log("response " + JSON.stringify(response));

							this.setState({
								videoNameEmail: response.data
							});
							//{"message":"Video Uploaded","status":"success","data":"1523433546.mp4"}
							//alert(JSON.stringify(response));
							//console.log("image uploaded")
						}).catch(err => {
							this.setState({ animating: 'false' });
							Alert.alert('', 'Error occured, please try again later.');
							console.log("err " + JSON.stringify(err));
							//alert(JSON.stringify(err));
							//console.log('error message')
						})
				})
				.catch(err => {
					this.setState({ animating: 'false' });
					console.error(err);
				});

			this.setState({
				isRecording: true
			});
		}
	}

	// stop video recording
	stopRecording = () => {
		if (this.camera) {
			this.camera.stopCapture();
			this.setState({
				isRecording: false
			});
			Alert.alert('CostsFirst', 'Do you want to attach this video.', [{ text: 'Cancel', onPress: () => console.log('Cancel Pressed!') }, { text: 'OK', onPress: this.hideVideoModals.bind(this) }]);
		}
	}

	hideVideoModals() {
		this.setState({
			loadingText: 'Please wait..'
		});
		this.popupHide();
		this.hideVideoModal();
		this.setState({ animating: 'true' });
	}

	hideVideoModal() {
		this.setVideoModalVisible(!this.state.videoModalVisible);
	}

	// switch camera type
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

	// Function for getting address book list
	callUserAddressBook() {
		callPostApi(GLOBAL.BASE_URL + GLOBAL.user_address_book, {
			"user_id": this.state.user_id

		}, this.state.access_token)
			.then((response) => {
				var ds = new ListView.DataSource({
					rowHasChanged: (r1, r2) => r1 !== r2
				});
				var i = 1;
				//Alert.alert('Alert!', JSON.stringify(result.data.userSettingCost))
				// For setting last fields of closing costs page
				list = this.state.emailAddrsList;
				for (let resObj of result.data) {
					list.push(resObj.email);
					i++;
				}
				this.setState({ emailAddrsList: list });
				//this.setState({addrsSource: ds.cloneWithRows(result.data)});
			});
	}

	// Send email from breadcrumb menu
	sendEmail() {

		if (this.state.to_email == "") {
			Alert.alert('', 'Please enter email address.');
			//this.dropdown.alertWithType('error', 'Error', 'Please enter email address');
		} else {
			var str_array = this.state.to_email.split(',');
			console.log("email length " + JSON.stringify(str_array.length));
			for (var i = 0; i < str_array.length; i++) {
				// Trim the excess whitespace.

				console.log(i);
				str_array[i] = str_array[i].trim();
				if (!validateEmail(str_array[i])) {
					//this.dropdown.alertWithType('error', 'Error', 'Please enter valid email address');
					console.log('in not valid email address');

					this.state.invalidEmailStatus = true;
				}
				if (i == str_array.length - 1) {
					this.callSendEmailFunc();
				}
			}
		}
	}

	callSendEmailFunc() {
		console.log("flag " + this.state.invalidEmailStatus);
		if (this.state.invalidEmailStatus == true) {
			this.setState({
				invalidEmailStatus: false
			});
			Alert.alert('', 'Please enter valid email addresses with comma separated!');
			//this.dropdown.alertWithType('error', 'Error', 'Please enter valid email addresses with comma separated!');
		} else {
			if (this.state.dropdownType == "trid") {
				this.setState({ animating: 'true', loadingText: 'Please wait...' });

				refiTridData = {
					'quote': this.state.escrowQuote,
					'user_id': this.state.user_id,
					'actionType': 'email',
					'subject': this.state.email_subject,
					'note': this.state.content,
					'email': this.state.to_email,
				}

				//console.log("trid recor " + JSON.stringify(buyerTridData));
				callPostApi(GLOBAL.BASE_URL + GLOBAL.refinance_trid_pdf, refiTridData, this.state.access_token)
					.then((response) => {

						//alert(JSON.stringify(result));

						//console.log("trid response " + JSON.stringify(result));
						if (result.status == 'success') {
							this.setState({
								to_email: ""
							});
							this.state.verified_email = result.email;
							this.setState({
								newEmailAddress: result.email
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
							this.setState({ animating: 'false', loadingText: 'Calculating', dropdownType: "" });
						} else if (result.status == 'fail') {
							this.setState({ animating: 'false', loadingText: 'Calculating', dropdownType: "" });
							this.dropdown.alertWithType('error', 'Error', result.message);
						} else {
							this.setState({ animating: 'false', loadingText: 'Calculating', dropdownType: "" });
							//Alert.alert('', 'Error occured, please try again later.');
							this.dropdown.alertWithType('error', 'Error', result.message);
						}
					});
			} else if (this.state.dropdownType == "cdtc") {
				this.setState({ animating: 'true', loadingText: 'Please wait...' });

				date = this.state.date;
				var split = date.split('-');
				date = Number(split[0]) + '/' + Number(split[1]) + '/' + Number(split[2]);

				refiCdtcData = {
					'loanPurpose': 'Purchase',
					'date': date,
					'user_id': this.state.user_id,
					'actionType': 'email',
					'subject': this.state.email_subject,
					'note': this.state.content,
					'email': this.state.to_email,
				}
				//console.log("loan comariopn recor " + JSON.stringify(buyerCdtcData));

				callPostApi(GLOBAL.BASE_URL + GLOBAL.refinance_cdtc_pdf, refiCdtcData, this.state.access_token)
					.then((response) => {
						//console.log("cdtc response " + JSON.stringify(result));
						if (result.status == 'success') {
							this.setState({
								to_email: ""
							});
							this.state.verified_email = result.email;
							this.setState({
								newEmailAddress: result.email
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
							this.setState({ animating: 'false', loadingText: 'Calculating', dropdownType: "" });
						} else if (result.status == 'fail') {
							this.setState({ animating: 'false', loadingText: 'Calculating', dropdownType: "" });
							this.dropdown.alertWithType('error', 'Error', result.message);
						} else {
							this.setState({ animating: 'false', loadingText: 'Calculating', dropdownType: "" });
							this.dropdown.alertWithType('error', 'Error', result.message);
						}
					});
			} else {
				buyerData = this.getData();
				buyerData.email = this.state.to_email;
				date = this.state.date;
				var split = date.split('-');
				date = Number(split[0]) + '/' + Number(split[1]) + '/' + Number(split[2]);
				buyerData.image = this.state.imageNameEmail;
				buyerData.video = this.state.videoNameEmail;
				buyerData.subject = this.state.email_subject;
				buyerData.note = this.state.content;
				buyerData.estStlmtDate = date;
				buyerData.actionType = 'email';
				buyerData.cdtcSetting = this.state.CDTC_Status;
				buyerData.tridSetting = this.state.TRID_Status;
				buyerData.bothCdtcTridSetting = this.state.CDTC_TRID_Status;
				buyerData.quote = this.state.escrowQuote;
				//console.log("date issue " + JSON.stringify(buyerData));


				//	console.log("buyerData rec " + JSON.stringify(buyerData));

				//	buyerData.image_name = this.state.imageData;
				callPostApi(GLOBAL.BASE_URL + GLOBAL.refinance_detail_pdf, buyerData, this.state.access_token)
					.then((response) => {

						//console.log("response in succes " + JSON.stringify(result));

						//alert(JSON.stringify(result));
						this.setState({
							to_email: ""
						});
						this.state.verified_email = result.email;
						this.setState({
							newEmailAddress: result.email
						});

						AsyncStorage.setItem("pdfFileName", result.data);
						AsyncStorage.setItem("calculator", "refinance");
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

	// get form data for manupulation 
	getData() {
		buyerData = {
			'company_id': this.state.company_id,
			'user_id': this.state.user_id,
			'preparedBy': this.state.user_name,
			'preparedFor': this.state.lendername,
			'address': this.state.lender_address,
			'city': this.state.city,
			'state': this.state.user_state,
			'zip': this.state.postal_code,
			'lendername': this.state.lendername,
			'salePrice': this.state.sale_pr_calc,
			'buyerLoanType': this.state.tab,
			'conventionalLoanToValue_1Loan': this.state.ltv,
			'conventionalInterestRate_2Loan': this.state.todaysInterestRate1,
			'conventionalTermInYear_2Loan': this.state.termsOfLoansinYears2,
			'conventionalLoanToValue_2Loan': this.state.ltv2,
			'interestRate': this.state.todaysInterestRate,
			'termInYears': this.state.termsOfLoansinYears,
			'adjustable': 'N',
			'adjustable2': 'N',
			'interestRateCap': this.state.interestRateCap,
			'interestRateCap_2Loan': this.state.interestRateCap2,
			'perAdjustment': this.state.perAdjustment,
			'perAdjustment_2Loan': this.state.perAdjustment2,
			'amount': this.state.loan_amt,
			'conventionalAmount2': this.state.loan_amt2,
			'adjusted': this.state.adjusted_loan_amt,
			'downPayment': this.state.down_payment,
			'discount1': this.state.disc,
			'discount2': this.state.discAmt,
			'originationFee': this.state.originationFee,
			'processingFee': this.state.processingfee,
			'taxServiceContract': this.state.taxservicecontract,
			'documentPreparation': this.state.documentprep,
			'underwriting': this.state.underwriting,
			'appraisal': this.state.appraisalfee,
			'creditReport': this.state.creditReport,
			'costLabel_1Value': this.state.label1,
			'costType_1Value': this.state.type1,
			'costFee_1Value': this.state.fee1,
			'costTotalFee_1Value': this.state.fee1,
			'costLabel_2Value': this.state.label2,
			'costType_2Value': this.state.type2,
			'costFee_2Value': this.state.fee2,
			'costTotalFee_2Value': this.state.fee2,
			'costLabel_3Value': this.state.label3,
			'costType_3Value': this.state.type3,
			'costFee_3Value': this.state.fee3,
			'costTotalFee_3Value': this.state.fee3,
			'costLabel_4Value': this.state.label4,
			'costType_4Value': this.state.type4,
			'costFee_4Value': this.state.fee4,
			'costTotalFee_4Value': this.state.fee4,
			'costLabel_5Value': this.state.label5,
			'costType_5Value': this.state.type5,
			'costFee_5Value': this.state.fee5,
			'costTotalFee_5Value': this.state.fee5,
			'costLabel_6Value': this.state.label6,
			'costType_6Value': this.state.type6,
			'costFee_6Value': this.state.fee6,
			'costTotalFee_6Value': this.state.fee6,
			'costLabel_7Value': this.state.label7,
			'costType_7Value': this.state.type7,
			'costFee_7Value': this.state.fee7,
			'costTotalFee_7Value': this.state.fee7,
			'costLabel_8Value': this.state.label8,
			'costType_8Value': this.state.type8,
			'costFee_8Value': this.state.fee8,
			'costTotalFee_8Value': this.state.fee8,
			'costLabel_9Value': this.state.label9,
			'costType_9Value': this.state.type9,
			'costFee_9Value': this.state.fee9,
			'costTotalFee_9Value': this.state.fee9,
			'costLabel_10Value': this.state.label10,
			'costType_10Value': this.state.type10,
			'costFee_10Value': this.state.fee10,
			'costTotalFee_10Value': this.state.fee10,
			"costLabel_11Value": "Other",
			"costType_11Value": "Flat Fee",
			"costFee_11Value": this.state.fee11,
			"costTotalFee_11Value": this.state.fee11,

			'totalClosingCost': this.state.totalClosingCost,
			'prepaidMonthTaxes1': this.state.monTaxVal,
			'prepaidMonthTaxes2': this.state.monTax,
			'prepaidMonthTaxes3': this.state.prepaidMonthTaxes,
			'prepaidMonthInsurance1': this.state.numberOfMonthsInsurancePrepaid,
			'prepaidMonthInsurance2': this.state.monIns,
			'prepaidMonthInsurance3': this.state.monthInsuranceRes,
			'daysInterest1': this.state.numberOfDaysPerMonth,
			'daysInterest2': this.state.daysInterest,
			'payorSelectorEscrow': this.state.escrowType,
			'escrowOrSettlement': this.state.escrowFee,
			'payorSelectorOwners': this.state.ownersType,
			'ownersTitlePolicy': this.state.ownerFee,
			'payorSelectorLenders': this.state.lenderType,
			'lendersTitlePolicy': this.state.lenderFee,
			'escrowFeeHiddenValue': this.state.escrowFeeOrg,
			'lendersFeeHiddenValue': this.state.lenderFeeOrg,
			'ownersFeeHiddenValue': this.state.ownerFeeOrg,
			'principalAndInterest': this.state.principalRate,
			'realEstateTaxes': this.state.realEstateTaxesRes,
			'homeownerInsurance': this.state.homeOwnerInsuranceRes,
			'paymentRate': this.state.rateValue,
			'paymentMonthlyPmi': this.state.monthlyRate,
			'twoMonthsPmi': this.state.monthPmiVal,
			'prepaidCost': this.state.twoMonthsPmi1,
			'prepaidAmount': this.state.costOther,
			'totalPrepaidItems': this.state.totalPrepaidItems,
			'paymentMonthlyExpense1': this.state.monthlyExpensesOther1,
			'paymentAmount1': this.state.paymentAmount1,
			'paymentMonthlyExpense2': this.state.monthlyExpensesOther2,
			'paymentAmount2': this.state.paymentAmount2,
			'totalMonthlyPayement': this.state.totalMonthlyPayment,
			'estimatedTaxProrations': this.state.estimatedTaxProrations,
			'totalInvestment': this.state.totalInvestment,
			'countyId': this.state.county,
			'stateId': this.state.state,
			'noPmi': this.state.nullVal,
			'financeMip': this.state.nullVal,
			'financeFundingFee': this.state.nullVal,
			'showApr': this.state.nullVal,
			'mipFinanced': this.state.nullVal,
			'fundingFeeFinanced1': this.state.nullVal,
			'fundingFeeFinanced2': this.state.nullVal,
			'estimatedClosingMonth': this.state.nullVal,
			'annualPropertyTax': this.state.nullVal,
			'summerPropertyTax': this.state.nullVal,
			'winterPropertyTax': this.state.nullVal,
			'titleInsuranceType': 'N',
			'titleInsuranceShortRate': this.state.nullVal,
			'newLoanServiceFee': this.state.nullVal,
			'fhaMip': this.state.nullVal,
			'fundingFee': this.state.nullVal,
			'pl2ndTD': this.state.nullVal,
			'minimumCashIvestment': this.state.nullVal,
			'mipFinancedHiddenValue': this.state.nullVal,
			'RoundDownMIP': this.state.nullVal,
			'countyTransferTax': this.state.nullVal,
			'cityTransferTax': this.state.nullVal,
			'reissueYearDD': this.state.nullVal,
			'lowerTitlePolicy': this.state.nullVal,
			"lessthanLTV": "0.00",
			"yearDiscount": "0.00",
			"nationalData": "0.00",
			"actualannualtax": this.state.act_annual_tax,
			"actualannualins": this.state.act_annual_ins,
			"priorLiabilityAmt": "0.00",
			"prepaymentPenalty": this.state.prepaymentpenaltyfee,

			"loansToBePaidPayoff_1Balance": this.state.loansToBePaid_1Balance,
			"loansToBePaidPayoff_1Rate": this.state.loansToBePaid_1Rate,
			"loansToBePaidPayoff_2Balance": this.state.loansToBePaid_2Balance,
			"loansToBePaidPayoff_2Rate": this.state.loansToBePaid_2Rate,
			"loansToBePaidPayoff_3Balance": this.state.loansToBePaid_3Balance,
			"loansToBePaidPayoff_3Rate": this.state.loansToBePaid_3Rate,
			"days": this.state.numberOfDaysPerMonth,
			"allLoans": '0.00',
			"loansToBePaidPayoff_Total": this.state.existingTotal,
		};

		return buyerData;
	}


	// this is for updating empty fields to 0.00 on blur
	/*updateFormField (fieldVal, fieldName, functionCall) {
		fieldVal = this.removeCommas(fieldVal);
		if(fieldVal == ''){

			if(fieldName == 'sale_pr') {
				this.setState({
					[fieldName]: "",
				});
			} else {
				this.setState({
					[fieldName]: '0.00',
				});
			}

		}else if(this.state.defaultVal != fieldVal) {
			if(fieldVal=='' || fieldVal==0) {

				if(fieldName == 'sale_pr') {
					processedData = '';
				} else {
					processedData = '0.00';
				} 
			} else {
				if(fieldName == 'numberOfDaysPerMonthBuyer' || fieldName == 'termsOfLoansinYears' || fieldName == 'monTaxVal' || fieldName == 'numberOfMonthsInsurancePrepaid' || fieldName == 'numberOfDaysPerMonth')  {
					processedData = fieldVal;
				} else if (fieldName == 'todaysInterestRate' || fieldName == 'todaysInterestRate1') {
					processedData = parseFloat(fieldVal).toFixed(4);
				} else {
					processedData = parseFloat(fieldVal).toFixed(2);
				}
			}
			this.setState({
				[fieldName]: processedData,
			},functionCall)
		}	
	}*/

	// this is for updating empty fields to 0.00 on blur
	updateFormField(fieldVal, fieldName, functionCall) {
		if (this.state.count == 1) {
			console.log("coming in if part for second time");
			fieldVal = this.removeCommas(fieldVal);
			if (fieldVal == '') {
				if (fieldName == 'sale_pr') {
					this.setState({
						[fieldName]: "",
					});
				} else if (fieldName == 'monTaxVal' || fieldName == 'numberOfMonthsInsurancePrepaid') {
					this.setState({
						[fieldName]: "0",
					});
				} else {
					this.setState({
						[fieldName]: '0.00',
					}, functionCall);
				}
			} else if (fieldVal != '') {
				if (fieldVal == '') {
					if (fieldName == 'sale_pr') {
						processedData = '';
					} else if (fieldName == 'monTaxVal' || fieldName == 'numberOfMonthsInsurancePrepaid') {
						this.setState({
							[fieldName]: "0",
						});
					}
					else {
						processedData = '0.00';
					}
				} else {
					if (fieldName == 'todaysInterestRate1' ||
						fieldName == 'todaysInterestRate') {
						processedData = parseFloat(fieldVal).toFixed(4);
					} else {
						processedData = parseFloat(fieldVal).toFixed(2);
					}
				}
				processedData = processedData.toLocaleString('en');
				if (processedData == "" || processedData == "undefined" || processedData == "0.00" || processedData == undefined) {
					this.setState({
						[fieldName]: '0.00',
					}, functionCall)
				} else {
					this.setState({
						[fieldName]: processedData,
					}, functionCall)
				}
			}
			this.state.count = 0;
		} else {
			console.log("coming in else part for first time");
			this.setState({
				[fieldName]: '0.00',
			});
			this.state.count++;
		}
	}

	removeCommas(aNum) {
		if (typeof aNum == 'undefined') {
		}
		aNum = aNum.replace(/,/g, "");
		if (typeof aNum == 'undefined') {
		}

		aNum = aNum.replace(/\s/g, "");
		if (typeof aNum == 'undefined') {
		}

		return aNum;
	}

	updateReconveyncFee() {
		callPostApi(GLOBAL.BASE_URL + GLOBAL.Refinance_Cost_Setting, {
			user_id: this.state.user_id, company_id: this.state.company_id, zip: this.state.postal_code
		}, this.state.access_token)
			.then((response) => {
				if ((this.state.tab == 'CONV' || this.state.tab == 'FHA') && (this.state.loan_amt != "")) {
					amt = this.state.loan_amt;
				} else if (this.state.tab == 'CASH') {
					amt = '0.00';
				} else {
					amt = this.state.adjusted_loan_amt;
				}
				var i = 1;
				const costRequest = {};
				// For setting last fields of closing costs page
				for (let resObj of result.data.closingCostSetting) {
					const update = {};
					req = { 'amount': amt, 'salePrice': this.state.sale_pr_calc, 'type': resObj.type, 'rate': resObj.fee };

					var data = getRefCostTypeTotal(req);
					console.log("response params 3 " + JSON.stringify(data));
					feeval = data.totalCostRate;
					update['label' + i] = resObj.label;
					update['fee' + i] = feeval;
					update['type' + i] = resObj.type;
					update['totalfee' + i] = resObj.fee;
					costRequest['cost' + i] = resObj.fee;

					if (this.state.state_code == 'OR' && i == 8) {
						reefee = parseFloat(feeval);
						if (this.state.loansToBePaid_2Balance > 0) {
							//update['label' + i] = resObj.label;
							reefee = reefee + 150;
						}
						if (this.state.loansToBePaid_3Balance > 0) {
							//update['label' + i] = resObj.label;
							reefee = reefee + 150;
						}
						reefee = parseFloat(reefee).toFixed(2);
						update['fee' + i] = reefee;
						console.log("reefee 1 " + reefee);
						update['type' + i] = 'Flat Fee';
						update['totalfee' + i] = reefee;
					}

					this.setState(update);
					i++;
				}
				let costResponse = getRefTotalCostRate(costRequest);
				totalCost = costResponse.totalCostRate;
				this.setState({
					city: zipRes.data.city,
					state: zipRes.data.state_id,
					state_name: zipRes.data.state_name,
					user_state: zipRes.data.state_code,
					user_county: zipRes.data.county_name,
					county: zipRes.data.county_id,
					company_id_new_zip: zipRes.data.company_id
				});

				console.log("totalcost 4 " + totalCost);
			});

	}

	// this is for updating empty fields to 0.00 on blur
	updatePostalCode(fieldVal, fieldName) {
		this.setState({ animating: 'true' });
		processedData = fieldVal;

		callPostApi(GLOBAL.BASE_URL + GLOBAL.get_city_state_for_zip, {
			"zip": processedData

		}, this.state.access_token)
			.then((response) => {
				zipRes = result;
				if (zipRes.data.state_name != null || zipRes.data.state_name != 'NULL') {
					callPostApi(GLOBAL.BASE_URL + GLOBAL.Refinance_Cost_Setting, {
						user_id: this.state.user_id, company_id: this.state.company_id, zip: this.state.postal_code
					}, this.state.access_token)
						.then((response) => {
							if ((this.state.tab == 'CONV' || this.state.tab == 'FHA') && (this.state.loan_amt != "")) {
								amt = this.state.loan_amt;
							} else if (this.state.tab == 'CASH') {
								amt = '0.00';
							} else {
								amt = this.state.adjusted_loan_amt;
							}
							var i = 1;
							const costRequest = {};
							// For setting last fields of closing costs page
							for (let resObj of result.data.closingCostSetting) {
								const update = {};
								req = { 'amount': amt, 'salePrice': this.state.sale_pr_calc, 'type': resObj.type, 'rate': resObj.fee };

								var data = getRefCostTypeTotal(req);
								console.log("response params 3 " + JSON.stringify(data));
								feeval = data.totalCostRate;
								update['label' + i] = resObj.label;
								update['fee' + i] = feeval;
								update['type' + i] = resObj.type;
								update['totalfee' + i] = resObj.fee;
								costRequest['cost' + i] = resObj.fee;
								if (this.state.state_code == 'OR' && i == 8) {
									reefee = parseFloat(feeval);
									if (this.state.loansToBePaid_2Balance > 0) {
										//update['label' + i] = resObj.label;
										reefee = reefee + 150;
									}
									if (this.state.loansToBePaid_3Balance > 0) {
										//update['label' + i] = resObj.label;
										reefee = reefee + 150;
									}
									reefee = parseFloat(reefee).toFixed(2);
									update['fee' + i] = reefee;
									console.log("reefee 1 " + reefee);
									update['type' + i] = 'Flat Fee';
									update['totalfee' + i] = reefee;
								}
								this.setState(update);
								i++;
							}
							let costResponse = getRefTotalCostRate(costRequest);
							totalCost = costResponse.totalCostRate;
							this.setState({
								totalCost: totalCost, [fieldName]: processedData,
								city: zipRes.data.city,
								state: zipRes.data.state_id,
								state_name: zipRes.data.state_name,
								user_state: zipRes.data.state_code,
								user_county: zipRes.data.county_name,
								county: zipRes.data.county_id,
								company_id_new_zip: zipRes.data.company_id
							}, this.callSalesPr);

							console.log("totalcost 4 " + totalCost);
						});
				}
			});
	}

	callExisitngFieldsCalculations() {
		var days = String(this.state.date).split('-');
		days = parseInt(days[1]);
		if (days != '') {
			this.setState({
				settlementDate: days
			});
		}
		let request = {
			'existing_bal1': this.state.loansToBePaid_1Balance,
			'existing_rate1': this.state.loansToBePaid_1Rate,
			'existing_bal2': this.state.loansToBePaid_2Balance,
			'existing_rate2': this.state.loansToBePaid_2Rate,
			'existing_bal3': this.state.loansToBePaid_3Balance,
			'existing_rate3': this.state.loansToBePaid_3Rate,
			'days': this.state.numberOfDaysPerMonthBuyer
		}
		response = getRefExistingBalanceCalculation(request);

		if (this.state.state_code == 'TX') {
			this.setState({ daysInterestRef: response.daysInterest, existingTotal: response.existingTotal }, this.callEscrowApiOnExistingFirstChangeForTx);
		} else {
			this.setState({ daysInterestRef: response.daysInterest, existingTotal: response.existingTotal }, this.calTotalInvestment);
		}

		// Check added by lovedeep as per discussion with vinod sir for making changes in reconveyncefee value when load to be paid values are changed.
		if (this.state.state_code == 'OR') {
			this.updateReconveyncFee();
		}



		// calTotalInvestment function append by lovedeep

	}

	/**===================== Start New function works only for Texas state ============================**/

	callEscrowApiOnExistingFirstChangeForTx() {



		var secondLoanStatus;
		if (this.state.ltv2 != "" && this.state.ltv2 != "0.00") {
			secondLoanStatus = 1;
		} else {
			secondLoanStatus = 0;
		}

		//alert("state " + this.state.state + "user_county " + this.state.user_county + "county " + this.state.county);
		date = this.state.date;
		var split = date.split('-');
		date = Number(split[0]) + '/' + Number(split[1]) + '/' + Number(split[2]);


		/**=========================== Special case for Texas State ======================================**/

		if (this.state.state_code == 'TX') {
			this.setState({
				payoff: this.state.loansToBePaid_1Balance
			});
		} else {
			this.setState({
				payoff: 0
			});
		}

		console.log("payoff " + this.state.payoff);

		/**=========================== Special case for Texas State ======================================**/

		callPostApi(GLOBAL.BASE_URL + GLOBAL.refinance_escrow_xml_data, {
			"city": this.state.city, "county_name": this.state.user_county, "salePrice": this.state.sale_pr, "adjusted": loan_amt, "state": this.state.state, "county": this.state.county, zip: this.state.postal_code, "estStlmtDate": date, 'userId': this.state.user_id, 'device': this.state.deviceName, "2ndloan": secondLoanStatus, "reissueyr": 0, "payoff": this.state.payoff
		}, this.state.access_token)
			.then((response) => {

				//alert(JSON.stringify(result));

				console.log("escrow rcrd refinance callEscrowApiOnExistingFirstChangeForTx " + JSON.stringify(result));

				/**==== Start Special Case for Minnesota added by lovedeep ====== **/

				if (this.state.state_code == 'MN') {
					this.state.fee4 = result.data.Mortgage_Registration_Tax;
					this.state.fee7 = result.data.Underwriting;
				}

				/**==== End Special Case for Minnesota added by lovedeep ====== **/


				escrowTotal = (parseFloat(result.data.escrowFee) + parseFloat(result.data.titleIns)).toFixed(2);


				/*if(this.state.state_code == 'TX'){

					console.log("discountYearSelectedDropdownVal " + JSON.stringify(this.state.discountYearSelectedDropdownVal));

					discount = this.state.discountYearSelectedDropdownVal.value;
			
						request = {'payoffval': result.data.payoffval,'titleInsOrg': result.data.titleIns,'discount': discount};
						
						//calling method to calculate the adjustments
						response = getDiscountYearChng(request);
						this.setState({
							titleInsuranceShortRate : response.titleIns
						});
				}*/




				console.log("payoffval " + result.data.payoffval);

				this.setState({
					titleInsOrg: result.data.titleIns,
					payoffval: result.data.payoffval,
					escrowFee: result.data.escrowFee,
					escrowQuote: result.data.Quote,
					escrowPolicyType: result.data.escrowPolicyType,
					titleInsuranceShortRate: result.data.titleIns,
					titleInsName: result.data.titleInsName,
					escrowTotal: escrowTotal
				}, this.calTotalInvestment);

				console.log("titleInsuranceShortRate 5 " + result.data.titleIns);

			});
	}

	/**===================== End New function works only for Texas state ============================**/

	onSelectionsChange = (selectedAddresses) => {
		var i = 1;
		to_email = "";
		for (let resObj of selectedAddresses) {
			if (i == 1) {
				to_email = resObj.value;
			} else {
				to_email = to_email + ", " + resObj.value;
			}
			i++;
		}
		// if else check added by lovedeep on 01-05-2018	
		if (this.state.to_email_default != "") {
			this.setState({ to_email: this.state.to_email_default + ", " + to_email });
		} else {
			this.setState({ to_email: to_email });
		}
		this.setState({ selectedAddresses })
	}
	state = { selectedAddresses: [] }

	// this is for updating empty fields to 0.00 on blur
	onFocus(fieldName, viewHeight) {

		if ((fieldName == 'lendername' || fieldName == 'sale_pr') && this.state.speakToTextVal && !this.state.TextInput) {
			if (this.state.speakToTextVal && !this.state.TextInput) {

				this.setState({
					speakToTextStatus: true
				});

				if (fieldName == 'lendername') {
					Alert.alert(
						'Speak Value',
						'Would you like to speak value',
						[
							{ text: 'Yes', onPress: () => this._startRecognizing(fieldName), style: 'cancel' },
							{ text: 'No', onPress: () => this.stopSpeakToText('lendername') }
						],
						{ cancelable: false }
					)
				} else {
					Alert.alert(
						'Speak Value',
						'Would you like to speak value',
						[
							{ text: 'Yes', onPress: () => this._startRecognizing(fieldName), style: 'cancel' },
							{ text: 'No', onPress: () => this.stopSpeakToText('sale_pr') }
						],
						{ cancelable: false }
					)
				}
			} else {
				this.setState({
					speakToTextStatus: false
				});
			}
		}

		this.refs.scrollView1.scrollTo({ y: viewHeight });

		/*if(this.state.count == 0) {
			Keyboard.dismiss();
			this.state.count++;
			if(this.state.isFocus == false) {
				this.setState({
					isFocus : true
				});
				install(findNodeHandle(this.refs[fieldName]), "hello");
				setTimeout(() => {
					this.refs[fieldName].input.focus();
				}, 1000);
			}
		} else {
			this.state.count = 0;
			this.state.isFocus = false;
		}*/

		if (fieldName == 'lender_address') {
			this.setState({
				enterAddressBar: true
			});

			//this.props.navigator.push({name: 'GooglePlaceAutoComplete', index: 0 });
		} else {
			fieldVal = this.state[fieldName];
			this.setState({
				defaultVal: fieldVal,
			})
			this.setState({
				enterAddressBar: false
			});
		}

		this.setState({
			[fieldName]: '',
		})
	}



	measureView(event, fieldname) {

		if (event.nativeEvent.layout.x != '0') {
			this.setState({ [fieldname]: event.nativeEvent.layout.x })
		} else {
			this.setState({ [fieldname]: event.nativeEvent.layout.y })
		}
	}

	_onMomentumScrollEnd() {
		Keyboard.dismiss();
	}

	render() {

		if (this.state.animating == 'true') {
			this.state.visble = true;
		} else {
			this.state.visble = false;
		}

		let recordButton;
		if (!this.state.isRecording) {
			recordButton = <TouchableOpacity style={{ width: '20%' }} onPress={() => { this.startRecording() }}><Image source={Images.play} style={BuyerStyle.camera_play_pause} /></TouchableOpacity>
		} else {
			recordButton = <TouchableOpacity style={{ width: '20%' }} onPress={() => { this.stopRecording() }}><Image source={Images.pause} style={BuyerStyle.camera_play_pause} /></TouchableOpacity>
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
		if (this.state.connectionInfo != 'none' && this.state.openMessagePopup == false) {
			showable = <View style={BuyerStyle.TopContainer}>
				<View style={BuyerStyle.iphonexHeader}></View>
				<Modal
					transparent={true}
					visible={this.state.voiceInput}
					onRequestClose={() => null}
				>
					<View style={dashboardStyle.PopupParent}>
						<View style={[dashboardStyle.BounceView]}>
							<View style={[dashboardStyle.PopupContainer]}>
								<Image style={dashboardStyle.imageStyle} source={Images.micIcon} />
								<Text>
									{this.state.speakTextStatus}
								</Text>
								<View style={dashboardStyle.BottomButtonContainer}>
									<TouchableOpacity style={dashboardStyle.ButtonBorder1} onPress={() => { this.setState({ voiceInput: false }) }}>
										<Text style={dashboardStyle.buttonText1}>Cancel</Text>
									</TouchableOpacity>
								</View>
							</View>
						</View>
					</View>
				</Modal>
				<View style={BuyerStyle.outerContainer}>
					<View style={{ flex: 1 }}>
						<Spinner visible={this.state.visble} textContent={this.state.loadingText} textStyle={{ color: '#FFF' }} />
					</View>
					<View style={BuyerStyle.HeaderContainer}>
						<Image style={BuyerStyle.HeaderBackground} source={Images.header_background}></Image>
						<TouchableOpacity style={{ width: '20%' }} onPress={this.onBackHomePress.bind(this)}>
							<Image style={BuyerStyle.back_icon} source={Images.back_icon} />
						</TouchableOpacity>
						<Text style={BuyerStyle.header_title}>{STRINGS.t('Refinance_Closing_Cost')}</Text>
						<View style={{ alignItems: 'flex-start', width: '20%', paddingRight: 20 }}>
							<Dropdown
								data={this.state.toolbarActions}
								renderBase={() => (
									<MaterialIcons
										name="more-vert"
										color="#fff"
										size={40}
										style={{ marginTop: 10, marginLeft: 15 }}
									/>
								)}
								onChangeText={(value) => this.setState({ dropValues: value })}
								onBlur={this.onActionSelected.bind(this)}
								rippleInsets={{ top: 0, bottom: 0, left: 0, right: 0 }}
								containerStyle={{ height: 60 }}
								dropdownPosition={1}
								itemColor="rgba(0, 0, 0, .87)"
								pickerStyle={{
									width: 128,
									height: 220,
									left: null,
									right: 0,
									marginRight: 8,
									marginTop: 70
								}}
							/>
						</View>
					</View>
					{renderIf(this.state.footer_tab == 'refinance')(
						<View style={{ height: '100%', width: '100%' }}>
							<View style={BuyerStyle.headerwrapper} >
								<View style={BuyerStyle.subHeaderNewDesign}>

									<View style={{ paddingRight: 10, paddingLeft: 10, paddingTop: 10, flexDirection: 'row' }}>
										<View style={{ width: '48%' }}>
											<TextInput selectTextOnFocus={true} onFocus={() => this.onFocus('lendername')} style={BuyerStyle.headerTextInputField} autoCapitalize='words' underlineColorAndroid='transparent' onChangeText={(value) => this.setState({ lendername: value })} value={this.state.lendername.toString()} />
										</View>
										<View style={{ width: '48%', marginLeft: '4%' }}>
											<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('sale_pr')} name={this.state.speakToTextStatus} keyboardType="numeric" underlineColorAndroid='transparent' ref="sale_pr" style={BuyerStyle.headerTextInputField} onChangeText={(value) => this.setState({ sale_pr: this.onChange(value) })} onEndEditing={(event) => this.updateFormField(event.nativeEvent.text, 'sale_pr', this.onChangeRate.bind(this, event.nativeEvent.text, "sale_pr"))}
												placeholder='Est Appraised Value'
												value={this.state.sale_pr == '0.00' ? this.state.sale_pr_empty : this.delimitNumbers(this.state.sale_pr)}
											/>
										</View>
									</View>
									<View style={[Styles.scrollable_container_child, { paddingRight: 10, paddingLeft: 10, paddingTop: 5 }]}>
										<GooglePlacesAutocomplete
											placeholder='Enter Address'
											minLength={2}
											autoFocus={false}
											listViewDisplayed='true'
											fetchDetails={true}
											styles={{
												predefinedPlacesDescription: {
													color: '#000000',
													marginTop: 0,
													height: 0,
													width: 0,
												},
												listView: {
													flex: 1,
													position: 'absolute',
													width: '100%',
													zIndex: 1,
													elevation: 15,
													backgroundColor: '#fff',
													top: '100%',
													maxHeight: '55%',
													borderWidth: 1,
													borderRadius: 4,
													borderColor: '#000',


												},
												textInput: {
													width: '100%',
													height: 30,
													borderWidth: 1,
													borderRadius: 4,
													backgroundColor: '#F5FCFF',
													padding: 0,
													paddingLeft: 3,
													borderColor: 'transparent',
													marginTop: 0,
													marginLeft: 0,
													marginRight: 0,
												},

												poweredContainer: {
													opacity: 0
												},

												textInputContainer: {
													borderWidth: 1,
													borderRadius: 4,
													borderColor: 'transparent',
													paddingLeft: 0,
													paddingRight: 0,
													marginTop: 0,
													height: 30
												}


											}}
											renderDescription={row => row.description || row.vicinity}
											onPress={(data, details = null) => {
												this.setState({
													lender_address: data.structured_formatting.main_text,
													default_address: data.description

												});
												for (var i = 0; i < details.address_components.length; i++) {
													var addressStr = '';
													if (details.address_components[i].types[0] == 'locality') {
														this.setState({
															city: details.address_components[i].long_name
														});
													} else if (details.address_components[i].types[0] == 'administrative_area_level_1') {
														this.setState({
															user_state: details.address_components[i].short_name
														});
													} else if (details.address_components[i].types[0] == 'postal_code') {
														if (details.address_components[i].long_name == "" || details.address_components[i].long_name == 'null' || details.address_components[i].long_name == 'undefined') {
															this.setState({
																postal_code: ''
															});
														} else {
															this.setState({
																postal_code: details.address_components[i].long_name
															});
														}
													}
												}

												this.setState({
													enterAddressBar: false
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
									<View style={{ flexDirection: 'row', paddingRight: 10, paddingLeft: 10, paddingTop: 5, zIndex: -1 }}>
										<View style={{ width: '48%' }}>
											<TextInput selectTextOnFocus={true} onFocus={() => this.onFocus('state_code')} style={BuyerStyle.headerTextInputField} placeholder='State' underlineColorAndroid='transparent' onChangeText={(value) => this.setState({ state_code: this.onChange(value) })} value={this.state.state_code} />
										</View>
										<View style={{ width: '48%', marginLeft: '4%' }}>
											<TextInput selectTextOnFocus={true} onFocus={() => this.onFocus('postal_code')} style={BuyerStyle.headerTextInputField} placeholder='Zip Code' underlineColorAndroid='transparent' onChangeText={(value) => this.setState({ postal_code: this.onChange(value) })} onEndEditing={(event) => this.updatePostalCode(event.nativeEvent.text, 'postal_code')} value={this.state.postal_code.toString()} />
										</View>
									</View>

									<View style={[BuyerStyle.segmentViewNewDesign, { paddingRight: 10, paddingLeft: 10 }]}>

										<View style={[BuyerStyle.segmentButtonBackgroundView, (this.state.tab == 'FHA') ? { backgroundColor: '#000000', width: '33.3%' } : { width: '33.3%' }]}>
											<TouchableOpacity style={BuyerStyle.segmentButtonNewDesign} onPress={() => this.settingsApi("FHA")}>
												<Text style={BuyerStyle.style_btnTextNewDesign}>{STRINGS.t('FHA')}</Text>
											</TouchableOpacity>
										</View>

										<View style={BuyerStyle.verticalLineForSegmentNewDesign}></View>

										<View style={[BuyerStyle.segmentButtonBackgroundView, (this.state.tab == 'VA') ? { backgroundColor: '#000000', width: '33.3%' } : { width: '33.3%' }]}>
											<TouchableOpacity style={BuyerStyle.segmentButtonNewDesign} onPress={() => this.settingsApi("VA")}>
												<Text style={BuyerStyle.style_btnTextNewDesign}>{STRINGS.t('VA')}</Text>
											</TouchableOpacity>
										</View>

										<View style={BuyerStyle.verticalLineForSegmentNewDesign}></View>


										<View style={[BuyerStyle.segmentButtonBackgroundView, (this.state.tab == 'CONV') ? { backgroundColor: '#000000', width: '33.3%' } : { width: '33.3%' }]}>
											<TouchableOpacity style={BuyerStyle.segmentButtonNewDesign} onPress={() => this.settingsApi("CONV")}>
												<Text style={BuyerStyle.style_btnTextNewDesign}>{STRINGS.t('Conv')}</Text>
											</TouchableOpacity>
										</View>
									</View>
									<View style={[BuyerStyle.segmentContainerNewDesign, { flexDirection: 'row', paddingRight: 10, paddingLeft: 10, marginTop: 5, zIndex: -1 }]}>
										<View style={[BuyerStyle.subHeaderNewDesignSubPart, { width: '100%', backgroundColor: '#000000', paddingTop: 5 }]}>
											<View style={{ flexDirection: 'row' }}>
												<View style={{ width: '50%' }}>
													<Text style={{ color: "#0598c9", fontSize: 14, fontWeight: 'bold' }}>{this.state.cashBorrowerText}</Text>
												</View>
												<View style={{ width: '50%' }}>
													<Text style={{ color: "#0598c9", fontSize: 14, fontWeight: 'bold' }}>
														{STRINGS.t('Total_Monthly_Payment')}
													</Text>
												</View>
											</View>

											<View style={{ flexDirection: 'row', marginTop: 5 }}>
												<View style={{ width: '48%' }}>
													<View style={{ flexDirection: 'row' }}>
														<Text style={{ color: "#0598c9", margin: 4, fontSize: 22, fontWeight: 'bold', }}>
															$
												</Text>
														{this.state.totalInvestment < 0 ?

															<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('totalInvestment')} keyboardType="numeric" style={[BuyerStyle.subHeaderTotalCalcTextInputField, { width: '90%', color: "#ff2525" }]} onChangeText={(value) => this.setState({ totalInvestment: this.onChange(value) })} value={this.delimitNumbers(this.state.totalInvestment)} underlineColorAndroid='transparent' />

															:

															<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('totalInvestment')} keyboardType="numeric" style={[BuyerStyle.subHeaderTotalCalcTextInputField, { width: '90%', color: "#0598c9" }]} onChangeText={(value) => this.setState({ totalInvestment: this.onChange(value) })} value={this.delimitNumbers(this.state.totalInvestment)} underlineColorAndroid='transparent' />

														}

													</View>
												</View>
												<View style={{ width: '48%', marginLeft: '2%' }}>
													<View style={{ flexDirection: 'row' }}>
														<Text style={{ color: "#0598c9", margin: 4, fontSize: 22, fontWeight: 'bold', }}>
															$
												</Text>
														<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('totalMonthlyPayment')} keyboardType="numeric" style={[BuyerStyle.subHeaderTotalCalcTextInputField, { width: '90%', color: "#0598c9" }]} onChangeText={(value) => this.setState({ totalMonthlyPayment: this.onChange(value) })} value={this.delimitNumbers(this.state.totalMonthlyPayment)} underlineColorAndroid='transparent' />
													</View>
												</View>
											</View>
										</View>

									</View>
								</View>


							</View>
							<View style={(this.state.initialOrientation == 'portrait') ? ((this.state.orientation == 'portrait') ? BuyerStyle.scrollviewheight : BuyerStyle.scrollviewheightlandscape) : ((this.state.orientation == 'landscape') ? BuyerStyle.scrollviewheight : BuyerStyle.scrollviewheightlandscape)}>
								<ScrollView
									showsVerticalScrollIndicator={true}
									keyboardShouldPersistTaps="always"
									//keyboardDismissMode='on-drag'
									style={BuyerStyle.sellerscrollview}
									ref="scrollView1"
									onTouchStart={this._onMomentumScrollEnd}
								>
									<View style={BuyerStyle.loandetailhead} onLayout={(event) => this.measureView(event, 'actAnnualTaxHeight')}>
										<View style={[BuyerStyle.loandetailhead, { paddingLeft: 10, paddingRight: 10 }]}>
											<View style={BuyerStyle.title_justify}>
												<Text style={BuyerStyle.text_style}>{STRINGS.t('Actual_Annual_Tax')}</Text>
											</View>
											<View style={{ width: '30%', justifyContent: 'center' }}>
												<View style={BuyerStyle.alignrightinput}>
													<Text style={BuyerStyle.alignCenter}>$ </Text>
													<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('act_annual_tax', this.state.actAnnualTaxHeight)} keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({ act_annual_tax: this.onChange(value) })} onEndEditing={(event) => this.updateFormField(event.nativeEvent.text, 'act_annual_tax', this.calMonTax.bind(this, event.nativeEvent.text, "act_annual_tax"))} value={this.state.act_annual_tax} />
												</View>
												<View style={[BuyerStyle.fullunderline,]}></View>
											</View>
										</View>
									</View>

									<View style={BuyerStyle.loandetailhead} onLayout={(event) => this.measureView(event, 'actAnnualInsHeight')}>
										<View style={[BuyerStyle.loandetailhead, { paddingLeft: 10, paddingRight: 10 }]}>
											<View style={BuyerStyle.title_justify}>
												<Text style={BuyerStyle.text_style}>{STRINGS.t('Actual_Annual_Ins')}</Text>
											</View>
											<View style={{ width: '30%', justifyContent: 'center' }}>
												<View style={BuyerStyle.alignrightinput}>
													<Text style={BuyerStyle.alignCenter}>$ </Text>
													<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('act_annual_ins', this.state.actAnnualInsHeight)} keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({ act_annual_ins: this.onChange(value) })} onEndEditing={(event) => this.updateFormField(event.nativeEvent.text, 'act_annual_ins', this.calMonIns.bind(this, event.nativeEvent.text, "act_annual_ins"))} value={this.delimitNumbers(this.state.act_annual_ins)} />
												</View>
												<View style={[BuyerStyle.fullunderline,]}></View>
											</View>
										</View>
									</View>


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
											{renderIf(this.state.tab != 'CONV')(
												<Text style={BuyerStyle.headerloanratiotext}>
												</Text>
											)}
										</View>
									</View>

									{renderIf(this.state.tab == 'CONV')(
										<View style={BuyerStyle.loandetailhead} onLayout={(event) => this.measureView(event, 'ltvHeight')}>
											<View style={BuyerStyle.existingfirst}>
												<Text style={BuyerStyle.existingheadtext}>{STRINGS.t('ltv')}</Text>
											</View>
											<View style={BuyerStyle.existingfirstbalance}>
												<View style={{ width: '100%', flexDirection: 'row' }}>
													<Text style={BuyerStyle.existingtext}>%</Text>
													<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('ltv', this.state.ltvHeight)} keyboardType="numeric" returnKeyType="next" style={[BuyerStyle.width70, { alignSelf: 'center' }]} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({ ltv: this.onChange(value) })} onEndEditing={(event) => this.updateFormField(event.nativeEvent.text, 'ltv', this.onChangeRate.bind(this, event.nativeEvent.text, "ltv"))} value={this.delimitNumbers(this.state.ltv)} />
												</View>
												<View style={BuyerStyle.textboxunderline}>
													<View style={[BuyerStyle.fullunderline,]}></View>
												</View>
											</View>
											<View style={BuyerStyle.existingfirstbalance}>
												<View style={{ width: '100%', flexDirection: 'row' }}>
													<Text style={BuyerStyle.existingtext}>%</Text>
													<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('ltv2', this.state.ltvHeight)}
														keyboardType="numeric"
														returnKeyType="next"
														style={[BuyerStyle.width70, { alignSelf: 'center' }]}
														underlineColorAndroid='transparent'
														onChangeText={(value) => this.setState({ ltv2: this.onChange(value) })} onEndEditing={(event) => this.updateFormField(event.nativeEvent.text, 'ltv2', this.onChangeRate.bind(this, event.nativeEvent.text, "ltv2"))}
														value={this.delimitNumbers(this.state.ltv2)}
													/>
												</View>
												<View style={BuyerStyle.textboxunderline}>
													<View style={[BuyerStyle.fullunderline,]}></View>
												</View>
											</View>
										</View>
									)}

									<View style={BuyerStyle.loandetailhead} onLayout={(event) => this.measureView(event, 'todaysInterestRateHeight')}>
										<View style={BuyerStyle.existingfirst}>
											<Text style={BuyerStyle.existingheadtext}>{STRINGS.t('rate')}</Text>
										</View>
										<View style={BuyerStyle.existingfirstbalance}>
											<View style={{ width: '100%', flexDirection: 'row' }}>
												<Text style={BuyerStyle.existingtext}>%</Text>
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('todaysInterestRate', this.state.todaysInterestRateHeight)}
													keyboardType="numeric"
													returnKeyType="next" style={[BuyerStyle.width70, { alignSelf: 'center' }]}
													underlineColorAndroid='transparent'
													onChangeText={(value) => this.setState({ todaysInterestRate: this.onChange(value) })} onEndEditing={(event) => this.updateFormField(event.nativeEvent.text, 'todaysInterestRate', this.callSalesPr)}
													value={this.delimitNumbers(this.state.todaysInterestRate)}
												/>
											</View>
											<View style={BuyerStyle.textboxunderline}>
												<View style={[BuyerStyle.fullunderline,]}></View>
											</View>
										</View>
										{renderIf(this.state.tab == 'CONV' && this.state.ltv2 > 0)(
											<View style={BuyerStyle.existingfirstbalance}>
												<View style={{ width: '100%', flexDirection: 'row' }}>
													<Text style={BuyerStyle.existingtext}>%</Text>
													<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('todaysInterestRate1', this.state.todaysInterestRateHeight)}
														keyboardType="numeric"
														editable={(this.state.ltv2 > 0) ? true : false}
														returnKeyType="next"
														style={[BuyerStyle.width70, { alignSelf: 'center' }]}
														underlineColorAndroid='transparent'
														onChangeText={(value) => this.setState({ todaysInterestRate1: this.onChange(value) })} onEndEditing={(event) => this.updateFormField(event.nativeEvent.text, 'todaysInterestRate1', this.callSalesPr)}
														value={this.delimitNumbers(this.state.todaysInterestRate1)}
													/>
												</View>
												<View style={BuyerStyle.textboxunderline}>
													<View style={[BuyerStyle.fullunderline,]}></View>
												</View>
											</View>
										)}
									</View>


									<View style={BuyerStyle.loandetailhead} onLayout={(event) => this.measureView(event, 'termsOfLoansinYearsHeight')}>
										<View style={BuyerStyle.existingfirst}>
											<Text style={BuyerStyle.existingheadtext}>{STRINGS.t('term')}</Text>
										</View>
										<View style={BuyerStyle.existingfirstbalance}>
											<View style={{ width: '100%', flexDirection: 'row' }}>
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('termsOfLoansinYears', this.state.termsOfLoansinYearsHeight)}
													keyboardType="numeric"
													returnKeyType="next" style={[BuyerStyle.width70, { alignSelf: 'center' }]}
													underlineColorAndroid='transparent'
													onChangeText={(value) => this.setState({ termsOfLoansinYears: this.onChange(value) })}
													onEndEditing={(event) => this.updateFormField(event.nativeEvent.text, 'termsOfLoansinYears', this.callSalesPr)}
													value={this.delimitNumbers(this.state.termsOfLoansinYears)}
												/>
											</View>
											<View style={BuyerStyle.textboxunderline}>
												<View style={[BuyerStyle.fullunderline,]}></View>
											</View>
										</View>
										{renderIf(this.state.tab == 'CONV' && this.state.ltv2 > 0)(
											<View style={BuyerStyle.existingfirstbalance}>
												<View style={{ width: '100%', flexDirection: 'row' }}>
													<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('termsOfLoansinYears2', this.state.termsOfLoansinYearsHeight)}
														keyboardType="numeric"
														returnKeyType="next"
														editable={(this.state.ltv2 > 0) ? true : false}
														style={[BuyerStyle.width70, { alignSelf: 'center' }]}
														underlineColorAndroid='transparent'
														onChangeText={(value) => this.setState({ termsOfLoansinYears2: this.onChange(value) })}
														onEndEditing={(event) => this.updateFormField(event.nativeEvent.text, 'termsOfLoansinYears2', this.callSalesPr)}
														value={this.delimitNumbers(this.state.termsOfLoansinYears2)}
													/>
												</View>
												<View style={BuyerStyle.textboxunderline}>
													<View style={[BuyerStyle.fullunderline,]}></View>
												</View>
											</View>
										)}
									</View>


									<View style={[BuyerStyle.fullunderline, { marginTop: 10 }]}></View>
									<View style={[BuyerStyle.loandetailhead, { marginTop: 10 }]} onLayout={(event) => this.measureView(event, 'loanAmtHeight')}>
										<View style={BuyerStyle.existingfirst}>
											<Text style={[BuyerStyle.loanstext, { marginTop: 0, marginLeft: 10 }]}>{STRINGS.t('New_Ltv_Amt')}</Text>
										</View>
										<View style={[BuyerStyle.existingfirstbalanceNewLtvAmt]}>
											<View style={{ width: '100%', flexDirection: 'row' }}>
												<Text style={BuyerStyle.existingtext}>$</Text>
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('loan_amt', this.state.loanAmtHeight)}
													keyboardType="numeric"
													returnKeyType="next"
													style={[BuyerStyle.width70, { alignSelf: 'center' }]}
													underlineColorAndroid='transparent'
													onChangeText={(value) => this.setState({ loan_amt: this.onChange(value) })}
													onEndEditing={(event) => this.updateFormField(event.nativeEvent.text, 'loan_amt')}
													value={this.delimitNumbers(this.state.loan_amt)}
												/>
											</View>
											<View style={BuyerStyle.textboxunderline}>
												<View style={[BuyerStyle.fullunderline,]}></View>
											</View>
										</View>
										{renderIf(this.state.tab == 'CONV' && this.state.ltv2 > 0)(
											<View style={BuyerStyle.existingfirstbalance}>
												<View style={{ width: '100%', flexDirection: 'row' }}>
													<Text style={BuyerStyle.existingtext}>$</Text>
													<CustomTextInput allowFontScaling={false} customKeyboardType="hello" style={[BuyerStyle.width70, { alignSelf: 'center' }]}
														underlineColorAndroid='transparent'
														value={this.delimitNumbers(this.state.loan_amt2)}
													/>

												</View>
												<View style={BuyerStyle.textboxunderline}>
													<View style={[BuyerStyle.fullunderline,]}></View>
												</View>
											</View>
										)}
									</View>
									<View style={[BuyerStyle.fullunderline, { marginTop: 10 }]}></View>

									{renderIf(this.state.tab == 'VA' || this.state.tab == 'FHA')(
										<View>
											<Text style={[BuyerStyle.loanstext, { textAlign: 'center' }]}>{STRINGS.t('adjusted_loan_amount')}  <Text>$ {this.delimitNumbers(this.state.adjusted_loan_amt)}</Text></Text>
											<View style={[BuyerStyle.fullunderline, { marginTop: 10 }]}></View>
										</View>
									)}

									<Text style={[Styles.loanstext, { textAlign: 'center' }]}>{STRINGS.t('LoansToBePaid')}</Text>
									<View style={[Styles.fullunderline, { marginTop: 10 }]}></View>
									<View style={Styles.loanstopaybox}>
										<View style={Styles.headerloanratio}>
											<Text style={Styles.headerloanratiotext}>{STRINGS.t('balance')}</Text>
											<Text style={Styles.headerloanratiotext}>{STRINGS.t('rate')}</Text>
										</View>
									</View>
									<View style={Styles.loandetailhead} onLayout={(event) => this.measureView(event, 'existingfirstHeight')}>
										<View style={Styles.existingfirst}>
											<Text style={Styles.existingheadtext}>{STRINGS.t('existingfirst')}</Text>
										</View>
										<View style={Styles.existingfirstbalance}>
											<View style={{ width: '100%', flexDirection: 'row' }}>
												<Text style={Styles.existingtext}>$</Text>
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('loansToBePaid_1Balance', this.state.existingfirstHeight)}
													placeholder='0.00'
													ref="existingFirst"
													keyboardType="numeric"
													onEndEditing={(event) => this.updateFormField(event.nativeEvent.text, 'loansToBePaid_1Balance', this.callExisitngFieldsCalculations)}
													style={[Styles.width70, { alignSelf: 'center' }]} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({ loansToBePaid_1Balance: this.onChange(value) })} value={this.delimitNumbers(this.state.loansToBePaid_1Balance)} />
											</View>
											<View style={Styles.textboxunderline}>
												<View style={[Styles.fullunderline,]}></View>
											</View>
										</View>
										<View style={Styles.existingfirstbalance}>
											<View style={{ width: '100%', flexDirection: 'row' }}>
												<Text style={Styles.existingtext}>%</Text>
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('loansToBePaid_1Rate', this.state.existingfirstHeight)} placeholder='0.00' ref="existingFirstTwo" keyboardType="numeric" onEndEditing={(event) => this.updateFormField(event.nativeEvent.text, 'loansToBePaid_1Rate', this.callExisitngFieldsCalculations)} style={Styles.width70} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({ loansToBePaid_1Rate: this.onChange(value) })} value={this.delimitNumbers(this.state.loansToBePaid_1Rate)} />
											</View>
											<View style={Styles.textboxunderline}>
												<View style={[Styles.fullunderline,]}></View>
											</View>
										</View>
									</View>
									<View style={Styles.loandetailhead} onLayout={(event) => this.measureView(event, 'existingsecondHeight')}>
										<View style={Styles.existingfirst}>
											<Text style={Styles.existingheadtext}>{STRINGS.t('existingsecond')}</Text>
										</View>
										<View style={Styles.existingfirstbalance}>
											<View style={{ width: '100%', flexDirection: 'row' }}>
												<Text style={Styles.existingtext}>$</Text>
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('loansToBePaid_2Balance', this.state.existingsecondHeight)} placeholder='0.00' ref="existingSecond" keyboardType="numeric" onEndEditing={(event) => this.updateFormField(event.nativeEvent.text, 'loansToBePaid_2Balance', this.callExisitngFieldsCalculations)} style={[Styles.width70, { alignSelf: 'center' }]} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({ loansToBePaid_2Balance: this.onChange(value) })} value={this.delimitNumbers(this.state.loansToBePaid_2Balance)} />

											</View>
											<View style={Styles.textboxunderline}>
												<View style={[Styles.fullunderline,]}></View>
											</View>
										</View>
										<View style={Styles.existingfirstbalance}>
											<View style={{ width: '100%', flexDirection: 'row' }}>
												<Text style={Styles.existingtext}>%</Text>
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('loansToBePaid_2Rate', this.state.existingsecondHeight)} placeholder='0.00' ref="existingSecondTwo" keyboardType="numeric" onEndEditing={(event) => this.updateFormField(event.nativeEvent.text, 'loansToBePaid_2Rate', this.callExisitngFieldsCalculations)} style={Styles.width70} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({ loansToBePaid_2Rate: this.onChange(value) })} value={this.delimitNumbers(this.state.loansToBePaid_2Rate)} />
											</View>
											<View style={Styles.textboxunderline}>
												<View style={[Styles.fullunderline,]}></View>
											</View>
										</View>
									</View>
									<View style={Styles.loandetailhead} onLayout={(event) => this.measureView(event, 'existingthirdHeight')}>
										<View style={Styles.existingfirst}>
											<Text style={Styles.existingheadtext}>{STRINGS.t('existingthird')}</Text>
										</View>
										<View style={Styles.existingfirstbalance}>
											<View style={{ width: '100%', flexDirection: 'row' }}>
												<Text style={Styles.existingtext}>$</Text>
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('loansToBePaid_3Balance', this.state.existingthirdHeight)} placeholder='0.00' ref="existingThird" keyboardType="numeric" onEndEditing={(event) => this.updateFormField(event.nativeEvent.text, 'loansToBePaid_3Balance', this.callExisitngFieldsCalculations)} style={[Styles.width70, { alignSelf: 'center' }]} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({ loansToBePaid_3Balance: this.onChange(value) })} value={this.delimitNumbers(this.state.loansToBePaid_3Balance)} />
											</View>
											<View style={Styles.textboxunderline}>
												<View style={[Styles.fullunderline,]}></View>
											</View>
										</View>
										<View style={Styles.existingfirstbalance}>
											<View style={{ width: '100%', flexDirection: 'row' }}>
												<Text style={Styles.existingtext}>%</Text>
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('loansToBePaid_3Rate', this.state.existingthirdHeight)} placeholder='0.00' keyboardType="numeric" onEndEditing={(event) => this.updateFormField(event.nativeEvent.text, 'loansToBePaid_3Rate', this.callExisitngFieldsCalculations)} style={Styles.width70} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({ loansToBePaid_3Rate: this.onChange(value) })} value={this.delimitNumbers(this.state.loansToBePaid_3Rate)} />

											</View>
											<View style={Styles.textboxunderline}>
												<View style={[Styles.fullunderline,]}></View>
											</View>
										</View>
									</View>


									<View style={BuyerStyle.fieldcontainer} onLayout={(event) => this.measureView(event, 'numberOfDaysPerMonthBuyerHeight')}>
										<View style={BuyerStyle.fieldcontainersmallfieldLessWidth}>
											<View style={BuyerStyle.alignrightinput}>
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('numberOfDaysPerMonthBuyer', this.state.numberOfDaysPerMonthBuyerHeight)} keyboardType="numeric" style={[BuyerStyle.width100, { width: '75%' }]}
													onChangeText={(value) => this.setState({ numberOfDaysPerMonthBuyer: this.onChange(value) })}
													onEndEditing={(event) => this.updateFormField(event.nativeEvent.text, 'numberOfDaysPerMonthBuyer', this.callExisitngFieldsCalculations)} underlineColorAndroid='transparent' value={this.state.numberOfDaysPerMonthBuyer.toString()} />
											</View>
											<View style={[BuyerStyle.fullunderline, { width: '78%' }]}></View>
										</View>
										<View style={BuyerStyle.fieldcontainerlargefieldForDaysInterest}>
											<Text style={BuyerStyle.fieldcontainerlable}>{STRINGS.t('days_interest')}</Text>
										</View>
										<View style={BuyerStyle.fieldcontainersmallfieldDaysInterestRef}>
										</View>
										<View style={BuyerStyle.fieldcontainersmallfield}>
											<View style={BuyerStyle.alignrightinput}>
												<Text style={BuyerStyle.alignCenter}>$ </Text>
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('daysInterestRef', this.state.numberOfDaysPerMonthBuyerHeight)} keyboardType="numeric" style={[BuyerStyle.width100, { width: '75%' }]} underlineColorAndroid='transparent' onEndEditing={(event) => this.updateFormField(event.nativeEvent.text, 'daysInterestRef')} onChangeText={(value) => this.setState({ daysInterestRef: this.onChange(value) })} value={this.delimitNumbers(this.state.daysInterestRef)} />

											</View>
											<View style={[BuyerStyle.fullunderline, { width: '78%' }]}></View>
										</View>
									</View>
									<View style={[BuyerStyle.fullunderline, { marginTop: 10 }]}></View>

									<Text style={[Styles.loanstext, { textAlign: 'center' }]}>{STRINGS.t('total')}:  <Text>$ {this.delimitNumbers(this.state.existingTotal)}</Text></Text>
									<View style={[Styles.fullunderline, { marginTop: 10 }]}></View>


									<View style={[BuyerStyle.loandetailhead, { paddingLeft: 10, paddingRight: 10, marginBottom: this.state.focusElementMargin }]}>
										<View style={BuyerStyle.title_justify}>
											<Text style={BuyerStyle.text_style}>{STRINGS.t('est_closing')}</Text>
										</View>
										<View style={{ width: '33%', justifyContent: 'center' }}>
											<View style={BuyerStyle.alignrightinput}>
												<DatePicker style={BuyerStyle.width100date} showIcon={false} date={this.state.date} mode="date" placeholder="select date" format="MM-DD-YYYY" minDate={this.state.date} confirmBtnText="Confirm" cancelBtnText="Cancel" customStyles={{ dateInput: { borderWidth: 0 } }} onDateChange={(date) => this.changeDate(date)} />
											</View>
											<View style={[BuyerStyle.fullunderline,]}></View>
										</View>
									</View>
								</ScrollView>
							</View>
						</View>

					)}
					{renderIf(this.state.footer_tab == 'closing_cost')(
						<View style={{ height: '100%', width: '100%' }}>
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
									<View style={[BuyerStyle.scrollable_container_child, { marginTop: 10 }]} onLayout={(event) => this.measureView(event, 'escrowFeeHeight')}>
										<View style={BuyerStyle.smalltitle_justify}>
											<Text style={BuyerStyle.text_style}>{STRINGS.t('escrow')}</Text>
										</View>
										<View style={{ width: '25%', justifyContent: 'center' }}>

										</View>
										<View style={{ width: '30%', justifyContent: 'center' }}>
											<View style={BuyerStyle.alignrightinput}>
												<Text style={BuyerStyle.alignCenter}>$ </Text>
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('escrowFee', this.state.escrowFeeHeight)} keyboardType="numeric" style={BuyerStyle.width100} onEndEditing={(event) => this.updateFormField(event.nativeEvent.text, 'daysInterestRef', this.calEscrowData)} onChangeText={(value) => this.setState({ escrowFee: this.onChange(value) })} value={this.delimitNumbers(this.state.escrowFee)} underlineColorAndroid='transparent' />
											</View>
											<View style={[BuyerStyle.fullunderline]}></View>
										</View>
									</View>

									<View style={[BuyerStyle.scrollable_container_child, { marginTop: 10 }]} onLayout={(event) => this.measureView(event, 'titleInsuranceShortRateHeight')}>

										{renderIf(this.state.state_code == 'TX')(
											<View style={{ width: '50%', justifyContent: 'center', flexDirection: 'row', marginRight: 8 }}>
												<View style={{ justifyContent: 'center', paddingRight: 10 }}>
													<Text style={{ color: "#404040", fontFamily: 'roboto-regular', fontSize: 16, justifyContent: 'flex-start', alignItems: 'center' }}>{STRINGS.t('discount')}</Text>

												</View>
												<Selectbox
													style={{ width: '50%', alignSelf: 'flex-end' }}
													selectLabelStyle={{ fontSize: 16 }}
													selectedItem={this.state.discountYearSelectedDropdownVal}
													onChange={this._onChangeDiscountYear}
													items={this.state.discountYearDropdownVal}
												/>

											</View>

										)}

										<View style={BuyerStyle.title_justify_title_insurance}>
											<Text style={BuyerStyle.text_style}>{STRINGS.t('Title_Insurance')}</Text>
										</View>
										{renderIf(this.state.state_code != 'TX')(
											<View style={{ width: '52%', justifyContent: 'center' }}>

											</View>
										)}
										<View style={{ width: '30%', justifyContent: 'center' }}>
											<View style={BuyerStyle.alignrightinput}>
												<Text style={BuyerStyle.alignCenter}>$ </Text>
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('titleInsuranceShortRate', this.state.titleInsuranceShortRateHeight)} keyboardType="numeric" style={BuyerStyle.width100} onEndEditing={(event) => this.updateFormField(event.nativeEvent.text, 'titleInsuranceShortRate', this.calEscrowData)} onChangeText={(value) => this.setState({ titleInsuranceShortRate: this.onChange(value) })} value={this.delimitNumbers(this.state.titleInsuranceShortRate)} underlineColorAndroid='transparent' />
											</View>
											<View style={[BuyerStyle.fullunderline,]}></View>
										</View>

									</View>

									<View style={[BuyerStyle.fullunderline, { marginTop: 10 }]}></View>

									{renderIf(this.state.state_code == 'OH')(
										<View style={[BuyerStyle.scrollable_container_child, { marginTop: 10 }]} onLayout={(event) => this.measureView(event, 'reissueSalePriceHeight')}>
											<View style={BuyerStyle.smalltitle_justify}>
												<Text style={BuyerStyle.text_style}>{STRINGS.t('Reissue_Less_Than_Ten')}</Text>
											</View>
											<View style={{ flexDirection: 'row', width: '25%', justifyContent: 'center' }}>
												<CheckBox right={true} uncheckedColor="#3b90c4" containerStyle={{ backgroundColor: '#ffffff', borderWidth: 0 }} center checkedColor='#3b90c4' checked={this.state.isCheckForOhio}
													onPress={this.handlePressCheckedBoxForOhio}
												/>

											</View>
											<View style={{ width: '30%', justifyContent: 'center', alignItems: 'flex-start' }}>
												<View style={BuyerStyle.alignrightinput}>
													<Text style={BuyerStyle.alignCenter}>$ </Text>
													{(this.state.reissueSalePriceEditableStatus == true ?
														<Text style={BuyerStyle.width100ReIssueYr}>{this.delimitNumbers(this.state.reissueSalePrice)} </Text>
														:
														<CustomTextInput allowFontScaling={false} customKeyboardType="hello" onKeyPress={() => this.onFocus('reissueSalePrice', this.state.reissueSalePriceHeight)} selectTextOnFocus={true} placeholder='0.00' ref="reissueSalePrice" keyboardType="numeric"
															onEndEditing={(event) => this.updateFormField(event.nativeEvent.text, 'reissueSalePrice', this.calReissueSalePrice(event.nativeEvent.text))}
															editable={true}
															style={BuyerStyle.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({ reissueSalePrice: this.onChange(value) })} value={this.delimitNumbers(this.state.reissueSalePrice)} />
													)}
												</View>
											</View>
										</View>
									)}



									<View style={[BuyerStyle.scrollable_container_child, { marginTop: 10 }]} onLayout={(event) => this.measureView(event, 'discHeight')}>
										<View style={BuyerStyle.smalltitle_justify}>
											<Text style={BuyerStyle.text_style}>{STRINGS.t('discount')}</Text>
										</View>
										<View style={{ width: '25%', justifyContent: 'center' }}>
											<View style={[BuyerStyle.alignrightinput, { width: '80%', marginLeft: '10%' }]}>
												<Text style={BuyerStyle.alignCenter}>% </Text>
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('disc', this.state.discHeight)} keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onEndEditing={(event) => this.updateFormField(event.nativeEvent.text, 'disc', this.onChangeDisc(event.nativeEvent.text, "disc"))} onChangeText={(value) => this.setState({ disc: this.onChange(value) })} value={this.delimitNumbers(this.state.disc.toString())} />
											</View>
											<View style={[BuyerStyle.fullunderline, { width: '80%', marginLeft: '10%' }]}></View>
										</View>
										<View style={{ width: '30%', justifyContent: 'center' }}>
											<View style={BuyerStyle.alignrightinput}>
												<Text style={BuyerStyle.alignCenter}>$ </Text>
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('discAmt', this.state.discHeight)} keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onEndEditing={(event) => this.updateFormField(event.nativeEvent.text, 'discAmt', this.calTotalClosingCost)} onChangeText={(value) => this.setState({ discAmt: this.onChange(value) })} value={this.delimitNumbers(this.state.discAmt)} />
											</View>
											<View style={[BuyerStyle.fullunderline,]}></View>
										</View>
									</View>



									<View style={[BuyerStyle.fullunderline, { marginTop: 10 }]}></View>
									<View style={[BuyerStyle.scrollable_container_child, { marginTop: 10 }]} onLayout={(event) => this.measureView(event, 'originationFeeHeight')}>
										<View style={BuyerStyle.title_justify}>
											<Text style={BuyerStyle.text_style}>{STRINGS.t('originatin_fees')}</Text>
										</View>
										<View style={{ width: '30%', justifyContent: 'center' }}>
											<View style={BuyerStyle.alignrightinput}>
												<Text style={BuyerStyle.alignCenter}>$ </Text>
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('originationFee', this.state.originationFeeHeight)} keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onEndEditing={(event) => this.updateFormField(event.nativeEvent.text, 'originationFee', this.calTotalClosingCost)} onChangeText={(value) => this.setState({ originationFee: this.onChange(value) })} value={this.delimitNumbers(this.state.originationFee)} />
											</View>
											<View style={[BuyerStyle.fullunderline,]}></View>
										</View>
									</View>
									<View style={[BuyerStyle.scrollable_container_child, { marginTop: 10 }]} onLayout={(event) => this.measureView(event, 'processingfeeHeight')}>
										<View style={BuyerStyle.title_justify}>
											<Text style={BuyerStyle.text_style}>{STRINGS.t('processing_fees')}</Text>
										</View>
										<View style={{ width: '30%', justifyContent: 'center' }}>
											<View style={BuyerStyle.alignrightinput}>
												<Text style={BuyerStyle.alignCenter}>$ </Text>
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('processingfee', this.state.processingfeeHeight)} keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onEndEditing={(event) => this.updateFormField(event.nativeEvent.text, 'processingfee', this.calTotalClosingCost)} onChangeText={(value) => this.setState({ processingfee: this.onChange(value) })} value={this.delimitNumbers(this.state.processingfee)} />
											</View>
											<View style={[BuyerStyle.fullunderline,]}></View>
										</View>
									</View>
									<View style={[BuyerStyle.scrollable_container_child, { marginTop: 10 }]} onLayout={(event) => this.measureView(event, 'taxservicecontractHeight')}>
										<View style={BuyerStyle.title_justify}>
											<Text style={BuyerStyle.text_style}>{STRINGS.t('tax_service_contact')}</Text>
										</View>
										<View style={{ width: '30%', justifyContent: 'center' }}>
											<View style={BuyerStyle.alignrightinput}>
												<Text style={BuyerStyle.alignCenter}>$ </Text>
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('taxservicecontract', this.state.taxservicecontractHeight)} keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onEndEditing={(event) => this.updateFormField(event.nativeEvent.text, 'taxservicecontract', this.calTotalClosingCost)} onChangeText={(value) => this.setState({ taxservicecontract: this.onChange(value) })} value={this.delimitNumbers(this.state.taxservicecontract)} />
											</View>
											<View style={[BuyerStyle.fullunderline,]}></View>
										</View>
									</View>
									<View style={[BuyerStyle.scrollable_container_child, { marginTop: 10 }]} onLayout={(event) => this.measureView(event, 'documentprepHeight')}>
										<View style={BuyerStyle.title_justify}>
											<Text style={BuyerStyle.text_style}>{STRINGS.t('document_prep')}</Text>
										</View>
										<View style={{ width: '30%', justifyContent: 'center' }}>
											<View style={BuyerStyle.alignrightinput}>
												<Text style={BuyerStyle.alignCenter}>$ </Text>
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('documentprep', this.state.documentprepHeight)} keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onEndEditing={(event) => this.updateFormField(event.nativeEvent.text, 'documentprep', this.calTotalClosingCost)} onChangeText={(value) => this.setState({ documentprep: this.onChange(value) })} value={this.delimitNumbers(this.state.documentprep)} />
											</View>
											<View style={[BuyerStyle.fullunderline,]}></View>
										</View>
									</View>
									<View style={[BuyerStyle.scrollable_container_child, { marginTop: 10 }]} onLayout={(event) => this.measureView(event, 'underwritingHeight')}>
										<View style={BuyerStyle.title_justify}>
											<Text style={BuyerStyle.text_style}>{STRINGS.t('underwriting')}</Text>
										</View>
										<View style={{ width: '30%', justifyContent: 'center' }}>
											<View style={BuyerStyle.alignrightinput}>
												<Text style={BuyerStyle.alignCenter}>$ </Text>
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('underwriting', this.state.underwritingHeight)} keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onEndEditing={(event) => this.updateFormField(event.nativeEvent.text, 'underwriting', this.calTotalClosingCost)} onChangeText={(value) => this.setState({ underwriting: this.onChange(value) })} value={this.delimitNumbers(this.state.underwriting)} />
											</View>
											<View style={[BuyerStyle.fullunderline,]}></View>
										</View>
									</View>
									<View style={[BuyerStyle.scrollable_container_child, { marginTop: 10 }]} onLayout={(event) => this.measureView(event, 'appraisalHeight')}>
										<View style={BuyerStyle.title_justify}>
											<Text style={BuyerStyle.text_style}>{STRINGS.t('appraisal')}</Text>
										</View>
										<View style={{ width: '30%', justifyContent: 'center' }}>
											<View style={BuyerStyle.alignrightinput}>
												<Text style={BuyerStyle.alignCenter}>$ </Text>
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('appraisalfee', this.state.appraisalHeight)} keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onEndEditing={(event) => this.updateFormField(event.nativeEvent.text, 'appraisalfee', this.calTotalClosingCost)} onChangeText={(value) => this.setState({ appraisalfee: this.onChange(value) })} value={this.delimitNumbers(this.state.appraisalfee)} />
											</View>
											<View style={[BuyerStyle.fullunderline,]}></View>
										</View>
									</View>
									<View style={[BuyerStyle.scrollable_container_child, { marginTop: 10 }]} onLayout={(event) => this.measureView(event, 'prepaymentpenaltyfeeHeight')}>
										<View style={BuyerStyle.title_justify}>
											<Text style={BuyerStyle.text_style}>{STRINGS.t('prepayment_penalty')}</Text>
										</View>
										<View style={{ width: '30%', justifyContent: 'center' }}>
											<View style={BuyerStyle.alignrightinput}>
												<Text style={BuyerStyle.alignCenter}>$ </Text>
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('prepaymentpenaltyfee', this.state.prepaymentpenaltyfeeHeight)} keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onEndEditing={(event) => this.updateFormField(event.nativeEvent.text, 'prepaymentpenaltyfee', this.calTotalClosingCost)} onChangeText={(value) => this.setState({ prepaymentpenaltyfee: this.onChange(value) })} value={this.delimitNumbers(this.state.prepaymentpenaltyfee)} />
											</View>
											<View style={[BuyerStyle.fullunderline,]}></View>
										</View>
									</View>
									<View style={[BuyerStyle.scrollable_container_child, { marginTop: 10 }]} onLayout={(event) => this.measureView(event, 'creditReportHeight')}>
										<View style={BuyerStyle.title_justify}>
											<Text style={BuyerStyle.text_style}>{STRINGS.t('credit_report')}</Text>
										</View>
										<View style={{ width: '30%', justifyContent: 'center' }}>
											<View style={BuyerStyle.alignrightinput}>
												<Text style={BuyerStyle.alignCenter}>$ </Text>
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('creditReport', this.state.creditReportHeight)} keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onEndEditing={(event) => this.updateFormField(event.nativeEvent.text, 'creditReport', this.calTotalClosingCost)} onChangeText={(value) => this.setState({ creditReport: this.onChange(value) })} value={this.delimitNumbers(this.state.creditReport)} />
											</View>
											<View style={[BuyerStyle.fullunderline,]}></View>
										</View>
									</View>
									<View style={[BuyerStyle.fullunderline, { marginTop: 10 }]}></View>
									<View style={[BuyerStyle.scrollable_container_child, { marginTop: 10 }]} onLayout={(event) => this.measureView(event, 'fee1Height')}>
										<View style={BuyerStyle.title_justify}>
											<Text style={BuyerStyle.text_style}>{this.state.label1.toString()}</Text>
										</View>
										<View style={{ width: '30%', justifyContent: 'center' }}>
											<View style={BuyerStyle.alignrightinput}>
												<Text style={BuyerStyle.alignCenter}>$ </Text>
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('fee1', this.state.fee1Height)} keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({ fee1: this.onChange(value) })} value={this.delimitNumbers(this.state.fee1)} />
											</View>
											<View style={[BuyerStyle.fullunderline,]}></View>
										</View>
									</View>
									<View style={[BuyerStyle.scrollable_container_child, { marginTop: 10 }]} onLayout={(event) => this.measureView(event, 'fee2Height')}>
										<View style={BuyerStyle.title_justify}>
											<Text style={BuyerStyle.text_style}>{this.state.label2.toString()}</Text>
										</View>
										<View style={{ width: '30%', justifyContent: 'center' }}>
											<View style={BuyerStyle.alignrightinput}>
												<Text style={BuyerStyle.alignCenter}>$ </Text>
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('fee2', this.state.fee2Height)} keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({ fee2: this.onChange(value) })} value={this.delimitNumbers(this.state.fee2)} />
											</View>
											<View style={[BuyerStyle.fullunderline,]}></View>
										</View>
									</View>
									<View style={[BuyerStyle.scrollable_container_child, { marginTop: 10 }]} onLayout={(event) => this.measureView(event, 'fee3Height')}>
										<View style={BuyerStyle.title_justify}>
											<Text style={BuyerStyle.text_style}>{this.state.label3.toString()}</Text>
										</View>
										<View style={{ width: '30%', justifyContent: 'center' }}>
											<View style={BuyerStyle.alignrightinput}>
												<Text style={BuyerStyle.alignCenter}>$ </Text>
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('fee3', this.state.fee3Height)} keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({ fee3: this.onChange(value) })} value={this.delimitNumbers(this.state.fee3)} />
											</View>
											<View style={[BuyerStyle.fullunderline,]}></View>
										</View>
									</View>
									<View style={[BuyerStyle.scrollable_container_child, { marginTop: 10 }]} onLayout={(event) => this.measureView(event, 'fee4Height')}>
										<View style={BuyerStyle.title_justify}>
											<Text style={BuyerStyle.text_style}>{this.state.label4.toString()}</Text>
										</View>
										<View style={{ width: '30%', justifyContent: 'center' }}>
											<View style={BuyerStyle.alignrightinput}>
												<Text style={BuyerStyle.alignCenter}>$ </Text>
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('fee4', this.state.fee4Height)} keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({ fee4: this.onChange(value) })} value={this.delimitNumbers(this.state.fee4)} />
											</View>
											<View style={[BuyerStyle.fullunderline,]}></View>
										</View>
									</View>
									<View style={[BuyerStyle.scrollable_container_child, { marginTop: 10 }]} onLayout={(event) => this.measureView(event, 'fee5Height')}>
										<View style={BuyerStyle.title_justify}>
											<Text style={BuyerStyle.text_style}>{this.state.label5.toString()}</Text>
										</View>
										<View style={{ width: '30%', justifyContent: 'center' }}>
											<View style={BuyerStyle.alignrightinput}>
												<Text style={BuyerStyle.alignCenter}>$ </Text>
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('fee5', this.state.fee5Height)} keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({ fee5: this.onChange(value) })} value={this.delimitNumbers(this.state.fee5)} />
											</View>
											<View style={[BuyerStyle.fullunderline,]}></View>
										</View>
									</View>
									<View style={[BuyerStyle.scrollable_container_child, { marginTop: 10 }]} onLayout={(event) => this.measureView(event, 'fee6Height')}>
										<View style={BuyerStyle.title_justify}>
											<Text style={BuyerStyle.text_style}>{this.state.label6.toString()}</Text>
										</View>
										<View style={{ width: '30%', justifyContent: 'center' }}>
											<View style={BuyerStyle.alignrightinput}>
												<Text style={BuyerStyle.alignCenter}>$ </Text>
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('fee6', this.state.fee6Height)} keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({ fee6: this.onChange(value) })} value={this.delimitNumbers(this.state.fee6)} />
											</View>
											<View style={[BuyerStyle.fullunderline,]}></View>
										</View>
									</View>
									<View style={[BuyerStyle.scrollable_container_child, { marginTop: 10 }]} onLayout={(event) => this.measureView(event, 'fee7Height')}>
										<View style={BuyerStyle.title_justify}>
											<Text style={BuyerStyle.text_style}>{this.state.label7.toString()}</Text>
										</View>
										<View style={{ width: '30%', justifyContent: 'center' }}>
											<View style={BuyerStyle.alignrightinput}>
												<Text style={BuyerStyle.alignCenter}>$ </Text>
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('fee7', this.state.fee7Height)} keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({ fee7: this.onChange(value) })} value={this.delimitNumbers(this.state.fee7)} />
											</View>
											<View style={[BuyerStyle.fullunderline,]}></View>
										</View>
									</View>
									<View style={[BuyerStyle.scrollable_container_child, { marginTop: 10 }]} onLayout={(event) => this.measureView(event, 'fee8Height')}>
										<View style={BuyerStyle.title_justify}>
											<Text style={BuyerStyle.text_style}>{this.state.label8.toString()}</Text>
										</View>
										<View style={{ width: '30%', justifyContent: 'center' }}>
											<View style={BuyerStyle.alignrightinput}>
												<Text style={BuyerStyle.alignCenter}>$ </Text>
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('fee8', this.state.fee8Height)} keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({ fee8: this.onChange(value) })} value={this.delimitNumbers(this.state.fee8)} />
											</View>
											<View style={[BuyerStyle.fullunderline,]}></View>
										</View>
									</View>
									<View style={[BuyerStyle.scrollable_container_child, { marginTop: 10 }]} onLayout={(event) => this.measureView(event, 'fee9Height')}>
										<View style={BuyerStyle.title_justify}>
											<Text style={BuyerStyle.text_style}>{this.state.label9.toString()}</Text>
										</View>
										<View style={{ width: '30%', justifyContent: 'center' }}>
											<View style={BuyerStyle.alignrightinput}>
												<Text style={BuyerStyle.alignCenter}>$ </Text>
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('fee9', this.state.fee9Height)} keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({ fee9: this.onChange(value) })} value={this.delimitNumbers(this.state.fee9)} />
											</View>
											<View style={[BuyerStyle.fullunderline,]}></View>
										</View>
									</View>
									<View style={[BuyerStyle.scrollable_container_child, { marginTop: 10 }]} onLayout={(event) => this.measureView(event, 'fee10Height')}>
										<View style={BuyerStyle.title_justify}>
											<Text style={BuyerStyle.text_style}>{this.state.label10.toString()}</Text>
										</View>
										<View style={{ width: '30%', justifyContent: 'center' }}>
											<View style={BuyerStyle.alignrightinput}>
												<Text style={BuyerStyle.alignCenter}>$ </Text>
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('fee10', this.state.fee10Height)} keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({ fee10: this.onChange(value) })} value={this.delimitNumbers(this.state.fee10)} />
											</View>
											<View style={[BuyerStyle.fullunderline,]}></View>
										</View>
									</View>
									<View style={[BuyerStyle.scrollable_container_child, { marginTop: 10, marginBottom: this.state.focusElementMargin }]} onLayout={(event) => this.measureView(event, 'fee11Height')}>
										<View style={BuyerStyle.title_justify}>
											<Text style={BuyerStyle.text_style}>{this.state.label11.toString()}</Text>
										</View>
										<View style={{ width: '30%', justifyContent: 'center' }}>
											<View style={BuyerStyle.alignrightinput}>
												<Text style={BuyerStyle.alignCenter}>$ </Text>
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('fee11', this.state.fee11Height)} keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({ fee11: this.onChange(value) })} value={this.delimitNumbers(this.state.fee11)} />
											</View>
											<View style={[BuyerStyle.fullunderline,]}></View>
										</View>
									</View>
								</ScrollView>
							</View>
						</View>
					)}
					<View style={BuyerStyle.Footer}>
						<View style={BuyerStyle.FooterinneR}>
							<View style={BuyerStyle.footer_icon_container}>
								<TouchableOpacity style={CustomStyle.back_icon_parent} onPress={() => this.changeFooterTab('refinance')}>
									{renderIf(this.state.footer_tab != 'refinance')(
										<Image style={BuyerStyle.footer_icon} source={Images.refinance} />
									)}
									{renderIf(this.state.footer_tab == 'refinance')(
										<Image style={BuyerStyle.footer_icon} source={Images.refinance_highlight} />
									)}
								</TouchableOpacity>
							</View>
							<View style={BuyerStyle.lineView}></View>
							<View style={BuyerStyle.footer_icon_container}>
								<TouchableOpacity style={CustomStyle.back_icon_parent} onPress={() => this.changeFooterTab('closing_cost')}>
									{renderIf(this.state.footer_tab != 'closing_cost')(
										<Image style={BuyerStyle.footer_icon} source={Images.closing_cost} />
									)}
									{renderIf(this.state.footer_tab == 'closing_cost')(
										<Image style={BuyerStyle.footer_icon} source={Images.closing_cost_highlight} />
									)}
								</TouchableOpacity>
							</View>
							<View style={BuyerStyle.lineView}></View>
							<View style={BuyerStyle.footer_icon_container}>
								{renderIf(this.state.footer_tab != 'prepaid')(
									<TouchableOpacity style={CustomStyle.back_icon_parent} onPress={() => this.changeFooterTab('prepaid')} >
										<Image style={BuyerStyle.footer_icon} source={Images.prepaid} />
									</TouchableOpacity>
								)}
								{renderIf(this.state.footer_tab == 'prepaid')(
									<TouchableOpacity style={CustomStyle.back_icon_parent} onPress={() => this.changeFooterTab('prepaid')} >
										<Image style={BuyerStyle.footer_icon} source={Images.prepaid_highlight} />
									</TouchableOpacity>
								)}
							</View>
							<View style={BuyerStyle.lineView}></View>
							<View style={BuyerStyle.footer_icon_container}>
								{renderIf(this.state.footer_tab != 'payment')(
									<TouchableOpacity style={CustomStyle.back_icon_parent} onPress={() => this.changeFooterTab('payment')} >
										<Image style={BuyerStyle.footer_icon} source={Images.payment} />
									</TouchableOpacity>
								)}
								{renderIf(this.state.footer_tab == 'payment')(
									<TouchableOpacity style={CustomStyle.back_icon_parent} onPress={() => this.changeFooterTab('payment')} >
										<Image style={BuyerStyle.footer_icon} source={Images.payment_highlight} />
									</TouchableOpacity>
								)}
							</View>
						</View>
					</View>

					{renderIf(this.state.footer_tab == 'prepaid')(
						<View style={{ height: '100%', width: '100%' }}>
							<View style={BuyerStyle.smallsegmentContainer}>
								<View style={BuyerStyle.segmentView}>
									<View style={BuyerStyle.textViewContainerbig}>
										<Text style={BuyerStyle.schollheadtext}>{STRINGS.t('Total_Prepaid_items')}: $ {this.delimitNumbers(parseFloat(this.state.totalPrepaidItems).toFixed(2))}</Text>
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

									<View style={BuyerStyle.fieldcontainer} onLayout={(event) => this.measureView(event, 'monTaxHeight')}>
										<View style={BuyerStyle.fieldcontainersmallfieldLessWidth}>
											<View style={BuyerStyle.alignrightinput}>
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('monTaxVal', this.state.monTaxHeight)} keyboardType="numeric" style={[BuyerStyle.width100, { width: '75%' }]} underlineColorAndroid='transparent' onEndEditing={(event) => this.updateFormField(event.nativeEvent.text, 'monTaxVal', this.changeMonTaxPrice)} onChangeText={(value) => this.setState({ monTaxVal: this.onChange(value) })} value={this.delimitNumbers(this.state.monTaxVal)} />
											</View>
											<View style={[BuyerStyle.fullunderline, { width: '78%' }]}></View>
										</View>
										<View style={BuyerStyle.fieldcontainerlargefield}>
											<Text style={BuyerStyle.fieldcontainerlable}>{STRINGS.t('mon_tax')}</Text>
										</View>
										<View style={BuyerStyle.fieldcontainersmallfield}>
											<View style={BuyerStyle.alignrightinput}>
												<Text style={BuyerStyle.alignCenter}>% </Text>
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('monTax', this.state.monTaxHeight)} keyboardType="numeric" style={[BuyerStyle.width100, { width: '75%' }]} underlineColorAndroid='transparent' value={this.delimitNumbers(this.state.monTax)} />
											</View>
											<View style={[BuyerStyle.fullunderline, { width: '78%' }]}></View>
										</View>
										<View style={BuyerStyle.fieldcontainersmallfield}>
											<View style={BuyerStyle.alignrightinput}>
												<Text style={BuyerStyle.alignCenter}>$ </Text>
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('prepaidMonthTaxes', this.state.monTaxHeight)} onEndEditing={(event) => this.updateFormField(event.nativeEvent.text, 'prepaidMonthTaxes', this.onChangeMonTax)} keyboardType="numeric" style={[BuyerStyle.width100, { width: '75%' }]} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({ prepaidMonthTaxes: this.onChange(value) })} value={this.delimitNumbers(this.state.prepaidMonthTaxes)} />
											</View>
											<View style={[BuyerStyle.fullunderline, { width: '78%' }]}></View>
										</View>
									</View>





									<View style={BuyerStyle.fieldcontainer} onLayout={(event) => this.measureView(event, 'numberOfMonthsInsurancePrepaidHeight')}>
										<View style={BuyerStyle.fieldcontainersmallfieldLessWidth}>
											<View style={BuyerStyle.alignrightinput}>
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('numberOfMonthsInsurancePrepaid', this.state.numberOfMonthsInsurancePrepaidHeight)} keyboardType="numeric" style={[BuyerStyle.width100, { width: '75%' }]} underlineColorAndroid='transparent' onEndEditing={(event) => this.updateFormField(event.nativeEvent.text, 'numberOfMonthsInsurancePrepaid', this.changeMonInsPrice)} onChangeText={(value) => this.setState({ numberOfMonthsInsurancePrepaid: this.onChange(value) })} value={this.delimitNumbers(this.state.numberOfMonthsInsurancePrepaid)} />
											</View>
											<View style={[BuyerStyle.fullunderline, { width: '78%' }]}></View>
										</View>
										<View style={BuyerStyle.fieldcontainerlargefield}>
											<Text style={BuyerStyle.fieldcontainerlable}>{STRINGS.t('mon_ins')}</Text>
										</View>
										<View style={BuyerStyle.fieldcontainersmallfield}>
											<View style={BuyerStyle.alignrightinput}>
												<Text style={BuyerStyle.alignCenter}>% </Text>
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('monIns', this.state.numberOfMonthsInsurancePrepaidHeight)} keyboardType="numeric" style={[BuyerStyle.width100, { width: '75%' }]} underlineColorAndroid='transparent' value={this.delimitNumbers(this.state.monIns)} />
											</View>
											<View style={[BuyerStyle.fullunderline, { width: '78%' }]}></View>
										</View>
										<View style={BuyerStyle.fieldcontainersmallfield}>
											<View style={BuyerStyle.alignrightinput}>
												<Text style={BuyerStyle.alignCenter}>$ </Text>
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('monthInsuranceRes', this.state.numberOfMonthsInsurancePrepaidHeight)} keyboardType="numeric" style={[BuyerStyle.width100, { width: '75%' }]} onEndEditing={(event) => this.updateFormField(event.nativeEvent.text, 'monthInsuranceRes', this.onChangeMonIns)} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({ monthInsuranceRes: this.onChange(value) })} value={this.delimitNumbers(this.state.monthInsuranceRes)} />
											</View>
											<View style={[BuyerStyle.fullunderline, { width: '78%' }]}></View>
										</View>
									</View>
									<View style={BuyerStyle.fieldcontainer} onLayout={(event) => this.measureView(event, 'numberOfDaysPerMonthHeight')}>
										<View style={BuyerStyle.fieldcontainersmallfieldLessWidth}>
											<View style={BuyerStyle.alignrightinput}>
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('numberOfDaysPerMonth', this.state.numberOfDaysPerMonthHeight)} keyboardType="numeric" style={[BuyerStyle.width100, { width: '75%' }]} underlineColorAndroid='transparent' onEndEditing={(event) => this.updateFormField(event.nativeEvent.text, 'numberOfDaysPerMonth', this.changeDayInterestPrice)} onChangeText={(value) => this.setState({ numberOfDaysPerMonth: this.onChange(value), numberOfDaysPerMonthFixed: true })} value={this.delimitNumbers(this.state.numberOfDaysPerMonth)} />
											</View>
											<View style={[BuyerStyle.fullunderline, { width: '78%' }]}></View>
										</View>
										<View style={BuyerStyle.fieldcontainerlargefieldForDaysInterest}>
											<Text style={BuyerStyle.fieldcontainerlable}>{STRINGS.t('days_interest')}</Text>
										</View>
										<View style={BuyerStyle.fieldcontainersmallfieldForDaysInterest}>
										</View>
										<View style={BuyerStyle.fieldcontainersmallfield}>
											<View style={BuyerStyle.alignrightinput}>
												<Text style={BuyerStyle.alignCenter}>$ </Text>
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('daysInterest', this.state.numberOfDaysPerMonthHeight)} keyboardType="numeric" style={[BuyerStyle.width100, { width: '75%' }]} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({ daysInterest: this.onChange(value) })} value={this.delimitNumbers(this.state.daysInterest)} />
											</View>
											<View style={[BuyerStyle.fullunderline, { width: '78%' }]}></View>
										</View>
									</View>
									{renderIf(this.state.tab == 'CONV')(

										<View style={BuyerStyle.fieldcontainer} onLayout={(event) => this.measureView(event, 'monthPmiValHeight')}>
											<View style={BuyerStyle.fieldcontainerlargefieldPrepaid}>
												<Text style={BuyerStyle.fieldcontainerlable}>{STRINGS.t('2_month_pmi')}</Text>
											</View>
											<View style={BuyerStyle.fieldcontainersmallfield}></View>
											<View style={BuyerStyle.fieldcontainersmallfield}>
												<View style={BuyerStyle.alignrightinput}>
													<Text style={BuyerStyle.alignCenter}>$ </Text>
													<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} keyboardType="numeric" style={[BuyerStyle.width100, { width: '75%' }]} underlineColorAndroid='transparent' onKeyPress={() => this.onFocus('monthPmiVal', this.state.monthPmiValHeight)} onEndEditing={(event) => this.updateFormField(event.nativeEvent.text, 'monthPmiVal')} onChangeText={(value) => this.setState({ monthPmiVal: this.onChange(value) })} value={this.delimitNumbers(this.state.monthPmiVal)} />
												</View>
												<View style={[BuyerStyle.fullunderline, { width: '78%' }]}></View>
											</View>
										</View>
									)}
									{renderIf(this.state.tab == 'FHA')(
										<View style={BuyerStyle.fieldcontainer} onLayout={(event) => this.measureView(event, 'FhaMipFin1Height')}>
											<View style={BuyerStyle.fieldcontainersmallfieldForFHA}>
												<View style={BuyerStyle.alignrightinput}>
													<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('FhaMipFin1', this.state.FhaMipFin1Height)} keyboardType="numeric" style={[BuyerStyle.width100, { width: '75%' }]} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({ FhaMipFin1: this.onChange(value) })} value={this.delimitNumbers(this.state.FhaMipFin1)} />
												</View>
												<View style={[BuyerStyle.fullunderline, { width: '78%' }]}></View>
											</View>
											<View style={BuyerStyle.fieldcontainersmallfieldForFHA}>
												<Text style={BuyerStyle.fieldcontainerlable}>{STRINGS.t('FHA_Mip')} {STRINGS.t('Fin')}</Text>

											</View>

											<View style={BuyerStyle.fieldcontainersmallfieldFHACheckBox}>
												<CheckBox containerStyle={{ backgroundColor: '#ffffff', borderWidth: 0 }} center checkedColor='#CECECE' disabled={this.state.disablefhamipcheckbox} checked={this.state.isChecked} onPress={this.handlePressCheckedBox} />
											</View>
											<View style={BuyerStyle.fieldcontainersmallfieldForFHA}>
												<View style={[BuyerStyle.alignrightinput, { marginRight: 10 }]}>
													<Text style={BuyerStyle.alignCenter}>$ </Text>
													{this.state.isChecked ? (
														<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('FhaMipFin2', this.state.FhaMipFin1Height)} keyboardType="numeric" style={[BuyerStyle.width100, { width: '75%' }]} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({ FhaMipFin2: this.onChange(value) })} value={this.delimitNumbers(this.state.FhaMipFin2)} />) : (
															<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('FhaMipFin', this.state.FhaMipFin1Height)} keyboardType="numeric" style={[BuyerStyle.width100, { width: '75%' }]} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({ FhaMipFin: this.onChange(value) })} value={this.delimitNumbers(this.state.FhaMipFin)} />
														)}
												</View>
												<View style={[BuyerStyle.fullunderline, { width: '78%' }]}></View>
											</View>
										</View>
									)}
									{renderIf(this.state.tab == 'VA')(
										<View style={BuyerStyle.fieldcontainer} onLayout={(event) => this.measureView(event, 'VaFfFin1Height')}>
											<View style={BuyerStyle.fieldcontainersmallfieldVA}>
												<View style={BuyerStyle.alignrightinput}>
													{this.state.isCheckedVA ? (
														<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('VaFfFin1', this.state.VaFfFin1Height)} keyboardType="numeric" style={[BuyerStyle.width100, { width: '75%' }]} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({ VaFfFin1: this.onChange(value) })} value={this.delimitNumbers(this.state.VaFfFin1)} />) : (
															<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} keyboardType="numeric" style={[BuyerStyle.width100, { width: '75%' }]} underlineColorAndroid='transparent' value='0.00' />
														)}
												</View>
												<View style={[BuyerStyle.fullunderline, { width: '78%' }]}></View>
											</View>
											<View style={BuyerStyle.fieldcontainersmallfieldLessWidthVA}>
												<Text style={BuyerStyle.fieldcontainerlable}>{STRINGS.t('VA_FF_Fin')} </Text>
											</View>
											<View style={BuyerStyle.fieldcontainersmallfieldLessWidthVA}>
												<CheckBox containerStyle={{ backgroundColor: '#ffffff', borderWidth: 0 }} center checkedColor='#CECECE' checked={this.state.isCheckedVA} onPress={this.handlePressVACheckedBox} />
											</View>
											<View style={BuyerStyle.fieldcontainersmallfieldVA}>
												<View style={[BuyerStyle.alignrightinput, { width: '75%', marginRight: 11 }]}>
													<Text style={BuyerStyle.alignCenter}>$ </Text>
													<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} keyboardType="numeric" onKeyPress={() => this.onFocus('Vaff', this.state.VaFfFin1Height)} onEndEditing={(event) => this.updateFormField(event.nativeEvent.text, 'Vaff', this.callSalesPr)} onChangeText={(value) => this.setState({ Vaff: this.onChange(value) })} value={this.delimitNumbers(this.state.Vaff)} style={BuyerStyle.width100} underlineColorAndroid='transparent' />
												</View>
												<View style={[BuyerStyle.fullunderline, { width: '78%' }]}></View>
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
										<View style={BuyerStyle.fieldcontainerForVafffin} onLayout={(event) => this.measureView(event, 'VaFfFin1Height')}>
											<View style={BuyerStyle.fieldcontainersmallfieldVA}>
												<View style={[BuyerStyle.alignrightinput, { width: '75%', marginRight: 11 }]}>
													<Text style={BuyerStyle.alignCenter}>$ </Text>
													{this.state.isCheckedVA ? (
														<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('VaFfFin2')} keyboardType="numeric" style={[BuyerStyle.width100, { width: '75%' }]} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({ VaFfFin2: this.onChange(value) })} value={this.state.VaFfFin2.toString()} />) : (
															<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('VaFfFin', this.state.VaFfFin1Height)} keyboardType="numeric" style={[BuyerStyle.width100, { width: '75%' }]} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({ VaFfFin: this.onChange(value) })} value={this.delimitNumbers(this.state.VaFfFin)} />
														)}
												</View>
												<View style={[BuyerStyle.fullunderline, { width: '78%' }]}></View>
											</View>

										</View>
									)}
									{renderIf(this.state.tab == 'USDA')(
										<View style={BuyerStyle.fieldcontainer} onLayout={(event) => this.measureView(event, 'UsdaMipFinance1Height')}>
											<View style={BuyerStyle.fieldcontainersmallfield}>
												<View style={BuyerStyle.alignrightinput}>
													<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('UsdaMipFinance1', this.state.UsdaMipFinance1Height)} keyboardType="numeric" style={[BuyerStyle.width100, { width: '75%' }]} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({ UsdaMipFinance1: this.onChange(value) })} value={this.delimitNumbers(this.state.UsdaMipFinance1)} />
												</View>
												<View style={[BuyerStyle.fullunderline, { width: '78%' }]}></View>
											</View>
											<View style={BuyerStyle.fieldcontainersmallfield}>
												<Text style={BuyerStyle.fieldcontainerlable}>{STRINGS.t('FHA_Mip')} </Text>
											</View>
											<View style={BuyerStyle.fieldcontainersmallfield}>
												<Text style={BuyerStyle.fieldcontainerlable}>{STRINGS.t('Fin')}</Text>
											</View>
											<View style={BuyerStyle.fieldcontainersmallfield}>
												<CheckBox containerStyle={{ backgroundColor: '#ffffff', borderWidth: 0 }} center checkedColor='#CECECE' checked={this.state.isCheckedUSDA} onPress={this.handlePressUSDACheckedBox} />
											</View>
											<View style={BuyerStyle.fieldcontainersmallfield}>
												<View style={BuyerStyle.alignrightinput}>
													<Text style={BuyerStyle.alignCenter}>$ </Text>
													{this.state.isCheckedUSDA ? (
														<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('UsdaMipFinance2', this.state.UsdaMipFinance1Height)} keyboardType="numeric" style={[BuyerStyle.width100, { width: '75%' }]} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({ UsdaMipFinance2: this.onChange(value) })} value={this.delimitNumbers(this.state.UsdaMipFinance2)} />) : (
															<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('UsdaMipFinance', this.state.UsdaMipFinance1Height)} keyboardType="numeric" style={[BuyerStyle.width100, { width: '75%' }]} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({ UsdaMipFinance: this.onChange(value) })} value={this.delimitNumbers(this.state.UsdaMipFinance)} />
														)}
												</View>
												<View style={[BuyerStyle.fullunderline, { width: '78%' }]}></View>
											</View>
										</View>
									)}
									<View style={[BuyerStyle.fullunderline, { marginTop: 20 }]}></View>
									<View style={[BuyerStyle.fieldcontainer, { marginTop: 20 }]}>
										<View style={BuyerStyle.costcontainer}>
											<Text style={BuyerStyle.costprepaidamttext}>{STRINGS.t('cost')}</Text>
											<Text style={[BuyerStyle.width100, { width: '90%', marginTop: 20 }]}>{this.delimitNumbers(this.state.twoMonthsPmi1)}</Text>
										</View>
										<View style={BuyerStyle.amountcontainer} onLayout={(event) => this.measureView(event, 'costOtherHeight')}>
											<Text style={BuyerStyle.costamttext}>{STRINGS.t('amount')}</Text>
											<View style={{ flexDirection: 'row', width: '90%', marginTop: 20 }}>
												<Text style={BuyerStyle.alignCenter}>
													$
									</Text>
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('costOther', this.state.costOtherHeight)} keyboardType="numeric" style={[BuyerStyle.width100, { width: '90%' }]} underlineColorAndroid='transparent' onEndEditing={(event) => this.updateFormField(event.nativeEvent.text, 'costOther', this.calTotalPrepaidItems)} onChangeText={(value) => this.setState({ costOther: this.onChange(value), costOtherFixed: true })} value={this.delimitNumbers(this.state.costOther)} />
											</View>
											<View style={[BuyerStyle.fullunderline, { width: '90%' }]}></View>
										</View>
									</View>
								</ScrollView>
							</View>
						</View>
					)}
					{renderIf(this.state.footer_tab == 'payment')(
						<View style={{ height: '100%', width: '100%' }}>
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
									<View style={[BuyerStyle.scrollable_container_child, { marginTop: 10 }]}>
										<View style={BuyerStyle.title_justify}>
											<Text style={BuyerStyle.text_style}>{STRINGS.t('principal_and_interest')}</Text>
										</View>
										<View style={{ width: '30%', justifyContent: 'center' }}>
											<View style={BuyerStyle.alignrightinput}>
												<Text style={[BuyerStyle.alignCenter, { textAlign: 'right' }]}>$ {this.delimitNumbers(this.state.principalRate)}</Text>
											</View>
										</View>
									</View>
									<View style={[BuyerStyle.scrollable_container_child, { marginTop: 20 }]}>
										<View style={BuyerStyle.title_justify}>
											<Text style={BuyerStyle.text_style}>{STRINGS.t('real_estate_taxes')}</Text>
										</View>
										<View style={{ width: '30%', justifyContent: 'center' }}>
											<View style={BuyerStyle.alignrightinput}>
												<Text style={[BuyerStyle.alignCenter, { textAlign: 'right' }]}>$ {this.delimitNumbers(this.state.realEstateTaxesRes)}</Text>
											</View>
										</View>
									</View>
									<View style={[BuyerStyle.scrollable_container_child, { marginTop: 20 }]}>
										<View style={BuyerStyle.title_justify}>
											<Text style={BuyerStyle.text_style}>{STRINGS.t('home_owners_insurance')}</Text>
										</View>
										<View style={{ width: '30%', justifyContent: 'center' }}>
											<View style={BuyerStyle.alignrightinput}>
												<Text style={[BuyerStyle.alignCenter, { textAlign: 'right' }]}>$ {this.delimitNumbers(this.state.homeOwnerInsuranceRes)}</Text>
											</View>
										</View>
									</View>
									<View style={[BuyerStyle.fieldcontainer, { marginTop: 20 }]} onLayout={(event) => this.measureView(event, 'rateValueHeight')}>
										<View style={BuyerStyle.fieldcontainersmallfield}>
											<View style={BuyerStyle.alignrightinput}>
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('rateValue', this.state.rateValueHeight)} keyboardType="numeric" style={[BuyerStyle.width100, { width: '75%' }]} underlineColorAndroid='transparent' onEndEditing={(event) => this.updateFormField(event.nativeEvent.text, 'rateValue', this.changeMortgageInsVal)} onChangeText={(value) => this.setState({ rateValue: this.onChange(value) })} value={this.delimitNumbers(this.state.rateValue)} />
											</View>
											<View style={[BuyerStyle.fullunderline, { width: '78%' }]}></View>
										</View>
										<View style={BuyerStyle.fieldcontainerlargefield}>
											<Text style={BuyerStyle.fieldcontainerlable}>{STRINGS.t('mortgage_ins')}</Text>
										</View>
										<View style={BuyerStyle.fieldcontainersmallfieldLessWidth}>
										</View>
										<View style={BuyerStyle.fieldcontainersmallfield}>
											<View style={BuyerStyle.alignrightinput}>
												<Text style={BuyerStyle.alignCenter}>$ </Text>
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('monthlyRate', this.state.rateValueHeight)} keyboardType="numeric" style={[BuyerStyle.width100, { width: '75%' }]} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({ monthlyRate: this.onChange(value) })} value={this.delimitNumbers(this.state.monthlyRate)} />
											</View>
											<View style={[BuyerStyle.fullunderline, { width: '78%' }]}></View>
										</View>
									</View>
									{renderIf(this.state.tab == 'CONV')(
										<View style={BuyerStyle.fieldcontainer}>
											<View style={BuyerStyle.fieldcontainerlargefieldPrepaid}>
												<Text style={BuyerStyle.fieldcontainerlable}>{STRINGS.t('p_and_1_2nd_td')}</Text>
											</View>
											<View style={BuyerStyle.fieldcontainersmallfield}></View>
											<View style={BuyerStyle.fieldcontainersmallfield}>
												<View style={BuyerStyle.alignrightinput}>
													<Text style={BuyerStyle.alignCenter}>$</Text>
													<TextInput selectTextOnFocus={true} allowFontScaling={false} keyboardType="numeric" style={[BuyerStyle.width100, { width: '85%' }]} underlineColorAndroid='transparent' editable={false} value={this.delimitNumbers(this.state.pnintrate)} />
												</View>
											</View>
										</View>
									)}


									<View style={[BuyerStyle.fieldcontainer, { marginTop: 20, marginBottom: this.state.focusElementMargin }]} onLayout={(event) => this.measureView(event, 'paymentAmount1Height')}>
										<View style={BuyerStyle.costcontainer}>
											<Text style={BuyerStyle.costprepaidamttext}>{STRINGS.t('monthly_expenses')}</Text>
											<Text style={[BuyerStyle.width100, { width: '90%', marginTop: 20 }]}>{this.state.monthlyExpensesOther1.toString()}</Text>
											<Text style={[BuyerStyle.width100, { width: '90%', marginTop: 20 }]}>{this.state.monthlyExpensesOther2.toString()}</Text>
										</View>
										<View style={BuyerStyle.amountcontainer}>
											<Text style={BuyerStyle.costamttext}>{STRINGS.t('amount')}</Text>
											<View style={{ flexDirection: 'row', width: '90%', marginTop: 20 }} onLayout={(event) => this.measureView(event, 'paymentAmount1Height')}>
												<Text style={BuyerStyle.alignCenter}>
													$
										</Text>
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('paymentAmount1', this.state.paymentAmount1Height)} keyboardType="numeric" style={[BuyerStyle.width100]} underlineColorAndroid='transparent' onEndEditing={(event) => this.updateFormField(event.nativeEvent.text, 'paymentAmount1', this.calTotalMonthlyPayment)} onChangeText={(value) => this.setState({ paymentAmount1: this.onChange(value), paymentAmount1Fixed: true })} value={this.delimitNumbers(this.state.paymentAmount1)} />
											</View>
											<View style={[BuyerStyle.fullunderline, { width: '90%' }]}></View>
											<View style={{ flexDirection: 'row', width: '90%', marginTop: 20 }}>
												<Text style={BuyerStyle.alignCenter}>
													$
										</Text>
												<CustomTextInput allowFontScaling={false} customKeyboardType="hello" selectTextOnFocus={true} onKeyPress={() => this.onFocus('paymentAmount2', this.state.paymentAmount1Height)} keyboardType="numeric" style={[BuyerStyle.width100]} underlineColorAndroid='transparent' onEndEditing={(event) => this.updateFormField(event.nativeEvent.text, 'paymentAmount2', this.calTotalMonthlyPayment)} onChangeText={(value) => this.setState({ paymentAmount2: this.onChange(value), paymentAmount2Fixed: true })} value={this.delimitNumbers(this.state.paymentAmount2)} />

											</View>
											<View style={[BuyerStyle.fullunderline, { width: '90%' }]}></View>
										</View>
									</View>
								</ScrollView>
							</View>
						</View>
					)}

					<View style={BuyerStyle.lineView}></View>
					<View style={BuyerStyle.header_bg}>
						<View style={CustomStyle.header_view}>
							<TouchableOpacity style={CustomStyle.back_icon_parent} onPress={() => this.changeFooterTab('refinance')}>
								{renderIf(this.state.footer_tab != 'refinance')(
									<Image style={BuyerStyle.footer_icon} source={Images.refinance} />
								)}
								{renderIf(this.state.footer_tab == 'refinance')(
									<Image style={BuyerStyle.footer_icon} source={Images.refinance_highlight} />
								)}
							</TouchableOpacity>
							<View style={BuyerStyle.verticalLineForSegment}></View>
							<TouchableOpacity style={CustomStyle.back_icon_parent} onPress={() => this.changeFooterTab('closing_cost')}>
								{renderIf(this.state.footer_tab != 'closing_cost')(
									<Image style={BuyerStyle.footer_icon} source={Images.closing_cost} />
								)}
								{renderIf(this.state.footer_tab == 'closing_cost')(
									<Image style={BuyerStyle.footer_icon} source={Images.closing_cost_highlight} />
								)}
							</TouchableOpacity>
							<View style={BuyerStyle.verticalLineForSegment}></View>
							<TouchableOpacity style={CustomStyle.back_icon_parent} onPress={() => this.changeFooterTab('prepaid')} >
								{renderIf(this.state.footer_tab != 'prepaid')(
									<Image style={BuyerStyle.footer_icon} source={Images.prepaid} />
								)}
								{renderIf(this.state.footer_tab == 'prepaid')(
									<Image style={BuyerStyle.footer_icon} source={Images.prepaid_highlight} />
								)}
							</TouchableOpacity>
							<View style={BuyerStyle.verticalLineForSegment}></View>
							<TouchableOpacity style={CustomStyle.back_icon_parent} onPress={() => this.changeFooterTab('payment')}>
								{renderIf(this.state.footer_tab != 'payment')(
									<Image style={BuyerStyle.footer_icon} source={Images.payment} />
								)}
								{renderIf(this.state.footer_tab == 'payment')(
									<Image style={BuyerStyle.footer_icon} source={Images.payment_highlight} />
								)}
							</TouchableOpacity>
						</View>
					</View>
					<View>
						<Modal
							animationType="slide"
							transparent={false}
							visible={this.state.modalVisible}
							onRequestClose={() => { alert("Modal has been closed.") }}
						>
							<View style={BuyerStyle.HeaderContainer}>
								<Image style={BuyerStyle.HeaderBackground} source={Images.header_background}></Image>
								<TouchableOpacity style={{ width: '20%', justifyContent: 'center' }} onPress={() => { this.setModalVisible(!this.state.modalVisible) }}>
									<Text style={[BuyerStyle.headerbtnText]}>{STRINGS.t('Cancel')}</Text>
								</TouchableOpacity>
								<Text style={BuyerStyle.header_title}>{STRINGS.t('Refinance_Closing_Cost')}</Text>
							</View>
							<View style={{ marginTop: 5, marginBottom: 80 }}>
								<View style={BuyerStyle.listcontainer}>
									<View style={{ paddingLeft: 5, paddingRight: 5 }}>
										<View style={BuyerStyle.backgroundViewContainerSearch}>
											<TextInput placeholder='Type Keyword....'
												underlineColorAndroid='transparent'
												style={BuyerStyle.textInputSearch}
												onChangeText={(value) => this.setState({ keyword: value })}
												value={this.state.keyword}
											/>
											<TouchableOpacity style={CustomStyle.back_icon_parent} onPress={() => this.SearchFilterFunction(this.state.keyword)}>
												<View style={BuyerStyle.restoreview}>
													<Text style={BuyerStyle.restoreviewtext}>{'Search'}</Text>
												</View>
											</TouchableOpacity>
										</View>
										<View style={[BuyerStyle.underlinebold, { marginBottom: 10 }]}></View>
									</View>
									<ScrollView>
										{renderIf(this.state.emptCheck == false)(
											<ListView dataSource={this.state.dataSource} renderRow={this.renderRow} />
										)}
										{renderIf(this.state.emptCheck == true)(
											<Text style={{ alignSelf: 'center' }}>No Data Found.</Text>
										)}
									</ScrollView>
								</View>
							</View>
						</Modal>

						<Modal
							animationType="slide"
							transparent={false}
							visible={this.state.emailModalVisible}
							onRequestClose={() => { alert("Modal has been closed.") }}
						>
							<ScrollView scrollEnabled={true} showsVerticalScrollIndicator={true} keyboardShouldPersistTaps="always" keyboardDismissMode='on-drag'>
								<View style={BuyerStyle.HeaderContainer}>
									<Image style={BuyerStyle.HeaderBackground} source={Images.header_background}></Image>
									<TouchableOpacity style={{ width: '20%', justifyContent: 'center' }} onPress={() => { this.setEmailModalVisible(!this.state.emailModalVisible) }}>
										<Text style={[BuyerStyle.headerbtnText]}>{STRINGS.t('Cancel')}</Text>
									</TouchableOpacity>
									<Text style={BuyerStyle.header_title}>{STRINGS.t('Email')}</Text>
									<TouchableOpacity style={{ width: '20%', justifyContent: 'center' }} onPress={() => { this.sendEmail() }}>
										<Text style={[BuyerStyle.headerbtnText, { alignSelf: 'flex-end' }]}>{STRINGS.t('EmailSend')}</Text>
									</TouchableOpacity>
								</View>
								<View>
									<View style={{ flexDirection: 'column' }}>
										<View style={BuyerStyle.scrollable_container_child_center}>
											<View style={{ width: '10%', justifyContent: 'center' }}>
												<Text style={BuyerStyle.text_style}>
													{STRINGS.t('EmailTo')}:
												</Text>
											</View>
											<View style={{ width: '90%', flexDirection: 'row' }}>
												<AutoTags
													returnKeyType="next"
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
											<View style={{ width: '95%', flexDirection: 'row' }}>
												<TextInput placeholder='Note' selectTextOnFocus={true} underlineColorAndroid='transparent' style={{ width: '100%', height: 60 }} multiline={true} onChangeText={(value) => this.setState({ content: value })} />
											</View>
										</View>
										<View style={BuyerStyle.lineViewEmailModal}></View>
									</View>
								</View>
							</ScrollView>
							<View style={BuyerStyle.header_bg}>
								<View style={CustomStyle.header_view}>
									<TouchableOpacity style={CustomStyle.back_icon_parent} onPress={() => this.setModalAddressesVisible(!this.state.modalAddressesVisible)}>
										<Image style={BuyerStyle.footer_icon_email_modal} source={Images.message} />
									</TouchableOpacity>
									<TouchableOpacity style={CustomStyle.back_icon_parent} onPress={() => this.openpopup("image")}>
										<Image style={BuyerStyle.footer_icon_email_modal} source={Images.camera} />
									</TouchableOpacity>
									<TouchableOpacity style={CustomStyle.back_icon_parent} onPress={() => this.openpopup("video")} >
										<Image style={BuyerStyle.footer_icon_email_modal} source={Images.video_camera} />
									</TouchableOpacity>
								</View>
							</View>

							<PopupDialogEmail dialogTitle={<View style={BuyerStyle.dialogtitle}><Text style={BuyerStyle.dialogtitletext}>{STRINGS.t('Upload')} {this.state.popupAttachmentType}</Text></View>} dialogStyle={{ width: '80%' }} ref={(popupDialogEmail) => { this.popupDialogEmail = popupDialogEmail; }}>
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
										<TouchableOpacity style={BuyerStyle.buttonContainer} onPress={() => { this.popupDialog.dismiss() }}>
											<Text style={BuyerStyle.style_btnLogin}> {STRINGS.t('Cancel')}</Text>
										</TouchableOpacity>
									</View>
								)}
								{renderIf(this.state.popupAttachmentType == 'video')(
									<View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
										<View>
											<TouchableOpacity onPress={() => { this.setVideoModalVisible(!this.state.videoModalVisible) }}>
												<View style={BuyerStyle.dialogbtn}>
													<Text style={BuyerStyle.dialogbtntext}>
														{STRINGS.t('Record_Video')}
													</Text>
												</View>
											</TouchableOpacity>
										</View>
										<View>
											<TouchableOpacity style={BuyerStyle.buttonContainerRecordVideo} onPress={() => { this.popupDialog.dismiss() }}>
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
							onRequestClose={() => { alert("Modal has been closed.") }}
						>
							<View style={{ elevation: 11, height: '100%', width: '100%' }}>
								<Image style={CustomStyle.header_bg} source={Images.header_background}>
									<View style={BuyerStyle.HeaderContainer}>
										<Image style={BuyerStyle.HeaderBackground} source={Images.header_background}></Image>
										<TouchableOpacity style={{ width: '20%', justifyContent: 'center' }} onPress={() => { this.setVideoModalVisible(!this.state.videoModalVisible) }}>
											<Text style={[BuyerStyle.headerbtnText]}>{STRINGS.t('Cancel')}</Text>
										</TouchableOpacity>
										<Text style={BuyerStyle.header_title}>{STRINGS.t('Email')}</Text>
										{recordButton}
									</View>
								</Image>
								<View style={styles.container}>
									<Camera
										ref={(cam) => {
											this.camera = cam;
										}}
										style={styles.preview}
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
							onRequestClose={() => { alert("Modal has been closed.") }}
						>
							<View style={BuyerStyle.HeaderContainer}>
								<Image style={BuyerStyle.HeaderBackground} source={Images.header_background}></Image>
								<TouchableOpacity style={{ width: '20%', justifyContent: 'center' }}>
								</TouchableOpacity>
								<Text style={BuyerStyle.header_title}>{STRINGS.t('Cost_First')}</Text>
								<TouchableOpacity style={{ width: '20%', justifyContent: 'center' }} onPress={() => { this.setModalAddressesVisible(!this.state.modalAddressesVisible) }}>
									<Text style={[BuyerStyle.headerbtnText, { alignSelf: 'flex-end' }]}>{'Ok'}</Text>
								</TouchableOpacity>
							</View>
							<View>
								<View>
									<SelectMultiple
										items={this.state.emailAddrsList}
										selectedItems={this.state.selectedAddresses}
										onSelectionsChange={this.onSelectionsChange} />
								</View>
							</View>
						</Modal>
					</View>
					<PopupDialog dialogTitle={<View style={BuyerStyle.dialogtitle}><Text style={BuyerStyle.dialogtitletext}>{STRINGS.t('Print_Format')}</Text></View>} dialogStyle={{ width: '80%' }} containerStyle={{ elevation: 10 }} ref={(popupDialog) => { this.popupDialog = popupDialog; }}>
						{renderIf(this.state.popupType == 'print')(
							<View>
								<TouchableOpacity style={{ alignItems: 'center', marginTop: 25 }} onPress={() => { this.printPDF("detailed") }}>
									<View style={BuyerStyle.dialogbtn}>
										<Text style={BuyerStyle.dialogbtntext}>
											{STRINGS.t('Print_Detailed_Estimate')}
										</Text>
									</View>
								</TouchableOpacity>
								<TouchableOpacity onPress={() => { this.printPDF("cdtc") }}>
									<View style={BuyerStyle.dialogbtn}>
										<Text style={BuyerStyle.dialogbtntext}>
											{STRINGS.t('Print_Buyer_Cdtc')}
										</Text>
									</View>
								</TouchableOpacity>
								<TouchableOpacity onPress={() => { this.printPDF("trid") }}>
									<View style={BuyerStyle.dialogbtn}>
										<Text style={BuyerStyle.dialogbtntext}>
											{STRINGS.t('Print_Buyer_Trid')}
										</Text>
									</View>
								</TouchableOpacity>
								<TouchableOpacity style={BuyerStyle.buttonContainerForRefi} onPress={() => { this.popupDialog.dismiss() }} onPress={() => { this.popupDialog.dismiss() }}>
									<Text style={BuyerStyle.style_btnLogin}> {STRINGS.t('Cancel')}</Text>
								</TouchableOpacity>
							</View>
						)}

						{renderIf(this.state.popupType == 'email')(
							<View>
								<TouchableOpacity style={{ alignItems: 'center', marginTop: 25 }} onPress={() => { this.setEmailModalQuickDetailVisible(!this.state.emailModalVisible, this.setState({ emailType: 'detailed' }), this.popupDialog.dismiss()) }}>
									<View style={BuyerStyle.dialogbtn}>
										<Text style={BuyerStyle.dialogbtntext}>
											{STRINGS.t('Email_Detailed_Estimate')}
										</Text>
									</View>
								</TouchableOpacity>
								<TouchableOpacity onPress={() => { this.setEmailModalVisible(!this.state.emailModalVisible, this.setState({ emailType: 'cdtc', dropdownType: 'cdtc' }), this.popupDialog.dismiss()) }}>
									<View style={BuyerStyle.dialogbtn}>
										<Text style={BuyerStyle.dialogbtntext}>
											{STRINGS.t('Email_Buyer_Cdtc')}
										</Text>
									</View>
								</TouchableOpacity>
								<TouchableOpacity onPress={() => { this.setEmailModalVisible(!this.state.emailModalVisible, this.setState({ emailType: 'trid', dropdownType: 'trid' }), this.popupDialog.dismiss()) }}>
									<View style={BuyerStyle.dialogbtn}>
										<Text style={BuyerStyle.dialogbtntext}>
											{STRINGS.t('Email_Buyer_Trid')}
										</Text>
									</View>
								</TouchableOpacity>
								<TouchableOpacity style={BuyerStyle.buttonContainerForRefi} onPress={() => { this.popupDialog.dismiss() }}>
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
										<TouchableOpacity onPress={() => { this.setEmailModalVisible(!this.state.emailModalVisible) }}>
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
								<TouchableOpacity style={BuyerStyle.buttonContainer} onPress={() => { this.popupDialog.dismiss() }}>
									<Text style={BuyerStyle.style_btnLogin}> {STRINGS.t('Cancel')}</Text>
								</TouchableOpacity>
							</View>
						)}


					</PopupDialog>

					<PopupDialog dialogTitle={<View style={BuyerStyle.dialogtitle}><Text style={BuyerStyle.dialogtitletext}>{STRINGS.t('Add_New_Contact_Address')}</Text></View>} dialogStyle={{ width: '80%' }} containerStyle={{ elevation: 10 }} ref={(popupDialogAddEmailAddress) => { this.popupDialogAddEmailAddress = popupDialogAddEmailAddress; }}>
						<View>
							<View style={BuyerStyle.contactAddressModalInputField}>
								<TextInput selectTextOnFocus={true} autoCapitalize='words' style={BuyerStyle.inputFieldsDesignLayout} placeholder='Name' underlineColorAndroid='transparent' onChangeText={(value) => this.setState({ newEmailContactName: value })} value={this.state.newEmailContactName} />
							</View>
							<View style={BuyerStyle.contactAddressModalInputField}>
								<TextInput ref="newEmailAddress" selectTextOnFocus={true} style={BuyerStyle.inputFieldsDesignLayout} placeholderTextColor={this.state.newEmailAddressError == "" ? "#999999" : "red"} placeholder={this.state.newEmailAddressError == "" ? STRINGS.t('email_address') : this.state.newEmailAddressError} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({ newEmailAddress: value })} keyboardType="email-address" value={this.state.newEmailAddress} />

							</View>

							<View style={BuyerStyle.contactAddressModalInputField}>
								<TextInput keyboardType="phone-pad" onChangeText={(value) => this.setState({ contact_number: this.onChange(value) })} onEndEditing={(event) => this.updatePhoneNumberFormat(event.nativeEvent.text)} value={this.state.contact_number} selectTextOnFocus={true} style={BuyerStyle.inputFieldsDesignLayout} placeholder='Contact Number' underlineColorAndroid='transparent' />
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
			showable = <MessageComponent tagInputValue={this.state.tagInputValue} cancelEmailPopup={this.cancelEmailPopup.bind(this)} textMsgPdfArray={this.state.textMsgPdfArray} emailModalVisible={true} to_email="" to_email_default="" text_message={this.state.text_message} />
		} else {
			showable = <View style={{ flex: 1 }}>
				<View style={{ flex: 2 }}>
					<View style={BuyerStyle.HeaderContainer}>
						<Image style={BuyerStyle.HeaderBackground} source={Images.header_background}></Image>
						<TouchableOpacity style={{ width: '20%' }} onPress={this.onBackHomePress.bind(this)}>
							<Image style={BuyerStyle.back_icon} source={Images.back_icon} />
						</TouchableOpacity>
						<Text style={BuyerStyle.header_title}>{STRINGS.t('Refinance_Closing_Cost')}</Text>

						<View style={{ alignItems: 'flex-start', width: '20%', paddingRight: 20 }}>

						</View>
					</View>
				</View>
				<View style={{ flex: 6, justifyContent: 'center', alignItems: 'center' }}>
					<Image style={{ width: '60%', height: 160, justifyContent: 'center', alignItems: 'center' }} source={Images.internetConnectionOffIcon} />
					<View style={{ flexDirection: 'column', marginTop: 10 }}>
						<Text style={{ justifyContent: 'center', alignItems: 'center' }}>Please check your internet connection.</Text>
					</View>
				</View>
				<View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
				</View>
			</View>


		}


		return (
			<View style={{ flex: 1 }}>
				{showable}
			</View>
			// (this.state.orientation == 'portrait') ? ( 

			// 	) : (

			// 		//Landscape View
			// 	<View style={Styles.landscapetopcontainer}>
			// 		<View style={Styles.landscapeHeader}>
			// 			<Image style={Styles.landscapeHeaderBackground} source={Images.header_background}></Image>
			// 			<TouchableOpacity style={{width:'10%',height:50}} onPress={this.onLogoutPress.bind(this)}>
			// 				<Image style={Styles.landscapeBack_icon} source={Images.back_icon}/>
			// 			</TouchableOpacity>
			// 			<TouchableOpacity style={{width:'20%'}}>
			// 				<View style={Styles.landscapesubheading}>
			// 					<Text style={Styles.landscapesubheadingtext}>{STRINGS.t('Buyers')}</Text>
			// 				</View>
			// 			</TouchableOpacity>
			// 			<TouchableOpacity style={{width:'20%'}}>
			// 				<View style={Styles.landscapesubheading}>
			// 					<Text style={Styles.landscapesubheadingtext}>{STRINGS.t('Sellers')}</Text>
			// 				</View>
			// 			</TouchableOpacity>
			// 			<TouchableOpacity style={{width:'20%'}}>
			// 				<View style={Styles.landscapesubheading}>
			// 					<Text style={Styles.landscapesubheadingtext}>{STRINGS.t('Netfirst')}</Text>
			// 				</View>
			// 			</TouchableOpacity>
			// 			<TouchableOpacity style={{width:'20%'}}>
			// 				<View style={[Styles.landscapesubheading, Styles.blueheadlandscape]}>
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
			// 						<Text style={Styles.landscapetitleText}>{STRINGS.t('Refinance_Closing_Cost')}</Text>
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
			// 									<TextInput selectTextOnFocus={ true } onFocus={() => this.onFocus('fee1')} placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>																						
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabelbold}>{STRINGS.t('Prepared_For')}</Text>	
			// 									<View style={Styles.landscapefieldvaluebox}>
			// 									<TextInput selectTextOnFocus={ true } onFocus={() => this.onFocus('fee1')} placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>																						
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabelbold}>{STRINGS.t('Address')}</Text>	
			// 									<View style={Styles.landscapefieldvaluebox}>
			// 									<TextInput selectTextOnFocus={ true } onFocus={() => this.onFocus('fee1')} placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>																						
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabelbold}>{STRINGS.t('City')}</Text>	
			// 									<View style={Styles.landscapefieldvaluebox}>
			// 									<TextInput selectTextOnFocus={ true } onFocus={() => this.onFocus('fee1')} placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>	
			// 								<View style={Styles.landscapehalfsizefield}>
			// 									<View style={Styles.landscapefieldhalfcontainer}>	
			// 										<Text style={Styles.landscapefieldlabelbold}>{STRINGS.t('State')}</Text>	
			// 										<View style={Styles.landscapefieldvaluebox}>
			// 										<TextInput selectTextOnFocus={ true } onFocus={() => this.onFocus('fee1')} placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 										</View>									
			// 									</View>	
			// 									<View style={Styles.landscapefieldhalfcontainer}>	
			// 										<Text style={[Styles.landscapefieldlabelbold, {textAlign:'center'}]}>{STRINGS.t('Zip')}</Text>	
			// 										<View style={Styles.landscapefieldvaluebox}>
			// 										<TextInput selectTextOnFocus={ true } onFocus={() => this.onFocus('fee1')} placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 										</View>									
			// 									</View>		
			// 								</View>									
			// 							</View>
			// 							<View style={Styles.landscapedataBoxHeading}>
			// 								<Text style={Styles.landscapedataboxheadingtext}>{STRINGS.t('Loan_Information')}</Text>
			// 							</View>
			// 							<View style={Styles.landscapedataBox}>																						
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabelbold}>{STRINGS.t('Estimated_Appraised')}</Text>	
			// 									<View style={Styles.landscapefieldvaluebox}>
			// 									<TextInput selectTextOnFocus={ true } onFocus={() => this.onFocus('fee1')} placeholder='0.00' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>																						
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('Buyer_Loan_Type')}</Text>	
			// 									<View style={Styles.landscapefieldvaluebox}>
			// 									<TextInput selectTextOnFocus={ true } onFocus={() => this.onFocus('fee1')} placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>		
			// 								<View style={Styles.landscapefieldcontainer}>
			// 									<View style={Styles.landscapetriplefieldlabel}>
			// 									</View>
			// 									<View style={{width:'5%'}}></View>	
			// 									<Text style={Styles.landscapebalancerate}>{STRINGS.t('1_loan')}</Text>
			// 									<View style={{width:'5%'}}></View>	
			// 									<Text style={Styles.landscapebalancerate}>{STRINGS.t('2_loan')}</Text>	
			// 								</View>
			// 								<View style={Styles.landscapefieldcontainer}>
			// 									<View style={Styles.landscapetriplefieldlabel}>
			// 										<Text style={Styles.landscapenormalfulltext}>{STRINGS.t('loan_to_value')}:</Text>
			// 									</View>	
			// 									<Text style={[Styles.landscapefieldval,{width:'5%'}]}>%</Text>	
			// 									<TextInput selectTextOnFocus={ true } onFocus={() => this.onFocus('fee1')} placeholder='John Ace' keyboardType="numeric" style={Styles.landscapetriplefieldval} underlineColorAndroid='transparent'/>
			// 									<Text style={[Styles.landscapefieldval,{width:'5%'}]}>%</Text>	
			// 									<TextInput selectTextOnFocus={ true } onFocus={() => this.onFocus('fee1')} placeholder='John Ace' keyboardType="numeric" style={Styles.landscapetriplefieldval} underlineColorAndroid='transparent'/>	
			// 								</View>																				
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('rate')}</Text>
			// 									<Text style={Styles.landscape20percenttext}>%</Text>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<TextInput selectTextOnFocus={ true } onFocus={() => this.onFocus('fee1')} placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>																						
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('term')}</Text>
			// 									<Text style={Styles.landscape20percenttext}></Text>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<TextInput selectTextOnFocus={ true } onFocus={() => this.onFocus('fee1')} placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>																					
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('New_Ltv_Amt')}</Text>
			// 									<Text style={Styles.landscape20percenttext}>$</Text>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<TextInput selectTextOnFocus={ true } onFocus={() => this.onFocus('fee1')} placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
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
			// 									<TextInput selectTextOnFocus={ true } onFocus={() => this.onFocus('fee1')} placeholder='John Ace' keyboardType="numeric" style={Styles.landscapetriplefieldval} underlineColorAndroid='transparent'/>
			// 									<Text style={[Styles.landscapefieldval,{width:'5%'}]}>%</Text>	
			// 									<TextInput selectTextOnFocus={ true } onFocus={() => this.onFocus('fee1')} placeholder='John Ace' keyboardType="numeric" style={Styles.landscapetriplefieldval} underlineColorAndroid='transparent'/>	
			// 								</View>	
			// 								<View style={Styles.landscapefieldcontainer}>
			// 									<View style={Styles.landscapetriplefieldlabel}>
			// 										<Text style={Styles.landscapenormalfulltext}>{STRINGS.t('existing_second')}:</Text>
			// 									</View>	
			// 									<Text style={[Styles.landscapefieldval,{width:'5%'}]}>$</Text>	
			// 									<TextInput selectTextOnFocus={ true } onFocus={() => this.onFocus('fee1')} placeholder='John Ace' keyboardType="numeric" style={Styles.landscapetriplefieldval} underlineColorAndroid='transparent'/>
			// 									<Text style={[Styles.landscapefieldval,{width:'5%'}]}>%</Text>	
			// 									<TextInput selectTextOnFocus={ true } onFocus={() => this.onFocus('fee1')} placeholder='John Ace' keyboardType="numeric" style={Styles.landscapetriplefieldval} underlineColorAndroid='transparent'/>	
			// 								</View>	
			// 								<View style={Styles.landscapefieldcontainer}>
			// 									<View style={Styles.landscapetriplefieldlabel}>
			// 										<Text style={Styles.landscapenormalfulltext}>{STRINGS.t('other')}:</Text>
			// 									</View>	
			// 									<Text style={[Styles.landscapefieldval,{width:'5%'}]}>$</Text>	
			// 									<TextInput selectTextOnFocus={ true } onFocus={() => this.onFocus('fee1')} placeholder='John Ace' keyboardType="numeric" style={Styles.landscapetriplefieldval} underlineColorAndroid='transparent'/>
			// 									<Text style={[Styles.landscapefieldval,{width:'5%'}]}>%</Text>	
			// 									<TextInput selectTextOnFocus={ true } onFocus={() => this.onFocus('fee1')} placeholder='John Ace' keyboardType="numeric" style={Styles.landscapetriplefieldval} underlineColorAndroid='transparent'/>	
			// 								</View>																							
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<TextInput selectTextOnFocus={ true } onFocus={() => this.onFocus('fee1')} placeholder='John Ace' keyboardType="numeric" style={[Styles.landscapetriplefieldval,{width:'25%'}]} underlineColorAndroid='transparent'/>
			// 									<Text style={Styles.landscape40percenttext}>  {STRINGS.t('days_interest')}</Text>	
			// 									<Text style={[Styles.landscapefieldval,{width:'5%'}]}>$</Text>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<Text style={Styles.landscapefieldval}>0.00</Text>
			// 									</View>									
			// 								</View>																		
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('Est_Closing_Month')}</Text>	
			// 									<Text style={Styles.landscape20percenttext}></Text>
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 										<DatePicker style={Styles.landscapefielddateval} showIcon={false} date={this.state.date} mode="date" placeholder="select date" format="YYYY-MM-DD" minDate={this.state.date} confirmBtnText="Confirm" cancelBtnText="Cancel" customStyles={{dateInput: {borderWidth:0}}} onDateChange={(date) => this.changeDate(date)} />
			// 									</View>									
			// 								</View>	
			// 								<View style={[Styles.fullunderline, {marginTop:10}]}></View>
			// 								<View style={Styles.landscapehalfsizefield}>
			// 									<Text style={[Styles.landscapetexthead, {marginTop:5,width:'70%'}]}>{STRINGS.t('total')}</Text>
			// 									<Text style={[Styles.landscapetexthead, {marginTop:5}]}>0.00</Text>	
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
			// 									<Text style={Styles.landscape20percenttext}>$</Text>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<TextInput selectTextOnFocus={ true } onFocus={() => this.onFocus('fee1')} placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>																					
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('Title_Insurance')}</Text>
			// 									<Text style={Styles.landscape20percenttext}>$</Text>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<TextInput selectTextOnFocus={ true } onFocus={() => this.onFocus('fee1')} placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>	
			// 								<View style={Styles.landscapefieldcontainer}>
			// 									<View style={Styles.landscapetriplefieldlabel}>
			// 										<Text style={Styles.landscapenormalfulltext}>{STRINGS.t('Discount')}</Text>
			// 									</View>	
			// 									<Text style={[Styles.landscapefieldval,{width:'5%'}]}>%</Text>	
			// 									<TextInput selectTextOnFocus={ true } onFocus={() => this.onFocus('fee1')} placeholder='John Ace' keyboardType="numeric" style={Styles.landscapetriplefieldval} underlineColorAndroid='transparent'/>
			// 									<Text style={[Styles.landscapefieldval,{width:'5%'}]}>$</Text>	
			// 									<TextInput selectTextOnFocus={ true } onFocus={() => this.onFocus('fee1')} placeholder='John Ace' keyboardType="numeric" style={Styles.landscapetriplefieldval} underlineColorAndroid='transparent'/>	
			// 								</View>																												
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('Origination_fee')}</Text>
			// 									<Text style={Styles.landscape20percenttext}>$</Text>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<TextInput selectTextOnFocus={ true } onFocus={() => this.onFocus('fee1')} placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>																												
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('processing_fees')}</Text>
			// 									<Text style={Styles.landscape20percenttext}>$</Text>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<TextInput selectTextOnFocus={ true } onFocus={() => this.onFocus('fee1')} placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>																												
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('tax_service_contact')}</Text>
			// 									<Text style={Styles.landscape20percenttext}>$</Text>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<TextInput selectTextOnFocus={ true } onFocus={() => this.onFocus('fee1')} placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>																												
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('Document_Preparation')}</Text>
			// 									<Text style={Styles.landscape20percenttext}>$</Text>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<TextInput selectTextOnFocus={ true } onFocus={() => this.onFocus('fee1')} placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>																												
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('Underwriting')}</Text>
			// 									<Text style={Styles.landscape20percenttext}>$</Text>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<TextInput selectTextOnFocus={ true } onFocus={() => this.onFocus('fee1')} placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>																					
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('appraisal')}</Text>
			// 									<Text style={Styles.landscape20percenttext}>$</Text>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<TextInput selectTextOnFocus={ true } onFocus={() => this.onFocus('fee1')} placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>																				
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('prepayment_penality')}</Text>
			// 									<Text style={Styles.landscape20percenttext}>$</Text>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<TextInput selectTextOnFocus={ true } onFocus={() => this.onFocus('fee1')} placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>																				
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('credit_report')}</Text>
			// 									<Text style={Styles.landscape20percenttext}>$</Text>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<TextInput selectTextOnFocus={ true } onFocus={() => this.onFocus('fee1')} placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>																				
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('recording_fee')}</Text>
			// 									<Text style={Styles.landscape20percenttext}>$</Text>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<TextInput selectTextOnFocus={ true } onFocus={() => this.onFocus('fee1')} placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>																				
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('floodcert')}</Text>
			// 									<Text style={Styles.landscape20percenttext}>$</Text>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<TextInput selectTextOnFocus={ true } onFocus={() => this.onFocus('fee1')} placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>																				
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('fed_ex_outside_courier')}</Text>
			// 									<Text style={Styles.landscape20percenttext}>$</Text>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<TextInput selectTextOnFocus={ true } onFocus={() => this.onFocus('fee1')} placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>																				
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('endorsement')}</Text>
			// 									<Text style={Styles.landscape20percenttext}>$</Text>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<TextInput selectTextOnFocus={ true } onFocus={() => this.onFocus('fee1')} placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>																				
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('notarySigningService')}</Text>
			// 									<Text style={Styles.landscape20percenttext}>$</Text>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<TextInput selectTextOnFocus={ true } onFocus={() => this.onFocus('fee1')} placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>																				
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('reconveyance')}</Text>
			// 									<Text style={Styles.landscape20percenttext}>$</Text>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<TextInput selectTextOnFocus={ true } onFocus={() => this.onFocus('fee1')} placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>																				
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('other')}</Text>
			// 									<Text style={Styles.landscape20percenttext}>$</Text>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<TextInput selectTextOnFocus={ true } onFocus={() => this.onFocus('fee1')} placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>																				
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('other')}</Text>
			// 									<Text style={Styles.landscape20percenttext}>$</Text>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<TextInput selectTextOnFocus={ true } onFocus={() => this.onFocus('fee1')} placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>																				
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('other')}</Text>
			// 									<Text style={Styles.landscape20percenttext}>$</Text>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<TextInput selectTextOnFocus={ true } onFocus={() => this.onFocus('fee1')} placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>																				
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('other')}</Text>
			// 									<Text style={Styles.landscape20percenttext}>$</Text>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<TextInput selectTextOnFocus={ true } onFocus={() => this.onFocus('fee1')} placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>	
			// 								<View style={[Styles.fullunderline, {marginTop:10}]}></View>
			// 								<View style={Styles.landscapehalfsizefield}>
			// 									<Text style={[Styles.landscapetexthead, {marginTop:5,width:'70%'}]}>{STRINGS.t('Total_Closing_Cost')}</Text>
			// 									<Text style={[Styles.landscapetexthead, {marginTop:5,textAlign:'right'}]}>$ 0.00</Text>	
			// 								</View>
			// 								<View style={[Styles.fullunderline, {marginTop:5,}]}></View>																													
			// 							</View>
			// 							<View style={{marginTop:40}}></View>
			// 						</View>
			// 						<View style={Styles.landscapecontentBoxes}>
			// 							<View style={Styles.landscapedataBoxHeading}>
			// 								<Text style={Styles.landscapedataboxheadingtext}>{STRINGS.t('prepaid')}</Text>
			// 							</View>
			// 							<View style={Styles.landscapedataBox}>
			// 								<View style={Styles.landscapefieldcontainer}>
			// 									<TextInput selectTextOnFocus={ true } onFocus={() => this.onFocus('fee1')} placeholder='John Ace' keyboardType="numeric" style={Styles.landscapetriplefieldvalsmall} underlineColorAndroid='transparent'/>
			// 									<View style={Styles.landscapetriplefieldlabelsmall}>
			// 										<Text style={[Styles.landscapenormalfulltext,{paddingLeft:5}]}>{STRINGS.t('Mo_Taxes')}</Text>
			// 									</View>	
			// 									<Text style={[Styles.landscapefieldval,{width:'10%',paddingLeft:'5%'}]}>%</Text>	
			// 									<TextInput selectTextOnFocus={ true } onFocus={() => this.onFocus('fee1')} placeholder='John Ace' keyboardType="numeric" style={Styles.landscapetriplefieldvalsmall} underlineColorAndroid='transparent'/>
			// 									<Text style={[Styles.landscapefieldval,{width:'5%'}]}>$</Text>	
			// 									<TextInput selectTextOnFocus={ true } onFocus={() => this.onFocus('fee1')} placeholder='John Ace' keyboardType="numeric" style={Styles.landscapetriplefieldval} underlineColorAndroid='transparent'/>		
			// 								</View>	
			// 								<View style={Styles.landscapefieldcontainer}>
			// 									<TextInput selectTextOnFocus={ true } onFocus={() => this.onFocus('fee1')} placeholder='John Ace' keyboardType="numeric" style={Styles.landscapetriplefieldvalsmall} underlineColorAndroid='transparent'/>
			// 									<View style={Styles.landscapetriplefieldlabelsmall}>
			// 										<Text style={[Styles.landscapenormalfulltext,{paddingLeft:5}]}>{STRINGS.t('Mo_Insur')}</Text>
			// 									</View>	
			// 									<Text style={[Styles.landscapefieldval,{width:'10%',paddingLeft:'5%'}]}>%</Text>	
			// 									<TextInput selectTextOnFocus={ true } onFocus={() => this.onFocus('fee1')} placeholder='John Ace' keyboardType="numeric" style={Styles.landscapetriplefieldvalsmall} underlineColorAndroid='transparent'/>
			// 									<Text style={[Styles.landscapefieldval,{width:'5%'}]}>$</Text>	
			// 									<TextInput selectTextOnFocus={ true } onFocus={() => this.onFocus('fee1')} placeholder='John Ace' keyboardType="numeric" style={Styles.landscapetriplefieldval} underlineColorAndroid='transparent'/>		
			// 								</View>																						
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<TextInput selectTextOnFocus={ true } onFocus={() => this.onFocus('fee1')} placeholder='John Ace' keyboardType="numeric" style={[Styles.landscapetriplefieldval,{width:'15%'}]} underlineColorAndroid='transparent'/>
			// 									<Text style={Styles.landscape50percenttext}>  {STRINGS.t('days_interest')}</Text>	
			// 									<Text style={[Styles.landscapefieldval,{width:'5%'}]}>$</Text>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<Text style={Styles.landscapefieldval}>0.00</Text>
			// 									</View>									
			// 								</View>
			// 								<View style={Styles.landscapefieldcontainer}>
			// 									<View style={[Styles.landscapetriplefieldlabel, {marginLeft:'35%',alignItems:'center'}]}>
			// 										<Text style={Styles.landscapenormalfulltext}>{STRINGS.t('2_Months')}</Text>
			// 									</View>	
			// 									<Text style={[Styles.landscapefieldval,{width:'5%'}]}>$</Text>	
			// 									<TextInput selectTextOnFocus={ true } onFocus={() => this.onFocus('fee1')} placeholder='John Ace' keyboardType="numeric" style={Styles.landscapetriplefieldval} underlineColorAndroid='transparent'/>	
			// 								</View>	
			// 								<View style={[Styles.fullunderline,{marginTop:10}]}></View>	
			// 								<View style={Styles.landscapehalfsizefield}>
			// 									<Text style={[Styles.landscapetexthead, {marginTop:5,width:'70%'}]}>{STRINGS.t('cost')}</Text>
			// 									<Text style={[Styles.landscapetexthead, {marginTop:5,textAlign:'right'}]}>{STRINGS.t('amount')}</Text>	
			// 								</View>																			
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('Other')}</Text>
			// 									<Text style={Styles.landscape20percenttext}>$</Text>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<TextInput selectTextOnFocus={ true } onFocus={() => this.onFocus('fee1')} placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>	
			// 								<View style={Styles.landscapehalfsizefield}>
			// 									<Text style={[Styles.landscapetexthead, {marginTop:5,width:'70%'}]}>{STRINGS.t('Total_Prepaid_items')}</Text>
			// 									<Text style={[Styles.landscapetexthead, {marginTop:5,textAlign:'right'}]}>$ 0.00</Text>	
			// 								</View>												
			// 							</View>
			// 							<View style={Styles.landscapedataBoxHeading}>
			// 								<Text style={Styles.landscapedataboxheadingtext}>{STRINGS.t('Payment')}</Text>
			// 							</View>
			// 							<View style={Styles.landscapedataBox}>
			// 								<View style={Styles.landscapehalfsizefield}>
			// 									<Text style={[Styles.landscapetextheaddata, {marginTop:5,width:'70%'}]}>{STRINGS.t('principal_and_interest')}</Text>
			// 									<Text style={[Styles.landscapetextheaddata, {marginTop:5,textAlign:'right',paddingLeft:5}]}>$ 0.00</Text>	
			// 								</View>	
			// 								<View style={[Styles.landscapehalfsizefield, {marginTop:5}]}>
			// 									<Text style={[Styles.landscapetextheaddata, {marginTop:5,width:'70%'}]}>{STRINGS.t('real_estate_taxes')}</Text>
			// 									<Text style={[Styles.landscapetextheaddata, {marginTop:5,textAlign:'right',paddingLeft:5}]}>$ 0.00</Text>	
			// 								</View>	
			// 								<View style={[Styles.landscapehalfsizefield, {marginTop:5}]}>
			// 									<Text style={[Styles.landscapetextheaddata, {marginTop:5,width:'70%'}]}>{STRINGS.t('home_owners_insurance')}</Text>
			// 									<Text style={[Styles.landscapetextheaddata, {marginTop:5,textAlign:'right',paddingLeft:5}]}>$ 0.00</Text>	
			// 								</View>	
			// 								<View style={[Styles.landscapehalfsizefield, {marginTop:5}]}>
			// 									<TextInput selectTextOnFocus={ true } onFocus={() => this.onFocus('fee1')} placeholder='John Ace' keyboardType="numeric" style={Styles.landscapetriplefieldvalsmall} underlineColorAndroid='transparent'/>
			// 									<Text style={[Styles.landscapetextheaddata, {marginTop:5,width:'55%',paddingLeft:5}]}>{STRINGS.t('home_owners_insurance')}</Text>
			// 									<Text style={[Styles.landscapetextheaddata, {marginTop:5,textAlign:'right',paddingLeft:5}]}>$ 0.00</Text>	
			// 								</View>	
			// 								<View style={[Styles.fullunderline,{marginTop:10}]}></View>	
			// 								<View style={Styles.landscapehalfsizefield}>
			// 									<Text style={[Styles.landscapetexthead, {marginTop:5,width:'70%'}]}>{STRINGS.t('monthly_expenses')}</Text>
			// 									<Text style={[Styles.landscapetexthead, {marginTop:5,textAlign:'right'}]}>{STRINGS.t('amount')}</Text>	
			// 								</View>																			
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('HOA')}</Text>
			// 									<Text style={Styles.landscape20percenttext}>$</Text>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<TextInput selectTextOnFocus={ true } onFocus={() => this.onFocus('fee1')} placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>																			
			// 								<View style={Styles.landscapefieldcontainer}>	
			// 									<Text style={Styles.landscapefieldlabel}>{STRINGS.t('Other')}</Text>
			// 									<Text style={Styles.landscape20percenttext}>$</Text>	
			// 									<View style={Styles.landscapefieldvaluesmallbox}>
			// 									<TextInput selectTextOnFocus={ true } onFocus={() => this.onFocus('fee1')} placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
			// 									</View>									
			// 								</View>												
			// 							</View>
			// 							<View style={Styles.landscapedataBoxHeading}>
			// 								<Text style={Styles.landscapedataboxheadingtext}>{STRINGS.t('total')}</Text>
			// 							</View>
			// 							<View style={Styles.landscapedataBox}>
			// 								<View style={Styles.landscapehalfsizefield}>
			// 									<Text style={[Styles.landscapetexthead, {marginTop:5,width:'70%'}]}>{STRINGS.t('Total_Monthly_Payment')}</Text>
			// 									<Text style={[Styles.landscapetexthead, {marginTop:5,textAlign:'right'}]}>$ 0.00</Text>	
			// 								</View>		
			// 								<View style={Styles.landscapehalfsizefield}>
			// 									<Text style={[Styles.landscapetexthead, {marginTop:5,width:'70%'}]}>{STRINGS.t('Cash_From_Borrower')}</Text>
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
