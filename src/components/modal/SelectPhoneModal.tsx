import React, { useCallback, useMemo, useState } from 'react';
import {
    DeviceEventEmitter,
    FlatList,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { Row, SvgIcon, SvgPath } from '~/components';
import counteryList from '../other/country';

interface Props {
    visible: boolean;
    toggleVisible: (v: boolean) => void;
    code: number;
}

export default function SelectPhoneModal(props: Props) {
    const { visible, toggleVisible, code } = props;
    // 选择列表
    const [arrData, setArrData] = useState(counteryList);
    const selcetOnPress = useCallback(
        (item) => {
            DeviceEventEmitter.emit('selectContry', item);
            toggleVisible();
            setBody(null);
            setArrData(counteryList);
        },
        [toggleVisible],
    );
    // 前端实现数据模糊搜索
    const [body, setBody] = useState('');
    const [show, setShow] = useState(false);

    const onChangeText = useCallback((value) => {
        setBody(value);
        let newData = [];
        if (value.length > 0) {
            setShow(true);
            counteryList?.map((item, index) => {
                if (item.zh.indexOf(value) !== -1) {
                    newData.push(item);
                    setArrData(newData);
                }
            });
        } else {
            setShow(false);
        }
    }, []);

    const _renderItem = useCallback(
        ({ item, index }) => {
            return <ListItem selcetOnPress={() => selcetOnPress(item)} code={code} item={item} />;
        },
        [code, selcetOnPress],
    );

    const serachResult = useMemo(() => {
        if (Array.isArray(arrData) && arrData?.length > 0) {
            return (
                <ScrollView>
                    {arrData?.map((item, index) => {
                        return (
                            <ListItem selcetOnPress={() => selcetOnPress(item)} code={code} item={item} key={index} />
                        );
                    })}
                </ScrollView>
            );
        } else {
            return <SvgIcon name={SvgPath.noResult} size={20} color="#bbbbbb" />;
        }
    }, [arrData, code, selcetOnPress]);

    return (
        <Modal
            visible={visible}
            animationType="slide"
            onRequestClose={toggleVisible}
            animated={true}
            transparent={true}
            statusBarTranslucent={true}
            hardwareAccelerated={true}>
            <View style={styles.container}>
                <View style={styles.modalContent}>
                    <View style={styles.borderBottom}>
                        <View style={styles.header}>
                            <View />
                            <View style={styles.line} />
                            <TouchableOpacity
                                onPress={() => {
                                    setBody(null);
                                    setArrData(counteryList);
                                    toggleVisible();
                                }}>
                                <Text style={styles.cancleText}>取消</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.inputBodrder}>
                            <Row>
                                <SvgIcon name={SvgPath.serach} size={20} color="#bbbbbb" />
                                <TextInput
                                    value={body}
                                    placeholder="找不到?尝试搜索相关国家/地区"
                                    onChangeText={onChangeText}
                                    style={styles.inputBody}
                                />
                            </Row>
                        </View>
                    </View>
                    {show ? (
                        <>{serachResult}</>
                    ) : (
                        <FlatList
                            data={arrData}
                            renderItem={_renderItem}
                            keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
                            showsVerticalScrollIndicator={false}
                        />
                    )}
                </View>
            </View>
        </Modal>
    );
}

export function ListItem({ item, code, selcetOnPress }) {
    return (
        <TouchableOpacity style={styles.renderItem} onPress={selcetOnPress}>
            <Row style={{ justifyContent: 'space-between' }}>
                <Text style={styles.zh}>{item.zh}</Text>
                {item.code === code ? <SvgIcon name={SvgPath.isChoose} color="red" size={18} /> : null}
            </Row>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        width: Device.width,
        height: '80%',
        borderTopRightRadius: pixel(16),
        borderTopLeftRadius: pixel(16),
    },
    line: {
        width: pixel(80),
        height: pixel(6),
        borderRadius: pixel(20),
        backgroundColor: '#d9dee2',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: pixel(8),
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: '#eeeeee',
        padding: pixel(Theme.edgeDistance),
    },
    cancleText: {
        fontSize: font(12),
        color: '#bbbbbb',
    },
    renderItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
        padding: pixel(Theme.edgeDistance),
    },
    zh: {
        fontSize: font(14),
        color: '#000',
    },
    lineText: {
        color: '#000',
        marginTop: pixel(6),
    },
    inputBodrder: {
        borderWidth: 1,
        borderColor: '#eeeeee',
        width: Device.width - pixel(Theme.edgeDistance) * 2,
        alignSelf: 'center',
        paddingHorizontal: pixel(10),
        borderRadius: pixel(30),
    },
    inputBody: {
        height: pixel(46),
    },
});
