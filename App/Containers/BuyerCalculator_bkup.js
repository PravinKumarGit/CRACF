import React, { Component } from 'react';
import {Container, Left, Right, Icon, Title, Body, Button}  from 'native-base';
import {Image, View, Dimensions, Alert, Text, TextInput, TouchableOpacity, TouchableHighlight, ScrollView, AsyncStorage, ListView, Modal, ToolbarAndroid, StyleSheet, BackHandler, Keyboard} from 'react-native';
import Images from '../Themes/Images.js';
import BuyerStyle from './Styles/BuyerStyle';
import SellerStyle from './Styles/SellerStyle';
import Styles from './Styles/LandscapeStyles';
import CameraStyle from './Styles/CameraStyle';
import { CheckBox } from 'react-native-elements';
import CustomStyle from './Styles/CustomStyle';
import renderIf from 'render-if';
import {callGetApi, callPostApi} from '../Services/webApiHandler.js' // Import 
import STRINGS from '../GlobalString/StringData'  // Import StringData.js class for string localization.
import Picker from 'react-native-picker';
import DatePicker from 'react-native-datepicker'
import {getAmountConventional, getDiscountAmount, getAmountFHA, getAdjustedVA, getAdjustedUSDA,getPreMonthTax, getMonthlyInsurance, getDailyInterest, getFhaMipFinance, getUsdaMipFinance, getVaFundingFinance, getMonthlyRateMMI,sumOfAdjustment,getRealEstateTaxes, getHomeOwnerInsurance, getTotalPrepaidItems, getTotalMonthlyPayment, getTotalInvestment, getOriginationFee, getTotalCostRate, get2ndTd, getBuyerEstimatedTax} from '../Services/check_calc_with_object.js'
var nativeImageSource = require('nativeImageSource');
var Header = require('./Header');
var GLOBAL = require('../Constants/global');
const  {width, height} = Dimensions.get('window')
import SelectMultiple from 'react-native-select-multiple'
import ShowActivityIndicator from './ShowActivityIndicator';
import Spinner from 'react-native-loading-spinner-overlay'; 
import ModalDropdown from 'react-native-modal-dropdown';
//import { ThemeProvider, Toolbar, COLOR } from 'react-native-material-ui';
import Device from '../Constants/Device'
import DropdownAlert from 'react-native-dropdownalert'
import { Dropdown } from 'react-native-material-dropdown';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import PopupDialog from 'react-native-popup-dialog';
import PopupDialogEmail from 'react-native-popup-dialog';

import OpenFile from 'react-native-doc-viewer';
import ImagePicker from 'react-native-image-crop-picker';
import Camera from 'react-native-camera';
import {authenticateUser} from '../Services/CommonValidation.js'  // Import CommonValidation class to access common methods for validations.

export default class BuyerCalculator extends Component{
	constructor(props){
		super(props);
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
		 
		var addrsList = {};
		addrsList['email'] = 'email';
		this.state ={
			orientation: Device.isPortrait() ? 'portrait' : 'landscape',
			devicetype: Device.isTablet() ? 'tablet' : 'phone',
			initialOrientation: '',
			isChecked: true,	
			isCheckedUSDA: true,
			isCheckedVA: true,
			tab: 'CONV',
			footer_tab:'buyer',
			todaysInterestRate:'0.00',
			termsOfLoansinYears:'0.00',
			termsOfLoansinYears2:'0.00',
			date:date,
			date1:date,
			ltv: '90',
			ltv2: '0.00',
			down_payment: '0.00',
			loan_amt: '0.00',
			loan_amt2: '0.00',
			sale_pr: '0.00',
			sale_pr_calc: '',
			taxservicecontract: '0.00',
			underwriting: '0.00',
			processingfee: '0.00',
			appraisalfee: '0.00',
			creditReport: '0.00',
			ownerFee: '',
			ownerPolicyType: '',
			escrowFee: '',
			escrowPolicyType: '',
			lenderFee: '',
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
			numberOfDaysPerMonth: '',
			numberOfMonthsInsurancePrepaid: '',
			monTax: '0.00',
			monIns: '0.00',
			monTaxFixed: false,
			monInsFixed: false,
			numberOfDaysPerMonthFixed: false,
			costOtherFixed: false,
			monName: monthNames[(now.getMonth())],
			monTaxVal: '',
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
			monthlyRate:'',
			monthPmiVal:'0.00',
			rateValue:'',
			principalRate:'',
			realEstateTaxesRes: '',
			homeOwnerInsuranceRes: '',
			buyerFooterTab: true,
			scrollvalue : false,
			visble : false,
			totalClosingCost: '',
			totalPrepaidItems: '',
			totalMonthlyPayment: '0.00',
			totalInvestment: '0.00',
			first_name: '',
			last_name: '',
			mailing_address: '',
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
			escrowFeeOrg: '',
			lenderFeeOrg: '',
			ownerFeeOrg: '',
			modalVisible: false,
			modalAddressesVisible: false,
			emailModalVisible: false,
			printModalVisible: false,
			listBuyerCalculation: '',
			dataSource: ds.cloneWithRows(calcList),
			dataSourceOrg: ds.cloneWithRows(calcList),
			dataSourceEmpty: ds.cloneWithRows(calcList),
			emptCheck: false,
			addrsSource: ds.cloneWithRows(addrsList),
			toolbarActions: [{ value: 'SAVE' }, { value :'OPEN' }, { value : 'PRINT' } , { value : 'EMAIL' }, { value : 'LOAN COMPARISON' }],
			camera: {
				aspect: Camera.constants.Aspect.fill,
				captureTarget: Camera.constants.CaptureTarget.cameraRoll,
				captureMode: Camera.constants.CaptureMode.video,
				type: Camera.constants.Type.front,
				orientation: Camera.constants.Orientation.auto,
				flashMode: Camera.constants.FlashMode.auto,
			},
			modalDropDownAtions : ['Split','Buyer','Seller'],
			isRecording: false,
			isAddrsChecked: false,
			to_email: '',
			email_subject: '',
			imageData: '',
			videoData: '',
			videoModalVisible: false,
			emailAddrsList: [],
			currencySign: '',
			animating: false,
			originationfactor: '0.0',
			pnintrate: '0.00',
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
			speaktoText: false
		}
		this.renderRow = this.renderRow.bind(this);
		this.renderAddrsRow = this.renderAddrsRow.bind(this);

		Dimensions.addEventListener('change', () => {
			this.setState({
				orientation: Device.isPortrait() ? 'portrait' : 'landscape',
			});
		});
	}

	componentWillMount(){
		AsyncStorage.getItem('speaktoText').then((val)=>{
			console.log('speaktoText11', val)
			if(val){
				this.setState({speaktoText : val})
			}
		})
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
	setEmailModalVisible(visible) {
		this.setState({emailModalVisible: visible});
		this.getBuyerCalculatorListApi();
	}
	
	// For showing popup containing list of buyer's calculator
	setVideoModalVisible(visible) {
		this.setState({videoModalVisible: visible});
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
		valueOwner = this.state.ownerPolicyType;
		valueLender = this.state.lenderPolicyType;
		valueEscrow = this.state.escrowPolicyType;
		
		// Calculation of owner fee after user enter sales price
		if(valueOwner == 'Split'){
            ownerFee   = this.state.ownerFeeOrg/2;
        } else if(valueOwner == 'Seller'){
            ownerFee   = '0.00';
        } else if(valueOwner == 'Buyer'){
            ownerFee   = this.state.ownerFeeOrg;
        }
		
		// Calculation of lender fee after user enter sales price
		if(valueLender == 'Split'){
            lenderFee   = this.state.lenderFeeOrg/2;
        } else if(valueLender == 'Seller'){
            lenderFee   = '0.00';
        } else if(valueLender == 'Buyer'){
            lenderFee   = this.state.lenderFeeOrg;
        }
				//Alert.alert('Alert!', JSON.stringify(this.state.lenderFeeOrg))
		
		// Calculation of escrow fee after user enter sales price
		if(valueEscrow == 'Split'){
			if(this.state.escrowFeeBuyerOrg == '0'){
                escrowFee  = this.state.escrowFeeSellerOrg/2;
            } else if(this.escrowFeeSellerOrg == '0'){
                escrowFee  = this.state.escrowFeeBuyerOrg/2;
            } else {
                escrowFee  = this.state.escrowFeeBuyerOrg;
            }
        } else if(valueEscrow == 'Seller'){
            escrowFee   = '0.00';
        } else if(valueEscrow == 'Buyer'){
            escrowFee   = this.state.escrowFeeOrg;
        }
		
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
	}	
	
	//This function call when you select value from escrow dropdown (under closing cost section)
	createEscrowPicker(idx, value) {
		if(value == 'Split'){
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
		this.setState({escrowPolicyType: value, escrowFee:escrowFee, escrowTotal:escrowTotal},this.calTotalMonthlyPayment);
	}
	
	// This function call when you select value from owner dropdown (under closing cost section)	
	createOwnerPicker(idx, value) {
		
		if(value == 'Split'){
            ownerFee   = this.state.ownerFeeOrg/2;
        } else if(value == 'Seller'){
            ownerFee   = '0.00';
        } else if(value == 'Buyer'){
            ownerFee   = this.state.ownerFeeOrg;
			//Alert.alert('Alert!', JSON.stringify(this.state.ownerFeeOrg + "..this.state.ownerFeeOrg" + ownerFee + "..ownerFee"))
        }
		escrowTotal = (parseFloat(this.state.lenderFee) + parseFloat(ownerFee) + parseFloat(this.state.escrowFee)).toFixed(2);
		this.setState({ownerPolicyType: value, ownerFee:ownerFee, escrowTotal:escrowTotal},this.calTotalMonthlyPayment);
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

		this.setState({lenderPolicyType: value, lenderFee:lenderFee},this.calTotalMonthlyPayment);
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
            request         = {'salePrice': this.state.base_loan_amt,'FF': this.state.Vaff};
            //calling method to calculate the amount for VA Loan Type
            response         = getAdjustedVA(request);
            //this.amount            = this.salesprice;
            adjustedAmt        = response.adjusted;
			principalRate   = sumOfAdjustment(adjustedAmt, this.state.todaysInterestRate, this.state.termsOfLoansinYears);
			this.setState({ principalRate:principalRate, isCheckedVA: !this.state.isCheckedVA, VaFfFin3: this.state.VaFfFin2, adjusted_loan_amt: adjustedAmt},this.calTotalMonthlyPayment);
            
        } else {
			adjustedAmt    = this.state.base_loan_amt;
			principalRate   = sumOfAdjustment(adjustedAmt, this.state.todaysInterestRate, this.state.termsOfLoansinYears);
			this.setState({principalRate:principalRate, isCheckedVA: !this.state.isCheckedVA, VaFfFin3: this.state.VaFfFin, adjusted_loan_amt: adjustedAmt},this.calTotalMonthlyPayment);
        }
	}
	
	async componentDidMount() {
		this.setState({
			loadingText : 'Initializing...'
		});
		BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
		response = await authenticateUser();
		if(response == '1'){
			this.props.navigator.push({name: 'Login', index: 0 });
		}else{
			AsyncStorage.getItem("userDetail").then((value) => {
				newstr = value.replace(/\\/g, "");
				var newstr = JSON.parse(newstr);
				newstr.user_name = newstr.first_name + " " + newstr.last_name;
				var subj = 'Closing Costs from '+newstr.user_name+'  at '+newstr.email;
				this.setState({
					email_subject : subj 
				});
				this.setState(newstr,this.componentApiCalls);
			}).done();
			this.setState({animating:'true'});
			
			AsyncStorage.getItem("initialOrientation").then((value) => {
				this.setState({
					initialOrientation : value 
				});
			}).done();
		}	
	}

	componentWillUnmount() {
		
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
	}

	handleBackButtonClick() {
		//this.props.navigation.goBack(null);
		Alert.alert("dsf", JSON.stringify("Keyboard dismiss"));
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
	
	componentApiCalls(){
		this.callBuyerSettingApi();
		//this.callBuyerConvSettingApi();
		//this.callbuyerEscrowXmlData();
		this.callGlobalSettingApi();	
		this.getBuyerCalculatorListApi();
		this.callUserAddressBook();
		this.callBuyerProrationSettingApi();
	}
	
	callBuyerProrationSettingApi(){
		callPostApi(GLOBAL.BASE_URL + GLOBAL.buyer_proration_setting, {
		state_id: this.state.state
		}, this.state.access_token)
		.then((response) => {
			if(result.status == 'success'){
				this.setState({proration: result.data});
			}
		});
	}
	
	onChange(text) {
		newText = text.replace(/[^\d.]/g,'');
		return newText;	
	}
	
	// Calulation for discount price after changing discount percentage
	onChangeDisc(text,flag) {
		discText = text.replace(/[^\d.]/g,'');
		if(this.state.loan_amt2 != ''){
			valdisc = {'discountPerc': discText,'amount': this.state.loan_amt2};
		}else{
			valdisc = {'discountPerc': discText,'amount': this.state.loan_amt};
		}

        //calling method to calculate the discount amount
        amrt               = getDiscountAmount(valdisc);
		this.setState({disc: discText,discAmt: amrt.discount},this.calTotalClosingCost);
	}
	
	delimitNumbers(str) {
	  return (str + "").replace(/\b(\d+)((\.\d+)*)\b/g, function(a, b, c) {
		return (b.charAt(0) > 0 && !(c || ".").lastIndexOf(".") ? b.replace(/(\d)(?=(\d{3})+$)/g, "$1,") : b) + c;
	  });
	}
	
	onChangeRate(text,flag) {
		this.setState({animating:'true'});
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
		
	onChangeRateStep(text,flag) {
		if(text != "" && text != '0.00'){
			newText = text.replace(/[^\d.]/g,'');
		}else{
			newText = '0.00';
		}
		/* newText = this.delimitNumbers(newText);
		Alert.alert("new", newText); */
		newTextCalc = newText;
		if(flag=='sale_pr'){
			this.setState({sale_pr: newText,sale_pr_calc: newTextCalc});
			request = {'salePrice': newText,'LTV': this.state.ltv, 'LTV2': this.state.ltv2};
			if(this.state.disc != '' && this.state.disc != 0){
				this.onChangeDisc(this.state.disc);
			}
		}else if(flag=='ltv'){
			newTextCalc = this.state.sale_pr_calc;
			this.setState({ltv: newText});
			request = {'salePrice': this.state.sale_pr_calc,'LTV': newText, 'LTV2': this.state.ltv2};
		}
		else if(flag=='ltv2'){
			newTextCalc = this.state.sale_pr_calc;
			this.setState({ltv2: newText});
			request = {'salePrice': this.state.sale_pr_calc,'LTV': this.state.ltv, 'LTV2': newText};
		}
		if(flag!='sale_pr'){
			if(flag=='ltv2' && newText == 0){
				 flag = 'sale_pr';
			}
			newText = this.state.sale_pr;
		}
		
		if(this.state.tab == 'CONV'){
			if(this.state.termsOfLoansinYears2 != "" && this.state.termsOfLoansinYears2 != '0.00'){
				request1 = {'amount': this.state.loan_amt2,'termsInYear': this.state.termsOfLoansinYears2, 'interestRate': this.state.todaysInterestRate1};
				res = get2ndTd(request1);
				this.setState({pnintrate: res.pnintrate});
			}else{
				this.setState({pnintrate: '0.00'});
			}
			conv_amt = getAmountConventional(request);
			if(this.state.downPaymentFixed == true){
				conv_amt.downPayment = this.state.down_payment;
			}
			if(flag=='ltv2'){
				if(this.state.downPaymentFixed == true){
					conv_amt.amount = this.state.sale_pr_calc - this.state.down_payment - conv_amt.amount2;
					resaleConventionalLoanLTV    = (conv_amt.amount / this.state.sale_pr_calc *100).toFixed(2);
					this.setState({ltv: resaleConventionalLoanLTV});
				}else{
					conv_amt.downPayment    = this.state.down_payment - conv_amt.amount2;
				}
				
			}
			if (typeof conv_amt.amount2 !== 'undefined') {	
				this.setState({
						down_payment: conv_amt.downPayment,
						loan_amt: conv_amt.amount,
						loan_amt2: conv_amt.amount2,
						sale_pr: newText,
						sale_pr_calc: newTextCalc,
				});
				rate_loan_amt = (parseFloat(conv_amt.amount) + parseFloat(conv_amt.amount2)).toFixed(2);
				loan_amt1 = (parseFloat(conv_amt.amount) + parseFloat(conv_amt.amount2)).toFixed(2);
			}else{
				this.setState({
						down_payment: conv_amt.downPayment,
						loan_amt: conv_amt.amount,
						loan_amt2: '',
						sale_pr: newText,
						sale_pr_calc: newTextCalc,
				});
				rate_loan_amt = conv_amt.amount;
				loan_amt1 = conv_amt.amount;
			}
			
			loan_amt = conv_amt.amount;
			if (typeof conv_amt.amount2 !== 'undefined' && this.state.downPaymentFixed != true) {	
				loan_amt = (parseFloat(conv_amt.amount) + parseFloat(conv_amt.amount2)).toFixed(2);
			}
		}else{
			this.setState({pnintrate: '0.00'});
		}
		
		// Work on fetching adjusted loan amt, loan amt and down payment on change of sale price
			callGetApi(GLOBAL.BASE_URL + GLOBAL.national_global_setting)
			.then((response) => {
				
				if(this.state.tab == 'FHA'){
					if(newText <= result.data.nation_setting.FHA_SalePriceUnder){
						ltv = result.data.nation_setting.FHA_SalePriceUnderLTV;
					} else if (newText > result.data.nation_setting.FHA_SalePriceUnder && newText <= result.data.nation_setting.FHA_SalePriceTo){
						ltv = result.data.nation_setting.FHA_SalePriceToLTV;
					} else if (newText > result.data.nation_setting.FHA_SalePriceOver){
						ltv = result.data.nation_setting.FHA_SalePriceOverLTV;
					}
					if(this.state.downPaymentFixed == true){
						ltv = this.state.ltv;
					}
					//setting MIP according to the terms in year check for FHA
					if(this.state.termsOfLoansinYears <= result.data.nation_setting.FHA_YearsTwo){
						mip = result.data.nation_setting.FHA_PercentTwo;
					} else if(this.state.termsOfLoansinYears > result.data.nation_setting.FHA_YearsTwo && this.state.termsOfLoansinYears <= result.data.nation_setting.FHA_YearsOne){
						mip = result.data.nation_setting.FHA_PercentOne;
					}

					//creating object for sales price, loan to value and MIP
					data        = {'salePrice': newText,'LTV': ltv, 'MIP': mip};

					//calling method to calculate the amount and adjusted for FHA Loan Type
					resp        = getAmountFHA(data);
					
					
					requestPrepaidData = {'salePrice': resp.amount, 'MIP': mip};        
					responsePrepaid = getFhaMipFinance(requestPrepaidData);
					loan_amt = resp.adjusted;	
					rate_loan_amt = resp.amount;	
					loan_amt1 =  resp.adjusted;	
					
					this.setState({
						fhaMIP:mip,
						loan_amt: resp.amount,
						adjusted_loan_amt: resp.adjusted,
						down_payment: resp.downPayment,
						base_loan_amt: resp.amount,
						sale_pr: newText,
						sale_pr_calc: newTextCalc,
						FhaMipFin: responsePrepaid.FhaMipFin,
						FhaMipFin1: responsePrepaid.FhaMipFin1,
						FhaMipFin2: responsePrepaid.FhaMipFin2,
						FhaMipFin3: responsePrepaid.FhaMipFin2,
					});
					
					
					if(newText <= result.data.nation_setting.mMIAmountUpto){
						rateValue	= result.data.nation_setting.mMI;
					}
					if(newText > result.data.nation_setting.mMIAmountExceed){
						rateValue	= result.data.nation_setting.mMIExceed;
					}
				}else if(this.state.tab == 'VA'){
					ff = result.data.nation_setting.VA_FundingFee;
					if(this.state.Vaff != '0.00'){
						ff = this.state.Vaff;
					}
					if(this.state.downPaymentFixed == true){
						amt = (parseFloat(newText) - parseFloat(this.state.down_payment)).toFixed(2);
					}else{
						amt = newText;
					}
					data         = {'salePrice': amt,'FF': ff};
					resp        = getAdjustedVA(data);
					loan_amt = resp.adjusted;
					rate_loan_amt = resp.adjusted;	
					loan_amt1 = resp.adjusted;	
					responsePrepaid         = getVaFundingFinance(data);
					rateValue = '0.00';
					if(this.state.downPaymentFixed == true){
						resp.amount = (parseFloat(newText) - parseFloat(this.state.down_payment)).toFixed(2);
						resp.downPayment = this.state.down_payment;
						base_loan_amt = resp.amount;
					}else{
						base_loan_amt = newText;
					}
					this.setState({
						loan_amt: resp.amount,
						adjusted_loan_amt: resp.adjusted,
						down_payment: resp.downPayment,
						base_loan_amt: base_loan_amt,
						sale_pr: newText,
						sale_pr_calc: newTextCalc,
						Vaff: ff,
						VaFfFin: responsePrepaid.VaFfFin,
						VaFfFin1: responsePrepaid.VaFfFin1,
						VaFfFin2: responsePrepaid.VaFfFin2,
						VaFfFin3: responsePrepaid.VaFfFin2,
					});
					
				}else if(this.state.tab == 'USDA'){
					mip = result.data.nation_setting.USDA_MIPFactor;
					USDA_MonthlyMIPFactor        = result.data.nation_setting.USDA_MonthlyMIPFactor;
					rateValue = USDA_MonthlyMIPFactor / 100;
					rateValue = parseFloat(rateValue).toFixed( 5 );
					if(this.state.downPaymentFixed == true){
						amt = (parseFloat(newText) - parseFloat(this.state.down_payment)).toFixed(2);
					}else{
						amt = newText;
					}
					data         = {'salePrice': amt,'MIP': mip};
					resp         = getAdjustedUSDA(data);
					loan_amt = resp.adjusted;	
					rate_loan_amt = resp.adjusted;	
					loan_amt1 = resp.adjusted;	
					responsePrepaid         = getUsdaMipFinance(data);
					if(this.state.downPaymentFixed == true){
						resp.amount = (parseFloat(newText) - parseFloat(this.state.down_payment)).toFixed(2);
						resp.downPayment = this.state.down_payment;
						base_loan_amt = resp.amount;
					}else{
						base_loan_amt = newText;
					}
					this.setState({
						usdaMIP: mip,
						loan_amt: resp.amount,
						adjusted_loan_amt: resp.adjusted,
						down_payment: resp.downPayment,
						base_loan_amt: base_loan_amt,
						sale_pr: newText,
						sale_pr_calc: newTextCalc,
						UsdaMipFinance: responsePrepaid.UsdaMipFinance,
						UsdaMipFinance1: responsePrepaid.UsdaMipFinance1,
						UsdaMipFinance2: responsePrepaid.UsdaMipFinance2,
						UsdaMipFinance3: responsePrepaid.UsdaMipFinance2,
					});
				}else if(this.state.tab == 'CASH'){
					rateValue = '0.00';
					this.setState({
						down_payment: newText,
						sale_pr: newText,
						sale_pr_calc: newTextCalc,
					},this.changePrepaidPageFields);
				}
					
				if(this.state.termsOfLoansinYears2 != ''){
					year = parseInt(this.state.termsOfLoansinYears) + parseInt(this.state.termsOfLoansinYears2);
				} else {
					year = this.state.termsOfLoansinYears;
				}
				if(this.state.ltv2 > 0){
					loan = (parseFloat(this.state.ltv) + parseFloat(this.state.ltv2)).toFixed(2);
				} else {
					loan = this.state.ltv;
				}
				if(this.state.tab == 'CONV'){
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
				}
				
				data_mon_tax = {'salePrice': newText,'monthlyTax': this.state.monTax,'months': this.state.monTaxVal};
				resp_mon_tax = getPreMonthTax(data_mon_tax);
				prepaidMonthTaxes = resp_mon_tax.prepaidMonthTaxes;
		
				data_mon_ins         = {'salePrice': newText,'insuranceRate': this.state.monIns,'months': this.state.numberOfMonthsInsurancePrepaid};
				
				resp_mon_ins            = getMonthlyInsurance(data_mon_ins);
				monthInsurance = resp_mon_ins.monthInsurance;
				
				monthlyRate	= '0.00';

				titleVal	= 'PMI';
				//creating object for amount and rate value
				requestMMI 		= {'amount': rate_loan_amt, 'rateValue': rateValue};
				//Alert.alert("df",JSON.stringify(requestMMI));
				//calling method to calculate the FHa MIP Finance for prepaid
				responseMMI 		= getMonthlyRateMMI(requestMMI);
				if(this.state.tab == 'USDA'){
					monthlyRate		= responseMMI.monthlyRateMMI * 100;
				}else{
					monthlyRate		= responseMMI.monthlyRateMMI;
				}
				monthPmiVal		= monthlyRate * 2;
				principalRate   = sumOfAdjustment(loan_amt1, this.state.todaysInterestRate, this.state.termsOfLoansinYears);
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
				}
				
				this.setState({
					sale_pr: newText,
					adjusted_loan_amt: loan_amt,
					monthPmiVal: monthPmiVal,
					monthlyRate: monthlyRate,
					rateValue: rateValue,
					principalRate: principalRate,
					realEstateTaxesRes: realEstateTaxesRes,
					homeOwnerInsuranceRes: homeOwnerInsuranceRes,
					animating:'true'
				},this.callSettingApiForTabs);
				
			});
		
		
	}
	changeDate(date){
		var monthNames = [ "", "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec" ]; 
		var split = date.split('-');
		
		monthNameForProration = monthNames[Number(split[0])];
		prorationAmt = this.state.proration[monthNameForProration];
		request         = {'annualPropertyTax': this.state.annualPropertyTax, 'proration': prorationAmt, 'date': parseInt(split[1]), 'month': parseInt(split[0])};
		//Alert.alert("dsf", split[2]);
		data = getBuyerEstimatedTax(request)
		this.setState({date: date, monName: monthNames[Number(split[0])], estimatedTaxProrations: data.estimatedTax},this.callGlobalSettingApiOnDateChange);
	}
	
	changeAnnualTax(){
		var monthNames = [ "", "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec" ]; 
		date = this.state.date;
		var split = date.split('-');
		
		monthNameForProration = monthNames[Number(split[0])];
		prorationAmt = this.state.proration[monthNameForProration];
		request         = {'annualPropertyTax': this.state.annualPropertyTax, 'proration': prorationAmt, 'date': parseInt(split[1]), 'month': parseInt(split[0])};
		//alert(JSON.stringify(request));
		data = getBuyerEstimatedTax(request)
			
		this.setState({estimatedTaxProrations: data.estimatedTax},this.calTotalInvestment);
	}
	// function changePrepaidPageFields will call when adjusted amount and amount will set
	changePrepaidPageFields(){
			this.changeMonTaxPrice();
			/* this.changeMonInsPrice();
			this.changeDayInterestPrice();
			this.calOriginatinFee(); */
	}
	
	calOriginatinFee(){
			//creating object for origination fee and amount
			if(this.state.tab == "VA" || this.state.tab == "FHA"){
				loan_amt = this.state.base_loan_amt;
			}else{
				loan_amt = this.state.loan_amt;
			}
			if(this.state.tab == 'CONV'){
				request         = {'originationFee': this.state.originationfactor, 'amount': loan_amt, 'amount2': this.state.loan_amt2};
			}else{
				request         = {'originationFee': this.state.originationfactor, 'amount': loan_amt, 'amount2': '0.00'};
			}
		//	Alert.alert('Alert!', JSON.stringify(request))
            //calling method to calculate the discount amount
            response         = getOriginationFee(request);
			this.setState({originationFee: response.originationFee},this.calTotalClosingCost);
	}
	
	//Function to calculate mon tax value in prepaid tab
	changeMonTaxPrice(){
		data = {'salePrice': this.state.sale_pr_calc,'monthlyTax': this.state.monTax,'months': this.state.monTaxVal};
        //console.log(this.request);
        //calling method to calculate the discount amount
        resp                 = getPreMonthTax(data);
        //console.log(this.response.prepaidMonthTaxes);
		this.setState({
				prepaidMonthTaxes: parseFloat(resp.prepaidMonthTaxes).toFixed(2),
			},this.changeMonInsPrice);
	}
	
	//Function to calculate mon Ins value in prepaid tab
	changeMonInsPrice(){
		data         = {'salePrice': this.state.sale_pr_calc,'insuranceRate': this.state.monIns,'months': this.state.numberOfMonthsInsurancePrepaid};

        //calling method to calculate the discount amount
        resp              = getMonthlyInsurance(data);
        //console.log(this.response.prepaidMonthTaxes);
		this.setState({
			monthInsuranceRes: parseFloat(resp.monthInsurance).toFixed(2),
		},this.changeDayInterestPrice);
	}
	
	//Function to calculate day interest value in prepaid tab
	changeDayInterestPrice(){
		if(this.state.tab == 'CONV' && this.state.loan_amt != ""){
			amt = this.state.loan_amt;
		}else if(this.state.tab == 'CASH'){
			amt = '0.00';
		}else{
			amt = this.state.adjusted_loan_amt;
		}
		data         = {'adjusted': amt,'interestRate': this.state.todaysInterestRate,'days': this.state.numberOfDaysPerMonth};
		resp                = getDailyInterest(data);
		daysInterest = resp.daysInterest;
		if(this.state.tab == 'CONV' && this.state.loan_amt2 != "" && this.state.loan_amt2 != '0.00'){
			amt2 = this.state.loan_amt2;
			data2         = {'adjusted': amt2,'interestRate': this.state.todaysInterestRate1,'days': this.state.numberOfDaysPerMonth};
			resp2                = getDailyInterest(data2);
			daysInterest = (parseFloat(daysInterest) + parseFloat(resp2.daysInterest)).toFixed(2);
		} 
	
		//Alert.alert('Alert!', JSON.stringify(data))
        //console.log(this.request);
        //calling method to calculate the discount amount
       
		this.setState({
				daysInterest: daysInterest,
		},this.calOriginatinFee);
	}
	
	callBuyerSettingApi()
	{
		callPostApi(GLOBAL.BASE_URL + GLOBAL.Buyer_Cost_Setting, {
		user_id: this.state.user_id,company_id: this.state.company_id, zip: this.state.postal_code
		}, this.state.access_token)
		.then((response) => {
			request = {'salePrice': result.data.userSetting.todaysInterestRate,'LTV': '90', 'LTV2': ''};
			conv_amt = getAmountConventional(request);
			
			var j=1;
			for (resObjMonthExp of result.data.userSettingMonthExp) {
					const updateMonthExp = {};
					updateMonthExp['monthlyExpensesOther' + j] = resObjMonthExp.label;
					if('paymentAmount' + j + "Fixed"){
						paymentAmt = this.state['paymentAmount' + j];
					}else{
						paymentAmt = resObjMonthExp.fee;
					}
					updateMonthExp['paymentAmount' + j] = paymentAmt;
					updateMonthExp['typeMonthExp' + j] = resObjMonthExp.key;
					this.setState(updateMonthExp);
				j++; 
			}
			
			var i=1;
			resultCount = _.size(result.data.userSettingCost);
			
			const costRequest = {};
			// For setting last fields of closing costs page
			for (let resObj of result.data.userSettingCost) {
				const update = {};
				update['label' + i] = resObj.label;
				update['fee' + i] = resObj.fee;
				update['type' + i] = resObj.key;
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
				this.setState({
					todaysInterestRate: result.data.userSetting.todaysInterestRate,
					termsOfLoansinYears: result.data.userSetting.termsOfLoansinYears,
					numberOfDaysPerMonth: numberOfDaysPerMonth,
					numberOfMonthsInsurancePrepaid: result.data.userSetting.numberOfMonthsInsurancePrepaid,
					monTax: monTax,
					monIns: monIns,
					creditReport: result.data.userSetting.creditReport,
					totalCost: totalCost,
					down_payment: conv_amt.downPayment,
					loan_amt: conv_amt.amount,
				},this.callBuyerConvSettingApi);
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
				this.setState({
					taxservicecontract: result.data.taxservicecontract,
					underwriting: result.data.underwriting,
					processingfee: result.data.processingfee,
					appraisalfee: result.data.appraisalfee,
					documentprep: result.data.documentpreparation,
					originationfactor: result.data.originationFactor,
				},this.callBuyerSettingApi);
			}else{
				this.callBuyerSettingApi();
			}
			
		});
	}
	
	callBuyerConvSettingApi()
	{
		date = this.state.date;
		var split = date.split('-');
		date = Number(split[0])+'/'+Number(split[1])+'/'+Number(split[2]);
		//Alert.alert("df", JSON.stringify(this.state.city + "user_county.." + this.state.user_county + 'sale_pr..' + this.state.sale_pr + "loan_amt.." + this.state.adjusted_loan_amt + "state.." + this.state.state + ".." + this.state.county + ".." + this.state.postal_code));
		callPostApi(GLOBAL.BASE_URL + GLOBAL.buyer_escrow_xml_data, {
		"city": this.state.city,"county_name": this.state.user_county,"salePrice": this.state.sale_pr,"adjusted": this.state.adjusted_loan_amt,"state": this.state.state,"county": this.state.county, "loanType": this.state.tab, zip: this.state.postal_code, "estStlmtDate": date
		}, this.state.access_token)
		.then((response) => {
			if(result.status == 'success'){
				this.setState({
					ownerFee: result.data.ownerFee,
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
	}
	
	calEscrowTypes()
	{
		callPostApi(GLOBAL.BASE_URL + GLOBAL.title_escrow_type, {
		"companyId": this.state.company_id
		}, this.state.access_token)
		.then((response) => {
			if(result.status == 'success'){
				this.setState({
					ownerPolicyType: result.data.ownerType,
					escrowPolicyType: result.data.escrowType,
					lenderPolicyType: result.data.lenderType,
				},this.calEscrowData);
			}else{
				this.calEscrowData();
			}
			//Alert.alert('Alert!', JSON.stringify(result))
		});
	}
	
	callSettingApiForTabs(){
		if(this.state.sale_pr != '0.00'){
			if(this.state.disc != '' && this.state.disc != 0){
				this.onChangeDisc(this.state.disc);
			}
			if(this.state.tab=="CONV"){
				callPostApi(GLOBAL.BASE_URL + GLOBAL.conventional_setting, {
					user_id: this.state.user_id,company_id: this.state.company_id, zip: this.state.postal_code
				}, this.state.access_token)
				.then((response) => {
					this.setState({
						taxservicecontract: result.data.taxservicecontract,
						underwriting: result.data.underwriting,
						processingfee: result.data.processingfee,
						appraisalfee: result.data.appraisalfee,
						documentprep: result.data.documentpreparation,
						originationfactor: result.data.originationFactor,
					},this.callOwnerEscrowLenderSettingApi);
					
				});
			}else{
				callPostApi(GLOBAL.BASE_URL + GLOBAL.fha_va_usda_setting_api, {
					user_id: this.state.user_id,company_id: this.state.company_id,loan_type: this.state.tab,calc_type: "Buyer", zip: this.state.postal_code
				}, this.state.access_token)
				.then((response) => {
					if(this.state.tab == 'FHA'){
						this.setState({
							taxservicecontract: result.data.FHA_TaxServiceContract,
							underwriting: result.data.FHA_Underwriting,
							processingfee: result.data.FHA_ProcessingFee,
							appraisalfee: result.data.FHA_AppraisalFee,
							documentprep: result.data.FHA_DocumentPreparation,
							originationfactor: result.data.FHA_OriginationFactor,
						},this.callOwnerEscrowLenderSettingApi);		
					}else if(this.state.tab == 'VA'){
						this.setState({
							taxservicecontract: result.data.VA_TaxServiceContract,
							underwriting: result.data.VA_Underwriting,
							processingfee: result.data.VA_ProcessingFee,
							appraisalfee: result.data.VA_AppraisalFee,
							documentprep: result.data.VA_DocumentPreparation,
							originationfactor: result.data.VA_OriginationFactor,
						},this.callOwnerEscrowLenderSettingApi);		
					}else if(this.state.tab == 'USDA'){
						this.setState({
							taxservicecontract: result.data.USDA_TaxServiceContract,
							underwriting: result.data.USDA_Underwriting,
							processingfee: result.data.USDA_ProcessingFee,
							appraisalfee: result.data.USDA_AppraisalFee,
							documentprep: result.data.USDA_DocumentPreparation,
							originationfactor: result.data.USDA_OriginationFactor,
						},this.callOwnerEscrowLenderSettingApi);		
					}else if(this.state.tab == 'CASH'){
						this.setState({
							taxservicecontract: '0.00',
							underwriting: '0.00',
							processingfee: '0.00',
							appraisalfee: '0.00',
							documentprep: '0.00',
							originationfactor: '0.00',
						},this.callOwnerEscrowLenderSettingApi);		
					}else{
						this.setState({
							taxservicecontract: result.data.FHA_TaxServiceContract,
							underwriting: result.data.FHA_Underwriting,
							processingfee: result.data.FHA_ProcessingFee,
							appraisalfee: result.data.FHA_AppraisalFee,
							documentprep: result.data.FHA_DocumentPreparation,
							originationfactor: result.data.FHA_OriginationFactor,
						},this.callOwnerEscrowLenderSettingApi);	
					}
				});
			}
		}else{
			this.callOwnerEscrowLenderSettingApi();
		}	
	}
	
	callOwnerEscrowLenderSettingApi()
	{
		if(this.state.tab == 'CONV' && this.state.loan_amt2 != "" && this.state.loan_amt2 != '0.00'){
			loan_amt = (parseFloat(this.state.loan_amt) + parseFloat(this.state.loan_amt2)).toFixed(2);
		}else if(this.state.tab == 'CASH'){
			loan_amt = this.state.sale_pr;
		}else{
			loan_amt = this.state.adjusted_loan_amt;
		}
		date = this.state.date;
		var split = date.split('-');
		date = Number(split[0])+'/'+Number(split[1])+'/'+Number(split[2]);
		//Alert.alert("df", JSON.stringify(this.state.city + "user_county.." + this.state.user_county + 'sale_pr..' + this.state.sale_pr + "loan_amt.." + loan_amt + "state.." + this.state.state + ".." + this.state.county));
		//Alert.alert('Alert!', JSON.stringify(this.state.county))
		callPostApi(GLOBAL.BASE_URL + GLOBAL.buyer_escrow_xml_data, {
		"city": this.state.city,"county_name": this.state.user_county,"salePrice": this.state.sale_pr,"adjusted": loan_amt,"state": this.state.state,"county": this.state.county, "loanType": this.state.tab,zip: this.state.postal_code,  "estStlmtDate": date
		}, this.state.access_token)
		.then((response) => {
			if(result.status == 'success'){
				if(typeof result.data.newLoanFee != "undefined"){
					this.setState({newLoanServiceFee: result.data.newLoanFee,showLoanServiceFee: true});
				}else{
					this.setState({newLoanServiceFee: '0.00',showLoanServiceFee: false});
				}
				//Alert.alert("df",JSON.stringify(result));
				if(this.state.sale_pr == "" || this.state.sale_pr == '0.00'){
					if(this.state.tab == 'CASH'){
						this.setState({
							ownerFeeOrg: '0.00',
							escrowFeeOrg: result.data.escrowFee,
							lenderFeeOrg: '0.00',
							escrowFeeBuyerOrg: result.data.escrowFeeBuyer,
							escrowFeeSellerOrg: result.data.escrowFeeSeller,
						},this.createOwnerLenderEscrowPicker);	
					}else{
						this.setState({
							ownerFeeOrg: result.data.ownerFee,
							escrowFeeOrg: result.data.escrowFee,
							lenderFeeOrg: result.data.lenderFee,
							escrowFeeBuyerOrg: result.data.escrowFeeBuyer,
							escrowFeeSellerOrg: result.data.escrowFeeSeller,
						},this.createOwnerLenderEscrowPicker);	
					}
				}else{
					if(this.state.tab == 'CASH'){
						this.setState({
							ownerFeeOrg: '0.00',
							escrowFeeOrg: result.data.escrowFee,
							lenderFeeOrg: '0.00',
							escrowFeeBuyerOrg: result.data.escrowFeeBuyer,
							escrowFeeSellerOrg: result.data.escrowFeeSeller,
							countyTax: result.data.countyTax,
							cityTax: result.data.cityTax,
							cityEscrow: result.data.city,
						},this.getTransferTax);	
					}else{
						this.setState({
							ownerFeeOrg: result.data.ownerFee,
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
			}else{
				this.createOwnerLenderEscrowPicker();
			}	
			
		});
	}
	
	getTransferTax(){
		callPostApi(GLOBAL.BASE_URL + GLOBAL.get_transfer_tax, {
		"countyTax": this.state.countyTax,"cityTax": this.state.cityTax,"city": this.state.cityEscrow, "type": "buyer"
		}, this.state.access_token)
		.then((response) => {
			if(result.status == 'success'){
				twoMonthsPmi1 = this.state.cityEscrow + " transfer tax";
				if(this.state.costOtherFixed){
					costOther = this.state.costOther;
				}else{
					costOther = result.data.CityTransferTaxBuyer;
				}
				this.setState({costOther: costOther,twoMonthsPmi1: twoMonthsPmi1},this.createOwnerLenderEscrowPicker);	
			}else{
				this.createOwnerLenderEscrowPicker();
			}
		});
	}

	calEscrowData(){
        escrowTotal = (parseFloat(this.state.lenderFee) + parseFloat(this.state.ownerFee) + parseFloat(this.state.escrowFee)).toFixed(2);
		this.setState({escrowTotal: escrowTotal},this.calTotalClosingCostOnload);
    }
	
	calEscrowDataOnChange(){
        escrowTotal = (parseFloat(this.state.lenderFee) + parseFloat(this.state.ownerFee) + parseFloat(this.state.escrowFee)).toFixed(2);
		this.setState({escrowTotal: escrowTotal},this.calTotalClosingCost);
    }
	
	calTotalClosingCostOnload(){
		if(this.state.originationFee == ''){
			originationFee = '0.00';
		}else{
			originationFee = this.state.originationFee;
		}
		
	//	Alert.alert('Alert!', JSON.stringify(originationFee + "..originationFee" + this.state.processingfee + "..processingfee" + this.state.taxservicecontract + "..taxservicecontract" + this.state.documentprep + "..documentprep" + this.state.underwriting + "..underwriting" + this.state.appraisalfee + "..appraisalfee" + this.state.creditReport + "..creditReport")
		totalCostData = (parseFloat(originationFee) + parseFloat(this.state.processingfee) + parseFloat(this.state.taxservicecontract) + parseFloat(this.state.documentprep) + parseFloat(this.state.underwriting) + parseFloat(this.state.appraisalfee) + parseFloat(this.state.creditReport)).toFixed(2);
		
			this.setState({totalCostData: totalCostData});
			if(this.state.discAmt != ''){
				totalClosingCost    = (parseFloat(this.state.totalCost) + parseFloat(totalCostData) + parseFloat(this.state.discAmt)).toFixed(2);
			} else {
				totalClosingCost    = (parseFloat(this.state.totalCost) + parseFloat(totalCostData)).toFixed(2);
			}
			if(this.state.escrowTotal != ''){
				totalClosingCost    = (parseFloat(totalClosingCost) + parseFloat(this.state.escrowTotal)).toFixed(2);
			}
			this.setState({totalClosingCost: totalClosingCost},this.callSalesPr);
	}

	calTotalClosingCost(){
		if(this.state.originationFee == ''){
			originationFee = '0.00';
		}else{
			originationFee = this.state.originationFee;
		}
		
		//Alert.alert('Alert!', JSON.stringify(originationFee + "..originationFee" + this.state.processingfee + "..processingfee" + this.state.taxservicecontract + "..taxservicecontract" + this.state.documentprep + "..documentprep" + this.state.underwriting + "..underwriting" + this.state.appraisalfee + "..appraisalfee" + this.state.creditReport + "..creditReport"))
		totalCostData = (parseFloat(originationFee) + parseFloat(this.state.processingfee) + parseFloat(this.state.taxservicecontract) + parseFloat(this.state.documentprep) + parseFloat(this.state.underwriting) + parseFloat(this.state.appraisalfee) + parseFloat(this.state.creditReport)).toFixed(2);
		//Alert.alert('Alert!', totalCostData + ".." + this.state.totalCost + ".." + this.state.escrowTotal)
			this.setState({totalCostData: totalCostData});
			if(this.state.discAmt != ''){
				totalClosingCost    = (parseFloat(this.state.totalCost) + parseFloat(totalCostData) + parseFloat(this.state.discAmt)).toFixed(2);
			} else {
				totalClosingCost    = (parseFloat(this.state.totalCost) + parseFloat(totalCostData)).toFixed(2);
			}
			if(this.state.escrowTotal != ''){
				totalClosingCost    = (parseFloat(totalClosingCost) + parseFloat(this.state.escrowTotal)).toFixed(2);
			}
			if(this.state.showLoanServiceFee){
				totalClosingCost    = (parseFloat(totalClosingCost) + parseFloat(this.state.newLoanServiceFee)).toFixed(2);
			}
			this.setState({totalClosingCost: totalClosingCost},this.calTotalPrepaidItems);
	}	
	
	settingsApi(flag){
		this.setState({animating:'true'});
		if(this.state.tab!="CASH"){
			monTaxVal = this.state.monTaxValReal;
		}
		this.setState({tab: flag,downPaymentFixed: false, monTaxVal: monTaxVal},this.afterSetStateSettingApi);
	}
	
	//Call when state of tab is set
	afterSetStateSettingApi(){
		if(this.state.tab=="FHA"){
			this.callFHAsettinsapi();
		}else if(this.state.tab=="VA"){
			this.callVAsettinsapi();
		}else if(this.state.tab=="USDA"){
			this.callUSDAsettinsapi();
		}else if(this.state.tab=="CONV"){
			if(this.state.downPaymentHidden > 0){
				amount = this.state.sale_pr_calc - this.state.downPaymentHidden;
				resaleConventionalLoanLTV    = (amount / this.state.sale_pr_calc *100).toFixed(2);
				this.setState({ltv: resaleConventionalLoanLTV,ltv2: '0.00',todaysInterestRate1: '0.00',termsOfLoansinYears2: '0.00'});
			}
			this.callbuyerEscrowXmlData();
		}else if(this.state.tab=="CASH"){
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
	callFHAsettinsapi(){
		callPostApi(GLOBAL.BASE_URL + GLOBAL.fha_va_usda_setting_api, {
			user_id: this.state.user_id,company_id: this.state.company_id,loan_type: "FHA",calc_type: "Buyer", zip: this.state.postal_code
		}, this.state.access_token)
		.then((response) => {
			//Alert.alert('Alert!', JSON.stringify(this.state.user_id + "this.state.user_id" + this.state.company_id + "this.state.company_id"))
			if(result.status == 'success'){
				this.setState({
					taxservicecontract: result.data.FHA_TaxServiceContract,
					underwriting: result.data.FHA_Underwriting,
					processingfee: result.data.FHA_ProcessingFee,
					appraisalfee: result.data.FHA_AppraisalFee,
					documentprep: result.data.FHA_DocumentPreparation,
					originationfactor: result.data.FHA_OriginationFactor,
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
				this.setState({
					taxservicecontract: result.data.VA_TaxServiceContract,
					underwriting: result.data.VA_Underwriting,
					processingfee: result.data.VA_ProcessingFee,
					appraisalfee: result.data.VA_AppraisalFee,
					documentprep: result.data.VA_DocumentPreparation,
					originationfactor: result.data.VA_OriginationFactor,
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
				this.setState({
					taxservicecontract: result.data.USDA_TaxServiceContract,
					underwriting: result.data.USDA_Underwriting,
					processingfee: result.data.USDA_ProcessingFee,
					appraisalfee: result.data.USDA_AppraisalFee,
					documentprep: result.data.USDA_DocumentPreparation,
					originationfactor: result.data.USDA_OriginationFactor,
				},this.callClosingCostSettingApi);
			}else{
				this.callClosingCostSettingApi();
			}
		});
	}
	
	callClosingCostSettingApi(){
		callPostApi(GLOBAL.BASE_URL + GLOBAL.Buyer_Cost_Setting, {
		user_id: this.state.user_id,company_id: this.state.company_id, zip: this.state.postal_code
		}, this.state.access_token)
		.then((response) => {
			
			//Alert.alert('Alert!', JSON.stringify(result.data.userSettingCost))
			// For setting last fields of closing costs page
			resultCount = _.size(result.data.userSettingCost);
			costRequest = {};
			
				var j=1;
				for (resObjMonthExp of result.data.userSettingMonthExp) {
						const updateMonthExp = {};
						if('paymentAmount' + j + "Fixed"){
							paymentAmt = this.state['paymentAmount' + j];
						}else{
							paymentAmt = resObjMonthExp.fee;
						}
						updateMonthExp['monthlyExpensesOther' + j] = resObjMonthExp.label;
						updateMonthExp['paymentAmount' + j] = paymentAmt;
						updateMonthExp['typeMonthExp' + j] = resObjMonthExp.key;
						this.setState(updateMonthExp);
					j++;
				}
				var i=1;
				for (resObj of result.data.userSettingCost) {
						const update = {};
						update['label' + i] = resObj.label;
						update['fee' + i] = resObj.fee;
						update['type' + i] = resObj.key;
						update['totalfee' + i] = resObj.fee;
						costRequest['cost' + i] = resObj.fee;
						this.setState(update);
						if(i == resultCount){
							let costResponse    = getTotalCostRate(costRequest);
							totalCost      = costResponse.totalCostRate;
							if(this.state.monTaxFixed){
								monTax = this.state.monTax;
							}else{
								monTax = result.data.userSetting.taxRatePerYearPerOfSalePrice;
							}
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
							this.setState({
								todaysInterestRate: result.data.userSetting.todaysInterestRate,
								termsOfLoansinYears: result.data.userSetting.termsOfLoansinYears,
								numberOfDaysPerMonth: result.data.userSetting.numberOfDaysPerMonth,
								numberOfMonthsInsurancePrepaid: result.data.userSetting.numberOfMonthsInsurancePrepaid,
								monTax: monTax,
								monIns: monIns,
								creditReport: result.data.userSetting.creditReport,
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
					if('paymentAmount' + j + "Fixed"){
						paymentAmt = this.state['paymentAmount' + j];
					}else{
						paymentAmt = resObjMonthExp.fee;
					}
					updateMonthExp['monthlyExpensesOther' + j] = resObjMonthExp.label;
					updateMonthExp['paymentAmount' + j] = paymentAmt;
					updateMonthExp['typeMonthExp' + j] = resObjMonthExp.key;
					this.setState(updateMonthExp);
				j++;
			}
			
			var i=1;
			//Alert.alert('Alert!', JSON.stringify(result.data.userSettingCost))
			// For setting last fields of closing costs page
			resultCount = _.size(result.data.userSettingCost);
			costRequest = {};
			for (resObj of result.data.userSettingCost) {
				const update = {};
				if(resObj.applyCash == 'Y'){
					update['label' + i] = resObj.label;
					update['fee' + i] = resObj.fee;
					update['type' + i] = resObj.key;
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
					this.setState({
						todaysInterestRate: result.data.userSetting.todaysInterestRate,
						termsOfLoansinYears: result.data.userSetting.termsOfLoansinYears,
						numberOfDaysPerMonth: result.data.userSetting.numberOfDaysPerMonth,
						monTax: monTax,
						monIns: monIns,
						numberOfMonthsInsurancePrepaid: '12',
						creditReport: '0.00',
						totalCost: totalCost,
						taxservicecontract: '0.00',
						underwriting: '0.00',
						processingfee: '0.00',
						appraisalfee: '0.00',
						documentprep: '0.00',
						originationfactor: '0.00',
						monTaxVal: '0.00',
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
        if(this.state.tab == 'FHA'){
            financialVal    = this.state.FhaMipFin3;
        } else if(this.state.tab == 'VA'){
            financialVal    = this.state.VaFfFin3;
        } else if(this.state.tab == 'USDA'){	
            financialVal    = this.state.UsdaMipFinance3;
        } else if(this.state.tab == 'CONV'){
            financialVal    = this.state.monthPmiVal;
        } else if(this.state.tab == 'CASH'){
            financialVal    = '0.00';
        }
		
        //creating object for loan payment adjustments
        requestTotPreItem         = {'prepaidMonthTaxesRes': this.state.prepaidMonthTaxes, 'monthInsuranceRes': this.state.monthInsuranceRes, 'daysInterestRes': this.state.daysInterest, 'financialVal': financialVal, 'prepaidAmount': this.state.costOther};
		// Alert.alert('Alert!', JSON.stringify(this.state.prepaidMonthTaxes + "prepaidMonthTaxes" + this.state.monthInsuranceRes + "monthInsuranceRes" + this.state.daysInterest + "daysInterest" + financialVal + "financialVal" )); 
        //calling method to calculate the adjustments
        responseTotPreItem        = getTotalPrepaidItems(requestTotPreItem);
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
	
		this.setState({financialVal: financialVal,totalPrepaidItems: responseTotPreItem.totalPrepaidItems},this.calTotalInvestment);
    }
	
	
	//Total Monthly Payment
    calTotalMonthlyPayment(){
        //creating object for loan payment adjustments
       requestTotPreItem         = {'principalRate': this.state.principalRate, 'realEstateTaxesRes': this.state.realEstateTaxesRes, 'homeOwnerInsuranceRes': this.state.homeOwnerInsuranceRes, 'monthlyRate': this.state.monthlyRate, 'pnintrate': this.state.pnintrate, 'paymentAmount1': this.state.paymentAmount1, 'paymentAmount2': this.state.paymentAmount2};
        //calling method to calculate the adjustments
        responseTotPreItem        = getTotalMonthlyPayment(requestTotPreItem);
		/* if(this.state.monthlyExpensesOther1 != ""){
			responseTotPreItem.totalMonthlyPayment = (parseFloat(this.state.paymentAmount1) + parseFloat(responseTotPreItem.totalMonthlyPayment)).toFixed(2)
		}
		if(this.state.monthlyExpensesOther2 != ""){
			responseTotPreItem.totalMonthlyPayment = (parseFloat(this.state.paymentAmount2) + parseFloat(responseTotPreItem.totalMonthlyPayment)).toFixed(2)
		} */
		this.setState({totalMonthlyPayment: responseTotPreItem.totalMonthlyPayment},this.changePrepaidPageFields);
    }

//Total Investment
    calTotalInvestment(){
	
        //creating object for loan payment adjustments
		if(this.state.totalPrepaidItems == '' || this.state.totalPrepaidItems === undefined){
			 requestTotPreItem         = {'downPayment': this.state.down_payment, 'totalClosingCost': this.state.totalClosingCost, 'totalPrepaidItems': 0, 'estimatedTaxProrations': this.state.estimatedTaxProrations};
		}else{
			 requestTotPreItem         = {'downPayment': this.state.down_payment, 'totalClosingCost': this.state.totalClosingCost, 'totalPrepaidItems': this.state.totalPrepaidItems, 'estimatedTaxProrations': this.state.estimatedTaxProrations};
		}
		//Alert.alert('Alert!', JSON.stringify(this.state.prepaidMonthTaxes + "prepaidMonthTaxes" + this.state.monthInsuranceRes + "monthInsuranceRes" + this.state.daysInterest + "daysInterest" + financialVal + "financialVal" )); 
        //calling method to calculate the adjustments
        responseTotPreItem        = getTotalInvestment(requestTotPreItem);
		if(isNaN(responseTotPreItem.totalInvestment)){
			this.setState({totalInvestment: '0.00'});
		} else{
			//totalInvestment = (parseFloat(responseTotPreItem.totalInvestment) + parseFloat(this.state.estimatedTaxProrations)).toFixed(2);
			this.setState({totalInvestment: responseTotPreItem.totalInvestment});
		} 
		this.setState({animating:'false'});
		this.setState({
			loadingText : 'Calculating...'
		});
    } 
	
	changeMortgageInsVal(){
		//creating object for amount and rate value
		requestMMI 		= {'amount': this.state.loan_amt, 'rateValue': this.state.rateValue};

		//calling method to calculate the FHa MIP Finance for prepaid
		responseMMI 		= getMonthlyRateMMI(requestMMI);

		monthlyRate		= responseMMI.monthlyRateMMI;
		monthPmiVal		= monthlyRate * 2;	
		this.setState({monthlyRate: monthlyRate, monthPmiVal: monthPmiVal},this.calTotalMonthlyPayment);
	}
	
	callSalesPr(){
		this.onChangeRate(this.state.sale_pr_calc, "sale_pr");
	}
	
	saveBuyerCalculatorDetailsApi(){
		buyerData 	= 	{
							'company_id'	: this.state.company_id,
							'user_id' : this.state.user_id,
							'preparedBy' : this.state.user_name,
							'preparedFor' : this.state.lendername,
							'address' : this.state.mailing_address,
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
							'summerPropertyTax' : this.state.nullVal,
							'winterPropertyTax' : this.state.nullVal,
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
						};
						if(this.state.calculatorId != ""){
							buyerData.calculator_id = this.state.calculatorId;	
						}
						var temp = JSON.stringify(buyerData);
						temp = temp.replace(/\"\"/g, "\"0.00\"");
						buyerData = JSON.parse(temp);
						callPostApi(GLOBAL.BASE_URL + GLOBAL.save_buyer_calculator, buyerData,this.state.access_token).then((response) => {
							this.setState({monthlyRate: monthlyRate, monthPmiVal: monthPmiVal},this.calTotalPrepaidItems);
							if(result.status == 'success'){
								if(this.state.calculatorId != ''){
									this.dropdown.alertWithType('success', 'Success', "Calculator updated successfully");
								}else{
									this.dropdown.alertWithType('success', 'Success', "Calculator saved successfully");
									this.getBuyerCalculatorListApi();
								}
							}
							//Alert.alert('Alert!', JSON.stringify(result));
						});
	}
	
	getBuyerCalculatorListApi()
	{
		
		callPostApi(GLOBAL.BASE_URL + GLOBAL.get_buyer_calculator, {userId: this.state.user_id, type: "Buyers"
		}, this.state.access_token)
		.then((response) => {
			if(result.status == 'success'){
				calculatorList = result.data;
				calculatorList = calculatorList.sort(function(a, b){
					return b.calculatorId-a.calculatorId
				})
				result.data = calculatorList;
				var ds = new ListView.DataSource({
					rowHasChanged: (r1, r2) => r1 !== r2
				});
				this.setState({dataSourceOrg: ds.cloneWithRows(result.data),dataSource: ds.cloneWithRows(result.data),arrayholder: result.data,emptCheck: false});
			}
		});
	}
	
	SearchFilterFunction(text){
		if(text != ''){
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
	}
	
	editCalculator(id){
		callPostApi(GLOBAL.BASE_URL + GLOBAL.buyer_detail_calculator, {calculatorId: id
		}, this.state.access_token)
		.then((response) => {
			if(result.status == 'success'){
				//Alert.alert('Alert!', JSON.stringify(result.data));
				this.setState(result.data);
				this.setState({sale_pr: result.data.salePrice,mailing_address: result.data.address, postal_code: result.data.zip, tab: result.data.buyerLoanType,ltv: result.data.conventionalLoanToValue_1Loan,todaysInterestRate1: result.data.conventionalInterestRate_2Loan,termsOfLoansinYears2: result.data.conventionalTermInYear_2Loan,ltv2: result.data.conventionalLoanToValue_2Loan,todaysInterestRate: result.data.interestRate,termsOfLoansinYears: result.data.termInYears,interestRateCap2: result.data.interestRateCap_2Loan,perAdjustment2: result.data.perAdjustment_2Loan,loan_amt: result.data.amount,loan_amt2: result.data.conventionalAmount2,adjusted_loan_amt: result.data.adjusted,down_payment: result.data.downPayment,disc: result.data.discount1,discAmt: result.data.discount2,taxservicecontract: result.data.taxServiceContract,documentprep: result.data.documentPreparation,appraisalfee: result.data.appraisal,label1: result.data.costLabel_1Value,costType_1Value: result.data.type1,fee1: result.data.costFee_1Value,label2: result.data.costLabel_2Value,type2: result.data.costType_2Value,fee2: result.data.costFee_2Value,label3: result.data.costLabel_3Value,type3: result.data.costType_3Value,fee3: result.data.costFee_3Value,label4: result.data.costLabel_4Value,type4: result.data.costType_4Value,fee4: result.data.costFee_4Value,label5: result.data.costLabel_5Value,type5: result.data.costType_5Value,fee5: result.data.costFee_5Value,label6: result.data.costLabel_6Value,type6: result.data.costType_6Value,fee6: result.data.costFee_6Value,label7: result.data.costLabel_7Value,type7: result.data.costType_7Value,fee7: result.data.costFee_7Value,label8: result.data.costLabel_8Value,type8: result.data.costType_8Value,fee8: result.data.costFee_8Value,label9: result.data.costLabel_9Value,type9: result.data.costType_9Value,fee9: result.data.costFee_9Value,label10: result.data.costLabel_10Value,type10: result.data.costType_10Value,fee10: result.data.costFee_10Value,monTaxVal: result.data.prepaidMonthTaxes1,monTax: result.data.prepaidMonthTaxes2,prepaidMonthTaxes: result.data.prepaidMonthTaxes3,numberOfMonthsInsurancePrepaid: result.data.prepaidMonthInsurance1,monIns: result.data.prepaidMonthInsurance2,monthInsuranceRes: result.data.prepaidMonthInsurance3,numberOfDaysPerMonth: result.data.daysInterest1,daysInterest: result.data.daysInterest2,escrowType: result.data.payorSelectorEscrow,escrowFee: result.data.escrowOrSettlement,ownersType: result.data.payorSelectorOwners,ownerFee: result.data.ownersTitlePolicy,lenderType: result.data.payorSelectorLenders,lenderFee: result.data.lendersTitlePolicy,escrowFeeOrg: result.data.escrowFeeHiddenValue,lenderFeeOrg: result.data.lendersFeeHiddenValue,ownerFeeOrg: result.data.ownersFeeHiddenValue,principalRate: result.data.principalAndInterest,realEstateTaxesRes: result.data.realEstateTaxes,homeOwnerInsuranceRes: result.data.homeownerInsurance,rateValue: result.data.paymentRate,monthlyRate: result.data.paymentMonthlyPmi,twoMonthsPmi: result.data.monthPmiVal,twoMonthsPmi1: result.data.prepaidCost,costOther: result.data.prepaidAmount,monthlyExpensesOther1: result.data.paymentMonthlyExpense1,monthlyExpensesOther2: result.data.paymentMonthlyExpense2,totalMonthlyPayment: result.data.totalMonthlyPayement,county: result.data.countyId,state: result.data.stateId, calculatorId: id});
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
							{rowData.calculatorName}{"\n"}$ {rowData.price}
						</Text>
					</TouchableOpacity>
				</View>
				<View style={BuyerStyle.savecalcvalueSecondCol}>
					<Text style={[BuyerStyle.alignCenterCalcList,{alignSelf: 'flex-start'}]}>
						{rowData.address}{"\n"}{rowData.createdDate}
					</Text>
				</View>
				<TouchableOpacity style={BuyerStyle.savecalcvaluesmall} onPress={() => this.saveBuyerCalculatorDetailsApi()}>
					<Image source={Images.recycle}/>
				</TouchableOpacity>
			</View>
		);
	}
	
	onActionSelected(position) {
		if(position == "OPEN") {
			this.setModalVisible(true);
		}else if(position == "SAVE"){
			this.saveBuyerCalculatorDetailsApi();	
		}else if(position == "PRINT"){
			this.setState({popupType: "print"},this.popupShow);
		}else if(position == "EMAIL"){
			if(this.state.sale_pr_calc == "" || this.state.sale_pr_calc == '0.00'){
				this.dropdown.alertWithType('error', 'Error', 'Please enter sales price');
			}else{
				this.setState({popupType: "email"},this.popupShow);
			}
			
			
		}else if(position == "msg_tab"){
			ImagePicker.openPicker({
			  width: 300,
			  height: 400,
			  cropping: true
			}).then(image => {
				this.setState({imageData: image});
			});
			//this.setState({popupType: "msg_tab"},this.popupShow);
		}else if(position == "msg_tab_cam"){
			ImagePicker.openCamera({
			  width: 300,
			  height: 400,
			  cropping: true
			}).then(image => {
				this.setState({imageData: image});
			});
		}else if(position == 'LOAN COMPARISON'){
			if(this.state.sale_pr > 0){
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
			}
		}
	}
	openpopup(type) {
		this.setState({popupAttachmentType: type},this.popupShowEmail);
	}
	popupShow(){
		this.popupDialog.show();
	}
	popupShowEmail(){
		this.popupDialogEmail.show();
	}
	
	confirmlogout(position) {
		
	}
	
	printPDF(type){
		if(type == "detailed"){
			pdfURL = GLOBAL.generate_pdf;
		}else if(type == "quick"){
			pdfURL = GLOBAL.generate_pdf_quick_buyer;
		}
			buyerData = this.getData();
			callPostApi(GLOBAL.BASE_URL + pdfURL, buyerData,this.state.access_token)
		.then((response) => {
			if(result.status == 'success'){
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
	
	
	
	takePicture = () => {
		const options = {};
		//options.location = ...
		this.camera.capture({metadata: options})
		  .then((data) => console.log(data))
		  .catch(err => console.error(err));
	}

	startRecording = () => {
		if (this.camera) {
		  this.camera.capture()
		  .catch(err => console.error(err));

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
		  Alert.alert( 'CostsFirst', 'Do you want to attach this video.', [ {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')}, {text: 'OK', onPress:this.setVideoModalVisible(!this.state.videoModalVisible)}] );
		}
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
			if(this.state.to_email == ""){
				this.dropdown.alertWithType('error', 'Error', 'Please enter email address');
			}else{
				buyerData = this.getData();
				buyerData.email = this.state.to_email;
				buyerData.image_name = this.state.imageData;
				callPostApi(GLOBAL.BASE_URL + GLOBAL.send_buyer_detailed_estimate, buyerData,this.state.access_token)
				.then((response) => {
					this.dropdown.alertWithType('success', 'Success', "Email sent successfully");
			});
		}
	}
	
	getData(){
		buyerData 	= 	{
			'company_id'	: this.state.company_id,
			'user_id' : this.state.user_id,
			'preparedBy' : this.state.user_name,
			'preparedFor' : this.state.lendername,
			'address' : this.state.mailing_address,
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
			'annualPropertyTax' : this.state.annualPropertyTax,
			'summerPropertyTax' : this.state.nullVal,
			'winterPropertyTax' : this.state.nullVal,
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
		};
		
		return buyerData;
	}


	// this is for updating empty fields to 0.00 on blur
	updateFormField (fieldVal, fieldName, functionCall) {
		fieldVal = this.removeCommas(fieldVal);
		if(this.state.defaultVal != fieldVal){
			if(fieldVal==''){
				processedData = '0.00';
			}else{
				processedData = fieldVal;
			}
			processedData = processedData.toLocaleString('en');
			this.setState({
				[fieldName]: processedData,
			},functionCall)
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
	onFocus (fieldName) {
		fieldVal = this.state[fieldName];
			this.setState({
				defaultVal: fieldVal,
			})
			/* this.setState({
				[fieldName]: '',
			}) */
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
		this.setState({to_email: to_email});
		this.setState({ selectedAddresses })
	}
	state = { selectedAddresses: [] }
	
	downPaymentChange(downPayment){
		if(downPayment == ""){
			downPayment = '0.00';
		}
		if(this.state.loan_amt2 > 0){
			loan = (parseFloat(this.state.sale_pr) - parseFloat(downPayment) - parseFloat(this.state.loan_amt2)).toFixed(2);
			//this.amount         = this.salesprice - this.downPayment - this.amount2;
			this.setState({loan_amt: loan});
		} else {
			loan = (parseFloat(this.state.sale_pr) - parseFloat(downPayment)).toFixed(2);
			this.setState({loan_amt: loan});
		}
		resaleConventionalLoanLTV  = loan / this.state.sale_pr *100 ;
		resaleConventionalLoanLTV  = parseFloat(resaleConventionalLoanLTV).toFixed(2);
		this.setState({downPaymentHidden: downPayment,downPaymentFixed: true,ltv: resaleConventionalLoanLTV},this.callSalesPr);
		//creating object for origination fee and amount
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
return(
	// (this.state.orientation == 'portrait') ? ( 
		<View style={BuyerStyle.TopContainer}>
			<View style={BuyerStyle.iphonexHeader}></View>
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
								onChangeText={this.onActionSelected.bind(this)}	
								rippleInsets={{ top: 0, bottom: 0, left: 0, right: 0 }}
								containerStyle={{  height: 100,width:60 }}
								dropdownPosition={1}
								itemColor="rgba(0, 0, 0, .87)"
								pickerStyle={{
								width: 170,
								height: 220,
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
							<View style={BuyerStyle.subHeader}>
								<View style={BuyerStyle.subheaderbox}>                                    
									<View style={BuyerStyle.view_container}>
										<View style={BuyerStyle.image_container}>
											<Image style={BuyerStyle.user_icon} source={Images.user_icon}/>
										</View>
										<View style={BuyerStyle.boxes_textbox_container}>
											<TextInput selectTextOnFocus={ true } style={BuyerStyle.text_inputbig} autoCapitalize = 'words' underlineColorAndroid='transparent' onChangeText={(value) => this.setState({lendername: value})} value={this.state.lendername.toString()}/>
											<View style={BuyerStyle.fullunderline}></View>
										</View>
									</View>
									<View style={BuyerStyle.view_container}>
										<View style={BuyerStyle.image_container}>
											<Image style={BuyerStyle.add_icon} source={Images.address_icon}/>
										</View>
										<View style={BuyerStyle.boxes_textbox_container}>
											<TextInput selectTextOnFocus={ true } style={BuyerStyle.text_input} placeholder='Address' underlineColorAndroid='transparent' onChangeText={(value) => this.setState({mailing_address: value})} value={this.state.mailing_address.toString()}/>
											<View style={BuyerStyle.fullunderline}></View>
										</View>
									</View>
									<View style={BuyerStyle.view_container}>
										<View style={BuyerStyle.image_container}>
										</View>
										<View style={BuyerStyle.boxes_textbox_container}>
											<TextInput selectTextOnFocus={ true } style={BuyerStyle.text_input} placeholder='State' underlineColorAndroid='transparent' onChangeText={(value) => this.setState({user_state: this.onChange(value)})} value={this.state.user_state.toString()}/>
											<View style={BuyerStyle.fullunderline}></View>
										</View>
									</View>
									<View style={BuyerStyle.view_container}>
										<View style={BuyerStyle.image_container}></View>
										<View style={BuyerStyle.boxes_textbox_container}>
											<TextInput selectTextOnFocus={ true } style={BuyerStyle.text_input} placeholder='Zip Code' underlineColorAndroid='transparent' onChangeText={(value) => this.setState({postal_code: this.onChange(value)})} onEndEditing={ (event) => this.updatePostalCode(event.nativeEvent.text,'postal_code') } value={this.state.postal_code.toString()}/>
											<View style={BuyerStyle.fullunderline}></View>
										</View>
									</View>
								</View>
								<View style={[BuyerStyle.subheaderbox,{marginLeft:'2%'}]}>                                    
									<View style={BuyerStyle.sales_pr_Container}>
										<Text style={BuyerStyle.sales_pr_label}>{STRINGS.t('Buyer_Sales_Price')}</Text>
										<View style={BuyerStyle.salesPriceValue}>
											<View style={BuyerStyle.dollaricon}>
												<Text style={BuyerStyle.dollar}>$ </Text>
												<TextInput selectTextOnFocus={ true } name="sale_pr" keyboardType="numeric" underlineColorAndroid = 'transparent' style={BuyerStyle.sales_pr} onFocus={() => this.onFocus('sale_pr')} onChangeText={(value) => this.setState({sale_pr: this.onChange(value)})} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'sale_pr', this.onChangeRate.bind(this,event.nativeEvent.text,"sale_pr")) } value={this.delimitNumbers(this.state.sale_pr)}/>
											</View>
											<View style={BuyerStyle.fullunderline}></View>
										</View>
									</View>
								</View>
							</View>
							<View style={BuyerStyle.segmentContainer}>
							
								<View style={BuyerStyle.segmentView}>
									<View style={BuyerStyle.segmentButtonBackgroundView}>
										<TouchableOpacity style={BuyerStyle.segmentButton} onPress={() => this.settingsApi("FHA")}>
										{renderIf(this.state.tab != 'FHA')(
										<Text style={BuyerStyle.style_btnText}>{STRINGS.t('FHA')}</Text>
										)}
										{renderIf(this.state.tab == 'FHA')(
										<Text style={BuyerStyle.style_btnTextSelect}>{STRINGS.t('FHA')}</Text>
										)}
										</TouchableOpacity>
										{renderIf(this.state.tab != 'FHA')(
										<View style={BuyerStyle.horizonatlLineForSegment}></View>
										)}
										{renderIf(this.state.tab == 'FHA')(
										<View style={BuyerStyle.horizonatlLineForSegmentSelect}></View>
										)}
									</View>

									<View style={BuyerStyle.verticalLineForSegment}></View>

									<View style={BuyerStyle.segmentButtonBackgroundView}>
										<TouchableOpacity style={BuyerStyle.segmentButton} onPress={() => this.settingsApi("VA")}>
										{renderIf(this.state.tab != 'VA')(
										<Text style={BuyerStyle.style_btnText}>{STRINGS.t('VA')}</Text>
										)}
										{renderIf(this.state.tab == 'VA')(
										<Text style={BuyerStyle.style_btnTextSelect}>{STRINGS.t('VA')}</Text>
										)}
										</TouchableOpacity>
										{renderIf(this.state.tab != 'VA')(
										<View style={BuyerStyle.horizonatlLineForSegment}></View>
										)}
										{renderIf(this.state.tab == 'VA')(
										<View style={BuyerStyle.horizonatlLineForSegmentSelect}></View>
										)}
									</View>

									<View style={BuyerStyle.verticalLineForSegment}></View>

									<View style={BuyerStyle.segmentButtonBackgroundView}>
										<TouchableOpacity style={BuyerStyle.segmentButton} onPress={() => this.settingsApi("USDA")}>
										{renderIf(this.state.tab != 'USDA')(
										<Text style={BuyerStyle.style_btnText}>{STRINGS.t('USDA')}</Text>
										)}
										{renderIf(this.state.tab == 'USDA')(
										<Text style={BuyerStyle.style_btnTextSelect}>{STRINGS.t('USDA')}</Text>
										)}
										</TouchableOpacity>
										{renderIf(this.state.tab != 'USDA')(
										<View style={BuyerStyle.horizonatlLineForSegment}></View>
										)}
										{renderIf(this.state.tab == 'USDA')(
										<View style={BuyerStyle.horizonatlLineForSegmentSelect}></View>
										)}
									</View>

									<View style={BuyerStyle.verticalLineForSegment}></View>

									<View style={BuyerStyle.segmentButtonBackgroundView}>
										<TouchableOpacity style={BuyerStyle.segmentButton} onPress={() => this.settingsApi("CONV")}>
										{renderIf(this.state.tab != 'CONV')(
										<Text style={BuyerStyle.style_btnText}>{STRINGS.t('Conv')}</Text>
										)}
										{renderIf(this.state.tab == 'CONV')(
										<Text style={BuyerStyle.style_btnTextSelect}>{STRINGS.t('Conv')}</Text>
										)}
										</TouchableOpacity>
										{renderIf(this.state.tab != 'CONV')(
										<View style={BuyerStyle.horizonatlLineForSegment}></View>
										)}
										{renderIf(this.state.tab == 'CONV')(
										<View style={BuyerStyle.horizonatlLineForSegmentSelect}></View>
										)}
									</View>

									<View style={BuyerStyle.verticalLineForSegment}></View>
									<View style={BuyerStyle.segmentButtonBackgroundView}>
										<TouchableOpacity style={BuyerStyle.segmentButton} onPress={() => this.settingsApi("CASH")}>
										{renderIf(this.state.tab != 'CASH')(
										<Text style={BuyerStyle.style_btnText}>{STRINGS.t('Cash')}</Text>
										)}
										{renderIf(this.state.tab == 'CASH')(
										<Text style={BuyerStyle.style_btnTextSelect}>{STRINGS.t('Cash')}</Text>
										)}
										</TouchableOpacity>
										{renderIf(this.state.tab != 'CASH')(
										<View style={BuyerStyle.horizonatlLineForSegment}></View>
										)}
										{renderIf(this.state.tab == 'CASH')(
										<View style={BuyerStyle.horizonatlLineForSegmentSelect}></View>
										)}
									</View>
								</View>
							<View style={[BuyerStyle.textViewContainer, {paddingTop:10}]}>
								<Text style={[BuyerStyle.schollheadtext,{marginLeft:'20%',width:'45%', textAlign:'left'}]}>{STRINGS.t('total_monthly_payment')}  </Text>
								<TextInput selectTextOnFocus={ true } keyboardType="numeric" style={[BuyerStyle.schollheadtext,{width:'55%'}]} onFocus={() => this.onFocus('totalMonthlyPayment')} onChangeText={(value) => this.setState({totalMonthlyPayment: this.onChange(value)})} value={'$ '+this.state.totalMonthlyPayment.toString()}  underlineColorAndroid='transparent'/>
							</View>
							<View style={BuyerStyle.textViewContainer}>
								<Text style={[BuyerStyle.schollheadtext,{marginLeft:'20%',width:'45%', textAlign:'left'}]}>{STRINGS.t('total_investment')}  </Text>
								<Text style={[BuyerStyle.schollheadtext,{width:'55%'}]}> $ {this.state.totalInvestment} </Text>
							</View>
							</View>
						</View>
						<View style={(this.state.initialOrientation == 'portrait') ? ((this.state.orientation == 'portrait') ? BuyerStyle.scrollviewheight : BuyerStyle.scrollviewheightlandscape): ((this.state.orientation == 'landscape') ? BuyerStyle.scrollviewheight : BuyerStyle.scrollviewheightlandscape)}>
							<ScrollView
								showsVerticalScrollIndicator={true}
								keyboardShouldPersistTaps="always"
								keyboardDismissMode='on-drag'
								style={BuyerStyle.sellerscrollview}
							>    
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
								{renderIf(this.state.tab == 'CONV')(
									<View style={BuyerStyle.loandetailhead}>
										<View style={BuyerStyle.existingfirst}>
											<Text style={BuyerStyle.existingheadtext}>{STRINGS.t('ltv')}</Text>
										</View>
										<View style={BuyerStyle.existingfirstbalance}>
											<View style={{width:'100%',flexDirection:'row'}}>
												<Text style={BuyerStyle.existingtext}>%</Text>
												<TextInput selectTextOnFocus={ true } keyboardType="numeric" returnKeyType ="next" style={[BuyerStyle.width70,{alignSelf:'center'}]} underlineColorAndroid='transparent'  onFocus={() => this.onFocus('ltv')} onChangeText={(value) => this.setState({ltv: this.onChange(value)})} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'ltv', this.onChangeRate.bind(this,event.nativeEvent.text,"ltv")) } value={this.state.ltv.toString()} />
											</View>
											<View style={BuyerStyle.textboxunderline}>
												<View style={[BuyerStyle.fullunderline, ]}></View>
											</View>
										</View>
										<View style={BuyerStyle.existingfirstbalance}>
											<View style={{width:'100%',flexDirection:'row'}}>
												<Text style={BuyerStyle.existingtext}>%</Text>
												<TextInput selectTextOnFocus={ true } 
													keyboardType="numeric" 
													returnKeyType ="next" 
													style={[BuyerStyle.width70,{alignSelf:'center'}]} 
													underlineColorAndroid='transparent' 
													onFocus={() => this.onFocus('ltv2')}
													onChangeText={(value) => this.setState({ltv2: this.onChange(value)})} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'ltv2', this.onChangeRate.bind(this,event.nativeEvent.text,"ltv2")) }
													value={this.state.ltv2.toString()} 
												/>
											</View>
											<View style={BuyerStyle.textboxunderline}>
												<View style={[BuyerStyle.fullunderline, ]}></View>
											</View>
										</View>
									</View>
								)}	
								{renderIf(this.state.tab != 'CASH')(
									<View style={BuyerStyle.loandetailhead}>
										<View style={BuyerStyle.existingfirst}>
											<Text style={BuyerStyle.existingheadtext}>{STRINGS.t('rate')}</Text>
										</View>
										<View style={BuyerStyle.existingfirstbalance}>
											<View style={{width:'100%',flexDirection:'row'}}>
											<Text style={BuyerStyle.existingtext}>%</Text>
												<TextInput selectTextOnFocus={ true } 
													keyboardType="numeric" 
													returnKeyType ="next" style={[BuyerStyle.width70,{alignSelf:'center'}]} 
													underlineColorAndroid='transparent'  
													onFocus={() => this.onFocus('todaysInterestRate')} 
													onChangeText={(value) => this.setState({todaysInterestRate: this.onChange(value)})} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'todaysInterestRate', this.callSalesPr) }
													value={this.state.todaysInterestRate.toString()} 
												/>
											</View>
											<View style={BuyerStyle.textboxunderline}>
												<View style={[BuyerStyle.fullunderline, ]}></View>
											</View>
										</View>
										{(this.state.ltv2 > 0 && this.state.tab == 'CONV') ?
										<View style={BuyerStyle.existingfirstbalance}>
										
											<View style={{width:'100%',flexDirection:'row'}}>
											<Text style={BuyerStyle.existingtext}>%</Text>
												<TextInput selectTextOnFocus={ true } 
													keyboardType="numeric"
													editable= {(this.state.ltv2 > 0) ? true : false} 
													returnKeyType ="next" 
													style={[BuyerStyle.width70,{alignSelf:'center'}]} 
													underlineColorAndroid='transparent'
													onFocus={() => this.onFocus('todaysInterestRate1')}
													onChangeText={(value) => this.setState({todaysInterestRate1: this.onChange(value)})} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'todaysInterestRate1', this.callSalesPr) }
													value={this.state.todaysInterestRate1.toString()} 
												/>
											</View>
											<View style={BuyerStyle.textboxunderline}>
												<View style={[BuyerStyle.fullunderline, ]}></View>
											</View>
											
										</View>
										: false} 	
									</View>
									
								)}	
								{renderIf(this.state.tab != 'CASH')(
									<View style={BuyerStyle.loandetailhead}>
										<View style={BuyerStyle.existingfirst}>
											<Text style={BuyerStyle.existingheadtext}>{STRINGS.t('term')}</Text>
										</View>
										<View style={BuyerStyle.existingfirstbalance}>
											<View style={{width:'100%',flexDirection:'row'}}>
												<TextInput selectTextOnFocus={ true } 
													keyboardType="numeric" 
													returnKeyType ="next" style={[BuyerStyle.width70,{alignSelf:'center'}]} 
													underlineColorAndroid='transparent'  
													onFocus={() => this.onFocus('termsOfLoansinYears')} 
													onChangeText={(value) => this.setState({termsOfLoansinYears: this.onChange(value)})} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'termsOfLoansinYears', this.callSalesPr) }
													value={this.state.termsOfLoansinYears.toString()}
												/>
											</View>
											<View style={BuyerStyle.textboxunderline}>
												<View style={[BuyerStyle.fullunderline, ]}></View>
											</View>
										</View>
										{(this.state.ltv2 > 0 && this.state.tab == 'CONV') ?
										<View style={BuyerStyle.existingfirstbalance}>
											<View style={{width:'100%',flexDirection:'row'}}>
												<TextInput selectTextOnFocus={ true } 
													keyboardType="numeric" 
													returnKeyType ="next" 
													editable= {(this.state.ltv2 > 0) ? true : false} 
													style={[BuyerStyle.width70,{alignSelf:'center'}]} 
													underlineColorAndroid='transparent'  
													onFocus={() => this.onFocus('termsOfLoansinYears2')} 
													onChangeText={(value) => this.setState({termsOfLoansinYears2: this.onChange(value)})} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'termsOfLoansinYears2', this.callSalesPr) }
													value={this.state.termsOfLoansinYears2.toString()}
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
											<Text style={[BuyerStyle.schollheadtext,{marginLeft:'20%',width:'45%', textAlign:'left'}]}>{STRINGS.t('base_loan_amount')}  </Text>
											<TextInput selectTextOnFocus={ true } keyboardType="numeric" style={[BuyerStyle.schollheadtext,{width:'55%'}]} value={'$ '+this.state.base_loan_amt.toString()}  underlineColorAndroid='transparent'/>
										</View>
									</View>
								)}	
								{renderIf(this.state.tab == 'CONV')(	
									<View>
										<View style={[BuyerStyle.fullunderline, {marginTop:10}]}></View>
										<View style={[BuyerStyle.loandetailhead,{marginTop:10}]}>
											<View style={BuyerStyle.existingfirst}>
												<Text style={[BuyerStyle.loanstext,{marginTop:0,marginLeft:10}]}>{STRINGS.t('loan_amount')}</Text>
											</View>
											<View style={BuyerStyle.existingfirstbalance}>
												<View style={{width:'100%',flexDirection:'row'}}>
													<Text style={BuyerStyle.alignCenter}>$ </Text>
													<TextInput selectTextOnFocus={ true } 
														keyboardType="numeric" 
														returnKeyType ="next" 
														style={[BuyerStyle.width70,{alignSelf:'center'}]} 
														underlineColorAndroid='transparent'  
														onFocus={() => this.onFocus('loan_amt')} 
														onChangeText={(value) => this.setState({loan_amt: this.onChange(value)})}
														onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'loan_amt') }
														value={this.state.loan_amt.toString()}
													/>
												</View>
												<View style={BuyerStyle.textboxunderline}>
													<View style={[BuyerStyle.fullunderline, ]}></View>
												</View>
											</View>
											<View style={BuyerStyle.existingfirstbalance}>
												<View style={{width:'100%',flexDirection:'row'}}>
												<Text style={BuyerStyle.alignCenter}>$ </Text>
													<Text style={[BuyerStyle.width70,{alignSelf:'center'}]}>{this.state.loan_amt2.toString()}</Text>
												</View>
												<View style={BuyerStyle.textboxunderline}>
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
									<View>
										<View style={[BuyerStyle.textViewContainer, {paddingTop:10}]}>
											<Text style={[BuyerStyle.schollheadtext,{marginLeft:'20%',width:'45%', textAlign:'left'}]}>{STRINGS.t('adjusted_loan_amount')}  </Text>
											<TextInput selectTextOnFocus={ true } keyboardType="numeric" style={[BuyerStyle.schollheadtext,{width:'55%'}]} value={'$ '+this.state.adjusted_loan_amt.toString()}  underlineColorAndroid='transparent'/>
										</View>
									</View>	
								)}	

								<View style={[BuyerStyle.loandetailhead,{paddingLeft:10, paddingRight:10}]}>
									<View style={BuyerStyle.title_justify}>
										<Text style={BuyerStyle.text_style}>{STRINGS.t('down_payment')}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={BuyerStyle.alignrightinput}>
											<Text style={BuyerStyle.alignCenter}>$ </Text>
											<TextInput selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onFocus={() => this.onFocus('down_payment')}  onChangeText={(value) => this.setState({down_payment: this.onChange(value)})} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'down_payment',this.downPaymentChange.bind(this,event.nativeEvent.text)) } value={this.delimitNumbers(this.state.down_payment)}/>
										</View>
										<View style={[BuyerStyle.fullunderline, ]}></View>
									</View>
								</View>    
								<View style={[BuyerStyle.loandetailhead,{paddingLeft:10, paddingRight:10}]}>
									<View style={BuyerStyle.title_justify}>
										<Text style={BuyerStyle.text_style}>{STRINGS.t('annual_prop_tax')}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={BuyerStyle.alignrightinput}>
											<Text style={BuyerStyle.alignCenter}>$ </Text>
											<TextInput selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} onFocus={() => this.onFocus('annualPropertyTax')} onChangeText={(value) => this.setState({annualPropertyTax: this.onChange(value)})} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'annualPropertyTax',this.changeAnnualTax) } value={this.state.annualPropertyTax.toString()} underlineColorAndroid='transparent'/>
										</View>
										<View style={[BuyerStyle.fullunderline, ]}></View>
									</View>
								</View> 
								<View style={[BuyerStyle.loandetailhead,{paddingLeft:10, paddingRight:10}]}>
									<View style={BuyerStyle.title_justify}>
										<Text style={BuyerStyle.text_style}>{STRINGS.t('est_closing')}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={BuyerStyle.alignrightinput}>
											<DatePicker style={BuyerStyle.width100date} showIcon={false} date={this.state.date} mode="date" placeholder="select date" format="MM-DD-YYYY" minDate={this.state.date1} confirmBtnText="Confirm" cancelBtnText="Cancel" customStyles={{dateInput: {borderWidth:0}}} onDateChange={(date) => this.changeDate(date)} />
										</View>
										<View style={[BuyerStyle.fullunderline, ]}></View>
									</View>
								</View>
								<View style={[BuyerStyle.loandetailhead,{paddingLeft:10, paddingRight:10, marginBottom:20}]}>
									<View style={BuyerStyle.title_justify}>
										<Text style={BuyerStyle.text_style}>{STRINGS.t('est_tax')}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={BuyerStyle.alignrightinput}>
											<Text style={BuyerStyle.alignCenter}>$ </Text>
											<TextInput selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} editable = {false} underlineColorAndroid='transparent' onFocus={() => this.onFocus('estimatedTaxProrations')}  onChangeText={(value) => this.setState({estimatedTaxProrations: this.onChange(value)})} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'estimatedTaxProrations') } value={this.state.estimatedTaxProrations.toString()}/>
										</View>
										<View style={[BuyerStyle.fullunderline, ]}></View>
									</View>
								</View> 
							</ScrollView>
						</View>
					</View>	
			
				)}
				{renderIf(this.state.footer_tab == 'closing_cost')(
					<View style={{height:'100%',width:'100%'}}>
						<View style={BuyerStyle.smallsegmentContainer}>
							<View style={BuyerStyle.segmentView}>                                        
								<View style={BuyerStyle.textViewContainerbig}>
									<Text style={BuyerStyle.schollheadtext}>{STRINGS.t('Total_Closing_Cost')}: $ {this.state.totalClosingCost}  </Text>
								</View>
							</View>
						</View>

						<View style={(this.state.initialOrientation == 'portrait') ? (this.state.orientation == 'portrait') ? BuyerStyle.bigscrollviewheight : BuyerStyle.bigscrollviewheightlandscape : (this.state.orientation == 'landscape') ? BuyerStyle.bigscrollviewheight : BuyerStyle.bigscrollviewheightlandscape}>
							<ScrollView 
								scrollEnabled={true} 
								showsVerticalScrollIndicator={true}  
								keyboardShouldPersistTaps="always" 							
								style={BuyerStyle.sellerscrollview}
								keyboardDismissMode='on-drag'
							>
								<View style={[BuyerStyle.scrollable_container_child, {marginTop:10}]}>
									<View style={BuyerStyle.smalltitle_justify}>
										<Text style={BuyerStyle.text_style}>{STRINGS.t('escrow')}</Text>
									</View>
									<View style={{flexDirection: 'row', width:'25%',justifyContent:'center'}}>
											<ModalDropdown options={this.state.modalDropDownAtions} defaultValue={this.state.escrowPolicyType.toString()}  animated={true} style={{marginRight : 10}} dropdownStyle={{ alignItems: 'center',width: 80,height:115, borderWidth: 1,borderRadius: 2,borderColor: '#ddd',borderBottomWidth: 0,shadowColor: '#000', shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.8,shadowRadius: 2}} onSelect={(idx, value) => this.createEscrowPicker(idx, value)}>
											</ModalDropdown>
											<Image style={{width:9,height:9,top:3}} source={Images.dropdown_arrow}/>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={BuyerStyle.alignrightinput}>
											<Text style={BuyerStyle.alignCenter}>$ </Text>
											<TextInput selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} onChangeText={(value) => this.setState({escrowFee: this.onChange(value)})} 
											onFocus={() => this.onFocus('escrowFee')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'escrowFee',this.calEscrowDataOnChange) }
											value={this.state.escrowFee.toString()} underlineColorAndroid='transparent'/>
										</View>
											<View style={[BuyerStyle.fullunderline ]}></View>
									</View>
								</View> 
								<View style={[BuyerStyle.scrollable_container_child, {marginTop:10}]}>
									<View style={BuyerStyle.smalltitle_justify}>
										<Text style={BuyerStyle.text_style}>{STRINGS.t('owners')}</Text>
									</View>
									<View style={{flexDirection: 'row', width:'25%',justifyContent:'center'}}>
											<ModalDropdown options={this.state.modalDropDownAtions} defaultValue={this.state.ownerPolicyType.toString()}  animated={true} style={{marginRight : 10}} dropdownStyle={{alignItems: 'center',width: 80,height:115, borderWidth: 1,borderRadius: 2,borderColor: '#ddd',borderBottomWidth: 0,shadowColor: '#000', shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.8,shadowRadius: 2}} onSelect={(idx, value) => this.createOwnerPicker(idx, value)}>
											</ModalDropdown>
											<Image style={{width:9,height:9,top:3}} source={Images.dropdown_arrow}/>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={BuyerStyle.alignrightinput}>
											<Text style={BuyerStyle.alignCenter}>$ </Text>
											<TextInput selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} onFocus={() => this.onFocus('ownerFee')} onChangeText={(value) => this.setState({ownerFee: this.onChange(value)})} 
											onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'ownerFee',this.calEscrowDataOnChange) }
											value={this.state.ownerFee.toString()} underlineColorAndroid='transparent'/>
										</View>
											<View style={[BuyerStyle.fullunderline ]}></View>
									</View>
								</View> 
								<View style={[BuyerStyle.scrollable_container_child, {marginTop:10}]}>
									<View style={BuyerStyle.smalltitle_justify}>
										<Text style={BuyerStyle.text_style}>{STRINGS.t('lender')}</Text>
									</View>
									<View style={{flexDirection: 'row', width:'25%',justifyContent:'center'}}>
											<ModalDropdown options={this.state.modalDropDownAtions} defaultValue={this.state.lenderPolicyType.toString()} animated={true} style={{marginRight : 10}} dropdownStyle={{alignItems: 'center',width: 80,height:115, borderWidth: 1,borderRadius: 2,borderColor: '#ddd',borderBottomWidth: 0,shadowColor: '#000', shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.8,shadowRadius: 2}} onSelect={(idx, value) => this.createLenderPicker(idx, value)}>
											</ModalDropdown>
											<Image style={{width:9,height:9,top:3}} source={Images.dropdown_arrow}/>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={BuyerStyle.alignrightinput}>
											<Text style={BuyerStyle.alignCenter}>$ </Text>
											<TextInput selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} onChangeText={(value) => this.setState({lenderFee: this.onChange(value)})} 
											onFocus={() => this.onFocus('lenderFee')}onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'lenderFee',this.calEscrowDataOnChange) }
											value={this.state.lenderFee.toString()} underlineColorAndroid='transparent'/>
										</View>
											<View style={[BuyerStyle.fullunderline ]}></View>
									</View>
									
								</View>
								<View style={[BuyerStyle.fullunderline, {marginTop:10}]}></View>
								{renderIf(this.state.showLoanServiceFee)(
								<View style={[BuyerStyle.scrollable_container_child, {marginTop:10}]}>
									<View style={BuyerStyle.title_justify}>
										<Text style={BuyerStyle.text_style}>{'New Loan Service Fee'}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={BuyerStyle.alignrightinput}>
											<Text style={BuyerStyle.alignCenter}>$ </Text>
											<TextInput selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onFocus={() => this.onFocus('newLoanServiceFee')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'newLoanServiceFee',this.calEscrowDataOnChange) } onChangeText={(value) => this.setState({newLoanServiceFee: this.onChange(value)})} value={this.state.newLoanServiceFee.toString()}/>
										</View>
										<View style={[BuyerStyle.fullunderline, ]}></View>
									</View>
									<View style={[BuyerStyle.fullunderline, {marginTop:10}]}></View>
								</View> 
								
								)}
								{renderIf(this.state.showLoanServiceFee)(
									<View style={[BuyerStyle.fullunderline, {marginTop:10}]}></View>
								)}
								<View style={[BuyerStyle.scrollable_container_child, {marginTop:10}]}>
									<View style={BuyerStyle.smalltitle_justify}>
										<Text style={BuyerStyle.text_style}>{STRINGS.t('discount')}</Text>
									</View>
									<View style={{width:'25%',justifyContent:'center'}}>                                            
										<View style={[BuyerStyle.alignrightinput,{width:'80%',marginLeft:'10%'}]}>
											<Text style={BuyerStyle.alignCenter}>% </Text>
											<TextInput selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onFocus={() => this.onFocus('disc')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'disc',this.onChangeDisc.bind(this,event.nativeEvent.text,"disc")) } onChangeText={(value) => this.setState({disc: this.onChange(value)})} value={this.state.disc.toString()}/>
										</View>
										<View style={[BuyerStyle.fullunderline,{width:'80%',marginLeft:'10%'} ]}></View>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={BuyerStyle.alignrightinput}>
											<Text style={BuyerStyle.alignCenter}>$ </Text>
											<TextInput selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' value={this.state.discAmt.toString()}/>
										</View>
										<View style={[BuyerStyle.fullunderline, ]}></View>
									</View>
								</View> 
								<View style={[BuyerStyle.fullunderline, {marginTop:10}]}></View>								
								<View style={[BuyerStyle.scrollable_container_child, {marginTop:10}]}>
									<View style={BuyerStyle.title_justify}>
										<Text style={BuyerStyle.text_style}>{STRINGS.t('originatin_fees')}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={BuyerStyle.alignrightinput}>
											<Text style={BuyerStyle.alignCenter}>$ </Text>
											<TextInput selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onFocus={() => this.onFocus('originationFee')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'originationFee',this.calTotalClosingCost) } onChangeText={(value) => this.setState({originationFee: this.onChange(value)})} value={this.state.originationFee.toString()}/>
										</View>
										<View style={[BuyerStyle.fullunderline, ]}></View>
									</View>
								</View> 
								<View style={[BuyerStyle.scrollable_container_child, {marginTop:10}]}>
									<View style={BuyerStyle.title_justify}>
										<Text style={BuyerStyle.text_style}>{STRINGS.t('processing_fees')}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={BuyerStyle.alignrightinput}>
											<Text style={BuyerStyle.alignCenter}>$ </Text>
											<TextInput selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onFocus={() => this.onFocus('processingfee')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'processingfee',this.calTotalClosingCost) } onChangeText={(value) => this.setState({processingfee: this.onChange(value)})} value={this.state.processingfee.toString()}/>
										</View>
										<View style={[BuyerStyle.fullunderline, ]}></View>
									</View>
								</View> 
								<View style={[BuyerStyle.scrollable_container_child, {marginTop:10}]}>
									<View style={BuyerStyle.title_justify}>
										<Text style={BuyerStyle.text_style}>{STRINGS.t('tax_service_contact')}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={BuyerStyle.alignrightinput}>
											<Text style={BuyerStyle.alignCenter}>$ </Text>
											<TextInput selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onFocus={() => this.onFocus('taxservicecontract')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'taxservicecontract',this.calTotalClosingCost) } onChangeText={(value) => this.setState({taxservicecontract: this.onChange(value)})} value={this.state.taxservicecontract.toString()}/>
										</View>
										<View style={[BuyerStyle.fullunderline, ]}></View>
									</View>
								</View> 
								<View style={[BuyerStyle.scrollable_container_child, {marginTop:10}]}>
									<View style={BuyerStyle.title_justify}>
										<Text style={BuyerStyle.text_style}>{STRINGS.t('document_prep')}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={BuyerStyle.alignrightinput}>
											<Text style={BuyerStyle.alignCenter}>$ </Text>
											<TextInput selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onFocus={() => this.onFocus('documentprep')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'documentprep',this.calTotalClosingCost) } onChangeText={(value) => this.setState({documentprep: this.onChange(value)},this.calTotalClosingCost)} value={this.state.documentprep.toString()}/>
										</View>
										<View style={[BuyerStyle.fullunderline, ]}></View>
									</View>
								</View> 
								<View style={[BuyerStyle.scrollable_container_child, {marginTop:10}]}>
									<View style={BuyerStyle.title_justify}>
										<Text style={BuyerStyle.text_style}>{STRINGS.t('underwriting')}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={BuyerStyle.alignrightinput}>
											<Text style={BuyerStyle.alignCenter}>$ </Text>
											<TextInput selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onFocus={() => this.onFocus('underwriting')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'underwriting',this.calTotalClosingCost) } onChangeText={(value) => this.setState({underwriting: this.onChange(value)},this.calTotalClosingCost)} value={this.state.underwriting.toString()}/>
										</View>
										<View style={[BuyerStyle.fullunderline, ]}></View>
									</View>
								</View> 
								<View style={[BuyerStyle.scrollable_container_child, {marginTop:10}]}>
									<View style={BuyerStyle.title_justify}>
										<Text style={BuyerStyle.text_style}>{STRINGS.t('appraisal')}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={BuyerStyle.alignrightinput}>
											<Text style={BuyerStyle.alignCenter}>$ </Text>
											<TextInput selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onFocus={() => this.onFocus('appraisalfee')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'appraisalfee',this.calTotalClosingCost) } onChangeText={(value) => this.setState({appraisalfee: this.onChange(value)},this.calTotalClosingCost)} value={this.state.appraisalfee.toString()}/>
										</View>
										<View style={[BuyerStyle.fullunderline, ]}></View>
									</View>
								</View> 
								<View style={[BuyerStyle.scrollable_container_child, {marginTop:10}]}>
									<View style={BuyerStyle.title_justify}>
										<Text style={BuyerStyle.text_style}>{STRINGS.t('credit_report')}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={BuyerStyle.alignrightinput}>
											<Text style={BuyerStyle.alignCenter}>$ </Text>
											<TextInput selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onFocus={() => this.onFocus('creditReport')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'creditReport',this.calTotalClosingCost) } onChangeText={(value) => this.setState({creditReport: this.onChange(value)},this.calTotalClosingCost)} value={this.state.creditReport.toString()}/>
										</View>
										<View style={[BuyerStyle.fullunderline, ]}></View>
									</View>
								</View> 
								<View style={[BuyerStyle.fullunderline, {marginTop:10}]}></View>
								<View style={[BuyerStyle.scrollable_container_child, {marginTop:10}]}>
									<View style={BuyerStyle.title_justify}>
										<Text style={BuyerStyle.text_style}>{this.state.label1.toString()}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={BuyerStyle.alignrightinput}>
											<Text style={BuyerStyle.alignCenter}>$ </Text>
											<TextInput selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onFocus={() => this.onFocus('fee1')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'fee1') } onChangeText={(value) => this.setState({fee1: this.onChange(value)})} value={this.state.fee1.toString()}/>
										</View>
										<View style={[BuyerStyle.fullunderline, ]}></View>
									</View>
								</View> 
								<View style={[BuyerStyle.scrollable_container_child, {marginTop:10}]}>
									<View style={BuyerStyle.title_justify}>
										<Text style={BuyerStyle.text_style}>{this.state.label2.toString()}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={BuyerStyle.alignrightinput}>
											<Text style={BuyerStyle.alignCenter}>$ </Text>
											<TextInput selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onFocus={() => this.onFocus('fee2')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'fee2') }  onChangeText={(value) => this.setState({fee2: this.onChange(value)})} value={this.state.fee2.toString()}/>
										</View>
										<View style={[BuyerStyle.fullunderline, ]}></View>
									</View>
								</View> 
								<View style={[BuyerStyle.scrollable_container_child, {marginTop:10}]}>
									<View style={BuyerStyle.title_justify}>
										<Text style={BuyerStyle.text_style}>{this.state.label3.toString()}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={BuyerStyle.alignrightinput}>
											<Text style={BuyerStyle.alignCenter}>$ </Text>
											<TextInput selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onFocus={() => this.onFocus('fee3')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'fee3') }  onChangeText={(value) => this.setState({fee3: this.onChange(value)})} value={this.state.fee3.toString()}/>
										</View>
										<View style={[BuyerStyle.fullunderline, ]}></View>
									</View>
								</View> 
								<View style={[BuyerStyle.scrollable_container_child, {marginTop:10}]}>
									<View style={BuyerStyle.title_justify}>
										<Text style={BuyerStyle.text_style}>{this.state.label4.toString()}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={BuyerStyle.alignrightinput}>
											<Text style={BuyerStyle.alignCenter}>$ </Text>
											<TextInput selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onFocus={() => this.onFocus('fee4')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'fee4') }  onChangeText={(value) => this.setState({fee4: this.onChange(value)})} value={this.state.fee4.toString()}/>
										</View>
										<View style={[BuyerStyle.fullunderline, ]}></View>
									</View>
								</View> 
								<View style={[BuyerStyle.scrollable_container_child, {marginTop:10}]}>
									<View style={BuyerStyle.title_justify}>
										<Text style={BuyerStyle.text_style}>{this.state.label5.toString()}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={BuyerStyle.alignrightinput}>
											<Text style={BuyerStyle.alignCenter}>$ </Text>
											<TextInput selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onFocus={() => this.onFocus('fee5')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'fee5') }  onChangeText={(value) => this.setState({fee5: this.onChange(value)})} value={this.state.fee5.toString()}/>
										</View>
										<View style={[BuyerStyle.fullunderline, ]}></View>
									</View>
								</View> 
								<View style={[BuyerStyle.scrollable_container_child, {marginTop:10}]}>
									<View style={BuyerStyle.title_justify}>
										<Text style={BuyerStyle.text_style}>{this.state.label6.toString()}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={BuyerStyle.alignrightinput}>
											<Text style={BuyerStyle.alignCenter}>$ </Text>
											<TextInput selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onFocus={() => this.onFocus('fee6')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'fee6') }  onChangeText={(value) => this.setState({fee6: this.onChange(value)})} value={this.state.fee6.toString()}/>
										</View>
										<View style={[BuyerStyle.fullunderline, ]}></View>
									</View>
								</View> 
								<View style={[BuyerStyle.scrollable_container_child, {marginTop:10}]}>
									<View style={BuyerStyle.title_justify}>
										<Text style={BuyerStyle.text_style}>{this.state.label7.toString()}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={BuyerStyle.alignrightinput}>
											<Text style={BuyerStyle.alignCenter}>$ </Text>
											<TextInput selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onFocus={() => this.onFocus('fee7')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'fee7') }  onChangeText={(value) => this.setState({fee7: this.onChange(value)})} value={this.state.fee7.toString()}/>
										</View>
										<View style={[BuyerStyle.fullunderline, ]}></View>
									</View>
								</View> 
								<View style={[BuyerStyle.scrollable_container_child, {marginTop:10}]}>
									<View style={BuyerStyle.title_justify}>
										<Text style={BuyerStyle.text_style}>{this.state.label8.toString()}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={BuyerStyle.alignrightinput}>
											<Text style={BuyerStyle.alignCenter}>$ </Text>
											<TextInput selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onFocus={() => this.onFocus('fee8')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'fee8') }  onChangeText={(value) => this.setState({fee8: this.onChange(value)})} value={this.state.fee8.toString()}/>
										</View>
										<View style={[BuyerStyle.fullunderline, ]}></View>
									</View>
								</View> 				
								<View style={[BuyerStyle.scrollable_container_child, {marginTop:10}]}>
									<View style={BuyerStyle.title_justify}>
										<Text style={BuyerStyle.text_style}>{this.state.label9.toString()}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={BuyerStyle.alignrightinput}>
											<Text style={BuyerStyle.alignCenter}>$ </Text>
											<TextInput selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onFocus={() => this.onFocus('fee9')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'fee9') }  onChangeText={(value) => this.setState({fee9: this.onChange(value)})} value={this.state.fee9.toString()}/>
										</View>
										<View style={[BuyerStyle.fullunderline, ]}></View>
									</View>
								</View> 				
								<View style={[BuyerStyle.scrollable_container_child, {marginTop:10,marginBottom:20}]}>
									<View style={BuyerStyle.title_justify}>
										<Text style={BuyerStyle.text_style}>{this.state.label10.toString()}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={BuyerStyle.alignrightinput}>
											<Text style={BuyerStyle.alignCenter}>$ </Text>
											<TextInput selectTextOnFocus={ true } keyboardType="numeric" style={BuyerStyle.width100} underlineColorAndroid='transparent' onFocus={() => this.onFocus('fee10')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'fee10') }  onChangeText={(value) => this.setState({fee10: this.onChange(value)})} value={this.state.fee10.toString()}/>
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
								<Text style={BuyerStyle.schollheadtext}>{STRINGS.t('Total_Prepaid_items')}: $ {this.state.totalPrepaidItems}  </Text>
							</View>
						</View>
					</View>

					<View style={(this.state.initialOrientation == 'portrait') ? (this.state.orientation == 'portrait') ? BuyerStyle.bigscrollviewheight : BuyerStyle.bigscrollviewheightlandscape : (this.state.orientation == 'landscape') ? BuyerStyle.bigscrollviewheight : BuyerStyle.bigscrollviewheightlandscape}>
						<ScrollView 
							scrollEnabled={true} 
							showsVerticalScrollIndicator={true}  
							keyboardShouldPersistTaps="always" 							
							style={BuyerStyle.sellerscrollview}
							keyboardDismissMode='on-drag'
						>
							<View style={BuyerStyle.fieldcontainer}> 
								<View style={BuyerStyle.fieldcontainersmallfield}>
									<View style={BuyerStyle.alignrightinput}>
										<TextInput editable= {(this.state.tab == "CASH") ? false : true} selectTextOnFocus={ true } keyboardType="numeric" style={[BuyerStyle.width100, {width:'75%'}]} underlineColorAndroid='transparent' onFocus={() => this.onFocus('monTaxVal')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'monTaxVal',this.changePrepaidPageFields) }  onChangeText={(value) => this.setState({monTaxVal: this.onChange(value)})} value={this.state.monTaxVal.toString()}/>
									</View>
									<View style={[BuyerStyle.fullunderline, {width:'78%'}]}></View>
								</View> 
								<View style={BuyerStyle.fieldcontainerlargefield}>
									<Text style={BuyerStyle.fieldcontainerlable}>{STRINGS.t('mon_tax')}</Text>
								</View>
								<View style={BuyerStyle.fieldcontainersmallfield}>
									<View style={BuyerStyle.alignrightinput}>
										<Text style={BuyerStyle.alignCenter}>% </Text>
										<TextInput selectTextOnFocus={ true } keyboardType="numeric" style={[BuyerStyle.width100, {width:'75%'}]} underlineColorAndroid='transparent' onFocus={() => this.onFocus('monTax')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'monTax',this.changePrepaidPageFields) } onChangeText={(value) => this.setState({monTax: this.onChange(value),monTaxFixed: true})} value={this.state.monTax.toString()}/>
									</View>
									<View style={[BuyerStyle.fullunderline, {width:'78%'}]}></View>
								</View> 
								<View style={BuyerStyle.fieldcontainersmallfield}>
									<View style={BuyerStyle.alignrightinput}>
										<Text style={BuyerStyle.alignCenter}>$ </Text>
										<TextInput selectTextOnFocus={ true } keyboardType="numeric" style={[BuyerStyle.width100, {width:'75%'}]} underlineColorAndroid='transparent' onFocus={() => this.onFocus('prepaidMonthTaxes')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'prepaidMonthTaxes',this.changePrepaidPageFields) } onChangeText={(value) => this.setState({prepaidMonthTaxes: this.onChange(value)})} value={this.state.prepaidMonthTaxes.toString()}/>
									</View>
									<View style={[BuyerStyle.fullunderline, {width:'78%'}]}></View>
								</View>
							</View>
							<View style={BuyerStyle.fieldcontainer}> 
								<View style={BuyerStyle.fieldcontainersmallfield}>
									<View style={BuyerStyle.alignrightinput}>
										<TextInput editable= {(this.state.tab == "CASH") ? false : true} selectTextOnFocus={ true } keyboardType="numeric" style={[BuyerStyle.width100, {width:'75%'}]} underlineColorAndroid='transparent' onFocus={() => this.onFocus('numberOfMonthsInsurancePrepaid')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'numberOfMonthsInsurancePrepaid',this.changePrepaidPageFields) } onChangeText={(value) => this.setState({numberOfMonthsInsurancePrepaid: this.onChange(value)})} value={this.state.numberOfMonthsInsurancePrepaid.toString()}/>
									</View>
									<View style={[BuyerStyle.fullunderline, {width:'78%'}]}></View>
								</View> 
								<View style={BuyerStyle.fieldcontainerlargefield}>
									<Text style={BuyerStyle.fieldcontainerlable}>{STRINGS.t('mon_ins')}</Text>
								</View>
								<View style={BuyerStyle.fieldcontainersmallfield}>
									<View style={BuyerStyle.alignrightinput}>
										<Text style={BuyerStyle.alignCenter}>% </Text>
										<TextInput selectTextOnFocus={ true } keyboardType="numeric" style={[BuyerStyle.width100, {width:'75%'}]} underlineColorAndroid='transparent' onFocus={() => this.onFocus('monIns')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'monIns',this.changePrepaidPageFields) } onChangeText={(value) => this.setState({monIns: this.onChange(value),monInsFixed: true})} value={this.state.monIns.toString()}/>
									</View>
									<View style={[BuyerStyle.fullunderline, {width:'78%'}]}></View>
								</View> 
								<View style={BuyerStyle.fieldcontainersmallfield}>
									<View style={BuyerStyle.alignrightinput}>
										<Text style={BuyerStyle.alignCenter}>$ </Text>
										<TextInput selectTextOnFocus={ true } keyboardType="numeric" style={[BuyerStyle.width100, {width:'75%'}]} underlineColorAndroid='transparent' onFocus={() => this.onFocus('monthInsuranceRes')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'monthInsuranceRes') } onChangeText={(value) => this.setState({monthInsuranceRes: this.onChange(value)})} value={this.state.monthInsuranceRes.toString()}/>
									</View>
									<View style={[BuyerStyle.fullunderline, {width:'78%'}]}></View>
								</View>
							</View>
							<View style={BuyerStyle.fieldcontainer}> 
								<View style={BuyerStyle.fieldcontainersmallfield}>
									<View style={BuyerStyle.alignrightinput}>
										<TextInput editable= {(this.state.tab == "CASH") ? false : true} selectTextOnFocus={ true } keyboardType="numeric" style={[BuyerStyle.width100, {width:'75%'}]} underlineColorAndroid='transparent' onFocus={() => this.onFocus('numberOfDaysPerMonth')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'numberOfDaysPerMonth',this.changeDayInterestPrice) } onChangeText={(value) => this.setState({numberOfDaysPerMonth: this.onChange(value,numberOfDaysPerMonthFixed: true)})} value={this.state.numberOfDaysPerMonth.toString()}/>
									</View>
									<View style={[BuyerStyle.fullunderline, {width:'78%'}]}></View>
								</View> 
								<View style={BuyerStyle.fieldcontainerlargefield}>
									<Text style={BuyerStyle.fieldcontainerlable}>{STRINGS.t('days_interest')}</Text>
								</View>
								<View style={BuyerStyle.fieldcontainersmallfield}>
								</View> 
								<View style={BuyerStyle.fieldcontainersmallfield}>
									<View style={BuyerStyle.alignrightinput}>
										<Text style={BuyerStyle.alignCenter}>$ </Text>
										<TextInput selectTextOnFocus={ true } keyboardType="numeric" style={[BuyerStyle.width100, {width:'75%'}]} underlineColorAndroid='transparent' onFocus={() => this.onFocus('daysInterest')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'daysInterest') } onChangeText={(value) => this.setState({daysInterest: this.onChange(value)})} value={this.state.daysInterest.toString()}/>
									</View>
									<View style={[BuyerStyle.fullunderline, {width:'78%'}]}></View>
								</View>
							</View>
							{renderIf(this.state.tab == 'CONV')(
								<View style={BuyerStyle.fieldcontainer}>
									<View style={BuyerStyle.fieldcontainerlargefieldPrepaid}>
										<Text style={BuyerStyle.fieldcontainerlable}>{STRINGS.t('2_month_pmi')}</Text>
									</View> 
									<View style={BuyerStyle.fieldcontainersmallfield}></View>
									<View style={BuyerStyle.fieldcontainersmallfield}></View> 
									<View style={BuyerStyle.fieldcontainersmallfield}>
										<View style={BuyerStyle.alignrightinput}>
											<Text style={BuyerStyle.alignCenter}>$ </Text>
											<TextInput selectTextOnFocus={ true } keyboardType="numeric" style={[BuyerStyle.width100, {width:'75%'}]} underlineColorAndroid='transparent' onFocus={() => this.onFocus('monthPmiVal')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'monthPmiVal', this.calTotalPrepaidItems) } onChangeText={(value) => this.setState({monthPmiVal : this.onChange(value)})} value={this.state.monthPmiVal.toString()}/>
										</View>
										<View style={[BuyerStyle.fullunderline, {width:'78%'}]}></View>
									</View>
								</View>
								
							)}
							{renderIf(this.state.tab == 'FHA')(
								<View style={BuyerStyle.fieldcontainer}> 
									<View style={BuyerStyle.fieldcontainersmallfield}>
										<View style={BuyerStyle.alignrightinput}>
											<TextInput selectTextOnFocus={ true } keyboardType="numeric" style={[BuyerStyle.width100, {width:'75%'}]} underlineColorAndroid='transparent' onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'FhaMipFin1') } onFocus={() => this.onFocus('FhaMipFin1')} onChangeText={(value) => this.setState({FhaMipFin1: this.onChange(value)})} value={this.state.FhaMipFin1.toString()}/>
										</View>
										<View style={[BuyerStyle.fullunderline, {width:'78%'}]}></View>
									</View> 
									<View style={BuyerStyle.fieldcontainersmallfield}>
										<Text style={BuyerStyle.fieldcontainerlable}>{STRINGS.t('FHA_Mip')} {STRINGS.t('Fin')} </Text>
									</View>
									<View style={BuyerStyle.fieldcontainersmallfield}>
										<CheckBox containerStyle={{backgroundColor:'#ffffff', borderWidth:0}} center checkedColor='#CECECE' checked={this.state.isChecked} onPress={this.handlePressCheckedBox}/>
									</View>
									<View style={BuyerStyle.fieldcontainersmallfield}>
									</View> 
									<View style={BuyerStyle.fieldcontainersmallfield}>
										<View style={BuyerStyle.alignrightinput}>
											<Text style={BuyerStyle.alignCenter}>$ </Text>
											{this.state.isChecked ? (
												<TextInput selectTextOnFocus={ true } keyboardType="numeric" style={[BuyerStyle.width100, {width:'75%'}]} underlineColorAndroid='transparent' onFocus={() => this.onFocus('FhaMipFin2')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'FhaMipFin2') } onChangeText={(value) => this.setState({FhaMipFin2: this.onChange(value)})} value={this.state.FhaMipFin2.toString()}/> ): (
												<TextInput selectTextOnFocus={ true } keyboardType="numeric" style={[BuyerStyle.width100, {width:'75%'}]} underlineColorAndroid='transparent' onFocus={() => this.onFocus('FhaMipFin')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'FhaMipFin') }  onChangeText={(value) => this.setState({FhaMipFin: this.onChange(value)})} value={this.state.FhaMipFin.toString()}/>
											)}
										</View>
										<View style={[BuyerStyle.fullunderline, {width:'78%'}]}></View>
									</View>
								</View>	
							)}
							{renderIf(this.state.tab == 'VA')(
								<View style={BuyerStyle.fieldcontainer}> 
									<View style={BuyerStyle.fieldcontainersmallfield}>
										<View style={BuyerStyle.alignrightinput}>
											{this.state.isCheckedVA ? (
												<TextInput selectTextOnFocus={ true } keyboardType="numeric" style={[BuyerStyle.width100, {width:'75%'}]} underlineColorAndroid='transparent' onFocus={() => this.onFocus('VaFfFin1')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'VaFfFin1') } onChangeText={(value) => this.setState({VaFfFin1: this.onChange(value)})} value={this.state.VaFfFin1.toString()}/> ) : (
												<TextInput selectTextOnFocus={ true } keyboardType="numeric" style={[BuyerStyle.width100, {width:'75%'}]} underlineColorAndroid='transparent' value='0.00'/>	
											)}
										</View>
										<View style={[BuyerStyle.fullunderline, {width:'78%'}]}></View>
									</View> 
									<View style={BuyerStyle.fieldcontainersmallfield}>
										<Text style={BuyerStyle.fieldcontainerlable}>{STRINGS.t('VA_FF_Fin')}  </Text>
									</View>
									<View style={BuyerStyle.fieldcontainersmallfield}>
										<CheckBox containerStyle={{backgroundColor:'#ffffff', borderWidth:0}} center checkedColor='#CECECE' checked={this.state.isCheckedVA} onPress={this.handlePressVACheckedBox}/>
									</View>
									<View style={BuyerStyle.fieldcontainersmallfield}>
										<View style={[BuyerStyle.alignrightinput, {width:'75%'}]}>
											<Text style={BuyerStyle.alignCenter}>$ </Text>
											<TextInput selectTextOnFocus={ true } keyboardType="numeric" onFocus={() => this.onFocus('Vaff')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'Vaff',this.callSalesPr) } onChangeText={(value) => this.setState({Vaff: this.onChange(value)})} value={this.state.Vaff.toString()} style={BuyerStyle.width100} underlineColorAndroid='transparent' />
										</View>
										<View style={[BuyerStyle.fullunderline, {width:'78%'}]}></View>
									</View> 
									<View style={BuyerStyle.fieldcontainersmallfield}>
										<View style={BuyerStyle.alignrightinput}>
											<Text style={BuyerStyle.alignCenter}>$ </Text>
											{this.state.isCheckedVA ? (
												<TextInput selectTextOnFocus={ true } keyboardType="numeric" style={[BuyerStyle.width100, {width:'75%'}]} underlineColorAndroid='transparent' onFocus={() => this.onFocus('VaFfFin2')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'VaFfFin2') } onChangeText={(value) => this.setState({VaFfFin2: this.onChange(value)})} value={this.state.VaFfFin2.toString()}/> ): (
												<TextInput selectTextOnFocus={ true } keyboardType="numeric" style={[BuyerStyle.width100, {width:'75%'}]} underlineColorAndroid='transparent' onFocus={() => this.onFocus('VaFfFin')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'VaFfFin') } onChangeText={(value) => this.setState({VaFfFin: this.onChange(value)})} value={this.state.VaFfFin.toString()}/>
											)}
										</View>
										<View style={[BuyerStyle.fullunderline, {width:'78%'}]}></View>
									</View>
								</View>	
							)}
							{renderIf(this.state.tab == 'USDA')(
								<View style={BuyerStyle.fieldcontainer}> 
									<View style={BuyerStyle.fieldcontainersmallfield}>
										<View style={BuyerStyle.alignrightinput}>
											<TextInput selectTextOnFocus={ true } keyboardType="numeric" style={[BuyerStyle.width100, {width:'75%'}]} underlineColorAndroid='transparent' onFocus={() => this.onFocus('UsdaMipFinance1')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'UsdaMipFinance1') } onChangeText={(value) => this.setState({UsdaMipFinance1: this.onChange(value)})} value={this.state.UsdaMipFinance1.toString()}/>
										</View>
										<View style={[BuyerStyle.fullunderline, {width:'78%'}]}></View>
									</View> 
									<View style={BuyerStyle.fieldcontainersmallfield}>
										<Text style={BuyerStyle.fieldcontainerlable}>{STRINGS.t('MIP')} {STRINGS.t('Fin')} </Text>
									</View>
									<View style={BuyerStyle.fieldcontainersmallfield}>
										<CheckBox containerStyle={{backgroundColor:'#ffffff', borderWidth:0}} center checkedColor='#CECECE' checked={this.state.isCheckedUSDA} onPress={this.handlePressUSDACheckedBox}/>
									</View>
									<View style={BuyerStyle.fieldcontainersmallfield}>
										
									</View> 
									<View style={BuyerStyle.fieldcontainersmallfield}>
										<View style={BuyerStyle.alignrightinput}>
											<Text style={BuyerStyle.alignCenter}>$ </Text>
											{this.state.isCheckedUSDA ? (
												<TextInput selectTextOnFocus={ true } keyboardType="numeric" style={[BuyerStyle.width100, {width:'75%'}]} underlineColorAndroid='transparent' onFocus={() => this.onFocus('UsdaMipFinance2')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'UsdaMipFinance2') } onChangeText={(value) => this.setState({UsdaMipFinance2: this.onChange(value)})} value={this.state.UsdaMipFinance2.toString()}/> ): (
												<TextInput selectTextOnFocus={ true } keyboardType="numeric" style={[BuyerStyle.width100, {width:'75%'}]} underlineColorAndroid='transparent' onFocus={() => this.onFocus('UsdaMipFinance')}  onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'UsdaMipFinance') } onChangeText={(value) => this.setState({UsdaMipFinance: this.onChange(value)})} value={this.state.UsdaMipFinance.toString()}/>
											)}
										</View>
										<View style={[BuyerStyle.fullunderline, {width:'78%'}]}></View>
									</View>
								</View>	
							)}						
							<View style={[BuyerStyle.fullunderline, {marginTop:20}]}></View>
							<View style={[BuyerStyle.fieldcontainer, {marginTop:20}]}>
								<View style={BuyerStyle.costcontainer}>
									<Text style={BuyerStyle.costprepaidamttext}>{STRINGS.t('cost')}</Text>
									<Text style={[BuyerStyle.width100, {width:'90%',marginTop:20}]}>{this.state.twoMonthsPmi1.toString()}</Text>
								</View>
								<View style={BuyerStyle.amountcontainer}>
									<Text style={BuyerStyle.costamttext}>{STRINGS.t('amount')}</Text>
									<View style={{flexDirection:'row',width:'90%',marginTop:20}}>
										<Text style={BuyerStyle.alignCenter}>$</Text>
										<TextInput selectTextOnFocus={ true } keyboardType="numeric" style={[BuyerStyle.width100, {width:'90%'}]} underlineColorAndroid='transparent' onFocus={() => this.onFocus('costOther')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'costOther',this.calTotalPrepaidItems) } onChangeText={(value) => this.setState({costOther: this.onChange(value),costOtherFixed: true})} value={this.state.costOther.toString()}/>
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
								<Text style={BuyerStyle.schollheadtext}>{STRINGS.t('total_monthly_payment')}: $ {this.state.totalMonthlyPayment}  </Text>
							</View>
						</View>
					</View>

					<View style={(this.state.initialOrientation == 'portrait') ? (this.state.orientation == 'portrait') ? BuyerStyle.bigscrollviewheight : BuyerStyle.bigscrollviewheightlandscape : (this.state.orientation == 'landscape') ? BuyerStyle.bigscrollviewheight : BuyerStyle.bigscrollviewheightlandscape}>
						<ScrollView 
							scrollEnabled={true} 
							showsVerticalScrollIndicator={true}  
							keyboardShouldPersistTaps="always" 							
							style={BuyerStyle.sellerscrollview}
							keyboardDismissMode='on-drag'
						>
							<View style={[BuyerStyle.scrollable_container_child, {marginTop:10}]}>
								<View style={BuyerStyle.title_justify}>
									<Text style={BuyerStyle.text_style}>{STRINGS.t('principal_and_interest')}</Text>
								</View>
								<View style={{width:'30%',justifyContent:'center'}}>
									<View style={BuyerStyle.alignrightinput}>
										<Text style={[BuyerStyle.alignCenter, {textAlign:'right'}]}>$ {this.state.principalRate}</Text>
									</View>
								</View>
							</View> 
							<View style={[BuyerStyle.scrollable_container_child, {marginTop:20}]}>
								<View style={BuyerStyle.title_justify}>
									<Text style={BuyerStyle.text_style}>{STRINGS.t('real_estate_taxes')}</Text>
								</View>
								<View style={{width:'30%',justifyContent:'center'}}>
									<View style={BuyerStyle.alignrightinput}>
										<Text style={[BuyerStyle.alignCenter, {textAlign:'right'}]}>$ {this.state.realEstateTaxesRes}</Text>
									</View>
								</View>
							</View> 
							<View style={[BuyerStyle.scrollable_container_child, {marginTop:20}]}>
								<View style={BuyerStyle.title_justify}>
									<Text style={BuyerStyle.text_style}>{STRINGS.t('home_owners_insurance')}</Text>
								</View>
								<View style={{width:'30%',justifyContent:'center'}}>
									<View style={BuyerStyle.alignrightinput}>
										<Text style={[BuyerStyle.alignCenter, {textAlign:'right'}]}>$ {this.state.homeOwnerInsuranceRes}</Text>
									</View>
								</View>
							</View>	
							<View style={[BuyerStyle.fieldcontainer, {marginTop:20}]}> 
								<View style={BuyerStyle.fieldcontainersmallfield}>
									<View style={BuyerStyle.alignrightinput}>
										<TextInput selectTextOnFocus={ true } keyboardType="numeric" style={[BuyerStyle.width100, {width:'75%'}]} underlineColorAndroid='transparent' onFocus={() => this.onFocus('rateValue')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'rateValue',this.changeMortgageInsVal) } onChangeText={(value) => this.setState({rateValue: this.onChange(value)})} value={this.state.rateValue.toString()}/>
									</View>
									<View style={[BuyerStyle.fullunderline, {width:'78%'}]}></View>
								</View> 
								<View style={BuyerStyle.fieldcontainerlargefield}>
									<Text style={BuyerStyle.fieldcontainerlable}>{STRINGS.t('mortgage_ins')}</Text>
								</View>
								<View style={BuyerStyle.fieldcontainersmallfield}>
								</View> 
								<View style={BuyerStyle.fieldcontainersmallfield}>
									<View style={BuyerStyle.alignrightinput}>
										<Text style={BuyerStyle.alignCenter}>$</Text>
										<TextInput selectTextOnFocus={ true } editable={ false } keyboardType="numeric" style={[BuyerStyle.width100, {width:'85%'}]} underlineColorAndroid='transparent' onFocus={() => this.onFocus('monthlyRate')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'monthlyRate') } onChangeText={(value) => this.setState({monthlyRate: this.onChange(value)})} value={this.state.monthlyRate.toString()}/>
									</View>
									<View style={[BuyerStyle.fullunderline, {width:'85%'}]}></View>
								</View>
							</View>	
							{renderIf(this.state.tab == 'CONV')(
							<View style={BuyerStyle.fieldcontainer}>
									<View style={BuyerStyle.fieldcontainerlargefieldPrepaid}>
										<Text style={BuyerStyle.fieldcontainerlable}>{STRINGS.t('p_and_1_2nd_td')}</Text>
									</View> 
									<View style={BuyerStyle.fieldcontainersmallfield}></View>
									<View style={BuyerStyle.fieldcontainersmallfield}></View> 
									<View style={BuyerStyle.fieldcontainersmallfield}>
										<View style={BuyerStyle.alignrightinput}>
											<Text style={BuyerStyle.alignCenter}>$</Text>
											<TextInput selectTextOnFocus={ true } keyboardType="numeric" style={[BuyerStyle.width100, {width:'85%'}]} underlineColorAndroid='transparent' editable = {false} value={this.state.pnintrate.toString()}/>
										</View>
									</View>
								</View>	
							)}		
							<View style={[BuyerStyle.fieldcontainer, {marginTop:20}]}>
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
										<TextInput selectTextOnFocus={ true } keyboardType="numeric" style={[BuyerStyle.width100]} underlineColorAndroid='transparent' onFocus={() => this.onFocus('paymentAmount1')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'paymentAmount1',this.calTotalMonthlyPayment) } onChangeText={(value) => this.setState({paymentAmount1: this.onChange(value),paymentAmount1Fixed: true})} value={this.state.paymentAmount1.toString()}/>
									</View>
									<View style={[BuyerStyle.fullunderline, {width:'90%'}]}></View>
									<View style={{flexDirection:'row',width:'90%',marginTop:20}}>
										<Text style={BuyerStyle.alignCenter}>
											$
										</Text>
										<TextInput selectTextOnFocus={ true } keyboardType="numeric" style={[BuyerStyle.width100]} underlineColorAndroid='transparent' onFocus={() => this.onFocus('paymentAmount2')} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'paymentAmount2',this.calTotalMonthlyPayment) } onChangeText={(value) => this.setState({paymentAmount2: this.onChange(value),paymentAmount2Fixed: true})} value={this.state.paymentAmount2.toString()}/>
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
							<Text style={BuyerStyle.header_title}>{STRINGS.t('Buyer_Closing_Cost')}</Text>
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
										<Text>No Data Found.</Text>
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
									<View style={BuyerStyle.scrollable_container_child_center}>
										<View style={{width: '10%',justifyContent: 'center'}}>
											<Text style={BuyerStyle.text_style}>
												{STRINGS.t('EmailTo')}:
											</Text>
										</View>
										<View style={{width: '90%',flexDirection: 'row'}}>
											<TextInput selectTextOnFocus={ true } underlineColorAndroid='transparent' style={{width: '100%'}} onChangeText={(value) => this.setState({to_email: value})} value={this.state.to_email.toString()}/>
										</View>
									</View>
									<View style={BuyerStyle.lineViewEmailModal}></View>
									<View style={BuyerStyle.scrollable_container_child_center}>
										<View style={{width: '15%',justifyContent: 'center'}}>
											<Text style={BuyerStyle.text_style}>
												{STRINGS.t('EmailSubject')}:
											</Text>
										</View>
										<View style={{width: '85%',flexDirection: 'row'}}>
											<TextInput selectTextOnFocus={ true } underlineColorAndroid='transparent' style={{width: '100%'}} onChangeText={(value) => this.setState({email_subject: value})} value={this.state.email_subject.toString()}/>
										</View>
									</View>
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
				<PopupDialog dialogTitle={<View style={BuyerStyle.dialogtitle}><Text style={BuyerStyle.dialogtitletext}>Please select print format</Text></View>} dialogStyle={{width:'80%'}}  containerStyle={{elevation:10}} ref={(popupDialog) => { this.popupDialog = popupDialog; }}>
					{renderIf(this.state.popupType == 'print')(
					<View>
						<TouchableOpacity onPress={() => {this.printPDF("detailed")}}>
							<View style={BuyerStyle.dialogbtn}>
								<Text style={BuyerStyle.dialogbtntext}>
								{STRINGS.t('Print_Detailed_Estimate')}
								</Text>
							</View>
						</TouchableOpacity>	
						<TouchableOpacity onPress={() => {this.printPDF("quick")}}>
							<View style={BuyerStyle.dialogbtn}>
								<Text style={BuyerStyle.dialogbtntext}>
								{STRINGS.t('Print_Quick_Estimate')}
								</Text>
							</View>
						</TouchableOpacity>	
						<TouchableOpacity style={BuyerStyle.buttonContainer} onPress={ () => {this.popupDialog.dismiss()}}>
						 <Text style={BuyerStyle.style_btnLogin}> {STRINGS.t('Cancel')}</Text>
						 </TouchableOpacity>	
					</View>
					)}
					
					{renderIf(this.state.popupType == 'email')(
					<View>
						<TouchableOpacity onPress={() => {this.setEmailModalVisible(!this.state.emailModalVisible)}}>
							<View style={BuyerStyle.dialogbtn}>
								<Text style={BuyerStyle.dialogbtntext}>
								{STRINGS.t('Email_Detailed_Estimate')}
								</Text>
							</View>
						</TouchableOpacity> 
						<TouchableOpacity>
							<View style={BuyerStyle.dialogbtn}>
								<Text style={BuyerStyle.dialogbtntext}>
								{STRINGS.t('Email_Quick_Estimate')}
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
		
			</View>
			<DropdownAlert ref={(ref) => this.dropdown = ref}/>
                		<View style={BuyerStyle.iphonexFooter}></View>
		</View>
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
