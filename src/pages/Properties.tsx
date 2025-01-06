import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Properties() {
  const navigate = useNavigate();
  const [properties, setProperties] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchProperties();
  }, []);

  async function fetchProperties() {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('statut', 'disponible');

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error:', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Properties</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map((property: any) => (
            <div 
              key={property.id}
              className="border rounded-lg p-4 cursor-pointer hover:shadow-lg"
              onClick={() => navigate(`/properties/${property.id}`)}
            >
              <h2 className="text-xl font-semibold">{property.bien}</h2>
              <p className="text-red-600">{property.loyer} FCFA</p>
              <p className="text-gray-600">{property.ville}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}