import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../../components/loader';

function ManageSqueezePump() {
  const [pumps, setPumps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSqueezePumps();
  }, []);

  const fetchSqueezePumps = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8081/api/squeezing/getall');
      setPumps(res.data);
      setError('');
    } catch (err) {
      setError('❌ Failed to fetch squeezing pumps');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddPage = () => {
    window.open('/add-squeeze-pump', '_blank');
  };

  const handleEditPump = (id) => {
    window.open(`/update-sq-pump/${id}`, '_blank');
  };

  const handleDeletePump = async (id) => {
    if (!window.confirm('Are you sure you want to delete this squeezing pump?')) return;
    try {
      await axios.delete(`http://localhost:8081/api/squeezing/deletePump/${id}`);
      setMessage('✅ Squeeze Pump deleted successfully!');
      fetchSqueezePumps();
    } catch (err) {
      setError('❌ Failed to delete squeezing pump');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Squeeze Pump Management</h2>

      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <Loader />}

      <button onClick={handleOpenAddPage} style={{ marginLeft: 'auto', display: 'block' }}>
        Add New Squeeze Pump
      </button>

      {!loading && pumps.length > 0 && (
        <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%', marginTop: '20px' }}>
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Press Size</th>
              <th>Max T min</th>
              <th>Inlet Water</th>
              <th>Flow Rates</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pumps.map((pump, idx) => (
              <tr key={pump.id}>
                <td>{idx + 1}</td>
                <td>{pump.pressSize}</td>
                <td>{pump.sqMaxTMin}</td>
                <td>{pump.sqInletWater}</td>
                <td>
                  {pump.flowRates.map((fr, i) => (
                    <div key={i}>{fr.flowRate} LPM</div>
                  ))}
                </td>
                <td>
                  <button onClick={() => handleDeletePump(pump.id)} style={{ color: 'red' }}>
                    <i className="fa-regular fa-trash-can"></i>
                  </button>
                  <button onClick={() => handleEditPump(pump.id)} style={{ color: '#FFFFFF', marginLeft: '10px' }}>
                    <i className="fa-light fa-pen-to-square"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && pumps.length === 0 && <p>No squeeze pumps found.</p>}
    </div>
  );
}

export default ManageSqueezePump;
