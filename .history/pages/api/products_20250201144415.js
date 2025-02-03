import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

export default function EditProductPage() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return; // ✅ Prevents invalid requests

    console.log("Fetching product with ID:", id);
    setLoading(true);

    axios
      .get(`/api/products?id=${id}`)
      .then((response) => {
        if (!response.data) {
          setError("Product not found.");
        } else {
          setProduct(response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching product:", error.response?.data || error);
        setError(error.response?.data?.error || "Failed to load product.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading product...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1>Edit Product</h1>
      {product ? (
        <p>{product.title}</p>
      ) : (
        <p className="text-red-500">Product not found.</p>
      )}
    </div>
  );
}

