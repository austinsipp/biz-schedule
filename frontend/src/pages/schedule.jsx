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


    return <div>
        <h1>Week of: {displayWeek}</h1>
        {loading ?
            <h1>Loading...</h1>
            :
            <div>
                <h1>This is the schedule page</h1>
                <h2>{JSON.stringify(displayData)}</h2>
            </div>
        }
        <button onClick={onPrevWeekSubmit}>Prev</button>
        <button onClick={onNextWeekSubmit}>Next</button>
    </div>
}
export default Schedule