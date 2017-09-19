const express = require('express');
const survey = require('./survey');
const config = require('./config');

const app = express();
app.set('port', process.env.PORT || 3000);

app.use(express.static('build'));

app.listen(app.get('port') || 3000, () => {
    console.info('==> 🌎Go to http://localhost:%s', app.get('port'))
});

app.get('/locale/:id', (req, res) => {
    let locale = req.params.id;

    if (config.supportedLocales.indexOf(locale) > -1) {
        console.log('rendering locale', locale);

        survey.generate(locale).then(surveyData => {
            console.log('sending', surveyData);
            res.json(surveyData);
        });
    } else {
        res.error(404);
    }
});
