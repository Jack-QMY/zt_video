import { useIsFocused } from '@react-navigation/native';
import React from 'react';
import { StatusBar, StatusBarProps } from 'react-native';

export default function FocusAwareStatusBar(props: StatusBarProps) {
    const isFocused = useIsFocused();
    return isFocused ? <StatusBar backgroundColor="transparent" translucent={true} {...props} /> : null;
}
