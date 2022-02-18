//存缓存
export const RecordKeys = {
    me: 'me',
    agreeCreatePostAgreement: 'agreeCreatePostAgreement',
} as const;

export const GuideKeys = {
    UserAgreementGuide: 'UserAgreementGuide', //用户协议弹窗
} as const;

export type ItemKeys = typeof RecordKeys & typeof GuideKeys;
