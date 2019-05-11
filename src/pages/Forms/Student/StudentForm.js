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
//import styles from './style.less';
import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import TableForm from './StudentTableForm';

const { Option } = Select;
const { RangePicker } = DatePicker;

@connect(({ loading }) => ({
  submitting: loading.effects['form/submitAdvancedForm'],
}))
@Form.create()
class StudentForm extends PureComponent {
  state = {
    width: '100%',
    data: [],
  };

  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar, { passive: true });
    fetch("http://localhost:8080/api/info/allStudent")
    .then(res=>res.json())
    .then(data=>{
      data = data.data;
      data.forEach(element => {
        element.isNew = false
        element.editable = false
      });
      this.setState({
        data:data
      })
    });
    
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }


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
        title="个人信息"
        content="天津大学本科生个人信息记录"
        wrapperClassName={styles.advancedForm}
      >
        <Card title="学生管理" bordered={false}>
          {getFieldDecorator('members', {
            initialValue: this.state.data,
          })(<TableForm />)}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default StudentForm;
