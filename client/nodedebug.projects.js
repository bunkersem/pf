const path = require('path');
const fs = require('fs');


var projects = 
[
    {
        title: "Embedded Testing Language(ETL) for C#",
        keywords: ["je", "la", "du"],
        content: 
        `This is lorem ipsum
        
        
        `,
        webApp: false,
        desktopApp: false,
        util: true,
        mobileApp: true
    },

]



fs.writeFileSync(path.join(__dirname, 'projects.json'), JSON.stringify(projects, null, 2));