import {PropertyValueDifference} from "../../../main/ts/compare/propertyValueDifferences/propertyValueDifference";
import {assert} from "chai";
import {suite, test} from "mocha";

const mocks: readonly Readonly<[string, unknown, unknown]>[] =
    [ ["dash", "mash", "vinyl"],
      ["zed", 29, "marklar"],
      ["epona", ["navi", "deku"], {triForce: true, toString: () => "{mockObjA}"}],
      ["zulu", {foo: "bar", toString: () => "{mockObjB}"}, false],
      ["octi", true, 20] ];

const toStr = (o: unknown): string =>
{
    return typeof o === "string" ? `"${o}"`
           : typeof o === "symbol" ? `Symbol("${o.description}")`
           : typeof o === "bigint" ? `BigInt(${o})`
           : Array.isArray(o) ? `[${o.map(e => toStr(e)).join(", ")}]`
           : `${o}`;
};

suite("PropertyValueDifference", function testPropertyValueDifference()
{
    suite("get", function testGet()
    {
        suite("key", function testKey()
        {
            mocks.forEach(mock =>
                test(`new PropertyValueDifference("${mock[0]}", ${toStr(mock[1])}, ${toStr(mock[2])}).key === "${mock[0]}"`, function()
                {
                    assert.strictEqual(new PropertyValueDifference(mock[0], mock[1], mock[2]).key, mock[0]);
                }));
        });

        suite("sourceValue", function testSourceValue()
        {
            mocks.forEach(mock =>
                test(`new PropertyValueDifference("${mock[0]}", ${toStr(mock[1])}, ${toStr(mock[2])}).sourceValue === ${toStr(mock[1])}`, function()
                {
                    assert.strictEqual(new PropertyValueDifference(mock[0], mock[1], mock[2]).sourceValue, mock[1]);
                }));
        });

        suite("targetValue", function testTargetValue()
        {
            mocks.forEach(mock =>
                test(`new PropertyValueDifference("${mock[0]}", ${toStr(mock[1])}, ${toStr(mock[2])}).sourceValue === ${toStr(mock[2])}`, function()
                {
                    assert.strictEqual(new PropertyValueDifference(mock[0], mock[1], mock[2]).targetValue, mock[2]);
                }));
        });
    });

    suite("index", function testGet()
    {
        suite("0", function testKey()
        {
            mocks.forEach(mock =>
                test(`new PropertyValueDifference("${mock[0]}", ${toStr(mock[1])}, ${toStr(mock[2])})[0] === "${mock[0]}"`, function()
                {
                    assert.strictEqual(new PropertyValueDifference(mock[0], mock[1], mock[2])[0], mock[0]);
                }));
        });

        suite("1", function testSourceValue()
        {
            mocks.forEach(mock =>
                test(`new PropertyValueDifference("${mock[0]}", ${toStr(mock[1])}, ${toStr(mock[2])})[1] === ${toStr(mock[1])}`, function()
                {
                    assert.strictEqual(new PropertyValueDifference(mock[0], mock[1], mock[2])[1], mock[1]);
                }));
        });

        suite("2", function testTargetValue()
        {
            mocks.forEach(mock =>
                test(`new PropertyValueDifference("${mock[0]}", ${toStr(mock[1])}, ${toStr(mock[2])})[2] === ${toStr(mock[2])}`, function()
                {
                    assert.strictEqual(new PropertyValueDifference(mock[0], mock[1], mock[2])[2], mock[2]);
                }));
        });
    });
});
