import React, { PureComponent } from 'react';
import {
  Card,
  Button,
  Form,
  Icon,
  Col,
  Row,
  DatePicker,
  TimePicker,
  Input,
  Select,
  Popover,
} from 'antd';

import { connect } from 'dva';
import styles from '../style.less';
import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import TableForm from './RecordTableForm';

const { Option } = Select;
const { RangePicker } = DatePicker;

// const fieldLabels = {
//   name: '仓库名',
//   url: '仓库域名',
//   owner: '仓库管理员',
//   approver: '审批人',
//   dateRange: '生效日期',
//   type: '仓库类型',
//   name2: '任务名',
//   url2: '任务描述',
//   owner2: '执行人',
//   approver2: '责任人',
//   dateRange2: '生效日期',
//   type2: '任务类型',
// };


// const tableData = [
//   {
//     student_id: '1',
//     course_id: '00001',
//     sname: 'John Brown',
//     cname: 'New York No. 1 Lake Park',
//     select_year:'124',
//   },
  // {
  //   key: '2',
  //   workId: '00002',
  //   name: 'Jim Green',
  //   department: 'London No. 1 Lake Park',
  // },
  // {
  //   key: '3',
  //   workId: '00003',
  //   name: 'Joe Black',
  //   department: 'Sidney No. 1 Lake Park',
  // },
// ];

@connect(({ loading }) => ({
  submitting: loading.effects['form/submitAdvancedForm'],
}))
@Form.create()
class AdvancedForm extends PureComponent {
  state = {
    width: '100%',
    data: [],
  };

  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar, { passive: true });
    fetch("http://localhost:8080/api/info/allRecord")
    .then(res=>res.json())
    .then(data=>{
      data.forEach(element => {
        element.isNew = false
        element.editable = false
      });
      //console.log(data);
      this.setState({
        data:data
      })
    });
    
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  // getErrorInfo = () => {
  //   const {
  //     form: { getFieldsError },
  //   } = this.props;
  //   const errors = getFieldsError();
  //   const errorCount = Object.keys(errors).filter(key => errors[key]).length;
  //   if (!errors || errorCount === 0) {
  //     return null;
  //   }
  //   const scrollToField = fieldKey => {
  //     const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
  //     if (labelNode) {
  //       labelNode.scrollIntoView(true);
  //     }
  //   };
  //   const errorList = Object.keys(errors).map(key => {
  //     if (!errors[key]) {
  //       return null;
  //     }
  //     return (
  //       <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>


  resizeFooterToolbar = () => {
    requestAnimationFrame(() => {
      const sider = document.querySelectorAll('.ant-layout-sider')[0];
      if (sider) {
        const width = `calc(100% - ${sider.style.width})`;
        const { width: stateWidth } = this.state;
        if (stateWidth !== width) {
          this.setState({ width });
        }
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      submitting,
    } = this.props;
    const { width } = this.state;

    return (
      <PageHeaderWrapper
        title="选课记录"
        content="天津大学本科生选课记录"
        wrapperClassName={styles.advancedForm}
      >

        <Card title="成员管理" bordered={false}>
          {getFieldDecorator('members', {
            initialValue: this.state.data,
          })(<TableForm />)}
        </Card>
        {/* <FooterToolbar style={{ width }}>
          {this.getErrorInfo()}
          <Button type="primary" onClick={this.validate} loading={submitting}>
            提交
          </Button>
        </FooterToolbar> */}
      </PageHeaderWrapper>
    );
  }
}

export default AdvancedForm;
