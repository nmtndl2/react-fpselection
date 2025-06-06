import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PlateTypeManager() {
  const [plateTypes, setPlateTypes] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPlateTypes();
  }, []);

  const fetchPlateTypes = async () => {
    try {
      const res = await axios.get('http://localhost:8081/api/platetype/getall');
      setPlateTypes(res.data);
      setError('');
    } catch (err) {
      console.error('Error fetching plate types:', err);
      setError('❌ Failed to fetch plate types.');
    }
  };

  const deletePlateType = async (id) => {
    if (!window.confirm('Are you sure you want to delete this plate type?')) return;

    try {
      await axios.delete(`http://localhost:8081/api/platetype/delete/${id}`);
      setMessage('✅ Plate type deleted successfully!');
      fetchPlateTypes();
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to delete plate type.';
      setError(`❌ ${errMsg}`);
    }
  };

  const handleOpenAddPage = () => {
    window.open('/addPlateType', '_blank'); // Adjust the path as per your routing setup
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <button onClick={handleOpenAddPage}>➕ Add New Plate Type</button>

      {message && <p style={{ marginTop: '10px', color: message.startsWith('✅') ? 'green' : 'red' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h3 style={{ marginTop: '30px' }}>All Plate Types</h3>
      {plateTypes.length === 0 && !error ? (
        <p>No plate types found.</p>
      ) : (
        <ul>
          {plateTypes.map((plateType) => (
            <li key={plateType.plateTypeId}>
              <strong>ID:</strong> {plateType.plateTypeId} &nbsp;
              <strong>Name:</strong> {plateType.typeName} &nbsp;
              <button onClick={() => deletePlateType(plateType.plateTypeId)}>
                <i className="fa-regular fa-trash-can"></i>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PlateTypeManager;
