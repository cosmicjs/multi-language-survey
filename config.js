module.exports = {
    cosmicjs: {
        bucket: {
            slug: process.env.COSMIC_BUCKET || 'multi-language-survey',
            read_key: process.env.COSMIC_READ_KEY,
            write_key: process.env.COSMIC_WRITE_KEY
        }
    },
    supportedLocales: ['ar', 'zh-Hans', 'cs', 'da', 'nl', 'en', 'fi', 'fr', 'de', 'el', 'hu', 'is', 'it', 'lv', 'fa', 'pl', 'pt', 'ro', 'ru', 'es', 'sv', 'tr']
}