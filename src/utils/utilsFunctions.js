export const getUzbData = () => {
    return new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Tashkent"})).getTime()
}