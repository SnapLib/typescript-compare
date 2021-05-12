/* eslint-disable @typescript-eslint/no-explicit-any */
import {ObjectComparer} from "../main/ts/ObjectComparer";
import {assert} from "chai";
import {suite, test} from "mocha";

const objA1: Readonly<any> = Object.freeze({
    type: "car",
    fuel: "petrol",
    numOfWheels: 4,
    makes: ["Koenigsegg", "Lamborghini", "Ferrari", "Pagani", "Audi",
            "Porsche", "Nissan", "Honda", "Toyota", "Ford", "Chevrolet"],
    obj: {
        prop1: "foo",
        prop2: 2,
        prop3: false,
        prop4: ["bar", "baz"]
    },
    isSafe: true});

const objA2: Readonly<any> = Object.freeze({
    type: "motorcycle",
    fuel: "petrol",
    numOfWheels: 2,
    makes: ["MV Agusta", "Triumph", "Honda", "Yamaha", "Kawasaki"],
    obj: {
        prop1: "foo",
        prop2: 2,
        prop3: false,
        prop4: ["bar", "baz"]
    },
    isSafe: false});

const objB1: Readonly<any> = Object.freeze({
    name: "Simba",
    gender: "male",
    age: 7,
    friends: ["Timon", "Pumbaa", "Rafiki"],
    family: {
        dad: "Mufasa",
        mom: "Sarabi",
        sister: null
    },
    isKing: true
});

const objB2: Readonly<any> = Object.freeze({
    name: "Kion",
    gender: "male",
    age: 3,
    friends: ["Jasiri", "Bunga", "Kovu"],
    family: {
        dad: "Mufasa",
        mom: "Nala",
        sister: "Kiara"
    },
    isKing: false
});

suite("TestMutant", function testMutant()
{
    suite("Valid ObjectComparer construction does not throw", function testValidMutantCtor()
    {
        test("new ObjectComparer(objA1, objA1) does not throw", function testValidCtorDoesNotThrow1()
        {
            assert.doesNotThrow(() => new ObjectComparer(objA1, objA1));
        });

        test("new ObjectComparer(objA1, objA2) does not throw", function testValidCtorDoesNotThrow2()
        {
            assert.doesNotThrow(() => new ObjectComparer(objA1, objA2));
        });

        test("new ObjectComparer(objA1, objB1) does not throw", function testValidCtorDoesNotThrow3()
        {
            assert.doesNotThrow(() => new ObjectComparer(objA1, objB1));
        });

        test("new ObjectComparer(objB1, objA1) does not throw", function testValidCtorDoesNotThrow4()
        {
            assert.doesNotThrow(() => new ObjectComparer(objB1, objA1));
        });

        test("new ObjectComparer(objB1, objB2) does not throw", function testValidCtorDoesNotThrow5()
        {
            assert.doesNotThrow(() => new ObjectComparer(objB1, objB2));
        });

        test("new ObjectComparer(objB1, objA2) does not throw", function testValidCtorDoesNotThrow6()
        {
            assert.doesNotThrow(() => new ObjectComparer(objB1, objA2));
        });
    });
});
