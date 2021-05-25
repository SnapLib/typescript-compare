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
                const testDescStr = `isEqual(${toStr(primitive)}, ${toStr(primitive)}) return`;
                test(testDescStr + "s true", function testSamePrimitivesReturnTrue()
                {
                    assert.isTrue(isEqual(primitive, primitive), testDescStr + "ed false");
                });
            });
        });

        suite("not same primitives", function testNotSamePrimitives()
        {
            suite("different primitive type", function testDifferentPrimitiveType()
            {
                Array.from(primitiveSingletons.keys()).forEach(index => {
                    const testDescStr = `isEqual(${toStr(primitiveSingletons[index])}, ${toStr(primitiveSingletons[primitiveSingletons.length - 1 - index])}) return`;
                    test(testDescStr + "s false", function testDifferentPrimitiveSingletonType()
                    {
                        assert.isFalse(isEqual(primitiveSingletons[index], primitiveSingletons[primitiveSingletons.length - 1 - index]), testDescStr + "ed true");
                    });
                });

                primitiveSingletons.forEach(primitiveSingleton =>
                    primitiveNonSingletonsA.forEach(primNonSingleton => {
                        const testDescStr1 = `isEqual(${toStr(primitiveSingleton)}, ${toStr(primNonSingleton)}) return`;
                        test(testDescStr1 + "s false", function testDifferentPrimitiveNonSingletonTypeA()
                        {
                            assert.isFalse(isEqual(primitiveSingleton, primNonSingleton), testDescStr1 + "ed true");
                        });

                        const testDescStr2 = `isEqual(${toStr(primNonSingleton)}, ${toStr(primitiveSingleton)}) return`;
                        test(testDescStr2 + "s false", function testDifferentPrimitiveNonSingletonTypeB()
                        {
                            assert.isFalse(isEqual(primNonSingleton, primitiveSingleton), testDescStr2 + "ed true");
                        });
                    })
                );
            });

            suite("different primitive value", function testDifferentPrimitiveValue()
            {
                Array.from(primitiveNonSingletonsA.keys()).forEach(index => {
                    const testDescStr = `isEqual(${toStr(primitiveNonSingletonsA[index])}, ${toStr(primitiveNonSingletonsB[index])}) return`;
                    test(testDescStr + "s false", function differentPrimValuesReturnFalse()
                    {
                        assert.isFalse(isEqual(primitiveNonSingletonsA[index], primitiveNonSingletonsB[index]), testDescStr + "ed true");
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
                const testDescStr = `isEqual(${toStr(mockArray)}, ${toStr(mockArray)}) return`;
                test(testDescStr + "s true", function testSameArraysReturnTrue()
                {
                    assert.isTrue(isEqual(mockArray, mockArray), testDescStr + "ed false");
                });
            });
        });

        suite("equal arrays", function testEqualArrays()
        {
            mock.arrays.forEach(mockArray => {
                const testDescStr = `isEqual(${toStr(mockArray)}A, ${toStr(mockArray)}B) return`;
                test(testDescStr + "s true", function testEqualArraysReturnTrue()
                {
                    assert.isTrue(isEqual(mockArray, [...mockArray as Array<unknown>]), testDescStr + "ed false");
                });
            });
        });

        suite("same non-primitives", function testSameNonPrimitives()
        {
            nonPrimitives.forEach(nonPrimitive => {
                const testDescStr = `isEqual(${toStr(nonPrimitive)}, ${toStr(nonPrimitive)}) return`;
                test(testDescStr + "s true", function testSameNonPrimitivesReturnTrue()
                {
                    assert.isTrue(isEqual(nonPrimitive, nonPrimitive), testDescStr + "ed false");
                });
            });
        });

        suite("equal non-primitives", function testEqualNonPrimitives()
        {
            nonPrimitives.forEach(nonPrimitive => {
                const testDescStr = `isEqual(${toStr(nonPrimitive)}A, ${toStr(nonPrimitive)}B) return`;
                test(testDescStr + "s true", function testEqualNonPrimitivesReturnTrue()
                {
                    assert.isTrue(isEqual(nonPrimitive, {...nonPrimitive}), testDescStr + "ed false");
                });
            });
        });

        suite("not equal non-primitives", function testNotEqualNonPrimitives()
        {
            Array.from(nonPrimitives.keys()).forEach(index => {
                const testDescStr = `isEqual(${toStr(nonPrimitives[index])}, ${toStr(nonPrimitives[nonPrimitives.length - 1 -index])}) return`;
                test(testDescStr + "s false", function testNotEqualNonPrimitivesReturnFalse()
                {
                    assert.isFalse(isEqual(nonPrimitives[index], nonPrimitives[nonPrimitives.length - 1 -index]), testDescStr + "ed true");
                });
            });
        });
    });
});
