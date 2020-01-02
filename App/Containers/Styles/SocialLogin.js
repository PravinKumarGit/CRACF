import {Dimensions, Platform} from 'react-native'
import { ifIphoneX } from 'react-native-iphone-x-helper'
const { width, height } = Dimensions.get('window')

export default {
	
	HeaderContainer:{
        height: 60,
        width: '100%',
        flexDirection: 'row',
    },

    HeaderBackground:{
        position:'absolute',
        resizeMode:'stretch',
        width:'100%',
        height:60,
    },
    
	back_icon: {
        height:25,
        resizeMode:'contain',
        position:'absolute',
        top:18,
        marginLeft: (Platform.OS === 'ios') ? 15 : 0,
    },

	header_title:{
		width:'60%',
		color:'#ffffff',
		fontSize:16,
		backgroundColor: 'transparent',
		alignSelf: 'center',
        textAlign: 'center',        
        fontFamily: 'roboto-regular',
        fontWeight:'bold'
    },

    restoreview:{
        justifyContent:'center',
        borderWidth:1,
        borderColor:'#FFFFFF',
        height:25,
        padding:5,
        alignSelf:'flex-end',
        marginRight:15
    },

    restoreviewtext:{
        color:'#FFFFFF',
        fontSize:12,
        alignSelf: 'center',
        fontFamily:'roboto-regular',  
    },
    
	back_icon_parent:{
		height:'100%',
		width:'20%',
        justifyContent:'center',
	},

backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%'
    },
  logoBackgroundStyle:{
		flexDirection: 'column',
		justifyContent: 'center',
		width: '100%',
		height: '30%'
	},
  lineView:{
    height: 0.5,
    width:'100%'-20,
    backgroundColor: '#949494',
  },
   lineViewTextBox:{
    height: 0.5,
    width:'100%',
    backgroundColor: '#949494',
  },
  
  lineErrorView:{
    height: 0.5,
    width:'100%'-20,
    backgroundColor: 'red',
  },
  logoBackGround1:
  {
    marginTop: 10,
    width: '100%',
    justifyContent: 'center',
    resizeMode: 'contain'
  },
  viewContainer: {
		flex : 1,
		justifyContent: 'flex-start',
		alignItems: 'center',
		backgroundColor: 'white',
		padding: 10
  },
  backgroundViewContainer: {
   marginTop:5,
   flex: 1,
   flexDirection: 'row',
   justifyContent: 'center',
   alignSelf: 'center',
   alignItems: 'center',
   height: 50,
   width:'100%'-20,
   backgroundColor: 'transparent'
 },
 logoImage: {
   marginLeft : 10
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
 buttonContainer: {
   justifyContent: 'center',
   alignItems: 'center',
   backgroundColor: '#0D2481',
   marginTop: 10,
   height: 70,
   width: '90%',
   padding : 5,
   elevation : 5,
   borderRadius:6,
    borderWidth: 1,
    borderColor: '#0D2481'
 },

 buttonContainerGoogleDrive: {
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#3B80F6',
  marginTop: 10,
  height: 70,
  width: '90%',
  padding : 5,
  elevation : 5,
  borderRadius:6,
  borderWidth: 1,
  borderColor: '#3B80F6'
},

buttonContainerEvernote: {
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#7AC144',
  marginTop: 10,
  height: 70,
  width: '90%',
  padding : 5,
  elevation : 5,
  borderRadius:6,
  borderWidth: 1,
  borderColor: '#7AC144'
},

 style_btnLogin:{
   backgroundColor: 'transparent',
   fontSize: 20,
   color: 'white',
   marginTop : 5,
   fontWeight : 'bold',
   textAlign: 'center'
},


style_GoogleBtnLogin:{
    backgroundColor: 'transparent',
    fontSize: 20,
    color: 'white',
    marginTop : 5,
    marginRight : 10,
    fontWeight : 'bold',
    textAlign: 'center'
 },



style_EvernoteBtnLogin:{
    backgroundColor: 'transparent',
    fontSize: 20,
    color: 'white',
    marginTop : 5,
    marginLeft : 10,
    fontWeight : 'bold',
    textAlign: 'center'
 },



style_DropBoxBtnLogin:{
    backgroundColor: 'transparent',
    fontSize: 20,
    color: 'white',
    marginTop : 5,
    fontWeight : 'bold',
    textAlign: 'center'
 },



checkBoxContainer: {
  flex : 1,
  alignItems: 'center',
  alignSelf: 'center',
  flexDirection: 'row',
  backgroundColor: 'white',
  height: 30,
  width: '100%',
  marginTop: 15,
},
footerParent:{
  ...ifIphoneX({
    height: 84,
    width:'100%',
    backgroundColor:'#1683c0'
  }, {
    height:50
  }),
  width:'100%',
  bottom: 0,
  position: 'absolute'
},
footerContainer: {
  flex : 1,
  justifyContent: 'center',
  flexDirection: 'row',
  backgroundColor: 'white',
  height: 50,
  width: '100%',
  paddingLeft:10,
  paddingRight:10
},
forgotContainer: {
  flex : 1,
  justifyContent: 'center',
  flexDirection: 'row',
  backgroundColor: 'white',
  height: 40,
  width: '100%'-20,
  marginTop: 15
},
scroll_container:{
		backgroundColor: 'white',
		flex : 1,
    height: '66.66%'
	},
  checkBoxStyles:{
    width:28,
    height:28
 },
 rememberMeStyles:{
   height:30 ,
   color: '#949494',
   paddingTop: 5 ,
   paddingLeft: 5
 },
 forgotStyles:{
   height:40 ,
   color: '#949494' ,
   paddingTop: 10 ,
   fontSize: 18
 },
 usernameAndPasswordStyles:{
   height:40 ,
   color: '#0c74c5' ,
   paddingTop: 10 ,
   fontSize: 18
 },
 slashStyle:{
   height:40 ,
   color: '#949494' ,
   paddingTop: 10 ,
   fontSize: 18
 },
 footerlineView:{
   height: 0.5,
   width:'100%',
   backgroundColor: '#949494',
   left: 0,
   right: 0,
   position: 'absolute',
   ...ifIphoneX({
    bottom: 85,
   }, {
    bottom: 51,
   })
 },
 memberStyles:{
   height:40 ,
   color: '#949494' ,
   paddingTop: 10 ,
   fontSize: 18
 },
 iphonexHeader:{
   ...ifIphoneX({
       height: 44,
       width:'100%',
       backgroundColor:'#1683c0'
   }, {
       height:0
   })

 },
 iphonexFooter:{
   ...ifIphoneX({
     height: 34,
     width:'100%',
     backgroundColor:'#1683c0'
   }, {
     height:0
   })

 },
 headerbtnText:{
  color:'#ffffff',
  fontSize:16,
  backgroundColor: 'transparent',    
  fontFamily: 'roboto-regular',
  fontWeight:'bold',
  padding:10
},
}
