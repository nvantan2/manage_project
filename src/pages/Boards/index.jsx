import { DeleteFilled, EditFilled, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Popconfirm, Modal, Row, Input, Empty, notification } from 'antd';
import React, { useState, useEffect } from 'react';
import { history, connect } from 'umi';

import { getAuthority } from '@/utils/authority';

import './index.less';

const { TextArea } = Input;

const Boards = ({ boards, loadingUpdateBoard, loadingCreateBoard, dispatch }) => {
  const [form] = Form.useForm();
  const ROLE = getAuthority()[0];
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [modalType, setModalType] = useState('add');

  useEffect(() => {
    dispatch({ type: 'boards/fetchBoard' });
  }, []);

  const onFinishFormModal = (values) => {
    if (modalType === 'add') {
      dispatch({
        type: 'boards/createBoard',
        params: values,
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
    <div className="board">
      <Modal
        title={modalType === 'add' ? 'Create board :' : 'Edit board :'}
        visible={isVisibleModal}
        onCancel={() => setIsVisibleModal(false)}
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
            rules={[{ required: true, message: 'Title board is required' }]}
            label="Name"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            rules={[{ required: true, message: 'Description board is required' }]}
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

      {ROLE === 'admin' && (
        <Row>
          <Button
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
        </Row>
      )}

      <Row gutter={{ xs: 8, sm: 12, md: 16, lg: 24 }}>
        {boards.length ? (
          boards.map((item) => (
            <Col key={item.id} xs={24} sm={12} md={8} lg={6} xl={4} style={{ marginBottom: 10 }}>
              <div
                className="board-card"
                onClick={() => {
                  history.push(`/boards/${item.id}`);
                }}
              >
                <div className="board-card__header">
                  <h3 className="board-card__title">{item.title}</h3>
                  {ROLE === 'admin' && (
                    <div className="board-card__action">
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
                <p className="board-card__desc">{item.description}</p>
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
