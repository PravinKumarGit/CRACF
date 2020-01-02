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

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

export default class GooglePlaceAutoComplete extends Component{
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
    var address_components = [{"long_name":"1980","short_name":"1980","types":["street_number"]},{"long_name":"Mission Street","short_name":"Mission St","types":["route"]},{"long_name":"Mission District","short_name":"Mission District","types":["neighborhood","political"]},{"long_name":"San Francisco","short_name":"SF","types":["locality","political"]},{"long_name":"San Francisco County","short_name":"San Francisco County","types":["administrative_area_level_2","political"]},{"long_name":"California","short_name":"CA","types":["administrative_area_level_1","political"]},{"long_name":"United States","short_name":"US","types":["country","political"]},{"long_name":"94103","short_name":"94103","types":["postal_code"]}];


    console.log("length " + address_components.length);

    for (var i = 0; i < address_components.length; i++) {
      console.log(address_components[i].long_name);
    }

}

  openGoogleDriveBrowser() {
  

    this.props.navigator.push({name: 'GoogleDriveWebView', index: 0 });
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
   
    this.props.navigator.push({name: 'DropboxWebView', index: 0 });
   
    /*Linking.canOpenURL('http://costsfirstv3.demos.classicinformatics.com/lovedeep_test/DropboxApi/login_with_dropbox.php').then(supported => {
      if (!supported) {
        console.log('Can\'t handle url: ' + 'http://costsfirstv3.demos.classicinformatics.com/lovedeep_test/DropboxApi/login_with_dropbox.php');
      } else {
        return Linking.openURL('http://costsfirstv3.demos.classicinformatics.com/lovedeep_test/DropboxApi/login_with_dropbox.php');
      }
    }).catch(err => console.error('An error occurred', err));*/
  }

  openEverNoteBrowser() {


    this.props.navigator.push({name: 'EvernoteWebView', index: 0 });

    /*Linking.canOpenURL('http://costsfirstv3.demos.classicinformatics.com/lovedeep_test/Evernote.php').then(supported => {
      if (!supported) {
        console.log('Can\'t handle url: ' + 'http://costsfirstv3.demos.classicinformatics.com/lovedeep_test/Evernote.php');
      } else {
        return Linking.openURL('http://costsfirstv3.demos.classicinformatics.com/lovedeep_test/Evernote.php');
      }
    }).catch(err => console.error('An error occurred', err));*/
  
  
  
  }

  render() {
      return (
        <View style={styles.container}>
         <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 20}}></Text>       
        	<GooglePlacesAutocomplete
                        placeholder='Enter Location'
                        minLength={1}
                        autoFocus={false}
                        fetchDetails={true}
                        onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                          console.log("data " + JSON.stringify(data));
                          console.log("details " + JSON.stringify(details.address_components));
                        }}
                        getDefaultValue={() => {
                          return ''; // text input default value
                        }}
                        query={{
                          // available options: https://developers.google.com/places/web-service/autocomplete
                          key: 'AIzaSyA0p5y1scqRyaD3XlrLWesy7tLqWc5huiE',
                          language: 'en', // language of the results
                          types: 'address', // default: 'geocode'
                        }}
                        styles={{
                          textInputContainer: {
                          backgroundColor: 'rgba(0,0,0,0)',
                          borderTopWidth: 0,
                          borderBottomWidth:0
                          },
                          textInput: {
                          marginLeft: 0,
                          marginRight: 8,
                          marginTop : -10,
                          flex: 1,
                          color: '#5d5d5d',
                          fontSize: 14
                          },
                          predefinedPlacesDescription: {
                          color: '#1faadb'
                          },
                        }}
                        currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
                        nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                        GoogleReverseGeocodingQuery={{
                          // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                        }}
                        GooglePlacesSearchQuery={{
                          // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                          rankby: 'distance',
                          types: 'food',
                        }}
                        
                        
                        filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                        
                        
                        predefinedPlacesAlwaysVisible={true}
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