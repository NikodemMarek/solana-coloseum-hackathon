import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Button, SvgIcon } from '@mui/material';
import { useWallet } from '@solana/wallet-adapter-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Create, Home, Inventory2, Search } from '@mui/icons-material';

export default function NavBar() {
    const wallet = useWallet()
    console.log("wallet:", wallet)

    const nav = useNavigate()
    const [showSidebar, setShowSidebar] = useState(false)

    return (
        <Box>
            <AppBar position="static">
                <Toolbar sx={{display: 'flex', justifyContent: "center" }}>
                    <IconButton
                        size="medium"
                        edge="start"
                        color="inherit"
                        onClick={() => {
                            if (window.innerWidth >= 640) {
                                nav("/")
                                return
                            }

                            setShowSidebar(true)
                        }}
                    // aria-label="menu"
                    >
                        <SvgIcon fontSize='large'>
                            <svg fill="#FFFCF9" viewBox="-4 0 19 19" xmlns="http://www.w3.org/2000/svg"><path d="M10.328 6.83a5.903 5.903 0 0 1-1.439 3.64 2.874 2.874 0 0 0-.584 1v1.037a.95.95 0 0 1-.95.95h-3.71a.95.95 0 0 1-.95-.95V11.47a2.876 2.876 0 0 0-.584-1A5.903 5.903 0 0 1 .67 6.83a4.83 4.83 0 0 1 9.28-1.878 4.796 4.796 0 0 1 .38 1.88zm-.95 0a3.878 3.878 0 0 0-7.756 0c0 2.363 2.023 3.409 2.023 4.64v1.037h3.71V11.47c0-1.231 2.023-2.277 2.023-4.64zM7.83 14.572a.475.475 0 0 1-.475.476h-3.71a.475.475 0 0 1 0-.95h3.71a.475.475 0 0 1 .475.474zm-.64 1.262a.238.238 0 0 1-.078.265 2.669 2.669 0 0 1-3.274 0 .237.237 0 0 1 .145-.425h2.983a.238.238 0 0 1 .225.16z" /></svg>
                        </SvgIcon>
                    </IconButton>
                    <Typography
                        variant="h6"
                        component="div"
                        marginRight="1rem"
                        className='hidden sm:block select-none'
                        onClick={() => nav("/")}
                    >
                        Ideas Marketplace
                    </Typography>
                    {window.innerWidth >= 640 &&
                        <>
                            <Button
                                variant='text'
                                color='inherit'
                                onClick={() => nav("/search")}
                            >
                                Search &amp; Buy
                            </Button>
                            <Button
                                variant='text'
                                disabled={!wallet.connected}
                                color='inherit'
                                onClick={() => nav("/newIdea")}
                            >
                                New idea
                            </Button>
                            <Button
                                variant='text'
                                disabled={!wallet.connected}
                                color='inherit'
                                onClick={() => nav("/yourIdeas")}
                            >
                                Your ideas
                            </Button>
                        </>
                    }
                    <Box className="ml-auto">
                        <WalletMultiButton />
                    </Box>
                </Toolbar>
            </AppBar>

            <div className={`fixed z-20 left-0 top-0 w-screen h-screen ease-in-out duration-150 ${
                showSidebar ? "bg-black/50" : "hidden"
            }`}
            onClick={() => setShowSidebar(false)}
            ></div>
            <div
                className={`fixed z-30 h-screen w-64 left-0 top-0 rounded-r bg-[#6C63FF] text-white ease-in-out duration-150 ${
                    showSidebar ? "translate-x-0 " : "translate-x-[-16rem]"
                }`}
            >
                <button type="button" className="bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 end-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => {
                    setShowSidebar(false)
                }}>
                    <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    <span className="sr-only">Close menu</span>
                </button>
                <div className="py-4 overflow-y-auto">
                    <h2
                        className='text-center my-8 text-3xl font-bold'
                    >Ideas Marketplace</h2>
                    <ul className="space-y-4 font-medium px-4">
                        <li className='text-xl'>
                            <Link to='/' onClick={() => setShowSidebar(false)} className='flex items-center'>
                            <Home sx={{marginRight: '0.5rem'}} />
                            Home
                            </Link>
                        </li>
                        <li className='text-xl'>
                            <Link to='/search' onClick={() => setShowSidebar(false)} className='flex items-center'>
                            <Search sx={{marginRight: '0.5rem'}} />
                            Search &amp; Buy
                            </Link>
                        </li>
                        {wallet.connected && 
                        <>
                            <li className='text-xl'>
                                <Link to='/newIdea' onClick={() => setShowSidebar(false)} className='flex items-center'>
                                <Create sx={{marginRight: '0.5rem'}} />
                                New idea
                                </Link>
                            </li>
                            <li className='text-xl'>
                                <Link to='/yourIdeas' onClick={() => setShowSidebar(false)} className='flex items-center'>
                                <Inventory2 sx={{marginRight: '0.5rem'}} />
                                Your ideas
                                </Link>
                            </li>
                        </>
                        }
                    </ul>
                </div>
            </div>
        </Box>
    );
}
