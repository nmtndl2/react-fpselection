import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Labels and placeholders
const labels = {
  pressSize: 'Press Size',
  plateType: 'Plate Type',
  volume: 'Volume',
  filtrationArea: 'Filtration Area',
  cakeThk: 'Cake Thickness',
  finalCakeThk: 'Final Cake Thickness'
};

const placeholders = {
  pressSize: 'Enter press size',
  volume: 'Enter volume',
  filtrationArea: 'Enter filtration area',
  cakeThk: 'Enter cake thickness',
  finalCakeThk: 'Enter final cake thickness'
};

const AddPlateForm = () => {
  const [plateData, setPlateData] = useState({
    pressSize: '',
    plateType: '',
    volume: '',
    filtrationArea: '',
    cakeThk: '',
    finalCakeThk: ''
  });

  const [plateTypes, setPlateTypes] = useState([]);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  const groupedFields = {
    'Plate Details': ['pressSize', 'plateType', 'volume'],
    'Filtration Details': ['filtrationArea', 'cakeThk', 'finalCakeThk']
  };

  useEffect(() => {
    axios.get('http://localhost:8081/api/platetype/fetch')
      .then(res => setPlateTypes(res.data))
      .catch(err => console.error('Error fetching plate types:', err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlateData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validate = () => {
  const newErrors = {};
  const isInteger = (value) => /^\d+$/.test(value);

  if (!plateData.pressSize.trim()) newErrors.pressSize = "Press size is required";
  if (!plateData.plateType.trim()) newErrors.plateType = "Plate type is required";
  if (!plateData.volume.trim()) newErrors.volume = "Volume is required";
  else if (!isInteger(plateData.volume)) newErrors.volume = "Volume must be an integer";
  if (!plateData.filtrationArea.trim()) newErrors.filtrationArea = "Filtration area is required";
  else if (!isInteger(plateData.filtrationArea)) newErrors.filtrationArea = "Filtration area must be an integer";
  if (!plateData.cakeThk.trim()) newErrors.cakeThk = "Cake thickness is required";
  else if (!isInteger(plateData.cakeThk)) newErrors.cakeThk = "Cake thickness must be an integer";
  if (!plateData.finalCakeThk.trim()) newErrors.finalCakeThk = "Final cake thickness is required";
  else if (!isInteger(plateData.finalCakeThk)) newErrors.finalCakeThk = "Final cake thickness must be an integer";

  setErrors(newErrors); // Set all errors
  return Object.keys(newErrors).length === 0; // Valid if no errors
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const res = await axios.post(
        'http://localhost:8081/api/plate/addplate',
        plateData,
        { headers: { 'Content-Type': 'application/json' } }
      );
      setResponse(res.data);
      setError(null);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to add plate configuration.';
      setError(`❌ ${errorMsg}`);
      setResponse(null);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', marginTop: '40px' }}>
      <h3>Add Plate Configuration</h3>
      <form onSubmit={handleSubmit}>
        {Object.entries(groupedFields).map(([groupName, keys]) => (
          <fieldset key={groupName} style={{ marginBottom: '20px' }}>
            <legend><strong>{groupName}</strong></legend>
            {keys.map(key => (
              <div key={key} style={{ marginBottom: '10px' }}>
                <label>
                  {labels[key] || key}:
                  {key === 'plateType' ? (
                    <select
                      name={key}
                      value={plateData[key]}
                      onChange={handleChange}
                      style={errors[key] ? { borderColor: 'red' } : {}}
            
                    >
                      <option value="" disabled hidden>Select Plate Type</option>
                      {plateTypes.map(pt => (
                        <option key={pt.plateTypeId} value={pt.typeName}>
                          {pt.typeName}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      name={key}
                      value={plateData[key]}
                      onChange={handleChange}
                      placeholder={placeholders[key] || `Enter ${labels[key] || key}`}
                      style={errors[key] ? { borderColor: 'red' } : {}}
                   
                    />
                  )}
                </label>
                {errors[key] && <div style={{ color: 'red', fontSize: '12px' }}>{errors[key]}</div>}
              </div>
            ))}
          </fieldset>
        ))}

        <button type="submit">Submit</button>
      </form>

      {response && <div style={{ color: 'green', marginTop: '10px' }}>✅ Plate added successfully!</div>}
      {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
    </div>
  );
};

export default AddPlateForm;
