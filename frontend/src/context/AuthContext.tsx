import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Auth } from 'aws-amplify';
import { CognitoUser } from '@aws-amplify/auth';

// Define user roles
export enum UserRole {
  AGENT = 'agent',
  ADMIN = 'admin',
  FIRM = 'firm'
}

// Define the user type
export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

// Define the auth context type
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<CognitoUser>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, code: string, newPassword: string) => Promise<void>;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Create the auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Check if user is authenticated
  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      const userAttributes = currentUser.attributes;
      
      // Create user object from Cognito attributes
      const userData: User = {
        id: userAttributes.sub,
        email: userAttributes.email,
        role: (userAttributes['custom:role'] as UserRole) || UserRole.AGENT,
        firstName: userAttributes.given_name,
        lastName: userAttributes.family_name,
        phoneNumber: userAttributes.phone_number
      };
      
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string): Promise<CognitoUser> => {
    const user = await Auth.signIn(email, password);
    await checkAuthStatus();
    return user;
  };

  // Logout function
  const logout = async (): Promise<void> => {
    await Auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Forgot password function
  const forgotPassword = async (email: string): Promise<void> => {
    await Auth.forgotPassword(email);
  };

  // Reset password function
  const resetPassword = async (email: string, code: string, newPassword: string): Promise<void> => {
    await Auth.forgotPasswordSubmit(email, code, newPassword);
  };

  // Auth context value
  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    forgotPassword,
    resetPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 