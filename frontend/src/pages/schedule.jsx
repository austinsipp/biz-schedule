import { useState, useEffect } from 'react'


const Schedule = (currentUser) => {
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
    var [editedRecord, setEditedRecord] = useState({ shift_id: 0, user_id: 0, first_name: '', last_name: '', start_shift: '', end_shift: '', location: '' })

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

    useEffect(() => {
        getSchedule(displayWeek)
    }, [displayWeek])

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

    const onEditPress = (e) => {
        e.preventDefault()
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






    return <div>
        <h1>Week of: {displayWeek}</h1>
        {loading ?
            <h1>Loading...</h1>
            :
            <div>
                <h1>This is the schedule page</h1>
                <h2>{JSON.stringify(displayData)}</h2>
                <div className="scheduleDiv">
                    <span className="material-symbols-outlined calendarBox arrow" onClick={onPrevWeekSubmit}>arrow_back_ios</span>
                    {displayData.days.map((day) => {
                        return <div className='calendarBox'>
                            <h1><strong>{String(day.day)}</strong><span className="material-symbols-outlined">add_circle</span></h1>
                            <div className="shift">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Start</th>
                                            <th>End</th>
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
                                                        <td><span className="material-symbols-outlined" id={element.shift_id} onClick={onEditPress}>edit</span></td>
                                                        <td><span className="material-symbols-outlined" id={element.shift_id} onClick={handleClickDelete}>delete</span></td>
                                                    </tr>
                                                )

                                                    :
                                                    <tr key={element.shift_id}>
                                                        <td><input type="text" value={element.first_name + ' ' + element.last_name} onChange={(e) => {
                                                            setEditedRecord({ ...editedRecord, shift_id: element.shift_id, user_id: element.user_id, first_name: element.first_name, last_name: element.last_name, start_shift: element.start_shift, end_shift: element.end_shift, location: element.location })
                                                            setEditedRecord({ ...editedRecord, name: String(element.first_name + ' ' + element.last_name) })
                                                            setEditedRecord({ ...editedRecord, name: String(e.target.value) })
                                                        }
                                                        } /></td>
                                                        <td><input type="text" value={element.start_shift} onChange={(e) => {
                                                            setEditedRecord({ ...editedRecord, shift_id: element.shift_id, user_id: element.user_id, first_name: element.first_name, last_name: element.last_name, start_shift: element.start_shift, end_shift: element.end_shift, location: element.location })
                                                            setEditedRecord({ ...editedRecord, start_shift: String(element.start_shift) })
                                                            setEditedRecord({ ...editedRecord, start_shift: String(e.target.value) })
                                                        }
                                                        } /></td>
                                                        <td><input type="text" value={element.end_shift} onChange={(e) => {
                                                            setEditedRecord({ ...editedRecord, shift_id: element.shift_id, user_id: element.user_id, first_name: element.first_name, last_name: element.last_name, start_shift: element.start_shift, end_shift: element.end_shift, location: element.location })
                                                            setEditedRecord({ ...editedRecord, end_shift: String(element.end_shift) })
                                                            setEditedRecord({ ...editedRecord, end_shift: String(e.target.value) })
                                                        }
                                                        } /></td>
                                                        <td><span className="material-symbols-outlined" id={element.shift_id} /*onClick={onEditPress}*/>done</span></td>
                                                        <td><span className="material-symbols-outlined" onClick={onCancelClick}>cancel</span></td>
                                                    </tr>
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    })
                    }
                    <span className="material-symbols-outlined calendarBox arrow" onClick={onNextWeekSubmit}>arrow_forward_ios</span>
                </div>

            </div>
        }


    </div>
}
export default Schedule