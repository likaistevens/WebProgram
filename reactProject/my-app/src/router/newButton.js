// eslint-disable-next-line
import React, {Component, Fragment} from 'react';
import { Button } from 'antd';
// link 是用来在路由器之间进行跳转
import { Link } from 'react-router-dom';


class newButton extends Component {

    render() {
        return (
            <div>
                {/*<Link to='/list'>*/}
                {/*可以通过link带参数到下一个页面  但是这样传参数拿到的是 ?123  需要自己再去手动处理*/}
                <Link to='/list?a=123'>
                    <Button type='primary'>按钮(?a=123)</Button>
                </Link>
                <Link to='/list/a=123'>
                    <Button type='primary'>按钮(/a=123)</Button>
                </Link>
            </div>

        )
    }

}

export default newButton;