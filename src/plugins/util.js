import store from '@/store';

const Util = {
  fullscreen() {
    if (
      !document.fullscreenElement
      && !document.mozFullScreenElement
      && !document.webkitFullscreenElement && !document.msFullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document
          .documentElement.webkitRequestFullscreen(window.Element.ALLOW_KEYBOARD_INPUT);
      }
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  },
  serialize(json) {
    const string = [];
    for (const i in json) {
      string.push(`${i}=${json[i]}`);
    }
    return string.join('&');
  },
  textToUppercase(stringInput) {
    try {
      return stringInput.toUpperCase();
    } catch (error) {
      return stringInput;
    }
  },
  toCapitalize(str) {
    return str?.split('').map((e, i) => (i === 0 ? e.toUpperCase() : e)).join('');
  }
};

export default {
  store,
  install: (Vue) => {
    Vue.prototype.$util = Util;
  }
};
