import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductForm from "../../../components/ProductForm";
import Layout from "../../../components/Layout";

export default function EditProductPage() {
  const [productInfo, setProductInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) {
      return;
    }

    setLoading(true);
    axios.get('/api/products?id=' + id).then(response => {
      setProductInfo(response.data);
    }).catch(error => {
      console.error("Error fetching product:", error);
    }).finally(() => {
      setLoading(false);
    });
  }, [id]);

  return (
    <div>
      <h1>Edit product</h1>
      {loading && <p>Loading...</p>}
      {!loading && productInfo && (
        <>
          <h2>{productInfo.name}</h2> {/* Product name rendered here */}
          <ProductForm {...productInfo} /> {/* Other props passed to ProductForm */}
        </>
      )}
      {!loading && !productInfo && <p>Product not found.</p>}
    </div>
  );
}


// ProductForm.js (Modified - Remove product name rendering)
function ProductForm(props) {
  // ... other form elements ...

  return (
    <form>
      {/* ... all your form fields EXCEPT the product name */}
      {/* Example: */}
      <label htmlFor="description">Description:</label>
      <textarea id="description" name="description" value={props.description} />
      {/* ... other form fields */}
    </form>
  );
}