import mock from "../../resources/ts/mock";
import {isEqual} from "../../../main/ts/util/isEqual";
import {assert} from "chai";
import {suite, test} from "mocha";

const primitives = [undefined, null, "salty", 42, true, false];

const arrays2 = mock.arrays.map(arr => [...(arr as Array<unknown>)]);

const nonPrimitivesA1 = [mock.Car, mock.Motorcycle, mock.Simba, mock.Kion, Symbol("nock")];

const nonPrimitivesA2 = [mock.Motorcycle, mock.Car, mock.Kion, mock.Simba, Symbol("aito")];

const nonPrimitivesB = [{...mock.Car}, {...mock.Motorcycle}, {...mock.Simba}, {...mock.Kion}, Symbol("nock")];

const toStr = (o: unknown): string =>
{
    return typeof o === "string" ? `"${o}"`
           :  typeof o === "symbol" ? `Symbol("${o.description}")`
           : Array.isArray(o) ? `[${o.map(e => toStr(e)).join(", ")}]`
           : `${o}`;
};

suite.only("isEqual", function testIsEqual()
{
    suite("primitives", function testIsEqualPrimitives()
    {
        primitives.forEach(primitive =>
            test(`isEqual(${toStr(primitive)}, ${toStr(primitive)}) returns true`, function testSamePrimitivesReturnTrue()
            {
                assert.isTrue(isEqual(primitive, primitive));
        }));
    });

    suite("non-primitives", function testIsEqualNonPrimitives()
    {
        suite("same non-primitives", function testSameNonPrimitives()
        {
            nonPrimitivesA1.forEach(nonPrimitive =>
                test(`isEqual(${toStr(nonPrimitive)}, ${toStr(nonPrimitive)}) returns true`, function testSameNonPrimitivesReturnTrue()
                {
                    assert.isTrue(isEqual(nonPrimitive, nonPrimitive));
            }));
        });

        suite("same arrays", function testSameArrays()
        {
            mock.arrays.forEach(mockArray =>
                test(`isEqual(${toStr(mockArray)}, ${toStr(mockArray)}) returns true`, function testSameArraysReturnTrue()
                {
                    assert.isTrue(isEqual(mockArray, mockArray));
            }));
        });

        suite("equal arrays", function testEqualArrays()
        {
            Array.from(mock.arrays.keys()).forEach(index =>
                test(`isEqual(${toStr(mock.arrays[index])}A, ${toStr(arrays2[index])}B) returns true`, function testEqualArraysReturnTrue()
                {
                    assert.isTrue(isEqual(mock.arrays[index], arrays2[index]));
            }));
        });

        suite("equal non-primitives", function testEqualNonPrimitives()
        {
            Array.from(nonPrimitivesB.keys()).forEach(index =>
                test(`isEqual(${toStr(nonPrimitivesA1[index])}A, ${toStr(nonPrimitivesB[index])}B) returns true`, function testEqualNonPrimitivesReturnTrue()
                {
                    assert.isTrue(isEqual(nonPrimitivesA1[index], nonPrimitivesB[index]));
            }));
        });

        suite.skip("not equal non-primitives", function testNotEqualNonPrimitives()
        {
            Array.from(nonPrimitivesA2.keys()).forEach(index =>
                test(`isEqual(${toStr(nonPrimitivesA1[index])}, ${toStr(nonPrimitivesA2[index])}) returns false`, function testNotEqualNonPrimitivesReturnFalse()
                {
                    assert.isFalse(isEqual(nonPrimitivesA1[index], nonPrimitivesA2[index]));
            }));
        });
    });

});
