import { Routes, Route } from 'react-router-dom';
import Host from '../Pages/Host';
import Home from '../Pages/Home';



export default function AppRoutes() {
    return (
        <Routes>
            <Route path='/' element={<Home />}></Route>
            <Route path='/host' element={<Host />}></Route>
        </Routes>
    );
}