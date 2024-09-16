import express from 'express';
import helmet from 'helmet';

const app = express();
const port = 3000;

app.use(express.json())

app.use(helmet());

app.get('/', (req, res) => {
    res.send("Hello world! Welcome to BookTrack!")
});

app.listen(port, () => {
    console.log(`We are now listening on port ${port}`)
})