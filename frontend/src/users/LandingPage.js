import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useContext } from 'react'

//pages and components
import Home from '../pages/home'
import Navbar from '../components/navbar';
import Schedule from '../pages/schedule';
import PTORequest from '../pages/ptoRequest';
import { CurrentUser } from '../contexts/CurrentUser';
import LoginForm from './LoginForm'

function LandingPage() {
    const { currentUser } = useContext(CurrentUser)

    return (
        <div className="App">
            {currentUser ?
                <BrowserRouter>
                    <Navbar />
                    <div className="pages">
                        <Routes>
                            <Route
                                path='/'
                                element={<Home />}
                            />
                            <Route
                                path='/schedule'
                                element={<Schedule />}
                            />
                            <Route
                                path='/ptoRequest'
                                element={<PTORequest />}
                            />
                        </Routes>
                    </div>
                </BrowserRouter>
                :
                <LoginForm />
            }
        </div>
    );
}

export default LandingPage;