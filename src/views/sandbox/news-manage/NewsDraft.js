//引入react
import React, { useEffect, useState, notification } from 'react'
//引入axios
import axios from 'axios'
//引入antd
import { Button, Table, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons';

const { confirm } = Modal;

//权限列表组件
export default function NewsDraft(props) {

  //接收后端数据动态生成列表
  const [dataSource, setdataSource] = useState([])
  //解构
  const { username } = JSON.parse(localStorage.getItem("token"))
  //获取草稿
  useEffect(() => {
    axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(res => {
      const list = res.data
      setdataSource(list)
    })
  }, [username])

  //设置列表样式
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
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
      title: '分类',
      dataIndex: 'category',
      render: (category) => {
        return category.title
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>

          <Button danger shape='circle' icon={<DeleteOutlined />} onClick={() => showConfirm(item)} />

          <Button shape='circle' icon={<EditOutlined />}
            onClick={
              () => {
                props.history.push(`/news-manage/update/${item.id}`)
              }
            } />

          <Button type='primary' shape='circle' icon={<UploadOutlined />} onClick={() => handleCheck(item.id)} />
        </div>
      }
    }
  ]

  //更改auditState: 1将新闻传入审核
  const handleCheck = (id) => {
    axios.patch(`/news/${id}`, {
      auditState: 1
    }).then(res => { //添加文本到后台
      props.history.push('/audit-manage/list')

      //弹出提示框
      notification.info({
          message: `通知`,
          description:
              `您可以到审核列表中查看您的新闻`,
          placement: "bottomRight",
      });
  })
  }

  //showConfirm方法：删除按钮弹出框提示
  const showConfirm = (item) => {
    confirm({
      title: 'Do you Want to delete these items?',
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      onOk() {
        deteleMethod(item)
      },
      onCancel() {
      },
    });
  }

  //deteleMethod方法：动态删除后端数据
  const deteleMethod = (item) => {
    //当前页面同步状态 + 后端同步
    setdataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`/news/${item.id}`)
  }

  return (
    //列表渲染
    <Table dataSource={dataSource} columns={columns} pagination={{
      pageSize: 6
    }}
      rowKey={item => item.id}
    />
  )
}
