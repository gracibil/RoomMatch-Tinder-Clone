import { useContext, createContext, useState, useEffect } from "react";
import {GetRequestAuthorized, PostRequestAuthorized, PatchRequestAuthorized, DeleteRequestAuthorized } from "@/services/requests/requests";
import { redirect } from "react-router-dom";

const UserContext = createContext();

const UserProvider = ({ children, auth }) => {
    const [userData, setUserData] = useState({email:'', name:'', bio:'', gender:'', goal:'', images:[], matches:[], new_matches:[], conversations:[]});
    const [profileCreated, setProfileCreated] = useState(null)
    const getUserData = async () =>{
        const res = await GetRequestAuthorized({endpoint:'/user/data', token:auth.token, auth:auth})
        console.log('res: ', res)
        if(res.profile_created === false){
            setProfileCreated(false)
        }else{
            setProfileCreated(true)
            setUserData(res.profile_data)
        }


    };
    const removeUserData = ()=>{
        setUserData({email:'', name:'', bio:'', gender:'', goal:'', images:[], matches:[], new_matches:[], conversations:[]})
    }


    useEffect(() => {
        if (auth.token !== null){
            console.log('getting data')
            getUserData()
        }
    },[auth.token])



    return(
    <UserContext.Provider value={{userData, profileCreated, getUserData, removeUserData}}>
    {children}
    </UserContext.Provider>
    )

}

export default UserProvider;

export const useUserData = () =>{
    return useContext(UserContext);
};