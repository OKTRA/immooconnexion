import React from 'react';
import { View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { ApartUnitsManager } from '../components/admin/property/ApartUnitsManager';

export function PropertyUnits() {
  const route = useRoute();
  const propertyId = route.params?.id;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <ApartUnitsManager propertyId={propertyId} />
    </View>
  );
}