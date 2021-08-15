# @fsubal/algebraic-enum

Poor man's ADT-like enum for TypeScript using template literal types.

### Why?

Mimicking Algebraic Data Type (ADT) using tagged union type is a popular pattern, like it is used in redux action creators.

This package makes you write them easily, and useful for not only redux actions, but also for anything like "enum having values".

### How to use

```
npm install @fsubal/algebraic-enum
```

write how to use

```ts
import algebraic, { nullary } from '@fsubal/algebraic-enum'

const ItemAction = algebraic('ItemAction', {
  loaded: nullary,
  selectedOne: (nextId: number) => ({ nextId })
})

ItemAction.loaded() // => { type: 'ItemAction/loaded', payload: {} }
ItemAction.selectedOne(1) // => { type: 'ItemAction/selectedOne', payload: { nextId: 1 } }
```

You can get the type of all possible values using `Case<typeof ...>`

```ts
import { Case, unreachable } from '@fsubal/algebraic-enum'

type KnownItemAction = Case<typeof ItemAction> // { type: 'ItemAction/loaded', payload: {} } | { type: 'ItemAction/selectedOne', payload: { nextId: number } }

function reducer(state: State, action: KnownItemAction) {
  switch(action.type) {
    case 'ItemAction/loaded': {
      state.loading = false
      break
    }

    case 'ItemAction/selectedOne': {
      // This IS inferred from action.type !!!!
      const { nextId } = action.payload
      state.nextId = nextId
      break
    }

    default: {
      // You CAN check the cases are exhaustive
      unreachable(action)
    }
  }
}
```

You can configure the delimiter using `createAlgebraic`. You will see the name of `type` is still perfectly inferred.

```ts
import { createAlgebraic } from '@fsubal/algebraic-enum'

const algebraic = createAlgebraic({ delimiter: '::' })

const ItemAction = algebraic('ItemAction', {
  loaded: nullary,
  selectedOne: (nextId: number) => ({ nextId })
})

ItemAction.selectedOne(1) // => { type: 'ItemAction::selectedOne', payload: { nextId: 1 } }

type KnownItemAction = Case<typeof ItemAction> // { type: 'ItemAction::loaded', payload: {} } | { type: 'ItemAction::selectedOne', payload: { nextId: number } }
```

### Known limitations

This package cannot create enum with generic type (like `Option<T>` or `Either<L, R>`) in streight manner.

You can workaround like this ( this is because it is "Poor man's ADT-like enum" ).

```ts
function Option<T = never>() {
  return algebraic('Option', {
    Some: (value: T) => value,
    None: nullary
  })
}
```

### Development

WIP

### See also

- https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#tagged-union-types
- https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking
