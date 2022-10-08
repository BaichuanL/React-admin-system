//引入react
import React from 'react'
//引入antd
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
//引入粒子背景库
import ParticlesBg from 'particles-bg'
//引入css
import './Login.css'
//引入axios
import axios from 'axios'
export default function Login(props) {

  //点击提交后收集表单数据
  const onFinish = (values) => {
    axios.get(`/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`).then(
      res => { //获取用户数据
        if (res.data.length === 0) { //获取不到报错
          message.error("用户名或密码不匹配")
        } else { //存储token跳转页面
          localStorage.setItem("token", JSON.stringify(res.data[0]))
          props.history.push("/")
        }
      })
  }

  return (
    <div >
      <ParticlesBg type="circle" bg={true} />
      <div className='formContainer'>
        <div className='logintitle'>全球新闻发布管理系统</div>
        <Form
          name="normal_login"
          className="login-form"
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
