import {Simba, Kion, Car, Motorcycle, strArrayA, strArrayB, intArrayA, intArrayB} from "../../resources/ts/mock";
import mock from "../../resources/ts/mock";
import {evalPropValueDiffs} from "../../../main/ts/util/evalPropValueDiffs";
import {assert} from "chai";
import {suite, test} from "mocha";

const automobileKeys = Object.keys(Car);
const lionKeys = Object.keys(Simba);

const diffCarValues =
    [Car.type, Car.numOfWheels, Car.makes, Car.models, Car.isSafe, Car.toString];
const diffMotoValues =
    [Motorcycle.type, Motorcycle.numOfWheels, Motorcycle.makes, Motorcycle.models, Motorcycle.isSafe, Motorcycle.toString];
const autoMobileKeysNoFuel =
    automobileKeys.filter(key => key !== "fuel");

const diffSimbaValues =
        [Simba.name, Simba.age, Simba.friends, Simba.family, Simba.isKing, Simba.toString];
const diffKionValues =
    [Kion.name, Kion.age, Kion.friends, Kion.family, Kion.isKing, Kion.toString];
const lionKeysNoGender =
    lionKeys.filter(key => key !== "gender");

const toStr = (o: unknown): string =>
{
    return typeof o === "string" ? `"${o}"`
                  : Array.isArray(o) ? `[${o.map(e => toStr(e)).join(", ")}]`
                  : `${o}`;
};

suite("evalPropValueDiffs", function testEvalPropValueDiffs()
{
    suite("of objects", function testEvalPropValueDiffsOfObjs()
    {
        mock.allMocks.forEach(mock =>
            test(`evalPropValueDiffs(${mock}, ${mock}) is empty`, function()
            {
                assert.isEmpty(evalPropValueDiffs(mock, mock));
            }));

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
