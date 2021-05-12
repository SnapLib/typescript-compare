/* eslint-disable @typescript-eslint/no-explicit-any */
import {ObjectComparer} from "../main/ts/ObjectComparer";
import {assert} from "chai";
import {suite, test} from "mocha";

const carMakes: ReadonlyArray<string> = Object.freeze(
    ["Koenigsegg", "Lamborghini", "Ferrari", "Pagani", "Audi",
    "Porsche","Nissan", "Honda", "Toyota", "Ford", "Chevrolet"]);

const motorcycleMakes: ReadonlyArray<string> =
    Object.freeze(["MV Agusta", "Triumph", "Honda", "Yamaha", "Kawasaki"]);

const simbaFriends: ReadonlyArray<string> =
    Object.freeze(["Timon", "Pumbaa", "Rafiki"]);

const simbaFamily: Readonly<any> = Object.freeze(
    {dad: "Mufasa", mom: "Sarabi", sister: null, brother: undefined});

const kionFamily: Readonly<any> = Object.freeze(
    {dad: "Mufasa", mom: "Nala", sister: "Kiara", brother: "Nguruma"});

const kionFriends: ReadonlyArray<string> =
    Object.freeze(["Jasiri", "Bunga", "Kovu"]);

const objA1: Readonly<any> = Object.freeze({
    type: "car",
    fuel: "petrol",
    numOfWheels: 4,
    makes: carMakes,
    obj: {
        prop1: "foo",
        prop2: 2,
        prop3: false,
        prop4: ["bar", "baz"]
    },
    isSafe: true,
    toString: () => "objA1"});

const objA2: Readonly<any> = Object.freeze({
    type: "motorcycle",
    fuel: "petrol",
    numOfWheels: 2,
    makes: motorcycleMakes,
    obj: {
        prop1: "foo",
        prop2: 2,
        prop3: false,
        prop4: ["bar", "baz"]
    },
    isSafe: false,
    toString: () => "objA2"});

const objB1: Readonly<any> = Object.freeze({
    name: "Simba",
    gender: "male",
    age: 7,
    friends: simbaFriends,
    family: simbaFamily,
    isKing: true,
    toString: () => "objB1"});

const objB2: Readonly<any> = Object.freeze({
    name: "Kion",
    gender: "male",
    age: 3,
    friends: kionFriends,
    family: kionFamily,
    isKing: false,
    toString: () => "objB2"});

const mockObjects: ReadonlyArray<{[key: string]: unknown}> =
Object.freeze([objA1, objA2, objB1, objB2]);

const mockAObjects: ReadonlyArray<{[key: string]: unknown}> =
    Object.freeze([objA1, objA2]);

const mockBObjects: ReadonlyArray<{[key: string]: unknown}> =
    Object.freeze([objB1, objB2]);

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
                    test(`new ObjectComparer(${mockObj1}, ${mockObj2}).get.sourceObject() === ${mockObj1}`, function()
                    {
                        assert.strictEqual(new ObjectComparer(mockObj1, mockObj2).get.sourceObject(), mockObj1);
                    })
            ));
        });

        suite("get targetObject()", function testGetTargetObject()
        {
            mockObjects.forEach(mockObj1 =>
                mockObjects.forEach(mockObj2 =>
                    test(`new ObjectComparer(${mockObj1}, ${mockObj2}).get.targetObject() === ${mockObj2}`, function()
                    {
                        assert.strictEqual(new ObjectComparer(mockObj1, mockObj2).get.targetObject(), mockObj2);
                    })
            ));
        });

        suite("get omittedKeys()", function testGetOmittedKeys()
        {
            mockAObjects.forEach(mockAObj1 =>
                mockAObjects.forEach(mockAObj2 =>
                    test(`new ObjectComparer(${mockAObj1}, ${mockAObj2}).get.omittedKeys() is empty`, function()
                    {
                        assert.isEmpty(new ObjectComparer(mockAObj1, mockAObj2).get.omittedKeys());
                    })
            ));

            mockBObjects.forEach(mockBObj1 =>
                mockBObjects.forEach(mockBObj2 =>
                    test(`new ObjectComparer(${mockBObj1}, ${mockBObj2}).get.omittedKeys() is empty`, function()
                    {
                        assert.isEmpty(new ObjectComparer(mockBObj1, mockBObj2).get.omittedKeys());
                    })
            ));
        });
    });
});
