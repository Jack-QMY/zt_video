package com.zhaotaoshipin.ads;

import android.util.Log;
import android.view.View;
import android.widget.FrameLayout;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.kc.openset.OSETListener;

import java.util.Map;

import javax.annotation.Nullable;


public class AdBannerViewManager extends SimpleViewManager implements OSETListener {

    private static final String TAG =  "AdSetSdk";
    private FrameLayout mContainer;
    private RCTEventEmitter mEventEmitter;
    private ReactContext mReactContext;

    private static final String REACT_NAME = "AdBannerView";

    @NonNull
    @Override
    public String getName() {
        return REACT_NAME;
    }

    @NonNull
    @Override
    protected View createViewInstance(@NonNull ThemedReactContext reactContext) {
        this.mReactContext = reactContext;
        mEventEmitter = reactContext.getJSModule(RCTEventEmitter.class);
        FrameLayout container = new FrameLayout(reactContext);
        mContainer = container;
        return container;
    }

    @Nullable
    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        MapBuilder.Builder<String, Object> builder = MapBuilder.builder();
        for (Events event : Events.values()) {
            builder.put(event.toString(), MapBuilder.of("registrationName", event.toString()));
        }
        return builder.build();
    }

    // 其中，可以通过@ReactProp（或@ReactPropGroup）注解来导出属性的设置方法。
    // 该方法有两个参数，第一个参数是泛型View的实例对象，第二个参数是要设置的属性值。
    // 方法的返回值类型必须为void，而且访问控制必须被声明为public。
    // 组件的每一个属性的设置都会调用Java层被对应ReactProp注解的方法
    @ReactProp(name = "bannerInfo")
    public void setBannerInfo(FrameLayout view, final ReadableMap appInfo) {
        String posId = appInfo.getString("posId");

        Log.e(TAG, posId);
        try {
            AdBanner banner = new AdBanner(this.mReactContext.getCurrentActivity(), posId, this);
            view.addView(banner);
        } catch (Exception e) {
            Log.e(TAG, e.getMessage());
        }
    }


    @Override
    public void onShow() {
        Log.e(TAG, "onShow");
        mEventEmitter.receiveEvent(mContainer.getId(), Events.EVENT_SHOW.toString(), null);
    }

    @Override
    public void onError(String s, String s1) {
        Log.e(TAG, "onError" + s + s1);
        WritableMap event = Arguments.createMap();
        event.putString("code", s);
        event.putString("message", s1);
        mEventEmitter.receiveEvent(mContainer.getId(), Events.EVENT_FAILED.toString(), event);
    }

    @Override
    public void onItemError(String s, String s1) {

    }

    @Override
    public void onClick() {

    }

    @Override
    public void onClose() {
        mEventEmitter.receiveEvent(mContainer.getId(), Events.EVENT_DISMISSED.toString(), null);
    }

    public enum Events {
        EVENT_SHOW("onAdShow"),
        EVENT_DISMISSED("onAdDismissed"),
        EVENT_FAILED("onAdFailed");

        private final String mName;

        Events(final String name) {
            mName = name;
        }

        @Override
        public String toString() {
            return mName;
        }
    }
}
