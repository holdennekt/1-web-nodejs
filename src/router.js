import { fileURLToPath, pathToFileURL } from "url";
import * as path from "path";
import { readdir } from "fs/promises";

export const HttpMethod = {
  GET: "GET",
  HEAD: "HEAD",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  CONNECT: "CONNECT",
  OPTIONS: "OPTIONS",
  TRACE: "TRACE",
  PATCH: "PATCH",
}

const notImplemented = (req, res) => {
  res.statusCode = 501;
  res.json({ err: "Not Implemented" });
};

function methodNotAllowed(req, res) {
  res.statusCode = 405;
  res.json({ err: "Method Not Allowed" });
}

class MyRouter {
  tree;
  routesDir;

  constructor(routesDir) {
    this.tree = this._getDefaultHandlers();
    this.routesDir = routesDir;
  }

  _getDefaultHandlers() {
    return {
      handlers: {},
      children: {},
    };
  }

  _defineHandlers(relativePath, moduleDefault) {
    const treePath = relativePath.split(path.sep).filter((val) => val !== "");
    let treeNode = this.tree;
    for (const node of treePath) {
      if (!treeNode.children[node]) {
        treeNode.children[node] = this._getDefaultHandlers();
      }
      treeNode = treeNode.children[node];
    }
    Object.assign(treeNode.handlers, moduleDefault.handlers);
    if (moduleDefault.isDynamicURLParameter) {
      treeNode.isDynamicUrlParameter = moduleDefault.isDynamicURLParameter;
    }
  }

  async loadRoutes(basePath, dirName) {
    const relativePath = path.join(basePath, dirName);
    const workDir = path.join(this.routesDir, relativePath);

    const dir = await readdir(workDir, { withFileTypes: true });
    for (const dirEntry of dir) {
      if (dirEntry.isDirectory()) {
        await this.loadRoutes(relativePath, dirEntry.name);
      }
      if (dirEntry.isFile() && dirEntry.name === "index.js") {
        const modulePath = pathToFileURL(path.join(workDir, dirEntry.name));
        const module = await import(modulePath.href);
        this._defineHandlers(relativePath, module.default);
      }
    }
  }

  getHandler(urlPathname, method) {
    const treePath = urlPathname.split("/").filter((val) => val !== "");
    let treeNode = this.tree;
    for (const node of treePath) {
      if (!treeNode.children[node]) {
        let dynamicUrlParameterNode;
        for (const childKey in treeNode.children) {
          if (treeNode.children[childKey].isDynamicUrlParameter) {
            dynamicUrlParameterNode = treeNode.children[childKey];
          }
        }
        if (!dynamicUrlParameterNode) return notImplemented;
        treeNode = dynamicUrlParameterNode;
      } else treeNode = treeNode.children[node];
    }
    return treeNode.handlers[method] || methodNotAllowed;
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routesDir = path.join(__dirname, "routes");

const router = new MyRouter(routesDir);
await router.loadRoutes(path.sep, "");

export default router;
