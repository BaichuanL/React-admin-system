//引入react
import React, { useEffect, useState } from 'react'
//引入antd
import { Descriptions, PageHeader } from 'antd';
import { HeartTwoTone } from '@ant-design/icons';

//引入axios
import axios from 'axios';
//引入moment
import moment from 'moment';

export default function Detail(props) {

    //定义新闻信息
    const [newsInfo, setnewsInfo] = useState(null)
    //获取新闻信息
    useEffect(() => {
        axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`).then(res => {
            console.log(res.data.view)
            setnewsInfo({ //view+1
                ...res.data,
                view: res.data.view + 1
            })
            return res.data
        }).then(res => { // 同步后端
            axios.patch(`/news/${props.match.params.id}`, {
                view: res.view + 1
            })
        })
    }, [props.match.params.id])

    const handleStar = () => { //star+1
        setnewsInfo({
            ...newsInfo,
            star: newsInfo.star + 1
        })

        // 同步后端
        axios.patch(`/news/${props.match.params.id}`, {
            star: newsInfo.star + 1
        })
    }

    return (
        <div>
            {
                newsInfo &&
                <PageHeader
                    onBack={() => window.history.back()}
                    title={newsInfo.title}
                    subTitle={<div>
                        {newsInfo.category.title}
                        <HeartTwoTone twoToneColor="#eb2f96" onClick={() => handleStar()} />
                    </div>}
                >
                    <Descriptions size="small" column={3}>

                        <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>

                        <Descriptions.Item label="发布时间">{newsInfo.publishTime ? moment(newsInfo.createTime).format("YYYY/MM/DD HH:mm:ss") : "-"}</Descriptions.Item>

                        <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>

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
