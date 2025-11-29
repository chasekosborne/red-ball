// tests/test_all.js

// This file just pulls in all the other test files.
// Each test file runs its own tests when required.
console.log('Commence tests of all test files.');

//================= Model ========================
console.log('----- Commenced tests of all model files.');

console.log('----- Commence tests of globals.js.');
require('./test_globals.js');
console.log('----- All global tests completed.');

console.log('----- Commence tests of levelManager.js.');
require('./test_levelManager.js');
console.log('----- All levelManager tests completed.');

console.log('----- Commence tests of player.js.');
require('./test_player.js');
console.log('----- All player.js tests completed.');

console.log('----- Completed tests of all model files.');

//================= View ========================
console.log('----- Commenced tests of all view files.');

console.log('----- Commence tests of drawArt.js.');
require('./test_drawArt.js');
console.log('----- All drawArt tests completed.');

console.log('----- Commence tests of musicManager.js.');
require('./test_musicManager.js');
console.log('----- All musicManager tests completed.');

console.log('----- Completed tests of all view files.');

//============== Controller ======================

console.log('----- Commenced tests of all controller files.');

console.log('----- Commence tests of blackhole.js.');
require('./test_blackhole.js');
console.log('----- All black hole tests completed.');

console.log('----- Commence tests of checkpoint.js');
require('./test_checkpoint.js');
console.log('----- All checkpoint tests completed.');

console.log('----- Commence tests of editor.js.');
require('./test_editor.js');
console.log('----- All editor tests completed.');

console.log('----- Commence tests of falling_asteriods.js.');
require('./test_falling_asteriods.js');
console.log('----- All asteroid tests completed.');

console.log('----- Commence tests of gamestate.js.');
require('./test_gamestate.js');
console.log('----- All game_state tests completed.');

console.log('----- Commence tests of laserbeam.js.');
require('./test_laserbeam.js');
console.log('----- All laserbeam tests completed.');

console.log('----- Commence tests of menu.js.');
require('./test_menu.js');
console.log('----- All menu tests completed.');

console.log('----- Commence tests of shrinkpad.js.');
require('./test_shrinkpad.js');
console.log('----- All shrinkpad tests completed.');

console.log('----- Commence tests of teleporter.js.');
require('./test_teleporter.js');
console.log('----- All teleporter tests completed.');

console.log('----- Commence tests of utils.js.');
require('./test_utils.js');
console.log('----- All utils tests completed.');

console.log('----- Completed tests of all controller files.');

//==============================================







console.log('All MVC tests from all files have been run.');
