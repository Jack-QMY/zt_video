import { displayName } from '!/app.json';
import AsyncStorage from '@react-native-community/async-storage';
import CheckBox from '@react-native-community/checkbox';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { DeviceEventEmitter, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { fetchRequest } from '~/commen';
import { Row, SelectPhoneModal, SvgIcon, SvgPath } from '~/components';
import { userStore } from '~/store';

export default function index() {
    const navigation = useNavigation();
    const [toggleCheckBox, setToggleCheckBox] = useState(false);
    const [isPrivate, setIsPrivate] = useState(false);
    const [visible, setVisible] = useState(false);
    const [contry, setContry] = useState({
        en: 'China',
        zh: '中国',
        locale: 'CN',
        code: 86,
    });
    const [formData, setFormData] = useState({
        account: '',
        password: '',
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
    const changePassword = useCallback(
        (value) => {
            setFormData({
                ...formData,
                password: value,
            });
        },
        [formData],
    );

    //登录请求
    const fetchLogin = useCallback(() => {
        let params = {};
        if (contry?.code !== 86) {
            params = {
                account: contry.code + formData.account,
                password: formData.password,
                event: 'abd_mobilelogin',
            };
        } else {
            params = {
                account: formData.account,
                password: formData.password,
                event: 'mobilelogin',
            };
        }
        fetchRequest({
            url: 'wanlshop/user/login',
            method: 'POST',
            body: params,
        }).then((res) => {
            if (res.code == 1) {
                userStore.signIn(res.data.userinfo);
                /* 记住账号密码，用户账号登录成功，并且选中则保存*/
                if (toggleCheckBox) {
                    const accountData = JSON.stringify({
                        account: formData.account,
                        password: formData.password,
                    });
                    try {
                        AsyncStorage.setItem('isAccount', accountData);
                    } catch (error) { }
                }
                Toast.show({
                    content: '登录成功',
                });
                navigation.goBack();
            } else {
                Toast.show({
                    content: res.msg,
                });
            }
        });
    }, [formData, navigation, toggleCheckBox, contry]);

    /* 检测手机号是否注册 */
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
                fetchLogin();
            } else {
                Toast.show({
                    content: '您的手机号暂未注册，请先注册',
                });
                navigation.navigate('Register', { type: 'register' });
            }
        });
    }, [formData, fetchLogin, navigation, contry]);

    /* 账号登录 */
    const isLogin = useCallback(() => {
        if (isPrivate) {
            isChangeAccount();
        } else {
            Toast.show({
                content: '请先同意用户协议与隐私政策',
            });
        }
    }, [isPrivate, isChangeAccount]);

    /* 获取账号密码缓存 */
    useEffect(() => {
        AsyncStorage.getItem('isAccount').then((res) => {
            const info = JSON.parse(res);
            setFormData({
                ...formData,
                account: info.account,
                password: info.password,
            });
        });
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
                    placeholder="请输入登录账号"
                    maxLength={11}
                    value={formData.account}
                    style={styles.inputBody}
                    onChangeText={changeAccount}
                />
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
            <View style={styles.listRow}>
                <Row>
                    <CheckBox
                        disabled={false}
                        value={toggleCheckBox}
                        onValueChange={(newValue) => setToggleCheckBox(newValue)}
                        tintColors={{ true: '#FF0000' }}
                        boxType="square"
                        onCheckColor={'#FF0000'}
                        onTintColor={'#FF0000'}
                        style={{ height: 20, width: 20, marginRight: pixel(6) }}
                    />
                    <Text>记住密码</Text>
                </Row>
                <Pressable onPress={() => navigation.navigate('Register', { type: 'forgotPwd' })}>
                    <Text>忘记密码</Text>
                </Pressable>
            </View>
            <Pressable style={styles.button} onPress={isLogin}>
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
                <Pressable style={{ marginRight: pixel(6) }} onPress={() => navigation.navigate('AuthCodeLogin')}>
                    <Text style={styles.footerText}>验证码登录</Text>
                </Pressable>
                <View style={styles.line} />
                <Pressable
                    style={{ marginLeft: pixel(10) }}
                    onPress={() => navigation.navigate('Register', { type: 'register' })}>
                    <Text style={styles.footerText}>注册</Text>
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
        marginVertical: Device.statusBarHeight * 1.4,
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
        marginHorizontal: pixel(Theme.edgeDistance),
    },
    inputBody: {
        height: pixel(60),
    },
    listRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: pixel(16),
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
        letterSpacing: 1,
    },
    line: {
        width: pixel(2),
        marginHorizontal: pixel(8),
        height: pixel(16),
        backgroundColor: '#bbbbbb',
    },
    footer: {
        marginTop: pixel(Theme.edgeDistance) * 3,
        justifyContent: 'center',
    },
    footerText: {
        fontSize: font(14),
        color: '#000',
    },
});
