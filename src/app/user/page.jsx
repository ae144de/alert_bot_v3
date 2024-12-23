'use client';
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from 'axios';
import { Button, TextField, Typography, Avatar, CircularProgress, Box } from '@mui/material';

export default function UserPage(){
    const {data: session, status} = useSession();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [alertSymbol, setAlertSymbol] = useState('');
    const [alertOperator, setAlertOperator] = useState('>');
    const [alertValue, setAlertValue] = useState('');
    const [alertLoading, setAlertLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        if (status === 'authenticated' && session?.user?.email) {
            console.log("USER AUTHENTICATED!!!");
            console.log("SessionToken: ", session.accessToken);
            axios.get('http://ec2-13-61-169-193.eu-north-1.compute.amazonaws.com:5000/api/users/getUserData', {
              headers: {
                Authorization: `Bearer ${session?.accessToken}`,
                "Content-Type": 'application/json'
              }
            }).then(response => {
              setPhoneNumber(response.data.phoneNumber || '');
              setLoading(false);
            }).catch(error => {
              console.error(error);
              setLoading(false);
            });
        } else if (status !== "loading") {
            setLoading(false)
        }
    }, [status, session]);

    const handlePhoneNumberSubmit = async (e) => {
      e.preventDefault();
      setUpdating(true);
      try {
        console.log("ACCESS TOKEN: ",session.accessToken);

        const response = await axios.post('http://ec2-13-61-169-193.eu-north-1.compute.amazonaws.com:5000/api/users/updatePhoneNumber', 
          { phoneNumber },
          { headers: { Authorization: `Bearer ${session.accessToken}` } }
        );
        alert(response.data.message);
      } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || 'An error occurred while updating phone number.');
      } finally {
        setUpdating(false);
      }
    };

    if (loading) return <p>Loading...</p>

    if (status === 'unauthenticated') {
        return (
            <div>
              <p>You must sign in</p>
              <button onClick={() => signIn()}>Sign In</button>
            </div>
          )
    }

    return (
      <>
        <div>
          <h1>User Info</h1>
          <p>Signed in as: {session.user.email}</p>
          <p>Name: {session.user.name}</p>
          <p>JWT ACCESS TOKEN: {session.accessToken}</p>
          {session.user.image && <img src={session.user.image} alt="User Image" style={{ width: 50, height: 50 }} />}
          {/*  */}
          <button onClick={() => signOut()}>Sign Out</button>
        </div>

        
        <Box component="form" onSubmit={handlePhoneNumberSubmit} sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Update Phone Number
          </Typography>
          <TextField
            label="Phone Number"
            type="tel"
            fullWidth
            required
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" disabled={updating}>
            {updating ? 'Updating...' : 'Save Phone Number'}
          </Button>
        </Box>
      </>
        
    )
      
}