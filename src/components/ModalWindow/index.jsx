import React, { Component } from 'react';
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
  }

  renderCreator() {
    const {
      isCreator,
      handleOkCreator,
      handleCancel,
      handleInputChange,
      inputValue,
    } = this.props;
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
      inputValue,
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
            </Button>,
          ]}
        >
          <Input
            size="small"
            onChange={handleInputChange}
            value={inputValue}
            placeholder="Description" />
        </Modal>
      </div>
    );
  }

  render() {
    const {
      isCreator,
      isRedactor
    } = this.props;
    if (isCreator) {
      return this.renderCreator();
    } if (isRedactor) {
      return this.renderRedactor();
    } return null;
  }
}

export default ModalWindow;
