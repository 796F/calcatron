var AppView = require('./AppView');
var Engine  = require('famous/core/Engine');

// load css
require('./styles');
// Load polyfills
// require('famous-polyfills');

var mainContext = Engine.createContext();
mainContext.setPerspective(1200);

var app = new AppView();

mainContext.add(app);
