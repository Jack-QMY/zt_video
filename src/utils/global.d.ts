interface DeviceInfo {
    width: number;
    height: number;
    topInset: number;
    bottomInset: number;
    leftInset: number;
    rightInset: number;
    navBarHeight: number;
    tabBarHeight: number;
    UUID: string;
    OS: string;
    isIOS: boolean;
    isAndroid: boolean;
    isFullScreenDevice: boolean;
    minimumPixel: number;
    Brand: string;
}

interface AppConfig {
    AppID: string;
    AppName: string;
    DisplayName: string;
    PackageName: string;
    Version: string;
    Build: string;
    AppSlogan: string;
    ServerRoot: string;
    SocketServer: string;
    CloudRoot: string;
    AssetsRoot: string;
    WechatAppId: string;
    AppStore: string;
    goldAlias: string;
    ticketAlias: string;
    qqGroup: string;
    iosAppStoreUrl: string;
}

interface Colour {
    primaryColor: any;
    primary: string;
    secondaryColor: string;
    secondary: string;
    primaryRgb: string;
    secondaryRgb: string;
    fontDark: string;
    fontMedium: string;
    fontLight: string;
    link: string;

    // ACTIONS
    success: string;
    warning: string;
    alert: string;

    // GRAY_SCALE
    grayLight: string;
    grayMedium: string;
    grayDark: string;

    // SEX
    girl: string;
    boy: string;
}

interface ToastShowParams {
    content: string;
    layout?: 'top' | 'center' | 'bottom';
    duration?: number;
    callback?: () => void;
}

declare const Global: any;

declare let TOKEN: any;

declare const Log: (message?: any, ...optionalParams: any[]) => void;

declare const Device: DeviceInfo;

declare const Config: AppConfig;

declare const Theme: Colour & { edgeDistance: number };

declare const Helper: {
    exceptionCapture: (p: any) => Promise<any>;
    syncGetter: (getter: string, obj: any) => any;
};

declare const Toast: {
    show: (p: ToastShowParams) => void;
};

declare const cdnUri: (img: string) => string;

declare const pixel: (n: number) => number;

declare const font: (n: number) => number;

declare const percent: (n: any) => number;

declare const navigate: (name: string, params?: any) => any;

declare const authNavigate: (name: string, params?: any) => any;

declare const goBack: () => any;
