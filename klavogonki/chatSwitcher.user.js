// ==UserScript==
// @name         chatSwitcher
// @version      0.25
// @description  Переключение вкладок чата
// @match        http*://klavogonki.ru/g/*
// @match        http*://klavogonki.ru/gamelist/
// ==/UserScript==

let mode;
((document.URL == 'http://klavogonki.ru/gamelist/') || (document.URL == 'https://klavogonki.ru/gamelist/')) ? mode = false : mode = true;




if (mode)
//активация общего чата при заходе в заезд
    generalChatActivate();

//переключение вкладок нажатием таба, двойным нажатием - установление курсора в строку ввода чата
tabSwitcher();

//скроление чата alt + J / alt + K
chatScroll();

//минимизация чата ctrl + space
chatMinimize();

//время двойного нажатия (ms)
let dbltime = 300;
//расстояние скролла чата (px)
let scrollLength = 50;
//если не переключается на общий чат при открытии заезда - увеличить время (ms): 500, 1000, 2000...
let extraTime = 0;




let genTab;
let gameTab;
let gameInput;
if (mode) {
    genTab = document.querySelector('#chat-title .general.c');
    gameTab = document.querySelector('#chat-title .game.c');
    gameInput = document.querySelectorAll('.chat')[1].querySelector('.text');
} else
    genTab = document.querySelector('#chat-title .active.c');
let chatContent = document.querySelectorAll('.messages-content');
let genInput = document.querySelectorAll('.chat')[0].querySelector('.text');

let timesTabClicked = 0;

function focus() {
    if (genTab.hasClassName('active'))
        genInput.focus();
    else
        gameInput.focus();
}

function click() {
    if (!genTab.hasClassName('active')) {
        genTab.click();
        chatContent[0].scrollTop = 100000;
    } else {
        gameTab.click();
        chatContent[1].scrollTop = 100000;
    }
}

function generalChatActivate() {
    window.addEventListener('load', function a() {
        if ((chatContent[0].querySelector('div').childNodes[1]) && (!genTab.hasClassName('active'))) {
            genTab.click();
            chatContent[0].scrollTop = 100000;
            setTimeout(() => {
                if ((chatContent[0].querySelector('div').childNodes[1]) && (!genTab.hasClassName('active'))) {
                    genTab.click();
                    chatContent[0].scrollTop = 100000;
                }
            }, extraTime);
        } else {
            setTimeout(a, 500);
        }
    });
}

function tabSwitcher() {
    window.addEventListener('keydown', function(e) {
        if (event.key === 'Tab') {
            e.preventDefault();
            timesTabClicked++;
            if (timesTabClicked < 2) {
                let t = setTimeout(function() {
                    if (timesTabClicked < 2) {
                        if (mode)
                            click();
                        timesTabClicked = 0;
                    } else {
                        timesTabClicked = 0;
                        clearTimeout(t);
                        focus();
                    }
                }, dbltime);
            }
        }
    });
}

function chatScroll() {
    const keys = {};
    window.addEventListener('keydown', function(e) {
        if ((e.code == 'AltLeft') || (e.code == 'AltRight'))
            e.preventDefault();
    });
    window.addEventListener('keydown', (e) => {
        keys[e.code] = true;
    })
    window.addEventListener('keyup', (e) => {
        if ((keys['AltLeft'] || keys['AltRight']) && keys['KeyJ']) {
            chatContent[0].scrollBy({top: scrollLength, left: 0, behavior: 'smooth'});
            if (mode)
                chatContent[1].scrollBy({top: scrollLength, left: 0, behavior: 'smooth'});
        } else if ((keys['AltLeft'] || keys['AltRight']) && keys['KeyK']) {
            chatContent[0].scrollBy({top: -scrollLength, left: 0, behavior: 'smooth'});
            if (mode)
                chatContent[1].scrollBy({top: -scrollLength, left: 0, behavior: 'smooth'});
        }
        keys[e.code] = false;
    })
}

function chatMinimize() {
    window.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.code == 'Space') {
            document.querySelector('.hide-bar').click();
        }
    });
}
