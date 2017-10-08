const path = require('path');
const fs = require('fs');

const technologies = require('./technologies.json');
const projects = 
[
    {
        title: 'Embedded Testing Language(ETL) for C#',
        keywords: ['ASP', 'NET', 'CORE', '2.0', 'ETL', 'C#', 'Embedded', 'Testing', 'Language'],
        technologies: ['ASPDOTNET', 'C#', 'DOTNET', 'DOTNETCORE'],
        console: {
            name: 'ETL',
            testConnection: {
                url: 'https://afirusportfolio-api.herokuapp.com/api/ETL',
                method: 'GET'
            },
            connection: {
                url: 'https://afirusportfolio-api.herokuapp.com/api/ETL',
                method: 'POST'
            }
        },
        content: {
            text: `ETL is a work in progress testing language that is written in and is meant for C#.<br />
            It is build upon the ASP .Net Core 2.0 Framework.<br />
            <a href="https://github.com/bunkersem/ETL">View on Github</a>`,
        },
        webApp: false,
        desktopApp: false,
        util: true,
        mobileApp: false
    },
    {
        title: 'Webshop',
        keywords: [],
        technologies: [],
        content: {
            text: `
            <a href="https://github.com/bunkersem/project-tango">View on Github</a><br />
            <a href="http://spelletjeskast.herokuapp.com/">View on Heroku</a>`,
            images: [
                'https://imgur.com/1po4xn2.png', 
                'https://imgur.com/HzeAPGe.png', 
                'https://imgur.com/ZZKwLd7.png', 
                'https://imgur.com/EnWoL7L.png'
            ]
        },
        webApp: true,
        desktopApp: false,
        util: false,
        mobileApp: false
    },
    {
        title: 'OV Fiets App',
        keywords: ['OV', 'Fiets', 'Bike', 'Public Transport'],
        technologies: ['ExpressJS', 'Bootstrap', 'Passport', 'Javascript', 'SCSS', 'BabelJS', 'ESLint', 'GulpJS', 'NodeJS', 'JQuery'],
        content: {
            text: `
            Ov Fiets App is an which helps you easily monitor the amount of bikes at a rental location.
            <a href="https://play.google.com/store/apps/details?id=com.EchoSierraStudio.Ov_Fiets_App">View on Google Play</a><br />
            `,
            images: [
                'https://lh3.googleusercontent.com/8Hiohm8MbUBsXrA0t8kN3Za0WFM4pwHfYWt83ILT4wTU5uinwjUSGgeT0iYAWPdkHD8=h900-rw', 
                'https://lh3.googleusercontent.com/l75ix4If4c_8KraGlyIxLXXS94-HcFfrhotqDZduFKdY5K0U3s9P1RPMlZauxjMBJOs=h900-rw', 
                'https://lh3.googleusercontent.com/AcQbNKBOp-oGXtEeMeRogG0ranafknaCE10tGv3tJfNe2MOF7HjbqYDvkNFJy1DlwIs=h900-rw', 
                'https://lh3.googleusercontent.com/WL5O2nFnc2AQAZ4lTeyVXvYyt33iqvUQ9jxwKsSLWP_IYYRDa2N2qZK9Ojg8IT2eFJc=h900-rw'
            ]
        },
        webApp: false,
        desktopApp: false,
        util: false,
        mobileApp: true,
    },
    {
        title: 'Solar System Newtonian Sim 3D',
        keywords: ['Newtonian', '3D', 'Sim', 'Solar', 'System'],
        technologies: ['Unity3D', 'C#'],
        content: {
            text: `
            Reorganize our solar system, adjust orbits and edit planets with an easy to use interface. You can use this application to learn about orbital mechanics, physics and the solar system. The game is a sandbox type game. When you start playing the solar system will initialize to its real world state using an external API. This means that the game and the real world locations and rotations, etc, of all the planets in our solar system will be synchronized when you start the game.
            <a href="https://play.google.com/store/apps/details?id=com.EchoSierraStudio.NewtonianSimulation3D">View on Google Play</a><br />
            `,
            images: [
                'https://lh3.googleusercontent.com/Dzzq99or6a2PCYFhtmsUweOPx6uUJIQzrQsw4ha_51RArt-SdiGo8XERUQiuEm65UssI=h900-rw', 
                'https://lh3.googleusercontent.com/OdrDVjNnnoSY72L-WJu56gHCo__seDE447QlyAnD4MDRZgU6Wy2LDr4IaXWPku7JHVw=h900-rw', 
                'https://lh3.googleusercontent.com/uU9rF5RTP5dEJ8wpE0pL-rVqizuklD5fe5uFsF9LfuQB2VM_ZkhQveI4X-GgzfaUqA=h900-rw', 
                'https://lh3.googleusercontent.com/PMRJifATlLeiDwfzihTHxKcribCmUboggbXEYQmqZgRBspjqrFJoXrK_BxndKREgOuu5=h900-rw',
                'https://lh3.googleusercontent.com/nvB5CGt4T6f4jHpHNUNhFznmKQNz-TdaeKXxf9FwH2SCBS4nD6WUsAyF0fKeXy3Bog=h900-rw'
            ]
        },
        webApp: false,
        desktopApp: false,
        util: false,
        mobileApp: true,
    },
    {
        title: 'Top Down Defence',
        keywords: ['Top Down', 'Defence', 'Game'],
        technologies: ['Unity3D', 'C#'],
        content: {
            text: `
            Top Down Defence is a top down - tower defense game, made with the beautiful game asset pack provided by Kenny NL. It has infinite leveling but i doubt you will get further than lvl100. Vindicta features a great variety of enemy types such as the "low health, very fast and difficult to hit" enemies, and the "hard to kill but slow" enemies. The turrets have extensive upgrading capabilities so even in late game stages the game is still hard to beat.
            <a href="https://play.google.com/store/apps/details?id=com.EchoSierraStudio.Vindicta">View on Google Play</a><br />
            `,
            images: [
                'https://lh3.googleusercontent.com/9T74xOm45GcBoNQT1Qsa4PUf5qBNHaX_8N-1NNFxY_Hne5aYF6uhxBLg5pGspd_-7Lk=h900-rw', 
                'https://lh3.googleusercontent.com/JsuqKTuDuLAffU5ObsrX--qJm3aCgEZRZ0wLTyODUGO3oI35aptk51gonOSEjt6OrRQ=h900-rw', 
                'https://lh3.googleusercontent.com/LB8RGK0P0552m3EE-6lleyXhriM0kkQDBH6Ja0mPUWb05r9Ydqbz4NQoDm2ncQE0Uw=h900-rw', 
                'https://lh3.googleusercontent.com/dyRlRn0m8a-FDPM9sS-MnomdcOSBC1c6EtJrd5N9joSSrJYRc5I1oQxq0phMFfgN5Qk=h900-rw',
                'https://lh3.googleusercontent.com/k6ub_FFE5BJ30xcBV_iNVuRPw7KiVycgCAPj2IALMUPOiqDKOqyt8q4e5-1_GdUwF_QI=h900-rw'
            ]
        },
        webApp: false,
        desktopApp: false,
        util: false,
        mobileApp: true,
    },
    
    {
        title: 'Mind Viewer',
        keywords: ['Javascript', 'Mind', 'Viewer', 'Mapper'],
        technologies: ['Electron', 'NodeJS', 'JQuery'],
        content: {
            text: `
            An easy to use cross-platform application which helps in creating mind maps & simple diagrams.
            Download <a href="https://www.dropbox.com/s/i7y8044r36n05ln/MindMap-windows.zip?dl=0">Here</a><br />
            `,
            images: [
                'https://imgur.com/migbBCq.png',
                'https://imgur.com/g3IAGN4.png',
                'https://imgur.com/Dx7T0ZY.png',
                'https://imgur.com/YNumc7H.png',
            ]
        },
        webApp: false,
        desktopApp: true,
        util: false,
        mobileApp: false,
    },
    {
        title: 'Color Adjustor (CA)',
        keywords: ['C', 'CA', 'Color Adjustor', 'Hex', 'RGB', 'RGBA'],
        technologies: ['C'],
        content: {
            text: `
            A Command line tool to quickly change hex colors and get rgb values.
            Download <a href="https://www.dropbox.com/s/ed9k1ci4xsabr66/ca.rar?dl=0">Here</a><br />
            `,
            images: [
                'https://imgur.com/S8ocjYo.png',
                'https://imgur.com/CpWSfvJ.png',
                'https://imgur.com/NgK7RuD.png',
                'https://imgur.com/NwIoZBS.png',
            ]
        },
        webApp: false,
        desktopApp: false,
        util: true,
        mobileApp: false,
    },
    {
        title: 'Periodic Table',
        keywords: ['Periodic', 'Table', 'React', 'Component'],
        technologies: ['React'],
        content: {
            text: `
            A Command line tool to quickly change hex colors and get rgb values.
            <iframe src="https://bunkersem.github.io/periodic-table/"></iframe>`
        },
        webApp: false,
        desktopApp: false,
        util: true,
        mobileApp: false,
    },


]


const technologieNames = technologies.map(p => p.name);
projects.forEach(p => {
    p.technologies.forEach(t => {
        if (technologieNames.some(tn => tn.toLowerCase() === t.toLowerCase()) === false) {
            throw Error(`${t} does not exist
(Allowed Values: ${technologieNames.join(', ')})`);
        }
    });
});
fs.writeFileSync(path.join(__dirname, 'projects.json'), JSON.stringify(projects, null, 2));


