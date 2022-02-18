import Clipboard from '@react-native-community/clipboard';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { fetchRequest, useUploadImage } from '~/commen';
import { ActionSheet, ListItem, NavBarHeader, Row, SvgIcon, SvgPath } from '~/components';
import { userStore } from '~/store';

export default function EditUserInfo() {
    const navigation = useNavigation();
    const userInfo = useMemo(() => userStore.me, [userStore.me]);

    const [formData, setFormData] = useState({
        name: userInfo?.username,
        gender: userInfo?.gender,
    });

    // 复制邀请码
    const inviteClipboard = useCallback(() => {
        Clipboard.setString(userInfo.invite_code.toString());
        Toast.show({ content: '邀请码复制成功,快去分享吧~' });
    }, [userInfo]);

    // 更改用户图像
    const [avatar, setAvatar] = useState(userInfo?.avatar);
    const [uploading, setUploading] = useState(false);
    const uploadAvatar = useCallback(() => {
        useUploadImage()
            .then((res) => {
                setAvatar(res?.data?.fullurl);
                fetchRequest({
                    url: 'wanlshop/user/profile',
                    method: 'POST',
                    body: {
                        avatar: res?.data?.fullurl,
                    },
                })
                    .then((result) => {
                        setUploading(true);
                        userStore.changeAvatar(result.data.avatar);
                        Toast.show({ content: '上传成功，审核通过后其他人才能看见' });
                    })
                    .catch((error) => {
                        setAvatar(userInfo?.avatar);
                        Toast.show({ content: '上传图片失败,请重新在试' });
                    });
            })
            .catch((err) => {
                console.log('外部的错误', err);
            });
    }, [userInfo]);

    // 设置性别
    const [genderVisiable, setGenderVisiable] = useState(false);
    const gender = useMemo(() => {
        if (formData.gender === 0 || formData.gender === '男') {
            return '男';
        } else if (formData.gender === 1 || formData.gender === '女') {
            return '女';
        } else {
            return '未设置';
        }
    }, [formData.gender]);
    return (
        <View style={styles.container}>
            <NavBarHeader title="编辑资料" />
            <View style={styles.avatarItem}>
                <Pressable style={styles.uploadAvatar} onPress={uploadAvatar}>
                    <Image source={{ uri: avatar }} style={styles.avatarImage} />
                    {/* <Text style={styles.changeText}>点击更换图像</Text> */}
                    {uploading && (
                        <View style={[styles.avatarImage, styles.uploadingView]}>
                            <ActivityIndicator size="small" color="#fff" />
                        </View>
                    )}
                </Pressable>
            </View>
            <ListItem
                onPress={() => setGenderVisiable(true)}
                style={styles.list}
                leftComponent={<Text style={styles.leftTitle}>性别</Text>}
                rightComponent={
                    <Row>
                        <Text style={styles.leftTitle}>{gender}</Text>
                        <SvgIcon name={SvgPath.rightArrow} size={28} color="#bbbbbb" />
                    </Row>
                }
            />
            <ListItem
                style={styles.list}
                leftComponent={<Text style={styles.leftTitle}>电话号码</Text>}
                rightComponent={
                    <Row>
                        <Text style={styles.leftTitle}>{userInfo.mobile}</Text>
                        <SvgIcon name={SvgPath.rightArrow} size={28} color="#bbbbbb" />
                    </Row>
                }
            />
            <ListItem
                onPress={inviteClipboard}
                style={styles.list}
                leftComponent={<Text style={styles.leftTitle}>邀请码</Text>}
                rightComponent={
                    <Row>
                        <Text style={styles.leftTitle}>{userInfo.invite_code}</Text>
                        <SvgIcon name={SvgPath.rightArrow} size={28} color="#bbbbbb" />
                    </Row>
                }
            />
            <ListItem
                style={styles.list}
                onPress={() => navigation.navigate('Register', { type: 'forgotPwd', title: '修改密码' })}
                leftComponent={<Text style={styles.leftTitle}>修改密码</Text>}
                rightComponent={<SvgIcon name={SvgPath.rightArrow} size={28} color="#bbbbbb" />}
            />
            <ActionSheet
                visible={genderVisiable}
                onToggleVisible={() => setGenderVisiable(false)}
                options={[
                    {
                        title: '男',
                        onPress: () =>
                            setFormData((prevFormData) => {
                                return { ...prevFormData, gender: '男' };
                            }),
                    },
                    {
                        title: '女',
                        onPress: () =>
                            setFormData((prevFormData) => {
                                return { ...prevFormData, gender: '女' };
                            }),
                    },
                ]}
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
    avatarItem: {
        paddingVertical: pixel(40),
        alignItems: 'center',
    },
    uploadAvatar: {
        position: 'relative',
    },
    changeText: {
        marginTop: pixel(8),
        textAlign: 'center',
        fontSize: font(12),
        color: '#bbbbbb',
    },
    avatarImage: {
        width: Device.width * 0.2,
        height: Device.width * 0.2,
        borderRadius: Device.width * 0.1,
        backgroundColor: '#ddd',
    },
    uploadingView: {
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: '#00000033',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
