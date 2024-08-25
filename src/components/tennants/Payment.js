import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = "https://my-hostel-api.onrender.com/api/v1"; // Update with your actual API URL
const token = localStorage.getItem("jwt");

const PaymentEdit = () => {
  const { tenantId } = useParams(); // Assuming `tenantId` is passed for editing
  const navigate = useNavigate();
  const [tenant, setTenant] = useState({});
  const [amount, setAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const response = await axios.get(`${API_URL}/hostler/${tenantId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
        const { rent, lastPaymentDate, name, phoneNo, roomNumber } =
          response.data;
        setTenant(response.data.hostler);
        setAmount(rent || ""); // Ensure amount has a default or empty value
        setPaymentDate(lastPaymentDate || ""); // Ensure date is set or left empty
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tenant:", error);
      }
    };

    fetchTenant();
  }, [tenantId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation to ensure fields are not empty
    if (!amount || !paymentMethod) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      await axios.post(
        `${API_URL}/hostler/payments`,
        {
          hostlerId: tenantId,
          amount,
          paymentDate,
          paymentMethod,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Optionally redirect to the unpaid tenants list after updating
      navigate(`/dashBoard`);
    } catch (error) {
      console.error("Error updating payment:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="card m-3 p-3">
      <h2>Update Payment Details</h2>
      <div className="mb-3">
        <h4>Tenant Details</h4>
        <p>
          <strong>Name:</strong> {tenant.name}
        </p>
        <p>
          <strong>Phone Number:</strong> {tenant.phoneNo}
        </p>
        <p>
          <strong>Room Number:</strong> {tenant.roomNumber}
        </p>
        <p>
          <strong>Rent:</strong> {tenant.rent}
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="amount" className="form-label">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            className="form-control"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="paymentDate" className="form-label">
            Payment Date
          </label>
          <input
            type="date"
            id="paymentDate"
            className="form-control"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="paymentMethod" className="form-label">
            Payment Method
          </label>
          <input
            type="text"
            id="paymentMethod"
            className="form-control"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Update Payment
        </button>
      </form>
    </div>
  );
};

export default PaymentEdit;
