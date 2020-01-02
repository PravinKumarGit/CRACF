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
  WebView,
  AsyncStorage
} from 'react-native';
import Styles from './Styles/LoginScreenStyle'    // Import LoginScreenStyle.js class from Styles Folder to maintain UI.
import CheckBox from 'react-native-checkbox';
import { callGetApi, callPostApi} from '../Services/webApiHandler.js' // Import 
import DropdownAlert from 'react-native-dropdownalert';

export default class AutoApiPdfUpload extends Component{
  constructor(props) {
    super(props);
  }


  componentWillMount() {
    this.state = {
      checkedStatus : false,
      result : false,
      pdf : '',
      userID : 21961,
    }
  
    AsyncStorage.getItem("evernoteAccessToken").then(
      (resultpl) =>{ 
        if(resultpl !== null && resultpl !== 'false'){
            this.setState({
              checkedStatus : true
            });
          } else {
            this.setState({
              checkedStatus : false
            });
          } 
       });
       AsyncStorage.getItem("pdfFileName").then(
        (resultpl) =>{ 
          if(resultpl !== null && resultpl !== 'false'){
              this.setState({
                pdf : resultpl
              });
            } 
         });
  }

  openGoogleDriveBrowser() {
  
   /* Linking.canOpenURL('http://costsfirstv3.demos.classicinformatics.com/lovedeep_test/GoogleDrive.php').then(supported => {
        if (!supported) {
          console.log('Can\'t handle url: ' + 'http://costsfirstv3.demos.classicinformatics.com/lovedeep_test/GoogleDrive.php');
        } else {
          return Linking.openURL('http://costsfirstv3.demos.classicinformatics.com/lovedeep_test/GoogleDrive.php');
        }
      }).catch(err => console.error('An error occurred', err));*/

      //this.props.navigator.push({name: 'GoogleDriveWebView', index: 0 });

  }

  openDropBoxBrowser() {
    /*Linking.canOpenURL('http://costsfirstv3.demos.classicinformatics.com/lovedeep_test/DropboxApi/login_with_dropbox.php').then(supported => {
      if (!supported) {
        console.log('Can\'t handle url: ' + 'http://costsfirstv3.demos.classicinformatics.com/lovedeep_test/DropboxApi/login_with_dropbox.php');
      } else {
        return Linking.openURL('http://costsfirstv3.demos.classicinformatics.com/lovedeep_test/DropboxApi/login_with_dropbox.php');
      }
    }).catch(err => console.error('An error occurred', err));*/
  }

  openEverNoteBrowser() {
    callPostApi('http://costsfirstv3.demos.classicinformatics.com/lovedeep_test/autoApiPdfUpload.php', {
			"pdf": this.state.pdf,"user_id":this.state.userID
			}, this.state.access_token)
			.then((response) => {
        if(JSON.stringify(result) == 1) {
          this.dropdown.alertWithType('success', 'Success', "Pdf Upload Successfully!");
        }		
		});	

  }

  onChange(checked) {
    if(checked == true) {
        this.setState({
          checkedStatus : false
        });
    } else {
      this.setState({
        checkedStatus : true
      });
    }
  }

  onClose(data) {
		if(data.type == 'success') {
      this.props.navigator.push({name: 'SellerCalculator', index: 0 });
    }
    
  }  

  render() {
      return (
        <View style={styles.container}>
          <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 20}}>You can upload a copy of pdf file to below sections</Text>
         
            <View style={{flexDirection : 'row'}}> 
                  <View>
                   
                  <CheckBox 
                    checked={this.state.checkedStatus} 
                    onChange={(checked) => this.onChange(checked)} 
                    />

                  </View> 
                  <View>
                    <CheckBox
                        label='DropBox'
                    />
                  </View>
                  <View>
                    <CheckBox
                        label='Evernote'
                    />
                  </View>
            </View>
            <View style={{flexDirection: 'column'}}>
            <TouchableOpacity onPress={this.openEverNoteBrowser.bind(this)}>
                  <View style={styles.instructions}>
                    <Text>Share</Text>
                  </View>
                </TouchableOpacity>
            </View>
            <DropdownAlert
                  ref={(ref) => this.dropdown = ref}
                  onClose={data => this.onClose(data)}
                   />
        </View>
        					
      );
    }
  }

  const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});	