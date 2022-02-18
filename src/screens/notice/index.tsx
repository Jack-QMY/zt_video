import React, { useCallback } from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FocusAwareStatusBar } from '~/components';
import { pixel } from '~/utils/scale';

export default function index() {
    // 跳转微信
    const linkWechat = useCallback(() => {
        Linking.canOpenURL('weixin://')
            .then((supported) => {
                if (supported) {
                    Linking.openURL('weixin://');
                } else {
                    Toast.show({
                        content: '您还没有安装微信',
                    });
                }
            })
            .catch((err) => {
                Toast.show({
                    content: '您还没有安装微信',
                });
            });
    }, []);
    return (
        <View style={styles.container}>
            <FocusAwareStatusBar barStyle={'light-content'} backgroundColor={'rgba(0,0,0,1)'} />
            <View style={styles.header}>
                <Text style={styles.title}>直播间</Text>
            </View>
            <View style={styles.empity}>
                <Text style={styles.empityText}>你还不是主播</Text>
                <Text style={styles.empityText1}>前往微信，联系社群管理员成为主播</Text>
                <TouchableOpacity style={styles.button} onPress={linkWechat}>
                    <Text style={styles.buttonText}>前往微信</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Device.statusBarHeight * 1.2,
    },
    header: {
        width: Device.width,
        borderBottomWidth: pixel(0.4),
        borderBottomColor: '#dddddd',
        alignItems: 'center',
        paddingBottom: pixel(10),
    },
    title: {
        fontSize: font(16),
        color: '#000',
        fontWeight: 'bold',
    },
    empity: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    button: {
        backgroundColor: '#FE3447',
        alignItems: 'center',
        justifyContent: 'center',
        width: Device.width / 2,
        height: pixel(40),
        borderRadius: pixel(4),
    },
    buttonText: {
        color: '#FFF',
    },
    empityText: {
        marginVertical: pixel(6),
        fontSize: font(12),
    },
    empityText1: {
        fontSize: font(9),
        color: '#bbbbbb',
        marginBottom: pixel(Theme.edgeDistance),
    },
});
