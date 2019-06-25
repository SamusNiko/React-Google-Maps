import React from 'react';
import { Menu, Icon } from 'antd';
import PropTypes from 'prop-types';
import noop from 'react-props-noop';
import ListItem from '@/components/ListItem';
import StyledMarkersList from './styles';

const { SubMenu } = Menu;

const MarkersList = props => {
  const { locations, onClick } = props;
  return (
    <StyledMarkersList>
      <Menu mode="inline">
        <SubMenu
          key="sub1"
          title={
            <span>
              <Icon type="environment" />
              Locations
            </span>
          }
        >
          {locations.map(item => {
            return (
              <Menu.Item key={item.key}>
                <ListItem item={item} onClick={onClick} />
              </Menu.Item>
            );
          })}
        </SubMenu>
      </Menu>
    </StyledMarkersList>
  );
};

MarkersList.propTypes = {
  locations: PropTypes.arrayOf(PropTypes.object),
  onClick: PropTypes.func
};
MarkersList.defaultProps = {
  locations: [],
  onClick: noop
};

export default MarkersList;
