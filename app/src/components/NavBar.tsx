import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Button, SvgIcon } from '@mui/material';
import { useWallet } from '@solana/wallet-adapter-react';
import { useNavigate } from 'react-router';

export default function NavBar() {
  const wallet = useWallet()
  console.log("wallet:", wallet)

  const nav = useNavigate()

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="medium"
            edge="start"
            color="inherit"
            onClick={() => nav("/")}
            // aria-label="menu"
          >
            <SvgIcon fontSize='large'>
                <svg fill="#FFFCF9" viewBox="-4 0 19 19" xmlns="http://www.w3.org/2000/svg"><path d="M10.328 6.83a5.903 5.903 0 0 1-1.439 3.64 2.874 2.874 0 0 0-.584 1v1.037a.95.95 0 0 1-.95.95h-3.71a.95.95 0 0 1-.95-.95V11.47a2.876 2.876 0 0 0-.584-1A5.903 5.903 0 0 1 .67 6.83a4.83 4.83 0 0 1 9.28-1.878 4.796 4.796 0 0 1 .38 1.88zm-.95 0a3.878 3.878 0 0 0-7.756 0c0 2.363 2.023 3.409 2.023 4.64v1.037h3.71V11.47c0-1.231 2.023-2.277 2.023-4.64zM7.83 14.572a.475.475 0 0 1-.475.476h-3.71a.475.475 0 0 1 0-.95h3.71a.475.475 0 0 1 .475.474zm-.64 1.262a.238.238 0 0 1-.078.265 2.669 2.669 0 0 1-3.274 0 .237.237 0 0 1 .145-.425h2.983a.238.238 0 0 1 .225.16z"/></svg>
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
          </>
          }
          <Box className="ml-auto">
            <WalletMultiButton />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
