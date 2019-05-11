import React, { memo } from 'react';
import { Row, Col, Card, Tabs, DatePicker } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import numeral from 'numeral';
import styles from './Analysis.less';
import { Bar } from '@/components/Charts';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
//居然要单独引入

const rankingListData = [];
for (let i = 0; i < 7; i += 1) {
  rankingListData.push({
    title: formatMessage({ id: 'app.analysis.test' }, { no: i }),
    total: 323234,
  });
}
const compare = function (obj1, obj2) {
  var val1 = obj1.average;
  var val2 = obj2.average;
  if (val1 < val2) {
      return 1;
  } else if (val1 > val2) {
      return -1;
  } else {
      return 0;
  }            
} 
const renderRanking = (salesData)=>{
  let copyData = salesData.map(item=>({...item}));
  copyData.sort(compare)
  copyData.map(item=>{
    item.title = item.classroom+"班的平均成绩："
    item.total = item.average
  })
  return (
    copyData.map((item, i) => (
      <li key={item.title}>
        <span
          className={`${styles.rankingItemNumber} ${i < 3 ? styles.active : ''}`}
        >
          {i + 1}
        </span>
        <span className={styles.rankingItemTitle} title={item.title}>
          {item.title}
        </span>
        <span className={styles.rankingItemValue}>
          {numeral(item.total).format('0,0')}
        </span>
      </li>
    ))

  )
}

const SalesCard = memo(
  ({  salesData,loading }) => (
    <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
      <div className={styles.salesCard}>
        <Tabs
          tabBarExtraContent={
            <div className={styles.salesExtraWrap}>
            </div>
          }
          size="large"
          tabBarStyle={{ marginBottom: 24 }}
        >
          <TabPane
            tab={<FormattedMessage id="aaa" defaultMessage="班级成绩" />}
            key="sales"
          >
            <Row>
              <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                <div className={styles.salesBar}>
                  <Bar
                    height={295}
                    title={
                      <FormattedMessage
                        id="班级成绩分布"
                        defaultMessage="班级成绩分布"
                      />
                    }
                    data={salesData}
                  />
                </div>
              </Col>

              <Col xl={8} lg={12} md={12} sm={24} xs={24}>
              <div className={styles.salesRank}>
                <h4 className={styles.rankingTitle}>
                  <FormattedMessage
                    id="aaa"
                    defaultMessage="各班级平均成绩排名 "
                  />
                </h4>
                <ul className={styles.rankingList}>
                {renderRanking(salesData)}
                </ul>
              </div>
            </Col>
            </Row>
          </TabPane>
          </Tabs>
      </div>
    </Card>
  )
);

export default SalesCard;
