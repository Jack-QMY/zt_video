import { Version } from '!/app.json';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { fetchRequest } from '~/commen';
import { Avatar, DialogModal, ListItem, NavBarHeader, Row, SvgIcon, SvgPath } from '~/components';
import { userStore } from '~/store';

export default function SettingsScreen() {
    const navigation = useNavigation();
    const userInfo = useMemo(() => userStore.me, [userStore.me]);
    /* 退出登录 */
    const [visiable, setVisiable] = useState(false); //控制退出登录弹窗
    const singOut = useCallback(() => {
        fetchRequest({
            url: 'wanlshop/user/logout',
            method: 'POST',
        }).then((res) => {
            userStore.signOut();
            setVisiable(false);
            navigation.navigate('Main', null, navigation.navigate('Home'));
            Toast.show({ content: '退出登录成功' });
        });
    }, [navigation]);
    return (
        <View style={styles.container}>
            <NavBarHeader title="设置" />
            <ListItem
                style={styles.list}
                onPress={() => navigation.navigate('EditUserInfo')}
                leftComponent={<Text style={styles.leftTitle}>个人资料</Text>}
                rightComponent={
                    <Row>
                        <Avatar source={userInfo?.avatar} size={36} />
                        <SvgIcon name={SvgPath.rightArrow} size={28} color="#bbbbbb" />
                    </Row>
                }
            />
            {/* <ListItem
                onPress={() => navigation.navigate('InviteFriends')}
                style={styles.list}
                leftComponent={<Text style={styles.leftTitle}>邀请好友</Text>}
                rightComponent={<SvgIcon name={SvgPath.rightArrow} size={28} color="#bbbbbb" />}
            /> */}
            <ListItem
                style={styles.list}
                onPress={() => navigation.navigate('UserAgreement')}
                leftComponent={<Text style={styles.leftTitle}>用户协议</Text>}
                rightComponent={<SvgIcon name={SvgPath.rightArrow} size={28} color="#bbbbbb" />}
            />
            <ListItem
                onPress={() => navigation.navigate('PrivacyPolicy')}
                style={styles.list}
                leftComponent={<Text style={styles.leftTitle}>隐私协议</Text>}
                rightComponent={<SvgIcon name={SvgPath.rightArrow} size={28} color="#bbbbbb" />}
            />
            <ListItem
                style={styles.list}
                leftComponent={<Text style={styles.leftTitle}>当前版本</Text>}
                rightComponent={
                    <Row>
                        <Text>v{Version}</Text>
                        <SvgIcon name={SvgPath.rightArrow} size={28} color="#bbbbbb" />
                    </Row>
                }
            />
            <ListItem
                onPress={() => setVisiable(true)}
                style={styles.list}
                leftComponent={<Text style={styles.leftTitle}>退出登录</Text>}
                rightComponent={<SvgIcon name={SvgPath.rightArrow} size={28} color="#bbbbbb" />}
            />
            <DialogModal
                visible={visiable}
                toggleVisible={() => setVisiable(false)}
                title="提示"
                onCancel={() => setVisiable(false)}
                onConfirm={singOut}
                content={'您确定要退出登录嘛?'}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    list: {
        marginHorizontal: pixel(Theme.edgeDistance),
        borderBottomWidth: 0.6,
        alignItems: 'center',
        borderColor: '#eeeeee',
        height: pixel(60),
    },
    leftTitle: {
        fontSize: font(12),
        color: 'rgba(0,0,0,1)',
    },
});
