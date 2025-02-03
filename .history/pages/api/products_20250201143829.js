import mongoose from "mongoose";
import { Product } from "../../models/Product";
import { mongooseConnect } from "../../lib/mongoose";

export default async function handle(req, res) {
  const { method } = req;

  try {
    // Establish MongoDB connection
    await mongooseConnect();

    if (method === "GET") {
      if (req.query?.id) {
        // Validate MongoDB ObjectId before querying
        if (!mongoose.Types.ObjectId.isValid(req.query.id)) {
          return res.status(400).json({ error: "Invalid product ID" });
        }

        // Fetch a single product by ID
        const product = await Product.findById(req.query.id);
        if (!product) {
          return res.status(404).json({ error: "Product not found" });
        }
        return res.status(200).json(product);
      } else {
        // Fetch all products
        const products = await Product.find();
        return res.status(200).json(products);
      }
    } else if (method === "POST") {
      // Create a new product
      const { title, description, price } = req.body;

      if (!title || !description || !price) {
        return res.status(400).json({ error: "All fields are required." });
      }

      const productDoc = await Product.create({ title, description, price });

      return res.status(201).json(productDoc);
    } else {
      // Handle unsupported methods
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error in /api/products:", error);
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}

