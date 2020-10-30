import { PushpinFilled } from '@ant-design/icons';
import { Modal, Row, Switch, Button, Col } from 'antd';
import React, { useContext, useState, useReducer } from 'react';

import BoardDetailContext from './boardDetailContext';
import { TYPE_ACTION_TASK } from './constants';

import styles from './taskDetail.less';

const SectionTitle = React.memo(({ title, dispatch }) => {
  return (
    <p onClick={() => dispatch({ type: TYPE_ACTION_TASK.SET_TITLE, payload: 'test title' })}>
      {title}
    </p>
  );
});

const taskReducer = (state, action) => {
  switch (action.type) {
    case TYPE_ACTION_TASK.SET_TITLE:
      return { ...state, title: action.payload };
    case TYPE_ACTION_TASK.SET_DEADLINE:
      return { ...state, deadline: action.payload };
    case TYPE_ACTION_TASK.SET_MEMBER:
      return { ...state, members: action.payload };
    case TYPE_ACTION_TASK.SET_TAGS:
      return { ...state, tags: action.payload };
    case TYPE_ACTION_TASK.SET_PR_LINK:
      return { ...state, prLink: action.payload };
    case TYPE_ACTION_TASK.SET_DESCRIPTION:
      return { ...state, description: action.payload };
    case TYPE_ACTION_TASK.SET_WEIGHT:
      return { ...state, weight: action.payload };
    case TYPE_ACTION_TASK.SET_STATUS:
      return { ...state, status: action.payload };
    default:
      return state;
  }
};

const SectionWrapper = ({ icon, title, isInline, children }) => {
  return (
    <section className={styles['section-wrapper']}>
      <Row align="top">
        <Col className={styles['section-wrapper-icon']}>{icon}</Col>
        <Col className={styles['section-wrapper-title']}>{title}</Col>
        {isInline && <Col className={styles['section-wrapper-children-inline']}>{children}</Col>}
      </Row>
      {!isInline && <Row className={styles['section-wrapper-children']}>{children}</Row>}
    </section>
  );
};

const TaskDetail = ({ visible, setVisible, taskId }) => {
  const { dataBoard } = useContext(BoardDetailContext);
  const [dataTask, dispatch] = useReducer(taskReducer, dataBoard.tasks[taskId]);
  const [readOnly, setReadOnly] = useState(false);

  return (
    <Modal
      visible={visible}
      onCancel={() => setVisible(false)}
      footer={null}
      closable={null}
      title={
        <Row align="middle" justify="space-between">
          <div>ddd</div>
          <Switch
            checkedChildren="Read Only"
            unCheckedChildren="Read Only"
            onChange={() => setReadOnly(!readOnly)}
            checked={readOnly}
          />
          <Button key="back" onClick={() => setVisible(false)}>
            Close
          </Button>
        </Row>
      }
    >
      <SectionWrapper icon={<PushpinFilled />} title="title" isInline>
        <SectionTitle title={dataTask.title} dispatch={dispatch} />
      </SectionWrapper>

      <Row>
        <p>
          <strong>Members : </strong>
        </p>
        <p>{dataTask.members}</p>
      </Row>
    </Modal>
  );
};

export default TaskDetail;
