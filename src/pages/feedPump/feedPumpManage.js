import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../../components/loader';

function FeedPumpManagement() {
  const [pumps, setPumps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPumps();
  }, []);

  const fetchPumps = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8081/api/feed-pumps/getall');
      setPumps(response.data);
      setError('');
    } catch (err) {
      setError('❌ Failed to fetch feed pumps');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddPage = () => {
    window.open('/add-feed-pump', '_blank');
  };

  const handleEditPump = (id) => {
    window.open(`/update-feed-pump/${id}`, '_blank');
  };

  const handleDeletePump = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feed pump?')) return;
    try {
      await axios.delete(`http://localhost:8081/api/feed-pumps/${id}`);
      setMessage('✅ Feed Pump deleted successfully!');
      fetchPumps();
    } catch (err) {
      setError('❌ Failed to delete feed pump');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Feed Pump Management</h2>

      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <Loader />}

      <button onClick={handleOpenAddPage} style={{ marginLeft: 'auto', display: 'block' }}>
        Add New Feed Pump
      </button>

      {!loading && pumps.length > 0 && (
        <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%', marginTop: '20px' }}>
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Press Size</th>
              <th>Chamber Ranges</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pumps.map((pump, idx) => (
              <tr key={pump.id}>
                <td>{idx + 1}</td>
                <td>{pump.pressSize}</td>
                <td>
                  {pump.chamberRanges.map((cr, i) => (
                    <div key={i}>
                      <strong>{cr.rangeLabel}:</strong> {cr.flowRate} LPM
                    </div>
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

      {!loading && pumps.length === 0 && <p>No feed pumps found.</p>}
    </div>
  );
}

export default FeedPumpManagement;
