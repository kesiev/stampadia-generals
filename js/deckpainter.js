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
        PROFILESBYID={};

    PROFILES.forEach(profile=>{
        PROFILESBYID[profile.id]=profile;
    })

    this.PROFILES=PROFILES;
    this.PROFILESBYID=PROFILESBYID;
    this.pages=[];

    let
        cardPainter=new CardPainter(cardTools,template);

    function generatePdf( filename, pages, doc, id) {

        if (!id) id=0;

        if (!doc)
            doc = new jspdf.jsPDF({
                orientation: 'p',
                unit: 'mm'
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

    this.paintCards=(profile,cards,hideId)=>{
        let
            borderTop= (SHEETHEIGHT-(CARDHEIGHT*3+CARDSPACING*2))/2,
            borderLeft= (SHEETWIDTH-(CARDWIDTH*3+CARDSPACING*2))/2,
            cardWidth = CARDWIDTH+CARDSPACING,
            cardHeight = CARDHEIGHT+CARDSPACING,
            cardsPages=Math.ceil(cards.deck.length/9);

        this.pages=[];
        for (let i=0;i<cardsPages;i++) {

            let
                from=i*9,
                svg=new SVG(template);

            for (let j=0;j<9;j++) {
                let card=cards.deck[from+j];
                if (card) {
                    let
                        x=j%3,
                        y=Math.floor(j/3),
                        dx=borderLeft+(cardWidth*x),
                        dy=borderTop+(cardHeight*y);
                    cardPainter.paintCardAt(profile,svg,dx,dy,card,hideId ? 0 : cards.meta.id);
                }
            }

            svg.finalize();
            this.pages.push(svg);
        }
    }
}