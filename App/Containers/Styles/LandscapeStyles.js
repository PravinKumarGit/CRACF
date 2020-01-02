import {Dimensions,Platform} from 'react-native';
const { width, height } = Dimensions.get('window')

export default {
    landscapetopcontainer:{
        flex:1
    },

    landscapeHeader:{
        height:50,
        width:'100%',
        flexDirection:'row'
    },

    landscapeHeaderBackground:{
        position:'absolute',
        resizeMode:'stretch',
        width:'100%',
        height:50,
    },

    landscapeBack_icon:{
        height:25,
        resizeMode:'contain',
        position:'absolute',
        top:13,
        marginLeft: (Platform.OS === 'ios') ? 15 : 0,
    },

    landscapesubheading:{
        position:'absolute',
        width:'80%',
        height:26,
        marginTop:12,
        alignSelf:'center',
        borderWidth: 1,
        borderColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center'
    },

    landscapesubheadingtext:{
        color:"#ffffff",
        fontFamily:'roboto-regular',
        fontSize:16,        
    },

    blueheadlandscape:{
        backgroundColor: '#273b64'
    },

    landscapeCalculatorContent:{
        flex:1,
        padding:10
    },

    landscapescrollview:{
        flex:1,
        borderColor:'#c8dce1',
        borderWidth:3,
        borderRadius: 5
    },

    landscapescroll:{
        padding:10
    },

    landscapetitleText:{
        color:"#1683c0",
        fontFamily:'roboto-regular',
        fontSize:20, 
        fontWeight: 'bold'
    },

    landscapedataContent:{
        flexDirection:'row',
        width:'100%'
    },

    landscapecontentBoxes:{
        width:'32%',
        marginLeft:'1%',
    },

    landscapedataBox:{
        width:'100%',
        borderColor:'#c8dce1',
        borderWidth:1.5,
        borderRadius: 5,
        padding:10,
        marginTop:-12
    },

    landscapedataBoxHeading:{
        height:24,
        padding:5,
        backgroundColor:'#c8dce1',
        marginTop:10,
        marginLeft:15,
        marginRight:15,
        justifyContent:'center',
    },

    landscapedataboxheadingtext:{
        color:"#404040",
        fontFamily:'roboto-regular',
        fontSize:12, 
        fontWeight: 'bold',
    },

    landscapefieldcontainer:{
        flexDirection: 'row',
        marginTop:10,
    },

    landscapefieldlabel:{
        width:'50%',        
        color:"#404040",
        fontFamily:'roboto-regular',
        fontSize:12, 
    },

    landscapefieldval:{    
        color:"#404040",
        fontFamily:'roboto-regular',
        fontSize:12, 
        paddingTop:0,
        paddingBottom:0,
        textAlign:'center'
    },

    landscapefieldvaluebox:{
        width:'50%',        
        padding:5,
        borderWidth: 1,
        borderRadius: 5,
        borderColor:'#e7e7e7',
        height: 25
    },

    landscapehalfsizefield:{
        flexDirection: 'row',
        width:'100%'
    },

    landscapefieldhalfcontainer:{
        width:'50%',
        flexDirection: 'row',
        marginTop:15,
    },

    landscapefieldlabelbold:{
        width:'50%',        
        color:"#404040",
        fontFamily:'roboto-regular',
        fontSize:14, 
        fontWeight:'bold'
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

    landscapefielddateval:{  
        width:'100%',
        marginTop:-15
    },

    landscapefieldvaluesmallbox:{
        width:'30%',        
        padding:5,
        borderWidth: 1,
        borderRadius: 5,
        borderColor:'#e7e7e7',
        height: 25,
        
    },

    landscape20percenttext:{
        width:'20%',        
        color:"#404040",
        fontFamily:'roboto-regular',
        fontSize:14, 
        textAlign:'right'
    },

    landscapetexthead:{
        color:"#404040",
        fontFamily:'roboto-regular',
        fontSize:12, 
        fontWeight:'bold'
    },

    landscapetriplefieldlabel:{
        width:'30%',
    },

    landscapetriplefieldlabelsmall:{
        width:'25%',
        justifyContent:'center'
    },

    landscapenormalfulltext:{
        color:"#404040",
        fontFamily:'roboto-regular',
        fontSize:12, 
    },

    landscapebalancerate:{
        width:'30%',        
        color:"#7f7f7f",
        fontFamily:'roboto-regular',
        fontSize:12, 
        textAlign:'center'

    },

    landscapetriplefieldvalsmall:{
        width:'15%',        
        padding:5,
        borderWidth: 1,
        borderRadius: 5,   
        color:"#404040",
        fontFamily:'roboto-regular',
        fontSize:12, 
        borderColor:'#e7e7e7',
        height: 25
    },

    landscapetriplefieldval:{
        width:'30%',        
        padding:5,
        borderWidth: 1,
        borderRadius: 5,   
        color:"#404040",
        fontFamily:'roboto-regular',
        fontSize:12, 
        borderColor:'#e7e7e7',
        height: 25
    },

    landscapetriplefieldvaltext:{
        width:'30%',        
        padding:5,
        paddingBottom:15, 
        color:"#404040",
        fontFamily:'roboto-regular',
        fontSize:12, 
        textAlign:'center'
    },

    landscapedropdowncontainer:{
        flexDirection:'row',
        width:'20%'
    },

    landscapedropdownnexttext:{
        width:'20%',        
        color:"#404040",
        fontFamily:'roboto-regular',
        fontSize:12, 
        textAlign:'right',
        padding:3

    },

    landscapedropdowntext:{
        width:'80%',        
        color:"#404040",
        fontFamily:'roboto-regular',
        fontSize:12, 

    },

    landscapetriplefieldlablesmall:{
        width:'30%',
        color:"#404040",
        fontFamily:'roboto-regular',
        fontSize:12, 
    },

    landscape40percenttext:{
        width:'40%',        
        color:"#404040",
        fontFamily:'roboto-regular',
        fontSize:12, 
    },

    landscapetextheaddata:{
        color:"#404040",
        fontFamily:'roboto-regular',
        fontSize:12, 
    },

    landscape50percenttext:{
        width:'50%',        
        color:"#404040",
        fontFamily:'roboto-regular',
        fontSize:12, 
    },

}