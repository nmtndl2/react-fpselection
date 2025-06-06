import React, { useState, useEffect } from 'react';
import axios from 'axios';

function GetAllPlateTypes() {
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
    window.open('/input/add-plate-type', '_blank');
  };

  return (
    <div style={{ marginTop: '20px' }}>
      {message && <p style={{ marginTop: '10px', color: message.startsWith('✅') ? 'green' : 'red' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h3 style={{ marginTop: '30px' }}>All Plate Types</h3>
      <button onClick={handleOpenAddPage} style={{ marginLeft: 'auto', display: 'block' }}>Add New Plate Type</button>

      {plateTypes.length === 0 && !error ? (
        <p>No plate types found.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ marginTop: '10px', borderCollapse: 'collapse', width: '100%' }}>
          <thead style={{ backgroundColor: '#f2f2f2' }}>
            <tr>
              <th>Sr. No.</th>
              <th>Plate Type Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {plateTypes.map((plateType, index) => (
              <tr key={plateType.plateTypeId}>
                <td>{index + 1}</td>
                <td>{plateType.typeName}</td>
                <td>
                  <button onClick={() => deletePlateType(plateType.plateTypeId)} style={{ color: '#000000' , backgroundColor:'transparent' }}>
                    <i className="fa-regular fa-trash-can"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default GetAllPlateTypes;
