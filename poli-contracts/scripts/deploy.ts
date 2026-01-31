import { ethers } from "hardhat";

async function main() {
    console.log("Deploying PredictionMarket contract...");

    // Get the USDC token address from environment
    const usdcAddress = process.env.USDC_ADDRESS_MUMBAI || process.env.USDC_ADDRESS_POLYGON;

    if (!usdcAddress) {
        throw new Error("USDC address not found in environment variables");
    }

    console.log("Using USDC address:", usdcAddress);

    // Deploy the contract
    const PredictionMarket = await ethers.getContractFactory("PredictionMarket");
    const predictionMarket = await PredictionMarket.deploy(usdcAddress);

    await predictionMarket.waitForDeployment();

    const address = await predictionMarket.getAddress();
    console.log("PredictionMarket deployed to:", address);

    // Wait for a few block confirmations
    console.log("Waiting for block confirmations...");
    await predictionMarket.deploymentTransaction()?.wait(5);

    console.log("\n✅ Deployment complete!");
    console.log("\nNext steps:");
    console.log("1. Update the contract address in poli-frontend/lib/contracts/addresses.ts");
    console.log("2. Verify the contract on Polygonscan:");
    console.log(`   npx hardhat verify --network <network> ${address} ${usdcAddress}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
