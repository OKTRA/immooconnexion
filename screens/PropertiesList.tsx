import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { supabase, checkSession } from '../lib/supabase';

export function PropertiesList({ navigation }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeSession = async () => {
      const session = await checkSession();
      if (!session) {
        // Redirect to login if no valid session
        navigation.replace('Login');
        return;
      }
      fetchProperties();
    };

    initializeSession();

    // Écouter les changements en temps réel
    const channel = supabase
      .channel('public:properties')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'properties' },
        (payload) => {
          console.log('Changement détecté:', payload);
          fetchProperties();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [navigation]);

  async function fetchProperties() {
    try {
      const session = await checkSession();
      if (!session) {
        navigation.replace('Login');
        return;
      }

      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('statut', 'disponible');

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Erreur:', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Chargement...</Text>
      ) : (
        <FlatList
          data={properties}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('PropertyDetails', { id: item.id })}
            >
              <Text style={styles.title}>{item.bien}</Text>
              <Text style={styles.price}>{item.loyer} FCFA</Text>
              <Text style={styles.location}>{item.ville}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  card: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    color: '#e63946',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#6c757d',
  },
});