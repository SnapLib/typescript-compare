import mock from "../../resources/ts/mock";
import {isEqual} from "../../../main/ts/util/isEqual";
import {assert} from "chai";
import {suite, test} from "mocha";

const primitives = [undefined, null, "salty", 42, true, false];

const nonPrimitives = [mock.Car, mock.Motorcycle, mock.Simba, mock.Kion, Symbol("nock")];

const toStr = (o: unknown): string =>
{
    return typeof o === "string" ? `"${o}"`
           :  typeof o === "symbol" ? `Symbol("${o.description}")`
           : Array.isArray(o) ? `[${o.map(e => toStr(e)).join(", ")}]`
           : `${o}`;
};

suite("isEqual", function testIsEqual()
{
    suite("primitives", function testIsEqualPrimitives()
    {
        primitives.forEach(primitive =>
            test(`isEqual(${toStr(primitive)}, ${toStr(primitive)}) returns true`, function testEqualPrimitivesReturnTrue()
            {
                assert.isTrue(isEqual(primitive, primitive));
        }));
    });

    suite("non-primitives", function testIsEqualNonPrimitives()
    {
        nonPrimitives.forEach(nonPrimitive =>
            test(`isEqual(${toStr(nonPrimitive)}, ${toStr(nonPrimitive)}) returns true`, function testSameNonPrimitivesReturnTrue()
            {
                assert.isTrue(isEqual(nonPrimitive, nonPrimitive));
        }));
    });

});
