import { Contract, utils } from "ethers";
import {
    EXCHANGE_CONTRACT_ADDRESS,
    EXCHANGE_CONTRACT_ABI,
    TOKEN_CONTRACT_ADDRESS,
    TOKEN_CONTRACT_ABI,
} from "../constants";

/**
 * addLiquidity helps add liquidity to the exchange,
 * If the user is adding initial liquidity, user decides the ether and CD tokens he wants to add
 * to the exchange. If he is adding the liquidity after initial liquidity has already been add
 * then we calculate the cd tokens he can add given the eth he wants to add by keeping the ratios 
 * constant
 */
export const addLiquidity = async (
    signer,
    addCDAmountWei,
    addEtherAmountWei
) => {
    try {
        // new instance of the token contract
        const tokenContract = new Contract(
            TOKEN_CONTRACT_ADDRESS,
            TOKEN_CONTRACT_ABI,
            signer
        );
        // create a new instance of the exchange contract
        const exchangeContract = new Contract(
            EXCHANGE_CONTRACT_ADDRESS,
            EXCHANGE_CONTRACT_ABI,
            signer
        );
        // Because CD tokens are an ERC20, user would need to give the contract allowance
        // to take the required number CD tokens out of his contract
        let tx = await tokenContract.approve(
            EXCHANGE_CONTRACT_ADDRESS,
            addCDAmountWei.toSting()
        );
        await tx.wait();
        // After the contract has the approval, add the ether and cd tokens in the liquidity
        tx = await exchangeContract.addLiquidity(addCDAmountWei, {
            value: addEtherAmountWei,
        });
        await tx.wait();
    } catch (err) {
        console.error(err);
    }
};

/**
 * calculateCD calculates the CD tokens that need to be added to the liquidity
 * given '_addEtherAmountWei' amount of ether
 */
export const calculateCD = async (
    _addEther = "0",
    etherBalanceContract,
    cdTokenReserve
) => {
    // '_addEther' is a sting, we need to convert it to a BigNumber before we can do our calculations
    // We do that using 'parseEther' function from 'ether.js'
    const _addEtherAmountWei = utils.parseEther(_addEther);
    // Ratio needs to be maintained when we add liquidity
    const cryptoDevTokenAmount = _addEtherAmountWei
        .mul(cdTokenReserve)
        .div(etherBalanceContract);
    return cryptoDevTokenAmount;
};