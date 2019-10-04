import styled from 'styled-components';
import { Input } from 'antd';

export const StyledAuth = styled.div`
  height: 90vh;
  padding: 15%;
  text-align: center;
`;

export const StyledInput = styled(Input)`
  margin: 10px 0 !important;
  max-width: 400px;
`;

export const StyledInputPassword = styled(Input.Password)`
  margin: 10px 0 !important;
  max-width: 400px;
`;
