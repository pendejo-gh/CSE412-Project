// CSE 412 
// Team Members: Smit Desai, Tanmay Chaudhari, Christopher Hernandez, Gage Smith

import React, { useState, useEffect } from 'react';

const Menu = () => <span>🍴</span>;
const Table = () => <span>🪑</span>;

const Card = ({ children, className }) => (
    <div className={`p-4 shadow-md rounded-md ${className}`}>{children}</div>
);

const CardHeader = ({ children, className }) => (
    <div className={`border-b p-2 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className }) => (
    <h2 className={`text-lg font-bold ${className}`}>{children}</h2>
);

const CardContent = ({ children, className }) => (
    <div className={`p-2 ${className}`}>{children}</div>
);

const RestaurantAdmin = ({ onLogout }) => {
    const [restaurants, setRestaurants] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tables, setTables] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [tableCapacity, setTableCapacity] = useState('');
    const [newItemName, setNewItemName] = useState('');
    const [newItemPrice, setNewItemPrice] = useState('');
    const primaryGreen = '#2B5741';

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await fetch('http://localhost:3000/restaurants');
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setRestaurants(data);
                if (data.length > 0) {
                    setSelectedRestaurant(data[0]);
                    await fetchRestaurantData(data[0].rtr_id);
                }
                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching restaurants:', err);
                setError('Failed to load restaurants');
                setIsLoading(false);
            }
        };

        fetchRestaurants();
    }, []);

    const handleRestaurantChange = async (e) => {
        const rtr_id = e.target.value;
        const restaurant = restaurants.find((r) => r.rtr_id === parseInt(rtr_id));
        setSelectedRestaurant(restaurant);
        if (restaurant) {
            await fetchRestaurantData(restaurant.rtr_id);
        }
    };

    const fetchRestaurantData = async (rtr_id) => {
        try {
            setIsLoading(true);
            const tablesResponse = await fetch(`http://localhost:3000/restaurants/${rtr_id}/tables`);
            if (!tablesResponse.ok) throw new Error('Failed to fetch tables');
            const tablesData = await tablesResponse.json();
            setTables(tablesData);

            const menuResponse = await fetch(`http://localhost:3000/restaurants/${rtr_id}/menu`);
            if (!menuResponse.ok) throw new Error('Failed to fetch menu items');
            const menuData = await menuResponse.json();
            setMenuItems(menuData || []);

            setIsLoading(false);
        } catch (err) {
            console.error('Error fetching restaurant data:', err);
            setError(`Failed to load restaurant data for rtr_id ${rtr_id}: ${err.message}`);
            setIsLoading(false);
        }
    };

    const addMenuItem = async () => {
        try {
            if (!newItemName || !newItemPrice) {
                setError('Please provide both item name and price');
                return;
            }
            const response = await fetch(`http://localhost:3000/restaurants/${selectedRestaurant.rtr_id}/menu`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ item_name: newItemName, item_price: newItemPrice }),
            });
            if (!response.ok) throw new Error('Failed to add menu item');
            const newItem = await response.json();
            setMenuItems((prevItems) => [...prevItems, newItem]);
            setNewItemName('');
            setNewItemPrice('');
        } catch (err) {
            console.error('Error adding menu item:', err);
            setError('Failed to add menu item: ' + err.message);
        }
    };

    const deleteMenuItem = async (menuId) => {
        try {
            await fetch(`http://localhost:3000/restaurants/${selectedRestaurant.rtr_id}/menu/${menuId}`, {
                method: 'DELETE',
            });
            setMenuItems((prevItems) => prevItems.filter((item) => item.menu_id !== menuId));
        } catch (err) {
            console.error('Error deleting menu item:', err);
            setError('Failed to delete menu item');
        }
    };

    const addTable = async () => {
        try {
            if (!tableCapacity) {
                setError('Please enter table capacity');
                return;
            }
            const response = await fetch(`http://localhost:3000/restaurants/${selectedRestaurant.rtr_id}/tables`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ t_capacity: tableCapacity }),
            });
            if (!response.ok) throw new Error('Failed to add table');
            const newTable = await response.json();
            setTables((prevTables) => [...prevTables, newTable]);
            setTableCapacity('');
        } catch (err) {
            console.error('Error adding table:', err);
            setError('Failed to add table: ' + err.message);
        }
    };

    const deleteTable = async (tableId) => {
        try {
            await fetch(`http://localhost:3000/restaurants/${selectedRestaurant.rtr_id}/tables/${tableId}`, {
                method: 'DELETE',
            });
            setTables((prevTables) => prevTables.filter((table) => table.t_id !== tableId));
        } catch (err) {
            console.error('Error deleting table:', err);
            setError('Failed to delete table');
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="min-h-screen p-8 relative">
            <div className="header flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-center" style={{ color: primaryGreen }}>
                    Restaurant Admin Dashboard
                </h1>
                <button
                    onClick={onLogout}
                    className="logout-button bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                    Logout
                </button>
            </div>
            <div className="mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Select Restaurant</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <select
                            value={selectedRestaurant?.rtr_id || ''}
                            onChange={handleRestaurantChange}
                            className="w-full p-2 border rounded-md"
                        >
                            <option value="">Select a restaurant</option>
                            {restaurants.map((restaurant) => (
                                <option key={restaurant.rtr_id} value={restaurant.rtr_id}>
                                    {restaurant.rtr_name}
                                </option>
                            ))}
                        </select>
                    </CardContent>
                </Card>
            </div>
            {selectedRestaurant && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                <Table /> Table Management
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div>
                                <h3 className="font-bold mb-2">Existing Tables:</h3>
                                {tables.length > 0 ? (
                                    tables.map((table) => (
                                        <div key={table.t_id} className="p-2 border rounded-md mb-2">
                                            <p><strong>Table ID:</strong> {table.t_id}</p>
                                            <p><strong>Capacity:</strong> {table.t_capacity}</p>
                                            <p><strong>Status:</strong> {table.t_status}</p>
                                            <button
                                                onClick={() => deleteTable(table.t_id)}
                                                className="bg-red-500 text-white px-2 py-1 mt-2 rounded-md hover:bg-red-600"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p>No tables available for this restaurant.</p>
                                )}
                            </div>
                            <div className="mt-4">
                                <label>Capacity</label>
                                <input
                                    type="number"
                                    value={tableCapacity}
                                    onChange={(e) => setTableCapacity(e.target.value)}
                                    className="w-full p-2 border rounded-md mb-4"
                                />
                                <button
                                    type="button"
                                    onClick={addTable}
                                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                                >
                                    Add Table
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                <Menu /> Menu Management
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div>
                                <h3 className="font-bold mb-2">Existing Menu Items:</h3>
                                {menuItems.length > 0 ? (
                                    menuItems.map((item) => (
                                        <div key={item.menu_id} className="p-2 border rounded-md mb-2">
                                            <p><strong>Item Name:</strong> {item.item_name}</p>
                                            <p><strong>Price:</strong> ${item.item_price}</p>
                                            <button
                                                onClick={() => deleteMenuItem(item.menu_id)}
                                                className="bg-red-500 text-white px-2 py-1 mt-2 rounded-md hover:bg-red-600"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p>No menu items available for this restaurant.</p>
                                )}
                            </div>
                            <form className="mt-4">
                                <label>Item Name</label>
                                <input
                                    type="text"
                                    value={newItemName}
                                    onChange={(e) => setNewItemName(e.target.value)}
                                    className="w-full p-2 border rounded-md mb-4"
                                />
                                <label>Price</label>
                                <input
                                    type="number"
                                    value={newItemPrice}
                                    onChange={(e) => setNewItemPrice(e.target.value)}
                                    className="w-full p-2 border rounded-md mb-4"
                                />
                                <button
                                    type="button"
                                    onClick={addMenuItem}
                                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                                >
                                    Add Menu Item
                                </button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default RestaurantAdmin;
