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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme
} from '@mui/material';
import { 
  Search as SearchIcon,
  Sort as SortIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  MonetizationOn as MonetizationOnIcon,
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Info as InfoIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { CPAPerformance, MonthlyStats } from '../types/Performance';

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

// CPA detail dialog component
interface CPADetailDialogProps {
  cpa: CPAPerformance | null;
  open: boolean;
  onClose: () => void;
}

const CPADetailDialog: React.FC<CPADetailDialogProps> = ({ cpa, open, onClose }) => {
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const fetchMonthlyStats = async () => {
      if (cpa) {
        setIsLoading(true);
        try {
          const stats = await api.cpaPerformance.getMonthlyStats(cpa.id);
          setMonthlyStats(stats);
        } catch (error) {
          console.error('Error fetching CPA monthly stats:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    if (open && cpa) {
      fetchMonthlyStats();
    }
  }, [cpa, open]);
  
  if (!cpa) {
    return null;
  }
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            {cpa.firstName} {cpa.lastName} - Performance Details
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                    <Avatar 
                      sx={{ 
                        width: 100, 
                        height: 100, 
                        mb: 2,
                        bgcolor: 'primary.main',
                        fontSize: '2rem'
                      }}
                    >
                      {cpa.firstName.charAt(0)}{cpa.lastName.charAt(0)}
                    </Avatar>
                    <Typography variant="h5" gutterBottom>
                      {cpa.firstName} {cpa.lastName}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <EmailIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">{cpa.email}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">{cpa.phone}</Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" gutterBottom>
                    Specialties
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {cpa.specialties.map((specialty) => (
                      <Chip 
                        key={specialty} 
                        label={specialty} 
                        size="small" 
                        color="primary" 
                        variant="outlined" 
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Card>
                <CardHeader title="Performance Summary" />
                <Divider />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Success Rate
                        </Typography>
                        <Typography variant="h4" color="primary">
                          {cpa.successRate.toFixed(1)}%
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Total Revenue
                        </Typography>
                        <Typography variant="h4" color="primary">
                          ${(cpa.totalRevenue / 1000000).toFixed(2)}M
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Total Claims
                        </Typography>
                        <Typography variant="h4">
                          {cpa.totalClaims}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                          <Chip 
                            size="small" 
                            color="success" 
                            label={`${cpa.successfulClaims} Successful`} 
                          />
                          <Chip 
                            size="small" 
                            color="warning" 
                            label={`${cpa.pendingClaims} Pending`} 
                          />
                          <Chip 
                            size="small" 
                            color="error" 
                            label={`${cpa.rejectedClaims} Rejected`} 
                          />
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Avg. Claim Value
                        </Typography>
                        <Typography variant="h4">
                          ${cpa.averageClaimValue.toLocaleString()}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <Card>
                <CardHeader title="Monthly Performance" />
                <Divider />
                <CardContent>
                  <MockChart 
                    data={monthlyStats} 
                    type="Line" 
                    height={300} 
                  />
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <Card>
                <CardHeader title="Monthly Statistics" />
                <Divider />
                <TableContainer>
                  <Table size="small">
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
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button variant="contained" color="primary">
          Export Report
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const CPAPerformancePage: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [cpaList, setCPAList] = useState<CPAPerformance[]>([]);
  const [filteredCPAList, setFilteredCPAList] = useState<CPAPerformance[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedCPA, setSelectedCPA] = useState<CPAPerformance | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  
  // Fetch CPA data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const cpas = await api.cpaPerformance.list();
        setCPAList(cpas);
        setFilteredCPAList(cpas);
      } catch (error) {
        console.error('Error fetching CPA data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Filter CPAs based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCPAList(cpaList);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = cpaList.filter(cpa => 
        cpa.firstName.toLowerCase().includes(term) ||
        cpa.lastName.toLowerCase().includes(term) ||
        cpa.email.toLowerCase().includes(term) ||
        cpa.specialties.some(specialty => specialty.toLowerCase().includes(term))
      );
      setFilteredCPAList(filtered);
    }
    setPage(0);
  }, [searchTerm, cpaList]);
  
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleOpenDetailDialog = (cpa: CPAPerformance) => {
    setSelectedCPA(cpa);
    setDetailDialogOpen(true);
  };
  
  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false);
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
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          CPA Performance
        </Typography>
        <Button variant="contained" color="primary">
          Export Report
        </Button>
      </Box>
      
      {/* Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 120,
              bgcolor: '#e3f2fd',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PersonIcon color="primary" sx={{ mr: 1 }} />
              <Typography component="h2" variant="h6" color="primary">
                Total CPAs
              </Typography>
            </Box>
            <Typography component="p" variant="h4">
              {cpaList.length}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 120,
              bgcolor: '#e8f5e9',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TrendingUpIcon color="success" sx={{ mr: 1 }} />
              <Typography component="h2" variant="h6" color="success.main">
                Avg. Success Rate
              </Typography>
            </Box>
            <Typography component="p" variant="h4">
              {(cpaList.reduce((sum, cpa) => sum + cpa.successRate, 0) / cpaList.length).toFixed(1)}%
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 120,
              bgcolor: '#fff8e1',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <MonetizationOnIcon color="warning" sx={{ mr: 1 }} />
              <Typography component="h2" variant="h6" color="warning.main">
                Total Revenue
              </Typography>
            </Box>
            <Typography component="p" variant="h4">
              ${(cpaList.reduce((sum, cpa) => sum + cpa.totalRevenue, 0) / 1000000).toFixed(2)}M
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 120,
              bgcolor: '#f3e5f5',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AssessmentIcon color="secondary" sx={{ mr: 1 }} />
              <Typography component="h2" variant="h6" color="secondary.main">
                Total Claims
              </Typography>
            </Box>
            <Typography component="p" variant="h4">
              {cpaList.reduce((sum, cpa) => sum + cpa.totalClaims, 0)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      {/* CPA Table */}
      <Paper sx={{ mb: 4 }}>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            placeholder="Search CPAs by name, email, or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Divider />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>CPA Name</TableCell>
                <TableCell>Specialties</TableCell>
                <TableCell align="right">Success Rate</TableCell>
                <TableCell align="right">Total Claims</TableCell>
                <TableCell align="right">Avg. Claim Value</TableCell>
                <TableCell align="right">Total Revenue</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCPAList
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((cpa) => (
                  <TableRow key={cpa.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                          {cpa.firstName.charAt(0)}{cpa.lastName.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body1">
                            {cpa.firstName} {cpa.lastName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {cpa.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {cpa.specialties.map((specialty) => (
                          <Chip 
                            key={specialty} 
                            label={specialty} 
                            size="small" 
                            variant="outlined" 
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Chip
                          label={`${cpa.successRate.toFixed(1)}%`}
                          color={
                            cpa.successRate > 75 ? 'success' :
                            cpa.successRate > 50 ? 'warning' : 'error'
                          }
                          size="small"
                        />
                      </Box>
                    </TableCell>
                    <TableCell align="right">{cpa.totalClaims}</TableCell>
                    <TableCell align="right">${cpa.averageClaimValue.toLocaleString()}</TableCell>
                    <TableCell align="right">${(cpa.totalRevenue / 1000).toFixed(0)}K</TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Details">
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleOpenDetailDialog(cpa)}
                        >
                          <InfoIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredCPAList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      
      {/* Performance Comparison Chart */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          CPA Performance Comparison
        </Typography>
        <MockChart 
          data={cpaList.slice(0, 10).map(cpa => ({
            name: `${cpa.firstName} ${cpa.lastName}`,
            successRate: cpa.successRate,
            totalClaims: cpa.totalClaims,
            revenue: cpa.totalRevenue
          }))} 
          type="Bar" 
          height={400} 
        />
      </Paper>
      
      {/* CPA Detail Dialog */}
      <CPADetailDialog
        cpa={selectedCPA}
        open={detailDialogOpen}
        onClose={handleCloseDetailDialog}
      />
    </Container>
  );
};

export default CPAPerformancePage; 