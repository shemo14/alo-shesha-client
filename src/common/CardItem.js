import React from 'react';
import { View } from 'react-native';

const CardItem = (props) => {
    return (
        <View style={styles.cardItem}>{ props.children }</View>
    );
};

const styles = {
    cardItem: {
        paddingRight: 50,
        paddingLeft: 50,
        paddingBottom: 20,
        borderColor: '#ddd',
        justifyContent: 'flex-start',
        flexDirection: 'row'
    }
};

export { CardItem }