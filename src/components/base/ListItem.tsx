import React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';

interface Props {
    style?: ViewStyle;
    disabled?: boolean;
    onPress?: () => void;
    leftComponent?: any;
    rightComponent?: any;
}

export default function ListItem(props: Props) {
    let { style, disabled, onPress, leftComponent, rightComponent } = props;
    return (
        <TouchableOpacity onPress={onPress} disabled={disabled} activeOpacity={1} style={[styles.container, style]}>
            <View>{leftComponent}</View>
            <View>{rightComponent}</View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
});
