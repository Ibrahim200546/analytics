# Jsel Library Documentation

## Introduction

Welcome to the documentation for the Jsel library, a TypeScript library designed to add a new programming language executed on JavaScript. This documentation provides a comprehensive guide on using the Jsel library and covers various features, syntax, and examples.

## Table of Contents

1. [Installation](#installation)
2. [Getting Started](#getting-started)
    - [Jsel and JselContext](#jsel-and-jselcontext)
3. [Basic Syntax](#basic-syntax)
    - [Variables](#variables)
    - [Arithmetic Operations](#arithmetic-operations)
    - [Accessing Object Properties](#accessing-object-properties)
    - [String Concatenation](#string-concatenation)
    - [Assignment Operations](#assignment-operations)
4. [Control Flow](#control-flow)
    - [If Statements](#if-statements)
    - [While Statements](#while-statements)
    - [Foreach Statements](#foreach-statements)
5. [Functions](#functions)
    - [Built-in Functions](#built-in-functions)
    - [Custom Functions](#custom-functions)
    - [Function Declarations](#function-declarations)
6. [Standard Library](#standard-library)
    - [Path Operations](#path-operations)
    - [Type Checking](#type-checking)
    - [Other Standard Functions](#other-standard-functions)
7. [Advanced Features](#advanced-features)
    - [Reflex](#reflex)
8. [Examples](#examples)
    - [Example 1: Manipulating Objects](#example-1-manipulating-objects)
    - [Example 2: Using Control Flow](#example-2-using-control-flow)
    - [Example 3: Working with Arrays](#example-3-working-with-arrays)
    - [Example 4: Custom Functions](#example-4-custom-functions)
    - [Example 5: Advanced Features](#example-5-advanced-features)
9. [Conclusion](#conclusion)
10. [Support and Contribution](#support-and-contribution)

## Installation

To use the Jsel library in your TypeScript project, follow these steps:

```bash
npm install @dexodus/jsel
```

## Getting Started

### Jsel and JselContext

The core components of the Jsel library are the `Jsel` class and the `JselContext` class. The `Jsel` class represents the interpreter, while the `JselContext` class provides the initial context for the interpreter. Here's a basic example of how to create and use them:

```typescript
import { Jsel, JselContext } from 'jsel-library';

const context = new JselContext({
  // ... initial context data ...
});

const jsel = new Jsel(context);

// Now you can use jsel to execute Jsel code
```

## Basic Syntax

### Variables

Jsel supports variables, and you can declare and use them as follows:

```typescript
const jsel = new Jsel(new JselContext({
  a: 5,
  b: 'Hello',
  c: true,
}));

console.log(jsel.exec('a')); // Output: 5
console.log(jsel.exec('b + " World"')); // Output: Hello World
console.log(jsel.exec('c')); // Output: true
```

### Arithmetic Operations

Jsel supports various arithmetic operations, including addition, subtraction, multiplication, division, and exponentiation:

```typescript
const jsel = new Jsel(new JselContext({
  x: 5,
  y: 3,
}));

console.log(jsel.exec('x + y')); // Output: 8
console.log(jsel.exec('x - y')); // Output: 2
console.log(jsel.exec('x * y')); // Output: 15
console.log(jsel.exec('x / y')); // Output: 1.666...
console.log(jsel.exec('x ** y')); // Output: 125
```

### Accessing Object Properties

You can access object properties using dot notation:

```typescript
const jsel = new Jsel(new JselContext({
  person: {
    name: 'John',
    age: 25,
  },
}));

console.log(jsel.exec('person.name')); // Output: John
console.log(jsel.exec('person.age')); // Output: 25
```

### String Concatenation

Jsel supports string concatenation using the `+` operator:

```typescript
const jsel = new Jsel(new JselContext({
  greeting: 'Hello',
  name: 'John',
}));

console.log(jsel.exec('greeting + " " + name')); // Output: Hello John
```

### Assignment Operations

You can use assignment operations to update variable values:

```typescript
const jsel = new Jsel(new JselContext({
  a: 5,
}));

console.log(jsel.exec('a += 3')); // Output: 8
console.log(jsel.exec('a = a * 2')); // Output: 16
```

## Control Flow

### If Statements

Jsel supports if statements for conditional execution:

```typescript
const jsel = new Jsel(new JselContext({
  condition: true,
  value: 42,
}));

jsel.exec(`
  if (condition) {
    value = value * 2;
  }
`);

console.log(jsel.exec('value')); // Output: 84
```

### While Statements

You can use while statements for repeated execution:

```typescript
const jsel = new Jsel(new JselContext({
  counter: 0,
}));

jsel.exec(`
  while (counter < 5) {
    counter++;
  }
`);

console.log(jsel.exec('counter')); // Output: 5
```

### Foreach Statements

Jsel supports foreach statements for iterating over arrays:

```typescript
const jsel = new Jsel(new JselContext({
  numbers: [1, 2, 3, 4, 5],
  result: 0,
}));

jsel.exec(`
  foreach (numbers as value) {
    result += value;
  }
`);

console.log(jsel.exec('result')); // Output: 15
```

## Functions

### Built-in Functions

Jsel provides a set of built-in functions for common operations:

```typescript
const jsel = new Jsel(new JselContext({
  value: 'Hello, World!',
}));

console.log(jsel.exec('length(value)')); // Output: 13
console.log(jsel.exec('toUpperCase(value)')); // Output: HELLO, WORLD!
```

### Custom Functions

You can define custom functions and use them in your Jsel code:

```typescript
const jsel = new Jsel(new JselContext({
  sum: (a, b) => a + b,
}));

console.log(jsel.exec('sum(3, 5)')); // Output: 8
```

### Function Declarations

Jsel allows you to declare functions for later use:

```typescript
const jsel = new Jsel(new JselContext({}));

jsel.exec(`
  add = (a, b) => {
    a + b
  }
`);

console.log(jsel.exec('add(2, 3)')); // Output: 5
```

## Standard

Library

### Path Operations

Jsel provides standard library functions for working with paths:

```typescript
const jsel = new Jsel(new JselContext({
  path: 'entity.users[12].name',
}));

console.log(jsel.exec(`getPathParent("${path}")`)); // Output: entity.users[12]
console.log(jsel.exec(`removeOldParentFromPath("${path}")`)); // Output: users[12].name
console.log(jsel.exec(`getCurrentIndexFromPath("${path}")`)); // Output: 12
```

### Type Checking

Jsel includes functions for checking variable types:

```typescript
const jsel = new Jsel(new JselContext({
  value: true,
}));

console.log(jsel.exec('getType(value)')); // Output: boolean
console.log(jsel.exec('isBoolean(value)')); // Output: true
console.log(jsel.exec('isString(value)')); // Output: false
```

### Other Standard Functions

Jsel standard library provides other useful functions:

```typescript
const jsel = new Jsel(new JselContext({}));

console.log(jsel.exec('jsonParse(\'{"a": "test"}\')')); // Output: { a: 'test' }
console.log(jsel.exec('log("Hello, Jsel!")')); // Output: undefined
```

## Advanced Features

### Reflex

Jsel introduces the reflex feature for dynamic variable access:

```typescript
const jsel = new Jsel(new JselContext({
  someVariable: 123,
  path: 'someVariable',
}));

jsel.exec(`
  valueByReflex = $path
`);

console.log(jsel.exec('valueByReflex')); // Output: 123
```

## Examples

### Example 1: Manipulating Objects

```typescript
const jsel = new Jsel(new JselContext({
  person: {
    name: 'Alice',
    age: 30,
  },
}));

jsel.exec(`
  person.name = "Bob";
  person.age += 5;
`);

console.log(jsel.exec('person')); // Output: { name: 'Bob', age: 35 }
```

### Example 2: Using Control Flow

```typescript
const jsel = new Jsel(new JselContext({
  number: 42,
}));

jsel.exec(`
  if (number > 50) {
    number = number / 2;
  } else {
    number = number * 2;
  }
`);

console.log(jsel.exec('number')); // Output: 84
```

### Example 3: Working with Arrays

```typescript
const jsel = new Jsel(new JselContext({
  numbers: [1, 2, 3, 4, 5],
  sum: 0,
}));

jsel.exec(`
  foreach (numbers as value) {
    sum += value;
  }
`);

console.log(jsel.exec('sum')); // Output: 15
```

### Example 4: Custom Functions

```typescript
const jsel = new Jsel(new JselContext({
  customFunction: (a, b) => a * b,
}));

console.log(jsel.exec('customFunction(3, 4)')); // Output: 12
```

### Example 5: Advanced Features

```typescript
const jsel = new Jsel(new JselContext({
  entity: {
    id: 1,
    name: 'Organization',
    parts: [
      {
        question: 'When was I born?',
        type: 'radio',
        radio: [
          { answer: '23.09.2002', right: true },
          { answer: '23.09.2022', right: false },
        ],
      },
    ],
  },
  newParts: [],
}));

jsel.exec(`
  foreach (entity.parts as index => part) {
    newPart = {
      type: part.type,
      question: part.question,
    }

    if (part.type === 'radio') {
      newPart.data = {
        answers: [],
        answerPrices: [],
      }

      foreach (part.radio as answerIndex => answerObject) {
        // Process radio answers
      }
    }

    newParts[index] = newPart;
  }

  entity.parts = newParts;
`);

console.log(jsel.exec('entity')); // Updated entity object
```

## Conclusion

This concludes the documentation for the Jsel library. We hope this guide helps you understand the features and capabilities of Jsel, enabling you to use it effectively in your TypeScript projects.

## Support and Contribution

For support, bug reports, or contributions, please visit the [Jsel GitHub repository](https://gitlab.com/TheDexodus/jsel). We welcome any feedback and contributions from the community.

Thank you for choosing Jsel!
