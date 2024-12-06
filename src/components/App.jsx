// CSE 412 
// Team Members: Smit Desai, Tanmay Chaudhari, Christopher Hernandez, Gage Smith

import React, { useState } from 'react';
import CustomerDashboard from './CustomerDashboard';
import RestaurantAdmin from './RestaurantAdmin';
import RestaurantList from './RestaurantList';
import Login from './login';
import Signup from './signup';

function App() {
    const [currentPage, setCurrentPage] = useState('login'); // Default to login
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState(null);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);

    const handleAuthSuccess = (selectedRole) => {
        setIsAuthenticated(true);
        setRole(selectedRole);
    
        if (selectedRole === 'user') {
            setCurrentPage('restaurantList'); // Redirect to Restaurant List
        } else if (selectedRole === 'admin') {
            setCurrentPage('restaurantAdmin'); // Redirect to Admin Dashboard
        }
    };
    
    const handleRestaurantSelect = (restaurant) => {
        setSelectedRestaurant(restaurant);
        setCurrentPage('customerDashboard'); // Redirect to Customer Dashboard
    };

    const handleGoBack = () => {
        setCurrentPage('restaurantList'); // Go back to Restaurant List
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setRole(null);
        setCurrentPage('login'); // Redirect to login page
    };

    return (
        <div className="app">
            <h1>Restaurant Reservation System</h1>

            {!isAuthenticated ? (
                <>
                    {currentPage === 'signup' && (
                        <Signup
                            onAuthSuccess={handleAuthSuccess}
                            switchToLogin={() => setCurrentPage('login')}
                        />
                    )}
                    {currentPage === 'login' && (
                        <Login
                            onAuthSuccess={handleAuthSuccess}
                            switchToSignup={() => setCurrentPage('signup')}
                        />
                    )}
                </>
            ) : (
                <>
                    {role === 'user' && currentPage === 'restaurantList' && (
                        <RestaurantList
                            onRestaurantSelect={handleRestaurantSelect}
                            onLogout={handleLogout}
                        />
                    )}
                    {role === 'user' && currentPage === 'customerDashboard' && (
                        <CustomerDashboard
                            restaurant={selectedRestaurant}
                            onGoBack={handleGoBack}
                        />
                    )}
                    {role === 'admin' && <RestaurantAdmin onLogout={handleLogout} />}
                </>
            )}
        </div>
    );
}

export default App;
