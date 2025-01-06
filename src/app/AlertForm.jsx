"use client";

import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, MenuItem, Select, InputLabel, FormControl, Autocomplete, Divider, ToggleButton, ToggleButtonGroup, Grid  } from '@mui/material';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import {NumericFormat} from 'react-number-format';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';



export default function AlertForm({ alertType, onClose, onSubmit, onBack }) {
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [operator, setOperator] = useState('>');
  const [value, setValue] = useState('');
  const [symbols, setSymbols] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const {data: session, status} = useSession();
  const [upperBound, setUpperBound] = useState('');
  const [lowerBound, setLowerBound] = useState('');
  const [trigger, setTrigger] = useState('Only Once');
  const [expiration, setExpiration] = useState(null);
  const [alertTitle, setAlertTitle] = useState('');
  const [message, setMessage] = useState('');
  
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
        headers: {
          'Authorization': `Bearer ${session?.myCustomToken}`,
          'Content-Type': 'application/json'
        },
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

    
   
    onSubmit();
    onClose();
  };

  const handleChange = (event) => {
    setValue({
      ...value,
      [event.target.name]: event.target.value,
    });
  };

  const handleUpperBoundChange = (event) => {
    setUpperBound(event.target.value);
  };

  const handleLowerBoundChange = (event) => {
    setLowerBound(event.target.value);
  };

  const handleTriggerChange = (event, newTrigger) => {
    if (newTrigger !== null) {
      setTrigger(newTrigger);
    }
  };

  const handleExpirationChange = (newValue) => {
    setExpiration(newValue);
  };

  return (
    <Box 
      component="form"
      onSubmit={handleSubmit}
      sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, width: '100%', height:'100%' }}
    >
      <Typography variant="h6">Create New Alert</Typography>
      
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={3}>
          <Typography variant="subtitle1">Symbol</Typography>
        </Grid>
        <Grid item xs={9}>
          <Autocomplete
            options={symbols}
            getOptionLabel={(option) => option}
            value={symbol}
            onChange={(event, newValue) => setSymbol(newValue)}
            renderInput={(params) => <TextField {...params} label="Symbol" variant="outlined" fullWidth />}
          />
        </Grid>
      </Grid>
      
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={3}>
          <Typography variant="subtitle1">Condition</Typography>
        </Grid>
        <Grid item xs={9}>
          <FormControl fullWidth>
            <InputLabel id="operator-label">Operator</InputLabel>
            <Select
              label="Operator"
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
            >
              <MenuItem value="Crossing">Crossing</MenuItem>
              <MenuItem value="Crossing Up">Crossing Up</MenuItem>
              <MenuItem value="Crossing Down">Crossing Down</MenuItem>
              <MenuItem value="Greater Than">Greater Than</MenuItem>
              <MenuItem value="Less Than">Less Than</MenuItem>
              <MenuItem value="Entering Channel">Entering Channel</MenuItem>
              <MenuItem value="Exiting Channel">Exiting Channel</MenuItem>
              <MenuItem value="Inside Channel">Inside Channel</MenuItem>
              <MenuItem value="Outside Channel">Outside Channel</MenuItem>
              <MenuItem value="Moving Up %">Moving Up %</MenuItem>
              <MenuItem value="Moving Down %">Moving Down %</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      
      {operator === 'Entering Channel' || operator === 'Exiting Channel' || operator === 'Inside Channel' || operator === 'Outside Channel' ? (
        <>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={3}>
              <Typography variant="subtitle1">Upper Bound</Typography>
            </Grid>
            <Grid item xs={9}>
              <NumericFormat
                value={upperBound}
                onValueChange={(values) => {
                  setUpperBound(values.value);  // store numeric value as a string
                }}
                customInput={TextField}
                thousandSeparator={true}
                decimalSeparator="."
                valueIsNumericString
                variant="outlined"
                prefix="$"
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={3}>
              <Typography variant="subtitle1">Lower Bound</Typography>
            </Grid>
            <Grid item xs={9}>
              <NumericFormat
                value={lowerBound}
                onValueChange={(values) => {
                  setLowerBound(values.value);  // store numeric value as a string
                }}
                customInput={TextField}
                thousandSeparator={true}
                decimalSeparator="."
                valueIsNumericString
                variant="outlined"
                prefix="$"
                fullWidth
              />
            </Grid>
          </Grid>
        </>
      ) : operator === 'Moving Up %' || operator === 'Moving Down %' ? (
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={3}>
            <Typography variant="subtitle1">Value %</Typography>
          </Grid>
          <Grid item xs={9}>
            <NumericFormat
              value={value}
              onValueChange={(values) => {
                setValue(values.value);  // store numeric value as a string
              }}
              customInput={TextField}
              thousandSeparator={true}
              decimalSeparator="."
              valueIsNumericString
              variant="outlined"
              fullWidth
            />
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={3}>
            <Typography variant="subtitle1">Value</Typography>
          </Grid>
          <Grid item xs={9}>
            <NumericFormat
              value={value}
              onValueChange={(values) => {
                setValue(values.value);  // store numeric value as a string
              }}
              customInput={TextField}
              thousandSeparator={true}
              decimalSeparator="."
              valueIsNumericString
              variant="outlined"
              prefix="$"
              fullWidth
            />
          </Grid>
        </Grid>
      )}
      
      <Divider />
      
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={3}>
          <Typography variant="subtitle1">Trigger</Typography>
        </Grid>
        <Grid item xs={9}>
          <ToggleButtonGroup
            value={trigger}
            exclusive
            onChange={handleTriggerChange}
            aria-label="trigger"
            fullWidth
          >
            <ToggleButton value="Only Once" aria-label="only once" sx={{ padding: '10px 20px' }}>
              Only Once
            </ToggleButton>
            <ToggleButton value="Every Time" aria-label="every time" sx={{ padding: '10px 20px' }}>
              Every Time
            </ToggleButton>
          </ToggleButtonGroup>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {trigger === 'Only Once'
              ? 'The alert will trigger only once and will not be repeated'
              : 'The alert will trigger every time the condition is met, but not more than 1 time per minute'}
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={3}>
          <Typography variant="subtitle1">Expiration</Typography>
        </Grid>
        <Grid item xs={9}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DateTimePicker']}>
            <DateTimePicker label="Basic date time picker" />
          </DemoContainer>
        </LocalizationProvider>
        </Grid>
      </Grid>
      <Divider />

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={3}>
          <Typography variant="subtitle1">Alert Title</Typography>
        </Grid>
        <Grid item xs={9}>
          <TextField
            label="Alert Title"
            value={alertTitle}
            onChange={(e) => setAlertTitle(e.target.value)}
            variant="outlined"
            fullWidth
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={3}>
          <Typography variant="subtitle1">Message</Typography>
        </Grid>
        <Grid item xs={9}>
          <TextField
            label="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            variant="outlined"
            fullWidth
            multiline
            rows={4}
          />
        </Grid>
      </Grid>
      
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button type="button" variant="text" onClick={onBack}>Back</Button>
        <Button type="button" onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained">Create</Button>
      </Box>
    </Box>
  );
}
