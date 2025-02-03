import { Product } from "@/models/Product"; 
import { mongooseConnect } from "@/lib/mongoose";

export default async function handle(req, res) {
  const { method } = req;

  try {
    // Establish MongoDB connection
    await mongooseConnect();

    if (method === "GET") {
      // Fetch all products
      const products = await Product.find();
      res.status(200).json(products);
    } else if (method === "POST") {
      // Create a new product
      const { title, description, price } = req.body;

      if (!title || !description || !price) {
        return res.status(400).json({ error: "All fields are required." });
      }

      const productDoc = await Product.create({
        title,
        description,
        price,
      });

      res.status(201).json(productDoc);
    } else {
      // Handle unsupported methods
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error in /api/products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

