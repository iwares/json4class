import 'reflect-metadata'

export type Class<T = any> = { new(): T };
export type Stringifier = (v: any) => string | number;
export type Parser = (s: string | number) => any;

interface FieldConfig {
  class?: Class;
  stringifier?: Stringifier;
  parser?: Parser;
}

export function json4class(constructor: Class): PropertyDecorator;
export function json4class(stringifier: Stringifier, parser: Parser): PropertyDecorator;
export function json4class(arg1: Function, arg2?: Function): PropertyDecorator {
  return function(target: Object, prop: string | symbol): void {
    let config: FieldConfig = {};
    if (typeof arg1 === 'function' && typeof arg2 === 'function') {
      config.stringifier = <Stringifier>arg1;
      config.parser = <Parser>arg2;
    } else if (typeof arg1 === 'function') {
      config.class = <Class>arg1;
    }

    let fields = Reflect.getMetadata('json4class:fields', target) || {};
    fields[prop] = config;
    Reflect.defineMetadata('json4class:fields', fields, target);
  }
}

json4class.version = '0.0.1';

json4class.normalize = function(object: any): any {
  let fields: { [key: string]: FieldConfig } = Reflect.getMetadata('json4class:fields', object) || {};
  let result: any = {};

  for (let prop in object) {
    let field = fields[prop] || {}, value = object[prop]

    if (field.stringifier) {
      result[prop] = field.stringifier(value);
    } else if (field.class == Date || value instanceof Date) {
      result[prop] = json4class.dateStringifier(value);
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

json4class.specialize = function <T>(object: any, constructor: { new(): T }): T {
  let result: any = new constructor();
  let fields: { [key: string]: FieldConfig } = Reflect.getMetadata('json4class:fields', result) || {};

  for (let prop in object) {
    let field = fields[prop] || {};
    if (!Object.prototype.hasOwnProperty.call(object, prop))
      continue;

    if (field.parser) {
      result[prop] = field.parser(object[prop]);
    } else if (field.class == Date) {
      result[prop] = json4class.dateParser(object[prop]);
    } else if (field.class) {
      result[prop] = json4class.specialize(object[prop], <{ new(): any }>field.class);
    } else {
      result[prop] = object[prop];
    }
  }

  return result;
}

json4class.parse = function <T>(json: string, constructor?: { new(): T }): T {
  let object: any = JSON.parse(json);
  if (constructor)
    object = json4class.specialize(object, constructor);
  return object;
}

json4class.dateStringifier = function(date: Date): string {
  return date.toISOString();
}

json4class.dateParser = function(date: string): Date {
  return new Date(date);
}
