function DeckPainter(cardTools,template) {
 
    const
        PROFILES=[
            {
                id:"DEF",
                name:"Default",
                shortDescription:"Full color, slim card outline.",
                description:"The default style. Cards are in full color, elements are color-coded, and cards have a slim outline.",
                outlineMode:2,
                colorProfile:"normal",
                vectorImage:false,
                elementsMode:2,
                headerMode:0,
                colorizeIcons:true,
                iconsProfile:"color",
                cardCodeColor:"#000000",
                textCardCodeColor:"#000000"
            },
            {
                id:"GSC",
                name:"Grayscale",
                shortDescription:"Grayscale, slim card outline.",
                description:"The low-ink style. Cards are in grayscale, illustrations have lighter grays, elements are displayed as black shapes, and cards have no outline.",
                outlineMode:0,
                colorProfile:"desaturateMax",
                vectorImage:false,
                elementsMode:0,
                headerMode:0,
                colorizeIcons:false,
                iconsProfile:"default",
                cardCodeColor:"#000000",
                textCardCodeColor:"#000000"
            },
            {
                id:"STY",
                name:"Stylish",
                shortDescription:"Full color, black card outline, gradiented header.",
                description:"The stylish style. Cards are in full color, elements are color-coded, and cards have gradiented headers and heavy black borders.",
                outlineMode:1,
                colorProfile:"normal",
                vectorImage:false,
                elementsMode:2,
                headerMode:2,
                colorizeIcons:true,
                iconsProfile:"color",
                cardCodeColor:"#ffffff",
                textCardCodeColor:"#000000"
            },
        ],
        CARDBACKS=[
            {
                id:"none",
                name:"Do not print",
                description:"Do not print the cards back. All the game cards have the same back so you can keep them blank to spare some ink.",
            },{
                id:"default",
                name:"Default",
                description:"Prints the default cards back for each page, with the game logo on a gray background.",
                nodeId:"cardBackDefault"
            }
        ],
        PAPERS=[
            {
                id:"A4",
                name:"A4",
                description:"210,0mm x 297,0mm",
                width:210,
                height:297,
                marginTop:0,
                marginBottom:0,
                marginRight:0,
                marginLeft:0
            },{
                id:"A3",
                name:"A3",
                description:"297,0mm x 420,0mm",
                width:297,
                height:420,
                marginTop:0,
                marginBottom:0,
                marginRight:0,
                marginLeft:0
                
            },{
                id:"USLegal",
                name:"US Legal",
                description:"8,5in x 14,0in",
                width:215.9,
                height:355.6,
                marginTop:0,
                marginBottom:0,
                marginRight:0,
                marginLeft:0
            },{
                id:"USLetter",
                name:"US Letter",
                description:"8,5in x 11,0in",
                width:215.9,
                height:279.3,
                marginTop:0,
                marginBottom:0,
                marginRight:0,
                marginLeft:0
            }
        ]
        PROFILESBYID={},
        CARDBACKSBYID={},
        PAPERSBYID={};

    PROFILES.forEach(profile=>{
        PROFILESBYID[profile.id]=profile;
    });
    CARDBACKS.forEach(cardbacks=>{
        CARDBACKSBYID[cardbacks.id]=cardbacks;
    });
    PAPERS.forEach(paper=>{
        PAPERSBYID[paper.id]=paper;
    });

    this.PROFILES=PROFILES;
    this.PROFILESBYID=PROFILESBYID;
    this.CARDBACKS=CARDBACKS;
    this.CARDBACKSBYID=CARDBACKSBYID;
    this.PAPERS=PAPERS;
    this.PAPERSBYID=PAPERSBYID;

    this.pages=[];

    let
        cardPainter=new CardPainter(cardTools,template);

    function generatePdf( filename, pages, doc, id) {

        if (!id) id=0;

        if (!doc)
            doc = new jspdf.jsPDF({
                orientation: 'p',
                unit: 'mm',
                format: pages[0].getPaperSize()
            });

        if (pages[id]) {

            if (id>0) doc.addPage();

            let pdfNode = document.createElement("div");
            pdfNode.innerHTML=pages[id].getSVG();
            const svgElement = pdfNode.firstElementChild;
            svgElement.getBoundingClientRect();
            doc.svg(svgElement).then(()=>generatePdf(filename,pages,doc,id+1));

        } else  {

            const a = document.createElement("a");
            document.body.appendChild(a);
            a.style.display = "none";
            const blob = new Blob([doc.output('arraybuffer')], {
                type: "application/pdf"
            });
            const url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = filename;
            a.click();
            document.body.removeChild(a);
            busy=false;

        }

    }

    this.renderPrintPreview=(root)=>{
        this.pages.forEach(svg=>{
            let
                out=svg.getSVG(),
                page=document.createElement("div");
            page.style.backgroundColor="#fff";
            page.style.zIndex="10000";
            page.style.margin="10px";
            page.style.boxShadow="0px 0px 5px #333";
            page.style.display="inline-block";
            page.innerHTML=out;
            root.appendChild(page);
        })
    }

    this.downloadPdfAs=(filename)=>{
        generatePdf(filename,this.pages);
    }

    this.downloadPageSvgAs=(filename,page)=>{
        this.pages[page].downloadSVG(filename);
    }

    this.plainTextCards=(cards)=>{
        let out="";
        out+="Description: "+cards.meta.description+"\n";
        out+="Flavor text: "+cards.meta.flavorText+"\n";
        out+="\n";
        cards.deck.forEach(card=>{
            let text=cardPainter.plainTextCard(card);
            out+=text.join("\n")+"\n\n";
        })
        return out;
    }

    this.paintCards=(settings,cards,hideId)=>{
        let
            paper = settings.paper || PAPERSBYID.A4,
            printableWidth = paper.width-paper.marginLeft-paper.marginRight,
            printableHeight = paper.height-paper.marginTop-paper.marginBottom,
            cardColumns = Math.floor(printableWidth/CARDWIDTH),
            cardRows = Math.floor(printableHeight/CARDHEIGHT),
            cardsPerPage = cardColumns * cardRows,
            borderTop = paper.marginTop+((printableHeight-(CARDHEIGHT*cardRows))/2),
            borderLeft = paper.marginLeft+((printableWidth-(CARDWIDTH*cardColumns))/2),
            cardWidth = CARDWIDTH+CARDSPACING,
            cardHeight = CARDHEIGHT+CARDSPACING,
            cardsPages = Math.ceil(cards.deck.length/cardsPerPage),
            cardBacks = settings.cardBacks && (settings.cardBacks.id != "none") ? settings.cardBacks : 0;

        this.pages=[];
        for (let i=0;i<cardsPages;i++) {

            let
                backs=[],
                from=i*cardsPerPage,
                svg=new SVG(template);

            svg.setPaperSize(paper.width,paper.height);

            for (let j=0;j<cardsPerPage;j++) {
                let card=cards.deck[from+j];
                if (card) {
                    let
                        x=j%cardColumns,
                        y=Math.floor(j/cardColumns),
                        dx=borderLeft+(cardWidth*x),
                        dy=borderTop+(cardHeight*y);
                    cardPainter.paintCardAt(settings.profile,svg,dx,dy,card,hideId ? 0 : cards.meta.id);

                    if (cardBacks)
                        backs.push({
                            x:dx,
                            y:dy,
                            card:card
                        });
                }
            }

            if (backs.length) {

                svg.finalize();
                this.pages.push(svg);

                svg=new SVG(template);
                svg.setPaperSize(paper.width,paper.height);

                backs.forEach(back=>{
                    cardPainter.paintCardBackAt(cardBacks,svg,back.x,back.y,back.card);
                })

            }

            svg.finalize();
            this.pages.push(svg);
        }
    }
}