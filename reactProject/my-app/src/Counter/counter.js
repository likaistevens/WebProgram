import React, { Component, Fragment } from 'react';
import Child from './child';


class Counter extends Component {
	constructor(props) {
		super(props);
		this.handleBtnClick = this.handleBtnClick.bind(this);
		this.state = {
			counter: 1
		}
	}

	handleBtnClick() {
		// console.log(this.buttonElem.clientTop);   // 直接对这个dom进行一定操作 访问
		// console.log(this.childElem);   // ref放在子组件上 输出的就是这个子组件
		const newCounter = this.state.counter + 1;
		console.log(this.divElem.innerHTML);
		// setState是异步的。  会在所有同步操作之后执行
		// 所以虽然setstate修改了counter值，但是两个log输出的都是1
		this.setState({
			counter: newCounter
		})
		console.log(this.divElem.innerHTML);
		// 解决上述问题   setState传入两个函数，第一个函数返回state需要修改的部分组成的对象。第二个函数是一个回调函数，当前一个函数执行之后执行回调函数
		this.setState(() => {
			return {
				counter: newCounter
			}
		}, () => {
			console.log(this.divElem.innerHTML);
		})
		// 这种写法，传入一个函数，跟最开始的写法是一样的。
		this.setState(() => {
			return {
				counter: newCounter
			}
		})
	}
	render() {
		// 当组件初次创建的时候，render函数会被执行一次
		// 当state数据发生变更的时候,child也接受到了变化，子组件的render函数也会被重新执行
		// 当props数据发生变更的时候，render函数会被重新执行
		return (
			<Fragment>
				<button
					onClick={this.handleBtnClick}
					// ref里面一般传入一个函数，获取到button这个元素，然后传入this.buttonElem里面储存
					// 渲染的时候就把button传到this里存储了，然后当前组件的方法就可以对这个dom进行操作
					ref={(button) => {this.buttonElem = button}}
				>
					增加
				</button>
				<Child
					// ref放在子组件上
					ref={(child) => {this.childElem = child}}
					number={this.state.counter}
				/>
				<div
					ref={(div) => {this.divElem = div}}
				>
					{this.state.counter}
				</div>
			</Fragment>
		)
	}

}

export default Counter;