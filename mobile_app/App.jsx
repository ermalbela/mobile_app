import React, { useState, useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthContext from './_helper/AuthContext';
import RootNavigator from './navigation/RootNavigator';
import { LoadingProvider } from './_helper/LoadingContext';

export default function App() {
  const [role, setRole] = useState([]);
  const roleValue = useMemo(() => ({ role, setRole }), [role, setRole]);


  return (
    <LoadingProvider>
      <AuthContext.Provider value={roleValue}>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </AuthContext.Provider>
    </LoadingProvider>
  );
}
