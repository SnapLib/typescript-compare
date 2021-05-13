export interface Lion
{
    name: string;
    gender: string;
    age: number;
    friends: Array<string>;
    family: {[relation: string]: string | null | undefined};
    isKing: boolean;
}

export const simbaFriends: Array<string> = ["Timon", "Pumbaa", "Rafiki"];

export const simbaFamily: {[relation: string]: string | null | undefined} =
    {dad: "Mufasa", mom: "Sarabi", sister: null, brother: undefined};

export const Simba: Lion =
{
    name: "Simba",
    gender: "male",
    age: 7,
    friends: simbaFriends,
    family: simbaFamily,
    isKing: true,
};

const kionFriends: Array<string> = ["Jasiri", "Bunga", "Kovu"];

const kionFamily: {[relation: string]: string | null | undefined} =
    {dad: "Mufasa", mom: "Nala", sister: "Kiara", brother: "Nguruma"};

export const Kion: Lion =
{
    name: "Kion",
    gender: "male",
    age: 3,
    friends: kionFriends,
    family: kionFamily,
    isKing: false,
};
