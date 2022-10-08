//引入react
import React from 'react'
//引入antd
import { Button } from 'antd'
//引入组件
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import usePublish from '../../../components/publish-manage/usePublish'

export default function Published() {

  const { dataSource, handleSunset } = usePublish(2) //2代表已发布

  return (
    <div>
      <NewsPublish dataSource={dataSource} button={(id) => <Button danger onClick={() => handleSunset(id)}>
        下线
      </Button>}></NewsPublish>
    </div>
  )
}
