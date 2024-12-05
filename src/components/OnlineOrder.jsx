import React, { useState, useEffect } from 'react';
import './App.css';

const OnlineOrder = ({ restaurant, navigateBack }) => {
    const [menuItems, setMenuItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!restaurant || !restaurant.rtr_id) {
            console.error('Restaurant data is missing or invalid.');
            return;
        }

        fetch(`http://localhost:3000/restaurants/${restaurant.rtr_id}/menus`)
            .then((res) => res.json())
            .then((data) => {
                const formattedMenu = data.map((item) => ({
                    id: item.menu_id,
                    name: item.item_name,
                    price: parseFloat(item.item_price),
                }));
                setMenuItems(formattedMenu);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error fetching menu:', err);
                setLoading(false);
            });
    }, [restaurant]);

    const handleItemClick = (item) => {
        setSelectedItems((prev) =>
            prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
        );
    };

    const calculateTotal = () =>
        selectedItems.reduce((total, item) => total + item.price, 0);

    const handleConfirmOrder = () => {
        if (!restaurant || !restaurant.rtr_id) {
            alert('Invalid restaurant selection. Please go back and try again.');
            return;
        }

        const orderDetails = {
            c_id: 1, // Replace with the actual customer ID
            rtr_id: restaurant.rtr_id,
            oo_ordercontents: selectedItems.map((item) => item.name).join(', '),
            oo_pickupdelivery: 'Pickup',
            oo_status: 'Confirmed',
            oo_ordertotal: calculateTotal(),
        };

        fetch('http://localhost:3000/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderDetails),
        })
            .then((res) => res.json())
            .then((data) => {
                alert(`Your order has been placed successfully! Order ID: ${data.orderId}`);
            })
            .catch((err) => {
                console.error('Error placing order:', err);
                alert('Failed to place order. Please try again.');
            });
    };

    if (loading) {
        return <p>Loading menu...</p>;
    }

    return (
        <div className="form-container">
            <h2>Order Online from {restaurant?.rtr_name}</h2>
            <div className="menu-list">
                <h3>Menu</h3>
                <ul>
                    {menuItems.map((item) => (
                        <li
                            key={item.id}
                            onClick={() => handleItemClick(item)}
                            className={selectedItems.includes(item) ? 'selected' : ''}
                        >
                            {item.name} - ${item.price.toFixed(2)}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="order-summary">
                <h4>Total: ${calculateTotal().toFixed(2)}</h4>
                <div className="button-group">
                    <button
                        className="form-button"
                        onClick={handleConfirmOrder}
                        disabled={selectedItems.length === 0}
                    >
                        Confirm Order
                    </button>
                    <button className="form-button secondary" onClick={navigateBack}>Back</button>
                </div>
            </div>
        </div>
    );
};

export default OnlineOrder;
