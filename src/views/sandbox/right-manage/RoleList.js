//引入react
import React, { useEffect, useState } from 'react'
//引入axios
import axios from 'axios'
//引入antd
import { Button, Table, Modal, Tree } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

//角色列表组件
export default function RoleList() {

  const [dataSource, setdataSource] = useState([])
  const [rightList, setrightList] = useState([])
  const [currentRights, setcurrentRights] = useState([])
  const [currentId, setcurrentId] = useState(0)
  const [isModalVisible, setisModalVisible] = useState(false)
  const { confirm } = Modal;

  //设置列表样式
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    }, {
      title: '角色名称',
      dataIndex: 'roleName',
    }, {
      title: '操作',
      render: (item) => {
        return <div>
          <Button danger shape='circle' icon={<DeleteOutlined />} onClick={() => showConfirm(item)} />
          <Button type='primary' shape='circle' icon={<EditOutlined onClick={() => {
            setisModalVisible(true)
            setcurrentRights(item.rights)
            setcurrentId(item.id)
          }} />} />
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
    axios.delete(`/roles/${item.id}`)
  }

  //路由获取roles数据
  useEffect(() => {
    axios.get("/roles").then(res => {
      setdataSource(res.data)
    })
  }, [])

  //路由获取rights下的children数据
  useEffect(() => {
    axios.get("/rights?_embed=children").then(res => {
      setrightList(res.data)
    })
  }, [])

  //操作中ok按键函数
  const handleOk = () => {
    //隐藏弹出框
    setisModalVisible(false)

    setdataSource(dataSource.map(item => {
      if (item.id === currentId) {
        return {
          ...item,
          rights: currentRights
        }
      }
      return item
    }))
    axios.patch(`/roles/${currentId}`, {
      rights: currentRights
    })
  }

  //关闭弹出框
  const handleCancel = () => {
    setisModalVisible(false)
  }

  //
  const onCheck = (checkKeys) => {
    setcurrentRights(checkKeys.checked)
  }

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id}></Table>

      <Modal title="权限分配" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Tree
          checkable
          checkedKeys={currentRights}
          onCheck={onCheck}
          checkStrictly={true}
          treeData={rightList}
        />
      </Modal>
    </div>
  )
}
