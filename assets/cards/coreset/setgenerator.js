function SetGenerator(ENV,cardTools,isFullDeck) {

    function copySet(set,times) {
        let out=[];
        for (let i=0;i<times;i++)
            set.forEach(item=>{
                out.push(item)
            });
        return out;
    }

    const
        // Metadata
        DECK_LANGUAGE="EN",
        DECK_ID=isFullDeck ? CONFIG.fullCoreDeckId : CONFIG.liteCoreDeckId,
        DECK_TYPE="full",
        DECK_VERSION="1.0",
        DECK_CREATED="20231107",
        DECK_NAME=CONFIG.title+(isFullDeck?" Full":" Lite")+" Core Set",
        DECK_DESCRIPTION=
            isFullDeck?
                "A set of 60 Units, 60 Places, 60 Events, and a quick reference card to play the game's full version."
            :
                "A set of 24 Units, 24 Places, and a quick reference card to play the game's lite version.",
        DECK_FLAVORTEXT="The Sacred Printer will keep printing Units and send them against you, so you've to hold your ground... By stealing its paper and printing your army!",
        DECK_AUTHOR="KesieV",
        
        // Illustrations
        ILLUSTRATIONS_FILE=ENV.imagesRoot+"illustrations.png",
        ILLUSTRATION_INDEX={
            fire_recruit:{ x:0, y:0 },
            water_wall:{ x:1, y:0 },
            air_lizard:{ x:2, y:0 },
            earth_antcolony:{ x:3, y:0 },
            magma_flare:{ x:4, y:0 },
            lightning_turret:{ x:5, y:0 },
            ice_snowman:{ x:6, y:0 },
            mud_perfectstatue:{ x:7, y:0 },
            water_trench:{ x:8, y:0 },
            air_wyvern:{ x:9, y:0 },
            earth_cocoon:{ x:0, y:1 },
            lightning_plasmasphere:{ x:1, y:1 },
            mud_invertedstatue:{ x:2, y:1 },
            air_privateelite:{ x:3, y:1 },
            earth_privateelite:{ x:4, y:1 },
            fire_privatemage:{ x:5, y:1 },
            water_privatemage:{ x:6, y:1 },
            fire_soldier:{ x:7, y:1 },
            ice_soldier:{ x:8, y:1 },
            magma_thrower:{ x:9, y:1 },
            air_sergeantelite:{ x:0, y:2 },
            earth_sergeantelite:{ x:1, y:2 },
            earth_parasite:{ x:2, y:2 },
            magma_genie:{ x:3, y:2 },
            ice_giant:{ x:4, y:2 },
            mud_unitsculptor:{ x:5, y:2 },
            air_dragon:{ x:6, y:2 },
            water_fort:{ x:7, y:2 },
            fire_sergeantmage:{ x:8, y:2 },
            water_sergeantmage:{ x:9, y:2 },
            air_sergeantmajorelite:{ x:0, y:3 },
            earth_sergeantmajorelite:{ x:1, y:3 },
            fire_sergeantmajormage:{ x:2, y:3 },
            water_sergeantmajormage:{ x:3, y:3 },
            lightning_sniper:{ x:4, y:3 },
            fire_berserker:{ x:5, y:3 },
            event_printer:{ x:6, y:3 },
            event_printer_raging:{ x:7, y:3 },
            event_treeman:{ x:8, y:3 },
            event_computerman:{ x:9, y:3 },
            event_chest_water:{ x:0, y:4 },
            event_chest_fire:{ x:1, y:4 },
            event_chest_earth:{ x:2, y:4 },
            event_chest_air:{ x:3, y:4 },
            event_clown_jump:{ x:4, y:4 },
            event_clown_dance:{ x:5, y:4 },
            event_tree_blessed:{ x:6, y:4 },
            event_tree_cursed:{ x:7, y:4 },
            event_saint_higher:{ x:8, y:4 },
            event_saint_lower:{ x:9, y:4 },
            event_gambler:{ x:0, y:5 },
            event_gambler_bloody:{ x:1, y:5 },
            event_puzzle_pipes:{ x:2, y:5 },
            event_puzzle_hourglass:{ x:3, y:5 },
            event_critters:{ x:4, y:5 },
            event_guardian:{ x:5, y:5 },
            event_shopkeeper:{ x:6, y:5 },
            event_insurance:{ x:7, y:5 },
            event_mercenary:{ x:8, y:5 },
            event_bard:{ x:9, y:5 },
            event_card_golem:{ x:0, y:6 },
            event_card_manticore:{ x:1, y:6 },
            event_card_hellhound:{ x:2, y:6 },
            event_card_siren:{ x:3, y:6 },
            event_trainer_strength:{ x:4, y:6 },
            event_trainer_endurance:{ x:5, y:6 },
            event_king:{ x:6, y:6 },
            event_oldsage:{ x:7, y:6 },
            event_necromancer:{ x:8, y:6 },
            event_knife:{ x:9, y:6 },
            event_timemachine:{ x:0, y:7 },
            event_teleporter:{ x:1, y:7 },
            event_chased_prince:{ x:2, y:7 },
            event_chased_queen:{ x:3, y:7 },
            event_timeloop_breaker:{ x:4, y:7 },
            event_timeloop_defender:{ x:5, y:7 },
        },

        // Basic values
        PLACE_LEVEL=2,
        BASE_LIFE=1,
        BASE_ATTACK=1,
        NO_ATTACK=0,
        NO_LIFE=1,
        SUPPORT_ATTACK=2,
        SUPPORT_LIFE=2,
    
        // Common text
        ELEMENT_BOOST="Infuse with this Element.",
        ATTACK_AND_WOUND="attacks and adds {wound} to a Unit";

    // Core set events
    const
        rawEvents=[
            // Event - The Printer: the story event.
            [
                { level:-1, name:"Sacred Printer", illustration:"event_printer", description:"Touch the Printer Deck.", flavorText:"\"The Sacred Printer... is printing an entire army against me!\"" },
                { level:-2, name:"Overloaded Printer", illustration:"event_printer_raging", description:"Accept your destiny. (When you win this battle: tear up this card)", flavorText:"\"There is no other choice... destroy it!\"", boostDescription:"From now on: {level} is 7." },
            ],
            // Event - The Scary Guests: two guests from another world.
            [
                { level:-1, name:"Tree Man", illustration:"event_treeman", description:"When discarding 1 of your defeated Units: draw 1 of its Unit Cards.", flavorText:"\"Take this card. It's a memento of your failure.\"" },
                { level:-1, name:"Computer Man", illustration:"event_computerman", description:"When 1 of your Units attacks: infuse it with 1 Element of your choice.", flavorText:"\"It was a weak card. Total lack of synergy.\"" },
            ],
            // Event - The Elemental Chests: discard element cards for an effect.
            [
                { level:0, name:"Water Chest", illustration:"event_chest_water", description:"Discard 2 {water} Unit Cards: draw 3 cards.", flavorText:"\"From Water, I was born.\"" },
                { level:-1, name:"Fire Chest", illustration:"event_chest_fire", description:"Discard 1 {fire} Unit Card: discard 1 Unit Card from any {CONFIG.enemyUnit}.", flavorText:"\"With Fire, I leave my mark.\"" },
            ],
            [
                { level:1, name:"Earth Chest", illustration:"event_chest_earth", description:"Discard 2 {earth} Unit Cards: draw 1 card and put it on a {CONFIG.playerRow} empty {CONFIG.space}.", flavorText:"\"From the Earth, the messenger is born naked.\"" },
                { level:2, name:"Air Chest", illustration:"event_chest_air", description:"Discard 2 {air} Unit Cards.", flavorText:"\"In the Air, my message flies.\"" },
            ],
            // Event - The Clowns: discard cards to move units.
            [
                { level:0, name:"Jumping Clown", illustration:"event_clown_jump", description:"Discard 1 Unit Card: move 1 of your Units to another {CONFIG.playerRow} empty {CONFIG.space}.", flavorText:"\"Nice jump, Unit!\"" },
                { level:0, name:"Dancing Clown", illustration:"event_clown_dance", description:"Discard 1 Unit Card: move 1 {CONFIG.enemyUnit} in front of 1 of your Units to another empty {CONFIG.space}.", flavorText:"\"Nice dancing, Unit!\"" },
            ],
            // Event - The Trees: use cards to heal.
            [
                { level:-1, name:"Blessed Tree", illustration:"event_tree_blessed", description:"Select 1 Unit Card from hand: add it face down to your {CONFIG.life}.", flavorText:"You pick a Fruit from a blooming tree. It's so sweet." },
                { level:1, name:"Cursed Tree", illustration:"event_tree_cursed", description:"Lose 1 {CONFIG.life}.", flavorText:"You pick a Fruit from a rotten tree. It's so bitter." },
            ],
            // Event - The Saints: they will heal you if you're in danger.
            [
                { level:-2, name:"Higher Saint", illustration:"event_saint_higher", description:"You have 2 {CONFIG.life} or less: gain 1 {CONFIG.life}.", flavorText:"\"May the Gods be with you.\"" },
                { level:-1, name:"Lower Saint", illustration:"event_saint_lower", description:"You have 1 {CONFIG.life} or less: gain 1 {CONFIG.life}.", flavorText:"\"Let me help you.\"" },
            ],
            // Event - The Stores: swap cards with new ones or gain cards at a cost.
            [
                { level:0, name:"Shopkeeper", illustration:"event_shopkeeper", description:"Discard 1 Unit Card: draw 3 cards, pick 1, discard the other 2.", flavorText:"\"Hee hee... Thank you...\"" },
                { level:-1, name:"Insurance Service", illustration:"event_insurance", description:"Draw 2 cards.", flavorText:"\"Stampadia Insurance Service. Welcome!\"" },
            ],
            // Event - The Hordes: add enemies to the incoming row.
            [
                { level:2, name:"Critters", illustration:"event_critters", description:"Print level 1 Units on all {CONFIG.incomingRow} empty {CONFIG.spacePlural}.", flavorText:"\"Meat! Meat! Meat!\"" },
                { level:2, name:"Guardian", illustration:"event_guardian", description:"Select 1 {CONFIG.incomingRow} empty {CONFIG.space}: print a level 6 Unit there.", flavorText:"\"Let me pass, adventurer! I've to save the monks!\"" },
            ],
            // Event - The Gamblers: guess to gain a prize.
            [
                { level:0, name:"Gambler", illustration:"event_gambler", description:"Declare 1 Element: discard Printer Deck top card, draw 1 if the new top card infuses that Element.", flavorText:"\"Wanna play?\"" },
                { level:1, name:"Bloody Gambler", illustration:"event_gambler_bloody", description:"Declare 1 Element: discard Printer Deck top card, draw 2 if the new top card infuses that Element. Else, lose 1 {CONFIG.life}." },
            ],
            // Event - The Puzzles: discard elements to draw new cards.
            [
                { level:1, name:"Steam Puzzle", illustration:"event_puzzle_pipes", description:"Discard 1 {fire} and 1 {water} Unit Cards: draw 2 cards.", flavorText:"You see a complex system of disconnected brass pipes." },
                { level:1, name:"Sand Puzzle", illustration:"event_puzzle_hourglass", description:"Discard 1 {earth} and 1 {air} Unit Cards: draw 2 cards.", flavorText:"You see an hourglass surrounded by metal spheres." },
            ],
            // Event - The Supporters: discard elements to draw new cards.
            [
                { level:0, name:"Mercenary", illustration:"event_mercenary", description:"Discard 1 Unit Card: put this card in any empty {CONFIG.space}. On defeat: add this card to {CONFIG.placeStack}.", flavorText:"\"These lands are so rad!\"", attack: 2, life:2 },
                { level:0, name:"Bard", illustration:"event_bard", description:"Discard 1 Unit Card: add this card to 1 of your Units. On defeat: add this card to {CONFIG.placeStack}.", flavorText:"\"Lai la la...\"", boostAttack:1, boostLife:1 }, // cit. Walter il raccoglimele
            ],
            // Event - The Trainers: play with a debuff to get an advantage.
            [
                { level:0, name:"Strength Trainer", illustration:"event_trainer_strength", description:"Add this card to 1 of your Units with {attack}>1. On defeat: add this card to {CONFIG.placeStack}, draw 1 card.", flavorText:"\"Save your strength!\"", boostAttack:-1 },
                { level:0, name:"Endurance Trainer", illustration:"event_trainer_endurance", description:"Add this card to 1 of your Units with {life}>1. On defeat: add this card to {CONFIG.placeStack}, draw 1 card.", flavorText:"\"Grit your teeth!\"", boostLife:-1 },
            ],
            // Event - The Beastcrafters Cards: play an element card to gain a buff.
            [
                { level:0, name:"Golem Card", illustration:"event_card_golem", description:"Discard 1 {air} Unit Card.", flavorText:"Stampadians used to play a simple trading card game probably called The Beastcrafters.", boostTrigger:"onAll", boostDescription:ELEMENT_BOOST, boostSymbol:"earth", boostSymbolAmount:1 },
                { level:0, name:"Manticore Card", illustration:"event_card_manticore", description:"Discard 1 {fire} Unit Card.", flavorText:"Stampadians used to play a simple trading card game probably called The Beastcrafters.", boostTrigger:"onAll", boostDescription:ELEMENT_BOOST, boostSymbol:"air", boostSymbolAmount:1 },
            ],
            [
                { level:0, name:"Hellhound Card", illustration:"event_card_hellhound", description:"Discard 1 {water} Unit Card.", flavorText:"Stampadians used to play a simple trading card game probably called The Beastcrafters.", boostTrigger:"onAll", boostDescription:ELEMENT_BOOST, boostSymbol:"fire", boostSymbolAmount:1 },
                { level:0, name:"Siren Card", illustration:"event_card_siren", description:"Discard 1 {earth} Unit Card.", flavorText:"Stampadians used to play a simple trading card game probably called The Beastcrafters.", boostTrigger:"onAll", boostDescription:ELEMENT_BOOST, boostSymbol:"water", boostSymbolAmount:1 },
            ],
            // Event - The Escort Mission: keep the event in your life cards, activate them when you lose it.
            [
                { level:-1, name:"Lost King", illustration:"event_king", description:"You have less than {CONFIG.lifeLimit} {CONFIG.life}: shuffle this card face down with {CONFIG.lifeCardPlural}, draw 1 card. When lost: add this card to {CONFIG.placeStack}." },
                { level:-1, name:"Lost Old Sage", illustration:"event_oldsage", description:"You have less than {CONFIG.lifeLimit} {CONFIG.life}: shuffle this card face down with {CONFIG.lifeCardPlural}. When lost: add this card to {CONFIG.placeStack}, draw 2 cards." },
            ],
            // Event - The Unit Pickers: pick cards from deployed units.
            [
                { level:-1, name:"Necromancer", illustration:"event_necromancer", description:"Select 1 of your Units: discard its bottom card and draw the remaining cards if any.", flavorText:"\"Live again, my little Unit!\"" },
                { level:-1, name:"Cerimonial Knife", illustration:"event_knife", description:"Select 1 {CONFIG.enemyUnit}: discard its bottom card.", flavorText:"\"The word of Preuk helped.\" - Ancient Book" },
            ],
            // Event - The Teleports: move enemy units around.
            [
                { level:0, name:"Time Machine", illustration:"event_timemachine", description:"Select 1 Unit from the {CONFIG.frontRow}: move it back to the {CONFIG.incomingRow}.", flavorText:"The hostile Unit vanishes into thin air." },
                { level:0, name:"Teleporter", illustration:"event_teleporter", description:"Select 1 Unit from the {CONFIG.frontRow}: move it to another empty {CONFIG.space} of the {CONFIG.frontRow}.", flavorText:"The enemy disappears..." },
            ],
            // Event - The Shield Breakers: move enemy units around.
            [
                { level:1, name:"Chased Prince", illustration:"event_chased_prince", description:"In Recover Phase, have 1 or more shields: discard all shields.", flavorText:"\"Nice reflexes! Thank you for saving me, adventurer!\"" },
                { level:0, name:"Chased Queen", illustration:"event_chased_queen", description:"In Recover Phase, have 1 or more shields: discard all shields, draw 1 card.", flavorText:"\"Take this. You've defended the royal family!\"" },
            ],
            // Event - The Life Savers: if you die now, you will survive.
            [
                { level:-2, name:"Time Loop Breaker", illustration:"event_timeloop_breaker", description:"When you are defeated: draw 2 cards and keep playing.", flavorText:"\"I've to break this loop!\"" },
                { level:0, name:"Time Loop Defender", illustration:"event_timeloop_defender", description:"When you are defeated: turn this card and the game is over.", flavorText:"\"The loop must go on!\"" },
            ]
        ];
    
    // Core set units
    const
        rawUnits=[
            { // {FIRE} {[BASIC ATTACK] Attack-based} [SPECIAL SOLDIERS]
                boosts:[
                    // --- Lv.1
                    [
                        // Attack
                        { level:1, attack:1, trigger:"onAttack", condition:"{fire}{fire}", description:"+{x}{attack}" },
                        { level:1, attack:1, symbol:"fire", symbolAmount:1, doNotMerge:true },
                        // { symbol:"fire", symbolAmount:2, doNotMerge:true }, // Extra
                    ],
                    // --- Lv.2
                    [
                        // Attack
                        { level:2, attack:1, trigger:"onAttack", condition:"{fire}{fire}", description:"+{x}{attack}", symbol:"fire", symbolAmount:1 },
                        { level:2, attack:2 }
                    ], // Lv.2
                    // --- Lv.3
                    [
                        // Attack
                        { level:3, attack:1, trigger:"onAttack", condition:"{fire}{fire}", description:"+{x}{attack}", symbol:"fire", symbolAmount:1, doNotMerge:true },
                        { level:3, attack:2, life:1, symbol:"fire", symbolAmount:2, doNotMerge:true }
                    ],
                ],
                bodies:[
                    [ // Lv.1
                        { name:"Fire Recruit", illustration:"fire_recruit", attack:BASE_ATTACK, life:BASE_LIFE, symbol:"fire", symbolAmount:1 }
                    ], 
                    [ // Lv.2
                        { name:"Fire Soldier", illustration:"fire_soldier", attack:BASE_ATTACK+1, life:BASE_LIFE, symbol:"fire", symbolAmount:1 }
                    ],
                    [ // Lv.3
                        { name:"Fire Berserker", illustration:"fire_berserker", attack:BASE_ATTACK+2, life:BASE_LIFE, symbol:"fire", symbolAmount:1 }
                    ]
                ]
            },
            { // {WATER} {[BASIC LIFE] Defense-based} [WALLS]
                boosts:[
                    // --- Lv.1
                    [
                        // Attack
                        { level:1, life:1, trigger:"onLife", condition:"{water}{water}", description:"+{x}{life}" },
                        { level:1, life:1, symbol:"water", symbolAmount:1, doNotMerge:true }
                    ],
                    // --- Lv.2
                    [
                        // Attack
                        { level:2, life:1, trigger:"onLife", condition:"{water}{water}", description:"+{x}{life}", symbol:"water", symbolAmount:1 },
                        { level:2, life:2 }
                    ], // Lv.2
                    // --- Lv.3
                    [
                        // Attack
                        { level:3, life:1, trigger:"onLife", condition:"{water}{water}", description:"+{x}{life}", symbol:"water", symbolAmount:1, doNotMerge:true },
                        { level:3, life:2, attack:1, symbol:"water", symbolAmount:2, doNotMerge:true }
                    ],
                ],
                bodies:[
                    [ // Lv.1
                        { name:"Wall", illustration:"water_wall", attack:BASE_ATTACK, life:BASE_LIFE, symbol:"water", symbolAmount:1 }
                    ], 
                    [ // Lv.2
                        { name:"Trench", illustration:"water_trench", attack:BASE_ATTACK, life:BASE_LIFE+1, symbol:"water", symbolAmount:1 }
                    ],
                    [ // Lv.3
                        { name:"Fort", illustration:"water_fort", attack:BASE_ATTACK, life:BASE_LIFE+2, symbol:"water", symbolAmount:1 }
                    ]
                ]
            },
            { // {AIR} {[BASIC ATTACK] Movement/Multirow-based} [DRAGONS]
                boosts:[
                    // --- Lv.1
                    [
                        // Attack - no condition
                        { level:1, attack:1, trigger:"onAttack", condition:"{air}{air}", description:"{CONFIG.jump} {x} {CONFIG.spacePlural} {right}"  },
                        { level:1, attack:1, trigger:"onAttack", condition:"{air}{air}", description:"{CONFIG.jump} {x} {CONFIG.spacePlural} {left}" }
                    ],
                    // --- Lv.2
                    [
                        // Attack
                        { level:2, attack:1,  trigger:"onAttack", symbol:"air", condition:"{air}{air}", description:"{CONFIG.jump} to highest {attack} {CONFIG.enemyUnit}.", symbolAmount:1 },
                        { level:2, attack:1,  trigger:"onAttack", symbol:"air", condition:"{air}{air}", description:"{CONFIG.jump} to lowest {attack} {CONFIG.enemyUnit}.", symbolAmount:1 }
                    ], // Lv.2
                    // --- Lv.3
                    [
                        // Attack
                        { level:3, attack:1, trigger:"onAttack", condition:"{air}{air}", description:"{CONFIG.jump} to lowest {life} {CONFIG.enemyUnit}.", symbol:"air", symbolAmount:1, doNotMerge:true },
                        { level:3, attack:1, trigger:"onDefend", condition:"{air}{air}", description:"{defeat} this Unit and {around}", symbol:"air", symbolAmount:1, doNotMerge:true }
                    ]
                ],
                bodies:[
                    [ // Lv.1
                        { name:"Lizard", illustration:"air_lizard", trigger:"onAttack", attack:BASE_ATTACK, life:BASE_LIFE, description:"Attack {frontsides} instead.", symbol:"air", symbolAmount:1 }
                    ], 
                    [ // Lv.2
                        { name:"Wyvern", illustration:"air_wyvern", trigger:"onAttack", attack:BASE_ATTACK, life:BASE_LIFE, description:"If this Unit "+ATTACK_AND_WOUND+", {defeat} that Unit.", symbol:"air", symbolAmount:1 }
                    ],
                    [ // Lv.3
                        { name:"Dragon", illustration:"air_dragon", attack:BASE_ATTACK, life:BASE_LIFE, trigger:"onAll", description:"{CONFIG.jumpPlural} may swap places with allies.", symbol:"air", symbolAmount:1 }
                    ]
                ]
            },
            { // {EARTH} {[BASIC LIFE] Poison/Copy/Debuff-based} [INSECTS]
                boosts:[
                    // --- Lv.1
                    [
                        // Attack - no condition
                        { level:1, life:1, trigger:"onFront", condition:"{earth}{earth}", description:"-1{life} to {front}" },
                        { level:1, life:1, trigger:"onFront", condition:"{earth}{earth}", description:"-1{attack} to {front}" }
                    ],
                    // --- Lv.2
                    [
                        // Attack
                        { level:2, life:1, trigger:"onFront", condition:"{earth}{earth}", description:"-{x}{life} to {front}", symbol:"earth", symbolAmount:1 },
                        { level:2, life:1, trigger:"onFront", condition:"{earth}{earth}", description:"-{x}{attack} to {front}", symbol:"earth", symbolAmount:1 }
                    ], // Lv.2
                    // --- Lv.3
                    [
                        // Attack
                        { level:3, life:1, trigger:"onFront", condition:"{earth}{earth}", description:"-{x+1}{life} to {front}", symbol:"earth", symbolAmount:1,  doNotMerge:true },
                        { level:3, life:1, trigger:"onFront", condition:"{earth}{earth}", description:"-{x+1}{attack} to {front}", symbol:"earth", symbolAmount:1,  doNotMerge:true }
                    ],
                ],
                bodies:[
                    [ // Lv.1
                        { name:"Ant Colony", illustration:"earth_antcolony", trigger:"onAttack", attack:BASE_ATTACK, life:BASE_LIFE, description:"Attack twice.", symbol:"earth", symbolAmount:1 }
                    ], 
                    [ // Lv.2
                        { name:"Cocoon", illustration:"earth_cocoon", trigger:"onDefeat", attack:BASE_ATTACK, life:BASE_LIFE, description:"Discard this card, remove all {wound}, and keep the Unit.", symbol:"earth", symbolAmount:1 }
                    ],
                    [ // Lv.3
                        { name:"Parasite", illustration:"earth_parasite", trigger:"onDefeat", attack:BASE_ATTACK, life:BASE_LIFE, description:"Discard this card, remove all {wound}, move or merge remaining cards with {front}", symbol:"earth", symbolAmount:1 }
                    ]
                ]
            },
        ],
        fullRawUnits=[
            { // {EARTH + FIRE = MAGMA} {[BASIC ATTACK, SPECIAL:1-3] Poison/Copy/Debuff-based + Attack-based} [FIRE UNITS]
                boosts:[
                    // --- Lv.1
                    [
                        // Attack - no condition
                        { level:1, attack:1, trigger:"onDefend", condition:"{earth}{fire}", description:"Add 1{wound} to {front}" },
                        { level:1, attack:1, trigger:"onDefend", condition:"{earth}{fire}", description:"Add 1{wound} to {front}" }
                    ],
                    // --- Lv.2
                    [
                        // Attack
                        { level:2, attack:1, trigger:"onDefend", condition:"{earth}{fire}", description:"Add {x}{wound} to {front}", symbol:"fire", symbolAmount:1 },
                        { level:2, attack:1, trigger:"onDefend", condition:"{earth}{fire}", description:"Add {x}{wound} to {front}", symbol:"earth", symbolAmount:1 }
                    ], // Lv.2
                    // --- Lv.3
                    [
                        // Attack
                        { level:3, attack:1, trigger:"onDefend", condition:"{earth}{earth}", description:"Add {x+1}{wound} to {front}", symbol:"fire", symbolAmount:1, doNotMerge:true },
                        { level:3, attack:1, trigger:"onDefend", condition:"{fire}{fire}", description:"Add {x+1}{wound} to {front}", symbol:"earth", symbolAmount:1, doNotMerge:true }
                    ],
                ],
                bodies:[
                    [ // Lv.1
                        { name:"Flare", illustration:"magma_flare", trigger:"onAttack", attack:SUPPORT_ATTACK, life:NO_LIFE, description:"If this Unit "+ATTACK_AND_WOUND+", {CONFIG.exhaust} that Unit and {defeat} this Unit." }
                    ], 
                    [ // Lv.2
                        { name:"Magma Thrower", illustration:"magma_thrower", attack:BASE_ATTACK, life:BASE_LIFE } // , description:"Defeat check: if this unit attacked another unit, exhaust them and discard this card"
                    ],
                    [ // Lv.3
                        { name:"Genie", illustration:"magma_genie", trigger:"onAttack", attack:SUPPORT_ATTACK, life:NO_LIFE, description:"If this Unit "+ATTACK_AND_WOUND+", {CONFIG.exhaust} that Unit and discard this card." }
                    ]
                ]
            },
            { // {AIR + FIRE = LIGHTNING} {[BASIC ATTACK, SPECIAL:1-2] Movement/Multirow-based + Attack-based} [ELECTRIC UNITS]
                boosts:[
                    // --- Lv.1
                    [
                        // Attack - no condition
                        { level:1, attack:1, trigger:"onAttack", condition:"{air}{fire}", description:"Add {x}{wound} to {frontleft}" },
                        { level:1, attack:1, trigger:"onAttack", condition:"{air}{fire}", description:"Add {x}{wound} to {frontright}" }
                    ],
                    // --- Lv.2
                    [
                        // Attack
                        { level:2, attack:1, trigger:"onAttack", condition:"{air}{fire}", description:"Add 1{wound} to {x} {frontleft}" , symbol:"air", symbolAmount:1 },
                        { level:2, attack:1, trigger:"onAttack", condition:"{air}{fire}", description:"Add 1{wound} to {x} {frontright}" , symbol:"fire", symbolAmount:1 }
                    ], // Lv.2
                    // --- Lv.3
                    [
                        // Attack
                        { level:3, attack:1, trigger:"onAttack", condition:"{fire}{fire}", description:"Add {x}{wound} to highest {attack} {CONFIG.enemyUnit}.", symbol:"air", symbolAmount:1, doNotMerge:true },
                        { level:3, attack:1, trigger:"onAttack", condition:"{air}{air}", description:"Add {x}{wound} to lowest {life} {CONFIG.enemyUnit}.", symbol:"fire", symbolAmount:1, doNotMerge:true }
                    ],
                ],
                bodies:[
                    [ // Lv.1
                        { name:"Thunder Turret", illustration:"lightning_turret", trigger:"onAttack", attack:SUPPORT_ATTACK, life:NO_LIFE, description:"After its first attack, merge this card with this Unit and attack again if possible or it has no effect." },
                    ], 
                    [ // Lv.2
                        { name:"Plasma Sphere", illustration:"lightning_plasmasphere", trigger:"onAttack", attack:SUPPORT_ATTACK, life:NO_LIFE, description:"Draw 1 Place Card, attack its Print {CONFIG.spacePlural} on {CONFIG.opposingRow} instead, discard Place Card." }
                    ],
                    [ // Lv.3
                        { name:"Bolt Sniper", illustration:"lightning_sniper", attack:BASE_ATTACK, life:BASE_LIFE }
                    ]
                ]
            },
            
            { // {AIR + WATER = ICE} { [BASIC LIFE, SPECIAL:1-3] Movement/Multirow-based + Defense-based} [ICE UNITS]
                boosts:[
                    // --- Lv.1
                    [
                        // Attack - no condition
                        { level:1, life:1, trigger:"onAttack", condition:"{air}{water}", description:"Move here up to 1{wound} from {sides}" },
                        { level:1, life:1, trigger:"onAttack", condition:"{air}{water}", description:"Move here up to 1{wound} from {sides}" }
                    ],
                    // --- Lv.2
                    [
                        // Attack
                        { level:2, life:1, trigger:"onAttack", condition:"{air}{water}", description:"Move here up to 2{wound} from {sides}", symbol:"air", symbolAmount:1 },
                        { level:2, life:1, trigger:"onAttack", condition:"{air}{water}", description:"Move here up to 2{wound} from {sides}", symbol:"water", symbolAmount:1 }
                    ], // Lv.2
                    // --- Lv.3
                    [
                        // Attack
                        { level:3, life:1, trigger:"onAttack", condition:"{air}{air}", description:"Move here up to 3{wound} from {sides}", symbol:"air", symbolAmount:1, doNotMerge:true },
                        { level:3, life:1, trigger:"onAttack", condition:"{water}{water}", description:"Move here up to 3{wound} from {sides}", symbol:"water", symbolAmount:1, doNotMerge:true }
                    ],
                ],
                bodies:[
                    [ // Lv.1
                        { name:"Snowman", illustration:"ice_snowman", attack:NO_ATTACK, life:SUPPORT_LIFE, area:true, trigger:"onDefend", description:"Any {CONFIG.allyUnit}: do not get any {wound}, {defeat} this Unit now." }
                    ], 
                    [ // Lv.2
                        { name:"Ice Soldier", illustration:"ice_soldier", attack:BASE_ATTACK, life:BASE_LIFE } // description:"Any ally {defeat}: keep {wound} on that unit, {defeat} this unit now instead."
                    ],
                    [ // Lv.3
                        { name:"Frost Giant", illustration:"ice_giant", attack:NO_ATTACK, life:SUPPORT_LIFE, area:true, trigger:"onDefeat", description:"Any {CONFIG.allyUnit}: keep {wound} on that Unit, discard this card instead." }
                    ]
                ]
            },
            { // {EARTH + WATER = MUD} {[BASIC LIFE, SPECIAL:1-2] [STATUE UNITS] Poison/Copy/Debuff-based + Defense-based}
                boosts:[
                    // --- Lv.1
                    [
                        // Attack - no condition
                        { level:1, life:1, trigger:"onAll", condition:"{earth}{water}", description:"{x} times, -1{attack}, +1{life}" },
                        { level:1, life:1, trigger:"onAll", condition:"{earth}{water}", description:"{x} times, -1{life}, +1{attack}" }
                    ],
                    // --- Lv.2
                    [
                        // Attack
                        { level:2, life:1, trigger:"onAll", condition:"{earth}{water}", description:"{x} times, -1{attack} this Unit and {front}", symbol:"earth", symbolAmount:1 },
                        { level:2, life:1, trigger:"onAll", condition:"{earth}{water}", description:"{x} times, -1{life} this Unit and {front}", symbol:"water", symbolAmount:1 }
                    ], // Lv.2
                    // --- Lv.3
                    [
                        // Attack
                        { level:3, life:1, trigger:"onAll", condition:"{earth}{earth}", description:"+{x}{attack}, +{x}{life}", symbol:"earth", symbolAmount:1, doNotMerge:true },
                        { level:3, life:1, trigger:"onAll", condition:"{water}{water}", description:"+{x}{attack}, +{x}{life}", symbol:"water", symbolAmount:1, doNotMerge:true }
                    ],
                ],
                bodies:[
                    [ // Lv.1
                        { name:"Perfect Statue", illustration:"mud_perfectstatue", attack:NO_ATTACK, life:SUPPORT_LIFE, area:true, trigger:"onAll", description:"This text is the same as {front}. If copied, this effect text is blank." }
                    ], 
                    [ // Lv.2
                        { name:"Inverted Statue", illustration:"mud_invertedstatue",  attack:NO_ATTACK, life:SUPPORT_LIFE, trigger:"onAll", description:"Swap this Unit {attack} and {life} column values." }
                    ],
                    [ // Lv.3
                        { name:"Unit Sculptor", illustration:"mud_unitsculptor", attack:BASE_ATTACK, life:BASE_LIFE }
                    ]
                ]
            },

            { // {AIR + EARTH = DUST/SAND} {[BASIC ATTACK+LIFE] NO SPECIALS} [MILITARY GRADES?] Higher stats, no skills
                boosts:[
                    // --- Lv.1
                    [
                        // Attack - no condition
                        { illustration:"air_privateelite", attack:2, symbol:"air", symbolAmount:2 },
                        { illustration:"earth_privateelite", life:2, symbol:"earth", symbolAmount:2 }
                    ],
                    // --- Lv.2
                    [
                        // Attack
                        { illustration:"air_sergeantelite", life:1, attack:2, symbol:"air", symbolAmount:2 },
                        { illustration:"earth_sergeantelite", attack:1, life:2, symbol:"earth", symbolAmount:2 }
                    ], // Lv.2
                    // --- Lv.3
                    [
                        // Attack
                        { attack:2, illustration:"air_sergeantmajorelite", life:2, symbol:"air", symbolAmount:2, doNotMerge:true },
                        { life:2, illustration:"earth_sergeantmajorelite", attack:2, symbol:"earth", symbolAmount:2, doNotMerge:true }
                    ],
                ],
                bodies:[
                    [ // Lv.1
                        { name:"Private Elite", attack:BASE_ATTACK, life:BASE_LIFE }
                    ], 
                    [ // Lv.2
                        { name:"Sergeant Elite", attack:BASE_ATTACK, life:BASE_LIFE }
                    ],
                    [ // Lv.3
                        { name:"Sergeant Major Elite", attack:BASE_ATTACK, life:BASE_LIFE }
                    ]
                ]
            },
            { // {WATER + FIRE = STEAM} {[BASIC ATTACK+LIFE] NO SPECIALS} [MILITARY GRADES?] Higher elements, no skills
                boosts:[
                    // --- Lv.1
                    [
                        // Attack - no condition
                        { illustration:"fire_privatemage", attack:1, trigger:"onLife", condition:"{water}{water}", description:"+{x}{life}", symbol:"fire", symbolAmount:2 },
                        { illustration:"water_privatemage", life:1, trigger:"onAttack", condition:"{fire}{fire}", description:"+{x}{attack}", symbol:"water", symbolAmount:2 }
                    ],
                    // --- Lv.2
                    [
                        // Attack
                        { attack:2, illustration:"fire_sergeantmage", trigger:"onLife", condition:"{water}{water}", description:"+{x}{life}", symbol:"fire", symbolAmount:2 },
                        { life:2, illustration:"water_sergeantmage", trigger:"onAttack", condition:"{fire}{fire}", description:"+{x}{attack}", symbol:"water", symbolAmount:2 }
                    ], // Lv.2
                    // --- Lv.3
                    [
                        // Attack
                        { illustration:"fire_sergeantmajormage", attack:2, life:1, trigger:"onLife", condition:"{water}{water}", description:"+{x}{life}", symbol:"fire", symbolAmount:2, doNotMerge:true },
                        { illustration:"water_sergeantmajormage", life:2, attack:1, trigger:"onAttack", condition:"{fire}{fire}", description:"+{x}{attack}", symbol:"water", symbolAmount:2, doNotMerge:true }
                    ],
                ],
                bodies:[
                    [ // Lv.1
                        { name:"Private Mage", attack:BASE_ATTACK, life:BASE_LIFE }
                    ], 
                    [ // Lv.2
                        { name:"Sergeant Mage", attack:BASE_ATTACK, life:BASE_LIFE }
                    ],
                    [ // Lv.3
                        { name:"Sergeant Major Mage", attack:BASE_ATTACK, life:BASE_LIFE }
                    ]
                ]
            }
        ];

    // Core set places
    const
        defaultPlaceBodies=[
            { level:PLACE_LEVEL, name:"Reinforcements", description: "Print a level {level} Unit on the {CONFIG.incomingRow} 1st and 2nd column." },
            { level:PLACE_LEVEL, name:"Reinforcements", description: "Print a level {level} Unit on the {CONFIG.incomingRow} 1st and 3rd column." },
            { level:PLACE_LEVEL, name:"Reinforcements", description: "Print a level {level} Unit on the {CONFIG.incomingRow} 1st and 4th column." },
            { level:PLACE_LEVEL, name:"Reinforcements", description: "Print a level {level} Unit on the {CONFIG.incomingRow} 2nd and 3rd column." },
            { level:PLACE_LEVEL, name:"Reinforcements", description: "Print a level {level} Unit on the {CONFIG.incomingRow} 2nd and 4th column." },
            { level:PLACE_LEVEL, name:"Reinforcements", description: "Print a level {level} Unit on the {CONFIG.incomingRow} 3rd and 4th column." }            
        ],
        rawPlaces=[
            { // Default set
                boosts:copySet([{ level:PLACE_LEVEL }], defaultPlaceBodies.length*2),
                bodies:defaultPlaceBodies
            },
            { // Elemental set
                boosts:copySet([
                    { level:PLACE_LEVEL, name:"Arson", trigger:"onAll", description: ELEMENT_BOOST, symbol:"fire", symbolAmount:1 },
                    { level:PLACE_LEVEL, name:"Typhoon", trigger:"onAll", description: ELEMENT_BOOST, symbol:"air", symbolAmount:1 },
                    { level:PLACE_LEVEL, name:"Flood", trigger:"onAll", description: ELEMENT_BOOST, symbol:"water", symbolAmount:1 },
                    { level:PLACE_LEVEL, name:"Mud", trigger:"onAll", description: ELEMENT_BOOST, symbol:"earth", symbolAmount:1 },
                ],3),
                bodies:defaultPlaceBodies
            }
        ],
        fullRawPlaces=[,
            { // Mid-boss set
                boosts:copySet([{ level:PLACE_LEVEL }], 4),
                bodies:[
                    { level:PLACE_LEVEL, name:"Mid-boss", description: "Print a level {level+1} Unit on the {CONFIG.incomingRow} 1st column." },
                    { level:PLACE_LEVEL, name:"Mid-boss", description: "Print a level {level+1} Unit on the {CONFIG.incomingRow} 2nd column." },
                    { level:PLACE_LEVEL, name:"Mid-boss", description: "Print a level {level+1} Unit on the {CONFIG.incomingRow} 3rd column." },
                    { level:PLACE_LEVEL, name:"Mid-boss", description: "Print a level {level+1} Unit on the {CONFIG.incomingRow} 4th column." }
                ]
            },
            { // Boss set
                boosts:copySet([{ level:PLACE_LEVEL }], 2),
                bodies:[
                    { level:PLACE_LEVEL, name:"Boss", description: "Print a level {level+2} Unit on the {CONFIG.incomingRow} 2nd column, and draw 1 card." },
                    { level:PLACE_LEVEL, name:"Boss", description: "Print a level {level+2} Unit on the {CONFIG.incomingRow} 3rd column, and draw 1 card." },
                ]
            }
        ];

    // Reference card
    const
        rawText=[
            {
                type: "text",
                title:"Quick Reference",
                text:[
                    "{bold}Unit Attack phases:{endbold}",
                    "1. Check Place, {area}, {phasefront} effects",
                    "2. Calculate attack value ({attack} + {phaseattack}{phaseany})",
                    "3. {italic}If attack value >0{enditalic}: Check target space",
                    "4. Apply target Unit defense ({phasedefense}{phaseany})",
                    "5. Add as many {wound} as the attack value",
                    "6. Check target Unit defeat",
                    "7. Always check the attacker Unit defeat",
                    "8. {italic}If the attacker Unit is not defeated{enditalic}: {CONFIG.exhaust} it",
                    "",
                    "{bold}Check Unit defeat:{endbold}",
                    "If {wound} > {life} + {phaselife}{phaseany}: {defeat} ({phasedefeat}{phaseany})",
                    "",
                    "{bold}Symbols:{endbold}",
                    "{defeat}: Defeat Unit",
                    "{attack}/{life}: Attack/{CONFIG.life}",
                    "{wound}: Wound",
                    "{left}/{right}/{sides}: {CONFIG.allyUnit} on left/right/any side",
                    "{frontleft}/{frontright}/{front}: {CONFIG.enemyUnit} on left/right/front",
                    "{x}/{x+1}: times the condition is verified",
                    "{level}/{level+1}/{level+2}: Ink level"
                ]
            }
        ];

    if (isFullDeck) {
        fullRawUnits.forEach(item=>{
            rawUnits.push(item);
        });
        fullRawPlaces.forEach(item=>{
            rawPlaces.push(item);
        });
    }

    this.generate=(cb)=>{

        cardTools.downloadImage(ILLUSTRATIONS_FILE,(image)=>{

            let
                cards={
                    meta:{
                        id:DECK_ID,
                        version:DECK_VERSION,
                        language:DECK_LANGUAGE,
                        type:DECK_TYPE,
                        dateCreated:DECK_CREATED,
                        dateUpdated:cardTools.dateToString(),
                        name:DECK_NAME,
                        description:DECK_DESCRIPTION,
                        flavorText:DECK_FLAVORTEXT,
                        author:DECK_AUTHOR,
                        authorLink:"https://www.kesiev.com/"
                    },
                    deck:[]
                },
                unitStats={
                    special:0,
                    normal:0,
                    all:0,
                    symbolsRequirements:{},
                    byLevel:[],
                    byTrigger:{}
                };

            cardTools.generateDeckFromRaw(cardTools,rawUnits,rawPlaces,isFullDeck ? rawEvents : 0,rawText,cards,image.canvasData,ILLUSTRATION_INDEX);

            // Create stats
            cards.deck.forEach(card=>{
                // Collect stats
                if (card[0].type == "unit") {
                    let unit=card[0];
                    unitStats.all++;
                    if (unit.description)
                        unitStats.special++;
                    else
                        unitStats.normal++;
                    let
                        boostType = unit.boostDescription ? "special" : "normal";
                    if (!unitStats.byLevel[unit.level])
                        unitStats.byLevel[unit.level]={
                            normal:{ count:0,boostLiving:0, boostAttacking:0, boostAttack:0, boostLife:0 },
                            special:{ count:0,boostLiving:0, boostAttacking:0, boostAttack:0, boostLife:0 },
                            supportElements:{ }
                        };
                    unitStats.byLevel[unit.level][boostType].count++;
                    if (unit.boostAttack) {
                        unitStats.byLevel[unit.level][boostType].boostAttacking++;
                        unitStats.byLevel[unit.level][boostType].boostAttack+=unit.boostAttack;
                    }
                    if (unit.boostLife) {
                        unitStats.byLevel[unit.level][boostType].boostLiving++;
                        unitStats.byLevel[unit.level][boostType].boostLife+=unit.boostLife;
                    }
                    if (unit.boostSymbol) {
                        if (!unitStats.byLevel[unit.level].supportElements[unit.boostSymbol]) unitStats.byLevel[unit.level].supportElements[unit.boostSymbol]=0;
                        unitStats.byLevel[unit.level].supportElements[unit.boostSymbol]+=unit.boostSymbolAmount;
                    }
                    if (unit.boostCondition) {
                        unit.boostCondition.replace(/\{([^}]+)\}/g,(m,condition)=>{
                            if (!unitStats.symbolsRequirements[unit.boostCondition])
                                unitStats.symbolsRequirements[unit.boostCondition]=0;
                            unitStats.symbolsRequirements[unit.boostCondition]++;
                        });
                    }
                    if (unit.trigger) {
                        if (!unitStats.byTrigger[unit.trigger]) unitStats.byTrigger[unit.trigger]=[];
                        unitStats.byTrigger[unit.trigger].push(unit.description);
                    }
                    if (unit.boostTrigger) {
                        if (!unitStats.byTrigger[unit.boostTrigger]) unitStats.byTrigger[unit.boostTrigger]=[];
                        unitStats.byTrigger[unit.boostTrigger].push(unit.boostDescription);
                    }
                }
            });

            // Add quick reference
            cards.deck.push();

            console.log(cards);

            cb({
                stats:unitStats,
                cards:cards
            });

        });
    }
}
