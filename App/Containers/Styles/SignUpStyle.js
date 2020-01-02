import {Dimensions, Platform} from 'react-native'

const { width, height } = Dimensions.get('window')

export default {

 backgroundImage: {
      flex: 1,
    },
    logoBackgroundStyle:{
  		flexDirection: 'column',
  		justifyContent: 'center',
  		width: '100%',
  		height: '33.33%'
    },
    
    backgroundViewContainer: {
     marginTop: 0,
     flexDirection: 'row',
     justifyContent: 'center',
     alignSelf: 'center',
     alignItems: 'center',
     height: 40,
     width:'100%',
     backgroundColor: 'white',
     shadowColor: '#708090',
     shadowOffset: {
       width: 0,
       height: 2
     },
     shadowRadius: 3,
     shadowOpacity: 1.0
   },

   backgroundViewContainerSsoRegistration: {
    marginTop: 0,
    flexDirection: 'column',
    height: 65,
    width:'100%',
    backgroundColor: 'white',
    borderRadius: 2,
    borderWidth: 0.5,
    borderColor: 'black',
    shadowColor: '#708090',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 3,
    shadowOpacity: 1.0
  },


   generalInfoStyle:{
     color: 'black',
     fontSize: 16,
     height: 50,
     width: '100%',
     backgroundColor: 'transparent',
     marginTop: 0,
     paddingTop: 15,
     paddingLeft: 20
  },

  generalInfoStyleSsoRegistration:{
    color: 'red',
    fontSize: 16,
    height: 25,
    width: '100%',
    backgroundColor: 'transparent',
    marginTop: 0,
    //paddingTop: 15,
    paddingLeft: 0
 },

  generalInfoStyleSsoRegistrationDes:{
    color: 'black',
    fontSize: 14,
    height: 40,
    width: '100%',
    backgroundColor: 'transparent',
    marginTop: 0,
    //paddingTop: 15,
    paddingLeft: 0
  },


  viewContainer: {
    height:'100%',
    width:'100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10
  },
  textInputBackgroundViewContainer: {
   marginTop:5,
   flexDirection: 'row',
   alignSelf: 'center',
   alignItems: 'center',
   height: 50,
   width:'100%'-20,
   backgroundColor: 'transparent'
  },
  smallTextInputBackgroundViewContainer: {
   flexDirection: 'row',
   alignSelf: 'center',
   alignItems: 'center',
   height: 50,
   width:'(width-40)/2',
   backgroundColor: 'transparent'
  },
  leftcolumnViewContainer: {
   flexDirection: 'column',
   alignSelf: 'center',
   alignItems: 'center',
   height: 50,
   width:(width-40)/2,
   backgroundColor: 'transparent'
  },
  rightcolumnViewContainer: {
   marginLeft:20,
   flexDirection: 'column',
   alignSelf: 'flex-end',
   alignItems: 'center',
   height: 50,
   width:(width-40)/2,
   backgroundColor: 'transparent'
  },
  smallLineView:{
    height: 0.5,
    width:(width-40)/2,
    backgroundColor: '#949494',
  },
  logoImage: {
   marginLeft : 10
  },
  leftbuttonContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    marginTop: 20,
    height: 50,
    width: 50,
    alignSelf: 'flex-start',
  },
  rightbuttonContainer:{
    justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundColor: 'transparent',
    marginTop: -50,
    height: 50,
    width: 50,
    alignSelf: 'flex-end'
  },
  rightContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundColor: 'transparent',
    marginTop: 0,
    height: 50,
    width: 50,
    alignSelf: 'flex-end'
  },
  textInput: {
   color: 'black',
   fontSize: 14,
   height: 50,
   backgroundColor: 'transparent',
   marginTop: 0,
   padding: 10,
   flex: 4.0
  },
  lineView:{
    height: 0.5,
    width:'100%',
    backgroundColor: '#949494',
  },
  keyboardContainer: {
    flex: 1,
    bottom : 60,
    marginTop: 65,
    width: '100%',
    flexDirection: 'column'
  },
 
  keyboardContainerSsoRegistration: {
    flex: 1,
    width: '100%',
    flexDirection: 'column'
  },
 
  
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0c74c5',
    marginTop: -50,
    height: 50,
    width: width/2
  },
  
  buttonContainerSignupSubmit: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0c74c5',
    marginTop: 10,
    height: 50,
     width: '100%'
  },
	style_btnLogin:{
	   backgroundColor: 'transparent',
	   fontSize: 20,
	   color: 'white',
	   textAlign: 'center'
	},

  drpdwnlabelbig:{
    color:'#949494',
    fontSize:14,
    width:'50%',
    paddingLeft:10,
    paddingTop:10
  },

  drpdwnlabel:{
    color:'#949494',
    fontSize:14,
    width:'50%',
    paddingLeft:10,
    paddingTop:10
  },
  drpdwnIcon:{
    width:9,
    height:9,
    top:16,
    right: 14,
    position:'absolute',
    resizeMode:'contain'
  },
  drpdwnIconsmall:{
    width:9,
    height:9,
    top:16,
    right: 14,
    position:'absolute',
    resizeMode:'contain'
  }
 }
