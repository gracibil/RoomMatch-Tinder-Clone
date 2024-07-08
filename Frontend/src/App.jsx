import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "@/layout/layout";
import Home from "@/pages/Home/HomePage";
import LoginPage from "@/pages/Login/LoginPage";
import PrivateRoute from "@/services/routes/privateRoute.jsx";
import { useAuth } from "@/context/Auth.jsx";
import UserProvider from "@/context/User";
import ProfilePage from "@/pages/ProfilePage/ProfilePage";
import ChatPage from "@/pages/ChatPage/ChatPage";
import SwipePage from "@/pages/SwipePage/SwipePage";
import UserProfilePage from "@/pages/UserProfilePage/UserProfilePage";
import RegisterPage from "@/pages/Login/RegisterPage";
import CreateProfilePage from "@/pages/CreateProfile/CreateProfilePage";
import LoadingPage from "./pages/LoadingPage/Loading";
const App = () => {
  const auth = useAuth()
  const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    loader: () => PrivateRoute(auth),
    children: [
      {
        path: "/Home",
        element: <Home />,
      },
      {
        path: "/Profile",
        element: <ProfilePage />,
      },
      {
        path: "/Chat",
        element: <ChatPage />,
      },
      {
        path: "/Swipe",
        element: <SwipePage />,
      },
      {
        path: "/User",
        element: <UserProfilePage />,
      },


    ],
  },
  {
    path: "/CreateProfile",
    element: <CreateProfilePage />,
    loader: () => PrivateRoute(auth),
  },
  {
    path: "/Loading",
    element: <LoadingPage />,
    loader: () => PrivateRoute(auth),
  },
  {
    path: "/login",
    element: <LoginPage/>,
  },
  {
    path: "/register",
    element: <RegisterPage/>,
  },
]);



  return (
    <>
    <UserProvider auth={auth}>
      <RouterProvider router={router}/>
    </UserProvider>  
    </>

  );
}

export default App;
