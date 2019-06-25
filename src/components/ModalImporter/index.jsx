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

  render() {
    const { isImporter, handleOk, handleCancel } = this.props;
    const { isChecked, importedData } = this.state;
    return (
      <div>
        <Modal
          title="Import locations"
          visible={isImporter}
          onOk={() => handleOk(importedData, isChecked)}
          onCancel={handleCancel}
        >
          <CSVReader
            onFileLoaded={this.handleForce}
            parserOptions={{ header: true, dynamicTyping: true }}
          />
          <Checkbox onChange={this.handleChangeCheckbox}>
            Empty all : {isChecked.toString()}
          </Checkbox>
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
