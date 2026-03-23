export function getImageRelatedBiometricalData (image) {
    if (image) {
        let data;
        data = imageBiometricalData[image];
        return {data};
    }
}


const imageBiometricalData = {
    "driver1.jpg" : {
        eyecolor: "light brown",
    },
    "driver2.jpg" : {
        eyecolor: "brown"
    },
    "driver3.jpg" : {
        eyecolor: "blue"
    },
    "driver4.jpg" : {
        eyecolor: "green"
    },
    "driver5.jpg" : {
        eyecolor: "yellow"
    },
    "driver6.jpg" : {
        eyecolor: "light brown",
    },
    "driver7.jpg" : {
        eyecolor: "brown"
    },
    "driver8.jpg" : {
        eyecolor: "blue"
    },
    "driver9.jpg" : {
        eyecolor: "green"
    },
    "driver10.jpg" : {
        eyecolor: "yellow"
    },
}