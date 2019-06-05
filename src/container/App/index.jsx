import React from 'react';
import { Layout, Menu, Icon } from 'antd';
import { connect } from 'react-redux';

import Map from '@/components/Map';
import ModalWindow from '@/components/ModalWindow';
import { mapURL } from '@/constants';
import { getLocations } from '@/actions';

import './styles.css';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
var db;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      event: null,
      currentItemIndex: null,
      inputValue: '',
      isCreator: false,
      isRedactor: false,
    }
  }

  componentDidMount() {
    this.connectDB(this.getMarkers);
  }

  connectDB(f) {
    var openRequest = indexedDB.open('locations', 2);
    openRequest.onupgradeneeded = function (e) {
      var thisDB = e.target.result;
      if (!thisDB.objectStoreNames.contains('markers')) {
        thisDB.createObjectStore('markers', { keyPath: 'key' });
      }
    }
    openRequest.onsuccess = function (e) {
      console.log('Success!');
      db = e.target.result;
      f();
    }
    openRequest.onerror = function (e) {
      console.log('Error');
      console.dir(e);
    }
  };

  addMarker(newMarker) {
    var transaction = db.transaction(['markers'], 'readwrite');
    var store = transaction.objectStore('markers');
    var request = store.add(newMarker);
    request.onerror = function (e) {
      console.log('Error', e.target.error.name);
    }
    request.onsuccess = this.getMarkers();
  }

  updateMarker(marker) {
    var transaction = db.transaction(['markers'], 'readwrite');
    var store = transaction.objectStore('markers');
    var request = store.put(marker);
    request.onerror = function (e) {
      console.log('Error', e.target.error.name);
    }
    request.onsuccess = this.getMarkers();
  }

  deleteMarker(marker) {
    var transaction = db.transaction(['markers'], 'readwrite');
    var store = transaction.objectStore('markers');
    var request = store.delete(marker);
    request.onerror = function (e) {
      console.log('Error', e.target.error.name);
    };
    request.onsuccess = this.getMarkers();
  }

  getMarkers = (e) => {
    const { getLocations } = this.props;
    var transaction = db.transaction(['markers'], 'readonly');
    var store = transaction.objectStore('markers');
    var request = store.getAll();
    request.onsuccess = (e) => {
      var newState = e.target.result;
      getLocations(newState);
    }
  };

  showCreator() {
    this.setState({
      isCreator: true,
    });
  };

  showRedactor() {
    this.setState({
      isRedactor: true,

    });
  };

  handleOkCreator = () => {
    const { event, inputValue } = this.state;
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const newMarker = {
      key: '' + lat + lng,
      lat: lat,
      lng: lng,
      description: inputValue,
    }
    if (newMarker.description !== '') {
      this.addMarker(newMarker);
      this.setState({ inputValue: '', event: null, isCreator: false });
    } else {
      alert('Please, enter description');
    }
  };

  handleCancel = () => {
    this.setState({
      isCreator: false, isRedactor: false, inputValue: '', event: null
    });
  };



  handleSaveRedactor = () => {
    const index = this.state.currentItemIndex;
    const currentMarker = { ...this.props.locations[index] };
    currentMarker.description = this.state.inputValue;
    this.updateMarker(currentMarker);
    this.setState({
      isRedactor: false, inputValue: '', event: null
    });
  };

  handleDeleteRedactor = () => {
    const index = this.state.currentItemIndex;
    const marker = { ...this.props.locations[index] };
    this.deleteMarker(marker.key);
    this.setState({ inputValue: '', isRedactor: false });
  };

  handleInputChange = (event) => {
    this.setState({ inputValue: event.target.value });
  };


  handleMarkerClick = (item, index) => {
    this.setState({ currentItemIndex: index, inputValue: item.description });
    this.showRedactor();
  };

  handleMapClick = (event) => {
    this.setState({ event });
    this.showCreator();
  };

  render() {
    const {
      isCreator,
      isRedactor,
      inputValue,
    } = this.state;
    const { locations } = this.props;
    return (
      <Layout>
        <Header className="header" style={{ height: '10hv' }}>
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            style={{ lineHeight: '64px', }}
          >
            <Menu.Item key="1">Map</Menu.Item>
          </Menu>
        </Header>
        <Layout className="layoutSideMenu">
          <Sider
            className="sideMenu"
            width={200}
            style={{ background: '#fff' }}
          >
            <Menu
              mode="inline"
              style={{ height: '100%', borderRight: 0 }}
            >
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
                    <Menu.Item key={index + 'item'}>
                      <span onClick={() => this.handleMarkerClick(item, index)}>{item.description}</span>
                    </Menu.Item>)
                })}
              </SubMenu>
            </Menu>
          </Sider>
          <Layout>
            <Content
              style={{
                background: '#fff',
                margin: 0,
                minHeight: 480,
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
      </Layout >
    )
  }
}

function mapStateToProps(state) {
  return {
    locations: state.locations,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getLocations: newState => dispatch(getLocations(newState)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);