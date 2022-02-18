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
import com.kc.openset.OSETInsert;
import com.kc.openset.OSETListener;

public class AdInterstitialModule extends ReactContextBaseJavaModule {

    private static final String TAG = "AdSetSdk";
    private static final String ADSET_INTERSTITIAL_MODULE = "AdInterstitialModule";

    private static ReactApplicationContext reactContext;

    public AdInterstitialModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @NonNull
    @Override
    public String getName() {
        return ADSET_INTERSTITIAL_MODULE;
    }

    // 给RN端发送事件
    private void sendEvent(String eventName, @Nullable WritableMap params) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }

    @ReactMethod
    public void showInterstitialAd(final String posId) {

        getCurrentActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                String adPosId = posId;
                if (TextUtils.isEmpty(adPosId)) {
                    adPosId = AdCommon.POS_ID_Insert;
                }
                OSETInsert.getInstance().show(reactContext.getCurrentActivity(), adPosId, new OSETListener() {
                    @Override
                    public void onShow() {
                        sendEvent("interstitialOnAdShow", null);
                    }

                    @Override
                    public void onError(String s, String s1) {
                        WritableMap error = Arguments.createMap();
                        error.putString("code", s);
                        error.putString("message", s1);
                        sendEvent("interstitialOnAdFailed", error);
                        Log.e("openseterror", "code:" + s + "----message:" + s1);
                    }

                    @Override
                    public void onItemError(String s, String s1) {
                        //用于开发直接看每一个上游的错误信息。
                    }

                    @Override
                    public void onClick() {
                    }

                    @Override
                    public void onClose() {
                        sendEvent("interstitialOnAdClose", null);
                    }
                });

            }
        });
    }
}
