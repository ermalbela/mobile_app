import React, { useContext, useEffect, Suspense, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthContext from '../_helper/AuthContext';
import axios from 'axios';
import { getRole } from '../Endpoint';

// Screens
import Dashboard from '../Components/Dashboard';
import Favorites from '../Components/Favorites';
import Login from '../Components/Login';
import Register from '../Components/Register';
import MovieWatcher from '../Components/MovieWatcher';
import AccountSettings from '../Components/AccountSettings';
import FilteredMovies from '../Components/FilteredMovies';
import AdminDashboard from '../Components/AdminDashboard';
import AppLayout from '../Layout/Layout'; // Your layout wrapper

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { role, setRole } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserRole();
  }, []);

  const fetchUserRole = async () => {
    try {
      const response = await axios.get(getRole, { withCredentials: true });
      setRole(response?.data?.role ?? []);
    } catch (err) {
      setRole([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
}

export default AppNavigator