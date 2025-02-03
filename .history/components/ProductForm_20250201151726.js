import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Layout from './Layout';

export default function ProductForm({
    title: existingTitle, 
    description: existingDescription, 
    price: existingPrice,
}) {
    const [title, setTitle] = useState(existingTitle ||'');
    const [description, setDescription] = useState(existingDescription ||'');
    const [price, setPrice] = useState(existingPrice || '');
    const [goToProducts, setGoToProducts] = useState(false); 
    const router = useRouter();

    async function createProduct(ev) {
        ev.preventDefault();
        const data = { title, description, price }; 
        await axios.post('/api/products', data);
        setGoToProducts(true);
    }

    if (goToProducts) {
        router.push('/products');
    }

    return (
        <Layout>
            <form onSubmit={createProduct}>
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
                    Add Product
                </button>
            </form>
        </Layout>
    )}