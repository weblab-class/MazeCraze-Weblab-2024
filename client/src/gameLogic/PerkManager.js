const activatedPerks = []

const availablePerks = [
    "Scared Coins", // Coins move around
    "Vanishing Walls", // Walls vanish every couple seconds
    "Faster Hunter", // Hunter update interval halves
]

const addPerk = (perk) => {
    if(!availablePerks[perk]){ // Check if the perk is not available
        return false; // Return false to signify perk is not available to add
    }
    
    activatedPerks.append(perk);
    availablePerks.splice(availablePerks.indexOf(perk));
}

exports.modules = {
    activatedPerks,
    availablePerks,
    addPerk
}