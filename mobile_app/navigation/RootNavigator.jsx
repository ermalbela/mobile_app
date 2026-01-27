import React, { useContext, useEffect, useState } from 'react';
import AuthStack from '../navigation/AuthStack';
import PrivateStack from '../navigation/PrivateStack';
import AuthContext from '../_helper/AuthContext';
import axios from 'axios';
import { getRole } from '../Endpoint';
import LoadingContext from '../_helper/LoadingContext';
import Loader from '../Layout/Loader';

const RootNavigator = () => {
  const { role, setRole } = useContext(AuthContext);
  const {loading, setLoading} = useContext(LoadingContext);

  useEffect(() => {

    fetchUserRole();
    setLoading(false);
  }, []);

  async function fetchUserRole() {
    setLoading(true)
    console.log(role);
    const response = await axios.get(getRole, { withCredentials: true })
    .catch(err => {
      localStorage.removeItem('token');
      localStorage.removeItem('name');
      localStorage.removeItem('userId');
      localStorage.removeItem('status');
      setRole([]);
    });
    setRole(response?.data?.role);
    console.log(response?.data)
  }

  return loading ? <Loader /> :(
      role && role.length > 0 ? <PrivateStack /> : <AuthStack />
  );
}

export default RootNavigator