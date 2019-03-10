import React from 'react';
import { Text, TextInput, View, StyleSheet, Image } from 'react-native';

const styles = StyleSheet.create({
    inputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems : 'center',
        borderColor: '#ddd',
        borderBottomWidth: 1,
        paddingBottom: 10,
    },
    logo:{
        width: 15,
        height: 20,
        margin: 5,
    },
    input: {
        fontSize: 16,
        color: '#000',
        paddingLeft: 5,
        paddingRight: 5,
        flex: 2
    }

});

const Input = (props) => {


    return (
        <View style={styles.inputContainer}>
            <TextInput
                underlineColorAndroid='transparent'
                placeholder={props.placeholder}
                secureTextEntry={props.secureTextEntry}
                autoCorrect={false}
                autoCapitalize='none'
                onChangeText={props.onChangeText}
                style={styles.input} />
            {props.error ? <Text>{props.error}</Text> : null}
        </View>
    );
};


export { Input }