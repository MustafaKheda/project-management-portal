import React, { useState } from "react";
import InputField from "../components/InputField";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Validation errors
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });

    if (key === "email") validateEmail(value);
    if (key === "password") validatePassword(value);
  };

  // ------------------------------
  // EMAIL VALIDATION
  // ------------------------------
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) return setEmailError("Email is required");
    if (!regex.test(email)) return setEmailError("Enter a valid email");

    setEmailError("");
  };

  // ------------------------------
  // PASSWORD VALIDATION
  // ------------------------------
  const validatePassword = (password: string) => {
    if (!password) return setPasswordError("Password is required");
    if (password.length < 8)
      return setPasswordError("Must be at least 8 characters long");
    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password))
      return setPasswordError("Must include letters and numbers");

    setPasswordError("");
  };

  // ------------------------------
  // REGISTER HANDLER
  // ------------------------------
  const handleRegister = async () => {
    setError("");

    // Block submission if invalid
    if (emailError || passwordError || !form.email || !form.password) {
      setError("Please fix validation errors");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_BASEURL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid details");
        setLoading(false);
        return;
      }
      console.log(data)
      // Save token L
      localStorage.setItem("token", data.token);
      debugger
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

          {/* Email Input */}
          <InputField
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="you@example.com"
          />
          {emailError && <p className="text-red-600 text-sm mt-1">{emailError}</p>}

          {/* Password Input with Eye Button */}
          <div className="relative mt-4">
            <InputField
              label="Password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="••••••••"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {passwordError && <p className="text-red-600 text-sm mt-1">{passwordError}</p>}

          {/* Error Box */}
          {error && (
            <div className="bg-red-100 text-red-700 p-2 rounded-md mt-3 text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleRegister}
            disabled={loading}
            className={`w-full bg-indigo-600 text-white py-2 rounded-xl text-lg font-semibold
                       hover:bg-indigo-700 transition-all mt-4 disabled:bg-indigo-300`}
          >
            {loading ? "Creating..." : "Create Account"}
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
