import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const UnoccupiedRooms = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { unoccupiedRooms } = location.state || { unoccupiedRooms: [] };

  const [exactVacancies, setExactVacancies] = useState("");

  const calculateVacancies = (rooms) => {
    return rooms.reduce(
      (acc, room) => acc + (room.capacity - room.currentOccupancy),
      0
    );
  };

  const totalVacancies = calculateVacancies(unoccupiedRooms);

  // Filter the rooms based on the exact number of vacancies, if provided
  const filteredRooms = exactVacancies
    ? unoccupiedRooms.filter(
        (room) =>
          room.capacity - room.currentOccupancy === Number(exactVacancies)
      )
    : unoccupiedRooms;

  return (
    <div className="card m-5 p-5 position-relative">
      <h1 className="">Unoccupied Rooms</h1>
      <button
        className="btn btn-primary position-absolute top-0 end-0"
        onClick={() => navigate("/dashboard")}
      >
        Back to Dashboard
      </button>
      <div className="mb-4 d-flex justify-content-end">
        <div>
          <label htmlFor="exactVacancies" className="form-label">
            Exact Vacancies:
          </label>
          <input
            type="number"
            id="exactVacancies"
            className="form-control"
            value={exactVacancies}
            onChange={(e) => setExactVacancies(e.target.value)}
          />
        </div>
      </div>
      <table className="table table-striped border">
        <thead>
          <tr>
            <th>Room Number</th>
            <th>Capacity</th>
            <th>Current Occupancy</th>
            <th>Available Vacancies</th>
          </tr>
        </thead>
        <tbody>
          {filteredRooms.map((room) => (
            <tr key={room.roomNumber}>
              <td>{room.roomNumber}</td>
              <td>{room.capacity}</td>
              <td>{room.currentOccupancy}</td>
              <td>{room.capacity - room.currentOccupancy}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <h5>Total Vacancies: {totalVacancies}</h5>
      </div>
    </div>
  );
};

export default UnoccupiedRooms;
