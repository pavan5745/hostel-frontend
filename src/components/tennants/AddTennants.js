import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5000/api/v1";
const token = localStorage.getItem("jwt");
const AddTennants = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const hostelId = "66adf998820d83f1797c0613"; // hostel ID

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(`${API_URL}/hostel/${hostelId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRooms(response.data.rooms);
      } catch (error) {
        console.error("Error fetching room stats:", error);
      }
    };

    fetchRooms();
  }, [hostelId]);

  const tennantSubmitHandler = async (event) => {
    event.preventDefault();
    const form = event.target;
    const data = new FormData(event.target);
    const formData = Object.fromEntries(data.entries());
    console.log(formData);
    const rN = formData.roomNumber;
    //console.log(rooms);
    const selectedRoom = rooms.filter((room) => room.roomNumber === rN);
    //console.log(selectedRoom[0]._id);
    const payload = {
      name: formData.name,
      aadharNumber: formData.aadharNumber,
      phoneNo: formData.phoneNo,
      photoUrl: formData.photoUrl,
      joiningDate: formData.joiningDate,
      rent: formData.rent,
      roomNumber: formData.roomNumber,
    };

    try {
      const response = await axios.post(
        `${API_URL}/hostler/${hostelId}/${selectedRoom[0]._id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Hostler checked in successfully:", response.data);
    } catch (error) {
      console.error("Error checking in hostler:", error);
    }
    form.reset();
    navigate("/tennants");
  };

  return (
    <div className="card m-5 p-3">
      <form onSubmit={tennantSubmitHandler} className="row g-3">
        <div className="col-md-6">
          <label htmlFor="inputName" className="form-label">
            <strong>Name</strong>
          </label>
          <input
            type="text"
            className="form-control"
            id="inputName"
            name="name"
            required
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="inputAadharNumber" className="form-label">
            Aadhar Number
          </label>
          <input
            type="number"
            className="form-control"
            id="inputAadharNumber"
            name="aadharNumber"
            required
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="inputPhoneNo" className="form-label">
            Phone Number
          </label>
          <input
            type="number"
            className="form-control"
            id="inputPhoneNo"
            name="phoneNo"
            required
            minLength="10"
            maxLength="10"
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="inputPhoto" className="form-label">
            Photo URL
          </label>
          <input
            type="text"
            className="form-control"
            id="inputPhoto"
            name="photoUrl"
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="inputJoiningDate" className="form-label">
            Joining Date
          </label>
          <input
            type="date"
            className="form-control"
            id="inputJoiningDate"
            name="joiningDate"
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="inputRent" className="form-label">
            Rent
          </label>
          <input
            type="number"
            className="form-control"
            id="inputRent"
            name="rent"
            required
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="inputRoomNumber" className="form-label">
            Room Number
          </label>
          <select
            className="form-select"
            id="inputRoomNumber"
            name="roomNumber"
            required
          >
            <option value="">Choose...</option>
            {rooms
              .filter((room) => room.isVacant)
              .map((room) => (
                <option key={room._id} value={room.roomNumber}>
                  {room.roomNumber}
                </option>
              ))}
          </select>
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTennants;
