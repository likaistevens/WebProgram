// eslint-disable-next-line
import React, { Component, Fragment } from 'react';
import axios from 'axios'

class Counter2 extends Component {

    handleClick(){
        console.log('window click')
    }
    // 组件挂载的时候就给window绑定个事件
    componentWillMount() {
        window.addEventListener('click',this.handleClick);
    }

    render() {
        return (
            <div onClick={this.handleClick.bind(this) }>
                hello world
            </div>
        )
    }
    // 组件移除的时候，该绑定事件也需要取消
    componentWillUnmount() {
        window.removeEventListener('click', this.handleClick);
    }

    // 利用axios发送ajax请求  最后是在这个周期函数中
    componentDidMount() {
        // axios返回的是一个promise对象，相当于返回请求的过程
        const promise = axios.get('http://www.dell-lee.com/react/api/demo.json');
        // 如果请求成功 执行then的时候，会自动把获取到的数据传入函数。 即下面的res
        promise.then((res) => {
            console.log(res);
        })
    }
}

export default Counter2;