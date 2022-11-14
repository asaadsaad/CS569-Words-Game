const https = require('https');
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const headers = require('./config.json');
const app = express()

app.use(cors())
app.use(morgan('dev'))

app.get('/check/:word', (req, res, next) => {
    try {
        const { word } = req.params

        const options = {
            host: 'od-api.oxforddictionaries.com',
            port: '443',
            path: `/api/v2/entries/en-us/${word}?fields=definitions&strictMatch=false`,
            method: "GET",
            headers
        };

        https.get(options, (resp) => {
            let body = '';
            resp.on('data', (chunk) => {
                body += chunk;
            });
            resp.on('end', () => {
                const parsed = JSON.parse(body);
                if (parsed.id) {
                    res.json({ valid: true })
                } else {
                    res.json({ valid: false })
                }
            });
        });
    } catch (error) {
        next(new Error(`Something went wrong! Please try again.`))
    }
})

app.all('*', (req, res, next) => {
    next(new Error('Route not found'))
})
app.use((err, req, res, next) => {
    res.json({ error: err.message })
})
app.listen(3000, () => console.log(`listening on 3000`))