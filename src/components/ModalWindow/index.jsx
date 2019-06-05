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
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  renderModalCreator() {
    const {
      visibleCreator,
      handleOkCreator,
      handleCancel,
      modalInputChange,
      modalInputValue,
    } = this.props;
    return (
      <div>
        <Modal
          title="Creat new marker"
          visible={visibleCreator}
          onOk={handleOkCreator}
          onCancel={handleCancel}
        >
          <Input
            size="small"
            onChange={modalInputChange}
            value={modalInputValue}
            placeholder="Description"
          />
        </Modal>
      </div>
    );
  }

  renderModalRedactor() {
    const {
      visibleRedactor,
      handleOkRedactor,
      handleCancel,
      modalInputChange,
      modalInputValue,
    } = this.props;
    return (
      <div>
        <Modal
          title="Redact your marker"
          visible={visibleRedactor}
          onOk={handleOkRedactor}
          onCancel={handleCancel}
          footer={[
            <Button key="save" type="primary" onClick={handleOkRedactor}>
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
            onChange={modalInputChange}
            value={modalInputValue}
            placeholder="Description" />
        </Modal>
      </div>
    );
  }

  render() {
    const {
      visibleCreator,
      visibleRedactor
    } = this.props;
    if (visibleCreator) {
      return this.renderModalCreator();
    } if (visibleRedactor) {
      return this.renderModalRedactor();
    } return null;
  }
}

export default ModalWindow;
