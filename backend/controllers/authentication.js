const router = require('express').Router()
const db = require("../models")
const bcrypt = require('bcrypt')


const { User } = db

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
        //req.session.roles = user.roles
        console.log(user.user_id)
        res.json({ user })
    }

})

router.get('/profile', async (req, res) => {
    //console.log("session user id from /profile path get request",req.session.userId)
    console.log("made it here")
    try {

        let user = await User.findOne({
            where: {
                user_id: req.session.user_id
            }
        })

        res.json(user)
    } catch {
        res.json(null)
    }
    //res.json(req.currentUser)
})


router.post('/logout', async (req, res) => {
    console.log(req.session)
    console.log("logging out")
    //req.logOut()
    res.session.expires = '2022-09-09T00:14:27.349Z'
    res.status(200).clearCookie('connect.sid', {
        path: '/'
    })
    /*req.session.destroy(function (err) {
        res.redirect('/')
    })*/
    //req.clearCookie('connect.sid');
    
    //res.session = null
    //res.redirect('/')
    //res.status(200)*/
})


module.exports = router
