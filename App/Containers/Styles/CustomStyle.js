import {Dimensions} from 'react-native';
const { width, height } = Dimensions.get('window')

export default {

	header_bg:{
		height:64,
		width: '100%'
	},
	back_icon: {
		marginLeft:10,
		marginRight:10,
		flex: 0.30,
		resizeMode: 'contain',
		alignSelf: 'center'
	},
	
	back_icon_accounts: {
		marginLeft:10,
		flex: 0.30,
		resizeMode: 'contain',
		alignSelf: 'center'
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
		flex: 0.80,
		color:'#ffffff',
		fontSize:20,
		backgroundColor: 'transparent',
		alignSelf: 'center',
		textAlign: 'center'
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
		marginRight:70,
		backgroundColor: 'transparent',
		alignSelf: 'center',
	},
	
	header_save_accounts:{
		marginRight:20,
		backgroundColor: 'transparent',
		alignSelf: 'center',
	},
	
	header_save_seller:{
		marginRight:70,
		backgroundColor: 'transparent',
		color:'#ffffff',
		alignSelf: 'center',
	},
	
	header_right:{
		marginRight:30,
		backgroundColor: 'transparent',
		alignSelf: 'center',
		
	},
	header_view:{
		width:'100%',
		height:'100%',
		flexDirection: 'row', 
		justifyContent:'center',
		alignItems:'center'
	},
	back_icon_parent:{
		alignSelf: 'center'
	},
	save_btn:{
		color:'#ffffff',
		fontSize:20,
		textAlign: 'right'
	}
}
