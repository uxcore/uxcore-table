/**
 * only require other specs here
 */

 const req = require.context('.', false, /\.spec\.js$/);
 req.keys().forEach(req);