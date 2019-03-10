import React, { Component } from 'react';
import { ImageBackground } from 'react-native';

class Background extends Component {

    render() {
        return (
            <ImageBackground style={styles.backgroundImage} resizeMode='cover' source={{ uri: 'http://shams.arabsdesign.com/camy/app_resources/bg.png' }}>
                {this.props.children}
            </ImageBackground>
        )
    }
}

const styles = {
    backgroundImage: {
        flex: 1,
        width: null,
        height: null,
        justifyContent: 'center',
    }
};

export { Background };