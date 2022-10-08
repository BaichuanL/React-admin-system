//引入react
import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom';
//引入CSS
import './index.css'
//引入antd
import { Layout, Menu } from 'antd';
import {
  HomeOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
  GlobalOutlined,
  SolutionOutlined,
  SendOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import SubMenu from 'antd/lib/menu/SubMenu';
//引入axios
import axios from 'axios'
import { connect } from 'react-redux';

const { Sider } = Layout;
//创建侧边栏图标数组
const iconList = {
  "/home": <HomeOutlined />,
  "/user-manage": <UserOutlined />,
  "/right-manage": <SafetyCertificateOutlined />,
  "/news-manage": <GlobalOutlined />,
  "/audit-manage": <SolutionOutlined />,
  "/publish-manage": <SendOutlined />,
  "/user-manage/list": <CalendarOutlined />,
  "/right-manage/role/list": <CalendarOutlined />,
  "/right-manage/right/list": <CalendarOutlined />,
  "/news-manage/add": <CalendarOutlined />,
  "/news-manage/draft": <CalendarOutlined />,
  "/news-manage/category": <CalendarOutlined />,
  "/audit-manage/audit": <CalendarOutlined />,
  "/audit-manage/list": <CalendarOutlined />,
  "/publish-manage/unpublished": <CalendarOutlined />,
  "/publish-manage/published": <CalendarOutlined />,
  "/publish-manage/sunset": <CalendarOutlined />,
}
//侧边栏函数组件
function SideMenu(props) {
  const [menu, setMenu] = useState([])
  useEffect(() => {
    axios.get("/rights?_embed=children").then(res => {
      setMenu(res.data)
    })
  }, [])

  //从token中结构
  const { role: { rights } } = JSON.parse(localStorage.getItem("token"))

  //侧边栏展开
  const checkPagePermission = (item) => {
    return item.pagepermisson && rights.includes(item.key) //展示pagepermisson和rights中key
  }
  //动态创建侧边栏
  const renderMenu = (menuList) => {
    return menuList.map(item => {
      if (item.children?.length > 0 && checkPagePermission(item)) {
        return <SubMenu key={item.key} icon={iconList[item.key]} title={item.title}>
          {renderMenu(item.children)}
        </SubMenu>
      }
      if (checkPagePermission(item)) {
        return <Menu.Item key={item.key} icon={iconList[item.key]} onClick={() => {
          props.history.push(item.key)
        }}>{item.title}</Menu.Item>
      } else {
        return null
      }
    })
  }
  //设置默认侧边栏高亮
  const selectKeys = [props.location.pathname]
  const openKeys = ["/" + props.location.pathname.split("/")[1]]
  //侧边栏主题样式
  return (
    <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
      <div style={{ display: "flex", height: "100%", "flexDirection": "column" }}>
        <div className="logo" >全球新闻发布管理系统</div>
        <div style={{ flex: 1, "overflow": "auto" }}>
          <Menu theme="dark" mode="inline" selectedKeys={selectKeys} defaultOpenKeys={openKeys}>
            {renderMenu(menu)}
          </Menu>
        </div>
      </div>
    </Sider>
  )
}

//传递isCollapsed状态
const mapStateToProps = ({ CollapsedReducer: { isCollapsed } }) => ({
  isCollapsed
})

export default connect(mapStateToProps)(withRouter(SideMenu))