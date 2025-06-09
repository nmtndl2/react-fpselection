import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../../components/loader';

function PlateManagement() {
  const [plates, setPlates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [editingPlate, setEditingPlate] = useState(null);
  const [formData, setFormData] = useState({
    plateType: '',
    pressSize: '',
    volume: '',
    filtrationArea: '',
    cakeThk: '',
    finalCakeThk: ''
  });

  useEffect(() => {
    fetchPlates();
  }, []);

  const fetchPlates = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8081/api/plate/getall');
      setPlates(response.data);
      setError('');
    } catch (err) {
      setError('❌ Failed to fetch plates');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddPage = () => {
    window.open('/add-plate', '_blank');
  };

  const handleDeletePlate = async (id) => {
    if (!window.confirm('Are you sure you want to delete this plate?')) return;
    try {
      await axios.delete(`http://localhost:8081/api/plate/delete/${id}`);
      setMessage('✅ Plate deleted successfully!');
      fetchPlates();
    } catch (err) {
      setError('❌ Failed to delete plate');
    }
  };

  const handleEditPlate = (id) => {
  window.open(`/update-plate/${id}`, '_blank');
};

  const handleUpdatePlate = async () => {
    try {
      await axios.put(`http://localhost:8081/api/plate/updateplate/${editingPlate}`, formData);
      setMessage('✅ Plate updated successfully!');
      setEditingPlate(null);
      setFormData({});
      fetchPlates();
    } catch (err) {
      setError('❌ Failed to update plate');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Plate Management</h2>

      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {loading && <Loader />}

      <button onClick={handleOpenAddPage} style={{ marginLeft: 'auto', display: 'block' }}>
        Add New Plate Type
      </button>

      {/* Plate Table */}
      {!loading && plates.length > 0 && (
        <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Plate Type</th>
              <th>Press Size</th>
              <th>Volume</th>
              <th>Filtration Area</th>
              <th>Cake Thickness</th>
              <th>Final Cake Thickness</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {plates.map((plate, idx) => (
              <tr key={plate.plateId}>
                <td>{idx + 1}</td>
                <td>{plate.plateType}</td>
                <td>{plate.pressSize}</td>
                <td>{plate.volume}</td>
                <td>{plate.filtrationArea}</td>
                <td>{plate.cakeThk}</td>
                <td>{plate.finalCakeThk}</td>
                <td>
                  <button onClick={() => handleDeletePlate(plate.plateId)} style={{ color: 'red' }}>
                    <i className="fa-regular fa-trash-can"></i>
                  </button>
                  <button onClick={() => handleEditPlate(plate.plateId)} style={{ color: 'blue', marginLeft: '10px' }}>
                    ✏️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && plates.length === 0 && <p>No plates found.</p>}

      {/* Edit Form */}
      {editingPlate && (
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
          <h3>Update Plate</h3>
          <input name="plateType" value={formData.plateType} onChange={handleChange} placeholder="Plate Type" />
          <input name="pressSize" value={formData.pressSize} onChange={handleChange} placeholder="Press Size" />
          <input name="volume" value={formData.volume} onChange={handleChange} placeholder="Volume" />
          <input name="filtrationArea" value={formData.filtrationArea} onChange={handleChange} placeholder="Filtration Area" />
          <input name="cakeThk" value={formData.cakeThk} onChange={handleChange} placeholder="Cake Thickness" />
          <input name="finalCakeThk" value={formData.finalCakeThk} onChange={handleChange} placeholder="Final Cake Thickness" />
          <br />
          <button onClick={handleUpdatePlate} style={{ marginTop: '10px' }}>Update</button>
          <button onClick={() => setEditingPlate(null)} style={{ marginLeft: '10px' }}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default PlateManagement;
