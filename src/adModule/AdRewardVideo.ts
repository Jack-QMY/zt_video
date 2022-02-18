import { NativeEventEmitter, NativeModules } from 'react-native';

const AdRewardVideo = NativeModules.AdRewardVideoModule; // 激励视频
const eventEmitter = new NativeEventEmitter(AdRewardVideo);
const eventMap = {
    rewardOnAdShow: 'onAdShow', // 显示
    rewardOnAdFailed: 'onAdFailed', // 失败
    rewardOnAdClose: 'onAdDismissed', // 关闭
    rewardOnAdReward: 'onAdReward', // 激励视频的发送奖励
    rewardOnAdVideoEnd: 'onAdVideoEnd', // 激励视频的播放完成
};
const _subscriptions = new Map();
const addEventListener = (event, handler) => {
    const mappedEvent = eventMap[event];
    if (mappedEvent) {
        let listener;
        if (event === 'onAdFailed') {
            listener = eventEmitter.addListener(mappedEvent, (error) => handler(error));
        } else {
            listener = eventEmitter.addListener(mappedEvent, handler);
        }
        _subscriptions.set(handler, listener);
        return {
            remove: () => removeEventListener(event, handler),
        };
    } else {
        // eslint-disable-next-line no-console
        console.warn(`Trying to subscribe to unknown event: "${event}"`);
        return {
            remove: () => {},
        };
    }
};

const removeEventListener = (type, handler) => {
    const listener = _subscriptions.get(handler);
    if (!listener) {
        return;
    }
    listener.remove();
    _subscriptions.delete(handler);
};

const removeAllListeners = () => {
    _subscriptions.forEach((listener, key, map) => {
        listener.remove();
        map.delete(key);
    });
};

export default {
    ...AdRewardVideo,
    addEventListener,
    removeEventListener,
    removeAllListeners,
};
