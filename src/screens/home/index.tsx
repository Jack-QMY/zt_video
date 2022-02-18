import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRecallUserProfile } from '~/commen';
import { DefaultTabBar, FocusAwareStatusBar, ScrollTabView } from '~/components';
import TableScreen from './components/Table';

export default function index() {
    useRecallUserProfile();
    return (
        <View style={styles.container}>
            <FocusAwareStatusBar barStyle={'light-content'} backgroundColor={'rgba(0,0,0,1)'} />
            <View style={styles.header}>
                <Text style={styles.title}>任务中心</Text>
            </View>
            <ScrollTabView
                renderTabBar={(tabBarProps: any) => <DefaultTabBar {...tabBarProps} tabUnderlineWidth={24} />}>
                <TableScreen tabLabel="简单" page={0} />
                <TableScreen tabLabel="高额" page={1} />
                <TableScreen tabLabel="APP下载" page={2} />
                <TableScreen tabLabel="金豆优选" page={3} />
            </ScrollTabView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Device.statusBarHeight * 1.2,
    },
    header: {
        width: Device.width,
        borderBottomWidth: pixel(0.4),
        borderBottomColor: '#dddddd',
        alignItems: 'center',
        paddingBottom: pixel(10),
    },
    title: {
        fontSize: font(16),
        color: '#000',
        fontWeight: 'bold',
    },
});
