import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Clipboard,
  ToastAndroid,
  AlertIOS,
  Platform,
  Linking,
  BackHandler,
  AsyncStorage,
  WebView
} from 'react-native';
import { callGetApi, callPostApi} from '../Services/webApiHandler.js' // Import 
import WebViewBridge from 'react-native-webview-bridge';


export default class DropboxWebView extends Component{
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

    componentWillMount() {
      BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
      this.state = {
        pdf : '',
        result : '',
        user_id_result : '',
        userID : 0,
      }
    

      AsyncStorage.getItem("userDetail").then((value) => {
        newstr = value.replace(/\\/g, "");
        var newstr = JSON.parse(newstr);
        this.setState({
          user_id_result : newstr.user_id
        });
      });

      AsyncStorage.getItem("pdfFileName").then(
        (resultpl) =>{ 
          if(resultpl !== null && resultpl !== 'false'){
              this.setState({
                result : resultpl
              }, this.callState);
            } 
        });
      //alert(this.props.propsname + "google signin componentmoun");
  }

  componentWillUnmount() {		
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }
  
  handleBackButtonClick = () => {
      this.props.navigator.push({name: 'GoogleSigninExample', index: 0 });
      return true;
  }

  callState() {
    this.setState({
      pdf : this.state.result,
      userID : this.state.user_id_result
    });

    /*var data = {
      'pdf' : this.state.pdf,
      'user_id' : this.state.userID      
    };*/

    //https://demoadmin.costsfirst.com/admin/index

    /*callPostApi('http://demoadmin.costsfirst.com/lovedeeptest/testing.php', {
			"pdf": this.state.result
			})
			.then((response) => {
       // if(JSON.stringify(result) == 1) {
      //    this.dropdown.alertWithType('success', 'Success', "Pdf Upload Successfully!");
      //  }		
    });	*/
  }
  
  onBridgeMessage(message) {
    const { webviewbridge } = this.refs;
    console.log("message " + JSON.stringify(message));
    switch (message) {
      case "hello from webview":
        webviewbridge.sendToBridge("hello from react-native");
        break;
      case "success":
        AsyncStorage.setItem("socialicon", "dropbox");
        this.props.navigator.push({name: 'GoogleSigninExample', index: 0 });
        break;        
        //console.log("we have got a message from webview! yeah");
        case "error":
        AsyncStorage.setItem("socialicon", "dropboxerror");
        this.props.navigator.push({name: 'GoogleSigninExample', index: 0 });        
        break;
    }
  } 

  render() {
    return (
      <WebViewBridge
        ref="webviewbridge"
        javaScriptEnabled={true}
        onBridgeMessage={this.onBridgeMessage.bind(this)}
        source={{uri: 'https://demoadmin.costsfirst.com/lovedeeptest/testing.php?pdf='+this.state.pdf+''}}
      />
    )
  } 
}

