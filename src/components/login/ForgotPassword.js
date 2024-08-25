import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API_URL = "https://my-hostel-api.onrender.com/api/v1";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await axios.post(`${API_URL}/hostel/forgotPassword`, {
        email,
      });
      setMessage(res.data.message);
      setLoading(false);
      setTimeout(() => navigate("/"), 3000); // Redirect after 3 seconds
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong!");
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {loading ? (
          <button className="btn btn-primary mt-3" disabled>
            Sending...
          </button>
        ) : (
          <button type="submit" className="btn btn-primary mt-3">
            Send Reset Link
          </button>
        )}
      </form>
      {message && <div className="alert alert-success mt-3">{message}</div>}
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
};

export default ForgotPassword;
