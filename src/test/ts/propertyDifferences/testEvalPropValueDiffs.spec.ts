import {Simba, Kion, Car, Motorcycle, strArrayA, strArrayB, intArrayA, intArrayB} from "../../resources/ts/mock";
import mock from "../../resources/ts/mock";
import {evalPropValueDiffs} from "../../../main/ts/propertyDifferences/evalPropValueDiffs";
import {assert} from "chai";
import {suite, test} from "mocha";

const primitivesExceptString = mock.primitiveSingletons.concat([42, BigInt(999999)]);

const diffCarValues =
    Object.entries(Car).filter(entry => entry[0] !== "fuel").map(entry => entry[1]);
const diffMotoValues =
    Object.entries(Motorcycle).filter(entry => entry[0] !== "fuel").map(entry => entry[1]);
const autoMobileKeysNoFuel =
    mock.automobileKeys.filter(key => key !== "fuel");

const diffSimbaValues =
        [Simba.name, Simba.age, Simba.friends, Simba.family, Simba.isKing, Simba.toString];
const diffKionValues =
    [Kion.name, Kion.age, Kion.friends, Kion.family, Kion.isKing, Kion.toString];
const lionKeysNoGender =
    mock.lionKeys.filter(key => key !== "gender");

const toStr = (o: unknown): string =>
{
    return typeof o === "string" ? `"${o}"`
                  : Array.isArray(o) ? `[${o.map(e => toStr(e)).join(", ")}]`
                  : `${o}`;
};

suite("evalPropValueDiffs()", function testEvalPropValueDiffs()
{
    suite("invalid comparisons", function testInvalidComparisonSourceAndTargetThrows()
    {
        Array.from(primitivesExceptString.entries()).forEach(entry => {
            const primVal = primitivesExceptString[ primitivesExceptString.length - 1 - entry[0]];
            const str = `evalPropValueDiffs(${toStr(entry[1])}, ${toStr(primVal)}) throws error`;
            test(str, function()
            {
                assert.throws(() => evalPropValueDiffs(entry[1], primVal));
            });
        });
    });

    suite("of objects", function testEvalPropValueDiffsOfObjs()
    {
        mock.allMocks.forEach(mock => {
            test(`evalPropValueDiffs(${mock}, ${mock}) is empty`, function()
            {
                assert.isEmpty(evalPropValueDiffs(mock, mock));
            });

            test(`evalPropValueDiffs(${mock}A, ${mock}B) is empty`, function()
            {
                assert.isEmpty(evalPropValueDiffs(mock, {...mock}));
            });

            test(`evalPropValueDiffs(${mock}B, ${mock}A) is empty`, function()
            {
                assert.isEmpty(evalPropValueDiffs({...mock}, mock));
            });
        });

        test("diff keys", function()
        {
          assert.deepStrictEqual(evalPropValueDiffs(Car, Motorcycle).map(diff => diff.key), autoMobileKeysNoFuel);
          assert.deepStrictEqual(evalPropValueDiffs(Motorcycle, Car).map(diff => diff.key), autoMobileKeysNoFuel);
          assert.deepStrictEqual(evalPropValueDiffs(Simba, Kion).map(diff => diff.key), lionKeysNoGender);
          assert.deepStrictEqual(evalPropValueDiffs(Kion, Simba).map(diff => diff.key), lionKeysNoGender);
        });

        test("diff sourceValues", function()
        {
          assert.deepStrictEqual(evalPropValueDiffs(Car, Motorcycle).map(diff => diff.sourceValue), diffCarValues);
          assert.deepStrictEqual(evalPropValueDiffs(Motorcycle, Car).map(diff => diff.sourceValue), diffMotoValues);
          assert.deepStrictEqual(evalPropValueDiffs(Simba, Kion).map(diff => diff.sourceValue), diffSimbaValues);
          assert.deepStrictEqual(evalPropValueDiffs(Kion, Simba).map(diff => diff.sourceValue), diffKionValues);
        });

        test("diff targetValues", function()
        {
          assert.deepStrictEqual(evalPropValueDiffs(Car, Motorcycle).map(diff => diff.targetValue), diffMotoValues);
          assert.deepStrictEqual(evalPropValueDiffs(Motorcycle, Car).map(diff => diff.targetValue), diffCarValues);
          assert.deepStrictEqual(evalPropValueDiffs(Simba, Kion).map(diff => diff.targetValue), diffKionValues);
          assert.deepStrictEqual(evalPropValueDiffs(Kion, Simba).map(diff => diff.targetValue), diffSimbaValues);
        });
    });

    suite("of arrays", function testEvalPropValueDiffsOfArrays()
    {
       suite(`${toStr(strArrayA)} -> ${toStr(strArrayB)}`, function testEvalStrArrayDiff()
        {
            test('diff keys are "0" and "2"', function()
            {
                assert.deepStrictEqual(evalPropValueDiffs(strArrayA, strArrayB).map(diff => diff.key), ["0", "2"]);
            });

            test('diff source values are "first" and "third"', function()
            {
                assert.deepStrictEqual(evalPropValueDiffs(strArrayA, strArrayB).map(diff => diff.sourceValue), ["first", "third"]);
            });

            test('diff target values are "foo" and "baz"', function()
            {
                assert.deepStrictEqual(evalPropValueDiffs(strArrayA, strArrayB).map(diff => diff.targetValue), ["foo", "baz"]);
            });
        });

        suite(`${toStr(strArrayA)} -> ${toStr(intArrayA)}`, function testEvalStrIntArrayDiff()
        {
            test('diff keys are "0", "1", and "2"', function()
            {
                assert.deepStrictEqual(evalPropValueDiffs(strArrayA, intArrayA).map(diff => diff.key), ["0", "1", "2"]);
            });

            test('diff source values are "first", "second", and "third"', function()
            {
                assert.deepStrictEqual(evalPropValueDiffs(strArrayA, intArrayA).map(diff => diff.sourceValue), ["first", "second", "third"]);
            });

            test("diff target values are 111, 222, and 333", function()
            {
                assert.deepStrictEqual(evalPropValueDiffs(strArrayA, intArrayA).map(diff => diff.targetValue), [111, 222, 333]);
            });
        });

        suite("strings", function testEvalPropValueStringDiffs()
        {
            test('evalPropValueDiffs("foo", "foo") is empty', function testEvalPropValueSameStringDiffsReturnEmpty()
            {
                assert.isEmpty(evalPropValueDiffs("foo", "foo"));
            });

            test('evalPropValueDiffs("this", "that") keys are ["2", "3"]', function()
            {
                assert.deepStrictEqual(evalPropValueDiffs("this", "that").map(diff => diff.key), ["2", "3"]);
            });

            test('evalPropValueDiffs("this", "that") keys are ["i", "s"]', function()
            {
                assert.deepStrictEqual(evalPropValueDiffs("this", "that").map(diff => diff.sourceValue), ["i", "s"]);
            });

            test('evalPropValueDiffs("this", "that") keys are ["a", "t"]', function()
            {
                assert.deepStrictEqual(evalPropValueDiffs("this", "that").map(diff => diff.targetValue), ["a", "t"]);
            });
        });

        suite(`${toStr(intArrayA)} -> ${toStr(intArrayB)}`, function testEvalStrIntArrayDiff()
        {
            test('diff keys is "2"', function()
            {
                assert.deepStrictEqual(evalPropValueDiffs(intArrayA, intArrayB).map(diff => diff.key), ["2"]);
            });

            test("diff source value is 333", function()
            {
                assert.deepStrictEqual(evalPropValueDiffs(intArrayA, intArrayB).map(diff => diff.sourceValue), [333]);
            });

            test("diff target value is 999", function()
            {
                assert.deepStrictEqual(evalPropValueDiffs(intArrayA, intArrayB).map(diff => diff.targetValue), [999]);
            });
        });
    });

    suite("object and array", function testEvalObjArrayDiff()
    {
        mock.objects.forEach(mockObj =>
            mock.arrays.forEach(mockArray =>
                test(`{${mockObj}} -> ${toStr(mockArray)} property value diffs are empty`, function()
                {
                    assert.isEmpty(evalPropValueDiffs(mockObj, mockArray));
                })
        ));
    });

    suite("array and object", function testEvalArrayObjDiff()
    {
        mock.arrays.forEach(mockArr =>
            mock.objects.forEach(mockObj =>
                test(`${toStr(mockArr)} -> {${mockObj}} property value diffs are empty`, function()
                {
                    assert.isEmpty(evalPropValueDiffs(mockArr, mockObj));
                })
        ));
    });
});
