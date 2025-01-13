"use client"; // If using Next.js App Router, else remove this line

import React, { useEffect, useState } from 'react';
import {
  Table, TableHead, TableBody, TableCell, TableRow, TableContainer,
  Paper, Button, Popover, Typography, Box, Modal,
  IconButton,
  Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
// import AlertForm from './AlertForm';
import EditIcon from '@mui/icons-material/Edit';
import CreateAlertPopup from './CreateAlertPopup';
import InfoIcon from '@mui/icons-material/Info';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import io from 'socket.io-client';

export default function AlertTable() {
  const {data: session, status} = useSession()
  const [alerts, setAlerts] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedAlertForDelete, setSelectedAlertForDelete] = useState(null);

  const API_BASE_URL = "http://ec2-13-61-169-193.eu-north-1.compute.amazonaws.com:5000/";
  const API_BASE_DOMAIN = "https://sonarsignals.com";
  //TestUpdate
  // Fetch alerts from your backend
  const fetchAlerts = async () => {
    console.log(`myCustomToken: ${session?.myCustomToken}`);
  
    axios.get(`${API_BASE_DOMAIN}/api/alerts`, {
      headers: {
        Authorization: `Bearer ${session?.myCustomToken}`,
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      const data = response.data;
      console.log('Alerts Data: ', data);
      console.log('My Token: ', session?.myCustomToken);
      setAlerts(data.alerts);
    })
    .catch(error => {
      console.error('Error fetching alerts: ', error);
    });
  
  };

  useEffect(() => {
    const socket = io(API_BASE_DOMAIN);
    socket.on('alert', (data) => {
      console.log('Received alert: ', data);
      if (data === 'Done'){
        fetchAlerts();
      }
    });
  }, [status]);

  useEffect(() => {
    if (session) {
      fetchAlerts();
      console.log("[*ALERTS]: ", alerts);
    }
  }, [session]);

  const handlePauseAlert = async (alert) => {
    try {
      const response = await axios.post(`${API_BASE_DOMAIN}/api/alerts/${alert.alert_id}/pause`, {}, {
        headers: {
          Authorization: `Bearer ${session?.myCustomToken}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        console.log('Alert paused successfully');
        fetchAlerts();
      } else {
        console.error('Failed to pause alert: ', response.statusText);
      }
    } catch (error) {
      console.error('Error pausing alert: ', error);
    }
  }

  const handleStartAlert = async (alert) => {
    try {
      const response = await axios.post(`${API_BASE_DOMAIN}/api/alerts/${alert.alert_id}/start`, {
        symbol: alert.symbol,
        operator: alert.operator,
        value: alert.value,
        lowerBound: alert.lowerBound,
        upperBound: alert.upperBound,
        trigger: alert.trigger,
        expiration: alert.expiration,
        alertTitle: alert.alertTitle,
        message: alert.message,
        type: alert.type,
        created_at: alert.created_at,
        status: alert.status,
      }, {
        headers: {
          Authorization: `Bearer ${session?.myCustomToken}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        console.log('Alert started successfully');
        fetchAlerts();
      } else {
        console.error('Failed to start alert: ', response.statusText);
      }
    } catch (error) {
      console.error('Error starting alert: ', error);
    }
  };

  const handleOpenPopover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const handleFormSubmit = () => {
    // Refresh the alerts after creating a new one
    fetchAlerts();
    
  };

  const handleOpenInfoModal = (alert) => {
    setSelectedAlert(alert);
    setInfoModalOpen(true);
  }

  const handleCloseInfoModal = () => {
    setInfoModalOpen(false);
    setSelectedAlert(null);
  }

  const handleOpenDeleteModal = (alert) => {
    setSelectedAlertForDelete(alert);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedAlertForDelete(null);
  };

  const handleDeleteAlertConfirm = async (alertId) => {
    // Send DELETE request to the backend: /api/alerts/:id
    if (!selectedAlertForDelete) return;
    try {
      // Change the line  below for the prod version.
      // const response = await fetch(`http://localhost:5000/api/alerts/${selectedAlertForDelete.id}`, {

      const response = await fetch(`${API_BASE_DOMAIN}/api/alerts/${selectedAlertForDelete.alert_id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session?.myCustomToken}`,
          'Content-Type': 'application/json',
        },
      });
      if(response.ok) {
        fetchAlerts();
      } else {
        console.error('Failed to delete alert: ', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting alert: ', error);
    } finally {
      handleCloseDeleteModal();
    }
  }

  const open = Boolean(anchorEl);

  return (
    <Box sx={{ p: 4, width:'100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
        <Typography variant="h5">All Alerts</Typography>
        <Button variant="contained" onClick={handleOpenPopover}>Create New Alert</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Alert ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell align='center'>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {alerts.map((alert) => (
              <TableRow key={alert.id}>
                <TableCell>{alert.alert_id}</TableCell>
                <TableCell>{alert.alertTitle}</TableCell>
                <TableCell>{alert.type}</TableCell>
                <TableCell>
                  {alert.status === "Active" ? (
                    <Typography component='div' variant='subtitle1' sx={{color:'#31df31'}}>{alert.status}</Typography>
                  ) : (
                    <Typography component='div' variant='subtitle1' sx={{color:'#c34949'}}>{alert.status}</Typography>
                  )}
                </TableCell>
                <TableCell>{alert.created_at}</TableCell>
                <TableCell> 
                    <Box sx={{display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                        {/* <Typography component="div" variant='subtitle2'>E</Typography>
                        <Typography component="div" variant='subtitle2' sx={{color:'red'}}>R</Typography> */}
                        {alert.status === "Active" ? (
                          <IconButton
                          size='small'
                          sx={{mr: 1}}     
                          onClick={() => handlePauseAlert(alert)}                           
                          >
                            <PauseCircleOutlineIcon sx={{color:'8a8a8a'}} fontSize='inherit'/>
                          </IconButton>
                        ) : (
                          <IconButton
                            size = 'small'
                            sx={{mr: 1}}
                            onClick={() => handleStartAlert(alert)}
                          >
                            <PlayCircleOutlineIcon sx={{color:'8a8a8a'}} fontSize='inherit'/>
                          </IconButton>
                        )}
                        <IconButton
                          size='small' sx={{mr: 1}} onClick={() => handleOpenInfoModal(alert)}
                        >
                          <InfoIcon sx={{color:'8a8a8a'}} fontSize='inherit' />
                        </IconButton>
                        <IconButton
                          size='small'
                          sx={{mr:1}}
                          onClick={() => handleOpenDeleteModal(alert)}
                        >
                          <DeleteIcon sx={{color:'8a8a8a'}} fontSize='inherit'/>
                        </IconButton>
                    </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Modal
        open={open}
        onClose={handleClosePopover}
      >
        <Box 
          sx={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 1,
            width:{xs:'90%', sm:'400px',lg:'35%'},
            maxWidth: '90%',
            maxHeight: '90vh',
            overflowY: 'auto',
            p: 2,
            
          }}
        >
            <CreateAlertPopup onClose={handleClosePopover} onSubmit={handleFormSubmit} />
        </Box>
      </Modal>
      
      <Modal
        open={infoModalOpen} onClose={handleCloseInfoModal}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 1,
            width:'25%',
            minHeight:'50vh',
            p:2
          }}
        >
          {selectedAlert ? (
            <>
              <Typography component='div' variant="h6" gutterBottom>Alert Information</Typography>

              <Divider sx={{ mb:1, mt:1 }}/>
              <Typography component='div'><strong>Alert:</strong> {selectedAlert.alert_id}</Typography>
              <Divider sx={{ mb:1, mt:1 }}/>
              <Typography component='div'><strong>Title:</strong> {selectedAlert.alertTitle}</Typography>
              <Divider sx={{ mb:1, mt:1 }}/>
              <Typography component='div'><strong>Type:</strong> {selectedAlert.type}</Typography>
              <Divider sx={{ mb:1, mt:1 }}/>
              <Typography component='div'><strong>Status:</strong> {selectedAlert.status}</Typography>
              <Divider sx={{ mb:1, mt:1 }}/>
              <Typography component='div'><strong>Created At:</strong> {selectedAlert.created_at}</Typography>
              <Divider sx={{ mb:1, mt:1 }}/>
              <Typography component='div'><strong>Operator:</strong> {selectedAlert.operator}</Typography>
              <Divider sx={{ mb:1, mt:1 }}/>
              {alert.lowerBound && alert.upperBound ? (
                <>
                  <Typography component='div'><strong>Lower Bound:</strong> {selectedAlert.lowerBound}</Typography>
                  <Divider sx={{ mb:1, mt:1 }}/>
                  <Typography component='div'><strong>Upper Bound:</strong> {selectedAlert.upperBound}</Typography>
                  <Divider sx={{ mb:1, mt:1 }}/>
                </>
              ):(
                <>
                  <Typography component='div'><strong>Value:</strong> {selectedAlert.value}</Typography>
                  <Divider sx={{ mb:1, mt:1 }}/>
                </>
              )}
              
              <Typography component='div'><strong>Trigger:</strong> {selectedAlert.trigger}</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button variant='contained' onClick={handleCloseInfoModal}>Close</Button>
              </Box>
            </>
          ) : (
            <Typography>Loading...</Typography>
          )}
        </Box>
      </Modal>

      <Modal
        open={deleteModalOpen}
        onClose={handleCloseDeleteModal }
      >
        <Box 
          sx={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 1,
            width:'28%',
            // minHeight:'50vh',
            // minHeight:'16vh',
            p:2
          }}
        >
          <Typography variant="h6" gutterBottom><DeleteForeverIcon fontSize='large'/>Confirm Deletion</Typography>
          <Typography>
            Are you sure you want to delete this alert?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
            <Button onClick={handleCloseDeleteModal}>Cancel</Button>
            <Button variant="contained" color="error" onClick={() => handleDeleteAlertConfirm(alert.id)}>Delete</Button>
          </Box>
        </Box>
      </Modal>

    </Box>
  );
}
