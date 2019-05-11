import React, { PureComponent, Fragment } from 'react';
import { 
  Row,
  Col,
  Table,
  Select,
  Form, Button, Input, message, Popconfirm, Divider} from 'antd';
import isEqual from 'lodash/isEqual';
 import styles from '../style.less';

import { getFileItem } from 'antd/lib/upload/utils';
import component from '@/locales/zh-CN/component';
import StudentForm from './StudentForm';
import { puts } from 'util';

const success = (str)=>{
  message.success(str);
}
const error = (str)=>{
  message.error(str);
}


const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
class StudentTableForm extends PureComponent {
  index = 0;
  cacheOriginData = {};

  constructor(props) {  
    super(props);
    this.state = {
      data: props.value,
      loading: false,
      value: props.value,
    };
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
    const {data} = this.state;
    return (newData || data).filter(item => {
      return item.sid === key;
    })[0];
  }
  toggleEditable = (e, key) => {
    e.preventDefault();
    const {data} = this.state;
    const newData = data.map((item)=>({...item}));
    const target = newData.filter(item=>{
      return item.sid === key
      }
    )[0];
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
    const newData = data.filter(item => item.sid !== key);
    console.log(key);
    this.setState({ data: newData });
    fetch(`http://localhost:8080/api/delete/student?sid=${key}`,{
      method:"DELETE",
      headers:{
        'content-type': 'application/json'
      }, 
    })
    .then(res=>res.json())
    .then(data=>{
      success(data.message)
    });
    onChange(newData);
  }

  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }

  //在onchange中更新用于更新的字符串。。。对应key去保存。可能发生的变化。一个对象
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
      //key = sid
      const target = this.getRowByKey(key) || {};
      const {data} = this.state;
      console.log(target);
      if (!target.sname || !target.gender || !target.adm_year || !target.adm_age ||!target.student_id) {
        message.error('请填写完整成员信息。');
        e.target.focus();
        this.setState({
          loading: false,
        });
        return;
      }
      delete target.isNew
      delete target.editable
      delete target.average
      this.toggleEditable(e, key);
      const { onChange } = this.props;
      let url = `http://localhost:8080/api/update/student`
      fetch(url,{
        method:"POST",
        headers:{
          'content-type': 'application/json'
        },
        body:JSON.stringify(target)
      })
      .then(res=>res.json())
      .then(data=>success(data.message))
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
 
  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const {studentType,studentInfo} = fieldsValue;
      if(!studentInfo){
        alert("请输入学生的信息")
        return;
      }
      let url = `http://localhost:8080/api/info/student/?${studentType}=${studentInfo}`
      fetch(url)
      .then(res=>res.json())
      .then(data=>
        this.setState({
          data:data.data
        })
      )
        })
}
handleAllStudents = ()=>{
  let url = `http://localhost:8080/api/info/allStudent`;
  fetch(url)
  .then(res=>res.json())
  .then(data=>{
    this.setState({
      data:data.data
    })
  }
  )
}
  handeleClear = ()=>{
    const { form } = this.props;
    form.setFieldsValue({
      studentInfo:null,
      courseInfo:null
    })
  }


  renderQuery() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={4} sm={24}>
          <FormItem label="学生">
              {getFieldDecorator('studentType',{
                initialValue:"name"
              })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value={"name"}>姓名</Option>
                  <Option value={"sid"}>学号</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
          <FormItem label="">
              {getFieldDecorator('studentInfo')(<Input placeholder="请输入查询对象" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handeleClear}>
                重置
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleAllStudents}>
                显示全部
              </Button>
            </span>
          </Col>

        </Row>
      </Form>
    );
  }
  render() {
    const columns = [
      {
        title: '学号',
        dataIndex: 'student_id',
        key: 'student_id',
        width: '12%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
              defaultValue={text}
                autoFocus
                onChange={e => this.handleFieldChange(e, 'student_id', record.sid)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="学号"
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
        width: '12%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
              defaultValue={text}
                onChange={e => this.handleFieldChange(e, 'sname', record.sid)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="姓名"
              />
            );
          }
          return text;
        },
      },
      {
        title: '性别',
        dataIndex: 'gender',
        key: 'gender',
        width: '12%',
        render: (text, record) => {
          if (record.editable) {
            
            return (
              <div>
              <Input
                defaultValue={text}
                onChange={e => this.handleFieldChange(e, 'gender', record.sid)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="性别"
              />
              </div>
            );
          }
          return text;
        },
      },
      {
        title: '班级',
        dataIndex: 'classroom',
        key: 'classroom',
        width: '12%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <div>
              <Input
                defaultValue={text}
                onChange={e => this.handleFieldChange(e, 'classroom', record.sid)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="班级"
              />
              </div>
            );
          }
          return text;
        },
      },
      {
        title: '入学年龄',
        dataIndex: 'adm_age',
        key: 'adm_age',
        width: '14%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
              defaultValue={text}
                onChange={e => this.handleFieldChange(e, 'adm_age', record.sid)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="课程名称"
                
              />
            );
          }
          return text;
        },
      },
      {
        title: '入学年份',
        dataIndex: 'adm_year',
        key: 'adm_year',
        width: '14%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
              defaultValue={text}
                onChange={e => this.handleFieldChange(e, 'adm_year', record.sid)}
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
                  <a onClick={e => this.saveRow(e, record.sid)}>保存</a>
                  <Divider type="vertical" />
                  <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.sid)}>
                    <a>删除</a>
                  </Popconfirm>
                </span>
              );
            }
            return (
              <span>
                <a onClick={e => this.saveRow(e, record.sid)}>保存</a>
                <Divider type="vertical" />
                <a onClick={e => this.cancel(e, record.sid)}>取消</a>
              </span>
            );
          }
          return (
            <span>
              <a onClick={e=>this.toggleEditable(e, record.sid)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.sid)}>
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
        <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderQuery()}
            </div>
            </div>
        <Table
          loading={loading}
          columns={columns}
          dataSource={data}
          pagination={false}
          rowClassName={record => (record.editable ? styles.editable : '')}
        />
      </Fragment>
    );
  }
}


export default StudentTableForm;
