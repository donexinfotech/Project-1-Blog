import React, { useState } from "react";
import { FaUserAlt } from "react-icons/fa";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const msg = document.getElementById('message')

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/auth/send-reset-mail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email }),
    });
    const body = JSON.stringify({ email: email });
    console.log(body);
    const data = await response.json();
    console.log(data);
    if (response.ok) {
      toast.success(data.message);
      msg.innerText = "Password reset link sent to your mail";
    } else {
      toast.error(data.message);
    }
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    console.log(email);
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-700" id="message">
            Enter you email
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                <FaUserAlt className="text-gray-400 mr-2" />
                <input
                  className="appearance-none bg-transparent border-none w-full text-gray-700 leading-tight focus:outline-none"
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={email}
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

export default ForgotPassword;
