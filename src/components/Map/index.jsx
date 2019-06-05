import React from 'react';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from 'react-google-maps';

const Map = withScriptjs(withGoogleMap((props) => {
  const { favoritLocations } = props;
  return (
    <GoogleMap
      defaultZoom={15}
      defaultCenter={{ lat: 53.904541, lng: 27.561523 }}
      onClick={props.handleMapClick}
    >
      {favoritLocations.map((item, index) => (
        <Marker
          key={item.key}
          onClick={() => props.handleMarkerClick(item, index)}
          position={{ lat: item.lat, lng: item.lng }}
        />
      ))}
    </GoogleMap>
  );
}));


export default Map;
