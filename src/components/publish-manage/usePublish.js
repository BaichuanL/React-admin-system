//引入react
import { useEffect, useState } from 'react'
//引入axios
import axios from 'axios'
//引入antd
import { notification } from 'antd';

function usePublish(type) {

    //解构
    const { username } = JSON.parse(localStorage.getItem("token"))
    const [dataSource, setdataSource] = useState([])

    //获取数据
    useEffect(() => {
        axios(`/news?author=${username}&publishState=${type}&_expand=category`).then(res => {
            setdataSource(res.data)
        })
    }, [username, type])

    //发布新闻
    const handlePublish = (id) => {
        setdataSource(dataSource.filter(item => item.id !== id))

        axios.patch(`/news/${id}`, { //发布状态改为2
            "publishState": 2,
            "publishTime": Date.now()
          }).then(res => { 
            //弹出提示框
            notification.info({
              message: `通知`,
              description:
                `您可以到【发布管理/已经发布】中查看您的新闻`,
              placement: "bottomRight",
            });
          })
    }

    //下线新闻
    const handleSunset = (id) => {
        setdataSource(dataSource.filter(item => item.id !== id))

        axios.patch(`/news/${id}`, { //发布状态改为2
            "publishState": 3,
          }).then(res => { 
            //弹出提示框
            notification.info({
              message: `通知`,
              description:
                `您可以到【发布管理/已下线】中查看您的新闻`,
              placement: "bottomRight",
            });
          })
    }

    //删除已下线
    const handleDelete = (id) => {
        setdataSource(dataSource.filter(item => item.id !== id))

        axios.delete(`/news/${id}`).then(res => { 
            //弹出提示框
            notification.info({
              message: `通知`,
              description:
                `您已经删除了已下线的新闻`,
              placement: "bottomRight",
            });
          })
    }

    return {
        dataSource,
        handlePublish,
        handleSunset,
        handleDelete
    }
}

export default usePublish