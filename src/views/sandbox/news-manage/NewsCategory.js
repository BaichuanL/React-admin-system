//引入react
import React, { useEffect, useState } from 'react'
//引入axios
import axios from 'axios'
//引入antd
import { Button, Table, Modal } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;

//权限列表组件
export default function NewsCategory() {

  //接收后端数据动态生成列表
  const [dataSource, setdataSource] = useState([])
  useEffect(() => {
    axios.get("/categories").then(res => {
      setdataSource(res.data)
    })
  }, [])

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
      title: '栏目名称',
      dataIndex: 'title',
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button danger shape='circle' icon={<DeleteOutlined />} onClick={() => showConfirm(item)} />
        </div>
      }
    }
  ]

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
    axios.delete(`/categories/${item.id}`)

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
