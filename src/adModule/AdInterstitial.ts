import { NativeEventEmitter, NativeModules } from 'react-native';

const AdInterstitial = NativeModules.AdInterstitialModule; // 插屏
const eventEmitter = new NativeEventEmitter(AdInterstitial);
const eventMap = {
    interstitialOnAdShow: 'onAdShow', // 显示
    interstitialOnAdFailed: 'onAdFailed', // 失败
    interstitialOnAdClose: 'onAdDismissed', // 关闭
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
    ...AdInterstitial,
    addEventListener,
    removeEventListener,
    removeAllListeners,
};
