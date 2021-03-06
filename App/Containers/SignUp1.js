/**
 * @description Step 2 of signup
 */
import React, {Component} from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  AsyncStorage,
} from 'react-native';
import {Icon} from 'native-base';
import DropdownAlert from 'react-native-dropdownalert';
import {NavigationActions, StackActions} from 'react-navigation';

import signUpStyles from './Styles/SignUpStyle';
import loginStyles from './Styles/LoginScreenStyle';
import Images from '../Themes/Images.js';
import STRINGS from '../GlobalString/StringData';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Styles from './Styles/SellerStyleDesign';
import GLOBAL from '../Constants/global';
import {callPostApi} from '../Services/webApiHandler';
const NAVIGATION_TO_LOGIN = StackActions.reset({
  index: 0,
  actions: [
    NavigationActions.navigate({
      routeName: 'loginScreen',
    }),
  ],
});
class SignUp1 extends Component {
  state = {
    usernameField: '',
    usernameError: '',
    passwordError: '',
    confirmPasswordError: '',
    password: '',
    confirm_password: '',
  };
  moveToSignIn() {
    this.props.navigation.dispatch(NAVIGATION_TO_LOGIN);
  }
  moveToPrevious() {
    this.props.navigation.goBack();
  }
  moveToNext() {
    if (this.state.usernameField === '') {
      this.setState({usernameError: STRINGS.t('username_error_message')});
    } else if (
      this.state.usernameField.length < 2 ||
      this.state.usernameField.length > 20
    ) {
      this.setState({usernameError: STRINGS.t('username_char_error_message')});
    }
    if (this.state.password === '') {
      this.setState({passwordError: STRINGS.t('blank_password_error_message')});
    }

    if (this.state.password !== '') {
      if (this.state.password.length < 6) {
        this.setState({passwordError: STRINGS.t('password_error_message')});
      }
    }

    if (this.state.confirm_password === '') {
      this.setState({
        confirmPasswordError: STRINGS.t('confirm_password_error_message'),
      });
    } else {
      if (this.state.password !== this.state.confirm_password) {
        this.setState({confirmPasswordError: STRINGS.t('confirm_password')});
      }
    }

    if (
      this.state.usernameField !== '' &&
      this.state.password !== '' &&
      this.state.password.length >= 6 &&
      this.state.confirm_password !== '' &&
      this.state.password === this.state.confirm_password &&
      this.state.usernameError === ''
    ) {
      AsyncStorage.getItem('UserInfoForReg')
        .then(value => {
          var dict = JSON.parse(value);
          let dict1 = {
            fname: dict.fname,
            lname: dict.lname,
            email: dict.email,
            username: this.state.usernameField,
            newpass: this.state.password,
          };
          AsyncStorage.setItem('UserInfoForReg1', JSON.stringify(dict1));
        })
        .done();
      this.props.navigation.navigate('SignUp2Screen');
    }
  }

  callCheckUsernameApi() {
    if (this.state.usernameField !== '') {
      callPostApi(GLOBAL.BASE_URL + GLOBAL.Check_Username, {
        username: this.state.usernameField,
      }).then(result => {
        if (result.status === 'success') {
        } else {
          this.setState({usernameError: result.message});
        }
      });
    }
  }

  onChangeUsername(text) {
    if (text !== '') {
      this.setState({
        usernameError: '',
      });
    } else {
      this.setState({
        usernameError: STRINGS.t('username_error_message'),
      });
    }
    return text.replace(/[^\w\s]/gi, '');
  }

  onChange(fieldVal, fieldName) {
    if (fieldName === 'usernameError') {
      if (fieldVal !== '') {
        this.setState({
          [fieldName]: '',
        });
      } else {
        this.setState({
          [fieldName]: STRINGS.t('username_error_message'),
        });
      }
    }

    if (fieldName === 'passwordError') {
      if (fieldVal !== '') {
        if (fieldVal.length < 6) {
          this.setState({
            [fieldName]: STRINGS.t('password_error_message'),
          });
        } else {
          this.setState({
            [fieldName]: '',
          });
        }
      } else {
        this.setState({
          [fieldName]: STRINGS.t('blank_password_error_message'),
        });
      }
    }

    if (fieldName === 'confirmPasswordError') {
      if (fieldVal !== '') {
        if (this.state.password !== fieldVal) {
          this.setState({
            [fieldName]: STRINGS.t('confirm_password'),
          });
        } else {
          this.setState({
            [fieldName]: '',
          });
        }
      } else {
        this.setState({
          [fieldName]: STRINGS.t('confirm_password_error_message'),
        });
      }
    }
  }

  onIconClick(msg) {
    this.dropdown.alertWithType('error', 'Error', msg);
  }

  render() {
    return (
      <View style={loginStyles.backgroundImage}>
        <View style={loginStyles.iphonexHeader} />
        <ImageBackground
          style={Styles.header_bg}
          source={Images.header_background}>
          <View style={Styles.header_view}>
            <TouchableOpacity
              style={Styles.back_icon_parent}
              onPress={this.moveToPrevious.bind(this)}>
              <Image style={Styles.back_icon} source={Images.back_icon} />
            </TouchableOpacity>
            <Text style={Styles.header_title}>{STRINGS.t('SIGNUP')}</Text>
          </View>
        </ImageBackground>
        <View style={signUpStyles.backgroundViewContainer}>
          <Text style={signUpStyles.generalInfoStyle}>
            {STRINGS.t('Account_Information')}
          </Text>
        </View>
        <ScrollView style={signUpStyles.keyboardContainer}>
          <View style={signUpStyles.viewContainer}>
            <View style={signUpStyles.textInputBackgroundViewContainer}>
              <Image style={signUpStyles.logoImage} source={Images.username} />
              <TextInput
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
                style={signUpStyles.textInput}
                returnKeyType="next"
                keyboardType="default"
                onChangeText={value =>
                  this.setState({usernameField: this.onChangeUsername(value)})
                }
                onEndEditing={this.callCheckUsernameApi.bind(this)}
                value={this.state.usernameField.toString()}
              />
              {this.state.usernameError !== '' ? (
                <Icon
                  onPress={() => this.onIconClick(this.state.usernameError)}
                  name="ios-alert"
                  style={{color: 'red'}}
                />
              ) : null}
            </View>
            {this.state.usernameError !== '' ? (
              <View style={signUpStyles.lineErrorView} />
            ) : (
              <View style={signUpStyles.lineView} />
            )}
            <View style={signUpStyles.textInputBackgroundViewContainer}>
              <Image style={signUpStyles.logoImage} source={Images.password} />
              <TextInput
                secureTextEntry
                placeholderTextColor={
                  this.state.passwordError === '' ? '#999999' : 'red'
                }
                placeholder={
                  this.state.passwordError === ''
                    ? STRINGS.t('Password')
                    : this.state.passwordError
                }
                underlineColorAndroid="transparent"
                style={signUpStyles.textInput}
                returnKeyType="next"
                keyboardType="default"
                onChangeText={val =>
                  this.setState(
                    {password: val},
                    this.onChange(val, 'passwordError'),
                  )
                }
                value={this.state.password}
              />
              {this.state.passwordError !== '' ? (
                <Icon
                  onPress={() => this.onIconClick(this.state.passwordError)}
                  name="ios-alert"
                  style={{color: 'red'}}
                />
              ) : null}
            </View>
            {this.state.passwordError !== '' ? (
              <View style={signUpStyles.lineErrorView} />
            ) : (
              <View style={signUpStyles.lineView} />
            )}
            <View style={signUpStyles.textInputBackgroundViewContainer}>
              <Image style={signUpStyles.logoImage} source={Images.password} />
              <TextInput
                secureTextEntry
                placeholderTextColor={
                  this.state.confirmPasswordError === '' ? '#999999' : 'red'
                }
                placeholder={
                  this.state.confirmPasswordError === ''
                    ? STRINGS.t('Confirm_Password')
                    : this.state.confirmPasswordError
                }
                underlineColorAndroid="transparent"
                style={signUpStyles.textInput}
                returnKeyType="next"
                keyboardType="default"
                onChangeText={val =>
                  this.setState(
                    {confirm_password: val},
                    this.onChange(val, 'confirmPasswordError'),
                  )
                }
                value={this.state.confirm_password}
              />
              {this.state.confirmPasswordError !== '' ? (
                <Icon
                  onPress={() =>
                    this.onIconClick(this.state.confirmPasswordError)
                  }
                  name="ios-alert"
                  style={{color: 'red'}}
                />
              ) : null}
            </View>
            {this.state.confirmPasswordError !== '' ? (
              <View style={signUpStyles.lineErrorView} />
            ) : (
              <View style={signUpStyles.lineView} />
            )}
            <TouchableOpacity
              style={signUpStyles.leftbuttonContainer}
              onPress={this.moveToPrevious.bind(this)}
            />
            <TouchableOpacity
              style={signUpStyles.rightbuttonContainer}
              onPress={this.moveToNext.bind(this)}>
              <Image source={Images.nextarrow} />
            </TouchableOpacity>
            <KeyboardSpacer />
          </View>
        </ScrollView>
        <View style={loginStyles.footerParent}>
          <View style={loginStyles.footerlineView} />
          <View style={loginStyles.footerContainer}>
            <Text style={loginStyles.memberStyles}>
              {STRINGS.t('Already_Registered')}
            </Text>
            <TouchableOpacity onPress={this.moveToSignIn.bind(this)}>
              <Text style={loginStyles.usernameAndPasswordStyles}>
                {STRINGS.t('SIGNIN')}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={loginStyles.iphonexFooter} />
        </View>
        <DropdownAlert ref={ref => (this.dropdown = ref)} />
      </View>
    );
  }
}
export default SignUp1;
