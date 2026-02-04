import { useState, useEffect } from "react";
import { account } from "./appwrite.js";
import { useNavigate } from "react-router-dom";
import AddTasks from "./components/AddTasks.jsx";
import ShowTasks from "./components/ShowTasks.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

function Home() {
    const [refresh, setRefresh] = useState(false);
    const [name, setName] = useState("");
    const navigate = useNavigate();
    let username = "";

    useEffect(() => {
        async function loadUser() {
            try {
                const user = await account.get();
                setName(user.name || user.email || "");
            } catch (error) {
                console.error("Could not load user", error);
            }
        }
        loadUser();
    }, []);

    return (
        <>
            {/* <AddTasks setRefresh = {setRefresh}/> */}
            <ProtectedRoute>
                <ShowTasks />
            </ProtectedRoute>
        </>
    );
}
export default Home;
