import React, { useEffect, useState } from 'react';
import './App.css';

const RestaurantList = ({ onRestaurantSelect }) => {
    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/restaurants')
            .then((res) => res.json())
            .then((data) => setRestaurants(data))
            .catch((err) => console.error('Error fetching restaurants:', err));
    }, []);

    return (
        <div className="restaurant-list">
            <h2>Available Restaurants</h2>
            <ul>
                {restaurants.map((restaurant) => (
                    <li key={restaurant.rtr_id} onClick={() => onRestaurantSelect(restaurant)}>
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
