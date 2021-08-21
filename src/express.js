import http from "http";

const response = {
  // These methods will be added to http's res object
  // response.send method that just calls res.write
  send: function (content) {
    this.__proto__.write(content); //
  }
};

const request = {}; // These methods will be added to http's req object

class Express {
  constructor() {
    this.routes = {}; // Saving all routes with http verbs as key
  }

  get(path, callback) {
    if (!this.routes["GET"]) {
      // checking if there are any GET routes configured already

      this.routes["GET"] = {}; // if not, add an object to add routes and callbacks to run when hitting these routes
    }

    this.routes["GET"][path] = function (req, res) {
      // Saving the path and the callback every time app.get is called

      Object.setPrototypeOf(request, req);
      // This should response object to access req's methods and properties

      Object.setPrototypeOf(response, res); // same for response object

      callback(request, response); // call the callback attached to this route with my request and response objects
      res.end(); // end the connection
    };
  }

  listen(port, cb) {
    //creates a server and starts listening for requests
    // The callback passed runs on every http request

    this.server = http.createServer((req, res) => {
      const httpMethod = req.method; // requested http Verb/action
      const path = req.url; // requested path

      // if method in routes and if path in method
      if (this.routes[httpMethod] && this.routes[httpMethod][path]) {
        const callbackForThisRoute = this.routes[httpMethod][path]; // get callback attached to this path
        callbackForThisRoute(req, res); // execute the callback with http's req and res
      } else {
        res.write("no page found");
        res.end();
      }
    });
    this.server.listen(port, cb);
  }
}

export default function createExpressServer() {
  const app = new Express();
  return app;
}
