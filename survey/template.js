module.exports = {
    pages: [
        {
            name: 'page1', title: '%first-page-title%',questions: [
            {
                title: '%first-question%',
                name: 'firstQuestion',
                type: 'radiogroup',
                choices: [
                    {value: 'first value', text: '%0%'},
                    {value: 'second value', text: '%1%'},
                    {value: 'third', text: '%2%'}
                ],
                isRequired: true
            },
            {
                title: '%first-question-part-2%',
                name: 'firstQuestionChecked',
                type: 'checkbox',
                choices: [
                    {value: 'first', text: '%0%'},
                    {value: 'second', text: '%1%'},
                    {value: 'third', text: '%2%'},
                    {value: 'fourth', text: '%3%'}
                ],
                hasOther: true,
                isRequired: true,
                visibleIf: '{firstQuestion} = "first value"'
            }
        ]
        },
        {
            name: 'page2', title: '%hello-world-page%', questions: [
            {
                title: '%hello-world-recognize%',
                name: 'helloWorldRecognized',
                type: 'radiogroup',
                choices: [
                    {value: 'yes', text: '%0%'},
                    {value: 'no', text: '%1%'}
                ],
                isRequired: true
            },
            {
                title: '%hello-world-thoughts%',
                name: 'helloWorldThoughts',
                type: 'dropdown',
                colCount: 0,
                choices: [
                    {value: 'happiness', text: '%0%'},
                    {value: 'sadness', text: '%1%'},
                    {value: 'anger', text: '%2%'}
                ],
                isRequired: true,
                hasOther: true,
                visibleIf: '{helloWorldRecognized} = "yes"'
            }
        ]
        }
    ]
};