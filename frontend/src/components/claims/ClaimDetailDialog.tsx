import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  TextField,
  MenuItem,
  Chip,
  Divider,
  CircularProgress,
  IconButton,
  Tab,
  Tabs,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Tooltip
} from '@mui/material';
import {
  Close as CloseIcon,
  Event as EventIcon,
  AttachMoney as MoneyIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Description as DescriptionIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { 
  Claim, 
  ClaimStatus, 
  ClaimType, 
  ClaimPriority,
  ClaimTimelineEvent,
  UpdateClaimInput
} from '../../types/Claim';
import api from '../../services/api';

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
      id={`claim-tabpanel-${index}`}
      aria-labelledby={`claim-tab-${index}`}
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

interface ClaimDetailDialogProps {
  open: boolean;
  claimId: string | null;
  onClose: () => void;
  onUpdate: (updatedClaim: Claim) => void;
}

const ClaimDetailDialog: React.FC<ClaimDetailDialogProps> = ({
  open,
  claimId,
  onClose,
  onUpdate
}) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [claim, setClaim] = useState<Claim | null>(null);
  const [timelineEvents, setTimelineEvents] = useState<ClaimTimelineEvent[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<UpdateClaimInput>({});
  
  // Fetch claim data when dialog opens
  useEffect(() => {
    const fetchData = async () => {
      if (open && claimId) {
        setLoading(true);
        try {
          const claimData = await api.claims.get(claimId);
          setClaim(claimData);
          
          // Initialize form data
          setFormData({
            status: claimData.status,
            priority: claimData.priority,
            claimType: claimData.claimType,
            claimAmount: claimData.claimAmount,
            approvedAmount: claimData.approvedAmount,
            notes: claimData.notes,
            rejectionReason: claimData.rejectionReason,
            expectedCompletionDate: claimData.expectedCompletionDate,
            clientContactName: claimData.clientContactName,
            clientContactEmail: claimData.clientContactEmail,
            clientContactPhone: claimData.clientContactPhone
          });
          
          // Fetch timeline events
          const events = await api.claims.getTimeline(claimId);
          setTimelineEvents(events);
        } catch (error) {
          console.error('Error fetching claim details:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchData();
  }, [open, claimId]);
  
  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // Handle form field changes
  const handleChange = (field: keyof UpdateClaimInput) => (
    event: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };
  
  // Handle save
  const handleSave = async () => {
    if (!claim) return;
    
    setSaving(true);
    try {
      const updatedClaim = await api.claims.update(claim.id, formData);
      setClaim(updatedClaim);
      onUpdate(updatedClaim);
      setEditMode(false);
      
      // Add timeline event for the update
      await api.claims.addTimelineEvent(claim.id, {
        eventType: 'UPDATE',
        description: 'Claim details updated'
      });
      
      // Refresh timeline
      const events = await api.claims.getTimeline(claim.id);
      setTimelineEvents(events);
    } catch (error) {
      console.error('Error updating claim:', error);
    } finally {
      setSaving(false);
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
  
  // Format time
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  if (!open) return null;
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="claim-detail-dialog-title"
    >
      <DialogTitle id="claim-detail-dialog-title">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            {loading ? 'Loading Claim Details...' : `Claim #${claim?.claimNumber}`}
          </Typography>
          <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : claim ? (
          <>
            {/* Claim Header */}
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <Typography variant="h5">{claim.clientBusinessName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    EIN: {claim.clientEIN}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} sx={{ textAlign: 'right' }}>
                  <Chip 
                    label={claim.status.replace(/_/g, ' ')} 
                    color={
                      claim.status === ClaimStatus.APPROVED || claim.status === ClaimStatus.PARTIALLY_APPROVED
                        ? 'success'
                        : claim.status === ClaimStatus.REJECTED
                        ? 'error'
                        : claim.status === ClaimStatus.ADDITIONAL_INFO_NEEDED || claim.status === ClaimStatus.APPEALED
                        ? 'warning'
                        : 'primary'
                    }
                    sx={{ mr: 1 }}
                  />
                  <Chip 
                    label={claim.priority} 
                    color={
                      claim.priority === ClaimPriority.URGENT
                        ? 'error'
                        : claim.priority === ClaimPriority.HIGH
                        ? 'warning'
                        : claim.priority === ClaimPriority.MEDIUM
                        ? 'info'
                        : 'success'
                    }
                  />
                </Grid>
              </Grid>
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="claim detail tabs">
                <Tab label="Details" id="claim-tab-0" aria-controls="claim-tabpanel-0" />
                <Tab label="Timeline" id="claim-tab-1" aria-controls="claim-tabpanel-1" />
                <Tab label="Documents" id="claim-tab-2" aria-controls="claim-tabpanel-2" />
              </Tabs>
            </Box>
            
            {/* Details Tab */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                {editMode ? (
                  <>
                    <Button 
                      variant="outlined" 
                      onClick={() => setEditMode(false)} 
                      sx={{ mr: 1 }}
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={handleSave}
                      disabled={saving}
                    >
                      {saving ? <CircularProgress size={24} /> : 'Save Changes'}
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => setEditMode(true)}
                  >
                    Edit Claim
                  </Button>
                )}
              </Box>
              
              <Grid container spacing={3}>
                {/* Claim Information */}
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                      Claim Information
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        {editMode ? (
                          <TextField
                            select
                            fullWidth
                            label="Claim Type"
                            value={formData.claimType || claim.claimType}
                            onChange={handleChange('claimType')}
                            margin="normal"
                          >
                            {Object.values(ClaimType).map((type) => (
                              <MenuItem key={type} value={type}>
                                {type.replace(/_/g, ' ')}
                              </MenuItem>
                            ))}
                          </TextField>
                        ) : (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                              Claim Type
                            </Typography>
                            <Typography variant="body1">
                              {claim.claimType.replace(/_/g, ' ')}
                            </Typography>
                          </Box>
                        )}
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        {editMode ? (
                          <TextField
                            select
                            fullWidth
                            label="Status"
                            value={formData.status || claim.status}
                            onChange={handleChange('status')}
                            margin="normal"
                          >
                            {Object.values(ClaimStatus).map((status) => (
                              <MenuItem key={status} value={status}>
                                {status.replace(/_/g, ' ')}
                              </MenuItem>
                            ))}
                          </TextField>
                        ) : (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                              Status
                            </Typography>
                            <Typography variant="body1">
                              {claim.status.replace(/_/g, ' ')}
                            </Typography>
                          </Box>
                        )}
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        {editMode ? (
                          <TextField
                            select
                            fullWidth
                            label="Priority"
                            value={formData.priority || claim.priority}
                            onChange={handleChange('priority')}
                            margin="normal"
                          >
                            {Object.values(ClaimPriority).map((priority) => (
                              <MenuItem key={priority} value={priority}>
                                {priority}
                              </MenuItem>
                            ))}
                          </TextField>
                        ) : (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                              Priority
                            </Typography>
                            <Typography variant="body1">
                              {claim.priority}
                            </Typography>
                          </Box>
                        )}
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            Submission Date
                          </Typography>
                          <Typography variant="body1">
                            {formatDate(claim.submissionDate)}
                          </Typography>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            Tax Year
                          </Typography>
                          <Typography variant="body1">
                            {claim.taxYear}
                          </Typography>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        {editMode ? (
                          <TextField
                            fullWidth
                            label="Claim Amount"
                            type="number"
                            value={formData.claimAmount || claim.claimAmount}
                            onChange={handleChange('claimAmount')}
                            margin="normal"
                            InputProps={{
                              startAdornment: <MoneyIcon sx={{ mr: 1, color: 'text.secondary' }} />
                            }}
                          />
                        ) : (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                              Claim Amount
                            </Typography>
                            <Typography variant="body1">
                              {formatCurrency(claim.claimAmount)}
                            </Typography>
                          </Box>
                        )}
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        {editMode ? (
                          <TextField
                            fullWidth
                            label="Approved Amount"
                            type="number"
                            value={formData.approvedAmount || claim.approvedAmount || ''}
                            onChange={handleChange('approvedAmount')}
                            margin="normal"
                            InputProps={{
                              startAdornment: <MoneyIcon sx={{ mr: 1, color: 'text.secondary' }} />
                            }}
                          />
                        ) : (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                              Approved Amount
                            </Typography>
                            <Typography variant="body1">
                              {claim.approvedAmount ? formatCurrency(claim.approvedAmount) : 'N/A'}
                            </Typography>
                          </Box>
                        )}
                      </Grid>
                      
                      <Grid item xs={12}>
                        {editMode ? (
                          <TextField
                            fullWidth
                            label="Expected Completion Date"
                            type="date"
                            value={formData.expectedCompletionDate ? new Date(formData.expectedCompletionDate).toISOString().split('T')[0] : ''}
                            onChange={handleChange('expectedCompletionDate')}
                            margin="normal"
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        ) : (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                              Expected Completion Date
                            </Typography>
                            <Typography variant="body1">
                              {claim.expectedCompletionDate ? formatDate(claim.expectedCompletionDate) : 'Not set'}
                            </Typography>
                          </Box>
                        )}
                      </Grid>
                      
                      {claim.status === ClaimStatus.REJECTED && (
                        <Grid item xs={12}>
                          {editMode ? (
                            <TextField
                              fullWidth
                              label="Rejection Reason"
                              multiline
                              rows={3}
                              value={formData.rejectionReason || claim.rejectionReason || ''}
                              onChange={handleChange('rejectionReason')}
                              margin="normal"
                            />
                          ) : (
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="body2" color="text.secondary">
                                Rejection Reason
                              </Typography>
                              <Typography variant="body1">
                                {claim.rejectionReason || 'No reason provided'}
                              </Typography>
                            </Box>
                          )}
                        </Grid>
                      )}
                    </Grid>
                  </Paper>
                </Grid>
                
                {/* Client Information */}
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                      Client Information
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Business Name
                      </Typography>
                      <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                        <BusinessIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        {claim.clientBusinessName}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        EIN
                      </Typography>
                      <Typography variant="body1">
                        {claim.clientEIN}
                      </Typography>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="subtitle1" gutterBottom>
                      Contact Information
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        {editMode ? (
                          <TextField
                            fullWidth
                            label="Contact Name"
                            value={formData.clientContactName || claim.clientContactName}
                            onChange={handleChange('clientContactName')}
                            margin="normal"
                            InputProps={{
                              startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                            }}
                          />
                        ) : (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                              Contact Name
                            </Typography>
                            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                              <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                              {claim.clientContactName}
                            </Typography>
                          </Box>
                        )}
                      </Grid>
                      
                      <Grid item xs={12}>
                        {editMode ? (
                          <TextField
                            fullWidth
                            label="Contact Email"
                            type="email"
                            value={formData.clientContactEmail || claim.clientContactEmail}
                            onChange={handleChange('clientContactEmail')}
                            margin="normal"
                            InputProps={{
                              startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                            }}
                          />
                        ) : (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                              Contact Email
                            </Typography>
                            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                              <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                              {claim.clientContactEmail}
                            </Typography>
                          </Box>
                        )}
                      </Grid>
                      
                      <Grid item xs={12}>
                        {editMode ? (
                          <TextField
                            fullWidth
                            label="Contact Phone"
                            value={formData.clientContactPhone || claim.clientContactPhone || ''}
                            onChange={handleChange('clientContactPhone')}
                            margin="normal"
                            InputProps={{
                              startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                            }}
                          />
                        ) : (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                              Contact Phone
                            </Typography>
                            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                              <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                              {claim.clientContactPhone || 'Not provided'}
                            </Typography>
                          </Box>
                        )}
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
                
                {/* Notes */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Notes
                    </Typography>
                    
                    {editMode ? (
                      <TextField
                        fullWidth
                        label="Notes"
                        multiline
                        rows={4}
                        value={formData.notes || claim.notes || ''}
                        onChange={handleChange('notes')}
                        margin="normal"
                      />
                    ) : (
                      <Typography variant="body1">
                        {claim.notes || 'No notes available for this claim.'}
                      </Typography>
                    )}
                  </Paper>
                </Grid>
              </Grid>
            </TabPanel>
            
            {/* Timeline Tab */}
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<AddIcon />}
                  onClick={() => {
                    // TODO: Implement adding timeline event
                  }}
                >
                  Add Event
                </Button>
              </Box>
              
              {timelineEvents.length === 0 ? (
                <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
                  No timeline events available for this claim.
                </Typography>
              ) : (
                <List>
                  {timelineEvents.map((event) => (
                    <React.Fragment key={event.id}>
                      <ListItem alignItems="flex-start">
                        <ListItemIcon>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            <EventIcon />
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="subtitle1">
                                {event.eventType}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {formatDate(event.timestamp)} at {formatTime(event.timestamp)}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <>
                              <Typography variant="body2" color="text.primary">
                                {event.description}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                By: {event.userName}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </React.Fragment>
                  ))}
                </List>
              )}
            </TabPanel>
            
            {/* Documents Tab */}
            <TabPanel value={tabValue} index={2}>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<AddIcon />}
                  onClick={() => {
                    // TODO: Implement document upload
                  }}
                >
                  Upload Document
                </Button>
              </Box>
              
              {!claim.documents || claim.documents.length === 0 ? (
                <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
                  No documents available for this claim.
                </Typography>
              ) : (
                <List>
                  {/* TODO: Implement document list */}
                  <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
                    Document list will be implemented here.
                  </Typography>
                </List>
              )}
            </TabPanel>
          </>
        ) : (
          <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
            Claim not found or an error occurred.
          </Typography>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClaimDetailDialog; 