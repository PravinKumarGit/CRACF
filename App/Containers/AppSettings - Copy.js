import React, { Component } from 'react';
import {Container, Left, Right, Icon, Title, Body, Button}  from 'native-base';
import {Image, View, Dimensions, Alert, Text, TextInput, TouchableOpacity, ScrollView, AsyncStorage, FlatList, BackHandler} from 'react-native';
import Images from '../Themes/Images.js';
import Styles from './Styles/AppSettingsStyle';
import { CheckBox } from 'react-native-elements';
import CustomStyle from './Styles/CustomStyle';
import renderIf from 'render-if';
import {callGetApi, callPostApi} from '../Services/webApiHandler.js' // Import 
import STRINGS from '../GlobalString/StringData'  // Import StringData.js class for string localization.
import Picker from 'react-native-picker';
import DatePicker from 'react-native-datepicker';
import Toast from 'react-native-simple-toast';
import Spinner from 'react-native-loading-spinner-overlay'; 
var GLOBAL = require('../Constants/global');
import Selectbox from 'react-native-selectbox';
const  {width, height} = Dimensions.get('window')
import {authenticateUser} from '../Services/CommonValidation.js'  // Import CommonValidation class to access common methods for validations.
import DropdownAlert from 'react-native-dropdownalert'
import ModalDropdown from 'react-native-modal-dropdown';

export default class AppSettings extends Component{
	constructor() {
        super();
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.state = {
            tabarray : ['Seller Costs','FHA/VA/USDA Loans','Buyer Costs','Refinance Costs', 'Conventional Loans','CDTC/TRID', 'Loan Comparison'],
            dropdownval:'Seller Costs',
            editable:false,
            cdtc:false,
            cfpb:false,
            apiCallObj:{},
            access_token: '',
            sellerUserSetting:{},
            sellerUserSettingCost:{},
            conventionalsettings:{},
            fhaVaUsdaSettings:{},
            buyerUserSetting:{},
            buyerUserSettingCost:{},
            buyerUserSettingMonthExp:{},
            RefinanceSettings:{},
            refinanceUserSettingCost:{},
            CdtcTridLoanComparisonSetting:{},
            loanComparison:'',

            //Seller Costs
            sellerList: {},


            //VA/FHA/USDA
            FHA_DocumentPreparation: '',
            FHA_TaxServiceContract: '',
            FHA_Underwriting: '',
            FHA_ProcessingFee: '',
            FHA_AppraisalFee: '',
            FHA_OriginationFactor: '',
            VA_DocumentPreparation: '',
            VA_TaxServiceContract: '',
            VA_Underwriting: '',
            VA_ProcessingFee: '',
            VA_AppraisalFee: '',
            VA_OriginationFactor: '',
            USDA_DocumentPreparation: '',
            USDA_TaxServiceContract: '',
            USDA_Underwriting: '',
            USDA_ProcessingFee: '',
            USDA_AppraisalFee: '',
            USDA_OriginationFactor: '',
			FHA_OriginationFactorType: '',
			VA_OriginationFactorType: '',
			USDA_OriginationFactorType: '',

            //Buyer Costs
            BuyerMonthlyList:{},
            BuyerList:{},

            //Refinance Costs

            refinanceList : {},

            //Other Escroq
            otherEscrow : {},
            otherEscrowapply : 0,
			animating: false,
			scrollvalue : false,
            //Commisions
            optiontoggle : 'traditional',
            CommissionSetting : {},
			animating: false,
        }
    }


    componentWillMount(){
    }

    async componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
		response = await authenticateUser();
		if(response == '1'){
			this.props.navigator.push({name: 'Login', index: 0 });
		}else{
			this.setState({animating:'true'});
			this.getAccessToken();
		}
    }

    componentWillUnmount() {
		
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
	}

	handleBackButtonClick() {
		//this.props.navigation.goBack(null);
		this.props.navigator.push({name: 'Dashboard', index: 0 });
		return true;
	}


    restoreConfirmation() {
        // alert box added by lovedeep on 04-30-2018
        Alert.alert( 'CostsFirst', 'Are you sure you want to update the settings ?', [ {text: 'No', onPress: () => console.log('Cancel Pressed!')}, {text: 'Yes', onPress: this.restore.bind(this)}] );

    }

    restore(){
		 this.setState({animating: 'true'});
        if(this.state.editable == true){
            this.setState({editable: false});
         }         
         let value = this.state.apiCallObj
         let user_id = value.user_id;
        let zip = value.zip
        let company_id = value.company_id;
        let apiCallObjtemp = {
            "userId":user_id,
            "companyId":company_id,
            "zip":zip
        };

        callPostApi(GLOBAL.BASE_URL + GLOBAL.reload_user_setting, apiCallObjtemp, this.state.access_token)
        .then((response) => {
            // Continue your code here...
            if (result.status == 'success') {   
                let selectedStr = this.state.dropdownval
                if(selectedStr == 'Conventional Loans') {
                this.callGetConventionalSettings();}
                if(selectedStr == 'FHA/VA/USDA Loans') {
                this.callGetFhaVaUsdaSettings();}
                if(selectedStr == 'Buyer Costs') {
                this.callBuyerSettings();}
                if(selectedStr == 'Refinance Costs') {
                this.callRefinanceSettings();}
                if(selectedStr == 'CDTC/TRID' || selectedStr == 'Loan Comparison' || selectedStr == 'Other Escrow'){
                this.callCdtcTridLoanComparisonSettings();}else{this.setState({animating: false})}
				this.dropdown.alertWithType('success', 'Success', result.message);
            }
            else {
				this.setState({animating: false})
				this.dropdown.alertWithType('error', 'Error', result.message);
            }

        });
    }

    getAccessToken(){
        AsyncStorage.getItem("userDetail").then((value) => {value = JSON.parse(value);
            if(value.user_state == "California" || value.user_state == "CA" || value.user_state == "CALIFORNIA")
            this.setState({tabarray:['Seller Costs','FHA/VA/USDA Loans','Buyer Costs','Refinance Costs', 'Conventional Loans', 'Other Escrow','CDTC/TRID', 'Loan Comparison']})
            if(value.user_state == "Ohio" || value.user_state == "OH" || value.user_state == "OHIO")
            this.setState({tabarray:['Seller Costs','FHA/VA/USDA Loans','Buyer Costs','Refinance Costs', 'Conventional Loans', 'Commissions','CDTC/TRID', 'Loan Comparison']})

          //  alert(JSON.stringify(value));
            let user_id = value.user_id;
            let zip_code = value.postal_code
            let company_id = value.company_id;
            let state_id = value.state;
            
            let apiCallObjtemp = {
                "user_id":user_id,
                "company_id":company_id,
                "zip":zip_code,
                "state_id" : state_id
            };
            let access_tokentemp= value.access_token;
            this.setState({apiCallObj: apiCallObjtemp, access_token: access_tokentemp});
            this.callGetSellerCostsSettings(apiCallObjtemp,access_tokentemp);
        }).done();
    }

    callGetSellerCostsSettings(apiCallObj,access_token)
    {   
        callPostApi(GLOBAL.BASE_URL + GLOBAL.Seller_Cost_Setting, apiCallObj, access_token)
        .then((response) => {
            // Continue your code here...
            if (result.status == 'success')
            {
                let sellerUserSettingtemp = result.data.userSetting;
                let sellerUserSettingCosttemp = result.data.userSettingCost;
                let saveobj = {};
                sellerUserSettingCosttemp.map((item) => {
                    saveobj[item.key] = item.fee;
                });
                this.setState({sellerUserSetting: sellerUserSettingtemp, sellerUserSettingCost:sellerUserSettingCosttemp, sellerList:saveobj,animating:false})
            }
            else {
				this.setState({animating: false})
				this.dropdown.alertWithType('error', 'Error', result.message);
            }

        });
    }

    callGetFhaVaUsdaSettings()
    {   
        callPostApi(GLOBAL.BASE_URL + GLOBAL.fha_va_usda_common_setting, this.state.apiCallObj, this.state.access_token)
        .then((response) => {
            // Continue your code here...
            if (result.status == 'success')
            {   
                let fhaVaUsdaSettingstemp = result.data;
                this.setState({
                    fhaVaUsdaSettings: fhaVaUsdaSettingstemp,
                    FHA_DocumentPreparation: fhaVaUsdaSettingstemp.FHA_DocumentPreparation,
                    FHA_TaxServiceContract: fhaVaUsdaSettingstemp.FHA_TaxServiceContract,
                    FHA_Underwriting: fhaVaUsdaSettingstemp.FHA_Underwriting,
                    FHA_ProcessingFee: fhaVaUsdaSettingstemp.FHA_ProcessingFee,
                    FHA_AppraisalFee: fhaVaUsdaSettingstemp.FHA_AppraisalFee,
                    FHA_OriginationFactor: fhaVaUsdaSettingstemp.FHA_OriginationFactor,
					FHA_OriginationFactorType: fhaVaUsdaSettingstemp.FHA_OriginationFactorType,
                    VA_DocumentPreparation: fhaVaUsdaSettingstemp.VA_DocumentPreparation,
                    VA_TaxServiceContract: fhaVaUsdaSettingstemp.VA_TaxServiceContract,
                    VA_Underwriting: fhaVaUsdaSettingstemp.VA_Underwriting,
                    VA_ProcessingFee: fhaVaUsdaSettingstemp.VA_ProcessingFee,
                    VA_AppraisalFee: fhaVaUsdaSettingstemp.VA_AppraisalFee,
                    VA_OriginationFactor: fhaVaUsdaSettingstemp.VA_OriginationFactor,
					VA_OriginationFactorType: fhaVaUsdaSettingstemp.VA_OriginationFactorType,
                    USDA_DocumentPreparation: fhaVaUsdaSettingstemp.USDA_DocumentPreparation,
                    USDA_TaxServiceContract: fhaVaUsdaSettingstemp.USDA_TaxServiceContract,
                    USDA_Underwriting: fhaVaUsdaSettingstemp.USDA_Underwriting,
                    USDA_ProcessingFee: fhaVaUsdaSettingstemp.USDA_ProcessingFee,
                    USDA_AppraisalFee: fhaVaUsdaSettingstemp.USDA_AppraisalFee,
                    USDA_OriginationFactorType: fhaVaUsdaSettingstemp.USDA_OriginationFactorType,animating: false
                
                })
            }
            else {
                this.setState({animating: false})
				this.dropdown.alertWithType('error', 'Error', result.message);
            }

        });
    }

    callBuyerSettings()
    {   
        callPostApi(GLOBAL.BASE_URL + GLOBAL.Buyer_Cost_Setting, this.state.apiCallObj, this.state.access_token)
        .then((response) => {
            // Continue your code here...
            if (result.status == 'success')
            {   
                let buyerUserSettingtemp = result.data.userSetting;
                let buyerUserSettingCosttemp = result.data.userSettingCost;
                let buyerUserSettingMonthExptemp = result.data.userSettingMonthExp;
                let saveobj1 = {};
                let saveobj2 = {};
                buyerUserSettingCosttemp.map((item) => {
                    saveobj1[item.key] = item.fee;
                });
                buyerUserSettingMonthExptemp.map((item) => {
                    saveobj2[item.key] = item.fee;
                });
                this.setState({buyerUserSetting: buyerUserSettingtemp, buyerUserSettingCost:buyerUserSettingCosttemp, buyerUserSettingMonthExp: buyerUserSettingMonthExptemp, BuyerMonthlyList: saveobj2, BuyerList: saveobj1 ,animating: false})
            }
            else {
                this.setState({animating: false})
				this.dropdown.alertWithType('error', 'Error', result.message);
            }

        });
    }

    callRefinanceSettings()
    {   
        callPostApi(GLOBAL.BASE_URL + GLOBAL.refinance_setting, this.state.apiCallObj, this.state.access_token)
        .then((response) => {
            // Continue your code here...
            if (result.status == 'success')
            {   
                let RefinanceSettingstemp = result.data.userSetting;
                let refinanceUserSettingCosttemp = result.data.closingCostSetting;
                let saveobj = {};
                refinanceUserSettingCosttemp.map((item) => {
                    saveobj[item.key] = item.fee;
                });
                this.setState({RefinanceSettings: RefinanceSettingstemp, refinanceUserSettingCost: refinanceUserSettingCosttemp, refinanceList : saveobj,animating: false})
                
            }
            else {
                this.setState({animating: false})
				this.dropdown.alertWithType('error', 'Error', result.message);
            }

        });
    }

    callCommissionSettings(option)
    {   apiCallObjtemp = this.state.apiCallObj;
        apiCallObjtemp['option'] = option
        callPostApi(GLOBAL.BASE_URL + GLOBAL.commission_setting, apiCallObjtemp, this.state.access_token)
        .then((response) => {
            // Continue your code here...
            if (result.status == 'success')
            {   
                let CommissionSettingtemp = result.data;
                this.setState({CommissionSetting: CommissionSettingtemp})
            }
            else {
               // this.setState({dropdownval : "Seller Costs"})
               this.setState({animating: false})
				this.dropdown.alertWithType('error', 'Error', result.message);
            }

        });
    }
    
    callGetConventionalSettings()
    {   
        callPostApi(GLOBAL.BASE_URL + GLOBAL.conventional_setting, this.state.apiCallObj, this.state.access_token)
        .then((response) => {


            //alert(JSON.stringify(result));

            // Continue your code here...
            if (result.status == 'success')
            {   
                let conventionalSettingtemp = result.data;
                this.setState({conventionalsettings: conventionalSettingtemp,animating: false})
            }
            else {
				this.setState({animating: false})
				this.dropdown.alertWithType('error', 'Error', result.message);
            }

        });
    }

    callCdtcTridLoanComparisonSettings()
    {   
        callPostApi(GLOBAL.BASE_URL + GLOBAL.TRID_CDTC_Setting, this.state.apiCallObj, this.state.access_token)
        .then((response) => {

            //alert(JSON.stringify(result));
            // Continue your code here...
            if (result.status == 'success')
            {   
                let CdtcTridLoanComparisonSettingtemp = result.data;
                this.setState({otherEscrowapply:CdtcTridLoanComparisonSettingtemp.apply,otherEscrow:CdtcTridLoanComparisonSettingtemp ,CdtcTridLoanComparisonSetting: CdtcTridLoanComparisonSettingtemp, cdtc:CdtcTridLoanComparisonSettingtemp.cdtc, cfpb:CdtcTridLoanComparisonSettingtemp.cfpb, loanComparison:CdtcTridLoanComparisonSettingtemp.loanComparison,animating: false})
            }
            else {
                this.setState({animating: false})
				this.dropdown.alertWithType('error', 'Error', result.message);
            }

        });
    }

    _keyExtractor = (item, index) => item.id;

    ListPicker(){
        let dataArray = this.state.tabarray;
        Picker.init({
		   pickerTitleText: 'Select',
		   pickerConfirmBtnText: 'Confirm',
		   pickerCancelBtnText: 'Cancel',
           pickerData: dataArray,
           selectedValue: [this.state.escrowType],
           onPickerConfirm: (pickedValue) => {
                 if(this.state.editable == true){
                    this.setState({editable: false});
                 }
                 let selectedStr = pickedValue[0];
                 console.log(JSON.stringify(selectedStr));
                 if(selectedStr != "<null>")
                 this.setState({dropdownval: selectedStr});
                 else
                 this.setState({dropdownval: 'Seller Costs'});
                 if(selectedStr == 'Conventional Loans'){
                 this.callGetConventionalSettings();}
                 if(selectedStr == 'FHA/VA/USDA Loans'){
                 this.callGetFhaVaUsdaSettings();}
                 if(selectedStr == 'Buyer Costs'){
                 this.callBuyerSettings();}
                 if(selectedStr == 'Refinance Costs'){
                 this.callRefinanceSettings();}
                 if(selectedStr == 'Commissions'){
                 this.callCommissionSettings("traditional");}
                 if(selectedStr == 'CDTC/TRID' || selectedStr == 'Loan Comparison' || selectedStr == 'Other Escrow'){
                 this.callCdtcTridLoanComparisonSettings();}
           },
           onPickerCancel: data => {
               console.log(data);
           },
           onPickerSelect: data => {
           }
        });
        Picker.show();
    }
	
	onBackButtonPress() {
		this.props.navigator.pop()
    }

    updateSellerstate = (item, val) => {
        NewState = this.state.sellerList;
        NewState[item.item.key] = val;
        this.setState({sellerList : NewState});
    }

    updatesellerUserSettingstate = (val, key) =>{
        NewState = this.state.sellerUserSetting;
        NewState[key] = val;
        this.setState({sellerUserSetting : NewState});
    }

    updateconventionalsettingstate = (val, key) =>{
        NewState = this.state.conventionalsettings;
        NewState[key] = val;
        this.setState({conventionalsettings : NewState});
    }

    updaterefinancecosts = (item, val) => {
        NewState = this.state.refinanceList;
        NewState[item.item.key] = val;
        this.setState({refinanceList : NewState});
    }

    updateRefinanceSettingsstate = (val, key) =>{
        NewState = this.state.RefinanceSettings;
        NewState[key] = val;
        this.setState({RefinanceSettings : NewState});
    }

    updateotherEscrowSettingsstate = (val, key) =>{
        NewState = this.state.otherEscrow;
        NewState[key] = val;
        this.setState({otherEscrow : NewState});
    }
    
    updateBuyerSettings  = (val, key) =>{
        NewState = this.state.buyerUserSetting;
        NewState[key] = val;
        this.setState({buyerUserSetting : NewState});
    }

    updatebuyerliststate = (item, val) => {
        NewState = this.state.BuyerList;
        NewState[item.item.key] = val;
        this.setState({BuyerList : NewState});
    }

    updatebuyerMonthlyliststate = (item, val) => {
        NewState = this.state.BuyerMonthlyList;
        NewState[item.item.key] = val;
        this.setState({BuyerMonthlyList : NewState});
    }

    updateCommissionSettingsstate = (val, key) => {
        NewState = this.state.CommissionSetting;
        NewState[key] = val;
        this.setState({CommissionSetting : NewState});
    }

    sellercostslist= (item) =>{
        return(<View>
            <View style={Styles.detailbox}>
                <Text style={Styles.detailboxkey}>{item.item.label}</Text>
                <TextInput 
                    keyboardType="numeric" 
                    style={Styles.width30} 
                    editable={this.state.editable} 
                    underlineColorAndroid='transparent'
                    value={this.state.sellerList[item.item.key]}
                    onChangeText={(val)=>this.updateSellerstate(item,val)}
                    returnKeyType= 'done'
                />
                </View>
                <View style={[Styles.textinputunderline]}>
                    <View style={Styles.fullunderline}></View>
                </View>
            </View>
        )
    }
    
    buyercostslist(item){
        return(<View>
            <View style={Styles.detailbox}>
                <Text style={Styles.detailboxkey}>{item.item.label} ({item.item.type})</Text>
                <TextInput 
                    keyboardType="numeric" 
                    style={Styles.width30} 
                    editable={this.state.editable} 
                    underlineColorAndroid='transparent'
                    value={this.state.BuyerList[item.item.key]}
                    onChangeText={(val)=>this.updatebuyerliststate(item,val)}
                    returnKeyType= 'done'
                />
                </View>
                <View style={[Styles.textinputunderline]}>
                    <View style={Styles.fullunderline}></View>
                </View>
            </View>
        )
    }
    
    buyerMonthlycostslist(item){
        return(<View>
            <View style={Styles.detailbox}>
                <Text style={Styles.detailboxkey}>{item.item.label}</Text>
                <TextInput 
                    keyboardType="numeric" 
                    style={Styles.width30} 
                    editable={this.state.editable} 
                    underlineColorAndroid='transparent'
                    value={this.state.BuyerMonthlyList[item.item.key]}
                    onChangeText={(val)=>this.updatebuyerMonthlyliststate(item,val)}
                    returnKeyType= 'done'
                />
                </View>
                <View style={[Styles.textinputunderline]}>
                    <View style={Styles.fullunderline}></View>
                </View>
            </View>
        )
    }

    refinancecostslist(item){
        return(<View>
            <View style={Styles.detailbox}>
                <Text style={Styles.detailboxkey}>{item.item.label} ({item.item.type})</Text>
                <TextInput 
                    keyboardType="numeric" 
                    style={Styles.width30} 
                    editable={this.state.editable} 
                    underlineColorAndroid='transparent'
                    value={this.state.refinanceList[item.item.key]}
                    onChangeText={(val)=>this.updaterefinancecosts(item,val)}
                    returnKeyType= 'done'
                />
                </View>
                <View style={[Styles.textinputunderline]}>
                    <View style={Styles.fullunderline}></View>
                </View>
            </View>
        )
    }

    updatelist(){
        this.setState({editable: false});
        if(this.state.dropdownval == 'Seller Costs'){
            let apiCallObjtemp = {}
            let staticObj = this.state.sellerUserSetting
            let dynamicObj = this.state.sellerList
            Object.keys(staticObj).forEach(function(key) {
                if(key == "transferTax" || key == "benifDemandStatement"){
                    if(key == "transferTax"){
                    apiCallObjtemp['transferTaxRateofSalePrice'] = staticObj[key];}
                    if(key == "benifDemandStatement"){
                    apiCallObjtemp['payoffDemandStatement'] = staticObj[key];}
                    }
                else
                apiCallObjtemp[key] = staticObj[key];
            });
            Object.keys(dynamicObj).forEach(function(key) {
                apiCallObjtemp[key] = dynamicObj[key];
            });
            apiCallObjtemp["user_id"] = this.state.apiCallObj.user_id;
            apiCallObjtemp["company_id"] = this.state.apiCallObj.company_id;
            callPostApi(GLOBAL.BASE_URL + GLOBAL.Update_Seller_Cost_Setting, apiCallObjtemp, this.state.access_token)
            .then((response) => {
                // Continue your code here...
                if (result.status == 'success')
                {   
                   // this.onBackButtonPress();
				   this.setState({editable:false})
					this.dropdown.alertWithType('success', 'Success', 'Your closing costs has been updated.');
                }
                else {
                    Toast.show(JSON.stringify(result.message))
                }
    
            });
        }
        if(this.state.dropdownval == 'FHA/VA/USDA Loans'){
            let FHA_DocumentPreparation = this.state.FHA_DocumentPreparation;
            let FHA_TaxServiceContract = this.state.FHA_TaxServiceContract;
            let FHA_Underwriting = this.state.FHA_Underwriting;
            let FHA_ProcessingFee = this.state.FHA_ProcessingFee;
            let FHA_AppraisalFee = this.state.FHA_AppraisalFee;
            let FHA_OriginationFactor = this.state.FHA_OriginationFactor;
            let VA_DocumentPreparation = this.state.VA_DocumentPreparation;
            let VA_TaxServiceContract = this.state.VA_TaxServiceContract;
            let VA_Underwriting = this.state.VA_Underwriting;
            let VA_ProcessingFee = this.state.VA_ProcessingFee;
            let VA_AppraisalFee = this.state.VA_AppraisalFee;
            let VA_OriginationFactor = this.state.VA_OriginationFactor;
            let USDA_DocumentPreparation = this.state.USDA_DocumentPreparation;
            let USDA_TaxServiceContract = this.state.USDA_TaxServiceContract;
            let USDA_Underwriting = this.state.USDA_Underwriting;
            let USDA_ProcessingFee = this.state.USDA_ProcessingFee;
            let USDA_AppraisalFee = this.state.USDA_AppraisalFee;
            let USDA_OriginationFactor = this.state.USDA_OriginationFactor;
            let apiCallObjtemp = {
                "user_id": this.state.apiCallObj.user_id,
                "company_id": this.state.apiCallObj.company_id,
                "request_from": "M",
                "FHA_DocumentPreparation": FHA_DocumentPreparation,
                "FHA_TaxServiceContract": FHA_TaxServiceContract,
                "FHA_Underwriting": FHA_Underwriting,
                "FHA_ProcessingFee": FHA_ProcessingFee,
                "FHA_AppraisalFee": FHA_AppraisalFee,
                "FHA_OriginationFactor": FHA_OriginationFactor,
                "VA_DocumentPreparation": VA_DocumentPreparation,
                "VA_TaxServiceContract": VA_TaxServiceContract,
                "VA_Underwriting": VA_Underwriting,
                "VA_ProcessingFee": VA_ProcessingFee,
                "VA_AppraisalFee": VA_AppraisalFee,
                "VA_OriginationFactor": VA_OriginationFactor,
                "USDA_DocumentPreparation": USDA_DocumentPreparation,
                "USDA_TaxServiceContract": USDA_TaxServiceContract,
                "USDA_Underwriting": USDA_Underwriting,
                "USDA_ProcessingFee": USDA_ProcessingFee,
                "USDA_AppraisalFee": USDA_AppraisalFee,
                "USDA_OriginationFactor": USDA_OriginationFactor,
            }
            callPostApi(GLOBAL.BASE_URL + GLOBAL.update_fha_va_usda_setting_api, apiCallObjtemp, this.state.access_token)
            .then((response) => {

                //alert(JSON.stringify(result));

                // Continue your code here...
                if (result.status == 'success')
                {   
                    //alert(JSON.stringify(22222+result.data))
                    /* this.onBackButtonPress();
                    Toast.show("FHA/VA/USDA Settings Updated Successfully") */
					// this.onBackButtonPress();
				   this.setState({editable:false})
					this.dropdown.alertWithType('success', 'Success', 'Your closing costs has been updated');
                }
                else {
                    Toast.show(JSON.stringify(result.message))
                }
    
            });
        }
        if(this.state.dropdownval == 'Refinance Costs'){
            let apiCallObjtemp = {}
            let staticObj = this.state.refinanceList
            let dynamicObj = this.state.RefinanceSettings
            Object.keys(staticObj).forEach(function(key) {
                apiCallObjtemp[key] = staticObj[key];
            });
            Object.keys(dynamicObj).forEach(function(key) {
                apiCallObjtemp[key] = dynamicObj[key];
            });
            apiCallObjtemp["user_id"] = this.state.apiCallObj.user_id;
            apiCallObjtemp["company_id"] = this.state.apiCallObj.company_id;
            callPostApi(GLOBAL.BASE_URL + GLOBAL.Update_refinance_setting, apiCallObjtemp, this.state.access_token)
            .then((response) => {
                // Continue your code here...
                if (result.status == 'success')
                {   
                    /* this.onBackButtonPress();
                    Toast.show("Refinance Settings Updated Successfully") */
					// this.onBackButtonPress();
				   this.setState({editable:false})
					this.dropdown.alertWithType('success', 'Success', 'Your closing costs has been updated');
                }
                else {
                    Toast.show(JSON.stringify(result.message))
                }
    
            });
        }
        if(this.state.dropdownval == 'Buyer Costs'){
            let apiCallObjtemp = {}
            let staticObj = this.state.buyerUserSetting
            let dynamicObj = this.state.BuyerList
            let monthObj = this.state.BuyerMonthlyList
            Object.keys(staticObj).forEach(function(key) {
                apiCallObjtemp[key] = staticObj[key];
            });
            Object.keys(dynamicObj).forEach(function(key) {
                apiCallObjtemp[key] = dynamicObj[key];
            });
            Object.keys(monthObj).forEach(function(key) {
                apiCallObjtemp[key] = monthObj[key];
            });
            apiCallObjtemp["user_id"] = this.state.apiCallObj.user_id;
            apiCallObjtemp["company_id"] = this.state.apiCallObj.company_id;
            callPostApi(GLOBAL.BASE_URL + GLOBAL.Update_Buyer_Cost_Setting, apiCallObjtemp, this.state.access_token)
            .then((response) => {
                // Continue your code here...
                if (result.status == 'success')
                {   
                    /* this.onBackButtonPress();
                    Toast.show("Buyer Settings Updated Successfully") */
					// this.onBackButtonPress();
				   this.setState({editable:false})
					this.dropdown.alertWithType('success', 'Success', 'Your closing costs has been updated');
                }
                else {
                    Toast.show(JSON.stringify(result.message))
                }
    
            });
        }

        if(this.state.dropdownval == 'Conventional Loans'){
            let apiCallObjtemp = {}
            let staticObj = this.state.conventionalsettings
            Object.keys(staticObj).forEach(function(key) {
                apiCallObjtemp[key] = staticObj[key];
            });
            apiCallObjtemp.stateId = undefined;
            apiCallObjtemp.countyId= undefined;
            apiCallObjtemp.userId = undefined;
            apiCallObjtemp.companyId = undefined;
            apiCallObjtemp["user_id"] = this.state.apiCallObj.user_id;
            apiCallObjtemp["company_id"] = this.state.apiCallObj.company_id;
            callPostApi(GLOBAL.BASE_URL + GLOBAL.Update_conventional_setting, apiCallObjtemp, this.state.access_token)
            .then((response) => {
                // Continue your code here...
                if (result.status == 'success')
                {   
                    /* this.onBackButtonPress();
                    Toast.show("Conventional Loans Settings Updated Successfully") */
					// this.onBackButtonPress();
				   this.setState({editable:false})
					this.dropdown.alertWithType('success', 'Success', 'Your closing costs has been updated');
                }
                else {
                    Toast.show(JSON.stringify(result.message))
                }
    
            });
        }

        if(this.state.dropdownval == 'Other Escrow'){
            let apiCallObjtemp = {}
            apiCallObjtemp["user_id"] = this.state.apiCallObj.user_id;
            apiCallObjtemp["company_id"] = this.state.apiCallObj.company_id;
            apiCallObjtemp["buyerBaseRate"] = this.state.otherEscrow.buyerBaseRate;
            apiCallObjtemp["buyerRatePerThousand"] = this.state.otherEscrow.buyerRatePerThousand;
            apiCallObjtemp["sellerBaseRate"] = this.state.otherEscrow.sellerBaseRate;
            apiCallObjtemp["sellerRatePerThousand"] = this.state.otherEscrow.sellerRatePerThousand;
            apiCallObjtemp["apply"] = this.state.otherEscrowapply.toString();
            callPostApi(GLOBAL.BASE_URL + GLOBAL.Update_Other_Escrow, apiCallObjtemp, this.state.access_token)
            .then((response) => {
                // Continue your code here...
                if (result.status == 'success')
                {   
                    /* this.onBackButtonPress();
                    Toast.show("Loan Comparison Settings Updated Successfully") */
					// this.onBackButtonPress();
				   this.setState({editable:false})
					this.dropdown.alertWithType('success', 'Success', 'Your closing costs has been updated');
                }
                else {
                    Toast.show(JSON.stringify(result.message))
                }
    
            });
        }

        if(this.state.dropdownval == 'Commissions'){
            let apiCallObjtemp = {}
            apiCallObjtemp = this.state.CommissionSetting;
            apiCallObjtemp["user_id"] = this.state.apiCallObj.user_id;
            apiCallObjtemp["company_id"] = this.state.apiCallObj.company_id;
            apiCallObjtemp["option"] = this.state.optiontoggle
            //alert(JSON.stringify(apiCallObjtemp))
            callPostApi(GLOBAL.BASE_URL + GLOBAL.Update_commission_setting, apiCallObjtemp, this.state.access_token)
            .then((response) => {
                // Continue your code here...
                if (result.status == 'success')
                {   
                    /* this.onBackButtonPress();
                    Toast.show("Commision Settings Updated Successfully") */
					// this.onBackButtonPress();
				   this.setState({editable:false})
					this.dropdown.alertWithType('success', 'Success', 'Your closing costs has been updated');
                }
                else {
                    Toast.show(JSON.stringify(result.message))
                }
    
            });
        }
		
		if(this.state.dropdownval == 'CDTC/TRID'){
            let apiCallObjtemp = {}
            apiCallObjtemp["user_id"] = this.state.apiCallObj.user_id;
            apiCallObjtemp["company_id"] = this.state.apiCallObj.company_id;
            apiCallObjtemp["cdtc"] = this.state.cdtc.toString();
			apiCallObjtemp["cfpb"] = this.state.cfpb.toString();
            callPostApi(GLOBAL.BASE_URL + GLOBAL.update_cdtc_trid_setting, apiCallObjtemp, this.state.access_token)
            .then((response) => {
                // Continue your code here...
                if (result.status == 'success')
                {   
                    /* this.onBackButtonPress();
                    Toast.show("Loan Comparison Settings Updated Successfully") */
					// this.onBackButtonPress();
				   this.setState({editable:false})
					this.dropdown.alertWithType('success', 'Success', 'Your closing costs has been updated');
                }
                else {
                    Toast.show(JSON.stringify(result.message))
                }
    
            });
        }
		
        if(this.state.dropdownval == 'Loan Comparison'){
            let apiCallObjtemp = {}
            apiCallObjtemp["user_id"] = this.state.apiCallObj.user_id;
            apiCallObjtemp["company_id"] = this.state.apiCallObj.company_id;
            apiCallObjtemp["loanComparison"] = this.state.loanComparison;
            callPostApi(GLOBAL.BASE_URL + GLOBAL.Update_Load_Comparison, apiCallObjtemp, this.state.access_token)
            .then((response) => {
                // Continue your code here...
                if (result.status == 'success')
                {   
                    /* this.onBackButtonPress();
                    Toast.show("Loan Comparison Settings Updated Successfully") */
					// this.onBackButtonPress();
				   this.setState({editable:false})
					this.dropdown.alertWithType('success', 'Success', 'Your closing costs has been updated');
                }
                else {
                    Toast.show(JSON.stringify(result.message))
                }
    
            });
        }
    }
	
	changeTab(idx, value){
		if(this.state.editable == true){
			this.setState({editable: false});
		}
		if(value != "<null>")
		this.setState({dropdownval: value});
		else
		this.setState({dropdownval: 'Seller Costs'});
		if(value == 'Conventional Loans'){
		this.callGetConventionalSettings();}
		if(value == 'FHA/VA/USDA Loans'){
		this.callGetFhaVaUsdaSettings();}
		if(value == 'Buyer Costs'){
		this.callBuyerSettings();}
		if(value == 'Refinance Costs'){
		this.callRefinanceSettings();}
		if(value == 'Commissions'){
		this.callCommissionSettings("traditional");}
		if(value == 'CDTC/TRID' || value == 'Loan Comparison' || value == 'Other Escrow'){
		this.callCdtcTridLoanComparisonSettings();}
	}

    render(){

        const items = [
            { key: 0, label: 'Fruits', value:'some value' },
            { key: 1, label: 'Fruits', value:{this: "could", be:"anything"} },
        ];

		if(this.state.animating == 'true') {
			this.state.scrollvalue = false;
			this.state.visble = true;
		} else {
			this.state.scrollvalue = true;
			this.state.visble = false;
		}
        return(
            <View style={Styles.TopContainer}>
                <View style={Styles.outerContainer}> 
					<Spinner visible={this.state.visble} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
					<View>
						<Spinner visible={this.state.visble} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
					</View>	
                    <Image style={Styles.header_bg} source={Images.header_background}>
                        <View style={Styles.header_view}>
                            <TouchableOpacity  style={Styles.back_icon_parent} onPress={this.onBackButtonPress.bind(this)}>
                                <Image style={Styles.back_icon} source={Images.back_icon}/>
                            </TouchableOpacity>
                            <Text style={Styles.header_title}>{STRINGS.t('Settings')}</Text>
							<TouchableOpacity style={{ borderRadius:3, marginRight : 2, marginTop : 10, marginBottom : 10, width:'37%', justifyContent:'center', backgroundColor : '#ffffff'}} onPress={()=>{this.restoreConfirmation()}}>
								<Text style={[Styles.headerbtnText]}>{'Update Defaults'}</Text>
							</TouchableOpacity>
                        </View>
                    </Image>






                    <View style={Styles.settingsSubheading}>
					
						<View style={{alignSelf:'flex-start',flexDirection: 'row',height:'100%', width:'65%',paddingLeft:15,paddingRight:15,paddingTop:13, paddingBottom:13}}>
                            <ModalDropdown options={this.state.tabarray} textStyle={Styles.dropdownval} dropdownTextStyle={{fontSize: 14}}
                            defaultValue={this.state.dropdownval.toString()}  animated={true} style={{width:'90%',marginLeft:0,marginRight : 10}} 
                            dropdownStyle={{ alignItems: 'center',width: 200,height:320, borderWidth: 1,borderRadius: 2,borderColor: '#ddd',borderBottomWidth: 0,shadowColor: '#000', shadowOffset: { width: 0, height: 0 },shadowOpacity: 0.8,shadowRadius: 2}} onSelect={(idx, value) => this.changeTab(idx, value)} >
                            </ModalDropdown>

								<Image style={{width:9,height:9,top:3}} source={Images.dropdown_arrow}/>

                                <Selectbox
                                    selectedItem={this.props.selectedItem}
                                    onChange={this._onChange}
                                    items={items} />


						</View>

									
                       
                        <View style={Styles.subheadingSmallbox}>
                            <TouchableOpacity style={Styles.editbtn} onPress={()=>{(this.state.editable == false) ? this.setState({editable:true}) : this.updatelist()}}>
                                <View style={Styles.editbox}>
                                    <Text style={Styles.edittext}>{(this.state.editable == false) ? 'EDIT': 'Done'}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>







                
                    <View style={Styles.scrollviewheight}>
                        {renderIf(this.state.dropdownval == 'Seller Costs')(
                            <ScrollView
                                scrollEnabled={true}
                                showsVerticalScrollIndicator={true}
                                keyboardShouldPersistTaps="always"
                                keyboardDismissMode='on-drag'
                                style={Styles.settingsscrollview}
                            > 
                                <View style={Styles.selectedvalbox}>
                                    <Text style={Styles.selectedvalboxtext}>{this.state.dropdownval}</Text>
                                </View>
                                <View style={Styles.fullunderline}></View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkey}>{STRINGS.t('brokerage_fees_sales_price')}</Text>
                                    <TextInput keyboardType="numeric" 
                                        style={Styles.width30} 
                                        editable={this.state.editable} 
                                        underlineColorAndroid='transparent' 
                                        value={this.state.sellerUserSetting.brokerageFeeofSalePrice}
                                        onChangeText={(val)=>this.updatesellerUserSettingstate(val,"brokerageFeeofSalePrice")}
                                        returnKeyType= 'done'
                                    />
                                </View>
                                <View style={Styles.textinputunderline}>
                                    <View style={Styles.fullunderline}></View>
                                </View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkey}>{STRINGS.t('transferTaxRateOfSalesPrice')}</Text>
                                    <TextInput keyboardType="numeric" 
                                        style={Styles.width30} 
                                        editable={this.state.editable} 
                                        underlineColorAndroid='transparent' 
                                        value={this.state.sellerUserSetting.transferTax}
                                        onChangeText={(val)=>this.updatesellerUserSettingstate(val,"transferTax")}
                                        returnKeyType= 'done'
                                    />
                                </View>
                                <View style={Styles.textinputunderline}>
                                    <View style={Styles.fullunderline}></View>
                                </View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkey}>{STRINGS.t('payoffDemandStatement')}</Text>
                                    <TextInput keyboardType="numeric" 
                                        style={Styles.width30} 
                                        editable={this.state.editable} 
                                        underlineColorAndroid='transparent' 
                                        value={this.state.sellerUserSetting.benifDemandStatement}
                                        onChangeText={(val)=>this.updatesellerUserSettingstate(val,"benifDemandStatement")}
                                        returnKeyType= 'done'
                                    />
                                </View>
                                <View style={Styles.textinputunderline}>
                                    <View style={Styles.fullunderline}></View>
                                </View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkey}>{STRINGS.t('reconveyanceFee')}</Text>
                                    <TextInput keyboardType="numeric" 
                                        style={Styles.width30} 
                                        editable={this.state.editable} 
                                        underlineColorAndroid='transparent' 
                                        value={this.state.sellerUserSetting.reconveynceFee}
                                        onChangeText={(val)=>this.updatesellerUserSettingstate(val,"reconveynceFee")}
                                        returnKeyType= 'done'
                                    />
                                </View>
                                <View style={Styles.textinputunderline}>
                                    <View style={Styles.fullunderline}></View>
                                </View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkey}>{STRINGS.t('drawingDeed')}</Text>
                                    <TextInput keyboardType="numeric" 
                                        style={Styles.width30} 
                                        editable={this.state.editable} 
                                        underlineColorAndroid='transparent' 
                                        value={this.state.sellerUserSetting.drawingDeed}
                                        onChangeText={(val)=>this.updatesellerUserSettingstate(val,"drawingDeed")}
                                        returnKeyType= 'done'
                                    />
                                </View>
                                <View style={Styles.textinputunderline}>
                                    <View style={Styles.fullunderline}></View>
                                </View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkey}>{STRINGS.t('notary$')}</Text>
                                    <TextInput keyboardType="numeric" 
                                        style={Styles.width30} 
                                        editable={this.state.editable} 
                                        underlineColorAndroid='transparent' 
                                        value={this.state.sellerUserSetting.notary}
                                        onChangeText={(val)=>this.updatesellerUserSettingstate(val,"notary")}
                                        returnKeyType= 'done'
                                    />
                                </View>
                                <View style={Styles.textinputunderline}>
                                    <View style={Styles.fullunderline}></View>
                                </View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkey}>{STRINGS.t('pestControlReport$')}</Text>
                                    <TextInput keyboardType="numeric" 
                                        style={Styles.width30} 
                                        editable={this.state.editable} 
                                        underlineColorAndroid='transparent' 
                                        value={this.state.sellerUserSetting.pestControlReport}
                                        onChangeText={(val)=>this.updatesellerUserSettingstate(val,"pestControlReport")}
                                        returnKeyType= 'done'
                                    />
                                </View>
                                <View style={Styles.textinputunderline}>
                                    <View style={Styles.fullunderline}></View>
                                </View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkey}>{STRINGS.t('fhaVaPoints')}</Text>
                                    <TextInput keyboardType="numeric" 
                                        style={Styles.width30} 
                                        editable={this.state.editable} 
                                        underlineColorAndroid='transparent' 
                                        value={this.state.sellerUserSetting.FHAVAPoints}
                                        onChangeText={(val)=>this.updatesellerUserSettingstate(val,"FHAVAPoints")}
                                        returnKeyType= 'done'
                                    />
                                </View>
                                <View style={Styles.textinputunderline}>
                                    <View style={Styles.fullunderline}></View>
                                </View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkey}>{STRINGS.t('conventionalPoints')}</Text>
                                    <TextInput keyboardType="numeric" 
                                        style={Styles.width30} 
                                        editable={this.state.editable} 
                                        underlineColorAndroid='transparent' 
                                        value={this.state.sellerUserSetting.conventionalPoints}
                                        onChangeText={(val)=>this.updatesellerUserSettingstate(val,"conventionalPoints")}
                                        returnKeyType= 'done'
                                    />
                                </View>
                                <View style={Styles.textinputunderline}>
                                    <View style={Styles.fullunderline}></View>
                                </View>
                                <FlatList
                                    data={this.state.sellerUserSettingCost}
                                    extraData={[this.state.editable, this.state.sellerList]}
                                    //keyExtractor={this._keyExtractor}
                                    renderItem={(item) => this.sellercostslist(item)}
                                />
                                <View style={{marginBottom:50}}></View>
                            </ScrollView>
                        )}
                        {renderIf(this.state.dropdownval == 'FHA/VA/USDA Loans')(
                            <ScrollView
                                scrollEnabled={true}
                                showsVerticalScrollIndicator={true}
                                keyboardShouldPersistTaps="always"
                                keyboardDismissMode='on-drag'
                                style={Styles.settingsscrollview}
                            > 
                                <View style={Styles.selectedvalbox}>
                                    <Text style={Styles.selectedvalboxtext}>{STRINGS.t('FHA')}</Text>
                                </View>
                                <View style={Styles.fullunderline}></View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkey}>{STRINGS.t('originationFactor')}({this.state.FHA_OriginationFactorType})</Text>
                                    <TextInput keyboardType="numeric" 
                                        style={Styles.width30} 
                                        editable={this.state.editable} 
                                        underlineColorAndroid='transparent' 
                                        value={this.state.FHA_OriginationFactor}
                                        onChangeText={(val)=>this.setState({FHA_OriginationFactor: val})}
                                        returnKeyType= 'done'
                                    />
                                </View>
                                <View style={Styles.textinputunderline}>
                                    <View style={Styles.fullunderline}></View>
                                </View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkey}>{STRINGS.t('documentprep')}</Text>
                                    <TextInput keyboardType="numeric" 
                                        style={Styles.width30} 
                                        editable={this.state.editable} 
                                        underlineColorAndroid='transparent' 
                                        value={this.state.FHA_DocumentPreparation}
                                        onChangeText={(val)=>this.setState({FHA_DocumentPreparation: val})}
                                        returnKeyType= 'done'
                                    />
                                </View>
                                <View style={Styles.textinputunderline}>
                                    <View style={Styles.fullunderline}></View>
                                </View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkey}>{STRINGS.t('taxServiceContract')}</Text>
                                    <TextInput keyboardType="numeric" 
                                        style={Styles.width30} 
                                        editable={this.state.editable} 
                                        underlineColorAndroid='transparent' 
                                        value={this.state.FHA_TaxServiceContract}
                                        onChangeText={(val)=>this.setState({FHA_TaxServiceContract: val})}
                                        returnKeyType= 'done'
                                    />
                                </View>
                                <View style={Styles.textinputunderline}>
                                    <View style={Styles.fullunderline}></View>
                                </View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkey}>{STRINGS.t('Underwriting')}</Text>
                                    <TextInput keyboardType="numeric" 
                                        style={Styles.width30} 
                                        editable={this.state.editable} 
                                        underlineColorAndroid='transparent' 
                                        value={this.state.FHA_Underwriting}
                                        onChangeText={(val)=>this.setState({FHA_Underwriting: val})}
                                        returnKeyType= 'done'
                                    />
                                </View>
                                <View style={Styles.textinputunderline}>
                                    <View style={Styles.fullunderline}></View>
                                </View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkey}>{STRINGS.t('Processing_Fee')}</Text>
                                    <TextInput keyboardType="numeric" 
                                        style={Styles.width30} 
                                        editable={this.state.editable} 
                                        underlineColorAndroid='transparent' 
                                        value={this.state.FHA_ProcessingFee}
                                        onChangeText={(val)=>this.setState({FHA_ProcessingFee: val})}
                                        returnKeyType= 'done'
                                    />
                                </View>
                                <View style={Styles.textinputunderline}>
                                    <View style={Styles.fullunderline}></View>
                                </View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkey}>{STRINGS.t('appraisalFee')}</Text>
                                    <TextInput keyboardType="numeric" 
                                        style={Styles.width30} 
                                        editable={this.state.editable} 
                                        underlineColorAndroid='transparent' 
                                        value={this.state.FHA_AppraisalFee}
                                        onChangeText={(val)=>this.setState({FHA_AppraisalFee: val})}
                                        returnKeyType= 'done'
                                    />
                                </View>
                                <View style={Styles.textinputunderline}>
                                    <View style={Styles.fullunderline}></View>
                                </View>
                                <View style={[Styles.fullunderline,{marginTop:30}]}></View>
                                <View style={Styles.selectedvalbox}>
                                    <Text style={Styles.selectedvalboxtext}>VA</Text>
                                </View>
                                <View style={Styles.fullunderline}></View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkey}>{STRINGS.t('originationFactor')}({this.state.VA_OriginationFactorType})</Text>
                                    <TextInput keyboardType="numeric" 
                                        style={Styles.width30} 
                                        editable={this.state.editable} 
                                        underlineColorAndroid='transparent' 
                                        value={this.state.VA_OriginationFactor}
                                        onChangeText={(val)=>this.setState({VA_OriginationFactor: val})}
                                        returnKeyType= 'done'
                                    />
                                </View>
                                <View style={Styles.textinputunderline}>
                                    <View style={Styles.fullunderline}></View>
                                </View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkey}>{STRINGS.t('documentprep')}</Text>
                                    <TextInput keyboardType="numeric" 
                                        style={Styles.width30} 
                                        editable={this.state.editable} 
                                        underlineColorAndroid='transparent' 
                                        value={this.state.VA_DocumentPreparation}
                                        onChangeText={(val)=>this.setState({VA_DocumentPreparation: val})}
                                        returnKeyType= 'done'
                                    />
                                </View>
                                <View style={Styles.textinputunderline}>
                                    <View style={Styles.fullunderline}></View>
                                </View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkey}>{STRINGS.t('taxServiceContract')}</Text>
                                    <TextInput keyboardType="numeric" 
                                        style={Styles.width30} 
                                        editable={this.state.editable} 
                                        underlineColorAndroid='transparent' 
                                        value={this.state.VA_TaxServiceContract}
                                        onChangeText={(val)=>this.setState({VA_TaxServiceContract: val})}
                                        returnKeyType= 'done'
                                    />
                                </View>
                                <View style={Styles.textinputunderline}>
                                    <View style={Styles.fullunderline}></View>
                                </View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkey}>{STRINGS.t('Underwriting')}</Text>
                                    <TextInput keyboardType="numeric" 
                                        style={Styles.width30} 
                                        editable={this.state.editable} 
                                        underlineColorAndroid='transparent' 
                                        value={this.state.VA_Underwriting}
                                        onChangeText={(val)=>this.setState({VA_Underwriting: val})}
                                        returnKeyType= 'done'
                                    />
                                </View>
                                <View style={Styles.textinputunderline}>
                                    <View style={Styles.fullunderline}></View>
                                </View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkey}>{STRINGS.t('Processing_Fee')}</Text>
                                    <TextInput keyboardType="numeric" 
                                        style={Styles.width30} 
                                        editable={this.state.editable} 
                                        underlineColorAndroid='transparent' 
                                        value={this.state.VA_ProcessingFee}
                                        onChangeText={(val)=>this.setState({VA_ProcessingFee: val})}
                                        returnKeyType= 'done'
                                    />
                                </View>
                                <View style={Styles.textinputunderline}>
                                    <View style={Styles.fullunderline}></View>
                                </View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkey}>{STRINGS.t('appraisalFee')}</Text>
                                    <TextInput keyboardType="numeric" 
                                        style={Styles.width30} 
                                        editable={this.state.editable} 
                                        underlineColorAndroid='transparent' 
                                        value={this.state.VA_AppraisalFee}
                                        onChangeText={(val)=>this.setState({VA_AppraisalFee: val})}
                                        returnKeyType= 'done'
                                    />
                                </View>
                                <View style={Styles.textinputunderline}>
                                    <View style={Styles.fullunderline}></View>
                                </View>
                                <View style={[Styles.fullunderline,{marginTop:30}]}></View>
                                <View style={Styles.selectedvalbox}>
                                    <Text style={Styles.selectedvalboxtext}>USDA</Text>
                                </View>
                                <View style={Styles.fullunderline}></View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkey}>{STRINGS.t('originationFactor')}({this.state.USDA_OriginationFactorType})</Text>
                                    <TextInput keyboardType="numeric" 
                                        style={Styles.width30} 
                                        editable={this.state.editable} 
                                        underlineColorAndroid='transparent' 
                                        value={this.state.USDA_OriginationFactor}
                                        onChangeText={(val)=>this.setState({USDA_OriginationFactor: val})}
                                        returnKeyType= 'done'
                                    />
                                </View>
                                <View style={Styles.textinputunderline}>
                                    <View style={Styles.fullunderline}></View>
                                </View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkey}>{STRINGS.t('documentprep')}</Text>
                                    <TextInput keyboardType="numeric" 
                                        style={Styles.width30} 
                                        editable={this.state.editable} 
                                        underlineColorAndroid='transparent' 
                                        value={this.state.USDA_DocumentPreparation}
                                        onChangeText={(val)=>this.setState({USDA_DocumentPreparation: val})}
                                        returnKeyType= 'done'
                                    />
                                </View>
                                <View style={Styles.textinputunderline}>
                                    <View style={Styles.fullunderline}></View>
                                </View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkey}>{STRINGS.t('taxServiceContract')}</Text>
                                    <TextInput keyboardType="numeric" 
                                        style={Styles.width30} 
                                        editable={this.state.editable} 
                                        underlineColorAndroid='transparent' 
                                        value={this.state.USDA_TaxServiceContract}
                                        onChangeText={(val)=>this.setState({USDA_TaxServiceContract: val})}
                                        returnKeyType= 'done'
                                    />
                                </View>
                                <View style={Styles.textinputunderline}>
                                    <View style={Styles.fullunderline}></View>
                                </View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkey}>{STRINGS.t('Underwriting')}</Text>
                                    <TextInput keyboardType="numeric" 
                                        style={Styles.width30} 
                                        editable={this.state.editable} 
                                        underlineColorAndroid='transparent' 
                                        value={this.state.USDA_Underwriting}
                                        onChangeText={(val)=>this.setState({USDA_Underwriting: val})}
                                        returnKeyType= 'done'
                                    />
                                </View>
                                <View style={Styles.textinputunderline}>
                                    <View style={Styles.fullunderline}></View>
                                </View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkey}>{STRINGS.t('Processing_Fee')}</Text>
                                    <TextInput keyboardType="numeric" 
                                        style={Styles.width30} 
                                        editable={this.state.editable} 
                                        underlineColorAndroid='transparent' 
                                        value={this.state.USDA_ProcessingFee}
                                        onChangeText={(val)=>this.setState({USDA_ProcessingFee: val})}
                                        returnKeyType= 'done'
                                    />
                                </View>
                                <View style={Styles.textinputunderline}>
                                    <View style={Styles.fullunderline}></View>
                                </View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkey}>{STRINGS.t('appraisalFee')}</Text>
                                    <TextInput keyboardType="numeric" 
                                        style={Styles.width30} 
                                        editable={this.state.editable} 
                                        underlineColorAndroid='transparent' 
                                        value={this.state.USDA_AppraisalFee}
                                        onChangeText={(val)=>this.setState({USDA_AppraisalFee: val})}
                                        returnKeyType= 'done'
                                    />
                                </View>
                                <View style={Styles.textinputunderline}>
                                    <View style={Styles.fullunderline}></View>
                                </View>
                                <View style={{marginBottom:50}}></View>
                                
                            </ScrollView>
                        )}
                        {renderIf(this.state.dropdownval == 'Buyer Costs')(
                            <ScrollView
                                scrollEnabled={true}
                                showsVerticalScrollIndicator={true}
                                keyboardShouldPersistTaps="always"
                                keyboardDismissMode='on-drag'
                                style={Styles.settingsscrollview}
                            > 
                                <View style={Styles.selectedvalbox}>
                                    <Text style={Styles.selectedvalboxtext}>{STRINGS.t('interestRate&TermDefaults')}</Text>
                                </View>
                                <View style={Styles.fullunderline}></View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkey}>{STRINGS.t('todaysInterestRate')}</Text>
                                    <TextInput keyboardType="numeric" 
                                        style={Styles.width30} 
                                        editable={this.state.editable} 
                                        underlineColorAndroid='transparent' 
                                        value={this.state.buyerUserSetting.todaysInterestRate}
                                        onChangeText={(val)=>this.updateBuyerSettings(val,"todaysInterestRate")}
                                        returnKeyType= 'done'
                                    />
                                </View>
                                <View style={Styles.textinputunderline}>
                                    <View style={Styles.fullunderline}></View>
                                </View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkey}>{STRINGS.t('termLoanYears')}</Text>
                                    <TextInput
                                        style={Styles.width30} 
                                        editable={this.state.editable} 
                                        underlineColorAndroid='transparent' 
                                        value={this.state.buyerUserSetting.termsOfLoansinYears}
                                        onChangeText={(val)=>this.updateBuyerSettings(val,"termsOfLoansinYears")}
                                        returnKeyType= 'done'
                                    />
                                </View>
                                <View style={Styles.textinputunderline}>
                                    <View style={Styles.fullunderline}></View>
                                </View>
                                <View style={[Styles.fullunderline,{marginTop:30}]}></View>
                                <View style={Styles.selectedvalbox}>
                                    <Text style={Styles.selectedvalboxtext}>{STRINGS.t('taxesnInsurance')}</Text>
                                </View>
                                <View style={Styles.fullunderline}></View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkey}>{STRINGS.t('taxRateperYear')}</Text>
                                    <TextInput keyboardType="numeric" 
                                        style={Styles.width30} 
                                        editable={this.state.editable} 
                                        underlineColorAndroid='transparent' 
                                        value={this.state.buyerUserSetting.taxRatePerYearPerOfSalePrice}
                                        onChangeText={(val)=>this.updateBuyerSettings(val,"taxRatePerYearPerOfSalePrice")}
                                        returnKeyType= 'done'
                                    />
                                </View>
                                <View style={Styles.textinputunderline}>
                                    <View style={Styles.fullunderline}></View>
                                </View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkey}>{STRINGS.t('homeownerInsuranceRatio')}</Text>
                                    <TextInput keyboardType="numeric" 
                                        style={Styles.width30} 
                                        editable={this.state.editable} 
                                        underlineColorAndroid='transparent' 
                                        value={this.state.buyerUserSetting.homeownerInsuranceRateYearOfSalePrice}
                                        onChangeText={(val)=>this.updateBuyerSettings(val,"homeownerInsuranceRateYearOfSalePrice")}
                                        returnKeyType= 'done'
                                    />
                                </View>
                                <View style={Styles.textinputunderline}>
                                    <View style={Styles.fullunderline}></View>
                                </View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkey}>{STRINGS.t('noMonthsInsurance')}</Text>
                                    <TextInput keyboardType="numeric" 
                                        style={Styles.width30} 
                                        editable={this.state.editable} 
                                        underlineColorAndroid='transparent' 
                                        value={this.state.buyerUserSetting.numberOfMonthsInsurancePrepaid}
                                        onChangeText={(val)=>this.updateBuyerSettings(val,"numberOfMonthsInsurancePrepaid")}
                                        returnKeyType= 'done'
                                    />
                                </View>
                                <View style={Styles.textinputunderline}>
                                    <View style={Styles.fullunderline}></View>
                                </View>
                                <View style={[Styles.fullunderline,{marginTop:30}]}></View>
                                <View style={Styles.selectedvalbox}>
                                    <Text style={Styles.selectedvalboxtext}>{STRINGS.t('buyersPrepaid')}</Text>
                                </View>
                                <View style={Styles.fullunderline}></View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkey}>{STRINGS.t('Other')}</Text>
                                    <TextInput keyboardType="numeric" 
                                        style={Styles.width30} 
                                        editable={this.state.editable} 
                                        underlineColorAndroid='transparent' 
                                        value={this.state.buyerUserSettingMonthExp.USDA_AppraisalFee}
                                        onChangeText={(val)=>this.updateBuyerSettings(val,"USDA_AppraisalFee")}
                                        returnKeyType= 'done'
                                    />
                                </View>
                                <View style={Styles.textinputunderline}>
                                    <View style={Styles.fullunderline}></View>
                                </View>
                                <View style={[Styles.fullunderline,{marginTop:30}]}></View>
                                <View style={Styles.selectedvalbox}>
                                    <Text style={Styles.selectedvalboxtext}>{STRINGS.t('buyersMonthlyPayments')}</Text>
                                </View>
                                <View style={Styles.fullunderline}></View>
                                <FlatList
                                    data={this.state.buyerUserSettingMonthExp}
                                    extraData={[this.state.editable,this.state.BuyerMonthlyList]}
                                    //keyExtractor={this._keyExtractor}
                                    renderItem={(item) => this.buyerMonthlycostslist(item)}
                                />
                                <View style={[Styles.fullunderline,{marginTop:30}]}></View>
                                <View style={Styles.selectedvalbox}>
                                    <Text style={Styles.selectedvalboxtext}>{STRINGS.t('buyersClosingCosts')}</Text>
                                </View>
                                <View style={Styles.fullunderline}></View>
                                <FlatList
                                    data={this.state.buyerUserSettingCost}
                                    extraData={[this.state.editable,this.state.BuyerList]}
                                    //keyExtractor={this._keyExtractor}
                                    renderItem={(item) => this.buyercostslist(item)}
                                />
                                <View style={{marginBottom:50}}></View>
                                
                            </ScrollView>
                        )}
                        {renderIf(this.state.dropdownval == 'Refinance Costs')(
                            <ScrollView
                                scrollEnabled={true}
                                showsVerticalScrollIndicator={true}
                                keyboardShouldPersistTaps="always"
                                keyboardDismissMode='on-drag'
                                style={Styles.settingsscrollview}
                            > 
                                <View style={Styles.selectedvalbox}>
                                    <Text style={Styles.selectedvalboxtext}>{STRINGS.t('conventionalClosingCosts')}</Text>
                                </View>
                                <View style={Styles.fullunderline}></View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkey}>{STRINGS.t('points%')}</Text>
                                    <TextInput keyboardType="numeric" 
                                        style={Styles.width30} 
                                        editable={this.state.editable} 
                                        underlineColorAndroid='transparent' 
                                        value={this.state.RefinanceSettings.point}
                                        onChangeText={(val)=>this.updateRefinanceSettingsstate(val,"point")}
                                        returnKeyType= 'done'
                                    />
                                </View>
                                <View style={Styles.textinputunderline}>
                                    <View style={Styles.fullunderline}></View>
                                </View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkey}>{STRINGS.t('originationFactor')} ({this.state.RefinanceSettings.originationFactorType})</Text>
                                    <TextInput keyboardType="numeric" 
                                        style={Styles.width30} 
                                        editable={this.state.editable} 
                                        underlineColorAndroid='transparent' 
                                        value={this.state.RefinanceSettings.originationFactor}
                                        onChangeText={(val)=>this.updateRefinanceSettingsstate(val,"originationFactor")}
                                        returnKeyType= 'done'
                                    />
                                </View>
                                <View style={Styles.textinputunderline}>
                                    <View style={Styles.fullunderline}></View>
                                </View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkey}>{STRINGS.t('docprep')}</Text>
                                    <TextInput keyboardType="numeric" 
                                        style={Styles.width30} 
                                        editable={this.state.editable} 
                                        underlineColorAndroid='transparent' 
                                        value={this.state.RefinanceSettings.documentpreparation}
                                        onChangeText={(val)=>this.updateRefinanceSettingsstate(val,"documentpreparation")}
                                        returnKeyType= 'done'
                                    />
                                </View>
                                <View style={Styles.textinputunderline}>
                                    <View style={Styles.fullunderline}></View>
                                </View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkey}>{STRINGS.t('taxsrvccontract')}</Text>
                                    <TextInput keyboardType="numeric" 
                                        style={Styles.width30} 
                                        editable={this.state.editable} 
                                        underlineColorAndroid='transparent' 
                                        value={this.state.RefinanceSettings.taxservicecontract}
                                        onChangeText={(val)=>this.updateRefinanceSettingsstate(val,"taxservicecontract")}
                                        returnKeyType= 'done'
                                    />
                                </View>
                                <View style={Styles.textinputunderline}>
                                    <View style={Styles.fullunderline}></View>
                                </View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkey}>{STRINGS.t('underwriting$')}</Text>
                                    <TextInput keyboardType="numeric" 
                                        style={Styles.width30} 
                                        editable={this.state.editable} 
                                        underlineColorAndroid='transparent' 
                                        value={this.state.RefinanceSettings.underwriting}
                                        onChangeText={(val)=>this.updateRefinanceSettingsstate(val,"underwriting")}
                                        returnKeyType= 'done'
                                    />
                                </View>
                                <View style={Styles.textinputunderline}>
                                    <View style={Styles.fullunderline}></View>
                                </View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkey}>{STRINGS.t('processingfee$')}</Text>
                                    <TextInput keyboardType="numeric" 
                                        style={Styles.width30} 
                                        editable={this.state.editable} 
                                        underlineColorAndroid='transparent' 
                                        value={this.state.RefinanceSettings.processingfee}
                                        onChangeText={(val)=>this.updateRefinanceSettingsstate(val,"processingfee")}
                                        returnKeyType= 'done'
                                    />
                                </View>
                                <View style={Styles.textinputunderline}>
                                    <View style={Styles.fullunderline}></View>
                                </View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkey}>{STRINGS.t('appraisalfee$')}</Text>
                                    <TextInput keyboardType="numeric" 
                                        style={Styles.width30} 
                                        editable={this.state.editable} 
                                        underlineColorAndroid='transparent' 
                                        value={this.state.RefinanceSettings.appraisalfee}
                                        onChangeText={(val)=>this.updateRefinanceSettingsstate(val,"appraisalfee")}
                                        returnKeyType= 'done'
                                    />
                                </View>
                                <View style={Styles.textinputunderline}>
                                    <View style={Styles.fullunderline}></View>
                                </View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkey}>{STRINGS.t('floodcert%')}</Text>
                                    <TextInput keyboardType="numeric" 
                                        style={Styles.width30} 
                                        editable={this.state.editable} 
                                        underlineColorAndroid='transparent' 
                                        value={this.state.RefinanceSettings.floodcertification}
                                        onChangeText={(val)=>this.updateRefinanceSettingsstate(val,"floodcertification")}
                                        returnKeyType= 'done'
                                    />
                                </View>
                                <View style={Styles.textinputunderline}>
                                    <View style={Styles.fullunderline}></View>
                                </View>
                                <View style={[Styles.fullunderline,{marginTop:30}]}></View>
                                <View style={Styles.selectedvalbox}>
                                    <Text style={Styles.selectedvalboxtext}>Closing Cost</Text>
                                </View>
                                <View style={Styles.fullunderline}></View>
                                <FlatList
                                    data={this.state.refinanceUserSettingCost}
                                    extraData={[this.state.editable, this.state.refinanceList]}
                                    //keyExtractor={this._keyExtractor}
                                    renderItem={(item) => this.refinancecostslist(item)}
                                />
                                <View style={{marginBottom:50}}></View>
                                
                            </ScrollView>
                        )}
                        {renderIf(this.state.dropdownval == 'Conventional Loans')(
                            <ScrollView
                                scrollEnabled={true}
                                showsVerticalScrollIndicator={true}
                                keyboardShouldPersistTaps="always"
                                keyboardDismissMode='on-drag'
                                style={Styles.settingsscrollview}
                            > 
                                <View style={Styles.selectedvalbox}>
                                    <Text style={Styles.selectedvalboxtext}>{STRINGS.t('adjustableRateLoanCaps')}</Text>
                                </View>
                                <View style={Styles.fullunderline}></View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkey}>{STRINGS.t('maxInterestRateInc')}</Text>
                                    <TextInput keyboardType="numeric" 
                                        style={Styles.width30} 
                                        editable={this.state.editable} 
                                        underlineColorAndroid='transparent' 
                                        value={this.state.conventionalsettings.maximumInterestRateIncreaseperAdjustement}
                                        onChangeText={(val)=>this.updateconventionalsettingstate(val,"maximumInterestRateIncreaseperAdjustement")}
                                        returnKeyType= 'done'
                                    />
                                </View>
                                <View style={Styles.textinputunderline}>
                                    <View style={Styles.fullunderline}></View>
                                </View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkey}>{STRINGS.t('capoverLifeMaxIn')}</Text>
                                    <TextInput keyboardType="numeric" 
                                        style={Styles.width30} 
                                        editable={this.state.editable} 
                                        underlineColorAndroid='transparent' 
                                        value={this.state.conventionalsettings.cAPOverLifeMaximumInterestRateIncrease}
                                        onChangeText={(val)=>this.updateconventionalsettingstate(val,"cAPOverLifeMaximumInterestRateIncrease")}
                                        returnKeyType= 'done'
                                    />
                                </View>
                                <View style={Styles.textinputunderline}>
                                    <View style={Styles.fullunderline}></View>
                                </View>
                                <View style={[Styles.fullunderline,{marginTop:30}]}></View>
                                <View style={Styles.selectedvalbox}>
                                    <Text style={Styles.selectedvalboxtext}>{STRINGS.t('conventionalClosingCosts')}</Text>
                                </View>
                                <View style={Styles.fullunderline}></View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkey}>{STRINGS.t('points%')}</Text>
                                    <TextInput keyboardType="numeric" 
                                        style={Styles.width30} 
                                        editable={this.state.editable} 
                                        underlineColorAndroid='transparent' 
                                        value={this.state.conventionalsettings.point}
                                        onChangeText={(val)=>this.updateconventionalsettingstate(val,"point")}
                                        returnKeyType= 'done'
                                    />
                                </View>
                                <View style={Styles.textinputunderline}>
                                    <View style={Styles.fullunderline}></View>
                                </View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkey}>{STRINGS.t('Setting_originationFactor')}</Text>
                                    <TextInput keyboardType="numeric" 
                                        style={Styles.width30} 
                                        editable={this.state.editable} 
                                        underlineColorAndroid='transparent' 
                                        value={this.state.conventionalsettings.originationFactor}
                                        onChangeText={(val)=>this.updateconventionalsettingstate(val,"originationFactor")}
                                        returnKeyType= 'done'
                                    />
                                </View>
                                <View style={Styles.textinputunderline}>
                                    <View style={Styles.fullunderline}></View>
                                </View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkey}>{STRINGS.t('docprep')}</Text>
                                    <TextInput keyboardType="numeric" 
                                        style={Styles.width30} 
                                        editable={this.state.editable} 
                                        underlineColorAndroid='transparent' 
                                        value={this.state.conventionalsettings.documentpreparation}
                                        onChangeText={(val)=>this.updateconventionalsettingstate(val,"documentpreparation")}
                                        returnKeyType= 'done'
                                    />
                                </View>
                                <View style={Styles.textinputunderline}>
                                    <View style={Styles.fullunderline}></View>
                                </View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkey}>{STRINGS.t('taxsrvccontract')}</Text>
                                    <TextInput keyboardType="numeric" 
                                        style={Styles.width30} 
                                        editable={this.state.editable} 
                                        underlineColorAndroid='transparent' 
                                        value={this.state.conventionalsettings.taxservicecontract}
                                        onChangeText={(val)=>this.updateconventionalsettingstate(val,"taxservicecontract")}
                                        returnKeyType= 'done'
                                    />
                                </View>
                                <View style={Styles.textinputunderline}>
                                    <View style={Styles.fullunderline}></View>
                                </View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkey}>{STRINGS.t('underwriting$')}</Text>
                                    <TextInput keyboardType="numeric" 
                                        style={Styles.width30} 
                                        editable={this.state.editable} 
                                        underlineColorAndroid='transparent' 
                                        value={this.state.conventionalsettings.underwriting}
                                        onChangeText={(val)=>this.updateconventionalsettingstate(val,"underwriting")}
                                        returnKeyType= 'done'
                                    />
                                </View>
                                <View style={Styles.textinputunderline}>
                                    <View style={Styles.fullunderline}></View>
                                </View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkey}>{STRINGS.t('processingfee$')}</Text>
                                    <TextInput keyboardType="numeric" 
                                        style={Styles.width30} 
                                        editable={this.state.editable} 
                                        underlineColorAndroid='transparent' 
                                        value={this.state.conventionalsettings.processingfee}
                                        onChangeText={(val)=>this.updateconventionalsettingstate(val,"processingfee")}
                                        returnKeyType= 'done'
                                    />
                                </View>
                                <View style={Styles.textinputunderline}>
                                    <View style={Styles.fullunderline}></View>
                                </View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkey}>{STRINGS.t('appraisalfee$')}</Text>
                                    <TextInput keyboardType="numeric" 
                                        style={Styles.width30} 
                                        editable={this.state.editable} 
                                        underlineColorAndroid='transparent' 
                                        value={this.state.conventionalsettings.appraisalfee}
                                        onChangeText={(val)=>this.updateconventionalsettingstate(val,"appraisalfee")}
                                        returnKeyType= 'done'
                                    />
                                </View>
                                <View style={[Styles.textinputunderline,{marginBottom:50}]}>
                                    <View style={Styles.fullunderline}></View>
                                </View>
                                
                            </ScrollView>
                        )}
                        {renderIf(this.state.dropdownval == 'Commissions')(
                            <ScrollView
                                scrollEnabled={true}
                                showsVerticalScrollIndicator={true}
                                keyboardShouldPersistTaps="always"
                                keyboardDismissMode='on-drag'
                                style={Styles.settingsscrollview}
                            > 
                                <View style={[Styles.detailbox,{marginBottom:20}]}>
                                    <Text style={Styles.togglekey}>Options</Text>
                                    {this.state.optiontoggle == 'traditional' ? 
                                    <TouchableOpacity  style={Styles.togglevalboxsel} onPress={()=>(this.state.optiontoggle == 'tiered') ? [this.setState({optiontoggle : 'traditional'}), this.callCommissionSettings('traditional')] : ''}>
                                        <Text style={Styles.togglevalsel}>Traditional</Text>
                                    </TouchableOpacity> : 
                                    <TouchableOpacity  style={Styles.togglevalbox} onPress={()=>(this.state.optiontoggle == 'tiered') ? [this.setState({optiontoggle : 'traditional'}), this.callCommissionSettings('traditional')] : ''}>
                                        <Text style={Styles.toggleval}>Traditional</Text>
                                    </TouchableOpacity>}
                                    {this.state.optiontoggle == 'traditional' ? 
                                    <TouchableOpacity  style={Styles.togglevalbox} onPress={()=>(this.state.optiontoggle == 'traditional') ? [this.setState({optiontoggle : 'tiered'}), this.callCommissionSettings('tiered')] : ''}>
                                        <Text style={Styles.toggleval}>Tiered</Text> 
                                    </TouchableOpacity> : 
                                    <TouchableOpacity  style={Styles.togglevalboxsel} onPress={()=>(this.state.optiontoggle == 'traditional') ? [this.setState({optiontoggle : 'tiered'}), this.callCommissionSettings('tiered')] : ''}>
                                        <Text style={Styles.togglevalsel}>Tiered</Text>
                                    </TouchableOpacity> }
                                </View>
                                <View style={[Styles.fullunderline, {marginBottom:20}]}></View>
                                {this.state.optiontoggle == 'traditional' ?
                                <View>
                                    <View style={Styles.detailbox}>
                                        <Text style={Styles.detailboxkey}>Brokerage Fee % of Sales Price</Text>
                                        <TextInput keyboardType="numeric" 
                                            style={Styles.width30} 
                                            editable={this.state.editable} 
                                            underlineColorAndroid='transparent' 
                                            value={this.state.CommissionSetting.brokerageFeeofSalePrice}
                                            onChangeText={(val)=>this.updateCommissionSettingsstate(val,"brokerageFeeofSalePrice")}
                                            returnKeyType= 'done'
                                        />
                                    </View>
                                    <View style={Styles.textinputunderline}>
                                        <View style={Styles.fullunderline}></View>
                                    </View>
                                </View>:
                                <View>
                                    <View style={Styles.TableHead}>
                                        <View style={Styles.HeadBox}>
                                            <Text style={Styles.HeadText}>From</Text>
                                        </View>
                                        <View style={Styles.HeadBox}>
                                            <Text style={Styles.HeadText}>To</Text>
                                        </View>
                                        <View style={Styles.HeadBox}>
                                            <Text style={Styles.HeadText}>Rate</Text>
                                        </View>
                                    </View>
                                    <View style={[Styles.TableHead,{marginTop:20}]}>
                                        <View style={Styles.HeadBox}>
                                            <Text style={Styles.BodyText}>$0.00</Text>
                                        </View>
                                        <View style={Styles.HeadBox}>
                                            <Text style={Styles.BodyText}>$100,000.00</Text>
                                        </View>
                                        <View style={Styles.HeadBox}>
                                            <TextInput keyboardType="numeric" 
                                                style={Styles.BodyText}
                                                editable={this.state.editable} 
                                                underlineColorAndroid='transparent' 
                                                value={this.state.CommissionSetting.first_one_lakh_rate}
                                                onChangeText={(val)=>this.updateCommissionSettingsstate(val,"first_one_lakh_rate")}
                                                returnKeyType= 'done'
                                            />
                                        </View>
                                    </View>
                                    <View style={[Styles.TableHead,{marginBottom:10}]}>
                                        <View style={Styles.HeadBoxUnderline}>
                                        </View>
                                        <View style={Styles.HeadBoxUnderline}>
                                        </View>
                                        <View style={Styles.HeadBoxUnderline}>
                                        <View style={Styles.fullunderline}></View>
                                        </View>
                                    </View>
                                    <View style={Styles.TableHead}>
                                        <View style={Styles.HeadBox}>
                                            <Text style={Styles.BodyText}>$100,000.01</Text>
                                        </View>
                                        <View style={Styles.HeadBox}>
                                            <TextInput keyboardType="numeric" 
                                                style={Styles.BodyText}
                                                editable={this.state.editable} 
                                                underlineColorAndroid='transparent' 
                                                value={this.state.CommissionSetting.balance1_to}
                                                onChangeText={(val)=>[this.updateCommissionSettingsstate(val,"balance1_to"), this.updateCommissionSettingsstate(val+0.01,"balance2_from")]}
                                                returnKeyType= 'done'
                                            />
                                        </View>
                                        <View style={Styles.HeadBox}>
                                            <TextInput keyboardType="numeric" 
                                                style={Styles.BodyText}
                                                editable={this.state.editable} 
                                                underlineColorAndroid='transparent' 
                                                value={this.state.CommissionSetting.balance1_rate}
                                                onChangeText={(val)=>this.updateCommissionSettingsstate(val,"balance1_rate")}
                                                returnKeyType= 'done'
                                            />
                                        </View>
                                    </View>
                                    <View style={[Styles.TableHead,{marginBottom:10}]}>
                                        <View style={Styles.HeadBoxUnderline}>
                                        </View>
                                        <View style={Styles.HeadBoxUnderline}>
                                            <View style={Styles.fullunderline}></View>
                                        </View>
                                        <View style={Styles.HeadBoxUnderline}>
                                        <View style={Styles.fullunderline}></View>
                                        </View>
                                    </View>
                                    <View style={Styles.TableHead}>
                                        <View style={Styles.HeadBox}>
                                            <Text style={Styles.BodyText}>${this.state.CommissionSetting.balance2_from}</Text>
                                        </View>
                                        <View style={Styles.HeadBox}>
                                            <TextInput keyboardType="numeric" 
                                                style={Styles.BodyText}
                                                editable={this.state.editable} 
                                                underlineColorAndroid='transparent' 
                                                value={this.state.CommissionSetting.balance2_to}
                                                onChangeText={(val)=>this.updateCommissionSettingsstate(val,"balance2_to")}
                                                returnKeyType= 'done'
                                            />
                                        </View>
                                        <View style={Styles.HeadBox}>
                                            <TextInput keyboardType="numeric" 
                                                style={Styles.BodyText}
                                                editable={this.state.editable} 
                                                underlineColorAndroid='transparent' 
                                                value={this.state.CommissionSetting.balance2_rate}
                                                onChangeText={(val)=>this.updateCommissionSettingsstate(val,"balance2_rate")}
                                                returnKeyType= 'done'
                                            />
                                        </View>
                                    </View>
                                    
                                    <View style={[Styles.TableHead,{marginBottom:10}]}>
                                        <View style={Styles.HeadBoxUnderline}>
                                        </View>
                                        <View style={Styles.HeadBoxUnderline}>
                                            <View style={Styles.fullunderline}></View>
                                        </View>
                                        <View style={Styles.HeadBoxUnderline}>
                                        <View style={Styles.fullunderline}></View>
                                        </View>
                                    </View>
                                <View style={[Styles.fullunderline, {marginBottom:20,marginTop:10}]}></View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkey}>Listing Rate</Text>
                                    <TextInput keyboardType="numeric" 
                                        style={Styles.width30} 
                                        editable={this.state.editable} 
                                        underlineColorAndroid='transparent' 
                                        value={this.state.CommissionSetting.listing_rate}
                                        onChangeText={(val)=>this.updateCommissionSettingsstate(val,"listing_rate")}
                                        returnKeyType= 'done'
                                    />
                                </View>
                                <View style={Styles.textinputunderline}>
                                    <View style={Styles.fullunderline}></View>
                                </View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkey}>Selling Rate</Text>
                                    <TextInput keyboardType="numeric" 
                                        style={Styles.width30} 
                                        editable={this.state.editable} 
                                        underlineColorAndroid='transparent' 
                                        value={this.state.CommissionSetting.selling_rate}
                                        onChangeText={(val)=>this.updateCommissionSettingsstate(val,"selling_rate")}
                                        returnKeyType= 'done'
                                    />
                                </View>
                                <View style={Styles.textinputunderline}>
                                    <View style={Styles.fullunderline}></View>
                                </View>
                                </View>}
                                
                            </ScrollView>
                        )}
                        {renderIf(this.state.dropdownval == 'Other Escrow')(
                            <ScrollView
                                scrollEnabled={true}
                                showsVerticalScrollIndicator={true}
                                keyboardShouldPersistTaps="always"
                                keyboardDismissMode='on-drag'
                                style={Styles.settingsscrollview}
                            > 
                                <View style={Styles.selectedvalbox}>
                                    <Text style={Styles.selectedvalboxtext}>{STRINGS.t('buyer')}</Text>
                                </View>
                                <View style={Styles.fullunderline}></View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkey}>{STRINGS.t('baseRate') + ' ($)'}</Text>
                                    <TextInput keyboardType="numeric" 
                                        style={Styles.width30} 
                                        editable={this.state.editable} 
                                        underlineColorAndroid='transparent' 
                                        value={this.state.otherEscrow.buyerBaseRate}
                                        onChangeText={(val)=>this.updateotherEscrowSettingsstate(val,"buyerBaseRate")}
                                        returnKeyType= 'done'
                                    />
                                </View>
                                <View style={Styles.textinputunderline}>
                                    <View style={Styles.fullunderline}></View>
                                </View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkey}>{STRINGS.t('RatePer1000') + ' ($)'}</Text>
                                    <TextInput keyboardType="numeric" 
                                        style={Styles.width30} 
                                        editable={this.state.editable} 
                                        underlineColorAndroid='transparent' 
                                        value={this.state.otherEscrow.buyerRatePerThousand}
                                        onChangeText={(val)=>this.updateotherEscrowSettingsstate(val,"buyerRatePerThousand")}
                                        returnKeyType= 'done'
                                    />
                                </View>
                                <View style={Styles.textinputunderline}>
                                    <View style={Styles.fullunderline}></View>
                                </View>

                                <View style={[Styles.fullunderline,{marginTop:20}]}></View>
                                <View style={Styles.selectedvalbox}>
                                    <Text style={Styles.selectedvalboxtext}>{STRINGS.t('seller')}</Text>
                                </View>
                                <View style={Styles.fullunderline}></View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkey}>{STRINGS.t('baseRate') + ' ($)'}</Text>
                                    <TextInput keyboardType="numeric" 
                                        style={Styles.width30} 
                                        editable={this.state.editable} 
                                        underlineColorAndroid='transparent' 
                                        value={this.state.otherEscrow.sellerBaseRate}
                                        onChangeText={(val)=>this.updateotherEscrowSettingsstate(val,"sellerBaseRate")}
                                        returnKeyType= 'done'
                                    />
                                </View>
                                <View style={Styles.textinputunderline}>
                                    <View style={Styles.fullunderline}></View>
                                </View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkey}>{STRINGS.t('RatePer1000') + ' ($)'}</Text>
                                    <TextInput keyboardType="numeric" 
                                        style={Styles.width30} 
                                        editable={this.state.editable} 
                                        underlineColorAndroid='transparent' 
                                        value={this.state.otherEscrow.sellerRatePerThousand}
                                        onChangeText={(val)=>this.updateotherEscrowSettingsstate(val,"sellerRatePerThousand")}
                                        returnKeyType= 'done'
                                    />
                                </View>
                                <View style={Styles.textinputunderline}>
                                <View style={Styles.fullunderline}></View>
                                </View>
                                    <View style={[Styles.fullunderline,{marginTop:20}]}></View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkeylarge}>{STRINGS.t('apply')}</Text>
                                    <TouchableOpacity style={Styles.checkboxbtn} disabled={!this.state.editable} onPress={()=>{(this.state.otherEscrowapply == 0) ? this.setState({otherEscrowapply:1}) :  this.setState({otherEscrowapply:false})}}>
                                        {(this.state.otherEscrowapply == 0) ? <Image style={Styles.checkboxstyle} source={Images.unselected_checkbox}/> : <Image style={Styles.checkboxstyle} source={Images.selected_checkbox}/>}
                                    </TouchableOpacity>
                                </View>
                                
                            </ScrollView>
                        )}
                        {renderIf(this.state.dropdownval == 'CDTC/TRID')(
                            <ScrollView
                                scrollEnabled={true}
                                showsVerticalScrollIndicator={true}
                                keyboardShouldPersistTaps="always"
                                keyboardDismissMode='on-drag'
                                style={Styles.settingsscrollview}
                            > 
                                <View style={Styles.selectedvalbox}>
                                    <Text style={Styles.selectedvalboxtext}>{STRINGS.t('cdtc')}</Text>
                                </View>
                                <View style={Styles.fullunderline}></View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkeylarge}>{STRINGS.t('includecdtc')}</Text>
                                    <TouchableOpacity style={Styles.checkboxbtn} disabled={!this.state.editable} onPress={()=>{(this.state.cdtc == 0) ? this.setState({cdtc:1}) :  this.setState({cdtc:0})}}>
                                        {(this.state.cdtc == false) ? <Image style={Styles.checkboxstyle} source={Images.unselected_checkbox}/> : <Image style={Styles.checkboxstyle} source={Images.selected_checkbox}/>}
                                    </TouchableOpacity>
                                </View>
                                <View style={[Styles.fullunderline,{marginTop:30}]}></View>
                                <View style={Styles.selectedvalbox}>
                                    <Text style={Styles.selectedvalboxtext}>{STRINGS.t('trid')}</Text>
                                </View>
                                <View style={Styles.fullunderline}></View>
                                <View style={Styles.detailbox}>
                                    <Text style={Styles.detailboxkeylarge}>{STRINGS.t('includetrid')}</Text>
                                    <TouchableOpacity style={Styles.checkboxbtn} disabled={!this.state.editable} onPress={()=>{(this.state.cfpb == 0) ? this.setState({cfpb:1}) :  this.setState({cfpb:0})}}>
                                        {(this.state.cfpb == 0) ? <Image style={Styles.checkboxstyle} source={Images.unselected_checkbox}/> : <Image style={Styles.checkboxstyle} source={Images.selected_checkbox}/>}
                                    </TouchableOpacity>
                                </View>
                                
                            </ScrollView>
                        )}
                        {renderIf(this.state.dropdownval == 'Loan Comparison')(
                            <ScrollView
                                scrollEnabled={true}
                                showsVerticalScrollIndicator={true}
                                keyboardShouldPersistTaps="always"
                                keyboardDismissMode='on-drag'
                                style={Styles.settingsscrollview}
                            > 
                                <View style={Styles.selectedvalbox}>
                                    <Text style={Styles.selectedvalboxtext}>{STRINGS.t('SPL')}</Text>
                                </View>
                                <View style={Styles.fullunderline}></View>
                                <View style={Styles.submitbox}>
                                    <View style={Styles.detailbox}>
									<Text style={{padding: 5}}>$</Text>
                                        <TextInput 
                                            keyboardType="numeric" 
                                            style={Styles.width90} 
                                            editable={this.state.editable} 
                                            underlineColorAndroid='transparent'
                                            value={this.state.loanComparison}
                                            onChangeText={(val)=>this.setState({loanComparison:val})}
                                            returnKeyType= 'done'
                                        />
                                        
                                    </View>
                                    <View style={Styles.fullunderline}></View>
                                </View>
                            </ScrollView>
                        )}
                    </View>
                </View>
				<DropdownAlert ref={(ref) => this.dropdown = ref}/>
            </View>
        )
    }
}