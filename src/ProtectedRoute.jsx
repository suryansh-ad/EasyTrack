import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { account } from "./appwrite";
function ProtectedRoute({children}){
    const [loading , setLoading ] = useState(true);
    const [authState,setAuthState] = useState("loading");

    useEffect(()=>{
        async function CheckSession(){
            try{ 
                const user = await account.get();
                if (!user.emailVerification) {
                    setAuthState("unverified");
                    return;
                }
                setAuthState("authed");
        }catch(error){
            setAuthState("unauth");
        }
        finally{
            setLoading(false);
        }
    }
    CheckSession();
    },[])

    if(loading) return <div>Checking Session....</div>

    if(authState === "unauth"){
        return <Navigate to="/auth" replace/>;
    }
    if(authState === "unverified"){
        return <Navigate to="/verify-email?pending=1" replace/>;
    }

    return children;

}
export default ProtectedRoute;
