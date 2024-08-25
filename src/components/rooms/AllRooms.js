import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AddRoom from "./AddRoom"; // Import the AddRoomModal component

const API_URL = "http://localhost:5000/api/v1"; // Update with your actual API URL
const token = localStorage.getItem("jwt");

const AllRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roomStats, setRoomStats] = useState({
    totalRooms: 0,
    occupiedRooms: 0,
  });

  const fetchRoomStats = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/hostel/66adf998820d83f1797c0613`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      let fetchedRooms = response.data.rooms;

      // Sort the rooms by room number
      fetchedRooms = fetchedRooms.sort((a, b) => {
        if (a.roomNumber < b.roomNumber) return -1;
        if (a.roomNumber > b.roomNumber) return 1;
        return 0;
      });

      const occupiedRooms = fetchedRooms.filter(
        (room) => !room.isVacant
      ).length;

      setRooms(fetchedRooms);
      setFilteredRooms(fetchedRooms);
      setRoomStats({ totalRooms: fetchedRooms.length, occupiedRooms });
    } catch (error) {
      console.error("Error fetching room stats:", error);
    }
  };

  useEffect(() => {
    fetchRoomStats();
  }, []);

  useEffect(() => {
    const filterRooms = () => {
      const query = searchQuery.toLowerCase();
      const filtered = rooms.filter((room) =>
        room.roomNumber.toLowerCase().includes(query)
      );
      setFilteredRooms(filtered);
    };

    filterRooms();
  }, [searchQuery, rooms]);

  return (
    <div className="card m-3 p-3">
      <div className="row">
        <div className="col-12 d-flex justify-content-between mb-3">
          <button
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#addRoomModal"
          >
            Add Room
          </button>
          <input
            type="text"
            className="form-control w-25"
            placeholder="Search by room number"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="col-12 mb-3">
          <p>
            <strong>Total Rooms:</strong> {roomStats.totalRooms}
          </p>
          <p>
            <strong>Occupied Rooms:</strong> {roomStats.occupiedRooms}
          </p>
        </div>
        <div className="col-12">
          <div className="row">
            {filteredRooms.map((room) => (
              <div key={room._id} className="col-md-4 mb-3">
                <div
                  className={`card h-100 ${
                    room.isVacant
                      ? "bg-danger-subtle"
                      : "bg-success p-2 text-white bg-opacity-75"
                  }`}
                >
                  <div className="card-body">
                    <h5 className="card-title">
                      Room Number: {room.roomNumber}
                    </h5>
                    <p className="card-text">
                      <strong>Capacity:</strong> {room.capacity}
                    </p>
                    <p className="card-text">
                      <strong>Current Occupancy:</strong>{" "}
                      {room.currentOccupancy}
                    </p>
                    <p className="card-text">
                      <strong>Status:</strong>{" "}
                      {room.isVacant ? "Vacant" : "Occupied"}
                    </p>
                    <p className="card-text">
                      <strong>Tenants:</strong>
                      {room.hostlers.filter((tenant) => tenant.active).length >
                      0 ? (
                        <ul>
                          {room.hostlers
                            .filter((tenant) => tenant.active)
                            .map((tenant) => (
                              <li key={tenant._id}>{tenant.name}</li>
                            ))}
                        </ul>
                      ) : (
                        "No tenants"
                      )}
                    </p>
                    <Link
                      to={`/allRooms/edit-room/${room._id}`}
                      className="btn btn-primary"
                    >
                      Edit Room
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Room Modal */}
      <AddRoom fetchRoomStats={fetchRoomStats} />
    </div>
  );
};

export default AllRooms;
