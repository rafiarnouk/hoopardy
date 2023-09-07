import React, { useState, useEffect } from "react"
import "./styles.css"
import axios from "axios"
import { useCookies } from "react-cookie"
import { useNavigate } from "react-router-dom"

export function Auth() {
    const [_, setCookies] = useCookies(["access_token"])

    const navigate = useNavigate()

    function Register() {
        const [username, setUsername] = useState("")
        const [password, setPassword] = useState("")
        const [status, setStatus] = useState("")

        async function handleSubmit(event) {
            event.preventDefault()

            try {
                const response = await axios.post("http://localhost:3001/auth/register", {
                    username,
                    password
                })

                console.log(response)
                if (response.data.message !== "user exists already") {
                    setStatus("registered")
                    try {
                        const response = await axios.post("http://localhost:3001/auth/login", {
                            username,
                            password
                        })

                        console.log(response)
                        if (response.data.message !== "username or password is incorrect" && response.data.message !== "user does not exist") {
                            setCookies("access_token", response.data.token)
                            window.localStorage.setItem("userID", response.data.userID)
                            navigate("/")
                        } else {
                            setStatus(response.data.message)
                        }

                    } catch (error) {
                        console.log(error)
                    }
                } else {
                    setStatus("user exists already")
                }
            } catch (error) {
                console.log(error)
            }
        }

        return (
            <form className="register" onSubmit={handleSubmit}>
                <h3>Register</h3>
                <div className="inputs">
                    <input
                        type="text"
                        className="username"
                        placeholder="Choose Username"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                    />
                    <input
                        type="password"
                        className="password"
                        placeholder="Choose Password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </div>
                {(status === "user exists already") && <span className="auth-status-bad">Username is in use already </span>}
                <button type="submit">Register & Login</button>
            </form>
        )
    }

    function Login() {
        const [username, setUsername] = useState("")
        const [password, setPassword] = useState("")
        const [status, setStatus] = useState("")

        async function handleSubmit(event) {
            event.preventDefault()

            try {
                const response = await axios.post("http://localhost:3001/auth/login", {
                    username,
                    password
                })

                console.log(response)
                if (response.data.message !== "username or password is incorrect" && response.data.message !== "user does not exist") {
                    setCookies("access_token", response.data.token)
                    window.localStorage.setItem("userID", response.data.userID)
                    navigate("/")
                } else {
                    setStatus(response.data.message)
                }

            } catch (error) {
                console.log(error)
            }
        }

        return (
            <>
                <form className="login" onSubmit={handleSubmit}>
                    <h3>Login</h3>
                    <div className="inputs">
                        <input
                            type="text"
                            className="username"
                            placeholder="Enter Username"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                        />
                        <input
                            type="password"
                            className="password"
                            placeholder="Enter Password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                    </div>
                    {(status === "username or password is incorrect") && <span className="auth-status-bad">Username or password is incorrect</span>}
                    {(status === "user does not exist") && <span className="auth-status-bad">User does not exist</span>}
                    <button type="submit">Login</button>
                </form>
            </>
        )
    }

    return (
        <div className="auth">
            <Register />
            <Login />
        </div>
    )
}