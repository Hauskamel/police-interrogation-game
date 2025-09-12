const firstNames = [
    'Peter', 'Michael', 'Alexander', 'John', 'Robert', 'Lukas', 'Christoph', 
    'Maximilian', 'Simon', 'Justin', 'Louis', 'Gabriel', 'Armin', 'Sebastian', 
    'Ethan', 'Martin', 'Bernhard', 'Leo', 'Leonhard', 'Charles', 'James', 
    'Andrew', 'Steven', 'Brian', 'Kevin', 'Jason', 'Eric', 'Tyler', 'Dylan',
    'Mark', 'Anthony', 'Todd', 'Gregory', 'Kyle', 'Brandon', 'Zachary', 'Cody',
    'George', 'Frank', 'Ronald', 'Larry', 'Wayne', 'Logan', 'Hunter', 'Austin',
    'Blake', 'Daniel', 'Scott', 'Shawn', 'Connor'
]

const randomIndex = firstNames[Math.floor(Math.random() * firstNames.length)];

export const driverImageProfiles = {
    'driver1.jpg': {
        gender: 'male',
        ageRange: [45, 55],
        randomFirstName: randomIndex,
        eyeColor: 'brown'
    },
    'driver2.jpg': {
        gender: 'male',
        ageRange: [21, 32],
        randomFirstName: randomIndex,
        eyeColor: 'brown'
    },
    'driver3.jpg': {
        gender: 'male',
        ageRange: [18, 25],
        randomFirstName: randomIndex,
        eyeColor: 'brown'
    },
    'driver4.jpg': {
        gender: 'male',
        ageRange: [50, 67],
        randomFirstName: randomIndex,
        eyeColor: 'brown'
    },
    'driver5.jpg': {
        gender: 'male',
        ageRange: [30, 40],
        randomFirstName: randomIndex,
        eyeColor: 'blue'
    },
    'driver6.jpg': {
        gender: 'male',
        ageRange: [27, 39],
        randomFirstName: randomIndex,
        eyeColor: 'green'
    },
    'driver7.jpg': {
        gender: 'male',
        ageRange: [40, 50],
        randomFirstName: randomIndex,
        eyeColor: 'hazel'
    },
    'driver8.jpg': {
        gender: 'male',
        ageRange: [25, 35],
        randomFirstName: randomIndex,
        eyeColor: 'blue'
    },
    'driver9.jpg': {
        gender: 'male',
        ageRange: [64, 76],
        randomFirstName: randomIndex,
        eyeColor: 'gray'
    },
    'driver10.jpg': {
        gender: 'male',
        ageRange: [18, 22],
        randomFirstName: randomIndex,
        eyeColor: 'green'
    },
};