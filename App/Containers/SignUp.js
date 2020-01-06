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
import KeyboardSpacer from 'react-native-keyboard-spacer';

import signUpStyles from './Styles/SignUpStyle';
import loginStyles from './Styles/LoginScreenStyle';
import Images from '../Themes/Images.js';
import STRINGS from '../GlobalString/StringData';
import {validateEmail} from '../Services/CommonValidation.js';
import Styles from './Styles/SellerStyleDesign';

class SignUp extends Component {
  state = {
    first_name: '',
    last_name: '',
    firstNameError: '',
    lastNameError: '',
    emailAddressError: '',
    confirmEmailAddressError: '',
    email_address: '',
    confirm_email_address: '',
  };
  moveToSignIn() {
    this.props.navigation.goBack();
  }

  moveToNextSignUp() {
    if (this.state.first_name === '') {
      this.setState({firstNameError: STRINGS.t('first_name_error_message')});
    } else if (
      this.state.first_name.length < 2 ||
      this.state.first_name.length > 50
    ) {
      this.setState({
        firstNameError: STRINGS.t('first_name_char_error_message'),
      });
    } else {
      this.setState({firstNameError: ''});
    }
    if (this.state.last_name === '') {
      this.setState({lastNameError: STRINGS.t('last_name_error_message')});
    } else if (
      this.state.last_name.length < 2 ||
      this.state.last_name.length > 50
    ) {
      this.setState({lastNameError: STRINGS.t('last_name_char_error_message')});
    } else {
      this.setState({lastNameError: ''});
    }
    if (this.state.email_address === '') {
      this.setState({emailAddressError: STRINGS.t('email_error_message')});
    } else if (
      this.state.email_address.length < 2 ||
      this.state.email_address.length > 100
    ) {
      this.setState({emailAddressError: STRINGS.t('email_char_error_message')});
    } else {
      this.setState({emailAddressError: ''});
    }
    if (this.state.email_address !== '') {
      if (!validateEmail(this.state.email_address)) {
        this.setState({
          emailAddressError: STRINGS.t('validation_email_error_message'),
        });
      } else {
        this.setState({emailAddressError: ''});
      }
    }
    if (this.state.confirm_email_address === '') {
      this.setState({
        confirmEmailAddressError: STRINGS.t('confirm_email_error_message'),
      });
    } else {
      if (this.state.email_address !== this.state.confirm_email_address) {
        this.setState({confirmEmailAddressError: STRINGS.t('confirm_email')});
      } else {
        this.setState({confirmEmailAddressError: ''});
      }
    }

    if (
      this.state.first_name !== '' &&
      this.state.last_name !== '' &&
      this.state.email_address !== '' &&
      this.state.confirm_email_address !== '' &&
      validateEmail(this.state.email_address) &&
      this.state.email_address === this.state.confirm_email_address
    ) {
      const dict = {
        fname: this.state.first_name,
        lname: this.state.last_name,
        email: this.state.email_address,
      };
      AsyncStorage.setItem('UserInfoForReg', JSON.stringify(dict));
      this.props.navigation.navigate('SignUp1Screen');
    }
  }

  onChange(fieldVal, fieldName) {
    if (fieldName === 'firstNameError') {
      if (fieldVal !== '') {
        this.setState({
          [fieldName]: '',
        });
      } else {
        this.setState({
          [fieldName]: STRINGS.t('first_name_error_message'),
          ['last_name']: '',
        });
      }
    }

    if (fieldName === 'lastNameError') {
      if (fieldVal !== '') {
        this.setState({
          [fieldName]: '',
        });
      } else {
        this.setState({
          [fieldName]: STRINGS.t('last_name_error_message'),
          ['first_name']: '',
        });
      }
    }

    if (fieldName === 'emailAddressError') {
      if (fieldVal !== '') {
        if (!validateEmail(fieldVal)) {
          this.setState({
            [fieldName]: STRINGS.t('validation_email_error_message'),
            ['email_address']: '',
          });
        } else {
          this.setState({
            [fieldName]: '',
          });
        }
      } else {
        if (fieldVal === '') {
          this.setState({
            [fieldName]: STRINGS.t('email_error_message'),
          });
        } else if (fieldVal.length < 2 || fieldVal.length > 100) {
          this.setState({
            [fieldName]: STRINGS.t('email_char_error_message'),
          });
        } else {
          this.setState({
            [fieldName]: '',
          });
        }
      }
    }

    if (fieldName === 'confirmEmailAddressError') {
      if (fieldVal !== '') {
        if (this.state.email_address !== fieldVal) {
          this.setState({
            [fieldName]: STRINGS.t('confirm_email'),
            ['confirm_email_address']: '',
          });
        } else {
          this.setState({
            [fieldName]: '',
          });
        }
      } else {
        this.setState({
          [fieldName]: STRINGS.t('confirm_email_error_message'),
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
              onPress={this.moveToSignIn.bind(this)}>
              <Image style={Styles.back_icon} source={Images.back_icon} />
            </TouchableOpacity>
            <Text style={Styles.header_title}>{STRINGS.t('SIGNUP')}</Text>
          </View>
        </ImageBackground>

        <View style={signUpStyles.backgroundViewContainer}>
          <Text style={signUpStyles.generalInfoStyle}>
            {STRINGS.t('General_Information')}
          </Text>
        </View>

        <ScrollView style={signUpStyles.keyboardContainer}>
          <View style={signUpStyles.viewContainer}>
            <View style={signUpStyles.textInputBackgroundViewContainer}>
              <Image style={signUpStyles.logoImage} source={Images.username} />
              <TextInput
                placeholderTextColor={
                  this.state.firstNameError === '' ? '#999999' : 'red'
                }
                placeholder={
                  this.state.firstNameError === ''
                    ? STRINGS.t('first_name')
                    : this.state.firstNameError
                }
                underlineColorAndroid="transparent"
                secureTextEntry={false}
                style={signUpStyles.textInput}
                returnKeyType="next"
                keyboardType="email-address"
                onChangeText={val => this.setState({first_name: val})}
                onBlur={() =>
                  this.onChange(this.state.first_name, 'firstNameError')
                }
                value={this.state.first_name}
              />
              {this.state.firstNameError !== '' ? (
                <Icon
                  onPress={() => this.onIconClick(this.state.firstNameError)}
                  name="ios-alert"
                  style={{color: 'red'}}
                />
              ) : null}
            </View>
            {this.state.firstNameError !== '' ? (
              <View style={signUpStyles.lineErrorView} />
            ) : (
              <View style={signUpStyles.lineView} />
            )}

            <View style={signUpStyles.textInputBackgroundViewContainer}>
              <Image style={signUpStyles.logoImage} source={Images.username} />
              <TextInput
                placeholderTextColor={
                  this.state.lastNameError === '' ? '#999999' : 'red'
                }
                placeholder={
                  this.state.lastNameError === ''
                    ? STRINGS.t('last_name')
                    : this.state.lastNameError
                }
                underlineColorAndroid="transparent"
                secureTextEntry={false}
                style={signUpStyles.textInput}
                returnKeyType="next"
                keyboardType="email-address"
                onChangeText={val => this.setState({last_name: val})}
                onBlur={() =>
                  this.onChange(this.state.last_name, 'lastNameError')
                }
                value={this.state.last_name}
              />
              {this.state.lastNameError !== '' ? (
                <Icon
                  onPress={() => this.onIconClick(this.state.lastNameError)}
                  name="ios-alert"
                  style={{color: 'red'}}
                />
              ) : null}
            </View>
            {this.state.lastNameError !== '' ? (
              <View style={signUpStyles.lineErrorView} />
            ) : (
              <View style={signUpStyles.lineView} />
            )}
            <View style={signUpStyles.textInputBackgroundViewContainer}>
              <Image style={signUpStyles.logoImage} source={Images.emailid} />
              <TextInput
                ref="emailAddress"
                placeholderTextColor={
                  this.state.emailAddressError === '' ? '#999999' : 'red'
                }
                placeholder={
                  this.state.emailAddressError === ''
                    ? STRINGS.t('email_address')
                    : this.state.emailAddressError
                }
                underlineColorAndroid="transparent"
                secureTextEntry={false}
                style={signUpStyles.textInput}
                returnKeyType="next"
                keyboardType="email-address"
                onChangeText={val => this.setState({email_address: val})}
                onBlur={() =>
                  this.onChange(this.state.email_address, 'emailAddressError')
                }
                value={this.state.email_address}
              />
              {this.state.emailAddressError !== '' ? (
                <Icon
                  onPress={() => this.onIconClick(this.state.emailAddressError)}
                  name="ios-alert"
                  style={{color: 'red'}}
                />
              ) : null}
            </View>
            {this.state.emailAddressError !== '' ? (
              <View style={signUpStyles.lineErrorView} />
            ) : (
              <View style={signUpStyles.lineView} />
            )}

            <View style={signUpStyles.textInputBackgroundViewContainer}>
              <Image style={signUpStyles.logoImage} source={Images.emailid} />
              <TextInput
                ref="confirmEmailAddress"
                placeholderTextColor={
                  this.state.confirmEmailAddressError === '' ? '#999999' : 'red'
                }
                placeholder={
                  this.state.confirmEmailAddressError === ''
                    ? STRINGS.t('confirm_email_address')
                    : this.state.confirmEmailAddressError
                }
                underlineColorAndroid="transparent"
                secureTextEntry={false}
                style={signUpStyles.textInput}
                returnKeyType="default"
                keyboardType="email-address"
                onChangeText={val =>
                  this.setState({confirm_email_address: val})
                }
                onBlur={() =>
                  this.onChange(
                    this.state.confirm_email_address,
                    'confirmEmailAddressError',
                  )
                }
                value={this.state.confirm_email_address}
              />
              {this.state.confirmEmailAddressError !== '' ? (
                <Icon
                  onPress={() =>
                    this.onIconClick(this.state.confirmEmailAddressError)
                  }
                  name="ios-alert"
                  style={{color: 'red'}}
                />
              ) : null}
            </View>
            {this.state.confirmEmailAddressError !== '' ? (
              <View style={signUpStyles.lineErrorView} />
            ) : (
              <View style={signUpStyles.lineView} />
            )}

            <TouchableOpacity
              style={signUpStyles.rightContainer}
              onPress={this.moveToNextSignUp.bind(this)}>
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

export default SignUp;
