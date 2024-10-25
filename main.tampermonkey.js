// ==UserScript==
// @name         回放平台大整改
// @namespace    http://tampermonkey.net/
// @version      2024-10-18
// @description  try to take over the world!
// @author       IcyDesert
// @match        http://219.223.238.14:88/ve/back/rp/common/rpIndex.shtml?method=studyCourseDeatil*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=238.14
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    // ===========鼠标移动时显示进度条（是的，原本没有）=============
    const $controlBar = $('.jyd-videoControlBar');

    // 鼠标移动事件
    $(document).on('mousemove', function() {
        $controlBar.css('display', 'block');
    });

    // =============空格键暂停、播放视频============
    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space') { // 检测按下的是空格键
            event.preventDefault(); // 防止默认空格滚动页面的行为

            const video1 = document.getElementById('jyd-video1');
            const video2 = document.getElementById('jyd-video2');
            // 切换播放状态
            if (video1.paused) {
                video1.play();
                video2.play(); // 确保 video2 暂停
            } else {
                video1.pause();
                video2.pause();
            }
        }
    });
    //=============f键缩小/放大视频，和b站一致===========
    let clickCount = 0; // 初始化计数器
    const fullScreenButton = document.getElementById('jyd-fullScreen');
    // 监听键盘事件
    document.addEventListener('keydown', function(event) {
        if (event.code === 'KeyF') { // 检测按下的是 F 键
            clickCount++; // 增加计数器
            if (clickCount % 2 === 1) { // 奇数次按下
                const fullScreenButton = document.getElementById('jyd-fullScreen');
                if (fullScreenButton) {
                    fullScreenButton.click(); // 第一次点击
                }
            } else { // 偶数次按下
                const exitButton = document.getElementById('jyd-exitFullScreen');
                if (exitButton) {
                    exitButton.click(); // 点击 #jyd-container
                }
            }
        }
    });
   //================按下1、2以全屏显示某个视频==================
    // 监听键盘按下事件
    document.addEventListener('keydown', function(event) {
        if (event.code === 'Digit1') {
            toggleDisplay('#jyd-video1');
        } else if (event.code === 'Digit2') {
            toggleDisplay('#jyd-video2');
        }
    });
    function toggleDisplay(selector) {
        let element = document.querySelector(selector);
        // 创建一个双击事件
        const event = new MouseEvent('dblclick', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        // 触发双击事件
        element.dispatchEvent(event);
    }
}());
