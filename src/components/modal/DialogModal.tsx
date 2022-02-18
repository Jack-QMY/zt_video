import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
    title?: string;
    content: JSX.Element;
    visible: boolean;
    toggleVisible: (v: boolean) => void;
    cancelText?: string;
    confirmText?: string;
    onCancel: () => void;
    onConfirm: () => void;
}

export const DialogModal = (props: Props) => {
    const { visible, toggleVisible, title, content, cancelText, confirmText, onCancel, onConfirm } = props;
    return (
        <Modal
            visible={visible}
            animationType="fade"
            animated={true}
            transparent={true}
            statusBarTranslucent={true}
            hardwareAccelerated={true}>
            <View style={styles.modalContainer} toggleVisible={toggleVisible}>
                <View style={styles.container}>
                    <Text style={styles.title}>{title || '提示'}</Text>
                    {React.isValidElement(content) ? (
                        content
                    ) : (
                        <Text style={styles.bodyText} numberOfLines={3}>
                            {content}
                        </Text>
                    )}
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.button} onPress={onCancel}>
                            <Text style={styles.buttonText}>{cancelText || '取消'}</Text>
                        </TouchableOpacity>
                        <View style={styles.line} />
                        <TouchableOpacity style={styles.button} onPress={onConfirm}>
                            <Text style={[styles.buttonText, { color: Theme.primaryColor }]}>
                                {confirmText || '确定'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const modalWidth = Device.width * 0.84;
const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: modalWidth,
        backgroundColor: '#fff',
        borderRadius: pixel(5),
        paddingTop: pixel(20),
        paddingBottom: pixel(5),
        paddingHorizontal: pixel(18),
    },
    title: {
        fontSize: font(18),
        color: '#212121',
        alignSelf: 'center',
    },
    bodyText: {
        marginVertical: pixel(20),
        fontSize: font(14),
        lineHeight: font(22),
        color: '#212121',
        textAlign: 'center',
    },
    footer: {
        height: pixel(46),
        flexDirection: 'row',
        alignItems: 'stretch',
        borderTopWidth: pixel(1),
        borderTopColor: '#f0f0f0',
    },
    button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: font(16),
        color: '#b2b2b2',
    },
    line: {
        width: pixel(1),
        marginVertical: pixel(10),
        alignSelf: 'stretch',
        backgroundColor: '#f0f0f0',
    },
});
