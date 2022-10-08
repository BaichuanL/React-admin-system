//引入react
import React, { useEffect, useState } from 'react'
//引入axios
import axios from 'axios'
//引入antd
import { Button, Table, notification } from 'antd';

export default function Audit() {

  const [dataSource, setdataSource] = useState([])

  //从token中解析
  const { roleId, region, username } = JSON.parse(localStorage.getItem("token"))

  //获取auditState=1的数据并且判断权限
  useEffect(() => {
    //替换roleId中的1，2，3
    const roleObj = {
      "1": "superadmin",
      "2": "admin",
      "3": "editor"
    }
    axios.get(`/news?auditState=1&_expand=category`).then(res => {
      const list = res.data
      //判断权限
      setdataSource(roleObj[roleId] === "superadmin" ? list : [
        ...list.filter(item => item.author === username),
        ...list.filter(item => item.region === region && roleObj[item.roleId] === "editor")
      ])
    })
  }, [roleId, region, username])

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
      title: '操作',
      render: (item) => {
        return <div>
          <Button type="primary" onClick={() => handleAudit(item, 2, 1)}>通过</Button>
          <Button danger onClick={() => handleAudit(item, 3, 0)}>驳回</Button>
        </div>
      }
    }
  ];

  //根据传参更改状态
  const handleAudit = (item, auditState, publishState) => {
    setdataSource(dataSource.filter(data => data.id !== item.id)) //剔除
    axios.patch(`/news/${item.id}`, { //审核状态改为0
      auditState,
      publishState
    }).then(res => {
      notification.info({
        message: `通知`,
        description:
          `您可以到【审核管理/审核列表】中查看您的新闻的审核状态`,
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
