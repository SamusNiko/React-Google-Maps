import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap } from 'react-google-maps';
import { compose, withProps, withHandlers } from 'recompose';
import ClusterMarker from '@/components/ClusterMarker';
import Marker from '@/components/Marker';

import { mapURL } from '@/constants';

const defaultMapOptions = {
  center: { lat: 53.904541, lng: 27.561523 },
  zoom: 9
};

const Map = compose(
  withProps({
    googleMapURL: mapURL,
    loadingElement: <div style={{ height: '100%', width: '100%' }} />,
    containerElement: <div style={{ height: '85vh', width: '100%' }} />,
    mapElement: <div style={{ height: '100%', width: '100%' }} />
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
        let latMin = points[0].lat;
        let lngMax = points[0].lng;
        let lngMin = points[0].lng;
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
        const bounds = {
          ne: {
            lat: refs.map
              .getBounds()
              .getNorthEast()
              .lat(),
            lng: refs.map
              .getBounds()
              .getNorthEast()
              .lng()
          },
          nw: {
            lat: refs.map
              .getBounds()
              .getNorthEast()
              .lat(),
            lng: refs.map
              .getBounds()
              .getSouthWest()
              .lng()
          },
          se: {
            lat: refs.map
              .getBounds()
              .getSouthWest()
              .lat(),
            lng: refs.map
              .getBounds()
              .getNorthEast()
              .lng()
          },
          sw: {
            lat: refs.map
              .getBounds()
              .getSouthWest()
              .lat(),
            lng: refs.map
              .getBounds()
              .getSouthWest()
              .lng()
          }
        };
        const zoom = refs.map.getZoom();
        const center = { lat: refs.map.getCenter().lat(), lng: refs.map.getCenter().lng() };
        props.handleMapChange({ center, zoom, bounds });
      }
    };
  }),
  withScriptjs,
  withGoogleMap
)(props => {
  const { clustersOfMarkers, handleClusterClick, handleMarkerClick } = props;
  return (
    <GoogleMap
      ref={props.onMapMounted}
      defaultZoom={defaultMapOptions.zoom}
      defaultCenter={defaultMapOptions.center}
      onClick={props.handleMapClick}
      onIdle={props.mapChanged}
    >
      {clustersOfMarkers.map(item => {
        if (item.numPoints === 1) {
          return <Marker key={item.id} item={item} onClick={handleMarkerClick} />;
        }
        return <ClusterMarker key={item.id} item={item} onClick={handleClusterClick} />;
      })}
    </GoogleMap>
  );
});

export default Map;
