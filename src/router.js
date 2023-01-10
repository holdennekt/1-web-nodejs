import { fileURLToPath, pathToFileURL } from "url";
import * as path from "path";
import { readdir } from "fs/promises";

const notImplemented = (req, res) => {
  res.statusCode = 501;
  res.json({ err: "Not Implemented" });
};

function methodNotAllowed(req, res) {
  res.statusCode = 405;
  res.json({ err: "Method Not Allowed" });
}

class MyRouter {
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

  getHandlerAndParams(urlPathname, method) {
    const params = {};
    const treePath = urlPathname.split("/").filter((val) => val !== "");
    let treeNode = this.tree;
    for (const node of treePath) {
      if (!treeNode.children[node]) {
        let dynamicUrlParameterName, dynamicUrlParameterNode;
        for (const childKey in treeNode.children) {
          if (treeNode.children[childKey].isDynamicUrlParameter) {
            dynamicUrlParameterName = childKey;
            dynamicUrlParameterNode = treeNode.children[childKey];
          }
        }
        if (!dynamicUrlParameterNode)
          return { handler: notImplemented, params };
        treeNode = dynamicUrlParameterNode;
        params[dynamicUrlParameterName] = node;
      } else treeNode = treeNode.children[node];
    }
    return { handler: treeNode.handlers[method] || methodNotAllowed, params };
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routesDir = path.join(__dirname, "routes");

const router = new MyRouter(routesDir);
await router.loadRoutes(path.sep, "");

export default router;
