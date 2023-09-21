const router = require('express').Router()
const db = require("../models")
const bcrypt = require('bcrypt')
const { sequelize } = require('../models')


const { User } = db

/*
This route gets used to pull all the employees available to be
assigned a shift, i.e. any employee in the users table. The frontend
needs this in order to make the dropdown field options for when
the admin is trying to add or edit shifts. We want to only allow
real employees to be able to be submitted from the frontend, so
we need the backend to tell the frontend what all the names of 
those employees are. Then put it in a drop down so the admin
does not need to type the employee name into an input box
perfectly.
*/
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




/*
This is where an admin can add a new user, by posting to this route with 
all the necessary fields in the request body.
*/
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
