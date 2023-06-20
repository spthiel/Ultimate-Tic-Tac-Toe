import path from 'path';
import express, {Express} from 'express';

export default function(app: Express) {

    app.use("/", express.static(path.join(__dirname, "..", "..", "client", "dist")))

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "..", "..", "client", "dist", "index.html"));
    })

}
