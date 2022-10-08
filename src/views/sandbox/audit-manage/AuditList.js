//引入react
import React, { useEffect, useState } from 'react'
//引入axios
import axios from 'axios'
//引入antd
import { Button, Table, Tag, notification } from 'antd';

export default function AuditList(props) {

  const [dataSource, setdataSource] = useState([])

  //解构
  const { username } = JSON.parse(localStorage.getItem("token"))

  //获取需审核的新闻
  useEffect(() => { //_ne是不等于，_lte是小于
    axios(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res => {
      setdataSource(res.data)
    })
  }, [username])

  //定义列表
  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item) => {
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
      }
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render: (category) => {
        return <div>{category.title}</div>
      }
    },
    {
      title: '审核状态',
      dataIndex: 'auditState',
      render: (auditState) => {
        const colorList = ["", "orange", "green", "red"]
        const auditList = ["草稿箱", "审核中", "已通过", "未通过"]
        return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          {
            item.auditState === 1 && <Button onClick={() => handleRevert(item)}>撤销</Button>
          }
          {
            item.auditState === 2 && <Button danger onClick={() => handlePublish(item)}>发布</Button>
          }
          {
            item.auditState === 3 && <Button type="primary" onClick={() => handleUpdate(item)}>更新</Button>
          }
        </div>
      }
    }
  ];

  //撤销新闻到草稿箱
  const handleRevert = (item) => {
    setdataSource(dataSource.filter(data => data.id !== item.id)) //剔除

    axios.patch(`/news/${item.id}`, { //审核状态改为0
      auditState: 0
    }).then(res => {
      notification.info({
        message: `通知`,
        description:
          `您可以到草稿箱中查看您的新闻`,
        placement: "bottomRight",
      });
    })
  }

  //跳转到更新
  const handleUpdate = (item) => {
    props.history.push(`/news-manage/update/${item.id}`)
  }

  //发布新闻到已发布
  const handlePublish = (item) => {
    axios.patch(`/news/${item.id}`, { //发布状态改为2
      "publishState": 2,
      "publishTime": Date.now()
    }).then(res => { //跳转到已发布
      props.history.push('/publish-manage/published')

      //弹出提示框
      notification.info({
        message: `通知`,
        description:
          `您可以到【发布管理/已经发布】中查看您的新闻`,
        placement: "bottomRight",
      });
    })
  }

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{
        pageSize: 6
      }}
        rowKey={item => item.id}
      />
    </div>
  )
}
