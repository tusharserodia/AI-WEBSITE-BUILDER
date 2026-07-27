// import React from 'react'

import { useEffect } from "react"
import axios from "axios";
import {serverUrl} from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userslice";

const useGetCurrentUser = () => {
    const dispatch = useDispatch();
   useEffect(() =>{
      const getCurrentUser = async() => {
         try {
            const result=await axios.get(`${serverUrl}/api/user/me`, {withCredentials: true});
            // console.log(result);
            dispatch(setUserData(result.data));

         } catch (error) {
            // console.log(error);
            console.error("Backend Error Message:", error.response?.data || error.message);
         }
      }
      getCurrentUser();
   }, []);

}

export default useGetCurrentUser
