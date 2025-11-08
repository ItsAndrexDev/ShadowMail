import express from "express";
import Database from "better-sqlite3";
import cookieParser from "cookie-parser";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import cors from "cors"
import parseMails from "./mailparse.js";

const db = new Database("shadowmail.db");


const app = express()
const PORT = 3030;
const SALT_ROUNDS = 10

app.use(cors({
    origin: "https://shadowmail.win", // or your dev URL
    credentials: true
}));

app.set('trust proxy', true);
app.use((req, res, next) => {
    // Cloudflare sometimes passes 'http' in cf-visitor, even though it’s actually HTTPS
    if (req.headers["cf-visitor"]?.includes('"http"')) {
        req.headers["x-forwarded-proto"] = "https";
    }
    next();
});

app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));


parseMails();


function getSession(cookie) {
    const session = db.prepare("SELECT * FROM valid_sessions WHERE id = ?", { readonly: true }).get(cookie);
    if (!session) return null;
    return session;
}

function getUser(id) {
    const user = db.prepare("SELECT * from users WHERE id = ?", { readonly: true }).get(id);
    if (!user) return null;
    return user
}

function getAddresses(userId) {
    const addresses = db.prepare("SELECT * FROM address WHERE user_id = ?", { readonly: true }).all(userId);
    return addresses
}


app.post("/api/register", async (req, res) => {
    const { email, password } = req.body;
    const emailMatch = email.match(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    ); // regex email verification
    if (!emailMatch) return res.status(400).json({ "message": "You must enter a valid email!" });
    const passwordMatch = password.match(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/);
    if (!passwordMatch)
        return res.status(400).json({ "message": "Password wrong format" })

    try {
        const hash = await bcrypt.hash(password, SALT_ROUNDS);

        db.prepare(`INSERT INTO users(email,password_hash) VALUES (?, ?)`).run(email, hash)

        res.status(200).json({ "message": "Successfully Registered" })
        console.log(`✅ Registration of user ${email} succeeded!`)
    } catch (err) {
        res.status(401).json({ "message": "Email already in use" })
    }

});

app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    const user = db.prepare("SELECT * FROM users WHERE email = ?", { readonly: true }).get(email);
    if (!user) return res.status(401).json({ "message": "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ "message": "Invalid credentials" });

    let cookieId = uuidv4();

    db.prepare("DELETE FROM sessions WHERE user_id = ?").run(user.id);

    db.prepare("INSERT INTO sessions (id,user_id,expires) VALUES (?, ?, datetime('now', '+1 hour'))")
        .run(cookieId, user.id);

    res.cookie("sessionId", cookieId, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 3600000
    });
    console.log(`✅ Login of user ${email} succeeded!`)
    res.status(200).json({ "message": "Successfull Login" })
})



app.post("/api/get-emails", async (req, res) => {
    if (!req.cookies.sessionId) return res.status(401).json({ "message": "Invalid Session" });
    const session = getSession(req.cookies.sessionId);
    if (!session) return res.status(401).json({ "message": "Invalid Session" });

    const { address } = req.body;

    if (!address) return res.status(400).json({ "message": "Must specify an address to read emails from" });
    let match = address.match(/\d+(?=@shadowmail\.win)/)
    if (!match) return res.status(429).json({ "message": "Invalid Email Format" });



    let mails = db.prepare("SELECT * FROM mail WHERE address_id = ?", { readonly: true }).all(match)
    if (!mails) return res.status(204).json({ "message": "No mails", "mails": {} });
    res.status(200).json({ "message": "Emails read", "mails": mails })

})


app.post("/api/delete-email", async (req, res) => {
    if (!req.cookies.sessionId) return res.status(401).json({ "message": "Invalid Session" });
    const session = getSession(req.cookies.sessionId);
    if (!session) return res.status(401).json({ "message": "Invalid Session" });

    const { email } = req.body;
    if (!email) return res.status(400).json({ "message": "Must specify an email to delete" });

    db.prepare("DELETE FROM mail WHERE id = ?").run(email);
    res.status(200).json({ "message": "Deleted" + email })

})






app.post("/api/new-address", async (req, res) => {
    if (!req.cookies.sessionId) return res.status(401).json({ "message": "Invalid Session" });
    const session = getSession(req.cookies.sessionId);
    if (!session) return res.status(401).json({ "message": "Invalid Session" });

    const addresses = getAddresses(session.user_id);
    const addressAmount = addresses.length;
    if (addressAmount >= 12) return res.status(429).json({ "message": "Too many emails" });
    const user = getUser(session.user_id);
    db.prepare("INSERT INTO address (user_id) VALUES (?)").run(user.id)
    const createdId = db.prepare("SELECT MAX(id) AS maxId FROM address", { readonly: true }).get();
    res.status(200).json({ "message": "Successfully created new email for user", "address": createdId.maxId + "@shadowmail.win", "id": createdId.maxId })
})



app.post("/api/get-addresses", async (req, res) => {
    if (!req.cookies.sessionId) return res.status(401).json({ "message": "Invalid Session" });
    const session = getSession(req.cookies.sessionId);
    if (!session) return res.status(401).json({ "message": "Invalid Session" });

    const addresses = getAddresses(session.user_id);
    let addy = {}
    let newAddresses = []
    for (addy of addresses) {
        newAddresses.push({ "id": addy.id, "address": addy.id + "@shadowmail.win" })
    }
    res.status(200).json({ "message": "Successfully read all addresses", "addresses": newAddresses })
})


app.post("/api/delete-address", async (req, res) => {
    if (!req.cookies.sessionId) return res.status(401).json({ "message": "Invalid Session" });
    const session = getSession(req.cookies.sessionId);
    if (!session) return res.status(401).json({ "message": "Invalid Session" });
    const { address } = req.body;
    if (!address) return res.status(400).json({ "message": "Must specify address to delete" });

    let match = address.match(/\d+(?=@shadowmail\.win)/)
    if (!match) res.status(429).json({ "message": "Invalid Email Format" })
    db.prepare("DELETE FROM address WHERE id = ?").run(match);
    res.status(200).json({ "message": "Deleted" + address })

})

app.post("/api/session", async (req, res) => {
    if (!req.cookies.sessionId) return res.status(401).json({ "message": "Invalid Session" });
    const session = getSession(req.cookies.sessionId);
    if (!session) return res.status(401).json({ "message": "Invalid Session" });
    res.status(200).json({ "message": "Correct SessionId" });
})

app.post("/api/contact", async (req, res) => {
    if (!req.cookies.sessionId) return res.status(401).json({ "message": "Invalid Session" });
    const session = getSession(req.cookies.sessionId);
    if (!session) return res.status(401).json({ "message": "Invalid Session" });
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) return res.status(400).json({ "message": "Missing parameters" });

})


app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`)
})