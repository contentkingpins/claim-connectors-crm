import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  CircularProgress,
  Chip,
  TextField,
  InputAdornment,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  Claim, 
  ClaimStatus, 
  ClaimType, 
  ClaimPriority, 
  ClaimListResponse,
  ClaimStatistics
} from '../types/Claim';
import ClaimDetailDialog from '../components/claims/ClaimDetailDialog';

const ClaimsManagementPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [filteredClaims, setFilteredClaims] = useState<Claim[]>([]);
  const [statistics, setStatistics] = useState<ClaimStatistics | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ClaimStatus | ''>('');
  const [typeFilter, setTypeFilter] = useState<ClaimType | ''>('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  
  // Detail dialog state
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  
  // Delete confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [claimToDelete, setClaimToDelete] = useState<Claim | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch claims data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch claims
        const response = await api.claims.list({
          limit: rowsPerPage,
          offset: page * rowsPerPage,
          searchTerm: searchTerm || undefined,
          status: statusFilter || undefined,
          claimType: typeFilter || undefined
        });
        
        setClaims(response.claims);
        setFilteredClaims(response.claims);
        setTotalCount(response.total);
        
        // Fetch statistics
        const statsResponse = await api.claims.getStatistics();
        setStatistics(statsResponse);
      } catch (error) {
        console.error('Error fetching claims data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [page, rowsPerPage, searchTerm, statusFilter, typeFilter]);

  // Handle page change
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Open claim detail dialog
  const handleOpenDetailDialog = (claimId: string) => {
    setSelectedClaimId(claimId);
    setDetailDialogOpen(true);
  };
  
  // Close claim detail dialog
  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false);
    setSelectedClaimId(null);
  };
  
  // Handle claim update from detail dialog
  const handleClaimUpdate = (updatedClaim: Claim) => {
    // Update the claim in the list
    setClaims(prevClaims => 
      prevClaims.map(claim => 
        claim.id === updatedClaim.id ? updatedClaim : claim
      )
    );
    
    // Refresh statistics
    api.claims.getStatistics().then(statsResponse => {
      setStatistics(statsResponse);
    });
  };
  
  // Open delete confirmation dialog
  const handleOpenDeleteDialog = (claim: Claim) => {
    setClaimToDelete(claim);
    setDeleteDialogOpen(true);
  };
  
  // Close delete confirmation dialog
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setClaimToDelete(null);
  };
  
  // Delete claim
  const handleDeleteClaim = async () => {
    if (!claimToDelete) return;
    
    setDeleting(true);
    try {
      await api.claims.delete(claimToDelete.id);
      
      // Remove the claim from the list
      setClaims(prevClaims => 
        prevClaims.filter(claim => claim.id !== claimToDelete.id)
      );
      
      // Refresh statistics
      const statsResponse = await api.claims.getStatistics();
      setStatistics(statsResponse);
      
      // Close the dialog
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error deleting claim:', error);
    } finally {
      setDeleting(false);
    }
  };

  // Get status chip color
  const getStatusColor = (status: ClaimStatus) => {
    switch (status) {
      case ClaimStatus.APPROVED:
        return 'success';
      case ClaimStatus.PARTIALLY_APPROVED:
        return 'success';
      case ClaimStatus.UNDER_REVIEW:
        return 'info';
      case ClaimStatus.SUBMITTED:
        return 'info';
      case ClaimStatus.DRAFT:
        return 'default';
      case ClaimStatus.ADDITIONAL_INFO_NEEDED:
        return 'warning';
      case ClaimStatus.APPEALED:
        return 'warning';
      case ClaimStatus.REJECTED:
        return 'error';
      case ClaimStatus.CLOSED:
        return 'default';
      default:
        return 'default';
    }
  };

  // Get priority chip color
  const getPriorityColor = (priority: ClaimPriority) => {
    switch (priority) {
      case ClaimPriority.URGENT:
        return 'error';
      case ClaimPriority.HIGH:
        return 'warning';
      case ClaimPriority.MEDIUM:
        return 'info';
      case ClaimPriority.LOW:
        return 'success';
      default:
        return 'default';
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading && claims.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Claims Management</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => {/* TODO: Implement new claim creation */}}
        >
          New Claim
        </Button>
      </Box>

      {/* Statistics Cards */}
      {statistics && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 120 }}>
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Total Claims
              </Typography>
              <Typography component="p" variant="h4">
                {statistics.totalClaims}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 120 }}>
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Total Amount
              </Typography>
              <Typography component="p" variant="h4">
                {formatCurrency(statistics.totalClaimAmount)}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 120 }}>
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Approval Rate
              </Typography>
              <Typography component="p" variant="h4">
                {statistics.approvalRate.toFixed(1)}%
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 120 }}>
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Avg. Processing Time
              </Typography>
              <Typography component="p" variant="h4">
                {statistics.averageProcessingTime.toFixed(1)} days
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search Claims"
              variant="outlined"
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
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              select
              fullWidth
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ClaimStatus | '')}
              variant="outlined"
            >
              <MenuItem value="">All Statuses</MenuItem>
              {Object.values(ClaimStatus).map((status) => (
                <MenuItem key={status} value={status}>
                  {status.replace(/_/g, ' ')}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              select
              fullWidth
              label="Claim Type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as ClaimType | '')}
              variant="outlined"
            >
              <MenuItem value="">All Types</MenuItem>
              {Object.values(ClaimType).map((type) => (
                <MenuItem key={type} value={type}>
                  {type.replace(/_/g, ' ')}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={() => {
                setStatusFilter('');
                setTypeFilter('');
                setSearchTerm('');
              }}
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Claims Table */}
      <Paper sx={{ width: '100%', mb: 4 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Claim #</TableCell>
                <TableCell>Business</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Submission Date</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <CircularProgress size={24} sx={{ my: 2 }} />
                  </TableCell>
                </TableRow>
              ) : claims.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No claims found
                  </TableCell>
                </TableRow>
              ) : (
                claims.map((claim) => (
                  <TableRow key={claim.id} hover>
                    <TableCell>{claim.claimNumber}</TableCell>
                    <TableCell>{claim.clientBusinessName}</TableCell>
                    <TableCell>
                      {claim.claimType.replace(/_/g, ' ')}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={claim.status.replace(/_/g, ' ')}
                        color={getStatusColor(claim.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={claim.priority}
                        color={getPriorityColor(claim.priority) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(claim.claimAmount)}
                    </TableCell>
                    <TableCell>
                      {formatDate(claim.submissionDate)}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Details">
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleOpenDetailDialog(claim.id)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleOpenDetailDialog(claim.id)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleOpenDeleteDialog(claim)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      
      {/* Claim Detail Dialog */}
      <ClaimDetailDialog
        open={detailDialogOpen}
        claimId={selectedClaimId}
        onClose={handleCloseDetailDialog}
        onUpdate={handleClaimUpdate}
      />
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete claim #{claimToDelete?.claimNumber} for {claimToDelete?.clientBusinessName}? 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary" disabled={deleting}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteClaim} 
            color="error" 
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={20} /> : null}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ClaimsManagementPage; 