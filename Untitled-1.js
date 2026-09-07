// ==UserScript==
// @name         bilibili下载助手
// @namespace    http://tampermonkey.net/
// @version      v0.2
// @description  try to take over the world!
// @author       Hypergryph Network
// @match        http://simon.nekko.cn:1234/

// @grant        unsafeWindow

// ==/UserScript==

function showToast(message, duration = 1000) {
    // 如果已存在消息框，先移除旧的（保证只有一个）
    const existing = document.getElementById('toast-message');
    if (existing) existing.remove();

    // 创建新消息框
    const toast = document.createElement('div');
    toast.id = 'toast-message';
    toast.textContent = message;

    // 基础样式
    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: 'rgba(20,20,20,0.8)',
        color: '#f0f0ff',
        padding: '10px 20px',
        borderRadius: '6px',
        fontSize: '14px',
        fontFamily: 'sans-serif',
        zIndex: '9999',
        boxShadow: '0 2px 10px rgba(255,255,255,0.3)',
        opacity: '0',
        transition: 'opacity 0.2s ease'
    });

    document.body.appendChild(toast);
    // 强制重绘后淡入
    setTimeout(() => { toast.style.opacity = '1'; }, 10);

    // 设置自动消失
    if (duration > 0) {
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 200);
        }, duration);
    }
}

let cheatQuestionsList;

async function getData(id) {
    cheatQuestionsList = await api('GET', `/api/questions/${id}?role=teacher`);
    //I cracked the code:)
    console.log(cheatQuestionsList);
}

(function() {
    'use strict';
    // 禁用反作弊，覆写函数
    triggerAntiCheat = function() {
        if (!document.getElementById('screen-exam')?.classList.contains('active')) return;
        S.tabSwitches = 0;
        saveExamState();
        const overlay = document.getElementById('anticheat-overlay');
        const msgEl = document.getElementById('anticheat-msg');
        const countEl = document.getElementById('anticheat-count');
        const btnEl = document.getElementById('anticheat-btn');
        if (!overlay) return;
        countEl.textContent = S.tabSwitches;
        msgEl.textContent = `虽然但是，犯瘤蟀管不着你。`;
        btnEl.style.display = '';
        btnEl.textContent = '我知道错了，下次还干';
        btnEl.onclick = () => { overlay._shouldShow = false; overlay.style.display = 'none'; };
        overlay._shouldShow = true;
        overlay.style.display = 'flex';
    };

    document.addEventListener('keydown', function(event) {
        if (event.key === 'w') {
            getData(S.activeExam.id);
            showToast("获取答案数据成功");
        }
        // 检查按下的键是否为 q
        if (event.key === 'q') {
            let currentQIdx = S.currentQIdx;
            let answer = cheatQuestionsList[currentQIdx].correct_answer;
            if (answer == 0) {showToast("第" + (currentQIdx+1) + "题答案是:A");}
            else if (answer == 1) {showToast("第" + (currentQIdx+1) + "题答案是:B")}
            else if (answer == 2) {showToast("第" + (currentQIdx+1) + "题答案是:C");}
            else if (answer == 3) {showToast("第" + (currentQIdx+1) + "题答案是:D");}
            else if (answer == 4) {showToast("第" + (currentQIdx+1) + "题答案是:E");}
            else {showToast("答案走丢了");}
        }
        if (event.key === 'a') {
            cheatQuestionsList.forEach((answerLog, index) => {
                S.answers[index] = answerLog.correct_answer;
            })
            showToast("自动填充完成");
        }
    });

})();