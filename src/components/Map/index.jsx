import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import { MarkerWithLabel } from 'react-google-maps/lib/components/addons/MarkerWithLabel';
import { compose, withProps, withHandlers } from 'recompose';

import { mapURL } from '@/constants';

const iconUrl = require(`@/image/m5.png`);

const Map = compose(
  withProps({
    googleMapURL: mapURL,
    loadingElement: <div className="loadElem" style={{ height: '100%', width: '100%' }} />,
    containerElement: <div className="containerElem" style={{ height: '85vh', width: '100%' }} />,
    mapElement: <div className="mapElem" style={{ height: '100%', width: '100%' }} />
  }),
  withHandlers(props => {
    const refs = {
      map: undefined
    };
    return {
      onMapMounted: () => ref => {
        refs.map = ref;
      },
      handleClusterClick: () => item => {
        const { points } = item;
        let latMax = points[0].lat;
        let lngMax = points[0].lng;
        let latMin = points[0].lat;
        let lngMin = points[0].lat;
        for (let i = 1; i < points.length; i += 1) {
          if (latMax < points[i].lat) {
            latMax = points[i].lat;
          }
          if (lngMax < points[i].lng) {
            lngMax = points[i].lng;
          }
          if (latMin > points[i].lat) {
            latMin = points[i].lat;
          }
          if (lngMin > points[i].lng) {
            lngMin = points[i].lng;
          }
        }
        const sw = { lat: latMin, lng: lngMin };
        const ne = { lat: latMax, lng: lngMax };
        const bounds = new window.google.maps.LatLngBounds(sw, ne);
        refs.map.fitBounds(bounds);
      },
      mapChanged: () => () => {
        const { bounds } = props.mapOptions;
        const zoom = refs.map.getZoom();
        const center = { lat: refs.map.getCenter().lat(), lng: refs.map.getCenter().lng() };
        props.handleMapChange({ center, zoom, bounds });
      }
    };
  }),
  withScriptjs,
  withGoogleMap
)(props => {
  const { clusters, zoom, center } = props;
  return (
    <GoogleMap
      ref={props.onMapMounted}
      defaultZoom={zoom}
      defaultCenter={center}
      onClick={props.handleMapClick}
      onIdle={props.mapChanged}
    >
      {clusters.map(item => {
        if (item.numPoints === 1) {
          return (
            <Marker
              key={item.id}
              onClick={() => props.handleMarkerClick(item)}
              position={{ lat: item.points[0].lat, lng: item.points[0].lng }}
            />
          );
        }
        return (
          <MarkerWithLabel
            labelAnchor={new window.google.maps.Point(10, 13)}
            labelStyle={{
              width: '20px',
              height: '20px',
              textAlign: 'center',
              fontSize: '14px',
              pointerEvents: 'none'
            }}
            icon={{
              url: iconUrl,
              scaledSize: new window.google.maps.Size(50, 50),
              anchor: new window.google.maps.Point(25, 30)
            }}
            key={item.id}
            onClick={() => props.handleClusterClick(item)}
            position={{ lat: item.lat, lng: item.lng }}
          >
            <div>{item.numPoints}</div>
          </MarkerWithLabel>
        );
      })}
    </GoogleMap>
  );
});

export default Map;
