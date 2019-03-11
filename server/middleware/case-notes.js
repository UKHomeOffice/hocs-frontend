// const mockCaseNotes = [
//     {
//         type: 'Data Input',
//         events: [
//             { date: '2 September 2018 at 1.26pm', note: { message: 'Allocated to Skeletor' } },
//             { date: '2 September 2018 at 1.01pm', note: { message: 'Allocated to Bob Ross' } }
//         ]
//     },
//     {
//         type: 'Reject',
//         events: [
//             { date: '1 September 2018 at 4.35pm', note: { author: 'He-Man', message: 'I have the power!' } }
//         ]
//     },
//     {
//         type: 'Markup',
//         events: [
//             { date: '1 September 2018 at 2.09pm', note: { message: 'Allocated to He-Man' } },
//             { date: '1 September 2018 at 1.21pm', note: { author: 'Bob Ross', message: 'You just sort of have to make almighty decisions. Just leave that space open. Let\'s start with an almighty sky here.' } }
//         ]
//     },
//     {
//         type: 'Data Input',
//         events: [
//             { date: '19 August 2018 at 1.01pm', note: { message: 'Allocated to Bob Ross' } }
//         ]
//     }
// ];

const { caseworkServiceClient } = require('../libs/request');
const User = require('../models/user');

async function getCaseNotes(req, res, next) {
    const { data = [] } = await caseworkServiceClient.get(`/case/${req.params.caseId}/timeline`, { headers: User.createHeaders(req.user) });
    res.locals.caseNotes = data
        .sort((first, second) => first.eventTime > second.eventTime ? -1 : 1)
        .map(({ type, eventTime, message, userName: author }) => ({
            type,
            events: [
                { date: Intl.DateTimeFormat('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(eventTime)), note: { message, author } }
            ]
        })) || [];
    next();
}

async function getCaseNotesApiResponse(req, res) {
    res.json(res.locals.caseNotes);
}

module.exports = {
    getCaseNotes,
    getCaseNotesApiResponse
};