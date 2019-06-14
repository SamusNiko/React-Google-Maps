import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import { mapURL } from '@/constants';

const { compose, withProps } = require('recompose');
const { MarkerClusterer } = require('react-google-maps/lib/components/addons/MarkerClusterer');

const Map = compose(
  withProps({
    googleMapURL: mapURL,
    loadingElement: <div className="loadElem" style={{ height: '100%' }} />,
    containerElement: <div className="containerElem" style={{ height: '85vh' }} />,
    mapElement: <div className="mapElem" style={{ height: '100%' }} />
  }),
  withScriptjs,
  withGoogleMap
)(props => {
  const { locations } = props;
  return (
    <GoogleMap
      defaultZoom={10}
      defaultCenter={{ lat: 53.904541, lng: 27.561523 }}
      onClick={props.handleMapClick}
    >
      <MarkerClusterer onClick={props.handleClusterClick}>
        {locations.map((item, index) => (
          <Marker
            key={item.key}
            onClick={() => props.handleMarkerClick(item, index)}
            position={{ lat: item.lat, lng: item.lng }}
          />
        ))}
      </MarkerClusterer>
    </GoogleMap>
  );
});

export default Map;
