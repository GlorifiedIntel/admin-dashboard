import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../../components/Layout";
import ProductForm from "../../../components/ProductForm";

export default function EditProductPage() {
  const [productInfo, setProductInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return; // Avoid making request when id is not available yet

    // Validate if the id is a valid MongoDB ObjectId
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      setError("Invalid product ID");
      return;
    }

    axios
      .get(`/api/products?id=${id}`)
      .then((response) => {
        setProductInfo(response.data);
      })
      .catch((error) => {
        console.error("Error fetching product:", error.response?.data || error);
        setError(error.response?.data?.error || "Failed to load product");
      });
  }, [id]);

  const handleSubmit = async (updatedProductInfo) => {
    setLoading(true);
    try {
      await axios.put(`/api/products?id=${id}`, updatedProductInfo);
      // Optionally, redirect after successful update
      router.push(`/products/${id}`);
    } catch (error) {
      console.error("Error updating product:", error.response?.data || error);
      setError(error.response?.data?.error || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

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
      {productInfo ? (
        <ProductForm
          initialData={productInfo}
          onSubmit={handleSubmit}
          loading={loading}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
