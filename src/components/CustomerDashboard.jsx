// CSE 412 
// Team Members: Smit Desai, Tanmay Chaudhari, Christopher Hernandez, Gage Smith

import React, { useState } from 'react';
import ReserveTable from './ReserveTable';
import OnlineOrder from './OnlineOrder';
import WriteReview from './WriteReview';

function CustomerDashboard({ restaurant, onGoBack}) {
    const [currentPage, setCurrentPage] = useState('dashboard'); // Default to dashboard

    const renderContent = () => {
        switch (currentPage) {
            case 'reserveTable':
                return (
                    <ReserveTable
                        restaurant={restaurant}
                        navigateBack={() => setCurrentPage('dashboard')}
                    />
                );
            case 'onlineOrder':
                return (
                    <OnlineOrder
                        restaurant={restaurant}
                        navigateBack={() => setCurrentPage('dashboard')}
                    />
                );
            case 'writeReview':
                return (
                    <WriteReview
                        restaurant={restaurant}
                        navigateBack={() => setCurrentPage('dashboard')}
                    />
                );
            default:
                return (
                    <div>
                      <h2>Welcome to {restaurant.rtr_name}</h2>
                      <div className="details">
                        <p>Cuisine: {restaurant.rtr_foodtype}</p>
                        <p>Rating: {restaurant.rtr_rating}</p>
                        <p>Address: {restaurant.rtr_address}</p>
                      </div>
                      <div>
                        <button onClick={() => setCurrentPage('reserveTable')} className="btn">
                          Reserve Table
                        </button>
                        <button onClick={() => setCurrentPage('onlineOrder')} className="btn">
                          Online Order
                        </button>
                        <button onClick={() => setCurrentPage('writeReview')} className="btn">
                          Write Review
                        </button>
                        <button onClick={onGoBack} className="btn">
                          Go Back
                        </button>
                      </div>
                    </div>
                  );                  
        }
    };

    return <div className="customer-dashboard">{renderContent()}</div>;
}

export default CustomerDashboard;
