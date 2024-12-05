import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Menu, Table } from 'lucide-react';  // Removed unused imports

const RestaurantAdmin = () => {
  // Restaurant states
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  
  // UI states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Data states
  const [tables, setTables] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  
  // Form states
  const [numTables, setNumTables] = useState('');
  const [tableCapacity, setTableCapacity] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');

  // Styling constants
  const primaryGreen = '#2B5741';
  const lightGreen = '#E8F0EB';

  // Initial data fetch
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/restaurants');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
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

  // Event Handlers
  const handleRestaurantChange = async (e) => {
    const rtr_id = e.target.value;
    const restaurant = restaurants.find(r => r.rtr_id === parseInt(rtr_id));
    setSelectedRestaurant(restaurant);
    if (restaurant) {
      await fetchRestaurantData(restaurant.rtr_id);
    }
  };

  const handleAddTables = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5001/api/restaurants/${selectedRestaurant.rtr_id}/tables`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          numTables: parseInt(numTables),
          capacity: parseInt(tableCapacity)
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to add tables');
      }
      const newTables = await response.json();
      setTables([...tables, ...newTables]);
      setNumTables('');
      setTableCapacity('');
    } catch (err) {
      setError('Failed to add tables: ' + err.message);
    }
  };
  
  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    try {
        console.log('Adding menu item:', {
            restaurantId: selectedRestaurant.rtr_id,
            name: newItemName,
            price: parseFloat(newItemPrice)
        });

        const response = await fetch(`http://localhost:5001/api/restaurants/${selectedRestaurant.rtr_id}/menu`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: newItemName,
                price: parseFloat(newItemPrice)
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || errorData.details || 'Failed to add menu item');
        }

        const newItem = await response.json();
        console.log('New menu item added:', newItem);

        // Refresh the menu items
        await fetchRestaurantData(selectedRestaurant.rtr_id);
        
        // Clear the form
        setNewItemName('');
        setNewItemPrice('');
    } catch (err) {
        console.error('Error adding menu item:', err);
        setError(`Failed to add menu item: ${err.message}`);
    }
};

// Fetch restaurant data
const fetchRestaurantData = async (rtr_id) => {
    try {
        setIsLoading(true);
        
        // Fetch tables
        const tablesResponse = await fetch(`http://localhost:5001/api/restaurants/${rtr_id}/tables`);
    if (!tablesResponse.ok) {
      throw new Error('Failed to fetch tables');
    }
    const tablesData = await tablesResponse.json();
    setTables(tablesData);

        // Fetch menu items
        const menuResponse = await fetch(`http://localhost:5001/api/restaurants/${rtr_id}/menu`);
        if (!menuResponse.ok) {
            throw new Error('Failed to fetch menu items');
        }
        const menuData = await menuResponse.json();
        console.log('Fetched menu items:', menuData);
        setMenuItems(menuData);

        setIsLoading(false);
    } catch (err) {
        console.error('Error fetching restaurant data:', err);
        setError('Failed to load restaurant data: ' + err.message);
        setIsLoading(false);
      }
};

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-center">
        <h2 className="text-xl font-semibold text-gray-600">Loading...</h2>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-center">
        <div className="text-red-600">
          <h2 className="text-xl font-semibold">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold mb-8 text-center" style={{ color: primaryGreen }}>
        Restaurant Admin Dashboard
      </h1>

      {/* Restaurant Selector */}
      <div className="max-w-7xl mx-auto mb-8">
        <Card className="shadow-lg">
          <CardHeader style={{ backgroundColor: lightGreen }}>
            <CardTitle className="flex items-center gap-2" style={{ color: primaryGreen }}>
              Select Restaurant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <select
              value={selectedRestaurant?.rtr_id || ''}
              onChange={handleRestaurantChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2"
            >
              <option value="">Select a restaurant</option>
              {restaurants.map(restaurant => (
                <option key={`restaurant-${restaurant.rtr_id}`} value={restaurant.rtr_id}>
                  {restaurant.rtr_name} - {restaurant.rtr_foodtype.trim()}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>
      </div>

      {selectedRestaurant ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Tables Management */}
          <Card className="shadow-lg">
            <CardHeader style={{ backgroundColor: lightGreen }}>
              <CardTitle className="flex items-center gap-2" style={{ color: primaryGreen }}>
                <Table className="w-6 h-6" />
                Table Management
              </CardTitle>
            </CardHeader>
            <CardContent className="mt-4">
              <form onSubmit={handleAddTables} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: primaryGreen }}>
                    Number of Tables
                  </label>
                  <input
                    type="number"
                    value={numTables}
                    onChange={(e) => setNumTables(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: primaryGreen }}>
                    Capacity per Table
                  </label>
                  <input
                    type="number"
                    value={tableCapacity}
                    onChange={(e) => setTableCapacity(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2"
                    min="1"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 rounded text-white"
                  style={{ backgroundColor: primaryGreen }}
                >
                  Add Tables
                </button>
              </form>
              <div className="mt-6">
  <h3 className="font-medium mb-2" style={{ color: primaryGreen }}>
    Current Tables ({tables.length})
  </h3>
  <div className="grid grid-cols-2 gap-2">
    {tables.map(table => (
      <div key={`table-${table.t_id}`} className="p-3 rounded border" style={{ backgroundColor: lightGreen }}>
        <div style={{ color: primaryGreen }}>Table #{table.t_id}</div>
        <div className="text-sm text-gray-600">Capacity: {table.t_capacity}</div>
        <div className="text-sm text-gray-600">Status: {table.t_status}</div>
      </div>
    ))}
  </div>
</div>
            </CardContent>
          </Card>

          {/* Menu Management */}
          <Card className="shadow-lg">
            <CardHeader style={{ backgroundColor: lightGreen }}>
              <CardTitle className="flex items-center gap-2" style={{ color: primaryGreen }}>
                <Menu className="w-6 h-6" />
                Menu Management
              </CardTitle>
            </CardHeader>
            <CardContent className="mt-4">
              <form onSubmit={handleAddMenuItem} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: primaryGreen }}>
                    Item Name
                  </label>
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: primaryGreen }}>
                    Price
                  </label>
                  <input
                    type="number"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2"
                    step="0.01"
                    min="0"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 rounded text-white"
                  style={{ backgroundColor: primaryGreen }}
                >
                  Add Menu Item
                </button>
              </form>
              <div className="mt-6">
                <h3 className="font-medium mb-2" style={{ color: primaryGreen }}>
                  Current Menu Items ({menuItems.length})
                </h3>
                <div className="space-y-2">
                  {menuItems.map((item) => (
                    <div
                      key={`menu-${item.menu_id}`}
                      className="p-3 rounded border flex justify-between items-center"
                      style={{ backgroundColor: lightGreen }}
                    >
                      <div style={{ color: primaryGreen }}>{item.item_name}</div>
                      <div className="text-gray-600">${Number(item.item_price).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center text-gray-600">
          Please select a restaurant to manage
        </div>
      )}
    </div>
  );
};

export default RestaurantAdmin;