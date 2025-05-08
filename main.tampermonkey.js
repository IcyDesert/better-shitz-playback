// ==UserScript==
// @name         回放平台大整改
// @namespace    http://tampermonkey.net/
// @version      2025-05-08
// @description  try to take over the world!
// @author       IcyDesert
// @match        http://219.223.238.14:88/ve/back/rp/common/rpIndex.shtml?method=studyCourseDeatil*
// @match        https://219-223-238-14-88-p.hitsz.edu.cn/ve/back/rp/common/rpIndex.shtml?method=studyCourseDeatil*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=238.14
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

const SAVE_INTERVAL_SECONDS = 10; // 实时保存进度的间隔时间（秒）

(function () {
    'use strict';
    const $controlBar = $('.jyd-videoControlBar');
    const fullScreenButton = document.getElementById('jyd-fullScreen');
    const exitButton = document.getElementById('jyd-exitFullScreen');
    const video1 = document.getElementById('jyd-video1');
    const video2 = document.getElementById('jyd-video2');
    const $teacherVoice = $("#jyd-teacherVoice")

    let clickCount = 0; // 初始化计数器

    // =========== 鼠标移动时显示进度条（是的，原本没有） =============
    $(document).on('mousemove', function () {
        $controlBar.css('display', 'block');
    });

    document.addEventListener('keydown', function (event) {
        // =========== 空格键控制播放/暂停 ==========
        if (event.code === 'Space') {
            event.preventDefault();
            if (video1.paused) {
                video1.play();
                video2.play();
            } else {
                video1.pause();
                video2.pause();
            }
        }
        // ============== F键控制全屏与否 =================
        else if (event.code === 'KeyF') {
            clickCount++;
            const button = (clickCount % 2 === 1) ? fullScreenButton : exitButton;
            if (button) button.click();
        }
        // ============ 1,2 键控制教师/课件视频显示 ===========
        else if (event.code === 'Digit1') {
            dbClick('#jyd-video1');
        }
        else if (event.code === 'Digit2') {
            dbClick('#jyd-video2');
            if ($teacherVoice.length) $teacherVoice.click();
        }
    });

    // ================= 进度储存 =================
    videoProgressStorage(video1);
    videoProgressStorage(video2);
}());

function dbClick(selector) {
    let element = document.querySelector(selector);
    if (!element) {
        console.error(`找不到元素: ${selector}`);
        return;
    }
    // 双击事件
    const event = new MouseEvent('dblclick', {
        bubbles: true,
        cancelable: true,
    });
    element.dispatchEvent(event);
}

function loadProgress() {
    return GM_getValue(getKey(), 0);
}

function getKey() {
    // 以路径查询参数 rpId 作为该视频唯一标识符
    const params = new URLSearchParams(location.search);
    return params.get('rpId') + '_progress' || location.href + '_progress'; // 回退到完整URL
}

function saveProgress(progress) {
    GM_setValue(getKey(), progress);
}

function videoProgressStorage(video) {
    if (!video) return;
    let lastSaved = 0;

    const savedProgress = loadProgress();

    // ============ 恢复上次播放进度 =================
    video.addEventListener('loadedmetadata', () => {
        setTimeout(() => {
            if (savedProgress > 0) recoverProgress(video, savedProgress);
        }, 500);
    });

    // ============ 间隔一段时间保存进度 =================
    video.addEventListener('timeupdate', () => {
        if (video.currentTime - lastSaved > SAVE_INTERVAL_SECONDS) {
            saveProgress(video.currentTime);
            lastSaved = video.currentTime;
        }
    });
    // ============ 页面关闭时保存进度 =================
    window.addEventListener('beforeunload', () => {
        if (video.readyState === 4) {
            saveProgress(video.currentTime);
        }
    });
};

function recoverProgress(video, targetTime) {
    if (!video) return false;
    video.currentTime = targetTime;
    return true;
}
