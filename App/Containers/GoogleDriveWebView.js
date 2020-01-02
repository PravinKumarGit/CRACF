import React, { Component } from 'react';
import {
  AppRegistry,
  AsyncStorage,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Clipboard,
  ToastAndroid,
  AlertIOS,
  Platform,
  Linking,
  WebView
} from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob'
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
import GDrive from "react-native-google-drive-api-wrapper";
import Images from '../Themes/Images.js';
var RNFS = require('react-native-fs');

require('../Images/payment.png')

export default class GoogleDriveWebView extends Component{
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.state = {
      pdf : '',
      result : '',
      userID : 21961,
    }
    this._setupGoogleSignin();
    AsyncStorage.getItem("pdfFileName").then(
      (resultpl) =>{ 
        if(resultpl !== null && resultpl !== 'false'){
            this.setState({
              result : resultpl
            }, this.callState);
          } 
       });
  }

  callState() {
    this.setState({
      pdf : this.state.result
    });
  }

  async _setupGoogleSignin() {
      try {
        await GoogleSignin.hasPlayServices({ autoResolve: true });
        await GoogleSignin.configure({
          scopes: ['https://www.googleapis.com/auth/drive'],
          offlineAccess: true
        });

        const user = await GoogleSignin.currentUserAsync();
        console.log("from google drive" + JSON.stringify(user));
        this.signInUserInfo(user.accessToken);
        this.setState({user});

        RNFS.writeFile(RNFS.DocumentDirectoryPath + '/demo.pdf', '', 'utf8')
        .then((success) => {
          if(RNFS.DocumentDirectoryPath + '/demo.pdf') {
           this.callDownloadfilefunction();
          } else {
              console.log("file does not exists");
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
      }
      catch(err) {
        console.log("Play services error", err.code, err.message);
      }
  }

  callDownloadfilefunction() {
        DownloadFileOptions = {
          fromUrl : "http://demoadmin.costsfirst.com/" + this.state.pdf,
          toFile : RNFS.DocumentDirectoryPath + '/demo.pdf'
        };

        RNFS.downloadFile(DownloadFileOptions)         
        .promise.then((res) => {
          console.log("download response " + JSON.stringify(res)); 
        })
        .catch((e) => {            
          console.log(e);
        }); 
  }

  _signIn() {
    GoogleSignin.signIn()
    .then((user) => {
      //this.signInUserInfo(user.accessToken);
        RNFS.readDir(RNFS.DocumentDirectoryPath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
        .then((result) => {
            RNFetchBlob.fetch('POST', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=media', {
              Authorization : "Bearer " + user.accessToken,
              'Content-Type' : 'application/octet-stream',
              'Content-Length' : result[1].size.toString()
            }, RNFetchBlob.wrap(RNFS.DocumentDirectoryPath + '/demo.pdf'))
            .then((res) => {
              this.dropdown.alertWithType('success', 'Success', 'Pdf uploaded successfully!');
             // this.signInUserInfo(user.accessToken);
            //console.log("response in success" + res.text())
            })
            .catch((err) => {
              //console.log("response in error" + err)
            })          
        })
        .then((contents) => {
          // log the file contents
          console.log(contents);
        })
        .catch((err) => {
          console.log(err.message, err.code);
        });  
        this.setState({user: user});
    })
    .catch((err) => {
        console.log('WRONG SIGNIN', err);
    })
  .done();
}

/*signInUserInfo(access_token) {

  console.log("inside signin func");

  RNFetchBlob.fetch('GET', 'https://www.googleapis.com/auth/userinfo.profile', {
            Authorization : "Bearer " + access_token,
          })
          .then((res) => {

            //Alert.alert("dfg",JSON.stringify(res));
          console.log("response in success" + res.text());
          })
          .catch((err) => {
            console.log("response in error" + err);
          })  
}*/

  render() {
    return (
        <GoogleSigninButton
        style={{width: 48, height: 48}}
        size={GoogleSigninButton.Size.Icon}
        color={GoogleSigninButton.Color.Dark}
        onPress={this._signIn.bind(this)}/>
    )
} 


}

