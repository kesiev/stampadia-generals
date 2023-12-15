function CardTools(ENV) {

    const
        SYMBOLS={
            default:{
                _unknown:"?",
                fire:"{symbol symbolFireSmall}",
                water:"{symbol symbolWaterSmall}",
                earth:"{symbol symbolEarthSmall}",
                air:"{symbol symbolAirSmall}",
                bold:"{bold}",
                endbold:"{endbold}",
                italic:"{italic}",
                enditalic:"{enditalic}",
                phaseany:"{symbol symbolPhaseAny}",
                phasedefense:"{symbol symbolPhaseShield}",
                phasedefeat:"{symbol symbolPhaseSkull}",
                phaseattack:"{symbol symbolPhaseSword}",
                phaselife:"{symbol symbolPhaseHeart}",
                phasefront:"{symbol symbolPhaseFront}",
                area:"{symbol symbolBanner}",
                defeat:"{symbol symbolDeathSmall}",
                attack:"{symbol symbolAttackSmall}",
                life:"{symbol symbolLifeSmall}",
                wound:"{symbol symbolDamageSmall}",
                x:"{symbol symbolXSmall}",
                "x+1":"{symbol symbolX1Small}",
                left:"{symbol symbolLeftSmall}",
                right:"{symbol symbolRightSmall}",
                front:"{symbol symbolFrontSmall}",
                sides:"{symbol symbolSidesSmall}",
                frontright:"{symbol symbolFrontRightSmall}",
                frontleft:"{symbol symbolFrontLeftSmall}",
                frontsides:"{symbol symbolFrontLeftSmall}{symbol symbolFrontRightSmall}",
                around:"{symbol symbolLeftSmall}{symbol symbolFrontSmall}{symbol symbolRightSmall}",
                level:"{symbol symbolLSmall}",
                "level+1":"{symbol symbolL1Small}",
                "level+2":"{symbol symbolL2Small}",
                "level-1":"{symbol symbolLm1Small}",
                "level-2":"{symbol symbolLm2Small}"
            },
            plainText:{
                _unknown:" [?] ",
                fire:" [Fire] ",
                water:" [Water] ",
                earth:" [Earth] ",
                air:" [Air] ",
                bold:"",
                endbold:"",
                italic:"",
                enditalic:"",
                phaseany:" [Any Phase] ",
                phasedefense:" [Defense Phase] ",
                phasedefeat:" [Defeat Phase] ",
                phaseattack:" [Attack Phase] ",
                phaselife:" [Life Phase] ",
                phasefront:" [Front Phase] ",
                area:" [Area Symbol] ",
                defeat:" [Defeat] ",
                attack:" [Attack value] ",
                life:" [Life value] ",
                wound:" [Wound] ",
                x:" [Activation times] ",
                "x+1":"Activation times +1",
                left:" [Ally on the left] ",
                right:" [Ally on the right] ",
                front:" [Ally on the front] ",
                sides:" [Ally on the sides] ",
                frontright:" [Enemy on the right] ",
                frontleft:" [Enemy on the left] ",
                frontsides:" [Enemy on the sides] ",
                around:" [Around] ",
                level:" [Ink Level] ",
                "level+1":" [Ink Level +1] ",
                "level+2":" [Ink Level +2] ",
                "level-1":" [Ink Level -1] ",
                "level-2":" [Ink Level -2] "
            },
            color:{
                fire:"{symbol symbolFireSmallColor}",
                water:"{symbol symbolWaterSmallColor}",
                earth:"{symbol symbolEarthSmallColor}",
                air:"{symbol symbolAirSmallColor}"
            }
        },
        ELEMENTS=["fire","air","earth","water"],
        TRIGGERS=["onAttack","onDefend","onAll","onDefeat","onLife","onFront"],
        DECKTYPES=["full","expansion"],
        CARDTYPES=["unit","event","text"],
        CARDTYPEID={
            unit:"U",
            event:"E",
            text:"T"
        },
        ILLUSTRATION_SRC_WIDTH=24,
        ILLUSTRATION_SRC_HEIGHT=24,
        ILLUSTRATION_SCALE=10,
        PALETTE=[
            { symbol:"0", version:{ normal: { r:0, g:0, b:0, a:0 } } },
            { symbol:"1", version:{ normal: { r:244, g:245, b: 239, a:255 } } },
            { symbol:"2", version:{ normal: { r:248, g:199, b: 164, a:255 } } },
            { symbol:"3", version:{ normal: { r:231, g:132, b: 168, a:255 } } },
            { symbol:"4", version:{ normal: { r:235, g:157, b: 69, a:255 } } },
            { symbol:"5", version:{ normal: { r:187, g:154, b: 62, a:255 } } },
            { symbol:"6", version:{ normal: { r:246, g:228, b: 85, a:255 } } },
            { symbol:"7", version:{ normal: { r:200, g:219, b: 223, a:255 } } },
            { symbol:"8", version:{ normal: { r:161, g:70, b: 170, a:255 } } },
            { symbol:"9", version:{ normal: { r:215, g:77, b: 76, a:255 } } },
            { symbol:"A", version:{ normal: { r:166, g:93, b: 53, a:255 } } },
            { symbol:"B", version:{ normal: { r:143, g:203, b: 98, a:255 } } },
            { symbol:"C", version:{ normal: { r:53, g:136, b: 78, a:255 } } },
            { symbol:"D", version:{ normal: { r:160, g:171, b: 177, a:255 } } },
            { symbol:"E", version:{ normal: { r:150, g:47, b: 44, a:255 } } },
            { symbol:"F", version:{ normal: { r:104, g:45, b: 44, a:255 } } },
            { symbol:"G", version:{ normal: { r:133, g:223, b: 235, a:255 } } },
            { symbol:"H", version:{ normal: { r:51, g:156, b: 163, a:255 } } },
            { symbol:"I", version:{ normal: { r:27, g:76, b: 90, a:255 } } },
            { symbol:"J", version:{ normal: { r:94, g:106, b: 130, a:255 } } },
            { symbol:"K", version:{ normal: { r:25, g:16, b: 35, a:255 } } },
            { symbol:"L", version:{ normal: { r:114, g:173, b: 238, a:255 } } },
            { symbol:"M", version:{ normal: { r:67, g:94, b: 219, a:255 } } },
            { symbol:"N", version:{ normal: { r:71, g:67, b: 148, a:255 } } },
            { symbol:"O", version:{ normal: { r:50, g:45, b: 77, a:255 } } },
        ],
        PALETTEBYRGBA={};
        PALETTEBYSYMBOL={};

    let
        fileCache={};

    PALETTE.forEach(color=>{

        let
            max = Math.max( color.version.normal.r, color.version.normal.g, color.version.normal.b ),
            min = Math.min( color.version.normal.r, color.version.normal.g, color.version.normal.b ),
            maxMinAvg = (max+min)/2,
            avg = ( color.version.normal.r + color.version.normal.g + color.version.normal.b ) / 3;

        color.version.desaturateAvg = { r:avg, g:avg, b:avg, a:color.version.normal.a };
        color.version.desaturateMax = { r:max, g:max, b:max, a:color.version.normal.a };
        color.version.desaturateMinMaxAvg = { r:maxMinAvg, g:maxMinAvg, b:maxMinAvg, a:color.version.normal.a };

        PALETTEBYSYMBOL[color.symbol]=color;
        PALETTEBYRGBA[color.version.normal.r+","+color.version.normal.g+","+color.version.normal.b+","+color.version.normal.a]=color;
    });

    this.PALETTE=PALETTE;
    this.PALETTEBYSYMBOL=PALETTEBYSYMBOL;
    this.ILLUSTRATION_SRC_WIDTH=ILLUSTRATION_SRC_WIDTH;
    this.ILLUSTRATION_SRC_HEIGHT=ILLUSTRATION_SRC_HEIGHT;
    this.ILLUSTRATION_SCALE=ILLUSTRATION_SCALE;

    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    function rgbToHex(color) {
        return "#" + componentToHex(color.r) + componentToHex(color.g) + componentToHex(color.b);
    }

    function makeBox(into,text,bgcolor,fgcolor,font) {
        let
            box=document.createElement("div");
        box.style.padding="5px";
        box.style.margin="2px 0";
        box.style.border="1px solid #cecece";
        box.style.overflow="auto";
        box.style.maxHeight="200px";
        if (bgcolor) box.style.backgroundColor=bgcolor;
        if (fgcolor) box.style.color=fgcolor;
        box.style.fontFamily=font || "helvetica,sans-serif";
        box.innerText=text;
        into.appendChild(box);
        return box;
    }

    function makeCollapsableBox(into,label,text,bgcolor,fgcolor,font) {
        let
            boxLabel=makeBox(into,"> "+label),
            boxContent=makeBox(into,text,bgcolor,fgcolor,font);
        boxLabel.style.cursor="pointer";
        boxLabel.style.userSelect="none";
        boxContent.style.display="none";
        boxContent.style.margin="2px 0px 2px 10px";
        boxLabel.onclick=()=>{
            if (boxContent.style.display)
                boxContent.style.display="";
            else
                boxContent.style.display="none";
        }
        return boxContent;
    }

    function makeCollapsableTextArea(into,label,text) {
        let
            boxLabel=makeBox(into,"> "+label),
            textArea=document.createElement("textarea");
        textArea.style.width="100%";
        textArea.style.display="none";
        textArea.innerHTML=text;
        textArea.rows=30;
        into.appendChild(textArea);
        boxLabel.style.cursor="pointer";
        boxLabel.style.userSelect="none";
        boxLabel.onclick=()=>{
            if (textArea.style.display)
                textArea.style.display="";
            else
                textArea.style.display="none";
        }
        return textArea;
    }

    function createOnClickLink(root,label,filename,event) {
        let
            box=makeBox(root,label+": "),
            a=document.createElement("a");
        a.innerHTML=filename;
        a.href="#";
        a.onclick=()=>{
            event();
            return false;
        }
        box.appendChild(a);
        return a;
    }

    function checkActionSymbols(text) {
        let invalidSymbols=[];
        text.replace(/\{([^}]*)\}/g,(s,s1)=>{
            if (SYMBOLS.default[s1] === undefined)
                invalidSymbols.push(s1);
        });
        return invalidSymbols.join(",");
    }

    this.solveActionSymbols=(text,profile)=>{
        return text.replace(/\{([^}]*)\}/g,(s,s1)=>{
            if (profile && SYMBOLS[profile] && (SYMBOLS[profile][s1] !== undefined))
                return SYMBOLS[profile][s1];
            else if (SYMBOLS.default[s1] !== undefined)
                return SYMBOLS.default[s1];
            else
                return SYMBOLS[profile] && SYMBOLS[profile]._unknown ?  SYMBOLS[profile]._unknown : SYMBOLS.default._unknown;
        });
    }

    this.createDownload=(root,filename,mimetype,content)=>{
        let
            a=document.createElement("a");
        a.innerHTML=filename;
        const blob = new Blob([content], {
            type: mimetype
        });
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = filename;
        root.appendChild(a);
        return a;
    }

    this.downloadFile=(file,cb,cbBusy)=>{
        if (fileCache[file])
            cb(fileCache[file]);
        else {
            const
                xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState == 4)
                    if ((xmlhttp.status == 200) || (xmlhttp.status == 0)) {
                        if (cbBusy) cbBusy(false);
                        fileCache[file]= xmlhttp.responseText;
                        cb(fileCache[file]);
                    }
                else cb();
            };
            if (cbBusy) cbBusy(true);
            xmlhttp.open("GET", file+"?"+Math.random(), true);
            xmlhttp.send();
        }
    }

    this.downloadImage=(file,cb)=>{
        let image=document.createElement("img");
        image.src = file;
        image.onload=()=>{
            let
                canvas = document.createElement("canvas"),
                canvasCtx = canvas.getContext("2d");
            canvas.width=image.width;
            canvas.height=image.height;
            canvasCtx.drawImage(image,0,0);
            document.body.removeChild(image);
            cb({
                node:image,
                canvas:canvas,
                canvasCtx:canvasCtx,
                canvasData:canvasCtx.getImageData(0,0,canvas.width,canvas.height)
            });
        }
        document.body.appendChild(image);
    }

    this.downloadDatabase=(cb,cbBusy)=>{
        this.downloadFile(ENV.databaseRoot+"index.json",(data)=>{
            let parsed;
            try {
                parsed=JSON.parse(data)
            } catch (e) {
                parsed=0;
            }
            cb(parsed);
        },cbBusy);
    }

    this.downloadDeck=(id,language,cb,cbBusy)=>{
        this.downloadDatabase((database)=>{
            let
                deckFound;
            database.index.forEach(item=>{
                if ((item.meta.id == id) && (item.meta.language == language))
                    deckFound=item;
            });
            if (deckFound)
                this.downloadFile(ENV.databaseRoot+deckFound.meta.id+"/"+deckFound.meta.id+"-"+deckFound.meta.language+"-"+deckFound.meta.version+".json",(data)=>{
                    let parsed;
                    try {
                        parsed=JSON.parse(data);
                    } catch(e) {
                        parsed=0;
                    }
                    cb(parsed);
                },cbBusy)
            else
                cb();
        },cbBusy)
    }

    this.dateToString=(date)=>{
        if (!date) date=new Date();
        
        let
            month = date.getMonth() + 1,
            day = date.getDate();
        return date.getFullYear() + (month < 10 ? "0" : "" ) + month + (day<10 ? "0" : "") + day;
    }

    this.mergeDecks=(decks,cards)=>{
        let
            authors=[],
            merged={
                filename:"",
                meta:{},
                deck:[]
            };
        decks.forEach(deck=>{
            for (let k in deck.meta)
                if (k == "author") {
                    if (authors.indexOf(deck.meta[k]) == -1)
                        authors.push(deck.meta[k]);
                } else if (!merged.meta[k])
                    merged.meta[k]=deck.meta[k];
                else
                    switch (k) {
                        case "version":
                        case "id":{
                            merged.meta[k]+="-"+deck.meta[k];
                            break;
                        }
                        case "type":{
                            if (merged[k]=="full")
                                merged.meta[k]=deck.meta[k];
                            break;
                        }
                        case "dateCreated":{
                            if (deck.meta[k]<merged.meta[k])
                                merged.meta[k]=deck.meta[k];
                            break;
                        }
                        case "dateUpdated":{
                            if (deck.meta[k]>merged.meta[k])
                                merged.meta[k]=deck.meta[k];
                            break;
                        }
                        case "name":{
                            merged.meta[k]+=" + "+deck.meta[k];
                            break;
                        }
                        case "description":{
                            merged.meta[k]+=" / "+deck.meta[k];
                            break;
                        }
                    };
            if (!cards || cards[deck.meta.id].length) {
                merged.filename+=deck.meta.id+"-"+deck.meta.language+"-"+deck.meta.version+"-";
                if (cards) {
                    if (cards[deck.meta.id])
                        cards[deck.meta.id].forEach(id=>{
                            merged.deck.push(deck.deck[id]);
                        })
                } else {
                    merged.deck=merged.deck.concat(deck.deck);
                }
            }
        });
        merged.filename=merged.filename.substr(0,merged.filename.length-1);
        merged.meta.cardsCount=merged.deck.length;
        merged.meta.author=authors.join(", ");
        if (decks.length>1)
            this.sortDeck(merged);
        return merged;
    }

    this.getSymbolColor=(symbol)=>{
        switch (symbol) {
            case "earth":{
                return "#009E73";
                break;
            }
            case "air":{
                return "#f0f0f0";
                break;
            }
            case "fire":{
                return "#D55E00";
                break;
            }
            case "water":{
                return "#0072B2";
                break;
            }
            default:{
                return "#cccccc";
                break;
            }
        }
    }

    this.symbolsToColorMap=(symbols)=>{
        let out={
            map:[],
            errors:[]
        };

        for (let ox=0;ox<ILLUSTRATION_SRC_WIDTH;ox++) {
            let row=[];
            out.map.push(row);
            for (let oy=0;oy<ILLUSTRATION_SRC_HEIGHT;oy++) {
                let
                    symbol=symbols[ox+(ILLUSTRATION_SRC_WIDTH*oy)],
                    color=this.PALETTEBYSYMBOL[symbol];
                
                if (color)
                    row.push(color);
                else {
                    row.push(PALETTE[0]);
                    out.errors.push("Symbol '"+symbol+"' not valid");
                }
            }
        }

        return out;
    }

    this.canvasDataToSymbols=(canvasData,dx,dy)=>{

        let out={
            text:"",
            errors:[]
        };

        if (
            (dx+ILLUSTRATION_SRC_WIDTH>canvasData.width) ||
            (dy+ILLUSTRATION_SRC_HEIGHT>canvasData.height)
        )
            out.errors.push("Illustration too small.")
        else {
            for (let ox=0;ox<ILLUSTRATION_SRC_WIDTH;ox++)
                for (let oy=0;oy<ILLUSTRATION_SRC_HEIGHT;oy++) {
                    let
                        error=false,
                        x=ox+dx,
                        y=oy+dy,
                        p=((y*canvasData.width)+x)*4;
                        colorId=canvasData.data[p]+","+canvasData.data[p+1]+","+canvasData.data[p+2]+","+canvasData.data[p+3],
                        color=PALETTEBYRGBA[colorId],
                        a=canvasData.data[p+3];
                    if (a == 255)
                        if (color)
                            out.text+=color.symbol;
                        else
                            error=true;
                    else if (a == 0)
                        out.text+="0";
                    else
                        error=true;
                    if (error) {
                        out.text="-";
                        out.errors.push("Color at ("+x+","+y+") not in palette ("+colorId+")");
                    }
                }
        }

        return out;
    }

    function solveIllustration(cardTools,canvasData,illustration) {
        if (illustration) {
            let conversion=cardTools.canvasDataToSymbols(canvasData,illustration.x*cardTools.ILLUSTRATION_SRC_WIDTH,illustration.y*cardTools.ILLUSTRATION_SRC_HEIGHT);
            if (conversion.errors.length) {
                conversion.errors.forEach(error=>{
                    console.error(error);
                })
                return 0;
            } else
                return conversion.text;
        }
    }

    function solveMacros(language,text) {
        if (text)
            text=text.replace(/\{([^}]*)\}/g,(s,s1)=>{
                let
                    parts=s1.split(".");
                switch (parts[0]) {
                    case "CONFIG":{
                        return CONFIG.languagesById[language].dictionary[parts[1]] || CONFIG[parts[1]];
                        break;
                    }
                }
                return "{"+s1+"}";
            });
        return text;
    }

    this.generateDeckFromRaw=(cardTools,rawUnits,rawPlaces,rawEvents,rawText,cards,illustrationData,illustrationIndex)=>{

        let
            placeId=0,
            placeBodyId=-1;

        if (rawUnits && rawUnits.length) {
            let
                placeId=0,
                placeBodyId=-1;

            rawUnits.forEach(set=>{
                set.bodies.forEach((units,level)=>{
                    units.forEach((unit=>{
                        set.boosts[level].forEach(boost=>{

                            let
                                topSide={
                                    type: "unit",
                                    version: unit.version || boost.version || cards.meta.version,
                                    level: unit.level === undefined ? boost.level === undefined ? (level+1) : boost.level : unit.level,
                                    name: unit.name || boost.name,
                                    illustration: solveIllustration(cardTools,illustrationData,illustrationIndex[unit.illustration || boost.illustration]),

                                    area: unit.area,
                                    condition: unit.condition,
                                    trigger: unit.trigger,
                                    description: solveMacros(cards.meta.language,unit.description),
                                    attack: unit.attack,
                                    life: unit.life,
                                    symbol: unit.symbol,
                                    symbolAmount: unit.symbolAmount || ( unit.symbol ? 1 : 0),

                                    boostArea: boost.area,
                                    boostCondition: boost.condition,
                                    boostTrigger: boost.trigger,
                                    boostDescription: solveMacros(cards.meta.language,boost.description),
                                    boostAttack: boost.attack,
                                    boostLife: boost.life,
                                    boostSymbol: boost.symbol,
                                    boostSymbolAmount: boost.symbolAmount || ( boost.symbol ? 1 : 0)
                                };

                            if (topSide.boostAttack && topSide.attack) {
                                topSide.attack -= topSide.boostAttack;
                                if (topSide.attack <= 0)
                                    delete topSide.attack;
                            }

                            if (topSide.boostLife && topSide.life) {
                                topSide.life -= topSide.boostLife;
                                if (topSide.life <= 0)
                                    delete topSide.life;
                            }

                            if ((topSide.symbol == topSide.boostSymbol) && !boost.doNotMerge) {
                                topSide.symbolAmount -= topSide.boostSymbolAmount;
                                if (topSide.symbolAmount <= 0) {
                                    delete topSide.symbolAmount;
                                    delete topSide.symbol;
                                }
                            }

                            placeBodyId++;
                            if (!rawPlaces[placeId].bodies[placeBodyId]) {
                                placeId=(placeId+1)%rawPlaces.length;
                                placeBodyId=0;
                            };

                            let
                                place=rawPlaces[placeId],
                                placeBoost=place.boosts[placeBodyId % place.boosts.length],
                                placeBody=place.bodies[placeBodyId],
                                bottomSide={
                                    type:"place",
                                    version: placeBody.version || cards.meta.version,
                                    level: placeBoost.level === undefined ? placeBody.level : placeBoost.level,
                                    name: placeBody.name,
                                    description: solveMacros(cards.meta.language,placeBody.description || placeBoost.description),
                                    boostTrigger: placeBoost.trigger,
                                    boostDescription: solveMacros(cards.meta.language,placeBoost.description),
                                    boostSymbol: placeBoost.symbol,
                                    boostSymbolAmount: placeBoost.symbolAmount || ( placeBoost.symbol ? 1 : 0)
                                };

                            cards.deck.push([
                                topSide,
                                bottomSide
                            ]);

                        });
                    }))
                });
            });
        }
        
        if (rawEvents && rawEvents.length) {
            rawEvents.forEach(event=>{
                let sides=[];
                event.forEach(side=>{
                    sides.push({
                        type: "event",
                        version: side.version || cards.meta.version,
                        level: side.level,
                        name: side.name,
                        description: solveMacros(cards.meta.language,side.description),
                        flavorText: side.flavorText,
                        attack: side.attack,
                        life: side.life,
                        boostCondition: side.boostCondition,
                        boostTrigger: side.boostTrigger,
                        boostDescription: solveMacros(cards.meta.language,side.boostDescription),
                        boostAttack: side.boostAttack,
                        boostLife: side.boostLife,
                        boostSymbol: side.boostSymbol,
                        boostSymbolAmount: side.boostSymbolAmount,
                        illustration: solveIllustration(cardTools,illustrationData,illustrationIndex[side.illustration])
                    })
                })
                cards.deck.push(sides)
            })
        }

        if (rawText && rawText.length)
            rawText.forEach(side=>{
                cards.deck.push([{
                    version: side.version || cards.meta.version,
                    type: "text",
                    title: side.title,
                    text:side.text.map(line=>solveMacros(cards.meta.language,line))
                }]);
            });

        return {
            placeId:placeId,
            placeBodyId:placeBodyId
        }

    }

    function asJsonString(value) {
        return "\""+value.replace(/"/g,"\\\"")+"\"";
    }

    function asJsonArrayString(arr) {
        let
            out="[ ";
        arr.forEach(element=>{
            out+=asJsonString(element)+", ";
        })
        out=out.substr(0,out.length-2)+" ]";
        return out;
    }

    function asJsonInt(value) {
        return parseInt(value);
    }

    function asJsonBool(value) {
        return !value?"false":"true";
    }

    function checkIllustrationValidity(illustration) {
        for (let i=0;i<illustration.length;i++)
            if (!PALETTEBYSYMBOL[illustration[i]])
                return false;
        return true;
    }

    function checkDate(date) {
        if (date.length == 8) {
            let
                year=parseInt(date.substr(0,4)),
                month=parseInt(date.substr(4,2)),
                day=parseInt(date.substr(6,2));
            if (
                (year<2023) ||
                (month<1) || (month>12) ||
                (day<1) || (day>31)
            )
                return false;
            else
                return true;
        } else
            return true;
    }

    this.sortDeck=(cards)=>{
        if (cards.deck)
            cards.deck.sort((a,b)=>{
                if (CARDTYPES.indexOf(a[0].type) > CARDTYPES.indexOf(b[0].type)) return 1;
                else if (CARDTYPES.indexOf(a[0].type) < CARDTYPES.indexOf(b[0].type)) return -1;
                else if (a[0].name < b[0].name) return -1;
                else if (a[0].name > b[0].name) return 1;
                else return 0;
            });
        return cards;
    }

    this.cardsToJson=(cards)=>{
        let
            illustrationSize=ILLUSTRATION_SRC_HEIGHT*ILLUSTRATION_SRC_WIDTH,
            ids={},
            tab="\t",
            json="{\n",
            metaRowPrefix=tab+tab,
            rowPrefix=tab+tab+tab+tab,
            errors=[];

        json+=tab+"\"meta\":{\n";
        if (cards.meta) {

            if (cards.meta.id)
                if (cards.meta.id.length>10)
                    errors.push("Deck ID '"+cards.meta.id+"' too long (10 chars max)");
                else if (cards.meta.id.match(/[^A-Z0-9]/))
                    errors.push("Invalid chars in deck ID '"+cards.meta.id+"' (A-Z,0-9 only)");
                else
                    json+=metaRowPrefix+"\"id\": "+asJsonString(cards.meta.id)+",\n";
            else
                errors.push("Missing deck ID in metadata");


            if (cards.meta.language)
                if (!CONFIG.languagesById[cards.meta.language])
                    errors.push("Deck language '"+cards.meta.language+"' too valid ("+CONFIG.languagesSupported+" only)");
                else
                    json+=metaRowPrefix+"\"language\": "+asJsonString(cards.meta.language)+",\n";
            else
                errors.push("Missing deck language in metadata");


            if (cards.meta.version)
                json+=metaRowPrefix+"\"version\": "+asJsonString(cards.meta.version)+",\n";
            else
                errors.push("Missing deck version in metadata");

            if (cards.meta.type)
                if (DECKTYPES.indexOf(cards.meta.type) == -1)
                    errors.push("Invalid deck type '"+cards.meta.type+"'");
                else
                    json+=metaRowPrefix+"\"type\": "+asJsonString(cards.meta.type)+",\n";
            else
                errors.push("Missing deck type");

            json+=metaRowPrefix+"\"cardsCount\": "+asJsonInt(cards.deck.length)+",\n";

            if (cards.meta.dateCreated)
                if (!checkDate(cards.meta.dateCreated))
                    errors.push("Invalid created added '"+cards.meta.dateCreated+"' (not YYYYMMDD)");
                else
                    json+=metaRowPrefix+"\"dateCreated\": "+asJsonString(cards.meta.dateCreated)+",\n";
            else
                errors.push("Missing date created in metadata");

            if (cards.meta.dateUpdated)
                if (!checkDate(cards.meta.dateUpdated))
                    errors.push("Invalid date updated '"+cards.meta.dateUpdated+"' (not YYYYMMDD)");
                else if (cards.meta.dateUpdated<cards.meta.dateCreated)
                    errors.push("Date updated is before date created");
                else
                    json+=metaRowPrefix+"\"dateUpdated\": "+asJsonString(cards.meta.dateUpdated)+",\n";
            else
                errors.push("Missing date updated in metadata");

            if (cards.meta.name)
                json+=metaRowPrefix+"\"name\": "+asJsonString(cards.meta.name)+",\n";
            else
                errors.push("Missing deck name in metadata");

            if (cards.meta.description)
                json+=metaRowPrefix+"\"description\": "+asJsonString(cards.meta.description)+",\n";
            else
                errors.push("Missing deck description in metadata");

            if (cards.meta.flavorText)
                json+=metaRowPrefix+"\"flavorText\": "+asJsonString(cards.meta.flavorText)+",\n";
            else
                errors.push("Missing deck flavor text in metadata");

            if (cards.meta.author)
                json+=metaRowPrefix+"\"author\": "+asJsonString(cards.meta.author)+",\n";
            else
                errors.push("Missing deck author in metadata");

            if (cards.meta.authorLink)
                json+=metaRowPrefix+"\"authorLink\": "+asJsonString(cards.meta.authorLink)+",\n";

        } else
            errors.push("Missing metadata");

        json=json.substr(0,json.length-2)+"\n"+tab+"},\n";

        json+=tab+"\"deck\":[\n";
        cards.deck.forEach((card,cid)=>{
            let
                layout="",
                cardType=card[0].type,
                cardNumber=cid+1;
            
            if (!ids[cardType])
                ids[cardType]=0;
            ids[cardType]++;

            card.forEach((card)=>{
                layout+=card.type+",";
            })
            layout=layout.substr(0,layout.length-1);

            json+=tab+tab+"[\n";
            if (
                !(
                    ((card.length==1) &&(cardType=="text")) ||
                    ((card.length==2) && (cardType=="unit") && (card[1].type=="place")) ||
                    ((card.length==2) &&(cardType=="event") && (card[1].type=="event"))
                )
            )
                errors.push("Invalid card layout: '"+layout+"'");
            else
                card.forEach((side,sid)=>{
                    let
                        isText=side.type=="text",
                        isPlace=side.type=="place",
                        isUnit=side.type=="unit",
                        isEvent=side.type=="event",
                        logline="Card "+cardNumber+" side "+cardNumber+" ("+(side.name || "No name")+" - "+(side.type || "No type")+"): ";
                    json+=tab+tab+tab+"{\n";
                    
                    /* Side version */
                    if (side.version) {
                        json+=rowPrefix+"\"version\": "+asJsonString(side.version)+",\n";
                    } else
                        errors.push(logline+"Missing side version");

                    if (side.id)
                        json+=rowPrefix+"\"id\": "+asJsonString(side.id)+",\n";
                    else
                        json+=rowPrefix+"\"id\": "+asJsonString(cards.meta.id+"-"+cards.meta.language+"-"+CARDTYPEID[cardType]+ids[cardType]+"-"+side.version)+",\n";
                    
                    /* Side type */
                    switch (side.type) {
                        case "text":
                        case "event":
                        case "place":
                        case "unit":{
                            json+=rowPrefix+"\"type\": "+asJsonString(side.type)+",\n";
                            break;
                        }
                        default:{
                            errors.push(logline+"Invalid side type '"+side.type+"'");
                        }
                    }

                    if (isText) {

                        if (side.title)
                            json+=rowPrefix+"\"title\": "+asJsonString(side.title)+",\n";
                        else
                            errors.push(logline+"Missing title");
                        if (side.text) {
                            let check = "";
                            side.text.forEach(line=>{
                                let subcheck=checkActionSymbols(line);
                                if (subcheck)
                                    check=(check ? check+"," : "")+subcheck;
                            });
                            if (check)
                                errors.push(logline+"Invalid symbols in card text ("+check+")");
                            else 
                                json+=rowPrefix+"\"text\": "+asJsonArrayString(side.text)+",\n";
                        } else
                            errors.push(logline+"Missing text");

                    } else {

                        /* Side level */
                        if (side.level !== undefined)
                            if ((side.level<-3) || (side.level>3))
                                errors.push(logline+"Invalid side level ("+side.level+")");
                            else
                                json+=rowPrefix+"\"level\": "+asJsonInt(side.level)+",\n";
                        else
                            errors.push(logline+"Missing side level");

                        /* Side name */
                        if (side.name)
                            json+=rowPrefix+"\"name\": "+asJsonString(side.name)+",\n";
                        else
                            errors.push(logline+"Missing side name");

                        /* Side Skill */
                        if (side.symbol) {
                            if (ELEMENTS.indexOf(side.symbol) == -1)
                                errors.push(logline+"Invalid symbol '"+side.symbol+"'");
                            else if (!side.symbolAmount || (side.symbolAmount<1) || (side.symbolAmount>2 ))
                                errors.push(logline+"Invalid symbol amount '"+side.symbolAmount+"'");
                            else {
                                json+=rowPrefix+"\"symbol\": "+asJsonString(side.symbol)+",\n";
                                json+=rowPrefix+"\"symbolAmount\": "+asJsonInt(side.symbolAmount)+",\n";
                            }
                        } else if (side.symbolAmount)
                            errors.push(logline+"Symbol amount '"+side.boostSymbolAmount+"' specified but missing symbol type");
                        if (side.trigger) {
                            if (isEvent)
                                errors.push(logline+"Events can't have a trigger");
                            else if (TRIGGERS.indexOf(side.trigger) == -1)
                                errors.push(logline+"Invalid trigger '"+side.trigger+"'");
                            else
                                json+=rowPrefix+"\"trigger\": "+asJsonString(side.trigger)+",\n";
                        } else if (isUnit && (side.condition || side.description))
                            errors.push(logline+"Missing trigger type");
                        if (side.area)
                            json+=rowPrefix+"\"area\": "+asJsonBool(side.area)+",\n";
                        if (side.condition)
                            if (isPlace)
                                errors.push(logline+"Places can't have conditions");
                            else {
                                let check = checkActionSymbols(side.condition);
                                if (check)
                                    errors.push(logline+"Invalid symbols in condition ("+check+")");
                                else 
                                    json+=rowPrefix+"\"condition\": "+asJsonString(side.condition)+",\n";
                            }
                        if (side.description) {
                            let check = checkActionSymbols(side.description);
                            if (check)
                                errors.push(logline+"Invalid symbols in description ("+check+")");
                            else
                                json+=rowPrefix+"\"description\": "+asJsonString(side.description)+",\n";
                        }
                        if (side.flavorText)
                            if (isUnit || isPlace)
                                errors.push(logline+"Flavor Text is for events only");
                            else
                                json+=rowPrefix+"\"flavorText\": "+asJsonString(side.flavorText)+",\n";
                        if (side.attack !== undefined)
                            if (isPlace)
                                errors.push(logline+"Places doesn't have attack");
                            else if ((side.attack<-3) || (side.attack>3))
                                errors.push(logline+"Invalid attack '"+side.attack+"'");
                            else
                                json+=rowPrefix+"\"attack\": "+asJsonInt(side.attack)+",\n";
                        if (side.life !== undefined)
                            if (isPlace)
                                errors.push(logline+"Places doesn't have life");
                            else if ((side.life<-3) || (side.life>3))
                                errors.push(logline+"Invalid life '"+side.life+"'");
                            else
                                json+=rowPrefix+"\"life\": "+asJsonInt(side.life)+",\n";

                        /* Boost */
                        if (side.boostSymbol) {
                            if (ELEMENTS.indexOf(side.boostSymbol) == -1)
                                errors.push(logline+"Invalid boost symbol '"+side.boostSymbol+"'");
                            else if (!side.boostSymbolAmount || (side.boostSymbolAmount<1) || (side.boostSymbolAmount>2 ))
                                errors.push(logline+"Invalid boost symbol amount '"+side.boostSymbolAmount+"'");
                            else {
                                json+=rowPrefix+"\"boostSymbol\": "+asJsonString(side.boostSymbol)+",\n";
                                json+=rowPrefix+"\"boostSymbolAmount\": "+asJsonInt(side.boostSymbolAmount)+",\n";
                            }
                        } else if (side.boostSymbolAmount)
                            errors.push(logline+"Symbol amount '"+side.boostSymbolAmount+"' specified but missing symbol type");
                        if (side.boostTrigger) {
                            if (TRIGGERS.indexOf(side.boostTrigger) == -1)
                                errors.push(logline+"Invalid boost trigger '"+side.boostTrigger+"'");
                            else
                                json+=rowPrefix+"\"boostTrigger\": "+asJsonString(side.boostTrigger)+",\n";
                        } else if (isUnit && (side.boostCondition || side.boostDescription))
                            errors.push(logline+"Missing boost trigger type");
                        if (side.boostArea)
                            errors.push(logline+"Boosts can't have area effects");
                        if (side.boostCondition)
                            if (isPlace)
                                errors.push(logline+"Places can't have boost conditions");
                            else {
                                let check = checkActionSymbols(side.boostCondition);
                                if (check)
                                    errors.push(logline+"Invalid symbols in boost condition ("+check+")");
                                else 
                                json+=rowPrefix+"\"boostCondition\": "+asJsonString(side.boostCondition)+",\n";
                            }
                        if (side.boostDescription) {
                            let check = checkActionSymbols(side.boostDescription);
                            if (check)
                                errors.push(logline+"Invalid symbols in boost description ("+check+")");
                            else
                                json+=rowPrefix+"\"boostDescription\": "+asJsonString(side.boostDescription)+",\n";
                        }
                        if (side.boostAttack !== undefined)
                            if (isPlace)
                                errors.push(logline+"Places doesn't have boost attack");
                            else if ((side.boostAttack<-3) || (side.boostAttack>3))
                                errors.push(logline+"Invalid boost attack '"+side.boostAttack+"'");
                            else
                                json+=rowPrefix+"\"boostAttack\": "+asJsonInt(side.boostAttack)+",\n";
                        if (side.boostLife !== undefined)
                            if (isPlace)
                                errors.push(logline+"Places doesn't have boost life");
                            else if ((side.boostLife<-3) || (side.boostLife>3))
                                errors.push(logline+"Invalid boost life '"+side.boostLife+"'");
                            else
                                json+=rowPrefix+"\"boostLife\": "+asJsonInt(side.boostLife)+",\n";

                        /* Illustrations */
                        if (side.illustration) {
                            if (isPlace)
                                errors.push(logline+"Illustration not needed in places");
                            else if (side.illustration.length != illustrationSize)
                                errors.push(logline+"Invalid illustration size ("+side.illustration.length+", should be "+illustrationSize+")");
                            else if (!checkIllustrationValidity(side.illustration))
                                errors.push(logline+"Invalid illustration content");
                            else
                                json+=rowPrefix+"\"illustration\": "+asJsonString(side.illustration)+",\n";
                        } else if (!isPlace)
                            errors.push(logline+"Missing illustration");

                    }

                    json=json.substr(0,json.length-2)+"\n"+tab+tab+tab+"}";
                    if (card[sid+1])
                        json+=",";
                    json+="\n";

                });
            json+=tab+tab+"]";
            if (cards.deck[cid+1])
                json+=",";
            json+="\n";
        });
        json+=tab+"]\n}";

        return {
            json:json,
            errors:errors
        };
    }

    this.showPrintPreview=(root,cards,profileid)=>{
        const template=new SVGTemplate(ENV.templatesRoot+"model.svg",true);
        template.load(()=>{
            let
                deckPainter=new DeckPainter(this,template),
                profile=deckPainter.PROFILESBYID[profileid || "DEF"];
            deckPainter.paintCards(profile,cards);
            deckPainter.renderPrintPreview(root);
        });
    }

    this.showDevKit=(root,cards)=>{

        let
            deckId;

        if (cards && cards.meta && cards.meta.id )
            deckId=cards.meta.id;
        else
            deckId="(Missing deck ID)";

        document.title=deckId+" - DevKit";

        const template=new SVGTemplate(ENV.templatesRoot+"model.svg",true);
        template.load(()=>{
            let
                kitRoot=document.createElement("div"),
                deckPainter=new DeckPainter(this,template),
                parsed=this.cardsToJson(cards);
            root.appendChild(kitRoot);
            if (parsed.errors.length)
                makeBox(kitRoot,parsed.errors.join("\n"),"#f00","#fff","monospace");
            else {
                let
                    header="",
                    newCards=JSON.parse(parsed.json),
                    isFull=newCards.meta.type == "full",
                    filename=newCards.meta.id+"-"+newCards.meta.language+"-"+newCards.meta.version;
                for (let k in newCards.meta)
                    header+=k+": "+newCards.meta[k]+"\n";
                makeBox(kitRoot,"No errors found.");
                makeBox(kitRoot,header,"#ccc","#000","monospace");
                let
                    downloadBox=makeBox(root,"Download clean JSON: ");
                this.createDownload(downloadBox,filename+".json","application/json",parsed.json);
                makeCollapsableTextArea(kitRoot,"Show/hide cards plain text",deckPainter.plainTextCards(newCards));
                let
                    printRoot=document.createElement("div"),
                    printList=document.createElement("select"),
                    printProfile=makeBox(kitRoot,"Select print style: "),
                    noSelection=document.createElement("option");
                
                noSelection.innerHTML="(Select a print style)";
                printList.appendChild(noSelection);
                kitRoot.appendChild(printRoot);

                deckPainter.PROFILES.forEach(profile=>{
                    let option=document.createElement("option");
                    option.innerHTML=profile.name+" - "+profile.shortDescription;
                    option.value=profile.id;
                    printList.appendChild(option);
                });
                printProfile.appendChild(printList);
                printProfile.onchange=()=>{
                    let
                        profile=deckPainter.PROFILESBYID[printList.value];
                    
                    printRoot.innerHTML="";
                    
                    if (profile) {
                        let
                            pdfFilename=filename+"-"+profile.id+".pdf";

                        deckPainter.paintCards(profile,newCards);
                        let
                            preview=makeCollapsableBox(printRoot,"Show/hide print preview ("+deckPainter.pages.length+" page(s))","");
                        createOnClickLink(printRoot,"Test",(isFull ? "Open full deck in virtual table" : "Open expansion set in virtual table with a lite core set")+" (ESC to quit)",()=>{
                            root.removeChild(kitRoot);
                            if (isFull) {
                                let testarea=new TestArea(ENV,newCards,profile.id,()=>{
                                    root.appendChild(kitRoot);
                                });
                                testarea.run(root);
                            } else {
                                this.downloadDeck(CONFIG.liteCoreDeckId,newCards.meta.language,(coreDeck)=>{
                                    let testarea=new TestArea(ENV,this.mergeDecks([coreDeck,newCards]),profile.id,()=>{
                                        root.appendChild(kitRoot);
                                    });
                                    testarea.run(root);
                                })
                            }
                        });
                        preview.style.backgroundColor="#ccc";
                        deckPainter.renderPrintPreview(preview);
                        preview.style.maxHeight="";
                        createOnClickLink(printRoot,"Download PDF",pdfFilename,()=>{
                            deckPainter.downloadPdfAs(pdfFilename);
                        });
                        deckPainter.pages.forEach((page,id)=>{
                            let
                                pageId=id+1,
                                svgFilename=filename+"-"+profile.id+"-pg"+pageId+".svg";
                            createOnClickLink(printRoot,"Download SVG page "+(pageId),svgFilename,()=>{
                                deckPainter.downloadPageSvgAs(svgFilename,id);
                            });
                        });
                    }
                }
            }
            makeCollapsableTextArea(kitRoot,"Show/hide original JSON",JSON.stringify(cards,null,"\t"),0,0,"monospace");
        });
    }

    this.showImageTextTool=(root)=>{
        let
            palette="",
            infoBox=document.createElement("div"),
            toolRoot=document.createElement("div"),
            selectorRoot=document.createElement("div");

        PALETTE.forEach(color=>{
            palette+="<div style='border:1px solid #000;padding:5px;background-color:rgba("+color.version.normal.r+','+color.version.normal.g+','+color.version.normal.b+','+color.version.normal.a+")'>"+
                (
                    color.version.normal.a == 0 ?
                        "(Full transparency)"
                    :
                        "R:"+color.version.normal.r+" "+
                        "G:"+color.version.normal.g+" "+
                        "B:"+color.version.normal.b+" "+
                        "A:"+color.version.normal.a+" - "+
                        rgbToHex(color.version.normal)
                )+
                "</div>";
        })

        toolRoot.appendChild(selectorRoot);
        infoBox.innerHTML="<p>Drop an image with a grid of "+ILLUSTRATION_SRC_WIDTH+"&times;"+ILLUSTRATION_SRC_HEIGHT+" illustrations here to get the single illustration text to be pasted in your card set JSON file. Make sure you're using the <a target='_blank' href='"+CONFIG.paletteUrl+"'>"+CONFIG.paletteName+"</a> color palette:</p>"+palette;
        toolRoot.appendChild(infoBox);

        root.appendChild(toolRoot);

        window.addEventListener("drop",(e)=>{
            let file=e.dataTransfer.files[0];
            selectorRoot.innerHTML="";
            if (file) {

                var reader = new FileReader();
                reader.readAsDataURL(file);
                
                reader.onload = ()=>{
                    let
                        selector=document.createElement("div"),
                        result=document.createElement("div");
                    makeBox(selectorRoot,"Select an illustration to convert to text.");
                    selectorRoot.appendChild(result);
                    selector.style="position:relative";
                    selectorRoot.appendChild(selector);
                    this.downloadImage(reader.result,(image)=>{
                        image.node.style = "box-shadow:0px 0px 5px #ccc;margin:20px";
                        selector.appendChild(image.node);
                        let
                            selected=document.createElement("div");
                        selected.style="background-color:#f00;position:absolute;opacity:0.5";
                        image.node.onclick=(e)=>{
                            let
                                ox=Math.floor(e.offsetX/ILLUSTRATION_SRC_WIDTH)*ILLUSTRATION_SRC_WIDTH,
                                oy=Math.floor(e.offsetY/ILLUSTRATION_SRC_HEIGHT)*ILLUSTRATION_SRC_HEIGHT,
                                converted=this.canvasDataToSymbols(image.canvasData,ox,oy);
                            if (!selected.parentNode)
                                selector.appendChild(selected);
                            selected.style.left=(ox+20)+"px";
                            selected.style.top=(oy+20)+"px";
                            selected.style.width=ILLUSTRATION_SRC_WIDTH+"px";
                            selected.style.height=ILLUSTRATION_SRC_HEIGHT+"px";
                            if (converted.errors.length)
                                result.innerHTML="<p>Error converting the selected illustration to text:</p><ul><li>"+converted.errors.join("</li><li>")+"</li></ul>";
                            else
                                result.innerHTML="Selected illustration text: <input onclick='this.select()' type='text' value='"+converted.text+"'>";
                        }
                    });
                    return false;     
                };
               
            };

            e.preventDefault();
        });
        window.addEventListener("dragover",(e)=>{
            e.preventDefault();
        });
    }

}