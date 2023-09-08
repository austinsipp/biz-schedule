import { BrowserRouter, Routes, Route } from 'react-router-dom';

//pages and components
import CurrentUserProvider from './contexts/CurrentUser'
import LandingPage from './users/LandingPage'

function App() {
    return (
        <div className="App">
            <CurrentUserProvider>
                <LandingPage />
            </CurrentUserProvider>
        </div>
    );
}

export default App;