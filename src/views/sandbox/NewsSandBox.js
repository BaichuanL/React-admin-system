//引入react
import React, { useEffect } from 'react'
//引入nprogress
import NProgress from "nprogress"
import 'nprogress/nprogress.css'
//引入css
import './NewsSandBox.css'
//引入antd
import { Layout } from 'antd'
import SideMenu from '../../components/sandbox/SideMenu'
import TopHeader from '../../components/sandbox/TopHeader'
import NewsRouter from '../../components/sandbox/NewsRouter'

const { Content } = Layout;

export default function NewsSandBox() {
  
  //nprogress进度条
  NProgress.start()
  useEffect(()=>{
    NProgress.done()
  })

  return (
      <Layout>
        <SideMenu></SideMenu>
        <Layout className="site-layout">
          <TopHeader></TopHeader>

          <Content  className="site-layout-background" style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            overflow:"auto"
          }}>
            <NewsRouter></NewsRouter>
          </Content>
        </Layout>
      </Layout>
  )
}
