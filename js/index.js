$(function(){
	//传统模式第一关的难度值，可以自己调整
	var horitCount=12;	//横向的个数
	var vertiCount=7;	//纵向的个数
	var typeCount=10;	//类型种数
	var minGroup=6;		//最小组数
	var imgWH=58;		//图片宽高+边框(这个属性不能乱改)
	var iniTime=150;	//初始时间
	var promptCount=3;	//提示工具的个数
	var refreshCount=1;	//换位工具的个数
	var gameType;		//游戏类型
	
	var icon;			//图片样式
	var img_color;		//纯颜色图像的颜色
	var bg;				//背景图
	var music_list=[];		//音乐播放列表
	var isPlay_sound;	//音效是否启用
	var isPlay_music;	//音乐是否启用
	var volume_sound;	//音效音量
	var volume_music;	//音乐音量

	//同步加载设置数据
	$.ajax({
		type:'POST',
		url:'setUp.xml',
		async:false,
		success:function(response){
			icon=eval($(response).find('img icon').html());	
			img_color=$(response).find('img img_color').html();
			bg=eval($(response).find('background bg').html());
			music_list=eval($(response).find('music music_list').html());
			isPlay_sound=eval($(response).find('volume isPlay_sound').html());
			isPlay_music=eval($(response).find('volume isPlay_music').html());
			volume_sound=eval($(response).find('volume volume_sound').html());
			volume_music=eval($(response).find('volume volume_music').html());
		},
		error:function(){
			icon=2;	
			img_color='88aaaa';
			bg=1;
			music_list=[1,2,3,4,5,6,7,8,9,10,11,12,13,14];
			isPlay_sound=true;
			isPlay_music=true;
			volume_sound=1;
			volume_music=1;
		}
	});
	//初始化cookie
	if(getCookie('xx_cookie')==null)setCookie('xx_cookie','12&7&6&10&3&1&150&150&1&[]&0&0&1&3&1&1&1&"ct"',setCookieDate(30));
	if(getCookie('ct_cookie')==null)setCookie('ct_cookie','12&7&6&10&3&1&150&150&1&[]&0&0&1&3&1&1&1',setCookieDate(30));
	if(getCookie('jd_cookie')==null)setCookie('jd_cookie','12&6&4&18&5&3&160&160&1&[]&0&0&1&5&3&1&1',setCookieDate(30));
	if(getCookie('dt_cookie')==null)setCookie('dt_cookie','19&11&4&10&10&5&180&180&1&[]&0&0&1&10&5&1&1&[]',setCookieDate(30));

	//==============================设置主界面=========================================
	var xx_cou=false;
	var ct_cou=false;
	var jd_cou=false;
	var dt_cou=false;
	var cg_cou=false;
	//鼠标触碰菜单特效
	$('#main_menu li input').on('mouseover',function(){
		if(!$(this).is(':animated')){
			$(this).animate({width:'160',height:'25',left:'-=10',top:'+=10'},300,function(){
				$(this).animate({width:'120',height:'55',left:'+=20',top:'-=20'},300,function(){
					$(this).animate({width:'140',height:'40',left:'-=10',top:'+=10'},300);
				});
			});
		}
	});
	//点击菜单有声音
	$('#main_menu input').on('click',function(){
		$('#sound').attr('src','music/menu.mp3');
		$('#sound')[0].play();		
	});
	$('#maps input').on('click',function(){
		$('#sound').attr('src','music/menu.mp3');
		$('#sound')[0].play();		
	});
	
				//=================设置第一层菜单=============//
				
	$('#main_menu li input').css({left:'0',top:'0'});
	for(var i=2;i<=5;i++){
		$('#main_menu > ul > li:nth-child('+i+') > input').css('top',60*(i-1));
	}
	//点击单机游戏
	$('#main_menu input[value="单机游戏"]').on('click',function(){
		$('#main_menu input').stop(true,true);
		for(var i=1;i<=5;i++){
			if(i==5){
				$('#main_menu > ul > li:nth-child('+i+') > input')
					.animate({top:0},1000,function(){$(this).hide();})
					.queue(menuAni('#model',i))
					.queue(menuAni('#model',i+1));
			}else{
				$('#main_menu > ul > li:nth-child('+i+') > input')
					.animate({top:0},1000,function(){$(this).hide();})
					.queue(menuAni('#model',i));
			}			
		}
	});
	
	//触碰网路对战
	setInstruction('#main_menu input[value="网络对战"]','正在研发中......');
	$('#main_menu input[value="网络对战"]').click(function(){
		alertx('正在研发中......');
	});
	
	//----------------------------设置
	for(var i=1;i<=14;i++){
		$('.music_list ul').append('<li title="bgsound'+i+'"><input typex="checkbox" name="mlist'+i+'" checked="checked" /><span>bgsound'+i+'</span></li>');
		$('.music_list ul li input').eq(i-1).checkbox();
	}
	//自定义复选框、单选框、滑动框的启动
	$('.sound_play').checkbox();
	$('.music_play').checkbox();
	$('.all_music input').checkbox();
	$('.img_choice input').eq(0).radio();
	$('.c_solid').radio();
	$('.img_list input').eq(0).radio();
	$('.img_list input').eq(1).radio();
	$('.setBg input').eq(0).radio();
	$('.setBg input').eq(1).radio();
	//打开设置
	$('#main_menu input[value="设置"]').on('click',function(){
		if(!$('#setUp').is(':animated')){
			$('#setUp').show()
					.animate({width:'860',left:'-=430'},500)
					.animate({height:'450',top:'70'},500,function(){
						$(this).css('box-shadow','5px 5px 20px #666');
					});
		}
	});
	//关闭设置
	$('#setUp .close').click(function(){
		if(!$('#setUp').is(':animated')){
			$('#setUp').css('box-shadow','none')
					.animate({height:'0',top:'295'},500)
					.animate({width:'0',left:'+=430'},500,function(){
						$(this).hide();
					});
			$('.music_show audio')[0].pause();
		}
	});

	var setIsPlay_sound=isPlay_sound;
	var setIsPlay_music=isPlay_music;
	$('#sound')[0].volume=volume_sound;
	$('#bgMusic')[0].volume=volume_music;	//音乐音量
	$('.sound_vol').attr('value',volume_sound*100);
	$('.music_vol').attr('value',volume_music*100);
	$('.sound_vol').range();
	$('.music_vol').range();
	if(!setIsPlay_sound){
		$('.sound_play strong').html('');
		$('#sound')[0].volume=0;
	};
	if(!setIsPlay_music)$('.music_play strong').html('');
	//开关音效和音乐
	$('.sound_play').on('click',function(){
		if($('.sound_play strong').html()=='')setIsPlay_sound=false;
		else setIsPlay_sound=true;
	});
	$('.music_play').on('click',function(){
		if($('.music_play strong').html()=='')setIsPlay_music=false;
		else setIsPlay_music=true;
	});
	var setMusic_list=music_list;
	for(var i=0;i<setMusic_list.length;i++){
		if(i==setMusic_list[i]-1)$('.music_list ul li').eq(i).find('.checkbox strong').html('√');
		else $('.music_list ul li').eq(i).find('.checkbox strong').html('');
	}
	if($('.music_show h3').html()!='请选择歌曲试听')$('.music_show audio').attr('src','music/'+$('.music_show h3').html()+'.mp3');
	//选择列表的音乐，右边标题改变，并加入播放器
	$('.music_list li span').click(function(){
		var index=$(this).parent().index()+1;
		$('.music_show h3').html('bgsound'+index);
		$('.music_show audio').attr('src','music/bgsound'+index+'.mp3');
	});
	$('.music_list li .checkbox').click(function(){
		var index=$(this).parent().index();
		//点下去才判断的，所以没点之前是打勾，到了这里就是没打勾
		if($(this).find('strong').html()!='')setMusic_list[index]=index+1;
		else setMusic_list[index]=-1;
	});
	
	//全选按钮
	$('.all_music .checkbox').click(function(){
		if($(this).find('strong').html()==''){//去掉打勾
			for(var i=0;i<14;i++){
				if($('.music_list li').eq(i).find('.checkbox strong').html()!='')
					$('.music_list li').eq(i).find('.checkbox').click();
				setMusic_list[i]=-1;
			}
		}else if($(this).find('strong').html()!=''){
			for(var i=0;i<14;i++){
				if($('.music_list li').eq(i).find('.checkbox strong').html()=='')
					$('.music_list li').eq(i).find('.checkbox').click();
				setMusic_list[i]=i+1;
			}
		}
	});
	var setIcon=icon;
	var setImg_color=img_color;
	
	if(setIcon==0)$('.c_solid').click();
	//选择纯颜色
	$('.c_solid').on('click',function(){
		$('.solid_color').removeAttr('disabled');
		$('.but_color').removeAttr('disabled');
		$('.img_list').css('background','#ccc');
		document.onmousedown=null;
		document.onmousemove=null;
		$('.solid_color')[0].focus();
		setIcon=0;
		setImg_color=$('.solid_color').val();
		$('.img_show ul').html('');
		for(var i=1;i<=4;i++){			
			$('.img_show ul').append('<li style="background:#'+setImg_color+'">'+i+'</li>');
		}
	});
	//选择图片样式
	$('.c_img').on('click',function(){
		$('.solid_color').attr('disabled','disabled');
		$('.but_color').attr('disabled','disabled');
		$('.img_list').css('background','#ddd');
		$('.img_show ul').html('');
		setIcon=$('.img_list .radio span:visible').parent().parent().index('.img_list .radio')+1;
		for(var i=1;i<=4;i++){
			if(setIcon==1)$('.img_show ul').append('<li><img src="images/icon1/'+i+'.gif" /></li>');
			else if(setIcon==2)$('.img_show ul').append('<li><img src="images/icon2/'+i+'.jpg" /></li>');
		}
	});
	//屏蔽掉除0-9a-f和←键以外的键
	$('.solid_color').keydown(function(e){
		if((e.keyCode>=48&&e.keyCode<=57)||(e.keyCode>=65&&e.keyCode<=70)||(e.keyCode>=96&&e.keyCode<=105)||e.keyCode==8||(e.keyCode>=37&&e.keyCode<=40)){	
		}else{return false;}
	});
	//纯色试看
	$('.but_color').click(function(){
		if($('.solid_color').val().length==6){
			$('.img_show ul').html('');
			for(var i=1;i<=4;i++){			
				$('.img_show ul').append('<li style="background:#'+setImg_color+'">'+i+'</li>');
				setImg_color=$('.solid_color').val();
				$('.img_show li').css('background','#'+setImg_color);
			}			
		}
	});
	for(var i=1;i<=4;i++){
		if(setIcon==0)$('.img_show ul').append('<li style="background:#'+setImg_color+'">'+i+'</li>');
		else if(setIcon==1)$('.img_show ul').append('<li><img src="images/icon1/'+i+'.gif" /></li>');
		else if(setIcon==2)$('.img_show ul').append('<li><img src="images/icon2/'+i+'.jpg" /></li>');
	}
	$('.img_list .radio').on('click',function(){
		setIcon=$(this).index('.img_list div')+1;
		if($('.c_solid span').css('display')=='none'){
			for(var i=1;i<=4;i++){
				if(setIcon==1)$('.img_show li').eq(i-1).find('img').attr('src','images/icon1/'+i+'.gif');
				else if(setIcon==2)$('.img_show li').eq(i-1).find('img').attr('src','images/icon2/'+i+'.jpg');
			}
		}
	});
	var setbg=bg;
	if($('.setBg .radio').eq(setbg).find('span').css('display')!='block')$('.setBg .radio').eq(setbg).click();
	
	if(setbg==0)$('.bg_show').html('');
	else $('.bg_show').html('<img src="images/s_bg'+setbg+'.jpg" />');
	
	if(setbg==0)$('body').css('background-image','none');
	else $('body').css('background-image','url("images/bg'+setbg+'.jpg")');
	$('.setBg .radio').on('click',function(){
		setbg=$(this).index('.setBg .radio');
		if(setbg==0)$('.bg_show').html('');
		else $('.bg_show').html('<img src="images/s_bg'+setbg+'.jpg" />');
	});
	//保存设置
	$('#sub').click(function(){
		icon=setIcon;
		img_color=setImg_color;
		bg=setbg;
		music_list=setMusic_list;
		
		isPlay_sound=setIsPlay_sound;
		isPlay_music=setIsPlay_music;	
		volume_sound=$('.sound_vol input').val()/100;
		volume_music=$('.music_vol input').val()/100;
		if(!isPlay_sound)$('#sound')[0].volume=0;
		else $('#sound')[0].volume=volume_sound;
		$('#bgMusic')[0].volume=volume_music;
		
		if(setbg==0)$('body').css('background-image','none');
		else $('body').css('background-image','url("images/bg'+setbg+'.jpg")');
		$('#setUp .close').click();
		
		$.ajax({
			type:'POST',
			url:'setUp.jsp',
			data:{
				icon:icon,
				img_color:img_color,
				bg:bg,
				music_list:'['+music_list+']',
				isPlay_sound:isPlay_sound,
				isPlay_music:isPlay_music,
				volume_sound:volume_sound,
				volume_music:volume_music
			}/*,
			success:function(response){
				alert(response);
			}*/
		});
		return false;
	});
	//----------------------------帮助
	//点击帮助
	$('#main_menu input[value="帮助"]').on('click',function(){
		var _left=($(window).width()-760)/2;
		var _top=($(window).height()-380)/2;
		$('#help').show().animate({
			width:'760',
			height:'380',
			left:_left,
			top:_top
		},1000);
	});
	//关闭帮助
	$('#help .close').click(function(){
		var _left=($(window).width()-100)/2;
		$('#help').animate({
			width:'100',
			height:'20',
			top:'320',
			left:_left
		},1000,function(){$(this).hide()});
	});
	//设置内容区域可以上下拖拉
	function updownDrag(objstr){
		//禁用文本的选中
		if (typeof(document.onselectstart) != "undefined") {
			document.onselectstart = new Function("return false");       
		} else {
			document.onmousedown = new Function("return false");       
			document.onmouseup = new Function("return true");       
		} 
		$(objstr).css('cursor','-webkit-grab');
		$(objstr).css('cursor','grab');
		$(objstr).on('mousedown',function(e){
			var _Y=e.clientY;
			var _scrollTop=$(objstr).scrollTop();
			document.onmousemove=function(e){
				$(objstr).css('cursor','-webkit-grabbing');
				$(objstr).css('cursor','grabbing');
				if($(objstr).scrollTop()!=0&&e.clientY>_Y){
					$(objstr).scrollTop(_scrollTop-(e.clientY-_Y));
				}else if(e.clientY<_Y){
					$(objstr).scrollTop(_scrollTop+(_Y-e.clientY));
				}			
			};
			document.onmouseup=function(){
				$(objstr).css('cursor','-webkit-grab');
				$(objstr).css('cursor','grab');
				document.onmousedown=null;			
				document.onmousemove=null;
				if (typeof(document.onselectstart) != "undefined") {
					document.onselectstart = new Function("return false");       
				} else {
					document.onmousedown = new Function("return false");       
					document.onmouseup = new Function("return true");       
				} 
			};
		});
	}
	updownDrag('#rule');
	updownDrag('#modelDsc');
	//图片放大
	$('#rule dl dt img').hover(function(e){
		var index=$(this).parent().parent().index();
		$('#instruction').css({
			top:e.clientY-15+'px',
			left:e.clientX+15+'px'
		}).html('<img src="images/ruleImg'+(index+1)+'.png "/>').show();
	},function(){
		$('#instruction').hide();
	});	
	//选项卡
	$('#help header li').click(function(e){
		var index=$(this).index();
		$('#help header li').eq(index).addClass('select').siblings().removeClass('select');
		$('#help article > div').eq(index).show().siblings().hide();
	});
	//模式说明滚动条事件
	$('#modelDsc').on('scroll',function(){
		$('.catalog').css('top',35+$('#modelDsc').scrollTop());
		var index=parseInt($('#modelDsc').scrollTop()/314);
		cl_index=index;
		$('.catalog dl dd').eq(index).find('.cl_dot').html('●').css('color','blue');
		$('.catalog dl dd').eq(index).siblings().find('.cl_dot').css('color','#666').html('○');
	});
	//目录点击事件
	var cl_index=0;
	$('.catalog dl dd').click(function(){
		cl_index=$(this).index();
		if(!$('#modelDsc').is(':animated'))$('#modelDsc').animate({'scrollTop':314*$(this).index()},500);
	});
	//目录触碰事件
	$('.catalog dl dd').hover(function(){
		$(this).find('.cl_dot').css('color','blue');
	},function(){
		if($(this).index()!=cl_index)$(this).find('.cl_dot').css('color','#666');
	});
	//-----------------退出
	$('#main_menu input[value="退出"]').on('click',function(){
		if(confirm("您确定要退出吗？")) window.close();
	});
	
	//一二层菜单的收起
	function menuAni(id,index){
		return function(next){
			if(id=='#model'){
				$(id+' li:nth-child('+index+') input').show().animate({top:60*(index-1)},800);
				$('#model li > div > input').hide();
			}else if(id=='#main_menu'){
				$(id+' > ul > li:nth-child('+index+') > input').show().animate({top:60*(index-1)},800);
			}			
			next();
		}
	}
	
					//=================设置第二层菜单=============//
					
	//点击返回上一级
	$('#main_menu input[value="返回上一级"]').on('click',function(){
		$('#main_menu input').stop(true,true);
		for(var i=1;i<=6;i++){
			if(i==6){
				$('#model ul li:nth-child('+i+') input')
					.animate({top:0},800,function(){$(this).hide();});
			}else{
				$('#model ul li:nth-child('+i+') input')
				.animate({top:0},800,function(){$(this).hide();})
				.queue(menuAni('#main_menu',i));
			}			
		}
		if(xx_cou)xx_cou=submenu('.xx_diff',xx_cou);
		if(ct_cou)ct_cou=submenu('.ct_diff',ct_cou);
		if(jd_cou)jd_cou=submenu('.jd_diff',jd_cou);
		if(dt_cou)dt_cou=submenu('.dt_diff',dt_cou);
		if(cg_cou)cg_cou=submenu('.cg_diff',cg_cou);
	});
	
	$('#model div input[value="读档"]').on('click',function(){
		if(getCookie('xx_cookie')==null)setCookie('xx_cookie','12&7&6&10&3&1&150&150&1&[]&0&0&1&3&1&1&1&"ct"',setCookieDate(30));
		if(getCookie('ct_cookie')==null)setCookie('ct_cookie','12&7&6&10&3&1&150&150&1&[]&0&0&1&3&1&1&1',setCookieDate(30));
		if(getCookie('jd_cookie')==null)setCookie('jd_cookie','12&6&4&18&5&3&160&160&1&[]&0&0&1&5&3&1&1',setCookieDate(30));
		if(getCookie('dt_cookie')==null)setCookie('dt_cookie','19&11&4&10&10&5&180&180&1&[]&0&0&1&10&5&1&1&[]',setCookieDate(30));
	});
	
	//点击休闲模式
	$('#main_menu input[value="休闲模式"]').on('click',function(){
		xx_cou=submenu('.xx_diff',xx_cou);
		if(ct_cou)ct_cou=submenu('.ct_diff',ct_cou);
		if(jd_cou)jd_cou=submenu('.jd_diff',jd_cou);
		if(dt_cou)dt_cou=submenu('.dt_diff',dt_cou);
		if(cg_cou)cg_cou=submenu('.cg_diff',cg_cou);
	});
	//进入休闲模式
	var xx_type;
	$('.xx_diff input').on('click',function(e,data){
		var index=typeof data=='undefined'?0:2-data;
		gameType=1;
		switch($(this).index()){
			case 3:
				var ckobj=valueOfObj(getCookie('xx_cookie'));
				if(ckobj.contents.length==0){		
					xx_type='ct';
					reset();
					$('#main_menu').hide();		
					$('#game_interface').show();	
				}else readGame(ckobj);				
				break;
			case 2:			
				xx_type='ct';
				reset();
				$('#main_menu').hide();		
				$('#game_interface').show();	
				break;
			case 1:
				xx_type='jd';
				xx_jd(index);
				break;
			case 0:
				xx_type='dt';
				map=maps[parseInt(Math.random()*43)];	
				horitCount=19;
				vertiCount=11;
				minGroup=4;
				typeCount=map.length%4==0?map.length/4:(map.length-2)/4;
				promptCount=10;
				refreshCount=5;
				iniTime=180;
				reset();
				$('#main_menu').hide();		
				$('#game_interface').show();
				break;
		}
	});
	function xx_jd(index){
		horitCount=12+index*2;
		vertiCount=6+index;
		var total=horitCount*vertiCount;
		iniTime=160+index*40;
		minGroup=4;
		typeCount=total%4==0?total/4:(total-2)/4;
		promptCount=5+index*5;
		refreshCount=3+index*2;
		if(index==0)cp_cont='简单';
		else if(index==1)cp_cont='普通';
		else if(index==2)cp_cont='困难';
		reset();
		$('#main_menu').hide();		
		$('#game_interface').show();
		$('.checkpoint').html('第'+checkpoint+'关  '+getGameType());
	}	
	
	//点击传统模式
	$('#main_menu input[value="传统模式"]').on('click',function(){		
		ct_cou=submenu('.ct_diff',ct_cou);
		if(xx_cou)xx_cou=submenu('.xx_diff',xx_cou);
		if(jd_cou)jd_cou=submenu('.jd_diff',jd_cou);
		if(dt_cou)dt_cou=submenu('.dt_diff',dt_cou);
		if(cg_cou)cg_cou=submenu('.cg_diff',cg_cou);
	});

	//进入传统模式
	$('.ct_diff input').on('click',function(){
		gameType=2;
		if($(this).index()==1){
			var ckobj=valueOfObj(getCookie('ct_cookie'));
			if(ckobj.contents.length==0){
				reset();
				$('#main_menu').hide();		
				$('#game_interface').show();
				start=setInterval(countdown,1000);
			}else readGame(ckobj);	
		}else{
			reset();
			$('#main_menu').hide();		
			$('#game_interface').show();
			start=setInterval(countdown,1000);			
		}
	});
	
	//点击经典模式
	$('#main_menu input[value="经典模式"]').on('click',function(){
		jd_cou=submenu('.jd_diff',jd_cou);
		if(xx_cou)xx_cou=submenu('.xx_diff',xx_cou);
		if(ct_cou)ct_cou=submenu('.ct_diff',ct_cou);
		if(dt_cou)dt_cou=submenu('.dt_diff',dt_cou);
		if(cg_cou)cg_cou=submenu('.cg_diff',cg_cou);
	});
	//进入经典模式
	$('.jd_diff input').on('click',function(){
		var index=2-$(this).index();			
		gameType=3;
		if(index==-1){
			var ckobj=valueOfObj(getCookie('jd_cookie'));
			if(ckobj.contents.length==0){
				horitCount=12;
				vertiCount=6;
				iniTime=160;
				minGroup=4;
				typeCount=18;
				promptCount=5;
				refreshCount=3;
				cp_cont='简单';
				reset();
				$('#main_menu').hide();		
				$('#game_interface').show();
				start=setInterval(countdown,1000);
			}else readGame(ckobj);
		}else{
			horitCount=12+index*2;
			vertiCount=6+index;
			var total=horitCount*vertiCount;
			iniTime=160+index*40;
			minGroup=4;
			typeCount=total%4==0?total/4:(total-2)/4;
			promptCount=5+index*5;
			refreshCount=3+index*2;
			if(index==0)cp_cont='简单';
			else if(index==1)cp_cont='普通';
			else if(index==2)cp_cont='困难';
			reset();
			$('#main_menu').hide();		
			$('#game_interface').show();
			start=setInterval(countdown,1000);
		}
	})	
	
	//点击地图模式
	$('#main_menu input[value="地图模式"]').on('click',function(){
		dt_cou=submenu('.dt_diff',dt_cou);
		if(xx_cou)xx_cou=submenu('.xx_diff',xx_cou);
		if(ct_cou)ct_cou=submenu('.ct_diff',ct_cou);
		if(jd_cou)jd_cou=submenu('.jd_diff',jd_cou);
		if(cg_cou)cg_cou=submenu('.cg_diff',cg_cou);
	});
	//进入地图模式
	$('.dt_diff input').on('click',function(){
		gameType=4;
		switch($(this).index()){
			case 2:
				var ckobj=valueOfObj(getCookie('dt_cookie'));
				if(ckobj.contents.length==0){
					map=maps[parseInt(Math.random()*43)];	
					horitCount=19;
					vertiCount=11;
					minGroup=4;
					typeCount=map.length%4==0?map.length/4:(map.length-2)/4;
					promptCount=10;
					refreshCount=5;
					iniTime=180;
					reset();
					$('#main_menu').hide();		
					$('#game_interface').show();
					start=setInterval(countdown,1000);
				}else readGame(ckobj);	
				break;
			case 1:
				map=maps[parseInt(Math.random()*43)];	
				horitCount=19;
				vertiCount=11;
				minGroup=4;
				typeCount=map.length%4==0?map.length/4:(map.length-2)/4;
				promptCount=10;
				refreshCount=5;
				iniTime=180;
				reset();
				$('#main_menu').hide();		
				$('#game_interface').show();
				start=setInterval(countdown,1000);
				break;
			case 0:
				$('#main_menu').hide();		
				$('#maps').show();
				for(var i=0;i<4;i++){
					$('.map_depot ul li').eq(i).html('<img src="map/map'+(i+1)+'.jpg" />')		
				}
				break;
		}
	});
	
	//点击闯关模式
	$('#main_menu input[value="闯关模式"]').on('click',function(){
		cg_cou=submenu('.cg_diff',cg_cou);	
		if(xx_cou)xx_cou=submenu('.xx_diff',xx_cou);
		if(ct_cou)ct_cou=submenu('.ct_diff',ct_cou);
		if(jd_cou)jd_cou=submenu('.jd_diff',jd_cou);
		if(dt_cou)dt_cou=submenu('.dt_diff',dt_cou);
	});
	//点击所有子菜单
	$('#model li div input').on('click',function(){	
		if(xx_cou)xx_cou=submenu('.xx_diff',xx_cou);
		if(ct_cou)ct_cou=submenu('.ct_diff',ct_cou);
		if(jd_cou)jd_cou=submenu('.jd_diff',jd_cou);
		if(dt_cou)dt_cou=submenu('.dt_diff',dt_cou);
		if(cg_cou)cg_cou=submenu('.cg_diff',cg_cou);
	});
	//子菜单
	function submenu(id,equ){
		var length=$(id).children('input').size();
		if(!equ){
			$(id+' input').show()
				.animate({left:'150'},500,function(){
					for(var i=1;i<length;i++){
						$(id+' input:nth-child('+(length-i)+')').animate({
							top:parseInt($(id).next().css('top'))+50*i
						},500);
					}
				});
			equ=true;
			return equ;
		}else{
			$(id+' input').stop(true,true);
			for(var i=1;i<length;i++){
				if(i!=length-1){
					$(id+' input:nth-child('+(i)+')').animate({
						top:parseInt($(id).next().css('top'))
					},500);					
				}else {
					$(id+' input:nth-child('+i+')').animate({
						top:parseInt($(id).next().css('top'))
					},500,function(){
						$(id+' input').animate({left:'0'},500,function(){
							$(this).hide();				
						});
					});
				}
			}
			if(length==1){
				$(id+' input').animate({left:'0'},500,function(){$(this).hide();});
			}
			equ=false;
			return equ;
		}
	}
	
	
	
	//======================================设置地图界面====================================
	$('#right_option').css('top',($(window).height()-$('#right_option').height())/2-30+'px');
	$('.map_draw').css('margin-left',($(window).width()-$('.map_draw').width())/2-80+'px');
	$('.map_draw').css('margin-top',($(window).height()-$('.map_draw').height())/2+'px');
	//地图绘制
	for(var i=0;i<11*19;i++){
		$('.map_draw ul').append('<li></li>');
	}
	
	$('.map_draw ul li').on('mousedown',function(e){
		var event=e;
		if($(this).css('cursor')=='pointer'){
			if(event.which==1)$(this).css('background-color','#666');	
			else if(event.which==3) $(this).css('background-color','transparent');
			document.onmousemove=function(e){
				if($(e.target).is($('.map_draw ul li'))){
					if(event.which==1) $(e.target).css('background-color','#666');
					else if(event.which==3) $(e.target).css('background-color','transparent');						
				}
			}
			document.onmouseup=function(){
				document.onmousemove=null;
				document.onmouseup=null;
			}
		}
	});
	//点击自定义按钮
	var isCustom=false;
	$('.custom').click(function(){
		if(isCustom){
			$(this).css('background','#ca2');
			$(this).css('box-shadow','2px 2px 5px #333');
			$('.map_draw ul li').css('cursor','default');
			
			$('.parm_draw').stop(true,true)
				.animate({height:'20',top:'490'},500)
				.animate({right:'85',width:'50'},500,function(){$(this).hide()});
			isCustom=false;
		}else{
			$(this).css('background','#ccc');
			$(this).css('box-shadow','2px 2px 5px #333 inset');
			$('.map_draw ul li').css('cursor','pointer');
			
			$('.parm_draw').stop(true,true)
				.show()
				.animate({right:'155',width:'90'},500)
				.animate({height:'70',top:'470'},500);
			isCustom=true;
		}
	});
	
	
	var maps=[
		[8,9,12,21,22,23,24,25,26,28,29,31,32,33,34,35,39,41,42,46,47,48,50,52,54,55,58,59,60,68,71,72,73,74,77,79,80,89,92,93,96,97,99,107,108,109,112,115,117,129,131,134,135,136,139,141,145,149,150,153,154,156,157,158,160,163,165,166,168,169,173,174,175,176,177,179,180,181,182,187,197,199],
		[21,22,23,24,25,26,27,29,30,31,32,33,34,35,39,40,41,42,43,44,45,46,48,49,50,51,52,53,54,55,58,59,60,61,62,63,64,65,67,68,69,70,71,72,73,74,77,78,79,80,81,82,83,87,88,89,90,91,92,93,115,116,117,118,119,120,121,125,126,127,128,129,130,131,134,135,136,137,138,139,140,141,143,144,145,146,147,148,149,150,153,154,155,156,157,158,159,160,162,163,164,165,166,167,168,169,173,174,175,176,177,178,179,181,182,183,184,185,186,187],
		[2,8,14,18,20,21,22,26,27,28,32,33,34,37,38,39,40,41,42,44,45,46,47,48,50,51,52,53,54,56,57,58,59,60,61,63,64,65,66,67,69,70,71,72,73,75,77,78,79,83,84,85,89,90,91,94,97,103,109,113,132,134,135,139,140,143,144,145,146,148,149,150,151,152,155,157,160,165,168,169,170,171,174,176,179,183,188,189,191,192,196,197,201,208],
		[2,4,5,6,8,9,10,12,14,16,17,18,21,25,29,31,33,35,40,42,43,44,46,47,48,50,51,52,54,55,56,59,61,67,71,75,78,80,81,82,84,85,86,90,92,93,94,114,115,116,118,119,120,122,123,124,126,127,128,130,131,132,133,137,139,141,143,145,147,149,151,152,153,154,158,160,161,162,164,165,166,168,170,171,173,177,179,181,185,187,189,190,191,192,196,198,199,200,202,203,204,206,207,208],
		[0,1,2,3,4,5,13,14,15,16,17,18,19,20,21,22,23,24,25,28,31,32,33,34,35,36,37,39,40,41,42,43,44,45,49,50,51,52,53,54,55,59,60,61,62,63,64,65,67,68,69,70,71,72,73,79,80,81,82,83,84,86,87,88,89,90,91,104,117,118,119,120,121,122,124,125,126,127,128,129,135,136,137,138,139,140,141,143,144,145,146,147,148,149,153,154,155,156,157,158,159,163,164,165,166,167,168,169,171,172,173,174,175,176,177,183,184,185,186,187,188,189,190,191,192,193,194,195,203,204,205,206,207,208],
		[3,4,12,13,14,15,21,22,23,24,30,31,32,33,34,35,39,40,41,42,43,44,48,49,50,51,52,53,54,55,57,58,60,61,63,64,68,69,70,71,72,73,79,80,88,89,90,91,98,99,108,109,116,117,118,119,124,125,126,127,128,129,130,131,134,135,136,137,138,139,143,144,145,146,147,148,149,150,152,153,154,155,156,157,158,159,165,166,172,173,174,175,176,177,184,185,192,193,194,195,203,204],
		[0,1,2,3,5,6,7,8,10,11,16,17,18,19,20,21,22,23,24,25,26,27,29,30,31,34,35,36,37,39,40,44,45,49,50,51,52,53,54,56,59,60,62,63,66,69,70,71,72,75,79,80,81,84,85,86,89,90,94,102,103,104,105,106,113,117,118,119,122,123,124,127,128,132,135,136,137,138,139,142,145,146,147,148,151,153,154,158,159,163,164,165,166,167,168,170,171,172,173,174,175,176,177,178,179,181,182,183,186,187,188,189,190,191,192,193,194,195,196,197,198,200,201,206,207,208],
		[0,1,4,7,8,9,10,11,14,17,18,19,22,25,31,34,37,38,40,43,46,47,48,51,54,56,57,59,61,64,68,71,73,75,76,78,80,82,85,88,90,92,94,95,97,99,101,103,105,107,109,111,113,114,116,118,120,123,126,128,130,132,133,135,137,140,144,147,149,151,152,154,157,160,161,162,165,168,170,171,174,177,183,186,189,190,191,194,197,198,199,200,201,204,207,208],
		[0,8,9,10,18,20,22,23,24,25,26,27,29,30,31,32,33,34,36,40,41,42,44,45,46,48,49,50,52,53,54,59,60,63,64,65,67,68,69,72,73,78,79,81,82,83,87,88,89,91,92,116,117,119,120,121,125,126,127,129,130,135,136,139,140,141,143,144,145,148,149,154,155,156,158,159,160,162,163,164,166,167,168,172,174,175,176,177,178,179,181,182,183,184,185,186,188,190,198,199,200,208],
		[20,21,23,24,25,26,28,29,30,32,33,35,36,39,40,42,43,44,45,47,48,49,51,52,54,55,60,65,69,77,78,80,81,82,83,85,86,87,89,90,92,93,96,97,99,100,101,102,104,105,106,108,109,111,112,115,116,118,119,120,121,123,124,125,127,128,130,131,136,141,153,154,156,157,158,159,161,162,163,165,166,168,169,172,173,175,176,177,178,180,181,182,184,185,187,188],
		[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,19,20,23,24,25,28,29,30,33,34,35,38,43,48,53,57,62,67,72,76,77,80,81,82,85,86,87,90,91,92,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,116,117,118,121,122,123,126,127,128,131,132,136,141,146,151,155,160,165,170,173,174,175,178,179,180,183,184,185,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208],
		[0,1,2,3,4,5,6,7,8,9,10,11,12,13,20,21,22,23,24,30,31,32,33,41,42,43,44,45,46,47,52,53,63,64,65,66,67,68,69,70,71,72,73,74,86,87,88,89,90,91,92,93,110,111,112,113,124,125,126,127,128,129,130,131,139,140,141,142,143,144,145,146,147,148,149,150,155,156,157,158,159,160,161,162,166,167,172,173,174,175,176,183,184,185,190,191,192,193,194,195,196,197,198,199,200,201,202,203],
		[0,1,2,3,4,14,15,16,17,18,19,20,21,22,23,24,32,33,34,35,36,37,39,40,41,42,43,44,50,51,52,53,54,55,59,60,61,62,63,69,70,71,72,73,115,116,117,119,121,123,125,127,129,130,131,136,138,140,142,144,146,148,155,156,158,160,162,164,166,167,175,176,177,178,179,180,181,182,183,184,185,199],
		[3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,40,41,59,60,63,64,65,66,67,68,69,70,71,72,78,79,82,83,84,85,86,87,88,89,90,91,92,97,98,110,111,116,117,118,119,120,121,122,123,124,125,126,129,130,136,137,138,139,140,141,142,143,144,145,148,149,167,168,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205],
		[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,24,25,29,33,37,38,40,41,43,44,46,48,50,52,54,56,59,60,65,67,69,71,73,75,76,77,78,79,80,81,82,83,84,86,88,90,92,94,95,105,107,109,111,113,114,116,117,118,119,120,121,122,123,124,126,128,130,132,133,140,145,147,149,151,152,153,154,155,156,157,159,161,162,163,164,166,168,170,171,180,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208],
		[0,1,2,3,9,10,15,16,17,18,19,20,21,27,28,29,30,35,36,37,38,39,45,46,47,48,49,50,55,56,57,63,64,65,68,69,70,75,81,82,83,88,89,90,95,96,97,111,112,113,119,120,121,126,127,128,133,139,140,141,144,145,146,151,152,153,159,160,161,162,163,164,169,170,171,172,173,179,180,181,182,187,188,189,190,191,192,193,199,200,205,206,207,208],
		[23,24,25,26,27,29,30,31,32,33,41,42,43,44,45,46,48,49,50,51,52,53,59,60,61,62,63,64,68,69,70,71,72,73,77,78,79,80,81,82,88,89,90,91,92,93,115,116,117,118,119,120,126,127,128,129,130,131,135,136,137,138,139,140,144,145,146,147,148,149,155,156,157,158,159,160,162,163,164,165,166,167,175,176,177,178,179,181,182,183,184,185],
		[0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,52,54,56,58,60,62,64,66,68,70,72,74,76,78,80,82,84,86,88,90,92,94,96,98,100,102,106,108,110,112,114,116,118,120,122,124,126,128,130,132,134,136,138,140,142,144,146,148,150,152,154,156,158,160,162,164,166,168,170,172,174,176,178,180,182,184,186,188,190,192,194,196,198,200,202,204,206,208],
		[1,10,11,20,21,22,23,24,25,26,27,29,30,33,34,35,36,37,39,40,41,42,46,48,52,53,54,58,59,64,65,66,70,71,72,75,77,78,89,90,93,94,96,97,100,101,102,103,104,105,107,108,111,112,115,116,124,126,127,129,130,131,132,135,139,143,148,150,156,157,158,162,163,164,167,168,169,170,173,174,175,176,177,178,179,182,183,184,189,190,191,192,198,201,202,208],
		[0,9,18,20,21,22,23,24,25,26,27,29,30,31,32,33,34,35,36,39,40,41,42,43,44,45,46,48,49,50,51,52,53,54,55,58,59,60,61,62,63,64,65,67,68,69,70,71,72,73,74,77,78,79,80,81,82,83,84,86,87,88,89,90,91,92,93,95,113,115,116,117,118,119,120,121,122,124,125,126,127,128,129,130,131,134,135,136,137,138,139,140,141,143,144,145,146,147,148,149,150,153,154,155,156,157,158,159,160,162,163,164,165,166,167,168,169,172,173,174,175,176,177,178,179,181,182,183,184,185,186,187,188,190,199,208],
		[0,2,3,4,6,7,8,10,13,15,16,17,18,19,22,25,29,30,32,34,35,36,37,38,41,44,45,46,48,49,50,51,53,54,55,56,57,60,63,67,69,70,72,73,74,75,76,79,82,83,84,86,89,91,92,93,94,95,114,117,118,120,121,122,124,127,129,130,131,133,135,139,143,144,146,149,152,154,158,159,160,162,163,164,165,168,171,173,177,181,183,184,187,190,193,194,196,197,198,200,203,206],
		[3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,20,22,23,28,32,35,37,38,41,42,47,51,54,56,57,59,60,61,66,70,73,75,76,77,78,79,80,85,89,92,94,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,123,127,130,132,133,135,136,137,142,146,149,151,152,155,156,161,165,168,170,172,174,175,180,184,187,189,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208],
		[20,21,23,24,26,27,29,30,32,33,35,36,39,40,42,43,45,46,48,49,51,52,54,55,77,78,80,81,83,84,86,87,89,90,92,93,96,97,99,100,102,103,105,106,108,109,111,112,134,135,137,138,140,141,143,144,146,147,149,150,153,154,156,157,159,160,162,163,165,166,168,169,197,198,200,201],
		[1,2,3,7,8,9,13,17,18,19,23,25,29,32,35,36,38,42,44,48,51,53,54,57,60,61,63,66,67,70,71,72,77,78,79,80,83,84,85,86,89,90,91,92,93,94,115,116,120,121,125,126,131,133,136,138,141,143,146,149,150,154,157,160,162,165,167,169,172,176,179,181,184,186,187,188,189,190,191,192,193,196,197,201,202,207],
		[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,28,29,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,76,77,78,79,80,81,82,84,85,86,87,89,90,91,92,93,94,104,105,114,115,116,117,118,119,120,122,123,124,125,127,128,129,130,131,132,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,180,181,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208],
		[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,20,21,22,23,24,25,26,30,31,32,33,34,35,36,40,41,42,43,44,47,50,51,52,53,54,57,60,61,62,63,65,66,67,69,70,71,72,75,76,77,80,81,82,85,88,89,90,93,94,95,96,97,100,101,102,106,107,108,111,112,113,114,115,116,117,120,121,122,123,124,125,126,129,130,131,132,133,134,135,136,137,140,141,142,143,144,147,148,149,150,151,152,153,154,155,156,157,165,166,167,168,169,170,171,172,173,174,175,176,177,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,201,202,203,204,205,206,207,208],
		[21,24,25,26,27,28,30,31,34,39,40,41,46,47,48,49,50,52,54,59,60,64,65,67,69,70,73,79,80,82,89,90,91,93,96,97,99,101,104,106,109,110,112,115,116,129,130,131,134,135,144,149,150,153,155,156,160,163,164,168,169,173,174,175,176,177,178,180,181,182,183,184,185,186],
		[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,22,23,24,26,27,28,30,31,32,34,35,36,38,42,46,50,54,57,58,60,61,62,64,65,66,68,69,70,72,73,74,77,78,79,81,82,83,85,86,87,89,90,91,93,94,97,101,105,109,113,115,116,117,119,120,121,123,124,125,127,128,129,131,132,133,134,136,137,138,140,141,142,144,145,146,148,149,150,152,156,160,164,168,171,172,174,175,176,178,179,180,182,183,184,186,187,188,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208],
		[0,1,2,3,5,6,7,8,10,11,16,17,18,19,20,21,22,23,24,25,26,27,29,30,31,34,35,36,37,39,40,44,45,49,50,51,52,53,54,56,59,60,62,63,66,69,70,71,72,75,79,80,81,84,85,86,89,90,94,102,103,104,105,106,113,117,118,119,122,123,124,127,128,132,135,136,137,138,139,142,145,146,147,148,151,153,154,158,159,163,164,165,166,167,168,170,171,172,173,174,175,176,177,178,179,181,182,183,186,187,188,189,190,191,192,193,194,195,196,197,198,200,201,206,207,208],
		[1,7,14,15,19,20,21,24,25,26,27,28,31,34,36,39,42,43,44,46,47,49,50,51,53,60,61,62,66,69,72,73,74,75,76,77,78,79,80,83,86,90,91,95,99,101,102,103,105,106,108,109,112,116,121,124,125,126,127,130,131,132,134,135,136,138,142,146,147,150,154,157,158,159,160,163,166,167,171,175,176,177,178,181,182,183,185,186,187,188,189,190,191,193,194,195,196,201,205,208],
		[3,9,15,21,22,23,27,28,29,33,34,35,39,40,41,42,43,45,46,47,48,49,51,52,53,54,55,59,60,61,65,66,67,71,72,73,79,85,91,115,116,118,119,121,122,124,125,127,128,130,131,134,138,140,144,146,150,155,161,167,172,176,178,182,184,188,191,192,194,195,197,198,200,201,203,204,206,207],
		[4,13,22,23,24,31,32,33,40,41,42,43,44,49,50,51,52,53,58,59,60,61,62,63,64,67,68,69,70,71,72,73,115,116,117,118,119,120,121,124,125,126,127,128,129,130,135,136,137,138,139,144,145,146,147,148,155,156,157,164,165,166,175,184],
		[0,3,4,7,8,11,12,15,16,21,22,25,26,29,30,33,34,37,39,40,43,44,47,48,51,52,55,56,57,58,61,62,65,66,69,70,73,74,76,79,80,83,84,87,88,91,92,97,98,101,102,105,106,109,110,113,115,116,119,120,123,124,127,128,131,132,133,134,137,138,141,142,145,146,149,150,152,155,156,159,160,163,164,167,168,173,174,177,178,181,182,185,186,189,191,192,195,196,199,200,203,204,207,208],
		[1,2,6,7,10,11,12,13,19,22,24,27,38,41,43,46,48,49,50,51,52,53,54,57,59,60,62,64,65,77,78,79,82,83,84,86,87,88,89,90,91,92,93,94,115,116,120,123,127,129,130,131,132,133,139,142,143,145,146,148,152,154,155,157,159,161,162,163,164,165,167,168,169,170,171,174,176,177,178,180,182,184,186,191,192,193,195,197,199,203,205,206,207,208],
		[1,2,9,10,11,12,13,17,18,19,20,23,24,25,26,27,28,33,36,37,38,41,42,43,44,59,60,61,62,63,64,68,69,70,72,73,77,78,79,82,83,84,86,87,93,95,96,97,102,103,104,105,106,112,113,115,116,117,120,121,122,124,125,131,135,136,137,138,139,140,144,145,146,148,149,152,155,156,157,158,171,172,175,176,177,178,179,180,185,188,189,191,192,199,200,201,202,203,207,208],
		[0,1,2,3,4,5,13,14,15,16,17,18,19,20,21,25,31,35,36,37,39,40,41,44,45,49,50,53,54,55,59,60,61,63,64,65,67,68,69,71,72,73,79,80,81,82,83,87,88,89,90,91,99,100,101,107,108,109,117,118,119,120,121,125,126,127,128,129,135,136,137,139,140,141,143,144,145,147,148,149,153,154,155,158,159,163,164,167,168,169,171,172,173,177,183,187,188,189,190,191,192,193,194,195,203,204,205,206,207,208],
		[0,1,2,4,8,9,12,14,16,17,18,20,23,26,29,31,33,35,39,42,45,48,50,52,54,55,56,58,61,64,67,70,73,76,77,78,80,81,84,85,89,92,93,94,114,118,121,122,125,128,134,136,139,142,144,147,154,158,161,163,166,173,177,180,182,185,192,197,198,202,203,207],
		[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,37,38,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,56,57,59,73,75,76,78,80,81,82,83,84,85,86,87,88,89,92,94,95,97,99,111,113,114,116,118,119,120,121,122,123,124,125,126,127,128,129,130,132,133,135,151,152,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208],
		[1,6,7,8,10,11,12,17,20,21,25,26,27,29,30,31,35,36,40,41,45,46,47,48,49,53,54,60,61,65,66,67,71,72,76,80,81,85,89,90,94,95,96,100,101,107,108,112,113,114,118,119,123,127,128,132,136,137,141,142,143,147,148,154,155,159,160,161,162,163,167,168,172,173,177,178,179,181,182,183,187,188,191,196,197,198,200,201,202,207],
		[1,2,3,4,6,7,8,9,10,11,12,14,15,16,17,20,21,22,25,26,27,28,29,30,31,34,35,36,39,40,54,55,58,74,77,78,92,93,96,97,98,101,102,103,104,105,106,107,110,111,112,115,116,117,118,120,121,122,124,125,126,128,129,130,131,134,135,136,137,138,139,140,144,145,146,147,148,149,150,153,154,155,156,157,158,164,165,166,167,168,169,172,173,174,186,187,188,191,192,193,194,195,197,198,199,200,201,203,204,205,206,207],
		[0,4,6,7,8,10,11,12,13,15,18,19,23,25,29,32,34,37,38,39,41,42,44,45,46,48,49,50,54,55,58,59,60,63,67,70,73,74,78,82,83,84,86,89,92,93,115,116,117,120,121,125,126,129,130,131,133,138,141,143,146,148,151,152,154,155,157,160,162,165,167,170,171,174,176,179,181,184,186,189,191,192,193,196,197,201,202,205,206,207],
		[2,21,31,32,35,36,39,40,41,48,49,50,51,54,55,56,57,58,59,60,63,67,68,69,70,71,73,74,75,76,77,78,79,80,82,83,86,87,88,89,90,92,93,94,95,97,99,101,102,103,105,106,108,109,111,113,114,115,116,117,118,120,122,124,125,126,127,128,130,131,132,133,134,136,137,139,140,141,143,145,146,147,149,150,151,152,153,154,155,156,158,159,160,162,163,164,166,167,168,170,171,172,173,174,175,177,178,179,181,182,183,184,185,186,187,188,189,190,191,192,193,194,196,197,198,200,201,202,203,204,205,206,207,208],
		[21,22,32,40,41,50,51,52,58,59,60,61,68,69,70,71,72,77,78,79,80,86,87,88,90,91,92,95,96,97,98,99,100,104,105,106,108,110,111,112,114,115,116,117,118,119,122,123,124,125,126,127,128,129,130,131,132,135,136,143,145,147,149,154,155,162,164,166,168,173,174,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208]		
	]
	var map=[];
	//开始游戏
	$('.starGame').click(function(){
		map=[];
		for(var i=0;i<$('.map_draw ul li').length;i++){
			if($('.map_draw ul li').eq(i).css('background-color')=='rgb(102, 102, 102)'){
				map.push(i);
			}
		}
		if(map.length%2!=0){
			alertx('你绘制的图形数量不能为奇数');
			return;
		}else if(map.length<4){
			alertx('你绘制的图形数量不能小于4个');
			return;
		}
		if(isCustom)$('.custom').click();
		$('.map_draw ul li').css('background-color','transparent');	
		horitCount=19;
		vertiCount=11;
		minGroup=4;
		typeCount=map.length%4==0?map.length/4:(map.length-2)/4;
		promptCount=5;
		refreshCount=3;		
		reset();
		$('#maps').hide();
		$('#game_interface').show();
		start=setInterval(countdown,1000);
	});
	
	function alertx(str){
		$('#lock2 p').html(str);
		$('#lock2').show();
		$('#lock2 input')[0].focus();
		$('#lock2 input').click(function(){
			$('#lock2').hide();
		});
	}
	
	//离开地图选择
	$('.leave_draw').click(function(){
		$('#maps').hide();
		$('#main_menu').show();	
		if(isCustom)$('.custom').click();
		$('.map_draw ul li').css('background-color','transparent');
	});
	//图库样式设置
	for(var i=0;i<43;i++){
		$('.map_depot ul').append('<li></li>');
	}
	//点击图库
	$('.map_depot ul li').click(function(){
		$('.map_draw ul li').css('background-color','transparent');
		map=maps[$(this).index()];
		for(var i=0;i<map.length;i++){
			$('.map_draw ul li').eq(map[i]).css('background-color','#666');
		}
	});	
	//上一页和下一页点击时间，用到预加载，什么时候浏览时候加载图片，不浏览自动销毁
	var map_page=0;
	$('.bottom').click(function(){
		if(!$('.map_depot ul').is(':animated')){
			$('.top').show();
			map_page++;
			if(map_page==10) $('.bottom').hide();
			else $('.bottom').show();
			for(var i=map_page*4;i<map_page*4+4;i++){
				$('.map_depot ul li').eq(i).html('<img src="map/map'+(i+1)+'.jpg" />')		
			}
			$('.map_depot ul li').slice(map_page*4,map_page*4+4).show();
			$('.map_depot ul').animate({'margin-top':-380*map_page},800,function(){
				$('.map_depot ul li').slice((map_page-1)*4,(map_page-1)*4+4).html('');
			});
		}		
	});
	$('.top').click(function(){
		if(!$('.map_depot ul').is(':animated')){
			$('.bottom').show();
			map_page--;
			if(map_page==0) $('.top').hide();
			else $('.top').show();
			for(var i=map_page*4;i<map_page*4+4;i++){
				$('.map_depot ul li').eq(i).html('<img src="map/map'+(i+1)+'.jpg" />')		
			}
			$('.map_depot ul li').slice(map_page*4,map_page*4+4).show();
			$('.map_depot ul').animate({'margin-top':-380*map_page},800,function(){
				$('.map_depot ul li').slice((map_page+1)*4,(map_page+1)*4+4).html('');
			});
		}
	});
	
	//=========================================================设置游戏界面
	

	
	//关卡标题居中、背景图布满
	$('body').css('background-size',$(window).width()+'px '+$(window).height()+'px');
	$('#help').css('left',($(window).width()-$('#help').width())/2+'px');
	$('.checkpoint').css('left',($(window).width()-$('.checkpoint').width())/2+'px');
	$('.checkpoint').css('top',($(window).height()-$('.checkpoint').height())/2+'px');
	$('#lock2 .message').css('margin-top',($(window).height()-$('#lock2 .message').height())/2-50+'px');
	//某些浏览器有时不居中，所以在load事件里也写一遍
	window.onload=function(){
		$('.checkpoint').css('left',($(window).width()-$('.checkpoint').width())/2+'px');
		$('.checkpoint').css('top',($(window).height()-$('.checkpoint').height())/2+'px');

		$('#right_option').css('top',($(window).height()-$('#right_option').height())/2-30+'px');
		$('.map_draw').css('margin-left',($(window).width()-$('.map_draw').width())/2-80+'px');
		$('.map_draw').css('margin-top',($(window).height()-$('.map_draw').height())/2+'px');		
		$('#help').css('left',($(window).width()-$('#help').width())/2+'px');
		
		$('#lock2 .message').css('margin-top',($(window).height()-$('#lock2 .message').height())/2-50+'px');
	
		$('#setUp').css('left',($(window).width()-$('#setUp').width())/2+'px');
	};
	//窗口大小改变时自适应
	window.onresize=function(){
		$('body').css('background-size',$(window).width()+'px '+$(window).height()+'px');
	
		$('.checkpoint').css('left',($(window).width()-$('.checkpoint').width())/2+'px');
		$('.checkpoint').css('top',($(window).height()-$('.checkpoint').height())/2+'px');
	
		$('#box').css('margin-left',($(window).width()-$('#box').width())/2+'px');
		$('#box').css('margin-top',($(window).height()-$('#box').height())/2+'px');
		
		$('#right_option').css('top',($(window).height()-$('#right_option').height())/2-30+'px');
		$('.map_draw').css('margin-left',($(window).width()-$('.map_draw').width())/2-80+'px');
		$('.map_draw').css('margin-top',($(window).height()-$('.map_draw').height())/2+'px');
		$('#help').css('left',($(window).width()-$('#help').width())/2+'px');
		
		$('#lock2 .message').css('margin-top',($(window).height()-$('#lock2 .message').height())/2-50+'px');
	
		$('#setUp').css('left',($(window).width()-$('#setUp').width())/2+'px');
	};
	window.onscroll=function(){
		$('body').css('background-position','0 '+$(window).scrollTop()+'px');
	};
	document.onmousedown=function(e){
		e.preventDefault();
	};
	document.oncontextmenu=function(){return false;}
	
	var mess={
		group	:minGroup,		//平均每个样式的个数
		typeCou	:typeCount,		//样式种类数
		width	:horitCount,		//水平方向的个数
		height	:vertiCount		//竖直方向的个数
	};
	var checkpoint=1;	//当前关卡
	
	var isClick=false;	//是否有图片被点
	var old;			//保存旧对象

	var lin_type;		//前方情况（有路或没路，或到顶格）
	var lin_len=0;		//能够前进的距离
	
	var carom_odate;	//第一个点击的时间点
	var carom_ndate;	//第二个点击的时间点
	var carom_count=0;	//当前连击数
	var count=0;		//记录被消除的图像个数
	var grades=0;		//总分
	var max_carom=0;	//最大连击数
	var prompts={};		//存放当前可以消除的对象对
	
	var prom_count=promptCount;	//提示工具个数
	var ref_count=refreshCount;	//换位工具个数
	
	var cp_cont;	//经典模式第一关标题
	var contents=[];	//存放各图片的路径地址
	function setImg(obj){
		setAssembly(obj);
		
		contents=[];
		var excess=obj.width * obj.height - obj.group * obj.typeCou;
		/*if(excess<0){
			alert('width * height不能小于group * typeCou');
			return;
		}else if(excess%2!=0){
			alert('width * height - group * typeCou必须是奇数');
			return;
		}else if(obj.group%2!=0){
			alert('平均每个样式的个数必须是偶数');
			return;
		}*/
		if((gameType==1&&xx_type=='dt')||gameType==4){
			var conts=[];
			//按照种类和个数给conts赋值一组随机数
			for(var i=0;i<obj.group;i++){
				for(var j=0;j<obj.typeCou;j++){
					conts[j+i*obj.typeCou]=j+1;
				}
			}
			//如果个数多于种类乘以数量，那就是少赋值两个
			if(map.length-obj.typeCou*obj.group!=0){
				var rand_type=Math.floor(Math.random()*obj.typeCou);
				conts[conts.length]=rand_type;			
				conts[conts.length]=rand_type;	
			}
			//conts里的值顺序再打乱
			for(var i=0;i<conts.length;i++){
				var t=conts[i];
				var random=Math.floor(Math.random()*conts.length);
				conts[i]=conts[random];
				conts[random]=t;
			}
			//按照map值的顺序给contents赋值
			for(var i=0;i<map.length;i++){
				contents[map[i]]=conts[i];
			}
			//多余的用0代替
			for(var i=0;i<11*19;i++){
				if(typeof contents[i]=='undefined')contents[i]=0;
			}
		}else{
			for(var i=0;i<obj.group;i++){
				for(var j=0;j<obj.typeCou;j++){		
					//随机生成一个数，从0到typeCou取一个，每typeCou个进行一组随机
					var content=Math.floor(Math.random()*obj.typeCou)+(i*obj.typeCou);
					//将随机数放入循环，判断这个数对应的索引是否有值，有值则重新再取个随机数
					while((typeof contents[content]) != 'undefined'){
						content=Math.floor(Math.random()*obj.typeCou)+(i*obj.typeCou);
					}
					//给数组放入各图片路径，索引将由content决定
					contents[content]=j+1;
				}			
			}
			//剩下的是超过group的，设置不固定组数
			if(excess!=0){
				var partCont=[];	//临时数组
				for(var i=0;i<excess/2;i++){
					partCont.push(Math.floor(Math.random()*obj.typeCou+1));	//存放随机数
				}				
				for(var i=0;i<2;i++){
					for(var j=0;j<partCont.length;j++){
						contents.push(partCont[j]);			//导入不固定个数的随机组
					}	
				}
				//数组内的数字随机打乱
				for(var i=obj.group * obj.typeCou;i<contents.length;i++){
					var t=contents[i];
					var _index=Math.floor(Math.random()*contents.length);
					contents[i]=contents[_index];
					contents[_index]=t;
				}
			}
		}
		importImg(obj);
	}	
	//设置游戏的各组件
	function setAssembly(obj){
		if (typeof(document.onselectstart) != "undefined") {
			document.onselectstart = new Function("return false");       
		} else {
			document.onmousedown = new Function("return false");       
			document.onmouseup = new Function("return true");       
		} 
		
		$('#box').width(obj.width*imgWH).height(obj.height*imgWH);
		$('#box').css('margin-left',($(window).width()-$('#box').width())/2+'px');
		$('#box').css('margin-top',($(window).height()-$('#box').height())/2+'px');
		
		setTimeout(function(){
			while(!prompt()){$('.refresh').click();ref_count++;}
		},100);
		
		if((gameType==1&&(xx_type=='ct'||xx_type=='dt'))||gameType==2||gameType==4){
			$('.checkpoint').html('第'+checkpoint+'关');
		}else if((gameType==1&&xx_type=='jd')||gameType==3){
			if(checkpoint==15&&cp_cont!='困难'){
				var index=cp_cont=='简单'?1:(cp_cont=='普通'?0:0);
				var _grades=grades;
				checkpoint=1;
				$('.mainMenu').click();				
				return (function(){
					if(gameType==3)$('.jd_diff input').eq(index).click();
					else $('.xx_diff input').eq(1).trigger('click',[index]);
					grades=_grades;
					$('#grades').text(grades);
				})();
			}
			
			$('.checkpoint').html('第'+checkpoint+'关  '+getGameType());
		}				
		$('.checkpoint').show().delay(1000).fadeOut('slow',function(){$('.checkpoint').css('opacity','0.8')});
	}	
	
	//图像导入
	function importImg(obj){
		for(var i=0;i<obj.width*obj.height;i++){
			if(contents[i]==0){
				$('#box ul').append('<li style="visibility:hidden"></li>');
				continue;
			}
			if(icon==0){
				$('#box ul').append('<li>'+contents[i]+'</li>');
				$('#box li').css('background','#'+setImg_color);	
			}else if(icon==1){
				$('#box ul').append('<li><img src="images/icon1/'+contents[i]+'.gif" /></li>');
				$('#box li img').width(40).height(40).css('margin-top','6px');				
			}else if(icon==2){
					$('#box ul').append('<li><img src="images/icon2/'+contents[i]+'.jpg" /></li>');
				if((gameType==1&&xx_type=='dt')||gameType==4){
					$('#box li img').width(45).height(43).css('margin-top','2px');					
				}else{
					$('#box li img').width(50).height(50).css('margin-top','3px');
				}			
			}		
		}
	}
	//获得经典模式的关卡类型
	function getGameType(){
		var	cp_type;
		switch(checkpoint){
			case 1:cp_type=cp_cont;break;
			case 2:cp_type='向下移到';break;
			case 3:cp_type='向上移到';break;
			case 4:cp_type='上下分离';break;
			case 5:cp_type='左右分离';break;
			case 6:cp_type='向左移到';break;
			case 7:cp_type='向右移到';break;
			case 8:cp_type='上下集中';break;
			case 9:cp_type='左右集中';break;
			case 10:cp_type='上左下右';break;
			case 11:cp_type='左下右上';break;
			case 12:cp_type='向外扩散';break;
			case 13:cp_type='向内集中';break;
			default:cp_type='随机移到';
		}
		return cp_type;
	}	
	
	//绑定点击事件并设置点击效果
	$('#box').on('click','li',function(e){	
		$('#sound').attr('src','music/click.mp3');
		clearInterval(prom_ani);
		$('#box li').stop(true,true);
		if(!isClick){			
			$('#sound')[0].play();
			old=this;
			$(this).css('border-color','#333').css('opacity','1').css('box-shadow','0 0 20px #333 inset');
			isClick=true;
		}else{
			if(this==old){
				$('#sound')[0].play();
				$(this).css('border-color','#ccc').css('opacity','0.8').css('box-shadow','none');
				isClick=false;
			}else{
				//图片内容相同并符合规则的消除两个图片
				if($(this).html()==$(old).html()&&isSucc(old,this)){
					$('#sound').attr('src','music/remove.mp3');
					$('#sound')[0].play();
					$(this).css({visibility:'hidden','border-color':'#ccc','box-shadow':'none'})
					$(old).css({visibility:'hidden','border-color':'#ccc','box-shadow':'none'})
					isClick=false;
					count+=2;					
					carom();
					setGrade(e);
					if((gameType==1&&xx_type=='jd')||gameType==3){
						if(checkpoint>=2)$('#box li').css('opacity','0.8');
						classic(old,this);
					}
					
					//过关，数据调整
					if(count==mess.width * mess.height){
						setTimeout(function(){
							checkpoint++;
							count=0;
							if((gameType==1&&xx_type=='ct')||gameType==2)tradition();
							else if((gameType==1&&xx_type=='dt')||gameType==4){
								
								map=maps[parseInt(Math.random()*43)];				
								typeCount=map.length%4==0?map.length/4:(map.length-2)/4;
								mess.typeCou=typeCount;
								count=11*19-map.length;
							}
							$('#box ul').html('');
							setImg(mess);
							
							carom_count=1;
													
							time=iniTime;
							$('.time strong').css('background','#66a1cc');
							$('.time strong').width(time*(100/iniTime)+'%');
							$('.time strong').attr('title','剩下'+time+'秒');
							keepStyle();
						},300);
						
					}else if(count<mess.width * mess.height-2){
						setTimeout(function(){
							while(!prompt()){$('.refresh').click();ref_count++;}
						},110);
					}
				}else{
					if($(this).html()==$(old).html()){
						$('#sound').attr('src','music/remfail.mp3');
						$(this).css('border-color','#ccc').css('opacity','0.8').css('box-shadow','none');
						$(old).css('border-color','#ccc').css('opacity','0.8').css('box-shadow','none');
						isClick=false;
					}else if($(this).html()!=$(old).html()){
						$(this).css('border-color','#333').css('opacity','1').css('box-shadow','0 0 20px #333 inset');
						$(old).css('border-color','#ccc').css('opacity','0.8').css('box-shadow','none');
						old=this;
					}
					$('#sound')[0].play();					
				}
			}			
		}
	});
	//=====================传统模式
	function tradition(){	
			//图片总数调整
		if(checkpoint==4||checkpoint==5||checkpoint==6||checkpoint==11||checkpoint==14){
			mess.width+=1;
		}else if(checkpoint==7||checkpoint==8){
			mess.height+=1;
		}else if(checkpoint==3){
			mess.width+=1;
			mess.height+=1;
		}
		//种类个数调整
		if(checkpoint<=16){
			if(checkpoint!=5&&checkpoint!=7&&checkpoint!=8&&checkpoint!=11&&checkpoint!=14){
				mess.typeCou+=2;
			}
		}else if(checkpoint==17){
			mess.group=4;
		}else if(checkpoint==18){
			mess.group=2;
		}else if(checkpoint==19){
			mess.group=0;
		}
		
	}
	//====================================经典模式
	function classic(old,now){
		setTimeout(function(){
			switch(checkpoint){
				case 1:break;
				case 2:seriesExchange($(old),$(now),'bottom','bottom',1);break;
				case 3:seriesExchange($(old),$(now),'top','top',1);break;
				case 4:seriesExchange($(old),$(now),'top','bottom',2);break;
				case 5:seriesExchange($(old),$(now),'left','right',2);break;
				case 6:seriesExchange($(old),$(now),'left','left',1);break;
				case 7:seriesExchange($(old),$(now),'right','right',1);break;;
				case 8:seriesExchange($(old),$(now),'top','bottom',3);break;
				case 9:seriesExchange($(old),$(now),'left','right',3);break;
				case 10:seriesExchange($(old),$(now),'top','bottom',4);break;
				case 11:seriesExchange($(old),$(now),'left','right',4);break;
				case 12:
					if(parseInt(Math.random()*2+1)==1){
						seriesExchange($(old),$(now),'top','bottom',2);
					}else{
						seriesExchange($(old),$(now),'left','right',2);	
					}									
					break;
				case 13:
					if(parseInt(Math.random()*2+1)==1){
						seriesExchange($(old),$(now),'top','bottom',3);
					}else{	
						seriesExchange($(old),$(now),'left','right',3);
					}	
					break;
				default:
					switch(parseInt(Math.random()*10+1)){
						case 1:seriesExchange($(old),$(now),'bottom','bottom',1);break;
						case 2:seriesExchange($(old),$(now),'top','top',1);break;
						case 3:seriesExchange($(old),$(now),'top','bottom',2);break;
						case 4:seriesExchange($(old),$(now),'left','right',2);break;
						case 5:seriesExchange($(old),$(now),'left','left',1);break;
						case 6:seriesExchange($(old),$(now),'right','right',1);break;;
						case 7:seriesExchange($(old),$(now),'top','bottom',3);break;
						case 8:seriesExchange($(old),$(now),'left','right',3);break;
						case 9:seriesExchange($(old),$(now),'top','bottom',4);break;
						case 10:seriesExchange($(old),$(now),'left','right',4);break;
					}
			}
		},100);
		
	}	
	
	//初始化游戏
	function reset(){
		musicShow();
		
		$('#box ul').html('');
		checkpoint=1;
		mess.typeCou=typeCount;
		mess.width=horitCount;
		mess.height=vertiCount;
		mess.group=minGroup;
		setImg(mess);
		
		time=iniTime;		
		if((gameType==1&&xx_type=='dt')||gameType==4)count=11*19-map.length;
		else count=0;
		carom_count=1;
		grades=0;
		max_carom=0;
		
		prom_count=promptCount;
		$('.prompt').val(prom_count).show();
		ref_count=refreshCount;
		$('.refresh').val(ref_count).show();
		prom_iter=1;
		ref_iter=1;
		
		$('#grades').text(grades);
		$('.time strong').css('background','#66a1cc');
		$('.time strong').width('100%');
		$('.time strong').attr('title','剩下'+time+'秒');
		clearInterval(prom_ani);
		keepStyle();
		
	}
	//读取存储数据
	function readGame(ckobj){
		musicShow();
		
		$('#box ul').html('');
		checkpoint=ckobj.checkpoint;
		
		if(gameType==1){
			if(ckobj.type.indexOf('ct')>0)xx_type='ct';
			else if(ckobj.type.indexOf('jd')>0)xx_type='jd';
			else if(ckobj.type.indexOf('dt')>0)xx_type='dt';
		}
		if((gameType==1&&xx_type=='dt')||gameType==4){
			map=ckobj.map;
			typeCount=map.length%4==0?map.length/4:(map.length-2)/4;
		}else typeCount=ckobj.typeCount;
		horitCount=ckobj.horitCount;
		vertiCount=ckobj.vertiCount;
		minGroup=ckobj.minGroup
		promptCount=ckobj.promptCount;
		refreshCount=ckobj.refreshCount;
		iniTime=ckobj.iniTime;
		
		
		mess.width=horitCount;
		mess.height=vertiCount;
		mess.group=minGroup;
		mess.typeCou=typeCount;
		
		contents=ckobj.contents;
		importImg(mess);
		
		time=ckobj.time;		
		if((gameType==1&&xx_type=='dt')||gameType==4)count=ckobj.count;
		else count=ckobj.count;
		carom_count=1;
		grades=ckobj.grades;
		max_carom=ckobj.max_carom;
		
		prom_count=ckobj.prom_count;
		if(prom_count!=0)$('.prompt').val(prom_count).show();
		ref_count=ckobj.ref_count;
		if(ref_count!=0)$('.refresh').val(ref_count).show();
		prom_iter=ckobj.prom_iter;
		ref_iter=ckobj.ref_iter;
		
		$('#grades').text(grades);
		$('.time strong').css('background','#66a1cc');
		$('.time strong').width(time*(100/iniTime)+'%');
		$('.time strong').attr('title','剩下'+time+'秒');
		$('#main_menu').hide();		
		$('#game_interface').show();
		clearInterval(prom_ani);
		keepStyle();
		if(gameType!=1)start=setInterval(countdown,1000);
		
		setAssembly(mess);
	}
	
	//地图模式图片比较小，所以有些地方要保持样式
	function keepStyle(){		
		if((gameType==1&&xx_type=='dt')||gameType==4){
			imgWH=50;
			$('#box li').width(48).height(48).css('line-height','48px');
		}else{	
			imgWH=58;
			$('#box li').width(56).height(56).css('line-height','56px');
		}
		if(icon==0)$('#box li').css('background','#'+img_color);
		$('#box').width(mess.width*imgWH).height(mess.height*imgWH);
		$('#box').css('margin-left',($(window).width()-$('#box').width())/2+'px');
		$('#box').css('margin-top',($(window).height()-$('#box').height())/2+'px');
	}
	
	
	//=============================功能========================================
	//背景音乐开启
	function musicShow(){
		if(isPlay_music){
			var musics=[];		//播放列表
			var music_index=0;	//当前歌曲的索引
			var mu_list=[];
			for(var i=0;i<music_list.length;i++){
				if(music_list[i]!=-1)mu_list.push(music_list[i]);
			}
			//不重复的随机播放
			for(var i=0;i<mu_list.length;i++){
				var random=Math.floor(Math.random()*mu_list.length);
				while(typeof musics[random]!='undefined'){
					random=Math.floor(Math.random()*mu_list.length);
				}
				musics[random]=mu_list[i];
			}
			$('#bgMusic').attr('src','music/bgsound'+musics[music_index]+'.mp3');
			//背景音乐播放结束事件
			$('#bgMusic').get(0).addEventListener('ended',function(){
				music_index++;				
				if(music_index==14)music_index=0;
				$(this).attr('src','music/bgsound'+musics[music_index]+'.mp3').load();			
			},false);
		}
	}
	//时间进度条
	var time=iniTime;
	function countdown(){
		time--;
		if(time==20) $('.time strong').css('background','red');
		$('.time strong').width(time*(100/iniTime)+'%');
		$('.time strong').attr('title','剩下'+time+'秒');
		if(time==0){
			$('#sound').attr('src','music/gameover.mp3');
			$('#sound')[0].play();	
			$('#bgMusic')[0].pause();
			
			$('#lock').show();
			$('#lock .end').show();
			clearInterval(start);
			if((gameType==1&&xx_type=='ct')||gameType==3){
				$('.max_checkpoint').text('第'+checkpoint+'关 '+getGameType());
			}else{
				$('.max_checkpoint').text('第'+checkpoint+'关');
			}
			$('.max_carom span').text(max_carom);
			$('.max_grades span').text(grades);
		}
	}
	var start;
	//暂停按钮
	$('.stop').click(stopGame);
	function stopGame(){
		$('#lock').show();
		$('#lock .pause').show();
		$('#bgMusic')[0].pause();
		clearInterval(start);
	}
	$('#lock .pause').click(function(){
		$('#lock').hide();
		$('#lock .pause').hide();
		$('#bgMusic')[0].play();
		if(gameType!=1)start=setInterval(countdown,1000);
	});
	
	//重新游戏按钮
	$('.reset').click(reset);
	
	//重新排版
	$('.refresh').click(function (){
		$('#sound').attr('src','music/transposition.mp3');
		$('#sound')[0].play();	
		
		ref_count--;
		$('.refresh').val(ref_count);
		if(ref_count==0) $('.refresh').hide();
		
		var conts=[];//存放当前没有被消除的对象
		var j=0;
		//将没有被消除的元素赋给临时变量
		for(var i=0;i<mess.width * mess.height;i++){
			if($('#box li').eq(i).css('visibility')!='hidden'){
				conts.push($('#box li').eq(i));
			}
		}
		//conts里的对象顺序打乱
		for(var i=0;i<conts.length;i++){
			var t=conts[i];
			var random=Math.floor(Math.random()*conts.length);
			conts[i]=conts[random];
			conts[random]=t;
		}
		//将conts的值拿到面板上
		for(var i=0;i<mess.width * mess.height;i++){			
			if($('#box li').eq(i).css('visibility')!='hidden'){
				$('#box li').eq(i).replaceWith('<li>'+conts[j].html()+'</li>');
				if(j!=conts.length) j++;
				else break;
			}
		}
		keepStyle();
		
		clearInterval(prom_ani);
		while(!prompt()){$('.refresh').click();ref_count++;}
	});
	
	//点击提示
	var prom_ani;
	$('.prompt').click(function(){	
		$('#sound').attr('src','music/prompt.mp3');
		$('#sound')[0].play();	
		
		prom_count--;
		$('.prompt').val(prom_count);
		if(prom_count==0) $('.prompt').hide();
		
		clearInterval(prom_ani);
		prompt();
		prom_ani=setInterval(function(){
			prompts.old.animate({opacity:0},500,function(){
				$(this).animate({opacity:0.8},500);
			})
			prompts.now.animate({opacity:0},500,function(){
				$(this).animate({opacity:0.8},500);
			})
		},1000);
	});	
	
	//返回主菜单
	$('.mainMenu').click(function(){
		autoStorage();
		$('#bgMusic')[0].pause();
		clearInterval(start);
		$('#box ul').html('');
		$('#main_menu').show();		
		$('#game_interface').hide();
		xx_type='';
		horitCount=12;
		vertiCount=7;
		typeCount=10;
		minGroup=6;
		imgWH=58;
		iniTime=150;
		promptCount=3;
		refreshCount=1;
		gameType=2;
		setTitle();
	});	
	
	//点击重新游戏
	$('.end input').on('click',function(){
		$('#lock').hide();
		$('#lock .end').hide();
		$('.mainMenu').click();
	});		
	
	//连击系统
	function carom(){
		if(carom_count==0){
			var date=new Date();
			carom_odate=carom_ndate=date.getTime();			
			carom_count++;
		}else{
			var date=new Date();
			carom_ndate=date.getTime();
			if(carom_ndate-carom_odate<=3000){
				carom_count++;
				if(carom_count>=2){
					$('#carom')
						.stop(true)
						.css('bottom','-140px')
						.show().animate({bottom:'10px'},500)
						.animate({bottom:'10px'},2000)
						.animate({bottom:'-140px'},500,function(){$(this).hide();});
							
					$('.carCou').text(carom_count+'连击');
					if(gameType!=1){
						time++;
						$('.time strong').width(time*(100/iniTime)+'%');
						$('.time strong').attr('title','剩下'+time+'秒');
					}
					
					max_carom=max_carom>carom_count?max_carom:carom_count;
				}			
			}else{
				carom_count=1;
			}
			carom_odate=carom_ndate;
		}
	}
	
	//分数系统
	var prom_iter=1;
	var ref_iter=1;
	function setGrade(e){
		var x=e.clientX;
		var y=e.clientY;
		$('#grade').text('+'+carom_count*10);
		$('#grade')
			.stop(true,true)
			.css({
					'left': x+'px',
					'top': y+20+'px',
					'display':'block'
				})
			.animate({
				top:y-20+'px',
				opacity:0
			},1000,function(){
				$(this).hide().css('opacity','1');
			});
		grades+=carom_count*10;
		$('#grades').text(grades);
		
		if(parseInt(grades/2000)==prom_iter){
			prom_iter++
			prom_count++;
			$('.prompt').val(prom_count).show();
		}
		if(parseInt(grades/4000)==ref_iter){
			ref_iter++;
			ref_count++;
			$('.refresh').val(ref_count).show();
		}
	}
	
	//判断是否还有可以相除的，有则返回可以消除的对象对
	function prompt(){
		var conts=[];
		prompts={};
		for(var i=0;i<mess.width * mess.height;i++){
			if($('#box li').eq(i).css('visibility')!='hidden'){
				conts.push($('#box li').eq(i));
			}
		}
		for(var i=0;i<conts.length;i++){
			for(var j=i+1;j<conts.length;j++){
				if(conts[i].html()==conts[j].html()&&
						isSucc(conts[i].get(0),conts[j].get(0))){
					prompts.old=conts[i];
					prompts.now=conts[j];
					return true;
				}
			}
		}
		return false;
	}
	
	//自动储存
	function autoStorage(){
		if($('#game_interface').css('display')!='none'&&time!=0){
			for(var i=0;i<$('#box li').size();i++){
				if($('#box li').eq(i).css('visibility')=='hidden'){
					contents[i]=0;
				}
			}
			
			var cookieValue=horitCount+'&'+vertiCount+'&'+typeCount+'&'+minGroup+'&'+promptCount
			+'&'+refreshCount+'&'+iniTime+'&'+time+'&'+checkpoint+'&['+contents+']&'+count+'&'+grades
			+'&'+max_carom+'&'+prom_count+'&'+ref_count+'&'+prom_iter+'&'+ref_iter;
			if(gameType==1){
				if(xx_type!='dt')cookieValue+='&"'+xx_type+'"';
				else cookieValue+='&"'+xx_type+'"&['+map+']';
			} 
			else if(gameType==4)cookieValue+='&['+map+']';
			
			if(gameType==1)setCookie('xx_cookie',cookieValue,setCookieDate(30));
			else if(gameType==2)setCookie('ct_cookie',cookieValue,setCookieDate(30));
			else if(gameType==3)setCookie('jd_cookie',cookieValue,setCookieDate(30));
			else if(gameType==4)setCookie('dt_cookie',cookieValue,setCookieDate(30));
		}
	}
	window.onunload = autoStorage;	//关闭或刷新页面自动保存
	
	//触碰显示提示说明
	function setInstruction(objstr,title){
		$(objstr).hover(function(e){
			$('#instruction').css({
				top:e.clientY-15+'px',
				left:e.clientX+15+'px'
			}).html(title).show();
		},function(){
			$('#instruction').hide();
		});		
	}
	//设置“读档”的提示语
	function setTitle(){
		var ckobj1=valueOfObj(getCookie('xx_cookie'));
		var ckobj2=valueOfObj(getCookie('ct_cookie'));
		var ckobj3=valueOfObj(getCookie('jd_cookie'));
		var ckobj4=valueOfObj(getCookie('dt_cookie'));
		var type;
		var diff='简单';
		
		if(ckobj1.type.indexOf('ct')>0)type='传统';
		else if(ckobj1.type.indexOf('jd')>0)type='经典';
		else if(ckobj1.type.indexOf('dt')>0)type='地图';
		
		if(ckobj3.vertiCount==6)diff='简单';
		else if(ckobj3.vertiCount==7)diff='普通';
		else if(ckobj3.vertiCount==8)diff='困难';
		
		setInstruction('.xx_diff input[value="读档"]','您上次玩到【'+type+'模式】的第'+ckobj1.checkpoint+'关');		
		setInstruction('.ct_diff input[value="读档"]','您上次玩到第'+ckobj2.checkpoint+'关');
		setInstruction('.jd_diff input[value="读档"]','您上次玩到【'+diff+'】难度的第'+ckobj3.checkpoint+'关');
		setInstruction('.dt_diff input[value="读档"]','您上次玩到第'+ckobj4.checkpoint+'关');			
	}
	setTitle();
	//===========================Cookie=========================
	
	//value='horitCount,vertiCount,typeCount,minGroup,promptCount,refreshCount,iniTime,time'+
	//'checkpoint,contents,count,grades,max_carom,prom_count,ref_count,prom_iter,ref_iter,type,map';
	
	//创建cookie
	function setCookie(name, value, expires, path, domain, secure) {
		var cookieText = encodeURIComponent(name) + '=' + encodeURIComponent(value);
		if (expires instanceof Date) {
			cookieText += '; expires=' + expires;
		}
		if (path) {
			cookieText += '; expires=' + expires;
		}
		if (domain) {
			cookieText += '; domain=' + domain;
		}
		if (secure) {
			cookieText += '; secure';
		}
		document.cookie = cookieText;
	}
	//获取cookie
	function getCookie(name) {
		var cookieName = encodeURIComponent(name) + '=';
		var cookieStart = document.cookie.indexOf(cookieName);
		var cookieValue = null;
		if (cookieStart > -1) {
			var cookieEnd = document.cookie.indexOf(';', cookieStart);
		if (cookieEnd == -1) {
			cookieEnd = document.cookie.length;
		}
		cookieValue = decodeURIComponent(
			document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
		}
		return cookieValue;
	}
	//删除cookie
	function unsetCookie(name) {
		document.cookie = name + "= ; expires=" + new Date(0);
	}
	//失效时间
	function setCookieDate(day) {
		if (typeof day == 'number' && day > 0) {
			var date = new Date();
			date.setDate(date.getDate() + day);
		} else {
			throw new Error('传递的day 必须是一个天数，必须比0 大');
		}
		return date;
	}
	//键值字符串转化为对象
	function valueOfObj(str){
		var strs=str.split('&');
		var obj={};
		obj={
			horitCount:parseInt(strs[0]),
			vertiCount:parseInt(strs[1]),
			typeCount:parseInt(strs[2]),
			minGroup:parseInt(strs[3]),
			promptCount:parseInt(strs[4]),
			refreshCount:parseInt(strs[5]),
			iniTime:parseInt(strs[6]),
			time:parseInt(strs[7]),
			checkpoint:parseInt(strs[8]),
			contents:eval(strs[9]),
			count:parseInt(strs[10]),
			grades:parseInt(strs[11]),
			max_carom:parseInt(strs[12]),
			prom_count:parseInt(strs[13]),
			ref_count:parseInt(strs[14]),
			prom_iter:parseInt(strs[15]),
			ref_iter:parseInt(strs[16])
		};
		if(strs.length==18){
			if(strs[17].indexOf('[')==-1)obj.type=strs[17];
			else obj.map=eval(strs[17]);			
		}else if(strs.length==19){
			obj.type=strs[17];
			obj.map=eval(strs[18]);
		}
		return obj;
	}
	
	//=========================================规则=========================================
	//规则设定
	function isSucc(old,now){
		//距离父类的左上角
		var opos={
			x:$(old).position().left,
			y:$(old).position().top
		};
		var npos={
			x:$(now).position().left,
			y:$(now).position().top
		};
		
		//相邻的和最外层的
		if((Math.abs(opos.x-npos.x)==imgWH&&opos.y==npos.y)||(Math.abs(opos.y-npos.y)==imgWH&&opos.x==npos.x)){
			return true;
		}else if((hasLine($(old),'left',2)==-1 && hasLine($(now),'left',2)==-1)
					||(hasLine($(old),'right',2)==-1 && hasLine($(now),'right',2)==-1)
					||(hasLine($(old),'top',2)==-1 && hasLine($(now),'top',2)==-1)
					||(hasLine($(old),'bottom',2)==-1 && hasLine($(now),'bottom',2)==-1)){
			return true;
		}
		//横向消除
		function horiz(old,now){
			var opos={
				x:$(old).position().left,
				y:$(old).position().top
			};
			var npos={
				x:$(now).position().left,
				y:$(now).position().top
			};
			if(opos.x>npos.x){
				hasLine($(old),'left',2);
				if(lin_len>=opos.x-npos.x-imgWH){
					return true;
				}			
			}else{
				hasLine($(now),'left',2);
				if(lin_len>=npos.x-opos.x-imgWH){
					return true;
				}			
			}
			return false;
		}
		//纵向消除
		function verti(old,now){
			var opos={
				x:$(old).position().left,
				y:$(old).position().top
			};
			var npos={
				x:$(now).position().left,
				y:$(now).position().top
			};
			if(opos.y>npos.y){
				hasLine($(old),'top',2);
				if(lin_len>=opos.y-npos.y-imgWH){
					return true;
				}				
			}else{
				hasLine($(now),'top',2);
				if(lin_len>=npos.y-opos.y-imgWH){
					return true;
				}			
			}
			return false;
		}
		//----------直线
		if(opos.x==npos.x){	//同一x轴
			if(verti(old,now))return true;
		}else if(opos.y==npos.y){	//同一y轴
			if(horiz(old,now))return true;			
		}else
			
		//-----------一个拐弯折线
		if(opos.x!=npos.x&&opos.y!=npos.y){		
			if(isOneTurn('left','top'))return true;		//左+上
			if(isOneTurn('left','bottom'))return true;	//左+下
			if(isOneTurn('right','top'))return true;	//右+上
			if(isOneTurn('right','bottom'))return true;	//右+下
			if(isOneTurn('top','left'))return true;		//上+左
			if(isOneTurn('top','right'))return true;	//上+右
			if(isOneTurn('bottom','left'))return true;	//下+左		
			if(isOneTurn('bottom','right'))return true;	//下+右			
		}
		//oldPos第一次点击的可走的直线路径；nowPos第二次点击的直线路径，
		function isOneTurn(oldPos,nowPos){
			if(hasLine($(old),oldPos,1)==1 && hasLine($(now),nowPos,1)==1){
				hasLine($(old),oldPos,2);
				var olin=lin_len;
				hasLine($(now),nowPos,2);
				var nlin=lin_len;
				var isCut=false;
				switch(oldPos+'+'+nowPos){
					case 'left+top':
						//old向左 && now向上 && old是否是在now的右上边 && 是否能够相交
						isCut=oldPos=='left'&&nowPos=='top'&&opos.x > npos.x && opos.y < npos.y
							&&opos.x-olin <= npos.x &&  opos.y>=npos.y-nlin;
						break;
					case 'left+bottom':
						isCut=oldPos=='left'&&nowPos=='bottom'&&opos.x > npos.x && opos.y > npos.y  
							&&opos.x-olin <= npos.x && opos.y <= npos.y+nlin;
						break;
					case 'right+top':
						isCut=oldPos=='right'&&nowPos=='top'&&opos.x < npos.x && opos.y < npos.y
							&&opos.x+olin >= npos.x && opos.y >=npos.y-nlin;
						break;
					case 'right+bottom':
						isCut=oldPos=='right'&&nowPos=='bottom'&&opos.x < npos.x && opos.y > npos.y
							&&opos.x+olin >= npos.x && opos.y <= npos.y+nlin;
						break;
					case 'top+left':
						isCut=oldPos=='top'&&nowPos=='left'&&opos.x < npos.x && opos.y > npos.y
							&&opos.y-olin <= npos.y && opos.x >= npos.x-nlin;
						break;
					case 'top+right':
						isCut=oldPos=='top'&&nowPos=='right'&&opos.x > npos.x && opos.y > npos.y
							&&opos.y-olin <= npos.y && opos.x <= npos.x+nlin;
						break;
					case 'bottom+left':
						isCut=oldPos=='bottom'&&nowPos=='left'&&opos.x < npos.x && opos.y < npos.y
							&&opos.y+olin >= npos.y && opos.x >= npos.x-nlin;
						break;
					case 'bottom+right':
						isCut=oldPos=='bottom'&&nowPos=='right'&&opos.x > npos.x && opos.y < npos.y
							&&opos.y+olin >= npos.y && opos.x <= npos.x+nlin;
						break;
				}
				if(isCut)return true;
			}
			return false;
		}
		
		
		//---------------拐两个弯					
		if(isTwoTurn({pos1:'top',pos2:'left'},'top'))return true;		//上左+上
		if(isTwoTurn({pos1:'top',pos2:'left'},'bottom'))return true;	//上左+下
		if(isTwoTurn({pos1:'top',pos2:'right'},'top'))return true;		//上右+上
		if(isTwoTurn({pos1:'top',pos2:'right'},'bottom'))return true;	//上右+下*
		if(isTwoTurn({pos1:'bottom',pos2:'left'},'top'))return true;	//下左+上
		if(isTwoTurn({pos1:'bottom',pos2:'left'},'bottom'))return true;	//下左+下
		if(isTwoTurn({pos1:'bottom',pos2:'right'},'top'))return true;	//下右+上
		if(isTwoTurn({pos1:'bottom',pos2:'right'},'bottom'))return true;//下右+下*
		if(isTwoTurn({pos1:'right',pos2:'top'},'right'))return true;	//右上+右
		if(isTwoTurn({pos1:'right',pos2:'top'},'left'))return true;		//右上+左
		if(isTwoTurn({pos1:'right',pos2:'bottom'},'right'))return true;	//右下+右
		if(isTwoTurn({pos1:'right',pos2:'bottom'},'left'))return true;	//右下+左
		if(isTwoTurn({pos1:'left',pos2:'top'},'right'))return true;		//左上+右
		if(isTwoTurn({pos1:'left',pos2:'top'},'left'))return true;		//左上+左
		if(isTwoTurn({pos1:'left',pos2:'bottom'},'right'))return true;	//左下+右
		if(isTwoTurn({pos1:'left',pos2:'bottom'},'left'))return true;	//左下+左		
			
		//oldPos第一次点击的拐弯路径，传对象；nowPos第二次点击的直线路径，
		function isTwoTurn(oldPos,nowPos){
			if(hasLine($(old),oldPos.pos1,1)==1 && hasLine($(now),nowPos,1)==1){
				var olin=turnLen($(old),oldPos);
				hasLine($(now),nowPos,2);
				var nlin=lin_len;
				var isCut=false;
				for(var i=0;i<olin.len2.length;i++){
					switch(oldPos.pos1+' '+oldPos.pos2+'+'+nowPos){
						case 'top left+top':
							//路线是否是上左+上 && old是否在now同一直线或左下边
							isCut=oldPos.pos1=='top'&&oldPos.pos2=='left'&&nowPos=='top'&&opos.x > npos.x && opos.y-olin.len1[i] < npos.y
								&&opos.x-olin.len2[i] <= npos.x && opos.y-olin.len1[i] >= npos.y-nlin;
							break;
						case 'top left+bottom':
							isCut=oldPos.pos1=='top'&&oldPos.pos2=='left'&&nowPos=='bottom'&&opos.x > npos.x && opos.y-olin.len1[i] > npos.y
								&&opos.x-olin.len2[i] <= npos.x && opos.y-olin.len1[i] <= npos.y+nlin;
							break;
						case 'top right+top':
							isCut=oldPos.pos1=='top'&&oldPos.pos2=='right'&&nowPos=='top'&&opos.x < npos.x && opos.y-olin.len1[i] < npos.y
								&&opos.x+olin.len2[i] >= npos.x && opos.y-olin.len1[i] >= npos.y-nlin;
							break;
						case 'top right+bottom':
							isCut=oldPos.pos1=='top'&&oldPos.pos2=='right'&&nowPos=='bottom'&&opos.x < npos.x && opos.y-olin.len1[i] > npos.y
								&&opos.x+olin.len2[i] >= npos.x && opos.y-olin.len1[i] <= npos.y+nlin;
							break;
						case 'bottom left+top':
							isCut=oldPos.pos1=='bottom'&&oldPos.pos2=='left'&&nowPos=='top'&&opos.x > npos.x && opos.y+olin.len1[i] < npos.y
								&&opos.x-olin.len2[i] <= npos.x && opos.y+olin.len1[i] >= npos.y-nlin;
							break;
						case 'bottom left+bottom':
							isCut=oldPos.pos1=='bottom'&&oldPos.pos2=='left'&&nowPos=='bottom'&&opos.x > npos.x && opos.y+olin.len1[i] > npos.y
								&&opos.x-olin.len2[i] <= npos.x && opos.y+olin.len1[i] <= npos.y+nlin;
							break;
						case 'bottom right+top':
							isCut=oldPos.pos1=='bottom'&&oldPos.pos2=='right'&&nowPos=='top'&&opos.x < npos.x && opos.y+olin.len1[i] < npos.y
								&&opos.x+olin.len2[i] >= npos.x && opos.y+olin.len1[i] >= npos.y-nlin;
							break;
						case 'bottom right+bottom':
							isCut=oldPos.pos1=='bottom'&&oldPos.pos2=='right'&&nowPos=='bottom'&&opos.x < npos.x && opos.y+olin.len1[i] > npos.y
								&&opos.x+olin.len2[i] >= npos.x && opos.y+olin.len1[i] <= npos.y+nlin;
							break;
						case 'right top+right':
							isCut=oldPos.pos1=='right'&&oldPos.pos2=='top'&&nowPos=='right'&&opos.x+olin.len1[i] > npos.x && opos.y > npos.y
								&&opos.y-olin.len2[i] <= npos.y && opos.x+olin.len1[i] <= npos.x+nlin;
							break;
						case 'right top+left':
							isCut=oldPos.pos1=='right'&&oldPos.pos2=='top'&&nowPos=='left'&&opos.x+olin.len1[i] < npos.x && opos.y > npos.y
								&&opos.y-olin.len2[i] <= npos.y && opos.x+olin.len1[i] >= npos.x-nlin;
							break;
						case 'right bottom+right':
							isCut=oldPos.pos1=='right'&&oldPos.pos2=='bottom'&&nowPos=='right'&&opos.x+olin.len1[i] > npos.x && opos.y < npos.y
								&&opos.y+olin.len2[i] >= npos.y && opos.x+olin.len1[i] <= npos.x+nlin;
							break;
						case 'right bottom+left':
							isCut=oldPos.pos1=='right'&&oldPos.pos2=='bottom'&&nowPos=='left'&&opos.x+olin.len1[i] < npos.x && opos.y < npos.y
								&&opos.y+olin.len2[i] >= npos.y && opos.x+olin.len1[i] >= npos.x-nlin;
							break;
						case 'left top+right':
							isCut=oldPos.pos1=='left'&&oldPos.pos2=='top'&&nowPos=='right'&&opos.x-olin.len1[i] > npos.x && opos.y > npos.y
								&&opos.y-olin.len2[i] <= npos.y && opos.x-olin.len1[i] <= npos.x+nlin;
							break;
						case 'left top+left':
							isCut=oldPos.pos1=='left'&&oldPos.pos2=='top'&&nowPos=='left'&&opos.x-olin.len1[i] < npos.x && opos.y > npos.y
								&&opos.y-olin.len2[i] <= npos.y && opos.x-olin.len1[i] >= npos.x-nlin;
							break;
						case 'left bottom+right':
							isCut=oldPos.pos1=='left'&&oldPos.pos2=='bottom'&&nowPos=='right'&&opos.x-olin.len1[i] > npos.x && opos.y < npos.y
								&&opos.y+olin.len2[i] >= npos.y && opos.x-olin.len1[i] <= npos.x+nlin;
							break;
						case 'left bottom+left':
							isCut=oldPos.pos1=='left'&&oldPos.pos2=='bottom'&&nowPos=='left'&&opos.x-olin.len1[i] < npos.x && opos.y < npos.y
								&&opos.y+olin.len2[i] >= npos.y && opos.x-olin.len1[i] >= npos.x-nlin;
							break;	
					}
					if(isCut)return true;
				}				
			}
			return false;
		}
		
		//以上情况都不满足
		return false;
		
		//该对象的上下左右是否有线路,jquery对象obj向position方向探索，step是步数
		//step=1，探索周围有没有路线，1有，0没有，-1到顶，step为其他数时，无限步数，直到碰到东西或到顶
		function hasLine(obj,position,step){
			lin_type=1;	
			lin_len=0;	
			return walk(obj,position,step);
		}	
	
		//拐弯操作	obj是Jquery对象，dire是拐弯朝向的对象{pos1:出发的方向,pos2:拐弯方向},返回拐弯后能走的距离
		function  turnLen(obj,dire){
			var max={
				len1:[],		//拐弯前的长度数组
				len2:[]		//拐弯后的长度数组
			};
			hasLine(obj,dire.pos1,2);
			var j=lin_len/imgWH;
			for(var i=1;i<=j;i++){
				switch(dire.pos1){
					case 'left':
						obj=$('#box li').eq(obj.index() - 1);
						break;
					case 'right':
						obj=$('#box li').eq(obj.index() + 1);
						break;
					case 'top':
						obj=$('#box li').eq((parseInt(obj.index() / mess.width)-1) * mess.width + obj.index() % mess.width);
						break;
					case 'bottom':
						obj=$('#box li').eq((parseInt(obj.index() / mess.width)+1) * mess.width + obj.index() % mess.width);
						break;
				}
				hasLine(obj,dire.pos2,2);
				max.len1.push(i*imgWH);
				max.len2.push(lin_len);					
			}
			return max;
		}
	}	
	function getAround(obj,position){
		var _index;
		switch(position){
			case 'top':
				_index=(parseInt(obj.index() / mess.width)-1) * mess.width + obj.index() % mess.width;
				break;
			case 'bottom':
				_index=(parseInt(obj.index() / mess.width)+1) * mess.width + obj.index() % mess.width;
				break;
			case 'left':
				_index=obj.index() % mess.width==0? -1 : obj.index() - 1;
				break;
			case 'right':
				_index=obj.index() % mess.width==mess.width - 1 ? -1 : obj.index() + 1;
				break;
		}
		return _index;
	}
	function walk(obj,position,step){
		var _index=getAround(obj,position);
		if(_index<0 || _index>mess.width * mess.height-1){	//到顶格
			return -1;
		}else if($('#box li').eq(_index).css('visibility')=='hidden'){
			if(step==1){		//走一步的时候直接返回
				return 1;
			}else if(step==2){
				lin_len+=imgWH;	//原点到达顶部或碰到物体时的距离
				lin_type=walk($('#box li').eq(_index),position,2);		//递归判断					
				if(lin_type==-1){
					return -1;
				}else if(lin_type==0){
					return 0;							
				}
			}
		}else{				
			return 0;
		}
	}
	
	//=====================================================经典模式设定
	
	//obj是jq对象，position是移到方向，传被消除的两个对象和各种移到方向，type是移到类型
	//position1和position2的传参顺序不能错
	//type值：1.单方向移到   2.分离	3.集中	4垂直分离	
	function seriesExchange(obj1,obj2,position1,position2,type){		
		var _index1;
		var _index2;
		var posMove;	//移到方向临时变量
		var posMove1;	//第一个的走向
		var posMove2;	//第二个的走向
		var tb_half=horitCount*parseInt(vertiCount/2);	//上下部分的中介点
		var lr_half=horitCount/2;			//左右部分的中介点
		var runType='no';	//分离或集中或无
		
		if(type==1){
			posMove=takeBack(position1);
			posMove1=posMove2=posMove;
			_index1=getAround(obj1,posMove1);
			_index2=getAround(obj2,posMove1);
			startMove(0);
		}else if(type==2){
			runType='leave';
			get_index(runType);
			if(posMove1==posMove2)startMove(1);
			else{
				exchange(obj1,posMove1,_index1,1);
				exchange(obj2,posMove2,_index2,1);
			}
		}else if(type==3){
			runType='focus';
			get_index(runType);
			if(posMove1==posMove2)startMove(0);
			else{
				exchange(obj1,posMove1,_index1,0);
				exchange(obj2,posMove2,_index2,0);
			}
		}else if(type==4){
			runType='verti_lea';
			get_index(runType);
			if(posMove1==posMove2)startMove(0);
			else{
				exchange(obj1,posMove1,_index1,0);
				exchange(obj2,posMove2,_index2,0);
			}
		}
	
		
		//开始移到
		function startMove(exchType){
			if(posMove1=='top'||posMove1=='left'){
				if(obj1.index()>obj2.index()){
					exchange(obj2,posMove1,_index2,exchType);
					exchange(obj1,posMove1,_index1,exchType);
				}else{
					exchange(obj1,posMove1,_index1,exchType);
					exchange(obj2,posMove1,_index2,exchType);
				}
			}else if(posMove1=='bottom'||posMove1=='right'){
				if(obj1.index()>obj2.index()){
					exchange(obj1,posMove1,_index1,exchType);
					exchange(obj2,posMove1,_index2,exchType);
				}else{
					exchange(obj2,posMove1,_index2,exchType);
					exchange(obj1,posMove1,_index1,exchType);					
				}
			}
		}
		//获取_index,确定移到方向
		function get_index(runType){
			if(position1=='top'&&position2=='bottom'){
				_index1=posJudge(obj1,tb_half,runType);
				posMove1=posMove;
				_index2=posJudge(obj2,tb_half,runType);
				posMove2=posMove;
			}else if(position1=='left'&&position2=='right'){
				_index1=posJudge(obj1,lr_half,runType);
				posMove1=posMove;
				_index2=posJudge(obj2,lr_half,runType);
				posMove2=posMove;
			}
		}		
		//位置判断	equels中介点,runType走向类型leave分离、focus集中、verti_lea垂直分离
		function posJudge(obj,medium,runType){
			var equl;
			
			if(position1=='top'&&position2=='bottom')equl=obj.index()<medium;
			else if(position1=='left'&&position2=='right')equl=obj.index()%horitCount<medium;
			
			if(equl){				
				if(runType=='leave'){
					posMove=takeBack(position1);
					return getAround(obj,posMove);
				}else if(runType=='focus'){
					posMove=takeBack(position2);
					return getAround(obj,posMove);
				}else if(runType=='verti_lea'){
					posMove=vertical(position1);
					return getAround(obj,posMove);
				}		
			}else{
				if(runType=='leave'){
					posMove=takeBack(position2);
					return getAround(obj,posMove);
				}else if(runType=='focus'){
					posMove=takeBack(position1);
					return getAround(obj,posMove);
				}else if(runType=='verti_lea'){
					posMove=vertical(position2);
					return getAround(obj,posMove);
				}
			}
		}
		//取反方向
		function takeBack(position){
			var _position;
			switch(position){
				case 'left':  _position='right';break;
				case 'right': _position='left';break;
				case 'top':   _position='bottom';break;
				case 'bottom':_position='top';break;
			}
			return _position;
		}
		//逆时针90度方向
		function vertical(position){
			var _position;
			switch(position){
				case 'left':  _position='top';break;
				case 'right': _position='bottom';break;
				case 'top':   _position='right';break;
				case 'bottom':_position='left';break;
			}
			return _position;
		}	
		//替换	type 0.无限制  1.从中间分离  2.向中间集中  3.上左下右
		function exchange(obj,position,_index,type){
			while(walk(obj,position,1)==0){
				if(type==1){
					if(position=='top'	 && _index < tb_half)break;
					if(position=='bottom'&& _index >= tb_half)break;
					if(position=='left'	 && _index%horitCount < lr_half)break;
					if(position=='right' && _index%horitCount >= lr_half)break;
				}
				var t=obj.html();
				obj.html($('#box li').eq(_index).html()).css('visibility','visible');
				$('#box li').eq(_index).html(t).css('visibility','hidden');				
				obj=$('#box li').eq(_index);
				_index=getAround(obj,position);
				
			}
		}
	}
});