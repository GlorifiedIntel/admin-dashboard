import { Product } from "../../models/Product"; 
import { mongooseConnect } from "../../lib/mongoose";
import mongoose from "mongoose";

export default async function handle(req, res) {
  const { method } = req;

  try {
    // Establish MongoDB connection
    await mongooseConnect();

    if (method === "GET") {
      if (req.query?.id) {
        const { id } = req.query;

        // Check if ID is valid before querying
        if (!mongoose.Types.ObjectId.isValid(id)) {
          console.error(`Invalid ID received: ${id}`);
          return res.status(400).json({ error: `Invalid product ID: ${id}` });
        }

        const product = await Product.findById(id);
        if (!product) {
          console.error(`Product not found for ID: ${id}`);
          return res.status(404).json({ error: "Product not found" });
        }

        return res.status(200).json(product);
      } else {
        // Fetch all products
        const products = await Product.find();
        return res.status(200).json(products);
      }
    } else if (method === "POST") {
      const { title, description, price } = req.body;

      if (!title || !description || !price) {
        return res.status(400).json({ error: "All fields are required." });
      }

      const productDoc = await Product.create({ title, description, price });
      return res.status(201).json(productDoc);
    } else if (method === "PUT") {
      const { id } = req.query;
      const { title, description, price } = req.body;

      // Check if the ID is valid
      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.error(`Invalid ID received: ${id}`);
        return res.status(400).json({ error: `Invalid product ID: ${id}` });
      }

      // Check if the product exists
      const product = await Product.findById(id);
      if (!product) {
        console.error(`Product not found for ID: ${id}`);
        return res.status(404).json({ error: "Product not found" });
      }

      // Update product with new values
      product.title = title;
      product.description = description;
      product.price = price;
      await product.save();

      return res.status(200).json(product);
    } else if (method === "DELETE") {
      const { id } = req.query;

      // Check if ID is valid
      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.error(`Invalid ID received: ${id}`);
        return res.status(400).json({ error: `Invalid product ID: ${id}` });
      }

      // Check if the product exists
      const product = await Product.findById(id);
      if (!product) {
        console.error(`Product not found for ID: ${id}`);
        return res.status(404).json({ error: "Product not found" });
      }

      // Delete the product
      await Product.findByIdAndDelete(id);
      return res.status(200).json({ message: "Product deleted successfully" });
    } else {
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error in /api/products:", error);
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}
