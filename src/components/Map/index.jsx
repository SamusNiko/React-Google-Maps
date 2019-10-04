import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap } from 'react-google-maps';
import { compose, withProps, withHandlers } from 'recompose';
import ClusterMarker from '@/components/ClusterMarker';
import Marker from '@/components/Marker';
import { LoadingElement, ContainerElement, MapElement } from './styles';
import { getMapBounds } from '@/helper/getBounds';
import { DEFAULT_CENTER_COORDINATES, DEFAULT_MAP_ZOOM, mapURL } from '@/constants';

const Map = compose(
  withProps({
    googleMapURL: mapURL,
    loadingElement: <LoadingElement />,
    containerElement: <ContainerElement />,
    mapElement: <MapElement />
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
        const bounds = getMapBounds(refs);
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
      defaultZoom={DEFAULT_MAP_ZOOM}
      defaultCenter={DEFAULT_CENTER_COORDINATES}
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
