"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.json4class = void 0;
require("reflect-metadata");
function json4class(arg1, arg2) {
    return function (target, prop) {
        let config = {};
        if (typeof arg1 === 'function' && typeof arg2 === 'function') {
            config.normalizer = arg1;
            config.specializer = arg2;
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
json4class.version = '0.0.3';
json4class.normalize = function (object) {
    if (typeof object !== 'object')
        return object;
    if (Array.isArray(object)) {
        let result = [];
        for (let i = 0; i < object.length; ++i)
            result[i] = json4class.normalize(object[i]);
        return result;
    }
    let fields = Reflect.getMetadata('json4class:fields', object) || {};
    let result = {};
    for (let prop in object) {
        let field = fields[prop] || {}, value = object[prop];
        if (value === null || value === undefined) {
            result[prop] = value;
        }
        else if (field.normalizer) {
            result[prop] = field.normalizer(value);
        }
        else if (field.class == Date || value instanceof Date) {
            result[prop] = json4class.dateNormalizer(value);
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
    if (typeof object !== 'object')
        return object;
    if (Array.isArray(object)) {
        let result = [];
        for (let i = 0; i < object.length; ++i)
            result[i] = json4class.specialize(object[i], constructor);
        return result;
    }
    let result = new constructor();
    let fields = Reflect.getMetadata('json4class:fields', result) || {};
    for (let prop in object) {
        let field = fields[prop] || {};
        if (!Object.prototype.hasOwnProperty.call(object, prop))
            continue;
        if (object[prop] === null || object[prop] === undefined) {
            result[prop] = object[prop];
        }
        else if (field.specializer) {
            result[prop] = field.specializer(object[prop]);
        }
        else if (field.class == Date) {
            result[prop] = json4class.dateSpecializer(object[prop]);
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
json4class.parseObject = function (json, constructor) {
    let object = JSON.parse(json);
    if (Array.isArray(object))
        throw new Error('Can not parse JSON array to object');
    if (constructor)
        object = json4class.specialize(object, constructor);
    return object;
};
json4class.parseArray = function (json, constructor) {
    let object = JSON.parse(json);
    if (!Array.isArray(object))
        throw new Error('Can not parse JSON object to array');
    if (constructor)
        object = json4class.specialize(object, constructor);
    return object;
};
json4class.parse = function (json, constructor) {
    let object = JSON.parse(json);
    if (constructor)
        object = json4class.specialize(object, constructor);
    return object;
};
json4class.dateNormalizer = function (date) {
    return date.toISOString();
};
json4class.dateSpecializer = function (date) {
    return new Date(date);
};
//# sourceMappingURL=index.js.map