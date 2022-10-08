//引入react
import React, { useEffect, useState } from 'react'
//引入antd
import { Descriptions, PageHeader } from 'antd';
//引入axios
import axios from 'axios';
//引入moment
import moment from 'moment';

export default function NewsPreview(props) {

  //定义新闻信息
  const [newsInfo, setnewsInfo] = useState(null)
  //获取新闻信息
  useEffect(() => {
    axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`).then(res => {
      setnewsInfo(res.data)
    })
  }, [props.match.params.id])

  //定义审核状态和发布状态
  const auditList = ["未审核", "审核中", "已通过", "未通过"]
  const publishList = ["未发布", "待发布", "已上线", "已下线"]
  const colorList = ["black", "orange", "green", "red"]
  
  return (
    <div>
      {
        newsInfo &&
        <PageHeader
          onBack={() => window.history.back()}
          title={newsInfo.title}
          subTitle={newsInfo.category.title}
        >
          <Descriptions size="small" column={3}>

            <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>

            <Descriptions.Item label="创建时间">{moment(newsInfo.createTime).format("YYYY/MM/DD HH:mm:ss")}</Descriptions.Item>

            <Descriptions.Item label="发布时间">{newsInfo.publishTime ? moment(newsInfo.createTime).format("YYYY/MM/DD HH:mm:ss") : "-"}</Descriptions.Item>

            <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>

            <Descriptions.Item label="审核状态"><span style={{ color: colorList[newsInfo.auditState] }}>{auditList[newsInfo.auditState]}</span></Descriptions.Item>

            <Descriptions.Item label="发布状态"><span style={{ color: colorList[newsInfo.publishState] }}>{publishList[newsInfo.publishState]}</span></Descriptions.Item>

            <Descriptions.Item label="访问数量">{newsInfo.view}</Descriptions.Item>

            <Descriptions.Item label="点赞数量">{newsInfo.star}</Descriptions.Item>

            <Descriptions.Item label="评论数量">0</Descriptions.Item>
          </Descriptions>
        </PageHeader>
      }
      {/* 去html显示文本 */}
      <div dangerouslySetInnerHTML={{ __html: newsInfo?.content }} style={{
        margin: "24px",
        border: "1px solid gray"
      }}></div>
    </div>
  )
}
