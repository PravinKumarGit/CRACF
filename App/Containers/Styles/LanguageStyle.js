import {Dimensions, Platform} from 'react-native';
const { width, height } = Dimensions.get('window')

export default{
    MainContainer:{
        height:height,
        width:width
    },

    HeaderContainer:{
        height: 60,
        width: width,
        flexDirection: 'row',
    },

    HeaderBackground:{
        position:'absolute',
        resizeMode:'stretch',
        width:width,
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
        height:height-60,
        padding:20,

    },

    headingtext:{
        color:'#404040',
        fontSize:16,
        fontFamily:'roboto-regular', 
        fontWeight:'bold' 
    },

    dropdownto:{
        marginTop:20,
        padding:5, 
    },

    dropdownfieldview:{
        flexDirection:'row',
        width:'100%'
    },

    dropdownfieldviewtext:{
        width:'90%',
        color:'#404040',
        fontSize:16,
        fontFamily:'roboto-regular', 
    },

    dropdownicon:{
        height:12,
        width:12,
        resizeMode:'contain',
        position:'absolute',
        right:0,
        top:6
    },

    underline:{
        borderWidth:0.5,
        borderColor:'#7f7f7f',
        width:'100%',
        alignSelf:'center',
        marginTop:5
    },

}