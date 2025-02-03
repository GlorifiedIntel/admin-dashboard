import { Product } from "../../models/Product";
import { mongooseConnect } from "../../lib/mongoose";
import mongoose from "mongoose";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import { promisify } from "util";

export const config = {
  api: {
    bodyParser: false, // Disable default body parsing for file uploads
  },
};

const writeFileAsync = promisify(fs.writeFile);

export default async function handle(req, res) {
  const { method } = req;

  try {
    await mongooseConnect();

    if (method === "GET") {
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
    
    else if (method === "POST" || method === "PUT") {
      const form = formidable({ multiples: false, keepExtensions: true });

      form.parse(req, async (err, fields, files) => {
        if (err) {
          return res.status(400).json({ error: "Error parsing form data" });
        }

        const { title, description, price } = fields;
        if (!title || !description || !price) {
          return res.status(400).json({ error: "All fields are required." });
        }

        let imageUrl = "";
        if (files.image) {
          const uploadDir = path.join(process.cwd(), "public/uploads");
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }

          const imagePath = path.join(uploadDir, files.image.newFilename);
          await writeFileAsync(imagePath, fs.readFileSync(files.image.filepath));
          imageUrl = `/uploads/${files.image.newFilename}`;
        }

        if (method === "POST") {
          const productDoc = await Product.create({ title, description, price, image: imageUrl });
          return res.status(201).json(productDoc);
        }

        if (method === "PUT") {
          const { id } = req.query;
          if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: `Invalid product ID: ${id}` });
          }

          const product = await Product.findById(id);
          if (!product) {
            return res.status(404).json({ error: "Product not found" });
          }

          product.title = title;
          product.description = description;
          product.price = price;
          if (imageUrl) {
            product.image = imageUrl;
          }
          await product.save();

          return res.status(200).json(product);
        }
      });
    } 
    
    else if (method === "DELETE") {
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
    
    else {
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error in /api/products:", error);
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}
