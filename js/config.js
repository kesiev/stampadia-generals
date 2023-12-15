const
    CONFIG={

        // Project metadata
        title:"Generals Of Stampadia",
        version:"0.1",
        author:"KesieV",
        license:"MIT",
        startYear:2023,
        endYear:2024,

        // Project URLs
        homepageUrl:"https://www.kesiev.com/stampadia-generals/",
        printShopUrl:"https://www.kesiev.com/stampadia-generals/printshop.html",
        sourcesShortUrl:"github.com/kesiev/stampadia-generals",
        sourcesUrl:"https://github.com/kesiev/stampadia-generals",
        learnUrl:"https://www.kesiev.com/stampadia-generals/learn.html",

        // Palette
        paletteUrl:"https://lospec.com/palette-list/pax-24",
        paletteName:"PAX-24",

        // Default set IDs
        fullCoreDeckId:"GOSFCORE",
        liteCoreDeckId:"GOSLCORE",

        // Game settings
        handLimit:7,
        lifeLimit:5,
        liteDeckUnitCards:40,

        // Shared labels
        languages:[
            {
                id:"EN",
                label:"English",
                dictionary:{
                    exhaust:"exhaust",
                    restore:"restore",
                    restored:"restored",
                    exhausted:"exhausted",
                    exhaustedNot:"not exhausted",    
                    allyUnit:"Ally",
                    allyUnitPlural:"Allies",
                    enemyUnit:"Enemy",
                    enemyUnitPlural:"Enemies",
                    frontRow:"Front Row",
                    healingAction:"Healing Action",
                    incomingRow:"Incoming Row",
                    jump:"Jump",
                    jumpDoing:"Jumping",
                    jumpPlural:"Jumps",
                    life:"Life",
                    lifeCard:"Life Card",
                    lifeCardPlural:"Life Cards",
                    opposingRow:"Opposing Row",
                    placeStack:"Place Stack",
                    playerRow:"Player Row",
                    shield:"Shield",
                    shieldPlural:"Shields",
                    space:"space",
                    spacePlural:"spaces" 
                }
            },{
                id:"FR",
                label:"Français",
                dictionary:{
                    exhaust:"exhaust",
                    restore:"restore",
                    restored:"restored",
                    exhausted:"exhausted",
                    exhaustedNot:"not exhausted",    
                    allyUnit:"Allié",
                    allyUnitPlural:"Alliés",
                    enemyUnit:"Ennemi",
                    enemyUnitPlural:"Ennemis",
                    frontRow:"Ligne de Front",
                    healingAction:"Action de Soin",
                    incomingRow:"Sortie de l'Imprimante",
                    jump:"Jump",
                    jumpDoing:"Jumping",
                    jumpPlural:"Jumps",
                    life:"Vie",
                    lifeCard:"Life Card",
                    lifeCardPlural:"Life Cards",
                    opposingRow:"Ligne Opposée",
                    placeStack:"Pile de Lieu",
                    playerRow:"Ligne Joueur",
                    shield:"Bouclier",
                    shieldPlural:"Boucliers",
                    space:"case",
                    spacePlural:"cases" 
                }
            },{
                id:"IT",
                label:"Italiano"
            },{
                id:"ES",
                label:"Español"
            }
        ],
        languagesById:{},
        languagesSupported:""       
    };

CONFIG.footer = "Best on Firefox/Chrome - "+CONFIG.title+" - &copy; "+CONFIG.startYear+" - "+CONFIG.endYear+" - Sources at <a target='_blank' href='"+CONFIG.sourcesUrl+"'>"+CONFIG.sourcesShortUrl+"</a> - Print the game cards <a target='_blank' href='"+CONFIG.printShopUrl+"'>here</a>.";
CONFIG.languages.forEach(language=>{
    CONFIG.languagesSupported+=language.id+",";
    CONFIG.languagesById[language.id]=language;
});
CONFIG.languagesSupported=CONFIG.languagesSupported.substr(0,CONFIG.languagesSupported.length-1);