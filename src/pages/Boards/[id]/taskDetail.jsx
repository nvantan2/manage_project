import { ContactsFilled, PushpinFilled } from '@ant-design/icons';
import { Modal, Row, Switch, Button, Col, Input } from 'antd';
import React, { useContext, useState, useReducer } from 'react';

import { getAuthority } from '@/utils/authority';
import BoardDetailContext from './boardDetailContext';
import { TYPE_ACTION_TASK } from './constants';

import styles from './taskDetail.less';

const { TextArea } = Input;

const SectionTitle = React.memo(({ title, dispatch, isEdit }) => {
  const [titleTask, setTitleTask] = useState(title);
  const handleBlur = () => {
    if (!titleTask.trim()) {
      setTitleTask(title);
      return;
    }
    dispatch({ type: TYPE_ACTION_TASK.SET_TITLE, payload: titleTask });
  };

  return (
    <div>
      {isEdit ? (
        <TextArea
          autoSize
          value={titleTask}
          onChange={(e) => setTitleTask(e.target.value)}
          onBlur={handleBlur}
        />
      ) : (
        <p
          style={{
            margin: 0,
            padding: '4px 11px',
            color: 'rgba(0, 0, 0, 0.85)',
            fontSize: 14,
            lineHeight: '1.5715',
            backgroundColor: 'rgb(255, 255, 255)',
            border: '1px solid transparent',
          }}
        >
          {title}
        </p>
      )}
    </div>
  );
});

const SectionMember = React.memo(({ members }) => {
  return (
    <div>
      {members.map((member) => (
        <p key={member.id}>{member.userName}</p>
      ))}
    </div>
  );
});

const TaskReducer = (state, action) => {
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
      <Row align="middle">
        <Col className={styles['section-wrapper-icon']}>{icon}</Col>
        <Col>
          <p className={styles['section-wrapper-title']}>{title} :</p>
        </Col>
        {isInline && <Col className={styles['section-wrapper-children-inline']}>{children}</Col>}
      </Row>
      {!isInline && <Row className={styles['section-wrapper-children']}>{children}</Row>}
    </section>
  );
};

const TaskDetail = ({ visible, setVisible, taskId }) => {
  const ROLE = getAuthority()[0];
  const { dataBoard } = useContext(BoardDetailContext);
  const [dataTask, dispatch] = useReducer(TaskReducer, dataBoard.tasks[taskId]);
  const [readOnly, setReadOnly] = useState(true);

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
      <SectionWrapper icon={<PushpinFilled />} title="Title" isInline>
        <SectionTitle
          title={dataTask.title}
          dispatch={dispatch}
          isEdit={!readOnly && ROLE === 'admin'}
        />
      </SectionWrapper>

      <SectionWrapper icon={<ContactsFilled />} title="Members" isInline>
        <SectionMember members={[]} />
      </SectionWrapper>
    </Modal>
  );
};

export default TaskDetail;
