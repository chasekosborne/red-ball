const LEVELS = [
    {
         name: "Dev Room",
        theme: "space",
        respawnPosition: [500, 150],
        ballColor: 'red',
        music: 'land', // Land.mp3 for Level 3
        platforms: [],
        disappearingPlatforms: [],
        ground: [{ "x": 450, "y": 390, "w": 580, "h": 20 }],
        springs: [],
        spikes: [],
        checkpoints: [{ "x": 260, "y": 340 }],
        enemies: [],
        lasers: [],
        asteriodFields: [],
        swingingHammers: [],
        shrinkpads: [{ x: 460, y: 620 }],
        teleporter: [],
        blackhole: [],
        goalPosition: { x: 1900, y: 300 },
        instructions: "",
        signs: [],
    },

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
            { x: 225, y: 220, text: "Welcome to Epsilon's Greatest Ball! Use the arrow keys to move left/right", size: 8, color: 'black' },
            { x: 600, y: 200, text: "Press space to jump. Double jump by pressing space twice in order to avoid these!", size: 10, color: 'black' },
            { x: 1250, y: 300, text: "Jump onto the spring to launch yourself in the air!", size: 10, color: 'black' },
            { x: 1600, y: -90, text: "This checkpoint allows you to respawn here after you die.", size: 10, color: 'black' },
            { x: 1875, y: -140, text: "Double jump over this hazard and land on the moving platform!", size: 10, color: 'black' },
            { x: 2900, y: -130, text: "Use the teleporter to bypass this wall.", size: 10, color: 'black' },
            { x: 3900, y: -140, text: "Go quickly across this platform! It starts disappearing after you touch it!", size: 12, color: 'black' },
            { x: 4700, y: -170, text: "Congratulations! You will encounter more obstacles as you go along, and check the How To Play menu if you ever forget anything!", size: 12, color: 'black' },
        ]
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

        goalPosition: { x: 5400, y: -1050 },

        instructions: "",

        signs: [],
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
            { x: 950, y: 390, w: 100, h: 20 },
            { x: 1260, y: 390, w: 80, h: 20 },
        ],

        ground: [
            { x: 450, y: 390, w: 580, h: 20 },
            { x: 1650, y: 390, w: 220, h: 20 },
            { x: 2260, y: 70, w: 680, h: 20 },
            { x: 2600, y: 360, w: 20, h: 600 },
            { x: 2790, y: 260, w: 20, h: 400 },
            { x: 3260, y: 650, w: 1300, h: 20 },
            { x: 3190, y: 620, w: 20, h: 40 },
            { x: 3550, y: 620, w: 20, h: 40 },
            { x: 4100, y: 260, w: 180, h: 20 },
            { x: 4560, y: 260, w: 800, h: 20, },
            { x: 5090, y: 260, w: 260, h: 20 },
        ],

        springs: [
            { x: 1800, y: 390, w: 80, h: 20 },
            { x: 3720, y: 630, w: 80, h: 20 }
        ],

        spikes: [
            { x: 2640, y: 615, orientation: "up" },
            { x: 2880, y: 615, orientation: "up" },
            { x: 3120, y: 615, orientation: "up" }
        ],

        checkpoints: [
            { x: 1660, y: 360 },
            { x: 2730, y: 610 },
        ],

        enemies: [
            { startX: 3240, startY: 615, endX: 3520, endY: 615, speed: 1 },
        ],

        lasers: [
            { x: 820, y: 140, range: 300, speedData: { speed: 3, bulletSpeed: 8 }, fwdDir: DOWN },
            { x: 1100, y: 140, range: 320, speedData: { speed: 3, bulletSpeed: 8 }, fwdDir: DOWN },
            { x: 1400, y: 140, range: 320, speedData: { speed: 3, bulletSpeed: 8 }, fwdDir: DOWN },
            { x: 1680, y: -60, range: 300, speedData: { speed: 3, bulletSpeed: 8 }, fwdDir: RIGHT },
            { x: 2900, y: -60, range: 300, speedData: { speed: 3, bulletSpeed: 8 }, fwdDir: LEFT },
            { x: 3020, y: 340, range: 360, speedData: { speed: 3, bulletSpeed: 8 }, fwdDir: DOWN },
            { x: 3360, y: 340, range: 360, speedData: { speed: 3, bulletSpeed: 8 }, fwdDir: DOWN },
        ],

        asteriodFields: [
            { x: 4580, y: -300, range: 600, fallSpeed: 4, burstCount: 4, timeInterval: 3 }
        ],

        swingingHammers: [],
        teleporter: [],
        blackhole: [
            { x: 1950, y: 250, w: 20, h: 20 },
            { x: 3685, y: 250, w: 80, h: 20 },
        ],
        goalPosition: { x: 5180, y: 180 },
        instructions: ""
    },

    {
        name: "Level 3",
        theme: "sky",
        respawnPosition: [ 500, 150 ],
        ballColor: "red",
        music: "land",
        platforms: [
          { x: 2540, y: -900, w: 100, h: 20, color: 'orange', moving: true, speed: 2.2, minX: 2540, maxX: 3520 },
        ],
        disappearingPlatforms: [
            { "x": 4415, "y": -1820, "w": 550, "h": 20 }
        ],
        ground: [
            { "x": 530, "y": 400, "w": 1300, "h": 20 }, //1
            { "x": -110, "y": 240, "w": 20, "h": 300 }, //2 
            { "x": 70, "y": 100, "w": 340, "h": 20 },   //3
            { "x": 250, "y": 220, "w": 20, "h": 260 },  //4
            { "x": 1680, "y": 190, "w": 280, "h": 20 }, //5
            { "x": 2680, "y": 350, "w": 1120, "h": 20 },//6
            { "x": 2490, "y": 160, "w": 740, "h": 20 }, //7
            { "x": 3380, "y": 160, "w": 760, "h": 20 }, //8
            { "x": 2319, "y": -40, "w": 360, "h": 20 }, //9
            { "x": 3180, "y": -40, "w": 1160, "h": 20 },  //10
            { "x": 2860, "y": -240, "w": 1440, "h": 20 }, //11
            { "x": 3750, "y": -340, "w": 20, "h": 1020 }, //12
            { "x": 2130, "y": -430, "w": 20, "h": 1200 },
            { "x": 2600, "y": -430, "w": 920, "h": 20 },
            { "x": 2200, "y": -670, "w": 120, "h": 20 },
            { "x": 3900, "y": -840, "w": 450, "h": 20 },
            { "x": 3860, "y": -1470, "w": 20, "h": 1000 },
            { "x": 4130, "y": -1330, "w": 20, "h": 1000 },
            { "x": 3920, "y": -1020, "w": 100, "h": 20 },
            { "x": 4070, "y": -1220, "w": 100, "h": 20 },
            { "x": 3920, "y": -1420, "w": 100, "h": 20 },
            { "x": 4070, "y": -1620, "w": 100, "h": 20 },
            { "x": 5730, "y": -1820, "w": 840, "h": 20 },
            { "x": 5000, "y": -1965, "w": 2300, "h": 20 },
            { "x": 6140, "y": -1892, "w": 20, "h": 165 },
            { "x": 2985, "y": -1040, "w": 1730, "h": 20 },
            { "x": 3230, "y": 255, "w": 20, "h": 210 }
        ],
        springs: [
            { "x": 5000, "y": -1600, "w": 150, "h": 20 }
        ],
        spikes: [
            { "x": 1565, "y": 155, "orientation": "up" },
            { "x": 1796, "y": 155, "orientation": "up" },
            { "x": 3995, "y": -875, "orientation": "up" },
            { "x": 3894, "y": -1072, "orientation": "left" },
            { "x": 4096, "y": -1272, "orientation": "right" },
            { "x": 3894, "y": -1472, "orientation": "left" },
            { "x": 4096, "y": -1672, "orientation": "right" },
            { "x": 4096, "y": -1770, "orientation": "right" }
        ],
        checkpoints: [
            { "x": 3840, "y": -875 },
            { "x": 5500, "y": -1855 }
        ],
        enemies: [
            { "startX": 3120, "startY": 124, "endX": 3670, "endY": 124, "speed": 1.5 },
            { "startX": 2580, "startY": 124, "endX": 2720, "endY": 124, "speed": 1.5 },
            { "startX": 2180, "startY": 124, "endX": 2540, "endY": 124, "speed": 1.5 },
            { "startX": 2730, "startY": 315, "endX": 2900, "endY": 315, "speed": 1.5 },
            { "startX": 3160, "startY": -76, "endX": 3290, "endY": -76, "speed": 1.5 },
            { "startX": 2970, "startY": -76, "endX": 3105, "endY": -76, "speed": 1.5 },
            { "startX": 3400, "startY": -76, "endX": 3680, "endY": -76, "speed": 2 },
            { "startX": 3250, "startY": -276, "endX": 3550, "endY": -276, "speed": 2 }
        ],
        lasers: [],
        asteriodFields: [],
        swingingHammers: [
            {
                "pivotX": 2670,
                "pivotY": -950,
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
        shrinkpads: [{ x: 6000, y: -1860 }],
        teleporter: [],
        blackhole: [],
        goalPosition: { "x": 75, "y": 250 },
        instructions: "",
        signs: []
        }

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
        name: "Dev Room",
        theme: "space",
        respawnPosition: [150, 200],
        ballColor: 'red',
        music: 'land', // Land.mp3 for Level 3
        platforms: [],
        disappearingPlatforms: [],
        ground: [],
        springs: [],
        spikes: [],
        checkpoints: [{ "x": 90, "y": 430}],
        enemies: [],
        lasers: [],
        asteriodFields: [],
        swingingHammers: [],
        shrinkpads: [{ x: 460, y: 620 }],
        teleporter: [],
        blackhole: [],
        goalPosition: { x: 3000, y: 250 },
        instructions: "",
        signs: [],
        },

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
                { "x": 60, "y": 235, "w": 20, "h": 190}
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
              { x: 225, y: 220, text: "Welcome to Epsilon's Greatest Ball! Use the arrow keys to move left/right", size: 8, color: 'black' },
              { x: 600, y: 200, text: "Press space to jump. Double jump by pressing space twice in order to avoid these!", size: 10, color: 'black' },
              { x: 1250, y: 300, text: "Jump onto the spring to launch yourself in the air!", size: 10, color: 'black' },
              { x: 1600, y: -90, text: "This checkpoint allows you to respawn here after you die.", size: 10, color: 'black' },
              { x: 1875, y: -140, text: "Double jump over this hazard and land on the moving platform!", size: 10, color: 'black' },
              { x: 2900, y: -130, text: "Use the teleporter to bypass this wall.", size: 10, color: 'black' },
              { x: 3900, y: -140, text: "Go quickly across this platform! It starts disappearing after you touch it!", size: 12, color: 'black' },
              { x: 4700, y: -170, text: "Congratulations! You will encounter more obstacles as you go along, and check the How To Play menu if you ever forget anything!", size: 12, color: 'black' },
            ]
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

            goalPosition: { x: 5400, y: -1050 }, 

            instructions: "",

            signs: [],
        },

        {
          name: "Level 2",
          theme: "space",
          respawnPosition: [500,150],
          ballColor: 'red',
          ballSkin: '8ball',
          music: 'odyssey', // Odyssey.mp3 for Level 2
          platforms: [],

          disappearingPlatforms: [
            {x: 950,y: 390,w: 100,h: 20},
            {x: 1260,y: 390,w: 80,h: 20},
          ],

          ground: [
            {x: 450,  y: 390, w: 580,   h: 20},
            {x: 1650, y: 390, w: 220,   h: 20},
            {x: 2260, y: 70,  w: 680,   h: 20},
            {x: 2600, y: 360, w:  20,   h: 600},
            {x: 2790, y: 260, w:  20,   h: 400},
            {x: 3260, y: 650, w:  1300, h: 20},
            {x: 3190, y: 620, w:  20,   h: 40},
            {x: 3550, y: 620, w:  20,   h: 40},
            {x: 4100, y: 260, w:  180,  h: 20},
            {x: 4560, y: 260, w:  800,  h:20,},
            {x: 5090, y: 260, w:  260,  h: 20},
          ],
        
          springs: [
            {x: 1800,y: 390,w: 80,h: 20},
            {x: 3720,y: 630,w: 80,h: 20}
          ],
        
          spikes: [
            {x: 2640,y: 615,orientation:"up"},
            {x: 2880,y: 615,orientation:"up"},
            {x: 3120,y: 615,orientation:"up"}
          ],
        
          checkpoints: [
            {x: 1660,y: 360},
            {x: 2730,y: 610},
          ],
        
          enemies: [
            {startX: 3240,startY: 615,endX: 3520,endY: 615,speed: 1},
          ],
          
          lasers: [
            {x: 820,  y: 140, range: 300, speedData:  {speed: 3,bulletSpeed: 8},fwdDir:DOWN},
            {x: 1100, y: 140, range: 320, speedData: {speed: 3,bulletSpeed: 8},fwdDir: DOWN},
            {x: 1400, y: 140, range: 320, speedData: {speed: 3,bulletSpeed: 8},fwdDir: DOWN},
            {x: 1680, y: -60, range: 300, speedData: {speed: 3,bulletSpeed: 8},fwdDir: RIGHT},
            {x: 2900, y: -60, range: 300, speedData: {speed: 3,bulletSpeed: 8},fwdDir: LEFT},
            {x: 3020, y: 340, range: 360, speedData: {speed: 3,bulletSpeed: 8},fwdDir: DOWN},
            {x: 3360, y: 340, range: 360, speedData: {speed: 3,bulletSpeed: 8},fwdDir: DOWN},
          ],

          asteriodFields: [
                { x: 4580, y: -300, range: 600, fallSpeed: 4, burstCount: 4, timeInterval: 3 }
          ],

          swingingHammers: [],
          teleporter: [],
          blackhole: [
            { x: 1950,y: 250,  w: 20,  h: 20 },
            { x: 3685,y: 250,  w: 80,  h: 20 },
          ],
          goalPosition:  { x: 5180, y: 180 },
          instructions: ""
        },

        {
        name: "Level 3",
        theme: "sky",
        respawnPosition: [ 500, 150 ],
        ballColor: "red",
        music: "land",
        platforms: [
          { x: 2540, y: -900, w: 100, h: 20, color: 'orange', moving: true, speed: 2.2, minX: 2540, maxX: 3520 },
        ],
        disappearingPlatforms: [
            { "x": 4415, "y": -1820, "w": 550, "h": 20 }
        ],
        ground: [
            { "x": 530, "y": 400, "w": 1300, "h": 20 }, //1
            { "x": -110, "y": 240, "w": 20, "h": 300 }, //2 
            { "x": 70, "y": 100, "w": 340, "h": 20 },   //3
            { "x": 250, "y": 220, "w": 20, "h": 260 },  //4
            { "x": 1680, "y": 190, "w": 280, "h": 20 }, //5
            { "x": 2680, "y": 350, "w": 1120, "h": 20 },//6
            { "x": 2490, "y": 160, "w": 740, "h": 20 }, //7
            { "x": 3380, "y": 160, "w": 760, "h": 20 }, //8
            { "x": 2319, "y": -40, "w": 360, "h": 20 }, //9
            { "x": 3180, "y": -40, "w": 1160, "h": 20 },  //10
            { "x": 2860, "y": -240, "w": 1440, "h": 20 }, //11
            { "x": 3750, "y": -340, "w": 20, "h": 1020 }, //12
            { "x": 2130, "y": -430, "w": 20, "h": 1200 },
            { "x": 2600, "y": -430, "w": 920, "h": 20 },
            { "x": 2200, "y": -670, "w": 120, "h": 20 },
            { "x": 3900, "y": -840, "w": 450, "h": 20 },
            { "x": 3860, "y": -1470, "w": 20, "h": 1000 },
            { "x": 4130, "y": -1330, "w": 20, "h": 1000 },
            { "x": 3920, "y": -1020, "w": 100, "h": 20 },
            { "x": 4070, "y": -1220, "w": 100, "h": 20 },
            { "x": 3920, "y": -1420, "w": 100, "h": 20 },
            { "x": 4070, "y": -1620, "w": 100, "h": 20 },
            { "x": 5730, "y": -1820, "w": 840, "h": 20 },
            { "x": 5000, "y": -1965, "w": 2300, "h": 20 },
            { "x": 6140, "y": -1892, "w": 20, "h": 165 },
            { "x": 2985, "y": -1040, "w": 1730, "h": 20 },
            { "x": 3230, "y": 255, "w": 20, "h": 210 }
        ],
        springs: [
            { "x": 5000, "y": -1600, "w": 150, "h": 20 }
        ],
        spikes: [
            { "x": 1565, "y": 155, "orientation": "up" },
            { "x": 1796, "y": 155, "orientation": "up" },
            { "x": 3995, "y": -875, "orientation": "up" },
            { "x": 3894, "y": -1072, "orientation": "left" },
            { "x": 4096, "y": -1272, "orientation": "right" },
            { "x": 3894, "y": -1472, "orientation": "left" },
            { "x": 4096, "y": -1672, "orientation": "right" },
            { "x": 4096, "y": -1770, "orientation": "right" }
        ],
        checkpoints: [
            { "x": 3840, "y": -875 },
            { "x": 5500, "y": -1855 }
        ],
        enemies: [
            { "startX": 3120, "startY": 124, "endX": 3670, "endY": 124, "speed": 1.5 },
            { "startX": 2580, "startY": 124, "endX": 2720, "endY": 124, "speed": 1.5 },
            { "startX": 2180, "startY": 124, "endX": 2540, "endY": 124, "speed": 1.5 },
            { "startX": 2730, "startY": 315, "endX": 2900, "endY": 315, "speed": 1.5 },
            { "startX": 3160, "startY": -76, "endX": 3290, "endY": -76, "speed": 1.5 },
            { "startX": 2970, "startY": -76, "endX": 3105, "endY": -76, "speed": 1.5 },
            { "startX": 3400, "startY": -76, "endX": 3680, "endY": -76, "speed": 2 },
            { "startX": 3250, "startY": -276, "endX": 3550, "endY": -276, "speed": 2 }
        ],
        lasers: [],
        asteriodFields: [],
        swingingHammers: [
            {
                "pivotX": 2670,
                "pivotY": -950,
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
        shrinkpads: [{ x: 6000, y: -1860 }],
        teleporter: [],
        blackhole: [],
        goalPosition: { "x": 75, "y": 250 },
        instructions: "",
        signs: []
        }
        
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
    ];
}

async function loadLevel(levelIndex) {
  await clearLevel();
  
  currentLevel = levelIndex;
  const level = levels[currentLevel];

  console.log(`Current Level = ${currentLevel} | levels.length -> ${levels.length}`);

  if (level) {
      currentBgTheme = level.theme || BG_SKY;

        if (difficulty === 'hard') {
            lives = 3;
        } else {
            lives = Infinity;
        }
        
        levelElapsedTime = 0;
        levelElapsedTime += savedElapsedTime;
        savedElapsedTime = 0;
        lastFrameTime = 0;
      
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
            ground.color = 'green';
            levelObjects.ground.push(ground);
        }
        
        // Creation of platforms
        levelObjects.platforms = [];
        for (let platformData of level.platforms || []) {
            let platform = new Sprite(platformData.x, platformData.y, platformData.w, platformData.h);

            if (platformData.fake == 'true') {
                platform.physics = 'none';
                platform.color = platformData.color || 'orange'
                platform.stroke = 'black'
                platform.strokeWeight = 2;
            } else {
                platform.physics = KINEMATIC;
                platform.color = platformData.color || 'orange'
                platform.speed = platformData.speed || 0;
                platform.direction = 1;
                platform.minX = platformData.minX || platformData.x - 100;
                platform.maxX = platformData.maxX || platformData.x + 100;
                platform.moving = platformData.moving || false; 
            }
            levelObjects.platforms.push(platform);
        }
        
        // Spring creator
        levelObjects.springs = [];
        for (let springData of level.springs || []) {
            let spring = new Sprite(springData.x, springData.y, springData.w, springData.h);
            spring.physics = STATIC;
            spring.color = 'cyan';
            levelObjects.springs.push(spring);
        }

        // Disappearing platforms creator
        levelObjects.disappearingPlatforms = [];
        for (let disappearData of (level.disappearingPlatforms || [])) {
            let disappearPlatform = new Sprite(disappearData.x, disappearData.y, disappearData.w, disappearData.h);
            disappearPlatform.physics = STATIC;
            disappearPlatform.baseColor = disappearData.color || color(128, 0, 128); // Purple color
            disappearPlatform.color = disappearPlatform.baseColor;
            disappearPlatform.isDisappearing = false;
            disappearPlatform.isReappearing = false;
            disappearPlatform.fadeTimer = 0;
            disappearPlatform.playerTouched = false;
            disappearPlatform.opacity = 255;
            levelObjects.disappearingPlatforms.push(disappearPlatform);
        }
        
        // Spike creator
        levelObjects.spikes = [];
        for (let spikeData of level.spikes || []) {
            let spike = new Sprite(spikeData.x, spikeData.y, 50, 50);
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
        
        //Creation of enemies
        levelObjects.enemies = [];
        for (let enemyData of level.enemies || []) {
            let enemy = new Sprite(enemyData.startX, enemyData.startY, 50);
            enemy.color = 'gray';
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
    if (bricksGroup) {
    if (Tiles) {
        Tiles.removeSprites();
    }
    bricksGroup.removeSprites();
    }

    bricksGroup = null;
    tiles = null;
    levelObjects = {};
    await new Promise(resolve => setTimeout(resolve, 1));
}

function nextLevel() {
    if (currentLevel < levels.length - 1) {
        console.log("Moving to next Level");
        loadLevel(currentLevel + 1);
    } else {
        console.log("YOU WINNN!!!!!!!!!!!! WOWW!!!!!");
    }
}

function checkLevelCompletion() {
    const level = levels[currentLevel];
    if (ball && level.goalPosition) {
        let distance = dist(ball.x, ball.y, level.goalPosition.x, level.goalPosition.y);
        if (distance < 60) {
            nextLevel();
        }
    }
}