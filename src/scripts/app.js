'use strict';

var App = App || {};

App = (function(me){

  me.init = function() {
    Object.keys(me).forEach(function(key) {
      if(typeof me[key].init === 'function') {
        me[key].init();
      }
    });
  };
  return me;
}(App));

jQuery(function(){
  App.init();
});
