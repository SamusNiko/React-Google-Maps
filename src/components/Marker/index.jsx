import React, { useCallback } from 'react';
import { Marker } from 'react-google-maps';
import PropTypes from 'prop-types';
import noop from 'react-props-noop';

const ClusterMarker = props => {
  const { item, onClick } = props;
  const memorizedCallback = useCallback(() => onClick(item), [item, onClick]);

  return (
    <div>
      <Marker
        onClick={memorizedCallback}
        position={{ lat: item.points[0].lat, lng: item.points[0].lng }}
      />
    </div>
  );
};
ClusterMarker.propTypes = {
  item: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number
  }),
  onClick: PropTypes.func
};

ClusterMarker.defaultProps = {
  item: {},
  onClick: noop
};
export default ClusterMarker;
