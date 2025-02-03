import { useRouter } from "next/router";
import { useEffect } from "react";
import axios from "axios";
import Layout from "../../../components/Layout"; 
import ProductForm from "@/components/ProductForm";


export default function EditProductPage() {
        const router = useRouter();
        const {id} = router.query;
        useEffect(() => {
        axios.get('/api/products?id='+id).then(response => {
        console.log(response.data);
        });
        }, [id]);
return (
        <Layout>  
        <ProductForm />
        </Layout>
);
}