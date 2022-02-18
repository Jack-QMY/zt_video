import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar, Row } from '~/components';
export default function listItem({ list }) {
    return (
        <View style={styles.ul}>
            <View style={styles.li}>
                <Avatar source={list.icons} size={60} />
                <View style={styles.center}>
                    <Text style={styles.up}>{list.title}</Text>
                    <View style={styles.down}>
                        <Text style={styles.down1}>简单</Text>
                    </View>
                </View>
                <Row>
                    <Text style={styles.p1}>{list.num}</Text>
                    <Text style={styles.p2}>金币</Text>
                </Row>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    ul: {
        flex: 1,
        marginHorizontal: pixel(Theme.edgeDistance),
    },
    li: {
        borderBottomWidth: pixel(1),
        borderBottomColor: '#eee',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: pixel(14),
    },
    center: {
        flex: 1,
        marginRight: pixel(10),
        marginLeft: pixel(10),
    },
    up: {
        fontSize: font(13),
        color: '#000',
    },
    down: {
        width: pixel(40),
        height: pixel(20),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: pixel(1),
        borderColor: 'red',
        borderRadius: 3,
        marginTop: pixel(10),
    },
    down1: {
        fontSize: font(10),
        color: 'red',
    },

    p1: {
        fontSize: font(15),
        color: 'red',
        marginRight: pixel(2),
        fontWeight: 'bold',
    },
    p2: {
        fontSize: font(12),
        color: '#000',
    },
});
