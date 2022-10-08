//引入react
import React, { useEffect, useState } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
//引入axios
import axios from 'axios'
//引入组件
import Home from '../../views/sandbox/home/Home'
import UserList from '../../views/sandbox/user-manage/UserList'
import RoleList from '../../views/sandbox/right-manage/RoleList'
import RightList from '../../views/sandbox/right-manage/RightList'
import NoPermission from '../../views/sandbox/nopermission/NoPermission'
import NewsAdd from '../../views/sandbox/news-manage/NewsAdd'
import NewsDraft from '../../views/sandbox/news-manage/NewsDraft'
import NewsCategory from '../../views/sandbox/news-manage/NewsCategory'
import Audit from '../../views/sandbox/audit-manage/Audit'
import AuditList from '../../views/sandbox/audit-manage/AuditList'
import Unpublished from '../../views/sandbox/publish-manage/Unpublished'
import Published from '../../views/sandbox/publish-manage/Published'
import Sunset from '../../views/sandbox/publish-manage/Sunset'
import NewsPreview from '../../views/sandbox/news-manage/NewsPreview'
import NewsUpdate from '../../views/sandbox/news-manage/NewsUpdate'


//路由数组
const LocalRouterMap = {
    "/home": Home,
    "/user-manage/list": UserList,
    "/right-manage/role/list": RoleList,
    "/right-manage/right/list": RightList,
    "/news-manage/add": NewsAdd,
    "/news-manage/draft": NewsDraft,
    "/news-manage/category": NewsCategory,
    "/news-manage/preview/:id": NewsPreview,
    "/news-manage/update/:id": NewsUpdate,
    "/audit-manage/audit": Audit,
    "/audit-manage/list": AuditList,
    "/publish-manage/unpublished": Unpublished,
    "/publish-manage/published": Published,
    "/publish-manage/sunset": Sunset,
}

function NewsRouter(props) {

    //路由列表
    const [BackRouteList, setBackRouteList] = useState([])
    //接收两个列表合成一个
    useEffect(() => {
        Promise.all([
            axios.get("/rights"),
            axios.get("/children"),
        ]).then(res => {
            setBackRouteList([...res[0].data, ...res[1].data]) //拼接
        })
    })

    //从token中结构
    const { role: { rights } } = JSON.parse(localStorage.getItem("token"))

    const checkRoute = (item) => {
        return LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson) //判断有没有key和权限
    }

    const checkUserPermission = (item) => {
        return rights.includes(item.key) //判断token中是否有key
    }

    return (

        /* 创建路由 */
        <Switch>
            {
                BackRouteList.map(item => { //遍历合成列表判断token和后台是否有权限访问
                    if (checkRoute(item) && checkUserPermission(item)) {//item.key为路径
                        return <Route path={item.key} key={item.key} component={LocalRouterMap[item.key]} exact></Route>
                    }
                    return null
                }

                )
            }

            <Redirect from="/" to="/home" exact />
            {
                BackRouteList.length > 0 && <Route path="*" component={NoPermission} />
            }
        </Switch>
    )
}



export default NewsRouter