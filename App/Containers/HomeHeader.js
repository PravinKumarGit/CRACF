import React, { Component } from 'react';
import {Container, Left, Right, Icon, Title, Body, Button}  from 'native-base';
import {Image, View, Dimensions, Alert, AsyncStorage, Text, TouchableOpacity} from 'react-native';
import Images from '../Themes/Images.js';
import CustomStyle from './Styles/CustomStyle';
import STRINGS from '../GlobalString/StringData'  // Import StringData.js class for string localization.
const  {width, height} = Dimensions.get('window')
export default class HomeHeader extends Component{

	render() {
		return(
			 <Image style={CustomStyle.header_bg} source={Images.header_background}>
				<View style={CustomStyle.header_view}>
					<Text style={{width:'20%', fontWeight : 'bold',color : '#ffffff', marginLeft : 5}}>Version 0.1</Text>
					<Text style={{width:'60%', textAlign : 'center', fontWeight : 'bold', color:'#ffffff', fontSize:20, backgroundColor: 'transparent'}}>CostsFirst</Text>
					<View style={{width:'20%',}}/>
				</View>			
			</Image>

		);
	}
		
}
module.exports = HomeHeader;