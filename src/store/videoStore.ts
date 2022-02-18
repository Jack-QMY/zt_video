import { makeAutoObservable, observable } from 'mobx';
import { UserScheme } from './userStore';

interface Video {
    id: number;
    cover: string;
    url: string;
    width: number;
    height: number;
}

interface VideoItem {
    id: number;
    user: UserScheme;
    video: Video;
}

class Video {
    uniqueIds = {};
    fullVideoHeight: number = Device.isFullScreenDevice ? Device.height - Device.tabBarHeight : Device.height; //单个视频刷高度
    viewableItemIndex: number = 0;
    visibility: boolean = true;
    playedVideos: number[] = []; // 已经浏览过的视频
    rewardedVideos: number[] = []; // 已经领取过奖励的视频
    rewardInterval: number = 42; // 观看视频奖励间隔
    rewardProgress: number = 0; // 获得奖励的进度
    data = observable.array<VideoItem>([]);

    constructor() {
        makeAutoObservable(this);
    }

    //重新刷视频
    resetData() {
        this.data = [];
        this.viewableItemIndex = 0;
        this.rewardProgress = 0;
        this.playedVideos = [];
        this.rewardedVideos = [];
    }
    /* 贮存视频的值 */
    addSource(source: VideoItem[]) {
        const newData = source.filter((item) => {
            this.uniqueIds[item?.id] = this.uniqueIds[item?.id] + 1 || 1;
            return this.uniqueIds[item?.id] <= 1;
        });
        this.data = [...this.data, ...newData];
    }

    /* 显示当前播放的视频*/
    get currentItem(): VideoItem {
        return this.data[this.viewableItemIndex >= 0 ? this.viewableItemIndex : 0];
    }

    //浏览过的视频id处理解析
    addPlayedId(id: any) {
        this.playedVideos = this.playedVideos.concat(id);
    }
}
export default new Video();
