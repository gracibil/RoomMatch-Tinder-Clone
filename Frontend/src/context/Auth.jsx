import { useContext, createContext, useState, useEffect } from "react";
import { redirect } from "react-router-dom";
import { PostRequest } from "@/services/requests/requests";
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [jwt, setJwt] = useState(null);
    
    const loginAction = async ({email, password}) =>{
        // api call to authorize user and generate token
        const data = {
            email:email,
            password:password
        }
        const res = await PostRequest({endpoint:'/dj-rest-auth/login/', data:data})

        if (jwtDecode(res.access)){
            setJwt(res.access)
            Cookies.set('refresh', res.refresh)
            return true
        }else{
            return false
        }
    }

    const logoutAction = async () =>{
        setJwt(null)
        Cookies.remove('refresh')
        const data = {
            logout:true,
        }
        await PostRequest({endpoint:'/dj-rest-auth/logout/', data:data})

        return redirect('/login')
    }

    const refreshToken = async ()=>{
        if(Cookies.get('refresh')){
            const data = {
                refresh:Cookies.get('refresh')
            }

            const res = await PostRequest({endpoint:'/dj-rest-auth/token/refresh/', data:data})

            if(res.code == 'token_not_valid'){
                logoutAction()
            }
            else if (jwtDecode(res.access)){
                setJwt(res.access)
                return true
            }
        }else{
            logoutAction()
        }

    }

    const refreshTokenInFetch = async ()=>{
        if(Cookies.get('refresh')){

            const data = {
                refresh:Cookies.get('refresh')
            }

            const res = await PostRequest({endpoint:'/dj-rest-auth/token/refresh/', data:data})

            if(res.code == 'token_not_valid'){
                logoutAction()
            }
            else if (jwtDecode(res.access)){
                setJwt(res.access)
                return true
            }
        }else{
            logoutAction()
        }

    }

    const authenticateToken = async () =>{
        // api call to check token validity
        if(jwt !== null){
            return true
        }else{
            const tryRefresh = await refreshToken()

            if(tryRefresh === true){
                return true
            }
        }
    }
    return(
    <AuthContext.Provider value={{token: jwt, setJwt, loginAction, logoutAction, authenticateToken, refreshTokenInFetch}}>
    {children}
    </AuthContext.Provider>
    )

}

export default AuthProvider;

export const useAuth = () =>{
    return useContext(AuthContext);
};