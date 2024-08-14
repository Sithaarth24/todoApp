import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import { useCallback, useEffect, useState } from 'react';
import TodoMain from './components/todoMain';
import { AuthContext } from './authContext';
import Home from './components/home';

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        const localState = JSON.parse(localStorage.getItem("CONTEXT"))
        if(localState)
            return localState[0]
        return false
    });
    const [username, setUsername] = useState(() => {
        const localState = JSON.parse(localStorage.getItem("CONTEXT"))
        if(localState)
            return localState[1]
        return ""
    });

    useEffect(()=>{
        localStorage.setItem("CONTEXT",JSON.stringify([isLoggedIn,username]))
    },[isLoggedIn,username])

    const login = useCallback((name) => {
        setUsername(name)
        setIsLoggedIn(true);
    }, []);

    const logout = useCallback(() => {
        setUsername("")
        setIsLoggedIn(false);
    }, []);



    // const allRoutes = () =>{
    //     if(isLoggedIn){
    //         return(
    //             <Routes>
    //                 <Route path='/todo' element={<TodoMain/>}/>
    //             </Routes>
    //         )
    //     }
    //     else{
    //         return(
    //             <Routes>
    //                 <Route path='/todo' element={<TodoMain/>}/>
    //                 <Route path='/login' element={<Login />} />
    //                 <Route path='/home' element={<Home />} />
    //                 <Route path='/' element={<Home />} />
    //             </Routes>
    //         )
    //     }
    // }

    return (
        <AuthContext.Provider value={{ isLoggedIn:isLoggedIn,username:username, login:login, logout:logout }}>
            <BrowserRouter>
                <Routes>
                    <Route path='/todo' element={<TodoMain/>}/>
                    <Route path='/login' element={<Login />} />
                    <Route path='/home' element={<Home />} />
                    <Route path='/' element={<Home />} />
                </Routes>
            </BrowserRouter>
        </AuthContext.Provider>
    );
}
