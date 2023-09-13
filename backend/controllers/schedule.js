const router = require('express').Router()
const { sequelize } = require('../models')
const db = require("../models")

const { Schedule, User } = db



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

router.post('/add', async (req, res) => {
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