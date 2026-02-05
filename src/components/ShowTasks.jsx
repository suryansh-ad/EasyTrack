import { useEffect, useState } from "react";
import { account, Database_ID, databases, Teacher_Collection_ID, Topic_Info } from "../appwrite";
import { addLesson, addSubtopic, deleteLesson, deleteSubtopic, getDailyTask, showSubtopics, showTopics, updateSubtopicDone } from "./TeacherService";
import "../index.css";
import AddTasks from "./AddTasks";
import AddLesson from "./AddLesson";
import { Query } from "appwrite";
// Completed / NOT cOMPLETED FEATURE
function ShowTasks(){

    const totalSvg = (
        <svg width="40px" height="40px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="3" width="20" height="18" rx="4" fill="currentColor" fillOpacity="0.18"></rect>
            <rect x="6" y="7" width="12" height="2" rx="1" fill="currentColor"></rect>
            <rect x="6" y="11" width="8" height="2" rx="1" fill="currentColor"></rect>
            <rect x="6" y="15" width="10" height="2" rx="1" fill="currentColor"></rect>
        </svg>
    );

    const completedSvg = (
        <svg width="40px" height="40px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.18"></circle>
            <path d="M8 12.5L11 15.5L16 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
        </svg>
    );

    const remainingSvg = (
        <svg width="40px" height="40px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.18"></circle>
            <path d="M12 7V12L15.5 13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
        </svg>
    );

    const progressSvg = (
        <svg width="40px" height="40px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="3" width="20" height="18" rx="4" fill="currentColor" fillOpacity="0.18"></rect>
            <path d="M7 15L10 12L13 14L17 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
            <circle cx="7" cy="15" r="1.2" fill="currentColor"></circle>
            <circle cx="10" cy="12" r="1.2" fill="currentColor"></circle>
            <circle cx="13" cy="14" r="1.2" fill="currentColor"></circle>
            <circle cx="17" cy="9" r="1.2" fill="currentColor"></circle>
        </svg>
    );
    
    const cap =<svg className="capSvg" version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <polygon className="st0" points="16,4 1,12 16,20 31,12 "></polygon> <path className="st0" d="M7,15.2V22c0,2.2,4,5,9,5c5,0,9-2.8,9-5v-6.8"></path> <line x1="31" y1="12" x2="31" y2="25"></line> </g></svg>

  const plusSvg = <svg className="plusOuter" width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 12H20M12 4V20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg> 

  const deleteSvg = <svg className="deleteSvg" width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10 11V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M14 11V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M4 7H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>

    const [tasks,setTasks] = useState([]);
    const [deletePressed , setDeletePressed]  = useState(false);
    const [takeInput, setTakeInput] = useState(false);
    const [grade , setGrade] = useState("");
    const [toRefresh,setToRefresh] = useState(false);
    const [topicInfo,setTopicInfo] = useState([]);
    const [takeInputLesson,setTakeInputLesson] = useState(false);
    const [subject , setSubject] = useState("");
    const [LessonCompleted , setLessonCompleted] = useState();
    const [totalStudents , setTotalStudents] = useState();
    const [currentClassID , setCurrentClassID] = useState();
    const [currentClass ,setCurrentClass]= useState();
    const [showError , setError] = useState("");
    const [disable , setDisable] = useState("");
    const [totalLessonTopics , setTotalTopics] = useState();
    const [activeID ,setActiveID] = useState(null);
    const [completed , setCompleted] = useState();
    const [subtopics, setSubtopics] = useState([]);
    const [subtopicInputs, setSubtopicInputs] = useState({});
    const [expandedTopics, setExpandedTopics] = useState({});
    const [addingSubtopics, setAddingSubtopics] = useState({});


    useEffect(()=>{
        async function fetchTasks(){
            const user = await account.get();
            const res = await getDailyTask(user.$id);
            setTasks(res.documents);
            const topicRes = await showTopics(user.$id);
            setTopicInfo(topicRes.documents);
            const subtopicRes = await showSubtopics(user.$id);
            setSubtopics(subtopicRes.documents);
        }
        fetchTasks();
        console.log("useEffect s CALLED!")
    },[deletePressed , takeInput , toRefresh])    

    useEffect(() => {
        if (tasks.length > 0 && !activeID) {
            const first = tasks[0];
            setActiveID(first.$id);
            setCurrentClass(first.$id);
            setGrade(first.Class);
            setSubject(first.Subject);
            setTotalStudents(first.TotalStudents);
        }
    }, [tasks, activeID]);

    

    async function handleDelete(TaskID){
        try{
            await databases.deleteDocument(
                Database_ID,
                Teacher_Collection_ID,
                TaskID
            );
            const result = await databases.listDocuments(
            Database_ID,
            Topic_Info,
                [Query.equal("Classid", TaskID)]
            );
            for (const doc of result.documents) {
                await databases.deleteDocument(
                    Database_ID,
                    Topic_Info,
                    doc.$id
                );
                }

                
            console.log("Delete CALLED!");
            if(tasks.length === 1){
                setCurrentClass();
            }
            else{

                setDeletePressed(prev => !prev);
                setCurrentClass(tasks[0].$id);
                setGrade(tasks[0].Class);
                setSubject(tasks[0].Subject);
                setTotalStudents(tasks[0].TotalStudents);       
            }
        }catch(error){
            alert(error , "Could not DELETE.TRY AGAIN.")

        }
    }

    async function handleCheck(task){
        console.log("HandleChekc Called!");
        try{
            await databases.updateDocument(
                Database_ID,
                Teacher_Collection_ID,
                task.$id,
                {
                    isComplete : !task.isComplete
                }
            );
            setTasks(prev=>prev.map(
                t=>
                t.$id === task.$id ? {...t , isComplete:!t.isComplete}
                :t
            )
        )
        }catch(error){
            console.error("Toggle Failed" , error);
        }
    }

    // useEffect(()=>{
    //    async function fetchTopics(){
    //     console.log("FETCH TOPICS RUNS!")
    //     const res = await showTopics();
    //     setTopicInfo(res);
    //     console.log(topicInfo.$id);
    //    }
    //    fetchTopics();
    // },[])

   function handleChangeClass(classSectionID , Grade , subject , totalStudent){
    console.log(classSectionID);
    setGrade(Grade);
    setTotalStudents(totalStudent);
    setSubject(subject);
    setCurrentClass(classSectionID);
    handleBoxInfo(topicInfo , classSectionID);
   }
   function handleBoxInfo(topics , ClassID){
    if(topics.Classid == ClassID){
        const totalLesson = topics.reduce((total, item)=>{
            return total + item.LessonNum;
        },0);

        console.log("DID WORK!")

        setTotalTopics(totalLesson);
        console.log(topics.Classid);
    }
   }
    function handleAddTask(){
        setTakeInput(true);
        console.log("Add task btn pressed!")
    }

    const filteredTopics = topicInfo.filter(
        topic => topic.Classid == currentClass
    );
    const getClassSubtopics = (classId) =>
        subtopics.filter((sub) => sub.classId == classId);
    const getClassProgress = (classId) => {
        const classSubs = getClassSubtopics(classId);
        const total = classSubs.length;
        const done = classSubs.filter(s => s.isDone).length;
        return total === 0 ? 0 : Math.round((done / total) * 100);
    };
    const getTopicSubtopics = (topicId) =>
        subtopics.filter((sub) => sub.topicId == topicId);

    const totalLessons = filteredTopics.reduce((sum, topic) => {
        const topicSubs = getTopicSubtopics(topic.$id);
        return sum + topicSubs.length;
    }, 0);

    const completedLessons = filteredTopics.reduce((sum, topic) => {
        const topicSubs = getTopicSubtopics(topic.$id);
        return sum + topicSubs.filter(s => s.isDone).length;
    }, 0);

const remainingLessons = totalLessons - completedLessons;
const progressPercent =
  totalLessons === 0
    ? 0
    : Math.round((completedLessons / totalLessons) * 100);


    function handleAddLesson(currentClassID){
            setTakeInputLesson(true);
            setCurrentClassID(currentClassID);

            

    }
async function handleDeleteLesson(LessonID){
    try{
        await deleteLesson(LessonID);
        setSubtopics(prev => prev.filter(item => item.topicId !== LessonID));
        setDeletePressed(prev => !prev);
    }catch(error){
        console.error("Could not delete topic and subtopics", error);
    }
}

async function handleToggleSubtopic(subtopic){
    try{
        await updateSubtopicDone(subtopic.$id, !subtopic.isDone);
        setSubtopics(prev =>
            prev.map(item =>
                item.$id === subtopic.$id ? { ...item, isDone: !item.isDone } : item
            )
        );
    }catch(error){
        console.error("Could not update subtopic", error);
    }
}

async function handleAddSubtopic(topic){
    if (addingSubtopics[topic.$id]) return;
    const value = (subtopicInputs[topic.$id] || "").trim();
    if (!value) return;
    try{
        setAddingSubtopics(prev => ({ ...prev, [topic.$id]: true }));
        const user = await account.get();
        await addSubtopic(user.$id, {
            topicId: topic.$id,
            classId: currentClass,
            title: value,
            isDone: false,
            order: Date.now(),
            createdAt: new Date().toISOString()
        });
        setSubtopicInputs(prev => ({ ...prev, [topic.$id]: "" }));
        setToRefresh(prev => !prev);
    }catch(error){
        console.error("Could not add subtopic", error);
    }finally{
        setAddingSubtopics(prev => ({ ...prev, [topic.$id]: false }));
    }
}

async function handleDeleteSubtopic(subtopicId){
    try{
        await deleteSubtopic(subtopicId);
        setSubtopics(prev => prev.filter(item => item.$id !== subtopicId));
    }catch(error){
        console.error("Could not delete subtopic", error);
    }
}

    return(
   <>
        <div className="outerContainer">
            {/* Classes DIV*/}
            <div className="classContainer">
                <div className="classContainerHeader">
                    <div>Classes</div>
                    <button onClick={handleAddTask}>{plusSvg}</button>
                </div>
                <div className="classContainerMain">
                    {tasks.map((classInfo)=>
                        <div className= {`classList ${activeID === classInfo.$id ? "active" : ""}`} 
                        onClick={()=>{
                             handleChangeClass(
                                classInfo.$id,
                                classInfo.Class,
                                classInfo.Subject,
                                classInfo.TotalStudents) ;
                         setActiveID(classInfo.$id)}}
                          key={classInfo.$id}
                          >
                            <div className="GradeInfo">
                               <p>
                               {cap} <span>•</span> Grade {classInfo.Class}
                                </p> 
                                <button className="deleteBtn" onClick={(e)=>{handleDelete(classInfo.$id);e.stopPropagation()}}>{deleteSvg}</button>
                                </div>
                            <p> 
                                <small className="subjectName" >{classInfo.Subject}</small> 
                            </p>
                            <div className="forline">
                                <div className="progressLineOuter">
                                    <div className="progressLine" style={{width :`${getClassProgress(classInfo.$id)}%`}}>
                                    </div>
                                </div>
                                <div className="progressNumber">
                                   <small>
                                     {getClassProgress(classInfo.$id)}%
                                    </small>

                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {/* WholeINFO DIV */}
            <div className="topicContainer">
                <div className="topicContainerHeader">
                    <div className="headerTextBlock">
                        <h1 style={{margin : 0, padding:0 , fontWeight : 500}} >Grade {grade}</h1>
                        <p>{subject} • {totalStudents} students </p>
                    </div>
                </div>
                <div className="statsContainer">
                    <div className="totalTopics statBox">
                        <div className="statSvg"> {totalSvg}</div>
                        <div className="statTexts">
                            <div>Total Subtopics</div>
                            <div>{totalLessons}</div>
                        </div>
                    </div>
                    <div className="completed statBox">
                        <div className="statSvg"> {completedSvg}</div>
                        <div className="statTexts">
                            <div>Completed</div>
                            <div>{completedLessons}</div>
                        </div>
                    </div>
                    <div className="remaining statBox">
                        <div className="statSvg"> {remainingSvg}</div>
                            <div className="statTexts">
                                <div>Remaining</div>
                                <div>{remainingLessons}</div>
                        </div>
                    </div>
                    <div className="progress statBox">
                        <div className="statSvg"> {progressSvg}</div>
                            <div className="statTexts">
                                <div>Progress</div>
                                <div>{progressPercent}%</div>
                        </div>
                    </div>
                </div>
                <div className="syllabusContainer">
                    <div className="syllabusHeader">
                        <div className="syllabusHeaderText">Syllabus Topics</div>
                        <button disabled = {tasks.length == 0} className={`${tasks.length == 0 ? disable : ""}`} onClick={()=> handleAddLesson(currentClass)} >Add Topic {plusSvg}</button>
                    </div>
                <div className="topicListContainer">
                   {
                       filteredTopics.length > 0 ? (
                           filteredTopics.map(topic => {
                                const topicSubs = getTopicSubtopics(topic.$id);
                                const topicTotal = topicSubs.length;
                                const topicCompleted = topicSubs.filter(s => s.isDone).length;
                                const topicProgress = topicTotal === 0 ? 0 : Math.round((topicCompleted / topicTotal) * 100);

                               const isOpen = !!expandedTopics[topic.$id];
                               return (
                               <div className="topicList" key={topic.$id}>
                                    <button
                                        className="topicHeader"
                                        onClick={() =>
                                            setExpandedTopics(prev => ({
                                                ...prev,
                                                [topic.$id]: !prev[topic.$id]
                                            }))
                                        }
                                        aria-expanded={isOpen}
                                    >
                                        <div className={`topicChevron ${isOpen ? "open" : ""}`}>›</div>
                                        <div className="topicHeaderText">
                                            <div className="LessonTopic">{topic.LessonTopic}</div>
                                            <div className="LessonTopicStatus">
                                                {topicCompleted} of {topicTotal} completed
                                            </div>
                                        </div>
                                        <div className="topicHeaderActions" onClick={(e)=>e.stopPropagation()}>
                                            <button onClick={()=>handleDeleteLesson(topic.$id)} className="deleteBtn">
                                                {deleteSvg}
                                            </button>
                                        </div>
                                    </button>

                                    {isOpen && (
                                        <div className="topicBody">
                                            <div className="progressLineOuter">
                                                <div className="progressLine" style={{width: `${topicProgress}%` }}></div>
                                            </div>

                                            <div className="subtopicChecklist">
                                                {topicSubs
                                                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                                                    .map(sub => (
                                                    <label className="subtopicItem" key={sub.$id}>
                                                        <input
                                                            type="checkbox"
                                                            checked={!!sub.isDone}
                                                            onChange={() => handleToggleSubtopic(sub)}
                                                        />
                                                        <span className={`subtopicText ${sub.isDone ? "done" : ""}`}>
                                                            {sub.title}
                                                        </span>
                                                        <button
                                                            className="subtopicDelete"
                                                            onClick={() => handleDeleteSubtopic(sub.$id)}
                                                            aria-label="Delete subtopic"
                                                        >
                                                            {deleteSvg}
                                                        </button>
                                                    </label>
                                                ))}
                                                {topicSubs.length === 0 && (
                                                    <div className="subtopicEmpty">
                                                        Add subtopics to start your checklist.
                                                    </div>
                                                )}
                                            </div>

                                            <div className="subtopicAddRow">
                                                <input
                                                    type="text"
                                                    placeholder="Add new subtopic..."
                                                    value={subtopicInputs[topic.$id] || ""}
                                                    onChange={(e) =>
                                                        setSubtopicInputs(prev => ({ ...prev, [topic.$id]: e.target.value }))
                                                    }
                                                />
                                                <button
                                                    onClick={() => handleAddSubtopic(topic)}
                                                    disabled={!!addingSubtopics[topic.$id] || !(subtopicInputs[topic.$id] || "").trim()}
                                                    aria-disabled={!!addingSubtopics[topic.$id] || !(subtopicInputs[topic.$id] || "").trim()}
                                                >
                                                    {plusSvg}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                        )})
                    ):(
                        <div>Add your first topic!</div>
                    )
                }
                </div>
                </div>
            </div>
        </div>
            {takeInput && (
                <div className="addTaskBg" onClick={()=>setTakeInput(false)}>
                    <div onClick={(e)=>e.stopPropagation()}>
                    <AddTasks setTakeInput ={setTakeInput}/>
                    </div>
                </div>
            )}
            { takeInputLesson && (
                <div className="addTaskBg" onClick={()=>setTakeInputLesson(false)} >
                    <div onClick={(e)=> e.stopPropagation()}>
                        <AddLesson setTakeInputLesson = {setTakeInputLesson} 
                        setToRefresh = {setToRefresh}
                        currentClassID = {currentClassID} />
                    </div>
                </div>
            )
                
            }
   </>
    )
}
export default ShowTasks;
