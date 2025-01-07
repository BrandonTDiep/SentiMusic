import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Callback from './pages/Callback';
import NavBar from './components/Navbar';

function App() {
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/callback" element={<Callback />} />

      </Routes>
    </div>
  );
}

export default App;
