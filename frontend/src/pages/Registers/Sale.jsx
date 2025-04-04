import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Form from "../../components/Form.jsx";
import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";
import BgHome from "../../media/Banner_img.png";

export default function Sale() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [cardId, setCardId] = useState("");

  // Fetch available products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/products/");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        setErrorMessage(error.message);
      }
    };
    fetchProducts();
  }, []);

  const handleAddProduct = () => {
    setSelectedProducts([...selectedProducts, { product_id: "", quantity: 1 }]);
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts[index][field] = field === "quantity" ? parseInt(value) : value;
    setSelectedProducts(updatedProducts);
  };

  const handleRemoveProduct = (index) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts.splice(index, 1);
    setSelectedProducts(updatedProducts);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const saleData = {
        employee_id: parseInt(employeeId),
        card_id: parseInt(cardId),
        products: selectedProducts.map(item => ({
          product_id: parseInt(item.product_id),
          quantity: item.quantity
        }))
      };

      // Validation
      if (!saleData.employee_id || !saleData.card_id) {
        throw new Error("Employee and Card are required");
      }

      if (saleData.products.length === 0) {
        throw new Error("At least one product is required");
      }

      for (const product of saleData.products) {
        if (!product.product_id || product.quantity <= 0) {
          throw new Error("Please select valid products and quantities");
        }
      }

      // Make the API request
      const response = await fetch("http://127.0.0.1:8000/sales/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(saleData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create sale");
      }

      setSuccessMessage("Sale created successfully!");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const basicFields = [
    {
      label: "Employee ID",
      type: "number",
      id: "employee_id",
      name: "employee_id",
      placeholder: "Enter employee ID",
      required: true,
      value: employeeId,
      onChange: (e) => setEmployeeId(e.target.value)
    },
    {
      label: "Card ID",
      type: "number",
      id: "card_id",
      name: "card_id",
      placeholder: "Enter card ID",
      required: true,
      value: cardId,
      onChange: (e) => setCardId(e.target.value)
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div
        className="w-full h-screen bg-cover bg-center bg-no-repeat flex flex-col justify-between items-center"
        style={{ backgroundImage: `url(${BgHome})` }}
      >
        <div className="pt-10 w-screen">
          <Header />
        </div>
        <div className="container">
          <div className="max-w-md mx-auto">
            {successMessage && (
              <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
                {errorMessage}
              </div>
            )}
            <div className="bg-[#3E2C24] rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-[#D7B899] mb-6">Register New Sale</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {basicFields.map((field, index) => (
                  <div key={index}>
                    <label htmlFor={field.id} className="block text-sm font-medium text-[#D7B899] mb-1">
                      {field.label}
                      {field.required && <span className="text-red-400">*</span>}
                    </label>
                    <input
                      type={field.type}
                      id={field.id}
                      name={field.name}
                      placeholder={field.placeholder}
                      required={field.required}
                      value={field.value}
                      onChange={field.onChange}
                      className="w-full px-3 py-2 border border-[#8B6A52] bg-[#2E1B12] text-[#D7B899] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B6A52]"
                      disabled={isLoading}
                    />
                  </div>
                ))}

                <div className="mt-6">
                  <h3 className="text-lg font-medium text-[#D7B899] mb-2">Products</h3>
                  
                  {selectedProducts.map((product, index) => (
                    <div key={index} className="mb-4 p-3 bg-[#2E1B12] rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm text-[#D7B899]">Product #{index + 1}</label>
                        <button
                          type="button"
                          onClick={() => handleRemoveProduct(index)}
                          className="text-red-400 hover:text-red-300 text-sm"
                          disabled={isLoading}
                        >
                          Remove
                        </button>
                      </div>
                      
                      <select
                        value={product.product_id}
                        onChange={(e) => handleProductChange(index, "product_id", e.target.value)}
                        className="w-full mb-2 px-3 py-2 border border-[#8B6A52] bg-[#3E2C24] text-[#D7B899] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B6A52]"
                        required
                        disabled={isLoading}
                      >
                        <option value="">Select a product</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} - ${p.price} (Stock: {p.quantity})
                          </option>
                        ))}
                      </select>
                      
                      <input
                        type="number"
                        min="1"
                        value={product.quantity}
                        onChange={(e) => handleProductChange(index, "quantity", e.target.value)}
                        placeholder="Quantity"
                        className="w-full px-3 py-2 border border-[#8B6A52] bg-[#3E2C24] text-[#D7B899] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B6A52]"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={handleAddProduct}
                    className="w-full px-4 py-2 bg-[#5A3E30] text-[#D7B899] rounded-md hover:bg-[#8B6A52] transition mb-4"
                    disabled={isLoading}
                  >
                    Add Product
                  </button>
                </div>

                <div className="flex justify-between mt-6">
                  <a
                    href="/"
                    className="px-4 py-2 border border-[#8B6A52] rounded-md text-[#D7B899] hover:bg-[#4A3226] transition"
                  >
                    Cancel
                  </a>
                  <button
                    type="submit"
                    disabled={isLoading || selectedProducts.length === 0}
                    className="px-4 py-2 bg-[#5A3E30] text-[#D7B899] rounded-md hover:bg-[#8B6A52] transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Processing..." : "Create Sale"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
//