// app/components/Navbar.jsx
'use client';

import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Button, Avatar, IconButton } from '@mui/material';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation'; // useRouter for navigation in App Router
import Link from 'next/link';

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleAvatarClick = () => {
    router.push('/user');
  };

  return (
    <AppBar position="static"  sx={{backgroundColor:'transparent', boxShadow:'none'}}>
      <Toolbar>
        {/* Application Title */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            alertBOT
          </Link>
        </Typography>

        {/* Conditional Rendering Based on Authentication Status */}
        {status === 'authenticated' ? (
          <>
            {/* Display Avatar */}
            <IconButton onClick={handleAvatarClick} sx={{ p: 0, mr: 2 }}>
              <Avatar alt={session.user.name} src={session.user.image} />
            </IconButton>
            {/* Optional: Sign Out Button */}
            <Button color="inherit" onClick={() => signOut()}>
              Sign Out
            </Button>
          </>
        ) : (
          <>
            {/* Sign In/Register Buttons */}
            <Button color="inherit"  variant="outlined" sx={{mr:'6px !important'}} onClick={() => signIn('google')}>
              Sign In with Google
            </Button>
            <Button color="inherit" variant="outlined" onClick={() => signIn('discord')}>
              Sign In with Discord
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
