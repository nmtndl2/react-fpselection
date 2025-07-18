import React, { useEffect, useState } from 'react';
import axios from 'axios';

function DeletePlateTypeList() {
  const [plateTypes, setPlateTypes] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPlateTypes();
  }, []);

  const fetchPlateTypes = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/platetype/getall');
      setPlateTypes(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching plate types:', err);
      setError('Failed to fetch plate types.');
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

  return (
    <div style={{ marginTop: '20px' }}>
      <h3>Delete Plate Types</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {plateTypes.length === 0 ? (
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

export default DeletePlateTypeList;
