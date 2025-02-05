import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import axios from "axios";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"; // AWS SDK v3
import Layout from "./Layout";

const s3Client = new S3Client({
  region: "us-east-1", // Change to your S3 region
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  },
});

export default function ProductForm({
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  image: existingImage,
  id,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [images, setImages] = useState(existingImage || []); // Image URLs from S3
  const [files, setFiles] = useState([]); // State for selected files
  const router = useRouter();

  useEffect(() => {
    if (existingTitle) setTitle(existingTitle);
    if (existingDescription) setDescription(existingDescription);
    if (existingPrice) setPrice(existingPrice);
    if (existingImage) setImages(existingImage);
  }, [existingTitle, existingDescription, existingPrice, existingImage]);

  const handleUploadToS3 = async (file) => {
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const bucketName = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;
      
      const uploadParams = {
        Bucket: bucketName,
        Key: `uploads/${fileName}`,
        Body: file,
        ContentType: file.type,
        ACL: "public-read", // Allows public access to images
      };

      await s3Client.send(new PutObjectCommand(uploadParams));
      return `https://${bucketName}.s3.amazonaws.com/uploads/${fileName}`;
    } catch (error) {
      console.error("Upload error:", error.message);
      return null;
    }
  };

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
        response = await axios.post("/api/products", productData);
      }

      router.push("/products"); // Redirect on success
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
        {images.length > 0 &&
          images.map((image, index) => (
            <Image
              key={index}
              src={image}
              alt={`Product Image ${index + 1}`}
              width={100}
              height={100}
              objectFit="cover"
            />
          ))}

        <button type="submit" className="btn-primary">
          {id ? "Update Product" : "Add Product"}
        </button>
      </form>
    </Layout>
  );
}
