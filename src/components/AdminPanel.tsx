import React, { useState, useEffect } from 'react';
import axios from 'axios'; 

type Product = {
  id: number;
  name: string;
  price: number;
  brand: string;
};

const AdminPanel: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  const [form, setForm] = useState({
    name: '',
    price: 0,
    brand: ''
  });

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://192.168.31.102:3000/api/get');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async () => {
    try {
      const response = await axios.post('http://192.168.31.102:3000/api/products', form);
      const newProduct = response.data;
      setProducts([...products, newProduct]);
      setForm({ name: '', price: 0, brand: '' });
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleEditProduct = async () => {
    if (currentProduct) {
      try {
        const response = await axios.put(`http://192.168.31.102:3000/api/update?id=${currentProduct.id}`, form);
        const updatedProduct = response.data;
        setProducts(products.map(product => 
          product.id === currentProduct.id ? updatedProduct : product
        ));
        setForm({ name: '', price: 0, brand: '' });
        setCurrentProduct(null);
        setIsEditModalOpen(false);
      } catch (error) {
        console.error('Error updating product:', error);
      }
    }
  };

  const openEditModal = (product: Product) => {
    setCurrentProduct(product);
    setForm({ name: product.name, price: product.price, brand: product.brand });
    setIsEditModalOpen(true);
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      <button style={{ backgroundColor: 'green', color: 'white' }} onClick={() => setIsAddModalOpen(true)}>
        Add Product
      </button>

      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Price</th>
            <th>Brand</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.brand}</td>
              <td>
                <button style={{ backgroundColor: 'blue', color: 'white' }} onClick={() => openEditModal(product)}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isAddModalOpen && (
        <div className="modal">
          <h2>Add Product</h2>
          <label>Product Name: <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label>
          <label>Price: <input type="number" value={form.price} onChange={e => setForm({ ...form, price: parseFloat(e.target.value) })} /></label>
          <label>Brand: <input type="text" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} /></label>
          <button onClick={handleAddProduct}>Add</button>
          <button onClick={() => setIsAddModalOpen(false)}>Cancel</button>
        </div>
      )}

      {isEditModalOpen && (
        <div className="modal">
          <h2>Edit Product</h2>
          <label>Product Name: <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label>
          <label>Price: <input type="number" value={form.price} onChange={e => setForm({ ...form, price: parseFloat(e.target.value) })} /></label>
          <label>Brand: <input type="text" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} /></label>
          <button onClick={handleEditProduct}>Save</button>
          <button onClick={() => setIsEditModalOpen(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
