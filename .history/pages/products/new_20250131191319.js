import Layout from '../../components/Layout';
import { useState } from 'react';

export default function NewProduct() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    return <Layout>
        <form onSubmit={(ev) => { ev.preventDefault(); /* handle form submission */ }}>
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
       </form>
       <button type="submit" className="btn-primary">Add Product</button> 
        </Layout>;
}