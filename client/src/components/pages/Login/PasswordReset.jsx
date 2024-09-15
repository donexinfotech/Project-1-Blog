import React, { useState } from "react";
import { FaUserAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

const PasswordReset = () => {
    const {email} = useParams()
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        password: "",
        Cpassword: "",
      });
    
      const handleChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value, 
        });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        const { password, Cpassword } = formData;
    
        if (password !== Cpassword) {
          toast.error("Passwords do not match!");
          return;
        }
    
        try {
          const response = await fetch(`/api/auth/password-reset/${email}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ password : password }), 
          });
    
          const data = await response.json();
    
          if (response.ok) {
            toast.success("Password successfully reset!");
            navigate('/login')
          } else {
            toast.warn(`Error: ${data.message}`);
          }
        } catch (error) {
          console.error("Error resetting password:", error);
          toast.error("An error occurred. Please try again.");
        }
    }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-700" id="message">
            Reset Password
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="email">
                Password
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                <FaUserAlt className="text-gray-400 mr-2" />
                <input
                  className="appearance-none bg-transparent border-none w-full text-gray-700 leading-tight focus:outline-none"
                  id="password"
                  type="text"
                  name="password"
                  placeholder="Enter your new password"
                //   value={email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="email">
                Confirm Password
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                <FaUserAlt className="text-gray-400 mr-2" />
                <input
                  className="appearance-none bg-transparent border-none w-full text-gray-700 leading-tight focus:outline-none"
                  id="Cpassword"
                  type="text"
                  name="Cpassword"
                  placeholder="Confirm password"
                //   value={email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default PasswordReset;
