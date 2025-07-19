import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Loader from '../../components/loader';

const labels = {
    pressSize: 'Press Size',
    sqMaxTMin: 'Max T min',
    sqInletWater: 'Inlet Water',
    flowRate: 'Flow Rate'
};

const placeholders = {
    pressSize: 'e.g., 1500 x 1500',
    sqMaxTMin: 'e.g., 25',
    sqInletWater: 'e.g., 55//',
    flowRate: 'Flow Rate (e.g., 2.0)'
};

const UpdateSqueezePumpForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        pressSize: '',
        sqMaxTMin: '',
        sqInletWater: ''
    });
    const [flowRates, setFlowRates] = useState([]);
    const [pressSizes, setPressSizes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const groupedFields = {
        'Pump Details': ['pressSize', 'sqMaxTMin', 'sqInletWater']
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [sizesRes, pumpRes] = await Promise.all([
                    axios.get('http://localhost:8081/api/plate/fetch/presssize', {
                        params: { plateType: 'Membrane' }
                    }),
                    axios.get(`http://localhost:8081/api/squeezing/get/${id}`)
                ]);

                setPressSizes(sizesRes.data);
                setFormData({
                    pressSize: pumpRes.data.pressSize,
                    sqMaxTMin: pumpRes.data.sqMaxTMin.toString(),
                    sqInletWater: pumpRes.data.sqInletWater.toString()
                });
                setFlowRates(pumpRes.data.flowRates || []);
            } catch (err) {
                setError('❌ Failed to load squeezing pump data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleFlowRateChange = (index, value) => {
        const updated = [...flowRates];
        updated[index].flowRate = value;
        setFlowRates(updated);
        setErrors(prev => ({ ...prev, [`flowRate-${index}`]: null }));
    };

    const addFlowRate = () => setFlowRates([...flowRates, { flowRate: '' }]);

    const removeFlowRate = (index) => {
        const updated = [...flowRates];
        updated.splice(index, 1);
        setFlowRates(updated);
    };

    const validate = () => {
        const newErrors = {};
        const isNumber = v => !isNaN(v) && String(v).trim() !== '';

        if (!formData.pressSize.trim()) newErrors.pressSize = 'Press size is required';
        if (formData.sqMaxTMin) newErrors.sqMaxTMin = 'Valid Max T min is required';
        if (!isNumber(formData.sqInletWater)) newErrors.sqInletWater = 'Valid Inlet Water is required';

        flowRates.forEach((f, idx) => {
            if (!isNumber(f.flowRate)) {
                newErrors[`flowRate-${idx}`] = 'Valid flow rate is required';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const payload = {
                ...formData,
                sqMaxTMin: parseFloat(formData.sqMaxTMin),
                sqInletWater: parseFloat(formData.sqInletWater),
                flowRates: flowRates.map(f => ({ flowRate: parseFloat(f.flowRate) }))
            };

            await axios.put(`http://localhost:8081/api/squeezing/update/${id}`, payload);
            setMessage('✅ Pump updated successfully!');
            setTimeout(() => navigate('/squeeze-pumps'), 1500);
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to update squeezing pump.';
            setError(`❌ ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ border: '1px solid #ccc', padding: '20px', marginTop: '40px' }}>
            <h3>Edit Squeezing Pump</h3>
            {loading && <Loader />}
            {message && <div style={{ color: 'green' }}>{message}</div>}
            {error && <div style={{ color: 'red' }}>{error}</div>}

            {!loading && (
                <form onSubmit={handleUpdate}>
                    {Object.entries(groupedFields).map(([groupName, keys]) => (
                        <fieldset key={groupName} style={{ marginBottom: '20px' }}>
                            <legend><strong>{groupName}</strong></legend>
                            {keys.map((key) => (
                                key === 'pressSize' ? (
                                    <div key={key}>
                                        <label>{labels[key]}</label><br />
                                        <select
                                            name={key}
                                            value={formData[key]}
                                            onChange={handleChange}
                                            style={errors[key] ? { borderColor: 'red' } : {}}
                                        >
                                            <option value="">-- Select Press Size --</option>
                                            {pressSizes.map((size, idx) => (
                                                <option key={idx} value={size}>{size}</option>
                                            ))}
                                        </select>
                                        {errors[key] && <div style={{ color: 'red', fontSize: '12px' }}>{errors[key]}</div>}
                                    </div>
                                ) : (
                                    <div key={key}>
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

                    <fieldset>
                        <legend><strong>Flow Rates</strong></legend>
                        {flowRates.map((f, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                <input
                                    type="text"
                                    placeholder={placeholders.flowRate}
                                    value={f.flowRate}
                                    onChange={(e) => handleFlowRateChange(idx, e.target.value)}
                                    style={errors[`flowRate-${idx}`] ? { borderColor: 'red' } : {}}
                                />
                                <button type="button" onClick={() => removeFlowRate(idx)} style={{ marginLeft: '10px' }}>
                                    X
                                </button>
                                {errors[`flowRate-${idx}`] && (
                                    <div style={{ color: 'red', marginLeft: '10px', fontSize: '12px' }}>
                                        {errors[`flowRate-${idx}`]}
                                    </div>
                                )}
                            </div>
                        ))}
                        <button type="button" onClick={addFlowRate}>+ Add Flow Rate</button>
                    </fieldset>

                    <div style={{ marginTop: '20px' }}>
                        <button type="submit">Update</button>
                        <button type="button" onClick={() => navigate(-1)}>Cancel</button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default UpdateSqueezePumpForm;
