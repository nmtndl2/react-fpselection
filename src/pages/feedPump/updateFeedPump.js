import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Loader from '../../components/loader';

function UpdateFeedPump() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ pressSize: '', chamberRanges: [] });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchPump = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:8081/api/feed-pumps/get/${id}`);
        setFormData(res.data);
      } catch (err) {
        setError('❌ Failed to load feed pump data');
      } finally {
        setLoading(false);
      }
    };

    fetchPump();
  }, [id]);

  const handleChange = (e, index, field) => {
    const { value } = e.target;
    if (field === 'pressSize') {
      setFormData(prev => ({ ...prev, pressSize: value }));
    } else {
      const newRanges = [...formData.chamberRanges];
      newRanges[index][field] = value;
      setFormData(prev => ({ ...prev, chamberRanges: newRanges }));
    }
  };

  const handleAddRange = () => {
    setFormData(prev => ({
      ...prev,
      chamberRanges: [...prev.chamberRanges, { rangeLabel: '', flowRate: '' }]
    }));
  };

  const handleRemoveRange = (index) => {
    const updatedRanges = [...formData.chamberRanges];
    updatedRanges.splice(index, 1);
    setFormData(prev => ({ ...prev, chamberRanges: updatedRanges }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.pressSize) newErrors.pressSize = "Press size is required";

    formData.chamberRanges.forEach((range, idx) => {
      if (!range.rangeLabel) newErrors[`rangeLabel-${idx}`] = 'Range label required';
      if (!range.flowRate || isNaN(range.flowRate)) newErrors[`flowRate-${idx}`] = 'Flow rate must be a number';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await axios.put(`http://localhost:8081/api/feed-pumps/update/${id}`, formData);
      setMessage('✅ Feed Pump updated successfully!');
      setError('');
      setTimeout(() => navigate('/feed-pumps'), 1500);
    } catch {
      setError('❌ Failed to update feed pump');
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Edit Feed Pump</h2>

      {loading && <Loader />}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && (
        <form onSubmit={handleUpdate}>
          <div>
            <label>Press Size:</label>
            <input
              type="text"
              value={formData.pressSize}
              onChange={(e) => handleChange(e, null, 'pressSize')}
              style={errors.pressSize ? { borderColor: 'red' } : {}}
            />
            {errors.pressSize && <div style={{ color: 'red' }}>{errors.pressSize}</div>}
          </div>

          <h3>Chamber Ranges</h3>
          {formData.chamberRanges.map((range, idx) => (
            <div key={idx}>
              <input
                type="text"
                placeholder="Range Label (e.g., 0-5)"
                value={range.rangeLabel}
                onChange={(e) => handleChange(e, idx, 'rangeLabel')}
                style={errors[`rangeLabel-${idx}`] ? { borderColor: 'red' } : {}}
              />
              <input
                type="text"
                placeholder="Flow Rate"
                value={range.flowRate}
                onChange={(e) => handleChange(e, idx, 'flowRate')}
                style={errors[`flowRate-${idx}`] ? { borderColor: 'red' } : {}}
              />
              <button type="button" onClick={() => handleRemoveRange(idx)}>Remove</button>

              {errors[`rangeLabel-${idx}`] && <div style={{ color: 'red' }}>{errors[`rangeLabel-${idx}`]}</div>}
              {errors[`flowRate-${idx}`] && <div style={{ color: 'red' }}>{errors[`flowRate-${idx}`]}</div>}
            </div>
          ))}

          <button type="button" onClick={handleAddRange}>Add Chamber Range</button>

          <div style={{ marginTop: '20px' }}>
            <button type="submit">Update</button>
            <button type="button" onClick={() => navigate(-1)}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}

export default UpdateFeedPump;
