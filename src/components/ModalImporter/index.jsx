import React, { Component } from 'react';
import PropTypes from 'prop-types';
import noop from 'react-props-noop';
import CSVReader from 'react-csv-reader';
import { Modal, Checkbox } from 'antd';

class ModalImporter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: false,
      importedData: null
    };
  }

  handleForce = data => {
    this.setState({ importedData: data });
  };

  handleChangeCheckbox = e => {
    this.setState({ isChecked: e.target.checked });
  };

  handleOkClick = () => {
    const { importedData, isChecked } = this.state;
    const { handleOk } = this.props;
    handleOk(importedData, isChecked);
  };

  render() {
    const { isImporter, handleCancel } = this.props;
    return (
      <div>
        <Modal
          title="Import locations"
          visible={isImporter}
          onOk={this.handleOkClick}
          onCancel={handleCancel}
        >
          <CSVReader
            onFileLoaded={this.handleForce}
            parserOptions={{ header: true, dynamicTyping: true }}
          />
          <Checkbox onChange={this.handleChangeCheckbox}>Empty all</Checkbox>
        </Modal>
      </div>
    );
  }
}
ModalImporter.propTypes = {
  isImporter: PropTypes.bool,
  handleOk: PropTypes.func,
  handleCancel: PropTypes.func
};

ModalImporter.defaultProps = {
  isImporter: false,
  handleOk: noop,
  handleCancel: noop
};

export default ModalImporter;
