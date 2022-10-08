//引入react
import React from 'react'
//引入antd
import { Table } from 'antd';

//权限列表组件
export default function NewsPublish(props) {

    //设置列表样式
    const columns = [
        {
            title: '新闻标题',
            dataIndex: 'title',
            render: (title,item) => {
                return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
            }
        },
        {
            title: '作者',
            dataIndex: 'author',
        },
        {
            title: '新闻分类',
            dataIndex: 'category',
            render: (category) => {
                return <div>{category.title}</div>
            }
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    {props.button(item.id)}
                </div>
            }
        }
    ]

    return (
        //列表渲染
        <Table dataSource={props.dataSource} columns={columns} pagination={{
            pageSize: 5
        }}
            rowKey={item => item.id}
        />
    )
}
