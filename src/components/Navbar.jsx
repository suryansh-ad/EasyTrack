import "./Navbar.css"
import { useNavigate, Link, useLocation } from "react-router-dom";
import { account } from "../appwrite";
import { useEffect, useState } from "react";
function Navbar(){
    const navigate = useNavigate();
    const [authenticated,setAuthenticated] = useState(false);
    const [userName, setUserName] = useState("");
    const {pathname} = useLocation();
    const [theme, setTheme] = useState("dark");
    useEffect(()=>{
       checkSession();
       console.log("USE EFFECT CALLED TO CHECK THE SEESSION FOR NAVABAR.....") 
    },[pathname]);
    useEffect(() => {
        const savedTheme = localStorage.getItem("easytrack-theme");
        if (savedTheme === "light" || savedTheme === "dark") {
            setTheme(savedTheme);
        }
    }, []);

    useEffect(() => {
        document.body.dataset.theme = theme;
        localStorage.setItem("easytrack-theme", theme);
    }, [theme]);
    async function handleLogout(){
            try{
                await account.deleteSession("current");
                navigate("/auth");
            }
            catch(error)
            {
                alert(error.message);
            }
        }
        async function checkSession(){
            try{
                const user = await account.get();
                setAuthenticated(true);
                setUserName(user.name || user.email || "");
            }
            catch(error){
                setAuthenticated(false);
                setUserName("");
            }
        }
    return(
        <>
              <nav className="navbar">
                    <div className="brand">
                        <div className="brandMark"></div>
                        <span>EasyTrack</span>
                        {authenticated && userName && (
                            <span className="brandGreeting">Hello, {userName}</span>
                        )}
                    </div>
                    <div className="navLinks">
                        {authenticated === true && <Link to={"/"}  className={`navLink ${pathname === "/" ? "active" : ""}`} >Home</Link>}
                        <Link className={`navLink ${pathname === "/timetable" ? "active" : ""}`} to={"/timetable"}>TimeTable</Link>
                        <Link className={`navLink ${pathname === "/doc" ? "active" : ""}`}  to={"/doc"}>Doc</Link>
                        {authenticated === true && <button className="navButton" onClick={handleLogout} >Logout</button>}
                        {authenticated === false && (
                            <>
                                <Link className="navLink" to="/auth?mode=login">Login</Link>
                                <Link className="navButton" to="/auth?mode=signup">Signup</Link>
                            </>
                        )}
                    </div>
                    <button
                        className="themeSwitch"
                        onClick={() => setTheme(prev => (prev === "dark" ? "light" : "dark"))}
                        aria-label="Toggle theme"
                    >
                        <span className="themeSwitchTrack">
                            <span className={`themeSwitchThumb ${theme === "dark" ? "is-dark" : "is-light"}`}>
                                {theme === "dark" ? "D" : "L"}
                            </span>
                        </span>
                        <span className="themeSwitchText">{theme === "dark" ? "Dark" : "Light"}</span>
                    </button>
              </nav>
     
        </>
    )
}
export default Navbar;
