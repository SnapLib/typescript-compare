type AutoMobile =
{
    type: string;
    fuel: string;
    numOfWheels: number;
    makes: Array<string>;
    models: {[make: string]: Array<string>};
    isSafe: boolean;
    toString: () => string;
};

export const carMakes: Array<string> =
    ["Koenigsegg", "Lamborghini", "Ferrari", "Pagani", "Audi",
     "Porsche", "Nissan", "Honda", "Toyota", "Ford", "Chevrolet"];

export const carModels: {[make: string]: Array<string>} =
{
    "Koenigsegg": ["One", "Agera", "CCX", "Jesko"],
    "Lamborghini": ["Aventador", "Huracan", "Reventon", "Murcielago", "Gallardo"],
    "Ferrari": ["Enzo Ferrari", "FXX", "458 Italia"],
    "Audi": ["RS4", "R8", "RS5", "RS6"]
};

export const Car: AutoMobile =
{
    type: "car",

    fuel: "petrol",

    numOfWheels: 4,

    makes: carMakes,

    models: carModels,

    isSafe: true,

    toString: () => "Car"
};

export const motorcycleMakes: Array<string> =
    ["MV Agusta", "Triumph", "BMW", "Honda", "Yamaha", "Kawasaki"];

export const motorcycleModels: {[make: string]: Array<string>} =
{
    "MV Agusta": ["F3", "Superveloce", "Brutale", "Turismo Veloce"],
    "Triumph": ["Daytona", "Speed Triple", "Bonneville", "Scrambler"],
    "Yamaha": ["R1", "R6", "FZ"]
};

export const Motorcycle: AutoMobile =
{
    type: "motorcycle",

    fuel: "petrol",

    numOfWheels: 2,

    makes: motorcycleMakes,

    models: motorcycleModels,

    isSafe: false,

    toString: () => "Motorcycle"
};

export const automobileKeys: Array<string> =
    Object.keys(Car);
