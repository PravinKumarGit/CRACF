import React, { Component } from 'react';
import {Container, Left, Right, Icon, Title, Body, Button}  from 'native-base';
import Images from '../Themes/Images.js';
import Styles from './Styles/SellerStyleDesign';
import { CheckBox } from 'react-native-elements';
import CustomStyle from './Styles/CustomStyle';
import BuyerStyle from './Styles/NetFirstStyle';
import SellerStyle from './Styles/SellerStyle';
import CameraStyle from './Styles/CameraStyle';
import renderIf from 'render-if';
import {callGetApi, callPostApi} from '../Services/webApiHandler.js' // Import 
import STRINGS from '../GlobalString/StringData'  // Import StringData.js class for string localization.
import Picker from 'react-native-picker';
import DatePicker from 'react-native-datepicker';
import DropdownAlert from 'react-native-dropdownalert';
import PopupDialog from 'react-native-popup-dialog';
import {validateEmail} from '../Services/CommonValidation.js';
import PopupDialogEmail from 'react-native-popup-dialog';
import OpenFile from 'react-native-doc-viewer';
import SelectMultiple from 'react-native-select-multiple';
import ImagePicker from 'react-native-image-crop-picker';
import Camera from 'react-native-camera';
import Spinner from 'react-native-loading-spinner-overlay';
import ModalDropdown from 'react-native-modal-dropdown';
import { Dropdown } from 'react-native-material-dropdown';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
//import { ThemeProvider, Toolbar, COLOR } from 'react-native-material-ui';
import { insertText, CustomTextInput } from 'react-native-custom-keyboard';
import {getUptoTwoDecimalPoint} from '../Services/app_common_func.js';
import {getNetfirstAmountFHA, getNetfirstCostTypeTotal, getNetfirstTotalCostRate, getNetfirstListSellAgt,getNetfirstListSellAgtValues,getNetfirstExistingBalanceCalculation, getNetfirstDiscountAmount, getNetfirstEstimatedTax, getNetfirstSumSSC, getNetfirstListSellAgtPer, getSellerAmountCONV, getSellerAmountVA, getSellerAmountFHA, getSellerAmountUSDA, StrToUpper, StrInArray, getTransferTax} from '../Services/netfirst_calculator.js'
import {Image, View, ToolbarAndroid, Modal, ActivityIndicator, ListView, Dimensions, Alert, Text, TextInput, findNodeHandle, TouchableOpacity, KeyboardAvoidingView, ScrollView, AsyncStorage, StyleSheet, Keyboard, BackHandler, Platform} from 'react-native';
const  {width, height} = Dimensions.get('window')
var Header = require('./Header');
var nativeImageSource = require('nativeImageSource');
var GLOBAL = require('../Constants/global');
import Device from '../Constants/Device';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const data = [ { value: 'Upgrade' }, { value: 'Settings' }, { value: 'About' }, { value: 'Sign out' }];
import {authenticateUser} from '../Services/CommonValidation.js'  // Import CommonValidation class to access common methods for validations.
 
export default class NetFirstCalculator extends Component{
    constructor() {
        super();
        //Estimated date
        var now = new Date();
        now.setDate(now.getDate() + 30);
		var date = (now.getMonth() + 1) + '-' + now.getDate() + '-' + now.getFullYear();
        var monthNames = [ "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec" ]; 
        var calcList = {};
        // For showing list of netfirst's calculator in popup onload so that error will not occur
        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
          });
		this.changeFooterTab = this.changeFooterTab.bind(this);
		this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        calcList['calculatorName'] = 'calculatorName';
        
        this.state = {
			orientation: Device.isPortrait() ? 'portrait' : 'landscape',
			devicetype: Device.isTablet() ? 'tablet' : 'phone',
			initialOrientation: '',
            isChecked: true,    
            isCheckedUSDA: true,
            isCheckedVA: true,
            tab: 'CONV',
            footer_tab:'seller',
            todaysInterestRate:'',
            totalAllCost : '0.00',
            termsOfLoansinYears:'',
            termsOfLoansinYears2:'',
            date:date,
            ltv: '90',
            ltv2: '',
			down_payment: '',
			calculatorId : '',
            loan_amt: '',
            loan_amt2: '',
			sale_pr: '0.00',
			focusCustomKey : false,
            sale_pr_calc: '',
            visble: false,
			seller_must_net : '0.00',
			initial_seller_must_net : '0.00',
			seller_must_net_empty : '',
            preparedFor : 'New Client',
			taxservicecontract: '0.00',
			maintainAmnt : '0.00',
            underwriting: '0.00',
			scrollvalue : false,
			verified_email : '',
            processingfee: '0.00',
            appraisalfee: '0.00',
            creditReport: '',
            correctivework : '0.00',
			buyersfee : '0.00',
			buyers_fee_text : "Buyer's Fees",
            ownerFee: '0.00',
            escrowFee: '0.00',
            lenderFee: '0.00',
            escrowFeeOrg: '0.00',
            lenderFeeOrg: '0.00',
            ownerFeeOrg: '0.00',
            escrowFeeBuyer : '0.00',
            escrowFeeSeller : '0.00',
			documentprep: '0.00',
			default_address : '',
			content : '',
			taxservicecontractFixed : false,
			underwritingFixed : false,
			processingfeeFixed : false,
			appraisalfeeFixed : false,
			documentprepFixed : false,
			originationfactorFixed : false,
			ownerTypeFixed : false,
			escrowTypeFixed : false,
			lenderTypeFixed : false,
			sellerMustNetFixed : false,
			newEmailAddressError : '',
            disc: '0.00',
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
            label10: '',
            modalVisible : false,
            emailModalVisible: false,
            modalAddressesVisible: false,
			videoModalVisible: false,
			GooglePlaceAutoCompleteShow : false,
			enterAddressBar : false,
			imageData: '',
			imageNameEmail: '',
			videoNameEmail: '',
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
            SCC_Brokage_Fee : '',
            monName: monthNames[(now.getMonth())],
            toolbarActions: [{ value: 'SAVE' }, { value :'OPEN' }, { value : 'PRINT' } , { value : 'EMAIL' }],
            modalDropDownAtions : ['Split','Buyer','Seller'],
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
            FhaMipFin: '',
            FhaMipFin1: '',
            FhaMipFin2: '',
            FhaMipFin3: '',
            UsdaMipFinance: '',
            UsdaMipFinance1: '',
            UsdaMipFinance2: '',
			UsdaMipFinance3: '',
			invalidEmailStatus : false,
            VaFfFin: '',
            VaFfFin1: '',
            VaFfFin2: '',
            VaFfFin3: '',
			monthlyRate:'',
			emailType : '',
            monthPmiVal:'',
            rateValue:'',
            principalRate:'',
            realEstateTaxesRes: '',
            homeOwnerInsuranceRes: '',
            netFirstFooterTab: true,    
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
            prepaymentPenality : '0.00',
            pestControlReport: '0.00',
            estimatedTaxProrations: '0.00',
            benifDemandStatement: '0.00',
			reconveynceFee: '0.00',
			deviceName : "",
            proration : '',
            content : '',
            loansToBePaid_1Balance: '0.00',
            loansToBePaid_1Rate: '0.00',
            loansToBePaid_2Balance: '0.00',
            loansToBePaid_2Rate: '0.00',
            loansToBePaid_3Balance: '0.00',
			loansToBePaid_3Rate: '0.00',
			contact_number : '',
			newEmailAddress : '',
            existingTotal: '0.00',
            days_interest: '',
            brokerageFee : '0.00',
            brokerageFeePer : '0.00',
            sellerWantTotal : '0.00',
            conventionalLoan: '80.00',
			otherCostsDiscount2: '0.00',
			newEmailContactName : '',
            settlementDate: now.getDate(),
            settlementMonth: now.getMonth(),
            camera: {
                aspect: Camera.constants.Aspect.fill,
                captureTarget: Camera.constants.CaptureTarget.cameraRoll,
                captureMode: Camera.constants.CaptureMode.video,
                type: Camera.constants.Type.back,
                orientation: Camera.constants.Orientation.auto,
                flashMode: Camera.constants.FlashMode.auto,
            },
            isRecording: false,
            videoData: '',
            isAddrsChecked: false,
            dataSource: ds.cloneWithRows(calcList),
			dataSourceOrg: ds.cloneWithRows(calcList),
			dataSourceEmpty: ds.cloneWithRows(calcList),
			emptCheck: false,
        }
            this.renderRow = this.renderRow.bind(this);

			Dimensions.addEventListener('change', () => {
				this.setState({
					orientation: Device.isPortrait() ? 'portrait' : 'landscape',
				});
			});
    }
    
    // call function when page loads. It will gives us user's details
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
		if(response == '1'){
			this.props.navigator.push({name: 'Login', index: 0 });
		}else{
			AsyncStorage.getItem("userDetail").then((value) => {
					newstr = value.replace(/\\/g, "");
					var newstr = JSON.parse(newstr);
					newstr.user_name = newstr.first_name + " " + newstr.last_name;
					this.setState(newstr,this.componentApiCalls);
					this.setState({animating:'true'});
					var subj = 'Closing Costs from '+newstr.user_name+'  at '+newstr.email+'';
					this.setState({
						email_subject : subj,
						state_code : newstr.state_code 
					});
			}).done();		
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
		return true;
	}
    
    componentApiCalls() {
        this.callGLOBALsettinsapi();
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

    // Function for fetching and setting values of closing cost tab under USDA page
    callGLOBALsettinsapi() {
		callGetApi(GLOBAL.BASE_URL + GLOBAL.national_global_setting, {
		}, this.state.access_token)
            .then((response) => {
            this.setState({
                FHA_SalePriceUnder:      result.data.nation_setting.FHA_SalePriceUnder,
                FHA_SalePriceUnderLTV:   result.data.nation_setting.FHA_SalePriceUnderLTV,
                FHA_SalePriceTo:          result.data.nation_setting.FHA_SalePriceTo,
                FHA_SalePriceToLTV:      result.data.nation_setting.FHA_SalePriceToLTV,
                FHA_SalePriceOver:           result.data.nation_setting.FHA_SalePriceOver,
				FHA_SalePriceOverLTV:      result.data.nation_setting.FHA_SalePriceOverLTV,
				VA_FundingFee:          result.data.nation_setting.VA_FundingFee,
				FHA_PercentOne:      result.data.nation_setting.FHA_PercentOne,
				USDA_MIPFactor:      result.data.nation_setting.USDA_MIPFactor, 
            },this.callNetFirstCostSettingApi(0));
        });
	}
	

		// function call when change zip code

	updatePostalCode (fieldVal, fieldName) {
		if(this.state.defaultVal != fieldVal){
			//if(this.state.seller_must_net != '' && this.state.seller_must_net != '0.00') {

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
							'brokeragePer'        : this.state.brokerageFeePer,
							'salePrice'        : this.state.sale_pr,
						}
						let responseAgt        = getNetfirstListSellAgtValues(requestAgt);

						if(this.state.sale_pr <= this.state.FHA_SalePriceUnder){
							LTV = this.state.FHA_SalePriceUnderLTV;            
						} else if (this.state.sale_pr > this.state.FHA_SalePriceUnder && this.state.sale_pr <= this.state.FHA_SalePriceTo){
							LTV = this.state.FHA_SalePriceToLTV;            
						} else if (this.state.sale_pr > this.state.FHA_SalePriceOver){
							LTV = this.state.FHA_SalePriceOverLTV;
						}


				
						this.setState({sale_pr: this.state.sale_pr,brokerageFee : responseAgt.brokerageFee, LTV: LTV});

						if(zipRes.data.state_name != null || zipRes.data.state_name != 'NULL') {

							// commented by lovedeep on 09-03-2018 as it is not required
							/*sellerTotal    = parseInt(this.state.seller_must_net) + parseInt(this.state.existingTotal);
							this.state.sellerWantTotal = sellerTotal;
							this.state.sale_pr = (this.state.sellerWantTotal * 1.08).toFixed(2);*/

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
								if(this.state.sale_pr != '' && this.state.sale_pr != '0.00') {
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
									},this.callNetFirstCostSettingApi(1));
								} else {
									this.setState({
										[fieldName]: processedData,
										city: zipRes.data.city,
										state: zipRes.data.state_id,
										user_state: zipRes.data.state_code,
										user_county: zipRes.data.county_name,
										county: zipRes.data.county_id,
										ownerType: this.state.ownerType,
										escrowType: this.state.escrowType,
										lenderType: this.state.lenderType,
									},this.callNetFirstCostSettingApi(1));
								}

								let requestTransferTax          = { 'transferTaxRate' : this.state.transferTaxPer,'salesprice' : this.state.sale_pr, 'state': zipRes.data.state_code, 'countyId': zipRes.data.county_id };
								let responseTransferTax         = getTransferTax(requestTransferTax);
								//alert(JSON.stringify(responseTransferTax));
								this.state.transferTax = responseTransferTax.transferTax;
						
								// code commented by lovedeep on 09-03-2018 as per discussion with atul sir as trnasfer tax value not matched with live
								/*this.state.transferTax   = this.state.transferTaxPer * this.state.sale_pr / 1000;
								this.state.transferTax = this.state.transferTax.toFixed(2);*/
							});
						}
					}	
				}); 

			//}	
		}		
	}

    
    // Function for fetching and setting values of Net First
    callNetFirstCostSettingApi(flag) {
		if(flag == 0) {
			callfunc = this.callgetEcrowTitleType;
		} else {
			callfunc = this.calTotalClosingCost;
		}	

        callPostApi(GLOBAL.BASE_URL + GLOBAL.NetFirst_Cost_Setting, {
        user_id: this.state.user_id,company_id: this.state.company_id, zip: this.state.postal_code
        }, this.state.access_token)
        .then((response) => {
            var i=1;
            // For setting last fields of closing costs page
			for (let resObj of result.data.userSettingCost) {
				const update = {};
				req         = {'amount': this.state.amount,'salePrice': this.state.sale_pr,'type': resObj.type,'rate':resObj.fee};
				
				var data = getNetfirstCostTypeTotal(req);
				feeval = data.totalCostRate;
				update['label' + i] = resObj.label;
				update['fee' + i] = feeval;
				update['type' + i] = resObj.type;
				update['totalfee' + i] = resObj.fee;
				this.setState(update);
				i++;
			}
			
            SCC_Brokage_Fee                 = result.data.userSetting.brokerageFeeofSalePrice;
            this.setState({
                brokerageFeePer : SCC_Brokage_Fee
            });
            
            // requesting agrigate list and sell values
            let requestAgt        = {
                'brokeragePer'        : this.state.brokerageFeePer,
                'salePrice'        : this.state.sale_pr,
            }
        
            let responseAgt        = getNetfirstListSellAgtValues(requestAgt);
            
            this.setState({
                brokerageFee : responseAgt.brokerageFee
			});
			        
            this.setState({
                totalCost: result.data.totalCost,
                reconveynceFee: result.data.userSetting.reconveynceFee,
                drawingDeed: result.data.userSetting.drawingDeed,
                notary: result.data.userSetting.notary,
                transferTaxPer: result.data.userSetting.transferTax,
                pestControlReport: result.data.userSetting.pestControlReport,
                benifDemandStatement: result.data.userSetting.benifDemandStatement,
                brokerageFeeofSalePrice: result.data.userSetting.brokerageFeeofSalePrice,
			},callfunc);
			//alert("drawingdeed " + result.data.userSetting.drawingDeed + "reconveynceFee " + result.data.userSetting.reconveynceFee + "pestControlReport " + result.data.userSetting.pestControlReport + "notary " + result.data.userSetting.notary);
        });
    }
    
    
    // this function is used to get default types of escrow, owner and lender (the value which is shown in dropdown under closing cost section)
    callgetEcrowTitleType() {
        callPostApi(GLOBAL.BASE_URL + GLOBAL.netfirst_escrow_type, {
        "companyId" : this.state.company_id
        }, this.state.access_token)
        .then((response) => {
            this.setState({
                escrowType: result.data.escrowType,
                ownerType: result.data.ownerType,
                lenderType : 'Buyer',
            },this.callConvSettingData);
        });    
    }
    
    // this function callConvSettingData is used to fetch other cost setting values which w are using under other costs section.
    callConvSettingData() {
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
				user_id: this.state.user_id,company_id: this.state.company_id, zip: this.state.postal_code, loan_type: "CONV",calc_type: "Seller", zip: this.state.postal_code
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
    callFHAsettinsapi() {
        if(this.state.sale_pr != "" && this.state.sale_pr != '0.00') {

			let LTV;
			let MIP;
			if(newText <= this.state.FHA_SalePriceUnder){
				LTV = this.state.FHA_SalePriceUnderLTV;			
			} else if (newText > this.state.FHA_SalePriceUnder && newText <= this.state.FHA_SalePriceTo){
				LTV = this.state.FHA_SalePriceToLTV;			
			} else if (newText > this.state.FHA_SalePriceOver){
				LTV = this.state.FHA_SalePriceOverLTV;
			}

			MIP             = this.state.FHA_PercentOne;			

			request 		= {'salePrice': this.state.sale_pr,'LTV': LTV, 'MIP': MIP};
			response 		= getSellerAmountFHA(request);

			this.setState({amount: response.amount, adjustedamount: response.adjusted});
		
        	callPostApi(GLOBAL.BASE_URL + GLOBAL.fha_va_usda_setting_api, {
				user_id: this.state.user_id,company_id: this.state.company_id, zip: this.state.postal_code, loan_type: "FHA",calc_type: "Seller"
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
    callVAsettinsapi() {
        if(this.state.sale_pr != "" && this.state.sale_pr != '0.00') {
			request 		= {'salePrice': this.state.sale_pr,'LTV': this.state.VA_FundingFee};
			response 		= getSellerAmountVA(request);

			this.setState({amount: response.amount, adjustedamount: response.adjusted});
			callPostApi(GLOBAL.BASE_URL + GLOBAL.fha_va_usda_setting_api, {
				user_id: this.state.user_id,company_id: this.state.company_id, zip: this.state.postal_code, loan_type: "VA",calc_type: "Seller"
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
    callUSDAsettinsapi() {
        if(this.state.sale_pr != "" && this.state.sale_pr != '0.00') {

			request 		= {'salePrice': this.state.sale_pr,'MIP': this.state.USDA_MIPFactor};
			response 		= getSellerAmountUSDA(request);

			this.setState({amount: '0.00', adjustedamount: response.adjusted});
			
			
			callPostApi(GLOBAL.BASE_URL + GLOBAL.fha_va_usda_setting_api, {
				user_id: this.state.user_id,company_id: this.state.company_id, zip: this.state.postal_code, loan_type: "USDA",calc_type: "Seller"
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
		date = this.state.date;
		var split = date.split('-');
		date = Number(split[0])+'/'+Number(split[1])+'/'+Number(split[2]);
		
		if(this.state.adjustedamount == '0.00') {
			adjustedamount	= this.state.amount;
		} else {
			adjustedamount	= this.state.adjustedamount;
		}

        callPostApi(GLOBAL.BASE_URL + GLOBAL.seller_escrow_xml_data, {
        "city": this.state.city,"county_name": this.state.user_county,"salePrice": this.state.sale_pr,"adjusted": adjustedamount,"state": this.state.state,"county": this.state.county, "loanType": this.state.tab, zip: this.state.postal_code, "estStlmtDate": date, 'userId':this.state.user_id,'device':this.state.deviceName, "calc":"seller"
        }, this.state.access_token)
        .then((response) => {

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
				} else {
						this.setState({
							buyers_fee_text : "Buyer's Fee",
							buyersfee : '0.00'
						}, this.calEscrowData);	
				}
		});		
        });
    }
    
    // call when you have to add lender fee, escrow fee and owner aftr setting their values
    calEscrowData() {
        this.state.escrowTotal = parseFloat(this.state.lenderFee) + parseFloat(this.state.ownerFee) + parseFloat(this.state.escrowFee);
		let request = {'discountPerc': this.state.disc,'amount': this.state.amount};
		

		console.log("request of disc on calescrowdata in netfirst " + JSON.stringify(request) + "sale pr " + this.state.sale_pr);


		let response = getNetfirstDiscountAmount(request);
		
		console.log("response of calescrowdt " + JSON.stringify(response));

		this.state.otherCostsDiscount2 = response.discount;

		console.log("otherCostsDiscount2 " + this.state.otherCostsDiscount2);		

        this.setState({escrowTotal: this.state.escrowTotal} ,this.onOwnerChange("escrow"));
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
			this.state.selectedOwnerTypeId = defval;
			this.state.ownerType			= this.state.selectedOwnerTypeId;
			this.setState({
				ownerTypeFixed : true
			});
        }
          
        if(this.state.selectedOwnerTypeId == 'Split'){
            this.state.ownerFee   = this.state.ownerFeeOrg/2;
			this.onEscrowChange("escrow");
    
        } else if(this.state.selectedOwnerTypeId == 'Buyer'){
            this.state.ownerFee   = '0.00';
			this.onEscrowChange("escrow");
        
        } else if(this.state.selectedOwnerTypeId == 'Seller'){
            this.state.ownerFee   = this.state.ownerFeeOrg;
          	this.onEscrowChange("escrow");
		}
		

		console.log("ownerFee " + this.state.ownerFee);
	}
	
	// not in use
	/*totalCostDataUpdateFieldsescrow() {
		if(this.state.originationFee == '') {
			originationFee = 0.00;
		} else {
			originationFee = this.state.originationFee;
		}
	
		totalCostData =  parseFloat(this.state.drawingDeed) + parseFloat(this.state.notary) + parseFloat(this.state.transferTax) + parseFloat(this.state.pestControlReport) + parseFloat(this.state.benifDemandStatement) + parseFloat(this.state.reconveynceFee) + parseFloat(this.state.brokerageFee) + parseFloat(this.state.daysInterest) + parseFloat(this.state.prepaymentPenality) + parseFloat(this.state.fee1) + parseFloat(this.state.fee2) + parseFloat(this.state.fee3) + parseFloat(this.state.fee4) + parseFloat(this.state.fee5) + parseFloat(this.state.fee6) + parseFloat(this.state.fee7) + parseFloat(this.state.fee8) + parseFloat(this.state.fee9) + parseFloat(this.state.fee10) + parseFloat(this.state.escrowFee) + parseFloat(this.state.ownerFee) + parseFloat(this.state.lenderFee);

		this.setState({totalClosingCost: totalCostData});
		rsp = getUptoTwoDecimalPoint(this.state.totalClosingCost);
		this.state.totalClosingCost = rsp.val;
		
		
		totalOtherCost = parseFloat(this.state.otherCostsDiscount2) + parseFloat(this.state.processingfee) + parseFloat(this.state.taxservicecontract) + parseFloat(this.state.documentprep) + parseFloat(this.state.underwriting) + parseFloat(this.state.appraisalfee) + parseFloat(this.state.correctivework) + parseFloat(this.state.buyersfee);
		
		this.setState({totalOtherCost: totalOtherCost});
		res = getUptoTwoDecimalPoint(this.state.totalOtherCost);
		this.state.totalOtherCost = res.val;
		this.state.totalAllCost = parseFloat(totalCostData) + parseFloat(totalOtherCost);
		resp = getUptoTwoDecimalPoint(this.state.totalAllCost);
		ttlAllCst = resp.val;
		
		this.setState({totalAllCost : ttlAllCst}, this.onEscrowChange("escrow"));
	}*/
 
    // this function is called when you change value from dropdown in case of Escr. or Settle.    
    onEscrowChange(defval) {
        if(defval == 'escrow'){
            this.state.selectedEscrowTypeId   = this.state.escrowType;
        } else {
			this.state.selectedEscrowTypeId   = defval;
			this.state.escrowType			= this.state.selectedEscrowTypeId;
			this.setState({
				escrowTypeFixed : true
			});
        }   
        
        if(this.state.selectedEscrowTypeId == 'Split') {
            if(this.state.escrowFeeBuyer == '0.0') {
                this.state.escrowFee  = this.state.escrowFeeSeller/2;
            } else if(this.state.escrowFeeSeller == '0.0') {
                this.state.escrowFee  = this.state.escrowFeeBuyer/2;
            } else {
                this.state.escrowFee  = this.state.escrowFeeBuyer;
            }
            this.onLenderChange("escrow");	
            
        } else if(this.state.selectedEscrowTypeId == 'Buyer') {
            this.state.escrowFee  = '0.00';
            this.onLenderChange("escrow");	
        } else if(this.state.selectedEscrowTypeId == 'Seller') {
            this.state.escrowFee  = this.state.escrowFeeOrg;
			this.onLenderChange("escrow");		
		}
		
		console.log("escrowFee " + this.state.escrowFee);

	}
	
	// not in use
	/*totalCostDataUpdateFieldslender() {
		if(this.state.originationFee == '') {
			originationFee = 0.00;
		} else {
			originationFee = this.state.originationFee;
		}
	
		totalCostData =  parseFloat(this.state.drawingDeed) + parseFloat(this.state.notary) + parseFloat(this.state.transferTax) + parseFloat(this.state.pestControlReport) + parseFloat(this.state.benifDemandStatement) + parseFloat(this.state.reconveynceFee) + parseFloat(this.state.brokerageFee) + parseFloat(this.state.daysInterest) + parseFloat(this.state.prepaymentPenality) + parseFloat(this.state.fee1) + parseFloat(this.state.fee2) + parseFloat(this.state.fee3) + parseFloat(this.state.fee4) + parseFloat(this.state.fee5) + parseFloat(this.state.fee6) + parseFloat(this.state.fee7) + parseFloat(this.state.fee8) + parseFloat(this.state.fee9) + parseFloat(this.state.fee10) + parseFloat(this.state.escrowFee) + parseFloat(this.state.ownerFee) + parseFloat(this.state.lenderFee);

		this.setState({totalClosingCost: totalCostData});
		rsp = getUptoTwoDecimalPoint(this.state.totalClosingCost);
		this.state.totalClosingCost = rsp.val;
		
		
		totalOtherCost = parseFloat(this.state.otherCostsDiscount2) + parseFloat(this.state.processingfee) + parseFloat(this.state.taxservicecontract) + parseFloat(this.state.documentprep) + parseFloat(this.state.underwriting) + parseFloat(this.state.appraisalfee) + parseFloat(this.state.correctivework) + parseFloat(this.state.buyersfee);
		
		this.setState({totalOtherCost: totalOtherCost});
		res = getUptoTwoDecimalPoint(this.state.totalOtherCost);
		this.state.totalOtherCost = res.val;
		this.state.totalAllCost = parseFloat(totalCostData) + parseFloat(totalOtherCost);
		resp = getUptoTwoDecimalPoint(this.state.totalAllCost);
		ttlAllCst = resp.val;
		this.setState({totalAllCost : ttlAllCst}, this.onLenderChange("escrow"));
	}*/
    
    // this function is called when you change value from dropdown in case of Lender.
	onLenderChange(defval) {   
        if(defval == 'escrow'){
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
		

		console.log("lenderFee " + this.state.lenderFee);

    }  
 
    // In this function, we are calculating total closing cost (shown under closing cost section) , total other cost (shown under other cost section), total all cost (shown at bottom under seller section) and Est Seller Net cost (Final Amount).
    
    calTotalClosingCost() {
        if(this.state.originationFee == '') {
            originationFee = 0.00;
        }else{
            originationFee = this.state.originationFee;
        }
    
        totalCostData =  parseFloat(this.state.drawingDeed) + parseFloat(this.state.notary) + parseFloat(this.state.transferTax) + parseFloat(this.state.pestControlReport) + parseFloat(this.state.benifDemandStatement) + parseFloat(this.state.reconveynceFee) + parseFloat(this.state.brokerageFee) + parseFloat(this.state.daysInterest) + parseFloat(this.state.prepaymentPenality) + parseFloat(this.state.fee1) + parseFloat(this.state.fee2) + parseFloat(this.state.fee3) + parseFloat(this.state.fee4) + parseFloat(this.state.fee5) + parseFloat(this.state.fee6) + parseFloat(this.state.fee7) + parseFloat(this.state.fee8) + parseFloat(this.state.fee9) + parseFloat(this.state.fee10) + parseFloat(this.state.escrowFee) + parseFloat(this.state.ownerFee) + parseFloat(this.state.lenderFee);
        
		rsp = getUptoTwoDecimalPoint(totalCostData);
		this.setState({totalClosingCost: rsp.val});


		totalOtherCost = parseFloat(this.state.otherCostsDiscount2) + parseFloat(this.state.processingfee) + parseFloat(this.state.taxservicecontract) + parseFloat(this.state.documentprep) + parseFloat(this.state.underwriting) + parseFloat(this.state.appraisalfee) + parseFloat(this.state.correctivework) + parseFloat(this.state.buyersfee);
		

		console.log("cal total closing cost " + totalOtherCost);
        
	
		res = getUptoTwoDecimalPoint(totalOtherCost);
		this.setState({totalOtherCost: res.val});
 
        this.state.totalAllCost = parseFloat(totalCostData) + parseFloat(totalOtherCost);
        
        resp = getUptoTwoDecimalPoint(this.state.totalAllCost);
        this.state.totalAllCost = resp.val;
        
    
        
        /* if(this.state.discAmt != ''){
            totalClosingCost    = parseInt(this.state.totalCost) + parseInt(totalCostData) + parseInt(this.state.discAmt);
        } else {
            totalClosingCost    = parseInt(this.state.totalCost) + parseInt(totalCostData);
        }
        if(this.state.escrowTotal != ''){
            totalClosingCost    = parseFloat(totalClosingCost) + parseFloat(this.state.escrowTotal);
        }
        }
        this.setState({totalClosingCost: totalClosingCost},this.callSalesPr); */
	
        if(this.state.sale_pr != "" && this.state.sale_pr != '0.00' && this.state.sellerMustNetFixed == true) {
            this.setState({animating:'false'}, this.calSellerWant);
            
        } else {
			this.setState({animating:'false'});
			
			Alert.alert('CostsFirst', 'Please Enter Loans to be Paid then Enter Amount Seller is to Net.');

        }
	}
	
	InitialcalculateTotalClosingCost() {
		if(this.state.originationFee == '') {
            originationFee = 0.00;
        }else{
            originationFee = this.state.originationFee;
        }
    
        totalCostData =  parseFloat(this.state.drawingDeed) + parseFloat(this.state.notary) + parseFloat(this.state.transferTax) + parseFloat(this.state.pestControlReport) + parseFloat(this.state.benifDemandStatement) + parseFloat(this.state.reconveynceFee) + parseFloat(this.state.brokerageFee) + parseFloat(this.state.daysInterest) + parseFloat(this.state.prepaymentPenality) + parseFloat(this.state.fee1) + parseFloat(this.state.fee2) + parseFloat(this.state.fee3) + parseFloat(this.state.fee4) + parseFloat(this.state.fee5) + parseFloat(this.state.fee6) + parseFloat(this.state.fee7) + parseFloat(this.state.fee8) + parseFloat(this.state.fee9) + parseFloat(this.state.fee10) + parseFloat(this.state.escrowFee) + parseFloat(this.state.ownerFee) + parseFloat(this.state.lenderFee);
        
		rsp = getUptoTwoDecimalPoint(totalCostData);
		this.setState({totalClosingCost: rsp.val});


        totalOtherCost = parseFloat(this.state.otherCostsDiscount2) + parseFloat(this.state.processingfee) + parseFloat(this.state.taxservicecontract) + parseFloat(this.state.documentprep) + parseFloat(this.state.underwriting) + parseFloat(this.state.appraisalfee) + parseFloat(this.state.correctivework) + parseFloat(this.state.buyersfee);
		
		console.log("intial calc total closing cost " + totalOtherCost);
	
		res = getUptoTwoDecimalPoint(totalOtherCost);
		this.setState({totalOtherCost: res.val});
 
        this.state.totalAllCost = parseFloat(totalCostData) + parseFloat(totalOtherCost);
        
        resp = getUptoTwoDecimalPoint(this.state.totalAllCost);
        this.state.totalAllCost = resp.val;
        
    
        
        /* if(this.state.discAmt != ''){
            totalClosingCost    = parseInt(this.state.totalCost) + parseInt(totalCostData) + parseInt(this.state.discAmt);
        } else {
            totalClosingCost    = parseInt(this.state.totalCost) + parseInt(totalCostData);
        }
        if(this.state.escrowTotal != ''){
            totalClosingCost    = parseFloat(totalClosingCost) + parseFloat(this.state.escrowTotal);
        }
        }
        this.setState({totalClosingCost: totalClosingCost},this.callSalesPr); */
        
        if(this.state.sale_pr != "" && this.state.sale_pr != '0.00' && this.state.sellerMustNetFixed == true) {
            this.setState({animating:'true'}, this.calSellerWant);
            
        } else {
            this.setState({animating:'false'});
        }
		
	}
    
    calSellerWant() {

		balance  = parseFloat(this.state.sale_pr) - parseFloat(this.state.totalAllCost);
		balance  = balance - parseFloat(this.state.existingTotal);
		balance  = balance - parseFloat(this.state.estimatedTaxProrations);
		netDiff  = balance - this.state.initial_seller_must_net;
		this.setState({
			seller_must_net : parseFloat(balance).toFixed(2)
		});
		
		if(netDiff > 200) {
			//console.log("netDiff      ==>" + netDiff);
			//console.log("Balance      ==>" + balance);
			this.state.maintainAmnt  = parseInt(this.state.maintainAmnt) - parseInt("450");
			//console.log("Maintain Amount   ==>" + this.maintainAmount);
			this.state.sellerWantTotal = parseInt(this.state.initial_seller_must_net) + parseInt(this.state.existingTotal) + parseInt(this.state.maintainAmnt);
			this.state.sale_pr   = (this.state.sellerWantTotal * 1.08).toFixed( 2 );
			//console.log("Seller Want Total  ==>" + this.sellerWantTotal);
			//console.log("Sales Price    ==>" + this.salesprice);
			this.calAmount(this.state.sale_pr);
		} else {
			if(balance < this.state.initial_seller_must_net){
			 netDiff  =  this.state.initial_seller_must_net - balance;
			
			 //console.log("netDiff      ==>" + netDiff);
			 if(netDiff > 200){
			  this.state.maintainAmnt  = parseInt(this.state.maintainAmnt) + parseInt("500");
			  this.state.sellerWantTotal = parseInt(this.state.initial_seller_must_net) + parseInt(this.state.existingTotal) + parseInt(this.state.maintainAmnt);
			  this.state.sale_pr   = parseFloat(this.state.sellerWantTotal * 1.08).toFixed( 2 );
			  this.calAmount(this.state.sale_pr);
			 } else {
			  
			  this.state.maintainAmnt  = parseInt(this.state.maintainAmnt) + parseInt("100");
			  this.state.sellerWantTotal = parseInt(this.state.initial_seller_must_net) + parseInt(this.state.existingTotal) + parseInt(this.state.maintainAmnt);
			  this.state.sale_pr   = (this.state.sellerWantTotal * 1.08).toFixed( 2 );
			  this.calAmount(this.state.sale_pr);
			 }
			} else {
				this.setState({
					sellerMustNetFixed : false
				});
				//this.calTotalClosingCost();
				this.setState({animating:'false'});
			}
		   }		

    }
    
    // function call when entered seller to net value
    // comment function by lovedeep as it is not required for now
    /*calSellerMustNet() {
        sellerTotal    = parseInt(this.state.seller_must_net) + parseInt(this.state.existingTotal);
        this.state.sellerWantTotal = sellerTotal;
        this.setState({
            sellerWantTotal : sellerTotal
        });
		this.state.sale_pr = (this.state.sellerWantTotal * 1.08).toFixed( 2 ) ;
		
	//	console.log("sellerTotal " + this.state.sellerTotal);
	//	console.log("sale price 3 " + this.state.sale_pr);

        this.calAmount();
	} */
    
    calAmount(sale_pr) {  
		let requestAgt        = {
            'brokeragePer'        : this.state.brokerageFeePer,
            'salePrice'        : sale_pr,
        }
		let responseAgt        = getNetfirstListSellAgtValues(requestAgt);
	
		console.log("brokerage fee " + JSON.stringify(responseAgt));

		//alert(this.state.tab);
        if(this.state.tab == 'CONV'){
            tab = this.callConvSettingData;
        }else if(this.state.tab == 'FHA'){
            tab = this.callFHAsettinsapi;
        }else if(this.state.tab == 'VA'){
            tab = this.callVAsettinsapi;
        }else if(this.state.tab == 'USDA'){
            tab = this.callUSDAsettinsapi;
        }else if(this.state.tab == 'CASH'){
			tab = this.callCASHsettinsapi;
        }
 
        if(this.state.sale_pr <= this.state.FHA_SalePriceUnder){
            LTV = this.state.FHA_SalePriceUnderLTV;            
        } else if (this.state.sale_pr > this.state.FHA_SalePriceUnder && this.state.sale_pr <= this.state.FHA_SalePriceTo){
            LTV = this.state.FHA_SalePriceToLTV;            
        } else if (this.state.sale_pr > this.state.FHA_SalePriceOver){
            LTV = this.state.FHA_SalePriceOverLTV;
        }
		
		let requestTransferTax          = { 'transferTaxRate' : this.state.transferTaxPer,'salesprice' : this.state.sale_pr, 'state': this.state.user_state, 'countyId': this.state.county  };

		let responseTransferTax        = getTransferTax(requestTransferTax);
		this.state.transferTax = responseTransferTax.transferTax;

		// code commented by lovedeep on 09-03-2018 as per discussion with atul sir as trnasfer tax value not matched with live
		/*this.state.transferTax   = this.state.transferTaxPer * this.state.sale_pr / 1000;
		this.state.transferTax = this.state.transferTax.toFixed(2);*/

        this.setState({sale_pr: this.state.sale_pr,brokerageFee : responseAgt.brokerageFee, LTV: LTV},tab);

		console.log("sale_pr 2" + this.state.sale_pr);
		console.log("brokerageFee " + this.state.brokerageFee);
		
	}
    
    // call when you click on footer tabs
    changeFooterTab(footer_tab){
        
        this.setState({footer_tab: footer_tab});
        if(footer_tab == 'seller'){
            this.setState({netFirstFooterTab: true});
        }else{
            this.setState({netFirstFooterTab: false});
        }
    }    
    
    // call when to go back to the page
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
    
    onChange(text) {
		//newText = text.replace(/[^\d.]/g,'');
		val = text.replace(/[^0-9\.]/g,'');
		if(val.split('.').length>2) {
			val =val.replace(/\.+$/,"");
		}
		newText = val;
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
        }else if(this.state.tab=="CONV"){
            this.callConvSettingData();
        }else if(this.state.tab=="CASH"){
            this.callCASHsettinsapi();
        }
        // For national global setting api to calculate down payment,loan amount and adjusted loan amount when tab changes
        /* if(this.state.sale_pr == ''){
            this.onChangeRate('0',"sale_pr");
        }else{
            this.onChangeRate(this.state.sale_pr,"sale_pr");
        } */
    }
    
	// call function when any of the input field of calculator change
	updateFormFieldFunction(fieldVal, fieldName) {
		fieldVal = this.removeCommas(fieldVal);
		if(this.state.defaultVal != fieldVal){
			if(fieldName == 'annualPropertyTax') {
				funcCall = this.onCallannualPropertyTax(fieldVal);	
			} else if (fieldName == 'brokerageFeePer') {
				funcCall = this.onCallBrokerageFeePerField();
			} else if (fieldName == 'brokerageFee') {
				funcCall = this.onCallBrokerageFeeField();
			} else if (fieldName == 'disc') {
				funcCall = this.onCallDiscount();
			} else if (fieldName == 'estimatedTaxProrations') {
				funcCall = this.onCallestimatedTaxProrations(fieldVal);
			}

			if(fieldVal=='') {
				processedData = '0.00';
				this.setState({
					[fieldName]: processedData,
				},funcCall)
			} else {
				var value = parseFloat(fieldVal);
				value = value.toFixed(2);
				processedData = value;		
				this.setState({
					[fieldName]: processedData,
				},funcCall)	
			}
		}	
	}


    
	// call function when any of the input field of calculator change
	updateFormField (fieldVal, fieldName) {
		fieldVal = this.removeCommas(fieldVal);
		if(this.state.defaultVal != fieldVal){
			if(fieldVal=='') {
				processedData = '0.00';
				this.setState({
					[fieldName]: processedData,
				},this.onChangeClosingCostFields)
			} else {
				var value = parseFloat(fieldVal);
				value = value.toFixed(2);
				processedData = value;		
				this.setState({
					[fieldName]: processedData,
				},this.onChangeClosingCostFields)	
			}
		}
	}   
	
	// call function when any of the input field of calculator change
	updateFormFieldForOtherCostFields (fieldVal, fieldName, fieldNameFixed) {
		fieldVal = this.removeCommas(fieldVal);
		if(this.state.defaultVal != fieldVal){
			if(fieldVal=='') {
				processedData = '0.00';
				this.setState({
					[fieldName]: processedData,
					[fieldNameFixed] : true,
				},this.onChangeOtherCostFields)
			} else {
				var value = parseFloat(fieldVal);
				value = value.toFixed(2);
				processedData = value;		
				this.setState({
					[fieldName]: processedData,
					[fieldNameFixed] : true,
				},this.onChangeOtherCostFields)	
			}
		}	
	}

					// call function when any of the input field of calculator change
	updateFormFieldForLoanTobePaid (fieldVal, fieldName) {
		fieldVal = this.removeCommas(fieldVal);
		if(this.state.defaultVal != fieldVal){
			if(fieldVal=='') {
				processedData = '0.00';
				this.setState({
					[fieldName]: processedData,
				},this.onCallLoanToBePaid)
			} else {
				var value = parseFloat(fieldVal);
				value = value.toFixed(2);
				processedData = value;		
				this.setState({
					[fieldName]: processedData,
				},this.onCallLoanToBePaid)	
			}
		}	
	}


    // call when change value of input field of existingfirst, existingsecond, existingthird for loan amount change
    onCallLoanToBePaid(refVal) {    
		let request     = {
			'existing_bal1'     : this.state.loansToBePaid_1Balance,
			'existing_rate1'    : this.state.loansToBePaid_1Rate,
			'existing_bal2'     : this.state.loansToBePaid_2Balance,
			'existing_rate2'    : this.state.loansToBePaid_2Rate,
			'existing_bal3'     : this.state.loansToBePaid_3Balance,
			'existing_rate3'    : this.state.loansToBePaid_3Rate,
			'days'              : this.state.settlementDate
		}
		response            = getNetfirstExistingBalanceCalculation(request);
		this.setState({daysInterest: response.daysInterest,existingTotal: parseFloat(response.existingTotal).toFixed(2)}, this.totalCostDataUpdateFields);
    }
    
    // call when change value of input field of annual property tax
    onCallannualPropertyTax(refVal) {
            callPostApi(GLOBAL.BASE_URL + GLOBAL.seller_proration_setting, {
                "state_id": this.state.state
            }, this.state.access_token)
            .then((response) => {

				monthNames = [ "", "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec" ]; 
				var split = this.state.date.split('-');
				this.state.settlementMonth = parseInt(split[0]); 
                
                if(this.state.settlementMonth == '1'){
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
                }
 
                let request         = {'annualPropertyTax': this.state.annualPropertyTax, 'proration': this.state.proration, 'date': this.state.settlementDate, 'month' : this.state.settlementMonth, 'state_code': this.state.state_code};
                let responsePro                 = getNetfirstEstimatedTax( request );
                this.setState({
                    estimatedTaxProrations : responsePro.estimatedTax
                }, this.totalCostDataUpdateFields);
            });
      
    }
	
	onCallestimatedTaxProrations(refVal) {
		this.setState({
			estimatedTaxProrations : refVal
		}, this.totalCostDataUpdateFields);
	}
    
    // change value of input field of discount
    onCallDiscount() {   
            discText = this.refs.Discount._lastNativeText;

            let request         = {'discountPerc': discText,'amount': this.state.amount};
            let response                 = getNetfirstDiscountAmount(request);
 
            this.setState({disc: discText,otherCostsDiscount2: parseFloat(response.discount).toFixed(2)});
            
            this.state.totalOtherCost = parseFloat(response.discount) + parseFloat(this.state.processingfee) + parseFloat(this.state.taxservicecontract) + parseFloat(this.state.documentprep) + parseFloat(this.state.underwriting) + parseFloat(this.state.appraisalfee) + parseFloat(this.state.correctivework) + parseFloat(this.state.buyersfee);
            res = getUptoTwoDecimalPoint(this.state.totalOtherCost);
			this.state.totalOtherCost = res.val;
			
			console.log("total ohter cost on discount call " + this.state.totalOtherCost);
            
            this.state.totalAllCost = parseFloat(this.state.totalClosingCost) + parseFloat(this.state.totalOtherCost);
   
    }
    
	//call when value of brokerage fee field change
	onCallBrokerageFeeField() {	
		let requestAgt        = {
			'brokerageFee'        : this.state.brokerageFee,
			'salePrice'        : this.state.sale_pr,
		}
		let responseAgt        = getNetfirstListSellAgtPer(requestAgt);
		this.setState({
			brokerageFeePer : responseAgt.brokeragePer
		}, this.totalCostDataUpdateFields);		
	}
	
	// call when value of brokerage fee percentage change
	onCallBrokerageFeePerField() {
		// requesting agrigate list and sell values
		let requestAgt        = {
			'brokeragePer'        : this.state.brokerageFeePer,
			'salePrice'        : this.state.sale_pr,
		}
		let responseAgt        = getNetfirstListSellAgtValues(requestAgt);
		
		this.state.brokerageFee = responseAgt.brokerageFee 
		/*this.setState({
			brokerageFee : responseAgt.brokerageFee
		});*/
		
		this.totalCostDataUpdateFields();
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
			if(fieldVal=='') {
				processedData = '0.00';
			} else {
				var value = parseFloat(fieldVal);
				value = value.toFixed(2);
				processedData = value;        
			}
			this.setState({
				[fieldName]: processedData,
			})
		}	
	}
	
	// call when value of prepared for change
	onCallPreparedForField(fieldVal, fieldName) {
		if(this.state.defaultVal != fieldVal){
			if(fieldVal == '') {
				processedData = 'New Client';
			} else {
				processedData = fieldVal;
			}
			this.setState({
				[fieldName]: processedData,
			})		
		}		
	}
    
    // call when value of prepared for change
    /*onCallPreparedForField(fieldVal, fieldName) {
			if(fieldVal == '') {
				processedData = '';
			}
			this.setState({
				[fieldName]: processedData,
			})   
	}*/

	 onBlur() {
		if(this.state.seller_must_net != '') {
			var value = parseFloat(this.state.seller_must_net);
			value = value.toFixed(2);
			this.setState({
				seller_must_net : value,			
			});
		}
	 }
    
    // onBlur function is used to set value like 100.00 if user entered 100. Also this function is taking care of the scenario in which if user left input field blank, then default value will be set i.e 0.00 . text in this case is a ref value to detect on which field you have clicked on. for example :- salesPrice is a reference to sale price input field. toFixed function is used to convert 100.022222 to 100.02
            
    onBlurCalculate(text) {
            if(this.state.seller_must_net == '0.00') {
                this.setState({
                    seller_must_net : '0.00',
				});   
				
				this.dropdown.alertWithType('error', 'Error', 'Please enter seller must net.');
		

            } else {
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

								this.setState({animating:'true'});
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

								
								text = this.state.seller_must_net;
								this.state.initial_seller_must_net = parseInt(text);
								sellerTotal    = parseInt(text) + parseInt(this.state.existingTotal);
								this.state.sellerWantTotal = sellerTotal;

								this.state.sale_pr = (this.state.sellerWantTotal * 1.08).toFixed(2);				

								console.log("sellerWantTotal " + this.state.sellerWantTotal);
								console.log("sale_pr " + this.state.sale_pr);

								this.InitialcalculateTotalClosingCost();
							}
						}	
					}); 
			}
            
            if(this.state.seller_must_net != '') {
                var value = parseFloat(this.state.seller_must_net);
                value = value.toFixed(2);
                this.setState({
					seller_must_net : value,
					sellerMustNetFixed : true
                });
            }
     
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
        response            = getNetfirstExistingBalanceCalculation(request);
		this.setState({daysInterest: response.daysInterest,existingTotal: parseFloat(response.existingTotal).toFixed(2)}, this.onCallannualPropertyTax(this.state.annualPropertyTax));
	}
	
	totalCostDataUpdateFields() {
		if(this.state.originationFee == '') {
			originationFee = 0.00;
		} else {
			originationFee = this.state.originationFee;
		}

		totalCostData = parseFloat(this.state.drawingDeed) + parseFloat(this.state.notary) + parseFloat(this.state.transferTax) + parseFloat(this.state.pestControlReport) + parseFloat(this.state.benifDemandStatement) + parseFloat(this.state.reconveynceFee) + parseFloat(this.state.brokerageFee) + parseFloat(this.state.daysInterest) + parseFloat(this.state.prepaymentPenality) + parseFloat(this.state.fee1) + parseFloat(this.state.fee2) + parseFloat(this.state.fee3) + parseFloat(this.state.fee4) + parseFloat(this.state.fee5) + parseFloat(this.state.fee6) + parseFloat(this.state.fee7) + parseFloat(this.state.fee8) + parseFloat(this.state.fee9) + parseFloat(this.state.fee10) + parseFloat(this.state.escrowFee) + parseFloat(this.state.ownerFee) + parseFloat(this.state.lenderFee);
 
		rsp = getUptoTwoDecimalPoint(totalCostData);
		this.setState({totalClosingCost: rsp.val});
		
		totalOtherCost = parseFloat(this.state.otherCostsDiscount2) + parseFloat(this.state.processingfee) + parseFloat(this.state.taxservicecontract) + parseFloat(this.state.documentprep) + parseFloat(this.state.underwriting) + parseFloat(this.state.appraisalfee) + parseFloat(this.state.correctivework) + parseFloat(this.state.buyersfee);

		console.log("total other cost from totalOtherCost " + totalOtherCost);
		
		res = getUptoTwoDecimalPoint(totalOtherCost);
		this.setState({totalOtherCost: res.val});

		this.state.totalAllCost = parseFloat(totalCostData) + parseFloat(totalOtherCost);
		resp = getUptoTwoDecimalPoint(this.state.totalAllCost);
		this.state.totalAllCost = resp.val;

		if(this.state.sale_pr != "" && this.state.sale_pr != '0.00' && this.state.sellerMustNetFixed == true) {
            this.setState({animating:'true'}, this.calSellerWant);
            
        } else {
            this.setState({animating:'false'});
		}
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
                this.dropdown.alertWithType('error', 'Error', 'Please enter sales price.');
            }else{
                this.saveNetFirstCalculatorDetailsApi();
			}
			this.setState({
				dropValues : ""
			});
        } else if(this.state.dropValues == "PRINT"){
			this.setState({popupType: "print"},this.popupShow);
			this.setState({
				dropValues : ""
			});
        } else if(this.state.dropValues == "EMAIL") {
            if(this.state.sale_pr == "" || this.state.sale_pr == "0.00"){
                this.dropdown.alertWithType('error', 'Error', 'Please enter sales price.');
            }else{
				//this.setState({popupType: "email"},this.popupShowAddEmailAddress);
				this.setState({popupType: "email"},this.popupShow);
			}
			this.setState({
				dropValues : ""
			});
        } else if(position == "msg_tab") {
            ImagePicker.openPicker({
              width: 300,
              height: 400,
			  cropping: true,
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
        } else if(position == "msg_tab_cam") {
            ImagePicker.openCamera({
              width: 300,
              height: 400,
			  cropping: true,
            }).then(image => {
                this.popupDialog.dismiss();
                this.popupDialogEmail.dismiss();
				this.setState({imageData: image}, this.imageSuccess);
				console.log("image data " + JSON.stringify(image));
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
        }
    }
    
    imageSuccess() {
        //this.dropdown.alertWithType('success', 'Success', 'Image attached successfully!');
        //this.dropdown.alertWithType('success', 'Success', 'Image attached successfully!');        
    }
    
    // For showing popup containing list of seller's calculator
    setModalVisible(visible) {
        this.setState({modalVisible: visible});
        this.getNetFirstCalculatorListApi();
    }
    
    
    getNetFirstCalculatorListApi() {
        callPostApi(GLOBAL.BASE_URL + GLOBAL.get_netfirst_calculator, {userId: this.state.user_id, type: "netfirst"
        }, this.state.access_token)
        .then((response) => {

			//alert(JSON.stringify(result));
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
			}else{
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
    
    
    editNetFirstCalculator(id) {
        callPostApi(GLOBAL.BASE_URL + GLOBAL.netfirst_detail_calculator, {calculatorId: id
        }, this.state.access_token)
        .then((response) => {

			//alert(JSON.stringify(result));
			console.log("edit result " + JSON.stringify(result));

            this.setState(result.data);
            this.setState({sale_pr: result.data.salePrice, preparedFor:result.data.preparedFor, lender_address: result.data.address, postal_code: result.data.zip, tab: result.data.buyerLoanType,conventionalLoan: result.data.conventional,settlementDate: result.data.days, loansToBePaid_1Balance: result.data.loansToBePaidPayoff_1Balance,loansToBePaid_1Rate: result.data.loansToBePaidPayoff_1Rate,loansToBePaid_2Balance: result.data.loansToBePaidPayoff_2Balance,loansToBePaid_2Rate: result.data.loansToBePaidPayoff_2Rate,loansToBePaid_3Balance: result.data.loansToBePaidPayoff_3Balance,loansToBePaid_3Rate: result.data.loansToBePaidPayoff_3Rate,existingTotal:result.data.loansToBePaidPayoff_Total, annualPropertyTax: result.data.annualPropertyTax,escrowType : result.data.payorSelectorEscrow, escrowFee: result.data.escrowOrSettlement,ownerType: result.data.payorSelectorOwners,ownerFee: result.data.ownersTitlePolicy,lenderType: result.data.payorSelectorLenders,lenderFee: result.data.lendersTitlePolicy,escrowFeeOrg: result.data.escrowFeeHiddenValue,lenderFeeOrg: result.data.lendersFeeHiddenValue,ownerFeeOrg: result.data.ownersFeeHiddenValue,disc: result.data.otherCostsDiscount1,city: result.data.city,date: result.data.estimatedSettlementDate,drawingDeed: result.data.drawingDeed,notary:result.data.notary,transferTax:result.data.transferTax,prepaymentPenality:result.data.prepaymentPenalty,reconveynceFee:result.data.reconveyanceFee,pestControlReport:result.data.pestControlReport,benifDemandStatement:result.data.benifDemandStatement, brokerageFeePer : result.data.brokerageFee1, brokerageFee :result.data.brokerageFee2,  daysInterest:result.data.allLoans,label1: result.data.costLabel_1Value,fee1: result.data.costFee_1Value,label2: result.data.costLabel_2Value,fee2: result.data.costFee_2Value,label3: result.data.costLabel_3Value,fee3: result.data.costFee_3Value,label4: result.data.costLabel_4Value,fee4: result.data.costFee_4Value,label5: result.data.costLabel_5Value,fee5: result.data.costFee_5Value,label6: result.data.costLabel_6Value,fee6: result.data.costFee_6Value,label7: result.data.costLabel_7Value,fee7: result.data.costFee_7Value,label8: result.data.costLabel_8Value,fee8: result.data.costFee_8Value,label9: result.data.costLabel_9Value,fee9: result.data.costFee_9Value,label10: result.data.costLabel_10Value,fee10: result.data.costFee_10Value,totalClosingCost: result.data.totalClosingCost,otherCostsDiscount2: result.data.otherCostsDiscount2,appraisalfee: result.data.otherCostsAppraisal,documentprep: result.data.otherCostsDocumentPrep,taxservicecontract: result.data.otherCostsTaxServiceContract,underwriting: result.data.otherCostsUnderwriting,processingfee: result.data.otherCostsProcessingFee,correctivework: result.data.otherCostsCorrectiveWork,buyersfee: result.data.otherCostsBuyerFees,totalOtherCost: result.data.totalOtherCosts,totalAllCost: result.data.totalAllCosts,estimatedTaxProrations: result.data.estimatedTaxProrations,seller_must_net: result.data.estimatedSellersNet,county: result.data.countyId,state: result.data.state, calculatorId: id});
			this.setModalVisible(!this.state.modalVisible);
			
			date = this.state.date;
			var split = date.split('-');

			console.log(JSON.stringify(split));
		
			date = Number(split[1])+'-'+Number(split[2])+'-'+Number(split[0]);

			this.setState({
				date : date
			});

			
			
        });
    }
    
        getData() {
        netfirstData     =     {
            'company_id'    : this.state.company_id,
            'user_id' : this.state.user_id,
            'preparedBy' : this.state.user_name,
            "preparedFor":this.state.preparedFor,
            "existingTotal": this.delimitNumbers(this.state.existingTotal),
            "annualPropertyTax": this.delimitNumbers(this.state.annualPropertyTax),
            "selectedEscrowTypeId":this.state.escrowType, 
            "selectedOwnerTypeId":this.state.ownerType,
            "selectedLenderTypeId":this.state.lenderType,
            "discount1": this.delimitNumbers(this.state.disc),
            'address' : this.state.lender_address,
            'city' : this.state.city,
            'state' : this.state.user_state,
            'zip' : this.state.postal_code,
            'salePrice' : this.delimitNumbers(this.state.sale_pr),
            'buyerLoanType' : this.state.tab,
            "conventionalLoan":this.delimitNumbers(this.state.conventionalLoan),
            "model":this.state.date,
            "loansToBePaid_1Balance":this.delimitNumbers(this.state.loansToBePaid_1Balance),
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
            "brokeragePer" : this.delimitNumbers(this.state.brokerageFeePer),
            "brokerageFee" : this.delimitNumbers(this.state.brokerageFee),
            "days":this.state.settlementDate,
            "daysInterest": this.delimitNumbers(this.state.daysInterest),
            "UserSetting_l1":this.state.label1,
            "UserSetting_t1":"Flat Fee",
            "UserSetting_f1": this.delimitNumbers(this.state.fee1),
            "UserSetting_final1": this.delimitNumbers(this.state.fee1),
            "UserSetting_l2":this.state.label2,
            "UserSetting_t2":"Flat Fee",
            "UserSetting_f2": this.delimitNumbers(this.state.fee2),
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
            "sellerMustNet": this.delimitNumbers(this.state.seller_must_net),
            "state_id":this.state.state,
            "county_id":this.state.county
        };
        return netfirstData;
    }
    
    
    popupShow() {
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

    openpopup(type) {
        this.setState({popupAttachmentType: type},this.popupShowEmail);
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
    
    printPDF(type) {
        if(type == "detailed") {
            pdfURL = GLOBAL.generate_pdf_detail_netfirst;
        } else if(type == "quick") {
            pdfURL = GLOBAL.generate_pdf_quick_netfirst;
		}
		date = this.state.date;
		var split = date.split('-');
		date = Number(split[0])+'/'+Number(split[1])+'/'+Number(split[2]);
		netfirstData = this.getData();
		netfirstData.actionType = 'download';
		netfirstData.estStlmtDate = date;


		console.log("date issue " + JSON.stringify(netfirstData));

        callPostApi(GLOBAL.BASE_URL + pdfURL, netfirstData, this.state.access_token)
        .then((response) => {
			console.log("response pdf " + JSON.stringify(result));
			this.popupHide();
            OpenFile.openDoc([{
                url:GLOBAL.BASE_URL + result.data,
                fileName:"sample",
                fileType:"pdf",
                cache: false,
            }], (error, url) => {
                if (error) {
                    console.log("error when opening doc " + error);
                } else {
                    console.log(url);
                }
            })
        });
    }
    
    // For showing popup containing list of seller's calculator
    setEmailModalVisible(visible) {
        this.setState({emailModalVisible: visible});
        this.getNetFirstCalculatorListApi();
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
			//this.dropdown.alertWithType('error', 'Error', 'Please enter valid email addresses with comma separated!');
		} else {
			date = this.state.date;
			var split = date.split('-');
			date = Number(split[0])+'/'+Number(split[1])+'/'+Number(split[2]);
			netfirstData = this.getData();
            netfirstData.email = this.state.to_email;
			netfirstData.image = this.state.imageNameEmail;
            netfirstData.video = this.state.videoNameEmail;
            netfirstData.subject = this.state.email_subject;
			netfirstData.note = this.state.content;
			netfirstData.estStlmtDate = date;
			netfirstData.actionType = 'email';

			console.log("date issue " + JSON.stringify(netfirstData));

			if(this.state.emailType == 'detailed') {
				netfirst_email_service = GLOBAL.generate_pdf_detail_netfirst;
		   } else {
				netfirst_email_service = GLOBAL.generate_pdf_quick_netfirst;
		   }
		
            callPostApi(GLOBAL.BASE_URL + netfirst_email_service, netfirstData,this.state.access_token)
            .then((response) => {

				//alert(JSON.stringify(result));
				this.setState({
					to_email : ""
				});
				this.state.verified_email = result.email;
				this.setState({
					newEmailAddress : result.email
				});
				AsyncStorage.setItem("pdfFileName", result.data);
				AsyncStorage.setItem("calculator", "netfirst");	
				//this.props.navigator.push({name: 'GoogleSigninExample', index: 0 });
				this.popupHideEmail();
				this.popupHide();
				AsyncStorage.removeItem("evernote");
				AsyncStorage.removeItem("dropbox");
				this.setEmailModalVisible(!this.state.emailModalVisible);
				this.dropdown.alertWithType('success', 'Success', "Email sent successfully");	
            });
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
	

	onBuyerPress() {
		this.props.navigator.push({name: 'BuyerCalculator', index: 0 });
	}

	onRefinancePress() {
		this.props.navigator.push({name: 'Refinance', index: 0 });
	}

	onSellerPress() {
		this.props.navigator.push({name: 'SellerCalculator', index: 0 });
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
    
 
    // saveNetFirstCalculatorDetailsApi function is used to save all information of the seller calculator after calculation according to our needs. This function called when you click on 'SAVE' button from breadcrumb shown on top right of the seller calculator page.
        
    saveNetFirstCalculatorDetailsApi() {
		date = this.state.date;
		var split = date.split('-');
		date = Number(split[0])+'/'+Number(split[1])+'/'+Number(split[2]);
		
        netFirstData = {
            'company_id'    : this.state.company_id,
            'user_id' : this.state.user_id,
            'preparedBy' : this.state.user_name,
            "preparedFor":this.state.preparedFor,
            "existingTotal":this.state.existingTotal,
            "annualPropertyTax":this.state.annualPropertyTax,
            "selectedEscrowTypeId":this.state.escrowType, 
            "selectedOwnerTypeId":this.state.ownerType,
            "selectedLenderTypeId":this.state.lenderType,
            "discount1":this.state.disc,
            'address' : this.state.lender_address,
            'city' : this.state.city,
            'state' : this.state.state,
            'zip' : this.state.postal_code,
            'salePrice' : this.state.sale_pr,
            'buyerLoanType' : this.state.tab,
            "conventionalLoan":this.state.conventionalLoan,
            "model":date,
            "loansToBePaid_1Balance":this.state.loansToBePaid_1Balance,
            "loansToBePaid_1Rate":this.state.loansToBePaid_1Rate,
            "loansToBePaid_2Balance":this.state.loansToBePaid_2Balance,
            "loansToBePaid_2Rate":this.state.loansToBePaid_2Rate,
            "loansToBePaid_3Balance":this.state.loansToBePaid_3Balance,
            "loansToBePaid_3Rate":this.state.loansToBePaid_3Rate,
            "escrowFee":this.state.escrowFee,
            "ownerFee":this.state.ownerFee,
            "lenderFee":this.state.lenderFee,
            "escrowFeeOrg":this.state.escrowFeeOrg,
            "lenderFeeOrg":this.state.lenderFeeOrg,
            "ownerFeeOrg":this.state.ownerFeeOrg,
            "SCC_Drawing_Deed":this.state.drawingDeed,
            "SCC_Notary":this.state.notary,
            "SCC_TransferTax":this.state.transferTax,
            "SCC_Prepayment_Penalty":this.state.prepaymentPenality,
            "SCC_Reconveynce_Fee":this.state.reconveynceFee,
            "SCC_Pest_Control_Report":this.state.pestControlReport,
            "SCC_Demand_Statement":this.state.benifDemandStatement,
            "brokeragePer" : this.state.brokerageFeePer,
            "brokerageFee" : this.state.brokerageFee,
            "days":this.state.settlementDate,
            "daysInterest":this.state.daysInterest,
            "UserSetting_l1":this.state.label1,
            "UserSetting_t1":"Flat Fee",
            "UserSetting_f1":this.state.fee1,
            "UserSetting_final1":this.state.fee1,
            "UserSetting_l2":this.state.label2,
            "UserSetting_t2":"Flat Fee",
            "UserSetting_f2":this.state.fee2,
            "UserSetting_final2":this.state.fee2,
            "UserSetting_l3":this.state.label3,
            "UserSetting_t3":"Flat Fee",
            "UserSetting_f3":this.state.fee3,
            "UserSetting_final3":this.state.fee3,
            "UserSetting_l4":this.state.label4,
            "UserSetting_t4":"Flat Fee",
            "UserSetting_f4":this.state.fee4,
            "UserSetting_final4":this.state.fee4,
            "UserSetting_l5":this.state.label5,
            "UserSetting_t5":"Flat Fee",
            "UserSetting_f5":this.state.fee5,
            "UserSetting_final5":this.state.fee5,
            "UserSetting_l6":this.state.label6,
            "UserSetting_t6":"Flat Fee",
            "UserSetting_f6":this.state.fee6,
            "UserSetting_final6":this.state.fee6,
            "UserSetting_l7":this.state.label7,
            "UserSetting_t7":"Flat Fee",
            "UserSetting_f7":this.state.fee7,
            "UserSetting_final7":this.state.fee7,
            "UserSetting_l8":this.state.label8,
            "UserSetting_t8":"Flat Fee",
            "UserSetting_f8":this.state.fee8,
            "UserSetting_final8":this.state.fee8,
            "UserSetting_l9":this.state.label9,
            "UserSetting_t9":"Flat Fee",
            "UserSetting_f9":this.state.fee9,
            "UserSetting_final9":this.state.fee9,
            "UserSetting_l10":this.state.label10,
            "UserSetting_t10":"Flat Fee",
            "UserSetting_f10":this.state.fee10,
            "UserSetting_final10":this.state.fee10,
            "totalClosingCost":this.state.totalClosingCost,
            "discount2":this.state.otherCostsDiscount2,
            "appraisal":this.state.appraisalfee,
            "documentPrep":this.state.documentprep,
            "taxServiceContract":this.state.taxservicecontract,
            "underwriting":this.state.underwriting,
            "processingFee":this.state.processingfee,
            "correctiveWork":this.state.correctivework,
            "buyersFees":this.state.buyersfee,
            "totalOtherCost":this.state.totalOtherCost,
            "totalMonthlyPayment":this.state.totalAllCost,
            "estimatedTaxProrations":this.state.estimatedTaxProrations,
            "sellerMustNet":this.state.seller_must_net,
            "state_id":this.state.state,
            "county_id":this.state.county
		};
		
		console.log("modal " + JSON.stringify(netFirstData));
		
        if(this.state.calculatorId !="" && this.state.calculatorId != "undefined") {
			netFirstData.calculator_id = this.state.calculatorId;    
			// alert box added by lovedeep on 04-30-2018
			Alert.alert( 'CostsFirst', 'A Saved File already exits with the same file name, do you want to:', [ {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')}, {text: 'Save As', onPress: this.onSaveAsNew.bind(this, netFirstData)}, {text: 'Overwrite', onPress: this.onOverwriteAsExisting.bind(this, netFirstData)}] );
        } else {		        
			var temp = JSON.stringify(netFirstData);
			temp = temp.replace(/\"\"/g, "\"0.00\"");
			netFirstData = JSON.parse(temp);
			// check added by lovedeep on 04-30-2018
			if(netFirstData.address == '0.00') {
				netFirstData.address = '';
			}
			callPostApi(GLOBAL.BASE_URL + GLOBAL.netfirst_seller_calculator, netFirstData,this.state.access_token).then((response) => {
				this.dropdown.alertWithType('success', 'Success', result.message);
				//this.setState({monthlyRate: monthlyRate, monthPmiVal: monthPmiVal},this.calTotalPrepaidItems);
			});
		}
	}

	onSaveAsNew(netFirstdt) {

		// as per discussion with atul sir .. passing calc id empty
		delete netFirstdt.calculator_id;
		var temp = JSON.stringify(netFirstdt);
		temp = temp.replace(/\"\"/g, "\"0.00\"");
		netFirstData = JSON.parse(temp);
		
		// check added by lovedeep on 04-30-2018
		if(netFirstData.address == '0.00') {
			netFirstData.address = '';
		}
		/*var temp = JSON.stringify(sellerData);
		temp = temp.replace(/\"\"/g, "\"0.00\"");
		sellerData = JSON.parse(temp);*/

        callPostApi(GLOBAL.BASE_URL + GLOBAL.netfirst_seller_calculator, netFirstData,this.state.access_token).then((response) => {
            this.dropdown.alertWithType('success', 'Success', result.message);
            //this.setState({monthlyRate: monthlyRate, monthPmiVal: monthPmiVal},this.calTotalPrepaidItems);
        });
	}

	onOverwriteAsExisting(netFirstdt) {

		// as per discussion with atul sir .. passing calc id empty
		delete netFirstdt.calculator_id;
		var temp = JSON.stringify(netFirstdt);
		temp = temp.replace(/\"\"/g, "\"0.00\"");
		netFirstData = JSON.parse(temp);
		// check added by lovedeep on 04-30-2018
		if(netFirstData.address == '0.00') {
			netFirstData.address = '';
		}
		/*var temp = JSON.stringify(sellerData);
		temp = temp.replace(/\"\"/g, "\"0.00\"");
		sellerData = JSON.parse(temp);*/

        callPostApi(GLOBAL.BASE_URL + GLOBAL.netfirst_seller_calculator, netFirstData,this.state.access_token).then((response) => {
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

	onPressDeleteCalculator(id) {

		//console.log("calculator id " + id);
		this.setState({animating : 'true', loadingText : 'Please wait..'});
		callPostApi(GLOBAL.BASE_URL + GLOBAL.Delete_NetFirst_Calculator, {id: id
		}, this.state.access_token)
		.then((response) => {
			
		//	console.log("response for delete after onpress " + JSON.stringify(result));
			
			if (result.status == 'success') {
				this.setState({animating : 'false'});
				Alert.alert('CostsFirst', result.message);
				this.getNetFirstCalculatorListApi();
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
	
	// this is for updating empty fields to 0.00 on blur
	onFocus (fieldName) {
		alert('in focus');
		this.setState({
			focusCustomKey : true
		});
		if(fieldName == 'preparedFor') {
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
			this.setState({
				defaultVal: fieldVal,
			})
			this.setState({
				enterAddressBar : false
			});
			/* this.setState({
				[fieldName]: '',
			}) */

		}	
	}

    renderRow(rowData) {
		if(rowData != 'calculatorName'){
			//alert(rowData.address);
			if(rowData.address != null) {
				if(rowData.address.length > 25){
					var strshortened = rowData.address.substring(0,25);
					rowData.address = strshortened + '..';
				}		
		
			}
		}
        return (
			<View style={BuyerStyle.scrollable_container_child_center}>
				<View style={BuyerStyle.savecalcvalue}>
					<TouchableOpacity onPress={() => this.editNetFirstCalculator(rowData.calculatorId)}>
						<Text style={BuyerStyle.text_style}>
							{rowData.calculatorName}{"\n"}$ {rowData.price}
						</Text>
					</TouchableOpacity>
				</View>
				<View style={BuyerStyle.savecalcvalueSecondCol}>
				<TouchableOpacity onPress={() => this.editNetFirstCalculator(rowData.calculatorId)}>
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


				console.log("response in case fomr submitted " + JSON.stringify(result));

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
		if(this.state.GooglePlaceAutoCompleteShow == false) {
			showable=<View style={Styles.TopContainer}>
			<View style={BuyerStyle.iphonexHeader}></View>
			<View style={Styles.outerContainer}>
				<View style={{ flex: 1 }}>
					<Spinner visible={this.state.visble} textContent={this.state.loadingText} textStyle={{color: '#FFF'}} />
				</View>
				<View style={BuyerStyle.HeaderContainer}>
					<Image style={BuyerStyle.HeaderBackground} source={Images.header_background}></Image>
					<TouchableOpacity style={{width:'20%'}} onPress={this.onBackHomePress.bind(this)}>
						<Image style={BuyerStyle.back_icon} source={Images.back_icon}/>
					</TouchableOpacity>
					<Text style={BuyerStyle.header_title}>{STRINGS.t('Net_First')}</Text>
					<TouchableOpacity style={{alignSelf : 'center', paddingRight : 20,paddingVertical:5, backgroundColor : '#ffffff'}} onPress={this.onBlurCalculate.bind(this)}>
						<Text style={{marginLeft :10 , alignSelf : 'center', fontSize : 16, color : '#1683c0'}}>CALCULATE</Text>
					</TouchableOpacity>
					<View style={{alignItems:'flex-start',width:'20%',paddingRight:20}}>
						<Dropdown
							data={this.state.toolbarActions}
							renderBase={() => (
							<MaterialIcons
								name="more-vert"
								color="#fff"
								size={40}
								style={{marginTop : 10, marginLeft : -2}}
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
				{renderIf(this.state.footer_tab == 'seller')(
					<View style={{height:'100%',width:'100%'}}>
						<View style={Styles.headerwrapper} >
							<View style={Styles.subHeaderNewDesign}>
									
									<View style={{paddingRight:10,paddingLeft:10,paddingTop:10,flexDirection: 'row'}}>
										<View style={{width:'48%'}}>
											<TextInput onFocus={() => this.onFocus('preparedFor')} selectTextOnFocus={ true } ref="preparedFor" 
											autoCapitalize = 'words'
											onEndEditing={ (event) => this.onCallPreparedForField(event.nativeEvent.text,'preparedFor')}
											style={Styles.headerTextInputField} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({preparedFor: value})} value={this.state.preparedFor.toString()}/>
										</View>
										<View style={{width:'48%',marginLeft:'4%'}}>
										{this.state.focusCustomKey==true ?
											<CustomTextInput customKeyboardType="hello" 
												onFocus={() => this.onFocus('seller_must_net')} 
												selectTextOnFocus={ true } 
												ref="sellerMustNet" 
												onBlur={() => this.onBlur("seller_must_net")} 
												keyboardType="numeric" underlineColorAndroid = 'transparent' style={Styles.headerTextInputField} 
												onChangeText={(value) => this.setState({seller_must_net:this.onChange(value)})}
												placeholder='Seller Must Net'
												value={ this.state.seller_must_net == '0.00' ? this.state.seller_must_net_empty : this.delimitNumbers(this.state.seller_must_net) } /> :  
												<TextInput onFocus={() => this.onFocus('seller_must_net')} selectTextOnFocus={ true } onBlur={() => this.onBlur("seller_must_net")}  keyboardType="numeric" ref="sellerMustNet" keyboardType="numeric" underlineColorAndroid = 'transparent' 
												style={Styles.headerTextInputField} 
												onChangeText={(value) => this.setState({seller_must_net:this.onChange(value)})} 
												placeholder='Seller Must Net'
												value={ this.state.seller_must_net == '0.00' ? this.state.seller_must_net_empty : this.delimitNumbers(this.state.seller_must_net) } 
												
												/>
										}
										</View>
									</View>
									
									<View style={[Styles.scrollable_container_child,{paddingRight:10,paddingLeft:10,paddingTop:5}]}>
										<GooglePlacesAutocomplete placeholder='Enter Address' minLength={2} autoFocus={false} listViewDisplayed='true' fetchDetails={true}
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
												this.setState({enterAddressBar : false});
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
											<TextInput onFocus={() => this.onFocus('user_state')} selectTextOnFocus={ true } style={Styles.headerTextInputField} placeholder='State' underlineColorAndroid='transparent' onChangeText={(value) => this.setState({user_state: value})} value={this.state.user_state.toString()}/>
										</View>
										<View style={{width:'48%',marginLeft:'4%'}}>
											<TextInput onFocus={() => this.onFocus('postal_code')} selectTextOnFocus={ true } style={Styles.headerTextInputField} placeholder='Zip Code' underlineColorAndroid='transparent'
											onEndEditing={(event) => this.updatePostalCode(event.nativeEvent.text,'postal_code')}
											onChangeText={(value) => this.setState({postal_code: this.onChange(value)})} value={this.state.postal_code.toString()}/>
										</View>
									</View>
									
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
									</View>
								
									<View style={[Styles.segmentContainerNewDesign,{flexDirection:'row',marginTop:5, zIndex :-1}]}>
										<View style={[Styles.subHeaderNewDesignSubPart,{alignSelf:'center',width:'100%',backgroundColor: '#000000'}]}>
												<View style={{alignSelf:'center',flexDirection: 'row'}}>
													<View>
														<Text style={{color:"#0598c9",fontSize: 18,fontWeight: 'bold'}}>
															{STRINGS.t('Sale_Price')}
														</Text>
													</View>
												</View>
												
												<View style={{alignSelf:'center',flexDirection: 'row',marginTop: 2}}>
													<View>
														<View style={{flexDirection: 'row'}}>
															<Text style={{color:"#0598c9",fontSize: 22,fontWeight: 'bold',}}>
																$ {this.delimitNumbers(this.state.sale_pr)}
															</Text>
														</View>
													</View>
												</View>
											</View>
										
										</View>
									
							
									</View>
						</View>
						<View style={(this.state.initialOrientation == 'portrait') ? (this.state.orientation == 'portrait') ? Styles.scrollviewheight : Styles.scrollviewheightlandscape : (this.state.orientation == 'landscape') ? Styles.scrollviewheight : Styles.scrollviewheightlandscape}>
							<ScrollView
								scrollEnabled={this.state.scrollvalue}
								ref="myScrollView"
								showsVerticalScrollIndicator={true}
								keyboardShouldPersistTaps="always"
								keyboardDismissMode='on-drag'
								style={Styles.sellerscrollview}
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
								<View style={[Styles.fullunderline, {marginTop:10}]}></View>
								
								{renderIf(this.state.tab != 'CASH' && this.state.tab != 'USDA' && this.state.tab != 'VA' && this.state.tab != 'FHA')(    
									<View style={[Styles.scrollable_container_child, {marginTop:10}]}>
										<View style={Styles.title_justify}>
											<Text style={Styles.text_style}>{STRINGS.t('conventional')}</Text>
										</View>
										<View style={{width:'30%',justifyContent:'center'}}>
											<View style={Styles.alignrightinput}>
												<Text style={Styles.alignCenter}>% </Text>
												<TextInput onFocus={() => this.onFocus('conventionalLoan')} selectTextOnFocus={ true } 
													placeholder='0.00' 
													keyboardType="numeric" 
													onEndEditing={ (event) => this.onChangeConventionalField(event.nativeEvent.text,'conventionalLoan')}

													style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({conventionalLoan: this.onChange(value)})} value={this.delimitNumbers(this.state.conventionalLoan)}/>
											</View>
											<View style={[Styles.fullunderline, ]}></View>
										</View>
									</View>
								)}
								
								<Text style={[Styles.loanstext,{textAlign:'center'}]}>{STRINGS.t('LoansToBePaid')}</Text>
								<View style={[Styles.fullunderline, {marginTop:10}]}></View>
								<View style={Styles.loanstopaybox}>
									<View style={Styles.headerloanratio}>
										<Text style={Styles.headerloanratiotext}>{STRINGS.t('balance')}</Text>
										<Text style={Styles.headerloanratiotext}>{STRINGS.t('rate')}</Text>
									</View>
								</View>
								<View style={Styles.loandetailhead}>
									<View style={Styles.existingfirst}>
										<Text style={Styles.existingheadtext}>{STRINGS.t('existingfirst')}</Text>
									</View>
									<View style={Styles.existingfirstbalance}>
											<View style={{width:'100%',flexDirection:'row'}}>
												<Text style={Styles.existingtext}>$</Text>
												<TextInput onFocus={() => this.onFocus('loansToBePaid_1Balance')} selectTextOnFocus={ true }
												placeholder='0.00'        
												ref="existingFirst"
												keyboardType="numeric" 

												onEndEditing={ (event) => this.updateFormFieldForLoanTobePaid(event.nativeEvent.text,'loansToBePaid_1Balance')}
	
												style={[Styles.width70,{alignSelf:'center'}]} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({loansToBePaid_1Balance: this.onChange(value)})} value={this.delimitNumbers(this.state.loansToBePaid_1Balance)}/>
											</View>
										<View style={Styles.textboxunderline}>
											<View style={[Styles.fullunderline, ]}></View>
										</View>
									</View>
									<View style={Styles.existingfirstbalance}>
										<View style={{width:'100%',flexDirection:'row'}}>
											<Text style={Styles.existingtext}>%</Text>
											<TextInput onFocus={() => this.onFocus('loansToBePaid_1Rate')} selectTextOnFocus={ true } placeholder='0.00' ref="existingFirstTwo" keyboardType="numeric" 
											onEndEditing={ (event) => this.updateFormFieldForLoanTobePaid(event.nativeEvent.text, 'loansToBePaid_1Rate')}
											
											style={Styles.width70} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({loansToBePaid_1Rate: this.onChange(value)})} value={this.delimitNumbers(this.state.loansToBePaid_1Rate)}/>
										
										</View>
										<View style={Styles.textboxunderline}>
											<View style={[Styles.fullunderline, ]}></View>
										</View>
									</View>
								</View>
								<View style={Styles.loandetailhead}>
									<View style={Styles.existingfirst}>
										<Text style={Styles.existingheadtext}>{STRINGS.t('existingsecond')}</Text>
									</View>
									<View style={Styles.existingfirstbalance}>
										<View style={{width:'100%',flexDirection:'row'}}>
											<Text style={Styles.existingtext}>$</Text>
											<TextInput onFocus={() => this.onFocus('loansToBePaid_2Balance')} selectTextOnFocus={ true } placeholder='0.00' ref="existingSecond" keyboardType="numeric" 
											onEndEditing={ (event) => this.updateFormFieldForLoanTobePaid(event.nativeEvent.text, 'loansToBePaid_2Balance')}
											
											style={[Styles.width70,{alignSelf:'center'}]} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({loansToBePaid_2Balance: this.onChange(value)})} value={this.delimitNumbers(this.state.loansToBePaid_2Balance)}/>
											
										</View>
										<View style={Styles.textboxunderline}>
											<View style={[Styles.fullunderline, ]}></View>
										</View>
									</View>
									<View style={Styles.existingfirstbalance}>
										<View style={{width:'100%',flexDirection:'row'}}>
											<Text style={Styles.existingtext}>%</Text>
											<TextInput onFocus={() => this.onFocus('loansToBePaid_2Rate')} selectTextOnFocus={ true } placeholder='0.00' ref="existingSecondTwo" keyboardType="numeric" 
											onEndEditing={ (event) => this.updateFormFieldForLoanTobePaid(event.nativeEvent.text, 'loansToBePaid_2Rate')}

											style={Styles.width70} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({loansToBePaid_2Rate: this.onChange(value)})} value={this.delimitNumbers(this.state.loansToBePaid_2Rate)}/>
											
										</View>
										<View style={Styles.textboxunderline}>
											<View style={[Styles.fullunderline, ]}></View>
										</View>
									</View>
								</View>
								<View style={Styles.loandetailhead}>
									<View style={Styles.existingfirst}>
										<Text style={Styles.existingheadtext}>{STRINGS.t('existingthird')}</Text>
									</View>
									<View style={Styles.existingfirstbalance}>
										<View style={{width:'100%',flexDirection:'row'}}>
											<Text style={Styles.existingtext}>$</Text>
											<TextInput onFocus={() => this.onFocus('loansToBePaid_3Balance')} selectTextOnFocus={ true } placeholder='0.00' ref="existingThird" keyboardType="numeric" 
											onEndEditing={ (event) => this.updateFormFieldForLoanTobePaid(event.nativeEvent.text, 'loansToBePaid_3Balance')}
											
											style={[Styles.width70,{alignSelf:'center'}]} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({loansToBePaid_3Balance: this.onChange(value)})} value={this.delimitNumbers(this.state.loansToBePaid_3Balance)}/>
										
										</View>
										<View style={Styles.textboxunderline}>
											<View style={[Styles.fullunderline, ]}></View>
										</View>
									</View>
									<View style={Styles.existingfirstbalance}>
										<View style={{width:'100%',flexDirection:'row'}}>
											<Text style={Styles.existingtext}>%</Text>
											<TextInput onFocus={() => this.onFocus('loansToBePaid_3Rate')} selectTextOnFocus={ true } placeholder='0.00' keyboardType="numeric" 
											onEndEditing={ (event) => this.updateFormFieldForLoanTobePaid(event.nativeEvent.text, 'loansToBePaid_3Rate')}
											
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
								<View style={[Styles.scrollable_container_child, {marginTop:10}]}>
									<View style={Styles.title_justify}>
										<Text style={Styles.text_style}>{STRINGS.t('annual_prop_tax')}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<TextInput onFocus={() => this.onFocus('annualPropertyTax')} selectTextOnFocus={ true } placeholder='0.00' ref="annualPropertyTax" keyboardType="numeric" 
											onEndEditing={ (event) => this.updateFormFieldFunction(event.nativeEvent.text, 'annualPropertyTax')}
											
											style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({annualPropertyTax: this.onChange(value)})} value={this.delimitNumbers(this.state.annualPropertyTax)}/>
											
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View>    
								<View style={[Styles.scrollable_container_child, {marginTop:10}]}>
									<View style={Styles.title_justify}>
										<Text style={Styles.text_style}>{STRINGS.t('est_tax_proration')}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<TextInput onFocus={() => this.onFocus('estimatedTaxProrations')} selectTextOnFocus={ true } placeholder='0.00' keyboardType="numeric" 
												onEndEditing={ (event) => this.updateFormFieldFunction(event.nativeEvent.text,'estimatedTaxProrations')}
											style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({estimatedTaxProrations: this.onChange(value)})} value={this.delimitNumbers(this.state.estimatedTaxProrations)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View> 
								<View style={[Styles.fullunderline, {marginTop:10}]}></View>
								<Text style={[Styles.loanstext,{textAlign:'center',marginBottom:30}]}>{STRINGS.t('totalallcosts')}  <Text>$ {this.delimitNumbers(this.state.totalAllCost)}</Text></Text>
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
								keyboardDismissMode='on-drag'
								style={Styles.sellerscrollview}
							>                                 
								<View style={[Styles.scrollable_container_child, {marginTop:10}]}>
									<View style={Styles.smalltitle_justify}>
										<Text style={Styles.text_style}>{STRINGS.t('Escr_or_Settle')}</Text>
									</View>
									<View style={{flexDirection: 'row', width:'25%',justifyContent:'center'}}>
										<ModalDropdown options={this.state.modalDropDownAtions} defaultValue={this.state.escrowType.toString()} animated={true} style={{marginRight : 10, width : 30}} dropdownStyle={{height:115, alignItems: 'center', width:80, borderWidth: 1,borderRadius: 2,borderColor: '#ddd',borderBottomWidth: 0,shadowColor: '#000', shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.8,shadowRadius: 2}} onSelect={(idx, value) => this.createEscrowPicker(idx, value)}>
										</ModalDropdown>
										<ModalDropdown options={this.state.modalDropDownAtions} onSelect={(idx, value) => this.createEscrowPicker(idx, value)} animated={true} style={{marginRight : 10}} dropdownStyle={{height:115, alignItems: 'center', width:80, borderWidth: 1,borderRadius: 2,borderColor: '#ddd',borderBottomWidth: 0,shadowColor: '#000', shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.8,shadowRadius: 2}}>
									<Image style={{width:9,height:9,top:0, marginTop : 3}} source={Images.dropdown_arrow}/>
									</ModalDropdown>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<TextInput onFocus={() => this.onFocus('escrowFee')} selectTextOnFocus={ true } placeholder='0.00' ref="escrowFee" keyboardType="numeric" 
											onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'escrowFee')}
											
											style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({escrowFee: this.onChange(value)})} value={this.delimitNumbers(this.state.escrowFee)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View> 
								<View style={[Styles.scrollable_container_child, {marginTop:10}]}>
									<View style={Styles.smalltitle_justify}>
										<Text style={Styles.text_style}>{STRINGS.t('owners')}</Text>
									</View>
									<View style={{flexDirection: 'row', width:'25%',justifyContent:'center'}}>
										<ModalDropdown options={this.state.modalDropDownAtions} defaultValue={this.state.ownerType.toString()} animated={true} style={{marginRight : 10, width : 30}} dropdownStyle={{height:115, alignItems: 'center', width:80, borderWidth: 1,borderRadius: 2,borderColor: '#ddd',borderBottomWidth: 0,shadowColor: '#000', shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.8,shadowRadius: 2}} onSelect={(idx, value) => this.createOwnerPicker(idx, value)}>
										</ModalDropdown>
										<ModalDropdown options={this.state.modalDropDownAtions} onSelect={(idx, value) => this.createOwnerPicker(idx, value)} animated={true} style={{marginRight : 10}} dropdownStyle={{height:115, alignItems: 'center', width:80, borderWidth: 1,borderRadius: 2,borderColor: '#ddd',borderBottomWidth: 0,shadowColor: '#000', shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.8,shadowRadius: 2}}>
											<Image style={{width:9,height:9,top:0, marginTop : 3}} source={Images.dropdown_arrow}/>
										</ModalDropdown>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<TextInput onFocus={() => this.onFocus('ownerFee')} selectTextOnFocus={ true } placeholder='0.00' ref="ownerFee" keyboardType="numeric" 
											
											onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'ownerFee')}
											
											style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({ownerFee: this.onChange(value)})} value={this.delimitNumbers(this.state.ownerFee)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View> 
								<View style={[Styles.scrollable_container_child, {marginTop:10}]}>
									<View style={Styles.smalltitle_justify}>
										<Text style={Styles.text_style}>{STRINGS.t('lender')}</Text>
									</View>
									<View style={{flexDirection: 'row', width:'25%',justifyContent:'center'}}>
										<ModalDropdown options={this.state.modalDropDownAtions} defaultValue={this.state.lenderType.toString()} animated={true} style={{marginRight : 10, width : 30}} dropdownStyle={{height:115, alignItems: 'center', width:80, borderWidth: 1,borderRadius: 2,borderColor: '#ddd',borderBottomWidth: 0,shadowColor: '#000', shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.8,shadowRadius: 2}} onSelect={(idx, value) => this.createLenderPicker(idx, value)}>
										</ModalDropdown>
										<ModalDropdown options={this.state.modalDropDownAtions} onSelect={(idx, value) => this.createLenderPicker(idx, value)} animated={true} style={{marginRight : 10}} dropdownStyle={{height:115, alignItems: 'center', width:80, borderWidth: 1,borderRadius: 2,borderColor: '#ddd',borderBottomWidth: 0,shadowColor: '#000', shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.8,shadowRadius: 2}}>
											<Image style={{width:9,height:9,top:0, marginTop : 3}} source={Images.dropdown_arrow}/>
									</ModalDropdown>
										
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<TextInput onFocus={() => this.onFocus('lenderFee')} selectTextOnFocus={ true } placeholder='0.00' ref="lenderFee" keyboardType="numeric" 
											onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'lenderFee')}

											style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({lenderFee: this.onChange(value)})} value={this.delimitNumbers(this.state.lenderFee)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View> 
								<View style={[Styles.fullunderline, {marginTop:10}]}></View>   
								<View style={[Styles.scrollable_container_child, {marginTop:10}]}>
									<View style={Styles.title_justify}>
										<Text style={Styles.text_style}>{STRINGS.t('drawing_deed')}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<TextInput onFocus={() => this.onFocus('drawingDeed')} selectTextOnFocus={ true } placeholder='0.00' ref="drawingDeed" 
											onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'drawingDeed')}
											
											keyboardType="numeric" style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({drawingDeed: this.onChange(value)})} value={this.delimitNumbers(this.state.drawingDeed)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View> 
								<View style={[Styles.fullunderline, {marginTop:10}]}></View>   
								<View style={[Styles.scrollable_container_child, {marginTop:10}]}>
									<View style={Styles.title_justify}>
										<Text style={Styles.text_style}>{STRINGS.t('notary')}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<TextInput onFocus={() => this.onFocus('notary')} selectTextOnFocus={ true } placeholder='0.00' ref="notary" 
											onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'notary')}
											
											keyboardType="numeric" style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({notary: this.onChange(value)})} value={this.delimitNumbers(this.state.notary)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View>  
								<View style={[Styles.scrollable_container_child, {marginTop:10}]}>
									<View style={Styles.title_justify}>
										<Text style={Styles.text_style}>{STRINGS.t('transfer_tax')}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<TextInput onFocus={() => this.onFocus('transferTax')} selectTextOnFocus={ true } placeholder='0.00' ref="transferTax" 
											onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'transferTax')}
											
											keyboardType="numeric" style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({transferTax: this.onChange(value)})} value={this.delimitNumbers(this.state.transferTax)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View>  
								<View style={[Styles.scrollable_container_child, {marginTop:10}]}>
									<View style={Styles.title_justify}>
										<Text style={Styles.text_style}>{STRINGS.t('prepayment_penalty')}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<TextInput onFocus={() => this.onFocus('prepaymentPenality')} selectTextOnFocus={ true } placeholder='0.00' ref="prepaymentPenality" 
											onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'prepaymentPenality')}

											keyboardType="numeric" style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({prepaymentPenality: this.onChange(value)})} value={this.delimitNumbers(this.state.prepaymentPenality)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View>  
								<View style={[Styles.scrollable_container_child, {marginTop:10}]}>
									<View style={Styles.title_justify}>
										<Text style={Styles.text_style}>{STRINGS.t('reconveynce_fees')}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<TextInput onFocus={() => this.onFocus('reconveynceFee')} selectTextOnFocus={ true } placeholder='0.00' ref="reconveynceFee" 
											onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'reconveynceFee')}   

											keyboardType="numeric" style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({reconveynceFee: this.onChange(value)})} value={this.delimitNumbers(this.state.reconveynceFee)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View> 
								<View style={[Styles.scrollable_container_child, {marginTop:10}]}>
									<View style={Styles.title_justify}>
										<Text style={Styles.text_style}>{STRINGS.t('pest_control_report')}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<TextInput onFocus={() => this.onFocus('pestControlReport')} selectTextOnFocus={ true } placeholder='0.00' ref="pestControlReport" 
											onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'pestControlReport')}

											keyboardType="numeric" style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({pestControlReport: this.onChange(value)})} value={this.delimitNumbers(this.state.pestControlReport)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View>  
								<View style={[Styles.scrollable_container_child, {marginTop:10}]}>
									<View style={Styles.title_justify}>
										<Text style={Styles.text_style}>{STRINGS.t('demand_statement')}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<TextInput onFocus={() => this.onFocus('benifDemandStatement')} selectTextOnFocus={ true } placeholder='0.00' ref="benifDemandStatement" 
											onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'benifDemandStatement')}

											keyboardType="numeric" style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({benifDemandStatement: this.onChange(value)})} value={this.delimitNumbers(this.state.benifDemandStatement)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View> 
								<View style={[Styles.scrollable_container_child, {marginTop:10}]}>
									<View style={Styles.smalltitle_justify}>
										<Text style={Styles.text_style}>{STRINGS.t('brokerage_fees')}</Text>
									</View>
									<View style={{width:'25%',justifyContent:'center'}}>                                            
										<View style={[Styles.alignrightinput,{width:'80%',marginLeft:'10%'}]}>
											<Text style={Styles.alignCenter}>% </Text>
											<TextInput onFocus={() => this.onFocus('brokerageFeePer')} selectTextOnFocus={ true } placeholder='0.00' ref="brokerageFeePer" 
											onEndEditing={ (event) => this.updateFormFieldFunction(event.nativeEvent.text,'brokerageFeePer')}
											
											keyboardType="numeric" style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({brokerageFeePer: this.onChange(value)})} value={this.delimitNumbers(this.state.brokerageFeePer)}/>
										</View>
										<View style={[Styles.fullunderline,{width:'80%',marginLeft:'10%'} ]}></View>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<TextInput onFocus={() => this.onFocus('brokerageFee')} selectTextOnFocus={ true } placeholder='0.00' ref="brokerageFee" 
											onEndEditing={ (event) => this.updateFormFieldFunction(event.nativeEvent.text,'brokerageFee')}
											

											keyboardType="numeric" style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({brokerageFee: this.onChange(value)})} value={this.delimitNumbers(this.state.brokerageFee)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View> 
								<View style={[Styles.scrollable_container_child, {marginTop:10}]}>
									<View style={{width:'10%', justifyContent:'center', }}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}> </Text>
											<TextInput onFocus={() => this.onFocus('settlementDate')} selectTextOnFocus={ true } placeholder='0.00' ref="settlementDate" 
											onEndEditing={ (event) => this.updateFormFieldForLoanTobePaid(event.nativeEvent.text,'settlementDate')}
										
											keyboardType="numeric" style={Styles.width100} underlineColorAndroid='transparent'  onChangeText={(value) => this.setState({settlementDate: this.onChange(value)})} value={this.delimitNumbers(this.state.settlementDate)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>                                            
									</View>
									<View style={{width:'60%',justifyContent:'center', alignItems:'center'}}> 
										<Text style={Styles.text_style}>{STRINGS.t('days_interest')}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={[Styles.alignrightinput,{marginTop:10}]}>
											<Text style={Styles.width100}>$ {this.delimitNumbers(this.state.daysInterest)}</Text>
										</View>
									</View>
								</View>
								<View style={[Styles.fullunderline, {marginTop:10}]}></View> 
								<View style={[Styles.scrollable_container_child, {marginTop:10}]}>
									<View style={Styles.title_justify}>
										<Text style={Styles.text_style}>{this.state.label1.toString()}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<TextInput onFocus={() => this.onFocus('fee1')} selectTextOnFocus={ true } placeholder='0.00' ref="roofCertification" 
											
											onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'fee1')}
											
											
											keyboardType="numeric" style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({fee1: this.onChange(value)})} value={this.delimitNumbers(this.state.fee1)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View> 

								<View style={[Styles.scrollable_container_child, {marginTop:10}]}>
									<View style={Styles.title_justify}>
										<Text style={Styles.text_style}>{this.state.label2.toString()}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<TextInput onFocus={() => this.onFocus('fee2')} selectTextOnFocus={ true } placeholder='0.00' ref="naturalHazard" 
											
											onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'fee2')}
											
											keyboardType="numeric" style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({fee2: this.onChange(value)})} value={this.delimitNumbers(this.state.fee2)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View> 

								<View style={[Styles.scrollable_container_child, {marginTop:10}]}>
									<View style={Styles.title_justify}>
										<Text style={Styles.text_style}>{this.state.label3.toString()}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<TextInput onFocus={() => this.onFocus('fee3')} selectTextOnFocus={ true } placeholder='0.00' ref="homeWarrenty" 
											
											onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'fee3')}
											
											keyboardType="numeric" style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({fee3: this.onChange(value)})} value={this.delimitNumbers(this.state.fee3)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View> 

								<View style={[Styles.scrollable_container_child, {marginTop:10}]}>
									<View style={Styles.title_justify}>
										<Text style={Styles.text_style}>{this.state.label4.toString()}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<TextInput onFocus={() => this.onFocus('fee4')} selectTextOnFocus={ true } placeholder='0.00' ref="hoaTransfer" 
											
											onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'fee4')}

											keyboardType="numeric" style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({fee4: this.onChange(value)})} value={this.delimitNumbers(this.state.fee4)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View> 

								<View style={[Styles.scrollable_container_child, {marginTop:10}]}>
									<View style={Styles.title_justify}>
										<Text style={Styles.text_style}>{this.state.label5.toString()}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<TextInput onFocus={() => this.onFocus('fee5')} selectTextOnFocus={ true } placeholder='0.00' ref="buyerClosingCst" 
											
											onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'fee5')}
											
											keyboardType="numeric" style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({fee5: this.onChange(value)})} value={this.delimitNumbers(this.state.fee5)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View> 

								<View style={[Styles.scrollable_container_child, {marginTop:10}]}>
									<View style={Styles.title_justify}>
										<Text style={Styles.text_style}>{this.state.label6.toString()}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<TextInput onFocus={() => this.onFocus('fee6')} selectTextOnFocus={ true } placeholder='0.00' ref="fee6" 
											onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'fee6')}
											
											keyboardType="numeric" style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({fee6: this.onChange(value)})} value={this.delimitNumbers(this.state.fee6)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View> 

								<View style={[Styles.scrollable_container_child, {marginTop:10}]}>
									<View style={Styles.title_justify}>
										<Text style={Styles.text_style}>{this.state.label7.toString()}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<TextInput onFocus={() => this.onFocus('fee7')} selectTextOnFocus={ true } placeholder='0.00' ref="fee7" 
											
											onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'fee7')}
											
											keyboardType="numeric" style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({fee7: this.onChange(value)})} value={this.delimitNumbers(this.state.fee7)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View> 

								<View style={[Styles.scrollable_container_child, {marginTop:10}]}>
									<View style={Styles.title_justify}>
										<Text style={Styles.text_style}>{this.state.label8.toString()}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<TextInput onFocus={() => this.onFocus('fee8')} selectTextOnFocus={ true } placeholder='0.00' ref="fee8" 
											onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'fee8')}
											
											keyboardType="numeric" style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({fee8: this.onChange(value)})} value={this.delimitNumbers(this.state.fee8)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View> 

								<View style={[Styles.scrollable_container_child, {marginTop:10}]}>
									<View style={Styles.title_justify}>
										<Text style={Styles.text_style}>{this.state.label9.toString()}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<TextInput onFocus={() => this.onFocus('fee9')} selectTextOnFocus={ true } placeholder='0.00' ref="fee9" 
											
											onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'fee9')}
											
											keyboardType="numeric" style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({fee9: this.onChange(value)})} value={this.delimitNumbers(this.state.fee9)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View> 

								<View style={[Styles.scrollable_container_child, {marginTop:10}]}>
									<View style={Styles.title_justify}>
										<Text style={Styles.text_style}>{this.state.label10.toString()}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<TextInput onFocus={() => this.onFocus('fee10')} selectTextOnFocus={ true } placeholder='0.00' ref="fee10" 
											onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'fee10')}
											
											
											keyboardType="numeric" style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({fee10: this.onChange(value)})} value={this.delimitNumbers(this.state.fee10)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View> 
								<View style={[Styles.fullunderline, {marginTop:10,marginBottom:20}]}></View>
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
								keyboardDismissMode='on-drag'
								style={Styles.sellerscrollview}
							>                                 
								<View style={[Styles.scrollable_container_child, {marginTop:10}]}>
									<View style={Styles.smalltitle_justify}>
										<Text style={Styles.text_style}>{STRINGS.t('discount')}</Text>
									</View>
									<View style={{width:'25%',justifyContent:'center'}}>                                            
										<View style={[Styles.alignrightinput,{width:'80%',marginLeft:'10%'}]}>
											<Text style={Styles.alignCenter}>% </Text>
											<TextInput onFocus={() => this.onFocus('disc')} selectTextOnFocus={ true } placeholder='0.00' ref="Discount" 
											onEndEditing={ (event) => this.updateFormFieldFunction(event.nativeEvent.text,'disc')}
											
											keyboardType="numeric" style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({disc:this.onChange(value)})} value={this.delimitNumbers(this.state.disc)}/>
										</View>
										<View style={[Styles.fullunderline,{width:'80%',marginLeft:'10%'} ]}></View>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<TextInput onFocus={() => this.onFocus('otherCostsDiscount2')} selectTextOnFocus={ true } placeholder='0.00' ref="otherCostsDiscount2" 
											onEndEditing={ (event) => this.updateFormField(event.nativeEvent.text,'otherCostsDiscount2')}													
											keyboardType="numeric" style={Styles.width100} underlineColorAndroid='transparent' value={this.delimitNumbers(this.state.otherCostsDiscount2)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View> 
								<View style={[Styles.fullunderline, {marginTop:10}]}></View> 
								<View style={[Styles.scrollable_container_child, {marginTop:10}]}>
									<View style={Styles.title_justify}>
										<Text style={Styles.text_style}>{STRINGS.t('Appraisal')}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<TextInput onFocus={() => this.onFocus('appraisalfee')} selectTextOnFocus={ true } placeholder='0.00' ref="appraisalfee" 
											
											onEndEditing={ (event) => this.updateFormFieldForOtherCostFields(event.nativeEvent.text,'appraisalfee', 'appraisalfeeFixed')}
											
											keyboardType="numeric" style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({appraisalfee: this.onChange(value)})} value={this.delimitNumbers(this.state.appraisalfee)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View> 
								<View style={[Styles.fullunderline, {marginTop:10}]}></View> 
								<View style={[Styles.scrollable_container_child, {marginTop:10}]}>
									<View style={Styles.title_justify}>
										<Text style={Styles.text_style}>{STRINGS.t('Document_Prep')}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<TextInput onFocus={() => this.onFocus('documentprep')} selectTextOnFocus={ true } placeholder='0.00' ref="documentprep" 
											
											onEndEditing={ (event) => this.updateFormFieldForOtherCostFields(event.nativeEvent.text,'documentprep', 'documentprepFixed')}

											keyboardType="numeric" style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({documentprep: this.onChange(value)})} value={this.delimitNumbers(this.state.documentprep)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View> 
								<View style={[Styles.fullunderline, {marginTop:10}]}></View> 
								<View style={[Styles.scrollable_container_child, {marginTop:10}]}>
									<View style={Styles.title_justify}>
										<Text style={Styles.text_style}>{STRINGS.t('Tax_Service_Contract')}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<TextInput onFocus={() => this.onFocus('taxservicecontract')} selectTextOnFocus={ true } placeholder='0.00' ref="taxservicecontract" 
											
											onEndEditing={ (event) => this.updateFormFieldForOtherCostFields(event.nativeEvent.text,'taxservicecontract', 'taxservicecontractFixed')}
											
											keyboardType="numeric" style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({taxservicecontract: this.onChange(value)})} value={this.delimitNumbers(this.state.taxservicecontract)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View> 
								<View style={[Styles.fullunderline, {marginTop:10}]}></View> 
								<View style={[Styles.scrollable_container_child, {marginTop:10}]}>
									<View style={Styles.title_justify}>
										<Text style={Styles.text_style}>{STRINGS.t('Underwriting')}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<TextInput onFocus={() => this.onFocus('underwriting')} selectTextOnFocus={ true } placeholder='0.00' ref="underwriting" 
											onEndEditing={ (event) => this.updateFormFieldForOtherCostFields(event.nativeEvent.text,'underwriting', 'underwritingFixed')}
											
											keyboardType="numeric" style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({underwriting: this.onChange(value)})} value={this.delimitNumbers(this.state.underwriting)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View> 
								<View style={[Styles.fullunderline, {marginTop:10}]}></View> 
								<View style={[Styles.scrollable_container_child, {marginTop:10}]}>
									<View style={Styles.title_justify}>
										<Text style={Styles.text_style}>{STRINGS.t('Processing_Fee')}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<TextInput onFocus={() => this.onFocus('processingfee')} selectTextOnFocus={ true } placeholder='0.00' ref="processingfee" 
											
											onEndEditing={ (event) => this.updateFormFieldForOtherCostFields(event.nativeEvent.text,'processingfee', 'processingfeeFixed')}
											
											keyboardType="numeric" style={Styles.width100} underlineColorAndroid='transparent' onChangeText={(value) => this.setState({processingfee: this.onChange(value)})} value={this.delimitNumbers(this.state.processingfee)}/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View> 
								<View style={[Styles.fullunderline, {marginTop:10}]}></View> 
								<View style={[Styles.scrollable_container_child, {marginTop:10}]}>
									<View style={Styles.title_justify}>
										<Text style={Styles.text_style}>{STRINGS.t('Corrective_Work')}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<TextInput onFocus={() => this.onFocus('correctivework')} selectTextOnFocus={ true } placeholder='0.00' ref="correctivework" 
											onEndEditing={ (event) => this.updateFormFieldForOtherCostFields(event.nativeEvent.text,'correctivework', '')}
											
											keyboardType="numeric" onChangeText={(value) => this.setState({correctivework: this.onChange(value)})} value={this.delimitNumbers(this.state.correctivework)} style={Styles.width100} underlineColorAndroid='transparent'/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View> 
								<View style={[Styles.fullunderline, {marginTop:10}]}></View> 
								<View style={[Styles.scrollable_container_child, {marginTop:10}]}>
									<View style={Styles.title_justify}>
										<Text style={Styles.text_style}>{this.state.buyers_fee_text}</Text>
									</View>
									<View style={{width:'30%',justifyContent:'center'}}>
										<View style={Styles.alignrightinput}>
											<Text style={Styles.alignCenter}>$ </Text>
											<TextInput onFocus={() => this.onFocus('buyersfee')} selectTextOnFocus={ true } placeholder='0.00' ref="buyersfee" 
											onEndEditing={ (event) => this.updateFormFieldForOtherCostFields(event.nativeEvent.text,'buyersfee', '')}
											
											keyboardType="numeric" style={Styles.width100} onChangeText={(value) => this.setState({buyersfee: this.onChange(value)})} value={this.delimitNumbers(this.state.buyersfee)} underlineColorAndroid='transparent'/>
										</View>
										<View style={[Styles.fullunderline, ]}></View>
									</View>
								</View> 
								<View style={[Styles.fullunderline, {marginTop:10}]}></View>
								<View style={[{marginTop:20}]}></View>
							</ScrollView>
						</View>
					</View>
				)}
				<View style={Styles.Footer}>
					<View style={Styles.footer_icon_container}>
						<TouchableOpacity style={CustomStyle.back_icon_parent} onPress={() => this.changeFooterTab('seller')}>
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
						<TouchableOpacity style={CustomStyle.back_icon_parent} onPress={() => this.changeFooterTab('closing_cost')}>
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
								<TouchableOpacity style={CustomStyle.back_icon_parent} onPress={() => this.changeFooterTab('other_costs')} >
									<Image style={Styles.footer_icon} source={Images.other_costs_unselected}/>        
								</TouchableOpacity>
							)}
							{renderIf(this.state.footer_tab == 'other_costs')(
							<TouchableOpacity style={CustomStyle.back_icon_parent} onPress={() => this.changeFooterTab('other_costs')} >
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
				<View style={BuyerStyle.HeaderContainer}>
					<Image style={BuyerStyle.HeaderBackground} source={Images.header_background}></Image>
					<TouchableOpacity style={{width:'20%', justifyContent:'center'}} onPress={() => {this.setModalVisible(!this.state.modalVisible)}}>
					<Text style={[BuyerStyle.headerbtnText]}>{STRINGS.t('Cancel')}</Text>
					</TouchableOpacity>
					<Text style={BuyerStyle.header_title}>{STRINGS.t('Net_First')}</Text>
				</View>
				<View style={{marginTop: 5,marginBottom:80}}>
					<View style={BuyerStyle.listcontainer}>
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
				visible={this.state.emailModalVisible}
				onRequestClose={() => {alert("Modal has been closed.")}}
			>
				<ScrollView scrollEnabled={true} showsVerticalScrollIndicator={true}  keyboardShouldPersistTaps="always" keyboardDismissMode='on-drag'>
				<View style={SellerStyle.HeaderContainer}>
						<Image style={SellerStyle.HeaderBackground} source={Images.header_background}></Image>
						<TouchableOpacity style={{width:'20%', justifyContent:'center'}} onPress={() => {this.setEmailModalVisible(!this.state.emailModalVisible)}}>
						<Text style={[SellerStyle.headerbtnText]}>{STRINGS.t('Cancel')}</Text>
						</TouchableOpacity>
						<Text style={SellerStyle.header_title}>{STRINGS.t('Email')}</Text>
						<TouchableOpacity style={{width:'20%', justifyContent:'center'}} onPress={() => {this.sendEmail()}}>
							<Text style={[SellerStyle.headerbtnText,{alignSelf:'flex-end'}]}>{STRINGS.t('EmailSend')}</Text>
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
									<TextInput selectTextOnFocus={ true } keyboardType="email-address" underlineColorAndroid='transparent' style={{width: '100%'}} onChangeText={(value) => this.setState({to_email: value, to_email_default : value})} value={this.state.to_email.toString()}/>
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
							<TouchableOpacity style={BuyerStyle.buttonContainer} onPress={ () => {this.popupDialog.dismiss()}}>
								<Text style={BuyerStyle.style_btnLogin}> {STRINGS.t('Cancel')}</Text>
							</TouchableOpacity>	
						</View>	
					)}    
					{renderIf(this.state.popupAttachmentType == 'video')(
						<View style={{flex: 1, flexDirection: 'column',justifyContent: 'space-between'}}>
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

			
			<PopupDialog dialogTitle={<View style={SellerStyle.dialogtitle}><Text style={SellerStyle.dialogtitletext}>Please select print format</Text></View>} dialogStyle={{width:'80%'}}  containerStyle={{elevation:10}} ref={(popupDialog) => { this.popupDialog = popupDialog; }}>			

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
					<TouchableOpacity style={BuyerStyle.buttonContainer} onPress={ () => {this.popupDialog.dismiss()}}>
						<Text style={BuyerStyle.style_btnLogin}> {STRINGS.t('Cancel')}</Text>
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
					<TouchableOpacity style={BuyerStyle.buttonContainer} onPress={ () => {this.popupDialog.dismiss()}}>
						<Text style={BuyerStyle.style_btnLogin}> {STRINGS.t('Cancel')}</Text>
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
					<TouchableOpacity style={BuyerStyle.buttonContainer} onPress={ () => {this.popupDialog.dismiss()}}>
						<Text style={BuyerStyle.style_btnLogin}> {STRINGS.t('Cancel')}</Text>
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
					<TextInput ref="newEmailAddress" selectTextOnFocus={ true }  style={SellerStyle.inputFieldsDesignLayout} placeholderTextColor={this.state.newEmailAddressError == "" ? "#999999": "red"} placeholder={this.state.newEmailAddressError == "" ? STRINGS.t('email_address') : this.state.newEmailAddressError} underlineColorAndroid='transparent'	onChangeText={(value) => this.setState({newEmailAddress: value})} keyboardType="email-address" value={this.state.newEmailAddress} />
				</View>

				<View style={SellerStyle.contactAddressModalInputField}>
					<TextInput keyboardType="phone-pad" onChangeText={(value) => this.setState({contact_number: this.onChange(value)})}  onEndEditing={ (event) => this.updatePhoneNumberFormat(event.nativeEvent.text) } value={this.state.contact_number} selectTextOnFocus={ true }  style={SellerStyle.inputFieldsDesignLayout} placeholder='Contact Number' underlineColorAndroid='transparent'/>
				</View>	
				<View style={SellerStyle.ContactFormButtonMainView}>
					<TouchableOpacity style={SellerStyle.ContactFormButtonDesign} onPress={this.onSaveNewContactAddress.bind(this)}>
						<Text style={BuyerStyle.style_btnLogin}> {STRINGS.t('Save')} </Text>
					</TouchableOpacity>
					<TouchableOpacity style={SellerStyle.ContactFormButtonDesign} onPress={this.popupHideAddEmailAddress.bind(this, 'dont_save')}>
						<Text style={BuyerStyle.style_btnLogin}> {STRINGS.t('Dont_Save')}</Text>
					</TouchableOpacity>						
				</View>		
			</View>
			

			</PopupDialog>	


			<DropdownAlert
				ref={(ref) => this.dropdown = ref}
				onClose={data => this.onClose(data)}
				/>
				<View style={BuyerStyle.iphonexFooter}></View>
				
		</View>
		} else {
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
				// 		<TouchableOpacity style={{width:'10%',height:50}} onPress={this.onBackHomePress.bind(this)}>
				// 			<Image style={Styles.landscapeBack_icon} source={Images.back_icon}/>
				// 		</TouchableOpacity>
				// 		<TouchableOpacity style={{width:'20%'}}  onPress={this.onBuyerPress.bind(this)}>
				// 			<View style={Styles.landscapesubheading}>
				// 				<Text style={Styles.landscapesubheadingtext}>{STRINGS.t('Buyers')}</Text>
				// 			</View>
				// 		</TouchableOpacity>
				// 		<TouchableOpacity style={{width:'20%'}} onPress={this.onSellerPress.bind(this)}>
				// 			<View style={Styles.landscapesubheading}>
				// 				<Text style={Styles.landscapesubheadingtext}>{STRINGS.t('Sellers')}</Text>
				// 			</View>
				// 		</TouchableOpacity>
				// 		<TouchableOpacity style={{width:'20%'}}>
				// 			<View style={[Styles.landscapesubheading, Styles.blueheadlandscape]}>
				// 				<Text style={Styles.landscapesubheadingtext}>{STRINGS.t('Netfirst')}</Text>
				// 			</View>
				// 		</TouchableOpacity>
				// 		<TouchableOpacity style={{width:'20%'}} onPress={this.onRefinancePress.bind(this)}>
				// 			<View style={Styles.landscapesubheading}>
				// 				<Text style={Styles.landscapesubheadingtext}>{STRINGS.t('Refinance')}</Text>
				// 			</View>
				// 		</TouchableOpacity>
				// 		<ThemeProvider uiTheme={uiTheme}>
				// 			<Toolbar
				// 				centerElement="With menu"
				// 				rightElement={{
				// 					menu: { labels: this.state.toolbarActions },
				// 				}}
				// 				onRightElementPress={this.onActionSelected.bind(this)}
				// 			/>
				// 		</ThemeProvider>
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
				// 					<Text style={Styles.landscapetitleText}>{STRINGS.t('Netfirst')}</Text>
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
				// 								<TextInput onFocus={() => this.onFocus('conventionalLoan')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
				// 								</View>									
				// 							</View>																						
				// 							<View style={Styles.landscapefieldcontainer}>	
				// 								<Text style={Styles.landscapefieldlabelbold}>{STRINGS.t('Prepared_For')}</Text>	
				// 								<View style={Styles.landscapefieldvaluebox}>
				// 								<TextInput onFocus={() => this.onFocus('conventionalLoan')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
				// 								</View>									
				// 							</View>																						
				// 							<View style={Styles.landscapefieldcontainer}>	
				// 								<Text style={Styles.landscapefieldlabelbold}>{STRINGS.t('Address')}</Text>	
				// 								<View style={Styles.landscapefieldvaluebox}>
				// 								<TextInput onFocus={() => this.onFocus('conventionalLoan')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
				// 								</View>									
				// 							</View>																						
				// 							<View style={Styles.landscapefieldcontainer}>	
				// 								<Text style={Styles.landscapefieldlabelbold}>{STRINGS.t('City')}</Text>	
				// 								<View style={Styles.landscapefieldvaluebox}>
				// 								<TextInput onFocus={() => this.onFocus('conventionalLoan')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
				// 								</View>									
				// 							</View>	
				// 							<View style={Styles.landscapehalfsizefield}>
				// 								<View style={Styles.landscapefieldhalfcontainer}>	
				// 									<Text style={Styles.landscapefieldlabelbold}>{STRINGS.t('State')}</Text>	
				// 									<View style={Styles.landscapefieldvaluebox}>
				// 									<TextInput onFocus={() => this.onFocus('conventionalLoan')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
				// 									</View>									
				// 								</View>	
				// 								<View style={Styles.landscapefieldhalfcontainer}>	
				// 									<Text style={[Styles.landscapefieldlabelbold, {textAlign:'center'}]}>{STRINGS.t('Zip')}</Text>	
				// 									<View style={Styles.landscapefieldvaluebox}>
				// 									<TextInput onFocus={() => this.onFocus('conventionalLoan')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
				// 									</View>									
				// 								</View>		
				// 							</View>									
				// 						</View>
				// 						<View style={Styles.landscapedataBoxHeading}>
				// 							<Text style={Styles.landscapedataboxheadingtext}>{STRINGS.t('Seller_Must_Net_Loan_Info')}</Text>
				// 						</View>
				// 						<View style={Styles.landscapedataBox}>																						
				// 							<View style={Styles.landscapefieldcontainer}>	
				// 								<Text style={Styles.landscapefieldlabelbold}>{STRINGS.t('Seller_Must_Net')}</Text>	
				// 								<View style={Styles.landscapefieldvaluebox}>
				// 								<TextInput onFocus={() => this.onFocus('conventionalLoan')} selectTextOnFocus={ true } placeholder='0.00' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
				// 								</View>									
				// 							</View>																						
				// 							<View style={Styles.landscapefieldcontainer}>	
				// 								<Text style={Styles.landscapefieldlabel}>{STRINGS.t('Buyer_Loan_Type')}</Text>	
				// 								<View style={Styles.landscapefieldvaluebox}>
				// 								<TextInput onFocus={() => this.onFocus('conventionalLoan')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
				// 								</View>									
				// 							</View>																						
				// 							<View style={Styles.landscapefieldcontainer}>	
				// 								<Text style={Styles.landscapefieldlabel}>{STRINGS.t('conventional')}</Text>
				// 								<Text style={Styles.landscape20percenttext}>%</Text>	
				// 								<View style={Styles.landscapefieldvaluesmallbox}>
				// 								<TextInput onFocus={() => this.onFocus('conventionalLoan')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
				// 								</View>									
				// 							</View>																						
				// 							<View style={Styles.landscapefieldcontainer}>	
				// 								<Text style={Styles.landscapefieldlabel}>{STRINGS.t('Est_Settlement_Date')}</Text>	
				// 								<Text style={Styles.landscape20percenttext}></Text>
				// 								<View style={Styles.landscapefieldvaluesmallbox}>
				// 									<DatePicker style={Styles.landscapefielddateval} showIcon={false} date={this.state.date} mode="date" placeholder="select date" format="YYYY-MM-DD" minDate={this.state.date} confirmBtnText="Confirm" cancelBtnText="Cancel" customStyles={{dateInput: {borderWidth:0, fontSize: 12}}} onDateChange={(date) => this.changeDate(date)} />
				// 								</View>									
				// 							</View>	
				// 							<View style={[Styles.fullunderline, {marginTop:10}]}></View>
				// 							<Text style={[Styles.landscapetexthead, {marginTop:5}]}>{STRINGS.t('LoansToBePaid')}</Text>	
				// 							<View style={[Styles.fullunderline, {marginTop:5}]}></View>	
				// 							<View style={Styles.landscapefieldcontainer}>
				// 								<View style={Styles.landscapetriplefieldlabel}>
				// 								</View>
				// 								<View style={{width:'5%'}}></View>	
				// 								<Text style={Styles.landscapebalancerate}>{STRINGS.t('balance')}</Text>
				// 								<View style={{width:'5%'}}></View>	
				// 								<Text style={Styles.landscapebalancerate}>{STRINGS.t('rate')}</Text>	
				// 							</View>
				// 							<View style={Styles.landscapefieldcontainer}>
				// 								<View style={Styles.landscapetriplefieldlabel}>
				// 									<Text style={Styles.landscapenormalfulltext}>{STRINGS.t('existingfirst')}:</Text>
				// 								</View>	
				// 								<Text style={[Styles.landscapefieldval,{width:'5%'}]}>$</Text>	
				// 								<TextInput onFocus={() => this.onFocus('conventionalLoan')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapetriplefieldval} underlineColorAndroid='transparent'/>
				// 								<Text style={[Styles.landscapefieldval,{width:'5%'}]}>%</Text>	
				// 								<TextInput onFocus={() => this.onFocus('conventionalLoan')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapetriplefieldval} underlineColorAndroid='transparent'/>	
				// 							</View>	
				// 							<View style={Styles.landscapefieldcontainer}>
				// 								<View style={Styles.landscapetriplefieldlabel}>
				// 									<Text style={Styles.landscapenormalfulltext}>{STRINGS.t('existingsecond')}:</Text>
				// 								</View>	
				// 								<Text style={[Styles.landscapefieldval,{width:'5%'}]}>$</Text>	
				// 								<TextInput onFocus={() => this.onFocus('conventionalLoan')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapetriplefieldval} underlineColorAndroid='transparent'/>
				// 								<Text style={[Styles.landscapefieldval,{width:'5%'}]}>%</Text>	
				// 								<TextInput onFocus={() => this.onFocus('conventionalLoan')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapetriplefieldval} underlineColorAndroid='transparent'/>	
				// 							</View>	
				// 							<View style={Styles.landscapefieldcontainer}>
				// 								<View style={Styles.landscapetriplefieldlabel}>
				// 									<Text style={Styles.landscapenormalfulltext}>{STRINGS.t('Other')}:</Text>
				// 								</View>	
				// 								<Text style={[Styles.landscapefieldval,{width:'5%'}]}>$</Text>	
				// 								<TextInput onFocus={() => this.onFocus('conventionalLoan')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapetriplefieldval} underlineColorAndroid='transparent'/>
				// 								<Text style={[Styles.landscapefieldval,{width:'5%'}]}>%</Text>	
				// 								<TextInput onFocus={() => this.onFocus('conventionalLoan')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapetriplefieldval} underlineColorAndroid='transparent'/>	
				// 							</View>	
				// 							<View style={[Styles.fullunderline, {marginTop:10}]}></View>
				// 							<View style={Styles.landscapehalfsizefield}>
				// 								<Text style={[Styles.landscapetexthead, {marginTop:5,width:'70%'}]}>{STRINGS.t('total')}</Text>
				// 								<Text style={[Styles.landscapetexthead, {marginTop:5}]}>0.00</Text>	
				// 							</View>
				// 							<View style={[Styles.fullunderline, {marginTop:5}]}></View>																					
				// 							<View style={Styles.landscapefieldcontainer}>	
				// 								<Text style={Styles.landscapefieldlabel}>{STRINGS.t('annual_prop_tax')}</Text>
				// 								<Text style={Styles.landscape20percenttext}></Text>	
				// 								<View style={Styles.landscapefieldvaluesmallbox}>
				// 								<TextInput onFocus={() => this.onFocus('conventionalLoan')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
				// 								</View>									
				// 							</View>								
				// 						</View>
				// 					</View>
				// 					<View style={[Styles.landscapecontentBoxes, {marginBottom:40}]}>
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
				// 								<TextInput onFocus={() => this.onFocus('conventionalLoan')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
				// 								</View>									
				// 							</View>																								
				// 							<View style={Styles.landscapefieldcontainer}>	
				// 								<Text style={Styles.landscapefieldlabel}>{STRINGS.t('Owners_Title_Policy')}</Text>
				// 								<View style={Styles.landscapedropdowncontainer}>
				// 									<Text style={Styles.landscapedropdowntext}>{STRINGS.t('Split')}</Text>
				// 									<Text style={Styles.landscapedropdownnexttext}>$</Text>
				// 								</View>	
				// 								<View style={Styles.landscapefieldvaluesmallbox}>
				// 								<TextInput onFocus={() => this.onFocus('conventionalLoan')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
				// 								</View>									
				// 							</View>																													
				// 							<View style={Styles.landscapefieldcontainer}>	
				// 								<Text style={Styles.landscapefieldlabel}>{STRINGS.t('Lenders_Title_Policy')}</Text>
				// 								<View style={Styles.landscapedropdowncontainer}>
				// 									<Text style={Styles.landscapedropdowntext}>{STRINGS.t('Split')}</Text>
				// 									<Text style={Styles.landscapedropdownnexttext}>$</Text>
				// 								</View>	
				// 								<View style={Styles.landscapefieldvaluesmallbox}>
				// 								<TextInput onFocus={() => this.onFocus('conventionalLoan')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
				// 								</View>									
				// 							</View>																					
				// 							<View style={Styles.landscapefieldcontainer}>	
				// 								<Text style={Styles.landscapefieldlabel}>{STRINGS.t('drawingDeed')}</Text>
				// 								<Text style={Styles.landscape20percenttext}>$</Text>	
				// 								<View style={Styles.landscapefieldvaluesmallbox}>
				// 								<TextInput onFocus={() => this.onFocus('conventionalLoan')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
				// 								</View>									
				// 							</View>																												
				// 							<View style={Styles.landscapefieldcontainer}>	
				// 								<Text style={Styles.landscapefieldlabel}>{STRINGS.t('notary')}</Text>
				// 								<Text style={Styles.landscape20percenttext}>$</Text>	
				// 								<View style={Styles.landscapefieldvaluesmallbox}>
				// 								<TextInput onFocus={() => this.onFocus('conventionalLoan')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
				// 								</View>									
				// 							</View>																												
				// 							<View style={Styles.landscapefieldcontainer}>	
				// 								<Text style={Styles.landscapefieldlabel}>{STRINGS.t('transfer_tax')}</Text>
				// 								<Text style={Styles.landscape20percenttext}>$</Text>	
				// 								<View style={Styles.landscapefieldvaluesmallbox}>
				// 								<TextInput onFocus={() => this.onFocus('conventionalLoan')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
				// 								</View>									
				// 							</View>																												
				// 							<View style={Styles.landscapefieldcontainer}>	
				// 								<Text style={Styles.landscapefieldlabel}>{STRINGS.t('prepayment_penality')}</Text>
				// 								<Text style={Styles.landscape20percenttext}>$</Text>	
				// 								<View style={Styles.landscapefieldvaluesmallbox}>
				// 								<TextInput onFocus={() => this.onFocus('conventionalLoan')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
				// 								</View>									
				// 							</View>																												
				// 							<View style={Styles.landscapefieldcontainer}>	
				// 								<Text style={Styles.landscapefieldlabel}>{STRINGS.t('reconveynce_fees')}</Text>
				// 								<Text style={Styles.landscape20percenttext}>$</Text>	
				// 								<View style={Styles.landscapefieldvaluesmallbox}>
				// 								<TextInput onFocus={() => this.onFocus('conventionalLoan')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
				// 								</View>									
				// 							</View>																												
				// 							<View style={Styles.landscapefieldcontainer}>	
				// 								<Text style={Styles.landscapefieldlabel}>{STRINGS.t('pest_control_report')}</Text>
				// 								<Text style={Styles.landscape20percenttext}>$</Text>	
				// 								<View style={Styles.landscapefieldvaluesmallbox}>
				// 								<TextInput onFocus={() => this.onFocus('conventionalLoan')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
				// 								</View>									
				// 							</View>																					
				// 							<View style={Styles.landscapefieldcontainer}>	
				// 								<Text style={Styles.landscapefieldlabel}>{STRINGS.t('Benift_Demand_Statement')}</Text>
				// 								<Text style={Styles.landscape20percenttext}>$</Text>	
				// 								<View style={Styles.landscapefieldvaluesmallbox}>
				// 								<TextInput onFocus={() => this.onFocus('conventionalLoan')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
				// 								</View>									
				// 							</View>												
				// 							<View style={Styles.landscapefieldcontainer}>
				// 								<View style={Styles.landscapetriplefieldlabel}>
				// 									<Text style={Styles.landscapenormalfulltext}>{STRINGS.t('brokerage_fees')}</Text>
				// 								</View>	
				// 								<Text style={[Styles.landscapefieldval,{width:'5%'}]}>%</Text>	
				// 								<TextInput onFocus={() => this.onFocus('conventionalLoan')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapetriplefieldval} underlineColorAndroid='transparent'/>
				// 								<Text style={[Styles.landscapefieldval,{width:'5%'}]}>$</Text>	
				// 								<TextInput onFocus={() => this.onFocus('conventionalLoan')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapetriplefieldval} underlineColorAndroid='transparent'/>	
				// 							</View>																				
				// 							<View style={Styles.landscapefieldcontainer}>	
				// 								<Text style={[Styles.landscapefieldval,{width:'5%'}]}>%</Text>
				// 								<TextInput onFocus={() => this.onFocus('conventionalLoan')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={[Styles.landscapetriplefieldval,{width:'20%'}]} underlineColorAndroid='transparent'/>
				// 								<Text style={Styles.landscape40percenttext}>  {STRINGS.t('days_interest')}</Text>	
				// 								<Text style={[Styles.landscapefieldval,{width:'5%'}]}>$</Text>	
				// 								<View style={Styles.landscapefieldvaluesmallbox}>
				// 								<Text style={Styles.landscapefieldval}>0.00</Text>
				// 								</View>									
				// 							</View>																					
				// 							<View style={Styles.landscapefieldcontainer}>	
				// 								<Text style={Styles.landscapefieldlabel}>{STRINGS.t('recordingfee')}</Text>
				// 								<Text style={Styles.landscape20percenttext}>$</Text>	
				// 								<View style={Styles.landscapefieldvaluesmallbox}>
				// 								<TextInput onFocus={() => this.onFocus('conventionalLoan')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
				// 								</View>									
				// 							</View>																				
				// 							<View style={Styles.landscapefieldcontainer}>	
				// 								<Text style={Styles.landscapefieldlabel}>{STRINGS.t('homeWarranty')}</Text>
				// 								<Text style={Styles.landscape20percenttext}>$</Text>	
				// 								<View style={Styles.landscapefieldvaluesmallbox}>
				// 								<TextInput onFocus={() => this.onFocus('conventionalLoan')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
				// 								</View>									
				// 							</View>																				
				// 							<View style={Styles.landscapefieldcontainer}>	
				// 								<Text style={Styles.landscapefieldlabel}>{STRINGS.t('processServiceFee')}</Text>
				// 								<Text style={Styles.landscape20percenttext}>$</Text>	
				// 								<View style={Styles.landscapefieldvaluesmallbox}>
				// 								<TextInput onFocus={() => this.onFocus('conventionalLoan')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
				// 								</View>									
				// 							</View>																				
				// 							<View style={Styles.landscapefieldcontainer}>	
				// 								<Text style={Styles.landscapefieldlabel}>{STRINGS.t('sellerContribution')}</Text>
				// 								<Text style={Styles.landscape20percenttext}>$</Text>	
				// 								<View style={Styles.landscapefieldvaluesmallbox}>
				// 								<TextInput onFocus={() => this.onFocus('conventionalLoan')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
				// 								</View>									
				// 							</View>																				
				// 							<View style={Styles.landscapefieldcontainer}>	
				// 								<Text style={Styles.landscapefieldlabel}>{STRINGS.t('taxesDue')} </Text>
				// 								<Text style={Styles.landscape20percenttext}>$</Text>	
				// 								<View style={Styles.landscapefieldvaluesmallbox}>
				// 								<TextInput onFocus={() => this.onFocus('conventionalLoan')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
				// 								</View>									
				// 							</View>																				
				// 							<View style={Styles.landscapefieldcontainer}>	
				// 								<Text style={Styles.landscapefieldlabel}>{STRINGS.t('other')}</Text>
				// 								<Text style={Styles.landscape20percenttext}>$</Text>	
				// 								<View style={Styles.landscapefieldvaluesmallbox}>
				// 								<TextInput onFocus={() => this.onFocus('conventionalLoan')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
				// 								</View>									
				// 							</View>																				
				// 							<View style={Styles.landscapefieldcontainer}>	
				// 								<Text style={Styles.landscapefieldlabel}>{STRINGS.t('other')}</Text>
				// 								<Text style={Styles.landscape20percenttext}>$</Text>	
				// 								<View style={Styles.landscapefieldvaluesmallbox}>
				// 								<TextInput onFocus={() => this.onFocus('conventionalLoan')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
				// 								</View>									
				// 							</View>																				
				// 							<View style={Styles.landscapefieldcontainer}>	
				// 								<Text style={Styles.landscapefieldlabel}>{STRINGS.t('other')}</Text>
				// 								<Text style={Styles.landscape20percenttext}>$</Text>	
				// 								<View style={Styles.landscapefieldvaluesmallbox}>
				// 								<TextInput onFocus={() => this.onFocus('conventionalLoan')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
				// 								</View>									
				// 							</View>																				
				// 							<View style={Styles.landscapefieldcontainer}>	
				// 								<Text style={Styles.landscapefieldlabel}>{STRINGS.t('other')}</Text>
				// 								<Text style={Styles.landscape20percenttext}>$</Text>	
				// 								<View style={Styles.landscapefieldvaluesmallbox}>
				// 								<TextInput onFocus={() => this.onFocus('conventionalLoan')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
				// 								</View>									
				// 							</View>																				
				// 							<View style={Styles.landscapefieldcontainer}>	
				// 								<Text style={Styles.landscapefieldlabel}>{STRINGS.t('other')}</Text>
				// 								<Text style={Styles.landscape20percenttext}>$</Text>	
				// 								<View style={Styles.landscapefieldvaluesmallbox}>
				// 								<TextInput onFocus={() => this.onFocus('conventionalLoan')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
				// 								</View>									
				// 							</View>	
				// 							<View style={[Styles.fullunderline, {marginTop:10}]}></View>
				// 							<View style={Styles.landscapehalfsizefield}>
				// 								<Text style={[Styles.landscapetexthead, {marginTop:5,width:'70%'}]}>{STRINGS.t('Total_Closing_Cost')}</Text>
				// 								<Text style={[Styles.landscapetexthead, {marginTop:5,textAlign:'right'}]}>$ 0.00</Text>	
				// 							</View>
				// 							<View style={[Styles.fullunderline, {marginTop:5}]}></View>																													
				// 						</View>
				// 					</View>
				// 					<View style={Styles.landscapecontentBoxes}>
				// 						<View style={Styles.landscapedataBoxHeading}>
				// 							<Text style={Styles.landscapedataboxheadingtext}>{STRINGS.t('Other_Costs')}</Text>
				// 						</View>
				// 						<View style={Styles.landscapedataBox}>
				// 							<View style={Styles.landscapefieldcontainer}>
				// 								<View style={Styles.landscapetriplefieldlabel}>
				// 									<Text style={Styles.landscapenormalfulltext}>{STRINGS.t('Discount')}</Text>
				// 								</View>	
				// 								<Text style={[Styles.landscapefieldval,{width:'5%'}]}>%</Text>	
				// 								<TextInput onFocus={() => this.onFocus('conventionalLoan')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapetriplefieldval} underlineColorAndroid='transparent'/>
				// 								<Text style={[Styles.landscapefieldval,{width:'5%'}]}>$</Text>	
				// 								<TextInput onFocus={() => this.onFocus('conventionalLoan')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapetriplefieldval} underlineColorAndroid='transparent'/>	
				// 							</View>																				
				// 							<View style={Styles.landscapefieldcontainer}>	
				// 								<Text style={Styles.landscapefieldlabel}>{STRINGS.t('Appraisal')}</Text>
				// 								<Text style={Styles.landscape20percenttext}>$</Text>	
				// 								<View style={Styles.landscapefieldvaluesmallbox}>
				// 								<TextInput onFocus={() => this.onFocus('conventionalLoan')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
				// 								</View>									
				// 							</View>																				
				// 							<View style={Styles.landscapefieldcontainer}>	
				// 								<Text style={Styles.landscapefieldlabel}>{STRINGS.t('Document_Preparation')}</Text>
				// 								<Text style={Styles.landscape20percenttext}>$</Text>	
				// 								<View style={Styles.landscapefieldvaluesmallbox}>
				// 								<TextInput onFocus={() => this.onFocus('conventionalLoan')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
				// 								</View>									
				// 							</View>																				
				// 							<View style={Styles.landscapefieldcontainer}>	
				// 								<Text style={Styles.landscapefieldlabel}>{STRINGS.t('Tax_Service_Contract')}</Text>
				// 								<Text style={Styles.landscape20percenttext}>$</Text>	
				// 								<View style={Styles.landscapefieldvaluesmallbox}>
				// 								<TextInput onFocus={() => this.onFocus('conventionalLoan')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
				// 								</View>									
				// 							</View>																				
				// 							<View style={Styles.landscapefieldcontainer}>	
				// 								<Text style={Styles.landscapefieldlabel}>{STRINGS.t('Underwriting')}</Text>
				// 								<Text style={Styles.landscape20percenttext}>$</Text>	
				// 								<View style={Styles.landscapefieldvaluesmallbox}>
				// 								<TextInput onFocus={() => this.onFocus('conventionalLoan')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
				// 								</View>									
				// 							</View>																				
				// 							<View style={Styles.landscapefieldcontainer}>	
				// 								<Text style={Styles.landscapefieldlabel}>{STRINGS.t('Processing_Fee')}</Text>
				// 								<Text style={Styles.landscape20percenttext}>$</Text>	
				// 								<View style={Styles.landscapefieldvaluesmallbox}>
				// 								<TextInput onFocus={() => this.onFocus('conventionalLoan')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
				// 								</View>									
				// 							</View>																				
				// 							<View style={Styles.landscapefieldcontainer}>	
				// 								<Text style={Styles.landscapefieldlabel}>{STRINGS.t('Corrective_Work')}</Text>
				// 								<Text style={Styles.landscape20percenttext}>$</Text>	
				// 								<View style={Styles.landscapefieldvaluesmallbox}>
				// 								<TextInput onFocus={() => this.onFocus('conventionalLoan')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
				// 								</View>									
				// 							</View>																				
				// 							<View style={Styles.landscapefieldcontainer}>	
				// 								<Text style={Styles.landscapefieldlabel}>{STRINGS.t('Buyersfees')}</Text>
				// 								<Text style={Styles.landscape20percenttext}>$</Text>	
				// 								<View style={Styles.landscapefieldvaluesmallbox}>
				// 								<TextInput onFocus={() => this.onFocus('conventionalLoan')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
				// 								</View>									
				// 							</View>
				// 							<View style={Styles.landscapehalfsizefield}>
				// 								<Text style={[Styles.landscapetexthead, {marginTop:5,width:'70%'}]}>{STRINGS.t('Total_Other_Cost')}</Text>
				// 								<Text style={[Styles.landscapetexthead, {marginTop:5,textAlign:'right'}]}>$ 0.00</Text>	
				// 							</View>												
				// 						</View>
				// 						<View style={Styles.landscapedataBoxHeading}>
				// 							<Text style={Styles.landscapedataboxheadingtext}>{STRINGS.t('total')}</Text>
				// 						</View>
				// 						<View style={Styles.landscapedataBox}>
				// 							<View style={Styles.landscapehalfsizefield}>
				// 								<Text style={[Styles.landscapetexthead, {marginTop:5,width:'70%'}]}>{STRINGS.t('totalallcosts')}</Text>
				// 								<Text style={[Styles.landscapetexthead, {marginTop:5,textAlign:'right'}]}>$ 0.00</Text>	
				// 							</View>																		
				// 							<View style={Styles.landscapefieldcontainer}>	
				// 								<Text style={Styles.landscapefieldlabel}>{STRINGS.t('est_tax_proration')}</Text>
				// 								<Text style={Styles.landscape20percenttext}>$</Text>	
				// 								<View style={Styles.landscapefieldvaluesmallbox}>
				// 								<TextInput onFocus={() => this.onFocus('conventionalLoan')} selectTextOnFocus={ true } placeholder='John Ace' keyboardType="numeric" style={Styles.landscapefieldval} underlineColorAndroid='transparent'/>	
				// 								</View>									
				// 							</View>
				// 							<View style={Styles.landscapehalfsizefield}>
				// 								<Text style={[Styles.landscapetexthead, {marginTop:5,width:'70%'}]}>{STRINGS.t('Est_Seller_Net')}</Text>
				// 								<Text style={[Styles.landscapetexthead, {marginTop:5,textAlign:'right'}]}>$ 0.00</Text>	
				// 							</View>											
				// 						</View>
				// 					</View>
				// 				</View>
				// 			</ScrollView>
				// 		</View>
				// 	</View>
				// </View>)
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
  
  // you can set your style right here, it'll be propagated to application
  const uiTheme = {
      toolbar: {
          container: {
              backgroundColor: 'transparent',
          },
      },
  };
