import {Client , Account ,ID , Databases } from "appwrite";
const client = new Client();
client.setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
.setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID)

export const account = new Account(client);
export const databases = new Databases(client);
export const Database_ID = "69380065001f54308633";
export const Teacher_Collection_ID = "Teacher";
export const Topic_Info = "TopicInfo"
export const Subtopics = "subtopics"
export const TimeTable_Collection_ID = "timetable"
export{ ID };
