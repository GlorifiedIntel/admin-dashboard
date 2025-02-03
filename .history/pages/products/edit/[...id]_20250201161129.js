import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductForm from "../../../components/ProductForm";
import Layout from "../../../components/Layout";

export default function EditProductPage() {
  const [productInfo, setProductInfo] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) {
      return;
    }

    setLoading(true); // Set loading to true before making the request
    axios.get('/api/products?id=' + id).then(response => {
      setProductInfo(response.data);
    }).catch(error => {
      console.error("Error fetching product:", error); // Handle errors
      // Optionally, set an error state to display a message to the user
    }).finally(() => {
      setLoading(false); // Set loading to false after request completes (success or error)
    });
  }, [id]);

  return (
    <div>
      <h1>Edit product</h1>
      {loading && <p>Loading...</p>} {/* Display loading message */}
      {!loading && productInfo && <ProductForm {...productInfo} />} {/* Only render form if not loading and data is available */}
      {!loading && !productInfo && <p>Product not found.</p>} {/* Handle the case where the product isn't found */}
    </div>
  );
}