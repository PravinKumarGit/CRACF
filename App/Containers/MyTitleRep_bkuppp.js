import React, { Component } from 'react';
import {Image, View, Dimensions, Alert, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, AsyncStorage} from 'react-native';
import Menu, {
  MenuContext,
  MenuOptions,
  MenuOption,
  MenuTrigger
} from 'react-native-menu';
import Images from '../Themes/Images.js';
import Styles from './Styles/MyTitleRepStyle';
import { CheckBox } from 'react-native-elements';
import CustomStyle from './Styles/CustomStyle';
import renderIf from 'render-if';
import {callGetApi, callPostApi} from '../Services/webApiHandler.js' // Import 
import STRINGS from '../GlobalString/StringData'  // Import StringData.js class for string localization.
import Picker from 'react-native-picker';
import DatePicker from 'react-native-datepicker'

var GLOBAL = require('../Constants/global');
const  {width, height} = Dimensions.get('window')

import { Container, Content, InputGroup, Input, Icon } from 'native-base';
export default class MyTitleRep extends Component{
	constructor() {
        super();
        this.state = {
        }
    }
	
  setMessage(value) {
	  
	  alert(value); 
	  //alert('in setMessage');
    /*if (typeof value === 'string') {
      this.setState({ message: `You selected "${value}"` });
    } else {
      this.setState({ message: `Woah!\n\nYou selected an object:\n\n${JSON.stringify(value)}` });
    }
    return value !== 'do not close';*/
  
  }



    render(){
        return(
				 <View style={Styles.MainContainer}>
				<View style={Styles.HeaderContainer}>
                    <Image style={Styles.HeaderBackground} source={Images.header_background}></Image>
                    <TouchableOpacity style={{width:'20%'}}>
                        <Image style={Styles.back_icon} source={Images.back_icon}/>
                    </TouchableOpacity>
                    <Text style={Styles.header_title}>{STRINGS.t('myTitleRep')}</Text>
														<MenuContext style={{ backgroundColor : 'transparent', position : 'absolute', right : 0, top : 10, zIndex : 9999 }} ref="MenuContext">
						<View style={styles.topbar}>
							<Menu onSelect={this.setMessage}>
								<MenuTrigger style={styles.menuTrigger}>
								  <Icon name='menu' /> 
								</MenuTrigger>
								<MenuOptions optionsContainerStyle={{ width: 300, position : 'absolute', zIndex : 1 }}>
									<MenuOption value="normal">
										<Text>Normal option</Text>
									</MenuOption>
									<MenuOption value="do not close">
										<Text>Does not close menu</Text>
									</MenuOption>
									<MenuOption value="Disabled option">
										<Text>Disabled option</Text>
									</MenuOption>
									<MenuOption value="Option with object value">
										<Text>Option with object value</Text>
									</MenuOption>
								</MenuOptions>
							</Menu>
						</View>
					</MenuContext>
				</View>


				<View style={Styles.BodyContainer}> 

					<View style={Styles.IconContainer}>
                        <TouchableOpacity style={{width:'22%'}} onPress={()=>{}}>
                            <Image style={Styles.iconssmall} source={Images.phone_number_icon}/>
                            <Text style={Styles.imagetext}>Phone</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{width:'22%'}} onPress={()=>{}}>
                            <Image style={Styles.iconssmall} source={Images.text_icon}/>
                            <Text style={Styles.imagetext}>Text</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{width:'22%'}} onPress={()=>{}}>
                            <Image style={Styles.iconssmall} source={Images.mailing_address_icon}/>
                            <Text style={Styles.imagetext}>Email</Text>
                        </TouchableOpacity>
                        <View style={{width:'34%'}}>
                            <Image style={Styles.iconslarge} source={Images.eagle}/>
                        </View>
                    </View>   
                    <View style={Styles.underline}></View>
                    <TouchableOpacity style={{paddingBottom:10}}>             
                        <Text style={Styles.headingtext}>{STRINGS.t('Website')}</Text>
                    </TouchableOpacity>
                    <View style={Styles.underline}></View>
                    <TouchableOpacity style={{paddingBottom:10}}>             
                        <Text style={Styles.headingtext}>{STRINGS.t('CustomerService')}</Text>
                    </TouchableOpacity>
                    <View style={Styles.underline}></View>
                    <TouchableOpacity style={{paddingBottom:10}}>             
                        <Text style={Styles.headingtext}>{STRINGS.t('HomeWarranty')}</Text>
                    </TouchableOpacity>
                    <View style={Styles.underline}></View>
                </View>
				</View>
		           

        )
    }
}

const styles = StyleSheet.create({
  topbar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
    paddingHorizontal: 5,
    paddingVertical: 10,
	zIndex : 9999
  },
  menuTrigger: {
    flexDirection: 'row',
    paddingHorizontal: 10,
	backgroundColor  : '#ffffff',
 }
});