import { redirect } from "react-router-dom"

const PrivateRoute = async (authState) =>{
    const auth = await authState.authenticateToken()
    
    if(auth === true){
       return true
    }else{
       return redirect('/login') 
    }
    
}

export default PrivateRoute;