[![Build Status](https://travis-ci.org/rook2pawn/node-queuelib.svg?branch=master)](https://travis-ci.org/rook2pawn/node-queuelib)

# QueueLib

Throw it a function with either done Callback style or resolve promise style.

## Example

```js
const JobQueue = require("queuelib");
const jq = new JobQueue();
jq.enqueue((done) => {
  console.log("A");
  setTimeout(done, 2000);
});
jq.enqueue((done) => {
  return new Promise((resolve, reject) => {
    console.log("B");
    resolve();
  });
});
```

## Configuration

Configure the max active concurrent jobs. Defaults to 1.

```js
const jq = new JobQueue({ MAX_ACTIVE: 5 });
```

### License

MIT
Copyright 2011-2020 David Wee

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
