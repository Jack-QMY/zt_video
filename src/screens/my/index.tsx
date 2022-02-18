import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fetchRequest } from '~/commen';
import { Avatar, FocusAwareStatusBar, ItemSeparator, ListItem, Row, SvgIcon, SvgPath } from '~/components';
import { userStore } from '~/store';

export default function index() {
    const [userInfo, setUserInfo] = useState(userStore.me);
    const [userList, setUserList] = useState({});
    const navigation = useNavigation();
    const userData = useCallback(() => {
        fetchRequest({
            url: 'wanlshop/user/refresh',
            method: 'POST',
        }).then((res) => {
            userStore.changeProfile(res.data.userinfo);
            setUserInfo(res.data.userinfo);
            setUserList(res.data);
        });
    }, []);

    useEffect(() => {
        userData();
    });
    return (
        <View style={styles.container}>
            <FocusAwareStatusBar barStyle={'light-content'} backgroundColor={'rgba(0,0,0,1)'} />
            <View>
                <TouchableOpacity onPress={() => navigation.navigate('EditUserInfo')}>
                    <Row style={styles.content}>
                        <Avatar source={userInfo?.avatar} size={60} />
                        <View style={{ marginLeft: Theme.edgeDistance }}>
                            <Text style={styles.userName}>{userInfo?.nickname}</Text>
                            <Text>{userList?.level_name}</Text>
                        </View>
                    </Row>
                </TouchableOpacity>
                <ItemSeparator height={12} />
                <ListItem
                    style={styles.list}
                    leftComponent={
                        <Row>
                            <SvgIcon name={SvgPath.shouyi} size={24} color="#191919" />
                            <Text style={styles.leftTitle}>收益</Text>
                        </Row>
                    }
                    rightComponent={<SvgIcon name={SvgPath.rightArrow} size={28} color="#191919" />}
                />
                <ListItem
                    style={styles.list}
                    leftComponent={
                        <Row>
                            <SvgIcon name={SvgPath.play} size={24} color="#191919" />
                            <Text style={styles.leftTitle}>制作素材</Text>
                        </Row>
                    }
                    rightComponent={<SvgIcon name={SvgPath.rightArrow} size={28} color="#191919" />}
                />
                <ListItem
                    style={styles.list}
                    leftComponent={
                        <Row>
                            <SvgIcon name={SvgPath.change} size={24} color="#191919" />
                            <Text style={styles.leftTitle}>切换运营商</Text>
                        </Row>
                    }
                    rightComponent={
                        <Row>
                            <Text style={styles.listRightText}>极之好物</Text>
                            <SvgIcon name={SvgPath.rightArrow} size={28} color="#191919" />
                        </Row>
                    }
                />
                <ListItem
                    style={styles.list}
                    onPress={() => navigation.navigate('SettingsScreen')}
                    leftComponent={
                        <Row>
                            <SvgIcon name={SvgPath.setting} size={24} color="#191919" />
                            <Text style={styles.leftTitle}>设置</Text>
                        </Row>
                    }
                    rightComponent={<SvgIcon name={SvgPath.rightArrow} size={28} color="#191919" />}
                />
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
    content: {
        margin: pixel(Theme.edgeDistance),
    },
    userName: {
        fontSize: font(12),
        color: '#191919',
        marginBottom: pixel(10),
    },
    leftTitle: {
        marginLeft: pixel(Theme.edgeDistance),
    },
    list: {
        marginHorizontal: pixel(Theme.edgeDistance),
        borderBottomWidth: 0.6,
        alignItems: 'center',
        borderColor: '#eeeeee',
        height: pixel(60),
    },
    listRightText: {
        fontSize: font(8),
        color: 'rgba(0,0,0,0.6)',
    },
});
