import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useContext } from 'react'

//pages and components
import Home from '../pages/home'
import Navbar from '../components/navbar';
import Schedule from '../pages/schedule';
import PTORequest from '../pages/ptoRequest';
import Admin from '../pages/admin';
import Logout from './Logout';
import { CurrentUser } from '../contexts/CurrentUser';
import LoginForm from './LoginForm'

function LandingPage() {
    const { currentUser } = useContext(CurrentUser)
    console.log("current user is ", currentUser)
    

    const roleSwitch = () => {
        if (currentUser.roles.includes('Admin')) {
            return <Routes>
                {/*<Route
                    path='/'
                    element={<Home />}
                />*/}
                <Route
                    path='/schedule'
                    element={<Schedule />}
                />{/*}
                <Route
                    path='/ptoRequest'
                    element={<PTORequest />}
                />
                <Route
                    path='/admin'
                    element={<Admin />}
        />*/}
                <Route
                    path='/logout'
                    element={<Logout />}
                />
            </Routes>
        } else {
            return <Routes>
                {/*<Route
                    path='/'
                    element={<Home />}
                />*/}
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