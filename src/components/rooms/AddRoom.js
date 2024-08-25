import React, { useState } from "react";
import axios from "axios";
const token = localStorage.getItem("jwt");
const AddRoom = ({ fetchRoomStats }) => {
  const [roomNumber, setRoomNumber] = useState("");
  const [capacity, setCapacity] = useState("");
  const [currentOccupancy, setCurrentOccupancy] = useState("");

  const handleAddRoom = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/v1/hostel/66adf998820d83f1797c0613/rooms",

        {
          roomNumber,
          capacity,
          currentOccupancy,
          isVacant: currentOccupancy < capacity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchRoomStats(); // Refresh the room stats after adding a room
    } catch (error) {
      console.error("Error adding room:", error);
    }
  };

  return (
    <div
      className="modal fade"
      id="addRoomModal"
      tabIndex="-1"
      aria-labelledby="addRoomModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="addRoomModalLabel">
              Add Room
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label htmlFor="roomNumber" className="form-label">
                  Room Number
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="roomNumber"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
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
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="currentOccupancy" className="form-label">
                  Current Occupancy
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="currentOccupancy"
                  value={currentOccupancy}
                  onChange={(e) => setCurrentOccupancy(e.target.value)}
                />
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAddRoom}
              data-bs-dismiss="modal"
            >
              Add Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRoom;
