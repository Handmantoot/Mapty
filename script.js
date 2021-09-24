'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class workout {
    date = new Date();
    id = Date.now() + ''.slice(-10)

    constructor(coords, distance, duration) {
        this.coords = coords; // [lat,lng] array of latitude and longitude
        this.distance = distance; //in km
        this.Duration = duration; //in mins
    }
}


class Running extends workout {
    constructor(coors, distance, duration, cadence) {
        super(coors, distance, duration)
        this.cadence = cadence
        this.calcPace();
    }
    calcPace() {
        //mins/km
        this.pace = this.duration / this.distance
        return this.pace
    }
}


class cycling extends workout {
    constructor(coors, distance, duration, elevationGain) {
        super(coors, distance, duration)
        this.elevationGain = elevationGain
        this.calcPace()
    }
    calcPace() {
        //km
        this.speed = this.distance / (this.duration / 60)
        this.speed
    }
}

// const run1 = new Running([39, -12], 5.2, 24, 178)
// const cycle1 = new cycling([39, -12], 5.2, 24, 178)
// console.log(run1, cycle1)
//___________*_____________________
//Application architecture
class App {
    #map;
    #mapEvent;
    constructor() {
        this._getPosition();

        form.addEventListener('submit', this._newWorkout.bind(this));

        inputType.addEventListener('change', this._toggleElevationField);
    }

    _getPosition() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function () {
                alert("Could not get your location");

            });
        }
    }

    _loadMap(position) {
        const { latitude } = position.coords
        const { longitude } = position.coords
        // console.log(`Current location is at ${latitude}, ${longitude}`)
        console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

        const coords = [latitude, longitude];
        console.log(this)
        this.#map = L.map('map').setView(coords, 13);
        //console.log(map);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(this.#map);

        //Handling clicks on the map
        this.#map.on('click', this._showForm.bind(this))
    }

    _showForm(mapE) {  //mapE renamed to MapPing
        this.#mapEvent = mapE
        form.classList.remove('hidden');
        inputDistance.focus();
    }

    _toggleElevationField() {
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    }

    _newWorkout(e) {
        e.preventDefault();

        //clear input fields
        inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = '';



        // Displays the Marker
        const { lat, lng } = this.#mapEvent.latlng

        L.marker([lat, lng])
            .addTo(this.#map)
            .bindPopup(
                L.popup({
                    maxWidth: 250,
                    minWidth: 100,
                    autoClose: false,
                    closeOnClick: false,
                    classname: 'running-popup',
                })
            )
            .setPopupContent('WorkOut')
            .openPopup();

    }
}

const app = new App();





