/**
 * @description Login container
 */

import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  TextInput,
  Alert,
  ScrollView,
  TouchableOpacity,
  AsyncStorage,
  BackHandler,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {Icon} from 'native-base';
import CheckBox from 'react-native-checkbox';
import DropdownAlert from 'react-native-dropdownalert';
import {NavigationActions, StackActions} from 'react-navigation';
import Spinner from 'react-native-loading-spinner-overlay';

import Images from '../Themes/Images.js';
import Styles from './Styles/LoginScreenStyle';
import STRINGS from '../GlobalString/StringData';
import {callPostApi} from '../Services/webApiHandler.js';
import GLOBAL from '../Constants/global';

const PERSISTENT_LOGIN = 'persistent-login';

class Login extends Component {
  state = {
    username: '',
    usernameError: '',
    passwordError: '',
    password: '',
    animating: false,
    showError: false,
    connectionInfo: '',
    visble: false,
    showPage: 'false',
    persistentlogin: false,
  };
  onLoginPress = () => {
    if (this.state.connectionInfo !== 'none') {
      this.setState({animating: true}, this.callValidation);
    } else {
      this.dropdown.alertWithType(
        'error',
        'Error',
        'Please check your internet connection.',
      );
    }
  };

  callValidation = () => {
    if (this.state.username === '') {
      this.setState({usernameError: STRINGS.t('username_error_message')});

      this.setState({username: ''});
    } else {
      this.setState({usernameError: ''});
    }
    if (this.state.password === '') {
      this.setState({
        passwordError: STRINGS.t('blank_password_acc_error_message'),
      });
    } else if (this.state.password.length < 6) {
      this.setState({passwordError: STRINGS.t('password_error_message')});
      this.setState({password: ''});
    } else {
      this.setState({passwordError: ''});
    }
    if (this.state.username !== '' && this.state.password.length >= 6) {
      this.callapi();
    } else {
      this.setState({animating: false});
    }
  };

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backPressed);
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this._handleConnectivityChange,
    );

    AsyncStorage.getItem(PERSISTENT_LOGIN).then(resultpl => {
      if (resultpl !== null && resultpl !== 'false') {
        AsyncStorage.setItem('speakToTextVal', JSON.stringify(false)).then(
          () => {
            console.log('Done');
          },
        );
        this.navigationTo('DashboardScreen');
      } else {
        this.setState({
          showPage: 'true',
        });
      }
    });

    AsyncStorage.getItem('username').then(resultpl => {
      if (resultpl !== null && resultpl !== '') {
        this.setState({
          username: resultpl.replace(/\\/g, ''),
        });
      }
    });
  }

  handleFirstConnectivityChange = connectionInfo => {
    this.setState({connectionInfo: connectionInfo.type});
    if (connectionInfo.type !== 'none') {
      this.setState({animating: 'false'}, this.componentDidMount);
    }
  };

  componentWillMount() {
    NetInfo.getConnectionInfo().then(connectionInfo => {
      this.setState({
        connectionInfo: connectionInfo.type,
      });
      console.log(
        'Initial, type: ' +
          connectionInfo.type +
          ', effectiveType: ' +
          connectionInfo.effectiveType,
      );
    });

    NetInfo.addEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange,
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
    NetInfo.removeEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange,
    );
  }

  handleBackButtonClick = () => {
    return false;
  };

  backPressed = () => {
    Alert.alert(
      'Exit App',
      'Do you want to exit?',
      [
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Yes', onPress: () => BackHandler.exitApp()},
      ],
      {cancelable: false},
    );

    return true;
  };

  _handleConnectivityChange(status) {
    console.log(
      '*********_handleConnectivityChange: Network Connectivity status *******: ' +
        status,
    );
  }
  callapi() {
    callPostApi(GLOBAL.BASE_URL + GLOBAL.Login_Api, {
      email: this.state.username,
      password: this.state.password,
    }).then(result => {
      this.setState({animating: false});
      if (result.status === 'success') {
        this.setState({passwordError: ''});
        this.setState({usernameError: ''});
        AsyncStorage.setItem(
          PERSISTENT_LOGIN,
          this.state.persistentlogin.toString(),
        );
        AsyncStorage.setItem('userDetail', JSON.stringify(result.data));
        this.navigationTo('DashboardScreen');
      } else {
        this.setState({passwordError: ''});
        this.setState({usernameError: ''});
        this.dropdown.alertWithType('error', 'Error', result.message);
      }
    });
  }

  getSavedData() {
    AsyncStorage.getItem('userDetail')
      .then(value => {
        Alert.alert('User Detail' + value);
      })
      .done();
  }
  moveToSignUp() {
    this.props.navigation.navigate('SignUpScreen');
  }
  navigationTo(screenName) {
    this.props.navigation.dispatch(
      StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: screenName,
          }),
        ],
      }),
    );
  }

  onRememberMe(val) {
    if (val === true) {
      this.state.persistentlogin = true;
    } else {
      this.state.persistentlogin = false;
    }
  }

  onIconClick(msg) {
    this.dropdown.alertWithType('error', 'Error', msg);
  }

  // Default render method and create UI for Login Screen
  render() {
    if (this.state.animating === true) {
      this.state.scrollvalue = false;
      this.state.visble = true;
    } else {
      this.state.scrollvalue = true;
      this.state.visble = false;
    }
    let showable;
    if (this.state.showPage === 'true') {
      showable = (
        <View style={Styles.backgroundImage}>
          <View>
            <Spinner
              visible={this.state.visble}
              textContent={'Loading...'}
              textStyle={{color: '#FFF'}}
            />
          </View>
          <View style={Styles.iphonexHeader} />
          <ImageBackground
            style={Styles.logoBackgroundStyle}
            source={Images.loginScreenBase}>
            <Image style={Styles.logoBackGround1} source={Images.logoImage} />
            <Image
              style={Styles.logoBackGround1}
              source={Images.costFirstText}
            />
          </ImageBackground>

          <ScrollView style={Styles.scroll_container}>
            <View style={Styles.viewContainer}>
              <View style={Styles.backgroundViewContainer}>
                <Image style={Styles.logoImage} source={Images.username} />
                <TextInput
                  ref={'Username'}
                  value={this.state.username.toString()}
                  placeholderTextColor={
                    this.state.usernameError === '' ? '#999999' : 'red'
                  }
                  placeholder={
                    this.state.usernameError === ''
                      ? STRINGS.t('Username')
                      : this.state.usernameError
                  }
                  underlineColorAndroid="transparent"
                  secureTextEntry={false}
                  style={Styles.textInput}
                  returnKeyType="next"
                  keyboardType="email-address"
                  onChangeText={val =>
                    this.setState({username: val, usernameError: ''})
                  }
                />
                {this.state.usernameError !== '' ? (
                  <Icon
                    name="ios-alert"
                    onPress={() => this.onIconClick(this.state.usernameError)}
                    style={{color: 'red'}}
                  />
                ) : null}
              </View>
              <View style={Styles.lineViewTextBox} />
              {this.state.usernameError !== '' ? (
                <View style={Styles.lineErrorView} />
              ) : (
                <View style={Styles.lineView} />
              )}
              <View style={Styles.backgroundViewContainer}>
                <Image style={Styles.logoImage} source={Images.password} />
                <TextInput
                  ref={'Password'}
                  value={this.state.password.toString()}
                  placeholderTextColor={
                    this.state.passwordError === '' ? '#999999' : 'red'
                  }
                  placeholder={
                    this.state.passwordError === ''
                      ? STRINGS.t('Password')
                      : this.state.passwordError
                  }
                  underlineColorAndroid="transparent"
                  secureTextEntry={true}
                  style={Styles.textInput}
                  onChangeText={val =>
                    this.setState({password: val, passwordError: ''})
                  }
                />
                {this.state.passwordError !== '' ? (
                  <Icon
                    onPress={() => this.onIconClick(this.state.passwordError)}
                    name="ios-alert"
                    style={{color: 'red'}}
                  />
                ) : null}
              </View>
              <View style={Styles.lineViewTextBox} />
              {this.state.passwordError !== '' ? (
                <View style={Styles.lineErrorView} />
              ) : (
                <View style={Styles.lineView} />
              )}
              <View style={Styles.checkBoxContainer}>
                <CheckBox
                  label={STRINGS.t('Remember_Me')}
                  onChange={this.onRememberMe.bind(this)}
                />
              </View>
              <TouchableOpacity
                style={Styles.buttonContainer}
                onPress={this.onLoginPress.bind(this)}>
                <Text style={Styles.style_btnLogin}> {STRINGS.t('Login')}</Text>
              </TouchableOpacity>
              <View style={Styles.forgotContainer}>
                <Text style={Styles.forgotStyles}> {STRINGS.t('Forgot')} </Text>
                <TouchableOpacity
                  onPress={() => this.navigationTo('ForgotPasswordScreen')}>
                  <Text style={Styles.usernameAndPasswordStyles}>
                    {STRINGS.t('USERNAME')}
                  </Text>
                </TouchableOpacity>
                <Text style={Styles.slashStyle}> / </Text>
                <TouchableOpacity
                  onPress={() => this.navigationTo('ForgotPasswordScreen')}>
                  <Text style={Styles.usernameAndPasswordStyles}>
                    {STRINGS.t('PASSWORD')}
                  </Text>
                </TouchableOpacity>
              </View>
              <KeyboardSpacer />
            </View>
          </ScrollView>
          <View style={Styles.footerParent}>
            <View style={Styles.footerlineView} />
            <View style={Styles.footerContainer}>
              <Text style={Styles.memberStyles}>
                {STRINGS.t('Not_A_Member')}
              </Text>
              <TouchableOpacity onPress={this.moveToSignUp.bind(this)}>
                <Text style={Styles.usernameAndPasswordStyles}>
                  {STRINGS.t('SIGNUP')}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={Styles.iphonexFooter} />
          </View>
          <DropdownAlert ref={ref => (this.dropdown = ref)} />
        </View>
      );
    } else {
      showable = <View />;
    }

    return <View style={{flex: 1}}>{showable}</View>;
  }
}

export default Login;
