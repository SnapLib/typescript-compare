import {getArrayDiff} from "../../main/ts/util/getArrayDiff";
import {assert} from "chai";
import {suite, test} from "mocha";

const mockStrArrayA: unknown[] = ["first", "second", "third"];

const mockStrArrayB: unknown[] = ["foo", "second", "baz"];

const mockIntArrayA: unknown[] = [111, 222, 333];

const mockIntArrayB: unknown[] = [111, 222, 999];

suite("TestGetArrayDiff", function testGetArrayDiff()
{
    test(`["${mockStrArrayA.join('", "')}"] -> ["${mockStrArrayA.join('", "')}"] returns empty`, function testEqualArrayReturnsEmpty()
    {
        assert.isEmpty(getArrayDiff(mockStrArrayA, mockStrArrayA));
    });

    suite(`["${mockStrArrayA.join('", "')}"] -> ["${mockStrArrayB.join('", "')}"]`, function testSecondIndexStrDiff()
    {
        test("Diff indexes are 0 and 2", function()
        {
            assert.deepStrictEqual(getArrayDiff(mockStrArrayA, mockStrArrayB).map(diff => diff.index), [0, 2]);
        });

        test('Diff source values are "first" and "third"', function()
        {
            assert.deepStrictEqual(getArrayDiff(mockStrArrayA, mockStrArrayB).map(diff => diff.sourceValue), ["first", "third"]);
        });

        test('Diff target values are "foo" and "baz"', function()
        {
            assert.deepStrictEqual(getArrayDiff(mockStrArrayA, mockStrArrayB).map(diff => diff.targetValue), ["foo", "baz"]);
        });
    });

    suite(`[${mockIntArrayA.join(", ")}] -> [${mockIntArrayB.join(", ")}]`, function testThirdIndexIntDiff()
    {
        test("Diff index is 2", function()
        {
            assert.deepStrictEqual(getArrayDiff(mockIntArrayA, mockIntArrayB).map(diff => diff.index), [2]);
        });

        test("Diff source value is 333", function()
        {
            assert.deepStrictEqual(getArrayDiff(mockIntArrayA, mockIntArrayB).map(diff => diff.sourceValue), [333]);
        });

        test("Diff target values is 999", function()
        {
            assert.deepStrictEqual(getArrayDiff(mockIntArrayA, mockIntArrayB).map(diff => diff.targetValue), [999]);
        });
    });

    suite(`["${mockStrArrayA.join('", "')}"] -> [${mockIntArrayA.join(", ")}]`, function testSecondIndexStrDiff()
    {
        test("Diff indexes are 0, 1, and 2", function()
        {
            assert.deepStrictEqual(getArrayDiff(mockStrArrayA, mockIntArrayA).map(diff => diff.index), [0, 1, 2]);
        });

        test('Diff source values are "first", "second", and "third"', function()
        {
            assert.deepStrictEqual(getArrayDiff(mockStrArrayA, mockIntArrayA).map(diff => diff.sourceValue), ["first", "second", "third"]);
        });

        test("Diff target values are 111, 222, and 333", function()
        {
            assert.deepStrictEqual(getArrayDiff(mockStrArrayA, mockIntArrayA).map(diff => diff.targetValue), [111, 222, 333]);
        });
    });
});
