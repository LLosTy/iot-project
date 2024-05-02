import { Inter } from "next/font/google";
import {AppBar, Box, Button, IconButton, Toolbar, Typography} from "@mui/material";
import Link from "next/link";
import MemoryIcon from '@mui/icons-material/Memory';
import AuthContext from './authContext'

const inter = Inter({ subsets: ["latin"] });
import '../styles/globals.css';
import {blue} from "@mui/material/colors";
import {black, white} from "next/dist/lib/picocolors"; // Import your global CSS file


export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ session, children }) {
  return (
      <html lang="en">
      <body className={inter.className}>
      {/* Layout UI */}
      <AuthContext>
      <Box sx={{ flexGrow: 1 ,m:0}}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
            >
            </IconButton>
              <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                  <a href={'/'}>
                      IoT-App
                      <MemoryIcon/>
                  </a>

              </Typography>


              <Link href={'/temps'}>
                  <Button variant="Outlined">Temps</Button>
                  {/*Temps*/}
              </Link>

              <Link href={'/device'}>
                  <Button variant="Outlined">Devices</Button>
                  {/*Temps*/}
              </Link>

              <Link href={'/api/auth/signout'}>
                  <Button variant="Outlined">Signout</Button>
                  {/*Signout*/}
              </Link>
          </Toolbar>
        </AppBar>
      </Box>
      <main>{children}</main>
      </AuthContext>
      </body>
      </html>
  )
}
