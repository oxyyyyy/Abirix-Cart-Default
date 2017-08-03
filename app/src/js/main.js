(function($,doc,win) {
	win.App = win.App || {};
	$.extend(true, App, {
		_q: [],
		window: $(win),
		document: $(doc),
		page: $('html, body'),
		body: $('body'),
		_currentNiche: App._currentNiche || 0,
		lock_scroll_body:function($contain){
			var scrollTop=$(win).scrollTop();
			App.body.css('margin-top', '-'+scrollTop+'px')
			App.body.data('scroll', scrollTop)
			App.body.addClass('scroll_lock');
			var selScrollable = $contain;
			$(document).on('touchmove',function(e){
				e.preventDefault();
			});
			App.body.on('touchstart', selScrollable, function(e) {
				if (e.currentTarget.scrollTop === 0) {
					e.currentTarget.scrollTop = 1;
				} else if (e.currentTarget.scrollHeight === e.currentTarget.scrollTop + e.currentTarget.offsetHeight) {
					e.currentTarget.scrollTop -= 1;
				}
			});
			App.body.on('touchmove', selScrollable, function(e) {
				e.stopPropagation();
			});
			$($contain).focus();
		},
		unlock_scroll_body: function(){
			App.body.removeAttr('style')
			App.body.removeClass('scroll_lock')
			$(win).scrollTop(App.body.data('scroll'))
			$(document).off('touchmove');
			App.body.off('touchstart');
			App.body.off('touchmove');
		},
		initWarning: function(){
			warning='.warning';
			if($.cookie('warning')=='closed'){
				$(warning).remove()
			}
			$(doc).on('click', warning+' .close', function(e){
				e.preventDefault();
				$(this).parents(warning).fadeOut()
				$.cookie('warning', 'closed');
			});
		},
		initPopupClose: function(){
			if($('#step_1').length){
				var _ouibounce = ouibounce(document.getElementById('step_1'), {
					aggressive: true,
					timer: 0
				});
			}
			if($('#step_2').length){
				var _ouibounce = ouibounce(document.getElementById('step_2'), {
					aggressive: true,
					timer: 0
				});
			}
			if($('#step_3').length){
				var _ouibounce = ouibounce(document.getElementById('step_3'), {
					aggressive: true,
					timer: 0
				});
			}
		},
		initProductSelect: function(){
			var products_container=$('.products');
			if(products_container.length){
				products_container.find('.product_item').on('click', function(){
					products_container.find('.product_item').removeClass('selected')
					$(this).addClass('selected');
					$('.button_container .button.next').attr('href', $(this).data('product-link'))
				});
			}
			var offer_container=$('.offers_list');
			if(offer_container.length){
				offer_container.find('li').on('click', function(){
					offer_container.find('li').removeClass('selected')
					$(this).addClass('selected');
				});
			}
		},
		initCount: function(){
			//cookie
			$timer_container=$('.timer .number');
			if($timer_container.length){
				var now = new Date();
				var time = now.getTime();
				time += 6*3600 * 1000;
				now.setTime(time);
				if($.cookie('timerDate')){
					now= new Date($.cookie('timerDate'));
				} else{
					$.cookie('timerDate', now, {expires: 0.25069});
				}
				var austDay = new Date();
					austDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), 0, 0);
				$timer_container.countdown({
					until: austDay,
					layout: '{mnn}:{snn}',
					compact: true
				});
			}
		},
		initPopup: function(){
			$('[data-popup]').on('click',function(e){
				e.preventDefault()
				if($($(this).data('popup')).length){
					App.lock_scroll_body($(this).data('popup'));
					$($(this).data('popup')).fadeIn('slow', function(){
						$(this).addClass('opened');
					}).css('display', 'flex');
				}
			});
			$('.popup .close, .popup .close_btn, .popup .close_container').on('click', function(e) {
				e.preventDefault();
				var t=$(this);
				App.unlock_scroll_body('slow')
				t.parents('.popup').fadeOut();
				t.parents('.popup').removeClass('opened');
			});
		},
		initForm: function(){
			$('form.order_send').validate({
				rules: {
					first_name:{
						required: true
					},
					last_name:{
						required: true
					},
					adress:{
						required: true
					},
					city:{
						required: true
					},
					region:{
						required: true
					},
					postal_code:{
						required: true
					},
					phone:{
						required: true
					},
					email:{
						required: true,
						email: true
					},
					paymentmethod:{
						required: true
					},
					cardnumber:{
						required: true
					},
					monthselect:{
						required: true
					},
					yearselect:{
						required: true
					},
					cvv:{
						required: true
					},
				},
				//Убираем текст ошибок
				messages: {
					first_name:{
						required: 'First Name is required'
					},
					last_name:{
						required: 'Last Name is required'
					},
					adress:{
						required: 'Address is required'
					},
					city:{
						required: 'City is required'
					},
					region:{
						required: 'Region is required'
					},
					postal_code:{
						required: 'Postal Code is required'
					},
					phone:{
						required: 'Phone is required'
					},
					email:{
						required: 'Email is required',
						email: 'Email is not valid'
					},
					paymentmethod:{
						required: 'Payment Method is required'
					},
					cardnumber:{
						required: 'Card number is required'
					},
					monthselect:{
						required: 'Expiry Month is required'
					},
					yearselect:{
						required: 'Expiry Year is required'
					},
					cvv:{
						required: 'CVV is required'
					}
				},
				submitHandler: function (form) {
					//Ajax call after submit
					if (!App.body.hasClass('disable_ajax')) {
						App.body.addClass('disable_ajax');
						console.log($(form).serialize())
						//$.ajax({
						//	url:'/wp-admin/admin-ajax.php',
						//	type: 'POST',
						//	data: $(form).serialize()+'&action=ACTION_NAME',
						//	success:function(html){
						//		App.body.removeClass('disable_ajax');
						//	}
						//});
					}
					return false;
				}
			});
			$('select[name=paymentmethod]').on('change', function() {
				if ( this.value == 'PayPal')
				{
					$(".hidden_fields").hide();
				}
				else
				{
					$(".hidden_fields").show();
				}
			});
			$('form.order_send .button.rush').on('click', function(e){
				e.preventDefault();
				$(this).parents('form.order_send').submit()
			})
		},
		initApp: function() {
			App.initPopup();
			App.initPopupClose();
			App.initWarning();
			App.initProductSelect();
			App.initCount();
			App.initForm();
		}
	});
	App.initApp();
})(jQuery,document,window);

//App._q.push(function(){
// App.init();
//});