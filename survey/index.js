const cosmicjs = require('cosmicjs');
const template = require('./template');
const config = require('../config.js');
const striptags = require('striptags');

const ALLOWED_QUESTION_TAGS = ['p', 'li', 'ol'];
const ALLOWED_NODE_TAGS = ['a', 'b', 'em', 'i'];

// question extraction shorthands
const extract = {
    title: input => {
        let matches = input.match(/<p>(.*?)<\/p>/g);
        return Array.isArray(matches) ? matches.map( val => val.replace(/<\/?p>/g,'')) : [];
    },
    items: input => {
        let matches = input.match(/<li>(.*?)<\/li>/g);
        return Array.isArray(matches) ? matches.map( val => val.replace(/<\/?li>/g,'')) : [];
    }
};

// wrapper for keys for templating
const keywrap = input => '%' + input + '%';

// storage for available locales (is reset each time questions are fetched)
function generateLanguageData(locale = 'en'){
    const output = {};
    const availableLocales = {};

    return new Promise((success, failure) => {
        cosmicjs.getObjects(config.cosmicjs, (e, response) => {
            const questions = response.objects.type.questions;
            const nodes = response.objects.type.nodes;

            let nodeStorage = {};

            if (questions && Array.isArray(questions)){
                let i = questions.length,
                    genKey,
                    question,
                    parsedContent;

                while(i--){
                    question = questions[i];
                    availableLocales[question.locale] = true; // add registered locale

                    if (question.locale !== locale) continue; // skip iteration if locale does not match

                    genKey = keywrap(question.slug);

                    output[genKey] = {}; // initialize the output location for specific key
                    parsedContent = striptags(question.content, ALLOWED_QUESTION_TAGS, '');

                    parsedQuestion = extract.title(parsedContent); // attempt to extract question title

                    if (parsedQuestion) {
                        // add child with same name for easier processing (matches key value pairs)
                        output[genKey][genKey] = parsedQuestion[0];
                    }

                    // should switch based on type of question
                    // split at each li element
                    extract.items(parsedContent).forEach((item, index) => {
                        let key = keywrap(index);
                        output[genKey][key] = item;
                    })
                }

                if (nodes && Array.isArray(nodes)){
                    nodes.forEach(node => {
                        if (node.locale !== locale) return; // skip iteration if locale does not match
                        nodeStorage[node.slug] = striptags(node.content, ALLOWED_NODE_TAGS, '');
                    });
                }

                // send sorted list of known locales
                output.locales = Object.keys(availableLocales).sort();
                output.nodes = nodeStorage; // lang strings (as available)

                success(output);
            } else {
                failure(new Error('no questions'))
            }
        });
    });
}

function generateSurveyData(locale = 'en'){
    return new Promise((success, failure) => {
        generateLanguageData(locale).then( langData => {
            const surveyData = JSON.parse(JSON.stringify(template)) // deep clone object

            surveyData.pages = surveyData.pages.map(page => {
                // for each page

                if (typeof page.title === "string"){
                    // it has a title so replace it with a node
                    let titleString = page.title,
                        matches = page.title.match(/\%.*?\%/g),
                        langNodes = langData.nodes;

                    if (matches) {
                        matches.forEach(match => {
                            let key = match.split('%').join('');
                            // replace the questionString at each match
                            if (typeof langNodes[key] == "string") {
                                titleString = titleString.replace(match, langNodes[key]);
                            }
                        });
                        page.title = titleString;
                    }
                }

                page.questions = page.questions.map(question => {
                    // for each question of each page
                    let key = question.title;

                    if (typeof langData[key] === "object") {
                        // this is where the magic starts
                        // convert the object to a string, do a replacement if a matching key if found.

                        let langDataNode = langData[key];
                        let questionString = JSON.stringify(question);

                        let matches = questionString.match(/\%.*?\%/g);

                        if (matches) {
                            matches.forEach(match => {
                                // replace the questionString at each match
                                if (typeof langDataNode[match] == "string") {
                                    questionString = questionString.replace(match, langDataNode[match]);
                                }
                            });
                        }
                        return JSON.parse(questionString)
                    } else {
                        return question
                    }
                });
                return page;
            });
            surveyData.locale = locale;

            success({ survey: surveyData, locales: langData.locales, nodes: langData.nodes });
        }).catch(e => {
            console.error(e);
            failure(e);
        });
    });
}

module.exports = {
    generate: generateSurveyData
};