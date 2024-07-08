import { useEffect } from "react";
import { useUserData } from "@/context/User";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
const LoadingPage = () => {
    const userData = useUserData()
    const navigate = useNavigate()

    const handleNavigate = async()=>{
        await new Promise(r => setTimeout(r, 3000));
        if(userData.profileCreated === false){
            navigate('/CreateProfile')
        }
        if (userData.userData.name !== ''){
                navigate('/Swipe')
            
        }
    }

    useEffect(() => {
        console.log('got user data')
        console.log(userData)
        if(userData.profileCreated !== null){
          handleNavigate()  
        }
        
    }, [userData])

    return(
        <div className="w-[100vw] h-[100vh] flex items-center justify-center loadingBg">

            <Home className='loadingIcon text-white w-20 h-20'/>
        
        </div>
    )
}

export default LoadingPage;