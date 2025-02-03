import Layout from "../../../components/Layout";

export default function DeleteProductPage() {

    return (
        <Layout>
            <h1>Delete Product</h1>
            Do you really want to delete this Product?
            <button>Yes</button>
            <button>No</button>
        </Layout>
    )
}