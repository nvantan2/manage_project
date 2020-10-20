import { Modal } from 'antd';
import React from 'react';

const ModalEditUser = (props) => {
  const { onCancel, visible, children } = props;
  return (
    <Modal title="Edit" onCancel={onCancel} visible={visible}>
      {children}
    </Modal>
  );
};

export default ModalEditUser;
