import React, { Component } from 'react';
import {Container, Left, Right, Icon, Title, Body, Button}  from 'native-base';
import {Image, View, Dimensions, Text, Alert,NumberFormat, TextInput, TouchableOpacity, NetInfo, ScrollView} from 'react-native';
import Images from '../Themes/Images.js';
import CustomStyle from './Styles/CustomStyle';
import AccountStyle from './Styles/AccountStyle';

import STRINGS from '../GlobalString/StringData'  // Import StringData.js class for string localization.
import KeyboardSpacer from 'react-native-keyboard-spacer';
var GLOBAL = require('../Constants/global');
const  {width, height} = Dimensions.get('window')
var Header = require('./Header');
import {callGetApi, callPostApi} from '../Services/webApiHandler.js' // Import 
import Picker from 'react-native-picker';
import {calculate} from '../Services/calculate.js'
export default class Calculation extends Component{
	calculateres()
	{
		var res = calculate(this.state.aval,this.state.bval);
		this.setState({result: res});
	}
	state = {
    result: '',
    aval: '',
    bval: ''
  };
	render(){
		
		return(
			<View>
				<Image style={CustomStyle.header_bg} source={Images.header_background}>
					<View style={CustomStyle.header_view}>
						<TouchableOpacity style={CustomStyle.back_icon_parent} >
							<Image style={CustomStyle.back_icon} source={Images.back_icon}/>
						</TouchableOpacity>
						<Text style={CustomStyle.header_title}>My Accounts</Text>
						<TouchableOpacity  style={CustomStyle.header_save}>
							<Text style={CustomStyle.save_btn}>Save</Text>
						</TouchableOpacity>
					</View>
				 </Image>
					<View style={AccountStyle.view_parent}>
						<View style={AccountStyle.view_title}>
							<TextInput placeholder={STRINGS.t('first_name')} underlineColorAndroid = 'transparent' secureTextEntry={false} style={AccountStyle.textInput} returnKeyType ="next" keyboardType="number-pad" multiline={true} onChangeText={(value) => {if(!isNaN(value)){this.setState({aval: value},this.calculateres)}}} keyboardType = 'numeric' value={this.state.aval}  />
						</View>
						<View style={AccountStyle.view_textInput}>
							<TextInput placeholder={STRINGS.t('first_name')} underlineColorAndroid = 'transparent' secureTextEntry={false} style={AccountStyle.textInput} returnKeyType ="next" keyboardType="email-address" keyboardType = 'number-pad' multiline={true} onChangeText={(value) => {if(!isNaN(value)){this.setState({bval: value},this.calculateres)}}} value={this.state.bval}  />
						</View>
					</View>
					<Text>{this.state.result}</Text>
					<View style={AccountStyle.lineView}></View>
			</View>

		);
	}
}
