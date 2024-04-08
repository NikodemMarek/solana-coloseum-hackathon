import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Wallet from "./Wallet.tsx";
import NavBar from './components/NavBar.tsx';
import NewIdeaPage from './pages/createNew.tsx';
import SearchForPage from './pages/searchFor.tsx';
import YourIdeas from './pages/yourIdeas.tsx';
import Home from './pages/Home.tsx';
import { initializeApp } from "firebase/app";

function App() {
    const firebaseConfig = {
        apiKey: "AIzaSyDtJtYPkOliLdpEup8tURn3dzKe8MKieAI",
        authDomain: "ideas-marketplace-a3c8c.firebaseapp.com",
        projectId: "ideas-marketplace-a3c8c",
        storageBucket: "ideas-marketplace-a3c8c.appspot.com",
        messagingSenderId: "243725080881",
        appId: "1:243725080881:web:45c1778c3981c0f1257810",
        measurementId: "G-R1PVHGBVWX"
    };

    initializeApp(firebaseConfig);

    return (
        <Wallet>
            <Router>
                <div className='flex flex-col w-screen h-screen'>
                    <NavBar />
                    <main className='grow w-full h-full relative'>
                        <Routes>
                            <Route path="/" Component={Home} />
                            <Route path="/newIdea" Component={NewIdeaPage} />
                            <Route path="/search" Component={SearchForPage} />
                            <Route path="/yourIdeas" Component={YourIdeas} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </Wallet>
    );
}

export default App;
