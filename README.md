# json4class

This node module provides JSON stringifier and parser for instances of Classes.

## Basic

```typescript
import { json4class } from 'json4class'

class Person {
  public firstName?: string;
  public lastName?: string;
  public sayHi() {
    console.log(`Hi, my name is ${this.firstName} ${this.lastName}.`);
  }
}

let person = new Person();
person.firstName = 'Eric';
person.lastName = 'Tsai';

let json = json4class.stringify(person);
let parsed = json4class.parse(json, Person);

parsed.sayHi(); // Hi, my name is Eric Tsai.
```

## Date

```typescript
import { json4class } from 'json4class'

class Foo {
  @json4class(Date)
  public date?: Date;
}

let foo = new Foo();
foo.date = new Date('2021-05-18');

let json = json4class.stringify(foo);
let parsed = json4class.parse(json, Foo);

console.log(parsed.date!.getFullYear()); // 2021

```

## Nested

```typescript
import { json4class } from 'json4class'

class Foo {
  public name?: string;
  public printName() {
    console.log(this.name);
  }
}

class Bar {
  @json4class(Foo)
  public foo?: Foo;
  public printFooName() {
    this.foo!.printName();
  }
}

let bar = json4class.parse('{"foo":{"name":"Foo Bar"}}', Bar);

bar.printFooName(); // Foo Bar
```

## Custom Parser and Stringifier

```typescript
import { json4class } from 'json4class'

class Foo {
  @json4class(v => v.getTime(), s => new Date(s))
  public date?: Date;
}

let foo = new Foo();
foo.date = new Date('2021-05-20');

let json = json4class.stringify(foo); // {"date":1621468800000}
let parsed = json4class.parse(json, Foo);

console.log(parsed.date); // 2021-05-20T00:00:00.000Z
```
