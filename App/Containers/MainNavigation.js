import React, { Component, } from 'react'
import {View, AsyncStorage, Linking, Vibration } from 'react-native'
import Login from './Login';
import SignUp from './SignUp';
import SignUp1 from './SignUp1';
import SignUp2 from './SignUp2';
import Dashboard from './Dashboard';
import ForgotPassword from './ForgotPassword';
import ForgotUsername from './ForgotUsername';
import BuyerCalculator from './BuyerCalculator';
import AddressBook from './AddressBook';
import Account from './Account';
import Calculation from './Calculation';
import SellerCalculator from './SellerCalculator';
import AppSettings from './AppSettings';
import MyTitleRep from './MyTitleRep';
import PrivacyPolicy from './PrivacyPolicy';
import Language from './Language';
import ChangeState from './ChangeState';
import {Navigator}  from 'react-native-deprecated-custom-components';
import ChangePassword from './ChangePassword';
import QuickQuotes from './QuickQuotes';
import NetFirstCalculator from './NetFirstCalculator';
import Refinance from './Refinance';
import RentVsBuyCalculator from './RentVsBuyCalculator';
import DropboxWebView from './DropboxWebView';
import EvernoteWebView from './EvernoteWebView';
import GoogleSigninExample from './GoogleSignin';
import AutoApiPdfUpload from './AutoApiPdfUpload';
import GooglePlaceAutoComplete from './googlePlaceAutoComplete';
import SsoRegistration from './SsoRegistration';
import {callGetApi, callPostApi} from '../Services/webApiHandler.js' // Import webApiHandler.js class for calling api.
var GLOBAL = require('../Constants/global');
class MainNavigation extends Component {

  constructor(props) {
    super(props)
    this.state = {
      screenName : ''
    }
  }


  componentWillMount() {
    Linking.getInitialURL().then((url) => {
      if(url != 'null' && url != null) {
            url = decodeURI(url);
            var splitUrl = url.split('&');
            var appId = url.split('?');
            var appidVal = appId[1].split('&');
            var appFinalId = appidVal[0].split('=');
            this.setState({appID : appFinalId[1]});
            for(i=1; i < splitUrl.length; i++) {
              var keyValuePair = splitUrl[i];
              //console.log("vls " + i + vls);
              if(keyValuePair != 'undefined' || keyValuePair != undefined) {
                keyValuePair = keyValuePair.split('=');	
                if(keyValuePair[0] == 'mfaToken') {
                  this.setState({mfaToken : keyValuePair[1]});
                }
                else if(keyValuePair[0] == 'salesRep1') {
                  this.setState({salesRep1 : keyValuePair[1]});
                }
                else if(keyValuePair[0] == 'salesRep1Email') {
                  this.setState({salesRep1Email : keyValuePair[1]});
                }
                else if(keyValuePair[0] == 'salesRep2') {
                  this.setState({salesRep2 : keyValuePair[1]});
                }
                else if(keyValuePair[0] == 'salesRep2Email') {
                  this.setState({salesRep2Email : keyValuePair[1]});
                }					
              }
            }
            
            var requestForSSO = {
                'appID':this.state.appID,
                'mfaToken':this.state.mfaToken,
                'salesRep1':this.state.salesRep1,
                'salesRep1Email':this.state.salesRep1Email,
                'salesRep2':this.state.salesRep2,
                'salesRep2Email':this.state.salesRep2Email,	
            }
            console.log("requestForSSO " + JSON.stringify(requestForSSO));
            callPostApi(GLOBAL.BASE_URL + GLOBAL.ssomobile, requestForSSO, "")
              .then((response) => {
                console.log("responsessdfsd " + JSON.stringify(result));
                AsyncStorage.setItem("SsoUserDetail", JSON.stringify(result.data));
                if(result.status == 'success' && result.message == 'Missing data.') {
                    this.setState({
                      screenName : 'SsoRegistration'
                    });
                } else if (result.status == 'success' && result.message == '') {
                  AsyncStorage.setItem("userDetail", JSON.stringify(result.data));
                  this.setState({
                    screenName : 'Dashboard'
                  });
                } else {
                  this.setState({
                    screenName : 'Login'
                  });
                }
                console.log(this.state.screenName);
              });

        } else {
          this.setState({
            screenName : 'Login'
          });
        }    
      }).catch(err => console.error('An error occurred', err));
      

	
  }


renderScene(route, navigator) {
   if(route.name == 'Login') {
     return <Login navigator={navigator} />
   }
   if(route.name == 'SignUp') {
     return <SignUp  navigator={navigator}/>
   }
   if(route.name == 'SignUp1') {
     return <SignUp1  navigator={navigator}/>
   }
   if(route.name == 'SignUp2') {
     return <SignUp2  navigator={navigator}/>
   }
   if(route.name == 'SsoRegistration') {
    return <SsoRegistration  navigator={navigator}/>
    }
   if(route.name == 'ForgotPassword') {
     return <ForgotPassword  navigator={navigator}/>
   }
   if(route.name == 'ForgotUsername') {
     return <ForgotUsername  navigator={navigator}/>
   }
   if(route.name == 'Dashboard') {
     return <Dashboard  navigator={navigator}/>
   }
   if(route.name == 'BuyerCalculator') {
     return <BuyerCalculator  navigator={navigator}/>
   }
   if(route.name == 'SellerCalculator') {
     return <SellerCalculator  navigator={navigator}/>
   }
  if(route.name == 'Account') {
     return <Account  navigator={navigator}/>
   }
   if(route.name == 'Calculation') {
     return <Calculation  navigator={navigator}/>
   }
   
   if(route.name == 'ChangePassword') {
     return <ChangePassword  navigator={navigator}/>
   }
   if(route.name == 'QuickQuotes') {
     return <QuickQuotes navigator={navigator}/>
   }
   if(route.name == 'AddressBook') {
     return <AddressBook  navigator={navigator}/>
   }
   if(route.name == 'SellerCalculator') {
     return <SellerCalculator  navigator={navigator}/>
   }
   if(route.name == 'AppSettings') {
     return <AppSettings  navigator={navigator}/>
   }
   if(route.name == 'MyTitleRep') {
     return <MyTitleRep  navigator={navigator}/>
   }
   if(route.name == 'PrivacyPolicy') {
     return <PrivacyPolicy  navigator={navigator}/>
   }
   if(route.name == 'Language') {
     return <Language  navigator={navigator}/>
   }
   if(route.name == 'ChangeState') {
     return <ChangeState  navigator={navigator}/>
   }
   if(route.name == 'HomeHeader') {
     return <HomeHeader navigator={navigator}/>
   }
   if(route.name == 'NetFirstCalculator') {
     return <NetFirstCalculator navigator={navigator}/>
   }
   if(route.name == 'Refinance') {
     return <Refinance navigator={navigator}/>
   }
   if(route.name == 'RentVsBuyCalculator') {
    return <RentVsBuyCalculator navigator={navigator}/>
  }
  if(route.name == 'ShowChart') {
    return <ShowChart navigator={navigator}/>
  }
  if(route.name == 'GoogleSigninExample') {
    return <GoogleSigninExample navigator={navigator}/>
  }

  if(route.name == 'DropboxWebView') {
    return <DropboxWebView navigator={navigator}/>
  }
  if(route.name == 'EvernoteWebView') {
    return <EvernoteWebView navigator={navigator}/>
  }
  if(route.name == 'AutoApiPdfUpload') {
    return <AutoApiPdfUpload navigator={navigator}/>
  }
  if(route.name == 'GooglePlaceAutoComplete') {
    return <GooglePlaceAutoComplete navigator={navigator}/>
  }
}

  render() {

    let showable;
    if(this.state.screenName == 'SsoRegistration') {
      showable=<Navigator
        initialRoute={{name: 'SsoRegistration', index: 0}} 
        renderScene={this.renderScene}
        configureScene={(route, routeStack) =>{
        transition = Navigator.SceneConfigs.FloatFromBottom
        transition.gestures = null
        return transition
      }}/>
    } else if(this.state.screenName == 'Login') {
      showable=<Navigator
        initialRoute={{name: 'Login', index: 0}} 
        renderScene={this.renderScene}
        configureScene={(route, routeStack) =>{
        transition = Navigator.SceneConfigs.FadeAndroid
        transition.gestures = null
        return transition
      }}/>
    } else if (this.state.screenName == 'Dashboard') {
      showable=<Navigator
        initialRoute={{name: 'Dashboard', index: 0}} 
        renderScene={this.renderScene}
        configureScene={(route, routeStack) =>{
        transition = Navigator.SceneConfigs.FadeAndroid
        transition.gestures = null
        return transition
      }}/>
    } else {
      showable=<View></View>
    }

    return (
        <View style={{flex:1}}>
        {showable}	
      </View>
    )
  }
}

export default MainNavigation
