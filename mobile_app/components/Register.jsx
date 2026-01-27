import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import axios from 'axios';
import { registerUser } from '../Endpoint';

const Register = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (userName.length < 3) {
      newErrors.userName = 'Enter a valid username';
    }
    if (!email.includes('@')) {
      newErrors.email = 'Enter a valid email';
    }
    if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    try {
      axios.post(registerUser, {
        Name: userName,
        Email: email,
        UserName: userName,
        PasswordHash: password,
        Status: 'Active',
      });

      Alert.alert('Success', 'Registered successfully', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Login'),
        },
      ]);
    } catch (err) {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Register</Text>

        {/* Username */}
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={userName}
          onChangeText={setUserName}
        />
        {errors.userName && <Text style={styles.error}>{errors.userName}</Text>}

        {/* Email */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        {errors.email && <Text style={styles.error}>{errors.email}</Text>}

        {/* Password */}
        <View style={styles.passwordWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
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

        {/* Register button */}
        <Pressable style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </Pressable>

        {/* Login link */}
        <Pressable onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>
            Already have an account? Log in
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 25,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 15,
    marginVertical: 6,
  },
  passwordWrapper: {
    position: 'relative',
  },
  showHide: {
    position: 'absolute',
    right: 15,
    top: 20,
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
  link: {
    textAlign: 'center',
    marginTop: 15,
    color: '#24695c',
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginLeft: 4,
  },
});
