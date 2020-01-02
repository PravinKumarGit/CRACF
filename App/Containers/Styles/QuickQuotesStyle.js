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
	messageIconStyle : {
		marginTop:20, 
		marginLeft: 15
	},

	BodyContainer:{
		width:'100%',
		height:'100%'-60,
		backgroundColor:'transparent'
	},

	scrollviewstyle:{
		padding:10
	},

	ConditionalContainer:{
		width:'100%',
		height:'100%'
	},
	
	ButtonViewStyle : {
		flexDirection : 'row',
		justifyContent: 'center',
		marginTop:12,
		alignItems:'center'
	},
	
	ButtonStyle : {
		borderRadius: 4,
		borderWidth: 2,
		borderColor: '#1683c0',
		backgroundColor : '#1683c0',
		marginRight : 10
	},
	
	ButtonWhiteStyle : {
		borderRadius: 4,
		borderWidth: 2,
		borderColor: '#1683c0',
		backgroundColor : '#fff',
		marginRight : 10
	},

	lineView:{
		height: 0.5,
		width:'100%',
		backgroundColor: '#949494',
	},

	lineErrorView:{
		height: 0.5,
		width:'100%',
		backgroundColor: 'red',
	},
	
	ButtonWhiteTextStyle : {
		color : '#fff',
		paddingHorizontal : 20,		
		fontFamily: 'roboto-regular',
	}, 
	
	ButtonBlueTextStyle : {
		color : '#1683c0',
		paddingHorizontal : 20,
		fontFamily: 'roboto-regular',
	},

	TabsMainContainer : {
		flexDirection : 'column'
	},
	
	dropdwnContainer1:{
		width:'30%',
		paddingRight:5,
	},
	
	dropdwnContainer2:{
		paddingLeft:5,
		width:'30%',
	},

	IndivTabContainer : {
		flexDirection : 'row',
		width:'100%'
	},
	
	IndivTabSpTextStyle : {
		width:'30%',
		paddingLeft : 5,
		marginTop : 32,
		fontFamily: 'roboto-regular',
	},
	
	IndivTabLaTextStyle : {
		width:'30%',
		paddingLeft : 5,
		marginTop : 32,
		fontFamily: 'roboto-regular',
	},
	
	drpDownLabel : {
		width:'30%',
		paddingLeft : 5,
		marginTop : 10,
		fontFamily: 'roboto-regular',
	},
	
	IndivTabStTextStyle : {
		width:'30%',
		paddingLeft : 5,
		marginTop : 25,
		fontFamily: 'roboto-regular',
	},
	
	IndivTabTextInputStyle : {
		marginTop : 20,
		height: 35,
		width : '60%',
		borderRadius: 4,
		borderColor: 'gray',
		borderWidth: 1,
		fontFamily: 'roboto-regular',
		
	},
	
	IndivTabTextInputViewStyle : {
		marginTop : 20,
		width : '60%',
		borderRadius: 4,
		borderColor: 'gray',
		borderWidth: 1,
		flexDirection: 'row'
	},

	IndivTabCheckBoxViewStyle : {
		marginTop : 20,
		width : '60%',
		flexDirection: 'row'
	},
	
	IndivTabCheckBoxViewStyleqq : {
		marginTop : 10,
		width : '80%',
		flexDirection: 'row'
	},
	
	
	CalculateButtonStyle : {
		marginTop:15,
		marginLeft : '30%', 
		width : '60%',
		borderWidth: 1,
		borderColor : '#1683c0',
		backgroundColor : '#1683c0',
		paddingVertical : 10, 
		paddingHorizontal : 4
	},
	
	CalculateTextStyle : {
		color : '#ffffff',
		textAlign:'center',
		fontFamily: 'roboto-regular',
	},
	
	ResultMainContainerStyle : {
		marginLeft : 5,
		marginTop : 25
	},
	
	ContainerStyle : {
		marginTop:15,
		flexDirection: 'row'
	},
	
	TextStyle : {
		color:'#1683c0',		
		fontFamily: 'roboto-regular',
	},

	flexrow :{
		flexDirection: 'row'
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
		backgroundColor:'#1683c0',
		position:'absolute',
		bottom:0
	  }, {
		height:0
	  })
   
	},

}	