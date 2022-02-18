import React from 'react';
import { StyleSheet, View } from 'react-native';
import WebView from 'react-native-webview';
import { NavBarHeader } from '~/components';

export default function UserAgreementScreen() {
    return (
        <View style={styles.container}>
            <NavBarHeader title="用户协议" />
            <WebView
                source={{ uri: 'http://api.szjuyeke.com/h5/down/#/pages/xy/xy?id=153' }}
                style={{ width: '100%', height: '100%' }}
                startInLoadingState={true}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffff',
    },
});
