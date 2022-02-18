import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Toast, UserAgreeModal } from './components';
import AppRouter from './router';
import { GuideKeys, notificationStore, Storage } from './store';

const App = () => {
    //获取用户协议弹窗
    const [init, setInit] = useState(notificationStore.guides.UserAgreementGuide);
    useEffect(() => {
        if (!init) {
            (async function () {
                const agree = await Storage.getItem(GuideKeys.UserAgreementGuide);
                setInit(agree);
            })();
        }
    }, [init]);

    return (
        <View style={styles.container}>
            <AppRouter />
            {!init && <UserAgreeModal />}
            <Toast ref={(ref) => (global.Toast = ref)} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

export default App;
