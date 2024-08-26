
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

const API_URL = "https://my-hostel-api.onrender.com/api/v1"; 
const token = localStorage.getItem("jwt");

const Dashboard = () => {
  const [roomStats, setRoomStats] = useState({
    totalRooms: 0,
    unoccupiedRooms: 0,
  });
  const [hostlerStats, setHostlerStats] = useState({
    totalHostlers: 0,
    pendingPayments: 0,
  });
  const [salaryStats, setSalaryStats] = useState(0);
  const [unoccupiedRooms, setUnoccupiedRooms] = useState([]);
  const [activeHostlers, setActiveHostlers] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(true); // Loader state

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const hostelResponse = await axios.get(
          `${API_URL}/hostel/66adf998820d83f1797c0613`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const hostlersResponse = await axios.get(`${API_URL}/hostler`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(hostelResponse, hostlersResponse);

        const rooms = hostelResponse.data.rooms;
        const hostlers = hostlersResponse.data.hostlers;

        const unoccupiedRoomsList = rooms.filter((room) => room.isVacant);
        const activeHostlersList = hostlers.filter((t) => t.active);
        const pendingPaymentsList = activeHostlersList.filter(
          (hostler) => hostler.paymentStatus === "Pending"
        );
        const totalSalary = hostlers.reduce(
          (acc, hostler) => acc + hostler.rent,
          0
        );

        setRoomStats({
          totalRooms: rooms.length,
          unoccupiedRooms: unoccupiedRoomsList.length,
        });
        setHostlerStats({
          totalHostlers: activeHostlersList.length,
          pendingPayments: pendingPaymentsList.length,
        });
        setSalaryStats(totalSalary);
        setUnoccupiedRooms(unoccupiedRoomsList);
        setActiveHostlers(activeHostlersList);
        setPendingPayments(pendingPaymentsList);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false); // Hide loader after data is fetched
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Dashboard</h1>

      {loading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className={`row ${loading ? "blur-effect" : ""}`}>
          <div className="col-md-6">
            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">Total Rooms</h5>
                <p className="card-text">{roomStats.totalRooms}</p>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/allRooms")}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">Unoccupied Rooms</h5>
                <p className="card-text">{roomStats.unoccupiedRooms}</p>
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    navigate("/unoccupiedRooms", { state: { unoccupiedRooms } })
                  }
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">Total Hostlers</h5>
                <p className="card-text">{hostlerStats.totalHostlers}</p>
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    navigate("/tennants", { state: { activeHostlers } })
                  }
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">Pending Payments</h5>
                <p className="card-text">{hostlerStats.pendingPayments}</p>
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    navigate("/unpaidTenants", { state: { pendingPayments } })
                  }
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

