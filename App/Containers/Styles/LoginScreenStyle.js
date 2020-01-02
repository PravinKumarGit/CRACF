import {Dimensions, Platform} from 'react-native';
import {ifIphoneX} from 'react-native-iphone-x-helper';
const {width, height} = Dimensions.get('window');

export default {
  HeaderContainer: {
    height: 60,
    width: width,
    flexDirection: 'row',
  },

  HeaderBackground: {
    position: 'absolute',
    resizeMode: 'stretch',
    width: width,
    height: 60,
  },

  buttonContainerSend: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#CB2416',
    marginTop: 10,
    height: 50,
    width: width,
  },
  back_icon: {
    height: 25,
    resizeMode: 'contain',
    position: 'absolute',
    top: 18,
    marginLeft: Platform.OS === 'ios' ? 15 : 0,
  },

  header_title: {
    width: '60%',
    color: '#ffffff',
    fontSize: 16,
    backgroundColor: 'transparent',
    alignSelf: 'center',
    textAlign: 'center',
    fontFamily: 'roboto-regular',
    fontWeight: 'bold',
  },

  restoreview: {
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    height: 25,
    padding: 5,
    alignSelf: 'flex-end',
    marginRight: 15,
  },

  restoreviewtext: {
    color: '#FFFFFF',
    fontSize: 12,
    alignSelf: 'center',
    fontFamily: 'roboto-regular',
  },

  back_icon_parent: {
    height: height,
    width: '20%',
    justifyContent: 'center',
  },

  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  logoBackgroundStyle: {
    flexDirection: 'column',
    justifyContent: 'center',
    width: width,
    height: 60,
  },
  lineView: {
    height: 0.5,
    width: width - 20,
    backgroundColor: '#949494',
  },
  lineViewTextBox: {
    height: 0.5,
    width: width,
    backgroundColor: '#949494',
  },

  lineErrorView: {
    height: 0.5,
    width: width - 20,
    backgroundColor: 'red',
  },
  logoBackGround1: {
    marginTop: 10,
    width: width,
    justifyContent: 'center',
    resizeMode: 'contain',
  },
  viewContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
  },
  backgroundViewContainer: {
    marginTop: 5,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    height: 50,
    backgroundColor: 'transparent',
  },
  logoImage: {
    marginLeft: 10,
  },
  textInput: {
    color: 'black',
    fontSize: 14,
    height: 50,
    backgroundColor: 'transparent',
    marginTop: 0,
    padding: 10,
    flex: 4.0,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0c74c5',
    marginTop: 10,
    height: 50,
    width: width,
  },
  style_btnLogin: {
    backgroundColor: 'transparent',
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
  },
  checkBoxContainer: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
    height: 30,
    width: width,
    marginTop: 15,
  },
  footerParent: {
    ...ifIphoneX(
      {
        height: 84,
        width: width,
        backgroundColor: '#1683c0',
      },
      {
        height: 50,
      },
    ),
    width: width,
    bottom: 0,
    position: 'absolute',
  },
  footerContainer: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
    height: 50,
    width: width,
    paddingLeft: 10,
    paddingRight: 10,
  },
  forgotContainer: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
    height: 40,
    marginLeft: 10,
    width: width - 20,
    marginTop: 15,
  },
  scroll_container: {
    backgroundColor: 'white',
    flex: 1,
    height: '66.66%',
  },
  checkBoxStyles: {
    width: 28,
    height: 28,
  },
  rememberMeStyles: {
    height: 30,
    color: '#949494',
    paddingTop: 5,
    paddingLeft: 5,
  },
  forgotStyles: {
    height: 40,
    color: '#949494',
    paddingTop: 10,
    fontSize: 18,
  },
  usernameAndPasswordStyles: {
    height: 40,
    color: '#0c74c5',
    paddingTop: 10,
    fontSize: 18,
  },
  slashStyle: {
    height: 40,
    color: '#949494',
    paddingTop: 10,
    fontSize: 18,
  },
  footerlineView: {
    height: 0.5,
    width: width,
    backgroundColor: '#949494',
    left: 0,
    right: 0,
    position: 'absolute',
    ...ifIphoneX(
      {
        bottom: 85,
      },
      {
        bottom: 51,
      },
    ),
  },
  memberStyles: {
    height: 40,
    color: '#949494',
    paddingTop: 10,
    fontSize: 18,
  },
  iphonexHeader: {
    ...ifIphoneX(
      {
        height: 44,
        width: width,
        backgroundColor: '#1683c0',
      },
      {
        height: 0,
      },
    ),
  },
  iphonexFooter: {
    ...ifIphoneX(
      {
        height: 34,
        width: width,
        backgroundColor: '#1683c0',
      },
      {
        height: 0,
      },
    ),
  },
  headerbtnText: {
    color: '#ffffff',
    fontSize: 16,
    backgroundColor: 'transparent',
    fontFamily: 'roboto-regular',
    fontWeight: 'bold',
    padding: 10,
  },
};
