const { expect } = require("chai");

describe("Shat contract", () => {
  let Token;
  let hardhatToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async () => {
    Token = await ethers.getContractFactory("Token");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    hardhatToken = await Token.deploy();
  });

  describe("Deployment", async () => {
    it("it should set the right owner", async () => {
      expect(await hardhatToken.owner()).to.equal(owner.address);
    });
    it("it should be assign the total supply of token to the owner", async () => {
      const ownerBalance = await hardhatToken.balanceOf(owner.address);
      expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("Should trasfer tokens between accounts", async function () {
      //owner account to addr1.address
      await hardhatToken.transfer(addr1.address, 5);
      const addr1Balance = await hardhatToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(5);
      //addr1.address to addr2.address
      await hardhatToken.connect(addr1).transfer(addr2.address, 5);
      const addr2Balance = await hardhatToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(5);
    });

    it("Should fail if sender does not have enough tokens", async function () {
      const initialOwnerBalance = await hardhatToken.balanceOf(owner.address); //10000
      await expect(
        hardhatToken.connect(addr1).transfer(owner.address, 1) //initially - 0 tokens addr1
      ).to.be.revertedWith("Not enough balance");
      expect(await hardhatToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    it("Should update balances after transfer", async () => {
      const initialOwnerBalance = await hardhatToken.balanceOf(owner.address); //10000
      await hardhatToken.transfer(addr1.address, 5);
      await hardhatToken.transfer(addr2.address, 5);

      const finalOwnerBalance = await hardhatToken.balanceOf(owner.address); //10000
      expect(finalOwnerBalance).to.equal(initialOwnerBalance - 10);

      const addr1Balance = await hardhatToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(5);

      const add2Balance = await hardhatToken.balanceOf(addr2.address);
      expect(add2Balance).to.equal(5);
    });
  });
});
