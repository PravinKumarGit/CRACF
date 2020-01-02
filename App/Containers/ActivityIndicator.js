import React, { Component } from 'react';
import {
   ActivityIndicator,
   View,
   StyleSheet
} from 'react-native';
import Styles from './Styles/ActIndicatorStyle'
export default ActivityIndicatorExample = (props) => {
   return (
      <View style = {Styles.container}>
         <ActivityIndicator animating = {props.animating}
            style = {Styles.activityIndicator} size = "large"
         />
      </View>
   );
}
