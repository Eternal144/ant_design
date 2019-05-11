import React, { PureComponent, Fragment,Suspense } from 'react';
import { connect } from 'dva';
import { 
  Row,
  Col,
  Table,
  Select,
  Form, Button, Input, message, Popconfirm, Divider,Dropdown,Icon} from 'antd';
import isEqual from 'lodash/isEqual';
import styles from '../style.less';

import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { getTimeDistance } from '@/utils/utils';

import PageLoading from '@/components/PageLoading';
import { getFileItem } from 'antd/lib/upload/utils';
import ClassForm from './ClassAnalysis';
import { puts } from 'util';

const FormItem = Form.Item;
const { Option } = Select;
const success = (str)=>{
  message.success(str);
}
const error = (str)=>{
  message.error(str);
}
const SalesCard = React.lazy(() => import('./SalesCard'));


@connect(({ chart, loading }) => ({
    chart,
    loading: loading.effects['chart/fetch'],
  }))
@Form.create()
class ClassAnalysisForm extends PureComponent {
  index = 0;
  cacheOriginData = {};

  constructor(props) {  
    super(props);
    this.state = {
      data: props.value,
      loading: false,
      value: props.value,
      tableData:[],
      rangePickerValue: getTimeDistance('year'),
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

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const {gradeInfo} = fieldsValue;
      if(!gradeInfo){
        error("请输入学生的信息")
        return;
      }
      let url = `http://localhost:8080/api/average/class?grade=${gradeInfo}`
      fetch(url)
      .then(res=>res.json())
      .then(data=>{
        data = data.data
        data.map(item=>{
          item.x = item.classroom + '班'
          item.y = item.average
        })
        this.setState({
          tableData:data
        })
      }
      )
    })
}

  handeleClear = ()=>{
    const { form } = this.props;
    form.setFieldsValue({
      gradeInfo:null,
    })
  }

  renderQuery() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}> 
          <Col md={6} sm={24}>
          <FormItem label="年级">
              {getFieldDecorator('gradeInfo')(<Input placeholder="请输入查询年级" />)}
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
            </span>
          </Col>
          </Row>
      </Form>
    );
  }

  componentDidMount() {
    fetch(`http://localhost:8080/api/average/class?grade=${2}`)
    .then(res=>res.json())
    .then(data=>{
      data = data.data
      data.map(item=>{
        item.x = item.classroom + '班'
        item.y = item.average
      })

        this.setState({
            tableData:data,
        })
    })
  }


  isActive = type => {
    const { rangePickerValue } = this.state;
    const value = getTimeDistance(type);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return '';
    }
    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }
    return '';
  };

  render() {
    const { rangePickerValue, salesType, currentTabKey } = this.state;
    const { chart, loading } = this.props;
    return (
      <Fragment>
        <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderQuery()}
            </div>
        </div>
        <GridContent>
        <Suspense fallback={null}>
          <SalesCard
            salesData={this.state.tableData}
            isActive={this.isActive}
            loading={loading}
          />
        </Suspense>
      </GridContent>
      </Fragment>
    );
  }
}


export default ClassAnalysisForm;
