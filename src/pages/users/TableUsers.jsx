// import ProTable from '@ant-design/pro-table';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Button, Popconfirm, Table, Tag } from 'antd';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import { connect } from 'umi';

import ModalEditUser from './components/ModalEditUser';

const LIMIT_USER = 2;

const TableUsers = ({ users, dispatch }) => {
  const [isVisibleModalEdit, setIsVisibleModalEdit] = useState(false);
  const [dataEditUser, setDataEditUser] = useState({});

  const columns = [
    { title: 'User name', dataIndex: 'userName' },
    { title: 'Email', dataIndex: 'email' },
    {
      title: 'Created at',
      dataIndex: 'createdAt',
      render: (_, record) => <p>{moment(record.createdAt).format('hh:mm DDD-MM-YYYY')}</p>,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      render: (_, record) => {
        switch (record.role) {
          case 'admin':
            return <Tag color="blue">Admin</Tag>;
          default:
            return <Tag color="cyan">User</Tag>;
        }
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_, record) => (
        <div>
          <Button
            icon={<EditFilled />}
            type="primary"
            onClick={() => {
              setIsVisibleModalEdit(true);
              setDataEditUser(record);
            }}
          >
            Edit
          </Button>
          <Popconfirm title={`Are you sure delete ${record.userName} ?`}>
            <Button icon={<DeleteFilled />} type="primary" danger>
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const onChangePage = (page) => {
    dispatch({ type: 'users/fetchUser', params: { role: 'user', limit: LIMIT_USER, page } });
  };

  useEffect(() => {
    dispatch({ type: 'users/fetchUser', params: { role: 'user', limit: LIMIT_USER, page: 1 } });
  }, []);

  return (
    <>
      <ModalEditUser onCancel={() => setIsVisibleModalEdit(false)} visible={isVisibleModalEdit}>
        <div>{dataEditUser.userName}</div>
      </ModalEditUser>
      <Table
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={users}
        pagination={{ total: 4, showSizeChanger: false, onChange: onChangePage, pageSize: 2 }}
      />
    </>
  );
};

export default connect(({ users }) => ({
  users,
}))(TableUsers);
