import { goldAlias } from '!/app.json';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import * as Progress from 'react-native-progress';
import { useBounceAnimation, useLinearAnimation } from '~/commen';
import { observer, userStore } from '~/store';

interface Props {
    store: any;
}
const RewardProgress = observer((props: Props) => {
    const { store } = props;
    const navigation = useNavigation();
    const firstReward = useRef(true);
    const userId = useMemo(() => userStore.me.id, [userStore.me]);
    const progress = (store.rewardProgress / store.rewardInterval) * 100;
    const rewardAble = progress >= 100;

    const [rewardGold, setReward] = useState();
    const [imageAnimation, startImageAnimation] = useBounceAnimation({ value: 0, toValue: 1 });
    const [textAnimation, startTextAnimation] = useLinearAnimation({ duration: 2000 });

    useEffect(() => {
        async function fetchReward() {
            store.rewardProgress = 0;
            startImageAnimation();
            store.playedVideos = [];
            const gold = 7;
            setReward(`+${gold}${goldAlias}`);
            startTextAnimation();
            // if (TOKEN) {
            //     store.rewardProgress = 0;
            //     startImageAnimation();
            //     store.playedVideos = [];
            //     const gold = 7;
            //     setReward(`+${gold}${goldAlias}`);
            //     startTextAnimation();
            // } else if (firstReward.current) {
            //     firstReward.current = false;
            //     Toast.show({ content: '登录领取奖励哦' });
            // }
        }
        if (rewardAble) {
            fetchReward();
        }
    }, [rewardAble]);

    const imageScale = imageAnimation.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 1.2, 1],
    });

    const textOpacity = textAnimation.interpolate({
        inputRange: [0, 0.1, 0.4, 0.7, 0.8, 1],
        outputRange: [0, 0.7, 0.8, 0.9, 1, 0],
    });

    const textTranslateY = textAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [1, -80],
    });

    const textScale = textAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1.5],
    });

    const onPress = useCallback(() => {
        Toast.show({ content: '跳转任务页面' });
    }, []);

    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <Animated.View style={[styles.circleProgress, { transform: [{ scale: imageScale }] }]}>
                <Animated.Text
                    style={[
                        styles.rewardText,
                        { opacity: textOpacity, transform: [{ translateY: textTranslateY }, { scale: textScale }] },
                    ]}>
                    {rewardGold}
                </Animated.Text>
                <Image source={require('~/assets/images/ic_video_reward_progress.png')} style={styles.rewardImage} />
                {progress > 0 && (
                    <Progress.Circle
                        progress={progress / 100}
                        size={pixel(45)}
                        borderWidth={0}
                        color="#ff5644"
                        thickness={pixel(3)}
                        endAngle={1}
                        strokeCap="round"
                    />
                )}
            </Animated.View>
        </TouchableWithoutFeedback>
    );
});
const styles = StyleSheet.create({
    circleProgress: {
        height: pixel(50),
        position: 'relative',
        width: pixel(50),
        justifyContent: 'center',
        alignItems: 'center',
    },
    rewardImage: {
        ...StyleSheet.absoluteFill,
        height: pixel(50),
        width: pixel(50),
    },
    rewardText: {
        color: '#FFB100',
        fontSize: font(12),
        left: 0,
        position: 'absolute',
        right: 0,
        textAlign: 'center',
        top: 0,
    },
});

export default RewardProgress;
