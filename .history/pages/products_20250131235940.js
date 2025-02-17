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
    <div>
    <table className="basic mt-4">
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
          <Link href={'/products/'+product._id}>Edit</Link>
        </td>
      </tr>
    ))}
  </tbody>
</table>
    </div>
    
    </Layout>;
}