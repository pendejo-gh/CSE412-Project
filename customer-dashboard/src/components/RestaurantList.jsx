// CSE 412 
// Team Members: Smit Desai, Tanmay Chaudhari, Christopher Hernandez, Gage Smith

import React, { useEffect, useState } from 'react';

const RestaurantList = ({ onRestaurantSelect, onLogout }) => {
    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/restaurants')
            .then((res) => res.json())
            .then((data) => setRestaurants(data))
            .catch((err) => console.error('Error fetching restaurants:', err));
    }, []);

    return (
        <div className="restaurant-list">
            <div className="header">
                <h2>Available Restaurants</h2>
                <button onClick={onLogout} className="logout-button">
                    Logout
                </button>
            </div>
            <ul>
                {restaurants.map((restaurant) => (
                    <li
                        key={restaurant.rtr_id}
                        onClick={() => onRestaurantSelect(restaurant)}
                        style={{ cursor: 'pointer' }}
                    >
                        <h3>{restaurant.rtr_name}</h3>
                        <p>Cuisine: {restaurant.rtr_foodtype}</p>
                        <p>Rating: {restaurant.rtr_rating}</p>
                        <p>Address: {restaurant.rtr_address}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RestaurantList;
