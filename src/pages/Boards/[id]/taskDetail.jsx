import { AimOutlined, ContactsFilled, PushpinFilled } from '@ant-design/icons';
import {
  Avatar,
  Modal,
  Row,
  Switch,
  Button,
  Col,
  Input,
  Select,
  Spin,
  Tag,
  DatePicker,
} from 'antd';
import React, { useContext, useState, useReducer } from 'react';
import _ from 'lodash';
import moment from 'moment';
import MdEditor from 'react-markdown-editor-lite';
import ReactMarkdown from 'react-markdown';
import request from 'umi-request';

import { getAuthority } from '@/utils/authority';
import BoardDetailContext from './boardDetailContext';
import { COMMON_LIST_TAG, TYPE_ACTION_TASK } from './constants';

import styles from './taskDetail.less';
import 'react-markdown-editor-lite/lib/index.css';

const { TextArea } = Input;
const { Option } = Select;

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
          style={{ width: '100%', fontWeight: 'bold' }}
          autoSize
          value={titleTask}
          onChange={(e) => setTitleTask(e.target.value)}
          onBlur={handleBlur}
        />
      ) : (
        <p
          style={{
            margin: 0,
            padding: '4px 0',
            color: 'rgba(0, 0, 0, 0.85)',
            fontSize: 14,
            lineHeight: '1.5715',
            fontWeight: 'bold',
            backgroundColor: 'rgb(255, 255, 255)',
            border: '1px solid transparent',
          }}
        >
          {titleTask}
        </p>
      )}
    </div>
  );
});

const SectionMember = React.memo(({ members, dispatch, isEdit }) => {
  const [data, setData] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [values, setValues] = useState(members);
  const fetchUser = (value) => {
    setData([]);
    setFetching(true);
    fetch(`https://5e05c2032f5dff0014f7dd4f.mockapi.io/users?userName=${value.trim()}`)
      .then((response) => response.json())
      .then((body) => {
        const users = body.map((user) => ({
          ...user,
          value: user.id,
        }));
        setData(users);
        setFetching(false);
      });
  };

  const tagRender = (props) => {
    const { label, closable, onClose } = props;
    return (
      <Tag color="lime" closable={closable} onClose={onClose} style={{ marginRight: 3 }}>
        {label}
      </Tag>
    );
  };

  if (isEdit) {
    return (
      <Select
        style={{ width: '100%' }}
        mode="multiple"
        labelInValue
        value={values}
        tagRender={tagRender}
        placeholder="Select users"
        notFoundContent={fetching ? <Spin size="small" /> : null}
        filterOption={false}
        onSearch={_.debounce(fetchUser, 500)}
        onChange={(value) => {
          setValues(value);
          dispatch({ type: TYPE_ACTION_TASK.SET_MEMBER, payload: value });
          setFetching(true);
          setData([]);
        }}
      >
        {data.map((d) => (
          <Option key={d.value}>{d.userName}</Option>
        ))}
      </Select>
    );
  }

  return (
    <div>
      <div>
        {members.length ? (
          members.map((member) => (
            <Avatar size={40} key={member.key}>
              {member.label}
            </Avatar>
          ))
        ) : (
          <Tag>Haven&apos;t Set.</Tag>
        )}
      </div>
    </div>
  );
});

const DeadlineTag = React.memo(({ deadline, isShowTimeRemain }) => {
  if (!deadline) {
    return <Tag>Haven&apos;t Set.</Tag>;
  }
  const duration = moment.duration({ from: new Date(), to: deadline }).asDays();
  if (duration <= 0) {
    return <Tag color="error">OVER DUE!!!!</Tag>;
  }
  if (duration <= 2) {
    return (
      <Tag color="warning">
        {isShowTimeRemain
          ? moment(deadline).fromNow()
          : moment(deadline).format('DD/MM/YYYY HH:mm:ss')}
      </Tag>
    );
  }
  return (
    <Tag color="processing">
      {isShowTimeRemain
        ? moment(deadline).fromNow()
        : moment(deadline).format('DD/MM/YYYY HH:mm:ss')}
    </Tag>
  );
});

const SectionDeadline = React.memo(({ deadline, dispatch, isEdit }) => {
  const disabledDate = (current) => {
    return current && current < moment();
  };

  return (
    <div>
      {!isEdit ? (
        <DeadlineTag deadline={deadline} />
      ) : (
        <DatePicker
          format="YYYY-MM-DD HH:mm:ss"
          disabledDate={disabledDate}
          defaultValue={moment().isBefore(deadline) ? deadline : moment()}
          showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
          onChange={(value) => dispatch({ type: TYPE_ACTION_TASK.SET_DEADLINE, payload: value })}
        />
      )}
    </div>
  );
});

const SectionPrLink = React.memo(({ prLink, dispatch, isEdit }) => {
  const [prLinkTask, setPrLinkTask] = useState(prLink);

  const handleBlur = () => {
    if (!prLinkTask.trim()) {
      setPrLinkTask('');
      return;
    }
    dispatch({ type: TYPE_ACTION_TASK.SET_PR_LINK, payload: prLinkTask.trim() });
  };

  if (isEdit) {
    return (
      <div>
        <Input
          onChange={(e) => {
            setPrLinkTask(e.target.value);
          }}
          value={prLinkTask}
          onBlur={handleBlur}
        />
      </div>
    );
  }
  return (
    <div>
      {!prLinkTask ? (
        <Tag>Haven&apos;t Set.</Tag>
      ) : (
        <a
          style={{ textDecoration: 'underline' }}
          href={prLinkTask}
          onClick={() => window.open(prLinkTask, '_blank')}
        >
          {prLinkTask}
        </a>
      )}
    </div>
  );
});

const AddTag = ({ onAdd }) => {
  const [tag, setTag] = useState({
    title: '',
    color: '#333',
  });

  return (
    <div>
      <div>
        <p style={{ margin: 0 }}>Quick select :</p>
        {COMMON_LIST_TAG.map((commonTag) => (
          <Tag key={commonTag.title} color={commonTag.color} onClick={() => setTag(commonTag)}>
            {commonTag.title}
          </Tag>
        ))}
      </div>

      <hr />

      <div style={{ marginTop: 10 }}>
        <p style={{ margin: 0 }}>
          Title<span style={{ color: 'red' }}>*</span> :
        </p>
        <Input
          type="text"
          required
          placeholder="title"
          value={tag.title}
          onChange={(e) => setTag({ ...tag, title: e.target.value })}
        />
      </div>
      <div style={{ marginTop: 10 }}>
        <p style={{ margin: 0 }}>
          Color<span style={{ color: 'red' }}>*</span> :
        </p>
        <input
          style={{ height: 33, width: 50, marginRight: 20 }}
          type="color"
          required
          value={tag.color}
          onChange={(e) => setTag({ ...tag, color: e.target.value })}
        />
      </div>
      <hr />
      <div style={{ textAlign: 'right', marginTop: 15 }}>
        <Button
          type="primary"
          onClick={() => {
            setTag({ title: '', color: '#333' });
            onAdd(tag);
          }}
          disabled={!tag.title.trim()}
        >
          Add tag
        </Button>
      </div>
    </div>
  );
};

const SectionTags = React.memo(({ tags, dispatch, isEdit }) => {
  const [isShowAddTagForm, setIsShowAddTagForm] = useState(false);
  const [tagsTask, setTagsTask] = useState(tags);

  const onDelete = (tag) => {
    setTagsTask(tagsTask.filter((item) => item.title !== tag.title));
  };

  const onAddNewTag = (tag) => {
    setIsShowAddTagForm(false);
    const newTagsTask = [...tagsTask, tag];
    setTagsTask(newTagsTask);
    dispatch({ type: TYPE_ACTION_TASK.SET_TAGS, payload: newTagsTask });
  };

  return (
    <>
      <div>
        {tagsTask.map((tag) => (
          <Tag key={tag.title} color={tag.color} onClose={onDelete} closable={isEdit}>
            {tag.title}
          </Tag>
        ))}

        {isEdit && (
          <Button onClick={() => setIsShowAddTagForm(true)} size="small">
            +
          </Button>
        )}
      </div>

      <Modal
        visible={isShowAddTagForm}
        onCancel={() => setIsShowAddTagForm(false)}
        closable
        footer={null}
      >
        <AddTag onAdd={onAddNewTag} />
      </Modal>
    </>
  );
});

const SectionDescription = React.memo(({ description, dispatch, isEdit }) => {
  const YOUR_CLIENT_API_KEY = 'f93f2029abad112fe1a0e2d1bfe9e8d1';

  const onImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    return new Promise((resolve) => {
      request
        .post(
          `https://api.imgbb.com/1/upload?expiration=600&key=${YOUR_CLIENT_API_KEY}`,
          { data: formData },
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        )
        .then((res) => {
          resolve(res.data.url);
        });
    });
  };

  if (isEdit) {
    return (
      <MdEditor
        style={{ minHeight: '300px', width: '100%' }}
        onImageUpload={onImageUpload}
        value={description}
        renderHTML={(text) => <ReactMarkdown>{text}</ReactMarkdown>}
        onChange={({ text, html }) => {
          dispatch({ type: TYPE_ACTION_TASK.SET_DESCRIPTION, payload: text });
        }}
      />
    );
  }

  return (
    <div>
      {description.length ? (
        // eslint-disable-next-line react/no-children-prop
        <ReactMarkdown className={styles['markdown-wrapper']} children={description} />
      ) : (
        <div />
      )}
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
        <Col>
          <span className={styles['section-wrapper-icon']}>{icon}</span>
          <span className={styles['section-wrapper-title']}>{title} :</span>
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
      style={{ minWidth: '80vw' }}
      visible={visible}
      onCancel={() => setVisible(false)}
      footer={null}
      closable={null}
      title={
        <Row align="middle" justify="space-between">
          <div>
            <Tag color="green">
              {`${dataBoard.title.slice(0, 4)}-${dataBoard.tasks[taskId].id}`.toUpperCase()}
            </Tag>
          </div>
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
      <SectionWrapper icon={<AimOutlined />} isInline>
        <SectionTitle
          title={dataTask.title}
          dispatch={dispatch}
          isEdit={!readOnly && ROLE === 'admin'}
        />
      </SectionWrapper>

      <SectionWrapper icon={<ContactsFilled />} title="Members" isInline>
        <SectionMember
          members={dataTask.members}
          dispatch={dispatch}
          isEdit={!readOnly && ROLE === 'admin'}
        />
      </SectionWrapper>

      <SectionWrapper icon={<PushpinFilled />} title="Deadline" isInline>
        <SectionDeadline
          deadline={dataTask.deadline}
          dispatch={dispatch}
          isEdit={!readOnly && ROLE === 'admin'}
        />
      </SectionWrapper>

      <SectionWrapper icon={<PushpinFilled />} title="Pr link" isInline>
        <SectionPrLink
          deadline={dataTask.prLink}
          dispatch={dispatch}
          isEdit={!readOnly && ROLE === 'admin'}
        />
      </SectionWrapper>

      <SectionWrapper icon={<PushpinFilled />} title="Tags" isInline>
        <SectionTags
          tags={dataTask.tags}
          dispatch={dispatch}
          isEdit={!readOnly && ROLE === 'admin'}
        />
      </SectionWrapper>

      <SectionWrapper icon={<PushpinFilled />} title="Description">
        <SectionDescription
          description={dataTask.description}
          dispatch={dispatch}
          isEdit={!readOnly && ROLE === 'admin'}
        />
      </SectionWrapper>
    </Modal>
  );
};

export default TaskDetail;
