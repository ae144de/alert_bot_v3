
"use client";
// import 'preline';
import React, {useState, useEffect} from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Paper,
  List,
  ListItem,
  ListItemText,
  createTheme,
  ThemeProvider,
  CssBaseline
} from '@mui/material';
import axios from "axios";
import AlertTable from "./AlertTable";
import {SessionProvider, useSession} from "next-auth/react";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff5252',
    },
  },
  
});

export default function AlertForm() {
  const [symbol, setSymbol] = useState('');
  const [operator, setOperator] = useState('>');
  const [value, setValue] = useState('');
  const [symbols, setSymbols] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');

  const {data: session, status} = useSession();

  useEffect(() => {
    const fetchSymbols = async () => {
      try {
        const response = await axios.get('https://testnet.binancefuture.com/fapi/v1/exchangeInfo');
        const filteredSymbols = response.data.symbols
          .filter((symbol) => symbol.symbol.endsWith('USDT')) // Only symbols ending with "USDT"
          .map((symbol) => symbol.symbol); // Extract symbol names
        setSymbols(filteredSymbols);
        setSelectedSymbol(filteredSymbols[0]); // Default to the first symbol
      } catch (error) {
        console.error('Error fetching symbols: ', error);
      }
    }


    fetchSymbols();
  }, []);

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {selectedSymbol, operator, value: parseFloat(value)};
    // const response = await fetch(`${API_BASE_URL}/api/alerts`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${session?.myCustomToken}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(payload),
    // });
    const response = await axios.post('http://ec2-13-61-169-193.eu-north-1.compute.amazonaws.com:5000/api/users/alerts',
      {payload},
      {
        headers: {
          Authorization: `Bearer ${session?.myCustomToken}`,
          "Content-Type": 'application/json'
        }
      }
    )

    if (response.ok) {
      setSelectedSymbol('BTCUSDT');
      setSymbol('');
      setValue('');
      setOperator('>');
    }
  };

  return (
    // <SessionProvider session={session}>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <Box
            sx={{
              display:'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: "100vh",
              width:'100%'

            }}
          >
            <AlertTable />
          </Box>
        </ThemeProvider>
      
    // </SessionProvider>
  )
}
