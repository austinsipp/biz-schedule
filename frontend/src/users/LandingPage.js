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