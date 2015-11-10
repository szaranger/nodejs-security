'use strict';

var failedIPs = {},
  TEN_MINS = 600000,
  THIRTY_MINS = 3 * TEN_MINS;;

function tryToLogin() {
    var failed = failedIPs[remoteIp];
    if (failed && Date.now() < failed.nextAttemptTime) {
        return res.error(); // Throttled. Can't try yet.
    } else {
      // Otherwise do login
    }
}

function onLoginFail() {
    var failed = failedIPs[remoteIp] = failedIPs[remoteIp] ||
      {
        count: 0,
        nextAttemptTime: new Date()
      };

    ++failed.count;
    // Wait another two seconds for every failed attempt
    failed.nextAttemptTime.setTime(Date.now() + 2000 * failed.count);
}

function onLoginSuccess() {
  delete failedIPs[remoteIp];
}

// Clean up people that have given up
setInterval(function() {
    for (var ip in failedIPs) {
        if (Date.now() - failedIPs[ip].nextAttemptTime > TEN_MINS) {
            delete failedIPs[ip];
        }
    }
}, THIRTY_MINS);
