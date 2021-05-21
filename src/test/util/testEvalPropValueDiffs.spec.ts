import {evalPropValueDiffs} from "../../main/ts/util/evalPropValueDiffs";
import {Car, Motorcycle} from "../AutoMobile";
import {Simba, Kion} from "../Lion";
import {assert} from "chai";
import {suite, test} from "mocha";

const mockStrArrayA: unknown[] = ["first", "second", "third"];

const mockStrArrayB: unknown[] = ["foo", "second", "baz"];

const mockIntArrayA: unknown[] = [111, 222, 333];

const mockIntArrayB: unknown[] = [111, 222, 999];

const mocks: ReadonlyArray<unknown> =
    [Car, Motorcycle, Kion, Simba,
     mockStrArrayA, mockStrArrayB, mockIntArrayA, mockIntArrayB];

const mockObjs: readonly Readonly<unknown>[] =
    Object.freeze([Car, Motorcycle, Kion, Simba]);

const mockArrays: readonly Readonly<unknown[]>[] =
    Object.freeze([mockStrArrayA, mockStrArrayB, mockIntArrayA, mockIntArrayB]);

const toStr = (o: unknown): string =>
{
    return typeof o === "string" ? `"${o}"`
                  : Array.isArray(o) ? `[${o.map(e => toStr(e)).join(", ")}]`
                  : `${o}`;
};

suite("evalPropValueDiffs", function testEvalPropValueDiffs()
{
    suite("Same objects return empty diff", function testSameObjsReturnEmpty()
    {
        mocks.forEach(mockObj =>
            test(`evalPropValueDiffs(${toStr(mockObj)}, ${toStr(mockObj)}) returns empty`, function(){
                assert.isEmpty(evalPropValueDiffs(mockObj, mockObj));
            })
        );
    });

    suite(`${Car} -> ${Motorcycle}`, function testCarMotorcycleObjPropValueDiffs()
    {
        const diffCarSrcValues =
            [Car.type, Car.numOfWheels, Car.makes, Car.models, Car.isSafe, Car.toString];
        const diffMotorcycleTargetValues =
            [Motorcycle.type, Motorcycle.numOfWheels, Motorcycle.makes, Motorcycle.models, Motorcycle.isSafe, Motorcycle.toString];

        test('Diff values for keys "type", "numOfWheels", "makes", "models", "isSafe", and "toString"', function()
        {
          assert.deepStrictEqual(evalPropValueDiffs(Car, Motorcycle).map(diff => diff.key), ["type", "numOfWheels", "makes", "models", "isSafe", "toString"]);
        });

        test("Diff source values for Car type, numOfWheels, makes, models, isSafe, and toString", function()
        {
          assert.deepStrictEqual(evalPropValueDiffs(Car, Motorcycle).map(diff => diff.sourceValue), diffCarSrcValues);
        });

        test("Diff target values for Motorcycle type, numOfWheels, makes, models, isSafe, and toString", function()
        {
          assert.deepStrictEqual(evalPropValueDiffs(Car, Motorcycle).map(diff => diff.targetValue), diffMotorcycleTargetValues);
        });
    });

    suite(`${Simba} -> ${Kion}`, function testSimbaKionObjPropValueDiffs()
    {
        const diffSimbaSrcValues =
            [Simba.name, Simba.age, Simba.friends, Simba.family, Simba.isKing, Simba.toString];
        const diffKionTargetValues =
            [Kion.name, Kion.age, Kion.friends, Kion.family, Kion.isKing, Kion.toString];

        test('Diff keys are "name", "age", "friends", "family", "isKing", and "toString"', function()
        {
          assert.deepStrictEqual(evalPropValueDiffs(Simba, Kion).map(diff => diff.key), ["name", "age", "friends", "family", "isKing", "toString"]);
        });

        test("Diff source values for Simba name, age, friends, family, isKing, and toString", function()
        {
          assert.deepStrictEqual(evalPropValueDiffs(Simba, Kion).map(diff => diff.sourceValue), diffSimbaSrcValues);
        });

        test("Diff target values for Kion name, age, friends, family, isKing, and toString", function()
        {
          assert.deepStrictEqual(evalPropValueDiffs(Simba, Kion).map(diff => diff.targetValue), diffKionTargetValues);
        });
    });

    suite(`${toStr(mockStrArrayA)} -> ${toStr(mockStrArrayB)}`, function testFirstAndThirdIndexStrDiff()
    {
        test('Diff keys are "0" and "2"', function()
        {
            assert.deepStrictEqual(evalPropValueDiffs(mockStrArrayA, mockStrArrayB).map(diff => diff.key), ["0", "2"]);
        });

        test('Diff source values are "first" and "third"', function()
        {
            assert.deepStrictEqual(evalPropValueDiffs(mockStrArrayA, mockStrArrayB).map(diff => diff.sourceValue), ["first", "third"]);
        });

        test('Diff target values are "foo" and "baz"', function()
        {
            assert.deepStrictEqual(evalPropValueDiffs(mockStrArrayA, mockStrArrayB).map(diff => diff.targetValue), ["foo", "baz"]);
        });
    });

    suite(`${toStr(mockIntArrayA)} -> ${toStr(mockIntArrayB)}`, function testThirdIndexIntDiff()
    {
        test('Diff key is "2"', function()
        {
            assert.deepStrictEqual(evalPropValueDiffs(mockIntArrayA, mockIntArrayB).map(diff => diff.key), ["2"]);
        });

        test("Diff source value is 333", function()
        {
            assert.deepStrictEqual(evalPropValueDiffs(mockIntArrayA, mockIntArrayB).map(diff => diff.sourceValue), [333]);
        });

        test("Diff target values is 999", function()
        {
            assert.deepStrictEqual(evalPropValueDiffs(mockIntArrayA, mockIntArrayB).map(diff => diff.targetValue), [999]);
        });
    });

    suite(`${toStr(mockStrArrayA)} -> ${toStr(mockIntArrayA)}`, function testStrIntArrayDiff()
    {
        test('Diff keys are "0", "1", and "2"', function()
        {
            assert.deepStrictEqual(evalPropValueDiffs(mockStrArrayA, mockIntArrayA).map(diff => diff.key), ["0", "1", "2"]);
        });

        test('Diff source values are "first", "second", and "third"', function()
        {
            assert.deepStrictEqual(evalPropValueDiffs(mockStrArrayA, mockIntArrayA).map(diff => diff.sourceValue), ["first", "second", "third"]);
        });

        test("Diff target values are 111, 222, and 333", function()
        {
            assert.deepStrictEqual(evalPropValueDiffs(mockStrArrayA, mockIntArrayA).map(diff => diff.targetValue), [111, 222, 333]);
        });
    });

    suite("Test object to array comparison returns empty", function testObjArrayDiff()
    {
        suite("returns empty diff keys", function testObjArrayDiffKey()
        {
            mockObjs.forEach(mockObj =>
                mockArrays.forEach(mockArray =>
                    test(`${mockObj} -> ${toStr(mockArray)} keys are empty`, function()
                    {
                        assert.isEmpty(evalPropValueDiffs(mockObj, mockArray).map(diff => diff.key));
                    })
            ));
        });

        suite("returns empty diff source values", function testObjArrayDiffSourceValue()
        {
            mockObjs.forEach(mockObj =>
                mockArrays.forEach(mockArray =>
                    test(`${mockObj} -> ${toStr(mockArray)} returns no source values`, function()
                    {
                        assert.isEmpty(evalPropValueDiffs(mockObj, mockArray).map(diff => diff.sourceValue));
                    })
            ));
        });

        suite("returns empty diff target values", function testObjArrayDiffTargetValue()
        {
            mockObjs.forEach(mockObj =>
                mockArrays.forEach(mockArray =>
                    test(`${mockObj} -> ${toStr(mockArray)} returns no target values`, function()
                    {
                        assert.isEmpty(evalPropValueDiffs(mockObj, mockArray).map(diff => diff.targetValue));
                    })
            ));
        });
    });

    suite("Test array to object comparison returns empty", function testArrayObjDiff()
    {
        suite("returns empty diff keys", function testArrayObjDiffKey()
        {
            mockArrays.forEach(mockArr =>
                mockObjs.forEach(mockObj =>
                    test(`${toStr(mockArr)} -> ${mockObj} returns no keys`, function()
                    {
                        assert.isEmpty(evalPropValueDiffs(mockArr, mockObj).map(diff => diff.key));
                    })
            ));
        });

        suite("returns empty diff source value", function testArrayObjDiffSourceValue()
        {
            mockArrays.forEach(mockArr =>
                mockObjs.forEach(mockObj =>
                    test(`${toStr(mockArr)} -> ${mockObj} returns no source values`, function()
                    {
                        assert.isEmpty(evalPropValueDiffs(mockArr, mockObj).map(diff => diff.sourceValue));
                    })
            ));
        });

        suite("returns empty diff target value", function testArrayObjDiffTargetValue()
        {
            mockArrays.forEach(mockArr =>
                mockObjs.forEach(mockObj =>
                    test(`${toStr(mockArr)} -> ${mockObj} returns no target values`, function()
                    {
                        assert.isEmpty(evalPropValueDiffs(mockArr, mockObj).map(diff => diff.targetValue));
                    })
            ));
        });
    });
});
