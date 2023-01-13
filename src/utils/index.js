import Toastify from 'toastify-js';
import disableScroll from 'disable-scroll';

const Toast = (text, duration = 2000) => {

    Toastify({text: text, duration: duration, gravity: 'bottom', position: 'left', style: {background: 'var(--toast-bg)', color: 'var(--toast-color)'}}).showToast(); 
    
};

const Utils = {

    getThemeMode: () => { return window.localStorage.getItem('ThemeMode') ?? 'light'; },
    Toast: Toast,

    DisableScroll: () => {

        disableScroll.on();

    },

    EnableScroll: () => {

        disableScroll.off();

    },
    
};

export default Utils;