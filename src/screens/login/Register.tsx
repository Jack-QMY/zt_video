import { displayName } from '!/app.json';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { DeviceEventEmitter, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { fetchRequest } from '~/commen';
import { Row, SelectPhoneModal, SvgIcon, SvgPath } from '~/components';
import CountDown from './CountDown';
import ImageCode from './ImageCode';

// 注册页面
export default function Register() {
    const navigation = useNavigation();
    const [codeImage, setCodeImage] = useState(''); //获取图形验证码
    const router = useRoute();
    const type = router.params.type;
    const [visible, setVisible] = useState(false);
    const [contry, setContry] = useState({
        en: 'China',
        zh: '中国',
        locale: 'CN',
        code: 86,
    });
    const titleName = router?.params?.title;
    const [isPrivate, setIsPrivate] = useState(false);
    const [formData, setFormData] = useState({
        account: '',
        imageCode: '',
        code: '',
        password: '',
        isPassword: '',
        invitationCode: '',
    });
    const changeAccount = useCallback(
        (value) => {
            setFormData({
                ...formData,
                account: value,
            });
        },
        [formData],
    );
    const changeImageCode = useCallback(
        (value) => {
            setFormData({
                ...formData,
                imageCode: value,
            });
        },
        [formData],
    );
    const changePassword = useCallback(
        (value) => {
            setFormData({
                ...formData,
                password: value,
            });
        },
        [formData],
    );
    const changeIsPassword = useCallback(
        (value) => {
            setFormData({
                ...formData,
                isPassword: value,
            });
        },
        [formData],
    );
    const changeCode = useCallback(
        (value) => {
            setFormData({
                ...formData,
                code: value,
            });
        },
        [formData],
    );
    const changeInvitationCode = useCallback(
        (value) => {
            setFormData({
                ...formData,
                invitationCode: value,
            });
        },
        [formData],
    );

    //获取图片验证码
    const codeImageButton = useCallback(() => {
        fetchRequest({
            url: 'user/getImgCode',
            method: 'POST',
            body: {
                type: type == 'register' ? 2 : 3,
            },
        }).then((res) => {
            setCodeImage(res?.data);
        });
    }, [type]);

    /* 注册模块 */
    const isRegister = useCallback(() => {
        if (isPrivate) {
            if (formData.password !== formData.isPassword) {
                return Toast.show({
                    content: '两次输入的密码不一致',
                });
            } else if ((formData.password && formData.isPassword).length < 6) {
                return Toast.show({
                    content: '密码长度为6位以上',
                });
            }
            isChangeAccount();
        } else {
            Toast.show({
                content: '请先同意用户协议与隐私政策',
            });
        }
    }, [isPrivate, formData, isChangeAccount]);

    /* 检验手机号是否注册 */
    const isChangeAccount = useCallback(() => {
        let params = {};
        if (contry?.code !== 86) {
            params = {
                event: 'abd_register',
                mobile: contry?.code + formData.account,
                captcha: formData.code,
                invite_code: formData.invitationCode,
                password: formData.isPassword,
                client_id: null,
            };
        } else {
            params = {
                event: 'register',
                mobile: formData.account,
                captcha: formData.code,
                invite_code: formData.invitationCode,
                password: formData.isPassword,
                client_id: null,
            };
        }

        fetchRequest({
            url: 'wanlshop/validate/check_mobile_available',
            method: 'POST',
            body: params,
        }).then((res) => {
            if (res.code == 1) {
                fetchRigister();
            } else {
                Toast.show({
                    content: '您的手机号已注册',
                });
            }
        });
    }, [fetchRigister, formData, contry]);

    const fetchRigister = useCallback(() => {
        let params = {};
        if (contry.code !== 86) {
            params = {
                event: 'abd_register',
                mobile: contry.code + formData.account,
                captcha: formData.code,
                invite_code: formData.invitationCode,
                password: formData.isPassword,
                client_id: null,
            };
        } else {
            params = {
                event: 'register',
                mobile: formData.account,
                captcha: formData.code,
                invite_code: formData.invitationCode,
                password: formData.isPassword,
                client_id: null,
            };
        }

        fetchRequest({
            url: 'wanlshop/user/register',
            method: 'POST',
            body: params,
        })
            .then((res) => {
                if (res.code == 1) {
                    Toast.show({
                        content: '注册成功',
                    });
                    navigation.goBack();
                } else {
                    Toast.show({
                        content: res.msg,
                    });
                }
            })
            .catch((err) => { });
    }, [navigation, formData, contry]);

    // 忘记密码
    const editPasserd = useCallback(() => {
        let params = {};
        if (contry?.code !== 86) {
            params = {
                event: 'abd_resetpwd',
                mobile: contry?.code + formData.account,
                captcha: formData.code,
                newpassword: formData.isPassword,
            };
        } else {
            params = {
                event: 'resetpwd',
                mobile: formData.account,
                captcha: formData.code,
                newpassword: formData.isPassword,
            };
        }

        fetchRequest({
            url: 'wanlshop/user/resetpwd',
            method: 'POST',
            body: params,
        })
            .then((res) => {
                if (res.code == 1) {
                    Toast.show({
                        content: '修改密码成功',
                    });
                    navigation.goBack();
                } else {
                    Toast.show({
                        content: res.msg,
                    });
                }
            })
            .catch((err) => { });
    }, [formData, navigation, contry]);

    const isEditPasserd = useCallback(() => {
        if (formData.password !== formData.isPassword) {
            return Toast.show({
                content: '两次输入的密码不一致',
            });
        } else if ((formData.password && formData.isPassword).length < 6) {
            return Toast.show({
                content: '密码长度为6位以上',
            });
        }
        editPasserd();
    }, [formData, editPasserd]);

    useEffect(() => {
        codeImageButton();
    }, []);
    // 监听选择国家的值
    useEffect(() => {
        DeviceEventEmitter.addListener('selectContry', (res) => {
            setContry(res);
        });
        return () => {
            DeviceEventEmitter.removeAllListeners();
        };
    }, []);
    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Pressable onPress={() => navigation.goBack()} style={styles.back}>
                    <SvgIcon name={SvgPath.back} size={24} />
                </Pressable>
                <View style={styles.contentTitle}>
                    {type == 'register' ? (
                        <>
                            <Text style={styles.headerTitle}>
                                欢迎注册<Text style={{ color: '#FF0000' }}>{displayName}</Text>
                            </Text>
                            <Text style={styles.welcomeText}>Welcome to login Zhaotao video </Text>
                        </>
                    ) : (
                        <Text style={styles.headerTitle}>{titleName || '忘记密码'}</Text>
                    )}
                </View>
                <Row style={styles.inputLable}>
                    <Pressable onPress={() => setVisible(true)}>
                        <Row>
                            <Text style={{ marginRight: 6 }}>{`+${contry?.code}`}</Text>
                            <SvgIcon name={SvgPath.downArrow} color="#bbbbbb" size={14} />
                        </Row>
                    </Pressable>
                    <View style={styles.line} />
                    <TextInput
                        placeholderTextColor={'#bbbbbb'}
                        placeholder="请输入电话号码"
                        maxLength={11}
                        style={styles.inputBody}
                        value={formData.account}
                        onChangeText={changeAccount}
                        keyboardType="numeric"
                    />
                </Row>
                <Row style={[styles.inputLable, { justifyContent: 'space-between', paddingBottom: pixel(4) }]}>
                    <TextInput
                        style={styles.inputBody}
                        placeholderTextColor={'#bbbbbb'}
                        placeholder="请输入图形验证码"
                        maxLength={8}
                        value={formData.imageCode}
                        onChangeText={changeImageCode}
                    />
                    <ImageCode src={codeImage} onPress={codeImageButton} />
                </Row>
                <Row style={[styles.inputLable, { justifyContent: 'space-between' }]}>
                    <TextInput
                        placeholderTextColor={'#bbbbbb'}
                        placeholder="请输入6位短信验证码"
                        maxLength={6}
                        style={styles.inputBody}
                        value={formData.code}
                        onChangeText={changeCode}
                        keyboardType="numeric"
                    />
                    {type === 'register' ? (
                        <CountDown
                            type={2}
                            account={formData.account}
                            imageCode={formData.imageCode}
                            event={contry?.code !== 86 ? 'abd_register' : 'register'}
                            contry={contry}
                        />
                    ) : (
                        <CountDown
                            type={3}
                            account={formData.account}
                            imageCode={formData.imageCode}
                            event={contry?.code !== 86 ? 'abd_resetpwd' : 'resetpwd'}
                            contry={contry}
                        />
                    )}
                </Row>
                <View style={styles.inputLable}>
                    <TextInput
                        style={styles.inputBody}
                        placeholderTextColor={'#bbbbbb'}
                        placeholder="请输入登录密码"
                        secureTextEntry={true}
                        onChangeText={changePassword}
                        maxLength={16}
                        value={formData.password}
                    />
                </View>
                <View style={styles.inputLable}>
                    <TextInput
                        style={styles.inputBody}
                        placeholderTextColor={'#bbbbbb'}
                        placeholder="请确认登录密码"
                        secureTextEntry={true}
                        onChangeText={changeIsPassword}
                        maxLength={16}
                        value={formData.isPassword}
                    />
                </View>
                {type == 'register' ? (
                    <View style={styles.inputLable}>
                        <TextInput
                            style={styles.inputBody}
                            placeholderTextColor={'#bbbbbb'}
                            placeholder="请确认邀请码（可填可不填）"
                            onChangeText={changeInvitationCode}
                            maxLength={16}
                            value={formData.invitationCode}
                            keyboardType="numeric"
                        />
                    </View>
                ) : null}
                <Pressable
                    style={styles.button}
                    onPress={() => {
                        if (type == 'register') {
                            isRegister();
                        } else {
                            isEditPasserd();
                        }
                    }}>
                    <Text style={styles.buttonText}>{type == 'register' ? '立即注册' : '立即修改'}</Text>
                </Pressable>
                {type == 'register' ? (
                    <>
                        <Row style={styles.userPrivate}>
                            <Pressable onPress={() => setIsPrivate(!isPrivate)}>
                                {isPrivate ? (
                                    <SvgIcon name={SvgPath.isChoose} color="#FF0000" size={18} />
                                ) : (
                                    <View style={[styles.border]} />
                                )}
                            </Pressable>
                            <View>
                                <Text style={styles.userPrivateText}>
                                    阅读并同意
                                    <Text
                                        style={{ color: '#FF5530' }}
                                        onPress={() => navigation.navigate('UserAgreement')}>
                                        用户协议
                                    </Text>
                                    及
                                    <Text
                                        style={{ color: '#FF5530' }}
                                        onPress={() => navigation.navigate('PrivacyPolicy')}>
                                        隐私权保护声明
                                    </Text>
                                </Text>
                            </View>
                        </Row>
                        <Row style={styles.footer}>
                            <Pressable style={{ marginRight: pixel(6) }} onPress={() => navigation.goBack()}>
                                <Text style={styles.footerText}>登录</Text>
                            </Pressable>
                            <View style={styles.line} />
                            <Pressable
                                style={{ marginLeft: pixel(10) }}
                                onPress={() => {
                                    setFormData({});
                                    navigation.navigate('AuthCodeLogin');
                                }}>
                                <Text style={styles.footerText}>验证码登录</Text>
                            </Pressable>
                        </Row>
                    </>
                ) : null}
            </ScrollView>
            <SelectPhoneModal visible={visible} toggleVisible={() => setVisible(false)} code={contry?.code || 86} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: pixel(Theme.edgeDistance),
    },
    back: {
        marginTop: Device.isIOS ? Device.statusBarHeight * 2 : Device.statusBarHeight,
    },
    contentTitle: {
        alignSelf: 'center',
        alignItems: 'center',
        marginTop: Device.statusBarHeight * 2,
    },
    headerTitle: {
        fontSize: font(20),
        fontWeight: 'bold',
        color: '#222222',
        letterSpacing: 1,
    },
    welcomeText: {
        fontSize: font(9),
        marginTop: pixel(1),
        color: '#191919',
    },
    inputLable: {
        borderBottomWidth: 1,
        borderColor: '#EEEEEE',
        marginTop: pixel(Theme.edgeDistance) * 1.4,
        marginHorizontal: pixel(Theme.edgeDistance),
    },
    line: {
        width: pixel(2),
        marginHorizontal: pixel(5),
        height: pixel(12),
        backgroundColor: '#bbbbbb',
    },

    button: {
        backgroundColor: '#FF0000',
        alignItems: 'center',
        justifyContent: 'center',
        height: pixel(44),
        borderRadius: pixel(22),
        marginTop: pixel(Theme.edgeDistance) * 2,
        marginHorizontal: pixel(Theme.edgeDistance),
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: font(14),
    },
    userPrivate: {
        marginTop: pixel(Theme.edgeDistance) * 1.2,
        marginHorizontal: pixel(Theme.edgeDistance),
    },
    userPrivateText: {
        color: 'rgba(0,0,0,0.5)',
        marginLeft: pixel(10),
    },
    footer: {
        marginTop: pixel(Theme.edgeDistance) * 3,
        justifyContent: 'center',
        marginBottom: Device.bottomInset || pixel(30),
    },
    border: {
        width: pixel(14),
        height: pixel(14),
        borderRadius: pixel(20),
        borderWidth: 2,
        borderColor: '#BBBBBB',
    },
    inputBody: {
        height: pixel(46),
    },
    footerText: {
        fontSize: font(14),
        color: '#000',
    },
});
