import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { supabase } from './lib/supabase';
import { PropertiesList } from './screens/PropertiesList';
import { PropertyDetails } from './screens/PropertyDetails';
import { Login } from './screens/Login';
import { PropertyUnits } from './screens/PropertyUnits';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Properties" component={PropertiesList} />
          <Stack.Screen name="PropertyDetails" component={PropertyDetails} />
          <Stack.Screen 
            name="PropertyUnits" 
            component={PropertyUnits}
            options={{ title: "Gestion des unités" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}