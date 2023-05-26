const { Client, LocalAuth, Buttons, Location } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const client = new Client({
    authStrategy : new LocalAuth(),
});
let button = new Buttons('Please select one of the below options.', [{ body: 'Nearest Store' }, { body: 'Timing' }, { body: 'Product Details' }], 'XYZ Stores');

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

function getDistance(lat1, lon1, lat2, lon2) {
    var R = 6371; // km (change this constant to get miles)
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLon = (lon2 - lon1) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return Math.round(d * 1000);
}

const coordinates = [
    {
        "lat": 24.5529990,
        "lng": 80.8218023
    },
    {
        "lat": 24.5554423,
        "lng": 80.8232111
    },
    {
        "lat": 24.5657560,
        "lng": 80.8163145
    }
]

client.on('message', message => {
    if (message.body === 'Hello') {
        client.sendMessage(message.from, button);
    }

    else if (message.body == 'Nearest Store') {
        client.sendMessage(message.from, 'Please share your location')
    }

    else if (message.type === 'location') {
        const distance = []
        console.log(message.location.latitude, message.location.longitude)
        coordinates.forEach(element => {
            let dist = getDistance(message.location.latitude, message.location.longitude, element.lat, element.lng)
            console.log(dist)
            distance.push(dist)
        });
        let minimumDistance = Math.min(...distance)
        console.log(distance)
        let nearest = coordinates[distance.indexOf(minimumDistance)]
        client.sendMessage(message.from, `https://www.google.com/maps/search/?api=1&query=${nearest.lat},${nearest.lng}`);
    }

    else if (message.body == 'Timing') {
        client.sendMessage(message.from, 'Timing: 10:00 AM to 10:00 PM');
    }
});

client.initialize();
