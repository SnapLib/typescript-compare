export interface AutoMobile
{
    type: string;
    fuel: string;
    numOfWheels: number;
    makes: Array<string>;
    models: {[make: string]: Array<string>};
    isSafe: boolean;
}

export const carMakes: Array<string> =
    ["Koenigsegg", "Lamborghini", "Ferrari", "Pagani", "Audi",
    "Porsche", "Nissan", "Honda", "Toyota", "Ford", "Chevrolet"];

export class Car implements AutoMobile
{
    type = "car";

    fuel = "petrol";

    numOfWheels = 4;

    makes = carMakes;

    models = {
        "Koenigsegg": ["One", "Agera", "CCX", "Jesko"],
        "Lamborghini": ["Aventador", "Huracan", "Reventon", "Murcielago", "Gallardo"],
        "Ferrari": ["Enzo Ferrari", "FXX", "458 Italia"],
        "Audi": ["RS4", "R8", "RS5", "RS6"]
    };

    isSafe = true;

    toString = (): string => "Car";
}

export const motorcycleMakes: Array<string> =
    ["MV Agusta", "Triumph", "BMW", "Honda", "Yamaha", "Kawasaki"];

export class Motorcycle implements AutoMobile
{
    type = "motorcycle";

    fuel = "petrol";

    numOfWheels = 2;

    makes = motorcycleMakes;

    models = {
        "MV Agusta": ["F3", "Superveloce", "Brutale", "Turismo Veloce"],
        "Triumph": ["Daytona", "Speed Triple", "Bonneville", "Scrambler"],
        "Yamaha": ["R1", "R6", "FZ"]
    };

    isSafe = false;

    toString = (): string => "Motorcycle";
}
