import React , { Component, Fragment } from 'react';
import './TodoList.css'
import TodoItem from './TodoItem'

class TodoList extends Component{

    // 固定写法   组件创建的第一时刻被执行
    constructor(props) {
        super(props);

        // bind(this)是函数每次执行的时候，重写一次函数，然后改变其this指向。如果放在绑定事件里面写，则每次触发都会重新生成一次函数
        // 放在constructor里面，组件创建的时候，运行一次重写这个函数
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleItemClick = this.handleItemClick.bind(this);

        // this.state也是固定的   数据存储在state中
        this.state = {
            inputValue: '',
            // React响应式   数据发生变化会自动渲染到页面上
            list: [],
        }
    }

    handleInputChange(e){
        // console.log(e.target);   // input 组件
        // console.log(e.target.value);
        // this.state.inputValue = e.target.value;   // 不能直接这样赋值，需要用setState()
        this.setState({
            inputValue: e.target.value,
        })
    }

    handleKeyUp(e){
        // console.log(e.keyCode);
        if(e.keyCode === 13 && e.target.value !== ''){    // 按下的是回车键
            // this.state.inputValue
            const list = [...this.state.list, this.state.inputValue];   // 利用数组解构，先复制list，然后加入input里的内容
            this.setState({
                list,    // 两个变量名一样，可以直接这样写
                // list: list,
                inputValue: '',   // 按下回车，input里内容加入list后，input清空
            })
        }
    }

    // 由bind传递出来的index
    handleItemClick(index){
        const list = [...this.state.list];
        // 从list的index位开始，删除一个
        list.splice(index, 1);
        this.setState({
            list,
        })
    }

    getListItems(){
        return this.state.list.map( (value, index) => {
            return (
                <TodoItem
                    content={value}
                    key={index}
                    index={index}
                    // 除了可以把参数传递给子组件，还可以吧方法传递给子组件
                    deleteFunction={this.handleItemClick}
                />
                // // return 后面用括号把整个括起来，就可以分多行写代码，不然会报错
                // // map这个方法循环之后的最后结果需要return出去
                // // 循环输出的每一项都需要一个唯一的key值，通常index是唯一的，就把index设置为key
                // <li
                //     key={index}
                //     // 这里的bind(this)没法移到上面，确实需要每次点击的时候重新生成，带出当前的index
                //     onClick={this.handleItemClick.bind(this, index)}     // bind绑定参数的时候，可以传入参数，把参数带出去
                //     // 危险的去输出后面的内容， 这样可以达到不进行转义就输出html标签想表示的内容的效果  <h1>Test</h1>  会输出一个大的Test， 正常文本也不会受到影响
                //     dangerouslySetInnerHTML={{__html: value}}
                // >
                //     {/*为了能不转义地输出html标签，不在此处输入value*/}
                //     {/*{ value }*/}
                // </li>
            )
        })
    }

    render() {
        return (
            <Fragment>
                 {/*label标签具有for属性。规定 label 与哪个表单元素绑定。 react里for表示循环，所以这里要用htmlFor*/}
                <label htmlFor='myinput'>请输入内容:</label>
                <input
                    id='myinput'
                    // react给标签加class必须是用className
                    className='input'
                    // 绑定变量，后面变量需要花括号括起来
                    value={this.state.inputValue}
                    // 这里用到了es6的bind，handleInputChange这个函数内的this是undefined，但是我们需要让函数里面的this是todolist这个组件，
                    // 也就是render()这个函数的this。  所以，直接对这个函数bind(this)
                    // onChange={this.handleInputChange.bind(this)}
                    // 优化  bind(this)移到constructor里面
                    onChange={this.handleInputChange}
                    onKeyUp={this.handleKeyUp}
                />

                <ul>
                    { this.getListItems() }
                </ul>
            </Fragment>
        );
    };
}

export default TodoList;