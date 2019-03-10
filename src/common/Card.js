import React from 'react';
import { View } from 'react-native';

const Card = (props) => {
    return (
        <View style={styles.viewStyle}>{ props.children }</View>
    );
};

const styles = {
    viewStyle:{
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
        borderWidth: 1,
        borderRadius: 2,
        borderColor: '#ddd',
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOpacity: 0.1
    }
};

export { Card }