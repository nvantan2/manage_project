import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Button, Popconfirm, Table, Tag, Form, Input, Select, notification } from 'antd';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import { connect } from 'umi';

import ModalEditUser from './components/ModalEditUser';

import styles from './index.less';

const LIMIT_USER = 20;

const { Option } = Select;

const TableUsers = ({ users, dispatch, loadingUpdateUser }) => {
  const [form] = Form.useForm();
  const [isVisibleModalEdit, setIsVisibleModalEdit] = useState(false);

  const columns = [
    { title: 'User name', dataIndex: 'userName' },
    { title: 'Email', dataIndex: 'email' },
    {
      title: 'Created at',
      dataIndex: 'createdAt',
      render: (_, record) => <p>{moment(record.createdAt).format('HH:mm MM-DD-YYYY')}</p>,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      render: (_, record) => {
        switch (record.role) {
          case 'admin':
            return <Tag color="gold">Admin</Tag>;
          default:
            return <Tag color="default">User</Tag>;
        }
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_, record) => (
        <div className={styles['table-user-button-group']}>
          <Button
            icon={<EditFilled />}
            disabled={record.role === 'admin'}
            type="primary"
            onClick={() => {
              setIsVisibleModalEdit(true);
              form.setFieldsValue(record);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title={`Are you sure delete ${record.userName} ?`}
            disabled={record.role === 'admin'}
            onConfirm={() => {
              dispatch({
                type: 'users/deleteUser',
                params: record,
                callback: (response) => {
                  if (response)
                    notification.success({
                      description: 'Delete user success',
                      message: 'Successfully',
                    });
                },
              });
            }}
          >
            <Button
              icon={<DeleteFilled />}
              type="primary"
              disabled={record.role === 'admin'}
              danger
            >
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const onChangePage = (page) => {
    dispatch({ type: 'users/fetchUser', params: { limit: LIMIT_USER, page } });
  };

  const onFinishFormEdit = (values) => {
    dispatch({
      type: 'users/updateUser',
      params: values,
      callback: (response) => {
        if (response) {
          notification.success({
            description: 'Update user success',
            message: 'Successfully',
          });
          setIsVisibleModalEdit(false);
        }
      },
    });
  };

  useEffect(() => {
    dispatch({ type: 'users/fetchUser', params: { limit: LIMIT_USER, page: 1 } });
  }, []);

  return (
    <>
      <ModalEditUser onCancel={() => setIsVisibleModalEdit(false)} visible={isVisibleModalEdit}>
        <Form
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 19 }}
          form={form}
          onFinish={onFinishFormEdit}
        >
          <Form.Item name="id" label="id" hidden>
            <Input disabled />
          </Form.Item>
          <Form.Item name="createdAt" label="Created at" hidden>
            <Input disabled />
          </Form.Item>
          <Form.Item name="password" label="Password" hidden>
            <Input disabled />
          </Form.Item>
          <Form.Item name="userName" label="User name">
            <Input disabled readOnly />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input disabled readOnly />
          </Form.Item>
          <Form.Item name="role" label="Role">
            <Select>
              <Option value="user">User</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>
          <div className={styles['modal-user-button-group']}>
            <Button onClick={() => setIsVisibleModalEdit(false)}>Cancel</Button>
            <Button htmlType="submit" type="primary" loading={loadingUpdateUser}>
              Ok
            </Button>
          </div>
        </Form>
      </ModalEditUser>
      <Table
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={users.data}
        pagination={{ total: 20, showSizeChanger: false, onChange: onChangePage, pageSize: 20 }}
        // total item
      />
    </>
  );
};

export default connect(({ users, loading }) => ({
  users,
  loadingUpdateUser: loading.effects['users/updateUser'],
}))(TableUsers);
