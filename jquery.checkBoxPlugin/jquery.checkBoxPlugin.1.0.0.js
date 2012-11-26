/**
@plugin name : jquery.checkboxAllAndInvert
@jQuery version : 1.8.5
@author : tc
@version : 1.0.0
*/
(function(jQuery) {
	var $this, ischeckbox, _options = {
		childCk: ".childCk",//需要选择中的子类checkbox选择器
		invertElm: ".invertElm",//反选的选择器
		autoCheckTrigger: true,//是否是自动关联全选checkbox，前提当前元素为chebox
		isCheckDisabled: false,//disabled的元素是否是操作
		beforeAll:null,//全选点击之前的回调函数
		beforeInvert:null,//反选点击之前的回调函数
		onAll: null,//全选的点击之后的回调函数
		onInvert: null,//反选点击之后的回调函数
		onChild: null//子类checkbox点击的回调函数
	};

	var _methods = {
		_bindClickChildCk: function() {
			var s = this;
			jQuery(_options.childCk).bind("click", function() {
				s._onChildCheck(this);
			});
		},
		_bindClickAll: function() {
			var s = this;
			$this.bind("click", function() {
				s._onAllCheck(this);
			});
		},
		_bindClickInvert: function() {
			var s = this;
			jQuery(_options.invertElm).bind("click", function() {
				s._onInvertCheck(this);
			});
		},
		_onAllCheck: function() {
			if(_options.beforeAll != null) {
				_options.beforeAll();
			}
			if(ischeckbox) {
				if($this.attr("checked")) {
					if(!_options.isCheckDisabled) {
						jQuery(_options.childCk).not("checked").not(":disabled").each(function(i, o) {
							jQuery(o).attr("checked", true);
						});
					}else{
						jQuery(_options.childCk).not("checked").each(function(i, o) {
							jQuery(o).attr("checked", true);
						});
					}
				} else {
					jQuery(_options.childCk + ":checked").each(function(i, o) {
						jQuery(o).attr("checked", false);
					});
				}
			} else {
				jQuery(_options.childCk).not("checked").each(function(i, o) {
					jQuery(o).attr("checked", true);
				});
			}
			if(_options.onAll != null) {
				_options.onAll();
			}
		},
		_onInvertCheck: function(elm) {
			if(_options.beforeInvert != null) {
				_options.beforeInvert(elm);
			}
			if(!_options.isCheckDisabled) {
				jQuery(_options.childCk).not(":disabled").each(function(i, o) {
					jQuery(o).attr("checked", !jQuery(o).attr("checked"));
				});
			} else {
				jQuery(_options.childCk).each(function(i, o) {
					jQuery(o).attr("checked", !jQuery(o).attr("checked"));
				});
			}
			this._cooperationAllElm();
			if(_options.onInvert != null) {
				_options.onInvert(elm);
			}
		},
		_onChildCheck: function(elm) {
			if(_options.onChildCheck != null) {
				_options.onChildCheck(elm);
			}
			this._cooperationAllElm();
		},
		_cooperationAllElm: function() {
			if(ischeckbox && _options.autoCheckTrigger) {
				if(_options.isCheckDisabled && jQuery(_options.childCk + ":checked").length == jQuery(_options.childCk).length) {
					$this.attr("checked", true);
				} else if(!_options.isCheckDisabled && jQuery(_options.childCk + ":checked").length == jQuery(_options.childCk).not(":disabled").length) {
					$this.attr("checked", true);
				} else {
					$this.attr("checked", false);
				}
			}
		}
	}

	var methods = {
		init: function(options) {
			return this.each(function() {
				_options = jQuery.extend({}, _options, options || {});
				$this = jQuery(this);
				ischeckbox = $this.is(":checkbox");
				_methods._bindClickAll();
				_methods._bindClickChildCk();
				_methods._bindClickInvert();
			});
		}
	}

	jQuery.fn.ckbPlg = function(method) {
		if(methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if(typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			jQuery.error('Method ' + method + ' does not exist on jQuery.ckbPlg');
		}
	}
})(jQuery);