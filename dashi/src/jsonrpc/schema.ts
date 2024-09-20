import Ajv from "ajv";

const requestSchema = {
  type: "object",
  properties: {
    jsonrpc: { const: "2.0" },
    id: { oneOf: [{ type: "string" }, { type: "number" }] },
    method: { type: "string" },
    params: {
      oneOf: [
        { type: "array", items: {} },
        { type: "object", additionalProperties: {} },
      ],
    },
  },
  required: ["jsonrpc", "method"],
};

const responseSchema = {
  type: "object",
  properties: {
    jsonrpc: { const: "2.0" },
    id: { oneOf: [{ type: "string" }, { type: "number" }] },
    result: {},
    error: {
      type: "object",
      properties: {
        code: { type: "integer" },
        message: { type: "string" },
        data: {},
      },
      required: ["code", "message"],
    },
  },
  required: ["jsonrpc", "id"],
};

const ajv = new Ajv();
export const validateRequest = ajv.compile(requestSchema);
export const validateResponse = ajv.compile(responseSchema);
