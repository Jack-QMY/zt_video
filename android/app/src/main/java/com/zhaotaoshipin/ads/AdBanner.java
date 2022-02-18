package com.zhaotaoshipin.ads;

import android.app.Activity;
import android.content.Context;
import android.util.AttributeSet;
import android.util.Log;
import android.view.LayoutInflater;
import android.widget.FrameLayout;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.zhaotaoshipin.R;
import com.kc.openset.OSETBanner;
import com.kc.openset.OSETListener;

public class AdBanner extends FrameLayout {

    private static final String REACT_NAME = "AdBanner";
    private Context mContext;

    private FrameLayout frameLayout;
    private Runnable mLayoutRunnable;

    public AdBanner(@NonNull Context context, String posId, OSETListener listener) {
        this(context, null, posId, listener);
    }

    public AdBanner(@NonNull Context context, @Nullable AttributeSet attrs, String posId, OSETListener listener) {
        this(context, attrs, 0, posId, listener);
    }

    public AdBanner(@NonNull Context context, @Nullable AttributeSet attrs, int defStyleAttr, String posId, OSETListener listener) {
        super(context, attrs, defStyleAttr);

        this.mContext = context;
        // 把布局加载到这个View里面
        frameLayout = (FrameLayout) LayoutInflater.from(context).inflate(R.layout.view_adbanner, null);
        initView(posId, listener);
    }

    /**
     * 初始化View
     */
    private void initView(String posId, OSETListener listener) {
        closeBanner();

        Log.e("AdSetSdk", "initView");

        OSETBanner.getInstance().setWHScale(0.15625);//只对穿山甲起作用
        OSETBanner.getInstance().show((Activity) this.mContext, AdCommon.POS_ID_Banner, frameLayout, listener);

        addView(frameLayout); // add绘制view
    }

    public void closeBanner() {
        removeAllViews();
        if (mLayoutRunnable != null){
            removeCallbacks(mLayoutRunnable);
        }
    }

    @Override
    protected void onDetachedFromWindow() {
        closeBanner();
        super.onDetachedFromWindow();
    }

    @Override
    public void requestLayout() {
        super.requestLayout();
        if (mLayoutRunnable != null){
            removeCallbacks(mLayoutRunnable);
        }
        mLayoutRunnable = new Runnable() {
            @Override
            public void run() {
                measure(
                        MeasureSpec.makeMeasureSpec(getWidth(), MeasureSpec.EXACTLY),
                        MeasureSpec.makeMeasureSpec(getHeight(), MeasureSpec.EXACTLY));
                layout(getLeft(), getTop(), getRight(), getBottom());
            }
        };
        post(mLayoutRunnable);
    }

}
