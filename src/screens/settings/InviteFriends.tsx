import { ServerRoot } from '!/app.json';
import Clipboard from '@react-native-community/clipboard';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Image, ImageBackground, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { fetchRequest, saveImage } from '~/commen';
import { NavBarHeader, SvgIcon, SvgPath } from '~/components';
import { userStore } from '~/store';
import ContentShareCard from './components/ContentShareCard';

export default function InviteFriends() {
    const userInfo = useMemo(() => userStore.me, [userStore.me]);
    const [visible, setVisible] = useState(false);
    const [invitePhotos, setInvitePhotos] = useState([]);
    const [photoIndex, setIndex] = useState(-1);
    const [photoUrl, setPhotoUrl] = useState(); //单个图片
    const cardRef = useRef();
    const getPhotoData = useCallback(() => {
        fetchRequest({
            url: 'wanlshop/common/qrcode',
            method: 'POST',
        }).then((res) => {
            setInvitePhotos(res.data);
        });
    }, []);

    //获取分享URL
    const [url, setUrl] = useState('');
    const shareUrlData = useCallback(() => {
        fetchRequest({
            url: 'index/getConfig',
            method: 'POST',
            body: {
                name: 'h5_url',
            },
        }).then((result) => {
            const inviteUrl = result?.data + '/#/?invite_code=' + userInfo.invite_code;
            setUrl(inviteUrl);
        });
    }, [userInfo]);

    //选中
    const SelectIndex = useCallback((index, selectUrl) => {
        setIndex(index);
        setPhotoUrl(selectUrl);
    }, []);
    // 复制邀请码
    const inviteClipboard = useCallback(() => {
        Clipboard.setString(url);
        Toast.show({ content: '链接复制成功,快去分享吧~' });
    }, [url]);

    // 跳转微信
    const linkWechat = useCallback(() => {
        Linking.canOpenURL('weixin://')
            .then((supported) => {
                if (supported) {
                    Linking.openURL('weixin://');
                } else {
                    Toast.show({
                        content: '您还没有安装微信~',
                    });
                }
            })
            .catch((err) => {
                Toast.show({
                    content: '您还没有安装微信~',
                });
            });
    }, []);

    useEffect(() => {
        getPhotoData();
        shareUrlData();
    }, []);

    const defaultUrl = ServerRoot + invitePhotos[0]?.background_url; //默认图像
    const _download = useCallback(async () => {
        try {
            const image = await cardRef.current.onCapture();
            saveImage(image);
        } catch (error) { }
    }, []);
    return (
        <View style={styles.container}>
            <NavBarHeader
                title="邀请好友"
                rightComponent={
                    visible && (
                        <Pressable style={{ marginRight: 14 }} onPress={() => setVisible(false)}>
                            <Text>关闭</Text>
                        </Pressable>
                    )
                }
            />
            {visible ? (
                <ContentShareCard
                    photoUrl={photoUrl}
                    defaultUrl={defaultUrl}
                    userInfo={userInfo}
                    url={url}
                    ref={cardRef}
                    download={_download}
                />
            ) : (
                <>
                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.contentStyle}>
                        {invitePhotos?.map((item, index) => {
                            const background_url = ServerRoot + item?.background_url;
                            return (
                                <Pressable key={index} onPress={() => SelectIndex(index, background_url)}>
                                    <ImageBackground style={styles.inviteImage} source={{ uri: background_url }}>
                                        {photoIndex == index && (
                                            <View style={styles.postionTag}>
                                                <SvgIcon name={SvgPath.isCheck} color="#4ACB6D" />
                                            </View>
                                        )}
                                        <View style={styles.myCodeContent}>
                                            <Text style={styles.userCode}>{userInfo.invite_code}</Text>
                                            <Text style={styles.userCodeText}>邀请码</Text>
                                        </View>
                                    </ImageBackground>
                                </Pressable>
                            );
                        })}
                    </ScrollView>
                    <View style={styles.footer}>
                        <Pressable onPress={inviteClipboard}>
                            <Image source={require('~/assets/images/link.png')} style={styles.icons} />
                            <Text style={styles.iconsTitle}>复制链接</Text>
                        </Pressable>
                        <Pressable onPress={linkWechat}>
                            <Image source={require('~/assets/images/wx.png')} style={styles.icons} />
                            <Text style={styles.iconsTitle}>分享好友</Text>
                        </Pressable>
                        <Pressable onPress={() => setVisible(true)}>
                            <Image source={require('~/assets/images/download.png')} style={styles.icons} />
                            <Text style={styles.iconsTitle}>分享海报</Text>
                        </Pressable>
                    </View>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentStyle: {
        flexGrow: 1,
        paddingLeft: pixel(Theme.edgeDistance),
    },
    inviteImage: {
        width: Device.width * 0.66,
        height: Device.height * 0.6,
        marginRight: pixel(Theme.edgeDistance),
    },
    postionTag: {
        alignSelf: 'flex-end',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        width: Device.width,
        borderTopLeftRadius: pixel(16),
        borderTopRightRadius: pixel(16),
        backgroundColor: '#FFF',
        padding: pixel(16),
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    myCodeContent: {
        position: 'absolute',
        bottom: '30%',
        alignSelf: 'center',
    },
    userCode: {
        fontSize: font(20),
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: pixel(6),
        textAlign: 'center',
    },
    userCodeText: {
        color: '#FFF',
        fontSize: font(12),
        textAlign: 'center',
    },
    icons: {
        width: pixel(33),
        height: pixel(32),
        alignSelf: 'center',
    },
    iconsTitle: {
        fontSize: font(10),
        color: '#000',
        marginTop: pixel(6),
    },
    modal: {
        backgroundColor: 'rgba(0,0,0,1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
