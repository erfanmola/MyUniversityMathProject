const strings = {
    developix: {
        fa: "دولوپیکس",
        en: "Developix"
    },
    general: {
        title: {
            fa: "عنوان سایت",
            en: "Site Title"
        },
        language_switch: {
            fa: "Switch to English",
            en: "تغییر زبان به فارسی"
        },
        slogan: {
            fa: 'شعار سایت',
            en: 'Site Slogan',
        }
    },
    404: {
        fa: "صفحه‌ای که به‌دنبال آن هستید وجود ندارد، ممکن است حذف شده باشد یا توسط مدیریت وبسایت به آدرس دیگری منتقل شده باشد، لطفا از صحیح بودن آدرس وارد شده اطمینان حاصل فرمایید.",
        en: "The page you are trying to access does not exist, it may have been removed by the administrators, or moved to another address, Please ensure that you have entered the correct address.",
    }
};

const stringsBuilder = (item, data = []) => {

    data.forEach((value) => {

        item = item.replace('%%', value);

    });

    return item;

};

const EnToFa = (s) => { return s.toString().replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]); };

const DPXLanguage = {
    stringsBuilder: stringsBuilder,
    strings: strings,
    EnToFa: EnToFa
}

export default DPXLanguage