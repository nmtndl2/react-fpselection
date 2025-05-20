import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AddPlateTypeForm() {
  const [typeName, setTypeName] = useState('');
  const [message, setMessage] = useState('');
  const [plateTypes, setPlateTypes] = useState([]);

  useEffect(() => {
    // Fetch plate types only once on mount
    fetchPlateTypes();
  }, []);

  const fetchPlateTypes = async () => {
    try {
      const res = await axios.get('http://localhost:8081/api/platetype/fetch');
      setPlateTypes(res.data);
    } catch (err) {
      console.error('Error fetching plate types:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedName = typeName.trim();

    // Validation
    if (!trimmedName) {
      setMessage('❌ Plate type name cannot be empty.');
      return;
    }

    const isDuplicate = plateTypes.some(
      (plate) => plate.typeName.toLowerCase() === trimmedName.toLowerCase()
    );

    if (isDuplicate) {
      setMessage('❌ This plate type already exists.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8081/api/platetype/addplatetype', {
        typeName: trimmedName
      });

      setMessage('✅ Plate type added successfully!');
      setTypeName('');
      console.log(response.data);

      await fetchPlateTypes(); // Refresh plate types

    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to add plate type.';
      setMessage(`❌ ${errorMsg}`);
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <h3>Add New Plate Type</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={typeName}
          onChange={(e) => setTypeName(e.target.value)}
          placeholder="Enter plate type name"
          required
        />
        <button type="submit">Add Plate Type</button>
      </form>
      {message && <p style={{ marginTop: '10px' }}>{message}</p>}
    </div>
  );
}

export default AddPlateTypeForm;
