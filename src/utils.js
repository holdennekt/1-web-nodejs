function json(data) {
  this.end(JSON.stringify(data));
}

export const helpers = { json };
