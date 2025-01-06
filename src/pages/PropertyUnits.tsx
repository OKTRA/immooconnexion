import React from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function PropertyUnits() {
  const { id } = useParams();
  const [units, setUnits] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (id) {
      fetchUnits(id);
    }
  }, [id]);

  async function fetchUnits(propertyId: string) {
    try {
      const { data, error } = await supabase
        .from('property_units')
        .select('*')
        .eq('property_id', propertyId);

      if (error) throw error;
      setUnits(data || []);
    } catch (error) {
      console.error('Error:', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Property Units</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {units.map((unit: any) => (
            <div key={unit.id} className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold">Unit {unit.unit_number}</h2>
              <p className="text-red-600">{unit.rent_amount} FCFA</p>
              <p className="text-gray-600">Status: {unit.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}