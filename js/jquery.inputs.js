;(function($){
	//属性里面写typex属性,js再调用对应的方法就可以启动插件
	//=================================range==========================
	//1.value值只能0-100
	//2.min和max属性无效，但step属性有效，step必须大于0且小于等于100
	//=================================radio==========================
	//1.同一组的选项要放在同一个父节点下
	$.fn.extend({
		'range':function(){
			if($.trim(this.attr('typex'))=='range'){
				var rg_parent=this.parent();
				var rg_index=this.index();
				var Id='';
				if(this.attr('id'))Id=' id="'+$.trim(this.attr('id'))+'"';
				var name='';
				if(this.attr('name'))name=' name="'+$.trim(this.attr('name'))+'"';
				var step;
				if(this.attr('step')&&$.trim(this.attr('step'))!='')step=$.trim(this.attr('step'));
				var Class=' class="range"';
				if(this.attr('class'))Class=' class="range '+$.trim(this.attr('class'))+'"';
				var value;
				if(this.attr('value')||$.trim(this.attr('value')!='')){
					if(/\d+/.test($.trim(this.attr('value'))))value=$.trim(this.attr('value'));
				};
				this.replaceWith('<div'+Id+Class+'><div class="rg_left">◀</div><div class="rg_area"><div class="rg_move"></div></div><div class="rg_right">▶</div><input type="hidden"'+name+'/></div>');		
				var _this=rg_parent.children('*').eq(rg_index);
				_this.css({
					background:'#fff',
					width:'260px',
					height:'24px',
					display:'inline-block',
					'border-radius':'5px'
				});
				_this.find('.rg_left,.rg_right').css({
					'float':'left',
					width:'30px',
					height:'24px',
					color:'#666',
					'line-height':'24px',
					'text-align':'center',
					'user-select':'none',
					cursor:'pointer'
				});
				_this.find('.rg_area').css({
					'float':'left',
					width:'200px',
					height:'18px',
					'margin-top':'3px',
					'border-radius':'15px',
					'box-shadow':'2px 2px 10px #ccc inset'
				});
				
				_this.find('.rg_move').css({
					display:'inline-block',
					width:'40px',
					height:'18px',
					'border-radius':'15px',
					background:'radial-gradient(ellipse,#fff,#4e72b8)',
					cursor:'grab',
					'box-shadow':'0 0 5px #999'
				}).css('cursor','-webkit-grab');
				var rg_value=160;
				if(value&&parseInt(value)<=100&&parseInt(value)>=0)rg_value=parseInt(value)*1.6;
				_this.find('input').attr('value',rg_value/1.6);
				_this.find('.rg_move').css('margin-left',rg_value+'px');
				var rg_isclick=false;
				_this.find('.rg_move').on('mousedown',function(e){
					var rg_o_value=e.clientX;		
					var rg_n_value=e.clientX;
					var rg_isclick=true;
					document.onmousemove=function(e){
						if(rg_isclick){
							_this.find('.rg_move').css('cursor','-webkit-grabbing');
							_this.find('.rg_move').css('cursor','grabbing');
							rg_n_value=e.clientX;
							var now_value = rg_value + rg_n_value - rg_o_value;
							if(now_value>160)rg_n_value = 160 - rg_value + rg_o_value;
							if(now_value<0)rg_n_value = 0 - rg_value + rg_o_value;
							now_value = rg_value + rg_n_value - rg_o_value;
							_this.find('.rg_move').css('margin-left',now_value+'px');
							_this.find('input').attr('value',now_value/1.6);
						}
						
					};
					document.onmouseup=function(e){
						if(rg_isclick)rg_value+=rg_n_value-rg_o_value;
						rg_isclick=false;
						_this.find('.rg_move').css('cursor','-webkit-grab');
						_this.find('.rg_move').css('cursor','grab');
						document.onmousedown=null;
						document.onmousemove=null;
						if (typeof(document.onselectstart) != "undefined") {
							document.onselectstart = new Function("return false");       
						} else {
							document.onmousedown = new Function("return false");       
							document.onmouseup = new Function("return true");       
						} 
					}
				});
				var rg_step=16;
				if(step&&parseInt(step)>0&&parseInt(step)<=100)rg_step=parseInt(step)*1.6;
				_this.find('.rg_right').click(function(){
					rg_value+=rg_step;
					if(rg_value>160)rg_value=160;
					_this.find('.rg_move').css('margin-left',rg_value+'px');
					_this.find('input').attr('value',rg_value/1.6);
				});
				_this.find('.rg_left').click(function(){
					rg_value-=rg_step;
					if(rg_value<0)rg_value=0;
					_this.find('.rg_move').css('margin-left',rg_value+'px');
					_this.find('input').attr('value',rg_value/1.6);
				});
				
			}
		},
		'radio':function(){
			if($.trim(this.attr('typex'))=='radio'){
				var rd_parent=this.parent();
				var rd_index=this.index();
				var Id='';
				if(this.attr('id'))Id=' id="'+$.trim(this.attr('id'))+'"';
				var name='';
				if(this.attr('name'))name=' name="'+$.trim(this.attr('name'))+'"';
				var Class=' class="radio"';
				if(this.attr('class'))Class=' class="radio '+$.trim(this.attr('class'))+'"';
				var value;
				if(this.attr('value')&&$.trim(this.attr('value')!=''))value=$.trim(this.attr('value'));
				
				this.replaceWith('<div'+Id+Class+name+'><strong><span></span></strong><input type="hidden"'+name+'/></div>');
				var _this=rd_parent. children('*').eq(rd_index);
				_this.css({
					width:'15px',
					height:'15px',
					border:'1px solid #57a',
					cursor:'pointer',
					background:'linear-gradient(#ddd,#57a,#ddd)',
					display:'inline-block',
					'border-radius':'50%'
				});
				_this.find('strong').css({
					width:'15px',
					height:'15px',
				});
				_this.find('strong span').css({
					display:'block',
					width:'7px',
					height:'7px',
					background:'#333',
					margin:'4px auto',
					'border-radius':'50%'
				}).hide();
				_this.find('input').val('null');
				if(this.attr('checked'))_this.find('strong span').show();
				_this.click(function(){
					//if(_this.find('strong span').css('display')=='block'){
					//	_this.find('strong span').hide();
					//	_this.find('input').val('null');
					//}else{
						_this.find('strong span').show();
						_this.siblings('div[name="'+name.substring(7,name.length-1)+'"]').find('strong span').hide();
						_this.find('input').val(value);
						_this.siblings('div[name="'+name.substring(7,name.length-1)+'"]').find('input').val('null');
					//}
				});
			}
		},
		'checkbox':function(){
			if($.trim(this.attr('typex'))=='checkbox'){
				var cb_parent=this.parent();
				var cb_index=this.index();
				var Id='';
				if(this.attr('id'))Id=' id="'+$.trim(this.attr('id'))+'"';
				var name='';
				if(this.attr('name'))name=' name="'+$.trim(this.attr('name'))+'"';
				var Class=' class="checkbox"';
				if(this.attr('class'))Class=' class="checkbox '+$.trim(this.attr('class'))+'"';
				var value='';
				if(this.val()&&$.trim(this.val())!='')value=$.trim(this.attr('value'));
				this.replaceWith('<div'+Id+Class+'><strong></strong><input type="hidden"'+name+' /></div>');
				var _this=cb_parent.children('*').eq(cb_index);
				_this.css({
					width:'15px',
					height:'15px',
					border:'1px solid #57a',
					cursor:'pointer',
					background:'linear-gradient(#ddd,#57a,#ddd)',
					display:'inline-block',
					overflow:'hidden',
					'text-indent':'-3px'
				});
				_this.find('strong').css({
					color:'#000',
					width:'15px',
					height:'15px',
					'text-align':'center'
				});
				_this.find('input').val('null');
				if(this.attr('checked')){
					_this.find('strong').html('√');
					_this.find('input').val(value);	
				}
				_this.click(function(){
					if(_this.find('strong').html()==''){
						_this.find('strong').html('√');
						_this.find('input').val(value);
					}else{
						_this.find('strong').html('');
						_this.find('input').val('null');
					}
				});
			}
		}
	});
})(jQuery);