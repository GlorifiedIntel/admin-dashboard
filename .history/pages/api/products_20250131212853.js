import client from "@/lib/db";
import mongoose from "mongoose";

export default function handle(req, res) {
    const {method} = req;
    mongoose.connect(client.uri)
    if (method === 'POST') {
        // handle POST request
        res.json('post')
    }
}