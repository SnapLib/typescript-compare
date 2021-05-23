/********
 * LION *
 ********/

type Lion =
{
    name: unknown;
    gender: unknown;
    age: number;
    friends: Array<unknown>;
    family: {[relation: string]: unknown | null | undefined};
    isKing: boolean;
    toString: () => unknown;
};

export const simbaFriends: Array<unknown> = ["Timon", "Pumbaa", "Rafiki"];

export const simbaFamily: {[relation: string]: unknown | null | undefined} =
    {dad: "Mufasa", mom: "Sarabi", sister: null, brother: undefined};

export const Simba: Lion =
{
    name: "Simba",
    gender: "male",
    age: 7,
    friends: simbaFriends,
    family: simbaFamily,
    isKing: true,
    toString: () => "Simba"
};

const kionFriends: Array<unknown> = ["Jasiri", "Bunga", "Kovu"];

const kionFamily: {[relation: string]: unknown} =
    {dad: "Mufasa", mom: "Nala", sister: "Kiara", brother: "Nguruma"};

export const Kion: Lion =
{
    name: "Kion",
    gender: "male",
    age: 3,
    friends: kionFriends,
    family: kionFamily,
    isKing: false,
    toString: () => "Kion"
};

/**************
 * AUTOMOBILE *
 **************/

type Automobile =
{
    type: unknown;
    fuel: unknown;
    numOfWheels: number;
    makes: Array<unknown>;
    models: {[make: string]: Array<unknown>};
    isSafe: boolean;
    toString: () => unknown;
};

export const carMakes: Array<unknown> =
    ["Koenigsegg", "Lamborghini", "Ferrari", "Pagani", "Audi",
     "Porsche", "Nissan", "Honda", "Toyota", "Ford", "Chevrolet"];

export const Car: Automobile =
{
    type: "car",

    fuel: "petrol",

    numOfWheels: 4,

    makes: carMakes,

    models: {
        "Koenigsegg": ["One", "Agera", "CCX", "Jesko"],
        "Lamborghini": ["Aventador", "Huracan", "Reventon", "Murcielago", "Gallardo"],
        "Ferrari": ["Enzo Ferrari", "FXX", "458 Italia"],
        "Audi": ["RS4", "R8", "RS5", "RS6"]
    },

    isSafe: true,

    toString: () => "Car"
};

export const motorcycleMakes: Array<unknown> =
    ["MV Agusta", "Triumph", "BMW", "Honda", "Yamaha", "Kawasaki"];

export const Motorcycle: Automobile =
{
    type: "motorcycle",

    fuel: "petrol",

    numOfWheels: 2,

    makes: motorcycleMakes,

    models: {
        "MV Agusta": ["F3", "Superveloce", "Brutale", "Turismo Veloce"],
        "Triumph": ["Daytona", "Speed Triple", "Bonneville", "Scrambler"],
        "Yamaha": ["R1", "R6", "FZ"]
    },

    isSafe: false,

    toString: () => "Motorcycle"
};

/**********
 * ARRAYS *
 **********/

export const strArrayA: unknown[] = ["first", "second", "third"];

export const strArrayB: unknown[] = ["foo", "second", "baz"];

export const intArrayA: unknown[] = [111, 222, 333];

export const intArrayB: unknown[] = [111, 222, 999];
