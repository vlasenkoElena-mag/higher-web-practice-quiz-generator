export const navigateTo = (url: string) => {
    window.location.href = url;
};

export const getUrlParam = (paramName: string): string | null => {
    const params = new URLSearchParams(window.location.search);
    return params.get(paramName);
};
