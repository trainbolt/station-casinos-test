import path from "path";
import express from "express";
import bodyParser from "body-parser";
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import axios from "axios";
import "babel-polyfill";

// Webpack Config
import config from "../../webpack.config.js";

// App Routes
import users from "./routes/users";

// Create APP
const app = express(),
  DIST_DIR = __dirname,
  HTML_FILE = path.join(DIST_DIR, "index.html"),
  PORT = process.env.PORT || 8080,
  compiler = webpack(config);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Allows outputting files etc.
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
  })
);

// Include routes to APP
app.get("/api/users", users.getUsers);
app.get("/api/users/:id", users.getUser);

// Our main index.html file
app.get("*", (req, res, next) => {
  compiler.outputFileSystem.readFile(HTML_FILE, (err, result) => {
    if (err) {
      // should redirect to a 404 page
      res.status(404).end();
    }
    res.set("content-type", "text/html");
    res.status(200);
    res.send(result);
    res.end();
  });
});

app.listen(PORT, () => {
  console.log(`App listening to ${PORT}....`);
  console.log("Press Ctrl+C to quit.");
});

// Export app server for testing
export default app;
