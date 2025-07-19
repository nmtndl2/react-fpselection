import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../../components/loader'; // ✅ import loader

const labels = {
  pressSize: 'Press Size',
  sqMaxTMin: 'Max T min',
  sqInletWater: 'Inlet Water',
  flowRate: 'Flow Rate'
};

const placeholders = {
  pressSize: 'e.g., 1500 x 1500',
  sqMaxTMin: 'e.g., 00:25:00',
  sqInletWater: 'e.g., 55',
  flowRate: 'Flow Rate (e.g., 2.0)'
};

const initialFlowRate = { flowRate: '' };

const AddSqueezingPumpForm = () => {
  const [formData, setFormData] = useState({
    pressSize: '',
    sqMaxTMin: '',
    sqInletWater: ''
  });

  const [flowRates, setFlowRates] = useState([initialFlowRate]);
  const [errors, setErrors] = useState({});
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [pressSizes, setPressSizes] = useState([]);
  const [loading, setLoading] = useState(false); // ✅ loader state

  const groupedFields = {
    'Pump Details': ['pressSize', 'sqMaxTMin', 'sqInletWater']
  };

  useEffect(() => {
    const fetchPressSizes = async () => {
      setLoading(true);
      try {
        const plateType = 'Membrane';
        const res = await axios.get('http://localhost:8081/api/plate/fetch/presssize', {
          params: { plateType }
        });
        setPressSizes(res.data);
      } catch (err) {
        console.error('Failed to fetch press sizes', err);
        setPressSizes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPressSizes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleFlowRateChange = (index, value) => {
    const updated = [...flowRates];
    updated[index].flowRate = value;
    setFlowRates(updated);
    setErrors((prev) => ({ ...prev, [`flowRate-${index}`]: null }));
  };

  const addFlowRate = () => setFlowRates([...flowRates, { flowRate: '' }]);

  const removeFlowRate = (index) => {
    const updated = [...flowRates];
    updated.splice(index, 1);
    setFlowRates(updated);
  };

  const validate = () => {
    const newErrors = {};
    const isNumber = (v) => !isNaN(v) && v.trim() !== '';

    if (!formData.pressSize.trim()) newErrors.pressSize = 'Press size is required';
    if (!formData.sqMaxTMin) newErrors.sqMaxTMin = 'Valid Max T min is required';
    if (!isNumber(formData.sqInletWater)) newErrors.sqInletWater = 'Valid Inlet Water is required';

    flowRates.forEach((f, idx) => {
      if (!isNumber(f.flowRate)) {
        // newErrors[`flowRate-${idx}`] = 'Valid flow rate is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        ...formData,
        sqMaxTMin: parseFloat(formData.sqMaxTMin),
        sqInletWater: parseFloat(formData.sqInletWater),
        flowRates: flowRates.map((f) => ({ flowRate: parseFloat(f.flowRate) }))
      };

      const res = await axios.post('http://localhost:8081/api/squeezing/addPump', payload, {
        headers: { 'Content-Type': 'application/json' }
      });

      setResponse(res.data);
      setError(null);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to add squeezing pump configuration.';
      setError(`❌ ${errorMsg}`);
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', marginTop: '40px' }}>
      <h3>Add Squeezing Pump Configuration</h3>

      {loading && <Loader />} {/* ✅ Loader display */}

      {!loading && (
        <form onSubmit={handleSubmit}>
          {Object.entries(groupedFields).map(([groupName, keys]) => (
            <fieldset key={groupName} style={{ marginBottom: '20px' }}>
              <legend><strong>{groupName}</strong></legend>
              {keys.map((key) => (
                key === 'pressSize' ? (
                  <div key={key} style={{ marginBottom: '10px' }}>
                    <label>{labels[key]}</label><br />
                    <select
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      style={errors[key] ? { borderColor: 'red' } : {}}
                    >
                      <option value="" disabled hidden>-- Select Press Size --</option>
                      {pressSizes.map((size, idx) => (
                        <option key={idx} value={size}>{size}</option>
                      ))}
                    </select>
                    {errors[key] && <div style={{ color: 'red', fontSize: '12px' }}>{errors[key]}</div>}
                  </div>
                ) : (
                  <div key={key} style={{ marginBottom: '10px' }}>
                    <label>{labels[key]}</label><br />
                    <input
                      type="text"
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      placeholder={placeholders[key]}
                      style={errors[key] ? { borderColor: 'red' } : {}}
                    />
                    {errors[key] && <div style={{ color: 'red', fontSize: '12px' }}>{errors[key]}</div>}
                  </div>
                )
              ))}
            </fieldset>
          ))}

          <fieldset style={{ marginBottom: '20px' }}>
            <legend><strong>Flow Rates</strong></legend>
            {flowRates.map((f, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <input
                  type="text"
                  placeholder={placeholders.flowRate}
                  value={f.flowRate}
                  onChange={(e) => handleFlowRateChange(index, e.target.value)}
                  style={errors[`flowRate-${index}`] ? { borderColor: 'red' } : {}}
                />
                <button type="button" onClick={() => removeFlowRate(index)} style={{ marginLeft: '10px' }}>
                  X
                </button>
                {errors[`flowRate-${index}`] && (
                  <div style={{ color: 'red', marginLeft: '10px', fontSize: '12px' }}>
                    {errors[`flowRate-${index}`]}
                  </div>
                )}
              </div>
            ))}
            <button type="button" onClick={addFlowRate}>+ Add Flow Rate</button>
          </fieldset>

          <button type="submit">Submit</button>
        </form>
      )}

      {response && <div style={{ color: 'green', marginTop: '10px' }}>✅ Configuration added successfully!</div>}
      {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
    </div>
  );
};

export default AddSqueezingPumpForm;
