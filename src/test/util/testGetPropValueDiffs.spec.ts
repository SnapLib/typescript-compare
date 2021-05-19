import {getPropValueDiffs} from "../../main/ts/util/getPropValueDiffs";
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

suite("TestGetPropValueDiffs", function testGetPropValueDiffs()
{
    mocks.forEach(mockObj =>
        test(`getPropValueDiffs(${mockObj}, ${mockObj}) returns empty`, function(){
            assert.isEmpty(getPropValueDiffs(mockObj, mockObj));
        })
    );

    suite(`${Car} -> ${Motorcycle}`, function testCarMotorcycleObjPropValueDiffs()
    {
        const diffCarSrcValues =
            [Car.type, Car.numOfWheels, Car.makes, Car.models, Car.isSafe, Car.toString];
        const diffMotorcycleTargetValues =
            [Motorcycle.type, Motorcycle.numOfWheels, Motorcycle.makes, Motorcycle.models, Motorcycle.isSafe, Motorcycle.toString];

        test('Diff values for keys "type", "numOfWheels", "makes", "models", "isSafe", and "toString"', function()
        {
          assert.deepStrictEqual(getPropValueDiffs(Car, Motorcycle).map(diff => diff.key), ["type", "numOfWheels", "makes", "models", "isSafe", "toString"]);
        });

        test("Diff source values for Car type, numOfWheels, makes, models, isSafe, and toString", function()
        {
          assert.deepStrictEqual(getPropValueDiffs(Car, Motorcycle).map(diff => diff.sourceValue), diffCarSrcValues);
        });

        test("Diff target values for Motorcycle type, numOfWheels, makes, models, isSafe, and toString", function()
        {
          assert.deepStrictEqual(getPropValueDiffs(Car, Motorcycle).map(diff => diff.targetValue), diffMotorcycleTargetValues);
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
          assert.deepStrictEqual(getPropValueDiffs(Simba, Kion).map(diff => diff.key), ["name", "age", "friends", "family", "isKing", "toString"]);
        });

        test("Diff source values for Simba name, age, friends, family, isKing, and toString", function()
        {
          assert.deepStrictEqual(getPropValueDiffs(Simba, Kion).map(diff => diff.sourceValue), diffSimbaSrcValues);
        });

        test("Diff target values for Kion name, age, friends, family, isKing, and toString", function()
        {
          assert.deepStrictEqual(getPropValueDiffs(Simba, Kion).map(diff => diff.targetValue), diffKionTargetValues);
        });
    });

    suite(`["${mockStrArrayA.join('", "')}"] -> ["${mockStrArrayB.join('", "')}"]`, function testSecondIndexStrDiff()
    {
        test('Diff keys are "0" and "2"', function()
        {
            assert.deepStrictEqual(getPropValueDiffs(mockStrArrayA, mockStrArrayB).map(diff => diff.key), ["0", "2"]);
        });

        test('Diff source values are "first" and "third"', function()
        {
            assert.deepStrictEqual(getPropValueDiffs(mockStrArrayA, mockStrArrayB).map(diff => diff.sourceValue), ["first", "third"]);
        });

        test('Diff target values are "foo" and "baz"', function()
        {
            assert.deepStrictEqual(getPropValueDiffs(mockStrArrayA, mockStrArrayB).map(diff => diff.targetValue), ["foo", "baz"]);
        });
    });

    suite(`[${mockIntArrayA.join(", ")}] -> [${mockIntArrayB.join(", ")}]`, function testThirdIndexIntDiff()
    {
        test('Diff key is "2"', function()
        {
            assert.deepStrictEqual(getPropValueDiffs(mockIntArrayA, mockIntArrayB).map(diff => diff.key), ["2"]);
        });

        test("Diff source value is 333", function()
        {
            assert.deepStrictEqual(getPropValueDiffs(mockIntArrayA, mockIntArrayB).map(diff => diff.sourceValue), [333]);
        });

        test("Diff target values is 999", function()
        {
            assert.deepStrictEqual(getPropValueDiffs(mockIntArrayA, mockIntArrayB).map(diff => diff.targetValue), [999]);
        });
    });

    suite(`["${mockStrArrayA.join('", "')}"] -> [${mockIntArrayA.join(", ")}]`, function testSecondIndexStrDiff()
    {
        test('Diff keys are "0", "1", and "2"', function()
        {
            assert.deepStrictEqual(getPropValueDiffs(mockStrArrayA, mockIntArrayA).map(diff => diff.key), ["0", "1", "2"]);
        });

        test('Diff source values are "first", "second", and "third"', function()
        {
            assert.deepStrictEqual(getPropValueDiffs(mockStrArrayA, mockIntArrayA).map(diff => diff.sourceValue), ["first", "second", "third"]);
        });

        test("Diff target values are 111, 222, and 333", function()
        {
            assert.deepStrictEqual(getPropValueDiffs(mockStrArrayA, mockIntArrayA).map(diff => diff.targetValue), [111, 222, 333]);
        });
    });
});
