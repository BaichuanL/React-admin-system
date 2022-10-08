//引入react
import React, { useEffect, useState, useRef } from 'react'
//引入antd
import { Button, PageHeader, Steps, Form, Input, Select, message, notification } from 'antd';
//引入axios
import axios from 'axios';
//引入css
import style from './News.module.css'
//引入组件
import NewsEditor from '../../../components/news-manage/NewsEditor';

const { Step } = Steps;
const { Option } = Select;

export default function NewsAdd(props) {

  //定义步骤条步数
  const [current, setCurrent] = useState(0)
  //定义新闻分类
  const [categoryList, setCategoryList] = useState([])
  //定义收集表单信息
  const [formInfo, setFormInfo] = useState({})
  const [content, setContent] = useState("")

  //解构
  const User = JSON.parse(localStorage.getItem("token"))

  //点击下一步
  const handleNext = () => {
    if (current === 0) {
      NewsForm.current.validateFields().then(res => { //进行表单验证后下一步
        setFormInfo(res) //获取表单信息
        setCurrent(current + 1) //下一步
      }).catch(error => {
        console.log(error)
      })
    } else {
      if (content === "" || content.trim() === "<p></p>") { //不能为空
        message.error("新闻内容不能为空")
      } else {
        setCurrent(current + 1) //下一步
      }
    }
  }

  //点击上一步
  const handlePrevious = () => {
    setCurrent(current - 1)
  }

  const NewsForm = useRef(null)

  //获取新闻分类数据
  useEffect(() => {
    axios.get("/categories").then(res => {
      setCategoryList(res.data)
    })
  }, [])

  //获取文本信息并跳转
  const handleSave = (auditState) => {
    axios.post('/news', {
      ...formInfo,
      "content": content,
      "region": User.region ? User.region : "全球",
      "author": User.username,
      "roleId": User.roleId,
      "auditState": auditState,
      "publishState": 0,
      "createTime": Date.now(),
      "star": 0,
      "view": 0,
      // "publishTime": 0,
    }).then(res => { //添加文本到后台
      props.history.push(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list')

      //弹出提示框
      notification.info({
        message: `通知`,
        description:
          `您可以到${auditState === 0 ? '草稿箱' : '审核列表'}中查看您的新闻`,
        placement: "bottomRight",
      });
    })
  }

  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="撰写新闻"
        subTitle="This is a subtitle"
      />

      <Steps current={current}>
        <Step title="基本信息" description="新闻标题，新闻分类" />
        <Step title="新闻内容" description="新闻主体内容" />
        <Step title="新闻提交" description="保存草稿或者提交审核" />
      </Steps>

      <div style={{ marginTop: "50px" }}>
        {/* 第一页 */}
        <div className={current === 0 ? '' : style.active}>
          <Form
            name="basic"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            ref={NewsForm}
          >
            <Form.Item
              label="新闻标题"
              name="title"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="新闻分类"
              name="categoryId"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Select>
                {//动态创建新闻分类下拉栏
                  categoryList.map(item =>
                    <Option vlue={item.id} key={item.id}>{item.title}</Option>
                  )
                }
              </Select>
            </Form.Item>

          </Form>
        </div>

        {/* 第二页 */}
        <div className={current === 1 ? '' : style.active}>
          <NewsEditor getContent={(value) => {
            setContent(value)
          }}></NewsEditor></div>

        {/* 第三页 */}
        <div className={current === 2 ? '' : style.active}>3333333</div>
      </div>

      <div style={{ marginTop: "50px" }}>
        {//第二步
          current === 2 && <span>
            <Button type='primary' onClick={() => handleSave(0)}>保存草稿箱</Button>
            <Button danger onClick={() => handleSave(1)}>提交审核</Button>
          </span>
        }
        {//小于第二步显示
          current < 2 && <Button type='primary' onClick={handleNext}>下一步</Button>
        }
        {//大于第零步显示
          current > 0 && <Button onClick={handlePrevious}>上一步</Button>
        }
      </div>
    </div>
  )
}
