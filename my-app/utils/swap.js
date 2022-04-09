import { Contract } from "ethers";
import {
    EXCHANGE_CONTRACT_ABI,
    EXCHANGE_CONTRACT_ADDRESS,
    TOKEN_CONTRACT_ABI,
    TOKEN_CONTRACT_ADDRESS,
} from "../constants";

/*
    getAmountOfTokensReceivedFromSwap: Returns the number of Eth/Crypto Dev tokens that can be received when the user swaps '_swapAmountWEI' amount of Eth/Crypto Dev tokens.
*/
export const getAmountOfTokensReceivedFromSwap = async (
    _swapAmountWei,
    provider,
    ethSelected,
    ethBalance,
    reservedCD
) => {
    // Create a new instance of teh exchange contract
    const exchangeContract = new Contract(
        EXCHANGE_CONTRACT_ADDRESS,
        EXCHANGE_CONTRACT_ABI,
        provider
    );
    let amountOfTokens;
    // If Eth is selected this means our input value is 'ETH' which means our input amount would be
    // '_swapAmountWei', the input reserve would be the 'ethBalance' of the contract and output reserve
    // would be the 'Crypto Dev Token' reserve
    if (ethSelected) {
        amountOfTokens = await exchangeContract.getAmountOfTokens(
            _swapAmountWei,
            ethBalance,
            reservedCD
        );
    } else {
        // If Eth is not selected this means our input value is CD token and our input amount would be
        // '_swapAmountWei', the input reserve would be 'CD token' reserve of the contract and output reserve
        // would be the 'ethBalance'
        amountOfTokens = await exchangeContract.getAmountOfTokens(
            _swapAmountWei,
            reservedCD,
            ethBalance
        );
    }

    return amountOfTokens;
};