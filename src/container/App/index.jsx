import React from 'react';
import PropTypes from 'prop-types';
import noop from 'react-props-noop';
import { Layout, message, Menu, Icon } from 'antd';
import { connect } from 'react-redux';
import supercluster from 'points-cluster';
import Map from '@/components/Map';
import ModalWindow from '@/components/ModalWindow';
import { getLocations, getClustersState } from '@/actions';

import './styles.css';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
let db;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      event: null,
      currentItemKey: null,
      inputValue: '',
      isCreator: false,
      isRedactor: false,
      mapOptions: {
        center: { lat: 53.904541, lng: 27.561523 },
        zoom: 9,
        bounds: {
          ne: { lat: 89.95945216608882, lng: 180 },
          nw: { lat: 89.95945216608882, lng: -180 },
          se: { lat: -89.99206264637093, lng: 180 },
          sw: { lat: -89.99206264637093, lng: -180 }
        }
      }
    };
  }

  componentDidMount() {
    this.connectDB(this.getMarkers);
  }

  getClusters = () => {
    const { locations } = this.props;
    const { mapOptions } = this.state;
    const clusters = supercluster(locations, {
      minZoom: 0,
      maxZoom: 16,
      radius: 60
    });
    return clusters(mapOptions);
  };

  createClusters = () => {
    const { getClustersProps } = this.props;
    const data = this.getClusters().map(e => {
      return {
        lat: e.wy,
        lng: e.wx,
        numPoints: e.numPoints,
        id: `${e.numPoints}_${e.points[0].key}`,
        points: e.points,
        zoom: e.zoom
      };
    });
    getClustersProps(data);
  };

  handleMapChange = ({ center, zoom, bounds }) => {
    this.setState({
      mapOptions: {
        center,
        zoom,
        bounds
      }
    });
    this.createClusters();
  };

  handleMarkerClick = item => {
    const currentMarker = item.points[0];
    this.setState({ currentItemKey: currentMarker.key, inputValue: currentMarker.description });
    this.showRedactor();
  };

  handleMenuItemClick = item => {
    this.setState({ currentItemKey: item.key, inputValue: item.description });
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
      message.error(e.target.error.name);
    };
  };

  addMarker = newMarker => {
    const transaction = db.transaction(['markers'], 'readwrite');
    const store = transaction.objectStore('markers');
    const request = store.add(newMarker);
    request.onerror = e => {
      message.error(e.target.error.name);
    };
    request.onsuccess = this.getMarkers();
  };

  updateMarker = marker => {
    const transaction = db.transaction(['markers'], 'readwrite');
    const store = transaction.objectStore('markers');
    const request = store.put(marker);
    request.onerror = e => {
      message.error(e.target.error.name);
    };
    request.onsuccess = this.getMarkers();
  };

  deleteMarker = key => {
    const transaction = db.transaction(['markers'], 'readwrite');
    const store = transaction.objectStore('markers');
    const request = store.delete(key);
    request.onerror = e => {
      message.error(e.target.error.name);
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
      this.createClusters();
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
      message.warning('Please, enter description');
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
    const { currentItemKey, inputValue } = this.state;
    const { locations } = this.props;
    const currentMarker = locations.find(item => item.key === currentItemKey);
    currentMarker.description = inputValue;
    this.updateMarker(currentMarker);
    this.setState({
      isRedactor: false,
      inputValue: '',
      event: null
    });
  };

  handleDeleteRedactor = () => {
    const { currentItemKey } = this.state;
    this.deleteMarker(currentItemKey);
    this.setState({
      inputValue: '',
      isRedactor: false
    });
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
    const { isCreator, isRedactor, inputValue, mapOptions } = this.state;
    const { locations, clusters } = this.props;
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
            <Menu mode="inline" style={{ height: '100%' }}>
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
                    <Menu.Item key={item.key} onClick={() => this.handleMenuItemClick(item)}>
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
                minHeight: '85vh'
              }}
            >
              <Map
                zoom={mapOptions.zoom}
                center={mapOptions.center}
                clusters={clusters}
                mapOptions={mapOptions}
                handleMapChange={this.handleMapChange}
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
  clusters: PropTypes.arrayOf(PropTypes.object),
  getLocationsProps: PropTypes.func,
  getClustersProps: PropTypes.func
};

App.defaultProps = {
  locations: [],
  clusters: [],
  getLocationsProps: noop,
  getClustersProps: noop
};

function mapStateToProps(state) {
  return {
    locations: state.locations,
    clusters: state.clusters
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getLocationsProps: newState => dispatch(getLocations(newState)),
    getClustersProps: data => dispatch(getClustersState(data))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
