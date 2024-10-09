import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 p-4 shadow-lg fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-xl">
          <Link href="/">Stock Management</Link>
        </div>
        <div className="space-x-4">
          <Link href="/" className="text-white hover:bg-blue-500 px-3 py-2 rounded-md">
            Home
          </Link>
          <Link href="/category" className="text-white hover:bg-blue-500 px-3 py-2 rounded-md">
             Category
          </Link>
          <Link href="/product" className="text-white hover:bg-blue-500 px-3 py-2 rounded-md">
            Product
          </Link>
          <Link href="/customer" className="text-white hover:bg-blue-500 px-3 py-2 rounded-md">
            Customer
          </Link>
        </div>
      </div>
    </nav>
  );
}
