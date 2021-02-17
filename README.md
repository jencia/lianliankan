
这是我当年 2015 年刚学完 JavaScript 和 JQuery 的时候做的一个游戏，当时很用心，功能做得很全面，而且还写下了更新日志。这也算是人生第一个完整的项目，值得纪念，原封不动的拉到 Github ，只是把更新日志改成 README.md 文件。

游戏中的设置面板配置数据无法持久化，因为后端没开启，当时后端使用 JSP 写的，这边不影响主体功能就不改了，保持源代码不变。

我把游戏部署在 http://demo.jswalk.com/lianliankan ，祝你玩得愉快！

以下是更新日志原文经过 markdown 格式调整的：

***

- 游戏名：网页版连连看
- 作者：杨杰灿
- 制作日期：2015年2月3日晚上
- 字符长度：除去jquery的代码，一共有13万个
- 制作原因：我爸喜欢玩这种游戏，就想自己做一个，顺便复习下js
	  
***

### v1.0

`2015年2月3日晚上`

- 按照传统的规则制定，图片是用数字代替，有倒计时，

- 有三个按钮：
	- 暂停：暂停游戏，界面被遮住，时间停止
	- 换位：结构不变，图片位置重新随机排列
	- 重来：重新开始游戏，数据初始化

### v1.1

- 导入图片（目前只有两种）
- 加入连击系统

### v1.2

`2015年2月15号晚上`

- 加入得分系统
	- 加入按键声音
	- 改造了游戏结束时的界面

### v1.3

`2015年2月17号晚上`

- 加入背景音乐
- 多加一个按钮，功能是能提示你下一步消哪些
- 加入一个智能性功能，就是当没有可以消除的图片时会自动换位操作
- 每个关卡的难度有所调整
- 点击时对象的切换有所改动
- 时间改成进度条
- 提示和换位按钮重做（换成图标，有个数限制）

### v2.0

`2015年2月21日完成`

- 添加了主界面，添加的返回主界面功能
- 传统模式代码和其他代码区分开来，部分内核有所改动
- 添加了经典模式
	- 图像变为可动状态，每关的移到形式不一样
	- 分为简单、普通、困难三个难度，难度不同数量不同，但每关的数量是固定的
	- 关卡简介如下：

		```
		第1关：不移动      第2关：向下移动
		第3关：向上移动    第4关：上下分离
		第5关：左右分离    第6关：向左移动
		第7关：向右移动    第8关：上下集中
		第9关：左右集中    第10关：上左下右
		第11关：左下右上   第12关：向外扩散
		第13关：向内扩散   第14关：随机移到	
		```	

### v2.1

`2015年2月24日完成`

- 主界面进一步改善，自适应再次改善
- 添加了地图模式
	- 传统模式的改进版，图像的摆放位置不再是单纯的矩形
	- 随机地图：从系统自带的43张地图随机抽取一张，难度是随机的，过关后重新抽取，有可能重复
	- 自选图库：可以自己从43张地图选一张，也可以自定义，自定义就是自己画一张，自选的作为第一关地图
	- 添加了地图绘制界面

### v2.2

`2015年3月1日完成`

- 试图导入ajax技术优化性能，却发现没办法异步加载js代码，因此失败了
- 运用Cookie存储实现了游戏的自动存档与手动读档，默认存7天
- 增加了提示框，鼠标放在“读档”可以显示存档打到第几关

### v2.3

`2015年3月6日完成`

- 完成了“帮助”界面和“设置界面”
- “设置”界面运用ajax技术实现，从XML获取数据，异步加载jsp，动态改变XML里面的数据
- 动态部分需要放在服务器上才有效