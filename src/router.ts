import { fileURLToPath, pathToFileURL } from "url";
import * as path from "path";
import { readdir } from "fs/promises";
import { IncomingMessage, ServerResponse } from "http";
import { helpers } from "./utils";

export type MyServerResponse = ServerResponse & typeof helpers;
export enum HttpMethod {
  GET = "GET",
  HEAD = "HEAD",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  CONNECT = "CONNECT",
  OPTIONS = "OPTIONS",
  TRACE = "TRACE",
  PATCH = "PATCH",
}
export type RouteHandler = (
  req: IncomingMessage,
  res: MyServerResponse,
  url: URL,
  payload: any
) => void;

type TreeNode = {
  handlers: { [key in HttpMethod]: RouteHandler };
  children: { [key: string]: TreeNode };
  isDynamicUrlParameter?: boolean;
};

const notImplemented = (req: IncomingMessage, res: MyServerResponse) => {
  res.statusCode = 501;
  res.json({ err: "Not Implemented" });
};

function methodNotAllowed(req: IncomingMessage, res: MyServerResponse) {
  res.statusCode = 405;
  res.json({ err: "Method Not Allowed" });
}

class MyRouter {
  private tree: TreeNode;
  private routesDir: string;

  constructor(routesDir: string) {
    this.tree = this.getDefaultHandlers();
    this.routesDir = routesDir;
  }

  private getDefaultHandlers() {
    return {
      handlers: {} as { [key in HttpMethod]: RouteHandler },
      children: {},
    };
  }

  private defineHandlers(relativePath: string, moduleDefault: any) {
    const treePath = relativePath.split(path.sep).filter((val) => val !== "");
    let treeNode = this.tree;
    for (const node of treePath) {
      if (!treeNode.children[node]) {
        treeNode.children[node] = this.getDefaultHandlers();
      }
      treeNode = treeNode.children[node];
    }
    Object.assign(treeNode.handlers, moduleDefault.handlers);
    if (moduleDefault.isDynamicURLParameter) {
      treeNode.isDynamicUrlParameter = moduleDefault.isDynamicURLParameter;
    }
  }

  async loadRoutes(basePath: string, dirName: string): Promise<void> {
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
        this.defineHandlers(relativePath, module.default);
      }
    }
  }

  getHandler(urlPathname: string, method: HttpMethod): RouteHandler {
    const treePath = urlPathname.split("/").filter((val) => val !== "");
    let treeNode = this.tree;
    for (const node of treePath) {
      if (!treeNode.children[node]) {
        let dynamicUrlParameterNode: TreeNode = undefined as never;
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
