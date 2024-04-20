/********************************************************************************
* WEB322 – Assignment 06
* 
* I declare that this assignment is my own work in accordance with Seneca College's
* Academic Integrity Policy:
* 
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
* Name: Phil Sajdak Student ID: 162386221 Date: April 19, 2024
* 
* GitHub Repository URL: https://github.com/philsajdak/lego-web
* Deployed Application URL: https://misty-goat-nightgown.cyclic.app
*
********************************************************************************/
const legoData = require("./modules/legoSets");
const express = require("express");
const path = require("path");
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public', 'views'));

app.use(express.static('public'));
const HTTP_PORT = process.env.PORT || 8069;

legoData.Initialize().then(() => {
    app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));

    app.get("/", (req, res) => {
        res.render("home", { page: "home" });
    });

    app.get("/about", (req, res) => {
        res.render("about", { page: "about" });
    });

    app.get("/lego/sets", (req, res) => {
        const theme = req.query.theme;
        if (theme) {
            legoData.getSetsByTheme(theme).then((data) => {
                res.render("sets", { sets: data, page: '/lego/sets' });
            }).catch((err) => {
                res.status(404).render("404", { page: "404" });
            });
        } else {
            legoData.getAllSets().then((data) => {
                res.render("sets", { sets: data, page: '/lego/sets' });
            }).catch((err) => {
                res.status(404).render("404", { page: "404" });
            });
        }
    });

    app.get("/lego/addSet", (req, res) => {
        legoData.getAllThemes().then((themeData) => {
            res.render("addSet", { themes: themeData, page: '/lego/addSet' });
        }).catch((err) => {
            res.status(500).render("500", {
                message: `Error: ${err}`,
                page: ''
            });
        });
    });

    app.post("/lego/addSet", (req, res) => {
        legoData.addSet(req.body).then(() => {
            res.redirect("/lego/sets");
        }).catch((err) => {
            res.render("500", {
                message: `Error: ${err}`,
                page: ''
            });
        });
    });

    app.get("/lego/editSet/:num", (req, res) => {
        const setNum = req.params.num;
        Promise.all([
            legoData.getSetByNum(setNum),
            legoData.getAllThemes()
        ])
            .then(([setData, themeData]) => {
                if (!setData) {
                    res.status(404).render("404", { message: "Set not found", page: "404" });
                } else {
                    res.render("editSet", { set: setData, themes: themeData, page: '' });
                }
            })
            .catch((err) => {
                res.status(404).render("404", { message: err.toString(), page: "404" });
            });
    });

    app.post("/lego/editSet", (req, res) => {
        const { set_num } = req.body;
        legoData.editSet(set_num, req.body)
            .then(() => {
                res.redirect("/lego/sets");
            })
            .catch((err) => {
                res.render("500", {
                    message: `Error: ${err}`,
                    page: ''
                });
            });
    });

    app.get("/lego/deleteSet/:num", (req, res) => {
        const setNum = req.params.num;
        legoData.deleteSet(setNum)
            .then(() => {
                res.redirect("/lego/sets");
            })
            .catch((err) => {
                res.render("500", { message: `Error: ${err}`, page: '' });
            });
    });

    app.get("/lego/sets/:set_num", (req, res) => {
        const setNum = req.params.set_num;
        legoData.getSetByNum(setNum).then((data) => {
            if (!data) {
                res.status(404).render("404", { message: "Set not found", page: "404" });
            } else {
                res.render("set", { set: data, page: '/lego/sets/' + setNum });
            }
        }).catch((err) => {
            res.status(500).render("500", { message: `Error fetching set details: ${err}`, page: '' });
        });
    });

    app.use((req, res) => {
        res.status(404).render("404", { page: "404" });
    });
});
