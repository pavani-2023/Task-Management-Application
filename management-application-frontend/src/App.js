import './App.css';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import SignUp from './Pages/Registration/SignUp';
import Login from './Pages/Registration/Login';
import TaskList from './Pages/Home/TaskList';


function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar/>
        <Routes>
          <Route path='/login-page' element={<Login/>}/>
          <Route path='/signup-page'element={<SignUp/>}/>
          <Route path='/home' element={<TaskList/>}/>
        </Routes>
      </div>
    </BrowserRouter>
   
  );
}

export default App;
