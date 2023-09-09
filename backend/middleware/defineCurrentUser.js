const db = require("../models")

const {User} = db

async function defineCurrentUser (req, res, next) {
    try {
        let user = await sequelize.query(`select T1.* from public."Users" T1 inner join public."Sessions" T2 on T1.user_id = T2.user_id and T2.session_id = '${req.session.session_id}' and T2.user_id = '${req.session.user_id}' and T2.expire_date >= now() and T2.active_session = 'Y'`)
        /*let user = await User.findOne({
            where: {
                user_id: req.session.user_id
            }
        })*/
        req.currentUser = user[0][0]
        next()
    } catch {
        next()
    }
}

module.exports = defineCurrentUser