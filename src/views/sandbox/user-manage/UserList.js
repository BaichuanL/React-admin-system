//引入react
import React, { useEffect, useRef, useState } from 'react'
//引入axios
import axios from 'axios'
//引入antd
import { Button, Table, Switch, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import UserForm from '../../../components/user-manage/UserForm';

const { confirm } = Modal;

//权限列表组件
export default function UserList() {

  const [dataSource, setdataSource] = useState([])
  const [isAddOpen, setisAddOpen] = useState(false)
  const [isUpdateOpen, setisUpdateOpen] = useState(false)
  const [roleList, setroleList] = useState([])
  const [regionList, setregionList] = useState([])
  const [isUpdateDisabled, setisUpdateDisabled] = useState(false)
  const [current, setcurrent] = useState(null)
  const addForm = useRef(null)
  const updateForm = useRef(null)
  //从token中解析
  const { roleId, region, username } = JSON.parse(localStorage.getItem("token"))
  //接收后端数据动态生成列表
  useEffect(() => {
    //替换roleId中的1，2，3
    const roleObj = {
      "1": "superadmin",
      "2": "admin",
      "3": "editor"
    }
    axios.get("/users?_expand=role").then(res => {
      const list = res.data
      //判断权限
      setdataSource(roleObj[roleId] === "superadmin" ? list : [
        ...list.filter(item => item.username === username),
        ...list.filter(item => item.region === region && roleObj[item.roleId] === "editor")
      ])
    })
  }, [roleId, region, username])

  useEffect(() => {
    axios.get("/roles").then(res => {
      const list = res.data
      setroleList(list)
    })
  }, [])

  useEffect(() => {
    axios.get("/regions").then(res => {
      const list = res.data
      setregionList(list)
    })
  }, [])

  //设置列表样式
  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      filters: [
        ...regionList.map(item => ({ //regionList不是数组遍历需要展开
          text: item.title,
          value: item.value
        })), {
          text: "全球",
          value: "全球"
        }
      ],

      onFilter: (value, item) => {
        if (value === "全球") {
          return item.region === ""
        }
        return item.region === value
      },

      render: (region) => {
        return <b>{region === "" ? '全球' : region}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role) => {
        return role.roleName
      }
    },
    {
      title: '用户名',
      dataIndex: 'username',
    }, {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, item) => {
        return <Switch checked={roleState} disabled={item.default} onChange={() => handleChange(item)}></Switch>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button danger shape='circle' icon={<DeleteOutlined />} onClick={() => showConfirm(item)} disabled={item.default} />

          <Button type='primary' shape='circle' icon={<EditOutlined />} disabled={item.default} onClick={() => handleUpdate(item)} />
        </div>
      }
    }
  ]

  //弹出更新提示框
  const handleUpdate = (item) => {
    setTimeout(() => {
      setisUpdateOpen(true)
      if (item.roleId === 1) {
        //禁用
        setisUpdateDisabled(true)
      } else {
        //取消禁用
        setisUpdateDisabled(false)
      }
      updateForm.current.setFieldsValue(item)
    }, 0)
    setcurrent(item)
  }

  //用户状态点击后后台取反更新
  const handleChange = (item) => {
    item.roleState = !item.roleState
    setdataSource([...dataSource])
    axios.patch(`/users/${item.id}`, {
      roleState: item.roleState
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
    setdataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`/users/${item.id}`)
  }

  const addFormOk = () => {
    addForm.current.validateFields().then(value => {
      setisAddOpen(false)
      addForm.current.setFieldValue()
      //post到后端，生产id，在设置 datasource，方便后面删除和更新
      axios.post(`/users`, {
        ...value,
        "roleState": true,
        "default": false,
      }).then(res => {
        setdataSource([...dataSource, {
          ...res.data,
          role: roleList.filter(item => item.id === value.roleId)[0]
        }])
      })
    }).catch(err => {
      console.log(err)
    })
  }

  //点击ok后根据内容更新
  const updateFormOk = () => {
    updateForm.current.validateFields().then(value => {
      setisUpdateOpen(false)

      setdataSource(dataSource.map(item => {
        if (item.id === current.id) {
          return {
            ...item,
            ...value,
            role: roleList.filter(data => data.id === value.roleId)[0]
          }
        }
        return item
      }))
      setisUpdateDisabled(!setisUpdateDisabled)

      axios.patch(`/users/${current.id}`, value)
    })
  }

  return (
    //列表渲染
    <div>
      <Button type='primary' onClick={() => {
        setisAddOpen(true)
      }}>添加用户</Button>
      <Table dataSource={dataSource} columns={columns}
        pagination={{
          pageSize: 6
        }}
        rowKey={item => item.id} />

      <Modal
        open={isAddOpen}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          setisAddOpen(false)
        }}
        onOk={() => addFormOk()}
      >
        <UserForm regionList={regionList} roleList={roleList} ref={addForm}></UserForm>
      </Modal>

      <Modal
        open={isUpdateOpen}
        title="更新用户"
        okText="更新"
        cancelText="取消"
        onCancel={() => {
          setisUpdateOpen(false)
          setisUpdateDisabled(!isUpdateDisabled)
        }}
        onOk={() => updateFormOk()}
      >
        <UserForm regionList={regionList} roleList={roleList} ref={updateForm} isUpdateDisabled={isUpdateDisabled} isUpdate={true}></UserForm>
      </Modal>
    </div>
  )
}
