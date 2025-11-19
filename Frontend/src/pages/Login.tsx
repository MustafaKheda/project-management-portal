import React, { useState } from "react";
import InputField from "../components/InputField.tsx";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  // Validation errors
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  // API error
  const [apiError, setApiError] = useState<string>("");

  // -------------------------------
  // Email Validation
  // -------------------------------
  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!value) return setEmailError("Email is required");
    if (!regex.test(value)) return setEmailError("Enter a valid email");

    setEmailError("");
  };

  // -------------------------------
  // Password Validation
  // -------------------------------
  const validatePassword = (value: string) => {
    if (!value) return setPasswordError("Password is required");
    if (value.length < 6)
      return setPasswordError("Password must be at least 6 characters long");

    setPasswordError("");
  };

  // -------------------------------
  // Login Handler
  // -------------------------------
  const handleLogin = async () => {
    setApiError("");

    // Frontend validation block
    if (emailError || passwordError || !email || !password) {
      setApiError("Please fix the errors before logging in.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_BASEURL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setApiError(data.message || "Invalid email or password");
        setLoading(false);
        return;
      }

      // Save token + user
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (err) {
      setApiError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex transition-all duration-500">

      {/* Left Branding */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-600 to-indigo-800 
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

          {/* API Error */}
          {apiError && (
            <p className="text-red-600 text-center bg-red-100 py-2 rounded-md mb-3 text-sm">
              {apiError}
            </p>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            {/* Email */}
            <InputField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                validateEmail(e.target.value);
              }}
              placeholder="you@example.com"
            />
            {emailError && <p className="text-red-600 text-sm mt-1">{emailError}</p>}

            {/* Password + Eye */}
            <div className="relative mt-4">
              <InputField
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validatePassword(e.target.value);
                }}
                placeholder="••••••••"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {passwordError && <p className="text-red-600 text-sm mt-1">{passwordError}</p>}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-xl 
                         text-lg font-semibold hover:bg-blue-700 transition-all mt-4
                         disabled:bg-blue-300"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Register Link */}
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
