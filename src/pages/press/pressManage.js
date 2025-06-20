import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../../components/loader';

function PressManagement() {
  const [presses, setPresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPresses();
  }, []);

  const fetchPresses = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8081/api/press/getAll');
      setPresses(response.data);
      setError('');
    } catch (err) {
      setError('❌ Failed to fetch press configurations');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePress = async (id) => {
    if (!window.confirm('Are you sure you want to delete this press?')) return;
    setLoading(true);
    try {
      await axios.delete(`http://localhost:8081/api/press/${id}`);
      setMessage('✅ Press deleted successfully!');
      fetchPresses();
    } catch (err) {
      setError('❌ Failed to delete press');
    } finally {
      setLoading(false);
    }
  };

  const handleEditPress = (id) => {
    window.open(`/update-press/${id}`, '_blank');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Press Configuration Management</h2>
      
      {loading && <Loader />}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && (
        <>
          <button onClick={() => window.open('/add-press', '_blank')} style={{ marginBottom: '10px' }}>
            ➕ Add New Press
          </button>

          {presses.length > 0 ? (
            <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>Sr. No.</th>
                  <th>Press Size</th>
                  <th>Max Chamber</th>
                  <th>Cake Air Time</th>
                  <th>CW Flow Rate</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {presses.map((press, idx) => (
                  <tr key={press.pressId}>
                    <td>{idx + 1}</td>
                    <td>{press.pressSize}</td>
                    <td>{press.maxChamber}</td>
                    <td>{press.cakeAirT}</td>
                    <td>{press.cwFlowRate}</td>
                    <td>
                      <button onClick={() => handleDeletePress(press.pressId)} style={{ color: 'red' }}>
                        Delete
                      </button>
                      <button onClick={() => handleEditPress(press.pressId)} style={{ color: 'blue', marginLeft: '10px' }}>
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No press configurations found.</p>
          )}
        </>
      )}
    </div>
  );
}

export default PressManagement;
