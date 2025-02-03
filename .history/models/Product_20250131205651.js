import { Schema } from "mongoose";

const ModelSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true}
});