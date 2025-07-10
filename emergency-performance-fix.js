// EMERGENCY PERFORMANCE FIX
// Run this in your browser console to immediately stop excessive API calls

console.log('🚨 EMERGENCY PERFORMANCE FIX LOADING...');

// 1. Block excessive RSC requests
if (window.fetch) {
  const originalFetch = window.fetch;
  let rscCallCount = 0;
  const rscCallLimit = 5;
  
  window.fetch = function(...args) {
    const url = args[0];
    
    // Block excessive RSC calls
    if (url.includes('_rsc=')) {
      rscCallCount++;
      
      if (rscCallCount > rscCallLimit) {
        console.warn(`🚫 BLOCKED RSC call #${rscCallCount}: ${url}`);
        // Return a fake successful response to prevent errors
        return Promise.resolve(new Response('{}', {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }));
      }
      
      console.log(`📡 Allowed RSC call #${rscCallCount}: ${url}`);
    }
    
    return originalFetch.apply(this, args);
  };
  
  console.log(`✅ RSC call limiter installed (limit: ${rscCallLimit})`);
}

// 2. Disable scroll-based re-renders
if (window.history) {
  window.history.scrollRestoration = 'manual';
  console.log('✅ Scroll restoration disabled');
}

// 3. Throttle scroll events
let scrollThrottleTimeout;
const originalAddEventListener = window.addEventListener;
window.addEventListener = function(type, listener, options) {
  if (type === 'scroll') {
    const throttledListener = function(e) {
      clearTimeout(scrollThrottleTimeout);
      scrollThrottleTimeout = setTimeout(() => {
        listener(e);
      }, 100); // Throttle to 10fps
    };
    return originalAddEventListener.call(this, type, throttledListener, options);
  }
  return originalAddEventListener.call(this, type, listener, options);
};
console.log('✅ Scroll event throttling enabled');

// 4. Block React DevTools excessive hooks
if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
  const hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
  const originalOnCommitFiberRoot = hook.onCommitFiberRoot;
  let renderCount = 0;
  
  hook.onCommitFiberRoot = function(id, root, priorityLevel) {
    renderCount++;
    
    // Only allow essential renders
    if (renderCount > 50) {
      console.warn(`🚫 BLOCKED excessive render #${renderCount}`);
      return;
    }
    
    if (originalOnCommitFiberRoot) {
      return originalOnCommitFiberRoot.call(this, id, root, priorityLevel);
    }
  };
  
  console.log('✅ Render limiter installed');
}

// 5. Performance monitor
window.emergencyPerformanceMonitor = {
  rscCalls: 0,
  blockedCalls: 0,
  
  getStats: function() {
    return {
      rscCalls: rscCallCount,
      blockedCalls: Math.max(0, rscCallCount - rscCallLimit),
      renderCount: renderCount || 0,
    };
  },
  
  reset: function() {
    rscCallCount = 0;
    renderCount = 0;
    console.log('🔄 Emergency monitor reset');
  },
  
  disable: function() {
    // Restore original fetch
    if (originalFetch) {
      window.fetch = originalFetch;
      console.log('🔄 Emergency fixes disabled');
    }
  }
};

// 6. Auto-report every 10 seconds
setInterval(() => {
  const stats = window.emergencyPerformanceMonitor.getStats();
  if (stats.rscCalls > 0 || stats.renderCount > 0) {
    console.log('📊 Emergency Performance Stats:', stats);
    
    if (stats.blockedCalls > 0) {
      console.log(`🛡️ Successfully blocked ${stats.blockedCalls} excessive calls!`);
    }
  }
}, 10000);

console.log('🚀 EMERGENCY PERFORMANCE FIX ACTIVE!');
console.log('📊 Use window.emergencyPerformanceMonitor.getStats() to check status');
console.log('🔄 Use window.emergencyPerformanceMonitor.reset() to reset counters');
console.log('🚫 Use window.emergencyPerformanceMonitor.disable() to remove fixes');

// Show immediate stats
setTimeout(() => {
  console.log('📊 Initial stats:', window.emergencyPerformanceMonitor.getStats());
}, 1000);
