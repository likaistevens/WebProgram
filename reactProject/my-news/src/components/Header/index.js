import React, {Component, Fragment} from 'react';
// import ReactDOM from 'react-dom';
// import 'antd/dist/antd.css'
import './style.css'
// 这个logo其实是图片地址
import logo from './logo.png'

import { Menu } from 'antd';
import { MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';

const { SubMenu } = Menu;

class AppHeader extends Component{
    render() {
        return (
            <Fragment>
                <img src={ logo } alt="" className='app-header-logo'/>
                <Menu
                    mode="horizontal"
                    className='app-header-menu'
                >
                    <Menu.Item key="mail" icon={<MailOutlined />}>
                        Navigation One
                    </Menu.Item>
                    <Menu.Item key="app" disabled icon={<AppstoreOutlined />}>
                        Navigation Two
                    </Menu.Item>
                    <Menu.Item key="alipay">
                        <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
                            Navigation Four - Link
                        </a>
                    </Menu.Item>
                </Menu>
            </Fragment>
        )
    }
}

export default AppHeader;
