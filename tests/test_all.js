// tests/test_all.js

// This file just pulls in all the other test files.
// Each test file runs its own tests when required.
console.log('Commence tests of all test files.');

require('./test_globals.js');
require('./test_blackhole.js');
require('./test_checkpoint.js');
//require('./test_editor.js');

console.log('All tests from all files have been run.');
