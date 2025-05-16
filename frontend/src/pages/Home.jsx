// src/pages/Home.jsx
import { useEffect, useState } from 'react';
import BgHome from "../media/Banner_img.png";
import "./Home.css";
import Header from "../components/Header.jsx";
import ProductCard from "../components/ProductCard .jsx";
import { Link } from 'react-router-dom';

export default function Home() {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/v1/products/", {
        });
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        setProducts(await response.json())
      } catch (error) {
        console.error(error.message)
      }
    }
    fetchData();
  }, [])

  return (
    <div className="flex flex-col w-screen">
      {/* Hero Banner Section */}
      <div
        className="w-full h-screen bg-cover bg-center bg-no-repeat flex flex-col justify-between py-10 items-center"
        style={{ backgroundImage: `url(${BgHome})` }}
      >
        <Header />
        <div className="flex flex-col gap-20 text-white w-[85%]">
          <div>
            <p className="text-3xl text-yellow-400">Delicious Cafe</p>
            <h1 className="text-8xl font-bold mt-2">
              Sweet Treats,
              <br /> Perfect Eats
            </h1>
          </div>
          <div className="flex gap-10 mt-6">
            <Link to='/sale'>
              <button className="px-8 py-4 bg-[#381b04] text-white text-2xl font-semibold rounded-lg hover:bg-[#4a3a2d] transition">
                Shop Now
              </button>
            </Link>
            <button className="px-8 py-4 border-2 border-white text-2xl font-semibold rounded-lg hover:bg-white hover:text-black transition">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="w-full bg-white py-16 px-8 flex flex-col items-center">
        <h2 className="text-4xl font-bold text-[#381b04] mb-12">Top Products</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}