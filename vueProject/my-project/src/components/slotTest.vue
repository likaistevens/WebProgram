<template>
  <div>
    <h1>Slot Test</h1>
    <slot>
<!--      页面插槽标签里的内容会放到这里-->
    </slot>

    <p>Bottom</p>
    <slot name="bottomSlot">
<!--      插槽加入name属性，可以指定插入哪个插槽-->
    </slot>
  </div>
</template>

