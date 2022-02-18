package com.zhaotaoshipin.ads;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.FrameLayout;
import android.widget.TextView;

import androidx.annotation.Nullable;
import androidx.fragment.app.FragmentActivity;

import com.zhaotaoshipin.MainActivity;
import com.zhaotaoshipin.R;
import com.kc.openset.OSETListener;
import com.kc.openset.OSETSplash;


public class AdSplashActivity extends FragmentActivity {

    private FrameLayout fl;
    private Activity activity;
    private boolean isOnPause = false;//判断是否跳转了广告落地页
    private boolean isClick = false;//是否进行了点击

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_ad_splash);
        activity = this;
        fl = findViewById(R.id.fl);
        OSETSplash.getInstance().show(this, fl, AdCommon.POS_ID_Splash, new OSETListener() {
            @Override
            public void onShow() {
                Log.e("openseterror", "onShow");
            }

            @Override
            public void onError(String s, String s1) {
                Log.e("openseterror", "onError——————code:" + s + "----message:" + s1);
                startActivity(new Intent(activity, MainActivity.class));
                finish();
            }

            @Override
            public void onItemError(String s, String s1) {
                //用于开发直接看每一个上游的错误信息。
            }

            @Override
            public void onClick() {
                isClick = true;
                Log.e("openseterror", "onClick");
            }

            @Override
            public void onClose() {
                Log.e("aaaaaaa", "onclose");
                fl.removeAllViews();
                fl.destroyDrawingCache();
                if (!isOnPause) {//如果已经调用了onPause说明已经跳转了广告落地页
                    startActivity(new Intent(activity, MainActivity.class));
                    finish();
                }
            }
        });

    }

    @Override
    protected void onResume() {
        super.onResume();
        if (isOnPause) {//判断是否点击，并且跳转了落地页，如果是，就相当于走了onclose
            startActivity(new Intent(activity, MainActivity.class));
            finish();
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        if (isClick) {
            isOnPause = true;
        }
    }

    @Override
    protected void onDestroy() {
        OSETSplash.getInstance().destroy();
        super.onDestroy();
    }
}
