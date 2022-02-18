import __ from 'lodash';
import React, { useCallback, useEffect } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { FocusAwareStatusBar } from '~/components';
import { observer, videoStore } from '~/store';
import { pixel } from '~/utils/scale';
import VideoItem from './components/VideoItem';
import RewardProgress from './RewardProgress';

const videoData = [
    {
        id: 1,
        watched: false,
        video: {
            cover: 'https://www.asqql.com/tpqsy/demo.jpg',
            url: 'http://mirror.aarnet.edu.au/pub/TED-talks/911Mothers_2010W-480p.mp4',
            width: 720,
            height: 480,
        },
        describe: 'Videezy 是一个成立于2006年的平面设计师素材分享站点',
        user: {
            id: 1,
            name: '马丁',
        },
        like_number: 10,
        comment_number: 10,
    },
    {
        id: 2,
        watched: false,
        video: {
            cover: 'https://img95.699pic.com/photo/50055/5642.jpg_wh300.jpg',
            url: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
            width: 720,
            height: 480,
        },
        describe:
            'Videezy 是一个成立于2006年的平面设计师素材分享站点，平面设计师Shawn发现要想在网络中找一些不错的素材很麻烦，于是就出版了针对平面设计师的素材站点，2010年开始团队运营，现在网站以分享免费的高清视频素材为主，用户可根据许可证免费使用。',
        user: {
            id: 1,
            name: 'jack',
        },
        like_number: 10,
        comment_number: 10,
    },
    {
        id: 3,
        watched: false,
        video: {
            cover: 'https://img.mgwhw.com/upload/3860/2021/04-12/202104121721246n40wr_small.jpg',
            url: 'https://v-cdn.zjol.com.cn/280443.mp4',
            width: 720,
            height: 480,
        },
        describe:
            'Videezy 是一个成立于2006年的平面设计师素材分享站点，平面设计师Shawn发现要想在网络中找一些不错的素材很麻烦，于是就出版了针对平面设计师的素材站点，2010年开始团队运营，现在网站以分享免费的高清视频素材为主，用户可根据许可证免费使用。',
        user: {
            id: 1,
            name: '小皮球',
        },
        like_number: 10,
        comment_number: 10,
    },
];

//  <SvgIcon name={SvgPath.gt} size={50} color="#d81e06" />
//             <Text style={styles.title}>获取数据异常</Text>
//             <Text style={styles.desption}>商户流量已耗尽，请联系商家续费</Text>

const config = {
    waitForInteraction: true,
    viewAreaCoveragePercentThreshold: 95,
};
export default observer(() => {
    const store = videoStore;
    // const defaultInsets = useSafeAreaInsets();
    // Device.bottomInset = defaultInsets.bottom;
    const _renderItem = useCallback(
        ({ item, index }) => {
            const i = index + 1;
            const w = i % 2 === 0;
            return <VideoItem videoData={item} key={item.id} index={index} store={store} />;
        },
        [store],
    );

    //获取高度
    const onLayout = useCallback(
        (event) => {
            const { height } = event.nativeEvent.layout;
            store.fullVideoHeight = height;
        },
        [store],
    );
    /* todo：获取数据源 */

    const fetchData = useCallback(() => {
        if (Array.isArray(videoData) && videoData.length > 0) {
            store.addSource(videoData);
        } else {
            return Toast.show('暂无数据');
        }
    }, [store, videoData]);

    const onMomentumScrollEnd = useCallback(
        __.debounce(() => {
            if (fetchData instanceof Function) {
                fetchData();
            }
        }),
        [fetchData],
    );
    const getVisibleItem = useCallback(
        (index) => {
            store.viewableItemIndex = index;
        },
        [store],
    );

    const getVisibleRows = useCallback(
        (info) => {
            if (info.viewableItems[0]) {
                getVisibleItem(info.viewableItems[0].index);
            }
        },
        [getVisibleItem],
    );

    useEffect(() => {
        fetchData();
    }, [fetchData]);
    return (
        <View style={styles.container}>
            <FocusAwareStatusBar barStyle={'light-content'} backgroundColor={'rgba(0,0,0,1)'} />
            <View style={styles.listContainer}>
                <FlatList
                    onLayout={onLayout}
                    initialNumToRender={1}
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    initialScrollIndex={0}
                    data={store.data}
                    renderItem={_renderItem}
                    bounces={false}
                    scrollsToTop={false}
                    pagingEnabled={true}
                    removeClippedSubviews={true}
                    keyboardShouldPersistTaps="always"
                    getItemLayout={(data, index) => ({
                        length: store.fullVideoHeight,
                        offset: store.fullVideoHeight * index,
                        index,
                    })}
                    onViewableItemsChanged={getVisibleRows}
                    onMomentumScrollEnd={onMomentumScrollEnd}
                    keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
                    viewabilityConfig={config}
                />
            </View>
            <View style={styles.rewardProgress}>
                <RewardProgress store={store} />
            </View>
        </View>
    );
});
console.log(' Device.isFullScreenDevice Device.isFullScreenDevice', Device.isFullScreenDevice);
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000',
        paddingBottom: Device.isFullScreenDevice
            ? Device.bottomInset + Device.tabBarHeight
            : Device.bottomInset + pixel(10),
        flex: 1,
    },
    title: {
        marginTop: pixel(20),
        marginBottom: pixel(8),
        fontSize: font(12),
    },
    desption: {
        color: '#bbbbbb',
        fontSize: font(10),
    },
    listContainer: {
        flex: 1,
        overflow: 'hidden',
    },
    rewardProgress: {
        opacity: 0.7,
        position: 'absolute',
        right: pixel(12),
        top: pixel(60),
    },
});
