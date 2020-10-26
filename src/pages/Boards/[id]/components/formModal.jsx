import React from 'react';
import { Form, Input } from 'antd';
import { TYPE_MODAL } from '../constant';

const FormModal = ({ typeModal }) => {
  switch (typeModal) {
    case TYPE_MODAL.addColumn:
      return (
        <>
          <Form.Item label="Title" name="title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </>
      );

    default:
      return (
        <>
          <Form.Item label="Title" name="title">
            <Input />
          </Form.Item>
        </>
      );
  }
};

export default FormModal;
