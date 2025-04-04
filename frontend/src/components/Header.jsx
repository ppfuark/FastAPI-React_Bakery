import { FaBreadSlice } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <nav className="w-full flex justify-between px-10 text-white text-2xl">
      <Link to="/" className="flex items-end gap-3 hover:text-yellow-500 transition delay-150 duration-300">
        <FaBreadSlice className="text-[3rem]" />
        <span className="text-5xl font-bold">Macharete's Bread</span>
      </Link>
      <div className="flex items-end gap-20 text-4xl font-bold">
        <Link to="/" className="hover:text-yellow-500 cursor-pointer">Home</Link>
        <Link to="/employee" className="hover:text-yellow-500 cursor-pointer">Employee</Link>
        <Link to="/card" className="hover:text-yellow-500 cursor-pointer">Card</Link>
        <Link to="/product" className="hover:text-yellow-500 cursor-pointer">Product</Link>
        <Link to="/sale" className="hover:text-yellow-500 cursor-pointer">Sale</Link>
        <Link to="/sales" className="hover:text-yellow-500 cursor-pointer">Sales</Link>

      </div>
    </nav>
  );
}
