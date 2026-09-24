# 乐乐 & 33 的小屋 💙

一个纯静态的情侣日常记录小站：**在一起第几天、纪念日倒计时、点点滴滴时间轴、相册、去过的地方**。
纯 HTML + CSS + 原生 JS，没有任何依赖，直接扔到 GitHub Pages 就能用。

## 一、目录结构

```
.
├── index.html          首页：在一起天数 / 纪念日倒计时 / 情话 / 最近动态
├── timeline.html       纪念日列表 + 点点滴滴时间轴（可按标签筛选）
├── gallery.html        相册（分类筛选 + 全屏灯箱）
├── places.html         我们的足迹（城市卡片 + 统计数字）
├── css/
│   ├── base.css        主题变量、重置、导航、页脚、通用组件
│   └── style.css       各页面具体样式
├── js/
│   ├── data.js         ★ 所有内容都在这里，改这一个文件就够了
│   └── main.js         交互逻辑（倒计时、灯箱、筛选、动画等）
└── images/             图片目录（现在放的是示例占位图）
```

## 二、怎么改成你们自己的内容

**只需要编辑 `js/data.js`**，改完保存、刷新页面就能看到效果。

| 想改什么 | 改哪里 |
| --- | --- |
| 名字、在一起的日期 | `site.since`、`people.a/b` |
| 纪念日（生日、周年…） | `anniversaries`，日期写 `MM-DD` 表示每年重复 |
| 点点滴滴 | `timeline`，`tag` 会自动变成筛选按钮 |
| 相册照片 | `gallery`，`category` 会自动变成分类 |
| 去过的城市 | `places`，`tags` 同上 |
| 首页轮播情话 | `quotes` |

### 换成自己的照片

1. 把照片放进 `images/` 目录，比如 `images/qingdao-01.jpg`；
2. 在 `js/data.js` 里把 `src` / `cover` 改成这个路径，例如：
   ```js
   { src: 'images/qingdao-01.jpg', title: '青岛的海', date: '2021-08-16', category: '旅行' },
   ```
3. 建议先把照片压到 **宽 1600px 以内、单张 500KB 以下**，网页打开会快很多。
   （在线压缩可以用 [squoosh.app](https://squoosh.app)）
4. 路径**区分大小写**，`JPG` 和 `jpg` 在 GitHub 上是两个文件，注意别写错。
   图片万一没加载出来，会自动显示占位图，不会出现破图。

## 三、本地预览

直接双击 `index.html` 就能看。
如果想让图片、相对路径的行为和线上完全一致，可以起一个本地服务：

```bash
# 有 Python 的话
python -m http.server 8000

# 或者有 Node 的话
npx serve .
```

然后浏览器打开 `http://localhost:8000`。

## 四、部署到 GitHub Pages（免费）

1. 在 GitHub 上新建一个仓库，比如 `our-days`（**Public**，私有仓库的 Pages 需要付费）。
2. 在项目目录里执行：
   ```bash
   git init
   git add .
   git commit -m "init: 我们的小屋"
   git branch -M main
   git remote add origin https://github.com/你的用户名/our-days.git
   git push -u origin main
   ```
3. 打开仓库页面 → **Settings** → 左侧 **Pages**；
   - Source 选 `Deploy from a branch`
   - Branch 选 `main`，目录选 `/ (root)`，点 **Save**。
4. 等 1～2 分钟，访问 `https://你的用户名.github.io/our-days/` 即可。

> 小提示：仓库名如果就叫 `你的用户名.github.io`，地址会变成 `https://你的用户名.github.io/`，更短。
> 之后每次更新，只要 `git add . && git commit -m "更新" && git push` 就会自动重新发布。

### 关于隐私

GitHub Pages 的站点是**公开**的，任何人拿到链接都能看到。
所以：**不要放身份证、住址、手机号、聊天记录截图这类敏感信息**；
只放照片和日常就好。如果确实想加密，可以用仓库私有 + 付费 Pages，或者换 Vercel / Cloudflare Pages 并开启访问保护。

## 五、已经做好的交互

- 首页「在一起第 N 天」数字滚动动画
- 纪念日倒计时（精确到秒，自动算最近的那个，**会自动跨年**）
- 首页情话打字机效果
- 导航栏滚动变实、移动端汉堡菜单
- 内容滚动进入时的淡入动画
- 时间轴 / 相册 / 足迹 的分类筛选
- 相册灯箱：点击放大，支持 `←` `→` 切换、`Esc` 关闭、手机左右滑动
- 足迹页统计数字滚动
- 左下角小心心按钮，点一下撒一把爱心
- 右下角返回顶部
- 全站响应式，手机、平板、电脑都好看
- 尊重系统「减少动态效果」设置

## 六、常见问题

**Q：日期填错了会怎样？**
A：只会显示得不准确，不会报错。如果整页白屏，多半是 `data.js` 里少了一个逗号或引号 —— 打开浏览器按 `F12` 看 Console 里的红色报错，一般会直接告诉你第几行。

**Q：想加一个新页面（比如「想一起做的事」）？**
A：复制一份 `timeline.html`，改掉里面的 `data-page` 和内容容器，在 `js/main.js` 里照着 `initTimeline` 写一个渲染函数即可。

祝你们，日子长长久久 💙
