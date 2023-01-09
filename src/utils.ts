import { ServerResponse } from "http";

function json(this: ServerResponse, data: any) {
  this.end(JSON.stringify(data));
}

export const helpers = { json };
