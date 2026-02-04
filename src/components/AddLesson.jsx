import { useState } from "react";
import { addLesson } from "./TeacherService";
import { account } from "../appwrite";
export default function AddLesson({setTakeInputLesson ,setToRefresh, currentClassID}){

        const [subject , setSubject] = useState("");
        const [LessonTopic , setLessonTopic] = useState("");
        const [Error,setError] = useState("");

        async function handleSubmit(currentClassID){
            if(LessonTopic =="")
                {
                    setError("Please Enter Topic Name.");
                    return;
                }  
            const user = await account.get();
        await addLesson({
            Classid : currentClassID,
            LessonTopic : LessonTopic,
            LessonNum : 0,
            LessonCompleted : 0,
            userID : user.$id,
        });
        setToRefresh(prev => !prev);
        setTakeInputLesson(false);
        setLessonTopic("");

}   
    return(
         <>
            <div  className="backgroundForAddTask">
            <div className="addTaskForm">
                <button onClick={()=>{setTakeInputLesson(prev=>!prev)}} className="closeBtn">X</button>
                    <h3>ADD LESSON</h3>
                <div className="forInputs">
                    <label>Topic Name</label>
                    <input type="text"  placeholder="Algebra and Integration ... " onChange={e=>{setLessonTopic(e.target.value)}}value={LessonTopic} />
                </div>
                 <div className="forInputs">
                    <label>Subtopics will be added after creating the topic.</label>
                 </div>

                <div className="forInputs">
                {Error && <span className="error">{Error}</span> }
                    <button onClick={()=> handleSubmit(currentClassID)}>Add Lesson</button>
                </div>
            </div>
            </div>
            </>
    )
}
