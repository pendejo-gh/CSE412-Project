import React, { useState } from 'react';
import RestaurantList from './RestaurantList';
import ReserveTable from './ReserveTable';
import OnlineOrder from './OnlineOrder';
import WriteReview from './WriteReview';


function CustomerDashboard() {
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [currentPage, setCurrentPage] = useState('list');

    const handleRestaurantSelect = (restaurant) => {
        setSelectedRestaurant(restaurant);
        setCurrentPage('options');
    };

    const handleNavigation = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="dashboard">
            <h1>Restaurant Reservation System</h1>
            {currentPage === 'list' && <RestaurantList onRestaurantSelect={handleRestaurantSelect} />}
            {currentPage === 'options' && (
                <div className="options">
                    <h2>{`Selected Restaurant: ${selectedRestaurant?.rtr_name}`}</h2>
                    <button onClick={() => handleNavigation('reserve')}>Reserve a Table</button>
                    <button onClick={() => handleNavigation('order')}>Order Online</button>
                    <button onClick={() => handleNavigation('review')}>Write a Review</button>
                    <button onClick={() => setCurrentPage('list')}>Back to List</button>
                </div>
            )}
            {currentPage === 'reserve' && (
                <ReserveTable restaurant={selectedRestaurant} navigateBack={() => handleNavigation('options')} />
            )}
            {currentPage === 'order' && (
                <OnlineOrder restaurant={selectedRestaurant} navigateBack={() => handleNavigation('options')} />
            )}
            {currentPage === 'review' && (
                <WriteReview restaurant={selectedRestaurant} navigateBack={() => handleNavigation('options')} />
            )}
        </div>
    );
}

export default CustomerDashboard;
