import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import TableUsers from './TableUsers';

const Users = () => {
  return (
    <div>
      <div>
        <Button icon={<PlusOutlined />} style={{ backgroundColor: 'green', color: '#fff' }}>
          Add user
        </Button>
      </div>
      <TableUsers />
    </div>
  );
};

export default Users;
