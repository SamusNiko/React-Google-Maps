import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import noop from 'react-props-noop';

import { MarkerWithLabel } from 'react-google-maps/lib/components/addons/MarkerWithLabel';

const iconUrl = require(`@/image/m5.png`);

const ClusterMarker = props => {
  const { item, onClick } = props;
  const memorizedCallback = useCallback(() => onClick(item), [item, onClick]);

  return (
    <div>
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
        onClick={memorizedCallback}
        position={{ lat: item.lat, lng: item.lng }}
      >
        <div>{item.numPoints}</div>
      </MarkerWithLabel>
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
