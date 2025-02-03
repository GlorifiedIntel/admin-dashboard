import Layout from '../../components/Layout';

export default function NewProduct() {
    return <Layout>
        <h1>New Product</h1>
        <input type="text" placeholder="Product Name" /><br/>
        <textarea placeholder="Product Description"></textarea>
        </Layout>;
}