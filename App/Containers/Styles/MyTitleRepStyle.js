import {Dimensions, Platform} from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper'
const { width, height } = Dimensions.get('window')

export default{
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

    restoreview:{
        justifyContent:'center',
        borderWidth:1,
        borderColor:'#FFFFFF',
        height:25,
        padding:5,
        top:18,
        alignSelf:'flex-end',
        marginRight:15
    },

    restoreviewtext:{
        color:'#FFFFFF',
        fontSize:12,
        alignSelf: 'center',
        fontFamily:'roboto-regular',  
    },

    BodyContainer:{
        width:'100%',
        height:'100%'-60,
        padding:20,

    },

    headingtext:{
        color:'#7f7f7f',
        fontSize:16,
        fontFamily:'roboto-regular', 
        marginTop:15,
        marginLeft:5,
        fontWeight:'bold'
    },

    underline:{
        borderWidth:0.5,
        borderColor:'#ececec',
        width:'100%',
        alignSelf:'center',
        marginTop:5
    },

    IconContainer:{
        flexDirection:'row',
        marginTop:20,
        marginBottom:20,
        justifyContent:'center'
    },

    iconssmall:{
        resizeMode:'contain',
        height:30,  
        width:30,
        alignSelf:'center'      
    },

    imagetext:{
        marginTop:10,        
        color:'#404040',
        fontSize:14,
        fontFamily:'roboto-regular', 
        textAlign:'center'
    },

    iconslarge:{
        resizeMode:'contain',
        width:'100%',  
        //width:75,
        alignSelf:'center'      
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
   
    }

}