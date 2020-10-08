const MONTH_LIST = [ "Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря" ];
const DAY_LIST = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];

function getMonth(date) {
    return (MONTH_LIST[date.getMonth()]);
}

function getDate(date) {
    return (date.getDate());
}

function getDay(date) {
    return (DAY_LIST[date.getDay()]);
}

function getDayString(date) {
    return getDate(date) + ' ' + getMonth(date) + ', ' + getDay(date);
}


module.exports = {
    getDayString
};