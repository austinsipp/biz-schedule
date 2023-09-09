const router = require('express').Router()
const db = require("../models")
const bcrypt = require('bcrypt')
const { sequelize } = require('../models')


const { User, Session } = db

router.post('/', async (req, res) => {
    let user = await User.findOne({
        where: { username: req.body.username }
    })
    //console.log(user)
    if (!user || !await bcrypt.compare(req.body.password, user.password_digest)) {
        res.status(404).json({
            message: 'Could not find a user with the provided username and password'
        })
    } else {
        req.session.user_id = user.user_id
        let secureSession = await bcrypt.hash(String(new Date() + req.session.user_id), 10)
        req.session.session_id = secureSession
        /*const secureSession = await Session.create({
            session_id: await bcrypt.hash(),
            user_id: req.session.user_id,
            expire_date: ,
            active_session: 'Y'
        })*/
        await sequelize.query(`insert into public."Sessions" (session_id, user_id, expire_date, active_session) values ('${secureSession}', ${req.session.user_id}, now() + interval '1' hour, 'Y')`)
        //req.session.roles = user.roles
        console.log(user.user_id)
        res.json({ user })
    }

})

router.get('/profile', async (req, res) => {
    //console.log("session user id from /profile path get request",req.session.userId)
    console.log("made it here")
    try {
        let user = await sequelize.query(`select T1.* from public."Users" T1 inner join public."Sessions" T2 on T1.user_id = T2.user_id and T2.session_id = '${req.session.session_id}' and T2.user_id = '${req.session.user_id}' and T2.expire_date >= now() and T2.active_session = 'Y'`)
        console.log(user)
        /*let user = await Session.findOne({
            where: {
                user_id: req.session.user_id,
                session_id: req.session.session_id,

            }
        })*/
        if (user[0].length) {
            res.json(user[0][0])
        } else {
            res.json(null)
        }
    } catch {
        res.json(null)
    }
    //res.json(req.currentUser)
})


router.post('/logout', async (req, res) => {
    console.log(req.session)
    console.log("logging out")
    await sequelize.query(`update public."Sessions" set active_session = 'N' where user_id = '${req.session.user_id}' and session_id = '${req.session.session_id}'`)
    //req.logOut()
    //res.session.expires = '2022-09-09T00:14:27.349Z'
    //req.session.cookie.expires = new Date(0)
    //req.session.cookie.maxAge = 0
    /*res.status(200).clearCookie('connect.sid', {
        path: '/'
    })*/
    /*req.session.destroy(function (err) {
        res.redirect('/')
    })*/
    //req.clearCookie('connect.sid');

    //res.session = null
    //res.redirect('/')
    res.status(200).json(null)
    //res.send('You have been successfully logged out!')
})


module.exports = router
