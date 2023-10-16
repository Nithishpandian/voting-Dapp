async function main() {
  const [deployer] = await ethers.getSigners();

  // console.log("Deploying contracts with the account:", deployer.address);

  const voting = await ethers.deployContract("Voting");

  console.log("Voting(contract) address:", await voting.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// contract address: 0xf7D9AF3fd13840f5835d5C2705268059757520DC