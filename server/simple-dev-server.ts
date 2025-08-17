import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes.js";
import path from "path";
import fs from "fs";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      console.log(`${req.method} ${path} ${res.statusCode} in ${duration}ms`);
    }
  });
  
  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    console.error(err);
  });

  // Serve built client files from dist/public directory
  const clientDistPath = path.resolve(import.meta.dirname, "..", "dist", "public");
  const clientBuildPath = path.resolve(import.meta.dirname, "..", "client", "dist");
  
  // Check which build directory exists
  let staticPath = clientDistPath;
  if (!fs.existsSync(clientDistPath) && fs.existsSync(clientBuildPath)) {
    staticPath = clientBuildPath;
  }
  
  if (fs.existsSync(staticPath)) {
    app.use(express.static(staticPath, {
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.js') || filePath.endsWith('.mjs')) {
          res.set('Content-Type', 'text/javascript');
        }
      }
    }));
    
    // Catch all route for client-side routing - serve built index.html
    app.use("*", (_req, res) => {
      const indexPath = path.join(staticPath, "index.html");
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send("Built client files not found. Please build the client first.");
      }
    });
  } else {
    app.use("*", (_req, res) => {
      res.status(500).send("Client not built. Please run: npm run build from the client directory.");
    });
  }

  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    console.log(`Simple dev server running on port ${port}`);
  });
})();