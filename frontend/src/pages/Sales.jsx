import { useState, useEffect } from "react";
import Header from "../components/Header";
import BgHome from "../media/Banner_img.png";
import Footer from "../components/Footer";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function Sales() {
    const [sales, setSales] = useState([]);
    const [expandedRow, setExpandedRow] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/v1/sales/");
                if (!response.ok) {
                    throw new Error(`Response status: ${response.status}`);
                }
                const data = await response.json();
                setSales(data);
            } catch (error) {
                console.error(error.message);
            }
        }
        fetchData();
    }, []);

    const toggleExpand = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    return (
        <div className="min-h-screen bg-[#3E2C24]">
            <div
                className="w-full h-screen bg-cover bg-center bg-no-repeat flex flex-col justify-between items-center"
                style={{ backgroundImage: `url(${BgHome})` }}
            >
                <div className="pt-10 w-screen">
                    <Header />
                </div>
                
                <div className="w-[85%] flex flex-col gap-4 p-6">
                    <h1 className="text-center text-[#C4A484] text-4xl mb-4 font-bold">Sales</h1>
                    <table className="w-full border border-[#5A3E30] text-[#C4A484] text-center table-auto bg-[#2E1B12] rounded-lg overflow-hidden shadow-lg">
                        <thead className="bg-[#5A3E30] text-[#D7B899]">
                            <tr className="text-lg">
                                <th className="p-3">Card-ID</th>
                                <th>Employee</th>
                                <th>Total</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sales.map((sale) => (
                                <>
                                    <tr key={sale.id} className="border-b border-[#8B6A52] hover:bg-[#4A3226]">
                                        <td className="p-3">{sale.id}</td>
                                        <td>{sale.employee.name}</td>
                                        <td>${sale.total.toFixed(2)}</td>
                                        <td>
                                            <button onClick={() => toggleExpand(sale.id)} className="text-[#C4A484] focus:outline-none">
                                                {expandedRow === sale.id ? <FaChevronUp /> : <FaChevronDown />}
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedRow === sale.id && (
                                        <tr className="bg-[#5A3E30]">
                                            <td colSpan="4" className="p-3">
                                                <div className="text-left text-[#D7B899]">
                                                    <p className="font-bold">Products:</p>
                                                    <ul className="list-disc list-inside">
                                                        {sale.products.map((product, index) => (
                                                            <li key={index}>
                                                                {product.name} - {product.quantity}x
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ))}
                        </tbody>
                    </table>
                </div>
            <Footer />
            </div>
        </div>
    );
}
