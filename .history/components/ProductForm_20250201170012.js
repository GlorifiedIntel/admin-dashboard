import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Layout from './Layout';

export default function ProductForm({
    title: existingTitle,
    description: existingDescription,
    price: existingPrice,
    id, // Product id (for editing)
}) {
    const [title, setTitle] = useState(existingTitle || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [price, setPrice] = useState(existingPrice || '');
    const [goToProducts, setGoToProducts] = useState(false);
    const router = useRouter();

    // If editing, we need to update the title, description, and price based on existing values
    useEffect(() => {
        if (existingTitle) setTitle(existingTitle);
        if (existingDescription) setDescription(existingDescription);
        if (existingPrice) setPrice(existingPrice);
    }, [existingTitle, existingDescription, existingPrice]);

    // Function to handle form submission (for creating and editing)
    async function handleSubmit(ev) {
        ev.preventDefault();
        const data = { title, description, price };

        try {
            if (id) {
                // Edit existing product
                await axios.put(`/api/products?id=${id}`, data);
            } else {
                // Create new product
                await axios.post('/api/products', data);
            }
            setGoToProducts(true);
        } catch (error) {
            console.error("Error saving product:", error);
        }
    }

    // Redirect after form submission
    if (goToProducts) {
        router.push('/products');
    }

    return (
        <Layout>
            <form onSubmit={handleSubmit}>
                <label>Product Name</label><br />
                <input
                    type="text"
                    placeholder="Product Name"
                    value={title}
                    onChange={(ev) => setTitle(ev.target.value)}
                /><br />

                <label>Product Description</label><br />
                <textarea
                    placeholder="Product Description"
                    value={description}
                    onChange={(ev) => setDescription(ev.target.value)}
                /><br />

                <label>Price (in &#8358;)</label><br />
                <input
                    type="number"
                    placeholder="Price"
                    value={price}
                    onChange={(ev) => setPrice(ev.target.value)}
                /><br />

                <button type="submit" className="btn-primary">
                    {id ? 'Update Product' : 'Add Product'}
                </button>
            </form>
        </Layout>
    );
}
