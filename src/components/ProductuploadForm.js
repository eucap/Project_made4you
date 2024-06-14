import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductUploadForm.css';

const ProductUploadForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        price: '',
        actualPrice: '',
        discount: '',
        description: '',
        pageCategory: '',
        productType: '',
        images: []
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        if (e.target.name === 'images') {
            setFormData({
                ...formData,
                images: e.target.files
            });
        } else {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value
            });
        }
    };

    const calculateDiscount = (price, actualPrice) => {
        return Math.round(((actualPrice - price) / actualPrice) * 100);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const discount = calculateDiscount(formData.price, formData.actualPrice);
        const form = new FormData();
        for (let key in formData) {
            if (key === 'images') {
                Array.from(formData.images).forEach(image => {
                    form.append('images', image);
                });
            } else {
                form.append(key, formData[key]);
            }
        }
        form.append('discount', discount);

        try {
            const response = await fetch('http://localhost:5000/api/products', {
                method: 'POST',
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                },
                body: form
            });
            const data = await response.json();
            if (response.ok) {
                alert('Product uploaded successfully');
                navigate('/dashboard');
            } else {
                alert(data.msg || 'Failed to upload product');
            }
        } catch (error) {
            console.error('Error uploading product:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="product-upload-form">
            <div className="form-group">
                <label htmlFor="name">Product Name</label>
                <input type="text" name="name" placeholder="Product Name" onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label htmlFor="brand">Brand</label>
                <input type="text" name="brand" placeholder="Brand" onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label htmlFor="price">Price</label>
                <input type="number" name="price" placeholder="Price" onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label htmlFor="actualPrice">Actual Price</label>
                <input type="number" name="actualPrice" placeholder="Actual Price" onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea name="description" placeholder="Description" onChange={handleChange} required></textarea>
            </div>
            <div className="form-group">
                <label htmlFor="pageCategory">Page Category</label>
                <select name="pageCategory" onChange={handleChange} required>
                    <option value="">Select Page Category</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="kids">Kids</option>
                    <option value="accessories">Accessories</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="productType">Product Type</label>
                <select name="productType" onChange={handleChange} required>
                    <option value="">Select Product Type</option>
                    <option value="shirt">Shirt</option>
                    <option value="t-shirt">T-Shirt</option>
                    <option value="jeans">Jeans</option>
                   
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="images">Images</label>
                <input type="file" name="images" multiple onChange={handleChange} required />
            </div>
            <button type="submit">Upload Product</button>
        </form>
    );
};

export default ProductUploadForm;
