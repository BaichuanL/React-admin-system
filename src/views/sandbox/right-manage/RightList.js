//引入react
import React, { useEffect, useState } from 'react'
//引入axios
import axios from 'axios'
//引入antd
import { Button, Table, Tag, Popover, Switch, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;

//权限列表组件
export default function RightList() {

  //接收后端数据动态生成列表
  const [dataSource, setdataSource] = useState([])
  useEffect(() => {
    axios.get("/rights?_embed=children").then(res => {
      const list = res.data
      list.forEach(item => {
        if (item.children.length === 0) {
          item.children = ""
        }
      })
      setdataSource(list)
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
      title: '权限名称',
      dataIndex: 'title',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render: (key) => {
        return <Tag color='orange'>{key}</Tag>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button danger shape='circle' icon={<DeleteOutlined />} onClick={() => showConfirm(item)} />

          <Popover content={<div style={{ textAlign: "center" }}>

            <Switch checked={item.pagepermisson} onChange={() => switchMethod(item)} ></Switch>

          </div>} title="页面配置项" trigger={item.pagepermisson === undefined ? '' : 'click'}>
            <Button type='primary' shape='circle' icon={<EditOutlined />} disabled={item.pagepermisson === undefined} />
          </Popover>
        </div>
      }
    }
  ]

  //switchMethod方法：改变权限
  const switchMethod = (item) => {
    item.pagepermisson = item.pagepermisson === 1 ? 0 : 1
    setdataSource([...dataSource])

    if (item.grade === 1) {
      axios.patch(`/rights/${item.id}`, {
        pagepermisson: item.pagepermisson
      })
    } else {
      axios.patch(`/children/${item.id}`, {
        pagepermisson: item.pagepermisson
      })
    }
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
    if (item.grade === 1) {
      setdataSource(dataSource.filter(data => data.id !== item.id))
      axios.delete(`/rights/${item.id}`)
    } else {
      let list = dataSource.filter(data => data.id === item.rightId)
      list[0].children = list[0].children.filter(data => data.id !== item.id)
      setdataSource([...dataSource])
      axios.delete(`/children/${item.id}`)
    }
  }

  return (
    //列表渲染
    <Table dataSource={dataSource} columns={columns} pagination={{
      pageSize: 6
    }} />
  )
}
