import {Car, Motorcycle} from "./AutoMobile";
import {Simba, Kion} from "./Lion";
import {ObjectComparer} from "../main/ts/objectComparer";
import {assert} from "chai";
import {suite, test} from "mocha";

const mockObjects: readonly Readonly<unknown>[] =
    Object.freeze([Car, Motorcycle, Simba, Kion]);

const mockAutomobileObjects: ReadonlyArray<unknown> =
    Object.freeze([Car, Motorcycle]);

const mockLionObjects: ReadonlyArray<unknown> =
    Object.freeze([Simba, Kion]);

const automobileKeys: ReadonlyArray<string> = Object.freeze(Object.keys(Car));
const lionKeys: ReadonlyArray<string> = Object.freeze(Object.keys(Simba));

suite("TestObjectComparer", function testObjectComparer()
{
    suite("Valid ObjectComparer construction does not throw", function testValidObjectComparerCtor()
    {
        mockObjects.forEach(mockObj1 =>
            mockObjects.forEach(mockObj2 =>
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
            mockObjects.forEach(mockObj1 =>
                mockObjects.forEach(mockObj2 =>
                    test(`new ObjectComparer(${mockObj1}, ${mockObj2}).sourceObject === ${mockObj1}`, function()
                    {
                        assert.strictEqual(new ObjectComparer(mockObj1, mockObj2).sourceObject, mockObj1);
                    })
            ));
        });

        suite("get targetObject()", function testGetTargetObject()
        {
            mockObjects.forEach(mockObj1 =>
                mockObjects.forEach(mockObj2 =>
                    test(`new ObjectComparer(${mockObj1}, ${mockObj2}).targetObject === ${mockObj2}`, function()
                    {
                        assert.strictEqual(new ObjectComparer(mockObj1, mockObj2).targetObject, mockObj2);
                    })
            ));
        });

        suite("get omittedKeys()", function testGetOmittedKeys()
        {
            mockAutomobileObjects.forEach(mockAutomobileObj1 =>
                mockAutomobileObjects.forEach(mockAutomobileObj2 =>
                    test(`new ObjectComparer(${mockAutomobileObj1}, ${mockAutomobileObj2}).omittedKeys is empty`, function()
                    {
                        assert.isEmpty(new ObjectComparer(mockAutomobileObj1, mockAutomobileObj2).omittedKeys);
                    })
            ));

            mockLionObjects.forEach(mockLionObj1 =>
                mockLionObjects.forEach(mockLionObj2 =>
                    test(`new ObjectComparer(${mockLionObj1}, ${mockLionObj2}).omittedKeys is empty`, function()
                    {
                        assert.isEmpty(new ObjectComparer(mockLionObj1, mockLionObj2).omittedKeys);
                    })
            ));

            mockAutomobileObjects.forEach(mockAutomobileObj =>
                    mockLionObjects.forEach(mockLionObj => {
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
            mockAutomobileObjects.forEach(mockAutomobileObj1 =>
                mockAutomobileObjects.forEach(mockAutomobileObj2 =>
                    test(`new ObjectComparer(${mockAutomobileObj1}, ${mockAutomobileObj2}).addedKeys is empty`, function()
                    {
                        assert.isEmpty(new ObjectComparer(mockAutomobileObj1, mockAutomobileObj2).addedKeys);
                    })
            ));

            mockLionObjects.forEach(mockLionObj1 =>
                mockLionObjects.forEach(mockLionObj2 =>
                    test(`new ObjectComparer(${mockLionObj1}, ${mockLionObj2}).addedKeys is empty`, function()
                    {
                        assert.isEmpty(new ObjectComparer(mockLionObj1, mockLionObj2).addedKeys);
                    })
            ));

            mockAutomobileObjects.forEach(mockAutomobileObj =>
                    mockLionObjects.forEach(mockLionObj => {
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
            mockAutomobileObjects.forEach(mockAutomobileObj =>
                mockLionObjects.forEach(mockLionObj =>{
                    test(`new ObjectComparer(${mockAutomobileObj}, ${mockLionObj}).includedKeys === ["toString"]`, function()
                    {
                        assert.deepStrictEqual(new ObjectComparer(mockAutomobileObj, mockLionObj).includedKeys, ["toString"]);
                    });

                    test(`new ObjectComparer(${mockLionObj}, ${mockAutomobileObj}).includedKeys === ["toString"]`, function()
                    {
                        assert.deepStrictEqual(new ObjectComparer(mockLionObj, mockAutomobileObj).includedKeys, ["toString"]);
                    });}
            ));

            mockAutomobileObjects.forEach(mockAutomobileObj1 =>
                mockAutomobileObjects.forEach(mockAutomobileObj2 =>
                        test(`new ObjectComparer(${mockAutomobileObj1}, ${mockAutomobileObj2}).includedKeys === Object.keys(${mockAutomobileObj1})`, function()
                        {
                            assert.deepStrictEqual(new ObjectComparer(mockAutomobileObj1, mockAutomobileObj2).includedKeys, automobileKeys);
                        })
            ));

            mockLionObjects.forEach(mockLionObj1 =>
                mockLionObjects.forEach(mockLionObj2 =>
                    test(`new ObjectComparer(${mockLionObj1}, ${mockLionObj2}).includedKeys === Object.keys(${mockLionObj1})`, function()
                    {
                        assert.deepStrictEqual(new ObjectComparer(mockLionObj1, mockLionObj2).includedKeys, lionKeys);
                    })
            ));
        });
    });
});
