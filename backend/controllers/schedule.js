const router = require('express').Router()
const { sequelize } = require('../models')
const db = require("../models")

const { Schedule, User } = db


/*
This route is for pulling the current displayed week of data from 
the database. Each time the user changes this on the frontend,
this route gets hit with a new date in the request body, so different
data gets sent back for the different week.

It also pulls the list of days by date in the week, which gets used
to label the date in each date window.
*/
router.post('/', async (req, res) => {
    let shifts = await sequelize.query(`
    select * 
    from public."Schedule" 
    where start_shift between '${req.body.week}' 
    and (date('${req.body.week}') + interval '7' day)`)

    let days = await sequelize.query(`
    SELECT day::date 
    FROM   generate_series(timestamp '${req.body.week}', (date('${req.body.week}') + interval '6' day), '1 day') day`)

    let response = {"shifts" : shifts[0], "days" : days[0]}
    
    console.log(response)
    res.json(response)
})

/*
This route will add a shift to the schedule table. The first step
is to check the employee given in the request body to get their
user_id, which is required to insert into the schedule table.
Then it gets inserted into the table.
*/
router.post('/add', async (req, res) => {
    console.log("request body is:",req.body)
    let user_id_of_request = await User.findOne({
        where: { first_name: req.body.first_name, 
            last_name: req.body.last_name
         }
    })
    let user_id_of_new_shift = user_id_of_request.user_id
    
    console.log("request body",req.body)
    let response = await sequelize.query(`
    insert into public."Schedule" (user_id, first_name, last_name, start_shift, end_shift, location) values ('${user_id_of_new_shift}', '${req.body.first_name}', '${req.body.last_name}', '${req.body.start_shift}', '${req.body.end_shift}', 'main office')
    `)
    /*
    let days = await sequelize.query(`
    SELECT day::date 
    FROM   generate_series(timestamp '${req.body.week}', (date('${req.body.week}') + interval '6' day), '1 day') day`)

    let response = {"shifts" : shifts[0], "days" : days[0]}
    */
   
    console.log(response)
    res.json(response)
})


/*
This route is used for modifying shifts in the schedule table. It 
uses the fields in the request body to update. Note, the user cannot 
on the frontend modify the shift_id, so that field is how we know
which shift is begin edited.
*/
router.patch('/', async (req, res) => {
    console.log("request body",req.body)
    let response = await sequelize.query(`
    update public."Schedule" 
        set user_id =  ${req.body.user_id},
        first_name =  '${req.body.first_name}' ,
        last_name =  '${req.body.last_name}' ,
        start_shift =  '${req.body.date + ' ' + req.body.start_shift + ':00.000000-00'}' ,
        end_shift =  '${req.body.date + ' ' + req.body.end_shift + ':00.000000-00'}' ,
        location =  '${req.body.location}'
        where shift_id = ${req.body.shift_id}
    `)
    /*
    let days = await sequelize.query(`
    SELECT day::date 
    FROM   generate_series(timestamp '${req.body.week}', (date('${req.body.week}') + interval '6' day), '1 day') day`)

    let response = {"shifts" : shifts[0], "days" : days[0]}
    */
   
    console.log(response)
    res.json(response)
})


/*
This one is pretty straightforward, deleting a shift from the schedule table.
Sequelize uses the .destroy method for this.
*/
router.delete('/:id', async (req,res) => {
    const {id} = req.params
    let deletedRecord = await Schedule.destroy({
        where: {
           shift_id : id
        }
    })
    console.log(deletedRecord)
    res.status(200).json(deletedRecord)
})

module.exports = router