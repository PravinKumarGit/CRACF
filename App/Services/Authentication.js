import React, { Component } from 'react';
import {AsyncStorage,Alert} from 'react-native';

export default class AuthenticateUser extends Component {
    constructor() {
        super()
    }  
	 authenticateUser(){
		AsyncStorage.getItem("userDetail").then((value) => {
			if(value == null || value == ''){
				return '1';
			}else{
				return '0';
			}
		})

	}	
}  