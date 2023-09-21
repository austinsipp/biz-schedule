import { useState, useEffect, useContext } from 'react'
import { CurrentUser } from '../contexts/CurrentUser';


const Schedule = () => {
    const { currentUser } = useContext(CurrentUser)/*need current user from context*/
    console.log(currentUser)
    console.log("current user is", currentUser)
    console.log("current user.roles is", currentUser.roles)

    let [weeksShifted, setWeeksShifted] = useState(0)/*this gets used to tell how many weeks from the 
                                                        original date of the page load to shift the week. 
                                                        Each time this changes, the new week gets calculated
                                                        and a new request is sent to the backend to pull the
                                                        data for that week and then the frontend displays it*/
    /*This simply gets the date that will be sent to the 
    backend to pull data for. uses the original date loaded 
    and the number of weeks shifted, i.e. the number of times 
    the user has clicked it to scroll in either direction*/
    function weekCalc(weekShift) {
        let weekOf = new Date()
        //console.log(weekOf.getDay())
        weekOf.setDate(weekOf.getDate() - weekOf.getDay() + (7 * weekShift))
        let day = weekOf.getDate()
        let month = weekOf.getMonth() + 1
        let year = weekOf.getFullYear()
        return `${month}-${day}-${year}`
    }
    let sundayDate = weekCalc(weeksShifted)/*this is called sunday date because we do all of this based on the sunday date of the week in question*/


    let [displayWeek, setDisplayWeek] = useState(sundayDate)
    let [displayData, setDisplayData] = useState(null)
    let [loading, setLoading] = useState(true)/*this gets set to true when the page first starts, so that we can wait until the async functions are abe to pull the data from the server before trying to display that data*/
    let [rowBeingEdited, setRowBeingEdited] = useState('')
    let [editedRecord, setEditedRecord] = useState({ shift_id: 0, user_id: 0, first_name: '', last_name: '', start_shift: '', end_shift: '', location: '' })
    let [shiftBeingAdded, setShiftBeingAdded] = useState('')
    let [addedRecord, setAddedRecord] = useState({ user_id: 0, first_name: '', last_name: '', start_shift: '', end_shift: '', location: '' })
    let [userList, setUserList] = useState([])

    /*
    Based on the week that the user has selected, or navigated to, this pulls the 
    employee schedule for that week so it can be displayed. It gets called when
    the page opens but also any time a user clicks to the next or previous week.
    */
    const getSchedule = async (weekFilter) => {

        const response = await fetch('http://localhost:5000/schedule/', {
            method: 'POST',
            body: JSON.stringify({ "week": weekFilter }), //make the object json 
            headers: {
                'Content-Type': 'application/json'
            }
        }
        )

        //get the json response
        const json = await response.json()
        setDisplayData(json)
        //Check of the response was ok 
        /*if(!response.ok) {
            setError(json.error)
        }
        if(response.ok){
        }*/
        setLoading(false)
    }

    /*
    This gets run when the page loads and only gets used to populate the dropdowns where an admin can add shifts to the schedule or edit them.
    We need these forms to function as dropdowns in order to better control/validate the data that gets sent to the backend.
    */
    const getEmployees = async () => {

        const response = await fetch('http://localhost:5000/users/retrieveUsers', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }
        )

        //get the json response
        const json = await response.json()
        console.log("userList will be:", typeof json, json)
        setUserList(json)
    }

    /*
    Runs on page load, but also any time the displayWeek changes. Calling getSchedule is the clue to re-pull
    the data for whatever week the user has navigated to and then re-render it.
    */
    useEffect(() => {
        getSchedule(displayWeek)
    }, [displayWeek])
    /*
    Runs once on page load
    */
    useEffect(() => {
        getEmployees()
    }, [])

    /*
    This is when a user clicks the arrow to go to the previous week. It changes the weeksShifted by -1, and
    then triggers all the downstream effects needed, changing the week displayed, and re=pulling the data 
    for that week and re-rendering it all.
    */
    const onPrevWeekSubmit = async (e) => {
        e.preventDefault()
        console.log("prev week clicked")
        setWeeksShifted(weeksShifted - 1)
        console.log("weeks Shifted = ", weeksShifted)
        setDisplayWeek(weekCalc(weeksShifted))
        await getSchedule(weekCalc(weeksShifted))
    }
    /*
    This is when a user clicks the arrow to go to the previous week. It changes the weeksShifted by +1, and
    then triggers all the downstream effects needed, changing the week displayed, and re=pulling the data 
    for that week and re-rendering it all.
    */
    const onNextWeekSubmit = async (e) => {
        e.preventDefault()
        console.log("prev week clicked")
        setWeeksShifted(weeksShifted + 1)
        console.log("weeks Shifted = ", weeksShifted)
        setDisplayWeek(weekCalc(weeksShifted))
        await getSchedule(weekCalc(weeksShifted))
    }

    /*
    This is what happens when a user clicks on the edit button to edit an employee's shift. Important 
    to note that the event gets passed an attribute 'passdata' (which was required to be a string but
    was really a json object converted to a string). This is used to pass the original values from the
    edited record into the editedRecord variable. This is important because if any of the original values 
    don't get changed by the user after this button gets pressed, e.g. if the user only changes the start
    time of the shift but not the other fields, then before adding this piece the editedRecord would
    have only had empty values in all the other fields, because when the edit form comes up, the only 
    thing that changes is the field in question when someone fills out the form. The admin may leave
    som efields untouched, and so they would have stayed blank in the editedRecord state variable
    if not for this step
    */
    const onEditPress = async (e) => {
        e.preventDefault()
        console.log(e.target.getAttribute('passdata'))
        let data = JSON.parse(e.target.getAttribute('passdata'))
        console.log(data)
        setEditedRecord({ shift_id: data.shift_id, user_id: data.user_id, first_name: data.first_name, last_name: data.last_name, start_shift: data.start_shift.substring(11, 16), end_shift: data.end_shift.substring(11, 16), location: data.location, date: data.date })
        console.log(editedRecord)
        setRowBeingEdited(String(e.target.id))

    }

    /*
    this is for if a user clicked to edit a row, but then decided to cancel their editing, everything goes back to the way it was
    */
    const onCancelClick = (e) => {
        e.preventDefault()
        setRowBeingEdited('')
    }

    /*
    This sends a delete request to delete data that the admin decides to delete
    */
    const handleClickDelete = async (e) => {
        const response = await fetch('http://localhost:5000/schedule/' + e.target.id, {
            method: 'DELETE'
        })
        const json = await response.json()
        if (response.ok) {
            getSchedule(displayWeek)
        }
    }

    /*this is when a user clicks on the + button to add a shift on a particular day. Changing the shiftBeingAdded
    variable causes a re-render and displays a form where the admin user can add a shift to the schedule
    */
    const onAddClick = async (e) => {
        e.preventDefault()
        setShiftBeingAdded(e.target.id)
    }

    /*
    This is after the user clicked to add a shift, the form pops up and this is when they submit that form.
    After this runs the data will have been sent ot the backend, stored in the database, then re-pulled
    and re-rendered on the page as if it were always there
    */
    const onAddSubmit = async (e) => {
        e.preventDefault()
        const response = await fetch('http://localhost:5000/schedule/add', {
            method: 'POST',
            body: JSON.stringify(addedRecord), //make the object json 
            headers: {
                'Content-Type': 'application/json'
            }
        }
        )

        if (await response.status == 200) {
            setShiftBeingAdded('')
            getSchedule(displayWeek)
        }
    }

    /*
    This is when a user clicks to add a shift to the schedule on a certain day to make the form
    pop up to add, but then decides against it, this gets rid of the add shift form and
    everything goes back to the way it was.
    */
    const onAddCancel = (e) => {
        e.preventDefault()
        setShiftBeingAdded('')
    }

    /*
    When the user clicks to edit a record, it turns into a form. Then the user clicks the confirm
    button and that trigger this function to run, which patches the record in question, then
    after it is done re-renders the page as if the record had always reflected the new data
    */
    const onEditConfirm = async (e) => {
        e.preventDefault()
        const response = await fetch('http://localhost:5000/schedule', {
            method: 'PATCH',
            body: JSON.stringify(editedRecord), //make the object json 
            headers: {
                'Content-Type': 'application/json'
            }
        }
        )
        if (await response.status == 200) {
            setRowBeingEdited('')
            getSchedule(displayWeek)
        }
    }






    return <div className="schedulePage">
        <h1>Week of:</h1>
        <div className="weekOf">
            {/*Displays the week in question with arrows to paginate forward and backwards by a week at a time*/}
            <span className="material-symbols-outlined arrow" onClick={onPrevWeekSubmit}>arrow_back_ios</span><strong>{displayWeek}</strong><span className="material-symbols-outlined arrow" onClick={onNextWeekSubmit}>arrow_forward_ios</span>
        </div>
        {loading ? /*if data hasnt been received from backend yet, display "loading"*/
            <h1>Loading...</h1>
            :
            <div>
                <div className="scheduleDiv">
                    {/* once we get the data back, this renders it on the page. Remember, a map function is needed because we need to have it return an array of jsx elements */}
                    {displayData.days.map((day) => {
                        return <div className='calendarBox'>
                            {!(shiftBeingAdded === day.day) ?
                                <h1><strong>{String(day.day)}</strong>
                                    {currentUser.roles.includes('Admin') ?/* we only want the add button to display if the user is an admin, otherwise they can't see it*/
                                        <span className="material-symbols-outlined controlButton" id={day.day} onClick={onAddClick} >add_circle</span>
                                        :
                                        <></>
                                    }
                                </h1>
                                :
                                <>
                                    <h1><strong>{String(day.day)}</strong></h1>
                                    {currentUser.roles.includes('Admin') ?
                                        <div className="addForm" style={{ width: "100%" }}>
                                            <div className="addFormItem">
                                                <label htmlFor="name">Name:</label>
                                                <select type="text" name="name" id="name" defaultValue=" " required onChange={(e) => {
                                                    setAddedRecord({ ...addedRecord, first_name: e.target.value.split(" ", 2)[0], last_name: e.target.value.split(" ", 2)[1] })
                                                }}>
                                                    <option  value=" ">Choose Employee</option>
                                                    {userList.map((employee) => {/*we pulled the userList on page load, we only want valid employee neames here, which is why it is a dropdown instead of a freeform text field*/
                                                        return <option required value={employee}>{employee}</option>
                                                    })}
                                                </select>
                                            </div>
                                            <div className="addFormItem">
                                                <label htmlFor="shiftStart">Shift Start Time (hh:mm military time):</label>
                                                <input type="text" name="shiftStart" id="shiftStart" onChange={(e) => {
                                                    setAddedRecord({ ...addedRecord, start_shift: shiftBeingAdded + ' ' + e.target.value + ':00.000000-00' })
                                                }} />
                                            </div>
                                            <div className="addFormItem">
                                                <label htmlFor="shiftEnd">Shift End Time (hh:mm military time):</label>
                                                <input type="text" name="shiftEnd" id="shiftEnd" onChange={(e) => {
                                                    setAddedRecord({ ...addedRecord, end_shift: shiftBeingAdded + ' ' + e.target.value + ':00.000000-00' })
                                                }} />
                                            </div>
                                            <span className="material-symbols-outlined controlButton" id={day.day} onClick={onAddSubmit} >add_task</span>
                                            <span className="material-symbols-outlined controlButton" id={day.day} onClick={onAddCancel} >cancel</span>
                                        </div>
                                        :
                                        <></>
                                    }
                                </>
                            }

                            <div className="shift">
                                <table className="styledTable">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Start</th>
                                            <th>End</th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            /*displayData has all the data for the week, but for each day element we only want the ones that match that day*/
                                            displayData.shifts.filter((shift) => {
                                                return shift.start_shift.substring(0, 10) == day.day
                                            }).map((element) => {/*element here represents one record in the schedule table, i.e. one employee shift. Only ones that match the right day will be in the right box*/
                                                return rowBeingEdited != element.shift_id ? /*if the record is being edited, display it as a form, otherwise display it normally*/(
                                                    <tr key={element.shift_id}>
                                                        <td>{element.first_name + ' ' + element.last_name}</td>
                                                        <td>{element.start_shift.substring(11, 16)}</td>
                                                        <td>{element.end_shift.substring(11, 16)}</td>
                                                        {currentUser.roles.includes('Admin') ? /* we only want the edit and delete buttons to display if the user is an admin, otherwise they can't see it*/<>
                                                            <td><span className="material-symbols-outlined" id={element.shift_id} passdata={JSON.stringify({ shift_id: element.shift_id, user_id: element.user_id, first_name: element.first_name, last_name: element.last_name, start_shift: element.start_shift, end_shift: element.end_shift, location: element.location, date: day.day })} onClick={onEditPress}>edit</span></td>
                                                            <td><span className="material-symbols-outlined" id={element.shift_id} onClick={handleClickDelete}>delete</span></td>
                                                        </>
                                                            :
                                                            <>
                                                                <td></td>
                                                                <td></td>
                                                            </>
                                                        }
                                                    </tr>
                                                )

                                                    :
                                                    <tr key={element.shift_id}>
                                                        <td><select type="text" defaultValue={element.first_name + ' ' + element.last_name} onChange={(e) => {
                                                            setEditedRecord({ ...editedRecord, first_name: String(e.target.value.split(" ", 2)[0]), last_name: String(e.target.value.split(" ", 2)[1]) })
                                                            console.log(editedRecord)
                                                        }
                                                        }>
                                                            {userList.map((employee) => {/*we pulled the userList on page load, we only want valid employee neames here, which is why it is a dropdown instead of a freeform text field*/
                                                                return <option value={employee}>{employee}</option>
                                                            })}
                                                        </select></td>
                                                        <td><input type="text" defaultValue={element.start_shift.substring(11, 16)} onChange={(e) => {
                                                            setEditedRecord({ ...editedRecord, start_shift: String(e.target.value) })
                                                            console.log(editedRecord)
                                                        }
                                                        } /></td>
                                                        <td><input type="text" defaultValue={element.end_shift.substring(11, 16)} onChange={(e) => {
                                                            setEditedRecord({ ...editedRecord, end_shift: String(e.target.value) })
                                                            console.log(editedRecord)
                                                        }
                                                        } /></td>
                                                        {currentUser.roles.includes('Admin') ? /* we only want the confirm and cancel buttons to display if the user is an admin, otherwise they can't see it*/ <>
                                                            <td><span className="material-symbols-outlined" id={element.shift_id} onClick={onEditConfirm}>done</span></td>
                                                            <td><span className="material-symbols-outlined" onClick={onCancelClick}>cancel</span></td>
                                                        </>
                                                            :
                                                            <>
                                                                <td></td>
                                                                <td></td>
                                                            </>
                                                        }
                                                    </tr>
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    })
                    }
                </div>

            </div>
        }


    </div>
}
export default Schedule