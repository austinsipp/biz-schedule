import {BrowserRouter, Routes, Route} from 'react-router-dom';

//pages and components
import Home from './pages/home'
import Navbar from './components/navbar';
import Schedule from './pages/schedule';
import PTORequest from './pages/ptoRequest';


function App() {
    return (
      <div className="App">
        <BrowserRouter>
          <Navbar/>
          <div className="pages">
            <Routes>
              <Route
                path='/'
                element={<Home/>}
              />
              <Route
                path='/schedule'
                element={<Schedule/>}
              />
              <Route
                path='/ptoRequest'
                element={<PTORequest/>}
              />
            </Routes>
          </div>
        </BrowserRouter>
      </div>
    );
  }
  
  export default App;