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
  AsyncStorage,
  Image,
  BackHandler,
  Alert
} from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob'
import GDrive from "react-native-google-drive-api-wrapper";
import GoogleSignIn from 'react-native-google-sign-in';
import Images from '../Themes/Images.js';
var RNFS = require('react-native-fs');
import { callGoogleDrivePostApi } from '../Services/webApiHandler.js' // Import 
import BuyerStyle from './Styles/BuyerStyle';
import SocialLogin from './Styles/SocialLogin'    // Import LoginScreenStyle.js class from Styles Folder to maintain UI.
import DropdownAlert from 'react-native-dropdownalert';
import Spinner from 'react-native-loading-spinner-overlay';

export default class GoogleSigninExample extends Component{
  constructor(props) {
    super(props);
  }

  /*componentWillMount() {
  
    callPostApi(GLOBAL.BASE_URL + GLOBAL.buyer_escrow_xml_data, {
      "city": this.state.city,"county_name": this.state.user_county,"salePrice": this.state.sale_pr,"adjusted": this.state.adjusted_loan_amt,"state": this.state.state,"county": this.state.county, "loanType": ''
      }, this.state.access_token)
      .then((response) => {
        this.setState({
          ownerFee: result.data.ownerFee,
          escrowFee: result.data.escrowFee,
          lenderFee: result.data.lenderFee,
          ownerFeeOrg: result.data.ownerFee,
          escrowFeeOrg: result.data.escrowFee,
          lenderFeeOrg: result.data.lenderFee,
        },this.calEscrowTypes);
      });
}*/

componentWillMount() {
  BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  this.state = {
    pdf : '',
    pdfName : '',
    result : '',
    user_id_result : '',
    userID : 0,
    sellerStatus : false,
    buyerStatus : false,
    netfirstStatus : false,
    refinanceStatus : false, 
    quickQuotesStatus : false,
    rentVsBuyStatus : false,
    visble: false,
  }

  

 // alert(AsyncStorage.getItem("dropbox"));

 AsyncStorage.getItem("calculator").then((value) => {

    console.log("calculator name " + value);
    if(value == 'seller') {
      this.setState({
          sellerStatus : true
      });
      
    } else if (value == 'netfirst') {
      this.setState({
        netfirstStatus : true
      });
    } else if (value == 'buyer') {
      this.setState({
        buyerStatus : true
      });
    } else if (value == 'refinance') {
      this.setState({
        refinanceStatus : true
      });
    } else if (value == 'quick_quotes') {
      this.setState({
        quickQuotesStatus : true
      });
    } else if (value == 'rent_vs_buy') {
      this.setState({
        rentVsBuyStatus : true
      });
    }
 });

  AsyncStorage.getItem("socialicon").then((value) => {
    if(value == 'dropbox' || value == 'evernote') {
      Alert.alert('', 'Pdf uploaded successfully!');
      //this.dropdown.alertWithType('success', 'Success', "Pdf uploaded successfully!");
      AsyncStorage.removeItem("socialicon");
    } else if(value == 'dropboxerror' || value == 'evernoteerror') {
      Alert.alert('', 'Error occured, please try again later.');
      //this.dropdown.alertWithType('error', 'Error', 'Error occured, please try again later.');
      AsyncStorage.removeItem("socialicon");
    }
  }); 

  AsyncStorage.getItem("userDetail").then((value) => {
    newstr = value.replace(/\\/g, "");
    var newstr = JSON.parse(newstr);
    this.setState({
      user_id_result : newstr.user_id
    });
  });
  AsyncStorage.getItem("pdfFileName").then(
    (resultpl) =>{ 


      console.log("resulttpl " + JSON.stringify(resultpl));

      if(resultpl !== null && resultpl !== 'false'){
          this.setState({
            result : resultpl
          }, this.callState);
        } 
     });
}

componentWillUnmount() {		
  BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
}

handleBackButtonClick = () => {
    this.onBackHomePress();
    return true;
}

callState() {
  var path = this.state.result.split("/");
  this.setState({
    pdf : this.state.result,
    pdfName : path[1],
    userID : this.state.user_id_result
  }, this._setupGoogleSignin);
}

_setupGoogleSignin() {
  console.log("in _setupGoogleSignin");
  try {
  
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
  console.log("in callDownloadfilefunction");
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

openGoogleDriveBrowser() {
    GoogleSignIn.configure({
      scopes: ['https://www.googleapis.com/auth/drive'],
      clientID: '365963579529-tuv5mi65pecjs66s5ac0th008ha7qric.apps.googleusercontent.com',
      shouldFetchBasicProfile: true,
    });

    GoogleSignIn.signInPromise()
      .then((user) => {
        console.log("user info " + JSON.stringify(user));
        this.setState({visble : true});
          RNFS.readDir(RNFS.DocumentDirectoryPath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
          .then((result) => {

            console.log("fetch paths from directory " + JSON.stringify(result));
            for (let i = 0; i <= result.length; i++) {
                if(result[i].name == 'demo.pdf') {
                  if(result[i].size > 0) {
                    this.setState({
                      length : result[i].size.toString()
                    }, this.callMethodToUploadFileToDrive(user.accessToken));
                  }
                }
            } 
          })
            this.setState({visble : false});
          this.setState({user: user});
      })
      .catch((err) => {
        console.log("res in error 2 " + JSON.stringify(err));
        this.setState({visble : false});
          Alert.alert('', 'Error occured, please try again later.');
          //this.dropdown.alertWithType('error', 'Error', 'Error occured, please try again later.');
      })
    .done();
  }

  callMethodToUploadFileToDrive(token) {
    callGoogleDrivePostApi('https://www.googleapis.com/drive/v3/files', {
      "name": this.state.pdfName,
      "mimeType": "application/pdf"
      },token)
      .then((response) => {
            this.setState({
              fileiden:result.id,
            }, this.callMethodForfetchFile(token, result.id));
      });
  }

  callMethodForfetchFile(access_token, fileid) {
    RNFetchBlob.fetch('PATCH',`https://www.googleapis.com/upload/drive/v3/files/${fileid}`,{
      Authorization : "Bearer " +access_token,
        'Content-Type'  : 'application/octet-stream',
        'Content-Length': this.state.length
      },RNFetchBlob.wrap(RNFS.DocumentDirectoryPath + '/demo.pdf'))
      .then((res) => {
        this.setState({visble : false});
        console.log("res in success " + JSON.stringify(res));
        Alert.alert('', 'Pdf uploaded successfully!');
          this.setState({visble : false});
          //this.dropdown.alertWithType('success', 'Success', 'Pdf uploaded successfully!');
      })
      .catch((err) => {
        console.log("res in error " + JSON.stringify(err));
        this.setState({visble : false});
        Alert.alert('', 'Error occured, please try again later.');
      })
  }

  openDropBoxBrowser() {
    this.props.navigator.push({name: 'DropboxWebView', index: 0 });
  }

  openEverNoteBrowser() {
    this.props.navigator.push({name: 'EvernoteWebView', index: 0 });
  }

  onBackHomePress() {
    if(this.state.sellerStatus == true) {
        this.setState({
          sellerStatus : false
        }, this.onCallGoBack("SellerCalculator"));
        AsyncStorage.removeItem("calculator");
       // this.props.navigator.push({name: 'SellerCalculator', index: 0 });
      } else if(this.state.buyerStatus == true) {
        this.setState({
          buyerStatus : false
        }, this.onCallGoBack("BuyerCalculator"));
        AsyncStorage.removeItem("calculator");
      //  this.props.navigator.push({name: 'BuyerCalculator', index: 0 });
      } else if(this.state.netfirstStatus == true) {
        this.setState({
          netfirstStatus : false
        }, this.onCallGoBack("NetFirstCalculator"));
        AsyncStorage.removeItem("calculator");
      //  this.props.navigator.push({name: 'NetFirstCalculator', index: 0 });
      } else if(this.state.refinanceStatus == true) {
        this.setState({
          refinanceStatus : false
        }, this.onCallGoBack("Refinance"));
        AsyncStorage.removeItem("calculator");
      //  this.props.navigator.push({name: 'Refinance', index: 0 });
      } else if(this.state.quickQuotesStatus == true) {
        this.setState({
          quickQuotesStatus : false
        }, this.onCallGoBack("QuickQuotes"));
        AsyncStorage.removeItem("calculator");
      //  this.props.navigator.push({name: 'QuickQuotes', index: 0 });
      } else if(this.state.rentVsBuyStatus == true) {
        this.setState({
          rentVsBuyStatus : false
        }, this.onCallGoBack("RentVsBuyCalculator"));
        AsyncStorage.removeItem("calculator");
      //  this.props.navigator.push({name: 'QuickQuotes', index: 0 });
      }
  }

  onCallGoBack(calcName) {
    var routes = this.props.navigator.state.routeStack;
    for (var i = routes.length - 1; i >= 0; i--) {
      if(routes[i].name === calcName){
        var destinationRoute = this.props.navigator.getCurrentRoutes()[i]
        this.props.navigator.popToRoute(destinationRoute);
      }
    }
  }

  render() {
      return (

        <View style={{flex :1, backgroundColor : '#000000'}}>
        		<View>
				      <Spinner visible={this.state.visble} textStyle={{color: '#FFF'}} />
			    </View>
        <View style={BuyerStyle.HeaderContainer}>
        <Image style={BuyerStyle.HeaderBackground} source={Images.header_background}></Image>
        <TouchableOpacity style={{width:'20%'}} onPress={this.onBackHomePress.bind(this)}>
          <Image style={BuyerStyle.back_icon} source={Images.back_icon}/>
         </TouchableOpacity> 
          <Text style={BuyerStyle.header_title}>Share Pdf</Text>
        </View>
        <View style={styles.container}>
         
        <TouchableOpacity style={SocialLogin.buttonContainerGoogleDrive} onPress={this.openGoogleDriveBrowser.bind(this)}>
            
          <View style={{flexDirection : 'row'}}>
            <Image style={{height:40 , width:'20%', alignItems : 'flex-start', marginRight : 25}} source={Images.googledriveIcon} />
            <Text style={SocialLogin.style_GoogleBtnLogin}>Google</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={SocialLogin.buttonContainer} onPress={this.openDropBoxBrowser.bind(this)}>
          <View style={{flexDirection : 'row'}}>
            <Image style={{height:40 , width:'20%' , alignItems : 'flex-start' , marginRight : 15}} source={Images.dropboxIcon} />
            <Text style={SocialLogin.style_DropBoxBtnLogin}>DropBox</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={SocialLogin.buttonContainerEvernote} onPress={this.openEverNoteBrowser.bind(this)}>
          <View style={{flexDirection : 'row'}}>
            <Image style={{height:40 , width:'15%', alignItems : 'flex-start' , marginRight : 15}} source={Images.evernoteIcon} />
            <Text style={SocialLogin.style_EvernoteBtnLogin}>Evernote</Text>
          </View>
        </TouchableOpacity>
        </View>
        <DropdownAlert
              ref={(ref) => this.dropdown = ref}
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
