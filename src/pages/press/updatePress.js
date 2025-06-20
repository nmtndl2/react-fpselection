import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../../components/loader';
import config from './addPressConfig';

function UpdatePress() {
  const { pressId } = useParams();
  const navigate = useNavigate();

  const { initialState, groupedFields, labels, placeholders } = config;
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [pressSizes, setPressSizes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [sizesRes, pressRes] = await Promise.all([
          axios.get('http://localhost:8081/api/plate/fetchAllPressSize'),
          axios.get(`http://localhost:8081/api/press/get/${pressId}`)
        ]);
        setPressSizes(sizesRes.data);
        setFormData(pressRes.data);
      } catch (err) {
        setError('❌ Failed to load press data or sizes');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [pressId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => {
      const updated = { ...prev, [name]: newValue };
      if (name === 'cwAvailable' && newValue) {
        updated.psAvailable = true;
        updated.dtAvailable = true;
      }
      return updated;
    });

    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    const requiredFields = ['pressSize', 'maxChamber', 'cakeAirT', 'cyFwdT', 'cyRevT', 'cwFlowRate'];

    requiredFields.forEach((field) => {
      if (!formData[field]?.toString().trim()) newErrors[field] = 'This field is required';
    });

    if (formData.dtAvailable) {
      ['dtOpenT', 'dtClosedT'].forEach((field) => {
        if (!formData[field]?.toString().trim()) newErrors[field] = 'Required when DT is available';
      });
    }

    if (formData.psAvailable) {
      ['psFwdFPlateT', 'psFwdT', 'psFwdDT', 'psRevT', 'psRevDT'].forEach((field) => {
        if (!formData[field]?.toString().trim()) newErrors[field] = 'Required when PS is available';
      });
    }

    if (formData.cwAvailable) {
      ['cwFwdT', 'cwFwdDT', 'cwRevT', 'cwRevDT', 'cwDownT', 'cwDownDT', 'cwUpT', 'cwUpDT'].forEach((field) => {
        if (!formData[field]?.toString().trim()) newErrors[field] = 'Required when CW is available';
      });
    }

    if (formData.maxChamber && !/^\d+$/.test(formData.maxChamber)) {
      newErrors.maxChamber = 'Must be an integer';
    }

    if (formData.cwFlowRate && isNaN(parseFloat(formData.cwFlowRate))) {
      newErrors.cwFlowRate = 'Must be a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const sanitizedData = { ...formData };

    if (!formData.dtAvailable) {
      sanitizedData.dtOpenT = null;
      sanitizedData.dtClosedT = null;
    }
    if (!formData.psAvailable) {
      sanitizedData.psFwdFPlateT = null;
      sanitizedData.psFwdT = null;
      sanitizedData.psFwdDT = null;
      sanitizedData.psRevT = null;
      sanitizedData.psRevDT = null;
    }
    if (!formData.cwAvailable) {
      sanitizedData.cwFwdT = null;
      sanitizedData.cwFwdDT = null;
      sanitizedData.cwRevT = null;
      sanitizedData.cwRevDT = null;
      sanitizedData.cwDownT = null;
      sanitizedData.cwDownDT = null;
      sanitizedData.cwUpT = null;
      sanitizedData.cwUpDT = null;
    }

    try {
      await axios.put(
        `http://localhost:8081/api/press/updatePress/${pressId}`,
        sanitizedData,
        { headers: { 'Content-Type': 'application/json' } }
      );
      setMessage('✅ Press updated successfully!');
      setError('');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update press.';
      setError(`❌ ${msg}`);
      setMessage('');
    }
  };

  const handleCancel = () => {
    window.close();
    setTimeout(() => {
      if (!window.closed) {
        navigate(-1);
      }
    }, 100);
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', marginTop: '40px' }}>
      <h2>Edit Press Configuration</h2>

      {loading && <Loader />}
      {message && <div style={{ color: 'green', marginBottom: '10px' }}>{message}</div>}
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      {!loading && (
        <form onSubmit={handleUpdate}>
          {Object.entries(groupedFields).map(([section, fields]) => (
            <fieldset key={section} style={{ marginBottom: '20px' }}>
              <legend><strong>{section}</strong></legend>
              {fields.map((key) => {
                if (
                  (key.startsWith('dt') && key !== 'dtAvailable' && !formData.dtAvailable) ||
                  (key.startsWith('ps') && key !== 'psAvailable' && !formData.psAvailable) ||
                  (key.startsWith('cw') && key !== 'cwAvailable' && !formData.cwAvailable)
                ) return null;

                const isCheckbox = typeof initialState[key] === 'boolean';

                return (
                  <div key={key} style={{ marginBottom: '10px' }}>
                    <label>
                      {labels[key] || key}:{' '}
                      {key === 'pressSize' ? (
                        <select
                          name="pressSize"
                          value={formData.pressSize}
                          onChange={handleChange}
                          style={errors.pressSize ? { borderColor: 'red' } : {}}
                        >
                          <option value="">Select Press Size</option>
                          {pressSizes.map((size, i) => (
                            <option key={i} value={size}>{size}</option>
                          ))}
                        </select>
                      ) : isCheckbox ? (
                        <input
                          type="checkbox"
                          name={key}
                          checked={formData[key]}
                          onChange={handleChange}
                        />
                      ) : (
                        <input
                          type="text"
                          name={key}
                          value={formData[key] || ''}
                          onChange={handleChange}
                          placeholder={placeholders[key] || `Enter ${key}`}
                          style={errors[key] ? { borderColor: 'red' } : {}}
                        />
                      )}
                    </label>
                    {errors[key] && (
                      <div style={{ color: 'red', fontSize: '12px' }}>{errors[key]}</div>
                    )}
                  </div>
                );
              })}
            </fieldset>
          ))}
          <button type="submit" style={{ marginRight: '10px' }}>Update</button>
          <button type="button" onClick={handleCancel}>Cancel</button>
        </form>
      )}
    </div>
  );
}

export default UpdatePress;
