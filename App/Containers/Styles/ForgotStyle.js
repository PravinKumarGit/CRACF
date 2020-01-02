import {Dimensions, Platform} from 'react-native'
import { ifIphoneX } from 'react-native-iphone-x-helper'
const { width, height } = Dimensions.get('window')

export default {
  textInputBackgroundViewContainer: {
   justifyContent: 'center',
   marginTop:20,
   flexDirection: 'row',
   alignSelf: 'center',
   alignItems: 'center',
   height: 50,
   width:'100%'-20,
   backgroundColor: 'transparent'
  },
  lineView:{
    justifyContent: 'center',
    height: 0.5,
    width:'100%',
    backgroundColor: '#949494',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0c74c5',
    marginTop: 20,
    height: 50,
    width: '100%'
  },
  style_btnLogin:{
    justifyContent: 'center',
    backgroundColor: 'transparent',
    fontSize: 20,
    color: 'white',
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

  }
 }
