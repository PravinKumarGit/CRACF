import {Container, Content ,Button} from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import React, {Component} from 'react'
import {Text, TextInput ,View ,StyleSheet, TouchableOpacity, Keyboard, AsyncStorage} from 'react-native'
import styleKeybaord from './styles/KeyboardStyle'
import STRINGS from '../GlobalString/StringData'
import { register, insertText, backSpace } from 'react-native-custom-keyboard';

export default class CustomKeyboard extends Component {
	constructor(props) {
		super(props);
		//alert(this.props.value);
	}
	onPress = (val) => {
		insertText(this.props.tag, val);
	};
	onPressDel = () => {
	backSpace(this.props.tag);
};
onPressDone = () => {
	Keyboard.dismiss();
};
/* componentWillReceiveProps(nextProps) {
		alert(nextProps);
		if(nextProps.value !== this.state.value) {
			this.setState({ value: nextProps.value });
		}
	} */
    render() {
        return (

        <View style={styleKeybaord.container}>
			<Grid style={styleKeybaord.grid}>
				<Row>
					<Col style={styleKeybaord.column}>
						<TouchableOpacity style={{width:'100%'}} onPress={() => this.onPress('1')} >
							<Text style={styleKeybaord.text}>{STRINGS.t('keybord_1')}</Text>
						</TouchableOpacity>
					</Col>
					<Col style={styleKeybaord.column}>
						<TouchableOpacity onPress={() => this.onPress('2')} >
							<Text style={styleKeybaord.text}>{STRINGS.t('keybord_2')}</Text>
						</TouchableOpacity>
					</Col>
					<Col style={styleKeybaord.column}>
						<TouchableOpacity onPress={() => this.onPress('3')} >
							<Text style={styleKeybaord.text}>{STRINGS.t('keybord_3')}</Text>
						</TouchableOpacity>
					</Col>
				</Row>
				<Row>
					<Col style={styleKeybaord.column}>
						<TouchableOpacity onPress={() => this.onPress('4')} >
							<Text style={styleKeybaord.text}>{STRINGS.t('keybord_4')}</Text>
						</TouchableOpacity>
					</Col>
					<Col style={styleKeybaord.column}>
						<TouchableOpacity onPress={() => this.onPress('5')} >
							<Text style={styleKeybaord.text}>{STRINGS.t('keybord_5')}</Text>
						</TouchableOpacity>
					</Col>
					<Col style={styleKeybaord.column}>
						<TouchableOpacity onPress={() => this.onPress('6')} >
							<Text style={styleKeybaord.text}>{STRINGS.t('keybord_6')}</Text>
						</TouchableOpacity>
					</Col>
				</Row>
				<Row>
					<Col style={styleKeybaord.column}>
						<TouchableOpacity onPress={() => this.onPress('7')} >
							<Text style={styleKeybaord.text}>{STRINGS.t('keybord_7')}</Text>
						</TouchableOpacity>
					</Col>
					<Col style={styleKeybaord.column}>
						<TouchableOpacity onPress={() => this.onPress('8')} >
							<Text style={styleKeybaord.text}>{STRINGS.t('keybord_8')}</Text>
						</TouchableOpacity>
					</Col>
					<Col style={styleKeybaord.column}>
						<TouchableOpacity onPress={() => this.onPress('9')} >
							<Text style={styleKeybaord.text}>{STRINGS.t('keybord_9')}</Text>
						</TouchableOpacity>
					</Col>
				</Row>
				<Row>
					<Col style={styleKeybaord.column}>
						<TouchableOpacity onPress={() => this.onPress('0')} >
							<Text style={styleKeybaord.text}>{STRINGS.t('keybord_0')}</Text>
						</TouchableOpacity>
					</Col>
					<Col style={styleKeybaord.column}>
						<TouchableOpacity onPress={() => this.onPress('000')} >
							<Text style={styleKeybaord.text}>{STRINGS.t('keybord_000')}</Text>
						</TouchableOpacity>
					</Col>
					<Col style={styleKeybaord.column}>
						<TouchableOpacity onPress={() => this.onPress('.')} >
							<Text style={styleKeybaord.text}>{STRINGS.t('keybord_dot')}</Text>
						</TouchableOpacity>
					</Col>
				</Row>
				<Row>
					<Col style={styleKeybaord.column}>
						<TouchableOpacity onPress={() => this.onPressDel()} >
							<Text style={styleKeybaord.text}>{STRINGS.t('keybord_del')}</Text>
						</TouchableOpacity>
					</Col>
					<Col style={styleKeybaord.column}>
						<TouchableOpacity onPress={() => this.onPressDone()} >
							<Text style={styleKeybaord.text}>{STRINGS.t('keybord_done')}</Text>
						</TouchableOpacity>
					</Col>
					<Col style={styleKeybaord.column}>
						<TouchableOpacity onPress={() => this.onPress('-')} >
							<Text style={styleKeybaord.text}>{STRINGS.t('keybord_hy')}</Text>
						</TouchableOpacity>
					</Col>
				</Row>
			</Grid>

      </View>

        );
    }
}
register('hello', () => CustomKeyboard);