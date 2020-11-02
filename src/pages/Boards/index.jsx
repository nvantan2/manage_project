import { DeleteFilled, EditFilled, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, Form, Popconfirm, Modal, Row, Input, Empty, notification } from 'antd';
import React, { useState, useEffect, useCallback } from 'react';
import _ from 'lodash';
import { history, connect } from 'umi';
import moment from 'moment';

import { getAuthority } from '@/utils/authority';

import styles from './index.less';

const { TextArea } = Input;

const Boards = ({ boards, loadingUpdateBoard, loadingCreateBoard, dispatch }) => {
  const [form] = Form.useForm();
  const ROLE = getAuthority()[0];
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [searchFor, setSearchFor] = useState('');
  const [keySearch, setKeySearch] = useState('');

  const delaySearch = useCallback(
    _.debounce((q) => setKeySearch(q), 500),
    [],
  );
  const handleChangeSearch = (e) => {
    setSearchFor(e.target.value);
    delaySearch(e.target.value);
  };

  useEffect(() => {
    dispatch({ type: 'boards/fetchBoard' });
  }, []);

  const onFinishFormModal = (values) => {
    if (modalType === 'add') {
      dispatch({
        type: 'boards/createBoard',
        params: { ...values, createdAt: moment().utc(), members: '[]' },
        callback: (response) => {
          if (response) {
            notification.success({ message: 'Successfully', description: 'Create board success' });
            form.resetFields();
            setIsVisibleModal(false);
          }
        },
      });
    } else {
      dispatch({
        type: 'boards/updateBoard',
        params: values,
        callback: (response) => {
          if (response) {
            notification.success({ message: 'Successfully', description: 'Update board success' });
            form.resetFields();
            setIsVisibleModal(false);
          }
        },
      });
    }
  };

  return (
    <div className={styles.board}>
      <Modal
        title={modalType === 'add' ? 'Create board :' : 'Edit board :'}
        visible={isVisibleModal}
        onCancel={() => {
          setIsVisibleModal(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 19 }}
          form={form}
          onFinish={onFinishFormModal}
        >
          {modalType === 'edit' && (
            <Form.Item name="id" label="id" hidden>
              <Input disabled />
            </Form.Item>
          )}
          <Form.Item
            name="title"
            rules={[
              { required: true, message: 'Title board is required' },
              { whitespace: true },
              { max: 80 },
            ]}
            label="Name"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            rules={[
              { required: true, message: 'Description board is required' },
              { whitespace: true },
              { max: 150 },
            ]}
            label="Description"
          >
            <TextArea autoSize />
          </Form.Item>
          <div style={{ textAlign: 'right' }}>
            <Button
              onClick={() => {
                setIsVisibleModal(false);
                form.resetFields();
              }}
              style={{ marginRight: 5 }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={modalType === 'add' ? loadingCreateBoard : loadingUpdateBoard}
            >
              Ok
            </Button>
          </div>
        </Form>
      </Modal>

      <Row gutter={{ xs: 8, sm: 12, md: 16, lg: 24 }} className={styles.header}>
        {ROLE === 'admin' && (
          <Col xs={24} sm={12} md={8} lg={6} xl={4} style={{ marginBottom: 10 }}>
            <Button
              style={{ backgroundColor: 'green', color: '#fff', width: '100%' }}
              type="primary"
              title="Create board"
              onClick={() => {
                setIsVisibleModal(true);
                setModalType('add');
              }}
              icon={<PlusOutlined />}
            >
              Create board
            </Button>
          </Col>
        )}
        <Col xs={24} sm={12} md={8} lg={6} xl={4} style={{ marginBottom: 10 }}>
          <Input
            placeholder="search"
            value={searchFor}
            onChange={handleChangeSearch}
            prefix={<SearchOutlined />}
          />
        </Col>
      </Row>

      <Row gutter={{ xs: 8, sm: 12, md: 16, lg: 24 }}>
        {boards.length ? (
          boards
            .filter(
              (board) => board.title.includes(keySearch) || board.description.includes(keySearch),
            )
            .map((item) => (
              <Col key={item.id} xs={24} sm={12} md={8} lg={6} xl={4} style={{ marginBottom: 10 }}>
                <div
                  className={styles.card}
                  onClick={() => {
                    history.push(`/boards/${item.id}`);
                  }}
                >
                  <div className={styles['header-card']}>
                    <h3 className={styles.title}>{item.title}</h3>
                    {ROLE === 'admin' && (
                      <div>
                        <Button
                          title="Edit"
                          icon={<EditFilled style={{ color: '#1890ff' }} />}
                          ghost
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsVisibleModal(true);
                            setModalType('edit');
                            form.setFieldsValue(item);
                          }}
                        />
                        <Popconfirm
                          title="Are you sure delete ?"
                          onCancel={(e) => e.stopPropagation()}
                          onConfirm={(e) => {
                            e.stopPropagation();
                            dispatch({
                              type: 'boards/deleteBoard',
                              params: item,
                              callback: (response) => {
                                if (response) {
                                  notification.success({
                                    message: 'Successfully',
                                    description: 'Delete board success',
                                  });
                                }
                              },
                            });
                          }}
                        >
                          <Button
                            title="Delete"
                            icon={<DeleteFilled style={{ color: '#ff4d4f' }} />}
                            ghost
                            onClick={(e) => e.stopPropagation()}
                          />
                        </Popconfirm>
                      </div>
                    )}
                  </div>
                  <p className={styles.desc}>{item.description}</p>
                </div>
              </Col>
            ))
        ) : (
          <Empty
            style={{ margin: 'auto' }}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No board"
          />
        )}
      </Row>
    </div>
  );
};

export default connect(({ boards, loading }) => ({
  boards,
  loadingCreateBoard: loading.effects['boards/createBoard'],
  loadingUpdateBoard: loading.effects['boards/updateBoard'],
}))(Boards);
