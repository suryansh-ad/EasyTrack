import { Database_ID , Teacher_Collection_ID , Topic_Info, Subtopics, TimeTable_Collection_ID, databases } from "../appwrite";
import { ID , Permission ,Query,Role } from "appwrite";

export async function addDailyTask(userId,data){
    return await databases.createDocument(
        Database_ID,
        Teacher_Collection_ID,
        ID.unique(),
        {
            ...data,
            DateCreated : new Date().toISOString(),
            DateCompleted : null
        },
        [
              Permission.read(Role.user(userId)),
              Permission.update(Role.user(userId)),
              Permission.delete(Role.user(userId))
        ]
    );
}

export async function getDailyTask(userId){
    return await databases.listDocuments(
        Database_ID,
        Teacher_Collection_ID,
        [
            Query.equal("userId",userId),
            // Query.orderDesc("DateCreated"),
        ]
    );
}


export async function showTopics(userID){
    return await databases.listDocuments(
        Database_ID,
        Topic_Info,
        [
            Query.equal("userID",userID),
        ]   
    );
}

export async function showSubtopics(userID, classId){
    const queries = [Query.equal("userId", userID)];
    if (classId) {
        queries.push(Query.equal("classId", classId));
    }
    return await databases.listDocuments(
        Database_ID,
        Subtopics,
        queries
    );
}

export async function addSubtopic(userId, data){
    return await databases.createDocument(
        Database_ID,
        Subtopics,
        ID.unique(),
        {
            ...data,
            userId: userId
        },
        [
            Permission.read(Role.user(userId)),
            Permission.update(Role.user(userId)),
            Permission.delete(Role.user(userId))
        ]
    );
}

export async function updateSubtopicDone(subtopicId, isDone){
    return await databases.updateDocument(
        Database_ID,
        Subtopics,
        subtopicId,
        {
            isDone
        }
    );
}

export async function deleteSubtopic(subtopicId){
    return await databases.deleteDocument(
        Database_ID,
        Subtopics,
        subtopicId
    );
}

export async function listTimeTableEntries(userId){
    return await databases.listDocuments(
        Database_ID,
        TimeTable_Collection_ID,
        [
            Query.equal("userId", userId),
            Query.orderAsc("day"),
            Query.orderAsc("startTime")
        ]
    );
}

export async function addTimeTableEntry(userId, data){
    return await databases.createDocument(
        Database_ID,
        TimeTable_Collection_ID,
        ID.unique(),
        {
            ...data,
            userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        [
            Permission.read(Role.user(userId)),
            Permission.update(Role.user(userId)),
            Permission.delete(Role.user(userId))
        ]
    );
}

export async function updateTimeTableEntry(entryId, data){
    return await databases.updateDocument(
        Database_ID,
        TimeTable_Collection_ID,
        entryId,
        {
            ...data,
            updatedAt: new Date().toISOString()
        }
    );
}

export async function deleteTimeTableEntry(entryId){
    return await databases.deleteDocument(
        Database_ID,
        TimeTable_Collection_ID,
        entryId
    );
}

export async function updateLessonCompleted(lessonID,LessonCompleted , num){

    try{
     await databases.updateDocument(
        Database_ID,
        Topic_Info,
        lessonID,
        {
            LessonCompleted : Number(LessonCompleted) + Number(num)
        }
    );
}catch(error){
    console.error("THIS ERROR?"+error);
}
}

// export async function addDailyTask(userId,data){
//     return await databases.createDocument(
//         Database_ID,
//         Teacher_Collection_ID,
//         ID.unique(),
//         {
//             ...data,
//             DateCreated : new Date().toISOString(),
//             DateCompleted : null
//         },
//         [
//               Permission.read(Role.user(userId)),
//               Permission.update(Role.user(userId)),
//               Permission.delete(Role.user(userId))
//         ]
//     );
// }
export async function addLesson(data){
    try{
        await databases.createDocument(
            Database_ID,
            Topic_Info,
            ID.unique(),
            {
                ...data,
            }
        )
    }
    catch(error){
        console.error("AdLesson function err:"+error);
    }
}
export async function deleteLesson(LessonID){
    try{
        await databases.deleteDocument(
            Database_ID,
            Topic_Info,
            LessonID
        )
    }
    catch(error){
        alert("Could not delete . Try again.");
    }
}
