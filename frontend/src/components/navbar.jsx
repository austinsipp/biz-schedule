import { Link } from "react-router-dom";
import { useContext } from 'react'
import { CurrentUser } from '../contexts/CurrentUser';

const Navbar = () => {
    const { currentUser } = useContext(CurrentUser) /*need to grab the current user from the context provider*/
    console.log(currentUser)
    if (currentUser) {
        console.log(currentUser.roles)
        console.log(currentUser.roles.includes('Admin'))
    }

    /*
    This function changes what displays for a given user based on their role. I don't want 
    a non-admin to be able to navigate to the Add User page, and I want their
    schedule page to just say "View" rather than "View/Edit"
    */
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