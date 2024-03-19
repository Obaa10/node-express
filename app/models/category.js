import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: String,
    image: String,
    restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: "restaurant" },
  },
  { collection: "category" }
);
//TODO: Before delete check
export default mongoose.model("category", categorySchema);
