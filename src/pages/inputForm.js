// src/InputForm.js
import React, { useState } from 'react';
import axios from 'axios';
import Button from "../components/button";
import "../styles/inputForm.css";
import { useEffect } from 'react';

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
        cakeWashing: false
    });

    const [errors, setErrors] = useState({});
    const [response, setResponse] = useState(null);
    const [plateTypes, setPlateTypes] = useState([]);

    const labels = {
        clientName: 'Client Name',
        clientRef: 'Client Reference',
        sludgeName: 'Sludge Name',
        sludgeType: 'Sludge Type',
        sludgeQty: 'Sludge Quantity (kg)',
        drySolidParticle: 'Dry Solid Particle (%)',
        densityOfDrySolid: 'Density of Dry Solid (kg/m³)',
        moistureContain: 'Moisture Content (%)',
        noOfPress: 'Number of Presses',
        noOfBatch: 'Number of Batches',
        plateType: 'Plate Type',
        washingT: 'Washing Time (mins)',
        sqOutletT: 'Squeeze Outlet Time (mins)',
        cusFeedRate: 'Custom Feed Rate (L/min)',
        cakeWashing: 'Cake Washing'
    };

    const groupedFields = {
        "Client Details": ['clientName', 'clientRef'],
        "Sludge Information": ['sludgeName', 'sludgeType', 'sludgeQty', 'drySolidParticle', 'densityOfDrySolid', 'moistureContain'],
        "Press Configuration": ['noOfPress', 'noOfBatch', 'plateType', 'cakeWashing'],
        "Cycle Timing Settings": ['washingT', 'sqOutletT', 'cusFeedRate']
    };

    useEffect(() => {
        axios.get('http://localhost:8081/api/platetype/fetch')
            .then(res => {
                setPlateTypes(res.data);
            })
            .catch(err => {
                console.error('Error fetching plate types:', err);
            });
    }, []);


    const validate = () => {
        const newErrors = {};
        const isInteger = (value) => /^\d+$/.test(value);

        if (!formData.clientName.trim()) newErrors.clientName = "Client name is required";
        if (!formData.sludgeName.trim()) newErrors.sludgeName = "Sludge name is required";
        if (!formData.sludgeType.trim()) newErrors.sludgeType = "Sludge type is required";

        if (!isInteger(formData.noOfPress)) newErrors.noOfPress = "Number of presses must be an integer";
        if (!isInteger(formData.noOfBatch)) newErrors.noOfBatch = "Number of batches must be an integer";
        if (!isInteger(formData.cusFeedRate)) newErrors.cusFeedRate = "Feed rate must be an integer";

        if (!isInteger(formData.sludgeQty)) newErrors.sludgeQty = "Sludge Qty must be an integer";
        if (!isInteger(formData.drySolidParticle)) newErrors.drySolidParticle = "Dry solid particle must be an integer";
        if (!isInteger(formData.moistureContain)) newErrors.moistureContain = "Moisture content must be an integer";

        if (!formData.plateType.trim()) newErrors.plateType = "Plate type is required";

        if (formData.cakeWashing === true && !formData.washingT.trim()) { newErrors.washingT = "Washing time is required when Cake Washing is selected"; }

        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        const integerFields = ['sludgeQty', 'drySolidParticle', 'moistureContain', 'noOfPress', 'noOfBatch', 'cusFeedRate'];
        const floatFields = ['densityOfDrySolid'];

        if (integerFields.includes(name)) {
            if (value === '' || /^[0-9]*$/.test(value)) {
                setErrors((prev) => ({ ...prev, [name]: '' }));
            } else {
                setErrors((prev) => ({
                    ...prev,
                    [name]: 'Only numeric values (0–9) are allowed'
                }));
            }
        } else if (floatFields.includes(name)) {
            if (value === '' || /^\d*\.?\d+$/.test(value)) {
                setErrors((prev) => ({ ...prev, [name]: '' }));
            } else {
                setErrors((prev) => ({
                    ...prev,
                    [name]: 'Only numeric values are allowed (e.g., 123 or 123.45)'
                }));
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
                                    ) : key === 'cakeWashing' ? (
                                        <div >
                                            <div style={{ display: 'grid', gridTemplateColumns: '50px auto', gap: '10px' }}>
                                                <label>
                                                    <input
                                                        type="radio"
                                                        name="cakeWashing"
                                                        value="true"
                                                        checked={formData.cakeWashing === true}
                                                        onChange={() => setFormData({ ...formData, cakeWashing: true })}
                                                    />{' '}
                                                    Yes
                                                </label>
                                                <label>
                                                    <input
                                                        type="radio"
                                                        name="cakeWashing"
                                                        value="false"
                                                        checked={formData.cakeWashing === false}
                                                        onChange={() => setFormData({ ...formData, cakeWashing: false })}
                                                    />{' '}
                                                    No
                                                </label>
                                            </div>
                                        </div>
                                    ) : (
                                        <input
                                            type="text"
                                            name={key}
                                            value={formData[key]}
                                            onChange={handleChange}
                                            style={errors[key] ? { borderColor: 'red' } : {}}
                                        />
                                    )}
                                </label>
                                {errors[key] && <div style={{ color: 'red', fontSize: '12px' }}>{errors[key]}</div>}
                            </div>
                        ))}
                    </fieldset>
                ))}
                <div className='button-container' style={{ gridColumn: '1 / span 4', margin: '0 auto' }}>
                    <Button label="Calculate" onClick={handleSubmit} className='abc' style={{ marginBottom: '10px' }} />
                </div>
            </form>

            {formData.cakeWashing === true && (
                <fieldset>
                    <legend><strong>Cake Washing Settings</strong></legend>
                    <div style={{ marginBottom: '10px' }}>
                        <label>
                            {labels["washingT"]}:
                            <input
                                type="text"
                                name="washingT"
                                value={formData.washingT}
                                onChange={handleChange}
                                style={
                                    formData.cakeWashing === true && errors["washingT"]
                                        ? { borderColor: 'red' }
                                        : {}
                                }
                            />
                        </label>
                        {formData.cakeWashing === true && errors["washingT"] && (
                            <div style={{ color: 'red', fontSize: '12px' }}>{errors["washingT"]}</div>
                        )}
                    </div>
                </fieldset>
            )}

            {response && (
                <div>
                    <h3>Response:</h3>

                    {response.slurryResponse && (
                        <div>
                            <h4>Slurry Response</h4>
                            <table border="1" cellPadding="8" cellSpacing="0">
                                <thead>
                                    <tr><th>Field</th><th>Value</th></tr>
                                </thead>
                                <tbody>
                                    {Object.entries(response.slurryResponse).map(([key, value]) => (
                                        <tr key={key}>
                                            <td>{responseLabels[key] || key}</td>
                                            <td>{value}</td>
                                        </tr>
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
                                            <thead>
                                                <tr><th>Field</th><th>Value</th></tr>
                                            </thead>
                                            <tbody>
                                                {Object.entries(pressData).map(([key, value]) => (
                                                    <tr key={key}>
                                                        <td>{responseLabels[key] || key}</td>
                                                        <td>{value}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div style={{ width: '100%' }}>
                                        <h5>Press Time {index + 1}</h5>
                                        <table border="1" cellPadding="8" cellSpacing="0">
                                            <thead>
                                                <tr><th>Field</th><th>Value</th></tr>
                                            </thead>
                                            <tbody>
                                                {Object.entries(response.pressTResponse[index] || {}).map(([key, value]) => (
                                                    <tr key={key}>
                                                        <td>{responseLabels[key] || key}</td>
                                                        <td>{value}</td>
                                                    </tr>
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
