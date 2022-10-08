//引入react
import React from 'react'
import { withRouter } from 'react-router-dom';
//引入antd
import { Layout, Menu, Dropdown, Avatar } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@ant-design/icons';
//引入redux
import { connect } from 'react-redux';

const { Header } = Layout;

function TopHeader(props) {

  const changeCollapesd = () => {
    //改变state的isCollapsed
    props.changeCollapesd()
  }

  const { role: { roleName }, username } = JSON.parse(localStorage.getItem("token"))

  //点击用户头像后的菜单
  const menu = (
    <Menu>
      <Menu.Item>{roleName}</Menu.Item>
      <Menu.Item danger onClick={() => {
        localStorage.removeItem("token") //删除token
        props.history.replace("/login") //跳转到login
      }}>退出</Menu.Item>
    </Menu>
  )

  return (
    <Header className="site-layout-background" style={{ padding: '0 16px' }}>
      {
        props.isCollapsed ? <MenuUnfoldOutlined onClick={changeCollapesd} /> : <MenuFoldOutlined onClick={changeCollapesd} />
      }

      <div style={{ float: "right" }}>
        <span>欢迎<span style={{ color: "#1890ff" }}> {username} </span>回来</span>
        <Dropdown overlay={menu}>
          <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  )
}

//传递isCollapsed状态
const mapStateToProps = ({ CollapsedReducer: { isCollapsed } }) => {
  return {
    isCollapsed
  }
}
//传递type
const mapDispatchToProps = {
  changeCollapesd() {
    return {
      type: "change_collapsed"
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TopHeader))