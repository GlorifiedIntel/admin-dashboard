import Layout from "../../../components/Layout";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function DeleteProductPage() {
    const router = useRouter();
    const [productInfo, setProductInfo] = useState();
    const {id} = router.query;
    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/api/products?id='+id).then(response => {
            setProductInfo(response.data);
        });
    }, [id]);

    function goBack() {
        router.push('/products');
    }

    return (
        <Layout>
            <h1>Do you really want to delete product X?</h1>
            <button>Yes</button>
            <button onClick={goBack}>NO</button>
        </Layout>
    );
}