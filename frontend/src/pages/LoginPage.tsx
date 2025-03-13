import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  Link, 
  Alert,
  CircularProgress
} from '@mui/material';
import { Auth } from 'aws-amplify';

// Define the user roles
enum UserRole {
  AGENT = 'agent',
  ADMIN = 'admin',
  FIRM = 'firm'
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = await Auth.signIn(email, password);
      
      // Check user role from Cognito attributes
      const userRole = user.attributes['custom:role'] || UserRole.AGENT;
      
      // Redirect based on role
      if (userRole === UserRole.FIRM) {
        navigate('/firm-portal');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Handle forgot password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await Auth.forgotPassword(resetEmail);
      setShowForgotPassword(true);
      setError(null);
    } catch (err: any) {
      console.error('Forgot password error:', err);
      setError(err.message || 'Failed to send reset code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle password reset
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await Auth.forgotPasswordSubmit(resetEmail, resetCode, newPassword);
      setResetSuccess(true);
      setShowForgotPassword(false);
      setError(null);
    } catch (err: any) {
      console.error('Reset password error:', err);
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4" sx={{ mb: 3 }}>
          Claim Connectors CRM
        </Typography>
        
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          {resetSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Password reset successful! You can now login with your new password.
            </Alert>
          )}
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {!showForgotPassword ? (
            <Box component="form" onSubmit={handleLogin} noValidate>
              <Typography component="h2" variant="h5" align="center" sx={{ mb: 3 }}>
                Sign In
              </Typography>
              
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Sign In'}
              </Button>
              
              <Box sx={{ textAlign: 'center' }}>
                <Link 
                  href="#" 
                  variant="body2" 
                  onClick={(e) => {
                    e.preventDefault();
                    setResetEmail(email);
                    setShowForgotPassword(true);
                  }}
                >
                  Forgot password?
                </Link>
              </Box>
            </Box>
          ) : (
            <Box component="form" onSubmit={resetCode ? handleResetPassword : handleForgotPassword} noValidate>
              <Typography component="h2" variant="h5" align="center" sx={{ mb: 3 }}>
                Reset Password
              </Typography>
              
              <TextField
                margin="normal"
                required
                fullWidth
                id="reset-email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                disabled={!!resetCode}
              />
              
              {resetCode ? (
                <>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="reset-code"
                    label="Verification Code"
                    name="code"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                  />
                  
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="new-password"
                    label="New Password"
                    type="password"
                    id="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </>
              ) : null}
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} />
                ) : resetCode ? (
                  'Reset Password'
                ) : (
                  'Send Verification Code'
                )}
              </Button>
              
              <Box sx={{ textAlign: 'center' }}>
                <Link 
                  href="#" 
                  variant="body2" 
                  onClick={(e) => {
                    e.preventDefault();
                    setShowForgotPassword(false);
                    setResetCode('');
                    setNewPassword('');
                  }}
                >
                  Back to Sign In
                </Link>
              </Box>
            </Box>
          )}
        </Paper>
      </Box>
      
      <Box sx={{ mt: 8, mb: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Claim Connectors CRM. All rights reserved.
        </Typography>
      </Box>
    </Container>
  );
};

export default LoginPage; 