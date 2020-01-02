import {Dimensions, Platform} from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper'
const { width, height } = Dimensions.get('window')

export default {

  MainContainer:{
      flex:1
  },

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

  savebtn:{
      width:'20%',
      backgroundColor: 'transparent',
      alignSelf: 'center',
  },

  save_btnText:{

      color:'#ffffff',
      fontSize:16,
      textAlign: 'center',        
      fontFamily: 'roboto-regular',
      fontWeight:'bold'
  },

 lineView:{
    height: 0.5,
    width:'100%',
    backgroundColor: '#949494',
  },

  view_parent:{
    width: '100%',
	  flexDirection: 'row'
  },
  view_title:{
    width: '38%',
	justifyContent: 'center',
	marginLeft:10
  },
  view_textInput:{
    width: '58%', 
	alignSelf: 'flex-end',
  alignItems: 'flex-end',
  justifyContent:'center',
  height:60,
  },
  textInput:{
	width: '100%',
  textAlign: 'right',
  ...Platform.select({
    android:{
      paddingTop:0,
      paddingBottom:0,
      height:'100%'
    }
  })
  },
  changePasswordParent: {
    justifyContent: 'center',
	height: 60,
	backgroundColor: '#f1f1f1'
  },
  btn_view: {
    backgroundColor: '#fff',
	justifyContent: 'center',
	height: 40
  },
  btn_margin: {
	textAlign: 'center'
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
  fullunderline:{
    height:1,
    width :'100%',
    backgroundColor: '#e0e0e0',
    ...Platform.select({
        iOS:{
        },
        android:{
          marginTop:-5
        }
    }) 
  },
}
