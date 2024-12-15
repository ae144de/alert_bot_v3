"use client";

import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, MenuItem, Select, InputLabel } from '@mui/material';
import axios from 'axios';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL


export default function AlertForm({ alertType, onClose, onSubmit, onBack }) {
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [operator, setOperator] = useState('>');
  const [value, setValue] = useState('');
  const [symbols, setSymbols] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const API_BASE_URL = "http://ec2-13-61-169-193.eu-north-1.compute.amazonaws.com:5000/";


  function getFormattedCurrentDate() {
    const current_date = new Date();

    const day = String(current_date.getDate()).padStart(2, '0');
    const month = String(current_date.getMonth() + 1).padStart(2, '0');
    const year = current_date.getFullYear();

    const formattedDate = `${day}-${month}-${year}`;

    return formattedDate;

  }

  useEffect(() => {
    const fetchSymbols = async () => {
      try {
        const response = await axios.get('https://testnet.binancefuture.com/fapi/v1/exchangeInfo');
        const filteredSymbols = response.data.symbols
          .filter((symbol) => symbol.symbol.endsWith('USDT')) // Only symbols ending with "USDT"
          .map((symbol) => symbol.symbol); // Extract symbol names
        setSymbols(filteredSymbols);
        setSymbol(filteredSymbols[0]); // Default to the first symbol
      } catch (error) {
        console.error('Error fetching symbols: ', error);
      }
    }

    fetchSymbols();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try{
      const response = await fetch(`${API_BASE_URL}/api/alerts`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({selectedSymbol:symbol, operator:operator, value: parseFloat(value), type: alertType, created_at: getFormattedCurrentDate(), status: 'Active'})
      });
  
      if (response.ok){
        onSubmit();
        onClose();
      } else {
        const data = await response.json();
        setErrorMessage(data.error || 'Failed to create alert.');
      }
    } catch(error) {
      console.error('Error creating alert: ',err);
      setErrorMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }

    
    // You can include `alertType` in your payload if needed
    // Example:
    // const response = await fetch('/api/alerts', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ symbol, operator, value: parseFloat(value), type: alertType }),
    // });
    // if (response.ok) { 
    //   onSubmit();
    //   onClose();
    // }

    onSubmit();
    onClose();
  };


  return (
    <Box 
      component="form"
      onSubmit={handleSubmit}
      sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, width: '100%', height:'100%' }}
    >
      <Typography variant="h6">Create New Alert</Typography>
      {/* <TextField
        label="Symbol"
        variant="outlined"
        fullWidth
        required
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
      /> */}
      <Select 
        labelId='symbol-label'
        label='Symbol'
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
      >
        {symbols.map((sym) => (
            <MenuItem key={sym} value={sym}>{sym}</MenuItem>
        ))}
      </Select>
      <TextField
        label="Operator"
        variant="outlined"
        fullWidth
        required
        value={operator}
        onChange={(e) => setOperator(e.target.value)}
        helperText="Allowed: >, <, >=, <=, =="
      />
      <TextField
        label="Value"
        type="number"
        variant="outlined"
        fullWidth
        required
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button type="button" variant="text" onClick={onBack}>Back</Button>
        <Button type="button" onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained">Create</Button>
      </Box>
    </Box>
  );
}
