'use client';
import { useEffect } from 'react';
import Script from 'next/script';

export default function PerformanceMonitor() {
  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV !== 'development') return;

    // Inject performance monitoring
    const script = document.createElement('script');
    script.innerHTML = `
      (function() {
        'use strict';
        
        let apiCallCount = 0;
        let renderCount = 0;
        let scrollCount = 0;
        let startTime = Date.now();
        
        // Track API calls
        if (window.fetch && !window._fetchMonitorInstalled) {
          window._fetchMonitorInstalled = true;
          const originalFetch = window.fetch;
          window.fetch = function(...args) {
            apiCallCount++;
            const url = args[0];
            
            // Only log RSC calls and actual API calls
            if (url.includes('_rsc=') || url.includes('/api/')) {
              console.log(\`📡 API Call #\${apiCallCount}: \${url}\`);
              
              // Warn about excessive RSC calls
              if (url.includes('_rsc=') && apiCallCount > 5) {
                console.warn(\`⚠️ Excessive RSC calls detected! Count: \${apiCallCount}\`);
              }
            }
            
            return originalFetch.apply(this, args);
          };
        }
        
        // Track React renders (if React DevTools is available)
        if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__ && !window._renderMonitorInstalled) {
          window._renderMonitorInstalled = true;
          const hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
          const originalOnCommitFiberRoot = hook.onCommitFiberRoot;
          
          hook.onCommitFiberRoot = function(id, root, priorityLevel) {
            renderCount++;
            if (renderCount % 10 === 0) {
              console.log(\`🔄 React render #\${renderCount}\`);
            }
            
            if (originalOnCommitFiberRoot) {
              return originalOnCommitFiberRoot.call(this, id, root, priorityLevel);
            }
          };
        }
        
        // Track scroll events
        if (!window._scrollMonitorInstalled) {
          window._scrollMonitorInstalled = true;
          let scrollTimeout;
          window.addEventListener('scroll', function() {
            scrollCount++;
            
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
              if (scrollCount % 5 === 0) {
                console.log(\`📜 Scroll event #\${scrollCount}\`);
              }
            }, 100);
          }, { passive: true });
        }
        
        // Performance monitor object
        if (!window.performanceMonitor) {
          window.performanceMonitor = {
            getStats: function() {
              const uptime = Math.round((Date.now() - startTime) / 1000);
              return {
                apiCalls: apiCallCount,
                renders: renderCount,
                scrolls: scrollCount,
                uptime: uptime,
                apiCallsPerMinute: uptime > 0 ? Math.round((apiCallCount / uptime) * 60) : 0,
                rendersPerMinute: uptime > 0 ? Math.round((renderCount / uptime) * 60) : 0,
              };
            },
            
            reset: function() {
              apiCallCount = 0;
              renderCount = 0;
              scrollCount = 0;
              startTime = Date.now();
              console.log('🔄 Performance monitor reset');
            },
            
            logStats: function() {
              const stats = this.getStats();
              console.table(stats);
              
              // Warnings
              if (stats.apiCalls > 20) {
                console.warn('⚠️ HIGH API CALL COUNT - Check for useEffect loops!');
              }
              if (stats.renders > 50) {
                console.warn('⚠️ HIGH RENDER COUNT - Check for unnecessary re-renders!');
              }
              if (stats.apiCallsPerMinute > 30) {
                console.warn('⚠️ HIGH API CALL RATE - Possible performance issue!');
              }
            },
            
            startAutoLogging: function(intervalMs = 15000) {
              this.stopAutoLogging();
              this._autoLogInterval = setInterval(() => {
                this.logStats();
              }, intervalMs);
              console.log(\`📊 Auto-logging started (every \${intervalMs}ms)\`);
            },
            
            stopAutoLogging: function() {
              if (this._autoLogInterval) {
                clearInterval(this._autoLogInterval);
                this._autoLogInterval = null;
                console.log('📊 Auto-logging stopped');
              }
            }
          };
          
          // Auto-start logging
          window.performanceMonitor.startAutoLogging();
          
          console.log('🚀 Performance Monitor loaded! Use window.performanceMonitor.getStats()');
        }
      })();
    `;
    
    document.head.appendChild(script);
    
    return () => {
      // Cleanup on unmount
      if (typeof window !== 'undefined' && (window as any).performanceMonitor) {
        (window as any).performanceMonitor.stopAutoLogging();
      }
    };
  }, []);

  // Only render in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return null;
}
