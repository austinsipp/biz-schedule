import { useState } from 'react'

const AddUser = () => {
    let [addedUser, setAddedUser] = useState({ first_name: '', last_name: '', roles: '', username: '', password: '' })/*declare state variable to store user input from the form*/
    let [requestSent, setRequestSent] = useState(false)/*this flag is used to control whether the success/failure message gets displayed, i.e., whether the form has been submitted yet*/
    let [messageDisplayed, setMessageDisplayed] = useState('')/*this stores the message that gets displayed, will say success or error*/


    /*
    Fetch the route to add the user with the addedUser info in the body
    */
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





    return requestSent ?/*ternary operator, if the request has been sent (really in this case meaning 
                        that the request was sent and we have the response, whether success or failure)
                        then display the message, otherwise display the form. Instead of having this 
                        requestSent boolean, I couldve done if messageDisplayed ='', meaning there was 
                        no message because there has been no response yet, but decided to have this second 
                        variable to make it more clear*/
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
                <option value="Regular">Non-Admin</option>
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