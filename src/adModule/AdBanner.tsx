import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { requireNativeComponent, View } from 'react-native';

const RNAdsetAdBanner = requireNativeComponent('AdBannerView', AdBanner);

export default class AdBanner extends PureComponent {
    static propTypes = {
        ...View.propTypes, //包含默认的View的属性，如果没有这句会报‘has no propType for native prop’错误

        bannerInfo: PropTypes.shape({
            posId: PropTypes.string,
        }),
        /**
         *  请求广告条数据失败后调用
         *  详解:当接收服务器返回的广告数据失败后调用该函数
         */
        onAdFailed: PropTypes.func,

        /**
         *  banner条被用户关闭时调用
         *  详解:当打开showCloseBtn开关时，用户有可能点击关闭按钮从而把广告条关闭
         */
        onAdDismissed: PropTypes.func,
        /**
         *  banner条曝光回调
         */
        onAdShow: PropTypes.func,
    };

    _onAdFailed(event) {
        this.props.onAdFailed && this.props.onAdFailed(event.nativeEvent);
    }

    render() {
        return <RNAdsetAdBanner onAdFailed={this._onAdFailed.bind(this)} {...this.props} />;
    }
}
