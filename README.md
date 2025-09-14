<h1>
<p>HITSZ 课程回放平台大整改</p>

<img src="https://img.shields.io/github/license/IcyDesert/better-shitz-playback">
<img src="https://img.shields.io/github/v/tag/IcyDesert/better-shitz-playback">
<img src="https://img.shields.io/github/last-commit/IcyDesert/better-shitz-playback">
<img alt="GitHub Issues or Pull Requests" src="https://img.shields.io/github/issues/IcyDesert/better-shitz-playback">

</h1>


## 支持功能
*以下功能在 Windows11, Chrome/Microsoft Edge 浏览器下测试通过*
- ✅ 全屏时，`鼠标`移动可显示进度条（**部分平台、浏览器可能无法正常使用**）
- ✅ `空格键`暂停、播放视频
- ✅ `F 键`将二合一视频全屏/退出全屏
- ✅ `1、2 数字键`分别对应教师黑板界面、电脑课件界面，可全屏/退出全屏
  - 大、小键盘的数字键均可
- ✅ 视频进度存储、跳转至上次播放位置
  - 仅限同一设备的同一浏览器
  - 打开页面后约 1s 会恢复进度，在此期间请耐心等待
- ✅ 视频快进快退功能
  - `← 方向键`或`H键`后退
  - `→ 方向键`或`L键`前进

## 使用前置
需要油猴插件，可自行搜索 `{你使用浏览器}的油猴安装教程`

## 使用方法

### 导入

#### 直接安装
点击 <a href="https://gist.github.com/IcyDesert/fcbd3d82f12ab94f257ba8107679dd38/raw/ba9f299951dbf8fc9f71d36c454bcd6b7a56fd03/better-playback.user.js">链接</a> 进行安装

#### 手动导入
搜索 `油猴导入自定义脚本`，按照教程，将`main.tampermonkey.js`中的内容复制粘贴即可。


### 可配置参数
```js
// 需在油猴代码中修改
const SAVE_INTERVAL_SECONDS = 10; // 实时保存进度的间隔时间（秒）
const SKIP_SECONDS = 6; // 一次快进/快退的秒数
```

### 注意事项
由于脚本和播放器的交互比较灵车，因此有可能出现视频界面不正常情况。**但 `ESC 键` 始终是万能的！可以恢复到正常的样子**
