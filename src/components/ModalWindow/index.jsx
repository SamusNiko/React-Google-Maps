import React, { Component } from 'react';
import PropTypes from 'prop-types';
import noop from 'react-props-noop';
import { Modal, Input, Button } from 'antd';

const { confirm } = Modal;

class ModalWindow extends Component {
  showDeleteConfirm = () => {
    const { handleDeleteRedactor } = this.props;
    confirm({
      title: 'Are you sure delete this marker?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleDeleteRedactor();
      }
    });
  };

  renderCreator() {
    const { isCreator, handleOkCreator, handleCancel, handleInputChange, inputValue } = this.props;
    return (
      <div>
        <Modal
          title="Creat new marker"
          visible={isCreator}
          onOk={handleOkCreator}
          onCancel={handleCancel}
        >
          <Input
            size="small"
            onChange={handleInputChange}
            value={inputValue}
            placeholder="Description"
          />
        </Modal>
      </div>
    );
  }

  renderRedactor() {
    const {
      isRedactor,
      handleSaveRedactor,
      handleCancel,
      handleInputChange,
      inputValue
    } = this.props;
    return (
      <div>
        <Modal
          title="Redact your marker"
          visible={isRedactor}
          onOk={handleSaveRedactor}
          onCancel={handleCancel}
          footer={[
            <Button key="save" type="primary" onClick={handleSaveRedactor}>
              Save
            </Button>,
            <Button key="delete" type="danger" onClick={this.showDeleteConfirm}>
              Delete
            </Button>,
            <Button key="cancel" onClick={handleCancel}>
              Cancel
            </Button>
          ]}
        >
          <Input
            size="small"
            onChange={handleInputChange}
            value={inputValue}
            placeholder="Description"
          />
        </Modal>
      </div>
    );
  }

  render() {
    const { isCreator, isRedactor } = this.props;
    if (isCreator) {
      return this.renderCreator();
    }
    if (isRedactor) {
      return this.renderRedactor();
    }
    return null;
  }
}
ModalWindow.propTypes = {
  isCreator: PropTypes.bool,
  isRedactor: PropTypes.bool,
  handleSaveRedactor: PropTypes.func,
  handleCancel: PropTypes.func,
  handleInputChange: PropTypes.func,
  handleOkCreator: PropTypes.func,
  handleDeleteRedactor: PropTypes.func,
  inputValue: PropTypes.string
};

ModalWindow.defaultProps = {
  isCreator: false,
  isRedactor: false,
  handleSaveRedactor: noop,
  handleCancel: noop,
  handleInputChange: noop,
  handleOkCreator: noop,
  handleDeleteRedactor: noop,
  inputValue: ''
};

export default ModalWindow;
