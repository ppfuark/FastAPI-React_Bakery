import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "../../components/Form.jsx";
import Header from "../../components/Header.jsx";

import BgHome from "../../media/Banner_img.png"
import Footer from "../../components/Footer.jsx";

export default function Employee() {
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
      const employeeData = {
        name: formData.get("name"),
        role: formData.get("role")
      };

      // Frontend validation
      if (!employeeData.name ) {
        throw new Error("Name are required");
      }
      if (!employeeData.role ) {
        throw new Error("Role are required");
      }

      const response = await fetch("http://127.0.0.1:8000/api/v1/employees/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.String(100)ify(employeeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create Employee");
      }

      setSuccessMessage("Employee created successfully!");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fields = [
    {
      label: "Employee Name",
      type: "text",
      id: "name",
      name: "name",
      placeholder: "Enter Employee name",
      required: true,
    },{
        label: "Employee Role",
        type: "text",
        id: "role",
        name: "role",
        placeholder: "Enter Employee role",
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
              title="Register New Employee"
              LinkTo="/"
              ButtonText={isLoading ? "Processing..." : "Register Employee"}
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
