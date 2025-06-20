import React, { useState } from 'react';
import axios from 'axios';
import Loader from '../../components/loader'; // ✅ Import Loader

const initialChamberRange = { rangeLabel: '', flowRate: '' };

const AddFeedPumpForm = () => {
  const [pressSize, setPressSize] = useState('');
  const [chamberRanges, setChamberRanges] = useState([initialChamberRange]);
  const [errors, setErrors] = useState({});
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // ✅ Add loading state

  const handlePressSizeChange = (e) => {
    setPressSize(e.target.value);
    setErrors((prev) => ({ ...prev, pressSize: null }));
  };

  const handleRangeChange = (index, field, value) => {
    const updatedRanges = [...chamberRanges];
    updatedRanges[index][field] = value;
    setChamberRanges(updatedRanges);
    setErrors((prev) => ({ ...prev, [`range-${index}-${field}`]: null }));
  };

  const addRange = () => {
    setChamberRanges([...chamberRanges, { flowRate: '' }]);
  };

  const removeRange = (index) => {
    const updated = [...chamberRanges];
    updated.splice(index, 1);
    setChamberRanges(updated);
  };

  const validate = () => {
    const newErrors = {};
    if (!pressSize.trim()) {
      newErrors.pressSize = 'Press size is required';
    }

    chamberRanges.forEach((range, idx) => {
      if (!range.rangeLabel.trim()) {
        newErrors[`range-${idx}-rangeLabel`] = 'Range label is required';
      }
      if (!range.flowRate || isNaN(range.flowRate)) {
        newErrors[`range-${idx}-flowRate`] = 'Valid flow rate is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true); // ✅ Start loader
    try {
      const payload = {
        pressSize,
        chamberRanges: chamberRanges.map((r) => ({
          rangeLabel: r.rangeLabel,
          flowRate: parseFloat(r.flowRate)
        }))
      };

      const res = await axios.post('http://localhost:8081/api/feed-pumps', payload, {
        headers: { 'Content-Type': 'application/json' }
      });

      setResponse(res.data);
      setError(null);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to add feed pump configuration.';
      setError(`❌ ${errorMsg}`);
      setResponse(null);
    } finally {
      setLoading(false); // ✅ Stop loader
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', marginTop: '40px' }}>
      <h3>Add Feed Pump Configuration</h3>

      {loading && <Loader />} {/* ✅ Show loader when loading */}

      {!loading && (
        <>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label>
                Press Size:
                <input
                  type="text"
                  value={pressSize}
                  onChange={handlePressSizeChange}
                  placeholder="e.g., 1500 x 1500"
                  style={errors.pressSize ? { borderColor: 'red' } : {}}
                />
              </label>
              {errors.pressSize && <div style={{ color: 'red' }}>{errors.pressSize}</div>}
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4>Chamber Ranges</h4>
                <button type="button" onClick={addRange} style={{ marginBottom: '20px' }}>
                  + Add Range
                </button>
              </div>

              {chamberRanges.map((range, index) => {
                const start = index === 0 ? 0 : chamberRanges
                  .slice(0, index)
                  .reduce((acc, r, i) => {
                    const prevRange = chamberRanges[i];
                    const prevEnd = prevRange?.rangeLabel?.split('-')[1];
                    return prevEnd ? parseInt(prevEnd) + 1 : acc + 30;
                  }, 0);
                const end = start + 29;
                const rangePlaceholder = `${start}-${end}`;

                return (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <input
                      type="text"
                      placeholder={`(e.g., ${rangePlaceholder})`}
                      value={range.rangeLabel}
                      onChange={(e) => handleRangeChange(index, 'rangeLabel', e.target.value)}
                      style={errors[`range-${index}-rangeLabel`] ? { borderColor: 'red' } : {}}
                    />
                    <input
                      type="text"
                      placeholder="Flow Rate (e.g., 10)"
                      value={range.flowRate}
                      onChange={(e) => handleRangeChange(index, 'flowRate', e.target.value)}
                      style={errors[`range-${index}-flowRate`] ? { borderColor: 'red', marginLeft: '10px' } : { marginLeft: '10px' }}
                    />
                    <button type="button" onClick={() => removeRange(index)} style={{ marginLeft: '10px' }}>
                      X
                    </button>
                  </div>
                );
              })}
            </div>

            <br />
            <button type="submit">Submit</button>
          </form>

          {response && (
            <div style={{ color: 'green', marginTop: '10px' }}>
              ✅ Feed pump configuration added successfully!
            </div>
          )}
          {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
        </>
      )}
    </div>
  );
};

export default AddFeedPumpForm;
