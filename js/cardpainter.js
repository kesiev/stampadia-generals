function CardPainter(cardTools,template) {

    const
        CARDNUMBERBORDER=4,
        CARDNUMBERSIZE=1.5,
        CARDNUMBERSPACING=0.3;

    let
        boostTextSettings={
            modelId:"heroCardText",
            wordSpacing:WORDSPACING,
            lineSpacing:LINESPACING,
            textGap:TEXTGAP,
            verticalAlignment:"center",
            horizontalAlignment:"left"
        },
        symbolTextSettings={
            modelId:"heroCardLargeText",
            wordSpacing:WORDSPACING,
            lineSpacing:LINESPACING,
            textGap:TEXTGAP,
            verticalAlignment:"center",
            horizontalAlignment:"center"
        },
        elementTextSettings={
            modelId:"heroCardText",
            wordSpacing:WORDSPACING,
            lineSpacing:LINESPACING,
            textGap:TEXTGAP,
            verticalAlignment:"center",
            horizontalAlignment:"center"
        },
        descriptionTextSettings={
            modelId:"heroCardText",
            wordSpacing:WORDSPACING,
            lineSpacing:LINESPACING,
            textGap:TEXTGAP,
            verticalAlignment:"top",
            horizontalAlignment:"left"
        },
        nameTextSettings={
            modelId:"cardTitle",
            wordSpacing:WORDSPACING,
            lineSpacing:LINESPACING,
            textGap:TEXTGAP,
            verticalAlignment:"center",
            horizontalAlignment:"left"
        },
        levelTextSettings={
            modelId:"heroCardText",
            wordSpacing:WORDSPACING,
            lineSpacing:LINESPACING,
            textGap:LARGETEXTGAP,
            verticalAlignment:"center",
            horizontalAlignment:"center"
        },
        titleTextSettings={
            modelId:"cardTitle",
            wordSpacing:WORDSPACING,
            lineSpacing:LINESPACING,
            textGap:TEXTGAP,
            verticalAlignment:"center",
            horizontalAlignment:"center"
        },
        contentTextSettings={
            modelId:"heroCardText",
            wordSpacing:WORDSPACING,
            lineSpacing:LINESPACING,
            textGap:TEXTGAP,
            verticalAlignment:"top",
            horizontalAlignment:"left"
        };

    let
        draftCanvas=document.createElement("canvas"),
        draftCanvasCtx,draftCanvasData;

    draftCanvas.width=cardTools.ILLUSTRATION_SRC_WIDTH*cardTools.ILLUSTRATION_SCALE;
    draftCanvas.height=cardTools.ILLUSTRATION_SRC_HEIGHT*cardTools.ILLUSTRATION_SCALE;
    draftCanvasCtx=draftCanvas.getContext("2d");
    draftCanvasData=draftCanvasCtx.getImageData(0,0,draftCanvas.width,draftCanvas.height);

    function round(val,dec) {
        return Math.floor(val*dec)/dec;
    }
    
    function putPixelColor(dst,x,y,color) {
        let
            p=((y*dst.width)+x)*4;
        dst.data[p]=color.r;
        dst.data[p+1]=color.g;
        dst.data[p+2]=color.b;
        dst.data[p+3]=color.a;
    }

    function getIllustration(profile,illustration) {
        
        let
            colorMap=cardTools.symbolsToColorMap(illustration);

        if (colorMap.errors.length)
            console.log(colorMap.errors);
        
        for (let oy=0;oy<colorMap.map.length;oy++)
            for (let ox=0;ox<colorMap.map[oy].length;ox++) {
                let
                    odx=ox*cardTools.ILLUSTRATION_SCALE,
                    ody=oy*cardTools.ILLUSTRATION_SCALE,
                    color=colorMap.map[oy][ox].version[profile.colorProfile];
                for (let dx=0;dx<cardTools.ILLUSTRATION_SCALE;dx++)
                    for (let dy=0;dy<cardTools.ILLUSTRATION_SCALE;dy++)
                        putPixelColor(draftCanvasData,odx+dx,ody+dy,color);
            }

        draftCanvasCtx.putImageData(draftCanvasData,0,0);

        return draftCanvas.toDataURL();
    }

    function drawIllustration(profile,cardPrinter,illustration,intoId) {
        
        let
            colorMap=cardTools.symbolsToColorMap(illustration);
            placeholder=cardPrinter.getPlaceholder(intoId),
            pixelWidth=round(placeholder.width/cardTools.ILLUSTRATION_SRC_WIDTH,100),
            pixelHeight=round(placeholder.height/cardTools.ILLUSTRATION_SRC_HEIGHT,100);
        
        for (let oy=0;oy<colorMap.map.length;oy++)
            for (let ox=0;ox<colorMap.map[oy].length;ox++) {
                let
                    color=colorMap.map[oy][ox].version[profile.colorProfile];
                if (color.a)
                    cardPrinter.addRect({
                        x:placeholder.x+(ox*pixelWidth),
                        y:placeholder.y+(oy*pixelHeight),
                        width:pixelWidth,
                        height:pixelHeight
                    },"rgba("+color.r+","+color.g+","+color.b+","+color.a+")");
            }

    }

    function colorizeHeader(profile,cardPrinter,isEvent,element,full,side,shades) {
        let color=cardTools.getSymbolColor(element);
        if (color)
            switch (profile.headerMode) {
                case 0:{
                    cardPrinter.delete([ side ]);
                    cardPrinter.delete(shades);
                    break;
                }
                case 1:{
                    if (full) {
                        cardPrinter.setBackgroundColor(full,color);
                        cardPrinter.delete([ side ]);
                        cardPrinter.delete(shades);
                    } else
                        cardPrinter.setBackgroundColor(side,color);                    
                    break;
                }
                case 2:{
                    if (isEvent) {
                        cardPrinter.delete([ side ]);
                        cardPrinter.delete(shades);
                    } else
                        cardPrinter.setBackgroundColor(side,color);
                    break;
                }
            }
        else {
            debugger;
            cardPrinter.delete([ side ]);
            cardPrinter.delete(shades);
        }
    }

    function getTriggerIconName(trigger,grayed) {
        if (trigger) {
            let out="";
            switch (trigger) {
                case "onDefend":{
                    out="largeSymbolShield";
                    break;
                }
                case "onAttack":{
                    out="largeSymbolSword";
                    break;
                }
                case "onDefeat":{
                    out="largeSymbolSkull";
                    break;
                }
                case "onLife":{
                    out="largeSymbolHeart";
                    break;
                }
                case "onFront":{
                    out="largeSymbolFront";
                    break;
                }
                default:{
                    out="largeSymbolGenerical";
                }
            }
            if (out && grayed)
                out+="Grayed";
            return out;
        } else return "";
    }

    function getSymbol(profile,symbol,amount) {
        let out="{symbol symbolLarge";
        switch (symbol) {
            case "earth":{
                out+="Earth";
                break;
            }
            case "air":{
                out+="Air";
                break;
            }
            case "fire":{
                out+="Fire";
                break;
            }
            case "water":{
                out+="Water";
                break;
            }
            default:{
                debugger
            }
        }
        if (amount>1)
            out+=amount;
        switch (profile.elementsMode) {
            case 2:
            case 3:{
                out+="Color";
                break;
            }
        }
        out+="}";
        return out;
    }

    function labelToSymbol(profile,label) {
        let out="{symbol symbol"
        switch (label) {
            case "earth":{
                out+="Earth";
                break;
            }
            case "water":{
                out+="Water";
                break;
            }
            case "air":{
                out+="Air";
                break;
            }
            case "fire":{
                out+="Fire";
                break;
            }
        }
        out+="Small";
        switch (profile.elementsMode) {
            case 2:
            case 3:{
                out+="Color";
                break;
            }
        }
        out+="}";
        return out;
    }
  
    function getActionText(profile,condition,action) {
        let line="";
        if (condition)
            line=condition+": ";
        if (action)
            line+=action;
        return cardTools.solveActionSymbols(line,profile.iconsProfile);
    }

    function solveActionSymbolsPlainText(text) {
        return cardTools.solveActionSymbols(text,"plainText").replace(/ [ +]/g," ").replace(/ ([,.:])/g,"$1").replace(/\] ([,.:])/g,"]$1").replace(/\n /g,"\n").trim();
    }

    function renderUnit(profile,svg,side,isEvent,x,y,card) {
        let 
            cardPrinter=new CardPrinter(svg,"unitCardContainer",x,y);

        switch (profile.elementsMode) {
            case 1:{
                cardPrinter.setBackgroundColor("symbolFireSmallShape",cardTools.getSymbolColor("fire"),svg.node);
                cardPrinter.setBackgroundColor("symbolAirSmallShape",cardTools.getSymbolColor("air"),svg.node);
                cardPrinter.setBackgroundColor("symbolEarthSmallShape",cardTools.getSymbolColor("earth"),svg.node);
                cardPrinter.setBackgroundColor("symbolWaterSmallShape",cardTools.getSymbolColor("water"),svg.node);

                cardPrinter.setBackgroundColor("symbolFireSmallBackground","#000",svg.node);
                cardPrinter.setBackgroundColor("symbolAirSmallBackground","#000",svg.node);
                cardPrinter.setBackgroundColor("symbolEarthSmallBackground","#000",svg.node);
                cardPrinter.setBackgroundColor("symbolWaterSmallBackground","#000",svg.node);
                break;
            }
            case 2:{
                cardPrinter.setBackgroundColor("symbolLargeEarthColorBall",cardTools.getSymbolColor("earth"),svg.node);
                cardPrinter.setBackgroundColor("symbolLargeEarth2ColorBall",cardTools.getSymbolColor("earth"),svg.node);
                cardPrinter.setBackgroundColor("symbolEarthSmallColorBall",cardTools.getSymbolColor("earth"),svg.node);

                cardPrinter.setBackgroundColor("symbolLargeFireColorBall",cardTools.getSymbolColor("fire"),svg.node);
                cardPrinter.setBackgroundColor("symbolLargeFire2ColorBall",cardTools.getSymbolColor("fire"),svg.node);
                cardPrinter.setBackgroundColor("symbolFireSmallColorBall",cardTools.getSymbolColor("fire"),svg.node);

                cardPrinter.setBackgroundColor("symbolLargeAirColorBall",cardTools.getSymbolColor("air"),svg.node);
                cardPrinter.setBackgroundColor("symbolLargeAir2ColorBall",cardTools.getSymbolColor("air"),svg.node);
                cardPrinter.setBackgroundColor("symbolAirSmallColorBall",cardTools.getSymbolColor("air"),svg.node);

                cardPrinter.setBackgroundColor("symbolLargeWaterColorBall",cardTools.getSymbolColor("water"),svg.node);
                cardPrinter.setBackgroundColor("symbolLargeWater2ColorBall",cardTools.getSymbolColor("water"),svg.node);
                cardPrinter.setBackgroundColor("symbolWaterSmallColorBall",cardTools.getSymbolColor("water"),svg.node);
                break;
            }
            case 3:{
                let color="#fff";

                cardPrinter.setBackgroundColor("symbolLargeEarthColorBall",cardTools.getSymbolColor("earth"),svg.node);
                cardPrinter.setBackgroundColor("symbolLargeEarth2ColorBall",cardTools.getSymbolColor("earth"),svg.node);
                cardPrinter.setBackgroundColor("symbolEarthSmallColorBall",cardTools.getSymbolColor("earth"),svg.node);
                cardPrinter.setBackgroundColor("symbolLargeEarth2ColorNumber",color,svg.node);
                
                cardPrinter.setStrokeColor("symbolLargeEarthColorBall",color,svg.node);
                cardPrinter.setStrokeColor("symbolLargeEarth2ColorBall",color,svg.node);

                cardPrinter.setOpacity("symbolLargeEarthColorGlyph",0,svg.node);
                cardPrinter.setOpacity("symbolLargeEarth2ColorGlyph",0,svg.node);
                
                cardPrinter.setBackgroundColor("symbolLargeFireColorBall",cardTools.getSymbolColor("fire"),svg.node);
                cardPrinter.setBackgroundColor("symbolLargeFire2ColorBall",cardTools.getSymbolColor("fire"),svg.node);
                cardPrinter.setBackgroundColor("symbolFireSmallColorBall",cardTools.getSymbolColor("fire"),svg.node);
                cardPrinter.setBackgroundColor("symbolLargeFire2ColorNumber",color,svg.node);
                
                cardPrinter.setStrokeColor("symbolLargeFireColorBall",color,svg.node);
                cardPrinter.setStrokeColor("symbolLargeFire2ColorBall",color,svg.node);

                cardPrinter.setOpacity("symbolLargeFireColorGlyph",0,svg.node);
                cardPrinter.setOpacity("symbolLargeFire2ColorGlyph",0,svg.node);
                
                cardPrinter.setBackgroundColor("symbolLargeAirColorBall",cardTools.getSymbolColor("air"),svg.node);
                cardPrinter.setBackgroundColor("symbolLargeAir2ColorBall",cardTools.getSymbolColor("air"),svg.node);
                cardPrinter.setBackgroundColor("symbolAirSmallColorBall",cardTools.getSymbolColor("air"),svg.node);
                cardPrinter.setBackgroundColor("symbolLargeAir2ColorNumber",color,svg.node);
                
                cardPrinter.setStrokeColor("symbolLargeAirColorBall",color,svg.node);
                cardPrinter.setStrokeColor("symbolLargeAir2ColorBall",color,svg.node);

                cardPrinter.setOpacity("symbolLargeAirColorGlyph",0,svg.node);
                cardPrinter.setOpacity("symbolLargeAir2ColorGlyph",0,svg.node);
                
                cardPrinter.setBackgroundColor("symbolLargeWaterColorBall",cardTools.getSymbolColor("water"),svg.node);
                cardPrinter.setBackgroundColor("symbolLargeWater2ColorBall",cardTools.getSymbolColor("water"),svg.node);
                cardPrinter.setBackgroundColor("symbolWaterSmallColorBall",cardTools.getSymbolColor("water"),svg.node);
                
                cardPrinter.setBackgroundColor("symbolLargeWater2ColorNumber",color,svg.node);
                cardPrinter.setStrokeColor("symbolLargeWaterColorBall",color,svg.node);
                cardPrinter.setStrokeColor("symbolLargeWater2ColorBall",color,svg.node);
                
                cardPrinter.setOpacity("symbolLargeWaterColorGlyph",0,svg.node);
                cardPrinter.setOpacity("symbolLargeWater2ColorGlyph",0,svg.node);
                break;
            }
        }

        if (side)
            cardPrinter.startLowerSide();
        else
            cardPrinter.startUpperSide();
        
        let
            isPlaceFeatured = (card.boostAttack == undefined) && (card.attack == undefined) && (card.life == undefined) && (card.boostLife == undefined),
            unitBoostIcon=cardPrinter.getPlaceholder("unitBoostIcon"),
            unitIcon=cardPrinter.getPlaceholder("unitIcon"),
            unitBoost=cardPrinter.getPlaceholder("unitBoost"),
            unitPlaceBoost=cardPrinter.getPlaceholder("unitPlaceBoost"),
            boostAttack=cardPrinter.getPlaceholder("boostAttack"),
            boostLife=cardPrinter.getPlaceholder("boostLife"),
            boostElement=cardPrinter.getPlaceholder("boostElement");
            unitDescription=cardPrinter.getPlaceholder("unitDescription"),
            eventDescription=cardPrinter.getPlaceholder("eventDescription"),
            unitName=cardPrinter.getPlaceholder("unitName"),
            unitLevel=cardPrinter.getPlaceholder("unitLevel"),
            unitAttack=cardPrinter.getPlaceholder("unitAttack"),
            unitLife=cardPrinter.getPlaceholder("unitLife"),
            unitElement=cardPrinter.getPlaceholder("unitElement");

        cardPrinter.addLargeSymbol(getTriggerIconName(card.boostTrigger),unitBoostIcon);
        cardPrinter.addLargeSymbol(getTriggerIconName(card.trigger,true),unitIcon);

        if (card.illustration) {
            if (profile.vectorImage)
                drawIllustration(profile,cardPrinter,card.illustration,"unitImage");
            else
                cardPrinter.setImageData("unitImage",getIllustration(profile,card.illustration));
        } else
            cardPrinter.delete([ "unitImage" ]);

        if (isEvent)
            cardPrinter.delete([ "unitBoostFullBackground" ]);
        else
            cardPrinter.delete([ "unitEventBackground" ]);

        colorizeHeader(profile,cardPrinter,isEvent,card.boostSymbol,"unitBoostFullBackground","unitBoostBackground",["unitBoostBackgroundShade","unitBoostBackgroundShade2"]);
        colorizeHeader(profile,cardPrinter,isEvent,card.symbol,0,"unitBackground",["unitBackgroundShade","unitBackgroundShade2"]);

        if (card.boostDescription)
            if (isEvent && isPlaceFeatured)
                cardPrinter.addText(boostTextSettings,unitPlaceBoost,getActionText(profile,card.boostCondition,card.boostDescription));
            else
                cardPrinter.addText(boostTextSettings,unitBoost,getActionText(profile,card.boostCondition,card.boostDescription));
        cardPrinter.addText(levelTextSettings,unitLevel,card.level);
        if (card.boostAttack)
            cardPrinter.addText(symbolTextSettings,boostAttack,card.boostAttack);
        if (card.boostLife)
            cardPrinter.addText(symbolTextSettings,boostLife,card.boostLife);
        if (card.boostSymbolAmount)
            cardPrinter.addText(symbolTextSettings,boostElement,getSymbol(profile,card.boostSymbol,card.boostSymbolAmount));
        if (card.description)
            cardPrinter.addText(descriptionTextSettings,(isEvent ? eventDescription : unitDescription),getActionText(profile,card.condition,card.description+(card.flavorText?"\n\n{italic}"+card.flavorText+"{enditalic}":"")));
        cardPrinter.addText(nameTextSettings,unitName,card.name);
        if (card.attack)
            cardPrinter.addText(symbolTextSettings,unitAttack,card.attack);
        if (card.life)
            cardPrinter.addText(symbolTextSettings,unitLife,card.life);
        if (card.symbolAmount)
            cardPrinter.addText(elementTextSettings,unitElement,getSymbol(profile,card.symbol,card.symbolAmount));
        if (!card.area)
            cardPrinter.delete([ "unitPin" ]);
        else if (profile.colorizeIcons)
            cardPrinter.setBackgroundColor("unitPin","#f00");

        if (isEvent) {
            if (isPlaceFeatured)
                cardPrinter.delete([ "unitSword", "unitHeart" ]);
            if (side)
                cardPrinter.delete([ "eventSideUp" ]);
        } else {
            cardPrinter.delete([ "eventSideUp" ]);
        }

        if (profile.outlineMode)
            cardPrinter.addRect({
                x:2,
                y:(CARDHEIGHT/2)-0.125,
                width:CARDWIDTH-4,
                height:0.25
            },"#000");
        else
            cardPrinter.addRect({
                x:0,
                y:(CARDHEIGHT/2)-0.25,
                width:CARDWIDTH,
                height:0.5
            },"#000");

        cardPrinter.delete([
            "unitCardHalf",
            "unitCardBorder",
            "unitFrames"
        ]);
    }

    function renderPlace(profile,svg,side,x,y,card) {
        let cardPrinter=new CardPrinter(svg,"placeCardContainer",x,y);

        if (side)
            cardPrinter.startLowerSide();
        else
            cardPrinter.startUpperSide();
        
        let
            placeBoostIcon=cardPrinter.getPlaceholder("placeBoostIcon"),
            placeBoost=cardPrinter.getPlaceholder("placeBoost"),
            placeDescription=cardPrinter.getPlaceholder("placeDescription"),
            placeName=cardPrinter.getPlaceholder("placeName"),
            placeLevel=cardPrinter.getPlaceholder("placeLevel"),
            placeElement=cardPrinter.getPlaceholder("placeElement");

        colorizeHeader(profile,cardPrinter,false,card.boostSymbol,"placeFullBackground","placeBackground",["placeBackgroundShade","placeBackgroundShade2"]);

        cardPrinter.addLargeSymbol(getTriggerIconName(card.boostTrigger),placeBoostIcon);

        if (card.boostDescription)
            cardPrinter.addText(boostTextSettings,placeBoost,getActionText(profile,card.boostCondition,card.boostDescription));
        cardPrinter.addText(levelTextSettings,placeLevel,card.level);
        if (card.boostSymbolAmount)
            cardPrinter.addText(symbolTextSettings,placeElement,getSymbol(profile,card.boostSymbol,card.boostSymbolAmount));
        if (card.description)
            cardPrinter.addText(descriptionTextSettings,placeDescription,getActionText(profile,card.boostCondition,card.description));
        if (card.name)
            cardPrinter.addText(nameTextSettings,placeName,card.name);

        cardPrinter.delete([
            "placeCardHalf",
            "placeCardBorder",
            "placeFrames"
        ]);

    }

    function renderText(profile,svg,side,x,y,card) {
        let cardPrinter=new CardPrinter(svg,"textCardContainer",x,y);

        if (side)
            cardPrinter.startLowerSide();
        else
            cardPrinter.startUpperSide();
            
        let
            titleElement=cardPrinter.getPlaceholder("textCardTitle"),
            contentElement=cardPrinter.getPlaceholder("textCardContent");

        if (card.title)
            cardPrinter.addText(titleTextSettings,titleElement,card.title);
        if (card.text)
            cardPrinter.addText(contentTextSettings,contentElement,cardTools.solveActionSymbols(card.text.join("\n"),profile.iconsProfile));

        cardPrinter.delete([
            "textCardBorder"
        ]);

    }

    function renderCard(profile,svg,x,y,card,drawId) {

        let
            isTextCard=card[0].type=="text",
            cardPrinter=new CardPrinter(svg,"blankCardContainer",x,y),
            code=[];

        cardPrinter.startUpperSide();
    
        if (isTextCard) {
            cardPrinter.delete([
                "blankCardOutline",
                "blankCardBlackOutline"
            ]);
        } else
            switch (profile.outlineMode) {
                case 0:{
                    cardPrinter.delete([
                        "blankCardOutline",
                        "blankCardBlackOutline"
                    ]);
                    break;
                }
                case 1:{
                    cardPrinter.delete([
                        "blankCardOutline"
                    ]);
                    cardPrinter.setStrokeColor("blankCardCutout","#ffffff");
                    break;
                }
                case 2:{
                    cardPrinter.delete([
                        "blankCardBlackOutline"
                    ]);
                    break;
                }
            }

        card.forEach((side,id)=>{
            let sideType=id%2;

            if (side.id) code.push(side.id);
            switch (side.type) {
                case "unit":{
                    renderUnit(profile,svg,sideType,false,x,y,side);
                    break;
                }
                case "event":{
                    renderUnit(profile,svg,sideType,true,x,y,side);
                    break;
                }
                case "place":{
                    renderPlace(profile,svg,sideType,x,y,side);
                    break;
                }
                case "text":{
                    renderText(profile,svg,sideType,x,y,side);
                    break;
                }
            }
        })

        if (drawId) {
            cardPrinter.printAt("cardCodeText",{
                isCardNumber:true,
                x:CARDWIDTH-CARDNUMBERSPACING-CARDNUMBERSIZE,
                y:CARDNUMBERBORDER,
                width:CARDNUMBERSIZE,
                height:CARDHEIGHT-(CARDNUMBERBORDER*2),
                angle:-90
            },code.join(" / "), isTextCard ? profile.textCardCodeColor : profile.cardCodeColor);
        }

    }

    function renderCardBack(profile,svg,x,y,card) {

        let cardPrinter=new CardPrinter(svg,profile.nodeId,x,y);
        cardPrinter.startUpperSide();
    
    }

    function plainTextCard(card) {

        let out=[];

        card.forEach((side,id)=>{
            if (id) out.push("");
            switch (side.type) {
                case "unit":{
                    out.push("Unit: "+side.name);
                    if (side.boostCondition) out.push("Boost Condition: "+solveActionSymbolsPlainText(side.boostCondition));
                    if (side.boostDescription) out.push("Boost: "+solveActionSymbolsPlainText(side.boostDescription));
                    if (side.condition) out.push("Condition: "+solveActionSymbolsPlainText(side.condition));
                    if (side.description) out.push("Description: "+solveActionSymbolsPlainText(side.description));
                    break;
                }
                case "event":{
                    out.push("Event: "+side.name);
                    if (side.boostCondition) out.push("Boost Condition: "+solveActionSymbolsPlainText(side.boostCondition));
                    if (side.boostDescription) out.push("Boost: "+solveActionSymbolsPlainText(side.boostDescription));
                    if (side.description) out.push("Description: "+solveActionSymbolsPlainText(side.description));
                    if (side.flavorText) out.push("Flavor Text: "+solveActionSymbolsPlainText(side.flavorText));
                    break;
                }
                case "place":{
                    out.push("Place: "+side.name);
                    if (side.boostDescription) out.push("Boost: "+solveActionSymbolsPlainText(side.boostDescription));
                    if (side.description) out.push("Description: "+solveActionSymbolsPlainText(side.description));
                    break;
                }
                case "text":{
                    out.push("Text: "+side.title);
                    if (side.text) out.push("Text:\n"+solveActionSymbolsPlainText(side.text.join("\n")));
                    break;
                }
            }
        });

        return out;

    }

    // Interface

    this.setMode=(setmode)=>{
        mode=setmode;
    }

    this.paintCardAt=(profile,svg,x,y,card,drawId)=>{
        renderCard(profile,svg,x,y,card,drawId);
    }

    this.paintCardBackAt=(profile,svg,x,y,card)=>{
        renderCardBack(profile,svg,x,y,card);
    }

    this.plainTextCard=(card)=>{
        return plainTextCard(card);
    }

    this.getImageUri=(profile,card)=>{
        return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(this.getImageSvg(profile,card));
    }

    this.getImageSvg=(profile,card)=>{
        let svg=new SVG(template);
        renderCard(profile,svg,0,0,card);
        svg.deleteById("blankCardCutout");
        svg.finalize();
        let svgText=svg.getSVG();
        svgText=svgText.replace(/<svg.*inkscape:version/,"<svg width=\""+CARDWIDTH+"mm\" height=\""+CARDHEIGHT+"mm\" viewBox=\"0 0 "+CARDWIDTH+" "+CARDHEIGHT+"\" inkscape:version");
        return svgText;
    }

}