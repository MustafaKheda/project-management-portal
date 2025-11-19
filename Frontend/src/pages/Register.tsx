import React, { useState } from "react";
import InputField from "../components/InputField";
import { Link, useNavigate } from "react-router-dom";

const Register: React.FC = () => {
   const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };
  const handleRegister = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid email or password");
        setLoading(false);
        return;
      }

      // Save token
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (err) {
      setError("Something went wrong");
    }

    setLoading(false);
  };


  return (
    <div className="min-h-screen flex">

      {/* Left Section */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 
                      items-center justify-center text-white p-10">
        <h1 className="text-5xl font-bold leading-tight">
          Create Your Workspace<br />
          <span className="text-purple-200">Collaborate. Plan. Execute.</span>
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex flex-1 items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">

          <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
            Register
          </h2>
          <InputField
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="you@example.com"
          />

          <InputField
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            placeholder="••••••••"
          />

          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-xl 
                       text-lg font-semibold hover:bg-indigo-700 transition-all mt-4"
          >
            Create Account
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?
            <Link to="/login" className="text-indigo-600 font-semibold ml-1">
              Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Register;
