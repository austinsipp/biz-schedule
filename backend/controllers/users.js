const router = require('express').Router()
const db = require("../models")
const bcrypt = require('bcrypt')
const { sequelize } = require('../models')


const { User } = db

router.get('/retrieveUsers', async (req,res) => {
    console.log("attempting to retrieve users")
    await User.findAll()
    try {
        //let user = await User.findAll({attributes: [first_name, last_name],})
        let user = await User.findAll()
        let usersSend = user.map((element) => element.first_name + ' ' + element.last_name)
        console.log("retrieve users response:",user)
        console.log("users names:",usersSend)
        res.json(usersSend)
    } catch {
        res.json(null)
    }
})





router.post('/add', async (req,res) => {
    console.log("new user request is:",req.body)
    try {
        let pw_dig = await bcrypt.hash(req.body.password,10)
        let user = await User.create({first_name:req.body.first_name, last_name: req.body.last_name, roles: req.body.roles, username: req.body.username, password_digest: pw_dig})
        console.log(user)
        res.json(user)
    } catch {
        res.json(null)
    }
})



module.exports = router
