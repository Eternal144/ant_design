import React, { PureComponent, Fragment } from 'react';
import { Table, Button, Input, message, Popconfirm, Divider,Form} from 'antd';
import isEqual from 'lodash/isEqual';
import styles from '../style.less';
import { getFileItem } from 'antd/lib/upload/utils';

//const FormItem = Form.Item;
// const CreateForm = Form.create()(props => {
//   console.log(props)
//   const { modalVisible, form, handleAdd, handleModalVisible } = props;
//   const okHandle = () => {
//     form.validateFields((err, fieldsValue) => {
//       if (err) return;
//       form.resetFields();
//       handleAdd(fieldsValue);
//     });
//   };
//   return (
//     <Modal
//       destroyOnClose
//       title="新建规则"
//       visible={modalVisible}
//       onOk={okHandle}
//       onCancel={() => handleModalVisible()}
//     >
//       <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="描述">
//         {form.getFieldDecorator('desc', {
//           rules: [{ required: true, message: '请输入至少五个字符的规则描述！', min: 5 }],
//         })(<Input placeholder="请输入" />)}
//       </FormItem>
//     </Modal>
//   );
// });

class TableForm extends PureComponent {
  index = 0;

  cacheOriginData = {};

  constructor(props) {  
    super(props);
    this.state = {
      data: props.value,
      loading: false,
      /* eslint-disable-next-line react/no-unused-state */
      value: props.value,
    };
    //console.log(this.props)
  }

  static getDerivedStateFromProps(nextProps, preState) {
    if (isEqual(nextProps.value, preState.value)) {
      return null;
    }
    return {
      data: nextProps.value,
      value: nextProps.value,
    };
  }

  getRowByKey(key, newData) {
    const { data } = this.state;
    return (newData || data).filter(item => item.key === key)[0];
  }

  toggleEditable = (e, key) => {
    e.preventDefault();
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[key] = { ...target };
      }
      target.editable = !target.editable;
      this.setState({ data: newData });
    }
  };

  newMember = () => {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    newData.push({
      key: `NEW_TEMP_ID_${this.index}`,
      workId: '',
      name: '',
      department: '',
      editable: true,
      isNew: true,
    });
    console.log(newData);
    this.index += 1;
    this.setState({ data: newData });
  };

  remove(key) {
    const { data } = this.state;
    const { onChange } = this.props;
    const newData = data.filter(item => item.key !== key);
    this.setState({ data: newData });
    onChange(newData);
  }

  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }

  handleFieldChange(e, fieldName, key) {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = e.target.value;
      this.setState({ data: newData });
    }
  }

  saveRow(e, key) {
    e.persist();
    this.setState({
      loading: true,
    });
    setTimeout(() => {
      if (this.clickedCancel) {
        this.clickedCancel = false;
        return;
      }
      const target = this.getRowByKey(key) || {};
      if (!target.workId || !target.name || !target.department) {
        message.error('请填写完整成员信息。');
        e.target.focus();
        this.setState({
          loading: false,
        });
        return;
      }
      delete target.isNew;
      this.toggleEditable(e, key);
      const { data } = this.state;
      const { onChange } = this.props;
      onChange(data);
      this.setState({
        loading: false,
      });
    }, 500);
  }

  cancel(e, key) {
    this.clickedCancel = true;
    e.preventDefault();
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (this.cacheOriginData[key]) {
      Object.assign(target, this.cacheOriginData[key]);
      delete this.cacheOriginData[key];
    }
    target.editable = false;
    this.setState({ data: newData });
    this.clickedCancel = false;
  }
  renderForm(){
    //console.log(this.props);
    // const {
    //   form: { getFieldDecorator },
    // } = this.props;
  //   return <div>
  //   <FormItem key="name" {...this.formLayout} label="规则名称">
  //   {form.getFieldDecorator('name', {
  //     rules: [{ required: true, message: '请输入规则名称！' }],
  //     initialValue: formVals.name,
  //   })(<Input placeholder="请输入" />)}
  // </FormItem>,
  // <FormItem key="desc" {...this.formLayout} label="规则描述">
  //   {form.getFieldDecorator('desc', {
  //     rules: [{ required: true, message: '请输入至少五个字符的规则描述！', min: 5 }],
  //     initialValue: formVals.desc,
  //   })(<TextArea rows={4} placeholder="请输入至少五个字符" />)}
  // </FormItem>
  //           <Button type="primary" htmlType="submit">
  //           查询
  //         </Button>
  //         <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
  //           重置
  //         </Button>
  //         </div>
  }
  render() {
    const columns = [
      {
        title: '学号',
        dataIndex: 'student_id',
        key: 'student_id',
        width: '18%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                autoFocus
                onChange={e => this.handleFieldChange(e, 'student_id', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="学号"
              />
            );
          }
          return text;
        },
      },
      {
        title: '课程编号',
        dataIndex: 'course_id',
        key: 'course_id',
        width: '18%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                onChange={e => this.handleFieldChange(e, 'course_id', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="课程编号"
              />
            );
          }
          return text;
        },
      },
      {
        title: '姓名',
        dataIndex: 'sname',
        key: 'sname',
        width: '18%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                onChange={e => this.handleFieldChange(e, 'sname', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="姓名"
              />
            );
          }
          return text;
        },
      },
      {
        title: '课程名称',
        dataIndex: 'cname',
        key: 'cname',
        width: '18%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                onChange={e => this.handleFieldChange(e, 'cname', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="课程名称"
              />
            );
          }
          return text;
        },
      },
      {
        title: '选课日期',
        dataIndex: 'select_year',
        key: 'select_year',
        width: '18%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                onChange={e => this.handleFieldChange(e, 'select_year', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="选课日期"
              />
            );
          }
          return text;
        },
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => {
          const { loading } = this.state;
          if (!!record.editable && loading) {
            return null;
          }
          if (record.editable) {
            if (record.isNew) {
              return (
                <span>
                  <a onClick={e => this.saveRow(e, record.key)}>保存</a>
                  <Divider type="vertical" />
                  <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                    <a>删除</a>
                  </Popconfirm>
                </span>
              );
            }
            return (
              <span>
                <a onClick={e => this.saveRow(e, record.key)}>保存</a>
                <Divider type="vertical" />
                <a onClick={e => this.cancel(e, record.key)}>取消</a>
              </span>
            );
          }
          return (
            <span>
              <a onClick={e => this.toggleEditable(e, record.key)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                <a>删除</a>
              </Popconfirm>
            </span>
          );
        },
      },
    ];

    const { loading, data } = this.state;

    return (
      <Fragment>
        {this.renderForm()}
              {/* <FormItem key="name" {...this.formLayout} label="规则名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入规则名称！' }],
          initialValue: formVals.name,
        })(<Input placeholder="请输入" />)}
      </FormItem>,
      <FormItem key="desc" {...this.formLayout} label="规则描述">
        {form.getFieldDecorator('desc', {
          rules: [{ required: true, message: '请输入至少五个字符的规则描述！', min: 5 }],
          initialValue: formVals.desc,
        })(<TextArea rows={4} placeholder="请输入至少五个字符" />)}
      </FormItem>, */}
        <Table
          loading={loading}
          columns={columns}
          dataSource={data}
          pagination={false}
          rowClassName={record => (record.editable ? styles.editable : '')}
        />
        <Button
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type="dashed"
          onClick={this.newMember}
          icon="plus"
        >
          新增成员
        </Button>
      </Fragment>
    );
  }
}


export default TableForm;
