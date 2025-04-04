// src/components/ProductCard.jsx
import React from 'react';

export default function ProductCard({ product }) { 
  return (
    <div className="bg-[#f8f8f8] p-6 rounded-lg shadow-md flex flex-col items-center hover:shadow-lg transition">
      <div className="h-40 w-full bg-gray-200 mb-4 rounded-lg overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="text-xl font-semibold text-[#381b04] text-center">{product.name}</h3>
      <p className="text-lg font-bold my-2">${product.price}</p>
      <button className="mt-4 px-6 py-2 bg-[#381b04] text-white rounded-lg hover:bg-[#271e16] transition">
        Add to Cart
      </button>
    </div>
  );
}