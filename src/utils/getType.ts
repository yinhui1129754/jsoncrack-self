type ObjType = "array" | "null" | "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function"
export function getType(obj): ObjType {
    if (Array.isArray(obj)) {
        return "array"
    }
    if (!obj && typeof obj === 'object') {
        return "null"
    }
    return typeof obj
}