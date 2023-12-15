<div align="center" style="margin:60px 0">
    <p><img src="../images/logo.png"></p>
</div>

---

## Generals of Stampadia Development Tools

Hi, fellow **Sacred Printer Engineer**! Here you will learn how to use the **Card Set Development Kit tools** so you can make and share your Generals of Stampadia **Full and Expansion custom card sets**.

## Setup

First of all, **download this whole repository code on your computer** and **serve it with any web server you like**. GoS doesn't have any server-side code, so just serving it and pointing your browser on the project root should do the job.

## Custom card sets

A GoS custom card set is described by a JSON file like [this one](devkit/sample-set.json). It includes a `meta` header with information about the whole set and a `deck` list with all of the card's data, including their illustrations.

All of the GoS sets are JSON files with the same structure, so head to the [set database](../database/) and have a peek at the online database sets.

We will learn how to work on your own set with the **print preview tool**, test it on the **secret virtual table**, add some **illustrations**, **validate and clean it**, and finally **share it**.

## Working on a custom card set

Point your browser to `tools/devkit/preview-print.html`: you'll see a **print preview** of a few sample cards.

They are generated from the `tools/devkit/sample-set.json` custom card set file, so you may edit it with your favorite code/text editor and refresh the browser page from time to time to see the result. The GoS [Full Core Set](../database/GOSFCORE/) JSON file includes all of the core game cards, so you can have a look at that to see how it works and to get some inspiration.

_Feel free to create your weird effects... just make sure to use all Elements in Skills conditions and infusions in Unit Cards, to hit all the columns in Place Cards, and not to break the card layout!_

## Testing a custom card set

First, I have a _secret_ to share with you. You can use a **very simple virtual table** to test any of the online database sets from the **Print Shop**, hitting the **Download** tab 5 times when no set is selected. A new **Develop** tab will appear, together with a short description of how it works.

You can quickly open the same virtual table with your custom card set pointing your browser to `tools/devkit/preview-test.html`. As for the **print preview** tool, you can edit the `tools/devkit/sample-set.json` file with your text editor and then reload the virtual table page to test it again.

Finally, the Print Shop allows you to **drag and drop custom card set files from your computer** to mix and match and print them. Your `sample-set.json` _already is a custom card set file_, so you can drop it into the Print Shop, add more sets, and use the _virtual table secret_ to test how your custom card set works with other sets!

_If you're working on an expansion, it may be helpful to test it with the Lite Core Deck first so you can check if it adds the flavor you want to the game. Also, make sure not to make the game too easy or unfair!_

## Adding illustrations

You've probably already noticed that long sequence of characters in the `illustration` card attributes. Card illustrations are encoded using a character sequence - that luckily you won't need to type in by yourself.

Start creating a 24x24 PNG image with an image editor like [GIMP](https://www.gimp.org/) or any other pixel art program you like. All GoS cards use the [PAX-24](https://lospec.com/palette-list/pax-24) color palette and one fully transparent color, so you're going to do the same.

Draw the illustration you want. If you need more illustrations for your cards, you can use the same image file and arrange multiple illustrations in a 24x24 grid [like this](../assets/illustrations/illustrations.png).

Once you're happy with the result, point your browser to `tools/image2text/index.html` and drop your image file into the page. Click on any illustration on the preview to show its character sequence, ready to be copied and pasted into your JSON file.

_Draw anything you want - just try not to be offensive and use the Core Decks illustrations as a style reference!_

## Cleaning and validating

We're almost done! Once your set is completed, tested, and illustrated it's time to **clean and validate it**!

Point your browser to `tools/devkit/preview-test.html` to start validating your set. The page will show any error, or a set of metadata, viewers, tools, and downloads to help you give your set a _final review_.

Once everything is perfect, click the **Download clean JSON** link to download a **cleaned-up version of your set**. It contains the same data as your set but with a more standard file name and JSON structure.

_That's it! Now you can share it with your friends to let them play your custom cards set!_

## Sharing a custom card set

Well. That's up to you! You can share it with anybody by e-mail, on your website, by chat, or by using anything that can share a file. Just tell them to **drop it on the Print Shop page** to print it.

You can also share your set with other players [on the Stampadia Discord](https://discord.gg/EDYP2N4RMn) and propose to add it to the online database!

## Hey, I don't have a web server!

No problem! Download [the custom card set template](devkit/sample-set.json) and get inspiration peeping the online database card sets JSON files [here](../database/). Customize your local sample set JSON file with your favorite text editor as you want.

To illustrate your cards, follow the "**Adding illustrations**" instructions and use the [official GoS instance Image2Text tool](https://www.kesiev.com/stampadia-generals/tools/image2text/) to get the converted text of each illustration.

To validate and test your custom card set drop it into [the official GoS instance Print Shop](https://www.kesiev.com/stampadia-generals/printshop.html), select it, and use the **Testing a custom card set** secret to open the virtual table. You don't need to reload the Print Shop every time you update your custom card set: just hit **ESC** to go back from the virtual table to the Print Shop, drop the updated version of your custom card set JSON file into the Print Shop, and open the virtual table again.

Once your set is ready, select **your custom set only** from the Print Shop and download the clean JSON file from the link at the bottom of the **Develop** tab. Now you're ready to share it!

## That's all!

GoS is one of the [small experimental projects](https://github.com/kesiev?tab=repositories) I work on during my spare time. I'll keep spending _some time_ on it, so feel free to share your suggestions and ideas!
