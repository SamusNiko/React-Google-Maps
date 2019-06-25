import React from 'react';
import PropTypes from 'prop-types';
import noop from 'react-props-noop';
import { Button } from 'antd';
import StyledImportExport from './styles';

const ImportExportButtons = props => {
  const { onExportClick, onImportClick } = props;
  return (
    <StyledImportExport>
      <Button
        type="primary"
        size="small"
        icon="export"
        onClick={onExportClick}
        style={{ margin: '5px' }}
      >
        Export
      </Button>
      <Button
        size="small"
        type="primary"
        icon="import"
        onClick={onImportClick}
        style={{ margin: '5px' }}
      >
        Import
      </Button>
    </StyledImportExport>
  );
};

ImportExportButtons.propTypes = {
  onImportClick: PropTypes.func,
  onExportClick: PropTypes.func
};
ImportExportButtons.defaultProps = {
  onImportClick: noop,
  onExportClick: noop
};

export default ImportExportButtons;
