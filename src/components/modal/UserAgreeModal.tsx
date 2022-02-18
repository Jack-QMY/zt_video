import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import RNExitApp from 'react-native-exit-app';
import { GuideKeys, notificationStore, observer, Storage } from '~/store';

export const UserAgreeModal = observer(({ agreeCallback }: props) => {
    const [visible, setVisible] = useState(false);
    const shown = useRef(false);
    const isAgreed = useRef(true);

    const showModal = useCallback((data) => {
        if (!shown.current) {
            shown.current = true;
            setVisible(true);
        }
    }, []);
    const hideModal = useCallback(() => {
        if (shown.current) {
            setVisible(false);
            shown.current = false;
        }
    }, []);

    const agreement = useCallback(() => {
        hideModal();
        Storage.setItem(GuideKeys.UserAgreementGuide, JSON.stringify({}));
        notificationStore.guides.UserAgreementGuide = isAgreed.current = true;
        if (typeof agreeCallback === 'function') {
            agreeCallback();
        }
    }, []);

    useEffect(() => {
        (async function () {
            isAgreed.current = await Storage.getItem(GuideKeys.UserAgreementGuide);
            notificationStore.guides.UserAgreementGuide = !!isAgreed.current;
            if (!isAgreed.current) {
                showModal();
            }
        })();
    }, []);

    return (
        <Modal
            visible={visible}
            animationType="fade"
            animated={true}
            transparent={true}
            statusBarTranslucent={true}
            hardwareAccelerated={true}>
            <View style={styles.contanier}>
                <View style={styles.content}>
                    <Text style={styles.title}>用户协议及隐私条款</Text>
                    <Text style={styles.mask}>
                        请你务必审慎阅读、充分理解
                        <Text style={styles.colorText}>服务协议</Text>和<Text style={styles.colorText}>隐私政策</Text>
                        各条款,包括但不限于:为更好的向你提供服务,我们需要收集你的设识、操作日志等信息用于分析、优化应用性
                    </Text>
                    <Text style={styles.otherText}>点击“同意”,即表示您已经阅读并同意"隐私政策"与"服务协议"</Text>
                    <View style={styles.footer}>
                        <Pressable style={styles.cancleButton} onPress={() => RNExitApp.exitApp()}>
                            <Text style={styles.cancleButtonText}>不同意</Text>
                        </Pressable>
                        <Pressable style={styles.agreeButton} onPress={agreement}>
                            <Text style={styles.agreeButtonText}>同意</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
});

const styles = StyleSheet.create({
    contanier: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        backgroundColor: '#fff',
        width: Device.width - pixel(Theme.edgeDistance) * 6,
        borderRadius: pixel(8),
        padding: pixel(10),
    },

    title: {
        fontSize: font(16),
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: pixel(16),
    },
    mask: {
        fontSize: font(12),
        lineHeight: pixel(26),
    },
    colorText: {
        fontSize: font(13),
        color: Theme.primaryColor,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: pixel(26),
    },
    agreeButton: {
        width: pixel(120),
        height: pixel(40),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: pixel(20),
        backgroundColor: Theme.primaryColor,
    },
    agreeButtonText: {
        fontSize: font(14),
        color: '#FFF',
    },
    cancleButton: {
        borderWidth: 1,
        width: pixel(120),
        height: pixel(40),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: pixel(20),
        borderColor: '#e6e6e6',
    },
    cancleButtonText: {
        fontSize: font(14),
        color: '#8c8c8c',
    },
    otherText: {
        marginTop: pixel(10),
        fontSize: font(12),
        lineHeight: pixel(26),
        letterSpacing: 0.3,
    },
});
