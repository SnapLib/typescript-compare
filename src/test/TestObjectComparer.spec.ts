/* eslint-disable @typescript-eslint/no-explicit-any */
import {Car, Motorcycle} from "./AutoMobile";
import {Simba, Kion} from "./Lion";
import {ObjectComparer} from "../main/ts/objectComparer";
import {assert} from "chai";
import {suite, test} from "mocha";

const carWithToStr: unknown = Object.assign({}, Car, {toString: () => "Car"});
const motorcycleWithToStr: unknown = Object.assign({}, Motorcycle, {toString: () => "Motorcycle"});
const simbaWithToStr: unknown = Object.assign({}, Simba, {toString: () => "Simba"});
const kionWithToStr: unknown = Object.assign({}, Kion, {toString: () => "Kion"});

const automobileKeys: ReadonlyArray<string> = Object.freeze(Object.keys(Car));
const lionKeys: ReadonlyArray<string> = Object.freeze(Object.keys(Simba));

const mockObjects: ReadonlyArray<unknown> =
    Object.freeze([Car, Motorcycle, Simba, Kion]);

const mockObjectsWithToStr: ReadonlyArray<unknown> =
    Object.freeze([carWithToStr, motorcycleWithToStr, simbaWithToStr, kionWithToStr]);

const mockAutomobileObjects: ReadonlyArray<unknown> =
    Object.freeze([Car, Motorcycle]);

const mockAutomobileObjsWithToStr: ReadonlyArray<unknown> =
    Object.freeze([carWithToStr, motorcycleWithToStr]);

const mockLionObjects: ReadonlyArray<unknown> =
    Object.freeze([Simba, Kion]);

const mockLionObjsWithToStr: ReadonlyArray<unknown> =
    Object.freeze([simbaWithToStr, kionWithToStr]);

suite("TestObjectComparer", function testObjectComparer()
{
    suite("Valid ObjectComparer construction does not throw", function testValidObjectComparerCtor()
    {
        mockObjectsWithToStr.forEach(mockObj1 =>
            mockObjectsWithToStr.forEach(mockObj2 =>
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
            mockObjectsWithToStr.forEach(mockObj1 =>
                mockObjectsWithToStr.forEach(mockObj2 =>
                    test(`new ObjectComparer(${mockObj1}, ${mockObj2}).get.sourceObject() === ${mockObj1}`, function()
                    {
                        assert.strictEqual(new ObjectComparer(mockObj1, mockObj2).get.sourceObject(), mockObj1);
                    })
            ));
        });

        suite("get targetObject()", function testGetTargetObject()
        {
            mockObjectsWithToStr.forEach(mockObj1 =>
                mockObjectsWithToStr.forEach(mockObj2 =>
                    test(`new ObjectComparer(${mockObj1}, ${mockObj2}).get.targetObject() === ${mockObj2}`, function()
                    {
                        assert.strictEqual(new ObjectComparer(mockObj1, mockObj2).get.targetObject(), mockObj2);
                    })
            ));
        });

        suite("get omittedKeys()", function testGetOmittedKeys()
        {
            mockAutomobileObjsWithToStr.forEach(mockAutomobileObj1 =>
                mockAutomobileObjsWithToStr.forEach(mockAutomobileObj2 =>
                    test(`new ObjectComparer(${mockAutomobileObj1}, ${mockAutomobileObj2}).get.omittedKeys() is empty`, function()
                    {
                        assert.isEmpty(new ObjectComparer(mockAutomobileObj1, mockAutomobileObj2).get.omittedKeys());
                    })
            ));

            mockLionObjsWithToStr.forEach(mockLionObj1 =>
                mockLionObjsWithToStr.forEach(mockLionObj2 =>
                    test(`new ObjectComparer(${mockLionObj1}, ${mockLionObj2}).get.omittedKeys() is empty`, function()
                    {
                        assert.isEmpty(new ObjectComparer(mockLionObj1, mockLionObj2).get.omittedKeys());
                    })
            ));

            mockAutomobileObjects.forEach(mockAutomobileObj =>
                    mockLionObjects.forEach(mockLionObj =>
                        test(`new ObjectComparer(${mockAutomobileObj}, ${mockLionObj}).get.omittedKeys() === Object.keys(${mockAutomobileObj})`, function()
                        {
                            assert.deepStrictEqual(new ObjectComparer(mockAutomobileObj, mockLionObj).get.omittedKeys(), automobileKeys);
                        })
            ));

            mockLionObjects.forEach(mockLionObj =>
                mockAutomobileObjects.forEach(mockAutomobileObj =>
                    test(`new ObjectComparer(${mockLionObj}, ${mockAutomobileObj}).get.omittedKeys() === Object.keys(${mockLionObj})`, function()
                    {
                        assert.deepStrictEqual(new ObjectComparer(mockLionObj, mockAutomobileObj).get.omittedKeys(), lionKeys);
                    })
            ));
        });

        suite("get addedKeys()", function testGetAddedKeys()
        {
            mockAutomobileObjsWithToStr.forEach(mockAutomobileObj1 =>
                mockAutomobileObjsWithToStr.forEach(mockAutomobileObj2 =>
                    test(`new ObjectComparer(${mockAutomobileObj1}, ${mockAutomobileObj2}).get.addedKeys() is empty`, function()
                    {
                        assert.isEmpty(new ObjectComparer(mockAutomobileObj1, mockAutomobileObj2).get.addedKeys());
                    })
            ));

            mockLionObjsWithToStr.forEach(mockLionObj1 =>
                mockLionObjsWithToStr.forEach(mockLionObj2 =>
                    test(`new ObjectComparer(${mockLionObj1}, ${mockLionObj2}).get.addedKeys() is empty`, function()
                    {
                        assert.isEmpty(new ObjectComparer(mockLionObj1, mockLionObj2).get.addedKeys());
                    })
            ));

            mockAutomobileObjects.forEach(mockAutomobileObj1 =>
                mockAutomobileObjsWithToStr.forEach(mockAutomobileObj2 =>
                    test(`new ObjectComparer(${mockAutomobileObj1}, ${mockAutomobileObj2}).get.addedKeys() === ["toString"]`, function()
                    {
                        assert.deepStrictEqual(new ObjectComparer(mockAutomobileObj1, mockAutomobileObj2).get.addedKeys(), ["toString"]);
                    })
            ));

            mockLionObjects.forEach(mockLionObj1 =>
                mockLionObjsWithToStr.forEach(mockLionObj2 =>
                    test(`new ObjectComparer(${mockLionObj1}, ${mockLionObj2}).get.addedKeys() === ["toString"]`, function()
                    {
                        assert.deepStrictEqual(new ObjectComparer(mockLionObj1, mockLionObj2).get.addedKeys(), ["toString"]);
                    })
            ));

            mockAutomobileObjsWithToStr.forEach(mockAutomobileObj =>
                    mockLionObjsWithToStr.forEach(mockLionObj =>
                        test(`new ObjectComparer(${mockAutomobileObj}, ${mockAutomobileObj} & ${mockLionObj}).get.addedKeys() === ["${lionKeys.join('", "')}"]`, function()
                        {
                            assert.deepStrictEqual(new ObjectComparer(mockAutomobileObj, Object.assign({}, mockAutomobileObj, mockLionObj)).get.addedKeys(), lionKeys);
                        })
            ));

            mockLionObjsWithToStr.forEach(mockLionObj =>
                mockAutomobileObjsWithToStr.forEach(mockAutomobileObj =>
                    test(`new ObjectComparer(${mockLionObj}, ${mockAutomobileObj}).get.omittedKeys() === ["${automobileKeys.join('", "')}"]`, function()
                    {
                        assert.deepStrictEqual(new ObjectComparer(mockLionObj, Object.assign({}, mockLionObj, mockAutomobileObj)).get.addedKeys(), automobileKeys);
                    })
            ));
        });

        suite("get includedKeys()", function testGetIncludedKeys()
        {
            mockAutomobileObjects.forEach(mockAutomobileObj =>
                mockLionObjects.forEach(mockLionObj =>
                    test(`new ObjectComparer(${mockAutomobileObj}, ${mockLionObj}).get.includedKeys() is empty`, function()
                    {
                        assert.isEmpty(new ObjectComparer(mockAutomobileObj, mockLionObj).get.includedKeys());
                    })
            ));

            mockLionObjects.forEach(mockLionObj =>
                mockAutomobileObjects.forEach(mockAutomobile =>
                    test(`new ObjectComparer(${mockLionObj}, ${mockAutomobile}).get.includedKeys() is empty`, function()
                    {
                        assert.isEmpty(new ObjectComparer(mockLionObj, mockAutomobile).get.includedKeys());
                    })
            ));

            mockAutomobileObjects.forEach(mockAutomobileObj1 =>
                mockAutomobileObjects.forEach(mockAutomobileObj2 =>
                        test(`new ObjectComparer(${mockAutomobileObj1}, ${mockAutomobileObj2}).get.includedKeys() === Object.keys(${mockAutomobileObj1})`, function()
                        {
                            assert.deepStrictEqual(new ObjectComparer(mockAutomobileObj1, mockAutomobileObj2).get.includedKeys(), automobileKeys);
                        })
            ));

            mockLionObjects.forEach(mockLionObj1 =>
                mockLionObjects.forEach(mockLionObj2 =>
                    test(`new ObjectComparer(${mockLionObj1}, ${mockLionObj2}).get.includedKeys() === Object.keys(${mockLionObj1})`, function()
                    {
                        assert.deepStrictEqual(new ObjectComparer(mockLionObj1, mockLionObj2).get.includedKeys(), lionKeys);
                    })
            ));
        });

        suite("get alteredKeyValues()", function testGetAlteredKeyValues()
        {
            test(`new ObjectComparer(${Car}, ${Motorcycle}).get.alteredKeyValues()`, function()
            {
                assert.deepStrictEqual(new ObjectComparer(Car, Motorcycle).get.alteredKeyValues().map(e => e.key), automobileKeys);
            });
        });
    });
});
