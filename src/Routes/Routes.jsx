import {
  createBrowserRouter,
} from "react-router-dom";
import Main from "../Layout/Main";
import Home from "../pages/Home/Home/Home";
import Menu from "../pages/Menu/Menu/Menu";
import Order from "../pages/Order/Order/Order";
import Login from "../pages/Login/Login";
import SignUp from "../pages/SignUp/SignUp";
import PrivateRoute from "./PrivateRoute";
import Secret from "../pages/Shared/Secret/Secret";
import Dashboard from "../Layout/Dashboard";
import MyCart from "../pages/Dashbaord/MyCart/MyCart";
import AllUsers from "../pages/Dashbaord/AllUsers/AllUsers";
import AdminRoute from "./AdminRoute";
import AddItem from "../pages/Dashbaord/AddItem/AddItem";
import UserHome from "../pages/Dashbaord/UserHome/UserHome";
import AdminHome from "../pages/Dashbaord/AdminHome/AdminHome";
import ManageItems from "../pages/Dashbaord/ManageItems/ManageItems";
import Payment from "../pages/Dashbaord/Payment/Payment";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    children: [
      {
        path: '/',
        element: <Home></Home>
      },
      {
        path: 'menu',
        element: <Menu></Menu>
      },
      {
        path: 'order/:category',
        element: <Order></Order>
      },
      {
        path: 'login',
        element: <Login></Login>
      },
      {
        path: 'signup',
        element: <SignUp></SignUp>
      },
      {
        path: 'secret',
        element: <PrivateRoute><Secret></Secret></PrivateRoute>
      }
    ]
  },
  {
    path: "dashboard",
    element: <PrivateRoute><Dashboard /></PrivateRoute>,
    children: [
      {
        path: 'userhome',
        element: <UserHome></UserHome>
      },
      {
        path: "mycart",
        element: <MyCart />,
      },
      {
        path: 'payment',
        element: <Payment />
      },
      // admin routes
      {
        path: 'adminhome',
        element: <AdminRoute><AdminHome /></AdminRoute>
      },
      {
        path: 'allusers',
        element: <AdminRoute><AllUsers /></AdminRoute>
      },
      {
        path: 'addItem',
        element: <AdminRoute><AddItem /></AdminRoute>
      },
      {
        path: 'manageitems',
        element: <AdminRoute><ManageItems /></AdminRoute>
      }


    ]
  }
]);