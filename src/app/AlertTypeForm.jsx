"use client";

import React from 'react';
import { Box, Grid2, Typography, Paper  } from '@mui/material';
import { styled } from '@mui/material/styles';
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import { Description, PriceChange } from '@mui/icons-material';
import WaterfallChartIcon from '@mui/icons-material/WaterfallChart';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import MultipleStopIcon from '@mui/icons-material/MultipleStop';

const choices = [
    
    { icon: <PriceChange fontSize='large' sx={{}}/>, label: 'Price Alert', value: 'price', description: ' '  },
  { icon: <WaterfallChartIcon fontSize='large' sx={{}}/>, label: 'Technical Indicators', value: 'indicators', description: 'You receive alerts when there are some buy/sell signals following professional technical indicators. Recommended for professional users.' },
  { icon: <QueryStatsIcon fontSize='large' sx={{}}/>, label: 'Token Stats Performance', value: 'token_stats_performance', description: 'You receive alerts when token(s) changes its non-price parameters such as volume, number of trades, ect. in a certain time frames.' },
  { icon: <TouchAppIcon fontSize='large' sx={{}}/>, label: 'Trading Events', value: 'trading_events', description: 'You receive alerts when specific actions happened, such as large buys, large sells or any trades by a wallet.' },
  { icon: <MultipleStopIcon fontSize='large' sx={{}}/>, label: 'Market Movements', value: 'market_movements', description: 'You receive notifications following market events such as new trending tokens or new tokens listed.' },
];


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    cursor: 'pointer',
    '&:hover': { },
    color: theme.palette.text.secondary,
    ...theme.applyStyles('dark', {
      backgroundColor: '#1A2027',
    }),
    
  }));

export default function AlertTypeForm({ onSelectType }) {
  return (
    <Box sx={{ p: 2, width: '100%' }}>
      <Typography variant="h6" gutterBottom>Select Alert Type</Typography>
      <Box sx={{
        display: 'flex',
        // flexWrap: 'wrap',
        // gap: 2,
        
      }}>
        <Grid2 container spacing={3}>

        {choices.map((choice) => (
            <Grid2 key={choice.value} size={12} >
                <Item 
                    key={choice.value} 
                    onClick={() => onSelectType(choice.value)}
                >
                        <Grid2 container spacing={1}>
                            <Grid2 size={12} sx={{display:'flex', flexDirection:'row', mb:.5 }}>
                                {choice.icon}
                                <Typography component='div' variant="h6" sx={{pl:2}}>{choice.label}</Typography>
                            </Grid2>
                            <Grid2 size={12}>
                                <Typography component='div' variant="body1" sx={{width:'100%', color:'#c2c7d7', fontSize:'1.1em'}}>{choice.description}</Typography>
                            </Grid2>
                        </Grid2>
                </Item>
            </Grid2>
        ))}
        </Grid2>

      </Box>
    </Box>
  );
}
