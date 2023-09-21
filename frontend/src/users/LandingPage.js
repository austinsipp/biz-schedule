import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react'

//pages and components
import Home from '../pages/home'
import Navbar from '../components/navbar';
import Schedule from '../pages/schedule';
import PTORequest from '../pages/ptoRequest';
import AddUser from '../pages/AddUser';
import Logout from './Logout';
import { CurrentUser } from '../contexts/CurrentUser';
import LoginForm from './LoginForm'

function LandingPage() {
    const { currentUser } = useContext(CurrentUser)
    console.log("current user is ", currentUser)
    
    /*
    This matches the navbar, not only do we want the navbar to only display the right links to the user,
    we want only certain routes to even be available to each user based on their role. Admins have access
    to the add user tab. We wouldnt want a non-admin to be able to get to that tab by simply typing it in 
    their address bar, so it wasnt enough to simply display only the right links in the navbar, we also
    needed to replicate that logic here, to make only certain routes available to regular users
    */
    const roleSwitch = () => {
        if (currentUser.roles.includes('Admin')) {
            return <Routes>
                <Route
                    path='/'
                    element={<Navigate to='/schedule' />}
                />
                <Route
                    path='/schedule'
                    element={<Schedule />}
                />{/*}
                <Route
                    path='/ptoRequest'
                    element={<PTORequest />}
                />*/}
                <Route
                    path='/adduser'
                    element={<AddUser />}
                />
                <Route
                    path='/logout'
                    element={<Logout />}
                />
            </Routes>
        } else {
            return <Routes>
                <Route
                    path='/'
                    element={<Navigate to='/schedule' />}
                />
                <Route
                    path='/schedule'
                    element={<Schedule />}
                />{/*}
                <Route
                    path='/ptoRequest'
                    element={<PTORequest />}
        />*/}
                <Route
                    path='/logout'
                    element={<Logout />}
                />
            </Routes>
        }
    }

    return (
        <div className="App">
            
            {currentUser ?
                <BrowserRouter>
                    <Navbar firstName={currentUser.first_name}/>
                    <div className="pages">

                        {roleSwitch()}

                    </div>
                </BrowserRouter>
                :
                <LoginForm />
            }
        </div>
    );
}

export default LandingPage;