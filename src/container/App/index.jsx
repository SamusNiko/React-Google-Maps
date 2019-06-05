import React from 'react';
import { Layout, Menu, Icon } from 'antd';
import { connect } from 'react-redux';

import Map from '@/components/Map';
import ModalWindow from '@/components/ModalWindow';
import { mapURL } from '@/constants/services'
import {
  getLocations,
} from '@/actions/actionsMap'

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
var db;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      event: null,
      currentItemIndex: null,
      modalInputValue: '',
      visibleCreator: false,
      visibleRedactor: false,
    }
  }

  componentDidMount() {
    this.connectDB(this.getMarkers);
  }

  connectDB(f) {
    var openRequest = indexedDB.open("locations", 2);
    openRequest.onupgradeneeded = function (e) {
      var thisDB = e.target.result;
      if (!thisDB.objectStoreNames.contains("markers")) {
        thisDB.createObjectStore("markers", { keyPath: "key" });
      }
    }
    openRequest.onsuccess = function (e) {
      console.log("Success!");
      db = e.target.result;
      f();
    }
    openRequest.onerror = function (e) {
      console.log("Error");
      console.dir(e);
    }
  };

  addMarker(newMarker) {
    var transaction = db.transaction(["markers"], "readwrite");
    var store = transaction.objectStore("markers");
    var request = store.add(newMarker);
    request.onerror = function (e) {
      console.log("Error", e.target.error.name);
    }
    request.onsuccess = this.getMarkers();
  }

  updateMarker(marker) {
    var transaction = db.transaction(["markers"], "readwrite");
    var store = transaction.objectStore("markers");
    var request = store.put(marker);
    request.onerror = function (e) {
      console.log("Error", e.target.error.name);
    }
    request.onsuccess = this.getMarkers();
  }

  deleteMarker(marker) {
    var transaction = db.transaction(["markers"], "readwrite");
    var store = transaction.objectStore("markers");
    var request = store.delete(marker);
    request.onerror = function (e) {
      console.log("Error", e.target.error.name);
    };
    request.onsuccess = this.getMarkers();
  }
  
  getMarkers = (e) => {
    var transaction = db.transaction(["markers"], "readonly");
    var store = transaction.objectStore("markers");
    var request = store.getAll();
    request.onsuccess = (e) => {
      var newState = e.target.result;
      this.props.getLocations(newState);
    }
  };

  showCreator() {
    this.setState({
      visibleCreator: true,
    });
  };

  showRedactor() {
    this.setState({
      visibleRedactor: true,

    });
  };

  handleOkCreator = () => {
    const event = { ...this.state.event };
    const modalInputValue = this.state.modalInputValue;
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const newMarker = {
      key: '' + lat + lng,
      lat: lat,
      lng: lng,
      description: modalInputValue,
    }
    if (newMarker.description !== '') {
      this.addMarker(newMarker);
      this.setState({ modalInputValue: '', event: null, visibleCreator: false });
    } else {
      alert('please, enter description');
    }
  };

  handleCancel = () => {
    this.setState({
      visibleCreator: false, visibleRedactor: false, modalInputValue: '', event: null
    });
  };



  handleOkRedactor = () => {
    const index = this.state.currentItemIndex;
    const currentMarker = { ...this.props.locations[index] };
    currentMarker.description = this.state.modalInputValue;
    this.updateMarker(currentMarker);
    this.setState({
      visibleRedactor: false, modalInputValue: '', event: null
    });
  };

  handleDeleteRedactor = () => {
    const index = this.state.currentItemIndex;
    const marker = { ...this.props.locations[index] };
    this.deleteMarker(marker.key);
    this.setState({ modalInputValue: '', visibleRedactor: false });
  };

  modalInputChange = (event) => {
    this.setState({ modalInputValue: event.target.value });
  };


  handleMarkerClick = (item, index) => {
    this.setState({ currentItemIndex: index, modalInputValue: item.description });
    this.showRedactor();
  };

  handleMapClick = (event) => {
    this.setState({ event });
    this.showCreator();
  };

  render() {
    const {
      visibleCreator,
      visibleRedactor,
      modalInputValue,
    } = this.state;
    const { locations } = this.props;
    return (
      <Layout>
        <Header className="header">
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['2']}
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item key="1">Map</Menu.Item>
          </Menu>
        </Header>
        <Layout>
          <Sider width={200} style={{ background: '#fff' }}>
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
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
          <Layout style={{ padding: '5px' }}>
            <Content
              style={{
                background: '#fff',
                margin: 0,
                minHeight: 480,
              }}
            >
              <Map
                googleMapURL={mapURL}
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `640px` }} />}
                mapElement={<div style={{ height: `100%` }} />}
                locations={locations}
                handleMapClick={this.handleMapClick}
                handleMarkerClick={this.handleMarkerClick}
                isMarkerShown
              />

              <ModalWindow
                handleOkCreator={this.handleOkCreator}
                visibleCreator={visibleCreator}
                handleDeleteRedactor={this.handleDeleteRedactor}
                handleCancel={this.handleCancel}
                handleOkRedactor={this.handleOkRedactor}
                visibleRedactor={visibleRedactor}
                modalInputValue={modalInputValue}
                modalInputChange={this.modalInputChange}
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