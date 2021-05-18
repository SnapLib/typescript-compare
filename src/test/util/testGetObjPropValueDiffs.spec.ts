import {getObjPropValueDiffs} from "../../main/ts/util/getObjPropValueDiffs";
import {Car, Motorcycle} from "../AutoMobile";
import {Simba, Kion} from "../Lion";
import {assert} from "chai";
import {suite, test} from "mocha";

const mockObjs: ReadonlyArray<{[k: string]: unknown}> = [Car, Motorcycle, Kion, Simba];

suite("TestGetObjPropValueDiffs", function testGetObjPropValueDiffs()
{
    mockObjs.forEach(mockObj =>
        test(`getObjPropValueDiffs(${mockObj}, ${mockObj}) returns empty`, function(){
            assert.isEmpty(getObjPropValueDiffs(mockObj, mockObj));
        })
    );

    suite(`${Car} -> ${Motorcycle}`, function testCarMotorcycleObjPropValueDiffs()
    {
        const diffCarSrcValues =
            [Car.type, Car.numOfWheels, Car.makes, Car.models, Car.isSafe, Car.toString];
        const diffMotorcycleTargetValues =
            [Motorcycle.type, Motorcycle.numOfWheels, Motorcycle.makes, Motorcycle.models, Motorcycle.isSafe, Motorcycle.toString];

        test('Has diff values for keys ["type", "numOfWheels", "makes", "models", "isSafe", "toString"]', function()
        {
          assert.deepStrictEqual(getObjPropValueDiffs(Car, Motorcycle).map(diff => diff.key), ["type", "numOfWheels", "makes", "models", "isSafe", "toString"]);
        });


        test("Has diff source values for Car type, numOfWheels, makes, models, isSafe, and toString", function()
        {
          assert.deepStrictEqual(getObjPropValueDiffs(Car, Motorcycle).map(diff => diff.sourceValue), diffCarSrcValues);
        });


        test("Has diff target values for Motorcycle type, numOfWheels, makes, models, isSafe, and toString", function()
        {
          assert.deepStrictEqual(getObjPropValueDiffs(Car, Motorcycle).map(diff => diff.targetValue), diffMotorcycleTargetValues);
        });
    });

    suite(`${Simba} -> ${Kion}`, function testSimbaKionObjPropValueDiffs()
    {
        const diffSimbaSrcValues =
            [Simba.name, Simba.age, Simba.friends, Simba.family, Simba.isKing, Simba.toString];
        const diffKionTargetValues =
            [Kion.name, Kion.age, Kion.friends, Kion.family, Kion.isKing, Kion.toString];

        test('Has diff values for keys ["name", "age", "friends", "family", "isKing", "toString"]', function()
        {
          assert.deepStrictEqual(getObjPropValueDiffs(Simba, Kion).map(diff => diff.key), ["name", "age", "friends", "family", "isKing", "toString"]);
        });

        test("Has diff source values for Simba name, age, friends, family, isKing, and toString", function()
        {
          assert.deepStrictEqual(getObjPropValueDiffs(Simba, Kion).map(diff => diff.sourceValue), diffSimbaSrcValues);
        });

        test("Has diff target values for Kion name, age, friends, family, isKing, and toString", function()
        {
          assert.deepStrictEqual(getObjPropValueDiffs(Simba, Kion).map(diff => diff.targetValue), diffKionTargetValues);
        });
    });
});
