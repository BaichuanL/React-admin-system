//引入react
import React from 'react'
//引入antd
import { Button } from 'antd'
//引入组件
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import usePublish from '../../../components/publish-manage/usePublish'

export default function Sunset() {

  const { dataSource, handleDelete } = usePublish(3) //3代表已下线

  return (
    <div>
      <NewsPublish dataSource={dataSource} button={(id) => <Button danger onClick={() => handleDelete(id)}>
        删除
      </Button>}></NewsPublish>
    </div>
  )
}