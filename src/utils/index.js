import Toastify from 'toastify-js';

const Toast = (text, duration = 2000) => {

    Toastify({text: text, duration: duration, gravity: 'bottom', position: 'left', style: {background: 'var(--toast-bg)', color: 'var(--toast-color)'}}).showToast(); 
    
};

const DisableScrollFunction = (e) => {

    e.preventDefault();
    e.stopPropagation();

};

const Utils = {

    getThemeMode: () => { return window.localStorage.getItem('ThemeMode') ?? 'light'; },
    Toast: Toast,

    DisableScroll: () => {

        document.body.addEventListener('touchmove', DisableScrollFunction, { passive: false });

    },

    EnableScroll: () => {

        document.body.removeEventListener('touchmove', DisableScrollFunction);

    },
    
};

export default Utils;