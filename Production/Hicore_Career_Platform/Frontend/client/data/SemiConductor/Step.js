export const Step1= [

    
  {
    "type": "heading",
    "level": 2,
    "text": "Silicon Ingot Growth"
  },
  {
    "type": "paragraph",
    "text": "Silicon ingot growth is the first step in semiconductor manufacturing, where high-purity silicon is transformed into a large cylindrical crystal called an ingot. This crystal is then sliced into thin wafers for chip fabrication."
  },
  {
    "type": "image",
    //"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Silicon_single_crystal.jpg/640px-Silicon_single_crystal.jpg",
    "alt": "Silicon Single Crystal Ingot"
  },
  {
    "type": "heading",
    "level": 3,
    "text": "Objective"
  },
  {
    "type": "paragraph",
    "text": "The goal is to produce monocrystalline silicon ingots with minimal impurities and defects for optimal electrical performance."
  },
  {
    "type": "heading",
    "level": 3,
    "text": "Process Overview"
  },
  {
    "type": "ordered-list",
    "items": [
      "Start with high-purity polysilicon as raw material.",
      "Load polysilicon into a quartz crucible.",
      "Heat until molten (around 1420\u00b0C).",
      "Dip a seed crystal into the melt and slowly pull upwards while rotating.",
      "Grow a single crystal ingot using the Czochralski method.",
      "Cool the crystal slowly to prevent internal stress."
    ]
  },
  {
    "type": "quote",
    "text": "The Czochralski process was invented by Jan Czochralski in 1916 and is still used in most chip fabrication facilities today."
  },
  {
    "type": "code",
    "language": "plaintext",
    "content": "Ingot Growth Parameters:\nTemperature: ~1420\u00b0C\nPull Rate: 1-3 mm/min\nRotation: Seed and crucible rotate in opposite directions"
  },
  {
    "type": "note",
    "text": "Defect-free silicon crystals are essential to maintain chip performance and reduce yield loss during fabrication."
  },
  {
    "type": "table",
    "headers": [
      "Property",
      "Value"
    ],
    "rows": [
      [
        "Crystal Type",
        "Monocrystalline"
      ],
      [
        "Diameter",
        "100mm \u2013 300mm"
      ],
      [
        "Purity",
        "99.9999999% (9N)"
      ],
      [
        "Process",
        "Czochralski (CZ)"
      ]
    ]
  },
  {
    "type": "banner",
    "title": "Why It Matters",
    "desc": "All further manufacturing steps rely on the quality of the starting silicon wafer. Impurities or dislocations introduced here may cause catastrophic failures in final chips."
  },
  {
    "type": "callout",
    "color": "border-green-500",
    "title": "Fun Fact",
    "content": "300mm wafers produce ~2.5x more chips per wafer than 200mm ones, drastically improving throughput."
  },
  {
    "type": "collapsible",
    "title": "Common Challenges in Ingot Growth",
    "content": "Dislocations, impurities from crucible, stress-induced cracking, and oxygen contamination are common issues manufacturers need to monitor and control."
  },
  {
    "type": "divider"
  },
  {
    "type": "link",
    "text": "Read more on Wikipedia",
    //"href": "https://en.wikipedia.org/wiki/Czochralski_process"
  },
  {
    "type": "spacer",
    "size": "30px"
  }



]

export const Step2=[
  {
    "type": "heading",
    "level": 2,
    "text": "Wafer Slicing and Polishing"
  },
  {
    "type": "paragraph",
    "text": "Thin slices of silicon (wafers) are cut from the ingot using a diamond saw."
  },
  {
    "type": "paragraph",
    "text": "Wafers are then polished to create a smooth, defect-free surface."
  },
  {
    "type": "image",
    //"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Silicon_wafer.jpg/640px-Silicon_wafer.jpg",
    "alt": "Wafer Slicing and Polishing"
  },
  {
    "type": "note",
    "text": "Wafer Slicing and Polishing is a critical step for ensuring high chip quality and yield."
  },
  {
    "type": "divider"
  }
]

export const Step3=[
  {
    "type": "heading",
    "level": 2,
    "text": "Wafer Cleaning"
  },
  {
    "type": "paragraph",
    "text": "Wafers are cleaned to remove particles, organic, and metallic contaminants."
  },
  {
    "type": "paragraph",
    "text": "Cleaning processes include RCA clean, HF dip, and DI water rinse."
  },
  {
    "type": "image",
    //"src": "https://www.researchgate.net/profile/Sungho-Park-4/publication/301621741/figure/fig1/AS:669349720633345@1536601514422/Wafer-cleaning-process.png",
    "alt": "Wafer Cleaning Process"
  },
  {
    "type": "note",
    "text": "Wafer Cleaning is a critical step for ensuring high chip quality and yield."
  },
  {
    "type": "divider"
  }
]

 export const Step4= [
  {
    "type": "heading",
    "level": 2,
    "text": "Thermal Oxidation"
  },
  {
    "type": "paragraph",
    "text": "A silicon dioxide layer is formed on the wafer surface by exposing it to oxygen at high temperature."
  },
  {
    "type": "paragraph",
    "text": "This layer acts as an insulator and protects the silicon underneath."
  },
  {
    "type": "image",
    //"src": "https://upload.wikimedia.org/wikipedia/commons/f/f6/Oxidation_furnace.png",
    "alt": "Thermal Oxidation Furnace"
  },
  {
    "type": "note",
    "text": "Thermal Oxidation is a critical step for ensuring high chip quality and yield."
  },
  {
    "type": "divider"
  }
]

export const Step5=[
  {
    "type": "heading",
    "level": 2,
    "text": "Photolithography"
  },
  {
    "type": "paragraph",
    "text": "A light-sensitive photoresist is applied to the wafer."
  },
  {
    "type": "paragraph",
    "text": "UV light is used through a mask to define circuit patterns."
  },
  {
    "type": "image",
    //"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Stepper.jpg/640px-Stepper.jpg",
    "alt": "Photolithography Stepper"
  },
  {
    "type": "note",
    "text": "Photolithography is a critical step for ensuring high chip quality and yield."
  },
  {
    "type": "divider"
  }
]

export const Step6=[
  {
    "type": "heading",
    "level": 2,
    "text": "Etching"
  },
  {
    "type": "paragraph",
    "text": "Material is selectively removed from the wafer using plasma (dry) or chemicals (wet)."
  },
  {
    "type": "paragraph",
    "text": "Etching follows the photolithography pattern to create structures."
  },
  {
    "type": "image",
   // "src": "https://upload.wikimedia.org/wikipedia/commons/1/10/Etch_chamber.png",
    "alt": "Etching Equipment"
  },
  {
    "type": "note",
    "text": "Etching is a critical step for ensuring high chip quality and yield."
  },
  {
    "type": "divider"
  }
]


 export const Step7=[
  {
    "type": "heading",
    "level": 2,
    "text": "Ion Implantation"
  },
  {
    "type": "paragraph",
    "text": "Ions are accelerated and implanted into silicon to change its electrical properties."
  },
  {
    "type": "paragraph",
    "text": "This step defines n-type or p-type regions in the silicon."
  },
  {
    "type": "image",
    //"src": "https://upload.wikimedia.org/wikipedia/commons/5/54/Ion_implanter.png",
    "alt": "Ion Implanter"
  },
  {
    "type": "note",
    "text": "Ion Implantation is a critical step for ensuring high chip quality and yield."
  },
  {
    "type": "divider"
  }
]


 export const Step8=[
  {
    "type": "heading",
    "level": 2,
    "text": "Thin Film Deposition"
  },
  {
    "type": "paragraph",
    "text": "Materials are deposited in thin layers on the wafer."
  },
  {
    "type": "paragraph",
    "text": "Common techniques include CVD, PVD, and ALD."
  },
  {
    "type": "image",
   // "src": "https://upload.wikimedia.org/wikipedia/commons/8/88/ALD_deposition_chamber.jpg",
    "alt": "Deposition Chamber"
  },
  {
    "type": "note",
    "text": "Thin Film Deposition is a critical step for ensuring high chip quality and yield."
  },
  {
    "type": "divider"
  }
]


 export const Step9=[
  {
    "type": "heading",
    "level": 2,
    "text": "Chemical Mechanical Planarization (CMP)"
  },
  {
    "type": "paragraph",
    "text": "This process polishes the wafer surface using a chemical slurry and mechanical pad."
  },
  {
    "type": "paragraph",
    "text": "It ensures flatness for subsequent layers."
  },
  {
    "type": "image",
    //"src": "https://upload.wikimedia.org/wikipedia/commons/4/45/CMP_equipment.png",
    "alt": "CMP Equipment"
  },
  {
    "type": "note",
    "text": "Chemical Mechanical Planarization (CMP) is a critical step for ensuring high chip quality and yield."
  },
  {
    "type": "divider"
  }
]


 export const Step10=[
  {
    "type": "heading",
    "level": 2,
    "text": "Metallization"
  },
  {
    "type": "paragraph",
    "text": "Metal layers are deposited to connect transistors and other components."
  },
  {
    "type": "paragraph",
    "text": "Aluminum or copper is used, followed by patterning."
  },
  {
    "type": "image",
   // "src": "https://upload.wikimedia.org/wikipedia/commons/b/bc/Copper_interconnect.jpg",
    "alt": "Metal Interconnects"
  },
  {
    "type": "note",
    "text": "Metallization is a critical step for ensuring high chip quality and yield."
  },
  {
    "type": "divider"
  }
]


 export const Step11=[
  {
    "type": "heading",
    "level": 2,
    "text": "Wafer Testing (Probe Test)"
  },
  {
    "type": "paragraph",
    "text": "Each chip is electrically tested while still on the wafer."
  },
  {
    "type": "paragraph",
    "text": "Probe cards touch bond pads to measure functionality."
  },
  {
    "type": "image",
    //"src": "https://upload.wikimedia.org/wikipedia/commons/f/f2/Wafer_test.jpg",
    "alt": "Wafer Probing"
  },
  {
    "type": "note",
    "text": "Wafer Testing (Probe Test) is a critical step for ensuring high chip quality and yield."
  },
  {
    "type": "divider"
  }
]



export const Step12=[
  {
    "type": "heading",
    "level": 2,
    "text": "Dicing"
  },
  {
    "type": "paragraph",
    "text": "The wafer is cut into individual dies using a diamond saw or laser."
  },
  {
    "type": "paragraph",
    "text": "Each die becomes a separate integrated circuit."
  },
  {
    "type": "image",
    //"src": "https://upload.wikimedia.org/wikipedia/commons/d/df/Wafer_dicing.jpg",
    "alt": "Wafer Dicing"
  },
  {
    "type": "note",
    "text": "Dicing is a critical step for ensuring high chip quality and yield."
  },
  {
    "type": "divider"
  }
]



 export const Step13=[
  {
    "type": "heading",
    "level": 2,
    "text": "Packaging and Final Testing"
  },
  {
    "type": "paragraph",
    "text": "Dies are mounted into packages and connected via wire bonding or flip-chip."
  },
  {
    "type": "paragraph",
    "text": "Final testing ensures the packaged chip meets specifications before shipment."
  },
  {
    "type": "image",
    //"src": "https://upload.wikimedia.org/wikipedia/commons/6/60/Chip_packaging.jpg",
    "alt": "Chip Packaging"
  },
  {
    "type": "note",
    "text": "Packaging and Final Testing is a critical step for ensuring high chip quality and yield."
  },
  {
    "type": "divider"
  }
]

