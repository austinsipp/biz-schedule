import { useContext, useState } from "react"
import { redirect } from "react-router"
import { CurrentUser } from "../contexts/CurrentUser"

function Logout() {

    const { setCurrentUser } = useContext(CurrentUser)

    const [errorMessage, setErrorMessage] = useState(null)

    async function handleSubmit(e) {
        e.preventDefault()
        const response = await fetch('http://localhost:5000/authentication/logout', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }//,
            //body: JSON.stringify(credentials)
        })
        const data = await response.json()
        if (response.status === 200) {
            setCurrentUser(null)
            redirect('/')
        } else {
            setErrorMessage(data.message)
        }

    }

    return (
        <div>
            <h1>Are you sure you want to Logout?</h1>
            {errorMessage !== null
                ? (
                    <div className="alert alert-danger" role="alert">
                        {errorMessage}
                    </div>
                )
                : null
            }
            <form onSubmit={handleSubmit}>
                <input className="btn btn-primary" type="submit" value="Logout" />
            </form>
        </div>
    )
}

export default Logout