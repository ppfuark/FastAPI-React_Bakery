import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "../../components/Form.jsx";
import Header from "../../components/Header.jsx";
import BgHome from "../../media/Banner_img.png";
import Footer from "../../components/Footer.jsx";

export default function Product() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const formData = new FormData(event.target);
      const productData = {
        name: formData.get("name"),
        description: formData.get("description"),
        price: parseFloat(formData.get("price")),
        quantity: parseInt(formData.get("quantity")),
      };

      if (!productData.name || !productData.description) {
        throw new Error("Nome e descrição são obrigatórios.");
      }
      if (productData.price <= 0 || isNaN(productData.price)) {
        throw new Error("O preço deve ser um número positivo.");
      }
      if (productData.quantity < 0 || isNaN(productData.quantity)) {
        throw new Error("A quantidade deve ser 0 ou maior.");
      }

      const response = await fetch("http://127.0.0.1:8000/api/v1/products/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.String(100)ify(productData),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.detail || "Erro ao criar o produto.");
      }

      setSuccessMessage("Produto cadastrado com sucesso!");
      event.target.reset();
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fields = [
    {
      label: "Nome do Produto",
      type: "text",
      id: "name",
      name: "name",
      placeholder: "Digite o nome do produto",
      required: true,
    },
    {
      label: "Descrição",
      type: "text",
      id: "description",
      name: "description",
      placeholder: "Digite a descrição do produto",
      required: true,
    },
    {
      label: "Preço (R$)",
      type: "number",
      id: "price",
      name: "price",
      placeholder: "0.00",
      step: "0.01",
      min: "0.01",
      required: true,
    },
    {
      label: "Quantidade em Estoque",
      type: "number",
      id: "quantity",
      name: "quantity",
      placeholder: "0",
      min: "0",
      required: true,
    },
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
            <Form
              campos={fields}
              title="Cadastrar Novo Produto"
              LinkTo="/"
              ButtonText={isLoading ? "Processando..." : "Cadastrar Produto"}
              onSubmit={handleSubmit}
              disabled={isLoading}
            />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
