// src/InputForm.js
import React, { useState } from 'react';
import axios from 'axios';
import Button from "../components/button";
import "../styles/inputForm.css";

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
        cusFeedRate: ''
    });

    const [response, setResponse] = useState(null);

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
        cusFeedRate: 'Custom Feed Rate (L/min)'
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:8081/api/input', formData, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            setResponse(res.data);
        } catch (err) {
            console.error(err);
            alert('Error submitting form');
        }
    };

    const responseLabels = {
    // Slurry Response
    totalDrySolid: "Total Dry Solid (kg)",
    totalWetCake: "Total Wet Cake (kg)",

    // Press Data Response
    pressSize: "Press Size",
    plateType: "Plate Type",
    onePlateVolume: "One Plate Volume (L)",
    noOfPress: "Number of Presses",
    noOfBatch: "Number of Batches",
    noOfChamber: "Number of Chambers",
    totalVolume: "Total Volume (L)",
    feedPumpFlow: "Feed Pump Flow (m³/hr)",
    airCompressDeli: "Air Compressor Delivery (bar)",
    sqFlowRate: "Squeeze Flow Rate (m³/hr)",
    sqWaterUsed: "Squeeze Water Used (L)",
    sqTankCap: "Squeeze Tank Capacity (L)",
    cw1PWaterUsed: "CW1 P Water Used (L)",
    cw1CWaterUsed: "CW1 C Water Used (L)",
    cwTankCap: "CW Tank Capacity (L)",

    // Press Time Response
    pressingCT: "Pressing Cycle Time",
    feedT: "Feed Time",
    cakeAirT: "Cake with Air Time",
    sqInletT: "Squeeze Inlet Time",
    sqOutletT: "Squeeze Outlet Time",
    onePlatePsT: "One Plate PS Time",
    onCyclePsT: "One Cycle PS Time",
    onePlateCwT: "One Plate CW Time",
    onCycleCwT: "One Cycle CW Time",
    cakeWT: "Cake Washing Time"
};


    return (
        <div>
            <h2>Press Configuration Input</h2>
            <form onSubmit={handleSubmit}>
                {Object.entries(formData).map(([key, val]) => (
                    <div key={key}>
                        <label>
                           {labels[key] || key}:
                            <input
                                type="text"
                                name={key}
                                value={val}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                ))}
                <Button label="Submit" onClick={handleSubmit} />
            </form>

            {response && (
                <div>
                    <h3>Response:</h3>

                    {/* Slurry Response */}
                    <div>
                        <h4>Slurry Response</h4>
                        <table border="1" cellPadding="8" cellSpacing="0">
                            <thead>
                                <tr>
                                    <th>Field</th>
                                    <th>Value</th>
                                </tr>
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

                    {/* Press Data Response */}
                    <div>
                        <h4>Press Data Response</h4>
                        {response.pressDataResponse.map((pressData, index) => (
                            <div key={index}>
                                <h5>Press {index + 1}</h5>
                                <table border="1" cellPadding="8" cellSpacing="0">
                                    <thead>
                                        <tr>
                                            <th>Field</th>
                                            <th>Value</th>
                                        </tr>
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
                        ))}
                    </div>

                    {/* Press T Response */}
                    <div>
                        <h4>Press Time Response</h4>
                        {response.pressTResponse.map((pressT, index) => (
                            <div key={index}>
                                <h5>Press Time {index + 1}</h5>
                                <table border="1" cellPadding="8" cellSpacing="0">
                                    <thead>
                                        <tr>
                                            <th>Field</th>
                                            <th>Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(pressT).map(([key, value]) => (
                                            <tr key={key}>
                                                <td>{responseLabels[key] || key}</td>
                                                <td>{value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>

                    {/* Warnings */}
                    <div>
                        <h4>Warnings</h4>
                        <ul>
                            {response.warnings.map((warning, index) => (
                                <li key={index}>{warning}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InputForm;
