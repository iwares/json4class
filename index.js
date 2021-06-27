"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.json4class = void 0;
require("reflect-metadata");
function json4class(arg1, arg2) {
    return function (target, prop) {
        let config = {};
        if (typeof arg1 === 'function' && typeof arg2 === 'function') {
            config.stringifier = arg1;
            config.parser = arg2;
        }
        else if (typeof arg1 === 'function') {
            config.class = arg1;
        }
        let fields = Reflect.getMetadata('json4class:fields', target) || {};
        fields[prop] = config;
        Reflect.defineMetadata('json4class:fields', fields, target);
    };
}
exports.json4class = json4class;
json4class.version = '0.0.2';
json4class.normalize = function (object) {
    if (object === null || object === undefined)
        return object;
    let fields = Reflect.getMetadata('json4class:fields', object) || {};
    let result = {};
    for (let prop in object) {
        let field = fields[prop] || {}, value = object[prop];
        if (value === null || value === undefined) {
            result[prop] = value;
        }
        else if (field.stringifier) {
            result[prop] = field.stringifier(value);
        }
        else if (field.class == Date || value instanceof Date) {
            result[prop] = json4class.dateStringifier(value);
        }
        else if (typeof value === 'object') {
            result[prop] = json4class.normalize(value);
        }
        else {
            result[prop] = value;
        }
    }
    return result;
};
json4class.stringify = function (object, space) {
    return JSON.stringify(json4class.normalize(object), null, space);
};
json4class.specialize = function (object, constructor) {
    if (object === null || object === undefined)
        return object;
    let result = new constructor();
    let fields = Reflect.getMetadata('json4class:fields', result) || {};
    for (let prop in object) {
        let field = fields[prop] || {};
        if (!Object.prototype.hasOwnProperty.call(object, prop))
            continue;
        if (object[prop] === null || object[prop] === undefined) {
            result[prop] = object[prop];
        }
        else if (field.parser) {
            result[prop] = field.parser(object[prop]);
        }
        else if (field.class == Date) {
            result[prop] = json4class.dateParser(object[prop]);
        }
        else if (field.class) {
            result[prop] = json4class.specialize(object[prop], field.class);
        }
        else {
            result[prop] = object[prop];
        }
    }
    return result;
};
json4class.parse = function (json, constructor) {
    let object = JSON.parse(json);
    if (constructor)
        object = json4class.specialize(object, constructor);
    return object;
};
json4class.dateStringifier = function (date) {
    return date.toISOString();
};
json4class.dateParser = function (date) {
    return new Date(date);
};
//# sourceMappingURL=index.js.map