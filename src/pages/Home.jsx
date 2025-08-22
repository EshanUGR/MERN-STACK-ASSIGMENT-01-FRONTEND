import React from "react";
import {
  FiShoppingCart,
  FiTruck,
  FiTag,
  FiPhone,
  FiUserPlus,
  FiBox,
  FiClipboard,
} from "react-icons/fi";

const Home = () => {
  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20 px-6 text-center">
        <h1 className="text-5xl font-bold mb-4">Welcome to SalesPro -Ravindu Eshan's</h1>
        <p className="text-xl mb-6">
          Manage your sales, track products, register customers, and streamline
          orders effortlessly.
        </p>
        <button className="bg-white text-blue-600 font-semibold px-6 py-3 rounded shadow hover:bg-gray-100 transition">
          Get Started
        </button>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <FiUserPlus className="text-blue-500 text-4xl mb-4" />
            <h3 className="font-bold text-xl mb-2">
              Easy Customer Registration
            </h3>
            <p>
              Add new customers quickly with simple forms and manage their
              details easily.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <FiBox className="text-green-500 text-4xl mb-4" />
            <h3 className="font-bold text-xl mb-2">Item Management</h3>
            <p>
              Register new items, update stock, and track inventory efficiently.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <FiClipboard className="text-yellow-500 text-4xl mb-4" />
            <h3 className="font-bold text-xl mb-2">Order Setup</h3>
            <p>
              Create orders, manage quantities, and apply discounts seamlessly.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <FiPhone className="text-purple-500 text-4xl mb-4" />
            <h3 className="font-bold text-xl mb-2">Contact Details</h3>
            <p>
              Keep customer contact information handy and communicate
              effortlessly.
            </p>
          </div>
        </div>
      </section>

      

      {/* Contact Section */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
        <p className="mb-6">
          Have questions? Reach out and we will assist you!
        </p>
        <button className="bg-green-600 text-white px-6 py-3 rounded shadow hover:bg-green-700 transition">
          Contact Support
        </button>
      </section>

      
    </div>
  );
};

export default Home;
