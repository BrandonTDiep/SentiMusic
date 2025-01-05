import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import NavBar from './components/Navbar';

function App() {
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
