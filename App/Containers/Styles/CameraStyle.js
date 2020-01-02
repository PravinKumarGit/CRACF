import {Dimensions} from 'react-native';
const { width, height } = Dimensions.get('window')

export default {
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
		padding:5
	},
	preview: {
		justifyContent: 'flex-end',
		alignItems: 'center',
		width: "100%",
		height: "100%"
	},
	capture: {
		flex: 0,
		backgroundColor: '#fff',
		borderRadius: 5,
		color: '#000',
		padding: 10,
		margin: 40
	}
}
