//引入axios
import axios from 'axios'
//引入react
import React, { useEffect, useState } from 'react'
import { PageHeader, Card, Col, Row, List } from 'antd';
//引入lodash
import _ from 'lodash'

export default function News() {

    //定义浏览数据
    const [list, setlist] = useState([])

    //获取发布新闻
    useEffect(() => {
        axios.get("/news?publishState=2&_expand=category").then(res => {
            setlist(Object.entries(_.groupBy(res.data, item => item.category.title)))
        })
    }, [])
    return (
        <div style={{
            width: "95%",
            margin: "0 auto"
        }}>
            <PageHeader
                className="site-page-header"
                title="全球大新闻"
                subTitle="查看新闻"
            />
            <div className="site-card-wrapper">
                <Row gutter={[16, 16]}>
                    {
                        list.map(item =>
                            <Col span={8} key={item[0]}>
                                <Card title={item[0]} bordered={true} hoverable={true}>
                                    <List
                                        size="small"
                                        dataSource={item[1]}
                                        pagination={{
                                            pageSize: 3
                                        }}
                                        renderItem={data => <List.Item><a href={`#/detail/${data.id}`}>{data.title}</a></List.Item>}
                                    />
                                </Card>
                            </Col>)
                    }
                </Row>
            </div>
        </div>
    )
}
