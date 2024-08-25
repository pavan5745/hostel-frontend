import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5000/api/v1"; // Update with your actual API URL
const token = localStorage.getItem("jwt");

const Tennants = () => {
  const navigate = useNavigate();
  const [tenants, setTenants] = useState([]);

  const fetchTenants = async () => {
    try {
      const response = await axios.get(`${API_URL}/hostler`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      setTenants(response.data.hostlers);
    } catch (error) {
      console.error("Error fetching tenants:", error);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const addTenantHandler = () => {
    navigate("/addTennants");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      day: "2-digit",
      month: "long",
      year: "numeric",
    };
    return date.toLocaleDateString("en-GB", options);
  };

  return (
    <div className="card m-3 p-3">
      <div className="row">
        <div className="col">
          <button onClick={addTenantHandler} className="btn btn-primary mb-3">
            Add Tenants
          </button>
        </div>
      </div>

      <div>
        <div className="row">
          {tenants
            .filter((tenant) => tenant.active)
            .map((tenant) => (
              <div key={tenant._id} className="col-md-4">
                <Link
                  to={`/editTenant/${tenant._id}`}
                  className="text-decoration-none"
                >
                  <div
                    className={`card mb-4 ${
                      tenant.paymentStatus === "Pending"
                        ? "bg-danger-subtle"
                        : "bg-info-subtle"
                    }`}
                  >
                    <img
                      src={tenant.photo || "default-photo-url"} // Replace "default-photo-url" with an actual default photo URL
                      className="card-img-top"
                      alt={`${tenant.name}'s photo`}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{tenant.name}</h5>
                      <p className="card-text">
                        <strong>Phone:</strong> {tenant.phoneNo}
                      </p>
                      <p className="card-text">
                        <strong>Due Date:</strong> {formatDate(tenant.dueDate)}
                      </p>
                      <p className="card-text">
                        <strong>Payment Status:</strong> {tenant.paymentStatus}
                      </p>
                      <p className="card-text">
                        <strong>Room Number:</strong> {tenant.roomNumber}
                      </p>
                      <p className="card-text">
                        <strong>Status:</strong>{" "}
                        {tenant.active ? "Active" : "Inactive"}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
export default Tennants;
