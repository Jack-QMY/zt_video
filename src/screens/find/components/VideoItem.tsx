import React, { useCallback, useMemo, useRef } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Player from './Player';

interface Props {
    videoData: any;
    index: number;
    store: any;
}

export default function VideoItem(props: Props) {
    const { videoData, index, store } = props;
    const viewable = index === store.viewableItemIndex && store.visibility;
    // 播放器的显示区间
    const shown = useMemo(() => {
        if ((store.viewableItemIndex > index - 2 && store.viewableItemIndex < index + 3) || viewable) {
            return true;
        }
        return false;
    }, [index, store.viewableItemIndex, viewable]);

    // // 获取播放器实例，控制视频播放状态
    const playerRef = useRef();
    const togglePause = useCallback(() => {
        if (playerRef.current?.togglePause instanceof Function) {
            playerRef.current.togglePause();
        }
    }, []);

    //单个视频宽高度
    const resizeMode = useMemo(() => {
        const videoHeight = parseInt(videoData?.video?.height);
        const videoWidth = parseInt(videoData?.video?.width);
        return 'contain';
    }, [videoData]);

    //视频背景封面图
    const videoCover = useMemo(() => {
        const cover = videoData?.video?.cover;
        const source = cover ? { uri: cover } : require('~/assets/images/curtain.png');
        return (
            <View style={styles.contentCover}>
                <Image style={styles.curtain} source={source} resizeMode="cover" blurRadius={2} />
                <View style={styles.blackMask} />
            </View>
        );
    }, [videoData]);

    return (
        <View
            style={{
                height: store.fullVideoHeight,
            }}>
            {videoCover}
            <View style={styles.positionContainer}>
                {shown && (
                    <Player
                        videoData={videoData}
                        resizeMode={resizeMode}
                        store={store}
                        viewable={viewable}
                        ref={playerRef}
                    />
                )}
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    positionContainer: {
        bottom: 0,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
    },
    contentCover: {
        ...StyleSheet.absoluteFillObject,
    },
    curtain: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: undefined,
        height: undefined,
    },
    blackMask: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
});
