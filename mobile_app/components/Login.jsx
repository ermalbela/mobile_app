import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
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
    console.log(role);
      try {
          const response = await axios.get(getRole, { withCredentials: true });
          setRole(response.data.role);
          console.log(response.data)
      } catch (error) {
          console.error('Error fetching user role:', error);
      }
    }

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      const res = await axios.post(loginUser,{ Email: email, Password: password, Remember: false }, { withCredentials: true });
    
      await fetchUserRole();
      console.log(res.data)
      await AsyncStorage.setItem('token', res.data.tokenString);
      await AsyncStorage.setItem('userId', String(res.data.updateResult.id));
      await AsyncStorage.setItem('name', res.data.updateResult.name);
      await AsyncStorage.setItem('status', res.data.updateResult.status);
      await AsyncStorage.setItem("token", res.data.tokenString);

      Alert.alert('Success', 'Logged in successfully');

      // navigate to app stack
      navigation.replace('App');
    } catch (err) {
      Alert.alert('Login failed', 'Invalid credentials');
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
