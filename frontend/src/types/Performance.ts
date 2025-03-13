// Firm performance interface
export interface FirmPerformance {
  id: string;
  name: string;
  totalClaims: number;
  successfulClaims: number;
  pendingClaims: number;
  rejectedClaims: number;
  successRate: number;
  averageClaimValue: number;
  averageProcessingTime: number; // in days
  totalRevenue: number;
  clientSatisfactionScore: number; // 0-100
  lastUpdated: string;
}

// CPA performance interface
export interface CPAPerformance {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  totalClaims: number;
  successfulClaims: number;
  pendingClaims: number;
  rejectedClaims: number;
  successRate: number;
  averageClaimValue: number;
  averageProcessingTime: number; // in days
  totalRevenue: number;
  clientSatisfactionScore: number; // 0-100
  lastUpdated: string;
  specialties: string[];
}

// Monthly statistics interface
export interface MonthlyStats {
  month: string; // YYYY-MM format
  totalClaims: number;
  successfulClaims: number;
  pendingClaims: number;
  rejectedClaims: number;
  successRate: number;
  revenue: number;
}

// Performance metrics interface (for dashboard widgets)
export interface PerformanceMetrics {
  totalClaims: number;
  successRate: number;
  averageClaimValue: number;
  totalRevenue: number;
  pendingClaims: number;
  averageProcessingTime: number;
}

// Performance comparison interface (for comparing firms or CPAs)
export interface PerformanceComparison {
  id: string;
  name: string; // Firm name or CPA full name
  successRate: number;
  totalClaims: number;
  averageClaimValue: number;
  clientSatisfactionScore: number;
}

// Performance trend interface (for trend charts)
export interface PerformanceTrend {
  period: string; // Month or quarter
  successRate: number;
  totalClaims: number;
  revenue: number;
} 