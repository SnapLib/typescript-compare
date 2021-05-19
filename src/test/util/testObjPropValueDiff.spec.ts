import {ObjPropValueDiff} from "../../main/ts/util/objPropValueDiff";
import {assert} from "chai";
import {suite, test} from "mocha";

const toStr = (o: unknown): string => {return `${typeof o === "string" ? `"${o}"`: o}`;};

const mocks: readonly Readonly<[string, unknown, unknown]>[] =
    [ ["dash", "mash", "vinyl"],
      ["zed", 29, "marklar"],
      ["octi", true, 20] ];

suite("TestObjPropValueDiff", function testObjPropValueDiff()
{
    suite("Test key", function testGetKey()
    {
        mocks.forEach(mock =>
            test(`new ObjPropValueDiff("${mock[0]}", ${toStr(mock[1])}, ${toStr(mock[2])}).key === "${mock[0]}"`, function()
            {
                assert.strictEqual(new ObjPropValueDiff(mock[0], mock[1], mock[2]).key, mock[0]);
            }));
    });

    suite("Test sourceValue", function testGetSourceValue()
    {
        mocks.forEach(mock =>
            test(`new ObjPropValueDiff("${mock[0]}", ${toStr(mock[1])}, ${toStr(mock[2])}).sourceValue === ${toStr(mock[1])}`, function()
            {
                assert.strictEqual(new ObjPropValueDiff(mock[0], mock[1], mock[2]).sourceValue, mock[1]);
            }));
    });

    suite("Test targetValue", function testGetTargetValue()
    {
        mocks.forEach(mock =>
            test(`new ObjPropValueDiff("${mock[0]}", ${toStr(mock[1])}, ${toStr(mock[2])}).sourceValue === ${toStr(mock[2])}`, function()
            {
                assert.strictEqual(new ObjPropValueDiff(mock[0], mock[1], mock[2]).targetValue, mock[2]);
            }));
    });
});
