# Multi Language Survey

## Why?
1. The ability to create and manage surveys for multiple languages
2. The flexibility of the SurveyJS API
3. The ability to use custom Surveys

## How it works
The app is split into two main components, the front-end and the back-end.

The front-end application (powered by React, Bootstrap and SurveyJS) handles the user input and questions. It contains
no fixed data, as the data is handled on the back-end server.

The back end server does a batch template replacement, replacing the values of the survey template with the values stored
remotely on the CosmicJS server. The remote data is filtered and modified to be parsed by the front-end for displaying.

## Article
For further reading, checkout the Cosmic JS [article]().

## Getting Started
### Install
Make sure you have `npm` and `git` installed before starting to work on this project. Once available, clone the repository using
`git clone` and install the required build dependencies with `npm install`.

```bash
git clone {repository-link}
cd {directory-name}
npm install
```

### Running and building the environment
Once the dependencies are installed, you can build the demo application with the command `npm start` (for production
environments) or `npm run dbuild && npm run server` (for development environments).

The build project should then be available in the `build` directory. The local server is set to serve to `localhost:3000`.

### Add / Edit Content
You can easily manage the content in your static site on Cosmic JS.  Follow these steps:

1. [Log in to Cosmic JS](https://cosmicjs.com).
2. Create a bucket.
3. Go to Your Bucket > Apps.
4. Install the [demo-name]()
5. Deploy your Static Site to the Cosmic App Server at Your Bucket > Web Hosting.

The data is split into two segments: the `Questions` and the `Nodes`. `Questions` are simple elements to be rendered in 
the back-end survey template (located at `survey/template.js`).

#### Questions

A `Question` should contain a single `<p>` (paragraph element) followed by a unordered list containing `li`.
The result will be parsed by the server and injected into the template when a new locale is loaded.

By default, a `Question` is bound to the template by the `slug`. For example, a slug name `this-is-a-question` will be
bound to the template question with a `title` property matching `%this-is-a-question%`. Within the template question, any
`%0%`, `%1%`, `%2%` will correlate with the index of the list elements starting from the top/

##### Example

**On Cosmic JS Server:**
```
locale: en
title: This is a Question
slug: this-is-a-question
```
**Content:**
```html
<p>This is the question statement</p> <!-- matches "%this-is-a-question%" within the template -->
<ul>
    <li>Answer 1</li> <!-- %0% -->
    <li>Answer 2</li> <!-- %1% -->
    <li>Answer 3</li> <!-- %2% -->
</ul>
```

**The `template.js` markup:**
```javascript
{ 
    //...
    questions: [
        {   
            title: '%first-question-part-2%', // This is the question statement
            name: 'firstQuestionChecked',
            type: 'checkbox',
            choices: [
                {value: 'first', text: '%0%'}, // 'Answer 1'
                {value: 'second', text: '%1%'}, // 'Answer 2'
                {value: 'third', text: '%2%'} // 'Answer 2'
            ]
        }
    ]
    //...
}
```

Because of the way the template processor works, you can place the `%(X)%` template strings anywhere, as well as use them
multiple times. The scope of that specific template is based on the question specified by the `title`.

#### Nodes

A `Node` is simply a localized text value that has use within the App's front-end. It could range from the app title,
a string for a custom button or action, or a simple message. The data is stored based on `slug` value within the React state
`langData`.

They can also correspond with the titles of survey `pages` on the back-end. They are only rendered for `page.title` value,
and match the enclosed `%slug_name%` syntax.

An example of this can be found in the default `survey/template.js` file, as well as in the `src/app.js` file. 


