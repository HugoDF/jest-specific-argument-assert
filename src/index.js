const http = require('http');

const homepage = `<html>
<head>
<title>Example project for "Jest assert over single or specific argument/parameters with .toHaveBeenCalledWith and expect.anything()"</title>
</head>
<em>Example project for "Jest assert over single or specific argument/parameters with .toHaveBeenCalledWith and expect.anything()"</em>
<p>See the tests on GitHub: <a href="https://github.com/HugoDF/jest-specific-argument-assert/blob/master/src/pinger.test.js">https://github.com/HugoDF/jest-specific-argument-assert/blob/master/src/pinger.test.js</a></p>
<p>See the tests in codesandbox at <code>src/pinger.test.js</code> <a href="https://codesandbox.io/s/github/HugoDF/jest-specific-argument-assert/tree/master/">https://codesandbox.io/s/github/HugoDF/jest-specific-argument-assert/tree/master/</a></p>
<p>Read the post:</p>
</html>`;

http
  .createServer(function(req, res) {
    res.write(homepage); //write a response to the client
    res.end(); //end the response
  })
  .listen(8080); //the server object listens on port 8080
