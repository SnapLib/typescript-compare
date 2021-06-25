import {carMakes, carModels, Car, motorcycleMakes, motorcycleModels, Motorcycle} from "../resources/ts/autoMobile";
import {simbaFriends, simbaFamily, Simba, kionFriends, kionFamily, Kion} from "../resources/ts/lion";
import mock from "../resources/ts/mock";
import {Compare} from "../../main/ts/compare";
import {assert} from "chai";
import {suite, test} from "mocha";

const validCtorArgs = mock.mockObjsAndArrays.concat(...mock.strArrayA);

const mockObj = Object.freeze(Object.assign( Object.create(null),
{
    prop1: "first",
    prop2: 2,
    prop3: ["third"],
    prop4: true,
    prop5: {innerProp1: 1, innerProp2: "200"}
}));

const toStr = (o: unknown): string =>
{
    return typeof o === "string" ? `"${o}"`
           : typeof o === "symbol" ? `Symbol("${o.description}")`
           : typeof o === "bigint" ? `BigInt(${o})`
           : Array.isArray(o) ? `[${o.map(e => toStr(e)).join(", ")}]`
           : `${o}`;
};

const convertToComparableObj = (o: unknown): {[key: string]: unknown} =>
{
    return typeof o === "string" ? Object.fromEntries(Array.from(o).entries())
         : Array.isArray(o) ? Object.fromEntries(o.entries())
         : o as {[key: string]: unknown};
};

suite("Compare", function testCompare()
{
    suite("source", function testSource()
    {
        validCtorArgs.forEach((mockObj, index, arr) =>
            test(`new Compare(${toStr(mockObj)}, ${toStr(arr[arr.length - 1 - index])}).source === ${toStr(mockObj)}`, function()
            {
                assert.strictEqual(new Compare(mockObj, arr[arr.length - 1 - index]).source, mockObj);
            }));
    });

    suite("target", function testTarget()
    {
        validCtorArgs.forEach((mockObj, index, arr) =>
            test(`new Compare(${toStr(mockObj)}, ${toStr(arr[arr.length - 1 - index])}).target === ${toStr(arr[arr.length - 1 - index])}`, function()
            {
                assert.strictEqual(new Compare(mockObj, arr[arr.length - 1 - index]).target, arr[arr.length - 1 - index]);
            }));
    });

    suite("omittedProperties", function testOmittedProperties()
    {
        validCtorArgs.forEach(mock => {
            test(`new Compare(${toStr(mock)}, ${toStr(mock)}).omittedProperties returns empty`, function()
            {
                assert.isEmpty(new Compare(mock, mock).omittedProperties);
            });

            test(`new Compare(${toStr(mock)}, MockObj).omittedProperties returns ${toStr(convertToComparableObj(mock))}`, function()
            {
                assert.deepStrictEqual(new Compare(mock, mockObj).omittedProperties, convertToComparableObj(mock));
            });

            test(`new Compare(MockObj, ${toStr(mock)}).omittedProperties returns MockObj`, function()
            {
                assert.deepStrictEqual(new Compare(mockObj, mock).omittedProperties, mockObj);
            });
        });

        const javascriptStr = {4: "s", 5: "c", 6: "r", 7: "i", 8: "p", 9: "t"};

        test('new Compare("java", "javascript").omittedProperties returns empty', function()
        {
            assert.isEmpty(new Compare("java", "javascript").omittedProperties);
        });

        test(`new Compare("javascript", "java").omittedProperties returns\n${JSON.stringify(javascriptStr, undefined, 2)}`, function()
        {
            assert.deepStrictEqual(new Compare("javascript", "java").omittedProperties, javascriptStr);
        });
    });

    suite("extraProperties", function testExtraProperties()
    {
        validCtorArgs.forEach(mock => {
            test(`new Compare(${toStr(mock)}, ${toStr(mock)}).extraProperties returns empty`, function()
            {
                assert.isEmpty(new Compare(mock, mock).extraProperties);
            });

            test(`new Compare(${toStr(mock)}, MockObj).extraProperties returns MockObj`, function()
            {
                assert.deepStrictEqual(new Compare(mock, mockObj).extraProperties, mockObj);
            });

            test(`new Compare(MockObj, ${toStr(mock)}).extraProperties returns ${toStr(convertToComparableObj(mock))}`, function()
            {
                assert.deepStrictEqual(new Compare(mockObj, mock).extraProperties, convertToComparableObj(mock));
            });
        });

        const javascriptStr = {4: "s", 5: "c", 6: "r", 7: "i", 8: "p", 9: "t"};

        test(`new Compare("java", "javascript").extraProperties returns\n${JSON.stringify(javascriptStr, undefined, 2)}`, function()
        {
            assert.deepStrictEqual(new Compare("java", "javascript").extraProperties, javascriptStr);
        });

        test('new Compare("javascript", "java").extraProperties returns empty', function()
        {
            assert.isEmpty(new Compare("javascript", "java").extraProperties);
        });
    });

    suite("sharedProperties", function testSharedProperties()
    {
        validCtorArgs.forEach(mock => {
            test(`new Compare(${toStr(mock)}, MockObj).sharedProperties returns empty`, function()
            {
                assert.isEmpty(new Compare(mock, mockObj).sharedProperties);
            });

            test(`new Compare(MockObj, ${toStr(mock)}).sharedProperties returns empty`, function()
            {
                assert.isEmpty(new Compare(mockObj, mock).sharedProperties);
            });

            test(`new Compare(${toStr(mock)}, ${toStr(mock)}).sharedProperties returns ${toStr(convertToComparableObj(mock))}`, function()
            {
                assert.deepStrictEqual(new Compare(mock, mock).sharedProperties, convertToComparableObj(mock));
            });
        });

        mock.automobiles.forEach((automobile, index, arr) =>
            test(`new Compare(${automobile}, ${arr[arr.length - 1 - index]}).sharedProperties returns {fuel: "petrol"}`, function()
            {
                assert.deepStrictEqual(new Compare(automobile, arr[arr.length - 1 - index]).sharedProperties, {fuel: "petrol"});
        }));

        mock.lions.forEach((lion, index, arr) =>
            test(`new Compare(${lion}, ${arr[arr.length - 1 - index]}).sharedProperties returns {gender: "male"}`, function()
            {
                assert.deepStrictEqual(new Compare(lion, arr[arr.length - 1 - index]).sharedProperties, {gender: "male"});
        }));

        const javaStr = Object.fromEntries(Array.from("java").entries());

        test(`new Compare("java", "javascript").sharedProperties returns\n${JSON.stringify(javaStr, undefined, 2)}`, function()
        {
            assert.deepStrictEqual(new Compare("java", "javascript").sharedProperties, javaStr);
        });

        test(`new Compare("javascript", "java").sharedProperties returns\n${JSON.stringify(javaStr, undefined, 2)}`, function()
        {
            assert.deepStrictEqual(new Compare("javascript", "java").sharedProperties, javaStr);
        });
    });

    suite("alteredProperties", function testAlteredProperties()
    {
        const alteredCarSource =
        {
            type: {sourceValue: "car", targetValue: "motorcycle"},
            numOfWheels: {sourceValue: 4, targetValue: 2},
            makes: {sourceValue: carMakes, targetValue: motorcycleMakes},
            models: {sourceValue: carModels, targetValue: motorcycleModels},
            isSafe: {sourceValue: true, targetValue: false},
            toString: {sourceValue: Car.toString, targetValue: Motorcycle.toString}
        };

        const alteredMotorcycleSource =
        {
            type: {sourceValue: "motorcycle", targetValue: "car"},
            numOfWheels: {sourceValue: 2, targetValue: 4},
            makes: {sourceValue: motorcycleMakes, targetValue: carMakes},
            models: {sourceValue: motorcycleModels, targetValue: carModels},
            isSafe: {sourceValue: false, targetValue: true},
            toString: {sourceValue: Motorcycle.toString, targetValue: Car.toString}
        };

        const alteredSimbaSource =
        {
            name: {sourceValue: "Simba", targetValue: "Kion"},
            age: {sourceValue: 7, targetValue: 3},
            friends: {sourceValue: simbaFriends, targetValue: kionFriends},
            family: {sourceValue: simbaFamily, targetValue: kionFamily},
            isKing: {sourceValue: true, targetValue: false},
            toString: {sourceValue: Simba.toString, targetValue: Kion.toString}
        };

        const alteredKionSource =
        {
            name: {sourceValue: "Kion", targetValue: "Simba"},
            age: {sourceValue: 3, targetValue: 7},
            friends: {sourceValue: kionFriends, targetValue: simbaFriends},
            family: {sourceValue: kionFamily, targetValue: simbaFamily},
            isKing: {sourceValue: false, targetValue: true},
            toString: {sourceValue: Kion.toString, targetValue: Simba.toString}
        };

        test(`new Compare(Car, Motorcycle).alteredProperties returns\n${JSON.stringify(alteredCarSource, undefined, 2)}`, function()
        {
            assert.deepStrictEqual(new Compare(Car, Motorcycle).alteredProperties, alteredCarSource);
        });

        test(`new Compare(Motorcycle, Car).alteredProperties returns\n${JSON.stringify(alteredMotorcycleSource, undefined, 2)}`, function()
        {
            assert.deepStrictEqual(new Compare(Motorcycle, Car).alteredProperties, alteredMotorcycleSource);
        });

        test(`new Compare(Simba, Kion).alteredProperties returns\n${JSON.stringify(alteredSimbaSource, undefined, 2)}`, function()
        {
            assert.deepStrictEqual(new Compare(Simba, Kion).alteredProperties, alteredSimbaSource);
        });

        test(`new Compare(Kion, Simba).alteredProperties returns\n${JSON.stringify(alteredKionSource, undefined, 2)}`, function()
        {
            assert.deepStrictEqual(new Compare(Kion, Simba).alteredProperties, alteredKionSource);
        });

        const fooBarStringDiff =
        {
            0: {sourceValue: "f", targetValue: "b"},
            1: {sourceValue: "o", targetValue: "a"},
            2: {sourceValue: "o", targetValue: "r"}
        };

        test(`new Compare("foo", "bar").alteredProperties returns\n${JSON.stringify(fooBarStringDiff, undefined, 2)}`, function()
        {
            assert.deepStrictEqual(new Compare("foo", "bar").alteredProperties, fooBarStringDiff);
        });

        test(`new Compare("foo", "barfoo").alteredProperties returns\n${JSON.stringify(fooBarStringDiff, undefined, 2)}`, function()
        {
            assert.deepStrictEqual(new Compare("foo", "bar").alteredProperties, fooBarStringDiff);
        });

        test(`new Compare("foobar", "bar").alteredProperties returns\n${JSON.stringify(fooBarStringDiff, undefined, 2)}`, function()
        {
            assert.deepStrictEqual(new Compare("foo", "bar").alteredProperties, fooBarStringDiff);
        });
    });

    suite("has", function testHas()
    {
        suite("omittedProperties", function testHasOmittedProperties()
        {
            validCtorArgs.forEach(mock => {
                test(`new Compare(${toStr(mock)}, ${toStr(mock)}).has.omittedProperties() returns false`, function()
                {
                    assert.isFalse(new Compare(mock, mock).has.omittedProperties());
                });

                test(`new Compare(${toStr(mock)}, MockObj).has.omittedProperties() returns true`, function()
                {
                    assert.isTrue(new Compare(mock, mockObj).has.omittedProperties());
                });

                test(`new Compare(MockObj, ${toStr(mock)}).has.omittedProperties() returns true`, function()
                {
                    assert.isTrue(new Compare(mockObj, mock).has.omittedProperties());
                });
            });

            test('new Compare("java", "javascript").has.omittedProperties() returns false', function()
            {
                assert.isFalse(new Compare("java", "javascript").has.omittedProperties());
            });

            test('new Compare("javascript", "java").has.omittedProperties() returns true', function()
            {
                assert.isTrue(new Compare("javascript", "java").has.omittedProperties());
            });
        });

        suite("extraProperties", function testHasExtraProperties()
        {
            validCtorArgs.forEach(mock => {
                test(`new Compare(${toStr(mock)}, ${toStr(mock)}).has.extraProperties() returns false`, function()
                {
                    assert.isFalse(new Compare(mock, mock).has.extraProperties());
                });

                test(`new Compare(${toStr(mock)}, MockObj).has.extraProperties() returns true`, function()
                {
                    assert.isTrue(new Compare(mock, mockObj).has.extraProperties());
                });

                test(`new Compare(MockObj, ${toStr(mock)}).has.extraProperties() returns true`, function()
                {
                    assert.isTrue(new Compare(mockObj, mock).has.extraProperties());
                });
            });

            test('new Compare("java", "javascript").has.extraProperties() returns true', function()
            {
                assert.isTrue(new Compare("java", "javascript").has.extraProperties());
            });

            test('new Compare("javascript", "java").has.extraProperties() returns false', function()
            {
                assert.isFalse(new Compare("javascript", "java").has.extraProperties());
            });
        });

        suite("sharedProperties", function testHasSharedProperties()
        {
            validCtorArgs.forEach(mock => {
                test(`new Compare(${toStr(mock)}, MockObj).has.sharedProperties() returns false`, function()
                {
                    assert.isFalse(new Compare(mock, mockObj).has.sharedProperties());
                });

                test(`new Compare(MockObj, ${toStr(mock)}).has.sharedProperties() returns false`, function()
                {
                    assert.isFalse(new Compare(mockObj, mock).has.sharedProperties());
                });

                test(`new Compare(${toStr(mock)}, ${toStr(mock)}).has.sharedProperties() returns true`, function()
                {
                    assert.isTrue(new Compare(mock, mock).has.sharedProperties());
                });
            });

            mock.automobiles.forEach((automobile, index, arr) =>
                test(`new Compare(${automobile}, ${arr[arr.length - 1 - index]}).has.sharedProperties() returns true`, function()
                {
                    assert.isTrue(new Compare(automobile, arr[arr.length - 1 - index]).has.sharedProperties());
            }));

            mock.lions.forEach((lion, index, arr) =>
                test(`new Compare(${lion}, ${arr[arr.length - 1 - index]}).has.sharedProperties() returns true`, function()
                {
                    assert.isTrue(new Compare(lion, arr[arr.length - 1 - index]).has.sharedProperties());
            }));

            test(`new Compare("java", "javascript").has.sharedProperties() returns true`, function()
            {
                assert.isTrue(new Compare("java", "javascript").has.sharedProperties());
            });

            test(`new Compare("javascript", "java").has.sharedProperties() returns true`, function()
            {
                assert.isTrue(new Compare("javascript", "java").has.sharedProperties());
            });

            test(`new Compare("javascript", "foobar").has.sharedProperties() returns false`, function()
            {
                assert.isFalse(new Compare("javascript", "foobar").has.sharedProperties());
            });
        });

        suite("alteredProperties", function testHasAlteredProperties()
        {
            mock.automobiles.forEach((autoMobile, index, arr) => {
                test(`new Compare(${autoMobile}, ${autoMobile}).has.alteredProperties() returns false`, function()
                {
                    assert.isFalse(new Compare(autoMobile, autoMobile).has.alteredProperties());
                });

                test(`new Compare(${autoMobile}, ${arr[arr.length - 1 - index]}).has.alteredProperties() returns true`, function()
                {
                    assert.isTrue(new Compare(autoMobile, arr[arr.length - 1 - index]).has.alteredProperties());
                });
            });

            mock.lions.forEach((lion, index, arr) => {
                test(`new Compare(${lion}, ${lion}).has.alteredProperties() returns false`, function()
                {
                    assert.isFalse(new Compare(lion, lion).has.alteredProperties());
                });

                test(`new Compare(${lion}, ${arr[arr.length - 1 - index]}).has.alteredProperties() returns true`, function()
                {
                    assert.isTrue(new Compare(lion, arr[arr.length - 1 - index]).has.alteredProperties());
                });
            });

            test(`new Compare("foo", "foo").has.alteredProperties() returns false`, function()
            {
                assert.isFalse(new Compare("foo", "foo").has.alteredProperties());
            });

            test(`new Compare("foo", "foobar").has.alteredProperties() returns false`, function()
            {
                assert.isFalse(new Compare("foo", "foobar").has.alteredProperties());
            });

            test(`new Compare("foo", "bar").has.alteredProperties() returns true`, function()
            {
                assert.isTrue(new Compare("foo", "bar").has.alteredProperties());
            });

            test(`new Compare("foo", "barfoo").has.alteredProperties() returns true`, function()
            {
                assert.isTrue(new Compare("foo", "bar").has.alteredProperties());
            });

            test(`new Compare("foobar", "bar").has.alteredProperties() returns true`, function()
            {
                assert.isTrue(new Compare("foo", "bar").has.alteredProperties());
            });
        });
    });
});
