# localStorage API for Node.js

Follows webstorage specification: http://www.w3.org/TR/webstorage/.
Will write to persistent storage upon Node process exit.

## Usage

```javascript
var Storage = require('localStorage').Storage;
var localStorage = new Storage("localStorage.dat");
localStorage.foo = "bar";
localStorage.setItem("abc", "xyz");
```

For just in-memory storage, call the Storage constructor without a filename.