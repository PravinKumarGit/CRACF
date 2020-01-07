/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StatusBar} from 'react-native';

import AppNavigation from './App/Navigation/AppNavigation';

class App extends Component {
  componentDidMount() {
    StatusBar.setHidden(true);
  }
  render() {
    return <AppNavigation />;
  }
}

export default App;
