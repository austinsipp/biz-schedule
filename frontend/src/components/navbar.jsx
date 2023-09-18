import { Link } from "react-router-dom";
import { useContext } from 'react'
import { CurrentUser } from '../contexts/CurrentUser';

const Navbar = () => {
    const { currentUser } = useContext(CurrentUser)
    console.log(currentUser)
    if (currentUser) {
        console.log(currentUser.roles)
        console.log(currentUser.roles.includes('Admin'))
    }

    const roleSwitch = () => {
        if (currentUser.roles.includes('Admin')) {
            return <div className="navbar">
            {/*<Link to='/'>
                <h1>Home</h1>
        </Link>*/}
            <Link to='/schedule'>
                <h1>View/Edit Schedule</h1>
            </Link>{/*
            <Link to='/ptoRequest'>
                <h1>PTO Request</h1>
            </Link>*/}
            <Link to='/adduser'>
                <h1>Add User</h1>
            </Link>
            <Link to='/logout'>
                <h1>Logout from {currentUser.username}</h1>
            </Link>
        </div>
        } else {
            return <div className="navbar">
            {/*<Link to='/'>
                <h1>Home</h1>
        </Link>*/}
            <Link to='/schedule'>
                <h1>View Schedule</h1>
            </Link>{/*
            <Link to='/ptoRequest'>
                <h1>PTO Request</h1>
            </Link>*/}
            <Link to='/logout'>
                <h1>Logout from {currentUser.username}</h1>
            </Link>
        </div>
        }
    }



    return (
        <header>
            { roleSwitch() }
        </header>
    )
}

export default Navbar