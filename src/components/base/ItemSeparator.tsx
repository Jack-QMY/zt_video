import React from 'react';
import { View } from 'react-native';

function ItemSeparator(props: { height?: number; color?: any; style?: any }) {
    const height = props.height || pixel(8);
    const color = props.color || Theme.groundColour;
    return <View style={[{ height, backgroundColor: color }, props.style]} />;
}

export default ItemSeparator;
