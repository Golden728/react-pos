import React, { useState } from "react"; 
import { useMutation } from "@tanstack/react-query"; 
import { login } from "../../https/index"; 
import { enqueueSnackbar } from "notistack"; 
import { useDispatch } from "react-redux"; 
import { setUser } from "../../redux/slices/userSlice"; 
import { useNavigate } from "react-router-dom"; 
const Login = () => { const navigate = useNavigate(); 
const dispatch = useDispatch(); const [formData, setFormData] = useState({ email: "", password: "", }); 
const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); }; const loginMutation = useMutation({ mutationFn: login, onSuccess: (res) => { console.log("LOGIN RESPONSE:", res); 
const userData = res?.data; if (userData) { const { _id, name, email, phone, role } = userData; 

// ✅ SAVE TO REDUX 
dispatch(setUser({ _id, name, email, phone, role })); 

// ✅ SAVE TO LOCALSTORAGE (IMPORTANT) 
localStorage.setItem("user", JSON.stringify({ _id, name, email, phone, role })); enqueueSnackbar("Login Successful", { variant: "success" }); navigate("/"); } }, onError: (error) => { const message = error?.response?.data?.message || "Login failed"; enqueueSnackbar(message, { variant: "error" }); }, }); const handleSubmit = (e) => { e.preventDefault(); 
    loginMutation.mutate(formData); 
}; return ( <div> <form onSubmit={handleSubmit}> {/* EMAIL */} <div> <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium"> Employee Email </label> <div className="flex item-center rounded-lg p-5 px-4 bg-[#1f1f1f]"> <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter employee email" className="bg-transparent flex-1 text-white focus:outline-none" required /> </div> </div> {/* PASSWORD */} <div> <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium"> Password </label> <div className="flex item-center rounded-lg p-5 px-4 bg-[#1f1f1f]"> <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter password" className="bg-transparent flex-1 text-white focus:outline-none" required /> </div> </div> {/* BUTTON */} <button type="submit" className="w-full rounded-lg mt-6 py-3 text-lg bg-yellow-400 text-gray-900 font-bold" > {loginMutation.isPending ? "Signing in..." : "Sign in"} </button> </form> </div> ); }; export default Login;