import { Product } from "../../models/Product";
import { mongooseConnect } from "../../lib/mongoose";
import mongoose from "mongoose";
import formidable from "formidable";
import AWS from "aws-sdk";
import path from "path";

export const config = {
  api: {
    bodyParser: false, // Required for handling file uploads with Formidable
  },
};

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();

  try {
    if (method === "GET") {
      return await handleGetRequest(req, res);
    } else if (method === "POST" || method === "PUT") {
      return await handlePostOrPutRequest(req, res, method);
    } else if (method === "DELETE") {
      return await handleDeleteRequest(req, res);
    } else {
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      return res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error("Error in /api/products:", error);
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}

// ✅ Handle GET requests
async function handleGetRequest(req, res) {
  if (req.query?.id) {
    const { id } = req.query;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: `Invalid product ID: ${id}` });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.status(200).json(product);
  } else {
    const products = await Product.find();
    return res.status(200).json(products);
  }
}

// ✅ Handle POST & PUT requests (with file upload to S3)
async function handlePostOrPutRequest(req, res, method) {
  const form = formidable({ multiples: true, keepExtensions: true });

  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return reject(res.status(400).json({ error: "Error parsing form data" }));
      }

      // Handle potential arrays in the form data
      const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
      const description = Array.isArray(fields.description) ? fields.description[0] : fields.description;
      const price = Array.isArray(fields.price) ? parseFloat(fields.price[0]) : parseFloat(fields.price);

      // Validate fields
      if (!title || !description || isNaN(price)) {
        return reject(res.status(400).json({ error: "All fields are required and price must be a valid number." }));
      }

      let imageUrls = []; // Array to store multiple image URLs
      if (files.images) {
        const filesArray = Array.isArray(files.images) ? files.images : [files.images]; // Ensure we handle both single and multiple file uploads

        for (const file of filesArray) {
          // S3 upload logic using the file's buffer directly
          const uploadParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `products/${Date.now()}_${file.originalFilename}`,
            Body: file.filepath, // The file buffer directly
            ContentType: file.mimetype,
            ACL: "public-read", // Make the file publicly accessible
          };

          try {
            const uploadResult = await s3.upload(uploadParams).promise();
            imageUrls.push(uploadResult.Location); // Add the uploaded file's URL to the imageUrls array
          } catch (error) {
            return reject(res.status(500).json({ error: "Error uploading file to S3", details: error.message }));
          }
        }
      }

      // Handle POST request (create new product)
      if (method === "POST") {
        const productDoc = await Product.create({ title, description, price, image: imageUrls });
        return resolve(res.status(201).json(productDoc));
      }

      // Handle PUT request (update existing product)
      if (method === "PUT") {
        const { id } = req.query;
        if (!mongoose.Types.ObjectId.isValid(id)) {
          return reject(res.status(400).json({ error: `Invalid product ID: ${id}` }));
        }

        const product = await Product.findById(id);
        if (!product) {
          return reject(res.status(404).json({ error: "Product not found" }));
        }

        product.title = title;
        product.description = description;
        product.price = price;
        if (imageUrls.length > 0) {
          product.image = imageUrls; // Store array of image URLs
        }
        await product.save();

        return resolve(res.status(200).json(product));
      }
    });
  });
}

// ✅ Handle DELETE request
async function handleDeleteRequest(req, res) {
  const { id } = req.query;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: `Invalid product ID: ${id}` });
  }

  const product = await Product.findById(id);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  await Product.findByIdAndDelete(id);
  return res.status(200).json({ message: "Product deleted successfully" });
}
