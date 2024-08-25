import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./components/RootLayout";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";
import DashBoard from "./components/DashBoard";
import Tennants from "./components/tennants/Tennants";
import AddTennants from "./components/tennants/AddTennants";
import AllRooms from "./components/rooms/AllRooms";
import AddRoom from "./components/rooms/AddRoom";
import EditRoom from "./components/rooms/EditRoom";
import UnpaidTenants from "./components/tennants/UnpaidTennants";
import UnoccupiedRooms from "./components/rooms/UnoccupiedRooms";
import EditTennants from "./components/tennants/EditTennants";
import LoginPage from "./components/login/LoginPage";
import ForgotPassword from "./components/login/ForgotPassword";
import MonthlyData from "./components/tennants/MonthlyData";
import PaymentEdit from "./components/tennants/Payment";
const router = createBrowserRouter([
  { index: "/", element: <LoginPage /> },
  { path: "/forgot-password", element: <ForgotPassword></ForgotPassword> },
  {
    path: "/",
    element: <RootLayout></RootLayout>,
    children: [
      { path: "/monthlyData", element: <MonthlyData></MonthlyData> },
      {
        path: "/payment-edit/:tenantId",
        element: <PaymentEdit></PaymentEdit>,
      },
      { path: "/dashboard", element: <DashBoard></DashBoard> },
      { path: "/tennants", element: <Tennants /> },
      { path: "/addTennants", element: <AddTennants></AddTennants> },
      { path: "/editTenant/:hostlerId", element: <EditTennants /> },
      { path: "/allRooms", element: <AllRooms></AllRooms> },
      { path: "/unoccupiedRooms", element: <UnoccupiedRooms /> },
      { path: "/unpaidTenants", element: <UnpaidTenants /> },
      { path: "/allRooms/addRoom", element: <AddRoom></AddRoom> },
      { path: "/allRooms/edit-room/:id", element: <EditRoom></EditRoom> },
    ],
  },
]);
function App() {
  return <RouterProvider router={router}> App</RouterProvider>;
}

export default App;
