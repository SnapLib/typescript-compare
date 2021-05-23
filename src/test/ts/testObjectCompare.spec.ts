import {Simba, Kion, Car, Motorcycle, strArrayA, strArrayB, intArrayA, intArrayB} from "../resources/ts/mock";
import mock from "../resources/ts/mock";
import {ObjectCompare} from "../../main/ts/objectCompare";
import {assert} from "chai";
import {suite, test} from "mocha";

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
        mock.objects.forEach(mockObj1 =>
            mock.objects.forEach(mockObj2 =>
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
            mock.objects.forEach(mockObj1 =>
                mock.objects.forEach(mockObj2 =>
                    test(`new ObjectComparer(${mockObj1}, ${mockObj2}).sourceObject === ${mockObj1}`, function()
                    {
                        assert.strictEqual(new ObjectCompare(mockObj1, mockObj2).sourceObject, mockObj1);
                    })
            ));
        });

        suite("targetObject", function testGetTargetObject()
        {
            mock.objects.forEach(mockObj1 =>
                mock.objects.forEach(mockObj2 =>
                    test(`new ObjectComparer(${mockObj1}, ${mockObj2}).targetObject === ${mockObj2}`, function()
                    {
                        assert.strictEqual(new ObjectCompare(mockObj1, mockObj2).targetObject, mockObj2);
                    })
            ));
        });

        suite("omittedKeys", function testGetOmittedKeys()
        {
            mock.automobiles.forEach(mockAutomobileObj1 =>
                mock.automobiles.forEach(mockAutomobileObj2 =>
                    test(`new ObjectComparer(${mockAutomobileObj1}, ${mockAutomobileObj2}).omittedKeys is empty`, function()
                    {
                        assert.isEmpty(new ObjectCompare(mockAutomobileObj1, mockAutomobileObj2).omittedKeys);
                    })
            ));

            mock.lions.forEach(mockLionObj1 =>
                mock.lions.forEach(mockLionObj2 =>
                    test(`new ObjectComparer(${mockLionObj1}, ${mockLionObj2}).omittedKeys is empty`, function()
                    {
                        assert.isEmpty(new ObjectCompare(mockLionObj1, mockLionObj2).omittedKeys);
                    })
            ));

            mock.automobiles.forEach(mockAutomobileObj =>
                    mock.lions.forEach(mockLionObj => {
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
            mock.automobiles.forEach(mockAutomobileObj1 =>
                mock.automobiles.forEach(mockAutomobileObj2 =>
                    test(`new ObjectComparer(${mockAutomobileObj1}, ${mockAutomobileObj2}).addedKeys is empty`, function()
                    {
                        assert.isEmpty(new ObjectCompare(mockAutomobileObj1, mockAutomobileObj2).addedKeys);
                    })
            ));

            mock.lions.forEach(mockLionObj1 =>
                mock.lions.forEach(mockLionObj2 =>
                    test(`new ObjectComparer(${mockLionObj1}, ${mockLionObj2}).addedKeys is empty`, function()
                    {
                        assert.isEmpty(new ObjectCompare(mockLionObj1, mockLionObj2).addedKeys);
                    })
            ));

            mock.automobiles.forEach(mockAutomobileObj =>
                    mock.lions.forEach(mockLionObj => {
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
            mock.automobiles.forEach(mockAutomobileObj =>
                mock.lions.forEach(mockLionObj =>{
                    test(`new ObjectComparer(${mockAutomobileObj}, ${mockLionObj}).includedKeys === ["toString"]`, function()
                    {
                        assert.deepStrictEqual(new ObjectCompare(mockAutomobileObj, mockLionObj).includedKeys, ["toString"]);
                    });

                    test(`new ObjectComparer(${mockLionObj}, ${mockAutomobileObj}).includedKeys === ["toString"]`, function()
                    {
                        assert.deepStrictEqual(new ObjectCompare(mockLionObj, mockAutomobileObj).includedKeys, ["toString"]);
                    });}
            ));

            mock.automobiles.forEach(mockAutomobileObj1 =>
                mock.automobiles.forEach(mockAutomobileObj2 =>
                        test(`new ObjectComparer(${mockAutomobileObj1}, ${mockAutomobileObj2}).includedKeys === ${toStr(automobileKeys)}`, function()
                        {
                            assert.deepStrictEqual(new ObjectCompare(mockAutomobileObj1, mockAutomobileObj2).includedKeys, automobileKeys);
                        })
            ));

            mock.lions.forEach(mockLionObj1 =>
                mock.lions.forEach(mockLionObj2 =>
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

                mock.objects.forEach(mockObj =>
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
               suite(`${toStr(strArrayA)} -> ${toStr(strArrayB)}`, function testStrArrayDiff()
                {
                    test('diff keys are "0" and "2"', function()
                    {
                        assert.deepStrictEqual(new ObjectCompare(strArrayA, strArrayB).alteredPropValueDiffs.map(diff => diff.key), ["0", "2"]);
                    });

                    test('diff source values are "first" and "third"', function()
                    {
                        assert.deepStrictEqual(new ObjectCompare(strArrayA, strArrayB).alteredPropValueDiffs.map(diff => diff.sourceValue), ["first", "third"]);
                    });

                    test('diff target values are "foo" and "baz"', function()
                    {
                        assert.deepStrictEqual(new ObjectCompare(strArrayA, strArrayB).alteredPropValueDiffs.map(diff => diff.targetValue), ["foo", "baz"]);
                    });
                });

                suite(`${toStr(strArrayA)} -> ${toStr(intArrayA)}`, function testStrIntArrayDiff()
                {
                    test('diff keys are "0", "1", and "2"', function()
                    {
                        assert.deepStrictEqual(new ObjectCompare(strArrayA, intArrayA).alteredPropValueDiffs.map(diff => diff.key), ["0", "1", "2"]);
                    });

                    test('diff source values are "first", "second", and "third"', function()
                    {
                        assert.deepStrictEqual(new ObjectCompare(strArrayA, intArrayA).alteredPropValueDiffs.map(diff => diff.sourceValue), ["first", "second", "third"]);
                    });

                    test("diff target values are 111, 222, and 333", function()
                    {
                        assert.deepStrictEqual(new ObjectCompare(strArrayA, intArrayA).alteredPropValueDiffs.map(diff => diff.targetValue), [111, 222, 333]);
                    });
                });
            });

            suite("object and array", function testObjArrayDiff()
            {
                mock.objects.forEach(mockObj =>
                    mock.arrays.forEach(mockArray =>
                        test(`{${mockObj}} -> ${toStr(mockArray)} property value diffs are empty`, function()
                        {
                            assert.isEmpty(new ObjectCompare(mockObj, mockArray).alteredPropValueDiffs);
                        })
                ));
            });

            suite("array and object", function testArrayObjDiff()
            {
                mock.arrays.forEach(mockArr =>
                    mock.objects.forEach(mockObj =>
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
           mock.automobiles.forEach(mockAutomobileObj1 =>
               mock.automobiles.forEach(mockAutomobileObj2 =>
                   test(`new ObjectComparer(${mockAutomobileObj1}, ${mockAutomobileObj2}).has.omittedKeys() === false`, function()
                   {
                       assert.isFalse(new ObjectCompare(mockAutomobileObj1, mockAutomobileObj2).has.omittedKeys());
                   })
           ));

           mock.lions.forEach(mockLionObj1 => {
               mock.lions.forEach(mockLionObj2 =>
                   test(`new ObjectComparer(${mockLionObj1}, ${mockLionObj2}).has.omittedKeys() === false`, function()
                   {
                       assert.isFalse(new ObjectCompare(mockLionObj1, mockLionObj2).has.omittedKeys());
                   })
               );
           });

           mock.arrays.forEach(mockArray1 => {
               mock.arrays.forEach(mockArray2 =>
                   test(`new ObjectComparer(${toStr(mockArray1)}, ${toStr(mockArray2)}).has.omittedKeys() === false`, function()
                   {
                       assert.isFalse(new ObjectCompare(mockArray1, mockArray2).has.omittedKeys());
                   })
               );
           });

           mock.automobiles.forEach(mockAutomobileObj => {
               mock.lions.forEach(mockLionObj => {
                   test(`new ObjectComparer(${mockAutomobileObj}, ${mockLionObj}).has.omittedKeys() === true`, function()
                   {
                       assert.isTrue(new ObjectCompare(mockAutomobileObj, mockLionObj).has.omittedKeys());
                   });

                   test(`new ObjectComparer(${mockLionObj}, ${mockAutomobileObj}).has.omittedKeys() === true`, function()
                   {
                       assert.isTrue(new ObjectCompare(mockLionObj, mockAutomobileObj).has.omittedKeys());
                   });
               });

               mock.arrays.forEach(mockArray => {
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

           mock.lions.forEach(mockLionObj =>
               mock.arrays.forEach(mockArray => {
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
