import {Dimensions,Platform} from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper'
const { width, height } = Dimensions.get('window')

export default {
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
	
	left_text: {
		marginLeft:10,
		marginRight:10,
		flex: 0.30,
		alignSelf: 'center',
		color:'#ffffff',
		backgroundColor: 'transparent',
	},

	header_title:{
		width:'70%',
		color:'#ffffff',
		fontSize:16,
		backgroundColor: 'transparent',
		alignSelf: 'center',
        textAlign: 'center',        
        fontFamily: 'roboto-regular',
		fontWeight:'bold'
	},
	footer_title:{
		flex: 0.80,
		color:'#ffffff',
		fontSize:15,
		backgroundColor: 'transparent',
		alignSelf: 'center',
		textAlign: 'center'
	},

	header_save:{
		right:15,
        top:20,
        height:25,
        width:25,
		position:'absolute',
        resizeMode:'contain'
	},
	header_view:{
        width:'100%',
        height:60, 
		flexDirection: 'row',
	},
	back_icon_parent:{
		height:'100%',
		width:'15%'
	},
	footer_icon_parent:{
		height:'100%',
		//width:'15%'
	},
	save_btn:{
		color:'#ffffff',
		fontSize:20,
		textAlign: 'right'
    },

    outerContainer:{   
      ...ifIphoneX({
        height:height-74,
      }, {
        height:'100%',
      }),     
      width:'100%',
    },
    subHeader:{
        backgroundColor:'#0c74c5',
        padding:10,
        flexDirection: 'row',
        height:140
    },

    Footer:{
        position:'absolute',
        bottom:0,
        width:'100%',
        padding:5,
        shadowColor: '#708090',
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowRadius: 5,
        shadowOpacity: 1.0,
        backgroundColor:'#fdfdfd',
        flexDirection:'row',
        ...Platform.select({
            iOS:{
                height:60,
            },
            android:{
                height:60,
                elevation: 8,
                backgroundColor:'#fdfdfd',
            }
        })        
    },

    footer_icon_container:{
        width:'33%',
        alignItems:'center',
    },

    footer_icon:{
        height:53,  
        width:80,
        resizeMode:'contain'  
    },

    lineView:{
        width:1,
        height:30,
        alignSelf:'center',
        borderRightWidth:1,
        borderColor:'#e2e2e2',
        ...Platform.select({
            iOS:{
                marginTop:5,
            },
            android:{
                marginTop:-15,
            }
        })     
    },
    
    header_bg:{
      height:64,
      width: '100%',
        
    },

    subheaderbox:{
        height:'100%',
        width:'49%',
        backgroundColor:'#fdfdfd',
        padding:10,
        justifyContent:'center'
    },
    segmentContainer:{
       height:110,
       width:'100%',
       backgroundColor: '#fdfdfd',
       elevation: 8,
       shadowColor: '#708090',
       shadowOffset: {
         width: 0,
         height: 2
       },
       shadowRadius: 6,
       shadowOpacity: 1.0
    },
    segmentView:
    {
      height:60,
      width:'100%',
      flexDirection: 'row',
      backgroundColor: 'transparent'
    },
    segmentButtonBackgroundView:
    {
      height: (Platform.OS === 'ios') ? 39 : 60,
      width:'16.5%',
      flexDirection: 'column',
      backgroundColor: 'transparent'
    },
    segmentButton:
    {
      height:59,
      justifyContent: 'center'
    },
    style_btnText:{
      backgroundColor: 'transparent',
      fontSize: 14,
      color: '#7f7f7f',
      textAlign: 'center',
      fontFamily: 'roboto-regular'
    },
    style_btnTextSelect:{
      backgroundColor: 'transparent',
      fontSize: 14,
      color: '#404040',
      textAlign: 'center',
      fontFamily: 'roboto-regular',
      fontWeight:'bold'
    },
    horizonatlLineForSegment:
    {
      height:1,
      width:'20%'-10,
      marginLeft :5,
      backgroundColor: '#e0e0e0',
      ...Platform.select({
          iOS:{
          },
          android:{
            marginTop:-2
          }
      }) 
    },
    horizonatlLineForSegmentSelect:
    {
      height:2,
      width:'20%'-10,
      marginLeft :5,
      backgroundColor: '#1683c0',
      ...Platform.select({
          iOS:{
          },
          android:{
            marginTop:-2
          }
      }) 
    },
    verticalLineForSegment:
    {
      height:30,
      width:1,
      marginTop :15,
      backgroundColor: '#e0e0e0',
    },
    view_container:{
        flexDirection:'row',
        width:'100%',
        marginTop: (Platform.OS === 'ios') ? 5:0,
    },
    image_container:{
        justifyContent: 'center',
        width: '10%',
    },    
    user_icon:{
      height:12,
      width: 12,
      alignSelf:'center',
      resizeMode:'contain'
    },
    boxes_textbox_container:{
        width: '84%',
        marginLeft:'5%',
        overflow: 'visible'
    },
    text_input:{
        width:'100%',
        //height:'27%',
        fontSize:11,
        fontFamily:'roboto-regular',
        paddingBottom:5,
        paddingTop:0,
        ...Platform.select({
            iOS:{
            },
            android:{
              
            minHeight:20
            }
        }) 
    },
    text_inputbig:{
        width:'100%',
        //height:'27%',
        fontSize:14,
        fontFamily:'roboto-regular',
        paddingTop:0,
        paddingBottom:5,
        ...Platform.select({
            iOS:{
            },
            android:{              
            minHeight:25
            }
        }) 
    },
    
    add_icon:{
      height:12,
      width: 12,
      alignSelf:'center',
      resizeMode:'contain'
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
    sales_pr_Container:{
        height:'100%',
        width:'100%',
        justifyContent:'center',
        alignItems:'center'
    },
    sales_pr_label:{
    color:'#404040',
    fontSize:14,
    alignSelf: 'flex-start',
    fontWeight : 'bold',
    fontFamily:'roboto-regular',
    paddingBottom:5,
    },
    salesPriceValue:{
        width:'80%',
        alignSelf : 'flex-start',
        marginTop:5,
    },
    sales_pr:{
      color:'#1683c0',
      fontSize:18,
      paddingTop:0,
      width:'90%'
    
    },
    dollaricon:{
        flexDirection:'row',
    },
    dollar:{
      color:'#1683c0',
      fontSize:18,
      width:'10%',
      marginBottom : Platform.OS == 'ios' ? 1 : 13,
      
    },
    scrollviewhead:{
        flexDirection:'row',
        height:50,
        width:'100%',
        padding:10,
        justifyContent:'center',
        alignItems:'center'
    },
    textViewContainer:
    {
      height:50,
      width:'100%',
      flexDirection: 'row',
      justifyContent:'center',
      alignItems:'center'
    },
    schollheadtext:{
        fontFamily:'roboto-regular',
        fontSize:16,
        fontWeight:'bold',
        color:'#404040'
    },
    scrollable_container_child:{
        flexDirection: 'row',
        width:'100%',
    },


    scrollable_container_child_google_auto : {
        flexDirection: 'row',
        width:'100%',
        position : 'absolute',
        top : 20,
        zIndex : 9999,
    },

    title_justify:{
        justifyContent: 'center',
        width:'70%'
    },
    text_style:{
        color:"#404040",
        fontFamily:'roboto-regular',
        fontSize:16
    },
    width100:{
        color:"#404040",
        fontFamily:'roboto-regular',
        fontSize:16,
        width:'85%',
        paddingTop:0,
        paddingBottom:5,
		marginTop: (Platform === 'ios') ? 0 : -5
        
    },
    width100ReIssueYr:{
        color:"#404040",
        fontFamily:'roboto-regular',
        fontSize:16,
        width:'85%',
        marginLeft : 3
        
    },
    alignrightinput:{
        width: '100%', 
        justifyContent: 'center',
        flexDirection: 'row', 
        alignSelf: 'flex-end'
    },
	
    loanstext:{
        marginTop:10,
        color:"#404040",
        fontFamily:'roboto-regular',
        fontSize:16,
        fontWeight:'bold'
    },
    loanstopaybox:{
        width:'100%',
        justifyContent:'center'
    },
    headerloanratio:{
        alignSelf:'flex-end',
        flexDirection:'row',
        width:'60%',
        alignItems:'center',
        justifyContent:'center',
        marginTop:10,
        marginRight : 30
    },
    headerloanratiotext:{
        color:"#868686",
        fontFamily:'roboto-regular',
        fontSize:16,
        fontWeight:'bold',
        width:'50%',
        textAlign:'center',
        padding:5,
        alignItems:'center',
    },
    underlinemargin:{
        ...Platform.select({
            iOS:{
                marginTop:5
            },
            android:{
            }
        }) 
    },
    existingfirst:{
        flexDirection:'row',
        width:'30%',
    },
    loandetailhead:{
        flexDirection:'row', 
        width:'100%', 
        marginTop:10
    },
    sellerscrollview:{
        width:'100%', 
        padding:10, 
        ...Platform.select({
            iOS:{
            },
            android:{
                backgroundColor:'#FFFFFF'
            }
        }) 
    },
    existingfirstbalance:{
        width:'35%',
    },
    width70:{
        color:"#404040",
        fontFamily:'roboto-regular',
        fontSize:16,
        width:'70%',
        marginLeft:'5%',
        paddingTop:0,
        paddingBottom:5,
		marginTop: (Platform === 'ios') ? 0 : -5

    },
    textboxunderline:{
        width:'85%', 
        marginLeft:'7.5%',
    },
    alignCenter:{
        color:"#404040",
        fontFamily:'roboto-regular',
        fontSize:16,
		marginBottom : 11,
    },
    existingtext:{
        marginLeft:'5%',
        color:"#404040",
        fontFamily:'roboto-regular',
        fontSize:16,
		marginBottom : 11,
    },
    existingheadtext:{
        marginLeft:'5%',
        color:"#404040",
        fontFamily:'roboto-regular',
        fontSize:16,
    },
    scrollviewheightlandscape:{
        height: (Platform.OS === 'ios') ? (width-380) : (width-360)
    },
    scrollviewheight:{
        ...ifIphoneX({
          height: height-454
        }, {
          height: (Platform.OS === 'ios') ? (height-350) : (height-360)
        })
    },
    smallsegmentContainer:{
        height:50,
        width:'100%',
        backgroundColor: '#fdfdfd',
        elevation: 8,
        shadowColor: '#708090',
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowRadius: 6,
        shadowOpacity: 1.0
     },
     bigscrollviewheightlandscape:{
          height: (Platform.OS === 'ios') ? (width-170) : (width-230)
      },
    bigscrollviewheight:{
        ...ifIphoneX({
          height: height-244
        }, {
          height: (Platform.OS === 'ios') ? (height-170) : (height-200)
        })
     },
    smalltitle_justify:{
         justifyContent: 'center',
         width:'45%'
    },
    smallesttitle_justify:{
         justifyContent: 'center',
         width:'25%'
    },

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
        fontSize:16, 
        fontWeight: 'bold',
    },

    landscapefieldcontainer:{
        flexDirection: 'row',
        marginTop:10,
        justifyContent:'center'
    },

    landscapefieldlabel:{
        width:'50%',        
        color:"#404040",
        fontFamily:'roboto-regular',
        fontSize:16, 
    },

    landscapefieldval:{    
        color:"#404040",
        fontFamily:'roboto-regular',
        fontSize:16, 
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
        fontSize:16, 
        fontWeight:'bold'
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
        fontSize:16, 
        textAlign:'right'
    },

    landscapetextheaddata:{
        color:"#404040",
        fontFamily:'roboto-regular',
        fontSize:16, 
    },

    landscapetexthead:{
        color:"#404040",
        fontFamily:'roboto-regular',
        fontSize:16, 
        fontWeight:'bold'
    },

    landscapetriplefieldlabelsmall:{
        width:'25%',
        justifyContent:'center'
    },

    landscapetriplefieldlabel:{
        width:'30%',
    },

    landscapenormalfulltext:{
        color:"#404040",
        fontFamily:'roboto-regular',
        fontSize:16, 
    },

    landscapebalancerate:{
        width:'30%',        
        color:"#7f7f7f",
        fontFamily:'roboto-regular',
        fontSize:16, 
        textAlign:'center'

    },

    smallmargin:{
        marginLeft:3
    },

    landscapetriplefieldvalsmall:{
        width:'15%',        
        padding:5,
        borderWidth: 1,
        borderRadius: 5,   
        color:"#404040",
        fontFamily:'roboto-regular',
        fontSize:16, 
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
        fontSize:16, 
        borderColor:'#e7e7e7',
        height: 25
    },

    landscapedropdowncontainer:{
        flexDirection:'row',
        width:'20%'
    },

    landscapedropdownnexttext:{
        width:'20%',        
        color:"#404040",
        fontFamily:'roboto-regular',
        fontSize:16, 
        textAlign:'right',
        padding:3

    },

    landscapedropdowntext:{
        width:'80%',        
        color:"#404040",
        fontFamily:'roboto-regular',
        fontSize:16, 

    },

    landscapetriplefieldlablesmall:{
        width:'30%',
        color:"#404040",
        fontFamily:'roboto-regular',
        fontSize:16, 
    },

    landscape40percenttext:{
        width:'40%',        
        color:"#404040",
        fontFamily:'roboto-regular',
        fontSize:16, 
    },

    landscape50percenttext:{
        width:'50%',        
        color:"#404040",
        fontFamily:'roboto-regular',
        fontSize:16, 
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
	
subHeaderNewDesign:{
    backgroundColor:'#848484',
},

subHeaderNewDesignSubPart:{
	backgroundColor:'#848484',
},

segmentViewNewDesign:
{
	height:40,
	width:'100%',
	flexDirection: 'row',
	backgroundColor: 'transparent',
	borderWidth: 0.5,
	borderColor: '#8e8e8e',
	marginTop: 5,
},

segmentButtonNewDesign:
{
	height:39,
	justifyContent: 'center'
},

verticalLineForSegmentNewDesign:
{
  height:40,
  width:1,
  backgroundColor: '#8e8e8e',
},

style_btnTextNewDesign:{
  backgroundColor: 'transparent',
  fontSize: 16,
  color: '#cbcbcb',
  textAlign: 'center',
  fontFamily: 'roboto-regular'
},

style_btnTextSelectNewDesign:{
  backgroundColor: 'transparent',
  fontSize: 16,
  color: '#404040',
  textAlign: 'center',
  fontFamily: 'roboto-regular',
  fontWeight:'bold'
},

segmentContainerNewDesign:{
   height:60,
   width:'100%',
   backgroundColor: '#000000'
},
headerTextInputField:{
   height: 30,
   borderWidth: 1,
   borderRadius: 4,
   backgroundColor: '#F5FCFF',
   padding: -5,
   paddingLeft:3,
   borderColor: 'transparent'
},

}