import {Dimensions, Platform} from 'react-native';
const { width, height } = Dimensions.get('window')

export default {


TopContainer:{
  flex:1
},

outerContainer:{        
  height:'100%',
  width:'100%',
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

headerbtnText:{
  color:'#ffffff',
  fontSize:12,
  backgroundColor: 'transparent',    
  fontFamily: 'roboto-regular',
  fontWeight:'bold',
  padding:15
},

 header_bg:{
  height:64,
  width: width,
    
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
  flex:1, 
  flexDirection: 'row',
},
back_icon_parent:{
  height:'100%',
  width:'15%'
},
save_btn:{
  color:'#ffffff',
  fontSize:20,
  textAlign: 'right'
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
    width:'25%',
    alignItems:'center',
},

footer_iconSmall:{
    height:30,  
    width:80,
    resizeMode:'contain'  
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

subheaderbox:{
    height:'100%',
    width:'49%',
    backgroundColor:'#fdfdfd',
    padding:10,
    justifyContent:'center'
},
segmentContainer:{
   height:130,
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
  height:60,
  width:'20%',
  flexDirection: 'column',
  backgroundColor: 'transparent'
},
segmentButtonBackgroundViewRefinance:
{
  height:60,
  width:'33.33%',
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
horizonatlLineForSegmentRefinance:
{
  height:1,
  width:'33.33%'-10,
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
horizonatlLineForSegmentSelectRefinance:
{
  height:2,
  width:'33.33%'-10,
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
    marginLeft:'5%'
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
alignSelf: 'center',
fontFamily:'roboto-regular',
paddingBottom:5,
},
salesPriceValue:{
    width:'80%',
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
marginBottom : 13,
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
  height:30,
  width:'100%',
  flexDirection: 'row',
  justifyContent:'center',
  alignItems:'center'
},

textViewContainerbig:
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
    color:'#404040',
    paddingTop:0,
    paddingBottom:0,
},

scrollviewheightlandscape:{
  height: (Platform.OS === 'ios') ? (width-400) : (width-460)
},
scrollviewheight:{
  height: (Platform.OS === 'ios') ? (height-400) : (height-430)
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
  marginTop:10
},
headerloanratiotext:{
  color:"#868686",
  fontFamily:'roboto-regular',
  fontSize:12,
  fontWeight:'bold',
  width:'50%',
  textAlign:'center',
  padding:5,
  alignItems:'center',
},

fieldcontainer:{
  marginTop:10,
  width:'100%',
  justifyContent:'center',
  alignItems:'center',
  flexDirection:'row'
},

fieldcontainersmallfield:{
  width:'20%',
  justifyContent:'center',
  alignItems:'center'
},

fieldcontainerlargefield:{
  width:'40%',
  justifyContent:'center',
  alignItems:'center'
},

fieldcontainerlable:{
  color:"#404040",
  fontFamily:'roboto-regular',
  fontSize:12,

},

costcontainer:{
    width:'70%'
},

amountcontainer:{
  width:'30%'
},

costamttext:{
  color:"#7f7f7f",
  fontFamily:'roboto-regular',
  fontSize:12,
  fontWeight:'bold',
  textAlign:'center'
},

existingfirst:{
  flexDirection:'row',
  width:'40%',
},
loandetailhead:{
  flexDirection:'row', 
  width:'100%', 
  marginTop:10
},
existingheadtext:{
    marginLeft:'5%',
    color:"#404040",
    fontFamily:'roboto-regular',
    fontSize:12,
},
existingfirstbalance:{
    width:'30%',
},
width70:{
    color:"#404040",
    fontFamily:'roboto-regular',
    fontSize:12,
    width:'70%',
    marginLeft:'5%',
    paddingTop:0,
    paddingBottom:5,
marginTop: (Platform === 'ios') ? 0 : -5

},
existingtext:{
    marginLeft:'5%',
    color:"#404040",
    fontFamily:'roboto-regular',
    fontSize:12,
marginBottom : 11,
},
textboxunderline:{
    width:'85%', 
    marginLeft:'7.5%',
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
  loanstext:{
      marginTop:10,
      color:"#404040",
      fontFamily:'roboto-regular',
      fontSize:14,
      fontWeight:'bold'
  },
  alignrightinput:{
      width: '100%', 
      justifyContent: 'center',
      flexDirection: 'row', 
      alignSelf: 'flex-end'
  },


  subHeader:{
      backgroundColor:'#0c74c5',
      padding:10,
      flexDirection: 'row',
      height:140
  },
 style_unselectBtnText:{
   backgroundColor: 'transparent',
   fontSize: 19,
   color: '#666666',
   textAlign: 'center',
   fontFamily: "Roboto"
},
 outerrContainer:
  {
    height:undefined,
    width:undefined,
    backgroundColor:'#0c74c5',
    padding:10,
    flexDirection: 'row',
  },
 gen_info_Container:
  {
    height:190,
    flex:1,
    backgroundColor:'#ffffff',
    marginRight:5,
    flexDirection:'column',
  },

text:
{
textAlign:'center',
color :'#CECECE',
fontSize : 20,

},

user_info:{
  flex:1,
  marginLeft:1,
  marginRight:5,
  flexDirection: 'column',
  marginLeft:5,
},

user_info_cont:{
  marginRight:5,
  flexDirection:'row',
  justifyContent:'center',
  marginTop:5,
  height:22
},

user_info_text_input:{
  color: '#000000',

  fontSize:12,
  flex:1,

},

zip_text_input:{
  color: '#1683c0',
  fontSize:17,
  width:'100%',
  fontFamily: "Roboto"

},

place_holder_line:{
  height:1,
  marginTop :0,
  backgroundColor: '#e0e0e0',
},
  lineViewVertical:{
    height: height,
    backgroundColor: 'black',
  },

sl_place_holder_line:{
  height:1,
  marginTop :0,
  marginLeft:10,
  marginRight:10,
  backgroundColor: '#e0e0e0',
},

sale_pr_val_con: {


  marginRight:5,
  flexDirection: 'column',
  marginLeft:5,


},
dummy_view:{
height:12,
width:14
},

text_input_name:{
	width:'100%',fontFamily: "Roboto",fontSize: 17
},
smalltitle_justify:{
     justifyContent: 'center',
     width:'45%'
},


scrollable_container_child:{
  flexDirection: 'row',
  width:'100%',
},
title_justify:{
    justifyContent: 'center',
    width:'70%'
},
text_input_width:{
	width:150
},
text_input_width_payment_value:{
	width:150,
	fontSize:20,
	fontFamily: "Roboto"
},
text_input_width_investment_value:{
	width:150,
	fontSize:20,
	fontFamily: "Roboto",
	color: '#1683c0',
},
scrollable_container_child_center:{
  padding: 10,
	flexDirection: 'row'
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
     height: (Platform.OS === 'ios') ? (height-170) : (height-200)
 },

center_view_title:{
	width: '48%', 
	justifyContent: 'center'
},
center_view_text_input:{
	width: '48%', 
	alignSelf: 'flex-end',
	alignItems: 'flex-end'
},
center_view_text_input_child:{
	textAlign: 'right',
	width:100,
	color: "#404040",
},
center_view_text_input_child:{
	textAlign: 'right',
	width:100
},
loan_container:{
	alignSelf: 'center',
	marginTop: 10,
	marginBottom: 10,
	flexDirection: 'row'
},
mon_tax_text_input_width:{
	width:50,
	color: "#404040",
},
mon_tax_text_input_view:{
	width: '25%',
	justifyContent: 'center'
},
mon_tax_text_input_view_checkbox:{
	width: '50%'
},
mon_tax_text_input_view_second:{
	width: '25%',
	alignSelf: 'flex-end',
	alignItems: 'flex-end'
},
mon_tax_text_input_second:{
	textAlign: 'right',
	width:50,
	color: "#404040",
},
text_style:{
    color:"#404040",
    fontFamily:'roboto-regular',
    fontSize:12
},
text_style_in_years:{
	color:"#7f7f7f",
	fontFamily: "Roboto",
	fontSize:16,
},
text_style_monthly_payment:{
	color:"black",
	fontFamily: "Roboto",
	fontSize:16,
},
popup_heading:{
	 fontSize: 22,
   textAlign: 'center',
	color:"black"
},
dialogtitle:{
  height:50,
  alignItems:'center', 
  justifyContent:'center',
  width:'100%', 
  backgroundColor:'#1683c0', 
  borderTopLeftRadius:8,
  borderTopRightRadius:8
},
dialogtitletext:{
  color:"#fdfdfd",
  fontFamily:'roboto-regular',
  fontSize:16,
  fontWeight:'bold'
},
dialoginfotext:{
  color:"#404040",
  fontFamily:'roboto-regular',
  fontSize:14,
},
dialogbtn:{
  height:45,
  alignItems:'center',
  justifyContent:'center',
  width:'80%',
  alignSelf:'center',
  backgroundColor:'#ececec',
  marginTop:25,
  borderRadius:10
},
dialogbtntext:{
  color:"#404040",
  fontFamily:'roboto-regular',
  fontSize:14,
},
dialoginfo:{
  height:30,
  justifyContent:'center',
  width:'80%',
  alignSelf:'center',
  marginTop:25,
  paddingLeft:10
},
colsing_costs_last_input:{
	width: '30%',
	alignSelf: 'flex-end',
	alignItems: 'flex-end',
	flexDirection: 'row'
},	

three_input_style:{
	width: '35%',
	justifyContent: 'center'
},

width100:{
  color:"#404040",
  fontFamily:'roboto-regular',
  fontSize:12,
  width:'85%',
  paddingTop:0,
  paddingBottom:5,
marginTop: (Platform === 'ios') ? 0 : -5
  
},

width100date:{
  width:'85%',
  paddingTop:0,
  paddingBottom:5,
marginTop: (Platform === 'ios') ? 0 : -5
  
},
width100inpercentage:{
	width: '100%',
	fontSize:15,
	fontFamily: "Roboto",
	color: '#404040',
},

alignCenter:{
  alignSelf: 'center',
  paddingBottom:10,
  color: "#404040",
  fontSize: 12
},
alignCenterNew:{
  alignSelf: 'center',
  color: "#404040",
  fontSize: 12
},
savecalcvaluesmall:{
	width: '20%',
  justifyContent: 'center',
  alignItems:'center'
},

savecalcvalue:{
	width: '40%',
	justifyContent: 'center',
  alignItems:'center'
},
two_columns_first_view:{
	width: '64%',
	justifyContent: 'center'
},
two_columns_first_view_address:{
	width: '40%',
	justifyContent: 'center'
},

two_columns_second_view:{
	width: '36%',
	alignSelf: 'flex-end',
	alignItems: 'flex-end',
	flexDirection: 'row'
},
two_columns_second_view_big:{
	width: '60%',
	alignSelf: 'flex-end',
	alignItems: 'flex-end',
	flexDirection: 'row'
},

two_columns_second_view_listing:{
	width: '28%',
	alignSelf: 'flex-end',
	alignItems: 'flex-end',
	flexDirection: 'row'
},

four_columns_third_view:{
	width: '25%',
	justifyContent: 'center',
	flexDirection: 'row'
},

four_columns_third_view_checkbox:{
	width: '15%',
	justifyContent: 'center',
	flexDirection: 'row'
},

two_columns_withtext_first_view:{
	width: '80%',
	justifyContent: 'center'
},

two_columns_withtext_second_view:{
	width: '20%',
	alignSelf: 'flex-end',
	alignItems: 'flex-end',
	flexDirection: 'row'
},

two_columns_second_text:{
	alignSelf: 'flex-end',
	alignItems: 'flex-end',
	color:'black'
},

three_columns_second_view:{
	width: '50%',
	justifyContent: 'center'
},

two_columns_with_height:{
	height:30,
	marginLeft: 10,
	marginTop: 5,
	flexDirection: 'row'
},

two_columns_with_secondtext_view:{
	width: '20%',
	justifyContent: 'center'
},

scrollMargin:{
	marginBottom:80
},

	

}
