import React, { Component } from 'react';
import {Container, Left, Right, Icon, Title, Body, Button}  from 'native-base';
import {Image, View, Dimensions, Alert, Text, TextInput, TouchableOpacity, ScrollView, AsyncStorage, WebView, BackHandler, NetInfo} from 'react-native';
import Images from '../Themes/Images.js';
import Styles from './Styles/PrivacyPolicyStyle';
import STRINGS from '../GlobalString/StringData'  // Import StringData.js class for string localization.
import BuyerStyle from './Styles/BuyerStyle';

var GLOBAL = require('../Constants/global');
const  {width, height} = Dimensions.get('window');
import {authenticateUser} from '../Services/CommonValidation.js'  // Import CommonValidation class to access common methods for validations.

export default class PrivacyPolicy extends Component{
	constructor() {
        super();
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
		this.state = {
            connectionInfo : '',
        }
        this.handleFirstConnectivityChange = this.handleFirstConnectivityChange.bind(this);
    }
	
	async componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
		response = await authenticateUser();
		if(response == '1'){
			this.props.navigator.push({name: 'Login', index: 0 });
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
	
	onBackButtonPress() {
		this.props.navigator.pop()
	}

    render(){
        let showable;
        if(this.state.connectionInfo != 'none') {
            showable=  <View style={Styles.MainContainer}>
            <View style={Styles.iphonexHeader}></View>
            <View style={Styles.HeaderContainer}>
                <Image style={Styles.HeaderBackground} source={Images.header_background}></Image>
                <TouchableOpacity style={{width:'20%'}} onPress={this.onBackButtonPress.bind(this)}>
                    <Image style={Styles.back_icon} source={Images.back_icon}/>
                </TouchableOpacity>
                <Text style={Styles.header_title}>{STRINGS.t('PrivacyPolicy')}</Text>
            </View>
            <WebView scalesPageToFit={true} style={Styles.BodyContainer} source={{uri: 'https://costsfirst.com/service/webservice/privacypolicy/companyId/2'}}/>
            <View style={Styles.iphonexFooter}></View>
        </View>
        } else {
            showable=
			<View style={{flex : 1}}>
				<View style={{flex : 2}}>
					<View style={BuyerStyle.HeaderContainer}>	
						<Image style={BuyerStyle.HeaderBackground} source={Images.header_background}></Image>
						<TouchableOpacity style={{width:'20%'}} onPress={this.onBackButtonPress.bind(this)}>
							<Image style={BuyerStyle.back_icon} source={Images.back_icon}/>
						</TouchableOpacity>
						<Text style={BuyerStyle.header_title}>{STRINGS.t('PrivacyPolicy')}</Text>
			
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
            <View style={{flex : 1}}>
                {showable}
            </View>
        )
    }
}