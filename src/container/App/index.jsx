import React from 'react';
import PropTypes from 'prop-types';
import noop from 'react-props-noop';
import { Layout, Menu, Icon } from 'antd';
import { connect } from 'react-redux';

import Map from '@/components/Map';
import ModalWindow from '@/components/ModalWindow';
import mapURL from '@/constants/services';
import getLocations from '@/actions';

import './styles.css';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
let db;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      event: null,
      currentItemIndex: null,
      inputValue: '',
      isCreator: false,
      isRedactor: false
    };
  }

  componentDidMount() {
    this.connectDB(this.getMarkers);
  }

  handleMarkerClick = (item, index) => {
    this.setState({ currentItemIndex: index, inputValue: item.description });
    this.showRedactor();
  };

  handleMapClick = event => {
    this.setState({ event });
    this.showCreator();
  };

  connectDB = f => {
    const openRequest = indexedDB.open('locations', 2);
    openRequest.onupgradeneeded = e => {
      const thisDB = e.target.result;
      if (!thisDB.objectStoreNames.contains('markers')) {
        thisDB.createObjectStore('markers', { keyPath: 'key' });
      }
    };
    openRequest.onsuccess = e => {
      db = e.target.result;
      f();
    };
    openRequest.onerror = e => {
      console.log('Error', e.target.error.name);
    };
  };

  addMarker = newMarker => {
    const transaction = db.transaction(['markers'], 'readwrite');
    const store = transaction.objectStore('markers');
    const request = store.add(newMarker);
    request.onerror = e => {
      console.log('Error', e.target.error.name);
    };
    request.onsuccess = this.getMarkers();
  };

  updateMarker = marker => {
    const transaction = db.transaction(['markers'], 'readwrite');
    const store = transaction.objectStore('markers');
    const request = store.put(marker);
    request.onerror = e => {
      console.log('Error', e.target.error.name);
    };
    request.onsuccess = this.getMarkers();
  };

  deleteMarker = marker => {
    const transaction = db.transaction(['markers'], 'readwrite');
    const store = transaction.objectStore('markers');
    const request = store.delete(marker);
    request.onerror = e => {
      console.log('Error', e.target.error.name);
    };
    request.onsuccess = this.getMarkers();
  };

  getMarkers = () => {
    const { getLocationsProps } = this.props;
    const transaction = db.transaction(['markers'], 'readonly');
    const store = transaction.objectStore('markers');
    const request = store.getAll();
    request.onsuccess = e => {
      const newState = e.target.result;
      getLocationsProps(newState);
    };
  };

  handleInputChange = event => {
    this.setState({ inputValue: event.target.value });
  };

  handleOkCreator = () => {
    const { event, inputValue } = this.state;
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const newMarker = {
      key: `${lat}${lng}`,
      lat,
      lng,
      description: inputValue
    };
    if (newMarker.description !== '') {
      this.addMarker(newMarker);
      this.setState({ inputValue: '', event: null, isCreator: false });
    } else {
      alert('Please, enter description');
    }
  };

  handleCancel = () => {
    this.setState({
      isCreator: false,
      isRedactor: false,
      inputValue: '',
      event: null
    });
  };

  handleSaveRedactor = () => {
    const { currentItemIndex, inputValue } = this.state;
    const { locations } = this.props;
    const currentMarker = locations[currentItemIndex];
    currentMarker.description = inputValue;
    this.updateMarker(currentMarker);
    this.setState({
      isRedactor: false,
      inputValue: '',
      event: null
    });
  };

  handleDeleteRedactor = () => {
    const { currentItemIndex } = this.state;
    const { locations } = this.props;
    const marker = { ...locations[currentItemIndex] };
    this.deleteMarker(marker.key);
    this.setState({ inputValue: '', isRedactor: false });
  };

  showCreator() {
    this.setState({
      isCreator: true
    });
  }

  showRedactor() {
    this.setState({
      isRedactor: true
    });
  }

  render() {
    const { isCreator, isRedactor, inputValue } = this.state;
    const { locations } = this.props;
    return (
      <Layout>
        <Header className="header" style={{ height: '10hv' }}>
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" style={{ lineHeight: '64px' }}>
            <Menu.Item key="1">Map</Menu.Item>
          </Menu>
        </Header>
        <Layout className="layoutSideMenu">
          <Sider className="sideMenu" width={200} style={{ background: '#fff' }}>
            <Menu mode="inline" style={{ height: '100%', borderRight: 0 }}>
              <SubMenu
                key="sub1"
                title={
                  <span>
                    <Icon type="environment" />
                    Locations
                  </span>
                }
              >
                {locations.map((item, index) => {
                  return (
                    <Menu.Item key={item.key} onClick={() => this.handleMarkerClick(item, index)}>
                      <span>{item.description}</span>
                    </Menu.Item>
                  );
                })}
              </SubMenu>
            </Menu>
          </Sider>
          <Layout>
            <Content
              style={{
                background: '#fff',
                margin: 0,
                minHeight: 480
              }}
            >
              <Map
                googleMapURL={mapURL}
                loadingElement={<div style={{ height: '100%' }} />}
                containerElement={<div style={{ height: '90vh' }} />}
                mapElement={<div style={{ height: '100%' }} />}
                locations={locations}
                handleMapClick={this.handleMapClick}
                handleMarkerClick={this.handleMarkerClick}
                isMarkerShown
              />

              <ModalWindow
                handleOkCreator={this.handleOkCreator}
                isCreator={isCreator}
                handleDeleteRedactor={this.handleDeleteRedactor}
                handleCancel={this.handleCancel}
                handleSaveRedactor={this.handleSaveRedactor}
                isRedactor={isRedactor}
                inputValue={inputValue}
                handleInputChange={this.handleInputChange}
              />
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

App.propTypes = {
  locations: PropTypes.arrayOf(PropTypes.object),
  getLocationsProps: PropTypes.func
};

App.defaultProps = {
  locations: [],
  getLocationsProps: noop
};

function mapStateToProps(state) {
  return {
    locations: state.locations
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getLocationsProps: newState => dispatch(getLocations(newState))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
