import Layout from '../../components/Layout';

export default function NewProduct() {
    return <Layout>
        <input type="text" placeholder="Product Name" /><br/>
        <textarea placeholder="Product Description"></textarea>
        </Layout>;
}