import React from 'react';
import PropTypes from 'prop-types';
import noop from 'react-props-noop';
import { StyledImportExport, StyledButton } from './styles';

const ImportExportButtons = props => {
  const { onExportClick, onImportClick } = props;
  return (
    <StyledImportExport>
      <StyledButton type="primary" icon="export" onClick={onExportClick} style={{ margin: '5px' }}>
        Export
      </StyledButton>
      <StyledButton type="primary" icon="import" onClick={onImportClick} style={{ margin: '5px' }}>
        Import
      </StyledButton>
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
