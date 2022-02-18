/* 登录注册 */
import LoginScreen from '../screens/login';
import AuthCodeLogin from '../screens/login/AuthCodeLogin';
import Register from '../screens/login/Register';
// /* 设置 */
import EditUserInfo from '../screens/settings/EditUserInfo';
import InviteFriends from '../screens/settings/InviteFriends';
import PrivacyPolicy from '../screens/settings/PrivacyPolicyScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import UserAgreement from '../screens/settings/UserAgreementScreen';


export default {
    Login: {
        component: LoginScreen,
    },
    Register: {
        component: Register,
    },
    AuthCodeLogin: {
        component: AuthCodeLogin,
    },
    SettingsScreen: {
        component: SettingsScreen,
    },
    PrivacyPolicy: {
        component: PrivacyPolicy,
    },
    UserAgreement: {
        component: UserAgreement,
    },
    EditUserInfo: {
        component: EditUserInfo,
    },
    InviteFriends: {
        component: InviteFriends,
    },
};
