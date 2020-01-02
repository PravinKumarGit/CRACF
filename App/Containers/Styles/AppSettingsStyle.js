import {Dimensions, Platform} from 'react-native';
const { width, height } = Dimensions.get('window')

export default{
    
    TopContainer:{
        flex:1
    },

	header_bg:{
		height:60,
		width: '100%'
    },
    
	back_icon: {
		top:20,
		left:13,
        height:25,
        width:15,
		position:'absolute',
        resizeMode:'contain'
    },
    
    outerContainer:{        
        height:'100%',
        width:'100%',
    },

	header_view:{
		flex:1, 
        flexDirection: 'row',
        paddingRight: 10
    },
    
	back_icon_parent:{
		height:'100%',
		width:'25%',
        justifyContent:'center',
	},

	header_save:{
	},

	header_title:{
		width:'40%',
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
        top:20,
        padding:5,
        position:'absolute',
        alignSelf: 'flex-end',
    },

    restoreviewtext:{
        color:'#FFFFFF',
        fontSize:12,
        alignSelf: 'center',
        fontFamily:'roboto-regular',  
    },

    settingsSubheading:{
        height:40,
        width:'100%',
        shadowColor: '#708090',
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowRadius: 5,
        shadowOpacity: 0.4,
        backgroundColor:'#fdfdfd',
        elevation:5,
        flexDirection:'row'
    },

    subheadingBigbox:{
        width:'100%',
        height:'100%',
        shadowOffset: {
          width: 2,
          height: 0
        },
        shadowRadius: 4,
        shadowOpacity: 0.2,
        backgroundColor:'#fdfdfd',
        elevation:8,
        paddingLeft:15,
        paddingRight:15,
        paddingTop:13,
        paddingBottom:13,
        justifyContent:'center',
        borderRightWidth: (Platform.OS === 'ios') ? 0 : 1,
        borderColor: (Platform.OS === 'ios') ? '#fdfdfd' : '#dddddd'  
    },

    dropdownicon:{
        height:9,
        width:9,
        position:'absolute',
        resizeMode:'contain',
        right:0,
        top:1
    },

    dropdownval:{
        color:'#404040',
        fontSize:14,
        fontFamily:'roboto-regular',  

    },

    subheadingSmallbox:{
        width:'30%',
        paddingRight:15,
        paddingTop:10,
        paddingBottom:10,
        justifyContent:'center',
    },

    editbtn:{
        alignSelf:'flex-end',
        height:26,
        backgroundColor:'#1683c0',
        paddingLeft:10,
        paddingRight:10,
        justifyContent:'center'
    },

    editbox:{
        height:'100%',
        width:'100%',
        justifyContent:'center'
    },

    edittext:{
        color:'#fdfdfd',
        fontSize:12,
        fontFamily:'roboto-regular',  
    },

    scrollviewheight:{
        flex:1
       // height: '100%'-100,
    },

    settingsscrollview:{

        width:'100%', 
        padding:10, 
        ...Platform.select({
            android:{
                backgroundColor:'#fdfdfd',
            },
            ios:{

            }
        }),
        
        padding:15
    },

    selectedvalbox:{
        width:'100%',
        justifyContent:'center',
        alignItems:'center',
        marginTop:10,
        marginBottom:10

    },

    selectedvalboxtext:{
        color:'#1683c0',
        fontSize:14,
        fontFamily:'roboto-regular', 

    },

    fullunderline:{
        borderWidth:0.7,
        width:'100%',
        borderColor:'#dddddd'
    },

    detailbox:{
        marginTop:10,
        width:'100%',
        justifyContent:'center',
        flexDirection:'row'
    },

    togglekey:{
        width:'40%',
        justifyContent:'center',
        color:'#404040',
        fontSize:14,
        fontFamily:'roboto-regular',  
        paddingTop: (Platform === 'ios') ? 0:5

    },
    
    togglevalbox:{
        width:'25%',
        justifyContent:'center',
        alignItems:'center',
        padding:5,
        borderWidth:0.5,
        borderColor:'#ececec',
        backgroundColor:'#ececec',
        marginLeft:'2.5%',
        borderRadius:10

    },

    toggleval:{
        justifyContent:'center',
        color:'#404040',
        fontSize:13,
        fontFamily:'roboto-regular',  
    },
    
    togglevalboxsel:{
        width:'25%',
        justifyContent:'center',
        alignItems:'center',
        padding:5,
        borderWidth:0.5,
        borderColor:'#ececec',
        backgroundColor:'#1683c0',
        marginLeft:'2.5%',
        borderRadius:10

    },

    TableHead:{
        width:'100%',
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
    },

    HeadText:{
        justifyContent:'center',
        color:'#708090',
        fontSize:13,
        fontFamily:'roboto-regular',  
        textAlign:'center'
    },

    BodyText:{
        justifyContent:'center',
        color:'#404040',
        fontSize:13,
        fontFamily:'roboto-regular', 
        width:'90%',
        marginLeft:'5%',
        textAlign:'center',
        paddingTop:0,
        paddingBottom:1
    },

    HeadBoxUnderline:{
        width:'29%',
        justifyContent:'center',
        alignItems:'center',
        marginLeft:'3%',
    },


    HeadBox:{
        width:'33%',
        justifyContent:'center',
        alignItems:'center',
    },

    togglevalsel:{
        justifyContent:'center',
        color:'#ffffff',
        fontSize:13,
        fontFamily:'roboto-regular',  
    },

    detailboxkey:{
        width:'70%',
        justifyContent:'center',
        color:'#404040',
        fontSize:13,
        fontFamily:'roboto-regular',  
        paddingTop: (Platform === 'ios') ? 0:5

    },

    width30:{
        ...Platform.select({
            android:{
                marginTop:0,
            },
            ios:{
                marginTop:5,
            }
        }),
        width:'25%',
        paddingTop:0,
        paddingBottom:5,
        marginLeft:'2.5%',
        color:'#404040',
        fontSize:12,
        fontFamily:'roboto-regular', 
    },

    textinputunderline:{
        width:'27.5%',
        marginLeft:'72.5%',
        backgroundColor:'#000'
    },

    width90:{
        width:'95%',
        paddingTop:0,
        ...Platform.select({
            ios:{
                paddingBottom:10
            },
            android:{
                paddingBottom:0
            }
        }),
        color:'#404040',
        fontSize:12,
        fontFamily:'roboto-regular', 
    },

    detailbox:{
        flexDirection:'row',
        ...Platform.select({
            ios:{
                marginTop:5
            },
            android:{
                marginTop:5
            }
        }),
    },

    submitbox:{
        padding:15,
        borderWidth:1,
        borderRadius:5,
        borderColor:'#ececec',
        marginTop:10,
        justifyContent:'center',
        alignItems:'center'
    },

    iconright:{
        width:'4%',
        textAlign:'center',
        fontSize:14,
        fontFamily:'roboto-regular',
        marginLeft:'1%',
        color:'#404040'
    },
	
	valueSign:{
        width:'4%',
        fontSize:14,
        fontFamily:'roboto-regular',
        marginBottom:2,
        color:'#404040'
    },

    donebox:{
        marginTop:15,
        width:'25%',
        backgroundColor:'#1683c0',
        padding:6,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:4
    },

    applytext:{
        fontSize:12,
        fontFamily:'roboto-regular',
        marginLeft:'1%',
        color:'#fdfdfd',
    },

    detailboxkeylarge:{
        width:'90%',
        justifyContent:'center',
        color:'#404040',
        fontSize:13,
        fontFamily:'roboto-regular',  
        paddingTop: (Platform === 'ios') ? 0:5
    },

    checkboxbtn:{
        marginTop:10,
        alignSelf:'center'
    },
	headerbtnText:{
		color:'#1683c0',
		fontSize:14,
		backgroundColor: 'transparent',    
		fontFamily: 'roboto-regular',
		fontWeight:'bold',
        padding:10,
        marginRight : 5,
	},
}