import React, { forwardRef, useEffect, useState } from 'react'
import { Form, Input, Select } from 'antd';

const { Option } = Select;

const UserForm = forwardRef((props, ref) => {

    const [isDisdble, setisDisdble] = useState(false)

    useEffect(() => {
        setisDisdble(props.isUpdateDisabled)
    }, [props.isUpdateDisabled])

    //从token中解析
    const { roleId, region } = JSON.parse(localStorage.getItem("token"))
    //替换roleId中的1，2，3
    const roleObj = {
        "1": "superadmin",
        "2": "admin",
        "3": "editor"
    }
    //区域权限判断
    const checkRegionDisabled = (item) => {
        if (props.isUpdate) {//更新用户判断
            if (roleObj[roleId] === "superadmin") {
                return false //superadmin开启权限
            } else {
                return true //关闭权限
            }
        } else {//添加用户判断
            if (roleObj[roleId] === "superadmin") {
                return false //superadmin开启权限
            } else {
                return item.value !== region //仅开启添加自己职位权限
            }
        }
    }

    //职位权限判断
    const checkRoleDisabled = (item) => {
        if (props.isUpdate) {//更新用户判断
            if (roleObj[roleId] === "superadmin") {
                return false //superadmin开启权限
            } else {
                return true //关闭权限
            }
        } else {//添加用户判断
            if (roleObj[roleId] === "superadmin") {
                return false //superadmin开启权限
            } else {
                return roleObj[item.id] !== "editor" //除editor开启添加自己区域权限
            }
        }
    }

    return (
        <Form ref={ref} layout="vertical">
            <Form.Item
                name="username"
                label="用户名"
                rules={[{ required: true, message: 'Please input the title of collection!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="password"
                label="密码"
                rules={[{ required: true, message: 'Please input the title of collection!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="region"
                label="区域"
                rules={isDisdble ? [] : [{ required: true, message: 'Please input the title of collection!' }]}
            >
                <Select disabled={isDisdble}>{
                    props.regionList.map(item =>
                        <Option value={item.value} key={item.id} disabled={checkRegionDisabled(item)}>{item.title}</Option>)
                }</Select>
            </Form.Item>
            <Form.Item
                name="roleId"
                label="角色"
                rules={[{ required: true, message: 'Please input the title of collection!' }]}
            >
                <Select onChange={(value) => {
                    if (value === 1) {
                        setisDisdble(true)
                        ref.current.setFieldsValue({
                            region: ""
                        })
                    } else {
                        setisDisdble(false)
                    }
                }}>{
                        props.roleList.map(item =>
                            <Option value={item.id} key={item.id} disabled={checkRoleDisabled(item)}>{item.roleName}</Option>)
                    }</Select>
            </Form.Item>
        </Form>
    )
})
export default UserForm