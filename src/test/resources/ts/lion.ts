type Lion =
{
    name: string;
    gender: string;
    age: number;
    friends: Array<unknown>;
    family: unknown | null | undefined;
    isKing: boolean;
    toString: () => string;
};

export const simbaFriends: Array<unknown> = ["Timon", "Pumbaa", "Rafiki"];

export const simbaFamily: unknown | null | undefined =
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

export const kionFriends: Array<unknown> = ["Jasiri", "Bunga", "Kovu"];

export const kionFamily: unknown | null | undefined =
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

export const lionKeys: Array<string> = Object.keys(Simba);
