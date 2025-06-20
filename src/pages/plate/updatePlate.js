import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Loader from '../../components/loader';

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

const groupedFields = {
  'Plate Details': ['pressSize', 'plateType', 'volume'],
  'Filtration Details': ['filtrationArea', 'cakeThk', 'finalCakeThk']
};

function UpdatePlate() {
  const { plateId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    pressSize: '',
    plateType: '',
    volume: '',
    filtrationArea: '',
    cakeThk: '',
    finalCakeThk: ''
  });
  const [plateTypes, setPlateTypes] = useState(       []);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch plate types for dropdown
    axios.get('http://localhost:8081/api/platetype/fetch')
      .then(res => setPlateTypes(res.data))
      .catch(() => setError('❌ Failed to load plate types'));

    // Fetch plate data by ID to prefill form
    const fetchPlate = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:8081/api/plate/get/${plateId}`);
        setFormData(res.data);
      } catch {
        setError('❌ Failed to load plate data');
      } finally {
        setLoading(false);
      }
    };

    fetchPlate();
  }, [plateId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    const isInteger = (val) => /^\d+$/.test(val);
    const isDouble = (val) => /^(\d+(\.\d+)?|\.\d+)$/.test(val);

    if (!formData.pressSize.trim()) newErrors.pressSize = "Press size is required";
    if (!formData.plateType.trim()) newErrors.plateType = "Plate type is required";
    if (!formData.volume.trim()) newErrors.volume = "Volume is required";
    else if (!isInteger(formData.volume)) newErrors.volume = "Volume must be an integer";
    if (!formData.filtrationArea.trim()) newErrors.filtrationArea = "Filtration area is required";
    else if (!isDouble(formData.filtrationArea)) newErrors.filtrationArea = "Filtration area must be a number";
    if (!formData.cakeThk.trim()) newErrors.cakeThk = "Cake thickness is required";
    else if (!isInteger(formData.cakeThk)) newErrors.cakeThk = "Cake thickness must be an integer";
    if (!formData.finalCakeThk.trim()) newErrors.finalCakeThk = "Final cake thickness is required";
    else if (!isInteger(formData.finalCakeThk)) newErrors.finalCakeThk = "Final cake thickness must be an integer";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await axios.put(`http://localhost:8081/api/plate/updateplate/${plateId}`, formData);
      setMessage('✅ Plate updated successfully!');
      setError('');
      setTimeout(() => navigate('/plate-management'), 1500);
    } catch {
      setError('❌ Failed to update plate');
      setMessage('');
    } finally {
      setLoading(false);
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
      <h2>Edit Plate Configuration</h2>

      {loading && <Loader />}
      {message && <div style={{ color: 'green', marginBottom: '10px' }}>{message}</div>}
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      {!loading && (
        <form onSubmit={handleUpdate}>
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
                        value={formData[key]}
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
                        value={formData[key]}
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

          <button type="submit" style={{ marginRight: '10px' }}>Update</button>
          <button type="button" onClick={handleCancel}>Cancel</button>
        </form>
      )}
    </div>
  );
}

export default UpdatePlate;
