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
  Divider,
  Button,
  CircularProgress,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  useTheme
} from '@mui/material';
import { 
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  MonetizationOn as MonetizationOnIcon,
  AccessTime as AccessTimeIcon,
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { FirmPerformance, MonthlyStats } from '../types/Performance';

// Mock chart component (replace with real chart library like recharts)
const MockChart: React.FC<{ data: any; type: string; height?: number }> = ({ data, type, height = 300 }) => {
  const theme = useTheme();
  
  return (
    <Box 
      sx={{ 
        height: height, 
        width: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        bgcolor: theme.palette.background.default,
        borderRadius: 1,
        p: 2
      }}
    >
      <Typography color="textSecondary">
        {type} Chart - Replace with actual chart component
      </Typography>
    </Box>
  );
};

// Tab panel component
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`firm-tabpanel-${index}`}
      aria-labelledby={`firm-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const FirmPortalPage: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [firmData, setFirmData] = useState<FirmPerformance | null>(null);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
  const [tabValue, setTabValue] = useState(0);
  
  // Fetch firm data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, we would get the firm ID from the user's attributes
        // For now, we'll just use the first firm from the list
        const firms = await api.firmPerformance.list();
        if (firms.length > 0) {
          const firmId = firms[0].id;
          const [firmDetails, stats] = await Promise.all([
            api.firmPerformance.get(firmId),
            api.firmPerformance.getMonthlyStats(firmId)
          ]);
          
          setFirmData(firmDetails);
          setMonthlyStats(stats);
        }
      } catch (error) {
        console.error('Error fetching firm data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
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
  
  if (!firmData) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Firm Portal
        </Typography>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6">
            No firm data available
          </Typography>
        </Paper>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          {firmData.name} Dashboard
        </Typography>
        <Button variant="contained" color="primary">
          Export Report
        </Button>
      </Box>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
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
              <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
              <Typography component="h2" variant="h6" color="primary">
                Success Rate
              </Typography>
            </Box>
            <Typography component="p" variant="h4">
              {firmData.successRate.toFixed(1)}%
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <LinearProgress 
                variant="determinate" 
                value={firmData.successRate} 
                sx={{ flexGrow: 1, height: 8, borderRadius: 4 }} 
              />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
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
              <MonetizationOnIcon color="success" sx={{ mr: 1 }} />
              <Typography component="h2" variant="h6" color="success.main">
                Total Revenue
              </Typography>
            </Box>
            <Typography component="p" variant="h4">
              ${(firmData.totalRevenue / 1000000).toFixed(2)}M
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
              Avg. Claim: ${firmData.averageClaimValue.toLocaleString()}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
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
              <AssessmentIcon color="warning" sx={{ mr: 1 }} />
              <Typography component="h2" variant="h6" color="warning.main">
                Total Claims
              </Typography>
            </Box>
            <Typography component="p" variant="h4">
              {firmData.totalClaims}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Chip 
                size="small" 
                color="success" 
                label={`${firmData.successfulClaims} Successful`} 
                sx={{ mr: 1 }} 
              />
              <Chip 
                size="small" 
                color="warning" 
                label={`${firmData.pendingClaims} Pending`} 
                sx={{ mr: 1 }} 
              />
              <Chip 
                size="small" 
                color="error" 
                label={`${firmData.rejectedClaims} Rejected`} 
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Tabs */}
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Performance" />
          <Tab label="Claims" />
          <Tab label="CPAs" />
        </Tabs>
        
        {/* Performance Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Monthly Performance
              </Typography>
              <MockChart 
                data={monthlyStats} 
                type="Line" 
                height={350} 
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Success Rate Trend" />
                <Divider />
                <CardContent>
                  <MockChart 
                    data={monthlyStats.map(stat => ({ 
                      month: stat.month, 
                      successRate: stat.successRate 
                    }))} 
                    type="Bar" 
                  />
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Revenue Trend" />
                <Divider />
                <CardContent>
                  <MockChart 
                    data={monthlyStats.map(stat => ({ 
                      month: stat.month, 
                      revenue: stat.revenue 
                    }))} 
                    type="Area" 
                  />
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <Card>
                <CardHeader 
                  title="Monthly Statistics" 
                  action={
                    <Button size="small" color="primary">
                      Export CSV
                    </Button>
                  }
                />
                <Divider />
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Month</TableCell>
                        <TableCell align="right">Total Claims</TableCell>
                        <TableCell align="right">Successful</TableCell>
                        <TableCell align="right">Pending</TableCell>
                        <TableCell align="right">Rejected</TableCell>
                        <TableCell align="right">Success Rate</TableCell>
                        <TableCell align="right">Revenue</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {monthlyStats.map((stat) => (
                        <TableRow key={stat.month}>
                          <TableCell component="th" scope="row">
                            {new Date(stat.month + '-01').toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short' 
                            })}
                          </TableCell>
                          <TableCell align="right">{stat.totalClaims}</TableCell>
                          <TableCell align="right">{stat.successfulClaims}</TableCell>
                          <TableCell align="right">{stat.pendingClaims}</TableCell>
                          <TableCell align="right">{stat.rejectedClaims}</TableCell>
                          <TableCell align="right">{stat.successRate.toFixed(1)}%</TableCell>
                          <TableCell align="right">${(stat.revenue / 1000).toFixed(1)}K</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Claims Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Claims by Status" />
                <Divider />
                <CardContent>
                  <MockChart 
                    data={[
                      { status: 'Successful', value: firmData.successfulClaims },
                      { status: 'Pending', value: firmData.pendingClaims },
                      { status: 'Rejected', value: firmData.rejectedClaims },
                    ]} 
                    type="Pie" 
                  />
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Processing Time" />
                <Divider />
                <CardContent>
                  <Box sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Average Processing Time
                    </Typography>
                    <Typography variant="h3" color="primary" gutterBottom>
                      {firmData.averageProcessingTime} days
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                      <AccessTimeIcon color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Industry average: 45 days
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <Card>
                <CardHeader title="Client Satisfaction" />
                <Divider />
                <CardContent>
                  <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom>
                      Client Satisfaction Score
                    </Typography>
                    <Box sx={{ position: 'relative', display: 'inline-block' }}>
                      <CircularProgress
                        variant="determinate"
                        value={100}
                        size={200}
                        thickness={4}
                        sx={{ color: '#f5f5f5' }}
                      />
                      <CircularProgress
                        variant="determinate"
                        value={firmData.clientSatisfactionScore}
                        size={200}
                        thickness={4}
                        sx={{
                          color: firmData.clientSatisfactionScore > 75 ? 'success.main' : 
                                 firmData.clientSatisfactionScore > 50 ? 'warning.main' : 'error.main',
                          position: 'absolute',
                          left: 0,
                        }}
                      />
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: 'absolute',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography variant="h3" component="div" color="text.primary">
                          {firmData.clientSatisfactionScore}%
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                      <Chip 
                        icon={<CheckCircleIcon />} 
                        color="success" 
                        label="Above Industry Average" 
                        sx={{ mt: 2 }} 
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* CPAs Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            CPA Performance
          </Typography>
          <Typography variant="body1" paragraph>
            View detailed CPA performance metrics on the CPA Performance page.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<PeopleIcon />}
            onClick={() => window.location.href = '/cpa-performance'}
          >
            Go to CPA Performance
          </Button>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default FirmPortalPage; 