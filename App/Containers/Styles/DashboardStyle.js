import {Dimensions, Platform} from 'react-native'
import { ifIphoneX } from 'react-native-iphone-x-helper'
const { width, height } = Dimensions.get('window')

export default {

  logoutButtonStyle:{
    marginTop:40,
    width:100,
    height: 40,
    backgroundColor: '#0c74c5',
    alignSelf: 'center',
    alignItems: 'center'
  },
  mainBoxStyle : {
	  paddingTop : 10,
	  flex:1,
	  marginTop : 10,
	  marginLeft : 5,
	  marginRight : 5,
	  borderWidth: 1,
	  borderColor : '#e6e6e6',
	  minHeight:140, 

  },
   mainBoxStyleEmpty : {
	  paddingTop : 10,
	  flex:1,
	  marginTop : 10,
	  marginLeft : 5,
	  marginRight : 5,
	  borderWidth: 0,
	  borderColor : '#e6e6e6',
	  minHeight:140, 

  },
  
	mainBoxStyleFooter : {
		paddingTop : 10,
		flex:1,
		marginTop : 0,
		marginLeft : 5,
		marginRight : 5,
		borderColor : '#e6e6e6',
		minHeight:10, 
	},
  
  mainBoxStyleOnpress : {
	  paddingTop : 10,
	  flex:1,
	  marginTop : 10,
	  marginLeft : 5,
	  marginRight : 5,
	  borderWidth: 1,
	  borderColor : '#e6e6e6',
	  backgroundColor : '#1683c0',
	  minHeight:130, 
  },
  touchableStyle : {
	  alignItems : 'center'
  },
  imageStyle : {
	  marginBottom : 20
  },
  textStyle : {
	  width : 80, 
	  textAlign: 'center'
  },
  PopupParent:{
    flex : 1, 
    backgroundColor:'#00000080', 
    justifyContent:'center', 
    alignItems:'center'
  },
  BounceView:{  
    width: '80%',  
    backgroundColor:'transparent', 
    alignItems:'center' 
  },
  PopupContainer:{
    padding:10, 
    backgroundColor:'#fff', 
    alignItems:'center', 
    minHeight:200, 
    width:'100%', 
    borderRadius:10
  },
  BottomButtonContainer:{
    position:'absolute', 
    bottom:0, 
    alignSelf:'flex-end',
    flexDirection:'row', 
    padding:20
  },
  Heading1:{
    color:'#404040',
    fontSize:24,      
    fontFamily: 'roboto-regular',
    fontWeight:'bold',
    textAlign:'center'
  },
  Heading2:{
    color:'#404040',
    fontSize:18,      
    fontFamily: 'roboto-regular',
    marginTop:10,
    marginBottom:80,
    textAlign:'center'
  },
  ButtonBorder1:{
    padding:10,
    backgroundColor:'#ececec',
    marginRight:10,
    width:70
  },
  ButtonBorder2:{
    padding:10,
    backgroundColor:'#ececec',
    alignSelf:'flex-end',
    width:70
  },
  buttonText1:{
    color:'#404040',
    fontSize:14,      
    fontFamily: 'roboto-regular',
    fontWeight:'bold',
    textAlign:'center'
  },
  buttonText2:{
    color:'#404040',
    fontSize:14,      
    fontFamily: 'roboto-regular',
    fontWeight:'bold',
    textAlign:'center'
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
  Footer:{
    alignItems : 'center', 
    position:'absolute', 
    bottom:0, width:'100%', 
    backgroundColor:'#ffffff', 
    ...ifIphoneX({
      height: 124,
    }, {
      height: 90
    })
  },
	camera_play_pause: {
		height:25,
		resizeMode:'contain',
		position:'absolute',
		top:18,
		marginRight: (Platform.OS === 'ios') ? 15 : 0,
	},
}
