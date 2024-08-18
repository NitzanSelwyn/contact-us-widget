const cors = require('cors')

const corsInfo = cors({
    origin: true,
    credentials: true,
});

// cors for spacific domains
// const allowedOrigins = ['http://example.com'];
// app.use(cors({
//     origin: function (origin, callback) {dotenv
//         // Allow requests with no origin (like mobile apps or curl requests)
//         if (!origin) return callback(null, true);
//         if (allowedOrigins.indexOf(origin) === -1) {
//             const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
//             return callback(new Error(msg), false);
//         }
//         return callback(null, true);
//     }
// }));


module.exports = corsInfo
