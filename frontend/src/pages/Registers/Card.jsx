import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "../../components/Form.jsx";
import Header from "../../components/Header.jsx";

import BgHome from "../../media/Banner_img.png"
import Footer from "../../components/Footer.jsx";

export default function Card() {
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
      const cardData = {
        name: formData.get("name"),
      };

      // Frontend validation
      if (!cardData.name ) {
        throw new Error("Name are required");
      }

      const response = await fetch("http://127.0.0.1:8000/api/v1/cards/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.String(100)ify(cardData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create card");
      }

      setSuccessMessage("Card created successfully!");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fields = [
    {
      label: "Card Name",
      type: "text",
      id: "name",
      name: "name",
      placeholder: "Enter card name",
      required: true,
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
            <Form
              campos={fields}
              title="Register New Card"
              LinkTo="/"
              ButtonText={isLoading ? "Processing..." : "Register Card"}
              onSubmit={handleSubmit}
              disabled={isLoading}
            />
          </div>
        </div>
        <Footer/>
      </div>
    </div>
  );
}
