import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { fetchRequest } from '~/commen';

// type:  1短信登陆 || 2注册 ||3忘记密码

interface Props {
    type: number;
    account: string;
    imageCode: string;
    event: string;
    contry: any;
}

export default function CountDown(props: Props) {
    const { type, account, imageCode, event, contry } = props;
    const intervalRef = useRef < any > (null);
    const [count, changeCount] = useState(0);
    // 组件卸载时清除计时器
    useEffect(() => {
        return () => {
            clearInterval(intervalRef.current);
        };
    }, []);

    useEffect(() => {
        if (count === 59) {
            intervalRef.current = setInterval(() => {
                changeCount((preCount) => preCount - 1);
            }, 1000);
        } else if (count === 0) {
            clearInterval(intervalRef.current);
        }
    }, [count]);

    const getCode = useCallback(() => {
        let url;
        if (account.length <= 0) {
            return Toast.show({ content: '请输入手机号' });
        }
        if (imageCode.length <= 0) {
            return Toast.show({ content: '请输入图形验证码' });
        }
        if (contry?.code !== 86) {
            url = `wanlshop/sms/send?mobile=${contry?.code + account }&event=${event}&img_code=${imageCode}&type=${type}`;
        } else {
            url = `wanlshop/sms/send?mobile=${account}&event=${event}&img_code=${imageCode}&type=${type}`;
        }
        fetchRequest({
            url: url,
            method: 'GET',
        })
            .then((res) => {
                if (res.code == 1) {
                    changeCount(59);
                    Toast.show({ content: '验证码发送成功' });
                } else {
                    Toast.show({ content: '验证码发送失败' });
                }
            })
            .catch((err) => {
                Toast.show({ content: '验证码发送失败' });
            });
    }, [type, account, imageCode, event, contry]);
    return (
        <Pressable disabled={!!count} onPress={getCode}>
            <Text style={[styles.codeText, { color: count ? 'red' : '#000' }]}>
                {count ? `${count}s后重新获取` : '获取验证码'}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    codeText: {
        fontSize: font(12),
    },
});
