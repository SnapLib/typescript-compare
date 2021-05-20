import {Car, Motorcycle} from "./AutoMobile";
import {Simba, Kion} from "./Lion";
import {ObjectComparer} from "../main/ts/objectComparer";
import {assert} from "chai";
import {suite, test} from "mocha";

const mockStrArrayA: unknown[] = ["first", "second", "third"];

const mockStrArrayB: unknown[] = ["foo", "second", "baz"];

const mockIntArrayA: unknown[] = [111, 222, 333];

const mockIntArrayB: unknown[] = [111, 222, 999];

const mockArrays: readonly Readonly<unknown[]>[] =
    Object.freeze([mockStrArrayA, mockStrArrayB, mockIntArrayA, mockIntArrayB]);

const mockObjs: readonly Readonly<unknown>[] =
    Object.freeze([Car, Motorcycle, Simba, Kion]);

const mockAutomobileObjs: ReadonlyArray<unknown> =
    Object.freeze([Car, Motorcycle]);

const mockLionObjs: ReadonlyArray<unknown> =
    Object.freeze([Simba, Kion]);

const automobileKeys: ReadonlyArray<string> = Object.freeze(Object.keys(Car));
const lionKeys: ReadonlyArray<string> = Object.freeze(Object.keys(Simba));

const toStr = (o: unknown): string =>
{
    return typeof o === "string" ? `"${o}"`
           : Array.isArray(o) ? `[${o.map(e => toStr(e)).join(", ")}]`
           : `${o}`;
};

suite("TestObjectComparer", function testObjectComparer()
{
    suite("Valid ObjectComparer construction does not throw", function testValidObjectComparerCtor()
    {
        mockObjs.forEach(mockObj1 =>
            mockObjs.forEach(mockObj2 =>
                test(`new ObjectComparer(${mockObj1}, ${mockObj2}) does not throw`, function()
                {
                    assert.doesNotThrow(() => new ObjectComparer(mockObj1, mockObj2));
                })
        ));
    });

    suite("Test getters", function testGetters()
    {
        suite("get sourceObject()", function testGetSourceObject()
        {
            mockObjs.forEach(mockObj1 =>
                mockObjs.forEach(mockObj2 =>
                    test(`new ObjectComparer(${mockObj1}, ${mockObj2}).sourceObject === ${mockObj1}`, function()
                    {
                        assert.strictEqual(new ObjectComparer(mockObj1, mockObj2).sourceObject, mockObj1);
                    })
            ));
        });

        suite("get targetObject()", function testGetTargetObject()
        {
            mockObjs.forEach(mockObj1 =>
                mockObjs.forEach(mockObj2 =>
                    test(`new ObjectComparer(${mockObj1}, ${mockObj2}).targetObject === ${mockObj2}`, function()
                    {
                        assert.strictEqual(new ObjectComparer(mockObj1, mockObj2).targetObject, mockObj2);
                    })
            ));
        });

        suite("get omittedKeys()", function testGetOmittedKeys()
        {
            mockAutomobileObjs.forEach(mockAutomobileObj1 =>
                mockAutomobileObjs.forEach(mockAutomobileObj2 =>
                    test(`new ObjectComparer(${mockAutomobileObj1}, ${mockAutomobileObj2}).omittedKeys is empty`, function()
                    {
                        assert.isEmpty(new ObjectComparer(mockAutomobileObj1, mockAutomobileObj2).omittedKeys);
                    })
            ));

            mockLionObjs.forEach(mockLionObj1 =>
                mockLionObjs.forEach(mockLionObj2 =>
                    test(`new ObjectComparer(${mockLionObj1}, ${mockLionObj2}).omittedKeys is empty`, function()
                    {
                        assert.isEmpty(new ObjectComparer(mockLionObj1, mockLionObj2).omittedKeys);
                    })
            ));

            mockAutomobileObjs.forEach(mockAutomobileObj =>
                    mockLionObjs.forEach(mockLionObj => {
                        test(`new ObjectComparer(${mockAutomobileObj}, ${mockLionObj}).omittedKeys === Object.keys(${mockAutomobileObj})`, function()
                        {
                            assert.deepStrictEqual(new ObjectComparer(mockAutomobileObj, mockLionObj).omittedKeys, automobileKeys.filter(key => key !== "toString"));
                        });

                        test(`new ObjectComparer(${mockLionObj}, ${mockAutomobileObj}).omittedKeys === Object.keys(${mockLionObj})`, function()
                        {
                            assert.deepStrictEqual(new ObjectComparer(mockLionObj, mockAutomobileObj).omittedKeys, lionKeys.filter(key => key !== "toString"));
                        });
                    }
            ));
        });

        suite("get addedKeys()", function testGetAddedKeys()
        {
            mockAutomobileObjs.forEach(mockAutomobileObj1 =>
                mockAutomobileObjs.forEach(mockAutomobileObj2 =>
                    test(`new ObjectComparer(${mockAutomobileObj1}, ${mockAutomobileObj2}).addedKeys is empty`, function()
                    {
                        assert.isEmpty(new ObjectComparer(mockAutomobileObj1, mockAutomobileObj2).addedKeys);
                    })
            ));

            mockLionObjs.forEach(mockLionObj1 =>
                mockLionObjs.forEach(mockLionObj2 =>
                    test(`new ObjectComparer(${mockLionObj1}, ${mockLionObj2}).addedKeys is empty`, function()
                    {
                        assert.isEmpty(new ObjectComparer(mockLionObj1, mockLionObj2).addedKeys);
                    })
            ));

            mockAutomobileObjs.forEach(mockAutomobileObj =>
                    mockLionObjs.forEach(mockLionObj => {
                        test(`new ObjectComparer(${mockAutomobileObj}, ${mockAutomobileObj} & ${mockLionObj}).addedKeys === ["${lionKeys.join('", "')}"]`, function()
                        {
                            assert.deepStrictEqual(new ObjectComparer(mockAutomobileObj, Object.assign({}, mockAutomobileObj, mockLionObj)).addedKeys, lionKeys.filter(key => key !== "toString"));
                        });

                        test(`new ObjectComparer(${mockLionObj}, ${mockAutomobileObj}).addedKeys === ["${automobileKeys.join('", "')}"]`, function()
                        {
                            assert.deepStrictEqual(new ObjectComparer(mockLionObj, Object.assign({}, mockLionObj, mockAutomobileObj)).addedKeys, automobileKeys.filter(key => key !== "toString"));
                        });
                    }
            ));
        });

        suite("get includedKeys()", function testGetIncludedKeys()
        {
            mockAutomobileObjs.forEach(mockAutomobileObj =>
                mockLionObjs.forEach(mockLionObj =>{
                    test(`new ObjectComparer(${mockAutomobileObj}, ${mockLionObj}).includedKeys === ["toString"]`, function()
                    {
                        assert.deepStrictEqual(new ObjectComparer(mockAutomobileObj, mockLionObj).includedKeys, ["toString"]);
                    });

                    test(`new ObjectComparer(${mockLionObj}, ${mockAutomobileObj}).includedKeys === ["toString"]`, function()
                    {
                        assert.deepStrictEqual(new ObjectComparer(mockLionObj, mockAutomobileObj).includedKeys, ["toString"]);
                    });}
            ));

            mockAutomobileObjs.forEach(mockAutomobileObj1 =>
                mockAutomobileObjs.forEach(mockAutomobileObj2 =>
                        test(`new ObjectComparer(${mockAutomobileObj1}, ${mockAutomobileObj2}).includedKeys === Object.keys(${mockAutomobileObj1})`, function()
                        {
                            assert.deepStrictEqual(new ObjectComparer(mockAutomobileObj1, mockAutomobileObj2).includedKeys, automobileKeys);
                        })
            ));

            mockLionObjs.forEach(mockLionObj1 =>
                mockLionObjs.forEach(mockLionObj2 =>
                    test(`new ObjectComparer(${mockLionObj1}, ${mockLionObj2}).includedKeys === Object.keys(${mockLionObj1})`, function()
                    {
                        assert.deepStrictEqual(new ObjectComparer(mockLionObj1, mockLionObj2).includedKeys, lionKeys);
                    })
            ));
        });

        suite("get alteredPropValueDiffs()", function testGetAlteredPropValueDiffs()
        {
            suite("same target and source object returns empty", function testSameObjectsReturnEmpty()
            {
                mockObjs.forEach(mockObj =>
                test(`new ObjectComparer(${mockObj}, ${mockObj}).alteredKeyValueDiffs is empty`, function()
                {
                    assert.isEmpty(new ObjectComparer(mockObj, mockObj).alteredKeyValueDiffs);
                }));
            });

            suite(`${Car} -> ${Motorcycle}`, function testCarMotorcycleAlteredPropValueDiffs()
            {
                const diffCarSrcValues =
                    [Car.type, Car.numOfWheels, Car.makes, Car.models, Car.isSafe, Car.toString];
                const diffMotorcycleTargetValues =
                    [Motorcycle.type, Motorcycle.numOfWheels, Motorcycle.makes, Motorcycle.models, Motorcycle.isSafe, Motorcycle.toString];

                test('Diff values for keys "type", "numOfWheels", "makes", "models", "isSafe", and "toString"', function()
                {
                  assert.deepStrictEqual(new ObjectComparer(Car, Motorcycle).alteredKeyValueDiffs.map(diff => diff.key), ["type", "numOfWheels", "makes", "models", "isSafe", "toString"]);
                });

                test("Diff source values for Car type, numOfWheels, makes, models, isSafe, and toString", function()
                {
                  assert.deepStrictEqual(new ObjectComparer(Car, Motorcycle).alteredKeyValueDiffs.map(diff => diff.sourceValue), diffCarSrcValues);
                });

                test("Diff target values for Motorcycle type, numOfWheels, makes, models, isSafe, and toString", function()
                {
                  assert.deepStrictEqual(new ObjectComparer(Car, Motorcycle).alteredKeyValueDiffs.map(diff => diff.targetValue), diffMotorcycleTargetValues);
                });
            });

            suite(`${Simba} -> ${Kion}`, function testSimbaKionAlteredPropValueDiffs()
            {
                const diffSimbaSrcValues =
                    [Simba.name, Simba.age, Simba.friends, Simba.family, Simba.isKing, Simba.toString];
                const diffKionTargetValues =
                    [Kion.name, Kion.age, Kion.friends, Kion.family, Kion.isKing, Kion.toString];

                test('Diff keys are "name", "age", "friends", "family", "isKing", and "toString"', function()
                {
                  assert.deepStrictEqual(new ObjectComparer(Simba, Kion).alteredKeyValueDiffs.map(diff => diff.key), ["name", "age", "friends", "family", "isKing", "toString"]);
                });

                test("Diff source values for Simba name, age, friends, family, isKing, and toString", function()
                {
                  assert.deepStrictEqual(new ObjectComparer(Simba, Kion).alteredKeyValueDiffs.map(diff => diff.sourceValue), diffSimbaSrcValues);
                });

                test("Diff target values for Kion name, age, friends, family, isKing, and toString", function()
                {
                  assert.deepStrictEqual(new ObjectComparer(Simba, Kion).alteredKeyValueDiffs.map(diff => diff.targetValue), diffKionTargetValues);
                });
            });

            suite(`${toStr(mockStrArrayA)} -> ${toStr(mockStrArrayB)}`, function testFirstAndThirdIndexStrDiff()
            {
                test('Diff keys are "0" and "2"', function()
                {
                    assert.deepStrictEqual(new ObjectComparer(mockStrArrayA, mockStrArrayB).alteredKeyValueDiffs.map(diff => diff.key), ["0", "2"]);
                });

                test('Diff source values are "first" and "third"', function()
                {
                    assert.deepStrictEqual(new ObjectComparer(mockStrArrayA, mockStrArrayB).alteredKeyValueDiffs.map(diff => diff.sourceValue), ["first", "third"]);
                });

                test('Diff target values are "foo" and "baz"', function()
                {
                    assert.deepStrictEqual(new ObjectComparer(mockStrArrayA, mockStrArrayB).alteredKeyValueDiffs.map(diff => diff.targetValue), ["foo", "baz"]);
                });
            });

            suite(`${toStr(mockStrArrayA)} -> ${toStr(mockIntArrayA)}`, function testStrIntArrayDiff()
            {
                test('Diff keys are "0", "1", and "2"', function()
                {
                    assert.deepStrictEqual(new ObjectComparer(mockStrArrayA, mockIntArrayA).alteredKeyValueDiffs.map(diff => diff.key), ["0", "1", "2"]);
                });

                test('Diff source values are "first", "second", and "third"', function()
                {
                    assert.deepStrictEqual(new ObjectComparer(mockStrArrayA, mockIntArrayA).alteredKeyValueDiffs.map(diff => diff.sourceValue), ["first", "second", "third"]);
                });

                test("Diff target values are 111, 222, and 333", function()
                {
                    assert.deepStrictEqual(new ObjectComparer(mockStrArrayA, mockIntArrayA).alteredKeyValueDiffs.map(diff => diff.targetValue), [111, 222, 333]);
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
                                assert.isEmpty(new ObjectComparer(mockObj, mockArray).alteredKeyValueDiffs.map(diff => diff.key));
                            })
                    ));
                });

                suite("returns empty diff source values", function testObjArrayDiffSourceValue()
                {
                    mockObjs.forEach(mockObj =>
                        mockArrays.forEach(mockArray =>
                            test(`${mockObj} -> ${toStr(mockArray)} returns no source values`, function()
                            {
                                assert.isEmpty(new ObjectComparer(mockObj, mockArray).alteredKeyValueDiffs.map(diff => diff.sourceValue));
                            })
                    ));
                });

                suite("returns empty diff target values", function testObjArrayDiffTargetValue()
                {
                    mockObjs.forEach(mockObj =>
                        mockArrays.forEach(mockArray =>
                            test(`${mockObj} -> ${toStr(mockArray)} returns no target values`, function()
                            {
                                assert.isEmpty(new ObjectComparer(mockObj, mockArray).alteredKeyValueDiffs.map(diff => diff.targetValue));
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
                                assert.isEmpty(new ObjectComparer(mockArr, mockObj).alteredKeyValueDiffs.map(diff => diff.key));
                            })
                    ));
                });

                suite("returns empty diff source value", function testArrayObjDiffSourceValue()
                {
                    mockArrays.forEach(mockArr =>
                        mockObjs.forEach(mockObj =>
                            test(`${toStr(mockArr)} -> ${mockObj} returns no source values`, function()
                            {
                                assert.isEmpty(new ObjectComparer(mockArr, mockObj).alteredKeyValueDiffs.map(diff => diff.sourceValue));
                            })
                    ));
                });

                suite("returns empty diff target value", function testArrayObjDiffTargetValue()
                {
                    mockArrays.forEach(mockArr =>
                        mockObjs.forEach(mockObj =>
                            test(`${toStr(mockArr)} -> ${mockObj} returns no target values`, function()
                            {
                                assert.isEmpty(new ObjectComparer(mockArr, mockObj).alteredKeyValueDiffs.map(diff => diff.targetValue));
                            })
                    ));
                });
            });
        });
    });
});
