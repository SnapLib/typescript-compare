export const isEqual = (source: unknown, target: unknown): boolean =>
{
    if (source === target)
    {
        return true;
    }
    else if (typeof source !== typeof target)
    {
        return false;
    }
    else if (source === null || target === null)
    {
        return source === null && target === null;
    }
    else if (typeof source === "symbol" || typeof target === "symbol")
    {
        return (source as symbol).description === (target as symbol).description;
    }
    else if (Array.isArray(source) && Array.isArray(target))
    {
        if (source.length !== target.length)
        {
            return false;
        }

        return Array.from(source.entries()).every(sourceEntry => isEqual(sourceEntry[1], target[sourceEntry[0]]));
    }
    // If source and target arguments are objects, but not arrays or null
    else
    {
        /*
         * Confirm that source and target arguments can be interpreted as
         * array of entries. This should always be the case at this point in
         * this function and is mostly to stop TypeScript from throwing an error
         * in getting the entries from the target and source arguments.
         */
        if (typeof source !== "object" || source === null)
        {
            throw new Error(`source argument ${source === null ? "is null" : "not interpretable object"}`);
        }
        if (typeof target !== "object" || target === null)
        {
            throw new Error(`target argument ${target === null ? "is null" : "not interpretable object"}`);
        }

        const targetEntries: readonly Readonly<[string, Readonly<unknown>]>[] =
            Object.freeze(Object.entries(target));

        return Object.entries(source).every(srcEntry =>
            targetEntries.some(targetEntry =>
                srcEntry[0] === targetEntry[0] && isEqual(srcEntry[1], targetEntry[1]))
            );
    }

};
