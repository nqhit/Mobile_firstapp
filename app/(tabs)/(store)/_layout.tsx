import styles from '@/assets/styles/Screen/CartScreen.styles';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function CartScreen() {
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          gestureEnabled: false,
          headerTitleAlign: 'center',
          headerBackVisible: false,
          animation: 'slide_from_right',
          headerTitleStyle: styles.title,
          headerLeft: () => {
            return (
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="chevron-back" size={26} color="black" />
              </TouchableOpacity>
            );
          },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="cart"
          options={{
            headerTitle: 'Giỏ hàng',
          }}
        />
        <Stack.Screen name="payment" options={{ title: 'Thanh toán' }} />
        <Stack.Screen name="coupon" options={{ title: 'Mã giảm giá' }} />
        <Stack.Screen name="ProdDetail" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  );
}

export default CartScreen;
