import mock from "../resources/ts/mock";
import {Compare} from "../../main/ts/compare";
import {assert} from "chai";
import {suite, test} from "mocha";

const validCtorArgs = mock.mockObjsAndArrays.concat(...mock.strArrayA);

const mockObj = Object.freeze(Object.assign( Object.create(null),
{
    prop1: "first",
    prop2: 2,
    prop3: ["third"],
    prop4: true,
    prop5: {innerProp1: 1, innerProp2: "200"}
}));

const toStr = (o: unknown): string =>
{
    return typeof o === "string" ? `"${o}"`
           : typeof o === "symbol" ? `Symbol("${o.description}")`
           : typeof o === "bigint" ? `BigInt(${o})`
           : Array.isArray(o) ? `[${o.map(e => toStr(e)).join(", ")}]`
           : `${o}`;
};

const convertToComparableObj = (o: unknown): {[key: string]: unknown} =>
{
    return typeof o === "string" ? Object.fromEntries(Array.from(o).entries())
         : Array.isArray(o) ? Object.fromEntries(o.entries())
         : o as {[key: string]: unknown};
};

suite("Compare", function testCompare()
{
    suite("source", function testSource()
    {
        validCtorArgs.forEach((mockObj, index, arr) =>
            test(`new Compare(${toStr(mockObj)}, ${toStr(arr[arr.length - 1 - index])}).source === ${toStr(mockObj)}`, function()
            {
                assert.strictEqual(new Compare(mockObj, arr[arr.length - 1 - index]).source, mockObj);
            }));
    });

    suite("target", function testTarget()
    {
        validCtorArgs.forEach((mockObj, index, arr) =>
            test(`new Compare(${toStr(mockObj)}, ${toStr(arr[arr.length - 1 - index])}).target === ${toStr(arr[arr.length - 1 - index])}`, function()
            {
                assert.strictEqual(new Compare(mockObj, arr[arr.length - 1 - index]).target, arr[arr.length - 1 - index]);
            }));
    });

    suite("omittedProperties", function testOmittedProperties()
    {
        validCtorArgs.forEach(mock => {
            test(`new Compare(${toStr(mock)}, ${toStr(mock)}).omittedProperties returns empty`, function()
            {
                assert.isEmpty(new Compare(mock, mock).omittedProperties);
            });

            test(`new Compare(${toStr(mock)}, MockObj).omittedProperties returns ${toStr(convertToComparableObj(mock))}`, function()
            {
                assert.deepStrictEqual(new Compare(mock, mockObj).omittedProperties, convertToComparableObj(mock));
            });

            test(`new Compare(MockObj, ${toStr(mock)}).omittedProperties returns MockObj`, function()
            {
                assert.deepStrictEqual(new Compare(mockObj, mock).omittedProperties, mockObj);
            });
        });
    });

    suite("extraProperties", function testExtraProperties()
    {
        validCtorArgs.forEach(mock => {
            test(`new Compare(${toStr(mock)}, ${toStr(mock)}).extraProperties returns empty`, function()
            {
                assert.isEmpty(new Compare(mock, mock).extraProperties);
            });

            test(`new Compare(${toStr(mock)}, MockObj).extraProperties returns MockObj`, function()
            {
                assert.deepStrictEqual(new Compare(mock, mockObj).extraProperties, mockObj);
            });

            test(`new Compare(MockObj, ${toStr(mock)}).extraProperties returns ${toStr(convertToComparableObj(mock))}`, function()
            {
                assert.deepStrictEqual(new Compare(mockObj, mock).extraProperties, convertToComparableObj(mock));
            });
        });
    });

    suite("sharedProperties", function testSharedProperties()
    {
        validCtorArgs.forEach(mock => {
            test(`new Compare(${toStr(mock)}, MockObj).sharedProperties returns empty`, function()
            {
                assert.isEmpty(new Compare(mock, mockObj).sharedProperties);
            });

            test(`new Compare(MockObj, ${toStr(mock)}).sharedProperties returns empty`, function()
            {
                assert.isEmpty(new Compare(mockObj, mock).sharedProperties);
            });

            test(`new Compare(${toStr(mock)}, ${toStr(mock)}).sharedProperties returns ${toStr(convertToComparableObj(mock))}`, function()
            {
                assert.deepStrictEqual(new Compare(mock, mock).sharedProperties, convertToComparableObj(mock));
            });
        });

        mock.automobiles.forEach((automobile, index, arr) =>
            test(`new Compare(${automobile}, ${arr[arr.length - 1 - index]}).sharedProperties returns {fuel: "petrol"}`, function()
            {
                assert.deepStrictEqual(new Compare(automobile, arr[arr.length - 1 - index]).sharedProperties, {fuel: "petrol"});
        }));

        mock.lions.forEach((lion, index, arr) =>
            test(`new Compare(${lion}, ${arr[arr.length - 1 - index]}).sharedProperties returns {gender: "male"}`, function()
            {
                assert.deepStrictEqual(new Compare(lion, arr[arr.length - 1 - index]).sharedProperties, {gender: "male"});
        }));
    });
});
