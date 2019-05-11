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
// import styles1 from './Analysis.less';

import PageLoading from '@/components/PageLoading';
import { getFileItem } from 'antd/lib/upload/utils';
import CourseForm from './CourseForm';
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
const tempData = [
  {
    x:"<60",
    y:0
  },
  {
    x:"60-70",
    y:0
  },
  {
    x:"70-80",
    y:0
  },
  {
    x:"80-90",
    y:0
  },
  {
    x:"90-100",
    y:0
  }
]

@connect(({ chart, loading }) => ({
    chart,
    loading: loading.effects['chart/fetch'],
  }))
@Form.create()
class CourseAnalysisForm extends PureComponent {
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
      const {courseName} = fieldsValue;
      if(!courseName){
        alert("请输入课程名称")
        return;
      }
      //自己来分布
      let url = `http://localhost:8080/api/info/allCourseScores?cname=${courseName}` 
      fetch(url)
      .then(res=>res.json())
      .then(data=>{
        if(data.data.length === 0){
          error(data.message)
          return;
        }
        //将数据库的信息返回来
        data = data.data;
        
         //在这里进行计算 <60  60-70 70-80 80-90 90-100
        data.map(item=>{
          if(item.scores < 60){
            tempData[0].y++;
          }else if(item.scores < 70){
            tempData[1].y++;
          }else if(item.scores < 80){
            tempData[2].y++
          }else if(item.scores < 90){
            tempData[3].y++
          }else if(item.scores <= 100){
            tempData[4].y++
          }
        })
        this.setState({
          tableData:tempData
        })
      }
      )
        })
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
          <Col md={6} sm={24}>
          <FormItem label="课程">
              {getFieldDecorator('courseName')(<Input placeholder="请输入查询课程名称" />)}
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
    fetch("http://localhost:8080/api/average/allCourse")
    .then(res=>res.json())
    .then(data=>{
      data = data.data
        data.map( item => {
            item.x = item.cname;
            item.y = item.average;
            delete item.cname;
            delete item.average;
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
    console.log(chart);
    const {
      salesData,
    //   searchData,
    } = chart;
 
    return (
      <Fragment>
        <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderQuery()}
            </div>
        </div>
        <GridContent>
        <Suspense fallback={null}>
          <SalesCard
            //rangePickerValue={rangePickerValue}
            salesData={this.state.tableData}
            isActive={this.isActive}
            handleRangePickerChange={this.handleRangePickerChange}
            loading={loading}
            selectDate={this.selectDate}
          />
        </Suspense>
      </GridContent>
      </Fragment>
    );
  }
}


export default CourseAnalysisForm;
