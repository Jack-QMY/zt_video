import { makeAutoObservable } from 'mobx';
import { GuideKeys, Storage } from './storage';

class NotificationStore {
    guides = {} as { -readonly [k in keyof typeof GuideKeys]: any }; // 用户协议（弹窗）
    constructor() {
        makeAutoObservable(this);
        this.recall();
    }
    async recall() {
        this.guides[GuideKeys.UserAgreementGuide] = !!(await Storage.getItem(GuideKeys.UserAgreementGuide));
    }
}

export default new NotificationStore();
