// Performance monitoring utility for development
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private apiCallCount = 0;
  private renderCount = 0;
  private startTime = Date.now();
  private isEnabled = process.env.NODE_ENV === 'development';

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  trackApiCall(url: string, method = 'GET') {
    if (!this.isEnabled) return;
    
    this.apiCallCount++;
    console.log(`📡 API Call #${this.apiCallCount}: ${method} ${url}`);
    
    // Warn if too many API calls
    if (this.apiCallCount > 10) {
      console.warn(`⚠️ High API call count detected: ${this.apiCallCount} calls`);
    }
  }

  trackRender(componentName: string) {
    if (!this.isEnabled) return;
    
    this.renderCount++;
    console.log(`🔄 Render #${this.renderCount}: ${componentName}`);
    
    // Warn if too many renders
    if (this.renderCount > 20) {
      console.warn(`⚠️ High render count detected: ${this.renderCount} renders`);
    }
  }

  getStats() {
    const uptime = Date.now() - this.startTime;
    return {
      apiCalls: this.apiCallCount,
      renders: this.renderCount,
      uptime: Math.round(uptime / 1000),
      apiCallsPerMinute: Math.round((this.apiCallCount / uptime) * 60000),
      rendersPerMinute: Math.round((this.renderCount / uptime) * 60000),
    };
  }

  reset() {
    this.apiCallCount = 0;
    this.renderCount = 0;
    this.startTime = Date.now();
    console.log('🔄 Performance monitor reset');
  }

  logStats() {
    if (!this.isEnabled) return;
    
    const stats = this.getStats();
    console.table(stats);
  }
}

// Hook to track component renders
export function useRenderTracker(componentName: string) {
  if (process.env.NODE_ENV === 'development') {
    const monitor = PerformanceMonitor.getInstance();
    monitor.trackRender(componentName);
  }
}

// Fetch wrapper to track API calls
export async function trackedFetch(url: string, options?: RequestInit) {
  const monitor = PerformanceMonitor.getInstance();
  monitor.trackApiCall(url, options?.method);
  
  return fetch(url, options);
}

// Development-only performance debugging
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Add global performance monitor
  (window as any).performanceMonitor = PerformanceMonitor.getInstance();
  
  // Log stats every 30 seconds
  setInterval(() => {
    PerformanceMonitor.getInstance().logStats();
  }, 30000);
}
