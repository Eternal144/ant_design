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

const FormItem = Form.Item;
const { Option } = Select;
const success = (str)=>{
  message.success(str);
}
const error = (str)=>{
  message.error(str);
}


@Form.create()
class RecordTableForm extends PureComponent {
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
    const {data} = this.state;
    return (newData || data).filter(item => {
      return item.rid === key;
    })[0];
  }
  toggleEditable = (e, key) => {
    e.preventDefault();
    const {data} = this.state;
    const newData = data.map((item)=>({...item}));
    const target = newData.filter(item=>{
      return item.rid === key
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
    const newData = data.filter(item => item.rid !== key);
    this.setState({ data: newData });
    onChange(newData);
    fetch(`http://localhost:8080/api/delete/record?rid=${key}`,{
      method:"DELETE",
      headers:{
        'content-type': 'application/json'
      },
    })
    .then(res=>res.json())
    .then(data=>{
      success(data.message)
    });
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
//没有对修改做出反应
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
      console.log(target);
      if (!target.sname || !target.cname || !target.student_id || !target.course_id) {
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
 
  handleFetch = (type,info)=>{
    let url = `http://localhost:8080/api/situation/record?${type}=${info}`;
    console.log(url);
      fetch(url)
      .then(res=>res.json())
      .then(data=>{
        if(data.data.length == 0){
          error(data.message)
          return;
        }
        this.setState({
          data:data.data
        })
      })
  }

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const {studentType,studentInfo,courseType,courseInfo} = fieldsValue;
      if(!studentInfo && !courseInfo){
        alert("请输入学生或者课程的信息")
        return;
      }

      //如果两个信息都有,查某个学生某个课的/
      if(studentInfo && courseInfo){
        let url = `http://localhost:8080/api/info/grade/?${studentType}=${studentInfo}&${courseType}=${courseInfo}`
        console.log(url);
        fetch(url)
        .then(res=>res.json())
        .then(data=>{
          if(data.data.length == 0){
            error(data.message)
            return;
          }
          this.setState({
            data:data.data
          })
        }
          )
      }else if(studentInfo){
        this.handleFetch(studentType,studentInfo)
      }else{
        this.handleFetch(courseType,courseInfo)
      }
    })
  };
  handleAllRecords = e =>{
    console.log("all")
    let url = `http://localhost:8080/api/info/allRecord`;
    fetch(url)
    .then(res=>res.json())
    .then(data=>{
      console.log(data);
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
                initialValue:"sname"
              })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value={"sname"}>姓名</Option>
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
            </span>
          </Col>
        </Row>

        <Row gutter={{ md: 8, lg: 24, xl: 48 }}> 
        <Col md={4} sm={24}>
          <FormItem label="课程">
              {getFieldDecorator('courseType',{
                initialValue:"cname"
              })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value={"cname"}>名称</Option>
                  <Option value={"cid"}>编号</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
          <FormItem label="">
              {getFieldDecorator('courseInfo')(<Input placeholder="请输入查询对象" />)}
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
              <Button style={{ marginLeft: 8 }} onClick={this.handleAllRecords}>
                查看全部
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
        width: '16%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
              defaultValue={text}
                autoFocus
                onChange={e => this.handleFieldChange(e, 'student_id', record.rid)}
                onKeyPress={e => this.handleKeyPress(e, record.rid)}
                placeholder="学号"
                readOnly
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
        width: '16%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <div>
              <Input
                defaultValue={text}
                onChange={e => this.handleFieldChange(e, 'course_id', record.rid)}
                onKeyPress={e => this.handleKeyPress(e, record.rid)}
                placeholder="课程编号"
                readOnly
              />
              </div>
            );
          }
          return text;
        },
      },
      {
        title: '姓名',
        dataIndex: 'sname',
        key: 'sname',
        width: '16%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
              defaultValue={text}
                onChange={e => this.handleFieldChange(e, 'sname', record.rid)}
                onKeyPress={e => this.handleKeyPress(e, record.rid)}
                placeholder="姓名"
                readOnly
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
        width: '16%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
              defaultValue={text}
                onChange={e => this.handleFieldChange(e, 'cname', record.rid)}
                onKeyPress={e => this.handleKeyPress(e, record.rid)}
                placeholder="课程名称"
                readOnly
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
        width: '16%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
              defaultValue={text}
                onChange={e => this.handleFieldChange(e, 'select_year', record.rid)}
                onKeyPress={e => this.handleKeyPress(e, record.rid)}
                placeholder="选课日期"
                readOnly
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
                  <a onClick={e => this.saveRow(e, record.rid)}>保存</a>
                  <Divider type="vertical" />
                  <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.rid)}>
                    <a>删除</a>
                  </Popconfirm>
                </span>
              );
            }
            return (
              <span>
                <a onClick={e => this.saveRow(e, record.rid)}>保存</a>
                <Divider type="vertical" />
                <a onClick={e => this.cancel(e, record.rid)}>取消</a>
              </span>
            );
          }
          return (
            <span>
              {/* <a onClick={e=>this.toggleEditable(e, record.rid)}>编辑</a> */}
              {/* <Divider type="vertical" /> */}
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.rid)}>
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


export default RecordTableForm;
