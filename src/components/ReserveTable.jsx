// CSE 412 
// Team Members: Smit Desai, Tanmay Chaudhari, Christopher Hernandez, Gage Smith

import React, { useState } from 'react';
import './App.css';

const ReserveTable = ({ restaurant, navigateBack }) => {
    const [datetime, setDatetime] = useState('');
    const [partySize, setPartySize] = useState('');

    const handleSubmit = () => {
        fetch('http://localhost:3000/reservations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                c_id: 1,
                rtr_id: restaurant.rtr_id,
                rsvt_datetime: datetime,
                rsvt_partysize: parseInt(partySize, 10),
                rsvt_status: 'Confirmed',
            }),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to create reservation');
                }
                return res.json();
            })
            .then((data) => {
                alert(
                    `Reservation Confirmed! Reservation ID: ${data.rsvt_id}\nReserved at ${restaurant.rtr_name} on ${datetime}.`
                );
            })
            .catch((err) => {
                console.error('Error creating reservation:', err);
                alert('Failed to create reservation. Please try again later.');
            });
    };

    return (
        <div className="form-container">
            <h2>Reserve a Table at {restaurant.rtr_name}</h2>
            <div className="form-group">
                <label>Date and Time:</label>
                <input
                    type="datetime-local"
                    value={datetime}
                    onChange={(e) => setDatetime(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label>Party Size:</label>
                <input
                    type="number"
                    placeholder="Party Size"
                    value={partySize}
                    onChange={(e) => setPartySize(e.target.value)}
                    min="1"
                    required
                />
            </div>
            <div className="button-group">
                <button className="form-button" onClick={handleSubmit}>
                    Reserve
                </button>
                <button className="form-button secondary" onClick={navigateBack}>
                    Back
                </button>
            </div>
        </div>
    );
};

export default ReserveTable;
