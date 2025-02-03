import Layout from '../../components/Layout';

export default function NewProduct() {
    return <Layout>
        <h1>New Product</h1>
        <label>Product Name</label><br/>
        <input type="text" placeholder="Product Name" /><br/>
        <label>Product Description</label><br/>
        <textarea placeholder="Product Description"></textarea><br/>
        <label>Price (in &#8358;)</label><br/>
        <input type="number" placeholder="Price" /><br/>
        </Layout>;
}