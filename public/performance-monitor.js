// Performance Monitor - Load this in browser console
(function() {
  'use strict';
  
  let apiCallCount = 0;
  let renderCount = 0;
  let scrollCount = 0;
  let startTime = Date.now();
  
  // Track API calls
  if (window.fetch) {
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
      apiCallCount++;
      const url = args[0];
      
      // Only log RSC calls and actual API calls
      if (url.includes('_rsc=') || url.includes('/api/')) {
        console.log(`📡 API Call #${apiCallCount}: ${url}`);
        
        // Warn about excessive RSC calls
        if (url.includes('_rsc=') && apiCallCount > 5) {
          console.warn(`⚠️ Excessive RSC calls detected! Count: ${apiCallCount}`);
        }
      }
      
      return originalFetch.apply(this, args);
    };
  }
  
  // Track React renders (if React DevTools is available)
  if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    const hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
    const originalOnCommitFiberRoot = hook.onCommitFiberRoot;
    
    hook.onCommitFiberRoot = function(id, root, priorityLevel) {
      renderCount++;
      if (renderCount % 10 === 0) {
        console.log(`🔄 React render #${renderCount}`);
      }
      
      if (originalOnCommitFiberRoot) {
        return originalOnCommitFiberRoot.call(this, id, root, priorityLevel);
      }
    };
  }
  
  // Track scroll events
  let scrollTimeout;
  window.addEventListener('scroll', function() {
    scrollCount++;
    
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      if (scrollCount % 5 === 0) {
        console.log(`📜 Scroll event #${scrollCount}`);
      }
    }, 100);
  }, { passive: true });
  
  // Performance monitor object
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
    
    startAutoLogging: function(intervalMs = 10000) {
      this.stopAutoLogging();
      this._autoLogInterval = setInterval(() => {
        this.logStats();
      }, intervalMs);
      console.log(`📊 Auto-logging started (every ${intervalMs}ms)`);
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
})();
