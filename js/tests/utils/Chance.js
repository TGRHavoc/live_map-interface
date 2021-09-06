/* istanbul ignore file */

import Chance from "chance";

const getSeed = () => {
    if (!process.env.CHANCE_SEED) {
        const seedGenerator = new Chance();
        process.env.CHANCE_SEED = seedGenerator.hash();
    }
    return process.env.CHANCE_SEED;
};

const getChance = () => {
    return new Chance(getSeed());
};

const chance = getChance();

export {
    getSeed,
    getChance,
    chance
};

export default chance;
