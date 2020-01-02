import React, { Component, } from 'react'
import { View, Text, StyleSheet, Image, TextInput, AsyncStorage, Alert, ScrollView, TouchableOpacity, NetInfo, Modal, Animated, TouchableHighlight, AlertAndroid, AppState, Linking} from 'react-native';
import dashboardStyle from './Styles/DashboardStyle'    // Import DashboardStyle.js class from Styles Folder to maintain UI.
import STRINGS from '../GlobalString/StringData'  // Import StringData.js class for string localization.
var Header = require('./HomeHeader');
import Images from '../Themes/Images.js'          // Import Images.js class from Image Folder for images.
import CustomStyle from './Styles/CustomStyle';
var alertMessage = 'Are you sure you want to logout!';
import ShowActivityIndicator from './ShowActivityIndicator'; 
import Popup from 'react-native-popup';
import { PERSISTENT_LOGIN } from './Login';
import Voice from 'react-native-voice';
var GLOBAL = require('../Constants/global');
import { callGetApi, callPostApi} from '../Services/webApiHandler.js' // Import 
import AuthenticateUser from '../Services/Authentication.js'; // For authenticating user
import {authenticateUser, validateEmail} from '../Services/CommonValidation.js'  // Import CommonValidation class to access common methods for validations.
var mssge = 'New Updated Closing Costs are Available, Please Update.';
class Dashboard extends Component {
	constructor(props) {
			super(props);

			this.state = {
				recognized: '',
				speakToTextVal: false,
				pitch: '',
				error: '',
				end: '',
				started: '',
				results: [],
				partialResults: [],
				newDateToCompare : '',
				first_name: '',
				last_name: '',
				email_address: '',
				user_state: '',
				user_country: '',
				user_state_exist: false,
				confirm_email_address: '',
				isVisible : false,
				speakToTextBox : false,
				speakToText : false,
				speakTextStatus: 'Please speak & wait for recognization...',
			};
			Voice.onSpeechStart = this.onSpeechStart.bind(this);
			Voice.onSpeechRecognized = this.onSpeechRecognized.bind(this);
			Voice.onSpeechEnd = this.onSpeechEnd.bind(this);
			Voice.onSpeechError = this.onSpeechError.bind(this);
			Voice.onSpeechResults = this.onSpeechResults.bind(this);
			Voice.onSpeechPartialResults = this.onSpeechPartialResults.bind(this);
			Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged.bind(this);

			this.handleFirstConnectivityChange = this.handleFirstConnectivityChange.bind(this);

	  }
	
	  componentWillUnmount() {
		Voice.destroy().then(Voice.removeAllListeners);
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
		  //this._stopRecognizing();
				this.setState({
					partialResults: e.value[0],
				},this.VoiceNavigation);
		/* this.setState({
		  results: e.value,
		}); */
	  }
	
	  onSpeechPartialResults(e) {
			/* let b = e.value
			this.setState({
				partialResults: e.value,
			});
			if(this.state.stoppedRec == true){
				alert(b)
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
	
	  	async _startRecognizing(e) {
			this.setState({
			recognized: '',
			pitch: '',
			error: '',
			started: '',
			results: [],
			partialResults: [],
			end: ''
			});
			try {
			await Voice.start('en-US');
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
		
		VoiceNavigation(){
			//console.log("test",this.state.partialResults)
			if(this.state.partialResults != ''){				
				//alert(this.state.partialResults);
				matches = String(this.state.partialResults);
				buyer = matches.includes("buyer") || matches.includes("Buyer") || matches.includes("buy") || matches.includes("bi") || matches.includes("by") || matches.includes("ba") || matches.includes("bh") || matches.includes("bie")
				seller = matches.includes("sel") || matches.includes("sal") || matches.includes("sol") || matches.includes("sail") || matches.includes("chal") || matches.includes("cel") || matches.includes("col") || matches.includes("hello")
				refinance = matches.includes("ref") || matches.includes("fin") || matches.includes("free") || matches.includes("reso") || matches.includes("repu") || matches.includes("nance")
				netfirst = matches.includes("net") || matches.includes("nut") || matches.includes("et") || matches.includes("nat") || matches.includes("first") || matches.includes("1st") || matches.includes("fast") || matches.includes("post")
				quickQuotes = matches.includes("quick quotes") || matches.includes("Quick quotes")
				addressBook = matches.includes("address book") || matches.includes("Address book")
				settings = matches.includes("sett") || matches.includes("set") || matches.includes("sat")
				language = matches.includes("language") || matches.includes("Language") || matches.includes("lang") || matches.includes("pank")
				account = matches.includes("account") || matches.includes("Account")
				titlerep = matches.includes("title rep") || matches.includes("Title rep")
				privacypolicy = matches.includes("privacy") || matches.includes("Privacy") 
				rentvsbuy = matches.includes("rent") || matches.includes("Rent")
				this.setState({speakToTextBox:false});
				if(buyer != false){
					this.props.navigator.push({name: 'BuyerCalculator', index: 0 });
					return
				}
				if(seller != false){
					//alert(seller);
					this.props.navigator.push({name: 'SellerCalculator', index: 0 });
					return
				}
				if(refinance != false){
					this.props.navigator.push({name: 'Refinance', index: 0 });
					return
				}
				if(netfirst != false){
					this.props.navigator.push({name: 'NetFirstCalculator', index: 0 });
					return
				}
				if(quickQuotes != false){
					this.props.navigator.push({name: 'QuickQuotes', index: 0 });
					return
				}
				if(addressBook != false){
					this.props.navigator.push({name: 'AddressBook', index: 0 });
					return
				}
				if(settings != false){
					this.props.navigator.push({name: 'AppSettings', index: 0 });
					return
				}
				if(language != false){
					this.props.navigator.push({name: 'Language', index: 0 });
					return
				}
				if(account != false){
					this.props.navigator.push({name: 'Account', index: 0 });
					return
				}
				if(titlerep != false){
					this.props.navigator.push({name: 'MyTitleRep', index: 0 });
					return
				}
				if(privacypolicy != false){
					this.props.navigator.push({name: 'PrivacyPolicy', index: 0 });
					return
				}
				if(rentvsbuy != false){
					this.props.navigator.push({name: 'RentVsBuyCalculator', index: 0 });
					return
				}
			}
			this._destroyRecognizer(this)
		}
	
	  async _cancelRecognizing(e) {
		try {
		  await Voice.cancel();
		} catch (e) {
		  console.error(e);
		}
	  }
	
	  async _destroyRecognizer(e) {
			try {
				await Voice.destroy();
			} catch (e) {
				console.error(e);
			}
			this.setState({
				recognized: '',
				pitch: '',
				error: '',
				started: '',
				user_id : '',
				company_id : '',
				access_token : '',
				postal_code : '',
				results: [],
				appID:'',
				mfaToken:'',
				salesRep1:'',
				salesRep1Email:'',
				salesRep2:'',
				salesRep2Email:'',
				end: ''
			});
	  }

 springValue = new Animated.Value(0.3);

 
 handleFirstConnectivityChange(connectionInfo) {
	console.log('First change, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);
}

componentWillMount () {

	/**====================== BY LOVEDEEP SINGH - 891 (M - 8047035049 For Help) ================================= 
	 * 
	 * This is used to remove session for multiple offer as if user goes to dashboard page and again entered into
	 * multiple offer calculator. 
	 **/

	AsyncStorage.removeItem("session_Multi_offer");
	AsyncStorage.removeItem("editModeStatus");
	AsyncStorage.removeItem("calcOfferDt");
	
	
	NetInfo.getConnectionInfo().then((connectionInfo) => {
			this.setState({
					connectionInfo: connectionInfo.type
			})
			console.log('Initial, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);
		});

		NetInfo.addEventListener(
			'connectionChange',
			this.handleFirstConnectivityChange
		);
}

	async componentDidMount() {
	
		response = await authenticateUser();
		if(response == '1'){
			this.props.navigator.push({name: 'Login', index: 0 });
		}else{
			AsyncStorage.getItem('speakToTextVal').then((val)=>{
				if(val == 'true'){
					this.setState({speakToTextVal: true})
				}else if(val == 'false'){
					this.setState({speakToTextVal: false})
				}
			})
			AsyncStorage.getItem("userDetail", (err, result) => {			
			  newstr = result.replace(/\\/g, "");
				newstr = JSON.parse(newstr);		
			 	this.setState({
					user_id : newstr.user_id,
					user_state : newstr.user_state,
					user_county : newstr.user_county,
					username : newstr.username,
					company_id : newstr.company_id,
					access_token : newstr.access_token,
					postal_code : newstr.postal_code,
				}, this.checkDefaultSettings);

			});

			AsyncStorage.getItem(PERSISTENT_LOGIN).then(
				(resultpl) =>{ 
					if(resultpl !== null && resultpl !== 'false'){
						AsyncStorage.setItem("username", newstr.username);		
					} else {
						AsyncStorage.removeItem("username");
					} 
				});

			if(this.state.user_state != '' || this.state.user_state != 'null') {
				this.setState({
					user_state_exist : true
				});
			}	
		}	
	}

	componentWillUnmount() {
		NetInfo.removeEventListener(
				'connectionChange',
				handleFirstConnectivityChange
			);
	}


	checkDefaultSettings() {
			var settingUpdateRequest = {
				userId: this.state.user_id,
				companyId: this.state.company_id
			};
			callPostApi(GLOBAL.BASE_URL + GLOBAL.notify_for_setting_update, {userId: this.state.user_id, companyId: this.state.company_id
			}, this.state.access_token)
			.then((response) => {

				console.log("result data " + JSON.stringify(result));

				var now = new Date();				
				var date = (now.getMonth() + 1) + '-' + now.getDate() + '-' + now.getFullYear();
				if(result.data.showNotifyPopUp == 1) {					
					AsyncStorage.getItem("newDateToCompare").then((value) => {
						if(value == 'null' || value == null) {
							Alert.alert( 'CostsFirst', mssge, [ {text: 'REMIND ME LATER', onPress:this.onPressCancel.bind(this)}, {text: 'UPDATE', onPress:this.updateDefaultSettings.bind(this)}] );
						} else if (value == date) {
							Alert.alert( 'CostsFirst', mssge, [ {text: 'REMIND ME LATER', onPress:this.onPressCancel.bind(this)}, {text: 'UPDATE', onPress:this.updateDefaultSettings.bind(this)}] );
						}
					});
				}
			});	
	}

	onPressCancel() {
		var now = new Date();				
		var date = (now.getMonth() + 1) + '-' + now.getDate() + '-' + now.getFullYear();
		now.setDate(now.getDate() + 1);
		newDate = (now.getMonth() + 1) + '-' + now.getDate() + '-' + now.getFullYear();
		AsyncStorage.setItem("newDateToCompare", newDate);
	}

	updateDefaultSettings() {
		let apiCallObjtemp = {
			"userId": this.state.user_id,
			"companyId":this.state.company_id,
			"zip":this.state.postal_code
		};
		callPostApi(GLOBAL.BASE_URL + GLOBAL.reload_user_setting, apiCallObjtemp, this.state.access_token)
		.then((response) => {
			if(result.status == 'success') {
				Alert.alert('CostsFirst', result.message);
			} else {
				Alert.alert('CostsFirst', result.message);
			}	
			//console.log("degfault settings response " + JSON.stringify(result));
		});
	}

	speakTonavigate() {
		this.setState({speakToTextBox:false})
		this.VoiceNavigation()
	}
	
	 onBuyerPress() {
	   this.props.navigator.push({name: 'BuyerCalculator', index: 0 });
	 }
	 onMultipleOfferPress() {
	   this.props.navigator.push({name: 'SellerCalculator', params : 'multipleOffer', index: 0 });
	 }
	 onSellerPress() {
		this.props.navigator.push({name: 'SellerCalculator', params : 'seller', index: 0 });
	  }
	 onAccountPress() {
	   this.props.navigator.push({name: 'Account', index: 0 });
	 }
	 onChangePasswordPress() {
	   this.props.navigator.push({name: 'ChangePassword', index: 0 });
	 }
	 onQuickQuotesPress() {
	   this.props.navigator.push({name: 'QuickQuotes', index: 0 });
	 }
	
	onLogoutPress() {
	   Alert.alert( 'CostsFirst', alertMessage, [ {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')}, {text: 'OK', onPress:this.confirmlogout.bind(this)}] );
	//   AsyncStorage.removeItem(PERSISTENT_LOGIN);
	} 
	 
	 confirmlogout() {
		AsyncStorage.removeItem("userDetail", (err, result) => {});
		AsyncStorage.removeItem(PERSISTENT_LOGIN);
		this.props.navigator.push({name:'Login', index :0});			
	}
	
	onPrivacyPolicyPress() {
	   this.props.navigator.push({name: 'PrivacyPolicy', index: 0 });
	}
	onLanguagePress() {
		this.props.navigator.push({name: 'Language', index: 0 });
	}
	onChangeStatePress() {
		this.props.navigator.push({name: 'ChangeState', index: 0 });
	}
	onMyTitleRepPress() {
		this.props.navigator.push({name: 'MyTitleRep', index: 0 });
	}
	 
	onAppSettingsPress() {
		this.props.navigator.push({name: 'AppSettings', index: 0 });
	}
	onAddressBookPress() {
		this.props.navigator.push({name: 'AddressBook', index: 0 });
	}
	onNetFirstPress() {
		this.props.navigator.push({name: 'NetFirstCalculator', index: 0 });
	}
	onRefinancePress() {
		this.props.navigator.push({name: 'Refinance', index: 0 });
	}
	onRentVsBuyCalculatorPress() {
		this.props.navigator.push({name: 'RentVsBuyCalculator', index: 0 });
	}
	
	onPressHandle() {
		// alert
		this.popup.alert(1);
	}
	
	spring () {
		this.springValue.setValue(0.3)
		Animated.spring(
		  this.springValue,
		  {
			toValue: 1,
			friction:2
		  }
		).start()
	  }
	  
	_onHideUnderlay(name){
		this.setState({[name]: false})
  }
  _onShowUnderlay(name){
	this.setState({[name]: true})
	}
	
	setSpeaktoTextVal(){
		val = !this.state.speakToTextVal;

		this.setState({speakToTextVal: val})
		

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
	 
  render() {
		let stateExists;
		if(this.state.user_state_exist == true) {
			stateExists=<View>
							<Text 
								fontVariant='small-caps'
								style={{color : '#000000'}}>Set For : {this.state.user_county} County, {this.state.user_state}
							</Text>
						</View>
		} else {
			stateExists=<View>
							<Text 
								fontVariant='small-caps'
								style={{color : '#000000'}}>
							</Text>
						</View>  
		}
	 
	 return (
        <View style={{flex : 1}}>
					<View style={dashboardStyle.iphonexHeader}></View>
			<Header />		
			<View>
				{ this.state.animating == 'true' ? <ShowActivityIndicator /> : null }
					<Text onPress={()=> {this.setState({isVisible : true}),this.spring()}} style={{backgroundColor: 'transparent', fontWeight : 'bold', alignSelf: 'flex-end', marginTop : -40, color : '#ffffff', marginRight : 5}}>Logout</Text>
				<Popup ref={popup => this.popup = popup }/>
			</View>
			<Modal 
				transparent={true}
				visible={this.state.isVisible}
				onRequestClose={() => null}
			>
				<View style={dashboardStyle.PopupParent}  onPress={()=> {this.setState({isVisible : true})}}>
					<Animated.View
						style={[dashboardStyle.BounceView,{transform: [{scale: this.springValue}]}]}>
						<View style={dashboardStyle.PopupContainer}>
							<Text style={dashboardStyle.Heading1}>CostsFirst</Text>
							<Text style={dashboardStyle.Heading2}>Are you sure you want to logout?</Text>
							<View style={dashboardStyle.BottomButtonContainer}>
								<TouchableOpacity style={dashboardStyle.ButtonBorder1} onPress={()=>{this.setState({isVisible:false})}}>
									<Text style={dashboardStyle.buttonText1}>Cancel</Text>
								</TouchableOpacity>
								<TouchableOpacity style={dashboardStyle.ButtonBorder2} onPress={()=>{this.setState({isVisible:false}),this.confirmlogout()}}>
									<Text style={dashboardStyle.buttonText2}>Yes</Text>
								</TouchableOpacity>
							</View>
						</View>
					</Animated.View>	
				</View>
			</Modal>
			<Modal 
				transparent={true}
				visible={this.state.speakToTextBox}
				onRequestClose={() => null}
			>
				<View style={dashboardStyle.PopupParent}>
					<View	style={[dashboardStyle.BounceView]}>
						<View style={[dashboardStyle.PopupContainer,{minHeight:200}]}>
						<Image style={dashboardStyle.imageStyle} source={Images.micIcon} />
						 		<Text>
						 		  {this.state.speakTextStatus}
						 		</Text>
							<View style={dashboardStyle.BottomButtonContainer}>
								<TouchableOpacity style={dashboardStyle.ButtonBorder1} onPress={()=>{this.setState({speakToTextBox:false})}}>
									<Text style={dashboardStyle.buttonText1}>Cancel</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>	
				</View>
			</Modal>
				
			<ScrollView scrollEnabled={true} showsVerticalScrollIndicator={true}  keyboardShouldPersistTaps="always" keyboardDismissMode='on-drag'>
				<View style={{padding : 7, flexDirection : 'row'}}>
					{stateExists}
				</View>
			<View style={{flexDirection : 'row'}}>
				<View style={ this.state.buyerClosingCostBox ? dashboardStyle.mainBoxStyleOnpress : dashboardStyle.mainBoxStyle }>		
					<TouchableHighlight onPress={this.onBuyerPress.bind(this)} onHideUnderlay={this._onHideUnderlay.bind(this,"buyerClosingCostBox")} underlayColor='#1683c0' onShowUnderlay={this._onShowUnderlay.bind(this,"buyerClosingCostBox")}>
						<View style={dashboardStyle.touchableStyle}>
							<Image style={dashboardStyle.imageStyle} source={Images.buyer_closing_icon} />
								<Text style={dashboardStyle.textStyle}>{STRINGS.t('Buyer_Closing_Cost')}</Text>
						</View>
					</TouchableHighlight>
				</View>
				<View style={ this.state.sellerClosingCostBox ? dashboardStyle.mainBoxStyleOnpress : dashboardStyle.mainBoxStyle }>		
					<TouchableHighlight onPress={this.onSellerPress.bind(this)} onHideUnderlay={this._onHideUnderlay.bind(this,"sellerClosingCostBox")} underlayColor='#1683c0' onShowUnderlay={this._onShowUnderlay.bind(this,"sellerClosingCostBox")}>
						<View style={dashboardStyle.touchableStyle}>
							<Image style={dashboardStyle.imageStyle} source={Images.seller_closing_icon} />
							<Text style={dashboardStyle.textStyle}>{STRINGS.t('Seller_Closing_Cost')}</Text>
						</View>	
					</TouchableHighlight>
				</View>
				<View style={ this.state.multipleOfferBox ? dashboardStyle.mainBoxStyleOnpress : dashboardStyle.mainBoxStyle } style={ dashboardStyle.mainBoxStyle }>
					<TouchableHighlight onPress={this.onMultipleOfferPress.bind(this)} onHideUnderlay={this._onHideUnderlay.bind(this,"multipleOfferBox")} underlayColor='#1683c0' onShowUnderlay={this._onShowUnderlay.bind(this,"multipleOfferBox")}>
					<View style={dashboardStyle.touchableStyle}>
						<Image style={dashboardStyle.imageStyle} source={Images.multiple_offer_icon} />
						<Text style={dashboardStyle.textStyle}>{STRINGS.t('Seller_Multiple_Offer')}</Text>
					</View>					
					</TouchableHighlight>
				</View>			
			</View>
			<View style={{flexDirection : 'row'}}>

				<View style={ this.state.refinanceClosingCostBox ? dashboardStyle.mainBoxStyleOnpress : dashboardStyle.mainBoxStyle }>		
					<TouchableHighlight onPress={this.onRefinancePress.bind(this)} onHideUnderlay={this._onHideUnderlay.bind(this,"refinanceClosingCostBox")} underlayColor='#1683c0' onShowUnderlay={this._onShowUnderlay.bind(this,"refinanceClosingCostBox")}>
						<View style={dashboardStyle.touchableStyle}>
							<Image style={dashboardStyle.imageStyle} source={Images.refinance_closing_icon} />
							<Text style={dashboardStyle.textStyle}>{STRINGS.t('Refinance_Closing_Cost')}</Text>
						</View>	
					</TouchableHighlight>
				</View>

				<View style={ this.state.rentVsBuyBox ? dashboardStyle.mainBoxStyleOnpress : dashboardStyle.mainBoxStyle }>
					<TouchableHighlight onPress={this.onRentVsBuyCalculatorPress.bind(this)}  onHideUnderlay={this._onHideUnderlay.bind(this,"rentVsBuyBox")} underlayColor='#1683c0' onShowUnderlay={this._onShowUnderlay.bind(this,"rentVsBuyBox")}>
						<View style={dashboardStyle.touchableStyle}>
							<Image style={dashboardStyle.imageStyle} source={Images.rent_vs_buyer} />
							<Text style={dashboardStyle.textStyle}>{STRINGS.t('RentVsBuy')}</Text>
						</View>		
					</TouchableHighlight>
				</View>		

				<View style={ this.state.netFirstBox ? dashboardStyle.mainBoxStyleOnpress : dashboardStyle.mainBoxStyle }>	
					<TouchableHighlight onPress={this.onNetFirstPress.bind(this)} onHideUnderlay={this._onHideUnderlay.bind(this,"netFirstBox")} underlayColor='#1683c0' onShowUnderlay={this._onShowUnderlay.bind(this,"netFirstBox")}>
						<View style={dashboardStyle.touchableStyle}>
							<Image style={dashboardStyle.imageStyle} source={Images.net_first_icon} />
							<Text style={dashboardStyle.textStyle}>{STRINGS.t('Net_First')}</Text>
						</View>	
					</TouchableHighlight>
				</View>	
			</View>
			<View style={{flexDirection : 'row'}}>

				<View style={ this.state.quickQuotesBox ? dashboardStyle.mainBoxStyleOnpress : dashboardStyle.mainBoxStyle }>	
					<TouchableHighlight onPress={this.onQuickQuotesPress.bind(this)} onHideUnderlay={this._onHideUnderlay.bind(this,"quickQuotesBox")} underlayColor='#1683c0' onShowUnderlay={this._onShowUnderlay.bind(this,"quickQuotesBox")}>
						<View style={dashboardStyle.touchableStyle}>				
							<Image style={dashboardStyle.imageStyle} source={Images.quick_notes_icon} />
							<Text style={dashboardStyle.textStyle}>{STRINGS.t('Quick_Quotes')}</Text>
						</View>
					</TouchableHighlight>
				</View>

				<View style={ this.state.addressBookBox ? dashboardStyle.mainBoxStyleOnpress : dashboardStyle.mainBoxStyle }>
					<TouchableHighlight onPress={this.onAddressBookPress.bind(this)} onHideUnderlay={this._onHideUnderlay.bind(this,"addressBookBox")} underlayColor='#1683c0' onShowUnderlay={this._onShowUnderlay.bind(this,"addressBookBox")}>
						<View style={dashboardStyle.touchableStyle}>
							<Image style={dashboardStyle.imageStyle} source={Images.address_book_icon} />
							<Text style={dashboardStyle.textStyle}>{STRINGS.t('Address_Book')}</Text>
						</View>		
					</TouchableHighlight>
				</View>	

				<View  style={ this.state.settingsBox ? dashboardStyle.mainBoxStyleOnpress : dashboardStyle.mainBoxStyle }>
					<TouchableHighlight onPress={this.onAppSettingsPress.bind(this)} onHideUnderlay={this._onHideUnderlay.bind(this,"settingsBox")} underlayColor='#1683c0' onShowUnderlay={this._onShowUnderlay.bind(this,"settingsBox")}>
						<View style={dashboardStyle.touchableStyle} >
							<Image style={dashboardStyle.imageStyle} source={Images.app_setting_icon} />
							<Text style={dashboardStyle.textStyle}>{STRINGS.t('Settings')}</Text>
						</View>
					</TouchableHighlight>
				</View>
							
			</View>
			<View style={{flexDirection : 'row'}}>

				<View style={ this.state.languageBox ? dashboardStyle.mainBoxStyleOnpress : dashboardStyle.mainBoxStyle }>		
					<TouchableHighlight onPress={this.onLanguagePress.bind(this)} onHideUnderlay={this._onHideUnderlay.bind(this,"languageBox")} underlayColor='#1683c0' onShowUnderlay={this._onShowUnderlay.bind(this,"languageBox")}>
						<View style={dashboardStyle.touchableStyle}>
							<Image style={dashboardStyle.imageStyle} source={Images.change_country_state_icon} />
							<Text style={dashboardStyle.textStyle}>{STRINGS.t('Language')}</Text>
						</View>	
					</TouchableHighlight>
				</View>

				<View style={ this.state.accBox ? dashboardStyle.mainBoxStyleOnpress : dashboardStyle.mainBoxStyle }>
					<TouchableHighlight onPress={this.onAccountPress.bind(this)} onHideUnderlay={this._onHideUnderlay.bind(this,"accBox")} underlayColor='#1683c0' onShowUnderlay={this._onShowUnderlay.bind(this,"accBox")}>
						<View style={dashboardStyle.touchableStyle}>
							<Image style={dashboardStyle.imageStyle} source={Images.my_account_icon} />
							<Text style={dashboardStyle.textStyle}>{STRINGS.t('My_Account')}</Text>
						</View>		
					</TouchableHighlight>
				</View>	

				<View style={ this.state.titleRepBox ? dashboardStyle.mainBoxStyleOnpress : dashboardStyle.mainBoxStyle }>		
					<TouchableHighlight onPress={this.onMyTitleRepPress.bind(this)} onHideUnderlay={this._onHideUnderlay.bind(this,"titleRepBox")} underlayColor='#1683c0' onShowUnderlay={this._onShowUnderlay.bind(this,"titleRepBox")}>
						<View style={dashboardStyle.touchableStyle}>
							<Image style={dashboardStyle.imageStyle} source={Images.my_title_rep_icon} />
							<Text style={dashboardStyle.textStyle}>{STRINGS.t('My_Title_Rep')}</Text>
						</View>	
					</TouchableHighlight>
				</View>			
			</View>
			<View style={{flexDirection : 'row'}}>

			<View style={ dashboardStyle.mainBoxStyle }>	
					<TouchableHighlight onPress={()=> {this.setSpeaktoTextVal()}} underlayColor='#1683c0'>
						<View style={dashboardStyle.touchableStyle}>	
							<Image style={dashboardStyle.imageStyle} source={this.state.speakToTextVal ? Images.speak_text_icon : Images.speak_text_icon_unselected } />
							<Text style={dashboardStyle.textStyle}>{STRINGS.t('Speak_To_Text')}</Text>
						</View>	
					</TouchableHighlight>
				</View>

				<View style={ this.state.privacyPolicyBox ? dashboardStyle.mainBoxStyleOnpress : dashboardStyle.mainBoxStyle }>
					<TouchableHighlight onPress={this.onPrivacyPolicyPress.bind(this)} onHideUnderlay={this._onHideUnderlay.bind(this,"privacyPolicyBox")} underlayColor='#1683c0' onShowUnderlay={this._onShowUnderlay.bind(this,"privacyPolicyBox")}>
						<View style={dashboardStyle.touchableStyle}>	
							<Image style={dashboardStyle.imageStyle} source={Images.privacy_policy_icon} />
							<Text style={dashboardStyle.textStyle}>{STRINGS.t('Privacy_Policy')}</Text>
						</View>		
					</TouchableHighlight>
				</View>	
		
				<View style={ dashboardStyle.mainBoxStyle }>
					<TouchableHighlight onPress={()=> {this.setState({speakToTextBox : true}), this._startRecognizing()}}>
						<View style={dashboardStyle.touchableStyle}>
							<Image style={dashboardStyle.imageStyle} source={Images.micIcon} />
						</View>		
					</TouchableHighlight>
				</View>	
	
				
			</View>	
			<View style={{flexDirection : 'row'}}>
				<View style={dashboardStyle.mainBoxStyleFooter }>
						<View style={dashboardStyle.touchableStyle}>
							<Image source={Images.homeIcon} />
						</View>		
				</View>				
			</View>	
			</ScrollView>
			<View style={dashboardStyle.iphonexFooter}></View>
        </View>
      )}
  }
export default Dashboard
