import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Wallet from "./Wallet.tsx";
import Home from "./Home.tsx";
import NavBar from './components/NavBar.tsx';
import NewIdeaPage from './pages/createNew.tsx';
import SearchForPage from './pages/searchFor.tsx';

function App() {
    return (
        <Wallet>
            <Router>
                <div className='flex flex-col w-screen h-screen'>
                    <NavBar />
                    <main className='grow w-full h-full'>
                        <Routes>
                            <Route path="/" Component={Home} />
                            <Route path="/newIdea" Component={NewIdeaPage} />
                            <Route path="/search" Component={SearchForPage} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </Wallet>
    );
}

export default App;
