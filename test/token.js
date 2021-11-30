const WrappedKMO = artifacts.require("WrappedKMO");

const { constants, expectRevert, send, expectEvent, ether, BN } = require('@openzeppelin/test-helpers');
const { expect, use } = require('chai');

contract('WrappedKMO', ([owner, bridge, user]) => {
  let token;

  beforeEach('setup', async () => {
    token = await WrappedKMO.new();
  });

  it('init check', async () => {
    expect(await token.name()).equals('wKMO');
    expect(await token.symbol()).equals('wKMO');
    expect((await token.totalSupply()).toString()).equals(web3.utils.toWei('0'));
    expect((await token.balanceOf(owner)).toString()).equals(web3.utils.toWei('0'));
    expect((await token.hasRole(Buffer.from('\x01'), owner)));
  });

  it('mint check', async () => {
    await expectRevert(token.mint(user, web3.utils.toWei('100'), {from: owner}), 'revert AccessControl');
    await expectRevert(token.mint(user, web3.utils.toWei('100'), {from: user}), 'revert AccessControl');
    await expectRevert(token.mint(user, web3.utils.toWei('100'), {from: bridge}), 'revert AccessControl');

    await token.grantRole(await token.BRIDGE_ROLE(), bridge);

    await expectRevert(token.mint(user, web3.utils.toWei('100'), {from: owner}), 'revert AccessControl');
    await expectRevert(token.mint(user, web3.utils.toWei('100')), 'revert AccessControl');

    await token.mint(user, web3.utils.toWei('100'), {from: bridge});

    expect((await token.totalSupply()).toString()).equals(web3.utils.toWei('100'));
    expect((await token.balanceOf(user)).toString()).equals(web3.utils.toWei('100'));
  });

  it('burn check', async () => {
    await expectRevert(token.burn(web3.utils.toWei('100'), {from: owner}), 'is missing role 0x08fb31c3e81624356c3314088aa971b73bcc82d22bc3e3b184b4593077ae3278');
    await expectRevert(token.burn(web3.utils.toWei('100'), {from: user}), 'is missing role 0x08fb31c3e81624356c3314088aa971b73bcc82d22bc3e3b184b4593077ae3278');
    await expectRevert(token.burn(web3.utils.toWei('100'), {from: bridge}), 'is missing role 0x08fb31c3e81624356c3314088aa971b73bcc82d22bc3e3b184b4593077ae3278');

    await token.grantRole(await token.BRIDGE_ROLE(), bridge);

    await expectRevert(token.mint(user, web3.utils.toWei('100'), {from: owner}), 'is missing role 0x08fb31c3e81624356c3314088aa971b73bcc82d22bc3e3b184b4593077ae3278');
    await expectRevert(token.mint(user, web3.utils.toWei('100')), 'revert AccessControl');

    await token.mint(bridge, web3.utils.toWei('100'), {from: bridge});
    await token.burn(web3.utils.toWei('100'), {from: bridge});

    expect((await token.totalSupply()).toString()).equals(web3.utils.toWei('0'));
    expect((await token.balanceOf(bridge)).toString()).equals(web3.utils.toWei('0'));
  });
});
