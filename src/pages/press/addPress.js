import React, { useState } from 'react';
import axios from 'axios';

const initialState = {
  pressSize: '',
  maxChamber: '',
  cakeAirT: '',
  cyFwdT: '',
  cyRevT: '',
  dtAvailable: false,
  dtOpenT: '',
  dtClosedT: '',
  psAvailable: false,
  psFwdFPlateT: '',
  psFwdT: '',
  psFwdDT: '',
  psRevT: '',
  psRevDT: '',
  cwAvailable: false,
  cwFwdT: '',
  cwFwdDT: '',
  cwRevT: '',
  cwRevDT: '',
  cwDownT: '',
  cwDownDT: '',
  cwUpT: '',
  cwUpDT: '',
  cwFlowRate: ''
};

const placeholders = {
  pressSize: 'e.g., 1000 x 1000',
  maxChamber: 'e.g., 70',
  cakeAirT: 'HH:MM:SS',
  cyFwdT: 'HH:MM:SS',
  cyRevT: 'HH:MM:SS',
  dtOpenT: 'HH:MM:SS',
  dtClosedT: 'HH:MM:SS',
  psFwdFPlateT: 'HH:MM:SS',
  psFwdT: 'HH:MM:SS',
  psFwdDT: 'HH:MM:SS',
  psRevT: 'HH:MM:SS',
  psRevDT: 'HH:MM:SS',
  cwFwdT: 'HH:MM:SS',
  cwFwdDT: 'HH:MM:SS',
  cwRevT: 'HH:MM:SS',
  cwRevDT: 'HH:MM:SS',
  cwDownT: 'HH:MM:SS',
  cwDownDT: 'HH:MM:SS',
  cwUpT: 'HH:MM:SS',
  cwUpDT: 'HH:MM:SS',
  cwFlowRate: 'e.g., 10.0'
};


const labels = {
  pressSize: 'Press Size',
  maxChamber: 'Max Chamber',
  cakeAirT: 'Cake Air Time',
  cyFwdT: 'Cylindrical Forward Time',
  cyRevT: 'Cylindrical Reverse Time',
  dtAvailable: 'DT Available',
  dtOpenT: 'DT Open Time',
  dtClosedT: 'DT Closed Time',
  psAvailable: 'PS Available',
  psFwdFPlateT: 'PS Forward First Plate Time',
  psFwdT: 'PS Forward Time',
  psFwdDT: 'PS Forward Delay Time',
  psRevT: 'PS Reverse Time',
  psRevDT: 'PS Reverse Delay Time',
  cwAvailable: 'CW Available',
  cwFwdT: 'CW Forward Time',
  cwFwdDT: 'CW Forward Delay Time',
  cwRevT: 'CW Reverse Time',
  cwRevDT: 'CW Reverse Delay Time',
  cwDownT: 'CW Down Time',
  cwDownDT: 'CW Down Delay Time',
  cwUpT: 'CW Up Time',
  cwUpDT: 'CW Up Delay Time',
  cwFlowRate: 'CW Flow Rate',
};


const groupedFields = {
  'Press Details': ['pressSize', 'maxChamber', 'cakeAirT', 'cyFwdT', 'cyRevT'],
  'DT Details': ['dtAvailable', 'dtOpenT', 'dtClosedT'],
  'PS Details': ['psAvailable', 'psFwdFPlateT', 'psFwdT', 'psFwdDT', 'psRevT', 'psRevDT'],
  'CW Details': ['cwAvailable', 'cwFwdT', 'cwFwdDT', 'cwRevT', 'cwRevDT', 'cwDownT', 'cwDownDT', 'cwUpT', 'cwUpDT', 'cwFlowRate']
};

const AddPressForm = () => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
  const { name, value, type, checked } = e.target;
  const newValue = type === 'checkbox' ? checked : value;

  setFormData((prev) => {
    const updated = { ...prev, [name]: newValue };

    // Auto-set psAvailable and dtAvailable to true if cwAvailable is checked
    if (name === 'cwAvailable' && newValue === true) {
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

    // Always required fields
    requiredFields.forEach((field) => {
      if (!formData[field].toString().trim()) {
        newErrors[field] = 'This field is required';
      }
    });

    // Conditionally required fields
    if (formData.dtAvailable) {
      ['dtOpenT', 'dtClosedT'].forEach((field) => {
        if (!formData[field].toString().trim()) {
          newErrors[field] = 'This field is required when DT is available';
        }
      });
    }

    if (formData.psAvailable) {
      ['psFwdFPlateT', 'psFwdT', 'psFwdDT', 'psRevT', 'psRevDT'].forEach((field) => {
        if (!formData[field].toString().trim()) {
          newErrors[field] = 'This field is required when PS is available';
        }
      });
    }

    if (formData.cwAvailable) {
      [
        'cwFwdT', 'cwFwdDT', 'cwRevT', 'cwRevDT',
        'cwDownT', 'cwDownDT', 'cwUpT', 'cwUpDT'
      ].forEach((field) => {
        if (!formData[field].toString().trim()) {
          newErrors[field] = 'This field is required when CW is available';
        }
      });
    }

    // Specific validations
    if (formData.maxChamber && !/^\d+$/.test(formData.maxChamber)) {
      newErrors.maxChamber = 'Must be an integer';
    }

    if (formData.cwFlowRate && isNaN(parseFloat(formData.cwFlowRate))) {
      newErrors.cwFlowRate = 'Must be a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Prepare data with conditional nulls
    const sanitizedData = { ...formData };

    if (!formData.dtAvailable) {
      sanitizedData.dtAvailable = false;
      sanitizedData.dtOpenT = null;
      sanitizedData.dtClosedT = null;
    }

    if (!formData.psAvailable) {
      sanitizedData.psAvailable = false;
      sanitizedData.psFwdFPlateT = null;
      sanitizedData.psFwdT = null;
      sanitizedData.psFwdDT = null;
      sanitizedData.psRevT = null;
      sanitizedData.psRevDT = null;
    }

    if (!formData.cwAvailable) {
      sanitizedData.cwAvailable = false;
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
      const res = await axios.post(
        'http://localhost:8081/api/press/addPress',
        sanitizedData,
        { headers: { 'Content-Type': 'application/json' } }
      );
      setResponse(res.data);
      setError(null);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to add press configuration.';
      setError(`❌ ${errorMsg}`);
      setResponse(null);
    }
  };


  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', marginTop: '40px' }}>
      <h3>Add Press Configuration</h3>
      <form onSubmit={handleSubmit}>
        {Object.entries(groupedFields).map(([section, fields]) => (
          <fieldset key={section} style={{ marginBottom: '20px' }}>
            <legend style={{ fontWeight: 'bold', marginBottom: '10px' }}>{section}</legend>
            {fields.map((key) => {
              // Conditionally skip rendering based on availability checkboxes
              if (
                (key.startsWith('dt') && key !== 'dtAvailable' && !formData.dtAvailable) ||
                (key.startsWith('ps') && key !== 'psAvailable' && !formData.psAvailable) ||
                (key.startsWith('cw') && key !== 'cwAvailable' && !formData.cwAvailable)
              ) {
                return null;
              }

              const isCheckbox = typeof initialState[key] === 'boolean';
              return (
                <div key={key} style={{ marginBottom: '10px' }}>
                  <label>
                    {labels[key] || key}:
                    {isCheckbox ? (
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
                        value={formData[key]}
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

        <button type="submit" style={{ padding: '10px 20px', fontWeight: 'bold' }}>Submit</button>
      </form>

      {response && (
        <div style={{ color: 'green', marginTop: '10px' }}>
          ✅ Press added successfully!
        </div>
      )}
      {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
    </div>
  );
};

export default AddPressForm;
