import React from 'react';
import { View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { PropertyUnitsManager } from '../components/admin/property/PropertyUnitsManager';

export function PropertyUnits() {
  const route = useRoute();
  const propertyId = route.params?.id;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <PropertyUnitsManager propertyId={propertyId} />
    </View>
  );
}