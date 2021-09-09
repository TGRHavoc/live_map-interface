import { getSeed } from "./Chance";


module.exports = async () => {
    const seed = getSeed();
    // eslint-disable-next-line
    console.log(`\n\nUsing Chance Seed: ${seed}\n`);
}
