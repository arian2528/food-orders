import React, { useState, useEffect } from 'react';
import {
  Home, Users, Building, Package, ClipboardList,
  Box, ShoppingBag, X, PanelLeftClose, PanelLeftOpen, Search
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'sales-dashboard-spa-data';

const defaultData = {
  salesReps: [
    { id: 'rep-1', name: 'John Doe', clients: ['client-1', 'client-2', 'client-4'], products: ['prod-1', 'prod-2', 'prod-3'] },
    { id: 'rep-2', name: 'Jane Smith', clients: ['client-3', 'client-5'], products: ['prod-4', 'prod-5', 'prod-6'] }
  ],
  clients: [
    { id: 'client-1', name: 'Cornerstone Cafe', address: '123 Market St', phone: '555-1234', email: 'cornerstone@example.com' },
    { id: 'client-2', name: 'The Bistro', address: '456 Main Rd', phone: '555-5678', email: 'bistro@example.com' },
    { id: 'client-3', name: 'Pizza Palace', address: '789 Elm St', phone: '555-9012', email: 'pizza@example.com' },
    { id: 'client-4', name: 'Urban Eats', address: '101 Modern Ave', phone: '555-1111', email: 'urbaneats@example.com' },
    { id: 'client-5', name: 'Flavor Fusion', address: '222 Gastronomy Ln', phone: '555-2222', email: 'flavorfusion@example.com' },
  ],
  products: [
    { id: 'prod-1', name: 'Tomatoes', description: 'Fresh, ripe tomatoes, perfect for sauces and salads. Sourced from local farms.', unit: 'case' },
    { id: 'prod-2', name: 'Mozzarella', description: 'Italian mozzarella, ideal for pizza and pasta dishes. Creamy and melts perfectly.', unit: 'pk' },
    { id: 'prod-3', name: 'Spaghetti', description: 'Dried spaghetti, a pantry staple for any Italian restaurant.', unit: 'pk' },
    { id: 'prod-4', name: 'Olive Oil', description: 'Extra virgin olive oil from Italy with a robust, peppery flavor.', unit: 'case' },
    { id: 'prod-5', name: 'All-Purpose Flour', description: 'Finely milled for consistent results in baking and cooking. Essential for fresh dough.', unit: 'pk' },
    { id: 'prod-6', name: 'Portobello Mushrooms', description: 'Earthy flavor and meaty texture. Great for grilling, stuffing, or sauces.', unit: 'pk' },
    { id: 'prod-7', name: 'Garlic Bulbs', description: 'A fundamental ingredient that adds a powerful aroma and flavor to any dish.', unit: 'pk' },
    { id: 'prod-8', name: 'Sweet Onions', description: 'Great for caramelizing or using raw in salads. Mild flavor makes them versatile.', unit: 'case' },
    { id: 'prod-9', name: 'Fresh Spinach', description: 'Pre-washed and ready to use. A healthy addition to salads and sautés.', unit: 'pk' },
    { id: 'prod-10', name: 'Italian Sausage', description: 'Ground sausage, seasoned with fennel and other spices. Perfect for various dishes.', unit: 'case' },
    { id: 'prod-11', name: 'Chicken Breast', description: 'Boneless, skinless chicken breast. A lean and versatile protein source.', unit: 'pk' },
    { id: 'prod-12', name: 'Ground Beef', description: 'Lean ground beef, sourced from grass-fed cattle for superior flavor.', unit: 'pk' },
    { id: 'prod-13', name: 'Salmon Fillet', description: 'Fresh Atlantic salmon, rich in omega-3 fatty acids and flavor.', unit: 'pk' },
    { id: 'prod-14', name: 'Jumbo Shrimp', description: 'Peeled and deveined, easy to use in stir-fries, pasta, or as a main course.', unit: 'pk' },
    { id: 'prod-15', name: 'Romaine Lettuce', description: 'Crisp and refreshing heads, perfect for Caesar salads and sandwiches.', unit: 'case' },
    { id: 'prod-16', name: 'Bell Peppers', description: 'Mixed color bell peppers, sweet and crunchy. A colorful addition to any dish.', unit: 'pk' },
    { id: 'prod-17', name: 'Zucchini', description: 'Fresh green zucchini, a versatile vegetable for grilling, roasting, or spiralizing.', unit: 'pk' },
    { id: 'prod-18', name: 'Russet Potatoes', description: 'The best choice for fluffy mashed potatoes or crispy french fries.', unit: 'case' },
    { id: 'prod-19', name: 'Dark Roast Coffee', description: 'Bold and rich coffee beans, sourced from single-origin farms.', unit: 'pk' },
    { id: 'prod-20', name: 'Granulated Sugar', description: 'A classic sweetener for beverages and baked goods. Comes in a large case.', unit: 'case' },
    { id: 'prod-21', name: 'Kosher Salt', description: 'A coarse salt with a clean taste, ideal for seasoning and brining.', unit: 'pk' },
    { id: 'prod-22', name: 'Black Peppercorns', description: 'Whole peppercorns, to be ground fresh for maximum flavor.', unit: 'pk' },
    { id: 'prod-23', name: 'Whole Milk', description: 'Rich and creamy, perfect for coffee, baking, and sauces.', unit: 'case' },
    { id: 'prod-24', name: 'Large Brown Eggs', description: 'Farm-fresh and a versatile protein source for any kitchen.', unit: 'case' },
    { id: 'prod-25', name: 'Sourdough Loaves', description: 'Freshly baked daily with a tangy flavor and a crunchy crust.', unit: 'pk' },
    { id: 'prod-26', name: 'Salted Butter', description: 'Made from high-quality cream, ideal for cooking and baking.', unit: 'pk' },
    { id: 'prod-27', name: 'Greek Yogurt', description: 'Plain, thick, and creamy. Can be used in savory and sweet dishes.', unit: 'case' },
    { id: 'prod-28', name: 'Orange Juice', description: 'Pulp-free orange juice, made from fresh-squeezed oranges.', unit: 'case' },
    { id: 'prod-29', name: 'Gala Apples', description: 'Sweet and crispy, great for snacks, salads, and desserts.', unit: 'pk' },
    { id: 'prod-30', name: 'Ripe Bananas', description: 'A popular fruit for smoothies, desserts, and quick energy.', unit: 'pk' },
  ],
  orders: [
    {
      id: 'ord-1', clientId: 'client-1', status: 'placed',
      items: [
        { productId: 'prod-1', quantity: 12, confirmed: false }, { productId: 'prod-2', quantity: 8, confirmed: true },
        { productId: 'prod-3', quantity: 10, confirmed: false }, { productId: 'prod-4', quantity: 2, confirmed: false },
        { productId: 'prod-5', quantity: 5, confirmed: false }, { productId: 'prod-11', quantity: 15, confirmed: false },
        { productId: 'prod-15', quantity: 4, confirmed: false }, { productId: 'prod-18', quantity: 3, confirmed: false },
        { productId: 'prod-23', quantity: 2, confirmed: false }, { productId: 'prod-24', quantity: 5, confirmed: false },
        { productId: 'prod-25', quantity: 20, confirmed: false }, { productId: 'prod-26', quantity: 10, confirmed: false },
      ],
      createdAt: '2025-09-01T10:00:00Z', // Today
    },
    { id: 'ord-2', clientId: 'client-2', status: 'confirmed', items: [{ productId: 'prod-4', quantity: 1, confirmed: true }, { productId: 'prod-5', quantity: 3, confirmed: true }], createdAt: '2025-08-31T11:00:00Z' },
    { id: 'ord-3', clientId: 'client-3', status: 'submitted', items: [{ productId: 'prod-6', quantity: 4, confirmed: true }, { productId: 'prod-7', quantity: 2, confirmed: true }], createdAt: '2025-08-30T12:00:00Z' },
    { id: 'ord-4', clientId: 'client-4', status: 'placed', items: [{ productId: 'prod-15', quantity: 5, confirmed: false }, { productId: 'prod-19', quantity: 6, confirmed: false }], createdAt: '2025-09-01T14:00:00Z' }, // Today
  ],
  pendingOrders: [
    { clientId: 'client-5', status: 'In-Progress', notes: 'Spoke with chef, expecting a large seafood order by EOD.' },
    { clientId: 'client-2', status: 'Pending', notes: 'Follow up on the last order and suggest seasonal specials.' },
  ],
};

const getInitialData = () => {
  const storedData = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_KEY) : null;
  return storedData ? JSON.parse(storedData) : defaultData;
};

const getClientName = (appData, clientId) => {
  const client = appData.clients.find(c => c.id === clientId);
  return client ? client.name : 'Unknown Client';
};

const getProductDetails = (appData, productId) => {
  return appData.products.find(p => p.id === productId) || { name: 'Unknown', description: '', unit: '' };
};

const DashboardPage = () => (
  <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg shadow-inner">
    <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-700 mb-4">Sales CRM Dashboard</h1>
    <p className="text-lg md:text-xl text-gray-600 max-w-2xl">
      Welcome! This is your centralized hub for managing clients, tracking orders, and organizing your product catalog.
    </p>
  </div>
);

const SalesRepsPage = ({ appData, openModal }) => (
  <>
    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Sales Representatives</h1>
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {appData.salesReps.map(rep => (
          <li
            key={rep.id}
            onClick={() => openModal('salesRep', rep)}
            className="sales-rep-item p-4 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <h3 className="text-lg font-semibold text-gray-900">{rep.name}</h3>
            <p className="text-sm text-gray-600">Clients: {rep.clients.map(id => getClientName(appData, id)).join(', ')}</p>
          </li>
        ))}
      </ul>
    </div>
  </>
);

const ClientsPage = ({ appData, openModal, searchQuery, handleSearchChange, setAppData }) => {
  const filteredClients = appData.clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClientCsvUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const csv = event.target.result;
      const lines = csv.split('\n').slice(1);
      const newClients = lines.map((line, i) => {
        const [name, address, phone, email] = line.split(',');
        return { id: `client-csv-${Date.now()}-${i}`, name, address, phone, email };
      }).filter(c => c.name); // Filter out any empty lines
      
      setAppData(prevData => ({
        ...prevData,
        clients: [...prevData.clients, ...newClients]
      }));
    };
    reader.readAsText(file);
  };

  return (
    <>
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Clients</h1>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <input
          id="client-search"
          type="text"
          placeholder="Search clients..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full sm:max-w-xs px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        <div className="flex gap-2 w-full sm:w-auto">
          <input type="file" id="client-csv-upload" accept=".csv" className="hidden" onChange={handleClientCsvUpload} />
          <label htmlFor="client-csv-upload" className="flex-grow text-center px-6 py-2 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-all cursor-pointer">
            Upload Clients (CSV)
          </label>
          <button
            onClick={() => openModal('client')}
            className="flex-grow px-6 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all"
          >
            Add Client
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {filteredClients.map(client => (
            <li key={client.id} className="p-4">
              <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
              <p className="text-sm text-gray-600">{client.address}</p>
              <p className="text-sm text-gray-600">Phone: {client.phone} | Email: {client.email}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

const ProductsPage = ({ appData, openModal, productPage, setProductPage }) => {
  const { searchQuery, currentPage, productsPerPage } = productPage;
  const filteredProducts = appData.products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const currentProducts = filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

  const handleCsvUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const csv = event.target.result;
      const lines = csv.split('\n').slice(1);
      const newProducts = lines.map((line, i) => {
        const [name, description, unit] = line.split(',');
        return { id: `prod-csv-${Date.now()}-${i}`, name, description, unit: unit.trim() };
      }).filter(p => p.name && p.description && p.unit);
      
      const updatedData = {
        ...appData,
        products: [...appData.products, ...newProducts]
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedData));
      // You would normally use a state setter here, but since the parent component manages the state, we can't do it directly.
      // This is a limitation of the single-file setup. A real app would pass a setter function down.
      window.location.reload(); 
    };
    reader.readAsText(file);
  };

  return (
    <>
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Products</h1>
      <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-6 gap-4">
        <input
          id="product-search"
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setProductPage({ ...productPage, searchQuery: e.target.value, currentPage: 1 })}
          className="w-full sm:max-w-xs px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        <div className="flex gap-2 w-full sm:w-auto">
          <input type="file" id="csv-upload" accept=".csv" className="hidden" onChange={handleCsvUpload} />
          <label htmlFor="csv-upload" className="flex-grow text-center px-6 py-2 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-all cursor-pointer">
            Upload CSV
          </label>
          <button
            onClick={() => openModal('product')}
            className="flex-grow px-6 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all"
          >
            Add Product
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Unit</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentProducts.map(p => (
              <tr key={p.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{p.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  {p.unit === 'case' ? <Box className="w-5 h-5 inline-block" /> : <ShoppingBag className="w-5 h-5 inline-block" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setProductPage({ ...productPage, currentPage: currentPage - 1 })}
          className="pagination-btn px-4 py-2 text-sm font-medium rounded-full text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-sm text-gray-700">Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setProductPage({ ...productPage, currentPage: currentPage + 1 })}
          className="pagination-btn px-4 py-2 text-sm font-medium rounded-full text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentPage >= totalPages}
        >
          Next
        </button>
      </div>
    </>
  );
};

const OrdersPage = ({ appData, openModal, setAppData }) => {
  const today = new Date().toISOString().split('T')[0];
  const todaysOrders = appData.orders.filter(o => o.createdAt.startsWith(today));

  const getOrderSummary = (items) => items.map(item => getProductDetails(appData, item.productId).name).join(', ');

  const OrderRow = ({ order }) => (
    <tr
      onClick={() => openModal('order', order)}
      className="order-row cursor-pointer hover:bg-gray-100 transition-colors"
    >
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {getClientName(appData, order.clientId)}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate" title={getOrderSummary(order.items)}>
        {getOrderSummary(order.items)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(order.createdAt).toLocaleDateString()}
      </td>
    </tr>
  );

  return (
    <>
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Orders</h1>
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Today's Placed Orders</h2>
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="th">Client</th>
                  <th className="th">Products Summary</th>
                  <th className="th">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {todaysOrders.length > 0 ? (
                  todaysOrders.map(order => <OrderRow key={order.id} order={order} />)
                ) : (
                  <tr><td colSpan="3" className="text-center p-4 text-gray-500">No orders placed today.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Pending Orders</h2>
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="th">Client</th>
                  <th className="th">Status</th>
                  <th className="th">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {appData.pendingOrders.map((po, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{getClientName(appData, po.clientId)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{po.status}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{po.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-gray-700 mb-4">All Orders</h2>
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="th">Client</th>
                  <th className="th">Products Summary</th>
                  <th className="th">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {appData.orders.map(order => <OrderRow key={order.id} order={order} />)}
              </tbody>
            </table>
          </div>
        </section>
      </div>
      <style>{`.th { padding: 0.75rem 1.5rem; text-align: left; font-size: 0.75rem; font-weight: 500; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; }`}</style>
    </>
  );
};

const Modal = ({ title, content, closeModal }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50 backdrop-blur-sm">
    <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-4xl max-h-[90vh] flex flex-col transform animate-scale-in">
      <div className="flex justify-between items-center pb-3 border-b border-gray-200 mb-4">
        <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
        <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>
      <div className="overflow-y-auto">{content}</div>
    </div>
  </div>
);

const AddClientModal = ({ setAppData, closeModal }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newClient = {
      id: `client-${Date.now()}`,
      name: formData.get('name'),
      address: formData.get('address'),
      phone: formData.get('phone'),
      email: formData.get('email'),
    };
    setAppData(prevData => ({
      ...prevData,
      clients: [...prevData.clients, newClient]
    }));
    closeModal();
  };

  const content = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="text" name="name" placeholder="Name" className="w-full px-4 py-2 border rounded-md" required />
      <input type="text" name="address" placeholder="Address" className="w-full px-4 py-2 border rounded-md" required />
      <input type="tel" name="phone" placeholder="Phone" className="w-full px-4 py-2 border rounded-md" required />
      <input type="email" name="email" placeholder="Email" className="w-full px-4 py-2 border rounded-md" required />
      <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Add Client</button>
    </form>
  );
  return <Modal title="Add New Client" content={content} closeModal={closeModal} />;
};

const AddProductForRepModal = ({ setAppData, closeModal, repId, appData }) => {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [unit, setUnit] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filteredProducts = productName.trim()
    ? appData.products.filter(p => p.name.toLowerCase().includes(productName.toLowerCase()))
    : [];

  const handleSelectExisting = (product) => {
    setSelectedProduct(product);
    setProductName(product.name);
    setDescription(product.description);
    setUnit(product.unit);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let productIdToAdd;
    let newProducts = [...appData.products];
    let newReps = [...appData.salesReps];

    if (selectedProduct) {
      productIdToAdd = selectedProduct.id;
    } else {
      const newProduct = {
        id: `prod-${Date.now()}`,
        name: productName,
        description: description,
        unit: unit,
      };
      newProducts.push(newProduct);
      productIdToAdd = newProduct.id;
    }

    // Find the sales rep and add the product ID
    const repIndex = newReps.findIndex(rep => rep.id === repId);
    if (repIndex > -1) {
      const repProducts = new Set(newReps[repIndex].products);
      repProducts.add(productIdToAdd);
      newReps[repIndex].products = Array.from(repProducts);
    }
    
    setAppData(prevData => ({
      ...prevData,
      products: newProducts,
      salesReps: newReps,
    }));

    closeModal();
  };
  
  const content = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <input
          type="text"
          name="productName"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => {
            setProductName(e.target.value);
            setSelectedProduct(null);
          }}
          className="w-full px-4 py-2 border rounded-md"
          required
        />
        {productName && filteredProducts.length > 0 && !selectedProduct && (
          <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md mt-1 shadow-lg max-h-48 overflow-y-auto">
            {filteredProducts.map(product => (
              <li
                key={product.id}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSelectExisting(product)}
              >
                {product.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <textarea
        name="description"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full px-4 py-2 border rounded-md"
        required
      />
      <input
        type="text"
        name="unit"
        placeholder="Unit (e.g., case or pk)"
        value={unit}
        onChange={(e) => setUnit(e.target.value)}
        className="w-full px-4 py-2 border rounded-md"
        required
      />
      <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
        {selectedProduct ? 'Add Existing Product' : 'Add New Product'}
      </button>
    </form>
  );
  return <Modal title="Add Product to Rep" content={content} closeModal={closeModal} />;
};

const SalesRepModal = ({ appData, rep, closeModal, openModal }) => {
  const repProducts = rep.products.map(productId => getProductDetails(appData, productId));
  const repClients = rep.clients.map(clientId => appData.clients.find(c => c.id === clientId)).filter(Boolean);

  const content = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-700">Clients</h2>
          <button onClick={() => openModal('client')} className="text-blue-600 text-sm font-semibold hover:underline">
            Add Client
          </button>
        </div>
        <ul className="divide-y divide-gray-200 border rounded-lg">
          {repClients.length > 0 ? repClients.map(client => (
            <li key={client.id} className="p-4">
              <p className="font-semibold">{client.name}</p>
              <p className="text-sm text-gray-500">{client.address}</p>
            </li>
          )) : <li className="p-4 text-gray-500">No clients assigned.</li>}
        </ul>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-700">Products</h2>
          <button onClick={() => openModal('addProductForRep', rep.id)} className="text-blue-600 text-sm font-semibold hover:underline">
            Add Product
          </button>
        </div>
        <ul className="divide-y divide-gray-200 border rounded-lg">
          {repProducts.length > 0 ? repProducts.map(product => (
            <li key={product.id} className="p-4 flex items-center">
              <span className="text-gray-500 mr-2">{product.unit === 'case' ? <Box className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}</span>
              <div>
                <p className="font-semibold">{product.name}</p>
                <p className="text-sm text-gray-500 truncate" title={product.description}>{product.description}</p>
              </div>
            </li>
          )) : <li className="p-4 text-gray-500">No products assigned.</li>}
        </ul>
      </div>
    </div>
  );
  return <Modal title={`Details for ${rep.name}`} content={content} closeModal={closeModal} />;
};

const OrderModal = ({ appData, order, setAppData, closeModal }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = order.items.filter(item =>
    getProductDetails(appData, item.productId).name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConfirmChange = (e, productId) => {
    const newConfirmedStatus = e.target.checked;
    setAppData(prevData => {
      const updatedOrders = prevData.orders.map(o => {
        if (o.id === order.id) {
          const updatedItems = o.items.map(item =>
            item.productId === productId ? { ...item, confirmed: newConfirmedStatus } : item
          );
          return { ...o, items: updatedItems };
        }
        return o;
      });
      return { ...prevData, orders: updatedOrders };
    });
  };

  const content = (
    <div className="space-y-4">
      <div className="relative flex items-center">
        <Search className="absolute left-3 w-5 h-5 text-gray-400" />
        <input
          id="order-item-search"
          type="text"
          placeholder="Search products in order..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-10 py-2 border rounded-md"
        />
      </div>
      <div className="overflow-y-auto max-h-[50vh]">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="th w-1/4">Product</th>
              <th className="th w-1/2">Description</th>
              <th className="th">Unit</th>
              <th className="th">Qty</th>
              <th className="th">Confirmed</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredItems.map(item => {
              const product = getProductDetails(appData, item.productId);
              return (
                <tr key={item.productId}>
                  <td className="px-6 py-4 text-sm font-medium">{product.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-sm truncate" title={product.description}>{product.description}</td>
                  <td className="px-6 py-4 text-center text-xl">
                    {product.unit === 'case' ? <Box className="w-5 h-5 inline-block" /> : <ShoppingBag className="w-5 h-5 inline-block" />}
                  </td>
                  <td className="px-6 py-4 text-center text-sm">{item.quantity}</td>
                  <td className="px-6 py-4 text-center">
                    <input
                      type="checkbox"
                      className="order-item-confirm h-5 w-5 text-green-600"
                      checked={item.confirmed}
                      onChange={(e) => handleConfirmChange(e, item.productId)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
  return <Modal title={`Order Details: ${getClientName(appData, order.clientId)}`} content={content} closeModal={closeModal} />;
};


export default function App() {
  const [appData, setAppData] = useState(getInitialData);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [modal, setModal] = useState({ type: null, data: null });
  const [clientSearch, setClientSearch] = useState('');
  const [productPage, setProductPage] = useState({
    searchQuery: '',
    currentPage: 1,
    productsPerPage: 10,
  });

  // Persist data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(appData));
  }, [appData]);

  const openModal = (type, data = null) => {
    setModal({ type, data });
  };

  const closeModal = () => {
    setModal({ type: null, data: null });
  };

  const renderModalContent = () => {
    switch (modal.type) {
      case 'salesRep':
        return <SalesRepModal appData={appData} rep={modal.data} closeModal={closeModal} openModal={openModal} />;
      case 'addProductForRep':
        return <AddProductForRepModal setAppData={setAppData} closeModal={closeModal} repId={modal.data} appData={appData} />;
      case 'client':
        return <AddClientModal setAppData={setAppData} closeModal={closeModal} />;
      case 'order':
        return <OrderModal appData={appData} order={modal.data} setAppData={setAppData} closeModal={closeModal} />;
      default:
        return null;
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'sales-reps':
        return <SalesRepsPage appData={appData} openModal={openModal} />;
      case 'clients':
        return <ClientsPage appData={appData} openModal={openModal} searchQuery={clientSearch} handleSearchChange={(e) => setClientSearch(e.target.value)} setAppData={setAppData} />;
      case 'products':
        return <ProductsPage appData={appData} openModal={openModal} productPage={productPage} setProductPage={setProductPage} />;
      case 'orders':
        return <OrdersPage appData={appData} openModal={openModal} setAppData={setAppData} />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Navigation */}
      <aside className={`bg-gray-800 text-white p-4 flex-shrink-0 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="flex items-center justify-between h-16 mb-8">
          <span className={`text-2xl font-bold transition-opacity duration-300 ${isSidebarOpen ? '' : 'opacity-0'}`}>CRM</span>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-400 hover:text-white transition-colors">
            {isSidebarOpen ? <PanelLeftClose className="w-6 h-6" /> : <PanelLeftOpen className="w-6 h-6" />}
          </button>
        </div>
        <nav className="flex-1 space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Home },
            { id: 'sales-reps', label: 'Sales Reps', icon: Users },
            { id: 'clients', label: 'Clients', icon: Building },
            { id: 'products', label: 'Products', icon: Package },
            { id: 'orders', label: 'Orders', icon: ClipboardList },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-4 transition-colors duration-200 ${
                currentPage === item.id ? 'bg-gray-700 text-blue-400' : 'hover:bg-gray-700 text-gray-300'
              }`}
            >
              <item.icon className="text-xl" />
              <span className={`font-medium ${!isSidebarOpen ? 'hidden' : ''}`}>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 md:p-8 min-h-full">
          {renderPage()}
        </div>
      </main>

      {/* Modal Container */}
      {modal.type && renderModalContent()}
    </div>
  );
}
