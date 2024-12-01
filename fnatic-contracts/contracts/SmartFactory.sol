// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IPoolManager} from "@uniswap/v4-core/contracts/interfaces/IPoolManager.sol";
import {IDynamicFeeManager} from "@uniswap/v4-core/contracts/interfaces/IDynamicFeeManager.sol";
import {Hooks} from "@uniswap/v4-core/contracts/libraries/Hooks.sol";
import {FeeLibrary} from "@uniswap/v4-core/contracts/libraries/FeeLibrary.sol";
import {BaseHook} from "v4-periphery/BaseHook.sol";
import {PoolKey} from "@uniswap/v4-core/contracts/types/PoolKey.sol";
import {Smartly} from "./Smartly.sol";
import {VolatilityOracle} from "./VolatilityOracle";

contract SmartFactory {
    function deploy(
        VolatilityOracle volatilityOracle,
        IPoolManager poolManager,
        bytes32 salt
    ) external returns (address) {
        Smartly smartly = new Smartly{salt: salt}(poolManager);
        smartly.initialize(volatilityOracle);
        return address(smartly);
    }

    // function getPrecomputedHookAddress(
    //     address owner,
    //     IPoolManager pm,
    //     bytes32 salt
    // ) external view returns (address) {
    //     bytes32 bytecodeHash = keccak256(
    //         abi.encodePacked(type(Smartly).creationCode, abi.encode(owner, pm))
    //     );
    //     bytes32 hash = keccak256(
    //         abi.encodePacked(bytes1(0xff), address(this), salt, bytecodeHash)
    //     );
    //     return address(uint160(uint256(hash)));
    // }
}
