import Layout from "../../../components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

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
            <h1 className="text-center text-blue">Do you really want to delete 
                &nbsp; &quot;{productInfo?.title}&quot;?</h1>
                <div className="flex gap-2 justify-center">
                <button 
            className="btn-red">
                Yes
                </button>
            <button 
            className="btn-default" onClick={goBack}>
                NO
                </button>
                </div>
        </Layout>
    );
}