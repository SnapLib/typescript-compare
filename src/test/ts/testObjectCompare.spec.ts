import mock from "../resources/ts/mock";
import {ObjectCompare} from "../../main/ts/objectCompare";
import {assert} from "chai";
import {suite, test} from "mocha";

const automobileKeysNoToStr: ReadonlyArray<string> = Object.freeze(mock.automobileKeys.filter(key => key !== "toString"));
const lionKeysNoToStr: ReadonlyArray<string> = Object.freeze(mock.lionKeys.filter(key => key !== "toString"));

const toStr = (o: unknown): string =>
{
    return typeof o === "string" ? `"${o}"`
           : Array.isArray(o) ? `[${o.map(e => toStr(e)).join(", ")}]`
           : `${o}`;
};

suite("ObjectCompare", function testObjectCompare()
{
    suite("new ObjectCompare(NonNullable<unknown>, NonNullable<unknown>)", function testValidObjectCompareCtor()
    {
        mock.objects.forEach(mockObj1 =>
            mock.objects.forEach(mockObj2 =>
                test(`new ObjectCompare(${mockObj1}, ${mockObj2}) does not throw`, function()
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
                    test(`new ObjectCompare(${mockObj1}, ${mockObj2}).sourceObject === ${mockObj1}`, function()
                    {
                        assert.strictEqual(new ObjectCompare(mockObj1, mockObj2).sourceObject, mockObj1);
                    })
            ));
        });

        suite("targetObject", function testGetTargetObject()
        {
            mock.objects.forEach(mockObj1 =>
                mock.objects.forEach(mockObj2 =>
                    test(`new ObjectCompare(${mockObj1}, ${mockObj2}).targetObject === ${mockObj2}`, function()
                    {
                        assert.strictEqual(new ObjectCompare(mockObj1, mockObj2).targetObject, mockObj2);
                    })
            ));
        });

        suite("omittedKeys", function testGetOmittedKeys()
        {
            mock.automobiles.forEach(mockAutomobileObj1 =>
                mock.automobiles.forEach(mockAutomobileObj2 =>
                    test(`new ObjectCompare(${mockAutomobileObj1}, ${mockAutomobileObj2}).omittedKeys is empty`, function()
                    {
                        assert.isEmpty(new ObjectCompare(mockAutomobileObj1, mockAutomobileObj2).omittedKeys);
                    })
            ));

            mock.lions.forEach(mockLionObj1 =>
                mock.lions.forEach(mockLionObj2 =>
                    test(`new ObjectCompare(${mockLionObj1}, ${mockLionObj2}).omittedKeys is empty`, function()
                    {
                        assert.isEmpty(new ObjectCompare(mockLionObj1, mockLionObj2).omittedKeys);
                    })
            ));

            mock.automobiles.forEach(mockAutomobileObj =>
                    mock.lions.forEach(mockLionObj => {
                        test(`new ObjectCompare(${mockAutomobileObj}, ${mockLionObj}).omittedKeys === ${toStr(automobileKeysNoToStr)}`, function()
                        {
                            assert.deepStrictEqual(new ObjectCompare(mockAutomobileObj, mockLionObj).omittedKeys, automobileKeysNoToStr);
                        });

                        test(`new ObjectCompare(${mockLionObj}, ${mockAutomobileObj}).omittedKeys === ${toStr(lionKeysNoToStr)}`, function()
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
                    test(`new ObjectCompare(${mockAutomobileObj1}, ${mockAutomobileObj2}).addedKeys is empty`, function()
                    {
                        assert.isEmpty(new ObjectCompare(mockAutomobileObj1, mockAutomobileObj2).addedKeys);
                    })
            ));

            mock.lions.forEach(mockLionObj1 =>
                mock.lions.forEach(mockLionObj2 =>
                    test(`new ObjectCompare(${mockLionObj1}, ${mockLionObj2}).addedKeys is empty`, function()
                    {
                        assert.isEmpty(new ObjectCompare(mockLionObj1, mockLionObj2).addedKeys);
                    })
            ));

            mock.automobiles.forEach(mockAutomobileObj =>
                    mock.lions.forEach(mockLionObj => {
                        test(`new ObjectCompare(${mockAutomobileObj}, ${mockAutomobileObj} & ${mockLionObj}).addedKeys === ${toStr(lionKeysNoToStr)}`, function()
                        {
                            assert.deepStrictEqual(new ObjectCompare(mockAutomobileObj, Object.assign({}, mockAutomobileObj, mockLionObj)).addedKeys, lionKeysNoToStr);
                        });

                        test(`new ObjectCompare(${mockLionObj}, ${mockAutomobileObj}).addedKeys === ["${mock.automobileKeys.join('", "')}"]`, function()
                        {
                            assert.deepStrictEqual(new ObjectCompare(mockLionObj, Object.assign({}, mockLionObj, mockAutomobileObj)).addedKeys, automobileKeysNoToStr);
                        });
                    }
            ));
        });

        suite("sharedProperties", function testGeSharedProperties()
        {
            mock.automobiles.forEach(mockAutomobileObj =>
                mock.lions.forEach(mockLionObj =>{
                    test(`new ObjectCompare(${mockAutomobileObj}, ${mockLionObj}).sharedProperties is empty`, function()
                    {
                        assert.isEmpty(new ObjectCompare(mockAutomobileObj, mockLionObj).sharedProperties);
                    });

                    test(`new ObjectCompare(${mockLionObj}, ${mockAutomobileObj}).sharedProperties is empty`, function()
                    {
                        assert.isEmpty(new ObjectCompare(mockLionObj, mockAutomobileObj).sharedProperties);
                    });}
            ));

            test('new ObjectCompare(Car, Motorcycle).sharedProperties === ["fuel"]', function()
            {
                assert.deepStrictEqual(new ObjectCompare(mock.Car, mock.Motorcycle).sharedProperties, ["fuel"]);
            });

            test('new ObjectCompare(Motorcycle, Car).sharedProperties === ["fuel"]', function()
            {
                assert.deepStrictEqual(new ObjectCompare(mock.Motorcycle, mock.Car).sharedProperties, ["fuel"]);
            });

            test('new ObjectCompare(Simba, Kion).sharedProperties === ["gender"]', function()
            {
                assert.deepStrictEqual(new ObjectCompare(mock.Simba, mock.Kion).sharedProperties, ["gender"]);
            });

            test('new ObjectCompare(Kion, Simba).sharedProperties === ["gender"]', function()
            {
                assert.deepStrictEqual(new ObjectCompare(mock.Kion, mock.Simba).sharedProperties, ["gender"]);
            });
        });

        suite("alteredProperties", function testGetAlteredProperties()
        {
            suite("of objects", function testAlteredPropertiesOfObjs()
            {
                const diffCarValues =
                    Object.entries(mock.Car).filter(entry => entry[0] !== "fuel").map(entry => entry[1]);
                const diffMotoValues =
                    Object.entries(mock.Motorcycle).filter(entry => entry[0] !== "fuel").map(entry => entry[1]);
                const autoMobileKeysNoFuel =
                    mock.automobileKeys.filter(key => key !== "fuel");

                const diffSimbaValues =
                    Object.entries(mock.Simba).filter(entry => entry[0] !== "gender").map(entry => entry[1]);
                const diffKionValues =
                    Object.entries(mock.Kion).filter(entry => entry[0] !== "gender").map(entry => entry[1]);
                const lionKeysNoGender =
                    mock.lionKeys.filter(key => key !== "gender");

                mock.objects.forEach(mockObj =>
                    test(`new ObjectCompare(${mockObj}, ${mockObj}).alteredProperties is empty`, function()
                    {
                        assert.isEmpty(new ObjectCompare(mockObj, mockObj).alteredProperties);
                    }));

                test("diff keys", function()
                {
                  assert.deepStrictEqual(new ObjectCompare(mock.Car, mock.Motorcycle).alteredProperties.map(diff => diff.key), autoMobileKeysNoFuel);
                  assert.deepStrictEqual(new ObjectCompare(mock.Motorcycle, mock.Car).alteredProperties.map(diff => diff.key), autoMobileKeysNoFuel);
                  assert.deepStrictEqual(new ObjectCompare(mock.Simba, mock.Kion).alteredProperties.map(diff => diff.key), lionKeysNoGender);
                  assert.deepStrictEqual(new ObjectCompare(mock.Kion, mock.Simba).alteredProperties.map(diff => diff.key), lionKeysNoGender);
                });

                test("diff sourceValues", function()
                {
                  assert.deepStrictEqual(new ObjectCompare(mock.Car, mock.Motorcycle).alteredProperties.map(diff => diff.sourceValue), diffCarValues);
                  assert.deepStrictEqual(new ObjectCompare(mock.Motorcycle, mock.Car).alteredProperties.map(diff => diff.sourceValue), diffMotoValues);
                  assert.deepStrictEqual(new ObjectCompare(mock.Simba, mock.Kion).alteredProperties.map(diff => diff.sourceValue), diffSimbaValues);
                  assert.deepStrictEqual(new ObjectCompare(mock.Kion, mock.Simba).alteredProperties.map(diff => diff.sourceValue), diffKionValues);
                });

                test("diff targetValues", function()
                {
                  assert.deepStrictEqual(new ObjectCompare(mock.Car, mock.Motorcycle).alteredProperties.map(diff => diff.targetValue), diffMotoValues);
                  assert.deepStrictEqual(new ObjectCompare(mock.Motorcycle, mock.Car).alteredProperties.map(diff => diff.targetValue), diffCarValues);
                  assert.deepStrictEqual(new ObjectCompare(mock.Simba, mock.Kion).alteredProperties.map(diff => diff.targetValue), diffKionValues);
                  assert.deepStrictEqual(new ObjectCompare(mock.Kion, mock.Simba).alteredProperties.map(diff => diff.targetValue), diffSimbaValues);
                });
            });

            suite("of arrays", function testAlteredPropertiesOfArrays()
            {
               suite(`${toStr(mock.strArrayA)} -> ${toStr(mock.strArrayB)}`, function testStrArrayDiff()
                {
                    test('diff keys are "0" and "2"', function()
                    {
                        assert.deepStrictEqual(new ObjectCompare(mock.strArrayA, mock.strArrayB).alteredProperties.map(diff => diff.key), ["0", "2"]);
                    });

                    test('diff source values are "first" and "third"', function()
                    {
                        assert.deepStrictEqual(new ObjectCompare(mock.strArrayA, mock.strArrayB).alteredProperties.map(diff => diff.sourceValue), ["first", "third"]);
                    });

                    test('diff target values are "foo" and "baz"', function()
                    {
                        assert.deepStrictEqual(new ObjectCompare(mock.strArrayA, mock.strArrayB).alteredProperties.map(diff => diff.targetValue), ["foo", "baz"]);
                    });
                });

                suite(`${toStr(mock.strArrayA)} -> ${toStr(mock.intArrayA)}`, function testStrIntArrayDiff()
                {
                    test('diff keys are "0", "1", and "2"', function()
                    {
                        assert.deepStrictEqual(new ObjectCompare(mock.strArrayA, mock.intArrayA).alteredProperties.map(diff => diff.key), ["0", "1", "2"]);
                    });

                    test('diff source values are "first", "second", and "third"', function()
                    {
                        assert.deepStrictEqual(new ObjectCompare(mock.strArrayA, mock.intArrayA).alteredProperties.map(diff => diff.sourceValue), ["first", "second", "third"]);
                    });

                    test("diff target values are 111, 222, and 333", function()
                    {
                        assert.deepStrictEqual(new ObjectCompare(mock.strArrayA, mock.intArrayA).alteredProperties.map(diff => diff.targetValue), [111, 222, 333]);
                    });
                });

                suite(`${toStr(mock.intArrayA)} -> ${toStr(mock.intArrayB)}`, function testStrIntArrayDiff()
                {
                    test('diff key is "2"', function()
                    {
                        assert.deepStrictEqual(new ObjectCompare(mock.intArrayA, mock.intArrayB).alteredProperties.map(diff => diff.key), ["2"]);
                    });

                    test("diff source values is 333", function()
                    {
                        assert.deepStrictEqual(new ObjectCompare(mock.intArrayA, mock.intArrayB).alteredProperties.map(diff => diff.sourceValue), [333]);
                    });

                    test("diff target value is 999", function()
                    {
                        assert.deepStrictEqual(new ObjectCompare(mock.intArrayA, mock.intArrayB).alteredProperties.map(diff => diff.targetValue), [999]);
                    });
                });
            });

            suite("object and array", function testObjArrayDiff()
            {
                mock.objects.forEach(mockObj =>
                    mock.arrays.forEach(mockArray =>
                        test(`{${mockObj}} -> ${toStr(mockArray)} property value diffs are empty`, function()
                        {
                            assert.isEmpty(new ObjectCompare(mockObj, mockArray).alteredProperties);
                        })
                ));
            });

            suite("array and object", function testArrayObjDiff()
            {
                mock.arrays.forEach(mockArr =>
                    mock.objects.forEach(mockObj =>
                        test(`${toStr(mockArr)} -> {${mockObj}} property value diffs are empty`, function()
                        {
                            assert.isEmpty(new ObjectCompare(mockArr, mockObj).alteredProperties);
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
                   test(`new ObjectCompare(${mockAutomobileObj1}, ${mockAutomobileObj2}).has.omittedKeys() === false`, function()
                   {
                       assert.isFalse(new ObjectCompare(mockAutomobileObj1, mockAutomobileObj2).has.omittedKeys());
                   })
           ));

           mock.lions.forEach(mockLionObj1 => {
               mock.lions.forEach(mockLionObj2 =>
                   test(`new ObjectCompare(${mockLionObj1}, ${mockLionObj2}).has.omittedKeys() === false`, function()
                   {
                       assert.isFalse(new ObjectCompare(mockLionObj1, mockLionObj2).has.omittedKeys());
                   })
               );
           });

           mock.arrays.forEach(mockArray1 => {
               mock.arrays.forEach(mockArray2 =>
                   test(`new ObjectCompare(${toStr(mockArray1)}, ${toStr(mockArray2)}).has.omittedKeys() === false`, function()
                   {
                       assert.isFalse(new ObjectCompare(mockArray1, mockArray2).has.omittedKeys());
                   })
               );
           });

           mock.automobiles.forEach(mockAutomobileObj => {
               mock.lions.forEach(mockLionObj => {
                   test(`new ObjectCompare(${mockAutomobileObj}, ${mockLionObj}).has.omittedKeys() === true`, function()
                   {
                       assert.isTrue(new ObjectCompare(mockAutomobileObj, mockLionObj).has.omittedKeys());
                   });

                   test(`new ObjectCompare(${mockLionObj}, ${mockAutomobileObj}).has.omittedKeys() === true`, function()
                   {
                       assert.isTrue(new ObjectCompare(mockLionObj, mockAutomobileObj).has.omittedKeys());
                   });
               });

               mock.arrays.forEach(mockArray => {
                   test(`new ObjectCompare(${mockAutomobileObj}, ${toStr(mockArray)}).has.omittedKeys() === true`, function()
                   {
                       assert.isTrue(new ObjectCompare(mockAutomobileObj, mockArray).has.omittedKeys());
                   });

                   test(`new ObjectCompare(${toStr(mockArray)}, ${mockAutomobileObj}).has.omittedKeys() === true`, function()
                   {
                       assert.isTrue(new ObjectCompare(mockArray, mockAutomobileObj).has.omittedKeys());
                   });
               });
           });

           mock.lions.forEach(mockLionObj =>
               mock.arrays.forEach(mockArray => {
                   test(`new ObjectCompare(${mockLionObj}, ${toStr(mockArray)}).has.omittedKeys() === true`, function()
                   {
                       assert.isTrue(new ObjectCompare(mockLionObj, mockArray).has.omittedKeys());
                   });

                   test(`new ObjectCompare(${toStr(mockArray)}, ${mockLionObj}).has.omittedKeys() === true`, function()
                   {
                       assert.isTrue(new ObjectCompare(mockArray, mockLionObj).has.omittedKeys());
                   });
               })
           );
       });
    });
});
