import { Modal } from 'antd';
import React from 'react';

const ModalAddUser = (props) => {
  const { onCancel, visible, children } = props;
  return (
    <Modal title="Add user :" onCancel={onCancel} visible={visible} footer={null}>
      {children}
    </Modal>
  );
};

export default ModalAddUser;
