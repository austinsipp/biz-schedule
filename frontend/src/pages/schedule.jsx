import { useState, useEffect, useContext } from 'react'
import { CurrentUser } from '../contexts/CurrentUser';


const Schedule = () => {
    const { currentUser } = useContext(CurrentUser)
    console.log(currentUser)
    console.log("current user is", currentUser)
    console.log("current user.roles is", currentUser.roles)

    let [weeksShifted, setWeeksShifted] = useState(0)

    function weekCalc(weekShift) {
        let weekOf = new Date()
        //console.log(weekOf.getDay())
        weekOf.setDate(weekOf.getDate() - weekOf.getDay() + (7 * weekShift))
        let day = weekOf.getDate()
        let month = weekOf.getMonth() + 1
        let year = weekOf.getFullYear()
        return `${month}-${day}-${year}`
    }
    let sundayDate = weekCalc(weeksShifted)


    let [displayWeek, setDisplayWeek] = useState(sundayDate)
    let [displayData, setDisplayData] = useState(null)
    let [loading, setLoading] = useState(true)
    let [rowBeingEdited, setRowBeingEdited] = useState('')
    let [editedRecord, setEditedRecord] = useState({ shift_id: 0, user_id: 0, first_name: '', last_name: '', start_shift: '', end_shift: '', location: '' })
    let [shiftBeingAdded, setShiftBeingAdded] = useState('')
    let [addedRecord, setAddedRecord] = useState({ user_id: 0, first_name: '', last_name: '', start_shift: '', end_shift: '', location: '' })
    let [userList, setUserList] = useState([])

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

    useEffect(() => {
        getSchedule(displayWeek)
    }, [displayWeek])

    useEffect(() => {
        getEmployees()
    }, [])

    const onPrevWeekSubmit = async (e) => {
        e.preventDefault()
        console.log("prev week clicked")
        setWeeksShifted(weeksShifted - 1)
        console.log("weeks Shifted = ", weeksShifted)
        setDisplayWeek(weekCalc(weeksShifted))
        await getSchedule(weekCalc(weeksShifted))
    }
    const onNextWeekSubmit = async (e) => {
        e.preventDefault()
        console.log("prev week clicked")
        setWeeksShifted(weeksShifted + 1)
        console.log("weeks Shifted = ", weeksShifted)
        setDisplayWeek(weekCalc(weeksShifted))
        await getSchedule(weekCalc(weeksShifted))
    }

    const onEditPress = async (e) => {
        e.preventDefault()
        console.log(e.target.getAttribute('passdata'))
        let data = JSON.parse(e.target.getAttribute('passdata'))
        console.log(data)
        setEditedRecord({ shift_id: data.shift_id, user_id: data.user_id, first_name: data.first_name, last_name: data.last_name, start_shift: data.start_shift.substring(11, 16), end_shift: data.end_shift.substring(11, 16), location: data.location, date: data.date })
        console.log(editedRecord)
        setRowBeingEdited(String(e.target.id))

    }

    const onCancelClick = (e) => {
        e.preventDefault()
        setRowBeingEdited('')
    }

    const handleClickDelete = async (e) => {
        const response = await fetch('http://localhost:5000/schedule/' + e.target.id, {
            method: 'DELETE'
        })
        const json = await response.json()
        if (response.ok) {
            getSchedule(displayWeek)
        }
    }

    const onAddClick = async (e) => {
        e.preventDefault()
        setShiftBeingAdded(e.target.id)
    }

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


    const onAddCancel = (e) => {
        e.preventDefault()
        setShiftBeingAdded('')
    }

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
            <span className="material-symbols-outlined arrow" onClick={onPrevWeekSubmit}>arrow_back_ios</span><strong>{displayWeek}</strong><span className="material-symbols-outlined arrow" onClick={onNextWeekSubmit}>arrow_forward_ios</span>
        </div>
        {loading ?
            <h1>Loading...</h1>
            :
            <div>
                <div className="scheduleDiv">
                    {displayData.days.map((day) => {
                        return <div className='calendarBox'>
                            {!(shiftBeingAdded === day.day) ?
                                <h1><strong>{String(day.day)}</strong>
                                    {currentUser.roles.includes('Admin') ?
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
                                                    {userList.map((employee) => {
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

                                            displayData.shifts.filter((shift) => {
                                                return shift.start_shift.substring(0, 10) == day.day
                                            }).map((element) => {
                                                return rowBeingEdited != element.shift_id ? (
                                                    <tr key={element.shift_id}>
                                                        <td>{element.first_name + ' ' + element.last_name}</td>
                                                        <td>{element.start_shift.substring(11, 16)}</td>
                                                        <td>{element.end_shift.substring(11, 16)}</td>
                                                        {currentUser.roles.includes('Admin') ? <>
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
                                                            {userList.map((employee) => {
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
                                                        {currentUser.roles.includes('Admin') ? <>
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