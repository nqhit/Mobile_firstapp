import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  BackHandler,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';

import FormInputGroup from '@/components/Form/FormInput';
import { login } from '@/server/auth.server';

import { styles } from '@/assets/styles/Screen/FormScreen.styles';
import ButtonLoginSocial from '@/components/Button/LoginSocial';
import FText from '@/components/Text';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect, useNavigation } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';

interface loginFormData {
  usernameOrEmail: string;
  password: string;
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

const validatePassword = (password: string): boolean => {
  return password.trim().length >= 6;
};

const LoginScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [email, setEmail] = useState<loginFormData['usernameOrEmail']>('');
  const [password, setPassword] = useState<loginFormData['password']>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const isFormValid = useMemo(() => {
    return validateEmail(email) && validatePassword(password);
  }, [email, password]);

  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: false,
    });
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => true; // <- return true để chặn
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription.remove();
    }, []),
  );

  const handleNavigateToRegister = useCallback(() => {
    if (isNavigating) return;

    setIsNavigating(true);
    router.push('/register');

    setTimeout(() => {
      setIsNavigating(false);
    }, 1000);
  }, [isNavigating]);

  const handleLogin = async () => {
    if (!isFormValid) {
      Alert.alert('Lỗi', 'Vui lòng kiểm tra lại thông tin đăng nhập');
      return;
    }

    setIsLoading(true);

    const user = {
      usernameOrEmail: email.trim(),
      password: password.trim(),
    };

    try {
      const userData = await login(user, dispatch);

      if (userData && userData._id) {
        try {
          await AsyncStorage.setItem('user', JSON.stringify(userData));
          await AsyncStorage.setItem('accessToken', JSON.stringify(userData.accessToken));
          await AsyncStorage.setItem('refreshToken', JSON.stringify(userData.refreshToken));

          router.replace('/(tabs)/home');
        } catch (storageError) {
          console.error('AsyncStorage error:', storageError);
          Alert.alert('Lỗi', 'Không thể lưu thông tin đăng nhập');
        }
      } else {
        console.error('Invalid user data received:', userData);
        Alert.alert('Lỗi', 'Dữ liệu người dùng không hợp lệ');
      }
    } catch (error) {
      console.error('Login error in component:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.container}>
              <View style={styles.contentContainer}>
                <View style={styles.headerLogo}>
                  <Image source={require('@/assets/images/logo.png')} style={styles.logo} />
                </View>
                <FText style={styles.titleWelcome}>Chào mừng đến với JinStore</FText>
                <FText style={styles.subtitle}>Trải nghiệm mua sắm tiện lợi, thông minh</FText>

                <FormInputGroup
                  inputs={[
                    {
                      placeholder: 'Email',
                      value: email,
                      onChangeText: setEmail,
                      keyboardType: 'email-address',
                    },
                    {
                      placeholder: 'Mật khẩu',
                      value: password,
                      onChangeText: setPassword,
                      secureTextEntry: true,
                    },
                  ]}
                  button={{ isFormValid, isLoading, handleFunc: handleLogin }}
                  text="Đăng nhập"
                />

                <TouchableOpacity style={styles.forgotPasswordContainer}>
                  <FText style={styles.forgotPasswordText}>Quên mật khẩu?</FText>
                </TouchableOpacity>
              </View>

              <View style={styles.footer}>
                <ButtonLoginSocial nameIcon="google" textBtn="Đăng nhập với Google" />

                <View style={styles.registerContainer}>
                  <FText>Chưa có tài khoản? </FText>
                  <TouchableOpacity onPress={handleNavigateToRegister} disabled={isNavigating} activeOpacity={0.7}>
                    <FText style={[styles.registerLink, isNavigating && { opacity: 0.5 }]}>Đăng ký ngay</FText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default LoginScreen;
