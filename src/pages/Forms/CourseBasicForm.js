import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  InputNumber,
  Radio,
  Icon,
  Tooltip,
  message
} from 'antd';  
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const success = ()=>{
  message.success("添加成功！")
}
const error = ()=>{
  message.error("添加失败！")
}
@connect(({ loading }) => ({
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
class BasicForms extends PureComponent {
  handleSubmit = e => {
    //在这里添加
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        //console.log(values);
        fetch("http://localhost:8080/api/insert/course",{
          method:"POST",
          headers:{
            'content-type': 'application/json'
          },
          body: JSON.stringify(values)
        })
        .then(res=>res.json())
        .then(data=>{
          success()
          
        })
        .error(
          error()
        )

      }
    });
  };
  handleRefresh=()=>{
    const { form } = this.props;
    form.setFieldsValue({
      "cname":null,
      "course_id":null,
      "tname":null,
      "credit":null,
      "grade":null,
      "cancle_year":null
    })
  }
  render() {
    const { submitting } = this.props;
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    return (
      <PageHeaderWrapper
        title={<FormattedMessage id="课程添加" />}
        content={<FormattedMessage id="次界面用于添加课程信息" />}
      >
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label={<FormattedMessage id="名称" />}>
              {getFieldDecorator('cname', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: '请输入课程的名称' }),
                  },
                ],
              })(<Input placeholder={formatMessage({ id: '请输入课程的名称' })} />)}
            </FormItem>
            <FormItem {...formItemLayout} label={<FormattedMessage id="编号" />}>
              {getFieldDecorator('course_id', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: '请输入课程的编号' }),
                  },
                ],
              })(<Input placeholder={formatMessage({ id: '请输入课程的编号' })} />)}
            </FormItem>



            <FormItem {...formItemLayout} label={<FormattedMessage id="任课教师" />}>
              {getFieldDecorator('tname', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: '请输入任课老师' }),
                  },
                ],
              })(<Input placeholder={formatMessage({ id: '请输入学生的入学年份' })} />)}
            </FormItem>

            <FormItem {...formItemLayout} label={<FormattedMessage id="学分" />}>
              {getFieldDecorator('credit', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: '请输入该课的学分' }),
                  },
                ],
              })(<Input placeholder={formatMessage({ id: '请输入该课的学分' })} />)}
            </FormItem>

            <FormItem {...formItemLayout} label={<FormattedMessage id="选课年纪" />}>
              {getFieldDecorator('grade', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: '请输入该课程的选课年纪' }),
                  },
                ],
              })(<Input placeholder={formatMessage({ id: '请输入该课程的选课年纪' })} />)}
            </FormItem>

            <FormItem {...formItemLayout} label={<FormattedMessage id="取消年份" />}>
              {getFieldDecorator('cancle_year', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: '请输入该课的取消年份' }),
                  },
                ],
              })(<Input placeholder={formatMessage({ id: '请输入该课的取消年份' })} />)}
            </FormItem>

            {/* <FormItem
              {...formItemLayout}
              label={
                <span>
                  <FormattedMessage id="班级" />
                  <em className={styles.optional}>
                    <FormattedMessage id="form.optional" />
                    <Tooltip title={<FormattedMessage id="form.client.label.tooltip" />}>
                      <Icon type="info-circle-o" style={{ marginRight: 4 }} />
                    </Tooltip>
                  </em>
                </span>
              }
            >
               {getFieldDecorator('classroom')(<Input placeholder={formatMessage({ id: '请输入学生分配的班级' })} />)}
            </FormItem> */}
            
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                <FormattedMessage id="form.submit" />
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleRefresh} >
                <FormattedMessage id="重置" />
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default BasicForms;
