const router = require('express').Router()
const { sequelize } = require('../models')



router.post('/', async (req, res) => {
    let shifts = await sequelize.query(`select * from public."Schedule" where start_shift between '${req.body.week}' and (date('${req.body.week}') + interval '7' day)`)
    console.log(shifts[0])
    res.json(shifts[0])
})

module.exports = router