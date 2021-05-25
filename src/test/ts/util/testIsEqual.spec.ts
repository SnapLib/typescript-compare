import mock from "../../resources/ts/mock";
import {isEqual} from "../../../main/ts/util/isEqual";
import {assert} from "chai";
import {suite, test} from "mocha";

const primitiveSingletons = [undefined, null, true, false];

const primitiveNonSingletonsA = ["salty", 42, Symbol("nock"), BigInt(9999999)];

const primitiveNonSingletonsB = ["towel", -321, Symbol("aito"), BigInt(11111111)];

const primitives = [...primitiveSingletons, ...primitiveNonSingletonsA];

const nonPrimitives = [mock.Car, mock.Motorcycle, mock.Simba, mock.Kion];

const toStr = (o: unknown): string =>
{
    return typeof o === "string" ? `"${o}"`
           :  typeof o === "symbol" ? `Symbol("${o.description}")`
           :  typeof o === "bigint" ? `BigInt(${o})`
           : Array.isArray(o) ? `[${o.map(e => toStr(e)).join(", ")}]`
           : `${o}`;
};

suite.only("isEqual", function testIsEqual()
{
    suite("primitives", function testIsEqualPrimitives()
    {
        suite("same primitives", function testSamePrimitives()
        {
            primitives.forEach(primitive => {
                const testDescStr = `isEqual(${toStr(primitive)}, ${toStr(primitive)})`;
                test(testDescStr + " returns true", function testSamePrimitivesReturnTrue()
                {
                    assert.isTrue(isEqual(primitive, primitive), testDescStr + " returned false");
                });
            });
        });

        suite("not same primitives", function testNotSamePrimitives()
        {
            suite("different primitive type", function testDifferentPrimitiveType()
            {
                Array.from(primitiveSingletons.keys()).forEach(index => {
                    const testDescStr = `isEqual(${toStr(primitiveSingletons[index])}, ${toStr(primitiveSingletons[primitiveSingletons.length - 1 - index])})`;
                    test(testDescStr + " returns false", function testDifferentPrimitiveSingletonType()
                    {
                        assert.isFalse(isEqual(primitiveSingletons[index], primitiveSingletons[primitiveSingletons.length - 1 - index]), testDescStr + " returned true");
                    });
                });

                primitiveSingletons.forEach(primitiveSingleton =>
                    primitiveNonSingletonsA.forEach(primNonSingleton => {
                        const testDescStr1 = `isEqual(${toStr(primitiveSingleton)}, ${toStr(primNonSingleton)})`;
                        test(testDescStr1 + " returns false", function testDifferentPrimitiveNonSingletonTypeA()
                        {
                            assert.isFalse(isEqual(primitiveSingleton, primNonSingleton), testDescStr1 + " returned true");
                        });

                        const testDescStr2 = `isEqual(${toStr(primNonSingleton)}, ${toStr(primitiveSingleton)})`;
                        test(testDescStr2 + " returns false", function testDifferentPrimitiveNonSingletonTypeB()
                        {
                            assert.isFalse(isEqual(primNonSingleton, primitiveSingleton), testDescStr2 + " returned true");
                        });
                    })
                );
            });

            suite("different primitive value", function testDifferentPrimitiveValue()
            {
                Array.from(primitiveNonSingletonsA.keys()).forEach(index => {
                    const testDescStr = `isEqual(${toStr(primitiveNonSingletonsA[index])}, ${toStr(primitiveNonSingletonsB[index])})`;
                    test(testDescStr + " returns false", function differentPrimValuesReturnFalse()
                    {
                        assert.isFalse(isEqual(primitiveNonSingletonsA[index], primitiveNonSingletonsB[index]), testDescStr + " returned true");
                    });
                });
            });
        });
    });

    suite("non-primitives", function testIsEqualNonPrimitives()
    {
        suite("same arrays", function testSameArrays()
        {
            mock.arrays.forEach(mockArray => {
                const testDescStr = `isEqual(${toStr(mockArray)}, ${toStr(mockArray)})`;
                test(testDescStr + " returns true", function testSameArraysReturnTrue()
                {
                    assert.isTrue(isEqual(mockArray, mockArray), testDescStr + " returned false");
                });
            });
        });

        suite("equal arrays", function testEqualArrays()
        {
            mock.arrays.forEach(mockArray => {
                const testDescStr = `isEqual(${toStr(mockArray)}A, ${toStr(mockArray)}B)`;
                test(testDescStr + " returns true", function testEqualArraysReturnTrue()
                {
                    assert.isTrue(isEqual(mockArray, [...mockArray as Array<unknown>]), testDescStr + " returned false");
                });
            });
        });

        suite("same non-primitives", function testSameNonPrimitives()
        {
            nonPrimitives.forEach(nonPrimitive => {
                const testDescStr = `isEqual(${toStr(nonPrimitive)}, ${toStr(nonPrimitive)})`;
                test(testDescStr + " returns true", function testSameNonPrimitivesReturnTrue()
                {
                    assert.isTrue(isEqual(nonPrimitive, nonPrimitive), testDescStr + " returned false");
                });
            });
        });

        suite("equal non-primitives", function testEqualNonPrimitives()
        {
            nonPrimitives.forEach(nonPrimitive => {
                const testDescStr = `isEqual(${toStr(nonPrimitive)}A, ${toStr(nonPrimitive)}B)`;
                test(testDescStr + " returns true", function testEqualNonPrimitivesReturnTrue()
                {
                    assert.isTrue(isEqual(nonPrimitive, {...nonPrimitive}), testDescStr + " returned false");
                });
            });
        });

        suite("not equal non-primitives", function testNotEqualNonPrimitives()
        {
            Array.from(nonPrimitives.keys()).forEach(index => {
                const testDescStr = `isEqual(${toStr(nonPrimitives[index])}, ${toStr(nonPrimitives[nonPrimitives.length - 1 -index])})`;
                test(testDescStr + " returns false", function testNotEqualNonPrimitivesReturnFalse()
                {
                    assert.isFalse(isEqual(nonPrimitives[index], nonPrimitives[nonPrimitives.length - 1 -index]), testDescStr + " returned true");
                });
            });
        });
    });
});
