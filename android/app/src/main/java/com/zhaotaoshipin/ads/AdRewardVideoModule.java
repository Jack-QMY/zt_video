package com.zhaotaoshipin.ads;

import android.text.TextUtils;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.kc.openset.OSETRewardVideo;
import com.kc.openset.OSETVideoListener;

/**
 * 激励视频
 */
public class AdRewardVideoModule extends ReactContextBaseJavaModule {

    private static final String TAG = "AdSetSdk";
    private static final String ADSET_REWARD_VIDEO_MODULE = "AdRewardVideoModule";

    private static ReactApplicationContext reactContext;

    public AdRewardVideoModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @NonNull
    @Override
    public String getName() {
        return ADSET_REWARD_VIDEO_MODULE;
    }

    // 给RN端发送事件
    private void sendEvent(String eventName, @Nullable WritableMap params) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }


    @ReactMethod
    public void showRewardVideoAd(String posId) {

//        getCurrentActivity().runOnUiThread(new Runnable() {
//            @Override
//            public void run() {
//            }
//        });
        if (TextUtils.isEmpty(posId)) {
            posId = AdCommon.POS_ID_RewardVideo;
        }

        OSETRewardVideo rewardVideo = new OSETRewardVideo();
        rewardVideo.setVerify(true);//想要校验onreward里面的key，必须要设置这个！
        rewardVideo.load(reactContext.getCurrentActivity(), posId, new OSETVideoListener() {
            @Override
            public void onLoad() {
                rewardVideo.showRewardAd(reactContext.getCurrentActivity());
            }

            @Override
            public void onVideoStart() {
                Log.e("RewardVideo", "onVideoStart---");
            }

            @Override
            public void onReward(String key) {
                //奖励回调(可以进行奖励的发放)
                Log.e("RewardVideo", "onReward---key:" + key);
                sendEvent("rewardOnAdReward", null);
            }

            @Override
            public void onShow() {
                Log.e("RewardVideo", "onShow---");
                sendEvent("rewardOnAdShow", null);
            }

            @Override
            public void onError(String s, String s1) {
                Log.e("openseterror", "code:" + s + "----message:" + s1);

                WritableMap error = Arguments.createMap();
                error.putString("code", s);
                error.putString("message", s1);
                sendEvent("rewardOnAdFailed", error);
            }

            @Override
            public void onItemError(String s, String s1) {
                //用于开发直接看每一个上游的错误信息。
            }

            @Override
            public void onClick() {
                //点击回调
                Log.e("RewardVideo", "onClick---");
            }

            @Override
            public void onClose(String key) {
                //关闭回调
                Log.e("RewardVideo", "onClose---key:" + key);
                sendEvent("rewardOnAdClose", null);
                rewardVideo.destory();//释放资源
            }

            @Override
            public void onVideoEnd(String key) {
                //视频播放完成回调
                Log.e("RewardVideo", "onVideoEnd---key:" + key);
            }

        });
    }
}
