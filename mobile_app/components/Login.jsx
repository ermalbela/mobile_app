import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import AuthContext from '../_helper/AuthContext';
import { loginUser, getRole } from '../Endpoint';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const { setRole } = useContext(AuthContext);

  const validate = () => {
    const newErrors = {};

    if (!email.includes('@')) {
      newErrors.email = 'Enter a valid email';
    }

    if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function fetchUserRole() {
    const token = localStorage.getItem('token');

    const response = await axios.get(getRole, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setRole(response.data.role);
  }

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      
      const res = await axios.post(loginUser,{ Email: email, Password: password, Remember: false }, { withCredentials: true });
      
      console.log(res.data)
      // if(Platform.OS === 'web'){
        localStorage.setItem('token', res.data.tokenString);
        localStorage.setItem('userId', JSON.stringify(res.data.updateResult.id));
        localStorage.setItem('name', JSON.stringify(res.data.updateResult.name));
        localStorage.setItem('status', JSON.stringify(res.data.updateResult.status));
      // }
      // await AsyncStorage.setItem('token', res.data.tokenString);
      // await AsyncStorage.setItem('userId', res.data.updateResult.id);
      // await AsyncStorage.setItem('name', res.data.updateResult.name);
      // await AsyncStorage.setItem('status', res.data.updateResult.status);
      
      console.log(res)
      Alert.alert('Success', 'Logged in successfully');
      // console.log(res.data.tokenString)
      await fetchUserRole();
      
      // navigate to dashboard stack
      // navigation.navigate('App');
    } catch (err) {
      console.log(err)
      Alert.alert('Login failed', 'invalid credentials');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Login</Text>

        {/* Email */}
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
          />
        </View>
        {errors.email && <Text style={styles.error}>{errors.email}</Text>}

        {/* Password */}
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={styles.input}
          />
          <Pressable
            style={styles.showHide}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text style={styles.showHideText}>
              {showPassword ? 'Hide' : 'Show'}
            </Text>
          </Pressable>
        </View>
        {errors.password && <Text style={styles.error}>{errors.password}</Text>}

        {/* Login button */}
        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log In</Text>
        </Pressable>

        {/* Register */}
        <Pressable onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>
            Don't have an account? Register
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 30,
    paddingHorizontal: 20,
    elevation: 5,
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: '#999',
    marginBottom: 20,
  },
  inputWrapper: {
    position: 'relative',
    marginVertical: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 15,
  },
  showHide: {
    position: 'absolute',
    right: 15,
    top: 14,
  },
  showHideText: {
    color: '#24695c',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#24695c',
    paddingVertical: 14,
    borderRadius: 6,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginLeft: 4,
  },
  link: {
    textAlign: 'center',
    marginTop: 15,
    color: '#24695c',
  },
});
