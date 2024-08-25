import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5000/api/v1"; // Update with your actual API URL
const token = localStorage.getItem("jwt");
const hostelId = "66adf998820d83f1797c0613";

const EditTenant = () => {
  const param = useParams();
  const { hostlerId } = useParams();
  console.log(param);
  const navigate = useNavigate();
  const [tenant, setTenant] = useState({
    name: "",
    phoneNo: "",
    photo: "",
    roomNumber: "",
    active: true,
  });
  const [vacantRooms, setVacantRooms] = useState([]);

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const response = await axios.get(`${API_URL}/hostler/${hostlerId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const fetchedTenant = response.data.hostler;
        console.log(fetchedTenant);
        // Ensure that lastPaymentDate is handled correctly
        setTenant({
          ...fetchedTenant,
          lastPaymentDate: fetchedTenant.lastPaymentDate || "", // Handle missing date
        });
      } catch (error) {
        console.error("Error fetching tenant:", error);
      }
    };
    fetchTenant();
  }, [hostlerId]);

  useEffect(() => {
    const fetchVacantRooms = async () => {
      try {
        const response = await axios.get(`${API_URL}/hostel/${hostelId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const rooms = response.data.rooms;
        const vacant = rooms.filter((room) => room.isVacant);
        setVacantRooms(vacant);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
    fetchVacantRooms();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTenant((prevTenant) => ({
      ...prevTenant,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    setTenant((prevTenant) => ({
      ...prevTenant,
      active: e.target.checked,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${API_URL}/hostler/${hostlerId}`, tenant, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/tennants");
    } catch (error) {
      console.error("Error updating tenant:", error);
    }
  };

  return (
    <div className="card m-5 p-5">
      <h2>Edit Tenant</h2>
      <form onSubmit={handleSubmit}>
        <div className="row">
          {/* Column 1 */}
          <div className="col-md-6 mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={tenant.name}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="phoneNo" className="form-label">
              Phone Number
            </label>
            <input
              type="text"
              className="form-control"
              id="phoneNo"
              name="phoneNo"
              value={tenant.phoneNo}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="photo" className="form-label">
              Photo URL
            </label>
            <input
              type="text"
              className="form-control"
              id="photo"
              name="photo"
              value={tenant.photo}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="rent" className="form-label">
              Rent
            </label>
            <input
              type="number"
              className="form-control"
              id="rent"
              name="rent"
              value={tenant.rent}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="roomNumber" className="form-label">
              Room Number
            </label>
            <select
              className="form-control"
              id="roomNumber"
              name="roomNumber"
              value={tenant.roomNumber}
              onChange={handleChange}
            >
              <option value="">Select Room</option>
              {vacantRooms.map((room) => (
                <option key={room._id} value={room.roomNumber}>
                  {room.roomNumber}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="active" className="form-label">
              Active
            </label>
            <input
              type="checkbox"
              id="active"
              name="active"
              checked={tenant.active}
              onChange={handleCheckboxChange}
            />
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-primary">
              Update Tenant
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditTenant;
