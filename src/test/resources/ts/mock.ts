import {Simba, Kion} from "./lion";
import {Car, Motorcycle} from "./autoMobile";
import {strArrayA, strArrayB, intArrayA, intArrayB} from "./array";

export class Mock
{
    public static readonly Simba: Readonly<unknown> = Object.freeze(Simba);
    public static readonly Kion: Readonly<unknown> = Object.freeze(Kion);
    public static readonly Car: Readonly<unknown> = Object.freeze(Car);
    public static readonly Motorcycle: Readonly<unknown> = Object.freeze(Motorcycle);
    public static readonly strArrayA: readonly Readonly<unknown>[] = Object.freeze(Array.from(strArrayA, Object.freeze));
    public static readonly strArrayB: readonly Readonly<unknown>[] = Object.freeze(Array.from(strArrayB, Object.freeze));
    public static readonly intArrayA: readonly Readonly<unknown>[] = Object.freeze(Array.from(intArrayA, Object.freeze));
    public static readonly intArrayB: readonly Readonly<unknown>[] = Object.freeze(Array.from(intArrayB, Object.freeze));
    public static readonly automobiles: readonly Readonly<unknown>[] = Object.freeze([Car, Motorcycle]);
    public static readonly lions: readonly Readonly<unknown>[] = Object.freeze([Simba, Kion]);
    public static readonly objects: readonly Readonly<unknown>[] = Object.freeze(Mock.lions.concat(Mock.automobiles));
    public static readonly arrays: readonly Readonly<unknown>[] = Object.freeze([strArrayA, strArrayB, intArrayA, intArrayB]);
}

export {Simba, Kion} from "./lion";
export {Car, Motorcycle} from "./autoMobile";
export {strArrayA, strArrayB, intArrayA, intArrayB} from "./array";

export {Mock as default};
