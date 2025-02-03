import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductForm from "../../../components/ProductForm";
import Layout from "../../../components/Layout";

export default function EditProductPage() {
  const [productInfo, setProductInfo] = useState(null);
  const [loading, setLoading] = useState(true); // To manage loading state
  const [error, setError] = useState(null); // To manage error state
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    // If id is not available yet, skip the fetch
    if (!id) return;

    // Reset error and loading states
    setError(null);
    setLoading(true);

    axios
      .get(`/api/products?id=${id}`)
      .then((response) => {
        setProductInfo(response.data);
      })
      .catch((error) => {
        setError(error.response?.data?.error || "Failed to fetch product.");
      })
      .finally(() => {
        setLoading(false); // Stop loading
      });
  }, [id]);

  // Render loading or error message if needed
  if (loading) {
    return (
      <Layout>
        <p>Loading product...</p>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <p className="text-red-500">{error}</p>
      </Layout>
    );
  }

  return (

      <div>
      <h1>Edit Product</h1>
      {productInfo ? <ProductForm {...productInfo} /> : <p>Product not found</p>}
      </div>
    
  );
}
