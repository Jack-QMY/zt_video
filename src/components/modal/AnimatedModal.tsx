import React from 'react';
import { Modal, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { SvgIcon, SvgPath } from '~/components';
interface Props {
    visible: boolean;
    toggleVisible: (v: boolean) => void;
    children: any;
    style?: ViewStyle;
    showIcon: boolean;
}
export default function AnimatedModal(props: Props) {
    const { visible, toggleVisible, children, style, showIcon } = props;
    return (
        <Modal
            visible={visible}
            animationType="fade"
            animated={true}
            transparent={true}
            statusBarTranslucent={true}
            hardwareAccelerated={true}>
            <View styles={styles.modalView}>
                {showIcon && (
                    <TouchableOpacity style={styles.closeBtn} onPress={toggleVisible} activeOpacity={1}>
                        <SvgIcon name={SvgPath.close} color="#fff" size={20} />
                    </TouchableOpacity>
                )}
                <View style={[style, styles.children]}>{children}</View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalView: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,1)',
    },
    closeBtn: {
        position: 'absolute',
        zIndex: 9999,
        top: Device.statusBarHeight - pixel(8),
        right: 0,
        paddingHorizontal: pixel(Theme.edgeDistance),
        paddingVertical: pixel(8),
        paddingRight: pixel(Theme.edgeDistance),
        alignItems: 'flex-end',
    },
    children: {
        height: Device.height,
        width: Device.width,
    },
});
