const
    DEBUG=false,
    CARDNUMBERSIZE=1.5,
    CARDNUMBERSPACING=0.45,
    CARDWIDTH=64,
    CARDHEIGHT=89,
    SHEETWIDTH=210,
    SHEETHEIGHT=297,
    CARDSPACING=0,
    WORDSPACING=0.5,
    LINESPACING=0,
    TEXTGAP=0.9;
    SMALLTEXTGAP=0.6,
    LARGETEXTGAP=1.1,
    INNERBORDERSPACING=1,
    EMPTYLINESIZE=2,
    SYMBOLDISTANCE=9.5;

function CardPrinter(svg,modelid,x,y) {

    let
        side=0,
        containerNode=svg.getById(modelid);

    function cloneNodeBy(into,id,newid,dx,dy,rotate,before) {
        let org,edgex=0,edgey=0,edgewidth=0,edge,ex,ey;
        if (typeof id == "string") org=svg.getById(id);
        else org=id;
        const copy=svg.copyNode(org);
        if (newid) svg.setId(copy,newid);

        for (let i=0;i<copy.childNodes.length;i++)
            if (copy.childNodes[i].setAttribute) {
                let node=copy.childNodes[i];
                node.removeAttribute("transform");
                if (!edge && (node.tagName=="rect")) {
                    edge=node;
                    edgex=svg.getNum(node,"x");
                    edgey=svg.getNum(node,"y");
                    edgewidth=svg.getNum(node,"width");
                    edgeheight=svg.getNum(node,"height");
                }
            }

        ex=dx-edgex;
        ey=dy-edgey;
        svg.moveNodeAt(copy,0,0);

        if (rotate)
            copy.setAttribute("transform","translate("+ex+","+ey+") rotate("+rotate+","+(edgex+edgewidth/2)+","+(edgey+edgeheight/2)+")");
        else
            copy.setAttribute("transform","translate("+ex+","+ey+")");

        if (edge) copy.removeChild(edge);

        if (before)
            svg.insertBefore(before,copy);
        else if (into)
            into.appendChild(copy);
        else
            svg.insertBefore(org,copy);

        return copy;
    }

    function addRect(box,color,opacity,before) {
        if (opacity === undefined) opacity=1;
        if (color === undefined) color="#ff0000";
        let rect=svg.createNode("rect");
        rect.setAttribute("style","fill:"+color+";fill-opacity:"+opacity);
        rect.setAttribute("width",box.width);
        rect.setAttribute("height",box.height);
        rect.setAttribute("x",box.x);
        rect.setAttribute("y",box.y);
        if (before) {
            let prevnode=svg.getById(before,side);
            side.insertBefore(rect,prevnode);
        } else
            side.appendChild(rect);
    }

    function measureNode(node) {
        let box=node.getBBox();
        return {
            width:box.width,
            height:box.height
        };
    }

    function richPrint(settings,x,y,width,height,text) {

        text=text+"";
        
        let
            node=svg.node,
            orgTextNode=svg.getById(settings.modelId),
            normalTextNode=cloneNodeBy(0,orgTextNode,0,0,0),
            boldTextNode=cloneNodeBy(0,orgTextNode,0,0,0),
            italicTextNode=cloneNodeBy(0,orgTextNode,0,0,0),
            word="",
            lines=[],
            lineId=-1,
            cursorX=0,
            cursorY=0,
            oy=0,
            lineHeight=0,
            contentWidth=0,
            contentHeight=0,
            tag=false,
            bold=false,
            italic=false,
            i=0;
            
        
        let disableKerning=(node)=>{
            node.setAttribute("style",node.getAttribute("style")+";font-kerning: none;");
        }
        
        let measureSymbol=(node)=>{
            let rect=node.querySelector("rect");
            if (rect) return measureNode(rect);
        }

        let setBold=(node)=>{
            let span=node.querySelector("tspan");
            span.setAttribute("style",span.getAttribute("style").replace(/font-family:[^;]+/,"font-family:Times"));
            span.setAttribute("style",span.getAttribute("style").replace("font-weight:normal","font-weight:bold"));
        }

        let setItalic=(node)=>{
            let span=node.querySelector("tspan");
            span.setAttribute("style",span.getAttribute("style").replace(/font-family:[^;]+/,"font-family:Times"));
            span.setAttribute("style",span.getAttribute("style").replace("font-style:normal","font-style:italic"));
            span.setAttribute("style",span.getAttribute("style").replace(/font-size:[0-9\.]*/,"font-size:2.75"));
        }

        let printWord=()=>{
            if (word) {
                let node=0;
                if (tag) {
                    let parts=word.split(" ");
                    switch (parts[0]) {
                        case "symbol":{
                            node={
                                symbol:parts[1],
                                size:measureSymbol(svg.getById(parts[1]))
                            }
                            break;
                        }
                        case "bold":{
                            bold=true;
                            break;
                        }
                        case "endbold":{
                            bold=false;
                            break;
                        }
                        case "italic":{
                            italic=true;
                            break;
                        }
                        case "enditalic":{
                            italic=false;
                            break;
                        }
                    }
                } else {
                    let size;
                    if (bold) {
                        svg.setText(boldTextNode,word);
                        size=measureNode(boldTextNode);
                    } else if (italic) {
                        svg.setText(italicTextNode,word);
                        size=measureNode(italicTextNode);
                    } else {
                        svg.setText(normalTextNode,word);
                        size=measureNode(normalTextNode);
                    }
                    node={
                        text:word,
                        bold:bold,
                        italic:italic,
                        size:size
                    };
                }
                if (node) {
                    if (cursorX) cursorX+=settings.wordSpacing;
                    if (cursorX+node.size.width>width)
                        newLine();
                    node.x=cursorX;
                    lines[lineId].boxes.push(node);
                    lineHeight=Math.max(lineHeight,node.size.height);
                    cursorX+=node.size.width;
                }
                word="";
            }
        }

        let closeLine=()=>{
            lines[lineId].width=cursorX;
            lines[lineId].height=lineHeight;
            contentWidth=Math.max(contentWidth,cursorX);
        }

        let newLine=()=>{
            if (lineId!=-1) closeLine();
            lineId++;
            if (lineId>0) cursorY+=(lineHeight||EMPTYLINESIZE)+settings.lineSpacing;
            cursorX=0;
            lineHeight=0;
            lines.push({
                y:cursorY,
                width:0,
                height:0,
                boxes:[]
            });
            
        }

        disableKerning(normalTextNode);
        disableKerning(boldTextNode);
        disableKerning(italicTextNode);

        setBold(boldTextNode);
        setItalic(italicTextNode);

        newLine();

        while (i<text.length) {
            let ch=text[i];
            switch (ch) {
                case " ":{
                    if (tag) word+=ch;
                    else printWord();
                    break;
                }
                case "\n":{
                    if (!tag) {
                        printWord();
                        newLine();
                    }
                    break;
                }
                case "{":{
                    printWord();
                    tag=true;
                    break;
                }
                case "}":{
                    if (tag) {
                        printWord();
                        tag=false;
                    } else word+=ch;
                    break;
                }
                default:{
                    word+=ch;
                }
            }
            i++;
        }

        if (word) printWord();
        closeLine();
        contentHeight=cursorY+lineHeight;

        switch (settings.verticalAlignment) {
            case "center":{
                oy=y+(height-contentHeight)/2;
                break;
            }
            case "bottom":{
                oy=y+(height-contentHeight);
                break;
            }
            default:{
                oy=y;
            }
        }

        lines.forEach(line=>{
            let ox=0;
            switch (settings.horizontalAlignment) {
                case "center":{
                    ox=x+(width-line.width)/2;
                    break;
                }
                case "right":{
                    ox=x+width-line.width;
                    break;
                }
                default:{
                    ox=x;
                }
            }
            line.boxes.forEach(box=>{
                let
                    dx=box.x+ox,
                    dy=oy+line.y+(line.height-box.size.height)/2;
                if (box.text) {
                    let node=cloneNodeBy(side,orgTextNode,0,dx,dy+box.size.height-settings.textGap);
                    disableKerning(node);
                    svg.setText(node,box.text);
                    if (box.bold) setBold(node);
                    else if (box.italic) setItalic(node);
                }
                if (box.symbol)
                    cloneNodeBy(side,box.symbol,0,dx,dy);
            });
            
        });
        
        svg.delete(normalTextNode);
        svg.delete(boldTextNode);
        svg.delete(italicTextNode);

    }

    this.setText=(parent,id,text)=>{
        let
            node=svg.getById(id,parent);
        if (node) {
            let span=node.querySelector("tspan");
            if (span) span.innerHTML=text;
        }
    }

    this.printAt=(model,area,text,color)=>{
        let
            measure,newnode,textnode,dx,dy,cx,cy,
            template=cloneNodeBy(side,model,0,0,0),
            span=template.querySelector("tspan");
        
        span.innerHTML=text;
        measure=measureNode(template);

        cx=area.x+(area.width/2);
        cy=area.y+(area.height/2);
        dx=-(measure.width/2)+cx;

        if (area.isCardNumber)
            dy=(measure.height/4)+area.y+area.height-(measure.width/2);
        else
            dy=(measure.height/4)+cy;

        newnode = cloneNodeBy(side,model,0,0,0);
        newnode.setAttribute("transform","translate("+dx+","+dy+") rotate("+(area.angle||0)+","+measure.width/2+",-"+measure.height/4+")");
        textnode=newnode.querySelector("tspan");
        textnode.innerHTML=text;
        if (color) newnode.setAttribute("style",newnode.getAttribute("style").replace(/fill:[^;]*/,"fill:"+color));

        svg.delete(template);

        return newnode;

    }

    this.startUpperSide=()=>{
        side=cloneNodeBy(0,containerNode,0,x,y);
        return side;
    }

    this.startLowerSide=()=>{
        side=cloneNodeBy(0,containerNode,0,x,y,180);
        return side;
    }

    this.getPlaceholder=function(id,parent) {
        let
            node=svg.getById(id,parent||side);
            box={
                x:svg.getNum(node,"x"),
                y:svg.getNum(node,"y"),
                width:svg.getNum(node,"width"),
                height:svg.getNum(node,"height")
            };
        node.parentNode.removeChild(node);
        return box;
    }

    this.setImageData=function(id,data,parent) {
        let
            node=svg.getById(id,parent||side);
        node.setAttribute("xlink:href",data);
        return node;
    }

    this.addLargeSymbol=(id,box,textsettings,text)=>{
        if (id) {
            let symbol=cloneNodeBy(side,id,0,box.x,box.y);
            if (textsettings)
                richPrint(textsettings,box.x,box.y,box.width,box.height,text);
            return symbol;
        }
    }

    this.addStencil=(id,before,box,angle)=>{
        let symbol=cloneNodeBy(side,id,0,box.x,box.y,angle,svg.getById(before,side));
        return symbol;
    }

    this.addText=(settings,box,text)=>{
        richPrint(settings,box.x,box.y,box.width,box.height,text);
    }

    this.addRect=(box,color,opacity,before)=>{
        addRect(box,color,opacity,before);
    }

    this.setBackgroundColor=(id,color,parent)=>{
        let node=svg.getById(id,parent||side);
        node.setAttribute("style",node.getAttribute("style").replace(/fill:[^;]*/,"fill:"+color));
    }

    this.setStrokeColor=(id,color,parent)=>{
        let node=svg.getById(id,parent||side);
        node.setAttribute("style",node.getAttribute("style").replace(/([;^])stroke:[^;]*/,"$1stroke:"+color));
    }
    this.setOpacity=(id,opacity,parent)=>{
        let node=svg.getById(id,parent||side);
        node.setAttribute("style",node.getAttribute("style").replace(/([;^])opacity:[\.0-9]*/,"$1opacity:"+opacity));
    }

    this.delete=list=>{
        list.forEach(id=>{
            let node=svg.getById(id,side);
            svg.delete(node);
        })
    }

    this.getSide=()=>side;

}
