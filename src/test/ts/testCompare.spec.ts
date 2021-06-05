import mock from "../resources/ts/mock";
import {Compare} from "../../main/ts/compare";
import {assert} from "chai";
import {suite, test} from "mocha";

const automobileKeysNoToStr: ReadonlyArray<string> = Object.freeze(mock.automobileKeys.filter(key => key !== "toString"));
const lionKeysNoToStr: ReadonlyArray<string> = Object.freeze(mock.lionKeys.filter(key => key !== "toString"));

const validCtorArgs = mock.objects.concat(mock.strArrayA);

const toStr = (o: unknown): string =>
{
    return typeof o === "string" ? `"${o}"`
           : typeof o === "symbol" ? `Symbol("${o.description}")`
           : typeof o === "bigint" ? `BigInt(${o})`
           : Array.isArray(o) ? `[${o.map(e => toStr(e)).join(", ")}]`
           : `${o}`;
};

suite("Compare", function testCompare()
{
    suite("new Compare(NonNullable<unknown>, NonNullable<unknown>)", function testValidCompareConstruction()
    {
        validCtorArgs.forEach(mockObj1 =>
            mock.objects.forEach(mockObj2 =>
                test(`new Compare(${toStr(mockObj1)}, ${toStr(mockObj2)}) does not throw`, function()
                {
                    assert.doesNotThrow(() => new Compare(mockObj1, mockObj2));
                })
        ));
    });

    suite("get", function testGetters()
    {
        suite("sourceObject", function testGetSourceObject()
        {
            validCtorArgs.forEach(mockObj1 =>
                validCtorArgs.forEach(mockObj2 =>
                    test(`new Compare(${toStr(mockObj1)}, ${toStr(mockObj2)}).sourceObject === ${mockObj1}`, function()
                    {
                        assert.strictEqual(new Compare(mockObj1, mockObj2).source, mockObj1);
                    })
            ));
        });

        suite("targetObject", function testGetTargetObject()
        {
            mock.objects.forEach(mockObj1 =>
                mock.objects.forEach(mockObj2 =>
                    test(`new Compare(${mockObj1}, ${mockObj2}).targetObject === ${mockObj2}`, function()
                    {
                        assert.strictEqual(new Compare(mockObj1, mockObj2).target, mockObj2);
                    })
            ));
        });

        suite("omittedKeys", function testGetOmittedKeys()
        {
            mock.automobiles.forEach(mockAutomobileObj1 =>
                mock.automobiles.forEach(mockAutomobileObj2 =>
                    test(`new Compare(${mockAutomobileObj1}, ${mockAutomobileObj2}).omittedKeys is empty`, function()
                    {
                        assert.isEmpty(new Compare(mockAutomobileObj1, mockAutomobileObj2).omittedKeys);
                    })
            ));

            mock.lions.forEach(mockLionObj1 =>
                mock.lions.forEach(mockLionObj2 =>
                    test(`new Compare(${mockLionObj1}, ${mockLionObj2}).omittedKeys is empty`, function()
                    {
                        assert.isEmpty(new Compare(mockLionObj1, mockLionObj2).omittedKeys);
                    })
            ));

            mock.automobiles.forEach(mockAutomobileObj =>
                    mock.lions.forEach(mockLionObj => {
                        test(`new Compare(${mockAutomobileObj}, ${mockLionObj}).omittedKeys === ${toStr(automobileKeysNoToStr)}`, function()
                        {
                            assert.deepStrictEqual(new Compare(mockAutomobileObj, mockLionObj).omittedKeys, automobileKeysNoToStr);
                        });

                        test(`new Compare(${mockLionObj}, ${mockAutomobileObj}).omittedKeys === ${toStr(lionKeysNoToStr)}`, function()
                        {
                            assert.deepStrictEqual(new Compare(mockLionObj, mockAutomobileObj).omittedKeys, lionKeysNoToStr);
                        });
                    }
            ));
        });

        suite("addedKeys", function testGetAddedKeys()
        {
            mock.automobiles.forEach(mockAutomobileObj1 =>
                mock.automobiles.forEach(mockAutomobileObj2 =>
                    test(`new Compare(${mockAutomobileObj1}, ${mockAutomobileObj2}).addedKeys is empty`, function()
                    {
                        assert.isEmpty(new Compare(mockAutomobileObj1, mockAutomobileObj2).addedKeys);
                    })
            ));

            mock.lions.forEach(mockLionObj1 =>
                mock.lions.forEach(mockLionObj2 =>
                    test(`new Compare(${mockLionObj1}, ${mockLionObj2}).addedKeys is empty`, function()
                    {
                        assert.isEmpty(new Compare(mockLionObj1, mockLionObj2).addedKeys);
                    })
            ));

            mock.automobiles.forEach(mockAutomobileObj =>
                    mock.lions.forEach(mockLionObj => {
                        test(`new Compare(${mockAutomobileObj}, ${mockAutomobileObj} & ${mockLionObj}).addedKeys === ${toStr(lionKeysNoToStr)}`, function()
                        {
                            assert.deepStrictEqual(new Compare(mockAutomobileObj, Object.assign({}, mockAutomobileObj, mockLionObj)).addedKeys, lionKeysNoToStr);
                        });

                        test(`new Compare(${mockLionObj}, ${mockAutomobileObj}).addedKeys === ["${mock.automobileKeys.join('", "')}"]`, function()
                        {
                            assert.deepStrictEqual(new Compare(mockLionObj, Object.assign({}, mockLionObj, mockAutomobileObj)).addedKeys, automobileKeysNoToStr);
                        });
                    }
            ));
        });

        suite("sharedProperties", function testGeSharedProperties()
        {
            mock.automobiles.forEach(mockAutomobileObj =>
                mock.lions.forEach(mockLionObj =>{
                    test(`new Compare(${mockAutomobileObj}, ${mockLionObj}).sharedProperties is empty`, function()
                    {
                        assert.isEmpty(new Compare(mockAutomobileObj, mockLionObj).sharedProperties);
                    });

                    test(`new Compare(${mockLionObj}, ${mockAutomobileObj}).sharedProperties is empty`, function()
                    {
                        assert.isEmpty(new Compare(mockLionObj, mockAutomobileObj).sharedProperties);
                    });}
            ));

            test('new Compare(Car, Motorcycle).sharedProperties === ["fuel"]', function()
            {
                assert.deepStrictEqual(new Compare(mock.Car, mock.Motorcycle).sharedProperties, ["fuel"]);
            });

            test('new Compare(Motorcycle, Car).sharedProperties === ["fuel"]', function()
            {
                assert.deepStrictEqual(new Compare(mock.Motorcycle, mock.Car).sharedProperties, ["fuel"]);
            });

            test('new Compare(Simba, Kion).sharedProperties === ["gender"]', function()
            {
                assert.deepStrictEqual(new Compare(mock.Simba, mock.Kion).sharedProperties, ["gender"]);
            });

            test('new Compare(Kion, Simba).sharedProperties === ["gender"]', function()
            {
                assert.deepStrictEqual(new Compare(mock.Kion, mock.Simba).sharedProperties, ["gender"]);
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
                    test(`new Compare(${mockObj}, ${mockObj}).alteredProperties is empty`, function()
                    {
                        assert.isEmpty(new Compare(mockObj, mockObj).alteredProperties);
                    }));

                test("diff keys", function()
                {
                  assert.deepStrictEqual(new Compare(mock.Car, mock.Motorcycle).alteredProperties.map(diff => diff.key), autoMobileKeysNoFuel);
                  assert.deepStrictEqual(new Compare(mock.Motorcycle, mock.Car).alteredProperties.map(diff => diff.key), autoMobileKeysNoFuel);
                  assert.deepStrictEqual(new Compare(mock.Simba, mock.Kion).alteredProperties.map(diff => diff.key), lionKeysNoGender);
                  assert.deepStrictEqual(new Compare(mock.Kion, mock.Simba).alteredProperties.map(diff => diff.key), lionKeysNoGender);
                });

                test("diff sourceValues", function()
                {
                  assert.deepStrictEqual(new Compare(mock.Car, mock.Motorcycle).alteredProperties.map(diff => diff.sourceValue), diffCarValues);
                  assert.deepStrictEqual(new Compare(mock.Motorcycle, mock.Car).alteredProperties.map(diff => diff.sourceValue), diffMotoValues);
                  assert.deepStrictEqual(new Compare(mock.Simba, mock.Kion).alteredProperties.map(diff => diff.sourceValue), diffSimbaValues);
                  assert.deepStrictEqual(new Compare(mock.Kion, mock.Simba).alteredProperties.map(diff => diff.sourceValue), diffKionValues);
                });

                test("diff targetValues", function()
                {
                  assert.deepStrictEqual(new Compare(mock.Car, mock.Motorcycle).alteredProperties.map(diff => diff.targetValue), diffMotoValues);
                  assert.deepStrictEqual(new Compare(mock.Motorcycle, mock.Car).alteredProperties.map(diff => diff.targetValue), diffCarValues);
                  assert.deepStrictEqual(new Compare(mock.Simba, mock.Kion).alteredProperties.map(diff => diff.targetValue), diffKionValues);
                  assert.deepStrictEqual(new Compare(mock.Kion, mock.Simba).alteredProperties.map(diff => diff.targetValue), diffSimbaValues);
                });
            });

            suite("of arrays", function testAlteredPropertiesOfArrays()
            {
               suite(`${toStr(mock.strArrayA)} -> ${toStr(mock.strArrayB)}`, function testStrArrayDiff()
                {
                    test('diff keys are "0" and "2"', function()
                    {
                        assert.deepStrictEqual(new Compare(mock.strArrayA, mock.strArrayB).alteredProperties.map(diff => diff.key), ["0", "2"]);
                    });

                    test('diff source values are "first" and "third"', function()
                    {
                        assert.deepStrictEqual(new Compare(mock.strArrayA, mock.strArrayB).alteredProperties.map(diff => diff.sourceValue), ["first", "third"]);
                    });

                    test('diff target values are "foo" and "baz"', function()
                    {
                        assert.deepStrictEqual(new Compare(mock.strArrayA, mock.strArrayB).alteredProperties.map(diff => diff.targetValue), ["foo", "baz"]);
                    });
                });

                suite(`${toStr(mock.strArrayA)} -> ${toStr(mock.intArrayA)}`, function testStrIntArrayDiff()
                {
                    test('diff keys are "0", "1", and "2"', function()
                    {
                        assert.deepStrictEqual(new Compare(mock.strArrayA, mock.intArrayA).alteredProperties.map(diff => diff.key), ["0", "1", "2"]);
                    });

                    test('diff source values are "first", "second", and "third"', function()
                    {
                        assert.deepStrictEqual(new Compare(mock.strArrayA, mock.intArrayA).alteredProperties.map(diff => diff.sourceValue), ["first", "second", "third"]);
                    });

                    test("diff target values are 111, 222, and 333", function()
                    {
                        assert.deepStrictEqual(new Compare(mock.strArrayA, mock.intArrayA).alteredProperties.map(diff => diff.targetValue), [111, 222, 333]);
                    });
                });

                suite(`${toStr(mock.intArrayA)} -> ${toStr(mock.intArrayB)}`, function testStrIntArrayDiff()
                {
                    test('diff key is "2"', function()
                    {
                        assert.deepStrictEqual(new Compare(mock.intArrayA, mock.intArrayB).alteredProperties.map(diff => diff.key), ["2"]);
                    });

                    test("diff source values is 333", function()
                    {
                        assert.deepStrictEqual(new Compare(mock.intArrayA, mock.intArrayB).alteredProperties.map(diff => diff.sourceValue), [333]);
                    });

                    test("diff target value is 999", function()
                    {
                        assert.deepStrictEqual(new Compare(mock.intArrayA, mock.intArrayB).alteredProperties.map(diff => diff.targetValue), [999]);
                    });
                });
            });

            suite("object and array", function testObjArrayDiff()
            {
                mock.objects.forEach(mockObj =>
                    mock.arrays.forEach(mockArray =>
                        test(`{${mockObj}} -> ${toStr(mockArray)} property value diffs are empty`, function()
                        {
                            assert.isEmpty(new Compare(mockObj, mockArray).alteredProperties);
                        })
                ));
            });

            suite("array and object", function testArrayObjDiff()
            {
                mock.arrays.forEach(mockArr =>
                    mock.objects.forEach(mockObj =>
                        test(`${toStr(mockArr)} -> {${mockObj}} property value diffs are empty`, function()
                        {
                            assert.isEmpty(new Compare(mockArr, mockObj).alteredProperties);
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
                   test(`new Compare(${mockAutomobileObj1}, ${mockAutomobileObj2}).has.omittedKeys() === false`, function()
                   {
                       assert.isFalse(new Compare(mockAutomobileObj1, mockAutomobileObj2).has.omittedKeys());
                   })
           ));

           mock.lions.forEach(mockLionObj1 => {
               mock.lions.forEach(mockLionObj2 =>
                   test(`new Compare(${mockLionObj1}, ${mockLionObj2}).has.omittedKeys() === false`, function()
                   {
                       assert.isFalse(new Compare(mockLionObj1, mockLionObj2).has.omittedKeys());
                   })
               );
           });

           mock.arrays.forEach(mockArray1 => {
               mock.arrays.forEach(mockArray2 =>
                   test(`new Compare(${toStr(mockArray1)}, ${toStr(mockArray2)}).has.omittedKeys() === false`, function()
                   {
                       assert.isFalse(new Compare(mockArray1, mockArray2).has.omittedKeys());
                   })
               );
           });

           mock.automobiles.forEach(mockAutomobileObj => {
               mock.lions.forEach(mockLionObj => {
                   test(`new Compare(${mockAutomobileObj}, ${mockLionObj}).has.omittedKeys() === true`, function()
                   {
                       assert.isTrue(new Compare(mockAutomobileObj, mockLionObj).has.omittedKeys());
                   });

                   test(`new Compare(${mockLionObj}, ${mockAutomobileObj}).has.omittedKeys() === true`, function()
                   {
                       assert.isTrue(new Compare(mockLionObj, mockAutomobileObj).has.omittedKeys());
                   });
               });

               mock.arrays.forEach(mockArray => {
                   test(`new Compare(${mockAutomobileObj}, ${toStr(mockArray)}).has.omittedKeys() === true`, function()
                   {
                       assert.isTrue(new Compare(mockAutomobileObj, mockArray).has.omittedKeys());
                   });

                   test(`new Compare(${toStr(mockArray)}, ${mockAutomobileObj}).has.omittedKeys() === true`, function()
                   {
                       assert.isTrue(new Compare(mockArray, mockAutomobileObj).has.omittedKeys());
                   });
               });
           });

           mock.lions.forEach(mockLionObj =>
               mock.arrays.forEach(mockArray => {
                   test(`new Compare(${mockLionObj}, ${toStr(mockArray)}).has.omittedKeys() === true`, function()
                   {
                       assert.isTrue(new Compare(mockLionObj, mockArray).has.omittedKeys());
                   });

                   test(`new Compare(${toStr(mockArray)}, ${mockLionObj}).has.omittedKeys() === true`, function()
                   {
                       assert.isTrue(new Compare(mockArray, mockLionObj).has.omittedKeys());
                   });
               })
           );
       });
    });
});
