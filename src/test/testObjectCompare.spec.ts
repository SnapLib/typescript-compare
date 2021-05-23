import {Car, Motorcycle} from "./AutoMobile";
import {Simba, Kion} from "./Lion";
import {ObjectCompare} from "../main/ts/lib/objectCompare";
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
const automobileKeysNoToStr: ReadonlyArray<string> = Object.freeze(automobileKeys.filter(key => key !== "toString"));
const lionKeys: ReadonlyArray<string> = Object.freeze(Object.keys(Simba));
const lionKeysNoToStr: ReadonlyArray<string> = Object.freeze(lionKeys.filter(key => key !== "toString"));

const toStr = (o: unknown): string =>
{
    return typeof o === "string" ? `"${o}"`
           : Array.isArray(o) ? `[${o.map(e => toStr(e)).join(", ")}]`
           : `${o}`;
};

suite("ObjectComparer", function testObjectComparer()
{
    suite("new ObjectCompare(NonNullable<unknown>, NonNullable<unknown>)", function testValidObjectComparerCtor()
    {
        mockObjs.forEach(mockObj1 =>
            mockObjs.forEach(mockObj2 =>
                test(`new ObjectComparer(${mockObj1}, ${mockObj2}) does not throw`, function()
                {
                    assert.doesNotThrow(() => new ObjectCompare(mockObj1, mockObj2));
                })
        ));
    });

    suite("get", function testGetters()
    {
        suite("sourceObject", function testGetSourceObject()
        {
            mockObjs.forEach(mockObj1 =>
                mockObjs.forEach(mockObj2 =>
                    test(`new ObjectComparer(${mockObj1}, ${mockObj2}).sourceObject === ${mockObj1}`, function()
                    {
                        assert.strictEqual(new ObjectCompare(mockObj1, mockObj2).sourceObject, mockObj1);
                    })
            ));
        });

        suite("targetObject", function testGetTargetObject()
        {
            mockObjs.forEach(mockObj1 =>
                mockObjs.forEach(mockObj2 =>
                    test(`new ObjectComparer(${mockObj1}, ${mockObj2}).targetObject === ${mockObj2}`, function()
                    {
                        assert.strictEqual(new ObjectCompare(mockObj1, mockObj2).targetObject, mockObj2);
                    })
            ));
        });

        suite("omittedKeys", function testGetOmittedKeys()
        {
            mockAutomobileObjs.forEach(mockAutomobileObj1 =>
                mockAutomobileObjs.forEach(mockAutomobileObj2 =>
                    test(`new ObjectComparer(${mockAutomobileObj1}, ${mockAutomobileObj2}).omittedKeys is empty`, function()
                    {
                        assert.isEmpty(new ObjectCompare(mockAutomobileObj1, mockAutomobileObj2).omittedKeys);
                    })
            ));

            mockLionObjs.forEach(mockLionObj1 =>
                mockLionObjs.forEach(mockLionObj2 =>
                    test(`new ObjectComparer(${mockLionObj1}, ${mockLionObj2}).omittedKeys is empty`, function()
                    {
                        assert.isEmpty(new ObjectCompare(mockLionObj1, mockLionObj2).omittedKeys);
                    })
            ));

            mockAutomobileObjs.forEach(mockAutomobileObj =>
                    mockLionObjs.forEach(mockLionObj => {
                        test(`new ObjectComparer(${mockAutomobileObj}, ${mockLionObj}).omittedKeys === ${toStr(automobileKeysNoToStr)}`, function()
                        {
                            assert.deepStrictEqual(new ObjectCompare(mockAutomobileObj, mockLionObj).omittedKeys, automobileKeysNoToStr);
                        });

                        test(`new ObjectComparer(${mockLionObj}, ${mockAutomobileObj}).omittedKeys === ${toStr(lionKeysNoToStr)}`, function()
                        {
                            assert.deepStrictEqual(new ObjectCompare(mockLionObj, mockAutomobileObj).omittedKeys, lionKeysNoToStr);
                        });
                    }
            ));
        });

        suite("addedKeys", function testGetAddedKeys()
        {
            mockAutomobileObjs.forEach(mockAutomobileObj1 =>
                mockAutomobileObjs.forEach(mockAutomobileObj2 =>
                    test(`new ObjectComparer(${mockAutomobileObj1}, ${mockAutomobileObj2}).addedKeys is empty`, function()
                    {
                        assert.isEmpty(new ObjectCompare(mockAutomobileObj1, mockAutomobileObj2).addedKeys);
                    })
            ));

            mockLionObjs.forEach(mockLionObj1 =>
                mockLionObjs.forEach(mockLionObj2 =>
                    test(`new ObjectComparer(${mockLionObj1}, ${mockLionObj2}).addedKeys is empty`, function()
                    {
                        assert.isEmpty(new ObjectCompare(mockLionObj1, mockLionObj2).addedKeys);
                    })
            ));

            mockAutomobileObjs.forEach(mockAutomobileObj =>
                    mockLionObjs.forEach(mockLionObj => {
                        test(`new ObjectComparer(${mockAutomobileObj}, ${mockAutomobileObj} & ${mockLionObj}).addedKeys === ${toStr(lionKeysNoToStr)}`, function()
                        {
                            assert.deepStrictEqual(new ObjectCompare(mockAutomobileObj, Object.assign({}, mockAutomobileObj, mockLionObj)).addedKeys, lionKeysNoToStr);
                        });

                        test(`new ObjectComparer(${mockLionObj}, ${mockAutomobileObj}).addedKeys === ["${automobileKeys.join('", "')}"]`, function()
                        {
                            assert.deepStrictEqual(new ObjectCompare(mockLionObj, Object.assign({}, mockLionObj, mockAutomobileObj)).addedKeys, automobileKeysNoToStr);
                        });
                    }
            ));
        });

        suite("includedKeys", function testGetIncludedKeys()
        {
            mockAutomobileObjs.forEach(mockAutomobileObj =>
                mockLionObjs.forEach(mockLionObj =>{
                    test(`new ObjectComparer(${mockAutomobileObj}, ${mockLionObj}).includedKeys === ["toString"]`, function()
                    {
                        assert.deepStrictEqual(new ObjectCompare(mockAutomobileObj, mockLionObj).includedKeys, ["toString"]);
                    });

                    test(`new ObjectComparer(${mockLionObj}, ${mockAutomobileObj}).includedKeys === ["toString"]`, function()
                    {
                        assert.deepStrictEqual(new ObjectCompare(mockLionObj, mockAutomobileObj).includedKeys, ["toString"]);
                    });}
            ));

            mockAutomobileObjs.forEach(mockAutomobileObj1 =>
                mockAutomobileObjs.forEach(mockAutomobileObj2 =>
                        test(`new ObjectComparer(${mockAutomobileObj1}, ${mockAutomobileObj2}).includedKeys === ${toStr(automobileKeys)}`, function()
                        {
                            assert.deepStrictEqual(new ObjectCompare(mockAutomobileObj1, mockAutomobileObj2).includedKeys, automobileKeys);
                        })
            ));

            mockLionObjs.forEach(mockLionObj1 =>
                mockLionObjs.forEach(mockLionObj2 =>
                    test(`new ObjectComparer(${mockLionObj1}, ${mockLionObj2}).includedKeys === ${toStr(lionKeys)}`, function()
                    {
                        assert.deepStrictEqual(new ObjectCompare(mockLionObj1, mockLionObj2).includedKeys, lionKeys);
                    })
            ));
        });

        suite("alteredPropValueDiffs", function testGetAlteredPropValueDiffs()
        {
            suite("of objects", function testAlteredPropValueDiffsOfObjs()
            {
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

                mockObjs.forEach(mockObj =>
                    test(`new ObjectComparer(${mockObj}, ${mockObj}).alteredKeyValueDiffs is empty`, function()
                    {
                        assert.isEmpty(new ObjectCompare(mockObj, mockObj).alteredPropValueDiffs);
                    }));

                test("diff keys", function()
                {
                  assert.deepStrictEqual(new ObjectCompare(Car, Motorcycle).alteredPropValueDiffs.map(diff => diff.key), autoMobileKeysNoFuel);
                  assert.deepStrictEqual(new ObjectCompare(Motorcycle, Car).alteredPropValueDiffs.map(diff => diff.key), autoMobileKeysNoFuel);
                  assert.deepStrictEqual(new ObjectCompare(Simba, Kion).alteredPropValueDiffs.map(diff => diff.key), lionKeysNoGender);
                  assert.deepStrictEqual(new ObjectCompare(Kion, Simba).alteredPropValueDiffs.map(diff => diff.key), lionKeysNoGender);
                });

                test("diff sourceValues", function()
                {
                  assert.deepStrictEqual(new ObjectCompare(Car, Motorcycle).alteredPropValueDiffs.map(diff => diff.sourceValue), diffCarValues);
                  assert.deepStrictEqual(new ObjectCompare(Motorcycle, Car).alteredPropValueDiffs.map(diff => diff.sourceValue), diffMotoValues);
                  assert.deepStrictEqual(new ObjectCompare(Simba, Kion).alteredPropValueDiffs.map(diff => diff.sourceValue), diffSimbaValues);
                  assert.deepStrictEqual(new ObjectCompare(Kion, Simba).alteredPropValueDiffs.map(diff => diff.sourceValue), diffKionValues);
                });

                test("diff targetValues", function()
                {
                  assert.deepStrictEqual(new ObjectCompare(Car, Motorcycle).alteredPropValueDiffs.map(diff => diff.targetValue), diffMotoValues);
                  assert.deepStrictEqual(new ObjectCompare(Motorcycle, Car).alteredPropValueDiffs.map(diff => diff.targetValue), diffCarValues);
                  assert.deepStrictEqual(new ObjectCompare(Simba, Kion).alteredPropValueDiffs.map(diff => diff.targetValue), diffKionValues);
                  assert.deepStrictEqual(new ObjectCompare(Kion, Simba).alteredPropValueDiffs.map(diff => diff.targetValue), diffSimbaValues);
                });
            });

            suite("of arrays", function testAlteredPropValueDiffsOfArrays()
            {
               suite(`${toStr(mockStrArrayA)} -> ${toStr(mockStrArrayB)}`, function testStrArrayDiff()
                {
                    test('diff keys are "0" and "2"', function()
                    {
                        assert.deepStrictEqual(new ObjectCompare(mockStrArrayA, mockStrArrayB).alteredPropValueDiffs.map(diff => diff.key), ["0", "2"]);
                    });

                    test('diff source values are "first" and "third"', function()
                    {
                        assert.deepStrictEqual(new ObjectCompare(mockStrArrayA, mockStrArrayB).alteredPropValueDiffs.map(diff => diff.sourceValue), ["first", "third"]);
                    });

                    test('diff target values are "foo" and "baz"', function()
                    {
                        assert.deepStrictEqual(new ObjectCompare(mockStrArrayA, mockStrArrayB).alteredPropValueDiffs.map(diff => diff.targetValue), ["foo", "baz"]);
                    });
                });

                suite(`${toStr(mockStrArrayA)} -> ${toStr(mockIntArrayA)}`, function testStrIntArrayDiff()
                {
                    test('diff keys are "0", "1", and "2"', function()
                    {
                        assert.deepStrictEqual(new ObjectCompare(mockStrArrayA, mockIntArrayA).alteredPropValueDiffs.map(diff => diff.key), ["0", "1", "2"]);
                    });

                    test('diff source values are "first", "second", and "third"', function()
                    {
                        assert.deepStrictEqual(new ObjectCompare(mockStrArrayA, mockIntArrayA).alteredPropValueDiffs.map(diff => diff.sourceValue), ["first", "second", "third"]);
                    });

                    test("diff target values are 111, 222, and 333", function()
                    {
                        assert.deepStrictEqual(new ObjectCompare(mockStrArrayA, mockIntArrayA).alteredPropValueDiffs.map(diff => diff.targetValue), [111, 222, 333]);
                    });
                });
            });

            suite("object and array", function testObjArrayDiff()
            {
                mockObjs.forEach(mockObj =>
                    mockArrays.forEach(mockArray =>
                        test(`{${mockObj}} -> ${toStr(mockArray)} property value diffs are empty`, function()
                        {
                            assert.isEmpty(new ObjectCompare(mockObj, mockArray).alteredPropValueDiffs);
                        })
                ));
            });

            suite("array and object", function testArrayObjDiff()
            {
                mockArrays.forEach(mockArr =>
                    mockObjs.forEach(mockObj =>
                        test(`${toStr(mockArr)} -> {${mockObj}} property value diffs are empty`, function()
                        {
                            assert.isEmpty(new ObjectCompare(mockArr, mockObj).alteredPropValueDiffs);
                        })
                ));
            });
        });
    });

    suite("has", function testHas()
    {
       suite("omittedKeys", function testHasOmittedKeys()
       {
           mockAutomobileObjs.forEach(mockAutomobileObj1 =>
               mockAutomobileObjs.forEach(mockAutomobileObj2 =>
                   test(`new ObjectComparer(${mockAutomobileObj1}, ${mockAutomobileObj2}).has.omittedKeys() === false`, function()
                   {
                       assert.isFalse(new ObjectCompare(mockAutomobileObj1, mockAutomobileObj2).has.omittedKeys());
                   })
           ));

           mockLionObjs.forEach(mockLionObj1 => {
               mockLionObjs.forEach(mockLionObj2 =>
                   test(`new ObjectComparer(${mockLionObj1}, ${mockLionObj2}).has.omittedKeys() === false`, function()
                   {
                       assert.isFalse(new ObjectCompare(mockLionObj1, mockLionObj2).has.omittedKeys());
                   })
               );
           });

           mockArrays.forEach(mockArray1 => {
               mockArrays.forEach(mockArray2 =>
                   test(`new ObjectComparer(${toStr(mockArray1)}, ${toStr(mockArray2)}).has.omittedKeys() === false`, function()
                   {
                       assert.isFalse(new ObjectCompare(mockArray1, mockArray2).has.omittedKeys());
                   })
               );
           });

           mockAutomobileObjs.forEach(mockAutomobileObj => {
               mockLionObjs.forEach(mockLionObj => {
                   test(`new ObjectComparer(${mockAutomobileObj}, ${mockLionObj}).has.omittedKeys() === true`, function()
                   {
                       assert.isTrue(new ObjectCompare(mockAutomobileObj, mockLionObj).has.omittedKeys());
                   });

                   test(`new ObjectComparer(${mockLionObj}, ${mockAutomobileObj}).has.omittedKeys() === true`, function()
                   {
                       assert.isTrue(new ObjectCompare(mockLionObj, mockAutomobileObj).has.omittedKeys());
                   });
               });

               mockArrays.forEach(mockArray => {
                   test(`new ObjectComparer(${mockAutomobileObj}, ${toStr(mockArray)}).has.omittedKeys() === true`, function()
                   {
                       assert.isTrue(new ObjectCompare(mockAutomobileObj, mockArray).has.omittedKeys());
                   });

                   test(`new ObjectComparer(${toStr(mockArray)}, ${mockAutomobileObj}).has.omittedKeys() === true`, function()
                   {
                       assert.isTrue(new ObjectCompare(mockArray, mockAutomobileObj).has.omittedKeys());
                   });
               });
           });

           mockLionObjs.forEach(mockLionObj =>
               mockArrays.forEach(mockArray => {
                   test(`new ObjectComparer(${mockLionObj}, ${toStr(mockArray)}).has.omittedKeys() === true`, function()
                   {
                       assert.isTrue(new ObjectCompare(mockLionObj, mockArray).has.omittedKeys());
                   });

                   test(`new ObjectComparer(${toStr(mockArray)}, ${mockLionObj}).has.omittedKeys() === true`, function()
                   {
                       assert.isTrue(new ObjectCompare(mockArray, mockLionObj).has.omittedKeys());
                   });
               })
           );
       });
    });
});
