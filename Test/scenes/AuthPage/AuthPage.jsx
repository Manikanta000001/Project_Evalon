import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Blue_p from "../../src/assets/Blue_p.jpeg";
import { Link } from "react-router-dom";


const AuthPage = () => {
  const [isSignup, setIsSignup] = useState(false);

  // input states
  const [name, setname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [role, setRole] = useState(""); // default role

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // basic validation for signup
    if (isSignup && password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      const url = isSignup
        ? "http://localhost:5000/api/auth/signup"
        : "http://localhost:5000/api/auth/signin";

      const body = isSignup
        ? { name, email, password,role}
        : { email, password };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      // store token if needed
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // redirect to dashboard
      localStorage.setItem("userName", response.data.name);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Section */}
      <div className="flex flex-col justify-center w-full md:w-1/3 px-8 sm:px-12 lg:px-16 bg-white">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          Welcome to Evalon
        </h1>

        {error && (
          <p className="mb-3 text-red-600 font-medium">{error}</p>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          {isSignup && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setname(e.target.value)}
                placeholder="Enter your name"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          {isSignup && (

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Role
            </label>
            <select
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="">-- Select Role --</option>
              <option value="Student">Student</option>
              <option value="Teacher">Teacher</option>
            </select>
          </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {isSignup && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          )}
          <Link to="/teacher"> 
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition"
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>
          </Link>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          {isSignup ? "Already have an account?" : "Don’t have an account?"}{" "}
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-blue-600 font-semibold hover:underline"
          >
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </p>
      </div>

      {/* Right Image Section */}
      <div className="hidden md:flex w-2/3 h-[100vh] items-center justify-center rounded-l-[4rem] shadow-lg overflow-hidden">
        <img
          src={Blue_p}
          alt="Capsule Illustration"
          className="w-full h-full object-cover object-center"
        />
      </div>
    </div>
  );
};

export default AuthPage;
