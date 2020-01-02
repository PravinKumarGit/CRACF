import {AsyncStorage,Alert} from 'react-native';
// Method to validate email-address
export function validateEmail(email){
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
}

export async function authenticateUser(email){
		value = await AsyncStorage.getItem("userDetail");
		if(value == null || value == ''){
			return '1';
		}else{
			return '0';
		}
}
