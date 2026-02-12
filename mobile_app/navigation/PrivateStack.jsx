import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { routes } from './routes';
import AppLayout from '../Layout/AppLayout';

const Stack = createNativeStackNavigator();

// const withLayout = (Component) => (props) => (
//   <AppLayout>
//     <Component {...props} />
//   </AppLayout>
// );

const PrivateStack = () => {
  return (
    <AppLayout>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {routes.map(({ name, component }, i) => (
          <Stack.Screen
            key={i}
            name={name}
            component={component}
          />
        ))}
      </Stack.Navigator>
    </AppLayout>
  );
}

export default PrivateStack