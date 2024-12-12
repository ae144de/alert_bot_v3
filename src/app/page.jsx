
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
    const response = await fetch('http://localhost:5000/api/alerts', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      setSelectedSymbol('BTCUSDT');
      setSymbol('');
      setValue('');
      setOperator('>');
    }
  };

  return (
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

  )
}
