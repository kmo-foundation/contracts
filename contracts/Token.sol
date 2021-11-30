// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract WrappedKMO is ERC20, AccessControl {
  bytes32 public constant BRIDGE_ROLE = keccak256("BRIDGE");

  constructor() ERC20("wKMO", "wKMO") {
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
  }

  function mint(address to, uint256 amount) public onlyRole(BRIDGE_ROLE) {
    _mint(to, amount);
    require(totalSupply() <= 100_000_000e18);
  }

  function burn(uint256 amount) public onlyRole(BRIDGE_ROLE) {
    _burn(_msgSender(), amount);
  }
}
