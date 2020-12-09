// getting places from APIs
function loadPlaces(position) {
    const params = {
        radius: 300,    // search places not farther than this value (in meters)
        clientId: 'ILAXZHLG1YGODF5TOET4ICFT3I1CFJN5ZR1CRJQHDDS1IDI2',
        clientSecret: 'CU54JRCCZPWDQRRLC1BNT3FJSEJGDV1LOYCOHVOEWEK53FOG',
        version: '20300101',    // foursquare versioning, required but unuseful for this demo
    };

    // CORS Proxy to avoid CORS problems
    const corsProxy = 'https://cors-anywhere.herokuapp.com/';

    // Foursquare API (limit param: number of maximum places to fetch)
    const endpoint = `${corsProxy}https://api.foursquare.com/v2/venues/search?intent=checkin
        &ll=${position.latitude},${position.longitude}
        &radius=${params.radius}
        &client_id=${params.clientId}
        &client_secret=${params.clientSecret}
        &limit=30
        &v=${params.version}`;
    return fetch(endpoint)
        .then((res) => {
            return res.json()
                .then((resp) => {
                    return resp.response.venues;
                })
        })
        .catch((err) => {
            console.error('Error with places API', err);
        })
};


window.onload = () => {
    const scene = document.querySelector('a-scene');

    // first get current user location
    return navigator.geolocation.getCurrentPosition(function (position) {

        // than use it to load from remote APIs some places nearby
        loadPlaces(position.coords)
            .then((places) => {
                places.forEach((place) => {
                    const latitude = place.location.lat;
                    const longitude = place.location.lng;

                    // add place name

                    const icon = document.createElement('a-image');
                    icon.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude}`);
                    icon.setAttribute('title', place.name);
                    icon.setAttribute('src', 'assets/map-marker.png');

                    // for debug purposes, just show in a bigger scale, otherwise I have to personally go on places...
                    icon.setAttribute('scale', '20, 20');

                    icon.addEventListener('loaded', () =>{
                        window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))

                    });
                    // const placeText = document.createElement('a-link');
                    // placeText.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
                    // placeText.setAttribute('title', place.name);
                    // placeText.setAttribute('scale', '15 15 15');
                    //
                    // placeText.addEventListener('loaded', () => {
                    //     window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
                    // });

                    scene.appendChild(icon);
                });
            })
    },
        (err) => console.error('Error in retrieving position', err),
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 27000,
        }
    );
};
