import React from 'react';
import { Layout, message, Modal } from 'antd';
import supercluster from 'points-cluster';
import PropTypes from 'prop-types';
import Map from '@/components/Map';
import ModalWindow from '@/components/ModalWindow';
import ModalImporter from '@/components/ModalImporter';
import PrimaryButton from '@/components/Buttons/PrimaryButton';
import MarkersList from '@/components/MarkersList';
import { dataBaseURL } from '@/constants';
import axios from 'axios';

import './styles.css';

const { Content, Sider } = Layout;
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
      currentItemId: null,
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
    const { userData } = this.props;
    const loca = [];
    axios
      .get(`${dataBaseURL}/locations/${userData.localId}.json`)
      .then(response => {
        if (response.data) {
          Object.keys(response.data).forEach(key => loca.push({ ...response.data[key], id: key }));
          this.setState({ locations: loca });
        }
      })
      .then(() => {
        this.createClusters();
      })
      .catch(error => {
        message.error(error);
      });
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
      currentItemId: currentMarker.id,
      inputValue: currentMarker.description
    });
    this.showRedactor();
  };

  handleMenuItemClick = item => {
    this.setState({ currentItemId: item.id, inputValue: item.description });
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
    const { userData } = this.props;
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const newMarker = {
      key: `${lat}${lng}`,
      lat,
      lng,
      description: inputValue
    };
    if (newMarker.description !== '') {
      axios
        .post(`${dataBaseURL}/locations/${userData.localId}.json`, newMarker)
        .then(() => this.getLocations())
        .catch(error => {
          message.error(error);
        });
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

  handleOkImpoter = async (data, isClear) => {
    const { userData } = this.props;
    if (data) {
      if (data && isClear) {
        await axios
          .delete(`${dataBaseURL}/locations/${userData.localId}.json`)
          .then(
            data.map(item => axios.post(`${dataBaseURL}/locations/${userData.localId}.json`, item))
          )
          .then(() => {
            this.getLocations();
          });
      } else {
        this.addNewMarkers(data);
      }
    }
    this.setState({ isImporter: false });
  };

  addNewMarkers = newLocation => {
    const { userData } = this.props;
    const { locations } = this.state;
    for (let i = 0; i < newLocation.length; i += 1) {
      if (newLocation[i].key) {
        let isEquals = false;
        for (let j = 0; j < locations.length; j += 1) {
          if (newLocation[i].key === locations[j].key) {
            isEquals = true;
            break;
          }
        }
        if (isEquals === false) {
          axios
            .post(`${dataBaseURL}/locations/${userData.localId}.json`, newLocation[i])
            .then(() => this.getLocations())
            .catch(error => {
              message.error(error);
            });
        }
      }
    }
  };

  handleSaveRedactor = () => {
    const { currentItemId, inputValue, locations } = this.state;
    const { userData } = this.props;
    const currentMarker = locations.find(item => item.id === currentItemId);
    currentMarker.description = inputValue;
    const updatedMarker = {
      description: currentMarker.description,
      key: currentMarker.key,
      lat: currentMarker.lat,
      lng: currentMarker.lng
    };
    axios
      .patch(`${dataBaseURL}/locations/${userData.localId}/${currentItemId}.json`, updatedMarker)
      .then(() => this.getLocations())
      .catch(error => message.error(error));
    this.setState({
      isRedactor: false,
      inputValue: '',
      event: null
    });
  };

  handleDeleteRedactor = () => {
    const { currentItemId } = this.state;
    const { userData } = this.props;
    axios.delete(`${dataBaseURL}/locations/${userData.localId}/${currentItemId}.json`).then(() => {
      this.getLocations();
    });
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
      <Layout className="layoutSideMenu">
        <Sider className="sideMenu" style={{ background: '#fa7373' }}>
          <PrimaryButton type="primary" icon="export" onClick={this.handleExportClick}>
            Export
          </PrimaryButton>
          <PrimaryButton type="primary" icon="import" onClick={this.handleImportClick}>
            Import
          </PrimaryButton>
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
    );
  }
}

App.propTypes = {
  userData: PropTypes.shape({
    email: PropTypes.string,
    localId: PropTypes.string
  })
};
App.defaultProps = {
  userData: {}
};

export default App;
