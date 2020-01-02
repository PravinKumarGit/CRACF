import React, { Component } from 'react';
import {Container, Left, Right, Icon, Title, Body, Button}  from 'native-base';
import {Image, View, Dimensions, Alert, Text, TextInput, TouchableOpacity, TouchableHighlight, ScrollView, AsyncStorage, ListView, Modal, ToolbarAndroid, StyleSheet, Keyboard, BackHandler, Platform} from 'react-native';
import Images from '../Themes/Images.js';
import RentVsBuyStyle from './Styles/RentVsBuyStyle';
import SellerStyle from './Styles/SellerStyle';
import CustomStyle from './Styles/CustomStyle';
import BuyerStyle from './Styles/BuyerStyle';
import Styles from './Styles/LandscapeStyles';
import { CheckBox } from 'react-native-elements';
import  MulipleLineChart  from './MultipleLineChart';
import renderIf from 'render-if';
import {callGetApi, callPostApi} from '../Services/webApiHandler.js' // Import 
import STRINGS from '../GlobalString/StringData'  // Import StringData.js class for string localization.
import Picker from 'react-native-picker';
import DatePicker from 'react-native-datepicker'
import {getUptoTwoDecimalPoint} from '../Services/app_common_func.js'
import {getAmountConventional, getDiscountAmount, getAmountFHA, getAdjustedVA, getAdjustedUSDA,getPreMonthTax, getMonthlyInsurance, getDailyInterest, getFhaMipFinance, getUsdaMipFinance, getVaFundingFinance, getMonthlyRateMMI,sumOfAdjustment,getRealEstateTaxes, getHomeOwnerInsurance, getTotalPrepaidItems, getTotalMonthlyPayment, getTotalInvestment, getOriginationFee, getTotalCostRate, get2ndTd, getBuyerEstimatedTax, getCostTypeTotal} from '../Services/rent_vs_buy_calculator.js';
import {getSellerExistingBalanceCalculation,getSellerListSellAgt, getSellerListSellAgtPer, getSellerListSellAgtValues,getSellerAmountFHA,getSellerDiscountAmount, getSellerEstimatedTax, getSellerAmountVA, getSellerAmountCONV, StrToUpper, StrInArray} from '../Services/seller_calculator.js';
var nativeImageSource = require('nativeImageSource');
var Header = require('./Header');
var GLOBAL = require('../Constants/global');
const  {width, height} = Dimensions.get('window')
import SelectMultiple from 'react-native-select-multiple'
import ShowActivityIndicator from './ShowActivityIndicator';
import Spinner from 'react-native-loading-spinner-overlay'; 
//import { ThemeProvider, Toolbar, COLOR } from 'react-native-material-ui';
import Device from '../Constants/Device';
import { CustomTextInput, install } from 'react-native-custom-keyboard';
import CustomKeyboard from '../customKeyboard/CustomKeyboard';
import DropdownAlert from 'react-native-dropdownalert';
import { Dropdown } from 'react-native-material-dropdown';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
const myFuncCalls = 0;
//default data is available 

	  //default data is available 
	  let bottomAxisData = [
		1,2,3,4,5,6,7,8,9,10
	  ]
	  let legendColor = ['#3366CC','#DC3912']
	let RentvsBuyColor = ['#3366CC']
	  let legendText = ['Buy','Rent']
	  let minX= 1, maxX= 10	  
	  //since there are only two lines
	  var Color = ['#3366CC','#DC3912']
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
import AuthenticateUser from '../Services/Authentication.js'; // For authenticating user 


export default class RentVsBuyCalculator extends Component{
	constructor(props){
		super(props);
		this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
		//Estimated date
		AuthenticateUser.authenticateUser;
		var now = new Date();
		now.setDate(now.getDate() + 45);
		var date = (now.getMonth() + 1) + '-' + now.getDate() + '-' + now.getFullYear();
		var monthNames = [ "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec" ]; 
		
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
			todaysInterestRate:'',
			termsOfLoansinYears:'0.00',
			termsOfLoansinYears2:'0.00',
			toggleButton : 'Advanced',
            date:date,
			showCancel : false,
			leftAxisData : [],
			RentvsBuyText : [],
			minY: '',
			maxY: '',
			date1:date,
			count : 0,
			ltv: '90.00',
			content : '',
			ltv2: '0.00',
			ltvseller : '90.00',
			annualPropertyTax : '0.00',
			monthlyHOAFees : '0.00',
			down_payment: '0.00',
			payment_org : '0.00',
			loan_amt: '0.00',
			loan_amt2: '0.00',
			sale_pr: '',
			sale_pr_new : '0.00',
			sale_pr_empty : '',
			net : '0.00',
			equity : '0.00',
			intial_cost_cc : '0.00',
			net_roi : '0.00',
			rent: '0.00',
			rent_empty : '',
            sale_pr_calc: '0.00',
			taxservicecontract: '0.00',
			newEmailAddress : '',
			newEmailContactName : '',
			focusElementMargin:230,
			newEmailAddressError : '',
            underwriting: '0.00',
			processingfee: '0.00',
			appraisalfee: '0.00',
			creditReport: '0.00',
			totalSellerClosingCost : '0.00',
			empty : '',
			reconveynceFee : '0.00',
			drawingDeed : '0.00',
			notary : '0.00',
			Piti_for_payment : '0.00',
			transferTaxPer : '0.00',
			ten_years_cost_array : [],
			ten_years_sp_array : [],
			ten_years_cumulative_total_array : [],
			show_chart_array : [],
			cumulative_annual_rent : '0.00',
			insurance : '0.00',
			transferTax : '0.00',
			sellAgtSeller : '0.00',
			tax_deduction : '0.00',
			fixed_tax_deduction_amt : '10000',
			listAgtSeller : '0.00',
			totalAgtSeller : '0.00',
			totalSellerCost : '0.00',
			pestControlReport : '0.00',
			benifDemandStatement : '0.00',
			brokerageFeeofSalePrice : '0.00',
			escrowSellerType : '',
			ownerSellerType : '',
			lenderSellerType : '',
			taxservicecontractseller : '0.00',
			underwritingseller : '0.00',
			processingfeeseller : '0.00',
			appraisalfeeseller : '0.00',
			documentprepseller : '0.00',
			originationfactorseller : '0.00',
			buyersfeeseller : '0.00',
			ownerFeeSeller : '0.00',
			escrowFeeSeller : '0.00',
			lenderFeeSeller : '0.00',
			escrowFeeOrgseller : '0.00',
			lenderFeeOrgseller : '0.00',
			ownerFeeOrgseller : '0.00',
			escrowFeeBuyerseller : '0.00',
			escrowFeeSellerseller : '0.00',
			prepaymentPenalitySeller : '0.00',
			contact_number : '',
			rent_appreciation : '4.00',
			rent_insurance : '1.50',
			annual_price_appreciation_amt : '3.00',
			escrowTotalSeller : '0.00',
			countyTaxseller : "",
			cityTaxseller : "",
			buyers_fee_text_seller : '',
			buyersfeeseller : '',
			discseller : '0.00',
			amountseller : '0.00',
			otherCostsDiscount2seller : '0.00',
			conventionalLoanSeller: '80.00',
			daysInterestSeller : '0.00',
			annual_interest : '0.00',
			selectedEscrowSellerTypeId : '',
			selectedOwnerSellerTypeId : '',
			selectedLenderSellerTypeId : '',
			default_address : '',
			title_of_opt : '',
			listAgt : '0.00',
			sellAgt : '0.00',
			ownerFee: '',
			ownerPolicyType: '',
			escrowFee: '',
			escrowPolicyType: '',
			lenderFee: '',
			lenderPolicyType: '',
			documentprep: '0.00',
			intialCost : '0.00',
			rent_calc : '0.00',
			annualPriceAppreciationEstimate : '3.00',
			appreciationAmount : '0.00',
			Piti : '0.00',
			disc: '',
			discAmt: '',
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
			monTax: '',
			monIns: '',
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
			monthPmiVal:0,
			rateValue:'',
			principalRate:'',
			realEstateTaxesRes: '',
			homeOwnerInsuranceRes: '',
			buyerFooterTab: true,
			scrollvalue : false,
			visble : false,
			showChart : false,
			enterAddressBar : false,
			imageNameEmail: '',
			videoNameEmail: '',
			modalVisible : false,
			emailModalVisible: false,
			modalAddressesVisible: false,
			videoModalVisible: false,
			visble: false,
			summerPropertyTaxLabel : "",
			winterPropertyTaxLabel : "",
			sumWinPropertyTaxStatus : false,
			annualPropertyTaxFieldShowStatus : false,
			summerPropertyTax : '0.00',
			winterPropertyTax : '0.00',
			prorationPercent  : '105',
			prorationPercentShowStatus  : false,
			imageData: '',
			to_email: '',
			to_email_default : '',
			email_subject: '',
			totalClosingCost: '',
			totalPrepaidItems: '',
			totalMonthlyPayment: '',
			totalInvestment: '',
			first_name: '',
			last_name: '',
			mailing_address: '',
			lender_address : '',
			user_state: '',
			postal_code: '',
			user_name: '',
			originationFee: '',
			costOther: '0.00',
			monthlyExpensesOther1: 'Other',
			monthlyExpensesOther2: 'Other',
			todaysInterestRate1: '0.00',
			sale_cost_at_year : '0.00',
			twoMonthsPmi1: 'Other',
			paymentAmount1: '0.00',
			paymentAmount2: '0.00',
			estimatedTaxProrations: '0.00',
			interest_deduction : '0.00',
			income_tax_rate : '25.00',
			income_tax_rate_min : '10',
			income_tax_rate_max : '39.6',
			income_tax_rate_new : '0.00',
			income_tax_rate_status : false,
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
			net_cost_of_ownership : '0.00',
			deviceName : "",
			nullVal: '0.00',
			lendername: 'New Client',
			interestRateCap: '',
			interestRateCap2: '',
			perAdjustment: '',
			perAdjustment2: '',
			costType_1Value: '',
			costTotalFee_2Value: '',
			termsOfLoansinYearsFixed : false,
			todaysInterestRateFixed : false,
			escrowFeeOrg: '',
			lenderFeeOrg: '',
			ownerFeeOrg: '',
			modalVisible: false,
			modalAddressesVisible: false,
			emailModalVisible: false,
			printModalVisible: false,
			GooglePlaceAutoCompleteShow : false,
			listBuyerCalculation: '',
			dataSource: ds.cloneWithRows(calcList),
			addrsSource: ds.cloneWithRows(addrsList),
			toolbarActions: [{ value : 'PRINT' } , { value : 'EMAIL' }],
			prorationPercentDropdownVal: [
				{ key: 0, label: '100', value: '100'}, {key: 1, label: '105', value:'105'}, {key: 2, label: '110', value : '110'}, {key: 3, label: '115', value: '115'}, {key: 4, label: '120', value : '120'}
			],
			prorationPercentSelectedDropdownVal: { key: 0, label: '105', value:'105'},
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
			email_subject: '',
			imageData: '',
			videoData: '',
			videoModalVisible: false,
			emailAddrsList: [],
			currencySign: '',
			animating: 'false',
			originationfactor: '0.0',
			pnintrate: '0.00',
			Vaff: '0.00'
		}
		this.renderRow = this.renderRow.bind(this);
		this.renderAddrsRow = this.renderAddrsRow.bind(this);

		Dimensions.addEventListener('change', () => {
			this.setState({
				orientation: Device.isPortrait() ? 'portrait' : 'landscape',
			});
		});
    }
    

    onBackHomePress() {
		this.props.navigator.pop()
	}

	onBackRentVsBuyPress() {
		this.setState({
			showChart : false
		});
	}
	
	onShowChartPress() {
		if (this.state.sale_pr == "" || this.state.sale_pr == '0.00') {
			this.dropdown.alertWithType('error', 'Error', "Please enter the purchase price.");
		} else {
			this.setState({
				showChart : true
			});
		}
		//this.props.navigator.push({name: 'ShowChart', index: 0 });
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
		}

		this.setState({lenderPolicyType: value, lenderFee:lenderFee},this.calTotalMonthlyPayment);
	}
	

	// commented by lovedeep on 2/28/2018
	/*handlePressCheckedBox = (checked) => {
		this.setState({
		  isChecked: !this.state.isChecked
		});
	}*/

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
	
 
	// commented by lovedeep on 2/28/2018
	/*handlePressUSDACheckedBox = (checked) => {
		this.setState({
		  isCheckedUSDA: !this.state.isCheckedUSDA
		});
	}*/

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
	

	//commented by lovedeep on 2/28/2018
	/*handlePressVACheckedBox = (checked) => {
		this.setState({
		  isCheckedVA: !this.state.isCheckedVA
		});
	}*/

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
	
	componentDidMount() {
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
		AsyncStorage.getItem("userDetail").then((value) => {
				  newstr = value.replace(/\\/g, "");
				  var newstr = JSON.parse(newstr);
				  this.setState({
					state_code :newstr.state_code,
				  });
				  newstr.user_name = newstr.first_name + " " + newstr.last_name;
				this.setState(newstr,this.componentApiCalls);
		}).done();
		this.setState({animating:'true'});
		
		AsyncStorage.getItem("initialOrientation").then((value) => {
			this.setState({
				initialOrientation : value 
			});
		}).done();
		this.state.ten_years_cost_array = [];
		this.state.ten_years_cumulative_total_array = [];
		this.state.show_chart_array = [];
		this.state.leftAxisData = [];
		this.state.ten_years_sp_array = [];
		myFuncCalls = 0;	
	}

	componentWillUnmount() {
		
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
	}

	handleBackButtonClick() {
		//this.props.navigation.goBack(null);
		this.props.navigator.push({name: 'Dashboard', index: 0 });
		return true;
	}
	
	componentApiCalls(){
		this.callBuyerSettingApi(0);
		//this.callBuyerConvSettingApi();
		//this.callbuyerEscrowXmlData();
		this.callGlobalSettingApi();	
		this.getBuyerCalculatorListApi();
		this.callUserAddressBook();
		this.callBuyerProrationSettingApi();
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
		this.removeCommas(text);
		//discText = text.replace(/[^\d.]/g,'');
		val = text.replace(/[^0-9\.]/g,'');
		if(val.split('.').length>2) {
			val =val.replace(/\.+$/,"");
		}
		discText = val;
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
		if(text != "" && text != '0.00'){
			this.removeCommas(text);
			if(flag=='sale_pr'){
				this.setState({
					loadingText : 'Calculating...'
				}, this.setState({animating:'true'}));
			} else {
				this.setState({animating:'true'});
			}
		}
		
		this.removeCommas(text);
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
			//newText = text.replace(/[^\d.]/g,'');
			val = text.replace(/[^0-9\.]/g,'');
			if(val.split('.').length>2) {
				val =val.replace(/\.+$/,"");
			}
			newText = val;
		}else{
			newText = '0.00';
		}
		if(this.state.ten_years_sp_array.length > 0 || this.state.ten_years_cost_array.length > 0 || this.state.ten_years_cumulative_total_array.length > 0 || this.state.show_chart_array.length > 0) {
			this.state.ten_years_sp_array = [];
			this.state.ten_years_cost_array = [];
			this.state.ten_years_cumulative_total_array = [];
			this.state.show_chart_array = [];
			this.state.leftAxisData = [];
			this.state.rent_calc = '0.00';
			this.state.RentvsBuyText = [];
			this.state.sale_pr_new = '0.00';
			this.state.appreciationAmount = '0.00';
			myFuncCalls = 0;
		}

		newTextCalc = newText;
		if(flag=='sale_pr') {	

			this.setState({sale_pr: newText,sale_pr_calc: newTextCalc});
			request = {'salePrice': newText,'LTV': this.state.ltv, 'LTV2': this.state.ltv2};

			this.state.ten_years_sp_array.push(newText);

			if(this.state.disc != '' && this.state.disc != 0) {
				this.onChangeDisc(this.state.disc);
			}

			if(this.state.sale_pr != '') {
				var value = parseFloat(this.state.sale_pr);
				value = value.toFixed(2);
				this.setState({
					sale_pr : value
				});
			}	
		} else if(flag=='ltv') {

			if(this.state.sale_pr != "" || this.state.sale_pr != "0.00") {
				this.state.ten_years_sp_array.push(this.state.sale_pr);
			}
			newTextCalc = this.state.sale_pr_calc;
			this.setState({ltv: newText});
			request = {'salePrice': this.state.sale_pr_calc,'LTV': newText, 'LTV2': this.state.ltv2};
			if(this.state.ltv != '') {
				var value = parseFloat(this.state.ltv);
				value = value.toFixed(2);
				this.setState({
					ltv : value
				});
			}
		}
		else if(flag=='ltv2') {

			if(this.state.sale_pr != "" || this.state.sale_pr != "0.00") {
				this.state.ten_years_sp_array.push(this.state.sale_pr);
			}
			newTextCalc = this.state.sale_pr_calc;
			this.setState({ltv2: newText});
			request = {'salePrice': this.state.sale_pr_calc,'LTV': this.state.ltv, 'LTV2': newText};

			if(this.state.ltv2 != '') {
				var value = parseFloat(this.state.ltv2);
				value = value.toFixed(2);
				this.setState({
					ltv2 : value
				});
			}
		}		
		if(flag!='sale_pr'){
			if(flag=='ltv2' && newText == 0){
				flag = 'sale_pr';
		   }
			newText = this.state.sale_pr;
		}
		if(this.state.tab == 'CONV') {
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
						sale_pr: parseFloat(newText).toFixed(2),
						sale_pr_calc: newTextCalc,
				},this.changePrepaidPageFields);
				rate_loan_amt = (parseFloat(conv_amt.amount) + parseFloat(conv_amt.amount2)).toFixed(2);
				//added by lovedeep
				loan_amt1 = (parseFloat(conv_amt.amount) + parseFloat(conv_amt.amount2)).toFixed(2);
			} else {
				this.setState({
						down_payment: conv_amt.downPayment,
						loan_amt: conv_amt.amount,
						loan_amt2: '',
						sale_pr: parseFloat(newText).toFixed(2),
						sale_pr_calc: newTextCalc,
				},this.changePrepaidPageFields);
				rate_loan_amt = conv_amt.amount;
			}			
			loan_amt = conv_amt.amount;
			loan_amt1 = conv_amt.amount;
			rate_loan_amt = conv_amt.amount;
			if (typeof conv_amt.amount2 !== 'undefined' && this.state.downPaymentFixed != true) {	
				loan_amt = (parseFloat(conv_amt.amount) + parseFloat(conv_amt.amount2)).toFixed(2);
				
				//commented by lovedeep
				//rate_loan_amt = (parseFloat(conv_amt.amount) + parseFloat(conv_amt.amount2)).toFixed(2);
			}
				
		} else {
			this.setState({pnintrate: '0.00'});
		}
		
		// Work on fetching adjusted loan amt, loan amt and down payment on change of sale price
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
				});

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
					
					requestPrepaidData = {'salePrice': newText, 'MIP': mip};        
					responsePrepaid = getFhaMipFinance(requestPrepaidData);
					loan_amt = resp.adjusted;	
					rate_loan_amt = resp.amount;	
					loan_amt1 =  resp.adjusted;	
					
					// fhaMIP added by lovedeep
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
					});
					
					if(newText <= result.data.nation_setting.mMIAmountUpto){
						rateValue	= result.data.nation_setting.mMI;
					}
					if(newText > result.data.nation_setting.mMIAmountExceed){
						rateValue	= result.data.nation_setting.mMIExceed;
					}

				} else if(this.state.tab == 'VA') {
					ff             = result.data.nation_setting.VA_FundingFee;
					if(this.state.Vaff != '0.00'){
						ff = this.state.Vaff;
					}
					if(this.state.downPaymentFixed == true){
						amt = (parseFloat(newText) - parseFloat(this.state.down_payment)).toFixed(2);
					}else{
						amt = newText;
					}
					data         = {'salePrice': newText,'FF': ff};
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
						sale_pr: parseFloat(newText).toFixed(2),
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
					data         = {'salePrice': newText,'MIP': mip};
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
					// usdaMIP added by lovedeep
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
					});
				}else if(this.state.tab == 'CASH'){
					rateValue = '0.00';
					this.setState({
						down_payment: newText,
						sale_pr: parseFloat(newText).toFixed(2),
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
				
				//data_mon_tax = {'salePrice': newText,'monthlyTax': this.state.monTax,'months': this.state.monTaxVal};
				data_mon_tax = {'salePrice': newText,'monthlyTax': this.state.monTax,'months': this.state.monTaxVal, 'annualPropertyTax':this.state.annualPropertyTax,'stateId':this.state.state,'countyId':this.state.county};
				resp_mon_tax = getPreMonthTax(data_mon_tax);
				prepaidMonthTaxes = resp_mon_tax.prepaidMonthTaxes;
		
				data_mon_ins         = {'salePrice': newText,'insuranceRate': this.state.monIns,'months': this.state.numberOfMonthsInsurancePrepaid};
				
				resp_mon_ins            = getMonthlyInsurance(data_mon_ins);
				monthInsurance = resp_mon_ins.monthInsurance;
				
				monthlyRate	= '0.00';

				titleVal	= 'PMI';
				//creating object for amount and rate value
				if(this.state.tab == 'USDA'){
					requestMMI 		= {'amount': rate_loan_amt, 'rateValue': rateValue * 100};
				} else {
					requestMMI 		= {'amount': rate_loan_amt, 'rateValue': rateValue};
					
				}

				//Alert.alert("df",JSON.stringify(requestMMI));
				//calling method to calculate the FHa MIP Finance for prepaid
				responseMMI 		= getMonthlyRateMMI(requestMMI);
				monthlyRate		= responseMMI.monthlyRateMMI;
				monthPmiVal		= responseMMI.monthPmiVal;
				
				//commented by lovedeep
				/*if(this.state.ltv2 > 0 && this.state.tab == 'CONV'){
					todaysInterestRate = (parseFloat(this.state.todaysInterestRate) + parseFloat(this.state.todaysInterestRate)).toFixed(2);
					termsOfLoansinYears = (parseFloat(this.state.termsOfLoansinYears) + parseFloat(this.state.termsOfLoansinYears2)).toFixed(2);
				}else{
					todaysInterestRate = this.state.todaysInterestRate;
					termsOfLoansinYears = this.state.termsOfLoansinYears;
				}*/

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
					sale_pr: parseFloat(newText).toFixed(2),
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
		
		
		date = Number(split[0])+'/'+Number(split[1])+'/'+Number(split[2]);
		monthNameForProration = monthNames[Number(split[0])];

		prorationAmt = this.state.proration;
		
		//monthNameForProration = monthNames[Number(split[0])];
		//prorationAmt = this.state.proration[monthNameForProration];

		/**==================================================================================================== 
		 
			Start Proration changes by lovedeep for multiple states as per discussion with Vinod Sir on 04-06-2018   
		  ==================================================================================================**/


		/** 
		 * Below old Code commented by lovedeep 
		 *   


		request         = {'annualPropertyTax': this.state.annualPropertyTax, 'proration': prorationAmt, 'date': parseInt(split[1]), 'month': parseInt(split[0]), 'state_code': this.state.state_code};
		//Alert.alert("dsf", split[2]);
		data = getBuyerEstimatedTax(request)
		this.setState({date: date, monName: monthNames[Number(split[0])], estimatedTaxProrations: data.estimatedTax},this.callGlobalSettingApiOnDateChange);
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
				request         = {'summerPropertyTax': this.state.summerPropertyTax, 'winterPropertyTax': this.state.winterPropertyTax, 'prorationPercent': this.state.prorationPercent, 'annualPropertyTax': this.state.annualPropertyTax, 'proration': prorationAmt, 'closing_date':  date, 'state_code': this.state.state_code, 'state_id' : this.state.state, 'county_id' : this.state.county, 'city': this.state.city};
				console.log("proration request " + JSON.stringify(request));
				data = getBuyerEstimatedTax(request);
				console.log("proration resp " + JSON.stringify(data));
				//this.setState({estimatedTaxProrations: data.estimatedTax},this.changePrepaidPageFields);
			
				this.setState({date: date, monName: monthNames[Number(split[0])], estimatedTaxProrations: data.estimatedTax},this.callGlobalSettingApiOnDateChange);
			}
		} else {
			request         = {'summerPropertyTax': this.state.summerPropertyTax, 'winterPropertyTax': this.state.winterPropertyTax, 'prorationPercent': this.state.prorationPercent, 'annualPropertyTax': this.state.annualPropertyTax, 'proration': prorationAmt, 'closing_date': date, 'state_code': this.state.state_code, 'state_id' : this.state.state, 'county_id' : this.state.county, 'city': this.state.city};
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

			// added by lovedeep
			if(this.state.tab == 'CONV'){
				request         = {'originationFee': this.state.originationfactor, 'amount': loan_amt, 'amount2': this.state.loan_amt2};
			}else{
				request         = {'originationFee': this.state.originationfactor, 'amount': loan_amt, 'amount2': '0.00'};
			}
			
			//commented by lovedeep
			//request         = {'originationFee': this.state.originationfactor, 'amount': loan_amt, 'amount2': this.state.loan_amt2};
            //calling method to calculate the discount amount
            response         = getOriginationFee(request);
			this.setState({originationFee: response.originationFee},this.calTotalClosingCost);
	}
	
	//Function to calculate mon tax value in prepaid tab
	changeMonTaxPrice(){
		data = {'salePrice': this.state.sale_pr_calc,'monthlyTax': this.state.monTax,'months': this.state.monTaxVal, 'annualPropertyTax':this.state.annualPropertyTax,'stateId':this.state.state,'countyId':this.state.county};
		
        //console.log(this.request);
        //calling method to calculate the discount amount
        resp                 = getPreMonthTax(data);
        //console.log(this.response.prepaidMonthTaxes);
		this.setState({
				prepaidMonthTaxes: parseFloat(resp.prepaidMonthTaxes).toFixed(2),
			},this.changeMonInsPrice);
	}

	updatePhoneNumberFormat(phone_number){
		phone_number = phone_number.replace(/[^\d.]/g,'').replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
	   this.setState({contact_number : phone_number});
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
	
		//calling method to calculate the discount amount   
		this.setState({
				daysInterest: daysInterest,
		},this.calOriginatinFee);
	}
	
	callBuyerSettingApi(flg)
	{
		let funcCall;
		if(flg == 0) {
			funcCall = this.callBuyerConvSettingApi();
		} else {
			funcCall = this.callbuyerEscrowXmlData();
		}

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
			// For setting last fields of closing costs page
			if(this.state.tab == 'CONV' && this.state.loan_amt != ""){
				amt = this.state.loan_amt;
			}else if(this.state.tab == 'CASH'){
				amt = '0.00';
			}else{
				amt = this.state.adjusted_loan_amt;
			}
			const costRequest = {};
			// For setting last fields of closing costs page
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

				if(this.state.termsOfLoansinYearsFixed == true) {
					termsOfLoansinYears = this.state.termsOfLoansinYears;
				} else {
					termsOfLoansinYears = result.data.userSetting.termsOfLoansinYears;
				}

				if(this.state.todaysInterestRateFixed == true) {
					todaysInterestRate = this.state.todaysInterestRate;
				} else {
					todaysInterestRate = result.data.userSetting.todaysInterestRate;
				}

				this.setState({
					todaysInterestRate: todaysInterestRate,
					termsOfLoansinYears: termsOfLoansinYears,
					numberOfDaysPerMonth: result.data.userSetting.numberOfDaysPerMonth,
					numberOfMonthsInsurancePrepaid: result.data.userSetting.numberOfMonthsInsurancePrepaid,
					monTax: result.data.userSetting.taxRatePerYearPerOfSalePrice,
					monIns: result.data.userSetting.homeownerInsuranceRateYearOfSalePrice,
					creditReport: result.data.userSetting.creditReport,
					totalCost: totalCost,
					loan_amt: conv_amt.amount,
				},funcCall);
			}	
			//Alert.alert('Alert!', JSON.stringify(result.data.totalCost))
			
			console.log("total clost first time " + this.state.totalCost);
		});
	}
	
	// Function for fetching and setting value of price based on month on prepaid page
	callGlobalSettingApi()
	{
		callPostApi(GLOBAL.BASE_URL + GLOBAL.state_buyer_proration_global_setting, {
		"state_id": this.state.state

		},this.state.access_token)
		.then((response) => {
			this.setState({
				monTaxVal: result.data[this.state.monName],
				monTaxValReal: result.data[this.state.monName]
			});
		});
	}
	
	// Function for fetching and setting value of price based on month on prepaid page
	callGlobalSettingApiOnDateChange()
	{
		callPostApi(GLOBAL.BASE_URL + GLOBAL.state_buyer_proration_global_setting, {
		"state_id": this.state.state

		},this.state.access_token)
		.then((response) => {
			this.setState({
				monTaxVal: result.data[this.state.monName],
				monTaxValReal: result.data[this.state.monName]
			},this.changeMonTaxPrice);
		});
	}
	
	callbuyerEscrowXmlData()
	{
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
			},this.callBuyerConvSettingApi);
			
		});
	}
	
	callBuyerConvSettingApi()
	{
		date = this.state.date;
		var split = date.split('-');
		date = Number(split[0])+'/'+Number(split[1])+'/'+Number(split[2]);

		if(this.state.sale_pr == '') {
			this.state.sale_pr = '0.00';

		}
	//	alert("city " + this.state.city + "county_name " + this.state.user_county + "salePrice " + this.state.sale_pr + "adjusted " + this.state.adjusted_loan_amt + "state " + this.state.state + "county " + this.state.county  + "loanType " + this.state.tab + "zip" + this.state.postal_code +  "estStlmtDate " + date);
		callPostApi(GLOBAL.BASE_URL + GLOBAL.buyer_escrow_xml_data, {
		"city": this.state.city,"county_name": this.state.user_county,"salePrice": this.state.sale_pr,"adjusted": this.state.adjusted_loan_amt,"state": this.state.state,"county": this.state.county, "loanType": this.state.tab, "zip": this.state.postal_code,  "estStlmtDate": date, 'userId':this.state.user_id,'device': this.state.deviceName
		}, this.state.access_token)
		.then((response) => {

			/*this.setState({
				ownerFee: '0.00',
				escrowFee: '0.00',
				lenderFee: '0.00',
				ownerFeeOrg: '0.00',seller
				escrowFeeOrg: '0.00',
				lenderFeeOrg: '0.00',
				cityEscrow: '0.00',
			},this.calEscrowTypes);*/

			this.setState({
				ownerFee: result.data.ownerFee,
				escrowFee: result.data.escrowFee,
				lenderFee: result.data.lenderFee,
				ownerFeeOrg: result.data.ownerFee,
				escrowFeeOrg: result.data.escrowFee,
				lenderFeeOrg: result.data.lenderFee,
				cityEscrow: result.data.city,
			},this.calEscrowTypes);

		});
	}
	
	calEscrowTypes()
	{
		callPostApi(GLOBAL.BASE_URL + GLOBAL.title_escrow_type, {
		"companyId": this.state.company_id
		}, this.state.access_token)
		.then((response) => {
			this.setState({
				ownerPolicyType: result.data.ownerType,
				escrowPolicyType: result.data.escrowType,
				lenderPolicyType: result.data.lenderType,
			},this.calEscrowData);
		});
	}
	
	callSettingApiForTabs(){
		if(this.state.sale_pr != '0.00'){
			if(this.state.disc != ''){
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
		
		callPostApi(GLOBAL.BASE_URL + GLOBAL.buyer_escrow_xml_data, {
		"city": this.state.city,"county_name": this.state.user_county,"salePrice": this.state.sale_pr,"adjusted": loan_amt,"state": this.state.state,"county": this.state.county, "loanType": this.state.tab, "zip": this.state.postal_code,  "estStlmtDate": date, 'userId':this.state.user_id,'device': this.state.deviceName
		}, this.state.access_token)
		.then((response) => {
			if(typeof result.data.newLoanFee != "undefined"){
				this.setState({newLoanServiceFee: result.data.newLoanFee,showLoanServiceFee: true});
			}else{
				this.setState({newLoanServiceFee: '0.00',showLoanServiceFee: false});
			}
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
						cityTax: result.data.cityTax
					},this.getTransferTax);	
				}else{
					this.setState({
						ownerFeeOrg: result.data.ownerFee,
						escrowFeeOrg: result.data.escrowFee,
						lenderFeeOrg: result.data.lenderFee,
						escrowFeeBuyerOrg: result.data.escrowFeeBuyer,
						escrowFeeSellerOrg: result.data.escrowFeeSeller,
						countyTax: result.data.countyTax,
						cityTax: result.data.cityTax
					},this.getTransferTax);	
				}
			}
			
		});
	}
	
	getTransferTax(){
		callPostApi(GLOBAL.BASE_URL + GLOBAL.get_transfer_tax, {
		"countyTax": this.state.countyTax,"cityTax": this.state.cityTax,"city": this.state.cityEscrow, "type": "buyer"
		}, this.state.access_token)
		.then((response) => {

			twoMonthsPmi1 = this.state.cityEscrow + " transfer tax";
			if(this.state.costOtherFixed){
				costOther = this.state.costOther;
			}else{
				costOther = result.data.CityTransferTaxBuyer;
			}
			this.setState({costOther: costOther,twoMonthsPmi1: twoMonthsPmi1},this.createOwnerLenderEscrowPicker);	
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
		

		console.log("originationFee " + originationFee);
		console.log("processingfee " + this.state.processingfee);
		console.log("taxservicecontract " + this.state.taxservicecontract);
		console.log("documentprep " + this.state.documentprep);
		console.log("underwriting " + this.state.underwriting);
		console.log("appraisalfee " + this.state.appraisalfee);
		console.log("creditReport " + this.state.creditReport);
		console.log("totalCost " + this.state.totalCost);
		



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
			if(this.state.showLoanServiceFee){
				totalClosingCost    = (parseFloat(totalClosingCost) + parseFloat(this.state.newLoanServiceFee)).toFixed(2);
			}
			console.log("Total Closing Cost" + totalClosingCost);	

			this.setState({totalClosingCost: totalClosingCost},this.calTotalPrepaidItems);
	}	
	
	settingsApi(flag){
		Keyboard.dismiss();
		this.setState({animating:'true'});
		if(this.state.tab!="CASH"){
			monTaxVal = this.state.monTaxValReal;
		}
		this.setState({tab: flag, monTaxVal: monTaxVal},this.afterSetStateSettingApi);
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
		}else if(this.state.tab=="CONV"){
			// if added by lovedeep
			if(this.state.downPaymentHidden > 0){
				amount = this.state.sale_pr_calc - this.state.downPaymentHidden;
				resaleConventionalLoanLTV    = (amount / this.state.sale_pr_calc *100).toFixed(2);
				this.setState({ltv: resaleConventionalLoanLTV,ltv2: '0.00',todaysInterestRate1: '0.00',termsOfLoansinYears2: '0.00'});
			}
			this.callBuyerSettingApi(1);
		}else if(this.state.tab=="CASH"){
			this.callCASHsettinsapi();
		}
	}
	
	// Function for fetching and setting values of closing cost tab under FHA page
	callFHAsettinsapi(){
		callPostApi(GLOBAL.BASE_URL + GLOBAL.fha_va_usda_setting_api, {
			user_id: this.state.user_id,company_id: this.state.company_id,loan_type: "FHA",calc_type: "Buyer", zip: this.state.postal_code
		}, this.state.access_token)
		.then((response) => {


			this.setState({
				taxservicecontract: result.data.FHA_TaxServiceContract,
				underwriting: result.data.FHA_Underwriting,
				processingfee: result.data.FHA_ProcessingFee,
				appraisalfee: result.data.FHA_AppraisalFee,
				documentprep: result.data.FHA_DocumentPreparation,
				originationfactor: result.data.FHA_OriginationFactor,
			},this.callClosingCostSettingApi);	
		});
	}
	
	// Function for fetching and setting values of closing cost tab under VA page
	callVAsettinsapi(){
		callPostApi(GLOBAL.BASE_URL + GLOBAL.fha_va_usda_setting_api, {
			user_id: this.state.user_id,company_id: this.state.company_id,loan_type: "VA",calc_type: "Buyer", zip: this.state.postal_code
		}, this.state.access_token)
		.then((response) => {
			this.setState({
				taxservicecontract: result.data.VA_TaxServiceContract,
				underwriting: result.data.VA_Underwriting,
				processingfee: result.data.VA_ProcessingFee,
				appraisalfee: result.data.VA_AppraisalFee,
				documentprep: result.data.VA_DocumentPreparation,
				originationfactor: result.data.VA_OriginationFactor,
			},this.callClosingCostSettingApi);
		});
	}
	
	// Function for fetching and setting values of closing cost tab under USDA page
	callUSDAsettinsapi(){
		callPostApi(GLOBAL.BASE_URL + GLOBAL.fha_va_usda_setting_api, {
			user_id: this.state.user_id,company_id: this.state.company_id,loan_type: "USDA",calc_type: "Buyer", zip: this.state.postal_code
		}, this.state.access_token)
		.then((response) => {
			this.setState({
				taxservicecontract: result.data.USDA_TaxServiceContract,
				underwriting: result.data.USDA_Underwriting,
				processingfee: result.data.USDA_ProcessingFee,
				appraisalfee: result.data.USDA_AppraisalFee,
				documentprep: result.data.USDA_DocumentPreparation,
				originationfactor: result.data.USDA_OriginationFactor,
			},this.callClosingCostSettingApi);
		});
	}
	
	callClosingCostSettingApi(){
		callPostApi(GLOBAL.BASE_URL + GLOBAL.Buyer_Cost_Setting, {
		user_id: this.state.user_id,company_id: this.state.company_id, zip: this.state.postal_code
		}, this.state.access_token)
		.then((response) => {
			
			// For setting last fields of closing costs page
			resultCount = _.size(result.data.userSettingCost);
			var costRequest = {};
			
				var j=1;
				for (resObjMonthExp of result.data.userSettingMonthExp) {
						const updateMonthExp = {};
						updateMonthExp['monthlyExpensesOther' + j] = resObjMonthExp.label;
						if(j == 1) {
							if(this.state.paymentAmount1 == "0.00") {
								updateMonthExp['paymentAmount' + j] = resObjMonthExp.fee;
							}
						}
						updateMonthExp['typeMonthExp' + j] = resObjMonthExp.key;
						this.setState(updateMonthExp);
					j++;
				}
				var i=1;
							// For setting last fields of closing costs page
				if(this.state.tab == 'CONV' && this.state.loan_amt != ""){
					amt = this.state.loan_amt;
				}else if(this.state.tab == 'CASH'){
					amt = '0.00';
				}else{
					amt = this.state.adjusted_loan_amt;
				}
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
						if(i == resultCount){
							let costResponse    = getTotalCostRate(costRequest);
							totalCost      = costResponse.totalCostRate;

							if(this.state.termsOfLoansinYearsFixed == true) {
								termsOfLoansinYears = this.state.termsOfLoansinYears;
							} else {
								termsOfLoansinYears = result.data.userSetting.termsOfLoansinYears;
							}
			
							if(this.state.todaysInterestRateFixed == true) {
								todaysInterestRate = this.state.todaysInterestRate;
							} else {
								todaysInterestRate = result.data.userSetting.todaysInterestRate;
							}
						
							this.setState({
								todaysInterestRate: todaysInterestRate,
								termsOfLoansinYears: termsOfLoansinYears,
								numberOfDaysPerMonth: result.data.userSetting.numberOfDaysPerMonth,
								numberOfMonthsInsurancePrepaid: result.data.userSetting.numberOfMonthsInsurancePrepaid,
								monTax: result.data.userSetting.taxRatePerYearPerOfSalePrice,
								monIns: result.data.userSetting.homeownerInsuranceRateYearOfSalePrice,
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
				
				// commented by lovedeep
				/*const updateMonthExp = {};
					updateMonthExp['monthlyExpensesOther' + j] = resObjMonthExp.label;
					if(j == 1) {
						if(this.state.paymentAmount1 == "0.00") {
							updateMonthExp['paymentAmount' + j] = resObjMonthExp.fee;
						}
					}
					updateMonthExp['typeMonthExp' + j] = resObjMonthExp.key;
					this.setState(updateMonthExp);
				j++;*/

				//added by lovedeep
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

			// For setting last fields of closing costs page
			resultCount = _.size(result.data.userSettingCost);
			var costRequest = {};
			if(this.state.tab == 'CONV' && this.state.loan_amt != ""){
				amt = this.state.loan_amt;
			}else if(this.state.tab == 'CASH'){
				amt = '0.00';
			}else{
				amt = this.state.adjusted_loan_amt;
			}
			for (resObj of result.data.userSettingCost) {
				const update = {};
				if(resObj.applyCash == 'Y') {
					req = {'amount': amt,'salePrice': this.state.sale_pr_calc,'type': resObj.type,'rate':resObj.fee};
					var data = getCostTypeTotal(req);
					feeval = data.totalCostRate;
					update['label' + i] = resObj.label;
					update['fee' + i] = feeval;
					update['type' + i] = resObj.type;
					update['totalfee' + i] = resObj.fee;
					costRequest['cost' + i] = resObj.fee;
					this.setState(update);
				} else {
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

					if(this.state.termsOfLoansinYearsFixed == true) {
						termsOfLoansinYears = this.state.termsOfLoansinYears;
					} else {
						termsOfLoansinYears = result.data.userSetting.termsOfLoansinYears;
					}
	
					if(this.state.todaysInterestRateFixed == true) {
						todaysInterestRate = this.state.todaysInterestRate;
					} else {
						todaysInterestRate = result.data.userSetting.todaysInterestRate;
					}

					this.setState({
						todaysInterestRate: todaysInterestRate,
						termsOfLoansinYears: termsOfLoansinYears,
						numberOfDaysPerMonth: result.data.userSetting.numberOfDaysPerMonth,
						monTax: result.data.userSetting.taxRatePerYearPerOfSalePrice,
						monIns: result.data.userSetting.homeownerInsuranceRateYearOfSalePrice,
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
		//calling method to calculate the adjustments
        responseTotPreItem        = getTotalPrepaidItems(requestTotPreItem);
		/*if(this.state.costOther != ''){
			responseTotPreItem.totalPrepaidItems = (parseFloat(this.state.costOther) + parseFloat(responseTotPreItem.totalPrepaidItems)).toFixed(2)
		}*/

		// commented by lovedeep
		/*if(this.state.tab == 'FHA' && this.state.isChecked == false){
			responseTotPreItem.totalPrepaidItems = (parseFloat(this.state.FhaMipFin) + parseFloat(responseTotPreItem.totalPrepaidItems)).toFixed(2)
		}else if(this.state.tab == 'VA' && this.state.isCheckedVA == false){
			responseTotPreItem.totalPrepaidItems = (parseFloat(this.state.VaFfFin1) + parseFloat(responseTotPreItem.totalPrepaidItems)).toFixed(2)
		}else if(this.state.tab == 'USDA' && this.state.isCheckedUSDA == false){
			responseTotPreItem.totalPrepaidItems = (parseFloat(this.state.UsdaMipFinance1) + parseFloat(responseTotPreItem.totalPrepaidItems)).toFixed(2)
		}*/
		
		
		this.setState({financialVal: financialVal,totalPrepaidItems: responseTotPreItem.totalPrepaidItems},this.calTotalInvestment);
    }
	
	
	//Total Monthly Payment
    calTotalMonthlyPayment(){
        //creating object for loan payment adjustments
       requestTotPreItem         = {'principalRate': this.state.principalRate, 'realEstateTaxesRes': this.state.realEstateTaxesRes, 'homeOwnerInsuranceRes': this.state.homeOwnerInsuranceRes, 'monthlyRate': this.state.monthlyRate, 'pnintrate': this.state.pnintrate, 'paymentAmount1': this.state.paymentAmount1, 'paymentAmount2': this.state.paymentAmount2};
        //calling method to calculate the adjustments
		responseTotPreItem        = getTotalMonthlyPayment(requestTotPreItem);

		/*if(this.state.monthlyExpensesOther1 != ""){
			responseTotPreItem.totalMonthlyPayment = (parseFloat(this.state.paymentAmount1) + parseFloat(responseTotPreItem.totalMonthlyPayment)).toFixed(2)
		}
		if(this.state.monthlyExpensesOther2 != ""){
			responseTotPreItem.totalMonthlyPayment = (parseFloat(this.state.paymentAmount2) + parseFloat(responseTotPreItem.totalMonthlyPayment)).toFixed(2)
		}*/
		this.setState({totalMonthlyPayment: responseTotPreItem.totalMonthlyPayment},this.changePrepaidPageFields);

    }

//Total Investment
    calTotalInvestment(){

        //creating object for loan payment adjustments
		if(this.state.totalPrepaidItems == '' || this.state.totalPrepaidItems === undefined) {
			 requestTotPreItem         = {'downPayment': this.state.down_payment, 'totalClosingCost': this.state.totalClosingCost, 'totalPrepaidItems': 0, 'estimatedTaxProrations': this.state.estimatedTaxProrations};
		} else {
			 requestTotPreItem         = {'downPayment': this.state.down_payment, 'totalClosingCost': this.state.totalClosingCost, 'totalPrepaidItems': this.state.totalPrepaidItems, 'estimatedTaxProrations': this.state.estimatedTaxProrations};
		}
		
		//calling method to calculate the adjustments
		
		responseTotPreItem        = getTotalInvestment(requestTotPreItem);
		
		if(isNaN(responseTotPreItem.totalInvestment)) {
			this.setState({totalInvestment: '0.00'});
		} else {
			if(this.state.sale_pr != "" && this.state.sale_pr != '0.00') {
				this.setState({totalInvestment: responseTotPreItem.totalInvestment}, this.callSellerCostSettingApi);
			} else {
				this.setState({totalInvestment: responseTotPreItem.totalInvestment});
			}			
		}

		console.log("Total Investment" + this.state.totalInvestment);

		this.setState({animating:'false'});
	} 
	
	/** ######################  Start Seller Closing Costs  ########################## **/


	// Function used to calculate total closing cost of seller calculator

	callSellerCostSettingApi()
	{
		this.setState({animating : 'true'});
		callPostApi(GLOBAL.BASE_URL + GLOBAL.Seller_Cost_Setting, {
		user_id: this.state.user_id,company_id: this.state.company_id, zip: this.state.postal_code
		}, this.state.access_token)
		.then((response) => {
			var i=1;
			const costRequest = {};
			// For setting last fields of closing costs page
			// For setting last fields of closing costs page
			if(this.state.tab == 'CONV' && this.state.loan_amt != ""){
				amt = this.state.loan_amt;
			}else if(this.state.tab == 'CASH'){
				amt = '0.00';
			}else{
				amt = this.state.adjusted_loan_amt;
			}
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
			// requesting agrigate list and sell values
			SCC_Brokage_Fee                 = result.data.userSetting.brokerageFeeofSalePrice;                
			// requesting agrigate list and sell values
			let requestAgt        = {
				'SCC_Brokage_Fee'        : SCC_Brokage_Fee
			}
 
			let responseAgt        = getSellerListSellAgt(requestAgt);

			let requestAgtNew        = {
				'sellAgt'        : responseAgt.sellAgt,
				'listAgt'        : responseAgt.listAgt,
				'salePrice'        : this.state.sale_pr
			}

			let responseAgtNew        = getSellerListSellAgtValues(requestAgtNew);

			this.state.transferTax   = this.state.transferTaxPer * this.state.sale_pr / 1000;
			this.state.transferTax   = this.state.transferTax.toFixed(2);

			this.setState({
				totalSellerCost: result.data.totalCost,
				reconveynceFee: result.data.userSetting.reconveynceFee,
				drawingDeed: result.data.userSetting.drawingDeed,
				notary: result.data.userSetting.notary,
				transferTaxPer: result.data.userSetting.transferTax,
				pestControlReport: result.data.userSetting.pestControlReport,
				benifDemandStatement: result.data.userSetting.benifDemandStatement,
				brokerageFeeofSalePrice: result.data.userSetting.brokerageFeeofSalePrice,
				totalAgtSeller: responseAgtNew.totalAgt,
			},this.callgetEcrowTitleType);
		});
	}

	// this function is used to get default types of escrow, owner and lender (the value which is shown in dropdown under closing cost section)
	callgetEcrowTitleType() {
		
		callPostApi(GLOBAL.BASE_URL + GLOBAL.seller_escrow_type, {
		"companyId" : this.state.company_id
		}, this.state.access_token)
		.then((response) => {	
				if(this.state.tab == 'CONV') {
					myFuncCalls = 0;
					this.setState({
						escrowSellerType: result.data.escrowType,
						ownerSellerType: result.data.ownerType,
						lenderSellerType : 'Buyer',
					},this.callConvSettingData);
				}

				if(this.state.tab == 'FHA') {
					myFuncCalls = 0;
					this.setState({
						escrowSellerType: result.data.escrowType,
						ownerSellerType: result.data.ownerType,
						lenderSellerType : 'Buyer',
					},this.callSellerFHAsettinsapi);
				}

				if(this.state.tab == 'VA') {
					myFuncCalls = 0;
					this.setState({
						escrowSellerType: result.data.escrowType,
						ownerSellerType: result.data.ownerType,
						lenderSellerType : 'Buyer',
					},this.callSellerVAsettinsapi);
				}

				if(this.state.tab == 'USDA') {
					myFuncCalls = 0;
					this.setState({
						escrowSellerType: result.data.escrowType,
						ownerSellerType: result.data.ownerType,
						lenderSellerType : 'Buyer',
					},this.callSellerUSDAsettinsapi);
				}

				if(this.state.tab == 'CASH') {
					myFuncCalls = 0;
					this.setState({
						escrowSellerType: result.data.escrowType,
						ownerSellerType: result.data.ownerType,
						lenderSellerType : 'Buyer',
					},this.callSellerCASHsettinsapi);
				}
		});	
	}

	// this function callConvSettingData is used to fetch other cost setting values which w are using under other costs section.
	callConvSettingData()
	{
		
		if(this.state.sale_pr != '' && this.state.sale_pr != '0.00') {
			let MIP;
			MIP             = this.state.FHA_PercentOne;
			request 		= {'salePrice': this.state.sale_pr,'LTV': this.state.conventionalLoanSeller, 'MIP' : MIP};
			response 		= getSellerAmountCONV(request);
			this.setState({amountseller: response.amount, adjustedamountseller: response.adjusted});
		}

		callPostApi(GLOBAL.BASE_URL + GLOBAL.fha_va_usda_setting_api, {
			user_id: this.state.user_id,company_id: this.state.company_id, zip: this.state.postal_code, loan_type: "CONV",calc_type: "Buyer"
		}, this.state.access_token)
		.then((response) => {

			this.setState({
				taxservicecontractseller : result.data.taxservicecontract,
				underwritingseller : result.data.underwriting,
				processingfeeseller : result.data.processingfee,
				appraisalfeeseller : result.data.appraisalfee,
				documentprepseller : result.data.documentpreparation,
				originationfactorseller : result.data.originationFactor,
			},this.callSellerEscrowSettingApi);
		});					
	}

		// Function for fetching and setting values of closing cost tab under FHA page
		callSellerFHAsettinsapi(){

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

				request 		= {'salePrice': this.state.sale_pr, 'LTV': LTV, 'MIP': MIP};				

				response 		= getSellerAmountFHA(request);

				
	
				this.setState({amountseller: response.amount, adjustedamountseller: response.adjusted});

				callPostApi(GLOBAL.BASE_URL + GLOBAL.fha_va_usda_setting_api, {
					user_id: this.state.user_id,company_id: this.state.company_id, zip: this.state.postal_code, loan_type: "FHA",calc_type: "Buyer"
				}, this.state.access_token)
				.then((response) => {
					this.setState({
						taxservicecontractseller: result.data.FHA_TaxServiceContract,
						underwritingseller: result.data.FHA_Underwriting,
						processingfeeseller: result.data.FHA_ProcessingFee,
						appraisalfeeseller: result.data.FHA_AppraisalFee,
						documentprepseller: result.data.FHA_DocumentPreparation,
						originationfactorseller: result.data.FHA_OriginationFactor,
					},this.callSellerEscrowSettingApi);	
				});
			} 
		}
		
		// Function for fetching and setting values of closing cost tab under VA page
		callSellerVAsettinsapi(){
			if(this.state.sale_pr != "" && this.state.sale_pr != '0.00'){
				request 		= {'salePrice': this.state.sale_pr,'LTV': this.state.VA_FundingFee};
				response 		= getSellerAmountVA(request);

				this.setState({amountseller: response.amount, adjustedamountseller: response.adjusted});
				
				callPostApi(GLOBAL.BASE_URL + GLOBAL.fha_va_usda_setting_api, {
					user_id: this.state.user_id,company_id: this.state.company_id,zip: this.state.postal_code, loan_type: "VA",calc_type: "Buyer"
				}, this.state.access_token)
				.then((response) => {
					this.setState({
						taxservicecontractseller: result.data.VA_TaxServiceContract,
						underwritingseller: result.data.VA_Underwriting,
						processingfeeseller: result.data.VA_ProcessingFee,
						appraisalfeeseller: result.data.VA_AppraisalFee,
						documentprepseller: result.data.VA_DocumentPreparation,
						originationfactorseller: result.data.VA_OriginationFactor,
					},this.callSellerEscrowSettingApi);
				});
				
			} 	
		}
		
		// Function for fetching and setting values of closing cost tab under USDA page
		callSellerUSDAsettinsapi(){
			if(this.state.sale_pr != "" && this.state.sale_pr != '0.00'){
				this.setState({amountseller: 0.00});
				this.setState({adjustedamountseller: 0.00});
				callPostApi(GLOBAL.BASE_URL + GLOBAL.fha_va_usda_setting_api, {
					user_id: this.state.user_id,company_id: this.state.company_id,zip: this.state.postal_code, loan_type: "USDA",calc_type: "Buyer"
				}, this.state.access_token)
				.then((response) => {
					this.setState({
						taxservicecontractseller: result.data.USDA_TaxServiceContract,
						underwritingseller: result.data.USDA_Underwriting,
						processingfeeseller: result.data.USDA_ProcessingFee,
						appraisalfeeseller: result.data.USDA_AppraisalFee,
						documentprepseller: result.data.USDA_DocumentPreparation,
						originationfactorseller: result.data.USDA_OriginationFactor,
					},this.callSellerEscrowSettingApi);
				});
				
			}	
		}
		
		// Function for fetching and setting values of closing cost tab under CASH page
		callSellerCASHsettinsapi() {
			this.setState({amountseller: 0.00});
			this.setState({adjustedamountseller: 0.00});
			this.setState({
				taxservicecontractseller: 0.00,
				underwritingseller: 0.00,
				processingfeeseller: 0.00,
				appraisalfeeseller: 0.00,
				documentprepseller: 0.00,
				originationfactorseller: 0.00,
				},this.callSellerEscrowSettingApi);
		}


	callSellerEscrowSettingApi() {

		date = this.state.date;
		var split = date.split('-');
		date = Number(split[0])+'/'+Number(split[1])+'/'+Number(split[2]);

		adjustedamount	= this.state.adjustedamountseller;
		//alert(adjustedamount);

		if(!isNaN(adjustedamount)) {

				//alert("city " + this.state.city + "county_name " + this.state.user_county + "salePrice " + this.state.sale_pr + "adjusted " + adjustedamount + "state " + this.state.state + "county " + this.state.county + 'zip ' + this.state.postal_code + "estStlmtDate " + date);
				callPostApi(GLOBAL.BASE_URL + GLOBAL.seller_escrow_xml_data, {
					"city": this.state.city,"county_name": this.state.user_county,"salePrice": this.state.sale_pr,"adjusted": adjustedamount,"state": this.state.state,"county": this.state.county, "loanType": this.state.tab, "zip": this.state.postal_code,  "estStlmtDate": date, 'userId':this.state.user_id,'device': this.state.deviceName, "calc":"seller"
				}, this.state.access_token)
				.then((response) => {

					this.setState({
						ownerFeeOrgseller: result.data.ownerFee,
						escrowFeeOrgseller: result.data.escrowFee,
						lenderFeeOrgseller: result.data.lenderFee,
						escrowFeeBuyerseller : result.data.escrowFeeBuyer,
						escrowFeeSellerseller : result.data.escrowFeeSeller,
					});
					
					this.setState({
						ownerFeeSeller: this.state.ownerFeeOrg,
						escrowFeeSeller: this.state.escrowFeeOrg,
						lenderFeeSeller: this.state.lenderFeeOrg,
						countyTaxseller : result.data.countyTax,
						cityTaxseller : result.data.cityTax
					});

				callGetApi(GLOBAL.BASE_URL + GLOBAL.ca_transfer_tax, {
					}, this.state.access_token)
					.then((response) => {

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

								this.setState({
									buyers_fee_text_seller : this.state.city + " transfer tax",
									buyersfeeseller : transfer_Tax
								}, this.calEscrowDataSeller);	

							}else{
								this.setState({
									buyers_fee_text_seller : "Buyer's Fee",
									buyersfeeseller : '0.00'
								}, this.calEscrowDataSeller);
							}	
						}else{
							this.setState({
								buyers_fee_text_seller : "Buyer's Fee",
								buyersfeeseller : '0.00'
							}, this.calEscrowDataSeller);	
						}
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

	calEscrowDataSeller() {
		this.state.escrowTotalSeller = parseFloat(this.state.lenderFeeSeller) + parseFloat(this.state.ownerFeeSeller) + parseFloat(this.state.escrowFeeSeller);
		let request 		= {'discountPerc': this.state.discseller,'amount': this.state.amountseller};
		let response 				= getSellerDiscountAmount(request);		
		this.setState({discseller: this.state.discseller,otherCostsDiscount2seller: response.discount});
		this.setState({escrowTotalSeller: this.state.escrowTotalSeller}, this.onOwnerChange("escrow"));
	}

	// this function is called when you change value from dropdown in case of Owners. 
 	onOwnerChange(defval) {

	    if(defval == 'escrow') {
		    this.state.selectedOwnerSellerTypeId    = this.state.ownerSellerType;
        } else {
            this.state.selectedOwnerSellerTypeId = defval;
        }
            
        if(this.state.selectedOwnerSellerTypeId == 'Split') {
            this.state.ownerFeeSeller   = this.state.ownerFeeOrgseller/2;
			this.onEscrowChange("escrow");
				
        } else if(this.state.selectedOwnerSellerTypeId == 'Buyer') {
            this.state.ownerFeeSeller   = '0.00';
			this.onEscrowChange("escrow");
				
        } else if(this.state.selectedOwnerSellerTypeId == 'Seller') {
            this.state.ownerFeeSeller   = this.state.ownerFeeOrgseller;
			this.onEscrowChange("escrow");			
        }
	}
	
	// this function is called when you change value from dropdown in case of Escr. or Settle.	
	onEscrowChange(defval) {
		 
        if(defval == 'escrow'){
            this.state.selectedEscrowSellerTypeId   = this.state.escrowSellerType;
        } else {
            this.state.selectedEscrowSellerTypeId   = defval;
        }   
        
        if(this.state.selectedEscrowSellerTypeId == 'Split') {
            if(this.state.escrowFeeBuyerseller == '0.0') {
                this.state.escrowFeeSeller  = this.state.escrowFeeSellerseller/2;
            } else if(this.state.escrowFeeSellerseller == '0.0') {
                this.state.escrowFeeSeller  = this.state.escrowFeeBuyerseller/2;
            } else {
                this.state.escrowFeeSeller  = this.state.escrowFeeSellerseller;
            }
			this.onLenderChange("escrow");
				
        } else if(this.state.selectedEscrowSellerTypeId == 'Seller') {
			this.state.escrowFeeSeller  = this.state.escrowFeeOrgseller;
			this.onLenderChange("escrow");
				
        } else if(this.state.selectedEscrowSellerTypeId == 'Buyer') {			
            this.state.escrowFeeSeller  = '0.00';
			this.onLenderChange("escrow");	
        }
	}
	
	
    // this function is called when you change value from dropdown in case of Lender.
	 onLenderChange(defval) { 
	    if(defval == 'escrow'){
            this.state.selectedLenderSellerTypeId   = this.state.lenderSellerType;
        } else {
            this.state.selectedLenderSellerTypeId     = defval;
        }   
        
        if(this.state.selectedLenderSellerTypeId == 'Split'){
            this.state.lenderFeeSeller  = this.state.lenderFeeOrgseller/2;
			this.totalCostDataUpdateFields();	
        } else if(this.state.selectedLenderSellerTypeId == 'Buyer'){
            this.state.lenderFeeSeller  = '0.00';
			this.totalCostDataUpdateFields();
        } else if(this.state.selectedLenderSellerTypeId == 'Seller'){
			this.state.lenderFeeSeller  = this.state.lenderFeeOrgseller;
			this.totalCostDataUpdateFields();
		}
		
	} 

	 totalCostDataUpdateFields() {

		if(this.state.originationFee == '') {
			originationFee = 0.00;
		} else {
			originationFee = this.state.originationFee;
		}

		totalCostDataSeller = parseFloat(this.state.drawingDeed) + parseFloat(this.state.notary) + parseFloat(this.state.transferTax) + parseFloat(this.state.pestControlReport) + parseFloat(this.state.benifDemandStatement) + parseFloat(this.state.reconveynceFee) + parseFloat(this.state.totalAgtSeller) + parseFloat(this.state.daysInterestSeller) + parseFloat(this.state.prepaymentPenalitySeller) + parseFloat(this.state.fee1) + parseFloat(this.state.fee2) + parseFloat(this.state.fee3) + parseFloat(this.state.fee4) + parseFloat(this.state.fee5) + parseFloat(this.state.fee6) + parseFloat(this.state.fee7) + parseFloat(this.state.fee8) + parseFloat(this.state.fee9) + parseFloat(this.state.fee10) + parseFloat(this.state.escrowFeeSeller) + parseFloat(this.state.ownerFeeSeller) + parseFloat(this.state.lenderFeeSeller);

		this.setState({totalSellerClosingCost: totalCostDataSeller}, this.callsalepricenewfunction);
		rsp = getUptoTwoDecimalPoint(this.state.totalSellerClosingCost);
		this.state.totalSellerClosingCost = rsp.val;

		console.log("seller closing cost " + this.state.totalSellerClosingCost);

		console.log("Total closing cost " + this.state.totalClosingCost);

	 } 

	 //######################  End Seller Closing Costs ########################## 

	 	callsalepricenewfunction () {

			if(myFuncCalls == 0) {
				for (let i = 0; i < 10; i++) {
					if(this.state.sale_pr_new != '' && this.state.sale_pr_new != "0.00") {
						this.state.appreciationAmount = (parseFloat(this.state.sale_pr_new) * parseFloat(this.state.annual_price_appreciation_amt) / 100).toFixed(2); // Appreciation Amount
						saleprice = (parseFloat(this.state.sale_pr_new) + parseFloat(this.state.appreciationAmount)).toFixed(2);
						
						this.state.sale_pr_new = saleprice;
					} else {
						this.state.appreciationAmount = (parseFloat(this.state.sale_pr) * parseFloat(this.state.annual_price_appreciation_amt) / 100).toFixed(2); // Appreciation Amount
						salprice = (parseFloat(this.state.sale_pr) + parseFloat(this.state.appreciationAmount)).toFixed(2); // New Selling Price
						this.state.sale_pr_new = salprice;
					}		
					this.state.ten_years_sp_array.push(this.state.sale_pr_new);
					if(i == 9) {
						this.calFinalFunction();
					}
				}
			//	alert(JSON.stringify(this.state.ten_years_cost_array));

			}
			myFuncCalls++;	
		 }

		 calFinalFunction() {
			//alert(this.state.ten_years_sp_array.length);

			if(this.state.ten_years_sp_array.length == 11) {
				for (let i = 0; i < this.state.ten_years_sp_array.length; i++) {
					this.state.sale_cost_at_year = (parseFloat(this.state.totalSellerClosingCost)).toFixed(2); // Sale Cost at year X (use CF ACTUAL COSTS, not 8% used here!)
					this.state.net = (parseFloat(this.state.ten_years_sp_array[i + 1]) - parseFloat(this.state.sale_cost_at_year)).toFixed(2);
					this.state.equity =  (parseFloat(this.state.net) - parseFloat(this.state.sale_pr)).toFixed(2);
					
					//this.state.intial_cost_cc = (parseFloat(this.state.totalClosingCost)).toFixed(2);
					
					this.state.intial_cost_cc = parseFloat(this.state.sale_pr).toFixed(2) * 0.04;
					
					this.state.net_roi = (parseFloat(this.state.equity) - parseFloat(this.state.intial_cost_cc)).toFixed(2);
					this.state.annual_interest = (parseFloat(this.state.todaysInterestRate) / 100 * parseFloat(this.state.adjusted_loan_amt)).toFixed(2);
					this.state.income_tax_rate_new = parseFloat(this.state.income_tax_rate) / 100;
					this.state.interest_deduction =  (parseFloat(this.state.income_tax_rate_new) * parseFloat(this.state.annual_interest)).toFixed(2);
					this.state.tax_deduction = (parseFloat(this.state.income_tax_rate_new) * parseFloat(this.state.annualPropertyTax)).toFixed(2);	


					if(parseFloat(this.state.tax_deduction) > parseFloat(this.state.fixed_tax_deduction_amt)) {
						this.state.tax_deduction = parseFloat(this.state.fixed_tax_deduction_amt);
					}	
					

					this.state.intialCost = (parseFloat(this.state.down_payment) + parseFloat(this.state.totalClosingCost)).toFixed(2);
					this.state.Piti  = (parseFloat(this.state.totalMonthlyPayment)).toFixed(2);
					this.state.Piti_for_payment = (parseFloat(this.state.Piti) * 12).toFixed(2);
			
					if(i == 0) {
						this.state.payment_org =  (parseFloat(this.state.Piti_for_payment) - parseFloat(this.state.interest_deduction) - parseFloat(this.state.tax_deduction)).toFixed(2);
						this.state.payment = this.state.payment_org;
					} else {
						this.state.payment = parseFloat(this.state.payment_org) * parseFloat(i + 1);
					}

					this.state.net_cost_of_ownership = (parseFloat(this.state.intialCost) + parseFloat(this.state.payment) - parseFloat(this.state.net_roi)).toFixed(2);
					if(this.state.net_cost_of_ownership != 'NaN') {
						this.state.ten_years_cost_array.push({"y" : this.state.net_cost_of_ownership, "x" : parseFloat(i + 1)});	
					}

					console.log("sale_cost_at_year  " + this.state.sale_cost_at_year);
					console.log("net  " + this.state.net);
					console.log("equity  " + this.state.equity);
					console.log("intial_cost_cc  " + this.state.intial_cost_cc);
					console.log("net_roi  " + this.state.net_roi);
					console.log("annual_interest  " + this.state.annual_interest);
					console.log("interest_deduction  " + this.state.interest_deduction);
					console.log("tax_deduction  " + this.state.tax_deduction);
					console.log("intialCost  " + this.state.intialCost);
					console.log("Piti  " + this.state.Piti);
					console.log("payment  " + this.state.payment);
					console.log("net_cost_of_ownership  " + this.state.net_cost_of_ownership);

				}	

				//alert(JSON.stringify(this.state.ten_years_cost_array));
				console.log("buyer graph array  " + JSON.stringify(this.state.ten_years_cost_array));
			
					for (let j = 0; j < 10; j++) {
						if(j == 0) {
							this.state.cumulative_annual_rent =  parseFloat(this.state.rent) * parseFloat(12);
							this.state.insurance = parseFloat(this.state.cumulative_annual_rent) * parseFloat(this.state.rent_insurance) / 100;
							this.state.annual_total = parseFloat(this.state.cumulative_annual_rent) + parseFloat(this.state.insurance);
							this.state.cumulative_total = parseFloat(this.state.annual_total);
						} else {
							if(this.state.rent_calc == "" || this.state.rent_calc == "0.00") {
								this.state.rent_calc = this.state.rent * (parseFloat(1) + parseFloat(this.state.rent_appreciation) / 100);
							} else {
								this.state.rent_calc = this.state.rent_calc * (parseFloat(1) + parseFloat(this.state.rent_appreciation) / 100);
							}
							this.state.cumulative_annual_rent =  parseFloat(this.state.rent_calc) * parseFloat(12);
							this.state.insurance = parseFloat(this.state.cumulative_annual_rent) * parseFloat(this.state.rent_insurance) / 100;
							this.state.annual_total = parseFloat(this.state.cumulative_annual_rent) + parseFloat(this.state.insurance);
							this.state.cumulative_total = (parseFloat(this.state.annual_total) + parseFloat(this.state.cumulative_total)).toFixed(2);
	
						}
						this.state.ten_years_cumulative_total_array.push({"y" : this.state.cumulative_total, "x" : parseFloat(j + 1)});
					}

				for(k = 0; k < 10; k++) {
					if( parseFloat(this.state.ten_years_cost_array[k].y) < parseFloat(this.state.ten_years_cumulative_total_array[k].y)){
						if(k == 0){
						titleOfOpt = 'Buying is always cheaper.';
						this.state.RentvsBuyText.push(titleOfOpt);
						
						} else {
							titleOfOpt = 'Buying is cheaper than renting after '+(k)+' years.';
							this.state.RentvsBuyText.push(titleOfOpt);
						}
					}
					if( parseFloat(this.state.ten_years_cost_array[k].y) > parseFloat(this.state.ten_years_cumulative_total_array[k].y)){
						if(k == 9){
							titleOfOpt = 'Renting is always cheaper.';
							this.state.RentvsBuyText.push(titleOfOpt);
						} 
					}

					if(k == 0) {
						if( parseFloat(this.state.ten_years_cost_array[k].y) < parseFloat(this.state.ten_years_cumulative_total_array[k].y)){
							this.state.minY = 0;
						} else {
							this.state.minY = 0;
						}	
					}

					if(k == 9) {
						if( parseFloat(this.state.ten_years_cost_array[k].y) > parseFloat(this.state.ten_years_cumulative_total_array[k].y)) {
							reminder = parseFloat(this.state.ten_years_cost_array[k].y) % 1000;
							minusData = 1000 - parseFloat(reminder);
							total_val = parseFloat(this.state.ten_years_cost_array[k].y) + parseFloat(minusData);
							actual_val = parseFloat(total_val) / 5;
							for(l = 1; l<=5; l++) {
								new_val = parseFloat(actual_val) * parseFloat(l) + parseFloat(2000);
								this.state.leftAxisData.push(new_val);
							}
							this.state.maxY = this.state.ten_years_cost_array[k].y;	
						} else {
							reminder = parseFloat(this.state.ten_years_cumulative_total_array[k].y) % 1000;
							minusData = 1000 - parseFloat(reminder);
							total_val = parseFloat(this.state.ten_years_cumulative_total_array[k].y) + parseFloat(minusData);
							actual_val = parseFloat(total_val) / 5;
							for(l = 1; l<=5; l++) {
								new_val = parseFloat(actual_val) * parseFloat(l) + parseFloat(2000);
								this.state.leftAxisData.push(new_val);
							}
							this.state.maxY = this.state.ten_years_cumulative_total_array[k].y;	
						}

					}
				}


				console.log("Rent graph array  " + JSON.stringify(this.state.ten_years_cumulative_total_array));
				
				this.state.show_chart_array.push(this.state.ten_years_cost_array, this.state.ten_years_cumulative_total_array);
				this.setState({animating : 'false'});
			}
			this.setState({animating : 'false'});	
		 }
	
	changeMortgageInsVal(){
		//creating object for amount and rate value
		requestMMI 		= {'amount': this.state.loan_amt, 'rateValue': this.state.rateValue};

		//calling method to calculate the FHa MIP Finance for prepaid
		responseMMI 		= getMonthlyRateMMI(requestMMI);

		monthlyRate		= responseMMI.monthlyRateMMI;
		monthPmiVal		= responseMMI.monthPmiVal;
		this.setState({monthlyRate: monthlyRate, monthPmiVal: monthPmiVal},this.calTotalPrepaidItems);
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
							'annualPropertyTax' : this.state.nullVal,
							'summerPropertyTax' : this.state.summerPropertyTax,
							'winterPropertyTax' : this.state.winterPropertyTax,
							'titleInsuranceType' : 'N',
							'titleInsuranceShortRate' : this.state.nullVal,
							'newLoanServiceFee' : this.state.nullVal,
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
							'prorationPercent': this.state.prorationPercent,
							
						};
						if(this.state.calculatorId != "" && this.state.calculatorId != "undefined"){
							buyerData.calculator_id = this.state.calculatorId;	
						}
						var temp = JSON.stringify(buyerData);
						temp = temp.replace(/\"\"/g, "\"0.00\"");
						buyerData = JSON.parse(temp);
						callPostApi(GLOBAL.BASE_URL + GLOBAL.save_buyer_calculator, buyerData,this.state.access_token).then((response) => {
							this.setState({monthlyRate: monthlyRate, monthPmiVal: monthPmiVal},this.calTotalPrepaidItems);
							if(result.status == 'success'){
								if(this.state.calculatorId != ""){
									this.dropdown.alertWithType('success', 'Success', "Calculator updated successfully");
								}else{
									this.dropdown.alertWithType('success', 'Success', "Calculator saved successfully");
								}
							}
						});
	}

	onPressMailingAddress() {
		this.setState({
			enterAddressBar : true
		});
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
	
	getBuyerCalculatorListApi()
	{
		
		callPostApi(GLOBAL.BASE_URL + GLOBAL.get_buyer_calculator, {userId: this.state.user_id, type: "Buyers"
		}, this.state.access_token)
		.then((response) => {

			// added by lovedeep
			if(result.data != ""){
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

			//commented by lovedeep
			/*var ds = new ListView.DataSource({
				rowHasChanged: (r1, r2) => r1 !== r2
			});
			this.setState({dataSource: ds.cloneWithRows(result.data)});*/



		});
	}
	
	editCalculator(id){
		callPostApi(GLOBAL.BASE_URL + GLOBAL.buyer_detail_calculator, {calculatorId: id
		}, this.state.access_token)
		.then((response) => {
			this.setState(result.data);
			this.setState({sale_pr: result.data.salePrice,lender_address: result.data.address, postal_code: result.data.zip, tab: result.data.buyerLoanType,ltv: result.data.conventionalLoanToValue_1Loan,todaysInterestRate1: result.data.conventionalInterestRate_2Loan,termsOfLoansinYears2: result.data.conventionalTermInYear_2Loan,ltv2: result.data.conventionalLoanToValue_2Loan,todaysInterestRate: result.data.interestRate,termsOfLoansinYears: result.data.termInYears,interestRateCap2: result.data.interestRateCap_2Loan,perAdjustment2: result.data.perAdjustment_2Loan,loan_amt: result.data.amount,loan_amt2: result.data.conventionalAmount2,adjusted_loan_amt: result.data.adjusted,down_payment: result.data.downPayment,disc: result.data.discount1,discAmt: result.data.discount2,taxservicecontract: result.data.taxServiceContract,documentprep: result.data.documentPreparation,appraisalfee: result.data.appraisal,label1: result.data.costLabel_1Value,costType_1Value: result.data.type1,fee1: result.data.costFee_1Value,label2: result.data.costLabel_2Value,type2: result.data.costType_2Value,fee2: result.data.costFee_2Value,label3: result.data.costLabel_3Value,type3: result.data.costType_3Value,fee3: result.data.costFee_3Value,label4: result.data.costLabel_4Value,type4: result.data.costType_4Value,fee4: result.data.costFee_4Value,label5: result.data.costLabel_5Value,type5: result.data.costType_5Value,fee5: result.data.costFee_5Value,label6: result.data.costLabel_6Value,type6: result.data.costType_6Value,fee6: result.data.costFee_6Value,label7: result.data.costLabel_7Value,type7: result.data.costType_7Value,fee7: result.data.costFee_7Value,label8: result.data.costLabel_8Value,type8: result.data.costType_8Value,fee8: result.data.costFee_8Value,label9: result.data.costLabel_9Value,type9: result.data.costType_9Value,fee9: result.data.costFee_9Value,label10: result.data.costLabel_10Value,type10: result.data.costType_10Value,fee10: result.data.costFee_10Value,monTaxVal: result.data.prepaidMonthTaxes1,monTax: result.data.prepaidMonthTaxes2,prepaidMonthTaxes: result.data.prepaidMonthTaxes3,numberOfMonthsInsurancePrepaid: result.data.prepaidMonthInsurance1,monIns: result.data.prepaidMonthInsurance2,monthInsuranceRes: result.data.prepaidMonthInsurance3,numberOfDaysPerMonth: result.data.daysInterest1,daysInterest: result.data.daysInterest2,escrowType: result.data.payorSelectorEscrow,escrowFee: result.data.escrowOrSettlement,ownersType: result.data.payorSelectorOwners,ownerFee: result.data.ownersTitlePolicy,lenderType: result.data.payorSelectorLenders,lenderFee: result.data.lendersTitlePolicy,escrowFeeOrg: result.data.escrowFeeHiddenValue,lenderFeeOrg: result.data.lendersFeeHiddenValue,ownerFeeOrg: result.data.ownersFeeHiddenValue,principalRate: result.data.principalAndInterest,realEstateTaxesRes: result.data.realEstateTaxes,homeOwnerInsuranceRes: result.data.homeownerInsurance,rateValue: result.data.paymentRate,monthlyRate: result.data.paymentMonthlyPmi,twoMonthsPmi: result.data.monthPmiVal,twoMonthsPmi1: result.data.prepaidCost,costOther: result.data.prepaidAmount,monthlyExpensesOther1: result.data.paymentMonthlyExpense1,monthlyExpensesOther2: result.data.paymentMonthlyExpense2,totalMonthlyPayment: result.data.totalMonthlyPayement,county: result.data.countyId,summerPropertyTax : result.data.summerPropertyTax, winterPropertyTax : result.data.winterPropertyTax, prorationPercent : result.data.prorationPercent,state: result.data.stateId, calculatorId: id});
			this.setModalVisible(!this.state.modalVisible);
		});
	}
	
	renderAddrsRow(rowData){
		return (
			<View style={RentVsBuyStyle.scrollable_container_child_center}>
				<View style={{width: '100%',justifyContent: 'center'}}>
					<TouchableOpacity>
						<CheckBox checkedColor='#CECECE' checked={this.state[rowData.email].isAddrsChecked} onPress = { () => this.handlePressAddressCheckedBox(rowData.email) } title={rowData.email}/>
							
					</TouchableOpacity>
				</View>
			</View>
		);
	}
	
	renderRow(rowData) {
		id = rowData.calculatorId;
		return (
			<View style={RentVsBuyStyle.scrollable_container_child_center}>
				<View style={RentVsBuyStyle.savecalcvalue}>
					<TouchableOpacity onPress={() => this.editCalculator(id)}>
						<Text style={RentVsBuyStyle.text_style}>
							{rowData.calculatorName}
						</Text>
					</TouchableOpacity>
				</View>
				<View style={RentVsBuyStyle.savecalcvalue}>
					
					<Text style={RentVsBuyStyle.alignCenter}>
						{rowData.address} {"\n"}{rowData.createdDate}
					</Text>
				</View>
				<TouchableOpacity style={RentVsBuyStyle.savecalcvaluesmall} onPress={() => this.saveBuyerCalculatorDetailsApi()}>
					<Image source={Images.recycle}/>
				</TouchableOpacity>
			</View>
		);
	}
	
	onActionSelected(position) {
		if(this.state.dropValues == "PRINT"){
			var graphImg = this.refs.linechart.alert();
			AsyncStorage.getItem("Base64Image").then(
				(resultpl) =>{ 
					if(resultpl !== null && resultpl !== ''){
						newstr = resultpl.replace(/\\/g, "");
						this.setState({
							base64Image : newstr
						});		
					}
			   });

			this.setState({popupType: "print"},this.popupShow);
			this.setState({
				dropValues : ""
			});
		}else if(this.state.dropValues == "EMAIL"){

			var graphImg = this.refs.linechart.alert();

			AsyncStorage.getItem("Base64Image").then(
				(resultpl) =>{ 
					if(resultpl !== null && resultpl !== ''){
						newstr = resultpl.replace(/\\/g, "");
						this.setState({
							base64Image : newstr
						});		
					}
			   });

			   this.setState({
					dropValues : ""
				});
			this.setEmailModalVisible(!this.state.emailModalVisible);
		}
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
	
	popupShowAddEmailAddress() {
		this.popupDialogAddEmailAddress.show();
	}
	   
	popupHideAddEmailAddress() {
		this.popupDialogAddEmailAddress.dismiss();
		if(param == 'dont_save') {
			this.onCallSocialSigninFunc();
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

	// this is for updating empty fields to 0.00 on blur
	onFocus (fieldName, viewHeight) {
		
		if(fieldName == 'lendername') {
			this.setState({
				[fieldName]: '',
			}) 
		}

		console.log("viewHeight " + viewHeight);
	
		this.refs.scrollView1.scrollTo({y:viewHeight});
		
		if(fieldName == 'lender_address') {
			this.setState({
				enterAddressBar : true
			});
			//this.props.navigator.push({name: 'GooglePlaceAutoComplete', index: 0 });
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
			});
		}	
	}


	onBlur(text) {
		if(text == 'lendername') {
			if(this.state.lendername == "") {
				this.setState({
					lendername : 'New Client',
				}) 
			}

		}

		if(text == 'homePrice' && this.state.defaultVal != this.state.sale_pr) {
			if(this.state.sale_pr == '' || this.state.sale_pr == '0.00') {
				this.setState({
					sale_pr : '0.00'
				});
			} else {
				if(this.state.ten_years_sp_array.length > 0 || this.state.ten_years_cost_array.length > 0 || this.state.ten_years_cumulative_total_array.length > 0 || this.state.show_chart_array.length > 0) {
					this.state.ten_years_sp_array = [];
					this.state.ten_years_cost_array = [];
					this.state.ten_years_cumulative_total_array = [];
					this.state.show_chart_array = [];
					this.state.leftAxisData = [];
					this.state.rent_calc = '0.00';
					this.state.RentvsBuyText = [];
					myFuncCalls = 0;
					this.state.sale_pr_new = '0.00';
					this.state.appreciationAmount = '0.00';
				}
				this.state.sale_pr_new = '0.00';
				this.state.appreciationAmount = '0.00';
				//newText = this.refs.homePrice._lastNativeText;
				newText = this.state.sale_pr;
				
				//newText = newText.replace(/\D/g,'');
				val = newText.replace(/[^0-9\.]/g,'');
				if(val.split('.').length>2) {
					val =val.replace(/\.+$/,"");
				}
				newText = val;
				var value = parseFloat(newText);
				value = value.toFixed(2);

				this.setState({
					sale_pr : value
				}, this.onChangeRate(newText,"sale_pr"));
			} 
		}


		if(text == 'Rent' && this.state.defaultVal != this.state.rent) {
			if(this.state.rent == '' || this.state.rent == '0.00') {
				this.setState({
					rent : '0.00'
				});
			} else {
				if(this.state.ten_years_sp_array.length > 0 || this.state.ten_years_cost_array.length > 0 || this.state.ten_years_cumulative_total_array.length > 0 || this.state.show_chart_array.length > 0) {
					this.state.ten_years_sp_array = [];
					this.state.ten_years_cost_array = [];
					this.state.ten_years_cumulative_total_array = [];
					this.state.show_chart_array = [];
					this.state.leftAxisData = [];
					this.state.rent_calc = '0.00';
					this.state.sale_pr_new = '0.00';
					this.state.appreciationAmount = '0.00';
					this.state.RentvsBuyText = [];
					myFuncCalls = 0;
				}
				if(this.state.rent == '') {
					this.state.ten_years_sp_array.push(this.state.sale_pr);
					this.setState({
						rent : '0.00',
					}, this.callSellerCostSettingApi);
				} else {
					//newText = this.refs.Rent._lastNativeText;
					newText = this.state.rent;
					//newText = newText.replace(/\D/g,'');
					val = newText.replace(/[^0-9\.]/g,'');
					if(val.split('.').length>2) {
						val =val.replace(/\.+$/,"");
					}
					newText = val;
					this.state.ten_years_sp_array.push(this.state.sale_pr);
					var value = parseFloat(newText);
					value = value.toFixed(2);
					this.setState({
						rent : value,
						animating : 'true'
					}, this.callSellerCostSettingApi);
				}
			}
		}
	}			
	
	printPDF(){
			rentVsData = this.getData();
			rentVsData.graph_image = "data:image/png;base64," + this.state.base64Image;
			rentVsData.actionType = 'pdf';

		callPostApi(GLOBAL.BASE_URL + GLOBAL.Rent_vs_Buy_Email_Print_Api, rentVsData, this.state.access_token)
		.then((response) => {

			console.log("resp " + JSON.stringify(result));
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
			var ds = new ListView.DataSource({
				rowHasChanged: (r1, r2) => r1 !== r2
			});
			var i=1;
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
	
	// function for sending email
	sendEmail(){
		this.setState({animating : 'true', loadingText : 'Please wait..'});
		
			if(this.state.to_email == ""){
				this.dropdown.alertWithType('error', 'Error', 'Please enter email address');
			}else{
				rentVsData = this.getData();
				rentVsData.email = this.state.to_email;
				rentVsData.image = this.state.imageNameEmail;
				rentVsData.video = this.state.videoNameEmail;
				rentVsData.subject = this.state.email_subject;
				rentVsData.note = this.state.content;
				rentVsData.graph_image = "data:image/png;base64," + this.state.base64Image;
				rentVsData.actionType = 'email';

				console.log("rentvsdata " + JSON.stringify(rentVsData));


				callPostApi(GLOBAL.BASE_URL + GLOBAL.Rent_vs_Buy_Email_Print_Api, rentVsData,this.state.access_token)
				.then((response) => {
					this.setState({animating : 'false'});
		

					this.setState({
						to_email : ""
					});
					this.state.verified_email = result.email;
					this.setState({
						newEmailAddress : result.email
					});
	
					//alert(JSON.stringify(result));
	
					AsyncStorage.setItem("pdfFileName", result.data);
					AsyncStorage.setItem("calculator", "rent_vs_buy");
					//this.props.navigator.push({name: 'GoogleSigninExample', index: 0 });
					//this.popupHideEmail();
					//this.popupHide();
					AsyncStorage.removeItem("evernote");
					AsyncStorage.removeItem("dropbox");
					this.setEmailModalVisible(!this.state.emailModalVisible);
					this.dropdown.alertWithType('success', 'Success', "Email sent successfully");
				});
		}
	}
	
	getData(){
	
		rentVsData 	= 	{
			'company_id'	: this.state.company_id,
			'user_id' : this.state.user_id,
			'preparedBy' : this.state.user_name,
			'preparedFor' : this.state.lendername,
			'address' : this.state.lender_address,
			'city' : this.state.city,
			'state' : this.state.user_state,
			'zip' : this.state.postal_code,
			'lendername' : this.state.lendername,
			'salesprice' : this.state.sale_pr,
			'rentprice' : this.state.rent,
		};
		
		return rentVsData;
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

	// this is for updating empty fields to 0.00 on blur
	updateFormField (fieldVal, fieldName, functionCall) {

		if(this.state.count == 1) {
			fieldVal = this.removeCommas(fieldVal);
			if(this.state.defaultVal != fieldVal) {
			//	alert('in update');

					if(fieldName == 'rent_appreciation' || fieldName == 'rent_insurance' || fieldName == 'annual_price_appreciation_amt' || fieldName == 'income_tax_rate' || fieldName == 'paymentAmount1' || fieldName == 'annualPropertyTax') {
						if(this.state.ten_years_sp_array.length > 0 || this.state.ten_years_cost_array.length > 0 || this.state.ten_years_cumulative_total_array.length > 0 || this.state.show_chart_array.length > 0) {
							this.state.ten_years_sp_array = [];
							this.state.ten_years_cost_array = [];
							this.state.ten_years_cumulative_total_array = [];
							this.state.show_chart_array = [];
							this.state.leftAxisData = [];
							this.state.rent_calc = '0.00';
							this.state.RentvsBuyText = [];
							this.state.sale_pr_new = '0.00';
							this.state.appreciationAmount = '0.00';
							myFuncCalls = 0;
						}
						this.state.ten_years_sp_array.push(this.state.sale_pr);
					}
					if(fieldName == 'income_tax_rate') {
						if(fieldVal==''){
							processedData = '0.00';
						}else{
							processedData = fieldVal;
						}

						if(fieldVal >= parseFloat(this.state.income_tax_rate_min) && fieldVal <= parseFloat(this.state.income_tax_rate_max)) {
							processedData = processedData.toLocaleString('en');
							this.setState({
								[fieldName]: processedData,
							},functionCall)
						} else {
							this.setState({
								income_tax_rate_status : true
							});
							
							this.dropdown.alertWithType('error', 'Error', "Please enter income tax rate between "+this.state.income_tax_rate_min+" and "+this.state.income_tax_rate_max+".");
						}
					} 
					else {
						if(fieldVal == ''){
							processedData = '0.00';
						}else{
							processedData = fieldVal;
						}
						processedData = processedData.toLocaleString('en');
						this.setState({
							[fieldName]: processedData,
						},functionCall)
					}	

					if(fieldVal != '') {
						var value = parseFloat(fieldVal);
						value = value.toFixed(2);
						this.setState({
							[fieldName] : value
						});
					}
			}	
			this.state.count = 0;	
	    }	 else {
			this.setState({
				[fieldName]: '0.00',
			});
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
	updatePostalCode (fieldVal, fieldName) {
		this.setState({animating:'true'});
		processedData = fieldVal;
			
		callPostApi(GLOBAL.BASE_URL + GLOBAL.get_city_state_for_zip, {
		"zip": processedData

		},this.state.access_token)
		.then((response) => {
			zipRes = result;
			if(zipRes.data.state_name != null || zipRes.data.state_name != 'NULL'){
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

    toggleCancel () {
        this.setState({
            showCancel: !this.state.showCancel
		});
		if(this.state.toggleButton == 'Advanced') {
			this.setState({
				toggleButton : 'Basic'
			});
			this.refs.scrollView1.scrollToEnd({animated: true});
	} else {
			this.setState({
				toggleButton : 'Advanced'
			});
		 }
    }

    renderCancel () {
        if (this.state.showCancel != false) {
            return (
                <View style={{marginTop : -18}} onLayout={(event) => this.measureView(event,'AdvanceHeight')}>
                    <View style={[RentVsBuyStyle.loandetailhead,{paddingLeft:10, paddingRight:10}]}>
                        <View style={RentVsBuyStyle.title_justify}>
                            <Text style={RentVsBuyStyle.text_style}>{STRINGS.t('RentVsBuy_Rent_Appreciation')}</Text>
                        </View>
                        <View style={{width:'30%',justifyContent:'center'}}>
                            <View style={RentVsBuyStyle.alignrightinput}>
                                <Text style={RentVsBuyStyle.alignCenter}>% </Text>
                                <CustomTextInput customKeyboardType="hello" style={RentVsBuyStyle.width100} underlineColorAndroid='transparent' onKeyPress={() => this.onFocus('rent_appreciation', this.state.AdvanceHeight)} onChangeText={(value) => this.setState({rent_appreciation: this.onChange(value)})} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'rent_appreciation',  this.callSellerCostSettingApi()) } value={this.state.rent_appreciation.toString()}/>
                            </View>
                            <View style={[RentVsBuyStyle.fullunderline, ]}></View>
                        </View>
                    </View> 
                    <View style={[RentVsBuyStyle.loandetailhead,{paddingLeft:10, paddingRight:10}]}>
                        <View style={RentVsBuyStyle.title_justify}>
                            <Text style={RentVsBuyStyle.text_style}>{STRINGS.t('RentVsBuy_Rent_Insurance')}</Text>
                        </View>
                        <View style={{width:'30%',justifyContent:'center'}}>
                            <View style={RentVsBuyStyle.alignrightinput}>
                                <Text style={RentVsBuyStyle.alignCenter}>% </Text>
                                <CustomTextInput customKeyboardType="hello" style={RentVsBuyStyle.width100} underlineColorAndroid='transparent' onKeyPress={() => this.onFocus('rent_insurance', this.state.AdvanceHeight)} onChangeText={(value) => this.setState({rent_insurance: this.onChange(value)})} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'rent_insurance',  this.callSellerCostSettingApi()) } value={this.state.rent_insurance.toString()}/>
                            </View>
                            <View style={[RentVsBuyStyle.fullunderline, ]}></View>
                        </View>
                    </View> 
                    <View style={[RentVsBuyStyle.loandetailhead,{paddingLeft:10, paddingRight:10, marginBottom:8}]}>
                        <View style={RentVsBuyStyle.title_justify}>
                            <Text style={RentVsBuyStyle.text_style}>{STRINGS.t('RentVsBuy_Annual_Price_Appreciation')}</Text>
                        </View>
                        <View style={{width:'30%',justifyContent:'center'}}>
                            <View style={RentVsBuyStyle.alignrightinput}>
                                <Text style={RentVsBuyStyle.alignCenter}>% </Text>
                                <CustomTextInput customKeyboardType="hello" style={RentVsBuyStyle.width100} underlineColorAndroid='transparent' onKeyPress={() => this.onFocus('annual_price_appreciation_amt', this.state.AdvanceHeight)} onChangeText={(value) => this.setState({annual_price_appreciation_amt: this.onChange(value)})} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'annual_price_appreciation_amt',  this.callSellerCostSettingApi()) } value={this.state.annual_price_appreciation_amt.toString()}/>
                            </View>
                            <View style={[RentVsBuyStyle.fullunderline, ]}></View>
                        </View>
                    </View>
                </View>     
            );
        } else {
            return null;
        }
    }

	downPaymentChange(downPayment){
		this.removeCommas(downPayment);
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
		this.setState({downPaymentFixed: true,ltv: resaleConventionalLoanLTV},this.callSalesPr);
		//creating object for origination fee and amount
	}

	changeAnnualTax(){
		var monthNames = [ "", "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec" ]; 
		date = this.state.date;
		var split = date.split('-');
		//this.state.annualPropertyTax = parseFloat(this.state.annualPropertyTax).toFixed(2);
		//monthNameForProration = monthNames[Number(split[0])];
		//prorationAmt = this.state.proration[monthNameForProration];
	
		date = Number(split[0])+'/'+Number(split[1])+'/'+Number(split[2]);
		
		monthNameForProration = monthNames[Number(split[0])];
		prorationAmt = this.state.proration; 
		

		/**==================================================================================================== 
		 
			Start Proration changes by lovedeep for multiple states as per discussion with Vinod Sir on 04-06-2018   
		==================================================================================================**/

		
		/** 
		 * Below old Code commented by lovedeep 
		 *   
		
		request         = {'annualPropertyTax': this.state.annualPropertyTax, 'proration': prorationAmt, 'date': parseInt(split[1]), 'month': parseInt(split[0]), 'state_code': this.state.state_code};
		data = getBuyerEstimatedTax(request)
		this.setState({estimatedTaxProrations: data.estimatedTax},this.changePrepaidPageFields);
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
				request         = {'summerPropertyTax': this.state.summerPropertyTax, 'winterPropertyTax': this.state.winterPropertyTax, 'prorationPercent': this.state.prorationPercent, 'annualPropertyTax': this.state.annualPropertyTax, 'proration': prorationAmt, 'closing_date':  date, 'state_code': this.state.state_code, 'state_id' : this.state.state, 'county_id' : this.state.county, 'city': this.state.city};
				console.log("proration request " + JSON.stringify(request));

				//alert(JSON.stringify(request));

				data = getBuyerEstimatedTax(request);
				console.log("proration resp " + JSON.stringify(data));
				this.setState({estimatedTaxProrations: data.estimatedTax},this.changePrepaidPageFields);
			}
		} else {
			request         = {'summerPropertyTax': this.state.summerPropertyTax, 'winterPropertyTax': this.state.winterPropertyTax, 'prorationPercent': this.state.prorationPercent, 'annualPropertyTax': this.state.annualPropertyTax, 'proration': prorationAmt, 'closing_date':  date, 'state_code': this.state.state_code, 'state_id' : this.state.state, 'county_id' : this.state.county, 'city': this.state.city};
			console.log("proration request " + JSON.stringify(request));
			//alert(JSON.stringify(request));
			data = getBuyerEstimatedTax(request);
			
			console.log("proration resp " + JSON.stringify(data));
			this.setState({estimatedTaxProrations: data.estimatedTax},this.changePrepaidPageFields);
		}



		/**==================================================================================================== 
		 
		End Proration changes by lovedeep for multiple states as per discussion with Vinod Sir on 04-06-2018   
		==================================================================================================**/


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

    render() {
		let showable;
		if(this.state.animating == 'true') {
			this.state.visble = true;
		} else {
			this.state.visble = false;
		}

		if(this.state.showChart == false && this.state.GooglePlaceAutoCompleteShow == false) {
			showable=<View style={RentVsBuyStyle.TopContainer}>
			<View style={RentVsBuyStyle.iphonexHeader}></View>
			<View style={RentVsBuyStyle.outerContainer}>
				<View style={{ flex: 1 }}>
					<Spinner visible={this.state.visble} textContent={this.state.loadingText} textStyle={{color: '#FFF'}} />
				</View>	
				<View style={RentVsBuyStyle.HeaderContainer}>
                    <Image style={RentVsBuyStyle.HeaderBackground} source={Images.header_background}></Image>
                    <TouchableOpacity style={{width:'20%'}} onPress={this.onBackHomePress.bind(this)}>
                        <Image style={RentVsBuyStyle.back_icon} source={Images.back_icon}/>
                    </TouchableOpacity>
                    <Text style={RentVsBuyStyle.header_title}>{STRINGS.t('RentVsBuy')}</Text>
                
					<View style={{alignItems:'flex-end', width:'20%',paddingRight:15, marginRight : 20, justifyContent:'center'}}>
					<TouchableOpacity onPress={this.onShowChartPress.bind(this)}>
                    	<Image source={Images.graph}></Image>
                    </TouchableOpacity>   
					</View>	 
				</View>
				{renderIf(this.state.footer_tab == 'buyer')(
					<View style={{height:'100%',width:'100%'}}>
						<View style={RentVsBuyStyle.headerwrapper} >
							<View style={RentVsBuyStyle.subHeaderNewDesign}>
								
									<View style={{flexDirection: 'row'}}>
										<View style={{paddingRight:10,paddingLeft:10,paddingTop:5,width:'100%',marginTop: 5}}>
											<TextInput style={RentVsBuyStyle.headerTextInputField} autoCapitalize = 'words' underlineColorAndroid='transparent' onChangeText={(value) => this.setState({lendername: value})} value={this.state.lendername.toString()} onFocus={() => this.onFocus('lendername')} onBlur={() => this.onBlur("lendername")} />
										</View>
									</View>
									
									<View style={[RentVsBuyStyle.scrollable_container_child,{paddingRight:10,paddingLeft:10,paddingTop:5}]}>
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
									
									<View style={{flexDirection: 'row',paddingRight:10,paddingLeft:10,paddingTop:5, zIndex : -1}}>
										<View style={{width:'48%'}}>
											<TextInput style={RentVsBuyStyle.headerTextInputField} placeholder='State' underlineColorAndroid='transparent' onChangeText={(value) => this.setState({state_code: this.onChange(value)})} value={this.state.state_code}/>
										</View>
										<View style={{width:'48%',marginLeft:'4%'}}>
											<TextInput style={RentVsBuyStyle.headerTextInputField} placeholder='Zip Code' underlineColorAndroid='transparent' onChangeText={(value) => this.setState({postal_code: this.onChange(value)})} onEndEditing={ (event) => this.updatePostalCode(event.nativeEvent.text,'postal_code') } value={this.state.postal_code.toString()}/>
										</View>
									</View>
									<View style={{flexDirection: 'row', zIndex : -1}}>
										<View style={{paddingRight:10,paddingLeft:10,paddingTop:5,width:'100%',paddingTop:5}}>
											<CustomTextInput customKeyboardType="hello" placeholder={STRINGS.t('RentVsBuy_Sale_Price')} name="sale_pr" ref="sale_pr"  underlineColorAndroid = 'transparent' style={RentVsBuyStyle.headerTextInputField} selectTextOnFocus={ true } onKeyPress={() => this.onFocus('sale_pr')} onChangeText={(value) => this.setState({sale_pr: this.onChange(value)})} onBlur={() => this.onBlur("homePrice")}
											placeholder={STRINGS.t('RentVsBuy_Sale_Price')}
											value={ this.state.sale_pr == '0.00' ? this.state.sale_pr_empty : this.delimitNumbers(this.state.sale_pr) } 
											/>
										</View>
									</View>
									<View style={{flexDirection: 'row', zIndex : -1}}>
										<View style={{paddingRight:10,paddingLeft:10,paddingTop:5,width:'100%',paddingTop:5}}>
											<CustomTextInput customKeyboardType="hello" placeholder={STRINGS.t('RentVsBuy_Rent')} name="rent" ref="rent" underlineColorAndroid = 'transparent' style={RentVsBuyStyle.headerTextInputField} selectTextOnFocus={ true } onKeyPress={() => this.onFocus('rent')} onChangeText={(value) => this.setState({rent: this.onChange(value)})} onBlur={() => this.onBlur("Rent")} 
											value={ this.delimitNumbers(this.state.rent)}
											value={ this.state.rent == '0.00' ? this.state.rent_empty : this.delimitNumbers(this.state.rent) } 
											/>
										</View>	
									</View>
									
									<View style={[RentVsBuyStyle.segmentViewNewDesign,{paddingRight:10,paddingLeft:10,marginBottom:10, zIndex : -1}]}>
								
										<View style={[RentVsBuyStyle.segmentButtonBackgroundView,(this.state.tab == 'FHA') ? {backgroundColor:'#000000'}:{}]}>
											<TouchableOpacity style={RentVsBuyStyle.segmentButtonNewDesign} onPress={() => this.settingsApi("FHA")}>
											<Text style={RentVsBuyStyle.style_btnTextNewDesign}>{STRINGS.t('FHA')}</Text>
											</TouchableOpacity>
										</View>

										<View style={RentVsBuyStyle.verticalLineForSegmentNewDesign}></View>

										<View style={[RentVsBuyStyle.segmentButtonBackgroundView,(this.state.tab == 'VA') ? {backgroundColor:'#000000'}:{}]}>
											<TouchableOpacity style={RentVsBuyStyle.segmentButtonNewDesign} onPress={() => this.settingsApi("VA")}>
											<Text style={RentVsBuyStyle.style_btnTextNewDesign}>{STRINGS.t('VA')}</Text>
											</TouchableOpacity>
										</View>

										<View style={RentVsBuyStyle.verticalLineForSegmentNewDesign}></View>

										<View style={[RentVsBuyStyle.segmentButtonBackgroundView,(this.state.tab == 'USDA') ? {backgroundColor:'#000000'}:{}]}>
											<TouchableOpacity style={RentVsBuyStyle.segmentButtonNewDesign} onPress={() => this.settingsApi("USDA")}>
											<Text style={RentVsBuyStyle.style_btnTextNewDesign}>{STRINGS.t('USDA')}</Text>
											</TouchableOpacity>
										</View>

										<View style={RentVsBuyStyle.verticalLineForSegmentNewDesign}></View>

										<View style={[RentVsBuyStyle.segmentButtonBackgroundView,(this.state.tab == 'CONV') ? {backgroundColor:'#000000'}:{}]}>
											<TouchableOpacity style={RentVsBuyStyle.segmentButtonNewDesign} onPress={() => this.settingsApi("CONV")}>
											<Text style={RentVsBuyStyle.style_btnTextNewDesign}>{STRINGS.t('Conv')}</Text>
											</TouchableOpacity>
										</View>

										<View style={RentVsBuyStyle.verticalLineForSegmentNewDesign}></View>
										<View style={[RentVsBuyStyle.segmentButtonBackgroundView,(this.state.tab == 'CASH') ? {backgroundColor:'#000000'}:{}]}>
											<TouchableOpacity style={RentVsBuyStyle.segmentButtonNewDesign} onPress={() => this.settingsApi("CASH")}>
											<Text style={RentVsBuyStyle.style_btnTextNewDesign}>{STRINGS.t('Cash')}</Text>
											</TouchableOpacity>
										</View>
									</View>
								
							</View>
						</View>
						<View style={(this.state.initialOrientation == 'portrait') ? ((this.state.orientation == 'portrait') ? RentVsBuyStyle.scrollviewheight : RentVsBuyStyle.scrollviewheightlandscape): ((this.state.orientation == 'landscape') ? RentVsBuyStyle.scrollviewheight : RentVsBuyStyle.scrollviewheightlandscape)}>
							<ScrollView
								showsVerticalScrollIndicator={true}
								keyboardShouldPersistTaps="always"
								//keyboardDismissMode='on-drag'
								ref="scrollView1"
								onTouchStart={this._onMomentumScrollEnd}
								style={RentVsBuyStyle.sellerscrollview}
							>    
								
									<View style={RentVsBuyStyle.loanstopaybox}>
										<View style={RentVsBuyStyle.headerloanratio}>
										{renderIf(this.state.tab == 'CONV')(
											<Text style={RentVsBuyStyle.headerloanratiotext}>
												{STRINGS.t('1_loan')}
											</Text>
										)}	
											{renderIf(this.state.tab == 'CONV')(
												<Text style={RentVsBuyStyle.headerloanratiotext}>
													{STRINGS.t('2_loan')}
												</Text>
											)}
										</View>
									</View>
									
								{renderIf(this.state.tab == 'CONV')(
									<View style={RentVsBuyStyle.loandetailhead} onLayout={(event) => this.measureView(event,'ltvHeight')}>
										<View style={RentVsBuyStyle.existingfirst}>
											<Text style={RentVsBuyStyle.existingheadtext}>{STRINGS.t('ltv')}</Text>
										</View>
										<Text style={RentVsBuyStyle.existingtext}>%</Text>
										<View style={RentVsBuyStyle.existingfirstbalance}>
											<View style={{width:'100%',flexDirection:'row', marginBottom : 7}}>
												<CustomTextInput customKeyboardType="hello"  ref='ltv' returnKeyType ="next" style={[RentVsBuyStyle.width70,{alignSelf:'center'}]} underlineColorAndroid='transparent'  selectTextOnFocus={ true } onKeyPress={() => this.onFocus('ltv',this.state.ltvHeight)} onChangeText={(value) => this.setState({ltv: this.onChange(value)})} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'ltv', this.onChangeRate(event.nativeEvent.text,"ltv")) } value={this.delimitNumbers(this.state.ltv)} />
											</View>
											<View style={RentVsBuyStyle.textboxunderline}>
												<View style={[RentVsBuyStyle.fullunderline, ]}></View>
											</View>
										</View>
										<Text style={RentVsBuyStyle.existingtext}>%</Text>
										<View style={RentVsBuyStyle.existingfirstbalance}>
											<View style={{width:'100%',flexDirection:'row', marginBottom : 7}}>
												
												<CustomTextInput customKeyboardType="hello" 
													returnKeyType ="next" 
													style={[RentVsBuyStyle.width70,{alignSelf:'center'}]} 
													underlineColorAndroid='transparent'
													ref='ltv2' 
													selectTextOnFocus={ true }
													onFocus={() => this.onFocus('ltv2',this.state.ltvHeight)}
													onChangeText={(value) => this.setState({ltv2: this.onChange(value)})} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'ltv2', this.onChangeRate(event.nativeEvent.text,"ltv2")) }
													value={this.delimitNumbers(this.state.ltv2)} 
												/>
											</View>
											<View style={RentVsBuyStyle.textboxunderline}>
												<View style={[RentVsBuyStyle.fullunderline, ]}></View>
											</View>
										</View>
									</View>
								)}	

									<View style={RentVsBuyStyle.loandetailhead} onLayout={(event) => this.measureView(event,'rateHeight')}>
										<View style={RentVsBuyStyle.existingfirst}>
											<Text style={RentVsBuyStyle.existingheadtext}>{STRINGS.t('rate')}</Text>
										</View>
										<Text style={RentVsBuyStyle.existingtext}>%</Text>
										<View style={RentVsBuyStyle.existingfirstbalance}>
											<View style={{width:'100%',flexDirection:'row', marginBottom : 7}}>
                                               <CustomTextInput customKeyboardType="hello" 
												
													returnKeyType ="next" style={[RentVsBuyStyle.width70,{alignSelf:'center'}]} 
													underlineColorAndroid='transparent'  
													selectTextOnFocus={ true }
													ref='todaysInterestRate'
													onKeyPress={() => this.onFocus('todaysInterestRate', this.state.rateHeight)}
													onChangeText={(value) => this.setState({todaysInterestRate: this.onChange(value), todaysInterestRateFixed : true})} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'todaysInterestRate', this.callSalesPr) }
													value={this.delimitNumbers(this.state.todaysInterestRate)} 
												/>
											</View>
											<View style={RentVsBuyStyle.textboxunderline}>
												<View style={[RentVsBuyStyle.fullunderline, ]}></View>
											</View>
										</View>
										{(this.state.ltv2 > 0 && this.state.tab == 'CONV') ?
										<Text style={RentVsBuyStyle.existingtext}>%</Text>
										:false}
										{(this.state.ltv2 > 0 && this.state.tab == 'CONV') ?
										<View style={RentVsBuyStyle.existingfirstbalance}>
											<View style={{width:'100%',flexDirection:'row', marginBottom : 7}}>
                                            	<CustomTextInput customKeyboardType="hello" 
													editable= {(this.state.ltv2 != '') ? true : false} 
													returnKeyType ="next" 
													ref='todaysInterestRate1'
													style={[RentVsBuyStyle.width70,{alignSelf:'center'}]} 
													underlineColorAndroid='transparent'
													selectTextOnFocus={ true }
													onKeyPress={() => this.onFocus('todaysInterestRate1',this.state.rateHeight)}
													onChangeText={(value) => this.setState({todaysInterestRate1: this.onChange(value)})} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'todaysInterestRate1', this.callSalesPr) }
													value={this.delimitNumbers(this.state.todaysInterestRate1)} 
												/>
											</View>
											<View style={RentVsBuyStyle.textboxunderline}>
												<View style={[RentVsBuyStyle.fullunderline, ]}></View>
											</View>
										</View>
										: false}
									</View>
									
							
									<View style={RentVsBuyStyle.loandetailhead} onLayout={(event) => this.measureView(event,'termHeight')}>
										<View style={RentVsBuyStyle.existingfirst}>
											<Text style={RentVsBuyStyle.existingheadtext}>{STRINGS.t('term')}</Text>
										</View>
										<Text style={RentVsBuyStyle.existingtext}> </Text>
										<View style={RentVsBuyStyle.existingfirstbalance}>
											<View style={{width:'100%',flexDirection:'row', marginBottom : 7}}>
												<CustomTextInput customKeyboardType="hello" 
													returnKeyType ="next" style={[RentVsBuyStyle.width70,{alignSelf:'center', marginLeft : 13}]} 
													underlineColorAndroid='transparent' 
													selectTextOnFocus={ true } 
													ref="termsOfLoansinYears"
													onKeyPress={() => this.onFocus('termsOfLoansinYears',this.state.termHeight)}
													onChangeText={(value) => this.setState({termsOfLoansinYears: this.onChange(value), termsOfLoansinYearsFixed : true})} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'termsOfLoansinYears', this.callSalesPr) }
													value={this.delimitNumbers(this.state.termsOfLoansinYears)}
												/>
											</View>
											<View style={RentVsBuyStyle.textboxunderline}>
												<View style={[RentVsBuyStyle.fullunderline, ]}></View>
											</View>
										</View>
										<Text style={RentVsBuyStyle.existingtext}> </Text>
										{(this.state.ltv2 > 0 && this.state.tab == 'CONV') ?
										<View style={RentVsBuyStyle.existingfirstbalance}>
											<View style={{width:'100%',flexDirection:'row', marginBottom : 7}}>
												<CustomTextInput customKeyboardType="hello" 
													returnKeyType ="next" 
													editable= {(this.state.ltv2 != '') ? true : false} 
													style={[RentVsBuyStyle.width70,{alignSelf:'center'}]} 
													underlineColorAndroid='transparent'  
													selectTextOnFocus={ true }
													ref="termsOfLoansinYears2"
													onKeyPress={() => this.onFocus('termsOfLoansinYears2',this.state.termHeight)}
													onChangeText={(value) => this.setState({termsOfLoansinYears2: this.onChange(value)})} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'termsOfLoansinYears2', this.callSalesPr) }
													value={this.delimitNumbers(this.state.termsOfLoansinYears2)}
												/>
											</View>
											<View style={RentVsBuyStyle.textboxunderline}>
												<View style={[RentVsBuyStyle.fullunderline, ]}></View>
											</View>
										</View>
							 	        :false}
									</View>
							
								{renderIf(this.state.tab == 'VA' || this.state.tab == 'FHA' || this.state.tab == 'CASH')(
									<View>
										<View style={[RentVsBuyStyle.fullunderline, {marginTop:10}]}></View>
										<Text style={[RentVsBuyStyle.loanstext,{textAlign:'center'}]}>{STRINGS.t('base_loan_amount')}  <Text>$ {this.delimitNumbers(this.state.base_loan_amt)}</Text></Text>
									</View>
								)}	
								{renderIf(this.state.tab == 'CONV')(	
									<View>
										<View style={[RentVsBuyStyle.fullunderline, {marginTop:10}]}></View>
										<View style={[RentVsBuyStyle.loandetailhead,{marginTop:10}]}>
											<View style={RentVsBuyStyle.existingfirst}>
												<Text style={[RentVsBuyStyle.loanstext,{marginTop:0,marginLeft:10}]}>{STRINGS.t('loan_amount')}</Text>
											</View>
											<Text style={RentVsBuyStyle.existingtextloanamnt}>$</Text>
											<View style={RentVsBuyStyle.existingfirstbalance}>
												<View style={{width:'100%',flexDirection:'row', marginBottom : 7}}>
												  	<Text style={[RentVsBuyStyle.width70,{alignSelf:'center', marginLeft : 12}]}>{this.delimitNumbers(this.state.loan_amt)}</Text>
												</View>
												<View style={RentVsBuyStyle.textboxunderline}>
													<View style={[RentVsBuyStyle.fullunderline, ]}></View>
												</View>
											</View>
											
											<Text style={RentVsBuyStyle.existingtextloanamnt}>$</Text>
											<View style={RentVsBuyStyle.existingfirstbalance}>
												<View style={{width:'100%',flexDirection:'row', marginBottom : 7, marginLeft : 10}}>
													<Text style={[RentVsBuyStyle.width70,{alignSelf:'center'}]}>{this.delimitNumbers(this.state.loan_amt2)}</Text>
												</View>
												<View style={RentVsBuyStyle.textboxunderline}>
                                                <View style={[RentVsBuyStyle.fullunderline, ]}></View>
												</View>
											</View>
										</View>
										<View style={[RentVsBuyStyle.fullunderline, {marginTop:10}]}></View>
									</View>
								)}
								{renderIf(this.state.tab == 'USDA')(
										<View style={[RentVsBuyStyle.fullunderline, {marginTop:10}]}></View>	
								)}	
								{renderIf(this.state.tab == 'USDA' || this.state.tab == 'VA' || this.state.tab == 'FHA' || this.state.tab == 'CASH')(
									<View>
										<Text style={[RentVsBuyStyle.loanstext,{textAlign:'center'}]}>{STRINGS.t('adjusted_loan_amount')}  <Text>${this.delimitNumbers(this.state.adjusted_loan_amt)}</Text></Text>
										<View style={[RentVsBuyStyle.fullunderline, {marginTop:10}]}></View>
									</View>	
								)}	

								<View style={[RentVsBuyStyle.loandetailhead,{paddingLeft:10, paddingRight:10}]} onLayout={(event) => this.measureView(event,'downPaymentHeight')}>
									<View style={RentVsBuyStyle.title_justify}>
										<Text style={RentVsBuyStyle.text_style}>{STRINGS.t('down_payment')}</Text>
									</View>
									<Text style={RentVsBuyStyle.alignCenter}>$ </Text>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={RentVsBuyStyle.alignrightinput}>
											
											<CustomTextInput customKeyboardType="hello" style={RentVsBuyStyle.width100} underlineColorAndroid='transparent' selectTextOnFocus={ true } onKeyPress={() => this.onFocus('down_payment',this.state.downPaymentHeight)} onChangeText={(value) => this.setState({down_payment: this.onChange(value)})} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'down_payment',this.downPaymentChange(event.nativeEvent.text)) } value={this.delimitNumbers(this.state.down_payment)}/>
										</View>
										<View style={[RentVsBuyStyle.fullunderline, ]}></View>
									</View>
								</View>    

								{renderIf(this.state.sumWinPropertyTaxStatus == true)(
									<View style={[RentVsBuyStyle.loandetailhead,{paddingLeft:10, paddingRight:10}]} onLayout={(event) => this.measureView(event,'summerPropTaxHeight')}>
									<View style={RentVsBuyStyle.title_justify}>
										<Text style={RentVsBuyStyle.text_style}>{this.state.summerPropertyTaxLabel}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={RentVsBuyStyle.alignrightinput}>
											<Text style={RentVsBuyStyle.alignCenter}>$ </Text>
											<CustomTextInput customKeyboardType="hello" selectTextOnFocus={ true } keyboardType="numeric" style={RentVsBuyStyle.width100} onKeyPress={() => this.onFocus('summerPropertyTax',this.state.summerPropTaxHeight)} onChangeText={(value) => this.setState({summerPropertyTax: this.onChange(value)})} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'summerPropertyTax',this.changeAnnualTax) } value={this.delimitNumbers(this.state.summerPropertyTax)} underlineColorAndroid='transparent'/>
										</View>
										<View style={[RentVsBuyStyle.fullunderline, ]}></View>
									</View>
									</View>



									)}

									{renderIf(this.state.sumWinPropertyTaxStatus == true && this.state.county == '2090')(
										<View style={[RentVsBuyStyle.loandetailhead,{paddingLeft:10, paddingRight:10}]} onLayout={(event) => this.measureView(event,'summerPropTaxHeight')}>
										<View style={RentVsBuyStyle.title_justify}>
											<Text style={{color:"#FD002B",fontFamily:'roboto-regular',fontSize:12}}>only one box can be used </Text>
										</View>
										<View style={{width:'30%',justifyContent:'center'}}>
											<View style={RentVsBuyStyle.alignrightinput}>
												<Text style={RentVsBuyStyle.alignCenter}>OR</Text>
											</View>
										</View>
										</View>
									)}
									{renderIf(this.state.sumWinPropertyTaxStatus == true) (
									<View style={[RentVsBuyStyle.loandetailhead,{paddingLeft:10, paddingRight:10}]} onLayout={(event) => this.measureView(event,'winterPropTaxHeight')}>
									<View style={RentVsBuyStyle.title_justify}>
										<Text style={RentVsBuyStyle.text_style}>{this.state.winterPropertyTaxLabel}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={RentVsBuyStyle.alignrightinput}>
											<Text style={RentVsBuyStyle.alignCenter}>$ </Text>
											<CustomTextInput customKeyboardType="hello" selectTextOnFocus={ true } keyboardType="numeric" style={RentVsBuyStyle.width100} onKeyPress={() => this.onFocus('winterPropertyTax',this.state.winterPropTaxHeight)} onChangeText={(value) => this.setState({winterPropertyTax: this.onChange(value)})} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'winterPropertyTax',this.changeAnnualTax) } value={this.delimitNumbers(this.state.winterPropertyTax)} underlineColorAndroid='transparent'/>
										</View>
										<View style={[RentVsBuyStyle.fullunderline, ]}></View>
									</View>
									</View>
								)}		



								<View style={[RentVsBuyStyle.loandetailhead,{paddingLeft:10, paddingRight:10}]} onLayout={(event) => this.measureView(event,'annualPropTaxHeight')}>
									<View style={RentVsBuyStyle.title_justify}>
										<Text style={RentVsBuyStyle.text_style}>{STRINGS.t('annual_prop_tax')}</Text>
									</View>
									<Text style={RentVsBuyStyle.alignCenter}>% </Text>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={RentVsBuyStyle.alignrightinput}>
											
											<CustomTextInput customKeyboardType="hello" selectTextOnFocus={ true } onKeyPress={() => this.onFocus('annualPropertyTax',this.state.annualPropTaxHeight)} onChangeText={(value) => this.setState({annualPropertyTax: this.onChange(value)})} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'annualPropertyTax',this.changeAnnualTax) } value={this.delimitNumbers(this.state.annualPropertyTax)} style={RentVsBuyStyle.width100} underlineColorAndroid='transparent'/>
										</View>
										<View style={[RentVsBuyStyle.fullunderline, ]}></View>
									</View>
								</View> 

							{/*	
								{renderIf(this.state.prorationPercentShowStatus == true)(
								<View style={[RentVsBuyStyle.loandetailhead,{paddingLeft:10, paddingRight:10}]}>
									<View style={RentVsBuyStyle.title_justify}>
										<Text style={RentVsBuyStyle.text_style}>{STRINGS.t('Proration_Percent')}</Text>
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
							<View style={[RentVsBuyStyle.loandetailhead,{paddingLeft:10, paddingRight:10}]}>
								<View style={RentVsBuyStyle.title_justify}>
									<Text style={RentVsBuyStyle.text_style}>{STRINGS.t('Use_For_Prepaid')}</Text>
								</View>
								<View style={{width:'30%',justifyContent:'flex-end', marginLeft : 34}}>
									<View style={{width: '100%',justifyContent: 'flex-end',flexDirection: 'row',alignSelf: 'flex-end'}}>
										<CheckBox right={true} uncheckedColor="#3b90c4" containerStyle={{ backgroundColor:'#ffffff', borderWidth:0}} center checkedColor='#3b90c4' checked={this.state.isCheckForFlorida} 
										onPress={this.handlePressCheckedBoxForFlorida}
										
										/>
									</View>
									
								</View>
							</View>
							)}

							*/}		

                                <View style={[RentVsBuyStyle.loandetailhead,{paddingLeft:10, paddingRight:10}]} onLayout={(event) => this.measureView(event,'paymentAmount1Height')}>
									<View style={RentVsBuyStyle.title_justify}>
										<Text style={RentVsBuyStyle.text_style}>{STRINGS.t('RentVsBuy_Monthly_HOA_Fees')}</Text>
									</View>
									<Text style={RentVsBuyStyle.alignCenter}>$ </Text>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={RentVsBuyStyle.alignrightinput}>
											<CustomTextInput customKeyboardType="hello" style={[RentVsBuyStyle.width100]} underlineColorAndroid='transparent' selectTextOnFocus={ true } onKeyPress={() => this.onFocus('paymentAmount1', this.state.paymentAmount1Height)} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'paymentAmount1',this.calTotalMonthlyPayment) } onChangeText={(value) => this.setState({paymentAmount1: this.onChange(value)})} value={this.delimitNumbers(this.state.paymentAmount1)}/>
										</View>
										<View style={[RentVsBuyStyle.fullunderline, ]}></View>
									</View>
								</View> 
						
								<View style={[RentVsBuyStyle.loandetailhead,{paddingLeft:10, paddingRight:10, marginBottom:20}]} onLayout={(event) => this.measureView(event,'income_tax_rate_height')}>
									<View style={RentVsBuyStyle.title_justify}>
										<Text style={RentVsBuyStyle.text_style}>{STRINGS.t('RentVsBuy_Income_Tax')}</Text>
									</View>
									<Text style={RentVsBuyStyle.alignCenter}>% </Text>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={RentVsBuyStyle.alignrightinput}>
											
											{this.state.income_tax_rate_status == true ? 

											<CustomTextInput customKeyboardType="hello" style={RentVsBuyStyle.width100} underlineColorAndroid='transparent' selectTextOnFocus={ true } onKeyPress={() => this.onFocus('income_tax_rate', this.state.income_tax_rate_height)} onChangeText={(value) => this.setState({income_tax_rate: this.onChange(value)})} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'income_tax_rate',  this.callSellerCostSettingApi()) } value={this.delimitNumbers(this.state.income_tax_rate)}/>
											:		
											<CustomTextInput customKeyboardType="hello" style={RentVsBuyStyle.width100} underlineColorAndroid='transparent' selectTextOnFocus={ true } onKeyPress={() => this.onFocus('income_tax_rate', this.state.income_tax_rate_height)} onChangeText={(value) => this.setState({income_tax_rate: this.onChange(value)})} onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'income_tax_rate') } value={this.delimitNumbers(this.state.income_tax_rate)}/>

											}	

										</View>
										<View style={[RentVsBuyStyle.fullunderline, ]}></View>
									</View>
								</View>
                                    {this.renderCancel()}      
									<View style={[RentVsBuyStyle.loandetailheadadvanced,{paddingLeft:10, paddingRight:10, marginBottom:this.state.focusElementMargin}]}>
									<TouchableOpacity 
										onPress={this.toggleCancel.bind(this)}>
										<View>
											<Text style={{textShadowColor : 'transparent', textDecorationLine : 'underline',fontWeight:'bold'}}>{this.state.toggleButton}</Text>
										</View>
									</TouchableOpacity>
                                </View> 
							</ScrollView>
						</View>
					</View>	
                )}
                
			<View style={RentVsBuyStyle.lineView}></View>
			</View>
			<DropdownAlert ref={(ref) => this.dropdown = ref}/>
                		<View style={RentVsBuyStyle.iphonexFooter}></View>
		</View>
		} else if(this.state.GooglePlaceAutoCompleteShow == true) {
			showable=<View style={styles.container}>
			<GooglePlacesAutocomplete
				placeholder='Search'
				minLength={2} 
				autoFocus={false}
				listViewDisplayed='auto' 
				fetchDetails={true}
				styles={{
					predefinedPlacesDescription: {
						color: '#ffffff'
					  }
				}}
				renderDescription={row => row.description || row.vicinity} 
				onPress={(data, details = null) => { 
					this.setState({
						lender_address : data.structured_formatting.main_text
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
						GooglePlaceAutoCompleteShow : false
					});
				}}
				query={{
					key: GLOBAL.GOOGLE_PLACE_API_KEY,
					language: 'en',
					types: 'address',
				}}
				
				currentLocation={true}
			/>
			</View>
		} else if(this.state.showChart == true) {
			showable=<View style={RentVsBuyStyle.TopContainer}>
			<View style={RentVsBuyStyle.iphonexHeader}></View>
			<View style={RentVsBuyStyle.outerContainer}>
            	<View style={RentVsBuyStyle.ChartHeaderContainer}>
                    <Image style={RentVsBuyStyle.HeaderBackground} source={Images.header_background}></Image>
                    <TouchableOpacity style={{width:'20%'}} onPress={this.onBackRentVsBuyPress.bind(this)}>
                        <Image style={RentVsBuyStyle.back_icon} source={Images.back_icon}/>
                    </TouchableOpacity>
                    <Text style={RentVsBuyStyle.header_title}>{STRINGS.t('RentVsBuy')}</Text>
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
                 <View style={{marginTop : 0, paddingTop : 20, paddingLeft : 10}}>  
                    <MulipleLineChart ref= 'linechart' data={this.state.show_chart_array} axisLineWidth={1} leftAxisData={this.state.leftAxisData} bottomAxisData= {bottomAxisData} legendColor={legendColor} RentvsBuyColor={RentvsBuyColor}
                        legendText={legendText} RentvsBuyText={this.state.RentvsBuyText}
                        strokeWidth='3' minX={minX} maxX={maxX} minY={this.state.minY} maxY={this.state.maxY} scatterPlotEnable={false}   Color= {Color}  axisColor='#CCCCCC' axisLabelColor='#000' lineWidth={2} hideAxis={false} dataPointsVisible={true} hideXAxisLabels={false} hideYAxisLabels={false} showLegends={true} tickColorXAxis='#CCCCCC' tickWidthXAxis='1' tickColorYAxis='#CCCCCC' tickWidthYAxis='1' circleRadiusWidth='2.5' circleRadius={3} showTicks={true} stroke='#CCCCCC' bottomAxisDataToShow={bottomAxisData} leftAxisDataToShow={this.state.leftAxisData} pointDataToShowOnGraph='' circleLegendType={true} fillArea={false} yAxisGrid={true} xAxisGrid={true} inclindTick={false}/>
                
                </View>
            </View>
            <View style={RentVsBuyStyle.iphonexFooter}></View>
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
									<TextInput selectTextOnFocus={ true } underlineColorAndroid='transparent' style={{width: '100%'}} keyboardType="email-address" onChangeText={(value) => this.setState({to_email: value, to_email_default : value})} value={this.state.to_email.toString()}/>
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
			</Modal>

			<PopupDialog dialogTitle={<View style={SellerStyle.dialogtitle}><Text style={SellerStyle.dialogtitletext}>Please select print format</Text></View>} dialogStyle={{width:'80%'}}  containerStyle={{elevation:10}} ref={(popupDialog) => { this.popupDialog = popupDialog; }}>	
			{renderIf(this.state.popupType == 'print')(
				<View>
					<TouchableOpacity onPress={() => {this.printPDF()}}>
						<View style={SellerStyle.dialogbtn}>
							<Text style={SellerStyle.text_style}>
								PRINT
							</Text>
						</View>	
					</TouchableOpacity>    
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
					<TouchableOpacity style={SellerStyle.buttonContainer} onPress={ () => {this.popupDialog.dismiss()}}>
						<Text style={SellerStyle.style_btnLogin}> {STRINGS.t('Cancel')}</Text>
					</TouchableOpacity>	
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
            </View>   
		}

        return(
			<View style={{flex:1}}>
				{showable}
			</View>	
        );
    }
}

