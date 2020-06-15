import Vue from 'vue';

Vue.directive('dialogDrag', { //属性名称dialogDrag，前面加v- 使用
  bind(el, binding, vnode, oldVnode) {
 	const dialogHeaderEl = el.querySelector('.el-dialog__header');
    const dragDom = el.querySelector('.el-dialog');
    dialogHeaderEl.style="cursor:move;"

    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
    const sty = dragDom.parentNode.currentStyle || window.getComputedStyle(dragDom.parentNode, null);

    dialogHeaderEl.onmousedown = (e) => {
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX - dialogHeaderEl.offsetLeft
      const disY = e.clientY - dialogHeaderEl.offsetTop

      // 获取到的值带px 正则匹配替换
      let styL, styT
      // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
      if (sty.left.includes('%')) {
        styL = +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100)
        styT = +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100)
      } else {
        styL = +sty.left.replace(/\px/g, '')
        styT = +sty.top.replace(/\px/g, '')
      }
      
      document.onmousemove = function(e) {
        // 通过事件委托，计算移动的距离
        var l = e.clientX - disX+styL
        var t = e.clientY - disY+ styT
        // 条件限制
      	if ( l < 375 ) {
          l = 375;
        }
        if ( t < 40 ) {
          t = 40;
        }
        dragDom.parentNode.style.left = `${l}px`;
        dragDom.parentNode.style.top = `${t}px`;
      }

      document.onmouseup = function(e) {
        document.onmousemove = null
        document.onmouseup = null
      }
      return false;
    }
  }
})