export const isEqual = (source: unknown, target: unknown): boolean =>
{
    const primitiveTypes: ReadonlySet<string> =
        new Set(["string", "number", "bigint", "boolean", "undefined"]);

    if (source === target)
    {
        return true;
    }
    else if (typeof source !== typeof target)
    {
        return false;
    }
    else if (primitiveTypes.has(typeof source))
    {
        return source === target;
    }
    else if (typeof source === "symbol")
    {
        return typeof target === "symbol" ? source.description === target.description : false;
    }
    else if (typeof source === "function")
    {
        if (typeof target !== "function")
        {
            return false;
        }
        if (source.name !== target.name)
        {
            return false;
        }

        if (source.length !== target.length)
        {
            return false;
        }

        if (source.toString() !== target.toString())
        {
            return false;
        }

        return true;
    }
    else if (Array.isArray(source))
    {
        return Array.isArray(target) && source.length === target.length
               ? Array.from(source.entries()).every(sourceEntry => isEqual(sourceEntry[1], target[sourceEntry[0]]))
               : false;
    }
    else if (source === null || target === null)
    {
        return source === target;
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

        const srcEntries: readonly Readonly<[string, Readonly<unknown>]>[] =
            Object.freeze(Object.entries(source));
        const targetEntries: readonly Readonly<[string, Readonly<unknown>]>[] =
            Object.freeze(Object.entries(target));

        return srcEntries.length === targetEntries.length
               ? srcEntries.every(srcEntry =>
                   srcEntry[0] in target && isEqual(srcEntry[1], targetEntries.find(targetEntry => srcEntry[0] === targetEntry[0])?.[1]))
               : false;
    }
};

export {isEqual as default};
