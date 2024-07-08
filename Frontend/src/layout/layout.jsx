import { Outlet } from "react-router-dom";
import Sidebar from "@/components/sidebar/Sidebar";
import { useUserData } from "@/context/User";
import { useNavigate, Navigate } from "react-router-dom";
import { useEffect } from "react";
const Layout =() => {
  const userData = useUserData()
  const nav = useNavigate()

  useEffect(() => {
    if (userData.profileCreated === false){
      nav('/CreateProfile')
    }
  },[userData.profileCreated])
  return (
    <div className=" w-[100vw] h-[100vh] flex flex-row bg-blue-200">

        <Sidebar/>

        <Outlet />

      
      </div>
  );
}

export default Layout;