import Layout from '../../components/Layout';

export default function NewProduct() {
    return <Layout>
        <h1>New Product</h1>
        <label>Product Name</label>
        <input type="text" placeholder="Product Name" /><br/>
        <label>Product Description</label>
        <textarea placeholder="Product Description"></textarea>
        <label>Price</label>
        </Layout>;
}