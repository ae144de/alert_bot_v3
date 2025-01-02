'use client';
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from 'axios';
import { Button, TextField, Typography, Avatar, CircularProgress, Box, createTheme, Card, CardContent, GlobalStyles, CssBaseline, Stepper, Step, StepLabel } from '@mui/material';
import { ThemeProvider } from "@emotion/react";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const steps = [
  'Sign in to your account',
  'Enter your phone number, bot token, and chat ID',
  'Click the Update button to save your information',
  'Follow the instructions sent to your chat',
];


export default function UserPage(){
    const {data: session, status} = useSession();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [botToken, setBotToken] = useState('');
    const [chatId, setChatId] = useState('');
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
                // Authorization: `Bearer ${session?.accessToken}`,
                Authorization: `Bearer ${session?.myCustomToken}`,
                "Content-Type": 'application/json'
              }
            }).then(response => {
              setPhoneNumber(response.data.phoneNumber || '');
              setBotToken(response.data.botToken || '');
              setChatId(response.data.chatId || '');
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
        console.log("ACCESS TOKEN: ",session?.myCustomToken);

        const response = await axios.post('http://ec2-13-61-169-193.eu-north-1.compute.amazonaws.com:5000/api/users/connectUserBot', 
          {phoneNumber, botToken, chatId},
          { 
            headers: { 
              Authorization: `Bearer ${session?.myCustomToken}`,
              "Content-Type": 'application/json'
            } 
          }
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

    const validatePhoneNumber = (number) => {
      const phoneRegex = /^\+90[1-9]\d{9}$/;
      return phoneRegex.test(number);
    };

    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <GlobalStyles styles={{ body: { backgroundColor: darkTheme.palette.background.default, color: darkTheme.palette.text.primary } }} />
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
          bgcolor="background.default"
          color="text.primary"
          p={2}
          m={0}
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            // width="50%"
            p={2}
            height="100%"
            flexGrow={1}
          >
            {loading ? (
              <CircularProgress />
            ) : (
              <>
                <Card sx={{ mb: 4, width: '100%', maxWidth: 600 }}>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      User Info
                    </Typography>
                    <Typography variant="body1">
                      Signed in as: {session.user.email}
                    </Typography>
                    <Typography variant="body1">
                      Name: {session.user.name}
                    </Typography>
                    {session.user.image && (
                      <Avatar
                        src={session.user.image}
                        alt="User Image"
                        sx={{ width: 50, height: 50, mt: 2 }}
                      />
                    )}
                  </CardContent>
                </Card>

                <Card sx={{ width: '100%', maxWidth: 600 }}>
                  <CardContent>
                    <Typography variant="h5" component="div" gutterBottom>
                      User Form
                    </Typography>
                    <form onSubmit={handlePhoneNumberSubmit}>
                      <TextField
                        label="Phone Number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        fullWidth
                        margin="normal"
                        error={!validatePhoneNumber(phoneNumber)}
                        helperText={!validatePhoneNumber(phoneNumber) ? 'Invalid phone number. Must start with +90 and not begin with 0.' : ''}
                      />
                      <TextField
                        label="Bot Token"
                        value={botToken}
                        onChange={(e) => setBotToken(e.target.value)}
                        fullWidth
                        margin="normal"
                      />
                      <TextField
                        label="Chat ID"
                        value={chatId}
                        onChange={(e) => setChatId(e.target.value)}
                        fullWidth
                        margin="normal"
                      />
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={updating || !validatePhoneNumber(phoneNumber)}
                        sx={{ mt: 2 }}
                      >
                        {updating ? <CircularProgress size={24} /> : 'Update'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </>
            )}
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            // width="50%"
            p={2}
            height="100%"
            flexGrow={1}
          >
            <Card sx={{ width: '100%', maxWidth: 600 }}>
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  Instructions
                </Typography>
                <Stepper activeStep={-1} orientation="vertical">
                  {steps.map((label, index) => (
                    <Step key={index}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </ThemeProvider>
        
     
        
        // <div>
        //   <h1>User Info</h1>
        //   <p>Signed in as: {session.user.email}</p>
        //   <p>Name: {session.user.name}</p>
        //   <p>JWT ACCESS TOKEN: {session.accessToken}</p>
        //   {session.user.image && <img src={session.user.image} alt="User Image" style={{ width: 50, height: 50 }} />}
        //   {/*  */}
        //   <button onClick={() => signOut()}>Sign Out</button>
        // </div>

        
        // <Box component="form" onSubmit={handlePhoneNumberSubmit} sx={{ mb: 4 }}>
        //   <Typography variant="h6" gutterBottom>
        //     Update Phone Number
        //   </Typography>
        //   <TextField
        //     label="Phone Number"
        //     type="tel"
        //     fullWidth
        //     required
        //     value={phoneNumber}
        //     onChange={(e) => setPhoneNumber(e.target.value)}
        //     sx={{ mb: 2 }}
        //   />
        //   <TextField
        //     label="Bot Token"
        //     type="text"
        //     fullWidth
        //     required
        //     value={botToken}
        //     onChange={(e) => setBotToken(e.target.value)}
        //     sx={{ mb: 2 }}
        //   />
        //   <TextField
        //     label="Chat ID"
        //     type="text"
        //     fullWidth
        //     required
        //     value={chatId}
        //     onChange={(e) => setChatId(e.target.value)}
        //     sx={{ mb: 2 }}
        //   />
        //   <Button type="submit" variant="contained" disabled={updating}>
        //     {updating ? 'Updating...' : 'Save Phone Number'}
        //   </Button>
        // </Box>
    )
      
}