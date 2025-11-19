import React, { useState } from "react";
import InputField from "../components/InputField.tsx";
import { Link, useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
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
    <div className="min-h-screen flex transition-all transation-duration-500">

      {/* Left Branding */}
      <div className="hidden md:flex w-1/2 bg-linear-to-br from-blue-600 to-indigo-800 
                      items-center text-white p-10">
        <h1 className="text-4xl font-bold leading-tight">
          Project Management Portal<br />
          <span className="text-blue-200">Manage. Track. Deliver.</span>
        </h1>
      </div>

      {/* Right Form */}
      <div className="flex flex-1 items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">

          <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
            Login
          </h2>

          {error && (
            <p className="text-red-500 text-center mb-3">{error}</p>
          )}

          <InputField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />

          <InputField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-xl 
                       text-lg font-semibold hover:bg-blue-700 transition-all mt-4"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Don’t have an account?
            <Link to="/register" className="text-blue-600 font-semibold ml-1">
              Register
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;
