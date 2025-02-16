# Authorizer Service

A flexible authorization service that manages parent-child entity access validation with caching support.

## Overview

The Authorizer Service provides a simple way to define and enforce access rules between parent and child entities in your application. It supports async validation functions and includes Redis caching for improved performance.

## Features

- Async validation functions
- Redis caching support
- Batch validation with `validateMany`
- Verbose logging option
- Type-safe validators

## Installation
```bash
npm install authorizer
```

## Usage

### Basic Usage

```typescript
import { createAuthorizer } from './authorizer';

const authorizer = await createAuthorizer({
  cache,
  verbose: true, // Optional logging
  validators: [
    {
      parent: 'projects',
      child: 'files',
      validator: async (project, file) => {
        // Your validation logic here
        return true;
      },
    },
  ],
});
```

### Single Validation

```typescript
// Validates access from a project to a file
const hasAccess = await authorizer.validate(
  { key: 'projects', id: 'project-123' },
  { key: 'files', id: 'file-456' }
);
```

### Batch Validation
```typescript

// Validates multiple parent-child relationships at once
const results = await authorizer.validateMany([
  [{ key: 'projects', id: 'project-123' }, { key: 'files', id: 'file-456' }],
  [{ key: 'projects', id: 'project-123' }, { key: 'tasks', id: 'task-789' }],
]);
```

## Caching

The service automatically caches successful validations using Redis when a redis instance is provided. This helps reduce the load on your validation logic for frequently accessed relationships.

## Error Handling

- Throws when no validator is found for a parent-child relationship
- Throws when validation fails
- In batch operations (`validateMany`), throws on the first validation failure

## Best Practices

1. Keep validation functions focused and simple
2. Use caching in production for better performance
3. Enable verbose logging during development
4. Define strict types for your entities

