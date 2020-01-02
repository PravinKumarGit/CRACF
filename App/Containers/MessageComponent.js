import React, { Component } from 'react';
import Images from '../Themes/Images.js';
import SellerStyle from './Styles/SellerStyle';
import renderIf from 'render-if';
import { Container, Content, InputGroup, Input, Icon } from 'native-base';
import Styles from './Styles/LoginScreenStyle'    // Import LoginScreenStyle.js class from Styles Folder to maintain UI.
import BuyerStyle from './Styles/BuyerStyle';
import {Image, View, Modal, Text, TextInput, TouchableOpacity, ScrollView} from 'react-native';
import { callPostApi } from '../Services/webApiHandler.js' // Import 
import STRINGS from '../GlobalString/StringData'  // Import StringData.js class for string localization.
import Spinner from 'react-native-loading-spinner-overlay';
var GLOBAL = require('../Constants/global');
import Tags from "react-native-tags";
import DropdownAlert from 'react-native-dropdownalert'

export default class MessageComponent extends Component{
	constructor() {
		super();
		this.state = {
			popupAttachmentType : "image",
			text_message : '',
			to_email     : '',
			visble       : false,
			animating    : 'false',
			tags         : '',
			phoneNumberState : "",
			phoneNumberArr : "",
			phoneNumberError : '',
		}	
	}

	sendEmail() {

		var txMsgSellerPdfArray = {
			"tophoneno"                 : this.refs.tags.state.tags.toString(),
			"tobody"                    : this.state.text_message,
			"userId"                    : this.props.textMsgPdfArray.userId,
			"companyId"                 : this.props.textMsgPdfArray.companyId,
			"city"                      : this.props.textMsgPdfArray.city,
			"state"                     : this.props.textMsgPdfArray.state,
			"zip"                       : this.props.textMsgPdfArray.zip,		
			"address"              		: this.props.textMsgPdfArray.address,
			"preparedFor"            	: this.props.textMsgPdfArray.Prepared_For,
			"buyerLoanType"             : this.props.textMsgPdfArray.buyerLoanType,
			"totalClosingCosts"         : this.props.textMsgPdfArray.closingCost,
			"salesPrice"                : this.props.textMsgPdfArray.salesPrice,
			"estimatedClosingDate"      : this.props.textMsgPdfArray.estClosingDate,
			"estimatedTaxProrations"    : this.props.textMsgPdfArray.estimatedTaxProration,
		}	

	if(this.props.textMsgPdfArray.caltype == 'seller') {
		
		txMsgSellerPdfArray.caltype						= "seller"
		txMsgSellerPdfArray.calc                   		= this.props.textMsgPdfArray.caltype;
		txMsgSellerPdfArray.totalOtherCosts  			= this.props.textMsgPdfArray.totalOtherCost;
		txMsgSellerPdfArray.loansToBePaidPayoff_Total	= this.props.textMsgPdfArray.balanceOfAllLoans;
		txMsgSellerPdfArray.bottomlineTotalAllCosts		= this.props.textMsgPdfArray.totalAllCost;
		txMsgSellerPdfArray.estimatedSellersNet			= this.props.textMsgPdfArray.estimatedSellerNet;
		
	} else if(this.props.textMsgPdfArray.caltype == 'netfirst') {

		txMsgSellerPdfArray.caltype 					= "seller";
		txMsgSellerPdfArray.calc 						= this.props.textMsgPdfArray.caltype;
		txMsgSellerPdfArray.totalOtherCosts				= this.props.textMsgPdfArray.totalOtherCost;
		txMsgSellerPdfArray.loansToBePaidPayoff_Total	= this.props.textMsgPdfArray.balanceOfAllLoans;
		txMsgSellerPdfArray.bottomlineTotalAllCosts		= this.props.textMsgPdfArray.totalAllCost;
		txMsgSellerPdfArray.estimatedSellersNet			= this.props.textMsgPdfArray.estimatedSellerNet;
		
	} else if (this.props.textMsgPdfArray.caltype == 'buyer') {

		txMsgSellerPdfArray.caltype 			= "buyer";
		txMsgSellerPdfArray.downPayment			= this.props.textMsgPdfArray.downPayment;
		txMsgSellerPdfArray.totalPrepaidItems	= this.props.textMsgPdfArray.totalPrepaidItems;
		txMsgSellerPdfArray.totalMonthlyPayment	= this.props.textMsgPdfArray.totalMonthlyPayment;
		txMsgSellerPdfArray.totalInvestment		= this.props.textMsgPdfArray.totalInvestment;


	} else if (this.props.textMsgPdfArray.caltype == 'refinance') {

		txMsgSellerPdfArray.caltype							= "refinance"
		txMsgSellerPdfArray.amount							= this.props.textMsgPdfArray.amount;
		txMsgSellerPdfArray.conventionalAmount				= this.props.textMsgPdfArray.conventionalAmount;
		txMsgSellerPdfArray.interestRate1					= this.props.textMsgPdfArray.interestRate1;
		txMsgSellerPdfArray.interestRate2					= this.props.textMsgPdfArray.interestRate2;
		txMsgSellerPdfArray.termInYears1					= this.props.textMsgPdfArray.termInYears1;
		txMsgSellerPdfArray.termInYears2					= this.props.textMsgPdfArray.termInYears2;
		txMsgSellerPdfArray.loansToBePaidPayoff_1Balance	= this.props.textMsgPdfArray.loansToBePaidPayoff_1Balance;
		txMsgSellerPdfArray.loansToBePaidPayoff_2Balance	= this.props.textMsgPdfArray.loansToBePaidPayoff_2Balance;
		txMsgSellerPdfArray.loansToBePaidPayoff_1Rate		= this.props.textMsgPdfArray.loansToBePaidPayoff_1Rate;
		txMsgSellerPdfArray.loansToBePaidPayoff_2Rate		= this.props.textMsgPdfArray.loansToBePaidPayoff_2Rate;
		txMsgSellerPdfArray.totalPrepaidItems				= this.props.textMsgPdfArray.totalPrepaidItems;
		txMsgSellerPdfArray.totalMonthlyPayment				= this.props.textMsgPdfArray.totalMonthlyPayment;
		txMsgSellerPdfArray.borrowerlbl						= this.props.textMsgPdfArray.borrowerlbl;
		txMsgSellerPdfArray.totalInvestment					= this.props.textMsgPdfArray.totalInvestment;
		
	}  else if (this.props.textMsgPdfArray.caltype == 'quotes') {
		txMsgSellerPdfArray.caltype			  = "quotes"
		txMsgSellerPdfArray.loanType		  = this.props.textMsgPdfArray.loanType;                         
		txMsgSellerPdfArray.loanamount		  = this.props.textMsgPdfArray.loanamount;                           
		txMsgSellerPdfArray.states			  = this.props.textMsgPdfArray.states;                     
		txMsgSellerPdfArray.county			  = this.props.textMsgPdfArray.county;                       
		txMsgSellerPdfArray.ownersPolicy	  = this.props.textMsgPdfArray.ownersPolicy;                        
		txMsgSellerPdfArray.lendersPolicy     = this.props.textMsgPdfArray.lendersPolicy;                        
		txMsgSellerPdfArray.escrowBuyerFee	  = this.props.textMsgPdfArray.escrowBuyerFee;                 
		txMsgSellerPdfArray.escrowSellerFee	  = this.props.textMsgPdfArray.escrowSellerFee;                 
		txMsgSellerPdfArray.escrowPolicyType  = this.props.textMsgPdfArray.escrowPolicyType;                    
		txMsgSellerPdfArray.ownersPolicyType  = this.props.textMsgPdfArray.ownersPolicyType;                   
		txMsgSellerPdfArray.lendersPolicyType = this.props.textMsgPdfArray.lendersPolicyType;
		txMsgSellerPdfArray.lenderServiceFee  = this.props.textMsgPdfArray.lenderServiceFee;                
		txMsgSellerPdfArray.ownerServiceFee	  = this.props.textMsgPdfArray.ownerServiceFee;               
		txMsgSellerPdfArray.lenderServiceType = this.props.textMsgPdfArray.lenderServiceType;                   
		txMsgSellerPdfArray.ownerServiceType  = this.props.textMsgPdfArray.ownerServiceType;                  
		txMsgSellerPdfArray.cplBuyerFee		  = this.props.textMsgPdfArray.cplBuyerFee;               txMsgSellerPdfArray.cplSellerFee	  = this.props.textMsgPdfArray.cplSellerFee;
		
	}

		console.log("txMsgSellerPdfArray " + JSON.stringify(txMsgSellerPdfArray));
		this.setState({
			animating : 'true'
		});

		callPostApi(GLOBAL.BASE_URL + GLOBAL.seller_send_text_message_api, txMsgSellerPdfArray, this.state.access_token)
			.then((response) => { 
				console.log("result resp " + JSON.stringify(result));
				if(result.status == 'success') {
					this.setState({
						animating : 'false'
					});
					this.props.cancelEmailPopup(result.status);
				}
		});
	}

	formatPhone(tags) {
		for(i=0; i < tags.length; i++) {
			if(tags[i].length > 12 ) {
				this.dropdown.alertWithType('error', 'Error', 'Phone number must have 10 digits.');
			}
		}
	}

    render() {
		if(this.state.animating == 'true') {
			this.state.scrollvalue = false;
			this.state.visble = true;
		} else {
			this.state.scrollvalue = true;
			this.state.visble = false;
		}
	    return(

			<View style={{flex:1}}>
				<View style={{ flex: 1 }}>
			<Spinner visible={this.state.visble} textContent={this.state.loadingText} textStyle={{color: '#FFF'}} />
			</View>
			<Modal
			animationType="slide"
			transparent={false}
			visible={this.props.emailModalVisible}
			onRequestClose={() => {alert("Modal has been closed.")}}
			>
			<ScrollView scrollEnabled={true} showsVerticalScrollIndicator={true}  keyboardShouldPersistTaps="always" keyboardDismissMode='on-drag'>
				<View style={[BuyerStyle.HeaderContainer, {backgroundColor : '#ff3333'}]}>
					<Image style={BuyerStyle.HeaderBackground} source={Images.header_background}></Image>
					<TouchableOpacity style={{width:'20%', justifyContent:'center'}} onPress={() => this.props.cancelEmailPopup()}>
					<Text style={[BuyerStyle.headerbtnText]}>CANCEL</Text>
					</TouchableOpacity>
					<Text style={BuyerStyle.header_title_text_message}>{STRINGS.t('TxtMsgToCstmr')}</Text>
					<TouchableOpacity style={{width:'20%', justifyContent:'center'}} onPress={() => {this.sendEmail()}}>
						<Text style={[BuyerStyle.headerbtnText,{alignSelf:'flex-end', marginRight : 5, borderWidth:0.5,borderColor:'#ffffff',}]}>SEND</Text>
					</TouchableOpacity>
				</View>	
				<View>
					<View style={{flexDirection : 'column'}}>
						<View style={SellerStyle.scrollable_container_child_center}>
							<View style={{width: '25%',justifyContent: 'center'}}>
								<Text style={SellerStyle.text_style_text_message}>
								{STRINGS.t('EmailTo')}:
								</Text>
							</View>
							<View style={{width: '75%',flexDirection: 'row'}}>
							<Tags
								initialText=""
								textInputProps={{
									placeholder: "Contact Number",
									keyboardType : "numeric",
								}}
								ref="tags"
								initialTags={[]}
								onChangeTags={tags =>  this.formatPhone(tags)}
								onTagPress={(index, tagLabel, event, deleted) =>
								console.log(index, tagLabel, event, deleted ? "deleted" : "not deleted")
								}
								containerStyle={{ width : '100%', justifyContent: "flex-start"}}
								inputStyle={{ backgroundColor: "white" }}
							/>
							</View>
						</View>
						<View style={SellerStyle.lineView}></View>	
						<View style={SellerStyle.scrollable_container_child_center}>
							<View style={{width: '25%',justifyContent: 'center'}}>
								<Text style={[SellerStyle.text_style_text_message, {marginBottom : 20}]}>
								{STRINGS.t('common_message')}:
								</Text>
							</View>
							<View style={{width: '75%',flexDirection: 'row'}}>
								<TextInput selectTextOnFocus={ true } placeholder={STRINGS.t('TextMessage')} multiline = {true} numberOfLines = {4} underlineColorAndroid='transparent' style={{width: '100%', fontSize:14}} keyboardType="email-address" onChangeText={(value) => this.setState({text_message: value})} value={this.state.text_message.toString()}/>
							</View>
						</View>
						<View style={SellerStyle.lineView}></View>
						<View style={SellerStyle.scrollable_container_child_center}>
							<View style={{width: '25%',justifyContent: 'center'}}>
								<Text style={[SellerStyle.text_style_text_message, {marginBottom : 20}]}>
				
								</Text>
							</View>
							<View style={{width: '75%',flexDirection: 'row'}}>
					
							</View>
						</View>
						<View style={SellerStyle.scrollable_container_child_center_buttons}>
							<View style={{width: '45%',justifyContent: 'center'}}>
							<TouchableOpacity style={Styles.buttonContainerSend}  onPress={() => {this.sendEmail()}}>
							<Text style={Styles.style_btnLogin}> {STRINGS.t('Send')}</Text>
							</TouchableOpacity>
							</View>
							<View style={{width: '45%',flexDirection: 'row', padding : 5}}>
							<TouchableOpacity style={Styles.buttonContainer} onPress={() => this.props.cancelEmailPopup()}>
							<Text style={Styles.style_btnLogin}> {STRINGS.t('Cancel')}</Text>
							</TouchableOpacity>
							</View>
						</View>
					</View>
				</View>
			</ScrollView>
			<DropdownAlert
				ref={(ref) => this.dropdown = ref}
		
			/>
			</Modal>
	
	</View>	
		
        );
    }
}

