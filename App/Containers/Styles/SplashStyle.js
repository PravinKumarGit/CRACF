import {Dimensions, Platform} from 'react-native'

const { width, height } = Dimensions.get('window')

export default {

backgroundImage: {
    flex: 1,
    width: width,
    height: height,
    resizeMode: 'cover', // or 'stretch'
  }

}
