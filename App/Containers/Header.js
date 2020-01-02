import React, { Component } from 'react';
import {Container, Left, Right, Icon, Title, Body, Button}  from 'native-base';
import {Image, View, Dimensions, Text, TouchableOpacity} from 'react-native';
import Images from '../Themes/Images.js';
import CustomStyle from './Styles/CustomStyle';

import STRINGS from '../GlobalString/StringData'  // Import StringData.js class for string localization.
const  {width, height} = Dimensions.get('window')

export default class Header extends Component{
	render(){
		return(
				 <Image style={CustomStyle.header_bg} source={Images.header_background}>
					<View style={CustomStyle.header_view}>
						<TouchableOpacity style={CustomStyle.back_icon_parent}>
							<Image style={CustomStyle.back_icon} source={Images.back_icon}/>
						</TouchableOpacity>
						<Text style={CustomStyle.header_title}>CostsFirst</Text>
						<Text style={CustomStyle.header_save}></Text>
					</View>
				 </Image>

		);
	}
}
module.exports = Header;