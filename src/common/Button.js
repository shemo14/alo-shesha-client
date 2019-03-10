import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';


const styles = (style) => {
    return {
        button: {
            height: 45,
            borderRadius: 10,
            marginHorizontal: 25,
            marginVertical: 10,
            justifyContent: 'center',
            flex: 1,
            backgroundColor: style.backgroundColor,
            width: style.width,
        },
        buttonText: {
            color:  style.color,
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 15,
        }
    };
};

const Button = (props) => {
    return (
        <TouchableOpacity style={styles(props.btnStyle).button} onPress={props.onPress}>
            <Text style={styles(props.btnStyle).buttonText}>
                { props.children }
            </Text>
        </TouchableOpacity>
    );
};

export { Button };