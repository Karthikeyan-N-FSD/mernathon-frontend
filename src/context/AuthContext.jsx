import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentState, setCurrentState] = useState("Login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    const password = form.password;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      alert(
        "Password must be at least 8 characters long, contain at least 1 number and 1 uppercase letter."
      );
      return;
    }

    const url = currentState === "Login" ? "/login" : "/signup";
    const payload =
      currentState === "Login"
        ? { email: form.email, password: form.password }
        : form;

    try {
      const response = await axiosInstance.post(`/auth${url}`, payload);
      const data = response.data;

      if (currentState === "Login") {
        if (data.token) {
          localStorage.setItem("token", data.token);
          navigate("/");
          alert("Login successful");
        } else {
          alert(data.message || "Login failed");
        }
      } else {
        alert("Signup successful. Please log in.");
        setCurrentState("Login");
        setForm({ email: "", password: "" });
      }
    } catch (error) {
      alert(error.response?.data?.message || "Server error");
    }
  };

  const getUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("User is not authenticated");
      }

      const response = await axiosInstance.get("/auth/user");
      return response.data.user;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch user profile";
      throw new Error(errorMessage);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentState,
        setCurrentState,
        form,
        setForm,
        onChange,
        onSubmitHandler,
        getUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
