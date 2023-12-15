function TestArea(ENV,cards,profile,onquit) {

    const
        TOKENCOLORS=["red","green","blue","white","orange"],
        TURNMODE_DEFAULT=0,
        TURNMODE_HALFCARD=1,
        DECKSHIFT=3,
        PAD=60;

    let
        isReady=false,
        template,
        cardTools = new CardTools(ENV),
        cardPainter,
        deckPainter,
        rootNode,
        table;

    profile=profile || "DEF";

    function shuffle(set) {
        for (let i=0;i<set.length;i++) {
            let des=Math.floor(Math.random()*set.length);
            if (des!=i) {
                let swp=set[i];
                set[i]=set[des];
                set[des]=swp;
            }
        }
    }

    function quit() {
        if (isReady && onquit) {
            table.stop();
            rootNode.parentNode.removeChild(rootNode);
            if (onquit)
                onquit();
        }
    }
    
    function CardSpace(content,style) {

        let
            node = document.createElement("div");

        node.className="cardspace"+(style?" "+style:"");
        node._object=this;
        node._noZSort=true;
        node.innerHTML=content;

        this.addTo=(t)=>{
            t.node.appendChild(node);
        }

        this.moveTo=(x,y)=>{
            this.x=x;
            this.y=y;
            node.style.left=x;
            node.style.top=y;
        }

        this.node=node;

    }

    function Note(content,style) {

        let
            node = document.createElement("div");
        
        node.className="note "+(style?style:"");
        node._object=this;
        node._noZSort=true;
        node.innerHTML=content;
        
        this.addTo=(t)=>{
            t.node.appendChild(node);
        }
        
        this.moveTo=(x,y)=>{
            this.x=x;
            this.y=y;
            node.style.left=x;
            node.style.top=y;
        }
        
        this.setWidth=(w)=>{
            node.style.width=w;
        }
        
        this.setHeight=(h)=>{
            node.style.height=h;
        }
        
        this.node=node;
        
    }
    
    function DiscardShuffler(content) {
        let
            dx,dy,
            from,
            node = document.createElement("div");

        node.className="discardshuffler";
        node._object=this;
        node._noZSort=true;
        node._overrideEvents=true;
        node.innerHTML=content;

        this.setDestination=(x,y)=>{
            dx=x;
            dy=y;
        }

        this.setFrom=(area)=>{
            from=area;
        }

        this.addTo=(t)=>{
            table=t;
            t.node.appendChild(node);
        }

        this.moveTo=(x,y)=>{
            this.x=x;
            this.y=y;
            node.style.left=x;
            node.style.top=y;
        }

        node.onclick=()=>{
            let
                nodes=table.getCollidingDivs(from.node),
                deck=[];
            nodes.list.forEach(node=>{
                if (node._isCard && !node._doNotShuffle)
                    deck.push(node);
            });
            if (deck.length) {
                shuffle(deck);
                deck.forEach((card,id)=>{
                    card._object.resetRotation();
                    card._object.setFlipped(false);
                    card._object.addTo(table);
                    card._object.moveTo(dx,dy+Math.floor(id/DECKSHIFT));
                })
            }
        }

        this.node=node;
    }

    function MoveButton(label,space1,space2) {

        let
            node = document.createElement("div");

        node.className="movebutton";
        node._object=this;
        node._noZSort=true;
        node.innerHTML=label;
        node._overrideEvents=true;

        this.addTo=(t)=>{
            t.node.appendChild(node);
        }

        this.moveTo=(x,y)=>{
            this.x=x;
            this.y=y;
            node.style.left=x;
            node.style.top=y;
        }

        node.onclick=()=>{
            let
                nodes=table.getCollidingDivs(space1.node),
                dx=space2.x-space1.x,
                dy=space2.y-space1.y;
            nodes.list.forEach((node,id)=>{
                if (id!=nodes.index)
                    node._object.moveTo(node._object.x+dx,node._object.y+dy);
            })
        }

        this.node=node;

    }

    function NumberToken(style,value,styles) {

        let
            styleIndex = styles.indexOf(style),
            node = document.createElement("div"),
            display = document.createElement("span"),
            plus = document.createElement("div"),
            minus = document.createElement("div");

        node._object=this;

        display.innerHTML=value;
        node.appendChild(display);

        plus.className="button plus";
        plus.innerHTML="+";
        plus._overrideEvents=true;
        node.appendChild(plus);

        minus.className="button minus";
        minus.innerHTML="-";
        minus._overrideEvents=true;
        node.appendChild(minus);

        function updateToken() {
            node.className="numbertoken "+styles[styleIndex];
        }

        minus.onclick=()=>{
            if (value>0)
                value--;
                display.innerHTML=value;
        }

        plus.onclick=()=>{
            value++;
            display.innerHTML=value;
        }

        this.addTo=(t)=>{
            t.node.appendChild(node);
        }

        this.moveTo=(x,y)=>{
            this.x=x;
            this.y=y;
            node.style.left=x;
            node.style.top=y;
        }
        
        this.onDrag=(e)=>{
            this.moveTo(e.endLeft,e.endTop);
        }

        this.startOver=(e)=>{
            node.style.borderColor="#f00";
        }

        this.startDrag=()=>{
            table.node.appendChild(node);
        }

        this.endOver=(e)=>{
            node.style.borderColor="";
        }

        this.rotateRight=(e)=>{
            styleIndex=(styleIndex+1)%styles.length;
            updateToken();
        }

        updateToken();

        this.node=node;

    }

    function Card(content,angle,discardpile,turnmode) {

        let
            isFull=!turnmode,
            table,
            sides=4,
            flipped=false,
            node = document.createElement("div");
        
        if (!angle)
            angle=0;

        node.innerHTML=content;
        node._object=this;
        node._isCard=true;

        function redraw() {
            let className="card"+(isFull?" full":"");
            node.innerHTML="";
            switch (turnmode) {
                case TURNMODE_HALFCARD:{
                    switch (angle) {
                        case 0:
                        case 1:{
                            node.style.transform="rotate("+(angle*90)+"deg)";
                            break;
                        }
                        default:{
                            className+=" upsidedown";
                            node.style.transform="rotate("+((angle-2)*90)+"deg)";
                            break;
                        }
                    }
                    break;
                }
                default:{
                    node.style.transform="rotate("+(angle*90)+"deg)";
                }
            }
            if (flipped) {
                let
                    layer=document.createElement("div");
                node.className=className+" flipped";
                layer.className="cardback";
                node.appendChild(layer);
            } else {
                node.className=className+" card";
                content.forEach((side,id)=>{
                    let
                        layer=document.createElement("div");
                    layer.className="layer "+(id == 1 ? "flipped" : "");
                    node.appendChild(layer);
                    side.forEach(el=>{
                        let
                            div=document.createElement("div");
                        div.className=el.section;
                        if (el.text !== undefined)
                            div.innerHTML=el.text;
                        if (el.image) {
                            div.style.backgroundImage="url(\""+el.image+"\")";
                            div.style.backgroundRepeat="no-repeat";
                            div.style.backgroundPosition="center";
                            div.style.backgroundSize="contain";
                        }
                        if (el.backgroundX !== undefined)
                            div.style.backgroundPosition=(el.backgroundX||"0")+"px "+(el.backgroundY||"0")+"px";
                        if (el.backgroundColor)
                            div.style.backgroundColor=el.backgroundColor;
                        if (el.borderColor)
                            div.style.borderColor=el.borderColor;
                        layer.appendChild(div);
                    });
                })
            }
        }

        this.addTo=(t)=>{
            table=t;
            t.node.appendChild(node);
        }
        
        this.moveTo=(x,y)=>{
            this.x=x;
            this.y=y;
            node.style.left=x;
            node.style.top=y;
        }

        this.setFlipped=(f)=>{
            flipped=f;
            redraw();
        }

        this.setNotShuffle=(n)=>{
            node._doNotShuffle=n;
        }

        this.startDrag=()=>{
            table.node.appendChild(node);
        }

        this.onDrag=(e)=>{
            this.moveTo(e.endLeft,e.endTop);
        }

        this.startOver=(e)=>{
            node.style.borderColor="#f00";
        }

        this.endOver=(e)=>{
            node.style.borderColor="";
        }

        this.rotateRight=()=>{
            angle=(angle+1)%sides;
            redraw();
        }

        this.exhaust=()=>{
            switch (angle) {
                case 0:{
                    angle=1;
                    break;
                }
                case 1:{
                    angle=0;
                    break;
                }
                case 2:{
                    angle=3;
                    break;
                }
                case 3:{
                    angle=2;
                    break;
                }
            }
            redraw();
        }

        this.discard=()=>{
            flipped=false;
            if (angle==1) angle=0;
            else if (angle==3) angle=2;
            redraw();
            this.moveTo(discardpile.x,discardpile.y+20);
        }

        this.rotateLeft=()=>{
            angle--;
            if (angle<0) angle=sides-1;
            redraw();
        }

        this.resetRotation=()=>{
            angle=0;
            redraw();
        }

        this.flip=()=>{
            flipped=!flipped;
            redraw();
        }

        this.node=node;

        redraw();

    }

    function Table() {

        let
            wheelTimestamp,
            dragging = false,
            over = false,
            node = document.createElement("div");
        
        node.className="table";
        node._object=this;
        node._noZSort=true;

        

        function unsetDragging() {
            if (dragging) {
                if (dragging.object.endDrag)
                    dragging.object.endDrag(dragging);
            }
            dragging=0;
        }

        function unsetOver() {
            if (over) {
                if (over.object.endOver)
                    over.object.endOver(over);
            }
            over=0;
        }

        function getCollidingDivs(from,div) {
            let
                colliding={
                    index:0,
                    list:[]
                }
                checkrect = div.getBoundingClientRect(),
                nodes=from.childNodes;
            for (let i=0;i<nodes.length;i++) {
                let
                    node=nodes[i],
                    noderect=node.getBoundingClientRect();
                if (node === div) {
                    colliding.index = colliding.list.length;
                    colliding.list.push(node);
                } else if (!node._noZSort && !((noderect.x>checkrect.x+checkrect.width)||(noderect.x+noderect.width<checkrect.x)||(noderect.y>checkrect.y+checkrect.height)||(noderect.y+noderect.height<checkrect.y)))
                    colliding.list.push(node);
            }

            return colliding;

        }

        function getObjectFromNode(target) {
            let object = 0;
            do {
                if (target._object)
                    object=target._object;
                else
                    target=target.parentNode;
            } while (target && !object);
            return object;
        }

        function moveSelectedDown() {
            if (over && !over.object.node._noZSort) {
                let divs=getCollidingDivs(over.object.node.parentNode,over.object.node);
                if (divs.index != 0)
                    over.object.node.parentNode.insertBefore(over.object.node, divs.list[divs.index-1]);
            }
        }

        function moveSelectedUp() {
            if (over && !over.object.node._noZSort) {
                let divs=getCollidingDivs(over.object.node.parentNode,over.object.node);
                if (divs.list[divs.index+1])
                    over.object.node.parentNode.insertBefore(divs.list[divs.index+1],over.object.node);
            }
        }

        function rightClick(object) {
            object.rotateRight();
        }

        function middleClick(object) {
            object.exhaust();
        }

        const
            DOCUMENTEVENTS={
                wheel:function(e) {
                    let
                        delta=e.timeStamp-wheelTimestamp;
                    if (delta>100) {
                        if (e.deltaY<0)
                            moveSelectedUp();
                        if (e.deltaY>0)
                            moveSelectedDown();
                    }
                    wheelTimestamp=e.timeStamp;
                },
                pointerup:function(e) {
                    unsetDragging();
                    return false;
                },
                pointerdown:function(e) {
                    if (e.button == 1) {
                        if (over && over.object.rotateRight)
                            middleClick(over.object);
                    } else if (e.button == 2) {
                        if (over && over.object.exhaust)
                            rightClick(over.object);
                    } else {
                        unsetDragging();
                        unsetOver();
                        if (e.target._overrideEvents) return;
                        dragging={
                            object:getObjectFromNode(e.target),
                            ox:e.pageX,
                            oy:e.pageY,
                            dx:0,
                            dy:0
                        }
                        if (dragging.object.node) {
                            dragging.startLeft=parseFloat(dragging.object.node.style.left);
                            dragging.startTop=parseFloat(dragging.object.node.style.top);
                            dragging.endLeft=dragging.startLeft;
                            dragging.endTop=dragging.startTop;
                        }
                        if (dragging.object.startDrag)
                            dragging.object.startDrag(dragging);
                    }
                },
                pointermove:function(e) {
                    if (dragging) {
                        dragging.dx=e.pageX-dragging.ox;
                        dragging.dy=e.pageY-dragging.oy;
                        dragging.endLeft=dragging.startLeft+dragging.dx;
                        dragging.endTop=dragging.startTop+dragging.dy;
                        if (dragging.object.onDrag)
                            dragging.object.onDrag(dragging);
                        if ((e.button == 2) && (e.buttons > 1) && dragging && dragging.object.node)
                            rightClick(dragging.object);
                    } else {
                        let newOverObject=getObjectFromNode(e.target);
                        if (!over || (over.object !== newOverObject)) {
                            unsetOver();
                            over={
                                object:newOverObject
                            };
                            if (over.object.startOver)
                                over.object.startOver(over);
                        }
                    }
                },
                keydown:function(e) {
                    switch (e.keyCode) {
                        case 27:{
                            quit();
                            break;
                        }
                        case 65:{
                            moveSelectedUp();
                            break;
                        }
                        case 90:{
                            moveSelectedDown();
                            break;
                        }
                        case 88:{
                            if (over && over.object.rotateLeft)
                                over.object.rotateLeft();
                            break;
                        }
                        case 67:{
                            if (over && over.object.rotateRight)
                                over.object.rotateRight();
                            break;
                        }
                        case 68:{
                            if (over && over.object.discard)
                                over.object.discard();
                            break;
                        }
                        case 69:{
                            if (over && over.object.exhaust)
                                over.object.exhaust();
                            break;
                        }
                        case 32:{
                            if (over && over.object.flip)
                                over.object.flip();
                            break;
                        }
                    }
                }
            };

        function registerEvents() {
            document.oncontextmenu=rootNode.oncontextmenu=()=>{ return false };
            for (let k in DOCUMENTEVENTS)
                document.addEventListener(k,DOCUMENTEVENTS[k]);

        }

        function unregisterEvents() {
            document.oncontextmenu=rootNode.oncontextmenu=0;
            for (let k in DOCUMENTEVENTS)
                document.removeEventListener(k,DOCUMENTEVENTS[k]);
        }

        this.getCollidingDivs=(from)=>{
            return getCollidingDivs(node,from);
        }

        this.addCard=(content,x,y,flipped,angle,discardpile,turnmode,notshuffle)=>{
            let card = new Card(content,angle,discardpile,turnmode);
            card.addTo(this);
            card.moveTo(x,y);
            card.setFlipped(flipped);
            card.setNotShuffle(notshuffle);
            return card;
        }

        this.addDiscardShuffler=(content,x,y,from,dx,dy)=>{
            let discardShuffler = new DiscardShuffler(content);
            discardShuffler.addTo(this);
            discardShuffler.moveTo(x,y);
            discardShuffler.setFrom(from);
            discardShuffler.setDestination(dx,dy);
            return discardShuffler;
        }

        this.addCardSpace=(x,y,content,style)=>{
            let cardspace = new CardSpace(content,style);
            cardspace.addTo(this);
            cardspace.moveTo(x,y);
            return cardspace;
        }

        this.addNumberToken=(x,y,style,value,styles)=>{
            let token = new NumberToken(style,value,styles);
            token.addTo(this);
            token.moveTo(x,y);
            return token;
        }

        this.addMoveButton=(x,y,content,space1,space2)=>{
            let button = new MoveButton(content,space1,space2);
            button.addTo(this);
            button.moveTo(x,y);
            return button;
        }

        this.addNote=(x,y,width,height,content,style)=>{
            let note = new Note(content,style);
            note.addTo(this);
            note.moveTo(x,y);
            note.setWidth(width);
            note.setHeight(height);
            return note;
        }

        this.show=()=>{
            registerEvents();
            rootNode.appendChild(node);
        }

        this.stop=()=>{
            unregisterEvents();
            rootNode.removeChild(node);
        }

        this.node=node;

    }

    this.run=(root)=>{

        rootNode=document.createElement("div");
        rootNode.className="testroot";

        let
            splashScreen=document.createElement("div"),
            splashContent=document.createElement("div");

        splashScreen.className="splashscreen";
        splashContent.className="content";
        splashScreen.appendChild(splashContent);
        rootNode.appendChild(splashScreen);

        splashContent.innerHTML="<div class='logo'></div>Please wait...";

        root.appendChild(rootNode);

        setTimeout(()=>{

            template=new SVGTemplate(ENV.templatesRoot+"model.svg",true);
            template.load(()=>{
                    
                cardPainter = new CardPainter(cardTools,template);
                deckPainter = new DeckPainter(cardTools,template);

                // Prepare card spaces

                shuffle(cards.deck);
                table=new Table();

                for (let i=0;i<4;i++) {
                    let
                        spaces=[],
                        x=350+(270*i);
                    for (let j=0;j<3;j++) {
                        let
                            text=i+1,
                            cardspace=table.addCardSpace(x,10+(j*(300+PAD)),text);
                        spaces.push(cardspace);
                    }
                    table.addMoveButton(x+95,PAD+350,"&#8595;",spaces[0],spaces[1]);
            
                }

                let
                    discardPile=table.addCardSpace(10,700,"Discard","discardpile");
                table.addDiscardShuffler("Shuffle discarded units",40,80,discardPile,10,10);

                table.addCardSpace(1430,600,"Shields","wide");

                // Prepare tokens

                for (let i=0;i<8;i++)
                    table.addNumberToken(275,270+(25*i),"red",1,TOKENCOLORS);

                table.addNumberToken(275,10,"blue",3,TOKENCOLORS);

                // Spread cards

                let
                    subDecks={};

                cards.deck.forEach(card=>{
                    if (!subDecks[card[0].type])
                        subDecks[card[0].type]=[];
                    subDecks[card[0].type].push([
                        [
                            {
                                section:"cardimage",
                                text:cardPainter.getImageSvg(deckPainter.PROFILESBYID[profile],card)
                            }
                        ]
                    ]);
                });

                if (subDecks.event)
                    subDecks.event.forEach(card=>{
                        table.addCard(card,1690,790,false,Math.random()>0.5?0:2,discardPile,TURNMODE_HALFCARD,true);
                    });

                if (subDecks.unit)
                    if (subDecks.unit.length<=CONFIG.liteDeckUnitCards) {
                        table.addNumberToken(1430,790,"green",5,TOKENCOLORS);
                        subDecks.unit.forEach((card,id)=>{
                            if (id<5)
                                table.addCard(card,1420+((id%2)*240),10+(Math.floor(id/2)*150),false,0,discardPile,TURNMODE_HALFCARD);
                            else if (id<6)
                                table.addCard(card,10,220,false,2,discardPile,TURNMODE_HALFCARD);
                            else
                                table.addCard(card,10,10+Math.floor((id-6)/DECKSHIFT),false,0,discardPile,TURNMODE_HALFCARD);
                        });
                    } else {
                        subDecks.unit.forEach((card,id)=>{
                            if (id<5)
                                table.addCard(card,1430,790+(25*id),true,0,discardPile,TURNMODE_HALFCARD);
                            else if (id<10)
                                table.addCard(card,1420+(((id-5)%2)*240),10+(Math.floor((id-5)/2)*150),false,0,discardPile,TURNMODE_HALFCARD);
                            else if (id == 11)
                                table.addCard(card,10,220,false,2,discardPile,TURNMODE_HALFCARD);
                            else
                                table.addCard(card,10,10+Math.floor((id-11)/DECKSHIFT),false,0,discardPile,TURNMODE_HALFCARD);
                        });
                    }
                   

                if (subDecks.text)
                    subDecks.text.forEach(card=>{
                        table.addCard(card,1870,440,false,0,false,TURNMODE_DEFAULT,true);
                    });

                setTimeout(() => {    
                    rootNode.removeChild(splashScreen);
                    table.show();
                    isReady=true;
                }, 500);

            });
            
        },1000);

    }

}