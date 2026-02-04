import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { account } from "../appwrite";
import { addDailyTask } from "./TeacherService";

function AddTasks({setTakeInput}){
    const [subject , setSubject] = useState("");
    const [className , setClassName] = useState("");
    const [totalStudents,setTotalStudents] = useState("");
    const [Error,setError] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(){
        try{
            console.log("totalstudents :",totalStudents)
        console.log("ADD TASK BTN PRESSED!");
        // e.preventDefault();  
        if(!subject || !className || !totalStudents){
            setError("Please enter all values.")
            return;
        }
        const user = await account.get();
        await addDailyTask(user.$id,{
            Subject:subject,
            Class : className,
            TotalStudents : Number(totalStudents), 
            userId : user.$id,
        });

        setClassName("");
        setSubject("");
        setTotalStudents("");
        setTakeInput(prev => !prev);


        // navigate()
    }
    catch(error){
        setError(Error);
    }
    }
        return(
            <>
            <div  className="backgroundForAddTask">

            <div className="addTaskForm">

                <button onClick={()=>{setTakeInput(prev=>!prev)}} className="closeBtn">X</button>
                    <h3>ADD NEW CLASS</h3>
                <div className="forInputs">
                    <label>Class Name</label>
                    <input type="text"  placeholder="Class" onChange={e=>{setClassName(e.target.value.toUpperCase())}}value={className} />
                </div>
                 <div className="forInputs">
                    <label>Subject</label>
                    <input type="text"  placeholder="Subject" onChange={(e)=>{setSubject(e.target.value.toUpperCase())}} value={subject} /> 
                 </div>

                 <div className="forInputs">
                    <label>Total Students</label>
                    <input type="number" value={totalStudents} placeholder="40" onChange={e=>{setTotalStudents(e.target.value)}} />
                 </div>
                <div className="forInputs">
                {Error && <span className="error">{Error}</span> }
                    <button onClick={handleSubmit}>Add Class</button>
                </div>
            </div>
            </div>
            </>
        )
}
export default AddTasks;