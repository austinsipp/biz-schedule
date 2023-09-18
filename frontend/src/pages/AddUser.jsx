import { useState } from 'react'

const AddUser = () => {
    let [addedUser, setAddedUser] = useState({ first_name: '', last_name: '', roles: '', username: '', password: '' })
    let [requestSent, setRequestSent] = useState(false)
    let [messageDisplayed, setMessageDisplayed] = useState('')

    const onAddUserSubmit = async () => {
        console.log(addedUser)
        const response = await fetch('http://localhost:5000/users/add', {
            method: 'POST',
            body: JSON.stringify(addedUser), //make the object json 
            headers: {
                'Content-Type': 'application/json'
            }
        }
        )

        //get the json response
        const json = await response.json()
        if (response.ok) {
            setMessageDisplayed('New employee added!')
            setRequestSent(true)
        } else {
            setMessageDisplayed('There was an error, please try again!')
            setRequestSent(true)
        }
    }





    return requestSent ?
        <div>
            <p>{messageDisplayed}</p>
        </div>
        :
        <div>
            <label>First Name: </label>
            <input type='text' onChange={(e) => {
                setAddedUser({ ...addedUser, first_name: e.target.value })
            }} />
            <label>Last Name: </label>
            <input type='text' onChange={(e) => {
                setAddedUser({ ...addedUser, last_name: e.target.value })
            }} />
            <label>Roles: </label>
            <select type='text' onChange={(e) => {
                setAddedUser({ ...addedUser, roles: e.target.value })
            }}>
                <option value=" ">Choose Role</option>
                <option value="Admin">Admin</option>
                <option value="Non-Admin">Non-Admin</option>
            </select>
            <label>Username: </label>
            <input type='text' onChange={(e) => {
                setAddedUser({ ...addedUser, username: e.target.value })
            }} />
            <label>Password: </label>
            <input type='text' onChange={(e) => {
                setAddedUser({ ...addedUser, password: e.target.value })
            }} />
            <button onClick={onAddUserSubmit}>Create User</button>

        </div>

}

export default AddUser