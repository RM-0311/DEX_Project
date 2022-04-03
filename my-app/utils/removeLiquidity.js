import { Contract, providers, utils, BigNumber } from "ethers";
import {
    EXCHANGE_CONTRACT_ADDRESS,
    EXCHANGE_CONTRACT_ABI,
} from "../constants";

/**
 * removeLiquidity: Remove the 'removeLPTokenWei' amount of LP tokens from 
 * liquidity and also the calculated amount of 'ether' and 'CD' tokens
 */
export const removeLiquidity = async (signer, removeLPTokenWei) => {
    const exchangeContract = new Contract(
        EXCHANGE_CONTRACT_ADDRESS,
        EXCHANGE_CONTRACT_ABI,
        signer
    );
    const tx = await exchangeContract.removeLiquidity(removeLPTokenWei);
    await tx.wait();
};

/** 
 * getTokensAfterRemove: Calculates the amount of 'Ether' and 'CD' tokens
 * that would be returned back to the user after he removes 'removeLPTokenWei' amount
 * of LP tokens from the contract
 */
export const getTokensAfterRemove = async (
    provider,
    removeLPTokenWei,
    _ethBalance,
    cryptoDevTokenReserve
) => {
    try {
        const exchangeContract = new Contract(
            EXCHANGE_CONTRACT_ADDRESS,
            EXCHANGE_CONTRACT_ABI,
            provider
        );
        // Get the total supply of 'CD LP' tokens
        const _totalSupply = await exchangeContract.totalSupply();
        // Here we are using Bignumber methods of multiplication and div
        // The amount of ether that would be sent back after he withdraws 
        // is calculated based on a ratio
        // Maintain a ratio for the 'CD' tokens as well
        const _removeEther = _ethBalance
            .mul(removeLPTokenWei)
            .div(_totalSupply);
        const _removeCD = cryptoDevTokenReserve
            .mul(removeLPTokenWei)
            .div(_totalSupply);
        return {
            _removeEther,
            _removeCD,
        };
    } catch (err) {
        console.error(err);
    }
};