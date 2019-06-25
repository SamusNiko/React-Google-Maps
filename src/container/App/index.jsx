import React from 'react';
import { Layout, message, Menu, Modal } from 'antd';
import supercluster from 'points-cluster';
import { Service } from '@/helper/indexedDB';
import Map from '@/components/Map';
import ModalWindow from '@/components/ModalWindow';
import ModalImporter from '@/components/ModalImporter';
import ImportExportButtons from '@/components/ImportExportButtons';
import MarkersList from '@/components/MarkersList';

import './styles.css';

const { Header, Content, Sider } = Layout;
const { confirm } = Modal;

const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;

const CLUSTERIZATION_OPTIONS = {
  minZoom: 0,
  maxZoom: 16,
  radius: 60
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      event: null,
      currentItemKey: null,
      locations: [],
      clusters: [],
      inputValue: '',
      isCreator: false,
      isRedactor: false,
      isImporter: false,
      currentMapOptions: {
        center: {},
        zoom: null,
        bounds: null
      }
    };
  }

  componentDidMount() {
    this.getLocations();
  }

  getLocations = () => {
    Service.getAll()
      .then(data => this.setState({ locations: data }))
      .then(() => this.createClusters());
  };

  getClusters = () => {
    const { currentMapOptions, locations } = this.state;
    const clusters = supercluster(locations, CLUSTERIZATION_OPTIONS);
    return clusters(currentMapOptions);
  };

  createClusters = () => {
    const { currentMapOptions } = this.state;
    if (currentMapOptions.bounds) {
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
      this.setState({ clusters: data });
    }
  };

  handleMapChange = ({ center, zoom, bounds }) => {
    this.setState({
      currentMapOptions: {
        center,
        zoom,
        bounds
      }
    });
    this.createClusters();
  };

  handleMarkerClick = item => {
    const currentMarker = item.points[0];
    this.setState({
      currentItemKey: currentMarker.key,
      inputValue: currentMarker.description
    });
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
      Service.add(newMarker).then(() => this.getLocations());
      this.setState({ inputValue: '', event: null, isCreator: false });
    } else {
      message.warning('Please, enter description');
    }
  };

  handleCancel = () => {
    this.setState({
      isCreator: false,
      isRedactor: false,
      isImporter: false,
      inputValue: '',
      event: null
    });
  };

  showExportConfirm = () => {
    const f = this.handleExportClick;
    confirm({
      title: 'Do you want to download locations on CSV file?',
      onOk() {
        f();
      }
    });
  };

  handleExportClick = () => {
    const { locations } = this.state;
    const csvWriter = createCsvStringifier({
      header: [
        { id: 'description', title: 'description' },
        { id: 'key', title: 'key' },
        { id: 'lat', title: 'lat' },
        { id: 'lng', title: 'lng' }
      ]
    });
    let csvData = csvWriter.getHeaderString();
    csvData += csvWriter.stringifyRecords(locations);
    const hiddenElement = document.createElement('a');
    hiddenElement.href = `data:text/csv;charset=utf-8,${encodeURI(csvData)}`;
    hiddenElement.target = '_blank';
    hiddenElement.download = 'fileExample.csv';
    hiddenElement.click();
  };

  handleImportClick = () => {
    this.setState({
      isImporter: true
    });
  };

  handleOkImpoter = (data, isClear) => {
    if (data) {
      if (data && isClear) {
        Service.clear()
          .then(() => {
            data.map(item => Service.add(item));
          })
          .then(() => this.getLocations());
      } else {
        Service.getAllKeys().then(keys => {
          this.addNewMarkers(data, keys);
        });
      }
    }
    this.setState({ isImporter: false });
  };

  addNewMarkers = (newLocation, keys) => {
    for (let i = 0; i < newLocation.length; i += 1) {
      if (newLocation[i].key) {
        let isEquals = false;
        for (let j = 0; j < keys.length; j += 1) {
          if (newLocation[i].key === keys[j]) {
            isEquals = true;
            break;
          }
        }
        if (isEquals === false) {
          Service.add(newLocation[i]).then(() => this.getLocations());
        }
      }
    }
  };

  handleSaveRedactor = () => {
    const { currentItemKey, inputValue, locations } = this.state;
    const currentMarker = locations.find(item => item.key === currentItemKey);
    currentMarker.description = inputValue;
    Service.update(currentMarker).then(() => this.getLocations());
    this.setState({
      isRedactor: false,
      inputValue: '',
      event: null
    });
  };

  handleDeleteRedactor = () => {
    const { currentItemKey } = this.state;
    Service.delete(currentItemKey).then(() => this.getLocations());
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
    const { isCreator, isRedactor, isImporter, inputValue, locations, clusters } = this.state;
    return (
      <Layout>
        <Header className="header">
          <div className="logo" />
          <Menu theme="dark" mode="horizontal">
            <Menu.Item key="1">Map</Menu.Item>
          </Menu>
        </Header>
        <Layout className="layoutSideMenu">
          <Sider className="sideMenu" style={{ background: '#fa7373' }}>
            <ImportExportButtons
              onExportClick={this.showExportConfirm}
              onImportClick={this.handleImportClick}
            />
            <MarkersList locations={locations} onClick={this.handleMenuItemClick} />
          </Sider>
          <Layout>
            <Content>
              <Map
                clustersOfMarkers={clusters}
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
              <ModalImporter
                isImporter={isImporter}
                handleOk={this.handleOkImpoter}
                handleCancel={this.handleCancel}
              />
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

export default App;
