import React, { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Video from 'react-native-video';
import { SafeText, SvgIcon, SvgPath } from '~/components';
import BufferingVideo from './BufferingVideo';

interface Props {
    videoData: any;
    resizeMode?: 'cover' | 'contain';
    store: any;
    viewable: boolean;
}
export default React.forwardRef((props: Props, ref) => {
    const { videoData, resizeMode = 'cover', store, viewable } = props;
    const [paused, setPause] = useState(false);
    const [loading, setLoaded] = useState(true);
    const [progress, setProgress] = useState(0);
    const currentTime = useRef(0); // 获取当前播放时间
    const duration = useRef(20); //播放时长

    //获取视频资源url
    const source = useMemo(() => {
        return videoData?.video?.url;
    }, [videoData]);

    const togglePause = useCallback(() => {
        setPause((v) => !v);
    }, []);
    useImperativeHandle(
        ref,
        () => ({
            togglePause,
        }),
        [togglePause],
    );
    const videoEvents = useMemo((): object => {
        return {
            onLoadStart() {
                setProgress(0);
                store.addPlayedId(videoData.id);
                currentTime.current = 0;
            },

            onLoad(data) {
                duration.current = data.duration;
                setLoaded(false);
            },
            onProgress(data) {
                if (!videoData.watched) {
                    ((playProgress) => {
                        setTimeout(() => {
                            store.rewardProgress += playProgress;
                        }, 20);
                    })(data.currentTime - currentTime.current);

                    if (Math.abs(currentTime.current - duration.current) <= 1) {
                        videoData.watched = true;
                    }
                }
                setProgress(data.currentTime);
                currentTime.current = data.currentTime;
            },

            onEnd() { },

            onError() { },

            onAudioBecomingNoisy() {
                setPause(true);
            },
        };
    }, [videoData, store]);

    useEffect(() => {
        setPause(!viewable);
    }, [viewable]);
    return (
        <TouchableWithoutFeedback onPress={togglePause}>
            <View style={styles.playerContainer}>
                <Video
                    paused={paused}
                    resizeMode={resizeMode}
                    style={styles.videoSize}
                    rate={1}
                    source={{ uri: source }}
                    volume={1}
                    muted={false}
                    progressUpdateInterval={150}
                    disableFocus={true}
                    useTextureView={false}
                    repeat={true}
                    ignoreSilentSwitch="obey"
                    playWhenInactive={false}
                    playInBackground={false}
                    {...videoEvents}
                />

                {paused && (
                    <View style={styles.pausedStatus}>
                        <SvgIcon name={SvgPath.play1} color="#f2f2f2" size={60} />
                    </View>
                )}
                <View style={styles.progressBar}>
                    <TouchableOpacity onPress={togglePause} style={styles.maskContainer}>
                        <SafeText style={styles.maskText} limit={50}>
                            {('@' + videoData?.user?.name + ':' + videoData.describe).trim()}
                        </SafeText>
                    </TouchableOpacity>
                    <BufferingVideo loading={loading} />
                    <View style={[styles.progress, { width: (progress / duration.current) * 100 + '%' }]} />
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
});
const styles = StyleSheet.create({
    playerContainer: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
    },
    videoSize: {
        ...StyleSheet.absoluteFillObject,
    },
    pausedStatus: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
    },

    progressBar: {
        height: pixel(1),
        backgroundColor: 'rgba(255,255,255,0.4)',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    progress: {
        backgroundColor: '#FFF',
        width: 0,
        height: pixel(1),
        position: 'absolute',
        bottom: 0,
        left: 0,
    },
    maskContainer: {
        position: 'absolute',
        bottom: 0,
        left: 8,
        right: 8,
        marginBottom: pixel(10),
    },
    maskText: {
        color: '#fff',
        lineHeight: pixel(20),
    },
});
