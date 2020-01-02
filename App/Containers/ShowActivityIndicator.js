import React, { Component } from 'react'
import {
	AppRegistry,
	StyleSheet,
	Text,
	Picker,
	View,
	Image,
	TextInput,
	TouchableOpacity,
	TouchableHighlight,
	TouchableWithoutFeedback,
	AsyncStorage,
	ActivityIndicator,
	DatePickerAndroid,
	Button
} from 'react-native'

export default class ShowActivityIndicator extends Component {
		constructor() {
			super();
			this.state = {
				animating : "",
				activityanimate : true,
			}
		}
		render() {
			return (
				<ActivityIndicator animating={this.state.activityanimate} style={[styles.overlaySpin, styles.bottomOverlaySpin]} size="large" color="#2e2eb8" resizeMode= "cover"/>	
			);
		}
}

var styles = StyleSheet.create({
	overlaySpin: {
		position: 'absolute',
		padding: 16,
		right: 0,
		left: 0,
		top:0,
		alignItems: 'center',
  },
   bottomOverlaySpin: {
		bottom: 200,
		backgroundColor: 'transparent',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		zIndex:1
  },
	
});
	












