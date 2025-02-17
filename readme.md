# Authorizer

A flexible authorization service that manages parent-child entity access validation with caching support.

## Overview

Authorizer provides a simple way to define and enforce access rules between parent and child entities in your application. It supports async validation functions and includes Redis caching for improved performance.

### Core Features

- Async validation functions
- Redis caching support
- Batch and safe (non-throwing) validations
- Optional verbose logging
- Type-safe validators

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Methods](#methods)
- [Best Practices](#best-practices)

## Installation
```bash
npm install authorizer
```

## Usage

### Basic Usage

```typescript
import { createAuthorizer } from './authorizer';
import { cache } from './cache'; // Optional cache instance (Redis-like)

const validators = [
  {
    parent: 'projects',
    child: 'tasks',
    validator: async (project, task) => {
      // Your validation logic here
      return true;
    },
  },
];

const authorizer = await createAuthorizer({
  cache,
  validators,
  verbose: true, // Optional logging
});
```

### Single Validation

```typescript
/**
 * Validates access from a project to a file 
 * Will throw an error if access is denied
 */
const hasAccess = await authorizer.validate(
  { key: 'projects', id: 'project-123' },
  { key: 'tasks', id: 'task-456' }
);
```
#### Safe Single Validation

```typescript
/**
 * Validates access from a project to a file 
 * Will return a result object instead of throwing an error 
 * if access is denied
 */
const hasAccess = await authorizer.safeValidate(
  { key: 'projects', id: 'project-123' },
  { key: 'tasks', id: 'task-456' }
);
```

### Batch Validation

```typescript
/**
 * Validates multiple parent-child relationships at once
 * Will throw on the first failure if access is denied
 */
const results = await authorizer.validateMany([
  [{ key: 'projects', id: 'project-123' }, { key: 'tasks', id: 'task-456' }],
  [{ key: 'projects', id: 'project-123' }, { key: 'tasks', id: 'task-789' }],
]);
```

#### Safe Batch Validation

```typescript
/**
 * Validates multiple parent-child relationships at once 
 * Will now return an array of result objects instead of 
 * throwing an error if access is denied
 */
const results = await authorizer.safeValidateMany([
  [{ key: 'projects', id: 'project-123' }, { key: 'tasks', id: 'task-456' }],
  [{ key: 'projects', id: 'project-123' }, { key: 'tasks', id: 'task-789' }],
]);
```


## Methods

| Method | Description |
|--------|-------------|
| `validate` | Validates access between a single parent and child entity. Throws `UnauthorizedException` on failure. |
| `safeValidate` | Same as `validate` but returns a result object instead of throwing. |
| `validateMany` | Validates multiple parent-child relationships in batch. Throws `UnauthorizedException` on first failure. |
| `safeValidateMany` | Same as `validateMany` but returns an array of result objects instead of throwing. |
| `removeFromCache` | Removes a specific parent-child validation from cache. | 
| `removeManyFromCache` | Removes multiple parent-child validations from cache. |
| `clearCache` | Clears all cached validation results. | 


## Best Practices

### Errors

The Authorizer Service implements robust error handling to help you manage access validation effectively. When no validator is found for a specific parent-child relationship, the service will throw an exception to alert you of the missing validator configuration. Failed validations will result in thrown exceptions by default. For cases where you prefer non-throwing behavior, the service provides safe validation methods that return a `SafeValidationResult` type, allowing you to handle validation failures gracefully in your application logic.

### Caching

The service automatically caches successful validations using the provided (Redis-like) cache instance. This is optional andhelps reduce the load on your validation logic for frequently accessed relationships. It is recommended to use a caching service like Redis for production environments.

### Miscellaneous

1. Keep validation functions focused and simple.
1. Enable verbose logging during development.
1. Define strict types for your entities or use the provided `BaseEntity` type.

