import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Select, Input, notification } from 'antd';
import { connect } from 'umi';
import React, { useState } from 'react';
import TableUsers from './TableUsers';
import ModalAddUser from './components/ModalAddUser';

import styles from './index.less';

const { Option } = Select;

const Users = ({ dispatch, loadingCreateUser }) => {
  const [form] = Form.useForm();
  const [isVisibleModalAdd, setIsVisibleModalAdd] = useState(false);

  const onFinishFormAdd = (values) => {
    dispatch({
      type: 'users/createUser',
      params: { ...values, createdAt: Date.now() },
      callback: (response) => {
        if (response) {
          notification.success({
            description: 'Create user success',
            message: 'Successfully',
          });
          setIsVisibleModalAdd(false);
          form.resetFields();
        }
      },
    });
  };

  return (
    <div>
      <ModalAddUser visible={isVisibleModalAdd} onCancel={() => setIsVisibleModalAdd(false)}>
        <Form
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 19 }}
          onFinish={onFinishFormAdd}
          form={form}
        >
          <Form.Item
            name="userName"
            label="User name"
            rules={[
              {
                required: true,
                message: 'Please input your user name !',
              },
              {
                pattern: /^[a-zA-Z0-9]*$/,
                message: 'User name should not contain any special characters, spaces',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                message: 'Please input email !',
              },
              {
                type: 'email',
                message: 'Invalid email',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: 'Please input password !',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[
              {
                required: true,
                message: 'Please select role !',
              },
            ]}
          >
            <Select>
              <Option value="user">User</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>
          <div className={styles['modal-user-button-group']}>
            <Button onClick={() => setIsVisibleModalAdd(false)}>Cancel</Button>
            <Button htmlType="submit" type="primary" loading={loadingCreateUser}>
              Ok
            </Button>
          </div>
        </Form>
      </ModalAddUser>
      <div>
        <Button
          icon={<PlusOutlined />}
          style={{ backgroundColor: 'green', color: '#fff', marginBottom: 15 }}
          onClick={() => setIsVisibleModalAdd(true)}
        >
          Add user
        </Button>
      </div>
      <TableUsers />
    </div>
  );
};

export default connect(({ loading }) => ({
  loadingCreateUser: loading.effects['users/createUser'],
}))(Users);
