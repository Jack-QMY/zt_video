import React, { useCallback, useEffect, useRef } from 'react';
import { Animated, Easing, FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface OptionItem {
    title: string;
    onPress: Function;
}

interface ActionSheetModalProps {
    options: OptionItem[];
    visible: boolean;
    onToggleVisible: (v: boolean) => void;
}

const ActionSheet = ({ options, visible, onToggleVisible }: ActionSheetModalProps) => {
    const shown = useRef(visible);
    const animation = useRef(new Animated.Value(0)).current;

    const showModal = useCallback((data) => {
        if (!shown.current) {
            shown.current = true;
            Animated.timing(animation, {
                easing: Easing.linear,
                duration: 200,
                toValue: 1,
                useNativeDriver: true,
            }).start();
        }
    }, []);

    const hideModal = useCallback(() => {
        if (shown.current) {
            Animated.timing(animation, {
                easing: Easing.linear,
                duration: 200,
                toValue: 0,
                useNativeDriver: true,
            }).start(() => {
                shown.current = false;
                onToggleVisible(false);
            });
        }
    }, []);

    useEffect(() => {
        if (visible) {
            showModal();
        }
    }, [visible]);

    const opacity = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });
    const translateY = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [(Device.height * 2) / 3, 0],
        extrapolate: 'clamp',
    });
    return (
        <Modal
            animationType="fade"
            visible={visible}
            onRequestClose={hideModal}
            animated={true}
            transparent={true}
            statusBarTranslucent={true}
            hardwareAccelerated={true}>
            <SafeAreaView style={styles.modalView} edges={['bottom']}>
                <Animated.View style={[styles.modalShade, { opacity }]}>
                    <Pressable style={{ flex: 1 }} onPress={hideModal} />
                </Animated.View>
                <Animated.View
                    style={{
                        transform: [
                            {
                                translateY,
                            },
                        ],
                    }}>
                    <View style={{ padding: pixel(Theme.edgeDistance) }}>
                        <FlatList
                            bounces={false}
                            scrollEnabled={false}
                            showsVerticalScrollIndicator={false}
                            data={options}
                            contentContainerStyle={styles.optionsWrap}
                            renderItem={({ item, index }) => {
                                return (
                                    <Pressable
                                        activeOpacity={0.8}
                                        key={index}
                                        style={styles.optionItem}
                                        onPress={() => {
                                            hideModal();
                                            item.onPress();
                                        }}>
                                        <Text style={styles.optionItemText} numberOfLines={1}>
                                            {item.title}
                                        </Text>
                                    </Pressable>
                                );
                            }}
                            ItemSeparatorComponent={() => (
                                <View style={{ height: pixel(1), backgroundColor: '#f4f4f4' }} />
                            )}
                            keyExtractor={(item, index) => 'key_' + index}
                        />
                        <Pressable activeOpacity={0.8} style={styles.closeItem} onPress={hideModal}>
                            <Text style={styles.closeText}>取消</Text>
                        </Pressable>
                    </View>
                </Animated.View>
            </SafeAreaView>
        </Modal>
    );
};
export default ActionSheet;
const styles = StyleSheet.create({
    modalView: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalShade: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    optionsWrap: {
        backgroundColor: '#fff',
        borderRadius: pixel(6),
    },
    optionItem: {
        height: pixel(50),
        justifyContent: 'center',
    },
    optionItemText: {
        color: '#2b2b2b',
        fontSize: font(16),
        textAlign: 'center',
    },
    closeItem: {
        height: pixel(50),
        marginTop: pixel(20),
        borderRadius: pixel(6),
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    closeText: {
        color: Theme.primaryColor,
        fontSize: font(16),
        textAlign: 'center',
    },
});
