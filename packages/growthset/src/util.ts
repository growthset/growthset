
const util = {
 // https://stackoverflow.com/questions/5601659/how-do-you-calculate-the-page-position-of-a-dom-element-when-the-body-can-be-rel/5625718
 offset: function(elem: any) {
    var obj = elem.getBoundingClientRect();
    return {
      left: obj.left + document.body.scrollLeft,
      top: obj.top + document.body.scrollTop,
      width: obj.width,
      height: obj.height
    };
  },

  
};

export default util;