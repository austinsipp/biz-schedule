const router = require('express').Router()
const { sequelize } = require('../models')
const db = require("../models")

const { Schedule } = db



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