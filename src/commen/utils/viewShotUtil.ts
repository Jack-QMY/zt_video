import { displayName } from '!/app.json';
import CameraRoll from '@react-native-community/cameraroll';
import { PermissionsAndroid, Platform } from 'react-native';
import { captureRef } from 'react-native-view-shot';

const savedFileCache = {};
export function screenshots(viewRef) {
    return new Promise((resolve, reject) => {
        captureRef(viewRef).then((file) => {
            resolve(file);
        });
    });
}
export async function saveImage(file: string, id: number) {
    if (savedFileCache[id]) {
        Toast.show({
            content: '图片保存到相册成功',
        });
        return savedFileCache[id];
    }
    if (Platform.OS === 'ios') {
        const result = await CameraRoll.save(file, { type: 'photo' });
        savedFileCache[id] = result;
        Toast.show({
            content: '图片保存到相册成功',
        });
    } else {
        try {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                const result = await CameraRoll.save(file, { type: 'photo' });
                if (result) {
                    savedFileCache[id] = result;
                    Toast.show({
                        content: '图片保存到相册成功',
                    });
                }
            } else {
                Toast.show({
                    content: `${displayName}需要读取、写入或者删除存储空间和权限，已保证你能正常保存图片`,
                });
            }
        } catch (err) {
            Toast.show({
                content: '图片保存到相册失败',
            });
        }
    }
    return savedFileCache[id];
}

