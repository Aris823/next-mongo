
"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { DataGrid } from "@mui/x-data-grid";
import Navbar from "../components/navbar";


export default function Home() {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL;
    const [customerList, setCustomerList] = useState([])
    const [product, setProducts] = useState([])
    const [editMode, setEditMode] = useState(false)
    const { register, handleSubmit, reset } = useForm()

    const columns = [
        {
            field: "Action",
            headerName: "Action",
            width: 200,
            renderCell: (params) => {
                return (
                    <div>
                        <button
                            onClick={() => startEditMode(params.row)}
                            className="ml-5 hover:bg-gray-400  text-black font-bold py-1 px-3 rounded-md"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => deleteCustomer(params.row)}
                            className="ml-5 hover:bg-red-800 hover:text-white text-black font-bold py-1 px-3 rounded-md"
                        >
                            Delete
                        </button>
                    </div>
                )
            }
        },
        { field: "name", headerName: "Customer Name", width: 300 },
        { field: "product", headerName: "Product Name", width: 300 },
        { field: "orderAmount", headerName: "Order Amount", width: 300 }
    ]


    //Read   
    async function fetchCustomer() {
        const customerData = await fetch(`${API_BASE}/customer`);
        const customers = await customerData.json();

        const productData = await fetch(`${API_BASE}/product`);
        const products = await productData.json();

        const formattedCustomers = customers.map((customer) => {
            // Find the product name by matching the product ID
            const product = products.find((p) => p._id === customer.product);
            return {
                ...customer,
                product: product ? product.name : "Unknown",  
                id: customer._id,
            };
        });

        setCustomerList(formattedCustomers);
    }

    async function fetchProducts() {
        const data = await fetch(`${API_BASE}/product`);
        const p = await data.json();
        setProducts(p);
    }

    useEffect(() => {
        fetchCustomer();
        fetchProducts();
    }, []);


    // delete
    async function deleteCustomer(customer) {
        if (!confirm([`Deleting ${customer.name}`])) return;

        const id = customer._id;
        await fetch(`${API_BASE}/customer/${id}`, { method: "DELETE" });
        fetchCustomer();
    }

    //Create
    // const createMember = (data) => {
    //     fetch(`${API_BASE}/customer`, {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify(data),
    //     }).then(() => fetchCustomer());
    // };


    //Create+update
    const handleCustomerFormSubmit = (data) => {
        if (editMode) {
            fetch(`${API_BASE}/customer`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }).then(() => {
                stopEditMode();
                fetchCustomer()
            });
            return
        }
        // create new customer
        fetch(`${API_BASE}/customer`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }).then(() => fetchCustomer());
    };

    function startEditMode(customer) {
        console.log(customer)
        reset(customer)
        setEditMode(true)
    }
    function stopEditMode() {
        reset({
            name: '',
            orderAmount: ''
        });
        setEditMode(false);

    }


    //without Update
    // return (
    //     <main>
    //         <form onSubmit={handleSubmit(createMember)} className="bg-white p-4 rounded-lg shadow-lg">
    //             <div className="grid grid-cols-2 gap-4 w-fit m-4 border border-gray-800 p-2">
    //                 <div>Customer Name:</div>
    //                 <div>
    //                     <input
    //                         name="name"
    //                         type="text"
    //                         {...register("name", { required: true })}
    //                         className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
    //                     />
    //                 </div>

    //                 <div>Product</div>
    //                 <div>
    //                     <select
    //                         name="product"
    //                         {...register("product", { required: true })}
    //                         className="border border-black w-full"
    //                     >
    //                         {product.map((c) => (
    //                             <option key={c._id} value={c._id}>{c.name}</option>
    //                         ))}
    //                     </select>
    //                 </div>

    //                 <div>Total Order:</div>
    //                 <div>
    //                     <input
    //                         name="orderAmount"
    //                         type="number"
    //                         {...register("orderAmount", { required: true })}
    //                         className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
    //                     />
    //                 </div>
    //                 <div className="col-span-2">
    //                     <input
    //                         type="submit"
    //                         value="Add"
    //                         className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
    //                     />
    //                 </div>

    //             </div>
    //         </form>

    //         <div>
    //             <div className="bg-white p-6 rounded-lg shadow-lg">
    //                 <h2 className="text-xl font-semibold mb-4">Cutomer List</h2>
    //                 <DataGrid
    //                     rows={customerList}
    //                     columns={columns}
    //                     pageSize={5}
    //                     className="text-gray-700"
    //                 />
    //             </div>
    //         </div>

    //     </main>
    // )

    //With Update
    return (
        <div>
            <Navbar />
            <main className="p-8 bg-gray-100 min-h-screen pt-20">
                <form onSubmit={handleSubmit(handleCustomerFormSubmit)} className="bg-white p-4 rounded-lg shadow-lg">
                    <div className="grid grid-cols-2 gap-4 w-fit m-4 border border-gray-800 p-2">
                        <div>Customer Name:</div>
                        <div>
                            <input
                                name="name"
                                type="text"
                                {...register("name", { required: true })}
                                className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            />
                        </div>

                        <div>Product</div>
                        <div>
                            <select
                                name="product"
                                {...register("product", { required: true })}
                                className="border border-black w-full"
                            >
                                {product.map((c) => (
                                    <option key={c._id} value={c._id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>Total Order:</div>
                        <div>
                            <input
                                name="orderAmount"
                                type="number"
                                {...register("orderAmount", { required: true })}
                                className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            />
                        </div>

                        <div className="col-span-2 text-right">
                            {editMode ?
                                <>
                                    <input
                                        type="submit"
                                        className="italic bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                                        value="Update" />
                                    {' '}
                                    <button
                                        onClick={() => stopEditMode()}
                                        className="italic bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full"
                                    >Cancel</button>
                                </>
                                :
                                <input
                                    type="submit"
                                    value="Add"
                                    className="w-20 italic bg-green-800 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
                                />
                            }
                        </div>

                    </div>
                </form>

                <div>
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Cutomer List</h2>
                        <DataGrid
                            rows={customerList}
                            columns={columns}
                            pageSize={5}
                            className="text-gray-700"
                        />
                    </div>
                </div>

            </main>
        </div>
    )
}