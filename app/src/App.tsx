import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Wallet from "./Wallet.tsx";
import NavBar from './components/NavBar.tsx';
import NewIdeaPage from './pages/createNew.tsx';
import SearchForPage from './pages/searchFor.tsx';
import YourIdeas from './pages/yourIdeas.tsx';
import Home from './pages/Home.tsx';

function App() {
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
