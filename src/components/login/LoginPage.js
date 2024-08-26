import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import hostelImg from "./../../dev-data/hostel-g.jpg";
import logo from "./../../dev-data/1145.jpg";
import "./LoginPage.css"; // Custom styles
const API_URL = "https://my-hostel-api.onrender.com/api/v1";


const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = isSigningUp
        ? `${API_URL}/hostel/signup`
        : `${API_URL}/hostel/login`;
      const data = isSigningUp
        ? { name, email, password, passwordConfirm }
        : { email, password };

      const response = await axios.post(url, data);

      if (response.data.status === "success") {
        localStorage.setItem("jwt", response.data.token);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        isSigningUp
          ? "Failed to sign up. Try again."
          : "Incorrect email or password"
      );
    }
  };

  return (
    <div className="login-signup-container d-flex">
      <div className="image-container">
        {/* Background Image */}
        <div
          className="background-image"
          style={{
            backgroundImage: `url(${hostelImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: "100%",
            height: "100%",
            position: "relative",
          }}
        ></div>
      </div>
      <div className="form-container d-flex justify-content-center align-items-center">
        <div className="carditem p-4 shadow-sm">
          <div className="text-center mb-4">
            <h1 className="text-primary d-inline-block ml-2 align-middle">
              Aadi Mahalxmi Boys Hostel
            </h1>
          </div>
          <h2 className="mb-4">{isSigningUp ? "Sign Up" : "Login"}</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            {isSigningUp && (
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {isSigningUp && (
              <div className="mb-3">
                <label htmlFor="passwordConfirm" className="form-label">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="passwordConfirm"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  required
                />
              </div>
            )}
            <button type="submit" className="btn btn-primary w-100">
              {isSigningUp ? "Sign Up" : "Login"}
            </button>
          </form>
          <div className="text-center mt-3">
            <a href="/forgot-password">Forgot your password?</a>
            <br />
            <button
              className="btn btn-link mt-2"
              onClick={() => setIsSigningUp(!isSigningUp)}
            >
              {isSigningUp
                ? "Already have an account? Login"
                : "Don’t have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
