import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  CardHeader,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  CircularProgress
} from '@mui/material';
import { 
  Person as PersonIcon, 
  Description as DocumentIcon, 
  Phone as PhoneIcon, 
  Notifications as NotificationsIcon 
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

// Mock data for dashboard
const recentLeads = [
  { id: '1', name: 'John Smith', date: '2023-08-15', status: 'New' },
  { id: '2', name: 'Sarah Johnson', date: '2023-08-14', status: 'In Progress' },
  { id: '3', name: 'Michael Brown', date: '2023-08-13', status: 'Contacted' },
];

const recentCalls = [
  { id: '1', name: 'John Smith', date: '2023-08-15', duration: '5:23' },
  { id: '2', name: 'Sarah Johnson', date: '2023-08-14', duration: '3:45' },
  { id: '3', name: 'Michael Brown', date: '2023-08-13', duration: '8:12' },
];

const recentDocuments = [
  { id: '1', name: 'Insurance Claim.pdf', date: '2023-08-15', type: 'PDF' },
  { id: '2', name: 'Medical Report.docx', date: '2023-08-14', type: 'DOCX' },
  { id: '3', name: 'Accident Photos.zip', date: '2023-08-13', type: 'ZIP' },
];

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLeads: 0,
    newLeads: 0,
    totalCalls: 0,
    totalDocuments: 0
  });

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        totalLeads: 156,
        newLeads: 23,
        totalCalls: 89,
        totalDocuments: 214
      });
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.firstName || 'User'}!
      </Typography>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: '#e3f2fd',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PersonIcon color="primary" sx={{ mr: 1 }} />
              <Typography component="h2" variant="h6" color="primary">
                Total Leads
              </Typography>
            </Box>
            <Typography component="p" variant="h4">
              {stats.totalLeads}
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
              {stats.newLeads} new this week
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: '#e8f5e9',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PhoneIcon color="success" sx={{ mr: 1 }} />
              <Typography component="h2" variant="h6" color="success.main">
                Total Calls
              </Typography>
            </Box>
            <Typography component="p" variant="h4">
              {stats.totalCalls}
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
              Last call 2 hours ago
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: '#fff8e1',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <DocumentIcon color="warning" sx={{ mr: 1 }} />
              <Typography component="h2" variant="h6" color="warning.main">
                Documents
              </Typography>
            </Box>
            <Typography component="p" variant="h4">
              {stats.totalDocuments}
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
              15 uploaded this week
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: '#fce4ec',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <NotificationsIcon color="secondary" sx={{ mr: 1 }} />
              <Typography component="h2" variant="h6" color="secondary.main">
                Notifications
              </Typography>
            </Box>
            <Typography component="p" variant="h4">
              7
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
              3 require attention
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Recent Activity */}
      <Grid container spacing={3}>
        {/* Recent Leads */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader 
              title="Recent Leads" 
              titleTypographyProps={{ variant: 'h6' }}
              action={
                <Button size="small" color="primary">
                  View All
                </Button>
              }
            />
            <Divider />
            <CardContent sx={{ p: 0 }}>
              <List>
                {recentLeads.map((lead) => (
                  <React.Fragment key={lead.id}>
                    <ListItem>
                      <ListItemText
                        primary={lead.name}
                        secondary={`${lead.date} • ${lead.status}`}
                      />
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Recent Calls */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader 
              title="Recent Calls" 
              titleTypographyProps={{ variant: 'h6' }}
              action={
                <Button size="small" color="primary">
                  View All
                </Button>
              }
            />
            <Divider />
            <CardContent sx={{ p: 0 }}>
              <List>
                {recentCalls.map((call) => (
                  <React.Fragment key={call.id}>
                    <ListItem>
                      <ListItemText
                        primary={call.name}
                        secondary={`${call.date} • ${call.duration}`}
                      />
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Recent Documents */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader 
              title="Recent Documents" 
              titleTypographyProps={{ variant: 'h6' }}
              action={
                <Button size="small" color="primary">
                  View All
                </Button>
              }
            />
            <Divider />
            <CardContent sx={{ p: 0 }}>
              <List>
                {recentDocuments.map((doc) => (
                  <React.Fragment key={doc.id}>
                    <ListItem>
                      <ListItemText
                        primary={doc.name}
                        secondary={`${doc.date} • ${doc.type}`}
                      />
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage; 