//引入react
import React, { useEffect, useRef, useState } from 'react'
//引入antd
import { Card, Col, Row, List, Avatar, Drawer } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import axios from 'axios';
//引入echarts
import * as ECharts from 'echarts';
//引入lodash
import _ from 'lodash'

const { Meta } = Card;

export default function Home() {

  //定义浏览数据
  const [viewList, setviewList] = useState([])
  //定义喜爱数据
  const [starList, setstarList] = useState([])
  //定义个人数据
  const [allList, setallList] = useState([])
  //定义图可见
  const [visible, setvisible] = useState(false)
  //定义喜爱数据
  const [pieChart, setpieChart] = useState(null)

  const barRef = useRef()
  const pieRef = useRef()

  //获取做多浏览6个数据
  useEffect(() => {
    axios.get("/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6").then(res => {
      setviewList(res.data)
    })
  }, [])

  //获取喜爱浏览6个数据
  useEffect(() => {
    axios.get("/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6").then(res => {
      setstarList(res.data)
    })
  }, [])

  //获取柱状图数据
  useEffect(() => {
    axios.get("/news?publishState=2&_expand=category").then(res => {
      //利用lodash进行数组分类
      renderBarview(_.groupBy(res.data, item => item.category.title))
      setallList(res.data)
    })

    return () => {
      window.onresize = null
    }
  }, [])

  //渲染柱状图
  const renderBarview = (obj) => {
    var myChart = ECharts.init(barRef.current);

    // 指定图表的配置项和数据
    var option = {
      title: {
        text: '新闻分类图示'
      },
      tooltip: {},
      legend: {
        data: ['数量']
      },
      xAxis: {
        data: Object.keys(obj),
        axisLabel: {
          rotate: "45",
          interval: 0
        }
      },
      yAxis: {
        minInterval: 1
      },
      series: [
        {
          name: '数量',
          type: 'bar',
          data: Object.values(obj).map(item => item.length)
        }
      ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    //窗口变动
    window.onresize = () => {
      myChart.resize()
    }
  }

  //渲染饼状图
  const renderPieview = (obj) => {
    //数据处理
    var currentList = allList.filter(item => item.author === username)
    var groupObj = _.groupBy(currentList, item => item.category.title)
    var list = []
    for (var i in groupObj) {
      list.push({
        name: i,
        value: groupObj[i].length
      })
    }

    var myChart;
    if (!pieChart) {
      myChart = ECharts.init(pieRef.current);
      setpieChart(myChart)
    } else {
      myChart = pieChart
    }
    var option;

    option = {
      title: {
        text: '当前用户新闻分类图示',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '发布数量',
          type: 'pie',
          radius: '50%',
          data: list,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    option && myChart.setOption(option);

  }

  //解构
  const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem("token"))

  return (
    <div className="site-card-wrapper">
      <Row gutter={16}>
        <Col span={8}>
          <Card title="用户最常浏览" bordered={true}>
            <List
              size="small"
              dataSource={viewList}
              renderItem={item => <List.Item>
                <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
              </List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="用户点赞最多" bordered={true}>
            <List
              size="small"
              dataSource={starList}
              renderItem={item => <List.Item>
                <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
              </List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <SettingOutlined key="setting" onClick={() => {
                //强行异步渲染
                setTimeout(() => {
                  setvisible(true)
                  renderPieview()
                }, 0)
              }} />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
              title={username}
              description={
                <div>
                  <b>{region ? region : "全球"}</b>
                  <span style={{ paddingLeft: "30px" }}>{roleName}</span>
                </div>
              }
            />
          </Card>
        </Col>
      </Row>

      <Drawer
        width="500px"
        title="个人新闻分类"
        placement="right"
        closable={true}
        onClose={() => {
          setvisible(false)
        }}
        open={visible}
      >
        <div ref={pieRef} style={{
          width: "100%",
          height: "400px",
          marginTop: "30px"
        }}></div>
      </Drawer>

      {/* 插入图表 */}
      <div ref={barRef} style={{
        width: "100%",
        height: "400px",
        marginTop: "30px"
      }}></div>

    </div>
  )
}
