function PrintShop(ENV) {

    const
        MSECPERDAY = 86400000,
        DEVMODE=1, // 0:Disabled, 1:Cheat-only, 2:Enabled
        NEWRANGE=14, // Days range to be considered new/updated.
        ITEM_IMPORT=0,
        ITEM_NEW=1,
        ITEM_UPDATED=2,
        ITEM_OLD=1000,
        DECKTYPELABELS={
            full:"Full deck",
            expansion:"Expansion"
        };

    let
        dragCounter=0,
        dragNode,
        dragNodeText,
        dropResults=[],
        hideCardId=false,
        cheatStatus=0,
        tabBar,
        devEnabled=false,
        busy=false,
        tab="modules",
        tabBarOptions=[],
        selectedStats={},
        selectedCards={},
        selectedIds={},
        selectedData=[],
        root,
        unitsCount,
        eventsCount,
        textCount,
        database,
        deckPainter,cardTools;

    function enableDev() {
        if (!devEnabled) {
            devEnabled=true;
            item=newNode("div","item","Develop",tabBar);
            item.onclick=()=>{
                if (!busy) {
                    tab="dev";
                    updatePrints();
                }
            }
            tabBarOptions.push(item);
        }
    }

    function newNode(type,className,html,into) {
        let
            node=document.createElement(type);

        if (className) node.className=className;
        if (html) node.innerHTML=html;
        if (into) into.appendChild(node);

        return node;
    }

    function setBusy(newBusy) {
        busy=newBusy;
    }

    function managePlural(value,itemSingular,itemPlural) {
        return value+" "+(value == 1 ? itemSingular : itemPlural);
    }
    
    function timeSince(date) {

        let
            nowMsec = new Date(),
            dateMsec = new Date(date.substr(0,4), date.substr(4,2)-1, date.substr(6,2)),
            seconds = Math.floor((nowMsec - dateMsec) / 1000);
            interval = seconds / 31536000;

        if (interval > 1)
            return managePlural(Math.floor(interval),"year","years")+" ago";

        interval = seconds / 2592000;
        if (interval > 1)
            return managePlural(Math.floor(interval),"month","months")+" ago";

        interval = seconds / 86400;
        if (interval > 1)
            return managePlural(Math.floor(interval),"day","days")+" ago";

        return "today";
    
    }

    function formatDate(date) {
        return date.substr(0,4)+"/"+date.substr(4,2)+"/"+date.substr(6,2);
    }

    function updateSelectedStats() {
        selectedStats={
            cards:0,
            unitCards:0,
            eventCards:0,
            textCards:0
        };

        selectedData.forEach(item=>{
            selectedStats.cards+=item.deck.length;
            selectedCards[item.meta.id].forEach(id=>{
                switch (item.deck[id][0].type) {
                    case "unit":{
                        selectedStats.unitCards++;
                        break;
                    }
                    case "event":{
                        selectedStats.eventCards++;
                        break;
                    }
                    case "text":{
                        selectedStats.textCards++;
                        break;
                    }
                }
            })
        });
    }

    function redrawSelectedStats() {
        unitsCount.innerHTML=selectedStats.unitCards+"/"+selectedStats.cards;
        eventsCount.innerHTML=selectedStats.eventCards+"/"+selectedStats.cards;
        textCount.innerHTML=selectedStats.textCards+"/"+selectedStats.cards;
    }

    selectedData.forEach(item=>{
        selectedStats.cards+=item.deck.length;
        
    });

    function addStyleSelector(into,descriptionnode) {
        let
            styleSelector=newNode("select",0,0,into);
        
        deckPainter.PROFILES.forEach(profile=>{
            let option=newNode("option",0,0,styleSelector)
            option.innerHTML=profile.name;
            option.value=profile.id;
        });
        
        styleSelector.onchange=()=>{
            let
                profile=deckPainter.PROFILESBYID[styleSelector.value];
            descriptionnode.innerHTML=profile.description;
        }

        styleSelector.onchange();

        return styleSelector;
    }

    function updatePrints() {
        let
            tableRow,table;

        tabBarOptions.forEach(item=>{
            item.className="item";
        })

        printsList.innerHTML="";
        let
            recapHeader=newNode("div","recapheader",0,printsList);

        table=newNode("div","table",0,recapHeader),
        
        tableRow=newNode("div","tablerow",0,table);

        newNode("div","tablelabel","Selected",tableRow);
        newNode("div","tablevalue",managePlural(selectedData.length,"module","modules"),tableRow);

        if (selectedStats.cards) {

            newNode("div","tablelabel","Unit Cards",tableRow);
            unitsCount=newNode("div","tablevalue",0,tableRow);

            newNode("div","tablelabel","Event Cards",tableRow);
            eventsCount=newNode("div","tablevalue",0,tableRow);

            newNode("div","tablelabel","Text Cards",tableRow);
            textCount=newNode("div","tablevalue",0,tableRow);

            redrawSelectedStats();
        
        }

        newNode("div","endtable",0,table);

        if (tab == "errors") {
            if (dropResults.length) {
                newNode("div","tips",
                    "Something went wrong with some of your card sets..."
                ,printsList); 
                dropResults.forEach(error=>{
                    newNode("div","warntips",
                        "<p><b>"+error.file+"</b></p>"+
                        "<ul><li>"+error.list.join("</li><li>")+"</li></ul>"
                    ,printsList); 
                })
            } else
                newNode("div","tips",
                    "Card sets imported successfully!"
                ,printsList); 
        } else if (selectedStats.cards)
            switch (tab) {
                case "modules":{

                    tabBarOptions[0].className="item selected";
                    selectedData.forEach(item=>{
                        let
                            row=newNode("div","row",0,printsList),
                            headerbar=newNode("div","header",0,row);
                        newNode("div","icon "+item.meta.type,0,headerbar);
                        newNode("div","title","<span class='name'>"+item.meta.name+"</span><span class='code'>"+item.meta.id+"</span>",headerbar);
                        newNode("div","description",item.meta.description,headerbar);

                        table=newNode("div","table",0,row);
                        newNode("div","tabletextrow",item.meta.flavorText,table);

                        tableRow=newNode("div","tablerow",0,table);
                        newNode("div","tablelabel","By",tableRow);
                        let authorBox=newNode("div","tablevalue",item.meta.author,tableRow);

                        if (item.meta.authorLink)
                            authorBox.innerHTML="<a target=_blank href='"+item.meta.authorLink+"'>"+item.meta.author+"</a>";

                        tableRow=newNode("div","tablerow",0,table);
                        newNode("div","tablelabel","Version",tableRow);
                        newNode("div","tablevalue",item.meta.version+" ("+CONFIG.languagesById[item.meta.language].label+")",tableRow);

                        tableRow=newNode("div","tablerow",0,table);
                        newNode("div","tablelabel","Type",tableRow);
                        newNode("div","tablevalue",DECKTYPELABELS[item.meta.type],tableRow);

                        tableRow=newNode("div","tablerow",0,table);
                        newNode("div","tablelabel","Cards",tableRow);
                        newNode("div","tablevalue",item.meta.cardsCount,tableRow);

                        tableRow=newNode("div","tablerow",0,table);
                        newNode("div","tablelabel","Date Created",tableRow);
                        newNode("div","tablevalue",formatDate(item.meta.dateCreated)+" ("+timeSince(item.meta.dateCreated)+")",tableRow);

                        tableRow=newNode("div","tablerow",0,table);
                        newNode("div","tablelabel","Date Updated",tableRow);
                        newNode("div","tablevalue",formatDate(item.meta.dateUpdated)+" ("+timeSince(item.meta.dateUpdated)+")",tableRow);

                        tableRow=newNode("div","tablerow",0,table);
                        newNode("div","tablelabel","Description",tableRow);
                        newNode("div","tablevalue",item.meta.description,tableRow);

                        newNode("div","endtable",0,table);
                        
                    });
                    break;
                }
                case "cards":{
                    tabBarOptions[1].className="item selected";

                    selectedData.forEach(item=>{
                        let
                            selectedSet=selectedCards[item.meta.id],
                            row=newNode("div","row selectable",0,printsList),
                            headerbar=newNode("div","header",0,row),
                            uiRows=[];

                        newNode("div","icon "+item.meta.type,0,headerbar);
                        newNode("div","title","<span class='name'>"+item.meta.name+"</span><span class='code'>"+item.meta.id+"</span>",headerbar);
                        newNode("div","description",item.meta.description,headerbar);

                        item.deck.forEach((card,id)=>{
                            let
                                cardName="",
                                cardId="",
                                row=newNode("div","card "+(selectedSet.indexOf(id) == -1 ? "" : "selected"),0,printsList);
                            newNode("div","icon "+card[0].type,0,row);

                            card.forEach(side=>{
                                switch (side.type) {
                                    case "text":{
                                        cardName+=side.title+" / ";
                                        break;
                                    }
                                    default:{
                                        cardName+=side.name+" / ";
                                        break;
                                    }
                                }
                                cardId+=(side.id || "NO ID") +" / ";
                            })

                            newNode("div","title","<span class='name'>"+cardName.substr(0,cardName.length-3)+"</span><span class='code'>"+cardId.substr(0,cardId.length-3)+"</span>",row);

                            row.onclick=()=>{
                                let pos=selectedSet.indexOf(id);
                                if (pos == -1) {
                                    selectedSet.push(id);
                                    row.className="card selected";
                                } else {
                                    selectedSet.splice(pos,1);
                                    row.className="card";
                                }

                                updateSelectedStats();
                                redrawSelectedStats();

                            }

                            uiRows.push(row);

                        });

                        
                        row.onclick=()=>{
                            if (selectedSet.length) {
                                selectedSet.length=0;
                                uiRows.forEach(row=>{
                                    row.className="card";
                                })
                            } else {
                                for (let i=0;i<item.deck.length;i++)
                                    selectedSet.push(i);
                                uiRows.forEach(row=>{
                                    row.className="card selected";
                                })
                            }
                            updateSelectedStats();
                            redrawSelectedStats();
                        }
                        

                    });

                    break;
                }
                case "download":{
                    tabBarOptions[2].className="item selected";

                    let
                        row=newNode("div","body",0,printsList);

                    table=newNode("div","table",0,row);

                    tableRow=newNode("div","tablerow",0,table);
                    newNode("div","tablelabel","Card style",tableRow);
                    let styleCell=newNode("div","tablevalue",0,tableRow);

                    tableRow=newNode("div","tablerow",0,table);
                    newNode("div","tablelabel",0,tableRow);
                    let styleDescription=newNode("div","tablevalue",0,tableRow);

                    newNode("div","endtable",0,table);

                    tableRow=newNode("div","tablerow",0,table);
                    newNode("div","tablelabel","Hide card ID",tableRow);
                    let
                        hideCardIdCell=newNode("div","tablevalue",0,tableRow),
                        hideCardIdInput=newNode("input","",0,hideCardIdCell);

                    hideCardIdInput.type="checkbox";
                    if (hideCardId) hideCardIdInput.checked="checked";

                    hideCardIdInput.onchange=()=>{
                        hideCardId=!!hideCardIdInput.checked;
                    }

                    tableRow=newNode("div","tablerow",0,table);
                    newNode("div","tablelabel",0,tableRow);
                    newNode("div","tablevalue","Each card has a unique ID that identifies its specific version. It's printed on their side but you may prefer to hide it.",tableRow);

                    newNode("div","endtable",0,table);

                    let
                        styleSelector=addStyleSelector(styleCell,styleDescription),
                        actionButton=newNode("div","actionbutton","Download",row);

                    actionButton.onclick=()=>{
                        let
                            profile=deckPainter.PROFILESBYID[styleSelector.value],
                            mergedDeck=cardTools.mergeDecks(selectedData,selectedCards);
                        deckPainter.paintCards(profile,mergedDeck,hideCardId);
                        deckPainter.downloadPdfAs(mergedDeck.filename+"-"+profile.id+".pdf");
                    }

                    break;
                }
                case "dev":{
                    tabBarOptions[3].className="item selected";

                    let
                        row=newNode("div","body",0,printsList);

                    table=newNode("div","table",0,row);

                    tableRow=newNode("div","tablerow",0,table);
                    newNode("div","tablelabel","Card style",tableRow);
                    let styleCell=newNode("div","tablevalue",0,tableRow);

                    tableRow=newNode("div","tablerow",0,table);
                    newNode("div","tablelabel",0,tableRow);
                    let styleDescription=newNode("div","tablevalue",0,tableRow);

                    newNode("div","endtable",0,table);

                    let
                        styleSelector=addStyleSelector(styleCell,styleDescription),
                        actionButton=newNode("div","actionbutton","Test",row);

                    
                    actionButton.onclick=()=>{

                        root.removeChild(shopRoot);
                        let testarea=new TestArea(ENV,cardTools.mergeDecks(selectedData,selectedCards),styleSelector.value,()=>{
                            root.appendChild(shopRoot);
                        });

                        testarea.run(root);
                        
                    }

                    newNode("div","warntips",
                        "<p>Here you can test your selected cards on a <i>very beta</i> virtual table: it lets you drag the cards around, it gives you some trackers, and it helps you move cards along the rows - no gameplay mechanic is implemented so you've to read the manual to play the game.</p>"+
                        "<p><b>Changes from the standard play:</b></p>"+
                        "<p>Only one-half of each card is displayed. To see the upside-down face, turn the card 2 times.</p>"+
                        "<p>Columns are marked with dashed areas instead of using some tokens as for the Lite version or cards as for the Full version.</p>"+
                        "<p>Event Cards are shuffled and turned randomly. They are kept in the discard pile instead of being added back to the bottom of their deck.</p>"+
                        "<p>Unit and Place Cards can be discarded by moving them into the discard space with any orientation and side: they will be automatically oriented correctly when shuffled.</p>"+
                        "<p>The table is set up with the first Place Card already on the "+CONFIG.languagesById.EN.dictionary.placeStack+" and your hand of cards face-up on the top-right of the play area.</p>"+
                        "<p>There is a set of colored number tokens for you to track wounds, life, and anything you want.</p>"+
                        "<p><b>Controls:</b></p>"+
                        "<p><b>Mouse:</b> Drag elements holding the left button to move them around, use the mouse right-click to turn a card or change a token color, middle-click to exhaust/restore a card, and the mouse wheel to move the elements over and behind others.</p>"+
                        "<p><b>Keyboard:</b> Use the space bar to flip a card, X/C to turn a card, E to exhaust/restore a card, D to discard a card, A/Z to move the elements over and behind others, and ESC to go back to the print shop.</p>"+
                        "<p><b>Notes:</b></p>"+
                        "<p>The virtual table needs at least a 1920&times;1080 screen to work properly. You may want to full-screen your browser window - hitting the F11 key usually does the job.</p>"
                    ,row);

                    if (selectedData.length == 1) {

                        let
                            filename=selectedData[0].meta.id+"-"+selectedData[0].meta.language+"-"+selectedData[0].meta.version+".json",
                            data=cardTools.cardsToJson(selectedData[0]);
                        table=newNode("div","table",0,row);

                        tableRow=newNode("div","tablerow",0,table);
                        newNode("div","tablelabel","Clean JSON file",tableRow);
                        let
                            downloadCell=newNode("div","tablevalue",0,tableRow);

                        cardTools.createDownload(downloadCell,filename,"application/json",data.json);

                        newNode("div","endtable",0,table);
                        
                    }

                    break;
                }
            }
        else {
            let
                body=newNode("div","body",0,printsList);
            newNode("div","header","Welcome to the",body);
            newNode("div","logo",0,body);
            newNode("div","tips",
                "<p>Here you can browse the <a target='_blank' href='"+CONFIG.homepageUrl+"'>"+CONFIG.title+"</a> online card sets catalog, select a bunch of them, cherry-pick the cards you want, and then download everything to print &amp; play!</p>"+
                "<p>Select one or more items from the list on the left to start.</p>",
                body);
            newNode("div","tips",
                "<p>Do you have some <b>custom card set</b> JSON files you want to print? Drag them from your computer into this page!</p>",
                body);

            if ((DEVMODE == 1 ) && (tab=="download")) {
                if (cheatStatus<5)
                    cheatStatus++;
                else
                    enableDev();
            }
        }
    }

    function addDeckToSelection(id,data) {
        let
            imported;
        selectedCards[id]=[];
        for (let i=0;i<data.deck.length;i++)
            selectedCards[id].push(i);
        selectedData.forEach((item,pos)=>{
            if (item.meta.id == data.meta.id) {
                imported=true;
                selectedData[pos]=data;
            }
        })
        if (!imported)
            selectedData.push(data);
        updateSelectedStats();
        updatePrints();
    }

    function addToSelection(addedItem) {
        selectedIds[addedItem.meta.id]=true;
        if (addedItem.deck)
            addDeckToSelection(addedItem.meta.id,addedItem);
        else
            cardTools.downloadDeck(addedItem.meta.id,addedItem.meta.language,(data)=>{
                addDeckToSelection(addedItem.meta.id,data);
            },setBusy)
    }

    function removeFromSelection(removedItem) {
        delete selectedIds[removedItem.meta.id];
        delete selectedCards[removedItem.meta.id];
        selectedData=selectedData.filter(item=>item.meta.id!=removedItem.meta.id);
        updateSelectedStats();
        updatePrints();
    }

    function addBullet(node,item) {
        switch (item.recentType) {
            case ITEM_IMPORT:{
                newNode("span","bullet import","Imported",node);
                break
            }
            case ITEM_NEW:{
                newNode("span","bullet new","New",node);
                break
            }
            case ITEM_UPDATED:{
                newNode("span","bullet updated","Updated",node);
                break;
            }
        }
    }

    function redrawDecksList() {
        decksList.innerHTML="";
        database.index.forEach(item=>{
            let row=newNode("div","row selectable "+(selectedIds[item.meta.id] ? "selected" : ""),0,decksList);
            newNode("div","icon "+item.meta.type,0,row);
            let title=newNode("div","title","<span class='bullet outlined'>"+item.meta.language+"</span><span class='name'>"+item.meta.name+"</span><span class='code'>"+item.meta.id+"</span>",row);
            addBullet(title,item);
            newNode("div","description",item.meta.description,row);
            row.onclick=()=>{
                if (!busy) {
                    if (selectedIds[item.meta.id]) {
                        row.className="row selectable";
                        removeFromSelection(item);
                    } else {
                        row.className="row selectable selected";
                        addToSelection(item);
                    }
                }
            }
        })
    }

    function sortDatabase() {

        let
            threshold = cardTools.dateToString(new Date(new Date().getTime() - (MSECPERDAY * NEWRANGE)))

        database.index.forEach(item=>{
            if (item.deck)
                item.recentType=ITEM_IMPORT;
            else if (item.meta.dateCreated>=threshold)
                item.recentType=ITEM_NEW;
            else if (item.meta.dateUpdated>=threshold)
                item.recentType=ITEM_UPDATED;
            else
               item.recentType=ITEM_OLD;
        })

        database.index.sort((a,b)=>{
            if (a.recentType < b.recentType) return -1;
            else if (a.recentType > b.recentType) return 1;
            else if (a.meta.type > b.meta.type) return -1;
            else if (a.meta.type < b.meta.type) return 1;
            else if (a.meta.name < b.meta.name) return -1;
            else if (a.meta.name > b.meta.name) return 1;
            else return 0;
        });
    }

    function importFiles(list,id) {
        if (id === undefined) {
            id=0;
            dropResults=[];
        } else id++;
        let file=list[id];

        if (file) {
        
            busy=true;
            dragNodeText.innerHTML="Importing "+file.name+"...";

            switch (file.type) {
                case "application/json":
                case "text/plain":{
                    var reader = new FileReader();
                    reader.onload = function (event) {
                        let cards;
                        try {
                            cards=JSON.parse(event.target.result);
                        } catch {
                            cards=0;
                        }
                        if (cards) {
                            let parsed=cardTools.cardsToJson(cards);
                            if (parsed.errors.length)
                                dropResults.push({
                                    file:file.name,
                                    list:parsed.errors
                                });
                            else {
                                let imported=false;
                                database.index.forEach((entry,pos)=>{
                                    if (entry.meta.id == cards.meta.id) {
                                        imported=true;
                                        database.index[pos]=cards;
                                    }
                                });
                                if (!imported)
                                    database.index.push(cards);
                                if (selectedCards[cards.meta.id] && selectedCards[cards.meta.id].length)
                                    addDeckToSelection(cards.meta.id,cards);
                            }
                        } else {
                            dropResults.push({
                                file:file.name,
                                list:[ "Invalid JSON structure." ]
                            });
                        }
                        importFiles(list,id);
                        console.log();
                    };
                    reader.readAsText(file);
                    break;
                }
                default:{
                    dropResults.push({
                        file:file.name,
                        list:["Invalid MIME type. Accepted: application/json, text/plain"]
                    });
                    importFiles(list,id);
                }
            }

        } else {
            dragCounter=0;
            if (dragNode.parentNode)
                dragNode.parentNode.removeChild(dragNode);

            if (dropResults.length)
                tab="errors";

            sortDatabase();
            updateSelectedStats();
            updatePrints();
            redrawDecksList();
    
            busy=false;
        }
    }

    function onFilesDropped(e) {        
        e.preventDefault();
        importFiles(e.dataTransfer.files);
    }

    function onFilesDragEnter(e) {
        if (!busy) {
            dragCounter++;
            if (dragCounter==1) {
                dragNodeText.innerHTML="Drop to import these card sets...";
                shopRoot.appendChild(dragNode);
            }
        }
    }

    function onFilesDragLeave(e) {
        if (!busy) {
            dragCounter--;
            if (!dragCounter) {
                if (dragNode.parentNode)
                    dragNode.parentNode.removeChild(dragNode);
            }
        }
    }

    function onFilesDragOver(e) {
        e.preventDefault();
    }

    let
        decksList;

    this.run=(rootnode)=>{

        document.title = CONFIG.title+" - Print Shop";

        root=rootnode;
        const template=new SVGTemplate(ENV.templatesRoot+"model.svg",true);
        template.load(()=>{

            cardTools=new CardTools(ENV);
            deckPainter=new DeckPainter(cardTools,template);
            shopRoot = newNode("div","shoproot",0,root);
            dragNode = newNode("div","dragging");

            dragNodeText = newNode("div","content",0,dragNode);

            shopRoot.addEventListener("drop",onFilesDropped);
            shopRoot.addEventListener("dragover",onFilesDragOver);
            shopRoot.addEventListener("dragenter",onFilesDragEnter);
            shopRoot.addEventListener("dragleave",onFilesDragLeave);

            let
                leftSide = newNode("div","side left",0,shopRoot),
                rightSide = newNode("div","side right",0,shopRoot),
                item;
            
            tabBar = newNode("div","tabbar",0,rightSide),

            [
                { id:"modules", label:"Modules" },
                { id:"cards", label:"Cards" },
                { id:"download", label:"Download" }
            ].forEach(section=>{
                item=newNode("div","item",section.label,tabBar);
                item.onclick=()=>{
                    if (!busy) {
                        tab=section.id;
                        updatePrints();
                    }
                }
                tabBarOptions.push(item);
            });

            if (DEVMODE == 2) enableDev();

            decksList = newNode("div","list decks",0,leftSide);
            printsList = newNode("div","list prints",0,rightSide);

            cardTools.downloadDatabase((data)=>{
                database=data;
                sortDatabase();

                redrawDecksList();
                updatePrints();
            },setBusy)
        });

    }

}