import { displayName } from '!/app.json';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { DeviceEventEmitter, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { fetchRequest } from '~/commen';
import { Row, SelectPhoneModal, SvgIcon, SvgPath } from '~/components';
import { userStore } from '~/store';
import CountDown from './CountDown';
import ImageCode from './ImageCode';
export default function AuthCodeLogin() {
    const navigation = useNavigation();
    const [isPrivate, setIsPrivate] = useState(false);
    const [codeImage, setCodeImage] = useState(''); //获取图形验证码
    const [visible, setVisible] = useState(false);
    const [contry, setContry] = useState({
        en: 'China',
        zh: '中国',
        locale: 'CN',
        code: 86,
    });
    const [formData, setFormData] = useState({
        account: '',
        code: '',
        imageCode: '',
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
    const changeCode = useCallback(
        (value) => {
            setFormData({
                ...formData,
                code: value,
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

    //获取图片验证码
    const codeImageButton = useCallback(() => {
        fetchRequest({
            url: 'user/getImgCode',
            method: 'POST',
            body: {
                type: 1,
            },
        }).then((res) => {
            setCodeImage(res?.data);
        });
    }, []);

    useEffect(() => {
        codeImageButton();
    }, []);

    /* 验证码登录 */
    const isCodeLogin = useCallback(() => {
        if (isPrivate) {
            isChangeAccount();
        } else {
            Toast.show({ content: '请先同意用户协议与隐私政策' });
        }
    }, [isPrivate, isChangeAccount]);

    const fetchCodeLogin = useCallback(() => {
        let params = {};
        if (contry?.code !== 86) {
            params = {
                event: 'abd_mobilelogin',
                mobile: contry.code + formData.account,
                captcha: formData.code,
                client_id: null,
            };
        } else {
            params = {
                event: 'mobilelogin',
                mobile: formData.account,
                captcha: formData.code,
                client_id: null,
            };
        }

        fetchRequest({
            url: 'wanlshop/user/mobilelogin',
            method: 'POST',
            body: params,
        }).then((res) => {
            if (res.code == 1) {
                userStore.signIn(res.data.userinfo);
                Toast.show({ content: '登录成功' });
                navigation.navigate('Main', null, navigation.navigate('Personage'));
            } else {
                Toast.show({
                    content: res.msg,
                });
            }
        });
    }, [formData, navigation, contry]);

    /* 检测手机号是否存在注册 */
    const isChangeAccount = useCallback(() => {
        let url;
        if (contry?.code !== 86) {
            url = `wanlshop/validate/check_mobile_exist?event=${'abd_mobilelogin'}&mobile=${contry?.code + formData.account
                }`;
        } else {
            url = `wanlshop/validate/check_mobile_exist?event=${'mobilelogin'}&mobile=${formData.account}`;
        }
        fetchRequest({
            url: url,
            method: 'GET',
        }).then((res) => {
            if (res.code == 1) {
                fetchCodeLogin();
            } else {
                Toast.show({
                    content: '您的手机号暂未注册，请先注册',
                });
                navigation.navigate('Register', { type: 'register' });
            }
        });
    }, [formData, fetchCodeLogin, navigation, contry]);
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
            <Pressable onPress={() => navigation.goBack()} style={styles.back}>
                <SvgIcon name={SvgPath.back} size={24} />
            </Pressable>
            <View style={styles.contentTitle}>
                <Text style={styles.headerTitle}>
                    欢迎登录<Text style={{ color: '#FF0000' }}>{displayName}</Text>
                </Text>
                <Text style={styles.welcomeText}>Welcome to login Zhaotao video </Text>
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
                    placeholder="请输入手机号"
                    maxLength={11}
                    value={formData.account}
                    style={styles.inputBody}
                    onChangeText={changeAccount}
                />
            </Row>
            <Row style={[styles.inputLable, { justifyContent: 'space-between', paddingBottom: pixel(4) }]}>
                <TextInput
                    placeholderTextColor={'#bbbbbb'}
                    placeholder="请输入图形验证码"
                    maxLength={8}
                    value={formData.imageCode}
                    style={styles.inputBody}
                    onChangeText={changeImageCode}
                />
                <ImageCode src={codeImage} onPress={codeImageButton} />
            </Row>
            <Row style={[styles.inputLable, { justifyContent: 'space-between' }]}>
                <TextInput
                    placeholderTextColor={'#bbbbbb'}
                    placeholder="请输入验证码"
                    maxLength={6}
                    value={formData.code}
                    onChangeText={changeCode}
                    keyboardType="numeric"
                    style={styles.inputBody}
                />
                <CountDown
                    type={1}
                    contry={contry}
                    account={formData.account}
                    imageCode={formData.imageCode}
                    event={contry?.code !== 86 ? 'abd_mobilelogin' : 'mobilelogin'}
                />
            </Row>
            <Pressable style={styles.button} onPress={isCodeLogin}>
                <Text style={styles.buttonText}>立即登录</Text>
            </Pressable>
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
                        <Text style={{ color: '#FF5530' }} onPress={() => navigation.navigate('UserAgreement')}>
                            用户协议
                        </Text>
                        及
                        <Text style={{ color: '#FF5530' }} onPress={() => navigation.navigate('PrivacyPolicy')}>
                            隐私权保护声明
                        </Text>
                    </Text>
                </View>
            </Row>

            <Row style={styles.footer}>
                <Pressable style={{ marginRight: pixel(6) }} onPress={() => navigation.goBack()}>
                    <Text style={styles.footerText}>密码登录</Text>
                </Pressable>
                <View style={styles.line} />
                <Pressable
                    style={{ marginLeft: pixel(10) }}
                    onPress={() => navigation.navigate('Register', { type: 'register' })}>
                    <Text style={styles.footerText}>注册</Text>
                </Pressable>
                <View style={styles.line} />
                <Pressable
                    style={{ marginLeft: pixel(10) }}
                    onPress={() => navigation.navigate('Register', { type: 'forgotPwd' })}>
                    <Text style={styles.footerText}>忘记密码</Text>
                </Pressable>
            </Row>
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
        marginTop: pixel(Theme.edgeDistance) * 1.6,
        marginHorizontal: pixel(Theme.edgeDistance),
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
    border: {
        width: pixel(14),
        height: pixel(14),
        borderRadius: pixel(20),
        borderWidth: 2,
        borderColor: '#BBBBBB',
    },
    userPrivate: {
        marginTop: pixel(Theme.edgeDistance) * 1.2,
        marginHorizontal: pixel(Theme.edgeDistance),
    },
    userPrivateText: {
        color: 'rgba(0,0,0,0.5)',
        marginLeft: pixel(10),
    },
    line: {
        width: pixel(2),
        marginHorizontal: pixel(5),
        height: pixel(12),
        backgroundColor: '#bbbbbb',
    },
    footer: {
        marginTop: pixel(Theme.edgeDistance) * 3,
        justifyContent: 'center',
    },
    codeText: {
        color: '#FF5530',
    },
    inputBody: {
        height: pixel(46),
    },
    footerText: {
        fontSize: font(14),
        color: '#000',
    },
});
