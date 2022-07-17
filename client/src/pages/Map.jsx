import React, { useState, useEffect, useMemo } from 'react';
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import LocationMarker from './LocationMarker'
import LocationInfoBox from './LocationInfoBox'
import Loader from './Loader'

let key;
let keyLoaded = false;
/*fetch('/get_googleMaps', { // get google maps api key        
    method: "post",
    headers: { "Content-Type": "application/json" },
}).then(function (response) {
    return response.json()
}).then(function (data) {
    key = data;
    keyLoaded = true;
}).catch(function (error) {
    console.error(error);
});*/

export default function Map() {
    const { isLoaded, keyLoaded } = useLoadScript({
      googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // Your Google Maps API key
    });
    const [isShown, setIsShown] = useState(false);
    const [eventData, setEventData] = useState([])
    const [loading, setLoading] = useState([])

    const [locationInfo, setLocationInfo] = useState(null) // Location (includes lat, lng)
  
    const handleSubmit = (event) => {
        event.preventDefault();
        localStorage.setItem("coordinates", locationInfo)
        window.location.href = '/mint'; // Redirect to NFT minting page 
    }
    
    useEffect(() => {
        const fetchEvents = async () => {
          setLoading(true);
          fetch('https://eonet.gsfc.nasa.gov/api/v3/events/geojson?category=wildfires').then(function (response) {
            return response.json()
        }).then(function (data) {
            setEventData(data.features)
            setLoading(false)
        }).catch(function (error) {
          console.error(error);
        });
    
        }
    
        fetchEvents()
      }, [])
    // This checks to see if its a wildfire
    const defaultProps = {
        center: {
            lat: 0,
            lng: 0
        },
        zoom: 3
    };
    if (!isLoaded && loading && !keyLoaded) return <div>Loading...</div>;
    return (
        <div>
            <GoogleMap zoom={defaultProps.zoom} center={defaultProps.center} mapContainerClassName="map-container" 
            onClick={ev => {
                    setLocationInfo({ id: "N/A", title: "N/A", lat: ev.latLng.lat(), lng: ev.latLng.lng() })
                    setIsShown(current => !current);
                }}>
                {eventData.map(ev => (
                    <Marker key={ev.properties.id} position={{ lat: ev.geometry.coordinates[1], lng: ev.geometry.coordinates[0]}} onClick={() => setLocationInfo({ id: ev.properties.id, title: ev.properties.title, lat: ev.geometry.coordinates[1], lng: ev.geometry.coordinates[0] })}/>
                ))}
            </GoogleMap>
            {locationInfo && <LocationInfoBox info={locationInfo} />}
            {isShown && (
                <button onClick={handleSubmit} className="btn btn-secondary btn-sm m-2">Proceed</button>
            )}
        </div>
    );
}

  