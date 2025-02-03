import Layout from "../components/Layout";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Products() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    axios.get('/api/products').then(response => {
      setProducts(response.data);
    });
  }, []);
  
  return <Layout>
    <Link className="bg-[#212738] rounded-md text-white py-2 px-2" href={'/products/new'}>Add New Product</Link>
    <table>
  <thead>
    <tr>
      <td>Product name</td>
      <td></td>
    </tr>
  </thead>
  <tbody>
    {products.map(product => (
      <tr key={product.id}>
        <td>{product.title}</td>
        <td>
          buttons
        </td>
      </tr>
    ))}
  </tbody>
</table>
    </Layout>;
}