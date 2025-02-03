import { useState, useEffect } from 'react';
import Image from 'next/image';
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
    const [images, setImages] = useState(existingImage || []); // Image URLs from S3
    const [files, setFiles] = useState([]); // State for selected files
    const router = useRouter();

    useEffect(() => {
        if (existingTitle) setTitle(existingTitle);
        if (existingDescription) setDescription(existingDescription);
        if (existingPrice) setPrice(existingPrice);
        if (existingImage) setImages(existingImage);
    }, [existingTitle, existingDescription, existingPrice, existingImage]);

    async function handleUploadToS3(file) {
        try {
            const { data } = await axios.get(`${window.location.origin}/api/upload`, {
                params: { fileName: file.name, fileType: file.type },
            });
    
            const { uploadUrl, fileUrl } = data;
    
            await axios.put(uploadUrl, file, {
                headers: { 'Content-Type': file.type },
            });
    
            return fileUrl; // Return the uploaded file's URL
        } catch (error) {
            console.error('S3 Upload Error:', error);
            alert('Failed to upload image.');
            return null;
        }
    }
    

    async function handleSubmit(ev) {
        ev.preventDefault();

        const uploadedImageUrls = await Promise.all(files.map(handleUploadToS3));

        // Remove any failed uploads (null values)
        const validImages = uploadedImageUrls.filter(Boolean);

        const productData = {
            title,
            description,
            price,
            images: [...images, ...validImages], // Append new images
        };

        try {
            let response;
            if (id) {
                response = await axios.put(`/api/products?id=${id}`, productData);
            } else {
                response = await axios.post('/api/products', productData);
            }

            router.push('/products'); // Redirect on success
        } catch (error) {
            console.error("Error saving product:", error.response || error);
            alert("There was an issue saving the product.");
        }
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
                    required
                /><br />

                <label>Product Description</label><br />
                <textarea
                    placeholder="Product Description"
                    value={description}
                    onChange={(ev) => setDescription(ev.target.value)}
                    required
                /><br />

                <label>Price (in &#8358;)</label><br />
                <input
                    type="number"
                    placeholder="Price"
                    value={price}
                    onChange={(ev) => setPrice(ev.target.value)}
                    required
                    min="0"
                /><br />

                <label>Product Images</label><br />
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(ev) => setFiles(Array.from(ev.target.files))}
                /><br />

                {/* Show image previews */}
                {images.length > 0 && images.map((image, index) => (
                    <Image key={index} src={image} alt={`Product Image ${index + 1}`} width={100} height={100} objectFit="cover" />
                ))}

                <button type="submit" className="btn-primary">
                    {id ? 'Update Product' : 'Add Product'}
                </button>
            </form>
        </Layout>
    );
}
