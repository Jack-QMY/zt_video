import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Row, SvgIcon, SvgPath } from '~/components';

interface Props {
    src: string;
    onPress: () => void;
}
export default function ImageCode(props: Props) {
    const { src, onPress } = props;
    return (
        <Pressable onPress={onPress}>
            <View style={styles.codeImageButton}>
                <Image source={{ uri: src }} style={styles.imageCode} />
            </View>
            <Row style={{ marginTop: pixel(6), alignSelf: 'center' }}>
                <Text style={styles.text}>看不清?点击更换</Text>
                <SvgIcon name={SvgPath.refresh} size={14} color="#BBBBBB" />
            </Row>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    codeImageButton: {
        borderWidth: 1,
        borderColor: '#eeeeee',
        borderRadius: pixel(2),
    },
    imageCode: {
        width: pixel(140),
        height: pixel(40),
        alignSelf: 'center',
    },
    text: {
        color: '#bbbbbb',
        fontSize: font(10),
        textAlign: 'center',
        marginRight: pixel(4),
        letterSpacing: 0.2,
    },
});
