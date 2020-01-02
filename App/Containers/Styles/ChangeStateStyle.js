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
        padding:10,

    },

    FieldContainer:{
        marginTop:10,
        padding:10,
        borderWidth:1,
        borderRadius:5,
        borderColor:'#ececec',
        width:'100%',
    },

    field:{
        flexDirection:'row',
        width:'100%',
        marginTop:20
    },

    fieldText:{
        color:'#7f7f7f',
        fontSize:16,
        fontFamily:'roboto-regular', 
        fontWeight:'bold',
        width:'25%'
    },

    dropdownto:{
        width:'75%',
        alignItems:'flex-end',        
    },

    dropdownfieldview:{
        flexDirection:'row',

    },

    dropdownfieldviewtext:{
        color:'#404040',
        fontSize:16,
        fontFamily:'roboto-regular', 
        fontWeight:'bold',
        marginRight:10
    },

    dropdownicon:{
        height:10,
        width:10,
        top:7,
        resizeMode:'contain'
    },

    zipcodeinput:{
        width:'65%',
        alignSelf:'flex-end',
        borderWidth:1,
        borderColor:'#7f7f7f',
        padding:5,
        textAlign:'right',
        color:'#404040'

    },

    underline:{
        borderWidth:0.5,
        borderColor:'#7f7f7f',
        width:'100%',
        alignSelf:'center',
        marginTop:10
    },

    ZipCodetextbox:{
        width:'75%',
        marginTop:5,
        alignSelf:'flex-end'
    },

    ZipCodetext:{
        width:'65%',
        color:'#7f7f7f',
        fontSize:10,
        fontFamily:'roboto-regular', 
        alignSelf:'flex-end'
    },

    resetbtn:{
        width:'90%',
        alignItems:'center',
        marginTop:30,
        padding:10,
        backgroundColor:'#1683c0',
        alignSelf:'center',
        marginBottom:10
    },

    resetbtntext:{
        color:'#fdfdfd',
        fontSize:14,
        fontFamily:'roboto-regular',
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
        bottom: 0
      }, {
        height:0
      })
   
    },

}