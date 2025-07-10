// Performance monitoring script to track API calls and re-renders
// Add this to your browser console to monitor performance issues

(function() {
  console.log('🔍 PERFORMANCE MONITOR STARTED');
  
  let apiCallCount = 0;
  let renderCount = 0;
  let scrollCount = 0;
  
  // Monitor fetch calls
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    apiCallCount++;
    const url = args[0];
    console.log(`📡 API Call #${apiCallCount}: ${url}`);
    
    // Track stack trace for debugging
    if (apiCallCount > 5) {
      console.warn('⚠️ High API call count detected!');
      console.trace('API call stack trace:');
    }
    
    return originalFetch.apply(this, args);
  };
  
  // Monitor scroll events
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    scrollCount++;
    
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      console.log(`📜 Scroll event #${scrollCount} - API calls so far: ${apiCallCount}`);
    }, 100);
  });
  
  // Monitor React re-renders (if React DevTools is available)
  if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    const hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
    hook.onCommitFiberRoot = (id, root, priorityLevel) => {
      renderCount++;
      if (renderCount % 10 === 0) {
        console.log(`🔄 React render #${renderCount}`);
      }
    };
  }
  
  // Performance summary every 10 seconds
  setInterval(() => {
    console.log(`
📊 PERFORMANCE SUMMARY:
   📡 API Calls: ${apiCallCount}
   🔄 React Renders: ${renderCount}
   📜 Scroll Events: ${scrollCount}
   
   ${apiCallCount > 10 ? '⚠️ HIGH API CALL COUNT - Check for useEffect loops!' : '✅ API calls look normal'}
   ${renderCount > 50 ? '⚠️ HIGH RENDER COUNT - Check for unnecessary re-renders!' : '✅ Render count looks normal'}
    `);
  }, 10000);
  
  // Reset counters
  window.resetPerformanceCounters = () => {
    apiCallCount = 0;
    renderCount = 0;
    scrollCount = 0;
    console.log('🔄 Performance counters reset');
  };
  
  console.log('✅ Performance monitor active. Use resetPerformanceCounters() to reset.');
})();
