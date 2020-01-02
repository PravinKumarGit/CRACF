import {Dimensions, Platform} from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper'
const { width, height } = Dimensions.get('window')

export default{
    MainContainer:{
        flex:1,
        height:'100%'
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

    listcontainer:{
        height:'100%'-70,
        width:'100%'
    },

    listItemContainer:{
        flexDirection:'row',
        width:'100%'
    },

    listText:{
        fontWeight:'bold',
        color:'#404040',
        fontSize:14,
        fontFamily:'roboto-regular',  
    },

    listTextSmall:{
        color:'#404040',
        fontSize:12,
        fontFamily:'roboto-regular',  
    },

    Fieldscontainer:{
        padding:20,
        width:'100%',
    },

    FieldscontainerBorder:{
        padding:20,
        width:'100%',
        borderWidth:1,
        borderColor:'#ececec',
        borderRadius:5
    },

    underlinebold:{
        borderWidth:0.5,
        borderColor:'#666666',
        width:'100%',
        alignSelf:'center',
        marginTop:5
    },

    width100inpercentage:{
        color:'#404040',
        fontSize:12,
        fontFamily:'roboto-regular',  
        paddingBottom:0
    },
	
	backgroundViewContainer: {
	   marginTop:5,
	   flexDirection: 'row',
	   width:'100%'-20,
	   backgroundColor: 'transparent',justifyContent: 'center',
	   alignSelf: 'center',
	   height: 35,
	   alignItems: 'center',
	},
	
	backgroundViewContainerSearch: {
	   flexDirection: 'row',
	   width:'100%'-20,
	   backgroundColor: 'transparent',justifyContent: 'center',
	   alignSelf: 'center',
	   height: 35,
	   alignItems: 'center',
	},
	
	textInput: {
	   color: 'black',
	   fontSize: 14,
	   height: 50,
	   backgroundColor: 'transparent',
	   marginTop: 0,
	   padding: 5,
	   flex: 4.0
	},
	
	textInputSearch: {
	   color: 'black',
	   fontSize: 14,
	   height: 35,
	   backgroundColor: 'transparent',
	   marginTop: 0,
	   padding: 10,
	   flex: 4.0
	},

    text_style:{
        color:'#7f7f7f',
        fontSize:14,
        fontFamily:'roboto-regular',
        fontWeight:'bold',
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
	
	headerbtnText:{
		color:'#ffffff',
		fontSize:16,
		backgroundColor: 'transparent',    
		fontFamily: 'roboto-regular',
		fontWeight:'bold',
		padding:10
	},


}