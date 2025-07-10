// EMERGENCY STOP SCRIPT
// Run this in browser console to immediately stop the infinite loop

console.log('🚨 EMERGENCY STOP ACTIVATED');

// 1. Block all fetch requests temporarily
if (window.fetch) {
  const originalFetch = window.fetch;
  let blockedCount = 0;
  
  window.fetch = function(...args) {
    const url = args[0];
    
    // Block dashboard and users/me requests that are causing the loop
    if (url.includes('/dashboard') || url.includes('/api/users/me')) {
      blockedCount++;
      console.warn(`🚫 BLOCKED request #${blockedCount}: ${url}`);
      
      // Return fake successful response
      return Promise.resolve(new Response(JSON.stringify({
        user: { id: 'temp', name: 'Emergency User', email: 'temp@temp.com', role: 'admin' },
        token: 'emergency-token'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }));
    }
    
    return originalFetch.apply(this, args);
  };
  
  console.log('✅ Emergency fetch blocker installed');
}

// 2. Clear all localStorage to break the loop
try {
  localStorage.clear();
  console.log('✅ localStorage cleared');
} catch (e) {
  console.warn('Could not clear localStorage:', e);
}

// 3. Disable scroll events
window.addEventListener = function(type, listener, options) {
  if (type === 'scroll') {
    console.log('🚫 Blocked scroll listener');
    return;
  }
  return EventTarget.prototype.addEventListener.call(this, type, listener, options);
};

// 4. Stop all intervals and timeouts
let highestTimeoutId = setTimeout(';');
for (let i = 0; i < highestTimeoutId; i++) {
  clearTimeout(i);
}

let highestIntervalId = setInterval(';');
for (let i = 0; i < highestIntervalId; i++) {
  clearInterval(i);
}

console.log('✅ Cleared all timers');

// 5. Emergency monitor
window.emergencyStop = {
  blockedRequests: 0,
  
  getStats: function() {
    return {
      blockedRequests: blockedCount,
      status: 'EMERGENCY MODE ACTIVE'
    };
  },
  
  restore: function() {
    if (originalFetch) {
      window.fetch = originalFetch;
      console.log('🔄 Normal fetch restored');
    }
  },
  
  hardReload: function() {
    window.location.reload(true);
  }
};

console.log('🛑 EMERGENCY STOP COMPLETE');
console.log('📊 Use window.emergencyStop.getStats() to check status');
console.log('🔄 Use window.emergencyStop.restore() to restore normal operation');
console.log('🔄 Use window.emergencyStop.hardReload() to force reload');

// Auto-report every 5 seconds
setInterval(() => {
  console.log('🚨 Emergency mode active - blocked requests:', blockedCount);
}, 5000);
