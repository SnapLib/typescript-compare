# Compare

Compare 2 JavaScript objects to each other.

![npm (scoped)][1] ![NPM][2] ![node-current (scoped)][3]

This npm package exports the `Compare` class as well as the
`isEqual(unknown, unknown)` function.

## Compare class

The `Compare` class consumes 2 objects and provides methods to query the
differences and similarities between the consumed objects. To differentiate
between the 2 consumed objects, one object is referred to as the *source* object
and the other object it's being compared to is referred to as the *target*
object.

There are 4 different types of "relation" queries `Compare` objects
contain:

1. `omittedProperties`

    Properties that are present in the source object but not in the target
    object.

1. `extraProperties`

    Properties that are not present in the source object but are present in the
    target object.

1. `sharedProperties`

    Properties that are present in both the source and target object that are
    mapped to equivalent values.

1. `alteredProperties`

    Properties that are present in both the source and target object that are
    mapped to differing values.

### Examples

Below are a few examples highlighting how each query behaves:

```typescript
const car = {
    numOfWheels: 4,
    fuel: "petrol",
    makes: ["Koenigsegg", "Pagani"],
    bodyTypes: ["coup", "sedan", "suv"],
    engineLocations: ["front", "middle", "rear"],
    isSafe: true
}

const motorcycle = {
    numOfWheels: 2,
    fuel: "petrol",
    makes: ["MV Agusta", "Triumph"],
    driveTypes: ["chain", "belt", "shaft"],
    isSafe: false
}

// Pass `car` as source object to compare to `motorcycle` target object
const objectComparison = new Compare(car, motorcycle);

console.log(objectComparison.omittedProperties);
/* prints:
 * {
 *   bodyTypes: ["coup", "sedan", "suv"],
 *   engineLocations: ["front", "middle", "rear"]
 * }
 */

console.log(objectComparison.extraProperties);
/* prints:
 * {
 *   driveTypes: ["chain", "belt", "shaft"]
 * }
 */

console.log(objectComparison.sharedProperties);
/* prints:
 * {
 *   fuel: "petrol"
 * }
 */

console.log(objectComparison.alteredProperties)
/*
 * prints:
 * {
 *   numOfWheels: {sourceValue: 4, targetValue: 2},
 *   makes: { sourceValue: ["Koenigsegg", "Lamborghini],
              targetValue: ["MV Agusta", "Triumph"] },
 *   isSafe: {sourceValue: true, targetValue: false}
 * }
 */
```

This class is intended to be used for analyzing/reading as opposed to
mutating/altering. As a result the objects returned by `Compare` objects
are immutable and attempting to mutate them will result in an error.

It should also be noted that the `Compare` class is intended to compare
objects or values that can be interpreted as objects and contain enumerable
properties (keys-value pairs). Attempting to construct a `Compare` object with
`null`, `undefined`, or non-string primitive values as source and/or target
arguments will result in, ideally, an error to be thrown or undefined behavior.

## isEqual(unknown, unknown) function

The `isEqual` function is a predicate function that consumes 2 arguments and
tests them for ***equality***, <u>***not***</u> ***sameness***. If the passed
arguments are of the same type and contain equal values or properties, they're
considered equal and `true` is returned. Alternatively, if 2 arrays are passed
as arguments that contain the same elements in the same order then `true` is
returned.

For example:

```typescript
console.log(["Simba", "Kion"] === ["Simba", "Kion"]);
// prints: false

console.log(isEqual(["Simba", "Kion"], ["Simba", "Kion"]));
// prints: true
```

[1]: https://img.shields.io/npm/v/@snaplib/compare?color=%2366ff66&logo=npm&style=flat-square
[2]: https://img.shields.io/npm/l/@snaplib/compare?color=%2366ff66&style=flat-square
[3]: https://img.shields.io/node/v/@snaplib/compare?color=%2366ff66&&logo=node.js&style=flat-square
