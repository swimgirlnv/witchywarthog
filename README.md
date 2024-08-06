# witchywarthog

## Steps to Running:

1) CD into witchy-warthog
2) npm install
3) npm run dev

For now don't worry about Firebase and Vercel deployments. I (@swimgirlnv) have accidentally broken both SO working on it LOL.

## Important Links
To remove background on images: https://create.pixelcut.ai/background-remover

LW game rules: https://gamers-hq.de/media/pdf/85/81/62/LizardWizard-Rulebook-na.pdf

imgur: https://imgur.com/a/witchy-warthog-Irgfgwi

## TODOs
- Add Actions:
    - 1) Gather Resources
        - Need to fix the resource card layout
        - too many clicks to gather resource. just make it so the card you choose, you get those three resources.
        - Need to fix where cards get displayed.
    - 2) Convert resources to mana
    - 3) Recruit Wizard
        - Need to make sure that the recruited wizard card shows image of wizard.
        - Fix layout for recruit action, looks weird.
        - Improve bidding, make it pretty (will try to figma it out)
    - 4) Research a spell
        - all logic TODO
    - 5) Create a tower
        - all logic TODO
    - 6) Summon Familiar
        - all logic TODO, including:
            - Enter Dungeon
            - Collect gold coins per card of power type
            - Research new spells
            - Collect x resources and cast spells

- Fix GameBoard so layout is closer to LW og layout
- Fix player layout so it is more intuitive. Also consider how we want to display all the players. Think online uno?
- No more hardcoded players, need to figure out google oauth or something so we have game servers. Think xyzz or fishbowl?

- Pretty modals for errors instead of the browser err