import React, { useEffect, useState } from 'react';
import axios from 'axios';

function GetAllPlateTypes() {
  const [plateTypes, setPlateTypes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPlateTypes();
  }, []);

  const fetchPlateTypes = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/platetype/getall');
      setPlateTypes(response.data);
    } catch (err) {
      console.error('Error fetching plate types:', err);
      setError('Failed to fetch plate types.');
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <h3>All Plate Types</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}    
      {plateTypes.length === 0 && !error ? (
        <p>No plate types found.</p>
      ) : (
        <ul>
          {plateTypes.map((plateType) => (
            <li key={plateType.plateTypeId}>
              <strong>ID:</strong> {plateType.plateTypeId} &nbsp;
              <strong>Name:</strong> {plateType.typeName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default GetAllPlateTypes;
