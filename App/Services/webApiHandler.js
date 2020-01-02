import {Image, View, Dimensions, Text, Alert, TextInput, TouchableOpacity, NetInfo, ScrollView} from 'react-native';
export function callPostApi(urlStr, params, access_token) {
    return fetch(urlStr, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
				'Authorization': 'Bearer '+access_token,
            },
            body: JSON.stringify(params)
        })
        .then((response) => response.json())
        .then((responseData) => {
            result = responseData
			/* if(result.status == 'success'){
				if(result.data == ""){
					result.status = 'fail';
				}
			} */
        })
        .catch((error) => {
             console.error(error);
             Alert.alert('CostsFirst', 'Service Unavailable, Please try again later!');
        });
}
export function callGetApi(urlStr, params, access_token) {
    return fetch(urlStr, {
            method: "GET",
            headers: {   
                'Content-Type': 'application/json',
				'Authorization':'Bearer '+access_token,
            }
        })
        .then((response) => response.json())
        .then((responseData) => {
            result = responseData
        })
        .catch((error) => {
             console.error(error);
             //Alert.alert('Alert Title failure' + JSON.stringify(error))
             Alert.alert('CostsFirst', 'Service Unavailable, Please try again later!');
        });
}

export function callGoogleDrivePostApi(urlStr, params, access_token) {
    return fetch(urlStr, {
            method: "POST",
            headers: {   
                'Content-Type': 'application/json',
				'Authorization':'Bearer '+access_token,
            },
            body: JSON.stringify(params)
        })
        .then((response) => response.json())
        .then((responseData) => {
            result = responseData
        })
        .catch((error) => {
             console.error(error);
             Alert.alert('CostsFirst', 'Service Unavailable, Please try again later!');
             //Alert.alert('Alert Title failure' + JSON.stringify(error))
        });
}
