import axios from 'axios';
import Layout from '../../components/Layout';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function NewProduct() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [goToProducts, setGpToProducts] = useState(false);
    const router = useRouter();
    async function createProduct(ev) {
        ev.preventDefault();
        data={title, description, price};
       await axios.post('/api/products', data);
       setGpToProducts(true);
    }
    if (goToProducts) {
        return router.push('/products');
    }
    return <Layout>
        <form onSubmit={createProduct}>
        <h1>New Product</h1>
        <label>Product Name</label><br/>
        <input type="text" 
        placeholder="Product Name"
        value={title}
        onChange={ev => setTitle(ev.target.value)} /><br/>

        <label>Product Description</label><br/>
        <textarea 
        placeholder="Product Description" 
        value={description}
        onChange={ev => setDescription(ev.target.value)}/><br/>
        <label>Price (in &#8358;)</label><br/>
        <input type="number" 
        placeholder="Price"
        value={price}
            onChange={ev => setPrice(ev.target.value)} /><br/>
        <button type="submit" className="btn-primary">Add Product</button> 
        </form>
        </Layout>;
}