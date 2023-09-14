import { useContext, useState } from "react"
import { CurrentUser } from "../contexts/CurrentUser"

function LoginForm() {

    const { setCurrentUser } = useContext(CurrentUser)

    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    })

    const [errorMessage, setErrorMessage] = useState(null)

    async function handleSubmit(e) {
        e.preventDefault()
        const response = await fetch('http://localhost:5000/authentication/', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        })
        const data = await response.json()
        if (response.status === 200) {
            setCurrentUser(data.user)
        } else {
            setErrorMessage(data.message)
        }

    }

    return (
        <main className="loginPageParent">
            <div className="loginPage">
            <h1>Welcome to SuperSchedule!</h1>
            {errorMessage !== null
                ? (
                    <div className="alert alert-danger" role="alert">
                        {errorMessage}
                    </div>
                )
                : null
            }
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-sm-6 form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            required
                            value={credentials.username}
                            onChange={e => setCredentials({ ...credentials, username: e.target.value })}
                            className="form-control"
                            id="username"
                            name="username"
                        />
                    </div>
                    <div className="col-sm-6 form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            required
                            value={credentials.password}
                            onChange={e => setCredentials({ ...credentials, password: e.target.value })}
                            className="form-control"
                            id="password"
                            name="password"
                        />
                    </div>
                </div>
                <input className="btn btn-primary logonButton" type="submit" value="Login" />
            </form>
            </div>
        </main>
    )
}

export default LoginForm