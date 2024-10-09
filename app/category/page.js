"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { DataGrid } from '@mui/x-data-grid'; // Import MUI DataGrid
import { Button } from '@mui/material';     // Optional: Button from MUI for styling
import Navbar from "../components/navbar";

export default function Home() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  const [categoryList, setCategoryList] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  async function fetchCategory() {
    const data = await fetch(`${API_BASE}/category`);
    const c = await data.json();

    const categoryListWithID = c.map(category=> ({
      id: category._id,
      ...category
    }))
    setCategoryList(categoryListWithID);
  }

  useEffect(() => {
    fetchCategory();
  }, []);

  function handleCategoryFormSubmit(data) {
    if (editMode) {
      fetch(`${API_BASE}/category`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then(() => {
        stopEditMode();
        fetchCategory()
      });
      return;
    }

    // Creating a new category
    fetch(`${API_BASE}/category`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(() => fetchCategory());
  }

  function startEditMode(category) {
    reset(category);
    setEditMode(true);
  }

  function stopEditMode() {
    reset({
      name: '',
    });
    setEditMode(false);
  }

  async function deleteCustomer(category){
    console.log(category)
    if (!confirm([`Deleting ${category.name}`])) return;

        const id = category._id;
        await fetch(`${API_BASE}/category/${id}`, { method: "DELETE" });
        fetchCategory();
  }


  const columns = [
    { field: "name", headerName: "Category", width: 300 },
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
              ✎
            </button>
            <button
              onClick={() => deleteCustomer(params.row)}
              className="ml-5 hover:bg-red-500 hover:text-white text-black font-bold py-1 px-3 rounded-md"
            >
              🗑️
            </button>
          </div>
        )
      }
    },
  ]



  return (
    <div>
      <Navbar />
      <main className="p-8 bg-gray-100 min-h-screen pt-20">
        <form onSubmit={handleSubmit(handleCategoryFormSubmit)}>
          <div className="grid grid-cols-2 gap-4 w-fit m-4 border border-gray-800 p-2">
            <div>Category name:</div>
            <div>
              <input
                name="name"
                type="text"
                {...register("name", { required: true })}
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
            <h2 className="text-xl font-semibold mb-4">Category List</h2>
            <DataGrid
              rows={categoryList}
              columns={columns}
              pageSize={5}
              className="text-gray-700"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
