import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Survey } from 'survey-react';
import MainNavigation from './components/navbar';
import { processHTMLEntities } from './utils';

import './app.css';
import 'bootstrap/dist/css/bootstrap.css';

const surveyCSS = {
    navigation: {
        complete: 'btn btn-success',
        prev: 'btn btn-secondary',
        next: 'btn btn-primary'

    }
};

Survey.cssType = 'bootstrap';

const enableResultDisplay = true; /// DEBUG flag -> show the formatted response JSON in the app

class App extends Component {
    constructor(props){
        super(props);

        this.state = { currentLocale: 'en', survey: null, locales: [], langData: {}, updatingLang: true }
    }

    componentDidMount(){
        this.getSurveyData( this.state.currentLocale ); // load the initial locale
    }

    localeSelectEvent(key){
        this.setState({ updatingLang: true });
        this.getSurveyData( this.state.locales[key] ); // set the locale based on index compared to active locales
    }

    getSurveyData(localeString) {
        enableResultDisplay && document.body.classList.remove('complete'); // debug ONLY

        const self = this;

        const apiRequest = new XMLHttpRequest();
        apiRequest.onreadystatechange = () => {

            if (apiRequest.readyState == 4){
                // the request is complete -> now check the status

                if (apiRequest.status == 200) {
                    // the request was received without errors -> but needs to be verified

                    let  parsedResponse; // create placeholder refrence to the JSON data to be parsed
                    try {
                        // encode entire string with entities and then decode to prevent entity related JSON errors
                        parsedResponse = apiRequest.responseText.replace(/\&quot;/g, '\\"');
                        parsedResponse = JSON.parse(processHTMLEntities(parsedResponse));
                    } catch (e) {
                        console.log(e);
                    }

                    if (parsedResponse && typeof parsedResponse === "object") {
                        self.setState({
                            currentLocale: localeString,
                            survey: parsedResponse.survey,
                            locales: parsedResponse.locales,
                            langData: parsedResponse.nodes,
                            updatingLang: false
                        });
                    } else {
                        // something went wrong
                    }

                } else {
                    // the request is a failure -> output error and do callback
                }
            }
        }

        apiRequest.open('GET', './locale/' + localeString, true);
        apiRequest.send();
    }

    renderSurvey() {
        const { currentLocale, locales, langData, survey } = this.state;

        return (
            <div>
                <MainNavigation
                    currentLocale={currentLocale}
                    locales={locales}
                    langData={langData}
                    selectEvent={this.localeSelectEvent.bind(this)} />
                <div className="survey-container container">
                    <Survey json={survey} onComplete={this.sendResult.bind(this)} css={surveyCSS} />
                </div>
            </div>
        )
    }

    sendResult(result){
        // do something with the `result.data` -> send to server

        /* DEBUG/EXAMPLE -> DISPLAY RESULTS */
        if (enableResultDisplay) {
            document.body.classList.add('complete'); // debug ONLY

            // SurveyJS does not like state manipulation after the quiz completes, so we will manually have to show the results
            let resultDisplay = document.getElementById('result-display');

            if (resultDisplay) {
                resultDisplay.innerText = JSON.stringify(result.data, null, 4);
            }
        }
    }

    render() {
        const { updatingLang } = this.state;

        return (
            <div className={`app-container ${ updatingLang ? 'loading' : '' }`}>
                { !updatingLang ? this.renderSurvey() : '' }
                <div className="loader" />
            </div>
        );
    }
}

const AppContainer = document.getElementById('app');

if (AppContainer) {
    ReactDOM.render(<App />, AppContainer);
} else {
    console.error('There is no active element');
}