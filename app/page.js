import * as React from "react";
import Box from "@mui/material/Box";
import Navbar from "./components/navbar"; 

export default function BoxBasic() {
  return (
    <div>
    <Navbar />
    <main className="p-8 bg-gray-100 min-h-screen pt-20">
      <Box component="section" className="border border-gray-800 m-5 text-center">
        <h1>Stock Management v1.0</h1>
        <ul>
          <li><a href="/product">Products</a></li>
          <li><a href="/category">Category</a></li>
          <li><a href="/customer">Customer</a></li>
        </ul>
      </Box>
    </main>
    </div>
  );
}
