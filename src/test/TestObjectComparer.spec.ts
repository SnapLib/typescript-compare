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
    isSafe: true});

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
    isSafe: false});

const objB1: Readonly<any> = Object.freeze({
    name: "Simba",
    gender: "male",
    age: 7,
    friends: simbaFriends,
    family: simbaFamily,
    isKing: true
});

const objB2: Readonly<any> = Object.freeze({
    name: "Kion",
    gender: "male",
    age: 3,
    friends: kionFriends,
    family: kionFamily,
    isKing: false
});

suite("TestObjectComparer", function testObjectComparer()
{
    suite("Valid ObjectComparer construction does not throw", function testValidObjectComparerCtor()
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
