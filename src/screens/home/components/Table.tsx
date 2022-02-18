import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
import ListItem from './listItem';

//渲染每个列表
const data = [
    { id: 1, title: '抖音火山版下载1', icons: require('~/assets/img/001.jpg'), num: 51 },
    { id: 2, title: '抖音火山版下载2', icons: require('~/assets/img/001.jpg'), num: 52 },
    { id: 3, title: '抖音火山版下载3', icons: require('~/assets/img/001.jpg'), num: 53 },
];

export default function Table() {
    const _renderItem = useCallback(({ item, index }) => {
        return <ListItem list={item} key={item.id} />;
    }, []);

    return (
        <FlatList
            data={data}
            renderItem={_renderItem}
            keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
        />
    );
}
