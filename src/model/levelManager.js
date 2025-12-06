const LEVELS = [
    {
        name: "Tutorial",
        theme: "sky",
        respawnPosition: [125, 150],
        ballColor: "red",
        ballSkin: '8ball',
        music: 'land', // Land.mp3 for Tutorial Level
        platforms: [
            { "x": 2250, "y": 0, "w": 120, "h": 20, "color": "orange", "moving": true, "speed": 2, "minX": 2231, "maxX": 2683 }
        ],
        ground: [
            { "x": 550, "y": 350, "w": 1000, "h": 40 },
            { "x": 1800, "y": 0, "w": 700, "h": 40 },
            { "x": 3100, "y": 0, "w": 700, "h": 40 },
            { "x": 3125, "y": -420, "w": 20, "h": 800 },
            { "x": 4701, "y": 0, "w": 500, "h": 40 },
            { "x": 550, "y": 120, "w": 1000, "h": 40 },
            { "x": 60, "y": 235, "w": 20, "h": 190 }
        ],
        springs: [
            { "x": 1250, "y": 425, "w": 200, "h": 40 }
        ],
        spikes: [
            { "x": 780, "y": 307, "orientation": "up" },
            { "x": 420, "y": 307, "orientation": "up" },
            { "x": 480, "y": 307, "orientation": "up" },
            { "x": 540, "y": 307, "orientation": "up" },
            { "x": 600, "y": 307, "orientation": "up" },
            { "x": 660, "y": 307, "orientation": "up" },
            { "x": 720, "y": 307, "orientation": "up" }
        ],
        checkpoints: [
            { "x": 1600, "y": -45 }
        ],
        enemies: [
            { "startX": 2080, "startY": -60, "endX": 2080, "endY": -200, "speed": 30 }
        ],
        lasers: [],
        disappearingPlatforms: [
            { "x": 3950, "y": 0, "w": 1000, "h": 40 }
        ],
        swingingHammers: [],
        teleporter: [
            { "x": 3030, "y": -49, "w": 60, "h": 40 },
            { "x": 3230, "y": -49, "w": 100, "h": 100 }
        ],
        blackhole: [],
        goalPosition: { "x": 4790, "y": -82 },
        instructions: "",
        signs: [
            { x: 200, y: 220, text: "Welcome to Epsilon's Greatest Ball! \n Use the arrow keys to move left/right", size: 15, color: 'black' },
            { x: 600, y: 180, text: "Press space to jump. \n Double jump by pressing space twice in order to avoid these!", size: 15, color: 'black' },
            { x: 1250, y: 300, text: "Jump onto the spring to launch yourself in the air!", size: 15, color: 'black' },
            { x: 1600, y: -70, text: "This checkpoint allows you to respawn here after you die.", size: 15, color: 'black' },
            { x: 1885, y: -140, text: "Double jump over this frenzied enemy \n to land on the moving platform!", size: 15, color: 'black' },
            { x: 2900, y: -100, text: "Use the teleporter to bypass this invisible wall.", size: 15, color: 'black' },
            { x: 3900, y: -100, text: "Go quickly across this platform! \n It starts disappearing after you touch it!", size: 15, color: 'black' },
            { x: 4700, y: -140, text: "Congratulations! \n You will encounter more obstacles as you go along. \n Have fun playing Epsilon's Greatest Ball!", size: 15, color: 'black' },
        ],
        fallDeathY: 700
    },

    {
        name: "Level 1",
        theme: "sky",
        respawnPosition: [500, 150],
        ballColor: 'red',
        ballSkin: '8ball',
        music: 'land', // Land.mp3 for Level 1
        platforms: [
            // question for later but why are the y's below != to eachothers pair
            { x: 3150, y: -1000, w: 100, h: 20, color: 'orange', moving: true, speed: 2, minX: 3150, maxX: 3450 },
            { x: 3850, y: -996, w: 100, h: 20, color: 'orange', moving: true, speed: 2, minX: 3550, maxX: 3850 },

            { x: 3150, y: -1000 + 400, w: 100, h: 20, color: 'orange', moving: true, speed: 2, minX: 3150, maxX: 3450 },
            { x: 3850, y: -996 + 400, w: 100, h: 20, color: 'orange', moving: true, speed: 2, minX: 3550, maxX: 3850 },

            { x: 3150, y: -1000 + 800, w: 100, h: 20, color: 'orange', moving: true, speed: 2, minX: 3150, maxX: 3450 },
            { x: 3850, y: -996 + 800, w: 100, h: 20, color: 'orange', moving: true, speed: 2, minX: 3550, maxX: 3850 },

            { x: 3150, y: -1000 + 1200, w: 100, h: 20, color: 'orange', moving: true, speed: 2, minX: 3150, maxX: 3450 },
            { x: 3850, y: -996 + 1200, w: 100, h: 20, color: 'orange', moving: true, speed: 2, minX: 3550, maxX: 3850 },



            { x: 4200, y: -1000, w: 100, h: 20, color: 'orange', moving: true, speed: 2, minX: 4200, maxX: 4500 },
            { x: 4900, y: -996, w: 100, h: 20, color: 'orange', moving: true, speed: 2, minX: 4600, maxX: 4900 },

            { x: 4200, y: -1000 + 400, w: 100, h: 20, color: 'orange', moving: true, speed: 2, minX: 4200, maxX: 4500 },
            { x: 4900, y: -996 + 400, w: 100, h: 20, color: 'orange', moving: true, speed: 2, minX: 4600, maxX: 4900 },

            { x: 4200, y: -1000 + 800, w: 100, h: 20, color: 'orange', moving: true, speed: 2, minX: 4200, maxX: 4500 },
            { x: 4900, y: -996 + 800, w: 100, h: 20, color: 'orange', moving: true, speed: 2, minX: 4600, maxX: 4900 },

            { x: 4200, y: -1000 + 1200, w: 100, h: 20, color: 'orange', moving: true, speed: 2, minX: 4200, maxX: 4500 },
            { x: 4900, y: -996 + 1200, w: 100, h: 20, color: 'orange', moving: true, speed: 2, minX: 4600, maxX: 4900 },





        ],
        ground: [
            { x: 500, y: 350, w: 800, h: 40 },
            { x: 1700, y: -600, w: 200, h: 40 },
            { x: 2300, y: -600, w: 400, h: 40 },
            { x: 2480, y: -220, w: 40, h: 800 },
            { x: 2680, y: -220, w: 40, h: 800 },
            { x: 2680, y: -800, w: 40, h: 400 },
            { x: 2680, y: 400, w: 400, h: 40 },

            { x: 2880, y: -220, w: 40, h: 800 },
            { x: 2880, y: -800, w: 40, h: 400 },
            { x: 2880, y: 220, w: 40, h: 400 },

            { x: 2780, y: 50, w: 40, h: 20 },
            { x: 2780, y: -350, w: 40, h: 20 },
            { x: 2780, y: -750, w: 40, h: 20 },

            { x: 2960, y: -1000, w: 200, h: 40 },

            { x: 3980, y: -220, w: 40, h: 800 },
            { x: 3980, y: -800, w: 40, h: 400 },
            { x: 3980, y: -1200, w: 40, h: 400 },

            { x: 3980, y: 300, w: 100, h: 40 },

            { x: 4550, y: -800, w: 100, h: 20 },
            { x: 4550, y: -400, w: 100, h: 20 },
            { x: 4550, y: 0, w: 100, h: 20 },

            { x: 5400, y: -1000, w: 300, h: 20 },

        ],
        springs: [
            { x: 1100, y: 200, w: 200, h: 40 },
            { x: 1400, y: -200, w: 200, h: 40 },
            { x: 2780, y: 380, w: 100, h: 20 },
            { x: 2780, y: 30, w: 40, h: 20 },
            { x: 2780, y: -370, w: 40, h: 20 },
            { x: 2780, y: -770, w: 40, h: 20 },

        ],
        spikes: [

            { x: 1900, y: -620, orientation: "up" },
            { x: 1950, y: -620, orientation: "up" },
            { x: 2000, y: -620, orientation: "up" },

            { x: 2200, y: -645, orientation: "up" },
            { x: 2250, y: -645, orientation: "up" },
            { x: 2300, y: -645, orientation: "up" },

            { x: 2525, y: -590, orientation: "left" },
            { x: 2525, y: -540, orientation: "left" },
            { x: 2525, y: -490, orientation: "left" },

            { x: 2635, y: 0, orientation: "right" },
            { x: 2635, y: 50, orientation: "right" },
            { x: 2635, y: 100, orientation: "right" },

            { x: 2780, y: 80, orientation: "down" },
            { x: 2780, y: -320, orientation: "down" },
            { x: 2780, y: -720, orientation: "down" },


        ],

        checkpoints: [
            { x: 2960, y: -1045 }
        ],

        enemies: [],

        lasers: [],

        disappearingPlatforms: [],

        swingingHammers: [],

        teleporter: [],

        blackhole: [],

        goalPosition: { x: 5254, y: -4 },

        instructions: "",

        signs: [],

        fallDeathY: 1600
    },

    {
        name: "Level 2",
        theme: "space",
        respawnPosition: [500, 150],
        ballColor: 'red',
        ballSkin: '8ball',
        music: 'odyssey', // Odyssey.mp3 for Level 2
        platforms: [],

        disappearingPlatforms: [
            { x: 1180, y: 530, w: 160, h: 20, color: "orange", moving: false },
            { x: 1510, y: 530, w: 140, h: 20, color: "orange", moving: false }
        ],

        ground: [],

        springs: [
            { x: 1840, y: 510, w: 120, h: 20 }
        ],

        spikes: [
            { x: 2780, y: 700, orientation: "up" },
            { x: 2960, y: 700, orientation: "up" },
            { x: 3200, y: 700, orientation: "up" }
        ],

        checkpoints: [
            { x: 1780, y: 500 },
            { x: 5140, y: 540 },
            { x: 2880, y: 700 }
        ],

        enemies: [
            { startX: 4620, startY: 740, endX: 4580, endY: 740, speed: 1 },
            { startX: 5440, startY: 540, endX: 5220, endY: 540, speed: 1 }
        ],

        lasers: [
            { x: 1680, y: -60, range: 300, speedData: { speed: 3, bulletSpeed: 8 }, fwdDir: RIGHT },
            { x: 2900, y: -60, range: 300, speedData: { speed: 3, bulletSpeed: 8 }, fwdDir: LEFT },
            { x: 1500, y: 140, range: 300, speedData: { speed: 3, bulletSpeed: 8 }, fwdDir: DOWN },
            { x: 1160, y: 140, range: 300, speedData: { speed: 3, bulletSpeed: 8 }, fwdDir: DOWN }
        ],

        asteriodFields: [
            { x: 4580, y: -300, range: 600, fallSpeed: 4, burstCount: 4, timeInterval: 3 }
        ],

        swingingHammers: [],
        
        teleporter: [
            { x: 5420, y: 530, w: 80, h: 20 },
            { x: 6260, y: 790, w: 120, h: 20 },
            { x: 5810, y: 790, w: 100, h: 20 },
            { x: 6570, y: 290, w: 100, h: 20 },
            { x: 7030, y: 290, w: 60, h: 20 },
            { x: 8060, y: 570, w: 40, h: 20 },
            { x: 7570, y: 550, w: 20, h: 20 },
            { x: 7170, y: 1140, w: 60, h: 40 },
            { x: 8060, y: 1170, w: 40, h: 20 },
            { x: 8190, y: 1160, w: 20, h: 40 }
        ],
        
        blackhole: [
            { x: 1950, y: 250, w: 20, h: 20 },
            { x: 3685, y: 250, w: 80, h: 20 }
        ],
        
        goalPosition: { x: 7000, y: 1140 },
        instructions: "",
        fallDeathY: 1500
    },

    {
        name: "Level 3",
        theme: "sky",
        respawnPosition: [ 1200, 2600 ],
        ballColor: "red",
        music: "land",
        platforms: [
          { x: 2800, y: 1500, w: 100, h: 20, color: 'orange', moving: true, speed: 2.2, minX: 2900, maxX: 3520 },
        ],
        disappearingPlatforms: [
            { "x": 5365, "y": 527, "w": 550, "h": 20 }
        ],
        ground: [],
        springs: [
            { "x": 6000, "y": 800, "w": 150, "h": 20 }
        ],
        spikes: [
            { "x": 1780, "y": 2610, "orientation": "up" },
            { "x": 1983, "y": 2610, "orientation": "up" },
            { "x": 3710, "y": 1145, "orientation": "left" },
            { "x": 4054, "y": 1008, "orientation": "right" },
            { "x": 3710, "y": 800, "orientation": "left" },
            { "x": 4054, "y": 594, "orientation": "right" },
            { "x": 4096, "y": -1770, "orientation": "right" }
        ],
        checkpoints: [
            { "x": 6580, "y": 494 },
            { "x": 3900, "y": 1460 }
        ],
        backtrackTrigger: {},
        enemies: [
            { "startX": 3530, "startY": 2516, "endX": 3770, "endY": 2516, "speed": 1.5 },
            { "startX": 2900, "startY": 2516, "endX": 3200, "endY": 2516, "speed": 1.5 },
            { "startX": 2580, "startY": 2516, "endX": 2760, "endY": 2516, "speed": 1.5 },
            { "startX": 3000, "startY": 2723, "endX": 3190, "endY": 2723, "speed": 1.5 },
            { "startX": 3200, "startY": 2309, "endX": 3490, "endY": 2309, "speed": 1.5 },
            { "startX": 2670, "startY": 2309, "endX": 2905, "endY": 2309, "speed": 1.5 },
            { "startX": 3400, "startY": 2309, "endX": 3680, "endY": 2309, "speed": 2 },
            { "startX": 3320, "startY": 2102, "endX": 3680, "endY": 2102, "speed": 2 }
        ],
        lasers: [],
        asteriodFields: [],
        swingingHammers: [
            {
                "pivotX": 2990,
                "pivotY": 1420,
                "length": 200,
                "amplitude": 50,
                "speed": 2,
                "phase": 0,
                "width": 780,
                "height": 800,
                "spikeHeight": 200,
                "scale": 0.3
            },
        ],
        shrinkpads: [{ x: 6890, y: 487 }],
        teleporter: [],
        blackhole: [],
        goalPosition: { "x": 950, "y": 2600 },
        instructions: "",
        signs: [],
        fallDeathY: 3200
    },

    /* Add more levels here  Be sure to use the template as seen above
      {
        name: "Level 3",
              theme: "sky", 
        respawnPosition: [500, 150],
        ballColor: 'red',
        platforms: [],
        disappearingPlatforms: [],
        ground: [{"x": 450,"y": 390,"w": 580,"h": 20}],
        springs: [],
        spikes: [],
        checkpoints: [{"x": 260, "y": 340 }],
        enemies: [],
        lasers: [],
        asteriodFields: [],
        swingingHammers: [],
        teleporter: [],
        blackhole: [],
        goalPosition: { x: 1900, y: 300 }, 
        instructions: "",
        signs: [],
      },
    */

    // Add more levels here  Be sure to use the template as seen above
    {
        name: "Level 4",
        theme: "sky",
        respawnPosition: [500, 150],
        ballColor: "red",
        platforms: [
          { x: 2800, y: 1500, w: 100, h: 20, color: 'orange', moving: true, speed: 2.2, minX: 2900, maxX: 3520 },
        ],
        disappearingPlatforms: [],
        ground: [{"x": 450, "y": 390, "w": 580, "h": 20}],
        springs: [],
        spikes: [],
        checkpoints: [{"x": 260, "y": 340 }],
        enemies: [],
        lasers: [],
        asteriodFields: [],
        swingingHammers: [],
        teleporter: [],
        blackhole: [],
        goalPosition: { x: 1900, y: 300 }, 
        instructions: "",
        signs: [],
        
    }
];


/***
 * 
 * 
 * 
 * 
 * @level-managing-functions
 * 
 * 
*/

function initializeLevels() {
    levels = [
        {
            name: "Tutorial",
            theme: "sky",
            respawnPosition: [130, 150],
            ballColor: "red",
             ballSkin: '8ball',
            music: 'land', // Land.mp3 for Tutorial Level
           platforms: [
                { "x": 2250, "y": 75, "w": 120, "h": 20, "color": "orange", "moving": true, "speed": 2, "minX": 2231, "maxX": 2675 }
            ],
           ground: [
                //{ "x": 550, "y": 350, "w": 1000, "h": 40 },
                //{ "x": 1800, "y": 0, "w": 700, "h": 40 },
               // { "x": 3100, "y": 0, "w": 700, "h": 40},
                { "x": 3125, "y": -350, "w": 20, "h": 800, "visible" : "no" },
                //{ "x": 4701, "y": 0, "w": 500, "h": 40 },
                //{ "x": 550, "y": 120, "w": 1000, "h": 40 },
                //{ "x": 60, "y": 235, "w": 20, "h": 190}
            ],
            springs: [
                { "x": 1250, "y": 425, "w": 200, "h": 40 }
            ],
            spikes: [
                { "x": 780, "y": 310, "orientation": "up" },
                { "x": 420, "y": 310, "orientation": "up" },
                { "x": 480, "y": 310, "orientation": "up" },
                { "x": 540, "y": 310, "orientation": "up" },
                { "x": 600, "y": 310, "orientation": "up" },
                { "x": 660, "y": 310, "orientation": "up" },
                { "x": 720, "y": 310, "orientation": "up" }
            ],
            checkpoints: [
                { "x": 1600, "y": 55 }
            ],
            enemies: [
                { "startX": 2080, "startY": 10, "endX": 2080, "endY": -130, "speed": 30 }
            ],
            lasers: [],
            disappearingPlatforms: [
                { "x": 3930, "y": 100, "w": 900, "h": 40 }
            ],
            swingingHammers: [],
            teleporter: [
                { "x": 3030, "y": 50, "w": 60, "h": 40 },
                { "x": 3230, "y": 50, "w": 100, "h": 100 }
            ],
            blackhole: [],
            goalPosition: { "x": 4790, "y": 20 },
            instructions: "",
            signs: [
              { x: 200, y: 220, text: "Welcome to Epsilon's Greatest Ball! \n Use the arrow keys to move left/right", size: 15, color: 'black' },
              { x: 600, y: 180, text: "Press space to jump. \n Double jump by pressing space twice in order to avoid these!", size: 15, color: 'black' },
              { x: 1250, y: 300, text: "Jump onto the spring to launch yourself in the air!", size: 15, color: 'black' },
              { x: 1600, y: -70, text: "This checkpoint allows you to respawn here after you die.", size: 15, color: 'black' },
              { x: 1885, y: -140, text: "Double jump over this frenzied enemy \n to land on the moving platform!", size: 15, color: 'black' },
              { x: 2900, y: -100, text: "Use the teleporter to bypass this invisible wall.", size: 15, color: 'black' },
              { x: 3900, y: -100, text: "Go quickly across this platform! \n It starts disappearing after you touch it!", size: 15, color: 'black' },
              { x: 4700, y: -140, text: "Congratulations! \n You will encounter more obstacles as you go along. \n Have fun playing Epsilon's Greatest Ball!", size: 15, color: 'black' },
            ],
            fallDeathY: 700
        },

        {
            name: "Level 1",
            theme: "sky", 
            respawnPosition: [500, 1000],
            ballColor: 'red',
             ballSkin: '8ball',
            music: 'land', // Land.mp3 for Level 1
            platforms: [
                // question for later but why are the y's below != to eachothers pair
                { x: 3200, y: 250, w: 100, h: 20, color: 'orange', moving: true, speed: 2, minX: 3200, maxX: 3500 },
                { x: 4000, y: 255, w: 100, h: 20, color: 'orange', moving: true, speed: 2, minX: 3700, maxX: 4000 },

                { x: 3200, y: 450, w: 100, h: 20, color: 'orange', moving: true, speed: 2, minX: 3200, maxX: 3500 },
                { x: 4000, y: 455, w: 100, h: 20, color: 'orange', moving: true, speed: 2, minX: 3700, maxX: 4000 },

                { x: 3200, y: 650, w: 100, h: 20, color: 'orange', moving: true, speed: 2, minX: 3200, maxX: 3500 },
                { x: 4000, y: 655, w: 100, h: 20, color: 'orange', moving: true, speed: 2, minX: 3700, maxX: 4000 },

                // { x: 3400, y: 50, w: 100, h: 20, color: 'orange', moving: true, speed: 2, minX: 3400, maxX: 3600 },
                // { x: 3900, y: 55, w: 100, h: 20, color: 'orange', moving: true, speed: 2, minX: 3700, maxX: 3900 },



                { x: 4300, y: 250, w: 100, h: 20, color: 'orange', moving: true, speed: 2, minX: 4300, maxX: 4600 },
                { x: 5000, y: 255, w: 100, h: 20, color: 'orange', moving: true, speed: 2, minX: 4700, maxX: 5000 },

                { x: 4300, y: 450, w: 100, h: 20, color: 'orange', moving: true, speed: 2, minX: 4300, maxX: 4600 },
                { x: 5000, y: 455, w: 100, h: 20, color: 'orange', moving: true, speed: 2, minX: 4700, maxX: 5000 },

                { x: 4300, y: 650, w: 100, h: 20, color: 'orange', moving: true, speed: 2, minX: 4300, maxX: 4600 },
                { x: 5000, y: 655, w: 100, h: 20, color: 'orange', moving: true, speed: 2, minX: 4700, maxX: 5000 },

                { x: 4300, y: 50, w: 100, h: 20, color: 'orange', moving: true, speed: 2, minX: 4300, maxX: 4600 },
                { x: 5000, y: 55, w: 100, h: 20, color: 'orange', moving: true, speed: 2, minX: 4700, maxX: 5000 },


                
            
                
            ],
            ground: [
                { "x": 2600, "y": -4600, "w": 20, "h": 10000, "visible" : "no" },
                // { x: 1700, y: -600, w: 200, h: 40 },
                // { x: 2300, y: -600, w: 400, h: 40 },
                // { x: 2480, y: -220, w: 40, h: 800 },
                // { x: 2680, y: -220, w: 40, h: 800 },
                // { x: 2680, y: -800, w: 40, h: 400 },
                // { x: 2680, y: 400, w: 400, h: 40 },

                // { x: 2880, y: -220, w: 40, h: 800 },
                // { x: 2880, y: -800, w: 40, h: 400 },
                // { x: 2880, y: 220, w: 40, h: 400 },

                // { x: 2780, y: 50, w: 40, h: 20 },
                // { x: 2780, y: -350, w: 40, h: 20 },
                // { x: 2780, y: -750, w: 40, h: 20 },

                // { x: 2960, y: -1000, w: 200, h: 40 },

                // { x: 3980, y: -220, w: 40, h: 800 },
                // { x: 3980, y: -800, w: 40, h: 400 },
                // { x: 3980, y: -1200, w: 40, h: 400 },

                // { x: 3980, y: 300, w: 100, h: 40 },

                // { x: 4550, y: -800, w: 100, h: 20 },
                // { x: 4550, y: -400, w: 100, h: 20 },
                // { x: 4550, y: 0, w: 100, h: 20 },

                // { x: 5400, y: -1000, w: 300, h: 20 },

            ],
            springs: [
                { x: 850, y: 1100, w: 200, h: 40 },
                { x: 1200, y: 600, w: 200, h: 40 },
                { x: 2815, y: 775, w: 100, h: 20 },
                { x: 2840, y: 625, w: 40, h: 20 },
                { x: 2840, y: 425, w: 40, h: 20 },
                { x: 2840, y: 225, w: 40, h: 20 },
                
            ],
            spikes: [

            { "x": 1780, "y": 2610, "orientation": "up" },
            { "x": 1983, "y": 2610, "orientation": "up" },

            { "x": 1950, "y": 290, "orientation": "up" },
            { "x": 2000, "y": 290, "orientation": "up" },
            { "x": 2050, "y": 290, "orientation": "up" },
            { "x": 2220, "y": 265, "orientation": "up" },
            { "x": 2270, "y": 265, "orientation": "up" },
            { "x": 2320, "y": 265, "orientation": "up" },
            { "x": 2423, "y": 350, "orientation": "left" },
            { "x": 2423, "y": 400, "orientation": "left" },
            { "x": 2423, "y": 450, "orientation": "left" },
            { "x": 2515, "y": 550, "orientation": "right" },
            { "x": 2515, "y": 600, "orientation": "right" },
            { "x": 2515, "y": 650, "orientation": "right" },
            { "x": 2840, "y": 650, "orientation": "down" },
            { "x": 2840, "y": 450, "orientation": "down" },
            { "x": 2840, "y": 250, "orientation": "down" },


        
            ],

            checkpoints: [
                { x: 3010, y: 35 }
            ],
            
		   	enemies: [],

            lasers: [],

            disappearingPlatforms: [],

            swingingHammers: [],

            teleporter: [],

            blackhole: [], 

            goalPosition: { x: 5254, y: -4 }, 

            instructions: "",

            signs: [],

            fallDeathY: 1600
        },

        {
            name: "Level 2",
        theme: "space",
        respawnPosition: [500, 150],
        ballColor: 'red',
        ballSkin: '8ball',
        music: 'odyssey', // Odyssey.mp3 for Level 2
        platforms: [],

        disappearingPlatforms: [
            { x: 1180, y: 530, w: 160, h: 20},
            { x: 1510, y: 530, w: 140, h: 20}
        ],

        ground: [],

        springs: [
            { x: 1870, y: 510, w: 120, h: 20 }
        ],

        spikes: [
            { x: 2780, y: 700, orientation: "up" },
            { x: 2960, y: 700, orientation: "up" },
            { x: 3200, y: 700, orientation: "up" }
        ],

        checkpoints: [
            { x: 1780, y: 500 },
            { x: 5140, y: 540 },
            { x: 2880, y: 700 }
        ],

        enemies: [
            { startX: 4620, startY: 740, endX: 4580, endY: 740, speed: 1 },
            { startX: 5440, startY: 540, endX: 5220, endY: 540, speed: 1 }
        ],

        lasers: [
            { x: 1680, y: -60, range: 300, speedData: { speed: 3, bulletSpeed: 8 }, fwdDir: RIGHT },
            { x: 2900, y: -60, range: 300, speedData: { speed: 3, bulletSpeed: 8 }, fwdDir: LEFT },
            { x: 1500, y: 140, range: 300, speedData: { speed: 3, bulletSpeed: 8 }, fwdDir: DOWN },
            { x: 1160, y: 140, range: 300, speedData: { speed: 3, bulletSpeed: 8 }, fwdDir: DOWN }
        ],

        asteriodFields: [
            { x: 4580, y: -300, range: 600, fallSpeed: 4, burstCount: 4, timeInterval: 3 }
        ],

        swingingHammers: [],
        
        teleporter: [
            { x: 5420, y: 530, w: 80, h: 20 },
            { x: 6260, y: 790, w: 120, h: 20 },
            { x: 5810, y: 790, w: 100, h: 20 },
            { x: 6570, y: 290, w: 100, h: 20 },
            { x: 7030, y: 290, w: 60, h: 20 },
            { x: 8060, y: 570, w: 40, h: 20 },
            { x: 7570, y: 550, w: 20, h: 20 },
            { x: 7170, y: 1140, w: 60, h: 40 },
            { x: 8060, y: 1170, w: 40, h: 20 },
            { x: 8190, y: 1160, w: 20, h: 40 }
        ],
        
        blackhole: [
            { x: 1970, y: 250, w: 20, h: 20 }
           
        ],
        
        goalPosition: { x: 7000, y: 1140 },
        instructions: "",
        fallDeathY: 1500
    },

        {
        name: "Level 3",
        theme: "sky",
        respawnPosition: [ 1200, 2600 ],
        ballColor: "red",
        music: "land",
        platforms: [
          { x: 2800, y: 1500, w: 100, h: 20, color: 'orange', moving: true, speed: 2.2, minX: 2900, maxX: 3520 },
        ],
        disappearingPlatforms: [
            { "x": 5365, "y": 527, "w": 550, "h": 20 }
        ],
        ground: [],
        springs: [
            { "x": 6000, "y": 800, "w": 150, "h": 20 }
        ],
        spikes: [
            { "x": 1780, "y": 2610, "orientation": "up" },
            { "x": 1983, "y": 2610, "orientation": "up" },
            { "x": 3710, "y": 1145, "orientation": "left" },
            { "x": 4054, "y": 1008, "orientation": "right" },
            { "x": 3710, "y": 800, "orientation": "left" },
            { "x": 4054, "y": 594, "orientation": "right" },
            { "x": 4096, "y": -1770, "orientation": "right" }
        ],
        checkpoints: [
            { "x": 6580, "y": 494 },
            { "x": 3900, "y": 1460 }
        ],
        backtrackTrigger: {
            "x": 6000,
            "y": -1860,
            "w": 50,
            "h": 100,
        },
        enemies: [
            { "startX": 3530, "startY": 2516, "endX": 3770, "endY": 2516, "speed": 1.5 },
            { "startX": 2900, "startY": 2516, "endX": 3200, "endY": 2516, "speed": 1.5 },
            { "startX": 2580, "startY": 2516, "endX": 2760, "endY": 2516, "speed": 1.5 },
            { "startX": 3000, "startY": 2723, "endX": 3190, "endY": 2723, "speed": 1.5 },
            { "startX": 3200, "startY": 2309, "endX": 3490, "endY": 2309, "speed": 1.5 },
            { "startX": 2670, "startY": 2309, "endX": 2905, "endY": 2309, "speed": 1.5 },
            { "startX": 3400, "startY": 2309, "endX": 3680, "endY": 2309, "speed": 2 },
            { "startX": 3320, "startY": 2102, "endX": 3680, "endY": 2102, "speed": 2 }
        ],
        lasers: [],
        asteriodFields: [],
        swingingHammers: [
            {
                "pivotX": 2990,
                "pivotY": 1420,
                "length": 200,
                "amplitude": 50,
                "speed": 2,
                "phase": 0,
                "width": 780,
                "height": 800,
                "spikeHeight": 200,
                "scale": 0.3
            },
        ],
        shrinkpads: [{ x: 6890, y: 487 }],
        teleporter: [],
        blackhole: [],
        goalPosition: { "x": 950, "y": 2600 },
        instructions: "",
        signs: [],
        fallDeathY: 3200
        },
        
        /* Add more levels here  Be sure to use the template as seen above
          {
            name: "Level 3",
			      theme: "sky", 
            respawnPosition: [500, 150],
            ballColor: 'red',
            platforms: [],
            disappearingPlatforms: [],
            ground: [{"x": 450,"y": 390,"w": 580,"h": 20}],
            springs: [],
            spikes: [],
            checkpoints: [{"x": 260, "y": 340 }],
            enemies: [],
            lasers: [],
            asteriodFields: [],
            swingingHammers: [],
            teleporter: [],
            blackhole: [],
            goalPosition: { x: 1900, y: 300 }, 
            instructions: "",
            signs: [],
          },
        */

        // Add more levels here  Be sure to use the template as seen above

        {
            name: "Level 4",
            theme: "sky",
            respawnPosition: [905, 800],
            ballColor: "red",
            music: "land",
            platforms: [
                { x: 3000, y: -50, w: 200, h: 20, color: 'orange', moving: true, speed: 2.2, minX: 3500, maxX: 4520 },
                { x: 1900, y: 3100, w: 1000, h: 20, color: 'orange', moving: true, speed: 2.2, minX: 1800, maxX: 2500 },
            ],
              
            disappearingPlatforms: [
                { x: 2000, y: 700, w: 500, h: 10 },
                { x: 2000, y: 550, w: 350, h: 10 },
                { x: 2000, y: 400, w: 250, h: 10 },
                { x: 2000, y: 250, w: 200, h: 10 },
            ],            
            ground: [
            ],
            springs: [
                { "x": 6000, "y": 800, "w": 150, "h": 20 }
            ],
            spikes: [
                { "x": 1830, "y": 955, "orientation": "up" },
                { "x": 1780, "y": 955, "orientation": "up" },
                { "x": 1730, "y": 955, "orientation": "up" },
                { "x": 1880, "y": 955, "orientation": "up" },
                { "x": 1930, "y": 955, "orientation": "up" },
                { "x": 1980, "y": 955, "orientation": "up" },
                { "x": 2030, "y": 955, "orientation": "up" },
                { "x": 2080, "y": 955, "orientation": "up" },
                { "x": 2130, "y": 955, "orientation": "up" },
                { "x": 2180, "y": 955, "orientation": "up" },

                { "x": 2100, "y": 670, "orientation": "up" },
                { "x": 2050, "y": 670, "orientation": "up" },
                { "x": 2000, "y": 670, "orientation": "up" },
                { "x": 1950, "y": 670, "orientation": "up" },
                { "x": 1900, "y": 670, "orientation": "up" },
                { "x": 1850, "y": 670, "orientation": "up" },
                { "x": 2150, "y": 670, "orientation": "up" },

                { "x": 2100, "y": 520, "orientation": "up" },
                { "x": 2050, "y": 520, "orientation": "up" },
                { "x": 2000, "y": 520, "orientation": "up" },
                { "x": 1900, "y": 520, "orientation": "up" },
                { "x": 2000, "y": 520, "orientation": "up" },
                { "x": 1950, "y": 520, "orientation": "up" },

                { "x": 2000, "y": 370, "orientation": "up" },
                { "x": 1950, "y": 370, "orientation": "up" },
                { "x": 2050, "y": 370, "orientation": "up" },


                { "x": 1780, "y": 2610, "orientation": "up" },
                { "x": 1983, "y": 2610, "orientation": "up" },

                { "x": 3710, "y": 800, "orientation": "left" },
                { "x": 4054, "y": 594, "orientation": "right" },
                { "x": 4196, "y": -1750, "orientation": "right" }
            ],
            checkpoints: [
                { "x": 6580, "y": 494 },
                { "x": 3900, "y": 1460 }
            ],
            backtrackTrigger: {},
            enemies: [
                { "startX": 3530, "startY": 2516, "endX": 3770, "endY": 2516, "speed": 1.5 },
                { "startX": 2900, "startY": 2516, "endX": 3200, "endY": 2516, "speed": 1.5 },
                { "startX": 2580, "startY": 2516, "endX": 2760, "endY": 2516, "speed": 1.5 },
                { "startX": 3000, "startY": 2723, "endX": 3190, "endY": 2723, "speed": 1.5 },
                { "startX": 3200, "startY": 2309, "endX": 3490, "endY": 2309, "speed": 1.5 },
                { "startX": 2670, "startY": 2309, "endX": 2905, "endY": 2309, "speed": 1.5 },
                { "startX": 3400, "startY": 2309, "endX": 3680, "endY": 2309, "speed": 2 },
                { "startX": 3320, "startY": 2102, "endX": 3680, "endY": 2102, "speed": 2 }
            ],
            lasers: [],
            asteriodFields: [],
            swingingHammers: [
                {
                    "pivotX": 2830,
                    "pivotY": -400,
                    "length": 200,
                    "amplitude": 50,
                    "speed": 2,
                    "phase": 0,
                    "width": 780,
                    "height": 800,
                    "spikeHeight": 200,
                    "scale": 0.3
                },

                {
                    "pivotX": 2990,
                    "pivotY": 1420,
                    "length": 200,
                    "amplitude": 50,
                    "speed": 2,
                    "phase": 0,
                    "width": 780,
                    "height": 800,
                    "spikeHeight": 200,
                    "scale": 0.3
                },

                {
                    "pivotX": 3300,
                    "pivotY": 1420,
                    "length": 200,
                    "amplitude": 50,
                    "speed": 2,
                    "phase": 0,
                    "width": 780,
                    "height": 800,
                    "spikeHeight": 200,
                    "scale": 0.3
                },

                {
                    "pivotX": 1300,
                    "pivotY": 2600,
                    "length": 200,
                    "amplitude": 50,
                    "speed": 2,
                    "phase": 0,
                    "width": 780,
                    "height": 800,
                    "spikeHeight": 200,
                    "scale": 0.3
                },

                {
                    "pivotX": 1700,
                    "pivotY": 2600,
                    "length": 200,
                    "amplitude": 50,
                    "speed": 2,
                    "phase": 0,
                    "width": 780,
                    "height": 800,
                    "spikeHeight": 200,
                    "scale": 0.3
                },

                {
                    "pivotX": 2100,
                    "pivotY": 2600,
                    "length": 200,
                    "amplitude": 50,
                    "speed": 2,
                    "phase": 0,
                    "width": 780,
                    "height": 800,
                    "spikeHeight": 200,
                    "scale": 0.3
                },
            ],
            shrinkpads: [ {x: 5160, y: 490} ],
            teleporter: [
                {"x": 1800, "y": 665, "w": 30, "h": 20},
                {"x": 4560, "y": 30, "w": 30, "h": 20}
            ],
            blackhole: [],
            goalPosition: { "x": 950, "y": 2600 },
            instructions: "",
            signs: [],
            fallDeathY: 3200
        }
    ];
    
    // Load completion progress from localStorage
    loadLevelProgress();
}

// Save and load level completion progress
function saveLevelProgress() {
    try {
        localStorage.setItem('redBallCompletedLevels', JSON.stringify(completedLevels));
    } catch (e) {
        console.error('Failed to save level progress:', e);
    }
}

function loadLevelProgress() {
    try {
        const saved = localStorage.getItem('redBallCompletedLevels');
        if (saved) {
            completedLevels = JSON.parse(saved);
            console.log('Loaded level progress:', completedLevels);
        } else {
            // First time playing - no levels completed yet
            completedLevels = [];
        }
    } catch (e) {
        console.error('Failed to load level progress:', e);
        completedLevels = [];
    }
}

function isLevelUnlocked(levelIndex) {
    // Dev Room (index 0) is always unlocked
    if (levelIndex === 0) return true;
    
    // A level is unlocked if the previous level is completed
    return completedLevels.includes(levelIndex - 1);
}

function markLevelCompleted(levelIndex) {
    if (!completedLevels.includes(levelIndex)) {
        completedLevels.push(levelIndex);
        saveLevelProgress();
        console.log(`Level ${levelIndex} marked as completed`);
    }
}

function resetLevelProgress() {
    completedLevels = [];
    saveLevelProgress();
    console.log('All level progress has been reset');
}

async function loadLevel(levelIndex) {
  // Check if level is unlocked (except when called from nextLevel which already completed previous)
  if (!isLevelUnlocked(levelIndex)) {
    console.log(`Level ${levelIndex} is locked. Complete previous levels first.`);
    return;
  }
  
  await clearLevel();
  
  currentLevel = levelIndex;
  const level = levels[currentLevel];

  console.log(`Current Level = ${currentLevel} | levels.length -> ${levels.length}`);

  if (level) {
      currentBgTheme = level.theme;
      drawTiles();

        if (difficulty === 'hard') {
            lives = 3;
        } else {
            lives = Infinity;
        }
        
        levelElapsedTime = 0;
        levelElapsedTime += savedElapsedTime;
        savedElapsedTime = 0;
        lastFrameTime = 0;
        
        // Reset goal completion state
        goalReached = false;
        goalTimer = 0;
      
        // Play level music
        playLevelMusic(level);
        
        // set the player reset spawn point based on the level on level-load
        respawnPosition[0] = level.respawnPosition[0];
        respawnPosition[1] = level.respawnPosition[1];
        
        // This is to reset the ball
        if (!ball) {
            // Creation of out fun little ball
            ball = new Sprite();
            ball.drag = 0.4;
            ball.textSize = 40;
            //ball.text = ":)";
            ball.diameter = 50;
            ball.img = ballSkinImage;
        }

        ball.x = respawnPosition[0];
        ball.y = respawnPosition[1];

        ball.color = level.ballColor;
        ball.vel.x = 0;
        ball.vel.y = 0;
        jumpCount = 0;

        // --- reset shrink state each level (module handles size + grace + touch set) ---
        if (typeof ShrinkPad !== 'undefined') {
          ShrinkPad.reset(ball);
        } else {
          // fallback if the script ever fails to load
          if (ball) {
            if (ball.baseScale == null) ball.baseScale = 1;
            ball.sizeState = 'Normal';
            ball.scale = ball.baseScale;
          }
        }
        
        // Handles ground creation
        levelObjects.ground = [];
        for (let groundData of level.ground || []) {
            let ground = new Sprite(groundData.x, groundData.y, groundData.w, groundData.h);
            ground.physics = STATIC;
            if(groundData.visible == "no")
                ground.visible = false;
            else   
                ground.visible = true;
            ground.color = 'green';
            levelObjects.ground.push(ground);
        }
        
        // Creation of platforms
        levelObjects.platforms = [];
        for (let platformData of level.platforms || []) {
            let platform = new Sprite(platformData.x, platformData.y, platformData.w, platformData.h);

            let buffer = createGraphics(platformData.w, platformData.h);
            for (let x = 0; x < platformData.w; x += platformImage.width/2) {
                for (let y = 0; y < platformData.h; y += platformImage.height) {
                    buffer.image(platformImage, x, y);
                    }
                }

                buffer.image(platformImageL, 0,0);
                buffer.image(platformImageR, platformData.w - 25, 0);
    
                // Assign tiled texture to the platform
                platform.img = buffer;

            // if (platformData.fake == 'true') {
            //     platform.physics = 'none';
            //     platform.color = platformData.color || 'orange'
            //     platform.stroke = 'black'
            //     platform.strokeWeight = 2;
            // } else {
                platform.physics = KINEMATIC;
                platform.color = platformData.color || 'orange'
                platform.speed = platformData.speed || 0;
                platform.direction = 1;
                platform.minX = platformData.minX || platformData.x - 100;
                platform.maxX = platformData.maxX || platformData.x + 100;
                platform.moving = platformData.moving || false; 
            //}
            levelObjects.platforms.push(platform);
        }
        
        // Spring creator
        levelObjects.springs = [];
        for (let springData of level.springs || []) {
            let spring = new Sprite(springData.x, springData.y, springData.w, springData.h);
            spring.physics = STATIC;

            let buffer = createGraphics(springData.w, springData.h);

            // Tile the image to fill the platform area
            for (let x = 0; x < springData.w; x += springImage.width/2) {
            for (let y = 0; y < springData.h; y += springImage.height) {
                buffer.image(springImage, x, y);
                }
            }

            buffer.image(springImageL, 0,0);
            buffer.image(springImageR, springData.w - 25, 0);

            // Assign tiled texture to the platform
            spring.img = buffer;

            //spring.color = 'cyan';
            levelObjects.springs.push(spring);
        }
        
        // Spike creator
        levelObjects.spikes = [];
        for (let spikeData of level.spikes || []) {
            let spike = new Sprite(spikeData.x, spikeData.y, 50, 10);
            spike.img = spikeImage;
            spike.collider = 'static';
            spike.physics = STATIC;
            spike.rotationLock = true;
            switch (spikeData.orientation || 'up') {
            case 'up': spike.rotation = 0; break;
            case 'down': spike.rotation = 180; break;
            case 'left': spike.rotation = 90; break;
            case 'right': spike.rotation = -90; break;
            }
            levelObjects.spikes.push(spike);
        }
        
        levelObjects.teleporter = [];
        for (let teleporterData of level.teleporter || []) {
            let teleporter = new Sprite(teleporterData.x, teleporterData.y, teleporterData.w, teleporterData.h);
            teleporter.img = teleporterImage;
            teleporter.physics = STATIC;
            teleporter.collider = "none";
            levelObjects.teleporter.push(teleporter);
        }
        
        levelObjects.laserBlasters = [];
        for (let laser of level.lasers || []) {
            let laserBlaster = new Laserbeam(laser.x, laser.y,
                                            laser.range, laser.speedData,
                                            laser.fwdDir, laserBlasterImage, ball);
            levelObjects.laserBlasters.push(laserBlaster);
        }
        
        levelObjects.asteriodFields = [];
        for (let field of level.asteriodFields || []) {
            let asteriodField = new AsteriodField(field.x, field.y, field.range,
                                                field.fallSpeed, field.burstCount,
                                                field.timeInterval, ball);
            levelObjects.asteriodFields.push(asteriodField);
        }
        
        levelObjects.blackhole = [];
        for (let blackholeData of level.blackhole || []) {
            let blackhole = new Sprite(blackholeData.x, blackholeData.y, blackholeData.w, blackholeData.h);
            blackhole.physics = STATIC;
            blackhole.collider = "none";
            blackhole.img = blackholeImage; 
            levelObjects.blackhole.push(blackhole);
        }
        
        // Creation of checkpoints
        levelObjects.checkpoints = [];
        for (let checkpointData of level.checkpoints || []) {
            let checkpoint = new CheckPoint(checkpointData.x, checkpointData.y, ball);
            levelObjects.checkpoints.push(checkpoint);
        }

        levelObjects.checkpoints.forEach(checkpoint => {
            checkpoint.setAllCheckpoints(levelObjects.checkpoints);
        });

        if (level.backtrackTrigger) {
            levelObjects.backtrackTrigger = new BacktrackTrigger(
                level.backtrackTrigger.x,
                level.backtrackTrigger.y,
                level.backtrackTrigger.w,
                level.backtrackTrigger.h,
                ball,
            );
            levelObjects.backtrackTrigger.setCheckpoints(levelObjects.checkpoints);
        }
        
        //Creation of enemies
        levelObjects.enemies = [];
        for (let enemyData of level.enemies || []) {
            let enemy = new Sprite(enemyData.startX, enemyData.startY, 50);
            enemy.img = enemyImage;
            enemy.collider = 'kinematic';
            enemy.posA = { x: enemyData.startX, y: enemyData.startY };
            enemy.posB = { x: enemyData.endX, y: enemyData.endY };
            enemy.goingToB = true;
            let dx = enemy.posB.x - enemy.posA.x;
            let dy = enemy.posB.y - enemy.posA.y;
            let distAB = sqrt(dx * dx + dy * dy);
            if (distAB > 0) {
            enemy.vel.x = (dx / distAB) * (enemyData.speed || 2);
            enemy.vel.y = (dy / distAB) * (enemyData.speed || 2);
            }
            else {
            enemy.vel.x = 0;
            enemy.vel.y = 0;
            }
            levelObjects.enemies.push(enemy);
        }

        // Disappearing platforms creator
        levelObjects.disappearingPlatforms = [];
            for (let disappearData of (level.disappearingPlatforms || [])) {
                 let disappearPlatform = new Sprite(disappearData.x, disappearData.y, disappearData.w, disappearData.h);
                 disappearPlatform.physics = STATIC;
                 disappearPlatform.collider = 'static';
                disappearPlatform.baseColor = disappearData.color || color(128, 0, 128); // Purple color
                 disappearPlatform.color = disappearPlatform.baseColor;
     
                //  let buffer = createGraphics(disappearData.w, disappearData.h);
                //  for (let x = 0; x < disappearData.w; x += platformImage.width/2) {
                //      for (let y = 0; y < disappearData.h; y += platformImage.height) {
                //          buffer.image(platformImage, x, y);
                //          }
                //      }
     
                //      buffer.image(platformImageL, 0,0);
                //      buffer.image(platformImageR, disappearData.w - 25, 0);
         
                //      // Assign tiled texture to the platform
                //      disappearPlatform.img = buffer;
                     
                //      disappearPlatform.setCollider("rectangle" , 0, 0, disappearData.w, disappearData.h);
     
     
                 disappearPlatform.isDisappearing = false;
                 disappearPlatform.isReappearing = false;
                 disappearPlatform.fadeTimer = 0;
                 disappearPlatform.playerTouched = false;
                 disappearPlatform.opacity = 255;
                 levelObjects.disappearingPlatforms.push(disappearPlatform);
             }
        
        //Creation of swinging hammer
        levelObjects.swingingHammers = [];
        for (let hammerData of level.swingingHammers || []) {
            let hammer = new Sprite(
                hammerData.pivotX, hammerData.pivotY + hammerData.length,
                hammerData.width * hammerData.scale,
                hammerData.height * hammerData.scale
            );

            hammer.img = hammerImage;
            hammer.collider = 'none';
            hammer.rotationLock = false;

            let spikeHeight = typeof hammerData.spikeHeight == 'number' ? hammerData.spikeHeight * hammerData.scale : hammerData.height * hammerData.scale * (hammerData.spikeHeight || 0.33);
            let spikeHitbox = new Sprite(
                hammerData.pivotX,
                hammerData.pivotY + hammerData.length + spikeHeight / 2,
                hammerData.width * hammerData.scale,
                spikeHeight
            );

            spikeHitbox.collider = 'kinematic'
            spikeHitbox.rotationLock = false;
            spikeHitbox.visible = false;
            levelObjects.spikes.push(spikeHitbox);
            levelObjects.swingingHammers.push({
                pivotX: hammerData.pivotX,
                pivotY: hammerData.pivotY,
                length: hammerData.length,
                amplitude: hammerData.amplitude,
                speed: hammerData.speed,
                currentAngle: hammerData.phase,
                direction: 1,
                sprite: hammer,
                spikeHitbox: spikeHitbox,
                width: hammerData.width,
                height: hammerData.height,
                spikeHeight: spikeHeight,
                scale: hammerData.scale
            });
        }

        // === Shrink pads ===
        levelObjects.shrinkpads = [];
        const pads = level.shrinkpads || [];

        for (const d of pads) {
          const pad = new Sprite(d.x, d.y, 150, 150);
          pad.collider  = 'none';
          pad.immovable = true;
          if (shrinkPadImage) pad.img = shrinkPadImage;
        
          pad.__triggerR = 40; 
        
          levelObjects.shrinkpads.push(pad);
        }

        if (!ball) {
            ball = new Sprite();
            ball.drag = 0.4;
            ball.diameter = 50;
        }

        // Apply stored skin or default to 8ball
        const skinName = level.ballSkin || '8ball';
        ball.img = ballSkins[skinName];
        ballSkinImage = ballSkins[skinName];

    }
}

function pauseObstacles() {
    levelObjects.laserBlasters?.forEach(laser => {
        laser.freeze();
    });

    levelObjects.asteriodFields?.forEach(field => {
        field.freeze();
    });
}

async function clearLevel() {
    Object.values(levelObjects).forEach(objectArray => {
        if (Array.isArray(objectArray)) {
            objectArray.forEach(obj => {
                // Check for non-sprite objects and run their
                // cleanup method
                if (obj instanceof CheckPoint) {
                    obj.dtor();
                } else if (obj instanceof BacktrackTrigger) {
                    obj.dtor();
                } else if (obj instanceof Laserbeam) {
                    obj.dtor();
                } else if (obj instanceof AsteriodField) {
                    obj.dtor();
                } else {
                    // normal sprite cleanup handling
                    if (obj.sprite) {
                        obj.sprite.remove();
                    } else if (obj.remove) {
                        obj.remove();
                    }
                }
            });
        }
    });
    
    // Clean up all tile groups (legacy system)
    if (bricksGroup) {
        bricksGroup.removeAll();
        bricksGroup = null;
    }
    if (pinkfullGroup) {
        pinkfullGroup.removeAll();
        pinkfullGroup = null;
    }
    if (pinkleftGroup) {
        pinkleftGroup.removeAll();
        pinkleftGroup = null;
    }
    if (pinkrightGroup) {
        pinkrightGroup.removeAll();
        pinkrightGroup = null;
    }
    if (texturedBrickGroup) {
        texturedBrickGroup.removeAll();
        texturedBrickGroup = null;
    }
    if (leftCornerBrickGroup) {
        leftCornerBrickGroup.removeAll();
        leftCornerBrickGroup = null;
    }
    if (rightCornerBrickGroup) {
        rightCornerBrickGroup.removeAll();
        rightCornerBrickGroup = null;
    }
    if (leftCornerBrickGroupInvert) {
        leftCornerBrickGroupInvert.removeAll();
        leftCornerBrickGroupInvert = null;
    }
    if (leftCornerBrickGroupInvert2) {
        leftCornerBrickGroupInvert2.removeAll();
        leftCornerBrickGroupInvert2 = null;
    }
    if (rightCornerBrickGroupInvert) {
        rightCornerBrickGroupInvert.removeAll();
        rightCornerBrickGroupInvert = null;
    }
    if (rightCornerBrickGroupInvert2) {
        rightCornerBrickGroupInvert2.removeAll();
        rightCornerBrickGroupInvert2 = null;
    }
    
    // Clean up optimized tile system using the helper function
    if (typeof cleanupTileSystem === 'function') {
        cleanupTileSystem();
    }
    
    // Reset tile-related flags and variables
    tiles = null;
    
    levelObjects = {};
    await new Promise(resolve => setTimeout(resolve, 1));
    currentBgTheme = 'null';
}

function nextLevel() {
    // Mark current level as completed before moving on
    markLevelCompleted(currentLevel);
    
    if (currentLevel < levels.length - 1) {
        console.log("Moving to next Level");
        loadLevel(currentLevel + 1);
    } else {
        console.log("YOU WINNN!!!!!!!!!!!! WOWW!!!!!");
    }
}

let goalReached = false;
let celebrationPlay = false;
let goalTimer = 0;
const GOAL_DELAY = 30; // frame handeller lol

function checkLevelCompletion() {
    const level = levels[currentLevel];
    if (ball && level.goalPosition) {
        let distance = dist(ball.x, ball.y, level.goalPosition.x, level.goalPosition.y);
        if (distance < 60) {
            if (!goalReached) {
                // Trigger the celebration if first time reaching goal to prevent spam
                goalTimer = 0;
                goalReached = true;
                celebrationPlay = true;
                
                // Play win sound
                if (winSound && winSound.isLoaded()) {
                    winSound.setVolume(globalVolume * 0.5);
                    winSound.play();
                }
                
                // Confetti spawn 
                spawnConfetti(level.goalPosition.x, level.goalPosition.y, 150);
            }
            
            // Frame count
            goalTimer++;
            if (goalTimer >= GOAL_DELAY) {
                goalReached = false;
                goalTimer = 0;
                nextLevel();
            }
        }
    }
}


// Only for Node-based unit tests
if (typeof module !== 'undefined') {
  module.exports = {
    initializeLevels,
    loadLevel,
    clearLevel,
    nextLevel,
    checkLevelCompletion
  };
}