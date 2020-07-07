import React, { Component } from "react";

class TodoItem extends Component{
    constructor(props) {
        super(props);
        this.handleItemClick = this.handleItemClick.bind(this);
    }

    handleItemClick(){
        // console.log(this);   // TodoItem这个组件
        // 执行从父组件传来的方法，并将父组件传来的index作为参数传入函数中
        // 注意一点，需要在父组件中强行将handleItemClick的this绑定为TodoList，不然这里this指向的是TodoItem
        // this.props.deleteFunction(this.props.index);
        const { deleteFunction , index } = this.props;   // 跟上述一样，做了个解构赋值
        deleteFunction(index);
    }

    render() {
        // 接收父组件传来的值
        const { content } = this.props;
        // const content = this.props.content;
        return (
            // <li>{ this.props.content }</li>
            <li onClick={this.handleItemClick}>{ content }</li>
        );
    };
}

export default TodoItem;