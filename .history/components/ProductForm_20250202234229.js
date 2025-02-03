import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Layout from './Layout';

export default function ProductForm({
    title: existingTitle,
    description: existingDescription,
    price: existingPrice,
    image: existingImage,
    id, // Product id (for editing)
}) {
    const [title, setTitle] = useState(existingTitle || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [price, setPrice] = useState(existingPrice || '');
    const [image, setImage] = useState(existingImage || '');
    const [file, setFile] = useState(null);
    const [goToProducts, setGoToProducts] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (existingTitle) setTitle(existingTitle);
        if (existingDescription) setDescription(existingDescription);
        if (existingPrice) setPrice(existingPrice);
        if (existingImage) setImage(existingImage);
    }, [existingTitle, existingDescription, existingPrice, existingImage]);

    async function handleSubmit(ev) {
        ev.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('price', price);

        if (file) {
            formData.append('image', file);
        }

        try {
            if (id) {
                // Edit existing product
                await axios.put(`/api/products?id=${id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            } else {
                // Create new product
                await axios.post('/api/products', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }
            setGoToProducts(true);
        } catch (error) {
            console.error("Error saving product:", error);
        }
    }

    if (goToProducts) {
        router.push('/products');
    }

    return (
        <Layout>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <label>Product Name</label><br />
                <input
                    type="text"
                    placeholder="Product Name"
                    value={title}
                    onChange={(ev) => setTitle(ev.target.value)}
                /><br />

                <label>Product Description</label><br />
                <textarea
                    placeholder="Product Description"
                    value={description}
                    onChange={(ev) => setDescription(ev.target.value)}
                /><br />

                <label>Price (in &#8358;)</label><br />
                <input
                    type="number"
                    placeholder="Price"
                    value={price}
                    onChange={(ev) => setPrice(ev.target.value)}
                /><br />

                <label>Product Image</label><br />
                <input
                    type="file"
                    accept="image/*"
                    onChange={(ev) => setFile(ev.target.files[0])}
                /><br />

                {image && (
                    <div>
                        <img src={image} alt="Product" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                    </div>
                )}

                <button type="submit" className="btn-primary">
                    {id ? 'Update Product' : 'Add Product'}
                </button>
            </form>
        </Layout>
    );
}
