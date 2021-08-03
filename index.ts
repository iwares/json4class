import 'reflect-metadata'

export type Class<T = any> = { new(): T };
export type Normalizer = (v: any) => any;
export type Specializer = (s: any) => any;

interface FieldConfig {
  class?: Class;
  specializer?: Specializer;
  normalizer?: Normalizer;
}

export function json4class(constructor: Class): PropertyDecorator;
export function json4class(normalizer: Normalizer, specializer: Specializer): PropertyDecorator;
export function json4class(arg1: Function, arg2?: Function): PropertyDecorator {
  return function(target: Object, prop: string | symbol): void {
    let config: FieldConfig = {};
    if (typeof arg1 === 'function' && typeof arg2 === 'function') {
      config.normalizer = <Normalizer>arg1;
      config.specializer = <Specializer>arg2;
    } else if (typeof arg1 === 'function') {
      config.class = <Class>arg1;
    }

    let fields = Reflect.getMetadata('json4class:fields', target) || {};
    fields[prop] = config;
    Reflect.defineMetadata('json4class:fields', fields, target);
  }
}

json4class.version = '0.0.3';

json4class.normalize = function(object: any): any {
  if (typeof object !== 'object')
    return object

  if (Array.isArray(object)) {
    let result = [];
    for (let i = 0; i < object.length; ++i)
      result[i] = json4class.normalize(object[i]);
    return result;
  }

  let fields: { [key: string]: FieldConfig } = Reflect.getMetadata('json4class:fields', object) || {};
  let result: any = {};

  for (let prop in object) {
    let field = fields[prop] || {}, value = object[prop]

    if (value === null || value === undefined) {
      result[prop] = value;
    } else if (field.normalizer) {
      result[prop] = field.normalizer(value);
    } else if (field.class == Date || value instanceof Date) {
      result[prop] = json4class.dateNormalizer(value);
    } else if (typeof value === 'object') {
      result[prop] = json4class.normalize(value)
    } else {
      result[prop] = value;
    }
  }

  return result;
}

json4class.stringify = function(object: any, space?: string | number): string {
  return JSON.stringify(json4class.normalize(object), null, space);
}

json4class.specialize = function <T = any>(object: any, constructor: Class<T>): T | T[] {
  if (typeof object !== 'object')
    return <T><unknown>object;

  if (Array.isArray(object)) {
    let result: T[] = [];
    for (let i = 0; i < object.length; ++i)
      result[i] = json4class.specialize(object[i], constructor) as T;
    return result;
  }

  let result: any = new constructor();
  let fields: { [key: string]: FieldConfig } = Reflect.getMetadata('json4class:fields', result) || {};

  for (let prop in object) {
    let field = fields[prop] || {};
    if (!Object.prototype.hasOwnProperty.call(object, prop))
      continue;

    if (object[prop] === null || object[prop] === undefined) {
      result[prop] = object[prop];
    } else if (field.specializer) {
      result[prop] = field.specializer(object[prop]);
    } else if (field.class == Date) {
      result[prop] = json4class.dateSpecializer(object[prop]);
    } else if (field.class) {
      result[prop] = json4class.specialize(object[prop], field.class);
    } else {
      result[prop] = object[prop];
    }
  }

  return result;
}

json4class.parseObject = function<T = any>(json: string, constructor?: Class<T>): T {
  let object: any = JSON.parse(json);
  if (Array.isArray(object))
    throw new Error('Can not parse JSON array to object');
  if (constructor)
    object = json4class.specialize(object, constructor);
  return object;
}

json4class.parseArray = function<T = any>(json: string, constructor?: Class<T>): T[] {
  let object: any = JSON.parse(json);
  if (!Array.isArray(object))
    throw new Error('Can not parse JSON object to array');
  if (constructor)
    object = json4class.specialize(object, constructor);
  return object;
}

json4class.parse = function <T = any>(json: string, constructor?: Class<T>): T | T[] {
  let object: any = JSON.parse(json);
  if (constructor)
    object = json4class.specialize(object, constructor);
  return object;
}

json4class.dateNormalizer = function(date: Date): any {
  return date.toISOString();
}

json4class.dateSpecializer = function(date: any): Date {
  return new Date(date);
}
