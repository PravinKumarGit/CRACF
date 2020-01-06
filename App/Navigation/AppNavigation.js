/**
 * @description Navigtion stack from react-navigation
 */
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Login from '../Containers/Login';
import SignUp from '../Containers/SignUp';
import SignUp1 from '../Containers/SignUp1';
import SignUp2 from '../Containers/SignUp2';
// import Dashboard from '../Containers/Dashboard';
import ForgotPassword from '../Containers/ForgotPassword';
import ForgotUsername from '../Containers/ForgotUsername';
// import BuyerCalculator from '../Containers/BuyerCalculator';
// import AddressBook from '../Containers/AddressBook';
// import Account from '../Containers/Account';
// import Calculation from '../Containers/Calculation';
// import SellerCalculator from '../Containers/SellerCalculator';
// import AppSettings from '../Containers/AppSettings';
// import MyTitleRep from '../Containers/MyTitleRep';
// import PrivacyPolicy from '../Containers/PrivacyPolicy';
// import Language from '../Containers/Language';
// import ChangeState from '../Containers/ChangeState';
// import ChangePassword from '../Containers/ChangePassword';
// import QuickQuotes from '../Containers/QuickQuotes';
// import NetFirstCalculator from '../Containers/NetFirstCalculator';
// import Refinance from '../Containers/Refinance';
// import RentVsBuyCalculator from '../Containers/RentVsBuyCalculator';
// import DropboxWebView from '../Containers/DropboxWebView';
// import EvernoteWebView from '../Containers/EvernoteWebView';
// import GoogleSigninExample from '../Containers/GoogleSignin';
// import AutoApiPdfUpload from '../Containers/AutoApiPdfUpload';
// import GooglePlaceAutoComplete from '../Containers/googlePlaceAutoComplete';
// import SsoRegistration from '../Containers/SsoRegistration';

const PrimaryNav = createStackNavigator(
  {
    LoginScreen: {screen: Login},
    SignUpScreen: {screen: SignUp},
    SignUp1Screen: {screen: SignUp1},
    SignUp2Screen: {screen: SignUp2},
    // DashboardScreen: {screen: Dashboard},
    ForgotPasswordScreen: {screen: ForgotPassword},
    ForgotUsernameScreen: {screen: ForgotUsername},
    // CardScreen: { screen: CardScreen },
    // VideoScreen: { screen: VideoScreen },
    // MoreVideos: { screen: MoreVideos },
    // OTPScreen: { screen: OTPScreen },
    // RegisterScreen: { screen: RegisterScreen },
    // LoginScreen: { screen: LoginScreen },
    // ProfileScreen: { screen: ProfileScreen },
    // Videos: { screen: Videos },
    // SubscriptionPlan: { screen: SubscriptionPlan },
    // SubscriptionDetail: { screen: SubscriptionDetail },
    // IntroVideo: { screen : IntroVideo },
    // TermsAndConditions: { screen : TermsAndConditions},
    // ContactUs: { screen : ContactUs },
    // Notifications: { screen : Notifications },
    // ThanksScreen: { screen : ThanksScreen}
  },
  {
    // Default config for all screens
    headerMode: 'none',
    initialRouteName: 'LoginScreen',
    navigationOptions: {
      // headerStyle: styles.header,
    },
  },
);

export default createAppContainer(PrimaryNav);
