"use client"

import React, {createContext ,useState, useContext} from "react"
import themes from "./themes";
import axios from "axios";
import { toNamespacedPath } from "path";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";



export const GlobalContext = createContext();
export const GlobalUpdateContext = createContext();

export const GlobalProvider = ({ children }) => {
    
    const { user } = useUser();

    const [selectedTheme , setSelectedTheme] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [modal, setModal] = useState(false);

    const [tasks, setTasks] = useState([]);
    const theme = themes[selectedTheme];

    const openModal = () => {
        setModal(true);
    }
    const closeModal = () => {
        setModal(false);
    }
    
    const allTasks = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get("/api/tasks");

            const sorted = res.data.sort((a, b) => {
                return (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            });

            // setTasks will be given sorted tasks by date of creation 
            setTasks(sorted);
            setIsLoading(false);
        }
        catch (error) {
            console.log("Error fetching tasks: ", error);
         
        }
    }

    const deleteTask = async (id) => {
        try {
            
            
            const res = await axios.delete(`/api/tasks/${id}`);
            toast.success("task deleted");

            allTasks();
        }
        catch (error) {
            console.log("Error deleting task", task);
            toast.error("something went wrong");
        }
    }

    const updateTask = async (task) => {
        try {
            
            
            const res = await axios.put(`/api/tasks`,task);
            toast.success("task updated");

            allTasks();
        }
        catch (error) {
            console.log("Error updating task", task);
            toast.error("something went wrong");
        }
    }

    const completedTasks = tasks.filter((task) => task.isCompleted === true);
    const importantTasks = tasks.filter((task) => task.isImportant === true);
    const incompleteTasks = tasks.filter((task) => task.isCompleted === false);
 
    
    React.useEffect(() => { 
        if (user) allTasks();
        
    }, [user]);
    
    
    return (
        
        <GlobalContext.Provider
        value ={{
                theme,
                tasks,
                isLoading,
                deleteTask,
                completedTasks,
                importantTasks,
                incompleteTasks,
                updateTask,
                modal,
                openModal,
                closeModal,
                allTasks,
        }}
            >
                
        <GlobalUpdateContext.Provider value={{}}>{children}
        </GlobalUpdateContext.Provider>
            </GlobalContext.Provider>
            
    );
}
export const useGlobalState = () => useContext(GlobalContext);
export const useGlobalUpdate = () => useContext(GlobalUpdateContext);