import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Steps,
  Radio,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './TableList.less';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))

@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    data:{},
    fieldsValue:{}
  };

  columns = [
    {
      title: '课程编号',
      dataIndex: 'course_id',
      render: text => <a onClick={() => this.previewItem(text)}>{text}</a>,
    },
    {
      title: '课程名称',
      dataIndex: 'cname',
    },
    {
      title: '学分',
      sorter: true,
      dataIndex: 'credit',
    },
    {
      title: '可选年级',
      
      dataIndex: 'grade',
    },
    {
      title: '任课老师',
      dataIndex: 'tname',
     
      needTotal: true,
    },
    {
      title: '操作',
      render: (text, record) => {
          return (
            <Fragment>
              <Button type="primary" onClick={this.handleOnsubmitClasses.bind(this,text)} >选课</Button>
            </Fragment>
          );
      },
    }
  ];
  
  handleOnsubmitClasses(dom){
    const {fieldsValue} = this.state;
    let temp = {};
    temp[fieldsValue.status] = fieldsValue.name;
    let obj = Object.assign({},dom,temp);
    obj.select_year = new Date().getFullYear();
    let url = `http://localhost:8080/api/insert/record`
    fetch(url,{
      method:"POST",
      headers:{
        'content-type': 'application/json'
      },
      body: JSON.stringify(obj)
    })
    .then(res=>res.json())
    .then(data=>{
      console.log(data);
    })
  }

  // componentDidMount() {
  //   let url = `http://localhost:8080/api/fit/course/?sname=eternal`;
  //   fetch(url)
  //   .then(res=>res.json())
  //   .then(data=>{
  //     const obj = {
  //       list:data,
  //       pagination:{
  //         total:data.length,
  //         pageSize:data.length,
  //         current:1
  //       }
  //     }
  //     this.setState({
  //       data:obj
  //     })
  //   })
  // }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'rule/fetch',
      payload: params,
    });
  };

  previewItem = id => {
    router.push(`/profile/basic/${id}`);
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rule/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let url = `http://localhost:8080/api/fit/course/?${fieldsValue.status}=${fieldsValue.name}`;
      console.log(url);
      fetch(url)
      .then(res=>res.json())
      .then(data=>{
        const obj = {
          list:data,
          pagination:{
            total:data.length,
            pageSize:data.length,
            current:1
          }
        }
        console.log(data);
        this.setState({
          data:obj,
          fieldsValue:fieldsValue
        })
      })
    })
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    dispatch({
      type: 'rule/update',
      payload: {
        query: formValues,
        body: {
          name: fields.name,
          desc: fields.desc,
          key: fields.key,
        },
      },
    });
    message.success('配置成功');
    this.handleUpdateModalVisible();
  };

  handeleClear = ()=>{
    console.log("进来了")
    const { form } = this.props;
    form.setFieldsValue({
      name:null
    })
  }
  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
          <FormItem label="查询模式">
              {getFieldDecorator('status',{
                initialValue:"sname"
              })(
                <Select placeholder="请选择" style={{ width: '80%' }}>
                  <Option value={"sname"}>姓名</Option>
                  <Option value={"sid"}>学号</Option>
                </Select>
              )}
            </FormItem>
          </Col>

          <Col md={4} sm={24}>
          <FormItem label="">
              {getFieldDecorator('name')(<Input placeholder="请输入查询对象" />)}
            </FormItem>
          </Col>

          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit" onSubmit={this.handleGetList}>
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handeleClear} >
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      loading,
    } = this.props;

    const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    const updateMethods = {
      handleUpdate: this.handleUpdate,
    };  

    return (
      <PageHeaderWrapper title="查询表格">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div className={styles.tableListOperator}>

              {selectedRows.length > 0 && (
                <span>
                  <Button>批量操作</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data = {this.state.data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>

      </PageHeaderWrapper>
    );
  }
}

export default TableList;
