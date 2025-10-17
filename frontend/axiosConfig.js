import axios from 'axios';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

let requestCount = 0;

const startLoading = () => {
    requestCount++;
    document.body.classList.add('loading-overlay-active');
    NProgress.start();
};

const stopLoading = () => {
    requestCount--;
    if (requestCount === 0) {
        NProgress.done();
        document.body.classList.remove('loading-overlay-active');
    }
};

const instance = axios.create();

instance.interceptors.request.use(config => {
    startLoading();
    return config;
});

instance.interceptors.response.use(
    response => {
        stopLoading();
        return response;
    },
    error => {
        stopLoading();
        return Promise.reject(error);
    }
);

export default instance;
