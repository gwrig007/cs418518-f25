import './App.css';
import Dashboard from './Dashboard';
import Login from './Login';

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
function App() {
  // const [count, setCount] = useState(0)


  function Handler(){}

  return (
    <>
     <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
     {/* <Image></Image>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

      <UserInfo name='Nasreen Arif' designation='Lecturer'><p>I will teach CS418 course</p></UserInfo>
      <UserInfo name='Siam' designation='Test'><p>Siam is taking CS418 course in Fall 2025</p></UserInfo>
      <UserInfo name='Grace' designation='Test2'></UserInfo> */}
    </>
  )
}

export default App


