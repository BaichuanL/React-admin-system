//引入react
import React from 'react'
//引入antd
import { Button } from 'antd'
//引入组件
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import usePublish from '../../../components/publish-manage/usePublish'

export default function Unpublished() {

  const { dataSource, handlePublish } = usePublish(1) //1代表待发布

  return (
    <div>
      <NewsPublish dataSource={dataSource} button={(id) => <Button type='primary' onClick={() => handlePublish(id)}>
        发布
      </Button>}></NewsPublish>
    </div>
  )
}
