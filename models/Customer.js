import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  product: String,
  orderAmount : Number

});

const Customer = mongoose.models.customer || mongoose.model("customer", customerSchema);

export default Customer;
