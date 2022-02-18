import React, { Component } from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { saveImage, screenshots } from '~/commen';

class ContentShareCard extends Component {
    constructor(props) {
        super(props);
    }
    _download = async () => {
        const downloadUrl = await screenshots(this.shareCard);
        saveImage(downloadUrl);
    };
    render() {
        const { userInfo, photoUrl, defaultUrl, url, download } = this.props;
        return (
            <View ref={(ref) => (this.shareCard = ref)} style={styles.container}>
                <Pressable onLongPress={() => download()}>
                    <ImageBackground style={styles.modalBackgrounfImage} source={{ uri: photoUrl || defaultUrl }}>
                        <View style={styles.qrCode}>
                            <Text style={styles.invite_code}>邀请码:{userInfo.invite_code}</Text>
                            <QRCode value={url} size={pixel(120)} color={'#000'} backgroundColor={'#FFF'} />
                            <Text style={styles.onLogText}>长按保存图片</Text>
                        </View>
                    </ImageBackground>
                </Pressable>
            </View>
        );
    }

    onCapture = async () => {
        const image = await screenshots(this.shareCard);
        return image;
    };
}
const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        flex: 1,
        backgroundColor: '#fff',
    },
    modalBackgrounfImage: {
        width: Device.width,
        height: Device.height * 0.88,
    },
    qrCode: {
        position: 'absolute',
        bottom: '20%',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        width: pixel(200),
        height: pixel(200),
        backgroundColor: '#FFF',
        borderRadius: pixel(12),
    },
    invite_code: {
        color: '#FF6E6C',
        fontSize: font(14),
        fontWeight: 'bold',
        marginBottom: pixel(10),
        letterSpacing: 1,
    },
    onLogText: {
        marginTop: pixel(10),
        color: '#FF6E6C',
        fontSize: font(14),
        fontWeight: 'bold',
    },
});
export default ContentShareCard;
