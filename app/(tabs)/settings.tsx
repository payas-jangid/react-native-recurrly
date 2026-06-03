import { View, Text } from 'react-native'
import React from 'react'

import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);
const Setting = () => {
  return (
    <SafeAreaView className='bg-background p-5 flex-1'>
      <Text>Setting</Text>
    </SafeAreaView>
  )
}

export default Setting;