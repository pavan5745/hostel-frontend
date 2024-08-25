import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5000/api/v1"; // Update with your actual API URL
const token = localStorage.getItem("jwt");
const EditRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [tenants, setTenants] = useState([]);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/hostel/66adf998820d83f1797c0613/rooms/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const roomData = response.data;

        if (roomData) {
          setRoom(roomData);
          setTenants(
            roomData.hostlers.map((tenant) => ({
              ...tenant,
              isActive: tenant.active, // Set isActive based on the active property
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching room:", error);
      }
    };

    fetchRoom();
  }, [id]);

  const handleTenantChange = async (tenantId) => {
    const updatedTenants = tenants.map((tenant) =>
      tenant._id === tenantId
        ? { ...tenant, isActive: !tenant.isActive }
        : tenant
    );
    setTenants(updatedTenants);

    try {
      const tenant = updatedTenants.find((t) => t._id === tenantId);
      await axios.patch(
        `${API_URL}/hostler/${tenantId}`,
        {
          active: tenant.isActive,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error updating tenant:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRoom({
      ...room,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure all tenant updates are complete before submitting
    const activeTenants = tenants
      .filter((tenant) => tenant.isActive)
      .map((tenant) => tenant._id);

    // Perform all tenant updates concurrently
    const tenantUpdatePromises = tenants.map((tenant) =>
      axios
        .put(
          `${API_URL}/hostler/${tenant._id}`,
          {
            active: tenant.isActive,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .catch((error) => {
          console.error("Error updating tenant:", error);
        })
    );

    try {
      await Promise.all(tenantUpdatePromises);

      // Submit the room update
      await axios.put(
        `${API_URL}/hostel/66adf998820d83f1797c0613/rooms/${id}`,

        {
          roomNumber: room.roomNumber,
          capacity: room.capacity,
          currentOccupancy: activeTenants.length,
          tenants: activeTenants,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/allRooms"); // Redirect to all rooms after successful update
    } catch (error) {
      console.error("Error updating room:", error);
    }
  };
  return room ? (
    <div className="card m-3 p-3">
      <h1>Edit Room</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="roomNumber" className="form-label">
            Room Number
          </label>
          <input
            type="text"
            className="form-control"
            id="roomNumber"
            name="roomNumber"
            value={room.roomNumber}
            onChange={handleInputChange}
            required
            disabled
            style={{ backgroundColor: "#f0f0f0", fontWeight: "bold" }} // Highlighted and read-only style
          />
        </div>
        <div className="mb-3">
          <label htmlFor="capacity" className="form-label">
            Capacity
          </label>
          <input
            type="number"
            className="form-control"
            id="capacity"
            name="capacity"
            value={room.capacity}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Tenants</label>
          <ul className="list-group">
            {tenants
              .filter((t) => t.active)
              .map((tenant) => (
                <li key={tenant._id} className="list-group-item">
                  <input
                    type="checkbox"
                    checked={tenant.isActive}
                    onChange={() => handleTenantChange(tenant._id)}
                  />{" "}
                  {tenant.name}
                </li>
              ))}
          </ul>
        </div>
        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </form>
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default EditRoom;
/*

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5000/api/v1"; // Update with your actual API URL

const EditRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [tenants, setTenants] = useState([]);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/hostel/66adf998820d83f1797c0613/rooms/${id}`
        );
        const roomData = response.data;

        if (roomData) {
          setRoom(roomData);
          setTenants(
            roomData.hostlers.map((tenant) => ({
              ...tenant,
              isActive: tenant.active, // Set isActive based on the active property
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching room:", error);
      }
    };

    fetchRoom();
  }, [id]);

  const handleTenantChange = async (tenantId) => {
    const updatedTenants = tenants.map((tenant) =>
      tenant._id === tenantId
        ? { ...tenant, isActive: !tenant.isActive }
        : tenant
    );
    setTenants(updatedTenants);

    try {
      const tenant = updatedTenants.find((t) => t._id === tenantId);
      await axios.put(`${API_URL}/hostlers/${tenantId}`, {
        active: tenant.isActive,
      });
    } catch (error) {
      console.error("Error updating tenant:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRoom({
      ...room,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const activeTenants = tenants
        .filter((tenant) => tenant.isActive)
        .map((tenant) => tenant._id);
      console.log(activeTenants);
      await axios.put(
        `${API_URL}/hostel/66adf998820d83f1797c0613/rooms/${id}`,
        {
          roomNumber: room.roomNumber,
          capacity: room.capacity,
          currentOccupancy: activeTenants.length,
          tenants: activeTenants,
        }
      );
      navigate("/allRooms"); // Redirect to all rooms after successful update
    } catch (error) {
      console.error("Error updating room:", error);
    }
  };

  return room ? (
    <div>
      <h1>Edit Room</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="roomNumber" className="form-label">
            Room Number
          </label>
          <input
            type="text"
            className="form-control"
            id="roomNumber"
            name="roomNumber"
            value={room.roomNumber}
            onChange={handleInputChange}
            required
            disabled
            style={{ backgroundColor: "#f0f0f0", fontWeight: "bold" }} // Highlighted and read-only style
          />
        </div>
        <div className="mb-3">
          <label htmlFor="capacity" className="form-label">
            Capacity
          </label>
          <input
            type="number"
            className="form-control"
            id="capacity"
            name="capacity"
            value={room.capacity}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Tenants</label>
          <ul className="list-group">
            {tenants.map((tenant) => (
              <li key={tenant._id} className="list-group-item">
                <input
                  type="checkbox"
                  checked={tenant.isActive}
                  onChange={() => handleTenantChange(tenant._id)}
                />{" "}
                {tenant.name}
              </li>
            ))}
          </ul>
        </div>
        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </form>
      <h2>Active Tenants</h2>
      <ul>
        {tenants
          .filter((tenant) => tenant.isActive) // Filter active tenants
          .map((tenant) => (
            <li key={tenant._id}>{tenant.name}</li>
          ))}
      </ul>
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default EditRoom;*/
