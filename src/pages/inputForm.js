// src/InputForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from "../components/button";
import "../styles/inputForm.css";
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';

const InputForm = () => {
    const [formData, setFormData] = useState({
        clientName: '',
        clientRef: '',
        sludgeName: '',
        sludgeType: '',
        sludgeQty: '',
        drySolidParticle: '',
        densityOfDrySolid: '',
        moistureContain: '',
        noOfPress: '',
        noOfBatch: '',
        plateType: '',
        washingT: '',
        sqOutletT: '',
        cusFeedRate: '',
        cakeWashing: false,
        clothWashing: false,
        plateShifter: false,
        dripTray: false,
        pressSizes: [],
    });

    const [errors, setErrors] = useState({});
    const [response, setResponse] = useState(null);
    const [plateTypes, setPlateTypes] = useState([]);
    const [pressSizes, setPressSizes] = useState([]);

    const labels = {
        clientName: 'Client Name',
        clientRef: 'Client Reference',
        sludgeName: 'Sludge Name',
        sludgeType: 'Sludge Type',
        sludgeQty: 'Sludge Quantity (m³/hr)',
        drySolidParticle: 'Dry Solid Particle (%)',
        densityOfDrySolid: 'Density of Dry Solid (g/cm³)',
        moistureContain: 'Moisture Content (%)',
        noOfPress: 'Number of Presses',
        noOfBatch: 'Number of Batches',
        plateType: 'Plate Type',
        washingT: 'Washing Time (mins)',
        sqOutletT: 'Squeeze Outlet Time (mins)',
        cusFeedRate: 'Custom Feed Rate (L/min)',
        cakeWashing: 'Cake Washing',
        clothWashing: 'Cloth Washing',
        plateShifter: 'Plate Shifter',
        dripTray: 'Drip Tray',
        pressSizes: 'Available Press Sizes',
    };

    const groupedFields = {
        "Client Details": ['clientName', 'clientRef'],
        "Sludge Information": ['sludgeName', 'sludgeType', 'sludgeQty', 'drySolidParticle', 'densityOfDrySolid', 'moistureContain'],
        "Press Configuration": ['plateType', 'cakeWashing', 'clothWashing', 'plateShifter', 'dripTray', 'pressSizes'],
        "Cycle Timing Settings": ['cusFeedRate', 'noOfPress', 'noOfBatch']
    };

    useEffect(() => {
        axios.get('http://localhost:8081/api/platetype/fetch')
            .then(res => setPlateTypes(res.data))
            .catch(err => console.error('Error fetching plate types:', err));
    }, []);

    useEffect(() => {
        if (formData.plateType) {
            axios
                .get(`http://localhost:8081/api/plate/fetch/presssize`, {
                    params: { plateType: formData.plateType },
                })
                .then((res) => {
                    setPressSizes(res.data); // ✅ Correct
                    setFormData(prev => ({ ...prev, pressSizes: [] }));
                })
                .catch((err) => {
                    console.error("Failed to fetch press sizes", err);
                    setPressSizes([]);
                });
        } else {
            setPressSizes([]);
        }
    }, [formData.plateType]);

    const validate = () => {
        const newErrors = {};
        const isInteger = (value) => /^\d+$/.test(value);
        const isDouble = (value) => /^(\d+(\.\d+)?|\.\d+)$/.test(value);


        if (!formData.clientName.trim()) newErrors.clientName = "Client name is required";
        if (!formData.sludgeName.trim()) newErrors.sludgeName = "Sludge name is required";
        if (!formData.sludgeType.trim()) newErrors.sludgeType = "Sludge type is required";

        if (!isInteger(formData.sludgeQty)) newErrors.sludgeQty = "Sludge Qty must be an integer";
        if (!isDouble(formData.drySolidParticle)) newErrors.drySolidParticle = "Dry solid particle must be a decimal";
        if (!isInteger(formData.moistureContain)) newErrors.moistureContain = "Moisture content must be an integer";

        if (!formData.plateType.trim()) newErrors.plateType = "Plate type is required";
        if (formData.pressSizes.length === 0) {
            newErrors.pressSizes = "At least one press size must be selected";
        }

        if (formData.cakeWashing === true) {
            if (!formData.washingT.trim()) {
                newErrors.washingT = "Washing time is required when Cake Washing is selected";
            }
        }

        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        const integerFields = ['sludgeQty', 'moistureContain', 'noOfPress', 'noOfBatch', 'cusFeedRate'];
        const floatFields = ['drySolidParticle', 'densityOfDrySolid'];

        if (integerFields.includes(name)) {
            if (value === '' || /^[0-9]*$/.test(value)) {
                setErrors((prev) => ({ ...prev, [name]: '' }));
            } else {
                setErrors((prev) => ({ ...prev, [name]: 'Only numeric values (0–9) are allowed' }));
            }
        } else if (floatFields.includes(name)) {
            if (value === '' || /^\d*\.?\d+$/.test(value)) {
                setErrors((prev) => ({ ...prev, [name]: '' }));
            } else {
                setErrors((prev) => ({ ...prev, [name]: 'Only numeric values are allowed (e.g., 123 or 123.45)' }));
            }
        } else {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) return;

        try {
            const res = await axios.post('http://localhost:8081/api/input', formData, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            setResponse(res.data);
        } catch (err) {
            console.error(err);
            alert('Error submitting form');
        }
    };

    const responseLabels = {
        totalDrySolid: "Total Dry Solid (kg)",
        totalWetCake: "Total Wet Cake (kg)",
        pressSize: "Press Size",
        plateType: "Plate Type",
        onePlateVolume: "One Plate Volume (L)",
        noOfPress: "Number of Presses",
        noOfBatch: "Number of Batches",
        noOfChamber: "Number of Chambers",
        totalVolume: "Total Volume (L)",
        feedPumpFlow: "Feed Pump Flow (m³/hr)",
        airCompressDeli: "Air Compressor Delivery (CFM)",
        sqFlowRate: "Squeeze Flow Rate (m³/hr)",
        sqWaterUsed: "Squeeze Water Used (L)",
        sqTankCap: "Squeeze Tank Capacity (L)",
        cw1PWaterUsed: "CW1 P Water Used (L)",
        cw1CWaterUsed: "CW1 C Water Used (L)",
        cwTankCap: "CW Tank Capacity (L)",
        pressingCT: "Pressing Cycle Time",
        feedT: "Feed Time",
        cakeAirT: "Cake with Air Time",
        sqInletT: "Squeeze Inlet Time",
        sqOutletT: "Squeeze Outlet Time",
        onePlatePsT: "One Plate PS Time",
        onCyclePsT: "One Cycle PS Time",
        onePlateCwT: "One Plate CW Time",
        onCycleCwT: "One Cycle CW Time",
        cakeWT: "Cake Washing Time",
        message: "Message"
    };

    const placeholders = {
        clientName: 'Enter client name',
        clientRef: 'Enter client reference',
        sludgeName: 'Enter sludge name',
        sludgeType: 'Enter sludge type',
        sludgeQty: 'Enter sludge quantity',
        drySolidParticle: 'Enter % of dry solid particles',
        densityOfDrySolid: 'Enter density of dry solid',
        moistureContain: 'Enter moisture content (%)',
        noOfPress: 'Enter number of presses',
        noOfBatch: 'Enter number of batches',
        plateType: 'Select plate type',
        washingT: 'Enter washing time (HH:mm:ss)',
        sqOutletT: 'Enter squeeze outlet time',
        cusFeedRate: 'Enter custom feed rate',
        pressSizes: 'Select press sizes',
        plateShifter: '',
        dripTray: '',
        cakeWashing: '',
        clothWashing: '',
    };

    <TimePicker
        onChange={(value) =>
            setFormData((prev) => ({ ...prev, washingT: value }))
        }
        value={formData.washingT}
    />

    return (
        <div>
            <h2>Press Configuration Input</h2>
            <form onSubmit={handleSubmit}>
                {Object.entries(groupedFields).map(([groupName, keys]) => (
                    <fieldset key={groupName}>
                        <legend><strong>{groupName}</strong></legend>
                        {keys.map((key) => (
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
                                                <option key={pt.plateTypeId} value={pt.typeName}>{pt.typeName}</option>
                                            ))}
                                        </select>
                                    ) : ['cakeWashing', 'clothWashing', 'plateShifter', 'dripTray'].includes(key) ? (
                                        <div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '60px 60px', gap: '10px' }}>
                                                <label>
                                                    <input
                                                        type="radio"
                                                        name={key}
                                                        value="true"
                                                        checked={formData[key] === true}
                                                        onChange={() =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                [key]: true,
                                                                ...(key === 'cakeWashing' && { washingT: prev.washingT })
                                                            }))
                                                        }
                                                    />
                                                    Yes
                                                </label>
                                                <label>
                                                    <input
                                                        type="radio"
                                                        name={key}
                                                        value="false"
                                                        checked={formData[key] === false}
                                                        onChange={() =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                [key]: false,
                                                                ...(key === 'cakeWashing' && { washingT: '' })
                                                            }))
                                                        }
                                                    />
                                                    No
                                                </label>
                                            </div>
                                        </div>
                                    ) : key === 'pressSizes' ? (
                                        <div className="checkbox-group" style={errors[key] ? { border: '1px solid red', padding: '8px', borderRadius: '4px' } : {}}>
                                            {pressSizes.map((size, index) => (
                                                <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                                                    <input
                                                        type="checkbox"
                                                        id={`pressSize-${index}`}
                                                        value={size}
                                                        checked={formData.pressSizes.includes(size)}

                                                        onChange={(e) => {
                                                            const { checked, value } = e.target;
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                pressSizes: checked
                                                                    ? [...prev.pressSizes, value]
                                                                    : prev.pressSizes.filter(s => s !== value)
                                                            }));
                                                        }}
                                                    />
                                                    <label htmlFor={`pressSize-${index}`} style={{ marginLeft: '6px' }}>
                                                        {size}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <input
                                            type="text"
                                            name={key}
                                            value={formData[key]}
                                            onChange={handleChange}
                                            // placeholder={`Enter ${labels[key] || key}`}
                                            placeholder={placeholders[key] || `Enter ${labels[key] || key}`}
                                            style={errors[key] ? { borderColor: 'red' } : {}}
                                        />
                                    )}
                                </label>
                                {errors[key] && <div style={{ color: 'red', fontSize: '12px' }}>{errors[key]}</div>}
                            </div>
                        ))}

                        {groupName === 'Cycle Timing Settings' && formData.cakeWashing && (
                            <div style={{ marginBottom: '10px' }}>
                                <label>
                                    {labels['washingT']}:
                                    <div>
                                        <TimePicker
                                            onChange={(value) =>
                                                setFormData((prev) => ({ ...prev, washingT: value }))
                                            }
                                            value={formData.washingT}
                                            disableClock
                                            format="HH:mm:ss"
                                            clearIcon={null}
                                            className={errors.washingT ? 'time-picker-error' : ''}
                                        />
                                    </div>
                                </label>
                                {errors.washingT && (
                                    <div style={{ color: 'red', fontSize: '12px' }}>{errors.washingT}</div>
                                )}
                            </div>
                        )}

                        {groupName === 'Cycle Timing Settings' && formData.plateType === 'Membrane' && (
                            <div style={{ marginBottom: '10px' }}>
                                <label>
                                    {labels['sqOutletT']}:
                                    <input
                                        type="text"
                                        name="sqOutletT"
                                        value={formData.sqOutletT}
                                        onChange={handleChange}
                                        style={errors.sqOutletT ? { borderColor: 'red' } : {}}
                                    />
                                </label>
                                {errors.sqOutletT && <div style={{ color: 'red', fontSize: '12px' }}>{errors.sqOutletT}</div>}
                            </div>
                        )}



                    </fieldset>
                ))}
                <div className='button-container' style={{ gridColumn: '1 / span 4', margin: '0 auto' }}>
                    <Button label="Calculate" onClick={handleSubmit} className='abc' style={{ marginBottom: '10px' }} />
                </div>
            </form>

            {response && (
                <div>
                    <h3>Response:</h3>

                    {response.slurryResponse && (
                        <div style={{ width: '450px' }}>
                            <h4>Slurry Response</h4>
                            <table border="1" cellPadding="8" cellSpacing="0">
                                <thead><tr><th>Field</th><th>Value</th></tr></thead>
                                <tbody>
                                    {Object.entries(response.slurryResponse).map(([key, value]) => (
                                        <tr key={key}><td>{responseLabels[key] || key}</td><td>{value}</td></tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {Array.isArray(response.pressDataResponse) && Array.isArray(response.pressTResponse) && (
                        <div>
                            <h4>Press Data & Time</h4>
                            {response.pressDataResponse.map((pressData, index) => (
                                <div key={index} style={{ display: 'flex', gap: '30px' }}>
                                    <div style={{ width: '100%' }}>
                                        <h5>Press {index + 1}</h5>
                                        <table border="1" cellPadding="8" cellSpacing="0">
                                            <thead><tr><th>Field</th><th>Value</th></tr></thead>
                                            <tbody>
                                                {Object.entries(pressData).map(([key, value]) => (
                                                    <tr key={key}><td>{responseLabels[key] || key}</td><td>{value}</td></tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div style={{ width: '100%' }}>
                                        <h5>Press Time {index + 1}</h5>
                                        <table border="1" cellPadding="8" cellSpacing="0">
                                            <thead><tr><th>Field</th><th>Value</th></tr></thead>
                                            <tbody>
                                                {Object.entries(response.pressTResponse[index] || {}).map(([key, value]) => (
                                                    <tr key={key}><td>{responseLabels[key] || key}</td><td>{value}</td></tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {Array.isArray(response.warnings) && (
                        <div>
                            <h4>Warnings</h4>
                            <ul>
                                {response.warnings.map((warning, index) => (
                                    <li key={index}>{warning}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default InputForm;
