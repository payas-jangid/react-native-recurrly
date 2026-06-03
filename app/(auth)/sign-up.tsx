import { View, Text } from 'react-native'
import { Link } from 'expo-router'

const SignUp = () => {
  return (
    <View>
      <Text>sign-out</Text>
      <Link href="/(auth)/sign-up">Sign In</Link>
    </View>
  )
}

export default SignUp