import Home from "./home.jsx"
import {Route , Routes} from "react-router-dom";
import AuthPage from "./AuthPage.jsx";
import ResetPassword from "./ResetPassword.jsx";
import VerifyEmail from "./VerifyEmail.jsx";
import TimeTable from "./components/TimeTable.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Navbar from "./components/Navbar.jsx";
import Doc from "./components/Doc.jsx";
function App() {
  return (<>
    {/* <div>APP.jsx Page.</div> */}
  <Navbar></Navbar>
  <div className="wrapper-container">
<Routes>
  <Route path="/auth" element={<AuthPage/>}/>
  <Route path="/reset-password" element={<ResetPassword/>}/>
  <Route path="/verify-email" element={<VerifyEmail/>}/>
  <Route path="/doc" element={<Doc/>} />
  <Route path="/" element = {<Home/>} />
  <Route path="/timetable" element={
    <ProtectedRoute>
      <TimeTable/>
    </ProtectedRoute>
  }
  />
</Routes>
  </div>
  </>)
}

export default App
