import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import noop from 'react-props-noop';

const ListItem = props => {
  const { item, onClick } = props;
  const memorizedCallback = useCallback(() => onClick(item), [item, onClick]);
  return (
    <div role="presentation" onClick={memorizedCallback}>
      {item.description}
    </div>
  );
};

ListItem.propTypes = {
  item: PropTypes.shape({
    description: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }),
  onClick: PropTypes.func
};
ListItem.defaultProps = {
  item: {},
  onClick: noop
};
export default ListItem;
