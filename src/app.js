const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/routes');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use('/api', routes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));
