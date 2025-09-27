// ==UserScript==
// @name         回放平台大整改
// @namespace    http://tampermonkey.net/
// @version      0.4.1
// @description  让回放界面播放器更顺手
// @author       IcyDesert
// @match        https://jxypt.hitsz.edu.cn/ve/back/rp/common/rpIndex.shtml?method=studyCourseDeatil*
// @match        https://jxypt-hitsz-edu-cn-s.hitsz.edu.cn/ve/back/rp/common/rpIndex.shtml?method=studyCourseDeatil*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=238.14
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

const SAVE_INTERVAL_SECONDS = 10; // 实时保存进度的间隔时间（秒）
const SKIP_SECONDS = 6; // 快进/快退的秒数

(function () {
    'use strict';
    const $controlBar = $('.jyd-videoControlBar');
    const fullscreenButton = document.getElementById('jyd-fullScreen');
    const exitButton = document.getElementById('jyd-exitFullScreen');
    const video1 = document.getElementById('jyd-video1');
    const video2 = getScreenVideo();
    const teacherVoice = document.getElementById("jyd-teacherVoice");

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
            const button = (clickCount % 2 === 1) ? fullscreenButton : exitButton;
            if (button) button.click();

        }
        // ============ 1,2 键控制教师/课件视频显示 ===========
        else if (event.code === 'Digit1' || event.code === 'Numpad1') { // 支持主键盘和小键盘的1
            toggleFullscreen(video1)
        }
        else if (event.code === 'Digit2' || event.code === 'Numpad2') { // 支持主键盘和小键盘的2
            toggleFullscreen(video2)
            if (teacherVoice) teacherVoice.click();
        }        
        // ============ 左键/H键后退 =================
        // TODO 两个视频同步
        else if (event.code === 'ArrowLeft' || event.code === 'KeyH') {
            skipVideo(video1, -1);
            skipVideo(video2, -1);
        }
        // ============ 右键/L键前进 =================
        else if (event.code === 'ArrowRight' || event.code === 'KeyL') {
            skipVideo(video1, 1);
            skipVideo(video2, 1);
        }
    });
    // ================= 进度储存 =================
    videoProgressStorage(video1);
    videoProgressStorage(video2);
}());

function getScreenVideo() {
    const params = new URLSearchParams(location.search);
    const type = params.get('publicRpType');
    if (type && type.split(',').includes('1')) return document.getElementById('jyd-video3');
    return document.getElementById('jyd-video2');
}

function dbClick(element) {
    if (!element) return;
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

function skipVideo(video, mode = -1) {
    // mode 只能是 -1 或 1
    if (!video) return;
    const newTime = video.currentTime + mode * SKIP_SECONDS // 经测试无需担心数值溢出
    video.currentTime = newTime;
}

function toggleFullscreen(element) {
    if (document.fullscreenElement === element) {
        document.exitFullscreen()
        return
    }
    element.requestFullscreen().catch( (err) => {
        console.error(`Error enabling fullscreen: ${err.message}`);
    });
}

function videoProgressStorage(video) {
    if (!video) return;
    let lastSaved = 0;

    const savedProgress = loadProgress();

    // ============ 恢复上次播放进度 =================
    video.addEventListener('loadedmetadata', () => {
        setTimeout(() => {
            if (savedProgress > 0) recoverProgress(video, savedProgress);
        }, 1000); // 1s 延迟，以防万一
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
