import Layout from "../components/Layout";
import Link from "next/link";
import { useEffect } from "react";
import axios from "axios";

export default function Products() {
  useEffect(() => {
    axios.get('/api/products').then(response => {
      console.log(response.data);
    });
  }, []);
  
  return <Layout>
    <Link className="bg-[#212738] rounded-md text-white py-2 px-2" href={'/products/new'}>Add New Product</Link>
    </Layout>;
}