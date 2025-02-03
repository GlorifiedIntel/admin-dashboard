import Layout from '../../components/Layout';

export default function NewProduct() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    return <Layout>
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
        onChange={ev => setTitle(ev.target.description)}/><br/>
        <label>Price (in &#8358;)</label><br/>
        <input type="number" placeholder="Price" /><br/>
        <button className="btn-primary">Add Product</button>
        </Layout>;
}