import { makeAutoObservable } from 'mobx';
import { RecordKeys, Storage } from './storage';

export interface UserScheme {
    user_id: number;
    id: number;
    gender: number;
    username: string;
    nickname: string;
    level: number;
    score: number;
    avatar: string;
    mobile: string;
    token: string;
    invite_code: string;
    [key: string]: any;
}
class UserStore {
    me = {} as UserScheme;
    recalledUser: boolean = false;
    login: boolean = false;
    constructor() {
        makeAutoObservable(this);
    }

    // 注意，用户登录存在缓存里，调用userStore.signIn(xxxx),外界判断可以用login判断
    signIn(user: UserScheme) {
        TOKEN = user.token;
        this.me = user;
        this.login = true;
        this.recalledUser = true;
        Storage.setItem(RecordKeys.me, user);
    }
    recallUser(me?: UserScheme) {
        if (me?.id) {
            TOKEN = me.token;
            this.me = me;
            this.login = true;
        }
        //从Storage获取用户数据完成，避免重复创建client
        this.recalledUser = true;
    }
    //退出登录
    signOut() {
        TOKEN = null;
        this.me = {} as UserScheme;
        this.login = false;
        this.recalledUser = false;
        Storage.removeItem(RecordKeys.me);
    }
    changeProfile(userMetaData: any) {
        if (userMetaData !== null && typeof userMetaData === 'object') {
            this.me = Object.assign(this.me, userMetaData);
        }
        Storage.setItem(RecordKeys.me, this.me);
    }

    //更改图像
    changeAvatar(avatarUrl: string) {
        this.me.avatar = avatarUrl;
        Storage.setItem(RecordKeys.me, this.me);
    }
}

export default new UserStore();
