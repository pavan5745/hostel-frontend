// src/components/UnpaidTenants.js
// src/components/UnpaidTenants.js
import React from "react";
import { useLocation, Link } from "react-router-dom";

const UnpaidTenants = () => {
  const location = useLocation();
  console.log(location.state);
  const { pendingPayments } = location.state;

  // Format the current date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString("en-GB", options);
  };

  const currentDate = formatDate(new Date().toISOString());

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Unpaid Tenants</h1>
      <p>Current Date: {currentDate}</p>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Room Number</th>
            <th>Phone Number</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pendingPayments.map((tenant) => (
            <tr key={tenant._id}>
              <td>{tenant.name}</td>
              <td>{tenant.roomNumber}</td>
              <td>{tenant.phoneNo}</td>
              <td>{formatDate(tenant.dueDate)}</td>
              <td>
                <Link
                  to={`/payment-edit/${tenant._id}`}
                  className="btn btn-primary"
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UnpaidTenants;
