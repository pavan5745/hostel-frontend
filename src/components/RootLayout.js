import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import logo from "./../dev-data/1145.jpg";

const RootLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear JWT from local storage
    localStorage.removeItem("jwt");
    // Redirect to login page
    navigate("/");
  };

  return (
    <>
      <nav
        className="navbar navbar-expand-lg bg-dark border-bottom border-body fixed-top"
        data-bs-theme="dark"
      >
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <img src={logo} alt="AadiMahalxmi Logo" width="30" height="40" />
          </a>
          <span className="navbar-text">AadiMahalxmi</span>

          <form className="d-flex" role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button className="btn btn-outline-success" type="submit">
              Search
            </button>
          </form>
        </div>
      </nav>
      <div className="layout-container">
        <div className="bg-dark text-white p-3 fixed-left-sidebar">
          <nav className="nav flex-column">
            <Link
              className={`nav-link text-white d-flex align-items-center ${
                location.pathname === "/dashboard" ? "active" : ""
              }`}
              to="/dashboard"
            >
              <i className="bi bi-house-fill me-2"></i>
              Dashboard
            </Link>
            <Link
              className={`nav-link text-white d-flex align-items-center ${
                location.pathname === "/tennants" ? "active" : ""
              }`}
              to="/tennants"
            >
              <i className="bi bi-person-circle me-2"></i> Tenants
            </Link>
            <Link
              className={`nav-link text-white d-flex align-items-center ${
                location.pathname === "/allRooms" ? "active" : ""
              }`}
              to="/allRooms"
            >
              <i className="bi bi-hospital me-2"></i> Rooms
            </Link>
            <Link
              className={`nav-link text-white d-flex align-items-center ${
                location.pathname === "/monthlyData" ? "active" : ""
              }`}
              to="/monthlyData"
            >
              <i class="bi bi-cash-coin me-2"></i> Monthly Data
            </Link>
            <button className="btn btn-danger mt-3" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-2"></i> Logout
            </button>
          </nav>
        </div>
        <div className="content-container">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default RootLayout;
