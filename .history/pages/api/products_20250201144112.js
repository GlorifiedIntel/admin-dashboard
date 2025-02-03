import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

export default function EditProductPage() {
  const router = useRouter();
  const { id } = router.query; 
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (!id) return; // 

    console.log("Fetching product with ID:", id); 

    axios
      .get(`/api/products?id=${id}`)
      .then((response) => setProduct(response.data))
      .catch((error) => {
        console.error("Error fetching product:", error.response?.data || error);
      });
  }, [id]);

  return (
    <div>
      <h1>Edit Product</h1>
      {product ? <p>{product.title}</p> : <p>Loading...</p>}
    </div>
  );
}
